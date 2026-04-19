import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  locations,
  getLocationBySlug,
  WHATSAPP_URL,
  SHOP_URL,
} from "@/lib/locations";
import ProductGrid from "@/components/ProductGrid";

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return locations.map((loc) => ({ slug: loc.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const loc = getLocationBySlug(params.slug);
  if (!loc) return {};

  const title = `Vape in ${loc.name} – 60 Min Delivery | VapeInBangalore.in`;
  const description = `Buy vape in ${loc.name}, Bangalore with fast 60-minute delivery. We deliver disposable vapes and pod systems to ${loc.sublocations.slice(0, 4).join(", ")} and more. Order on WhatsApp now.`;
  const url = `https://vapeinbangalore.in/vape-delivery/${loc.slug}`;

  return {
    title,
    description,
    keywords: [
      `vape in ${loc.name}`,
      `vape delivery in ${loc.name}`,
      `buy vape in ${loc.name}`,
      `vapes in ${loc.name}`,
      `vape near ${loc.name}`,
      `vape near me in ${loc.name}`,
      `best vape in ${loc.name}`,
      `disposable vape in ${loc.name}`,
      `fast vape delivery in ${loc.name}`,
      `vape shop in ${loc.name}`,
      `order vape in ${loc.name}`,
    ],
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title,
      description,
      siteName: "Vape in Bangalore",
    },
  };
}

export default function LocationPage({ params }: Props) {
  const loc = getLocationBySlug(params.slug);
  if (!loc) notFound();

  const otherLocations = locations.filter((l) => l.slug !== loc.slug).slice(0, 6);

  return (
    <>
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: `Vape in Bangalore – ${loc.name}`,
            description: `Fast vape delivery in ${loc.name}, Bangalore`,
            url: `https://vapeinbangalore.in/vape-delivery/${loc.slug}`,
            telephone: "+916282878843",
            areaServed: [loc.name, ...loc.sublocations],
            address: {
              "@type": "PostalAddress",
              addressLocality: loc.name,
              addressRegion: "Karnataka",
              addressCountry: "IN",
            },
          }),
        }}
      />

      {/* HERO */}
      <section className="hero">
        <div className="container">
          <div className="breadcrumb">
            <Link href="/">Home</Link>
            <span className="breadcrumb-sep">/</span>
            <span>Vape Delivery in {loc.name}</span>
          </div>

          <div className="hero-tag">Delivering in {loc.name}</div>

          <h1>
            Vape Delivery in <em>{loc.name}</em>
            <br />– 60 Min Delivery
          </h1>

          <p className="hero-sub">
            Looking to buy vape in {loc.name}? We deliver disposable vapes and
            pod systems across {loc.name} and all nearby areas — fast, discreet,
            and reliable. Order vape delivery in {loc.name} right now on
            WhatsApp.
          </p>

          <div className="btn-group">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Order Vape in {loc.name}
            </a>
            <a
              href={SHOP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              Browse Products →
            </a>
          </div>

          <div className="stats-bar">
            <div className="stat-item">
              <span className="stat-num">60 Min</span>
              <span className="stat-label">Delivery in {loc.name}</span>
            </div>
            <div className="stat-item">
              <span className="stat-num">{loc.sublocations.length}+</span>
              <span className="stat-label">Sublocations Covered</span>
            </div>
            <div className="stat-item">
              <span className="stat-num">🔒</span>
              <span className="stat-label">Discreet Packaging</span>
            </div>
          </div>
        </div>
      </section>

      {/* VAPES IN LOCATION */}
      <section className="section">
        <div className="container">
          <p className="section-label">What We Offer</p>
          <h2>Vapes in {loc.name}</h2>
          <p>
            We stock a wide range of vapes in {loc.name} — from popular
            disposable vapes to refillable pod systems and premium e-liquids.
            Whether you're a first-time buyer or a regular, you'll find exactly
            what you need. All products are sourced from verified suppliers and
            delivered directly to your door in {loc.name}.
          </p>
          <p style={{ marginTop: "16px" }}>{loc.localNote}</p>
          <div className="btn-group" style={{ marginTop: "24px" }}>
            <a
              href={SHOP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              View Full Product Menu →
            </a>
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <ProductGrid />

      {/* VAPE NEAR YOU */}
      <section className="section">
        <div className="container">
          <p className="section-label">Coverage</p>
          <h2>Vape Near You in {loc.name}</h2>
          <p>
            Searching for vape near {loc.name} or vape near me in {loc.name}?
            We deliver to every pocket of {loc.name} — including all the areas
            listed below. If you're anywhere in {loc.name}, we can reach you in
            under 60 minutes.
          </p>

          <div className="sub-tags">
            {loc.sublocations.map((sub) => (
              <span key={sub} className="sub-tag">
                📍 {sub}
              </span>
            ))}
          </div>

          <p style={{ marginTop: "24px", color: "var(--muted)" }}>
            Don't see your exact area listed? Message us on WhatsApp — if you're
            in or around {loc.name}, we almost certainly deliver there.
          </p>
        </div>
      </section>

      {/* WHY US */}
      <section className="section">
        <div className="container">
          <p className="section-label">Why Choose Us</p>
          <h2>Best Vape Delivery in {loc.name}</h2>
          <p>
            Here's why {loc.name} residents choose us for fast vape delivery:
          </p>

          <div className="features-grid">
            {[
              {
                icon: "⚡",
                title: `Fast Vape Delivery in ${loc.name}`,
                desc: `60-minute delivery across ${loc.name} and all sublocations. We move fast.`,
              },
              {
                icon: "🔒",
                title: "Discreet Service",
                desc: "Plain packaging, zero labels. Nobody knows what's inside.",
              },
              {
                icon: "🌿",
                title: "Popular Flavours",
                desc: "Huge selection of disposable vapes, pods, and e-liquids — always in stock.",
              },
              {
                icon: "💬",
                title: "WhatsApp Ordering",
                desc: `Just message us — no app, no account. Order vape in ${loc.name} in seconds.`,
              },
            ].map((f) => (
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
          <h2>Order Vape in {loc.name} Now</h2>
          <p>
            Tap below to message us on WhatsApp. We'll confirm your order and
            dispatch in minutes.
          </p>
          <div className="btn-group" style={{ justifyContent: "center" }}>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Order Now on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* INTERNAL LINKS */}
      <section className="section">
        <div className="container">
          <p className="section-label">Other Areas We Serve</p>
          <h2>Vape Delivery Across Bangalore</h2>
          <p>We cover all of Bangalore — explore other areas:</p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              marginTop: "16px",
            }}
          >
            {otherLocations.map((other) => (
              <Link
                key={other.slug}
                href={`/vape-delivery/${other.slug}`}
                className="btn-secondary"
                style={{ fontSize: "0.875rem", padding: "10px 18px" }}
              >
                Vape in {other.name} →
              </Link>
            ))}
            <Link
              href="/"
              className="btn-secondary"
              style={{ fontSize: "0.875rem", padding: "10px 18px" }}
            >
              View All 20 Areas →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
