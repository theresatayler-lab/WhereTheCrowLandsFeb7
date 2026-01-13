# Where The Crowlands - Product Requirements Document

## Original Problem Statement
Build "Where The Crowlands," a sophisticated full-stack application for creating DIY rituals guided by AI archetypes. The app features a dual-AI architecture with DeepSeek (research/factual) and OpenAI (persona voice).

## Core Architecture
- **Frontend**: React + Tailwind + Shadcn/UI
- **Backend**: FastAPI + Python
- **Database**: MongoDB
- **AI**: Dual-model (DeepSeek for research, OpenAI GPT-4o for persona voice)

## What's Been Implemented

### Session: January 13, 2026
- **Interactive Occult Revival Timeline (NEW)**
  - Enhanced timeline page with 3 view modes: Timeline (vertical), Grid, Network (placeholder)
  - 13-category occult taxonomy integration from master chart
  - Decade navigation (1880s-1950s) with filtering
  - Taxonomy category filters with colored icons
  - Guide lens filtering (Shigg, Cathleen, Katherine, Theresa)
  - Search functionality
  - Expandable event cards with:
    - Significance, key figures, traditions
    - Source citations with quality tiers
    - Location data
    - Guide relevance indicators (colored dots)
  - 13 seed events covering 1888-1951 occult revival period
  - New backend models: `TimelineEventEnhanced`, `TimelineFilterRequest`, `ConnectionGraphResponse`
  - New API endpoints:
    - `GET /api/timeline/v2/events` - Filtered timeline events
    - `GET /api/timeline/v2/events/{id}` - Single event detail
    - `GET /api/timeline/v2/stats` - Timeline statistics
    - `GET /api/timeline/v2/graph` - Network graph data
    - `GET /api/timeline/v2/taxonomy` - Full taxonomy configuration
    - `POST/PUT/DELETE /api/timeline/v2/events` - Admin CRUD (Pro only)
  - Created DeepSeek briefing document for content expansion

### Session: January 12, 2026
- **TC Phantasmagoria Font Integration**
  - Custom OTF font installed at `/app/frontend/public/fonts/grimoire-accent.otf`
  - CSS utility classes: `.font-phantasmagoria`, `.ritual-title`, `.phantasmagoria-hero`, `.phantasmagoria-accent`
  - Applied to: Main title, page headers, spell titles, guide names
  
- **DeepSeek Research Pipeline V3 Enhancement**
  - 7 new research modes (10 total): cross_traditional_analysis, material_science_context, ritual_anatomy, historical_evolution, geographic_variants, transmission_analysis, contemporary_adaptation
  - 28 tradition tags taxonomy (expanded from 6)
  - 7 source quality tiers with confidence levels
  - 10 "Why This Works" framing patterns
  - Cross-persona connection points and tension mapping
  - Enhanced safety substitution categories (6 categories with subcategories)
  - 6-stage reading path pedagogy (Foundation → Integration)
  - New endpoint: `GET /api/research/config`

- **Navigation Verification**
  - Confirmed scroll-to-top behavior on all page transitions ✓

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
- `GET /api/spells/user` - User's saved spells
- `GET /api/timeline/v2/events` - Enhanced timeline with filtering
- `GET /api/timeline/v2/stats` - Timeline statistics
- `GET /api/timeline/v2/taxonomy` - 13-category taxonomy data

## Test Credentials
- Pro User: `sub_test@test.com` / `test123`
- Free User: `free_test@test.com` / `test123`

## Prioritized Backlog

### P0 - High Priority
- [x] Interactive Timeline Page (COMPLETED Jan 13, 2026)
- [x] MongoDB DocumentTooLarge Error - Fixed with GridFS image storage (COMPLETED Jan 13, 2026)
- [ ] Visual Polish & Ornament Library (20 corners, 12 dividers, 24 glyphs)

### P1 - Medium Priority
- [ ] Timeline images - populate events with historical paintings/illustrations
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
- **GridFS Image Storage**: Spell images now stored in MongoDB GridFS (`spell_images` bucket) to avoid 16MB document limit. Legacy spells (storage_version=1) still work with inline base64.
