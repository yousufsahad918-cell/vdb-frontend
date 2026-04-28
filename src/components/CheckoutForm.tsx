"use client";

import { useState, useRef, useEffect } from "react";
import { useCart } from "@/lib/cart";
import { locationOptions } from "@/lib/locationOptions";
import { useRouter } from "next/navigation";

const API_URL = "/api";
const ADMIN_PHONE = "916282878843";

interface Props {
  onBack: () => void;
}

function buildWhatsAppMessage(
  name: string,
  phone: string,
  location: string,
  items: { name: string; quantity: number; price: number; flavour?: string }[],
  total: number
): string {
  const itemLines = items
    .map((i) => `- ${i.name}${i.flavour ? ` (${i.flavour})` : ""} x${i.quantity} = Rs.${(i.price * i.quantity).toLocaleString()}`)
    .join("\n");

  const message = `Hi! I want to place an order.

*Name:* ${name}
*Phone:* ${phone}
*Delivery Location:* ${location}

*Items:*
${itemLines}

*Total: Rs.${total.toLocaleString()}*

Please confirm my order. Thank you!`;

  return encodeURIComponent(message);
}

export default function CheckoutForm({ onBack }: Props) {
  const { items, total, clearCart, setIsOpen } = useCart();
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<{ label: string; sublocation: string; mainLocation: string } | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [error, setError] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredLocations = locationOptions.filter((loc) =>
    loc.label.toLowerCase().includes(locationSearch.toLowerCase()) ||
    loc.mainLocation.toLowerCase().includes(locationSearch.toLowerCase())
  ).slice(0, 8);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleWhatsApp = async () => {
    if (!name.trim()) { setError("Please enter your name"); return; }
    if (!phone.trim() || phone.length < 10) { setError("Please enter a valid phone number"); return; }

    const finalLocation = selectedLocation
      ? { label: selectedLocation.label, sublocation: selectedLocation.sublocation, mainLocation: selectedLocation.mainLocation }
      : locationSearch.trim()
        ? { label: locationSearch.trim(), sublocation: locationSearch.trim(), mainLocation: "Other" }
        : null;

    if (!finalLocation) { setError("Please enter your delivery location"); return; }

    setError("");

    // Save to MongoDB silently in background — don't await, don't block
    fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer_name: name,
        customer_phone: phone,
        main_location: finalLocation.mainLocation,
        sub_location: finalLocation.sublocation,
        items: items.map((i) => ({
          product_id: i.product_id,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
          flavour: i.flavour,
          image: i.image,
        })),
        total,
        source: "whatsapp",
      }),
    }).catch(() => {}); // silent fail — WhatsApp still opens even if DB save fails

    const msg = buildWhatsAppMessage(
      name,
      phone,
      finalLocation.label,
      items.map((i) => ({ name: i.name, quantity: i.quantity, price: i.price, flavour: i.flavour })),
      total
    );

    window.open(`https://wa.me/${ADMIN_PHONE}?text=${msg}`, "_blank");

    // Reset — clear cart, close drawer, go home
    clearCart();
    setIsOpen(false);
    router.push("/");
  };

  const inputStyle = {
    width: "100%", padding: "12px 14px",
    background: "var(--bg-3)", border: "1px solid var(--border)",
    borderRadius: 8, color: "var(--white)",
    fontFamily: "var(--font-body)", fontSize: "0.95rem",
    outline: "none",
  };

  const labelStyle = {
    fontSize: "0.82rem", fontWeight: 600,
    color: "var(--muted)", marginBottom: 6, display: "block",
    fontFamily: "var(--font-display)", letterSpacing: "0.04em",
    textTransform: "uppercase" as const,
  };

  return (
    <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: 20 }}>
      <button
        onClick={onBack}
        style={{
          background: "none", border: "none", color: "var(--muted)",
          cursor: "pointer", fontFamily: "var(--font-display)",
          fontSize: "0.85rem", textAlign: "left", padding: 0,
        }}
      >
        ← Back to Cart
      </button>

      <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.1rem" }}>
        Delivery Details
      </h3>

      {/* Name */}
      <div>
        <label style={labelStyle}>Full Name</label>
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={inputStyle}
        />
      </div>

      {/* Phone */}
      <div>
        <label style={labelStyle}>Phone Number</label>
        <input
          type="tel"
          placeholder="10-digit mobile number"
          value={phone}
          onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
          style={inputStyle}
        />
      </div>

      {/* Location */}
      <div ref={dropdownRef}>
        <label style={labelStyle}>Delivery Location</label>
        <input
          type="text"
          placeholder="Type your area, city or locality..."
          value={selectedLocation ? selectedLocation.label : locationSearch}
          onChange={(e) => {
            setLocationSearch(e.target.value);
            setSelectedLocation(null);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
          style={inputStyle}
        />
        {showDropdown && locationSearch && filteredLocations.length > 0 && (
          <div style={{
            background: "var(--bg-3)", border: "1px solid var(--border)",
            borderRadius: 8, marginTop: 4, overflow: "hidden",
            maxHeight: 240, overflowY: "auto",
          }}>
            {filteredLocations.map((loc) => (
              <button
                key={loc.label}
                onClick={() => {
                  setSelectedLocation(loc);
                  setLocationSearch("");
                  setShowDropdown(false);
                }}
                style={{
                  width: "100%", padding: "10px 14px",
                  background: "none", border: "none",
                  borderBottom: "1px solid var(--border)",
                  color: "var(--text)", cursor: "pointer",
                  textAlign: "left", display: "flex",
                  flexDirection: "column", gap: 2,
                }}
              >
                <span style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.9rem" }}>
                  {loc.label}
                </span>
                <span style={{ fontSize: "0.75rem", color: "var(--muted)" }}>
                  {loc.mainLocation}
                </span>
              </button>
            ))}
          </div>
        )}
        {showDropdown && locationSearch && filteredLocations.length === 0 && (
          <div style={{
            background: "var(--bg-3)", border: "1px solid var(--border)",
            borderRadius: 8, marginTop: 4, padding: "10px 14px",
            fontSize: "0.82rem", color: "var(--muted)",
          }}>
            No match found — your typed location "<strong style={{ color: "var(--white)" }}>{locationSearch}</strong>" will be used for delivery.
          </div>
        )}
        {selectedLocation && (
          <div style={{
            marginTop: 8, padding: "8px 12px",
            background: "var(--green-glow)", borderRadius: 8,
            border: "1px solid rgba(255,92,0,0.3)",
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <div>
              <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.85rem", color: "var(--green)" }}>
                {selectedLocation.label}
              </p>
              <p style={{ fontSize: "0.75rem", color: "var(--muted)" }}>{selectedLocation.mainLocation}</p>
            </div>
            <button
              onClick={() => setSelectedLocation(null)}
              style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer" }}
            >✕</button>
          </div>
        )}
      </div>

      {/* Order Summary */}
      <div style={{
        background: "var(--bg-3)", borderRadius: 12,
        padding: 16, border: "1px solid var(--border)",
      }}>
        <p style={{ ...labelStyle, marginBottom: 12 }}>Order Summary</p>
        {items.map((item) => (
          <div key={item.product_id} style={{
            display: "flex", justifyContent: "space-between",
            fontSize: "0.85rem", marginBottom: 8, color: "var(--text)",
          }}>
            <span>{item.name} x {item.quantity}</span>
            <span style={{ fontWeight: 600 }}>Rs.{(item.price * item.quantity).toLocaleString()}</span>
          </div>
        ))}
        <div style={{
          borderTop: "1px solid var(--border)", marginTop: 8, paddingTop: 8,
          display: "flex", justifyContent: "space-between",
        }}>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}>Total</span>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: "var(--green)", fontSize: "1.1rem" }}>
            Rs.{total.toLocaleString()}
          </span>
        </div>
      </div>

      {error && (
        <p style={{ color: "#ef4444", fontSize: "0.85rem", textAlign: "center" }}>{error}</p>
      )}

      {/* WhatsApp Order Button */}
      <button
        onClick={handleWhatsApp}
        style={{
          width: "100%", padding: "14px",
          background: "#25d366",
          border: "none", borderRadius: 10, color: "#fff",
          fontFamily: "var(--font-display)", fontWeight: 700,
          fontSize: "1rem", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.554 4.122 1.523 5.855L0 24l6.29-1.49A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.007-1.374l-.36-.214-3.733.884.937-3.638-.234-.374A9.818 9.818 0 0112 2.182c5.424 0 9.818 4.394 9.818 9.818 0 5.425-4.394 9.818-9.818 9.818z"/>
        </svg>
        Complete Order on WhatsApp
      </button>

      <p style={{ fontSize: "0.78rem", color: "var(--muted)", textAlign: "center" }}>
        Tap above to send your order via WhatsApp. We will confirm and dispatch immediately.
      </p>
    </div>
  );
}
