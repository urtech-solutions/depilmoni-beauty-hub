import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const categories = [
  { name: 'Ceras', slug: '/produtos?cat=ceras', emoji: '🍫' },
  { name: 'Tônicos', slug: '/produtos?cat=tonicos', emoji: '💧' },
  { name: 'Preparação', slug: '/produtos?cat=preparacao', emoji: '✨' },
  { name: 'Kits', slug: '/kits', emoji: '🎁' },
];

const CategoryGrid = () => (
  <section className="py-16 bg-secondary/30">
    <div className="container">
      <h2 className="font-display text-3xl font-bold text-center mb-8">Categorias</h2>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.name}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
          >
            <Link
              to={cat.slug}
              className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-6 transition-all hover:border-copper/40 hover:shadow-md"
            >
              <span className="text-4xl">{cat.emoji}</span>
              <span className="font-display font-semibold text-lg">{cat.name}</span>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default CategoryGrid;
