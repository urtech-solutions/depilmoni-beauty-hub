"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.24em]",
  {
    variants: {
      variant: {
        default: "bg-secondary text-secondary-foreground",
        accent: "bg-[rgba(201,157,84,0.16)] text-[var(--color-accent-gold)]",
        copper: "bg-[rgba(167,114,74,0.16)] text-[var(--color-accent-copper)]"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

export type BadgeProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof badgeVariants>;

export const Badge = ({ className, variant, ...props }: BadgeProps) => (
  <div className={cn(badgeVariants({ variant }), className)} {...props} />
);
