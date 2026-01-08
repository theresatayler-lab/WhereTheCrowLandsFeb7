import React from 'react';

// ============================================================================
// CROWLANDS VISUAL SYSTEM V1.1 - REUSABLE COMPONENTS
// Make every page feel like a collectible grimoire
// ============================================================================

// Color tokens from Art Bible
const COLORS = {
  navy: '#0e1629',
  oxblood: '#8b2232',
  gold: '#d4a84b',
  bone: '#f5f0e6',
  crimson: '#b82330',
  copper: '#b87333'
};

// ============================================================================
// CORNER ORNAMENTS
// ============================================================================

export const ElaborateCorner = ({ className, variant = 'gold' }) => {
  const colors = variant === 'gold' 
    ? { primary: '#d4a84b', secondary: '#b82330', tertiary: '#e6c068' }
    : { primary: '#b82330', secondary: '#d4a84b', tertiary: '#d42a3a' };
  
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none">
      <path d="M0,60 Q0,0 60,0" stroke={colors.primary} strokeWidth="2.5" opacity="0.9" />
      <path d="M0,48 Q0,0 48,0" stroke={colors.primary} strokeWidth="1.5" opacity="0.6" />
      <path d="M0,36 Q0,0 36,0" stroke={colors.tertiary} strokeWidth="1" opacity="0.4" />
      <path d="M12,72 Q12,12 72,12" stroke={colors.secondary} strokeWidth="1" opacity="0.4" />
      <polygon points="18,18 24,10 30,18 24,26" fill={colors.secondary} opacity="0.95" />
      <polygon points="10,10 14,5 18,10 14,15" fill={colors.primary} opacity="0.7" />
      <circle cx="36" cy="36" r="2.5" fill={colors.primary} opacity="0.6" />
      <circle cx="10" cy="30" r="1.5" fill={colors.secondary} opacity="0.5" />
      <circle cx="30" cy="10" r="1.5" fill={colors.secondary} opacity="0.5" />
    </svg>
  );
};

export const CornerFlourish = ({ position = 'top-left', variant = 'gold', className = '' }) => {
  const colors = variant === 'gold' 
    ? { primary: '#d4a84b', secondary: '#b82330' }
    : { primary: '#b82330', secondary: '#d4a84b' };
  
  const rotations = {
    'top-left': '',
    'top-right': 'rotate-90',
    'bottom-left': '-rotate-90',
    'bottom-right': 'rotate-180'
  };
  
  return (
    <svg viewBox="0 0 80 80" className={`${rotations[position]} ${className}`} fill="none">
      <path d="M0,40 Q0,0 40,0" stroke={colors.primary} strokeWidth="2" opacity="0.8" />
      <path d="M0,28 Q0,0 28,0" stroke={colors.primary} strokeWidth="1.5" opacity="0.5" />
      <path d="M8,48 Q8,8 48,8" stroke={colors.secondary} strokeWidth="1" opacity="0.4" />
      <circle cx="20" cy="20" r="3" fill={colors.primary} opacity="0.7" />
      <circle cx="8" cy="8" r="2" fill={colors.secondary} opacity="0.6" />
      <path d="M12,12 L18,6 L24,12 L18,18 Z" fill={colors.secondary} opacity="0.5" />
    </svg>
  );
};

// ============================================================================
// DIVIDERS & SECTION BREAKS
// ============================================================================

export const GrandDivider = ({ variant = 'default', light = false }) => {
  const lineColor = light ? 'from-navy-dark/30 via-crimson/50 to-navy-dark/30' : 'from-transparent via-gold/80 to-transparent';
  const accentColor = light ? 'text-crimson' : 'text-crimson-bright';
  const symbolColor = light ? 'text-navy-dark' : 'text-gold';
  
  return (
    <div className="relative py-6 sm:py-8">
      <div className="flex items-center justify-center gap-3 sm:gap-6">
        <span className={`${accentColor} text-sm sm:text-base opacity-60`}>✧</span>
        <div className={`h-0.5 w-12 sm:w-24 bg-gradient-to-r ${lineColor}`} />
        <span className={`${accentColor} text-lg sm:text-xl glow-crimson`}>◆</span>
        
        <div className={`${symbolColor} flex items-center gap-2`}>
          {variant === 'moon' ? (
            <>
              <span className="text-lg sm:text-xl opacity-50">☾</span>
              <span className={`text-2xl sm:text-3xl ${light ? '' : 'glow-gold'}`}>☽</span>
              <span className="text-lg sm:text-xl opacity-50">☽</span>
            </>
          ) : variant === 'eye' ? (
            <>
              <span className="text-base sm:text-lg opacity-50">✦</span>
              <span className={`text-2xl sm:text-3xl ${light ? '' : 'glow-gold'}`}>👁</span>
              <span className="text-base sm:text-lg opacity-50">✦</span>
            </>
          ) : variant === 'crow' ? (
            <span className="text-2xl sm:text-3xl">🐦‍⬛</span>
          ) : variant === 'sparkle' ? (
            <>
              <span className="text-base sm:text-lg opacity-50">✦</span>
              <span className={`text-2xl sm:text-3xl ${light ? '' : 'glow-gold'}`}>✨</span>
              <span className="text-base sm:text-lg opacity-50">✦</span>
            </>
          ) : (
            <>
              <span className="text-base sm:text-lg opacity-60">❦</span>
              <span className={`text-xl sm:text-2xl ${light ? '' : 'glow-gold'}`}>❧</span>
              <span className="text-base sm:text-lg opacity-60">❦</span>
            </>
          )}
        </div>
        
        <span className={`${accentColor} text-lg sm:text-xl glow-crimson`}>◆</span>
        <div className={`h-0.5 w-12 sm:w-24 bg-gradient-to-l ${lineColor}`} />
        <span className={`${accentColor} text-sm sm:text-base opacity-60`}>✧</span>
      </div>
    </div>
  );
};

export const MysticalDivider = ({ variant = 'default', light = false }) => {
  const lineColor = light ? 'via-crimson/40' : 'via-gold/60';
  const accentColor = light ? 'text-crimson' : 'text-crimson-bright';
  const symbolColor = light ? 'text-navy-dark' : 'text-gold';
  
  return (
    <div className="flex items-center justify-center gap-4 py-4 sm:py-6">
      <div className={`h-0.5 bg-gradient-to-r from-transparent ${lineColor} to-transparent flex-1 max-w-24 sm:max-w-32`} />
      <div className={`flex items-center gap-2 ${symbolColor}`}>
        {variant === 'crow' ? (
          <span className="text-xl sm:text-2xl">🐦‍⬛</span>
        ) : variant === 'moon' ? (
          <>
            <span className={`text-sm sm:text-base ${accentColor}`}>◆</span>
            <span className={`text-lg sm:text-xl ${light ? '' : 'glow-gold'}`}>☽</span>
            <span className={`text-sm sm:text-base ${accentColor}`}>◆</span>
          </>
        ) : (
          <>
            <span className={`text-xs sm:text-sm ${accentColor}`}>◆</span>
            <span className={`text-base sm:text-lg ${light ? '' : 'glow-gold'}`}>❧</span>
            <span className={`text-xs sm:text-sm ${accentColor}`}>◆</span>
          </>
        )}
      </div>
      <div className={`h-0.5 bg-gradient-to-l from-transparent ${lineColor} to-transparent flex-1 max-w-24 sm:max-w-32`} />
    </div>
  );
};

// Section Divider Strip - for page sections
export const SectionDivider = ({ variant = 'default', className = '' }) => {
  const patterns = {
    default: '❧ ◆ ❧',
    stars: '✦ ✧ ⭐ ✧ ✦',
    moons: '☾ ✦ ☽ ✦ ☾',
    celtic: '☘️ ◆ ☘️',
    eyes: '✦ 👁 ✦',
    feathers: '🪶 ◆ 🪶',
    birds: '🐦‍⬛ ✦ 🐦‍⬛'
  };
  
  return (
    <div className={`flex items-center justify-center gap-2 py-4 ${className}`}>
      <div className="h-px flex-1 max-w-20 bg-gradient-to-r from-transparent to-gold/40" />
      <span className="text-gold/60 text-sm tracking-widest">{patterns[variant]}</span>
      <div className="h-px flex-1 max-w-20 bg-gradient-to-l from-transparent to-gold/40" />
    </div>
  );
};

// ============================================================================
// STATIC ORNAMENT LIBRARY - Bestiary & Occult Glyphs
// ============================================================================

export const BestiaryGlyph = ({ animal = 'raven', className = '', size = 'md' }) => {
  const sizes = { sm: 'text-lg', md: 'text-2xl', lg: 'text-4xl' };
  const glyphs = {
    raven: '🐦‍⬛', crow: '🐦‍⬛', owl: '🦉', hare: '🐇', fox: '🦊',
    moth: '🦋', serpent: '🐍', stag: '🦌', wolf: '🐺', badger: '🦡',
    magpie: '🐦', robin: '🐦', toad: '🐸', sparrow: '🐦'
  };
  return <span className={`${sizes[size]} ${className}`}>{glyphs[animal] || glyphs.raven}</span>;
};

export const OccultGlyph = ({ symbol = 'pentacle', className = '', size = 'md' }) => {
  const sizes = { sm: 'text-lg', md: 'text-2xl', lg: 'text-4xl' };
  const glyphs = {
    pentacle: '⛤', moon: '☽', sun: '☀', star: '✦', eye: '👁',
    key: '🗝️', chalice: '🏆', bell: '🔔', candle: '🕯️', crystal: '💎',
    ouroboros: '🐍', compass: '🧭', mirror: '🪞', feather: '🪶',
    needle: '🪡', thread: '🧵', seal: '🔏', scroll: '📜'
  };
  return <span className={`${sizes[size]} ${className}`}>{glyphs[symbol] || glyphs.pentacle}</span>;
};

// ============================================================================
// PAGE SECTIONS - Dark & Light Wrappers
// ============================================================================

export const DarkSection = ({ children, className = '', variant = 'default' }) => (
  <div className={`relative bg-navy-dark ${className}`}>
    <div className="absolute inset-0 z-0" style={{
      backgroundImage: 'url(https://customer-assets.emergentagent.com/job_mystic-circle-2/artifacts/t5tfc6i3_COuld_we_creatre_more_of_these_--profile_bsfwy2d_--v_7_d08b86ee-a6ac-4cf3-a814-1344b45b3380_1.png)',
      backgroundSize: 'cover', backgroundPosition: 'center', opacity: '0.05', filter: 'hue-rotate(200deg) saturate(0.5)',
    }} />
    <div className="absolute inset-0 z-0" style={{
      background: variant === 'warm' 
        ? 'radial-gradient(ellipse at 50% 30%, rgba(184, 35, 48, 0.1) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(212, 168, 75, 0.08) 0%, transparent 40%)'
        : 'radial-gradient(ellipse at 30% 50%, rgba(26, 45, 77, 0.3) 0%, transparent 50%), radial-gradient(ellipse at 70% 50%, rgba(42, 65, 99, 0.2) 0%, transparent 40%)',
    }} />
    <div className="relative z-10">{children}</div>
  </div>
);

export const LightSection = ({ children, className = '' }) => (
  <div className={`relative ${className}`} style={{ background: 'linear-gradient(135deg, #f5f0e6 0%, #e8e0d0 50%, #f5f0e6 100%)' }}>
    <div className="absolute inset-0 opacity-[0.02]" style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 30L45 15M30 30L15 45M30 30L45 45M30 30L15 15' stroke='%230e1629' stroke-width='0.5' fill='none'/%3E%3C/svg%3E")`,
    }} />
    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-crimson to-transparent" />
    <div className="absolute top-1 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
    <div className="absolute bottom-0.5 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-crimson to-transparent" />
    <ElaborateCorner className="absolute top-2 left-2 w-12 h-12 sm:w-16 sm:h-16" variant="crimson" />
    <ElaborateCorner className="absolute top-2 right-2 w-12 h-12 sm:w-16 sm:h-16 rotate-90" variant="crimson" />
    <ElaborateCorner className="absolute bottom-2 left-2 w-12 h-12 sm:w-16 sm:h-16 -rotate-90" variant="crimson" />
    <ElaborateCorner className="absolute bottom-2 right-2 w-12 h-12 sm:w-16 sm:h-16 rotate-180" variant="crimson" />
    <div className="relative z-10">{children}</div>
  </div>
);

// ============================================================================
// V1.1 STANDARD COMPONENTS - PageHero, ParchmentPanel, OrnateCard
// ============================================================================

// PageHero - Dark navy hero section with subtle map texture
export const PageHero = ({ 
  icon: Icon, 
  title, 
  subtitle, 
  children,
  showCorners = true,
  dividerVariant = 'default'
}) => (
  <DarkSection className="py-12 sm:py-16 md:py-20 px-4 sm:px-6" variant="warm">
    {showCorners && (
      <>
        <CornerFlourish position="top-left" className="absolute top-3 left-3 w-14 h-14 sm:w-18 sm:h-18" />
        <CornerFlourish position="top-right" className="absolute top-3 right-3 w-14 h-14 sm:w-18 sm:h-18" />
      </>
    )}
    
    <div className="max-w-4xl mx-auto relative z-10">
      <div className="text-center">
        {Icon && (
          <Icon className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-auto mb-4 text-crimson-bright"
            style={{ filter: 'drop-shadow(0 0 15px rgba(184, 35, 48, 0.5))' }} />
        )}
        <h1 className="font-italiana text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-gold-light mb-3"
          style={{ textShadow: '0 2px 30px rgba(212, 168, 75, 0.5)' }}>
          {title}
        </h1>
        {subtitle && (
          <p className="font-montserrat text-sm sm:text-base text-silver-mist/80 max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
      </div>
      {dividerVariant && <GrandDivider variant={dividerVariant} />}
      {children}
    </div>
  </DarkSection>
);

// ParchmentPanel - Bone/ivory content card with soft shadow and gold keyline
export const ParchmentPanel = ({ children, className = '', showDivider = true }) => (
  <LightSection className={`py-10 sm:py-14 px-4 sm:px-6 ${className}`}>
    <div className="max-w-5xl mx-auto">
      {showDivider && <MysticalDivider light />}
      {children}
    </div>
  </LightSection>
);

// OrnateCard - For grids (My Grimoire, Archives) - gold keyline + corner ornaments
export const OrnateCard = ({ children, className = '', hover = true }) => (
  <div className={`relative ${hover ? 'group' : ''} ${className}`}>
    <div className="absolute inset-0 border-2 border-gold/40 rounded-lg group-hover:border-gold/60 transition-all duration-300" />
    <div className="absolute inset-1.5 border border-crimson/20 rounded-md group-hover:border-crimson/40 transition-all duration-300" />
    <div className="absolute inset-0 bg-navy-mid/60 rounded-lg backdrop-blur-sm" />
    <span className="absolute -top-1.5 -left-1.5 text-crimson text-sm opacity-60 group-hover:opacity-100 transition-opacity">◆</span>
    <span className="absolute -top-1.5 -right-1.5 text-crimson text-sm opacity-60 group-hover:opacity-100 transition-opacity">◆</span>
    <span className="absolute -bottom-1.5 -left-1.5 text-crimson text-sm opacity-60 group-hover:opacity-100 transition-opacity">◆</span>
    <span className="absolute -bottom-1.5 -right-1.5 text-crimson text-sm opacity-60 group-hover:opacity-100 transition-opacity">◆</span>
    <div className="relative z-10 p-4 sm:p-6">{children}</div>
  </div>
);

// LightOrnateCard - For parchment sections
export const LightOrnateCard = ({ children, className = '', hover = true }) => (
  <div className={`relative ${hover ? 'group' : ''} ${className}`}>
    <div className="absolute inset-0 border-2 border-crimson/30 rounded-lg group-hover:border-crimson/50 transition-all duration-300" />
    <div className="absolute inset-1.5 border border-gold/30 rounded-md group-hover:border-gold/50 transition-all duration-300" />
    <div className="absolute inset-0 bg-cream/80 rounded-lg backdrop-blur-sm" />
    <span className="absolute -top-1.5 -left-1.5 text-gold-dark text-sm opacity-60 group-hover:opacity-100 transition-opacity">◆</span>
    <span className="absolute -top-1.5 -right-1.5 text-gold-dark text-sm opacity-60 group-hover:opacity-100 transition-opacity">◆</span>
    <span className="absolute -bottom-1.5 -left-1.5 text-gold-dark text-sm opacity-60 group-hover:opacity-100 transition-opacity">◆</span>
    <span className="absolute -bottom-1.5 -right-1.5 text-gold-dark text-sm opacity-60 group-hover:opacity-100 transition-opacity">◆</span>
    <div className="relative z-10 p-4 sm:p-6">{children}</div>
  </div>
);

// ============================================================================
// HEADERS & TEXT ELEMENTS
// ============================================================================

export const PageHeader = ({ icon: Icon, title, subtitle, light = false }) => (
  <div className={`text-center mb-6 sm:mb-8 ${light ? 'text-navy-dark' : ''}`}>
    {Icon && <Icon className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 mx-auto mb-3 sm:mb-4 ${light ? 'text-crimson' : 'text-crimson-bright'}`} 
      style={{ filter: light ? 'none' : 'drop-shadow(0 0 10px rgba(184, 35, 48, 0.4))' }} />}
    <h1 className={`font-italiana text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-2 sm:mb-3 ${light ? 'text-crimson' : 'text-gold-light'}`}
      style={{ textShadow: light ? '0 2px 10px rgba(184, 35, 48, 0.2)' : '0 2px 30px rgba(212, 168, 75, 0.5)' }}>
      {title}
    </h1>
    {subtitle && (
      <p className={`font-montserrat text-xs sm:text-sm md:text-base max-w-2xl mx-auto px-2 ${light ? 'text-navy-dark/70' : 'text-silver-mist/80'}`}>
        {subtitle}
      </p>
    )}
  </div>
);

export const SectionHeader = ({ title, subtitle, light = false, variant = 'default', glyph }) => (
  <div className={`text-center mb-8 ${light ? 'text-navy-dark' : ''}`}>
    <SectionDivider variant={variant} className="mb-4" />
    <div className="flex items-center justify-center gap-3 mb-2">
      {glyph && <OccultGlyph symbol={glyph} size="sm" className={light ? 'text-crimson' : 'text-gold'} />}
      <h2 className={`font-italiana text-2xl sm:text-3xl ${light ? 'text-crimson' : 'text-gold-light'}`}>
        {title}
      </h2>
      {glyph && <OccultGlyph symbol={glyph} size="sm" className={light ? 'text-crimson' : 'text-gold'} />}
    </div>
    {subtitle && (
      <p className={`font-montserrat text-sm ${light ? 'text-navy-dark/70' : 'text-silver-mist/70'}`}>
        {subtitle}
      </p>
    )}
  </div>
);

// Inline ornament for text
export const InlineOrnament = ({ type = 'diamond' }) => {
  const ornaments = { diamond: '◆', star: '✦', dot: '•', fleur: '❧', leaf: '❦' };
  return <span className="text-gold/60 mx-2">{ornaments[type]}</span>;
};

// ============================================================================
// BORDER FRAMES - For special content blocks
// ============================================================================

export const BorderFrame = ({ children, variant = 'gold', className = '' }) => {
  const borderColors = {
    gold: 'border-gold/50',
    crimson: 'border-crimson/50',
    silver: 'border-silver-mist/50'
  };
  
  return (
    <div className={`relative ${className}`}>
      <div className={`absolute inset-0 border-2 ${borderColors[variant]} rounded-sm`} />
      <div className="absolute inset-2 border border-gold/20 rounded-sm" />
      {/* Corner ornaments */}
      <span className="absolute -top-2 -left-2 text-gold text-lg">✦</span>
      <span className="absolute -top-2 -right-2 text-gold text-lg">✦</span>
      <span className="absolute -bottom-2 -left-2 text-gold text-lg">✦</span>
      <span className="absolute -bottom-2 -right-2 text-gold text-lg">✦</span>
      <div className="relative z-10 p-6">{children}</div>
    </div>
  );
};

// Persona-specific border frames using uploaded assets
export const PERSONA_BORDER_URLS = {
  site: 'https://customer-assets.emergentagent.com/job_mystic-grimoire-1/artifacts/jcxzlb20_SiteOverallCorners%20and%20any%20borders.png',
  shigg: 'https://customer-assets.emergentagent.com/job_mystic-grimoire-1/artifacts/jcxzlb20_SiteOverallCorners%20and%20any%20borders.png', // Shigg uses site border (crow/Celtic)
  cathleen: 'https://customer-assets.emergentagent.com/job_mystic-grimoire-1/artifacts/12ds6wfx_CathleenBorder.png',
  katherine: 'https://customer-assets.emergentagent.com/job_mystic-grimoire-1/artifacts/85szfipf_KateBorder.png',
  theresa: 'https://customer-assets.emergentagent.com/job_mystic-grimoire-1/artifacts/8jgu6o97_TheresaBorder.png'
};

export const PersonaBorderFrame = ({ persona = 'site', children, className = '' }) => {
  const borderUrl = PERSONA_BORDER_URLS[persona] || PERSONA_BORDER_URLS.site;
  
  return (
    <div className={`relative ${className}`}>
      {/* Border image overlay */}
      <div 
        className="absolute inset-0 pointer-events-none z-20"
        style={{
          backgroundImage: `url(${borderUrl})`,
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          mixBlendMode: 'multiply'
        }}
      />
      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

// Tarot Card Frame with persona border
export const TarotCardFrame = ({ imageUrl, persona = 'site', title, className = '' }) => {
  const borderUrl = PERSONA_BORDER_URLS[persona] || PERSONA_BORDER_URLS.site;
  
  return (
    <div className={`relative aspect-[2/3] ${className}`}>
      {/* Background image */}
      {imageUrl && (
        <img 
          src={imageUrl} 
          alt={title || 'Tarot card'} 
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      {/* Border overlay */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url(${borderUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          mixBlendMode: 'screen'
        }}
      />
      {/* Title */}
      {title && (
        <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-navy-dark/90 to-transparent">
          <p className="font-cinzel text-sm text-gold text-center">{title}</p>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// SPELL PAGE SPECIFIC COMPONENTS
// ============================================================================

export const SpellSectionHeader = ({ title, glyph, light = false }) => (
  <div className={`flex items-center gap-2 mb-3 ${light ? 'text-navy-dark' : 'text-gold'}`}>
    {glyph && <OccultGlyph symbol={glyph} size="sm" />}
    <h3 className={`font-cinzel text-lg ${light ? 'text-crimson' : 'text-gold-light'}`}>{title}</h3>
    <div className={`flex-1 h-px ${light ? 'bg-crimson/30' : 'bg-gold/30'}`} />
  </div>
);

export const PrintablesBlock = ({ tarotUrl, sigilUrl }) => (
  <div className="bg-navy-mid/40 border border-gold/30 rounded-sm p-4">
    <div className="text-center mb-3">
      <span className="font-cinzel text-sm text-gold/80 uppercase tracking-wider">Printables</span>
    </div>
    <div className="flex gap-4 justify-center">
      {tarotUrl && (
        <div className="text-center">
          <img src={tarotUrl} alt="Tarot" className="w-24 h-32 object-cover border border-gold/40 rounded-sm" />
          <span className="text-xs text-silver-mist/60 mt-1 block">Tarot Card</span>
        </div>
      )}
      {sigilUrl && (
        <div className="text-center">
          <img src={sigilUrl} alt="Sigil" className="w-24 h-24 object-cover border border-gold/40 rounded-sm" />
          <span className="text-xs text-silver-mist/60 mt-1 block">Sigil</span>
        </div>
      )}
    </div>
  </div>
);

// ============================================================================
// PAGE-LEVEL BORDER FRAME - Site-wide crow border for major containers
// ============================================================================

export const PageBorderFrame = ({ children, className = '', variant = 'dark' }) => {
  const borderUrl = PERSONA_BORDER_URLS.site;
  
  return (
    <div className={`relative ${className}`}>
      {/* Corner ornaments */}
      <div className="absolute top-0 left-0 w-20 h-20 sm:w-28 sm:h-28 pointer-events-none z-30 opacity-80"
        style={{
          backgroundImage: `url(${borderUrl})`,
          backgroundSize: '400%',
          backgroundPosition: 'top left',
        }}
      />
      <div className="absolute top-0 right-0 w-20 h-20 sm:w-28 sm:h-28 pointer-events-none z-30 opacity-80"
        style={{
          backgroundImage: `url(${borderUrl})`,
          backgroundSize: '400%',
          backgroundPosition: 'top right',
        }}
      />
      <div className="absolute bottom-0 left-0 w-20 h-20 sm:w-28 sm:h-28 pointer-events-none z-30 opacity-80"
        style={{
          backgroundImage: `url(${borderUrl})`,
          backgroundSize: '400%',
          backgroundPosition: 'bottom left',
        }}
      />
      <div className="absolute bottom-0 right-0 w-20 h-20 sm:w-28 sm:h-28 pointer-events-none z-30 opacity-80"
        style={{
          backgroundImage: `url(${borderUrl})`,
          backgroundSize: '400%',
          backgroundPosition: 'bottom right',
        }}
      />
      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

// ============================================================================
// SECTION BORDER FRAME - Gold keyline for content sections
// ============================================================================

export const SectionBorderFrame = ({ children, className = '', variant = 'gold' }) => {
  const colors = {
    gold: { border: 'border-gold/40', corner: 'text-gold/60', hover: 'group-hover:border-gold/60' },
    crimson: { border: 'border-crimson/40', corner: 'text-crimson/60', hover: 'group-hover:border-crimson/60' },
    silver: { border: 'border-silver-mist/40', corner: 'text-silver-mist/60', hover: 'group-hover:border-silver-mist/60' }
  };
  const style = colors[variant] || colors.gold;
  
  return (
    <div className={`relative group ${className}`}>
      {/* Outer border */}
      <div className={`absolute inset-0 border ${style.border} rounded-sm ${style.hover} transition-all duration-300`} />
      {/* Inner keyline */}
      <div className="absolute inset-1.5 border border-gold/20 rounded-sm" />
      {/* Corner diamonds */}
      <span className={`absolute -top-1 -left-1 ${style.corner} text-xs`}>◆</span>
      <span className={`absolute -top-1 -right-1 ${style.corner} text-xs`}>◆</span>
      <span className={`absolute -bottom-1 -left-1 ${style.corner} text-xs`}>◆</span>
      <span className={`absolute -bottom-1 -right-1 ${style.corner} text-xs`}>◆</span>
      {/* Content */}
      <div className="relative z-10 p-4">{children}</div>
    </div>
  );
};

// ============================================================================
// SPELL PERSONA BORDER - Full decorative border based on archetype
// ============================================================================

export const SpellBorderFrame = ({ persona = 'site', children, className = '' }) => {
  const borderUrl = PERSONA_BORDER_URLS[persona] || PERSONA_BORDER_URLS.site;
  
  return (
    <div className={`relative ${className}`}>
      {/* Full border overlay - positioned at corners */}
      <div 
        className="absolute inset-0 pointer-events-none z-20"
        style={{
          backgroundImage: `url(${borderUrl})`,
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          opacity: 0.9
        }}
      />
      {/* Content with padding to avoid border overlap */}
      <div className="relative z-10 p-4 sm:p-8">{children}</div>
    </div>
  );
};

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Corners
  ElaborateCorner,
  CornerFlourish,
  // Dividers
  GrandDivider,
  MysticalDivider,
  SectionDivider,
  // Sections
  DarkSection,
  LightSection,
  // V1.1 Standard Components
  PageHero,
  ParchmentPanel,
  OrnateCard,
  LightOrnateCard,
  // Headers
  PageHeader,
  SectionHeader,
  InlineOrnament,
  // Glyphs
  BestiaryGlyph,
  OccultGlyph,
  // Frames
  BorderFrame,
  PersonaBorderFrame,
  TarotCardFrame,
  PageBorderFrame,
  SectionBorderFrame,
  SpellBorderFrame,
  PERSONA_BORDER_URLS,
  // Spell Components
  SpellSectionHeader,
  PrintablesBlock,
};
