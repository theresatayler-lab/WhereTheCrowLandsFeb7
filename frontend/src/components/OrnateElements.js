import React from 'react';
import {
  NOUVEAU_COLORS,
  HaloCorner,
  HaloCornerElaborate,
  LunarDivider,
  SimpleDivider,
  RavenGlyph,
  SunDisc,
  MoonDisc,
  CrescentMoon,
  CelestialEye,
  StarGlyph,
} from '../assets/ornaments/artNouveau';

// ============================================================================
// CROWLANDS VISUAL SYSTEM V3.0 - ART NOUVEAU
// Luminous, celestial, occult aesthetic
// Stroke-based ornaments, structural positioning
// ============================================================================

// ============================================================================
// CORNER ORNAMENTS - Now use halo arcs
// ============================================================================

export const ElaborateCorner = ({ className, variant = 'gold' }) => {
  const color = variant === 'gold' ? NOUVEAU_COLORS.antiqueGold : NOUVEAU_COLORS.roseClay;
  const accentColor = variant === 'gold' ? NOUVEAU_COLORS.roseClay : NOUVEAU_COLORS.antiqueGold;
  
  // Extract size from className if present, default to 80
  const sizeMatch = className?.match(/w-(\d+)/);
  const size = sizeMatch ? parseInt(sizeMatch[1]) * 4 : 80;
  
  return (
    <div className={`pointer-events-none ${className}`}>
      <HaloCornerElaborate size={size} color={color} accentColor={accentColor} position="top-left" opacity={0.7} />
    </div>
  );
};

export const CornerFlourish = ({ position = 'top-left', variant = 'gold', className = '' }) => {
  const color = variant === 'gold' ? NOUVEAU_COLORS.antiqueGold : NOUVEAU_COLORS.roseClay;
  
  // Extract size from className if present
  const sizeMatch = className?.match(/w-(\d+)/);
  const size = sizeMatch ? parseInt(sizeMatch[1]) * 4 : 60;
  
  return (
    <div className={`pointer-events-none ${className}`}>
      <HaloCorner size={size} color={color} position={position} opacity={0.6} />
    </div>
  );
};

// ============================================================================
// DIVIDERS & SECTION BREAKS - Now use lunar motifs
// ============================================================================

export const GrandDivider = ({ variant = 'default', light = false }) => {
  const color = light ? NOUVEAU_COLORS.mutedBrass : NOUVEAU_COLORS.antiqueGold;
  const opacity = light ? 0.5 : 0.6;
  
  return (
    <div className="relative py-6 sm:py-8 flex justify-center">
      {variant === 'moon' ? (
        <div className="flex items-center gap-3">
          <CrescentMoon size={20} facing="left" color={color} opacity={opacity * 0.7} />
          <LunarDivider width={200} color={color} opacity={opacity} />
          <CrescentMoon size={20} facing="right" color={color} opacity={opacity * 0.7} />
        </div>
      ) : variant === 'eye' ? (
        <div className="flex items-center gap-3">
          <StarGlyph size={16} color={color} opacity={opacity * 0.7} />
          <CelestialEye size={36} color={color} accentColor={NOUVEAU_COLORS.roseClay} opacity={opacity} />
          <StarGlyph size={16} color={color} opacity={opacity * 0.7} />
        </div>
      ) : variant === 'crow' ? (
        <div className="flex items-center gap-4">
          <SimpleDivider width={80} color={color} opacity={opacity * 0.6} />
          <RavenGlyph size={36} color={color} opacity={opacity} />
          <SimpleDivider width={80} color={color} opacity={opacity * 0.6} />
        </div>
      ) : variant === 'sparkle' ? (
        <div className="flex items-center gap-3">
          <StarGlyph size={16} points={4} color={color} opacity={opacity * 0.6} />
          <SunDisc size={32} color={color} opacity={opacity} />
          <StarGlyph size={16} points={4} color={color} opacity={opacity * 0.6} />
        </div>
      ) : (
        <SimpleDivider width={200} color={color} opacity={opacity} />
      )}
    </div>
  );
};

export const MysticalDivider = ({ variant = 'default', light = false }) => {
  const color = light ? NOUVEAU_COLORS.mutedBrass : NOUVEAU_COLORS.antiqueGold;
  const opacity = light ? 0.4 : 0.5;
  
  return (
    <div className="flex items-center justify-center py-4 sm:py-5">
      {variant === 'crow' ? (
        <div className="flex items-center gap-3">
          <SimpleDivider width={60} color={color} opacity={opacity * 0.6} />
          <RavenGlyph size={28} color={color} opacity={opacity} />
          <SimpleDivider width={60} color={color} opacity={opacity * 0.6} />
        </div>
      ) : variant === 'moon' ? (
        <div className="flex items-center gap-2">
          <SimpleDivider width={50} color={color} opacity={opacity * 0.6} />
          <CrescentMoon size={20} facing="left" color={color} opacity={opacity} />
          <MoonDisc size={24} color={color} opacity={opacity} />
          <CrescentMoon size={20} facing="right" color={color} opacity={opacity} />
          <SimpleDivider width={50} color={color} opacity={opacity * 0.6} />
        </div>
      ) : (
        <SimpleDivider width={160} color={color} opacity={opacity} />
      )}
    </div>
  );
};

// Section Divider Strip
export const SectionDivider = ({ variant = 'default', className = '' }) => {
  const color = NOUVEAU_COLORS.antiqueGold;
  
  return (
    <div className={`flex items-center justify-center py-4 ${className}`}>
      {variant === 'stars' ? (
        <div className="flex items-center gap-2">
          <StarGlyph size={12} points={4} color={color} opacity={0.4} />
          <StarGlyph size={16} points={6} color={color} opacity={0.6} />
          <SunDisc size={20} color={color} opacity={0.5} />
          <StarGlyph size={16} points={6} color={color} opacity={0.6} />
          <StarGlyph size={12} points={4} color={color} opacity={0.4} />
        </div>
      ) : variant === 'moons' ? (
        <div className="flex items-center gap-2">
          <CrescentMoon size={14} facing="left" color={color} opacity={0.5} />
          <MoonDisc size={18} color={color} opacity={0.6} />
          <CrescentMoon size={14} facing="right" color={color} opacity={0.5} />
        </div>
      ) : variant === 'birds' ? (
        <div className="flex items-center gap-3">
          <RavenGlyph size={20} color={color} opacity={0.5} />
          <StarGlyph size={12} color={color} opacity={0.4} />
          <RavenGlyph size={20} color={color} opacity={0.5} />
        </div>
      ) : (
        <SimpleDivider width={120} color={color} opacity={0.4} />
      )}
    </div>
  );
};

// ============================================================================
// GLYPH COMPONENTS - SVG-based
// ============================================================================

export const BestiaryGlyph = ({ animal = 'crow', className = '', size = 'md', color }) => {
  const sizes = { sm: 20, md: 28, lg: 40 };
  const pixelSize = sizes[size] || sizes.md;
  const glyphColor = color || NOUVEAU_COLORS.antiqueGold;
  
  if (animal === 'crow' || animal === 'raven') {
    return <span className={className}><RavenGlyph size={pixelSize} color={glyphColor} /></span>;
  }
  // Fallback to emoji for other animals
  const emojiGlyphs = {
    owl: '🦉', hare: '🐇', fox: '🦊', moth: '🦋', serpent: '🐍', 
    stag: '🦌', wolf: '🐺', badger: '🦡', magpie: '🐦', robin: '🐦', 
    toad: '🐸', sparrow: '🐦'
  };
  const sizeClasses = { sm: 'text-lg', md: 'text-2xl', lg: 'text-4xl' };
  return <span className={`${sizeClasses[size]} ${className}`} style={{ color: glyphColor }}>{emojiGlyphs[animal] || '🐦‍⬛'}</span>;
};

export const OccultGlyph = ({ symbol = 'pentacle', className = '', size = 'md', color }) => {
  const sizes = { sm: 20, md: 28, lg: 40 };
  const pixelSize = sizes[size] || sizes.md;
  const glyphColor = color || NOUVEAU_COLORS.antiqueGold;
  
  if (symbol === 'sun') {
    return <span className={className}><SunDisc size={pixelSize} color={glyphColor} /></span>;
  }
  if (symbol === 'moon') {
    return <span className={className}><MoonDisc size={pixelSize} color={glyphColor} /></span>;
  }
  if (symbol === 'eye') {
    return <span className={className}><CelestialEye size={pixelSize} color={glyphColor} /></span>;
  }
  if (symbol === 'star') {
    return <span className={className}><StarGlyph size={pixelSize} color={glyphColor} /></span>;
  }
  // Fallback to emoji
  const emojiGlyphs = {
    pentacle: '⛤', key: '🗝️', chalice: '🏆', bell: '🔔', candle: '🕯️',
    crystal: '💎', compass: '🧭', mirror: '🪞', feather: '🪶', thread: '🧵'
  };
  const sizeClasses = { sm: 'text-lg', md: 'text-2xl', lg: 'text-4xl' };
  return <span className={`${sizeClasses[size]} ${className}`} style={{ color: glyphColor }}>{emojiGlyphs[symbol] || '✦'}</span>;
};

// ============================================================================
// PAGE SECTIONS - Dark & Light Wrappers
// Now use Art Nouveau palette
// ============================================================================

export const DarkSection = ({ children, className = '', variant = 'default' }) => (
  <div className={`relative ${className}`} style={{ backgroundColor: NOUVEAU_COLORS.midnightTeal }}>
    {/* Subtle texture overlay */}
    <div className="absolute inset-0 z-0 pointer-events-none" style={{
      backgroundImage: 'url(https://customer-assets.emergentagent.com/job_mystic-circle-2/artifacts/t5tfc6i3_COuld_we_creatre_more_of_these_--profile_bsfwy2d_--v_7_d08b86ee-a6ac-4cf3-a814-1344b45b3380_1.png)',
      backgroundSize: 'cover', backgroundPosition: 'center', opacity: '0.03', filter: 'hue-rotate(160deg) saturate(0.3)',
    }} />
    {/* Gradient overlay */}
    <div className="absolute inset-0 z-0 pointer-events-none" style={{
      background: variant === 'warm' 
        ? `radial-gradient(ellipse at 50% 30%, ${NOUVEAU_COLORS.emberPink}15 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, ${NOUVEAU_COLORS.antiqueGold}10 0%, transparent 40%)`
        : `radial-gradient(ellipse at 30% 50%, ${NOUVEAU_COLORS.celestialBlue}50 0%, transparent 50%), radial-gradient(ellipse at 70% 50%, ${NOUVEAU_COLORS.celestialBlue}30 0%, transparent 40%)`,
    }} />
    <div className="relative z-10">{children}</div>
  </div>
);

export const LightSection = ({ children, className = '' }) => (
  <div className={`relative ${className}`} style={{ backgroundColor: NOUVEAU_COLORS.vellum }}>
    {/* Top accent lines */}
    <div className="absolute top-0 left-0 right-0 h-px pointer-events-none" 
      style={{ background: `linear-gradient(to right, transparent, ${NOUVEAU_COLORS.roseClay}, transparent)` }} />
    <div className="absolute top-0.5 left-0 right-0 h-px pointer-events-none" 
      style={{ background: `linear-gradient(to right, transparent, ${NOUVEAU_COLORS.antiqueGold}80, transparent)` }} />
    
    {/* Bottom accent lines */}
    <div className="absolute bottom-0.5 left-0 right-0 h-px pointer-events-none" 
      style={{ background: `linear-gradient(to right, transparent, ${NOUVEAU_COLORS.antiqueGold}80, transparent)` }} />
    <div className="absolute bottom-0 left-0 right-0 h-px pointer-events-none" 
      style={{ background: `linear-gradient(to right, transparent, ${NOUVEAU_COLORS.roseClay}, transparent)` }} />
    
    {/* Corner ornaments - structural, at edges */}
    <div className="absolute top-3 left-3 pointer-events-none">
      <HaloCorner size={45} position="top-left" color={NOUVEAU_COLORS.mutedBrass} opacity={0.5} />
    </div>
    <div className="absolute top-3 right-3 pointer-events-none">
      <HaloCorner size={45} position="top-right" color={NOUVEAU_COLORS.mutedBrass} opacity={0.5} />
    </div>
    <div className="absolute bottom-3 left-3 pointer-events-none">
      <HaloCorner size={45} position="bottom-left" color={NOUVEAU_COLORS.mutedBrass} opacity={0.5} />
    </div>
    <div className="absolute bottom-3 right-3 pointer-events-none">
      <HaloCorner size={45} position="bottom-right" color={NOUVEAU_COLORS.mutedBrass} opacity={0.5} />
    </div>
    
    <div className="relative z-10">{children}</div>
  </div>
);

// ============================================================================
// CARDS & FRAMES
// ============================================================================

export const LightOrnateCard = ({ children, className = '', hover = true }) => (
  <div 
    className={`relative p-5 sm:p-6 ${hover ? 'transition-all duration-300 hover:shadow-lg' : ''} ${className}`}
    style={{ 
      backgroundColor: NOUVEAU_COLORS.vellum,
      border: `1px solid ${NOUVEAU_COLORS.antiqueGold}50`,
      boxShadow: '0 1px 3px rgba(14, 42, 47, 0.08), 0 4px 12px rgba(14, 42, 47, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
    }}
  >
    {/* Corner ornaments */}
    <div className="absolute top-2 left-2 pointer-events-none">
      <HaloCorner size={40} position="top-left" color={NOUVEAU_COLORS.mutedBrass} opacity={0.4} />
    </div>
    <div className="absolute top-2 right-2 pointer-events-none">
      <HaloCorner size={40} position="top-right" color={NOUVEAU_COLORS.mutedBrass} opacity={0.4} />
    </div>
    <div className="absolute bottom-2 left-2 pointer-events-none">
      <HaloCorner size={40} position="bottom-left" color={NOUVEAU_COLORS.mutedBrass} opacity={0.4} />
    </div>
    <div className="absolute bottom-2 right-2 pointer-events-none">
      <HaloCorner size={40} position="bottom-right" color={NOUVEAU_COLORS.mutedBrass} opacity={0.4} />
    </div>
    
    <div className="relative z-10">{children}</div>
  </div>
);

export const BorderFrame = ({ children, variant = 'gold', className = '' }) => {
  const borderColor = variant === 'gold' ? NOUVEAU_COLORS.antiqueGold : NOUVEAU_COLORS.roseClay;
  const bgColor = variant === 'gold' ? `${NOUVEAU_COLORS.antiqueGold}10` : `${NOUVEAU_COLORS.roseClay}10`;
  
  return (
    <div 
      className={`p-4 ${className}`}
      style={{ 
        backgroundColor: bgColor,
        borderLeft: `3px solid ${borderColor}`,
      }}
    >
      {children}
    </div>
  );
};

// ============================================================================
// FORM ELEMENTS - Styled for Art Nouveau palette
// ============================================================================

export const CrowlandsInput = ({ value, onChange, placeholder, type = 'text', rows, className = '' }) => {
  const baseStyles = {
    backgroundColor: 'white',
    border: `1px solid ${NOUVEAU_COLORS.mutedBrass}50`,
    color: NOUVEAU_COLORS.midnightTeal,
    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.03)',
  };
  
  const baseClasses = `w-full px-4 py-3 font-crimson text-sm transition-all focus:outline-none ${className}`;
  const focusStyles = `focus:border-[${NOUVEAU_COLORS.emberPink}] focus:ring-2 focus:ring-[${NOUVEAU_COLORS.emberPink}20]`;
  
  if (rows) {
    return (
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className={`${baseClasses} resize-none`}
        style={baseStyles}
      />
    );
  }
  
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={baseClasses}
      style={baseStyles}
    />
  );
};

export const CrowlandsChip = ({ label, selected, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`relative px-4 py-2 font-montserrat text-sm transition-all ${
      selected ? 'shadow-sm' : ''
    }`}
    style={{
      backgroundColor: selected ? `${NOUVEAU_COLORS.emberPink}15` : 'white',
      border: `1px solid ${selected ? NOUVEAU_COLORS.emberPink : NOUVEAU_COLORS.mutedBrass}60`,
      color: selected ? NOUVEAU_COLORS.emberPink : NOUVEAU_COLORS.midnightTeal,
    }}
  >
    {label}
    {selected && (
      <span className="absolute -top-1 -right-1 text-xs" style={{ color: NOUVEAU_COLORS.emberPink }}>◆</span>
    )}
  </button>
);

export const SectionLabel = ({ title, context }) => (
  <div className="mb-2">
    <h3 className="font-cinzel text-sm tracking-wide" style={{ color: NOUVEAU_COLORS.emberPink }}>
      {title}
    </h3>
    {context && (
      <p className="text-xs font-crimson italic mt-0.5" style={{ color: `${NOUVEAU_COLORS.midnightTeal}99` }}>
        {context}
      </p>
    )}
  </div>
);

// ============================================================================
// LEGACY EXPORTS - Maintain backward compatibility
// ============================================================================

export { NOUVEAU_COLORS };

// Re-export SVG components for direct use
export {
  HaloCorner,
  HaloCornerElaborate,
  LunarDivider,
  SimpleDivider,
  RavenGlyph,
  SunDisc,
  MoonDisc,
  CrescentMoon,
  CelestialEye,
  StarGlyph,
} from '../assets/ornaments/artNouveau';
