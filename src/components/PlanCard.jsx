import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./PlanCard.css";

export default function PlanCard({ plan }) {
  const navigate = useNavigate();
  const { user, subscribe } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubscribe() {
    // Not logged in → go to login first
    if (!user) {
      navigate("/login");
      return;
    }

    setLoading(true);
    try {
      const result = await subscribe({
        plan:   plan.name,
        period: plan.period,
      });

      if (result.success) {
        setSuccess(true);
        // Go to dashboard after 1 second
        setTimeout(() => navigate("/dashboard"), 1000);
      }
    } catch (err) {
      console.error("Subscription failed:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={`plan-card ${plan.featured ? "featured" : ""}`}>
      {plan.featured && <div className="popular-badge">⭐ Most Popular</div>}

      <div className="plan-header">
        <span className="plan-icon">{plan.icon}</span>
        <div>
          <div className="plan-name">{plan.name}</div>
          <div className="plan-tagline">{plan.tagline}</div>
        </div>
      </div>

      <p className="plan-desc">{plan.desc}</p>

      <div className="plan-price-row">
        <span className="plan-price">₹{plan.price.toLocaleString("en-IN")}</span>
        <span className="plan-period">/ {plan.period}</span>
      </div>

      {plan.savings && (
        <div className="plan-savings">🎉 {plan.savings}</div>
      )}

      <div className="plan-meta">
        <span className="meta-chip">📅 {plan.days}</span>
        <span className="meta-chip">🚴 {plan.deliveries}</span>
        <span className="meta-chip">🍽 {plan.meals}</span>
      </div>

      <ul className="features-list">
        {plan.features.map((f, i) => (
          <li key={i} className={f.yes ? "yes" : "no"}>
            <span className="feat-icon">{f.yes ? "✓" : "✗"}</span>
            {f.text}
          </li>
        ))}
      </ul>

      <button
        className={`plan-btn ${plan.featured ? "plan-btn-filled" : ""}`}
        onClick={handleSubscribe}
        disabled={loading || success}
      >
        {success
          ? "✓ Subscribed! Redirecting..."
          : loading
          ? "Processing..."
          : "Subscribe now →"}
      </button>
    </div>
  );
}