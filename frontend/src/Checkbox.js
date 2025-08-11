import React from "react";
import "./checkbox.css";
import Check from "./Check";

// PUBLIC_INTERFACE
function Checkbox({ className = "", checked, ...props }) {
  // Renders a circular checkbox with a minimal check icon inside when active
  return (
    <span
      style={{
        display: "inline-block",
        position: "relative",
        width: 20,
        height: 20,
        verticalAlign: "middle",
      }}
      className={className}
    >
      <input
        type="checkbox"
        checked={!!checked}
        className="custom-checkbox"
        style={{
          width: 20,
          height: 20,
          margin: 0,
          padding: 0,
          position: "absolute",
          left: 0,
          top: 0,
          zIndex: 2,
          opacity: 0, // visually hidden but accessible
          cursor: "pointer",
        }}
        {...props}
        readOnly={false}
      />
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 20,
          height: 20,
          borderRadius: "9999px",
          border: checked
            ? "2px solid #8B5CF6"
            : "2px solid rgba(255,255,255,0.7)",
          background: checked ? "#8B5CF6" : "#1E1E1E",
          transition: "border 0.2s, background 0.2s",
          pointerEvents: "none",
        }}
        aria-hidden="true"
      >
        {checked ? (
          <Check
            size={16}
            stroke="#fff"
            style={{ pointerEvents: "none", display: "block" }}
            data-testid="checkbox-check"
          />
        ) : null}
      </span>
    </span>
  );
}

export default Checkbox;
