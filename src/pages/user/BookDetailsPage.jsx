import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useBooks } from "../../context/BookContext";
import { useAuth } from "../../context/AuthContext";
import { BookCard } from "../../components/BookCard";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Layers,
  Globe,
  Hash,
  Building,
  Star,
  CheckCircle,
  AlertCircle,
  Clock,
  ShieldCheck
} from "lucide-react";
import confetti from "canvas-confetti";

export const BookDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { books, borrowBook, borrowings, settings } = useBooks();
  const { user, isAuthenticated, isAdmin } = useAuth();

  const book = books.find((b) => b.id === id);

  if (!book) {
    return (
      <div className="container" style={{ padding: "4rem 1.5rem", textAlign: "center" }}>
        <h2 style={{ marginBottom: "1rem" }}>Book Not Found</h2>
        <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem" }}>
          The book you are looking for does not exist in the BookBase database.
        </p>
        <Link to="/catalog" className="btn btn-primary">
          <ArrowLeft size={16} /> Back to Catalog
        </Link>
      </div>
    );
  }

  const isAvailable = book.availableCopies > 0;
  const isBorrowedByUser = isAuthenticated && borrowings.some(
    (b) => b.userId === user?.id && b.bookId === book.id && b.status !== "Returned"
  );

  const relatedBooks = books
    .filter((b) => b.category === book.category && b.id !== book.id)
    .slice(0, 3);

  const handleBorrow = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (isAdmin) {
      alert("Administrator accounts cannot check out books. Please log in as a student/user member.");
      return;
    }

    const res = borrowBook(book.id, user);
    if (res.success) {
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.7 }
        });
      } catch (err) {}
    }
  };

  return (
    <div className="container" style={{ padding: "2.5rem 1.5rem" }}>
      {/* Back button navigation */}
      <Link
        to="/catalog"
        className="btn btn-secondary btn-sm"
        style={{ marginBottom: "1.5rem", display: "inline-flex" }}
      >
        <ArrowLeft size={16} /> Back to Catalog
      </Link>

      {/* Main Details Card */}
      <div
        className="card"
        style={{
          display: "grid",
          gridTemplateColumns: "320px 1fr",
          gap: "2.5rem",
          padding: "2rem",
          marginBottom: "3rem"
        }}
      >
        {/* Cover Column */}
        <div>
          <div
            style={{
              borderRadius: "var(--radius-lg)",
              overflow: "hidden",
              boxShadow: "var(--shadow-xl)",
              border: "1px solid var(--border-light)"
            }}
          >
            <img
              src={book.coverImage}
              alt={book.title}
              style={{ width: "100%", height: "420px", objectFit: "cover" }}
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80";
              }}
            />
          </div>

          <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
            <span
              className={`badge ${isAvailable ? "badge-success" : "badge-danger"}`}
              style={{ fontSize: "0.85rem", padding: "0.4rem 1rem", width: "100%", justifyContent: "center" }}
            >
              {isAvailable ? `${book.availableCopies} of ${book.totalCopies} Copies Available` : "Currently Checked Out"}
            </span>
          </div>
        </div>

        {/* Info Column */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.5rem" }}>
            <span className="badge badge-primary">{book.category}</span>
            <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", color: "#d97706", fontSize: "0.9rem", fontWeight: 600 }}>
              <Star size={16} fill="#d97706" /> {book.rating || "4.8"}
              <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>({book.reviewsCount || 120} reviews)</span>
            </div>
          </div>

          <h1 style={{ fontSize: "2.2rem", fontWeight: 800, marginBottom: "0.5rem", lineHeight: 1.2 }}>
            {book.title}
          </h1>

          <div style={{ fontSize: "1.1rem", color: "var(--primary-600)", fontWeight: 600, marginBottom: "1.5rem" }}>
            By {book.author}
          </div>

          {/* Description */}
          <div style={{ marginBottom: "2rem" }}>
            <h3 style={{ fontSize: "1rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)", marginBottom: "0.5rem" }}>
              Synopsis & Overview
            </h3>
            <p style={{ color: "var(--text-main)", lineHeight: "1.7", fontSize: "0.975rem" }}>
              {book.description}
            </p>
          </div>

          {/* Publication information specification:
              - Category, ISBN, Publication information, Availability
          */}
          <div
            style={{
              background: "var(--bg-surface-secondary)",
              borderRadius: "var(--radius-md)",
              padding: "1.25rem",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              gap: "1rem",
              marginBottom: "2rem",
              fontSize: "0.85rem"
            }}
          >
            <div>
              <span style={{ color: "var(--text-muted)", display: "block", marginBottom: "0.2rem" }}>ISBN</span>
              <strong>{book.isbn || "978-0132350884"}</strong>
            </div>

            <div>
              <span style={{ color: "var(--text-muted)", display: "block", marginBottom: "0.2rem" }}>Publisher</span>
              <strong>{book.publisher || "Academic Press"}</strong>
            </div>

            <div>
              <span style={{ color: "var(--text-muted)", display: "block", marginBottom: "0.2rem" }}>Year</span>
              <strong>{book.publicationYear || "2021"}</strong>
            </div>

            <div>
              <span style={{ color: "var(--text-muted)", display: "block", marginBottom: "0.2rem" }}>Edition</span>
              <strong>{book.edition || "Latest Edition"}</strong>
            </div>

            <div>
              <span style={{ color: "var(--text-muted)", display: "block", marginBottom: "0.2rem" }}>Length</span>
              <strong>{book.pages || 420} Pages</strong>
            </div>

            <div>
              <span style={{ color: "var(--text-muted)", display: "block", marginBottom: "0.2rem" }}>Language</span>
              <strong>{book.language || "English"}</strong>
            </div>
          </div>

          {/* Borrow Action Area */}
          <div style={{ marginTop: "auto", display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            {isBorrowedByUser ? (
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <span className="badge badge-warning" style={{ padding: "0.6rem 1rem", fontSize: "0.9rem" }}>
                  <Clock size={16} /> Currently on loan by you
                </span>
                <Link to="/my-books" className="btn btn-outline">
                  View in My Books & Return
                </Link>
              </div>
            ) : (
              <button
                onClick={handleBorrow}
                disabled={!isAvailable}
                className={`btn btn-lg ${isAvailable ? "btn-primary" : "btn-secondary"}`}
                style={{ minWidth: "220px" }}
              >
                <BookOpen size={20} /> {isAvailable ? "Borrow This Book" : "Out of Stock"}
              </button>
            )}

            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "var(--text-muted)", fontSize: "0.85rem" }}>
              <ShieldCheck size={16} color="var(--success)" /> Standard {settings.loanDurationDays || 14}-day loan with auto-return guarantee
            </div>
          </div>
        </div>
      </div>

      {/* Related Books */}
      {relatedBooks.length > 0 && (
        <section>
          <div className="section-header">
            <div>
              <h2 className="section-title">Related Books in {book.category}</h2>
              <p className="section-subtitle">More recommended titles from this discipline</p>
            </div>
          </div>

          <div className="books-grid">
            {relatedBooks.map((rel) => (
              <BookCard key={rel.id} book={rel} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
