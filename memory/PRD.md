# Where The Crowlands - Product Requirements Document

## Original Problem Statement
Build a spell-generation application, "Where The Crowlands," with a highly specific visual aesthetic. The app generates personalized spells through AI-powered guide personas, each with unique magical traditions.

## Core Requirements
1. **Visual & Brand Cohesion:** Strict adherence to `BRAND_STYLE_GUIDE.md` - deep navy, gold, ember pink, crimson, cream palette
2. **Database:** MongoDB Atlas (user-owned, persistent cluster)
3. **Spell Generation:** Multi-stage AI pipeline (archivist → planner → writer) using DeepSeek + Claude
4. **Guide Personas:** Shigg, Cathleen, Katherine, Theresa, Brenda - each with unique magical traditions
5. **Grimoire:** Personal spell collection with save/view/delete functionality
6. **Subscription:** Free/Pro tiers with Stripe integration (test mode)

## Architecture
- **Frontend:** React + TailwindCSS + Framer Motion
- **Backend:** FastAPI + Python
- **Database:** MongoDB Atlas
- **AI:** DeepSeek (archivist/planner), Claude Sonnet (writer)
- **Auth:** JWT-based
- **Payments:** Stripe (test mode)

## What's Been Implemented
### Completed (as of March 2026)
- Full spell generation pipeline (V3 blocks-based)
- Guide Portal with 5 personas (chat interface + spell generation)
- My Grimoire (spell/ward collection with tabs)
- Ward Finder (Cathleen's ward generation)
- Corrie Tarot (tarot card reading)
- Profile & subscription management
- Upgrade/payment flow (Stripe test mode)
- Timeline/Research page with taxonomy categories
- Invisible Helpers (archival content)
- Auth (login/register)
- Database migration to MongoDB Atlas
- **Exhaustive color/brand overhaul** (150+ off-brand color fixes)
- **Complete site-wide icon sweep** (80+ decorative Lucide icons → custom BrandIcon PNG assets)
- Pro tier permissions fix
- "Save to Grimoire" button in Guide Portal
- Chat UI layout fix

## Prioritized Backlog

### P0 (Critical)
- Integrate AI Image Generation (Gemini Nano Banana via Emergent Key, then GPT Image 1, Flux, Ideogram)
- Implement Emotional Need Clusters (backend: writer_blocks.py, pipeline_blocks.py)

### P1 (High)
- Implement Shigg Bibliomancy Expansion (persona_config.py, writer_blocks.py)

### P2 (Medium)
- Finalize Manifesto Integration (awaiting user document)
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
