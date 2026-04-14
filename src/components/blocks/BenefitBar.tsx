import { Truck, ShieldCheck, Star, CreditCard } from 'lucide-react';
import { StaggerContainer, StaggerItem } from '@/components/animations/Animated';

const benefits = [
  { icon: Truck, text: 'Frete grátis acima de R$200' },
  { icon: ShieldCheck, text: 'Produtos profissionais' },
  { icon: Star, text: 'Programa de fidelidade' },
  { icon: CreditCard, text: 'Parcele em até 12x' },
];

const BenefitBar = () => (
  <section className="border-y border-border bg-secondary/50 py-4">
    <StaggerContainer className="container flex flex-wrap items-center justify-center gap-6 md:justify-between md:gap-4">
      {benefits.map((b) => (
        <StaggerItem key={b.text}>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <b.icon size={18} className="text-copper" />
            <span>{b.text}</span>
          </div>
        </StaggerItem>
      ))}
    </StaggerContainer>
  </section>
);

export default BenefitBar;