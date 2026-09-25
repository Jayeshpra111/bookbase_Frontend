import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useBooks } from "../../context/BookContext";
import {
  User,
  Mail,
  Globe,
  Lock,
  Phone,
  Calendar,
  Shield,
  BookOpen,
  CheckCircle,
  KeyRound,
  Save,
  Clock,
  AlertCircle
} from "lucide-react";

export const ProfilePage = () => {
  const { user, updateProfile, resetPassword } = useAuth();
  const { getUserBorrowings, returnBook, showToast } = useBooks();

  // Active tab: "details", "password", "borrowed", "returned"
  const [activeTab, setActiveTab] = useState("details");

  // Profile Edit State
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    country: user?.country || "India",
    bio: user?.bio || "",
    phone: user?.phone || "+91 98765 43210"
  });

  // Password Reset State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: ""
  });
  const [passwordError, setPasswordError] = useState("");

  const userBorrowings = getUserBorrowings(user?.id);
  const currentlyBorrowed = userBorrowings.filter((b) => b.status !== "Returned");
  const returnedBooks = userBorrowings.filter((b) => b.status === "Returned");

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

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    if (!profileForm.name.trim()) {
      showToast("Name cannot be empty.", "error");
      return;
    }
    const res = updateProfile(profileForm);
    if (res.success) {
      showToast("Profile details updated successfully!", "success");
    }
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setPasswordError("");

    if (!passwordForm.currentPassword) {
      setPasswordError("Please enter your current password.");
      return;
    }
    if (!passwordForm.newPassword || passwordForm.newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters long.");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    const res = resetPassword(passwordForm.currentPassword, passwordForm.newPassword);
    if (res.success) {
      showToast("Password reset successfully!", "success");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: ""
      });
    } else {
      setPasswordError(res.error || "Password reset failed.");
    }
  };

  return (
    <div className="container" style={{ padding: "2.5rem 1.5rem" }}>
      {/* Profile Header Card */}
      <div
        className="card"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1.75rem",
          marginBottom: "2rem",
          flexWrap: "wrap",
          background: "linear-gradient(to right, var(--bg-surface), var(--bg-surface-secondary))"
        }}
      >
        <img
          src={user?.avatar || "https://api.dicebear.com/7.x/initials/svg?seed=User"}
          alt={user?.name}
          style={{
            width: "90px",
            height: "90px",
            borderRadius: "var(--radius-full)",
            border: "3px solid var(--primary-400)",
            boxShadow: "var(--shadow-md)"
          }}
        />

        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap", marginBottom: "0.35rem" }}>
            <h1 style={{ fontSize: "1.75rem" }}>{user?.name}</h1>
            <span className={`badge ${user?.role === "Admin" ? "badge-danger" : "badge-primary"}`}>
              {user?.role}
            </span>
            <span className="badge badge-success">
              {user?.status || "Active"}
            </span>
          </div>

          <div style={{ display: "flex", gap: "1.25rem", color: "var(--text-muted)", fontSize: "0.875rem", flexWrap: "wrap" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
              <Mail size={15} /> {user?.email}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
              <Globe size={15} /> {user?.country || "India"}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
              <Calendar size={15} /> Joined: {user?.joinedDate || "2025-02-15"}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs Menu */}
      <div style={{ display: "flex", gap: "0.5rem", borderBottom: "1px solid var(--border-light)", marginBottom: "2rem", overflowX: "auto" }}>
        <button
          onClick={() => setActiveTab("details")}
          className={`category-pill ${activeTab === "details" ? "active" : ""}`}
        >
          <User size={15} /> Personal Details
        </button>

        <button
          onClick={() => setActiveTab("password")}
          className={`category-pill ${activeTab === "password" ? "active" : ""}`}
        >
          <KeyRound size={15} /> Reset Password
        </button>

        <button
          onClick={() => setActiveTab("borrowed")}
          className={`category-pill ${activeTab === "borrowed" ? "active" : ""}`}
        >
          <BookOpen size={15} /> Borrowed Books ({currentlyBorrowed.length})
        </button>

        <button
          onClick={() => setActiveTab("returned")}
          className={`category-pill ${activeTab === "returned" ? "active" : ""}`}
        >
          <CheckCircle size={15} /> Returned History ({returnedBooks.length})
        </button>
      </div>

      {/* Tab 1: Profile Details Update (Name, Country, Bio, Phone) */}
      {activeTab === "details" && (
        <div className="card" style={{ maxWidth: "720px" }}>
          <h2 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>Update Account Information</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginBottom: "1.5rem" }}>
            Modify your public details and regional preference.
          </p>

          <form onSubmit={handleProfileSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div className="form-group">
                <label className="form-label" htmlFor="profileName">
                  Full Name *
                </label>
                <input
                  id="profileName"
                  type="text"
                  className="form-input"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="profileCountry">
                  Country *
                </label>
                <select
                  id="profileCountry"
                  className="form-select"
                  value={profileForm.country}
                  onChange={(e) => setProfileForm({ ...profileForm, country: e.target.value })}
                  required
                >
                  {countries.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div className="form-group">
                <label className="form-label">Email Address (Read-only)</label>
                <input
                  type="text"
                  className="form-input"
                  value={user?.email || ""}
                  disabled
                  style={{ background: "var(--bg-surface-secondary)", cursor: "not-allowed" }}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="profilePhone">
                  Phone Number
                </label>
                <input
                  id="profilePhone"
                  type="text"
                  className="form-input"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  placeholder="+91 98765 00000"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="profileBio">
                Bio / Academic Major
              </label>
              <textarea
                id="profileBio"
                className="form-textarea"
                rows="3"
                value={profileForm.bio}
                onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                placeholder="Share your reading interests or college major..."
              />
            </div>

            <button type="submit" className="btn btn-primary">
              <Save size={16} /> Save Changes
            </button>
          </form>
        </div>
      )}

      {/* Tab 2: Reset Password */}
      {activeTab === "password" && (
        <div className="card" style={{ maxWidth: "560px" }}>
          <h2 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>Reset Account Password</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginBottom: "1.5rem" }}>
            Ensure your account uses a secure password with at least 6 characters.
          </p>

          {passwordError && (
            <div
              className="badge badge-danger"
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                borderRadius: "var(--radius-md)",
                marginBottom: "1.25rem",
                textTransform: "none",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem"
              }}
            >
              <AlertCircle size={16} />
              <span>{passwordError}</span>
            </div>
          )}

          <form onSubmit={handlePasswordSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="currentPassword">
                Current Password *
              </label>
              <input
                id="currentPassword"
                type="password"
                className="form-input"
                placeholder="Enter existing password (e.g. password123)"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="newPassword">
                New Password *
              </label>
              <input
                id="newPassword"
                type="password"
                className="form-input"
                placeholder="Min 6 characters"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="confirmNewPassword">
                Confirm New Password *
              </label>
              <input
                id="confirmNewPassword"
                type="password"
                className="form-input"
                placeholder="Re-type new password"
                value={passwordForm.confirmNewPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmNewPassword: e.target.value })}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary">
              <KeyRound size={16} /> Update Password
            </button>
          </form>
        </div>
      )}

      {/* Tab 3: Currently Borrowed Books */}
      {activeTab === "borrowed" && (
        <div className="card">
          <h2 style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>Currently Borrowed Books</h2>

          {currentlyBorrowed.length === 0 ? (
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>No active book borrowings on this account.</p>
          ) : (
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Book</th>
                    <th>Borrow Date</th>
                    <th>Due Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentlyBorrowed.map((loan) => (
                    <tr key={loan.id}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                          <img
                            src={loan.coverImage}
                            alt={loan.bookTitle}
                            style={{ width: "35px", height: "50px", objectFit: "cover", borderRadius: "4px" }}
                          />
                          <div>
                            <div style={{ fontWeight: 600 }}>{loan.bookTitle}</div>
                            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{loan.bookAuthor}</div>
                          </div>
                        </div>
                      </td>
                      <td>{loan.borrowDate}</td>
                      <td><strong>{loan.dueDate}</strong></td>
                      <td>
                        <span className={`badge ${loan.status === "Overdue" ? "badge-danger" : loan.status === "Due Soon" ? "badge-warning" : "badge-success"}`}>
                          {loan.status}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => returnBook(loan.id, user)}
                          className="btn btn-secondary btn-sm"
                        >
                          Return Book
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Returned Books History */}
      {activeTab === "returned" && (
        <div className="card">
          <h2 style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>Returned Books History</h2>

          {returnedBooks.length === 0 ? (
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>No returned books recorded yet.</p>
          ) : (
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Book</th>
                    <th>Borrow Date</th>
                    <th>Returned Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {returnedBooks.map((loan) => (
                    <tr key={loan.id}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                          <img
                            src={loan.coverImage}
                            alt={loan.bookTitle}
                            style={{ width: "35px", height: "50px", objectFit: "cover", borderRadius: "4px" }}
                          />
                          <div>
                            <div style={{ fontWeight: 600 }}>{loan.bookTitle}</div>
                            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{loan.bookAuthor}</div>
                          </div>
                        </div>
                      </td>
                      <td>{loan.borrowDate}</td>
                      <td>{loan.returnDate || "Completed"}</td>
                      <td>
                        <span className="badge badge-success">
                          Returned {loan.autoReturned ? "(Auto)" : ""}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
