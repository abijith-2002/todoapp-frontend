import React from "react";
import "./checkbox.css";

// PUBLIC_INTERFACE
function Checkbox({ className = "", checked, ...props }) {
  return (
    <input
      type="checkbox"
      checked={!!checked}
      className={"custom-checkbox " + className}
      {...props}
      readOnly={false}
    />
  );
}

export default Checkbox;
