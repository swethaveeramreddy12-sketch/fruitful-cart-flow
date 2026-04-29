import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { Product } from "@/data/products";
import { useCart, formatINR } from "@/context/CartContext";
import { toast } from "sonner";

const ProductCard = ({ product }: { product: Product }) => {
  const { add } = useCart();

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl bg-card shadow-soft transition-all duration-500 hover:-translate-y-1 hover:shadow-card">
      <Link to={`/product/${product.id}`} className="relative block aspect-square overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={`${product.name} mangoes from ${product.origin}`}
          loading="lazy"
          width={768}
          height={768}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {product.badge && (
          <span className="absolute left-4 top-4 rounded-full bg-secondary px-3 py-1 text-xs font-bold uppercase tracking-wider text-secondary-foreground shadow-soft">
            {product.badge}
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-6">
        <div>
          <h3 className="font-display text-2xl font-bold text-primary">{product.name}</h3>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">{product.origin}</p>
        </div>
        <p className="text-sm text-muted-foreground">{product.weight}</p>
        <div className="mt-auto flex items-center justify-between gap-3 pt-2">
          <span className="font-display text-2xl font-bold text-foreground">{formatINR(product.price)}</span>
          <button
            type="button"
            onClick={() => {
              add(product.id);
              toast.success(`${product.name} added to cart`);
            }}
            className="inline-flex items-center gap-1.5 rounded-full bg-mango px-4 py-2 text-sm font-semibold text-secondary-foreground shadow-soft transition-all hover:scale-105 hover:shadow-glow"
          >
            <Plus className="h-4 w-4" /> Add
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
