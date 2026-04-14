import { Badge } from "@depilmoni/ui";

import { ProductCard } from "@/components/commerce/product-card";
import { storefrontData } from "@/lib/storefront";

export default function KitsPage() {
  const kits = storefrontData.kits();

  return (
    <section className="section-spacing">
      <div className="container space-y-8">
        <div className="max-w-3xl">
          <Badge variant="accent">Kits Signature</Badge>
          <h1 className="mt-4 font-display text-5xl">Curadorias prontas para elevar ticket medio.</h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            Selecao pensada para presente, reposicao profissional e campanhas especiais da marca.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {kits.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
