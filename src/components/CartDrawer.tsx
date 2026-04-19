"use client";

import { useState } from "react";
import Image from "next/image";
import { useCart } from "@/lib/cart";
import CheckoutForm from "./CheckoutForm";

export default function CartDrawer() {
  const { items, removeFromCart, updateQuantity, total, itemCount, isOpen, setIsOpen } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        onClick={() => { setIsOpen(false); setShowCheckout(false); }}
        style={{
          position: "fixed", inset: 0,
          background: "rgba(0,0,0,0.7)",
          zIndex: 10000,
          backdropFilter: "blur(4px)",
        }}
      />

      {/* Drawer */}
      <div style={{
        position: "fixed",
        right: 0, top: 0, bottom: 0,
        width: "min(420px, 100vw)",
        background: "var(--bg-2)",
        borderLeft: "1px solid var(--border)",
        zIndex: 10001,
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
      }}>
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "20px", borderBottom: "1px solid var(--border)",
          position: "sticky", top: 0, background: "var(--bg-2)", zIndex: 1,
        }}>
          <div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 700 }}>
              Your Cart
            </h2>
            <p style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: 2 }}>
              {itemCount} item{itemCount !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={() => { setIsOpen(false); setShowCheckout(false); }}
            style={{
              background: "var(--bg-3)", border: "1px solid var(--border)",
              color: "var(--white)", borderRadius: "8px",
              padding: "8px 12px", cursor: "pointer",
              fontFamily: "var(--font-display)", fontSize: "0.85rem",
            }}
          >
            ✕ Close
          </button>
        </div>

        {items.length === 0 ? (
          <div style={{ padding: "40px 20px", textAlign: "center", color: "var(--muted)" }}>
            <div style={{ fontSize: "3rem", marginBottom: 16 }}>🛒</div>
            <p>Your cart is empty</p>
          </div>
        ) : showCheckout ? (
          <CheckoutForm onBack={() => setShowCheckout(false)} />
        ) : (
          <>
            {/* Items */}
            <div style={{ flex: 1, padding: "16px", display: "flex", flexDirection: "column", gap: 12 }}>
              {items.map((item) => (
                <div key={item.product_id} style={{
                  display: "flex", gap: 12, alignItems: "flex-start",
                  background: "var(--bg-3)", borderRadius: 12,
                  padding: 12, border: "1px solid var(--border)",
                }}>
                  <div style={{ position: "relative", width: 70, height: 70, borderRadius: 8, overflow: "hidden", flexShrink: 0 }}>
                    <Image src={item.image} alt={item.name} fill style={{ objectFit: "contain" }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.9rem", color: "var(--white)", marginBottom: 4 }}>
                      {item.name}
                    </p>
                    <p style={{ fontSize: "0.75rem", color: "var(--muted)" }}>{item.puffs}</p><p style={{ fontSize: "0.75rem", color: "var(--orange)", marginBottom: 8, fontWeight: 600 }}>{item.flavour}</p>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <button
                          onClick={() => updateQuantity(item.product_id, item.flavour, item.quantity - 1)}
                          style={{
                            width: 28, height: 28, borderRadius: 6,
                            background: "var(--bg-2)", border: "1px solid var(--border)",
                            color: "var(--white)", cursor: "pointer", fontSize: "1rem",
                            display: "flex", alignItems: "center", justifyContent: "center",
                          }}
                        >−</button>
                        <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.95rem", minWidth: 20, textAlign: "center" }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product_id, item.flavour, item.quantity + 1)}
                          style={{
                            width: 28, height: 28, borderRadius: 6,
                            background: "var(--orange)", border: "none",
                            color: "#fff", cursor: "pointer", fontSize: "1rem",
                            display: "flex", alignItems: "center", justifyContent: "center",
                          }}
                        >+</button>
                      </div>
                      <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1rem", color: "var(--white)" }}>
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.product_id, item.flavour)}
                    style={{
                      background: "none", border: "none",
                      color: "var(--muted)", cursor: "pointer", fontSize: "1rem",
                      padding: 4,
                    }}
                  >🗑</button>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div style={{
              padding: "20px", borderTop: "1px solid var(--border)",
              position: "sticky", bottom: 0, background: "var(--bg-2)",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                <span style={{ color: "var(--muted)", fontSize: "0.9rem" }}>Total</span>
                <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.3rem", color: "var(--white)" }}>
                  ₹{total.toLocaleString()}
                </span>
              </div>
              <button
                onClick={() => setShowCheckout(true)}
                style={{
                  width: "100%", padding: "14px",
                  background: "var(--orange)", border: "none",
                  borderRadius: 10, color: "#fff",
                  fontFamily: "var(--font-display)", fontWeight: 700,
                  fontSize: "1rem", cursor: "pointer",
                }}
              >
                Proceed to Checkout →
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
