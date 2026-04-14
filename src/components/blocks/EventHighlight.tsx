import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CalendarDays, MapPin } from 'lucide-react';
import { events, formatCurrency } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import eventImg from '@/assets/event-workshop.jpg';

const EventHighlight = () => {
  const featured = events.filter((e) => e.featured);

  return (
    <section className="py-16">
      <div className="container">
        <h2 className="font-display text-3xl font-bold text-center mb-2">Eventos & Cursos</h2>
        <p className="text-center text-muted-foreground mb-10">Aprenda com as melhores especialistas</p>
        <div className="grid gap-6 md:grid-cols-2">
          {featured.map((evt) => {
            const activeBatch = evt.batches.find((b) => b.active);
            return (
              <motion.div
                key={evt.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group overflow-hidden rounded-xl border border-border bg-card"
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={eventImg}
                    alt={evt.title}
                    loading="lazy"
                    width={1200}
                    height={800}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-display text-xl font-semibold">{evt.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{evt.shortDescription}</p>
                  <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><CalendarDays size={14} /> {new Date(evt.date).toLocaleDateString('pt-BR')}</span>
                    <span className="flex items-center gap-1"><MapPin size={14} /> {evt.location}</span>
                  </div>
                  {activeBatch && (
                    <div className="mt-4 flex items-center justify-between">
                      <span className="font-semibold text-foreground">
                        {activeBatch.name}: {formatCurrency(activeBatch.price)}
                      </span>
                      <Link to={`/eventos/${evt.slug}`}>
                        <Button variant="default" size="sm">Inscrever-se</Button>
                      </Link>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default EventHighlight;
