# Where The Crowlands - Product Requirements Document

## Original Problem Statement
Build "Where The Crowlands," a sophisticated full-stack application for creating DIY rituals guided by AI archetypes. The app features a dual-AI architecture with DeepSeek (research/factual) and OpenAI (persona voice).

## Core Architecture
- **Frontend**: React + Tailwind + Shadcn/UI
- **Backend**: FastAPI + Python
- **Database**: MongoDB + GridFS (for images)
- **AI**: Dual-model (DeepSeek for research, OpenAI GPT-4o for persona voice)

## What's Been Implemented

### Session: February 6, 2026 - Visual Polish & Ornament Refinement ✅
- **Corner Ornament Opacity Reduction** — Reduced all corner ornaments from 0.7→0.45 (dark) and 0.5→0.35 (light) opacity
  - Updated `SectionPlate` corners in `Home.js`: size 140→120, opacity 0.7→0.45
  - Updated `VellumPanel` corners: size 60→50, opacity 0.6→0.4
  - Updated `FeatureCard` corners: size 40→36, opacity 0.50→0.35
  - Updated `ElaborateCorner` and `CornerFlourish` components in `OrnateElements.js`: opacity 0.7→0.4, 0.6→0.4
  - Updated `VellumFrame` default in `artNouveau.js`: opacity 0.4→0.3
- **Side Rail Ornament Simplification** — Reduced visual clutter on section side rails
  - Removed `StarGlyph` from side rails, kept only `CrescentMoon`
  - Reduced height (20→16), opacity (0.5→0.3), and made visible only on `lg` screens (was `md`)
- **Overall Visual Balance Achieved** — Decorative elements now support rather than compete with content

### Session: February 6, 2026 - Logo & Visual Updates ✅
- **New Pink Logo Implemented** — Replaced site logo with "CrowslandPinkLogo.png"
  - Features pink/rose-toned crow illustration with transparent background
  - Updated in: Navigation bar, Footer, Home page hero, Early Access page
- **Pink Glow Headlines** — Added subtle pink text-shadow to key headlines
  - Applied to: Main titles, subtitles, section headers across Home, Guides, Early Access, Invisible Helpers, SpellRequest
  - Updated PageHeader component for site-wide consistency
- **Moon Image Replacement** — Replaced RavenGlyph bird icon with gold moon image
  - New asset: `/frontend/public/images/brand/moon-gold.png`
  - Replaced SVG bird with beautiful gold sun/moon face image
  - Appears in dividers and decorative elements throughout the site
- **Brand Icon Library Overhaul** — Full custom icon system
  - Downloaded 11 custom gold icons: moon, book, star, skull, key, sunMoon, eye, ouroboros, pentagram, hexagram, column
  - Created `BrandIcon` component with gold/pink variants (CSS filter for pink)
  - Replaced all feature card icons: Star (Craft Spells), Book (Grimoire), Moon (Archives)
  - Replaced divider icons: Eye (major dividers), Ouroboros (cycles), SunMoon (celestial)
  - Replaced section icons: Skull (Lineage/ancestors section)
  - Updated GrandDivider, MysticalDivider, and SectionDivider components
  - Icon usage guide documented in `/frontend/src/assets/brandAssets.js`

### Session: January 2026 - V1.2 Spell Differentiation System ✅
- **Micro-lore Wiring** — Each guide now has 10 lived details woven into spells
  - Planner selects 2-3 micro_lore items per spell
  - Writer must include at least 2 in cold_open or lore_vignette
  - Validated post-generation
  
- **Taboos Enforcement** — Each guide has forbidden themes/imagery
  - Taboos injected into Writer prompt as "DO NOT" list
  - Post-generation validator checks for taboo keyword violations
  - Cross-contamination tests prevent guide bleed
  
- **Text Variation Tokens** — Spells vary run-to-run
  - setting_detail, sensory_detail, gesture_detail, metaphor_detail
  - Randomly selected per spell for uniqueness
  
- **Tarot Composition Tracking** — Session-level repeat prevention
  - 6 compositions per guide
  - Tracks used compositions per session
  - Auto-resets after exhaustion
  
- **Surprise Me Routing** — Backend guide selection
  - Keyword-based routing (protection→Cathleen, pattern→Katherine, domestic→Shigg)
  - Feeling-based fallback routing
  - Routing reasons logged and returned to frontend
  
- **JSON Repair + Fallback System** — P0 reliability fix
  - Single LLM repair pass on JSON parse failure
  - Graceful fallback spell if repair fails
  - No more UI-breaking JSON errors
  
- **Guide-Specific Block Enforcement** — Shigg now requires journal_prompt + bird_oracle
  - Validation errors trigger QA rewrite
  - Each guide has required specialty blocks
  
- **Parliament Crow Avatar** — Brand identity
  - User avatars now show crow image
  - Crow watermark added to spell pages
  
- **Save Ward Feature** — Wards can be saved to grimoire
  - Save button on Cathleen's suggested wards
  - Saved to user's grimoire collection

- **Test Suite** — `/app/tests/test_spell_differentiation.py`
  - 22 tests covering all differentiation features
  - Cache/seed regression tests
  - Cross-contamination tests
  - Taboo keyword enforcement tests

### Session: December 2025 - Art Nouveau Visual Redesign ✅
- **Complete Visual System Overhaul** — Luminous Art Nouveau aesthetic
  - New color palette: Midnight Teal (#0E2A2F), Celestial Blue (#123A3F), Vellum (#F3EFE8), Antique Gold (#C8A44D), Ember Pink (#B94E6A)
  - New ornament library: Halo arc corners, lunar dividers, raven glyphs, celestial symbols (all stroke-based)
  - Updated all CSS variables in `tailwind.config.js` and `index.css`
  - New Art Nouveau ornament SVG library at `/app/frontend/src/assets/ornaments/artNouveau.js`
  - Updated `OrnateElements.js` with new component implementations
  - Applied to Home page with full Art Nouveau styling
  
  **Design Principles:**
  - Ornaments are structural (edges only), never decorative behind text
  - Gold is stroke-only, never flat fills
  - Text always on vellum panels or solid dark surfaces
  - Readability is sacred (WCAG AA minimum)
  - Luminous, not distressed aesthetic

  **Style Bible:** `/app/memory/STYLE_BIBLE.md` (v3.0)

### Session: December 2025 - Style Bible & Invisible Helpers
- **Comprehensive Style Bible Created** ✅
  - Complete design system documentation
  - Color tokens, typography, component library reference

- **Invisible Helpers UX Refinement** ✅
  - Form → Email → Donation → Result flow
  - "Before You Begin" and "After the Spell" wrapper sections
  - Stripe integration (free path working, paid path blocked on valid key)

### Session: December 2025 (Earlier)
- **Production-Ready Prompt Pack V2 - 4-Stage Pipeline** ✅
  - Implemented new modular prompt system at `/app/backend/prompts/`
  - **Stage 1 - Archivist** (DeepSeek): Research facts, sources, tradition context
  - **Stage 2 - Planner** (GPT-4o): Structure, materials, step outline
  - **Stage 3 - Writer** (GPT-4o): Full spell content in guide's voice
  - **Stage 4 - QA** (Programmatic + optional LLM): Validation with auto-rewrite
  
  **New Features:**
  - Belief boundary switch: `SECULAR`, `SPIRITUAL`, `PRACTITIONER`
  - Guide structure locks enforced per persona
  - Hard limits enforcement (no harm, coercion, medical claims, certainty)
  - Persona-lock validation (identifiable in first 3 lines)
  - Canon taxonomy integration (13-category visual/conceptual framework)
  - JSON schema validation for spell outputs
  
  **New Files Created:**
  - `/app/backend/prompts/__init__.py` - Module exports
  - `/app/backend/prompts/archivist.py` - Research prompt system
  - `/app/backend/prompts/planner.py` - Spell structure planning
  - `/app/backend/prompts/writer.py` - Guide voice writing + contracts
  - `/app/backend/prompts/qa.py` - Validation and auto-rewrite
  - `/app/backend/prompts/canon.py` - 13-category taxonomy
  - `/app/backend/prompts/hard_limits.py` - Universal constraints
  - `/app/backend/prompts/belief_modes.py` - Framing language control
  - `/app/backend/prompts/pipeline.py` - Full pipeline orchestration
  - `/app/backend/schemas/spell_schema.json` - Output validation schema
  - `/app/backend/schemas/research_packet_schema.json` - Research validation
  
  **New API Endpoints:**
  - `POST /api/ai/generate-spell-v2` - V2 spell generation
  - `GET /api/ai/spell-config-v2` - V2 configuration info

### Session: January 13, 2026
- **Katherine's Waite-Style Ceremonial Structure**
  - Replaced `section_grammar` with new `spell_template_structure` (12-step ceremonial format)
  - Added `rubrics`: Rule of Three Tests, Closing Formula
  - Added `spell_families`: 5 taxonomic categories (Shadow Integration, Night Magic, Protective Dark Magic, Divination in Darkness, Ancestor & Grief Work)
  - Added `signature_moves`: props, sensory anchors, core ethics
  - Added 5 pre-built `grimoire_entries` following the new template:
    1. Mirror of Truth (shadow_integration)
    2. The Midnight Stitch (night_magic)
    3. Salt and Stitch (protective_dark_magic)
    4. Shadow Scrying (divination_in_darkness)
    5. The Candle Vigil (ancestor_grief_work)

- **GridFS Image Storage - DocumentTooLarge Bug Fix**
  - Implemented `/app/backend/image_storage.py` with GridFS-based storage
  - Spell images (header, tarot, sigil) stored in `spell_images` GridFS bucket
  - Updated `/api/grimoire/save` to store images in GridFS, return references
  - Updated `/api/grimoire/spells` to fetch images from GridFS on retrieval
  - Updated `/api/grimoire/spells/{id}` DELETE to remove images from GridFS
  - Backward-compatible with legacy spells (storage_version=1)
  - All 14 backend tests passed

- **Timeline Images Integration**
  - Added `image_url` field to all 79 timeline events
  - Images sourced from Unsplash (historical paintings preference)
  - Events span from 1250 BCE (Papyrus of Ani) to 2020 CE (WitchTok)
  - Frontend EventImage component displays circular thumbnails
  - Grid view shows image thumbnails on cards
  - Timeline view shows images alongside event cards

### Session: January 13, 2026 (Earlier)
- **Interactive Occult Revival Timeline**
  - Enhanced timeline page with 3 view modes: Timeline (vertical), Grid, Network (placeholder)
  - 13-category occult taxonomy integration from master chart
  - Era navigation (Antiquity to Contemporary) with filtering
  - Taxonomy category filters with colored icons
  - Guide lens filtering (Shigg, Cathleen, Katherine, Theresa)
  - Search functionality
  - 79 historical events from 1250 BCE to 2020 CE
  - New API endpoints: `/api/timeline/v2/*`

### Session: January 12, 2026
- **TC Phantasmagoria Font Integration**
- **DeepSeek Research Pipeline V3 Enhancement**
- **Navigation scroll-to-top behavior**

### Session: January 18, 2026
- **Contrast-Locked Reading Surfaces** ✅ (WCAG AA Compliance)
  - Updated `STYLE_BIBLE.md` with new mandatory rule for long-form text readability
  - Fixed `GrimoirePage.js`: All spell sections now use solid vellum (`#F3EFE8`) backgrounds
  - Fixed `SpellBlockRenderer.jsx`: All block types (Cold Open, Stepper, Materials, Choice, etc.) use solid backgrounds
  - Removed all opacity-based backgrounds (`bg-*/10`, `bg-*/20`, etc.) from reading surfaces
  - Text contrast: Minimum 4.5:1 for body, 3:1 for headings
  - Decorative elements (gradients, atmospherics) only appear OUTSIDE reading plates

- **Atmospheric Background Images** ✅
  - Added subtle, sepia-tinted Art Nouveau background images to cream sections site-wide
  - Created reusable `AtmosphericBackground` component in `OrnateElements.js`
  - Three images rotating across pages:
    - **Maiden** (Art Nouveau woman portrait): Invisible Helpers, Ward Finder, Corrie Tarot, Privacy
    - **Florals** (lilies with golden sun): About, Spell Request, Auth, AI Chat, Upgrade
    - **Peonies** (botanical with gold frames): Guides, FAQ, AI Image, Profile
  - Settings: 10% opacity, sepia tint, multiply blend mode
  - One image per page, cream sections only (dark sections remain clean)
  - Configurable via props: `atmosphericImage`, `atmosphericOpacity`, `atmosphericPosition`, `atmosphericTint`

- **Old Spell Compatibility Fix** ✅
  - Fixed rendering crash in `GrimoirePage.js` for legacy spell formats
  - Added fallback: `spell.the_working?.steps || spell.steps || []`

- **Major Linting Cleanup** ✅
  - Fixed all errors in `backend/server.py`
  - Fixed errors in `Home.js`, `InvisibleHelpers.js`, `PaymentSuccess.js`, `OnboardingModal.js`

- **Timeline Content Addition** ✅
  - Added "Night Witches" entry to timeline (now 80 total events)

### Previous Sessions
- Dual-AI research pipeline (DeepSeek + OpenAI)
- Four ancestral guides: Shigg, Cathleen, Katherine, Theresa
- Spell generation with tarot cards and sigils
- User authentication (JWT)
- Subscription system (Stripe integration)
- My Grimoire spell saving
- Rich references system
- PDF export functionality

## Key Pages
- `/` - Home
- `/spell-request` - Guided spell creation
- `/guides` - Meet the Guides
- `/my-grimoire` - Saved spells (auth required)
- `/deities`, `/figures`, `/sites`, `/rituals`, `/timeline` - Archives
- `/ai-chat` - Research interface

## API Endpoints

### V2 Spell Generation (New)
- `POST /api/ai/generate-spell-v2` - Production-ready 4-stage pipeline
- `GET /api/ai/spell-config-v2` - V2 configuration (belief modes, guides, taxonomy)

### Legacy
- `POST /api/combined` - Dual-AI spell generation (V1)
- `POST /api/ai/generate-personalized-spell` - 2-stage system (V1.1)
- `GET /api/health/providers` - AI provider status
- `GET /api/research/config` - V3 research configuration
- `POST /api/auth/login`, `/api/auth/register` - Authentication
- `GET /api/grimoire/spells` - User's saved spells (with GridFS images)
- `POST /api/grimoire/save` - Save spell (stores images in GridFS)
- `GET /api/timeline/v2/events` - Enhanced timeline with filtering and images
- `GET /api/timeline/v2/stats` - Timeline statistics
- `GET /api/timeline/v2/taxonomy` - 13-category taxonomy data

## Test Credentials
- Pro User: `sub_test@test.com` / `test123`
- Free User: `free_test@test.com` / `test123`

## Prioritized Backlog

### P0 - High Priority
- [x] Interactive Timeline Page (COMPLETED Jan 13, 2026)
- [x] MongoDB DocumentTooLarge Error - Fixed with GridFS (COMPLETED Jan 13, 2026)
- [x] Timeline images - 79 events with Unsplash images (COMPLETED Jan 13, 2026)
- [x] Production Prompt Pack V2 - 4-stage pipeline (COMPLETED Dec 2025)
- [x] Visual Consistency Across Personas - Distinct color palettes for all 4 guides (COMPLETED Jan 13, 2026)
- [x] Atmospheric Background Images - Site-wide cream sections (COMPLETED Jan 18, 2026)
- [x] Old Spell Compatibility Fix (COMPLETED Jan 18, 2026)
- [x] Logo Replacement - New crow illustration logo with transparent background (COMPLETED Feb 6, 2026)
- [ ] Visual Polish & Custom Ornaments - BLOCKED: awaiting user assets

### P1 - Medium Priority
- [ ] PDF generation for "companion intentions"
- [ ] Network View - Force-directed graph for timeline (d3.js)
- [ ] Stripe Paid Flow - BLOCKED: needs valid test key (`sk_test_...`)
- [ ] Session Persistence Verification - awaiting user testing
- [ ] Remaining Linting Errors (CorrieTarot.js, etc.)

### P2 - Future
- [ ] Re-enable Early Access Gate
- [ ] Premium PDF spell book compiler
- [ ] Live Stripe payments activation
- [ ] Print-on-Demand integration
- [ ] sitemap.xml for crawlers
- [ ] Refactor server.py into modular structure
- [ ] Faster image provider (Flux)
- [ ] Deterministic test suite (36 golden tests: 3 intentions × 4 personas × 3 belief levels)

## Technical Notes
- EarlyAccessGate in App.js is currently commented out
- DeepSeek API key configured in backend/.env
- Font loaded via index.html style tag (not CSS import due to webpack)
- **GridFS Image Storage**: Spell images stored in MongoDB GridFS (`spell_images` bucket). Uses `storage_version=2` for new spells. Legacy spells (v1) still work with inline base64.
- **Timeline Data**: 79 events seeded from `/app/backend/timeline_events_expanded.py`. Database reseeded when event count changes.
- **V2 Pipeline**: Archivist separates research from persona voice. Writer cannot research - only adapts from research_packet.

## Test Reports
- `/app/test_reports/iteration_6.json` - GridFS and Timeline tests (14/14 passed)
- `/app/test_reports/iteration_7.json` - V2 Pipeline tests (6/7 passed, 1 fixed)
- `/app/tests/test_gridfs_and_timeline.py` - Comprehensive test suite
- `/app/tests/test_spell_v2_pipeline.py` - V2 pipeline test suite

### Session: January 13, 2026 - Invisible Helpers UX Refinement
- **Email Capture First Flow** ✅
  - Moved email capture to top of page, right after title
  - New title: "Receive Your Intention & Join the Chaos"
  - Flow: Email → Form → Checkout → Result
  - All step transitions now scroll to top of page
  
- **Action Commitment Redesign** ✅
  - Changed from single-select to multi-select checkboxes
  - New commitment statement: "By creating this working, I understand that spellwork and storytelling are conduits to support real action..."
  - Fun encouragement: "✨ Select all that call to you — the more, the merrier the chaos"
  - Options: Mutual aid & legal defense, Community & neighbors, Vetted information sharing, Independent journalism, Civic engagement

- **Email Capture Backend** ✅ 
  - Emails stored in `invisible_helpers` MongoDB collection via `/api/invisible-helpers/battle-cry/generate`
  - Tracks: email, generation_count, last_generated_at, source
  - Limit enforcement: 3 generations per email for guests

### Session: January 13, 2026 - Invisible Helpers Copy Refinement
- **Reduced Dion Fortune References** ✅
  - Intro now references Fortune only once for inspiration credit
  - Changed subtitle from "Inspired by the Invisible Helpers" to "A Working for Protection & Clarity"
  - "Fortune's Principles" → "Guiding Principles" 
  - Form context text generalized (removed Fortune-specific phrasing)
  - Closing quote updated: "Magic does not replace..." → "Inner work does not replace..."
  - Loading state text simplified
  - Content now "in spirit of" the tradition rather than directly attributing

### Session: January 13, 2026 - Invisible Helpers Spell-Builder Portal
- **Invisible Helpers Spell-Builder Implemented** ✅
  - Route: `/invisible-helpers`
  - **Three constrained spell-builders** inspired by Dion Fortune's wartime spiritual work:
    - **The Lawful Return of Misused Power**: Returns misused authority to impersonal law
    - **Clarity Against Propaganda**: Working for discernment in times of confusion
    - **Return to Sender**: Benevolent return of distortion to source for transmutation
  - **Form-based personalization** with fields:
    - Beneficiaries (multi-select + custom)
    - Primary quality to strengthen
    - Builder-specific fields (patterns, distortion channels, return types)
    - Time horizon, practice style, anchor phrase length
    - Real-world action pledge
    - Optional custom name
  - **AI-generated Fortune-aligned workings** via DeepSeek with:
    - Hard guardrails preventing harmful content
    - Soft transformations (named entities → pattern language)
    - Post-generation validation
  - **Output structure**: Title, Intention, Anchor Phrase, Ethical Frame, 6-step Guided Working, Action Pledge, Closing Truth
  - **Download PDF + Copy to clipboard** functionality
  - Navigation: Under Explore dropdown as "Invisible Helpers"
  - Optional donation via Stripe + email lead capture

### Session: January 13, 2026 - Invisible Helpers Portal
- **Invisible Helpers Portal Implemented** ✅
  - Route: `/invisible-helpers`
  - Dark, reverent single-page portal inspired by Dion Fortune's wartime spiritual work
  - **Three engagement modes:**
    - Option I: Set an Intention (foundational, with AI-generated sacred geometry ward)
    - Option II: The Lawful Return of Misused Power (featured, 6-step guided working)
    - Option III: Clarity Against Propaganda (6-step collective defense working)
  - **Email lead capture** with MongoDB storage (tagged source: `invisible-helpers`)
  - **Stripe donation** integration (optional, never gates access)
  - Navigation: Added under Explore dropdown as "Invisible Helpers"
  - Ethical statement and closing truth prominently displayed
  - Fortune-aligned ethics: defense, containment, clarity, and lawful return only

### Session: January 13, 2026 - Visual Overhaul & Persona Consistency
- **Persona-Specific Color Palettes Implemented** ✅
  - Added `textMuted` property to archetypeStyle passed to SpellBlockRenderer
  - All 4 guides now have distinct, consistent color schemes throughout the V3 block rendering:
    - **Shigg**: Amber/Copper tones (`border-amber-600`, `text-amber-500`, `bg-amber-900/15`)
    - **Cathleen**: Teal/Emerald tones (`border-teal-600`, `text-teal-400`, `bg-teal-900/15`)
    - **Katherine**: Violet/Purple tones (`border-violet-600`, `text-violet-400`, `bg-violet-900/15`)
    - **Theresa**: Indigo/Slate tones (`border-indigo-500`, `text-indigo-400`, `bg-indigo-900/15`)
  - Colors applied to: Cold Open, Materials, Choice, Stepper, Lore Vignette, Reflection, Closing, Bird Oracle, Ward, Song Prompt, Evidence Card (Inspiration), Journal Prompt, Safety Note
  - Verified visually with test V3 spells for each persona

### Session: December 2025 - Blocks-Based Spell System
- **V3 Blocks Pipeline Implementation** ✅
  - Extended schema with `blocks[]` array for typed block content
  - Block types: cold_open, materials, choice, stepper, lore_vignette, reflection, closing, bird_oracle, ward, song_prompt, evidence_card, journal_prompt, safety_note
  - Planner outputs `template_id` per persona and selects 1 canon anchor
  - Writer outputs `blocks[]` matching template with REQUIRED choice + lore_vignette
  - QA validates: no choice block fails, no lore vignette fails, persona-lock missing fails, blocks don't match template fails
  
  **New Files:**
  - `/app/backend/prompts/planner_blocks.py` - Block templates + canon anchors per guide
  - `/app/backend/prompts/writer_blocks.py` - Block content generation
  - `/app/backend/prompts/qa_blocks.py` - Block-specific validation
  - `/app/backend/prompts/pipeline_blocks.py` - Full blocks pipeline
  - `/app/backend/schemas/spell_blocks_schema.json` - Block schema definitions
  - `/app/frontend/src/components/SpellBlockRenderer.jsx` - Interactive block renderer with stepper checkboxes
  
  **New Endpoints:**
  - `POST /api/ai/generate-spell-v3` - Blocks-based spell generation
  - `GET /api/ai/spell-config-v3` - V3 configuration with block templates
  
  **Frontend Integration:**
  - Updated SpellRequest.js to call V3 endpoint
  - Updated language: "Craft Your Working" not "Craft Your Spell"
  - Belief boundary options: Secular & Reflective, Spiritual & Grounded, Practitioner
  - SpellBlockRenderer handles field name variations (bird/bird_name, message/oracle_message)
  - GrimoirePage detects blocks-based spells and uses SpellBlockRenderer
  
  **Block Templates per Guide:**
  - Shigg: cold_open → materials → choice → lore_vignette → stepper → bird_oracle → journal_prompt → closing
  - Cathleen: cold_open → materials → choice → lore_vignette → song_prompt → stepper → ward → closing
  - Katherine: cold_open → materials → safety_note → choice → lore_vignette → stepper → reflection → closing
  - Theresa: cold_open → evidence_card → materials → choice → lore_vignette → stepper → bird_oracle → journal_prompt → closing

### Session: December 2025 - Style Bible Documentation
- **Comprehensive Style Bible Created** ✅
  - Location: `/app/memory/STYLE_BIBLE.md`
  - Documents the complete "Crowlands" design system:
    - **Design Philosophy**: "Wartime Chapel + Occult Diagram" aesthetic
    - **Color System**: Primary palette (navy, crimson, gold) + extended tokens
    - **Typography**: TC Phantasmagoria (accent), Cinzel Decorative, Crimson Text, etc.
    - **Component Library**: OrnateElements.js components (corners, dividers, cards, frames)
    - **Ornament System**: 20 corner styles, 12 divider styles, 24 bestiary glyphs
    - **Page Sections**: Dark/Light section wrappers, standard page structure
    - **Persona Theming**: Shigg, Cathleen, Katherine, Theresa color schemes
    - **CSS Utilities**: Glow effects, button styles, scrollbar, texture overlays
  - Reference files documented: tailwind.config.js, index.css, OrnateElements.js, ornaments/index.js, archetypes.js
