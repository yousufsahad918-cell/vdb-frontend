"use client";

import { useState } from "react";
import { products } from "@/lib/products";

const FILTERS = [
  { id: "all", label: "All", color: "#16a34a", match: () => true },
  { id: "disposable", label: "Disposable Vape", color: "#0891b2",
    match: (n: string) => ["Elfbar", "Lost Mary", "Nasty", "IGET", "Yuoto", "Pod Salt Hit"].some(b => n.includes(b)) && !n.includes("Caliburn") && !n.includes("Core Nic") && !n.includes("Elfliq") },
  { id: "reusable", label: "Reusable Vape", color: "#7c3aed", match: (n: string) => n.includes("Caliburn") },
  { id: "nic-salts", label: "Nic Salts", color: "#059669", match: (n: string) => n.includes("Elfliq") || n.includes("Core Nic Salt") },
  { id: "pouches", label: "Nicotine Pouch", color: "#2563eb", match: (n: string) => n.includes("ZYN") || n.includes("Velo") },
  { id: "tobacco", label: "Tobacco", color: "#92400e", match: (n: string) => ["Amber", "Drum", "Golden", "American"].some(t => n.includes(t)) },
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
      <div className="cfb" style={{ display: "flex", gap: 8, overflowX: "auto", scrollbarWidth: "none", paddingBottom: 4 }}>
        {FILTERS.map(filter => {
          const isActive = activeId === filter.id;
          return (
            <button
              key={filter.id}
              onPointerDown={(e) => { e.preventDefault(); handleClick(filter); }}
              style={{
                flexShrink: 0,
                display: "flex", alignItems: "center", gap: 5,
                padding: "9px 16px", borderRadius: 30,
                border: isActive ? `1.5px solid ${filter.color}` : "1.5px solid var(--border)",
                background: isActive ? filter.color + "18" : "var(--bg-2)",
                color: isActive ? filter.color : "var(--muted)",
                fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.8rem",
                cursor: "pointer", transition: "all 0.2s",
                WebkitTapHighlightColor: "transparent",
                boxShadow: isActive ? `0 0 14px ${filter.color}20` : "none",
                whiteSpace: "nowrap", touchAction: "manipulation",
                userSelect: "none", minHeight: 44,
              }}
            >
              {isActive && <span style={{ width: 6, height: 6, borderRadius: "50%", background: filter.color, flexShrink: 0 }} />}
              {filter.label}
            </button>
          );
        })}
        <div style={{ flexShrink: 0, width: 16 }} />
      </div>
    </div>
  );
}
