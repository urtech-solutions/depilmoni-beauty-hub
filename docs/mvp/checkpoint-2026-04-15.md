# Checkpoint MVP — 2026-04-15

## 1. Estrutura final do monorepo

```
apps/
  web/        → Next.js storefront (porta 3000)
  cms/        → Payload CMS embedded em Next.js (porta 3001)
  commerce/   → Medusa (workspace, mas FASE 2 — ainda não usado)
packages/
  core/       → domain models, services, repositories
  ui/         → componentes compartilhados
  config-eslint/, config-typescript/
legacy/
  root-storefront-vite/ → Vite SPA arquivado (referência visual)
docker/      → init scripts do Postgres
docs/        → documentação MVP + arquitetura
```

## 2. Lixo removido nesta sessão

| Diretório | Motivo |
|---|---|
| `apps/storefront/` | Duplicata antiga do Next.js (não estava no workspace) |
| `packages/domain/` | Substituído por `packages/core/src/domain/` |
| `packages/application/` | `src/` vazio, substituído por `packages/core/src/application/` |
| `packages/infrastructure/` | `src/` vazio, substituído por `packages/core/src/infrastructure/` |
| `tsconfig.base.json` paths | Removidos aliases para os 3 packages acima |

## 3. Bootstrap do admin

**Variáveis de ambiente** (já em `.env` e `.env.example`):

```
PAYLOAD_ADMIN_EMAIL=admin@depilmoni.local
PAYLOAD_ADMIN_PASSWORD=ChangeMe123!
PAYLOAD_ADMIN_NAME="Admin Depilmoni"
```

**Comando** (idempotente — promove para admin se já existir):

```bash
pnpm seed:admin
```

Saída esperada na primeira execução: `[seed-admin] Admin criado: admin@depilmoni.local`.

## 4. Validação end-to-end (executada agora)

| Fluxo | Endpoint | Status |
|---|---|---|
| Admin login (Payload REST) | `POST /api/users/login` (3001) | OK — JWT retornado |
| Customer register (storefront) | `POST /api/auth/register` (3000) | OK — cookie httpOnly setado |
| Customer me | `GET /api/auth/me` | OK — sessão válida |
| Customer logout | `POST /api/auth/logout` | OK — cookie limpo |
| Customer me após logout | `GET /api/auth/me` | OK — `user: null` |
| Customer login | `POST /api/auth/login` | OK |
| Admin edita customer | `PATCH /api/customers/:id` (3001) | OK — profileType + tags atualizados |
| Admin lista customers | `GET /api/customers` (3001) | OK |
| Admin deleta customer | `DELETE /api/customers/:id` (3001) | OK |
| Customer atualiza perfil | `PATCH /api/customer/profile` (3000) | OK |
| Customer cria endereço | `POST /api/customer/addresses` (3000) | OK |
| Customer lista endereços | `GET /api/customer/addresses` (3000) | OK |
| Customer consulta XP | `GET /api/xp/summary` (3000) | OK |
| Customer cria solicitação de distribuidor | `POST /api/distributor/request` (3000) | OK |
| Customer lista pedidos | `GET /api/orders` (3000) | OK |
| Customer vê detalhe do pedido | `GET /api/orders/:id` (3000) | OK |
| Página autenticada de pedido | `GET /minha-conta/pedidos/:id` (3000) | OK — `200` |
| Admin cria notificação | `POST /api/notifications` (3001) | OK |
| Customer lê notificações | `GET /api/notifications` (3000) | OK |
| Customer marca notificação como lida | `POST /api/notifications/:id/read` (3000) | OK |
| Badge de notificações | `GET /api/notifications/unread-count` (3000) | OK — `1 → 0` validado |

## 5. O que funciona hoje

- **Portal admin** em `http://localhost:3001/admin` — login com credenciais do `.env`
- **Storefront** em `http://localhost:3000` — todas as rotas públicas e privadas da Sprint 3 buildando
- **Cadastro/login/logout** de cliente via storefront com cookie JWT httpOnly
- **Middleware** protege `/minha-conta/*`, `/checkout` e `/cadastro/distribuidor`, redireciona usuário logado para fora de `/login` e `/cadastro`
- **Header dinâmico** mostra conta autenticada e badge de notificações não lidas
- **CRUD completo de customers** via admin (criar, listar, editar perfil/tags/XP, deletar)
- **Portal do cliente** com dashboard, perfil, endereços, pedidos, experiência, notificações e distribuidor
- **CRUD de endereços** com padrão único por customer
- **Pedidos** com lista, detalhe e timeline
- **Fluxo de distribuidor** com criação de solicitação e estado refletido em `/minha-conta/distribuidor`
- **17 collections** ativas no Payload com todas as tabelas geradas no Postgres
- **Lint do web** roda sem depender de `.next/types` gerados previamente
- **Build do web** validado com todas as rotas da Sprint 3

## 6. O que falta (Sprint 3+)

- Checkout real (gravar Order, decrementar estoque, conceder XP)
- Dashboard customizado no admin com métricas
- Webhook Mercado Pago
- Mapa de clientes geolocalizado
- Notificações em tempo real
- Upload de avatar/documentos via `Media` para o fluxo do portal
- Lookup opcional de CEP (ViaCEP)

## 7. Ponto de retomada

**Sprint atual concluída**: Sprint 3.

**Próxima sprint**: Sprint 4 — Checkout real + Estoque + XP.

**Primeiro bloco recomendado ao retomar**:

1. Conectar `/checkout` ao Payload real com `Orders`, `InventoryMovements` e `XPTransactions`.
2. Persistir `addressId` do usuário no checkout e validar cupom por perfil/tag.
3. Criar páginas `/checkout/sucesso` e `/checkout/falha`.
4. Iniciar `inventory.service.ts` e `xp.service.ts` em `packages/core/src/application/`.

## 8. Como rodar localmente

```bash
nvm use 22                   # Node 22 obrigatório
pnpm install
pnpm dev:infra               # sobe Postgres + Redis
pnpm seed:admin              # cria admin (rodar 1 vez)
pnpm dev                     # web (3000) + cms (3001) em paralelo
```

Se `pnpm dev` falhar com `EADDRINUSE`, verifique se já existem instâncias em `3000` e `3001` antes de subir novamente.

Acesse:
- http://localhost:3000 — storefront
- http://localhost:3000/cadastro — criar conta de cliente
- http://localhost:3000/minha-conta — central autenticada do cliente
- http://localhost:3001/admin — portal de gestão
