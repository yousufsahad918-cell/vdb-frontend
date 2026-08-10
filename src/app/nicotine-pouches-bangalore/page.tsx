import type { Metadata } from "next";
import Link from "next/link";
import { products } from "@/lib/products";

export const metadata: Metadata = {
  title: "Nicotine Pouches Bangalore — Buy ZYN, Velo | 30 Min Delivery | VapeDeliveryBangalore.com",
  description: "Buy nicotine pouches in Bangalore with 30 min delivery. ZYN Cool Mint, Velo Freezing Peppermint. Tobacco-free.",
  alternates: { canonical: "https://vapedeliverybangalore.com/nicotine-pouches-bangalore" },
};

export default function Page() {
  const filtered = products.filter(p => ["ZYN", "Velo"].includes(p.brand));

  return (
    <main style={{ minHeight: "100vh", background: "#f6faf7", paddingBottom: 80 }}>
      <div style={{ background: "#14532d", padding: "32px 16px 24px" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <Link href="/" style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.78rem", textDecoration: "none", marginBottom: 12, display: "inline-block" }}>← Back to Home</Link>
          <h1 style={{ color: "#fff", fontSize: "1.8rem", fontWeight: 900, marginBottom: 8 }}>NICOTINE POUCHES BANGALORE</h1>
          <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "0.88rem", lineHeight: 1.6 }}>Buy nicotine pouches in Bangalore with 30 minute delivery. ZYN and Velo — tobacco-free and discreet. Order on WhatsApp.</p>
        </div>
      </div>
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "24px 16px" }}>
        <a href={`https://wa.me/916282878843?text=Hi%2C%20I%20want%20to%20order%20nicotine%20pouches%20in%20Bangalore.%20Please%20confirm%20availability.`}
          target="_blank" rel="noopener noreferrer"
          style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#25D366", color: "#fff", padding: "12px 24px", borderRadius: 8, fontWeight: 700, fontSize: "0.9rem", textDecoration: "none", marginBottom: 24 }}>
          ⚡ Order on WhatsApp
        </a>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "12px" }}>
          {filtered.map(p => (
            <Link key={p.slug} href={`/products/${p.slug}`}
              style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "16px", textDecoration: "none", display: "block" }}>
              <div style={{ fontSize: "10px", color: "#16a34a", fontWeight: 700, textTransform: "uppercase", marginBottom: "4px" }}>{p.brand}</div>
              <div style={{ fontSize: "13px", fontWeight: 600, color: "#111", marginBottom: "4px" }}>{p.name}</div>
              <div style={{ fontSize: "14px", fontWeight: 800, color: "#16a34a" }}>{p.price}</div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
