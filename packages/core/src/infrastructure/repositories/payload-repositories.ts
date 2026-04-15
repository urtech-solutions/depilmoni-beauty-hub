/**
 * Payload CMS repository implementation.
 *
 * Uses the Payload Local API to interact with the database.
 * The `getPayload` function must be provided during initialization
 * so this package stays decoupled from the CMS app.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Payload = any;

import type {
  Address,
  Banner,
  BlogPost,
  Coupon,
  CustomerProfile,
  DistributorRequest,
  Event,
  FidelityTag,
  Inventory,
  InventoryMovement,
  LandingPage,
  Notification,
  Order,
  Product,
  ProductVariant,
  Promotion,
  Ticket,
  XPLevel,
  XPTransaction
} from "../../domain/models";
import type { IRepositories } from "./repository-interface";

type PayloadDoc = Record<string, unknown> & { id: string | number };

const toId = (value: string | number) => String(value);

// ---------------------------------------------------------------------------
// Helpers – map Payload docs to domain models
// ---------------------------------------------------------------------------

const mapCustomer = (doc: PayloadDoc): CustomerProfile => ({
  id: toId(doc.id),
  name: doc.name as string,
  email: doc.email as string,
  phone: (doc.phone as string) ?? undefined,
  cpf: (doc.cpf as string) ?? undefined,
  avatarUrl: doc.avatar ? `/media/${(doc.avatar as PayloadDoc).filename ?? doc.avatar}` : undefined,
  role: "authenticated-customer",
  profileType: (doc.profileType as CustomerProfile["profileType"]) ?? "client",
  distributorStatus: (doc.distributorStatus as CustomerProfile["distributorStatus"]) ?? "none",
  tags: ((doc.tags as { value: string }[]) ?? []).map((t) => t.value),
  fidelityTagIds: Array.isArray(doc.fidelityTags)
    ? doc.fidelityTags.map((t: PayloadDoc | string) => (typeof t === "string" ? t : toId(t.id)))
    : [],
  xpBalance: (doc.xpBalance as number) ?? 0,
  levelId: doc.level ? (typeof doc.level === "string" ? doc.level : toId((doc.level as PayloadDoc).id)) : "",
  benefitsUnlocked: ((doc.benefitsUnlocked as { value: string }[]) ?? []).map((b) => b.value),
  orderIds: [],
  ticketIds: [],
  createdAt: doc.createdAt as string,
  updatedAt: doc.updatedAt as string
});

const mapAddress = (doc: PayloadDoc): Address => ({
  id: toId(doc.id),
  customerId: typeof doc.customer === "string" ? doc.customer : toId((doc.customer as PayloadDoc).id),
  label: (doc.label as string) ?? "Principal",
  recipientName: doc.recipientName as string,
  street: doc.street as string,
  number: doc.number as string,
  complement: (doc.complement as string) ?? undefined,
  neighborhood: doc.neighborhood as string,
  city: doc.city as string,
  state: doc.state as string,
  zipCode: doc.zipCode as string,
  isDefault: (doc.isDefault as boolean) ?? false,
  latitude: (doc.latitude as number) ?? undefined,
  longitude: (doc.longitude as number) ?? undefined,
  createdAt: doc.createdAt as string
});

const mapOrder = (doc: PayloadDoc): Order => ({
  id: toId(doc.id),
  customerId: typeof doc.customer === "string" ? doc.customer : toId((doc.customer as PayloadDoc).id),
  code: doc.code as string,
  status: doc.status as Order["status"],
  items: doc.items as Order["items"],
  subtotal: doc.subtotal as number,
  profileDiscount: (doc.profileDiscount as number) ?? 0,
  fidelityDiscount: (doc.fidelityDiscount as number) ?? 0,
  promotionDiscount: (doc.promotionDiscount as number) ?? 0,
  couponDiscount: (doc.couponDiscount as number) ?? 0,
  couponCode: (doc.couponCode as string) ?? undefined,
  shippingAmount: (doc.shippingAmount as number) ?? 0,
  shippingAddressId: doc.shippingAddress
    ? typeof doc.shippingAddress === "string"
      ? doc.shippingAddress
      : toId((doc.shippingAddress as PayloadDoc).id)
    : undefined,
  total: doc.total as number,
  paymentMethod: (doc.paymentMethod as Order["paymentMethod"]) ?? undefined,
  paymentExternalId: (doc.paymentExternalId as string) ?? undefined,
  xpEarned: (doc.xpEarned as number) ?? 0,
  trackingCode: (doc.trackingCode as string) ?? undefined,
  trackingUrl: (doc.trackingUrl as string) ?? undefined,
  shippedAt: (doc.shippedAt as string) ?? undefined,
  deliveredAt: (doc.deliveredAt as string) ?? undefined,
  createdAt: doc.createdAt as string,
  updatedAt: doc.updatedAt as string
});

const mapNotification = (doc: PayloadDoc): Notification => ({
  id: toId(doc.id),
  customerId: typeof doc.customer === "string" ? doc.customer : toId((doc.customer as PayloadDoc).id),
  type: doc.type as Notification["type"],
  title: doc.title as string,
  message: doc.message as string,
  href: (doc.href as string) ?? undefined,
  read: (doc.read as boolean) ?? false,
  createdAt: doc.createdAt as string
});

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

export const createPayloadRepositories = (payload: Payload): IRepositories => ({
  products: {
    async list() {
      const { docs } = await payload.find({ collection: "products", limit: 500 });
      return docs as unknown as Product[];
    },
    async getBySlug(slug: string) {
      const { docs } = await payload.find({ collection: "products", where: { slug: { equals: slug } }, limit: 1 });
      return (docs[0] as unknown as Product) ?? null;
    },
    async getById(id: string) {
      try {
        const doc = await payload.findByID({ collection: "products", id });
        return doc as unknown as Product;
      } catch {
        return null;
      }
    }
  },

  variants: {
    async list() {
      return [] as ProductVariant[];
    },
    async getById(_id: string) {
      return null;
    },
    async getByProductId(_productId: string) {
      return [] as ProductVariant[];
    }
  },

  inventory: {
    async getById(_id: string) {
      return null;
    },
    async getBySku(_sku: string) {
      return null;
    },
    async updateQuantity(_id: string, _qty: number) {}
  },

  promotions: {
    async list() {
      const { docs } = await payload.find({ collection: "promotions", limit: 500 });
      return docs as unknown as Promotion[];
    },
    async getById(id: string) {
      try {
        const doc = await payload.findByID({ collection: "promotions", id });
        return doc as unknown as Promotion;
      } catch {
        return null;
      }
    },
    async listActive() {
      const { docs } = await payload.find({
        collection: "promotions",
        where: { active: { equals: true } },
        limit: 500
      });
      return docs as unknown as Promotion[];
    }
  },

  coupons: {
    async getByCode(code: string) {
      const { docs } = await payload.find({ collection: "coupons", where: { code: { equals: code } }, limit: 1 });
      return (docs[0] as unknown as Coupon) ?? null;
    },
    async incrementUses(id: string) {
      const doc = await payload.findByID({ collection: "coupons", id });
      await payload.update({
        collection: "coupons",
        id,
        data: { currentUses: ((doc.currentUses as number) ?? 0) + 1 }
      });
    }
  },

  customers: {
    async getById(id: string) {
      try {
        const doc = await payload.findByID({ collection: "customers", id });
        return mapCustomer(doc as unknown as PayloadDoc);
      } catch {
        return null;
      }
    },
    async getByEmail(email: string) {
      const { docs } = await payload.find({ collection: "customers", where: { email: { equals: email } }, limit: 1 });
      if (!docs[0]) return null;
      return mapCustomer(docs[0] as unknown as PayloadDoc);
    },
    async create(data) {
      const doc = await payload.create({ collection: "customers", data: data as Record<string, unknown> });
      return mapCustomer(doc as unknown as PayloadDoc);
    },
    async update(id, data) {
      const doc = await payload.update({ collection: "customers", id, data: data as Record<string, unknown> });
      return mapCustomer(doc as unknown as PayloadDoc);
    },
    async list(options) {
      const { docs } = await payload.find({
        collection: "customers",
        limit: options?.limit ?? 100,
        page: options?.offset ? Math.floor(options.offset / (options.limit ?? 100)) + 1 : 1
      });
      return docs.map((d: unknown) => mapCustomer(d as PayloadDoc));
    }
  },

  fidelityTags: {
    async getById(id: string) {
      try {
        const doc = await payload.findByID({ collection: "fidelity-tags", id });
        return doc as unknown as FidelityTag;
      } catch {
        return null;
      }
    },
    async list() {
      const { docs } = await payload.find({ collection: "fidelity-tags", limit: 100 });
      return docs as unknown as FidelityTag[];
    }
  },

  addresses: {
    async listByCustomerId(customerId: string) {
      const { docs } = await payload.find({
        collection: "addresses",
        where: { customer: { equals: customerId } },
        limit: 50
      });
      return docs.map((d: unknown) => mapAddress(d as PayloadDoc));
    },
    async getById(id: string) {
      try {
        const doc = await payload.findByID({ collection: "addresses", id });
        return mapAddress(doc as unknown as PayloadDoc);
      } catch {
        return null;
      }
    },
    async create(data) {
      const doc = await payload.create({
        collection: "addresses",
        data: { ...data, customer: data.customerId } as Record<string, unknown>
      });
      return mapAddress(doc as unknown as PayloadDoc);
    },
    async update(id, data) {
      const doc = await payload.update({ collection: "addresses", id, data: data as Record<string, unknown> });
      return mapAddress(doc as unknown as PayloadDoc);
    },
    async delete(id) {
      await payload.delete({ collection: "addresses", id });
    },
    async setDefault(id: string, customerId: string) {
      const addresses = await this.listByCustomerId(customerId);
      for (const addr of addresses) {
        if (addr.id !== id && addr.isDefault) {
          await payload.update({ collection: "addresses", id: addr.id, data: { isDefault: false } });
        }
      }
      await payload.update({ collection: "addresses", id, data: { isDefault: true } });
    }
  },

  orders: {
    async getById(id: string) {
      try {
        const doc = await payload.findByID({ collection: "orders", id });
        return mapOrder(doc as unknown as PayloadDoc);
      } catch {
        return null;
      }
    },
    async listByCustomerId(customerId: string) {
      const { docs } = await payload.find({
        collection: "orders",
        where: { customer: { equals: customerId } },
        sort: "-createdAt",
        limit: 100
      });
      return docs.map((d: unknown) => mapOrder(d as PayloadDoc));
    },
    async create(data) {
      const doc = await payload.create({
        collection: "orders",
        data: { ...data, customer: data.customerId } as Record<string, unknown>
      });
      return mapOrder(doc as unknown as PayloadDoc);
    },
    async updateStatus(id, status) {
      await payload.update({ collection: "orders", id, data: { status } });
    },
    async update(id, data) {
      const doc = await payload.update({ collection: "orders", id, data: data as Record<string, unknown> });
      return mapOrder(doc as unknown as PayloadDoc);
    },
    async listRecent(limit: number) {
      const { docs } = await payload.find({ collection: "orders", sort: "-createdAt", limit });
      return docs.map((d: unknown) => mapOrder(d as PayloadDoc));
    }
  },

  distributorRequests: {
    async create(data) {
      const doc = await payload.create({
        collection: "distributor-requests",
        data: { ...data, customer: data.customerId } as Record<string, unknown>
      });
      return doc as unknown as DistributorRequest;
    },
    async getByCustomerId(customerId: string) {
      const { docs } = await payload.find({
        collection: "distributor-requests",
        where: { customer: { equals: customerId } },
        sort: "-createdAt",
        limit: 1
      });
      return (docs[0] as unknown as DistributorRequest) ?? null;
    },
    async getById(id: string) {
      try {
        const doc = await payload.findByID({ collection: "distributor-requests", id });
        return doc as unknown as DistributorRequest;
      } catch {
        return null;
      }
    },
    async update(id, data) {
      const doc = await payload.update({
        collection: "distributor-requests",
        id,
        data: data as Record<string, unknown>
      });
      return doc as unknown as DistributorRequest;
    },
    async listPending() {
      const { docs } = await payload.find({
        collection: "distributor-requests",
        where: { status: { equals: "pending_review" } },
        limit: 100
      });
      return docs as unknown as DistributorRequest[];
    }
  },

  xpTransactions: {
    async create(data) {
      const doc = await payload.create({
        collection: "xp-transactions",
        data: { ...data, customer: data.customerId } as Record<string, unknown>
      });
      return doc as unknown as XPTransaction;
    },
    async listByCustomerId(customerId: string) {
      const { docs } = await payload.find({
        collection: "xp-transactions",
        where: { customer: { equals: customerId } },
        sort: "-createdAt",
        limit: 200
      });
      return docs as unknown as XPTransaction[];
    }
  },

  xpLevels: {
    async list() {
      const { docs } = await payload.find({ collection: "xp-levels", sort: "minXP", limit: 100 });
      return docs as unknown as XPLevel[];
    },
    async getById(id: string) {
      try {
        const doc = await payload.findByID({ collection: "xp-levels", id });
        return doc as unknown as XPLevel;
      } catch {
        return null;
      }
    }
  },

  notifications: {
    async create(data) {
      const doc = await payload.create({
        collection: "notifications",
        data: { ...data, customer: data.customerId } as Record<string, unknown>
      });
      return mapNotification(doc as unknown as PayloadDoc);
    },
    async listByCustomerId(customerId: string) {
      const { docs } = await payload.find({
        collection: "notifications",
        where: { customer: { equals: customerId } },
        sort: "-createdAt",
        limit: 100
      });
      return docs.map((d: unknown) => mapNotification(d as PayloadDoc));
    },
    async markAsRead(id: string) {
      await payload.update({ collection: "notifications", id, data: { read: true } });
    },
    async markAllAsRead(customerId: string) {
      const { docs } = await payload.find({
        collection: "notifications",
        where: { customer: { equals: customerId }, read: { equals: false } },
        limit: 500
      });
      for (const doc of docs) {
        await payload.update({ collection: "notifications", id: toId(doc.id), data: { read: true } });
      }
    },
    async countUnread(customerId: string) {
      const { totalDocs } = await payload.count({
        collection: "notifications",
        where: { customer: { equals: customerId }, read: { equals: false } }
      });
      return totalDocs;
    }
  },

  inventoryMovements: {
    async create(data) {
      const doc = await payload.create({
        collection: "inventory-movements",
        data: data as Record<string, unknown>
      });
      return doc as unknown as InventoryMovement;
    },
    async listBySku(sku: string) {
      const { docs } = await payload.find({
        collection: "inventory-movements",
        where: { sku: { equals: sku } },
        sort: "-createdAt",
        limit: 200
      });
      return docs as unknown as InventoryMovement[];
    }
  },

  tickets: {
    async create(data) {
      return data as Ticket;
    },
    async listByCustomerId(_customerId: string) {
      return [] as Ticket[];
    },
    async getById(_id: string) {
      return null;
    }
  },

  events: {
    async list() {
      const { docs } = await payload.find({ collection: "events", limit: 100 });
      return docs as unknown as Event[];
    },
    async getBySlug(slug: string) {
      const { docs } = await payload.find({ collection: "events", where: { slug: { equals: slug } }, limit: 1 });
      return (docs[0] as unknown as Event) ?? null;
    },
    async getById(id: string) {
      try {
        const doc = await payload.findByID({ collection: "events", id });
        return doc as unknown as Event;
      } catch {
        return null;
      }
    }
  },

  banners: {
    async list() {
      const { docs } = await payload.find({ collection: "banners", limit: 50 });
      return docs as unknown as Banner[];
    }
  },

  blogPosts: {
    async list() {
      const { docs } = await payload.find({ collection: "blog-posts", sort: "-createdAt", limit: 100 });
      return docs as unknown as BlogPost[];
    }
  },

  landingPages: {
    async getBySlug(slug: string) {
      const { docs } = await payload.find({
        collection: "landing-pages",
        where: { slug: { equals: slug } },
        limit: 1
      });
      return (docs[0] as unknown as LandingPage) ?? null;
    }
  }
});
