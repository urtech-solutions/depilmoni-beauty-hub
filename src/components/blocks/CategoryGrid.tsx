import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Animated, StaggerContainer, StaggerItem } from '@/components/animations/Animated';

const categories = [
  { name: 'Ceras', slug: '/produtos?cat=ceras', emoji: '🍫' },
  { name: 'Tônicos', slug: '/produtos?cat=tonicos', emoji: '💧' },
  { name: 'Preparação', slug: '/produtos?cat=preparacao', emoji: '✨' },
  { name: 'Kits', slug: '/kits', emoji: '🎁' },
];

const CategoryGrid = () => (
  <section className="py-16 bg-secondary/30">
    <div className="container">
      <Animated>
        <h2 className="font-display text-3xl font-bold text-center mb-8">Categorias</h2>
      </Animated>
      <StaggerContainer className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {categories.map((cat) => (
          <StaggerItem key={cat.name}>
            <Link to={cat.slug}>
              <motion.div
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-6 transition-shadow hover:shadow-md hover:border-copper/40"
              >
                <span className="text-4xl">{cat.emoji}</span>
                <span className="font-display font-semibold text-lg">{cat.name}</span>
              </motion.div>
            </Link>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </div>
  </section>
);

export default CategoryGrid;