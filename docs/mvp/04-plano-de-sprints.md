# Depilmoni MVP - Plano de Sprints e Implementação

> **Última atualização**: 2026-04-15
> **Status global**: Sprints 1, 2, 3, 4 e 5 concluídas. Sprint 6 pronta para iniciar.
> **Checkpoint de referência**: [checkpoint-2026-04-15.md](./checkpoint-2026-04-15.md)

## Legenda de status

| Símbolo | Significado |
|---|---|
| ✅ | Concluído e validado end-to-end |
| 🟡 | Parcial — base pronta, falta refino/integração |
| ⏳ | Pendente (não iniciado) |
| 🔵 | Planejado para fase posterior ao MVP |

---

## 1. Plano por Sprints

### ✅ SPRINT 1 — Fundação: Auth + Collections + Persistência  (CONCLUÍDA)

**Objetivo**: Sair do mock e ter usuários reais com login funcional.

#### Tarefas

| # | Item | Status | Observação |
|---|---|---|---|
| 1 | Collection `Customers` no Payload (auth habilitado) | ✅ | [apps/cms/src/collections/Customers.ts](apps/cms/src/collections/Customers.ts) — profileType, tags, fidelityTags, xpBalance, level, benefitsUnlocked, distributorStatus |
| 2 | Collection `Addresses` | ✅ | [apps/cms/src/collections/Addresses.ts](apps/cms/src/collections/Addresses.ts) com relationship → customers |
| 3 | Collection `Orders` | ✅ | [apps/cms/src/collections/Orders.ts](apps/cms/src/collections/Orders.ts) com relationship → customers + addresses |
| 4 | Collection `DistributorRequests` | ✅ | [apps/cms/src/collections/DistributorRequests.ts](apps/cms/src/collections/DistributorRequests.ts) |
| 5 | Collections `XPTransactions`, `Notifications`, `InventoryMovements` | ✅ | Todas criadas com campos completos |
| 6 | Alterações em `Products`, `Promotions`, `Coupons` | ✅ | `active`, `xpMultiplier`, `eligibleProfiles`, `eligibleTags`, `maxUses`, `currentUses` aplicados |
| 7 | `repository-interface.ts` | ✅ | [packages/core/src/infrastructure/repositories/repository-interface.ts](packages/core/src/infrastructure/repositories/repository-interface.ts) |
| 8 | `payload-repositories.ts` (implementação real via Local API) | ✅ | [packages/core/src/infrastructure/repositories/payload-repositories.ts](packages/core/src/infrastructure/repositories/payload-repositories.ts) — mock continua funcional para dev |

#### Critérios de Aceite (todos ✅)
- [x] Payload inicia com todas as 17 collections
- [x] CRUD via admin funcional
- [x] Testes unitários de pricing/repositories passando
- [x] Mock repositories ainda utilizáveis via feature flag

---

### ✅ SPRINT 2 — Autenticação e Cadastro  (CONCLUÍDA)

**Objetivo**: Usuário pode se registrar, logar e manter sessão no storefront.

#### Tarefas

| # | Item | Status | Observação |
|---|---|---|---|
| 1 | API routes de auth | ✅ | `/api/auth/{register,login,logout,me,forgot-password}` |
| 2 | `auth.service.ts` com Zod + Payload auth | ✅ | [packages/core/src/application/auth.service.ts](packages/core/src/application/auth.service.ts) |
| 3 | Página `/login` | ✅ | Formulário + toast + Zustand |
| 4 | Página `/cadastro` | ✅ | Validação Zod client + server |
| 5 | Middleware de proteção de rotas | ✅ | [apps/web/middleware.ts](apps/web/middleware.ts) protegendo `/minha-conta/*` e `/checkout` |
| 6 | Auth store (Zustand) + header dinâmico | ✅ | [apps/web/src/store/auth-store.ts](apps/web/src/store/auth-store.ts) + `site-header.tsx` com `useAuthStore` |
| 7 | Página `/cadastro/distribuidor` | ⏳ | Rebalanceada para Sprint 3 (ver abaixo) |
| 8 | **Bootstrap de admin via seed** | ✅ | `pnpm seed:admin` idempotente, credenciais em `.env` |

#### Critérios de Aceite
- [x] Usuário consegue criar conta como comprador
- [x] Login mantém sessão (JWT httpOnly, 7d)
- [x] Rotas protegidas redirecionam para `/login`
- [x] Header exibe nome do usuário logado
- [x] Senhas hasheadas (bcrypt via Payload)
- [x] CRUD de customers via admin REST validado (criar, listar, editar profileType/tags/XP, deletar)
- [ ] Formulário de distribuidor — **movido para Sprint 3** (dependia da página /minha-conta/distribuidor)

---

### ✅ SPRINT 3 — Central do Usuário  (CONCLUÍDA E VALIDADA)

**Objetivo**: Área autenticada completa com perfil, endereços, pedidos, XP, notificações e fluxo de distribuidor.

#### Tarefas detalhadas

##### 3.1 Layout e dashboard
- **Arquivo**: `apps/web/app/minha-conta/layout.tsx` (NOVO)
  - Sidebar persistente em desktop: Perfil · Endereços · Pedidos · Experiência · Notificações · Distribuidor
  - Tabs horizontais no mobile (`<md`)
  - Item "Distribuidor" condicional ao `profileType` do usuário
- **Arquivo**: `apps/web/app/minha-conta/page.tsx` (EVOLUIR)
  - Cards: nome + avatar + perfil + tags
  - Mini-cards: total pedidos · XP atual · nível · notificações não lidas
  - Reaproveitar `xp-progress-card.tsx` existente

##### 3.2 Perfil
- **Página**: `/minha-conta/perfil`
- **API**: `PATCH /api/customer/profile` (nome, telefone, CPF, avatar via Media)
- **Componente**: `profile-form.tsx` com Zod + toast
- **Regra**: email não editável pelo próprio usuário

##### 3.3 Endereços
- **Página**: `/minha-conta/enderecos`
- **APIs**:
  - `GET /api/customer/addresses` — listar
  - `POST /api/customer/addresses` — criar
  - `PATCH /api/customer/addresses/[id]` — editar
  - `DELETE /api/customer/addresses/[id]` — remover
  - `POST /api/customer/addresses/[id]/default` — marcar padrão
- **Componentes**: `address-form.tsx`, `address-list.tsx`
- **Integração**: auto-complete via ViaCEP (POST /api/shipping/cep-lookup, opcional no MVP)

##### 3.4 Pedidos
- **Página `/minha-conta/pedidos`**: lista paginada (status + data + valor + CTA "ver detalhes")
- **Página `/minha-conta/pedidos/[id]`**: items, breakdown de pricing, timeline de status (created → paid → processing → shipped → delivered)
- **APIs**: `GET /api/orders`, `GET /api/orders/[id]` (validar ownership)
- **Regra**: só retorna pedidos do próprio customer

##### 3.5 Experiência (XP)
- **Página**: `/minha-conta/experiencia`
- **APIs**: `GET /api/xp/summary`, `GET /api/xp/transactions`
- **UI**: barra progressiva (reaproveitar `xp-progress-card`), tabela histórico, grid de benefícios desbloqueados, "Como ganhar mais XP" (ações sugeridas)

##### 3.6 Notificações
- **Página**: `/minha-conta/notificacoes`
- **APIs**:
  - `GET /api/notifications` — listar
  - `POST /api/notifications/[id]/read`
  - `POST /api/notifications/read-all`
  - `GET /api/notifications/unread-count` (usado no badge do header)
- **UI**: lista cronológica, badge contador no site-header, toast ao marcar lida

##### 3.7 Distribuidor (consolida item da Sprint 2)
- **Página `/cadastro/distribuidor`**: form completo (razão social, CNPJ, inscrição estadual, região de atuação, telefone comercial, upload de documentos via Payload Media)
- **API**: `POST /api/distributor/request` (cria `DistributorRequest` com status `pending_review`)
- **Página `/minha-conta/distribuidor`**: exibe estado (`não solicitou` → CTA / `pending` / `approved` / `rejected` + motivo + retry)
- **Services**: `distributor.service.ts` em `packages/core/src/application/`

#### Entregas efetivas desta sprint

| Item | Status | Observação |
|---|---|---|
| Layout autenticado `/minha-conta` | ✅ | Sidebar desktop + tabs mobile em [apps/web/app/minha-conta/layout.tsx](../../apps/web/app/minha-conta/layout.tsx) |
| Dashboard real do cliente | ✅ | [apps/web/app/minha-conta/page.tsx](../../apps/web/app/minha-conta/page.tsx) usa Payload para perfil, pedidos, XP e notificações |
| Perfil editável | ✅ | [apps/web/app/minha-conta/perfil/page.tsx](../../apps/web/app/minha-conta/perfil/page.tsx) + `PATCH /api/customer/profile` |
| CRUD de endereços | ✅ | páginas + APIs `GET/POST/PATCH/DELETE/default` em `/api/customer/addresses*` |
| Pedidos lista + detalhe | ✅ | [apps/web/app/minha-conta/pedidos](../../apps/web/app/minha-conta/pedidos/page.tsx) + `/api/orders*` |
| Área de experiência | ✅ | [apps/web/app/minha-conta/experiencia/page.tsx](../../apps/web/app/minha-conta/experiencia/page.tsx) + `/api/xp/*` |
| Central de notificações | ✅ | [apps/web/app/minha-conta/notificacoes/page.tsx](../../apps/web/app/minha-conta/notificacoes/page.tsx) + badge no header |
| Fluxo de distribuidor | ✅ | [apps/web/app/cadastro/distribuidor/page.tsx](../../apps/web/app/cadastro/distribuidor/page.tsx) + [apps/web/app/minha-conta/distribuidor/page.tsx](../../apps/web/app/minha-conta/distribuidor/page.tsx) |
| Robustez do fluxo local | ✅ | `apps/web/tsconfig.json` não depende mais de `.next/types` para o lint |

#### Critérios de Aceite
- [x] Sidebar responsiva em desktop + mobile
- [x] Dashboard puxa contadores reais do Payload
- [x] Perfil editável com feedback visual (toast + revalidação)
- [x] CRUD de endereços completo, endereço padrão único por customer
- [x] Pedidos lista + detalhe com timeline
- [x] XP mostra histórico real de transações e benefícios
- [x] Badge de notificações não lidas no header (polling desativado nesta sprint, atualiza on-mount)
- [x] Solicitação de distribuidor: fluxo end-to-end com status refletindo no `/minha-conta/distribuidor`

#### Observações de fechamento

- Upload de avatar do customer e upload de documentos da solicitação via `Media` ficam como **refino não bloqueante** para o ciclo seguinte.
- Lookup automático de CEP (ViaCEP) continua opcional e pode entrar como melhoria de UX sem bloquear o MVP.
- O warning do Next sobre `middleware` → `proxy` fica como hardening técnico para a Sprint 4.

---

### ✅ SPRINT 4 — Checkout Real + Estoque + XP  (CONCLUÍDA)

**Objetivo**: Fluxo de compra ponta a ponta com persistência real.

#### Entregas efetivas

| Item | Status | Observação |
|---|---|---|
| `coupon.service.ts` (core) | ✅ | [packages/core/src/application/coupon.service.ts](../../packages/core/src/application/coupon.service.ts) — `validateCoupon` com reasons `not_found`/`inactive`/`out_of_window`/`max_uses_reached`/`profile_not_eligible`/`tag_not_eligible`/`below_min_purchase` |
| `xp.service.ts` (core) | ✅ | [packages/core/src/application/xp.service.ts](../../packages/core/src/application/xp.service.ts) — `resolveXPMultiplier`, `calculateXP`, `resolveLevel` com detecção de level-up |
| `POST /api/coupons/validate` | ✅ | [apps/web/app/api/coupons/validate/route.ts](../../apps/web/app/api/coupons/validate/route.ts) — Zod body `{code, subtotal}`, autenticado via cookie JWT |
| `POST /api/checkout` | ✅ | [apps/web/app/api/checkout/route.ts](../../apps/web/app/api/checkout/route.ts) — sessão obrigatória, ownership de endereço, cupom, pricing, pagamento, persistência |
| Admin token cache | ✅ | [apps/web/src/lib/payload-admin.ts](../../apps/web/src/lib/payload-admin.ts) — login `users` com cache até expiração, usado para XP/inventário/notificações |
| Persistência Order + side-effects | ✅ | Order criado via JWT do cliente; XPTransaction, InventoryMovement, Notification, update `customer.xpBalance/level/benefits`, incremento `coupon.currentUses` via token admin |
| HTTP 207 em falha parcial | ✅ | Se os side-effects falharem após o pedido ser gravado, a rota retorna `warning` sem perder o pedido |
| Página `/checkout/sucesso` | ✅ | [apps/web/app/checkout/sucesso/page.tsx](../../apps/web/app/checkout/sucesso/page.tsx) com code, total, XP, level-up |
| Página `/checkout/falha` | ✅ | [apps/web/app/checkout/falha/page.tsx](../../apps/web/app/checkout/falha/page.tsx) com retry |
| Storefront `/checkout` | ✅ | [apps/web/src/components/commerce/checkout-experience.tsx](../../apps/web/src/components/commerce/checkout-experience.tsx) — seleção de endereço salvo, validação de cupom on-blur, redirect para sucesso/falha |
| `.env.local` nos apps | ✅ | symlinks `apps/web/.env.local` e `apps/cms/.env.local` → raiz, para Next picar `PAYLOAD_ADMIN_*` |
| Lint global | ✅ | `pnpm lint` verde em todos os 5 workspaces |

#### Decisões de escopo

- **Catálogo permanece no mock-repository** para o pricing (produtos/variantes/eventos/promoções/fidelidade). Payload grava apenas efeitos do checkout (Order/XPTransaction/InventoryMovement/Notification). Integrar `payload-repositories` fica para refino pós-MVP.
- **Reserve/commit/release de estoque**: simplificado para um único `InventoryMovement` tipo `sale` após pagamento aprovado. A modelagem reserve → commit/release fica como melhoria Sprint 5/6 (o volume esperado no MVP não justifica a complexidade).
- **IDs de relacionamento Postgres**: helper `toRelationId` converte strings numéricas para `number` antes de enviar ao Payload (Postgres adapter exige inteiro em relationships).
- **Webhook Mercado Pago real**: segue na Sprint 6 (sandbox adapter continua em uso).

#### Critérios de Aceite
- [x] Checkout completo persiste Order no Payload
- [x] XP multiplicador funciona quando promoção ativa (`resolveXPMultiplier`)
- [x] Level-up automático dispara notificação `level-up`
- [x] Cupom valida por perfil, tags, janela e limite
- [x] InventoryMovement registra venda por item após pagamento aprovado
- [x] Páginas sucesso e falha com ações corretas
- [x] Falha de side-effects não perde o pedido (HTTP 207 + warning)
- [ ] ~~Estoque retorna se pagamento falhar~~ — reserve/commit/release adiado; falha de pagamento retorna 402 sem criar Order
- [ ] ~~Transação única Order+XP+Inventory~~ — Payload REST não expõe transações; operações sequenciais com fallback 207

---

### ✅ SPRINT 5 — Portal de Gerência (Admin)  (CONCLUÍDA E VALIDADA)

**Objetivo**: Dashboard gerencial com métricas e gestão de distribuidores.

#### Tarefas

1. **Dashboard customizado no Payload**
   - Componente React `apps/cms/src/views/Dashboard.tsx` como `afterDashboard` view
   - Métricas: usuários totais, pedidos totais, receita total/período, ticket médio
   - Widgets: top 10 compradores, últimas 10 compras, estoque baixo, promoções/cupons ativos, solicitações de distribuidor pendentes

2. **`GET /api/admin/dashboard/metrics`**
   - Queries agregadas via Payload + Postgres
   - Cache Redis TTL 5min

3. **Fluxo de aprovação de distribuidor**
   - Custom action no admin: Aprovar/Rejeitar (com motivo)
   - Atualiza `profileType` do customer e cria `Notification`

4. **Gestão de usuários**
   - Filtros: profileType, tags, fidelidade
   - Alterar tags e fidelityTags
   - Ver histórico de compras + XP

5. **`GET /api/admin/xp/ranking`** (top customers por XP, filtro por período)

6. **Gestão de estoque**: ver inventory por produto, histórico de movimentações, alertas de `reorderLevel`

#### Entregas efetivas desta frente

| Item | Status | Observação |
|---|---|---|
| Dashboard gerencial embutido no Payload | ✅ | `afterDashboard` em [apps/cms/src/components/dashboard/manager-dashboard.tsx](../../apps/cms/src/components/dashboard/manager-dashboard.tsx) |
| `GET /api/admin/dashboard/metrics` | ✅ | [apps/cms/src/app/api/admin/dashboard/metrics/route.ts](../../apps/cms/src/app/api/admin/dashboard/metrics/route.ts) com auth `admin/manager` |
| `GET /api/admin/xp/ranking` | ✅ | [apps/cms/src/app/api/admin/xp/ranking/route.ts](../../apps/cms/src/app/api/admin/xp/ranking/route.ts) com filtro por período |
| Cache TTL 5min em Redis com fallback | ✅ | [apps/cms/src/lib/admin-cache.ts](../../apps/cms/src/lib/admin-cache.ts) usa `REDIS_URL` real e fallback seguro para memória |
| Aprovação/rejeição de distribuidor automática | ✅ | hook em [apps/cms/src/collections/DistributorRequests.ts](../../apps/cms/src/collections/DistributorRequests.ts) atualiza customer + notification |
| Alertas de estoque baixo por `reorderLevel` | ✅ | `variants.reorderLevel` em [apps/cms/src/collections/Products.ts](../../apps/cms/src/collections/Products.ts) e widget no dashboard |
| Gestão de usuários com histórico acoplado ao documento | ✅ | [apps/cms/src/collections/Customers.ts](../../apps/cms/src/collections/Customers.ts) agora expõe joins de pedidos, XP e solicitações no próprio customer |
| Histórico dedicado de estoque por produto | ✅ | [apps/cms/src/collections/Products.ts](../../apps/cms/src/collections/Products.ts) agora expõe `inventoryHistory` via join e [apps/cms/src/collections/InventoryMovements.ts](../../apps/cms/src/collections/InventoryMovements.ts) ganhou colunas/lista operacional |
| Lint isolado da `.next` | ✅ | [apps/cms/tsconfig.lint.json](../../apps/cms/tsconfig.lint.json) + script do workspace do CMS sem depender de arquivos transitórios |

#### Validação executada

- `pnpm --filter @depilmoni/cms lint`
- `pnpm --filter @depilmoni/cms build`
- `pnpm --filter @depilmoni/cms generate:types`
- `pnpm --filter @depilmoni/cms generate:importmap`
- smoke do cache admin com Redis real via `set/get/delete` usando `REDIS_URL=redis://localhost:6379`

#### Critérios de Aceite
- [x] Dashboard com métricas operacionais e comerciais
- [x] Aprovar/rejeitar distribuidor end-to-end
- [x] Alterar perfil/tags de qualquer usuário
- [x] Ranking de XP
- [x] Histórico de estoque por produto
- [x] RBAC: apenas `admin`/`manager` acessam

---

### ⏳ SPRINT 6 — Fulfillment + Mapa + Notificações

**Objetivo**: Pós-venda funcional e features avançadas do admin.

#### Tarefas

1. **Fulfillment básico**: transições `processing → shipped → delivered` + trackingCode/URL + notificações automáticas
2. **Webhook Mercado Pago**: `POST /api/webhooks/mercado-pago`, validação de assinatura, atualização automática de status (sandbox no MVP)
3. **Mapa de clientes**: Leaflet + `GET /api/admin/customers/map-data` + filtros por perfil/cidade/estado
4. **Geocodificação**: Nominatim (OpenStreetMap) no save do Address, cache por CEP
5. **Notificações em tempo real (polling)**: `GET /api/notifications/unread-count` a cada 30s
6. **Event bus interno**: `event-bus.ts` pub/sub in-process, handlers para `order.paid`, `order.shipped`, `xp.level-up`, `distributor.approved`

#### Critérios de Aceite
- [ ] Admin transiciona status de pedido
- [ ] Tracking visível ao customer
- [ ] Mapa funcional com filtros
- [ ] Notificações atualizam sem refresh
- [ ] Eventos de domínio disparam notificações automaticamente

---

## 2. Ordem Ideal de Implementação (atualizada)

```
[✅ SPRINT 1] Collections + Repositories
       ↓
[✅ SPRINT 2] Auth + Cadastro + Middleware + Seed de admin
       ↓
[✅ SPRINT 3] Central do Usuário
       ↓
[✅ SPRINT 4] Checkout + Estoque + XP
       ↓
[✅ SPRINT 5] Portal de Gerência
       ↓
[⏳ SPRINT 6] Fulfillment + Mapa + Notificações   ← VOCÊ ESTÁ AQUI
```

---

## 3. Riscos Técnicos — Estado Atual

### RESOLVIDOS
1. ✅ **Mock → Real**: interface criada, mock e payload repositories coexistem sem quebrar testes.
2. ✅ **Payload Auth para Customers**: funciona com collection dedicada `customers`, JWT httpOnly emitido pela própria API do Payload (validado E2E no checkpoint).
3. ✅ **Dupla tipagem**: `packages/domain` foi eliminada; `packages/core/src/domain/models.ts` é a única fonte de verdade.
4. ✅ **Bootstrap do admin**: `pnpm seed:admin` idempotente, controlado via `.env`.

### ABERTOS
5. 🟡 **Consistência de estoque** (race conditions): o MVP grava `InventoryMovement` após checkout. Histórico operacional detalhado por produto segue para o próximo bloco da Sprint 5.
6. ⏳ **Integração Mercado Pago real**: Sprint 6. Precisa de URL pública (ngrok) para testes de webhook.
7. ⏳ **Geocodificação**: rate limits/custo. Usar Nominatim + cache por CEP. Sprint 6.
8. ✅ **Performance do dashboard admin**: cache TTL 5min validado com Redis real e fallback local para resiliência.
9. 🔵 **Medusa.js subutilizado**: `apps/commerce` fica em workspace mas **não entra no MVP**. Revisar em fase 2.

---

## 4. Próximos Passos Práticos (Sprint 3)

## 4. Próximos Passos Práticos (Sprint 6)

### Passo 1 — Fulfillment operacional
Adicionar transições de pedido no admin (`processing → shipped → delivered`) com persistência de `trackingCode`, `trackingUrl`, `shippedAt` e `deliveredAt`.

### Passo 2 — Notificações de pós-venda
Disparar `Notification` quando o pedido mudar para enviado e entregue, refletindo isso também no portal do cliente.

### Passo 3 — Tracking no storefront
Exibir código/link de rastreio em `/minha-conta/pedidos/[id]` e no resumo do pedido.

### Passo 4 — Webhook de pagamento
Iniciar `POST /api/webhooks/mercado-pago` em sandbox para automatizar atualização de status.

### Passo 5 — Validação
Criar pedido real do checkout mockado, transicionar status no admin, validar rastreio e notificações ponta a ponta.

---

## 5. Estrutura de Pastas — Estado Atual vs Planejado

```
apps/web/
  app/
    api/
      auth/                        ✅ (register, login, logout, me, forgot-password)
      customer/                    ⏳ Sprint 3
        profile/route.ts
        avatar/route.ts
        addresses/{route.ts,[id]/{route.ts,default/route.ts}}
      distributor/                 ⏳ Sprint 3
        request/route.ts
        status/route.ts
      orders/                      ⏳ Sprint 3
        route.ts
        [id]/route.ts
      xp/                          ⏳ Sprint 3
        summary/route.ts
        transactions/route.ts
      notifications/               ⏳ Sprint 3
        route.ts
        [id]/read/route.ts
        read-all/route.ts
        unread-count/route.ts
      checkout/route.ts            🟡 (base mock, evoluir Sprint 4)
      coupons/validate/route.ts    ⏳ Sprint 4
      webhooks/mercado-pago/route.ts ⏳ Sprint 6
    login/page.tsx                 ✅
    cadastro/page.tsx              ✅
    cadastro/distribuidor/page.tsx ⏳ Sprint 3
    esqueci-senha/page.tsx         ✅
    checkout/                      🟡 (estrutura existe, evoluir Sprint 4)
      sucesso/page.tsx             ⏳ Sprint 4
      falha/page.tsx               ⏳ Sprint 4
    minha-conta/
      page.tsx                     🟡 (existe, evoluir)
      layout.tsx                   ⏳ Sprint 3
      perfil/page.tsx              ⏳ Sprint 3
      enderecos/page.tsx           ⏳ Sprint 3
      pedidos/{page.tsx,[id]/page.tsx} ⏳ Sprint 3
      experiencia/page.tsx         ⏳ Sprint 3
      notificacoes/page.tsx        ⏳ Sprint 3
      distribuidor/page.tsx        ⏳ Sprint 3
  middleware.ts                    ✅
  src/
    store/
      auth-store.ts                ✅
      cart-store.ts                ✅
    components/
      auth/                        ✅ (login-form, register-form, forgot-password-form, auth-shell, auth-provider)
      account/                     ⏳ Sprint 3
        profile-form.tsx
        address-form.tsx
        address-list.tsx
        order-list.tsx
        order-detail.tsx
        xp-history.tsx
        notification-list.tsx
        distributor-form.tsx
        distributor-status.tsx

apps/cms/
  src/
    collections/                   ✅ (17 collections ativas)
    seed/
      seed-admin.ts                ✅
    views/
      Dashboard.tsx                ⏳ Sprint 5

packages/core/
  src/
    application/
      auth.service.ts              ✅
      checkout.ts                  🟡 (evoluir Sprint 4)
      pricing.ts                   ✅
      customer.service.ts          ⏳ Sprint 3
      address.service.ts           ⏳ Sprint 3
      order.service.ts             ⏳ Sprint 3/4
      distributor.service.ts       ⏳ Sprint 3
      xp.service.ts                ⏳ Sprint 4
      notification.service.ts      ⏳ Sprint 3
      inventory.service.ts         ⏳ Sprint 4
      coupon.service.ts            ⏳ Sprint 4
    infrastructure/
      repositories/
        repository-interface.ts    ✅
        mock-repositories.ts       ✅
        payload-repositories.ts    ✅
      events/                      ⏳ Sprint 6
        event-bus.ts
        handlers/
```

---

## 6. Comandos de Referência

```bash
# Setup inicial (1x)
nvm use 22
pnpm install
pnpm dev:infra            # sobe Postgres + Redis via docker-compose
pnpm seed:admin           # cria admin@depilmoni.local (lê .env)

# Desenvolvimento diário
pnpm dev                  # web (3000) + cms (3001) em paralelo
pnpm dev:web              # só storefront
pnpm dev:cms              # só Payload admin

# Qualidade
pnpm lint                 # tsc --noEmit em todos os workspaces
pnpm test                 # unit tests do core (pricing)
pnpm test:e2e             # Playwright no storefront

# Banco de dados
pnpm seed:print           # print do seed mock para inspeção
```

---

## 7. Referências

- [docs/mvp/checkpoint-2026-04-15.md](docs/mvp/checkpoint-2026-04-15.md) — snapshot atual do projeto
- [docs/architecture.md](docs/architecture.md) — visão arquitetural
- Próximo checkpoint: ao fim da Sprint 3 (`docs/mvp/checkpoint-sprint-3.md`)
