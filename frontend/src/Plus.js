import React from "react";

// PUBLIC_INTERFACE
function Plus({ size = 24, stroke = "currentColor", ...props }) {
  return (
    <svg
      width={size}
      height={size}
      fill="none"
      stroke={stroke}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
      aria-hidden="true"
      {...props}
    >
      <line x1="12" x2="12" y1="5" y2="19"></line>
      <line x1="5" x2="19" y1="12" y2="12"></line>
    </svg>
  );
}
export default Plus;
