import type {
  BlogPost,
  CustomerProfile,
  Event,
  LandingPage,
  Product,
  ProductVariant,
  XPLevel
} from "../domain/models";
import { mockRepositories } from "../infrastructure/repositories/mock-repositories";

export type ProductViewModel = Product & {
  variants: ProductVariant[];
  lowestPrice: number;
};

const withVariants = (product: Product): ProductViewModel => {
  const variants = product.variantIds
    .map((variantId) => mockRepositories.getVariantById(variantId))
    .filter(Boolean) as ProductVariant[];

  return {
    ...product,
    variants,
    lowestPrice: Math.min(...variants.map((variant) => variant.basePrice))
  };
};

export const storefrontService = {
  getHomePage(): LandingPage {
    return mockRepositories.getLandingPageBySlug("/")!;
  },
  listProducts(): ProductViewModel[] {
    return mockRepositories.listProducts().map(withVariants);
  },
  listKits(): ProductViewModel[] {
    return mockRepositories.listProducts().filter((product) => product.isKit).map(withVariants);
  },
  listFeaturedProducts(): ProductViewModel[] {
    return mockRepositories
      .listProducts()
      .filter((product) => product.featured)
      .map(withVariants);
  },
  getProductBySlug(slug: string): ProductViewModel | undefined {
    const product = mockRepositories.getProductBySlug(slug);
    return product ? withVariants(product) : undefined;
  },
  listEvents(): Event[] {
    return mockRepositories.listEvents();
  },
  getEventBySlug(slug: string) {
    return mockRepositories.getEventBySlug(slug);
  },
  listBlogPosts(): BlogPost[] {
    return mockRepositories.listBlogPosts();
  },
  getCustomerDashboard(customerId: string): {
    customer: CustomerProfile;
    level: XPLevel;
    nextLevel?: XPLevel;
    progress: number;
  } {
    const customer = mockRepositories.getCustomerById(customerId)!;
    const levels = [...mockRepositories.listXPLevels()].sort((left, right) => left.minXP - right.minXP);
    const level =
      [...levels].reverse().find((candidate) => candidate.minXP <= customer.xpBalance) ?? levels[0];
    const nextLevel = levels.find((candidate) => candidate.minXP > customer.xpBalance);
    const progress = nextLevel
      ? ((customer.xpBalance - level.minXP) / (nextLevel.minXP - level.minXP)) * 100
      : 100;

    return { customer, level, nextLevel, progress };
  }
};
