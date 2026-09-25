import React, { useEffect } from "react";
import { useBooks } from "../context/BookContext";
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from "lucide-react";

export const Toast = () => {
  const { toastMessage, hideToast } = useBooks();

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => {
      hideToast();
    }, 4000);
    return () => clearTimeout(timer);
  }, [toastMessage, hideToast]);

  if (!toastMessage) return null;

  const getIcon = () => {
    switch (toastMessage.type) {
      case "success":
        return <CheckCircle2 size={20} color="var(--success)" />;
      case "error":
        return <AlertCircle size={20} color="var(--danger)" />;
      case "warning":
        return <AlertTriangle size={20} color="var(--warning)" />;
      default:
        return <Info size={20} color="var(--primary-500)" />;
    }
  };

  return (
    <div className="toast-container">
      <div className={`toast toast-${toastMessage.type || "info"}`}>
        {getIcon()}
        <span style={{ flex: 1 }}>{toastMessage.message}</span>
        <button
          onClick={hideToast}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--text-muted)",
            display: "flex",
            alignItems: "center"
          }}
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};
