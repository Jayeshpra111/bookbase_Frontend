import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useBooks } from "../../context/BookContext";
import { BookCard } from "../../components/BookCard";
import { sampleCategories } from "../../data/initialData";
import { Search, Filter, SlidersHorizontal, BookOpen } from "lucide-react";

export const BookCatalog = () => {
  const { books } = useBooks();

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [availabilityFilter, setAvailabilityFilter] = useState("all"); // "all", "available"
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("popular"); // "popular", "title", "author", "newest"

  // Filter and sort books
  const filteredBooks = useMemo(() => {
    return books
      .filter((book) => {
        // Category filter
        const matchCategory =
          selectedCategory === "All" || book.category.toLowerCase() === selectedCategory.toLowerCase();

        // Availability filter
        const matchAvailability =
          availabilityFilter === "all" || (availabilityFilter === "available" && book.availableCopies > 0);

        // Search text
        const query = searchQuery.trim().toLowerCase();
        const matchSearch =
          !query ||
          book.title.toLowerCase().includes(query) ||
          book.author.toLowerCase().includes(query) ||
          book.category.toLowerCase().includes(query);

        return matchCategory && matchAvailability && matchSearch;
      })
      .sort((a, b) => {
        if (sortBy === "title") return a.title.localeCompare(b.title);
        if (sortBy === "author") return a.author.localeCompare(b.author);
        if (sortBy === "newest") return (b.publicationYear || 0) - (a.publicationYear || 0);
        return (b.rating || 0) - (a.rating || 0); // default popular
      });
  }, [books, selectedCategory, availabilityFilter, searchQuery, sortBy]);

  return (
    <div className="container" style={{ padding: "2.5rem 1.5rem" }}>
      {/* Header */}
      <div className="section-header" style={{ flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <span className="badge badge-primary" style={{ marginBottom: "0.4rem" }}>
            Library Repository
          </span>
          <h1 className="section-title">Book Catalog</h1>
          <p className="section-subtitle">
            Explore all available books in BookBase. Filter by academic field or search directly.
          </p>
        </div>

        {/* Quick Search inside Catalog */}
        <div style={{ position: "relative", minWidth: "280px" }}>
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
            placeholder="Search catalog..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Category Pills Slider */}
      <div className="category-pills">
        {sampleCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`category-pill ${selectedCategory === cat ? "active" : ""}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Filter and Sorting Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
          padding: "0.85rem 1.25rem",
          background: "var(--bg-surface)",
          border: "1px solid var(--border-light)",
          borderRadius: "var(--radius-lg)",
          marginBottom: "2rem"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", fontSize: "0.875rem" }}>
          <span style={{ fontWeight: 600, color: "var(--text-muted)" }}>
            Showing <strong>{filteredBooks.length}</strong> {filteredBooks.length === 1 ? "book" : "books"}
          </span>

          <label style={{ display: "flex", alignItems: "center", gap: "0.4rem", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={availabilityFilter === "available"}
              onChange={(e) => setAvailabilityFilter(e.target.checked ? "available" : "all")}
            />
            <span>Available Only</span>
          </label>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.875rem" }}>
          <span style={{ color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "0.3rem" }}>
            <SlidersHorizontal size={14} /> Sort By:
          </span>
          <select
            className="form-select"
            style={{ padding: "0.4rem 0.75rem", fontSize: "0.85rem", width: "auto" }}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="popular">Most Popular / Highest Rated</option>
            <option value="title">Title (A-Z)</option>
            <option value="author">Author (A-Z)</option>
            <option value="newest">Publication Year (Newest)</option>
          </select>
        </div>
      </div>

      {/* Catalog Grid */}
      {filteredBooks.length === 0 ? (
        <div
          className="card"
          style={{ textAlign: "center", padding: "4rem 2rem", maxWidth: "600px", margin: "2rem auto" }}
        >
          <BookOpen size={48} style={{ opacity: 0.3, marginBottom: "1rem", margin: "0 auto" }} />
          <h3 style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>No matching books found</h3>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
            We couldn't find any books matching your active filters or search terms. Try clearing filters.
          </p>
          <button
            onClick={() => {
              setSelectedCategory("All");
              setAvailabilityFilter("all");
              setSearchQuery("");
            }}
            className="btn btn-primary btn-sm"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="books-grid">
          {filteredBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
};
