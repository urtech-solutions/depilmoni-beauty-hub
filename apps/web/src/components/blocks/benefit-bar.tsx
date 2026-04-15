"use client";

import { CreditCard, ShieldCheck, Star, Truck } from "lucide-react";

import type { BenefitBarBlock as BenefitBarBlockProps } from "@depilmoni/core";

import { StaggerContainer, StaggerItem } from "@/components/animations/animated";

const fallbackIcons = [Truck, ShieldCheck, Star, CreditCard];

const getBenefitIcon = (title: string, index: number) => {
  const normalized = title.toLowerCase();

  if (normalized.includes("frete")) {
    return Truck;
  }

  if (normalized.includes("parcela") || normalized.includes("pagamento")) {
    return CreditCard;
  }

  if (normalized.includes("xp") || normalized.includes("benef")) {
    return Star;
  }

  if (normalized.includes("profissional") || normalized.includes("segur")) {
    return ShieldCheck;
  }

  return fallbackIcons[index % fallbackIcons.length];
};

export const BenefitBar = ({ block }: { block: BenefitBarBlockProps }) => (
  <section className="border-y border-border bg-secondary/50 py-4">
    <StaggerContainer className="container flex flex-wrap items-center justify-center gap-6 md:justify-between md:gap-4">
      {block.items.map((item, index) => {
        const Icon = getBenefitIcon(item.title, index);

        return (
          <StaggerItem key={item.title}>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Icon size={18} className="shrink-0 text-copper" />
              <div>
                <p className="font-medium text-foreground">{item.title}</p>
                <p className="text-xs leading-relaxed">{item.description}</p>
              </div>
            </div>
          </StaggerItem>
        );
      })}
    </StaggerContainer>
  </section>
);
