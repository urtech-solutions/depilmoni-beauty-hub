import { motion } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import { xpLevels, formatCurrency } from '@/lib/mock-data';
import { User, Package, Ticket, Star, Award } from 'lucide-react';
import { PageTransition, Animated, StaggerContainer, StaggerItem } from '@/components/animations/Animated';

const currentXP = 720;
const currentLevel = xpLevels.filter((l) => currentXP >= l.minXP).pop()!;
const nextLevel = xpLevels.find((l) => l.minXP > currentXP);
const progress = nextLevel
  ? ((currentXP - currentLevel.minXP) / (nextLevel.minXP - currentLevel.minXP)) * 100
  : 100;

const MyAccount = () => (
  <Layout>
    <PageTransition>
      <div className="container py-12 max-w-3xl mx-auto">
        <Animated>
          <h1 className="font-display text-3xl font-bold mb-8">Minha Conta</h1>
        </Animated>

        {/* Profile card */}
        <Animated delay={0.1}>
          <div className="rounded-xl border border-border bg-card p-6 mb-6">
            <div className="flex items-center gap-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', bounce: 0.4, delay: 0.3 }}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-copper/20"
              >
                <User size={24} className="text-copper" />
              </motion.div>
              <div>
                <h2 className="font-display text-lg font-semibold">Maria Silva</h2>
                <div className="flex gap-2 mt-1">
                  <span className="rounded-full bg-secondary px-3 py-0.5 text-xs font-medium">Cliente</span>
                  <span className="rounded-full bg-gold/20 px-3 py-0.5 text-xs font-medium text-gold">Fidelidade</span>
                </div>
              </div>
            </div>
          </div>
        </Animated>

        {/* XP bar */}
        <Animated delay={0.2}>
          <div className="rounded-xl border border-border bg-card p-6 mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Award size={18} className="text-gold" />
                <span className="font-display font-semibold">{currentLevel.name}</span>
              </div>
              <span className="text-sm text-muted-foreground">{currentXP} XP</span>
            </div>
            <div className="h-3 rounded-full bg-warm-beige overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1.2, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="h-full rounded-full bg-gradient-to-r from-copper to-gold"
              />
            </div>
            {nextLevel && (
              <p className="text-xs text-muted-foreground mt-2">
                Faltam {nextLevel.minXP - currentXP} XP para o nível {nextLevel.name}
              </p>
            )}
            <div className="mt-4">
              <p className="text-xs font-medium mb-2">Benefícios atuais:</p>
              <StaggerContainer className="space-y-1">
                {currentLevel.benefits.map((b) => (
                  <StaggerItem key={b}>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Star size={12} className="text-gold" /> {b}
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </div>
        </Animated>

        {/* Recent orders */}
        <Animated delay={0.3}>
          <div className="rounded-xl border border-border bg-card p-6 mb-6">
            <h3 className="font-display font-semibold flex items-center gap-2 mb-4">
              <Package size={18} className="text-copper" /> Meus Pedidos
            </h3>
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-between rounded-md border border-border p-3"
            >
              <div>
                <p className="text-sm font-medium">#12345</p>
                <p className="text-xs text-muted-foreground">Cera Chocolate 500g × 2</p>
              </div>
              <div className="text-right">
                <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">Entregue</span>
                <p className="text-sm font-semibold mt-1">{formatCurrency(179.80)}</p>
              </div>
            </motion.div>
          </div>
        </Animated>

        {/* Tickets */}
        <Animated delay={0.4}>
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-display font-semibold flex items-center gap-2 mb-4">
              <Ticket size={18} className="text-copper" /> Meus Ingressos
            </h3>
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="flex items-center justify-between rounded-md border border-border p-3"
            >
              <div>
                <p className="text-sm font-medium">Workshop Depilação Avançada</p>
                <p className="text-xs text-muted-foreground">20/05/2026 — São Paulo, SP</p>
              </div>
              <span className="rounded-full bg-copper/20 px-2 py-0.5 text-xs text-copper font-medium">Confirmado</span>
            </motion.div>
          </div>
        </Animated>
      </div>
    </PageTransition>
  </Layout>
);

export default MyAccount;