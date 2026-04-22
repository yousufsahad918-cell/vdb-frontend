"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { products as hardcodedProducts } from "@/lib/products";

const ADMIN_PASSWORD = "vib@admin2024";
const PAGE_SIZE = 50;
const AUTO_REFRESH_MS = 30 * 1000; // 30 seconds
const SESSION_KEY = "vib_admin_authed";
const CANCEL_WINDOW_MS = 2 * 60 * 60 * 1000; // 2 hours

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
  total_orders: number;
  pending: number;
  confirmed: number;
  out_for_delivery: number;
  delivered: number;
  today_orders: number;
  today_revenue: number;
}

interface ProductOverride {
  _id?: string;
  product_name: string;
  tag: string;
  flavours: string[];
  in_stock: boolean;
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

// ─── Inventory Row ────────────────────────────────────────────────────────────
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
            {item.name}{isLow && <span style={{ marginLeft: 8, fontSize: "0.7rem", color: "#ef4444", fontWeight: 700 }}>LOW STOCK</span>}
          </p>
          <p style={{ fontSize: "0.78rem", color: "var(--muted)", marginTop: 2 }}>{item.category} · Rs.{item.price?.toLocaleString()}</p>
        </div>
        {editing ? (
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <div><label style={{ ...labelStyle, marginBottom: 2 }}>Stock</label><input type="number" value={stock} onChange={e => setStock(Number(e.target.value))} style={{ ...inputStyle, width: 70, padding: "6px 8px" }} /></div>
            <div><label style={{ ...labelStyle, marginBottom: 2 }}>Reorder at</label><input type="number" value={reorder} onChange={e => setReorder(Number(e.target.value))} style={{ ...inputStyle, width: 70, padding: "6px 8px" }} /></div>
            <button onClick={() => { onSave(item._id, stock, reorder); setEditing(false); }} style={{ padding: "6px 12px", background: "#10b98122", border: "1px solid #10b98144", color: "#10b981", borderRadius: 8, cursor: "pointer", fontSize: "0.78rem", fontFamily: "var(--font-display)", fontWeight: 700, marginTop: 18 }}>Save</button>
            <button onClick={() => setEditing(false)} style={{ padding: "6px 12px", background: "var(--bg-3)", border: "1px solid var(--border)", color: "var(--muted)", borderRadius: 8, cursor: "pointer", fontSize: "0.78rem", fontFamily: "var(--font-display)", marginTop: 18 }}>Cancel</button>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.1rem", color: isLow ? "#ef4444" : "#10b981" }}>{stock}</p>
              <p style={{ fontSize: "0.72rem", color: "var(--muted)" }}>reorder at {reorder}</p>
            </div>
            <button onClick={() => setEditing(true)} style={{ padding: "6px 12px", background: "var(--bg-3)", border: "1px solid var(--border)", color: "var(--muted)", borderRadius: 8, cursor: "pointer", fontSize: "0.78rem", fontFamily: "var(--font-display)" }}>Edit</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Product Override Row ─────────────────────────────────────────────────────
function ProductOverrideRow({ product, override, onSave }: {
  product: { name: string; flavours: string[]; price: string };
  override: ProductOverride | null;
  onSave: (data: ProductOverride) => void;
}) {
  const [tag, setTag] = useState(override?.tag || "");
  const [inStock, setInStock] = useState(override?.in_stock !== false);
  const [flavours, setFlavours] = useState<string[]>(override?.flavours || product.flavours);
  const [flavourInput, setFlavourInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onSave({ product_name: product.name, tag, flavours, in_stock: inStock, _id: override?._id });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const addFlavour = () => {
    const f = flavourInput.trim();
    if (f && !flavours.includes(f)) setFlavours(prev => [...prev, f]);
    setFlavourInput("");
  };

  return (
    <div style={{ background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: 14, padding: "16px", marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
        <div>
          <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "0.95rem" }}>{product.name}</p>
          <p style={{ fontSize: "0.78rem", color: "var(--muted)" }}>{product.price}</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.8rem", color: "var(--muted)", cursor: "pointer" }}>
            <input type="checkbox" checked={inStock} onChange={e => setInStock(e.target.checked)} style={{ width: 14, height: 14 }} />
            In Stock
          </label>
        </div>
      </div>

      {/* Tag selector */}
      <p style={{ ...labelStyle, marginBottom: 6 }}>Tag</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
        <button onClick={() => setTag("")} style={{ padding: "4px 10px", borderRadius: 20, border: tag === "" ? "1.5px solid var(--orange)" : "1px solid var(--border)", background: tag === "" ? "var(--orange-glow)" : "var(--bg-3)", color: tag === "" ? "var(--orange)" : "var(--muted)", fontSize: "0.72rem", cursor: "pointer", fontFamily: "var(--font-display)", fontWeight: 600 }}>None</button>
        {PRODUCT_TAGS.map(t => (
          <button key={t} onClick={() => setTag(t)} style={{ padding: "4px 10px", borderRadius: 20, border: tag === t ? "1.5px solid var(--orange)" : "1px solid var(--border)", background: tag === t ? "var(--orange-glow)" : "var(--bg-3)", color: tag === t ? "var(--orange)" : "var(--muted)", fontSize: "0.72rem", cursor: "pointer", fontFamily: "var(--font-display)", fontWeight: 600 }}>{t}</button>
        ))}
      </div>

      {/* Flavours */}
      <p style={{ ...labelStyle, marginBottom: 6 }}>Flavours</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 8 }}>
        {flavours.map(f => (
          <span key={f} onClick={() => setFlavours(prev => prev.filter(x => x !== f))} style={{ background: "var(--bg-3)", border: "1px solid var(--border)", borderRadius: 20, padding: "3px 10px", fontSize: "0.72rem", color: "var(--muted)", cursor: "pointer" }}>{f} ✕</span>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <input placeholder="Add flavour" value={flavourInput} onChange={e => setFlavourInput(e.target.value)} onKeyDown={e => e.key === "Enter" && addFlavour()} style={{ ...inputStyle, flex: 1 }} />
        <button onClick={addFlavour} style={{ padding: "8px 14px", background: "var(--bg-3)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--white)", cursor: "pointer", fontSize: "0.82rem", fontFamily: "var(--font-display)" }}>Add</button>
      </div>

      <button onClick={handleSave} disabled={saving} style={{ padding: "8px 20px", background: saved ? "#10b981" : "var(--orange)", border: "none", borderRadius: 8, color: "#fff", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer" }}>
        {saved ? "Saved!" : saving ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
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
  const [activeTab, setActiveTab] = useState<"orders" | "products" | "accounts">("orders");
  const [nextRefresh, setNextRefresh] = useState(AUTO_REFRESH_MS / 1000);
  const autoRefreshRef = useRef<NodeJS.Timeout | null>(null);

  // Product overrides
  const [productOverrides, setProductOverrides] = useState<ProductOverride[]>([]);

  // Accounts
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

  // ── Persist login in sessionStorage ──────────────────────────────────────
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem(SESSION_KEY);
      if (saved === "true") setAuthed(true);
    }
  }, []);

  const login = () => {
    if (password === ADMIN_PASSWORD) {
      setAuthed(true);
      sessionStorage.setItem(SESSION_KEY, "true");
    }
  };

  // ── Auto-refresh orders only every 30s ───────────────────────────────────
  useEffect(() => {
    if (!authed) return;
    autoRefreshRef.current = setInterval(() => {
      refreshOrdersOnly();
    }, AUTO_REFRESH_MS);
    return () => { if (autoRefreshRef.current) clearInterval(autoRefreshRef.current); };
  }, [authed, filter]);

  useEffect(() => {
    if (!authed) return;
    setNextRefresh(AUTO_REFRESH_MS / 1000);
    const countdown = setInterval(() => {
      setNextRefresh(prev => prev <= 1 ? AUTO_REFRESH_MS / 1000 : prev - 1);
    }, 1000);
    return () => clearInterval(countdown);
  }, [authed, filter]);

  // ── Refresh orders list only (no page reload) ─────────────────────────────
  const refreshOrdersOnly = useCallback(async () => {
    const [ordersRes, dashRes] = await Promise.all([
      fetch(`/api/orders?${filter !== "all" ? `status=${filter}&` : ""}limit=${PAGE_SIZE}&skip=0`),
      fetch("/api/dashboard"),
    ]);
    const ordersData = await ordersRes.json();
    const dashData = await dashRes.json();
    const fetched = ordersData.orders || [];
    setOrders(fetched);
    setOrderCache(prev => ({ ...prev, [filter]: fetched }));
    setHasMore(fetched.length === PAGE_SIZE);
    setDashboard(dashData);
  }, [filter]);

  const fetchData = useCallback(async (resetPage = true) => {
    if (orderCache[filter]) setOrders(orderCache[filter]);
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
    setOrderCache(prev => ({ ...prev, [filter]: merged }));
    setHasMore(fetched.length === PAGE_SIZE);
    setDashboard(dashData);
    setLoading(false);
  }, [filter, page, orderCache]);

  const fetchProductOverrides = async () => {
    const res = await fetch("/api/product-overrides");
    const data = await res.json();
    setProductOverrides(data.overrides || []);
  };

  useEffect(() => {
    if (authed) { fetchData(true); fetchProductOverrides(); }
  }, [authed, filter]);

  const loadMore = async () => {
    const nextPage = page + 1;
    setPage(nextPage);
    setLoading(true);
    const res = await fetch(`/api/orders?${filter !== "all" ? `status=${filter}&` : ""}limit=${PAGE_SIZE}&skip=${(nextPage - 1) * PAGE_SIZE}`);
    const data = await res.json();
    const fetched = data.orders || [];
    setOrders(prev => [...prev, ...fetched]);
    setHasMore(fetched.length === PAGE_SIZE);
    setLoading(false);
  };

  const updateStatus = async (orderId: string, status: string) => {
    await fetch(`/api/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, ...(status === "cancelled" ? { cancelled_at: new Date().toISOString() } : {}) }),
    });
    refreshOrdersOnly();
    setSelectedOrder(null);
  };

  const saveProductOverride = async (data: ProductOverride) => {
    await fetch("/api/product-overrides", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    fetchProductOverrides();
  };

  const fetchAccounts = async (tab = accountsTab) => {
    setAccountsLoading(true);
    if (tab === "customers") { const r = await fetch("/api/accounts?section=customers"); const d = await r.json(); setCustomers(d.customers || []); }
    else if (tab === "inventory") { const r = await fetch("/api/accounts?section=inventory"); const d = await r.json(); setInventoryItems(d.items || []); }
    else if (tab === "purchases") { const r = await fetch("/api/accounts?section=purchases"); const d = await r.json(); setPurchases(d.purchases || []); }
    else if (tab === "sales") { const r = await fetch(`/api/accounts?section=sales&range=${salesRange}`); const d = await r.json(); setSalesData(d); }
    setAccountsLoading(false);
  };

  const fetchCustomerOrders = async (phone: string) => {
    const r = await fetch(`/api/accounts?section=customer_orders&phone=${phone}`);
    const d = await r.json(); setCustomerOrders(d.orders || []);
  };

  const updateInventory = async (productId: string, stockCount: number, reorderLevel: number) => {
    await fetch("/api/accounts?section=inventory", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ product_id: productId, stock_count: stockCount, reorder_level: reorderLevel }) });
    fetchAccounts("inventory");
  };

  const handleAddPurchase = async () => {
    if (!purchaseForm.product_name || !purchaseForm.quantity || !purchaseForm.cost_per_unit) { setPurchaseMsg("Product, quantity and cost are required."); return; }
    setPurchaseSaving(true);
    const res = await fetch("/api/accounts?section=purchases", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(purchaseForm) });
    if (res.ok) { setPurchaseMsg("Purchase logged!"); setPurchaseForm({ supplier: "", product_name: "", quantity: "", cost_per_unit: "", notes: "" }); fetchAccounts("purchases"); }
    else setPurchaseMsg("Failed to save.");
    setPurchaseSaving(false);
    setTimeout(() => setPurchaseMsg(""), 3000);
  };

  useEffect(() => {
    if (authed && activeTab === "accounts") fetchAccounts(accountsTab);
  }, [authed, activeTab, accountsTab, salesRange]);

  // ── LOGIN SCREEN ──────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)" }}>
        <div style={{ background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: 16, padding: "40px", width: "100%", maxWidth: 380 }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", fontWeight: 800, marginBottom: 8 }}>VIB Admin</h1>
          <p style={{ color: "var(--muted)", fontSize: "0.85rem", marginBottom: 24 }}>Enter admin password to continue</p>
          <input type="password" placeholder="Password" value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === "Enter" && login()}
            style={{ width: "100%", padding: "12px 14px", marginBottom: 12, background: "var(--bg-3)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--white)", fontSize: "0.95rem", fontFamily: "var(--font-body)", outline: "none", boxSizing: "border-box" }}
          />
          {password && password !== ADMIN_PASSWORD && <p style={{ color: "#ef4444", fontSize: "0.8rem", marginBottom: 8 }}>Wrong password</p>}
          <button onClick={login} style={{ width: "100%", padding: "12px", background: "var(--orange)", border: "none", borderRadius: 8, color: "#fff", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.95rem", cursor: "pointer" }}>Login →</button>
        </div>
      </div>
    );
  }

  // ── MAIN ADMIN UI ─────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", padding: "24px 16px" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 10 }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", fontWeight: 800 }}>VIB Admin</h1>
          <button
            onClick={() => { refreshOrdersOnly(); setNextRefresh(AUTO_REFRESH_MS / 1000); }}
            style={{ background: "var(--bg-3)", border: "1px solid var(--border)", color: "var(--white)", borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontFamily: "var(--font-display)", fontSize: "0.85rem" }}
          >
            Refresh · {Math.floor(nextRefresh / 60)}:{String(nextRefresh % 60).padStart(2, "0")}
          </button>
        </div>

        {/* Dashboard Stats */}
        {dashboard && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 12, marginBottom: 24 }}>
            {[
              { label: "Today's Orders", value: dashboard.today_orders, color: "var(--orange)" },
              { label: "Today's Revenue", value: `Rs.${dashboard.today_revenue.toLocaleString()}`, color: "#10b981" },
              { label: "Pending", value: dashboard.pending, color: "#f59e0b" },
              { label: "Confirmed", value: dashboard.confirmed, color: "#3b82f6" },
              { label: "Cancelled", value: dashboard.delivered, color: "#ef4444" },
            ].map(stat => (
              <div key={stat.label} style={{ background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: 12, padding: "16px 12px", textAlign: "center" }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", fontWeight: 800, color: stat.color }}>{stat.value}</div>
                <div style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: 4 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Tab switcher */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {(["orders", "products", "accounts"] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: "8px 20px", borderRadius: 20, background: activeTab === tab ? "var(--orange)" : "var(--bg-3)", border: activeTab === tab ? "none" : "1px solid var(--border)", color: activeTab === tab ? "#fff" : "var(--muted)", cursor: "pointer", fontSize: "0.85rem", fontFamily: "var(--font-display)", fontWeight: 700, textTransform: "capitalize" }}>
              {tab === "orders" ? "Orders" : tab === "products" ? "Products" : "Accounts"}
            </button>
          ))}
        </div>

        {/* ── ORDERS TAB ── */}
        {activeTab === "orders" && (
          <>
            <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
              {["all", "pending", "confirmed", "cancelled"].map(s => (
                <button key={s} onClick={() => setFilter(s)} style={{ padding: "6px 14px", borderRadius: 20, background: filter === s ? "var(--orange)" : "var(--bg-3)", border: filter === s ? "none" : "1px solid var(--border)", color: filter === s ? "#fff" : "var(--muted)", cursor: "pointer", fontSize: "0.8rem", fontFamily: "var(--font-display)", fontWeight: 600 }}>
                  {STATUS_LABELS[s] || "All"}
                </button>
              ))}
            </div>

            {loading && orders.length === 0 ? (
              <p style={{ color: "var(--muted)", textAlign: "center", padding: 40 }}>Loading...</p>
            ) : orders.length === 0 ? (
              <p style={{ color: "var(--muted)", textAlign: "center", padding: 40 }}>No orders found</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {orders.map(order => {
                  const isSelected = selectedOrder?._id === order._id;
                  const isCancelled = order.status === "cancelled";
                  const cancelledAt = order.cancelled_at ? new Date(order.cancelled_at).getTime() : null;
                  const canUndo = isCancelled && cancelledAt && (Date.now() - cancelledAt < CANCEL_WINDOW_MS);
                  const undoMinutesLeft = canUndo && cancelledAt ? Math.ceil((CANCEL_WINDOW_MS - (Date.now() - cancelledAt)) / 60000) : 0;

                  return (
                    <div key={order._id}
                      onClick={() => setSelectedOrder(isSelected ? null : order)}
                      style={{ background: "var(--bg-2)", border: `1px solid ${isSelected ? "var(--orange)" : "var(--border)"}`, borderRadius: 12, padding: "16px", cursor: "pointer" }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                            <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.9rem" }}>{order.customer_name}</span>
                            <span style={{ background: (STATUS_COLORS[order.status] || "#888") + "22", color: STATUS_COLORS[order.status] || "#888", border: `1px solid ${(STATUS_COLORS[order.status] || "#888")}44`, borderRadius: 20, padding: "2px 8px", fontSize: "0.72rem", fontWeight: 600, fontFamily: "var(--font-display)" }}>
                              {STATUS_LABELS[order.status] || order.status}
                            </span>
                            {order.source === "whatsapp" && (
                              <span style={{ fontSize: "0.68rem", color: "#25d366", background: "#25d36622", border: "1px solid #25d36644", borderRadius: 20, padding: "2px 7px", fontFamily: "var(--font-display)", fontWeight: 600 }}>WA</span>
                            )}
                          </div>
                          <p style={{ fontSize: "0.8rem", color: "var(--muted)", marginBottom: 2 }}>
                            {order.customer_phone} · {order.sub_location}, {order.main_location}
                          </p>
                          <p style={{ fontSize: "0.78rem", color: "var(--muted)" }}>
                            {order.items.map(i => `${i.name}${i.flavour ? ` (${i.flavour})` : ""} x${i.quantity}`).join(", ")}
                          </p>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1rem", color: "var(--orange)" }}>Rs.{order.total.toLocaleString()}</div>
                          <div style={{ fontSize: "0.72rem", color: "var(--muted)" }}>{new Date(order.created_at).toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" })}</div>
                          <div style={{ fontSize: "0.72rem", color: "var(--muted)" }}>{order.order_id}</div>
                        </div>
                      </div>

                      {isSelected && (
                        <div style={{ marginTop: 12 }} onClick={e => e.stopPropagation()}>
                          <a href={`https://wa.me/91${order.customer_phone.replace(/\D/g, "")}?text=${buildWhatsAppMessage(order)}`}
                            target="_blank" rel="noopener noreferrer"
                            style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 8, marginBottom: 10, background: "#25d36622", border: "1px solid #25d36644", color: "#25d366", fontSize: "0.82rem", fontFamily: "var(--font-display)", fontWeight: 700, textDecoration: "none" }}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="#25d366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.554 4.122 1.523 5.855L0 24l6.29-1.49A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.007-1.374l-.36-.214-3.733.884.937-3.638-.234-.374A9.818 9.818 0 0112 2.182c5.424 0 9.818 4.394 9.818 9.818 0 5.425-4.394 9.818-9.818 9.818z"/></svg>
                            WhatsApp Customer
                          </a>

                          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                            {order.status !== "confirmed" && (
                              <button onClick={() => updateStatus(order.order_id, "confirmed")}
                                style={{ padding: "8px 16px", borderRadius: 8, background: "#3b82f622", border: "1px solid #3b82f644", color: "#3b82f6", cursor: "pointer", fontSize: "0.82rem", fontFamily: "var(--font-display)", fontWeight: 700 }}>
                                Confirm Order
                              </button>
                            )}
                            {order.status !== "cancelled" && (
                              <button onClick={() => updateStatus(order.order_id, "cancelled")}
                                style={{ padding: "8px 16px", borderRadius: 8, background: "#ef444422", border: "1px solid #ef444444", color: "#ef4444", cursor: "pointer", fontSize: "0.82rem", fontFamily: "var(--font-display)", fontWeight: 700 }}>
                                Cancel Order
                              </button>
                            )}
                            {canUndo && (
                              <button onClick={() => updateStatus(order.order_id, "pending")}
                                style={{ padding: "8px 16px", borderRadius: 8, background: "#f59e0b22", border: "1px solid #f59e0b44", color: "#f59e0b", cursor: "pointer", fontSize: "0.82rem", fontFamily: "var(--font-display)", fontWeight: 700 }}>
                                Undo Cancel ({undoMinutesLeft}m left)
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
                {hasMore && (
                  <button onClick={loadMore} disabled={loading} style={{ width: "100%", padding: "12px", background: "var(--bg-3)", border: "1px solid var(--border)", color: "var(--muted)", borderRadius: 10, cursor: "pointer", fontFamily: "var(--font-display)", fontSize: "0.85rem", marginTop: 4 }}>
                    {loading ? "Loading..." : "Load More"}
                  </button>
                )}
              </div>
            )}
          </>
        )}

        {/* ── PRODUCTS TAB ── */}
        {activeTab === "products" && (
          <div>
            <p style={{ fontSize: "0.82rem", color: "var(--muted)", marginBottom: 16 }}>
              Edit tags and flavours for each product. Changes reflect on the frontend immediately after saving.
            </p>
            {hardcodedProducts.map(product => {
              const override = productOverrides.find(o => o.product_name === product.name) || null;
              return (
                <ProductOverrideRow
                  key={product.name}
                  product={{ name: product.name, flavours: product.flavours, price: product.price }}
                  override={override}
                  onSave={saveProductOverride}
                />
              );
            })}
          </div>
        )}

        {/* ── ACCOUNTS TAB ── */}
        {activeTab === "accounts" && (
          <div>
            <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
              {(["customers", "inventory", "purchases", "sales"] as const).map(t => (
                <button key={t} onClick={() => setAccountsTab(t)} style={{ padding: "7px 16px", borderRadius: 20, background: accountsTab === t ? "var(--orange)" : "var(--bg-3)", border: accountsTab === t ? "none" : "1px solid var(--border)", color: accountsTab === t ? "#fff" : "var(--muted)", cursor: "pointer", fontSize: "0.8rem", fontFamily: "var(--font-display)", fontWeight: 700, textTransform: "capitalize" }}>{t}</button>
              ))}
            </div>

            {accountsLoading && <p style={{ color: "var(--muted)", textAlign: "center", padding: 40 }}>Loading...</p>}

            {/* CUSTOMERS */}
            {!accountsLoading && accountsTab === "customers" && (
              <div>
                {selectedCustomer ? (
                  <div>
                    <button onClick={() => { setSelectedCustomer(null); setCustomerOrders([]); }} style={{ ...backBtnStyle, marginBottom: 16 }}>← Back</button>
                    <div style={{ background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: 12, padding: 16, marginBottom: 16 }}>
                      <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1rem" }}>{selectedCustomer.name}</p>
                      <p style={{ fontSize: "0.82rem", color: "var(--muted)", marginTop: 4 }}>{selectedCustomer.phone} · {selectedCustomer.order_count} orders · Rs.{selectedCustomer.total_spent?.toLocaleString()} spent</p>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {customerOrders.map((o: any) => (
                        <div key={o._id} style={{ background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: 10, padding: "12px 14px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 6 }}>
                            <div>
                              <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.85rem" }}>{o.order_id}</p>
                              <p style={{ fontSize: "0.78rem", color: "var(--muted)" }}>{o.items?.map((i: any) => `${i.name} x${i.quantity}`).join(", ")}</p>
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
                      {customers.map(c => (
                        <div key={c.phone} onClick={() => { setSelectedCustomer(c); fetchCustomerOrders(c.phone); }} style={{ background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: 12, padding: "14px 16px", cursor: "pointer" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                            <div>
                              <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.9rem" }}>{c.name}</p>
                              <p style={{ fontSize: "0.78rem", color: "var(--muted)", marginTop: 2 }}>{c.phone}</p>
                            </div>
                            <div style={{ textAlign: "right" }}>
                              <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: "var(--orange)" }}>Rs.{c.total_spent?.toLocaleString()}</p>
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

            {/* INVENTORY */}
            {!accountsLoading && accountsTab === "inventory" && (
              <div>
                {inventoryItems.length === 0 ? <p style={{ color: "var(--muted)", fontSize: "0.85rem" }}>No products found.</p> : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {inventoryItems.map(item => <InventoryRow key={item._id} item={item} onSave={updateInventory} />)}
                  </div>
                )}
              </div>
            )}

            {/* PURCHASES */}
            {!accountsLoading && accountsTab === "purchases" && (
              <div>
                <div style={{ background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: 14, padding: 20, marginBottom: 24 }}>
                  <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 700, marginBottom: 14 }}>Log Purchase</h2>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    <div><label style={labelStyle}>Supplier</label><input placeholder="Supplier name" value={purchaseForm.supplier} onChange={e => setPurchaseForm(p => ({ ...p, supplier: e.target.value }))} style={inputStyle} /></div>
                    <div><label style={labelStyle}>Product *</label><input placeholder="Product name" value={purchaseForm.product_name} onChange={e => setPurchaseForm(p => ({ ...p, product_name: e.target.value }))} style={inputStyle} /></div>
                    <div><label style={labelStyle}>Quantity *</label><input type="number" placeholder="10" value={purchaseForm.quantity} onChange={e => setPurchaseForm(p => ({ ...p, quantity: e.target.value }))} style={inputStyle} /></div>
                    <div><label style={labelStyle}>Cost/Unit (Rs.) *</label><input type="number" placeholder="2000" value={purchaseForm.cost_per_unit} onChange={e => setPurchaseForm(p => ({ ...p, cost_per_unit: e.target.value }))} style={inputStyle} /></div>
                    <div style={{ gridColumn: "1 / -1" }}><label style={labelStyle}>Notes</label><input placeholder="Optional" value={purchaseForm.notes} onChange={e => setPurchaseForm(p => ({ ...p, notes: e.target.value }))} style={inputStyle} /></div>
                  </div>
                  {purchaseForm.quantity && purchaseForm.cost_per_unit && <p style={{ fontSize: "0.8rem", color: "#10b981", marginTop: 8 }}>Total: Rs.{(Number(purchaseForm.quantity) * Number(purchaseForm.cost_per_unit)).toLocaleString()}</p>}
                  {purchaseMsg && <p style={{ fontSize: "0.82rem", color: purchaseMsg === "Purchase logged!" ? "#10b981" : "#ef4444", marginTop: 8 }}>{purchaseMsg}</p>}
                  <button onClick={handleAddPurchase} disabled={purchaseSaving} style={{ marginTop: 14, padding: "11px 24px", background: "var(--orange)", border: "none", borderRadius: 8, color: "#fff", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.9rem", cursor: "pointer" }}>
                    {purchaseSaving ? "Saving..." : "Log Purchase →"}
                  </button>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {purchases.map(p => (
                    <div key={p._id} style={{ background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: 10, padding: "12px 16px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 6 }}>
                        <div>
                          <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.88rem" }}>{p.product_name}</p>
                          <p style={{ fontSize: "0.78rem", color: "var(--muted)" }}>{p.supplier} · Qty: {p.quantity} · Rs.{p.cost_per_unit}/unit</p>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: "#10b981" }}>Rs.{p.total_cost?.toLocaleString()}</p>
                          <p style={{ fontSize: "0.72rem", color: "var(--muted)" }}>{p.date ? new Date(p.date).toLocaleDateString("en-IN") : "—"}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SALES */}
            {!accountsLoading && accountsTab === "sales" && salesData && (
              <div>
                <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
                  {[["7", "7 Days"], ["14", "14 Days"], ["30", "30 Days"]].map(([val, label]) => (
                    <button key={val} onClick={() => setSalesRange(val)} style={{ padding: "6px 14px", borderRadius: 20, background: salesRange === val ? "var(--orange)" : "var(--bg-3)", border: salesRange === val ? "none" : "1px solid var(--border)", color: salesRange === val ? "#fff" : "var(--muted)", cursor: "pointer", fontSize: "0.8rem", fontFamily: "var(--font-display)", fontWeight: 600 }}>{label}</button>
                  ))}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 12, marginBottom: 24 }}>
                  {[
                    { label: "Revenue", value: `Rs.${salesData.stats?.total_revenue?.toLocaleString()}`, color: "#10b981" },
                    { label: "Orders", value: salesData.stats?.total_orders, color: "var(--orange)" },
                    { label: "Avg Order", value: `Rs.${salesData.stats?.avg_order?.toLocaleString()}`, color: "#3b82f6" },
                  ].map(s => (
                    <div key={s.label} style={{ background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: 12, padding: "16px 12px", textAlign: "center" }}>
                      <div style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", fontWeight: 800, color: s.color }}>{s.value}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: 4 }}>{s.label}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
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
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

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
