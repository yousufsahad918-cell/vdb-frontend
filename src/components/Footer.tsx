import Link from "next/link";

const TOP_PRODUCTS = [
  { name: "Elfbar Raya D1", slug: "elfbar-raya-d1" },
  { name: "Elfbar Raya D3", slug: "elfbar-raya-d3" },
  { name: "Elfbar D3 Pro", slug: "elfbar-d3-pro" },
  { name: "Lost Mary MT35000", slug: "lost-mary-mt35000-turbo" },
  { name: "Nasty Bolt WTF 50K", slug: "nasty-bolt-wtf-50k" },
  { name: "Caliburn G4", slug: "caliburn-g4" },
  { name: "IGET Astro B18000", slug: "iget-astro-b18000" },
  { name: "Elfbar MoonNight 40K", slug: "elfbar-moonnight-40k" },
];

const TOP_AREAS = [
  { name: "BTM Layout", slug: "btm-layout" },
  { name: "HSR Layout", slug: "hsr-layout" },
  { name: "Koramangala", slug: "koramangala" },
  { name: "Indiranagar", slug: "indiranagar" },
  { name: "Whitefield", slug: "whitefield" },
  { name: "Marathahalli", slug: "marathahalli" },
  { name: "Electronic City", slug: "electronic-city" },
  { name: "Jayanagar", slug: "jayanagar" },
];

export default function Footer() {
  return (
    <footer style={{ background: "#14532d", borderTop: "1px solid rgba(255,255,255,0.1)", padding: "32px 20px 40px", marginTop: 40 }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ marginBottom: 28 }}>
          <p style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: "1.1rem", marginBottom: 4 }}>
            <span style={{ color: "#ffffff" }}>VAPE</span>
            <span style={{ color: "#86efac" }}> · DELIVERY · BANGALORE</span>
          </p>
          <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.5, maxWidth: 400 }}>
            Buy vape online in Bangalore. 30-45 min delivery across 20+ areas.
            Authentic products, discreet packaging.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 24, marginBottom: 28 }}>
          <div>
            <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "0.82rem", color: "#86efac", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Top Products
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {TOP_PRODUCTS.map(p => (
                <Link key={p.slug} href={`/products/${p.slug}`}
                  style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.65)", textDecoration: "none" }}>
                  {p.name}
                </Link>
              ))}
              <Link href="/products" style={{ fontSize: "0.78rem", color: "#86efac", textDecoration: "none", fontWeight: 600 }}>
                View All Products →
              </Link>
            </div>
          </div>

          <div>
            <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "0.82rem", color: "#86efac", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Delivery Areas
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {TOP_AREAS.map(a => (
                <Link key={a.slug} href={`/vape-delivery/${a.slug}`}
                  style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.65)", textDecoration: "none" }}>
                  Vape Delivery {a.name}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "0.82rem", color: "#86efac", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Quick Links
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {[
                { label: "Home", href: "/" },
                { label: "All Products", href: "/products" },
                { label: "Blog & Guides", href: "/blog" },
                { label: "Order on WhatsApp", href: "https://wa.me/916282878843" },
              ].map(l => (
                <Link key={l.href} href={l.href}
                  target={l.href.startsWith("http") ? "_blank" : undefined}
                  rel={l.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.65)", textDecoration: "none" }}>
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.15)", paddingTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
          <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.5)" }}>
            © 2025 VapeDeliveryBangalore. Fast vape delivery in Bangalore.
          </p>
          <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.5)" }}>
            30-45 min delivery · 20+ areas · WhatsApp orders
          </p>
        </div>
      </div>
    </footer>
  );
}
