import React, { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useBooks } from "../../context/BookContext";
import { BookCard } from "../../components/BookCard";
import { sampleCategories } from "../../data/initialData";
import { Search, Filter, BookOpen, X, Sparkles } from "lucide-react";

export const SearchResultsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const { books } = useBooks();

  const [query, setQuery] = useState(initialQuery);
  const [searchField, setSearchField] = useState("all"); // "all", "title", "author", "category"
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [inStockOnly, setInStockOnly] = useState(false);

  // Synchronize URL query params
  const handleQueryChange = (val) => {
    setQuery(val);
    if (val.trim()) {
      setSearchParams({ q: val.trim() });
    } else {
      setSearchParams({});
    }
  };

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();

    return books.filter((book) => {
      // Stock check
      if (inStockOnly && book.availableCopies <= 0) return false;

      // Category filter check
      if (selectedCategory !== "All" && book.category.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }

      // If query is empty, match all remaining
      if (!q) return true;

      // Field specific search:
      // "Search by Title, Author, Category"
      if (searchField === "title") {
        return book.title.toLowerCase().includes(q);
      }
      if (searchField === "author") {
        return book.author.toLowerCase().includes(q);
      }
      if (searchField === "category") {
        return book.category.toLowerCase().includes(q);
      }

      // Default "all" fields
      return (
        book.title.toLowerCase().includes(q) ||
        book.author.toLowerCase().includes(q) ||
        book.category.toLowerCase().includes(q) ||
        (book.isbn && book.isbn.includes(q))
      );
    });
  }, [books, query, searchField, selectedCategory, inStockOnly]);

  return (
    <div className="container" style={{ padding: "2.5rem 1.5rem" }}>
      {/* Search Header */}
      <div style={{ maxWidth: "800px", margin: "0 auto 2.5rem", textAlign: "center" }}>
        <span className="badge badge-primary" style={{ marginBottom: "0.5rem" }}>
          Library Search Engine
        </span>
        <h1 style={{ fontSize: "2.2rem", fontWeight: 800, marginBottom: "0.5rem" }}>
          Find Books in BookBase
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", marginBottom: "1.5rem" }}>
          Search catalog items by <strong>Title</strong>, <strong>Author</strong>, or <strong>Category</strong>.
        </p>

        {/* Search Input Box */}
        <div
          style={{
            position: "relative",
            background: "var(--bg-surface)",
            border: "2px solid var(--primary-300)",
            borderRadius: "var(--radius-xl)",
            boxShadow: "var(--shadow-lg)",
            display: "flex",
            alignItems: "center",
            padding: "0.5rem 1rem"
          }}
        >
          <Search size={22} color="var(--primary-600)" style={{ marginRight: "0.75rem" }} />

          <input
            type="text"
            placeholder="Type book title, author name, or subject..."
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              fontSize: "1.05rem",
              background: "transparent",
              color: "var(--text-main)"
            }}
            autoFocus
          />

          {query && (
            <button
              onClick={() => handleQueryChange("")}
              style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", marginRight: "0.5rem" }}
            >
              <X size={18} />
            </button>
          )}

          {/* Search field selector */}
          <select
            value={searchField}
            onChange={(e) => setSearchField(e.target.value)}
            style={{
              padding: "0.4rem 0.75rem",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border-light)",
              backgroundColor: "var(--bg-surface-secondary)",
              color: "var(--text-main)",
              fontWeight: 600,
              fontSize: "0.85rem",
              cursor: "pointer"
            }}
          >
            <option value="all">All Fields</option>
            <option value="title">By Title</option>
            <option value="author">By Author</option>
            <option value="category">By Category</option>
          </select>
        </div>

        {/* Quick Filter Pills */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", marginTop: "1rem", flexWrap: "wrap", fontSize: "0.85rem" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "0.4rem", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
            />
            <span>In-Stock Only</span>
          </label>

          <span style={{ color: "var(--border-light)" }}>|</span>

          <span>Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              padding: "0.25rem 0.5rem",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--border-light)",
              background: "var(--bg-surface)",
              color: "var(--text-main)",
              fontSize: "0.825rem"
            }}
          >
            {sampleCategories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "1.25rem" }}>
          Search Results{" "}
          <span style={{ color: "var(--text-muted)", fontSize: "0.95rem", fontWeight: 400 }}>
            ({results.length} {results.length === 1 ? "result" : "results"})
          </span>
        </h2>

        {query && (
          <button
            onClick={() => {
              handleQueryChange("");
              setSearchField("all");
              setSelectedCategory("All");
              setInStockOnly(false);
            }}
            className="btn btn-secondary btn-sm"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Results Grid */}
      {results.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "4rem 2rem", maxWidth: "600px", margin: "0 auto" }}>
          <Search size={48} style={{ opacity: 0.3, marginBottom: "1rem", margin: "0 auto" }} />
          <h3 style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>No matching books found</h3>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
            We could not find any books matching "<strong>{query}</strong>" in <em>{searchField}</em>. Try broader search terms.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem" }}>
            <button onClick={() => setSearchField("all")} className="btn btn-outline btn-sm">
              Search All Fields
            </button>
            <button onClick={() => setSelectedCategory("All")} className="btn btn-secondary btn-sm">
              Reset Category
            </button>
          </div>
        </div>
      ) : (
        <div className="books-grid">
          {results.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
};
