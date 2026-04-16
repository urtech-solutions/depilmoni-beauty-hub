import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Animated } from '@/components/animations/Animated';

interface CTASectionProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
}

const CTASection = ({
  title = 'Pronta para começar?',
  subtitle = 'Descubra a linha completa Depilmoni e transforme sua rotina de depilação.',
  ctaText = 'Ver Produtos',
  ctaLink = '/produtos',
}: CTASectionProps) => (
  <section className="py-20">
    <div className="container">
      <Animated>
        <motion.div
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.3 }}
          className="mx-auto max-w-2xl rounded-2xl bg-chocolate p-10 text-center md:p-14"
        >
          <h2 className="font-display text-3xl font-bold text-cream md:text-4xl">{title}</h2>
          <p className="mt-3 text-cream/70">{subtitle}</p>
          <Link to={ctaLink}>
            <Button variant="hero" size="lg" className="mt-8">
              {ctaText}
            </Button>
          </Link>
        </motion.div>
      </Animated>
    </div>
  </section>
);

export default CTASection;