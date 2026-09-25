import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useBooks } from "../../context/BookContext";
import { LogIn, User, Mail, Lock, Shield, KeyRound, AlertCircle, Sparkles, X, CheckCircle2 } from "lucide-react";

export const LoginPage = () => {
  const { login, loading } = useAuth();
  const { showToast } = useBooks();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    name: "Amay Patel",
    email: "amay@bookbase.com",
    password: "password123",
    role: "User"
  });

  const [error, setError] = useState("");
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleRoleChange = (role) => {
    setFormData((prev) => ({ ...prev, role }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validations per specification:
    // "Validation - a. Login: Name is required, email is required, role is required"
    if (!formData.name.trim()) {
      setError("Name is required.");
      return;
    }
    if (!formData.email.trim()) {
      setError("Email is required.");
      return;
    }
    if (!formData.role) {
      setError("Role is required.");
      return;
    }
    if (!formData.password) {
      setError("Password is required.");
      return;
    }

    const res = await login(formData);

    if (res.success) {
      showToast(`Welcome back, ${res.user.name}!`, "success");

      // Redirect according to user role:
      // "User -> User Dashboard, Admin -> Admin Dashboard"
      const targetPath =
        res.role.toLowerCase() === "admin" ? "/admin/dashboard" : "/dashboard";

      navigate(targetPath, { replace: true });
    } else {
      setError(res.error || "Login failed.");
    }
  };

  // Demo auto-fill helpers
  const fillAsUser = () => {
    setFormData({
      name: "Amay Patel",
      email: "amay@bookbase.com",
      password: "password123",
      role: "User"
    });
    setError("");
  };

  const fillAsAdmin = () => {
    setFormData({
      name: "Suraj Sharma",
      email: "admin@bookbase.com",
      password: "password123",
      role: "Admin"
    });
    setError("");
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotSubmitted(true);
    setTimeout(() => {
      showToast(`A password reset link was dispatched to ${forgotEmail}`, "info");
      setShowForgotModal(false);
      setForgotSubmitted(false);
      setForgotEmail("");
    }, 1500);
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <div className="brand-icon-wrapper" style={{ margin: "0 auto 1rem" }}>
            <LogIn size={22} />
          </div>
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Sign in with your BookBase credentials to access your library account.</p>
        </div>

        {/* Demo Fast-Fill Bar */}
        <div className="demo-credentials-box">
          <div className="demo-credentials-title">
            <Sparkles size={14} /> Quick Demo Logins:
          </div>
          <div className="demo-buttons-row">
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={fillAsUser}
              style={{ flex: 1, fontSize: "0.78rem" }}
            >
              Fill as User (Amay)
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={fillAsAdmin}
              style={{ flex: 1, fontSize: "0.78rem" }}
            >
              Fill as Admin (Suraj)
            </button>
          </div>
        </div>

        {error && (
          <div
            className="badge badge-danger"
            style={{
              width: "100%",
              padding: "0.75rem 1rem",
              borderRadius: "var(--radius-md)",
              marginBottom: "1.25rem",
              textTransform: "none",
              fontSize: "0.85rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem"
            }}
          >
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Role selector */}
          <div className="form-group">
            <label className="form-label">
              <span>Sign In Role *</span>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                Required validation
              </span>
            </label>
            <div className="role-toggle-group">
              <button
                type="button"
                className={`role-toggle-btn ${formData.role === "User" ? "active" : ""}`}
                onClick={() => handleRoleChange("User")}
              >
                <User size={16} /> Member (User)
              </button>
              <button
                type="button"
                className={`role-toggle-btn ${formData.role === "Admin" ? "active" : ""}`}
                onClick={() => handleRoleChange("Admin")}
              >
                <Shield size={16} /> Librarian (Admin)
              </button>
            </div>
          </div>

          {/* Name field (specifically required per spec) */}
          <div className="form-group">
            <label className="form-label" htmlFor="name">
              Name *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className="form-input"
              placeholder="e.g. Amay Patel"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Email */}
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email Address *
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="form-input"
              placeholder="e.g. amay@bookbase.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <div className="form-label">
              <label htmlFor="password">Password *</label>
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--primary-600)",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  cursor: "pointer"
                }}
              >
                Forgot Password?
              </button>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              className="form-input"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            style={{ width: "100%", marginTop: "1rem" }}
            disabled={loading}
          >
            {loading ? "Authenticating..." : "Sign In"}
          </button>
        </form>

        <div style={{ marginTop: "1.75rem", textAlign: "center", fontSize: "0.9rem", color: "var(--text-muted)" }}>
          Don't have an account?{" "}
          <Link to="/register" style={{ fontWeight: 600, color: "var(--primary-600)" }}>
            Sign Up
          </Link>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="modal-overlay" onClick={() => setShowForgotModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <KeyRound size={20} color="var(--primary-600)" /> Reset Account Password
              </h3>
              <button className="modal-close-btn" onClick={() => setShowForgotModal(false)}>
                <X size={18} />
              </button>
            </div>

            <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginBottom: "1.25rem" }}>
              Enter your registered email address and we'll send you instructions to reset your password.
            </p>

            <form onSubmit={handleForgotSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="forgotEmail">
                  Registered Email Address
                </label>
                <input
                  id="forgotEmail"
                  type="email"
                  className="form-input"
                  placeholder="e.g. user@bookbase.com"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1.5rem" }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowForgotModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={forgotSubmitted}
                >
                  {forgotSubmitted ? "Sending link..." : "Send Reset Link"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
