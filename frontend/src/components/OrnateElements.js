import React from 'react';
import { BrandIcon } from './BrandIcon';
import {
  NOUVEAU_COLORS,
  HaloCorner,
  HaloCornerElaborate,
  LunarDivider,
  SimpleDivider,
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
// ATMOSPHERIC BACKGROUND IMAGES
// Subtle, tinted Art Nouveau imagery for depth
// ============================================================================

// Image URLs for atmospheric backgrounds (now local, optimized JPEGs)
export const ATMOSPHERIC_IMAGES = {
  florals: '/images/backgrounds/crowlands-bg-1.jpg',
  maiden: '/images/backgrounds/crowlands-bg-2.jpg',
  peonies: '/images/backgrounds/crowlands-bg-3.jpg',
};

// Reusable atmospheric background component
export const AtmosphericBackground = ({ 
  image, 
  opacity = 0.06, 
  position = 'center', 
  tint = 'teal', // 'teal', 'gold', 'sepia', 'none'
  blend = 'normal', // 'normal', 'overlay', 'multiply', 'soft-light'
  scale = 'cover' // 'cover', 'contain', '150%', etc.
}) => {
  // Color treatment filters based on tint
  const tintFilters = {
    teal: 'grayscale(100%) sepia(30%) hue-rotate(160deg) saturate(0.8)',
    gold: 'grayscale(100%) sepia(60%) saturate(1.2)',
    sepia: 'grayscale(100%) sepia(80%) saturate(0.7)',
    cream: 'grayscale(100%) sepia(40%) brightness(1.2) saturate(0.5)',
    none: 'none',
  };

  return (
    <div 
      className="absolute inset-0 z-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${image})`,
          backgroundSize: scale,
          backgroundPosition: position,
          backgroundRepeat: 'no-repeat',
          opacity: opacity,
          filter: tintFilters[tint] || tintFilters.teal,
          mixBlendMode: blend,
        }}
      />
    </div>
  );
};

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
      <HaloCornerElaborate size={size} color={color} accentColor={accentColor} position="top-left" opacity={0.25} />
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
      <HaloCorner size={size} color={color} position={position} opacity={0.25} />
    </div>
  );
};

// ============================================================================
// DIVIDERS & SECTION BREAKS - Now use lunar motifs
// ============================================================================

export const GrandDivider = ({ variant = 'default', light = false }) => {
  const color = light ? NOUVEAU_COLORS.mutedBrass : NOUVEAU_COLORS.antiqueGold;
  const opacity = light ? 0.75 : 0.6;
  
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
          <BrandIcon name="eye" size={44} opacity={opacity} />
          <StarGlyph size={16} color={color} opacity={opacity * 0.7} />
        </div>
      ) : variant === 'crow' || variant === 'ouroboros' ? (
        <div className="flex items-center gap-4">
          <SimpleDivider width={80} color={color} opacity={opacity * 0.6} />
          <BrandIcon name="ouroboros" size={44} opacity={opacity} />
          <SimpleDivider width={80} color={color} opacity={opacity * 0.6} />
        </div>
      ) : variant === 'pentagram' ? (
        <div className="flex items-center gap-4">
          <SimpleDivider width={80} color={color} opacity={opacity * 0.6} />
          <BrandIcon name="pentagram" size={44} opacity={opacity} />
          <SimpleDivider width={80} color={color} opacity={opacity * 0.6} />
        </div>
      ) : variant === 'sparkle' ? (
        <div className="flex items-center gap-3">
          <StarGlyph size={16} points={4} color={color} opacity={opacity * 0.6} />
          <BrandIcon name="sunMoon" size={40} opacity={opacity} />
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
  const opacity = light ? 0.7 : 0.5;
  
  return (
    <div className="flex items-center justify-center py-4 sm:py-5">
      {variant === 'crow' || variant === 'ouroboros' ? (
        <div className="flex items-center gap-3">
          <SimpleDivider width={60} color={color} opacity={opacity * 0.6} />
          <BrandIcon name="ouroboros" size={36} opacity={opacity} />
          <SimpleDivider width={60} color={color} opacity={opacity * 0.6} />
        </div>
      ) : variant === 'moon' ? (
        <div className="flex items-center gap-2">
          <SimpleDivider width={50} color={color} opacity={opacity * 0.6} />
          <CrescentMoon size={20} facing="left" color={color} opacity={opacity} />
          <BrandIcon name="moon" size={32} opacity={opacity} />
          <CrescentMoon size={20} facing="right" color={color} opacity={opacity} />
          <SimpleDivider width={50} color={color} opacity={opacity * 0.6} />
        </div>
      ) : variant === 'hexagram' ? (
        <div className="flex items-center gap-3">
          <SimpleDivider width={60} color={color} opacity={opacity * 0.6} />
          <BrandIcon name="hexagram" size={36} opacity={opacity} />
          <SimpleDivider width={60} color={color} opacity={opacity * 0.6} />
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
          <StarGlyph size={12} points={4} color={color} opacity={0.6} />
          <StarGlyph size={16} points={6} color={color} opacity={0.8} />
          <SunDisc size={20} color={color} opacity={0.7} />
          <StarGlyph size={16} points={6} color={color} opacity={0.8} />
          <StarGlyph size={12} points={4} color={color} opacity={0.6} />
        </div>
      ) : variant === 'moons' ? (
        <div className="flex items-center gap-2">
          <CrescentMoon size={14} facing="left" color={color} opacity={0.7} />
          <MoonDisc size={18} color={color} opacity={0.8} />
          <CrescentMoon size={14} facing="right" color={color} opacity={0.7} />
        </div>
      ) : variant === 'birds' || variant === 'ouroboros' ? (
        <div className="flex items-center gap-3">
          <BrandIcon name="ouroboros" size={24} opacity={0.6} />
          <StarGlyph size={12} color={color} opacity={0.6} />
          <BrandIcon name="ouroboros" size={24} opacity={0.6} />
        </div>
      ) : (
        <SimpleDivider width={120} color={color} opacity={0.6} />
      )}
    </div>
  );
};

// ============================================================================
// GLYPH COMPONENTS - Brand icons
// ============================================================================

export const BestiaryGlyph = ({ animal = 'crow', className = '', size = 'md', color }) => {
  const sizes = { sm: 20, md: 28, lg: 40 };
  const pixelSize = sizes[size] || sizes.md;
  const glyphColor = color || NOUVEAU_COLORS.antiqueGold;
  
  if (animal === 'crow' || animal === 'raven') {
    return <span className={className}><BrandIcon name="ouroboros" size={pixelSize} opacity={0.8} /></span>;
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

export const DarkSection = ({ 
  children, 
  className = '', 
  variant = 'default',
  atmosphericImage = null,
  atmosphericOpacity = 0.05,
  atmosphericPosition = 'center',
  atmosphericTint = 'teal'
}) => (
  <div className={`relative ${className}`} style={{ backgroundColor: NOUVEAU_COLORS.midnightTeal }}>
    <div className="relative z-10">{children}</div>
  </div>
);

export const LightSection = ({ 
  children, 
  className = '',
  atmosphericImage = null,
  atmosphericOpacity = 0.04,
  atmosphericPosition = 'center',
  atmosphericTint = 'sepia'
}) => (
  <div className={`relative ${className}`} style={{ backgroundColor: NOUVEAU_COLORS.vellum }}>
    {/* Atmospheric images removed — clean solid vellum background */}
    {/* Top accent lines */}
    <div className="absolute top-0 left-0 right-0 h-px pointer-events-none z-20" 
      style={{ background: `linear-gradient(to right, transparent, ${NOUVEAU_COLORS.roseClay}, transparent)` }} />
    <div className="absolute top-0.5 left-0 right-0 h-px pointer-events-none z-20" 
      style={{ background: `linear-gradient(to right, transparent, ${NOUVEAU_COLORS.antiqueGold}80, transparent)` }} />
    
    {/* Bottom accent lines */}
    <div className="absolute bottom-0.5 left-0 right-0 h-px pointer-events-none z-20" 
      style={{ background: `linear-gradient(to right, transparent, ${NOUVEAU_COLORS.antiqueGold}80, transparent)` }} />
    <div className="absolute bottom-0 left-0 right-0 h-px pointer-events-none z-20" 
      style={{ background: `linear-gradient(to right, transparent, ${NOUVEAU_COLORS.roseClay}, transparent)` }} />
    
    {/* Corner ornaments - structural, at edges */}
    <div className="absolute top-3 left-3 pointer-events-none z-20">
      <HaloCorner size={45} position="top-left" color={NOUVEAU_COLORS.mutedBrass} opacity={0.7} />
    </div>
    <div className="absolute top-3 right-3 pointer-events-none z-20">
      <HaloCorner size={45} position="top-right" color={NOUVEAU_COLORS.mutedBrass} opacity={0.7} />
    </div>
    <div className="absolute bottom-3 left-3 pointer-events-none z-20">
      <HaloCorner size={45} position="bottom-left" color={NOUVEAU_COLORS.mutedBrass} opacity={0.7} />
    </div>
    <div className="absolute bottom-3 right-3 pointer-events-none z-20">
      <HaloCorner size={45} position="bottom-right" color={NOUVEAU_COLORS.mutedBrass} opacity={0.7} />
    </div>
    
    <div className="relative z-10">{children}</div>
  </div>
);

// ============================================================================
// CARDS & FRAMES
// ============================================================================

export const LightOrnateCard = ({ children, className = '', hover = true }) => (
  <div 
    className={`relative p-5 sm:p-6 ${hover ? 'transition-colors duration-300 hover:shadow-lg' : ''} ${className}`}
    style={{ 
      backgroundColor: NOUVEAU_COLORS.vellum,
      border: `1px solid ${NOUVEAU_COLORS.antiqueGold}80`,
      boxShadow: '0 1px 3px rgba(12, 29, 46, 0.08), 0 4px 12px rgba(12, 29, 46, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
    }}
  >
    {/* Corner ornaments */}
    <div className="absolute top-2 left-2 pointer-events-none">
      <HaloCorner size={40} position="top-left" color={NOUVEAU_COLORS.mutedBrass} opacity={0.6} />
    </div>
    <div className="absolute top-2 right-2 pointer-events-none">
      <HaloCorner size={40} position="top-right" color={NOUVEAU_COLORS.mutedBrass} opacity={0.6} />
    </div>
    <div className="absolute bottom-2 left-2 pointer-events-none">
      <HaloCorner size={40} position="bottom-left" color={NOUVEAU_COLORS.mutedBrass} opacity={0.6} />
    </div>
    <div className="absolute bottom-2 right-2 pointer-events-none">
      <HaloCorner size={40} position="bottom-right" color={NOUVEAU_COLORS.mutedBrass} opacity={0.6} />
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
  
  const baseClasses = `w-full px-4 py-3 font-crimson text-sm transition-colors focus:outline-none ${className}`;
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
    className={`relative px-4 py-2 font-montserrat text-sm transition-colors ${
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
// ADDITIONAL COMPONENTS - Backward compatibility
// ============================================================================

// Page Header component - supports both Lucide icons and brand icons
export const PageHeader = ({ title, subtitle, icon: Icon, iconSrc, brandIcon, className = '' }) => (
  <div className={`text-center ${className}`}>
    {brandIcon ? (
      <div className="flex justify-center mb-4">
        <BrandIcon 
          name={brandIcon} 
          size={48} 
          variant="pink"
          opacity={0.9}
        />
      </div>
    ) : iconSrc ? (
      <div className="flex justify-center mb-4">
        <img src={iconSrc} alt="" className="w-12 h-12 sm:w-16 sm:h-16" />
      </div>
    ) : Icon ? (
      <Icon 
        className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4" 
        style={{ color: NOUVEAU_COLORS.emberPink, filter: `drop-shadow(0 0 12px ${NOUVEAU_COLORS.emberPink}40)` }} 
      />
    ) : null}
    <h1 
      className="phantasmagoria-hero text-2xl sm:text-3xl md:text-4xl mb-2"
      style={{ color: NOUVEAU_COLORS.antiqueGold, textShadow: `0 0 30px ${NOUVEAU_COLORS.emberPink}50, 0 0 60px ${NOUVEAU_COLORS.emberPink}30` }}
    >
      {title}
    </h1>
    {subtitle && (
      <p className="font-crimson text-sm sm:text-base italic" style={{ color: `${NOUVEAU_COLORS.vellum}aa`, textShadow: `0 0 20px ${NOUVEAU_COLORS.emberPink}30` }}>
        {subtitle}
      </p>
    )}
  </div>
);

// Page Border Frame - full page wrapper
export const PageBorderFrame = ({ children, className = '' }) => (
  <div className={`relative min-h-screen ${className}`} style={{ backgroundColor: NOUVEAU_COLORS.midnightTeal }}>
    {/* Corner ornaments */}
    <div className="absolute top-4 left-4 pointer-events-none">
      <HaloCornerElaborate size={80} position="top-left" color={NOUVEAU_COLORS.antiqueGold} opacity={0.5} />
    </div>
    <div className="absolute top-4 right-4 pointer-events-none">
      <HaloCornerElaborate size={80} position="top-right" color={NOUVEAU_COLORS.antiqueGold} opacity={0.5} />
    </div>
    <div className="absolute bottom-4 left-4 pointer-events-none">
      <HaloCornerElaborate size={80} position="bottom-left" color={NOUVEAU_COLORS.antiqueGold} opacity={0.5} />
    </div>
    <div className="absolute bottom-4 right-4 pointer-events-none">
      <HaloCornerElaborate size={80} position="bottom-right" color={NOUVEAU_COLORS.antiqueGold} opacity={0.5} />
    </div>
    <div className="relative z-10">{children}</div>
  </div>
);

// OrnateCard - dark theme card
export const OrnateCard = ({ children, className = '', hover = true, onClick, ...props }) => (
  <div 
    className={`relative p-5 sm:p-6 ${hover ? 'transition-colors duration-300 hover:shadow-lg' : ''} ${className}`}
    style={{ 
      backgroundColor: NOUVEAU_COLORS.celestialBlue,
      border: `1px solid ${NOUVEAU_COLORS.antiqueGold}40`,
    }}
    onClick={onClick}
    {...props}
  >
    <div className="absolute top-2 left-2 pointer-events-none opacity-50">
      <HaloCorner size={30} position="top-left" color={NOUVEAU_COLORS.antiqueGold} />
    </div>
    <div className="absolute top-2 right-2 pointer-events-none opacity-50">
      <HaloCorner size={30} position="top-right" color={NOUVEAU_COLORS.antiqueGold} />
    </div>
    <div className="absolute bottom-2 left-2 pointer-events-none opacity-50">
      <HaloCorner size={30} position="bottom-left" color={NOUVEAU_COLORS.antiqueGold} />
    </div>
    <div className="absolute bottom-2 right-2 pointer-events-none opacity-50">
      <HaloCorner size={30} position="bottom-right" color={NOUVEAU_COLORS.antiqueGold} />
    </div>
    <div className="relative z-10">{children}</div>
  </div>
);

// Page Divider - horizontal separator
export const PageDivider = ({ className = '' }) => (
  <div className={`flex justify-center py-4 ${className}`}>
    <LunarDivider width={250} color={NOUVEAU_COLORS.antiqueGold} opacity={0.4} />
  </div>
);

// Stepper Ornament - for multi-step flows
export const StepperOrnament = ({ currentStep, totalSteps, className = '' }) => (
  <div className={`flex items-center justify-center gap-2 ${className}`}>
    {Array.from({ length: totalSteps }).map((_, i) => (
      <div key={i} className="flex items-center gap-2">
        <div 
          className={`w-3 h-3 rounded-full border transition-colors ${
            i < currentStep ? 'border-transparent' : 'border-current'
          }`}
          style={{
            backgroundColor: i < currentStep ? NOUVEAU_COLORS.emberPink : 'transparent',
            borderColor: i < currentStep ? NOUVEAU_COLORS.emberPink : `${NOUVEAU_COLORS.antiqueGold}60`,
          }}
        />
        {i < totalSteps - 1 && (
          <div 
            className="w-8 h-px"
            style={{ backgroundColor: i < currentStep ? NOUVEAU_COLORS.emberPink : `${NOUVEAU_COLORS.antiqueGold}40` }}
          />
        )}
      </div>
    ))}
  </div>
);

// Spell Border Frame - for grimoire pages
export const SpellBorderFrame = ({ children, persona = 'default', className = '' }) => (
  <div 
    className={`relative p-6 sm:p-8 ${className}`}
    style={{ 
      backgroundColor: NOUVEAU_COLORS.vellum,
      border: `2px solid ${NOUVEAU_COLORS.antiqueGold}60`,
      boxShadow: '0 2px 8px rgba(12, 29, 46, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
    }}
  >
    <div className="absolute top-3 left-3 pointer-events-none">
      <HaloCornerElaborate size={50} position="top-left" color={NOUVEAU_COLORS.mutedBrass} opacity={0.5} />
    </div>
    <div className="absolute top-3 right-3 pointer-events-none">
      <HaloCornerElaborate size={50} position="top-right" color={NOUVEAU_COLORS.mutedBrass} opacity={0.5} />
    </div>
    <div className="absolute bottom-3 left-3 pointer-events-none">
      <HaloCornerElaborate size={50} position="bottom-left" color={NOUVEAU_COLORS.mutedBrass} opacity={0.5} />
    </div>
    <div className="absolute bottom-3 right-3 pointer-events-none">
      <HaloCornerElaborate size={50} position="bottom-right" color={NOUVEAU_COLORS.mutedBrass} opacity={0.5} />
    </div>
    <div className="relative z-10">{children}</div>
  </div>
);

// Section Border Frame - lighter weight
export const SectionBorderFrame = ({ children, className = '' }) => (
  <div 
    className={`relative p-4 sm:p-5 ${className}`}
    style={{ 
      backgroundColor: `${NOUVEAU_COLORS.antiqueGold}08`,
      borderLeft: `3px solid ${NOUVEAU_COLORS.antiqueGold}60`,
    }}
  >
    {children}
  </div>
);

// Tarot Card Frame
export const TarotCardFrame = ({ children, className = '' }) => (
  <div 
    className={`relative p-4 ${className}`}
    style={{ 
      backgroundColor: NOUVEAU_COLORS.midnightTeal,
      border: `2px solid ${NOUVEAU_COLORS.antiqueGold}70`,
      boxShadow: `0 0 20px ${NOUVEAU_COLORS.antiqueGold}20`,
    }}
  >
    <div className="absolute inset-2 pointer-events-none"
      style={{ border: `1px solid ${NOUVEAU_COLORS.antiqueGold}30` }}
    />
    <div className="relative z-10">{children}</div>
  </div>
);

// Persona border URLs - now local
export const PERSONA_BORDER_URLS = {
  cathleen: '/images/borders/cathleen-border-alt.png',
  katherine: '/images/borders/kate-border-alt.png',
  kate: '/images/borders/kate-border-alt.png',
  theresa: '/images/borders/theresa-border-alt.png',
  shigg: '/images/borders/site-corners.png',
  shiggy: '/images/borders/site-corners.png',
  brenda: '/images/borders/site-corners.png',
};

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
  SunDisc,
  MoonDisc,
  CrescentMoon,
  CelestialEye,
  StarGlyph,
} from '../assets/ornaments/artNouveau';
