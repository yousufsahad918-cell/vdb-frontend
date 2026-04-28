import type { Metadata } from "next";
import Link from "next/link";
import { locations, WHATSAPP_URL } from "@/lib/locations";
import ProductGrid from "@/components/ProductGrid";
import ProductTicker from "@/components/ProductTicker";
import HeroSection from "@/components/HeroSection";

export const metadata: Metadata = {
  title: "Vape Delivery Bangalore – 30-45 Min | VapeDeliveryBangalore.com",
  description:
    "Buy vape online in Bangalore with 30-45 min delivery. Best disposable vapes, pod systems & e-liquids delivered discreetly to BTM, HSR, Koramangala, Indiranagar, Whitefield and 20+ areas. Order on WhatsApp now.",
  alternates: { canonical: "https://vapedeliverybangalore.com" },
};

const FEATURES = [
  { icon: "⚡", title: "30-45 Min Delivery", desc: "We dispatch fast. Most orders across Bangalore reach you within 45 minutes." },
  { icon: "🔒", title: "100% Discreet", desc: "Plain packaging, no labels. Your order is your business." },
  { icon: "🗺️", title: "20+ Areas Covered", desc: "From Whitefield to Rajajinagar, Electronic City to Yelahanka — we cover all of Bangalore." },
  { icon: "💬", title: "Order via WhatsApp", desc: "No app download, no login. Just message us and we'll handle the rest." },
  { icon: "🌿", title: "Best Flavours", desc: "Disposable vapes, pod systems, and e-liquids from top brands — huge selection available." },
  { icon: "✅", title: "Trusted by 1000+", desc: "Hundreds of repeat customers across Bangalore trust us for reliable vape delivery." },
];

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <HeroSection />

      {/* TICKER */}
      <ProductTicker />

      {/* PRODUCTS */}
      <ProductGrid />

      {/* WHY CHOOSE US */}
      <section className="section" style={{ background: "var(--bg-2)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div className="container">
          <p className="section-label">Why Choose Us</p>
          <h2 style={{ marginBottom: 6 }}>The Best Vape Delivery in Bangalore</h2>
          <p style={{ color: "var(--muted)", marginBottom: 24, fontSize: "0.9rem" }}>
            Fast, discreet, and reliable — here's why Bangalore trusts us for vape delivery.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
            {FEATURES.map(f => (
              <div key={f.title} style={{
                background: "var(--bg-3)", border: "1px solid var(--border)",
                borderRadius: 12, padding: "14px 14px",
              }}>
                <div style={{ fontSize: "1.4rem", marginBottom: 6 }}>{f.icon}</div>
                <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "0.85rem", color: "var(--text)", marginBottom: 4 }}>{f.title}</p>
                <p style={{ fontSize: "0.75rem", color: "var(--muted)", lineHeight: 1.5 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section style={{ background: "#14532d", padding: "32px 20px" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <h2 style={{ color: "#ffffff", marginBottom: 8, fontSize: "1.4rem" }}>Ready to Order Vape in Bangalore?</h2>
          <p style={{ color: "rgba(255,255,255,0.75)", marginBottom: 20, fontSize: "0.88rem" }}>
            Message us on WhatsApp — we'll confirm your order and dispatch within minutes.
          </p>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "#25d366", color: "#fff", padding: "14px 24px", borderRadius: 10, fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1rem", textDecoration: "none", marginBottom: 10 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.554 4.122 1.523 5.855L0 24l6.29-1.49A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.007-1.374l-.36-.214-3.733.884.937-3.638-.234-.374A9.818 9.818 0 0112 2.182c5.424 0 9.818 4.394 9.818 9.818 0 5.425-4.394 9.818-9.818 9.818z"/>
            </svg>
            Order Now on WhatsApp
          </a>
          <Link href="/#products"
            style={{ display: "block", color: "rgba(255,255,255,0.7)", fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.88rem", textDecoration: "none" }}>
            Browse Products →
          </Link>
        </div>
      </section>

      {/* ABOUT */}
      <section className="section">
        <div className="container">
          <p className="section-label">About Us</p>
          <h2 style={{ marginBottom: 10 }}>Vape Delivery Across All of Bangalore</h2>
          <p style={{ color: "var(--muted)", lineHeight: 1.7, marginBottom: 12, fontSize: "0.9rem" }}>
            Whether you're looking for vape delivery in BTM Layout, Koramangala, or want to buy vape near Whitefield —
            VapeDeliveryBangalore has you covered. We stock the best disposable vapes and pod systems
            and deliver across all major Bangalore neighbourhoods, fast and discreetly.
          </p>
          <p style={{ color: "var(--muted)", lineHeight: 1.7, fontSize: "0.9rem" }}>
            Finding a reliable vape delivery service in Bangalore has always been a hassle.
            That's why we built a delivery-first service — no queues, no travel,
            no awkward conversations. Just order on WhatsApp and get your vape delivered in 30-45 minutes.
          </p>
        </div>
      </section>

      {/* DELIVERY AREAS */}
      <section className="section" style={{ background: "var(--bg-2)", borderTop: "1px solid var(--border)" }}>
        <div className="container">
          <p className="section-label">Delivery Areas</p>
          <h2 style={{ marginBottom: 6 }}>Vape Delivery Across All of Bangalore</h2>
          <p style={{ color: "var(--muted)", marginBottom: 20, fontSize: "0.88rem" }}>
            We cover 20 major areas — click your location to see local delivery details, sublocations, and order options.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
            {locations.map(loc => (
              <Link key={loc.slug} href={`/vape-delivery/${loc.slug}`} style={{ textDecoration: "none" }}>
                <div style={{
                  background: "var(--bg-3)", border: "1px solid var(--border)",
                  borderRadius: 12, padding: "12px 14px",
                  transition: "border-color 0.2s",
                }}>
                  <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "0.88rem", color: "var(--text)", marginBottom: 3 }}>{loc.name}</p>
                  <p style={{ fontSize: "0.72rem", color: "var(--muted)", marginBottom: 6, lineHeight: 1.3 }}>
                    {loc.sublocations.slice(0, 3).join(", ")}{loc.sublocations.length > 3 ? " + more" : ""}
                  </p>
                  <p style={{ fontSize: "0.72rem", color: "var(--green)", fontWeight: 600 }}>Vape delivery here →</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SEO TEXT */}
      <section className="section">
        <div className="container">
          <p className="section-label">Vape Delivery Bangalore</p>
          <h2 style={{ marginBottom: 10 }}>Buy Vape Online in Bangalore — Fast Delivery</h2>
          <p style={{ color: "var(--muted)", lineHeight: 1.7, marginBottom: 10, fontSize: "0.88rem" }}>
            VapeDeliveryBangalore is Bangalore's fastest vape delivery service. We deliver disposable vapes,
            pod devices, nic salts, nicotine pouches and tobacco products across 20+ areas in 30-45 minutes.
            All products are 100% authentic with discreet packaging.
          </p>
          <p style={{ color: "var(--muted)", lineHeight: 1.7, fontSize: "0.88rem" }}>
            Popular searches: vape delivery bangalore, buy vape online bangalore, elfbar bangalore,
            disposable vape bangalore, vape near me bangalore, caliburn bangalore, lost mary bangalore.
          </p>
        </div>
      </section>

      {/* JSON-LD LocalBusiness */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": "VapeDeliveryBangalore",
        "description": "Vape delivery service in Bangalore. 30-45 min delivery across 20+ areas.",
        "url": "https://vapedeliverybangalore.com",
        "telephone": "+916282878843",
        "areaServed": "Bangalore",
        "address": { "@type": "PostalAddress", "addressLocality": "Bangalore", "addressCountry": "IN" },
        "openingHours": "Mo-Su 10:00-22:00",
        "priceRange": "₹₹",
      })}} />
    </>
  );
}
