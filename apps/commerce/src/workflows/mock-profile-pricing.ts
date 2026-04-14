import { profilePricingService } from "../modules/profile-pricing/service";

export const runMockProfilePricingWorkflow = () =>
  profilePricingService.resolvePrice({
    basePrice: 89.9,
    profileType: "partner",
    hasFidelityTag: true,
    rule: {
      allowDistributorStacking: false,
      loyaltyDiscountPercentage: 5,
      profilePrices: {
        partner: 78.9,
        distributor: 69.9
      }
    }
  });
