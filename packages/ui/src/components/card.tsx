"use client";

import * as React from "react";

import { cn } from "../lib/utils";

export const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-[28px] border border-border/70 bg-card p-6 shadow-[0_24px_60px_-42px_rgba(84,46,28,0.38)] backdrop-blur-sm",
        className
      )}
      {...props}
    />
  )
);

Card.displayName = "Card";
