# Where The Crowlands - Comprehensive Status Report

**Date:** March 16, 2026
**Scope:** Full assessment of all five guides, spell generation pipeline, frontend/backend architecture, and system health

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [The Five Guides - Complete Assessment](#the-five-guides)
3. [Spell Generation Pipeline](#spell-generation-pipeline)
4. [Frontend Architecture](#frontend-architecture)
5. [Backend Architecture](#backend-architecture)
6. [What's Working](#whats-working)
7. [Known Gaps & Issues](#known-gaps--issues)
8. [Recommendations](#recommendations)

---

## Executive Summary

Where The Crowlands is a full-stack React 18 + FastAPI + MongoDB application for AI-generated DIY rituals guided by five ancestral archetypes ("Guides"). The system uses a multi-LLM orchestration pipeline (DeepSeek for research, Claude Sonnet for writing, GPT-4o as fallback) with a tiered spell generation system.

**Overall Status:** The core platform is functional with spell generation, grimoire storage, timeline, and authentication all working. All five guides (Shigg, Cathleen, Katherine, Theresa, Brenda) have extensive persona configurations. Key gaps include timeline narrative coverage (~35/94 events enriched), 98 broken timeline connection references, and Stripe payments blocked pending a valid key.

---

## The Five Guides

### 1. SHIGG (Amber/Copper) - Kitchen Witch & Grief Tender

**Identity:**
- **Archetype:** Kitchen witch, domestic magic, grief tender, bird oracle keeper
- **Era:** Post-war British domestic (1950s-1970s), council estate kitchen magic
- **Voice:** Warm, cozy, food/tea/bird metaphors; never cold or clinical
- **Portal:** "Shigg's Kitchen" (button: "Step into the kitchen")
- **Canonical ID:** `shigg` (consistent frontend/backend)

**Core Tools & Materials:**
- Copper kettle (primary), teacup, wooden spoon, beeswax candle, kitchen herbs
- Bird oracle system: crow (truth/change), robin (comfort/return), magpie (luck/dual nature), wren (hidden power), blackbird (threshold/dusk)
- Traditional-to-craft mappings: white candle -> beeswax candle, athame -> bread knife, cauldron -> copper kettle, wand -> wooden spoon

**Spell Families:**
1. Morning rituals & dawn workings
2. Comfort & nourishment spells
3. Grief tending & memorial work
4. Bird oracle readings
5. Kitchen threshold magic

**Signature Phrases:** "Put the kettle on", "Let me feed you first", "The birds are saying...", "Come sit by the fire", "That'll warm your bones"

**Taboos:** Never cold/clinical, never shadow/darkness language, never analytical/precision language

**Visual DNA:**
- Colors: amber-600, amber-500, amber-900/15; Primary palette #B87333 (copper), #F5E6D3 (cream), #8B4513 (warm brown)
- Art style: "Ornate silk scarf tapestry illustration with warm amber copper and cream palette, kitchen hearth scene"
- Motifs: copper kettle, wooden spoon, teacup, bread, herbs, bird silhouettes, hearth fire, kitchen window

**Pre-built Grimoire Spells (5):**
1. Morning Kettle Blessing - dawn intention setting with tea
2. Bird Oracle Reading - observing bird messages
3. Bread & Salt Welcome - threshold protection
4. Grief Tending Tea Ceremony - processing loss through ritual tea
5. Kitchen Window Candle Vigil - evening reflection

**Allowed Sources:** Hutton (Stations of the Sun), Chamberlain (Bird oracle traditions), Davidson (Domestic magic UK), Kightly (Folk customs), Baker (Folklore of British birds), post-war British domesticity traditions

---

### 2. CATHLEEN (Teal/Emerald) - Irish Hedge Witch & Voice/Song Protector

**Identity:**
- **Archetype:** Irish hedge witch, voice/song magic, fierce protector, Morrigan devotee
- **Era:** Mid-20th century Irish-British diaspora (1940s-1970s)
- **Voice:** Fierce, poetic, music/voice metaphors; never meek or analytical
- **Portal:** "Cathleen's Threshold" (button: "Cross the threshold")
- **Canonical ID:** `cathleen` (consistent frontend/backend)

**Core Tools & Materials:**
- Singing bowl (primary), iron nail, rowan branch, black mirror, storm water
- Voice magic: keening (grief release), singing (power raising), whispering (secret magic), shouting (banishing), humming (healing)
- Traditional-to-craft: white candle -> beeswax taper, athame -> iron nail, cauldron -> singing bowl, wand -> rowan branch

**Spell Families:**
1. Protection wards & threshold magic
2. Courage & empowerment spells
3. Voice/song workings
4. Storm & weather magic
5. Morrigan devotional work

**Signature Phrases:** "Stand your ground", "Sing it out", "The ward holds", "By iron and voice", "The Morrigan sees you", "Cross my threshold if you dare"

**Taboos:** Never meek/quiet, never precision/analytical language, never domestic/cozy language, never teacup imagery

**Visual DNA:**
- Colors: teal-600, teal-400, teal-900/15; Primary palette #1B4B5A (deep teal), #C0C0C0 (silver), #2D5016 (forest green)
- Art style: "Ornate silk scarf tapestry illustration with teal emerald and storm silver palette, threshold/doorway scene"
- Motifs: singing bowl, iron nail, rowan branch, storm clouds, threshold doorway, Morrigan crow, Celtic knots, emerald fire

**Pre-built Grimoire Spells (5):**
1. Iron Ward: Threshold Protection - doorway protection ritual
2. Voice of Courage: Song Spell - singing for empowerment
3. Storm Water Blessing - collecting/using storm energy
4. Rowan Branch Protection - creating protective charm
5. Keening Rite: Grief Through Voice - vocal grief processing

**Allowed Sources:** O hOgain (Lore of Ireland), Wilde (Ancient Legends of Ireland), Danaher (Year in Ireland), Lysaght (Banshee), Clark & Lynch (Irish diaspora traditions), Morrigan devotional traditions

---

### 3. KATHERINE (Violet/Purple) - Victorian Spiritualist & Shadow Worker

**Identity:**
- **Archetype:** Eccentric Victorian diagnostician, sewing box magic, thread worker, justice dealer
- **Era:** Late Victorian through WWII (1880s-1945), Spitalfields/West End London
- **Voice:** Precise, methodical, eccentric, unafraid; sewing metaphors throughout
- **Portal:** "Katherine's Sitting Room" (button: "Enter the sitting room")
- **Canonical ID:** `catherine` (frontend) / `katherine` (backend) - note the inconsistent mapping

**Historical Background:**
- Born late 1800s in Spitalfields (Huguenot weaving community)
- Parents were musicians AND weavers
- Master tailor and court dressmaker for West End shops
- FEISTY: took people to court, represented herself legally
- Once institutionalized, emerged unbroken
- Famous story: During 1940s storm, walked to Cathleen's house to announce "I've just come round to tell you I won't be coming round today - it's MUCH too stormy," then left

**Core Tools & Materials:**
- Sewing box system: Thread (binding/measuring), Needle (piercing truth), Scissors (cutting ties), Mirror (truth-revealing), Pins (temporary binding)
- Signature materials: Bone needle, black silk thread, white linen cloth, tailor's chalk, seven pins, red sealing wax, crow feather, small mirror, mourning jewelry, red darkroom candle
- Seance tools: spirit slate, planchette, spirit trumpet, blackout curtain, bell, phosphorescent tape

**Spell Families:**
1. Shadow Integration - mirror, thread binding, feather; integration over banishment
2. Night Magic - midnight stitch, veil walking; darkness as fertile ground
3. Protective Dark Magic - witch bottle, salt + stitch, sealed wards
4. Divination in Darkness - shadow scrying, spirit's needle, mirror work
5. Ancestor & Grief Work - candle vigil, magpie rhyme, thread of memory

**Signature Phrases:** "Let's be precise about this", "I can see what this is about", "Time to cut the thread", "We'll unpick this", "Stitch by stitch", "The pattern's clear", "Measure twice, cut once", "Quite peculiar", "Properly done"

**Diagnostic Phrases:** "You've been crossed, haven't you?", "There's a thread here that needs cutting", "Tell me the exact date this started", "Do you want justice or revenge? They're not the same."

**Taboos:** Never cozy/domestic, never warm kitchen imagery, never bird oracle work, never vague/intuitive, feelings over methodology

**Visual DNA:**
- Colors: Forest green #4B5A3E (primary), cream #D8CBB3, crimson #750609; Tailwind: violet-600, violet-400
- Art style: "Ornate silk scarf tapestry illustration with cooler steel silver and oxblood tones, atelier desk scene, high-contrast engraved plate feel"
- Motifs: needle, thread spool, scrying mirror, brass compass, sealed letter, astrolabe, measuring tape, geometric sigil, wax seal, scissors, thimble

**Pre-built Grimoire Spells (5):**
1. Mirror of Truth: A Discernment Rite - naming the real problem
2. The Midnight Stitch: A Binding of Intention - anchoring intention in physical form
3. Salt and Stitch: A Threshold Ward - protective boundary
4. Shadow Scrying: Seeking What Hides - identifying hidden influences
5. The Candle Vigil: Sitting with Loss - grief space creation

**Core Ethics:** "Restraint is power", "Darkness is fertile, not evil", "No sensationalism", "Question it. Test it. Refine it.", "Precision isn't coldness - it's care"

**Rule of Three:** Is it true? Is it consensual? Is it mine to act on?

**Allowed Sources:** Jung (Red Book), Dion Fortune (Psychic Self-Defence), SPR Methods, Victorian Seance Documentation, Owen Davies (Cunning-folk), Spitalfields Weaving Traditions, Regardie (Golden Dawn), Huguenot Artisan Traditions

---

### 4. THERESA (Investigator) - Seer-Archivist & Pattern Breaker

**Identity:**
- **Archetype:** Seer-Archivist, pattern breaker, truth seeker, genealogical detective
- **Era:** Mid-20th century investigative tradition
- **Voice:** Direct, investigative, evidence/pattern metaphors; never vague or mystical
- **Portal:** "Theresa's Study" (button: "Enter the study")
- **Canonical ID:** `theresa`

**Core Tools (Anchors):**
- Notebook & Pen (primary) - documentation, pattern tracking
- Photograph - evidence, memory, proof
- Map/Family Tree - connections, geography, lineage
- Red Thread - connecting evidence, patterns across time
- Magnifying Glass - close examination, revealing hidden details

**Spell Families:**
1. Pattern Breaking - identifying and disrupting inherited cycles
2. Truth Seeking - investigative rituals for uncovering hidden information
3. Genealogical Magic - working with family lineage and ancestry
4. Evidence Gathering - systematic approaches to magical inquiry
5. Secret Revealing - bringing hidden family patterns to light

**Signature Phrases:** "Follow the evidence", "The pattern is clear", "Document everything", "What are the facts?", "Connect the threads", "Look closer", "The truth is in the details"

**Taboos:** Never vague/mystical, never domestic/cozy language, never flowery or imprecise

**Visual DNA:**
- Colors: Investigation-themed palette; maps, documents, red thread aesthetic
- Art style: Investigative/archival with documentary precision
- Motifs: notebooks, magnifying glass, photographs, maps, family trees, red thread connections, filing cabinets, evidence boards

**Pre-built Grimoire Spells:** 5 investigative-themed workings focused on pattern breaking, truth seeking, and genealogical magic

---

### 5. BRENDA (Chronicler) - Family Chronicler & Memory Keeper

**Identity:**
- **Archetype:** Family chronicler, memory keeper, crow communer
- **Era:** Post-war through modern era; keeper of family stories
- **Voice:** Warm, nostalgic, letter/memory/family metaphors; never clinical or impersonal
- **Portal:** "Brenda's Writing Desk" (button: "Sit at the desk")
- **Canonical ID:** `brenda`

**Core Tools (Anchors):**
- Letter/Envelope (primary) - communication with past/present/future
- Family Photo - memory preservation, connection
- Heirloom/Keepsake - physical links to ancestry
- Recipe Card - family traditions, nourishment of memory
- Crow Feather - messenger between worlds, communion

**Spell Families:**
1. Memory Keeping - preserving and honoring family stories
2. Letter Spells - writing as magical practice
3. Crow Communion - working with crow energy and messages
4. Family Story Work - healing through narrative
5. Heirloom Magic - working with inherited objects

**Signature Phrases:** "Let me tell you a story", "Remember when...", "The crows remember", "Write it down before it's lost", "Every family has its stories", "Pass it on"

**Taboos:** Never clinical/analytical, never impersonal, never cold or detached

**Visual DNA:**
- Colors: Warm nostalgic tones; aged paper, ink, soft lighting
- Art style: Nostalgic, epistolary, warm archival aesthetic
- Motifs: letters, envelopes, family photographs, recipe cards, crow feathers, writing desks, ink bottles, wax seals, heirlooms

**Pre-built Grimoire Spells:** 5 memory/letter-themed workings focused on family stories, crow communion, and heirloom magic

---

## Spell Generation Pipeline

### Architecture: 4-Stage V3 Pipeline

```
Stage 1: ARCHIVIST (DeepSeek)
  - Researches facts, historical sources, tradition context
  - Model: deepseek-chat
  - Grounds the working in documented history

Stage 2: PLANNER (GPT-4o)
  - Creates block structure and selects guide-appropriate template
  - Determines which spell template matches the guide's ceremonial structure
  - Each guide has a unique template (e.g., katherine_ceremonial, shigg_hearth)

Stage 3: WRITER (Claude Sonnet)
  - Writes full content in the selected guide's voice
  - Model: claude-sonnet-4-20250514
  - Fallback: gpt-4o if Claude unavailable
  - Receives emotional cluster adjustments based on seeker's situation

Stage 4: QA (Programmatic)
  - Validates output against guide rubrics
  - Auto-rewrites if validation fails
  - Checks for guide voice consistency, taboo violations, required sections
```

### Tiered System (spell_tiers.py)

| Tier | Time | Pipeline | Token Limit |
|------|------|----------|-------------|
| QUICK | 15-25s | DeepSeek -> Claude Sonnet | 800 tokens |
| STANDARD | 30-45s | DeepSeek -> Claude Sonnet | 2500 tokens |
| DEEP | 60-90s | DeepSeek -> Claude Opus reasoning -> Claude Sonnet | 3500 tokens |

### Emotional Cluster System

The pipeline adjusts spell content based on detected emotional needs:
- **Heartbreak** - Each guide approaches differently (Shigg: comfort food; Katherine: evidence documentation; Cathleen: fierce songs)
- **Money Anxiety** - Practical grounding (Katherine: numbers ritual; Shigg: abundance kitchen magic)
- **Protection/Fear** - Tailored protection (Cathleen: iron wards; Katherine: discernment protocols)
- **Burnout** - Restoration (Shigg: rest; Katherine: stock-take)
- **Grief/Loss** - Honor and process (Brenda: memory keeping; Shigg: tea ceremony; Katherine: archival)

### Belief Mode System

Three modes that adjust language and framing:
- **Secular** - Psychological/metaphorical framing
- **Spiritual** - Energetic/spiritual framing
- **Practitioner** - Traditional practice framing

---

## Frontend Architecture

### Stack
- React 18 + Tailwind CSS + Shadcn/UI
- React Router for navigation
- Custom API utility (`frontend/src/utils/api.js`)

### Key Pages
- Spell generation interface
- My Grimoire (saved spells)
- Interactive Timeline (94 historical events, 3 view modes)
- Guide portals (per-guide entry points)
- Invisible Helpers portal

### Design System

**Typography:**
| Usage | Font |
|-------|------|
| Accent/Titles | TC Phantasmagoria |
| Section Heads | Cinzel Decorative |
| Body | Crimson Text |
| UI/Labels | Montserrat |

**Color Palette:**
| Token | Hex | Usage |
|-------|-----|-------|
| navy-dark | #0a1628 | Main backgrounds |
| navy-mid | #0E2A2F | Section backgrounds |
| cream | #F3EFE8 | Text/reading surfaces |
| gold | #C8A44D | Accents, icons (stroke-only) |
| crimson | #8b2232 | CTAs |
| crimson-bright | #B94E6A | Highlights |

**Visual Rules:**
- Reading surfaces MUST be solid (no opacity under text)
- Minimum contrast: 4.5:1 body, 3:1 headings
- Gold is stroke-only, never flat fills
- One atmospheric image per page maximum
- No emojis in code/UI
- No `transition: all`
- No generic card grids

### Per-Guide Frontend Config (GrimoirePage)
Each guide has dedicated color schemes, border styles, gradients, and decorative frames configured in the grimoire page component.

---

## Backend Architecture

### Stack
- FastAPI (Python) with Motor (async MongoDB driver)
- MongoDB + GridFS (for spell images)
- JWT authentication
- Hosted on Emergent Platform (Kubernetes)

### Key Files

| File | Purpose | Size |
|------|---------|------|
| `server.py` | Main FastAPI app | 4000+ lines |
| `persona_config.py` | All 5 guide configurations | ~2400 lines |
| `spell_tiers.py` | Tiered AI selection logic | - |
| `llm_providers.py` | Multi-LLM abstraction layer | - |
| `timeline_service.py` | Timeline API service | - |
| `timeline_events_expanded.py` | 94 historical events | - |

### Prompt System (`prompts/` directory)

| File | Purpose |
|------|---------|
| `pipeline_blocks.py` | V3 4-stage pipeline orchestration |
| `archivist.py` | DeepSeek research prompts |
| `planner_blocks.py` | Block structure planning |
| `planner.py` | Guide-specific templates |
| `writer_blocks.py` | Guide voice writing with emotional clusters |
| `qa_blocks.py` | Validation and auto-rewrite |
| `belief_modes.py` | Secular/Spiritual/Practitioner adjustments |

### API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/ai/generate-spell-v3` | POST | Spell generation |
| `/api/ai/spell-config-v3` | GET | Spell configuration |
| `/api/timeline/v2/events` | GET | Timeline events |
| `/api/timeline/v2/stats` | GET | Timeline statistics |
| `/api/timeline/v2/graph` | GET | Timeline graph |
| `/api/auth/register` | POST | User registration |
| `/api/auth/login` | POST | User login |
| `/api/users/me` | GET | Current user |
| `/api/grimoire/spells` | GET | Saved spells |
| `/api/grimoire/save` | POST | Save spell |
| `/api/admin/seed-katherine-spells` | POST | Seed Katherine samples |

---

## What's Working

1. **Spell Generation (V3 blocks system)** - Full 4-stage pipeline operational
2. **All 5 Guides** - Shigg, Cathleen, Katherine, Theresa, and Brenda all have extensive persona configurations, spell templates, grimoire entries, voice markers, and visual DNA
3. **My Grimoire** - Save and retrieve spells per user
4. **Interactive Timeline** - 94 historical events with 3 view modes
5. **User Authentication** - JWT-based registration and login
6. **Invisible Helpers Portal** - Functional
7. **Multi-LLM Orchestration** - DeepSeek, Claude, GPT-4o integration with fallbacks
8. **Tiered Spell System** - Quick/Standard/Deep tiers
9. **Emotional Cluster Adjustments** - Per-guide emotional response tuning
10. **Belief Mode System** - Secular/Spiritual/Practitioner framing

---

## Known Gaps & Issues

### High Priority
1. **Timeline Narrative Coverage** - Only ~35 of 94 events have rich narratives; remainder need enrichment
2. **98 Broken Connection References** - Timeline events reference connections that don't resolve
3. **Stripe Payments BLOCKED** - Needs valid Stripe API key; payment flow non-functional

### Medium Priority
4. **Guide ID Inconsistency** - Katherine uses `catherine` in frontend (`archetypes.js`) but `katherine` in backend (`persona_config.py`); mapping exists but is fragile
5. **Server.py Monolith** - 4000+ lines in a single file; would benefit from modular refactoring
6. **Theresa & Brenda** - Newer guides; may need additional testing/polish compared to the original three (Shigg, Cathleen, Katherine)

### Low Priority
7. **Test Coverage** - No formal test suite observed
8. **API Documentation** - No OpenAPI/Swagger docs beyond FastAPI auto-generation
9. **Error Handling** - LLM fallback behavior could be more robust

---

## Recommendations

1. **Enrich remaining ~59 timeline events** with full narratives to match the quality of the existing 35
2. **Fix the 98 broken connection references** in timeline data
3. **Resolve Stripe integration** when a valid key is available
4. **Standardize Katherine's ID** to `katherine` across both frontend and backend
5. **Consider breaking `server.py`** into route modules (auth, spells, timeline, grimoire, admin)
6. **Add integration tests** for the spell generation pipeline
7. **Verify Theresa and Brenda** spell generation quality matches Shigg/Cathleen/Katherine maturity

---

*Report generated from comprehensive codebase analysis of the WhereTheCrowLandsFeb7 repository.*
