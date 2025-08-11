import React from "react";
import "./input.css";

// PUBLIC_INTERFACE
function Input({ className = "", ...props }) {
  return (
    <input
      {...props}
      className={"custom-input " + className}
      autoComplete="off"
      spellCheck="false"
    />
  );
}

export default Input;
