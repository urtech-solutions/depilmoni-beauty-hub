import Image from "next/image";
import { notFound } from "next/navigation";
import { CalendarDays, MapPin, Users } from "lucide-react";

import { Badge, Card } from "@depilmoni/ui";

import { EventTicketPurchaseCard } from "@/components/events/event-ticket-purchase-card";
import { formatDateTime } from "@/lib/format";
import { storefrontData } from "@/lib/storefront";

export default async function EventDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = storefrontData.eventBySlug(slug);

  if (!event) {
    notFound();
  }

  return (
    <section className="section-spacing">
      <div className="container grid gap-8 lg:grid-cols-[1fr_0.88fr] lg:items-start">
        <div className="space-y-6">
          <div className="relative min-h-[420px] overflow-hidden rounded-[30px]">
            <Image src={event.coverImage} alt={event.title} fill className="object-cover" />
          </div>

          <Card className="space-y-5">
            <Badge variant="accent">Evento oficial</Badge>
            <h1 className="font-display text-5xl">{event.title}</h1>
            <p className="text-base leading-8 text-muted-foreground">{event.description}</p>
            <div className="grid gap-3 text-sm text-muted-foreground md:grid-cols-3">
              <p className="flex items-center gap-2">
                <CalendarDays size={16} />
                {formatDateTime(event.startsAt)}
              </p>
              <p className="flex items-center gap-2">
                <MapPin size={16} />
                {event.location}
              </p>
              <p className="flex items-center gap-2">
                <Users size={16} />
                {event.instructor}
              </p>
            </div>
          </Card>
        </div>

        <EventTicketPurchaseCard event={event} />
      </div>
    </section>
  );
}
