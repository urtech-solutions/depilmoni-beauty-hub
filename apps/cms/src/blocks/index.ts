import type { Block } from "payload";

const linkFields = [
  {
    name: "label",
    type: "text",
    required: true
  },
  {
    name: "href",
    type: "text",
    required: true
  }
] as const;

export const HeroBannerBlock: Block = {
  slug: "HeroBanner",
  interfaceName: "HeroBannerBlock",
  fields: [
    { name: "eyebrow", type: "text", required: true },
    { name: "title", type: "text", required: true },
    { name: "subtitle", type: "textarea", required: true },
    {
      name: "cta",
      type: "group",
      fields: [...linkFields]
    },
    {
      name: "secondaryCta",
      type: "group",
      fields: [...linkFields]
    },
    { name: "image", type: "upload", relationTo: "media", required: true },
    {
      name: "ambienceNotes",
      type: "array",
      fields: [{ name: "value", type: "text", required: true }]
    }
  ]
};

export const BenefitBarBlock: Block = {
  slug: "BenefitBar",
  interfaceName: "BenefitBarBlock",
  fields: [
    {
      name: "items",
      type: "array",
      fields: [
        { name: "title", type: "text", required: true },
        { name: "description", type: "textarea", required: true }
      ]
    }
  ]
};

export const ProductCarouselBlock: Block = {
  slug: "ProductCarousel",
  interfaceName: "ProductCarouselBlock",
  fields: [
    { name: "title", type: "text", required: true },
    { name: "subtitle", type: "textarea", required: true },
    {
      name: "collection",
      type: "select",
      defaultValue: "featured",
      options: [
        { label: "Destaques", value: "featured" },
        { label: "Kits", value: "kits" },
        { label: "Todos", value: "all" }
      ]
    }
  ]
};

export const CategoryGridBlock: Block = {
  slug: "CategoryGrid",
  interfaceName: "CategoryGridBlock",
  fields: [
    { name: "title", type: "text", required: true },
    { name: "subtitle", type: "textarea", required: true },
    {
      name: "items",
      type: "array",
      fields: [
        { name: "title", type: "text", required: true },
        { name: "description", type: "textarea", required: true },
        { name: "href", type: "text", required: true },
        { name: "image", type: "upload", relationTo: "media", required: true }
      ]
    }
  ]
};

export const EventHighlightBlock: Block = {
  slug: "EventHighlight",
  interfaceName: "EventHighlightBlock",
  fields: [
    { name: "title", type: "text", required: true },
    { name: "subtitle", type: "textarea", required: true },
    {
      name: "eventSlugs",
      type: "array",
      fields: [{ name: "slug", type: "text", required: true }]
    }
  ]
};

export const TestimonialSectionBlock: Block = {
  slug: "TestimonialSection",
  interfaceName: "TestimonialSectionBlock",
  fields: [
    { name: "title", type: "text", required: true },
    { name: "subtitle", type: "textarea", required: true },
    {
      name: "testimonials",
      type: "array",
      fields: [
        { name: "name", type: "text", required: true },
        { name: "role", type: "text", required: true },
        { name: "quote", type: "textarea", required: true }
      ]
    }
  ]
};

export const RichContentSectionBlock: Block = {
  slug: "RichContentSection",
  interfaceName: "RichContentSectionBlock",
  fields: [
    { name: "title", type: "text", required: true },
    {
      name: "content",
      type: "array",
      fields: [{ name: "paragraph", type: "textarea", required: true }]
    },
    {
      name: "metrics",
      type: "array",
      fields: [
        { name: "label", type: "text", required: true },
        { name: "value", type: "text", required: true }
      ]
    }
  ]
};

export const FAQSectionBlock: Block = {
  slug: "FAQSection",
  interfaceName: "FAQSectionBlock",
  fields: [
    { name: "title", type: "text", required: true },
    {
      name: "items",
      type: "array",
      fields: [
        { name: "question", type: "text", required: true },
        { name: "answer", type: "textarea", required: true }
      ]
    }
  ]
};

export const CTASectionBlock: Block = {
  slug: "CTASection",
  interfaceName: "CTASectionBlock",
  fields: [
    { name: "title", type: "text", required: true },
    { name: "subtitle", type: "textarea", required: true },
    {
      name: "cta",
      type: "group",
      fields: [...linkFields]
    },
    {
      name: "secondaryCta",
      type: "group",
      fields: [...linkFields]
    }
  ]
};
