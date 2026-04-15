# Arquitetura Depilmoni

## Pastas

```text
apps/
  web/
    app/
      api/mock/
      blog/
      carrinho/
      checkout/
      eventos/
      kits/
      minha-conta/
      produtos/
    src/
      components/
        account/
        blocks/
        cms/
        commerce/
        events/
        layout/
      lib/
      store/
  cms/
    src/
      access/
      blocks/
      collections/
      payload.config.ts
  commerce/
    src/
      modules/profile-pricing/
      workflows/
    medusa-config.ts
packages/
  core/
    src/
      domain/
      application/
      infrastructure/
  ui/
    src/
      components/
      lib/
```

## Dependencias principais

### Storefront

- `next`
- `react`
- `tailwindcss`
- `lucide-react`
- `sonner`
- `zustand`
- `@depilmoni/core`
- `@depilmoni/ui`

### Core

- `zod`
- `date-fns`
- `qrcode`
- `vitest`

### CMS

- `payload`
- `@payloadcms/db-postgres`
- `@payloadcms/richtext-lexical`

### Commerce

- `@medusajs/framework`
- `@medusajs/medusa`

## Decisoes arquiteturais

### 1. `packages/core` concentra a regra de negocio

Para evitar acoplamento entre `Next`, `Payload` e `Medusa`, o dominio foi centralizado em `packages/core`.

- `domain`: schemas, tipos e contratos de negocio
- `application`: precificacao, checkout, storefront service
- `infrastructure`: seed, repositorios mockados, adapters e cache

### 2. `apps/web` consome o core, nao o contrario

O storefront usa `storefrontData`, `runMockCheckout` e `getShippingOptions` como fronteira de aplicacao. Isso deixa o frontend livre para trocar a implementacao de dados depois, sem reescrever UI.

### 3. Homepage orientada a blocos

A home e renderizada a partir de `LandingPage.blocks`, o que permite espelhar a montagem do Payload sem travar a pagina em componentes hardcoded.

### 4. Preco com precedencia explicita

O motor de precificacao segue:

1. `basePrice`
2. `profilePrices`
3. fidelidade configuravel
4. promocao e cupom
5. frete

O distribuidor so empilha fidelidade quando `allowDistributorStacking` estiver ativo.

### 5. Checkout mockado com efeitos reais de dominio

Mesmo sem gateway real, o checkout:

- recalcula o pedido no servidor
- simula pagamento
- decrementa estoque
- gera tickets com QR Code
- grava pedido em memoria
- soma XP

### 6. Integracoes por adapter

Os pontos sensiveis foram isolados em adapters para facilitar a troca do mock pela integracao real:

- pagamento
- frete
- observabilidade
- analytics
- cache

### 7. Access control preparado

No `Payload`, as policies iniciais consideram:

- `admin`
- `manager`
- `content-editor`
- `authenticated-customer`

No dominio, `canAccess` permite reaproveitar a mesma leitura de papeis em outras camadas.

## Fluxos implementados

### Checkout mockado

1. usuario adiciona produto ou ticket ao carrinho
2. checkout calcula frete mockado
3. checkout envia `items + coupon + shipping + payment`
4. `runMockCheckout` valida regras
5. pagamento mockado aprova
6. estoque/lotes sao decrementados
7. tickets sao gerados quando houver evento
8. XP e beneficios sao atualizados

### Eventos e ingressos

1. pagina publica lista os eventos
2. detalhe mostra lotes e disponibilidade
3. usuario adiciona o lote ao carrinho
4. checkout gera ticket com QR Code
5. ticket aparece em `/minha-conta`

## Observacoes

- `apps/cms` usa `Next.js` apenas como shell do admin do `Payload`. Ele nao deve ser tratado como uma segunda vitrine publica.
- O storefront funcional e oficial do MVP esta centralizado em `apps/web` + `packages/core`.
- A antiga vitrine `Vite + React Router`, antes alojada na raiz, foi movida para `legacy/root-storefront-vite` apenas como referencia de design e historico.
