import { Card } from "@depilmoni/ui";

import { XPProgressCard } from "@/components/account/xp-progress-card";
import { getXPSummaryForCurrentUser, listXPTransactionsForCurrentUser } from "@/lib/account-server";
import { formatDateTime } from "@/lib/format";

const sourceLabelMap: Record<string, string> = {
  "order-paid": "Pedido pago",
  "event-ticket": "Ticket de evento",
  "manual-adjustment": "Ajuste manual"
};

export default async function ExperienciaPage() {
  const summary = await getXPSummaryForCurrentUser();
  const transactions = await listXPTransactionsForCurrentUser();

  return (
    <div className="space-y-6">
      <XPProgressCard
        currentXP={summary.user.xpBalance}
        level={summary.level}
        nextLevel={summary.nextLevel}
        progress={summary.progress}
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <Card className="space-y-4 border border-border bg-card p-6">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">Beneficios</p>
            <h2 className="mt-2 font-display text-2xl font-semibold text-foreground">
              O que voce ja desbloqueou
            </h2>
          </div>

          <div className="grid gap-3">
            {(summary.user.benefitsUnlocked.length ? summary.user.benefitsUnlocked : summary.level.benefits).map(
              (benefit) => (
                <div
                  key={benefit}
                  className="rounded-[20px] border border-border/70 bg-background/60 px-4 py-4 text-sm text-foreground"
                >
                  {benefit}
                </div>
              )
            )}
          </div>
        </Card>

        <Card className="space-y-4 border border-border bg-card p-6">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">Como ganhar mais XP</p>
            <h2 className="mt-2 font-display text-2xl font-semibold text-foreground">Próximas ações sugeridas</h2>
          </div>

          <div className="grid gap-3 text-sm text-muted-foreground">
            <div className="rounded-[20px] border border-border/70 px-4 py-4">
              Concluir pedidos pagos e manter frequência de recompra.
            </div>
            <div className="rounded-[20px] border border-border/70 px-4 py-4">
              Participar de eventos e cursos presenciais da equipe Depilmoni.
            </div>
            <div className="rounded-[20px] border border-border/70 px-4 py-4">
              Aproveitar campanhas que ativam multiplicadores de XP nas promoções.
            </div>
          </div>
        </Card>
      </div>

      <Card className="space-y-4 border border-border bg-card p-6">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">Historico</p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-foreground">Transações de experiência</h2>
        </div>

        <div className="space-y-3">
          {transactions.length ? (
            transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex flex-col gap-2 rounded-[22px] border border-border/70 px-4 py-4 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="font-medium text-foreground">
                    {sourceLabelMap[transaction.source] ?? transaction.source}
                  </p>
                  <p className="text-sm text-muted-foreground">{formatDateTime(transaction.createdAt)}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">+{transaction.amount} XP</p>
                  <p className="text-xs text-muted-foreground">Ref. {transaction.referenceId}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-[22px] border border-dashed border-border/70 px-4 py-5 text-sm text-muted-foreground">
              Nenhuma transação de XP registrada ainda.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
