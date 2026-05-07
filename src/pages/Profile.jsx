import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useForm, rules } from "../hooks/useForm";
import InputField from "../components/InputField";
import "./Profile.css";

export default function Profile() {
  const { user, getProfile, updateProfile, changePassword } = useAuth();

  const [activeTab, setActiveTab]   = useState("profile");
  const [loading, setLoading]       = useState(true);
  const [saving, setSaving]         = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg]     = useState("");

  // ── Profile form ──
  const profileForm = useForm(
    { name: "", phone: "", address: "", city: "", pincode: "" },
    {
      name:  rules.required("Name"),
      phone: rules.phone(),
    }
  );

  // ── Password form ──
  const passForm = useForm(
    { currentPassword: "", newPassword: "", confirmPassword: "" },
    {
      currentPassword: rules.minLength(6, "Current password"),
      newPassword:     rules.minLength(8, "New password"),
      confirmPassword: rules.matchField("newPassword", "Passwords"),
    }
  );

  // ── Load real profile on mount ──
  useEffect(() => {
    async function fetchProfile() {
      try {
        const data = await getProfile();
        if (data.success) {
          // Fill form with real data from MongoDB
          profileForm.handleChange({ target: { name: "name",    value: data.user.name    || "" } });
          profileForm.handleChange({ target: { name: "phone",   value: data.user.phone   || "" } });
          profileForm.handleChange({ target: { name: "address", value: data.user.address || "" } });
          profileForm.handleChange({ target: { name: "city",    value: data.user.city    || "" } });
          profileForm.handleChange({ target: { name: "pincode", value: data.user.pincode || "" } });
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  // ── Save profile ──
  async function handleSaveProfile(e) {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");
    if (!profileForm.validate()) return;

    setSaving(true);
    try {
      const result = await updateProfile(profileForm.values);
      if (result.success) {
        setSuccessMsg("✓ Profile updated successfully!");
      } else {
        setErrorMsg(result.message || "Failed to update profile.");
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  // ── Change password ──
  async function handleChangePassword(e) {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");
    if (!passForm.validate()) return;

    setSaving(true);
    try {
      const result = await changePassword({
        currentPassword: passForm.values.currentPassword,
        newPassword:     passForm.values.newPassword,
      });
      if (result.success) {
        setSuccessMsg("✓ Password changed successfully!");
        passForm.reset();
      } else {
        setErrorMsg(result.message || "Failed to change password.");
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="profile-page page-fade-in">
      <div className="container">

        {/* ── Header ── */}
        <div className="profile-header">
          <div className="profile-avatar">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <h1 className="profile-title">{user?.name}</h1>
            <p className="profile-sub">
              {user?.email} &nbsp;·&nbsp;
              <span className={`role-tag ${user?.role}`}>
                {user?.role === "cook" ? "👨‍🍳 Cook" : "🍽 Customer"}
              </span>
            </p>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="tab-nav">
          {[
            { key: "profile",  label: "👤 Edit Profile" },
            { key: "password", label: "🔒 Change Password" },
          ].map((t) => (
            <button
              key={t.key}
              className={`tab-btn ${activeTab === t.key ? "active" : ""}`}
              onClick={() => {
                setActiveTab(t.key);
                setSuccessMsg("");
                setErrorMsg("");
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ── Messages ── */}
        {successMsg && <div className="success-msg">{successMsg}</div>}
        {errorMsg   && <div className="error-msg">⚠ {errorMsg}</div>}

        {/* ══════════════════
            TAB — EDIT PROFILE
        ══════════════════ */}
        {activeTab === "profile" && (
          <div className="profile-form-wrap">
            {loading ? (
              <div className="loading-msg">Loading profile...</div>
            ) : (
              <form onSubmit={handleSaveProfile} noValidate>
                <div className="form-grid">
                  <InputField
                    label="Full name"
                    name="name"
                    placeholder="Rahul Sharma"
                    icon="👤"
                    value={profileForm.values.name}
                    onChange={profileForm.handleChange}
                    onBlur={profileForm.handleBlur}
                    error={profileForm.errors.name}
                    touched={profileForm.touched.name}
                  />
                  <InputField
                    label="Mobile number"
                    name="phone"
                    type="tel"
                    placeholder="9876543210"
                    icon="📱"
                    value={profileForm.values.phone}
                    onChange={profileForm.handleChange}
                    onBlur={profileForm.handleBlur}
                    error={profileForm.errors.phone}
                    touched={profileForm.touched.phone}
                  />
                </div>

                <div className="form-section-title">📍 Delivery Address</div>

                <InputField
                  label="Street address"
                  name="address"
                  placeholder="B-14, Near Park, Hazratganj"
                  icon="🏠"
                  value={profileForm.values.address}
                  onChange={profileForm.handleChange}
                  onBlur={profileForm.handleBlur}
                  error={profileForm.errors.address}
                  touched={profileForm.touched.address}
                />

                <div className="form-grid">
                  <InputField
                    label="City"
                    name="city"
                    placeholder="Lucknow"
                    icon="🏙"
                    value={profileForm.values.city}
                    onChange={profileForm.handleChange}
                    onBlur={profileForm.handleBlur}
                    error={profileForm.errors.city}
                    touched={profileForm.touched.city}
                  />
                  <InputField
                    label="Pincode"
                    name="pincode"
                    placeholder="226001"
                    icon="📮"
                    value={profileForm.values.pincode}
                    onChange={profileForm.handleChange}
                    onBlur={profileForm.handleBlur}
                    error={profileForm.errors.pincode}
                    touched={profileForm.touched.pincode}
                  />
                </div>

                <button
                  type="submit"
                  className="save-btn"
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save profile →"}
                </button>
              </form>
            )}
          </div>
        )}

        {/* ══════════════════
            TAB — CHANGE PASSWORD
        ══════════════════ */}
        {activeTab === "password" && (
          <div className="profile-form-wrap">
            <form onSubmit={handleChangePassword} noValidate>
              <div className="form-fields-col">
                <InputField
                  label="Current password"
                  name="currentPassword"
                  type="password"
                  placeholder="Enter current password"
                  icon="🔒"
                  value={passForm.values.currentPassword}
                  onChange={passForm.handleChange}
                  onBlur={passForm.handleBlur}
                  error={passForm.errors.currentPassword}
                  touched={passForm.touched.currentPassword}
                />
                <InputField
                  label="New password"
                  name="newPassword"
                  type="password"
                  placeholder="Minimum 8 characters"
                  icon="🔑"
                  value={passForm.values.newPassword}
                  onChange={passForm.handleChange}
                  onBlur={passForm.handleBlur}
                  error={passForm.errors.newPassword}
                  touched={passForm.touched.newPassword}
                />
                <InputField
                  label="Confirm new password"
                  name="confirmPassword"
                  type="password"
                  placeholder="Re-enter new password"
                  icon="🔑"
                  value={passForm.values.confirmPassword}
                  onChange={passForm.handleChange}
                  onBlur={passForm.handleBlur}
                  error={passForm.errors.confirmPassword}
                  touched={passForm.touched.confirmPassword}
                />
              </div>

              <button
                type="submit"
                className="save-btn"
                disabled={saving}
              >
                {saving ? "Changing..." : "Change password →"}
              </button>
            </form>
          </div>
        )}

      </div>
    </main>
  );
}