import type { Payload, TypedUser } from "payload";

import type {
  Coupon,
  Customer,
  DistributorRequest,
  Order,
  Product,
  Promotion,
  XpTransaction
} from "../payload-types";

import { adminCache } from "./admin-cache";
import { getPayloadInstance } from "./payload";

const DASHBOARD_TTL_SECONDS = 60 * 5;
const LOW_STOCK_DEFAULT_THRESHOLD = 5;

type CustomerSummary = {
  id: number | string;
  name: string;
  email: string;
  profileType: Customer["profileType"];
  totalSpent: number;
  orderCount: number;
  xpBalance: number;
};

type OrderSummary = {
  id: number | string;
  code: string;
  customerName: string;
  total: number;
  status: string;
  createdAt: string | null;
};

type LowStockItem = {
  productId: number | string;
  productName: string;
  variantName: string;
  sku: string;
  stock: number;
  reorderLevel: number;
};

type OfferSummary = {
  id: number | string;
  title: string;
  kind: "promotion" | "coupon";
  statusLabel: string;
  startsAt: string | null;
  endsAt: string | null;
};

type DistributorSummary = {
  id: number | string;
  companyName: string;
  responsibleName: string;
  city: string;
  state: string;
  createdAt: string | null;
};

export type AdminDashboardMetrics = {
  generatedAt: string;
  totals: {
    customers: number;
    orders: number;
    paidOrders: number;
    totalRevenue: number;
    currentMonthRevenue: number;
    averageTicket: number;
    pendingDistributorRequests: number;
  };
  topCustomers: CustomerSummary[];
  latestOrders: OrderSummary[];
  lowStockItems: LowStockItem[];
  activeOffers: OfferSummary[];
  pendingDistributorRequests: DistributorSummary[];
};

export type XPRankingItem = {
  rank: number;
  customerId: number | string;
  customerName: string;
  customerEmail: string;
  profileType: Customer["profileType"];
  xpEarned: number;
  transactionCount: number;
};

const isOrderPaid = (status: Order["status"] | null | undefined) =>
  Boolean(status && ["paid", "processing", "shipped", "delivered"].includes(status));

const isWithinRange = (value: string | null | undefined, start: Date, end: Date) => {
  if (!value) return false;
  const parsed = new Date(value);
  return !Number.isNaN(parsed.getTime()) && parsed >= start && parsed <= end;
};

const getMonthStart = () => {
  const start = new Date();
  start.setDate(1);
  start.setHours(0, 0, 0, 0);
  return start;
};

const getNow = () => new Date();

const formatMoney = (value: number) => Number(value.toFixed(2));

const collectActiveOffers = (
  promotions: Promotion[],
  coupons: Coupon[],
  referenceDate: Date
): OfferSummary[] => {
  const offers: OfferSummary[] = [];

  for (const promotion of promotions) {
    const startsAt = promotion.startsAt ?? null;
    const endsAt = promotion.endsAt ?? null;
    const activeWindow =
      (!startsAt || new Date(startsAt) <= referenceDate) &&
      (!endsAt || new Date(endsAt) >= referenceDate);

    if (!promotion.active || !activeWindow) continue;

    offers.push({
      id: promotion.id,
      title: promotion.name,
      kind: "promotion",
      statusLabel: "Ativa",
      startsAt,
      endsAt
    });
  }

  for (const coupon of coupons) {
    const startsAt = coupon.startsAt ?? null;
    const endsAt = coupon.endsAt ?? null;
    const activeWindow =
      (!startsAt || new Date(startsAt) <= referenceDate) &&
      (!endsAt || new Date(endsAt) >= referenceDate);

    if (!coupon.active || !activeWindow) continue;

    offers.push({
      id: coupon.id,
      title: coupon.code,
      kind: "coupon",
      statusLabel: coupon.maxUses
        ? `${coupon.currentUses ?? 0}/${coupon.maxUses} usos`
        : "Uso livre",
      startsAt,
      endsAt
    });
  }

  return offers
    .sort((left, right) => {
      const leftStart = left.startsAt ? new Date(left.startsAt).getTime() : 0;
      const rightStart = right.startsAt ? new Date(right.startsAt).getTime() : 0;
      return rightStart - leftStart;
    })
    .slice(0, 10);
};

const mapOrderSummary = (order: Order): OrderSummary => ({
  id: order.id,
  code: order.code,
  customerName:
    typeof order.customer === "object" && order.customer
      ? order.customer.name
      : "Cliente",
  total: Number(order.total ?? 0),
  status: String(order.status ?? "pending"),
  createdAt: order.createdAt ?? null
});

const mapDistributorSummary = (request: DistributorRequest): DistributorSummary => ({
  id: request.id,
  companyName: request.companyName,
  responsibleName: request.responsibleName,
  city: request.commercialAddress?.city ?? "",
  state: request.commercialAddress?.state ?? "",
  createdAt: request.createdAt ?? null
});

const buildTopCustomers = (customers: Customer[], orders: Order[]): CustomerSummary[] => {
  const totalsByCustomer = new Map<string, { totalSpent: number; orderCount: number }>();

  for (const order of orders) {
    if (!isOrderPaid(order.status)) continue;

    const customerId =
      typeof order.customer === "object" && order.customer ? String(order.customer.id) : String(order.customer);
    const current = totalsByCustomer.get(customerId) ?? { totalSpent: 0, orderCount: 0 };
    current.totalSpent += Number(order.total ?? 0);
    current.orderCount += 1;
    totalsByCustomer.set(customerId, current);
  }

  return customers
    .map((customer) => {
      const totals = totalsByCustomer.get(String(customer.id)) ?? {
        totalSpent: 0,
        orderCount: 0
      };

      return {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        profileType: customer.profileType,
        totalSpent: formatMoney(totals.totalSpent),
        orderCount: totals.orderCount,
        xpBalance: Number(customer.xpBalance ?? 0)
      };
    })
    .sort((left, right) => {
      if (right.totalSpent !== left.totalSpent) {
        return right.totalSpent - left.totalSpent;
      }

      return right.xpBalance - left.xpBalance;
    })
    .slice(0, 10);
};

const buildLowStockItems = (products: Product[]): LowStockItem[] =>
  products
    .flatMap((product) =>
      (product.variants ?? []).flatMap((variant) => {
        const stock = Number(variant.stock ?? 0);
        const reorderLevel = Number(variant.reorderLevel ?? LOW_STOCK_DEFAULT_THRESHOLD);

        if (stock > reorderLevel) {
          return [];
        }

        return [
          {
            productId: product.id,
            productName: product.name,
            variantName: variant.name,
            sku: variant.sku,
            stock,
            reorderLevel
          }
        ];
      })
    )
    .sort((left, right) => left.stock - right.stock)
    .slice(0, 10);

const fetchAll = async <T>(payload: Payload, collection: Parameters<Payload["find"]>[0]["collection"]) => {
  const result = await payload.find({
    collection,
    depth: 1,
    limit: 200,
    sort: "-createdAt",
    overrideAccess: true
  });

  return result.docs as T[];
};

export const getAdminDashboardMetrics = async (options?: { forceFresh?: boolean }) => {
  const cacheKey = "admin:dashboard:metrics";

  if (!options?.forceFresh) {
    const cached = await adminCache.get<AdminDashboardMetrics>(cacheKey);
    if (cached) return cached;
  }

  const payload = await getPayloadInstance();
  const [customers, orders, promotions, coupons, distributorRequests, products] = await Promise.all([
    fetchAll<Customer>(payload, "customers"),
    fetchAll<Order>(payload, "orders"),
    fetchAll<Promotion>(payload, "promotions"),
    fetchAll<Coupon>(payload, "coupons"),
    fetchAll<DistributorRequest>(payload, "distributor-requests"),
    fetchAll<Product>(payload, "products")
  ]);

  const now = getNow();
  const monthStart = getMonthStart();
  const paidOrders = orders.filter((order) => isOrderPaid(order.status));
  const totalRevenue = paidOrders.reduce((sum, order) => sum + Number(order.total ?? 0), 0);
  const currentMonthRevenue = paidOrders
    .filter((order) => isWithinRange(order.createdAt, monthStart, now))
    .reduce((sum, order) => sum + Number(order.total ?? 0), 0);
  const averageTicket = paidOrders.length ? totalRevenue / paidOrders.length : 0;
  const pendingRequests = distributorRequests.filter(
    (request) => request.status === "pending_review"
  );

  const metrics: AdminDashboardMetrics = {
    generatedAt: now.toISOString(),
    totals: {
      customers: customers.length,
      orders: orders.length,
      paidOrders: paidOrders.length,
      totalRevenue: formatMoney(totalRevenue),
      currentMonthRevenue: formatMoney(currentMonthRevenue),
      averageTicket: formatMoney(averageTicket),
      pendingDistributorRequests: pendingRequests.length
    },
    topCustomers: buildTopCustomers(customers, orders),
    latestOrders: orders.slice(0, 10).map(mapOrderSummary),
    lowStockItems: buildLowStockItems(products),
    activeOffers: collectActiveOffers(promotions, coupons, now),
    pendingDistributorRequests: pendingRequests.slice(0, 10).map(mapDistributorSummary)
  };

  await adminCache.set(cacheKey, metrics, DASHBOARD_TTL_SECONDS);
  return metrics;
};

export const getAdminXPRanking = async (options?: {
  startDate?: string | null;
  endDate?: string | null;
  forceFresh?: boolean;
}) => {
  const normalizedStart = options?.startDate ?? "all";
  const normalizedEnd = options?.endDate ?? "all";
  const cacheKey = `admin:xp:ranking:${normalizedStart}:${normalizedEnd}`;

  if (!options?.forceFresh) {
    const cached = await adminCache.get<XPRankingItem[]>(cacheKey);
    if (cached) return cached;
  }

  const payload = await getPayloadInstance();
  const [customers, transactions] = await Promise.all([
    fetchAll<Customer>(payload, "customers"),
    fetchAll<XpTransaction>(payload, "xp-transactions")
  ]);

  const start = options?.startDate ? new Date(options.startDate) : null;
  const end = options?.endDate ? new Date(options.endDate) : null;
  const totals = new Map<string, { xpEarned: number; transactionCount: number }>();

  for (const transaction of transactions) {
    const createdAt = transaction.createdAt ? new Date(transaction.createdAt) : null;

    if (start && createdAt && createdAt < start) continue;
    if (end && createdAt && createdAt > end) continue;

    const customerId =
      typeof transaction.customer === "object" && transaction.customer
        ? String(transaction.customer.id)
        : String(transaction.customer);
    const current = totals.get(customerId) ?? { xpEarned: 0, transactionCount: 0 };
    current.xpEarned += Number(transaction.amount ?? 0);
    current.transactionCount += 1;
    totals.set(customerId, current);
  }

  const ranking = customers
    .map((customer) => {
      const aggregate = totals.get(String(customer.id)) ?? {
        xpEarned: 0,
        transactionCount: 0
      };

      return {
        customerId: customer.id,
        customerName: customer.name,
        customerEmail: customer.email,
        profileType: customer.profileType,
        xpEarned: aggregate.xpEarned,
        transactionCount: aggregate.transactionCount
      };
    })
    .filter((entry) => entry.xpEarned > 0)
    .sort((left, right) => {
      if (right.xpEarned !== left.xpEarned) {
        return right.xpEarned - left.xpEarned;
      }

      return right.transactionCount - left.transactionCount;
    })
    .slice(0, 20)
    .map((entry, index) => ({
      rank: index + 1,
      ...entry
    }));

  await adminCache.set(cacheKey, ranking, DASHBOARD_TTL_SECONDS);
  return ranking;
};

export const syncDistributorApprovalState = async ({
  payload,
  request,
  previousStatus,
  currentUser
}: {
  payload: Payload;
  request: DistributorRequest;
  previousStatus?: DistributorRequest["status"] | null;
  currentUser?: (TypedUser & { collection?: string }) | null;
}) => {
  const currentStatus = request.status ?? "pending_review";
  const customerId = Number(
    typeof request.customer === "object" && request.customer
      ? request.customer.id
      : request.customer
  );

  if (!customerId) {
    return;
  }

  if (currentStatus === previousStatus) {
    return;
  }

  if (currentStatus === "pending_review") {
    await payload.update({
      collection: "customers",
      id: customerId,
      data: {
        distributorStatus: "pending_review"
      },
      overrideAccess: true
    });

    await adminCache.delete("admin:dashboard:metrics");
    return;
  }

  if (currentStatus === "approved") {
    await payload.update({
      collection: "customers",
      id: customerId,
      data: {
        profileType: "distributor",
        distributorStatus: "approved"
      },
      overrideAccess: true
    });

    await payload.create({
      collection: "notifications",
      data: {
        customer: customerId,
        type: "distributor-approved",
        title: "Cadastro de distribuidor aprovado",
        message: "Seu perfil foi aprovado e agora conta com regras de distribuidor.",
        href: "/minha-conta/distribuidor",
        read: false
      },
      overrideAccess: true
    });
  }

  if (currentStatus === "rejected") {
    await payload.update({
      collection: "customers",
      id: customerId,
      data: {
        profileType: "client",
        distributorStatus: "rejected"
      },
      overrideAccess: true
    });

    await payload.create({
      collection: "notifications",
      data: {
        customer: customerId,
        type: "distributor-rejected",
        title: "Cadastro de distribuidor recusado",
        message:
          request.reviewNotes?.trim() ||
          "Sua solicitação foi recusada no momento. Revise os dados e tente novamente.",
        href: "/minha-conta/distribuidor",
        read: false
      },
      overrideAccess: true
    });
  }

  await adminCache.delete("admin:dashboard:metrics");
  await adminCache.delete("admin:xp:ranking:all:all");

  await payload.update({
    collection: "distributor-requests",
    id: request.id,
    data: {
      reviewedAt: request.reviewedAt ?? new Date().toISOString(),
      reviewedBy:
        request.reviewedBy ??
        (currentUser?.collection === "users" ? currentUser.id : undefined)
    },
    overrideAccess: true,
    context: {
      skipDistributorSync: true
    }
  });
};
