import Layout from '@/components/layout/Layout';
import { events, formatCurrency } from '@/lib/mock-data';
import { Link } from 'react-router-dom';
import { CalendarDays, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageTransition, Animated, StaggerContainer, StaggerItem } from '@/components/animations/Animated';
import { motion } from 'framer-motion';
import eventImg from '@/assets/event-workshop.jpg';

const EventsPage = () => (
  <Layout>
    <PageTransition>
      <div className="container py-12">
        <Animated>
          <h1 className="font-display text-4xl font-bold mb-2">Eventos & Cursos</h1>
          <p className="text-muted-foreground mb-10">Workshops e cursos com as especialistas Depilmoni</p>
        </Animated>
        <StaggerContainer className="grid gap-6 md:grid-cols-2">
          {events.map((evt) => {
            const activeBatch = evt.batches.find((b) => b.active);
            return (
              <StaggerItem key={evt.id}>
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-md"
                >
                  <div className="aspect-video overflow-hidden">
                    <motion.img
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.5 }}
                      src={eventImg}
                      alt={evt.title}
                      loading="lazy"
                      width={1200}
                      height={800}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h2 className="font-display text-xl font-semibold">{evt.title}</h2>
                    <p className="mt-2 text-sm text-muted-foreground">{evt.shortDescription}</p>
                    <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><CalendarDays size={14} />{new Date(evt.date).toLocaleDateString('pt-BR')}</span>
                      <span className="flex items-center gap-1"><MapPin size={14} />{evt.location}</span>
                    </div>
                    {activeBatch && (
                      <div className="mt-4 flex items-center justify-between">
                        <span className="font-semibold">{activeBatch.name}: {formatCurrency(activeBatch.price)}</span>
                        <Link to={`/eventos/${evt.slug}`}>
                          <Button size="sm">Inscrever-se</Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </motion.div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </PageTransition>
  </Layout>
);

export default EventsPage;