# Where The Crowlands - Product Requirements Document

## Original Problem Statement
Build a spell-generation application, "Where The Crowlands," with a highly specific visual aesthetic. The app generates personalized spells through AI-powered guide personas, each with unique magical traditions.

## Core Requirements
1. **Visual & Brand Cohesion:** Strict adherence to `BRAND_STYLE_GUIDE.md` - deep navy, gold, ember pink, crimson, cream palette
2. **Database:** MongoDB Atlas (user-owned, persistent cluster)
3. **Spell Generation:** Multi-stage AI pipeline (archivist -> planner -> writer) using DeepSeek + Claude
4. **Guide Personas:** Shigg, Cathleen, Katherine, Theresa, Brenda - each with unique magical traditions
5. **Grimoire:** Personal spell collection with save/view/delete functionality
6. **Subscription:** Free/Pro tiers with Stripe integration (test mode)
7. **Emotional Sensitivity:** Emotional Need Clusters system calibrates guide responses to distress
8. **Bibliomancy:** Two new technique types - Shigg's Book Bibliomancy and Theresa's Shuffle Oracle

## Architecture
- **Frontend:** React + TailwindCSS + Framer Motion
- **Backend:** FastAPI + Python
- **Database:** MongoDB Atlas
- **AI:** DeepSeek (archivist/planner), Claude Sonnet (writer)
- **Auth:** JWT-based
- **Payments:** Stripe (test mode)

## What's Been Implemented

### Session 1 (Previous)
- Full spell generation pipeline (V3 blocks-based)
- Guide Portal with 5 personas (chat interface + spell generation)
- My Grimoire (spell/ward collection with tabs)
- Ward Finder, Corrie Tarot, Timeline, Invisible Helpers
- Auth, Profile, Subscription management
- Database migration to MongoDB Atlas
- Exhaustive color/brand overhaul (150+ fixes)
- Pro tier permissions fix, "Save to Grimoire" button

### Session 2
- **Complete site-wide icon sweep** (80+ decorative Lucide icons -> custom BrandIcon PNG assets across 25+ files)
- **Emotional Need Clusters Enhancement** with prefix matching, priority tie-breaking, enriched guide texts
- **Shigg Bibliomancy (Book Bibliomancy)** full-stack implementation
- **Theresa Bibliomancy (Shuffle Oracle)** full-stack implementation with ShuffleOracle.js component
- **Bibliomancy Pipeline Routing** with affinity-based soft routing
- **20 pytest tests** for all new features (all passing)

### Session 3 (Current, March 2026)
- **P0 UI Regression Fixes — COMPLETE:**
  - **Guide Portal layout:** Eliminated large empty space via flex centering (min-h-[calc(100vh-4rem)] + flex-col + flex-1)
  - **Guide avatars enlarged site-wide:** GuidePortal w-24 h-24 (was w-10), Guides listing w-20 h-20 (was w-16), About page w-10 h-10 (was w-6), PageHeader w-12/w-16 (was w-10/w-12)
  - **Button readability standardized:** All CTA buttons migrated to `.btn-ritual` class (Ember Pink bg, Vellum text, 14px, uppercase, 0.15em letter-spacing, inline-flex, cursor:pointer). Secondary buttons use `.btn-ritual-secondary`. Ghost buttons use `.btn-ritual-ghost`.
  - All 3 button classes updated with explicit `font-size`, `display: inline-flex`, `align-items: center`, `cursor: pointer`
  - Testing agent validated all 5 guide portals, guides listing, about page — 100% pass rate

## Prioritized Backlog

### P0 (Critical)
- Integrate AI Image Generation (Gemini Nano Banana via Emergent Key, then GPT Image 1, Flux, Ideogram)

### P1 (High)
- Finalize Manifesto Integration (awaiting user document)

### P2 (Medium)
- Switch Stripe to Live Mode (needs live API keys)

### P3 (Low/Future)
- Print-on-demand integration (Lulu.com)
- Tarot deck printing (MakePlayingCards.com)
- Deprecate legacy V1/V2 spell pipeline
- PWA Support
- Email service integration (Resend)

## Test Credentials
- Email: TheresaTayler@me.com
- Password: NinaROck1!
- Access Level: PRO

## Key Files
- backend/prompts/writer_blocks.py - Emotional clusters, bibliomancy templates
- backend/prompts/planner_blocks.py - Working types, bibliomancy routing
- backend/prompts/pipeline_blocks.py - Writer stage with bibliomancy prompt injection
- backend/persona_config.py - BIBLIOMANCY_TECHNIQUES, THERESA_SHUFFLE_ORACLE
- backend/tests/test_pipeline_logic.py - 20 regression tests
- frontend/src/pages/GuidePortal.js - Flex-centered layout, w-24 avatar, btn-ritual buttons
- frontend/src/pages/Guides.js - w-20 avatar, btn-ritual "Choose as My Guide"
- frontend/src/pages/About.js - w-10 guide avatars
- frontend/src/components/OrnateElements.js - PageHeader icon sizes w-12/w-16
- frontend/src/index.css - btn-ritual/btn-ritual-secondary/btn-ritual-ghost classes
- frontend/src/components/ShuffleOracle.js - Shuffle Oracle component
- frontend/src/components/BrandIcon.js - Brand icon system
