"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { products } from "@/lib/products";

const CATEGORIES = ["All", "Vape", "Pod Device", "E-Liquid", "Nicotine Pouches", "Tobacco"];
const BRANDS = ["All", "Elfbar", "Caliburn", "Lost Mary", "Nasty", "IGET", "Yuoto", "Pod Salt", "ZYN", "Velo", "Amber Leaf", "Drum", "Golden Virginia", "American Spirit"];
const SUB_CATS = ["All", "Disposable", "High Puff", "KOKO Series", "G3 Series", "G4 Series", "G5 Series", "Refill", "Pouches", "Rolling Tobacco"];

export default function ProductsPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeBrand, setActiveBrand] = useState("All");
  const [activeSub, setActiveSub] = useState("All");
  const [overrides, setOverrides] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetch("/api/product-overrides")
      .then(r => r.json())
      .then(data => {
        const map: Record<string, boolean> = {};
        (data.overrides || []).forEach((o: any) => {
          map[o.product_name] = o.in_stock !== false;
        });
        setOverrides(map);
      })
      .catch(() => {}); // fail silently, fall back to hardcoded inStock
  }, []);

  const filtered = products.filter(p => {
    const inStock = overrides[p.name] !== undefined ? overrides[p.name] : p.inStock;
    if (!inStock) return false;
    const catMatch = activeCategory === "All" || p.category === activeCategory;
    const brandMatch = activeBrand === "All" || p.brand === activeBrand;
    const subMatch = activeSub === "All" || p.subCategory === activeSub;
    return catMatch && brandMatch && subMatch;
  });

  const filterBtn = (active: boolean) => ({
    padding: "6px 14px", borderRadius: 20,
    background: active ? "var(--green)" : "var(--bg-3)",
    border: active ? "none" : "1px solid var(--border)",
    color: active ? "var(--btn-text)" : "var(--muted)",
    cursor: "pointer", fontSize: "0.78rem",
    fontFamily: "var(--font-display)", fontWeight: 600,
    whiteSpace: "nowrap" as const, flexShrink: 0,
  });

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)", paddingBottom: 80 }}>

      {/* Header */}
      <div style={{ padding: "28px 20px 0", maxWidth: 1000, margin: "0 auto" }}>
        <p style={{ fontSize: "0.75rem", color: "var(--green)", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "var(--font-display)", marginBottom: 8 }}>
          All Products
        </p>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.6rem, 4vw, 2.2rem)", fontWeight: 900, marginBottom: 6 }}>
          Buy Vapes & Tobacco in Bangalore
        </h1>
        <p style={{ color: "var(--muted)", fontSize: "0.88rem", marginBottom: 24 }}>
          {filtered.length} products · Fast delivery across 20+ Bangalore areas
        </p>

        {/* Category filter */}
        <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 4, marginBottom: 10 }}>
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => { setActiveCategory(c); setActiveBrand("All"); setActiveSub("All"); }} style={filterBtn(activeCategory === c)}>
              {c}
            </button>
          ))}
        </div>

        {/* Sub category filter */}
        <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 4, marginBottom: 20 }}>
          {SUB_CATS.map(s => (
            <button key={s} onClick={() => setActiveSub(s)} style={filterBtn(activeSub === s)}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Product grid */}
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 20px" }}>
        {filtered.length === 0 ? (
          <p style={{ color: "var(--muted)", textAlign: "center", padding: 40 }}>No products found.</p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 14 }}>
            {filtered.map(product => (
              <Link key={product.slug} href={`/products/${product.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                <div style={{ background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden", height: "100%" }}>
                  <div style={{ position: "relative", height: 160, background: "var(--bg-3)" }}>
                    <Image src={product.image} alt={product.name} fill style={{ objectFit: "contain", padding: 8 }} sizes="200px" />
                    <div style={{ position: "absolute", top: 8, left: 8, background: "var(--green)", color: "var(--btn-text)", borderRadius: 20, padding: "2px 8px", fontSize: "0.65rem", fontWeight: 700, fontFamily: "var(--font-display)" }}>
                      {product.discount}
                    </div>
                  </div>
                  <div style={{ padding: "10px 12px 14px" }}>
                    <p style={{ fontSize: "0.65rem", color: "var(--muted)", fontFamily: "var(--font-display)", fontWeight: 600, marginBottom: 3, textTransform: "uppercase" }}>
                      {product.brand} · {product.subCategory}
                    </p>
                    <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.85rem", marginBottom: 4, lineHeight: 1.2 }}>{product.name}</p>
                    <p style={{ fontSize: "0.72rem", color: "var(--muted)", marginBottom: 6 }}>{product.puffs}</p>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                      <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "0.95rem", color: "var(--green)" }}>{product.price}</span>
                      <span style={{ fontSize: "0.72rem", color: "var(--muted)", textDecoration: "line-through" }}>{product.originalPrice}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Sticky WhatsApp order button */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, padding: "12px 20px", background: "var(--bg-2)", borderTop: "1px solid var(--border)", zIndex: 100 }}>
        <a
          href="https://wa.me/916282878843?text=Hi! I want to order a vape in Bangalore."
          target="_blank" rel="noopener noreferrer"
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "#25d366", color: "#fff", padding: "13px", borderRadius: 10, fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.95rem", textDecoration: "none" }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.554 4.122 1.523 5.855L0 24l6.29-1.49A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.007-1.374l-.36-.214-3.733.884.937-3.638-.234-.374A9.818 9.818 0 0112 2.182c5.424 0 9.818 4.394 9.818 9.818 0 5.425-4.394 9.818-9.818 9.818z"/></svg>
          Order on WhatsApp — 30-45 Min Delivery
        </a>
      </div>
      <div style={{ height: 76 }} />
    </main>
  );
}
