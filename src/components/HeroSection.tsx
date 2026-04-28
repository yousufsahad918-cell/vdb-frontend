"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { WHATSAPP_URL } from "@/lib/locations";

export default function HeroSection() {
  const [showImage, setShowImage] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowImage(true), 4000);
    return () => clearTimeout(t);
  }, []);

  const scrollToProducts = () => {
    const el = document.getElementById("products");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div style={{ background: "#14532d" }}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>

      {/* Text content */}
      {!showImage && (
        <div style={{ padding: "32px 20px 28px", textAlign: "center", animation: "fadeIn 0.5s ease" }}>
          <div className="hero-tag">Now Delivering Across Bangalore</div>
          <h1 style={{
            fontFamily: "var(--font-display)", fontSize: "clamp(1.7rem, 5vw, 2.8rem)",
            fontWeight: 900, lineHeight: 1.1, marginBottom: 10, color: "#ffffff",
          }}>
            Buy Vape in{" "}
            <em style={{ color: "#86efac", fontStyle: "italic" }}>Bangalore</em>
            <br />30-45 Min Delivery
          </h1>
          <p style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.7)", maxWidth: 480, margin: "0 auto 24px", lineHeight: 1.5 }}>
            Disposable vapes, pod systems & e-liquids — discreet delivery to BTM,
            HSR, Koramangala, Whitefield & 20+ areas.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 340, margin: "0 auto" }}>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
              style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "#25d366", color: "#fff", padding: "13px 20px", borderRadius: 10, fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.95rem", textDecoration: "none" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.554 4.122 1.523 5.855L0 24l6.29-1.49A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.007-1.374l-.36-.214-3.733.884.937-3.638-.234-.374A9.818 9.818 0 0112 2.182c5.424 0 9.818 4.394 9.818 9.818 0 5.425-4.394 9.818-9.818 9.818z"/>
              </svg>
              Order on WhatsApp
            </a>
            <button onClick={scrollToProducts}
              style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)", color: "#ffffff", padding: "12px 20px", borderRadius: 10, fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.95rem", cursor: "pointer", WebkitTapHighlightColor: "transparent" }}>
              Browse Products →
            </button>
          </div>
        </div>
      )}

      {/* Delivery image */}
      {showImage && (
        <div style={{ animation: "fadeIn 0.6s ease forwards" }}>
          <div style={{ position: "relative", width: "100%", aspectRatio: "16/9" }}>
            <Image
              src="/hero-delivery.png"
              alt="VapeDeliveryBangalore — 30-45 Min Delivery Across Bangalore"
              fill
              style={{ objectFit: "contain", objectPosition: "center", background: "#14532d" }}
              priority sizes="100vw"
            />
          </div>
          <div style={{ padding: "14px 20px 20px", display: "flex", flexDirection: "column", gap: 10, background: "#14532d" }}>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
              style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "#25d366", color: "#fff", padding: "13px 20px", borderRadius: 10, fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.95rem", textDecoration: "none" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.554 4.122 1.523 5.855L0 24l6.29-1.49A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.007-1.374l-.36-.214-3.733.884.937-3.638-.234-.374A9.818 9.818 0 0112 2.182c5.424 0 9.818 4.394 9.818 9.818 0 5.425-4.394 9.818-9.818 9.818z"/>
              </svg>
              Order on WhatsApp
            </a>
            <button onClick={scrollToProducts}
              style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)", color: "#ffffff", padding: "12px 20px", borderRadius: 10, fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.95rem", cursor: "pointer" }}>
              Browse Products →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
