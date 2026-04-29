const Footer = () => (
  <footer className="mt-24 border-t border-border/60 bg-primary text-primary-foreground">
    <div className="container grid gap-10 py-16 md:grid-cols-3">
      <div>
        <h3 className="font-display text-2xl font-bold">Anunatural Foods</h3>
        <p className="mt-3 max-w-xs text-sm text-primary-foreground/80">
          Naturally ripened mangoes, sourced directly from family-owned orchards across India. No pesticides. No carbide. Just sunshine and patience.
        </p>
      </div>
      <div>
        <h4 className="text-sm font-semibold uppercase tracking-wider text-secondary">Shop</h4>
        <ul className="mt-3 space-y-2 text-sm text-primary-foreground/80">
          <li><a href="/#shop" className="hover:text-secondary">All mango varieties</a></li>
          <li><a href="/#shop" className="hover:text-secondary">Bestsellers</a></li>
          <li><a href="/#shop" className="hover:text-secondary">Premium boxes</a></li>
        </ul>
      </div>
      <div>
        <h4 className="text-sm font-semibold uppercase tracking-wider text-secondary">Contact</h4>
        <ul className="mt-3 space-y-2 text-sm text-primary-foreground/80">
          <li>hello@anunaturalfoods.in</li>
          <li>+91 90000 00000</li>
          <li>Mon–Sat, 9am–7pm IST</li>
        </ul>
      </div>
    </div>
    <div className="border-t border-primary-foreground/10 py-6 text-center text-xs text-primary-foreground/60">
      © {new Date().getFullYear()} Anunatural Foods. Grown with care.
    </div>
  </footer>
);

export default Footer;
