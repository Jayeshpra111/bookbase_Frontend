import React, { useState } from "react";
import { useBooks } from "../context/BookContext";
import { Clock, FastForward, RefreshCw, ChevronUp, ChevronDown, CheckCircle2 } from "lucide-react";

export const TimeSimulator = () => {
  const { simulateTimeTravel, checkDueDatesAndAutoReturn, resetAllData, settings } = useBooks();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="simulator-widget">
      {isOpen && (
        <div className="simulator-panel">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
            <span style={{ fontWeight: 700, fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <Clock size={16} color="var(--primary-600)" /> Life-Cycle Tester
            </span>
            <span className="badge badge-primary" style={{ fontSize: "0.65rem" }}>
              Demo Tool
            </span>
          </div>

          <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.85rem", lineHeight: "1.4" }}>
            Test <strong>Sonu's Borrow/Return requirement</strong>: <em>"If due date reached, return automatically"</em> without waiting 14 real days!
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <button
              onClick={() => simulateTimeTravel(7)}
              className="btn btn-secondary btn-sm"
              style={{ justifyContent: "flex-start" }}
            >
              <FastForward size={14} color="var(--warning)" /> Advance +7 Days (Due Soon)
            </button>

            <button
              onClick={() => simulateTimeTravel(15)}
              className="btn btn-secondary btn-sm"
              style={{ justifyContent: "flex-start" }}
            >
              <FastForward size={14} color="var(--danger)" /> Advance +15 Days (Trigger Auto-Return)
            </button>

            <button
              onClick={checkDueDatesAndAutoReturn}
              className="btn btn-outline btn-sm"
              style={{ justifyContent: "flex-start" }}
            >
              <CheckCircle2 size={14} /> Run Due Date Check Now
            </button>

            <hr style={{ border: "none", borderTop: "1px solid var(--border-light)", margin: "0.4rem 0" }} />

            <button
              onClick={resetAllData}
              className="btn btn-sm"
              style={{
                justifyContent: "flex-start",
                color: "var(--text-muted)",
                background: "transparent",
                border: "1px dashed var(--border-light)"
              }}
            >
              <RefreshCw size={13} /> Reset All Sample Data
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="simulator-bubble"
        title="Simulate due date progression"
      >
        <Clock size={16} color="#818cf8" />
        <span>Auto-Return Tester</span>
        {isOpen ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
      </button>
    </div>
  );
};
