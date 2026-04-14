import type { CollectionConfig } from "payload";

import { canManageContent, publicRead } from "../access";
import {
  BenefitBarBlock,
  CategoryGridBlock,
  CTASectionBlock,
  EventHighlightBlock,
  FAQSectionBlock,
  HeroBannerBlock,
  ProductCarouselBlock,
  RichContentSectionBlock,
  TestimonialSectionBlock
} from "../blocks";

export const LandingPages: CollectionConfig = {
  slug: "landing-pages",
  admin: {
    useAsTitle: "title"
  },
  access: {
    read: publicRead,
    create: canManageContent,
    update: canManageContent,
    delete: canManageContent
  },
  fields: [
    { name: "slug", type: "text", required: true, unique: true },
    { name: "title", type: "text", required: true },
    { name: "seoTitle", type: "text" },
    { name: "seoDescription", type: "textarea" },
    {
      name: "blocks",
      type: "blocks",
      blocks: [
        HeroBannerBlock,
        BenefitBarBlock,
        ProductCarouselBlock,
        CategoryGridBlock,
        EventHighlightBlock,
        TestimonialSectionBlock,
        RichContentSectionBlock,
        FAQSectionBlock,
        CTASectionBlock
      ]
    }
  ]
};
