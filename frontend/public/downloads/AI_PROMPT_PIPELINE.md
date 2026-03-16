# WHERE THE CROWLANDS - AI Prompt Pipeline
## Complete 4-Stage Spell Generation System

> **Source files:** `backend/prompts/pipeline_blocks.py`, `archivist.py`, `planner_blocks.py`, `writer_blocks.py`, `qa_blocks.py`

---

## PIPELINE OVERVIEW

```
Stage 1: ARCHIVIST (DeepSeek)  → Research facts, sources, tradition context
Stage 2: PLANNER (GPT-4o)      → Block template, canon anchor, block sequence
Stage 3: WRITER (Claude Sonnet) → Full blocks[] content in guide voice
Stage 4: QA (Programmatic)     → Validate blocks, persona lock, taboos, beliefs
```

### Tier Variations
| Tier | Time | Research | Reasoning | Writer | Storyteller |
|------|------|----------|-----------|--------|-------------|
| QUICK | 15-25s | DeepSeek (800 tokens) | — | Claude Sonnet (1500 tokens) | — |
| STANDARD | 30-45s | DeepSeek (1200 tokens) | — | Claude Sonnet (2500 tokens) | Claude Sonnet (1000 tokens) |
| DEEP | 60-90s | DeepSeek (2000 tokens) | Claude Opus (1500 tokens) | Claude Sonnet (3500 tokens) | Claude Sonnet (1500 tokens) |

---

## STAGE 1: ARCHIVIST (DeepSeek)

### System Prompt

```
You are THE ARCHIVIST for the Crowlands occult folklore app.

## YOUR ROLE
You are a librarian and research assistant. You provide FACTUAL, SOURCED information.
You NEVER roleplay. You NEVER address the user emotionally. You write in a clear, educational tone.

## ABSOLUTE RULES
1. Provide REAL, VERIFIABLE sources where possible (title, author, year)
2. If uncertain about a source, mark it as needs_verification: true
3. Distinguish claim types: "historical" | "folklore" | "modern_occult" | "speculative" | "academic"
4. NO persona voice — no "dear", "seeker", "my child", "warmth", "gentle", "beloved"
5. NO comforting lines or second-person intimacy
6. NO invented quotes from historical figures
7. Output STRICT JSON only — no markdown, no commentary

## SOURCE QUALITY TIERS (assign to each source)
- academic_primary: Peer-reviewed, verified (confidence: high)
- folk_archive: Folklore society collections (confidence: medium)
- practitioner_primary: Historical diaries, grimoires (confidence: medium)
- modern_scholar_practitioner: Academic practitioners (confidence: medium)
- community_tradition: Living oral tradition (confidence: medium)
- speculative_reconstruction: Mark as reconstruction (confidence: low)
- popular_synthesis: Last resort with caveats (confidence: low)

## WHY THIS WORKS - FRAMING PATTERNS
- "Historical practitioners believed {X} worked because {Y}, based on {Z} understanding."
- "Anthropologists note rituals like this serve {function} in community contexts."
- "The symbolic correspondence between {component} and {intent} appears across traditions."
- "Modern cognitive science suggests {sensory_element} influences {mental_state}."
- "This practice aligns with the principle of {magical_concept}, which holds that {explanation}."
- "Materially, {component} contains {property} historically associated with {effect}."

## CANON COMPLIANCE
- If information is NOT in the provided canon lookup, tag it as UNVERIFIED
- Unverified claims must use hedging: "lore suggests", "some traditions hold", "it is believed"
- NEVER present unverified claims as fact

You are a librarian, not a mystic. Be helpful, precise, and honest about uncertainty.
```

### Research Modes
| Mode | Description |
|------|-------------|
| spell_origins | History + folklore + practice rationale |
| source_explainer | Deep dive on specific author/tradition |
| safety_substitutions | Practical swaps + risk notes |
| cross_traditional_analysis | Compare 2-3 traditions, find convergence/divergence |
| material_science_context | Ethnobotanical data, chemical properties |
| ritual_anatomy | Component breakdown (opening, invocation, operation, closing) |
| historical_evolution | Earliest form → key adaptations → modern |
| geographic_variants | Regional variations, environmental influences |
| transmission_analysis | Oral/written paths, preservation gaps |
| contemporary_adaptation | Urban/apartment/digital adaptations |

### Output JSON Schema

```json
{
    "query_understood": "Restatement of seeker's need",
    "research_mode": "spell_origins",
    "facts": [
        {
            "claim": "The factual claim (min 20 chars)",
            "claim_type": "historical|folklore|modern_occult|speculative|academic",
            "confidence": "high|medium|low",
            "source_refs": ["source_id_1"],
            "why_it_works": "Framing pattern explanation",
            "hedging_required": false
        }
    ],
    "sources": [
        {
            "source_id": "unique_id",
            "author": "Author Name",
            "work": "Work Title",
            "year": 1900,
            "quality_tier": "academic_primary|folk_archive|practitioner_primary|...",
            "relevance": "Why this source matters",
            "learn_more_url": "https://verified-url.com"
        }
    ],
    "tradition_context": {
        "primary_tradition": "main tradition",
        "related_traditions": ["related_1"],
        "geographic_origin": "location",
        "time_period": "era",
        "visual_lane": "lane tag"
    },
    "timeline_anchors": [
        {
            "event_id": "id",
            "year": 1888,
            "title": "Event title",
            "relevance": "Why this matters"
        }
    ],
    "material_notes": [
        {
            "material": "name",
            "historical_use": "how used",
            "symbolic_meaning": "represents",
            "safe_substitution": "alternative"
        }
    ],
    "safety_flags": ["any concerns"],
    "unverified_claims": [
        {
            "claim": "unverified claim",
            "why_unverified": "reason",
            "suggested_framing": "hedged phrasing"
        }
    ]
}
```

### Validation Rules
- Minimum 3 facts, maximum 10
- Minimum 2 sources, maximum 6
- Every fact needs at least 1 source_ref
- Valid claim types: historical, folklore, modern_occult, speculative, academic

---

## STAGE 2: PLANNER (GPT-4o)

### Purpose
Takes Archivist research and produces a structured plan for the Writer, including:
- Block sequence matching guide's template
- Canon anchor selection
- Variation tokens for uniqueness
- Micro-lore selection (2-3 items per spell)
- Taboo list injection
- Tarot composition (session-aware, avoids repeats)

### Output JSON Schema

```json
{
    "spell_title": "Evocative title (5-100 chars)",
    "spell_subtitle": "Poetic tagline",
    "guide_id": "shigg|cathleen|katherine|theresa",
    "belief_mode": "SECULAR|SPIRITUAL|PRACTITIONER",
    "template_id": "guide_template_id",

    "canon_anchor": {
        "id": "selected_anchor_id",
        "type": "timeline_event|tradition|figure|practice",
        "title": "Anchor title",
        "year": 1900,
        "relevance": "Why this connects to the query"
    },

    "block_sequence": [
        {
            "block_type": "cold_open",
            "block_id": "cold_open_1",
            "brief": "Opening with X prop and Y sensory detail"
        }
    ],

    "persona_lock": {
        "props": ["prop1", "prop2"],
        "sensory_cue": "one sensory detail",
        "signature_move": "guide's signature action"
    },

    "selected_facts": [{"fact_index": 0, "usage_in_block": "lore_vignette"}],
    "selected_sources": [{"source_id": "...", "usage_in_block": "lore_vignette"}],

    "variation_tokens": {"time_of_day": "dawn", "gesture_type": "circular motion", ...},
    "text_tokens": {"setting_detail": "...", "sensory_detail": "...", ...},

    "micro_lore_selected": ["detail 1", "detail 2"],
    "taboos": ["taboo 1", "taboo 2"],
    "tarot_composition": {"id": "shigg_1", "focal": "...", "frame": "..."},

    "tradition_tags": ["tag1", "tag2"],
    "safety_notes": ["any adaptations"]
}
```

### Critical Planner Rules
1. MUST include a `choice` block (interactive decision point)
2. MUST include a `lore_vignette` block (historical/folkloric story)
3. MUST select exactly ONE canon_anchor most relevant to the query
4. Block sequence MUST match the template for this guide
5. Include persona_lock with 2-3 props identifiable in cold_open
6. The lore_vignette MUST connect to the canon_anchor

---

## STAGE 3: WRITER (Claude Sonnet)

### Purpose
Writes the full spell in the guide's authentic voice, producing a complete `blocks[]` array.

### Block Types Reference

| Block Type | Required For | Key Fields |
|------------|-------------|------------|
| `cold_open` | All guides | greeting, scene_setting, hook, persona_markers |
| `materials` | All guides | items (name, purpose, substitution, optional), gathering_note |
| `safety_note` | Katherine (required), others optional | safety considerations |
| `choice` | All guides (REQUIRED) | prompt, options (id, label, description, affects), consequence_hint |
| `lore_vignette` | All guides (REQUIRED) | title, narrative (100+ words), era, tradition, canon_anchor_id |
| `stepper` | All guides | steps (action, spoken_words, why, duration_hint, checkpoint), completion_message |
| `reflection` | Katherine, optional for others | prompts, guide_note, log_fields |
| `closing` | All guides | license_to_depart, grounding_action, empowerment_line, next_steps_hint |
| `bird_oracle` | Shigg, Theresa | bird_name, oracle_message, observation_prompt |
| `journal_prompt` | Shigg, Theresa | journal questions |
| `song_prompt` | Cathleen | humming/vocalization instruction |
| `ward` | Cathleen | ward_name, creation_steps, activation_phrase |
| `evidence_card` | Theresa | known, likely, lore, pattern_note |

### Tarot Card Structure
Every spell includes a tarot card summary:
```json
{
    "title": "Short evocative title (3-5 words)",
    "symbol": "A single emoji",
    "essence": "Core purpose (under 15 words)",
    "key_action": "Most important action (under 20 words)",
    "incantation": "Brief phrase of power (under 15 words)",
    "timing": "When to perform",
    "warning": "Caution if needed, or null"
}
```

### Critical Writer Rules
1. `choice` block REQUIRED — must have 2-4 genuine options
2. `lore_vignette` block REQUIRED — must be 100+ words, connect to canon_anchor
3. `cold_open` must establish persona in first 3 lines via persona_markers
4. `stepper` steps must each have `why` field (20+ chars) citing research
5. ALL blocks must be in guide's authentic voice
6. Use 2-3 signature phrases naturally across blocks
7. Address seeker by name at least twice (cold_open and closing)
8. MUST include at least 2 micro-lore details
9. MUST use the text_tokens (setting_detail, sensory_detail, gesture_detail)
10. MUST NOT include any taboo themes/imagery

### Belief Mode Framing

**SECULAR:**
> Frame all blocks as psychological exercises. In lore_vignette: present history as cultural context, not magical truth. In stepper 'why': use cognitive/behavioral explanations.

**SPIRITUAL:**
> Balance grounded practice with openness to mystery. In lore_vignette: present as living tradition with practical wisdom. In stepper 'why': blend psychological with symbolic explanations.

**PRACTITIONER:**
> Speak directly about magic and energy work. In lore_vignette: assume familiarity with tradition. In stepper 'why': use technical magical language.

### Time Guidance
| Time | Depth |
|------|-------|
| 2 min | QUICK: 5-6 blocks, 3 steps, 100-word lore |
| 5 min | BRIEF: 6-7 blocks, 3-4 steps, 120-word lore |
| 10 min | FOCUSED: 7-8 blocks, 4-5 steps, 150-word lore |
| 20 min | MODERATE: 8-9 blocks, 5-6 steps, 200-word lore |
| 30 min | FULL: 9-10 blocks, 6-7 steps, 250+-word lore |

---

## STAGE 4: QA (Programmatic Validation)

### Check Categories

**CRITICAL (any failure = REWRITE_REQUIRED):**
1. Required blocks exist (cold_open, choice, lore_vignette, stepper, closing)
2. Choice block has 2+ valid options with prompt
3. Lore vignette is 100+ chars with canon_anchor_id
4. Persona lock has 2+ props, sensory_cue, signature_move
5. Blocks match guide's template

**HIGH (2+ failures = REWRITE_REQUIRED):**
6. Stepper steps have 'why' explanations (20+ chars each)
7. Canon anchor present with ID and relevance
8. Hard limits pass (no forbidden phrases, no coercion)
9. Belief mode compliance
10. Guide voice compliance (no forbidden phrases)
11. Taboo keyword check

### Verdict Logic
```
if critical_violations > 0:  → REWRITE_REQUIRED
elif high_violations >= 2:   → REWRITE_REQUIRED
else:                        → APPROVED
```

### Rewrite Process
If QA fails, the Writer is called again with fix instructions appended to the original prompt. Only 1 retry is attempted. If retry also fails, a fallback spell is returned.

### JSON Repair
If Writer output has JSON parse errors:
1. Try direct parse after cleaning markdown wrapping
2. If that fails, send to GPT-4o-mini for repair (single pass)
3. If repair fails, return fallback spell

---

## FALLBACK SPELL

When all stages fail, a minimal valid spell is returned with:
- Title: "A Moment of Intention"
- 6 blocks: cold_open, materials, choice, lore_vignette, stepper, closing
- Generic but valid content
- `_fallback: true` flag in output
- Reason logged in `_fallback_reason`

---

*Generated from backend/prompts/ directory — pipeline_blocks.py, archivist.py, planner_blocks.py, writer_blocks.py, qa_blocks.py*
