# Depilmoni Beauty Hub

Base production-ready para o ecossistema digital da Depilmoni, com storefront premium em Next.js, CMS em Payload, motor de comercio preparado para Medusa, dominio de precificacao por perfil, eventos com tickets e gamificacao com XP.

## Visao geral

- Marca: `Depilmoni`
- Segmento: beleza, depilacao, produtos e eventos/cursos
- Idioma principal: `pt-BR`
- Tema visual: marrom chocolate, cobre, dourado e bege quente
- Arquitetura: monorepo com separacao entre `domain`, `application`, `infrastructure` e `ui`

## Estrutura oficial

```text
apps/
  web/         # storefront publico, portal do usuario, carrinho e checkout mockado
  cms/         # Payload CMS com collections, blocos editaveis e access policies
  commerce/    # base Medusa e servicos de precificacao por perfil
packages/
  core/        # dominio, casos de uso, adapters, repositorios mockados e seed
  ui/          # primitives compartilhados com Tailwind + shadcn/ui
docs/
  architecture.md
  backlog.md
docker/
  postgres/init/01-databases.sh
```

Arquitetura detalhada: [docs/architecture.md](docs/architecture.md)  
Backlog priorizado: [docs/backlog.md](docs/backlog.md)

## O que ja foi entregue

- Homepage montada por blocos tipados e renderizada via `LandingPage.blocks`
- Rotas publicas:
  - `/`
  - `/produtos`
  - `/produtos/[slug]`
  - `/kits`
  - `/eventos`
  - `/eventos/[slug]`
  - `/blog`
  - `/minha-conta`
  - `/carrinho`
  - `/checkout`
- Fluxo mockado de compra de produto e ticket no mesmo checkout
- Motor de precificacao com precedencia:
  - preco base varejo
  - preco por perfil
  - beneficio de fidelidade
  - promocao/cupom
  - frete
- Regras de distribuidor com stacking configuravel
- XP por pedido pago, nivel atual, proximo nivel e beneficios desbloqueados
- Estoque decrementado em memoria no checkout mockado
- Ticket com QR Code e status de check-in preparado
- Payload com collections iniciais, blocos de landing page e controles de acesso
- Medusa preparado com config inicial e modulo de profile pricing
- Docker Compose com PostgreSQL e Redis

## Setup rapido

### 1. Instale as dependencias

```bash
pnpm install
```

### 2. Configure o ambiente

```bash
cp .env.example .env
```

### 3. Suba o MVP com um unico comando

```bash
pnpm dev
```

Esse comando sobe `PostgreSQL + Redis` via Docker e inicia o storefront em `http://localhost:3000`.

## Portas padrao

- `3000`: storefront Next.js
- `3001`: Payload CMS
- `9000`: Medusa
- `5432`: PostgreSQL
- `6379`: Redis

## Scripts principais

```bash
pnpm dev
pnpm dev:web
pnpm dev:cms
pnpm dev:commerce
pnpm build
pnpm lint
pnpm test
pnpm test:e2e
pnpm seed:print
```

## Seed de negocio

O seed mockado em `packages/core/src/infrastructure/seeds/mock-seed.ts` inclui:

- 5 produtos
- 2 eventos
- 3 banners
- 3 perfis de usuario
- 1 tag de fidelidade
- 2 cupons
- 1 promocao relampago
- niveis de XP
- landing page por blocos
- posts de blog

## Validacao executada

Comandos rodados com sucesso nesta base:

```bash
pnpm --filter @depilmoni/core test
pnpm --filter @depilmoni/core lint
pnpm --filter @depilmoni/web lint
pnpm --filter @depilmoni/web build
pnpm --filter @depilmoni/cms lint
pnpm --filter @depilmoni/commerce lint
pnpm build
```

Observacao:

- O `pnpm install` ainda exibe um warning de peer dependency interno do `@medusajs/admin-vite-plugin` com `picomatch`. A base continua compilando normalmente.
- O fluxo e2e com Playwright foi preparado, mas nao executei `pnpm test:e2e` nesta rodada.

## Componentes CMS ja conectados

- `HeroBanner`
- `BenefitBar`
- `ProductCarousel`
- `CategoryGrid`
- `EventHighlight`
- `TestimonialSection`
- `RichContentSection`
- `FAQSection`
- `CTASection`

## Modelos de dominio incluidos

- `Product`
- `ProductVariant`
- `Inventory`
- `Promotion`
- `Coupon`
- `CustomerProfile`
- `CustomerTag`
- `FidelityTag`
- `XPTransaction`
- `XPLevel`
- `Event`
- `Ticket`
- `Banner`
- `LandingPage`
- `BlogPost`

## Integracoes preparadas por adapter

- `Mercado Pago`: `packages/core/src/infrastructure/adapters/payment/mercado-pago.adapter.ts`
- `Melhor Envio`: `packages/core/src/infrastructure/adapters/shipping/melhor-envio.adapter.ts`
- `Sentry`: `packages/core/src/infrastructure/adapters/observability/sentry.adapter.ts`
- `PostHog`: `packages/core/src/infrastructure/adapters/analytics/posthog.adapter.ts`
- `Redis`: `packages/core/src/infrastructure/adapters/cache/redis.adapter.ts`

## Proximos passos recomendados

- Conectar `apps/web` ao `Payload` real via fetch/local API
- Ligar `apps/commerce` a fluxos reais do Medusa
- Persistir checkout, pedidos, tickets e XP em PostgreSQL
- Implementar auth real para admin, gerente, editor e cliente
- Substituir adapters mockados por `Mercado Pago` e `Melhor Envio` reais
