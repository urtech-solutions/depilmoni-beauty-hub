// Mock data for Depilmoni storefront

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  shortDescription: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  category: string;
  tags: string[];
  variants: ProductVariant[];
  inventory: number;
  featured: boolean;
}

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  sku: string;
  inventory: number;
}

export interface Event {
  id: string;
  slug: string;
  title: string;
  description: string;
  shortDescription: string;
  date: string;
  time: string;
  location: string;
  image: string;
  batches: EventBatch[];
  featured: boolean;
  instructor: string;
}

export interface EventBatch {
  id: string;
  name: string;
  price: number;
  quantity: number;
  sold: number;
  active: boolean;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  image: string;
  active: boolean;
}

export interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minPurchase?: number;
  active: boolean;
  expiresAt: string;
}

export interface XPLevel {
  level: number;
  name: string;
  minXP: number;
  benefits: string[];
}

export const products: Product[] = [
  {
    id: '1',
    slug: 'cera-depilatoria-chocolate',
    name: 'Cera Depilatória Chocolate',
    description: 'Cera depilatória premium com extrato de cacau. Textura aveludada que proporciona depilação suave e eficiente. Ideal para peles sensíveis.',
    shortDescription: 'Cera premium com extrato de cacau',
    price: 89.90,
    compareAtPrice: 119.90,
    images: [],
    category: 'Ceras',
    tags: ['cera', 'chocolate', 'premium'],
    variants: [
      { id: '1a', name: '500g', price: 89.90, sku: 'CER-CHO-500', inventory: 45 },
      { id: '1b', name: '1kg', price: 149.90, sku: 'CER-CHO-1000', inventory: 30 },
    ],
    inventory: 75,
    featured: true,
  },
  {
    id: '2',
    slug: 'tonico-corporal-pos-depilacao',
    name: 'Tônico Corporal Pós-Depilação',
    description: 'Tônico calmante e hidratante para uso após a depilação. Fórmula com aloe vera e camomila que acalma a pele instantaneamente.',
    shortDescription: 'Tônico calmante pós-depilação',
    price: 49.90,
    images: [],
    category: 'Tônicos',
    tags: ['tônico', 'pós-depilação', 'calmante'],
    variants: [
      { id: '2a', name: '200ml', price: 49.90, sku: 'TON-POS-200', inventory: 60 },
    ],
    inventory: 60,
    featured: true,
  },
  {
    id: '3',
    slug: 'dolomita-profissional',
    name: 'Dolomita Profissional',
    description: 'Dolomita de alta qualidade para uso profissional. Absorção superior, ideal para preparação da pele antes da depilação.',
    shortDescription: 'Dolomita profissional de alta absorção',
    price: 34.90,
    images: [],
    category: 'Preparação',
    tags: ['dolomita', 'profissional'],
    variants: [
      { id: '3a', name: '250g', price: 34.90, sku: 'DOL-PRO-250', inventory: 100 },
      { id: '3b', name: '500g', price: 59.90, sku: 'DOL-PRO-500', inventory: 55 },
    ],
    inventory: 155,
    featured: false,
  },
  {
    id: '4',
    slug: 'cera-roll-on-mel',
    name: 'Cera Roll-On Mel',
    description: 'Cera roll-on prática com mel natural. Aplicação fácil e uniforme, perfeita para uso em casa ou no salão.',
    shortDescription: 'Cera roll-on prática com mel',
    price: 29.90,
    images: [],
    category: 'Ceras',
    tags: ['cera', 'roll-on', 'mel'],
    variants: [
      { id: '4a', name: '100g', price: 29.90, sku: 'CER-ROL-100', inventory: 80 },
    ],
    inventory: 80,
    featured: true,
  },
  {
    id: '5',
    slug: 'kit-depilacao-completo',
    name: 'Kit Depilação Completo',
    description: 'Kit completo com cera, dolomita, tônico pós-depilação e espátulas. Tudo que você precisa para uma depilação profissional.',
    shortDescription: 'Kit completo para depilação profissional',
    price: 189.90,
    compareAtPrice: 239.90,
    images: [],
    category: 'Kits',
    tags: ['kit', 'completo', 'profissional'],
    variants: [
      { id: '5a', name: 'Padrão', price: 189.90, sku: 'KIT-COMP-01', inventory: 25 },
    ],
    inventory: 25,
    featured: true,
  },
];

export const events: Event[] = [
  {
    id: '1',
    slug: 'workshop-depilacao-avancada',
    title: 'Workshop Depilação Avançada',
    description: 'Workshop completo de técnicas avançadas de depilação com cera. Aprenda com as especialistas Depilmoni técnicas exclusivas para resultados profissionais impecáveis.',
    shortDescription: 'Técnicas avançadas com as especialistas Depilmoni',
    date: '2026-05-20',
    time: '09:00 - 17:00',
    location: 'São Paulo, SP',
    image: '',
    batches: [
      { id: 'b1', name: '1° Lote', price: 297.00, quantity: 30, sold: 28, active: false },
      { id: 'b2', name: '2° Lote', price: 397.00, quantity: 40, sold: 12, active: true },
      { id: 'b3', name: '3° Lote', price: 497.00, quantity: 30, sold: 0, active: false },
    ],
    featured: true,
    instructor: 'Equipe Depilmoni',
  },
  {
    id: '2',
    slug: 'curso-empreendedorismo-beleza',
    title: 'Curso Empreendedorismo na Beleza',
    description: 'Curso intensivo sobre como empreender no mercado de beleza e depilação. Marketing, gestão, precificação e fidelização de clientes.',
    shortDescription: 'Empreenda no mercado de beleza',
    date: '2026-06-15',
    time: '08:00 - 18:00',
    location: 'Rio de Janeiro, RJ',
    image: '',
    batches: [
      { id: 'b4', name: 'Lote Único', price: 597.00, quantity: 50, sold: 8, active: true },
    ],
    featured: true,
    instructor: 'Equipe Depilmoni',
  },
];

export const banners: Banner[] = [
  {
    id: '1',
    title: 'Depilação Premium',
    subtitle: 'Conheça a linha completa de ceras e produtos Depilmoni',
    ctaText: 'Ver Produtos',
    ctaLink: '/produtos',
    image: '',
    active: true,
  },
  {
    id: '2',
    title: 'Workshop Avançado',
    subtitle: 'Aprenda técnicas exclusivas com nossas especialistas',
    ctaText: 'Inscreva-se',
    ctaLink: '/eventos',
    image: '',
    active: true,
  },
  {
    id: '3',
    title: 'Kit Completo com 20% OFF',
    subtitle: 'Tudo que você precisa para depilação profissional',
    ctaText: 'Aproveitar',
    ctaLink: '/produtos/kit-depilacao-completo',
    image: '',
    active: true,
  },
];

export const coupons: Coupon[] = [
  {
    id: '1',
    code: 'BEMVINDA10',
    type: 'percentage',
    value: 10,
    active: true,
    expiresAt: '2026-12-31',
  },
  {
    id: '2',
    code: 'FRETE50',
    type: 'fixed',
    value: 50,
    minPurchase: 200,
    active: true,
    expiresAt: '2026-06-30',
  },
];

export const xpLevels: XPLevel[] = [
  { level: 1, name: 'Bronze', minXP: 0, benefits: ['Acesso ao programa de fidelidade'] },
  { level: 2, name: 'Prata', minXP: 500, benefits: ['5% de desconto em produtos', 'Frete grátis acima de R$200'] },
  { level: 3, name: 'Ouro', minXP: 1500, benefits: ['10% de desconto em produtos', 'Frete grátis', 'Acesso antecipado a eventos'] },
  { level: 4, name: 'Diamante', minXP: 5000, benefits: ['15% de desconto', 'Frete grátis', 'Acesso VIP a eventos', 'Brindes exclusivos'] },
];

export const flashPromotion = {
  id: '1',
  title: 'Promoção Relâmpago',
  description: 'Cera Depilatória Chocolate com 25% OFF',
  productId: '1',
  discount: 25,
  endsAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  active: true,
};

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
