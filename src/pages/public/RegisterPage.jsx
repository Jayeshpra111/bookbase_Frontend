import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useBooks } from "../../context/BookContext";
import { User, Mail, Globe, Lock, Shield, UserCheck, AlertCircle, ArrowRight } from "lucide-react";

export const RegisterPage = () => {
  const { register, loading } = useAuth();
  const { showToast } = useBooks();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    country: "India",
    role: "User",
    password: "",
    confirmPassword: ""
  });

  const [error, setError] = useState("");

  const countries = [
    "India",
    "United States",
    "United Kingdom",
    "Canada",
    "Australia",
    "Germany",
    "Singapore",
    "Japan",
    "United Arab Emirates",
    "Other"
  ];

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

    // Validations
    if (!formData.name.trim()) {
      setError("Name is required.");
      return;
    }
    if (!formData.email.trim()) {
      setError("Email is required.");
      return;
    }
    if (!formData.country.trim()) {
      setError("Country is required.");
      return;
    }
    if (!formData.role) {
      setError("Role (User or Admin) is required.");
      return;
    }
    if (!formData.password) {
      setError("Password is required.");
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match. Please verify.");
      return;
    }

    const res = await register(formData);

    if (res.success) {
      showToast(`Welcome to BookBase, ${res.user.name}! Registered as ${res.role}.`, "success");
      // Direct redirect based on specification:
      // "if user select role 'user' during registration..they will proceed with user dashboard
      // and if user select role 'Admin' during registration they will proceed with admin dashboard"
      if (res.role.toLowerCase() === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/dashboard");
      }
    } else {
      setError(res.error || "Registration failed.");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <div className="brand-icon-wrapper" style={{ margin: "0 auto 1rem" }}>
            <UserCheck size={22} />
          </div>
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Register to borrow books, track loans, or manage the library catalog.</p>
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
          {/* Role Selection */}
          <div className="form-group">
            <label className="form-label">
              <span>Select Account Role *</span>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                Determines dashboard access
              </span>
            </label>
            <div className="role-toggle-group">
              <button
                type="button"
                className={`role-toggle-btn ${formData.role === "User" ? "active" : ""}`}
                onClick={() => handleRoleChange("User")}
              >
                <User size={16} /> Library Member (User)
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

          {/* Full Name */}
          <div className="form-group">
            <label className="form-label" htmlFor="name">
              Full Name *
            </label>
            <div style={{ position: "relative" }}>
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
          </div>

          {/* Email Address */}
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

          {/* Country */}
          <div className="form-group">
            <label className="form-label" htmlFor="country">
              Country *
            </label>
            <select
              id="country"
              name="country"
              className="form-select"
              value={formData.country}
              onChange={handleChange}
              required
            >
              {countries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Password & Confirm Password */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div className="form-group">
              <label className="form-label" htmlFor="password">
                Password *
              </label>
              <input
                id="password"
                name="password"
                type="password"
                className="form-input"
                placeholder="Min 6 characters"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="confirmPassword">
                Confirm Password *
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                className="form-input"
                placeholder="Re-type password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            style={{ width: "100%", marginTop: "1rem" }}
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Register Now"} <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ marginTop: "1.75rem", textAlign: "center", fontSize: "0.9rem", color: "var(--text-muted)" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ fontWeight: 600, color: "var(--primary-600)" }}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
