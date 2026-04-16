import type { CSSProperties } from "react";

import { getAdminDashboardMetrics, getAdminXPRanking } from "../../lib/admin-dashboard";

const moneyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL"
});

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short"
});

const cardStyle: CSSProperties = {
  borderRadius: 24,
  border: "1px solid rgba(120,84,54,0.16)",
  background: "#ffffff",
  padding: 20,
  boxShadow: "0 24px 60px rgba(94,62,39,0.08)"
};

export async function ManagerDashboard() {
  const [metrics, ranking] = await Promise.all([
    getAdminDashboardMetrics(),
    getAdminXPRanking()
  ]);

  return (
    <div
      style={{
        marginTop: 24,
        display: "grid",
        gap: 24
      }}
    >
      <section
        style={{
          borderRadius: 28,
          padding: 28,
          background:
            "linear-gradient(135deg, rgba(80,48,33,0.98), rgba(122,78,52,0.96) 52%, rgba(184,127,74,0.92))",
          color: "#fff7f0",
          boxShadow: "0 30px 70px rgba(70, 42, 28, 0.24)"
        }}
      >
        <div style={{ display: "grid", gap: 8 }}>
          <span
            style={{
              textTransform: "uppercase",
              letterSpacing: "0.18em",
              fontSize: 12,
              opacity: 0.78
            }}
          >
            Portal de Gerência Depilmoni
          </span>
          <h1 style={{ margin: 0, fontSize: 32, lineHeight: 1.1 }}>
            Operação, receita e distribuidores em um só painel
          </h1>
          <p style={{ margin: 0, maxWidth: 720, fontSize: 15, opacity: 0.86 }}>
            Atualizado em {dateFormatter.format(new Date(metrics.generatedAt))}. O painel cruza
            pedidos, clientes, promoções e aprovações para dar visibilidade rápida do MVP.
          </p>
        </div>
      </section>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 16
        }}
      >
        <article style={cardStyle}>
          <p style={{ margin: 0, color: "#7b6456", fontSize: 13 }}>Clientes</p>
          <strong style={{ display: "block", marginTop: 10, fontSize: 28 }}>
            {metrics.totals.customers}
          </strong>
        </article>
        <article style={cardStyle}>
          <p style={{ margin: 0, color: "#7b6456", fontSize: 13 }}>Pedidos</p>
          <strong style={{ display: "block", marginTop: 10, fontSize: 28 }}>
            {metrics.totals.orders}
          </strong>
        </article>
        <article style={cardStyle}>
          <p style={{ margin: 0, color: "#7b6456", fontSize: 13 }}>Receita total</p>
          <strong style={{ display: "block", marginTop: 10, fontSize: 28 }}>
            {moneyFormatter.format(metrics.totals.totalRevenue)}
          </strong>
        </article>
        <article style={cardStyle}>
          <p style={{ margin: 0, color: "#7b6456", fontSize: 13 }}>Receita do mês</p>
          <strong style={{ display: "block", marginTop: 10, fontSize: 28 }}>
            {moneyFormatter.format(metrics.totals.currentMonthRevenue)}
          </strong>
        </article>
        <article style={cardStyle}>
          <p style={{ margin: 0, color: "#7b6456", fontSize: 13 }}>Ticket médio</p>
          <strong style={{ display: "block", marginTop: 10, fontSize: 28 }}>
            {moneyFormatter.format(metrics.totals.averageTicket)}
          </strong>
        </article>
        <article style={cardStyle}>
          <p style={{ margin: 0, color: "#7b6456", fontSize: 13 }}>Distribuidores pendentes</p>
          <strong style={{ display: "block", marginTop: 10, fontSize: 28 }}>
            {metrics.totals.pendingDistributorRequests}
          </strong>
        </article>
      </section>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: 16
        }}
      >
        <article style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 18 }}>Top compradores</h2>
              <p style={{ margin: "6px 0 0", color: "#7b6456", fontSize: 13 }}>
                Ranking por faturamento real do período total
              </p>
            </div>
          </div>
          <div style={{ marginTop: 16, display: "grid", gap: 12 }}>
            {metrics.topCustomers.map((customer) => (
              <div
                key={customer.id}
                style={{
                  display: "grid",
                  gap: 4,
                  paddingBottom: 12,
                  borderBottom: "1px solid rgba(120,84,54,0.10)"
                }}
              >
                <strong>{customer.name}</strong>
                <span style={{ color: "#7b6456", fontSize: 13 }}>{customer.email}</span>
                <span style={{ color: "#7b6456", fontSize: 13 }}>
                  {customer.orderCount} pedidos • {moneyFormatter.format(customer.totalSpent)} •{" "}
                  {customer.xpBalance} XP
                </span>
              </div>
            ))}
          </div>
        </article>

        <article style={cardStyle}>
          <h2 style={{ margin: 0, fontSize: 18 }}>Últimas compras</h2>
          <p style={{ margin: "6px 0 0", color: "#7b6456", fontSize: 13 }}>
            Acompanhe o ritmo operacional do storefront
          </p>
          <div style={{ marginTop: 16, display: "grid", gap: 12 }}>
            {metrics.latestOrders.map((order) => (
              <div
                key={order.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                  paddingBottom: 12,
                  borderBottom: "1px solid rgba(120,84,54,0.10)"
                }}
              >
                <div style={{ display: "grid", gap: 4 }}>
                  <strong>{order.code}</strong>
                  <span style={{ color: "#7b6456", fontSize: 13 }}>{order.customerName}</span>
                  <span style={{ color: "#7b6456", fontSize: 13 }}>
                    {order.createdAt ? dateFormatter.format(new Date(order.createdAt)) : "Sem data"}
                  </span>
                </div>
                <div style={{ textAlign: "right", display: "grid", gap: 4 }}>
                  <strong>{moneyFormatter.format(order.total)}</strong>
                  <span style={{ color: "#7b6456", fontSize: 13 }}>{order.status}</span>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article style={cardStyle}>
          <h2 style={{ margin: 0, fontSize: 18 }}>Estoque baixo</h2>
          <p style={{ margin: "6px 0 0", color: "#7b6456", fontSize: 13 }}>
            Variantes abaixo do ponto de reposição configurado
          </p>
          <div style={{ marginTop: 16, display: "grid", gap: 12 }}>
            {metrics.lowStockItems.length ? (
              metrics.lowStockItems.map((item) => (
                <div
                  key={`${item.productId}-${item.sku}`}
                  style={{
                    display: "grid",
                    gap: 4,
                    paddingBottom: 12,
                    borderBottom: "1px solid rgba(120,84,54,0.10)"
                  }}
                >
                  <strong>{item.productName}</strong>
                  <span style={{ color: "#7b6456", fontSize: 13 }}>
                    {item.variantName} • {item.sku}
                  </span>
                  <span style={{ color: "#7b6456", fontSize: 13 }}>
                    Estoque {item.stock} • Reposição {item.reorderLevel}
                  </span>
                </div>
              ))
            ) : (
              <span style={{ color: "#7b6456", fontSize: 14 }}>
                Nenhuma variante crítica no momento.
              </span>
            )}
          </div>
        </article>

        <article style={cardStyle}>
          <h2 style={{ margin: 0, fontSize: 18 }}>Promoções e cupons ativos</h2>
          <p style={{ margin: "6px 0 0", color: "#7b6456", fontSize: 13 }}>
            Monitoramento rápido de campanhas vigentes
          </p>
          <div style={{ marginTop: 16, display: "grid", gap: 12 }}>
            {metrics.activeOffers.length ? (
              metrics.activeOffers.map((offer) => (
                <div
                  key={`${offer.kind}-${offer.id}`}
                  style={{
                    display: "grid",
                    gap: 4,
                    paddingBottom: 12,
                    borderBottom: "1px solid rgba(120,84,54,0.10)"
                  }}
                >
                  <strong>{offer.title}</strong>
                  <span style={{ color: "#7b6456", fontSize: 13 }}>
                    {offer.kind === "promotion" ? "Promoção" : "Cupom"} • {offer.statusLabel}
                  </span>
                  <span style={{ color: "#7b6456", fontSize: 13 }}>
                    {offer.startsAt ? dateFormatter.format(new Date(offer.startsAt)) : "Sem início"} até{" "}
                    {offer.endsAt ? dateFormatter.format(new Date(offer.endsAt)) : "sem fim"}
                  </span>
                </div>
              ))
            ) : (
              <span style={{ color: "#7b6456", fontSize: 14 }}>
                Nenhuma oferta ativa encontrada.
              </span>
            )}
          </div>
        </article>

        <article style={cardStyle}>
          <h2 style={{ margin: 0, fontSize: 18 }}>Solicitações de distribuidor</h2>
          <p style={{ margin: "6px 0 0", color: "#7b6456", fontSize: 13 }}>
            Pendências que exigem revisão gerencial
          </p>
          <div style={{ marginTop: 16, display: "grid", gap: 12 }}>
            {metrics.pendingDistributorRequests.length ? (
              metrics.pendingDistributorRequests.map((request) => (
                <div
                  key={request.id}
                  style={{
                    display: "grid",
                    gap: 4,
                    paddingBottom: 12,
                    borderBottom: "1px solid rgba(120,84,54,0.10)"
                  }}
                >
                  <strong>{request.companyName}</strong>
                  <span style={{ color: "#7b6456", fontSize: 13 }}>{request.responsibleName}</span>
                  <span style={{ color: "#7b6456", fontSize: 13 }}>
                    {request.city}/{request.state}
                  </span>
                </div>
              ))
            ) : (
              <span style={{ color: "#7b6456", fontSize: 14 }}>
                Nenhuma solicitação pendente.
              </span>
            )}
          </div>
        </article>

        <article style={cardStyle}>
          <h2 style={{ margin: 0, fontSize: 18 }}>Ranking de XP</h2>
          <p style={{ margin: "6px 0 0", color: "#7b6456", fontSize: 13 }}>
            Top clientes por ganho acumulado de XP
          </p>
          <div style={{ marginTop: 16, display: "grid", gap: 12 }}>
            {ranking.length ? (
              ranking.slice(0, 10).map((entry) => (
                <div
                  key={entry.customerId}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 12,
                    paddingBottom: 12,
                    borderBottom: "1px solid rgba(120,84,54,0.10)"
                  }}
                >
                  <div style={{ display: "grid", gap: 4 }}>
                    <strong>
                      #{entry.rank} {entry.customerName}
                    </strong>
                    <span style={{ color: "#7b6456", fontSize: 13 }}>{entry.customerEmail}</span>
                  </div>
                  <div style={{ textAlign: "right", display: "grid", gap: 4 }}>
                    <strong>{entry.xpEarned} XP</strong>
                    <span style={{ color: "#7b6456", fontSize: 13 }}>
                      {entry.transactionCount} transações
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <span style={{ color: "#7b6456", fontSize: 14 }}>
                Nenhuma transação de XP encontrada.
              </span>
            )}
          </div>
        </article>
      </section>
    </div>
  );
}
