"use client";

import { useState, useRef, useEffect } from "react";
import { useCart } from "@/lib/cart";
import { locationOptions } from "@/lib/locationOptions";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://vib-api.up.railway.app";

interface Props {
  onBack: () => void;
}

export default function CheckoutForm({ onBack }: Props) {
  const { items, total, clearCart } = useCart();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<{ label: string; sublocation: string; mainLocation: string } | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
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

  const handleSubmit = async () => {
    if (!name.trim()) { setError("Please enter your name"); return; }
    if (!phone.trim() || phone.length < 10) { setError("Please enter a valid phone number"); return; }
    
    // Accept either a selected location OR free text typed in
    const finalLocation = selectedLocation 
      ? { label: selectedLocation.label, sublocation: selectedLocation.sublocation, mainLocation: selectedLocation.mainLocation }
      : locationSearch.trim() 
        ? { label: locationSearch.trim(), sublocation: locationSearch.trim(), mainLocation: "Other" }
        : null;

    if (!finalLocation) { setError("Please enter your delivery location"); return; }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/orders`, {
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
            image: i.image,
          })),
          total,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setOrderId(data.order_id);
        clearCart();
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch (err) {
      setError("Could not connect. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (orderId) {
    return (
      <div style={{ padding: "40px 20px", textAlign: "center" }}>
        <div style={{ fontSize: "3.5rem", marginBottom: 16 }}>✅</div>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", fontWeight: 800, marginBottom: 8 }}>
          Order Placed!
        </h2>
        <p style={{ color: "var(--muted)", marginBottom: 16, fontSize: "0.9rem" }}>
          Your order has been received. We'll contact you shortly.
        </p>
        <div style={{
          background: "var(--bg-3)", borderRadius: 12, padding: "16px",
          border: "1px solid var(--border)", marginBottom: 24,
        }}>
          <p style={{ fontSize: "0.8rem", color: "var(--muted)", marginBottom: 4 }}>Order ID</p>
          <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.1rem", color: "var(--orange)" }}>
            {orderId}
          </p>
        </div>
        <p style={{ fontSize: "0.82rem", color: "var(--muted)" }}>
          Save your order ID for tracking. Our team will call you at {phone} to confirm delivery.
        </p>
      </div>
    );
  }

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
            No match found — your typed location "<strong style={{color: "var(--white)"}}>{locationSearch}</strong>" will be used for delivery.
          </div>
        )}
        {selectedLocation && (
          <div style={{
            marginTop: 8, padding: "8px 12px",
            background: "var(--orange-glow)", borderRadius: 8,
            border: "1px solid rgba(255,92,0,0.3)",
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <div>
              <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.85rem", color: "var(--orange)" }}>
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
            <span>{item.name} × {item.quantity}</span>
            <span style={{ fontWeight: 600 }}>₹{(item.price * item.quantity).toLocaleString()}</span>
          </div>
        ))}
        <div style={{
          borderTop: "1px solid var(--border)", marginTop: 8, paddingTop: 8,
          display: "flex", justifyContent: "space-between",
        }}>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}>Total</span>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: "var(--orange)", fontSize: "1.1rem" }}>
            ₹{total.toLocaleString()}
          </span>
        </div>
      </div>

      {error && (
        <p style={{ color: "#ef4444", fontSize: "0.85rem", textAlign: "center" }}>{error}</p>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{
          width: "100%", padding: "14px",
          background: loading ? "var(--muted)" : "var(--orange)",
          border: "none", borderRadius: 10, color: "#fff",
          fontFamily: "var(--font-display)", fontWeight: 700,
          fontSize: "1rem", cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Placing Order..." : "Place Order →"}
      </button>

      <p style={{ fontSize: "0.78rem", color: "var(--muted)", textAlign: "center" }}>
        Cash on delivery · We'll call to confirm · 20-30 min delivery
      </p>
    </div>
  );
}
