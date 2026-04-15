# Depilmoni MVP - Visao Geral e Gap Analysis

## 1. Visao Geral do MVP

O MVP da Depilmoni e uma plataforma de e-commerce B2C/B2B para produtos de beleza e depilacao, com sistema de gamificacao (XP/niveis), perfis diferenciados (cliente, parceiro, distribuidor), gestao de eventos/cursos, e CMS integrado.

### Stack Atual
| Camada | Tecnologia | Status |
|--------|-----------|--------|
| Frontend (Storefront) | Next.js 16.2.3 + React 18 + Tailwind | Funcional |
| CMS / Admin | Payload CMS 3.82.1 | Funcional |
| Commerce Backend | Medusa.js 2.13.6 | Configurado, nao integrado |
| Banco de Dados | PostgreSQL (3 databases) | Docker pronto |
| Cache | Redis 7 | Docker pronto, adapter mock |
| UI Library | Radix UI + shadcn-style | Funcional |
| State Management | Zustand (cart) | Funcional |
| Validacao | Zod (domain models) | Funcional |
| Monorepo | pnpm workspaces | Funcional |

### Arquitetura de Pacotes
```
apps/
  web/          -> Storefront Next.js (porta 3000)
  cms/          -> Payload CMS Admin (porta 3001)
  commerce/     -> Medusa.js Backend (porta 9000)
packages/
  core/         -> Logica de aplicacao (checkout, pricing, adapters)
  domain/       -> Tipos e seeds (packages/domain/src/types.ts)
  ui/           -> Componentes compartilhados (Radix + Tailwind)
```

---

## 2. Gap Analysis: Base Atual vs. Escopo MVP

### LEGENDA
- EXISTE = funcionalidade ja implementada e funcional
- PARCIAL = existe base mas precisa de evolucao significativa
- NAO EXISTE = precisa ser criado do zero

---

### 2.1 Portal de Gerencia

| Feature | Status | Detalhes |
|---------|--------|----------|
| Login admin | EXISTE | Payload CMS tem auth + roles (admin, manager, content-editor) |
| RBAC (controle de acesso) | EXISTE | `apps/cms/src/access/index.ts` com isAdmin, isManager, canManageContent, canManageCommerce |
| Dashboard com metricas | NAO EXISTE | Payload tem CRUD generico mas nao tem dashboard customizado com KPIs |
| Mapa de clientes | NAO EXISTE | Nenhuma feature de geolocalizacao existe |
| Gestao de usuarios (listar/editar) | PARCIAL | Payload Users collection existe mas e para admins, nao para customers do storefront |
| Aprovacao de distribuidor | NAO EXISTE | CustomerProfile nao tem status de solicitacao |
| Gestao de cupons | EXISTE | Collection Coupons no Payload com CRUD completo |
| Gestao de promocoes | EXISTE | Collection Promotions no Payload com CRUD |
| Gestao de catalogo (produtos) | PARCIAL | Collection Products existe mas desconectada do mock-database do core |
| Gestao de estoque | PARCIAL | Inventory model existe no core mas sem UI de gestao |
| Gestao de conteudo (blog) | EXISTE | Collection BlogPosts no Payload com rich text |
| Gestao de banners | EXISTE | Collection Banners no Payload |
| Ranking de XP | NAO EXISTE | XP existe no modelo mas sem visualizacao admin |

### 2.2 Cadastro de Usuario

| Feature | Status | Detalhes |
|---------|--------|----------|
| Pagina de login do storefront | NAO EXISTE | Nenhuma pagina de login/registro no `apps/web` |
| Cadastro como comprador | NAO EXISTE | Nenhum formulario de registro existe |
| Solicitacao de distribuidor | NAO EXISTE | Modelo CustomerProfile nao tem campos para CNPJ, razao social, etc |
| Status pending/approved/rejected | NAO EXISTE | CustomerProfile tem profileType mas nao tem distributorStatus |
| Fluxo de aprovacao admin | NAO EXISTE | Sem workflow de aprovacao |

### 2.3 Central do Usuario

| Feature | Status | Detalhes |
|---------|--------|----------|
| Pagina /minha-conta | EXISTE | `apps/web/app/minha-conta/page.tsx` - exibe perfil, pedidos, tickets, XP |
| Edicao de perfil | NAO EXISTE | Pagina e somente leitura |
| Gestao de enderecos | NAO EXISTE | CheckoutAddress existe como tipo mas nao como CRUD |
| Metodos de pagamento salvos | NAO EXISTE | Nenhuma persistencia de metodos de pagamento |
| Historico de pedidos | PARCIAL | Lista pedidos mas sem detalhes expandidos |
| Barra de XP e nivel | EXISTE | `xp-progress-card.tsx` funcional com barra de progresso |
| Historico de XP | NAO EXISTE | XPTransaction existe no modelo mas sem UI |
| Beneficios desbloqueados | PARCIAL | Mostra no card de XP mas sem listagem detalhada |
| Notificacoes | NAO EXISTE | So tem toast (Sonner) - sem notificacoes persistentes |

### 2.4 Fluxo de Compra e Pagamento

| Feature | Status | Detalhes |
|---------|--------|----------|
| Carrinho (add/remove/qty) | EXISTE | Zustand store em `cart-store.ts` com localStorage |
| Pagina /carrinho | EXISTE | Review de items no carrinho |
| Aplicar cupom | EXISTE | Checkout valida e aplica cupom |
| Checkout completo | EXISTE | `checkout-experience.tsx` com frete, cupom, pagamento |
| Calculo de frete | EXISTE | Mock Melhor Envio adapter |
| Pagamento (Mercado Pago) | PARCIAL | Adapter mock existe mas sem integracao real |
| Baixa de estoque | EXISTE | `reserveInventory()` no checkout.ts |
| Concessao de XP | EXISTE | `awardXP()` no checkout.ts |
| Criacao de pedido | EXISTE | Order criado com breakdown completo |
| Geracao de tickets (eventos) | EXISTE | Tickets com QR code gerados automaticamente |
| Status de pagamento | PARCIAL | So "paid" e "awaiting-payment", falta estados intermediarios |
| Fluxo de envio pos-pagamento | NAO EXISTE | Nenhum workflow de fulfillment apos pagamento |
| Parcelamento | PARCIAL | Adapter retorna opcoes mas sem UI de selecao |

### 2.5 Regras de Negocio

| Feature | Status | Detalhes |
|---------|--------|----------|
| Perfis (client/partner/distributor) | EXISTE | CustomerProfileType com pricing diferenciado |
| Tags de fidelidade | EXISTE | FidelityTag model com benefits |
| XP por compra | EXISTE | Math.floor(total) como XP |
| XP multiplicador por promocao | NAO EXISTE | Promotions nao tem campo de bonus de XP |
| Historico de XP | PARCIAL | XPTransaction model existe, sem UI |
| Cupons com elegibilidade | PARCIAL | Model existe mas sem validacao por perfil no checkout |
| Estoque com reserva | EXISTE | Decremento atomico no mock |
| Historico de movimentacao de estoque | NAO EXISTE | Sem audit trail |

---

## 3. Resumo de Gaps Criticos para MVP

### Prioridade CRITICA (bloqueia MVP)
1. **Autenticacao no storefront** - Sem login/registro, nao existe usuario real
2. **Cadastro de comprador** - Formulario de registro com dados basicos
3. **Persistencia real** - Tudo roda em mock in-memory, precisa conectar ao PostgreSQL
4. **Fluxo de pagamento real** - Integrar Mercado Pago de verdade (ou pelo menos sandbox)

### Prioridade ALTA (essencial para MVP)
5. **Solicitacao de distribuidor** - Formulario + modelo + fluxo de aprovacao
6. **Dashboard admin** - Metricas e KPIs para gerencia
7. **Edicao de perfil** - Central do usuario precisa ser interativa
8. **Gestao de enderecos** - Necessario para checkout funcional
9. **Status de pedido expandido** - pending -> paid -> shipped -> delivered -> cancelled
10. **Fulfillment basico** - Marcar pedido como enviado, inserir rastreio

### Prioridade MEDIA (enriquece MVP)
11. **Mapa de clientes** - Geolocalizacao no admin
12. **Notificacoes persistentes** - Centro de notificacoes do usuario
13. **Historico de XP** - Listagem de transacoes de XP
14. **XP multiplicador** - Promocoes com bonus de XP
15. **Historico de movimentacao de estoque** - Auditoria basica

### Prioridade BAIXA (pos-MVP)
16. **Metodos de pagamento salvos** - Depende de gateway
17. **Gestao de conteudo avancada** - Payload ja cobre bem
18. **Analytics integrado** - PostHog configurado mas mock

---

## 4. Decisao Arquitetural: Mock vs. Real

### Situacao Atual
O `packages/core` opera 100% sobre um **mock in-memory database** (`mock-database.ts`). Isso foi excelente para prototipar o checkout, pricing e XP, mas para o MVP funcional precisamos de persistencia real.

### Estrategia Recomendada
Manter a **interface de repositorios** identica e trocar a implementacao:

```
packages/core/src/infrastructure/repositories/
  mock-repositories.ts      -> manter para dev/testes
  payload-repositories.ts   -> NOVO: busca dados do Payload CMS via API
```

O Payload CMS ja possui PostgreSQL e CRUD para todas as collections. A estrategia e:
1. **Payload CMS** = source of truth para produtos, promocoes, cupons, banners, blog, XP levels
2. **Payload CMS** = expandir com collections para Customers, Orders, Addresses, XPTransactions, InventoryMovements
3. **Storefront** = consome dados via Payload Local API ou REST API
4. **Medusa** = reservar para futuro se necessario (nao bloquear MVP com integracao dupla)

### Justificativa
- Payload ja tem auth, RBAC, CRUD, file upload, rich text
- Adicionar collections e trivial vs. integrar Medusa + Payload + Next ao mesmo tempo
- Medusa pode ser integrado em fase 2 para features avancadas de e-commerce
- Reduz complexidade do MVP significativamente
