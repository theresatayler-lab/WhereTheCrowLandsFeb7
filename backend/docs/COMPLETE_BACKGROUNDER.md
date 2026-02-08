# WHERE THE CROWLANDS - Complete AI Development Backgrounder
# For DeepSeek, Claude, and AI-Assisted Development
# Version 2.0 - February 2025

---

## EXECUTIVE SUMMARY

Where The Crowlands is an occult folklore application that generates personalized spells and rituals guided by AI archetypes. The system uses a sophisticated dual-AI architecture:

- **DeepSeek** handles factual research (sources, history, verification)
- **Claude** handles creative writing (prose, storytelling, guide voices)
- **GPT-4o** serves as fallback only

This separation prevents hallucination while delivering rich, engaging content.

---

## PART 1: SYSTEM ARCHITECTURE

### 1.1 The Three-Layer Model

```
┌────────────────────────────────────────────────────────────────┐
│                    CONTENT GENERATION FLOW                      │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  LAYER 1: RESEARCH (DeepSeek)                                  │
│  ═══════════════════════════                                   │
│  • Finds historical facts and sources                          │
│  • Verifies claims with confidence levels                      │
│  • Outputs structured JSON                                     │
│  • NEVER embellishes or creates prose                          │
│                                                                 │
│  LAYER 2: REASONING (Claude Opus - Deep mode only)             │
│  ════════════════════════════════════════════════              │
│  • Analyzes research for nuance                                │
│  • Identifies cross-traditional connections                    │
│  • Suggests narrative threads                                  │
│                                                                 │
│  LAYER 3: WRITING (Claude Sonnet)                              │
│  ═══════════════════════════════                               │
│  • Transforms facts into beautiful prose                       │
│  • Maintains guide voice consistency                           │
│  • Creates emotional resonance                                 │
│  • NEVER invents facts beyond Layer 1                          │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

### 1.2 Model Assignments

| Task | Model | Temperature | Max Tokens | Why This Model |
|------|-------|-------------|------------|----------------|
| Research | DeepSeek-chat | 0.5-0.6 | 800-2000 | Accurate, cheap, JSON-friendly |
| Deep Reasoning | Claude Opus 4 | 0.7 | 1500 | Nuanced analysis |
| Storytelling | Claude Sonnet 4 | 0.8 | 1000-1500 | Beautiful prose |
| Spell Writing | Claude Sonnet 4 | 0.8 | 2500-3500 | Voice fidelity |
| Fallback | GPT-4o | 0.7 | varies | Only if others fail |

### 1.3 Spell Generation Tiers

**QUICK MODE** (15-25 seconds, ~$0.02/spell)
- DeepSeek (800 tokens) → Claude Sonnet (1500 tokens)
- For: Daily practices, simple intentions, "I need this now"

**STANDARD MODE** (30-45 seconds, ~$0.05/spell)
- DeepSeek (1200 tokens) → Claude Sonnet storytelling (1000 tokens) → Claude Sonnet writing (2500 tokens)
- For: Most spells, good balance of depth and speed

**DEEP MODE** (60-90 seconds, ~$0.15/spell)
- DeepSeek (2000 tokens) → Claude Opus reasoning (1500 tokens) → Claude Sonnet storytelling (1500 tokens) → Claude Sonnet writing (3500 tokens)
- For: Complex rituals, ancestral work, Pro users, first impressions

---

## PART 2: THE FOUR GUIDE PERSONAS

Each spell is delivered through one of four guide personas. These are NOT interchangeable - each has specific voice contracts, props, and traditions.

### 2.1 Shigg (Kitchen Witch)
- **Era**: Born 1920s London, lived in Dagenham
- **Tone**: Warm, gentle, practical, cozy
- **Props**: Kettle, tea, birds at window, worn recipe cards
- **Signature Phrases**: "Love, Shigg", "The kettle's on", "dear heart"
- **Never Says**: "dark one", "ancient wisdom", "thee/thou"
- **Traditions**: British folk magic, kitchen witchery, cunning craft
- **Default Tier**: Standard
- **Best For**: Daily comfort, grief, domestic magic

### 2.2 Cathleen (Singer of Strength)
- **Era**: Early 1900s Ireland, emigrated to London
- **Tone**: Fierce, protective, musical, Irish
- **Props**: Voice, song, fire, iron, protective herbs
- **Signature Phrases**: References to song, voice as power
- **Never Says**: Weak diminutives, over-gentleness
- **Traditions**: Celtic devotional, protective magic, voice magic
- **Default Tier**: Standard
- **Best For**: Protection, courage, boundaries, strength

### 2.3 Katherine (Victorian Spiritualist)
- **Era**: Late Victorian, active in spiritualist circles
- **Tone**: Precise, academic, measured, Victorian
- **Props**: Séance table, correspondence, pen, documentation
- **Signature Phrases**: Academic citations, careful language
- **Never Says**: Casual slang, unverified claims as fact
- **Traditions**: Victorian spiritualism, Golden Dawn, SPR methodology
- **Default Tier**: DEEP (requires thorough research)
- **Best For**: Spirit communication, divination, academic magic

### 2.4 Theresa (Appalachian Grandmother)
- **Era**: Early 20th century Appalachia
- **Tone**: Family-focused, practical, root-wise, mountain
- **Props**: Family photos, root cellar, porch, quilts
- **Signature Phrases**: "my mother used to say", family references
- **Never Says**: New age terminology, ceremonial magic terms
- **Traditions**: Appalachian folk magic, family tradition, practical herbalism
- **Default Tier**: Standard/Deep for ancestral
- **Best For**: Family healing, ancestral connection, practical herbalism

---

## PART 3: JSON SCHEMAS

### 3.1 Research Packet (DeepSeek Output)

```json
{
  "query_understood": "string - restatement of user's need",
  "research_mode": "spell_origins|safety_substitutions|historical_evolution|cross_traditional_analysis|material_science_context|ritual_anatomy|geographic_variants|transmission_analysis|contemporary_adaptation",
  "confidence_score": 0.85,
  
  "facts": [
    {
      "claim": "string - specific factual claim (min 20 chars)",
      "claim_type": "historical|folklore|modern_occult|speculative|academic",
      "confidence": "high|medium|low",
      "source_refs": ["source_id_1", "source_id_2"],
      "why_it_works": "string - explanation using framing patterns",
      "hedging_required": false,
      "verification_status": "verified|needs_check|unverified"
    }
  ],
  
  "sources": [
    {
      "source_id": "string - unique identifier",
      "author": "string - author name",
      "work": "string - book/article title",
      "year": 1900,
      "quality_tier": "academic_primary|folk_archive|practitioner_primary|modern_scholar_practitioner|community_tradition|speculative_reconstruction|popular_synthesis",
      "relevance": "string - why this source matters",
      "url": "string or null - URL if available",
      "quote": "string or null - direct quote if available"
    }
  ],
  
  "tradition_context": {
    "primary_tradition": "string - main tradition identifier",
    "related_traditions": ["array of tradition tags"],
    "geographic_origin": "string - location",
    "time_period": "string - era description",
    "transmission": "oral|written|both"
  },
  
  "timeline_connections": [
    {
      "event_id": "string - timeline event ID",
      "year": 1888,
      "title": "string - event title",
      "relevance": "string - how this connects"
    }
  ],
  
  "material_notes": [
    {
      "material": "string - material name",
      "historical_use": "string - how traditionally used",
      "symbolic_meaning": "string - what it represents",
      "safe_substitution": "string - safer alternative",
      "source_ref": "string - source ID"
    }
  ],
  
  "safety_flags": ["array of safety concerns"],
  "provenance_summary": "string - brief explanation of origins and confidence"
}
```

### 3.2 Spell Output Schema

```json
{
  "title": "string - spell title",
  "subtitle": "string - poetic description",
  "intent": "string - what this achieves (testable)",
  "guide_id": "shigg|cathleen|katherine|theresa",
  "belief_mode": "SPIRITUAL|PSYCHOLOGICAL|SECULAR",
  "tier_used": "quick|standard|deep",
  
  "provenance": {
    "accuracy_summary": "string - where this spell comes from",
    "primary_traditions": ["array of tradition tags"],
    "confidence_level": "high|medium|low",
    "timeline_connections": [],
    "sources_used": [],
    "ai_synthesis_note": "string - what was AI-generated vs researched"
  },
  
  "persona_lock": {
    "props": ["array of guide's signature objects"],
    "sensory_cue": "string - signature sensory detail",
    "signature_move": "string - characteristic gesture"
  },
  
  "blocks": [
    {
      "block_type": "cold_open|materials|choice|lore_vignette|stepper|reflection|closing|provenance|bird_oracle|ward|song_prompt|evidence_card",
      "block_id": "string - unique ID",
      "content": {}
    }
  ],
  
  "sources": [],
  "ethics_statement": "string - ethical boundaries (30+ chars)",
  "tradition_tags": []
}
```

### 3.3 Timeline Event Schema

```json
{
  "id": "string - unique event ID",
  "title": "string - event title",
  "year": 1888,
  "year_end": null,
  "era": "ancient|medieval|renaissance|enlightenment|romantic|victorian|occult_revival|interwar|postwar|contemporary",
  
  "description": "string - original description",
  "description_factual": "string - from DeepSeek",
  "description_narrative": "string - from Claude",
  "description_short": "string - one-liner",
  
  "taxonomy_categories": [1, 6],
  "primary_category": "string",
  "traditions": [],
  
  "figures_involved": [],
  "sources": [],
  
  "guide_relevance": {
    "shigg": "low|medium|high",
    "cathleen": "low|medium|high",
    "katherine": "low|medium|high",
    "theresa": "low|medium|high"
  },
  
  "connections": {
    "influenced_by": [],
    "influenced": [],
    "related_traditions": []
  },
  
  "location": {
    "name": "string",
    "region": "string"
  },
  
  "confidence": "high|medium|low",
  "_enhanced": false,
  "_enhanced_at": "ISO timestamp"
}
```

---

## PART 4: PROMPT TEMPLATES

### 4.1 DeepSeek Research Prompt

```
## RESEARCH REQUEST - STRICT FACT MODE

You are THE ARCHIVIST. You find FACTS, not stories.

QUERY: {user_query}
PERSONA CONTEXT: {guide_id} - {guide_traditions}
MATERIALS: {materials_list}

## OUTPUT RULES
1. Every claim needs a source_ref
2. Mark confidence: high (multiple academic sources), medium (one good source), low (oral tradition/reconstruction)
3. If you cannot verify, set hedging_required: true
4. NO creative embellishment - that's Claude's job
5. NO persona voice - you are a librarian

## REQUIRED OUTPUT (JSON only, no markdown)
{full_research_packet_schema}
```

### 4.2 Claude Opus Reasoning Prompt (Deep mode only)

```
## DEEP ANALYSIS REQUEST

You are analyzing research for a {guide_id} spell about: {intention}

RESEARCH DATA:
{research_packet}

## ANALYZE
1. Cross-traditional connections (what 2-3 traditions inform this?)
2. Historical evolution (how has this practice changed?)
3. Symbolic layers (what deeper meanings exist?)
4. Narrative threads (what stories could illustrate this?)
5. Ethical considerations (what boundaries exist?)

## OUTPUT (JSON)
{
  "cross_traditional": [],
  "evolution_notes": "",
  "symbolic_analysis": [],
  "narrative_suggestions": [],
  "ethical_notes": ""
}
```

### 4.3 Claude Sonnet Storytelling Prompt

```
## STORYTELLING ENHANCEMENT

Transform verified research into engaging narrative.

VERIFIED FACTS:
{facts_json}

SOURCES:
{sources_json}

GUIDE VOICE: {guide_name}
- Tone: {tone_descriptors}
- Signature phrases: {phrases}
- Never says: {forbidden}

## YOUR TASK
1. Weave facts naturally (never lecture)
2. Use guide's authentic voice
3. Attribute sources conversationally ("As Dion Fortune wrote...")
4. Use hedging for unverified claims
5. Create emotional resonance WITHOUT inventing facts

## DO NOT
- Invent new historical claims
- Add sources not in the research
- Use forbidden phrases
```

### 4.4 Claude Sonnet Spell Writer Prompt

```
## SPELL WRITER - {TIER} MODE

You ARE {guide_name}, {guide_title}.

SEEKER'S NEED: {intention}
FEELING SOUGHT: {desired_feeling}

RESEARCH PACKET:
{research_summary}

STORYTELLING LAYER:
{narrative_elements}

## VOICE CONTRACT
{voice_contract_json}

## BLOCK SEQUENCE
{planned_blocks}

## OUTPUT
Complete spell JSON with all blocks.
Stay in character. Weave research naturally.
```

---

## PART 5: DEVELOPMENT WORKFLOW

### When Creating New Features

1. **Define JSON schema** - What data structure do you need?
2. **Write DeepSeek prompt** - Focus on FACTS, require sources
3. **Write Claude prompt** - Reference DeepSeek output, set voice
4. **Test the chain** - Verify no hallucination
5. **Add to tier system** - Which tier uses this?
6. **Update documentation** - Keep this backgrounder current

### Prompt Quality Checklist

✅ DeepSeek prompt forbids creative embellishment?
✅ Requires source_refs for all claims?
✅ Uses confidence levels?
✅ Claude prompt references research output?
✅ Has clear voice guidelines?
✅ Forbids inventing facts?
✅ Has validation step?

---

## PART 6: COST OPTIMIZATION

### Estimated Monthly Costs

| Usage | Spells/Month | Mix | Est. Cost |
|-------|--------------|-----|-----------|
| Light | 100 | 70% Quick, 30% Standard | ~$3 |
| Medium | 500 | 50/40/10 | ~$20 |
| Heavy | 2000 | 40/40/20 | ~$100 |

### Optimization Strategies

1. **Cache research** - Similar queries can reuse DeepSeek results
2. **Tier appropriately** - Don't use Opus for simple spells
3. **Batch timeline** - Process multiple events per API call
4. **GPT-4o fallback only** - Never primary, 2x cost of DeepSeek

---

## PART 7: API ENDPOINTS

### Spell Generation
- `POST /api/ai/spell-v3` - Main spell generation
- `POST /api/ai/research` - Research only (DeepSeek)

### Timeline
- `GET /api/timeline/v2/events` - List events with filters
- `GET /api/timeline/v2/events/{id}` - Single event
- `POST /api/timeline/v2/events/{id}/enhance` - AI enhancement
- `POST /api/timeline/v2/enhance-batch` - Batch enhance (admin)

### Guides
- `GET /api/guides` - List all guides
- `GET /api/guides/{id}` - Guide details

---

## APPENDIX: TRADITION TAGS

```
british_folk_magic, kitchen_witchery, cunning_folk, celtic_devotional,
victorian_spiritualism, golden_dawn, theosophical, wicca_gardnerian,
wicca_alexandrian, dianic_wicca, chaos_magic, ceremonial_magic,
hoodoo, appalachian_folk, hedge_witchery, green_witchery,
ancestral_veneration, necromancy_historical, divination_tarot,
divination_scrying, herbalism_magical, sigil_magic, candle_magic,
protection_magic, love_magic, healing_magic, prosperity_magic
```

---

## APPENDIX: TAXONOMY CATEGORIES

1. Pre-Modern Grimoire
2. Alchemy & Hermeticism
3. Gothic & Romantic
4. Spiritualism & Séance
5. Symbolist & Decadent
6. Occult Revival
7. Surrealist
8. Folk Horror & Pastoral
9. Performance & Ritual Art
10. Cinematic Occult
11. Visionary & Psychedelic
12. Chaos Magic & Postmodern
13. Pop Occult
14. Activism & Feminist Craft

---

*Last Updated: February 2025*
*Version: 2.0 - Tiered AI System*
