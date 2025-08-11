import React from "react";

/**
 * PUBLIC_INTERFACE
 * Pixel-perfect Check icon.
 *
 * Renders a crisp, centered check mark with proper color and alignment for both checked and completed states.
 */
function Check({
  size = 20,
  stroke = "currentColor", // usually white on checked, or purple/brand color
  className = "",
  ...props
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      stroke={stroke}
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      {...props}
      style={{
        display: "block",
        verticalAlign: "middle",
        ...props.style
      }}
    >
      {/* Perfectly aligned check - slight offsets for pixel alignment */}
      <path d="M5.5 10.5L9 14L15 7" />
    </svg>
  );
}
export default Check;
