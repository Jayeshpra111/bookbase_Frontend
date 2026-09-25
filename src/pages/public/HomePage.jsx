import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useBooks } from "../../context/BookContext";
import { BookCard } from "../../components/BookCard";
import {
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Search,
  Sparkles,
  Users,
  Clock,
  BookmarkCheck,
  ChevronRight
} from "lucide-react";

export const HomePage = () => {
  const { isAuthenticated, isAdmin, user } = useAuth();
  const { books, borrowings } = useBooks();

  // Pick top 4 featured books
  const featuredBooks = books.slice(0, 4);

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container hero-content">


          <h1 className="hero-title">
            The Modern Knowledge Base for <span className="hero-gradient-text">Curious Minds</span>
          </h1>

          <p className="hero-subtitle">
            BookBase is a comprehensive digital library ecosystem. Seamlessly search titles, borrow books with automatic due-date lifecycle management, and enjoy an intuitive reading experience tailored for modern learners.
          </p>

          <div className="hero-actions">
            {isAuthenticated ? (
              <Link to={isAdmin ? "/admin/dashboard" : "/dashboard"} className="btn btn-primary btn-lg">
                Go to {isAdmin ? "Admin Portal" : "My Dashboard"} <ArrowRight size={18} />
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary btn-lg">
                  Create Free Account <ArrowRight size={18} />
                </Link>
                <Link to="/login" className="btn btn-secondary btn-lg">
                  Sign In to Library
                </Link>
              </>
            )}

            <Link to="/catalog" className="btn btn-outline btn-lg">
              <Search size={18} /> Browse Book Catalog
            </Link>
          </div>

          {/* Stats Ribbon */}
          <div className="stats-ribbon">
            <div className="stat-item">
              <div className="stat-value">{books.length * 15}+</div>
              <div className="stat-label">Physical & Digital Copies</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">500+</div>
              <div className="stat-label">Active Student Members</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">14 Days</div>
              <div className="stat-label">Standard Loan Period</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">100%</div>
              <div className="stat-label">Automated Lifecycle</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Books Section */}
      <section className="container" style={{ padding: "4rem 1.5rem" }}>
        <div className="section-header">
          <div>
            <span className="badge badge-primary" style={{ marginBottom: "0.5rem" }}>Handpicked Selection</span>
            <h2 className="section-title">Featured Library Books</h2>
            <p className="section-subtitle">Discover our most requested titles across engineering, computer science, and personal growth.</p>
          </div>
          <Link to="/catalog" className="btn btn-outline btn-sm">
            View All ({books.length}) <ChevronRight size={16} />
          </Link>
        </div>

        <div className="books-grid">
          {featuredBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section style={{ backgroundColor: "var(--bg-surface-secondary)", padding: "4.5rem 0", borderTop: "1px solid var(--border-light)", borderBottom: "1px solid var(--border-light)" }}>
        <div className="container">
          <div style={{ textAlign: "center", maxWidth: "650px", margin: "0 auto 3rem" }}>
            <span className="badge badge-primary" style={{ marginBottom: "0.5rem" }}>Streamlined Workflow</span>
            <h2 className="section-title">How BookBase Works</h2>
            <p className="section-subtitle">A friction-free borrowing lifecycle built according to academic requirements.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.75rem" }}>
            <div className="card" style={{ textAlign: "center" }}>
              <div className="brand-icon-wrapper" style={{ margin: "0 auto 1.25rem", background: "rgba(79, 70, 229, 0.12)", color: "var(--primary-600)" }}>
                <Users size={22} />
              </div>
              <h3 style={{ fontSize: "1.15rem", marginBottom: "0.5rem" }}>1. Register Account</h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", lineHeight: "1.5" }}>
                Select your role as <strong>User</strong> for reading & borrowing, or <strong>Admin</strong> for full library administration.
              </p>
            </div>

            <div className="card" style={{ textAlign: "center" }}>
              <div className="brand-icon-wrapper" style={{ margin: "0 auto 1.25rem", background: "rgba(6, 182, 212, 0.12)", color: "var(--accent-cyan)" }}>
                <Search size={22} />
              </div>
              <h3 style={{ fontSize: "1.15rem", marginBottom: "0.5rem" }}>2. Search & Select</h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", lineHeight: "1.5" }}>
                Explore curated catalogs by title, author, or category. Check real-time shelf availability and book metadata.
              </p>
            </div>

            <div className="card" style={{ textAlign: "center" }}>
              <div className="brand-icon-wrapper" style={{ margin: "0 auto 1.25rem", background: "rgba(16, 185, 129, 0.12)", color: "var(--success)" }}>
                <BookmarkCheck size={22} />
              </div>
              <h3 style={{ fontSize: "1.15rem", marginBottom: "0.5rem" }}>3. Instant Borrow</h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", lineHeight: "1.5" }}>
                One-click checkout logs your loan date and computes the due date automatically with zero paperwork.
              </p>
            </div>

            <div className="card" style={{ textAlign: "center" }}>
              <div className="brand-icon-wrapper" style={{ margin: "0 auto 1.25rem", background: "rgba(245, 158, 11, 0.12)", color: "var(--warning)" }}>
                <Clock size={22} />
              </div>
              <h3 style={{ fontSize: "1.15rem", marginBottom: "0.5rem" }}>4. Smart Return</h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", lineHeight: "1.5" }}>
                Return anytime with one click, or let the built-in system automatically process returns when due dates are reached.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Member Roles Banner */}
      <section className="container" style={{ padding: "4rem 1.5rem" }}>
        <div style={{ background: "linear-gradient(135deg, var(--neutral-900), var(--neutral-800))", color: "#fff", borderRadius: "var(--radius-xl)", padding: "2.75rem", boxShadow: "var(--shadow-xl)" }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "1.5rem", marginBottom: "2rem" }}>
            <div>
              <span className="badge" style={{ background: "rgba(99, 102, 241, 0.3)", color: "#a5b4fc", border: "1px solid rgba(165, 180, 252, 0.3)", marginBottom: "0.5rem" }}>
                Team Architecture
              </span>
              <h2 style={{ fontSize: "1.85rem", color: "#fff" }}>BookBase Engineering Team</h2>
              <p style={{ color: "#94a3b8", fontSize: "0.95rem" }}>Google Classroom Project Modules & Student Responsibilities</p>
            </div>

          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.25rem" }}>
            <div style={{ background: "rgba(255, 255, 255, 0.05)", padding: "1.25rem", borderRadius: "var(--radius-md)", border: "1px solid rgba(255, 255, 255, 0.1)" }}>
              <strong style={{ color: "#818cf8", display: "block", marginBottom: "0.35rem" }}>1. Sonal</strong>
              <div style={{ fontSize: "0.85rem", color: "#e2e8f0" }}>Authentication & Public Pages</div>
              <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "0.35rem" }}>Home, Login, Register, JWT & Route Protection</div>
            </div>

            <div style={{ background: "rgba(255, 255, 255, 0.05)", padding: "1.25rem", borderRadius: "var(--radius-md)", border: "1px solid rgba(255, 255, 255, 0.1)" }}>
              <strong style={{ color: "#34d399", display: "block", marginBottom: "0.35rem" }}>2. Amay</strong>
              <div style={{ fontSize: "0.85rem", color: "#e2e8f0" }}>User Dashboard & Profile</div>
              <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "0.35rem" }}>Borrowing metrics, Profile update, Password reset</div>
            </div>

            <div style={{ background: "rgba(255, 255, 255, 0.05)", padding: "1.25rem", borderRadius: "var(--radius-md)", border: "1px solid rgba(255, 255, 255, 0.1)" }}>
              <strong style={{ color: "#38bdf8", display: "block", marginBottom: "0.35rem" }}>3. Aniket</strong>
              <div style={{ fontSize: "0.85rem", color: "#e2e8f0" }}>Book Catalog & Search</div>
              <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "0.35rem" }}>Filter by genre, Book details & Search engine</div>
            </div>

            <div style={{ background: "rgba(255, 255, 255, 0.05)", padding: "1.25rem", borderRadius: "var(--radius-md)", border: "1px solid rgba(255, 255, 255, 0.1)" }}>
              <strong style={{ color: "#fbbf24", display: "block", marginBottom: "0.35rem" }}>4. Sonu</strong>
              <div style={{ fontSize: "0.85rem", color: "#e2e8f0" }}>Borrow & Return System</div>
              <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "0.35rem" }}>Auto return, Due dates & Loan history</div>
            </div>

            <div style={{ background: "rgba(255, 255, 255, 0.05)", padding: "1.25rem", borderRadius: "var(--radius-md)", border: "1px solid rgba(255, 255, 255, 0.1)" }}>
              <strong style={{ color: "#f87171", display: "block", marginBottom: "0.35rem" }}>5. Suraj</strong>
              <div style={{ fontSize: "0.85rem", color: "#e2e8f0" }}>Admin Panel & Controls</div>
              <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "0.35rem" }}>Manage Books CRUD, Users, Borrowings, Settings</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
