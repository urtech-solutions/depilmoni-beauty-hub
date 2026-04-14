import { describe, expect, it } from "vitest";

import { calculateOrderPricing } from "./pricing";
import { createSeedData } from "../infrastructure/seeds/mock-seed";

describe("calculateOrderPricing", () => {
  it("aplica a precedencia base -> perfil -> fidelidade -> promocao/cupom", () => {
    const seed = createSeedData();
    const customer = seed.customerProfiles.find((profile) => profile.profileType === "partner")!;
    const fidelityTag = seed.fidelityTags[0];
    const coupon = seed.coupons.find((candidate) => candidate.code === "BEMVINDA10")!;
    const product = seed.products.find((candidate) => candidate.slug === "cera-depilatoria-chocolate")!;
    const variant = seed.variants.find((candidate) => candidate.productId === product.id)!;

    const result = calculateOrderPricing(
      [
        {
          type: "product",
          productId: product.id,
          variantId: variant.id,
          quantity: 1
        }
      ],
      {
        customer,
        coupon,
        fidelityTag,
        promotions: seed.promotions,
        products: seed.products,
        variants: seed.variants,
        events: seed.events
      }
    );

    expect(result.subtotal).toBe(89.9);
    expect(result.profileDiscount).toBeGreaterThan(0);
    expect(result.fidelityDiscount).toBeGreaterThan(0);
    expect(result.promotionDiscount).toBeGreaterThan(0);
    expect(result.couponDiscount).toBeGreaterThan(0);
    expect(result.itemTotal).toBeLessThan(result.subtotal);
  });

  it("nao aplica fidelidade automaticamente para distribuidor sem stacking liberado", () => {
    const seed = createSeedData();
    const customer = seed.customerProfiles.find((profile) => profile.profileType === "distributor")!;
    const fidelityTag = seed.fidelityTags[0];
    const product = seed.products.find((candidate) => candidate.slug === "tonico-corporal-pos-depilacao")!;
    const variant = seed.variants.find((candidate) => candidate.productId === product.id)!;

    const result = calculateOrderPricing(
      [
        {
          type: "product",
          productId: product.id,
          variantId: variant.id,
          quantity: 1
        }
      ],
      {
        customer,
        fidelityTag,
        promotions: [],
        products: seed.products,
        variants: seed.variants,
        events: seed.events
      }
    );

    expect(result.profileDiscount).toBeGreaterThan(0);
    expect(result.fidelityDiscount).toBe(0);
  });
});
