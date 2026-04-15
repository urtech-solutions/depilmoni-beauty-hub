import Link from "next/link";

export const SiteFooter = () => (
  <footer className="mt-20 border-t border-border bg-secondary/30 py-12">
    <div className="container grid gap-8 md:grid-cols-4">
      <div>
        <span className="font-display text-xl font-bold text-gradient-gold">Depilmoni</span>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Produtos premium para depilacao e cuidados com a pele, com storefront, conteudo,
          eventos e portal da cliente na mesma experiencia.
        </p>
      </div>

      <div>
        <h4 className="mb-3 font-display font-semibold">Loja</h4>
        <div className="space-y-2 text-sm text-muted-foreground">
          <Link href="/produtos">Produtos</Link>
          <Link href="/kits">Kits</Link>
          <Link href="/eventos">Eventos</Link>
        </div>
      </div>

      <div>
        <h4 className="mb-3 font-display font-semibold">Conta</h4>
        <div className="space-y-2 text-sm text-muted-foreground">
          <Link href="/minha-conta">Minha Conta</Link>
          <Link href="/carrinho">Carrinho</Link>
          <Link href="/checkout">Checkout</Link>
        </div>
      </div>

      <div>
        <h4 className="mb-3 font-display font-semibold">Atendimento</h4>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>contato@depilmoni.com.br</p>
          <p>(11) 99999-0000</p>
          <p>Seg a Sex, 9h as 18h</p>
        </div>
      </div>
    </div>

    <div className="container mt-10 border-t border-border pt-6 text-center text-xs text-muted-foreground">
      © {new Date().getFullYear()} Depilmoni. Todos os direitos reservados.
    </div>
  </footer>
);
