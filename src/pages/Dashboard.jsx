import { useState, useEffect } from "react";
import "./Dashboard.css";
import { useAuth } from "../context/AuthContext";

/* ── Mock subscription data (later you'll fetch this from a backend API) ── */
const INITIAL_SUBSCRIPTION = {
  plan: null,
  period: null,
  price: null,
  nextBilling: null,
  deliveryTime: "12:30 PM (Lunch) & 7:30 PM (Dinner)",
  address: "B-14, Hazratganj, Lucknow — 226001",
  customAddon: false,
};

/* Week days for the skip-day selector */
const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/* Preference options */
const DIET_OPTIONS = ["No restrictions", "Vegetarian", "Vegan", "Jain", "Low-spice", "Diabetic-friendly"];
const PORTION_OPTS = ["Regular", "Small", "Large (extra roti)"];
const ALLERGY_OPTS = ["None", "Peanuts", "Dairy", "Gluten", "Soy", "Onion/Garlic"];

/* Recent deliveries (mock data) */
const DELIVERIES = [
  { date: "Today", time: "12:32 PM", status: "delivered", meal: "Dal Makhani + Roti + Salad" },
  { date: "Yesterday", time: "12:28 PM", status: "delivered", meal: "Paneer Bhurji + Rice + Sabzi" },
  { date: "Apr 8", time: "Skipped", status: "skipped", meal: "—" },
  { date: "Apr 7", time: "12:30 PM", status: "delivered", meal: "Rajma + Rice + Raita" },
  { date: "Apr 6", time: "12:35 PM", status: "delivered", meal: "Aloo Gobhi + Roti + Dal" },
];

export default function Dashboard() {
  const { user, getSubscription, getMyOrders, skipDay, getSkippedDays, savePreferences, getPreferences } = useAuth();

  const [sub, setSub] = useState(INITIAL_SUBSCRIPTION);
  const [subLoading, setSubLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  // Fetch real subscription on load
  useEffect(() => {
    async function fetchSub() {
      try {
        const data = await getSubscription();
        if (data.success && data.subscription?.active) {
          setSub((prev) => ({
            ...prev,
            plan: data.subscription.plan,
            period: data.subscription.period,
            price: data.subscription.plan === "Basic Tiffin" ? 1399
              : data.subscription.plan === "Double Decker" ? 2299
                : 3499,
          }));
        }
      } catch (err) {
        console.error("Failed to fetch subscription:", err);
      } finally {
        setSubLoading(false);
      }
    }
    fetchSub();
  }, []);

  // Fetch real delivery history
  useEffect(() => {
    async function fetchOrders() {
      try {
        const data = await getMyOrders();
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

  // Fetch real skipped days
  useEffect(() => {
    async function fetchSkipDays() {
      try {
        const data = await getSkippedDays();
        if (data.success) {
          // Convert dates to day names for the UI
          const dayNames = data.skippedDays.map((dateStr) => {
            const d = new Date(dateStr);
            return d.toLocaleDateString("en-IN", { weekday: "short" });
          });
          setSkip(dayNames);
        }
      } catch (err) {
        console.error("Failed to fetch skip days:", err);
      }
    }
    fetchSkipDays();
  }, []);

  // Fetch real preferences
  useEffect(() => {
    async function fetchPreferences() {
      try {
        const data = await getPreferences();
        if (data.success && data.preferences) {
          setDiet(data.preferences.diet || "No restrictions");
          setPortion(data.preferences.portion || "Regular");
          setAllergy(data.preferences.allergies?.length
            ? data.preferences.allergies
            : ["None"]);
        }
      } catch (err) {
        console.error("Failed to fetch preferences:", err);
      }
    }
    fetchPreferences();
  }, []);


  const [skippedDays, setSkip] = useState([]);
  const [skipLoading, setSkipLoading] = useState(false);

  const [diet, setDiet] = useState("No restrictions");
  const [portion, setPortion] = useState("Regular");
  const [allergies, setAllergy] = useState(["None"]);
  const [prefSaved, setPrefSaved] = useState(false);
  const [prefLoading, setPrefLoading] = useState(false);
  const [activeTab, setTab] = useState("overview"); // overview | preferences | history

  /* ── Toggle a skip day ── */
  async function toggleSkipDay(day) {
    setSkipLoading(true);
    try {
      // Get date for selected day this week
      const today = new Date();
      const dayMap = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 0 };
      const target = new Date(today);
      const diff = dayMap[day] - today.getDay();
      target.setDate(today.getDate() + diff);
      const dateStr = target.toISOString().split("T")[0];

      // Call API
      const result = await skipDay(dateStr);

      if (result.success) {
        // Toggle in UI
        setSkip((prev) =>
          prev.includes(day)
            ? prev.filter((d) => d !== day)
            : [...prev, day]
        );
      }
    } catch (err) {
      console.error("Skip day failed:", err);
    } finally {
      setSkipLoading(false);
    }
  }

  /* ── Toggle an allergy tag ── */
  function toggleAllergy(item) {
    if (item === "None") { setAllergy(["None"]); return; }
    setAllergy((prev) => {
      const without = prev.filter((a) => a !== "None");
      return without.includes(item)
        ? without.filter((a) => a !== item) || ["None"]
        : [...without, item];
    });
  }

  /* ── Save preferences (mock) ── */
  async function handleSavePreferences() {
    setPrefLoading(true);
    try {
      const result = await savePreferences({
        diet,
        portion,
        allergies,
        skipDays: skippedDays,
      });
      if (result.success) {
        setPrefSaved(true);
        setTimeout(() => setPrefSaved(false), 2500);
      }
    } catch (err) {
      console.error("Failed to save preferences:", err);
    } finally {
      setPrefLoading(false);
    }
  }

  return (
    <main className="dashboard page-fade-in">
      <div className="container">

        {/* ── Top greeting ── */}
        <div className="dash-greeting">
          <div>
            <h1 className="dash-title">Namaste, {user?.name} 👋</h1>
            <p className="dash-sub">
              Your tiffin is on its way.{" "}
              <a href="/tracker" style={{ color: "var(--primary)", fontWeight: 600 }}>
                Track it live →
              </a>
            </p>

          </div>
          <div className="delivery-badge">
            <span className="badge-dot" />
            Active subscription
          </div>
        </div>

        {/* ── Tab nav ── */}
        <div className="tab-nav">
          {[
            { key: "overview", label: "📋 Overview" },
            { key: "preferences", label: "✏️ Preferences" },
            { key: "history", label: "📦 Deliveries" },
          ].map((t) => (
            <button
              key={t.key}
              className={`tab-btn ${activeTab === t.key ? "active" : ""}`}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ══════════════════════════════════════
            TAB: OVERVIEW
        ══════════════════════════════════════ */}
        {activeTab === "overview" && (
          <div className="tab-content">

            {/* Stat cards */}
            <div className="stat-cards">
              <div className="stat-card">
                <div className="sc-label">Current Plan</div>
                <div className="sc-value">{sub.plan || "No plan yet"}</div>
                <div className="sc-note">
                  {sub.plan
                    ? `${sub.period} · ₹${sub.price?.toLocaleString("en-IN")}`
                    : "Subscribe from Plans page"}
                </div>
              </div>
              <div className="stat-card">
                <div className="sc-label">Next Billing</div>
                <div className="sc-value">{sub.nextBilling || "—"}</div>
                <div className="sc-note">Auto-renews unless paused</div>
              </div>
              <div className="stat-card">
                <div className="sc-label">Meals This Month</div>
                <div className="sc-value">38</div>
                <div className="sc-note">4 skipped · 2 remaining</div>
              </div>
              <div className="stat-card highlight">
                <div className="sc-label">Custom Add-on</div>
                <div className="sc-value">{sub.customAddon ? "Active ✓" : "Inactive"}</div>
                <div className="sc-note">{sub.customAddon ? "Preferences enabled" : "Upgrade to customise"}</div>
              </div>
            </div>

            {/* Subscription details card */}
            <div className="detail-card">
              <h3 className="dc-heading">Subscription details</h3>
              <div className="dc-rows">
                <div className="dc-row"><span>Plan</span><strong>{sub.plan} ({sub.period})</strong></div>
                <div className="dc-row"><span>Delivery time</span><strong>{sub.deliveryTime}</strong></div>
                <div className="dc-row"><span>Address</span><strong>{sub.address}</strong></div>
                <div className="dc-row"><span>Price</span><strong>{sub.price ? `₹${sub.price.toLocaleString("en-IN")} / ${sub.period === "monthly" ? "month" : "week"}` : "—"}</strong></div>              </div>
              <div className="dc-actions">
                <button className="btn-outline" onClick={() => setTab("preferences")}>Edit preferences →</button>
                <button className="dc-pause-btn">Pause subscription</button>
                <button className="dc-cancel-btn">Cancel plan</button>
              </div>
            </div>

            {/* Skip days quick view */}
            <div className="skip-card">
              <h3 className="sc-head">Skip days this week</h3>
              <p className="sc-sub">Tap a day to skip/unskip your tiffin</p>
              <div className="skip-days">
                {WEEK_DAYS.map((d) => (
                  <button
                    key={d}
                    className={`day-btn ${skippedDays.includes(d) ? "skipped" : ""}`}
                    onClick={() => toggleSkipDay(d)}
                  >
                    {d}
                  </button>
                ))}
              </div>
              <p className="skip-note">
                {skipLoading
                  ? "Saving..."
                  : skippedDays.length > 0
                    ? `Skipping: ${skippedDays.join(", ")} · Saved to your account ✓`
                    : "No days skipped this week"}
              </p>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════
            TAB: PREFERENCES
            (only available with Custom add-on)
        ══════════════════════════════════════ */}
        {activeTab === "preferences" && (
          <div className="tab-content">
            {false ? (
              <div className="upsell-card">
                <div className="upsell-icon">✏️</div>
                <h3>Unlock custom preferences</h3>
                <p>Add the Aapki Marzi add-on for ₹199/month to set dietary needs, skip days, and portion sizes.</p>
                <button className="btn-primary">Add Custom add-on — ₹199/mo</button>
              </div>
            ) : (
              <div className="pref-form">
                {prefSaved && (
                  <div className="pref-success">✓ Preferences saved! Changes apply from tomorrow's tiffin.</div>
                )}

                {/* Diet type */}
                <div className="pref-section">
                  <div className="pref-label">Diet type</div>
                  <div className="pref-options">
                    {DIET_OPTIONS.map((o) => (
                      <button
                        key={o}
                        className={`pref-chip ${diet === o ? "selected" : ""}`}
                        onClick={() => setDiet(o)}
                      >
                        {o}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Portion size */}
                <div className="pref-section">
                  <div className="pref-label">Portion size</div>
                  <div className="pref-options">
                    {PORTION_OPTS.map((o) => (
                      <button
                        key={o}
                        className={`pref-chip ${portion === o ? "selected" : ""}`}
                        onClick={() => setPortion(o)}
                      >
                        {o}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Allergies */}
                <div className="pref-section">
                  <div className="pref-label">Allergy / avoid list</div>
                  <div className="pref-options">
                    {ALLERGY_OPTS.map((o) => (
                      <button
                        key={o}
                        className={`pref-chip ${allergies.includes(o) ? "selected" : ""}`}
                        onClick={() => toggleAllergy(o)}
                      >
                        {o}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Skip days (full control here too) */}
                <div className="pref-section">
                  <div className="pref-label">Recurring skip days</div>
                  <p className="pref-hint">These days will be auto-skipped every week</p>
                  <div className="skip-days">
                    {WEEK_DAYS.map((d) => (
                      <button
                        key={d}
                        className={`day-btn ${skippedDays.includes(d) ? "skipped" : ""}`}
                        onClick={() => toggleSkipDay(d)}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  className="btn-primary save-btn"
                  onClick={handleSavePreferences}
                  disabled={prefLoading}
                >
                  {prefLoading ? "Saving..." : prefSaved ? "✓ Saved!" : "Save preferences →"}
                </button>
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════
            TAB: DELIVERY HISTORY
        ══════════════════════════════════════ */}
        {activeTab === "history" && (
          <div className="tab-content">
            {ordersLoading ? (
              <div className="history-loading">Loading deliveries...</div>
            ) : orders.length === 0 ? (
              <div className="history-empty">
                <div style={{ fontSize: "40px" }}>🍱</div>
                <p>No deliveries yet.</p>
                <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                  Subscribe to a plan to get started!
                </p>
              </div>
            ) : (
              <div className="history-list">
                {orders.map((order) => (
                  <div key={order._id} className={`history-row ${order.status}`}>
                    <div className="history-date">
                      <div className="hd-day">
                        {new Date(order.deliveryDate).toLocaleDateString("en-IN", {
                          day: "numeric", month: "short"
                        })}
                      </div>
                      <div className="hd-time">
                        {new Date(order.createdAt).toLocaleTimeString("en-IN", {
                          hour: "2-digit", minute: "2-digit"
                        })}
                      </div>
                    </div>
                    <div className="history-meal">
                      <div style={{ fontWeight: 600, fontSize: "14px" }}>{order.plan}</div>
                      <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{order.meals}</div>
                    </div>
                    <span className={`history-status ${order.status}`}>
                      {order.status === "delivered" && "✓ Delivered"}
                      {order.status === "pending" && "⏳ Pending"}
                      {order.status === "skipped" && "Skipped"}
                      {order.status === "preparing" && "👨‍🍳 Preparing"}
                      {order.status === "out_for_delivery" && "🚴 On the way"}
                    </span>
                  </div>
                ))}
              </div>
            )}
            <p className="history-note" style={{ marginTop: "1rem" }}>
              Showing your last {orders.length} orders.
            </p>
          </div>
        )}

      </div>
    </main>
  );
}
