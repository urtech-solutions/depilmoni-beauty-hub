import Layout from '@/components/layout/Layout';
import { ProductCard } from '@/components/blocks/ProductCarousel';
import { products } from '@/lib/mock-data';
import { PageTransition, Animated, StaggerContainer } from '@/components/animations/Animated';

const ProductsPage = () => (
  <Layout>
    <PageTransition>
      <div className="container py-12">
        <Animated>
          <h1 className="font-display text-4xl font-bold mb-2">Nossos Produtos</h1>
          <p className="text-muted-foreground mb-10">Linha completa de produtos profissionais para depilação</p>
        </Animated>
        <StaggerContainer className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </StaggerContainer>
      </div>
    </PageTransition>
  </Layout>
);

export default ProductsPage;