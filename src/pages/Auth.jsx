import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useForm, rules } from "../hooks/useForm";
import InputField from "../components/InputField";
import "./Auth.css";

export default function Auth() {
  const [mode, setMode]             = useState("login");
  const [loading, setLoading]       = useState(false);
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { login, signup }   = useAuth();
  const navigate            = useNavigate();
  const location            = useLocation();
  const redirectTo          = location.state?.from?.pathname || "/dashboard";

  const loginForm = useForm(
    { email: "", password: "" },
    { email: rules.email(), password: rules.minLength(6, "Password") }
  );

  const signupForm = useForm(
    { name: "", email: "", phone: "", password: "", confirmPassword: "", role: "customer" },
    {
      name:            rules.required("Name"),
      email:           rules.email(),
      phone:           rules.phone(),
      password:        rules.minLength(8, "Password"),
      confirmPassword: rules.matchField("password", "Passwords"),
    }
  );

  const activeForm = mode === "login" ? loginForm : signupForm;

  async function handleSubmit(e) {
    e.preventDefault();
    setServerError("");
    if (!activeForm.validate()) return;
    setLoading(true);
    try {
      let result;
      if (mode === "login") {
        result = await login({ email: loginForm.values.email, password: loginForm.values.password });
      } else {
        result = await signup({
          name: signupForm.values.name, email: signupForm.values.email,
          phone: signupForm.values.phone, password: signupForm.values.password,
          role: signupForm.values.role,
        });
      }
      if (result.success) {
        navigate(result.user.role === "cook" ? "/cook" : redirectTo, { replace: true });
      } else {
        setServerError(result.error || "Something went wrong.");
      }
    } catch {
      setServerError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }

  function switchMode(newMode) {
    setMode(newMode);
    setServerError("");
    loginForm.reset();
    signupForm.reset();
  }

  return (
    <main className="auth-page page-fade-in">
      <div className="auth-left">
        <div className="auth-left-inner">
          <Link to="/" className="auth-brand">
            <span>🍱</span>
            <span className="auth-brand-text">BHOJAN</span>
          </Link>
          <div className="auth-quote">
            <p className="quote-text">"Ghar ka khana khao,<br />sehat banao."</p>
            <p className="quote-sub">Fresh tiffin delivered daily by verified home cooks.</p>
          </div>
          <ul className="auth-features">
            {["🏠 Home-cooked meals every day","📅 Skip days anytime",
              "✏️ Customise your tiffin","🚴 Free delivery within 5km",
              "⭐ 4.8 rated by 2,400+ subscribers"].map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-form-wrap">
          <div className="auth-tabs">
            <button className={`auth-tab ${mode === "login" ? "active" : ""}`} onClick={() => switchMode("login")}>Login</button>
            <button className={`auth-tab ${mode === "signup" ? "active" : ""}`} onClick={() => switchMode("signup")}>Sign Up</button>
          </div>

          <h2 className="auth-title">{mode === "login" ? "Welcome back 👋" : "Create your account"}</h2>
          <p className="auth-sub">{mode === "login" ? "Log in to manage your tiffin." : "Start your tiffin journey today."}</p>

          {serverError && <div className="auth-server-error">⚠ {serverError}</div>}

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-fields">
              {mode === "signup" && (
                <>
                  <InputField label="Full name" name="name" placeholder="Rahul Sharma" icon="👤"
                    value={signupForm.values.name} onChange={signupForm.handleChange}
                    onBlur={signupForm.handleBlur} error={signupForm.errors.name} touched={signupForm.touched.name} />
                  <InputField label="Mobile number" name="phone" type="tel" placeholder="9876543210" icon="📱"
                    value={signupForm.values.phone} onChange={signupForm.handleChange}
                    onBlur={signupForm.handleBlur} error={signupForm.errors.phone} touched={signupForm.touched.phone}
                    hint="10-digit Indian mobile number" />
                  <div className="role-group">
                    <label className="input-label">I am a</label>
                    <div className="role-options">
                      {[{ value: "customer", label: "🍽 Customer", desc: "I want tiffin" },
                        { value: "cook", label: "👨‍🍳 Cook", desc: "I provide tiffin" }].map((r) => (
                        <button key={r.value} type="button"
                          className={`role-btn ${signupForm.values.role === r.value ? "selected" : ""}`}
                          onClick={() => signupForm.handleChange({ target: { name: "role", value: r.value } })}>
                          <span className="role-label">{r.label}</span>
                          <span className="role-desc">{r.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <InputField label="Email address" name="email" type="email" placeholder="rahul@example.com" icon="✉️"
                value={activeForm.values.email} onChange={activeForm.handleChange}
                onBlur={activeForm.handleBlur} error={activeForm.errors.email} touched={activeForm.touched.email} />

              <div className="password-group">
                <InputField label="Password" name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={mode === "signup" ? "Minimum 8 characters" : "Enter your password"} icon="🔒"
                  value={activeForm.values.password} onChange={activeForm.handleChange}
                  onBlur={activeForm.handleBlur} error={activeForm.errors.password} touched={activeForm.touched.password} />
                <button type="button" className="show-pass-btn" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              {mode === "signup" && (
                <InputField label="Confirm password" name="confirmPassword"
                  type={showPassword ? "text" : "password"} placeholder="Re-enter your password" icon="🔒"
                  value={signupForm.values.confirmPassword} onChange={signupForm.handleChange}
                  onBlur={signupForm.handleBlur} error={signupForm.errors.confirmPassword}
                  touched={signupForm.touched.confirmPassword} />
              )}
            </div>

            {mode === "login" && (
              <div className="forgot-row">
                <button type="button" className="forgot-btn">Forgot password?</button>
              </div>
            )}

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? (
                <span className="loading-dots"><span /><span /><span /></span>
              ) : mode === "login" ? "Login to BHOJAN →" : "Create my account →"}
            </button>

            {mode === "signup" && (
              <p className="auth-terms">By signing up you agree to BHOJAN's <span className="terms-link">Terms</span> and <span className="terms-link">Privacy Policy</span>.</p>
            )}
          </form>

          <p className="auth-switch">
            {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
            <button className="switch-btn" onClick={() => switchMode(mode === "login" ? "signup" : "login")}>
              {mode === "login" ? "Sign up free" : "Login"}
            </button>
          </p>
        </div>
      </div>
    </main>
  );
}