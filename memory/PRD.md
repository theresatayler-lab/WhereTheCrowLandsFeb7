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

### Session 2 (Current, March 2026)
- **Complete site-wide icon sweep** (80+ decorative Lucide icons -> custom BrandIcon PNG assets across 25+ files)
- **Bug fix:** Undefined icon references on Deities, HistoricalFigures, SacredSites, GrimoirePage pages
- **Emotional Need Clusters Enhancement:**
  - Added prefix matching for wildcard triggers (isolat*, harass*, bully*, intimidat*)
  - Implemented priority-based tie-breaking (grief > protection > heartbreak > burnout > money)
  - Enriched guide adjustment texts from spec
  - Added missing trigger words (miscarriage, estranged, numb, hollow, redundant, mortgage, etc.)
  - Updated reality check output format
- **Shigg Bibliomancy (Book Bibliomancy):**
  - BIBLIOMANCY_BOOK_TEMPLATE + BIBLIOMANCY_BOOK_WRITER_PROMPT in writer_blocks.py
  - bibliomancy_book working type in planner_blocks.py
  - Content direction blocks for all 6 sections
  - Expanded technique definition in persona_config.py
- **Theresa Bibliomancy (Shuffle Oracle):**
  - BIBLIOMANCY_SHUFFLE_TEMPLATE + BIBLIOMANCY_SHUFFLE_WRITER_PROMPT in writer_blocks.py
  - bibliomancy_shuffle working type in planner_blocks.py
  - Content direction blocks for all 6 sections
  - THERESA_SHUFFLE_ORACLE expanded definition in persona_config.py
  - ShuffleOracle.js frontend component (THEN/NOW two-column layout)
  - Conditional rendering in GrimoirePage.js and GuidePortal.js
- **Bibliomancy Pipeline Routing:**
  - Affinity-based soft routing (clarity/perspective/lost keywords)
  - get_bibliomancy_affinity() and get_working_type_with_bibliomancy() functions
  - Only fires for Shigg/Theresa, other guides unaffected
  - Explicit matches (protection, grief, etc.) always win over bibliomancy affinity
- **20 pytest tests** for all new features (all passing)

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
- backend/tests/test_bibliomancy.py - 20 regression tests
- frontend/src/components/ShuffleOracle.js - Shuffle Oracle component
- frontend/src/components/BrandIcon.js - Brand icon system
