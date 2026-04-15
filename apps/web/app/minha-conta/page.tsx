import Link from "next/link";
import { Bell, ChevronRight, Package, Sparkles, User2 } from "lucide-react";

import { Badge, Button, Card } from "@depilmoni/ui";

import { XPProgressCard } from "@/components/account/xp-progress-card";
import { getAccountDashboard } from "@/lib/account-server";
import { formatCurrency, formatDate } from "@/lib/format";

const profileLabelMap = {
  client: "Cliente",
  partner: "Parceiro",
  distributor: "Distribuidor"
} as const;

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

export default async function MyAccountPage() {
  const dashboard = await getAccountDashboard();
  const recentOrders = dashboard.orders.slice(0, 4);
  const hasFidelity = dashboard.user.fidelityTagIds.length > 0;

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border border-border bg-card p-0">
        <div className="grid gap-6 bg-[linear-gradient(135deg,rgba(84,46,28,0.98),rgba(167,114,74,0.92))] p-6 text-white md:grid-cols-[1fr_220px] md:p-8">
          <div className="space-y-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/12">
              <User2 size={24} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/70">Cliente ativo</p>
              <h2 className="mt-2 font-display text-3xl font-semibold">{dashboard.user.name}</h2>
              <p className="mt-2 max-w-2xl text-sm text-white/80">{dashboard.user.email}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-white/12 text-white">{profileLabelMap[dashboard.user.profileType]}</Badge>
              {hasFidelity ? <Badge variant="accent">Fidelidade</Badge> : null}
              {dashboard.user.tags.map((tag) => (
                <Badge key={tag} variant="copper">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <div className="rounded-[24px] border border-white/10 bg-white/10 p-5 backdrop-blur-sm">
            <p className="text-xs uppercase tracking-[0.24em] text-white/70">Resumo rapido</p>
            <dl className="mt-4 space-y-4">
              <div>
                <dt className="text-sm text-white/70">Pedidos</dt>
                <dd className="font-display text-3xl font-semibold">{dashboard.summary.totalOrders}</dd>
              </div>
              <div>
                <dt className="text-sm text-white/70">XP atual</dt>
                <dd className="font-display text-3xl font-semibold">{dashboard.summary.currentXP}</dd>
              </div>
              <div>
                <dt className="text-sm text-white/70">Nivel</dt>
                <dd className="text-base font-medium">{dashboard.summary.level.name}</dd>
              </div>
            </dl>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="space-y-3 border border-border bg-card p-5">
          <Package className="text-copper" size={18} />
          <p className="text-sm text-muted-foreground">Pedidos realizados</p>
          <p className="font-display text-3xl font-semibold">{dashboard.summary.totalOrders}</p>
        </Card>
        <Card className="space-y-3 border border-border bg-card p-5">
          <Sparkles className="text-gold" size={18} />
          <p className="text-sm text-muted-foreground">XP acumulado</p>
          <p className="font-display text-3xl font-semibold">{dashboard.summary.currentXP}</p>
        </Card>
        <Card className="space-y-3 border border-border bg-card p-5">
          <Sparkles className="text-copper" size={18} />
          <p className="text-sm text-muted-foreground">Nivel atual</p>
          <p className="font-display text-2xl font-semibold">{dashboard.summary.level.name}</p>
        </Card>
        <Card className="space-y-3 border border-border bg-card p-5">
          <Bell className="text-copper" size={18} />
          <p className="text-sm text-muted-foreground">Nao lidas</p>
          <p className="font-display text-3xl font-semibold">{dashboard.unreadNotifications}</p>
        </Card>
      </div>

      <XPProgressCard
        currentXP={dashboard.user.xpBalance}
        level={dashboard.summary.level}
        nextLevel={dashboard.summary.nextLevel}
        progress={dashboard.summary.progress}
      />

      <Card className="space-y-5 border border-border bg-card p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">Pedidos recentes</p>
            <h3 className="mt-2 font-display text-2xl font-semibold">Acompanhe seus ultimos pedidos</h3>
          </div>
          <Button asChild variant="outline">
            <Link href="/minha-conta/pedidos">Ver todos</Link>
          </Button>
        </div>

        <div className="space-y-3">
          {recentOrders.length ? (
            recentOrders.map((order) => (
              <Link
                key={order.id}
                href={`/minha-conta/pedidos/${order.id}`}
                className="flex flex-col gap-4 rounded-[24px] border border-border/70 p-4 transition-colors hover:bg-secondary/50 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="font-medium text-foreground">{order.code}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{formatDate(order.createdAt)}</p>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant="copper">{statusLabelMap[order.status] ?? order.status}</Badge>
                  <p className="font-semibold text-foreground">{formatCurrency(order.total)}</p>
                  <ChevronRight size={16} className="text-muted-foreground" />
                </div>
              </Link>
            ))
          ) : (
            <div className="rounded-[24px] border border-dashed border-border/70 p-6 text-sm text-muted-foreground">
              Voce ainda nao possui pedidos persistidos no portal. Assim que concluir sua primeira
              compra, ela aparecera aqui.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
