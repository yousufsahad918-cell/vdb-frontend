"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

const FALLBACK = "916282878843";
const WA_BASE = "https://wa.me/";
const WA_MSG = "?text=Hi%2C%20I%20want%20to%20order%20a%20vape";

const SLIDES = [
  { src: "/hero-original.webp", alt: "Vape Delivery Bangalore 30-45 Mins" },
  { src: "/hero-fakeweb.webp", alt: "Stop Falling for Fake Websites" },
  { src: "/hero-elfbar.webp", alt: "Elfbar Official Supplier Bangalore" },
  { src: "/hero-reusable.webp", alt: "Reusable Vapes in Bangalore" },
  { src: "/hero-zyn.webp", alt: "ZYN Nicotine Pouches Bangalore" },
];

export default function HeroSection() {
  const [showImage, setShowImage] = useState(false);
  const [current, setCurrent] = useState(0);
  const [waUrl, setWaUrl] = useState(`${WA_BASE}${FALLBACK}${WA_MSG}`);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setShowImage(true), 4000);
    fetch("https://web-production-92e501.up.railway.app/settings")
      .then(r => r.json())
      .then(d => { if (d?.whatsapp) setWaUrl(`${WA_BASE}${d.whatsapp}${WA_MSG}`); })
      .catch(() => {});
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!showImage) return;
    intervalRef.current = setInterval(() => {
      setCurrent(p => (p + 1) % SLIDES.length);
    }, 4000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [showImage]);

  const goTo = (i: number) => {
    setCurrent(i);
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrent(p => (p + 1) % SLIDES.length);
    }, 4000);
  };

  const scrollToProducts = () => {
    const el = document.getElementById("products");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div style={{ background: "#ffffff" }}>
      <div style={{ position: "relative", minHeight: showImage ? 0 : "auto" }}>

        {/* Text — shows first 4s */}
        <div style={{
          padding: "24px 20px 20px",
          textAlign: "center",
          opacity: showImage ? 0 : 1,
          transition: "opacity 0.5s ease",
          pointerEvents: showImage ? "none" : "auto",
          position: showImage ? "absolute" : "relative",
          top: 0, left: 0, right: 0,
        }}>
          <div className="hero-tag" style={{color:"#16a34a", fontWeight:700}}>Now Delivering Across Bangalore</div>
          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.7rem, 5vw, 2.8rem)",
            fontWeight: 900, lineHeight: 1.1,
            marginBottom: 10, color: "#000000",
          }}>
            Buy Vape in <em style={{ color: "var(--orange)", fontStyle: "italic" }}>Bangalore</em>
            <br />30-45 Min Delivery
          </h1>
          <p style={{
            fontSize: "0.88rem", color: "#222222",
            maxWidth: 480, margin: "0 auto 20px", lineHeight: 1.5,
          }}>
            Disposable vapes, pod systems & e-liquids — discreet delivery to BTM,
            HSR, Koramangala, Whitefield & 20+ areas.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 340, margin: "0 auto" }}>
            <a href={waUrl} target="_blank" rel="noopener noreferrer" className="btn-whatsapp" style={{ justifyContent: "center" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.554 4.122 1.523 5.855L0 24l6.29-1.49A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.007-1.374l-.36-.214-3.733.884.937-3.638-.234-.374A9.818 9.818 0 0112 2.182c5.424 0 9.818 4.394 9.818 9.818 0 5.425-4.394 9.818-9.818 9.818z"/>
              </svg>
              Order on WhatsApp
            </a>
            <a href="#products" className="btn-secondary" style={{ textAlign: "center" }} onClick={e => { e.preventDefault(); scrollToProducts(); }}>
              Browse Products →
            </a>
          </div>
        </div>

        {/* Carousel */}
        {showImage && (
          <div style={{ animation: "fadeIn 0.6s ease forwards" }}>
            <div style={{ position: "relative", width: "100%", aspectRatio: "16/9", overflow: "hidden", background: "#000" }}>
              {SLIDES.map((slide, i) => (
                <div key={i} style={{
                  position: "absolute", inset: 0,
                  opacity: i === current ? 1 : 0,
                  transition: "opacity 0.6s ease",
                }}>
                  <Image
                    src={slide.src}
                    alt={slide.alt}
                    fill
                    style={{ objectFit: "contain", objectPosition: "center" }}
                    priority={i === 0}
                    sizes="100vw"
                  />
                </div>
              ))}

              {/* Dot indicators */}
              <div style={{
                position: "absolute", bottom: 10, left: 0, right: 0,
                display: "flex", justifyContent: "center", gap: 6, zIndex: 10,
              }}>
                {SLIDES.map((_, i) => (
                  <button key={i} onClick={() => goTo(i)} style={{
                    width: i === current ? 20 : 8, height: 8,
                    borderRadius: 4, border: "none", cursor: "pointer",
                    background: i === current ? "#fff" : "rgba(255,255,255,0.4)",
                    transition: "all 0.3s ease", padding: 0,
                  }} />
                ))}
              </div>
            </div>

            {/* CTA buttons below carousel */}
            <div style={{ padding: "14px 20px 20px", display: "flex", flexDirection: "column", gap: 10 }}>
              <a href={waUrl} target="_blank" rel="noopener noreferrer" style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                gap: 8, background: "#25d366", color: "#fff",
                padding: "13px 20px", borderRadius: 10,
                fontFamily: "var(--font-display)", fontWeight: 700,
                fontSize: "0.95rem", textDecoration: "none",
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.554 4.122 1.523 5.855L0 24l6.29-1.49A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.007-1.374l-.36-.214-3.733.884.937-3.638-.234-.374A9.818 9.818 0 0112 2.182c5.424 0 9.818 4.394 9.818 9.818 0 5.425-4.394 9.818-9.818 9.818z"/>
                </svg>
                Order on WhatsApp
              </a>
              <button onClick={scrollToProducts} style={{
                background: "#1a1a1a", border: "1px solid #333",
                color: "#fff", padding: "12px 20px", borderRadius: 10,
                fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.95rem",
                cursor: "pointer",
              }}>
                Browse Products →
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
