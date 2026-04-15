"use client";

import Link from "next/link";
import { Droplets, Gift, Sparkles, WandSparkles } from "lucide-react";
import { motion } from "framer-motion";

import type { CategoryGridBlock as CategoryGridBlockProps } from "@depilmoni/core";
import { Card } from "@depilmoni/ui";

import { Animated, StaggerContainer, StaggerItem } from "@/components/animations/animated";

const categoryIcons = [Sparkles, Droplets, WandSparkles, Gift];

export const CategoryGrid = ({ block }: { block: CategoryGridBlockProps }) => (
  <section className="bg-secondary/30 py-16">
    <div className="container">
      <Animated>
        <h2 className="mb-2 text-center font-display text-3xl font-bold">{block.title}</h2>
        <p className="mx-auto mb-8 max-w-2xl text-center text-muted-foreground">{block.subtitle}</p>
      </Animated>

      <StaggerContainer className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {block.items.map((item, index) => {
          const Icon = categoryIcons[index % categoryIcons.length];

          return (
            <StaggerItem key={item.title}>
              <Link href={item.href}>
                <motion.div whileHover={{ y: -6, scale: 1.02 }} transition={{ duration: 0.3 }}>
                  <Card className="rounded-xl border border-border bg-card p-6 transition-shadow hover:border-copper/40 hover:shadow-md">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-copper/10">
                      <Icon size={26} className="text-copper" />
                    </div>
                    <h3 className="mt-4 font-display text-xl font-semibold">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  </Card>
                </motion.div>
              </Link>
            </StaggerItem>
          );
        })}
      </StaggerContainer>
    </div>
  </section>
);
