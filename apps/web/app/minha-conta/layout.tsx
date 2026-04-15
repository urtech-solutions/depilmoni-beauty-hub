import { AccountNav } from "@/components/account/account-nav";
import { getCurrentUser } from "@/lib/account-server";

export default async function MinhaContaLayout({
  children
}: {
  children: any;
}) {
  const user = await getCurrentUser();

  return (
    <section className="section-spacing">
      <div className="container mx-auto max-w-7xl space-y-6 py-4">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.32em] text-muted-foreground">
            Central do cliente
          </p>
          <h1 className="font-display text-3xl font-semibold text-foreground md:text-4xl">
            Sua jornada com a Depilmoni
          </h1>
          <p className="max-w-3xl text-sm text-muted-foreground md:text-base">
            Aqui voce acompanha pedidos, organiza seus enderecos, visualiza sua experiencia e
            gerencia oportunidades exclusivas com a equipe da marca.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[290px_minmax(0,1fr)]">
          <AccountNav user={user} />
          <div className="min-w-0">{children}</div>
        </div>
      </div>
    </section>
  );
}
