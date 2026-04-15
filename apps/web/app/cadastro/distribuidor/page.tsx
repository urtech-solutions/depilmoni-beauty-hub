import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { Card } from "@depilmoni/ui";

import { DistributorRequestForm } from "@/components/account/distributor-request-form";
import { getCurrentUser } from "@/lib/account-server";

export const metadata = { title: "Cadastro de distribuidor" };

export default async function CadastroDistribuidorPage() {
  const user = await getCurrentUser();

  return (
    <section className="section-spacing">
      <div className="container mx-auto max-w-5xl space-y-6 py-4">
        <Link
          href="/minha-conta/distribuidor"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft size={16} />
          Voltar para a central do distribuidor
        </Link>

        <Card className="space-y-5 border border-border bg-card p-6 md:p-8">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
              Solicitação comercial
            </p>
            <h1 className="font-display text-3xl font-semibold text-foreground md:text-4xl">
              Expandir com a Depilmoni
            </h1>
            <p className="max-w-3xl text-sm text-muted-foreground md:text-base">
              {user.name}, preencha os dados da sua operação para avaliarmos a entrada no programa
              de distribuição, revenda ou treinamento regional.
            </p>
          </div>

          <DistributorRequestForm />
        </Card>
      </div>
    </section>
  );
}
