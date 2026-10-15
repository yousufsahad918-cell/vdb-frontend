"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const OFFERS = [
  { slug: "elfbar-raya-d1", name: "Elfbar Raya D1", original: 2699, sale: 2599, puffs: "13,000 puffs" },
  { slug: "elfbar-d3-pro", name: "Elfbar D3 Pro", original: 3499, sale: 3199, puffs: "25,000 puffs" },
  { slug: "elfbar-raya-sobo", name: "Elfbar Raya SOBO", original: 3899, sale: 3499, puffs: "20,000 puffs" },
  { slug: "vpok-cool-bar", name: "VpoK Cool Bar 20K", original: 2699, sale: 2499, puffs: "20,000 puffs" },
];

// Set end time to this coming Sunday at 11:59 PM
function getSundayEnd() {
  const now = new Date();
  const day = now.getDay(); // 0=Sun, 1=Mon...
  const daysUntilSunday = day === 0 ? 7 : 7 - day;
  const sunday = new Date(now);
  sunday.setDate(now.getDate() + daysUntilSunday);
  sunday.setHours(23, 59, 59, 0);
  return sunday;
}

const END_TIME = getSundayEnd();

export default function FlashSale() {
  const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0 });
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    function update() {
      const diff = END_TIME.getTime() - Date.now();
      if (diff <= 0) { setExpired(true); return; }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft({ h, m, s });
    }
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  if (expired) return null;

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <section style={{ background: "linear-gradient(135deg, #f0faf3 0%, #fff 50%, #f0faf3 100%)", border: "1px solid rgba(22,163,74,0.3)", borderRadius: "16px", padding: "20px 16px", margin: "0 0 24px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px", flexWrap: "wrap", gap: "8px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "18px", animation: "pulse 1s ease-in-out infinite" }}>🔥</span>
          <div>
            <div style={{ fontFamily: "var(--font-bebas)", fontSize: "20px", color: "#fff", letterSpacing: "0.05em", lineHeight: 1 }}>SUNDAY SALE</div>
            <div style={{ fontSize: "10px", color: "rgba(22,163,74,0.8)", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>Limited time · Ends Sunday midnight</div>
          </div>
        </div>

        {/* Countdown */}
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          {[{ v: pad(timeLeft.h), l: "HRS" }, { v: pad(timeLeft.m), l: "MIN" }, { v: pad(timeLeft.s), l: "SEC" }].map((t, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ background: "#16a34a", color: "#14532d", fontFamily: "var(--font-display)", fontSize: "22px", letterSpacing: "0.02em", padding: "4px 8px", borderRadius: "6px", minWidth: "36px", textAlign: "center", lineHeight: 1 }}>{t.v}</div>
              <div style={{ fontSize: "8px", color: "rgba(20,83,45,0.4)", fontWeight: 700, letterSpacing: "0.1em", marginTop: "2px" }}>{t.l}</div>
              {i < 2 && <div style={{ position: "absolute", fontSize: "16px", color: "#16a34a", fontWeight: 900, marginLeft: "36px", marginBottom: "8px" }}>:</div>}
            </div>
          ))}
        </div>
      </div>

      {/* Products */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px" }}>
        {OFFERS.map(p => {
          const saving = p.original - p.sale;
          const pct = Math.round((saving / p.original) * 100);
          const waMsg = encodeURIComponent(`Hi, I want to order ${p.name} at the Sunday Sale price of Rs ${p.sale}. Please confirm availability.`);
          return (
            <div key={p.slug} style={{ background: "rgba(22,163,74,0.04)", border: "1px solid rgba(200,16,46,0.2)", borderRadius: "10px", padding: "12px", position: "relative", overflow: "hidden" }}>
              {/* Sale badge */}
              <div style={{ position: "absolute", top: "8px", right: "8px", background: "#16a34a", color: "#fff", fontSize: "9px", fontWeight: 800, padding: "2px 6px", borderRadius: "4px", letterSpacing: "0.05em" }}>
                -{pct}%
              </div>
              <div style={{ fontSize: "9px", color: "rgba(22,163,74,0.7)", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "4px" }}>Elfbar</div>
              <div style={{ fontSize: "12px", fontWeight: 700, color: "#fff", marginBottom: "2px", paddingRight: "28px", lineHeight: 1.3 }}>{p.name}</div>
              <div style={{ fontSize: "9px", color: "rgba(20,83,45,0.4)", marginBottom: "8px" }}>{p.puffs}</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: "6px", marginBottom: "8px" }}>
                <span style={{ fontFamily: "var(--font-bebas)", fontSize: "18px", color: "#16a34a", letterSpacing: "0.02em" }}>₹{p.sale.toLocaleString()}</span>
                <span style={{ fontSize: "11px", color: "rgba(20,83,45,0.4)", textDecoration: "line-through" }}>₹{p.original.toLocaleString()}</span>
                <span style={{ fontSize: "9px", color: "#22C55E", fontWeight: 700 }}>Save ₹{saving}</span>
              </div>
              <a href={`https://wa.me/916282878843?text=${waMsg}`} target="_blank" rel="noopener noreferrer"
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "4px", background: "#25D366", color: "#fff", borderRadius: "6px", padding: "7px", fontSize: "10px", fontWeight: 700, textDecoration: "none", width: "100%" }}>
                ⚡ Order at Sale Price
              </a>
            </div>
          );
        })}
      </div>
      <style>{`@keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.2)} }`}</style>
    </section>
  );
}
