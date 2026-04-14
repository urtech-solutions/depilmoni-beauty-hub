import { Truck, ShieldCheck, Star, CreditCard } from 'lucide-react';

const benefits = [
  { icon: Truck, text: 'Frete grátis acima de R$200' },
  { icon: ShieldCheck, text: 'Produtos profissionais' },
  { icon: Star, text: 'Programa de fidelidade' },
  { icon: CreditCard, text: 'Parcele em até 12x' },
];

const BenefitBar = () => (
  <section className="border-y border-border bg-secondary/50 py-4">
    <div className="container flex flex-wrap items-center justify-center gap-6 md:justify-between md:gap-4">
      {benefits.map((b) => (
        <div key={b.text} className="flex items-center gap-2 text-sm text-muted-foreground">
          <b.icon size={18} className="text-copper" />
          <span>{b.text}</span>
        </div>
      ))}
    </div>
  </section>
);

export default BenefitBar;
