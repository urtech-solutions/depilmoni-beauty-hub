import {
  defaultCustomerId,
  getShippingOptions,
  mockRepositories,
  storefrontService
} from "@depilmoni/core";

export const defaultSessionCustomerId = defaultCustomerId;

export const storefrontData = {
  homePage: () => storefrontService.getHomePage(),
  products: () => storefrontService.listProducts(),
  featuredProducts: () => storefrontService.listFeaturedProducts(),
  kits: () => storefrontService.listKits(),
  productBySlug: (slug: string) => storefrontService.getProductBySlug(slug),
  events: () => storefrontService.listEvents(),
  eventBySlug: (slug: string) => storefrontService.getEventBySlug(slug),
  blogPosts: () => storefrontService.listBlogPosts(),
  customerDashboard: () => storefrontService.getCustomerDashboard(defaultSessionCustomerId),
  customerOrders: () => mockRepositories.listOrdersByCustomerId(defaultSessionCustomerId),
  customerTickets: () => mockRepositories.listTicketsByCustomerId(defaultSessionCustomerId),
  customerProfile: () => mockRepositories.getCustomerById(defaultSessionCustomerId)!,
  shippingOptions: (items: Parameters<typeof getShippingOptions>[0], postalCode?: string) =>
    getShippingOptions(items, postalCode)
};
