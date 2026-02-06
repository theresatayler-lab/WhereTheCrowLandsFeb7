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
  // DECORATIVE ICONS - Gold versions (can be tinted pink via CSS filter)
  // ==========================================================================
  icons: {
    moon: "/images/brand/moon-gold.png",        // Mystical, dividers, general decoration
    book: "/images/brand/book-gold.svg",        // Library, Grimoire, knowledge sections
    star: "/images/brand/star-gold.svg",        // Featured, magic, call-to-action
    skull: "/images/brand/skull-gold.svg",      // Timeline, ancestors, history, lineage
    key: "/images/brand/key-gold.png",          // Login, access, secrets, premium
    sunMoon: "/images/brand/sunmoon-gold.svg",  // Celestial, balance, cycles
  },
  
  // ==========================================================================
  // ICON USAGE GUIDE
  // ==========================================================================
  // Moon:    Dividers, general mystical decoration
  // Book:    Library page, Grimoire, Archives, knowledge cards
  // Star:    Featured items, spell creation, magic actions, CTAs
  // Skull:   Timeline, history sections, ancestor/lineage content
  // Key:     Authentication, locked content, secrets revealed
  // SunMoon: Day/night cycles, balance themes, celestial sections
  //
  // COLOR VARIANTS:
  // - Gold (default): Standard decoration
  // - Pink (CSS filter): Highlighted, active, or call-to-action states
  //   Use filter: 'hue-rotate(-30deg) saturate(1.5)' for pink tint
  // ==========================================================================
  
  // Spell watermark settings
  spellWatermark: {
    url: "/images/brand/crow-avatar.png",
    opacity: 0.08,
    size: "80px",
    position: "bottom-center" // bottom-center or bottom-right
  },
  
  // PDF watermark settings
  pdfWatermark: {
    url: "/images/brand/crow-avatar.png",
    opacity: 0.1,
    size: 60, // pixels
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
