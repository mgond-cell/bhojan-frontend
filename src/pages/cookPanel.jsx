import { useState, useEffect } from "react";
import {
  COOK_PROFILE,
  TODAY_ORDERS,
  WEEK_MENU,
  EARNINGS,
} from "../data/cookData";
import "./CookPanel.css";
import { useAuth } from "../context/AuthContext";
export default function CookPanel() {
  const { user, getTodayOrders, updateOrderStatus } = useAuth();
  const [activeTab, setActiveTab] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  // Fetch real orders on load
  useEffect(() => {
    async function fetchOrders() {
      try {
        const data = await getTodayOrders();
        if (data.success) {
          setOrders(data.orders);
        }
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setOrdersLoading(false);
      }
    }
    fetchOrders();
  }, []);
  const [menu, setMenu] = useState(WEEK_MENU);
  const [editingDay, setEditingDay] = useState(null);
  const [editValues, setEditValues] = useState({});

  // ── Mark order as delivered ──
  async function updateStatus(id, newStatus) {
    try {
      await updateOrderStatus(id, newStatus);
      setOrders((prev) =>
        prev.map((o) => o._id === id ? { ...o, status: newStatus } : o)
      );
    } catch (err) {
      console.error("Failed to update order:", err);
    }
  }
  // ── Start editing a menu day ──
  function startEdit(day) {
    const item = menu.find((m) => m.day === day);
    setEditingDay(day);
    setEditValues({ lunch: item.lunch, dinner: item.dinner });
  }

  // ── Save edited menu ──
  function saveMenu(day) {
    setMenu((prev) =>
      prev.map((m) => m.day === day ? { ...m, ...editValues } : m)
    );
    setEditingDay(null);
  }

  // ── Counts ──
  const pendingCount = orders.filter((o) => o.status === "pending").length;
  const deliveredCount = orders.filter((o) => o.status === "delivered").length;
  const skippedCount = orders.filter((o) => o.status === "skipped").length;
  const totalEarnings = EARNINGS.reduce((sum, e) => sum + e.amount, 0);

  return (
    <main className="cook-panel page-fade-in">
      <div className="container">

        {/* ── Top profile bar ── */}
        <div className="cook-header">
          <div className="cook-avatar">
            {COOK_PROFILE.name[0]}
          </div>
          <div className="cook-info">
            <h1 className="cook-name">Namaste, {user?.name} 👋</h1>
            <p className="cook-meta">
              ⭐ {COOK_PROFILE.rating} rating &nbsp;·&nbsp;
              📍 {COOK_PROFILE.area} &nbsp;·&nbsp;
              🗓 Since {COOK_PROFILE.joinedDate} &nbsp;·&nbsp;
              ✉ {user?.email}
            </p>
          </div>
          <div className="cook-badge">
            🟢 {COOK_PROFILE.activeSubscribers} active subscribers
          </div>
        </div>

        {/* ── Stat cards ── */}
        <div className="cook-stats">
          <div className="cstat">
            <div className="cstat-val">{pendingCount}</div>
            <div className="cstat-label">Pending today</div>
          </div>
          <div className="cstat">
            <div className="cstat-val">{deliveredCount}</div>
            <div className="cstat-label">Delivered today</div>
          </div>
          <div className="cstat">
            <div className="cstat-val">{skippedCount}</div>
            <div className="cstat-label">Skipped today</div>
          </div>
          <div className="cstat highlight">
            <div className="cstat-val">
              ₹{EARNINGS[EARNINGS.length - 1].amount.toLocaleString("en-IN")}
            </div>
            <div className="cstat-label">This month</div>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="tab-nav">
          {[
            { key: "orders", label: "📋 Today's Orders" },
            { key: "menu", label: "🍽 My Menu" },
            { key: "delivery", label: "📦 Mark Deliveries" },
            { key: "earnings", label: "📊 Earnings" },
          ].map((t) => (
            <button
              key={t.key}
              className={`tab-btn ${activeTab === t.key ? "active" : ""}`}
              onClick={() => setActiveTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ════════════════════════════
            TAB 1 — TODAY'S ORDERS
        ════════════════════════════ */}
        {activeTab === "orders" && (
          <div className="tab-content">
            <div className="tab-top">
              <h2 className="tab-title">Today's tiffin orders</h2>
              <p className="tab-sub">
                {pendingCount} pending · {deliveredCount} delivered · {skippedCount} skipped
              </p>
            </div>

            <div className="orders-list">
              {ordersLoading ? (
                <div className="loading-msg">Loading orders...</div>
              ) : orders.length === 0 ? (
                <div className="empty-msg">
                  <div style={{ fontSize: "40px" }}>🍱</div>
                  <p>No orders yet for today.</p>
                  <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                    Orders appear here when customers subscribe.
                  </p>
                </div>
              ) : (
                orders.map((order) => (
                  <div
                    key={order._id}
                    className={`order-card ${order.status}`}
                  >
                    {/* Left — customer info */}
                    <div className="order-left">
                      <div className="order-avatar">
                        {order.customer?.name?.[0] || "?"}
                      </div>
                      <div>
                        <div className="order-name">{order.customer?.name || "Customer"}</div>
                        <div className="order-address">📍 {order.address || "Address not set"}</div>
                      </div>
                    </div>

                    {/* Middle — meal details */}
                    <div className="order-middle">
                      <span className="order-plan">{order.plan}</span>
                      <div className="order-chips">
                        <span className="ochip">🍽 {order.meals}</span>
                        <span className="ochip">🥗 {order.diet}</span>
                        <span className="ochip">📏 {order.portion}</span>
                        {order.allergies !== "None" && (
                          <span className="ochip allergy">
                            ⚠ No {order.allergies}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Right — status */}
                    <div className="order-right">
                      {order.status === "pending" && (
                        <button
                          className="deliver-btn preparing-btn"
                          onClick={() => updateStatus(order._id, "preparing")}
                        >
                          👨‍🍳 Start Preparing
                        </button>
                      )}
                      {order.status === "preparing" && (
                        <button
                          className="deliver-btn outfor-btn"
                          onClick={() => updateStatus(order._id, "out_for_delivery")}
                        >
                          🚴 Out for Delivery
                        </button>
                      )}
                      {order.status === "out_for_delivery" && (
                        <button
                          className="deliver-btn"
                          onClick={() => updateStatus(order._id, "delivered")}
                        >
                          ✓ Mark Delivered
                        </button>
                      )}
                      {order.status === "delivered" && (
                        <span className="status-badge delivered">✓ Delivered</span>
                      )}
                      {order.status === "skipped" && (
                        <span className="status-badge skipped">Skipped</span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ════════════════════════════
            TAB 2 — MY MENU
        ════════════════════════════ */}
        {activeTab === "menu" && (
          <div className="tab-content">
            <div className="tab-top">
              <h2 className="tab-title">This week's menu</h2>
              <p className="tab-sub">Click Edit to update any day's meal</p>
            </div>

            <div className="menu-list">
              {menu.map((item) => (
                <div className="menu-row" key={item.day}>
                  <div className="menu-day">{item.day}</div>

                  {editingDay === item.day ? (
                    // ── Edit mode ──
                    <div className="menu-edit">
                      <div className="menu-edit-field">
                        <label>☀ Lunch</label>
                        <input
                          value={editValues.lunch}
                          onChange={(e) =>
                            setEditValues((p) => ({ ...p, lunch: e.target.value }))
                          }
                          className="menu-input"
                        />
                      </div>
                      <div className="menu-edit-field">
                        <label>🌙 Dinner</label>
                        <input
                          value={editValues.dinner}
                          onChange={(e) =>
                            setEditValues((p) => ({ ...p, dinner: e.target.value }))
                          }
                          className="menu-input"
                        />
                      </div>
                      <div className="menu-edit-actions">
                        <button className="save-menu-btn" onClick={() => saveMenu(item.day)}>
                          Save ✓
                        </button>
                        <button className="cancel-menu-btn" onClick={() => setEditingDay(null)}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    // ── View mode ──
                    <div className="menu-meals">
                      <div className="menu-meal">
                        <span className="meal-time">☀ Lunch</span>
                        <span className="meal-name">{item.lunch}</span>
                      </div>
                      <div className="menu-meal">
                        <span className="meal-time">🌙 Dinner</span>
                        <span className="meal-name">{item.dinner}</span>
                      </div>
                    </div>
                  )}

                  {editingDay !== item.day && (
                    <button className="edit-menu-btn" onClick={() => startEdit(item.day)}>
                      Edit
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ════════════════════════════
            TAB 3 — MARK DELIVERIES
        ════════════════════════════ */}
        {activeTab === "delivery" && (
          <div className="tab-content">
            <div className="tab-top">
              <h2 className="tab-title">Mark deliveries</h2>
              <p className="tab-sub">Tap a customer to mark their tiffin as delivered</p>
            </div>

            <div className="delivery-grid">
              {orders
                .filter((o) => o.status !== "skipped")
                .map((order) => (
                  <div
                    key={order._id}
                    className={`delivery-card ${order.status}`}
                    onClick={() => {
                      if (order.status === "pending") updateStatus(order._id, "preparing");
                      else if (order.status === "preparing") updateStatus(order._id, "out_for_delivery");
                      else if (order.status === "out_for_delivery") updateStatus(order._id, "delivered");
                    }}
                  >
                    <div className="dc-avatar">{order.customerName[0]}</div>
                    <div className="dc-name">{order.customerName}</div>
                    <div className="dc-address">{order.address}</div>
                    <div className={`dc-status ${order.status}`}>
                      {order.status === "pending" && "⏳ Tap to prepare"}
                      {order.status === "preparing" && "👨‍🍳 Tap → Out for delivery"}
                      {order.status === "out_for_delivery" && "🚴 Tap → Mark delivered"}
                      {order.status === "delivered" && "✓ Done"}
                    </div>
                  </div>
                ))}
            </div>

            {/* Progress bar */}
            <div className="delivery-progress">
              <div className="dp-label">
                {deliveredCount} of {orders.filter((o) => o.status !== "skipped").length} delivered
              </div>
              <div className="dp-bar">
                <div
                  className="dp-fill"
                  style={{
                    width: `${Math.round(
                      (deliveredCount /
                        Math.max(orders.filter((o) => o.status !== "skipped").length, 1)) *
                      100
                    )}%`,
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════
            TAB 4 — EARNINGS
        ════════════════════════════ */}
        {activeTab === "earnings" && (
          <div className="tab-content">
            <div className="tab-top">
              <h2 className="tab-title">Earnings summary</h2>
              <p className="tab-sub">
                Total earned: ₹{totalEarnings.toLocaleString("en-IN")}
              </p>
            </div>

            <div className="earnings-list">
              {EARNINGS.map((e) => (
                <div className="earning-row" key={e.month}>
                  <div className="er-month">{e.month}</div>
                  <div className="er-bar-wrap">
                    <div
                      className="er-bar"
                      style={{
                        width: `${Math.round((e.amount / 40000) * 100)}%`,
                      }}
                    />
                  </div>
                  <div className="er-amount">
                    ₹{e.amount.toLocaleString("en-IN")}
                  </div>
                </div>
              ))}
            </div>

            <div className="earnings-cards">
              <div className="ecards-row">
                <div className="ecard">
                  <div className="ecard-label">Total orders</div>
                  <div className="ecard-val">{COOK_PROFILE.totalOrders}</div>
                </div>
                <div className="ecard">
                  <div className="ecard-label">Avg per month</div>
                  <div className="ecard-val">
                    ₹{Math.round(totalEarnings / EARNINGS.length).toLocaleString("en-IN")}
                  </div>
                </div>
                <div className="ecard">
                  <div className="ecard-label">Active subscribers</div>
                  <div className="ecard-val">{COOK_PROFILE.activeSubscribers}</div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}