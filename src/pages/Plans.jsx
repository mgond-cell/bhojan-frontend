import { useState } from "react";
import { PLANS, MENU_ITEMS } from "../data/plans";
import PlanCard from "../components/PlanCard";
import "./Plans.css";

export default function Plans() {
  const [period, setPeriod] = useState("weekly");

  return (
    <main className="plans-page page-fade-in">

      {/* ── Header ── */}
      <section className="plans-hero">
        <div className="container plans-hero-inner">
          <span className="section-tag">Subscription plans</span>
          <h1 className="plans-title">Choose your BHOJAN plan</h1>
          <p className="plans-sub">
            Fresh home-style meals delivered daily. No cooking. No stress. Pause or cancel anytime.
          </p>

          {/* Period toggle */}
          <div className="period-toggle">
            <button
              className={`tog-btn ${period === "weekly" ? "active" : ""}`}
              onClick={() => setPeriod("weekly")}
            >
              Weekly
            </button>
            <button
              className={`tog-btn ${period === "monthly" ? "active" : ""}`}
              onClick={() => setPeriod("monthly")}
            >
              Monthly
              <span className="tog-save">Save up to 15%</span>
            </button>
          </div>
        </div>
      </section>

      {/* ── Plan cards ── */}
      <section className="plans-grid-section">
        <div className="container">
          <div className="plans-grid">
            {PLANS[period].map((plan) => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Custom Add-On ── */}
      <section className="addon-section">
        <div className="container">
          <div className="addon-card">
            <div className="addon-left">
              <span className="addon-icon">✏️</span>
              <div>
                <h3 className="addon-title">Aapki Marzi — Custom Add-on</h3>
                <p className="addon-desc">
                  Available with any plan. Set dietary restrictions, skip specific days,
                  request extra roti, or adjust portions. Your tiffin, your rules.
                </p>
                <div className="addon-features">
                  <span className="addon-chip">🚫 Skip days</span>
                  <span className="addon-chip">🥜 Allergy alerts</span>
                  <span className="addon-chip">🍞 Extra portions</span>
                  <span className="addon-chip">🥗 Diet preferences</span>
                </div>
              </div>
            </div>
            <div className="addon-price-box">
              <div className="addon-price">₹199<span>/mo</span></div>
              <div className="addon-note">Add to any plan at checkout</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── What's in a tiffin ── */}
      <section className="menu-section">
        <div className="container">
          <div className="section-header" style={{ textAlign: "center", marginBottom: "1.5rem" }}>
            <span className="section-tag">Sample menu</span>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "24px", fontWeight: 700, marginTop: "8px" }}>
              What's in a BHOJAN tiffin?
            </h2>
          </div>
          <div className="menu-chips">
            {MENU_ITEMS.map((m) => (
              <div className="menu-chip" key={m.label}>
                <span className="menu-chip-icon">{m.emoji}</span>
                <span>{m.label}</span>
              </div>
            ))}
          </div>
          <p className="menu-note">
            Menu rotates seasonally. All meals prepared by verified home cooks using fresh ingredients.
            Free delivery within 5 km. Allergen info available on request.
          </p>
        </div>
      </section>

      {/* ── FAQ strip ── */}
      <section className="faq-section">
        <div className="container">
          <h2 className="faq-heading">Common questions</h2>
          <div className="faq-grid">
            {[
              { q: "Can I pause my subscription?", a: "Yes! Pause for up to 7 days per month with any plan, anytime from your dashboard." },
              { q: "What areas do you deliver to?", a: "Currently Lucknow city. We're expanding to Kanpur and Varanasi soon." },
              { q: "How fresh is the food?", a: "Every meal is cooked fresh the same morning by verified home cooks. No reheating." },
              { q: "Can I change my plan later?", a: "Absolutely. Upgrade or downgrade your plan anytime from your dashboard." },
            ].map((f) => (
              <div className="faq-item" key={f.q}>
                <div className="faq-q">{f.q}</div>
                <div className="faq-a">{f.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
