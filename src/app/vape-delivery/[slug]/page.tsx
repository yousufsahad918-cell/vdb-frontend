import { getWhatsAppNumber } from "@/lib/settings";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { locations, getLocationBySlug } from "@/lib/locations";
import ProductGrid from "@/components/ProductGrid";

interface Props { params: { slug: string }; }

export async function generateStaticParams() {
  return locations.map((loc) => ({ slug: loc.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const loc = getLocationBySlug(params.slug);
  if (!loc) return {};
  return {
    title: `Vape Delivery in ${loc.name} Bangalore — 30-45 Min | VapeDeliveryBangalore.com`,
    description: `Buy vapes in ${loc.name}, Bangalore with 30-45 minute delivery. Elfbar, Caliburn, ZYN & more. 100% original, discreet packaging. Order on WhatsApp.`,
    alternates: { canonical: `https://vapedeliverybangalore.com/vape-delivery/${loc.slug}` },
    keywords: [
      `vape delivery ${loc.name}`,
      `vape in ${loc.name}`,
      `buy vape ${loc.name} Bangalore`,
      `vape near me ${loc.name}`,
      `disposable vape ${loc.name}`,
      `Elfbar ${loc.name}`,
      `Caliburn ${loc.name}`,
    ],
  };
}

function getSeoContent(name: string): string {
  const n = name.toLowerCase();
  if (["hospital", "health", "clinic", "medical", "apollo", "manipal", "fortis", "narayana", "sakra", "aster", "columbia", "cloudnine", "vikram", "bgs"].some(x => n.includes(x))) {
    return `Vape delivery near ${name} in Bangalore is available 7 days a week. Whether you are visiting a patient, working nearby, or living in the area — we deliver Elfbar disposables, Caliburn pod systems, ZYN nicotine pouches and more in 30-45 minutes. All products are 100% original, sealed, and delivered discreetly near ${name}, Bangalore.`;
  }
  if (["tech park", "business park", "it park", "manyata", "bagmane", "embassy", "prestige", "itpl", "cessna", "rmz", "ecospace", "salarpuria", "global village", "outer ring road"].some(x => n.includes(x))) {
    return `Working at ${name} in Bangalore? We deliver vapes to your office gate or nearby address in 30-45 minutes. Elfbar Raya D1, Lost Mary MT35000, Caliburn G4, ZYN Cool Mint and more available for same-day delivery. Order on WhatsApp and we dispatch immediately — discreet packaging every time.`;
  }
  if (["college", "university", "institute", "iisc", "christ", "rv college", "bms", "pesit", "jain", "ramaiah", "dayananda"].some(x => n.includes(x))) {
    return `Near ${name} in Bangalore? We deliver to the campus area and surrounding student zones in 30-45 minutes. Elfbar 600 (Rs 1,199), Elfbar Raya D1 (Rs 2,399), ZYN Cool Mint (Rs 1,299) and more — fast, discreet delivery. 100% original products, no fake sellers.`;
  }
  if (["mall", "phoenix", "orion", "forum", "mantri", "garuda", "gopalan", "elements", "ub city"].some(x => n.includes(x))) {
    return `Near ${name} in Bangalore? We deliver vapes to ${name} and all surrounding areas in 30-45 minutes. Browse our full range of Elfbar disposables, Caliburn pod systems, ZYN and Velo nicotine pouches — order on WhatsApp and receive your delivery without leaving your home or office.`;
  }
  if (["leela", "itc", "taj", "jw marriott", "oberoi", "four seasons", "sheraton", "st regis", "hyatt", "marriott"].some(x => n.includes(x))) {
    return `Staying at ${name} in Bangalore? We deliver premium vapes discreetly to your room or lobby in 30-45 minutes. Elfbar Raya D1, MoonNight 40K, Caliburn G4, ZYN Cool Mint — all 100% original. Just message us on WhatsApp with your room number and order.`;
  }
  return `Vape delivery in ${name}, Bangalore is available 7 days a week with 30-45 minute turnaround. We cover every lane, society, and apartment in ${name} — Elfbar disposables from Rs 1,199, Caliburn pod systems, ZYN nicotine pouches at Rs 1,299, and more. 100% original products, discreet packaging, WhatsApp ordering.`;
}

const WA = "https://wa.me/916282878843?text=Hi%20VapeDeliveryBangalore%2C%20I%20want%20to%20order%20a%20vape%20in%20Bangalore";

const FEATURED = [
  { name: "Elfbar Raya D1", price: "\u20b92,399", badge: "BEST SELLER", img: "/products/raya-d1.webp", slug: "elfbar-raya-d1" },
  { name: "Elfbar MoonNight 40K", price: "\u20b93,299", badge: "LONGEST", img: "/products/elfbar-moonnight.webp", slug: "elfbar-moonnight-40k" },
  { name: "Caliburn G4", price: "\u20b97,499", badge: "POPULAR", img: "/products/caliburn-g4.webp", slug: "caliburn-g4" },
  { name: "ZYN Cool Mint", price: "\u20b91,299", badge: "SMOKELESS", img: "/products/zyn-velo.webp", slug: "zyn-cool-mint" },
];

export default function LocationPage({ params }: Props) {
  const loc = getLocationBySlug(params.slug);
  if (!loc) notFound();
  const seoContent = getSeoContent(loc.name);

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)", paddingBottom: 80 }}>
      <div style={{ background: "var(--bg-2)", borderBottom: "1px solid var(--border)", padding: "32px 16px 24px" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <Link href="/" style={{ color: "var(--green)", fontSize: "0.78rem", fontWeight: 600, textDecoration: "none", marginBottom: 12, display: "inline-block" }}>Back to Home</Link>
          <h1 style={{ color: "var(--white)", fontSize: "1.6rem", fontWeight: 800, marginBottom: 8 }}>Vape Delivery in {loc.name}</h1>
          <p style={{ color: "var(--muted)", fontSize: "0.88rem", lineHeight: 1.6 }}>{loc.localNote}</p>
        </div>
      </div>

      <div style={{ maxWidth: 700, margin: "0 auto", padding: "24px 16px" }}>

        {/* Featured Products */}
        <div style={{ marginBottom: 28, background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: 16, padding: "18px" }}>
          <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--green)", letterSpacing: "0.1em", marginBottom: 6 }}>ORDER NOW — {loc.name.toUpperCase()}</div>
          <h2 style={{ fontSize: "0.95rem", fontWeight: 800, color: "var(--white)", marginBottom: 14 }}>Top Products — 30-45 Min Delivery</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10, marginBottom: 14 }}>
            {FEATURED.map(p => (
              <a key={p.slug} href={"/products/" + p.slug} style={{ textDecoration: "none", background: "var(--bg-3)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden", display: "flex", flexDirection: "column" as const }}>
                <div style={{ position: "relative", aspectRatio: "1", background: "var(--bg-3)" }}>
                  <span style={{ position: "absolute", top: 6, left: 6, zIndex: 1, background: "var(--green)", color: "#fff", fontSize: "0.55rem", fontWeight: 700, padding: "2px 6px", borderRadius: 100 }}>{p.badge}</span>
                  <img src={p.img} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "contain", padding: 8 }} />
                </div>
                <div style={{ padding: "8px 10px 10px" }}>
                  <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--white)", marginBottom: 4, lineHeight: 1.3 }}>{p.name}</div>
                  <div style={{ fontSize: "0.9rem", fontWeight: 800, color: "var(--green)" }}>{p.price}</div>
                </div>
              </a>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <a href="/products" style={{ display: "block", background: "var(--bg-3)", border: "1px solid var(--border)", color: "var(--white)", textAlign: "center" as const, padding: "10px", borderRadius: 10, fontWeight: 700, fontSize: "0.82rem", textDecoration: "none" }}>Shop All Products</a>
            <a href={WA} target="_blank" rel="noopener noreferrer" style={{ display: "block", background: "#25D366", color: "#fff", textAlign: "center" as const, padding: "10px", borderRadius: 10, fontWeight: 700, fontSize: "0.82rem", textDecoration: "none" }}>Order on WhatsApp</a>
          </div>
        </div>

        {/* SEO Content */}
        <div style={{ marginBottom: 24, fontSize: "0.88rem", color: "var(--muted)", lineHeight: 1.8 }}>
          <p>{seoContent}</p>
        </div>

        {/* Areas */}
        <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--white)", marginBottom: 12 }}>Areas We Cover in {loc.name}</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
          {loc.sublocations.map(area => (
            <span key={area} style={{ background: "var(--bg-2)", border: "1px solid var(--border)", padding: "6px 12px", borderRadius: 100, fontSize: "0.78rem", color: "var(--muted)" }}>📍 {area}</span>
          ))}
        </div>

        {/* Category Cards */}
        <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--white)", marginBottom: 12 }}>All Products Available in {loc.name}</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 10, marginBottom: 24 }}>
          {[
            { cat: "Disposable Vapes", items: "Elfbar Raya D1 ₹2,399 · MoonNight 40K ₹3,299 · Lost Mary MT35000 ₹3,199", color: "var(--green)", href: "/products/disposables" },
            { cat: "Pod Systems", items: "Caliburn G4 ₹7,499 · G3 Pro ₹7,999 · G5 Lite ₹5,699", color: "#a78bfa", href: "/products/pod-systems" },
            { cat: "E-Liquids", items: "Elfliq Nic Salt ₹1,999 · Pod Salt ₹1,999 · Nasty Salt ₹1,899", color: "#10b981", href: "/products/eliquids" },
            { cat: "Nicotine Pouches", items: "ZYN Cool Mint ₹1,299 · Velo Peppermint ₹1,299", color: "#3b82f6", href: "/products/nicotine-pouches" },
          ].map(c => (
            <Link key={c.cat} href={c.href} style={{ textDecoration: "none", background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: 12, padding: "12px 14px", display: "block" }}>
              <div style={{ fontSize: "0.72rem", fontWeight: 700, color: c.color, marginBottom: 4 }}>{c.cat}</div>
              <div style={{ fontSize: "0.7rem", color: "var(--muted)", lineHeight: 1.5 }}>{c.items}</div>
            </Link>
          ))}
        </div>

        {/* Trust */}
        <div style={{ background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: 14, padding: "20px", marginBottom: 24 }}>
          <h2 style={{ color: "var(--white)", fontSize: "0.95rem", fontWeight: 700, marginBottom: 8 }}>Why Order from VapeDeliveryBangalore.com?</h2>
          <div style={{ display: "flex", flexDirection: "column" as const, gap: 8 }}>
            {[
              "100% original products — sourced from authorised distributors",
              `30-45 minute delivery to ${loc.name}`,
              "Discreet plain packaging — no labels",
              "WhatsApp ordering — no app, no login needed",
              "Trusted Bangalore vape delivery since 2023",
            ].map(f => (
              <div key={f} style={{ fontSize: "0.82rem", color: "var(--muted)" }}>✅ {f}</div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--white)", marginBottom: 12 }}>Frequently Asked Questions</h2>
          {[
            { q: `Is vape delivery available in ${loc.name}?`, a: `Yes — we deliver vapes to ${loc.name}, Bangalore in 30-45 minutes. Order on WhatsApp and we dispatch immediately.` },
            { q: `What vapes are available in ${loc.name}?`, a: `We stock Elfbar disposables (from Rs 1,199), Caliburn pod systems, ZYN nicotine pouches (Rs 1,299), e-liquids and rolling tobacco — all available for delivery in ${loc.name}.` },
            { q: `What is the price of Elfbar in ${loc.name}?`, a: `Elfbar prices in ${loc.name} start from Rs 1,199 for the Elfbar 600 and go up to Rs 3,299 for the MoonNight 40K. Delivery is included with no hidden charges.` },
            { q: `Are the products 100% original?`, a: `Yes — every product is sourced from authorised distributors and delivered sealed. VapeDeliveryBangalore.com is a trusted vape delivery service in Bangalore.` },
          ].map(faq => (
            <div key={faq.q} style={{ borderBottom: "1px solid var(--border)", paddingBottom: 12, marginBottom: 12 }}>
              <div style={{ fontWeight: 700, fontSize: "0.88rem", color: "var(--white)", marginBottom: 4 }}>{faq.q}</div>
              <div style={{ fontSize: "0.82rem", color: "var(--muted)", lineHeight: 1.6 }}>{faq.a}</div>
            </div>
          ))}
        </div>

        <a href={WA} target="_blank" rel="noopener noreferrer" style={{ display: "block", background: "#25D366", color: "#fff", textAlign: "center" as const, padding: "14px", borderRadius: 12, fontWeight: 700, fontSize: "0.95rem", textDecoration: "none" }}>
          Order Vapes in {loc.name} on WhatsApp
        </a>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          { "@type": "Question", "name": `Is vape delivery available in ${loc.name}?`, "acceptedAnswer": { "@type": "Answer", "text": `Yes — we deliver vapes to ${loc.name}, Bangalore in 30-45 minutes. 100% original products.` } },
          { "@type": "Question", "name": `What is the price of vapes in ${loc.name}?`, "acceptedAnswer": { "@type": "Answer", "text": `Vapes in ${loc.name} start from Rs 1,199 for Elfbar 600. Elfbar Raya D1 is Rs 2,399, ZYN Cool Mint Rs 1,299. Delivery included.` } },
        ]
      })}} />
    </main>
  );
}
