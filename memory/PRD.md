# Where The Crowlands - Product Requirements Document

## Original Problem Statement
Build "Where The Crowlands," a sophisticated full-stack application for creating DIY rituals guided by AI archetypes. The app features a dual-AI architecture with DeepSeek (research/factual) and OpenAI (persona voice).

## Core Architecture
- **Frontend**: React + Tailwind + Shadcn/UI
- **Backend**: FastAPI + Python
- **Database**: MongoDB + GridFS (for images)
- **AI**: Dual-model (DeepSeek for research, OpenAI GPT-4o for persona voice)

## What's Been Implemented

### Session: January 13, 2026 (Latest)
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
- `POST /api/combined` - Dual-AI spell generation
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
- [ ] Visual Polish & Ornament Library (20 corners, 12 dividers, 24 glyphs) - BLOCKED: awaiting user assets

### P1 - Medium Priority
- [ ] Network View - Force-directed graph visualization (d3.js)
- [ ] Back-compatibility for old spell references
- [ ] Theresa archetype enrichment
- [ ] Fix linting errors in server.py

### P2 - Future
- [ ] Re-enable Early Access Gate
- [ ] Premium PDF spell book compiler
- [ ] Live Stripe payments activation
- [ ] Print-on-Demand integration
- [ ] sitemap.xml for crawlers
- [ ] Refactor server.py into modular structure
- [ ] Faster image provider (Flux)

## Technical Notes
- EarlyAccessGate in App.js is currently commented out
- DeepSeek API key configured in backend/.env
- Font loaded via index.html style tag (not CSS import due to webpack)
- **GridFS Image Storage**: Spell images stored in MongoDB GridFS (`spell_images` bucket). Uses `storage_version=2` for new spells. Legacy spells (v1) still work with inline base64.
- **Timeline Data**: 79 events seeded from `/app/backend/timeline_events_expanded.py`. Database reseeded when event count changes.

## Test Reports
- `/app/test_reports/iteration_6.json` - GridFS and Timeline tests (14/14 passed)
- `/app/tests/test_gridfs_and_timeline.py` - Comprehensive test suite
