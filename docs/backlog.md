# Backlog Tecnico por Sprint

## Sprint 0 — Fundacao

- Consolidar monorepo oficial com `apps/web`, `apps/cms`, `apps/commerce`, `packages/core` e `packages/ui`
- Padronizar ambiente local com `pnpm`, `turbo`, `docker compose`, PostgreSQL e Redis
- Fechar design system base da Depilmoni com tokens premium
- Garantir build do workspace e documentacao operacional

## Sprint 1 — MVP funcional

- Conectar homepage por blocos ao Payload real
- Persistir seed do `core` no `Payload` e no banco
- Trocar repositorios em memoria por persistencia em PostgreSQL
- Implementar auth basica para cliente autenticado
- Finalizar fluxo de pedido de produto com pedido persistido
- Finalizar fluxo de compra de ticket com ticket persistido

## Sprint 2 — Operacao comercial

- Integrar `Medusa` ao catalogo real
- Sincronizar estoque, variantes e preco com regras por perfil
- Criar painel de cupons, promocoes relampago e campanhas
- Implementar controle de estoque por reserva/baixa
- Criar backoffice de eventos com lotes e check-in

## Sprint 3 — Integracoes externas

- Integrar Mercado Pago real com cartao, Pix e webhooks
- Integrar Melhor Envio real para cotacao e etiqueta
- Configurar Redis para filas reais de pedido, ticket e notificacao
- Ligar Sentry e PostHog com ambientes separados
- Criar observabilidade de checkout, falha de pagamento e estoque

## Sprint 4 — Portal e fidelizacao

- Implementar login, recuperacao de senha e sessoes seguras
- Criar area do parceiro e do distribuidor com guardas reais
- Persistir XP, niveis, beneficios e historico de transacoes
- Implementar beneficio de fidelidade manual por tag
- Liberar dashboard com pedidos, tickets, status de check-in e beneficios

## Sprint 5 — Escala e refinamento

- SEO completo com metadata dinamica vinda do CMS
- i18n expandida para futuras localidades
- Testes e2e cobrindo compra de produto e evento
- Hardening de seguranca, rate limiting e audit trail
- Pipeline CI/CD, ambientes preview e backups
