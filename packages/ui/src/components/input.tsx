"use client";

import * as React from "react";

import { cn } from "../lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "flex h-12 w-full rounded-2xl border border-border/80 bg-background/70 px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-copper/50",
        className
      )}
      {...props}
    />
  )
);

Input.displayName = "Input";
