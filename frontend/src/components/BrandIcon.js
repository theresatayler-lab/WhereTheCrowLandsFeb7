// ==========================================================================
// BRAND ICON COMPONENT
// Renders decorative icons from the brand asset library
// Supports gold (default) and pink (highlighted) variants
// ==========================================================================

import React from 'react';
import { BRAND_ASSETS, PINK_FILTER } from '../assets/brandAssets';

// Icon name to path mapping
const ICON_MAP = {
  moon: BRAND_ASSETS.icons.moon,
  book: BRAND_ASSETS.icons.book,
  star: BRAND_ASSETS.icons.star,
  skull: BRAND_ASSETS.icons.skull,
  key: BRAND_ASSETS.icons.key,
  sunMoon: BRAND_ASSETS.icons.sunMoon,
};

/**
 * BrandIcon - Renders a decorative brand icon
 * 
 * @param {string} name - Icon name: 'moon', 'book', 'star', 'skull', 'key', 'sunMoon'
 * @param {number} size - Size in pixels (default: 48)
 * @param {string} variant - 'gold' (default) or 'pink'
 * @param {number} opacity - Opacity 0-1 (default: 1)
 * @param {string} className - Additional CSS classes
 * @param {object} style - Additional inline styles
 * 
 * USAGE GUIDE:
 * - Moon:    Dividers, general mystical decoration
 * - Book:    Library page, Grimoire, Archives, knowledge cards
 * - Star:    Featured items, spell creation, magic actions, CTAs
 * - Skull:   Timeline, history sections, ancestor/lineage content
 * - Key:     Authentication, locked content, secrets revealed
 * - SunMoon: Day/night cycles, balance themes, celestial sections
 */
export const BrandIcon = ({ 
  name, 
  size = 48, 
  variant = 'gold', 
  opacity = 1,
  className = '',
  style = {},
}) => {
  const iconSrc = ICON_MAP[name];
  
  if (!iconSrc) {
    console.warn(`BrandIcon: Unknown icon name "${name}"`);
    return null;
  }
  
  return (
    <img 
      src={iconSrc}
      alt={`${name} icon`}
      className={className}
      style={{
        width: size,
        height: size,
        opacity: opacity,
        objectFit: 'contain',
        filter: variant === 'pink' ? PINK_FILTER : 'none',
        ...style,
      }}
    />
  );
};

// Convenience exports for specific icons
export const MoonIcon = (props) => <BrandIcon name="moon" {...props} />;
export const BookIcon = (props) => <BrandIcon name="book" {...props} />;
export const StarIcon = (props) => <BrandIcon name="star" {...props} />;
export const SkullIcon = (props) => <BrandIcon name="skull" {...props} />;
export const KeyIcon = (props) => <BrandIcon name="key" {...props} />;
export const SunMoonIcon = (props) => <BrandIcon name="sunMoon" {...props} />;

export default BrandIcon;
