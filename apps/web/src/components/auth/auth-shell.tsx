import type { ReactNode } from "react";

export const AuthShell = ({
  title,
  subtitle,
  children
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) => (
  <section className="section-spacing">
    <div className="container max-w-md">
      <div className="rounded-[28px] border border-border/70 bg-[rgba(255,250,245,0.85)] p-8 shadow-[0_24px_60px_-30px_rgba(84,46,28,0.35)] md:p-10">
        <div className="mb-8 space-y-2 text-center">
          <h1 className="font-display text-3xl text-foreground">{title}</h1>
          {subtitle ? <p className="text-sm text-muted-foreground">{subtitle}</p> : null}
        </div>
        {children}
      </div>
    </div>
  </section>
);
