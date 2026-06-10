// ============================================================================
// CROWLANDS STATIC ORNAMENT LIBRARY V2.0
// Single source-of-truth for all decorative assets
// Deterministic: same page = same ornament set
// ============================================================================

import React from 'react';

// ============================================================================
// COLOR TOKENS (from Art Bible)
// ============================================================================
export const COLORS = {
  gold: '#C8A44D',
  goldLight: '#D4B55D',
  goldDark: '#A89872',
  crimson: '#8B2232',
  oxblood: '#8B2232',
  navy: '#0C1D2E',
  navyMid: '#102534',
  bone: '#F3EFE8',
  copper: '#b87333',
  silver: '#a8a8a8',
  emberPink: '#B94E6A',
  fadedGold: '#A89872',
  inkBlack: '#1A1A1A',
};

// ============================================================================
// 24 BESTIARY GLYPHS - British folklore animals + occult symbols
// ============================================================================
export const BestiaryGlyphs = {
  // Birds
  crow: ({ size = 24, color = COLORS.gold }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M5 17c0-2.5 2-4 4-4s3 1.5 5 1.5 3-1.5 5-1.5c1.5 0 2.5.5 2.5 2M9 13.5V7c0-2 1.5-4 3.5-4S16 5 16 7v6.5" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M9 7c-1 0-2 .5-2 1.5M15 7c1 0 2 .5 2 1.5" stroke={color} strokeWidth="1" strokeLinecap="round"/>
      <circle cx="11" cy="5.5" r="1.2" fill={color}/>
      <path d="M6 9l-2-1.5" stroke={color} strokeWidth="1" strokeLinecap="round"/>
    </svg>
  ),
  raven: ({ size = 24, color = COLORS.gold }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M4 16c2-1.5 5-2.5 8-2.5s6 1 8 2.5M8 13.5V6c0-2 2-4 4-4s4 2 4 4v7.5" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M8 6c-1.5 0-2.5 1-2.5 2M16 6c1.5 0 2.5 1 2.5 2" stroke={color} strokeWidth="1" strokeLinecap="round"/>
      <circle cx="10.5" cy="4.5" r="1.5" fill={color}/>
      <path d="M5 7l-2-1" stroke={color} strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  ),
  magpie: ({ size = 24, color = COLORS.gold }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M6 15c0-1.5 1.5-2.5 3-2.5s2.5 1 4 1 2.5-1 4-1 2.5 1 2.5 2.5" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M9 12.5V6c0-1.5 1.5-3 3-3s3 1.5 3 3v6.5" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M9 6l-2-2M15 6l2-2" stroke={color} strokeWidth="1" strokeLinecap="round"/>
      <circle cx="10.5" cy="4.5" r="1" fill={color}/>
      <path d="M12 16v4" stroke={color} strokeWidth="1" strokeLinecap="round"/>
    </svg>
  ),
  robin: ({ size = 24, color = COLORS.gold }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <ellipse cx="12" cy="13" rx="5" ry="6" stroke={color} strokeWidth="1.5"/>
      <circle cx="12" cy="7" r="3.5" stroke={color} strokeWidth="1.5"/>
      <circle cx="10.5" cy="6" r="0.8" fill={color}/>
      <path d="M15.5 7l2-1M9 14c0 2.5 1.5 5 3 5s3-2.5 3-5" stroke={color} strokeWidth="1" strokeLinecap="round"/>
      <ellipse cx="12" cy="10" rx="2" ry="1.5" fill={color} opacity="0.3"/>
    </svg>
  ),
  sparrow: ({ size = 24, color = COLORS.gold }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <ellipse cx="12" cy="14" rx="4" ry="5" stroke={color} strokeWidth="1.5"/>
      <circle cx="12" cy="7" r="2.5" stroke={color} strokeWidth="1.5"/>
      <circle cx="11" cy="6.5" r="0.6" fill={color}/>
      <path d="M14.5 7l1.5-1M10 15c0 1.5 1 3 2 3s2-1.5 2-3" stroke={color} strokeWidth="1" strokeLinecap="round"/>
    </svg>
  ),
  wren: ({ size = 24, color = COLORS.gold }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <ellipse cx="11" cy="15" rx="3.5" ry="4" stroke={color} strokeWidth="1.5"/>
      <circle cx="11" cy="9" r="2.5" stroke={color} strokeWidth="1.5"/>
      <circle cx="10" cy="8.5" r="0.6" fill={color}/>
      <path d="M13.5 9l1.5-0.5" stroke={color} strokeWidth="1" strokeLinecap="round"/>
      <path d="M14 14Q16 11 17 7" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.7"/>
      <path d="M9 16c0 1.5 1 3 2 3s2-1.5 2-3" stroke={color} strokeWidth="1" strokeLinecap="round"/>
    </svg>
  ),
  owl: ({ size = 24, color = COLORS.gold }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <ellipse cx="12" cy="14" rx="6" ry="7" stroke={color} strokeWidth="1.5"/>
      <circle cx="9" cy="11" r="2.5" stroke={color} strokeWidth="1.5"/>
      <circle cx="15" cy="11" r="2.5" stroke={color} strokeWidth="1.5"/>
      <circle cx="9" cy="11" r="1" fill={color}/>
      <circle cx="15" cy="11" r="1" fill={color}/>
      <path d="M12 13v2M10 15l2 1.5 2-1.5M7 6l2.5 3M17 6l-2.5 3" stroke={color} strokeWidth="1" strokeLinecap="round"/>
    </svg>
  ),
  // Animals
  hare: ({ size = 24, color = COLORS.gold }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <ellipse cx="12" cy="15" rx="5" ry="4" stroke={color} strokeWidth="1.5"/>
      <ellipse cx="12" cy="10" rx="3" ry="2.5" stroke={color} strokeWidth="1.5"/>
      <path d="M9 8V2M15 8V2" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="10.5" cy="9.5" r="0.6" fill={color}/>
      <path d="M8 17l-2 2M16 17l2 2" stroke={color} strokeWidth="1" strokeLinecap="round"/>
    </svg>
  ),
  stag: ({ size = 24, color = COLORS.gold }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <ellipse cx="12" cy="16" rx="4" ry="5" stroke={color} strokeWidth="1.5"/>
      <ellipse cx="12" cy="9" rx="2.5" ry="3" stroke={color} strokeWidth="1.5"/>
      <path d="M8 5l-2-3M8 5l-3 0M16 5l2-3M16 5l3 0M10 6l-1-2M14 6l1-2" stroke={color} strokeWidth="1.2" strokeLinecap="round"/>
      <circle cx="11" cy="8" r="0.6" fill={color}/>
    </svg>
  ),
  fox: ({ size = 24, color = COLORS.gold }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <ellipse cx="12" cy="14" rx="5" ry="6" stroke={color} strokeWidth="1.5"/>
      <path d="M7 8l-2-4 3 2M17 8l2-4-3 2" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <ellipse cx="12" cy="9" rx="3" ry="2" stroke={color} strokeWidth="1.5"/>
      <circle cx="10" cy="8.5" r="0.6" fill={color}/>
      <circle cx="14" cy="8.5" r="0.6" fill={color}/>
      <path d="M12 10.5v1.5M10 12l2 1 2-1" stroke={color} strokeWidth="1" strokeLinecap="round"/>
    </svg>
  ),
  moth: ({ size = 24, color = COLORS.gold }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <ellipse cx="12" cy="14" rx="2" ry="4" stroke={color} strokeWidth="1.5"/>
      <path d="M10 14c-3-1-6 0-7 4 2.5 0 5-1 7-1.5M14 14c3-1 6 0 7 4-2.5 0-5-1-7-1.5" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="12" cy="8" r="2.5" stroke={color} strokeWidth="1.5"/>
      <path d="M10 6c-1-2.5-1-4-1-5M14 6c1-2.5 1-4 1-5" stroke={color} strokeWidth="1" strokeLinecap="round"/>
      <circle cx="12" cy="8" r="1" fill={color} opacity="0.5"/>
    </svg>
  ),
  toad: ({ size = 24, color = COLORS.gold }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <ellipse cx="12" cy="14" rx="6" ry="5" stroke={color} strokeWidth="1.5"/>
      <circle cx="9" cy="9" r="2" stroke={color} strokeWidth="1.5"/>
      <circle cx="15" cy="9" r="2" stroke={color} strokeWidth="1.5"/>
      <circle cx="9" cy="9" r="0.8" fill={color}/>
      <circle cx="15" cy="9" r="0.8" fill={color}/>
      <path d="M10 14h4" stroke={color} strokeWidth="1"/>
      <circle cx="8" cy="13" r="0.5" fill={color} opacity="0.4"/>
      <circle cx="16" cy="13" r="0.5" fill={color} opacity="0.4"/>
    </svg>
  ),
  serpent: ({ size = 24, color = COLORS.gold }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M4 12c2-4 5-6 8-6s6 2 8 6c-2 4-5 6-8 6s-6-2-8-6" stroke={color} strokeWidth="1.5"/>
      <circle cx="8" cy="10" r="1.2" fill={color}/>
      <path d="M19 12l3-2M19 12l3 2" stroke={color} strokeWidth="1.2" strokeLinecap="round"/>
      <path d="M6 12c1-1 2-1.5 3-1.5" stroke={color} strokeWidth="0.8" opacity="0.5"/>
    </svg>
  ),
  // Occult symbols
  pentacle: ({ size = 24, color = COLORS.gold }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.5"/>
      <path d="M12 3l2.4 7.4h7.8l-6.3 4.6 2.4 7.4L12 18l-6.3 4.4 2.4-7.4-6.3-4.6h7.8z" stroke={color} strokeWidth="1" fill="none"/>
    </svg>
  ),
  triquetra: ({ size = 24, color = COLORS.gold }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 3c-3 3.5-3 8 0 12 3-4 3-8.5 0-12M12 15c-4.5-2-8 0-9 5 4.5 0 8-1.5 9-5M12 15c4.5-2 8 0 9 5-4.5 0-8-1.5-9-5" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  crescent: ({ size = 24, color = COLORS.gold }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M17 3c-5.5 0-10 4.5-10 10s4.5 10 10 10c-3.5 0-6.5-4.5-6.5-10S13.5 3 17 3z" stroke={color} strokeWidth="1.5"/>
      <circle cx="9" cy="7" r="0.5" fill={color} opacity="0.4"/>
      <circle cx="7" cy="12" r="0.5" fill={color} opacity="0.4"/>
    </svg>
  ),
  sunDisc: ({ size = 24, color = COLORS.gold }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="5" stroke={color} strokeWidth="1.5"/>
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M16.9 16.9l2.1 2.1M4.9 19.1l2.1-2.1M16.9 7.1l2.1-2.1" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  key: ({ size = 24, color = COLORS.gold }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="8" cy="8" r="4.5" stroke={color} strokeWidth="1.5"/>
      <circle cx="8" cy="8" r="2" stroke={color} strokeWidth="1" opacity="0.5"/>
      <path d="M11 11l9 9M17 17l3-3M17 20l3-3" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  chalice: ({ size = 24, color = COLORS.gold }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M8 4h8v6c0 2.5-1.5 4.5-4 4.5s-4-2-4-4.5V4z" stroke={color} strokeWidth="1.5"/>
      <path d="M12 14.5v5M8 19.5h8" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M6 6c-2 0-3.5 2-3.5 4.5s1.5 3.5 3.5 3.5M18 6c2 0 3.5 2 3.5 4.5s-1.5 3.5-3.5 3.5" stroke={color} strokeWidth="1.2"/>
    </svg>
  ),
  candle: ({ size = 24, color = COLORS.gold }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="9" y="10" width="6" height="11" rx="1" stroke={color} strokeWidth="1.5"/>
      <path d="M12 10V7c-1-1.5-1-2.5 0-4 1 1.5 1 2.5 0 4" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <ellipse cx="12" cy="4" rx="1.5" ry="2.5" fill={color} opacity="0.6"/>
    </svg>
  ),
  bell: ({ size = 24, color = COLORS.gold }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 3v2M12 5c-3.5 0-6 2.5-6 6v4l-2 2h16l-2-2v-4c0-3.5-2.5-6-6-6z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M10 19c0 1.5 1 2.5 2 2.5s2-1 2-2.5" stroke={color} strokeWidth="1.5"/>
    </svg>
  ),
  compass: ({ size = 24, color = COLORS.gold }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.5"/>
      <path d="M12 5v2M12 17v2M5 12h2M17 12h2" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M9 9l6 3-6 3 2-3-2-3z" fill={color} opacity="0.7"/>
      <circle cx="12" cy="12" r="1.5" stroke={color} strokeWidth="1"/>
    </svg>
  ),
  mirror: ({ size = 24, color = COLORS.gold }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <ellipse cx="12" cy="10" rx="6.5" ry="7.5" stroke={color} strokeWidth="1.5"/>
      <path d="M12 17.5v4.5M9 22h6" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <ellipse cx="12" cy="10" rx="4.5" ry="5.5" stroke={color} strokeWidth="1" opacity="0.4"/>
    </svg>
  ),
  feather: ({ size = 24, color = COLORS.gold }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M5 20l15-15c2.5-2.5 2.5-4 0-4s-4 1.5-6 4L5 20z" stroke={color} strokeWidth="1.5"/>
      <path d="M9 16l-4 4M14 10c-2.5 0-5 1.5-6 4" stroke={color} strokeWidth="1" strokeLinecap="round"/>
    </svg>
  ),
  thread: ({ size = 24, color = COLORS.gold }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="6.5" stroke={color} strokeWidth="1.5"/>
      <circle cx="12" cy="12" r="3.5" stroke={color} strokeWidth="1"/>
      <path d="M12 5.5c3.5 1 6 3.5 6.5 6.5M18.5 12c0 3.5-2.5 6-6 7" stroke={color} strokeWidth="1" strokeLinecap="round"/>
    </svg>
  )
};

// ============================================================================
// 20 CORNER ORNAMENTS
// ============================================================================
export const CornerOrnaments = {
  classic: ({ size = 60, color = COLORS.gold, rotation = 0 }) => (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none" style={{ transform: `rotate(${rotation}deg)` }}>
      <path d="M0 35Q0 0 35 0" stroke={color} strokeWidth="2" opacity="0.8"/>
      <path d="M0 25Q0 0 25 0" stroke={color} strokeWidth="1.5" opacity="0.5"/>
      <path d="M5 40Q5 5 40 5" stroke={color} strokeWidth="1" opacity="0.3"/>
      <circle cx="18" cy="18" r="2.5" fill={color} opacity="0.6"/>
    </svg>
  ),
  elaborate: ({ size = 60, color = COLORS.gold, rotation = 0 }) => (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none" style={{ transform: `rotate(${rotation}deg)` }}>
      <path d="M0 45Q0 0 45 0" stroke={color} strokeWidth="2.5" opacity="0.9"/>
      <path d="M0 35Q0 0 35 0" stroke={color} strokeWidth="1.5" opacity="0.6"/>
      <path d="M0 25Q0 0 25 0" stroke={color} strokeWidth="1" opacity="0.4"/>
      <path d="M8 52Q8 8 52 8" stroke={COLORS.crimson} strokeWidth="1" opacity="0.4"/>
      <polygon points="15 15 20 8 25 15 20 22" fill={COLORS.crimson} opacity="0.8"/>
      <circle cx="28" cy="28" r="2.5" fill={color} opacity="0.6"/>
    </svg>
  ),
  floral: ({ size = 60, color = COLORS.gold, rotation = 0 }) => (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none" style={{ transform: `rotate(${rotation}deg)` }}>
      <path d="M0 40Q0 0 40 0" stroke={color} strokeWidth="2" opacity="0.8"/>
      <path d="M5 5Q18 18 5 30Q18 18 30 5" stroke={color} strokeWidth="1.5" opacity="0.6"/>
      <circle cx="12" cy="12" r="4" fill={color} opacity="0.4"/>
      <circle cx="6" cy="24" r="2" fill={color} opacity="0.3"/>
      <circle cx="24" cy="6" r="2" fill={color} opacity="0.3"/>
    </svg>
  ),
  celtic: ({ size = 60, color = COLORS.gold, rotation = 0 }) => (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none" style={{ transform: `rotate(${rotation}deg)` }}>
      <path d="M0 45Q0 0 45 0" stroke={color} strokeWidth="2" opacity="0.8"/>
      <path d="M12 12Q25 5 38 12Q30 25 12 12" stroke={color} strokeWidth="1.5" opacity="0.6" fill="none"/>
      <path d="M5 30Q12 18 30 5" stroke={color} strokeWidth="1" opacity="0.4"/>
      <circle cx="20" cy="12" r="2" fill={color} opacity="0.5"/>
    </svg>
  ),
  artNouveau: ({ size = 60, color = COLORS.gold, rotation = 0 }) => (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none" style={{ transform: `rotate(${rotation}deg)` }}>
      <path d="M0 50C0 22 22 0 50 0" stroke={color} strokeWidth="2" opacity="0.8"/>
      <path d="M0 35C0 12 12 0 35 0" stroke={color} strokeWidth="1.5" opacity="0.5"/>
      <path d="M4 18C10 10 18 4 28 4" stroke={color} strokeWidth="1" opacity="0.4"/>
      <ellipse cx="14" cy="14" rx="5" ry="2.5" fill={color} opacity="0.3" transform="rotate(-45 14 14)"/>
    </svg>
  ),
  geometric: ({ size = 60, color = COLORS.gold, rotation = 0 }) => (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none" style={{ transform: `rotate(${rotation}deg)` }}>
      <path d="M0 45L45 0M0 35L35 0M0 25L25 0" stroke={color} strokeWidth="1.5" opacity="0.6"/>
      <rect x="6" y="6" width="12" height="12" stroke={color} strokeWidth="1" opacity="0.4" fill="none"/>
      <circle cx="12" cy="12" r="2" fill={color} opacity="0.6"/>
    </svg>
  ),
  vine: ({ size = 60, color = COLORS.gold, rotation = 0 }) => (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none" style={{ transform: `rotate(${rotation}deg)` }}>
      <path d="M0 40Q12 30 12 18Q12 6 24 0" stroke={color} strokeWidth="2" opacity="0.8"/>
      <path d="M12 18Q6 12 12 6" stroke={color} strokeWidth="1" opacity="0.5"/>
      <circle cx="12" cy="18" r="3" fill={color} opacity="0.6"/>
      <circle cx="6" cy="30" r="2" fill={color} opacity="0.4"/>
    </svg>
  ),
  occult: ({ size = 60, color = COLORS.gold, rotation = 0 }) => (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none" style={{ transform: `rotate(${rotation}deg)` }}>
      <path d="M0 45Q0 0 45 0" stroke={color} strokeWidth="2" opacity="0.8"/>
      <polygon points="18 18 24 10 30 18 24 26" stroke={color} strokeWidth="1" fill="none" opacity="0.6"/>
      <circle cx="24" cy="18" r="4" stroke={color} strokeWidth="0.5" opacity="0.4"/>
      <circle cx="24" cy="18" r="1.5" fill={color} opacity="0.5"/>
    </svg>
  ),
  simple: ({ size = 60, color = COLORS.gold, rotation = 0 }) => (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none" style={{ transform: `rotate(${rotation}deg)` }}>
      <path d="M0 35Q0 0 35 0" stroke={color} strokeWidth="1.5" opacity="0.7"/>
      <circle cx="12" cy="12" r="2" fill={color} opacity="0.5"/>
    </svg>
  ),
  double: ({ size = 60, color = COLORS.gold, rotation = 0 }) => (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none" style={{ transform: `rotate(${rotation}deg)` }}>
      <path d="M0 40Q0 0 40 0" stroke={color} strokeWidth="2" opacity="0.8"/>
      <path d="M4 37Q4 4 37 4" stroke={COLORS.crimson} strokeWidth="1.5" opacity="0.5"/>
      <circle cx="15" cy="15" r="2" fill={color} opacity="0.6"/>
    </svg>
  ),
  diamond: ({ size = 60, color = COLORS.gold, rotation = 0 }) => (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none" style={{ transform: `rotate(${rotation}deg)` }}>
      <path d="M0 38Q0 0 38 0" stroke={color} strokeWidth="2" opacity="0.8"/>
      <polygon points="15 8 20 15 15 22 10 15" fill={color} opacity="0.4"/>
      <polygon points="15 8 20 15 15 22 10 15" stroke={color} strokeWidth="1" opacity="0.7" fill="none"/>
    </svg>
  ),
  star: ({ size = 60, color = COLORS.gold, rotation = 0 }) => (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none" style={{ transform: `rotate(${rotation}deg)` }}>
      <path d="M0 40Q0 0 40 0" stroke={color} strokeWidth="2" opacity="0.8"/>
      <path d="M15 6l1.5 4.5h4.5l-3.5 2.5 1.5 4.5-4-3-4 3 1.5-4.5-3.5-2.5h4.5z" fill={color} opacity="0.5"/>
    </svg>
  ),
  spiral: ({ size = 60, color = COLORS.gold, rotation = 0 }) => (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none" style={{ transform: `rotate(${rotation}deg)` }}>
      <path d="M0 42Q0 0 42 0" stroke={color} strokeWidth="2" opacity="0.8"/>
      <path d="M20 20C12 20 12 12 20 12C28 12 28 20 20 20C12 20 16 16 20 16" stroke={color} strokeWidth="1.2" opacity="0.6" fill="none"/>
    </svg>
  ),
  wave: ({ size = 60, color = COLORS.gold, rotation = 0 }) => (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none" style={{ transform: `rotate(${rotation}deg)` }}>
      <path d="M0 40Q20 30 20 15Q20 0 40 0" stroke={color} strokeWidth="2" opacity="0.8"/>
      <path d="M0 30Q15 22 15 10Q15 0 30 0" stroke={color} strokeWidth="1" opacity="0.4"/>
    </svg>
  ),
  leaf: ({ size = 60, color = COLORS.gold, rotation = 0 }) => (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none" style={{ transform: `rotate(${rotation}deg)` }}>
      <path d="M0 38Q0 0 38 0" stroke={color} strokeWidth="2" opacity="0.8"/>
      <path d="M8 28Q8 8 28 8" stroke={color} strokeWidth="1" opacity="0.4"/>
      <path d="M12 12C8 16 8 24 16 20C12 16 16 12 12 12" fill={color} opacity="0.4"/>
    </svg>
  ),
  cross: ({ size = 60, color = COLORS.gold, rotation = 0 }) => (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none" style={{ transform: `rotate(${rotation}deg)` }}>
      <path d="M0 40Q0 0 40 0" stroke={color} strokeWidth="2" opacity="0.8"/>
      <path d="M12 8v12M6 14h12" stroke={color} strokeWidth="1.5" opacity="0.6" strokeLinecap="round"/>
    </svg>
  ),
  arc: ({ size = 60, color = COLORS.gold, rotation = 0 }) => (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none" style={{ transform: `rotate(${rotation}deg)` }}>
      <path d="M0 35Q0 0 35 0" stroke={color} strokeWidth="2" opacity="0.8"/>
      <path d="M0 50C0 25 25 0 50 0" stroke={color} strokeWidth="1" opacity="0.3"/>
      <circle cx="20" cy="20" r="1.5" fill={color} opacity="0.5"/>
    </svg>
  ),
  bracket: ({ size = 60, color = COLORS.gold, rotation = 0 }) => (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none" style={{ transform: `rotate(${rotation}deg)` }}>
      <path d="M0 35L0 0L35 0" stroke={color} strokeWidth="2" opacity="0.8"/>
      <path d="M5 30L5 5L30 5" stroke={color} strokeWidth="1" opacity="0.4"/>
      <circle cx="12" cy="12" r="2" fill={color} opacity="0.5"/>
    </svg>
  ),
  scroll: ({ size = 60, color = COLORS.gold, rotation = 0 }) => (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none" style={{ transform: `rotate(${rotation}deg)` }}>
      <path d="M0 38Q0 0 38 0" stroke={color} strokeWidth="2" opacity="0.8"/>
      <path d="M8 8C4 12 6 20 14 18C10 14 14 10 8 8" stroke={color} strokeWidth="1.2" opacity="0.6" fill="none"/>
    </svg>
  ),
  tassel: ({ size = 60, color = COLORS.gold, rotation = 0 }) => (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none" style={{ transform: `rotate(${rotation}deg)` }}>
      <path d="M0 35Q0 0 35 0" stroke={color} strokeWidth="2" opacity="0.8"/>
      <circle cx="18" cy="18" r="4" stroke={color} strokeWidth="1.2" opacity="0.6"/>
      <path d="M18 22v8M15 22v6M21 22v6" stroke={color} strokeWidth="1" opacity="0.5" strokeLinecap="round"/>
    </svg>
  )
};

// ============================================================================
// 12 DIVIDER STRIPS
// ============================================================================
export const DividerStrips = {
  classic: ({ width = 200, color = COLORS.gold }) => (
    <svg width={width} height="20" viewBox="0 0 200 20" fill="none" preserveAspectRatio="xMidYMid meet">
      <line x1="0" y1="10" x2="80" y2="10" stroke={color} strokeWidth="1" opacity="0.5"/>
      <circle cx="90" cy="10" r="3" fill={color} opacity="0.6"/>
      <polygon points="100 6 104 10 100 14 96 10" fill={color} opacity="0.8"/>
      <circle cx="110" cy="10" r="3" fill={color} opacity="0.6"/>
      <line x1="120" y1="10" x2="200" y2="10" stroke={color} strokeWidth="1" opacity="0.5"/>
    </svg>
  ),
  moon: ({ width = 200, color = COLORS.gold }) => (
    <svg width={width} height="24" viewBox="0 0 200 24" fill="none" preserveAspectRatio="xMidYMid meet">
      <line x1="0" y1="12" x2="65" y2="12" stroke={color} strokeWidth="1" opacity="0.4"/>
      <path d="M78 12c0-4 3-7 7-7-2 0-4 3-4 7s2 7 4 7c-4 0-7-3-7-7z" fill={color} opacity="0.5"/>
      <circle cx="100" cy="12" r="5" fill={color} opacity="0.8"/>
      <path d="M122 12c0 4-3 7-7 7 2 0 4-3 4-7s-2-7-4-7c4 0 7 3 7 7z" fill={color} opacity="0.5"/>
      <line x1="135" y1="12" x2="200" y2="12" stroke={color} strokeWidth="1" opacity="0.4"/>
    </svg>
  ),
  stars: ({ width = 200, color = COLORS.gold }) => (
    <svg width={width} height="20" viewBox="0 0 200 20" fill="none" preserveAspectRatio="xMidYMid meet">
      <line x1="0" y1="10" x2="55" y2="10" stroke={color} strokeWidth="1" opacity="0.4"/>
      <polygon points="70 10 72 6 74 10 72 14" fill={color} opacity="0.5"/>
      <polygon points="85 10 88 4 91 10 88 16" fill={color} opacity="0.6"/>
      <polygon points="100 10 104 2 108 10 104 18" fill={color} opacity="0.9"/>
      <polygon points="115 10 118 4 121 10 118 16" fill={color} opacity="0.6"/>
      <polygon points="130 10 132 6 134 10 132 14" fill={color} opacity="0.5"/>
      <line x1="145" y1="10" x2="200" y2="10" stroke={color} strokeWidth="1" opacity="0.4"/>
    </svg>
  ),
  diamonds: ({ width = 200, color = COLORS.gold }) => (
    <svg width={width} height="22" viewBox="0 0 200 22" fill="none" preserveAspectRatio="xMidYMid meet">
      <line x1="0" y1="11" x2="70" y2="11" stroke={color} strokeWidth="1" opacity="0.5"/>
      <polygon points="82 11 87 6 92 11 87 16" fill={COLORS.crimson} opacity="0.7"/>
      <polygon points="97 11 105 3 113 11 105 19" fill={color} opacity="0.9"/>
      <polygon points="118 11 123 6 128 11 123 16" fill={COLORS.crimson} opacity="0.7"/>
      <line x1="140" y1="11" x2="200" y2="11" stroke={color} strokeWidth="1" opacity="0.5"/>
    </svg>
  ),
  wave: ({ width = 200, color = COLORS.gold }) => (
    <svg width={width} height="20" viewBox="0 0 200 20" fill="none" preserveAspectRatio="xMidYMid meet">
      <path d="M0 10Q25 4 50 10T100 10T150 10T200 10" stroke={color} strokeWidth="1.5" fill="none" opacity="0.6"/>
      <circle cx="100" cy="10" r="4" fill={color} opacity="0.8"/>
    </svg>
  ),
  dots: ({ width = 200, color = COLORS.gold }) => (
    <svg width={width} height="20" viewBox="0 0 200 20" fill="none" preserveAspectRatio="xMidYMid meet">
      {[0, 16, 32, 48, 64, 80, 92, 108, 120, 136, 152, 168, 184, 200].map((x, i) => (
        <circle key={i} cx={x} cy="10" r={i === 6 || i === 7 ? 3.5 : 1.5} fill={color} opacity={i === 6 || i === 7 ? 0.8 : 0.4}/>
      ))}
    </svg>
  ),
  ornate: ({ width = 200, color = COLORS.gold }) => (
    <svg width={width} height="28" viewBox="0 0 200 28" fill="none" preserveAspectRatio="xMidYMid meet">
      <line x1="0" y1="14" x2="60" y2="14" stroke={color} strokeWidth="1" opacity="0.4"/>
      <path d="M65 14Q78 6 91 14Q78 22 65 14" stroke={color} strokeWidth="1.5" fill="none" opacity="0.6"/>
      <polygon points="100 10 106 14 100 18 94 14" fill={color} opacity="0.9"/>
      <path d="M109 14Q122 6 135 14Q122 22 109 14" stroke={color} strokeWidth="1.5" fill="none" opacity="0.6"/>
      <line x1="140" y1="14" x2="200" y2="14" stroke={color} strokeWidth="1" opacity="0.4"/>
    </svg>
  ),
  celtic: ({ width = 200, color = COLORS.gold }) => (
    <svg width={width} height="24" viewBox="0 0 200 24" fill="none" preserveAspectRatio="xMidYMid meet">
      <line x1="0" y1="12" x2="65" y2="12" stroke={color} strokeWidth="1" opacity="0.4"/>
      <path d="M70 12Q82 6 94 12Q82 18 70 12M94 12Q106 6 118 12Q106 18 94 12" stroke={color} strokeWidth="1.5" fill="none" opacity="0.7"/>
      <circle cx="94" cy="12" r="2" fill={color} opacity="0.8"/>
      <line x1="125" y1="12" x2="200" y2="12" stroke={color} strokeWidth="1" opacity="0.4"/>
    </svg>
  ),
  arrows: ({ width = 200, color = COLORS.gold }) => (
    <svg width={width} height="20" viewBox="0 0 200 20" fill="none" preserveAspectRatio="xMidYMid meet">
      <line x1="0" y1="10" x2="78" y2="10" stroke={color} strokeWidth="1" opacity="0.5"/>
      <polygon points="88 10 94 5 94 15" fill={color} opacity="0.6"/>
      <polygon points="112 10 106 5 106 15" fill={color} opacity="0.6"/>
      <line x1="122" y1="10" x2="200" y2="10" stroke={color} strokeWidth="1" opacity="0.5"/>
    </svg>
  ),
  simple: ({ width = 200, color = COLORS.gold }) => (
    <svg width={width} height="12" viewBox="0 0 200 12" fill="none" preserveAspectRatio="xMidYMid meet">
      <line x1="0" y1="6" x2="94" y2="6" stroke={color} strokeWidth="1" opacity="0.5"/>
      <circle cx="100" cy="6" r="3" fill={color} opacity="0.8"/>
      <line x1="106" y1="6" x2="200" y2="6" stroke={color} strokeWidth="1" opacity="0.5"/>
    </svg>
  ),
  doubleLine: ({ width = 200, color = COLORS.gold }) => (
    <svg width={width} height="18" viewBox="0 0 200 18" fill="none" preserveAspectRatio="xMidYMid meet">
      <line x1="0" y1="6" x2="200" y2="6" stroke={color} strokeWidth="1" opacity="0.4"/>
      <line x1="0" y1="12" x2="200" y2="12" stroke={color} strokeWidth="1" opacity="0.4"/>
      <circle cx="100" cy="9" r="5" fill={color} opacity="0.6"/>
    </svg>
  ),
  gradient: ({ width = 200, color = COLORS.gold }) => (
    <svg width={width} height="14" viewBox="0 0 200 14" fill="none" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="divGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={color} stopOpacity="0"/>
          <stop offset="50%" stopColor={color} stopOpacity="0.8"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <line x1="0" y1="7" x2="200" y2="7" stroke="url(#divGrad)" strokeWidth="2"/>
    </svg>
  )
};

// ============================================================================
// GUIDE-SPECIFIC DIVIDER STRIPS
// Per-guide ornamental vocabulary, 1–2px gold strokes, bilateral symmetry.
// Each guide gets 3 variants; the spell renderer cycles them down the page.
// ============================================================================
export const GuideDividerStrips = {
  botanicalSprig: ({ width = 200, color = COLORS.gold }) => (
    <svg width={width} height="24" viewBox="0 0 200 24" fill="none" preserveAspectRatio="xMidYMid meet">
      <line x1="0" y1="12" x2="60" y2="12" stroke={color} strokeWidth="1" opacity="0.4"/>
      <path d="M68 12Q74 6 80 8L88 12L80 16Q74 18 68 12" stroke={color} strokeWidth="1.5" fill="none" opacity="0.6"/>
      <circle cx="100" cy="12" r="2.5" fill={color} opacity="0.8"/>
      <path d="M132 12Q126 6 120 8L112 12L120 16Q126 18 132 12" stroke={color} strokeWidth="1.5" fill="none" opacity="0.6"/>
      <line x1="140" y1="12" x2="200" y2="12" stroke={color} strokeWidth="1" opacity="0.4"/>
    </svg>
  ),
  teacupSteam: ({ width = 200, color = COLORS.gold }) => (
    <svg width={width} height="24" viewBox="0 0 200 24" fill="none" preserveAspectRatio="xMidYMid meet">
      <line x1="0" y1="12" x2="70" y2="12" stroke={color} strokeWidth="1" opacity="0.4"/>
      <path d="M80 16Q84 16 86 14L88 12L86 10Q84 8 80 8" stroke={color} strokeWidth="1.5" fill="none" opacity="0.5"/>
      <path d="M92 8Q96 4 100 8Q104 4 108 8" stroke={color} strokeWidth="1" fill="none" opacity="0.5"/>
      <path d="M120 16Q116 16 114 14L112 12L114 10Q116 8 120 8" stroke={color} strokeWidth="1.5" fill="none" opacity="0.5"/>
      <line x1="130" y1="12" x2="200" y2="12" stroke={color} strokeWidth="1" opacity="0.4"/>
    </svg>
  ),
  birdBranch: ({ width = 200, color = COLORS.gold }) => (
    <svg width={width} height="24" viewBox="0 0 200 24" fill="none" preserveAspectRatio="xMidYMid meet">
      <line x1="0" y1="14" x2="65" y2="14" stroke={color} strokeWidth="1" opacity="0.4"/>
      <path d="M70 14L130 14" stroke={color} strokeWidth="1.5" opacity="0.5"/>
      <path d="M75 14Q78 10 82 14" stroke={color} strokeWidth="1" fill="none" opacity="0.4"/>
      <path d="M118 14Q122 10 126 14" stroke={color} strokeWidth="1" fill="none" opacity="0.4"/>
      <ellipse cx="100" cy="10" rx="4" ry="3" stroke={color} strokeWidth="1.5" fill="none" opacity="0.7"/>
      <path d="M96 10L93 11" stroke={color} strokeWidth="1" opacity="0.6"/>
      <line x1="135" y1="14" x2="200" y2="14" stroke={color} strokeWidth="1" opacity="0.4"/>
    </svg>
  ),
  featherNote: ({ width = 200, color = COLORS.gold }) => (
    <svg width={width} height="24" viewBox="0 0 200 24" fill="none" preserveAspectRatio="xMidYMid meet">
      <line x1="0" y1="12" x2="65" y2="12" stroke={color} strokeWidth="1" opacity="0.4"/>
      <path d="M72 12Q80 6 88 12Q80 18 72 12" stroke={color} strokeWidth="1.5" fill="none" opacity="0.6"/>
      <path d="M94 8L100 12L94 16" stroke={color} strokeWidth="1" fill="none" opacity="0.5"/>
      <path d="M106 8L100 12L106 16" stroke={color} strokeWidth="1" fill="none" opacity="0.5"/>
      <path d="M112 12Q120 6 128 12Q120 18 112 12" stroke={color} strokeWidth="1.5" fill="none" opacity="0.6"/>
      <line x1="135" y1="12" x2="200" y2="12" stroke={color} strokeWidth="1" opacity="0.4"/>
    </svg>
  ),
  talismanChain: ({ width = 200, color = COLORS.gold }) => (
    <svg width={width} height="24" viewBox="0 0 200 24" fill="none" preserveAspectRatio="xMidYMid meet">
      <line x1="0" y1="12" x2="60" y2="12" stroke={color} strokeWidth="1" opacity="0.4"/>
      <circle cx="72" cy="12" r="4" stroke={color} strokeWidth="1.5" fill="none" opacity="0.5"/>
      <line x1="76" y1="12" x2="86" y2="12" stroke={color} strokeWidth="1" opacity="0.5"/>
      <polygon points="100 6 106 12 100 18 94 12" stroke={color} strokeWidth="1.5" fill="none" opacity="0.7"/>
      <line x1="114" y1="12" x2="124" y2="12" stroke={color} strokeWidth="1" opacity="0.5"/>
      <circle cx="128" cy="12" r="4" stroke={color} strokeWidth="1.5" fill="none" opacity="0.5"/>
      <line x1="140" y1="12" x2="200" y2="12" stroke={color} strokeWidth="1" opacity="0.4"/>
    </svg>
  ),
  needleThread: ({ width = 200, color = COLORS.gold }) => (
    <svg width={width} height="24" viewBox="0 0 200 24" fill="none" preserveAspectRatio="xMidYMid meet">
      <path d="M0 12Q20 6 40 12Q60 18 80 12Q90 8 100 12Q110 16 120 12Q140 6 160 12Q180 18 200 12" stroke={color} strokeWidth="1" fill="none" opacity="0.4" strokeDasharray="4 3"/>
      <ellipse cx="100" cy="12" rx="2" ry="5" stroke={color} strokeWidth="1.5" fill="none" opacity="0.7"/>
      <circle cx="100" cy="10" r="0.8" fill={color} opacity="0.8"/>
    </svg>
  ),
  stitchedSeam: ({ width = 200, color = COLORS.gold }) => (
    <svg width={width} height="20" viewBox="0 0 200 20" fill="none" preserveAspectRatio="xMidYMid meet">
      <line x1="0" y1="10" x2="200" y2="10" stroke={color} strokeWidth="0.5" opacity="0.3"/>
      {[20,40,60,80,100,120,140,160,180].map((x, i) => (
        <line key={i} x1={x-4} y1={i % 2 === 0 ? 6 : 14} x2={x+4} y2={i % 2 === 0 ? 14 : 6} stroke={color} strokeWidth="1.5" opacity="0.5"/>
      ))}
      <circle cx="100" cy="10" r="3" stroke={color} strokeWidth="1" fill="none" opacity="0.7"/>
    </svg>
  ),
  pinPentacle: ({ width = 200, color = COLORS.gold }) => (
    <svg width={width} height="24" viewBox="0 0 200 24" fill="none" preserveAspectRatio="xMidYMid meet">
      <line x1="0" y1="12" x2="70" y2="12" stroke={color} strokeWidth="1" opacity="0.4"/>
      <circle cx="82" cy="12" r="1.5" fill={color} opacity="0.6"/>
      <polygon points="100 4 103 10 110 10 105 14 107 20 100 16 93 20 95 14 90 10 97 10" stroke={color} strokeWidth="1" fill="none" opacity="0.7"/>
      <circle cx="118" cy="12" r="1.5" fill={color} opacity="0.6"/>
      <line x1="130" y1="12" x2="200" y2="12" stroke={color} strokeWidth="1" opacity="0.4"/>
    </svg>
  ),
  redThreadLine: ({ width = 200, color = COLORS.gold }) => (
    <svg width={width} height="20" viewBox="0 0 200 20" fill="none" preserveAspectRatio="xMidYMid meet">
      <line x1="0" y1="10" x2="75" y2="10" stroke={color} strokeWidth="1" opacity="0.4"/>
      <path d="M80 10L88 6L96 14L104 6L112 14L120 10" stroke={COLORS.crimson} strokeWidth="1.5" fill="none" opacity="0.6"/>
      <circle cx="100" cy="10" r="2" fill={COLORS.crimson} opacity="0.7"/>
      <line x1="125" y1="10" x2="200" y2="10" stroke={color} strokeWidth="1" opacity="0.4"/>
    </svg>
  ),
  magnifierDots: ({ width = 200, color = COLORS.gold }) => (
    <svg width={width} height="24" viewBox="0 0 200 24" fill="none" preserveAspectRatio="xMidYMid meet">
      <line x1="0" y1="12" x2="70" y2="12" stroke={color} strokeWidth="1" opacity="0.4"/>
      {[76,82,88].map((x, i) => <circle key={i} cx={x} cy="12" r="1.5" fill={color} opacity="0.5"/>)}
      <circle cx="100" cy="12" r="7" stroke={color} strokeWidth="1.5" fill="none" opacity="0.6"/>
      <line x1="105" y1="17" x2="110" y2="22" stroke={color} strokeWidth="1.5" opacity="0.6"/>
      {[112,118,124].map((x, i) => <circle key={i} cx={x} cy="12" r="1.5" fill={color} opacity="0.5"/>)}
      <line x1="130" y1="12" x2="200" y2="12" stroke={color} strokeWidth="1" opacity="0.4"/>
    </svg>
  ),
  mapContour: ({ width = 200, color = COLORS.gold }) => (
    <svg width={width} height="24" viewBox="0 0 200 24" fill="none" preserveAspectRatio="xMidYMid meet">
      <line x1="0" y1="12" x2="60" y2="12" stroke={color} strokeWidth="1" opacity="0.4"/>
      <path d="M65 8Q75 16 85 8Q95 16 105 8Q115 16 125 8Q135 16 135 12" stroke={color} strokeWidth="1" fill="none" opacity="0.4"/>
      <path d="M70 16Q80 8 90 16Q100 8 110 16Q120 8 130 16" stroke={color} strokeWidth="1" fill="none" opacity="0.3"/>
      <circle cx="100" cy="12" r="2" fill={color} opacity="0.7"/>
      <line x1="140" y1="12" x2="200" y2="12" stroke={color} strokeWidth="1" opacity="0.4"/>
    </svg>
  ),
  envelopeSeam: ({ width = 200, color = COLORS.gold }) => (
    <svg width={width} height="24" viewBox="0 0 200 24" fill="none" preserveAspectRatio="xMidYMid meet">
      <line x1="0" y1="12" x2="70" y2="12" stroke={color} strokeWidth="1" opacity="0.4"/>
      <path d="M75 8L100 18L125 8" stroke={color} strokeWidth="1.5" fill="none" opacity="0.5"/>
      <line x1="75" y1="8" x2="125" y2="8" stroke={color} strokeWidth="1" opacity="0.4"/>
      <circle cx="100" cy="6" r="2" fill={color} opacity="0.7"/>
      <line x1="130" y1="12" x2="200" y2="12" stroke={color} strokeWidth="1" opacity="0.4"/>
    </svg>
  ),
  recipeRule: ({ width = 200, color = COLORS.gold }) => (
    <svg width={width} height="20" viewBox="0 0 200 20" fill="none" preserveAspectRatio="xMidYMid meet">
      <line x1="0" y1="7" x2="200" y2="7" stroke={color} strokeWidth="1" opacity="0.3"/>
      <line x1="0" y1="13" x2="200" y2="13" stroke={color} strokeWidth="1" opacity="0.3"/>
      <line x1="90" y1="4" x2="90" y2="16" stroke={color} strokeWidth="1" opacity="0.4"/>
      <circle cx="100" cy="10" r="3" fill={color} opacity="0.6"/>
      <line x1="110" y1="4" x2="110" y2="16" stroke={color} strokeWidth="1" opacity="0.4"/>
    </svg>
  ),
  featherQuill: ({ width = 200, color = COLORS.gold }) => (
    <svg width={width} height="24" viewBox="0 0 200 24" fill="none" preserveAspectRatio="xMidYMid meet">
      <line x1="0" y1="14" x2="72" y2="14" stroke={color} strokeWidth="1" opacity="0.4"/>
      <path d="M80 14Q88 6 96 10L100 12L104 10Q112 6 120 14" stroke={color} strokeWidth="1.5" fill="none" opacity="0.6"/>
      <line x1="100" y1="12" x2="100" y2="20" stroke={color} strokeWidth="1" opacity="0.5"/>
      <line x1="128" y1="14" x2="200" y2="14" stroke={color} strokeWidth="1" opacity="0.4"/>
    </svg>
  ),
};

// ============================================================================
// GUIDE ORNAMENT CONFIG — Per-guide visual DNA (§4 of Visual System Brief)
// Never mix guide characteristics. The spell renderer pulls the active guide's
// set instead of PAGE_ORNAMENT_CONFIG for spell pages.
// ============================================================================
export const GUIDE_ORNAMENT_CONFIG = {
  shigg: {
    corner: 'floral',
    dividers: ['botanicalSprig', 'teacupSteam', 'birdBranch'],
    accentGlyph: 'robin',
    secondaryGlyph: 'wren',
    tint: 'amber',
  },
  cathleen: {
    corner: 'celtic',
    dividers: ['celtic', 'featherNote', 'talismanChain'],
    accentGlyph: 'triquetra',
    secondaryGlyph: 'raven',
    tint: 'teal',
  },
  katherine: {
    corner: 'occult',
    dividers: ['needleThread', 'stitchedSeam', 'pinPentacle'],
    accentGlyph: 'thread',
    secondaryGlyph: 'mirror',
    tint: 'violet',
  },
  theresa: {
    corner: 'geometric',
    dividers: ['redThreadLine', 'magnifierDots', 'mapContour'],
    accentGlyph: 'key',
    secondaryGlyph: 'compass',
    tint: 'oxblood',
  },
  brenda: {
    corner: 'scroll',
    dividers: ['envelopeSeam', 'recipeRule', 'featherQuill'],
    accentGlyph: 'feather',
    secondaryGlyph: 'crow',
    tint: 'sepia',
  },
};

// Helper: get a guide's divider component by index (cycles through the 3 variants)
export const getGuideDivider = (guideId, sectionIndex = 0, props = {}) => {
  const config = GUIDE_ORNAMENT_CONFIG[guideId];
  if (!config) return getDividerForPage('default', props);
  const dividerName = config.dividers[sectionIndex % config.dividers.length];
  const Divider = GuideDividerStrips[dividerName] || DividerStrips[dividerName] || DividerStrips.classic;
  return <Divider {...props} />;
};

// Helper: get full guide ornament set for a spell page
export const getGuideOrnamentSet = (guideId) => {
  const config = GUIDE_ORNAMENT_CONFIG[guideId];
  if (!config) return null;
  const Corner = CornerOrnaments[config.corner] || CornerOrnaments.classic;
  return {
    config,
    Corner,
    getDivider: (idx, props = {}) => getGuideDivider(guideId, idx, props),
    accentGlyph: BestiaryGlyphs[config.accentGlyph],
    secondaryGlyph: BestiaryGlyphs[config.secondaryGlyph],
  };
};

// ============================================================================
// PAGE ORNAMENT CONFIG - Single Source of Truth
// Deterministic mapping: each page gets specific ornaments
// ============================================================================
export const PAGE_ORNAMENT_CONFIG = {
  // Core pages
  'home': {
    cornerStyle: 'elaborate',
    dividerStyle: 'moon',
    accentGlyph: 'crow',
    secondaryGlyph: 'crescent'
  },
  'guides': {
    cornerStyle: 'celtic',
    dividerStyle: 'celtic',
    accentGlyph: 'feather',
    secondaryGlyph: 'owl'
  },
  'spell-request': {
    cornerStyle: 'occult',
    dividerStyle: 'stars',
    accentGlyph: 'candle',
    secondaryGlyph: 'pentacle'
  },
  'my-grimoire': {
    cornerStyle: 'elaborate',
    dividerStyle: 'ornate',
    accentGlyph: 'key',
    secondaryGlyph: 'feather'
  },
  'profile': {
    cornerStyle: 'simple',
    dividerStyle: 'simple',
    accentGlyph: 'mirror',
    secondaryGlyph: 'thread'
  },
  'upgrade': {
    cornerStyle: 'diamond',
    dividerStyle: 'diamonds',
    accentGlyph: 'sunDisc',
    secondaryGlyph: 'chalice'
  },
  // Explore
  'library': {
    cornerStyle: 'artNouveau',
    dividerStyle: 'ornate',
    accentGlyph: 'key',
    secondaryGlyph: 'feather'
  },
  'corrie-tarot': {
    cornerStyle: 'occult',
    dividerStyle: 'moon',
    accentGlyph: 'crescent',
    secondaryGlyph: 'owl'
  },
  'ward-finder': {
    cornerStyle: 'celtic',
    dividerStyle: 'celtic',
    accentGlyph: 'triquetra',
    secondaryGlyph: 'serpent'
  },
  'ai-chat': {
    cornerStyle: 'geometric',
    dividerStyle: 'dots',
    accentGlyph: 'compass',
    secondaryGlyph: 'bell'
  },
  'ai-image': {
    cornerStyle: 'artNouveau',
    dividerStyle: 'wave',
    accentGlyph: 'mirror',
    secondaryGlyph: 'moth'
  },
  // Archives
  'deities': {
    cornerStyle: 'elaborate',
    dividerStyle: 'moon',
    accentGlyph: 'triquetra',
    secondaryGlyph: 'crescent'
  },
  'figures': {
    cornerStyle: 'vine',
    dividerStyle: 'classic',
    accentGlyph: 'feather',
    secondaryGlyph: 'candle'
  },
  'sites': {
    cornerStyle: 'leaf',
    dividerStyle: 'wave',
    accentGlyph: 'compass',
    secondaryGlyph: 'stag'
  },
  'rituals': {
    cornerStyle: 'scroll',
    dividerStyle: 'ornate',
    accentGlyph: 'chalice',
    secondaryGlyph: 'bell'
  },
  'timeline': {
    cornerStyle: 'bracket',
    dividerStyle: 'arrows',
    accentGlyph: 'thread',
    secondaryGlyph: 'key'
  },
  // Info pages
  'about': {
    cornerStyle: 'floral',
    dividerStyle: 'classic',
    accentGlyph: 'crow',
    secondaryGlyph: 'feather'
  },
  'faq': {
    cornerStyle: 'simple',
    dividerStyle: 'simple',
    accentGlyph: 'key',
    secondaryGlyph: 'bell'
  },
  'privacy': {
    cornerStyle: 'bracket',
    dividerStyle: 'doubleLine',
    accentGlyph: 'mirror',
    secondaryGlyph: 'thread'
  },
  'auth': {
    cornerStyle: 'double',
    dividerStyle: 'gradient',
    accentGlyph: 'key',
    secondaryGlyph: 'candle'
  },
  'early-access': {
    cornerStyle: 'star',
    dividerStyle: 'stars',
    accentGlyph: 'crow',
    secondaryGlyph: 'crescent'
  },
  // Default fallback
  'default': {
    cornerStyle: 'classic',
    dividerStyle: 'classic',
    accentGlyph: 'crow',
    secondaryGlyph: 'feather'
  }
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

// Get a specific glyph component
export const getGlyph = (name, props = {}) => {
  const Glyph = BestiaryGlyphs[name];
  return Glyph ? <Glyph {...props} /> : null;
};

// Get corner ornament for a page and position
export const getCornerForPage = (pageId, position = 'top-left') => {
  const config = PAGE_ORNAMENT_CONFIG[pageId] || PAGE_ORNAMENT_CONFIG.default;
  const Corner = CornerOrnaments[config.cornerStyle] || CornerOrnaments.classic;
  
  const rotations = {
    'top-left': 0,
    'top-right': 90,
    'bottom-right': 180,
    'bottom-left': 270
  };
  
  return <Corner rotation={rotations[position] || 0} />;
};

// Get divider for a page
export const getDividerForPage = (pageId, props = {}) => {
  const config = PAGE_ORNAMENT_CONFIG[pageId] || PAGE_ORNAMENT_CONFIG.default;
  const Divider = DividerStrips[config.dividerStyle] || DividerStrips.classic;
  return <Divider {...props} />;
};

// Get accent glyph for a page
export const getAccentGlyph = (pageId, props = {}) => {
  const config = PAGE_ORNAMENT_CONFIG[pageId] || PAGE_ORNAMENT_CONFIG.default;
  return getGlyph(config.accentGlyph, props);
};

// Get secondary glyph for a page
export const getSecondaryGlyph = (pageId, props = {}) => {
  const config = PAGE_ORNAMENT_CONFIG[pageId] || PAGE_ORNAMENT_CONFIG.default;
  return getGlyph(config.secondaryGlyph, props);
};

// Get full page ornament set
export const getPageOrnamentSet = (pageId) => {
  const config = PAGE_ORNAMENT_CONFIG[pageId] || PAGE_ORNAMENT_CONFIG.default;
  
  return {
    config,
    corners: {
      topLeft: getCornerForPage(pageId, 'top-left'),
      topRight: getCornerForPage(pageId, 'top-right'),
      bottomLeft: getCornerForPage(pageId, 'bottom-left'),
      bottomRight: getCornerForPage(pageId, 'bottom-right')
    },
    divider: getDividerForPage(pageId),
    glyphs: {
      accent: getAccentGlyph(pageId),
      secondary: getSecondaryGlyph(pageId)
    }
  };
};

// ============================================================================
// REUSABLE ORNAMENT COMPONENTS
// ============================================================================

// PageCorners - renders all 4 corners for a page
export const PageCorners = ({ pageId, size = 60, className = '' }) => {
  const config = PAGE_ORNAMENT_CONFIG[pageId] || PAGE_ORNAMENT_CONFIG.default;
  const Corner = CornerOrnaments[config.cornerStyle] || CornerOrnaments.classic;
  
  return (
    <>
      <div className={`absolute top-2 left-2 w-${Math.round(size/4)} h-${Math.round(size/4)} ${className}`} style={{ width: size, height: size }}>
        <Corner size={size} rotation={0} />
      </div>
      <div className={`absolute top-2 right-2 ${className}`} style={{ width: size, height: size }}>
        <Corner size={size} rotation={90} />
      </div>
      <div className={`absolute bottom-2 left-2 ${className}`} style={{ width: size, height: size }}>
        <Corner size={size} rotation={270} />
      </div>
      <div className={`absolute bottom-2 right-2 ${className}`} style={{ width: size, height: size }}>
        <Corner size={size} rotation={180} />
      </div>
    </>
  );
};

// SectionDivider - renders a decorative divider
export const SectionDivider = ({ pageId, width = 200, className = '' }) => {
  const config = PAGE_ORNAMENT_CONFIG[pageId] || PAGE_ORNAMENT_CONFIG.default;
  const Divider = DividerStrips[config.dividerStyle] || DividerStrips.classic;
  
  return (
    <div className={`flex justify-center ${className}`}>
      <Divider width={width} />
    </div>
  );
};

// GlyphAccent - renders an accent glyph
export const GlyphAccent = ({ pageId, size = 24, color = COLORS.gold, className = '' }) => {
  const config = PAGE_ORNAMENT_CONFIG[pageId] || PAGE_ORNAMENT_CONFIG.default;
  const Glyph = BestiaryGlyphs[config.accentGlyph];
  
  return Glyph ? (
    <span className={className}>
      <Glyph size={size} color={color} />
    </span>
  ) : null;
};

// InlineOrnament - small decorative element for inline use
export const InlineOrnament = ({ type = 'diamond', color = COLORS.gold, size = 12 }) => {
  const ornaments = {
    diamond: <span style={{ color, fontSize: size }}>◆</span>,
    star: <span style={{ color, fontSize: size }}>✦</span>,
    dot: <span style={{ color, fontSize: size }}>•</span>,
    fleur: <span style={{ color, fontSize: size }}>❧</span>,
    leaf: <span style={{ color, fontSize: size }}>❦</span>
  };
  return ornaments[type] || ornaments.diamond;
};

// ============================================================================
// DEFAULT EXPORT
// ============================================================================
export default {
  BestiaryGlyphs,
  CornerOrnaments,
  DividerStrips,
  GuideDividerStrips,
  PAGE_ORNAMENT_CONFIG,
  GUIDE_ORNAMENT_CONFIG,
  COLORS,
  getGlyph,
  getCornerForPage,
  getDividerForPage,
  getAccentGlyph,
  getSecondaryGlyph,
  getPageOrnamentSet,
  getGuideDivider,
  getGuideOrnamentSet,
  PageCorners,
  SectionDivider,
  GlyphAccent,
  InlineOrnament
};
