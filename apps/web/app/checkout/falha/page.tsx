import Link from "next/link";

import { Badge, Button, Card } from "@depilmoni/ui";

type Props = {
  searchParams: Promise<{
    reason?: string;
  }>;
};

export default async function CheckoutFailurePage({ searchParams }: Props) {
  const params = await searchParams;
  const reason = params.reason ?? "Não foi possível concluir o pagamento";

  return (
    <section className="section-spacing">
      <div className="container max-w-3xl space-y-6">
        <Badge variant="accent">Pagamento não concluído</Badge>
        <h1 className="font-display text-5xl">Precisamos revisar seu pedido.</h1>

        <Card className="p-6">
          <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">Motivo</p>
          <p className="mt-3 text-base leading-7 text-foreground">{reason}</p>
        </Card>

        <p className="text-sm text-muted-foreground">
          Seu carrinho continua preservado. Você pode tentar novamente ou usar outro meio de pagamento.
        </p>

        <div className="flex flex-wrap gap-3 pt-2">
          <Button asChild variant="hero">
            <Link href="/checkout">Tentar novamente</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/minha-conta">Ir para minha conta</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
