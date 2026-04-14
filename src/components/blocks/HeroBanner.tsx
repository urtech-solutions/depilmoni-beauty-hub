import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import heroImg from '@/assets/hero-depilmoni.jpg';

interface HeroBannerProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
}

const HeroBanner = ({
  title = 'Depilação Premium',
  subtitle = 'Conheça a linha completa de ceras e produtos Depilmoni. Qualidade profissional com o cuidado que sua pele merece.',
  ctaText = 'Ver Produtos',
  ctaLink = '/produtos',
}: HeroBannerProps) => (
  <section className="relative overflow-hidden">
    <div className="absolute inset-0">
      <img src={heroImg} alt="Depilmoni" className="h-full w-full object-cover" width={1920} height={1080} />
      <div className="absolute inset-0 bg-gradient-to-r from-chocolate/80 via-chocolate/50 to-transparent" />
    </div>
    <div className="container relative z-10 flex min-h-[480px] items-center py-20 md:min-h-[560px]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="max-w-lg"
      >
        <h1 className="font-display text-4xl font-bold leading-tight text-cream md:text-5xl lg:text-6xl">
          {title}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-cream/80 md:text-lg">
          {subtitle}
        </p>
        <Link to={ctaLink}>
          <Button variant="hero" size="lg" className="mt-8">
            {ctaText}
          </Button>
        </Link>
      </motion.div>
    </div>
  </section>
);

export default HeroBanner;
