import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import { products, formatCurrency } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Minus, Plus } from 'lucide-react';
import { PageTransition, Animated } from '@/components/animations/Animated';
import productCeraChocolate from '@/assets/product-cera-chocolate.jpg';
import productTonico from '@/assets/product-tonico.jpg';
import productDolomita from '@/assets/product-dolomita.jpg';
import productRollOn from '@/assets/product-roll-on.jpg';
import productKit from '@/assets/product-kit.jpg';

const productImages: Record<string, string> = {
  '1': productCeraChocolate,
  '2': productTonico,
  '3': productDolomita,
  '4': productRollOn,
  '5': productKit,
};

const ProductDetail = () => {
  const { slug } = useParams();
  const product = products.find((p) => p.slug === slug);
  const [qty, setQty] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(0);

  if (!product) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <h1 className="font-display text-2xl">Produto não encontrado</h1>
        </div>
      </Layout>
    );
  }

  const variant = product.variants[selectedVariant];

  return (
    <Layout>
      <PageTransition>
        <div className="container py-12">
          <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
            <Animated variant="slideRight">
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.4 }}
                className="aspect-square overflow-hidden rounded-xl bg-warm-beige"
              >
                <img
                  src={productImages[product.id]}
                  alt={product.name}
                  width={800}
                  height={800}
                  className="h-full w-full object-cover"
                />
              </motion.div>
            </Animated>
            <Animated variant="slideLeft" delay={0.15}>
              <div className="flex flex-col justify-center">
                <p className="text-sm font-medium uppercase tracking-wider text-copper">{product.category}</p>
                <h1 className="mt-2 font-display text-3xl font-bold md:text-4xl">{product.name}</h1>
                <p className="mt-4 text-muted-foreground leading-relaxed">{product.description}</p>

                {product.variants.length > 1 && (
                  <div className="mt-6">
                    <p className="text-sm font-medium mb-2">Variante</p>
                    <div className="flex gap-2">
                      {product.variants.map((v, i) => (
                        <motion.button
                          key={v.id}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => setSelectedVariant(i)}
                          className={`rounded-md border px-4 py-2 text-sm font-medium transition-colors ${
                            i === selectedVariant
                              ? 'border-copper bg-copper/10 text-foreground'
                              : 'border-border text-muted-foreground hover:border-copper/40'
                          }`}
                        >
                          {v.name}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-6 flex items-center gap-3">
                  <motion.span
                    key={variant.price}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-2xl font-bold"
                  >
                    {formatCurrency(variant.price)}
                  </motion.span>
                  {product.compareAtPrice && (
                    <span className="text-lg text-muted-foreground line-through">
                      {formatCurrency(product.compareAtPrice)}
                    </span>
                  )}
                </div>

                <div className="mt-6 flex items-center gap-4">
                  <div className="flex items-center rounded-md border border-border">
                    <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-2 text-muted-foreground hover:text-foreground">
                      <Minus size={16} />
                    </button>
                    <span className="w-10 text-center text-sm font-medium">{qty}</span>
                    <button onClick={() => setQty(qty + 1)} className="p-2 text-muted-foreground hover:text-foreground">
                      <Plus size={16} />
                    </button>
                  </div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} className="flex-1">
                    <Button variant="hero" size="lg" className="w-full gap-2">
                      <ShoppingBag size={18} />
                      Adicionar ao Carrinho
                    </Button>
                  </motion.div>
                </div>

                <p className="mt-4 text-xs text-muted-foreground">
                  {variant.inventory > 0 ? `${variant.inventory} unidades em estoque` : 'Esgotado'}
                </p>
              </div>
            </Animated>
          </div>
        </div>
      </PageTransition>
    </Layout>
  );
};

export default ProductDetail;