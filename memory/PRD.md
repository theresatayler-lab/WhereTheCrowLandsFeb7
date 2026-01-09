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
- Global `CROWLANDS_ART_BIBLE` in backend for unified "ornate occult scarf/tapestry" art style
- Persona-specific `visual_dna` overlays for Shigg, Cathleen, Katherine
- Reusable UI components: `PageHero`, `ParchmentPanel`, `OrnateCard`, `SectionDivider`
- Static ornament library (corners, dividers, glyphs)
- Consistent color system: navy, oxblood, gold, bone; serif fonts

### Border Design System (NEW - December 8, 2024)
- **PageBorderFrame**: Site-wide crow/Celtic border corners for major containers
- **SpellBorderFrame**: Persona-specific borders (Shigg, Cathleen, Katherine, Theresa)
- **SectionBorderFrame**: Gold keyline borders for content sections
- **TarotCardFrame**: Persona-specific tarot card frames
- Documentation: `/app/frontend/src/styles/BORDER_RULES.md`

### Progressive Loading System
- **Fast spell text**: Spell content loads in ~10 seconds (vs 30-60+ previously)
- **Background image generation**: Images generated in parallel after text displays
- **Skeleton placeholders**: Animated loading states for header image, dividers, tarot, sigil

### Spell Generation System
- Multi-step wizard for spell personalization
- Three AI archetypes: Shigg, Cathleen, Katherine (+ Theresa pending)
- Generated assets: tarot cards, sigils, dividers
- Spell saving to user's grimoire

### User Features
- Authentication (login/register)
- Personal grimoire for saved spells
- Subscription tiers (free/premium)
- PDF export functionality

## Completed Work (December 2024)

### December 8, 2024
- **Border Design System Implementation**:
  - Created `PageBorderFrame` component for site-wide crow/Celtic borders
  - Created `SpellBorderFrame` for persona-specific spell page borders
  - Created `SectionBorderFrame` for content section gold keyline borders
  - Applied to: Deities, HistoricalFigures, SacredSites, Rituals, Timeline, Profile, Auth, MyGrimoire, Upgrade, GrimoirePage
  - Created BORDER_RULES.md documentation

- **Progressive Loading Implementation**: 
  - `SpellRequest.js` now sends `generate_images: false` to get spell text fast
  - `lazyLoadImages()` function generates images in background after text displays
  - `GrimoirePage.js` shows animated skeleton placeholders while images load

- **GrimoirePage Contrast Fix (P0)**: Fixed critical readability issues on completed spell page

### Previous Session Work
- Visual System V1.1 integration (CROWLANDS_ART_BIBLE, persona visual_dna)
- UI component overhaul (PageHero, ParchmentPanel, OrnateCard)
- Fixed spell builder wizard contrast
- Fixed grimoire saving to store assetPlan (tarot, sigil)

## Pending Issues

### P2 - Fix Corrie Tarot Navigation Bug
Button/link functionality broken on /corrie-tarot?preview=crowlands

### P2 - BrowserStack Accessibility Issues
Blocked - waiting for specific report from user

### P3 - Theresa Archetype Enrichment
Add full backend config in persona_config.py including visual_dna, formats, scenarios, source_materials

## Future Tasks
- Apply TarotCardFrame to Corrie Tarot page
- Crawler access solution (sitemap.xml)
- Premium Spell Book Compiler (PDF generation)
- Activate Stripe Integration for live payments
- Print-on-Demand service integration
- Tooltips for esoteric terms
- Refactor server.py into modular structure

## Key Files
- `/app/frontend/src/components/OrnateElements.js` - UI components including border frames
- `/app/frontend/src/components/GrimoirePage.js` - Completed spell display (with SpellBorderFrame)
- `/app/frontend/src/pages/SpellRequest.js` - Spell builder wizard (progressive loading)
- `/app/frontend/src/styles/BORDER_RULES.md` - Border system documentation
- `/app/backend/persona_config.py` - CROWLANDS_ART_BIBLE and persona configs
- `/app/backend/server.py` - API endpoints

## Test Credentials
- Email: sub_test@test.com
- Password: test123
