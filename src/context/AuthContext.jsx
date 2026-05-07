import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

const API = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  // ── On app load — check if user was already logged in ──
  useEffect(() => {
    const token     = localStorage.getItem("bhojan_token");
    const savedUser = localStorage.getItem("bhojan_user");
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // ── Signup ──
  async function signup({ name, email, phone, password, role }) {
    const res  = await fetch(`${API}/auth/signup`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ name, email, phone, password, role }),
    });
    const data = await res.json();
    if (data.success) {
      localStorage.setItem("bhojan_token", data.token);
      localStorage.setItem("bhojan_user",  JSON.stringify(data.user));
      setUser(data.user);
    }
    return data;
  }

  // ── Login ──
  async function login({ email, password }) {
    const res  = await fetch(`${API}/auth/login`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (data.success) {
      localStorage.setItem("bhojan_token", data.token);
      localStorage.setItem("bhojan_user",  JSON.stringify(data.user));
      setUser(data.user);
    }
    return data;
  }

  // ── Logout ──
  function logout() {
    localStorage.removeItem("bhojan_token");
    localStorage.removeItem("bhojan_user");
    setUser(null);
  }

  // ── Get token ──
  function getToken() {
    return localStorage.getItem("bhojan_token");
  }

  // ── Subscribe to a plan ──
  async function subscribe({ plan, period }) {
    const token = localStorage.getItem("bhojan_token");
    const res   = await fetch(`${API}/subscription/subscribe`, {
      method:  "POST",
      headers: {
        "Content-Type":  "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ plan, period }),
    });
    const data = await res.json();
    return data;
  }

  // ── Get my subscription ──
  async function getSubscription() {
    const token = localStorage.getItem("bhojan_token");
    const res   = await fetch(`${API}/subscription/my`, {
      headers: { "Authorization": `Bearer ${token}` },
    });
    const data = await res.json();
    return data;
  }

  // ── Get my orders (customer) ──
  async function getMyOrders() {
    const token = localStorage.getItem("bhojan_token");
    const res   = await fetch(`${API}/orders/my`, {
      headers: { "Authorization": `Bearer ${token}` },
    });
    const data = await res.json();
    return data;
  }

  // ── Get today's orders (cook) ──
  async function getTodayOrders() {
    const token = localStorage.getItem("bhojan_token");
    const res   = await fetch(`${API}/orders/today`, {
      headers: { "Authorization": `Bearer ${token}` },
    });
    const data = await res.json();
    return data;
  }

  // ── Get full profile ──
async function getProfile() {
  const token = localStorage.getItem("bhojan_token");
  const res   = await fetch(`${API}/profile/me`, {
    headers: { "Authorization": `Bearer ${token}` },
  });
  const data = await res.json();
  return data;
}

// ── Update profile ──
async function updateProfile({ name, phone, address, city, pincode }) {
  const token = localStorage.getItem("bhojan_token");
  const res   = await fetch(`${API}/profile/update`, {
    method:  "PATCH",
    headers: {
      "Content-Type":  "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({ name, phone, address, city, pincode }),
  });
  const data = await res.json();

  // Update localStorage with new name
  if (data.success) {
    const savedUser = JSON.parse(localStorage.getItem("bhojan_user"));
    savedUser.name  = data.user.name;
    localStorage.setItem("bhojan_user", JSON.stringify(savedUser));
    setUser((prev) => ({ ...prev, name: data.user.name }));
  }

  return data;
}

// ── Change password ──
async function changePassword({ currentPassword, newPassword }) {
  const token = localStorage.getItem("bhojan_token");
  const res   = await fetch(`${API}/profile/change-password`, {
    method:  "PATCH",
    headers: {
      "Content-Type":  "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({ currentPassword, newPassword }),
  });
  const data = await res.json();
  return data;
}

// ── Get today's order for tracker ──
async function getTodayTracker() {
  const token = localStorage.getItem("bhojan_token");
  const res   = await fetch(`${API}/orders/tracker`, {
    headers: { "Authorization": `Bearer ${token}` },
  });
  const data = await res.json();
  return data;
}

// ── Save preferences ──
async function savePreferences({ diet, portion, allergies, skipDays }) {
  const token = localStorage.getItem("bhojan_token");
  const res   = await fetch(`${API}/profile/preferences`, {
    method:  "PATCH",
    headers: {
      "Content-Type":  "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({ diet, portion, allergies, skipDays }),
  });
  const data = await res.json();
  return data;
}

// ── Get preferences ──
async function getPreferences() {
  const token = localStorage.getItem("bhojan_token");
  const res   = await fetch(`${API}/profile/preferences`, {
    headers: { "Authorization": `Bearer ${token}` },
  });
  const data = await res.json();
  return data;
}

  // ── Skip a day ──
async function skipDay(date) {
  const token = localStorage.getItem("bhojan_token");
  const res   = await fetch(`${API}/orders/skip-day`, {
    method:  "POST",
    headers: {
      "Content-Type":  "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({ date }),
  });
  const data = await res.json();
  return data;
}

// ── Get skipped days ──
async function getSkippedDays() {
  const token = localStorage.getItem("bhojan_token");
  const res   = await fetch(`${API}/orders/skip-days`, {
    headers: { "Authorization": `Bearer ${token}` },
  });
  const data = await res.json();
  return data;
}

// ── Update order status ──
  async function updateOrderStatus(orderId, status) {
    const token = localStorage.getItem("bhojan_token");
    const res   = await fetch(`${API}/orders/${orderId}/status`, {
      method:  "PATCH",
      headers: {
        "Content-Type":  "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    return data;
  }

  if (loading) return null;

  return (
    <AuthContext.Provider value={{
  user,
  login,
  signup,
  logout,
  getToken,
  subscribe,
  getSubscription,
  getMyOrders,
  getTodayOrders,
  updateOrderStatus,
  getProfile,
  updateProfile,
  changePassword,
  skipDay,
  getSkippedDays,
  savePreferences,
  getPreferences,
  getTodayTracker,
}}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}