import type { Coupon, CustomerProfile } from "../domain/models";

export type CouponValidationInput = {
  coupon: Coupon | null | undefined;
  customer: Pick<CustomerProfile, "profileType" | "tags">;
  subtotal: number;
  now?: Date;
};

export type CouponValidationResult =
  | {
      valid: true;
      discount: number;
      coupon: Coupon;
    }
  | {
      valid: false;
      reason:
        | "not_found"
        | "inactive"
        | "out_of_window"
        | "max_uses_reached"
        | "profile_not_eligible"
        | "tag_not_eligible"
        | "below_min_purchase";
      message: string;
    };

const fail = (
  reason: Extract<CouponValidationResult, { valid: false }>["reason"],
  message: string
): CouponValidationResult => ({ valid: false, reason, message });

export const validateCoupon = ({
  coupon,
  customer,
  subtotal,
  now = new Date()
}: CouponValidationInput): CouponValidationResult => {
  if (!coupon) {
    return fail("not_found", "Cupom não encontrado.");
  }

  if (!coupon.active) {
    return fail("inactive", "Este cupom não está ativo.");
  }

  const startsAt = new Date(coupon.startsAt).getTime();
  const endsAt = new Date(coupon.endsAt).getTime();
  const current = now.getTime();

  if (current < startsAt || current > endsAt) {
    return fail("out_of_window", "Cupom fora do período de validade.");
  }

  if (typeof coupon.maxUses === "number" && coupon.currentUses >= coupon.maxUses) {
    return fail("max_uses_reached", "Cupom atingiu o limite de usos.");
  }

  if (
    coupon.eligibleProfiles &&
    coupon.eligibleProfiles.length > 0 &&
    !coupon.eligibleProfiles.includes(customer.profileType)
  ) {
    return fail("profile_not_eligible", "Seu perfil não é elegível para este cupom.");
  }

  if (coupon.eligibleTags && coupon.eligibleTags.length > 0) {
    const customerTags = new Set(customer.tags ?? []);
    const anyMatch = coupon.eligibleTags.some((tag) => customerTags.has(tag));
    if (!anyMatch) {
      return fail("tag_not_eligible", "Este cupom exige uma tag específica no seu perfil.");
    }
  }

  if (typeof coupon.minPurchase === "number" && subtotal < coupon.minPurchase) {
    return fail(
      "below_min_purchase",
      `Valor mínimo de R$ ${coupon.minPurchase.toFixed(2)} não atingido.`
    );
  }

  const discount =
    coupon.discountType === "percentage"
      ? Number(((subtotal * coupon.value) / 100).toFixed(2))
      : Math.min(coupon.value, subtotal);

  return { valid: true, discount, coupon };
};
