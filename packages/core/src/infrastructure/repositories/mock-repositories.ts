import { mockDatabase } from "../memory/mock-database";

export const mockRepositories = {
  listProducts: () => mockDatabase.getState().products,
  getProductBySlug: (slug: string) =>
    mockDatabase.getState().products.find((product) => product.slug === slug),
  listVariants: () => mockDatabase.getState().variants,
  getVariantById: (id: string) =>
    mockDatabase.getState().variants.find((variant) => variant.id === id),
  listPromotions: () => mockDatabase.getState().promotions,
  getCouponByCode: (code: string) =>
    mockDatabase.getState().coupons.find((coupon) => coupon.code === code),
  getCustomerById: (id: string) =>
    mockDatabase.getState().customerProfiles.find((customer) => customer.id === id),
  getFidelityTagById: (id: string) =>
    mockDatabase.getState().fidelityTags.find((tag) => tag.id === id),
  listEvents: () => mockDatabase.getState().events,
  getEventBySlug: (slug: string) =>
    mockDatabase.getState().events.find((event) => event.slug === slug),
  listBlogPosts: () => mockDatabase.getState().blogPosts,
  listBanners: () => mockDatabase.getState().banners,
  getLandingPageBySlug: (slug: string) =>
    mockDatabase.getState().landingPages.find((page) => page.slug === slug),
  listXPLevels: () => mockDatabase.getState().xpLevels,
  listOrdersByCustomerId: (customerId: string) =>
    mockDatabase.getState().orders.filter((order) => order.customerId === customerId),
  listTicketsByCustomerId: (customerId: string) =>
    mockDatabase.getState().tickets.filter((ticket) => ticket.customerId === customerId)
};
