# Pipeline Blocks - Block-based spell generation pipeline
# Integrates with planner_blocks for structure-aware generation

import json
import logging
import time
import re
from typing import Dict, Any, Optional, Tuple

from .planner_blocks import (
    get_working_type, 
    get_required_blocks, 
    get_block_template,
    build_deterministic_plan,
    get_default_block_count
)

logger = logging.getLogger(__name__)

# ============================================================================
# CONFIGURATION
# ============================================================================

# Increased JSON repair window for Theresa's longer evidence_card blocks
JSON_REPAIR_MAX_CHARS = 8000  # Was 3000

# Default token budgets
DEFAULT_WRITER_TOKENS = 3200  # Was 2500 - increased for Theresa's evidence cards

# Tier configurations
TIER_CONFIG = {
    "quick": {
        "skip_planner_llm": True,  # Use deterministic plan instead
        "planner_model": None,
        "writer_tokens": 2500,
        "max_blocks": 5
    },
    "standard": {
        "skip_planner_llm": False,
        "planner_model": "claude-haiku-4-5-20251001",  # Anthropic planner
        "writer_tokens": 3200,
        "max_blocks": 8
    },
    "premium": {
        "skip_planner_llm": False,
        "planner_model": "claude-haiku-4-5-20251001",
        "writer_tokens": 4000,
        "max_blocks": 12
    }
}


# ============================================================================
# JSON REPAIR UTILITIES
# ============================================================================

def repair_truncated_json(text: str, max_repair_chars: int = JSON_REPAIR_MAX_CHARS) -> str:
    """
    Attempt to repair truncated JSON by closing open structures.
    Increased window size for Theresa's longer blocks.
    """
    if not text:
        return "{}"
    
    # Clean markdown wrapping
    text = text.strip()
    if text.startswith("```json"):
        text = text[7:]
    if text.startswith("```"):
        text = text[3:]
    if text.endswith("```"):
        text = text[:-3]
    text = text.strip()
    
    # Try parsing as-is first
    try:
        json.loads(text)
        return text
    except json.JSONDecodeError:
        pass
    
    # Count open brackets/braces in the last portion
    check_portion = text[-max_repair_chars:] if len(text) > max_repair_chars else text
    
    open_braces = check_portion.count('{') - check_portion.count('}')
    open_brackets = check_portion.count('[') - check_portion.count(']')
    
    # Check if we're inside a string (unclosed quote)
    in_string = False
    escape_next = False
    for char in check_portion:
        if escape_next:
            escape_next = False
            continue
        if char == '\\':
            escape_next = True
            continue
        if char == '"':
            in_string = not in_string
    
    # Build repair suffix
    repair = ""
    
    # Close string if needed
    if in_string:
        repair += '"'
    
    # Close arrays
    repair += ']' * max(0, open_brackets)
    
    # Close objects
    repair += '}' * max(0, open_braces)
    
    repaired = text + repair
    
    # Validate repair worked
    try:
        json.loads(repaired)
        logger.info(f"[JSON_REPAIR] Successfully repaired JSON (added {len(repair)} chars)")
        return repaired
    except json.JSONDecodeError as e:
        logger.warning(f"[JSON_REPAIR] Repair failed: {e}")
        # Return original - let caller handle the error
        return text


def clean_json_response(text: str) -> str:
    """Clean JSON from markdown code blocks"""
    if not text:
        return "{}"
    
    text = text.strip()
    
    # Remove markdown code blocks
    if '```json' in text:
        match = re.search(r'```json\s*(.*?)\s*```', text, re.DOTALL)
        if match:
            text = match.group(1)
    elif '```' in text:
        match = re.search(r'```\s*(.*?)\s*```', text, re.DOTALL)
        if match:
            text = match.group(1)
    
    return text.strip()


# ============================================================================
# TIER DETECTION
# ============================================================================

def detect_spell_tier(intention: str, user_tier: str = "free") -> str:
    """
    Detect the appropriate spell tier based on intention complexity.
    Returns: "quick", "standard", or "premium"
    """
    intention_lower = intention.lower()
    
    # Quick tier triggers - simple, single-focus intentions
    quick_triggers = [
        "calm", "peace", "relax", "simple", "quick", "easy",
        "moment", "breath", "ground", "center", "rest"
    ]
    
    # Premium tier triggers - complex, multi-faceted intentions
    premium_triggers = [
        "ceremony", "ritual", "deep", "ancestral", "multi",
        "complex", "detailed", "formal", "binding", "protection"
    ]
    
    # Check for quick tier
    for trigger in quick_triggers:
        if trigger in intention_lower and len(intention) < 50:
            logger.info(f"[TIER] Selected quick: Simple intention suitable for quick spell")
            return "quick"
    
    # Check for premium tier
    for trigger in premium_triggers:
        if trigger in intention_lower:
            if user_tier in ["premium", "founding"]:
                logger.info(f"[TIER] Selected premium: Complex intention with premium user")
                return "premium"
            else:
                logger.info(f"[TIER] Selected standard: Complex intention, user tier {user_tier}")
                return "standard"
    
    # Default to standard
    logger.info(f"[TIER] Selected standard: Default tier")
    return "standard"


# ============================================================================
# BLOCK-AWARE PLANNER
# ============================================================================

async def run_block_planner(
    spell_spec: dict,
    guide_config: dict,
    research_packet: dict,
    anthropic_client,
    tier: str = "standard"
) -> Tuple[dict, dict]:
    """
    Run the planner stage with block awareness.
    For QUICK tier, skips LLM and uses deterministic plan.
    Uses Anthropic Claude Haiku for planning.

    Returns: (plan, metadata)
    """
    start = time.time()
    guide_id = spell_spec.get("persona_id", "shigg")
    intention = spell_spec.get("user_query", "")

    tier_config = TIER_CONFIG.get(tier, TIER_CONFIG["standard"])
    metadata = {
        "tier": tier,
        "planner_mode": "deterministic" if tier_config["skip_planner_llm"] else "llm"
    }

    # QUICK tier: Use deterministic plan (no LLM call)
    if tier_config["skip_planner_llm"]:
        logger.info(f"[PLANNER_BLOCKS] Using deterministic plan for tier: {tier}")
        plan = build_deterministic_plan(guide_id, intention, research_packet)
        metadata["planner_ms"] = int((time.time() - start) * 1000)
        return plan, metadata

    # STANDARD/PREMIUM: Use LLM planner (Anthropic Claude Haiku)
    model = tier_config["planner_model"]
    logger.info(f"[PLANNER_BLOCKS] Using model: {model} (tier: {tier})")

    # Get working type and required blocks
    working_type = get_working_type(guide_id, intention)
    required_blocks = working_type.get("required_blocks", [])

    # Build block-aware prompt
    blocks_description = "\n".join([
        f"- {block}: {get_block_template(block).get('description', 'Content block')}"
        for block in required_blocks
    ])

    prompt = f"""Plan a spell for guide {guide_id}.

WORKING TYPE: {working_type['name']}
Description: {working_type['description']}

REQUIRED BLOCKS (in order):
{blocks_description}

SEEKER'S INTENTION: {intention}

RESEARCH CONTEXT:
{json.dumps(research_packet.get('facts', [])[:3], indent=2)}

Return JSON with:
- spell_title: Evocative title
- spell_subtitle: Poetic tagline
- working_type: "{working_type['type_id']}"
- section_order: {json.dumps(required_blocks)}
- materials_plan: [{{"name": "...", "purpose": "...", "substitution": "..."}}]
- step_outline: Brief outline for each block
- persona_lock: {{"props": [...], "sensory_cue": "...", "signature_move": "..."}}
"""

    try:
        if not anthropic_client:
            raise ValueError("Anthropic client not available")

        response = await anthropic_client.messages.create(
            model=model,
            max_tokens=1500,
            system="You are a spell planner. Return ONLY valid JSON.",
            messages=[{"role": "user", "content": prompt}]
        )

        result_text = response.content[0].text
        result_text = clean_json_response(result_text)
        result_text = repair_truncated_json(result_text)
        plan = json.loads(result_text)

        # Ensure working_type is set
        plan["working_type"] = working_type["type_id"]
        plan["guide_id"] = guide_id
        plan["planner_mode"] = "llm"

    except Exception as e:
        logger.error(f"[PLANNER_BLOCKS] Error: {e}")
        # Fallback to deterministic plan
        plan = build_deterministic_plan(guide_id, intention, research_packet)
        plan["planner_mode"] = "deterministic_fallback"

    metadata["planner_ms"] = int((time.time() - start) * 1000)
    return plan, metadata


# ============================================================================
# BLOCK-AWARE WRITER
# ============================================================================

def build_block_writer_prompt(
    spell_spec: dict,
    guide_config: dict,
    research_packet: dict,
    plan: dict,
    belief_mode: str,
    tier: str = "standard"
) -> str:
    """
    Build a block-aware writer prompt that generates content for each required block.
    """
    guide_id = spell_spec.get("persona_id", "shigg")
    working_type_id = plan.get("working_type", "")
    required_blocks = plan.get("section_order", get_required_blocks(guide_id, working_type_id))
    
    # Build block specifications
    block_specs = []
    for block in required_blocks:
        template = get_block_template(block)
        block_specs.append(f"""
"{block}": {{
    "content": "Your content here ({template['min_chars']}-{template['max_chars']} chars)",
    "type": "{template['type']}"
}}""")
    
    blocks_json = ",".join(block_specs)
    
    # Get voice contract from guide config
    voice = guide_config.get("voice", {})
    
    # Special handling for Theresa's evidence_card
    theresa_note = ""
    if guide_id == "theresa" and "evidence_card" in required_blocks:
        theresa_note = """
IMPORTANT FOR EVIDENCE_CARD BLOCK:
Structure as three sections:
- KNOWN: Verified facts from research
- LIKELY: Reasonable inferences
- LORE: Speculation and folk wisdom
Each section should be substantial (100-300 chars)."""
    
    # Special handling for bird_oracle - only include when relevant
    bird_oracle_note = ""
    if guide_id in ["shigg", "theresa"] and "bird_oracle" in required_blocks:
        if working_type_id == "bird_field_log":
            bird_oracle_note = """
BIRD_ORACLE: This is a bird observation working, so the bird oracle message should be based on observed bird behavior."""
        else:
            bird_oracle_note = """
BIRD_ORACLE: ONLY include if the working type naturally incorporates bird wisdom. Otherwise, this block may be brief."""
    
    prompt = f"""## SPELL WRITER - BLOCK GENERATION

You ARE {guide_config.get('name', 'Guide')}, {guide_config.get('title', '')}.

VOICE:
- Role: {voice.get('role', 'wise guide')}
- Tone: {', '.join(voice.get('tone', ['warm']))}
- Style: {voice.get('sentence_style', 'natural')}

SEEKER: {spell_spec.get('user_name', 'Seeker')}
INTENTION: {spell_spec.get('user_query', '')}
BELIEF MODE: {belief_mode}

WORKING TYPE: {plan.get('working_type', 'default')}

RESEARCH FACTS (use these):
{json.dumps(research_packet.get('facts', [])[:4], indent=2)}

SOURCES (cite these):
{json.dumps(research_packet.get('sources', [])[:3], indent=2)}
{theresa_note}
{bird_oracle_note}

OUTPUT FORMAT - Return ONLY this JSON:
{{
    "title": "{plan.get('spell_title', 'A Working')}",
    "subtitle": "Poetic subtitle",
    "guide_id": "{guide_id}",
    "working_type": "{working_type_id}",
    "belief_mode": "{belief_mode}",
    "blocks": {{{blocks_json}
    }},
    "materials": {json.dumps(plan.get('materials_plan', []))},
    "sources": [
        {{"source_id": "...", "type": "...", "relevance": "..."}}
    ],
    "ethics_statement": "Clear ethical boundary",
    "image_prompt": {{
        "header": "DALL-E prompt for header",
        "tarot": "DALL-E prompt for tarot card"
    }}
}}

RULES:
1. Generate content for EVERY block in the blocks object
2. Each block must meet its character minimums
3. Use 2-3 signature phrases naturally
4. Address seeker by name at least twice
5. Reference research facts with "why" explanations
"""
    
    return prompt


async def run_block_writer(
    spell_spec: dict,
    guide_config: dict,
    research_packet: dict,
    plan: dict,
    belief_mode: str,
    anthropic_client,
    tier: str = "standard"
) -> Tuple[dict, dict]:
    """
    Run the writer stage with block awareness.
    Uses Anthropic Claude Sonnet as the sole writer.

    Returns: (spell_output, metadata)
    """
    start = time.time()
    guide_id = spell_spec.get("persona_id", "shigg")
    tier_config = TIER_CONFIG.get(tier, TIER_CONFIG["standard"])
    writer_tokens = tier_config.get("writer_tokens", DEFAULT_WRITER_TOKENS)

    metadata = {
        "tier": tier,
        "writer_tokens": writer_tokens
    }

    prompt = build_block_writer_prompt(
        spell_spec, guide_config, research_packet, plan, belief_mode, tier
    )

    if not anthropic_client:
        raise ValueError("Anthropic client not configured - check ANTHROPIC_API_KEY")

    try:
        logger.info(f"[WRITER_BLOCKS] Using Claude Sonnet for writing (tokens: {writer_tokens})")
        response = await anthropic_client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=writer_tokens,
            messages=[{"role": "user", "content": prompt}]
        )
        result_text = response.content[0].text
        metadata["writer_model"] = "claude-sonnet-4"
    except Exception as e:
        logger.error(f"[WRITER_BLOCKS] Claude Sonnet failed: {e}")
        raise

    # Parse and repair JSON
    result_text = clean_json_response(result_text)
    result_text = repair_truncated_json(result_text)

    try:
        spell_output = json.loads(result_text)
    except json.JSONDecodeError as e:
        logger.error(f"[WRITER_BLOCKS] JSON parse error: {e}")
        raise ValueError(f"Failed to parse spell output: {e}")

    # Transform blocks dict to array format for frontend compatibility
    spell_output = transform_blocks_to_array(spell_output, guide_id)

    metadata["writer_ms"] = int((time.time() - start) * 1000)
    return spell_output, metadata


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

        # Extract content - pipeline blocks have {"content": "string"|dict, "type": "..."}
        # Frontend blocks need {"content": {structured_object}}
        if isinstance(block_data, dict):
            raw_content = block_data.get("content", "")
        else:
            raw_content = str(block_data)

        # If the AI already returned structured dict content, use it directly
        if isinstance(raw_content, dict):
            content = raw_content
        else:
            # Build the structured content object the frontend component expects
            content = _build_structured_content(block_type, block_name, str(raw_content), spell_output)

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

    # Build tarot_card data from the blocks if not already present
    if "tarot_card" not in spell_output:
        spell_output["tarot_card"] = _build_tarot_card(spell_output, transformed, guide_id)

    return spell_output


def _build_tarot_card(spell_output: dict, blocks: list, guide_id: str) -> dict:
    """Build tarot card preview data from spell blocks."""
    GUIDE_SYMBOLS = {
        "shigg": "🪶", "cathleen": "🛡", "katherine": "🔮",
        "theresa": "🔍", "brenda": "📜"
    }

    title = spell_output.get("title", "A Working") or "A Working"
    essence = ""
    key_action = ""
    incantation = ""
    timing = "When you are ready"
    warning = None

    for b in blocks:
        bt = b.get("block_type")
        c = b.get("content")
        if not isinstance(c, dict):
            continue
        if bt == "cold_open" and not essence:
            val = c.get("greeting") or c.get("hook") or ""
            essence = str(val)[:160]
        elif bt == "stepper" and not key_action:
            steps = c.get("steps") or []
            if steps and isinstance(steps, list) and isinstance(steps[0], dict):
                val = steps[0].get("action") or steps[0].get("instruction") or ""
                key_action = str(val)[:120]
        elif bt == "closing" and not incantation:
            val = c.get("empowerment_line") or c.get("license_to_depart") or ""
            incantation = str(val)[:120]
        elif bt == "ward" and not incantation:
            val = c.get("activation_phrase") or ""
            if val:
                incantation = str(val)[:120]
        elif bt == "safety_note" and not warning:
            val = c.get("warning") or c.get("note") or ""
            if val:
                warning = str(val)[:100]

    return {
        "symbol": GUIDE_SYMBOLS.get(guide_id, "✧"),
        "title": title,
        "essence": essence or "A spell crafted just for you.",
        "key_action": key_action or "Follow the steps within.",
        "incantation": incantation or "So it is done.",
        "timing": timing,
        "warning": warning,
    }


def _build_structured_content(block_type: str, block_name: str, raw_content: str, spell_output: dict) -> dict:
    """
    Convert raw string content into the structured object each frontend block component expects.
    """
    import re
    
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

    elif block_type == "choice":
        return {
            "prompt": "How would you like to approach this working?",
            "options": [
                {"id": "intuitive", "label": "Follow my intuition", "description": "Let the working guide you naturally"},
                {"id": "structured", "label": "Follow the steps precisely", "description": "Complete each step as written"}
            ],
            "consequence_hint": "Both paths lead to the same destination."
        }

    # Default fallback
    return {"text": raw_content}


# ============================================================================
# BLOCK VALIDATION
# ============================================================================

def validate_spell_blocks(
    spell_output: dict, 
    guide_id: str, 
    working_type_id: str = None
) -> Tuple[bool, list]:
    """
    Validate that spell output contains all required blocks with adequate content.
    Working-type aware validation - different blocks may be optional for different types.
    """
    errors = []
    
    blocks = spell_output.get("blocks", {})
    required_blocks = get_required_blocks(guide_id, working_type_id)
    
    for block_name in required_blocks:
        if block_name not in blocks:
            # Special case: evidence_card not required for bird_field_log
            if block_name == "evidence_card" and working_type_id == "bird_field_log":
                continue
            errors.append(f"MISSING_BLOCK: {block_name}")
            continue
        
        block_content = blocks[block_name]
        if isinstance(block_content, dict):
            content = block_content.get("content", "")
        else:
            content = str(block_content)
        
        template = get_block_template(block_name)
        min_chars = template.get("min_chars", 50)
        
        if len(content) < min_chars:
            errors.append(f"BLOCK_TOO_SHORT: {block_name} ({len(content)}/{min_chars} chars)")
    
    # Check for required top-level fields
    required_fields = ["title", "guide_id", "ethics_statement"]
    for field in required_fields:
        if not spell_output.get(field):
            errors.append(f"MISSING_FIELD: {field}")
    
    return len(errors) == 0, errors


# ============================================================================
# INTEGRATION FUNCTIONS
# ============================================================================

def get_tier_config(tier: str) -> dict:
    """Get configuration for a specific tier."""
    return TIER_CONFIG.get(tier, TIER_CONFIG["standard"])


def get_writer_tokens(tier: str) -> int:
    """Get the writer token budget for a tier."""
    return get_tier_config(tier).get("writer_tokens", DEFAULT_WRITER_TOKENS)


def should_skip_planner(tier: str) -> bool:
    """Check if planner LLM should be skipped for this tier."""
    return get_tier_config(tier).get("skip_planner_llm", False)


# ============================================================================
# BLOCKS SPELL PIPELINE CLASS
# ============================================================================

class BlocksSpellPipeline:
    """
    Block-aware spell generation pipeline.
    Handles the full Archivist → Planner → Writer → QA flow with block awareness.
    """
    
    def __init__(
        self,
        deepseek_client=None,
        anthropic_client=None,
        claude_client=None,
        max_retries: int = 1,
        tier_config: dict = None
    ):
        self.deepseek_client = deepseek_client
        # Support both anthropic_client and claude_client names
        self.anthropic_client = anthropic_client or claude_client
        self.max_retries = max_retries
        self.tier_config = tier_config or {}
        self.timing_log = {}
    
    async def generate_spell(
        self,
        spell_spec: dict,
        guide_config: dict,
        belief_mode: str = "SPIRITUAL",
        tier: str = None,
        tier_config: dict = None,
        on_stage_change: callable = None
    ):
        """
        Generate a spell using the blocks-based pipeline.
        
        Returns: (spell_output, metadata)
        """
        import time
        start = time.time()
        
        # Use provided tier_config or instance tier_config
        config = tier_config or self.tier_config or {}
        tier = tier or config.get('tier_name', 'standard')
        
        guide_id = spell_spec.get("persona_id", "shigg")
        
        metadata = {
            "guide_id": guide_id,
            "belief_mode": belief_mode,
            "tier": tier,
            "timing": {},
            "stages_completed": []
        }
        
        try:
            # Stage 1: Archivist (research)
            if on_stage_change:
                await on_stage_change("archivist")
            research_packet = await self._run_archivist(spell_spec, guide_id)
            metadata["stages_completed"].append("archivist")
            metadata["timing"]["archivist_ms"] = self.timing_log.get("archivist_ms", 0)
            
            # Stage 2: Planner
            if on_stage_change:
                await on_stage_change("planner")
            plan, planner_meta = await run_block_planner(
                spell_spec, guide_config, research_packet,
                self.anthropic_client, tier
            )
            metadata["timing"]["planner_ms"] = planner_meta.get("planner_ms", 0)
            metadata["planner_mode"] = planner_meta.get("planner_mode", "unknown")
            metadata["stages_completed"].append("planner")
            
            # Stage 3: Writer
            if on_stage_change:
                await on_stage_change("writer")
            spell_output, writer_meta = await run_block_writer(
                spell_spec, guide_config, research_packet, plan,
                belief_mode, self.anthropic_client, tier
            )
            metadata["timing"]["writer_ms"] = writer_meta.get("writer_ms", 0)
            metadata["writer_model"] = writer_meta.get("writer_model", "unknown")
            metadata["stages_completed"].append("writer")
            
            # Stage 4: QA validation
            if on_stage_change:
                await on_stage_change("qa")
            working_type = plan.get("working_type", "")
            qa_passed, qa_errors = validate_spell_blocks(spell_output, guide_id, working_type)
            metadata["qa_passed"] = qa_passed
            metadata["qa_errors"] = qa_errors
            metadata["stages_completed"].append("qa")
            
            metadata["timing"]["total_ms"] = int((time.time() - start) * 1000)
            
            return spell_output, metadata
            
        except Exception as e:
            logger.error(f"[BLOCKS_PIPELINE] Error: {e}")
            metadata["error"] = str(e)
            metadata["timing"]["total_ms"] = int((time.time() - start) * 1000)
            raise
    
    async def _run_archivist(self, spell_spec: dict, guide_id: str) -> dict:
        """Stage 1: Run Archivist research via DeepSeek - returns research packet"""
        import time
        start = time.time()

        intention = spell_spec.get("user_query", spell_spec.get("intention", ""))
        anchor = spell_spec.get("anchor_object")
        context = spell_spec.get("desired_feeling", "")

        try:
            from research_service import research_query_v2
            v2 = await research_query_v2(
                query=intention,
                persona_id=guide_id,
                anchor_object=anchor,
                context=context,
                max_retries=1
            )

            # Convert V2 response to the pipeline's research packet format
            facts = []
            for t in (v2.key_takeaways or []):
                if isinstance(t, dict):
                    facts.append({
                        "claim": t.get("text", ""),
                        "claim_type": t.get("claim_flag", "folklore"),
                        "confidence": t.get("confidence", "medium"),
                        "source_refs": t.get("source_refs", []),
                        "why_it_works": "",
                        "hedging_required": t.get("confidence") == "low"
                    })
            for f in (v2.why_this_works_facts or []):
                if isinstance(f, dict):
                    facts.append({
                        "claim": f.get("claim", ""),
                        "claim_type": f.get("claim_flag", "folklore"),
                        "confidence": f.get("confidence", "medium"),
                        "source_refs": f.get("source_refs", []),
                        "why_it_works": f.get("claim", ""),
                        "hedging_required": f.get("confidence") == "low"
                    })

            sources = []
            for s in (v2.sources or []):
                if isinstance(s, dict):
                    sources.append({
                        "source_id": s.get("id", s.get("title", "unknown")),
                        "author": s.get("author", ""),
                        "work": s.get("title", ""),
                        "year": s.get("year"),
                        "quality_tier": s.get("quality_tier", "folk_archive"),
                        "relevance": s.get("notes", "")
                    })

            pc = v2.practice_context if isinstance(v2.practice_context, dict) else {}
            research_packet = {
                "query_understood": intention,
                "research_mode": v2.research_mode or "spell_origins",
                "summary": v2.summary or "",
                "facts": facts or [{
                    "claim": v2.summary or "Traditional practice",
                    "claim_type": "folklore",
                    "confidence": "medium",
                    "source_refs": [],
                    "why_it_works": "",
                    "hedging_required": False
                }],
                "sources": sources,
                "tradition_context": {
                    "primary_tradition": (pc.get("tradition_tags") or ["folk_magic"])[0] if pc.get("tradition_tags") else "folk_magic",
                    "related_traditions": pc.get("tradition_tags", []),
                    "geographic_origin": pc.get("region", "British Isles"),
                    "time_period": pc.get("time_period", "Traditional")
                }
            }

            logger.info(f"[ARCHIVIST] DeepSeek research returned {len(facts)} facts, {len(sources)} sources")

        except Exception as e:
            logger.warning(f"[ARCHIVIST] DeepSeek research failed, using fallback: {e}")
            research_packet = {
                "query_understood": intention,
                "research_mode": "spell_origins",
                "summary": "",
                "facts": [{
                    "claim": "Traditional folk practices address this through ritual and intention",
                    "claim_type": "folklore",
                    "confidence": "medium",
                    "source_refs": [],
                    "why_it_works": "Ritual creates a psychological container for change",
                    "hedging_required": False
                }],
                "sources": [],
                "tradition_context": {
                    "primary_tradition": "folk_magic",
                    "related_traditions": [],
                    "geographic_origin": "British Isles",
                    "time_period": "Traditional"
                }
            }

        self.timing_log["archivist_ms"] = int((time.time() - start) * 1000)
        return research_packet


async def generate_spell_blocks(
    spell_spec: dict,
    guide_config: dict,
    anthropic_client=None,
    deepseek_client=None,
    belief_mode: str = "SPIRITUAL",
    tier: str = "standard"
):
    """
    Convenience function to generate a spell using the blocks pipeline.

    Returns: (spell_output, metadata)
    """
    pipeline = BlocksSpellPipeline(
        deepseek_client=deepseek_client,
        anthropic_client=anthropic_client
    )
    return await pipeline.generate_spell(spell_spec, guide_config, belief_mode, tier)
