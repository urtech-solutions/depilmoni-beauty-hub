import Link from "next/link";

export const SiteFooter = () => (
  <footer className="mt-20 border-t border-border/70 bg-[rgba(47,29,21,0.96)] text-[rgba(255,248,243,0.82)]">
    <div className="container grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
      <div>
        <p className="text-[11px] uppercase tracking-[0.36em] text-[rgba(201,157,84,0.82)]">
          Depilmoni
        </p>
        <h2 className="mt-3 font-display text-3xl text-white">
          Plataforma propria para comercio, conteudo e eventos.
        </h2>
        <p className="mt-4 max-w-xl text-sm text-[rgba(255,248,243,0.68)]">
          Estrutura premium preparada para catalogo, checkout, tickets, gamificacao e
          operacao comercial no Brasil.
        </p>
      </div>

      <div>
        <h3 className="text-sm font-semibold uppercase tracking-[0.28em] text-[rgba(255,248,243,0.7)]">
          Navegacao
        </h3>
        <div className="mt-4 flex flex-col gap-3 text-sm">
          <Link href="/produtos">Produtos</Link>
          <Link href="/eventos">Eventos</Link>
          <Link href="/checkout">Checkout</Link>
          <Link href="/minha-conta">Portal do usuario</Link>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold uppercase tracking-[0.28em] text-[rgba(255,248,243,0.7)]">
          Stack
        </h3>
        <div className="mt-4 flex flex-col gap-3 text-sm">
          <span>Next.js + TypeScript</span>
          <span>Payload CMS + Medusa</span>
          <span>PostgreSQL + Redis</span>
          <span>Mercado Pago + Melhor Envio</span>
        </div>
      </div>
    </div>
  </footer>
);
