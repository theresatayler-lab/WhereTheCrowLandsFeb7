import React from "react";

/**
 * Leaf-only icon renderer. No logic, no mapping changes.
 * Uses .crowlands-icon so data-surface filters apply.
 */
export default function CrowlandsIcon({
  iconPath,
  alt = "",
  size = 20,
  className = "",
  title,
}) {
  if (!iconPath) return null;

  return (
    <img
      className={`crowlands-icon inline-block align-middle ${className}`}
      src={iconPath}
      alt={alt}
      title={title || alt}
      width={size}
      height={size}
      draggable={false}
      loading="lazy"
      decoding="async"
    />
  );
}
