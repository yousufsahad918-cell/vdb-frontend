"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart";
import { useEffect, useRef, useState } from "react";
import { products } from "@/lib/products";

const BRAND_GROUPS = [
  {
    brand: "Elfbar", color: "#16a34a",
    items: [
      { label: "Elfbar 600 — Disposable", match: (n: string) => n === "Elfbar 600" },
      { label: "Raya D1", match: (n: string) => n === "Elfbar Raya D1" },
      { label: "Raya D3", match: (n: string) => n === "Elfbar Raya D3" },
      { label: "D3 Pro", match: (n: string) => n === "Elfbar D3 Pro" },
      { label: "Ice King", match: (n: string) => n.includes("Ice King") },
      { label: "BC 10000", match: (n: string) => n.includes("BC") },
      { label: "Raya SOBO", match: (n: string) => n.includes("SOBO") },
      { label: "Trio", match: (n: string) => n.includes("Trio") },
      { label: "MoonNight 40K", match: (n: string) => n.includes("MoonNight") },
      { label: "Elfliq Nic Salts", match: (n: string) => n.includes("Elfliq") },
    ],
  },
  {
    brand: "Lost Mary", color: "#0891b2",
    items: [
      { label: "MT35000 Turbo", match: (n: string) => n.includes("MT35000") },
      { label: "MO10000", match: (n: string) => n.includes("MO10000") },
    ],
  },
  {
    brand: "Nasty", color: "#ca8a04",
    items: [{ label: "Bolt WTF 50K", match: (n: string) => n.includes("Nasty") }],
  },
  {
    brand: "IGET", color: "#0284c7",
    items: [{ label: "Astro B18000", match: (n: string) => n.includes("IGET") }],
  },
  {
    brand: "Yuoto", color: "#dc2626",
    items: [{ label: "Beyonder 7000", match: (n: string) => n.includes("Yuoto") }],
  },
  {
    brand: "Pod Salt", color: "#ea580c",
    items: [
      { label: "Hit The Spot 35K", match: (n: string) => n.includes("Hit The Spot") },
      { label: "Core Nic Salt", match: (n: string) => n.includes("Core") },
    ],
  },
  {
    brand: "Caliburn", color: "#7c3aed",
    items: [
      { label: "KOKO GK3", match: (n: string) => n.includes("KOKO GK3") },
      { label: "G3 Lite", match: (n: string) => n === "Caliburn G3 Lite" },
      { label: "G3 Lite KOKO", match: (n: string) => n === "Caliburn G3 Lite KOKO" },
      { label: "G3 Pro KOKO", match: (n: string) => n.includes("G3 Pro") },
      { label: "G4", match: (n: string) => n === "Caliburn G4" },
      { label: "G4 Mini", match: (n: string) => n.includes("G4 Mini") },
      { label: "G4 Pro", match: (n: string) => n === "Caliburn G4 Pro" },
      { label: "G4 Pro KOKO", match: (n: string) => n.includes("G4 Pro KOKO") },
      { label: "G5 Lite", match: (n: string) => n === "Caliburn G5 Lite" },
      { label: "G5 Lite SE", match: (n: string) => n.includes("G5 Lite SE") },
      { label: "G5 Lite KOKO", match: (n: string) => n.includes("G5 Lite KOKO") },
    ],
  },
  {
    brand: "Pouches", color: "#2563eb",
    items: [
      { label: "ZYN Cool Mint", match: (n: string) => n.includes("ZYN") },
      { label: "Velo Freezing Peppermint", match: (n: string) => n.includes("Velo") },
    ],
  },
  {
    brand: "Tobacco", color: "#92400e",
    items: [
      { label: "Amber Leaf", match: (n: string) => n.includes("Amber") },
      { label: "Drum Bright Blue", match: (n: string) => n.includes("Drum") },
      { label: "Golden Virginia", match: (n: string) => n.includes("Golden") },
      { label: "Natural American Spirit", match: (n: string) => n.includes("American") },
    ],
  },
];

export default function Nav() {
  const { itemCount, setIsOpen } = useCart();
  const prevCount = useRef(itemCount);
  const [blinking, setBlinking] = useState(false);
  const [brandsOpen, setBrandsOpen] = useState(false);
  const [expandedBrand, setExpandedBrand] = useState<string | null>(null);
  const touchStartY = useRef(0);

  useEffect(() => {
    if (itemCount > prevCount.current) {
      setBlinking(false);
      requestAnimationFrame(() => requestAnimationFrame(() => setBlinking(true)));
      setTimeout(() => setBlinking(false), 900);
    }
    prevCount.current = itemCount;
  }, [itemCount]);

  const scrollToProduct = (matchFn: (n: string) => boolean) => {
    const product = products.find(p => matchFn(p.name));
    if (!product) return;
    setBrandsOpen(false);
    setTimeout(() => {
      const cards = document.querySelectorAll(".product-card");
      cards.forEach(card => {
        const h3 = card.querySelector("h3");
        if (h3?.textContent === product.name) {
          card.scrollIntoView({ behavior: "smooth", block: "center" });
          (card as HTMLElement).style.outline = "2px solid var(--green)";
          setTimeout(() => { (card as HTMLElement).style.outline = "none"; }, 1800);
        }
      });
    }, 350);
  };

  const recordTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleBrandTouch = (brand: string) => (e: React.TouchEvent) => {
    const dy = Math.abs(e.changedTouches[0].clientY - touchStartY.current);
    if (dy < 8) setExpandedBrand(prev => prev === brand ? null : brand);
  };

  const handleItemTouch = (matchFn: (n: string) => boolean) => (e: React.TouchEvent) => {
    const dy = Math.abs(e.changedTouches[0].clientY - touchStartY.current);
    if (dy < 8) scrollToProduct(matchFn);
  };

  return (
    <>
      <nav className="nav">
        <div className="nav-inner">
          <Link href="/" className="nav-logo">
            <span className="nav-logo-vape">VAPE</span>
            <span className="nav-logo-dot">●</span>
            <span className="nav-logo-blr">DELIVERY</span>
            <span className="nav-logo-dot">●</span>
            <span className="nav-logo-blr">BLR</span>
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Link href="/blog" style={{
              color: "var(--muted)", fontFamily: "var(--font-display)",
              fontWeight: 600, fontSize: "0.78rem", padding: "7px 8px",
              borderRadius: 8, WebkitTapHighlightColor: "transparent", touchAction: "manipulation",
            }}>
              Blog
            </Link>
            <button
              onClick={() => setBrandsOpen(true)}
              style={{
                background: "var(--bg-3)", border: "1px solid var(--border)",
                color: "var(--text)", borderRadius: 8, padding: "7px 10px",
                cursor: "pointer", fontFamily: "var(--font-display)", fontWeight: 700,
                fontSize: "0.78rem", display: "flex", alignItems: "center", gap: 4,
                WebkitTapHighlightColor: "transparent", touchAction: "manipulation", flexShrink: 0,
              }}
            >
              <span>☰</span> Brands
            </button>
            <button
              onClick={() => setIsOpen(true)}
              className={blinking ? "cart-blink" : ""}
              style={{
                position: "relative",
                background: itemCount > 0 ? "var(--green)" : "var(--bg-3)",
                border: itemCount > 0 ? "none" : "1px solid var(--border)",
                color: itemCount > 0 ? "var(--btn-text)" : "var(--text)",
                borderRadius: 8, padding: "7px 12px", cursor: "pointer",
                fontFamily: "var(--font-display)", fontWeight: 700,
                fontSize: "0.78rem", display: "flex", alignItems: "center", gap: 5,
                WebkitTapHighlightColor: "transparent", touchAction: "manipulation",
                transition: "background 0.2s, color 0.2s", flexShrink: 0,
              }}
            >
              Cart
              {itemCount > 0 && (
                <span style={{
                  background: "rgba(255,255,255,0.25)", color: "#fff",
                  borderRadius: "50%", width: 16, height: 16,
                  fontSize: "0.65rem", fontWeight: 800,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Brands bottom sheet */}
      {brandsOpen && (
        <>
          <div onClick={() => setBrandsOpen(false)}
            style={{ position: "fixed", inset: 0, background: "rgba(26,58,36,0.5)", zIndex: 10020, backdropFilter: "blur(4px)" }}
          />
          <div style={{
            position: "fixed", bottom: 0, left: 0, right: 0,
            background: "var(--bg-2)", borderRadius: "20px 20px 0 0",
            border: "1px solid var(--border)", borderBottom: "none",
            zIndex: 10021, maxHeight: "80vh", display: "flex", flexDirection: "column",
            animation: "sheetUp 0.3s ease",
          }}>
            <div style={{ padding: "14px 20px 10px", borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
              <div style={{ width: 40, height: 4, background: "var(--border)", borderRadius: 2, margin: "0 auto 12px" }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1rem", color: "var(--text)" }}>Browse by Brand</p>
                <button onClick={() => setBrandsOpen(false)}
                  style={{ background: "var(--bg-3)", border: "1px solid var(--border)", color: "var(--muted)", borderRadius: 8, padding: "6px 10px", cursor: "pointer", touchAction: "manipulation" }}>
                  ✕
                </button>
              </div>
            </div>
            <div style={{ overflowY: "auto", padding: "10px 16px 40px", flex: 1 }} onTouchStart={recordTouchStart}>
              {BRAND_GROUPS.map(group => (
                <div key={group.brand} style={{ marginBottom: 6 }}>
                  <div
                    onTouchStart={recordTouchStart}
                    onTouchEnd={handleBrandTouch(group.brand)}
                    onClick={() => setExpandedBrand(prev => prev === group.brand ? null : group.brand)}
                    style={{
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      padding: "12px 14px", borderRadius: 10, cursor: "pointer",
                      background: expandedBrand === group.brand ? group.color + "12" : "var(--bg-3)",
                      border: `1px solid ${expandedBrand === group.brand ? group.color + "44" : "var(--border)"}`,
                      touchAction: "pan-y", userSelect: "none",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: group.color, flexShrink: 0 }} />
                      <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "0.9rem", color: expandedBrand === group.brand ? group.color : "var(--text)" }}>
                        {group.brand}
                      </span>
                      <span style={{ fontSize: "0.7rem", color: "var(--muted)", background: "var(--bg-3)", borderRadius: 20, padding: "2px 8px", border: "1px solid var(--border)" }}>
                        {group.items.length}
                      </span>
                    </div>
                    <span style={{ color: "var(--muted)", fontSize: "0.8rem" }}>
                      {expandedBrand === group.brand ? "▾" : "▸"}
                    </span>
                  </div>
                  {expandedBrand === group.brand && (
                    <div style={{ paddingLeft: 10, paddingTop: 4, display: "flex", flexDirection: "column", gap: 4 }}>
                      {group.items.map(item => (
                        <div
                          key={item.label}
                          onTouchStart={recordTouchStart}
                          onTouchEnd={handleItemTouch(item.match)}
                          onClick={() => scrollToProduct(item.match)}
                          style={{
                            padding: "10px 14px", borderRadius: 8, cursor: "pointer",
                            background: "var(--bg-2)", border: "1px solid var(--border)",
                            display: "flex", alignItems: "center", gap: 8,
                            touchAction: "pan-y", userSelect: "none",
                          }}
                        >
                          <span style={{ width: 4, height: 4, borderRadius: "50%", background: group.color, flexShrink: 0 }} />
                          <span style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.82rem", color: "var(--text)" }}>
                            {item.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
}
