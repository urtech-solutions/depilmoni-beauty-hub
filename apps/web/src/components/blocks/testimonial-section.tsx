"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

import type { TestimonialSectionBlock as TestimonialSectionBlockProps } from "@depilmoni/core";
import { Card } from "@depilmoni/ui";

import { Animated, StaggerContainer, StaggerItem } from "@/components/animations/animated";

export const TestimonialSection = ({
  block
}: {
  block: TestimonialSectionBlockProps;
}) => (
  <section className="bg-secondary/30 py-16">
    <div className="container">
      <Animated>
        <h2 className="mb-10 text-center font-display text-3xl font-bold">{block.title}</h2>
        <p className="sr-only">{block.subtitle}</p>
      </Animated>

      <StaggerContainer className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {block.testimonials.map((testimonial) => (
          <StaggerItem key={testimonial.name}>
            <motion.div
              whileHover={{ y: -4, boxShadow: "0 8px 30px -12px rgba(0,0,0,0.12)" }}
              transition={{ duration: 0.25 }}
            >
              <Card className="rounded-xl border border-border bg-card p-6">
                <div className="mb-3 flex gap-1">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} size={16} className="fill-gold text-gold" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground italic">
                  "{testimonial.quote}"
                </p>
                <div className="mt-4 border-t border-border pt-4">
                  <p className="text-sm font-semibold">{testimonial.name}</p>
                  <p className="text-xs text-copper">{testimonial.role}</p>
                </div>
              </Card>
            </motion.div>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </div>
  </section>
);
