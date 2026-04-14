import { createSeedData } from "./mock-seed";

const seed = createSeedData();

console.log(
  JSON.stringify(
    {
      products: seed.products.length,
      events: seed.events.length,
      banners: seed.banners.length,
      customerProfiles: seed.customerProfiles.length,
      fidelityTags: seed.fidelityTags.length,
      coupons: seed.coupons.length,
      promotions: seed.promotions.length
    },
    null,
    2
  )
);
