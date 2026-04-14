import { useParams } from 'react-router-dom';
import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { events, formatCurrency } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { CalendarDays, MapPin, Clock, Users, Ticket } from 'lucide-react';
import eventImg from '@/assets/event-workshop.jpg';

const EventDetail = () => {
  const { slug } = useParams();
  const event = events.find((e) => e.slug === slug);
  const [selectedBatch, setSelectedBatch] = useState<string | null>(null);

  if (!event) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <h1 className="font-display text-2xl">Evento não encontrado</h1>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-12">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="aspect-video overflow-hidden rounded-xl">
              <img src={eventImg} alt={event.title} width={1200} height={800} className="h-full w-full object-cover" />
            </div>
            <h1 className="mt-6 font-display text-3xl font-bold md:text-4xl">{event.title}</h1>
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><CalendarDays size={16} />{new Date(event.date).toLocaleDateString('pt-BR')}</span>
              <span className="flex items-center gap-1"><Clock size={16} />{event.time}</span>
              <span className="flex items-center gap-1"><MapPin size={16} />{event.location}</span>
              <span className="flex items-center gap-1"><Users size={16} />{event.instructor}</span>
            </div>
            <p className="mt-6 text-muted-foreground leading-relaxed">{event.description}</p>
          </div>

          <div>
            <div className="sticky top-24 rounded-xl border border-border bg-card p-6">
              <h3 className="font-display text-lg font-semibold flex items-center gap-2">
                <Ticket size={18} className="text-copper" /> Ingressos
              </h3>
              <div className="mt-4 space-y-3">
                {event.batches.map((batch) => {
                  const remaining = batch.quantity - batch.sold;
                  const soldOut = remaining <= 0 || !batch.active;
                  return (
                    <button
                      key={batch.id}
                      disabled={soldOut}
                      onClick={() => setSelectedBatch(batch.id)}
                      className={`w-full rounded-lg border p-4 text-left transition-colors ${
                        selectedBatch === batch.id
                          ? 'border-copper bg-copper/10'
                          : soldOut
                          ? 'border-border opacity-50 cursor-not-allowed'
                          : 'border-border hover:border-copper/40'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-sm">{batch.name}</span>
                        <span className="font-semibold">{formatCurrency(batch.price)}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {soldOut ? 'Esgotado' : `${remaining} vagas restantes`}
                      </p>
                    </button>
                  );
                })}
              </div>
              <Button variant="hero" size="lg" className="w-full mt-6" disabled={!selectedBatch}>
                Comprar Ingresso
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EventDetail;
