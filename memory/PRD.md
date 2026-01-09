# Where The Crowlands - Product Requirements Document

## Overview
Where The Crowlands is a sophisticated full-stack application for building DIY rituals guided by AI archetypes with an 18th-century grimoire aesthetic.

## Tech Stack
- **Frontend**: React with Tailwind CSS
- **Backend**: FastAPI (Python)
- **Database**: MongoDB
- **AI Integration**: OpenAI GPT-4 & DALL-E 3

## Core Features

### Visual System V1.1 (Collectible Grimoire Aesthetic)
- Global `CROWLANDS_ART_BIBLE` as **PREFIX** to all image prompts (ornate occult silk scarf/tapestry)
- Persona-specific `visual_dna` overlays for Shigg, Cathleen, Katherine, Theresa
- Hard negatives: no text/letters/words/watermarks/logos/photorealism/neon/collage
- Palette: midnight navy, oxblood, antique gold, bone

### Image Generation System
- **ImageProvider abstraction** (`/app/backend/image_provider.py`)
- Config: `IMAGE_PROVIDER` env var (library|dalle|flux)
- Static library for dividers (no DALL-E generation)
- Hash-based caching: `hash(prompt+persona+asset_type)`
- Generated: header + tarot + sigil only (dividers are STATIC)

### Progressive Loading System
- Text-first: `generate_images: false` returns spell in ~25 seconds
- Background image generation via `lazyLoadImages()`
- Skeleton placeholders while images load

### Download Entire Grimoire (NEW)
- Single PDF with cover page, table of contents, all spells
- Includes: spell text, header image, tarot card, sigil
- Component: `/app/frontend/src/components/GrimoireDownloader.js`
- Button appears on My Grimoire page when user has saved spells

### Spell Generation System
- Multi-step wizard for spell personalization
- Four AI archetypes: Shigg, Cathleen, Katherine, Theresa
- Generated assets: header, tarot, sigil (dividers static)

## Environment Variables (Backend)
```
OPENAI_API_KEY=<from hosting secrets>
IMAGE_PROVIDER=dalle  # Options: library|dalle|flux
MONGO_URL=<from hosting secrets>
DB_NAME=<from hosting secrets>
```

## Completed Work (January 2025)

### Session January 9, 2025
- **PDF Download Bug Fixed**: Completely rewrote PDF generation to use jsPDF directly instead of html2pdf.js
  - `GrimoireDownloader.js` - Uses jsPDF for entire grimoire PDF (cover, TOC, spell pages)
  - `GrimoirePage.js` - Uses jsPDF + html2canvas for single spell PDF
  - Both downloads now produce valid, non-blank PDFs
  - Tested and verified: Full grimoire PDF (~6KB) and single spell PDF (~143KB)

- **SPELL QUALITY UPGRADE V1.1**: Major quality overhaul for heirloom-style spells
  - Added `voice` block to each persona (role, tone, signature_phrases, pet_names, never_says)
  - Added `micro_lore` array (10 lived details per persona like "kettle that sings")
  - Added `taboos` array (things each persona would never do/say)
  - New `text_variation_tokens` for behind-the-scenes uniqueness (setting, sensory, gesture, metaphor details)
  - **Spell Writer Contract** now enforces:
    - `why_this_works`: 4-7 paragraphs explaining "We use X because..."
    - `substitutions`: 3 practical alternatives
    - `tiny_mistakes_to_avoid`: 3 safety/prep notes
    - `closing_and_aftercare`: with validation line ("If this doesn't land today...")
  - Incantation specificity rule: 3 concrete nouns + 1 emotion word
  - Ban on generic phrases per persona
  - Added `validate_spell_contract()` quality guard function

### Session December 2024
- **ImageProvider Abstraction**: Single interface with provider switching
- **Static Dividers**: No longer generated, use library URLs
- **ART_BIBLE as PREFIX**: Dominates all image prompts
- **Download Entire Grimoire**: PDF export with cover, TOC, all spells + images
- **Security**: Created .gitignore, confirmed env var usage

### Previous Work
- Border Design System (PageBorderFrame, SpellBorderFrame)
- Progressive Loading
- GrimoirePage contrast fixes
- Visual System V1.1 integration

## Pending Tasks

### P0 (Fixed)
- ✅ Blank PDF Download Bug - FIXED (January 9, 2025)

### P1: Site UI Components (NEXT)
- Build reusable components: PageHero, ParchmentPanel, OrnateCard, SectionDivider, BestiaryGlyph
- Apply across all pages for consistent Home page quality
- Static ornament library for running folklore animals + detail

### P2: Auth/Routing Instability
- Issue: Logged-in users sometimes get redirected away from protected pages (/my-grimoire, /profile)
- Needs investigation of PrivateRoute logic in App.js

### P3: Backlog
- Theresa archetype enrichment in persona_config.py
- BrowserStack accessibility issues (awaiting user input)
- Caching reality check
- Fix Corrie Tarot navigation (if still broken)
- Sitemap for crawlers
- Stripe live activation

## Key Files
- `/app/backend/image_provider.py` - ImageProvider abstraction
- `/app/backend/spell_prompts.py` - Image prompt building with ART_BIBLE prefix
- `/app/backend/persona_config.py` - CROWLANDS_ART_BIBLE and persona configs
- `/app/frontend/src/components/GrimoireDownloader.js` - PDF export
- `/app/frontend/src/components/GrimoirePage.js` - Spell display
- `/app/frontend/src/components/OrnateElements.js` - UI components

## Test Credentials
- Email: sub_test@test.com
- Password: test123

## Timing Benchmarks
- Text-only (generate_images: false): ~25 seconds
- Full with images (3 DALL-E + static dividers): ~90 seconds
