"use client";

import { useState, useRef } from "react";
import { products } from "@/lib/products";

const FILTER_GROUPS = [
  {
    id: "all",
    label: "✦ All",
    color: "#f8c105",
    match: () => true,
    sub: [],
  },
  {
    id: "elfbar",
    label: "Elfbar",
    color: "#f8c105",
    match: (n: string) => n.startsWith("Elfbar") || n.startsWith("Elfliq"),
    sub: [
      { label: "Disposable", match: (n: string) => n === "Elfbar 600" },
      { label: "Raya Series", match: (n: string) => n.includes("Raya") },
      { label: "High Puff", match: (n: string) => ["BC", "Ice King", "Trio", "MoonNight", "SOBO"].some(t => n.includes(t)) },
      { label: "Refill", match: (n: string) => n.includes("Elfliq") },
    ],
  },
  {
    id: "lost-mary",
    label: "Lost Mary",
    color: "#06b6d4",
    match: (n: string) => n.includes("Lost Mary"),
    sub: [
      { label: "MT35000", match: (n: string) => n.includes("MT35000") },
      { label: "MO10000", match: (n: string) => n.includes("MO10000") },
    ],
  },
  {
    id: "nasty",
    label: "Nasty",
    color: "#eab308",
    match: (n: string) => n.includes("Nasty"),
    sub: [],
  },
  {
    id: "iget",
    label: "IGET",
    color: "#7dd3fc",
    match: (n: string) => n.includes("IGET"),
    sub: [],
  },
  {
    id: "yuoto",
    label: "Yuoto",
    color: "#ef4444",
    match: (n: string) => n.includes("Yuoto"),
    sub: [],
  },
  {
    id: "pod-salt",
    label: "Pod Salt",
    color: "#f97316",
    match: (n: string) => n.includes("Pod Salt"),
    sub: [
      { label: "Disposable", match: (n: string) => n.includes("Hit The Spot") },
      { label: "Nic Salt", match: (n: string) => n.includes("Core") },
    ],
  },
  {
    id: "caliburn",
    label: "Caliburn",
    color: "#a78bfa",
    match: (n: string) => n.includes("Caliburn"),
    sub: [
      { label: "KOKO Series", match: (n: string) => n.includes("KOKO") },
      { label: "G3 Series", match: (n: string) => n.includes("G3") && !n.includes("KOKO") },
      { label: "G4 Series", match: (n: string) => n.includes("G4") && !n.includes("KOKO") },
      { label: "G5 Series", match: (n: string) => n.includes("G5") && !n.includes("KOKO") },
    ],
  },
  {
    id: "pouches",
    label: "Pouches",
    color: "#3b82f6",
    match: (n: string) => n.includes("ZYN") || n.includes("Velo"),
    sub: [],
  },
  {
    id: "tobacco",
    label: "Tobacco",
    color: "#a16207",
    match: (n: string) => ["Amber", "Drum", "Golden", "American"].some(t => n.includes(t)),
    sub: [
      { label: "Amber Leaf", match: (n: string) => n.includes("Amber") },
      { label: "Drum", match: (n: string) => n.includes("Drum") },
      { label: "Golden Virginia", match: (n: string) => n.includes("Golden") },
      { label: "American Spirit", match: (n: string) => n.includes("American") },
    ],
  },
];

interface Props {
  onFilter: (matchFn: ((name: string) => boolean) | null) => void;
}

export default function CategoryFilterBar({ onFilter }: Props) {
  const [activeGroup, setActiveGroup] = useState("all");
  const [activeSub, setActiveSub] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleGroupClick = (group: typeof FILTER_GROUPS[0]) => {
    if (activeGroup === group.id && !activeSub) {
      setActiveGroup("all");
      setActiveSub(null);
      onFilter(null);
    } else {
      setActiveGroup(group.id);
      setActiveSub(null);
      onFilter(group.id === "all" ? null : group.match);
    }
  };

  const handleSubClick = (sub: { label: string; match: (n: string) => boolean }) => {
    if (activeSub === sub.label) {
      setActiveSub(null);
      const group = FILTER_GROUPS.find(g => g.id === activeGroup);
      onFilter(group?.match || null);
    } else {
      setActiveSub(sub.label);
      onFilter(sub.match);
    }
  };

  const activeGroupData = FILTER_GROUPS.find(g => g.id === activeGroup);
  const color = activeGroupData?.color || "#f8c105";

  return (
    <div style={{ position: "sticky", top: 56, zIndex: 300, background: "var(--bg)", paddingBottom: 0 }}>
      <style>{`
        .filter-bar-track::-webkit-scrollbar { display: none; }
        .filter-bar-track { scrollbar-width: none; }
        @keyframes filterPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(248,193,5,0.4); }
          50% { box-shadow: 0 0 0 4px rgba(248,193,5,0); }
        }
      `}</style>

      {/* Main brand pills */}
      <div
        ref={scrollRef}
        className="filter-bar-track"
        style={{
          display: "flex",
          gap: 8,
          overflowX: "auto",
          padding: "10px 16px 6px",
          borderBottom: `1px solid ${activeGroup !== "all" ? color + "40" : "var(--border)"}`,
          transition: "border-color 0.3s",
        }}
      >
        {FILTER_GROUPS.map(group => {
          const isActive = activeGroup === group.id;
          const count = group.id === "all"
            ? products.length
            : products.filter(p => group.match(p.name)).length;

          return (
            <button
              key={group.id}
              onClick={() => handleGroupClick(group)}
              style={{
                flexShrink: 0,
                padding: "7px 14px",
                borderRadius: 30,
                border: isActive ? `1.5px solid ${group.color}` : "1.5px solid var(--border)",
                background: isActive ? group.color + "22" : "var(--bg-2)",
                color: isActive ? group.color : "var(--muted)",
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "0.78rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 5,
                transition: "all 0.2s",
                WebkitTapHighlightColor: "transparent",
                boxShadow: isActive ? `0 0 12px ${group.color}30` : "none",
              }}
            >
              {isActive && (
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: group.color, flexShrink: 0 }} />
              )}
              {group.label}
              <span style={{
                background: isActive ? group.color + "33" : "var(--bg-3)",
                color: isActive ? group.color : "var(--muted)",
                borderRadius: 20,
                padding: "1px 6px",
                fontSize: "0.65rem",
                fontWeight: 700,
              }}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Sub-category pills — only show when a brand with subs is selected */}
      {activeGroupData && activeGroupData.sub.length > 0 && (
        <div
          className="filter-bar-track"
          style={{
            display: "flex",
            gap: 6,
            overflowX: "auto",
            padding: "6px 16px 8px",
            background: color + "08",
            borderBottom: "1px solid var(--border)",
          }}
        >
          {activeGroupData.sub.map(sub => {
            const isSubActive = activeSub === sub.label;
            return (
              <button
                key={sub.label}
                onClick={() => handleSubClick(sub)}
                style={{
                  flexShrink: 0,
                  padding: "5px 12px",
                  borderRadius: 20,
                  border: isSubActive ? `1px solid ${color}` : "1px solid var(--border)",
                  background: isSubActive ? color : "transparent",
                  color: isSubActive ? "var(--btn-text)" : "var(--muted)",
                  fontFamily: "var(--font-display)",
                  fontWeight: 600,
                  fontSize: "0.72rem",
                  cursor: "pointer",
                  transition: "all 0.15s",
                  WebkitTapHighlightColor: "transparent",
                }}
              >
                {sub.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
