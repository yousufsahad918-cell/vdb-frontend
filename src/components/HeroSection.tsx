"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { WHATSAPP_URL } from "@/lib/locations";

export default function HeroSection() {
  const [showImage, setShowImage] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const t = setTimeout(() => setShowImage(true), 4000);
    return () => clearTimeout(t);
  }, []);

  const scrollToProducts = () => {
    const el = document.getElementById("products");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section style={{ background: "var(--bg)", overflow: "hidden" }}>
      <style>{`
        .hero-text {
          padding: 24px 20px 20px;
          text-align: center;
          transition: opacity 0.5s ease, max-height 0.6s ease, padding 0.5s ease;
          max-height: 600px;
          opacity: 1;
          overflow: hidden;
        }
        .hero-text.hide {
          opacity: 0;
          max-height: 0;
          padding: 0;
          pointer-events: none;
        }
        .hero-img-block {
          opacity: 0;
          max-height: 0;
          overflow: hidden;
          transition: opacity 0.7s ease, max-height 0.7s ease;
        }
        .hero-img-block.show {
          opacity: 1;
          max-height: 800px;
        }
      `}</style>

      {/* Text hero — always renders server side, visible immediately */}
      <div className={`hero-text${showImage ? " hide" : ""}`}>
        <div className="hero-tag">Now Delivering Across Bangalore</div>
        <h1 style={{
          fontFamily: "var(--font-display)", fontSize: "clamp(1.7rem, 5vw, 2.8rem)",
          fontWeight: 900, lineHeight: 1.1, marginBottom: 10, color: "var(--white)"
        }}>
          Buy Vape in{" "}
          <em style={{ color: "var(--orange)", fontStyle: "italic" }}>Bangalore</em>
          <br />20–30 Min Delivery
        </h1>
        <p style={{
          fontSize: "0.88rem", color: "var(--muted)",
          maxWidth: 480, margin: "0 auto 20px", lineHeight: 1.5
        }}>
          Disposable vapes, pod systems & e-liquids — discreet delivery to BTM,
          HSR, Koramangala, Whitefield & 20+ areas.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 340, margin: "0 auto" }}>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp"
            style={{ justifyContent: "center" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.554 4.122 1.523 5.855L0 24l6.29-1.49A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.007-1.374l-.36-.214-3.733.884.937-3.638-.234-.374A9.818 9.818 0 0112 2.182c5.424 0 9.818 4.394 9.818 9.818 0 5.425-4.394 9.818-9.818 9.818z"/>
            </svg>
            Order on WhatsApp
          </a>
          <a
            href="#products"
            className="btn-secondary"
            style={{ textAlign: "center" }}
            onClick={(e) => { e.preventDefault(); scrollToProducts(); }}
          >
            Browse Products →
          </a>
        </div>
      </div>

      {/* Delivery image — slides in after 4s, buttons BELOW */}
      {mounted && (
        <div className={`hero-img-block${showImage ? " show" : ""}`}>
          {/* Image */}
          <div style={{ position: "relative", width: "100%", aspectRatio: "4/3" }}>
            <Image
              src="/hero-delivery.png"
              alt="VapeInBangalore — 30-45 Min Delivery Across Bangalore"
              fill
              style={{ objectFit: "cover", objectPosition: "center top" }}
              priority
              sizes="100vw"
            />
          </div>

          {/* Buttons below image */}
          <div style={{
            padding: "14px 20px 20px",
            background: "var(--bg)",
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                gap: 8, background: "#25d366", color: "#fff",
                padding: "13px 20px", borderRadius: 10,
                fontFamily: "var(--font-display)", fontWeight: 700,
                fontSize: "0.95rem", textDecoration: "none",
                WebkitTapHighlightColor: "transparent",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.554 4.122 1.523 5.855L0 24l6.29-1.49A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.007-1.374l-.36-.214-3.733.884.937-3.638-.234-.374A9.818 9.818 0 0112 2.182c5.424 0 9.818 4.394 9.818 9.818 0 5.425-4.394 9.818-9.818 9.818z"/>
              </svg>
              Order on WhatsApp
            </a>
            <button
              onClick={scrollToProducts}
              style={{
                background: "var(--bg-2)", border: "1px solid var(--border)",
                color: "var(--white)", padding: "12px 20px",
                borderRadius: 10, fontFamily: "var(--font-display)",
                fontWeight: 700, fontSize: "0.95rem",
                cursor: "pointer", WebkitTapHighlightColor: "transparent",
              }}
            >
              Browse Products →
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
