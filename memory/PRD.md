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

### Session January 9, 2025 (Current)

#### Visual Polish V2.0 - COMPLETE
- **Enhanced Ornament Library** (`/app/frontend/src/assets/ornaments/index.js`)
  - 24 SVG bestiary glyphs: crow, raven, owl, hare, stag, fox, moth, serpent, pentacle, triquetra, crescent, sunDisc, key, chalice, candle, bell, compass, mirror, feather, thread, etc.
  - 20 SVG corner ornaments: classic, elaborate, floral, celtic, artNouveau, geometric, vine, occult, simple, double, diamond, star, spiral, wave, leaf, cross, arc, bracket, scroll, tassel
  - 12 SVG divider strips: classic, moon, stars, diamonds, wave, dots, ornate, celtic, arrows, simple, doubleLine, gradient
  - **Single Source of Truth**: `PAGE_ORNAMENT_CONFIG` maps each page to specific ornament styles

- **Page-Aware Ornament Components**
  - `PageOrnamentCorners` - Renders 4 corners with page-specific style
  - `PageDivider` - Page-aware divider component
  - `PageGlyph` - Page-aware accent glyph (primary/secondary)
  - `DecoratedSectionHeader` - Section header with ornament integration
  - `StepperOrnament` - Decorative element between wizard steps
  - `NavFlourish` - Small decorative element for navigation

- **UI Integration Complete**
  - `/app/frontend/src/pages/MyGrimoire.js` - Empty states now use `BestiaryGlyph` instead of Lucide icons
  - `/app/frontend/src/pages/Guides.js` - Guide cards have per-guide glyph accents (feather+crescent for Shigg, owl+crescent for Corrie, etc.)
  - `/app/frontend/src/pages/SpellRequest.js` - Step indicator uses `StepperOrnament` between steps

- **Visual QA Report Updated** (`/app/VISUAL_QA_REPORT.md`)
  - 22 pages audited, 98% visual consistency
  - 12 minor issues documented (all S/M changes)
  - Complete ornament usage reference and examples

### Session January 9, 2025 (Earlier)
- **PDF Download Bug Fixed**: Completely rewrote PDF generation to use jsPDF directly instead of html2pdf.js
  - `GrimoireDownloader.js` - Uses jsPDF for entire grimoire PDF (cover, TOC, spell pages)
  - `GrimoirePage.js` - Uses jsPDF + html2canvas for single spell PDF
  - Both downloads now produce valid, non-blank PDFs
  - Tested with 11 spells: Full grimoire PDF (49KB, ~16 pages)

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
  - **Validated with 6 test spells** - all pass "persona in 3 lines" + "wise guide teaching" criteria

- **Site-wide UI Pass COMPLETE**: All priority pages already use Crowlands visual system
  - `/corrie-tarot` - PageBorderFrame, DarkSection, GrandDivider ✅
  - `/profile` - PageBorderFrame, OrnateCard, PageHeader ✅  
  - `/upgrade` - PageBorderFrame, DarkSection, LightOrnateCard ✅
  - Home, Guides, SpellRequest, MyGrimoire - all consistent ✅

- **Static Ornament Library Created**: `/app/frontend/src/assets/ornaments/index.js`
  - 24 Bestiary Glyphs (crow, raven, owl, hare, stag, fox, moth, etc.)
  - 20 Corner Ornaments (classic, elaborate, celtic, art_nouveau, etc.)
  - 12 Divider Strips (moon, stars, diamonds, wave, etc.)
  - Deterministic selection functions for consistent page theming

- **Full Site QA Complete**: 22 pages tested, 100% visual pass, 95% functionality pass
  - See `/app/VISUAL_QA_REPORT.md` for full details

- **Setting Options Redesigned (V1.2)**: Replaced room-based settings with contextual settings
  - Old: Kitchen, Bedroom, Outdoors, Bath, Desk/Office
  - New: In the quiet of my home, Outside in nature, During my daily routine, On the move, In public/semi-public
  - Added SETTING_CONTEXT in spell_prompts.py with guidance for each setting
  - Backend SETTING_SCENARIO_MAP updated to map new settings to appropriate scenarios
  - Spell Writer prompt now includes setting-specific guidance (what can/cannot be included)
  - **Tested with 3 settings**: transit, home_quiet, nature - all adapt appropriately

- **Session Persistence Fixed**: Protected routes now wait for auth check before redirecting
  - Added `isAuthChecked` state to App.js
  - `/my-grimoire` and `/profile` no longer redirect to `/auth` on direct navigation
  - User can now bookmark and revisit protected pages without losing session

- **Early-access gate disabled** for testing (can be re-enabled in App.js)

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
