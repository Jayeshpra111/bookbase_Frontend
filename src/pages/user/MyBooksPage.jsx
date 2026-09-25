import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useBooks } from "../../context/BookContext";
import {
  BookOpen,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  History,
  FastForward,
  AlertCircle
} from "lucide-react";
import confetti from "canvas-confetti";

export const MyBooksPage = () => {
  const { user } = useAuth();
  const { getUserBorrowings, returnBook, simulateTimeTravel, checkDueDatesAndAutoReturn, settings } = useBooks();

  const [activeTab, setActiveTab] = useState("active"); // "active", "history"

  const userBorrowings = getUserBorrowings(user?.id);
  const activeLoans = userBorrowings.filter((b) => b.status !== "Returned");
  const pastLoans = userBorrowings.filter((b) => b.status === "Returned");

  const handleReturn = (borrowingId, title) => {
    const res = returnBook(borrowingId, user);
    if (res.success) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 }
        });
      } catch (err) {}
    }
  };

  // Helper to calculate days remaining until due date
  const getDaysRemaining = (dueDateStr) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDateStr);
    due.setHours(0, 0, 0, 0);
    const diffTime = due.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="container" style={{ padding: "2.5rem 1.5rem" }}>
      {/* Page Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem", marginBottom: "2rem" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.4rem" }}>
            <span className="badge badge-success">Lifecycle Management</span>
          </div>
          <h1 className="section-title">Borrow & Return System</h1>
          <p className="section-subtitle">
            Manage your active book loans, monitor due dates, and view your complete borrowing history.
          </p>
        </div>

        <Link to="/catalog" className="btn btn-primary">
          <BookOpen size={16} /> Borrow More Books
        </Link>
      </div>

      {/* Auto-Return Feature Policy Notice (as specified on Page 2 & Page 5 of PDF) */}
      <div
        style={{
          background: "linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(6, 182, 212, 0.08))",
          border: "1px solid var(--primary-200)",
          borderRadius: "var(--radius-lg)",
          padding: "1.25rem 1.5rem",
          marginBottom: "2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1rem"
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: "0.85rem", maxWidth: "780px" }}>
          <ShieldCheck size={22} color="var(--primary-600)" style={{ flexShrink: 0, marginTop: "2px" }} />
          <div>
            <h4 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: "0.2rem" }}>
              Automated Lifecycle Policy: Automatic Return on Due Date
            </h4>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
              Standard loan duration is <strong>{settings.loanDurationDays || 14} days</strong>. When a book's due date is reached, BookBase's automated cron service marks the book as returned and replenishes the library catalog, ensuring fair access for all students.
            </p>
          </div>
        </div>

        <button
          onClick={() => simulateTimeTravel(7)}
          className="btn btn-secondary btn-sm"
          title="Simulate 7 days passing to see due date changes"
        >
          <FastForward size={14} color="var(--warning)" /> Advance +7 Days Demo
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "0.5rem", borderBottom: "1px solid var(--border-light)", marginBottom: "2rem" }}>
        <button
          onClick={() => setActiveTab("active")}
          className={`category-pill ${activeTab === "active" ? "active" : ""}`}
        >
          <Clock size={16} /> Currently Borrowed ({activeLoans.length})
        </button>

        <button
          onClick={() => setActiveTab("history")}
          className={`category-pill ${activeTab === "history" ? "active" : ""}`}
        >
          <History size={16} /> Borrowing History ({pastLoans.length})
        </button>
      </div>

      {/* Tab 1: Currently Borrowed Books */}
      {activeTab === "active" && (
        <div>
          {activeLoans.length === 0 ? (
            <div className="card" style={{ textAlign: "center", padding: "4rem 2rem", maxWidth: "600px", margin: "0 auto" }}>
              <CheckCircle2 size={48} color="var(--success)" style={{ margin: "0 auto 1rem" }} />
              <h3 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>All Caught Up!</h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
                You have no pending book returns right now. Feel free to explore our catalog and check out new titles.
              </p>
              <Link to="/catalog" className="btn btn-primary">
                Browse Library Catalog <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: "1.5rem" }}>
              {activeLoans.map((loan) => {
                const daysLeft = getDaysRemaining(loan.dueDate);
                const isOverdue = daysLeft < 0 || loan.status === "Overdue";
                const isDueSoon = daysLeft >= 0 && daysLeft <= 3;

                return (
                  <div key={loan.id} className="card" style={{ display: "flex", flexDirection: "column" }}>
                    <div style={{ display: "flex", gap: "1.25rem", marginBottom: "1.25rem" }}>
                      <img
                        src={loan.coverImage}
                        alt={loan.bookTitle}
                        style={{
                          width: "80px",
                          height: "115px",
                          objectFit: "cover",
                          borderRadius: "var(--radius-md)",
                          boxShadow: "var(--shadow-sm)"
                        }}
                      />

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h3
                          style={{
                            fontSize: "1.05rem",
                            fontWeight: 700,
                            lineHeight: 1.3,
                            marginBottom: "0.35rem",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden"
                          }}
                          title={loan.bookTitle}
                        >
                          {loan.bookTitle}
                        </h3>

                        <div style={{ fontSize: "0.85rem", color: "var(--primary-600)", fontWeight: 500, marginBottom: "0.5rem" }}>
                          {loan.bookAuthor}
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <span className={`badge ${isOverdue ? "badge-danger" : isDueSoon ? "badge-warning" : "badge-success"}`}>
                            {isOverdue ? "Overdue" : isDueSoon ? "Due Soon" : "Active Loan"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Due Date & Countdown Box */}
                    <div
                      style={{
                        background: "var(--bg-surface-secondary)",
                        borderRadius: "var(--radius-md)",
                        padding: "0.85rem 1rem",
                        marginBottom: "1.25rem",
                        fontSize: "0.85rem",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                      }}
                    >
                      <div>
                        <div style={{ color: "var(--text-muted)", fontSize: "0.75rem", textTransform: "uppercase" }}>
                          Loan Period
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontWeight: 600 }}>
                          <Calendar size={14} /> Due: {loan.dueDate}
                        </div>
                      </div>

                      <div style={{ textAlign: "right" }}>
                        <div style={{ color: "var(--text-muted)", fontSize: "0.75rem", textTransform: "uppercase" }}>
                          Time Status
                        </div>
                        <div
                          style={{
                            fontWeight: 700,
                            color: isOverdue ? "var(--danger)" : isDueSoon ? "var(--warning)" : "var(--success)"
                          }}
                        >
                          {isOverdue
                            ? `${Math.abs(daysLeft)} Day(s) Overdue`
                            : daysLeft === 0
                            ? "Due Today!"
                            : `${daysLeft} Day(s) Left`}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{ marginTop: "auto", display: "flex", gap: "0.75rem" }}>
                      <Link to={`/books/${loan.bookId}`} className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
                        Book Details
                      </Link>
                      <button
                        onClick={() => handleReturn(loan.id, loan.bookTitle)}
                        className="btn btn-primary btn-sm"
                        style={{ flex: 1 }}
                      >
                        <RotateCcw size={15} /> Return Book
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Borrowing History */}
      {activeTab === "history" && (
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
            <h2 style={{ fontSize: "1.2rem" }}>Past Completed Loans</h2>
            <span className="badge badge-primary">{pastLoans.length} Records</span>
          </div>

          {pastLoans.length === 0 ? (
            <p style={{ color: "var(--text-muted)", padding: "2rem 0", textAlign: "center" }}>
              No past borrowing history recorded for your account.
            </p>
          ) : (
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Book Details</th>
                    <th>Borrow Date</th>
                    <th>Due Date</th>
                    <th>Return Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {pastLoans.map((loan) => (
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
                      <td>{loan.dueDate}</td>
                      <td>{loan.returnDate || "Completed"}</td>
                      <td>
                        <span className="badge badge-success">
                          {loan.autoReturned ? "Auto-Returned" : "Returned on Time"}
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
