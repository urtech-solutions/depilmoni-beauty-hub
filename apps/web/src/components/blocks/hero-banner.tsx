"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

import type { HeroBannerBlock as HeroBannerBlockProps } from "@depilmoni/core";
import { Badge, Button } from "@depilmoni/ui";

import { premiumEase } from "@/components/animations/animated";

export const HeroBanner = ({ block }: { block: HeroBannerBlockProps }) => (
  <section className="relative overflow-hidden">
    <div className="absolute inset-0">
      <motion.div
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.4, ease: premiumEase }}
        className="relative h-full w-full"
      >
        <Image src={block.image} alt={block.title} fill priority className="object-cover" />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-r from-chocolate/85 via-chocolate/55 to-transparent" />
    </div>

    <div className="container relative z-10 flex min-h-[480px] items-center py-20 md:min-h-[560px]">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3, ease: premiumEase }}
        className="max-w-xl"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35, ease: premiumEase }}
        >
          <Badge variant="accent" className="border border-white/10 bg-white/10 text-cream">
            {block.eyebrow}
          </Badge>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45, ease: premiumEase }}
          className="mt-5 font-display text-4xl font-bold leading-tight text-cream md:text-5xl lg:text-6xl"
        >
          {block.title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6, ease: premiumEase }}
          className="mt-4 text-base leading-relaxed text-cream/80 md:text-lg"
        >
          {block.subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.75, ease: premiumEase }}
          className="mt-8 flex flex-wrap gap-3"
        >
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
        </motion.div>

        {block.ambienceNotes.length ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.9, ease: premiumEase }}
            className="mt-6 flex flex-wrap gap-3"
          >
            {block.ambienceNotes.map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.24em] text-cream/75"
              >
                {item}
              </span>
            ))}
          </motion.div>
        ) : null}
      </motion.div>
    </div>
  </section>
);
