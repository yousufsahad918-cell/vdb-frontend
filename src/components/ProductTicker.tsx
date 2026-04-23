"use client";

import Image from "next/image";
import { products } from "@/lib/products";

// Duplicate for seamless loop
const tickerItems = [...products, ...products];

export default function ProductTicker() {
  return (
    <div style={{
      overflow: "hidden",
      width: "100%",
      padding: "12px 0",
      background: "var(--bg-2)",
      borderTop: "1px solid var(--border)",
      borderBottom: "1px solid var(--border)",
      marginBottom: 0,
    }}>
      <style>{`
        @keyframes ticker {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .ticker-track {
          display: flex;
          gap: 16px;
          width: max-content;
          animation: ticker 18s linear infinite;
        }
        .ticker-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="ticker-track">
        {tickerItems.map((product, i) => (
          <a
            key={`${product.name}-${i}`}
            href="#products"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              textDecoration: "none",
              flexShrink: 0,
              cursor: "pointer",
            }}
            onClick={(e) => {
              e.preventDefault();
              const el = document.getElementById("products");
              if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
          >
            <div style={{
              width: 64,
              height: 64,
              borderRadius: 10,
              overflow: "hidden",
              background: "var(--bg-3)",
              border: "1px solid var(--border)",
              position: "relative",
              flexShrink: 0,
            }}>
              <Image
                src={product.image}
                alt={product.name}
                fill
                style={{ objectFit: "contain", padding: 4 }}
                sizes="64px"
              />
            </div>
            <span style={{
              fontSize: "0.62rem",
              color: "var(--muted)",
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              whiteSpace: "nowrap",
              maxWidth: 64,
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}>
              {product.name.replace("Elfbar ", "")}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
