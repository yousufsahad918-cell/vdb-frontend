"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart";
import { useEffect, useRef, useState } from "react";

export default function Nav() {
  const { itemCount, setIsOpen } = useCart();
  const prevCount = useRef(itemCount);
  const [blinking, setBlinking] = useState(false);

  useEffect(() => {
    if (itemCount > prevCount.current) {
      setBlinking(false);
      // Force reflow so animation retriggers
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setBlinking(true));
      });
      setTimeout(() => setBlinking(false), 900);
    }
    prevCount.current = itemCount;
  }, [itemCount]);

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
              transition: "color 0.2s",
            }}
          >
            Blog
          </Link>
          <button
            onClick={() => setIsOpen(true)}
            className={blinking ? "cart-blink" : ""}
            style={{
              position: "relative",
              background: itemCount > 0 ? "var(--orange)" : "var(--bg-3)",
              border: itemCount > 0 ? "none" : "1px solid var(--border)",
              color: itemCount > 0 ? "var(--btn-text)" : "var(--white)",
              borderRadius: 8, padding: "8px 16px", cursor: "pointer",
              fontFamily: "var(--font-display)", fontWeight: 700,
              fontSize: "0.85rem", display: "flex", alignItems: "center", gap: 6,
              WebkitTapHighlightColor: "transparent",
              transition: "background 0.2s, color 0.2s",
            }}
          >
            Cart
            {itemCount > 0 && (
              <span style={{
                background: "var(--btn-text)", color: "var(--orange)",
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
