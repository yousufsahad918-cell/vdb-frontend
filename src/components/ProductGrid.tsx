"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { products } from "@/lib/products";
import { useCart } from "@/lib/cart";

interface ProductOverride {
  product_name: string;
  tag: string;
  flavours: string[];
  in_stock: boolean;
  price?: number;
}

const ADMIN_PHONE = "916282878843";

const TAG_COLORS: Record<string, { bg: string; color: string }> = {
  "Fast Selling":    { bg: "#f59e0b22", color: "#f59e0b" },
  "New Arrival":     { bg: "#3b82f622", color: "#3b82f6" },
  "Stock Out":       { bg: "#ef444422", color: "#ef4444" },
  "Limited Stock":   { bg: "#8b5cf622", color: "#8b5cf6" },
  "Best Value":      { bg: "#10b98122", color: "#10b981" },
  "People's Choice": { bg: "#f8c10522", color: "#c49a04" },
  "Low Stock":       { bg: "#ef444422", color: "#ef4444" },
  "POD DEVICE":      { bg: "#06b6d422", color: "#06b6d4" },
  "FLAGSHIP":        { bg: "#f8c10522", color: "#c49a04" },
  "TOP OF LINE":     { bg: "#a855f722", color: "#a855f7" },
  "LATEST GEN":      { bg: "#10b98122", color: "#10b981" },
  "LATEST KOKO":     { bg: "#2dd4bf22", color: "#0d9488" },
  "SPECIAL EDITION": { bg: "#f9731622", color: "#f97316" },
  "SMOKE-FREE":      { bg: "#3b82f622", color: "#3b82f6" },
  "TOBACCO":         { bg: "#78350f22", color: "#a16207" },
  "REFILL LIQUID":   { bg: "#10b98122", color: "#10b981" },
  "MOST POWERFUL":   { bg: "#7c3aed22", color: "#7c3aed" },
  "GOOD VALUE":      { bg: "#10b98122", color: "#10b981" },
  "BEGINNER PICK":   { bg: "#ec489922", color: "#ec4899" },
  "ONLY FEW LEFT":   { bg: "#ef444422", color: "#ef4444" },
};

function buildNotifyWAMessage(productName: string, phone: string): string {
  return encodeURIComponent(`Hi! I want to be notified when ${productName} is back in stock. My number is ${phone}.`);
}

export default function ProductGrid() {
  const { addToCart, total, itemCount, setIsOpen } = useCart();
  const [flavourSheet, setFlavourSheet] = useState<string | null>(null);
  const [selectedFlavours, setSelectedFlavours] = useState<Record<string, string>>({});
  const [addedMap, setAddedMap] = useState<Record<string, boolean>>({});
  const [toast, setToast] = useState<{ name: string; flavour: string } | null>(null);
  const [overrides, setOverrides] = useState<ProductOverride[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState<string | null>(null);
  const [showWALabel, setShowWALabel] = useState(false);
  const [showWA, setShowWA] = useState(false);
  const [notifyProduct, setNotifyProduct] = useState<string | null>(null);
  const [notifyPhone, setNotifyPhone] = useState("");
  const [notifySubmitting, setNotifySubmitting] = useState(false);
  const [notifyDone, setNotifyDone] = useState(false);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const productRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Fetch overrides
  useEffect(() => {
    fetch("/api/product-overrides")
      .then(r => r.json())
      .then(d => setOverrides(d.overrides || []))
      .catch(() => {});
  }, []);

  // WhatsApp float — hidden initially, appears with label after 15s
  useEffect(() => {
    const t = setTimeout(() => {
      setShowWA(true);
      setShowWALabel(true);
      setTimeout(() => setShowWALabel(false), 3500);
    }, 15000);
    return () => clearTimeout(t);
  }, []);

  // Show sidebar only when products section is scrolled into view
  useEffect(() => {
    const handleSidebarVisibility = () => {
      const productsEl = document.getElementById("products");
      const sidebar = document.querySelector(".product-sidebar") as HTMLElement;
      if (!productsEl || !sidebar) return;
      const rect = productsEl.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.8) {
        sidebar.classList.add("visible");
      } else {
        sidebar.classList.remove("visible");
      }
    };
    window.addEventListener("scroll", handleSidebarVisibility, { passive: true });
    handleSidebarVisibility();
    return () => window.removeEventListener("scroll", handleSidebarVisibility);
  }, []);

  const getOverride = (name: string) => overrides.find(o => o.product_name === name);

  const handleAddToCart = (product: typeof products[0]) => {
    const override = getOverride(product.name);
    if (override && !override.in_stock) return;
    const flavour = selectedFlavours[product.name];
    if (!flavour) { setFlavourSheet(product.name); return; }
    const basePrice = parseInt(product.price.replace(/[₹,]/g, ""));
    const finalPrice = override?.price || basePrice;
    addToCart({
      product_id: product.name.toLowerCase().replace(/\s+/g, "-"),
      name: product.name,
      price: finalPrice,
      image: product.image,
      puffs: product.puffs,
      flavour,
    });
    const key = `${product.name}__${flavour}`;
    setAddedMap(prev => ({ ...prev, [key]: true }));
    setTimeout(() => setAddedMap(prev => ({ ...prev, [key]: false })), 1400);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ name: product.name, flavour });
    toastTimerRef.current = setTimeout(() => setToast(null), 3500);
    setFlavourSheet(null);
  };

  const scrollToProduct = (productName: string) => {
    const el = productRefs.current[productName];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      setActiveProduct(productName);
      setTimeout(() => setActiveProduct(null), 1500);
    }
    setSidebarOpen(false);
  };

  const handleNotifySubmit = async () => {
    if (!notifyPhone || notifyPhone.length < 10) return;
    setNotifySubmitting(true);

    // Log to MongoDB
    await fetch("/api/notify-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product_name: notifyProduct, phone: notifyPhone }),
    }).catch(() => {});

    // Open WhatsApp
    const msg = buildNotifyWAMessage(notifyProduct!, notifyPhone);
    window.open(`https://wa.me/${ADMIN_PHONE}?text=${msg}`, "_blank");

    setNotifySubmitting(false);
    setNotifyDone(true);
    setTimeout(() => {
      setNotifyProduct(null);
      setNotifyPhone("");
      setNotifyDone(false);
    }, 2000);
  };

  const sheetProduct = products.find(p => p.name === flavourSheet);

  // Hierarchical brand groups
  const BRAND_GROUPS = [
    {
      brand: "Elfbar",
      color: "#f8c105",
      products: [
        { label: "600", match: (n: string) => n === "Elfbar 600" },
        { label: "Raya D1", match: (n: string) => n === "Elfbar Raya D1" },
        { label: "Raya D3", match: (n: string) => n === "Elfbar Raya D3" },
        { label: "D3 Pro", match: (n: string) => n === "Elfbar D3 Pro" },
        { label: "Ice King", match: (n: string) => n.includes("Ice King") },
        { label: "BC 10000", match: (n: string) => n.includes("BC") },
        { label: "Raya SOBO", match: (n: string) => n.includes("SOBO") },
        { label: "Trio", match: (n: string) => n.includes("Trio") },
        { label: "MoonNight", match: (n: string) => n.includes("MoonNight") },
        { label: "Elfliq Refill", match: (n: string) => n.includes("Elfliq") },
      ],
    },
    {
      brand: "Lost Mary",
      color: "#06b6d4",
      products: [
        { label: "MT35000", match: (n: string) => n.includes("MT35000") },
        { label: "MO10000", match: (n: string) => n.includes("MO10000") },
      ],
    },
    {
      brand: "Nasty",
      color: "#eab308",
      products: [
        { label: "Bolt WTF 50K", match: (n: string) => n.includes("Nasty") },
      ],
    },
    {
      brand: "IGET",
      color: "#7dd3fc",
      products: [
        { label: "Astro B18000", match: (n: string) => n.includes("IGET") },
      ],
    },
    {
      brand: "Yuoto",
      color: "#ef4444",
      products: [
        { label: "Beyonder", match: (n: string) => n.includes("Yuoto") },
      ],
    },
    {
      brand: "Pod Salt",
      color: "#f97316",
      products: [
        { label: "Hit The Spot", match: (n: string) => n.includes("Hit The Spot") },
        { label: "Core Nic Salt", match: (n: string) => n.includes("Core") },
      ],
    },
    {
      brand: "Caliburn",
      color: "#a78bfa",
      products: [
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
      brand: "Pouches",
      color: "#3b82f6",
      products: [
        { label: "ZYN Cool Mint", match: (n: string) => n.includes("ZYN") },
        { label: "Velo Peppermint", match: (n: string) => n.includes("Velo") },
      ],
    },
    {
      brand: "Tobacco",
      color: "#a16207",
      products: [
        { label: "Amber Leaf", match: (n: string) => n.includes("Amber") },
        { label: "Drum Bright Blue", match: (n: string) => n.includes("Drum") },
        { label: "Golden Virginia", match: (n: string) => n.includes("Golden") },
        { label: "American Spirit", match: (n: string) => n.includes("American") },
      ],
    },
  ];

  const [expandedBrand, setExpandedBrand] = useState<string | null>("Elfbar");

  const scrollToProduct2 = (matchFn: (n: string) => boolean) => {
    const product = products.find(p => matchFn(p.name));
    if (product) scrollToProduct(product.name);
    setSidebarOpen(false);
  };

  return (
    <>
      {/* ── PRODUCT SIDEBAR — right edge, hierarchical brands ── */}
      <div className="product-sidebar">
        {/* Toggle tab */}
        <div className="sidebar-toggle" onClick={() => setSidebarOpen(o => !o)}>
          <span style={{ writingMode: "vertical-rl", transform: "rotate(180deg)", fontSize: "0.55rem", fontFamily: "var(--font-display)", fontWeight: 800, color: "var(--btn-text)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
            Brands
          </span>
          <span style={{ color: "var(--btn-text)", fontSize: "0.8rem", fontWeight: 700 }}>
            {sidebarOpen ? "›" : "‹"}
          </span>
        </div>

        {/* Panel */}
        <div className={`sidebar-panel ${sidebarOpen ? "" : "closed"}`} style={{ width: 110, padding: "8px 6px" }}>
          {BRAND_GROUPS.map(group => (
            <div key={group.brand}>
              {/* Brand header */}
              <div
                onClick={() => setExpandedBrand(expandedBrand === group.brand ? null : group.brand)}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "7px 8px", cursor: "pointer", borderRadius: 8,
                  background: expandedBrand === group.brand ? group.color + "22" : "transparent",
                  border: expandedBrand === group.brand ? `1px solid ${group.color}44` : "1px solid transparent",
                  marginBottom: 2,
                }}
              >
                <span style={{ fontSize: "0.7rem", fontFamily: "var(--font-display)", fontWeight: 800, color: expandedBrand === group.brand ? group.color : "var(--white)" }}>
                  {group.brand}
                </span>
                <span style={{ fontSize: "0.65rem", color: expandedBrand === group.brand ? group.color : "var(--muted)" }}>
                  {expandedBrand === group.brand ? "▾" : "▸"}
                </span>
              </div>

              {/* Product list under brand */}
              {expandedBrand === group.brand && (
                <div style={{ paddingLeft: 4, marginBottom: 4, display: "flex", flexDirection: "column", gap: 2 }}>
                  {group.products.map(item => {
                    const product = products.find(p => item.match(p.name));
                    if (!product) return null;
                    const isActive = activeProduct === product.name;
                    return (
                      <div
                        key={item.label}
                        onClick={() => scrollToProduct2(item.match)}
                        style={{
                          display: "flex", alignItems: "center", gap: 6,
                          padding: "5px 6px", borderRadius: 6, cursor: "pointer",
                          background: isActive ? group.color + "22" : "var(--bg-3)",
                          border: isActive ? `1px solid ${group.color}66` : "1px solid var(--border)",
                          transition: "all 0.15s",
                        }}
                      >
                        <div style={{ position: "relative", width: 28, height: 28, flexShrink: 0, borderRadius: 4, overflow: "hidden", background: "var(--bg-2)" }}>
                          <Image src={product.image} alt={item.label} fill style={{ objectFit: "contain", padding: 2 }} />
                        </div>
                        <span style={{ fontSize: "0.6rem", color: isActive ? group.color : "var(--muted)", fontFamily: "var(--font-display)", fontWeight: 600, lineHeight: 1.2, flex: 1 }}>
                          {item.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── WHATSAPP FLOAT ── */}
      {showWA && (
        <a
          href={`https://wa.me/${ADMIN_PHONE}?text=Hi%2C%20I%20need%20help%20with%20my%20order`}
          target="_blank"
          rel="noopener noreferrer"
          className="wa-float"
          style={{ animation: "waAppear 0.4s ease forwards" }}
        >
          {showWALabel && (
            <span className="wa-float-label">Need help?</span>
          )}
          <div className="wa-float-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.554 4.122 1.523 5.855L0 24l6.29-1.49A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.007-1.374l-.36-.214-3.733.884.937-3.638-.234-.374A9.818 9.818 0 0112 2.182c5.424 0 9.818 4.394 9.818 9.818 0 5.425-4.394 9.818-9.818 9.818z"/>
            </svg>
          </div>
        </a>
      )}

      {/* ── PRODUCTS SECTION ── */}
      <section className="section" id="products" style={{ paddingTop: 28 }}>
        <div className="container">
          <p className="section-label">Products</p>
          <h2>Top Selling Vapes in Bangalore</h2>
          <p style={{ marginBottom: 20 }}>Select your flavour and add to cart — delivered in 20-30 mins.</p>

          <div className="product-grid">
            {products.map((product, index) => {
              const override = getOverride(product.name);
              const flavourList = override?.flavours?.length ? override.flavours : product.flavours;
              const isOutOfStock = override && !override.in_stock;
              const tag = override?.tag || product.badge || "";
              const tagStyle = TAG_COLORS[tag];
              const selectedFlavour = selectedFlavours[product.name];
              const addedKey = `${product.name}__${selectedFlavour}`;
              const justAdded = addedMap[addedKey];
              const displayPrice = override?.price
                ? `₹${override.price.toLocaleString()}`
                : product.price;

              const card = (
                <div
                  key={product.name}
                  className="product-card"
                  ref={el => { productRefs.current[product.name] = el; }}
                  style={{
                    opacity: isOutOfStock ? 0.7 : 1,
                    outline: activeProduct === product.name ? `2px solid var(--orange)` : "none",
                    transition: "outline 0.3s ease",
                  }}
                >
                  <div className="product-image" style={{ position: "relative", height: 180, overflow: "hidden", background: "#0d0f14", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      style={{ objectFit: "contain", objectPosition: "center", padding: 10 }}
                      sizes="(max-width: 640px) 50vw, 33vw"
                    />
                    <div className="product-discount">{product.discount}</div>
                    <div className="product-puffs">{product.puffs}</div>
                    {isOutOfStock && (
                      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ color: "var(--orange)", fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "0.85rem", letterSpacing: "0.08em", textShadow: "0 0 12px rgba(248,193,5,0.6)" }}>STOCK OUT</span>
                      </div>
                    )}
                  </div>

                  <div className="product-info" style={{ padding: "10px 10px 12px" }}>
                    {tag && tagStyle ? (
                      <div style={{ display: "inline-block", background: tagStyle.bg, color: tagStyle.color, border: `1px solid ${tagStyle.color}44`, borderRadius: 20, padding: "2px 8px", fontSize: "0.65rem", fontWeight: 700, fontFamily: "var(--font-display)", marginBottom: 4 }}>
                        {tag}
                      </div>
                    ) : (
                      <div className="product-badge">{product.badge}</div>
                    )}

                    <h3 className="product-name">{product.name}</h3>

                    <div className="product-pricing" style={{ margin: "6px 0 8px" }}>
                      <span className="product-price">{displayPrice}</span>
                      <span className="product-original">{product.originalPrice}</span>
                    </div>

                    {selectedFlavour && !isOutOfStock && (
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--orange-glow)", border: "1px solid rgba(248,193,5,0.3)", borderRadius: 6, padding: "4px 8px", marginBottom: 8 }}>
                        <span style={{ fontSize: "0.72rem", color: "var(--orange)", fontWeight: 600 }}>{selectedFlavour}</span>
                        <button onClick={() => setFlavourSheet(product.name)} style={{ background: "none", border: "none", color: "var(--muted)", fontSize: "0.68rem", cursor: "pointer", padding: 0 }}>change</button>
                      </div>
                    )}

                    {isOutOfStock ? (
                      <button
                        onClick={() => { setNotifyProduct(product.name); setNotifyPhone(""); setNotifyDone(false); }}
                        style={{ width: "100%", padding: "10px", background: "var(--orange)", border: "none", borderRadius: 8, color: "var(--btn-text)", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.82rem", cursor: "pointer", WebkitTapHighlightColor: "transparent" }}
                      >
                        Notify Me When Available
                      </button>
                    ) : (
                      <button
                        onClick={() => handleAddToCart(product)}
                        style={{ width: "100%", padding: "10px", background: justAdded ? "#10b981" : "var(--orange)", border: "none", borderRadius: 8, color: justAdded ? "#fff" : "var(--btn-text)", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer", transition: "all 0.2s", WebkitTapHighlightColor: "transparent" }}
                      >
                        {justAdded ? "Added!" : selectedFlavour ? "+ Add to Cart" : "Select Flavour"}
                      </button>
                    )}
                  </div>
                </div>
              );

              return (
                <React.Fragment key={product.name}>
                  {card}
                  {index === 3 && (
                    <div key="bundle-banner" style={{ gridColumn: "1 / -1", borderRadius: 14, overflow: "hidden", position: "relative", cursor: "pointer", background: "#1a0a1a" }}
                      onClick={() => window.open(`https://wa.me/916282878843?text=${encodeURIComponent("Hi! I want the Elfbar Raya D1 Bundle — Buy 2 @ ₹3,999. Please confirm flavours and availability.")}`, "_blank")}
                    >
                      <img
                        src="/products/raya-d1-bundle.png"
                        alt="Elfbar Raya D1 Bundle Deal — Buy 2 @ ₹3,999"
                        style={{ width: "100%", height: "auto", display: "block", objectFit: "contain" }}
                      />
                      <div style={{ padding: "14px 16px 16px", background: "var(--bg-2)", borderTop: "1px solid var(--border)" }}>
                        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "var(--orange)", borderRadius: 20, padding: "4px 12px", marginBottom: 8 }}>
                          <span style={{ fontSize: "0.72rem", fontFamily: "var(--font-display)", fontWeight: 800, color: "var(--btn-text)" }}>🔥 BUNDLE DEAL</span>
                        </div>
                        <p style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: "1rem", color: "var(--white)", marginBottom: 2 }}>Elfbar Raya D1 — Buy 2 @ ₹3,999</p>
                        <p style={{ fontSize: "0.78rem", color: "var(--muted)", marginBottom: 10 }}>Save ₹1,199 · Mix any 2 flavours · 30-min delivery</p>
                        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#25d366", borderRadius: 8, padding: "10px 18px" }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.554 4.122 1.523 5.855L0 24l6.29-1.49A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.007-1.374l-.36-.214-3.733.884.937-3.638-.234-.374A9.818 9.818 0 0112 2.182c5.424 0 9.818 4.394 9.818 9.818 0 5.425-4.394 9.818-9.818 9.818z"/></svg>
                          <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.85rem", color: "#fff" }}>Order Bundle on WhatsApp →</span>
                        </div>
                      </div>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FLAVOUR BOTTOM SHEET ── */}
      {flavourSheet && sheetProduct && (
        <>
          <div onClick={() => setFlavourSheet(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 10002, backdropFilter: "blur(4px)" }} />
          <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "var(--bg-2)", borderRadius: "20px 20px 0 0", border: "1px solid var(--border)", borderBottom: "none", zIndex: 10003, padding: "20px 20px 40px", maxHeight: "70vh", overflowY: "auto" }}>
            <div style={{ width: 40, height: 4, background: "var(--border)", borderRadius: 2, margin: "0 auto 16px" }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div>
                <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1rem" }}>{sheetProduct.name}</p>
                <p style={{ fontSize: "0.78rem", color: "var(--muted)" }}>Select a flavour to continue</p>
              </div>
              <button onClick={() => setFlavourSheet(null)} style={{ background: "var(--bg-3)", border: "1px solid var(--border)", color: "var(--muted)", borderRadius: 8, padding: "6px 10px", cursor: "pointer" }}>✕</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8, marginBottom: 16 }}>
              {(getOverride(sheetProduct.name)?.flavours?.length ? getOverride(sheetProduct.name)!.flavours : sheetProduct.flavours).map(flavour => {
                const isSelected = selectedFlavours[sheetProduct.name] === flavour;
                return (
                  <button key={flavour} onClick={() => setSelectedFlavours(prev => ({ ...prev, [sheetProduct.name]: flavour }))}
                    style={{ padding: "10px 12px", borderRadius: 10, textAlign: "left", border: isSelected ? "1.5px solid var(--orange)" : "1px solid var(--border)", background: isSelected ? "var(--orange-glow)" : "var(--bg-3)", color: isSelected ? "var(--orange)" : "var(--text)", fontSize: "0.82rem", cursor: "pointer", WebkitTapHighlightColor: "transparent" }}>
                    {flavour}
                  </button>
                );
              })}
            </div>
            <button onClick={() => handleAddToCart(sheetProduct)} disabled={!selectedFlavours[sheetProduct.name]}
              style={{ width: "100%", padding: "14px", background: selectedFlavours[sheetProduct.name] ? "var(--orange)" : "var(--bg-3)", border: "none", borderRadius: 10, color: selectedFlavours[sheetProduct.name] ? "var(--btn-text)" : "var(--muted)", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1rem", cursor: selectedFlavours[sheetProduct.name] ? "pointer" : "not-allowed", opacity: selectedFlavours[sheetProduct.name] ? 1 : 0.5 }}>
              {selectedFlavours[sheetProduct.name] ? `Add ${selectedFlavours[sheetProduct.name]} to Cart →` : "Select a Flavour First"}
            </button>
          </div>
        </>
      )}

      {/* ── NOTIFY MODAL ── */}
      {notifyProduct && (
        <div className="notify-overlay" onClick={() => setNotifyProduct(null)}>
          <div className="notify-sheet" onClick={e => e.stopPropagation()}>
            <div style={{ width: 40, height: 4, background: "var(--border)", borderRadius: 2, margin: "0 auto 20px" }} />
            <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.05rem", marginBottom: 6 }}>
              Notify Me — {notifyProduct}
            </h3>
            <p style={{ fontSize: "0.82rem", color: "var(--muted)", marginBottom: 20 }}>
              Enter your phone number and we'll WhatsApp you as soon as it's back in stock.
            </p>

            {notifyDone ? (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <p style={{ color: "#10b981", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1rem" }}>Done! We'll notify you.</p>
              </div>
            ) : (
              <>
                <input
                  type="tel"
                  placeholder="10-digit mobile number"
                  value={notifyPhone}
                  onChange={e => setNotifyPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  style={{ width: "100%", padding: "12px 14px", background: "var(--bg-3)", border: "1px solid var(--border)", borderRadius: 10, color: "var(--white)", fontSize: "1rem", fontFamily: "var(--font-body)", outline: "none", marginBottom: 12, boxSizing: "border-box" as const }}
                  autoFocus
                />
                <button
                  onClick={handleNotifySubmit}
                  disabled={notifySubmitting || notifyPhone.length < 10}
                  style={{ width: "100%", padding: "13px", background: notifyPhone.length >= 10 ? "var(--orange)" : "var(--bg-3)", border: "none", borderRadius: 10, color: notifyPhone.length >= 10 ? "var(--btn-text)" : "var(--muted)", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.95rem", cursor: notifyPhone.length >= 10 ? "pointer" : "not-allowed", marginBottom: 10 }}
                >
                  {notifySubmitting ? "Sending..." : "Check for Product on WhatsApp →"}
                </button>
                <button onClick={() => setNotifyProduct(null)}
                  style={{ width: "100%", padding: "10px", background: "none", border: "none", color: "var(--muted)", fontFamily: "var(--font-display)", fontSize: "0.82rem", cursor: "pointer" }}>
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── TOAST ── */}
      {toast && (
        <div onClick={() => { setToast(null); setIsOpen(true); }}
          style={{ position: "fixed", bottom: itemCount > 0 ? 90 : 24, left: "50%", transform: "translateX(-50%)", background: "var(--bg-2)", border: "1px solid var(--orange)", borderRadius: 12, padding: "12px 18px", display: "flex", alignItems: "center", gap: 12, zIndex: 998, cursor: "pointer", boxShadow: "0 4px 24px rgba(248,193,5,0.2)", whiteSpace: "nowrap", animation: "slideUp 0.25s ease" }}>
          <div>
            <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.88rem", color: "var(--white)" }}>Added to cart!</p>
            <p style={{ fontSize: "0.75rem", color: "var(--muted)" }}>{toast.name} · {toast.flavour}</p>
          </div>
          <div style={{ background: "var(--orange)", color: "var(--btn-text)", borderRadius: 8, padding: "8px 14px", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.82rem" }}>
            View Cart →
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateX(-50%) translateY(12px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>

      {/* ── STICKY CART FOOTER ── */}
      {itemCount > 0 && (
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "var(--bg-2)", borderTop: "1px solid var(--border)", padding: "12px 20px", zIndex: 997, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, boxShadow: "0 -4px 24px rgba(0,0,0,0.4)" }}>
          <div>
            <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1rem", color: "var(--white)" }}>₹{total.toLocaleString()}</p>
            <p style={{ fontSize: "0.75rem", color: "var(--muted)" }}>{itemCount} item{itemCount !== 1 ? "s" : ""} in cart</p>
          </div>
          <button onClick={() => setIsOpen(true)}
            style={{ padding: "12px 24px", background: "var(--orange)", border: "none", borderRadius: 10, color: "var(--btn-text)", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.95rem", cursor: "pointer", WebkitTapHighlightColor: "transparent", flexShrink: 0 }}>
            Proceed to Checkout →
          </button>
        </div>
      )}
      {itemCount > 0 && <div style={{ height: 80 }} />}
    </>
  );
}
