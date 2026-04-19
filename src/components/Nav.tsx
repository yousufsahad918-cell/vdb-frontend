"use client";

import Link from "next/link";
import { WHATSAPP_URL } from "@/lib/locations";
import { useCart } from "@/lib/cart";

export default function Nav() {
  const { itemCount, setIsOpen } = useCart();

  return (
    <nav className="nav">
      <div className="container nav-inner">
        <Link href="/" className="nav-logo">
          <span className="nav-logo-vape">VAPE</span>
          <span className="nav-logo-dot">●</span>
          <span className="nav-logo-blr">BANGALORE</span>
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            onClick={() => setIsOpen(true)}
            style={{
              position: "relative", background: "var(--bg-3)",
              border: "1px solid var(--border)", color: "var(--white)",
              borderRadius: 8, padding: "8px 14px", cursor: "pointer",
              fontFamily: "var(--font-display)", fontWeight: 600,
              fontSize: "0.85rem", display: "flex", alignItems: "center", gap: 6,
            }}
          >
            🛒 Cart
            {itemCount > 0 && (
              <span style={{
                background: "var(--orange)", color: "#fff",
                borderRadius: "50%", width: 18, height: 18,
                fontSize: "0.7rem", fontWeight: 800,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {itemCount}
              </span>
            )}
          </button>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="nav-cta">
            Order Now →
          </a>
        </div>
      </div>
    </nav>
  );
}
