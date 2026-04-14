import { isAfter, isBefore, parseISO } from "date-fns";

import type {
  Coupon,
  CustomerProfile,
  Event,
  FidelityTag,
  OrderItem,
  Product,
  ProductVariant,
  Promotion
} from "../domain/models";

type PricingContext = {
  customer: CustomerProfile;
  coupon?: Coupon;
  fidelityTag?: FidelityTag;
  promotions: Promotion[];
  products: Product[];
  variants: ProductVariant[];
  events: Event[];
};

export type PriceBreakdown = {
  subtotal: number;
  profileDiscount: number;
  fidelityDiscount: number;
  promotionDiscount: number;
  couponDiscount: number;
  itemTotal: number;
};

const toTwoDecimals = (value: number) => Number(value.toFixed(2));

const isPromotionActive = (promotion: Promotion) => {
  if (!promotion.active) {
    return false;
  }

  const now = new Date();
  return isBefore(parseISO(promotion.startsAt), now) && isAfter(parseISO(promotion.endsAt), now);
};

const isCouponActive = (coupon?: Coupon) => {
  if (!coupon || !coupon.active) {
    return false;
  }

  const now = new Date();
  return isBefore(parseISO(coupon.startsAt), now) && isAfter(parseISO(coupon.endsAt), now);
};

const resolveVariantBasePrice = (variant: ProductVariant, customer: CustomerProfile) => {
  const price = variant.profilePrices[customer.profileType];
  return price ?? variant.basePrice;
};

const resolveFidelityPercentage = (customer: CustomerProfile, fidelityTag?: FidelityTag) => {
  if (!fidelityTag) {
    return 0;
  }

  if (!fidelityTag.applicableProfiles.includes(customer.profileType)) {
    return 0;
  }

  if (customer.profileType === "distributor" && !fidelityTag.allowDistributorStacking) {
    return 0;
  }

  return (
    fidelityTag.benefits.find((benefit) => benefit.type === "percentage")?.value ?? 0
  );
};

const resolvePromotionDiscount = ({
  product,
  currentPrice,
  promotions
}: {
  product: Product;
  currentPrice: number;
  promotions: Promotion[];
}) => {
  const activePromotion = promotions.find((promotion) => {
    if (!isPromotionActive(promotion)) {
      return false;
    }

    if (promotion.scope === "product" && promotion.applicableProductIds.includes(product.id)) {
      return true;
    }

    if (
      promotion.scope === "category" &&
      promotion.applicableCategories.includes(product.category)
    ) {
      return true;
    }

    return false;
  });

  if (!activePromotion) {
    return 0;
  }

  return activePromotion.discountType === "percentage"
    ? currentPrice * (activePromotion.value / 100)
    : activePromotion.value;
};

export const calculateOrderPricing = (
  items: OrderItem[],
  context: PricingContext
): PriceBreakdown => {
  const coupon = isCouponActive(context.coupon) ? context.coupon : undefined;
  const fidelityPercentage = resolveFidelityPercentage(context.customer, context.fidelityTag);

  let subtotal = 0;
  let profileDiscount = 0;
  let fidelityDiscount = 0;
  let promotionDiscount = 0;

  items.forEach((item) => {
    if (item.type === "event-ticket") {
      const event = context.events.find((candidate) => candidate.id === item.eventId);
      const batch = event?.batches.find((candidate) => candidate.id === item.batchId);

      if (!event || !batch) {
        throw new Error("Lote do evento nao encontrado.");
      }

      subtotal += batch.price * item.quantity;
      return;
    }

    const product = context.products.find((candidate) => candidate.id === item.productId);
    const variant = context.variants.find((candidate) => candidate.id === item.variantId);

    if (!product || !variant) {
      throw new Error("Produto nao encontrado para precificacao.");
    }

    const retailUnit = variant.basePrice;
    const profileUnit = resolveVariantBasePrice(variant, context.customer);
    const profileUnitDiscount = retailUnit - profileUnit;
    const fidelityUnitDiscount = profileUnit * (fidelityPercentage / 100);
    const promotionUnitDiscount = resolvePromotionDiscount({
      product,
      currentPrice: profileUnit - fidelityUnitDiscount,
      promotions: context.promotions
    });

    subtotal += retailUnit * item.quantity;
    profileDiscount += profileUnitDiscount * item.quantity;
    fidelityDiscount += fidelityUnitDiscount * item.quantity;
    promotionDiscount += promotionUnitDiscount * item.quantity;
  });

  const afterProfileAndBenefits =
    subtotal - profileDiscount - fidelityDiscount - promotionDiscount;
  const couponDiscount = coupon
    ? coupon.discountType === "percentage"
      ? afterProfileAndBenefits * (coupon.value / 100)
      : coupon.value
    : 0;

  if (coupon?.minPurchase && afterProfileAndBenefits < coupon.minPurchase) {
    return {
      subtotal: toTwoDecimals(subtotal),
      profileDiscount: toTwoDecimals(profileDiscount),
      fidelityDiscount: toTwoDecimals(fidelityDiscount),
      promotionDiscount: toTwoDecimals(promotionDiscount),
      couponDiscount: 0,
      itemTotal: toTwoDecimals(afterProfileAndBenefits)
    };
  }

  return {
    subtotal: toTwoDecimals(subtotal),
    profileDiscount: toTwoDecimals(profileDiscount),
    fidelityDiscount: toTwoDecimals(fidelityDiscount),
    promotionDiscount: toTwoDecimals(promotionDiscount),
    couponDiscount: toTwoDecimals(Math.max(couponDiscount, 0)),
    itemTotal: toTwoDecimals(Math.max(afterProfileAndBenefits - couponDiscount, 0))
  };
};
