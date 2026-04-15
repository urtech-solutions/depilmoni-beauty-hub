import { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import { formatCurrency } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import { PageTransition, Animated } from '@/components/animations/Animated';

const CheckoutPage = () => {
  const [step, setStep] = useState<'form' | 'success'>('form');

  if (step === 'success') {
    return (
      <Layout>
        <div className="container py-20 text-center max-w-md mx-auto">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, type: 'spring', bounce: 0.4 }}
          >
            <CheckCircle2 size={64} className="mx-auto text-green-500 mb-4" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h1 className="font-display text-3xl font-bold">Pedido Confirmado!</h1>
            <p className="mt-3 text-muted-foreground">Seu pedido #12345 foi recebido. Você receberá um e-mail com os detalhes.</p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-2 text-sm text-muted-foreground"
            >
              +50 XP adicionados à sua conta 🎉
            </motion.p>
          </motion.div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageTransition>
        <div className="container py-12 max-w-2xl mx-auto">
          <Animated>
            <h1 className="font-display text-3xl font-bold mb-8">Checkout</h1>
          </Animated>
          <div className="space-y-6">
            <Animated delay={0.1}>
              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="font-display font-semibold mb-4">Dados de entrega</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <input placeholder="Nome completo" className="rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-copper/30 focus:border-copper transition-all" />
                  <input placeholder="E-mail" className="rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-copper/30 focus:border-copper transition-all" />
                  <input placeholder="CPF" className="rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-copper/30 focus:border-copper transition-all" />
                  <input placeholder="Telefone" className="rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-copper/30 focus:border-copper transition-all" />
                  <input placeholder="CEP" className="rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-copper/30 focus:border-copper transition-all" />
                  <input placeholder="Cidade" className="rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-copper/30 focus:border-copper transition-all" />
                  <input placeholder="Endereço" className="col-span-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-copper/30 focus:border-copper transition-all" />
                </div>
              </div>
            </Animated>

            <Animated delay={0.2}>
              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="font-display font-semibold mb-4">Frete</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 rounded-md border border-border p-3 cursor-pointer hover:border-copper/40 transition-colors">
                    <input type="radio" name="shipping" defaultChecked className="accent-copper" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">PAC — 5 a 8 dias úteis</p>
                      <p className="text-xs text-muted-foreground">Melhor Envio</p>
                    </div>
                    <span className="text-sm font-semibold">{formatCurrency(19.90)}</span>
                  </label>
                  <label className="flex items-center gap-3 rounded-md border border-border p-3 cursor-pointer hover:border-copper/40 transition-colors">
                    <input type="radio" name="shipping" className="accent-copper" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">SEDEX — 2 a 4 dias úteis</p>
                      <p className="text-xs text-muted-foreground">Melhor Envio</p>
                    </div>
                    <span className="text-sm font-semibold">{formatCurrency(34.90)}</span>
                  </label>
                </div>
              </div>
            </Animated>

            <Animated delay={0.3}>
              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="font-display font-semibold mb-4">Pagamento</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 rounded-md border border-border p-3 cursor-pointer hover:border-copper/40 transition-colors">
                    <input type="radio" name="payment" defaultChecked className="accent-copper" />
                    <div>
                      <p className="text-sm font-medium">Cartão de Crédito — até 12x</p>
                      <p className="text-xs text-muted-foreground">Mercado Pago</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 rounded-md border border-border p-3 cursor-pointer hover:border-copper/40 transition-colors">
                    <input type="radio" name="payment" className="accent-copper" />
                    <div>
                      <p className="text-sm font-medium">Pix — 5% de desconto</p>
                      <p className="text-xs text-muted-foreground">Mercado Pago</p>
                    </div>
                  </label>
                </div>
              </div>
            </Animated>

            <Animated delay={0.4}>
              <div className="rounded-xl border border-border bg-card p-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatCurrency(229.70)}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Frete</span>
                  <span>{formatCurrency(0)}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg border-t border-border pt-2">
                  <span>Total</span>
                  <span>{formatCurrency(229.70)}</span>
                </div>
              </div>
            </Animated>

            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
              <Button variant="hero" size="lg" className="w-full" onClick={() => setStep('success')}>
                Confirmar Pedido
              </Button>
            </motion.div>
          </div>
        </div>
      </PageTransition>
    </Layout>
  );
};

export default CheckoutPage;