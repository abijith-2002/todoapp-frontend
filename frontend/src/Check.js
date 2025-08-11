import React from "react";

/**
 * PUBLIC_INTERFACE
 * Minimal modern line-style Checkmark icon for tasks and checkboxes.
 *
 * - Clean, elegant, and visually distinct at any size.
 * - Adapts to dark/light surfaces.
 * - Uses the Kavia brand accent for checked/completed states.
 */
function Check({
  size = 20,
  stroke = "currentColor",
  className = "",
  style = {},
  ...props
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      stroke={stroke}
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      style={{
        display: "block",
        verticalAlign: "middle",
        ...style,
      }}
      {...props}
    >
      {/* Sleek, open-angled modern check (pixel-perfect for 20x20) */}
      <polyline points="5 11 9 15 15 6" />
    </svg>
  );
}
export default Check;
