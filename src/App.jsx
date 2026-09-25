import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { BookProvider } from "./context/BookContext";

// Components
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { Toast } from "./components/Toast";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { TimeSimulator } from "./components/TimeSimulator";

// Public Pages
import { HomePage } from "./pages/public/HomePage";
import { LoginPage } from "./pages/public/LoginPage";
import { RegisterPage } from "./pages/public/RegisterPage";

// User Pages
import { UserDashboard } from "./pages/user/UserDashboard";
import { BookCatalog } from "./pages/user/BookCatalog";
import { BookDetailsPage } from "./pages/user/BookDetailsPage";
import { SearchResultsPage } from "./pages/user/SearchResultsPage";
import { MyBooksPage } from "./pages/user/MyBooksPage";
import { ProfilePage } from "./pages/user/ProfilePage";

// Admin Pages
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { ManageBooksPage } from "./pages/admin/ManageBooksPage";
import { ManageUsersPage } from "./pages/admin/ManageUsersPage";
import { ManageBorrowingsPage } from "./pages/admin/ManageBorrowingsPage";
import { AdminSettingsPage } from "./pages/admin/AdminSettingsPage";
import { AdminReportsPage } from "./pages/admin/AdminReportsPage";

import "./App.css";

function App() {
  return (
    <AuthProvider>
      <BookProvider>
        <BrowserRouter>
          <div className="app-container">
            <Navbar />

            <main className="main-content">
              <Routes>
                {/* Public Pages */}
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Catalog & Search */}
                <Route path="/catalog" element={<BookCatalog />} />
                <Route path="/books/:id" element={<BookDetailsPage />} />
                <Route path="/search" element={<SearchResultsPage />} />

                {/* User Protected Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute requiredRole="User">
                      <UserDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/my-books"
                  element={
                    <ProtectedRoute requiredRole="User">
                      <MyBooksPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />

                {/* Admin Protected Routes */}
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute requiredRole="Admin">
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/books"
                  element={
                    <ProtectedRoute requiredRole="Admin">
                      <ManageBooksPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/users"
                  element={
                    <ProtectedRoute requiredRole="Admin">
                      <ManageUsersPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/borrowings"
                  element={
                    <ProtectedRoute requiredRole="Admin">
                      <ManageBorrowingsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/settings"
                  element={
                    <ProtectedRoute requiredRole="Admin">
                      <AdminSettingsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/reports"
                  element={
                    <ProtectedRoute requiredRole="Admin">
                      <AdminReportsPage />
                    </ProtectedRoute>
                  }
                />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>

            <Footer />
            <Toast />
            <TimeSimulator />
          </div>
        </BrowserRouter>
      </BookProvider>
    </AuthProvider>
  );
}

export default App;
