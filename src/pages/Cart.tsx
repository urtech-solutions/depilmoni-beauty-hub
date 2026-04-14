import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { products, formatCurrency } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Trash2, Minus, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import productCeraChocolate from '@/assets/product-cera-chocolate.jpg';
import productTonico from '@/assets/product-tonico.jpg';

const initialCart = [
  { product: products[0], variant: products[0].variants[0], qty: 2, image: productCeraChocolate },
  { product: products[1], variant: products[1].variants[0], qty: 1, image: productTonico },
];

const CartPage = () => {
  const [cart, setCart] = useState(initialCart);
  const [coupon, setCoupon] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  const subtotal = cart.reduce((sum, item) => sum + item.variant.price * item.qty, 0);
  const discount = appliedCoupon === 'BEMVINDA10' ? subtotal * 0.1 : 0;
  const shipping = subtotal >= 200 ? 0 : 19.90;
  const total = subtotal - discount + shipping;

  const updateQty = (index: number, delta: number) => {
    setCart(cart.map((item, i) => i === index ? { ...item, qty: Math.max(1, item.qty + delta) } : item));
  };

  const removeItem = (index: number) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  return (
    <Layout>
      <div className="container py-12">
        <h1 className="font-display text-3xl font-bold mb-8">Carrinho</h1>
        {cart.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground mb-4">Seu carrinho está vazio</p>
            <Link to="/produtos"><Button>Ver Produtos</Button></Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item, i) => (
                <div key={i} className="flex gap-4 rounded-lg border border-border bg-card p-4">
                  <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-warm-beige">
                    <img src={item.image} alt={item.product.name} loading="lazy" className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm truncate">{item.product.name}</h3>
                    <p className="text-xs text-muted-foreground">{item.variant.name}</p>
                    <div className="mt-2 flex items-center gap-3">
                      <div className="flex items-center rounded border border-border">
                        <button onClick={() => updateQty(i, -1)} className="p-1"><Minus size={14} /></button>
                        <span className="w-8 text-center text-xs">{item.qty}</span>
                        <button onClick={() => updateQty(i, 1)} className="p-1"><Plus size={14} /></button>
                      </div>
                      <span className="font-semibold text-sm">{formatCurrency(item.variant.price * item.qty)}</span>
                    </div>
                  </div>
                  <button onClick={() => removeItem(i)} className="text-muted-foreground hover:text-destructive">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="font-display font-semibold mb-4">Resumo</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
                {discount > 0 && <div className="flex justify-between text-green-600"><span>Desconto</span><span>-{formatCurrency(discount)}</span></div>}
                <div className="flex justify-between"><span className="text-muted-foreground">Frete</span><span>{shipping === 0 ? 'Grátis' : formatCurrency(shipping)}</span></div>
                <div className="flex justify-between border-t border-border pt-2 font-semibold text-base">
                  <span>Total</span><span>{formatCurrency(total)}</span>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex gap-2">
                  <input
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    placeholder="Código do cupom"
                    className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  />
                  <Button variant="outline" size="sm" onClick={() => setAppliedCoupon(coupon.toUpperCase())}>
                    Aplicar
                  </Button>
                </div>
                {appliedCoupon && (
                  <p className="text-xs mt-1 text-green-600">
                    {appliedCoupon === 'BEMVINDA10' ? 'Cupom aplicado: 10% de desconto!' : 'Cupom inválido'}
                  </p>
                )}
              </div>
              <Link to="/checkout">
                <Button variant="hero" size="lg" className="w-full mt-6">Finalizar Compra</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CartPage;
