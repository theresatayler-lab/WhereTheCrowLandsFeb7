# Where The Crowlands - Product Requirements Document

## Original Problem Statement
Build "Where The Crowlands," a sophisticated full-stack application for creating DIY rituals guided by AI archetypes. The app features a dual-AI architecture with DeepSeek (research/factual) and OpenAI (persona voice).

## Core Architecture
- **Frontend**: React + Tailwind + Shadcn/UI
- **Backend**: FastAPI + Python
- **Database**: MongoDB + GridFS (for images)
- **AI**: Dual-model (DeepSeek for research, OpenAI GPT-4o for persona voice)

## What's Been Implemented

### Session: December 2025 (Current)
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
- [ ] Visual Polish & Ornament Library (20 corners, 12 dividers, 24 glyphs) - BLOCKED: awaiting user assets

### P1 - Medium Priority
- [ ] Network View - Force-directed graph visualization (d3.js)
- [ ] Back-compatibility for old spell references
- [ ] Theresa archetype enrichment
- [ ] Fix linting errors in server.py
- [ ] Migrate frontend to use V2 spell generation endpoint

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
