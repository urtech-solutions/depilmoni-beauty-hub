import type { LandingPageBlock } from "@depilmoni/core";

import { BenefitBar } from "@/components/blocks/benefit-bar";
import { CategoryGrid } from "@/components/blocks/category-grid";
import { CTASection } from "@/components/blocks/cta-section";
import { EventHighlight } from "@/components/blocks/event-highlight";
import { FAQSection } from "@/components/blocks/faq-section";
import { HeroBanner } from "@/components/blocks/hero-banner";
import { ProductCarousel } from "@/components/blocks/product-carousel";
import { RichContentSection } from "@/components/blocks/rich-content-section";
import { TestimonialSection } from "@/components/blocks/testimonial-section";

export const HomeBlockRenderer = ({ block }: { block: LandingPageBlock }) => {
  switch (block.blockType) {
    case "HeroBanner":
      return <HeroBanner block={block} />;
    case "BenefitBar":
      return <BenefitBar block={block} />;
    case "ProductCarousel":
      return <ProductCarousel block={block} />;
    case "CategoryGrid":
      return <CategoryGrid block={block} />;
    case "EventHighlight":
      return <EventHighlight block={block} />;
    case "TestimonialSection":
      return <TestimonialSection block={block} />;
    case "RichContentSection":
      return <RichContentSection block={block} />;
    case "FAQSection":
      return <FAQSection block={block} />;
    case "CTASection":
      return <CTASection block={block} />;
    default:
      return null;
  }
};
