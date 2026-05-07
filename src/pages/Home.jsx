import { useNavigate } from "react-router-dom";
import { STATS, TESTIMONIALS, MENU_ITEMS } from "../data/plans";
import "./Home.css";

/* ── How It Works steps ── */
const HOW_STEPS = [
  { icon: "🎯", title: "Pick your plan", desc: "Choose from Basic, Double Decker, or Family Pack. Weekly or monthly." },
  { icon: "✏️", title: "Customise (optional)", desc: "Add the Custom add-on to set allergies, skip days, or change portions." },
  { icon: "🚴", title: "We deliver fresh", desc: "Hot tiffin at your door. Verified home cooks. Every single day." },
  { icon: "😊", title: "Enjoy & repeat", desc: "Pause, skip, or upgrade anytime. Your tiffin, your rules." },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <main className="home page-fade-in">

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-blob blob-1" />
        <div className="hero-blob blob-2" />
        <div className="container hero-inner">
          <div className="hero-text">
            <div className="section-tag">🏠 Home-cooked tiffin service</div>
            <h1 className="hero-title">
              Ghar jaisa khana,<br />
              <span className="hero-highlight">roz aapke paas</span>
            </h1>
            <p className="hero-sub">
              Skip the cooking, skip the junk food. BHOJAN delivers fresh, home-style
              tiffin meals to working professionals and students — daily.
            </p>
            <div className="hero-actions">
              <button className="btn-primary hero-cta" onClick={() => navigate("/plans")}>
                See Plans &amp; Pricing →
              </button>
              <button className="btn-outline" onClick={() => navigate("/dashboard")}>
                View Dashboard
              </button>
            </div>
            <div className="hero-chips">
              {MENU_ITEMS.slice(0, 4).map((m) => (
                <span key={m.label} className="hero-chip">
                  {m.emoji} {m.label}
                </span>
              ))}
            </div>
          </div>

          <div className="hero-card-wrap">
            <div className="hero-card">
              <div className="hc-label">Today's Lunch</div>
              <div className="hc-items">
                {MENU_ITEMS.map((m) => (
                  <div key={m.label} className="hc-item">
                    <span>{m.emoji}</span>
                    <span>{m.label}</span>
                  </div>
                ))}
              </div>
              <div className="hc-badge">🚴 Arriving at 12:30 PM</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="stats-bar">
        <div className="container stats-inner">
          {STATS.map((s) => (
            <div key={s.label} className="stat-item">
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="how-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Simple process</span>
            <h2 className="section-title">How BHOJAN works</h2>
            <p className="section-sub">4 steps to never worrying about food again</p>
          </div>
          <div className="how-grid">
            {HOW_STEPS.map((step, i) => (
              <div className="how-card" key={i}>
                <div className="how-num">0{i + 1}</div>
                <div className="how-icon">{step.icon}</div>
                <div className="how-title">{step.title}</div>
                <div className="how-desc">{step.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CUSTOM ADD-ON BANNER ── */}
      <section className="custom-section">
        <div className="container">
          <div className="custom-banner">
            <div className="custom-icon">✏️</div>
            <div className="custom-text">
              <h3 className="custom-title">Aapki Marzi — Custom Tiffin</h3>
              <p className="custom-desc">
                Skip dal on Tuesdays? Need extra roti? Allergic to something?
                Add our <strong>Custom add-on</strong> to any plan and set your exact preferences —
                dietary needs, portion sizes, skip days.
              </p>
            </div>
            <button className="btn-primary" onClick={() => navigate("/plans")}>
              Explore Plans →
            </button>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Real subscribers</span>
            <h2 className="section-title">What our customers say</h2>
          </div>
          <div className="testi-grid">
            {TESTIMONIALS.map((t) => (
              <div className="testi-card" key={t.name}>
                <div className="testi-header">
                  <div className="testi-avatar">{t.avatar}</div>
                  <div>
                    <div className="testi-name">{t.name}</div>
                    <div className="testi-role">{t.role}</div>
                  </div>
                  <span className="testi-plan">{t.plan}</span>
                </div>
                <p className="testi-text">"{t.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="final-cta">
        <div className="container final-inner">
          <h2 className="final-title">Ready for ghar ka khana?</h2>
          <p className="final-sub">Start with a weekly plan. Cancel anytime.</p>
          <button className="btn-primary final-btn" onClick={() => navigate("/plans")}>
            View All Plans →
          </button>
        </div>
      </section>
    </main>
  );
}
