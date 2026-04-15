import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { Badge, Card } from "@depilmoni/ui";

import { listOrdersForCurrentUser } from "@/lib/account-server";
import { formatCurrency, formatDate } from "@/lib/format";

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

export default async function PedidosPage() {
  const orders = await listOrdersForCurrentUser();

  return (
    <div className="space-y-6">
      <Card className="space-y-3 border border-border bg-card p-6">
        <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">Pedidos</p>
        <h2 className="font-display text-3xl font-semibold text-foreground">Historico de compras</h2>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Consulte status, totais, meios de pagamento e acompanhe os detalhes de cada pedido.
        </p>
      </Card>

      <div className="space-y-4">
        {orders.length ? (
          orders.map((order) => (
            <Link
              key={order.id}
              href={`/minha-conta/pedidos/${order.id}`}
              className="flex flex-col gap-4 rounded-[28px] border border-border/70 bg-card p-6 shadow-[0_24px_60px_-42px_rgba(84,46,28,0.38)] transition-colors hover:bg-secondary/50 md:flex-row md:items-center md:justify-between"
            >
              <div className="space-y-2">
                <p className="font-display text-2xl font-semibold text-foreground">{order.code}</p>
                <p className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</p>
                <p className="text-sm text-muted-foreground">{order.items.length} itens no pedido</p>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant="copper">{statusLabelMap[order.status] ?? order.status}</Badge>
                <p className="font-semibold text-foreground">{formatCurrency(order.total)}</p>
                <ChevronRight size={18} className="text-muted-foreground" />
              </div>
            </Link>
          ))
        ) : (
          <Card className="border border-dashed border-border/70 bg-card p-6 text-sm text-muted-foreground">
            Nenhum pedido persistido ainda. Assim que o checkout mockado ou real gravar pedidos
            no Payload, eles aparecerao aqui.
          </Card>
        )}
      </div>
    </div>
  );
}
