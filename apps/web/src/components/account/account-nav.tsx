"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, MapPin, Package, ShieldCheck, Sparkles, User2 } from "lucide-react";

import { Badge, cn } from "@depilmoni/ui";

import type { StorefrontUser } from "@/lib/payload-client";

const profileLabels: Record<StorefrontUser["profileType"], string> = {
  client: "Cliente",
  partner: "Parceiro",
  distributor: "Distribuidor"
};

type AccountNavProps = {
  user: StorefrontUser;
};

export const AccountNav = ({ user }: AccountNavProps) => {
  const pathname = usePathname();

  const links = [
    { href: "/minha-conta", label: "Visao geral", icon: User2 },
    { href: "/minha-conta/perfil", label: "Perfil", icon: User2 },
    { href: "/minha-conta/enderecos", label: "Enderecos", icon: MapPin },
    { href: "/minha-conta/pedidos", label: "Pedidos", icon: Package },
    { href: "/minha-conta/experiencia", label: "Experiencia", icon: Sparkles },
    { href: "/minha-conta/notificacoes", label: "Notificacoes", icon: Bell },
    { href: "/minha-conta/distribuidor", label: "Distribuidor", icon: ShieldCheck }
  ];

  return (
    <aside className="space-y-6">
      <div className="rounded-[28px] border border-border/70 bg-card p-5 shadow-[0_24px_60px_-42px_rgba(84,46,28,0.38)]">
        <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">Minha conta</p>
        <h2 className="mt-3 font-display text-2xl font-semibold text-foreground">{user.name}</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge>{profileLabels[user.profileType]}</Badge>
          {user.fidelityTagIds.length ? <Badge variant="accent">Fidelidade</Badge> : null}
          {user.distributorStatus !== "none" ? <Badge variant="copper">{user.distributorStatus}</Badge> : null}
        </div>
      </div>

      <nav className="hidden rounded-[28px] border border-border/70 bg-card/90 p-3 shadow-[0_24px_60px_-42px_rgba(84,46,28,0.38)] md:block">
        <ul className="space-y-1">
          {links.map((item) => {
            const Icon = item.icon;
            const active =
              pathname === item.href ||
              (item.href !== "/minha-conta" && pathname.startsWith(`${item.href}/`));

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors",
                    active
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground hover:bg-secondary/70 hover:text-foreground"
                  )}
                >
                  <Icon size={17} />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <nav className="md:hidden">
        <div className="flex gap-3 overflow-x-auto pb-2">
          {links.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex min-w-fit items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors",
                  active
                    ? "border-copper/30 bg-secondary text-foreground"
                    : "border-border/70 bg-card text-muted-foreground"
                )}
              >
                <Icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </aside>
  );
};
