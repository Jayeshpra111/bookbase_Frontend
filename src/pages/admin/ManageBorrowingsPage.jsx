import React, { useState, useMemo } from "react";
import { useBooks } from "../../context/BookContext";
import {
  Clock,
  Search,
  CheckCircle,
  AlertTriangle,
  RotateCcw,
  Calendar,
  User,
  Filter,
  ArrowUpDown,
  BookOpen
} from "lucide-react";

export const ManageBorrowingsPage = () => {
  const { borrowings, returnBook, showToast } = useBooks();

  const [activeTab, setActiveTab] = useState("all"); // "all", "active", "returned", "overdue"
  const [search, setSearch] = useState("");

  const filteredBorrowings = useMemo(() => {
    return borrowings.filter((b) => {
      // Tab filter
      if (activeTab === "active" && (b.status === "Returned")) return false;
      if (activeTab === "returned" && b.status !== "Returned") return false;
      if (activeTab === "overdue" && b.status !== "Overdue") return false;

      // Search filter
      const q = search.trim().toLowerCase();
      if (!q) return true;

      return (
        b.bookTitle.toLowerCase().includes(q) ||
        b.userName.toLowerCase().includes(q) ||
        b.userEmail.toLowerCase().includes(q)
      );
    });
  }, [borrowings, activeTab, search]);

  const activeCount = borrowings.filter((b) => b.status !== "Returned").length;
  const returnedCount = borrowings.filter((b) => b.status === "Returned").length;
  const overdueCount = borrowings.filter((b) => b.status === "Overdue").length;

  return (
    <div className="container" style={{ padding: "2.5rem 1.5rem" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem", marginBottom: "2rem" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.4rem" }}>
            <span className="badge badge-warning">Circulation Desk</span>
          </div>
          <h1 className="section-title">Manage Borrowings</h1>
          <p className="section-subtitle">
            Comprehensive oversight of all student loans, returned books, due dates, and borrower tracking.
          </p>
        </div>

        <div style={{ display: "flex", gap: "0.5rem" }}>
          <span className="badge badge-primary">{borrowings.length} Total Loans</span>
        </div>
      </div>

      {/* Circulation Tabs:
          - View borrowed books
          - View returned books
          - View overdue books
      */}
      <div style={{ display: "flex", gap: "0.5rem", borderBottom: "1px solid var(--border-light)", marginBottom: "1.75rem", overflowX: "auto" }}>
        <button
          onClick={() => setActiveTab("all")}
          className={`category-pill ${activeTab === "all" ? "active" : ""}`}
        >
          All Circulation ({borrowings.length})
        </button>

        <button
          onClick={() => setActiveTab("active")}
          className={`category-pill ${activeTab === "active" ? "active" : ""}`}
        >
          <Clock size={15} /> Borrowed Books ({activeCount})
        </button>

        <button
          onClick={() => setActiveTab("returned")}
          className={`category-pill ${activeTab === "returned" ? "active" : ""}`}
        >
          <CheckCircle size={15} /> Returned Books ({returnedCount})
        </button>

        <button
          onClick={() => setActiveTab("overdue")}
          className={`category-pill ${activeTab === "overdue" ? "active" : ""}`}
        >
          <AlertTriangle size={15} /> Overdue Books ({overdueCount})
        </button>
      </div>

      {/* Search Input */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
          background: "var(--bg-surface)",
          border: "1px solid var(--border-light)",
          borderRadius: "var(--radius-lg)",
          padding: "1rem 1.25rem",
          marginBottom: "1.75rem"
        }}
      >
        <div style={{ position: "relative", width: "100%", maxWidth: "380px" }}>
          <Search
            size={18}
            style={{
              position: "absolute",
              left: "1rem",
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--text-muted)"
            }}
          />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: "2.5rem" }}
            placeholder="Search by student name, email, or book title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <span style={{ fontSize: "0.875rem", color: "var(--text-muted)", fontWeight: 600 }}>
          Showing <strong>{filteredBorrowings.length}</strong> Records
        </span>
      </div>

      {/* Circulation Table */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div className="table-wrapper" style={{ border: "none" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Book Title</th>
                <th>Track Borrower</th>
                <th>Borrow Date</th>
                <th>Track Due Date</th>
                <th>Return Date</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Librarian Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredBorrowings.map((bor) => {
                const isOverdue = bor.status === "Overdue";
                const isDueSoon = bor.status === "Due Soon";
                const isReturned = bor.status === "Returned";

                return (
                  <tr key={bor.id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <img
                          src={bor.coverImage}
                          alt={bor.bookTitle}
                          style={{ width: "35px", height: "50px", objectFit: "cover", borderRadius: "4px" }}
                        />
                        <div>
                          <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>{bor.bookTitle}</div>
                          <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{bor.bookAuthor}</div>
                        </div>
                      </div>
                    </td>

                    {/* Track borrower */}
                    <td>
                      <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{bor.userName}</div>
                      <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{bor.userEmail}</div>
                    </td>

                    <td>{bor.borrowDate}</td>

                    {/* Track due date */}
                    <td>
                      <strong style={{ color: isOverdue ? "var(--danger)" : "inherit" }}>
                        {bor.dueDate}
                      </strong>
                    </td>

                    <td>{bor.returnDate || "—"}</td>

                    <td>
                      <span className={`badge ${isOverdue ? "badge-danger" : isDueSoon ? "badge-warning" : isReturned ? "badge-neutral" : "badge-success"}`}>
                        {bor.status} {bor.autoReturned ? "(Auto)" : ""}
                      </span>
                    </td>

                    <td style={{ textAlign: "right" }}>
                      {!isReturned ? (
                        <button
                          onClick={() => returnBook(bor.id)}
                          className="btn btn-secondary btn-sm"
                          title="Process return for borrower"
                        >
                          <RotateCcw size={13} /> Mark Returned
                        </button>
                      ) : (
                        <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Archived</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
