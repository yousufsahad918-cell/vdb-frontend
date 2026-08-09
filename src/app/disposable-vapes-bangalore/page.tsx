import type { Metadata } from "next";
import Link from "next/link";
import { products } from "@/lib/products";

export const metadata: Metadata = {
  title: "Disposable Vapes Bangalore — Buy Online | 30 Min Delivery | VapeDeliveryBangalore.com",
  description: "Buy disposable vapes in Bangalore with 30 min delivery. Elfbar, Lost Mary, Nasty, IGET and more. 100% original.",
  alternates: { canonical: "https://vapedeliverybangalore.com/disposable-vapes-bangalore" },
};

const filtered = products.filter((p: any) => {
  const slug = "disposable-vapes-bangalore";
  if (slug === "elfbar-bangalore") return p.brand === "Elfbar";
  if (slug === "zyn-bangalore") return p.brand === "ZYN";
  if (slug === "caliburn-bangalore") return p.brand === "Caliburn";
  if (slug === "disposable-vapes-bangalore") return p.category === "Disposable";
  if (slug === "nicotine-pouches-bangalore") return ["ZYN", "Velo"].includes(p.brand);
  if (slug === "lost-mary-bangalore") return p.brand === "Lost Mary";
  return false;
});

export default function Page() {
  return (
    <main style={{ minHeight: "100vh", background: "#f6faf7", paddingBottom: 80 }}>
      <div style={{ background: "#14532d", padding: "32px 16px 24px" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <Link href="/" style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.78rem", textDecoration: "none", marginBottom: 12, display: "inline-block" }}>← Back to Home</Link>
          <h1 style={{ color: "#fff", fontSize: "1.8rem", fontWeight: 900, marginBottom: 8 }}>DISPOSABLE VAPES BANGALORE</h1>
          <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "0.88rem", lineHeight: 1.6 }}>Buy disposable vapes in Bangalore with 30 minute delivery. Elfbar, Lost Mary, Nasty, IGET and more. All 100% original. Order on WhatsApp.</p>
        </div>
      </div>
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "24px 16px" }}>
        <a href={`https://wa.me/919074445985?text=Hi%2C%20I%20want%20to%20order%20disposable%20vape%20in%20Bangalore.%20Please%20confirm%20availability.`}
          target="_blank" rel="noopener noreferrer"
          style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#25D366", color: "#fff", padding: "12px 24px", borderRadius: 8, fontWeight: 700, fontSize: "0.9rem", textDecoration: "none", marginBottom: 24 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          Order on WhatsApp
        </a>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "12px" }}>
          {filtered.map((p: any) => (
            <Link key={p.slug} href={`/products/${p.slug}`}
              style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "16px", textDecoration: "none", display: "block", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
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
