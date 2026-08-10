"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const MESSAGES = [
  "Hi, I want to order a vape in Bangalore. Please confirm availability.",
  "Hey, ordering from Bangalore. Please share what's available.",
  "Hello, I'd like to order a vape in Bangalore. Let me know the ETA.",
  "Hi there, I want to place an order from Bangalore. Please confirm.",
];

export default function BottomNav() {
  const pathname = usePathname();
  const [showPopup, setShowPopup] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [msg] = useState(() => MESSAGES[Math.floor(Math.random() * MESSAGES.length)]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPopup(true);
      setTimeout(() => setPopupVisible(true), 50);
      setTimeout(() => {
        setPopupVisible(false);
        setTimeout(() => setShowPopup(false), 400);
      }, 2500);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const active = (path: string) => pathname === path;
  const green = "#16a34a";
  const inactiveColor = "rgba(0,0,0,0.35)";
  const activeBg = "rgba(22,163,74,0.08)";

  return (
    <>
      <div style={{ height: "70px" }} />
      <nav style={{
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 9998,
        background: "#fff",
        borderTop: "1px solid #e5e7eb",
        display: "flex",
        paddingBottom: "env(safe-area-inset-bottom, 8px)",
        boxShadow: "0 -2px 12px rgba(0,0,0,0.06)",
      }}>
        <Link href="/" style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "3px", textDecoration: "none", padding: "8px 4px", background: active("/") ? activeBg : "none" }}>
          <span style={{ fontSize: "20px", lineHeight: 1, filter: active("/") ? "none" : "grayscale(1) opacity(0.4)" }}>🏠</span>
          <span style={{ fontSize: "9px", fontWeight: active("/") ? 700 : 500, color: active("/") ? green : inactiveColor }}>Home</span>
        </Link>

        <Link href="/products" style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "3px", textDecoration: "none", padding: "8px 4px", background: active("/products") ? activeBg : "none" }}>
          <span style={{ fontSize: "20px", lineHeight: 1, filter: active("/products") ? "none" : "grayscale(1) opacity(0.4)" }}>🛍</span>
          <span style={{ fontSize: "9px", fontWeight: active("/products") ? 700 : 500, color: active("/products") ? green : inactiveColor }}>Products</span>
        </Link>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", padding: "8px 4px" }}>
          {showPopup && (
            <div style={{
              position: "absolute", bottom: "100%", left: "50%", transform: "translateX(-50%)",
              background: "#25D366", color: "#fff", fontSize: "10px", fontWeight: 700,
              padding: "5px 10px", borderRadius: "100px", whiteSpace: "nowrap", marginBottom: "6px",
              opacity: popupVisible ? 1 : 0, transition: "opacity 0.4s ease",
              boxShadow: "0 2px 8px rgba(37,211,102,0.4)", pointerEvents: "none",
            }}>
              Need help? 💬
              <div style={{ position: "absolute", bottom: "-4px", left: "50%", transform: "translateX(-50%)", width: 0, height: 0, borderLeft: "4px solid transparent", borderRight: "4px solid transparent", borderTop: "4px solid #25D366" }} />
            </div>
          )}
          <a href={`https://wa.me/916282878843?text=${encodeURIComponent(msg)}`}
            target="_blank" rel="noopener noreferrer"
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "3px", textDecoration: "none" }}>
            <span style={{ fontSize: "20px", lineHeight: 1 }}>💬</span>
            <span style={{ fontSize: "9px", fontWeight: 700, color: "#25D366" }}>Order</span>
          </a>
        </div>

        <Link href="/reviews" style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "3px", textDecoration: "none", padding: "8px 4px", background: active("/reviews") ? activeBg : "none" }}>
          <span style={{ fontSize: "20px", lineHeight: 1, filter: active("/reviews") ? "none" : "grayscale(1) opacity(0.4)" }}>⭐</span>
          <span style={{ fontSize: "9px", fontWeight: active("/reviews") ? 700 : 500, color: active("/reviews") ? green : inactiveColor }}>Reviews</span>
        </Link>

        <Link href="/blog" style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "3px", textDecoration: "none", padding: "8px 4px", background: active("/blog") ? activeBg : "none" }}>
          <span style={{ fontSize: "20px", lineHeight: 1, filter: active("/blog") ? "none" : "grayscale(1) opacity(0.4)" }}>📖</span>
          <span style={{ fontSize: "9px", fontWeight: active("/blog") ? 700 : 500, color: active("/blog") ? green : inactiveColor }}>Blog</span>
        </Link>
      </nav>
    </>
  );
}
