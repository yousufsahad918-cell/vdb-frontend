"use client";

import { useState, useEffect, useCallback, useRef } from "react";

const ADMIN_PASSWORD = "vib@admin2024";
const PAGE_SIZE = 50;
const AUTO_REFRESH_MS = 5 * 60 * 1000; // 5 minutes

// Cloudinary config — fill these in after creating your free account
const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "";
const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "";

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

interface Product {
  _id?: string;
  name: string;
  category: string;
  price: number;
  discount: number;
  image_url: string;
  flavours: string[];
  in_stock: boolean;
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

const CATEGORIES = ["Vape", "Tobacco", "Accessory", "Other"];

function buildWhatsAppMessage(order: Order): string {
  const items = order.items
    .map((i) => `- ${i.name}${i.flavour ? ` (${i.flavour})` : ""} x${i.quantity}`)
    .join("\n");

  const message = `Hey ${order.customer_name}!

*Order Received — ${order.order_id}*

Thanks for ordering from Vape Bangalore! Here's a summary of your order:

${items}
*Total: Rs.${order.total.toLocaleString()}*

*Delivery to:* ${order.sub_location}, ${order.main_location}

We will shortly confirm your order. Could you also share your *current/precise location* (Google Maps pin)? This helps us dispatch faster.

*Note:* COD is temporarily disabled. Your order will be dispatched via *Porter or Rapido*. We will share the *tracking ID* as soon as the booking is confirmed.

If you have any questions, just reply here!`;

  return encodeURIComponent(message);
}

// ─── Push Notification helpers ───────────────────────────────────────────────
async function registerPush(): Promise<boolean> {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    alert("Push notifications are not supported on this browser.");
    return false;
  }
  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    alert("Notification permission denied.");
    return false;
  }
  // Subscription stored locally (no VAPID server needed for basic badge)
  localStorage.setItem("vib_push_enabled", "true");
  return true;
}

function isPushEnabled(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("vib_push_enabled") === "true";
}

// ─── Empty product form ───────────────────────────────────────────────────────
const emptyProduct = (): Omit<Product, "_id"> => ({
  name: "",
  category: "Vape",
  price: 0,
  discount: 0,
  image_url: "",
  flavours: [],
  in_stock: true,
});

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(false);
  const [activeTab, setActiveTab] = useState<"orders" | "products" | "accounts">("orders");
  const [orderCache, setOrderCache] = useState<Record<string, Order[]>>({});

  // Product form
  const [products, setProducts] = useState<Product[]>([]);
  const [productForm, setProductForm] = useState<Omit<Product, "_id">>(emptyProduct());
  const [flavourInput, setFlavourInput] = useState("");
  const [productSaving, setProductSaving] = useState(false);
  const [productMsg, setProductMsg] = useState("");
  const [imageUploading, setImageUploading] = useState(false);
  const autoRefreshRef = useRef<NodeJS.Timeout | null>(null);

  // Accounts state
  const [accountsTab, setAccountsTab] = useState<"customers" | "inventory" | "purchases" | "sales">("customers");
  const [customers, setCustomers] = useState<any[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);
  const [customerOrders, setCustomerOrders] = useState<any[]>([]);
  const [inventoryItems, setInventoryItems] = useState<any[]>([]);
  const [purchases, setPurchases] = useState<any[]>([]);
  const [salesData, setSalesData] = useState<any>(null);
  const [salesRange, setSalesRange] = useState("7");
  const [accountsLoading, setAccountsLoading] = useState(false);
  const [purchaseForm, setPurchaseForm] = useState({ supplier: "", product_name: "", quantity: "", cost_per_unit: "", notes: "" });
  const [purchaseSaving, setPurchaseSaving] = useState(false);
  const [purchaseMsg, setPurchaseMsg] = useState("");

  // Auto-refresh every 5 minutes
  useEffect(() => {
    if (!authed) return;
    autoRefreshRef.current = setInterval(() => {
      fetchData(true);
    }, AUTO_REFRESH_MS);
    return () => {
      if (autoRefreshRef.current) clearInterval(autoRefreshRef.current);
    };
  }, [authed]);

  const [nextRefresh, setNextRefresh] = useState(AUTO_REFRESH_MS / 1000);

  useEffect(() => {
    if (!authed) return;
    setNextRefresh(AUTO_REFRESH_MS / 1000);
    const countdown = setInterval(() => {
      setNextRefresh((prev) => {
        if (prev <= 1) return AUTO_REFRESH_MS / 1000;
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(countdown);
  }, [authed]);

  useEffect(() => {
    setPushEnabled(isPushEnabled());
  }, []);

  const fetchData = useCallback(async (resetPage = true) => {
    // Show cached data instantly while fetching fresh
    if (orderCache[filter]) {
      setOrders(orderCache[filter]);
    }
    setLoading(true);
    const currentPage = resetPage ? 1 : page;
    if (resetPage) setPage(1);

    const [ordersRes, dashRes] = await Promise.all([
      fetch(`/api/orders?${filter !== "all" ? `status=${filter}&` : ""}limit=${PAGE_SIZE}&skip=${(currentPage - 1) * PAGE_SIZE}`),
      fetch("/api/dashboard"),
    ]);
    const ordersData = await ordersRes.json();
    const dashData = await dashRes.json();
    const fetched = ordersData.orders || [];
    const merged = resetPage ? fetched : [...(orderCache[filter] || []), ...fetched];
    setOrders(merged);
    setOrderCache((prev) => ({ ...prev, [filter]: merged }));
    setHasMore(fetched.length === PAGE_SIZE);
    setDashboard(dashData);
    setLoading(false);
  }, [filter, page, orderCache]);

  const fetchProducts = async () => {
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(data.products || []);
  };

  const fetchAccounts = async (tab = accountsTab) => {
    setAccountsLoading(true);
    if (tab === "customers") {
      const res = await fetch("/api/accounts?section=customers");
      const data = await res.json();
      setCustomers(data.customers || []);
    } else if (tab === "inventory") {
      const res = await fetch("/api/accounts?section=inventory");
      const data = await res.json();
      setInventoryItems(data.items || []);
    } else if (tab === "purchases") {
      const res = await fetch("/api/accounts?section=purchases");
      const data = await res.json();
      setPurchases(data.purchases || []);
    } else if (tab === "sales") {
      const res = await fetch(`/api/accounts?section=sales&range=${salesRange}`);
      const data = await res.json();
      setSalesData(data);
    }
    setAccountsLoading(false);
  };

  const fetchCustomerOrders = async (phone: string) => {
    const res = await fetch(`/api/accounts?section=customer_orders&phone=${phone}`);
    const data = await res.json();
    setCustomerOrders(data.orders || []);
  };

  const updateInventory = async (productId: string, stockCount: number, reorderLevel: number) => {
    await fetch("/api/accounts?section=inventory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product_id: productId, stock_count: stockCount, reorder_level: reorderLevel }),
    });
    fetchAccounts("inventory");
  };

  const handleAddPurchase = async () => {
    if (!purchaseForm.product_name || !purchaseForm.quantity || !purchaseForm.cost_per_unit) {
      setPurchaseMsg("Product, quantity and cost are required.");
      return;
    }
    setPurchaseSaving(true);
    const res = await fetch("/api/accounts?section=purchases", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(purchaseForm),
    });
    if (res.ok) {
      setPurchaseMsg("Purchase logged!");
      setPurchaseForm({ supplier: "", product_name: "", quantity: "", cost_per_unit: "", notes: "" });
      fetchAccounts("purchases");
    } else {
      setPurchaseMsg("Failed to save.");
    }
    setPurchaseSaving(false);
    setTimeout(() => setPurchaseMsg(""), 3000);
  };

  useEffect(() => {
    if (authed) {
      fetchData(true);
      fetchProducts();
    }
  }, [authed, filter]);

  useEffect(() => {
    if (authed && activeTab === "accounts") {
      fetchAccounts(accountsTab);
    }
  }, [authed, activeTab, accountsTab, salesRange]);

  const loadMore = async () => {
    const nextPage = page + 1;
    setPage(nextPage);
    setLoading(true);
    const res = await fetch(`/api/orders?${filter !== "all" ? `status=${filter}&` : ""}limit=${PAGE_SIZE}&skip={(nextPage - 1) * PAGE_SIZE}`);
    const data = await res.json();
    const fetched = data.orders || [];
    setOrders((prev) => [...prev, ...fetched]);
    setHasMore(fetched.length === PAGE_SIZE);
    setLoading(false);
  };

  const updateStatus = async (orderId: string, status: string) => {
    await fetch(`/api/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchData(true);
    setSelectedOrder(null);
  };

  const handleEnablePush = async () => {
    const ok = await registerPush();
    setPushEnabled(ok);
  };

  const handleImageUpload = async (file: File) => {
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
      setProductMsg("Cloudinary not configured. Add env vars or paste image URL manually.");
      return;
    }
    setImageUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.secure_url) {
        setProductForm((p) => ({ ...p, image_url: data.secure_url }));
        setProductMsg("Image uploaded!");
        setTimeout(() => setProductMsg(""), 2000);
      } else {
        setProductMsg("Upload failed. Try pasting a URL instead.");
      }
    } catch {
      setProductMsg("Upload error. Paste image URL manually.");
    }
    setImageUploading(false);
  };

  const handleAddProduct = async () => {
    if (!productForm.name || !productForm.price) {
      setProductMsg("Name and price are required.");
      return;
    }
    setProductSaving(true);
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productForm),
    });
    if (res.ok) {
      setProductMsg("✅ Product added!");
      setProductForm(emptyProduct());
      setFlavourInput("");
      fetchProducts();
    } else {
      setProductMsg("❌ Failed to save product.");
    }
    setProductSaving(false);
    setTimeout(() => setProductMsg(""), 3000);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    fetchProducts();
  };

  const addFlavour = () => {
    const f = flavourInput.trim();
    if (f && !productForm.flavours.includes(f)) {
      setProductForm((p) => ({ ...p, flavours: [...p.flavours, f] }));
    }
    setFlavourInput("");
  };

  // ─── Login screen ─────────────────────────────────────────────────────────
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

  // ─── Main admin UI ────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", padding: "24px 16px" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 10 }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", fontWeight: 800 }}>
            VIB Admin
          </h1>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button
              onClick={handleEnablePush}
              style={{
                background: pushEnabled ? "#10b98122" : "var(--bg-3)",
                border: `1px solid ${pushEnabled ? "#10b981" : "var(--border)"}`,
                color: pushEnabled ? "#10b981" : "var(--muted)",
                borderRadius: 8, padding: "8px 14px",
                cursor: "pointer", fontFamily: "var(--font-display)", fontSize: "0.8rem", fontWeight: 600,
              }}
            >
              {pushEnabled ? "🔔 Notifications ON" : "🔕 Enable Notifications"}
            </button>
            <button
              onClick={() => { fetchData(true); setNextRefresh(AUTO_REFRESH_MS / 1000); }}
              style={{
                background: "var(--bg-3)", border: "1px solid var(--border)",
                color: "var(--white)", borderRadius: 8, padding: "8px 16px",
                cursor: "pointer", fontFamily: "var(--font-display)", fontSize: "0.85rem",
              }}
            >
              Refresh · {Math.floor(nextRefresh / 60)}:{String(nextRefresh % 60).padStart(2, "0")}
            </button>
          </div>
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

        {/* Tab switcher */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {(["orders", "products", "accounts"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "8px 20px", borderRadius: 20,
                background: activeTab === tab ? "var(--orange)" : "var(--bg-3)",
                border: activeTab === tab ? "none" : "1px solid var(--border)",
                color: activeTab === tab ? "#fff" : "var(--muted)",
                cursor: "pointer", fontSize: "0.85rem",
                fontFamily: "var(--font-display)", fontWeight: 700,
                textTransform: "capitalize",
              }}
            >
              {tab === "orders" ? "📦 Orders" : tab === "products" ? "🛍 Products" : "📊 Accounts"}
            </button>
          ))}
        </div>

        {/* ── ORDERS TAB ── */}
        {activeTab === "orders" && (
          <>
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

            {/* Orders list */}
            {loading && orders.length === 0 ? (
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
                      background: "var(--bg-2)",
                      border: `1px solid ${selectedOrder?._id === order._id ? "var(--orange)" : "var(--border)"}`,
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

                    {/* Expanded actions */}
                    {selectedOrder?._id === order._id && (
                      <div style={{ marginTop: 12 }} onClick={(e) => e.stopPropagation()}>
                        {/* WhatsApp button */}
                        <a
                          href={`https://wa.me/91${order.customer_phone.replace(/\D/g, "")}?text=${buildWhatsAppMessage(order)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: "inline-flex", alignItems: "center", gap: 6,
                            padding: "7px 14px", borderRadius: 8, marginBottom: 10,
                            background: "#25d36622", border: "1px solid #25d36644",
                            color: "#25d366", fontSize: "0.82rem",
                            fontFamily: "var(--font-display)", fontWeight: 700,
                            textDecoration: "none",
                          }}
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="#25d366">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.554 4.122 1.523 5.855L0 24l6.29-1.49A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.007-1.374l-.36-.214-3.733.884.937-3.638-.234-.374A9.818 9.818 0 0112 2.182c5.424 0 9.818 4.394 9.818 9.818 0 5.425-4.394 9.818-9.818 9.818z"/>
                          </svg>
                          WhatsApp Customer
                        </a>

                        {/* Status buttons */}
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
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
                      </div>
                    )}
                  </div>
                ))}

                {/* Load more */}
                {hasMore && (
                  <button
                    onClick={loadMore}
                    disabled={loading}
                    style={{
                      width: "100%", padding: "12px",
                      background: "var(--bg-3)", border: "1px solid var(--border)",
                      color: "var(--muted)", borderRadius: 10,
                      cursor: "pointer", fontFamily: "var(--font-display)",
                      fontSize: "0.85rem", marginTop: 4,
                    }}
                  >
                    {loading ? "Loading..." : "Load More Orders"}
                  </button>
                )}
              </div>
            )}
          </>
        )}

        {/* ── PRODUCTS TAB ── */}
        {activeTab === "products" && (
          <div>
            {/* Add product form */}
            <div style={{
              background: "var(--bg-2)", border: "1px solid var(--border)",
              borderRadius: 14, padding: "20px", marginBottom: 24,
            }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 700, marginBottom: 16 }}>
                ➕ Add New Product
              </h2>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {/* Name */}
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={labelStyle}>Product Name *</label>
                  <input
                    placeholder="e.g. Elfbar Raya D3"
                    value={productForm.name}
                    onChange={(e) => setProductForm((p) => ({ ...p, name: e.target.value }))}
                    style={inputStyle}
                  />
                </div>

                {/* Category */}
                <div>
                  <label style={labelStyle}>Category *</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm((p) => ({ ...p, category: e.target.value }))}
                    style={{ ...inputStyle, cursor: "pointer" }}
                  >
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                {/* Price */}
                <div>
                  <label style={labelStyle}>Price (₹) *</label>
                  <input
                    type="number"
                    placeholder="2799"
                    value={productForm.price || ""}
                    onChange={(e) => setProductForm((p) => ({ ...p, price: Number(e.target.value) }))}
                    style={inputStyle}
                  />
                </div>

                {/* Discount */}
                <div>
                  <label style={labelStyle}>Discount (%)</label>
                  <input
                    type="number"
                    placeholder="10"
                    value={productForm.discount || ""}
                    onChange={(e) => setProductForm((p) => ({ ...p, discount: Number(e.target.value) }))}
                    style={inputStyle}
                  />
                </div>

                {/* Image Upload */}
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={labelStyle}>Product Image</label>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                    <label style={{
                      padding: "9px 16px", background: "var(--bg-3)",
                      border: "1px solid var(--border)", borderRadius: 8,
                      color: imageUploading ? "var(--muted)" : "var(--white)",
                      cursor: imageUploading ? "not-allowed" : "pointer",
                      fontSize: "0.82rem", fontFamily: "var(--font-display)", fontWeight: 600,
                      whiteSpace: "nowrap",
                    }}>
                      {imageUploading ? "Uploading..." : "Upload Image"}
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        disabled={imageUploading}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload(file);
                        }}
                      />
                    </label>
                    <span style={{ color: "var(--muted)", fontSize: "0.78rem" }}>or</span>
                    <input
                      placeholder="Paste image URL"
                      value={productForm.image_url}
                      onChange={(e) => setProductForm((p) => ({ ...p, image_url: e.target.value }))}
                      style={{ ...inputStyle, flex: 1, minWidth: 160 }}
                    />
                  </div>
                  {productForm.image_url && (
                    <img
                      src={productForm.image_url}
                      alt="preview"
                      style={{ marginTop: 8, height: 80, width: 80, objectFit: "cover", borderRadius: 8, border: "1px solid var(--border)" }}
                    />
                  )}
                </div>

                {/* Flavours */}
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={labelStyle}>Flavours</label>
                  <div style={{ display: "flex", gap: 8 }}>
                    <input
                      placeholder="Type a flavour and press Add"
                      value={flavourInput}
                      onChange={(e) => setFlavourInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addFlavour()}
                      style={{ ...inputStyle, flex: 1 }}
                    />
                    <button
                      onClick={addFlavour}
                      style={{
                        padding: "10px 16px", background: "var(--bg-3)",
                        border: "1px solid var(--border)", borderRadius: 8,
                        color: "var(--white)", cursor: "pointer",
                        fontFamily: "var(--font-display)", fontSize: "0.82rem",
                      }}
                    >
                      Add
                    </button>
                  </div>
                  {productForm.flavours.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
                      {productForm.flavours.map((f) => (
                        <span
                          key={f}
                          onClick={() => setProductForm((p) => ({ ...p, flavours: p.flavours.filter((x) => x !== f) }))}
                          style={{
                            background: "var(--orange)22", border: "1px solid var(--orange)44",
                            color: "var(--orange)", borderRadius: 20, padding: "3px 10px",
                            fontSize: "0.78rem", cursor: "pointer", fontFamily: "var(--font-display)",
                          }}
                        >
                          {f} ✕
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* In stock toggle */}
                <div style={{ gridColumn: "1 / -1", display: "flex", alignItems: "center", gap: 10 }}>
                  <input
                    type="checkbox"
                    id="instock"
                    checked={productForm.in_stock}
                    onChange={(e) => setProductForm((p) => ({ ...p, in_stock: e.target.checked }))}
                    style={{ width: 16, height: 16, cursor: "pointer" }}
                  />
                  <label htmlFor="instock" style={{ ...labelStyle, marginBottom: 0, cursor: "pointer" }}>
                    In Stock
                  </label>
                </div>
              </div>

              {productMsg && (
                <p style={{ fontSize: "0.82rem", color: productMsg.startsWith("✅") ? "#10b981" : "#ef4444", marginTop: 10 }}>
                  {productMsg}
                </p>
              )}

              <button
                onClick={handleAddProduct}
                disabled={productSaving}
                style={{
                  marginTop: 16, padding: "11px 24px",
                  background: "var(--orange)", border: "none",
                  borderRadius: 8, color: "#fff",
                  fontFamily: "var(--font-display)", fontWeight: 700,
                  fontSize: "0.9rem", cursor: productSaving ? "not-allowed" : "pointer",
                  opacity: productSaving ? 0.7 : 1,
                }}
              >
                {productSaving ? "Saving..." : "Save Product →"}
              </button>
            </div>

            {/* Product list */}
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 700, marginBottom: 12 }}>
              Saved Products ({products.length})
            </h2>
            {products.length === 0 ? (
              <p style={{ color: "var(--muted)", fontSize: "0.85rem" }}>No products added yet via admin.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {products.map((p) => (
                  <div key={p._id} style={{
                    background: "var(--bg-2)", border: "1px solid var(--border)",
                    borderRadius: 12, padding: "14px 16px",
                    display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10,
                  }}>
                    <div>
                      <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.9rem" }}>
                        {p.name}
                        <span style={{
                          marginLeft: 8, fontSize: "0.72rem", background: "var(--bg-3)",
                          border: "1px solid var(--border)", borderRadius: 10,
                          padding: "2px 8px", color: "var(--muted)",
                        }}>{p.category}</span>
                        {!p.in_stock && (
                          <span style={{ marginLeft: 6, fontSize: "0.72rem", color: "#ef4444" }}>Out of Stock</span>
                        )}
                      </div>
                      <div style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: 3 }}>
                        ₹{p.price.toLocaleString()}
                        {p.discount ? ` · ${p.discount}% off` : ""}
                        {p.flavours.length ? ` · ${p.flavours.length} flavours` : ""}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteProduct(p._id!)}
                      style={{
                        padding: "6px 12px", borderRadius: 8,
                        background: "#ef444422", border: "1px solid #ef444444",
                        color: "#ef4444", cursor: "pointer",
                        fontSize: "0.78rem", fontFamily: "var(--font-display)", fontWeight: 600,
                      }}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── ACCOUNTS TAB ── */}
        {activeTab === "accounts" && (
          <div>
            {/* Sub-tab switcher */}
            <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
              {(["customers", "inventory", "purchases", "sales"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setAccountsTab(t)}
                  style={{
                    padding: "7px 16px", borderRadius: 20,
                    background: accountsTab === t ? "var(--orange)" : "var(--bg-3)",
                    border: accountsTab === t ? "none" : "1px solid var(--border)",
                    color: accountsTab === t ? "#fff" : "var(--muted)",
                    cursor: "pointer", fontSize: "0.8rem",
                    fontFamily: "var(--font-display)", fontWeight: 700,
                    textTransform: "capitalize",
                  }}
                >
                  {t === "customers" ? "Customers" : t === "inventory" ? "Inventory" : t === "purchases" ? "Purchases" : "Sales"}
                </button>
              ))}
            </div>

            {accountsLoading && (
              <p style={{ color: "var(--muted)", textAlign: "center", padding: 40 }}>Loading...</p>
            )}

            {/* ── CUSTOMERS ── */}
            {!accountsLoading && accountsTab === "customers" && (
              <div>
                {selectedCustomer ? (
                  <div>
                    <button
                      onClick={() => { setSelectedCustomer(null); setCustomerOrders([]); }}
                      style={{ ...backBtnStyle, marginBottom: 16 }}
                    >
                      ← Back to Customers
                    </button>
                    <div style={{ background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: 12, padding: 16, marginBottom: 16 }}>
                      <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1rem" }}>{selectedCustomer.name}</p>
                      <p style={{ fontSize: "0.82rem", color: "var(--muted)", marginTop: 4 }}>
                        {selectedCustomer.phone} · {selectedCustomer.order_count} orders · Rs.{selectedCustomer.total_spent?.toLocaleString()} total spent
                      </p>
                      <p style={{ fontSize: "0.78rem", color: "var(--muted)", marginTop: 2 }}>
                        Areas: {selectedCustomer.locations?.join(", ")}
                      </p>
                    </div>
                    <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.85rem", marginBottom: 10, color: "var(--muted)" }}>ORDER HISTORY</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {customerOrders.map((o: any) => (
                        <div key={o._id} style={{ background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: 10, padding: "12px 14px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 6 }}>
                            <div>
                              <span style={{ fontSize: "0.8rem", fontFamily: "var(--font-display)", fontWeight: 700 }}>{o.order_id}</span>
                              <span style={{ marginLeft: 8, fontSize: "0.72rem", color: STATUS_COLORS[o.status], fontFamily: "var(--font-display)" }}>{STATUS_LABELS[o.status]}</span>
                              <p style={{ fontSize: "0.78rem", color: "var(--muted)", marginTop: 3 }}>{o.items?.map((i: any) => `${i.name} x${i.quantity}`).join(", ")}</p>
                              <p style={{ fontSize: "0.75rem", color: "var(--muted)" }}>{o.sub_location}, {o.main_location}</p>
                            </div>
                            <div style={{ textAlign: "right" }}>
                              <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: "var(--orange)" }}>Rs.{o.total?.toLocaleString()}</p>
                              <p style={{ fontSize: "0.72rem", color: "var(--muted)" }}>{new Date(o.created_at).toLocaleDateString("en-IN")}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div>
                    <p style={{ fontSize: "0.8rem", color: "var(--muted)", marginBottom: 12 }}>{customers.length} unique customers</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {customers.map((c) => (
                        <div
                          key={c.phone}
                          onClick={() => { setSelectedCustomer(c); fetchCustomerOrders(c.phone); }}
                          style={{ background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: 12, padding: "14px 16px", cursor: "pointer" }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                            <div>
                              <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.9rem" }}>{c.name}</p>
                              <p style={{ fontSize: "0.78rem", color: "var(--muted)", marginTop: 2 }}>{c.phone} · {c.locations?.join(", ")}</p>
                              <p style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: 1 }}>Last order: {c.last_order ? new Date(c.last_order).toLocaleDateString("en-IN") : "—"}</p>
                            </div>
                            <div style={{ textAlign: "right" }}>
                              <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: "var(--orange)", fontSize: "1rem" }}>Rs.{c.total_spent?.toLocaleString()}</p>
                              <p style={{ fontSize: "0.75rem", color: "var(--muted)" }}>{c.order_count} orders</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── INVENTORY ── */}
            {!accountsLoading && accountsTab === "inventory" && (
              <div>
                <p style={{ fontSize: "0.8rem", color: "var(--muted)", marginBottom: 12 }}>Click stock count to edit. Low stock shown in red.</p>
                {inventoryItems.length === 0 ? (
                  <p style={{ color: "var(--muted)", fontSize: "0.85rem" }}>No products found. Add products in the Products tab first.</p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {inventoryItems.map((item) => (
                      <InventoryRow key={item._id} item={item} onSave={updateInventory} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── PURCHASES ── */}
            {!accountsLoading && accountsTab === "purchases" && (
              <div>
                {/* Add purchase form */}
                <div style={{ background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: 14, padding: 20, marginBottom: 24 }}>
                  <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 700, marginBottom: 14 }}>Log Purchase</h2>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    <div>
                      <label style={labelStyle}>Supplier</label>
                      <input placeholder="e.g. Elfbar Distributor" value={purchaseForm.supplier}
                        onChange={(e) => setPurchaseForm(p => ({ ...p, supplier: e.target.value }))} style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Product Name *</label>
                      <input placeholder="e.g. Elfbar Raya D3" value={purchaseForm.product_name}
                        onChange={(e) => setPurchaseForm(p => ({ ...p, product_name: e.target.value }))} style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Quantity *</label>
                      <input type="number" placeholder="10" value={purchaseForm.quantity}
                        onChange={(e) => setPurchaseForm(p => ({ ...p, quantity: e.target.value }))} style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Cost per Unit (Rs.) *</label>
                      <input type="number" placeholder="2000" value={purchaseForm.cost_per_unit}
                        onChange={(e) => setPurchaseForm(p => ({ ...p, cost_per_unit: e.target.value }))} style={inputStyle} />
                    </div>
                    <div style={{ gridColumn: "1 / -1" }}>
                      <label style={labelStyle}>Notes</label>
                      <input placeholder="Optional notes" value={purchaseForm.notes}
                        onChange={(e) => setPurchaseForm(p => ({ ...p, notes: e.target.value }))} style={inputStyle} />
                    </div>
                  </div>
                  {purchaseForm.quantity && purchaseForm.cost_per_unit && (
                    <p style={{ fontSize: "0.8rem", color: "#10b981", marginTop: 8 }}>
                      Total cost: Rs.{(Number(purchaseForm.quantity) * Number(purchaseForm.cost_per_unit)).toLocaleString()}
                    </p>
                  )}
                  {purchaseMsg && <p style={{ fontSize: "0.82rem", color: purchaseMsg === "Purchase logged!" ? "#10b981" : "#ef4444", marginTop: 8 }}>{purchaseMsg}</p>}
                  <button onClick={handleAddPurchase} disabled={purchaseSaving}
                    style={{ marginTop: 14, padding: "11px 24px", background: "var(--orange)", border: "none", borderRadius: 8, color: "#fff", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.9rem", cursor: purchaseSaving ? "not-allowed" : "pointer", opacity: purchaseSaving ? 0.7 : 1 }}>
                    {purchaseSaving ? "Saving..." : "Log Purchase →"}
                  </button>
                </div>

                {/* Purchase history */}
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 700, marginBottom: 12 }}>Purchase History</h2>
                {purchases.length === 0 ? (
                  <p style={{ color: "var(--muted)", fontSize: "0.85rem" }}>No purchases logged yet.</p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {purchases.map((p) => (
                      <div key={p._id} style={{ background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: 10, padding: "12px 16px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 6 }}>
                          <div>
                            <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.88rem" }}>{p.product_name}</p>
                            <p style={{ fontSize: "0.78rem", color: "var(--muted)", marginTop: 2 }}>{p.supplier} · Qty: {p.quantity} · Rs.{p.cost_per_unit}/unit</p>
                            {p.notes && <p style={{ fontSize: "0.75rem", color: "var(--muted)" }}>{p.notes}</p>}
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: "#10b981" }}>Rs.{p.total_cost?.toLocaleString()}</p>
                            <p style={{ fontSize: "0.72rem", color: "var(--muted)" }}>{p.date ? new Date(p.date).toLocaleDateString("en-IN") : "—"}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── SALES ── */}
            {!accountsLoading && accountsTab === "sales" && salesData && (
              <div>
                {/* Range selector */}
                <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
                  {[["7", "7 Days"], ["14", "14 Days"], ["30", "30 Days"]].map(([val, label]) => (
                    <button key={val} onClick={() => setSalesRange(val)}
                      style={{ padding: "6px 14px", borderRadius: 20, background: salesRange === val ? "var(--orange)" : "var(--bg-3)", border: salesRange === val ? "none" : "1px solid var(--border)", color: salesRange === val ? "#fff" : "var(--muted)", cursor: "pointer", fontSize: "0.8rem", fontFamily: "var(--font-display)", fontWeight: 600 }}>
                      {label}
                    </button>
                  ))}
                </div>

                {/* Stats */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 12, marginBottom: 24 }}>
                  {[
                    { label: "Revenue", value: `Rs.${salesData.stats?.total_revenue?.toLocaleString()}`, color: "#10b981" },
                    { label: "Orders", value: salesData.stats?.total_orders, color: "var(--orange)" },
                    { label: "Avg Order", value: `Rs.${salesData.stats?.avg_order?.toLocaleString()}`, color: "#3b82f6" },
                  ].map((s) => (
                    <div key={s.label} style={{ background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: 12, padding: "16px 12px", textAlign: "center" }}>
                      <div style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", fontWeight: 800, color: s.color }}>{s.value}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: 4 }}>{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* Daily breakdown */}
                <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.85rem", color: "var(--muted)", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.08em" }}>Daily Breakdown</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 24 }}>
                  {salesData.daily?.length === 0 && <p style={{ color: "var(--muted)", fontSize: "0.85rem" }}>No sales in this period.</p>}
                  {[...salesData.daily].reverse().map((d: any) => (
                    <div key={d.date} style={{ background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: 10, padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.85rem" }}>{new Date(d.date).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}</p>
                        <p style={{ fontSize: "0.75rem", color: "var(--muted)" }}>{d.orders} orders</p>
                      </div>
                      <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: "#10b981" }}>Rs.{d.revenue?.toLocaleString()}</p>
                    </div>
                  ))}
                </div>

                {/* Top products */}
                <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.85rem", color: "var(--muted)", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.08em" }}>Top Products</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {salesData.top_products?.map((p: any, i: number) => (
                    <div key={p.name} style={{ background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: 10, padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: "var(--orange)", fontSize: "0.9rem" }}>#{i + 1}</span>
                        <div>
                          <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.85rem" }}>{p.name}</p>
                          <p style={{ fontSize: "0.75rem", color: "var(--muted)" }}>{p.qty} units sold</p>
                        </div>
                      </div>
                      <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: "#10b981" }}>Rs.{p.revenue?.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Inventory Row (needs local state for editing) ────────────────────────────
function InventoryRow({ item, onSave }: { item: any; onSave: (id: string, stock: number, reorder: number) => void }) {
  const [stock, setStock] = useState(item.stock_count);
  const [reorder, setReorder] = useState(item.reorder_level);
  const [editing, setEditing] = useState(false);
  const isLow = stock <= reorder;

  return (
    <div style={{ background: "var(--bg-2)", border: `1px solid ${isLow ? "#ef4444" : "var(--border)"}`, borderRadius: 12, padding: "14px 16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
        <div>
          <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.9rem" }}>
            {item.name}
            {isLow && <span style={{ marginLeft: 8, fontSize: "0.7rem", color: "#ef4444", fontWeight: 700 }}>LOW STOCK</span>}
          </p>
          <p style={{ fontSize: "0.78rem", color: "var(--muted)", marginTop: 2 }}>{item.category} · Rs.{item.price?.toLocaleString()}</p>
        </div>
        {editing ? (
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <label style={{ ...labelStyle, marginBottom: 2 }}>Stock</label>
              <input type="number" value={stock} onChange={(e) => setStock(Number(e.target.value))}
                style={{ ...inputStyle, width: 70, padding: "6px 8px" }} />
            </div>
            <div>
              <label style={{ ...labelStyle, marginBottom: 2 }}>Reorder at</label>
              <input type="number" value={reorder} onChange={(e) => setReorder(Number(e.target.value))}
                style={{ ...inputStyle, width: 70, padding: "6px 8px" }} />
            </div>
            <button onClick={() => { onSave(item._id, stock, reorder); setEditing(false); }}
              style={{ padding: "6px 12px", background: "#10b98122", border: "1px solid #10b98144", color: "#10b981", borderRadius: 8, cursor: "pointer", fontSize: "0.78rem", fontFamily: "var(--font-display)", fontWeight: 700, marginTop: 18 }}>
              Save
            </button>
            <button onClick={() => setEditing(false)}
              style={{ padding: "6px 12px", background: "var(--bg-3)", border: "1px solid var(--border)", color: "var(--muted)", borderRadius: 8, cursor: "pointer", fontSize: "0.78rem", fontFamily: "var(--font-display)", marginTop: 18 }}>
              Cancel
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.1rem", color: isLow ? "#ef4444" : "#10b981" }}>{stock}</p>
              <p style={{ fontSize: "0.72rem", color: "var(--muted)" }}>reorder at {reorder}</p>
            </div>
            <button onClick={() => setEditing(true)}
              style={{ padding: "6px 12px", background: "var(--bg-3)", border: "1px solid var(--border)", color: "var(--muted)", borderRadius: 8, cursor: "pointer", fontSize: "0.78rem", fontFamily: "var(--font-display)" }}>
              Edit
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Shared input styles ──────────────────────────────────────────────────────
const inputStyle: React.CSSProperties = {
  width: "100%", padding: "10px 12px",
  background: "var(--bg-3)", border: "1px solid var(--border)",
  borderRadius: 8, color: "var(--white)", fontSize: "0.88rem",
  fontFamily: "var(--font-body)", outline: "none", boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  display: "block", fontSize: "0.75rem", color: "var(--muted)",
  marginBottom: 5, fontFamily: "var(--font-display)", fontWeight: 600,
};

const backBtnStyle: React.CSSProperties = {
  padding: "7px 14px", background: "var(--bg-3)",
  border: "1px solid var(--border)", borderRadius: 8,
  color: "var(--muted)", cursor: "pointer",
  fontSize: "0.82rem", fontFamily: "var(--font-display)", fontWeight: 600,
};
