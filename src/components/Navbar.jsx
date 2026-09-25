import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  BookOpen,
  Sun,
  Moon,
  LogOut,
  User,
  Shield,
  Search,
  BookMarked,
  LayoutDashboard,
  Settings,
  Users,
  FileText
} from "lucide-react";

export const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem("bookbase_theme") || "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("bookbase_theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate("/login");
  };

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        {/* Brand Logo */}
        <Link to="/" className="nav-brand">
          <div className="brand-icon-wrapper">
            <BookOpen size={22} />
          </div>
          <span>Book<span style={{ color: "var(--primary-600)" }}>Base</span></span>

        </Link>

        {/* Navigation Links */}
        <nav>
          <ul className="nav-links">
            <li>
              <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`} end>
                Home
              </NavLink>
            </li>

            {/* Public or User Catalog & Search */}
            <li>
              <NavLink to="/catalog" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                <BookMarked size={16} /> Catalog
              </NavLink>
            </li>
            <li>
              <NavLink to="/search" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                <Search size={16} /> Search
              </NavLink>
            </li>

            {/* User Specific Links */}
            {isAuthenticated && !isAdmin && (
              <>
                <li>
                  <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                    <LayoutDashboard size={16} /> Dashboard
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/my-books" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                    My Borrowed Books
                  </NavLink>
                </li>
              </>
            )}

            {/* Admin Specific Links */}
            {isAuthenticated && isAdmin && (
              <>
                <li>
                  <NavLink to="/admin/dashboard" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                    <LayoutDashboard size={16} /> Admin Panel
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/admin/books" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                    Manage Books
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/admin/users" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                    Manage Users
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/admin/borrowings" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                    Borrowings
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/admin/reports" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                    <FileText size={16} /> Reports
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </nav>

        {/* Right side controls: Theme toggle & Auth */}
        <div className="nav-right">
          <button
            onClick={toggleTheme}
            className="theme-toggle-btn"
            title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            aria-label="Toggle theme"
          >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          {isAuthenticated ? (
            <div className="user-menu">
              <button
                className="user-avatar-btn"
                onClick={() => setDropdownOpen((prev) => !prev)}
                title="Account options"
              >
                <img
                  src={user?.avatar || "https://api.dicebear.com/7.x/initials/svg?seed=User"}
                  alt={user?.name}
                  className="user-avatar-img"
                />
                <span>{user?.name?.split(" ")[0]}</span>
                <span className={`badge ${isAdmin ? "badge-danger" : "badge-primary"}`} style={{ fontSize: "0.65rem", padding: "0.1rem 0.4rem" }}>
                  {user?.role}
                </span>
              </button>

              {dropdownOpen && (
                <div className="user-dropdown-menu" onMouseLeave={() => setDropdownOpen(false)}>
                  <div className="dropdown-user-header">
                    <div className="dropdown-name">{user?.name}</div>
                    <div className="dropdown-email">{user?.email}</div>
                    <span className={`badge ${isAdmin ? "badge-danger" : "badge-primary"} dropdown-role-badge`}>
                      {user?.role === "Admin" ? "Librarian / Admin" : "Library Member"}
                    </span>
                  </div>

                  {!isAdmin ? (
                    <>
                      <Link to="/dashboard" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                        <LayoutDashboard size={16} /> User Dashboard
                      </Link>
                      <Link to="/my-books" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                        <BookMarked size={16} /> My Books & Returns
                      </Link>
                      <Link to="/profile" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                        <User size={16} /> My Profile & Password
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link to="/admin/dashboard" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                        <LayoutDashboard size={16} /> Admin Dashboard
                      </Link>
                      <Link to="/admin/books" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                        <BookOpen size={16} /> Manage Books (CRUD)
                      </Link>
                      <Link to="/admin/users" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                        <Users size={16} /> Manage Members
                      </Link>
                      <Link to="/admin/settings" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                        <Settings size={16} /> Library Settings
                      </Link>
                      <Link to="/profile" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                        <User size={16} /> Admin Profile
                      </Link>
                    </>
                  )}

                  <hr style={{ border: "none", borderTop: "1px solid var(--border-light)", margin: "0.4rem 0" }} />

                  <button className="dropdown-item danger-item" onClick={handleLogout}>
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <Link to="/login" className="btn btn-secondary btn-sm">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
