# Depilmoni MVP - Paginas, APIs e Fluxos

## 1. Lista de Paginas/Telas do MVP

### 1.1 Paginas Publicas (existentes - manter)

| Rota | Arquivo | Status |
|------|---------|--------|
| `/` | `app/page.tsx` | EXISTE |
| `/produtos` | `app/produtos/page.tsx` | EXISTE |
| `/produtos/[slug]` | `app/produtos/[slug]/page.tsx` | EXISTE |
| `/kits` | `app/kits/page.tsx` | EXISTE |
| `/eventos` | `app/eventos/page.tsx` | EXISTE |
| `/eventos/[slug]` | `app/eventos/[slug]/page.tsx` | EXISTE |
| `/blog` | `app/blog/page.tsx` | EXISTE |
| `/carrinho` | `app/carrinho/page.tsx` | EXISTE |

### 1.2 Paginas de Autenticacao (NOVAS)

| Rota | Arquivo | Descricao |
|------|---------|-----------|
| `/login` | `app/login/page.tsx` | Login com email/senha |
| `/cadastro` | `app/cadastro/page.tsx` | Registro de comprador |
| `/cadastro/distribuidor` | `app/cadastro/distribuidor/page.tsx` | Solicitacao de distribuidor |
| `/esqueci-senha` | `app/esqueci-senha/page.tsx` | Recuperacao de senha |

### 1.3 Paginas da Central do Usuario (NOVAS/EVOLUIR)

| Rota | Arquivo | Status |
|------|---------|--------|
| `/minha-conta` | `app/minha-conta/page.tsx` | EVOLUIR - dashboard resumo |
| `/minha-conta/perfil` | `app/minha-conta/perfil/page.tsx` | NOVO - editar dados pessoais |
| `/minha-conta/enderecos` | `app/minha-conta/enderecos/page.tsx` | NOVO - CRUD enderecos |
| `/minha-conta/pedidos` | `app/minha-conta/pedidos/page.tsx` | NOVO - listar pedidos |
| `/minha-conta/pedidos/[id]` | `app/minha-conta/pedidos/[id]/page.tsx` | NOVO - detalhe do pedido |
| `/minha-conta/experiencia` | `app/minha-conta/experiencia/page.tsx` | NOVO - XP, niveis, historico |
| `/minha-conta/notificacoes` | `app/minha-conta/notificacoes/page.tsx` | NOVO - central de notificacoes |
| `/minha-conta/distribuidor` | `app/minha-conta/distribuidor/page.tsx` | NOVO - status da solicitacao |

### 1.4 Checkout (EVOLUIR)

| Rota | Arquivo | Status |
|------|---------|--------|
| `/checkout` | `app/checkout/page.tsx` | EVOLUIR - conectar com dados reais |
| `/checkout/sucesso` | `app/checkout/sucesso/page.tsx` | NOVO - confirmacao pos-pagamento |
| `/checkout/falha` | `app/checkout/falha/page.tsx` | NOVO - pagamento recusado |

### 1.5 Portal de Gerencia (via Payload CMS + custom views)

O Payload CMS ja oferece CRUD automatico em `/admin`. Para o dashboard customizado:

| Rota (Payload) | Tipo | Status |
|----------------|------|--------|
| `/admin` | Payload dashboard | EVOLUIR - adicionar widgets de metricas |
| `/admin/collections/customers` | Payload CRUD | NOVO (collection) |
| `/admin/collections/orders` | Payload CRUD | NOVO (collection) |
| `/admin/collections/distributor-requests` | Payload CRUD | NOVO (collection) |
| `/admin/collections/xp-transactions` | Payload CRUD | NOVO (collection) |
| `/admin/collections/notifications` | Payload CRUD | NOVO (collection) |
| `/admin/collections/inventory-movements` | Payload CRUD | NOVO (collection) |
| `/admin/dashboard` | Custom view | NOVO - metricas e KPIs |
| `/admin/customers/map` | Custom view | NOVO - mapa geolocalizacao |

---

## 2. APIs / Services / Actions

### 2.1 API Routes do Storefront (apps/web/app/api/)

#### Auth
```
POST   /api/auth/register          -> Registro de comprador
POST   /api/auth/login             -> Login (retorna JWT/session)
POST   /api/auth/logout            -> Logout
POST   /api/auth/forgot-password   -> Solicitar reset de senha
POST   /api/auth/reset-password    -> Resetar senha com token
GET    /api/auth/me                -> Dados do usuario logado
```

#### Customer Profile
```
GET    /api/customer/profile              -> Dados do perfil
PATCH  /api/customer/profile              -> Atualizar perfil
POST   /api/customer/avatar               -> Upload de avatar
```

#### Addresses
```
GET    /api/customer/addresses            -> Listar enderecos
POST   /api/customer/addresses            -> Criar endereco
PATCH  /api/customer/addresses/[id]       -> Atualizar endereco
DELETE /api/customer/addresses/[id]       -> Remover endereco
PATCH  /api/customer/addresses/[id]/default -> Marcar como padrao
```

#### Distributor
```
POST   /api/distributor/request           -> Enviar solicitacao
GET    /api/distributor/status            -> Consultar status
```

#### Orders
```
GET    /api/orders                        -> Listar pedidos do usuario
GET    /api/orders/[id]                   -> Detalhe do pedido
```

#### XP
```
GET    /api/xp/summary                   -> Resumo XP (nivel, progresso)
GET    /api/xp/transactions              -> Historico de XP
```

#### Notifications
```
GET    /api/notifications                 -> Listar notificacoes
PATCH  /api/notifications/[id]/read       -> Marcar como lida
PATCH  /api/notifications/read-all        -> Marcar todas como lidas
GET    /api/notifications/unread-count     -> Contador de nao lidas
```

#### Checkout (evoluir o existente)
```
POST   /api/checkout                      -> EVOLUIR (conectar com Payload + gateway real)
POST   /api/shipping/quote                -> EVOLUIR (manter adapter)
POST   /api/coupons/validate              -> NOVO - validar cupom antes do checkout
```

#### Webhooks (receber do gateway)
```
POST   /api/webhooks/mercado-pago         -> Webhook de pagamento (IPN)
```

### 2.2 Payload CMS Custom Endpoints

```
GET    /api/admin/dashboard/metrics       -> KPIs do dashboard gerencial
GET    /api/admin/dashboard/recent-orders -> Ultimos pedidos
GET    /api/admin/dashboard/low-stock     -> Produtos com baixo estoque
GET    /api/admin/customers/map-data      -> Dados para mapa de clientes
PATCH  /api/admin/distributor-requests/[id]/approve  -> Aprovar distribuidor
PATCH  /api/admin/distributor-requests/[id]/reject   -> Rejeitar distribuidor
GET    /api/admin/xp/ranking              -> Ranking de usuarios por XP
```

### 2.3 Application Services (packages/core)

```typescript
// packages/core/src/application/

// EXISTENTES (evoluir)
checkout.ts          -> Conectar com repositories reais
pricing.ts           -> Adicionar xpMultiplier e elegibilidade

// NOVOS
auth.service.ts      -> Logica de registro, login, validacao
customer.service.ts  -> CRUD de perfil, gestao de tags
address.service.ts   -> CRUD de enderecos
order.service.ts     -> Listagem, detalhes, transicao de status
distributor.service.ts -> Solicitacao, aprovacao, rejeicao
xp.service.ts        -> Concessao, consulta, ranking
notification.service.ts -> Criacao e consulta de notificacoes
inventory.service.ts -> Movimentacao, auditoria, alertas
coupon.service.ts    -> Validacao, uso, elegibilidade
```

### 2.4 Repositories (packages/core)

```typescript
// packages/core/src/infrastructure/repositories/

// EXISTENTE (manter para testes)
mock-repositories.ts

// NOVO
payload-repositories.ts  -> Implementacao real via Payload Local API

// Interface
repository-interface.ts  -> Contratos de repositorio para inversao de dependencia
```

---

## 3. Fluxos Principais Detalhados

### 3.1 Cadastro de Comprador

```
1. Usuario acessa /cadastro
2. Preenche formulario:
   - nome completo
   - email
   - senha (min 8 chars)
   - telefone
   - CPF (opcional)
3. Frontend valida com Zod
4. POST /api/auth/register
5. Backend:
   a. Verifica se email ja existe (Payload query)
   b. Hash da senha
   c. Cria customer no Payload (profileType: "client", distributorStatus: "none")
   d. Cria sessao/JWT
   e. Retorna token + dados basicos
6. Frontend:
   a. Salva token (cookie httpOnly ou Zustand + localStorage)
   b. Redireciona para /minha-conta
   c. Toast de boas-vindas
```

### 3.2 Solicitacao de Distribuidor

```
1. Usuario logado acessa /cadastro/distribuidor (ou /minha-conta/distribuidor)
2. Preenche formulario estendido:
   - razao social, nome fantasia, CNPJ, inscricao estadual
   - endereco comercial, telefone
   - site/rede social, observacoes
   - upload de documentos (se suportado)
   - checkbox de aceite de analise
3. POST /api/distributor/request
4. Backend:
   a. Valida dados com Zod
   b. Cria DistributorRequest no Payload (status: "pending_review")
   c. Atualiza CustomerProfile.distributorStatus = "pending_review"
   d. Cria Notification para admins (tipo: system, "Nova solicitacao de distribuidor")
   e. Retorna confirmacao
5. Frontend:
   a. Exibe mensagem "Solicitacao enviada, aguarde analise"
   b. Redireciona para /minha-conta/distribuidor (mostra status)
```

### 3.3 Aprovacao de Distribuidor (Admin)

```
1. Admin acessa /admin/collections/distributor-requests
2. Filtra por status "pending_review"
3. Abre solicitacao e revisa dados/documentos
4. Clica "Aprovar" ou "Rejeitar"
5. PATCH /api/admin/distributor-requests/[id]/approve (ou reject)
6. Backend:
   a. Atualiza DistributorRequest.status = "approved"
   b. Atualiza CustomerProfile.distributorStatus = "approved"
   c. Atualiza CustomerProfile.profileType = "distributor"
   d. Registra reviewedBy (admin id) e reviewedAt
   e. Cria Notification para customer:
      - tipo: "distributor-approved"
      - mensagem: "Sua conta de distribuidor foi aprovada!"
   f. Se rejeitado:
      - status = "rejected"
      - profileType permanece "client"
      - Notification tipo: "distributor-rejected"
7. Admin pode adicionar reviewNotes
```

### 3.4 Compra com Pagamento Aprovado

```
1. Usuario navega /produtos ou /eventos, adiciona itens ao carrinho (Zustand store)
2. Acessa /carrinho -> revisa itens, quantidades
3. Acessa /checkout
4. Etapas do checkout:
   a. ENDERECO
      - Seleciona endereco salvo ou preenche novo
      - Se novo, salva automaticamente via POST /api/customer/addresses
   b. FRETE
      - POST /api/shipping/quote com CEP + items
      - Exibe opcoes (PAC, SEDEX, digital)
      - Usuario seleciona
   c. CUPOM (opcional)
      - Digita codigo
      - POST /api/coupons/validate
      - Backend valida: ativo, dentro da data, perfil elegivel, limite de uso
      - Frontend aplica desconto no resumo
   d. PAGAMENTO
      - Seleciona metodo (cartao de credito ou PIX)
      - Se cartao: exibe parcelamento
   e. RESUMO
      - Mostra breakdown completo (subtotal, descontos, frete, total, XP a ganhar)
5. Confirma pedido -> POST /api/checkout
6. Backend (checkout.service.ts):
   a. Resolve contexto do customer (perfil, fidelidade, nivel)
   b. Valida cupom novamente (double-check)
   c. Calcula pricing final (pricing.ts)
   d. Reserva inventario (inventory.service.ts)
      - Registra InventoryMovement tipo "reservation"
   e. Cria Order no Payload (status: "awaiting-payment")
   f. Chama gateway de pagamento (mercado-pago.adapter.ts)
      - Envia amount, method, customer info
   g. Se pagamento aprovado:
      - Atualiza Order.status = "paid"
      - Converte reserva em baixa definitiva (InventoryMovement tipo "sale")
      - Concede XP (xp.service.ts)
        - Calcula: Math.floor(total) * promotion.xpMultiplier
        - Cria XPTransaction
        - Atualiza customer.xpBalance
        - Verifica level-up
      - Se houver tickets: gera com QR code
      - Atualiza coupon.currentUses (se aplicavel)
      - Cria Notification: "Pedido confirmado!"
      - Registra OrderStatusHistory
      - Dispara evento interno: "order.paid"
   h. Retorna { order, tickets, installments }
7. Frontend:
   a. Redireciona para /checkout/sucesso
   b. Exibe resumo do pedido, XP ganho, tickets (se houver)
   c. Limpa carrinho (Zustand)
```

### 3.5 Compra com Pagamento Recusado

```
1-5. Mesmo fluxo ate POST /api/checkout
6. Backend:
   a. Resolve contexto, calcula pricing, reserva inventario
   b. Cria Order (status: "awaiting-payment")
   c. Chama gateway -> pagamento RECUSADO
   d. Atualiza Order.status = "cancelled" (ou mantem "awaiting-payment" para retry)
   e. Cancela reserva de inventario (InventoryMovement tipo "reservation-cancel")
   f. NAO concede XP
   g. NAO baixa estoque definitivamente
   h. Cria Notification: "Pagamento nao aprovado"
   i. Registra OrderStatusHistory
   j. Retorna erro com motivo
7. Frontend:
   a. Redireciona para /checkout/falha
   b. Exibe motivo e opcao de tentar novamente
   c. Carrinho permanece intacto
```

### 3.6 Concessao de XP

```
Trigger: pagamento aprovado (automatico) ou ajuste manual (admin)

1. xp.service.ts recebe:
   - customerId
   - amount (base XP)
   - source ("order-paid" | "event-ticket" | "manual-adjustment")
   - referenceId (orderId, eventId, etc)

2. Verifica se existem promocoes ativas com xpMultiplier > 1
   - Se sim: amount = amount * xpMultiplier

3. Cria XPTransaction no Payload:
   { customerId, amount: finalAmount, source, referenceId }

4. Atualiza customer.xpBalance += finalAmount

5. Verifica level-up:
   a. Busca todos XPLevels ordenados por minXP
   b. Encontra maior nivel onde minXP <= customer.xpBalance
   c. Se nivel mudou:
      - Atualiza customer.levelId
      - Atualiza customer.benefitsUnlocked
      - Cria Notification tipo "level-up"

6. Retorna { xpEarned: finalAmount, newBalance, levelUp: boolean, newLevel? }
```

### 3.7 Criacao e Uso de Cupom

```
CRIACAO (admin):
1. Admin acessa /admin/collections/coupons
2. Preenche:
   - code, discountType (percentage/fixed), value
   - minPurchase, startsAt, endsAt
   - maxUses, eligibleProfiles, eligibleTags
   - combinableWithPromotions, combinableWithFidelity
3. Payload salva no PostgreSQL

USO (customer):
1. No checkout, usuario digita codigo do cupom
2. POST /api/coupons/validate { code, customerId, cartTotal }
3. Backend valida:
   a. Cupom existe? -> 404 se nao
   b. Cupom ativo? -> "Cupom inativo"
   c. Dentro do periodo (startsAt <= now <= endsAt)? -> "Cupom expirado"
   d. currentUses < maxUses? -> "Limite de uso atingido"
   e. minPurchase <= cartTotal? -> "Valor minimo nao atingido"
   f. Customer.profileType in eligibleProfiles? (se vazio, vale para todos)
   g. Customer.tags intersect eligibleTags? (se vazio, vale para todos)
4. Se valido: retorna cupom com valor de desconto calculado
5. No checkout final: aplica desconto e incrementa currentUses
```

### 3.8 Criacao de Promocao com Bonus de XP

```
CRIACAO (admin):
1. Admin acessa /admin/collections/promotions
2. Preenche:
   - name, scope, discountType, value
   - startsAt, endsAt, active
   - applicableProductIds e/ou applicableCategories
   - xpMultiplier (ex: 2.0 para dobro de XP)
   - eligibleProfiles, eligibleTags
3. Payload salva

APLICACAO AUTOMATICA:
1. Durante checkout, pricing.ts busca promocoes ativas
2. Filtra por:
   - active = true
   - startsAt <= now <= endsAt
   - scope + productId/category match
   - eligibleProfiles match (se definido)
3. Aplica desconto no preco
4. Passa xpMultiplier para xp.service.ts
5. XP final = Math.floor(total) * max(xpMultiplier de todas promocoes aplicaveis)
```

---

## 4. Regras de Autenticacao e Autorizacao por Perfil

### 4.1 Storefront (apps/web)

| Recurso | Nao logado | client | partner | distributor |
|---------|-----------|--------|---------|-------------|
| Homepage, produtos, eventos, blog | Sim | Sim | Sim | Sim |
| Carrinho | Sim | Sim | Sim | Sim |
| Checkout | Nao | Sim | Sim | Sim |
| /minha-conta/* | Nao | Sim | Sim | Sim |
| Precos diferenciados | Nao | Base | Partner | Distributor |
| Solicitar distribuidor | Nao | Sim | Sim | Nao (ja e) |
| Ver status distribuidor | Nao | Se solicitou | Se solicitou | Sim |

### 4.2 Admin (Payload CMS)

| Recurso | content-editor | manager | admin |
|---------|---------------|---------|-------|
| Dashboard metricas | Nao | Sim | Sim |
| Blog/Banners/Landing | Sim | Sim | Sim |
| Produtos/Catalogo | Nao | Sim | Sim |
| Promocoes/Cupons | Nao | Sim | Sim |
| Pedidos | Nao | Sim | Sim |
| Usuarios/Customers | Nao | Sim | Sim |
| Aprovar distribuidor | Nao | Sim | Sim |
| XP manual | Nao | Nao | Sim |
| Configuracoes sistema | Nao | Nao | Sim |

### 4.3 Middleware de Protecao (apps/web)

```typescript
// apps/web/middleware.ts (NOVO)

const protectedRoutes = [
  "/minha-conta",
  "/checkout",
];

const authRoutes = [
  "/login",
  "/cadastro",
];

// Se nao logado e tenta acessar rota protegida -> redirect /login
// Se logado e tenta acessar login/cadastro -> redirect /minha-conta
```

---

## 5. Eventos, Webhooks e Jobs Assincronos

### 5.1 Eventos Internos (event bus simples)

```typescript
// packages/core/src/infrastructure/events/event-bus.ts (NOVO)

type DomainEvent =
  | { type: "order.created"; payload: { orderId: string; customerId: string } }
  | { type: "order.paid"; payload: { orderId: string; customerId: string; total: number } }
  | { type: "order.shipped"; payload: { orderId: string; trackingCode: string } }
  | { type: "order.delivered"; payload: { orderId: string } }
  | { type: "order.cancelled"; payload: { orderId: string; reason: string } }
  | { type: "xp.earned"; payload: { customerId: string; amount: number; source: string } }
  | { type: "xp.level-up"; payload: { customerId: string; newLevel: string } }
  | { type: "distributor.requested"; payload: { customerId: string; requestId: string } }
  | { type: "distributor.approved"; payload: { customerId: string } }
  | { type: "distributor.rejected"; payload: { customerId: string } }
  | { type: "inventory.low-stock"; payload: { sku: string; current: number; threshold: number } };
```

### 5.2 Webhooks Externos

```
POST /api/webhooks/mercado-pago
  -> Recebe IPN (Instant Payment Notification)
  -> Valida assinatura
  -> Atualiza status do pedido
  -> Se aprovado: dispara "order.paid"
  -> Se recusado: dispara "order.cancelled"
```

### 5.3 Event Handlers (Listeners)

```typescript
// Reagir a eventos de dominio:

on("order.paid") -> {
  awardXP(customerId, total)
  createNotification("Pedido confirmado!")
  updateOrderStatus("paid")
  convertReservationToSale(orderId)
}

on("order.shipped") -> {
  createNotification("Pedido enviado! Rastreio: {trackingCode}")
  updateOrderStatus("shipped")
}

on("xp.level-up") -> {
  createNotification("Parabens! Voce subiu para o nivel {newLevel}!")
}

on("distributor.approved") -> {
  updateCustomerProfile(profileType: "distributor")
  createNotification("Sua conta de distribuidor foi aprovada!")
}

on("inventory.low-stock") -> {
  createNotification(admin, "Estoque baixo: {sku} com apenas {current} unidades")
}
```
