import { Ticket } from "lucide-react";

import { Badge, Card } from "@depilmoni/ui";

import { XPProgressCard } from "@/components/account/xp-progress-card";
import { formatCurrency, formatDate } from "@/lib/format";
import { storefrontData } from "@/lib/storefront";

export default function MyAccountPage() {
  const dashboard = storefrontData.customerDashboard();
  const orders = storefrontData.customerOrders();
  const tickets = storefrontData.customerTickets();

  return (
    <section className="section-spacing">
      <div className="container space-y-8">
        <Card className="space-y-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-[var(--color-accent-copper)]">
                Portal do usuario
              </p>
              <h1 className="mt-3 font-display text-5xl">{dashboard.customer.name}</h1>
              <p className="mt-2 text-base leading-7 text-muted-foreground">
                Perfil {dashboard.customer.profileType} com fidelidade e beneficios configuraveis por nivel.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge>{dashboard.customer.profileType}</Badge>
              {dashboard.customer.tags.map((tag) => (
                <Badge key={tag} variant="accent">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </Card>

        <XPProgressCard
          currentXP={dashboard.customer.xpBalance}
          level={dashboard.level}
          nextLevel={dashboard.nextLevel}
          progress={dashboard.progress}
        />

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="space-y-4">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-[var(--color-accent-copper)]">
                Pedidos
              </p>
              <h2 className="mt-2 font-display text-3xl">Historico recente</h2>
            </div>
            <div className="space-y-3">
              {orders.map((order) => (
                <div key={order.id} className="rounded-2xl border border-border/70 bg-background/70 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-medium text-foreground">{order.code}</p>
                      <p className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</p>
                    </div>
                    <p className="font-semibold text-foreground">{formatCurrency(order.total)}</p>
                  </div>
                  <p className="mt-2 text-xs uppercase tracking-[0.24em] text-muted-foreground">
                    XP gerado: {order.xpEarned}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="space-y-4">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-[var(--color-accent-copper)]">
                Tickets
              </p>
              <h2 className="mt-2 font-display text-3xl">Ingressos ativos</h2>
            </div>
            <div className="space-y-3">
              {tickets.map((ticket) => (
                <div key={ticket.id} className="rounded-2xl border border-border/70 bg-background/70 p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-[rgba(167,114,74,0.12)] p-2 text-[var(--color-accent-copper)]">
                      <Ticket size={16} />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{ticket.eventTitle}</p>
                      <p className="text-sm text-muted-foreground">Status: {ticket.status}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
