import React from "react";

// PUBLIC_INTERFACE
function Check({ size = 20, stroke = "currentColor", ...props }) {
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
      <polyline points="20 6 10 17 4 11" />
    </svg>
  );
}
export default Check;
