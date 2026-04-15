import Link from "next/link";

import { Badge, Button, Card } from "@depilmoni/ui";

type Props = {
  searchParams: Promise<{
    code?: string;
    orderId?: string;
    total?: string;
    xp?: string;
    level?: string;
  }>;
};

export default async function CheckoutSuccessPage({ searchParams }: Props) {
  const params = await searchParams;
  const code = params.code ?? "—";
  const total = params.total ? Number(params.total) : null;
  const xp = params.xp ? Number(params.xp) : 0;
  const level = params.level;

  return (
    <section className="section-spacing">
      <div className="container max-w-3xl space-y-6">
        <Badge variant="accent">Pedido confirmado</Badge>
        <h1 className="font-display text-5xl">Pedido {code} registrado com sucesso.</h1>
        <p className="text-base leading-7 text-muted-foreground">
          Você pode acompanhar o status, rastreio e atualizações em tempo real na sua central.
        </p>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="p-5">
            <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">Código</p>
            <p className="mt-2 text-2xl font-semibold text-foreground">{code}</p>
          </Card>
          <Card className="p-5">
            <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">Total pago</p>
            <p className="mt-2 text-2xl font-semibold text-foreground">
              {total !== null ? `R$ ${total.toFixed(2)}` : "—"}
            </p>
          </Card>
          <Card className="p-5">
            <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">XP ganho</p>
            <p className="mt-2 text-2xl font-semibold text-foreground">{xp}</p>
            {level ? (
              <p className="mt-1 text-xs text-[var(--color-accent-copper)]">
                Novo nível: {level}
              </p>
            ) : null}
          </Card>
        </div>

        <div className="flex flex-wrap gap-3 pt-4">
          <Button asChild variant="hero">
            <Link href={params.orderId ? `/minha-conta/pedidos/${params.orderId}` : "/minha-conta/pedidos"}>
              Ver detalhes do pedido
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/produtos">Continuar comprando</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
