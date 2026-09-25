import React, { createContext, useContext, useState, useEffect } from "react";
import { initialUsers } from "../data/initialData";

const AuthContext = createContext();

const USERS_STORAGE_KEY = "bookbase_users";
const AUTH_USER_KEY = "bookbase_auth_user";
const AUTH_TOKEN_KEY = "bookbase_jwt_token";

// Helper to simulate JWT token generation
const generateSimulatedJWT = (user) => {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = btoa(
    JSON.stringify({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60 // 7 days
    })
  );
  const signature = btoa(`bb_sig_${user.id}_${Date.now()}`);
  return `${header}.${payload}.${signature}`;
};

export const AuthProvider = ({ children }) => {
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem(USERS_STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialUsers;
  });

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem(AUTH_USER_KEY);
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem(AUTH_TOKEN_KEY) || null;
  });

  const [loading, setLoading] = useState(false);

  // Sync users to localStorage
  useEffect(() => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  }, [users]);

  // Sync active user to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_USER_KEY);
    }
  }, [user]);

  // Sync token to localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem(AUTH_TOKEN_KEY, token);
    } else {
      localStorage.removeItem(AUTH_TOKEN_KEY);
    }
  }, [token]);

  // Login action
  const login = async ({ name, email, password, role }) => {
    setLoading(true);
    try {
      // Basic validation
      if (!name || !name.trim()) {
        throw new Error("Name is required.");
      }
      if (!email || !email.trim()) {
        throw new Error("Email is required.");
      }
      if (!password) {
        throw new Error("Password is required.");
      }
      if (!role) {
        throw new Error("Role (User or Admin) is required.");
      }

      // Check registered user
      const foundUser = users.find(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase()
      );

      if (!foundUser) {
        throw new Error("User not registered with this email address.");
      }

      if (foundUser.password !== password) {
        throw new Error("Incorrect password. Please try again.");
      }

      if (foundUser.isBlocked) {
        throw new Error("Your account has been blocked by the librarian. Please contact administration.");
      }

      if (foundUser.role.toLowerCase() !== role.toLowerCase()) {
        throw new Error(`Role mismatch. This account is registered as '${foundUser.role}'.`);
      }

      const jwt = generateSimulatedJWT(foundUser);
      setUser(foundUser);
      setToken(jwt);

      return { success: true, user: foundUser, role: foundUser.role };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Register action
  const register = async ({ name, email, country, role, password, confirmPassword }) => {
    setLoading(true);
    try {
      if (!name || !name.trim()) throw new Error("Name is required.");
      if (!email || !email.trim()) throw new Error("Email is required.");
      if (!country || !country.trim()) throw new Error("Country is required.");
      if (!role) throw new Error("Role is required.");
      if (!password || password.length < 6) {
        throw new Error("Password must be at least 6 characters long.");
      }
      if (password !== confirmPassword) {
        throw new Error("Passwords do not match.");
      }

      const existing = users.find(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase()
      );
      if (existing) {
        throw new Error("User already registered with this email. Please sign in.");
      }

      const newUser = {
        id: `u_${Date.now()}`,
        name: name.trim(),
        email: email.trim(),
        country: country.trim(),
        role: role,
        password: password,
        status: "Active",
        isBlocked: false,
        joinedDate: new Date().toISOString().split("T")[0],
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name.trim())}&backgroundColor=6366f1`,
        bio: `Member from ${country.trim()}.`,
        phone: "+91 90000 00000"
      };

      const updatedUsers = [...users, newUser];
      setUsers(updatedUsers);

      const jwt = generateSimulatedJWT(newUser);
      setUser(newUser);
      setToken(jwt);

      return { success: true, user: newUser, role: newUser.role };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Logout action
  const logout = () => {
    setUser(null);
    setToken(null);
  };

  // Update profile
  const updateProfile = (updatedFields) => {
    if (!user) return { success: false, error: "Not authenticated" };

    const updatedUser = { ...user, ...updatedFields };
    setUser(updatedUser);

    setUsers((prevUsers) =>
      prevUsers.map((u) => (u.id === user.id ? { ...u, ...updatedFields } : u))
    );

    return { success: true, user: updatedUser };
  };

  // Reset password
  const resetPassword = (currentPassword, newPassword) => {
    if (!user) return { success: false, error: "Not authenticated" };
    if (user.password !== currentPassword) {
      return { success: false, error: "Current password is incorrect." };
    }
    if (!newPassword || newPassword.length < 6) {
      return { success: false, error: "New password must be at least 6 characters long." };
    }

    const updatedUser = { ...user, password: newPassword };
    setUser(updatedUser);
    setUsers((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, password: newPassword } : u))
    );

    return { success: true };
  };

  // Admin user management functions
  const toggleBlockUser = (userId) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const newStatus = !u.isBlocked;
          return { ...u, isBlocked: newStatus, status: newStatus ? "Blocked" : "Active" };
        }
        return u;
      })
    );
  };

  const deleteUser = (userId) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        users,
        loading,
        isAuthenticated: !!token && !!user,
        isAdmin: user?.role?.toLowerCase() === "admin",
        login,
        register,
        logout,
        updateProfile,
        resetPassword,
        toggleBlockUser,
        deleteUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
