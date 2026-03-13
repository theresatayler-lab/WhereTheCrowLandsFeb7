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
- **Backend:** FastAPI + Python + SlowAPI (rate limiting)
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
- Complete site-wide icon sweep (80+ Lucide icons -> BrandIcon)
- Emotional Need Clusters Enhancement
- Shigg Bibliomancy (Book Bibliomancy) full-stack
- Theresa Bibliomancy (Shuffle Oracle) full-stack
- Bibliomancy Pipeline Routing with affinity scoring
- 20 pytest tests (all passing)

### Session 3 (March 2026)
- **P0 UI Regression Fixes:** Guide Portal layout, avatar sizing site-wide, button readability standardized
- **P0 Security: Rate Limiting (SlowAPI):**
  - All `/api/ai/*` endpoints: 5 req/min per IP
  - `/api/research`: 5 req/min per IP
  - `/api/spellbook`: 5 req/min per IP
  - `/api/combined`: 3 req/min per IP
  - `/api/invisible-helpers/generate`: 3 req/min per IP
  - `/api/invisible-helpers/battle-cry/generate`: 3 req/min per IP
  - `/api/invisible-helpers/capture-and-generate`: 3 req/min per IP
  - All other endpoints: 30 req/min per IP (default)
  - 429 response: {"detail": "Too many requests. Please wait before trying again."}
  - IP extraction via X-Forwarded-For header for proxy/Railway compatibility

## Prioritized Backlog

### P0 (Critical)
- Remaining user security prompts (auth enforcement, CORS, info disclosure)
- Integrate AI Image Generation (Gemini Nano Banana via Emergent Key)

### P1 (High)
- Finalize Manifesto Integration (awaiting user document)

### P2 (Medium)
- Switch Stripe to Live Mode (needs live API keys)
- Backend refactor: break server.py into route modules

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
- backend/server.py - 6,440 lines, all routes, rate limiting via SlowAPI
- backend/image_provider.py - Static image library (no real AI provider connected)
- frontend/src/index.css - Global CSS including btn-ritual classes
- frontend/src/pages/GuidePortal.js - Flex-centered layout
- memory/BRAND_STYLE_GUIDE.md - Visual design source of truth
