import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./OrderTracker.css";

// ── Status steps ──
const STEPS = [
  {
    key:   "pending",
    icon:  "📋",
    label: "Order Placed",
    desc:  "Your tiffin order is confirmed",
  },
  {
    key:   "preparing",
    icon:  "👨‍🍳",
    label: "Preparing",
    desc:  "Cook is preparing your meal",
  },
  {
    key:   "out_for_delivery",
    icon:  "🚴",
    label: "On the Way",
    desc:  "Your tiffin is out for delivery",
  },
  {
    key:   "delivered",
    icon:  "✅",
    label: "Delivered",
    desc:  "Tiffin delivered! Enjoy your meal",
  },
];

function getStepIndex(status) {
  const map = {
    pending:          0,
    preparing:        1,
    out_for_delivery: 2,
    delivered:        3,
  };
  return map[status] ?? 0;
}

export default function OrderTracker() {
  const { getTodayTracker } = useAuth();
  const navigate            = useNavigate();

  const [order, setOrder]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  // ── Fetch order ──
  async function fetchOrder() {
    try {
      const data = await getTodayTracker();
      if (data.success) {
        setOrder(data.order);
      }
    } catch (err) {
      console.error("Tracker fetch failed:", err);
    } finally {
      setLoading(false);
      setLastRefresh(new Date());
    }
  }

  // Load on mount
  useEffect(() => {
    fetchOrder();
  }, []);

  // Auto refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(fetchOrder, 30000);
    return () => clearInterval(interval);
  }, []);

  const currentStep = order ? getStepIndex(order.status) : 0;

  return (
    <main className="tracker-page page-fade-in">
      <div className="container">

        {/* ── Header ── */}
        <div className="tracker-header">
          <button className="back-btn" onClick={() => navigate("/dashboard")}>
            ← Back to Dashboard
          </button>
          <div className="tracker-title-wrap">
            <h1 className="tracker-title">🍱 Order Tracker</h1>
            <p className="tracker-sub">Track your tiffin in real time</p>
          </div>
        </div>

        {loading ? (
          <div className="tracker-loading">
            <div className="loading-spinner" />
            <p>Finding your order...</p>
          </div>

        ) : !order ? (
          <div className="tracker-empty">
            <div className="empty-icon">🍽</div>
            <h3>No order today</h3>
            <p>You don't have an active tiffin order for today.</p>
            <button className="btn-primary" onClick={() => navigate("/plans")}>
              Subscribe to a plan →
            </button>
          </div>

        ) : order.status === "skipped" ? (
          <div className="tracker-skipped">
            <div className="empty-icon">⏭</div>
            <h3>Today's tiffin is skipped</h3>
            <p>You skipped today's delivery. See you tomorrow!</p>
            <button className="btn-outline" onClick={() => navigate("/dashboard")}>
              Manage subscription →
            </button>
          </div>

        ) : (
          <>
            {/* ── Order info card ── */}
            <div className="order-info-card">
              <div className="oic-row">
                <span className="oic-label">Plan</span>
                <span className="oic-value">{order.plan}</span>
              </div>
              <div className="oic-row">
                <span className="oic-label">Meals</span>
                <span className="oic-value">{order.meals}</span>
              </div>
              <div className="oic-row">
                <span className="oic-label">Date</span>
                <span className="oic-value">
                  {new Date(order.deliveryDate).toLocaleDateString("en-IN", {
                    weekday: "long", day: "numeric", month: "long"
                  })}
                </span>
              </div>
              <div className="oic-row">
                <span className="oic-label">Address</span>
                <span className="oic-value">{order.address || "Not set"}</span>
              </div>
            </div>

            {/* ── Tracker steps ── */}
            <div className="tracker-card">
              <div className="steps-wrap">
                {STEPS.map((step, index) => {
                  const isDone    = index < currentStep;
                  const isCurrent = index === currentStep;
                  const isPending = index > currentStep;

                  return (
                    <div key={step.key} className="step-item">

                      {/* Connector line */}
                      {index > 0 && (
                        <div className={`connector ${isDone || isCurrent ? "active" : ""}`} />
                      )}

                      {/* Step circle */}
                      <div className={`step-circle ${isDone ? "done" : isCurrent ? "current" : "pending"}`}>
                        {isDone ? (
                          <span className="check">✓</span>
                        ) : (
                          <span className="step-icon">{step.icon}</span>
                        )}
                        {isCurrent && <div className="pulse-ring" />}
                      </div>

                      {/* Step label */}
                      <div className="step-label-wrap">
                        <div className={`step-label ${isCurrent ? "current" : isPending ? "muted" : ""}`}>
                          {step.label}
                        </div>
                        {isCurrent && (
                          <div className="step-desc">{step.desc}</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* ── Status message ── */}
              <div className={`status-banner ${order.status}`}>
                <span className="status-icon">{STEPS[currentStep]?.icon}</span>
                <div>
                  <div className="status-title">{STEPS[currentStep]?.label}</div>
                  <div className="status-desc">{STEPS[currentStep]?.desc}</div>
                </div>
              </div>

              {/* Delivered celebration */}
              {order.status === "delivered" && (
                <div className="delivered-msg">
                  🎉 Enjoy your meal! Khana khao, mast raho!
                </div>
              )}
            </div>

            {/* ── Estimated time ── */}
            {order.status !== "delivered" && (
              <div className="eta-card">
                <div className="eta-icon">⏰</div>
                <div>
                  <div className="eta-title">Estimated delivery</div>
                  <div className="eta-time">12:30 PM – 1:00 PM</div>
                </div>
              </div>
            )}

            {/* ── Refresh ── */}
            <div className="refresh-row">
              <button className="refresh-btn" onClick={fetchOrder}>
                🔄 Refresh status
              </button>
              <span className="refresh-note">
                Last updated: {lastRefresh.toLocaleTimeString("en-IN", {
                  hour: "2-digit", minute: "2-digit", second: "2-digit"
                })}
              </span>
            </div>
          </>
        )}

      </div>
    </main>
  );
}