# Planner V2 - Blocks-Based Spell Planning
# Outputs template_id, canon anchor, and block sequence

import json
import random
from typing import Dict, List, Any

# Import persona helpers for micro_lore and taboos
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from persona_config import get_persona_micro_lore, get_persona_taboos


# =============================================================================
# SESSION-LEVEL TAROT COMPOSITION TRACKING (V1.2)
# Prevents immediate repeats within a user session
# =============================================================================

_used_tarot_compositions = {}  # {session_id: {persona_id: [composition_ids]}}

# Tarot composition library per persona
TAROT_COMPOSITIONS = {
    "shigg": [
        {"id": "shigg_1", "focal": "single crow perched with teacup below", "frame": "circular wreath of rosehip and ivy"},
        {"id": "shigg_2", "focal": "robin on windowsill with kettle", "frame": "art nouveau curved border"},
        {"id": "shigg_3", "focal": "sparrow nest with feathers", "frame": "octagonal medallion seal"},
        {"id": "shigg_4", "focal": "three birds in flight over rooftops", "frame": "engraved plate border with corners"},
        {"id": "shigg_5", "focal": "windowsill still-life with offerings", "frame": "symmetrical filigree frame"},
        {"id": "shigg_6", "focal": "detailed feather with dewdrops", "frame": "mandala pattern medallion"}
    ],
    "cathleen": [
        {"id": "cathleen_1", "focal": "raven feather crossed with crescent moon", "frame": "protective circle with Brigid cross corners"},
        {"id": "cathleen_2", "focal": "devotional candle with altar cloth", "frame": "Celtic knot border medallion"},
        {"id": "cathleen_3", "focal": "crow silhouette in candlelight", "frame": "circular protection ward design"},
        {"id": "cathleen_4", "focal": "brass bell with feather bundle", "frame": "arched doorway frame"},
        {"id": "cathleen_5", "focal": "altar vignette with candles and beads", "frame": "symmetrical devotional border"},
        {"id": "cathleen_6", "focal": "protective circle with feathers", "frame": "engraved medallion with Celtic accents"}
    ],
    "katherine": [
        {"id": "katherine_1", "focal": "needle and thread crossing compass rose", "frame": "geometric sigil plate border"},
        {"id": "katherine_2", "focal": "scrying mirror with thread spirals", "frame": "square Golden Dawn geometry"},
        {"id": "katherine_3", "focal": "sealed letter with compass overlay", "frame": "architectural engraved frame"},
        {"id": "katherine_4", "focal": "geometric tree of life diagram", "frame": "sephirotic path border"},
        {"id": "katherine_5", "focal": "compass and scissors crossed", "frame": "Victorian atelier border"},
        {"id": "katherine_6", "focal": "mirror reflecting geometric sigil", "frame": "double circle occult seal"}
    ]
}


def get_available_tarot_compositions(session_id: str, persona_id: str) -> List[dict]:
    """Get tarot compositions not yet used in this session for this persona"""
    if session_id not in _used_tarot_compositions:
        _used_tarot_compositions[session_id] = {}
    
    used = _used_tarot_compositions[session_id].get(persona_id, [])
    all_comps = TAROT_COMPOSITIONS.get(persona_id, TAROT_COMPOSITIONS["shigg"])
    
    available = [c for c in all_comps if c["id"] not in used]
    
    # If exhausted, reset and return all
    if not available:
        _used_tarot_compositions[session_id][persona_id] = []
        available = all_comps
    
    return available


def record_tarot_composition(session_id: str, persona_id: str, composition_id: str):
    """Record that a tarot composition was used"""
    if session_id not in _used_tarot_compositions:
        _used_tarot_compositions[session_id] = {}
    if persona_id not in _used_tarot_compositions[session_id]:
        _used_tarot_compositions[session_id][persona_id] = []
    
    _used_tarot_compositions[session_id][persona_id].append(composition_id)


def select_tarot_composition(session_id: str, persona_id: str) -> dict:
    """Select a tarot composition, avoiding recent repeats"""
    available = get_available_tarot_compositions(session_id, persona_id)
    selected = random.choice(available)
    record_tarot_composition(session_id, persona_id, selected["id"])
    return selected

# Block templates per guide - defines required block sequence
BLOCK_TEMPLATES = {
    "shigg": {
        "template_id": "shigg_comfort_blocks",
        "description": "Shigg's warmth: cold_open → materials → choice → lore_vignette → stepper → bird_oracle → reflection → closing",
        "required_blocks": [
            {"type": "cold_open", "required": True},
            {"type": "materials", "required": True},
            {"type": "safety_note", "required": False},
            {"type": "choice", "required": True},  # REQUIRED
            {"type": "lore_vignette", "required": True},  # REQUIRED
            {"type": "stepper", "required": True},
            {"type": "bird_oracle", "required": True},
            {"type": "journal_prompt", "required": True},
            {"type": "closing", "required": True}
        ],
        "specialty_blocks": ["bird_oracle", "journal_prompt"]
    },
    
    "cathleen": {
        "template_id": "cathleen_voice_blocks",
        "description": "Cathleen's power: cold_open → materials → choice → lore_vignette → song_prompt → stepper → ward → closing",
        "required_blocks": [
            {"type": "cold_open", "required": True},
            {"type": "materials", "required": True},
            {"type": "safety_note", "required": False},
            {"type": "choice", "required": True},  # REQUIRED
            {"type": "lore_vignette", "required": True},  # REQUIRED
            {"type": "song_prompt", "required": True},
            {"type": "stepper", "required": True},
            {"type": "ward", "required": True},
            {"type": "reflection", "required": False},
            {"type": "closing", "required": True}
        ],
        "specialty_blocks": ["song_prompt", "ward"]
    },
    
    "katherine": {
        "template_id": "katherine_precision_blocks",
        "description": "Katherine's method: cold_open → materials → safety_note → choice → lore_vignette → stepper → reflection → closing",
        "required_blocks": [
            {"type": "cold_open", "required": True},
            {"type": "materials", "required": True},
            {"type": "safety_note", "required": True},
            {"type": "choice", "required": True},  # REQUIRED
            {"type": "lore_vignette", "required": True},  # REQUIRED
            {"type": "stepper", "required": True},
            {"type": "reflection", "required": True},
            {"type": "closing", "required": True}
        ],
        "specialty_blocks": ["safety_note", "reflection"]
    },
    
    "theresa": {
        "template_id": "theresa_investigation_blocks",
        "description": "Theresa's truth: cold_open → evidence_card → choice → lore_vignette → stepper → bird_oracle → journal_prompt → closing",
        "required_blocks": [
            {"type": "cold_open", "required": True},
            {"type": "evidence_card", "required": True},
            {"type": "materials", "required": True},
            {"type": "choice", "required": True},  # REQUIRED
            {"type": "lore_vignette", "required": True},  # REQUIRED
            {"type": "stepper", "required": True},
            {"type": "bird_oracle", "required": True},
            {"type": "journal_prompt", "required": True},
            {"type": "closing", "required": True}
        ],
        "specialty_blocks": ["evidence_card", "bird_oracle", "journal_prompt"]
    }
}

# Canon anchors - key events/practices from Crowlands Context for each guide
CANON_ANCHORS = {
    "shigg": [
        {"id": "blitz_kitchen_magic", "type": "practice", "title": "Blitz Kitchen Magic", "year": 1940, "era": "WWII", "relevance": "Makeshift rituals during rationing and bombing"},
        {"id": "east_end_cunning", "type": "tradition", "title": "East End Cunning Folk", "year": 1890, "era": "Victorian", "relevance": "Urban folk magic traditions"},
        {"id": "bird_parliament", "type": "practice", "title": "Parliament of Birds", "year": None, "era": "Timeless", "relevance": "Bird augury and omen reading"},
        {"id": "tea_divination", "type": "practice", "title": "Tea Leaf Reading", "year": 1850, "era": "Victorian", "relevance": "Domestic divination practices"},
        {"id": "rubaiyat_wisdom", "type": "figure", "title": "Omar Khayyám's Rubáiyát", "year": 1859, "era": "Victorian", "relevance": "Poetry as spiritual wisdom"}
    ],
    "cathleen": [
        {"id": "morrigan_devotion", "type": "tradition", "title": "Morrígan Devotion", "year": None, "era": "Celtic", "relevance": "Irish goddess of sovereignty and protection"},
        {"id": "spiritualist_home_circle", "type": "practice", "title": "Spiritualist Home Circle", "year": 1880, "era": "Victorian", "relevance": "Family séances and spirit contact"},
        {"id": "voice_magic", "type": "practice", "title": "Voice as Magical Tool", "year": None, "era": "Timeless", "relevance": "Song, hum, and spoken word as power"},
        {"id": "irish_warding", "type": "tradition", "title": "Irish Protective Charms", "year": None, "era": "Folk", "relevance": "Warding traditions from Ireland"},
        {"id": "wartime_secrecy", "type": "practice", "title": "Wartime Discretion", "year": 1940, "era": "WWII", "relevance": "Loose lips sink ships - hidden power"}
    ],
    "katherine": [
        {"id": "golden_dawn_method", "type": "tradition", "title": "Golden Dawn Methodology", "year": 1888, "era": "Victorian", "relevance": "Systematic ceremonial practice"},
        {"id": "victorian_spiritualism", "type": "tradition", "title": "Victorian Spiritualism", "year": 1860, "era": "Victorian", "relevance": "Scientific approach to occult"},
        {"id": "needle_correspondences", "type": "practice", "title": "Needle and Thread Magic", "year": None, "era": "Folk", "relevance": "Seamstress as magical practitioner"},
        {"id": "shadow_integration", "type": "practice", "title": "Shadow Work", "year": 1920, "era": "Jungian", "relevance": "Confronting the unconscious"},
        {"id": "three_tests", "type": "practice", "title": "Rule of Three Tests", "year": None, "era": "Timeless", "relevance": "Is it true? Consensual? Mine to act on?"}
    ],
    "theresa": [
        {"id": "genealogical_magic", "type": "practice", "title": "Genealogical Magic", "year": None, "era": "Contemporary", "relevance": "Uncovering family patterns and secrets"},
        {"id": "pattern_breaking", "type": "practice", "title": "Breaking Generational Patterns", "year": None, "era": "Contemporary", "relevance": "Ending inherited curses and habits"},
        {"id": "journalist_occult", "type": "figure", "title": "Investigative Occultism", "year": None, "era": "Contemporary", "relevance": "Following evidence to truth"},
        {"id": "veil_spell", "type": "practice", "title": "The Family Veil Spell", "year": None, "era": "Contemporary", "relevance": "Secrets hidden across generations"},
        {"id": "bird_log", "type": "practice", "title": "Bird Observation Log", "year": None, "era": "Contemporary", "relevance": "Systematic recording of omens"}
    ]
}

# Text variation tokens
TEXT_VARIATION_TOKENS = {
    "setting_detail": [
        "desk by rain-streaked window", "kitchen before dawn", "blackout-curtained room",
        "corner by the fire", "chair near an open window", "bed with rumpled sheets",
        "bath with candles burning", "garden bench at dusk", "floor with cushions"
    ],
    "sensory_detail": [
        "smell of iron and cloth", "kettle-steam rising", "beeswax and paper",
        "rain on stone", "dust motes in lamplight", "wool and smoke",
        "ink and old pages", "salt and candlewax", "bread cooling"
    ],
    "gesture_detail": [
        "pinning clockwise", "knotting three times", "tracing a circle with thumb",
        "pressing palm flat", "folding precisely", "stirring counterclockwise"
    ],
    "metaphor_detail": [
        "seam-ripping a bad story", "setting a pot to simmer", "tuning a bell until it rings true",
        "clearing ash from the grate", "mending what was torn", "sweeping the threshold clean",
        "untangling a knot of thread", "polishing tarnished silver", "turning the page"
    ]
}

VARIATION_KNOBS = {
    "time_of_day": ["dawn", "morning", "noon", "dusk", "evening", "midnight", "whenever needed"],
    "gesture_type": ["circular motion", "linear gesture", "tapping three times", "breath work", "stillness"],
    "repetition_pattern": ["three times", "seven times", "once with intention", "until it feels complete"],
    "closing_action": ["extinguish candle", "bow head", "speak thanks", "deep exhale", "fold paper"]
}


def build_planner_prompt_blocks(
    spell_spec: dict,
    guide_config: dict,
    research_packet: dict,
    belief_mode: str = "SPIRITUAL"
) -> str:
    """
    Stage 2: Planner Prompt (Blocks Version)
    Outputs template_id, canon anchor, and block sequence plan.
    """
    
    guide_id = spell_spec.get("persona_id", "shigg")
    session_id = spell_spec.get("session_id", "default")
    
    # Get block template for this guide
    template = BLOCK_TEMPLATES.get(guide_id, BLOCK_TEMPLATES["shigg"])
    
    # Select canon anchor based on research packet
    canon_anchors = CANON_ANCHORS.get(guide_id, CANON_ANCHORS["shigg"])
    anchor_options = json.dumps(canon_anchors, indent=2)
    
    # Generate variation tokens
    variation_tokens = {k: random.choice(v) for k, v in VARIATION_KNOBS.items()}
    text_tokens = {k: random.choice(v) for k, v in TEXT_VARIATION_TOKENS.items()}
    
    # === V1.2: SELECT MICRO_LORE ===
    # Get 2-3 micro_lore items for this guide to weave into the spell
    all_micro_lore = get_persona_micro_lore(guide_id)
    micro_lore_selected = random.sample(all_micro_lore, k=min(3, len(all_micro_lore))) if all_micro_lore else []
    
    # === V1.2: GET TABOOS ===
    # Get taboo themes/imagery this guide must avoid
    taboos = get_persona_taboos(guide_id)
    
    # === V1.2: SELECT TAROT COMPOSITION (session-aware) ===
    tarot_composition = select_tarot_composition(session_id, guide_id)
    
    # Extract research facts
    facts_summary = ""
    for fact in research_packet.get("facts", [])[:5]:
        facts_summary += f"- [{fact.get('claim_type', 'folklore')}] {fact.get('claim', '')}\n"
    
    # Extract sources
    sources_list = ""
    for src in research_packet.get("sources", [])[:4]:
        sources_list += f"- [{src.get('source_id')}] {src.get('author', 'Unknown')}: {src.get('work', 'Unknown')}\n"
    
    # Timeline anchors from research
    timeline_anchors = research_packet.get("timeline_anchors", [])
    timeline_info = ""
    for anchor in timeline_anchors[:3]:
        timeline_info += f"- {anchor.get('year', 'N/A')}: {anchor.get('title', 'Unknown')} - {anchor.get('relevance', '')}\n"
    
    prompt = f"""## SPELL PLANNER - BLOCKS VERSION

You are planning a blocks-based spell for {guide_config.get('name', 'Guide')}, {guide_config.get('title', '')}.

## SEEKER'S REQUEST
- Query: "{spell_spec.get('user_query', 'No specific query')}"
- Desired Feeling: {spell_spec.get('desired_feeling', 'calm')}
- Time Available: {spell_spec.get('time', '10_min')}
- Belief Mode: {belief_mode}
- Anchor Object: {spell_spec.get('anchor_object', 'candle')}
- Setting: {spell_spec.get('setting', 'home_quiet')}
- Name: {spell_spec.get('user_name', 'Seeker')}

## RESEARCH PACKET
{facts_summary}

## AVAILABLE SOURCES
{sources_list}

## TIMELINE ANCHORS (from research)
{timeline_info if timeline_info else "None identified"}

## BLOCK TEMPLATE FOR {guide_id.upper()}
Template ID: {template['template_id']}
Description: {template['description']}

Required blocks in order:
{json.dumps([b['type'] for b in template['required_blocks'] if b['required']], indent=2)}

Specialty blocks for this guide: {', '.join(template['specialty_blocks'])}

## CANON ANCHOR OPTIONS (select ONE most relevant)
{anchor_options}

## VARIATION TOKENS
- time_of_day: {variation_tokens['time_of_day']}
- gesture_type: {variation_tokens['gesture_type']}
- repetition_pattern: {variation_tokens['repetition_pattern']}
- closing_action: {variation_tokens['closing_action']}
- setting_detail: {text_tokens['setting_detail']}
- sensory_detail: {text_tokens['sensory_detail']}
- gesture_detail: {text_tokens['gesture_detail']}
- metaphor_detail: {text_tokens['metaphor_detail']}

## MICRO-LORE DETAILS (MUST include at least 2 in the spell)
These are lived details unique to {guide_config.get('name', 'Guide')}. Weave them naturally into cold_open or lore_vignette:
{chr(10).join('- ' + ml for ml in micro_lore_selected) if micro_lore_selected else '- (none available)'}

## TABOO THEMES/IMAGERY (DO NOT include)
{guide_config.get('name', 'Guide')} would NEVER include these themes or imagery:
{chr(10).join('- ' + t for t in taboos) if taboos else '- (none specified)'}

## OUTPUT FORMAT
Return ONLY this JSON:

{{
    "spell_title": "Evocative title (5-100 chars)",
    "spell_subtitle": "Poetic tagline",
    "guide_id": "{guide_id}",
    "belief_mode": "{belief_mode}",
    "template_id": "{template['template_id']}",
    
    "canon_anchor": {{
        "id": "selected_anchor_id",
        "type": "timeline_event|tradition|figure|practice",
        "title": "Anchor title",
        "year": 1900,
        "relevance": "Why this anchor connects to the seeker's query"
    }},
    
    "block_sequence": [
        {{
            "block_type": "cold_open",
            "block_id": "cold_open_1",
            "brief": "Opening with X prop and Y sensory detail"
        }},
        {{
            "block_type": "materials",
            "block_id": "materials_1",
            "items_planned": ["item1", "item2", "item3"]
        }},
        {{
            "block_type": "choice",
            "block_id": "choice_1",
            "choice_theme": "What aspect to focus on",
            "options_planned": ["option_a", "option_b"]
        }},
        {{
            "block_type": "lore_vignette",
            "block_id": "lore_1",
            "vignette_topic": "Historical connection from canon_anchor",
            "source_to_cite": "source_id"
        }},
        {{
            "block_type": "stepper",
            "block_id": "stepper_1",
            "step_count": 4,
            "step_themes": ["prepare", "invoke", "work", "seal"]
        }},
        ...additional blocks per template...
    ],
    
    "persona_lock": {{
        "props": ["prop1", "prop2"],
        "sensory_cue": "one sensory detail",
        "signature_move": "guide's signature action"
    }},
    
    "selected_facts": [
        {{"fact_index": 0, "usage_in_block": "lore_vignette"}}
    ],
    
    "selected_sources": [
        {{"source_id": "...", "usage_in_block": "lore_vignette"}}
    ],
    
    "variation_tokens": {json.dumps(variation_tokens)},
    "text_tokens": {json.dumps(text_tokens)},
    
    "micro_lore_selected": {json.dumps(micro_lore_selected)},
    "taboos": {json.dumps(taboos)},
    
    "tradition_tags": ["tag1", "tag2"],
    "safety_notes": ["any safety adaptations"]
}}

## CRITICAL RULES
1. MUST include a 'choice' block (interactive decision point)
2. MUST include a 'lore_vignette' block (historical/folkloric story)
3. MUST select exactly ONE canon_anchor most relevant to the query
4. Block sequence MUST match the template for this guide
5. Include persona_lock with 2-3 props identifiable in cold_open
6. The lore_vignette MUST connect to the canon_anchor"""

    return prompt


def get_block_template(guide_id: str) -> dict:
    """Get block template for a guide"""
    return BLOCK_TEMPLATES.get(guide_id, BLOCK_TEMPLATES["shigg"])


def get_canon_anchors(guide_id: str) -> list:
    """Get available canon anchors for a guide"""
    return CANON_ANCHORS.get(guide_id, CANON_ANCHORS["shigg"])


def validate_planner_blocks_output(output: dict) -> tuple[bool, list[str]]:
    """Validate planner blocks output"""
    errors = []
    
    # Required fields
    required = ["spell_title", "guide_id", "template_id", "canon_anchor", "block_sequence", "persona_lock"]
    for field in required:
        if field not in output:
            errors.append(f"MISSING_FIELD: {field}")
    
    # Validate canon_anchor
    anchor = output.get("canon_anchor", {})
    if not anchor.get("id"):
        errors.append("MISSING_CANON_ANCHOR_ID")
    if not anchor.get("relevance"):
        errors.append("MISSING_CANON_ANCHOR_RELEVANCE")
    
    # Validate block_sequence has required blocks
    block_types = [b.get("block_type") for b in output.get("block_sequence", [])]
    
    if "choice" not in block_types:
        errors.append("MISSING_REQUIRED_BLOCK: choice")
    if "lore_vignette" not in block_types:
        errors.append("MISSING_REQUIRED_BLOCK: lore_vignette")
    if "cold_open" not in block_types:
        errors.append("MISSING_REQUIRED_BLOCK: cold_open")
    if "stepper" not in block_types:
        errors.append("MISSING_REQUIRED_BLOCK: stepper")
    if "closing" not in block_types:
        errors.append("MISSING_REQUIRED_BLOCK: closing")
    
    # Validate persona_lock
    lock = output.get("persona_lock", {})
    if not lock.get("props") or len(lock.get("props", [])) < 2:
        errors.append("PERSONA_LOCK_INSUFFICIENT_PROPS")
    
    return len(errors) == 0, errors
