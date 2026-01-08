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
- **GrimoirePage Contrast Fix (P0)**: Fixed critical readability issues on completed spell page
  - Changed all light text colors (`text-muted-foreground`, `text-foreground`) to dark colors (`text-amber-900`, `text-stone-800`, `text-stone-700`, `text-stone-600`)
  - Fixed "null" bug by adding proper null checks for `spell.subtitle`
  - Updated all sections: Materials, The Working, Words of Power, Historical Context, Warnings, Closing, Aftercare, Printables
  - Updated button styling and border colors for beige background (#D8CBB3)

### Previous Session Work
- Visual System V1.1 integration (CROWLANDS_ART_BIBLE, persona visual_dna)
- UI component overhaul (PageHero, ParchmentPanel, OrnateCard)
- Applied theme to /profile, /upgrade, /ai-chat, /auth pages
- Fixed spell builder wizard contrast
- Restored archetype-specific videos to loading screen
- Fixed grimoire saving to store assetPlan (tarot, sigil)
- Enhanced Printables block with tarot front/back

## Pending Issues

### P1 - Full Site-Wide Theming Audit
Apply PageHero, ParchmentPanel, OrnateCard components to remaining pages:
- /corrie-tarot
- /deities
- /figures
- /sites
- /rituals
- /timeline
- /library
- /my-grimoire

### P2 - Fix Corrie Tarot Navigation Bug
Button/link functionality broken on /corrie-tarot?preview=crowlands

### P2 - BrowserStack Accessibility Issues
Blocked - waiting for specific report from user

### P3 - Theresa Archetype Enrichment
Add full backend config in persona_config.py including visual_dna, formats, scenarios, source_materials

## Future Tasks
- Crawler access solution (sitemap.xml)
- Premium Spell Book Compiler (PDF generation)
- Activate Stripe Integration for live payments
- Print-on-Demand service integration
- Tooltips for esoteric terms
- Refactor server.py into modular structure

## Key Files
- `/app/frontend/src/components/GrimoirePage.js` - Completed spell display
- `/app/frontend/src/components/OrnateElements.js` - UI component library
- `/app/frontend/src/pages/SpellRequest.js` - Spell builder wizard
- `/app/backend/persona_config.py` - CROWLANDS_ART_BIBLE and persona configs
- `/app/backend/spell_prompts.py` - AI prompt generation
- `/app/backend/server.py` - API endpoints

## Test Credentials
- Email: sub_test@test.com
- Password: test123
