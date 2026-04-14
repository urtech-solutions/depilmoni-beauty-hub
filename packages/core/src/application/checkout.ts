import QRCode from "qrcode";

import type { Coupon, CustomerProfile, FidelityTag, Order, OrderItem, Ticket } from "../domain/models";
import { calculateOrderPricing } from "./pricing";
import {
  mercadoPagoAdapter,
  melhorEnvioAdapter,
  mockRedisAdapter,
  posthogAdapter,
  sentryAdapter
} from "../infrastructure/adapters";
import { mockRepositories } from "../infrastructure/repositories/mock-repositories";
import { mockDatabase } from "../infrastructure/memory/mock-database";

export type CheckoutPayload = {
  customerId: string;
  items: OrderItem[];
  couponCode?: string;
  shippingMethodId?: string;
  shippingPostalCode?: string;
  paymentMethod: "credit-card" | "pix";
  attendeeName?: string;
};

export type CheckoutResult = {
  order: Order;
  tickets: Ticket[];
  installments: { label: string; amount: number }[];
};

const createId = (prefix: string) =>
  `${prefix}_${Math.random().toString(36).slice(2, 10)}`;

const resolveCustomerContext = (customerId: string) => {
  const customer = mockRepositories.getCustomerById(customerId);

  if (!customer) {
    throw new Error("Cliente nao encontrado.");
  }

  const fidelityTag = customer.fidelityTagIds
    .map((id) => mockRepositories.getFidelityTagById(id))
    .find(Boolean) as FidelityTag | undefined;

  return { customer, fidelityTag };
};

const resolveCoupon = (couponCode?: string): Coupon | undefined =>
  couponCode ? mockRepositories.getCouponByCode(couponCode) : undefined;

const awardXP = (customer: CustomerProfile, total: number) => {
  const xpEarned = Math.floor(total);
  const database = mockDatabase.getState();

  database.xpTransactions.push({
    id: createId("xp"),
    customerId: customer.id,
    amount: xpEarned,
    source: "order-paid",
    referenceId: createId("ref"),
    createdAt: new Date().toISOString()
  });

  customer.xpBalance += xpEarned;

  const currentLevel = [...database.xpLevels]
    .sort((left, right) => left.minXP - right.minXP)
    .filter((level) => level.minXP <= customer.xpBalance)
    .at(-1);

  if (currentLevel) {
    customer.levelId = currentLevel.id;
    customer.benefitsUnlocked = currentLevel.benefits;
  }

  return xpEarned;
};

const reserveInventory = (items: OrderItem[]) => {
  const database = mockDatabase.getState();

  items.forEach((item) => {
    if (item.type === "product") {
      const variant = database.variants.find((candidate) => candidate.id === item.variantId);
      const inventory = database.inventory.find(
        (candidate) => candidate.id === variant?.inventoryId
      );

      if (!variant || !inventory) {
        throw new Error("Inventario do produto nao encontrado.");
      }

      if (inventory.quantityAvailable < item.quantity) {
        throw new Error(`Estoque insuficiente para ${variant.sku}.`);
      }

      inventory.quantityAvailable -= item.quantity;
      return;
    }

    const event = database.events.find((candidate) => candidate.id === item.eventId);
    const batch = event?.batches.find((candidate) => candidate.id === item.batchId);

    if (!event || !batch) {
      throw new Error("Lote do evento nao encontrado.");
    }

    if (batch.quantity - batch.sold < item.quantity) {
      throw new Error(`Lote ${batch.name} esgotado.`);
    }

    batch.sold += item.quantity;
    batch.status = batch.quantity - batch.sold > 0 ? "active" : "sold-out";
  });
};

const createTickets = async ({
  orderId,
  customerId,
  items,
  attendeeName
}: {
  orderId: string;
  customerId: string;
  items: OrderItem[];
  attendeeName: string;
}) => {
  const database = mockDatabase.getState();
  const generatedTickets: Ticket[] = [];

  for (const item of items) {
    if (item.type !== "event-ticket") {
      continue;
    }

    const event = database.events.find((candidate) => candidate.id === item.eventId);
    const batch = event?.batches.find((candidate) => candidate.id === item.batchId);

    if (!event || !batch) {
      throw new Error("Evento nao encontrado ao gerar ticket.");
    }

    for (let index = 0; index < item.quantity; index += 1) {
      const ticketId = createId("ticket");
      const qrPayload = JSON.stringify({ ticketId, eventId: event.id, batchId: batch.id });
      const qrCode = await QRCode.toDataURL(qrPayload);

      const ticket: Ticket = {
        id: ticketId,
        eventId: event.id,
        eventTitle: event.title,
        batchId: batch.id,
        orderId,
        customerId,
        attendeeName,
        qrCode,
        status: "confirmed",
        checkInAt: null
      };

      database.tickets.push(ticket);
      generatedTickets.push(ticket);
    }
  }

  return generatedTickets;
};

export const getShippingOptions = async (items: OrderItem[], postalCode?: string) => {
  const state = mockDatabase.getState();
  const containsPhysicalProduct = items.some((item) => item.type === "product");

  if (!containsPhysicalProduct) {
    return [
      {
        id: "digital-ticket",
        label: "Entrega digital",
        amount: 0,
        eta: "imediato por e-mail"
      }
    ];
  }

  return melhorEnvioAdapter.quote({
    postalCode,
    items,
    inventory: state.inventory
  });
};

export const runMockCheckout = async (payload: CheckoutPayload): Promise<CheckoutResult> => {
  const { customer, fidelityTag } = resolveCustomerContext(payload.customerId);
  const coupon = resolveCoupon(payload.couponCode);
  const repositories = mockRepositories;
  const shippingOptions = await getShippingOptions(payload.items, payload.shippingPostalCode);
  const selectedShipping =
    shippingOptions.find((option) => option.id === payload.shippingMethodId) ?? shippingOptions[0];

  if (!selectedShipping) {
    throw new Error("Nenhuma opcao de frete disponivel.");
  }

  const priceBreakdown = calculateOrderPricing(payload.items, {
    customer,
    coupon,
    fidelityTag,
    promotions: repositories.listPromotions(),
    products: repositories.listProducts(),
    variants: repositories.listVariants(),
    events: repositories.listEvents()
  });

  const paymentAmount = priceBreakdown.itemTotal + selectedShipping.amount;
  const paymentResult = await mercadoPagoAdapter.charge({
    amount: paymentAmount,
    method: payload.paymentMethod
  });

  if (paymentResult.status !== "approved") {
    throw new Error("Pagamento recusado pelo adapter mock.");
  }

  reserveInventory(payload.items);

  const orderId = createId("order");
  const xpEarned = awardXP(customer, paymentAmount);
  const order: Order = {
    id: orderId,
    customerId: customer.id,
    code: `DPM-${orderId.slice(-6).toUpperCase()}`,
    status: "paid",
    items: payload.items,
    subtotal: priceBreakdown.subtotal,
    profileDiscount: priceBreakdown.profileDiscount,
    fidelityDiscount: priceBreakdown.fidelityDiscount,
    promotionDiscount: priceBreakdown.promotionDiscount,
    couponDiscount: priceBreakdown.couponDiscount,
    shippingAmount: selectedShipping.amount,
    total: Number(paymentAmount.toFixed(2)),
    xpEarned,
    createdAt: new Date().toISOString()
  };

  const tickets = await createTickets({
    orderId,
    customerId: customer.id,
    items: payload.items,
    attendeeName: payload.attendeeName ?? customer.name
  });

  const database = mockDatabase.getState();
  database.orders.push(order);
  customer.orderIds.unshift(order.id);
  customer.ticketIds.unshift(...tickets.map((ticket) => ticket.id));

  mockRedisAdapter.set(`checkout:${order.id}`, order);
  posthogAdapter.capture("mock_checkout_completed", {
    customerId: customer.id,
    total: order.total,
    hasCoupon: Boolean(coupon)
  });
  sentryAdapter.captureMessage("Checkout mock concluido", { orderId: order.id });

  return {
    order,
    tickets,
    installments: mercadoPagoAdapter.installments(order.total)
  };
};
