import Image from "next/image";
import Link from "next/link";
import { CalendarDays, MapPin } from "lucide-react";

import type { EventHighlightBlock as EventHighlightBlockProps } from "@depilmoni/core";
import { Button, Card } from "@depilmoni/ui";

import { formatCurrency, formatDate } from "@/lib/format";
import { storefrontData } from "@/lib/storefront";

export const EventHighlight = ({ block }: { block: EventHighlightBlockProps }) => {
  const events = storefrontData
    .events()
    .filter((event) => block.eventSlugs.includes(event.slug));

  return (
    <section className="section-spacing">
      <div className="container space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-[var(--color-accent-copper)]">
              Educacao e comunidade
            </p>
            <h2 className="mt-3 font-display text-4xl">{block.title}</h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
              {block.subtitle}
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/eventos">Explorar agenda</Link>
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {events.map((event) => {
            const activeBatch = event.batches.find((batch) => batch.status === "active") ?? event.batches[0];
            const remaining = activeBatch.quantity - activeBatch.sold;

            return (
              <Card key={event.id} className="overflow-hidden p-0">
                <div className="grid gap-0 md:grid-cols-[0.9fr_1.1fr]">
                  <div className="relative min-h-[260px]">
                    <Image src={event.coverImage} alt={event.title} fill className="object-cover" />
                  </div>
                  <div className="space-y-5 p-6">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-accent-copper)]">
                        Evento em destaque
                      </p>
                      <h3 className="mt-2 font-display text-3xl">{event.title}</h3>
                      <p className="mt-3 text-sm leading-6 text-muted-foreground">{event.summary}</p>
                    </div>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p className="flex items-center gap-2">
                        <CalendarDays size={16} />
                        {formatDate(event.startsAt)}
                      </p>
                      <p className="flex items-center gap-2">
                        <MapPin size={16} />
                        {event.location}
                      </p>
                    </div>
                    <div className="rounded-3xl bg-[rgba(201,157,84,0.1)] p-4">
                      <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
                        lote ativo
                      </p>
                      <div className="mt-2 flex items-end justify-between gap-4">
                        <div>
                          <p className="font-semibold text-foreground">{activeBatch.name}</p>
                          <p className="text-sm text-muted-foreground">{remaining} vagas restantes</p>
                        </div>
                        <p className="text-2xl font-semibold text-foreground">
                          {formatCurrency(activeBatch.price)}
                        </p>
                      </div>
                    </div>
                    <Button asChild variant="hero">
                      <Link href={`/eventos/${event.slug}`}>Comprar ingresso</Link>
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
