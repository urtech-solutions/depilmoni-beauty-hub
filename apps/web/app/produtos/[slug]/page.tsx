import Image from "next/image";
import { notFound } from "next/navigation";

import { Badge, Card } from "@depilmoni/ui";

import { ProductPurchaseCard } from "@/components/commerce/product-purchase-card";
import { formatCurrency } from "@/lib/format";
import { storefrontData } from "@/lib/storefront";

export default async function ProductDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = storefrontData.productBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <section className="section-spacing">
      <div className="container grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-start">
        <div className="space-y-6">
          <div className="relative min-h-[420px] overflow-hidden rounded-[30px]">
            <Image src={product.media[0]} alt={product.name} fill className="object-cover" />
          </div>

          <Card className="space-y-5">
            <div className="flex flex-wrap gap-2">
              <Badge variant="copper">{product.category}</Badge>
              {product.tags.map((tag) => (
                <Badge key={tag}>{tag}</Badge>
              ))}
            </div>
            <div>
              <h1 className="font-display text-5xl">{product.name}</h1>
              <p className="mt-4 text-base leading-8 text-muted-foreground">{product.description}</p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {product.variants.map((variant) => (
                <Card key={variant.id} className="p-4">
                  <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
                    {variant.name}
                  </p>
                  <p className="mt-2 text-2xl font-semibold">{formatCurrency(variant.basePrice)}</p>
                  <p className="mt-2 text-xs text-muted-foreground">SKU {variant.sku}</p>
                </Card>
              ))}
            </div>
          </Card>
        </div>

        <ProductPurchaseCard product={product} />
      </div>
    </section>
  );
}
