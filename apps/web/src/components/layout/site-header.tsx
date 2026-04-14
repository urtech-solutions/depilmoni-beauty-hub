"use client";

import Link from "next/link";
import { Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@depilmoni/ui";

import { useCartStore } from "@/store/cart-store";

const navItems = [
  { href: "/produtos", label: "Produtos" },
  { href: "/kits", label: "Kits" },
  { href: "/eventos", label: "Eventos" },
  { href: "/blog", label: "Blog" },
  { href: "/minha-conta", label: "Minha Conta" }
];

export const SiteHeader = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const cartCount = useCartStore((state) =>
    state.items.reduce((total, item) => total + item.quantity, 0)
  );

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-[rgba(245,237,228,0.82)] backdrop-blur-xl">
      <div className="container flex h-20 items-center justify-between gap-4">
        <div className="flex items-center gap-3 lg:hidden">
          <button
            aria-label="Abrir menu"
            className="rounded-full border border-border/70 p-2"
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        <Link href="/" className="group flex items-center gap-3">
          <div className="rounded-full border border-[rgba(201,157,84,0.32)] bg-[rgba(255,250,245,0.72)] px-3 py-1">
            <span className="text-[10px] uppercase tracking-[0.38em] text-[var(--color-accent-copper)]">
              Depilmoni
            </span>
          </div>
          <div className="hidden sm:block">
            <p className="font-display text-2xl leading-none text-gradient-metallic">Beauty Hub</p>
            <p className="text-xs uppercase tracking-[0.34em] text-muted-foreground">
              e-commerce premium
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" aria-label="Buscar">
            <Search size={18} />
          </Button>
          <Link href="/minha-conta">
            <Button variant="ghost" size="icon" aria-label="Minha conta">
              <User size={18} />
            </Button>
          </Link>
          <Link href="/carrinho">
            <Button variant="ghost" size="icon" className="relative" aria-label="Carrinho">
              <ShoppingBag size={18} />
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--color-accent-copper)] px-1 text-[10px] font-semibold text-white">
                {cartCount}
              </span>
            </Button>
          </Link>
        </div>
      </div>

      {mobileOpen ? (
        <nav className="container flex flex-col gap-4 border-t border-border/60 py-5 lg:hidden">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-[var(--color-text-secondary)]"
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      ) : null}
    </header>
  );
};
