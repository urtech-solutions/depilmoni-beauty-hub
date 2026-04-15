"use client";

import Link from "next/link";
import { Bell, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { Button, cn } from "@depilmoni/ui";

import { premiumEase } from "@/components/animations/animated";
import { useAuthStore } from "@/store/auth-store";
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
  const [unreadCount, setUnreadCount] = useState(0);
  const cartCount = useCartStore((state) =>
    state.items.reduce((total, item) => total + item.quantity, 0)
  );
  const user = useAuthStore((state) => state.user);
  const accountHref = user ? "/minha-conta" : "/login";
  const accountLabel = user ? `Olá, ${user.name.split(" ")[0]}` : "Minha conta";

  useEffect(() => {
    if (!user) {
      setUnreadCount(0);
      return;
    }

    const refreshNotifications = async () => {
      try {
        const response = await fetch("/api/notifications/unread-count", { cache: "no-store" });
        const json = (await response.json()) as { count?: number };
        if (response.ok) {
          setUnreadCount(json.count ?? 0);
        }
      } catch {
        setUnreadCount(0);
      }
    };

    void refreshNotifications();

    const onRefresh = () => {
      void refreshNotifications();
    };

    window.addEventListener("depilmoni-notifications-updated", onRefresh);
    return () => {
      window.removeEventListener("depilmoni-notifications-updated", onRefresh);
    };
  }, [user]);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: premiumEase }}
      className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md"
    >
      <div className="container flex h-16 items-center justify-between md:h-20">
        <button
          aria-label="Menu"
          className="text-foreground md:hidden"
          onClick={() => setMobileOpen((open) => !open)}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <Link href="/" className="flex items-center gap-2">
          <motion.span
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
            className="font-display text-2xl font-bold tracking-tight text-gradient-gold"
          >
            Depilmoni
          </motion.span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item, index) => (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 + index * 0.05, ease: premiumEase }}
            >
              <Link
                href={item.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            </motion.div>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" aria-label="Buscar" className="hidden md:inline-flex">
            <Search size={20} />
          </Button>
          {user ? (
            <Button asChild variant="ghost" size="icon" className="relative" aria-label="Notificações">
              <Link href="/minha-conta/notificacoes">
                <Bell size={20} />
                {unreadCount ? (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--color-accent-copper)] px-1 text-[10px] font-bold text-white">
                    {unreadCount}
                  </span>
                ) : null}
              </Link>
            </Button>
          ) : null}
          <Button asChild variant="ghost" size="icon" aria-label={accountLabel} title={accountLabel}>
            <Link href={accountHref}>
              <User size={20} />
            </Link>
          </Button>
          <Button asChild variant="ghost" size="icon" className="relative" aria-label="Carrinho">
            <Link href="/carrinho">
              <ShoppingBag size={20} />
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
                {cartCount}
              </span>
            </Link>
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: premiumEase }}
            className={cn("overflow-hidden border-t border-border/50 md:hidden")}
          >
            <nav className="container flex flex-col gap-4 py-4">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05, ease: premiumEase }}
                >
                  <Link
                    href={item.href}
                    className="text-base font-medium text-muted-foreground hover:text-foreground"
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.header>
  );
};
