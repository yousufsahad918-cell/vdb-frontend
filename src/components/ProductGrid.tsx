"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import { products } from "@/lib/products";
import { useCart } from "@/lib/cart";

export default function ProductGrid() {
  const { addToCart, total, itemCount, setIsOpen } = useCart();
  const [flavourSheet, setFlavourSheet] = useState<string | null>(null); // product name
  const [selectedFlavours, setSelectedFlavours] = useState<Record<string, string>>({});
  const [addedMap, setAddedMap] = useState<Record<string, boolean>>({});
  const [toast, setToast] = useState<{ name: string; flavour: string } | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleAddToCart = (product: typeof products[0]) => {
    const flavour = selectedFlavours[product.name];
    if (!flavour) { setFlavourSheet(product.name); return; }
    addToCart({
      product_id: product.name.toLowerCase().replace(/\s+/g, "-"),
      name: product.name,
      price: parseInt(product.price.replace(/[₹,]/g, "")),
      image: product.image,
      puffs: product.puffs,
      flavour,
    });
    const key = `${product.name}__${flavour}`;
    setAddedMap((prev) => ({ ...prev, [key]: true }));
    setTimeout(() => setAddedMap((prev) => ({ ...prev, [key]: false })), 1400);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ name: product.name, flavour });
    toastTimerRef.current = setTimeout(() => setToast(null), 3500);
    setFlavourSheet(null);
  };

  const sheetProduct = products.find(p => p.name === flavourSheet);

  return (
    <>
      <section className="section" id="products" style={{ paddingTop: 32 }}>
        <div className="container">
          <p className="section-label">Products</p>
          <h2>Top Selling Vapes in Bangalore</h2>
          <p style={{ marginBottom: 20 }}>Select your flavour and add to cart — delivered in 20-30 mins.</p>

          <div className="product-grid">
            {products.map((product) => {
              const selectedFlavour = selectedFlavours[product.name];
              const addedKey = `${product.name}__${selectedFlavour}`;
              const justAdded = addedMap[addedKey];

              return (
                <div key={product.name} className="product-card">
                  <div className="product-image" style={{ position: "relative", height: 180, overflow: "hidden", background: "#111" }}>
                    <Image
                      src={product.image} alt={product.name} fill
                      style={{ objectFit: "contain", padding: "8px" }}
                      sizes="(max-width: 640px) 50vw, 33vw"
                    />
                    <div className="product-discount">{product.discount}</div>
                    <div className="product-puffs">{product.puffs}</div>
                  </div>

                  <div className="product-info" style={{ padding: "10px 10px 12px" }}>
                    <div className="product-badge">{product.badge}</div>
                    <h3 className="product-name">{product.name}</h3>

                    <div className="product-pricing" style={{ margin: "6px 0 8px" }}>
                      <span className="product-price">{product.price}</span>
                      <span className="product-original">{product.originalPrice}</span>
                    </div>

                    {/* Selected flavour chip */}
                    {selectedFlavour && (
                      <div style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        background: "var(--orange-glow)", border: "1px solid rgba(255,92,0,0.3)",
                        borderRadius: 6, padding: "4px 8px", marginBottom: 8,
                      }}>
                        <span style={{ fontSize: "0.72rem", color: "var(--orange)", fontWeight: 600 }}>
                          {selectedFlavour}
                        </span>
                        <button
                          onClick={() => setFlavourSheet(product.name)}
                          style={{ background: "none", border: "none", color: "var(--muted)", fontSize: "0.68rem", cursor: "pointer", padding: 0 }}
                        >
                          change
                        </button>
                      </div>
                    )}

                    {/* Main CTA button */}
                    <button
                      onClick={() => handleAddToCart(product)}
                      style={{
                        width: "100%", padding: "10px",
                        background: justAdded ? "#10b981" : selectedFlavour ? "var(--orange)" : "var(--bg-3)",
                        border: selectedFlavour ? "none" : "1px solid var(--border)",
                        borderRadius: 8, color: selectedFlavour ? "#fff" : "var(--muted)",
                        fontFamily: "var(--font-display)", fontWeight: 700,
                        fontSize: "0.85rem", cursor: "pointer",
                        transition: "all 0.2s",
                        WebkitTapHighlightColor: "transparent",
                      }}
                    >
                      {justAdded ? "Added!" : selectedFlavour ? "+ Add to Cart" : "Select Flavour"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FLAVOUR BOTTOM SHEET ── */}
      {flavourSheet && sheetProduct && (
        <>
          <div
            onClick={() => setFlavourSheet(null)}
            style={{
              position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
              zIndex: 10002, backdropFilter: "blur(4px)",
            }}
          />
          <div style={{
            position: "fixed", bottom: 0, left: 0, right: 0,
            background: "var(--bg-2)", borderRadius: "20px 20px 0 0",
            border: "1px solid var(--border)", borderBottom: "none",
            zIndex: 10003, padding: "20px 20px 40px",
            maxHeight: "70vh", overflowY: "auto",
          }}>
            {/* Handle */}
            <div style={{ width: 40, height: 4, background: "var(--border)", borderRadius: 2, margin: "0 auto 16px" }} />
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div>
                <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1rem" }}>
                  {sheetProduct.name}
                </p>
                <p style={{ fontSize: "0.78rem", color: "var(--muted)" }}>Select a flavour to continue</p>
              </div>
              <button
                onClick={() => setFlavourSheet(null)}
                style={{ background: "var(--bg-3)", border: "1px solid var(--border)", color: "var(--muted)", borderRadius: 8, padding: "6px 10px", cursor: "pointer", fontSize: "0.85rem" }}
              >✕</button>
            </div>

            {/* Flavour grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8, marginBottom: 16 }}>
              {sheetProduct.flavours.map((flavour) => {
                const isSelected = selectedFlavours[sheetProduct.name] === flavour;
                return (
                  <button
                    key={flavour}
                    onClick={() => setSelectedFlavours(prev => ({ ...prev, [sheetProduct.name]: flavour }))}
                    style={{
                      padding: "10px 12px", borderRadius: 10, textAlign: "left",
                      border: isSelected ? "1.5px solid var(--orange)" : "1px solid var(--border)",
                      background: isSelected ? "var(--orange-glow)" : "var(--bg-3)",
                      color: isSelected ? "var(--orange)" : "var(--text)",
                      fontSize: "0.82rem", fontFamily: "var(--font-body)", fontWeight: 500,
                      cursor: "pointer", WebkitTapHighlightColor: "transparent",
                    }}
                  >
                    {flavour}
                  </button>
                );
              })}
            </div>

            {/* Add to cart from sheet */}
            <button
              onClick={() => handleAddToCart(sheetProduct)}
              disabled={!selectedFlavours[sheetProduct.name]}
              style={{
                width: "100%", padding: "14px",
                background: selectedFlavours[sheetProduct.name] ? "var(--orange)" : "var(--bg-3)",
                border: "none", borderRadius: 10, color: "#fff",
                fontFamily: "var(--font-display)", fontWeight: 700,
                fontSize: "1rem", cursor: selectedFlavours[sheetProduct.name] ? "pointer" : "not-allowed",
                opacity: selectedFlavours[sheetProduct.name] ? 1 : 0.5,
                WebkitTapHighlightColor: "transparent",
              }}
            >
              {selectedFlavours[sheetProduct.name] ? `Add ${selectedFlavours[sheetProduct.name]} to Cart →` : "Select a Flavour First"}
            </button>
          </div>
        </>
      )}

      {/* ── ADDED TOAST ── */}
      {toast && (
        <div
          onClick={() => { setToast(null); setIsOpen(true); }}
          style={{
            position: "fixed",
            bottom: itemCount > 0 ? 90 : 24,
            left: "50%", transform: "translateX(-50%)",
            background: "#1a1a1a", border: "1px solid var(--orange)",
            borderRadius: 12, padding: "12px 18px",
            display: "flex", alignItems: "center", gap: 12,
            zIndex: 998, cursor: "pointer",
            boxShadow: "0 4px 24px rgba(255,92,0,0.2)",
            whiteSpace: "nowrap", animation: "slideUp 0.25s ease",
          }}
        >
          <div>
            <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.88rem", color: "var(--white)" }}>
              Added to cart!
            </p>
            <p style={{ fontSize: "0.75rem", color: "var(--muted)" }}>
              {toast.name} · {toast.flavour}
            </p>
          </div>
          <div style={{
            background: "var(--orange)", color: "#fff",
            borderRadius: 8, padding: "8px 14px",
            fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.82rem",
          }}>
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

      {/* Sticky cart footer */}
      {itemCount > 0 && (
        <div style={{
          position: "fixed", bottom: 0, left: 0, right: 0,
          background: "var(--bg-2)", borderTop: "1px solid var(--border)",
          padding: "12px 20px", zIndex: 997,
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
          boxShadow: "0 -4px 24px rgba(0,0,0,0.4)",
        }}>
          <div>
            <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1rem", color: "var(--white)" }}>
              Rs.{total.toLocaleString()}
            </p>
            <p style={{ fontSize: "0.75rem", color: "var(--muted)" }}>
              {itemCount} item{itemCount !== 1 ? "s" : ""} in cart
            </p>
          </div>
          <button
            onClick={() => setIsOpen(true)}
            style={{
              padding: "12px 24px", background: "var(--orange)", border: "none",
              borderRadius: 10, color: "#fff", fontFamily: "var(--font-display)",
              fontWeight: 700, fontSize: "0.95rem", cursor: "pointer",
              WebkitTapHighlightColor: "transparent", flexShrink: 0,
            }}
          >
            Proceed to Checkout →
          </button>
        </div>
      )}
      {itemCount > 0 && <div style={{ height: 80 }} />}
    </>
  );
}
