import type { ReactNode } from "react";

import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

export const StorefrontShell = ({ children }: { children: ReactNode }) => (
  <div className="relative min-h-screen overflow-hidden">
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(201,157,84,0.08),transparent_30%),radial-gradient(circle_at_85%_15%,rgba(167,114,74,0.1),transparent_30%)]" />
    <SiteHeader />
    <main>{children}</main>
    <SiteFooter />
  </div>
);
