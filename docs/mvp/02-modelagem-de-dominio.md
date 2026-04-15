# Depilmoni MVP - Modelagem de Dominio

## 1. Entidades e Relacionamentos

### Diagrama de Entidades (texto)

```
CustomerProfile -|---<| Order
CustomerProfile -|---<| Address
CustomerProfile -|---<| XPTransaction
CustomerProfile -|---<| Notification
CustomerProfile -|---<| DistributorRequest
CustomerProfile >---|- XPLevel
CustomerProfile >---<- CustomerTag
CustomerProfile >---<- FidelityTag

Order -|---<| OrderItem
Order -|---<| OrderStatusHistory
Order -|--|- ShippingInfo

OrderItem >---|- ProductVariant
OrderItem >---|- EventBatch

Product -|---<| ProductVariant
ProductVariant -|--|- Inventory
Inventory -|---<| InventoryMovement

Promotion >---<- ProductVariant
Coupon >---<- CustomerProfileType

Event -|---<| EventBatch
EventBatch -|---<| Ticket
Ticket >---|- CustomerProfile
Ticket >---|- Order

BlogPost (standalone)
Banner (standalone)
LandingPage -|---<| LandingPageBlock
```

---

## 2. Entidades Novas ou Alteradas

### 2.1 CustomerProfile (ALTERAR)

Campos existentes mantidos. Adicionar:

```typescript
// packages/core/src/domain/models.ts - Extensoes ao CustomerProfileSchema

export const DistributorStatusSchema = z.enum([
  "none",              // nao solicitou
  "pending_review",    // solicitacao enviada
  "approved",          // aprovado como distribuidor
  "rejected"           // rejeitado
]);

export const CustomerProfileSchema = z.object({
  // --- campos existentes ---
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  role: RoleSchema,
  profileType: CustomerProfileTypeSchema,
  tags: z.array(z.string()),
  fidelityTagIds: z.array(z.string()),
  xpBalance: z.number().int().nonnegative(),
  levelId: z.string(),
  benefitsUnlocked: z.array(z.string()),
  orderIds: z.array(z.string()),
  ticketIds: z.array(z.string()),

  // --- campos NOVOS ---
  phone: z.string().optional(),
  cpf: z.string().optional(),
  avatarUrl: z.string().optional(),
  passwordHash: z.string(),               // auth
  addressIds: z.array(z.string()).default([]),
  distributorStatus: DistributorStatusSchema.default("none"),
  createdAt: z.string(),
  updatedAt: z.string(),
});
```

### 2.2 DistributorRequest (NOVO)

```typescript
export const DistributorRequestSchema = z.object({
  id: z.string(),
  customerId: z.string(),               // referencia ao CustomerProfile
  responsibleName: z.string(),
  email: z.string().email(),
  phone: z.string(),
  companyName: z.string(),              // razao social
  tradeName: z.string(),               // nome fantasia
  cnpj: z.string(),
  stateRegistration: z.string().optional(),
  commercialAddress: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    zipCode: z.string(),
    neighborhood: z.string().optional(),
  }),
  website: z.string().optional(),
  socialMedia: z.string().optional(),
  observations: z.string().optional(),
  documents: z.array(z.string()).default([]),  // URLs de uploads
  termsAccepted: z.boolean(),
  status: DistributorStatusSchema,
  reviewedBy: z.string().nullable().default(null),    // admin que revisou
  reviewedAt: z.string().nullable().default(null),
  reviewNotes: z.string().optional(),
  createdAt: z.string(),
});
```

### 2.3 Address (NOVO)

```typescript
export const AddressSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  label: z.string().default("Principal"),      // "Casa", "Trabalho", etc
  recipientName: z.string(),
  street: z.string(),
  number: z.string(),
  complement: z.string().optional(),
  neighborhood: z.string(),
  city: z.string(),
  state: z.string(),
  zipCode: z.string(),
  isDefault: z.boolean().default(false),
  latitude: z.number().optional(),             // para mapa de clientes
  longitude: z.number().optional(),
  createdAt: z.string(),
});
```

### 2.4 Order (ALTERAR)

Expandir status e adicionar campos de fulfillment:

```typescript
export const OrderStatusSchema = z.enum([
  "pending",           // pedido criado, aguardando pagamento
  "awaiting-payment",  // pagamento iniciado
  "paid",              // pagamento confirmado
  "processing",        // preparando para envio
  "shipped",           // enviado
  "delivered",         // entregue
  "cancelled",         // cancelado
  "refunded"           // reembolsado
]);

export const OrderSchema = z.object({
  // --- campos existentes mantidos ---
  id: z.string(),
  customerId: z.string(),
  code: z.string(),
  status: OrderStatusSchema,
  items: z.array(OrderItemSchema),
  subtotal: z.number().nonnegative(),
  profileDiscount: z.number().nonnegative(),
  fidelityDiscount: z.number().nonnegative(),
  promotionDiscount: z.number().nonnegative(),
  couponDiscount: z.number().nonnegative(),
  shippingAmount: z.number().nonnegative(),
  total: z.number().nonnegative(),
  xpEarned: z.number().int().nonnegative(),
  createdAt: z.string(),

  // --- campos NOVOS ---
  shippingAddressId: z.string().optional(),
  paymentMethod: z.enum(["credit-card", "pix"]),
  paymentExternalId: z.string().optional(),       // ID do gateway
  couponCode: z.string().optional(),
  trackingCode: z.string().optional(),
  trackingUrl: z.string().optional(),
  shippedAt: z.string().optional(),
  deliveredAt: z.string().optional(),
  updatedAt: z.string(),
});
```

### 2.5 OrderStatusHistory (NOVO)

```typescript
export const OrderStatusHistorySchema = z.object({
  id: z.string(),
  orderId: z.string(),
  fromStatus: OrderStatusSchema.nullable(),
  toStatus: OrderStatusSchema,
  changedBy: z.string(),           // userId ou "system"
  note: z.string().optional(),
  createdAt: z.string(),
});
```

### 2.6 InventoryMovement (NOVO)

```typescript
export const InventoryMovementTypeSchema = z.enum([
  "sale",             // baixa por venda
  "return",           // devolucao
  "adjustment",       // ajuste manual
  "restock",          // reposicao
  "reservation",      // reserva temporaria
  "reservation-cancel" // cancelamento de reserva
]);

export const InventoryMovementSchema = z.object({
  id: z.string(),
  inventoryId: z.string(),
  sku: z.string(),
  type: InventoryMovementTypeSchema,
  quantity: z.number().int(),          // positivo = entrada, negativo = saida
  previousStock: z.number().int(),
  newStock: z.number().int(),
  orderId: z.string().optional(),
  changedBy: z.string(),
  note: z.string().optional(),
  createdAt: z.string(),
});
```

### 2.7 Notification (NOVO)

```typescript
export const NotificationTypeSchema = z.enum([
  "order-status",         // mudanca de status do pedido
  "promotion",            // nova promocao
  "coupon",               // cupom disponivel
  "xp-earned",            // XP ganho
  "level-up",             // subiu de nivel
  "distributor-approved",
  "distributor-rejected",
  "event-reminder",
  "system"
]);

export const NotificationSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  type: NotificationTypeSchema,
  title: z.string(),
  message: z.string(),
  href: z.string().optional(),        // link para acao
  read: z.boolean().default(false),
  createdAt: z.string(),
});
```

### 2.8 Promotion (ALTERAR)

Adicionar campo de multiplicador de XP:

```typescript
export const PromotionSchema = z.object({
  // --- campos existentes ---
  id: z.string(),
  name: z.string(),
  scope: PromotionScopeSchema,
  discountType: DiscountTypeSchema,
  value: z.number().positive(),
  startsAt: z.string(),
  endsAt: z.string(),
  active: z.boolean(),
  applicableProductIds: z.array(z.string()).default([]),
  applicableCategories: z.array(z.string()).default([]),

  // --- campos NOVOS ---
  xpMultiplier: z.number().positive().default(1),    // ex: 2 = dobro de XP
  eligibleProfiles: z.array(CustomerProfileTypeSchema).default([]),
  eligibleTags: z.array(z.string()).default([]),
});
```

### 2.9 Coupon (ALTERAR)

Adicionar elegibilidade por perfil:

```typescript
export const CouponSchema = z.object({
  // --- campos existentes ---
  id: z.string(),
  code: z.string(),
  discountType: DiscountTypeSchema,
  value: z.number().positive(),
  minPurchase: z.number().nonnegative().optional(),
  active: z.boolean(),
  startsAt: z.string(),
  endsAt: z.string(),
  combinableWithPromotions: z.boolean().default(true),
  combinableWithFidelity: z.boolean().default(true),

  // --- campos NOVOS ---
  maxUses: z.number().int().positive().optional(),        // limite total de uso
  currentUses: z.number().int().nonnegative().default(0),
  eligibleProfiles: z.array(CustomerProfileTypeSchema).default([]),
  eligibleTags: z.array(z.string()).default([]),
});
```

### 2.10 AuthSession (NOVO - conceitual)

```typescript
// Gerenciado pelo Payload CMS ou JWT customizado
export const AuthSessionSchema = z.object({
  userId: z.string(),
  email: z.string().email(),
  role: RoleSchema,
  profileType: CustomerProfileTypeSchema,
  expiresAt: z.string(),
});
```

---

## 3. Enums e Status Consolidados

```typescript
// Perfis de usuario
export type CustomerProfileType = "client" | "partner" | "distributor";

// Roles do sistema
export type Role = "admin" | "manager" | "content-editor" | "authenticated-customer";

// Status de distribuidor
export type DistributorStatus = "none" | "pending_review" | "approved" | "rejected";

// Status de pedido
export type OrderStatus = "pending" | "awaiting-payment" | "paid" | "processing"
                        | "shipped" | "delivered" | "cancelled" | "refunded";

// Tipo de desconto
export type DiscountType = "percentage" | "fixed";

// Escopo de promocao
export type PromotionScope = "product" | "category" | "order" | "event";

// Status de lote de evento
export type BatchStatus = "scheduled" | "active" | "sold-out";

// Status de ticket
export type TicketStatus = "reserved" | "confirmed" | "checked-in";

// Tipo de movimentacao de estoque
export type InventoryMovementType = "sale" | "return" | "adjustment" | "restock"
                                  | "reservation" | "reservation-cancel";

// Tipo de notificacao
export type NotificationType = "order-status" | "promotion" | "coupon" | "xp-earned"
                             | "level-up" | "distributor-approved" | "distributor-rejected"
                             | "event-reminder" | "system";

// Fonte de XP
export type XPSource = "order-paid" | "event-ticket" | "manual-adjustment";

// Metodo de pagamento
export type PaymentMethod = "credit-card" | "pix";
```

---

## 4. Collections Payload CMS - Novas ou Alteradas

### 4.1 Customers (NOVA collection)

Separar customers do storefront dos Users do admin:

```typescript
// apps/cms/src/collections/Customers.ts
{
  slug: "customers",
  auth: true,                    // habilita login/registro via Payload
  fields: [
    { name: "name", type: "text", required: true },
    { name: "phone", type: "text" },
    { name: "cpf", type: "text" },
    { name: "avatar", type: "upload", relationTo: "media" },
    { name: "profileType", type: "select",
      options: ["client", "partner", "distributor"],
      defaultValue: "client" },
    { name: "distributorStatus", type: "select",
      options: ["none", "pending_review", "approved", "rejected"],
      defaultValue: "none" },
    { name: "tags", type: "array", fields: [{ name: "value", type: "text" }] },
    { name: "fidelityTags", type: "relationship", relationTo: "fidelity-tags", hasMany: true },
    { name: "xpBalance", type: "number", defaultValue: 0 },
    { name: "level", type: "relationship", relationTo: "xp-levels" },
    { name: "benefitsUnlocked", type: "array", fields: [{ name: "value", type: "text" }] },
  ],
  access: {
    read: isAuthenticated,
    create: publicRead,         // registro publico
    update: isAuthenticated,    // proprio usuario ou admin
    delete: isAdmin,
  }
}
```

### 4.2 Addresses (NOVA collection)

```typescript
// apps/cms/src/collections/Addresses.ts
{
  slug: "addresses",
  fields: [
    { name: "customer", type: "relationship", relationTo: "customers", required: true },
    { name: "label", type: "text", defaultValue: "Principal" },
    { name: "recipientName", type: "text", required: true },
    { name: "street", type: "text", required: true },
    { name: "number", type: "text", required: true },
    { name: "complement", type: "text" },
    { name: "neighborhood", type: "text", required: true },
    { name: "city", type: "text", required: true },
    { name: "state", type: "text", required: true },
    { name: "zipCode", type: "text", required: true },
    { name: "isDefault", type: "checkbox", defaultValue: false },
    { name: "latitude", type: "number" },
    { name: "longitude", type: "number" },
  ],
}
```

### 4.3 Orders (NOVA collection)

```typescript
// apps/cms/src/collections/Orders.ts
{
  slug: "orders",
  fields: [
    { name: "customer", type: "relationship", relationTo: "customers", required: true },
    { name: "code", type: "text", required: true, unique: true },
    { name: "status", type: "select",
      options: ["pending", "awaiting-payment", "paid", "processing", "shipped", "delivered", "cancelled", "refunded"] },
    { name: "items", type: "json" },
    { name: "subtotal", type: "number" },
    { name: "profileDiscount", type: "number", defaultValue: 0 },
    { name: "fidelityDiscount", type: "number", defaultValue: 0 },
    { name: "promotionDiscount", type: "number", defaultValue: 0 },
    { name: "couponDiscount", type: "number", defaultValue: 0 },
    { name: "couponCode", type: "text" },
    { name: "shippingAmount", type: "number", defaultValue: 0 },
    { name: "shippingAddress", type: "relationship", relationTo: "addresses" },
    { name: "total", type: "number", required: true },
    { name: "paymentMethod", type: "select", options: ["credit-card", "pix"] },
    { name: "paymentExternalId", type: "text" },
    { name: "xpEarned", type: "number", defaultValue: 0 },
    { name: "trackingCode", type: "text" },
    { name: "trackingUrl", type: "text" },
    { name: "shippedAt", type: "date" },
    { name: "deliveredAt", type: "date" },
  ],
}
```

### 4.4 DistributorRequests (NOVA collection)

```typescript
// apps/cms/src/collections/DistributorRequests.ts
{
  slug: "distributor-requests",
  fields: [
    { name: "customer", type: "relationship", relationTo: "customers", required: true },
    { name: "responsibleName", type: "text", required: true },
    { name: "companyName", type: "text", required: true },
    { name: "tradeName", type: "text", required: true },
    { name: "cnpj", type: "text", required: true },
    { name: "stateRegistration", type: "text" },
    { name: "phone", type: "text", required: true },
    { name: "commercialAddress", type: "group", fields: [
      { name: "street", type: "text" },
      { name: "city", type: "text" },
      { name: "state", type: "text" },
      { name: "zipCode", type: "text" },
    ]},
    { name: "website", type: "text" },
    { name: "socialMedia", type: "text" },
    { name: "observations", type: "textarea" },
    { name: "documents", type: "array", fields: [
      { name: "file", type: "upload", relationTo: "media" }
    ]},
    { name: "termsAccepted", type: "checkbox", required: true },
    { name: "status", type: "select",
      options: ["pending_review", "approved", "rejected"],
      defaultValue: "pending_review" },
    { name: "reviewedBy", type: "relationship", relationTo: "users" },
    { name: "reviewedAt", type: "date" },
    { name: "reviewNotes", type: "textarea" },
  ],
}
```

### 4.5 XPTransactions (NOVA collection)

```typescript
// apps/cms/src/collections/XPTransactions.ts
{
  slug: "xp-transactions",
  fields: [
    { name: "customer", type: "relationship", relationTo: "customers", required: true },
    { name: "amount", type: "number", required: true },
    { name: "source", type: "select", options: ["order-paid", "event-ticket", "manual-adjustment"] },
    { name: "referenceId", type: "text" },
    { name: "description", type: "text" },
  ],
}
```

### 4.6 Notifications (NOVA collection)

```typescript
// apps/cms/src/collections/Notifications.ts
{
  slug: "notifications",
  fields: [
    { name: "customer", type: "relationship", relationTo: "customers", required: true },
    { name: "type", type: "select",
      options: ["order-status", "promotion", "coupon", "xp-earned", "level-up",
                "distributor-approved", "distributor-rejected", "event-reminder", "system"] },
    { name: "title", type: "text", required: true },
    { name: "message", type: "text", required: true },
    { name: "href", type: "text" },
    { name: "read", type: "checkbox", defaultValue: false },
  ],
}
```

### 4.7 InventoryMovements (NOVA collection)

```typescript
// apps/cms/src/collections/InventoryMovements.ts
{
  slug: "inventory-movements",
  fields: [
    { name: "product", type: "relationship", relationTo: "products" },
    { name: "sku", type: "text", required: true },
    { name: "type", type: "select",
      options: ["sale", "return", "adjustment", "restock", "reservation", "reservation-cancel"] },
    { name: "quantity", type: "number", required: true },
    { name: "previousStock", type: "number" },
    { name: "newStock", type: "number" },
    { name: "order", type: "relationship", relationTo: "orders" },
    { name: "changedBy", type: "text" },
    { name: "note", type: "text" },
  ],
}
```

---

## 5. Resumo de Alteracoes no Banco

### Collections Payload EXISTENTES (manter + expandir)
| Collection | Alteracao |
|-----------|-----------|
| Products | Adicionar campo `active` (boolean) |
| Promotions | Adicionar `xpMultiplier`, `eligibleProfiles`, `eligibleTags` |
| Coupons | Adicionar `maxUses`, `currentUses`, `eligibleProfiles`, `eligibleTags` |
| Users | Sem alteracao (admin users) |
| Media | Sem alteracao |
| Banners | Sem alteracao |
| BlogPosts | Sem alteracao |
| LandingPages | Sem alteracao |
| XPLevels | Sem alteracao |
| FidelityTags | Sem alteracao |
| Events | Sem alteracao |

### Collections Payload NOVAS
| Collection | Tabela PostgreSQL |
|-----------|-------------------|
| Customers | `customers` |
| Addresses | `addresses` |
| Orders | `orders` |
| DistributorRequests | `distributor_requests` |
| XPTransactions | `xp_transactions` |
| Notifications | `notifications` |
| InventoryMovements | `inventory_movements` |

Total: **7 novas collections** + **3 collections alteradas**
