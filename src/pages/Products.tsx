import Layout from '@/components/layout/Layout';
import { ProductCard } from '@/components/blocks/ProductCarousel';
import { products } from '@/lib/mock-data';

const ProductsPage = () => (
  <Layout>
    <div className="container py-12">
      <h1 className="font-display text-4xl font-bold mb-2">Nossos Produtos</h1>
      <p className="text-muted-foreground mb-10">Linha completa de produtos profissionais para depilação</p>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  </Layout>
);

export default ProductsPage;
