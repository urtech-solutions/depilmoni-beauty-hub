"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import type { CTASectionBlock as CTASectionBlockProps } from "@depilmoni/core";
import { Button, Card } from "@depilmoni/ui";

import { Animated } from "@/components/animations/animated";

export const CTASection = ({ block }: { block: CTASectionBlockProps }) => (
  <section className="py-20">
    <div className="container">
      <Animated>
        <motion.div
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.3 }}
          className="mx-auto max-w-3xl"
        >
          <Card className="rounded-2xl bg-chocolate p-10 text-center text-cream md:p-14">
            <h2 className="font-display text-3xl font-bold md:text-4xl">{block.title}</h2>
            <p className="mt-3 text-cream/70">{block.subtitle}</p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 md:flex-row">
              <Button asChild variant="hero" size="lg">
                <Link href={block.cta.href}>{block.cta.label}</Link>
              </Button>
              {block.secondaryCta ? (
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-white/20 text-cream hover:bg-white/10 hover:text-cream"
                >
                  <Link href={block.secondaryCta.href}>{block.secondaryCta.label}</Link>
                </Button>
              ) : null}
            </div>
          </Card>
        </motion.div>
      </Animated>
    </div>
  </section>
);
