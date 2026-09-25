import React, { useMemo } from "react";
import { useBooks } from "../../context/BookContext";
import { useAuth } from "../../context/AuthContext";
import {
  FileText,
  Download,
  BarChart3,
  TrendingUp,
  PieChart,
  BookOpen,
  Users,
  Clock,
  Sparkles
} from "lucide-react";

export const AdminReportsPage = () => {
  const { books, borrowings, settings } = useBooks();
  const { users } = useAuth();

  // Category distribution
  const categoryStats = useMemo(() => {
    const counts = {};
    books.forEach((b) => {
      counts[b.category] = (counts[b.category] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [books]);

  // Most borrowed books calculation
  const topBooks = useMemo(() => {
    const borrowCounts = {};
    borrowings.forEach((bor) => {
      borrowCounts[bor.bookTitle] = (borrowCounts[bor.bookTitle] || 0) + 1;
    });

    return Object.entries(borrowCounts)
      .map(([title, count]) => ({ title, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [borrowings]);

  // Active borrowers
  const activeBorrowers = useMemo(() => {
    const map = {};
    borrowings.forEach((b) => {
      if (!map[b.userId]) {
        map[b.userId] = { name: b.userName, email: b.userEmail, total: 0, active: 0, overdue: 0 };
      }
      map[b.userId].total++;
      if (b.status !== "Returned") map[b.userId].active++;
      if (b.status === "Overdue") map[b.userId].overdue++;
    });
    return Object.values(map);
  }, [borrowings]);

  // Export report to JSON
  const handleExportJSON = () => {
    const reportData = {
      generatedAt: new Date().toISOString(),
      classroomCode: "cwvy2yza",
      library: settings.libraryName,
      stats: {
        totalBooks: books.length,
        totalUsers: users.length,
        totalBorrowings: borrowings.length
      },
      borrowings,
      inventory: books
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `BookBase_Report_${new Date().toISOString().split("T")[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Export report to CSV
  const handleExportCSV = () => {
    const headers = "ID,Book Title,Borrower,Borrow Date,Due Date,Status\n";
    const rows = borrowings
      .map(
        (b) =>
          `"${b.id}","${b.bookTitle.replace(/"/g, '""')}","${b.userName}","${b.borrowDate}","${b.dueDate}","${b.status}"`
      )
      .join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `BookBase_Circulation_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container" style={{ padding: "2.5rem 1.5rem" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem", marginBottom: "2rem" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.4rem" }}>
            <span className="badge badge-primary">Analytical Reports</span>
          </div>
          <h1 className="section-title">Library Reports & Circulation Analytics</h1>
          <p className="section-subtitle">
            Insights on popular books, category demands, student loan activity, and data export.
          </p>
        </div>

        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button onClick={handleExportCSV} className="btn btn-secondary btn-sm">
            <Download size={15} /> Export CSV
          </button>
          <button onClick={handleExportJSON} className="btn btn-primary btn-sm">
            <Download size={15} /> Export JSON Report
          </button>
        </div>
      </div>

      {/* Grid: Popular Books & Category Breakdown */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "2rem", marginBottom: "2.5rem" }}>
        {/* Most Borrowed Titles */}
        <div className="card">
          <h2 style={{ fontSize: "1.2rem", display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.25rem" }}>
            <TrendingUp size={18} color="var(--primary-600)" /> Most Circulated Titles
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {topBooks.map((item, idx) => {
              const max = topBooks[0]?.count || 1;
              const percent = Math.round((item.count / max) * 100);

              return (
                <div key={item.title}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem", marginBottom: "0.35rem" }}>
                    <span style={{ fontWeight: 600, display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      <span style={{ color: "var(--primary-600)", width: "18px" }}>#{idx + 1}</span>
                      {item.title}
                    </span>
                    <strong style={{ color: "var(--text-muted)" }}>{item.count} loans</strong>
                  </div>
                  <div style={{ height: "8px", background: "var(--bg-surface-secondary)", borderRadius: "4px", overflow: "hidden" }}>
                    <div
                      style={{
                        height: "100%",
                        width: `${percent}%`,
                        background: "linear-gradient(90deg, var(--primary-600), var(--accent-cyan))",
                        borderRadius: "4px"
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="card">
          <h2 style={{ fontSize: "1.2rem", display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.25rem" }}>
            <PieChart size={18} color="var(--accent-purple)" /> Catalog Category Diversity
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
            {categoryStats.map(([category, count]) => (
              <div
                key={category}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.6rem 0.85rem",
                  background: "var(--bg-surface-secondary)",
                  borderRadius: "var(--radius-md)",
                  fontSize: "0.9rem"
                }}
              >
                <span style={{ fontWeight: 500 }}>{category}</span>
                <span className="badge badge-primary">{count} titles</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Active Borrowers Summary Table */}
      <div className="card">
        <h2 style={{ fontSize: "1.2rem", display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.25rem" }}>
          <Users size={18} color="var(--success)" /> Member Loan Activity Summary
        </h2>

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Student Member</th>
                <th>Email</th>
                <th>Total Lifetime Loans</th>
                <th>Active Borrowings</th>
                <th>Overdue Risk</th>
              </tr>
            </thead>
            <tbody>
              {activeBorrowers.map((borrower) => (
                <tr key={borrower.email}>
                  <td><strong>{borrower.name}</strong></td>
                  <td>{borrower.email}</td>
                  <td>{borrower.total} books</td>
                  <td>
                    <span className="badge badge-primary">{borrower.active} Active</span>
                  </td>
                  <td>
                    {borrower.overdue > 0 ? (
                      <span className="badge badge-danger">{borrower.overdue} Overdue</span>
                    ) : (
                      <span className="badge badge-success">Good Standing</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
