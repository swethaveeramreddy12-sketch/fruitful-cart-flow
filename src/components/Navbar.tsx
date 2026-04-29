import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, Leaf } from "lucide-react";
import { useCart } from "@/context/CartContext";
import logo from "@/assets/logo.png";

const Navbar = () => {
  const { count } = useCart();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Anunatural Foods logo" className="h-9 w-9 object-contain" width={36} height={36} />
          <span className="font-display text-xl font-bold text-primary">Anunatural Foods</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <a href="/#shop" className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary">Shop</a>
          <a href="/#story" className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary">Our Story</a>
          <a href="/#promise" className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary">Promise</a>
          <span className="hidden items-center gap-1 text-xs font-semibold uppercase tracking-wider text-primary lg:inline-flex">
            <Leaf className="h-3.5 w-3.5" /> 100% Natural
          </span>
        </nav>

        <button
          type="button"
          onClick={() => navigate("/cart")}
          aria-label={`Cart with ${count} item${count === 1 ? "" : "s"}`}
          className="relative flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform hover:scale-105"
        >
          <ShoppingBag className="h-5 w-5" />
          {count > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-secondary px-1 text-xs font-bold text-secondary-foreground">
              {count}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};

export default Navbar;
