"use client";

import { WHATSAPP_URL } from "@/lib/locations";

export default function StickyButtons() {
  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .sticky-whatsapp, .sticky-shop { display: none !important; }
        }
      `}</style>

      {/* Right side — WhatsApp — desktop only */}
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="sticky-whatsapp"
        style={{
          position: "fixed",
          right: "-46px",
          top: "45%",
          transform: "rotate(-90deg)",
          background: "#25D366",
          color: "#fff",
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          fontSize: "0.72rem",
          letterSpacing: "0.04em",
          padding: "8px 16px",
          borderRadius: "8px 8px 0 0",
          zIndex: 500,
          whiteSpace: "nowrap",
          display: "flex",
          alignItems: "center",
          gap: "5px",
          boxShadow: "-2px 0 16px rgba(37,211,102,0.35)",
          textTransform: "uppercase",
        }}
      >
        Quick Order
      </a>

      {/* Left side — Shop Now — desktop only */}
      <a
        href="/#products"
        className="sticky-shop"
        style={{
          position: "fixed",
          left: "-38px",
          top: "55%",
          transform: "rotate(-90deg)",
          background: "var(--orange)",
          color: "#fff",
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          fontSize: "0.72rem",
          letterSpacing: "0.04em",
          padding: "8px 16px",
          borderRadius: "8px 8px 0 0",
          zIndex: 500,
          whiteSpace: "nowrap",
          display: "flex",
          alignItems: "center",
          gap: "5px",
          boxShadow: "2px 0 16px rgba(255,92,0,0.35)",
          textTransform: "uppercase",
        }}
      >
        Shop Now
      </a>
    </>
  );
}
