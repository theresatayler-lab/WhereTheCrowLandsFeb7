// CROWLANDS BRAND ASSETS V1.0
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
