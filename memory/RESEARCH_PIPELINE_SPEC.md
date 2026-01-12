# Research Pipeline Contracts v1.0
## DeepSeek → OpenAI Separation Spec (PREP ONLY — NOT IMPLEMENTED)

> **Status:** SPEC ONLY — Do not implement until session persistence + visual polish are signed off.

---

## 1. Architecture Overview

```
User Request
     ↓
Spell Planner (light logic — selects persona, tools, tradition)
     ↓
DeepSeek Research Pass (facts only — NO persona voice)
     ↓
Research Object (structured JSON)
     ↓
OpenAI Persona Writer (voice only — NO new historical claims)
     ↓
Final Spell (with cited, explained references)
```

### Hard Rules
- 🔴 **OpenAI never queries DeepSeek directly** — backend orchestrates
- 🔴 **DeepSeek never sees persona voice** — receives stripped research brief
- 🔴 **OpenAI never invents sources** — can only cite from Research Object

---

## 2. Research Brief JSON Schema (What DeepSeek Receives)

```json
{
  "$schema": "research_brief_v1",
  "research_goal": "string — plain language description of what to research",
  "practice_type": "string — e.g., 'protective binding', 'comfort ritual', 'divination'",
  "tools": ["array of strings — physical objects used in the ritual"],
  "tradition_focus": [
    "array of strings — historical/cultural lenses to apply",
    "e.g., 'British folk magic', 'Victorian spiritualism', 'Celtic tradition'"
  ],
  "persona_context": "string — which persona for tradition alignment (NOT voice)",
  "era_constraints": {
    "primary": "string — e.g., '1880-1950 Britain'",
    "secondary": "string — optional broader context"
  },
  "constraints": {
    "no_modern_psychology": true,
    "no_invented_traditions": true,
    "cite_historical_figures": true,
    "require_verifiable_sources": true
  }
}
```

### What DeepSeek Should NOT Receive
- Full spell text
- Persona voice or emotional language
- Flowery/poetic language
- User's personal details

---

## 3. Research Object JSON Schema (What DeepSeek Returns)

```json
{
  "$schema": "research_object_v1",
  "core_explanation": "string — dry, factual summary of the practice's historical basis",
  "historical_examples": [
    {
      "source_id": "string — unique identifier matching SOURCE_ENCYCLOPEDIA",
      "author": "string",
      "work": "string — book/paper title",
      "concept": "string — specific idea or practice referenced",
      "era": "string — time period",
      "relevance": "string — why this matters to the research goal"
    }
  ],
  "tool_rationale": {
    "tool_name": {
      "historical_use": "string — how this tool was traditionally used",
      "symbolic_meaning": "string — what it represents",
      "source_reference": "string — source_id that supports this"
    }
  },
  "tradition_notes": "string — broader context about the tradition",
  "sources": [
    {
      "source_id": "string",
      "author": "string",
      "work": "string",
      "year": "number or null",
      "type": "book | paper | tradition | practice",
      "public_links": [
        {
          "url": "string — must be real, verifiable URL",
          "type": "archive | wikipedia | goodreads | jstor | publisher",
          "access": "free | preview | paid | suggested_lookup"
        }
      ]
    }
  ],
  "confidence_level": "well-documented | moderately-documented | folk-tradition | speculative",
  "warnings": ["array of strings — any caveats about historical accuracy"]
}
```

### What DeepSeek Should NOT Return
- Poetry or emotional language
- "Dear seeker" or persona voice
- Reassurances or comfort
- Invented sources or unverifiable claims

---

## 4. Allowed Sources + Link Policy

### Source Requirements
1. **All sources must be from SOURCE_ENCYCLOPEDIA** (defined in persona_config.py) or verifiable additions
2. **Links must be real** — no hallucinated URLs
3. **If no link exists**, mark as `"access": "suggested_lookup"` with search guidance

### Allowed Link Domains (Allowlist)
```
archive.org
wikipedia.org
goodreads.com
jstor.org
worldcat.org
sacred-texts.com
british-history.ac.uk
bl.uk (British Library)
theosophical.org
hermetics.org
amazon.com (for book references)
```

### Link Types
| Type | Description |
|------|-------------|
| `archive` | Full text freely available |
| `wikipedia` | Overview/summary article |
| `goodreads` | Book info + reviews |
| `jstor` | Academic paper (may require login) |
| `publisher` | Publisher page for purchase |
| `suggested_lookup` | No direct link — provide search terms |

---

## 5. Prompt Templates

### 5a. DeepSeek System Prompt (Dry Archivist)

```
You are a scholarly research assistant specializing in folk magic, domestic ritual traditions, British mysticism, and historical occult practices.

YOUR ROLE:
- Provide factual, well-researched information about magical traditions
- Cite historical figures, texts, and practices with precision
- Explain WHY tools and practices were used historically
- Return structured JSON only

YOUR CONSTRAINTS:
- NO emotional language or reassurance
- NO persona voice ("dear seeker", "my child", etc.)
- NO invented traditions or fabricated sources
- NO modern psychological framing unless explicitly requested
- If uncertain, state confidence level as "speculative" or "folk-tradition"

CITATION RULES:
- Every claim must trace to a source
- Sources must be real (books, papers, documented traditions)
- If you cannot verify a source, mark confidence as lower
- Prefer primary sources over secondary when possible

OUTPUT FORMAT:
Return valid JSON matching the research_object schema. No markdown, no commentary outside the JSON.
```

### 5b. DeepSeek User Prompt Template

```
RESEARCH BRIEF:
{research_brief_json}

Return a research_object JSON with:
1. core_explanation — dry factual summary
2. historical_examples — at least 2 relevant sources with specific concepts
3. tool_rationale — why each tool is historically significant
4. tradition_notes — broader context
5. sources — full citation info with real links where available
6. confidence_level — how well-documented this practice is

Remember: NO persona voice, NO poetry, NO invented sources.
```

### 5c. OpenAI System Prompt (Persona Teacher)

```
You are {persona_name}, a guide in Where The Crowlands.

YOUR ROLE:
- Speak in your authentic voice (warm, teaching, personal)
- Explain the spell's elements as if teaching a careful apprentice
- Connect historical facts to the seeker's intention
- Make the "why" meaningful and accessible

YOUR CONSTRAINTS:
- You MUST use the Research Object provided — do not invent new historical claims
- Every "why this tool" must trace back to the research_object
- You may soften language but NOT change facts
- You may add emotional warmth but NOT fabricate sources
- If the research says "speculative", communicate appropriate uncertainty

REFERENCE RULES:
- The "Inspired By" section must only cite sources from the research_object
- Each reference needs a "connection_to_spell" explaining relevance
- Links come from research_object only — do not generate new URLs

FORBIDDEN:
- Inventing historical figures or texts not in research_object
- Claiming certainty about speculative traditions
- Adding sources that weren't provided in research_object
```

### 5d. OpenAI User Prompt Template

```
SEEKER'S REQUEST:
{user_request}

PERSONA: {persona_name}
TONE: {tone}

RESEARCH OBJECT (use this for all historical claims):
{research_object_json}

Write the spell in {persona_name}'s voice. Include:
1. Warm acknowledgment of the seeker's need
2. Explanation of why each tool/practice matters (from research_object)
3. The ritual steps in teacherly voice
4. "Inspired By" section citing ONLY sources from research_object
5. Closing invitation to return

Remember: You may NOT add historical claims beyond what's in the research_object.
```

---

## 6. Gating Checklist (For Future Testing)

### DeepSeek Output Validation
- [ ] Contains NO persona language ("dear", "seeker", "my child", "warmth")
- [ ] Contains NO emotional reassurance
- [ ] All sources have `source_id` matching allowed encyclopedia
- [ ] All links are from allowed domains
- [ ] `confidence_level` is present and appropriate
- [ ] JSON is valid and matches schema

### OpenAI Output Validation
- [ ] Contains NO sources outside research_object
- [ ] Every reference in "inspired_by" has matching source_id in research_object
- [ ] Contains persona voice (warm, teaching, personal)
- [ ] `connection_to_spell` present for each reference
- [ ] No fabricated historical figures or texts
- [ ] Uncertainty language used when confidence_level < "well-documented"

### Integration Validation
- [ ] Research brief stripped of persona language before DeepSeek call
- [ ] Research object passed unchanged to OpenAI
- [ ] Final spell references match research_object sources exactly
- [ ] No cross-contamination between engines

---

## 7. Non-Goals (Explicit)

- ❌ Do NOT implement this in code yet
- ❌ Do NOT change routing/auth/session
- ❌ Do NOT touch visuals except ornaments after session persistence verified
- ❌ Do NOT create new endpoints
- ❌ Do NOT modify existing spell generation flow

---

## 8. Implementation Order (When Unblocked)

1. Add Research Brief builder in `spell_prompts.py`
2. Add DeepSeek research function in `research_service.py`
3. Modify spell generation to: Brief → DeepSeek → Research Object → OpenAI
4. Update validation to enforce source constraints
5. Test with fixtures below
6. Update UI to display new reference format

---

*Document created: Session prep-only phase*
*To be implemented after: Session persistence ✓ + Visual polish ✓*
