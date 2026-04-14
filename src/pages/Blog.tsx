import Layout from '@/components/layout/Layout';
import { PageTransition, Animated, StaggerContainer, StaggerItem } from '@/components/animations/Animated';
import { motion } from 'framer-motion';

const blogPosts = [
  {
    title: 'Como escolher a cera ideal para seu tipo de pele',
    excerpt: 'Cada tipo de pele exige um cuidado diferente. Descubra qual cera Depilmoni é perfeita para você.',
    date: '10/04/2026',
    category: 'Dicas',
  },
  {
    title: '5 erros comuns na depilação profissional',
    excerpt: 'Evite esses erros e garanta resultados impecáveis para suas clientes.',
    date: '02/04/2026',
    category: 'Profissional',
  },
  {
    title: 'Cuidados pós-depilação: guia completo',
    excerpt: 'Tudo que você precisa saber para manter a pele saudável e bonita após a depilação.',
    date: '25/03/2026',
    category: 'Cuidados',
  },
];

const BlogPage = () => (
  <Layout>
    <PageTransition>
      <div className="container py-12 max-w-3xl mx-auto">
        <Animated>
          <h1 className="font-display text-4xl font-bold mb-2">Blog</h1>
          <p className="text-muted-foreground mb-10">Dicas, tutoriais e novidades do mundo da depilação</p>
        </Animated>
        <StaggerContainer className="space-y-6">
          {blogPosts.map((post) => (
            <StaggerItem key={post.title}>
              <motion.article
                whileHover={{ y: -3, boxShadow: '0 8px 30px -12px rgba(0,0,0,0.12)' }}
                transition={{ duration: 0.25 }}
                className="rounded-xl border border-border bg-card p-6 cursor-pointer"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="rounded-full bg-copper/10 px-3 py-0.5 text-xs font-medium text-copper">{post.category}</span>
                  <span className="text-xs text-muted-foreground">{post.date}</span>
                </div>
                <h2 className="font-display text-xl font-semibold">{post.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{post.excerpt}</p>
              </motion.article>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </PageTransition>
  </Layout>
);

export default BlogPage;