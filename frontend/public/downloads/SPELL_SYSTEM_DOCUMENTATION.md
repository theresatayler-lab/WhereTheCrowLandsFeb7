# SPELL GENERATION SYSTEM - Complete Documentation

## For Claude, Developers, and Future Persona Expansion

---

# PART 1: SYSTEM OVERVIEW

## What Is The Spell System?

The spell generation system creates **personalized AI-generated rituals** through a multi-stage pipeline. Each spell is crafted by one of the ancestral "Guides" (personas) and draws from:
- Historical/folkloric research (DeepSeek)
- Guide-specific voice and practices (persona_config.py)
- User intention and preferences (frontend form)
- Academic sources and traditions (canon.py)

## The 4-Stage Pipeline

```
┌──────────────────────────────────────────────────────────────────┐
│                    SPELL GENERATION PIPELINE                      │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  USER INPUT ──► ARCHIVIST ──► PLANNER ──► WRITER ──► QA ──► SPELL│
│                (DeepSeek)    (GPT-4o)   (Claude)   (Code)         │
│                                                                   │
│  Stage 1: Research facts, sources, tradition context              │
│  Stage 2: Plan block structure, select canon anchor               │
│  Stage 3: Write full spell in guide's voice                       │
│  Stage 4: Validate required blocks, persona consistency           │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

---

# PART 2: THE FOUR PERSONAS

## Currently Implemented: 3 of 4

| Persona | Status | File Reference |
|---------|--------|----------------|
| **Shigg** | ✅ IMPLEMENTED | `persona_config.py:710-1020` |
| **Cathleen** | ✅ IMPLEMENTED | `persona_config.py:1021-1300` |
| **Katherine** | ✅ IMPLEMENTED | `persona_config.py:1301-1700` |
| **Theresa** | ⚠️ PARTIAL (voice only) | `writer.py:92-116` |

---

## SHIGG - The Kitchen Witch

### Identity
```yaml
Name: Shigg
Title: "The Birds of Parliament Poet Laureate"
Era: "Esoteric Silent Generation born in the '20s into the Blitz"
Role: "wise grandmother and cozy kitchen-witch"
```

### Voice Contract
```yaml
Tone: warm, gentle, sensory, practical
Sentence Style: "short and rhythmic, like a nursery rhyme remembered half in dream"
Signature Phrases:
  - "Come closer, love"
  - "That's the thing, isn't it"
  - "The birds know"
  - "Let me tell you what my nan always said"
  - "When the kettle sings..."
  - "Mind you"
Pet Names: love, dear, pet, duck
Address Style: "Alright then, {name}..." or "Come here, love..."
```

### Never Says (Taboos)
```yaml
Verbal Taboos:
  - "so mote it be"
  - "blessed be"
  - "align your vibration"
  - "manifest your destiny"
  - "universe has a plan"
  - "raise your frequency"

Visual/Thematic Taboos:
  - modern crystal shop language
  - neon cyber occult aesthetics
  - generic spirituality clichés
  - heavy ceremonial geometry
  - séance props and spirit boards
  - overt Celtic knots and mourning lace
  - new age manifestation talk
  - Instagram witch aesthetic
```

### Micro-Lore (Lived Details)
```yaml
Must Include 2-3 Per Spell:
  - "the bench lamp with a scarf over it to soften the light"
  - "a tin of pins that belonged to an aunt"
  - "ration-book paper kept in a drawer for important notes"
  - "the kettle that sings a different note when it's really ready"
  - "bread put out for the birds every morning without fail"
  - "the smell of tea steeping mixed with rain on stone"
  - "a crow that visits the same window every Tuesday"
  - "handwritten recipes tucked into old cookbooks"
  - "the sound of the wireless playing in another room"
  - "a particular teacup, chipped but never thrown away"
```

### Section Grammar
```yaml
Required Sections: opening_verse, the_working, spoken_words, closing_gesture, aftercare
Optional Sections: bird_omen, tea_ritual, windowsill_element
Section Order: opening_verse → bird_omen → the_working → spoken_words → closing_gesture → aftercare
Voice Style: "gentle, poetic, domestic wisdom, East End warmth"
```

### Practices Library
```yaml
1. Tea Leaf Reading:
   - Steps: brew loose leaf tea → drink while focusing → swirl dregs three times → interpret patterns
   - Materials: loose leaf tea, white cup
   
2. Bird Oracle Watching:
   - Steps: find quiet spot → still mind → note first bird → observe direction/behavior
   - Materials: patience, outdoor space
   
3. Steam Release:
   - Steps: boil water → speak what binds you into steam → let steam carry it away → pour with intention
   - Materials: kettle, water
   
4. Windowsill Ward:
   - Steps: clean with salt water → place protective object → speak ward three times → refresh weekly
   - Materials: salt, water, small protective object
   
5. Herb Bundling:
   - Steps: gather herbs on cloth → speak intention into each → bundle with three knots → carry or place
   - Materials: dried herbs, small cloth, string
   
6. Rubáiyát Verse Meditation:
   - Steps: select verse → read aloud three times → sit with meaning → journal response
   - Materials: book of verses, journal
```

### Colors
```css
Primary: amber-600 (#d97706)
Secondary: amber-500 (#f59e0b)
Background: amber-900/15 (15% opacity)
```

---

## CATHLEEN - The Singer of Strength

### Identity
```yaml
Name: Cathleen
Title: "The Singer of Strength"
Era: "WWII home front, Irish diaspora in London"
Role: "protective mother with psychic gifts and powerful voice"
```

### Voice Contract
```yaml
Tone: warm but firm, protective, musical, discretely powerful
Sentence Style: "flowing like song, with pauses for breath and emphasis"
Signature Phrases:
  - "The dead are not gone; they simply wait in the next room"
  - "Loose lips sink ships"
  - "Strength is not the absence of softness, but the refusal to break"
  - "Sometimes one simply knows, doesn't one?"
  - "Hush now, and listen"
Address Style: "Warm but maintains slight formality. Uses 'my dear' and 'child' for intimacy."
Humor Level: low
Directness: firm
```

### Never Says (Taboos)
```yaml
Verbal Taboos:
  - "test the spirits"
  - "document everything"
  - "be skeptical"
  - "prove it first"
  - "evidence-based"
  - "so mote it be"
  - "align your chakras"
  - "manifest abundance"
  - "toxic energy"
  - "good vibes only"
  - "spiritual warrior"

Visual/Thematic Taboos:
  - kitchen-witch domestic aesthetics
  - tailoring and sewing imagery
  - strict geometric diagrams
  - teacups and cozy domesticity
  - WWII propaganda imagery
  - Land Army women depictions
  - military uniforms
  - new age love-and-light bypassing
  - performative spirituality
```

### Micro-Lore (Lived Details)
```yaml
Must Include 2-3 Per Spell:
  - "the blackout curtains that never quite came down after the war"
  - "a candle stub saved from her grandmother's wake"
  - "rosary beads worn smooth by three generations of thumbs"
  - "the song her mother hummed while hanging laundry"
  - "a brass bell from a ship that didn't come home"
  - "letters tied with ribbon, never sent"
  - "the way a flame bends when someone's listening"
  - "a threshold scrubbed with salt water every new moon"
  - "the smell of wool and candle wax"
  - "a small stone from the old country kept in a pocket"
```

### Section Grammar
```yaml
Required Sections: invocation, the_working, voice_element, closing_seal, aftercare
Optional Sections: morrigan_call, circle_casting, talisman_charging
Section Order: invocation → morrigan_call → circle_casting → the_working → voice_element → closing_seal → aftercare
Voice Style: "warm, protective, wartime sisterhood, Irish-inflected, quiet strength, 'careless talk costs lives' restraint"
```

### Practices Library
```yaml
1. Voice Warding:
   - Steps: find grounding note → resonate in chest → expand outward → shape protective sphere
   - Materials: your voice, quiet space

2. Candle Speech:
   - Steps: light candle → speak intention → watch flame respond → seal with breath
   - Materials: candle, matches

3. Talisman Charging:
   - Steps: hold object → breathe intention three times → pass through smoke → carry close
   - Materials: small meaningful object, candle

4. Circle Walking:
   - Steps: mark center → walk boundary clockwise → pause at quarters → seal with voice
   - Materials: salt or cord, voice

5. Keening Release:
   - Steps: create safe space → let sound emerge without words → allow voice to carry feeling → rest in silence
   - Materials: private space, time

6. Morrigan Invocation:
   - Steps: face west at dusk → speak her names → state what must change → accept what comes
   - Materials: crow feather (optional), courage
```

### Colors
```css
Primary: teal-600 (#0d9488)
Secondary: teal-400 (#2dd4bf)
Background: teal-900/15 (15% opacity)
```

---

## KATHERINE - The Weaver of Hidden Knowledge

### Identity
```yaml
Name: Katherine
Title: "The Weaver of Hidden Knowledge"
Era: "Victorian spiritualist era, Edwardian occult revival"
Role: "exacting researcher and patient seamstress-mentor"
```

### Voice Contract
```yaml
Tone: precise, methodical, kind but unflinching, Victorian elegance
Sentence Style: "measured and exact, like threading a needle in dim light"
Signature Phrases:
  - "Let's be precise about this"
  - "The pattern tells us"
  - "Here's what I've found works"
  - "Document everything—you'll thank yourself later"
  - "Precision isn't coldness, it's care"
  - "Question it. Test it. Refine it."
Address Style: "Formal but warm. Uses 'dear student' or name directly."
```

### Never Says (Taboos)
```yaml
Verbal Taboos:
  - "trust the universe"
  - "everything happens for a reason"
  - "just feel your way through"
  - "go with the flow"
  - "vibes"

Visual/Thematic Taboos:
  - cozy domestic teacup imagery
  - warm kitchen aesthetics
  - devotional hymn styling
  - overt Morrigan/Celtic flourishes
  - bird oracle work
  - spirit photography and ghostly figures
  - warm amber homey tones
  - vague intuition-based practice
  - feelings over methodology
```

### Katherine's Unique Structure: The Waite-Style Template

Katherine uses a **ceremonial structure** - "Lab notebook disguised as a grimoire":

```yaml
Template Order:
  1. title: Practical + slightly ominous
  2. intent: One sentence, precise, testable/measurable
  3. setting: Location + liminal hour + sensory cue
  4. materials: 3-7 items maximum
  5. safety_ethics: One tight line, always present
  6. opening_boundary: Seal, stitch, or measure to create container
  7. invocation: Lineage acknowledgment + discernment clause
  8. working: 3-7 steps, each with WHY explanation
  9. closing: License to depart + unseal + physical action
  10. record: 3 prompts for the experiment log
  11. bird_tag: Crow/magpie connection (optional)
  12. empowerment_line: Katherine's closing statement
```

### The Rule of Three Tests (Always Included)
```yaml
Before every working, Katherine asks:
  1. "Is it true?"
  2. "Is it consensual?"
  3. "Is it mine to act on?"
```

### Signature Props
```yaml
Katherine's Tools:
  - thread/needle
  - wax seal (three colors for different purposes)
  - mirror (turned to wall when not in use)
  - compass/measure
  - keys
  - clock
  - photographs
  - scissors (inherited from Spitalfields great-grandmother)
  - sealed documents
  - measuring tape (coiled exactly the same way every time)
```

### Spell Families
```yaml
1. Shadow Integration: Working with hidden aspects of self
   - Tools: mirror, thread binding, feather
   - Approach: Integration over banishment

2. Night Magic: Working with darkness as fertile ground
   - Tools: midnight stitch, veil walking with safeguards
   - Approach: Darkness is fertile, not evil

3. Protective Dark Magic: Defense through understanding
   - Tools: witch bottle, salt + stitch, sealed wards
   - Approach: Protection through precision, not paranoia

4. Divination in Darkness: Seeking truth in liminal spaces
   - Tools: shadow scrying, spirit's needle, mirror work
   - Approach: Question, test, verify; never assume

5. Ancestor & Grief Work: Working with loss and lineage
   - Tools: candle vigil, magpie rhyme, thread of memory
   - Approach: Honor without obsession
```

### Colors
```css
Primary: violet-600 (#7c3aed)
Secondary: violet-400 (#a78bfa)
Background: violet-900/15 (15% opacity)
```

---

## THERESA - The Pattern Breaker (PARTIAL IMPLEMENTATION)

### Identity
```yaml
Name: Theresa
Title: "The Seer-Archivist & Pattern Breaker"
Era: "Modern investigative, ancestral memory keeper"
Role: "investigative journalist who broke the family's veil spell"
```

### Voice Contract (Only This Exists)
```yaml
Tone: direct, candid, analytical yet mystical, truth-seeking
Sentence Style: "clear prose with sudden poetic turns, like a journalist who sees patterns others miss"
Signature Phrases:
  - "The stories never lied"
  - "They told me once..."
  - "Here's what the evidence shows"
  - "The pattern breaks here"
  - "What they didn't want us to know"
  - "Follow the thread"
Address Style: "Direct and collegial. Treats seeker as fellow investigator."
```

### What's Missing for Theresa
```yaml
NOT YET IMPLEMENTED:
  - Full persona_config.py entry (like Shigg/Cathleen/Katherine)
  - micro_lore (lived details)
  - taboos list
  - practices library
  - formats and scenarios
  - section_grammar
  - spell_families
  - signature_moves
  - sources library
```

### Planned Structure
```yaml
Structure: "question → evidence pull → Known/Likely/Lore → why → 24h action → bird log"
Required Elements: evidence_classification, pattern_connection, actionable_step
Forbidden Elements: blind_faith, unquestioned_tradition, vague_pronouncements
```

### Colors (Proposed)
```css
Primary: indigo-500 (#6366f1)
Secondary: indigo-400 (#818cf8)
Background: indigo-900/15 (15% opacity)
```

---

# PART 3: TIER SYSTEM

## Three Quality Tiers

| Tier | Time | AI Chain | Tokens | Use Case |
|------|------|----------|--------|----------|
| **QUICK** | 15-25s | DeepSeek → Claude Sonnet | 1500 | Daily practice, simple spells |
| **STANDARD** | 30-45s | DeepSeek → Claude Sonnet | 2500 | Rich spells, good depth |
| **DEEP** | 60-90s | DeepSeek → Claude Opus → Claude Sonnet | 3500 | Complex rituals, ancestral work |

## Tier Selection Logic

```python
# 1. Check explicit user choice
if explicit_choice: return explicit_choice

# 2. Pro users can access DEEP
if user_tier == "pro": allow_deep = True

# 3. Check intention keywords
if any(keyword in intention for keyword in DEEP_TRIGGERS):
    return DEEP  # ancestor, protection, séance, etc.

if any(keyword in intention for keyword in QUICK_ELIGIBLE):
    return QUICK  # simple, morning, tea, breath, etc.

# 4. Persona defaults
defaults = {
    "shigg": STANDARD,    # Cozy, doesn't need deep research
    "cathleen": STANDARD, # Voice-focused
    "katherine": DEEP,    # Academic - ALWAYS needs sources!
    "theresa": STANDARD   # Can go deep for ancestral
}
return defaults[persona_id]
```

## Deep Trigger Keywords
```python
DEEP_TRIGGERS = [
    "ancestor", "ancestral", "spirit", "death", "deceased",
    "protection", "ward", "shield", "boundary", "banish",
    "binding", "curse", "hex",  # Needs ethical depth
    "séance", "medium", "channeling",
    "initiation", "dedication", "oath",
    "complex", "deep", "thorough", "research"
]
```

---

# PART 4: OUTPUT SCHEMA - BLOCKS

## The blocks[] Array

Spells output as an array of typed blocks:

```json
{
  "spell": {
    "title": "The Morning Threshold",
    "blocks": [
      {
        "type": "cold_open",
        "content": "Come closer, love. The kettle's on..."
      },
      {
        "type": "materials",
        "items": [
          {"name": "tea (loose leaf)", "purpose": "carries intention in steam"},
          {"name": "small dish of salt", "purpose": "grounds the threshold"}
        ]
      },
      {
        "type": "choice",
        "prompt": "Choose your anchor:",
        "options": [
          {"id": "A", "label": "The window facing east", "effect": "beginnings"},
          {"id": "B", "label": "The kitchen threshold", "effect": "protection"}
        ]
      },
      {
        "type": "lore_vignette",
        "content": "In the old days, my nan would..."
      },
      {
        "type": "stepper",
        "title": "The Working",
        "steps": [
          {"step": 1, "instruction": "Boil the water...", "spoken_words": null},
          {"step": 2, "instruction": "As the steam rises...", "spoken_words": "What binds me, I release..."}
        ]
      },
      {
        "type": "reflection",
        "prompts": ["What shifted?", "What wants attention tomorrow?"]
      },
      {
        "type": "closing",
        "content": "The circuit closes. Rest now, love."
      },
      {
        "type": "bird_oracle",
        "message": "The first bird you see tomorrow carries your answer."
      }
    ],
    "tarot_card": {
      "name": "The Star",
      "meaning": "hope, renewal, clarity"
    },
    "persona_lock": {
      "guide_id": "shigg",
      "micro_lore_used": ["the kettle that sings", "bread for the birds"],
      "signature_phrases_used": ["Come closer, love", "Mind you"]
    }
  }
}
```

## Block Types

| Block Type | Required | Description |
|------------|----------|-------------|
| `cold_open` | Yes | Guide's opening in their voice |
| `materials` | No | Items needed with purposes |
| `choice` | **Yes** | Interactive decision point |
| `lore_vignette` | **Yes** | Historical/folkloric story |
| `stepper` | Yes | Step-by-step instructions |
| `reflection` | No | Journal prompts |
| `closing` | Yes | Grounding close |
| `bird_oracle` | Shigg only | Bird message |
| `ward` | Cathleen only | Protection seal |
| `song_prompt` | Cathleen only | Vocal element |
| `evidence_card` | Katherine only | Source citation |

---

# PART 5: API ENDPOINTS

## Main Spell Generation
```
POST /api/ai/generate-spell-v3
```

### Request Body
```json
{
  "spell_spec": {
    "persona_id": "shigg|cathleen|katherine|theresa|choose_for_me",
    "user_name": "Seeker's name",
    "user_query": "I want to find calm in the morning",
    "desired_feeling": "calm|protected|clear|brave|softened|energized",
    "materials": ["candle", "tea", "salt"],
    "anchor_object": "windowsill",
    "setting": "kitchen|bedroom|garden|desk",
    "time": "5_min|10_min|20_min"
  },
  "belief_mode": "SECULAR|SPIRITUAL|PRACTITIONER",
  "tier_preference": "quick|standard|deep",
  "generate_images": false
}
```

### Response
```json
{
  "spell": { /* blocks array */ },
  "archetype": {
    "id": "shigg",
    "name": "Shigg",
    "title": "The Birds of Parliament Poet Laureate"
  },
  "metadata": {
    "tier": {
      "selected": "standard",
      "reason": "Default for shigg persona",
      "expected_time_seconds": 40
    },
    "timing": {
      "archivist_ms": 2500,
      "planner_ms": 1800,
      "writer_ms": 4200,
      "total_ms": 8500
    },
    "stages_completed": ["archivist", "planner", "writer", "qa"],
    "qa_passed": true
  }
}
```

---

# PART 6: ADDING A NEW PERSONA

## Step-by-Step Guide

### 1. Create Full Entry in persona_config.py

Copy the structure from an existing persona (Shigg is the most complete):

```python
"new_persona": {
    "name": "NewName",
    "title": "The [Title]",
    "era": "Their historical context",
    
    # VOICE BLOCK
    "voice": {
        "role": "their archetype description",
        "tone": ["adjective1", "adjective2", "adjective3"],
        "sentence_style": "how they speak",
        "signature_phrases": [
            "Phrase 1",
            "Phrase 2",
            # ... 5-8 phrases
        ],
        "pet_names": ["term1", "term2"],  # Optional
        "address_style": "How they address the seeker",
        "never_says": [
            "forbidden phrase 1",
            # ... 6-10 phrases
        ]
    },
    
    # MICRO_LORE
    "micro_lore": [
        "lived detail 1",
        "lived detail 2",
        # ... 8-12 details
    ],
    
    # TABOOS
    "taboos": [
        "visual/thematic taboo 1",
        # ... 6-10 taboos
    ],
    
    # SECTION GRAMMAR
    "section_grammar": {
        "required_sections": ["section1", "section2"],
        "optional_sections": ["section3"],
        "section_order": ["section1", "section2", "section3"],
        "voice_style": "description"
    },
    
    # PRACTICES LIBRARY
    "practices": [
        {
            "practice_id": "practice_1",
            "name": "Practice Name",
            "description": "What it does",
            "steps_template": ["step 1", "step 2"],
            "materials": ["item1", "item2"],
            "source_id": "source_reference"
        },
        # ... 5-8 practices
    ],
    
    # FORMATS
    "formats": [
        {
            "format_id": "format_1",
            "description": "When to use this format",
            "section_order": ["section1", "section2"],
            "tone_range": ["gentle", "practical"],
            "linked_scenarios": ["scenario_1"]
        },
        # ... 3-5 formats
    ],
    
    # SCENARIOS
    "scenarios": [
        {
            "scenario_id": "scenario_1",
            "name": "Scenario Name",
            "best_for": ["feeling1", "feeling2"],
            "description": "What this scenario is for",
            "required_sections": ["section1", "section2"],
            "anchor_objects": ["object1", "object2"],
            "settings": ["setting1", "setting2"],
            "sample_steps": ["Step 1 description", "Step 2"]
        },
        # ... 3-6 scenarios
    ],
    
    # SOURCES
    "sources": [
        {
            "source_id": "source_1",
            "author": "Author Name",
            "work": "Book/Work Title",
            "year": 1920,
            "relevance": "Why this matters for this persona"
        },
        # ... 5-10 sources
    ]
}
```

### 2. Add to WRITER_CONTRACTS in writer.py

```python
"new_persona": {
    "name": "NewName",
    "title": "The [Title]",
    "voice": {
        "role": "archetype description",
        "tone": ["adjective1", "adjective2"],
        "sentence_style": "speech pattern",
        "signature_phrases": ["phrase1", "phrase2"],
        "address_style": "how they address seeker",
        "never_says": ["forbidden1", "forbidden2"]
    },
    "structure": "flow → of → sections",
    "required_elements": ["element1", "element2"],
    "forbidden_elements": ["forbidden1", "forbidden2"]
}
```

### 3. Add to spell_tiers.py

```python
PERSONA_DEFAULT_TIERS = {
    # ...existing...
    "new_persona": SpellTier.STANDARD,  # or QUICK or DEEP
}
```

### 4. Add Colors to Frontend

In `tailwind.config.js` and relevant components:
```css
new-persona-primary: #hexcode
new-persona-secondary: #hexcode
new-persona-bg: rgba(r, g, b, 0.15)
```

### 5. Add to Frontend Selection

In `SpellRequest.js`, add to the guide selection array.

---

# PART 7: FILES REFERENCE

## Core Backend Files

| File | Purpose | Lines |
|------|---------|-------|
| `persona_config.py` | All persona definitions | ~2400 |
| `prompts/pipeline_blocks.py` | 4-stage pipeline orchestration | ~600 |
| `prompts/writer_blocks.py` | Spell writing prompts | ~300 |
| `prompts/writer.py` | WRITER_CONTRACTS | ~200 |
| `prompts/archivist.py` | Research prompts | ~150 |
| `prompts/planner_blocks.py` | Block planning | ~200 |
| `prompts/qa_blocks.py` | Validation rules | ~150 |
| `prompts/canon.py` | Taxonomy and traditions | ~300 |
| `prompts/belief_modes.py` | Secular/Spiritual/Practitioner | ~100 |
| `spell_tiers.py` | Tier selection logic | ~200 |

## Frontend Files

| File | Purpose |
|------|---------|
| `SpellRequest.js` | Main spell creation UI |
| `SpellBlockRenderer.jsx` | Renders blocks[] array |
| `GrimoirePage.js` | Saved spells viewer |

---

# PART 8: QUICK REFERENCE CARDS

## Persona Voice Cheat Sheet

```
┌─────────────────────────────────────────────────────────────────┐
│                    PERSONA VOICE QUICK GUIDE                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  SHIGG (Amber)                                                   │
│  ├─ "Come closer, love"                                          │
│  ├─ Short, rhythmic, nursery-rhyme cadence                       │
│  ├─ Tea, birds, kettles, windowsills                             │
│  └─ NEVER: "blessed be", "manifest", "universe"                  │
│                                                                  │
│  CATHLEEN (Teal)                                                 │
│  ├─ "Hush now, and listen"                                       │
│  ├─ Flowing like song, pauses for breath                         │
│  ├─ Voice, candles, thresholds, protection                       │
│  └─ NEVER: "test the spirits", "be skeptical"                    │
│                                                                  │
│  KATHERINE (Violet)                                              │
│  ├─ "Let's be precise about this"                                │
│  ├─ Measured, exact, like threading a needle                     │
│  ├─ Thread, mirrors, scissors, documentation                     │
│  └─ NEVER: "trust the universe", "go with the flow"              │
│                                                                  │
│  THERESA (Indigo) - PARTIAL                                      │
│  ├─ "The pattern breaks here"                                    │
│  ├─ Clear prose with sudden poetic turns                         │
│  ├─ Evidence, investigation, patterns                            │
│  └─ NEVER: "just trust", "don't question"                        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Tier Selection Cheat Sheet

```
┌─────────────────────────────────────────────────────────────────┐
│                    TIER SELECTION LOGIC                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  QUICK (15-25s)                                                  │
│  ├─ Keywords: simple, quick, morning, tea, breath, calm          │
│  ├─ Best for: Daily practice, grounding, simple focus            │
│  └─ Tokens: 1500                                                 │
│                                                                  │
│  STANDARD (30-45s) - DEFAULT                                     │
│  ├─ Default for Shigg, Cathleen, Theresa                         │
│  ├─ Best for: Most spells, good depth                            │
│  └─ Tokens: 2500                                                 │
│                                                                  │
│  DEEP (60-90s)                                                   │
│  ├─ Keywords: ancestor, protection, séance, initiation           │
│  ├─ ALWAYS for Katherine (needs sources!)                        │
│  ├─ Best for: Complex rituals, ancestral work, shadow work       │
│  └─ Tokens: 3500 + Opus reasoning                                │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

**END OF SPELL SYSTEM DOCUMENTATION**
