import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { formatCurrency } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';

const CheckoutPage = () => {
  const [step, setStep] = useState<'form' | 'success'>('form');

  if (step === 'success') {
    return (
      <Layout>
        <div className="container py-20 text-center max-w-md mx-auto">
          <CheckCircle2 size={64} className="mx-auto text-green-500 mb-4" />
          <h1 className="font-display text-3xl font-bold">Pedido Confirmado!</h1>
          <p className="mt-3 text-muted-foreground">Seu pedido #12345 foi recebido. Você receberá um e-mail com os detalhes.</p>
          <p className="mt-2 text-sm text-muted-foreground">+50 XP adicionados à sua conta 🎉</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-12 max-w-2xl mx-auto">
        <h1 className="font-display text-3xl font-bold mb-8">Checkout</h1>
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-display font-semibold mb-4">Dados de entrega</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <input placeholder="Nome completo" className="rounded-md border border-input bg-background px-3 py-2 text-sm" />
              <input placeholder="E-mail" className="rounded-md border border-input bg-background px-3 py-2 text-sm" />
              <input placeholder="CPF" className="rounded-md border border-input bg-background px-3 py-2 text-sm" />
              <input placeholder="Telefone" className="rounded-md border border-input bg-background px-3 py-2 text-sm" />
              <input placeholder="CEP" className="rounded-md border border-input bg-background px-3 py-2 text-sm" />
              <input placeholder="Cidade" className="rounded-md border border-input bg-background px-3 py-2 text-sm" />
              <input placeholder="Endereço" className="col-span-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-display font-semibold mb-4">Frete</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-3 rounded-md border border-border p-3 cursor-pointer hover:border-copper/40">
                <input type="radio" name="shipping" defaultChecked className="accent-copper" />
                <div className="flex-1">
                  <p className="text-sm font-medium">PAC — 5 a 8 dias úteis</p>
                  <p className="text-xs text-muted-foreground">Melhor Envio</p>
                </div>
                <span className="text-sm font-semibold">{formatCurrency(19.90)}</span>
              </label>
              <label className="flex items-center gap-3 rounded-md border border-border p-3 cursor-pointer hover:border-copper/40">
                <input type="radio" name="shipping" className="accent-copper" />
                <div className="flex-1">
                  <p className="text-sm font-medium">SEDEX — 2 a 4 dias úteis</p>
                  <p className="text-xs text-muted-foreground">Melhor Envio</p>
                </div>
                <span className="text-sm font-semibold">{formatCurrency(34.90)}</span>
              </label>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-display font-semibold mb-4">Pagamento</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-3 rounded-md border border-border p-3 cursor-pointer hover:border-copper/40">
                <input type="radio" name="payment" defaultChecked className="accent-copper" />
                <div>
                  <p className="text-sm font-medium">Cartão de Crédito — até 12x</p>
                  <p className="text-xs text-muted-foreground">Mercado Pago</p>
                </div>
              </label>
              <label className="flex items-center gap-3 rounded-md border border-border p-3 cursor-pointer hover:border-copper/40">
                <input type="radio" name="payment" className="accent-copper" />
                <div>
                  <p className="text-sm font-medium">Pix — 5% de desconto</p>
                  <p className="text-xs text-muted-foreground">Mercado Pago</p>
                </div>
              </label>
            </div>
          </div>

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

          <Button variant="hero" size="lg" className="w-full" onClick={() => setStep('success')}>
            Confirmar Pedido
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default CheckoutPage;
