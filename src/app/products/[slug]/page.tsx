import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import LivePrice from "@/components/LivePrice";
import OrderButton from "@/components/OrderButton";
import { products, getRelatedProducts } from "@/lib/products";

interface Props { params: { slug: string } }

export async function generateStaticParams() {
  return products.map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = products.find(p => p.slug === params.slug);
  const dynamicFAQs = getLongTailFAQs(product);
  if (!product) return {};
  return {
    title: product.metaTitle,
    description: product.metaDescription,
    alternates: { canonical: `https://vapedeliverybangalore.com/products/${product.slug}` },
    keywords: [
      "vape in bangalore", "vapes in bangalore", "vape delivery bangalore",
      "buy vape bangalore", "vape near me bangalore", product.name,
      (product.brand ?? ""), `${product.brand ?? ""} bangalore`, "disposable vape bangalore",
      "vape shop bangalore", "order vape bangalore", "fast vape delivery bangalore"
    ],
    openGraph: {
      title: product.metaTitle,
      description: product.metaDescription,
      images: [{ url: `https://vapedeliverybangalore.com${product.image}` }],
      type: "website",
      siteName: "VapeDeliveryBangalore",
    },
  };
}


const AREAS = [
  "BTM Layout", "HSR Layout", "Koramangala", "Indiranagar", "Whitefield",
  "Marathahalli", "Electronic City", "Jayanagar", "JP Nagar", "Hebbal",
  "Yelahanka", "Rajajinagar", "Malleshwaram", "Banashankari", "Bellandur",
];

function buildOrderMessage(productName: string, price: string, flavour: string) {
  return encodeURIComponent(
    `Hi VapeDeliveryBangalore, I want to order:\n\n*${productName}*\nFlavour: ${flavour}\nPrice: ${price}\n\nPlease confirm availability and delivery to my location.`
  );
}


const getLongTailFAQs = (product: any) => {
  const { name, brand, category } = product;
  const puffs = product.puffs || product.puffCount || "high puff count";
  const nicotine = product.nicotine || "standard";
  const charging = product.charging || "Type-C";
  if (category === "Vape" || category === "Disposable") {
    return [
      { q: `How many puffs does the ${name} actually last in real-world use in Bangalore?`, a: `While the ${name} is rated for up to ${puffs} puffs, real-world usage depends on draw length. For average users in Bangalore, it typically lasts 1 to 2 weeks of regular use, offering exceptional value.` },
      { q: `Is the ${name} rechargeable, and what type of charging does it use?`, a: `Yes, the ${name} features a built-in rechargeable battery with ${charging} fast charging, ensuring you can top up the battery and enjoy the e-liquid until the very last puff.` },
      { q: `What is the nicotine strength of the ${name}?`, a: `The ${name} contains ${nicotine} nicotine, providing a smooth, satisfying throat hit. We strictly source 100% authentic products with batch tracking.` },
      { q: `How can I verify if my ${name} is 100% authentic in Bangalore?`, a: `Every genuine ${brand} device comes with a scratch-off QR code on the packaging. Simply scan it with your smartphone to verify its authenticity on the official ${brand} website. We only source directly from authorized distributors.` }
    ];
  } else if (category === "Nicotine Pouches") {
    return [
      { q: `How do I use ${name} correctly for the best experience?`, a: `Simply place a pouch between your gum and upper lip. The ${name} will release a steady, discreet stream of nicotine and flavour for up to 30-45 minutes without any smoke, vapour, or spitting.` },
      { q: `How long does a can of ${name} typically last?`, a: `A standard can of ${name} contains 20 pouches. Depending on your usage, a single can usually lasts a regular user about 2 to 3 days, making it a highly cost-effective alternative.` },
      { q: `Does ${name} contain tobacco leaf?`, a: `No, ${name} is a tobacco-free nicotine pouch. It contains pharmaceutical-grade nicotine, plant-based fibers, flavourings, and sweeteners, offering a clean, discreet experience.` },
      { q: `Can I carry ${name} to the office or on a flight in Bangalore?`, a: `Yes! Since ${name} produces no vapour, smoke, or smell, it is completely discreet and perfectly suitable for use in offices, meetings, and during flights.` }
    ];
  } else {
    return [
      { q: `What devices are compatible with ${name}?`, a: `The ${name} is highly versatile and works excellently with most standard pod systems. Check the packaging for specific device recommendations.` },
      { q: `How should I store my ${name} to maintain flavour in Bangalore's climate?`, a: `For the best flavour longevity, store your ${name} in a cool, dark place away from direct sunlight. Ensure the cap is tightly sealed to prevent oxidation.` },
      { q: `Is ${name} safe and 100% authentic?`, a: `Yes, we only stock 100% authentic products sourced from authorized distributors. Every item has batch tracking and authenticity verification.` },
      { q: `How fast is delivery for ${name} in Bangalore?`, a: `We deliver ${name} across all major Bangalore areas (Koramangala, HSR, Whitefield, Indiranagar, etc.) in 30-45 minutes via secure, discreet packaging.` }
    ];
  }
};
export default function ProductPage({ params }: Props) {
  const WHATSAPP_NUMBER = "916282878843";
  const product = products.find(p => p.slug === params.slug);
  const dynamicFAQs = getLongTailFAQs(product);
  if (!product) notFound();

  const related = getRelatedProducts(product.slug, 4);

  const categoryColor: Record<string, string> = {
    "Vape": "#16a34a",
    "E-Liquid": "#10b981",
    "Nicotine Pouches": "#3b82f6",
    "Tobacco": "#a16207",
    "Pod Device": "#a78bfa",
  };
  const catColor = categoryColor[product.category ?? ""] || "#16a34a";

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)", paddingBottom: 80 }}>

      {/* JSON-LD Product Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Product",
        "name": product.name,
        "description": product.metaDescription,
        "image": `https://vapedeliverybangalore.com${product.image}`,
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
          "seller": { "@type": "Organization", "name": "VapeDeliveryBangalore" },
          "url": `https://vapedeliverybangalore.com/products/${product.slug}`,
          "areaServed": "Bangalore",
          "deliveryLeadTime": { "@type": "QuantitativeValue", "value": 0.5, "unitCode": "HUR" },
          "shippingDetails": {
            "@type": "OfferShippingDetails",
            "shippingRate": { "@type": "MonetaryAmount", "value": "0", "currency": "INR" },
            "shippingDestination": { "@type": "DefinedRegion", "addressCountry": "IN" },
            "deliveryTime": {
              "@type": "ShippingDeliveryTime",
              "handlingTime": { "@type": "QuantitativeValue", "minValue": 0, "maxValue": 1, "unitCode": "HUR" },
              "transitTime": { "@type": "QuantitativeValue", "minValue": 0, "maxValue": 1, "unitCode": "HUR" }
            }
          },
          "hasMerchantReturnPolicy": {
            "@type": "MerchantReturnPolicy",
            "applicableCountry": "IN",
            "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
            "merchantReturnDays": 2,
            "returnMethod": "https://schema.org/ReturnByMail",
            "returnFees": "https://schema.org/FreeReturn"
          },
        },
      })}} />

      {/* BreadcrumbList Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://vapedeliverybangalore.com" },
          { "@type": "ListItem", "position": 2, "name": "Products", "item": "https://vapedeliverybangalore.com/products" },
          { "@type": "ListItem", "position": 3, "name": product.name, "item": `https://vapedeliverybangalore.com/products/${product.slug}` },
        ]
      })}} />

      {/* FAQPage Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": dynamicFAQs.map(faq => ({
          "@type": "Question",
          "name": faq.q,
          "acceptedAnswer": { "@type": "Answer", "text": faq.a }
        }))
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
            src={product.image ?? ""}
            alt={`${product.name} — Buy in Bangalore | VapeDeliveryBangalore`}
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
            <LivePrice productName={product.name} basePrice={product.price} />
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
          {(product.features ?? []).map(f => (
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
        <OrderButton
          productName={product.name}
          basePrice={product.price}
          flavour={(product.flavours ?? [])[0]?.name || ""}
          whatsappNumber={WHATSAPP_NUMBER}
          allFlavours={product.flavours?.map((f: any) => f.name) ?? []}
        />
        <Link href="/#products" style={{
          display: "block", textAlign: "center",
          padding: "13px", background: "var(--bg-2)",
          border: "1px solid var(--border)", borderRadius: 12,
          color: "var(--white)", fontFamily: "var(--font-display)",
          fontWeight: 700, fontSize: "0.9rem", textDecoration: "none",
          marginTop: 10,
        }}>
          ← Browse All Products
        </Link>

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
            and 100+ areas. All products are 100% authentic with discreet packaging.
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
            Shop More at VapeDeliveryBangalore
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { label: "🛍 All Products — Vapes, Pods & Tobacco", href: "/#products" },
              { label: "⚡ Disposable Vapes in Bangalore", href: "/#products" },
              { label: "🔄 Reusable Pod Devices", href: "/#products" },
              { label: "📦 Order on WhatsApp — 30-45 Min Delivery", href: `https://wa.me/${WHATSAPP_NUMBER}?text=Hi, I want to order a vape in Bangalore. Please confirm availability.` },
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
            Looking to buy {product.name} in Bangalore? VapeDeliveryBangalore offers the fastest vape delivery
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
                      <Image src={p.image ?? ""} alt={`${p.name} — Buy in Bangalore`} fill style={{ objectFit: "contain", padding: 8 }} sizes="200px" />
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
    
      {/* DYNAMIC LONG-TAIL FAQ SECTION */}
      <section style={{ padding: "40px 0", background: "var(--bg-2, #f8fafc)", borderTop: "1px solid var(--border, #e2e8f0)" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 16px" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text, #0f172a)", marginBottom: "20px" }}>Frequently Asked Questions About {product.name}</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {dynamicFAQs.map((faq, i) => (
              <div key={i} style={{ background: "var(--bg, #ffffff)", border: "1px solid var(--border, #e2e8f0)", borderRadius: "8px", padding: "16px" }}>
                <p style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--text, #0f172a)", marginBottom: "8px" }}>{faq.q}</p>
                <p style={{ fontSize: "0.9rem", color: "var(--muted, #64748b)", lineHeight: 1.6 }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
