// CROWLANDS BRAND ASSETS V1.0
// Central location for all brand imagery

export const BRAND_ASSETS = {
  // The Parliament Crow - used for user avatars and watermarks
  crowAvatar: "https://customer-assets.emergentagent.com/job_arcane-rituals/artifacts/6swpo71j_wherethecrowlands_Now_can_we_create_a_full_brand_from_this_wi_416479c8-dbd6-4e10-9d1d-46e1d468e7bb_2.png",
  
  // Spell watermark settings
  spellWatermark: {
    url: "https://customer-assets.emergentagent.com/job_arcane-rituals/artifacts/6swpo71j_wherethecrowlands_Now_can_we_create_a_full_brand_from_this_wi_416479c8-dbd6-4e10-9d1d-46e1d468e7bb_2.png",
    opacity: 0.08,
    size: "80px",
    position: "bottom-center" // bottom-center or bottom-right
  },
  
  // PDF watermark settings
  pdfWatermark: {
    url: "https://customer-assets.emergentagent.com/job_arcane-rituals/artifacts/6swpo71j_wherethecrowlands_Now_can_we_create_a_full_brand_from_this_wi_416479c8-dbd6-4e10-9d1d-46e1d468e7bb_2.png",
    opacity: 0.1,
    size: 60, // pixels
    position: "center-bottom"
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
