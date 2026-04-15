import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import { products, formatCurrency } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Trash2, Minus, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageTransition, Animated } from '@/components/animations/Animated';
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
      <PageTransition>
        <div className="container py-12">
          <Animated>
            <h1 className="font-display text-3xl font-bold mb-8">Carrinho</h1>
          </Animated>
          {cart.length === 0 ? (
            <Animated className="text-center py-20">
              <p className="text-muted-foreground mb-4">Seu carrinho está vazio</p>
              <Link to="/produtos"><Button>Ver Produtos</Button></Link>
            </Animated>
          ) : (
            <div className="grid gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-4">
                <AnimatePresence>
                  {cart.map((item, i) => (
                    <motion.div
                      key={item.product.id + item.variant.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex gap-4 rounded-lg border border-border bg-card p-4"
                    >
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
                          <motion.span
                            key={item.variant.price * item.qty}
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="font-semibold text-sm"
                          >
                            {formatCurrency(item.variant.price * item.qty)}
                          </motion.span>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => removeItem(i)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 size={16} />
                      </motion.button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              <Animated variant="slideLeft" delay={0.2}>
                <div className="rounded-xl border border-border bg-card p-6">
                  <h3 className="font-display font-semibold mb-4">Resumo</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
                    <AnimatePresence>
                      {discount > 0 && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="flex justify-between text-green-600"
                        >
                          <span>Desconto</span><span>-{formatCurrency(discount)}</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
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
                    <AnimatePresence>
                      {appliedCoupon && (
                        <motion.p
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-xs mt-1 text-green-600"
                        >
                          {appliedCoupon === 'BEMVINDA10' ? 'Cupom aplicado: 10% de desconto!' : 'Cupom inválido'}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                  <Link to="/checkout">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                      <Button variant="hero" size="lg" className="w-full mt-6">Finalizar Compra</Button>
                    </motion.div>
                  </Link>
                </div>
              </Animated>
            </div>
          )}
        </div>
      </PageTransition>
    </Layout>
  );
};

export default CartPage;