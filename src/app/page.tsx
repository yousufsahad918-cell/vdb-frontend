import type { Metadata } from "next";
import Link from "next/link";
import { locations, WHATSAPP_URL } from "@/lib/locations";
import ProductGrid from "@/components/ProductGrid";

export const metadata: Metadata = {
  title: "Buy Vape in Bangalore – 20-30 Min Delivery | VapeInBangalore.in",
  description:
    "Buy vape in Bangalore with 20-30 minute delivery. Best disposable vapes, pod systems & e-liquids delivered discreetly to BTM, HSR, Koramangala, Indiranagar, Whitefield and 20+ areas. Order on WhatsApp now.",
  alternates: { canonical: "https://vapeinbangalore.in" },
};

const FEATURES = [
  { icon: "⚡", title: "60-Minute Delivery", desc: "We dispatch fast. Most orders across Bangalore reach you within the hour." },
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
      <section className="hero">
        <div className="container">
          <div className="hero-tag">Now Delivering Across Bangalore</div>
          <h1>
            Buy Vape in <em>Bangalore</em>
            <br />
            20–30 Min Delivery
          </h1>
          <p className="hero-sub">
            Order vape online in Bangalore and get it delivered in 20–30 minutes.
            Disposable vapes, pod systems & e-liquids — discreet delivery to BTM,
            HSR, Koramangala, Whitefield & 20+ areas.
          </p>
          <div className="btn-group">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.554 4.122 1.523 5.855L0 24l6.29-1.49A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.007-1.374l-.36-.214-3.733.884.937-3.638-.234-.374A9.818 9.818 0 0112 2.182c5.424 0 9.818 4.394 9.818 9.818 0 5.425-4.394 9.818-9.818 9.818z"/>
              </svg>
              Order on WhatsApp
            </a>
            <a href="#products" className="btn-secondary">
              Browse Products →
            </a>
          </div>

          <div className="stats-bar">
            <div className="stat-item">
              <span className="stat-num">20–30</span>
              <span className="stat-label">Min Delivery</span>
            </div>
            <div className="stat-item">
              <span className="stat-num">20+</span>
              <span className="stat-label">Areas in Bangalore</span>
            </div>
            <div className="stat-item">
              <span className="stat-num">1000+</span>
              <span className="stat-label">Happy Customers</span>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <ProductGrid />

      {/* ABOUT */}
      <section className="section">
        <div className="container">
          <p className="section-label">About Us</p>
          <h2>Vapes in Bangalore, Delivered to You</h2>
          <p>
            Whether you're looking for a vape in BTM Layout, vape delivery in
            Koramangala, or want to buy vape near Whitefield — VapeInBangalore
            has you covered. We stock the best disposable vapes and pod systems
            and deliver across all major Bangalore neighbourhoods, fast and discreetly.
          </p>
          <p style={{ marginTop: 12 }}>
            Finding a reliable vape shop in Bangalore has always been a hassle.
            That's why we built a delivery-first service — no queues, no travel,
            no awkward conversations. Just order on WhatsApp and get your vape
            near you in under an hour.
          </p>
        </div>
      </section>

      {/* LOCATIONS */}
      <section className="section">
        <div className="container">
          <p className="section-label">Delivery Areas</p>
          <h2>Vape Delivery Across All of Bangalore</h2>
          <p>
            We cover 20 major areas — click your location to see local delivery
            details, sublocations, and order options.
          </p>
          <div className="location-grid">
            {locations.map((loc) => (
              <Link key={loc.slug} href={`/vape-delivery/${loc.slug}`} className="location-card">
                <div className="location-card-name">{loc.name}</div>
                <div className="location-card-sub">
                  {loc.sublocations.slice(0, 3).join(", ")}
                  {loc.sublocations.length > 3 && " + more"}
                </div>
                <div className="location-card-arrow">Vape delivery here →</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="section">
        <div className="container">
          <p className="section-label">Why Choose Us</p>
          <h2>The Best Vape Delivery in Bangalore</h2>
          <p>Fast, discreet, and reliable — here's why Bangalore trusts us for vape delivery.</p>
          <div className="features-grid">
            {FEATURES.map((f) => (
              <div key={f.title} className="feature-card">
                <span className="feature-icon">{f.icon}</span>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container">
          <h2>Ready to Order Vape in Bangalore?</h2>
          <p>Message us on WhatsApp — we'll confirm your order and dispatch within minutes.</p>
          <div className="btn-group" style={{ justifyContent: "center" }}>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="btn-whatsapp">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.554 4.122 1.523 5.855L0 24l6.29-1.49A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.007-1.374l-.36-.214-3.733.884.937-3.638-.234-.374A9.818 9.818 0 0112 2.182c5.424 0 9.818 4.394 9.818 9.818 0 5.425-4.394 9.818-9.818 9.818z"/>
              </svg>
              Order Now on WhatsApp
            </a>
            <a href="#products" className="btn-secondary">
              Browse Products →
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
