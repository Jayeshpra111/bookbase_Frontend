import React, { useState, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import { useBooks } from "../../context/BookContext";
import {
  Users,
  Search,
  Shield,
  UserCheck,
  UserX,
  Eye,
  Mail,
  Globe,
  Calendar,
  BookOpen,
  X,
  AlertCircle,
  Clock
} from "lucide-react";

export const ManageUsersPage = () => {
  const { users, toggleBlockUser, user: currentUser } = useAuth();
  const { getUserBorrowings, showToast } = useBooks();

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [selectedUser, setSelectedUser] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const q = search.trim().toLowerCase();
      const matchSearch =
        !q ||
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.country.toLowerCase().includes(q);

      const matchRole = roleFilter === "all" || u.role.toLowerCase() === roleFilter.toLowerCase();
      const matchStatus =
        statusFilter === "all" ||
        (statusFilter === "blocked" && u.isBlocked) ||
        (statusFilter === "active" && !u.isBlocked);

      return matchSearch && matchRole && matchStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  const openUserDetails = (userObj) => {
    setSelectedUser(userObj);
    setIsDetailsModalOpen(true);
  };

  const handleToggleBlock = (userObj) => {
    if (userObj.id === currentUser?.id) {
      showToast("You cannot block your own administrator account!", "error");
      return;
    }
    toggleBlockUser(userObj.id);
    const newStatus = !userObj.isBlocked;
    showToast(
      `${userObj.name} has been ${newStatus ? "blocked" : "unblocked and restored"}.`,
      newStatus ? "warning" : "success"
    );
  };

  const userLoans = selectedUser ? getUserBorrowings(selectedUser.id) : [];

  return (
    <div className="container" style={{ padding: "2.5rem 1.5rem" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem", marginBottom: "2rem" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.4rem" }}>
            <span className="badge badge-primary">Member Accounts</span>
          </div>
          <h1 className="section-title">Manage Members & Users</h1>
          <p className="section-subtitle">
            View student accounts, search by name/country, inspect borrow history, and enforce block/unblock privileges.
          </p>
        </div>

        <div className="badge badge-primary" style={{ padding: "0.5rem 1rem", fontSize: "0.9rem" }}>
          Total Accounts: {users.length}
        </div>
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
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", flex: 1, minWidth: "260px", flexWrap: "wrap" }}>
          {/* Search Box */}
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
              placeholder="Search by name, email, or country..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Role Filter */}
          <select
            className="form-select"
            style={{ width: "auto" }}
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="all">All Roles</option>
            <option value="user">Library Members (User)</option>
            <option value="admin">Administrators (Admin)</option>
          </select>

          {/* Status Filter */}
          <select
            className="form-select"
            style={{ width: "auto" }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="blocked">Blocked Only</option>
          </select>
        </div>

        <span style={{ fontSize: "0.875rem", color: "var(--text-muted)", fontWeight: 600 }}>
          Showing <strong>{filteredUsers.length}</strong> Accounts
        </span>
      </div>

      {/* Users Table */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div className="table-wrapper" style={{ border: "none" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Member</th>
                <th>Email</th>
                <th>Country</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined Date</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => {
                const isBlocked = u.isBlocked;
                return (
                  <tr key={u.id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <img
                          src={u.avatar || "https://api.dicebear.com/7.x/initials/svg?seed=User"}
                          alt={u.name}
                          style={{ width: "36px", height: "36px", borderRadius: "var(--radius-full)", objectFit: "cover" }}
                        />
                        <div>
                          <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>{u.name}</div>
                          {u.id === currentUser?.id && (
                            <span style={{ fontSize: "0.7rem", color: "var(--primary-600)", fontWeight: 600 }}>
                              (You - Current Session)
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>{u.email}</td>
                    <td>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                        <Globe size={14} color="var(--text-muted)" /> {u.country || "India"}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${u.role === "Admin" ? "badge-danger" : "badge-primary"}`}>
                        {u.role}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${isBlocked ? "badge-danger" : "badge-success"}`}>
                        {isBlocked ? "Blocked" : "Active"}
                      </span>
                    </td>
                    <td>{u.joinedDate || "2025-02-15"}</td>
                    <td style={{ textAlign: "right" }}>
                      <div style={{ display: "inline-flex", gap: "0.5rem" }}>
                        <button
                          onClick={() => openUserDetails(u)}
                          className="btn btn-secondary btn-sm"
                          title="View user details & loans"
                        >
                          <Eye size={14} /> Details
                        </button>

                        {/* Block/Unblock toggle as requested in spec */}
                        <button
                          onClick={() => handleToggleBlock(u)}
                          disabled={u.id === currentUser?.id}
                          className={`btn btn-sm ${isBlocked ? "btn-success" : "btn-danger"}`}
                          title={isBlocked ? "Unblock account" : "Block account from borrowing"}
                        >
                          {isBlocked ? (
                            <>
                              <UserCheck size={14} /> Unblock
                            </>
                          ) : (
                            <>
                              <UserX size={14} /> Block
                            </>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Details Modal */}
      {isDetailsModalOpen && selectedUser && (
        <div className="modal-overlay" onClick={() => setIsDetailsModalOpen(false)}>
          <div className="modal-content" style={{ maxWidth: "620px" }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Users size={20} color="var(--primary-600)" /> Student Account Profile
              </h3>
              <button className="modal-close-btn" onClick={() => setIsDetailsModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", marginBottom: "1.5rem" }}>
              <img
                src={selectedUser.avatar || "https://api.dicebear.com/7.x/initials/svg?seed=User"}
                alt={selectedUser.name}
                style={{ width: "70px", height: "70px", borderRadius: "var(--radius-full)", border: "2px solid var(--primary-300)" }}
              />
              <div>
                <h4 style={{ fontSize: "1.2rem", fontWeight: 700 }}>{selectedUser.name}</h4>
                <div style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "0.35rem" }}>
                  {selectedUser.email} • {selectedUser.phone || "+91 98765 00000"}
                </div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <span className={`badge ${selectedUser.role === "Admin" ? "badge-danger" : "badge-primary"}`}>
                    {selectedUser.role}
                  </span>
                  <span className={`badge ${selectedUser.isBlocked ? "badge-danger" : "badge-success"}`}>
                    {selectedUser.isBlocked ? "Blocked from Library" : "Active Member"}
                  </span>
                </div>
              </div>
            </div>

            <div style={{ background: "var(--bg-surface-secondary)", padding: "1rem", borderRadius: "var(--radius-md)", marginBottom: "1.5rem", fontSize: "0.85rem" }}>
              <div style={{ marginBottom: "0.4rem" }}><strong>Country:</strong> {selectedUser.country}</div>
              <div style={{ marginBottom: "0.4rem" }}><strong>Joined Date:</strong> {selectedUser.joinedDate}</div>
              <div><strong>Bio / Notes:</strong> {selectedUser.bio || "Registered library student."}</div>
            </div>

            <h4 style={{ fontSize: "1rem", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <BookOpen size={16} /> Borrowing History ({userLoans.length} total)
            </h4>

            {userLoans.length === 0 ? (
              <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>No book loans recorded for this member.</p>
            ) : (
              <div className="table-wrapper" style={{ maxHeight: "200px" }}>
                <table className="data-table" style={{ fontSize: "0.8rem" }}>
                  <thead>
                    <tr>
                      <th>Book</th>
                      <th>Borrow Date</th>
                      <th>Due Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userLoans.map((l) => (
                      <tr key={l.id}>
                        <td>{l.bookTitle}</td>
                        <td>{l.borrowDate}</td>
                        <td>{l.dueDate}</td>
                        <td>
                          <span className={`badge ${l.status === "Overdue" ? "badge-danger" : l.status === "Returned" ? "badge-success" : "badge-warning"}`}>
                            {l.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1.5rem" }}>
              <button
                onClick={() => {
                  handleToggleBlock(selectedUser);
                  setIsDetailsModalOpen(false);
                }}
                disabled={selectedUser.id === currentUser?.id}
                className={`btn btn-sm ${selectedUser.isBlocked ? "btn-success" : "btn-danger"}`}
              >
                {selectedUser.isBlocked ? "Unblock Account" : "Block Account"}
              </button>
              <button className="btn btn-secondary btn-sm" onClick={() => setIsDetailsModalOpen(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
