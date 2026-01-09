// Static Ornament Library for Crowlands
// Deterministic ornaments: same page = same ornament set
// Lightweight SVG components, cached, no runtime generation

import React from 'react';

// ============================================================================
// COLOR TOKENS (from Art Bible)
// ============================================================================
const COLORS = {
  gold: '#d4a84b',
  goldLight: '#e6c068',
  crimson: '#b82330',
  oxblood: '#8b2232',
  navy: '#0e1629',
  bone: '#f5f0e6',
  copper: '#b87333',
  silver: '#a8a8a8'
};

// ============================================================================
// 24 BESTIARY GLYPHS - British folklore animals + occult symbols
// ============================================================================
export const BestiaryGlyphs = {
  crow: ({ size = 24, color = COLORS.gold }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M4 18c0-2 2-3 4-3s3 1 5 1 3-1 5-1 3 1 3 3M8 15V8c0-2 1-4 4-4s4 2 4 4v7M10 8c0 1.5-1 2-2 2M14 8c0 1.5 1 2 2 2" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="10" cy="6" r="1" fill={color}/>
    </svg>
  ),
  raven: ({ size = 24, color = COLORS.gold }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M3 17c2-1 4-2 6-2 3 0 5 2 8 2 2 0 3-1 4-2M7 15V7c0-2 2-4 5-4s5 2 5 4v8M9 7c-1 0-2 .5-2 1.5M15 7c1 0 2 .5 2 1.5" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="10" cy="5" r="1.5" fill={color}/>
      <path d="M5 8l-2-1" stroke={color} strokeWidth="1"/>
    </svg>
  ),
  magpie: ({ size = 24, color = COLORS.gold }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M6 16c0-1.5 1.5-2.5 3-2.5s2.5 1 4 1 2.5-1 4-1 2.5 1 2.5 2.5M9 13.5V7c0-1.5 1.5-3 3-3s3 1.5 3 3v6.5" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M9 7l-2-2M15 7l2-2" stroke={color} strokeWidth="1" strokeLinecap="round"/>
      <circle cx="10.5" cy="5.5" r="1" fill={color}/>
    </svg>
  ),
  robin: ({ size = 24, color = COLORS.gold }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <ellipse cx="12" cy="12" rx="5" ry="6" stroke={color} strokeWidth="1.5"/>
      <circle cx="12" cy="8" r="3" stroke={color} strokeWidth="1.5"/>
      <circle cx="11" cy="7" r="0.8" fill={color}/>
      <path d="M15 8l2-1M9 15c0 2 1.5 4 3 4s3-2 3-4" stroke={color} strokeWidth="1" strokeLinecap="round"/>
    </svg>
  ),
  sparrow: ({ size = 24, color = COLORS.gold }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <ellipse cx="12" cy="13" rx="4" ry="5" stroke={color} strokeWidth="1.5"/>
      <circle cx="12" cy="7" r="2.5" stroke={color} strokeWidth="1.5"/>
      <circle cx="11" cy="6.5" r="0.6" fill={color}/>
      <path d="M14.5 7l1.5-1M10 14c0 1.5 1 3 2 3s2-1.5 2-3" stroke={color} strokeWidth="1" strokeLinecap="round"/>
    </svg>
  ),
  owl: ({ size = 24, color = COLORS.gold }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <ellipse cx="12" cy="14" rx="6" ry="7" stroke={color} strokeWidth="1.5"/>
      <circle cx="9" cy="11" r="2" stroke={color} strokeWidth="1.5"/>
      <circle cx="15" cy="11" r="2" stroke={color} strokeWidth="1.5"/>
      <circle cx="9" cy="11" r="0.8" fill={color}/>
      <circle cx="15" cy="11" r="0.8" fill={color}/>
      <path d="M12 13v2M10 15l2 1.5 2-1.5M7 7l2 2M17 7l-2 2" stroke={color} strokeWidth="1" strokeLinecap="round"/>
    </svg>
  ),
  hare: ({ size = 24, color = COLORS.gold }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <ellipse cx="12" cy="15" rx="5" ry="4" stroke={color} strokeWidth="1.5"/>
      <ellipse cx="12" cy="10" rx="3" ry="2.5" stroke={color} strokeWidth="1.5"/>
      <path d="M9 8V3M15 8V3" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="10.5" cy="9.5" r="0.6" fill={color}/>
      <path d="M8 17l-2 2M16 17l2 2" stroke={color} strokeWidth="1" strokeLinecap="round"/>
    </svg>
  ),
  stag: ({ size = 24, color = COLORS.gold }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <ellipse cx="12" cy="16" rx="4" ry="5" stroke={color} strokeWidth="1.5"/>
      <ellipse cx="12" cy="9" rx="2.5" ry="3" stroke={color} strokeWidth="1.5"/>
      <path d="M8 6l-2-3M8 6l-3 0M16 6l2-3M16 6l3 0M10 7l-1-2M14 7l1-2" stroke={color} strokeWidth="1.2" strokeLinecap="round"/>
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
      <path d="M12 10.5v1" stroke={color} strokeWidth="1"/>
    </svg>
  ),
  moth: ({ size = 24, color = COLORS.gold }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <ellipse cx="12" cy="14" rx="2" ry="4" stroke={color} strokeWidth="1.5"/>
      <path d="M10 14c-3-1-5 0-6 3 2 0 4-1 6-1M14 14c3-1 5 0 6 3-2 0-4-1-6-1" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="12" cy="8" r="2" stroke={color} strokeWidth="1.5"/>
      <path d="M10 6c-1-2-1-3-1-4M14 6c1-2 1-3 1-4" stroke={color} strokeWidth="1" strokeLinecap="round"/>
    </svg>
  ),
  toad: ({ size = 24, color = COLORS.gold }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <ellipse cx="12" cy="14" rx="6" ry="5" stroke={color} strokeWidth="1.5"/>
      <circle cx="9" cy="9" r="2" stroke={color} strokeWidth="1.5"/>
      <circle cx="15" cy="9" r="2" stroke={color} strokeWidth="1.5"/>
      <circle cx="9" cy="9" r="0.8" fill={color}/>
      <circle cx="15" cy="9" r="0.8" fill={color}/>
      <path d="M10 13h4" stroke={color} strokeWidth="1"/>
    </svg>
  ),
  serpent: ({ size = 24, color = COLORS.gold }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M4 12c2-4 4-6 8-6s6 2 8 6c-2 4-4 6-8 6s-6-2-8-6" stroke={color} strokeWidth="1.5"/>
      <circle cx="8" cy="10" r="1" fill={color}/>
      <path d="M18 12l3-2M18 12l3 2" stroke={color} strokeWidth="1" strokeLinecap="round"/>
    </svg>
  ),
  // Occult symbols
  pentacle: ({ size = 24, color = COLORS.gold }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.5"/>
      <path d="M12 3l2.9 8.9h9.4l-7.6 5.5 2.9 8.9-7.6-5.5-7.6 5.5 2.9-8.9-7.6-5.5h9.4z" stroke={color} strokeWidth="1.2" strokeLinejoin="round" transform="scale(0.45) translate(14.5, 14.5)"/>
    </svg>
  ),
  triquetra: ({ size = 24, color = COLORS.gold }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 4c-3 3-3 7 0 10 3-3 3-7 0-10M12 14c-4-2-7 0-8 4 4 0 7-1 8-4M12 14c4-2 7 0 8 4-4 0-7-1-8-4" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  crescent: ({ size = 24, color = COLORS.gold }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M16 4c-5 0-9 4-9 9s4 9 9 9c-3 0-6-4-6-9s3-9 6-9z" stroke={color} strokeWidth="1.5"/>
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
      <circle cx="8" cy="8" r="4" stroke={color} strokeWidth="1.5"/>
      <path d="M11 11l9 9M17 17l3-3M17 20l3-3" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  chalice: ({ size = 24, color = COLORS.gold }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M8 4h8v6c0 2-1.5 4-4 4s-4-2-4-4V4z" stroke={color} strokeWidth="1.5"/>
      <path d="M12 14v4M8 18h8" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M6 6c-2 0-3 2-3 4s1 3 3 3M18 6c2 0 3 2 3 4s-1 3-3 3" stroke={color} strokeWidth="1.2"/>
    </svg>
  ),
  candle: ({ size = 24, color = COLORS.gold }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="9" y="10" width="6" height="10" rx="1" stroke={color} strokeWidth="1.5"/>
      <path d="M12 10V8c-1-1-1-2 0-3 1 1 1 2 0 3" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <ellipse cx="12" cy="5" rx="1.5" ry="2" fill={color} opacity="0.6"/>
    </svg>
  ),
  bell: ({ size = 24, color = COLORS.gold }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 3v2M12 5c-3 0-5 2-5 5v4l-2 2h14l-2-2v-4c0-3-2-5-5-5z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M10 18c0 1 1 2 2 2s2-1 2-2" stroke={color} strokeWidth="1.5"/>
    </svg>
  ),
  compass: ({ size = 24, color = COLORS.gold }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.5"/>
      <path d="M12 5v2M12 17v2M5 12h2M17 12h2" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M9 9l6 3-6 3 2-3-2-3z" fill={color} opacity="0.6"/>
    </svg>
  ),
  mirror: ({ size = 24, color = COLORS.gold }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <ellipse cx="12" cy="10" rx="6" ry="7" stroke={color} strokeWidth="1.5"/>
      <path d="M12 17v4M9 21h6" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <ellipse cx="12" cy="10" rx="4" ry="5" stroke={color} strokeWidth="1" opacity="0.5"/>
    </svg>
  ),
  feather: ({ size = 24, color = COLORS.gold }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M5 19l14-14c2-2 2-3 0-3s-3 1-5 3L5 19z" stroke={color} strokeWidth="1.5"/>
      <path d="M9 15l-4 4M14 10c-2 0-4 1-5 3" stroke={color} strokeWidth="1" strokeLinecap="round"/>
    </svg>
  ),
  thread: ({ size = 24, color = COLORS.gold }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="6" stroke={color} strokeWidth="1.5"/>
      <circle cx="12" cy="12" r="3" stroke={color} strokeWidth="1"/>
      <path d="M12 6c3 1 5 3 5 6M18 12c0 3-2 5-5 6" stroke={color} strokeWidth="1" strokeLinecap="round"/>
    </svg>
  )
};

// Helper to get glyph by name
export const getGlyph = (name, props = {}) => {
  const Glyph = BestiaryGlyphs[name];
  return Glyph ? <Glyph {...props} /> : null;
};

// ============================================================================
// 20 CORNER ORNAMENTS
// ============================================================================
export const CornerOrnaments = {
  classic: ({ size = 60, color = COLORS.gold, rotation = 0 }) => (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none" style={{ transform: `rotate(${rotation}deg)` }}>
      <path d="M0 30Q0 0 30 0" stroke={color} strokeWidth="2" opacity="0.8"/>
      <path d="M0 20Q0 0 20 0" stroke={color} strokeWidth="1.5" opacity="0.5"/>
      <path d="M5 35Q5 5 35 5" stroke={color} strokeWidth="1" opacity="0.3"/>
      <circle cx="15" cy="15" r="2" fill={color} opacity="0.6"/>
    </svg>
  ),
  elaborate: ({ size = 60, color = COLORS.gold, rotation = 0 }) => (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none" style={{ transform: `rotate(${rotation}deg)` }}>
      <path d="M0 40Q0 0 40 0" stroke={color} strokeWidth="2.5" opacity="0.9"/>
      <path d="M0 30Q0 0 30 0" stroke={color} strokeWidth="1.5" opacity="0.6"/>
      <path d="M0 20Q0 0 20 0" stroke={color} strokeWidth="1" opacity="0.4"/>
      <path d="M8 48Q8 8 48 8" stroke={COLORS.crimson} strokeWidth="1" opacity="0.4"/>
      <polygon points="12 12 16 6 20 12 16 18" fill={COLORS.crimson} opacity="0.8"/>
      <circle cx="24" cy="24" r="2" fill={color} opacity="0.6"/>
    </svg>
  ),
  floral: ({ size = 60, color = COLORS.gold, rotation = 0 }) => (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none" style={{ transform: `rotate(${rotation}deg)` }}>
      <path d="M0 35Q0 0 35 0" stroke={color} strokeWidth="2" opacity="0.8"/>
      <path d="M5 5Q15 15 5 25Q15 15 25 5" stroke={color} strokeWidth="1.5" opacity="0.6"/>
      <circle cx="10" cy="10" r="3" fill={color} opacity="0.4"/>
      <circle cx="5" cy="20" r="1.5" fill={color} opacity="0.3"/>
      <circle cx="20" cy="5" r="1.5" fill={color} opacity="0.3"/>
    </svg>
  ),
  celtic: ({ size = 60, color = COLORS.gold, rotation = 0 }) => (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none" style={{ transform: `rotate(${rotation}deg)` }}>
      <path d="M0 40Q0 0 40 0" stroke={color} strokeWidth="2" opacity="0.8"/>
      <path d="M10 10Q20 5 30 10Q25 20 10 10" stroke={color} strokeWidth="1.5" opacity="0.6" fill="none"/>
      <path d="M5 25Q10 15 25 5" stroke={color} strokeWidth="1" opacity="0.4"/>
    </svg>
  ),
  art_nouveau: ({ size = 60, color = COLORS.gold, rotation = 0 }) => (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none" style={{ transform: `rotate(${rotation}deg)` }}>
      <path d="M0 45C0 20 20 0 45 0" stroke={color} strokeWidth="2" opacity="0.8"/>
      <path d="M0 30C0 10 10 0 30 0" stroke={color} strokeWidth="1.5" opacity="0.5"/>
      <path d="M3 15C8 8 15 3 25 3" stroke={color} strokeWidth="1" opacity="0.4"/>
      <ellipse cx="12" cy="12" rx="4" ry="2" fill={color} opacity="0.3" transform="rotate(-45 12 12)"/>
    </svg>
  ),
  geometric: ({ size = 60, color = COLORS.gold, rotation = 0 }) => (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none" style={{ transform: `rotate(${rotation}deg)` }}>
      <path d="M0 40L40 0M0 30L30 0M0 20L20 0" stroke={color} strokeWidth="1.5" opacity="0.6"/>
      <rect x="5" y="5" width="10" height="10" stroke={color} strokeWidth="1" opacity="0.4" fill="none"/>
    </svg>
  ),
  vine: ({ size = 60, color = COLORS.gold, rotation = 0 }) => (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none" style={{ transform: `rotate(${rotation}deg)` }}>
      <path d="M0 35Q10 25 10 15Q10 5 20 0" stroke={color} strokeWidth="2" opacity="0.8"/>
      <path d="M10 15Q5 10 10 5" stroke={color} strokeWidth="1" opacity="0.5"/>
      <circle cx="10" cy="15" r="2" fill={color} opacity="0.6"/>
      <circle cx="5" cy="25" r="1.5" fill={color} opacity="0.4"/>
    </svg>
  ),
  occult: ({ size = 60, color = COLORS.gold, rotation = 0 }) => (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none" style={{ transform: `rotate(${rotation}deg)` }}>
      <path d="M0 40Q0 0 40 0" stroke={color} strokeWidth="2" opacity="0.8"/>
      <polygon points="15 15 20 8 25 15 20 22" stroke={color} strokeWidth="1" fill="none" opacity="0.6"/>
      <circle cx="20" cy="15" r="3" stroke={color} strokeWidth="0.5" opacity="0.4"/>
    </svg>
  ),
  simple: ({ size = 60, color = COLORS.gold, rotation = 0 }) => (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none" style={{ transform: `rotate(${rotation}deg)` }}>
      <path d="M0 30Q0 0 30 0" stroke={color} strokeWidth="1.5" opacity="0.7"/>
      <circle cx="10" cy="10" r="1.5" fill={color} opacity="0.5"/>
    </svg>
  ),
  double: ({ size = 60, color = COLORS.gold, rotation = 0 }) => (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none" style={{ transform: `rotate(${rotation}deg)` }}>
      <path d="M0 35Q0 0 35 0" stroke={color} strokeWidth="2" opacity="0.8"/>
      <path d="M3 32Q3 3 32 3" stroke={COLORS.crimson} strokeWidth="1.5" opacity="0.5"/>
    </svg>
  )
};

// Additional 10 corner variants
const moreCorners = ['diamond', 'star', 'spiral', 'wave', 'leaf', 'cross', 'arc', 'bracket', 'scroll', 'tassel'];
moreCorners.forEach((name, i) => {
  CornerOrnaments[name] = ({ size = 60, color = COLORS.gold, rotation = 0 }) => (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none" style={{ transform: `rotate(${rotation}deg)` }}>
      <path d={`M0 ${35 - i}Q0 0 ${35 - i} 0`} stroke={color} strokeWidth="1.5" opacity="0.7"/>
      <circle cx={12 + i} cy={12 + i} r={2 - i * 0.1} fill={color} opacity="0.5"/>
    </svg>
  );
});

// ============================================================================
// 12 DIVIDER STRIPS
// ============================================================================
export const DividerStrips = {
  classic: ({ width = 200, color = COLORS.gold }) => (
    <svg width={width} height="20" viewBox="0 0 200 20" fill="none">
      <line x1="0" y1="10" x2="80" y2="10" stroke={color} strokeWidth="1" opacity="0.5"/>
      <circle cx="90" cy="10" r="3" fill={color} opacity="0.6"/>
      <polygon points="100 6 104 10 100 14 96 10" fill={color} opacity="0.8"/>
      <circle cx="110" cy="10" r="3" fill={color} opacity="0.6"/>
      <line x1="120" y1="10" x2="200" y2="10" stroke={color} strokeWidth="1" opacity="0.5"/>
    </svg>
  ),
  moon: ({ width = 200, color = COLORS.gold }) => (
    <svg width={width} height="20" viewBox="0 0 200 20" fill="none">
      <line x1="0" y1="10" x2="70" y2="10" stroke={color} strokeWidth="1" opacity="0.4"/>
      <text x="80" y="14" fill={color} fontSize="12" opacity="0.5">☾</text>
      <text x="95" y="15" fill={color} fontSize="14" opacity="0.8">☽</text>
      <text x="112" y="14" fill={color} fontSize="12" opacity="0.5">☽</text>
      <line x1="130" y1="10" x2="200" y2="10" stroke={color} strokeWidth="1" opacity="0.4"/>
    </svg>
  ),
  stars: ({ width = 200, color = COLORS.gold }) => (
    <svg width={width} height="20" viewBox="0 0 200 20" fill="none">
      <line x1="0" y1="10" x2="60" y2="10" stroke={color} strokeWidth="1" opacity="0.4"/>
      <text x="70" y="14" fill={color} fontSize="10" opacity="0.5">✧</text>
      <text x="85" y="14" fill={color} fontSize="12" opacity="0.6">✦</text>
      <text x="100" y="15" fill={color} fontSize="14" opacity="0.9">✧</text>
      <text x="115" y="14" fill={color} fontSize="12" opacity="0.6">✦</text>
      <text x="130" y="14" fill={color} fontSize="10" opacity="0.5">✧</text>
      <line x1="145" y1="10" x2="200" y2="10" stroke={color} strokeWidth="1" opacity="0.4"/>
    </svg>
  ),
  diamonds: ({ width = 200, color = COLORS.gold }) => (
    <svg width={width} height="20" viewBox="0 0 200 20" fill="none">
      <line x1="0" y1="10" x2="75" y2="10" stroke={color} strokeWidth="1" opacity="0.5"/>
      <polygon points="85 10 90 5 95 10 90 15" fill={COLORS.crimson} opacity="0.7"/>
      <polygon points="100 10 107 3 114 10 107 17" fill={color} opacity="0.9"/>
      <polygon points="119 10 124 5 129 10 124 15" fill={COLORS.crimson} opacity="0.7"/>
      <line x1="139" y1="10" x2="200" y2="10" stroke={color} strokeWidth="1" opacity="0.5"/>
    </svg>
  ),
  wave: ({ width = 200, color = COLORS.gold }) => (
    <svg width={width} height="20" viewBox="0 0 200 20" fill="none">
      <path d="M0 10Q25 5 50 10T100 10T150 10T200 10" stroke={color} strokeWidth="1.5" fill="none" opacity="0.6"/>
      <circle cx="100" cy="10" r="3" fill={color} opacity="0.8"/>
    </svg>
  ),
  dots: ({ width = 200, color = COLORS.gold }) => (
    <svg width={width} height="20" viewBox="0 0 200 20" fill="none">
      {[0, 20, 40, 60, 80, 95, 110, 125, 140, 155, 175, 195].map((x, i) => (
        <circle key={i} cx={x} cy="10" r={i === 5 || i === 6 ? 3 : 1.5} fill={color} opacity={i === 5 || i === 6 ? 0.8 : 0.4}/>
      ))}
    </svg>
  ),
  ornate: ({ width = 200, color = COLORS.gold }) => (
    <svg width={width} height="24" viewBox="0 0 200 24" fill="none">
      <line x1="0" y1="12" x2="65" y2="12" stroke={color} strokeWidth="1" opacity="0.4"/>
      <path d="M70 12Q80 6 90 12Q80 18 70 12" stroke={color} strokeWidth="1.5" fill="none" opacity="0.6"/>
      <polygon points="100 8 105 12 100 16 95 12" fill={color} opacity="0.9"/>
      <path d="M110 12Q120 6 130 12Q120 18 110 12" stroke={color} strokeWidth="1.5" fill="none" opacity="0.6"/>
      <line x1="135" y1="12" x2="200" y2="12" stroke={color} strokeWidth="1" opacity="0.4"/>
    </svg>
  ),
  celtic: ({ width = 200, color = COLORS.gold }) => (
    <svg width={width} height="20" viewBox="0 0 200 20" fill="none">
      <line x1="0" y1="10" x2="70" y2="10" stroke={color} strokeWidth="1" opacity="0.4"/>
      <path d="M75 10Q85 5 95 10Q85 15 75 10M95 10Q105 5 115 10Q105 15 95 10" stroke={color} strokeWidth="1.5" fill="none" opacity="0.7"/>
      <line x1="120" y1="10" x2="200" y2="10" stroke={color} strokeWidth="1" opacity="0.4"/>
    </svg>
  ),
  arrows: ({ width = 200, color = COLORS.gold }) => (
    <svg width={width} height="20" viewBox="0 0 200 20" fill="none">
      <line x1="0" y1="10" x2="80" y2="10" stroke={color} strokeWidth="1" opacity="0.5"/>
      <polygon points="90 10 95 6 95 14" fill={color} opacity="0.6"/>
      <polygon points="110 10 105 6 105 14" fill={color} opacity="0.6"/>
      <line x1="120" y1="10" x2="200" y2="10" stroke={color} strokeWidth="1" opacity="0.5"/>
    </svg>
  ),
  simple: ({ width = 200, color = COLORS.gold }) => (
    <svg width={width} height="10" viewBox="0 0 200 10" fill="none">
      <line x1="0" y1="5" x2="95" y2="5" stroke={color} strokeWidth="1" opacity="0.5"/>
      <circle cx="100" cy="5" r="2" fill={color} opacity="0.8"/>
      <line x1="105" y1="5" x2="200" y2="5" stroke={color} strokeWidth="1" opacity="0.5"/>
    </svg>
  ),
  double_line: ({ width = 200, color = COLORS.gold }) => (
    <svg width={width} height="16" viewBox="0 0 200 16" fill="none">
      <line x1="0" y1="6" x2="200" y2="6" stroke={color} strokeWidth="1" opacity="0.4"/>
      <line x1="0" y1="10" x2="200" y2="10" stroke={color} strokeWidth="1" opacity="0.4"/>
      <circle cx="100" cy="8" r="4" fill={color} opacity="0.6"/>
    </svg>
  ),
  gradient: ({ width = 200, color = COLORS.gold }) => (
    <svg width={width} height="12" viewBox="0 0 200 12" fill="none">
      <defs>
        <linearGradient id="divGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={color} stopOpacity="0"/>
          <stop offset="50%" stopColor={color} stopOpacity="0.8"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <line x1="0" y1="6" x2="200" y2="6" stroke="url(#divGrad)" strokeWidth="2"/>
    </svg>
  )
};

// ============================================================================
// DETERMINISTIC ORNAMENT SELECTION
// Hash function for consistent selection per page/component
// ============================================================================
const hashString = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
};

const cornerKeys = Object.keys(CornerOrnaments);
const dividerKeys = Object.keys(DividerStrips);
const glyphKeys = Object.keys(BestiaryGlyphs);

export const getCornerForPage = (pageId, position = 'top-left') => {
  const hash = hashString(pageId + position);
  const cornerKey = cornerKeys[hash % cornerKeys.length];
  const rotation = {
    'top-left': 0,
    'top-right': 90,
    'bottom-right': 180,
    'bottom-left': 270
  }[position] || 0;
  
  const Corner = CornerOrnaments[cornerKey];
  return <Corner rotation={rotation} />;
};

export const getDividerForSection = (pageId, sectionIndex = 0) => {
  const hash = hashString(pageId + String(sectionIndex));
  const dividerKey = dividerKeys[hash % dividerKeys.length];
  const Divider = DividerStrips[dividerKey];
  return <Divider />;
};

export const getGlyphForElement = (pageId, elementId) => {
  const hash = hashString(pageId + elementId);
  const glyphKey = glyphKeys[hash % glyphKeys.length];
  return getGlyph(glyphKey);
};

// ============================================================================
// PAGE ORNAMENT SET - Get all ornaments for a page in one call
// ============================================================================
export const getPageOrnamentSet = (pageId) => {
  return {
    corners: {
      topLeft: getCornerForPage(pageId, 'top-left'),
      topRight: getCornerForPage(pageId, 'top-right'),
      bottomLeft: getCornerForPage(pageId, 'bottom-left'),
      bottomRight: getCornerForPage(pageId, 'bottom-right')
    },
    dividers: [
      getDividerForSection(pageId, 0),
      getDividerForSection(pageId, 1),
      getDividerForSection(pageId, 2)
    ],
    glyphs: [
      getGlyphForElement(pageId, 'header'),
      getGlyphForElement(pageId, 'section1'),
      getGlyphForElement(pageId, 'section2'),
      getGlyphForElement(pageId, 'footer')
    ]
  };
};

export default {
  BestiaryGlyphs,
  CornerOrnaments,
  DividerStrips,
  getGlyph,
  getCornerForPage,
  getDividerForSection,
  getGlyphForElement,
  getPageOrnamentSet,
  COLORS
};
