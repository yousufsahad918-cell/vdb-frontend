"use client";

import Image from "next/image";
import { useState } from "react";
import { products } from "@/lib/products";
import { useCart } from "@/lib/cart";

export default function ProductGrid() {
  const { addToCart, items, total, itemCount, setIsOpen } = useCart();
  const [selectedFlavours, setSelectedFlavours] = useState<Record<string, string>>({});
  const [addedMap, setAddedMap] = useState<Record<string, boolean>>({});
  const [toast, setToast] = useState<{ name: string; flavour: string } | null>(null);
  const toastTimer = useState<ReturnType<typeof setTimeout> | null>(null);

  const handleAddToCart = (product: typeof products[0]) => {
    const flavour = selectedFlavours[product.name];
    if (!flavour) {
      alert("Please select a flavour first");
      return;
    }
    addToCart({
      product_id: product.name.toLowerCase().replace(/\s+/g, "-"),
      name: product.name,
      price: parseInt(product.price.replace(/[₹,]/g, "")),
      image: product.image,
      puffs: product.puffs,
      flavour,
    });
    // Flash button
    const key = `${product.name}__${flavour}`;
    setAddedMap((prev) => ({ ...prev, [key]: true }));
    setTimeout(() => setAddedMap((prev) => ({ ...prev, [key]: false })), 1200);
    // Show toast
    if (toastTimer[0]) clearTimeout(toastTimer[0]);
    setToast({ name: product.name, flavour });
    toastTimer[0] = setTimeout(() => setToast(null), 3500);
  };

  return (
    <>
      <section className="section">
        <div className="container">
          <p className="section-label">Products</p>
          <h2>Top Selling Vapes in Bangalore</h2>
          <p>Select your flavour and add to cart — delivered in 20-30 mins.</p>

          <div className="product-grid">
            {products.map((product) => {
              const selectedFlavour = selectedFlavours[product.name];
              const addedKey = `${product.name}__${selectedFlavour}`;
              const justAdded = addedMap[addedKey];

              return (
                <div key={product.name} className="product-card">
                  <div className="product-image" style={{ position: "relative", height: "200px", overflow: "hidden", background: "#111" }}>
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      style={{ objectFit: "contain", padding: "8px" }}
                      sizes="(max-width: 640px) 50vw, 33vw"
                    />
                    <div className="product-discount">{product.discount}</div>
                    <div className="product-puffs">{product.puffs}</div>
                  </div>

                  <div className="product-info">
                    <div className="product-badge">{product.badge}</div>
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-desc">{product.description}</p>

                    {/* Flavour selector — tap one, can switch anytime */}
                    <div style={{ marginBottom: 10, marginTop: 6 }}>
                      <p style={{ fontSize: "0.72rem", fontWeight: 600, color: "var(--muted)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                        Select Flavour
                      </p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                        {product.flavours.map((flavour) => {
                          const isSelected = selectedFlavour === flavour;
                          return (
                            <button
                              key={flavour}
                              onClick={() => setSelectedFlavours((prev) => ({
                                ...prev,
                                [product.name]: isSelected ? "" : flavour,
                              }))}
                              style={{
                                padding: "4px 8px",
                                borderRadius: 6,
                                border: isSelected ? "1.5px solid var(--orange)" : "1px solid var(--border)",
                                background: isSelected ? "var(--orange-glow)" : "var(--bg-3)",
                                color: isSelected ? "var(--orange)" : "var(--muted)",
                                fontSize: "0.7rem",
                                fontFamily: "var(--font-body)",
                                fontWeight: 500,
                                cursor: "pointer",
                                transition: "all 0.15s",
                                whiteSpace: "nowrap",
                                WebkitTapHighlightColor: "transparent",
                              }}
                            >
                              {flavour}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="product-pricing">
                      <span className="product-price">{product.price}</span>
                      <span className="product-original">{product.originalPrice}</span>
                    </div>

                    <button
                      onClick={() => handleAddToCart(product)}
                      style={{
                        width: "100%", padding: "10px",
                        background: justAdded ? "#10b981" : selectedFlavour ? "var(--orange)" : "var(--bg-3)",
                        border: selectedFlavour ? "none" : "1px solid var(--border)",
                        borderRadius: 8,
                        color: selectedFlavour ? "#fff" : "var(--muted)",
                        fontFamily: "var(--font-display)", fontWeight: 700,
                        fontSize: "0.85rem", cursor: "pointer", marginTop: 8,
                        transition: "all 0.2s",
                        WebkitTapHighlightColor: "transparent",
                      }}
                    >
                      {justAdded ? "Added!" : selectedFlavour ? "+ Add to Cart" : "Select a Flavour"}
                    </button>

                    {/* Add another flavour button — shows after first add */}
                    {items.some(i => i.product_id === product.name.toLowerCase().replace(/\s+/g, "-")) && (
                      <p style={{ fontSize: "0.72rem", color: "var(--muted)", textAlign: "center", marginTop: 6 }}>
                        Select a different flavour to add another
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Added to cart toast */}
      {toast && (
        <div
          onClick={() => { setToast(null); setIsOpen(true); }}
          style={{
            position: "fixed",
            bottom: itemCount > 0 ? 90 : 24,
            left: "50%",
            transform: "translateX(-50%)",
            background: "#1a1a1a",
            border: "1px solid var(--orange)",
            borderRadius: 12,
            padding: "12px 18px",
            display: "flex",
            alignItems: "center",
            gap: 12,
            zIndex: 998,
            cursor: "pointer",
            boxShadow: "0 4px 24px rgba(255,92,0,0.2)",
            whiteSpace: "nowrap",
            animation: "slideUp 0.25s ease",
          }}
        >
          <div>
            <p style={{
              fontFamily: "var(--font-display)", fontWeight: 700,
              fontSize: "0.88rem", color: "var(--white)",
            }}>
              Added to cart!
            </p>
            <p style={{ fontSize: "0.75rem", color: "var(--muted)" }}>
              {toast.name} · {toast.flavour}
            </p>
          </div>
          <div style={{
            background: "var(--orange)", color: "#fff",
            borderRadius: 8, padding: "8px 14px",
            fontFamily: "var(--font-display)", fontWeight: 700,
            fontSize: "0.82rem",
          }}>
            View Cart →
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateX(-50%) translateY(12px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>

      {/* Sticky cart footer — shows when cart has items */}
      {itemCount > 0 && (
        <div style={{
          position: "fixed", bottom: 0, left: 0, right: 0,
          background: "var(--bg-2)",
          borderTop: "1px solid var(--border)",
          padding: "12px 20px",
          zIndex: 999,
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
          backdropFilter: "blur(12px)",
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
              padding: "12px 24px",
              background: "var(--orange)", border: "none",
              borderRadius: 10, color: "#fff",
              fontFamily: "var(--font-display)", fontWeight: 700,
              fontSize: "0.95rem", cursor: "pointer",
              WebkitTapHighlightColor: "transparent",
              flexShrink: 0,
            }}
          >
            Proceed to Checkout →
          </button>
        </div>
      )}

      {/* Bottom padding so content isn't hidden behind sticky bar */}
      {itemCount > 0 && <div style={{ height: 80 }} />}
    </>
  );
}
