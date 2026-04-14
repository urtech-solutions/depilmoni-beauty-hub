import Layout from '@/components/layout/Layout';
import HeroBanner from '@/components/blocks/HeroBanner';
import BenefitBar from '@/components/blocks/BenefitBar';
import ProductCarousel from '@/components/blocks/ProductCarousel';
import CategoryGrid from '@/components/blocks/CategoryGrid';
import EventHighlight from '@/components/blocks/EventHighlight';
import TestimonialSection from '@/components/blocks/TestimonialSection';
import CTASection from '@/components/blocks/CTASection';

const Index = () => (
  <Layout>
    <HeroBanner />
    <BenefitBar />
    <ProductCarousel />
    <CategoryGrid />
    <EventHighlight />
    <TestimonialSection />
    <CTASection />
  </Layout>
);

export default Index;
