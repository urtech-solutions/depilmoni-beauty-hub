import { Package, Ticket, User } from "lucide-react";

import { Badge, Card } from "@depilmoni/ui";

import { XPProgressCard } from "@/components/account/xp-progress-card";
import { formatCurrency, formatDate } from "@/lib/format";
import { storefrontData } from "@/lib/storefront";

const profileLabelMap = {
  client: "Cliente",
  partner: "Parceiro",
  distributor: "Distribuidor"
} as const;

export default function MyAccountPage() {
  const dashboard = storefrontData.customerDashboard();
  const orders = storefrontData.customerOrders();
  const tickets = storefrontData.customerTickets();
  const hasFidelity = dashboard.customer.fidelityTagIds.length > 0;

  return (
    <section className="section-spacing">
      <div className="container mx-auto max-w-4xl space-y-6 py-4">
        <Card className="border border-border bg-card p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-copper/20">
              <User size={24} className="text-copper" />
            </div>
            <div>
              <h1 className="font-display text-3xl font-bold">{dashboard.customer.name}</h1>
              <div className="mt-2 flex flex-wrap gap-2">
                <Badge>{profileLabelMap[dashboard.customer.profileType]}</Badge>
                {hasFidelity ? <Badge variant="accent">Fidelidade</Badge> : null}
              </div>
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
          <Card className="space-y-4 border border-border bg-card p-6">
            <h2 className="flex items-center gap-2 font-display font-semibold">
              <Package size={18} className="text-copper" /> Meus Pedidos
            </h2>
            <div className="space-y-3">
              {orders.map((order) => (
                <div key={order.id} className="rounded-md border border-border p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium">{order.code}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(order.createdAt)}</p>
                    </div>
                    <div className="text-right">
                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">
                        {order.status}
                      </span>
                      <p className="mt-1 text-sm font-semibold">{formatCurrency(order.total)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="space-y-4 border border-border bg-card p-6">
            <h2 className="flex items-center gap-2 font-display font-semibold">
              <Ticket size={18} className="text-copper" /> Meus Ingressos
            </h2>
            <div className="space-y-3">
              {tickets.map((ticket) => (
                <div key={ticket.id} className="rounded-md border border-border p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium">{ticket.eventTitle}</p>
                      <p className="text-xs text-muted-foreground">Status: {ticket.status}</p>
                    </div>
                    <div className="rounded-full bg-copper/20 p-2 text-copper">
                      <Ticket size={16} />
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
