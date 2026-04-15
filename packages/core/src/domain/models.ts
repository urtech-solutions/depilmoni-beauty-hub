import { z } from "zod";

export const CustomerProfileTypeSchema = z.enum(["client", "partner", "distributor"]);
export const RoleSchema = z.enum(["admin", "manager", "content-editor", "authenticated-customer"]);
export const DiscountTypeSchema = z.enum(["percentage", "fixed"]);
export const PromotionScopeSchema = z.enum(["product", "category", "order", "event"]);
export const BatchStatusSchema = z.enum(["scheduled", "active", "sold-out"]);
export const TicketStatusSchema = z.enum(["reserved", "confirmed", "checked-in"]);
export const DistributorStatusSchema = z.enum(["none", "pending_review", "approved", "rejected"]);
export const OrderStatusSchema = z.enum([
  "pending", "awaiting-payment", "paid", "processing", "shipped", "delivered", "cancelled", "refunded"
]);
export const InventoryMovementTypeSchema = z.enum([
  "sale", "return", "adjustment", "restock", "reservation", "reservation-cancel"
]);
export const NotificationTypeSchema = z.enum([
  "order-status", "promotion", "coupon", "xp-earned", "level-up",
  "distributor-approved", "distributor-rejected", "event-reminder", "system"
]);

export const LinkSchema = z.object({
  label: z.string(),
  href: z.string()
});

export const ProfilePriceMapSchema = z.object({
  client: z.number().optional(),
  partner: z.number().optional(),
  distributor: z.number().optional()
});

export const InventorySchema = z.object({
  id: z.string(),
  sku: z.string(),
  quantityAvailable: z.number().int().nonnegative(),
  quantityReserved: z.number().int().nonnegative().default(0),
  reorderLevel: z.number().int().nonnegative().default(0)
});

export const ProductVariantSchema = z.object({
  id: z.string(),
  productId: z.string(),
  name: z.string(),
  sku: z.string(),
  basePrice: z.number().positive(),
  profilePrices: ProfilePriceMapSchema.default({}),
  inventoryId: z.string()
});

export const ProductSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  description: z.string(),
  shortDescription: z.string(),
  category: z.string(),
  tags: z.array(z.string()),
  media: z.array(z.string()),
  featured: z.boolean().default(false),
  isKit: z.boolean().default(false),
  variantIds: z.array(z.string())
});

export const PromotionSchema = z.object({
  id: z.string(),
  name: z.string(),
  scope: PromotionScopeSchema,
  discountType: DiscountTypeSchema,
  value: z.number().positive(),
  startsAt: z.string(),
  endsAt: z.string(),
  active: z.boolean(),
  applicableProductIds: z.array(z.string()).default([]),
  applicableCategories: z.array(z.string()).default([]),
  xpMultiplier: z.number().positive().default(1),
  eligibleProfiles: z.array(CustomerProfileTypeSchema).default([]),
  eligibleTags: z.array(z.string()).default([])
});

export const CouponSchema = z.object({
  id: z.string(),
  code: z.string(),
  discountType: DiscountTypeSchema,
  value: z.number().positive(),
  minPurchase: z.number().nonnegative().optional(),
  active: z.boolean(),
  startsAt: z.string(),
  endsAt: z.string(),
  combinableWithPromotions: z.boolean().default(true),
  combinableWithFidelity: z.boolean().default(true),
  maxUses: z.number().int().positive().optional(),
  currentUses: z.number().int().nonnegative().default(0),
  eligibleProfiles: z.array(CustomerProfileTypeSchema).default([]),
  eligibleTags: z.array(z.string()).default([])
});

export const CustomerTagSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  kind: z.enum(["profile", "fidelity", "custom", "benefit"])
});

export const FidelityBenefitSchema = z.object({
  id: z.string(),
  label: z.string(),
  type: z.enum(["percentage", "free-shipping", "priority-access", "gift"]),
  value: z.number().optional()
});

export const FidelityTagSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  applicableProfiles: z.array(CustomerProfileTypeSchema),
  allowDistributorStacking: z.boolean().default(false),
  benefits: z.array(FidelityBenefitSchema)
});

export const XPTransactionSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.number().int(),
  source: z.enum(["order-paid", "event-ticket", "manual-adjustment"]),
  referenceId: z.string(),
  createdAt: z.string()
});

export const XPLevelSchema = z.object({
  id: z.string(),
  level: z.number().int().positive(),
  name: z.string(),
  minXP: z.number().int().nonnegative(),
  benefits: z.array(z.string())
});

export const TicketBatchSchema = z.object({
  id: z.string(),
  eventId: z.string(),
  name: z.string(),
  price: z.number().positive(),
  quantity: z.number().int().positive(),
  sold: z.number().int().nonnegative(),
  status: BatchStatusSchema
});

export const EventSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  summary: z.string(),
  description: z.string(),
  startsAt: z.string(),
  endsAt: z.string(),
  location: z.string(),
  instructor: z.string(),
  coverImage: z.string(),
  featured: z.boolean().default(false),
  batches: z.array(TicketBatchSchema),
  faq: z.array(z.object({ question: z.string(), answer: z.string() })).default([])
});

export const TicketSchema = z.object({
  id: z.string(),
  eventId: z.string(),
  eventTitle: z.string(),
  batchId: z.string(),
  orderId: z.string(),
  customerId: z.string(),
  attendeeName: z.string(),
  qrCode: z.string(),
  status: TicketStatusSchema,
  checkInAt: z.string().nullable().default(null)
});

export const BannerSchema = z.object({
  id: z.string(),
  eyebrow: z.string(),
  title: z.string(),
  subtitle: z.string(),
  cta: LinkSchema,
  image: z.string(),
  active: z.boolean()
});

export const HeroBannerBlockSchema = z.object({
  blockType: z.literal("HeroBanner"),
  eyebrow: z.string(),
  title: z.string(),
  subtitle: z.string(),
  cta: LinkSchema,
  secondaryCta: LinkSchema.optional(),
  image: z.string(),
  ambienceNotes: z.array(z.string()).default([])
});

export const BenefitBarBlockSchema = z.object({
  blockType: z.literal("BenefitBar"),
  items: z.array(
    z.object({
      title: z.string(),
      description: z.string()
    })
  )
});

export const ProductCarouselBlockSchema = z.object({
  blockType: z.literal("ProductCarousel"),
  title: z.string(),
  subtitle: z.string(),
  collection: z.enum(["featured", "kits", "all"]).default("featured")
});

export const CategoryGridBlockSchema = z.object({
  blockType: z.literal("CategoryGrid"),
  title: z.string(),
  subtitle: z.string(),
  items: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      href: z.string(),
      image: z.string()
    })
  )
});

export const EventHighlightBlockSchema = z.object({
  blockType: z.literal("EventHighlight"),
  title: z.string(),
  subtitle: z.string(),
  eventSlugs: z.array(z.string())
});

export const TestimonialSectionBlockSchema = z.object({
  blockType: z.literal("TestimonialSection"),
  title: z.string(),
  subtitle: z.string(),
  testimonials: z.array(
    z.object({
      name: z.string(),
      role: z.string(),
      quote: z.string()
    })
  )
});

export const RichContentSectionBlockSchema = z.object({
  blockType: z.literal("RichContentSection"),
  title: z.string(),
  content: z.array(z.string()),
  metrics: z.array(
    z.object({
      label: z.string(),
      value: z.string()
    })
  )
});

export const FAQSectionBlockSchema = z.object({
  blockType: z.literal("FAQSection"),
  title: z.string(),
  items: z.array(
    z.object({
      question: z.string(),
      answer: z.string()
    })
  )
});

export const CTASectionBlockSchema = z.object({
  blockType: z.literal("CTASection"),
  title: z.string(),
  subtitle: z.string(),
  cta: LinkSchema,
  secondaryCta: LinkSchema.optional()
});

export const LandingPageBlockSchema = z.discriminatedUnion("blockType", [
  HeroBannerBlockSchema,
  BenefitBarBlockSchema,
  ProductCarouselBlockSchema,
  CategoryGridBlockSchema,
  EventHighlightBlockSchema,
  TestimonialSectionBlockSchema,
  RichContentSectionBlockSchema,
  FAQSectionBlockSchema,
  CTASectionBlockSchema
]);

export const LandingPageSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  seoTitle: z.string(),
  seoDescription: z.string(),
  blocks: z.array(LandingPageBlockSchema)
});

export const BlogPostSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  excerpt: z.string(),
  content: z.array(z.string()),
  coverImage: z.string(),
  publishedAt: z.string(),
  tags: z.array(z.string())
});

export const OrderItemSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("product"),
    productId: z.string(),
    variantId: z.string(),
    quantity: z.number().int().positive()
  }),
  z.object({
    type: z.literal("event-ticket"),
    eventId: z.string(),
    batchId: z.string(),
    quantity: z.number().int().positive()
  })
]);

export const OrderSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  code: z.string(),
  status: OrderStatusSchema,
  items: z.array(OrderItemSchema),
  subtotal: z.number().nonnegative(),
  profileDiscount: z.number().nonnegative(),
  fidelityDiscount: z.number().nonnegative(),
  promotionDiscount: z.number().nonnegative(),
  couponDiscount: z.number().nonnegative(),
  couponCode: z.string().optional(),
  shippingAmount: z.number().nonnegative(),
  shippingAddressId: z.string().optional(),
  total: z.number().nonnegative(),
  paymentMethod: z.enum(["credit-card", "pix"]).optional(),
  paymentExternalId: z.string().optional(),
  xpEarned: z.number().int().nonnegative(),
  trackingCode: z.string().optional(),
  trackingUrl: z.string().optional(),
  shippedAt: z.string().optional(),
  deliveredAt: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string().optional()
});

export const CustomerProfileSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
  cpf: z.string().optional(),
  avatarUrl: z.string().optional(),
  role: RoleSchema,
  profileType: CustomerProfileTypeSchema,
  distributorStatus: DistributorStatusSchema.default("none"),
  tags: z.array(z.string()),
  fidelityTagIds: z.array(z.string()),
  xpBalance: z.number().int().nonnegative(),
  levelId: z.string(),
  benefitsUnlocked: z.array(z.string()),
  orderIds: z.array(z.string()),
  ticketIds: z.array(z.string()),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional()
});

export const AddressSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  label: z.string().default("Principal"),
  recipientName: z.string(),
  street: z.string(),
  number: z.string(),
  complement: z.string().optional(),
  neighborhood: z.string(),
  city: z.string(),
  state: z.string(),
  zipCode: z.string(),
  isDefault: z.boolean().default(false),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  createdAt: z.string().optional()
});

export const DistributorRequestSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  responsibleName: z.string(),
  companyName: z.string(),
  tradeName: z.string(),
  cnpj: z.string(),
  stateRegistration: z.string().optional(),
  phone: z.string(),
  commercialAddress: z.object({
    street: z.string(),
    number: z.string().optional(),
    neighborhood: z.string().optional(),
    city: z.string(),
    state: z.string(),
    zipCode: z.string()
  }),
  website: z.string().optional(),
  socialMedia: z.string().optional(),
  observations: z.string().optional(),
  documents: z.array(z.string()).default([]),
  termsAccepted: z.boolean(),
  status: DistributorStatusSchema,
  reviewedBy: z.string().nullable().default(null),
  reviewedAt: z.string().nullable().default(null),
  reviewNotes: z.string().optional(),
  createdAt: z.string()
});

export const NotificationSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  type: NotificationTypeSchema,
  title: z.string(),
  message: z.string(),
  href: z.string().optional(),
  read: z.boolean().default(false),
  createdAt: z.string()
});

export const InventoryMovementSchema = z.object({
  id: z.string(),
  inventoryId: z.string().optional(),
  productId: z.string().optional(),
  sku: z.string(),
  type: InventoryMovementTypeSchema,
  quantity: z.number().int(),
  previousStock: z.number().int(),
  newStock: z.number().int(),
  orderId: z.string().optional(),
  changedBy: z.string(),
  note: z.string().optional(),
  createdAt: z.string()
});

export const OrderStatusHistorySchema = z.object({
  id: z.string(),
  orderId: z.string(),
  fromStatus: OrderStatusSchema.nullable(),
  toStatus: OrderStatusSchema,
  changedBy: z.string(),
  note: z.string().optional(),
  createdAt: z.string()
});

export const MockDatabaseSchema = z.object({
  products: z.array(ProductSchema),
  variants: z.array(ProductVariantSchema),
  inventory: z.array(InventorySchema),
  promotions: z.array(PromotionSchema),
  coupons: z.array(CouponSchema),
  customerProfiles: z.array(CustomerProfileSchema),
  customerTags: z.array(CustomerTagSchema),
  fidelityTags: z.array(FidelityTagSchema),
  xpTransactions: z.array(XPTransactionSchema),
  xpLevels: z.array(XPLevelSchema),
  events: z.array(EventSchema),
  tickets: z.array(TicketSchema),
  banners: z.array(BannerSchema),
  landingPages: z.array(LandingPageSchema),
  blogPosts: z.array(BlogPostSchema),
  orders: z.array(OrderSchema),
  addresses: z.array(AddressSchema).default([]),
  distributorRequests: z.array(DistributorRequestSchema).default([]),
  notifications: z.array(NotificationSchema).default([]),
  inventoryMovements: z.array(InventoryMovementSchema).default([]),
  orderStatusHistory: z.array(OrderStatusHistorySchema).default([])
});

export type CustomerProfileType = z.infer<typeof CustomerProfileTypeSchema>;
export type Role = z.infer<typeof RoleSchema>;
export type DistributorStatus = z.infer<typeof DistributorStatusSchema>;
export type OrderStatus = z.infer<typeof OrderStatusSchema>;
export type InventoryMovementType = z.infer<typeof InventoryMovementTypeSchema>;
export type NotificationType = z.infer<typeof NotificationTypeSchema>;
export type Inventory = z.infer<typeof InventorySchema>;
export type ProductVariant = z.infer<typeof ProductVariantSchema>;
export type Product = z.infer<typeof ProductSchema>;
export type Promotion = z.infer<typeof PromotionSchema>;
export type Coupon = z.infer<typeof CouponSchema>;
export type CustomerTag = z.infer<typeof CustomerTagSchema>;
export type FidelityTag = z.infer<typeof FidelityTagSchema>;
export type XPTransaction = z.infer<typeof XPTransactionSchema>;
export type XPLevel = z.infer<typeof XPLevelSchema>;
export type Event = z.infer<typeof EventSchema>;
export type Ticket = z.infer<typeof TicketSchema>;
export type Banner = z.infer<typeof BannerSchema>;
export type Address = z.infer<typeof AddressSchema>;
export type DistributorRequest = z.infer<typeof DistributorRequestSchema>;
export type Notification = z.infer<typeof NotificationSchema>;
export type InventoryMovement = z.infer<typeof InventoryMovementSchema>;
export type OrderStatusHistory = z.infer<typeof OrderStatusHistorySchema>;
export type HeroBannerBlock = z.infer<typeof HeroBannerBlockSchema>;
export type BenefitBarBlock = z.infer<typeof BenefitBarBlockSchema>;
export type ProductCarouselBlock = z.infer<typeof ProductCarouselBlockSchema>;
export type CategoryGridBlock = z.infer<typeof CategoryGridBlockSchema>;
export type EventHighlightBlock = z.infer<typeof EventHighlightBlockSchema>;
export type TestimonialSectionBlock = z.infer<typeof TestimonialSectionBlockSchema>;
export type RichContentSectionBlock = z.infer<typeof RichContentSectionBlockSchema>;
export type FAQSectionBlock = z.infer<typeof FAQSectionBlockSchema>;
export type CTASectionBlock = z.infer<typeof CTASectionBlockSchema>;
export type LandingPageBlock = z.infer<typeof LandingPageBlockSchema>;
export type LandingPage = z.infer<typeof LandingPageSchema>;
export type BlogPost = z.infer<typeof BlogPostSchema>;
export type CustomerProfile = z.infer<typeof CustomerProfileSchema>;
export type OrderItem = z.infer<typeof OrderItemSchema>;
export type Order = z.infer<typeof OrderSchema>;
export type MockDatabase = z.infer<typeof MockDatabaseSchema>;
