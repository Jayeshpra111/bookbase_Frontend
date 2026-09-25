import React, { useState, useMemo } from "react";
import { useBooks } from "../../context/BookContext";
import { sampleCategories } from "../../data/initialData";
import {
  BookOpen,
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  AlertCircle,
  CheckCircle,
  Eye,
  SlidersHorizontal
} from "lucide-react";

export const ManageBooksPage = () => {
  const { books, addBook, updateBook, deleteBook } = useBooks();

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [activeBook, setActiveBook] = useState(null);

  // Form state
  const initialForm = {
    title: "",
    author: "",
    category: "Computer Science",
    isbn: "",
    description: "",
    quantity: 5,
    coverImage: "",
    publisher: "Tech Publications",
    publicationYear: new Date().getFullYear(),
    pages: 350
  };

  const [formData, setFormData] = useState(initialForm);
  const [formError, setFormError] = useState("");

  const filteredBooks = useMemo(() => {
    return books.filter((b) => {
      const matchCat = selectedCategory === "All" || b.category.toLowerCase() === selectedCategory.toLowerCase();
      const q = search.trim().toLowerCase();
      const matchSearch =
        !q ||
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.isbn.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [books, search, selectedCategory]);

  const openAddModal = () => {
    setFormData(initialForm);
    setFormError("");
    setIsAddModalOpen(true);
  };

  const openEditModal = (book) => {
    setActiveBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      category: book.category,
      isbn: book.isbn,
      description: book.description,
      quantity: book.totalCopies,
      coverImage: book.coverImage,
      publisher: book.publisher || "Academic Press",
      publicationYear: book.publicationYear || 2022,
      pages: book.pages || 350
    });
    setFormError("");
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (book) => {
    setActiveBook(book);
    setIsDeleteModalOpen(true);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setFormError("Book title is required.");
      return;
    }
    if (!formData.author.trim()) {
      setFormError("Author name is required.");
      return;
    }
    if (!formData.isbn.trim()) {
      setFormError("ISBN is required.");
      return;
    }

    addBook(formData);
    setIsAddModalOpen(false);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.author.trim()) {
      setFormError("Title and author are required.");
      return;
    }

    updateBook(activeBook.id, formData);
    setIsEditModalOpen(false);
  };

  const confirmDelete = () => {
    if (activeBook) {
      deleteBook(activeBook.id);
      setIsDeleteModalOpen(false);
      setActiveBook(null);
    }
  };

  return (
    <div className="container" style={{ padding: "2.5rem 1.5rem" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem", marginBottom: "2rem" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.4rem" }}>
            <span className="badge badge-danger">Admin CRUD Control</span>
            <span className="badge badge-primary">Catalog Management</span>
          </div>
          <h1 className="section-title">Manage Books</h1>
          <p className="section-subtitle">
            Create, update, read, and delete library books in the BookBase repository.
          </p>
        </div>

        <button onClick={openAddModal} className="btn btn-primary">
          <Plus size={18} /> Add New Book
        </button>
      </div>

      {/* Filter and Search Bar */}
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
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", flex: 1, minWidth: "260px" }}>
          <div style={{ position: "relative", width: "100%", maxWidth: "340px" }}>
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
              placeholder="Filter by title, author, or ISBN..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="form-select"
            style={{ width: "auto" }}
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {sampleCategories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <span style={{ fontSize: "0.875rem", color: "var(--text-muted)", fontWeight: 600 }}>
          Total Catalog: <strong>{filteredBooks.length}</strong> Titles
        </span>
      </div>

      {/* Books CRUD Table */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div className="table-wrapper" style={{ border: "none" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Cover</th>
                <th>Title & Author</th>
                <th>Category</th>
                <th>ISBN</th>
                <th>Available / Total</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBooks.map((book) => (
                <tr key={book.id}>
                  <td style={{ width: "60px" }}>
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      style={{ width: "42px", height: "60px", objectFit: "cover", borderRadius: "4px" }}
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80";
                      }}
                    />
                  </td>
                  <td>
                    <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>{book.title}</div>
                    <div style={{ color: "var(--primary-600)", fontSize: "0.825rem" }}>{book.author}</div>
                  </td>
                  <td>
                    <span className="badge badge-primary">{book.category}</span>
                  </td>
                  <td>
                    <code style={{ fontSize: "0.8rem", background: "var(--bg-surface-secondary)", padding: "0.2rem 0.4rem", borderRadius: "4px" }}>
                      {book.isbn}
                    </code>
                  </td>
                  <td>
                    <strong style={{ color: book.availableCopies > 0 ? "var(--success)" : "var(--danger)" }}>
                      {book.availableCopies}
                    </strong>
                    <span style={{ color: "var(--text-muted)" }}> / {book.totalCopies} copies</span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <div style={{ display: "inline-flex", gap: "0.5rem" }}>
                      <button
                        onClick={() => openEditModal(book)}
                        className="btn btn-secondary btn-sm"
                        title="Edit book details"
                      >
                        <Edit2 size={14} /> Edit
                      </button>
                      <button
                        onClick={() => openDeleteModal(book)}
                        className="btn btn-danger btn-sm"
                        title="Delete book from catalog"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Book Modal */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="modal-overlay" onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: "1.3rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <BookOpen size={20} color="var(--primary-600)" />
                {isAddModalOpen ? "Add New Book to Catalog" : `Edit Book: ${activeBook?.title}`}
              </h3>
              <button
                className="modal-close-btn"
                onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }}
              >
                <X size={18} />
              </button>
            </div>

            {formError && (
              <div className="badge badge-danger" style={{ width: "100%", padding: "0.75rem", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <AlertCircle size={16} /> <span>{formError}</span>
              </div>
            )}

            <form onSubmit={isAddModalOpen ? handleAddSubmit : handleEditSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="title">Book Title *</label>
                <input
                  id="title"
                  type="text"
                  className="form-input"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Modern Web Development with React"
                  required
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="author">Author *</label>
                  <input
                    id="author"
                    type="text"
                    className="form-input"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    placeholder="e.g. Robert C. Martin"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="category">Category *</label>
                  <select
                    id="category"
                    className="form-select"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                  >
                    {sampleCategories.filter((c) => c !== "All").map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="isbn">ISBN Code *</label>
                  <input
                    id="isbn"
                    type="text"
                    className="form-input"
                    value={formData.isbn}
                    onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                    placeholder="978-0132350884"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="quantity">Total Inventory (Quantity) *</label>
                  <input
                    id="quantity"
                    type="number"
                    min="1"
                    max="100"
                    className="form-input"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value, 10) })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="coverImage">Cover Image URL</label>
                <input
                  id="coverImage"
                  type="url"
                  className="form-input"
                  value={formData.coverImage}
                  onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="description">Book Description / Synopsis</label>
                <textarea
                  id="description"
                  className="form-textarea"
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter detailed description of topics covered..."
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1.5rem" }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {isAddModalOpen ? "Add Book to Catalog" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="modal-overlay" onClick={() => setIsDeleteModalOpen(false)}>
          <div className="modal-content" style={{ maxWidth: "460px" }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: "1.2rem", display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--danger)" }}>
                <Trash2 size={20} /> Delete Book from Catalog
              </h3>
              <button className="modal-close-btn" onClick={() => setIsDeleteModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <p style={{ color: "var(--text-main)", fontSize: "0.95rem", marginBottom: "1rem" }}>
              Are you sure you want to delete <strong>"{activeBook?.title}"</strong>?
            </p>
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "1.5rem" }}>
              This will remove this book and all its inventory copies from the library catalog. This action cannot be undone.
            </p>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
              <button className="btn btn-secondary" onClick={() => setIsDeleteModalOpen(false)}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={confirmDelete}>
                Yes, Delete Book
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
