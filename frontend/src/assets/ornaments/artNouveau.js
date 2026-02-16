// ============================================================================
// CROWLANDS ART NOUVEAU ORNAMENT LIBRARY V2.0
// BOLD, THICK, VISUALLY STUNNING
// Gold strokes ONLY — never fills behind text
// ============================================================================

import React from 'react';

// Color tokens from new palette - REFINED for clarity
export const NOUVEAU_COLORS = {
  // Backgrounds
  midnightTeal: '#0E2A2F',
  celestialBlue: '#143D42',      // Slightly more saturated teal
  
  // Light tones
  vellum: '#F3EFE8',             // Warmer, creamier
  cream: '#F3EFE8',              // Muted cream for contrast
  
  // Gold accents - distinct from pink
  antiqueGold: '#C8A44D',        // Brighter, cleaner gold
  mutedBrass: '#A68A3C',         // Deeper brass for contrast
  
  // Pink/Rose accents - cleaner separation
  roseClay: '#C46B5C',           // Warmer terracotta
  emberPink: '#B94E6A',          // Cleaner pink, less muddy
};

// ============================================================================
// HALO ARC CORNERS — BOLD, Architectural
// ============================================================================

export const HaloCorner = ({ 
  size = 80, 
  color = NOUVEAU_COLORS.antiqueGold, 
  position = 'top-left',
  opacity = 0.8 
}) => {
  const rotations = {
    'top-left': 0,
    'top-right': 90,
    'bottom-right': 180,
    'bottom-left': 270
  };
  
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 80 80" 
      fill="none"
      style={{ transform: `rotate(${rotations[position]}deg)` }}
    >
      {/* Primary arc - BOLD */}
      <path 
        d="M0 65 Q0 0 65 0" 
        stroke={color} 
        strokeWidth="3" 
        opacity={opacity}
        fill="none"
      />
      {/* Secondary arc */}
      <path 
        d="M0 48 Q0 0 48 0" 
        stroke={color} 
        strokeWidth="2" 
        opacity={opacity * 0.7}
        fill="none"
      />
      {/* Inner arc */}
      <path 
        d="M0 32 Q0 0 32 0" 
        stroke={color} 
        strokeWidth="1.5" 
        opacity={opacity * 0.5}
        fill="none"
      />
      {/* Decorative circle cluster */}
      <circle 
        cx="22" 
        cy="22" 
        r="5" 
        stroke={color} 
        strokeWidth="2" 
        fill="none" 
        opacity={opacity * 0.8}
      />
      <circle 
        cx="22" 
        cy="22" 
        r="2.5" 
        stroke={color} 
        strokeWidth="1.5" 
        fill="none" 
        opacity={opacity * 0.6}
      />
      <circle 
        cx="22" 
        cy="22" 
        r="1" 
        fill={color} 
        opacity={opacity * 0.7}
      />
      {/* Radiating accent lines */}
      <path d="M10 10 L16 16" stroke={color} strokeWidth="1.5" opacity={opacity * 0.4} />
      <path d="M6 18 L12 20" stroke={color} strokeWidth="1" opacity={opacity * 0.3} />
      <path d="M18 6 L20 12" stroke={color} strokeWidth="1" opacity={opacity * 0.3} />
    </svg>
  );
};

export const HaloCornerElaborate = ({ 
  size = 100, 
  color = NOUVEAU_COLORS.antiqueGold,
  accentColor = NOUVEAU_COLORS.roseClay,
  position = 'top-left',
  opacity = 0.8 
}) => {
  const rotations = {
    'top-left': 0,
    'top-right': 90,
    'bottom-right': 180,
    'bottom-left': 270
  };
  
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none"
      style={{ transform: `rotate(${rotations[position]}deg)` }}
    >
      {/* Outermost arc - EXTRA BOLD */}
      <path 
        d="M0 80 Q0 0 80 0" 
        stroke={color} 
        strokeWidth="4" 
        opacity={opacity}
        fill="none"
      />
      {/* Second arc */}
      <path 
        d="M0 62 Q0 0 62 0" 
        stroke={color} 
        strokeWidth="2.5" 
        opacity={opacity * 0.75}
        fill="none"
      />
      {/* Third arc */}
      <path 
        d="M0 45 Q0 0 45 0" 
        stroke={color} 
        strokeWidth="2" 
        opacity={opacity * 0.55}
        fill="none"
      />
      {/* Inner arc */}
      <path 
        d="M0 30 Q0 0 30 0" 
        stroke={color} 
        strokeWidth="1.5" 
        opacity={opacity * 0.4}
        fill="none"
      />
      {/* Radiating lines from corner */}
      <path d="M8 8 L20 20" stroke={color} strokeWidth="2" opacity={opacity * 0.5} />
      <path d="M5 16 L14 22" stroke={color} strokeWidth="1.5" opacity={opacity * 0.35} />
      <path d="M16 5 L22 14" stroke={color} strokeWidth="1.5" opacity={opacity * 0.35} />
      <path d="M3 26 L10 28" stroke={color} strokeWidth="1" opacity={opacity * 0.25} />
      <path d="M26 3 L28 10" stroke={color} strokeWidth="1" opacity={opacity * 0.25} />
      
      {/* Decorative circle cluster - BOLD */}
      <circle cx="28" cy="28" r="8" stroke={color} strokeWidth="2.5" fill="none" opacity={opacity * 0.7} />
      <circle cx="28" cy="28" r="4" stroke={accentColor} strokeWidth="2" fill="none" opacity={opacity * 0.9} />
      <circle cx="28" cy="28" r="1.5" fill={color} opacity={opacity * 0.6} />
      
      {/* Small star accent */}
      <path 
        d="M14 14 L15.5 11 L17 14 L20 15.5 L17 17 L15.5 20 L14 17 L11 15.5 Z" 
        stroke={color} 
        strokeWidth="1.5" 
        fill="none" 
        opacity={opacity * 0.5}
      />
      
      {/* Additional decorative dots */}
      <circle cx="40" cy="8" r="1.5" fill={color} opacity={opacity * 0.3} />
      <circle cx="8" cy="40" r="1.5" fill={color} opacity={opacity * 0.3} />
      <circle cx="52" cy="12" r="1" fill={color} opacity={opacity * 0.2} />
      <circle cx="12" cy="52" r="1" fill={color} opacity={opacity * 0.2} />
    </svg>
  );
};

// ============================================================================
// LUNAR DIVIDERS — BOLD, Prominent
// ============================================================================

export const LunarDivider = ({ 
  width = 300, 
  color = NOUVEAU_COLORS.antiqueGold,
  opacity = 0.7 
}) => (
  <svg width={width} height="32" viewBox="0 0 300 32" fill="none" preserveAspectRatio="xMidYMid meet">
    {/* Left line - thicker */}
    <line x1="0" y1="16" x2="95" y2="16" stroke={color} strokeWidth="2" opacity={opacity * 0.6} />
    
    {/* Left crescent - BOLD */}
    <path 
      d="M112 16 C112 9, 118 4, 126 4 C121 4, 117 9, 117 16 C117 23, 121 28, 126 28 C118 28, 112 23, 112 16" 
      stroke={color} 
      strokeWidth="2.5" 
      fill="none" 
      opacity={opacity}
    />
    
    {/* Center sun disc - BOLD */}
    <circle cx="150" cy="16" r="8" stroke={color} strokeWidth="3" fill="none" opacity={opacity} />
    <circle cx="150" cy="16" r="4" stroke={color} strokeWidth="2" fill="none" opacity={opacity * 0.7} />
    <circle cx="150" cy="16" r="1.5" fill={color} opacity={opacity * 0.8} />
    
    {/* Right crescent - BOLD */}
    <path 
      d="M188 16 C188 9, 182 4, 174 4 C179 4, 183 9, 183 16 C183 23, 179 28, 174 28 C182 28, 188 23, 188 16" 
      stroke={color} 
      strokeWidth="2.5" 
      fill="none" 
      opacity={opacity}
    />
    
    {/* Right line - thicker */}
    <line x1="205" y1="16" x2="300" y2="16" stroke={color} strokeWidth="2" opacity={opacity * 0.6} />
    
    {/* Accent dots */}
    <circle cx="100" cy="16" r="2" fill={color} opacity={opacity * 0.4} />
    <circle cx="200" cy="16" r="2" fill={color} opacity={opacity * 0.4} />
  </svg>
);

export const LunarPhaseDivider = ({ 
  width = 400, 
  color = NOUVEAU_COLORS.antiqueGold,
  opacity = 0.7 
}) => (
  <svg width={width} height="40" viewBox="0 0 400 40" fill="none" preserveAspectRatio="xMidYMid meet">
    {/* Left gradient line - BOLD */}
    <line x1="0" y1="20" x2="110" y2="20" stroke={color} strokeWidth="2.5" opacity={opacity * 0.5} />
    
    {/* Waning crescent - larger, bolder */}
    <circle cx="135" cy="20" r="10" stroke={color} strokeWidth="2" fill="none" opacity={opacity * 0.6} />
    <path d="M140 20 C140 14, 135 10, 135 10 C135 10, 140 14, 140 20 C140 26, 135 30, 135 30 C135 30, 140 26, 140 20" fill={color} opacity={opacity * 0.4} />
    
    {/* Half moon */}
    <circle cx="170" cy="20" r="10" stroke={color} strokeWidth="2" fill="none" opacity={opacity * 0.7} />
    <path d="M170 10 A10 10 0 0 1 170 30" fill={color} opacity={opacity * 0.4} />
    
    {/* Full moon (center) - EXTRA BOLD */}
    <circle cx="200" cy="20" r="14" stroke={color} strokeWidth="3.5" fill="none" opacity={opacity} />
    <circle cx="200" cy="20" r="8" stroke={color} strokeWidth="2" fill="none" opacity={opacity * 0.6} />
    <circle cx="200" cy="20" r="3" fill={color} opacity={opacity * 0.5} />
    
    {/* Half moon (waxing) */}
    <circle cx="230" cy="20" r="10" stroke={color} strokeWidth="2" fill="none" opacity={opacity * 0.7} />
    <path d="M230 10 A10 10 0 0 0 230 30" fill={color} opacity={opacity * 0.4} />
    
    {/* Waxing crescent */}
    <circle cx="265" cy="20" r="10" stroke={color} strokeWidth="2" fill="none" opacity={opacity * 0.6} />
    <path d="M260 20 C260 14, 265 10, 265 10 C265 10, 260 14, 260 20 C260 26, 265 30, 265 30 C265 30, 260 26, 260 20" fill={color} opacity={opacity * 0.4} />
    
    {/* Right gradient line - BOLD */}
    <line x1="290" y1="20" x2="400" y2="20" stroke={color} strokeWidth="2.5" opacity={opacity * 0.5} />
    
    {/* Accent stars */}
    <circle cx="115" cy="20" r="2" fill={color} opacity={opacity * 0.4} />
    <circle cx="285" cy="20" r="2" fill={color} opacity={opacity * 0.4} />
  </svg>
);

export const SimpleDivider = ({ 
  width = 200, 
  color = NOUVEAU_COLORS.antiqueGold,
  opacity = 0.6 
}) => (
  <svg width={width} height="20" viewBox="0 0 200 20" fill="none" preserveAspectRatio="xMidYMid meet">
    <line x1="0" y1="10" x2="80" y2="10" stroke={color} strokeWidth="2" opacity={opacity * 0.5} />
    <circle cx="100" cy="10" r="6" stroke={color} strokeWidth="2.5" fill="none" opacity={opacity} />
    <circle cx="100" cy="10" r="2.5" stroke={color} strokeWidth="1.5" fill="none" opacity={opacity * 0.7} />
    <circle cx="100" cy="10" r="1" fill={color} opacity={opacity * 0.8} />
    <line x1="120" y1="10" x2="200" y2="10" stroke={color} strokeWidth="2" opacity={opacity * 0.5} />
  </svg>
);

// ============================================================================
// RAVEN GLYPH — BOLD, Prominent corvid silhouette
// ============================================================================

export const RavenGlyph = ({ 
  size = 48, 
  color = NOUVEAU_COLORS.antiqueGold,
  opacity = 0.8 
}) => (
  <img 
    src="/images/brand/moon-gold.png" 
    alt="Moon"
    style={{ 
      width: size, 
      height: size, 
      opacity: opacity,
      objectFit: 'contain',
    }}
  />
);

export const RavenGlyphSmall = ({ 
  size = 24, 
  color = NOUVEAU_COLORS.antiqueGold,
  opacity = 0.8 
}) => (
  <img 
    src="/images/brand/moon-gold.png" 
    alt="Moon"
    style={{ 
      width: size, 
      height: size, 
      opacity: opacity,
      objectFit: 'contain',
    }}
  />
);

// ============================================================================
// SUN & MOON DISCS — BOLD celestial symbols
// ============================================================================

export const SunDisc = ({ 
  size = 48, 
  color = NOUVEAU_COLORS.antiqueGold,
  opacity = 0.8 
}) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    {/* Outer rays - BOLD */}
    <path d="M24 2 L24 10" stroke={color} strokeWidth="2.5" opacity={opacity * 0.7} strokeLinecap="round" />
    <path d="M24 38 L24 46" stroke={color} strokeWidth="2.5" opacity={opacity * 0.7} strokeLinecap="round" />
    <path d="M2 24 L10 24" stroke={color} strokeWidth="2.5" opacity={opacity * 0.7} strokeLinecap="round" />
    <path d="M38 24 L46 24" stroke={color} strokeWidth="2.5" opacity={opacity * 0.7} strokeLinecap="round" />
    {/* Diagonal rays */}
    <path d="M8.5 8.5 L14 14" stroke={color} strokeWidth="2" opacity={opacity * 0.55} strokeLinecap="round" />
    <path d="M34 34 L39.5 39.5" stroke={color} strokeWidth="2" opacity={opacity * 0.55} strokeLinecap="round" />
    <path d="M39.5 8.5 L34 14" stroke={color} strokeWidth="2" opacity={opacity * 0.55} strokeLinecap="round" />
    <path d="M14 34 L8.5 39.5" stroke={color} strokeWidth="2" opacity={opacity * 0.55} strokeLinecap="round" />
    {/* Outer circle - EXTRA BOLD */}
    <circle cx="24" cy="24" r="14" stroke={color} strokeWidth="3.5" fill="none" opacity={opacity} />
    {/* Inner circle */}
    <circle cx="24" cy="24" r="8" stroke={color} strokeWidth="2.5" fill="none" opacity={opacity * 0.7} />
    {/* Center */}
    <circle cx="24" cy="24" r="4" stroke={color} strokeWidth="2" fill="none" opacity={opacity * 0.85} />
    <circle cx="24" cy="24" r="1.5" fill={color} opacity={opacity * 0.7} />
  </svg>
);

export const MoonDisc = ({ 
  size = 48, 
  color = NOUVEAU_COLORS.antiqueGold,
  opacity = 0.8 
}) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    {/* Outer halo */}
    <circle cx="24" cy="24" r="20" stroke={color} strokeWidth="1.5" fill="none" opacity={opacity * 0.35} />
    {/* Main crescent - BOLD */}
    <path 
      d="M34 24 C34 12, 24 4, 14 4 C20 4, 26 10, 26 24 C26 38, 20 44, 14 44 C24 44, 34 36, 34 24" 
      stroke={color} 
      strokeWidth="3.5" 
      fill="none" 
      opacity={opacity}
    />
    {/* Inner detail arc */}
    <path 
      d="M30 24 C30 15, 23 9, 16 9 C21 9, 26 14, 26 24 C26 34, 21 39, 16 39 C23 39, 30 33, 30 24" 
      stroke={color} 
      strokeWidth="2" 
      fill="none" 
      opacity={opacity * 0.5}
    />
    {/* Stars around moon - more prominent */}
    <circle cx="10" cy="12" r="2" stroke={color} strokeWidth="1.5" fill="none" opacity={opacity * 0.5} />
    <circle cx="10" cy="12" r="0.8" fill={color} opacity={opacity * 0.4} />
    <circle cx="8" cy="30" r="1.5" fill={color} opacity={opacity * 0.35} />
    <circle cx="12" cy="40" r="1.5" fill={color} opacity={opacity * 0.35} />
  </svg>
);

export const CrescentMoon = ({ 
  size = 32, 
  color = NOUVEAU_COLORS.antiqueGold,
  opacity = 0.8,
  facing = 'right'
}) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 32 32" 
    fill="none"
    style={{ transform: facing === 'left' ? 'scaleX(-1)' : 'none' }}
  >
    <path 
      d="M24 16 C24 7, 16 0, 8 0 C13 0, 18 6, 18 16 C18 26, 13 32, 8 32 C16 32, 24 25, 24 16" 
      stroke={color} 
      strokeWidth="3" 
      fill="none" 
      opacity={opacity}
    />
    {/* Inner detail */}
    <path 
      d="M20 16 C20 10, 15 5, 10 5 C13 5, 16 9, 16 16 C16 23, 13 27, 10 27 C15 27, 20 22, 20 16" 
      stroke={color} 
      strokeWidth="1.5" 
      fill="none" 
      opacity={opacity * 0.4}
    />
  </svg>
);

// ============================================================================
// CELESTIAL EYE — BOLD All-seeing eye motif
// ============================================================================

export const CelestialEye = ({ 
  size = 48, 
  color = NOUVEAU_COLORS.antiqueGold,
  accentColor = NOUVEAU_COLORS.roseClay,
  opacity = 0.8 
}) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    {/* Radiating lines - BOLD */}
    <path d="M24 4 L24 12" stroke={color} strokeWidth="2" opacity={opacity * 0.5} strokeLinecap="round" />
    <path d="M24 36 L24 44" stroke={color} strokeWidth="2" opacity={opacity * 0.5} strokeLinecap="round" />
    <path d="M10 10 L15 15" stroke={color} strokeWidth="1.5" opacity={opacity * 0.4} strokeLinecap="round" />
    <path d="M33 33 L38 38" stroke={color} strokeWidth="1.5" opacity={opacity * 0.4} strokeLinecap="round" />
    <path d="M38 10 L33 15" stroke={color} strokeWidth="1.5" opacity={opacity * 0.4} strokeLinecap="round" />
    <path d="M15 33 L10 38" stroke={color} strokeWidth="1.5" opacity={opacity * 0.4} strokeLinecap="round" />
    {/* Eye shape - EXTRA BOLD */}
    <path 
      d="M4 24 Q24 8 44 24 Q24 40 4 24" 
      stroke={color} 
      strokeWidth="3.5" 
      fill="none" 
      opacity={opacity}
    />
    {/* Inner eye line */}
    <path 
      d="M10 24 Q24 14 38 24 Q24 34 10 24" 
      stroke={color} 
      strokeWidth="1.5" 
      fill="none" 
      opacity={opacity * 0.4}
    />
    {/* Iris - BOLD */}
    <circle cx="24" cy="24" r="8" stroke={color} strokeWidth="3" fill="none" opacity={opacity * 0.9} />
    {/* Pupil - accent color */}
    <circle cx="24" cy="24" r="4" stroke={accentColor} strokeWidth="2.5" fill="none" opacity={opacity} />
    <circle cx="24" cy="24" r="2" fill={color} opacity={opacity * 0.7} />
    {/* Highlight */}
    <circle cx="21" cy="21" r="1" fill={color} opacity={opacity * 0.4} />
  </svg>
);

// ============================================================================
// STAR GLYPHS — BOLD
// ============================================================================

export const StarGlyph = ({ 
  size = 24, 
  color = NOUVEAU_COLORS.antiqueGold,
  opacity = 0.8,
  points = 4
}) => {
  if (points === 4) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path 
          d="M12 1 L14 10 L23 12 L14 14 L12 23 L10 14 L1 12 L10 10 Z" 
          stroke={color} 
          strokeWidth="2" 
          fill="none" 
          opacity={opacity}
        />
        <circle cx="12" cy="12" r="2.5" stroke={color} strokeWidth="1.5" fill="none" opacity={opacity * 0.6} />
        <circle cx="12" cy="12" r="1" fill={color} opacity={opacity * 0.7} />
      </svg>
    );
  }
  // 6-pointed star
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path 
        d="M12 1 L14.5 9 L23 9 L16 14 L18.5 22 L12 17 L5.5 22 L8 14 L1 9 L9.5 9 Z" 
        stroke={color} 
        strokeWidth="2" 
        fill="none" 
        opacity={opacity}
      />
      <circle cx="12" cy="12" r="1.5" fill={color} opacity={opacity * 0.6} />
    </svg>
  );
};

// ============================================================================
// DECORATIVE FRAME — For content panels
// Subtle lifted-paper shadow, not modern card UI
// ============================================================================

export const VellumFrame = ({ 
  children, 
  className = '',
  cornerSize = 40,
  showCorners = true 
}) => (
  <div 
    className={`relative ${className}`}
    style={{
      boxShadow: '0 1px 3px rgba(14, 42, 47, 0.06), 0 4px 12px rgba(14, 42, 47, 0.03), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
    }}
  >
    {showCorners && (
      <>
        <div className="absolute -top-1 -left-1 pointer-events-none opacity-20">
          <HaloCorner size={cornerSize} position="top-left" />
        </div>
        <div className="absolute -top-1 -right-1 pointer-events-none opacity-20">
          <HaloCorner size={cornerSize} position="top-right" />
        </div>
        <div className="absolute -bottom-1 -left-1 pointer-events-none opacity-20">
          <HaloCorner size={cornerSize} position="bottom-left" />
        </div>
        <div className="absolute -bottom-1 -right-1 pointer-events-none opacity-20">
          <HaloCorner size={cornerSize} position="bottom-right" />
        </div>
      </>
    )}
    {children}
  </div>
);

// Vellum panel without corners - for simpler content blocks
export const VellumPanel = ({ 
  children, 
  className = '',
  padding = 'p-6 sm:p-8'
}) => (
  <div 
    className={`relative ${padding} ${className}`}
    style={{
      backgroundColor: NOUVEAU_COLORS.vellum,
      border: `1px solid ${NOUVEAU_COLORS.antiqueGold}50`,
      boxShadow: '0 1px 3px rgba(14, 42, 47, 0.08), 0 4px 12px rgba(14, 42, 47, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
    }}
  >
    {children}
  </div>
);

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Colors
  NOUVEAU_COLORS,
  // Corners
  HaloCorner,
  HaloCornerElaborate,
  // Dividers
  LunarDivider,
  LunarPhaseDivider,
  SimpleDivider,
  // Glyphs
  RavenGlyph,
  RavenGlyphSmall,
  SunDisc,
  MoonDisc,
  CrescentMoon,
  CelestialEye,
  StarGlyph,
  // Frames
  VellumFrame,
  VellumPanel,
};
