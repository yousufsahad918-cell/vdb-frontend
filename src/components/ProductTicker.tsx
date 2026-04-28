"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { products } from "@/lib/products";

const tickerItems = [...products, ...products];

export default function ProductTicker() {
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const dragStartY = useRef(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const scrollStartRef = useRef(0);

  const handleProductTap = (productName: string) => {
    if (isDragging) return;
    const productCards = document.querySelectorAll(".product-card");
    productCards.forEach((card) => {
      const h3 = card.querySelector("h3");
      if (h3 && h3.textContent === productName) {
        card.scrollIntoView({ behavior: "smooth", block: "center" });
        (card as HTMLElement).style.outline = "2px solid var(--green)";
        setTimeout(() => { (card as HTMLElement).style.outline = "none"; }, 1800);
      }
    });
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    dragStartX.current = e.touches[0].clientX;
    dragStartY.current = e.touches[0].clientY;
    scrollStartRef.current = wrapperRef.current?.scrollLeft || 0;
    setIsDragging(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const dx = Math.abs(e.touches[0].clientX - dragStartX.current);
    const dy = Math.abs(e.touches[0].clientY - dragStartY.current);
    // Only intercept horizontal swipe — let vertical scroll pass through
    if (dx > dy && dx > 6) {
      e.preventDefault(); // prevent page scroll only on horizontal swipe
      setIsDragging(true);
      setIsPaused(true);
      if (wrapperRef.current) {
        wrapperRef.current.scrollLeft = scrollStartRef.current + (dragStartX.current - e.touches[0].clientX);
      }
    }
  };

  const handleTouchEnd = () => {
    setTimeout(() => {
      setIsDragging(false);
      setIsPaused(false);
    }, 120);
  };

  return (
    <div style={{
      width: "100%",
      padding: "14px 0",
      background: "var(--bg)",
      position: "relative",
      overflow: "hidden",
    }}>
      <style>{`
        @keyframes tickerScroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes glowPulse {
          0%, 100% { filter: drop-shadow(0 0 8px rgba(22,163,74,0.35)); }
          50%       { filter: drop-shadow(0 0 20px rgba(22,163,74,0.7)); }
        }
        .ticker-track {
          display: flex;
          align-items: center;
          gap: 20px;
          width: max-content;
          animation: tickerScroll 28s linear infinite;
          padding: 6px 0;
        }
        .ticker-track.paused {
          animation-play-state: paused;
        }
        .ticker-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          flex-shrink: 0;
          -webkit-tap-highlight-color: transparent;
          user-select: none;
        }
        .ticker-img-wrap {
          width: 120px;
          height: 120px;
          position: relative;
          background: transparent;
          border: none;
          animation: glowPulse 3s ease-in-out infinite;
          transition: transform 0.15s ease;
        }
        .ticker-card:active .ticker-img-wrap {
          transform: scale(0.9);
        }
        .ticker-label {
          font-size: 0.65rem;
          color: var(--muted);
          font-family: var(--font-display);
          font-weight: 700;
          white-space: nowrap;
          max-width: 120px;
          overflow: hidden;
          text-overflow: ellipsis;
          text-align: center;
        }
        .ticker-fade-l {
          position: absolute; left: 0; top: 0; bottom: 0; width: 40px;
          background: linear-gradient(to right, var(--bg), transparent);
          z-index: 2; pointer-events: none;
        }
        .ticker-fade-r {
          position: absolute; right: 0; top: 0; bottom: 0; width: 40px;
          background: linear-gradient(to left, var(--bg), transparent);
          z-index: 2; pointer-events: none;
        }
      `}</style>

      <div className="ticker-fade-l" />
      <div className="ticker-fade-r" />

      <div
        ref={wrapperRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        style={{
          overflow: "hidden",
          paddingLeft: 16,
          touchAction: "pan-y", // allow vertical scroll, intercept horizontal manually
        }}
      >
        <div className={`ticker-track ${isPaused ? "paused" : ""}`}>
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
                  style={{ objectFit: "contain" }}
                  sizes="120px"
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
