// ============================================================================
// CROWLANDS ART NOUVEAU ORNAMENT LIBRARY
// Luminous, stroke-based, structural ornaments
// Gold strokes ONLY — never fills behind text
// ============================================================================

import React from 'react';

// Color tokens from new palette
export const NOUVEAU_COLORS = {
  midnightTeal: '#0E2A2F',
  celestialBlue: '#123A3F',
  vellum: '#F3EFE8',
  antiqueGold: '#C8A44D',
  mutedBrass: '#9E8438',
  roseClay: '#C26A5A',
  emberPink: '#B94E6A',
};

// ============================================================================
// HALO ARC CORNERS — Light, Art Nouveau geometry
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
      {/* Primary arc */}
      <path 
        d="M0 60 Q0 0 60 0" 
        stroke={color} 
        strokeWidth="1.5" 
        opacity={opacity}
        fill="none"
      />
      {/* Secondary inner arc */}
      <path 
        d="M0 45 Q0 0 45 0" 
        stroke={color} 
        strokeWidth="1" 
        opacity={opacity * 0.6}
        fill="none"
      />
      {/* Delicate inner arc */}
      <path 
        d="M0 30 Q0 0 30 0" 
        stroke={color} 
        strokeWidth="0.5" 
        opacity={opacity * 0.4}
        fill="none"
      />
      {/* Small decorative circle at intersection */}
      <circle 
        cx="20" 
        cy="20" 
        r="2" 
        stroke={color} 
        strokeWidth="1" 
        fill="none" 
        opacity={opacity * 0.7}
      />
      {/* Tiny accent dot */}
      <circle 
        cx="20" 
        cy="20" 
        r="0.8" 
        fill={color} 
        opacity={opacity * 0.5}
      />
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
      {/* Outermost arc */}
      <path 
        d="M0 75 Q0 0 75 0" 
        stroke={color} 
        strokeWidth="1.5" 
        opacity={opacity}
        fill="none"
      />
      {/* Middle arc */}
      <path 
        d="M0 55 Q0 0 55 0" 
        stroke={color} 
        strokeWidth="1" 
        opacity={opacity * 0.7}
        fill="none"
      />
      {/* Inner arc */}
      <path 
        d="M0 35 Q0 0 35 0" 
        stroke={color} 
        strokeWidth="0.75" 
        opacity={opacity * 0.5}
        fill="none"
      />
      {/* Radiating lines from corner */}
      <path 
        d="M8 8 L18 18" 
        stroke={color} 
        strokeWidth="0.5" 
        opacity={opacity * 0.4}
      />
      <path 
        d="M5 15 L12 22" 
        stroke={color} 
        strokeWidth="0.5" 
        opacity={opacity * 0.3}
      />
      <path 
        d="M15 5 L22 12" 
        stroke={color} 
        strokeWidth="0.5" 
        opacity={opacity * 0.3}
      />
      {/* Decorative circle cluster */}
      <circle 
        cx="25" 
        cy="25" 
        r="4" 
        stroke={color} 
        strokeWidth="1" 
        fill="none" 
        opacity={opacity * 0.6}
      />
      <circle 
        cx="25" 
        cy="25" 
        r="1.5" 
        stroke={accentColor} 
        strokeWidth="0.75" 
        fill="none" 
        opacity={opacity * 0.8}
      />
      {/* Small star accent */}
      <path 
        d="M12 12 L13 10 L14 12 L16 13 L14 14 L13 16 L12 14 L10 13 Z" 
        stroke={color} 
        strokeWidth="0.5" 
        fill="none" 
        opacity={opacity * 0.5}
      />
    </svg>
  );
};

// ============================================================================
// LUNAR DIVIDERS — Crescent and phase-based horizontal dividers
// ============================================================================

export const LunarDivider = ({ 
  width = 300, 
  color = NOUVEAU_COLORS.antiqueGold,
  opacity = 0.7 
}) => (
  <svg width={width} height="24" viewBox="0 0 300 24" fill="none" preserveAspectRatio="xMidYMid meet">
    {/* Left line */}
    <line 
      x1="0" y1="12" x2="100" y2="12" 
      stroke={color} 
      strokeWidth="1" 
      opacity={opacity * 0.5}
    />
    {/* Left crescent */}
    <path 
      d="M115 12 C115 7, 120 4, 125 4 C122 4, 120 7, 120 12 C120 17, 122 20, 125 20 C120 20, 115 17, 115 12" 
      stroke={color} 
      strokeWidth="1" 
      fill="none" 
      opacity={opacity}
    />
    {/* Center star */}
    <circle cx="150" cy="12" r="3" stroke={color} strokeWidth="1" fill="none" opacity={opacity} />
    <circle cx="150" cy="12" r="1" fill={color} opacity={opacity * 0.6} />
    {/* Right crescent (mirrored) */}
    <path 
      d="M185 12 C185 7, 180 4, 175 4 C178 4, 180 7, 180 12 C180 17, 178 20, 175 20 C180 20, 185 17, 185 12" 
      stroke={color} 
      strokeWidth="1" 
      fill="none" 
      opacity={opacity}
    />
    {/* Right line */}
    <line 
      x1="200" y1="12" x2="300" y2="12" 
      stroke={color} 
      strokeWidth="1" 
      opacity={opacity * 0.5}
    />
  </svg>
);

export const LunarPhaseDivider = ({ 
  width = 400, 
  color = NOUVEAU_COLORS.antiqueGold,
  opacity = 0.7 
}) => (
  <svg width={width} height="28" viewBox="0 0 400 28" fill="none" preserveAspectRatio="xMidYMid meet">
    {/* Left gradient line */}
    <line x1="0" y1="14" x2="120" y2="14" stroke={color} strokeWidth="1" opacity={opacity * 0.4} />
    
    {/* Waning crescent */}
    <circle cx="140" cy="14" r="6" stroke={color} strokeWidth="0.75" fill="none" opacity={opacity * 0.5} />
    <path d="M143 14 C143 10, 140 8, 140 8 C140 8, 143 10, 143 14 C143 18, 140 20, 140 20 C140 20, 143 18, 143 14" fill={color} opacity={opacity * 0.3} />
    
    {/* Half moon */}
    <circle cx="170" cy="14" r="6" stroke={color} strokeWidth="0.75" fill="none" opacity={opacity * 0.6} />
    <path d="M170 8 A6 6 0 0 1 170 20" fill={color} opacity={opacity * 0.3} />
    
    {/* Full moon (center) */}
    <circle cx="200" cy="14" r="8" stroke={color} strokeWidth="1" fill="none" opacity={opacity} />
    <circle cx="200" cy="14" r="5" stroke={color} strokeWidth="0.5" fill="none" opacity={opacity * 0.5} />
    <circle cx="200" cy="14" r="2" fill={color} opacity={opacity * 0.4} />
    
    {/* Half moon (waxing) */}
    <circle cx="230" cy="14" r="6" stroke={color} strokeWidth="0.75" fill="none" opacity={opacity * 0.6} />
    <path d="M230 8 A6 6 0 0 0 230 20" fill={color} opacity={opacity * 0.3} />
    
    {/* Waxing crescent */}
    <circle cx="260" cy="14" r="6" stroke={color} strokeWidth="0.75" fill="none" opacity={opacity * 0.5} />
    <path d="M257 14 C257 10, 260 8, 260 8 C260 8, 257 10, 257 14 C257 18, 260 20, 260 20 C260 20, 257 18, 257 14" fill={color} opacity={opacity * 0.3} />
    
    {/* Right gradient line */}
    <line x1="280" y1="14" x2="400" y2="14" stroke={color} strokeWidth="1" opacity={opacity * 0.4} />
  </svg>
);

export const SimpleDivider = ({ 
  width = 200, 
  color = NOUVEAU_COLORS.antiqueGold,
  opacity = 0.6 
}) => (
  <svg width={width} height="12" viewBox="0 0 200 12" fill="none" preserveAspectRatio="xMidYMid meet">
    <line x1="0" y1="6" x2="85" y2="6" stroke={color} strokeWidth="1" opacity={opacity * 0.5} />
    <circle cx="100" cy="6" r="3" stroke={color} strokeWidth="1" fill="none" opacity={opacity} />
    <circle cx="100" cy="6" r="1" fill={color} opacity={opacity * 0.6} />
    <line x1="115" y1="6" x2="200" y2="6" stroke={color} strokeWidth="1" opacity={opacity * 0.5} />
  </svg>
);

// ============================================================================
// RAVEN GLYPH — Corvid silhouette, stroke-based
// ============================================================================

export const RavenGlyph = ({ 
  size = 48, 
  color = NOUVEAU_COLORS.antiqueGold,
  opacity = 0.8 
}) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    {/* Body outline */}
    <path 
      d="M12 36 C8 32, 6 26, 8 20 C10 14, 16 10, 22 10 C26 10, 30 12, 32 16 L36 14 C38 13, 40 14, 40 16 L38 18 C40 20, 42 24, 40 30 C38 36, 32 40, 24 40 C18 40, 14 38, 12 36" 
      stroke={color} 
      strokeWidth="1.5" 
      fill="none" 
      opacity={opacity}
    />
    {/* Wing detail */}
    <path 
      d="M16 28 C18 24, 22 22, 28 22 C30 22, 32 23, 34 25" 
      stroke={color} 
      strokeWidth="1" 
      fill="none" 
      opacity={opacity * 0.6}
    />
    {/* Eye */}
    <circle cx="30" cy="18" r="2" stroke={color} strokeWidth="1" fill="none" opacity={opacity} />
    <circle cx="30" cy="18" r="0.8" fill={color} opacity={opacity * 0.8} />
    {/* Beak */}
    <path 
      d="M36 16 L42 15 L38 18" 
      stroke={color} 
      strokeWidth="1" 
      fill="none" 
      opacity={opacity}
    />
    {/* Tail feathers */}
    <path 
      d="M10 34 L6 38 M12 36 L10 42 M14 37 L14 43" 
      stroke={color} 
      strokeWidth="1" 
      opacity={opacity * 0.7}
    />
  </svg>
);

export const RavenGlyphSmall = ({ 
  size = 24, 
  color = NOUVEAU_COLORS.antiqueGold,
  opacity = 0.8 
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path 
      d="M6 18 C4 16, 3 13, 4 10 C5 7, 8 5, 11 5 C13 5, 15 6, 16 8 L18 7 C19 6.5, 20 7, 20 8 L19 9 C20 10, 21 12, 20 15 C19 18, 16 20, 12 20 C9 20, 7 19, 6 18" 
      stroke={color} 
      strokeWidth="1.25" 
      fill="none" 
      opacity={opacity}
    />
    <circle cx="15" cy="9" r="1" stroke={color} strokeWidth="0.75" fill="none" opacity={opacity} />
    <circle cx="15" cy="9" r="0.4" fill={color} opacity={opacity * 0.8} />
    <path d="M5 17 L3 19 M6 18 L5 21" stroke={color} strokeWidth="0.75" opacity={opacity * 0.6} />
  </svg>
);

// ============================================================================
// SUN & MOON DISCS — Celestial symbols
// ============================================================================

export const SunDisc = ({ 
  size = 48, 
  color = NOUVEAU_COLORS.antiqueGold,
  opacity = 0.8 
}) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    {/* Outer rays */}
    <path d="M24 4 L24 10" stroke={color} strokeWidth="1" opacity={opacity * 0.6} />
    <path d="M24 38 L24 44" stroke={color} strokeWidth="1" opacity={opacity * 0.6} />
    <path d="M4 24 L10 24" stroke={color} strokeWidth="1" opacity={opacity * 0.6} />
    <path d="M38 24 L44 24" stroke={color} strokeWidth="1" opacity={opacity * 0.6} />
    {/* Diagonal rays */}
    <path d="M9.9 9.9 L14 14" stroke={color} strokeWidth="1" opacity={opacity * 0.5} />
    <path d="M34 34 L38.1 38.1" stroke={color} strokeWidth="1" opacity={opacity * 0.5} />
    <path d="M38.1 9.9 L34 14" stroke={color} strokeWidth="1" opacity={opacity * 0.5} />
    <path d="M14 34 L9.9 38.1" stroke={color} strokeWidth="1" opacity={opacity * 0.5} />
    {/* Outer circle */}
    <circle cx="24" cy="24" r="12" stroke={color} strokeWidth="1.5" fill="none" opacity={opacity} />
    {/* Inner circle */}
    <circle cx="24" cy="24" r="7" stroke={color} strokeWidth="1" fill="none" opacity={opacity * 0.6} />
    {/* Center dot */}
    <circle cx="24" cy="24" r="2.5" stroke={color} strokeWidth="0.75" fill="none" opacity={opacity * 0.8} />
    <circle cx="24" cy="24" r="1" fill={color} opacity={opacity * 0.5} />
  </svg>
);

export const MoonDisc = ({ 
  size = 48, 
  color = NOUVEAU_COLORS.antiqueGold,
  opacity = 0.8 
}) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    {/* Outer halo */}
    <circle cx="24" cy="24" r="18" stroke={color} strokeWidth="0.75" fill="none" opacity={opacity * 0.3} />
    {/* Main crescent */}
    <path 
      d="M32 24 C32 14.06, 24 8, 16 8 C20 8, 24 12, 24 24 C24 36, 20 40, 16 40 C24 40, 32 33.94, 32 24" 
      stroke={color} 
      strokeWidth="1.5" 
      fill="none" 
      opacity={opacity}
    />
    {/* Inner detail arc */}
    <path 
      d="M28 24 C28 17, 23 13, 18 13 C21 13, 24 16, 24 24 C24 32, 21 35, 18 35 C23 35, 28 31, 28 24" 
      stroke={color} 
      strokeWidth="0.75" 
      fill="none" 
      opacity={opacity * 0.5}
    />
    {/* Stars around moon */}
    <circle cx="12" cy="14" r="1" fill={color} opacity={opacity * 0.4} />
    <circle cx="10" cy="28" r="0.8" fill={color} opacity={opacity * 0.3} />
    <circle cx="14" cy="36" r="0.6" fill={color} opacity={opacity * 0.3} />
  </svg>
);

export const CrescentMoon = ({ 
  size = 32, 
  color = NOUVEAU_COLORS.antiqueGold,
  opacity = 0.8,
  facing = 'right' // 'left' or 'right'
}) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 32 32" 
    fill="none"
    style={{ transform: facing === 'left' ? 'scaleX(-1)' : 'none' }}
  >
    <path 
      d="M22 16 C22 9, 16 4, 10 4 C13 4, 16 8, 16 16 C16 24, 13 28, 10 28 C16 28, 22 23, 22 16" 
      stroke={color} 
      strokeWidth="1.25" 
      fill="none" 
      opacity={opacity}
    />
  </svg>
);

// ============================================================================
// CELESTIAL EYE — All-seeing eye motif
// ============================================================================

export const CelestialEye = ({ 
  size = 48, 
  color = NOUVEAU_COLORS.antiqueGold,
  accentColor = NOUVEAU_COLORS.roseClay,
  opacity = 0.8 
}) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    {/* Radiating lines */}
    <path d="M24 6 L24 12" stroke={color} strokeWidth="0.75" opacity={opacity * 0.4} />
    <path d="M24 36 L24 42" stroke={color} strokeWidth="0.75" opacity={opacity * 0.4} />
    <path d="M12 12 L16 16" stroke={color} strokeWidth="0.75" opacity={opacity * 0.3} />
    <path d="M32 32 L36 36" stroke={color} strokeWidth="0.75" opacity={opacity * 0.3} />
    <path d="M36 12 L32 16" stroke={color} strokeWidth="0.75" opacity={opacity * 0.3} />
    <path d="M16 32 L12 36" stroke={color} strokeWidth="0.75" opacity={opacity * 0.3} />
    {/* Eye shape */}
    <path 
      d="M6 24 Q24 10 42 24 Q24 38 6 24" 
      stroke={color} 
      strokeWidth="1.5" 
      fill="none" 
      opacity={opacity}
    />
    {/* Iris */}
    <circle cx="24" cy="24" r="6" stroke={color} strokeWidth="1" fill="none" opacity={opacity * 0.8} />
    {/* Pupil */}
    <circle cx="24" cy="24" r="3" stroke={accentColor} strokeWidth="0.75" fill="none" opacity={opacity} />
    <circle cx="24" cy="24" r="1.5" fill={color} opacity={opacity * 0.6} />
  </svg>
);

// ============================================================================
// STAR GLYPHS
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
          d="M12 2 L13.5 10 L22 12 L13.5 14 L12 22 L10.5 14 L2 12 L10.5 10 Z" 
          stroke={color} 
          strokeWidth="1" 
          fill="none" 
          opacity={opacity}
        />
        <circle cx="12" cy="12" r="1.5" fill={color} opacity={opacity * 0.5} />
      </svg>
    );
  }
  // 6-pointed star
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path 
        d="M12 2 L14 9 L21 9 L15.5 13 L17.5 20 L12 16 L6.5 20 L8.5 13 L3 9 L10 9 Z" 
        stroke={color} 
        strokeWidth="1" 
        fill="none" 
        opacity={opacity}
      />
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
  cornerSize = 60,
  showCorners = true 
}) => (
  <div 
    className={`relative ${className}`}
    style={{
      boxShadow: '0 1px 3px rgba(14, 42, 47, 0.08), 0 4px 12px rgba(14, 42, 47, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
    }}
  >
    {showCorners && (
      <>
        <div className="absolute top-2 left-2 pointer-events-none">
          <HaloCorner size={cornerSize} position="top-left" />
        </div>
        <div className="absolute top-2 right-2 pointer-events-none">
          <HaloCorner size={cornerSize} position="top-right" />
        </div>
        <div className="absolute bottom-2 left-2 pointer-events-none">
          <HaloCorner size={cornerSize} position="bottom-left" />
        </div>
        <div className="absolute bottom-2 right-2 pointer-events-none">
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
