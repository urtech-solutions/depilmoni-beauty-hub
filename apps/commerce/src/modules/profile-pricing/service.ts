type ProfileType = "client" | "partner" | "distributor";

export type ProfilePricingRule = {
  allowDistributorStacking: boolean;
  loyaltyDiscountPercentage?: number;
  profilePrices: Partial<Record<ProfileType, number>>;
};

export const profilePricingService = {
  resolvePrice({
    basePrice,
    profileType,
    rule,
    hasFidelityTag
  }: {
    basePrice: number;
    profileType: ProfileType;
    rule: ProfilePricingRule;
    hasFidelityTag: boolean;
  }) {
    const profilePrice = rule.profilePrices[profileType] ?? basePrice;
    const loyaltyDiscount =
      hasFidelityTag &&
      (profileType !== "distributor" || rule.allowDistributorStacking) &&
      rule.loyaltyDiscountPercentage
        ? profilePrice * (rule.loyaltyDiscountPercentage / 100)
        : 0;

    return {
      profilePrice,
      loyaltyDiscount,
      finalPrice: Number((profilePrice - loyaltyDiscount).toFixed(2))
    };
  }
};
