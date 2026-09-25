import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Route protector for role-based access control (User and Admin)
 * Verifies JWT session and ensures correct role permissions.
 */
export const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div className="badge badge-primary" style={{ padding: "0.5rem 1rem", fontSize: "0.9rem" }}>
            Verifying credentials & role permissions...
          </div>
        </div>
      </div>
    );
  }

  // If user is not authenticated, redirect to login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If a specific role is required, verify matching role
  if (requiredRole) {
    const userRoleLower = user.role?.toLowerCase();
    const reqRoleLower = requiredRole.toLowerCase();

    if (userRoleLower !== reqRoleLower) {
      // Role mismatch: redirect to their respective dashboard
      if (userRoleLower === "admin") {
        return <Navigate to="/admin/dashboard" replace />;
      } else {
        return <Navigate to="/dashboard" replace />;
      }
    }
  }

  return children;
};
