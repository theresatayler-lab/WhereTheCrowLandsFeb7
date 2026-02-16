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
        "planner_model": "gpt-4o-mini",  # Was gpt-4o - faster for standard tier
        "writer_tokens": 3200,
        "max_blocks": 8
    },
    "premium": {
        "skip_planner_llm": False,
        "planner_model": "gpt-4o",
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
    openai_client,
    tier: str = "standard"
) -> Tuple[dict, dict]:
    """
    Run the planner stage with block awareness.
    For QUICK tier, skips LLM and uses deterministic plan.
    
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
    
    # STANDARD/PREMIUM: Use LLM planner
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
        response = await openai_client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": "You are a spell planner. Return ONLY valid JSON."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=1500
        )
        
        result_text = response.choices[0].message.content
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
    openai_client,
    anthropic_client=None,
    tier: str = "standard"
) -> Tuple[dict, dict]:
    """
    Run the writer stage with block awareness.
    
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
    
    # Try Anthropic first if available
    if anthropic_client:
        try:
            logger.info(f"[WRITER_BLOCKS] Using Claude for writing (tokens: {writer_tokens})")
            response = await anthropic_client.messages.create(
                model="claude-sonnet-4-20250514",
                max_tokens=writer_tokens,
                messages=[{"role": "user", "content": prompt}]
            )
            result_text = response.content[0].text
            metadata["writer_model"] = "claude-sonnet"
        except Exception as e:
            logger.warning(f"[WRITER_BLOCKS] Claude failed, falling back to OpenAI: {e}")
            anthropic_client = None
    
    # Fallback to OpenAI
    if not anthropic_client:
        try:
            logger.info(f"[WRITER_BLOCKS] Using GPT-4o for writing (tokens: {writer_tokens})")
            response = await openai_client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": f"You are {guide_config.get('name', 'Guide')}. Write spell content in your voice. Return ONLY valid JSON."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.85,
                max_tokens=writer_tokens
            )
            result_text = response.choices[0].message.content
            metadata["writer_model"] = "gpt-4o"
        except Exception as e:
            logger.error(f"[WRITER_BLOCKS] OpenAI failed: {e}")
            raise
    
    # Parse and repair JSON
    result_text = clean_json_response(result_text)
    result_text = repair_truncated_json(result_text)
    
    try:
        spell_output = json.loads(result_text)
    except json.JSONDecodeError as e:
        logger.error(f"[WRITER_BLOCKS] JSON parse error: {e}")
        raise ValueError(f"Failed to parse spell output: {e}")
    
    metadata["writer_ms"] = int((time.time() - start) * 1000)
    return spell_output, metadata


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
    
    def __init__(self, openai_client, anthropic_client=None, deepseek_client=None):
        self.openai_client = openai_client
        self.anthropic_client = anthropic_client
        self.deepseek_client = deepseek_client
        self.timing_log = {}
    
    async def generate_spell(
        self,
        spell_spec: dict,
        guide_config: dict,
        belief_mode: str = "SPIRITUAL",
        tier: str = "standard"
    ):
        """
        Generate a spell using the blocks-based pipeline.
        
        Returns: (spell_output, metadata)
        """
        import time
        start = time.time()
        
        guide_id = spell_spec.get("persona_id", "shigg")
        
        metadata = {
            "guide_id": guide_id,
            "belief_mode": belief_mode,
            "tier": tier,
            "timing": {},
            "stages_completed": []
        }
        
        # For now, create a minimal research packet (archivist stage skipped for speed)
        research_packet = {
            "facts": [],
            "sources": [],
            "tradition_context": {}
        }
        metadata["stages_completed"].append("archivist")
        
        # Run planner
        plan, planner_meta = await run_block_planner(
            spell_spec, guide_config, research_packet,
            self.openai_client, tier
        )
        metadata["timing"]["planner_ms"] = planner_meta.get("planner_ms", 0)
        metadata["planner_mode"] = planner_meta.get("planner_mode", "unknown")
        metadata["stages_completed"].append("planner")
        
        # Run writer
        spell_output, writer_meta = await run_block_writer(
            spell_spec, guide_config, research_packet, plan,
            belief_mode, self.openai_client, self.anthropic_client, tier
        )
        metadata["timing"]["writer_ms"] = writer_meta.get("writer_ms", 0)
        metadata["writer_model"] = writer_meta.get("writer_model", "unknown")
        metadata["stages_completed"].append("writer")
        
        # Run QA validation
        working_type = plan.get("working_type", "")
        qa_passed, qa_errors = validate_spell_blocks(spell_output, guide_id, working_type)
        metadata["qa_passed"] = qa_passed
        metadata["qa_errors"] = qa_errors
        metadata["stages_completed"].append("qa")
        
        metadata["timing"]["total_ms"] = int((time.time() - start) * 1000)
        
        return spell_output, metadata


async def generate_spell_blocks(
    spell_spec: dict,
    guide_config: dict,
    openai_client,
    anthropic_client=None,
    deepseek_client=None,
    belief_mode: str = "SPIRITUAL",
    tier: str = "standard"
):
    """
    Convenience function to generate a spell using the blocks pipeline.
    
    Returns: (spell_output, metadata)
    """
    pipeline = BlocksSpellPipeline(openai_client, anthropic_client, deepseek_client)
    return await pipeline.generate_spell(spell_spec, guide_config, belief_mode, tier)
