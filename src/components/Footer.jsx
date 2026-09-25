import { Link } from "react-router-dom";
import { BookOpen, ShieldCheck } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand & Overview */}
          <div>
            <div className="nav-brand" style={{ marginBottom: "1rem" }}>
              <div className="brand-icon-wrapper" style={{ width: "32px", height: "32px" }}>
                <BookOpen size={18} />
              </div>
              <span style={{ fontSize: "1.2rem" }}>BookBase</span>
            </div>
            <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", lineHeight: "1.6", marginBottom: "1rem" }}>
              A full-featured, next-generation Library Management System built with the modern MERN architecture.
              Designed for streamlined book discovery, digital borrowings, automated overdue checks, and librarian controls.
            </p>

          </div>

          {/* Quick Navigation */}
          <div>
            <h4 style={{ fontSize: "0.95rem", marginBottom: "1rem", color: "var(--text-main)" }}>Library Navigation</h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.875rem" }}>
              <li><Link to="/" style={{ color: "var(--text-muted)" }}>Home Overview</Link></li>
              <li><Link to="/catalog" style={{ color: "var(--text-muted)" }}>Book Catalog</Link></li>
              <li><Link to="/search" style={{ color: "var(--text-muted)" }}>Search Engine</Link></li>
              <li><Link to="/login" style={{ color: "var(--text-muted)" }}>Member Sign In</Link></li>
              <li><Link to="/register" style={{ color: "var(--text-muted)" }}>New Registration</Link></li>
            </ul>
          </div>

          {/* User & Admin Portals */}
          <div>
            <h4 style={{ fontSize: "0.95rem", marginBottom: "1rem", color: "var(--text-main)" }}>Portals</h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.875rem" }}>
              <li><Link to="/dashboard" style={{ color: "var(--text-muted)" }}>User Dashboard</Link></li>
              <li><Link to="/my-books" style={{ color: "var(--text-muted)" }}>Borrow & Return</Link></li>
              <li><Link to="/profile" style={{ color: "var(--text-muted)" }}>Profile Settings</Link></li>
              <li><Link to="/admin/dashboard" style={{ color: "var(--text-muted)" }}>Admin Dashboard</Link></li>
              <li><Link to="/admin/books" style={{ color: "var(--text-muted)" }}>Manage Books (CRUD)</Link></li>
            </ul>
          </div>


        </div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <div>
            © {new Date().getFullYear()} BookBase Library System. Built with React & modern MERN stack principles.
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
              <ShieldCheck size={16} color="var(--success)" /> Role-Based Access Control (JWT)
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
