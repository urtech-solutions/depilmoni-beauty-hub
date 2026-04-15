import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import type {
  Address,
  DistributorRequest,
  Notification,
  Order,
  XPLevel,
  XPTransaction
} from "@depilmoni/core";
import { mockRepositories } from "@depilmoni/core";

import {
  mapAddress,
  mapDistributorRequest,
  mapNotification,
  mapOrder,
  mapXPLevel,
  mapXPTransaction
} from "./account-mappers";
import { AUTH_COOKIE_NAME } from "./auth-cookie";
import {
  mapPayloadCustomerToProfile,
  payloadClient,
  type PayloadCustomer,
  type StorefrontUser
} from "./payload-client";

const PAYLOAD_URL =
  process.env.PAYLOAD_INTERNAL_URL ??
  process.env.PAYLOAD_PUBLIC_SERVER_URL ??
  "http://localhost:3001";

type PayloadDoc = Record<string, unknown> & { id: string | number };

type PayloadListResponse<T> = {
  docs: T[];
  totalDocs: number;
};

const buildUrl = (path: string) => `${PAYLOAD_URL}${path}`;

const toId = (value: string | number | PayloadDoc | null | undefined) => {
  if (!value) return "";
  if (typeof value === "object" && "id" in value) return String(value.id);
  return String(value);
};

const parseJson = async (res: Response) => {
  const text = await res.text();
  if (!text) return {};

  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
};

const payloadFetch = async <T>(
  path: string,
  token: string,
  init?: RequestInit
): Promise<T> => {
  const headers = new Headers(init?.headers);
  headers.set("Authorization", `JWT ${token}`);

  if (!(init?.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(buildUrl(path), {
    ...init,
    headers,
    cache: "no-store"
  });

  const json = await parseJson(res);

  if (!res.ok) {
    throw new Error(
      (json as { errors?: { message: string }[]; message?: string })?.errors?.[0]?.message ??
        (json as { message?: string })?.message ??
        "Falha ao consultar Payload"
    );
  }

  return json as T;
};

export const requireSession = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    redirect("/login");
  }

  const customer = await payloadClient.me(token);

  if (!customer) {
    redirect("/login");
  }

  return {
    token,
    customer,
    user: mapPayloadCustomerToProfile(customer)
  };
};

const resolveXPLevel = (user: StorefrontUser, levels: XPLevel[]) => {
  if (!levels.length) {
    const fallback = mockRepositories.listXPLevels().sort((left, right) => left.minXP - right.minXP);
    levels = fallback;
  }

  const exact = levels.find((level) => level.id === user.levelId);
  const current =
    exact ??
    [...levels]
      .sort((left, right) => left.minXP - right.minXP)
      .filter((level) => user.xpBalance >= level.minXP)
      .pop() ??
    levels[0];

  const next = levels
    .sort((left, right) => left.minXP - right.minXP)
    .find((level) => level.minXP > user.xpBalance);

  const progress = next
    ? Math.max(
        0,
        Math.min(
          100,
          ((user.xpBalance - current.minXP) / Math.max(1, next.minXP - current.minXP)) * 100
        )
      )
    : 100;

  return { level: current, nextLevel: next, progress };
};

export const getCurrentUser = async () => {
  const { user } = await requireSession();
  return user;
};

export const listAddressesForCurrentUser = async () => {
  const { token } = await requireSession();
  const result = await payloadFetch<PayloadListResponse<PayloadDoc>>("/api/addresses?limit=100&sort=-isDefault", token);
  return result.docs.map(mapAddress);
};

export const listOrdersForCurrentUser = async () => {
  const { token } = await requireSession();
  const result = await payloadFetch<PayloadListResponse<PayloadDoc>>("/api/orders?limit=100&sort=-createdAt", token);
  return result.docs.map(mapOrder);
};

export const getOrderForCurrentUser = async (id: string) => {
  const { token } = await requireSession();

  try {
    const doc = await payloadFetch<PayloadDoc>(`/api/orders/${id}`, token);
    return mapOrder(doc);
  } catch {
    return null;
  }
};

export const listXPLevels = async () => {
  try {
    const result = await fetch(buildUrl("/api/xp-levels?limit=100&sort=minXP"), {
      cache: "no-store"
    });

    if (!result.ok) {
      return mockRepositories.listXPLevels().sort((left, right) => left.minXP - right.minXP);
    }

    const json = (await parseJson(result)) as PayloadListResponse<PayloadDoc>;
    return json.docs.map(mapXPLevel);
  } catch {
    return mockRepositories.listXPLevels().sort((left, right) => left.minXP - right.minXP);
  }
};

export const listXPTransactionsForCurrentUser = async () => {
  const { token } = await requireSession();
  const result = await payloadFetch<PayloadListResponse<PayloadDoc>>(
    "/api/xp-transactions?limit=100&sort=-createdAt",
    token
  );
  return result.docs.map(mapXPTransaction);
};

export const getXPSummaryForCurrentUser = async () => {
  const user = await getCurrentUser();
  const levels = await listXPLevels();
  return {
    user,
    ...resolveXPLevel(user, levels)
  };
};

export const listNotificationsForCurrentUser = async () => {
  const { token } = await requireSession();
  const result = await payloadFetch<PayloadListResponse<PayloadDoc>>(
    "/api/notifications?limit=100&sort=-createdAt",
    token
  );
  return result.docs.map(mapNotification);
};

export const getUnreadNotificationCount = async () => {
  const notifications = await listNotificationsForCurrentUser();
  return notifications.filter((notification) => !notification.read).length;
};

export const getDistributorRequestForCurrentUser = async () => {
  const { token } = await requireSession();
  const result = await payloadFetch<PayloadListResponse<PayloadDoc>>(
    "/api/distributor-requests?limit=1&sort=-createdAt",
    token
  );

  const [doc] = result.docs;
  return doc ? mapDistributorRequest(doc) : null;
};

export const getAccountDashboard = async () => {
  const user = await getCurrentUser();
  const orders = await listOrdersForCurrentUser();
  const unreadNotifications = await getUnreadNotificationCount();
  const levels = await listXPLevels();
  const { level, nextLevel, progress } = resolveXPLevel(user, levels);

  return {
    user,
    orders,
    unreadNotifications,
    summary: {
      totalOrders: orders.length,
      currentXP: user.xpBalance,
      level,
      nextLevel,
      progress
    }
  };
};

export const getOrderItemLabel = async (item: Order["items"][number]) => {
  if (item.type === "product") {
    const product = mockRepositories.listProducts().find((candidate) => candidate.id === item.productId);
    const variant = mockRepositories.getVariantById(item.variantId);
    return variant ? `${product?.name ?? item.productId} · ${variant.name}` : product?.name ?? item.productId;
  }

  if (item.type === "event-ticket") {
    const event = mockRepositories.listEvents().find((candidate) => candidate.id === item.eventId);
    const batch = event?.batches.find((candidate) => candidate.id === item.batchId);
    return batch ? `${event?.title ?? item.eventId} · ${batch.name}` : event?.title ?? item.eventId;
  }

  return "Item";
};

export type AccountDashboard = Awaited<ReturnType<typeof getAccountDashboard>>;
