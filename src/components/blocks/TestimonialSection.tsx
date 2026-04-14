import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Ana Clara',
    role: 'Profissional',
    text: 'A cera de chocolate da Depilmoni é simplesmente incrível. Minhas clientes amam o resultado e a pele fica macia por semanas.',
  },
  {
    name: 'Juliana Santos',
    role: 'Cliente',
    text: 'Comecei a usar o kit completo em casa e a diferença é absurda. Qualidade profissional mesmo. Super recomendo!',
  },
  {
    name: 'Marcela Oliveira',
    role: 'Distribuidora',
    text: 'Trabalhar com a Depilmoni mudou meu negócio. Produtos de altíssima qualidade e suporte incrível para distribuidores.',
  },
];

const TestimonialSection = () => (
  <section className="py-16 bg-secondary/30">
    <div className="container">
      <h2 className="font-display text-3xl font-bold text-center mb-10">O que dizem sobre nós</h2>
      <div className="grid gap-6 md:grid-cols-3">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="rounded-xl border border-border bg-card p-6"
          >
            <div className="flex gap-1 mb-3">
              {[...Array(5)].map((_, j) => (
                <Star key={j} size={16} className="fill-gold text-gold" />
              ))}
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground italic">"{t.text}"</p>
            <div className="mt-4 pt-4 border-t border-border">
              <p className="font-semibold text-sm">{t.name}</p>
              <p className="text-xs text-copper">{t.role}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default TestimonialSection;
