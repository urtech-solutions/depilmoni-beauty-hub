import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

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
      <div className="mx-auto max-w-2xl rounded-2xl bg-chocolate p-10 text-center md:p-14">
        <h2 className="font-display text-3xl font-bold text-cream md:text-4xl">{title}</h2>
        <p className="mt-3 text-cream/70">{subtitle}</p>
        <Link to={ctaLink}>
          <Button variant="hero" size="lg" className="mt-8">
            {ctaText}
          </Button>
        </Link>
      </div>
    </div>
  </section>
);

export default CTASection;
