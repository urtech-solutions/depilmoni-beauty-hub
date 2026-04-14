import { Badge } from "@depilmoni/ui";

import { CheckoutExperience } from "@/components/commerce/checkout-experience";

export default function CheckoutPage() {
  return (
    <section className="section-spacing">
      <div className="container space-y-8">
        <div className="max-w-3xl">
          <Badge variant="accent">Checkout</Badge>
          <h1 className="mt-4 font-display text-5xl">Frete, cupom, pagamento e XP no mesmo fluxo.</h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            O checkout mockado foi desenhado para virar integracao real com Mercado Pago, Melhor Envio e Medusa sem acoplamento forte.
          </p>
        </div>

        <CheckoutExperience />
      </div>
    </section>
  );
}
