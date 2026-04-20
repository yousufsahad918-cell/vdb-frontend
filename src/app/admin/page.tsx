"use client";

import { useState, useEffect } from "react";

const ADMIN_PASSWORD = "vib@admin2024";

interface Order {
  _id: string;
  order_id: string;
  customer_name: string;
  customer_phone: string;
  main_location: string;
  sub_location: string;
  items: { name: string; quantity: number; price: number; flavour?: string }[];
  total: number;
  status: string;
  created_at: string;
}

interface Dashboard {
  total_orders: number;
  pending: number;
  confirmed: number;
  out_for_delivery: number;
  delivered: number;
  today_orders: number;
  today_revenue: number;
}

const STATUS_COLORS: Record<string, string> = {
  pending: "#f59e0b",
  confirmed: "#3b82f6",
  out_for_delivery: "#8b5cf6",
  delivered: "#10b981",
  cancelled: "#ef4444",
};

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchData = async () => {
    setLoading(true);
    const [ordersRes, dashRes] = await Promise.all([
      fetch(`/api/orders${filter !== "all" ? `?status=${filter}` : ""}`),
      fetch("/api/dashboard"),
    ]);
    const ordersData = await ordersRes.json();
    const dashData = await dashRes.json();
    setOrders(ordersData.orders || []);
    setDashboard(dashData);
    setLoading(false);
  };

  useEffect(() => {
    if (authed) fetchData();
  }, [authed, filter]);

  const updateStatus = async (orderId: string, status: string) => {
    await fetch(`/api/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchData();
    setSelectedOrder(null);
  };

  if (!authed) {
    return (
      <div style={{
        minHeight: "100vh", display: "flex", alignItems: "center",
        justifyContent: "center", background: "var(--bg)",
      }}>
        <div style={{
          background: "var(--bg-2)", border: "1px solid var(--border)",
          borderRadius: 16, padding: "40px", width: "100%", maxWidth: 380,
        }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", fontWeight: 800, marginBottom: 8 }}>
            VIB Admin
          </h1>
          <p style={{ color: "var(--muted)", fontSize: "0.85rem", marginBottom: 24 }}>
            Enter admin password to continue
          </p>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && password === ADMIN_PASSWORD && setAuthed(true)}
            style={{
              width: "100%", padding: "12px 14px", marginBottom: 12,
              background: "var(--bg-3)", border: "1px solid var(--border)",
              borderRadius: 8, color: "var(--white)", fontSize: "0.95rem",
              fontFamily: "var(--font-body)", outline: "none", boxSizing: "border-box",
            }}
          />
          {password && password !== ADMIN_PASSWORD && (
            <p style={{ color: "#ef4444", fontSize: "0.8rem", marginBottom: 8 }}>Wrong password</p>
          )}
          <button
            onClick={() => password === ADMIN_PASSWORD && setAuthed(true)}
            style={{
              width: "100%", padding: "12px", background: "var(--orange)",
              border: "none", borderRadius: 8, color: "#fff",
              fontFamily: "var(--font-display)", fontWeight: 700,
              fontSize: "0.95rem", cursor: "pointer",
            }}
          >
            Login →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", padding: "24px 16px" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", fontWeight: 800 }}>
            VIB Admin
          </h1>
          <button
            onClick={fetchData}
            style={{
              background: "var(--bg-3)", border: "1px solid var(--border)",
              color: "var(--white)", borderRadius: 8, padding: "8px 16px",
              cursor: "pointer", fontFamily: "var(--font-display)", fontSize: "0.85rem",
            }}
          >
            🔄 Refresh
          </button>
        </div>

        {/* Dashboard Stats */}
        {dashboard && (
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
            gap: 12, marginBottom: 24,
          }}>
            {[
              { label: "Today's Orders", value: dashboard.today_orders, color: "var(--orange)" },
              { label: "Today's Revenue", value: `₹${dashboard.today_revenue.toLocaleString()}`, color: "#10b981" },
              { label: "Pending", value: dashboard.pending, color: "#f59e0b" },
              { label: "Confirmed", value: dashboard.confirmed, color: "#3b82f6" },
              { label: "Out for Delivery", value: dashboard.out_for_delivery, color: "#8b5cf6" },
              { label: "Delivered", value: dashboard.delivered, color: "#10b981" },
            ].map((stat) => (
              <div key={stat.label} style={{
                background: "var(--bg-2)", border: "1px solid var(--border)",
                borderRadius: 12, padding: "16px 12px", textAlign: "center",
              }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", fontWeight: 800, color: stat.color }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: 4 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Filter */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
          {["all", "pending", "confirmed", "out_for_delivery", "delivered", "cancelled"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              style={{
                padding: "6px 14px", borderRadius: 20,
                background: filter === s ? "var(--orange)" : "var(--bg-3)",
                border: filter === s ? "none" : "1px solid var(--border)",
                color: filter === s ? "#fff" : "var(--muted)",
                cursor: "pointer", fontSize: "0.8rem",
                fontFamily: "var(--font-display)", fontWeight: 600,
              }}
            >
              {STATUS_LABELS[s] || "All"}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {loading ? (
          <p style={{ color: "var(--muted)", textAlign: "center", padding: 40 }}>Loading...</p>
        ) : orders.length === 0 ? (
          <p style={{ color: "var(--muted)", textAlign: "center", padding: 40 }}>No orders found</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {orders.map((order) => (
              <div
                key={order._id}
                onClick={() => setSelectedOrder(selectedOrder?._id === order._id ? null : order)}
                style={{
                  background: "var(--bg-2)", border: `1px solid ${selectedOrder?._id === order._id ? "var(--orange)" : "var(--border)"}`,
                  borderRadius: 12, padding: "16px", cursor: "pointer",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.9rem" }}>
                        {order.customer_name}
                      </span>
                      <span style={{
                        background: STATUS_COLORS[order.status] + "22",
                        color: STATUS_COLORS[order.status],
                        border: `1px solid ${STATUS_COLORS[order.status]}44`,
                        borderRadius: 20, padding: "2px 8px", fontSize: "0.72rem",
                        fontWeight: 600, fontFamily: "var(--font-display)",
                      }}>
                        {STATUS_LABELS[order.status] || order.status}
                      </span>
                    </div>
                    <p style={{ fontSize: "0.8rem", color: "var(--muted)", marginBottom: 2 }}>
                      📞 {order.customer_phone} · 📍 {order.sub_location}, {order.main_location}
                    </p>
                    <p style={{ fontSize: "0.78rem", color: "var(--muted)" }}>
                      {order.items.map(i => `${i.name}${i.flavour ? ` (${i.flavour})` : ""} ×${i.quantity}`).join(", ")}
                    </p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1rem", color: "var(--orange)" }}>
                      ₹{order.total.toLocaleString()}
                    </div>
                    <div style={{ fontSize: "0.72rem", color: "var(--muted)" }}>
                      {new Date(order.created_at).toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" })}
                    </div>
                    <div style={{ fontSize: "0.72rem", color: "var(--muted)" }}>{order.order_id}</div>
                  </div>
                </div>

                {/* Action buttons */}
                {selectedOrder?._id === order._id && (
                  <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }} onClick={e => e.stopPropagation()}>
                    {["confirmed", "out_for_delivery", "delivered", "cancelled"].map((s) => (
                      <button
                        key={s}
                        onClick={() => updateStatus(order.order_id, s)}
                        style={{
                          padding: "6px 12px", borderRadius: 8,
                          background: STATUS_COLORS[s] + "22",
                          border: `1px solid ${STATUS_COLORS[s]}44`,
                          color: STATUS_COLORS[s],
                          cursor: "pointer", fontSize: "0.78rem",
                          fontFamily: "var(--font-display)", fontWeight: 600,
                        }}
                      >
                        → {STATUS_LABELS[s]}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
