"use client";

import { useMemo, useState } from "react";
import { CalendarDays, MapPin, Ticket } from "lucide-react";
import { toast } from "sonner";

import type { Event } from "@depilmoni/core";
import { Badge, Button, Card } from "@depilmoni/ui";

import { formatCurrency, formatDateTime } from "@/lib/format";
import { useCartStore } from "@/store/cart-store";

export const EventTicketPurchaseCard = ({ event }: { event: Event }) => {
  const [selectedBatchId, setSelectedBatchId] = useState(
    event.batches.find((batch) => batch.status === "active")?.id ?? event.batches[0]?.id
  );
  const addItem = useCartStore((state) => state.addItem);
  const selectedBatch = useMemo(
    () => event.batches.find((batch) => batch.id === selectedBatchId) ?? event.batches[0],
    [event.batches, selectedBatchId]
  );

  if (!selectedBatch) {
    return null;
  }

  return (
    <Card className="sticky top-24 space-y-5">
      <div className="space-y-2">
        <Badge variant="accent">Tickets com QR Code</Badge>
        <h2 className="font-display text-3xl">{event.title}</h2>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p className="flex items-center gap-2">
            <CalendarDays size={16} />
            {formatDateTime(event.startsAt)}
          </p>
          <p className="flex items-center gap-2">
            <MapPin size={16} />
            {event.location}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {event.batches.map((batch) => {
          const remaining = batch.quantity - batch.sold;
          const disabled = batch.status !== "active";

          return (
            <button
              key={batch.id}
              onClick={() => setSelectedBatchId(batch.id)}
              disabled={disabled}
              className={`w-full rounded-2xl border p-4 text-left transition-colors ${
                batch.id === selectedBatch.id
                  ? "border-[var(--color-accent-copper)] bg-[rgba(167,114,74,0.08)]"
                  : "border-border/70 bg-background/70"
              } ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium text-foreground">{batch.name}</p>
                  <p className="text-xs uppercase tracking-[0.26em] text-muted-foreground">
                    {disabled ? "esgotado" : `${remaining} vagas restantes`}
                  </p>
                </div>
                <p className="font-semibold text-foreground">{formatCurrency(batch.price)}</p>
              </div>
            </button>
          );
        })}
      </div>

      <Button
        variant="hero"
        size="lg"
        className="w-full"
        disabled={selectedBatch.status !== "active"}
        onClick={() => {
          addItem({
            id: `event-ticket:${event.id}:${selectedBatch.id}`,
            type: "event-ticket",
            title: `${event.title} • ${selectedBatch.name}`,
            slug: event.slug,
            image: event.coverImage,
            quantity: 1,
            unitPrice: selectedBatch.price,
            meta: {
              eventId: event.id,
              batchId: selectedBatch.id,
              batchName: selectedBatch.name
            }
          });
          toast.success("Ingresso adicionado ao carrinho");
        }}
      >
        <Ticket size={16} />
        Comprar ingresso
      </Button>
    </Card>
  );
};
