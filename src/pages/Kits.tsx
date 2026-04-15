import Layout from '@/components/layout/Layout';
import { ProductCard } from '@/components/blocks/ProductCarousel';
import { products } from '@/lib/mock-data';
import { PageTransition, Animated, StaggerContainer } from '@/components/animations/Animated';

const KitsPage = () => {
  const kits = products.filter((p) => p.category === 'Kits');

  return (
    <Layout>
      <PageTransition>
        <div className="container py-12">
          <Animated>
            <h1 className="font-display text-4xl font-bold mb-2">Kits</h1>
            <p className="text-muted-foreground mb-10">Kits completos com tudo que você precisa</p>
          </Animated>
          <StaggerContainer className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
            {kits.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </StaggerContainer>
        </div>
      </PageTransition>
    </Layout>
  );
};

export default KitsPage;