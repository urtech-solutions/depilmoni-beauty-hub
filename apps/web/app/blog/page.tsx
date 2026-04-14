import Image from "next/image";

import { Badge, Card } from "@depilmoni/ui";

import { formatDate } from "@/lib/format";
import { storefrontData } from "@/lib/storefront";

export default function BlogPage() {
  const posts = storefrontData.blogPosts();

  return (
    <section className="section-spacing">
      <div className="container space-y-8">
        <div className="max-w-3xl">
          <Badge variant="accent">Conteudo</Badge>
          <h1 className="mt-4 font-display text-5xl">Blog e narrativas de marca editaveis no CMS.</h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            O admin pode evoluir banners, landing pages, posts e secoes sem tocar no storefront.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {posts.map((post) => (
            <Card key={post.id} className="overflow-hidden p-0" id={post.slug}>
              <div className="relative min-h-[260px]">
                <Image src={post.coverImage} alt={post.title} fill className="object-cover" />
              </div>
              <div className="space-y-4 p-6">
                <p className="text-xs uppercase tracking-[0.28em] text-[var(--color-accent-copper)]">
                  {formatDate(post.publishedAt)}
                </p>
                <h2 className="font-display text-4xl">{post.title}</h2>
                <p className="text-base leading-7 text-muted-foreground">{post.excerpt}</p>
                <div className="space-y-3 text-sm leading-7 text-muted-foreground">
                  {post.content.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
