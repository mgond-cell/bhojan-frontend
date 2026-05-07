import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location  = useLocation();
  const navigate  = useNavigate();
  const { user, logout } = useAuth();

  const navLinks = user ? [
  { label: "Home",         path: "/" },
  { label: "Plans",        path: "/plans" },
  { label: "My Dashboard", path: "/dashboard" },
  { label: "My Profile",   path: "/profile" },
] : [
  { label: "Home",         path: "/" },
  { label: "Plans",        path: "/plans" },
];
  function handleLogout() {
    logout();
    navigate("/");
    setMenuOpen(false);
  }

  return (
    <nav className="navbar">
      <div className="navbar-inner container">
        <Link to="/" className="navbar-brand">
          <span className="brand-emoji">🍱</span>
          <span className="brand-text">BHOJAN</span>
        </Link>
        <ul className="navbar-links">
          {navLinks.map((l) => (
            <li key={l.path}>
              <Link to={l.path} className={`nav-link ${location.pathname === l.path ? "active" : ""}`}>
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="navbar-cta">
          {user ? (
            <div className="user-pill">
              <div className="user-avatar">{user.name?.[0]?.toUpperCase()}</div>
              <span className="user-name">{user.name}</span>
              <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <button className="btn-primary" onClick={() => navigate("/login")}>Login / Sign Up</button>
          )}
        </div>
        <button className={`hamburger ${menuOpen ? "open" : ""}`} onClick={() => setMenuOpen(!menuOpen)}>
          <span /><span /><span />
        </button>
      </div>
      {menuOpen && (
        <div className="mobile-menu">
          {navLinks.map((l) => (
            <Link key={l.path} to={l.path} className="mobile-link" onClick={() => setMenuOpen(false)}>{l.label}</Link>
          ))}
          {user ? (
            <button className="logout-btn-mobile" onClick={handleLogout}>Logout ({user.name})</button>
          ) : (
            <button className="btn-primary" style={{ marginTop: "12px", width: "100%", justifyContent: "center" }}
              onClick={() => { navigate("/login"); setMenuOpen(false); }}>
              Login / Sign Up
            </button>
          )}
        </div>
      )}
    </nav>
  );
}