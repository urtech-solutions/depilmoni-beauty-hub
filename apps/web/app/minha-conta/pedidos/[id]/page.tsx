import { notFound } from "next/navigation";

import { Badge, Card } from "@depilmoni/ui";

import { getOrderForCurrentUser, getOrderItemLabel } from "@/lib/account-server";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/format";

const statusSteps = [
  "pending",
  "awaiting-payment",
  "paid",
  "processing",
  "shipped",
  "delivered"
] as const;

const statusLabelMap: Record<string, string> = {
  pending: "Pendente",
  "awaiting-payment": "Aguardando pagamento",
  paid: "Pago",
  processing: "Processando",
  shipped: "Enviado",
  delivered: "Entregue",
  cancelled: "Cancelado",
  refunded: "Reembolsado"
};

export default async function PedidoDetalhePage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrderForCurrentUser(id);

  if (!order) {
    notFound();
  }

  const itemLabels = await Promise.all(order.items.map((item) => getOrderItemLabel(item)));
  const currentStepIndex = statusSteps.findIndex((step) => step === order.status);

  return (
    <div className="space-y-6">
      <Card className="space-y-4 border border-border bg-card p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">Pedido</p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-foreground">{order.code}</h2>
            <p className="mt-2 text-sm text-muted-foreground">Criado em {formatDateTime(order.createdAt)}</p>
          </div>
          <Badge variant="copper">{statusLabelMap[order.status] ?? order.status}</Badge>
        </div>
      </Card>

      <Card className="space-y-5 border border-border bg-card p-6">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">Timeline</p>
          <h3 className="mt-2 font-display text-2xl font-semibold text-foreground">Andamento do pedido</h3>
        </div>

        <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-6">
          {statusSteps.map((step, index) => {
            const active = currentStepIndex >= 0 && index <= currentStepIndex;

            return (
              <div
                key={step}
                className={`rounded-[22px] border px-4 py-4 text-sm ${
                  active
                    ? "border-copper/30 bg-secondary text-foreground"
                    : "border-border/70 bg-background/50 text-muted-foreground"
                }`}
              >
                <p className="text-xs uppercase tracking-[0.2em]">{index + 1}</p>
                <p className="mt-2 font-medium">{statusLabelMap[step]}</p>
              </div>
            );
          })}
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="space-y-4 border border-border bg-card p-6">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">Itens</p>
            <h3 className="mt-2 font-display text-2xl font-semibold text-foreground">Resumo do pedido</h3>
          </div>

          <div className="space-y-3">
            {order.items.map((item, index) => (
              <div
                key={`${item.type}-${index}`}
                className="flex items-start justify-between gap-4 rounded-[22px] border border-border/70 px-4 py-4"
              >
                <div>
                  <p className="font-medium text-foreground">{itemLabels[index]}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {item.type === "product" ? "Produto" : "Ingresso"} · {item.quantity} unidade(s)
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="space-y-4 border border-border bg-card p-6">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">Financeiro</p>
            <h3 className="mt-2 font-display text-2xl font-semibold text-foreground">
              Composicao de pricing
            </h3>
          </div>

          <dl className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Subtotal</dt>
              <dd className="font-medium text-foreground">{formatCurrency(order.subtotal)}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Desconto por perfil</dt>
              <dd className="font-medium text-foreground">- {formatCurrency(order.profileDiscount)}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Beneficio de fidelidade</dt>
              <dd className="font-medium text-foreground">- {formatCurrency(order.fidelityDiscount)}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Promocao</dt>
              <dd className="font-medium text-foreground">- {formatCurrency(order.promotionDiscount)}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Cupom</dt>
              <dd className="font-medium text-foreground">- {formatCurrency(order.couponDiscount)}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Frete</dt>
              <dd className="font-medium text-foreground">{formatCurrency(order.shippingAmount)}</dd>
            </div>
            <div className="flex items-center justify-between border-t border-border/70 pt-3">
              <dt className="font-medium text-foreground">Total</dt>
              <dd className="font-display text-2xl font-semibold text-foreground">
                {formatCurrency(order.total)}
              </dd>
            </div>
          </dl>

          <div className="rounded-[22px] border border-border/70 p-4 text-sm text-muted-foreground">
            <p>Pagamento: {order.paymentMethod === "pix" ? "PIX" : "Cartao de credito"}</p>
            <p className="mt-2">XP gerado: {order.xpEarned}</p>
            {order.shippedAt ? <p className="mt-2">Enviado em {formatDate(order.shippedAt)}</p> : null}
            {order.deliveredAt ? (
              <p className="mt-2">Entregue em {formatDate(order.deliveredAt)}</p>
            ) : null}
          </div>

          {order.trackingCode ? (
            <div className="rounded-[22px] border border-copper/30 bg-secondary p-4">
              <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">Rastreio</p>
              <p className="mt-2 font-mono text-lg font-semibold text-foreground">{order.trackingCode}</p>
              {order.trackingUrl ? (
                <a
                  href={order.trackingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-sm font-medium text-[var(--color-accent-copper)] underline underline-offset-4"
                >
                  Acompanhar entrega
                </a>
              ) : null}
            </div>
          ) : null}
        </Card>
      </div>
    </div>
  );
}
