"use client";
import { useState, useEffect } from "react";
import { products } from "@/lib/products";

interface Review {
  id: string;
  productSlug: string;
  productName: string;
  author: string;
  area: string;
  rating: number;
  text: string;
  date: string;
}

function StarPicker({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display: "flex", gap: "6px" }}>
      {[1,2,3,4,5].map(s => (
        <button key={s} type="button" onClick={() => onChange(s)}
          onMouseEnter={() => setHover(s)} onMouseLeave={() => setHover(0)}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill={(hover || value) >= s ? "#16a34a" : "#d1d5db"}>
            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
          </svg>
        </button>
      ))}
    </div>
  );
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"read" | "write">("read");
  const [filterSlug, setFilterSlug] = useState("all");
  const [form, setForm] = useState({ productSlug: "", author: "", area: "", rating: 0, text: "" });

  useEffect(() => {
    fetch("/api/reviews")
      .then(r => r.json())
      .then(d => { setReviews(d.reviews || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleSubmit = async () => {
    setError("");
    if (!form.productSlug) return setError("Please select a product.");
    if (!form.author.trim()) return setError("Please enter your name.");
    if (!form.rating) return setError("Please select a star rating.");
    if (form.text.trim().length < 10) return setError("Review must be at least 10 characters.");
    setSubmitting(true);
    const product = products.find(p => p.slug === form.productSlug);
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, productName: product?.name || form.productSlug }),
    });
    const data = await res.json();
    setSubmitting(false);
    if (data.success) setSubmitted(true);
    else setError(data.error || "Failed to submit. Try again.");
  };

  const filtered = filterSlug === "all" ? reviews : reviews.filter(r => r.productSlug === filterSlug);
  const green = "#16a34a";

  return (
    <main style={{ background: "#f6faf7", minHeight: "100vh", paddingTop: "80px", paddingBottom: "100px" }}>
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "32px 20px" }}>

        <div style={{ marginBottom: "28px" }}>
          <div style={{ fontSize: "11px", color: green, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "8px" }}>Customer Reviews</div>
          <h1 style={{ fontSize: "clamp(1.75rem,5vw,2.5rem)", fontWeight: 900, color: "#14532d", letterSpacing: "-0.02em", marginBottom: "8px" }}>What Customers Say</h1>
          <p style={{ fontSize: "13px", color: "#6b7280", lineHeight: 1.6 }}>Real reviews from real customers across Bangalore. All reviews are verified before publishing.</p>
        </div>

        <div style={{ display: "flex", gap: "8px", marginBottom: "28px" }}>
          {(["read", "write"] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              style={{ padding: "10px 24px", borderRadius: "8px", border: "none", cursor: "pointer", fontSize: "13px", fontWeight: 600,
                background: activeTab === tab ? green : "#fff",
                color: activeTab === tab ? "#fff" : "#6b7280",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
              {tab === "read" ? "Read Reviews" : "Write a Review"}
            </button>
          ))}
        </div>

        {activeTab === "read" && (
          <div>
            <select value={filterSlug} onChange={e => setFilterSlug(e.target.value)}
              style={{ background: "#fff", border: "1px solid #d1d5db", color: "#374151", borderRadius: "8px", padding: "10px 14px", fontSize: "13px", marginBottom: "20px", width: "100%", maxWidth: "300px", outline: "none" }}>
              <option value="all">All Products</option>
              {products.map(p => <option key={p.slug} value={p.slug}>{p.name}</option>)}
            </select>
            {loading ? (
              <div style={{ textAlign: "center", padding: "40px", color: "#9ca3af" }}>Loading reviews...</div>
            ) : filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px", color: "#9ca3af" }}>
                <div style={{ fontSize: "40px", marginBottom: "12px" }}>⭐</div>
                <p>No reviews yet.</p>
                <button onClick={() => setActiveTab("write")} style={{ marginTop: "16px", background: green, color: "#fff", border: "none", borderRadius: "8px", padding: "10px 20px", cursor: "pointer", fontWeight: 600, fontSize: "13px" }}>
                  Be the first to review
                </button>
              </div>
            ) : (
              <div style={{ display: "grid", gap: "12px" }}>
                {filtered.map(r => (
                  <div key={r.id} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "18px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", flexWrap: "wrap" }}>
                      <div style={{ display: "flex", gap: "2px" }}>
                        {[1,2,3,4,5].map(s => (
                          <svg key={s} width="12" height="12" viewBox="0 0 24 24" fill={s <= r.rating ? green : "#d1d5db"}><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" /></svg>
                        ))}
                      </div>
                      <span style={{ fontSize: "13px", fontWeight: 700, color: "#111" }}>{r.author}</span>
                      <span style={{ fontSize: "11px", color: "#9ca3af" }}>· {r.area}</span>
                      <span style={{ fontSize: "10px", color: green, background: "#f0faf3", border: "1px solid #bbf7d0", padding: "2px 8px", borderRadius: "100px", marginLeft: "auto" }}>{r.productName}</span>
                    </div>
                    <p style={{ fontSize: "13px", color: "#374151", lineHeight: 1.7 }}>{r.text}</p>
                    <div style={{ fontSize: "10px", color: "#9ca3af", marginTop: "8px" }}>{r.date}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "write" && (
          <div>
            {submitted ? (
              <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "32px", textAlign: "center" }}>
                <div style={{ fontSize: "48px", marginBottom: "12px" }}>🎉</div>
                <h2 style={{ fontSize: "22px", fontWeight: 900, color: "#14532d", marginBottom: "8px" }}>Review Submitted!</h2>
                <p style={{ color: "#6b7280", fontSize: "13px" }}>Thank you! Your review will appear after verification.</p>
                <button onClick={() => { setSubmitted(false); setForm({ productSlug: "", author: "", area: "", rating: 0, text: "" }); setActiveTab("read"); }}
                  style={{ marginTop: "20px", background: green, color: "#fff", border: "none", borderRadius: "8px", padding: "10px 24px", cursor: "pointer", fontWeight: 600, fontSize: "13px" }}>
                  Read All Reviews
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <label style={{ fontSize: "11px", fontWeight: 700, color: green, letterSpacing: "0.08em", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>Product *</label>
                  <select value={form.productSlug} onChange={e => setForm(f => ({ ...f, productSlug: e.target.value }))}
                    style={{ width: "100%", background: "#fff", border: "1px solid #d1d5db", borderRadius: "8px", padding: "12px 14px", fontSize: "14px", color: "#374151", outline: "none" }}>
                    <option value="">Select a product...</option>
                    {products.map(p => <option key={p.slug} value={p.slug}>{p.brand} — {p.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: "11px", fontWeight: 700, color: green, letterSpacing: "0.08em", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>Your Rating *</label>
                  <StarPicker value={form.rating} onChange={r => setForm(f => ({ ...f, rating: r }))} />
                </div>
                <div>
                  <label style={{ fontSize: "11px", fontWeight: 700, color: green, letterSpacing: "0.08em", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>Your Name *</label>
                  <input type="text" value={form.author} onChange={e => setForm(f => ({ ...f, author: e.target.value }))}
                    placeholder="e.g. Rahul K"
                    style={{ width: "100%", background: "#fff", border: "1px solid #d1d5db", borderRadius: "8px", padding: "12px 14px", fontSize: "14px", color: "#374151", outline: "none" }} />
                </div>
                <div>
                  <label style={{ fontSize: "11px", fontWeight: 700, color: green, letterSpacing: "0.08em", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>Your Area</label>
                  <input type="text" value={form.area} onChange={e => setForm(f => ({ ...f, area: e.target.value }))}
                    placeholder="e.g. Koramangala, Indiranagar, HSR"
                    style={{ width: "100%", background: "#fff", border: "1px solid #d1d5db", borderRadius: "8px", padding: "12px 14px", fontSize: "14px", color: "#374151", outline: "none" }} />
                </div>
                <div>
                  <label style={{ fontSize: "11px", fontWeight: 700, color: green, letterSpacing: "0.08em", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>Your Review *</label>
                  <textarea value={form.text} onChange={e => setForm(f => ({ ...f, text: e.target.value }))}
                    placeholder="Tell us about your experience..."
                    rows={4}
                    style={{ width: "100%", background: "#fff", border: "1px solid #d1d5db", borderRadius: "8px", padding: "12px 14px", fontSize: "14px", color: "#374151", outline: "none", resize: "vertical", fontFamily: "inherit" }} />
                  <div style={{ fontSize: "10px", color: "#9ca3af", marginTop: "4px" }}>{form.text.length}/500</div>
                </div>
                {error && <div style={{ fontSize: "12px", color: "#dc2626", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "6px", padding: "10px 14px" }}>{error}</div>}
                <button onClick={handleSubmit} disabled={submitting}
                  style={{ background: submitting ? "#d1d5db" : green, color: "#fff", border: "none", borderRadius: "8px", padding: "14px", fontSize: "14px", fontWeight: 700, cursor: submitting ? "not-allowed" : "pointer" }}>
                  {submitting ? "Submitting..." : "Submit Review"}
                </button>
                <p style={{ fontSize: "11px", color: "#9ca3af", textAlign: "center" }}>All reviews verified before publishing.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
