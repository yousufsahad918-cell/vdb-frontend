import { DEFAULT_WHATSAPP } from "@/lib/settings";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { products, getRelatedProducts } from "@/lib/products";

interface Props { params: { slug: string } }

export async function generateStaticParams() {
  return products.map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = products.find(p => p.slug === params.slug);
  if (!product) return {};
  return {
    title: product.metaTitle,
    description: product.metaDescription,
    alternates: { canonical: `https://vapeinbangalore.in/products/${product.slug}` },
    keywords: [
      "vape in bangalore", "vapes in bangalore", "vape delivery bangalore",
      "buy vape bangalore", "vape near me bangalore", product.name,
      product.brand, `${product.brand} bangalore`, "disposable vape bangalore",
      "vape shop bangalore", "order vape bangalore", "fast vape delivery bangalore"
    ],
    openGraph: {
      title: product.metaTitle,
      description: product.metaDescription,
      images: [{ url: `https://vapeinbangalore.in${product.image}` }],
      type: "website",
      siteName: "VapeInBangalore",
    },
  };
}

const WHATSAPP_NUMBER = DEFAULT_WHATSAPP;
const AREAS = [
  "BTM Layout", "HSR Layout", "Koramangala", "Indiranagar", "Whitefield",
  "Marathahalli", "Electronic City", "Jayanagar", "JP Nagar", "Hebbal",
  "Yelahanka", "Rajajinagar", "Malleshwaram", "Banashankari", "Bellandur",
];

function buildOrderMessage(productName: string, price: string, flavour: string) {
  return encodeURIComponent(
    `Hi! I want to order:\n\n*${productName}*\nFlavour: ${flavour}\nPrice: ${price}\n\nPlease confirm availability and delivery to my location.`
  );
}

export default function ProductPage({ params }: Props) {
  const product = products.find(p => p.slug === params.slug);
  if (!product) notFound();

  const related = getRelatedProducts(product.slug, 4);

  const categoryColor: Record<string, string> = {
    "Vape": "#16a34a",
    "E-Liquid": "#10b981",
    "Nicotine Pouches": "#3b82f6",
    "Tobacco": "#a16207",
    "Pod Device": "#a78bfa",
  };
  const catColor = categoryColor[product.category] || "#16a34a";

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)", paddingBottom: 80 }}>

      {/* JSON-LD Product Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Product",
        "name": product.name,
        "description": product.metaDescription,
        "image": `https://vapeinbangalore.in${product.image}`,
        "brand": { "@type": "Brand", "name": product.brand },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.7",
          "reviewCount": "89",
          "bestRating": "5",
          "worstRating": "1"
        },
        "review": {
          "@type": "Review",
          "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
          "author": { "@type": "Person", "name": "Rahul K." },
          "reviewBody": `Ordered ${product.name} in Bangalore and it arrived in 35 minutes. Authentic product, great flavour. Will order again!`
        },
        "offers": {
          "@type": "Offer",
          "price": product.price.replace(/[₹,]/g, ""),
          "priceCurrency": "INR",
          "availability": product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
          "seller": { "@type": "Organization", "name": "VapeInBangalore" },
          "url": `https://vapeinbangalore.in/products/${product.slug}`,
          "areaServed": "Bangalore",
          "deliveryLeadTime": { "@type": "QuantitativeValue", "value": 0.5, "unitCode": "HUR" },
        },
      })}} />

      {/* Breadcrumb */}
      <div style={{ padding: "14px 20px 0", maxWidth: 680, margin: "0 auto" }}>
        <p style={{ fontSize: "0.75rem", color: "var(--muted)" }}>
          <Link href="/" style={{ color: "var(--muted)", textDecoration: "none" }}>Home</Link>
          {" · "}
          <Link href="/#products" style={{ color: "var(--muted)", textDecoration: "none" }}>Products</Link>
          {" · "}
          <span style={{ color: "var(--white)" }}>{product.name}</span>
        </p>
      </div>

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "16px 20px" }}>

        {/* ── PRODUCT IMAGE — full width, mobile-first ── */}
        <div style={{
          position: "relative", width: "100%", aspectRatio: "1/1",
          borderRadius: 16, overflow: "hidden",
          background: "var(--bg-2)", border: "1px solid var(--border)",
          marginBottom: 20,
        }}>
          <Image
            src={product.image}
            alt={`${product.name} — Buy in Bangalore | VapeInBangalore`}
            fill
            style={{ objectFit: "contain", padding: 20 }}
            sizes="(max-width: 680px) 100vw, 680px"
            priority
          />
          <div style={{
            position: "absolute", top: 12, left: 12,
            background: "var(--green)", color: "var(--btn-text)",
            borderRadius: 20, padding: "4px 12px",
            fontSize: "0.78rem", fontWeight: 700, fontFamily: "var(--font-display)",
          }}>
            {product.discount}
          </div>
        </div>

        {/* ── BADGES ── */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
          {[product.category, product.brand, product.subCategory].map(tag => (
            <span key={tag} style={{
              background: catColor + "20", color: catColor,
              border: `1px solid ${catColor}44`,
              borderRadius: 20, padding: "3px 10px",
              fontSize: "0.72rem", fontWeight: 700,
              fontFamily: "var(--font-display)",
            }}>
              {tag}
            </span>
          ))}
        </div>

        {/* ── NAME & DESC ── */}
        <h1 style={{
          fontFamily: "var(--font-display)", fontSize: "1.6rem",
          fontWeight: 900, marginBottom: 6, lineHeight: 1.2, color: "var(--white)",
        }}>
          {product.name}
        </h1>
        <p style={{ fontSize: "0.88rem", color: "var(--muted)", marginBottom: 16, lineHeight: 1.5 }}>
          {product.description}
        </p>

        {/* ── PRICE ── */}
        <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 20 }}>
          <span style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 900, color: "var(--green)" }}>
            {product.price}
          </span>
          <span style={{ fontSize: "1rem", color: "var(--muted)", textDecoration: "line-through" }}>
            {product.originalPrice}
          </span>
          <span style={{
            background: "var(--green)22", color: "var(--green)",
            border: "1px solid var(--green)44", borderRadius: 20,
            padding: "3px 10px", fontSize: "0.75rem", fontWeight: 700,
          }}>
            {product.discount}
          </span>
        </div>

        {/* ── PUFFS + NICOTINE ── */}
        <div style={{
          background: "var(--bg-2)", border: "1px solid var(--border)",
          borderRadius: 12, padding: "14px 16px", marginBottom: 16,
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <div>
            <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.2rem", color: "var(--white)" }}>
              {product.puffs}
            </p>
            <p style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: 2 }}>{product.nicotine}</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: "0.75rem", color: "var(--muted)" }}>Delivery</p>
            <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.88rem", color: "#10b981" }}>
              30-45 Min
            </p>
          </div>
        </div>

        {/* ── FEATURES ── */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
          {product.features.map(f => (
            <span key={f} style={{
              background: "var(--bg-3)", border: "1px solid var(--border)",
              borderRadius: 8, padding: "6px 12px",
              fontSize: "0.78rem", color: "var(--text)",
              fontFamily: "var(--font-display)", fontWeight: 600,
            }}>
              {f}
            </span>
          ))}
        </div>

        {/* ── ORDER BUTTONS ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${buildOrderMessage(product.name, product.price, product.flavours[0])}`}
            target="_blank" rel="noopener noreferrer"
            style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              gap: 10, background: "#25d366", color: "#fff",
              padding: "15px 24px", borderRadius: 12,
              fontFamily: "var(--font-display)", fontWeight: 700,
              fontSize: "1rem", textDecoration: "none",
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.554 4.122 1.523 5.855L0 24l6.29-1.49A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.007-1.374l-.36-.214-3.733.884.937-3.638-.234-.374A9.818 9.818 0 0112 2.182c5.424 0 9.818 4.394 9.818 9.818 0 5.425-4.394 9.818-9.818 9.818z"/>
            </svg>
            Order on WhatsApp — {product.price}
          </a>
          <Link href="/#products" style={{
            display: "block", textAlign: "center",
            padding: "13px", background: "var(--bg-2)",
            border: "1px solid var(--border)", borderRadius: 12,
            color: "var(--white)", fontFamily: "var(--font-display)",
            fontWeight: 700, fontSize: "0.9rem", textDecoration: "none",
          }}>
            ← Browse All Products
          </Link>
        </div>

        {/* ── FLAVOURS ── */}
        {product.flavours.length > 1 && (
          <div style={{
            background: "var(--bg-2)", border: "1px solid var(--border)",
            borderRadius: 14, padding: "18px", marginBottom: 20,
          }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1rem", marginBottom: 4 }}>
              Available Flavours
            </h2>
            <p style={{ fontSize: "0.75rem", color: "var(--muted)", marginBottom: 12 }}>
              Tap any flavour to order it directly on WhatsApp
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {product.flavours.map(f => (
                <a
                  key={f}
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${buildOrderMessage(product.name, product.price, f)}`}
                  target="_blank" rel="noopener noreferrer"
                  style={{
                    background: "var(--bg-3)", border: "1px solid var(--border)",
                    borderRadius: 20, padding: "7px 14px",
                    fontSize: "0.82rem", color: "var(--text)",
                    fontFamily: "var(--font-display)", fontWeight: 600,
                    textDecoration: "none",
                  }}
                >
                  {f}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* ── ABOUT ── */}
        <div style={{
          background: "var(--bg-2)", border: "1px solid var(--border)",
          borderRadius: 14, padding: "18px", marginBottom: 20,
        }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1rem", marginBottom: 10 }}>
            About {product.name}
          </h2>
          <p style={{ color: "var(--text)", fontSize: "0.9rem", lineHeight: 1.75, marginBottom: 12 }}>
            {product.longDescription}
          </p>
          <p style={{ color: "var(--muted)", fontSize: "0.82rem", lineHeight: 1.6 }}>
            Order {product.name} in Bangalore for fast 30-45 minute delivery. We deliver vapes across
            BTM Layout, HSR Layout, Koramangala, Indiranagar, Whitefield, Marathahalli, Electronic City
            and 20+ areas. All products are 100% authentic with discreet packaging.
          </p>
        </div>

        {/* ── DELIVERY AREAS ── */}
        <div style={{
          background: "var(--bg-2)", border: "1px solid var(--border)",
          borderRadius: 14, padding: "18px", marginBottom: 20,
        }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1rem", marginBottom: 4 }}>
            {product.name} Delivery Areas in Bangalore
          </h2>
          <p style={{ fontSize: "0.78rem", color: "var(--muted)", marginBottom: 12 }}>
            We deliver {product.name} across all major areas in Bangalore in 30-45 minutes.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {AREAS.map(area => (
              <Link
                key={area}
                href={`/vape-delivery/${area.toLowerCase().replace(/\s+/g, "-")}`}
                style={{
                  background: "var(--bg-3)", border: "1px solid var(--border)",
                  borderRadius: 20, padding: "5px 12px",
                  fontSize: "0.75rem", color: "var(--muted)",
                  fontFamily: "var(--font-display)", fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                {area}
              </Link>
            ))}
          </div>
        </div>

        {/* ── INTERNAL LINKS ── */}
        <div style={{
          background: "var(--bg-2)", border: "1px solid var(--border)",
          borderRadius: 14, padding: "18px", marginBottom: 20,
        }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1rem", marginBottom: 12 }}>
            Shop More at VapeInBangalore
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { label: "🛍 All Products — Vapes, Pods & Tobacco", href: "/#products" },
              { label: "⚡ Disposable Vapes in Bangalore", href: "/#products" },
              { label: "🔄 Reusable Pod Devices", href: "/#products" },
              { label: "📦 Order on WhatsApp — 30-45 Min Delivery", href: `https://wa.me/${WHATSAPP_NUMBER}?text=Hi! I want to order a vape in Bangalore.` },
              { label: "📝 Vape Delivery Blog & Guides", href: "/blog" },
            ].map(link => (
              <Link
                key={link.label}
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "10px 12px", borderRadius: 8,
                  background: "var(--bg-3)", border: "1px solid var(--border)",
                  color: "var(--text)", textDecoration: "none",
                  fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.82rem",
                  transition: "border-color 0.2s",
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* ── SEO TEXT ── */}
        <div style={{
          background: "var(--bg-2)", border: "1px solid var(--border)",
          borderRadius: 14, padding: "18px", marginBottom: 24,
        }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1rem", marginBottom: 10 }}>
            Buy {product.name} Online in Bangalore
          </h2>
          <p style={{ color: "var(--muted)", fontSize: "0.82rem", lineHeight: 1.7 }}>
            Looking to buy {product.name} in Bangalore? VapeInBangalore offers the fastest vape delivery
            in Bangalore — 30 to 45 minutes to your door. We stock authentic {product.brand} products
            at the best prices. Whether you're in South Bangalore, North Bangalore, East or West —
            we cover all areas. Order vape online in Bangalore through WhatsApp for a seamless,
            discreet delivery experience. No minimum order. Cash on delivery available.
          </p>
        </div>

        {/* ── RELATED PRODUCTS ── */}
        {related.length > 0 && (
          <div>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1rem", marginBottom: 14 }}>
              You May Also Like
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
              {related.map(p => (
                <Link key={p.slug} href={`/products/${p.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                  <div style={{
                    background: "var(--bg-2)", border: "1px solid var(--border)",
                    borderRadius: 12, overflow: "hidden",
                  }}>
                    <div style={{ position: "relative", height: 140, background: "var(--bg-3)" }}>
                      <Image src={p.image} alt={`${p.name} — Buy in Bangalore`} fill style={{ objectFit: "contain", padding: 8 }} sizes="200px" />
                    </div>
                    <div style={{ padding: "10px 12px" }}>
                      <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.82rem", marginBottom: 4, lineHeight: 1.2 }}>
                        {p.name}
                      </p>
                      <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: "var(--green)", fontSize: "0.9rem" }}>
                        {p.price}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
