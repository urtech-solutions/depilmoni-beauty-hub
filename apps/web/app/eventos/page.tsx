import Image from "next/image";
import Link from "next/link";
import { CalendarDays, MapPin } from "lucide-react";

import { Badge, Button, Card } from "@depilmoni/ui";

import { formatCurrency, formatDate } from "@/lib/format";
import { storefrontData } from "@/lib/storefront";

export default function EventsPage() {
  const events = storefrontData.events();

  return (
    <section className="section-spacing">
      <div className="container space-y-8">
        <div className="max-w-3xl">
          <Badge variant="accent">Agenda Depilmoni</Badge>
          <h1 className="mt-4 font-display text-5xl">Cursos e eventos com lote, ticket e check-in.</h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            O fluxo mockado ja cobre pagina publica, quantidade por lote, QR Code e status de presenca.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {events.map((event) => {
            const activeBatch = event.batches.find((batch) => batch.status === "active") ?? event.batches[0];
            return (
              <Card key={event.id} className="overflow-hidden p-0">
                <div className="relative min-h-[280px]">
                  <Image src={event.coverImage} alt={event.title} fill className="object-cover" />
                </div>
                <div className="space-y-5 p-6">
                  <div>
                    <h2 className="font-display text-4xl">{event.title}</h2>
                    <p className="mt-3 text-base leading-7 text-muted-foreground">{event.summary}</p>
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
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
                        lote ativo
                      </p>
                      <p className="mt-1 font-medium">{activeBatch.name}</p>
                    </div>
                    <p className="text-2xl font-semibold">{formatCurrency(activeBatch.price)}</p>
                  </div>
                  <Button asChild variant="hero">
                    <Link href={`/eventos/${event.slug}`}>Comprar ticket</Link>
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
