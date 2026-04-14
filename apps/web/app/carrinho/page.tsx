import { Badge } from "@depilmoni/ui";

import { CartExperience } from "@/components/commerce/cart-experience";

export default function CartPage() {
  return (
    <section className="section-spacing">
      <div className="container space-y-8">
        <div className="max-w-3xl">
          <Badge variant="accent">Carrinho</Badge>
          <h1 className="mt-4 font-display text-5xl">Revise produtos, tickets e quantidades.</h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            O subtotal exibido aqui e apenas referencial. O motor de checkout recalcula perfil, fidelidade, cupom, promocao e frete.
          </p>
        </div>

        <CartExperience />
      </div>
    </section>
  );
}
