import Link from "next/link";

import { Button, Card } from "@depilmoni/ui";

export default function NotFound() {
  return (
    <section className="section-spacing">
      <div className="container">
        <Card className="mx-auto max-w-2xl p-10 text-center">
          <p className="text-xs uppercase tracking-[0.32em] text-[var(--color-accent-copper)]">
            404
          </p>
          <h1 className="mt-4 font-display text-5xl">Esta pagina nao foi encontrada.</h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            Volte para a homepage ou continue explorando o ecossistema Depilmoni.
          </p>
          <Button asChild variant="hero" size="lg" className="mt-6">
            <Link href="/">Voltar ao inicio</Link>
          </Button>
        </Card>
      </div>
    </section>
  );
}
