import { ArrowRight, Leaf, Sun, Truck } from "lucide-react";
import { products } from "@/data/products";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import heroImage from "@/assets/hero-mangoes.jpg";

const features = [
  { icon: Leaf, title: "100% Natural", text: "No pesticides, no carbide, no shortcuts. Just orchard-fresh mangoes." },
  { icon: Sun, title: "Sun-ripened", text: "Allowed to ripen on the tree until they reach peak sweetness." },
  { icon: Truck, title: "Farm to door", text: "Hand-packed and shipped within 24 hours of harvest." },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-cream">
        <div className="container grid gap-12 py-20 lg:grid-cols-2 lg:items-center lg:py-28">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
              <Leaf className="h-3.5 w-3.5" /> 100% Natural · Pesticide-free
            </span>
            <h1 className="font-display text-5xl font-bold leading-[1.05] tracking-tight text-balance text-primary sm:text-6xl lg:text-7xl">
              Naturally ripened <em className="not-italic text-secondary">mangoes</em>, straight from the orchard.
            </h1>
            <p className="max-w-xl text-lg text-muted-foreground">
              Anunatural Foods brings you India&apos;s finest mango varieties — picked at peak ripeness, packed by hand and delivered to your door.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <a
                href="#shop"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-soft transition-all hover:scale-105 hover:shadow-card"
              >
                Shop the harvest <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#story"
                className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background px-7 py-3.5 text-sm font-semibold text-primary transition-colors hover:bg-muted"
              >
                Our story
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 -z-10 rounded-[2.5rem] bg-mango opacity-20 blur-3xl" />
            <img
              src={heroImage}
              alt="Fresh ripe Indian mangoes on a wooden surface"
              width={1536}
              height={1152}
              className="aspect-[4/3] w-full rounded-[2rem] object-cover shadow-card"
            />
          </div>
        </div>
      </section>

      {/* Promise */}
      <section id="promise" className="container py-20">
        <div className="grid gap-8 md:grid-cols-3">
          {features.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-2xl border border-border/60 bg-card p-8 shadow-soft">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-mango text-secondary-foreground">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="font-display text-xl font-bold text-primary">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Shop */}
      <section id="shop" className="container py-12">
        <div className="mb-12 max-w-2xl">
          <span className="text-sm font-semibold uppercase tracking-wider text-secondary">This season&apos;s harvest</span>
          <h2 className="mt-3 font-display text-4xl font-bold text-primary sm:text-5xl">Choose your mango.</h2>
          <p className="mt-3 text-muted-foreground">
            Six iconic Indian varieties, each with its own character. Boxes ship pan-India.
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Story */}
      <section id="story" className="bg-cream py-20">
        <div className="container grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="space-y-5">
            <span className="text-sm font-semibold uppercase tracking-wider text-secondary">Our story</span>
            <h2 className="font-display text-4xl font-bold text-primary sm:text-5xl text-balance">
              Mangoes the way they were always meant to taste.
            </h2>
            <p className="text-muted-foreground">
              Anunatural Foods began as a promise to bring back the mangoes our grandparents knew — fragrant, tree-ripened, and free of artificial ripening agents. We work directly with family-owned orchards from Ratnagiri to Junagadh, paying farmers fairly and shipping fruit only when it&apos;s truly ready.
            </p>
            <p className="text-muted-foreground">
              Every box you order travels from a sunlit branch to your kitchen in under 72 hours.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {products.slice(0, 4).map((p) => (
              <img
                key={p.id}
                src={p.image}
                alt={p.name}
                loading="lazy"
                width={768}
                height={768}
                className="aspect-square rounded-2xl object-cover shadow-soft"
              />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
