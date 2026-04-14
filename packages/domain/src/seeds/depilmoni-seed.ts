import type {
  Banner,
  BlogPost,
  Coupon,
  CustomerProfile,
  CustomerTag,
  Event,
  FidelityTag,
  LandingPage,
  Product,
  Promotion,
  PurchaseOrder,
  Ticket,
  XPLevel,
  XPTransaction
} from "../types";

export const products: Product[] = [
  {
    id: "prod_1",
    slug: "cera-depilatoria-chocolate-premium",
    name: "Cera Depilatória Chocolate Premium",
    shortDescription: "Textura aveludada com acabamento limpo e aroma sofisticado.",
    description:
      "Cera profissional desenvolvida para uma remoção confortável, aderência equilibrada e sensorial acolhedor inspirado em notas de chocolate e manteiga de cacau.",
    category: "Ceras Depilatórias",
    image: "/images/product-cera-chocolate.jpg",
    tags: ["destaque", "premium", "flash"],
    featured: true,
    seoTitle: "Cera Depilatória Chocolate Premium | Depilmoni",
    seoDescription: "Linha premium Depilmoni com alto desempenho para depilação profissional.",
    variants: [
      {
        id: "variant_1a",
        name: "500g",
        sku: "DEP-CER-CHO-500",
        pricing: {
          baseRetailPrice: 89.9,
          profilePrices: {
            parceiro: 82.9,
            distribuidor: 74.9
          },
          fidelityAdjustmentPercentage: 5
        },
        inventory: {
          sku: "DEP-CER-CHO-500",
          stock: 45,
          reserved: 2,
          warehouse: "principal"
        },
        attributes: { size: "500g" }
      },
      {
        id: "variant_1b",
        name: "1kg",
        sku: "DEP-CER-CHO-1000",
        pricing: {
          baseRetailPrice: 149.9,
          profilePrices: {
            parceiro: 139.9,
            distribuidor: 126.9
          },
          fidelityAdjustmentPercentage: 5
        },
        inventory: {
          sku: "DEP-CER-CHO-1000",
          stock: 32,
          reserved: 0,
          warehouse: "principal"
        },
        attributes: { size: "1kg" }
      }
    ]
  },
  {
    id: "prod_2",
    slug: "tonico-corporal-pos-depilacao",
    name: "Tônico Corporal Pós-Depilação",
    shortDescription: "Calma, hidrata e prolonga a sensação de cuidado profissional.",
    description:
      "Fórmula com aloe vera, camomila e notas botânicas para reduzir a sensibilização e deixar a pele confortável após a depilação.",
    category: "Tônicos Corporais",
    image: "/images/product-tonico.jpg",
    tags: ["pos-depilacao", "skincare"],
    featured: true,
    seoTitle: "Tônico Corporal Pós-Depilação | Depilmoni",
    seoDescription: "Hidratação e conforto para a rotina pós-depilatória.",
    variants: [
      {
        id: "variant_2a",
        name: "200ml",
        sku: "DEP-TON-POS-200",
        pricing: {
          baseRetailPrice: 49.9,
          profilePrices: {
            parceiro: 44.9,
            distribuidor: 39.9
          },
          fidelityAdjustmentPercentage: 3
        },
        inventory: {
          sku: "DEP-TON-POS-200",
          stock: 64,
          reserved: 4,
          warehouse: "principal"
        },
        attributes: { size: "200ml" }
      }
    ]
  },
  {
    id: "prod_3",
    slug: "dolomita-profissional-purificada",
    name: "Dolomita Profissional Purificada",
    shortDescription: "Pré-tratamento mineral para pele equilibrada e seca na medida certa.",
    description:
      "Dolomita de alta pureza indicada para preparar a pele antes da depilação, auxiliando no controle de umidade e acabamento profissional.",
    category: "Dolomita",
    image: "/images/product-dolomita.jpg",
    tags: ["preparo", "profissional"],
    featured: false,
    seoTitle: "Dolomita Profissional Purificada | Depilmoni",
    seoDescription: "Prepare a pele com acabamento técnico e toque suave.",
    variants: [
      {
        id: "variant_3a",
        name: "250g",
        sku: "DEP-DOL-250",
        pricing: {
          baseRetailPrice: 34.9,
          profilePrices: {
            parceiro: 31.9,
            distribuidor: 27.9
          },
          fidelityAdjustmentPercentage: 0
        },
        inventory: {
          sku: "DEP-DOL-250",
          stock: 90,
          reserved: 0,
          warehouse: "principal"
        },
        attributes: { size: "250g" }
      },
      {
        id: "variant_3b",
        name: "500g",
        sku: "DEP-DOL-500",
        pricing: {
          baseRetailPrice: 59.9,
          profilePrices: {
            parceiro: 55.9,
            distribuidor: 49.9
          },
          fidelityAdjustmentPercentage: 0
        },
        inventory: {
          sku: "DEP-DOL-500",
          stock: 48,
          reserved: 1,
          warehouse: "principal"
        },
        attributes: { size: "500g" }
      }
    ]
  },
  {
    id: "prod_4",
    slug: "cera-roll-on-mel-suave",
    name: "Cera Roll-On Mel Suave",
    shortDescription: "Aplicação uniforme com visual limpo para atendimentos ágeis.",
    description:
      "Cartucho roll-on com fusão rápida, espalhabilidade controlada e sensorial confortável para protocolos dinâmicos em cabine.",
    category: "Ceras Depilatórias",
    image: "/images/product-roll-on.jpg",
    tags: ["roll-on", "cabine"],
    featured: true,
    seoTitle: "Cera Roll-On Mel Suave | Depilmoni",
    seoDescription: "Praticidade e acabamento uniforme para atendimento profissional.",
    variants: [
      {
        id: "variant_4a",
        name: "100g",
        sku: "DEP-ROL-MEL-100",
        pricing: {
          baseRetailPrice: 29.9,
          profilePrices: {
            parceiro: 27.9,
            distribuidor: 23.9
          },
          fidelityAdjustmentPercentage: 0
        },
        inventory: {
          sku: "DEP-ROL-MEL-100",
          stock: 120,
          reserved: 5,
          warehouse: "principal"
        },
        attributes: { size: "100g" }
      }
    ]
  },
  {
    id: "prod_5",
    slug: "kit-cabine-depilmoni-signature",
    name: "Kit Cabine Depilmoni Signature",
    shortDescription: "Seleção pronta para rotina profissional com margem inteligente.",
    description:
      "Combina cera chocolate, tônico corporal, dolomita e acessórios essenciais para salões, parceiras e distribuidores que precisam de reposição prática.",
    category: "Kits",
    image: "/images/product-kit.jpg",
    tags: ["kit", "signature", "destaque"],
    featured: true,
    seoTitle: "Kit Cabine Depilmoni Signature | Depilmoni",
    seoDescription: "Kit pronto para operação profissional com preço especial.",
    variants: [
      {
        id: "variant_5a",
        name: "Signature",
        sku: "DEP-KIT-SIGN-01",
        pricing: {
          baseRetailPrice: 189.9,
          profilePrices: {
            parceiro: 176.9,
            distribuidor: 159.9
          },
          fidelityAdjustmentPercentage: 4
        },
        inventory: {
          sku: "DEP-KIT-SIGN-01",
          stock: 22,
          reserved: 2,
          warehouse: "principal"
        },
        attributes: { size: "kit" }
      }
    ]
  }
];

export const events: Event[] = [
  {
    id: "event_1",
    slug: "workshop-depilacao-avancada",
    title: "Workshop Depilação Avançada",
    shortDescription: "Técnicas de alto valor percebido para cabine, acabamento e retenção.",
    description:
      "Imersão presencial com a equipe Depilmoni para padronização de protocolos, controle de sensorial, biossegurança e experiência premium em depilação.",
    date: "2026-05-20T09:00:00-03:00",
    location: "São Paulo, SP",
    image: "/images/event-workshop.jpg",
    featured: true,
    instructor: "Equipe Depilmoni",
    seoTitle: "Workshop Depilação Avançada | Eventos Depilmoni",
    seoDescription: "Aprenda com a equipe Depilmoni em uma imersão prática e estratégica.",
    batches: [
      {
        id: "batch_1a",
        name: "1º lote",
        price: 297,
        quantity: 30,
        sold: 28,
        active: false
      },
      {
        id: "batch_1b",
        name: "2º lote",
        price: 397,
        quantity: 40,
        sold: 12,
        active: true
      },
      {
        id: "batch_1c",
        name: "3º lote",
        price: 497,
        quantity: 30,
        sold: 0,
        active: false
      }
    ]
  },
  {
    id: "event_2",
    slug: "curso-empreendedorismo-na-beleza",
    title: "Curso Empreendedorismo na Beleza",
    shortDescription: "Precificação, fidelização, agenda e crescimento rentável para a cabine.",
    description:
      "Curso intensivo para parceiras e distribuidores com foco em vendas consultivas, estrutura comercial, margem, campanhas e encantamento do cliente.",
    date: "2026-06-15T08:00:00-03:00",
    location: "Rio de Janeiro, RJ",
    image: "/images/event-workshop.jpg",
    featured: true,
    instructor: "Time de Expansão Depilmoni",
    seoTitle: "Curso Empreendedorismo na Beleza | Eventos Depilmoni",
    seoDescription: "Capacitação para profissionais que querem crescer com método.",
    batches: [
      {
        id: "batch_2a",
        name: "Lote único",
        price: 597,
        quantity: 50,
        sold: 8,
        active: true
      }
    ]
  }
];

export const banners: Banner[] = [
  {
    id: "banner_1",
    title: "Rotina premium para depilação impecável",
    eyebrow: "Lançamento Signature",
    subtitle: "Da preparação à finalização: uma linha pensada para elevar cabine, ritual e recompra.",
    ctaLabel: "Explorar catálogo",
    ctaHref: "/produtos",
    image: "/images/hero-depilmoni.jpg",
    variant: "hero",
    active: true
  },
  {
    id: "banner_2",
    title: "Cursos e workshops com a equipe da marca",
    subtitle: "Conteúdo técnico e visão comercial para acelerar quem atende e quem distribui.",
    ctaLabel: "Ver eventos",
    ctaHref: "/eventos",
    image: "/images/event-workshop.jpg",
    variant: "feature",
    active: true
  },
  {
    id: "banner_3",
    title: "Promoção relâmpago no kit cabine",
    subtitle: "Estoque controlado, margem protegida e entrega pronta para operação da semana.",
    ctaLabel: "Aproveitar agora",
    ctaHref: "/kits",
    image: "/images/product-kit.jpg",
    variant: "flash",
    active: true
  }
];

export const coupons: Coupon[] = [
  {
    id: "coupon_1",
    code: "BEMVINDA10",
    description: "10% off na primeira compra",
    kind: "percentage",
    value: 10,
    minPurchase: 0,
    active: true,
    expiresAt: "2026-12-31T23:59:59-03:00",
    eligibleProfiles: ["cliente", "parceiro", "distribuidor"]
  },
  {
    id: "coupon_2",
    code: "FRETE50",
    description: "R$ 50 de crédito em frete para pedidos acima de R$ 200",
    kind: "shipping",
    value: 50,
    minPurchase: 200,
    active: true,
    expiresAt: "2026-06-30T23:59:59-03:00",
    eligibleProfiles: ["cliente", "parceiro"]
  }
];

export const promotions: Promotion[] = [
  {
    id: "promotion_1",
    name: "Flash Sale Cera Chocolate",
    kind: "flash-sale",
    productVariantIds: ["variant_1a", "variant_1b"],
    percentageOff: 25,
    active: true,
    startsAt: "2026-04-10T00:00:00-03:00",
    endsAt: "2026-04-18T23:59:59-03:00"
  }
];

export const customerTags: CustomerTag[] = [
  {
    id: "tag_cliente",
    slug: "perfil-cliente",
    label: "Cliente",
    description: "Perfil padrão da loja"
  },
  {
    id: "tag_parceiro",
    slug: "perfil-parceiro",
    label: "Parceiro",
    description: "Perfil com pricing e campanhas comerciais diferenciadas"
  },
  {
    id: "tag_distribuidor",
    slug: "perfil-distribuidor",
    label: "Distribuidor",
    description: "Perfil com regras próprias de composição de benefícios"
  }
];

export const fidelityTags: FidelityTag[] = [
  {
    id: "fidelity_1",
    slug: "fidelidade-gold",
    label: "Fidelidade Gold",
    benefitPercentage: 7,
    manuallyManaged: true
  }
];

export const xpLevels: XPLevel[] = [
  {
    id: "xp_1",
    level: 1,
    name: "Bronze",
    minXP: 0,
    benefits: ["Acesso ao programa de experiências Depilmoni"],
    accentLabel: "Entrada"
  },
  {
    id: "xp_2",
    level: 2,
    name: "Âmbar",
    minXP: 500,
    benefits: ["5% em produtos selecionados", "Frete especial em campanhas"],
    accentLabel: "Crescimento"
  },
  {
    id: "xp_3",
    level: 3,
    name: "Ouro",
    minXP: 1500,
    benefits: ["10% em lançamentos selecionados", "Acesso antecipado a eventos"],
    accentLabel: "Prestígio"
  },
  {
    id: "xp_4",
    level: 4,
    name: "Signature",
    minXP: 5000,
    benefits: ["Condição VIP em experiências", "Brindes especiais", "Prioridade em vagas"],
    accentLabel: "Prime"
  }
];

export const customers: CustomerProfile[] = [
  {
    id: "customer_1",
    name: "Marina Azevedo",
    email: "marina@depilmoni.com.br",
    profile: "cliente",
    tags: ["perfil-cliente", "fidelidade-gold"],
    fidelityTagId: "fidelity_1",
    roles: ["cliente"],
    totalXP: 720,
    unlockedBenefits: ["5% em produtos selecionados", "Frete especial em campanhas"],
    distributorRules: {
      canStackFidelityBenefit: false,
      canUseCoupons: true,
      canUseLevelBenefits: true
    }
  },
  {
    id: "customer_2",
    name: "Larissa Studios",
    email: "larissa@studio.com.br",
    profile: "parceiro",
    tags: ["perfil-parceiro"],
    fidelityTagId: null,
    roles: ["cliente"],
    totalXP: 1320,
    unlockedBenefits: ["5% em produtos selecionados", "Frete especial em campanhas"],
    distributorRules: {
      canStackFidelityBenefit: false,
      canUseCoupons: true,
      canUseLevelBenefits: true
    }
  },
  {
    id: "customer_3",
    name: "Distribuidora Vale Bronze",
    email: "compras@valebronze.com.br",
    profile: "distribuidor",
    tags: ["perfil-distribuidor"],
    fidelityTagId: null,
    roles: ["cliente"],
    totalXP: 2500,
    unlockedBenefits: ["10% em lançamentos selecionados", "Acesso antecipado a eventos"],
    distributorRules: {
      canStackFidelityBenefit: false,
      canUseCoupons: false,
      canUseLevelBenefits: true
    }
  }
];

export const landingPages: LandingPage[] = [
  {
    id: "lp_home",
    slug: "home",
    title: "Home",
    seoTitle: "Depilmoni | Beleza, Depilação e Educação Profissional",
    seoDescription:
      "Storefront premium da Depilmoni com produtos, kits, eventos, fidelidade e experiência completa para clientes, parceiros e distribuidores.",
    blocks: [
      {
        blockType: "HeroBanner",
        title: "A delicadeza de um ritual, a precisão de uma marca profissional.",
        subtitle:
          "Produtos para depilação, preparo e finalização com linguagem premium, compra fluida e vantagens configuráveis para cada perfil.",
        ctaLabel: "Comprar produtos",
        ctaHref: "/produtos",
        secondaryCtaLabel: "Conhecer eventos",
        secondaryCtaHref: "/eventos",
        image: "/images/hero-depilmoni.jpg"
      },
      {
        blockType: "BenefitBar",
        items: [
          {
            title: "Perfil inteligente",
            description: "Preço por cliente, parceiro ou distribuidor com regras configuráveis."
          },
          {
            title: "Mercado Pago ready",
            description: "Checkout mockado com abstração pronta para cartão, Pix e parcelamento."
          },
          {
            title: "Melhor Envio ready",
            description: "Cálculo de frete com adapter desacoplado e fluxo preparado para produção."
          }
        ]
      },
      {
        blockType: "ProductCarousel",
        title: "Destaques de cabine e revenda",
        description: "Os produtos mais procurados para reposição rápida e experiências premium.",
        productIds: ["prod_1", "prod_2", "prod_4", "prod_5"]
      },
      {
        blockType: "CategoryGrid",
        title: "Escolha pela intenção de uso",
        description: "Categorias desenhadas para facilitar recompra, revenda e operação profissional.",
        items: [
          {
            title: "Ceras",
            href: "/produtos",
            image: "/images/product-cera-chocolate.jpg",
            description: "Linha premium para diferentes protocolos."
          },
          {
            title: "Tônicos",
            href: "/produtos",
            image: "/images/product-tonico.jpg",
            description: "Calma, hidrata e reforça a experiência."
          },
          {
            title: "Dolomita",
            href: "/produtos",
            image: "/images/product-dolomita.jpg",
            description: "Preparação técnica com acabamento limpo."
          },
          {
            title: "Kits",
            href: "/kits",
            image: "/images/product-kit.jpg",
            description: "Composição pronta para margem e agilidade."
          }
        ]
      },
      {
        blockType: "EventHighlight",
        title: "Aprendizado que vira crescimento comercial",
        description: "Eventos com lotes, tickets QR Code e gestão completa no backoffice.",
        eventId: "event_1"
      },
      {
        blockType: "TestimonialSection",
        title: "Quem já vive a experiência Depilmoni",
        testimonials: [
          {
            name: "Mariana Souza",
            role: "Cliente fiel",
            quote: "A navegação transmite exatamente o cuidado que sinto nos produtos."
          },
          {
            name: "Studio Essenza",
            role: "Parceiro",
            quote: "O pricing por perfil ficou claro e o pedido foi objetivo até no mobile."
          },
          {
            name: "Distribuidora Top Bronze",
            role: "Distribuidor",
            quote: "A combinação de catálogo, educação e operação centralizada faz diferença na revenda."
          }
        ]
      },
      {
        blockType: "RichContentSection",
        title: "Uma plataforma para vender, educar e cultivar recorrência.",
        eyebrow: "Admin por blocos",
        body: [
          "A homepage nasce totalmente editável a partir do Payload, mantendo o storefront elegante sem acoplamento ao conteúdo.",
          "O domínio já contempla estoque, pricing por perfil, fidelidade manual, cupons, eventos com lotes e jornada de XP."
        ],
        ctaLabel: "Ver minha conta",
        ctaHref: "/minha-conta"
      },
      {
        blockType: "FAQSection",
        title: "Perguntas frequentes",
        questions: [
          {
            question: "Posso comprar produto e ingresso no mesmo fluxo?",
            answer: "Sim. O carrinho mockado aceita itens físicos e tickets, tratando frete apenas para produtos."
          },
          {
            question: "Como a fidelidade funciona?",
            answer: "A fidelidade é aplicada como tag manual pela gerência e respeita as regras configuradas do perfil."
          },
          {
            question: "O distribuidor acumula tudo automaticamente?",
            answer: "Não. A composição de fidelidade, cupons e benefícios por nível é controlada por regras configuráveis."
          }
        ]
      },
      {
        blockType: "CTASection",
        title: "Transforme compra recorrente em experiência de marca.",
        description: "Comece pelo catálogo, explore os eventos e acompanhe seus benefícios em tempo real.",
        ctaLabel: "Entrar na plataforma",
        ctaHref: "/minha-conta"
      }
    ]
  }
];

export const blogPosts: BlogPost[] = [
  {
    id: "blog_1",
    slug: "como-elevar-a-experiencia-da-depilacao",
    title: "Como elevar a experiência da depilação com uma rotina premium",
    excerpt: "Pequenos detalhes de preparo, sensorial e finalização que aumentam o valor percebido.",
    coverImage: "/images/hero-depilmoni.jpg",
    category: "Experiência",
    publishedAt: "2026-04-10T09:00:00-03:00",
    author: "Equipe Depilmoni"
  },
  {
    id: "blog_2",
    slug: "precificacao-para-parceiras-e-distribuidores",
    title: "Precificação por perfil: como proteger margem sem perder atratividade",
    excerpt: "Entenda como cliente, parceiro e distribuidor exigem estratégias comerciais diferentes.",
    coverImage: "/images/product-kit.jpg",
    category: "Negócios",
    publishedAt: "2026-04-12T09:00:00-03:00",
    author: "Equipe de Expansão"
  }
];

export const xpTransactions: XPTransaction[] = [
  {
    id: "xpt_1",
    customerId: "customer_1",
    source: "pedido",
    amount: 520,
    occurredAt: "2026-03-12T14:00:00-03:00",
    referenceId: "order_1"
  },
  {
    id: "xpt_2",
    customerId: "customer_1",
    source: "evento",
    amount: 200,
    occurredAt: "2026-04-01T15:30:00-03:00",
    referenceId: "ticket_1"
  }
];

export const orders: PurchaseOrder[] = [
  {
    id: "order_1",
    customerId: "customer_1",
    status: "entregue",
    createdAt: "2026-03-12T14:00:00-03:00",
    items: [
      {
        id: "line_prod_1",
        kind: "product",
        productId: "prod_1",
        variantId: "variant_1a",
        quantity: 2
      }
    ],
    summary: {
      lines: [
        {
          itemId: "variant_1a",
          name: "Cera Depilatória Chocolate Premium 500g",
          quantity: 2,
          baseUnitPrice: 89.9,
          profileAdjustedUnitPrice: 89.9,
          fidelityDiscount: 12.59,
          promotionDiscount: 44.95,
          couponDiscount: 0,
          total: 122.26
        }
      ],
      subtotal: 179.8,
      profileSavings: 0,
      fidelitySavings: 12.59,
      promotionSavings: 44.95,
      couponSavings: 0,
      shipping: 0,
      total: 122.26
    },
    xpEarned: 520
  }
];

export const tickets: Ticket[] = [
  {
    id: "ticket_1",
    eventId: "event_1",
    eventTitle: "Workshop Depilação Avançada",
    customerId: "customer_1",
    batchId: "batch_1b",
    batchName: "2º lote",
    qrCode: "DEPILMONI:TICKET:ticket_1",
    status: "confirmado",
    checkedInAt: null,
    purchaseDate: "2026-04-01T15:30:00-03:00"
  }
];
