import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useBooks } from "../context/BookContext";
import { BookOpen, Star, CheckCircle, Clock, Info } from "lucide-react";
import confetti from "canvas-confetti";

export const BookCard = ({ book }) => {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const { borrowBook, borrowings } = useBooks();
  const navigate = useNavigate();

  const isAvailable = book.availableCopies > 0;

  // Check if current user currently has this book borrowed
  const isBorrowedByCurrentUser = isAuthenticated && borrowings.some(
    (b) => b.userId === user?.id && b.bookId === book.id && b.status !== "Returned"
  );

  const handleBorrow = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (isAdmin) {
      alert("You are logged in as an Administrator. Please use a Member/User account to borrow books, or switch roles.");
      return;
    }
    const res = borrowBook(book.id, user);
    if (res.success) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 }
        });
      } catch (err) {
        // Confetti fallback
      }
    }
  };

  return (
    <div className="book-card">
      <div className="book-cover-container">
        <img
          src={book.coverImage}
          alt={book.title}
          className="book-cover-img"
          loading="lazy"
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80";
          }}
        />

        {/* Category Badge overlay */}
        <div className="book-badge-overlay">
          <span className="badge badge-primary">{book.category}</span>
        </div>

        {/* Availability Badge overlay */}
        <div className="book-stock-overlay">
          {isBorrowedByCurrentUser ? (
            <span className="badge badge-warning" title="You have an active loan for this book">
              Borrowed
            </span>
          ) : isAvailable ? (
            <span className="badge badge-success">
              {book.availableCopies} Left
            </span>
          ) : (
            <span className="badge badge-danger">
              Out of Stock
            </span>
          )}
        </div>
      </div>

      <div className="book-card-body">
        <span className="book-author">{book.author}</span>
        <h3 className="book-card-title" title={book.title}>
          <Link to={`/books/${book.id}`} style={{ color: "inherit" }}>
            {book.title}
          </Link>
        </h3>

        <div className="book-meta-row">
          <div className="book-rating">
            <Star size={14} fill="#d97706" color="#d97706" />
            <span>{book.rating || "4.8"}</span>
            <span style={{ color: "var(--text-subtle)", fontWeight: "normal" }}>({book.reviewsCount || 45})</span>
          </div>
          <span>{book.pages || 350} pages</span>
        </div>

        <div className="book-card-actions">
          <Link to={`/books/${book.id}`} className="btn btn-secondary btn-sm">
            <Info size={14} /> Details
          </Link>

          {isBorrowedByCurrentUser ? (
            <Link to="/my-books" className="btn btn-outline btn-sm">
              <Clock size={14} /> View Loan
            </Link>
          ) : (
            <button
              onClick={handleBorrow}
              disabled={!isAvailable}
              className={`btn btn-sm ${isAvailable ? "btn-primary" : "btn-secondary"}`}
            >
              <BookOpen size={14} /> {isAvailable ? "Borrow" : "Unavailable"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
