import Link from "next/link";

import { Badge, Button, Card } from "@depilmoni/ui";

import { getCurrentUser, getDistributorRequestForCurrentUser } from "@/lib/account-server";
import { formatDateTime } from "@/lib/format";

const statusLabelMap: Record<string, string> = {
  none: "Sem solicitação",
  pending_review: "Em análise",
  approved: "Aprovado",
  rejected: "Reprovado"
};

export default async function DistribuidorPage() {
  const user = await getCurrentUser();
  const request = await getDistributorRequestForCurrentUser();

  const status = request?.status ?? user.distributorStatus;

  return (
    <div className="space-y-6">
      <Card className="space-y-4 border border-border bg-card p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">Distribuidor</p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-foreground">
              Programa comercial Depilmoni
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Acompanhe o status da sua solicitação e mantenha a equipe alinhada sobre a sua operação.
            </p>
          </div>
          <Badge variant="copper">{statusLabelMap[status] ?? status}</Badge>
        </div>
      </Card>

      {request ? (
        <Card className="space-y-5 border border-border bg-card p-6">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">Solicitação atual</p>
            <h3 className="mt-2 font-display text-2xl font-semibold text-foreground">{request.companyName}</h3>
          </div>

          <dl className="grid gap-4 md:grid-cols-2">
            <div>
              <dt className="text-sm text-muted-foreground">Responsável</dt>
              <dd className="mt-1 font-medium text-foreground">{request.responsibleName}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">CNPJ</dt>
              <dd className="mt-1 font-medium text-foreground">{request.cnpj}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Telefone</dt>
              <dd className="mt-1 font-medium text-foreground">{request.phone}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Enviada em</dt>
              <dd className="mt-1 font-medium text-foreground">{formatDateTime(request.createdAt)}</dd>
            </div>
          </dl>

          <div className="rounded-[24px] border border-border/70 bg-background/50 p-5">
            <p className="text-sm text-muted-foreground">
              Endereço comercial: {request.commercialAddress.street}
              {request.commercialAddress.number ? `, ${request.commercialAddress.number}` : ""} ·{" "}
              {request.commercialAddress.city}/{request.commercialAddress.state}
            </p>
            {request.reviewNotes ? (
              <p className="mt-3 text-sm text-foreground">Observação da gerência: {request.reviewNotes}</p>
            ) : null}
          </div>

          {request.status === "rejected" ? (
            <div className="flex justify-end">
              <Button asChild variant="hero">
                <Link href="/cadastro/distribuidor">Enviar nova solicitacao</Link>
              </Button>
            </div>
          ) : null}
        </Card>
      ) : (
        <Card className="space-y-4 border border-dashed border-border/70 bg-card p-6">
          <h3 className="font-display text-2xl font-semibold text-foreground">
            Nenhuma solicitação enviada ainda
          </h3>
          <p className="text-sm text-muted-foreground">
            Se voce atende revenda, distribuicao regional ou treinamento profissional, envie sua
            solicitação para avaliação da equipe.
          </p>
          <div className="flex justify-end">
            <Button asChild variant="hero">
              <Link href="/cadastro/distribuidor">Quero me tornar distribuidor</Link>
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
