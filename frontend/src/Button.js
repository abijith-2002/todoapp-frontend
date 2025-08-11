import React from "react";
import "./button.css";

// PUBLIC_INTERFACE
function Button({ className = "", children, ...props }) {
  return (
    <button
      {...props}
      className={"custom-btn " + className}
    >
      {children}
    </button>
  );
}

export default Button;
