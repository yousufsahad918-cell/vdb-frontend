"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart";
import Image from "next/image";

export default function CartDrawer() {
  const { items, removeFromCart, updateQty, clearCart, total, itemCount, isOpen, setIsOpen } = useCart();
  const [name, setName] = useState("");
  const [ageVerified, setAgeVerified] = useState(false);
  const [ageError, setAgeError] = useState(false);

  const buildMessage = () => {
    const greeting = name.trim() ? "Hi VapeDeliveryBangalore, this is " + name.trim() : "Hi VapeDeliveryBangalore";
    const lines = items.map(i => "* " + i.name + " x" + i.qty + " - Rs." + (i.price * i.qty).toLocaleString()).join(", ");
    const msg = greeting + ", I want to order: " + lines + ". Total: Rs." + total.toLocaleString() + ". Please confirm availability and delivery time.";
    return encodeURIComponent(msg);
  };

  const waUrl = "https://wa.me/916282878843?text=" + buildMessage();

  if (!isOpen) return null;

  return (
    <div>
      <div onClick={() => setIsOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 1000 }} />
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "var(--bg-2)", borderRadius: "20px 20px 0 0", zIndex: 1001, maxHeight: "85vh", display: "flex", flexDirection: "column" as const }}>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 20px", borderBottom: "1px solid var(--border)" }}>
          <h2 style={{ fontSize: "1rem", fontWeight: 800, color: "var(--text)" }}>Your Order ({itemCount} items)</h2>
          <button onClick={() => setIsOpen(false)} style={{ background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer", color: "var(--muted)" }}>X</button>
        </div>

        {items.length === 0 ? (
          <div style={{ padding: "40px 20px", textAlign: "center" as const, color: "var(--muted)" }}>
            <div style={{ fontSize: "2rem", marginBottom: 8 }}>Cart</div>
            <p style={{ fontSize: "0.88rem" }}>Your cart is empty</p>
            <button onClick={() => setIsOpen(false)} style={{ marginTop: 16, background: "var(--green)", color: "#fff", border: "none", borderRadius: 10, padding: "10px 20px", fontWeight: 700, fontSize: "0.9rem", cursor: "pointer" }}>Browse Products</button>
          </div>
        ) : (
          <div style={{ overflowY: "auto", flex: 1, padding: "12px 20px" }}>
            {items.map(item => (
              <div key={item.product_id} style={{ display: "flex", alignItems: "center", gap: 12, paddingBottom: 14, marginBottom: 14, borderBottom: "1px solid var(--border)" }}>
                <div style={{ width: 56, height: 56, background: "var(--bg-3)", borderRadius: 10, flexShrink: 0, position: "relative", overflow: "hidden" }}>
                  <Image src={item.image} alt={item.name} fill style={{ objectFit: "contain", padding: 4 }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text)", lineHeight: 1.3 }}>{item.name}</div>
                  <div style={{ fontSize: "0.88rem", fontWeight: 800, color: "var(--green)", marginTop: 4 }}>Rs.{(item.price * item.qty).toLocaleString()}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                  <button onClick={() => updateQty(item.product_id, -1)} style={{ width: 28, height: 28, borderRadius: "50%", border: "1px solid var(--border)", background: "var(--bg-3)", cursor: "pointer", color: "var(--text)", fontWeight: 700 }}>-</button>
                  <span style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--text)", minWidth: 16, textAlign: "center" as const }}>{item.qty}</span>
                  <button onClick={() => updateQty(item.product_id, 1)} style={{ width: 28, height: 28, borderRadius: "50%", border: "1px solid var(--border)", background: "var(--bg-3)", cursor: "pointer", color: "var(--text)", fontWeight: 700 }}>+</button>
                  <button onClick={() => removeFromCart(item.product_id)} style={{ width: 28, height: 28, borderRadius: "50%", border: "none", background: "rgba(226,55,68,0.15)", cursor: "pointer", color: "#E23744" }}>X</button>
                </div>
              </div>
            ))}

            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--muted)", marginBottom: 6, display: "block" }}>Your Name (optional)</label>
              <input type="text" placeholder="e.g. Rahul, Priya..." value={name} onChange={e => setName(e.target.value)} style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid var(--border)", background: "var(--bg-3)", fontSize: "0.9rem", outline: "none", boxSizing: "border-box" as const, color: "var(--text)" }} />
            </div>

            <div style={{ background: "var(--bg-3)", borderRadius: 12, padding: "14px 16px", marginBottom: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--muted)" }}>Total</span>
              <span style={{ fontSize: "1.1rem", fontWeight: 900, color: "var(--green)" }}>Rs.{total.toLocaleString()}</span>
            </div>

            <div onClick={() => setAgeVerified(!ageVerified)} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, cursor: "pointer" }}>
              <div style={{ width: 20, height: 20, borderRadius: 6, border: ageVerified ? "none" : "2px solid var(--border)", background: ageVerified ? "var(--green)" : "var(--bg-3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {ageVerified && <span style={{ color: "#fff", fontSize: "0.7rem", fontWeight: 800 }}>Y</span>}
              </div>
              <span style={{ fontSize: "0.82rem", color: "var(--muted)", lineHeight: 1.4 }}>
                I confirm I am <strong style={{ color: "var(--text)" }}>21 years or older</strong>
              </span>
            </div>
            {ageError && <div style={{ fontSize: "0.78rem", color: "#E23744", marginBottom: 8, fontWeight: 600 }}>Please confirm you are 21+ to place an order.</div>}

            <a href={ageVerified ? waUrl : "#"} onClick={e => { if (!ageVerified) { e.preventDefault(); setAgeError(true); setTimeout(() => setAgeError(false), 2000); } }} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: ageVerified ? "#25D366" : "var(--bg-3)", color: ageVerified ? "#fff" : "var(--muted)", padding: "14px", borderRadius: 12, fontWeight: 700, fontSize: "0.95rem", textDecoration: "none", marginBottom: 10, border: ageVerified ? "none" : "1px solid var(--border)" }}>
              Order on WhatsApp
            </a>
            <button onClick={clearCart} style={{ width: "100%", background: "none", border: "1px solid var(--border)", color: "var(--muted)", padding: "10px", borderRadius: 10, fontWeight: 600, fontSize: "0.82rem", cursor: "pointer" }}>Clear Cart</button>
          </div>
        )}
      </div>
    </div>
  );
}
