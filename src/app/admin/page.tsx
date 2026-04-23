"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { products as hardcodedProducts } from "@/lib/products";

const ADMIN_PASSWORD = "vib@admin2024";
const PAGE_SIZE = 50;
const AUTO_REFRESH_MS = 30 * 1000;
const SESSION_KEY = "vib_admin_authed";
const CANCEL_WINDOW_MS = 2 * 60 * 60 * 1000;
const PRODUCT_TAGS = ["Fast Selling", "New Arrival", "Stock Out", "Limited Stock", "Best Value"];

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
  source?: string;
  cancelled_at?: string;
}

interface Dashboard {
  today_orders: number;
  today_revenue: number;
  pending: number;
  confirmed: number;
}

interface ProductOverride {
  _id?: string;
  product_name: string;
  tag: string;
  flavours: string[];
  in_stock: boolean;
  price?: number;
}

const STATUS_COLORS: Record<string, string> = {
  pending: "#f59e0b",
  confirmed: "#3b82f6",
  cancelled: "#ef4444",
};

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  cancelled: "Cancelled",
};

function buildWhatsAppMessage(order: Order): string {
  const items = order.items.map(i => `- ${i.name}${i.flavour ? ` (${i.flavour})` : ""} x${i.quantity}`).join("\n");
  return encodeURIComponent(`Hey ${order.customer_name}!\n\n*Order Received — ${order.order_id}*\n\nThanks for ordering from Vape Bangalore!\n\n${items}\n*Total: Rs.${order.total.toLocaleString()}*\n\n*Delivery to:* ${order.sub_location}, ${order.main_location}\n\nWe will shortly confirm your order. Could you share your *current location* (Google Maps pin)?\n\n*Note:* COD is temporarily disabled. Order will be dispatched via *Porter or Rapido*. Tracking ID will be shared once confirmed.`);
}

// ─── Product Override Row ─────────────────────────────────────────────────────
function ProductOverrideRow({ product, override, onSave }: {
  product: { name: string; flavours: string[]; price: string };
  override: ProductOverride | null;
  onSave: (data: ProductOverride) => void;
}) {
  const originalPrice = parseInt(product.price.replace(/[₹,]/g, ""));
  const [tag, setTag] = useState(override?.tag || "");
  const [inStock, setInStock] = useState(override?.in_stock !== false);
  const [flavours, setFlavours] = useState<string[]>(override?.flavours?.length ? override.flavours : product.flavours);
  const [price, setPrice] = useState(override?.price || originalPrice);
  const [flavourInput, setFlavourInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onSave({ product_name: product.name, tag, flavours, in_stock: inStock, price, _id: override?._id });
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: 12, padding: 14, marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "0.9rem" }}>{product.name}</p>
        <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.78rem", color: "var(--muted)", cursor: "pointer" }}>
          <input type="checkbox" checked={inStock} onChange={e => setInStock(e.target.checked)} />
          In Stock
        </label>
      </div>

      {/* Price */}
      <div style={{ marginBottom: 10 }}>
        <p style={{ fontSize: "0.72rem", color: "var(--muted)", fontFamily: "var(--font-display)", fontWeight: 600, marginBottom: 4, textTransform: "uppercase" }}>Price (Rs.)</p>
        <input type="number" value={price} onChange={e => setPrice(Number(e.target.value))}
          style={{ width: "100%", padding: "8px 10px", background: "var(--bg-3)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--white)", fontSize: "0.88rem", fontFamily: "var(--font-body)", outline: "none", boxSizing: "border-box" as const }} />
      </div>

      {/* Tag */}
      <p style={{ fontSize: "0.72rem", color: "var(--muted)", fontFamily: "var(--font-display)", fontWeight: 600, marginBottom: 6, textTransform: "uppercase" }}>Tag</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 10 }}>
        <button onClick={() => setTag("")} style={tagBtn(tag === "")}>None</button>
        {PRODUCT_TAGS.map(t => <button key={t} onClick={() => setTag(t)} style={tagBtn(tag === t)}>{t}</button>)}
      </div>

      {/* Flavours */}
      <p style={{ fontSize: "0.72rem", color: "var(--muted)", fontFamily: "var(--font-display)", fontWeight: 600, marginBottom: 6, textTransform: "uppercase" }}>Flavours</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 8 }}>
        {flavours.map(f => (
          <span key={f} onClick={() => setFlavours(p => p.filter(x => x !== f))}
            style={{ background: "var(--bg-3)", border: "1px solid var(--border)", borderRadius: 20, padding: "3px 10px", fontSize: "0.7rem", color: "var(--muted)", cursor: "pointer" }}>
            {f} ✕
          </span>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
        <input placeholder="Add flavour" value={flavourInput} onChange={e => setFlavourInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && (() => { if (flavourInput.trim()) { setFlavours(p => [...p, flavourInput.trim()]); setFlavourInput(""); } })()}
          style={{ flex: 1, padding: "8px 10px", background: "var(--bg-3)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--white)", fontSize: "0.82rem", outline: "none" }} />
        <button onClick={() => { if (flavourInput.trim()) { setFlavours(p => [...p, flavourInput.trim()]); setFlavourInput(""); } }}
          style={{ padding: "8px 12px", background: "var(--bg-3)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--white)", cursor: "pointer", fontSize: "0.8rem", fontFamily: "var(--font-display)" }}>
          Add
        </button>
      </div>

      <button onClick={handleSave} disabled={saving}
        style={{ width: "100%", padding: "10px", background: saved ? "#10b981" : "var(--orange)", border: "none", borderRadius: 8, color: "#fff", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.88rem", cursor: "pointer" }}>
        {saved ? "Saved!" : saving ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
}

function tagBtn(active: boolean): React.CSSProperties {
  return { padding: "3px 10px", borderRadius: 20, border: active ? "1.5px solid var(--orange)" : "1px solid var(--border)", background: active ? "var(--orange-glow)" : "var(--bg-3)", color: active ? "var(--orange)" : "var(--muted)", fontSize: "0.7rem", cursor: "pointer", fontFamily: "var(--font-display)", fontWeight: 600 };
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);
  const [orderCache, setOrderCache] = useState<Record<string, Order[]>>({});
  const [activeTab, setActiveTab] = useState<"orders" | "products" | "customers" | "accounts">("orders");
  const [nextRefresh, setNextRefresh] = useState(AUTO_REFRESH_MS / 1000);
  const autoRefreshRef = useRef<NodeJS.Timeout | null>(null);

  // Products
  const [productOverrides, setProductOverrides] = useState<ProductOverride[]>([]);

  // Customers
  const [customers, setCustomers] = useState<any[]>([]);
  const [customerSearch, setCustomerSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);
  const [customerOrders, setCustomerOrders] = useState<any[]>([]);
  const [customersLoading, setCustomersLoading] = useState(false);

  // Accounts
  const [accountsTab, setAccountsTab] = useState<"sales" | "purchases" | "inventory">("sales");
  const [salesData, setSalesData] = useState<any>(null);
  const [salesRange, setSalesRange] = useState("7");
  const [purchases, setPurchases] = useState<any[]>([]);
  const [inventoryItems, setInventoryItems] = useState<any[]>([]);
  const [accountsLoading, setAccountsLoading] = useState(false);
  const [purchaseForm, setPurchaseForm] = useState({ supplier: "", product_name: "", quantity: "", cost_per_unit: "", notes: "" });
  const [purchaseSaving, setPurchaseSaving] = useState(false);
  const [purchaseMsg, setPurchaseMsg] = useState("");

  // ── Session persistence ───────────────────────────────────────────────────
  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem(SESSION_KEY) === "true") setAuthed(true);
  }, []);

  const login = () => {
    if (password === ADMIN_PASSWORD) { setAuthed(true); sessionStorage.setItem(SESSION_KEY, "true"); }
  };

  // ── Auto-refresh 30s ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!authed) return;
    autoRefreshRef.current = setInterval(refreshOrdersOnly, AUTO_REFRESH_MS);
    return () => { if (autoRefreshRef.current) clearInterval(autoRefreshRef.current); };
  }, [authed, filter]);

  useEffect(() => {
    if (!authed) return;
    setNextRefresh(AUTO_REFRESH_MS / 1000);
    const t = setInterval(() => setNextRefresh(p => p <= 1 ? AUTO_REFRESH_MS / 1000 : p - 1), 1000);
    return () => clearInterval(t);
  }, [authed, filter]);

  const refreshOrdersOnly = useCallback(async () => {
    const [oRes, dRes] = await Promise.all([
      fetch(`/api/orders?${filter !== "all" ? `status=${filter}&` : ""}limit=${PAGE_SIZE}&skip=0`),
      fetch("/api/dashboard"),
    ]);
    const od = await oRes.json(); const dd = await dRes.json();
    const fetched = od.orders || [];
    setOrders(fetched);
    setOrderCache(p => ({ ...p, [filter]: fetched }));
    setHasMore(fetched.length === PAGE_SIZE);
    setDashboard(dd);
  }, [filter]);

  const fetchData = useCallback(async (resetPage = true) => {
    if (orderCache[filter]) setOrders(orderCache[filter]);
    setLoading(true);
    const cp = resetPage ? 1 : page;
    if (resetPage) setPage(1);
    const [oRes, dRes] = await Promise.all([
      fetch(`/api/orders?${filter !== "all" ? `status=${filter}&` : ""}limit=${PAGE_SIZE}&skip=${(cp - 1) * PAGE_SIZE}`),
      fetch("/api/dashboard"),
    ]);
    const od = await oRes.json(); const dd = await dRes.json();
    const fetched = od.orders || [];
    const merged = resetPage ? fetched : [...(orderCache[filter] || []), ...fetched];
    setOrders(merged);
    setOrderCache(p => ({ ...p, [filter]: merged }));
    setHasMore(fetched.length === PAGE_SIZE);
    setDashboard(dd);
    setLoading(false);
  }, [filter, page, orderCache]);

  const fetchProductOverrides = async () => {
    const r = await fetch("/api/product-overrides");
    const d = await r.json();
    setProductOverrides(d.overrides || []);
  };

  const fetchCustomers = async () => {
    setCustomersLoading(true);
    const r = await fetch("/api/accounts?section=customers");
    const d = await r.json();
    setCustomers(d.customers || []);
    setCustomersLoading(false);
  };

  const fetchCustomerOrders = async (phone: string) => {
    const r = await fetch(`/api/accounts?section=customer_orders&phone=${phone}`);
    const d = await r.json();
    setCustomerOrders(d.orders || []);
  };

  const fetchAccounts = async (tab = accountsTab) => {
    setAccountsLoading(true);
    if (tab === "sales") {
      const r = await fetch(`/api/accounts?section=sales&range=${salesRange}`);
      const d = await r.json(); setSalesData(d);
    } else if (tab === "purchases") {
      const r = await fetch("/api/accounts?section=purchases");
      const d = await r.json(); setPurchases(d.purchases || []);
    } else if (tab === "inventory") {
      const r = await fetch("/api/accounts?section=inventory");
      const d = await r.json(); setInventoryItems(d.items || []);
    }
    setAccountsLoading(false);
  };

  const handleAddPurchase = async () => {
    if (!purchaseForm.product_name || !purchaseForm.quantity || !purchaseForm.cost_per_unit) {
      setPurchaseMsg("Fill all required fields."); return;
    }
    setPurchaseSaving(true);
    const res = await fetch("/api/accounts?section=purchases", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(purchaseForm) });
    if (res.ok) { setPurchaseMsg("Logged!"); setPurchaseForm({ supplier: "", product_name: "", quantity: "", cost_per_unit: "", notes: "" }); fetchAccounts("purchases"); }
    else setPurchaseMsg("Failed.");
    setPurchaseSaving(false);
    setTimeout(() => setPurchaseMsg(""), 2500);
  };

  useEffect(() => {
    if (authed) { fetchData(true); fetchProductOverrides(); }
  }, [authed, filter]);

  useEffect(() => {
    if (authed && activeTab === "customers" && customers.length === 0) fetchCustomers();
  }, [authed, activeTab]);

  useEffect(() => {
    if (authed && activeTab === "accounts") fetchAccounts(accountsTab);
  }, [authed, activeTab, accountsTab, salesRange]);

  const updateStatus = async (orderId: string, status: string) => {
    await fetch(`/api/orders/${orderId}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, ...(status === "cancelled" ? { cancelled_at: new Date().toISOString() } : {}) }),
    });
    refreshOrdersOnly();
    setSelectedOrder(null);
  };

  const saveProductOverride = async (data: ProductOverride) => {
    await fetch("/api/product-overrides", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    fetchProductOverrides();
  };

  const loadMore = async () => {
    const np = page + 1; setPage(np); setLoading(true);
    const r = await fetch(`/api/orders?${filter !== "all" ? `status=${filter}&` : ""}limit=${PAGE_SIZE}&skip=${(np - 1) * PAGE_SIZE}`);
    const d = await r.json();
    setOrders(p => [...p, ...(d.orders || [])]);
    setHasMore((d.orders || []).length === PAGE_SIZE);
    setLoading(false);
  };

  const filteredCustomers = customers.filter(c =>
    c.phone?.includes(customerSearch) || c.name?.toLowerCase().includes(customerSearch.toLowerCase())
  );

  // ── LOGIN ─────────────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)", padding: 20 }}>
        <div style={{ background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: 16, padding: 32, width: "100%", maxWidth: 360 }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", fontWeight: 800, marginBottom: 6 }}>VIB Admin</h1>
          <p style={{ color: "var(--muted)", fontSize: "0.82rem", marginBottom: 20 }}>Enter password to continue</p>
          <input type="password" placeholder="Password" value={password}
            onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && login()}
            style={iStyle} autoFocus />
          {password && password !== ADMIN_PASSWORD && <p style={{ color: "#ef4444", fontSize: "0.78rem", margin: "6px 0" }}>Wrong password</p>}
          <button onClick={login} style={{ width: "100%", padding: "12px", background: "var(--orange)", border: "none", borderRadius: 8, color: "#fff", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.95rem", cursor: "pointer", marginTop: 8 }}>Login →</button>
        </div>
      </div>
    );
  }

  // ── MAIN ──────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", paddingBottom: 80 }}>
      {/* Sticky header */}
      <div style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(10,10,10,0.95)", backdropFilter: "blur(10px)", borderBottom: "1px solid var(--border)", padding: "12px 16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: 700, margin: "0 auto" }}>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1rem" }}>VIB Admin</span>
          <button onClick={() => { refreshOrdersOnly(); setNextRefresh(AUTO_REFRESH_MS / 1000); }}
            style={{ background: "var(--bg-3)", border: "1px solid var(--border)", color: "var(--muted)", borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontFamily: "var(--font-display)", fontSize: "0.75rem" }}>
            {Math.floor(nextRefresh / 60)}:{String(nextRefresh % 60).padStart(2, "0")}
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 700, margin: "0 auto", padding: "16px 16px 0" }}>

        {/* Stats strip */}
        {dashboard && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 16 }}>
            {[
              { label: "Today", value: dashboard.today_orders, color: "var(--orange)" },
              { label: "Revenue", value: `₹${(dashboard.today_revenue / 1000).toFixed(1)}k`, color: "#10b981" },
              { label: "Pending", value: dashboard.pending, color: "#f59e0b" },
              { label: "Confirmed", value: dashboard.confirmed, color: "#3b82f6" },
            ].map(s => (
              <div key={s.label} style={{ background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: 10, padding: "10px 8px", textAlign: "center" }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: "0.65rem", color: "var(--muted)", marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Tab bar */}
        <div style={{ display: "flex", gap: 6, marginBottom: 16, overflowX: "auto" }}>
          {(["orders", "products", "customers", "accounts"] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              style={{ flex: "0 0 auto", padding: "8px 14px", borderRadius: 10, background: activeTab === tab ? "var(--orange)" : "var(--bg-3)", border: activeTab === tab ? "none" : "1px solid var(--border)", color: activeTab === tab ? "var(--btn-text)" : "var(--muted)", cursor: "pointer", fontSize: "0.78rem", fontFamily: "var(--font-display)", fontWeight: 700, textTransform: "capitalize", whiteSpace: "nowrap" }}>
              {tab === "orders" ? "📦 Orders" : tab === "products" ? "🛍 Products" : tab === "customers" ? "👥 Customers" : "📊 Accounts"}
            </button>
          ))}
        </div>

        {/* ── ORDERS ── */}
        {activeTab === "orders" && (
          <>
            <div style={{ display: "flex", gap: 6, marginBottom: 12, overflowX: "auto", paddingBottom: 2 }}>
              {["all", "pending", "confirmed", "cancelled"].map(s => (
                <button key={s} onClick={() => setFilter(s)}
                  style={{ padding: "5px 12px", borderRadius: 20, background: filter === s ? "var(--orange)" : "var(--bg-3)", border: filter === s ? "none" : "1px solid var(--border)", color: filter === s ? "#fff" : "var(--muted)", cursor: "pointer", fontSize: "0.75rem", fontFamily: "var(--font-display)", fontWeight: 600, whiteSpace: "nowrap", flexShrink: 0 }}>
                  {STATUS_LABELS[s] || "All"}
                </button>
              ))}
            </div>

            {loading && orders.length === 0 ? (
              <p style={{ color: "var(--muted)", textAlign: "center", padding: 32, fontSize: "0.85rem" }}>Loading...</p>
            ) : orders.length === 0 ? (
              <p style={{ color: "var(--muted)", textAlign: "center", padding: 32, fontSize: "0.85rem" }}>No orders</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {orders.map(order => {
                  const isSelected = selectedOrder?._id === order._id;
                  const isCancelled = order.status === "cancelled";
                  const cancelledAt = order.cancelled_at ? new Date(order.cancelled_at).getTime() : null;
                  const canUndo = isCancelled && cancelledAt && (Date.now() - cancelledAt < CANCEL_WINDOW_MS);
                  const undoMin = canUndo && cancelledAt ? Math.ceil((CANCEL_WINDOW_MS - (Date.now() - cancelledAt)) / 60000) : 0;

                  return (
                    <div key={order._id} onClick={() => setSelectedOrder(isSelected ? null : order)}
                      style={{ background: "var(--bg-2)", border: `1px solid ${isSelected ? "var(--orange)" : "var(--border)"}`, borderRadius: 12, padding: "12px 14px", cursor: "pointer" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3, flexWrap: "wrap" }}>
                            <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.88rem" }}>{order.customer_name}</span>
                            <span style={{ background: (STATUS_COLORS[order.status] || "#888") + "22", color: STATUS_COLORS[order.status] || "#888", borderRadius: 20, padding: "1px 7px", fontSize: "0.68rem", fontWeight: 600, fontFamily: "var(--font-display)" }}>
                              {STATUS_LABELS[order.status] || order.status}
                            </span>
                            {order.source === "whatsapp" && <span style={{ fontSize: "0.65rem", color: "#25d366", background: "#25d36622", borderRadius: 20, padding: "1px 6px", fontFamily: "var(--font-display)", fontWeight: 600 }}>WA</span>}
                          </div>
                          <p style={{ fontSize: "0.75rem", color: "var(--muted)", marginBottom: 1 }}>{order.customer_phone} · {order.sub_location}</p>
                          <p style={{ fontSize: "0.72rem", color: "var(--muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {order.items.map(i => `${i.name}${i.flavour ? ` (${i.flavour})` : ""} x${i.quantity}`).join(", ")}
                          </p>
                        </div>
                        <div style={{ textAlign: "right", flexShrink: 0 }}>
                          <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "0.95rem", color: "var(--orange)" }}>₹{order.total.toLocaleString()}</div>
                          <div style={{ fontSize: "0.65rem", color: "var(--muted)" }}>{new Date(order.created_at).toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" })}</div>
                          <div style={{ fontSize: "0.65rem", color: "var(--muted)" }}>{order.order_id}</div>
                        </div>
                      </div>

                      {isSelected && (
                        <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid var(--border)" }} onClick={e => e.stopPropagation()}>
                          <a href={`https://wa.me/91${order.customer_phone.replace(/\D/g, "")}?text=${buildWhatsAppMessage(order)}`}
                            target="_blank" rel="noopener noreferrer"
                            style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: 8, marginBottom: 8, background: "#25d36622", border: "1px solid #25d36644", color: "#25d366", fontSize: "0.78rem", fontFamily: "var(--font-display)", fontWeight: 700, textDecoration: "none" }}>
                            WhatsApp
                          </a>
                          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                            {order.status !== "confirmed" && (
                              <button onClick={() => updateStatus(order.order_id, "confirmed")}
                                style={{ padding: "7px 14px", borderRadius: 8, background: "#3b82f622", border: "1px solid #3b82f644", color: "#3b82f6", cursor: "pointer", fontSize: "0.78rem", fontFamily: "var(--font-display)", fontWeight: 700 }}>
                                Confirm
                              </button>
                            )}
                            {order.status !== "cancelled" && (
                              <button onClick={() => updateStatus(order.order_id, "cancelled")}
                                style={{ padding: "7px 14px", borderRadius: 8, background: "#ef444422", border: "1px solid #ef444444", color: "#ef4444", cursor: "pointer", fontSize: "0.78rem", fontFamily: "var(--font-display)", fontWeight: 700 }}>
                                Cancel
                              </button>
                            )}
                            {canUndo && (
                              <button onClick={() => updateStatus(order.order_id, "pending")}
                                style={{ padding: "7px 14px", borderRadius: 8, background: "#f59e0b22", border: "1px solid #f59e0b44", color: "#f59e0b", cursor: "pointer", fontSize: "0.78rem", fontFamily: "var(--font-display)", fontWeight: 700 }}>
                                Undo ({undoMin}m)
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
                {hasMore && (
                  <button onClick={loadMore} disabled={loading}
                    style={{ width: "100%", padding: "10px", background: "var(--bg-3)", border: "1px solid var(--border)", color: "var(--muted)", borderRadius: 10, cursor: "pointer", fontFamily: "var(--font-display)", fontSize: "0.82rem" }}>
                    {loading ? "Loading..." : "Load More"}
                  </button>
                )}
              </div>
            )}
          </>
        )}

        {/* ── PRODUCTS ── */}
        {activeTab === "products" && (
          <div>
            <p style={{ fontSize: "0.78rem", color: "var(--muted)", marginBottom: 12 }}>Changes reflect on frontend immediately after saving.</p>
            {hardcodedProducts.map(product => (
              <ProductOverrideRow key={product.name}
                product={{ name: product.name, flavours: product.flavours, price: product.price }}
                override={productOverrides.find(o => o.product_name === product.name) || null}
                onSave={saveProductOverride}
              />
            ))}
          </div>
        )}

        {/* ── CUSTOMERS ── */}
        {activeTab === "customers" && (
          <div>
            {selectedCustomer ? (
              <div>
                <button onClick={() => { setSelectedCustomer(null); setCustomerOrders([]); }}
                  style={{ padding: "6px 14px", background: "var(--bg-3)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--muted)", cursor: "pointer", fontSize: "0.78rem", fontFamily: "var(--font-display)", marginBottom: 12 }}>
                  ← Back
                </button>
                <div style={{ background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: 12, padding: 14, marginBottom: 12 }}>
                  <p style={{ fontFamily: "var(--font-display)", fontWeight: 800 }}>{selectedCustomer.name}</p>
                  <p style={{ fontSize: "0.78rem", color: "var(--muted)", marginTop: 3 }}>{selectedCustomer.phone} · {selectedCustomer.order_count} orders · ₹{selectedCustomer.total_spent?.toLocaleString()} spent</p>
                  <a href={`https://wa.me/91${selectedCustomer.phone?.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer"
                    style={{ display: "inline-block", marginTop: 8, padding: "6px 12px", background: "#25d36622", border: "1px solid #25d36644", color: "#25d366", borderRadius: 8, fontSize: "0.75rem", fontFamily: "var(--font-display)", fontWeight: 700, textDecoration: "none" }}>
                    WhatsApp Customer
                  </a>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {customerOrders.map((o: any) => (
                    <div key={o._id} style={{ background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: 10, padding: "10px 12px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <div>
                          <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.82rem" }}>{o.order_id}</p>
                          <p style={{ fontSize: "0.72rem", color: "var(--muted)" }}>{o.items?.map((i: any) => `${i.name} x${i.quantity}`).join(", ")}</p>
                          <p style={{ fontSize: "0.7rem", color: STATUS_COLORS[o.status] || "var(--muted)" }}>{STATUS_LABELS[o.status] || o.status}</p>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: "var(--orange)", fontSize: "0.9rem" }}>₹{o.total?.toLocaleString()}</p>
                          <p style={{ fontSize: "0.65rem", color: "var(--muted)" }}>{new Date(o.created_at).toLocaleDateString("en-IN")}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                {/* Search */}
                <input
                  placeholder="Search by phone number or name..."
                  value={customerSearch}
                  onChange={e => setCustomerSearch(e.target.value)}
                  style={{ width: "100%", padding: "10px 14px", background: "var(--bg-3)", border: "1px solid var(--border)", borderRadius: 10, color: "var(--white)", fontSize: "0.88rem", fontFamily: "var(--font-body)", outline: "none", marginBottom: 12, boxSizing: "border-box" as const }}
                />
                {customersLoading ? (
                  <p style={{ color: "var(--muted)", textAlign: "center", padding: 24, fontSize: "0.85rem" }}>Loading...</p>
                ) : (
                  <>
                    <p style={{ fontSize: "0.75rem", color: "var(--muted)", marginBottom: 8 }}>{filteredCustomers.length} customers{customerSearch ? " found" : ""}</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {filteredCustomers.map(c => (
                        <div key={c.phone} onClick={() => { setSelectedCustomer(c); fetchCustomerOrders(c.phone); }}
                          style={{ background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: 10, padding: "12px 14px", cursor: "pointer" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div>
                              <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.88rem" }}>{c.name}</p>
                              <p style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: 2 }}>{c.phone}</p>
                            </div>
                            <div style={{ textAlign: "right" }}>
                              <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: "var(--orange)", fontSize: "0.9rem" }}>₹{c.total_spent?.toLocaleString()}</p>
                              <p style={{ fontSize: "0.7rem", color: "var(--muted)" }}>{c.order_count} orders</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── ACCOUNTS ── */}
        {activeTab === "accounts" && (
          <div>
            <div style={{ display: "flex", gap: 6, marginBottom: 16, overflowX: "auto" }}>
              {(["sales", "purchases", "inventory"] as const).map(t => (
                <button key={t} onClick={() => { setAccountsTab(t); fetchAccounts(t); }}
                  style={{ padding: "7px 14px", borderRadius: 20, background: accountsTab === t ? "var(--orange)" : "var(--bg-3)", border: accountsTab === t ? "none" : "1px solid var(--border)", color: accountsTab === t ? "var(--btn-text)" : "var(--muted)", cursor: "pointer", fontSize: "0.75rem", fontFamily: "var(--font-display)", fontWeight: 700, textTransform: "capitalize", whiteSpace: "nowrap", flexShrink: 0 }}>
                  {t}
                </button>
              ))}
            </div>

            {accountsLoading && <p style={{ color: "var(--muted)", textAlign: "center", padding: 24 }}>Loading...</p>}

            {/* Sales */}
            {!accountsLoading && accountsTab === "sales" && (
              <div>
                <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
                  {[["7","7d"],["14","14d"],["30","30d"]].map(([v,l]) => (
                    <button key={v} onClick={() => { setSalesRange(v); fetchAccounts("sales"); }}
                      style={{ padding: "5px 12px", borderRadius: 20, background: salesRange === v ? "var(--orange)" : "var(--bg-3)", border: salesRange === v ? "none" : "1px solid var(--border)", color: salesRange === v ? "var(--btn-text)" : "var(--muted)", cursor: "pointer", fontSize: "0.75rem", fontFamily: "var(--font-display)", fontWeight: 600 }}>
                      {l}
                    </button>
                  ))}
                </div>
                {salesData && (
                  <>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 16 }}>
                      {[
                        { label: "Revenue", value: `₹${salesData.stats?.total_revenue?.toLocaleString()}`, color: "#10b981" },
                        { label: "Orders", value: salesData.stats?.total_orders, color: "var(--orange)" },
                        { label: "Avg", value: `₹${salesData.stats?.avg_order?.toLocaleString()}`, color: "#3b82f6" },
                      ].map(s => (
                        <div key={s.label} style={{ background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: 10, padding: "10px 8px", textAlign: "center" }}>
                          <div style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 800, color: s.color }}>{s.value}</div>
                          <div style={{ fontSize: "0.65rem", color: "var(--muted)", marginTop: 2 }}>{s.label}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {[...( salesData.daily || [])].reverse().map((d: any) => (
                        <div key={d.date} style={{ background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: 10, padding: "10px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div>
                            <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.82rem" }}>{new Date(d.date).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}</p>
                            <p style={{ fontSize: "0.7rem", color: "var(--muted)" }}>{d.orders} orders</p>
                          </div>
                          <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: "#10b981", fontSize: "0.9rem" }}>₹{d.revenue?.toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                  </>
                )}
                {!salesData && !accountsLoading && (
                  <button onClick={() => fetchAccounts("sales")} style={{ padding: "10px 20px", background: "var(--orange)", border: "none", borderRadius: 8, color: "var(--btn-text)", fontFamily: "var(--font-display)", fontWeight: 700, cursor: "pointer" }}>Load Sales</button>
                )}
              </div>
            )}

            {/* Purchases */}
            {!accountsLoading && accountsTab === "purchases" && (
              <div>
                <div style={{ background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: 12, padding: 14, marginBottom: 16 }}>
                  <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.88rem", marginBottom: 10 }}>Log Purchase</p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
                    {[["Supplier","supplier","Supplier"],["Product *","product_name","Product name"],["Qty *","quantity","10"],["Cost/Unit *","cost_per_unit","2000"]].map(([label,key,ph]) => (
                      <div key={key}>
                        <p style={{ fontSize: "0.68rem", color: "var(--muted)", marginBottom: 3, fontFamily: "var(--font-display)", fontWeight: 600 }}>{label}</p>
                        <input placeholder={ph} value={(purchaseForm as any)[key]}
                          onChange={e => setPurchaseForm(p => ({ ...p, [key]: e.target.value }))}
                          type={key === "quantity" || key === "cost_per_unit" ? "number" : "text"}
                          style={{ width: "100%", padding: "8px 10px", background: "var(--bg-3)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--white)", fontSize: "0.82rem", outline: "none", boxSizing: "border-box" as const }} />
                      </div>
                    ))}
                  </div>
                  {purchaseForm.quantity && purchaseForm.cost_per_unit && (
                    <p style={{ fontSize: "0.75rem", color: "#10b981", marginBottom: 8 }}>Total: ₹{(Number(purchaseForm.quantity) * Number(purchaseForm.cost_per_unit)).toLocaleString()}</p>
                  )}
                  {purchaseMsg && <p style={{ fontSize: "0.75rem", color: purchaseMsg === "Logged!" ? "#10b981" : "#ef4444", marginBottom: 6 }}>{purchaseMsg}</p>}
                  <button onClick={handleAddPurchase} disabled={purchaseSaving}
                    style={{ padding: "9px 20px", background: "var(--orange)", border: "none", borderRadius: 8, color: "var(--btn-text)", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.82rem", cursor: "pointer" }}>
                    {purchaseSaving ? "Saving..." : "Log →"}
                  </button>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {purchases.map((p: any) => (
                    <div key={p._id} style={{ background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: 10, padding: "10px 12px", display: "flex", justifyContent: "space-between" }}>
                      <div>
                        <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.82rem" }}>{p.product_name}</p>
                        <p style={{ fontSize: "0.7rem", color: "var(--muted)" }}>{p.supplier} · {p.quantity} units · ₹{p.cost_per_unit}/unit</p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: "#10b981", fontSize: "0.88rem" }}>₹{p.total_cost?.toLocaleString()}</p>
                        <p style={{ fontSize: "0.65rem", color: "var(--muted)" }}>{p.date ? new Date(p.date).toLocaleDateString("en-IN") : "—"}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Inventory */}
            {!accountsLoading && accountsTab === "inventory" && (
              <div>
                <p style={{ fontSize: "0.75rem", color: "var(--muted)", marginBottom: 10 }}>
                  Stock counts update automatically when orders are confirmed.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {hardcodedProducts.map((product: any) => {
                    const inv = inventoryItems.find((i: any) => i.name === product.name || i.product_name === product.name);
                    const stock = inv?.stock_count ?? 0;
                    const reorder = inv?.reorder_level ?? 5;
                    const isLow = stock <= reorder;
                    return (
                      <div key={product.name} style={{ background: "var(--bg-2)", border: `1px solid ${isLow && stock > 0 ? "#f59e0b" : stock === 0 ? "#ef4444" : "var(--border)"}`, borderRadius: 10, padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.85rem" }}>
                            {product.name}
                            {stock === 0 && <span style={{ marginLeft: 6, fontSize: "0.65rem", color: "#ef4444", fontWeight: 700 }}>OUT</span>}
                            {stock > 0 && isLow && <span style={{ marginLeft: 6, fontSize: "0.65rem", color: "#f59e0b", fontWeight: 700 }}>LOW</span>}
                          </p>
                          <p style={{ fontSize: "0.7rem", color: "var(--muted)" }}>{product.price} · reorder at {reorder}</p>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.1rem", color: stock === 0 ? "#ef4444" : isLow ? "#f59e0b" : "#10b981" }}>{stock}</p>
                          <p style={{ fontSize: "0.65rem", color: "var(--muted)" }}>units</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const iStyle: React.CSSProperties = {
  width: "100%", padding: "11px 14px", marginBottom: 4,
  background: "var(--bg-3)", border: "1px solid var(--border)",
  borderRadius: 8, color: "var(--white)", fontSize: "0.95rem",
  fontFamily: "var(--font-body)", outline: "none", boxSizing: "border-box",
};
