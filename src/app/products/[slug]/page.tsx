import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { products, getRelatedProducts } from "@/lib/products";
import { WHATSAPP_URL } from "@/lib/locations";

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
    openGraph: {
      title: product.metaTitle,
      description: product.metaDescription,
      images: [{ url: product.image }],
      type: "article",
    },
  };
}

const WHATSAPP_NUMBER = "916282878843";

function buildOrderMessage(product: typeof products[0], flavour: string) {
  return encodeURIComponent(
    `Hi! I want to order:\n\n*${product.name}*\nFlavour: ${flavour}\nPrice: ${product.price}\n\nPlease confirm availability and delivery to my location.`
  );
}

export default function ProductPage({ params }: Props) {
  const product = products.find(p => p.slug === params.slug);
  if (!product) notFound();

  const related = getRelatedProducts(product.slug);

  const categoryColor: Record<string, string> = {
    "Vape": "#f8c105",
    "E-Liquid": "#10b981",
    "Nicotine Pouches": "#3b82f6",
    "Tobacco": "#78350f",
  };

  const catColor = categoryColor[product.category] || "#f8c105";

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)", paddingBottom: 80 }}>

      {/* Breadcrumb */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "16px 20px 0" }}>
        <p style={{ fontSize: "0.78rem", color: "var(--muted)" }}>
          <Link href="/" style={{ color: "var(--muted)", textDecoration: "none" }}>Home</Link>
          {" · "}
          <Link href="/products" style={{ color: "var(--muted)", textDecoration: "none" }}>Products</Link>
          {" · "}
          <span style={{ color: "var(--white)" }}>{product.name}</span>
        </p>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "20px" }}>

        {/* Product hero */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 32 }}>

          {/* Image */}
          <div style={{ position: "relative", aspectRatio: "1/1", borderRadius: 16, overflow: "hidden", background: "var(--bg-2)", border: "1px solid var(--border)" }}>
            <Image src={product.image} alt={product.name} fill style={{ objectFit: "contain", padding: 16 }} sizes="(max-width: 640px) 100vw, 450px" />
            <div style={{ position: "absolute", top: 12, left: 12, background: "var(--orange)", color: "var(--btn-text)", borderRadius: 20, padding: "3px 10px", fontSize: "0.72rem", fontWeight: 700, fontFamily: "var(--font-display)" }}>
              {product.discount}
            </div>
          </div>

          {/* Info */}
          <div>
            {/* Category + brand */}
            <div style={{ display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap" }}>
              <span style={{ background: catColor + "22", color: catColor, border: `1px solid ${catColor}44`, borderRadius: 20, padding: "3px 10px", fontSize: "0.7rem", fontWeight: 700, fontFamily: "var(--font-display)" }}>
                {product.category}
              </span>
              <span style={{ background: "var(--bg-3)", border: "1px solid var(--border)", borderRadius: 20, padding: "3px 10px", fontSize: "0.7rem", color: "var(--muted)", fontFamily: "var(--font-display)" }}>
                {product.brand}
              </span>
              <span style={{ background: "var(--bg-3)", border: "1px solid var(--border)", borderRadius: 20, padding: "3px 10px", fontSize: "0.7rem", color: "var(--muted)", fontFamily: "var(--font-display)" }}>
                {product.subCategory}
              </span>
            </div>

            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.3rem, 3vw, 1.8rem)", fontWeight: 900, marginBottom: 8, lineHeight: 1.2 }}>
              {product.name}
            </h1>

            <p style={{ fontSize: "0.88rem", color: "var(--muted)", marginBottom: 16, lineHeight: 1.5 }}>
              {product.description}
            </p>

            {/* Price */}
            <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 20 }}>
              <span style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", fontWeight: 900, color: "var(--orange)" }}>
                {product.price}
              </span>
              <span style={{ fontSize: "1rem", color: "var(--muted)", textDecoration: "line-through" }}>
                {product.originalPrice}
              </span>
              <span style={{ background: "var(--orange)22", color: "var(--orange)", border: "1px solid var(--orange)44", borderRadius: 20, padding: "2px 8px", fontSize: "0.72rem", fontWeight: 700 }}>
                {product.discount}
              </span>
            </div>

            {/* Puffs badge */}
            <div style={{ background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: 10, padding: "10px 14px", marginBottom: 16, display: "inline-block" }}>
              <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1rem", color: "var(--white)" }}>{product.puffs}</p>
              <p style={{ fontSize: "0.72rem", color: "var(--muted)" }}>{product.nicotine}</p>
            </div>

            {/* Features */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 20 }}>
              {product.features.map(f => (
                <span key={f} style={{ background: "var(--bg-3)", border: "1px solid var(--border)", borderRadius: 8, padding: "4px 10px", fontSize: "0.72rem", color: "var(--muted)", fontFamily: "var(--font-display)", fontWeight: 600 }}>
                  {f}
                </span>
              ))}
            </div>

            {/* Order button */}
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${buildOrderMessage(product, product.flavours[0])}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "#25d366", color: "#fff", padding: "14px 24px", borderRadius: 12, fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1rem", textDecoration: "none", marginBottom: 10 }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.554 4.122 1.523 5.855L0 24l6.29-1.49A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.007-1.374l-.36-.214-3.733.884.937-3.638-.234-.374A9.818 9.818 0 0112 2.182c5.424 0 9.818 4.394 9.818 9.818 0 5.425-4.394 9.818-9.818 9.818z"/>
              </svg>
              Order on WhatsApp
            </a>
            <Link href="/#products" style={{ display: "block", textAlign: "center", padding: "12px", background: "var(--bg-3)", border: "1px solid var(--border)", borderRadius: 12, color: "var(--white)", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.9rem", textDecoration: "none" }}>
              Browse All Products →
            </Link>
          </div>
        </div>

        {/* Description */}
        <div style={{ background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: 14, padding: "20px", marginBottom: 24 }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1rem", marginBottom: 12 }}>About {product.name}</h2>
          <p style={{ color: "var(--text)", fontSize: "0.9rem", lineHeight: 1.75 }}>{product.longDescription}</p>
        </div>

        {/* Flavours */}
        {product.flavours.length > 1 && (
          <div style={{ background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: 14, padding: "20px", marginBottom: 24 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1rem", marginBottom: 12 }}>Available Flavours</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {product.flavours.map(f => (
                <a
                  key={f}
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${buildOrderMessage(product, f)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ background: "var(--bg-3)", border: "1px solid var(--border)", borderRadius: 20, padding: "6px 14px", fontSize: "0.82rem", color: "var(--text)", fontFamily: "var(--font-display)", fontWeight: 600, textDecoration: "none", transition: "border-color 0.2s" }}
                >
                  {f}
                </a>
              ))}
            </div>
            <p style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: 10 }}>Tap any flavour to order it directly on WhatsApp</p>
          </div>
        )}

        {/* Related products */}
        {related.length > 0 && (
          <div>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1rem", marginBottom: 14 }}>You May Also Like</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12 }}>
              {related.map(p => (
                <Link key={p.slug} href={`/products/${p.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                  <div style={{ background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
                    <div style={{ position: "relative", height: 140, background: "var(--bg-3)" }}>
                      <Image src={p.image} alt={p.name} fill style={{ objectFit: "contain", padding: 8 }} sizes="200px" />
                    </div>
                    <div style={{ padding: "10px 12px" }}>
                      <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.82rem", marginBottom: 4 }}>{p.name}</p>
                      <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: "var(--orange)", fontSize: "0.9rem" }}>{p.price}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* JSON-LD Product Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Product",
        "name": product.name,
        "description": product.metaDescription,
        "image": `https://vapeinbangalore.in${product.image}`,
        "brand": { "@type": "Brand", "name": product.brand },
        "offers": {
          "@type": "Offer",
          "price": product.price.replace(/[₹,]/g, ""),
          "priceCurrency": "INR",
          "availability": product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
          "seller": { "@type": "Organization", "name": "VapeInBangalore" },
          "url": `https://vapeinbangalore.in/products/${product.slug}`,
        },
      })}} />
    </main>
  );
}
