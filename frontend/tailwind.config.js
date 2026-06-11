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
        // WTC MASTER PALETTE — Where The Crowlands
        // ============================================================================
        
        // Primary backgrounds
        background: '#0C1D2E',  // Deep Navy (primary dark)
        foreground: '#F3EFE8',  // Vellum (primary text on dark)
        
        // Card system
        card: {
          DEFAULT: '#102534',  // Celestial Blue
          foreground: '#F3EFE8',
        },
        popover: {
          DEFAULT: '#102534',
          foreground: '#F3EFE8',
        },
        
        // Interactive colors
        primary: {
          DEFAULT: '#B94E6A',  // Ember Pink (CTAs)
          foreground: '#F3EFE8',
        },
        secondary: {
          DEFAULT: '#102534',  // Celestial Blue
          foreground: '#F3EFE8',
        },
        muted: {
          DEFAULT: '#102534',
          foreground: '#A89872',  // Faded Gold
        },
        accent: {
          DEFAULT: '#C8A44D',  // Antique Gold
          foreground: '#0C1D2E',
        },
        destructive: {
          DEFAULT: '#C26A5A',  // Rose Clay
          foreground: '#F3EFE8',
        },
        
        // Borders and inputs
        border: '#C8A44D',  // Antique Gold borders
        input: '#102534',
        ring: '#B94E6A',  // Ember Pink focus
        
        // ============================================================================
        // WTC COLOR TOKENS (semantic naming)
        // ============================================================================
        'midnight-teal': '#0C1D2E',
        'celestial-blue': '#102534',
        'vellum': '#F3EFE8',
        'antique-gold': '#C8A44D',
        'muted-brass': '#A89872',
        'rose-clay': '#C26A5A',
        'ember-pink': '#B94E6A',
        
        // ============================================================================
        // LEGACY TOKENS (maintained for backward compatibility)
        // ============================================================================
        'raven-black': '#0C1D2E',
        'ash-gray': '#A89872',
        'weathered-beige': '#F3EFE8',
        'forest-moss': '#102534',
        'blood-red': '#B94E6A',
        'midnight-blue': '#0C1D2E',
        'deep-blue': '#102534',
        'parchment': '#F3EFE8',
        'ink-black': '#1A1A1A',
        'crimson': '#8b2232',
        'crimson-bright': '#B94E6A',
        'crimson-deep': '#6b1a28',
        'gold': '#C8A44D',
        'gold-light': '#D4B55D',
        'gold-dark': '#A89872',
        'champagne': '#C8A44D',
        'champagne-light': '#D4B55D',
        'navy-dark': '#0C1D2E',
        'navy-mid': '#102534',
        'navy-light': '#1A3548',
        'navy-accent': '#2A4558',
        'silver-mist': '#A89872',
        'blue-grey': '#5A524E',
        'cream': '#F3EFE8',

        // ============================================================================
        // GUIDE TINT TOKENS — canonical per-guide accent colors
        // ============================================================================
        'guide-shigg': '#D97706',       // amber-600
        'guide-shigg-light': '#F59E0B', // amber-500
        'guide-cathleen': '#0D9488',    // teal-600
        'guide-cathleen-light': '#2DD4BF', // teal-400
        'guide-katherine': '#7C3AED',   // violet-600
        'guide-katherine-light': '#A78BFA', // violet-400
        'guide-theresa': '#8B2232',     // oxblood (investigator)
        'guide-theresa-light': '#B94E6A', // ember pink
        'guide-brenda': '#A89872',      // faded gold (chronicler)
        'guide-brenda-light': '#C8A44D', // antique gold
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
        // Background textures can be added here when local assets are generated
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};