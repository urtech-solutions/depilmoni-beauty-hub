"use client";

import Image from "next/image";
import Link from "next/link";
import { CalendarDays, MapPin } from "lucide-react";
import { motion } from "framer-motion";

import type { EventHighlightBlock as EventHighlightBlockProps } from "@depilmoni/core";
import { Button, Card } from "@depilmoni/ui";

import { Animated, StaggerContainer, StaggerItem } from "@/components/animations/animated";
import { formatCurrency, formatDate } from "@/lib/format";
import { storefrontData } from "@/lib/storefront";

export const EventHighlight = ({ block }: { block: EventHighlightBlockProps }) => {
  const events = storefrontData
    .events()
    .filter((event) => block.eventSlugs.includes(event.slug));

  return (
    <section className="py-16">
      <div className="container">
        <Animated className="mb-10">
          <h2 className="mb-2 text-center font-display text-3xl font-bold">{block.title}</h2>
          <p className="mx-auto max-w-2xl text-center text-muted-foreground">{block.subtitle}</p>
        </Animated>

        <StaggerContainer className="grid gap-6 md:grid-cols-2">
          {events.map((event) => {
            const activeBatch = event.batches.find((batch) => batch.status === "active") ?? event.batches[0];
            const remaining = activeBatch.quantity - activeBatch.sold;

            return (
              <StaggerItem key={event.id}>
                <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.3 }}>
                  <Card className="overflow-hidden p-0 transition-shadow hover:shadow-md">
                    <div className="relative aspect-video overflow-hidden">
                      <Image
                        src={event.coverImage}
                        alt={event.title}
                        fill
                        className="object-cover transition-transform duration-500 hover:scale-105"
                      />
                    </div>
                    <div className="space-y-4 p-6">
                      <h3 className="font-display text-xl font-semibold">{event.title}</h3>
                      <p className="text-sm text-muted-foreground">{event.summary}</p>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <CalendarDays size={14} /> {formatDate(event.startsAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin size={14} /> {event.location}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="font-semibold text-foreground">
                            {activeBatch.name}: {formatCurrency(activeBatch.price)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {remaining} vagas restantes
                          </p>
                        </div>
                        <Button asChild size="sm">
                          <Link href={`/eventos/${event.slug}`}>Inscrever-se</Link>
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
};
