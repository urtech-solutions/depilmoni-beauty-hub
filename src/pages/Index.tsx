import Layout from '@/components/layout/Layout';
import HeroBanner from '@/components/blocks/HeroBanner';
import BenefitBar from '@/components/blocks/BenefitBar';
import ProductCarousel from '@/components/blocks/ProductCarousel';
import CategoryGrid from '@/components/blocks/CategoryGrid';
import EventHighlight from '@/components/blocks/EventHighlight';
import TestimonialSection from '@/components/blocks/TestimonialSection';
import CTASection from '@/components/blocks/CTASection';
import { PageTransition } from '@/components/animations/Animated';

const Index = () => (
  <Layout>
    <PageTransition>
      <HeroBanner />
      <BenefitBar />
      <ProductCarousel />
      <CategoryGrid />
      <EventHighlight />
      <TestimonialSection />
      <CTASection />
    </PageTransition>
  </Layout>
);

export default Index;