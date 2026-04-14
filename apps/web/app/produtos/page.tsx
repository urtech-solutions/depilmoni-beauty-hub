import { Badge } from "@depilmoni/ui";

import { ProductCard } from "@/components/commerce/product-card";
import { storefrontData } from "@/lib/storefront";

export default function ProductsPage() {
  const products = storefrontData.products();

  return (
    <section className="section-spacing">
      <div className="container space-y-8">
        <div className="max-w-3xl">
          <Badge variant="accent">Catalogo Depilmoni</Badge>
          <h1 className="mt-4 font-display text-5xl">Produtos para rotina, revenda e cabine.</h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            Base com precificacao por perfil, estoque mockado, promocao relampago e integracao preparada para Medusa.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
