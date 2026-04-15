"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

const premiumEase = [0.22, 1, 0.36, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1 },
};

const slideLeft: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0 },
};

const slideRight: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0 },
};

const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const variantMap = { fadeUp, fadeIn, scaleIn, slideLeft, slideRight };

interface AnimatedProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  variant?: keyof typeof variantMap;
}

export const Animated = ({ children, className, delay = 0, variant = "fadeUp" }: AnimatedProps) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-60px" }}
    variants={variantMap[variant]}
    transition={{ duration: 0.6, ease: premiumEase, delay }}
    className={className}
  >
    {children}
  </motion.div>
);

export const StaggerContainer = ({ children, className }: { children: ReactNode; className?: string }) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-60px" }}
    variants={staggerContainer}
    className={className}
  >
    {children}
  </motion.div>
);

export const StaggerItem = ({ children, className }: { children: ReactNode; className?: string }) => (
  <motion.div variants={fadeUp} transition={{ duration: 0.5, ease: premiumEase }} className={className}>
    {children}
  </motion.div>
);

export const PageTransition = ({ children, className }: { children: ReactNode; className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -12 }}
    transition={{ duration: 0.4, ease: premiumEase }}
    className={className}
  >
    {children}
  </motion.div>
);

export const MotionImage = motion.img;
export const MotionDiv = motion.div;
export { premiumEase };
