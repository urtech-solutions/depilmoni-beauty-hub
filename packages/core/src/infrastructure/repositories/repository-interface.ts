import type {
  Address,
  Banner,
  BlogPost,
  Coupon,
  CustomerProfile,
  DistributorRequest,
  Event,
  FidelityTag,
  Inventory,
  InventoryMovement,
  LandingPage,
  Notification,
  Order,
  Product,
  ProductVariant,
  Promotion,
  Ticket,
  XPLevel,
  XPTransaction
} from "../../domain/models";

export interface IProductRepository {
  list(): Promise<Product[]>;
  getBySlug(slug: string): Promise<Product | null>;
  getById(id: string): Promise<Product | null>;
}

export interface IVariantRepository {
  list(): Promise<ProductVariant[]>;
  getById(id: string): Promise<ProductVariant | null>;
  getByProductId(productId: string): Promise<ProductVariant[]>;
}

export interface IInventoryRepository {
  getById(id: string): Promise<Inventory | null>;
  getBySku(sku: string): Promise<Inventory | null>;
  updateQuantity(id: string, quantityAvailable: number): Promise<void>;
}

export interface IPromotionRepository {
  list(): Promise<Promotion[]>;
  getById(id: string): Promise<Promotion | null>;
  listActive(): Promise<Promotion[]>;
}

export interface ICouponRepository {
  getByCode(code: string): Promise<Coupon | null>;
  incrementUses(id: string): Promise<void>;
}

export interface ICustomerRepository {
  getById(id: string): Promise<CustomerProfile | null>;
  getByEmail(email: string): Promise<CustomerProfile | null>;
  create(data: Omit<CustomerProfile, "id">): Promise<CustomerProfile>;
  update(id: string, data: Partial<CustomerProfile>): Promise<CustomerProfile>;
  list(options?: { limit?: number; offset?: number }): Promise<CustomerProfile[]>;
}

export interface IFidelityTagRepository {
  getById(id: string): Promise<FidelityTag | null>;
  list(): Promise<FidelityTag[]>;
}

export interface IAddressRepository {
  listByCustomerId(customerId: string): Promise<Address[]>;
  getById(id: string): Promise<Address | null>;
  create(data: Omit<Address, "id">): Promise<Address>;
  update(id: string, data: Partial<Address>): Promise<Address>;
  delete(id: string): Promise<void>;
  setDefault(id: string, customerId: string): Promise<void>;
}

export interface IOrderRepository {
  getById(id: string): Promise<Order | null>;
  listByCustomerId(customerId: string): Promise<Order[]>;
  create(data: Omit<Order, "id">): Promise<Order>;
  updateStatus(id: string, status: Order["status"]): Promise<void>;
  update(id: string, data: Partial<Order>): Promise<Order>;
  listRecent(limit: number): Promise<Order[]>;
}

export interface IDistributorRequestRepository {
  create(data: Omit<DistributorRequest, "id">): Promise<DistributorRequest>;
  getByCustomerId(customerId: string): Promise<DistributorRequest | null>;
  getById(id: string): Promise<DistributorRequest | null>;
  update(id: string, data: Partial<DistributorRequest>): Promise<DistributorRequest>;
  listPending(): Promise<DistributorRequest[]>;
}

export interface IXPTransactionRepository {
  create(data: Omit<XPTransaction, "id">): Promise<XPTransaction>;
  listByCustomerId(customerId: string): Promise<XPTransaction[]>;
}

export interface IXPLevelRepository {
  list(): Promise<XPLevel[]>;
  getById(id: string): Promise<XPLevel | null>;
}

export interface INotificationRepository {
  create(data: Omit<Notification, "id">): Promise<Notification>;
  listByCustomerId(customerId: string): Promise<Notification[]>;
  markAsRead(id: string): Promise<void>;
  markAllAsRead(customerId: string): Promise<void>;
  countUnread(customerId: string): Promise<number>;
}

export interface IInventoryMovementRepository {
  create(data: Omit<InventoryMovement, "id">): Promise<InventoryMovement>;
  listBySku(sku: string): Promise<InventoryMovement[]>;
}

export interface ITicketRepository {
  create(data: Omit<Ticket, "id">): Promise<Ticket>;
  listByCustomerId(customerId: string): Promise<Ticket[]>;
  getById(id: string): Promise<Ticket | null>;
}

export interface IEventRepository {
  list(): Promise<Event[]>;
  getBySlug(slug: string): Promise<Event | null>;
  getById(id: string): Promise<Event | null>;
}

export interface IBannerRepository {
  list(): Promise<Banner[]>;
}

export interface IBlogPostRepository {
  list(): Promise<BlogPost[]>;
}

export interface ILandingPageRepository {
  getBySlug(slug: string): Promise<LandingPage | null>;
}

export interface IRepositories {
  products: IProductRepository;
  variants: IVariantRepository;
  inventory: IInventoryRepository;
  promotions: IPromotionRepository;
  coupons: ICouponRepository;
  customers: ICustomerRepository;
  fidelityTags: IFidelityTagRepository;
  addresses: IAddressRepository;
  orders: IOrderRepository;
  distributorRequests: IDistributorRequestRepository;
  xpTransactions: IXPTransactionRepository;
  xpLevels: IXPLevelRepository;
  notifications: INotificationRepository;
  inventoryMovements: IInventoryMovementRepository;
  tickets: ITicketRepository;
  events: IEventRepository;
  banners: IBannerRepository;
  blogPosts: IBlogPostRepository;
  landingPages: ILandingPageRepository;
}
