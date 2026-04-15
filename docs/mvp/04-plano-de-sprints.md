# Depilmoni MVP - Plano de Sprints e Implementacao

## 1. Plano por Sprints

### SPRINT 1 - Fundacao: Auth + Collections + Persistencia
**Objetivo**: Sair do mock e ter usuarios reais com login funcional.

#### Tarefas:
1. **Criar collection Customers no Payload**
   - Campos: name, email, phone, cpf, avatar, profileType, distributorStatus, tags, fidelityTags, xpBalance, level, benefitsUnlocked
   - Auth habilitado (Payload auth built-in)
   - Access control: registro publico, leitura/edicao para authenticated

2. **Criar collection Addresses no Payload**
   - Campos conforme modelagem
   - Relationship com customers

3. **Criar collection Orders no Payload**
   - Campos conforme modelagem
   - Relationship com customers e addresses

4. **Criar collection DistributorRequests no Payload**
   - Campos conforme modelagem
   - Relationship com customers e users (admin)

5. **Criar collections XPTransactions, Notifications, InventoryMovements**
   - Campos conforme modelagem

6. **Alterar collections existentes**
   - Products: adicionar campo `active`
   - Promotions: adicionar `xpMultiplier`, `eligibleProfiles`, `eligibleTags`
   - Coupons: adicionar `maxUses`, `currentUses`, `eligibleProfiles`, `eligibleTags`

7. **Criar repository-interface.ts**
   - Contratos TypeScript para todos os repositories
   - Permitir troca entre mock e Payload

8. **Criar payload-repositories.ts**
   - Implementacao real via Payload Local API
   - Substituir mock-repositories nos fluxos que precisam de persistencia

#### Criterios de Aceite:
- [ ] Payload CMS inicia com todas as novas collections
- [ ] CRUD funciona para cada collection via admin
- [ ] Testes unitarios dos repository interfaces passam
- [ ] Mock repositories continuam funcionando para dev/testes

---

### SPRINT 2 - Autenticacao e Cadastro
**Objetivo**: Usuario pode se registrar, logar e manter sessao no storefront.

#### Tarefas:
1. **API routes de autenticacao**
   - POST /api/auth/register
   - POST /api/auth/login
   - POST /api/auth/logout
   - GET /api/auth/me
   - POST /api/auth/forgot-password

2. **auth.service.ts no packages/core**
   - Registro com validacao Zod
   - Login via Payload auth (email/password)
   - Gestao de sessao (JWT cookie httpOnly)

3. **Pagina /login**
   - Formulario email + senha
   - Link para /cadastro e /esqueci-senha
   - Feedback de erro

4. **Pagina /cadastro**
   - Formulario: nome, email, senha, telefone, CPF (opcional)
   - Validacao client-side com Zod
   - Redirect para /minha-conta apos sucesso

5. **Middleware de protecao de rotas**
   - apps/web/middleware.ts
   - Proteger /minha-conta/*, /checkout
   - Redirecionar para /login se nao autenticado
   - Redirecionar para /minha-conta se ja logado e acessar /login

6. **Auth context/store**
   - Zustand store ou React context para estado de auth
   - Header com nome do usuario / link de login

7. **Pagina /cadastro/distribuidor**
   - Formulario completo (razao social, CNPJ, etc)
   - Upload de documentos (se Payload media suportar)
   - POST /api/distributor/request

#### Criterios de Aceite:
- [ ] Usuario consegue criar conta como comprador
- [ ] Usuario consegue fazer login e manter sessao
- [ ] Rotas protegidas redirecionam para /login
- [ ] Header exibe nome do usuario logado
- [ ] Formulario de distribuidor envia solicitacao corretamente
- [ ] Solicitacao aparece como "pending_review" no admin
- [ ] Senhas sao hasheadas (bcrypt via Payload)
- [ ] Tokens JWT sao httpOnly cookies

---

### SPRINT 3 - Central do Usuario
**Objetivo**: Area autenticada completa com perfil, enderecos, pedidos, XP e notificacoes.

#### Tarefas:
1. **Layout /minha-conta com navegacao lateral**
   - Sidebar: Perfil, Enderecos, Pedidos, Experiencia, Notificacoes, Distribuidor (se aplicavel)
   - Responsiva (sidebar vira tabs em mobile)

2. **Pagina /minha-conta (dashboard)**
   - Resumo: nome, perfil, tags
   - Mini cards: total pedidos, XP, nivel, notificacoes nao lidas

3. **Pagina /minha-conta/perfil**
   - Editar: nome, telefone, CPF, avatar
   - PATCH /api/customer/profile

4. **Pagina /minha-conta/enderecos**
   - Listar enderecos salvos
   - Adicionar novo endereco
   - Editar/remover endereco
   - Marcar como padrao

5. **Pagina /minha-conta/pedidos**
   - Listar pedidos com status, data, valor
   - Paginacao

6. **Pagina /minha-conta/pedidos/[id]**
   - Detalhe completo: items, breakdown de precos, status, rastreio
   - Timeline de status

7. **Pagina /minha-conta/experiencia**
   - Barra de XP (reaproveitar xp-progress-card existente)
   - Historico de transacoes de XP (tabela)
   - Beneficios desbloqueados
   - Oportunidades para ganhar mais XP

8. **Pagina /minha-conta/notificacoes**
   - Listar notificacoes (mais recentes primeiro)
   - Marcar como lida
   - Marcar todas como lidas
   - Badge de contador no header

9. **Pagina /minha-conta/distribuidor**
   - Se nao solicitou: link para /cadastro/distribuidor
   - Se pending: "Sua solicitacao esta em analise"
   - Se aprovado: "Voce e um distribuidor ativo"
   - Se rejeitado: motivo + possibilidade de reenviar

#### Criterios de Aceite:
- [ ] Todas as paginas da central do usuario funcionam
- [ ] Perfil editavel com feedback visual
- [ ] CRUD de enderecos funcional
- [ ] Lista de pedidos puxando dados reais do Payload
- [ ] Detalhe de pedido com breakdown completo
- [ ] XP mostra historico real de transacoes
- [ ] Notificacoes com marcar lida funcional
- [ ] Badge de notificacoes nao lidas no header
- [ ] Status de distribuidor reflete corretamente

---

### SPRINT 4 - Checkout Real + Estoque + XP
**Objetivo**: Fluxo de compra ponta a ponta com persistencia real.

#### Tarefas:
1. **Evoluir checkout.ts**
   - Trocar mock-repositories por payload-repositories
   - Manter toda a logica de pricing existente
   - Adicionar xpMultiplier das promocoes

2. **Evoluir POST /api/checkout**
   - Validar autenticacao
   - Usar endereco salvo do usuario
   - Gravar Order no Payload
   - Gravar XPTransaction no Payload
   - Gravar InventoryMovement no Payload

3. **POST /api/coupons/validate**
   - Validar elegibilidade por perfil
   - Validar limite de uso
   - Retornar valor de desconto calculado

4. **inventory.service.ts**
   - Reservar estoque na criacao do pedido
   - Converter reserva em venda quando pago
   - Cancelar reserva quando pagamento falha
   - Registrar InventoryMovement para cada operacao

5. **xp.service.ts**
   - Calcular XP com xpMultiplier de promocoes ativas
   - Criar XPTransaction
   - Atualizar customer.xpBalance
   - Verificar e processar level-up
   - Criar Notification de XP/level-up

6. **Pagina /checkout/sucesso**
   - Resumo do pedido
   - XP ganho e nivel
   - Tickets com QR (se evento)
   - Link para /minha-conta/pedidos

7. **Pagina /checkout/falha**
   - Motivo da falha
   - Botao "Tentar novamente" (volta ao checkout com carrinho intacto)

8. **Evoluir pagina /checkout**
   - Selecao de endereco salvo
   - Validacao de cupom em tempo real
   - Loading states para cada etapa

#### Criterios de Aceite:
- [ ] Checkout completo cria Order no Payload
- [ ] Estoque e decrementado apos pagamento aprovado
- [ ] Estoque NAO e decrementado se pagamento falha
- [ ] XP e concedido somente apos pagamento aprovado
- [ ] XP multiplicador funciona quando promocao ativa
- [ ] Level-up ocorre automaticamente
- [ ] Cupom valida elegibilidade por perfil
- [ ] Cupom incrementa currentUses apos uso
- [ ] InventoryMovement registra todas as operacoes
- [ ] Pagina de sucesso mostra resumo completo
- [ ] Pagina de falha permite retry

---

### SPRINT 5 - Portal de Gerencia (Admin)
**Objetivo**: Dashboard gerencial com metricas e gestao de distribuidores.

#### Tarefas:
1. **Dashboard customizado no Payload**
   - Componente React custom como afterDashboard view
   - Metricas: total usuarios, total pedidos, receita total, receita do periodo, ticket medio
   - Maiores compradores (top 10)
   - Ultimas compras (10 mais recentes)
   - Produtos com menor estoque (alertas)
   - Promocoes ativas
   - Cupons ativos
   - Solicitacoes de distribuidor pendentes

2. **GET /api/admin/dashboard/metrics**
   - Queries agregadas no Payload/PostgreSQL
   - Cache em Redis para performance

3. **Fluxo de aprovacao de distribuidor**
   - Custom action no Payload para Aprovar/Rejeitar
   - Atualiza CustomerProfile automaticamente
   - Cria Notification para o customer

4. **Gestao de usuarios no Payload**
   - Listar customers com filtros
   - Alterar profileType
   - Alterar tags
   - Marcar fidelidade
   - Ver historico de compras e XP

5. **GET /api/admin/xp/ranking**
   - Top customers por XP
   - Filtrar por periodo

6. **Gestao de estoque**
   - Ver inventory por produto no admin
   - Historico de movimentacoes
   - Alerta de estoque baixo (reorderLevel)

#### Criterios de Aceite:
- [ ] Dashboard mostra todas as metricas especificadas
- [ ] Aprovacao de distribuidor funciona end-to-end
- [ ] Rejeicao de distribuidor funciona end-to-end
- [ ] Admin pode alterar perfil/tags de qualquer usuario
- [ ] Ranking de XP exibe corretamente
- [ ] Historico de estoque acessivel por produto
- [ ] Apenas roles admin/manager acessam o dashboard

---

### SPRINT 6 - Fulfillment + Mapa + Notificacoes
**Objetivo**: Pos-venda funcional e features avancadas do admin.

#### Tarefas:
1. **Fulfillment basico**
   - Admin pode marcar pedido como "processing" -> "shipped"
   - Inserir trackingCode e trackingUrl
   - Criar Notification para customer
   - Admin pode marcar como "delivered"

2. **Webhook Mercado Pago (preparacao)**
   - POST /api/webhooks/mercado-pago
   - Validar assinatura
   - Atualizar status do pedido automaticamente
   - Para MVP: aceitar chamadas do sandbox

3. **Mapa de clientes**
   - Usar Leaflet.js ou Google Maps (client-side)
   - GET /api/admin/customers/map-data (enderecos com lat/lng)
   - Filtros: perfil, cidade, estado, maiores compradores
   - Click no marcador abre card do cliente

4. **Geocodificacao de enderecos**
   - No momento de salvar endereco, buscar lat/lng via API de geocoding
   - Armazenar nos campos latitude/longitude do Address

5. **Notificacoes em tempo real (polling)**
   - GET /api/notifications/unread-count
   - Polling a cada 30s no header
   - Badge atualiza automaticamente

6. **Event bus interno**
   - Implementar event-bus.ts simples (pub/sub in-process)
   - Registrar handlers para os eventos de dominio
   - Conectar: order.paid, order.shipped, xp.level-up, distributor.approved

#### Criterios de Aceite:
- [ ] Admin pode transicionar status de pedido
- [ ] Tracking code e URL sao exibidos para o customer
- [ ] Mapa mostra clientes geolocalizados
- [ ] Filtros do mapa funcionam
- [ ] Click no marcador abre card do cliente
- [ ] Notificacoes atualizam sem refresh manual
- [ ] Eventos de dominio disparam notificacoes automaticamente

---

## 2. Ordem Ideal de Implementacao

```
SPRINT 1: Collections + Repositories (fundacao de dados)
    |
    v
SPRINT 2: Auth + Cadastro (usuarios reais)
    |
    v
SPRINT 3: Central do Usuario (area logada)
    |
    v
SPRINT 4: Checkout + Estoque + XP (fluxo de compra real)
    |
    v
SPRINT 5: Portal de Gerencia (admin dashboard)
    |
    v
SPRINT 6: Fulfillment + Mapa + Notificacoes (pos-venda)
```

**Justificativa**: Cada sprint constroi sobre o anterior. Nao ha como fazer checkout real (Sprint 4) sem auth (Sprint 2). Nao ha como fazer dashboard admin (Sprint 5) sem orders reais (Sprint 4).

---

## 3. Riscos Tecnicos e Pontos de Atencao

### CRITICOS

1. **Mock -> Real transicao**
   - O maior risco e a transicao do mock-database para Payload real. A interface de repositories precisa ser identica.
   - **Mitigacao**: Criar interface abstrata primeiro, testar com mocks, depois plugar Payload.

2. **Payload Auth para Customers**
   - Payload tem auth built-in, mas e projetado para Users (admin). Usar auth em uma collection separada (Customers) e suportado mas menos documentado.
   - **Mitigacao**: Testar early. Se houver limitacao, usar JWT customizado com Payload como storage.

3. **Consistencia de estoque**
   - Race conditions em reserva de estoque sob carga concorrente.
   - **Mitigacao**: Usar transactions do PostgreSQL via Payload hooks. Para MVP, carga baixa torna isso aceitavel.

### ALTOS

4. **Integracao Mercado Pago real**
   - Sandbox funciona diferente da producao. Webhooks precisam de URL publica.
   - **Mitigacao**: Usar ngrok ou similar para dev. Implementar com sandbox primeiro.

5. **Geocodificacao**
   - APIs de geocoding tem rate limits e custos.
   - **Mitigacao**: Geocodificar apenas no save do endereco. Cachear resultado. Usar API gratuita (Nominatim/OpenStreetMap) para MVP.

6. **Performance do dashboard admin**
   - Queries agregadas (receita total, ticket medio, maiores compradores) podem ser lentas com volume.
   - **Mitigacao**: Cache em Redis com TTL de 5min para metricas. Para MVP, volume e baixo.

### MEDIOS

7. **Dupla tipagem (domain/types.ts + core/domain/models.ts)**
   - Existem dois arquivos de tipos: `packages/domain/src/types.ts` (frontend) e `packages/core/src/domain/models.ts` (backend). Podem divergir.
   - **Mitigacao**: Consolidar em um unico source of truth (preferencialmente models.ts com Zod, exportando tipos inferidos).

8. **Medusa.js subutilizado**
   - apps/commerce esta configurado mas quase nao e usado. Pode gerar confusao.
   - **Mitigacao**: Para MVP, focar em Payload como backend principal. Documentar que Medusa sera integrado em fase 2.

---

## 4. Proximos Passos Praticos para Comecar a Codar

### Passo 1: Criar as novas Collections no Payload
Arquivos a criar:
```
apps/cms/src/collections/Customers.ts
apps/cms/src/collections/Addresses.ts
apps/cms/src/collections/Orders.ts
apps/cms/src/collections/DistributorRequests.ts
apps/cms/src/collections/XPTransactions.ts
apps/cms/src/collections/Notifications.ts
apps/cms/src/collections/InventoryMovements.ts
```

### Passo 2: Registrar collections no payload.config.ts
```typescript
// apps/cms/src/payload.config.ts
collections: [
  // existentes
  Users, Products, Events, Promotions, Coupons,
  FidelityTags, XPLevels, BlogPosts, Banners,
  LandingPages, Media,
  // novas
  Customers, Addresses, Orders, DistributorRequests,
  XPTransactions, Notifications, InventoryMovements,
]
```

### Passo 3: Alterar collections existentes
- Products.ts: adicionar `{ name: "active", type: "checkbox", defaultValue: true }`
- Promotions.ts: adicionar xpMultiplier, eligibleProfiles, eligibleTags
- Coupons.ts: adicionar maxUses, currentUses, eligibleProfiles, eligibleTags

### Passo 4: Atualizar domain models
- Consolidar packages/domain/src/types.ts com packages/core/src/domain/models.ts
- Adicionar novos schemas (DistributorRequest, Address, Notification, etc.)

### Passo 5: Criar interface de repositories
```typescript
// packages/core/src/infrastructure/repositories/repository-interface.ts
export interface ICustomerRepository {
  findById(id: string): Promise<CustomerProfile | null>;
  findByEmail(email: string): Promise<CustomerProfile | null>;
  create(data: CreateCustomerInput): Promise<CustomerProfile>;
  update(id: string, data: Partial<CustomerProfile>): Promise<CustomerProfile>;
}
// ... etc para cada entidade
```

### Passo 6: Rodar migracao do Payload
```bash
cd apps/cms
pnpm payload migrate:create
pnpm payload migrate
```

Isso criara as tabelas no PostgreSQL automaticamente.

### Quando tudo da Sprint 1 estiver OK:
- Comecar Sprint 2 com as API routes de auth
- Criar paginas /login e /cadastro
- Testar fluxo completo de registro -> login -> sessao

---

## 5. Estrutura de Pastas Final Esperada

```
apps/web/
  app/
    api/
      auth/
        register/route.ts
        login/route.ts
        logout/route.ts
        me/route.ts
        forgot-password/route.ts
      customer/
        profile/route.ts
        avatar/route.ts
        addresses/route.ts
        addresses/[id]/route.ts
        addresses/[id]/default/route.ts
      distributor/
        request/route.ts
        status/route.ts
      orders/route.ts
      orders/[id]/route.ts
      xp/
        summary/route.ts
        transactions/route.ts
      notifications/route.ts
      notifications/[id]/read/route.ts
      notifications/read-all/route.ts
      notifications/unread-count/route.ts
      checkout/route.ts         (evoluir existente)
      shipping/quote/route.ts   (evoluir existente)
      coupons/validate/route.ts
      webhooks/mercado-pago/route.ts
    login/page.tsx
    cadastro/page.tsx
    cadastro/distribuidor/page.tsx
    esqueci-senha/page.tsx
    checkout/sucesso/page.tsx
    checkout/falha/page.tsx
    minha-conta/
      page.tsx                  (evoluir)
      layout.tsx                (NOVO - nav lateral)
      perfil/page.tsx
      enderecos/page.tsx
      pedidos/page.tsx
      pedidos/[id]/page.tsx
      experiencia/page.tsx
      notificacoes/page.tsx
      distribuidor/page.tsx
  middleware.ts                 (NOVO - protecao de rotas)
  src/
    store/
      auth-store.ts             (NOVO - estado de autenticacao)
    components/
      auth/
        login-form.tsx
        register-form.tsx
        distributor-form.tsx
      account/
        profile-form.tsx
        address-form.tsx
        address-list.tsx
        order-list.tsx
        order-detail.tsx
        xp-history.tsx
        notification-list.tsx
        distributor-status.tsx

apps/cms/
  src/
    collections/
      Customers.ts              (NOVO)
      Addresses.ts              (NOVO)
      Orders.ts                 (NOVO)
      DistributorRequests.ts    (NOVO)
      XPTransactions.ts         (NOVO)
      Notifications.ts          (NOVO)
      InventoryMovements.ts     (NOVO)
      Products.ts               (alterar)
      Promotions.ts             (alterar)
      Coupons.ts                (alterar)
    views/
      Dashboard.tsx             (NOVO - custom admin dashboard)

packages/core/
  src/
    application/
      auth.service.ts           (NOVO)
      customer.service.ts       (NOVO)
      address.service.ts        (NOVO)
      order.service.ts          (NOVO)
      distributor.service.ts    (NOVO)
      xp.service.ts             (NOVO)
      notification.service.ts   (NOVO)
      inventory.service.ts      (NOVO)
      coupon.service.ts         (NOVO)
    infrastructure/
      repositories/
        repository-interface.ts (NOVO)
        payload-repositories.ts (NOVO)
      events/
        event-bus.ts            (NOVO)
        handlers/               (NOVO)
```
