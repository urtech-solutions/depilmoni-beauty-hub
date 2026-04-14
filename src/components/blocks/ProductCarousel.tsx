import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { products, formatCurrency, type Product } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
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

const ProductCard = ({ product }: { product: Product }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4 }}
    className="group"
  >
    <Link to={`/produtos/${product.slug}`} className="block">
      <div className="aspect-square overflow-hidden rounded-lg bg-warm-beige">
        <img
          src={productImages[product.id]}
          alt={product.name}
          loading="lazy"
          width={800}
          height={800}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="mt-3">
        <p className="text-xs font-medium uppercase tracking-wider text-copper">{product.category}</p>
        <h3 className="mt-1 font-display text-lg font-semibold leading-tight">{product.name}</h3>
        <div className="mt-2 flex items-center gap-2">
          <span className="font-semibold text-foreground">{formatCurrency(product.price)}</span>
          {product.compareAtPrice && (
            <span className="text-sm text-muted-foreground line-through">
              {formatCurrency(product.compareAtPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  </motion.div>
);

const ProductCarousel = () => {
  const featured = products.filter((p) => p.featured);

  return (
    <section className="py-16">
      <div className="container">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-display text-3xl font-bold">Destaques</h2>
            <p className="mt-1 text-muted-foreground">Os produtos mais amados pelas nossas clientes</p>
          </div>
          <Link to="/produtos">
            <Button variant="outline">Ver todos</Button>
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:gap-6">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
};

export { ProductCard };
export default ProductCarousel;
