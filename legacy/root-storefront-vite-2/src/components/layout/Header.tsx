import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Menu, X, User, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/produtos', label: 'Produtos' },
  { href: '/kits', label: 'Kits' },
  { href: '/eventos', label: 'Eventos' },
  { href: '/blog', label: 'Blog' },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between md:h-20">
        {/* Mobile menu toggle */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="font-display text-2xl font-bold tracking-tight text-gradient-gold">
            Depilmoni
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="hidden md:inline-flex">
            <Search size={20} />
          </Button>
          <Link to="/minha-conta">
            <Button variant="ghost" size="icon">
              <User size={20} />
            </Button>
          </Link>
          <Link to="/carrinho">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingBag size={20} />
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
                0
              </span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Mobile nav */}
      <div
        className={cn(
          'md:hidden overflow-hidden transition-all duration-300 border-t border-border/50',
          mobileOpen ? 'max-h-64' : 'max-h-0 border-t-0'
        )}
      >
        <nav className="container flex flex-col gap-4 py-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => setMobileOpen(false)}
              className="text-base font-medium text-muted-foreground hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;
