# WHERE THE CROWLANDS - AI Architecture & Development Guide
# Version 2.0 - Tiered AI System with DeepSeek + Claude
# Last Updated: February 2025

## TABLE OF CONTENTS
1. System Overview
2. Model Architecture & Tiers
3. JSON Schemas for All Features
4. Prompt Templates
5. Cost Optimization Strategies
6. Timeline Enhancement System
7. Development Workflow
8. Quality Assurance Rules

---

## 1. SYSTEM OVERVIEW

### Core Philosophy
Where The Crowlands uses a **dual-AI architecture** that separates:
- **RESEARCH** (facts, sources, verification) → DeepSeek
- **CREATIVE WRITING** (prose, storytelling, voice) → Claude

This prevents hallucination by keeping factual research separate from creative embellishment.

### AI Model Assignments

| Task | Primary Model | Backup Model | Why |
|------|---------------|--------------|-----|
| Research/Facts | DeepSeek-chat | GPT-4o | Cheap, accurate, JSON-friendly |
| Deep Reasoning | Claude Opus 4 | Claude Sonnet 4 | Nuanced analysis |
| Storytelling | Claude Sonnet 4 | GPT-4o | Beautiful prose |
| Spell Writing | Claude Sonnet 4 | GPT-4o | Guide voice fidelity |
| Quick Tasks | Claude Sonnet 4 | GPT-4o | Speed + quality |

### The Golden Rule
> **DeepSeek finds the facts. Claude makes them beautiful. Never let Claude invent facts.**

---

## 2. MODEL ARCHITECTURE & TIERS

### Spell Generation Tiers

```
QUICK MODE (15-25 seconds)
├── Stage 1: DeepSeek Research (800 tokens)
└── Stage 2: Claude Sonnet Writing (1500 tokens)
    └── For: Daily practices, simple intentions

STANDARD MODE (30-45 seconds)
├── Stage 1: DeepSeek Research (1200 tokens)
├── Stage 2: Claude Sonnet Storytelling (1000 tokens)
└── Stage 3: Claude Sonnet Writing (2500 tokens)
    └── For: Most spells, good balance

DEEP MODE (60-90 seconds)
├── Stage 1: DeepSeek Research (2000 tokens)
├── Stage 2: Claude Opus Reasoning (1500 tokens)
├── Stage 3: Claude Sonnet Storytelling (1500 tokens)
└── Stage 4: Claude Sonnet Writing (3500 tokens)
    └── For: Complex rituals, Pro users, first impressions
```

### Tier Selection Logic

Automatic upgrades to DEEP tier:
- First spell ever (make great impression)
- Katherine persona (needs academic rigor)
- Keywords: ancestor, protection, séance, binding, spirit
- Pro/Paid users with complex intentions

Eligible for QUICK tier:
- Keywords: calm, simple, daily, morning, quick
- Repeat visits for similar spells
- User explicit choice

### Cost Per Spell (Approximate)

| Tier | Cost | Spells per $1 |
|------|------|---------------|
| Quick | ~$0.02 | ~50 |
| Standard | ~$0.05 | ~20 |
| Deep | ~$0.15 | ~7 |

---

## 3. JSON SCHEMAS FOR ALL FEATURES

### 3.1 Research Packet (DeepSeek Output)

```json
{
  "query_understood": "Restatement of user's need",
  "research_mode": "spell_origins|safety_substitutions|historical_evolution|...",
  "confidence_score": 0.85,
  
  "facts": [
    {
      "claim": "Specific factual claim (min 20 chars)",
      "claim_type": "historical|folklore|modern_occult|speculative|academic",
      "confidence": "high|medium|low",
      "source_refs": ["source_1", "source_2"],
      "why_it_works": "Explanation using framing patterns",
      "hedging_required": false,
      "verification_status": "verified|needs_check|unverified"
    }
  ],
  
  "sources": [
    {
      "source_id": "unique_id",
      "author": "Author Name",
      "work": "Work Title",
      "year": 1900,
      "quality_tier": "academic_primary|folk_archive|practitioner_primary|modern_scholar_practitioner|community_tradition|speculative_reconstruction|popular_synthesis",
      "relevance": "Why this source matters",
      "url": "https://verified-url.com",
      "quote": "Direct quote if available"
    }
  ],
  
  "tradition_context": {
    "primary_tradition": "british_folk_magic",
    "related_traditions": ["kitchen_witchery", "cunning_folk"],
    "geographic_origin": "England, rural areas",
    "time_period": "17th-19th century",
    "transmission": "oral|written|both"
  },
  
  "timeline_connections": [
    {
      "event_id": "timeline_event_id",
      "year": 1888,
      "title": "Event title",
      "relevance": "How this connects to the spell",
      "link": "/timeline?event=timeline_event_id"
    }
  ],
  
  "material_notes": [
    {
      "material": "rosemary",
      "historical_use": "Protection, memory, cleansing",
      "symbolic_meaning": "Remembrance, fidelity",
      "safe_substitution": "thyme or sage",
      "source_ref": "source_1"
    }
  ],
  
  "safety_flags": ["open_flame", "smoke_inhalation"],
  
  "provenance_summary": "Brief explanation of where this practice comes from and confidence level"
}
```

### 3.2 Storytelling Enhancement (Claude Input)

```json
{
  "task": "storytelling_enhancement",
  "input_facts": [...],  // From DeepSeek
  "input_sources": [...],
  "guide_voice": {
    "persona_id": "shigg",
    "tone": ["warm", "gentle", "knowing"],
    "signature_phrases": ["Love, Shigg", "The kettle's on"],
    "never_says": ["dark one", "thee/thou", "ancient wisdom"]
  },
  "output_requirements": {
    "narrative_style": "intimate, as if sharing over tea",
    "fact_integration": "weave facts naturally, never lecture",
    "source_attribution": "mention sources conversationally",
    "hedging_language": "use 'lore suggests', 'tradition holds' for unverified"
  }
}
```

### 3.3 Spell Block Schema

```json
{
  "title": "Spell title",
  "subtitle": "Brief poetic description",
  "intent": "What this achieves (testable)",
  "guide_id": "shigg|cathleen|katherine|theresa",
  "belief_mode": "SPIRITUAL|PSYCHOLOGICAL|SECULAR",
  "tier_used": "quick|standard|deep",
  
  "provenance": {
    "accuracy_summary": "This spell draws from...",
    "primary_traditions": ["british_folk_magic"],
    "confidence_level": "high|medium|low",
    "timeline_connections": [...],
    "sources_used": [...],
    "ai_synthesis_note": "Creative elements not from sources..."
  },
  
  "blocks": [
    {
      "block_type": "cold_open|materials|choice|lore_vignette|stepper|reflection|closing|provenance",
      "block_id": "unique_id",
      "content": {...}
    }
  ]
}
```

### 3.4 Timeline Event Schema

```json
{
  "id": "unique_event_id",
  "title": "Event Title",
  "year": 1888,
  "year_end": null,
  "era": "occult_revival",
  
  "description": {
    "factual": "Strict factual description from DeepSeek",
    "narrative": "Poetic/engaging version from Claude",
    "short": "One-line summary"
  },
  
  "taxonomy_categories": [1, 6],
  "primary_category": "Revival",
  "traditions": ["golden_dawn", "victorian_spiritualism"],
  
  "figures_involved": ["MacGregor Mathers", "W.B. Yeats"],
  
  "sources": [
    {
      "author": "Israel Regardie",
      "work": "The Golden Dawn",
      "year": 1937,
      "type": "practitioner_primary",
      "url": "https://..."
    }
  ],
  
  "guide_relevance": {
    "shigg": "low",
    "cathleen": "medium", 
    "katherine": "high",
    "theresa": "low"
  },
  
  "connections": {
    "influenced_by": ["event_id_1"],
    "influenced": ["event_id_2"],
    "related_spells": ["spell_category_1"]
  },
  
  "location": {
    "name": "London",
    "region": "England"
  },
  
  "image_url": "https://...",
  "confidence": "high|medium|low",
  "last_verified": "2025-02-08"
}
```

---

## 4. PROMPT TEMPLATES

### 4.1 DeepSeek Research Prompt Template

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

## REQUIRED OUTPUT (JSON only)
{research_packet_schema}
```

### 4.2 Claude Storytelling Prompt Template

```
## STORYTELLING ENHANCEMENT

You are enhancing factual research with beautiful prose.

VERIFIED FACTS (from research):
{facts_json}

SOURCES TO CITE:
{sources_json}

GUIDE VOICE: {guide_name}
- Tone: {tone_descriptors}
- Signature phrases: {phrases}
- Never says: {forbidden}

## YOUR TASK
Transform these facts into engaging narrative that:
1. Weaves facts naturally (never lectures)
2. Uses guide's authentic voice
3. Attributes sources conversationally ("As Dion Fortune wrote...")
4. Uses hedging for unverified claims ("Tradition holds that...")
5. Creates emotional resonance without inventing facts

## DO NOT
- Invent new historical claims
- Add sources not in the research
- Use forbidden phrases
- Break character from guide voice
```

### 4.3 Spell Writer Prompt Template

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
Return complete spell JSON with all blocks filled.
Weave research and storytelling naturally.
Stay in character throughout.
```

---

## 5. COST OPTIMIZATION STRATEGIES

### 5.1 Caching Research
- Cache DeepSeek results for similar queries (24-hour TTL)
- Hash: intention + materials + persona → cache key
- Saves ~40% of research calls

### 5.2 Tiered Token Limits
- QUICK: Strict limits, no storytelling stage
- STANDARD: Moderate limits, one storytelling pass
- DEEP: Full limits, multiple passes

### 5.3 Batch Processing
- For timeline enhancement: batch 10 events per DeepSeek call
- For spell generation: no batching (real-time UX needed)

### 5.4 Model Selection
- Never use Opus for simple tasks (10x cost of Sonnet)
- DeepSeek for ALL research (1/30th cost of GPT-4o)
- GPT-4o only as fallback

### 5.5 Estimated Monthly Costs

| Usage Level | Spells/Month | Mix | Est. Cost |
|-------------|--------------|-----|-----------|
| Light | 100 | 70% Quick, 30% Standard | ~$3 |
| Medium | 500 | 50% Quick, 40% Standard, 10% Deep | ~$20 |
| Heavy | 2000 | 40% Quick, 40% Standard, 20% Deep | ~$100 |

---

## 6. TIMELINE ENHANCEMENT SYSTEM

### Process for Enriching Timeline Events

```
1. DEEPSEEK RESEARCH PASS
   Input: Existing event title + year + basic description
   Output: Enhanced facts, sources, connections, figures
   
2. CLAUDE NARRATIVE PASS
   Input: DeepSeek facts + guide relevance scores
   Output: Engaging description, poetic narrative version
   
3. VALIDATION PASS
   - Check all sources are real
   - Verify dates
   - Flag any hedging needed
   
4. MERGE & STORE
   - Keep original factual description
   - Add narrative description
   - Store sources with confidence levels
```

### Timeline Enhancement Prompt (DeepSeek)

```
## TIMELINE RESEARCH ENHANCEMENT

EVENT: {title}
YEAR: {year}
EXISTING DESCRIPTION: {current_description}

Research and provide:
1. 3-5 additional verified facts about this event
2. Key figures involved (with roles)
3. Academic sources (author, work, year)
4. Connections to other events in our timeline
5. Guide relevance scores (which of our 4 guides would care about this?)

OUTPUT: JSON matching timeline_event_schema
```

### Timeline Narrative Prompt (Claude)

```
## TIMELINE NARRATIVE ENHANCEMENT

EVENT: {title} ({year})
VERIFIED FACTS: {facts_from_deepseek}
SOURCES: {sources}

Write two versions:
1. FACTUAL (2-3 sentences, encyclopedic, for researchers)
2. NARRATIVE (3-4 sentences, evocative, for browsers)

The narrative should:
- Create atmosphere and intrigue
- Connect to the human stories involved
- Hint at the event's magical significance
- Never invent facts beyond what's provided
```

---

## 7. DEVELOPMENT WORKFLOW

### When Building New Features

1. **Define the JSON schema first**
   - What data do you need?
   - What's the output structure?

2. **Write the DeepSeek prompt**
   - Focus on FACTS
   - Require source citations
   - Set confidence thresholds

3. **Write the Claude prompt**
   - Reference the DeepSeek output
   - Define voice/tone
   - Set creative boundaries

4. **Test the chain**
   - Verify facts aren't invented
   - Check voice consistency
   - Measure timing and cost

5. **Add to tier system**
   - Which tier(s) use this feature?
   - What triggers it?

### Prompt Checklist

✅ Does the DeepSeek prompt forbid creative embellishment?
✅ Does it require source_refs for all claims?
✅ Does it use confidence levels?
✅ Does the Claude prompt reference the research output?
✅ Does it have clear voice guidelines?
✅ Does it forbid inventing facts?
✅ Is there a validation step?

---

## 8. QUALITY ASSURANCE RULES

### Fact-Checking Rules

1. **Every historical claim needs a source**
   - No source = mark as "lore suggests" or "tradition holds"
   
2. **Confidence levels are mandatory**
   - High: Multiple academic sources agree
   - Medium: One reputable source
   - Low: Oral tradition, reconstruction, inference

3. **Claude cannot add facts**
   - Can only rephrase/beautify DeepSeek output
   - Can add emotional resonance, not information

### Voice Consistency Rules

1. **Persona lock fields are required**
   - Props, sensory cues, signature phrases
   
2. **Forbidden phrases are enforced**
   - QA check rejects spells with forbidden terms

3. **Belief mode must be respected**
   - SPIRITUAL: Can reference magic directly
   - PSYCHOLOGICAL: Frame as metaphor/symbol
   - SECULAR: Focus on practical benefits

### Performance Rules

1. **Timeout limits per tier**
   - Quick: 30 second max
   - Standard: 60 second max
   - Deep: 120 second max

2. **Fallback triggers**
   - If DeepSeek fails → use cached research or GPT-4o
   - If Claude fails → use GPT-4o for writing
   - Never fail silently - always deliver a spell

---

## APPENDIX: GUIDE VOICE CONTRACTS

### Shigg (Kitchen Witch)
- Tone: Warm, gentle, practical, cozy
- Props: Kettle, tea, birds at window, worn recipe cards
- Signature: "Love, Shigg", "The kettle's on"
- Never: Dark one, ancient wisdom, thee/thou
- Traditions: British folk magic, kitchen witchery, cunning craft

### Cathleen (Singer of Strength)  
- Tone: Fierce, protective, musical, Irish
- Props: Voice, song, fire, iron
- Signature: References to song, voice as power
- Never: Weak diminutives, over-gentleness
- Traditions: Celtic devotional, protective magic, voice magic

### Katherine (Victorian Spiritualist)
- Tone: Precise, academic, measured, Victorian
- Props: Séance table, correspondence, pen, documentation
- Signature: Academic citations, careful language
- Never: Casual slang, unverified claims presented as fact
- Traditions: Victorian spiritualism, Golden Dawn, SPR methodology

### Theresa (Appalachian Grandmother)
- Tone: Family-focused, practical, root-wise, mountain
- Props: Family photos, root cellar, porch, quilts
- Signature: Family references, "my mother used to say"
- Never: New age terminology, ceremonial magic terms
- Traditions: Appalachian folk magic, family tradition, practical herbalism
