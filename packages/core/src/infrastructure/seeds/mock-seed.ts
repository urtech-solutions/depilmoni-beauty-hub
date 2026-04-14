import type { MockDatabase } from "../../domain/models";

const now = new Date();
const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
const nextMonth = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();
const twoMonthsAhead = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000).toISOString();

export const defaultCustomerId = "customer_client_maria";

export const createSeedData = (): MockDatabase => ({
  products: [
    {
      id: "product_cera_chocolate",
      slug: "cera-depilatoria-chocolate",
      name: "Cera Depilatoria Chocolate",
      description:
        "Formula premium com extrato de cacau para depilacao acolhedora, uniforme e de acabamento profissional.",
      shortDescription: "Textura aveludada com sensorial sofisticado.",
      category: "Ceras Depilatorias",
      tags: ["cera", "premium", "chocolate"],
      media: ["/images/product-cera-chocolate.jpg"],
      featured: true,
      isKit: false,
      variantIds: ["variant_cera_chocolate_500", "variant_cera_chocolate_1000"]
    },
    {
      id: "product_tonico_pos",
      slug: "tonico-corporal-pos-depilacao",
      name: "Tonico Corporal Pos-Depilacao",
      description:
        "Tonico com aloe vera, camomila e niacinamida para acalmar, refrescar e uniformizar a pele apos o procedimento.",
      shortDescription: "Cuidado calmante e elegante no pos-procedimento.",
      category: "Tonicos",
      tags: ["tonico", "pos-depilacao"],
      media: ["/images/product-tonico.jpg"],
      featured: true,
      isKit: false,
      variantIds: ["variant_tonico_200"]
    },
    {
      id: "product_dolomita",
      slug: "dolomita-profissional",
      name: "Dolomita Profissional",
      description:
        "Dolomita de alta pureza para preparo da pele, controle de oleosidade e acabamento refinado em cabines e saloes.",
      shortDescription: "Base mineral para preparar a pele com seguranca.",
      category: "Preparacao",
      tags: ["dolomita", "profissional"],
      media: ["/images/product-dolomita.jpg"],
      featured: false,
      isKit: false,
      variantIds: ["variant_dolomita_250", "variant_dolomita_500"]
    },
    {
      id: "product_roll_on",
      slug: "cera-roll-on-mel",
      name: "Cera Roll-On Mel",
      description:
        "Roll-on pratico com toque de mel para aplicacao uniforme e rotina agil em atendimentos de alta rotatividade.",
      shortDescription: "Aplicacao pratica para uso profissional e home care.",
      category: "Ceras Depilatorias",
      tags: ["roll-on", "mel"],
      media: ["/images/product-roll-on.jpg"],
      featured: true,
      isKit: false,
      variantIds: ["variant_roll_on_100"]
    },
    {
      id: "product_kit_complete",
      slug: "kit-depilacao-completo",
      name: "Kit Depilacao Completo",
      description:
        "Selecao com cera, dolomita, tonico e acessorios para uma rotina completa com curadoria Depilmoni.",
      shortDescription: "Kit premium para iniciar ou elevar o atendimento.",
      category: "Kits",
      tags: ["kit", "presente", "profissional"],
      media: ["/images/product-kit.jpg"],
      featured: true,
      isKit: true,
      variantIds: ["variant_kit_standard"]
    }
  ],
  variants: [
    {
      id: "variant_cera_chocolate_500",
      productId: "product_cera_chocolate",
      name: "500g",
      sku: "CER-CHO-500",
      basePrice: 89.9,
      profilePrices: {
        partner: 78.9,
        distributor: 69.9
      },
      inventoryId: "inventory_cera_chocolate_500"
    },
    {
      id: "variant_cera_chocolate_1000",
      productId: "product_cera_chocolate",
      name: "1kg",
      sku: "CER-CHO-1000",
      basePrice: 149.9,
      profilePrices: {
        partner: 132.9,
        distributor: 119.9
      },
      inventoryId: "inventory_cera_chocolate_1000"
    },
    {
      id: "variant_tonico_200",
      productId: "product_tonico_pos",
      name: "200ml",
      sku: "TON-POS-200",
      basePrice: 49.9,
      profilePrices: {
        partner: 44.9,
        distributor: 39.9
      },
      inventoryId: "inventory_tonico_200"
    },
    {
      id: "variant_dolomita_250",
      productId: "product_dolomita",
      name: "250g",
      sku: "DOL-250",
      basePrice: 34.9,
      profilePrices: {
        partner: 31.9,
        distributor: 28.9
      },
      inventoryId: "inventory_dolomita_250"
    },
    {
      id: "variant_dolomita_500",
      productId: "product_dolomita",
      name: "500g",
      sku: "DOL-500",
      basePrice: 59.9,
      profilePrices: {
        partner: 54.9,
        distributor: 49.9
      },
      inventoryId: "inventory_dolomita_500"
    },
    {
      id: "variant_roll_on_100",
      productId: "product_roll_on",
      name: "100g",
      sku: "ROL-MEL-100",
      basePrice: 29.9,
      profilePrices: {
        partner: 26.9,
        distributor: 22.9
      },
      inventoryId: "inventory_roll_on_100"
    },
    {
      id: "variant_kit_standard",
      productId: "product_kit_complete",
      name: "Edicao Signature",
      sku: "KIT-DPM-001",
      basePrice: 189.9,
      profilePrices: {
        partner: 175.9,
        distributor: 159.9
      },
      inventoryId: "inventory_kit_standard"
    }
  ],
  inventory: [
    {
      id: "inventory_cera_chocolate_500",
      sku: "CER-CHO-500",
      quantityAvailable: 42,
      quantityReserved: 0,
      reorderLevel: 8
    },
    {
      id: "inventory_cera_chocolate_1000",
      sku: "CER-CHO-1000",
      quantityAvailable: 27,
      quantityReserved: 0,
      reorderLevel: 5
    },
    {
      id: "inventory_tonico_200",
      sku: "TON-POS-200",
      quantityAvailable: 61,
      quantityReserved: 0,
      reorderLevel: 10
    },
    {
      id: "inventory_dolomita_250",
      sku: "DOL-250",
      quantityAvailable: 95,
      quantityReserved: 0,
      reorderLevel: 15
    },
    {
      id: "inventory_dolomita_500",
      sku: "DOL-500",
      quantityAvailable: 54,
      quantityReserved: 0,
      reorderLevel: 10
    },
    {
      id: "inventory_roll_on_100",
      sku: "ROL-MEL-100",
      quantityAvailable: 77,
      quantityReserved: 0,
      reorderLevel: 12
    },
    {
      id: "inventory_kit_standard",
      sku: "KIT-DPM-001",
      quantityAvailable: 18,
      quantityReserved: 0,
      reorderLevel: 4
    }
  ],
  promotions: [
    {
      id: "promotion_flash_001",
      name: "Promocao Relampago Chocolate",
      scope: "product",
      discountType: "percentage",
      value: 18,
      startsAt: now.toISOString(),
      endsAt: tomorrow,
      active: true,
      applicableProductIds: ["product_cera_chocolate"],
      applicableCategories: []
    }
  ],
  coupons: [
    {
      id: "coupon_bemvinda10",
      code: "BEMVINDA10",
      discountType: "percentage",
      value: 10,
      minPurchase: 50,
      active: true,
      startsAt: now.toISOString(),
      endsAt: twoMonthsAhead,
      combinableWithPromotions: true,
      combinableWithFidelity: true
    },
    {
      id: "coupon_frete50",
      code: "FRETE50",
      discountType: "fixed",
      value: 50,
      minPurchase: 200,
      active: true,
      startsAt: now.toISOString(),
      endsAt: nextMonth,
      combinableWithPromotions: true,
      combinableWithFidelity: true
    }
  ],
  customerProfiles: [
    {
      id: "customer_client_maria",
      name: "Maria Silva",
      email: "maria@depilmoni.test",
      role: "authenticated-customer",
      profileType: "client",
      tags: ["tag_profile_client", "tag_fidelity_signature"],
      fidelityTagIds: ["fidelity_signature"],
      xpBalance: 720,
      levelId: "xp_level_prata",
      benefitsUnlocked: ["5% em produtos selecionados", "frete gracioso acima de R$ 200"],
      orderIds: ["order_seed_001"],
      ticketIds: ["ticket_seed_001"]
    },
    {
      id: "customer_partner_juliana",
      name: "Juliana Rocha",
      email: "juliana@depilmoni.test",
      role: "authenticated-customer",
      profileType: "partner",
      tags: ["tag_profile_partner"],
      fidelityTagIds: ["fidelity_signature"],
      xpBalance: 1240,
      levelId: "xp_level_prata",
      benefitsUnlocked: ["Tabela especial parceiro", "campanhas antecipadas"],
      orderIds: [],
      ticketIds: []
    },
    {
      id: "customer_distributor_bella",
      name: "Bella Distribuicao",
      email: "distribuidor@depilmoni.test",
      role: "authenticated-customer",
      profileType: "distributor",
      tags: ["tag_profile_distributor"],
      fidelityTagIds: ["fidelity_signature"],
      xpBalance: 2200,
      levelId: "xp_level_ouro",
      benefitsUnlocked: ["Tabela distribuidor", "pedido assistido"],
      orderIds: [],
      ticketIds: []
    }
  ],
  customerTags: [
    {
      id: "tag_profile_client",
      slug: "cliente",
      name: "Cliente",
      kind: "profile"
    },
    {
      id: "tag_profile_partner",
      slug: "parceiro",
      name: "Parceiro",
      kind: "profile"
    },
    {
      id: "tag_profile_distributor",
      slug: "distribuidor",
      name: "Distribuidor",
      kind: "profile"
    },
    {
      id: "tag_fidelity_signature",
      slug: "fidelidade-signature",
      name: "Fidelidade Signature",
      kind: "fidelity"
    }
  ],
  fidelityTags: [
    {
      id: "fidelity_signature",
      slug: "signature",
      name: "Signature",
      applicableProfiles: ["client", "partner", "distributor"],
      allowDistributorStacking: false,
      benefits: [
        {
          id: "benefit_signature_discount",
          label: "5% adicional em itens selecionados",
          type: "percentage",
          value: 5
        },
        {
          id: "benefit_signature_shipping",
          label: "Curadoria de frete premium",
          type: "free-shipping"
        }
      ]
    }
  ],
  xpTransactions: [
    {
      id: "xp_seed_001",
      customerId: "customer_client_maria",
      amount: 180,
      source: "order-paid",
      referenceId: "order_seed_001",
      createdAt: now.toISOString()
    }
  ],
  xpLevels: [
    {
      id: "xp_level_bronze",
      level: 1,
      name: "Bronze",
      minXP: 0,
      benefits: ["Acesso ao programa de XP Depilmoni"]
    },
    {
      id: "xp_level_prata",
      level: 2,
      name: "Prata",
      minXP: 500,
      benefits: ["5% em produtos selecionados", "preview de promocoes relampago"]
    },
    {
      id: "xp_level_ouro",
      level: 3,
      name: "Ouro",
      minXP: 1500,
      benefits: ["Frete especial", "venda antecipada de eventos"]
    },
    {
      id: "xp_level_diamante",
      level: 4,
      name: "Diamante",
      minXP: 5000,
      benefits: ["Atendimento VIP", "beneficios exclusivos por campanha"]
    }
  ],
  events: [
    {
      id: "event_workshop_advanced",
      slug: "workshop-depilacao-avancada",
      title: "Workshop Depilacao Avancada",
      summary: "Tecnicas de depilacao premium com a equipe Depilmoni.",
      description:
        "Um dia inteiro de imersao com foco em tecnica, acabamento, ergonomia de atendimento e experiencia premium para clientes e parceiras.",
      startsAt: "2026-05-20T09:00:00.000Z",
      endsAt: "2026-05-20T17:00:00.000Z",
      location: "Sao Paulo, SP",
      instructor: "Equipe Depilmoni",
      coverImage: "/images/event-workshop.jpg",
      featured: true,
      batches: [
        {
          id: "batch_workshop_1",
          eventId: "event_workshop_advanced",
          name: "1o lote",
          price: 297,
          quantity: 30,
          sold: 30,
          status: "sold-out"
        },
        {
          id: "batch_workshop_2",
          eventId: "event_workshop_advanced",
          name: "2o lote",
          price: 397,
          quantity: 40,
          sold: 12,
          status: "active"
        }
      ],
      faq: [
        {
          question: "O ingresso gera QR Code?",
          answer: "Sim. Cada ticket confirmado recebe um QR Code unico para check-in."
        },
        {
          question: "Posso transferir a vaga?",
          answer: "A transferencia fica preparada para fluxo operacional futuro, mas no mock o titular permanece fixo."
        }
      ]
    },
    {
      id: "event_business_beauty",
      slug: "curso-empreendedorismo-beleza",
      title: "Curso Empreendedorismo na Beleza",
      summary: "Gestao, precificacao e posicionamento para crescer no segmento.",
      description:
        "Curso intensivo para profissionais e distribuidoras que querem estruturar vendas, margem, fidelizacao e calendario comercial com consistencia.",
      startsAt: "2026-06-15T08:00:00.000Z",
      endsAt: "2026-06-15T18:00:00.000Z",
      location: "Rio de Janeiro, RJ",
      instructor: "Equipe Depilmoni",
      coverImage: "/images/event-workshop.jpg",
      featured: true,
      batches: [
        {
          id: "batch_business_unique",
          eventId: "event_business_beauty",
          name: "Lote unico",
          price: 597,
          quantity: 50,
          sold: 9,
          status: "active"
        }
      ],
      faq: [
        {
          question: "Quem pode participar?",
          answer: "Clientes, parceiras e distribuidoras que desejam profissionalizar operacao e vendas."
        }
      ]
    }
  ],
  tickets: [
    {
      id: "ticket_seed_001",
      eventId: "event_workshop_advanced",
      eventTitle: "Workshop Depilacao Avancada",
      batchId: "batch_workshop_2",
      orderId: "order_seed_001",
      customerId: "customer_client_maria",
      attendeeName: "Maria Silva",
      qrCode: "data:image/png;base64,mock-seed-ticket",
      status: "confirmed",
      checkInAt: null
    }
  ],
  banners: [
    {
      id: "banner_hero_store",
      eyebrow: "Linha assinatura",
      title: "Depilacao premium para rotinas que pedem cuidado e margem.",
      subtitle: "Ceras, tonicos e dolomita com posicionamento sofisticado para varejo e profissionais.",
      cta: {
        label: "Explorar produtos",
        href: "/produtos"
      },
      image: "/images/hero-depilmoni.jpg",
      active: true
    },
    {
      id: "banner_events",
      eyebrow: "Eventos Depilmoni",
      title: "Aprenda, venda melhor e eleve a experiencia da sua cliente.",
      subtitle: "Workshops e cursos com lotes dinâmicos, tickets e check-in pronto para operacao.",
      cta: {
        label: "Ver eventos",
        href: "/eventos"
      },
      image: "/images/event-workshop.jpg",
      active: true
    },
    {
      id: "banner_flash_sale",
      eyebrow: "Relampago da semana",
      title: "Chocolate com vantagem real para o giro do catalogo.",
      subtitle: "Promocao ativa ja conectada ao motor de precificacao mockado.",
      cta: {
        label: "Aproveitar agora",
        href: "/produtos/cera-depilatoria-chocolate"
      },
      image: "/images/product-cera-chocolate.jpg",
      active: true
    }
  ],
  landingPages: [
    {
      id: "landing_home",
      slug: "/",
      title: "Depilmoni Beauty Hub",
      seoTitle: "Depilmoni | E-commerce premium de beleza e depilacao",
      seoDescription:
        "Storefront premium com produtos, eventos, portal de clientes e motor de gamificacao para a marca Depilmoni.",
      blocks: [
        {
          blockType: "HeroBanner",
          eyebrow: "Curadoria premium Depilmoni",
          title: "Beleza profissional com calor, tecnica e valor de marca.",
          subtitle:
            "Uma experiencia de compra pensada para clientes, parceiras e distribuidoras com conteudo, eventos e beneficios em um unico ecossistema.",
          cta: {
            label: "Comprar agora",
            href: "/produtos"
          },
          secondaryCta: {
            label: "Ver eventos",
            href: "/eventos"
          },
          image: "/images/hero-depilmoni.jpg",
          ambienceNotes: ["marrom chocolate", "cobre acetinado", "toque editorial"]
        },
        {
          blockType: "BenefitBar",
          items: [
            {
              title: "Frete inteligente",
              description: "Abstracao pronta para Melhor Envio com calculo no checkout."
            },
            {
              title: "Parcelamento",
              description: "Fluxo mockado preparado para Mercado Pago e Pix."
            },
            {
              title: "XP e beneficios",
              description: "Pedidos pagos alimentam niveis e beneficios configuraveis."
            }
          ]
        },
        {
          blockType: "ProductCarousel",
          title: "Destaques com margem e desejo",
          subtitle: "Produtos escolhidos para elevar o ticket medio e a experiencia da rotina.",
          collection: "featured"
        },
        {
          blockType: "CategoryGrid",
          title: "Colecoes para cada momento da jornada",
          subtitle: "Monte vitrines por necessidade, perfil e ritual de uso.",
          items: [
            {
              title: "Ceras Depilatorias",
              description: "Performance premium com sensorial marcante.",
              href: "/produtos",
              image: "/images/product-cera-chocolate.jpg"
            },
            {
              title: "Tonicos Corporais",
              description: "Recuperacao e acabamento para o pos-procedimento.",
              href: "/produtos",
              image: "/images/product-tonico.jpg"
            },
            {
              title: "Dolomita",
              description: "Preparacao e refinamento da pele antes da sessao.",
              href: "/produtos",
              image: "/images/product-dolomita.jpg"
            },
            {
              title: "Kits",
              description: "Curadoria pronta para presente ou reposicao profissional.",
              href: "/kits",
              image: "/images/product-kit.jpg"
            }
          ]
        },
        {
          blockType: "EventHighlight",
          title: "Eventos que aproximam marca, tecnica e comunidade",
          subtitle: "Lotes, check-in e tickets preparados para a operacao.",
          eventSlugs: ["workshop-depilacao-avancada", "curso-empreendedorismo-beleza"]
        },
        {
          blockType: "TestimonialSection",
          title: "Quem vende e aplica confia na Depilmoni",
          subtitle: "Depoimentos para reforcar prova social no storefront.",
          testimonials: [
            {
              name: "Carla Menezes",
              role: "Esteticista parceira",
              quote:
                "A linha de chocolate virou minha assinatura de cabine. O atendimento ficou mais premium e o retorno das clientes subiu."
            },
            {
              name: "Elaine Costa",
              role: "Distribuidora regional",
              quote:
                "A clareza de tabela por perfil e o controle de campanha fazem diferenca real para escalar sem confusao."
            }
          ]
        },
        {
          blockType: "RichContentSection",
          title: "Conteudo e comercio trabalhando juntos",
          content: [
            "A homepage foi preparada para ser inteiramente montada por blocos no Payload, sem tocar em codigo.",
            "A arquitetura mockada ja separa catalogo, precificacao, experiencia do usuario e adapters para integracoes reais."
          ],
          metrics: [
            {
              label: "Produtos seedados",
              value: "5"
            },
            {
              label: "Eventos ativos",
              value: "2"
            },
            {
              label: "Perfis de compra",
              value: "3"
            }
          ]
        },
        {
          blockType: "FAQSection",
          title: "Perguntas frequentes",
          items: [
            {
              question: "A homepage e realmente editavel pelo admin?",
              answer: "Sim. O modelo LandingPage recebe blocos tipados com ordem livre para montagem da home."
            },
            {
              question: "Como funciona o XP?",
              answer: "Cada pedido pago gera XP, atualiza a barra de progresso e libera beneficios por nivel."
            },
            {
              question: "O distribuidor recebe tudo automaticamente?",
              answer: "Nao. O stacking de fidelidade para distribuidor e configuravel pela regra de negocio."
            }
          ]
        },
        {
          blockType: "CTASection",
          title: "Estruture a operacao e lance o MVP com seguranca.",
          subtitle: "Storefront, CMS, comercio e gamificacao na mesma espinha dorsal.",
          cta: {
            label: "Acessar minha conta",
            href: "/minha-conta"
          },
          secondaryCta: {
            label: "Ver backlog tecnico",
            href: "/blog"
          }
        }
      ]
    }
  ],
  blogPosts: [
    {
      id: "blog_001",
      slug: "como-posicionar-cera-premium",
      title: "Como posicionar uma cera premium sem competir por preco",
      excerpt: "Estrutura de margem, percepcao de valor e experiencia de atendimento para elevar a venda.",
      content: [
        "Uma linha premium precisa de historia, narrativa e consistencia visual para sustentar margem.",
        "No ecossistema Depilmoni, catalogo, eventos e conteudo reforcam a mesma promessa de valor."
      ],
      coverImage: "/images/product-cera-chocolate.jpg",
      publishedAt: now.toISOString(),
      tags: ["conteudo", "posicionamento"]
    },
    {
      id: "blog_002",
      slug: "ritual-pos-depilacao-que-fideliza",
      title: "O ritual pos-depilacao que melhora recompra e indicacao",
      excerpt: "Tonicos, orientacao e acompanhamento para transformar cuidado em relacionamento.",
      content: [
        "A jornada nao termina na venda: o ritual de uso aumenta recompra e confianca.",
        "Com automacao e CRM, o portal da cliente pode reforcar a rotina e os beneficios por nivel."
      ],
      coverImage: "/images/product-tonico.jpg",
      publishedAt: now.toISOString(),
      tags: ["retencao", "ritual"]
    }
  ],
  orders: [
    {
      id: "order_seed_001",
      customerId: "customer_client_maria",
      code: "DPM-SEED01",
      status: "paid",
      items: [
        {
          type: "product",
          productId: "product_cera_chocolate",
          variantId: "variant_cera_chocolate_500",
          quantity: 2
        }
      ],
      subtotal: 179.8,
      profileDiscount: 0,
      fidelityDiscount: 8.99,
      promotionDiscount: 16.36,
      couponDiscount: 0,
      shippingAmount: 18.9,
      total: 173.35,
      xpEarned: 173,
      createdAt: now.toISOString()
    }
  ]
});
