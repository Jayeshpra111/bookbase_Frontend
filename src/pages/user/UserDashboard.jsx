import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useBooks } from "../../context/BookContext";
import {
  BookOpen,
  Bookmark,
  CheckCircle,
  Clock,
  AlertTriangle,
  Search,
  BookMarked,
  User,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Calendar
} from "lucide-react";

export const UserDashboard = () => {
  const { user } = useAuth();
  const { getUserStats, getUserBorrowings, returnBook, activities, books } = useBooks();

  const stats = getUserStats(user?.id);
  const userBorrowings = getUserBorrowings(user?.id);

  // Active or due borrowings
  const activeLoans = userBorrowings.filter((b) => b.status !== "Returned");

  // Recent activity filtered for this user
  const userActivities = activities.filter((a) => a.userId === user?.id).slice(0, 5);

  const handleReturn = (borrowingId) => {
    returnBook(borrowingId, user);
  };

  // Recommended books (picks books user has not currently borrowed)
  const borrowedBookIds = new Set(activeLoans.map((b) => b.bookId));
  const recommendedBooks = books.filter((b) => !borrowedBookIds.has(b.id)).slice(0, 3);

  return (
    <div className="container" style={{ padding: "2.5rem 1.5rem" }}>
      {/* Welcome Greeting Banner */}
      <div
        style={{
          background: "linear-gradient(135deg, var(--primary-700), var(--primary-900))",
          color: "#fff",
          borderRadius: "var(--radius-xl)",
          padding: "2.25rem",
          marginBottom: "2rem",
          boxShadow: "var(--shadow-lg)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1.5rem"
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.4rem" }}>
            <span className="badge" style={{ background: "rgba(255, 255, 255, 0.15)", color: "#fff", border: "1px solid rgba(255, 255, 255, 0.2)" }}>
              Student Portal
            </span>
            <span style={{ fontSize: "0.85rem", opacity: 0.85 }}>• Member from {user?.country || "India"}</span>
          </div>
          <h1 style={{ fontSize: "2rem", color: "#fff", marginBottom: "0.35rem" }}>
            Welcome back, {user?.name}! 👋
          </h1>
          <p style={{ color: "#c7d2fe", fontSize: "0.95rem", maxWidth: "600px" }}>
            Here is your current library summary, active book loans, and reading timeline. Keep track of due dates to avoid overdue status.
          </p>
        </div>

        <div style={{ display: "flex", gap: "0.75rem" }}>
          <Link to="/catalog" className="btn btn-secondary btn-sm" style={{ background: "#fff", color: "var(--primary-700)" }}>
            <BookOpen size={16} /> Browse Books
          </Link>
          <Link to="/my-books" className="btn btn-primary btn-sm" style={{ border: "1px solid rgba(255,255,255,0.3)" }}>
            <Bookmark size={16} /> My Borrowed Books
          </Link>
        </div>
      </div>

      {/* Member Statistics:
          1. Total borrowed books
          2. Currently borrowed books
          3. Returned books
          4. Due books
      */}
      <div className="dashboard-stats-grid">
        {/* Total Borrowed Books */}
        <div className="dashboard-stat-card">
          <div className="stat-icon-container icon-blue">
            <BookMarked size={26} />
          </div>
          <div>
            <div className="stat-info-title">Total Borrowed</div>
            <div className="stat-info-count">{stats.totalBorrowed}</div>
          </div>
        </div>

        {/* Currently Borrowed Books */}
        <div className="dashboard-stat-card">
          <div className="stat-icon-container icon-purple">
            <BookOpen size={26} />
          </div>
          <div>
            <div className="stat-info-title">Currently Borrowed</div>
            <div className="stat-info-count">{stats.currentlyBorrowed}</div>
          </div>
        </div>

        {/* Returned Books */}
        <div className="dashboard-stat-card">
          <div className="stat-icon-container icon-emerald">
            <CheckCircle size={26} />
          </div>
          <div>
            <div className="stat-info-title">Returned Books</div>
            <div className="stat-info-count">{stats.returned}</div>
          </div>
        </div>

        {/* Due Books */}
        <div className="dashboard-stat-card">
          <div className={`stat-icon-container ${stats.dueBooks > 0 ? "icon-rose" : "icon-amber"}`}>
            <AlertTriangle size={26} />
          </div>
          <div>
            <div className="stat-info-title">Due / Overdue</div>
            <div className="stat-info-count" style={{ color: stats.dueBooks > 0 ? "var(--danger)" : "inherit" }}>
              {stats.dueBooks}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="quick-actions-bar">
        <Link to="/catalog" className="action-card">
          <BookOpen size={20} color="var(--primary-600)" />
          <div>
            <div>Explore Catalog</div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 400 }}>Discover new titles</div>
          </div>
        </Link>
        <Link to="/search" className="action-card">
          <Search size={20} color="var(--accent-cyan)" />
          <div>
            <div>Search Books</div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 400 }}>By title, author, genre</div>
          </div>
        </Link>
        <Link to="/my-books" className="action-card">
          <Clock size={20} color="var(--warning)" />
          <div>
            <div>Loan Status & Return</div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 400 }}>Track due dates</div>
          </div>
        </Link>
        <Link to="/profile" className="action-card">
          <User size={20} color="var(--accent-purple)" />
          <div>
            <div>Account Profile</div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 400 }}>Personal details & password</div>
          </div>
        </Link>
      </div>

      {/* Main Grid: Active Loans & Recent Activity */}
      <div style={{ display: "grid", gridTemplateColumns: "1.8fr 1.2fr", gap: "2rem" }}>
        {/* Currently Borrowed Books Section */}
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
            <h2 style={{ fontSize: "1.2rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Clock size={18} color="var(--primary-600)" /> Currently Borrowed Books
            </h2>
            <Link to="/my-books" style={{ fontSize: "0.85rem", fontWeight: 600 }}>
              View All ({activeLoans.length})
            </Link>
          </div>

          {activeLoans.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem 1rem", color: "var(--text-muted)" }}>
              <BookOpen size={40} style={{ opacity: 0.3, marginBottom: "0.75rem" }} />
              <p style={{ fontWeight: 600, color: "var(--text-main)" }}>No books currently checked out.</p>
              <p style={{ fontSize: "0.85rem", marginBottom: "1.25rem" }}>Explore our catalog and borrow titles for your research or study.</p>
              <Link to="/catalog" className="btn btn-primary btn-sm">
                Browse Book Catalog
              </Link>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {activeLoans.map((loan) => {
                const isOverdue = loan.status === "Overdue";
                const isDueSoon = loan.status === "Due Soon";

                return (
                  <div
                    key={loan.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                      padding: "0.85rem",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid var(--border-light)",
                      backgroundColor: "var(--bg-surface-secondary)"
                    }}
                  >
                    <img
                      src={loan.coverImage}
                      alt={loan.bookTitle}
                      style={{ width: "55px", height: "75px", objectFit: "cover", borderRadius: "var(--radius-sm)" }}
                    />

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h4
                        style={{
                          fontSize: "0.95rem",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          marginBottom: "0.2rem"
                        }}
                        title={loan.bookTitle}
                      >
                        {loan.bookTitle}
                      </h4>
                      <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.4rem" }}>
                        {loan.bookAuthor}
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.78rem" }}>
                        <span style={{ display: "flex", alignItems: "center", gap: "0.25rem", color: "var(--text-muted)" }}>
                          <Calendar size={13} /> Due: <strong>{loan.dueDate}</strong>
                        </span>

                        <span className={`badge ${isOverdue ? "badge-danger" : isDueSoon ? "badge-warning" : "badge-success"}`}>
                          {loan.status}
                        </span>
                      </div>
                    </div>

                    <div>
                      <button
                        onClick={() => handleReturn(loan.id)}
                        className="btn btn-secondary btn-sm"
                        title="Return book back to library"
                      >
                        Return Book
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Activity Feed */}
        <div className="card">
          <h2 style={{ fontSize: "1.2rem", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <TrendingUp size={18} color="var(--primary-600)" /> Recent Activity
          </h2>

          {userActivities.length === 0 ? (
            <div style={{ textAlign: "center", padding: "2.5rem 1rem", color: "var(--text-muted)", fontSize: "0.85rem" }}>
              No recent library activity logged yet.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {userActivities.map((act) => {
                const isBorrow = act.type === "BORROW";
                return (
                  <div key={act.id} style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", fontSize: "0.85rem" }}>
                    <div
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "var(--radius-full)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: isBorrow ? "rgba(79, 70, 229, 0.12)" : "rgba(16, 185, 129, 0.12)",
                        color: isBorrow ? "var(--primary-600)" : "var(--success)",
                        flexShrink: 0
                      }}
                    >
                      {isBorrow ? <BookMarked size={16} /> : <CheckCircle size={16} />}
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ color: "var(--text-main)", fontWeight: 500 }}>{act.message}</div>
                      <div style={{ color: "var(--text-subtle)", fontSize: "0.75rem", marginTop: "0.2rem" }}>
                        {new Date(act.timestamp).toLocaleDateString()} at {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <hr style={{ border: "none", borderTop: "1px solid var(--border-light)", margin: "1.5rem 0 1rem" }} />

          {/* Quick link to profile */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Manage account info</span>
            <Link to="/profile" className="btn btn-outline btn-sm">
              <User size={14} /> Profile & Password
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
