"use client";

import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { products } from "@/lib/products";

const tickerItems = [...products, ...products];

export default function ProductTicker() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const scrollStartX = useRef(0);
  const animOffset = useRef(0);

  // Tap to scroll to specific product and highlight it
  const handleProductTap = (productName: string) => {
    if (isDragging) return;
    const productCards = document.querySelectorAll(".product-card");
    productCards.forEach((card) => {
      const h3 = card.querySelector("h3");
      if (h3 && h3.textContent === productName) {
        card.scrollIntoView({ behavior: "smooth", block: "center" });
        (card as HTMLElement).style.outline = "2px solid var(--orange)";
        (card as HTMLElement).style.transition = "outline 0.3s";
        setTimeout(() => {
          (card as HTMLElement).style.outline = "none";
        }, 1800);
      }
    });
  };

  // Touch swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    dragStartX.current = e.touches[0].clientX;
    scrollStartX.current = trackRef.current?.scrollLeft || 0;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!trackRef.current) return;
    setIsDragging(true);
    const dx = dragStartX.current - e.touches[0].clientX;
    trackRef.current.scrollLeft = scrollStartX.current + dx;
  };

  const handleTouchEnd = () => {
    setTimeout(() => {
      setIsDragging(false);
      setIsPaused(false);
    }, 100);
  };

  return (
    <div style={{
      width: "100%",
      padding: "14px 0",
      background: "var(--bg-2)",
      borderTop: "1px solid rgba(248,193,5,0.25)",
      borderBottom: "1px solid rgba(248,193,5,0.25)",
      position: "relative",
      overflow: "hidden",
    }}>
      <style>{`
        @keyframes tickerScroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes glowPulse {
          0%, 100% { box-shadow: 0 0 8px rgba(248,193,5,0.25), inset 0 0 0 1px rgba(248,193,5,0.2); }
          50%       { box-shadow: 0 0 18px rgba(248,193,5,0.55), inset 0 0 0 1px rgba(248,193,5,0.4); }
        }
        .ticker-auto {
          display: flex;
          align-items: center;
          gap: 12px;
          width: max-content;
          animation: tickerScroll 24s linear infinite;
          padding: 4px 0;
        }
        .ticker-auto.paused {
          animation-play-state: paused;
        }
        .ticker-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 5px;
          cursor: pointer;
          text-decoration: none;
          flex-shrink: 0;
          -webkit-tap-highlight-color: transparent;
        }
        .ticker-img-wrap {
          width: 78px;
          height: 78px;
          border-radius: 14px;
          background: var(--bg-3);
          border: 1.5px solid rgba(248,193,5,0.3);
          position: relative;
          overflow: hidden;
          animation: glowPulse 3s ease-in-out infinite;
          transition: transform 0.18s ease, border-color 0.18s;
        }
        .ticker-card:active .ticker-img-wrap {
          transform: scale(0.93);
          border-color: rgba(248,193,5,0.8);
        }
        .ticker-label {
          font-size: 0.62rem;
          color: var(--muted);
          font-family: var(--font-display);
          font-weight: 700;
          white-space: nowrap;
          max-width: 78px;
          overflow: hidden;
          text-overflow: ellipsis;
          text-align: center;
          letter-spacing: 0.02em;
        }

        /* Fade edges */
        .ticker-fade-left {
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 32px;
          background: linear-gradient(to right, var(--bg-2), transparent);
          z-index: 2;
          pointer-events: none;
        }
        .ticker-fade-right {
          position: absolute;
          right: 0; top: 0; bottom: 0;
          width: 32px;
          background: linear-gradient(to left, var(--bg-2), transparent);
          z-index: 2;
          pointer-events: none;
        }
      `}</style>

      {/* Fade edges */}
      <div className="ticker-fade-left" />
      <div className="ticker-fade-right" />

      <div
        ref={trackRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        style={{ overflow: "hidden", paddingLeft: 16 }}
      >
        <div className={`ticker-auto ${isPaused ? "paused" : ""}`}>
          {tickerItems.map((product, i) => (
            <div
              key={`${product.name}-${i}`}
              className="ticker-card"
              onClick={() => handleProductTap(product.name)}
            >
              <div className="ticker-img-wrap">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  style={{ objectFit: "contain", padding: 6 }}
                  sizes="78px"
                />
              </div>
              <span className="ticker-label">
                {product.name.replace("Elfbar ", "")}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
