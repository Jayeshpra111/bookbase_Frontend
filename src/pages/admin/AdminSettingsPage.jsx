import React, { useState } from "react";
import { useBooks } from "../../context/BookContext";
import {
  Settings,
  Users,
  Building,
  Save,
  RotateCcw,
  CheckCircle,
  Clock,
  ShieldAlert,
  GraduationCap
} from "lucide-react";

export const AdminSettingsPage = () => {
  const { settings, updateSettings, resetAllData } = useBooks();

  const [form, setForm] = useState({ ...settings });
  const [activeTab, setActiveTab] = useState("library"); // "library", "users"

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateSettings({
      ...form,
      loanDurationDays: parseInt(form.loanDurationDays, 10),
      maxBooksPerUser: parseInt(form.maxBooksPerUser, 10),
      overdueFinePerDay: parseFloat(form.overdueFinePerDay)
    });
  };

  return (
    <div className="container" style={{ padding: "2.5rem 1.5rem" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem", marginBottom: "2rem" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.4rem" }}>
            <span className="badge badge-danger">Suraj's Admin Module</span>
            <span className="badge badge-primary">System Config</span>
          </div>
          <h1 className="section-title">System Settings</h1>
          <p className="section-subtitle">
            Configure library borrowing limits, automated return policies, and user registration rules.
          </p>
        </div>
      </div>

      {/* Tabs: User Settings / Library Settings */}
      <div style={{ display: "flex", gap: "0.5rem", borderBottom: "1px solid var(--border-light)", marginBottom: "2rem" }}>
        <button
          onClick={() => setActiveTab("library")}
          className={`category-pill ${activeTab === "library" ? "active" : ""}`}
        >
          <Building size={16} /> Library Settings
        </button>

        <button
          onClick={() => setActiveTab("users")}
          className={`category-pill ${activeTab === "users" ? "active" : ""}`}
        >
          <Users size={16} /> User Settings
        </button>
      </div>

      <form onSubmit={handleSave}>
        {/* Tab 1: Library Settings */}
        {activeTab === "library" && (
          <div className="card" style={{ maxWidth: "700px" }}>
            <h2 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>Library Rules & Operational Policies</h2>
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "1.5rem" }}>
              Control standard checkout duration, overdue calculations, and automatic return automation.
            </p>

            <div className="form-group">
              <label className="form-label" htmlFor="libraryName">Library System Name</label>
              <input
                id="libraryName"
                name="libraryName"
                type="text"
                className="form-input"
                value={form.libraryName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="institution">Classroom Code / Institution Tag</label>
              <input
                id="institution"
                name="institution"
                type="text"
                className="form-input"
                value={form.institution}
                onChange={handleChange}
                placeholder="cwvy2yza"
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div className="form-group">
                <label className="form-label" htmlFor="loanDurationDays">Standard Loan Duration (Days) *</label>
                <input
                  id="loanDurationDays"
                  name="loanDurationDays"
                  type="number"
                  min="1"
                  max="60"
                  className="form-input"
                  value={form.loanDurationDays}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="overdueFinePerDay">Daily Overdue Penalty Rate ($/day)</label>
                <input
                  id="overdueFinePerDay"
                  name="overdueFinePerDay"
                  type="number"
                  step="0.5"
                  min="0"
                  className="form-input"
                  value={form.overdueFinePerDay}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="contactEmail">Librarian Support Email</label>
              <input
                id="contactEmail"
                name="contactEmail"
                type="email"
                className="form-input"
                value={form.contactEmail}
                onChange={handleChange}
                required
              />
            </div>

            {/* Auto-Return Overdue Books Toggle (Page 2 & Page 5 spec) */}
            <div
              style={{
                background: "var(--bg-surface-secondary)",
                borderRadius: "var(--radius-md)",
                padding: "1rem",
                marginTop: "1rem",
                marginBottom: "1.5rem"
              }}
            >
              <label style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  name="autoReturnOverdue"
                  checked={form.autoReturnOverdue}
                  onChange={handleChange}
                  style={{ width: "18px", height: "18px", marginTop: "2px" }}
                />
                <div>
                  <div style={{ fontWeight: 600, fontSize: "0.95rem" }}>
                    Enable Automatic Return on Due Date
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
                    Per specification: <em>"Borrow/return Book (if due date reached return automatically)"</em>.
                    When enabled, books that exceed their loan duration are automatically checked back into inventory.
                  </div>
                </div>
              </label>
            </div>

            <button type="submit" className="btn btn-primary">
              <Save size={16} /> Save Library Settings
            </button>
          </div>
        )}

        {/* Tab 2: User Settings */}
        {activeTab === "users" && (
          <div className="card" style={{ maxWidth: "700px" }}>
            <h2 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>Student & Member Account Policies</h2>
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "1.5rem" }}>
              Configure member borrow limits and registration onboarding privileges.
            </p>

            <div className="form-group">
              <label className="form-label" htmlFor="maxBooksPerUser">
                Maximum Active Borrowings Per Student *
              </label>
              <input
                id="maxBooksPerUser"
                name="maxBooksPerUser"
                type="number"
                min="1"
                max="20"
                className="form-input"
                value={form.maxBooksPerUser}
                onChange={handleChange}
                required
              />
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                Students cannot check out new books if they have reached this threshold.
              </span>
            </div>

            <div
              style={{
                background: "var(--bg-surface-secondary)",
                borderRadius: "var(--radius-md)",
                padding: "1rem",
                marginTop: "1.25rem",
                marginBottom: "1.5rem"
              }}
            >
              <label style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  name="allowRegistration"
                  checked={form.allowRegistration}
                  onChange={handleChange}
                  style={{ width: "18px", height: "18px", marginTop: "2px" }}
                />
                <div>
                  <div style={{ fontWeight: 600, fontSize: "0.95rem" }}>
                    Allow Public Member Registration
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
                    Permits new students to register directly from the public homepage without librarian pre-approval.
                  </div>
                </div>
              </label>
            </div>

            <button type="submit" className="btn btn-primary">
              <Save size={16} /> Save User Settings
            </button>
          </div>
        )}
      </form>

      {/* Danger Zone: Factory Reset */}
      <div className="card" style={{ maxWidth: "700px", marginTop: "2.5rem", borderColor: "var(--danger-border)" }}>
        <h3 style={{ fontSize: "1.1rem", color: "var(--danger)", display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
          <ShieldAlert size={18} /> Reset Database & Sample Data
        </h3>
        <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "1rem" }}>
          Need to present from a clean slate? This will reset all books, sample borrowings, user accounts, and settings back to their default demo states.
        </p>

        <button
          onClick={() => {
            if (window.confirm("Are you sure you want to reset all mock data to defaults?")) {
              resetAllData();
              setForm({ ...settings });
            }
          }}
          className="btn btn-outline btn-sm"
          style={{ borderColor: "var(--danger)", color: "var(--danger)" }}
        >
          <RotateCcw size={14} /> Reset All Data to Defaults
        </button>
      </div>
    </div>
  );
};
