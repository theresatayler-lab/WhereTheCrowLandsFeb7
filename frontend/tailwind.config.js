/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // ============================================================================
        // ART NOUVEAU PALETTE - Luminous, celestial, occult
        // ============================================================================
        
        // Primary backgrounds
        background: '#0a1628',  // Deep Navy (primary dark - matches Library)
        foreground: '#F3EFE8',  // Vellum (primary text on dark)
        
        // Card system
        card: {
          DEFAULT: '#123A3F',  // Celestial Blue
          foreground: '#F3EFE8',
        },
        popover: {
          DEFAULT: '#123A3F',
          foreground: '#F3EFE8',
        },
        
        // Interactive colors
        primary: {
          DEFAULT: '#B94E6A',  // Ember Pink (CTAs)
          foreground: '#F3EFE8',
        },
        secondary: {
          DEFAULT: '#123A3F',  // Celestial Blue
          foreground: '#F3EFE8',
        },
        muted: {
          DEFAULT: '#123A3F',
          foreground: '#9E8438',  // Muted Brass
        },
        accent: {
          DEFAULT: '#C8A44D',  // Antique Gold
          foreground: '#0E2A2F',
        },
        destructive: {
          DEFAULT: '#C26A5A',  // Rose Clay
          foreground: '#F3EFE8',
        },
        
        // Borders and inputs
        border: '#C8A44D',  // Antique Gold borders
        input: '#123A3F',
        ring: '#B94E6A',  // Ember Pink focus
        
        // ============================================================================
        // NOUVEAU COLOR TOKENS (semantic naming)
        // ============================================================================
        'midnight-teal': '#0a1628',  // Updated to match deep navy
        'celestial-blue': '#123A3F',
        'vellum': '#F3EFE8',
        'antique-gold': '#C8A44D',
        'muted-brass': '#9E8438',
        'rose-clay': '#C26A5A',
        'ember-pink': '#B94E6A',
        
        // ============================================================================
        // LEGACY TOKENS (maintained for backward compatibility)
        // These map to new palette where possible
        // ============================================================================
        'raven-black': '#0a1628',
        'ash-gray': '#9E8438',
        'weathered-beige': '#F3EFE8',
        'forest-moss': '#123A3F',
        'blood-red': '#B94E6A',
        'midnight-blue': '#0a1628',
        'deep-blue': '#123A3F',
        'parchment': '#F3EFE8',
        'ink-black': '#0a1628',
        'crimson': '#8b2232',
        'crimson-bright': '#B94E6A',
        'crimson-deep': '#6b1a28',
        'gold': '#C8A44D',
        'gold-light': '#D4B55D',
        'gold-dark': '#9E8438',
        'champagne': '#C8A44D',
        'champagne-light': '#D4B55D',
        'navy-dark': '#0a1628',
        'navy-mid': '#0E2A2F',
        'navy-light': '#1A4A4F',
        'navy-accent': '#2A5A5F',
        'silver-mist': '#9E8438',
        'blue-grey': '#5A7A7F',
        'cream': '#F3EFE8',
      },
      fontFamily: {
        'italiana': ['Italiana', 'serif'],
        'cinzel': ['Cinzel Decorative', 'serif'],
        'crimson': ['Crimson Text', 'serif'],
        'playfair': ['Playfair Display', 'serif'],
        'montserrat': ['Montserrat', 'sans-serif'],
      },
      borderRadius: {
        lg: '0.5rem',
        md: '0.25rem',
        sm: '0.125rem',
      },
      backgroundImage: {
        'engraving-landscape': "url('https://customer-assets.emergentagent.com/job_mystic-circle-2/artifacts/t5tfc6i3_COuld_we_creatre_more_of_these_--profile_bsfwy2d_--v_7_d08b86ee-a6ac-4cf3-a814-1344b45b3380_1.png')",
        'engraving-coral': "url('https://customer-assets.emergentagent.com/job_mystic-circle-2/artifacts/8imph0v6_wherethecrowlands_Could_you_create_some_good_background_style_f734269c-7d4f-4368-8a41-ddf55a00a162_0.png')",
        'engraving-texture-1': "url('https://customer-assets.emergentagent.com/job_mystic-circle-2/artifacts/0pf521mf_wherethecrowlands_Could_you_create_some_good_background_style_f734269c-7d4f-4368-8a41-ddf55a00a162_1.png')",
        'engraving-texture-2': "url('https://customer-assets.emergentagent.com/job_mystic-circle-2/artifacts/8ywnuf0u_wherethecrowlands_Could_you_create_some_good_background_style_f734269c-7d4f-4368-8a41-ddf55a00a162_2.png')",
        'engraving-texture-3': "url('https://customer-assets.emergentagent.com/job_mystic-circle-2/artifacts/efxqeoam_wherethecrowlands_Could_you_create_some_good_background_style_f734269c-7d4f-4368-8a41-ddf55a00a162_3.png')",
        'engraving-texture-4': "url('https://customer-assets.emergentagent.com/job_mystic-circle-2/artifacts/oweu8jv6_wherethecrowlands_lets_create_more_background_images_for_an_a_71f68355-bc18-47e7-9913-17746665f787_0.png')",
        'engraving-texture-5': "url('https://customer-assets.emergentagent.com/job_mystic-circle-2/artifacts/kot7stw7_wherethecrowlands_lets_create_more_background_images_for_an_a_71f68355-bc18-47e7-9913-17746665f787_2.png')",
        'engraving-texture-6': "url('https://customer-assets.emergentagent.com/job_mystic-circle-2/artifacts/35ceuwyl_wherethecrowlands_lets_create_more_background_images_for_an_a_525149ba-7cb5-44f2-8135-98af7078a114_0.png')",
        'engraving-texture-7': "url('https://customer-assets.emergentagent.com/job_mystic-circle-2/artifacts/4iovcjke_wherethecrowlands_lets_create_more_background_images_for_an_a_525149ba-7cb5-44f2-8135-98af7078a114_1.png')",
        'engraving-brand': "url('https://customer-assets.emergentagent.com/job_mystic-circle-2/artifacts/ozjenzg5_wherethecrowlands_Now_can_we_create_a_full_brand_from_this_wi_7e7051a9-9ee4-45aa-b341-887fd0d98a91_0.png')",
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};