# EMERGENT FIX INSTRUCTIONS - Spell Generation Pipeline

## Status Summary

Emergent reported fixing 3 bugs. Here's what's actually in the code:

| Bug | Emergent Says Fixed | Actually In Code? |
|-----|---------------------|-------------------|
| `get_openai_client` name collision | Yes | **Partially** — `get_openai_client` is NOT imported from `llm_providers` into `server.py`, but it IS defined in BOTH `llm_providers.py:123` AND `research_service.py:388`. If any code path imports both, the collision exists. |
| `transform_blocks_to_array()` | Yes | **NO — THIS FUNCTION DOES NOT EXIST ANYWHERE IN THE CODEBASE** |
| Timezone-naive datetime | Yes | **Yes** — confirmed at `server.py:5398-5400` |

---

## THE CRITICAL BUG: Blocks Format Mismatch

This is the #1 reason spells don't render. There are **two completely different block systems** that are disconnected:

### System A: What the Pipeline Generates (`pipeline_blocks.py`)

The writer prompt at `pipeline_blocks.py:297-399` tells the AI to return blocks as a **dict** with keys from `planner_blocks.py` (like `warm_greeting`, `evidence_card`, `the_question`):

```json
{
  "blocks": {
    "warm_greeting": {"content": "Come sit, love...", "type": "opening"},
    "historical_stitch": {"content": "The old ways...", "type": "research"},
    "tiny_practice": {"content": "Light a candle...", "type": "working"}
  }
}
```

### System B: What the Frontend Expects (`SpellBlockRenderer.jsx`)

The frontend at `SpellBlockRenderer.jsx:78` does `const blocks = spell?.blocks || []` then iterates with `.map()`, expecting an **array** of objects with `block_type` and `block_id`:

```json
{
  "blocks": [
    {
      "block_type": "cold_open",
      "block_id": "cold_open_1",
      "content": {"greeting": "...", "scene_setting": "...", "hook": "..."}
    },
    {
      "block_type": "materials",
      "block_id": "materials_1",
      "content": {"items": [...], "gathering_note": "..."}
    },
    {
      "block_type": "stepper",
      "block_id": "stepper_1",
      "content": {"steps": [{"step_number": 1, "action": "...", "why": "..."}]}
    }
  ]
}
```

### The Block Type Names Are ALSO Different

Pipeline uses: `warm_greeting`, `historical_stitch`, `tiny_practice`, `spoken_words`, `bird_oracle`, `evidence_card`, `the_question`, etc.

Frontend expects: `cold_open`, `materials`, `choice`, `stepper`, `lore_vignette`, `reflection`, `closing`, `bird_oracle`, `ward`, `song_prompt`, `evidence_card`, etc.

### The Content Structure Is ALSO Different

Pipeline blocks have `{"content": "plain string text", "type": "opening"}`.

Frontend blocks have `{"content": {"greeting": "...", "scene_setting": "...", "hook": "..."}}` — structured sub-objects that each React component destructures.

---

## FIX #1 (CRITICAL): Add `transform_blocks_to_array()` to `pipeline_blocks.py`

Add this function right before the `BlocksSpellPipeline` class (around line 548):

```python
# ============================================================================
# BLOCKS FORMAT TRANSFORMATION
# ============================================================================

# Mapping from pipeline block names to frontend block_type values
BLOCK_NAME_TO_TYPE = {
    # Shigg mappings
    "warm_greeting": "cold_open",
    "comfort_acknowledgment": "lore_vignette",
    "situation_acknowledgment": "lore_vignette",
    "blessing_context": "lore_vignette",
    "historical_stitch": "lore_vignette",
    "tiny_practice": "stepper",
    "protection_working": "stepper",
    "blessing_working": "stepper",
    "spoken_words": "closing",
    "journaling_prompt": "reflection",
    "bird_oracle": "bird_oracle",
    "closing_warmth": "closing",

    # Cathleen mappings
    "threshold_opening": "cold_open",
    "voice_activation": "song_prompt",
    "the_working": "stepper",
    "threat_acknowledgment": "lore_vignette",
    "cleansing_assessment": "lore_vignette",
    "ward_creation": "ward",
    "cleansing_working": "stepper",
    "closing_song": "closing",
    "talisman_suggestion": "materials",

    # Katherine mappings
    "title_block": "cold_open",
    "intent_statement": "cold_open",
    "setting_requirements": "materials",
    "materials_list": "materials",
    "safety_ethics": "safety_note",
    "opening_boundary": "lore_vignette",
    "rule_of_three": "choice",
    "ethical_framework": "safety_note",
    "invocation": "lore_vignette",
    "working_steps": "stepper",
    "binding_steps": "stepper",
    "closing_ceremony": "closing",
    "record_prompts": "reflection",
    "empowerment_line": "closing",

    # Theresa mappings
    "the_question": "cold_open",
    "evidence_card": "evidence_card",
    "observation_notes": "observation_task",
    "why_this_matters": "lore_vignette",
    "twenty_four_hour_action": "closing",
    "sources_block": "further_reading",

    # Brenda mappings
    "memory_anchor": "cold_open",
    "family_story": "lore_vignette",
    "letter_working": "stepper",
    "memory_working": "stepper",
    "grief_acknowledgment": "lore_vignette",
    "grief_working": "stepper",
    "chronicle_prompt": "reflection",
    "writing_exercise": "journal_prompt",

    # Shared
    "ethics_note": "safety_note",
    "ethics_statement": "safety_note",
}


def transform_blocks_to_array(spell_output: dict, guide_id: str = "shigg") -> dict:
    """
    Transform blocks from pipeline dict format to frontend array format.

    Pipeline returns: {"blocks": {"warm_greeting": {"content": "...", "type": "..."}, ...}}
    Frontend expects: {"blocks": [{"block_type": "cold_open", "block_id": "...", "content": {...}}, ...]}

    This function bridges the two formats.
    """
    blocks = spell_output.get("blocks", {})

    # If blocks is already an array, return as-is (already transformed)
    if isinstance(blocks, list):
        return spell_output

    # If blocks is not a dict either, return empty
    if not isinstance(blocks, dict):
        spell_output["blocks"] = []
        return spell_output

    transformed = []
    type_counters = {}

    for block_name, block_data in blocks.items():
        # Determine the frontend block_type
        block_type = BLOCK_NAME_TO_TYPE.get(block_name, "lore_vignette")

        # Generate unique block_id
        type_counters[block_type] = type_counters.get(block_type, 0) + 1
        block_id = f"{block_type}_{type_counters[block_type]}"

        # Extract content - pipeline blocks have {"content": "string", "type": "..."}
        # Frontend blocks need {"content": {structured_object}}
        if isinstance(block_data, dict):
            raw_content = block_data.get("content", "")
        else:
            raw_content = str(block_data)

        # Build the structured content object the frontend component expects
        content = _build_structured_content(block_type, block_name, raw_content, spell_output)

        transformed.append({
            "block_type": block_type,
            "block_id": block_id,
            "content": content
        })

    # Ensure required blocks exist: choice and stepper at minimum
    existing_types = {b["block_type"] for b in transformed}

    if "choice" not in existing_types:
        # Add a default choice block
        transformed.insert(2, {
            "block_type": "choice",
            "block_id": "choice_1",
            "content": {
                "prompt": "How would you like to approach this working?",
                "options": [
                    {"id": "intuitive", "label": "Follow my intuition", "description": "Let the working guide you naturally"},
                    {"id": "structured", "label": "Follow the steps precisely", "description": "Complete each step as written"}
                ],
                "consequence_hint": "Both paths lead to the same destination."
            }
        })

    spell_output["blocks"] = transformed
    return spell_output


def _build_structured_content(block_type: str, block_name: str, raw_content: str, spell_output: dict) -> dict:
    """
    Convert raw string content into the structured object each frontend block component expects.
    """
    if block_type == "cold_open":
        return {
            "greeting": raw_content[:200] if len(raw_content) > 200 else raw_content,
            "scene_setting": "",
            "hook": raw_content[200:] if len(raw_content) > 200 else ""
        }

    elif block_type == "materials":
        # Try to parse materials from the plan, or create from content
        materials = spell_output.get("materials", [])
        if materials and isinstance(materials, list):
            return {
                "items": [
                    {
                        "name": m.get("name", "item"),
                        "purpose": m.get("purpose", ""),
                        "substitution": m.get("substitution", ""),
                        "optional": False
                    }
                    for m in materials
                ],
                "gathering_note": raw_content if len(raw_content) < 200 else ""
            }
        return {
            "items": [{"name": "As described", "purpose": raw_content, "substitution": "", "optional": False}],
            "gathering_note": ""
        }

    elif block_type == "stepper":
        # Split content into steps
        lines = [l.strip() for l in raw_content.split('\n') if l.strip()]
        steps = []
        for i, line in enumerate(lines):
            # Remove leading numbering like "1." or "Step 1:"
            import re
            clean = re.sub(r'^(step\s+)?\d+[.:)\s]*', '', line, flags=re.IGNORECASE).strip()
            if clean:
                steps.append({
                    "step_number": i + 1,
                    "action": clean,
                    "spoken_words": None,
                    "why": None,
                    "duration_hint": None
                })
        if not steps:
            steps = [{"step_number": 1, "action": raw_content, "spoken_words": None, "why": None, "duration_hint": None}]
        return {
            "steps": steps,
            "completion_message": "The working is done. Breathe."
        }

    elif block_type == "lore_vignette":
        return {
            "title": block_name.replace("_", " ").title(),
            "narrative": raw_content,
            "era": None,
            "tradition": None,
            "relevance_to_working": None,
            "source_connection": None
        }

    elif block_type == "reflection":
        lines = [l.strip() for l in raw_content.split('\n') if l.strip()]
        return {
            "guide_note": lines[0] if lines else raw_content,
            "prompts": lines[1:] if len(lines) > 1 else [raw_content],
            "log_fields": [
                {"field_id": "reflection_notes", "label": "Your reflections", "type": "textarea", "placeholder": "Write what comes to mind..."}
            ]
        }

    elif block_type == "closing":
        return {
            "license_to_depart": raw_content,
            "grounding_action": None,
            "empowerment_line": None,
            "next_steps_hint": None
        }

    elif block_type == "bird_oracle":
        return {
            "bird": "Crow",
            "message": raw_content,
            "observation_prompt": None,
            "log_field": False
        }

    elif block_type == "ward":
        return {
            "ward_name": "Protection Ward",
            "creation_steps": [raw_content],
            "activation_phrase": None,
            "protects_against": None,
            "talisman_option": None
        }

    elif block_type == "song_prompt":
        return {
            "instruction": raw_content,
            "pitch": None,
            "phrase": None,
            "duration": None,
            "why_this_sound": None
        }

    elif block_type == "evidence_card":
        # Theresa's evidence card - try to parse KNOWN/LIKELY/LORE sections
        known, likely, lore = [], [], []
        current = known
        for line in raw_content.split('\n'):
            line_upper = line.strip().upper()
            if line_upper.startswith('KNOWN') or line_upper.startswith('VERIFIED'):
                current = known
                continue
            elif line_upper.startswith('LIKELY') or line_upper.startswith('REASONABLE'):
                current = likely
                continue
            elif line_upper.startswith('LORE') or line_upper.startswith('SPECULATION') or line_upper.startswith('FOLK'):
                current = lore
                continue
            if line.strip():
                current.append(line.strip().lstrip('- '))

        # If parsing didn't work, put everything in known
        if not known and not likely and not lore:
            known = [raw_content]

        return {
            "known": known,
            "likely": likely,
            "lore": lore,
            "pattern_note": None
        }

    elif block_type == "safety_note":
        return {
            "warning": raw_content,
            "when_to_stop": None,
            "consent_check": None,
            "alternatives": None
        }

    elif block_type == "journal_prompt":
        return {
            "guide_note": raw_content,
            "prompts": [raw_content],
            "log_fields": [
                {"field_id": f"journal_{block_name}", "label": "Your response", "type": "textarea", "placeholder": "Write freely..."}
            ]
        }

    elif block_type == "observation_task":
        return {
            "task_description": raw_content,
            "location_suggestion": None,
            "duration": None,
            "what_to_notice": None,
            "recording_prompt": None
        }

    elif block_type == "further_reading":
        sources = spell_output.get("sources", [])
        if sources and isinstance(sources, list):
            return {
                "recommendations": [
                    {
                        "title": s.get("work", s.get("title", "Reference")),
                        "author": s.get("author", ""),
                        "guide_note": s.get("relevance", ""),
                        "specific_passage": None
                    }
                    for s in sources
                ],
                "reading_ritual": None
            }
        return {
            "recommendations": [{"title": "Further reading", "author": "", "guide_note": raw_content, "specific_passage": None}],
            "reading_ritual": None
        }

    # Default fallback
    return {"text": raw_content}
```

---

## FIX #2 (CRITICAL): Call `transform_blocks_to_array()` After Pipeline Returns

In `server.py`, there are TWO places where the pipeline result is used. Both need the transformation.

### Location A: `_generate_spell_background()` (line ~5222-5228)

Find this code (around line 5222):
```python
        # Generate spell
        spell_output, metadata = await pipeline.generate_spell(
            spell_spec=spell_spec,
            guide_config=guide_config,
            belief_mode=belief_mode,
            tier_config=tier_config
        )
```

Add this immediately AFTER it:
```python
        # Transform blocks from pipeline dict format to frontend array format
        from prompts.pipeline_blocks import transform_blocks_to_array
        spell_output = transform_blocks_to_array(spell_output, persona_id)
```

### Location B: `generate_spell_v3_endpoint()` (line ~5010-5015)

Find this code (around line 5010):
```python
        spell_output, metadata = await pipeline.generate_spell(
            spell_spec=spell_spec,
            guide_config=guide_config,
            belief_mode=belief_mode,
            tier_config=tier_config
        )
```

Add this immediately AFTER it:
```python
        # Transform blocks from pipeline dict format to frontend array format
        from prompts.pipeline_blocks import transform_blocks_to_array
        spell_output = transform_blocks_to_array(spell_output, persona_id)
```

---

## FIX #3 (HIGH): Update `__init__.py` exports

In `backend/prompts/__init__.py`, add `transform_blocks_to_array` to the imports from pipeline_blocks:

Change line 27:
```python
from .pipeline_blocks import BlocksSpellPipeline, generate_spell_blocks
```

To:
```python
from .pipeline_blocks import BlocksSpellPipeline, generate_spell_blocks, transform_blocks_to_array
```

And add to `__all__` list:
```python
    'transform_blocks_to_array',
```

---

## FIX #4 (MEDIUM): Duplicate Function Definitions

`get_deepseek_client()` and `get_openai_client()` are defined in BOTH:
- `backend/llm_providers.py` (lines 113 and 123)
- `backend/research_service.py` (lines 377 and 388)

This is a latent collision. Currently `server.py` only imports from `research_service`, so it works. But it's fragile.

**Fix:** In `research_service.py`, remove the duplicate definitions and import from `llm_providers` instead:

Replace the function definitions at lines 377-400 in `research_service.py` with:
```python
from llm_providers import get_deepseek_client, get_openai_client
```

---

## FIX #5 (MEDIUM): Hardcoded Archivist Research Packet

The `_run_archivist` method in `pipeline_blocks.py:643-698` returns the same hardcoded research packet for EVERY spell regardless of intention. This means every spell gets "Family patterns repeat across generations" as its research context.

This needs to actually call DeepSeek. Replace the method body with a real API call, or at minimum, make the hardcoded content vary based on `guide_id` and the user's intention.

---

## VERIFICATION AFTER FIXES

After applying fixes, test by:

1. Restart backend: `sudo supervisorctl restart backend`
2. Check logs for errors: `tail -f /var/log/supervisor/backend.err.log`
3. Generate a spell via the UI
4. Check the browser console for the spell response shape — `blocks` should be an array, not a dict
5. Each block in the array should have `block_type`, `block_id`, and `content` (as a structured object)

Expected response structure:
```json
{
  "spell": {
    "title": "A Pattern Investigation",
    "blocks": [
      {"block_type": "cold_open", "block_id": "cold_open_1", "content": {"greeting": "...", "scene_setting": "...", "hook": "..."}},
      {"block_type": "lore_vignette", "block_id": "lore_vignette_1", "content": {"title": "...", "narrative": "..."}},
      {"block_type": "choice", "block_id": "choice_1", "content": {"prompt": "...", "options": [...]}},
      {"block_type": "stepper", "block_id": "stepper_1", "content": {"steps": [...]}},
      {"block_type": "closing", "block_id": "closing_1", "content": {"license_to_depart": "..."}}
    ],
    "ethics_statement": "...",
    "sources": [...]
  }
}
```
