import React from "react";
import { Link } from "react-router-dom";
import { useBooks } from "../../context/BookContext";
import { useAuth } from "../../context/AuthContext";
import {
  BookOpen,
  Users,
  BookmarkCheck,
  AlertTriangle,
  PlusCircle,
  Settings,
  ArrowRight,
  TrendingUp,
  Clock,
  ShieldCheck,
  FileText
} from "lucide-react";

export const AdminDashboard = () => {
  const { books, borrowings, getAdminStats, returnBook } = useBooks();
  const { users } = useAuth();

  const stats = getAdminStats();

  // Recent borrowings (Page 6 spec: Recent Borrowings [User, Book, Due Date])
  const recentBorrowings = borrowings.slice(0, 5);

  // Overdue books (Page 6 spec: Overdue Books [User, Book, Status])
  const overdueBorrowings = borrowings.filter((b) => b.status === "Overdue");

  return (
    <div className="container" style={{ padding: "2.5rem 1.5rem" }}>
      {/* Top Banner */}
      <div
        style={{
          background: "linear-gradient(135deg, var(--neutral-900), var(--neutral-800))",
          color: "#fff",
          borderRadius: "var(--radius-xl)",
          padding: "2rem 2.25rem",
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
            <span className="badge" style={{ background: "rgba(239, 68, 68, 0.2)", color: "#fca5a5", border: "1px solid rgba(239, 68, 68, 0.4)" }}>
              Admin Panel — Suraj's Module
            </span>
            <span style={{ fontSize: "0.85rem", opacity: 0.8 }}>Library Administrator Workspace</span>
          </div>
          <h1 style={{ fontSize: "2rem", color: "#fff", marginBottom: "0.25rem" }}>
            Central Library Dashboard
          </h1>
          <p style={{ color: "#94a3b8", fontSize: "0.95rem" }}>
            Real-time management for catalog stock, student borrowings, user status, and overdue notifications.
          </p>
        </div>

        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <Link to="/admin/books" className="btn btn-primary btn-sm">
            <PlusCircle size={16} /> Manage Books (CRUD)
          </Link>
          <Link to="/admin/users" className="btn btn-secondary btn-sm" style={{ background: "rgba(255,255,255,0.1)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)" }}>
            <Users size={16} /> Manage Members
          </Link>
        </div>
      </div>

      {/* Main Stats:
          As illustrated in page 6 ASCII layout:
          Total Books (250) | Total Users (120) | Borrowed (45) | Overdue Books
      */}
      <div className="dashboard-stats-grid">
        <div className="dashboard-stat-card">
          <div className="stat-icon-container icon-blue">
            <BookOpen size={26} />
          </div>
          <div>
            <div className="stat-info-title">Total Books</div>
            <div className="stat-info-count">{stats.totalBooks} Copies</div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{stats.totalTitles} Unique Titles</div>
          </div>
        </div>

        <div className="dashboard-stat-card">
          <div className="stat-icon-container icon-purple">
            <Users size={26} />
          </div>
          <div>
            <div className="stat-info-title">Total Users</div>
            <div className="stat-info-count">{users.length}</div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Active Student Accounts</div>
          </div>
        </div>

        <div className="dashboard-stat-card">
          <div className="stat-icon-container icon-emerald">
            <BookmarkCheck size={26} />
          </div>
          <div>
            <div className="stat-info-title">Active Borrowed</div>
            <div className="stat-info-count">{stats.borrowedCount}</div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Currently checked out</div>
          </div>
        </div>

        <div className="dashboard-stat-card">
          <div className={`stat-icon-container ${overdueBorrowings.length > 0 ? "icon-rose" : "icon-amber"}`}>
            <AlertTriangle size={26} />
          </div>
          <div>
            <div className="stat-info-title">Overdue Books</div>
            <div className="stat-info-count" style={{ color: overdueBorrowings.length > 0 ? "var(--danger)" : "inherit" }}>
              {overdueBorrowings.length}
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Action required</div>
          </div>
        </div>
      </div>

      {/* Admin Action Bar */}
      <div className="quick-actions-bar">
        <Link to="/admin/books" className="action-card">
          <BookOpen size={20} color="var(--primary-600)" />
          <div>
            <div>Manage Books</div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 400 }}>Create, Read, Update, Delete</div>
          </div>
        </Link>

        <Link to="/admin/users" className="action-card">
          <Users size={20} color="var(--accent-purple)" />
          <div>
            <div>Manage Users</div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 400 }}>Block / Unblock & Search</div>
          </div>
        </Link>

        <Link to="/admin/borrowings" className="action-card">
          <Clock size={20} color="var(--warning)" />
          <div>
            <div>Manage Borrowings</div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 400 }}>All user loan records</div>
          </div>
        </Link>

        <Link to="/admin/reports" className="action-card">
          <FileText size={20} color="var(--accent-cyan)" />
          <div>
            <div>Analytics & Reports</div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 400 }}>Export & Circulation metrics</div>
          </div>
        </Link>

        <Link to="/admin/settings" className="action-card">
          <Settings size={20} color="var(--text-muted)" />
          <div>
            <div>Settings</div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 400 }}>Loan rules & Library configuration</div>
          </div>
        </Link>
      </div>

      {/* Grid: Recent Borrowings & Overdue Books (Page 6 exact layout) */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "2rem", marginBottom: "2.5rem" }}>
        {/* Recent Borrowings Table */}
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
            <h2 style={{ fontSize: "1.2rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Clock size={18} color="var(--primary-600)" /> Recent Borrowings
            </h2>
            <Link to="/admin/borrowings" style={{ fontSize: "0.85rem", fontWeight: 600 }}>
              View All
            </Link>
          </div>

          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Book</th>
                  <th>Due Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentBorrowings.map((b) => (
                  <tr key={b.id}>
                    <td>
                      <strong>{b.userName}</strong>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{b.userEmail}</div>
                    </td>
                    <td>
                      <span title={b.bookTitle} style={{ fontWeight: 500 }}>
                        {b.bookTitle.length > 25 ? `${b.bookTitle.substring(0, 25)}...` : b.bookTitle}
                      </span>
                    </td>
                    <td>{b.dueDate}</td>
                    <td>
                      <span className={`badge ${b.status === "Overdue" ? "badge-danger" : b.status === "Due Soon" ? "badge-warning" : b.status === "Returned" ? "badge-neutral" : "badge-success"}`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Overdue Books Table (Page 6 requirement: Overdue Books [User, Book, Status]) */}
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
            <h2 style={{ fontSize: "1.2rem", display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--danger)" }}>
              <AlertTriangle size={18} /> Overdue Books
            </h2>
            <span className="badge badge-danger">{overdueBorrowings.length} Overdue</span>
          </div>

          {overdueBorrowings.length === 0 ? (
            <div style={{ textAlign: "center", padding: "2.5rem 1rem", color: "var(--text-muted)" }}>
              <ShieldCheck size={36} color="var(--success)" style={{ margin: "0 auto 0.75rem" }} />
              <p style={{ fontWeight: 600, color: "var(--text-main)" }}>No overdue books currently.</p>
              <p style={{ fontSize: "0.85rem" }}>All student loans are either within the active period or have been returned.</p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Book</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {overdueBorrowings.map((ob) => (
                    <tr key={ob.id}>
                      <td><strong>{ob.userName}</strong></td>
                      <td>
                        <span title={ob.bookTitle}>
                          {ob.bookTitle.length > 20 ? `${ob.bookTitle.substring(0, 20)}...` : ob.bookTitle}
                        </span>
                      </td>
                      <td>
                        <span className="badge badge-danger">Overdue</span>
                      </td>
                      <td>
                        <button
                          onClick={() => returnBook(ob.id)}
                          className="btn btn-sm btn-secondary"
                          title="Manually mark returned"
                        >
                          Process Return
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
