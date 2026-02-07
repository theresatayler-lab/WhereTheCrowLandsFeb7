// CROWLANDS BRAND ASSETS V2.0
// Central location for all brand imagery
// All assets now stored locally in /public/images/ for portability

export const BRAND_ASSETS = {
  // The Parliament Crow - used for user avatars and watermarks
  crowAvatar: "/images/brand/crow-avatar.png",
  
  // Main logo
  logo: "/images/brand/logo.png",
  logoAlt: "/images/brand/logo-alt.png",
  
  // Profile frame
  profileFrame: "/images/brand/profile-frame.png",
  
  // ==========================================================================
  // DECORATIVE ICONS - Custom brand artwork (all PNG with transparency)
  // ==========================================================================
  icons: {
    // Mystical & Celestial
    moon: "/images/brand/moon-gold.png",           // Mystical, dividers, general decoration
    sunMoon: "/images/brand/sunmoon-gold.png",     // Balance, cycles, celestial
    eye: "/images/brand/eye-gold.png",             // Vision, insight, mystical headers
    hexagram: "/images/brand/hexagram-gold.png",   // Wisdom, celestial balance
    
    // Magic & Ritual
    pentagram: "/images/brand/pentagram-gold.png", // Spells, protection, magic features
    star: "/images/brand/star-gold.png",           // Featured items, magic actions, CTAs
    ouroboros: "/images/brand/ouroboros-gold.png", // Cycles, eternity, timeline, loading
    
    // Knowledge & Access
    book: "/images/brand/book-gold.png",           // Library, Grimoire, knowledge sections
    key: "/images/brand/key-gold.png",             // Login, secrets, locked content
    
    // History & Structure
    skull: "/images/brand/skull-gold.png",         // Ancestors, history, lineage
    column: "/images/brand/column-gold.png",       // Foundations, pillars, structure
    
    // NEW ICONS - Nature & Symbols
    bird: "/images/brand/bird-gold.png",           // Flight, freedom, messages
    buck: "/images/brand/buck-gold.png",           // Strength, nature, wild magic
    rose: "/images/brand/rose-gold.png",           // Beauty, love spells, botanical
    threestars: "/images/brand/threestars-gold.png", // Vertical arrangement
    threestarsHorizontal: "/images/brand/threestars-horizontal-gold.png", // Horizontal dividers
    
    // MORE ICONS - Mystical & Tools
    halfmoon: "/images/brand/halfmoon-gold.png",   // Lunar phases, night magic
    snake: "/images/brand/snake-gold.png",         // Transformation, wisdom, healing
    sacredheart: "/images/brand/sacredheart-gold.png", // Love, devotion, passion
    eightstar: "/images/brand/eightstar-gold.png", // Chaos magic, 8-fold path
    scissors: "/images/brand/scissors-gold.png",   // Cutting ties, craft, sewing magic
  },
  
  // ==========================================================================
  // ICON USAGE GUIDE
  // ==========================================================================
  // DIVIDERS & HEADERS:
  //   eye      - Major section dividers, "all-seeing" mystical headers
  //   moon     - General dividers, mystical decoration
  //   ouroboros - Timeline dividers, cycle/loop concepts
  //
  // FEATURE CARDS (use pink variant):
  //   star     - "Craft Your Spell" / magic actions
  //   book     - "The Grimoire" / knowledge/library
  //   moon     - "Invisible Helpers" / mystical features
  //   key      - Premium/locked content, authentication
  //
  // PAGE-SPECIFIC:
  //   pentagram - Spell creation, magic rituals
  //   hexagram  - Wisdom sections, celestial balance
  //   skull     - Timeline, ancestors, history
  //   column    - Lineage section, foundations
  //   sunMoon   - Day/night, balance themes
  //
  // COLOR VARIANTS:
  //   Gold (default) - Standard decoration, headers, dividers
  //   Pink (filter)  - Call-to-action, highlighted, feature cards
  // ==========================================================================
  
  // Spell watermark settings
  spellWatermark: {
    url: "/images/brand/crow-avatar.png",
    opacity: 0.08,
    size: "80px",
    position: "bottom-center"
  },
  
  // PDF watermark settings
  pdfWatermark: {
    url: "/images/brand/crow-avatar.png",
    opacity: 0.1,
    size: 60,
    position: "center-bottom"
  },
  
  // Background images
  backgrounds: {
    crowlands1: "/images/backgrounds/crowlands-bg-1.png",
    crowlands2: "/images/backgrounds/crowlands-bg-2.png",
    crowlands3: "/images/backgrounds/crowlands-bg-3.png"
  },
  
  // Guide borders
  borders: {
    cathleen: "/images/borders/cathleen-border-alt.png",
    kate: "/images/borders/kate-border-alt.png",
    theresa: "/images/borders/theresa-border-alt.png",
    siteCorners: "/images/borders/site-corners.png"
  }
};

// Default user avatar (the crow)
export const DEFAULT_USER_AVATAR = BRAND_ASSETS.crowAvatar;

// CSS filter to convert gold icons to pink/rose color
export const PINK_FILTER = 'hue-rotate(-30deg) saturate(1.5) brightness(1.1)';

// Icon component helper - returns style object for pink variant
export const getIconStyle = (size = 48, variant = 'gold', opacity = 1) => ({
  width: size,
  height: size,
  opacity: opacity,
  objectFit: 'contain',
  filter: variant === 'pink' ? PINK_FILTER : 'none',
});

// Spell watermark component props
export const getSpellWatermarkStyle = () => ({
  position: 'absolute',
  bottom: '20px',
  left: '50%',
  transform: 'translateX(-50%)',
  width: BRAND_ASSETS.spellWatermark.size,
  height: BRAND_ASSETS.spellWatermark.size,
  opacity: BRAND_ASSETS.spellWatermark.opacity,
  pointerEvents: 'none',
  zIndex: 0
});
