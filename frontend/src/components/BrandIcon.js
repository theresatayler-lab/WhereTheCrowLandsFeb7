// ==========================================================================
// BRAND ICON COMPONENT
// Renders decorative icons from the brand asset library
// Supports gold (default) and pink (highlighted) variants
// ==========================================================================

import React from 'react';
import { BRAND_ASSETS, PINK_FILTER } from '../assets/brandAssets';

// Icon name to path mapping
const ICON_MAP = {
  // Mystical & Celestial
  moon: BRAND_ASSETS.icons.moon,
  sunMoon: BRAND_ASSETS.icons.sunMoon,
  eye: BRAND_ASSETS.icons.eye,
  hexagram: BRAND_ASSETS.icons.hexagram,
  
  // Magic & Ritual
  pentagram: BRAND_ASSETS.icons.pentagram,
  star: BRAND_ASSETS.icons.star,
  ouroboros: BRAND_ASSETS.icons.ouroboros,
  
  // Knowledge & Access
  book: BRAND_ASSETS.icons.book,
  key: BRAND_ASSETS.icons.key,
  
  // History & Structure
  skull: BRAND_ASSETS.icons.skull,
  column: BRAND_ASSETS.icons.column,
  
  // Nature & Symbols (NEW)
  bird: BRAND_ASSETS.icons.bird,
  buck: BRAND_ASSETS.icons.buck,
  rose: BRAND_ASSETS.icons.rose,
  threestars: BRAND_ASSETS.icons.threestars,
  threestarsHorizontal: BRAND_ASSETS.icons.threestarsHorizontal,
};

/**
 * BrandIcon - Renders a decorative brand icon
 * 
 * @param {string} name - Icon name (see ICON_MAP above)
 * @param {number} size - Size in pixels (default: 48)
 * @param {string} variant - 'gold' (default) or 'pink'
 * @param {number} opacity - Opacity 0-1 (default: 1)
 * @param {string} className - Additional CSS classes
 * @param {object} style - Additional inline styles
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
export const SunMoonIcon = (props) => <BrandIcon name="sunMoon" {...props} />;
export const EyeIcon = (props) => <BrandIcon name="eye" {...props} />;
export const HexagramIcon = (props) => <BrandIcon name="hexagram" {...props} />;
export const PentagramIcon = (props) => <BrandIcon name="pentagram" {...props} />;
export const StarIcon = (props) => <BrandIcon name="star" {...props} />;
export const OuroborosIcon = (props) => <BrandIcon name="ouroboros" {...props} />;
export const BookIcon = (props) => <BrandIcon name="book" {...props} />;
export const KeyIcon = (props) => <BrandIcon name="key" {...props} />;
export const SkullIcon = (props) => <BrandIcon name="skull" {...props} />;
export const ColumnIcon = (props) => <BrandIcon name="column" {...props} />;
// NEW icons
export const BirdIcon = (props) => <BrandIcon name="bird" {...props} />;
export const BuckIcon = (props) => <BrandIcon name="buck" {...props} />;
export const RoseIcon = (props) => <BrandIcon name="rose" {...props} />;
export const ThreeStarsIcon = (props) => <BrandIcon name="threestars" {...props} />;
export const ThreeStarsHorizontalIcon = (props) => <BrandIcon name="threestarsHorizontal" {...props} />;

export default BrandIcon;
