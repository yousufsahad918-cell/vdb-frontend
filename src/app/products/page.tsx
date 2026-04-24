"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { products } from "@/lib/products";

const CATEGORIES = ["All", "Vape", "E-Liquid", "Nicotine Pouches", "Tobacco"];
const BRANDS = ["All", "Elfbar", "IGET", "Yuoto", "Pod Salt", "ZYN", "Velo", "Amber Leaf", "Drum", "Golden Virginia", "American Spirit"];
const SUB_CATS = ["All", "Disposable", "High Puff", "Refill", "Pouches", "Rolling Tobacco"];

export default function ProductsPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeBrand, setActiveBrand] = useState("All");
  const [activeSub, setActiveSub] = useState("All");

  const filtered = products.filter(p => {
    const catMatch = activeCategory === "All" || p.category === activeCategory;
    const brandMatch = activeBrand === "All" || p.brand === activeBrand;
    const subMatch = activeSub === "All" || p.subCategory === activeSub;
    return catMatch && brandMatch && subMatch;
  });

  const filterBtn = (active: boolean) => ({
    padding: "6px 14px", borderRadius: 20,
    background: active ? "var(--orange)" : "var(--bg-3)",
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
        <p style={{ fontSize: "0.75rem", color: "var(--orange)", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "var(--font-display)", marginBottom: 8 }}>
          All Products
        </p>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.6rem, 4vw, 2.2rem)", fontWeight: 900, marginBottom: 6 }}>
          Buy Vapes & Tobacco in Bangalore
        </h1>
        <p style={{ color: "var(--muted)", fontSize: "0.88rem", marginBottom: 24 }}>
          {products.length} products · Fast delivery across 20+ Bangalore areas
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
                    <div style={{ position: "absolute", top: 8, left: 8, background: "var(--orange)", color: "var(--btn-text)", borderRadius: 20, padding: "2px 8px", fontSize: "0.65rem", fontWeight: 700, fontFamily: "var(--font-display)" }}>
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
                      <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "0.95rem", color: "var(--orange)" }}>{product.price}</span>
                      <span style={{ fontSize: "0.72rem", color: "var(--muted)", textDecoration: "line-through" }}>{product.originalPrice}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
