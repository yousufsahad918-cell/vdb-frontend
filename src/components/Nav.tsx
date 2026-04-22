"use client";

import Link from "next/link";
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
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Link
            href="/blog"
            style={{
              color: "var(--muted)", fontFamily: "var(--font-display)",
              fontWeight: 600, fontSize: "0.85rem",
              padding: "8px 12px", borderRadius: 8,
              WebkitTapHighlightColor: "transparent",
            }}
          >
            Blog
          </Link>
          <button
            onClick={() => setIsOpen(true)}
            style={{
              position: "relative",
              background: itemCount > 0 ? "var(--orange)" : "var(--bg-3)",
              border: itemCount > 0 ? "none" : "1px solid var(--border)",
              color: "#fff",
              borderRadius: 8, padding: "8px 16px", cursor: "pointer",
              fontFamily: "var(--font-display)", fontWeight: 700,
              fontSize: "0.85rem", display: "flex", alignItems: "center", gap: 6,
              WebkitTapHighlightColor: "transparent",
              boxShadow: itemCount > 0 ? "0 0 12px rgba(255,92,0,0.5)" : "none",
              transition: "all 0.2s",
            }}
          >
            Cart
            {itemCount > 0 && (
              <span style={{
                background: "#fff", color: "var(--orange)",
                borderRadius: "50%", width: 18, height: 18,
                fontSize: "0.7rem", fontWeight: 800,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
