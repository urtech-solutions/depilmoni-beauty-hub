import type { MetadataRoute } from "next";

import { storefrontData } from "@/lib/storefront";
import { siteConfig } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    "/",
    "/produtos",
    "/kits",
    "/eventos",
    "/blog",
    "/minha-conta",
    "/carrinho",
    "/checkout"
  ].map((path) => ({
    url: `${siteConfig.url}${path}`,
    changeFrequency: "weekly" as const,
    priority: path === "/" ? 1 : 0.7
  }));

  const products: MetadataRoute.Sitemap = storefrontData.products().map((product) => ({
    url: `${siteConfig.url}/produtos/${product.slug}`,
    changeFrequency: "weekly",
    priority: 0.7
  }));
  const events: MetadataRoute.Sitemap = storefrontData.events().map((event) => ({
    url: `${siteConfig.url}/eventos/${event.slug}`,
    changeFrequency: "weekly",
    priority: 0.75
  }));
  const blogPosts: MetadataRoute.Sitemap = storefrontData.blogPosts().map((post) => ({
    url: `${siteConfig.url}/blog#${post.slug}`,
    changeFrequency: "monthly",
    priority: 0.55
  }));

  return [...staticRoutes, ...products, ...events, ...blogPosts];
}
