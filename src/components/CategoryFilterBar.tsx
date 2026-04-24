"use client";

import { useState } from "react";
import { products } from "@/lib/products";

const FILTERS = [
  {
    id: "all",
    label: "All",
    color: "#f8c105",
    match: () => true,
  },
  {
    id: "disposable",
    label: "Disposable Vape",
    color: "#06b6d4",
    match: (n: string) =>
      ["Elfbar", "Lost Mary", "Nasty", "IGET", "Yuoto", "Pod Salt Hit"].some(b => n.includes(b)) &&
      !n.includes("Caliburn") && !n.includes("Core Nic") && !n.includes("Elfliq"),
  },
  {
    id: "reusable",
    label: "Reusable Vape",
    color: "#a78bfa",
    match: (n: string) => n.includes("Caliburn"),
  },
  {
    id: "nic-salts",
    label: "Nic Salts",
    color: "#10b981",
    match: (n: string) => n.includes("Elfliq") || n.includes("Core Nic Salt"),
  },
  {
    id: "pouches",
    label: "Nicotine Pouch",
    color: "#3b82f6",
    match: (n: string) => n.includes("ZYN") || n.includes("Velo"),
  },
  {
    id: "tobacco",
    label: "Tobacco",
    color: "#a16207",
    match: (n: string) => ["Amber", "Drum", "Golden", "American"].some(t => n.includes(t)),
  },
];

interface Props {
  onFilter: (matchFn: ((name: string) => boolean) | null) => void;
}

export default function CategoryFilterBar({ onFilter }: Props) {
  const [activeId, setActiveId] = useState("all");

  const handleClick = (filter: typeof FILTERS[0]) => {
    setActiveId(filter.id);
    onFilter(filter.id === "all" ? null : filter.match);
  };

  return (
    <div style={{ overflow: "hidden" }}>
      <style>{`.cfb::-webkit-scrollbar{display:none}`}</style>
      <div
        className="cfb"
        style={{
          display: "flex",
          gap: 8,
          overflowX: "auto",
          scrollbarWidth: "none",
          paddingBottom: 4,
          touchAction: "pan-x",
          WebkitOverflowScrolling: "touch" as any,
        }}
      >
        {FILTERS.map(filter => {
          const isActive = activeId === filter.id;

          return (
            <button
              key={filter.id}
              onPointerDown={(e) => { e.preventDefault(); handleClick(filter); }}
              style={{
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                gap: 5,
                padding: "10px 16px",
                borderRadius: 30,
                border: isActive
                  ? `1.5px solid ${filter.color}`
                  : "1.5px solid var(--border)",
                background: isActive ? filter.color + "20" : "var(--bg-2)",
                color: isActive ? filter.color : "var(--muted)",
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "0.8rem",
                cursor: "pointer",
                transition: "background 0.15s, color 0.15s, border-color 0.15s",
                WebkitTapHighlightColor: "transparent",
                boxShadow: isActive ? `0 0 14px ${filter.color}30` : "none",
                whiteSpace: "nowrap",
                touchAction: "manipulation",
                userSelect: "none",
                minHeight: 44,
                WebkitUserSelect: "none",
              }}
            >
              {isActive && (
                <span style={{
                  width: 6, height: 6,
                  borderRadius: "50%",
                  background: filter.color,
                  flexShrink: 0,
                }} />
              )}
              {filter.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
