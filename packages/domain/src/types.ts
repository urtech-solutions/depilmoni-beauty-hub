export const customerProfiles = ["cliente", "parceiro", "distribuidor"] as const;
export type CustomerProfileType = (typeof customerProfiles)[number];

export const adminRoles = ["admin", "gerente", "editor-conteudo", "cliente"] as const;
export type AdminRole = (typeof adminRoles)[number];

export const promotionKinds = ["flash-sale", "coupon", "level-benefit"] as const;
export type PromotionKind = (typeof promotionKinds)[number];

export const ticketStatuses = ["confirmado", "usado", "cancelado"] as const;
export type TicketStatus = (typeof ticketStatuses)[number];

export const orderStatuses = ["pendente", "pago", "enviado", "entregue", "cancelado"] as const;
export type OrderStatus = (typeof orderStatuses)[number];

export const paymentMethods = ["cartao_credito", "pix"] as const;
export type PaymentMethod = (typeof paymentMethods)[number];

export type Banner = {
  id: string;
  title: string;
  eyebrow?: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  image: string;
  variant: "hero" | "feature" | "flash";
  active: boolean;
};

export type Inventory = {
  sku: string;
  stock: number;
  reserved: number;
  warehouse: string;
};

export type VariantPricing = {
  baseRetailPrice: number;
  profilePrices: Partial<Record<CustomerProfileType, number>>;
  fidelityAdjustmentPercentage: number;
};

export type ProductVariant = {
  id: string;
  name: string;
  sku: string;
  pricing: VariantPricing;
  inventory: Inventory;
  attributes: Record<string, string>;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  category: string;
  image: string;
  tags: string[];
  featured: boolean;
  variants: ProductVariant[];
  seoTitle: string;
  seoDescription: string;
};

export type Coupon = {
  id: string;
  code: string;
  description: string;
  kind: "percentage" | "fixed" | "shipping";
  value: number;
  minPurchase: number;
  active: boolean;
  expiresAt: string;
  eligibleProfiles: CustomerProfileType[];
};

export type Promotion = {
  id: string;
  name: string;
  kind: PromotionKind;
  productVariantIds: string[];
  percentageOff: number;
  active: boolean;
  startsAt: string;
  endsAt: string;
};

export type CustomerTag = {
  id: string;
  slug: string;
  label: string;
  description?: string;
};

export type FidelityTag = {
  id: string;
  slug: string;
  label: string;
  benefitPercentage: number;
  manuallyManaged: true;
};

export type XPLevel = {
  id: string;
  level: number;
  name: string;
  minXP: number;
  benefits: string[];
  accentLabel: string;
};

export type XPTransaction = {
  id: string;
  customerId: string;
  source: "pedido" | "evento" | "bonus-manual";
  amount: number;
  occurredAt: string;
  referenceId: string;
};

export type CustomerProfile = {
  id: string;
  name: string;
  email: string;
  profile: CustomerProfileType;
  tags: string[];
  fidelityTagId: string | null;
  roles: AdminRole[];
  totalXP: number;
  unlockedBenefits: string[];
  distributorRules: {
    canStackFidelityBenefit: boolean;
    canUseCoupons: boolean;
    canUseLevelBenefits: boolean;
  };
};

export type EventBatch = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  sold: number;
  active: boolean;
};

export type Event = {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  date: string;
  location: string;
  image: string;
  featured: boolean;
  instructor: string;
  seoTitle: string;
  seoDescription: string;
  batches: EventBatch[];
};

export type Ticket = {
  id: string;
  eventId: string;
  eventTitle: string;
  customerId: string;
  batchId: string;
  batchName: string;
  qrCode: string;
  status: TicketStatus;
  checkedInAt: string | null;
  purchaseDate: string;
};

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  category: string;
  publishedAt: string;
  author: string;
};

export type HeroBannerBlock = {
  blockType: "HeroBanner";
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  image: string;
};

export type BenefitBarBlock = {
  blockType: "BenefitBar";
  items: Array<{
    title: string;
    description: string;
  }>;
};

export type ProductCarouselBlock = {
  blockType: "ProductCarousel";
  title: string;
  description: string;
  productIds: string[];
};

export type CategoryGridBlock = {
  blockType: "CategoryGrid";
  title: string;
  description: string;
  items: Array<{
    title: string;
    href: string;
    image: string;
    description: string;
  }>;
};

export type EventHighlightBlock = {
  blockType: "EventHighlight";
  title: string;
  description: string;
  eventId: string;
};

export type TestimonialSectionBlock = {
  blockType: "TestimonialSection";
  title: string;
  testimonials: Array<{
    name: string;
    role: string;
    quote: string;
  }>;
};

export type RichContentSectionBlock = {
  blockType: "RichContentSection";
  title: string;
  eyebrow?: string;
  body: string[];
  ctaLabel?: string;
  ctaHref?: string;
};

export type FAQSectionBlock = {
  blockType: "FAQSection";
  title: string;
  questions: Array<{
    question: string;
    answer: string;
  }>;
};

export type CTASectionBlock = {
  blockType: "CTASection";
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
};

export type HomeBlock =
  | HeroBannerBlock
  | BenefitBarBlock
  | ProductCarouselBlock
  | CategoryGridBlock
  | EventHighlightBlock
  | TestimonialSectionBlock
  | RichContentSectionBlock
  | FAQSectionBlock
  | CTASectionBlock;

export type LandingPage = {
  id: string;
  slug: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  blocks: HomeBlock[];
};

export type CartItem =
  | {
      id: string;
      kind: "product";
      productId: string;
      variantId: string;
      quantity: number;
    }
  | {
      id: string;
      kind: "ticket";
      eventId: string;
      batchId: string;
      quantity: number;
    };

export type CheckoutAddress = {
  name: string;
  email: string;
  cpf: string;
  phone: string;
  zipCode: string;
  city: string;
  street: string;
  neighborhood: string;
  state: string;
};

export type ShippingOption = {
  id: string;
  label: string;
  provider: string;
  eta: string;
  price: number;
};

export type InstallmentOption = {
  installments: number;
  installmentAmount: number;
  total: number;
};

export type OrderLineBreakdown = {
  itemId: string;
  name: string;
  quantity: number;
  baseUnitPrice: number;
  profileAdjustedUnitPrice: number;
  fidelityDiscount: number;
  promotionDiscount: number;
  couponDiscount: number;
  total: number;
};

export type OrderSummary = {
  lines: OrderLineBreakdown[];
  subtotal: number;
  profileSavings: number;
  fidelitySavings: number;
  promotionSavings: number;
  couponSavings: number;
  shipping: number;
  total: number;
  appliedCouponCode?: string;
};

export type PurchaseOrder = {
  id: string;
  customerId: string;
  status: OrderStatus;
  createdAt: string;
  items: CartItem[];
  summary: OrderSummary;
  xpEarned: number;
};
