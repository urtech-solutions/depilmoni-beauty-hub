import { NextResponse } from "next/server";

import {
  OrderItemSchema,
  calculateOrderPricing,
  calculateXP,
  mercadoPagoAdapter,
  mockRepositories,
  resolveLevel,
  validateCoupon,
  type Coupon,
  type CustomerProfile,
  type OrderItem,
  type Promotion,
  type XPLevel
} from "@depilmoni/core";
import { z } from "zod";

import { mapAddress } from "@/lib/account-mappers";
import { payloadAdminFetch } from "@/lib/payload-admin";
import {
  getServerSession,
  payloadServerFetch,
  type PayloadDoc,
  type PayloadListResponse
} from "@/lib/payload-server";

export const runtime = "nodejs";

const BodySchema = z.object({
  items: z.array(OrderItemSchema).min(1, "O carrinho está vazio"),
  addressId: z.string().optional(),
  couponCode: z
    .string()
    .optional()
    .transform((value) => (value ? value.trim().toUpperCase() : undefined)),
  shippingAmount: z.number().nonnegative().default(0),
  shippingMethodId: z.string().optional(),
  paymentMethod: z.enum(["credit-card", "pix"]),
  attendeeName: z.string().optional()
});

type PayloadCoupon = PayloadDoc & {
  code: string;
  discountType: Coupon["discountType"];
  value: number;
  active: boolean;
  startsAt: string;
  endsAt: string;
  minPurchase?: number;
  currentUses?: number;
  maxUses?: number;
  eligibleProfiles?: Coupon["eligibleProfiles"];
  eligibleTags?: { value: string }[];
};

const mapCoupon = (doc: PayloadCoupon): Coupon => ({
  id: String(doc.id),
  code: doc.code,
  discountType: doc.discountType,
  value: Number(doc.value ?? 0),
  minPurchase: typeof doc.minPurchase === "number" ? doc.minPurchase : undefined,
  active: Boolean(doc.active),
  startsAt: doc.startsAt,
  endsAt: doc.endsAt,
  combinableWithPromotions: true,
  combinableWithFidelity: true,
  maxUses: typeof doc.maxUses === "number" ? doc.maxUses : undefined,
  currentUses: Number(doc.currentUses ?? 0),
  eligibleProfiles: doc.eligibleProfiles ?? [],
  eligibleTags: Array.isArray(doc.eligibleTags)
    ? doc.eligibleTags.map((tag) => tag.value)
    : []
});

const fetchCoupon = async (code: string, token: string): Promise<Coupon | null> => {
  const encoded = encodeURIComponent(code);
  const result = await payloadServerFetch<PayloadListResponse<PayloadCoupon>>(
    `/api/coupons?where[code][equals]=${encoded}&limit=1`,
    token
  );
  return result.docs[0] ? mapCoupon(result.docs[0]) : null;
};

const fetchXpLevels = async (token: string): Promise<XPLevel[]> => {
  const result = await payloadServerFetch<PayloadListResponse<PayloadDoc>>(
    "/api/xp-levels?limit=50&sort=minXP",
    token
  );
  return result.docs.map((doc) => ({
    id: String(doc.id),
    level: Number(doc.level ?? 0),
    name: String(doc.name ?? ""),
    minXP: Number(doc.minXP ?? 0),
    benefits: Array.isArray(doc.benefits)
      ? (doc.benefits as { label?: string }[]).map((b) => b.label ?? "")
      : []
  }));
};

const buildCustomerForPricing = (
  customerId: string,
  profileType: CustomerProfile["profileType"],
  tags: string[]
): CustomerProfile => ({
  id: customerId,
  name: "",
  email: "",
  role: "authenticated-customer",
  profileType,
  distributorStatus: "none",
  tags,
  fidelityTagIds: [],
  xpBalance: 0,
  levelId: "",
  benefitsUnlocked: [],
  orderIds: [],
  ticketIds: []
});

const createId = (prefix: string) =>
  `${prefix}_${Math.random().toString(36).slice(2, 10)}`;

const toRelationId = (value: string | number | undefined) => {
  if (value === undefined || value === null) return undefined;
  const asNumber = Number(value);
  return Number.isFinite(asNumber) && String(asNumber) === String(value) ? asNumber : value;
};

const resolveSkuFromItem = (item: OrderItem): string => {
  if (item.type === "product") {
    const variant = mockRepositories
      .listVariants()
      .find((candidate) => candidate.id === item.variantId);
    return variant?.sku ?? item.variantId;
  }
  return `TICKET-${item.batchId}`;
};

export async function POST(request: Request) {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json({ error: "Sessão expirada" }, { status: 401 });
  }

  const parsed = BodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message ?? "Dados do checkout inválidos" },
      { status: 400 }
    );
  }

  const body = parsed.data;
  const customerId = String(session.customer.id);
  const profileType = session.user.profileType;
  const customerTags = session.user.tags;

  try {
    if (body.addressId) {
      const addressDoc = await payloadServerFetch<PayloadDoc>(
        `/api/addresses/${body.addressId}`,
        session.token
      );
      const address = mapAddress(addressDoc);
      if (address.customerId !== customerId) {
        return NextResponse.json({ error: "Endereço inválido" }, { status: 403 });
      }
    }

    const coupon = body.couponCode ? await fetchCoupon(body.couponCode, session.token) : null;
    const pricingCustomer = buildCustomerForPricing(customerId, profileType, customerTags);

    const priceBreakdown = calculateOrderPricing(body.items, {
      customer: pricingCustomer,
      coupon: coupon ?? undefined,
      fidelityTag: undefined,
      promotions: mockRepositories.listPromotions(),
      products: mockRepositories.listProducts(),
      variants: mockRepositories.listVariants(),
      events: mockRepositories.listEvents()
    });

    if (coupon) {
      const couponValidation = validateCoupon({
        coupon,
        customer: { profileType, tags: customerTags },
        subtotal: priceBreakdown.subtotal
      });
      if (!couponValidation.valid) {
        return NextResponse.json(
          { error: couponValidation.message, reason: couponValidation.reason },
          { status: 400 }
        );
      }
    }

    const totalWithShipping = Number(
      (priceBreakdown.itemTotal + body.shippingAmount).toFixed(2)
    );

    const paymentResult = await mercadoPagoAdapter.charge({
      amount: totalWithShipping,
      method: body.paymentMethod
    });

    if (paymentResult.status !== "approved") {
      return NextResponse.json(
        { error: "Pagamento recusado pelo provedor", code: "payment_rejected" },
        { status: 402 }
      );
    }

    const activePromotions = mockRepositories
      .listPromotions()
      .filter((promotion: Promotion) => promotion.active);
    const xpEarned = calculateXP({
      orderTotal: totalWithShipping,
      activePromotions
    });

    const orderCode = `DPM-${createId("o").slice(-6).toUpperCase()}`;

    const orderDoc = await payloadServerFetch<PayloadDoc | { doc: PayloadDoc }>(
      "/api/orders",
      session.token,
      {
        method: "POST",
        body: JSON.stringify({
          customer: toRelationId(customerId),
          code: orderCode,
          status: "paid",
          items: body.items,
          subtotal: priceBreakdown.subtotal,
          profileDiscount: priceBreakdown.profileDiscount,
          fidelityDiscount: priceBreakdown.fidelityDiscount,
          promotionDiscount: priceBreakdown.promotionDiscount,
          couponDiscount: priceBreakdown.couponDiscount,
          couponCode: coupon?.code,
          shippingAmount: body.shippingAmount,
          shippingAddress: toRelationId(body.addressId),
          total: totalWithShipping,
          paymentMethod: body.paymentMethod,
          paymentExternalId: paymentResult.transactionId,
          xpEarned
        })
      }
    );

    const orderId =
      "doc" in (orderDoc as Record<string, unknown>)
        ? String((orderDoc as { doc: PayloadDoc }).doc.id)
        : String((orderDoc as PayloadDoc).id);

    // Operações privilegiadas (token admin) — XP, inventário, cupom, notificações
    try {
      if (coupon) {
        await payloadAdminFetch(`/api/coupons/${coupon.id}`, {
          method: "PATCH",
          body: JSON.stringify({
            currentUses: (coupon.currentUses ?? 0) + 1
          })
        });
      }

      await payloadAdminFetch("/api/xp-transactions", {
        method: "POST",
        body: JSON.stringify({
          customer: toRelationId(customerId),
          amount: xpEarned,
          source: "order-paid",
          referenceId: orderId,
          description: `Pedido ${orderCode}`
        })
      });

      for (const item of body.items) {
        const sku = resolveSkuFromItem(item);
        await payloadAdminFetch("/api/inventory-movements", {
          method: "POST",
          body: JSON.stringify({
            sku,
            type: "sale",
            quantity: item.quantity,
            order: toRelationId(orderId),
            changedBy: toRelationId(customerId),
            note: `Venda ${orderCode}`
          })
        });
      }

      const previousXpBalance = Number(session.customer.xpBalance ?? 0);
      const newXpBalance = previousXpBalance + xpEarned;
      const levels = await fetchXpLevels(session.token);
      const { level, leveledUp } = resolveLevel(newXpBalance, previousXpBalance, levels);

      await payloadAdminFetch(`/api/customers/${customerId}`, {
        method: "PATCH",
        body: JSON.stringify({
          xpBalance: newXpBalance,
          ...(level ? { level: toRelationId(level.id) } : {}),
          ...(level ? { benefitsUnlocked: level.benefits.map((value) => ({ value })) } : {})
        })
      });

      await payloadAdminFetch("/api/notifications", {
        method: "POST",
        body: JSON.stringify({
          customer: toRelationId(customerId),
          type: "xp-earned",
          title: "Você ganhou XP",
          message: `Pedido ${orderCode} rendeu ${xpEarned} XP.`,
          href: `/minha-conta/pedidos/${orderId}`
        })
      });

      if (leveledUp && level) {
        await payloadAdminFetch("/api/notifications", {
          method: "POST",
          body: JSON.stringify({
            customer: toRelationId(customerId),
            type: "level-up",
            title: `Novo nível: ${level.name}`,
            message: `Parabéns! Você atingiu o nível ${level.name}.`,
            href: "/minha-conta/experiencia"
          })
        });
      }

      return NextResponse.json({
        order: {
          id: orderId,
          code: orderCode,
          total: totalWithShipping,
          xpEarned,
          leveledUp,
          level: level?.name ?? null
        },
        pricing: priceBreakdown,
        installments: mercadoPagoAdapter.installments(totalWithShipping)
      });
    } catch (postError) {
      // Pedido já foi criado; registros auxiliares falharam. Retorna com aviso.
      return NextResponse.json(
        {
          order: {
            id: orderId,
            code: orderCode,
            total: totalWithShipping,
            xpEarned: 0,
            leveledUp: false,
            level: null
          },
          pricing: priceBreakdown,
          installments: mercadoPagoAdapter.installments(totalWithShipping),
          warning:
            postError instanceof Error
              ? postError.message
              : "Pedido confirmado, mas XP/estoque não foram atualizados."
        },
        { status: 207 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Falha ao processar checkout" },
      { status: 400 }
    );
  }
}
