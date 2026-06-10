# Spell Generation Prompts - Two-stage prompt system (Planner + Writer)
# V1.1: SPELL QUALITY UPGRADE - Heirloom Recipe Structure
# 1. Planner - selects scenario, format, sources, generates text_variation_tokens, builds AssetPlan
# 2. Spell Writer - writes the actual spell content with Contract enforcement

import json
import random
from typing import Dict, List, Any
from persona_config import (
    get_persona_config, select_scenario_for_spell, get_format_for_scenario,
    get_practices_for_scenario, get_micro_icons_for_persona,
    get_persona_voice, get_persona_micro_lore, get_persona_taboos,
    BELIEF_BOUNDARY_DESCRIPTIONS, ASSET_TYPES,
    CROWLANDS_ART_BIBLE, ASSET_ROLE_LOCKS, get_art_bible_prompt_suffix
)
from image_style_matrix import build_style_layer, get_artist_style, get_category_modifier

# ============================================================================
# V1.1: TEXT VARIATION TOKENS - Behind-the-scenes uniqueness drivers
# ============================================================================

TEXT_VARIATION_TOKENS = {
    "setting_detail": [
        "desk by rain-streaked window",
        "kitchen before dawn",
        "blackout-curtained room",
        "corner by the fire",
        "chair near an open window",
        "bed with rumpled sheets",
        "bath with candles burning",
        "garden bench at dusk",
        "floor with cushions",
        "threshold between rooms"
    ],
    "sensory_detail": [
        "smell of iron and cloth",
        "kettle-steam rising",
        "beeswax and paper",
        "rain on stone",
        "dust motes in lamplight",
        "wool and smoke",
        "ink and old pages",
        "salt and candlewax",
        "bread cooling",
        "lavender and linen"
    ],
    "gesture_detail": [
        "pinning clockwise",
        "knotting three times",
        "tracing a circle with thumb",
        "pressing palm flat",
        "folding precisely",
        "stirring counterclockwise",
        "tapping rhythm on surface",
        "cupping hands together",
        "drawing breath slowly",
        "releasing with exhale"
    ],
    "metaphor_detail": [
        "seam-ripping a bad story",
        "setting a pot to simmer",
        "tuning a bell until it rings true",
        "unraveling a tangled thread",
        "clearing ash from the grate",
        "turning soil for planting",
        "polishing a mirror to see clearly",
        "opening a window stuck shut",
        "mending what was torn",
        "sweeping the threshold clean"
    ],
    "folk_reasoning_style": ["practical", "poetic", "historical"],
    "comfort_level": ["tender", "firm", "uplifting"]
}

def generate_text_variation_tokens() -> dict:
    """Generate text variation tokens for spell uniqueness"""
    return {
        "setting_detail": random.choice(TEXT_VARIATION_TOKENS["setting_detail"]),
        "sensory_detail": random.choice(TEXT_VARIATION_TOKENS["sensory_detail"]),
        "gesture_detail": random.choice(TEXT_VARIATION_TOKENS["gesture_detail"]),
        "metaphor_detail": random.choice(TEXT_VARIATION_TOKENS["metaphor_detail"]),
        "folk_reasoning_style": random.choice(TEXT_VARIATION_TOKENS["folk_reasoning_style"]),
        "comfort_level": random.choice(TEXT_VARIATION_TOKENS["comfort_level"])
    }


# ============================================================================
# V1.2: SETTING CONTEXT - Guidance for contextual settings
# ============================================================================

SETTING_CONTEXT = {
    "home_quiet": {
        "label": "In the quiet of my home",
        "description": "Private, uninterrupted space where you feel safe",
        "guidance": "This spell is for a private moment at home. The seeker has full privacy—they can light candles, speak aloud, use mirrors, perform any ritual without concern for observers. Emphasize creating sacred space within their own walls.",
        "example_spaces": ["bedroom", "private study", "kitchen at quiet hours", "bath sanctuary"],
        "can_include": ["candles", "incense", "spoken words", "mirrors", "altars", "full rituals"]
    },
    "nature": {
        "label": "Outside in nature",
        "description": "Garden, park, woods, by water—natural settings",
        "guidance": "This spell connects to the natural world. The seeker is outdoors where they can observe birds, feel wind, touch earth, be near water. Emphasize elemental connection, seasonal awareness, and the wisdom of the wild.",
        "example_spaces": ["garden", "woodland path", "park bench", "by a river", "beach"],
        "can_include": ["bird omens", "gathered materials", "earth contact", "sky observation", "water", "wind"]
    },
    "work_daily": {
        "label": "During my daily routine",
        "description": "Work, errands, regular tasks—woven into ordinary life",
        "guidance": "This spell fits into everyday activity. The seeker will perform it during normal tasks—making tea, at their desk, during a break. Keep materials simple and actions subtle. Emphasize how magic can thread through mundane moments.",
        "example_spaces": ["desk at work", "kitchen during morning routine", "during a tea break"],
        "can_include": ["tea ritual", "small carried tokens", "breath work", "quiet gestures", "journal notes"]
    },
    "transit": {
        "label": "On the move",
        "description": "Commute, travel, waiting—liminal spaces between",
        "guidance": "This spell works in transit—on a train, bus, in a waiting room, walking between places. Everything must be internal or use a tiny carried object. Emphasize breath, visualization, small gestures, and the magic of threshold spaces.",
        "example_spaces": ["train seat", "bus", "walking path", "waiting room", "airport"],
        "can_include": ["breath work", "visualization", "small token in pocket", "silent words", "observation"]
    },
    "public": {
        "label": "In public or semi-public",
        "description": "Café, library, shared space—others nearby",
        "guidance": "This spell happens where others are present but the seeker has some privacy. They can write, hold an object, sip tea—but nothing that draws attention. Emphasize subtle, internalized practice that looks ordinary to observers.",
        "example_spaces": ["café corner", "library table", "park bench", "quiet office"],
        "can_include": ["writing", "tea/coffee ritual", "held object", "silent words", "observation", "journaling"]
    }
}

def get_setting_context(setting_id: str) -> dict:
    """Get the full context for a setting"""
    return SETTING_CONTEXT.get(setting_id, SETTING_CONTEXT.get("home_quiet"))


# ============================================================================
# VARIATION KNOBS - Procedural variety for steps/timing
# ============================================================================

VARIATION_KNOBS = {
    "time_of_day": ["dawn", "morning", "noon", "dusk", "evening", "midnight", "whenever needed"],
    "gesture_type": ["circular motion", "linear gesture", "tapping three times", "breath work", "stillness", "swaying"],
    "repetition_pattern": ["three times", "seven times", "once with intention", "until it feels complete", "in rhythm with breath"],
    "material_placement": ["in center", "at edges", "carried close", "buried", "burned", "given to water", "left in moonlight"],
    "closing_action": ["extinguish candle", "bow head", "speak thanks", "ring bell", "clap hands", "deep exhale", "fold paper"],
    "energy_direction": ["inward (receiving)", "outward (projecting)", "grounding (down)", "lifting (up)", "circular (containing)"]
}

# ============================================================================
# TAROT COMPOSITION LIBRARY - Prevents repetitive imagery
# ============================================================================

TAROT_COMPOSITIONS = {
    "shigg": [
        {"focal": "single crow perched with teacup below", "framing": "circular wreath of rosehip and ivy", "symbols": ["hedgerow berries", "morning steam"]},
        {"focal": "robin on windowsill with kettle", "framing": "art nouveau curved border", "symbols": ["breadcrumbs", "dawn light"]},
        {"focal": "sparrow nest with feathers", "framing": "octagonal medallion seal", "symbols": ["patchwork pattern", "tea leaves"]},
        {"focal": "three birds in flight over rooftops", "framing": "engraved plate border with corners", "symbols": ["chimney smoke", "key"]},
        {"focal": "windowsill still-life with offerings", "framing": "symmetrical filigree frame", "symbols": ["breadcrumbs", "hedgerow rose"]},
        {"focal": "detailed feather with dewdrops", "framing": "mandala pattern medallion", "symbols": ["star points", "morning mist"]}
    ],
    "cathleen": [
        {"focal": "raven feather crossed with crescent moon", "framing": "protective circle with Brigid cross corners", "symbols": ["candleflame", "bell"]},
        {"focal": "devotional candle with altar cloth", "framing": "Celtic knot border medallion", "symbols": ["prayer beads", "threshold arch"]},
        {"focal": "crow silhouette in candlelight", "framing": "circular protection ward design", "symbols": ["flame", "sacred heart"]},
        {"focal": "brass bell with feather bundle", "framing": "arched doorway frame", "symbols": ["moon phases", "ivy vine"]},
        {"focal": "altar vignette with candles and beads", "framing": "symmetrical devotional border", "symbols": ["raven", "Brigid flame"]},
        {"focal": "protective circle with feathers", "framing": "engraved medallion with Celtic accents", "symbols": ["candleglow", "threshold"]}
    ],
    "katherine": [
        {"focal": "needle and thread crossing compass rose", "framing": "geometric sigil plate border", "symbols": ["sealed letter", "mirror reflection"]},
        {"focal": "scrying mirror with thread spirals", "framing": "square Golden Dawn geometry", "symbols": ["wax seal", "astrolabe"]},
        {"focal": "sealed letter with compass overlay", "framing": "architectural engraved frame", "symbols": ["measuring tape", "hexagram"]},
        {"focal": "geometric tree of life diagram", "framing": "sephirotic path border", "symbols": ["needle", "sealed document"]},
        {"focal": "compass and scissors crossed", "framing": "Victorian atelier border", "symbols": ["thread spool", "annotated margin"]},
        {"focal": "mirror reflecting geometric sigil", "framing": "double circle occult seal", "symbols": ["thimble", "wax"]}
    ]
}

def select_tarot_composition(persona_id: str, used_compositions: List[str] = None) -> dict:
    """Select a tarot composition, avoiding recently used ones"""
    if used_compositions is None:
        used_compositions = []
    
    persona_comps = TAROT_COMPOSITIONS.get(persona_id, TAROT_COMPOSITIONS["shigg"])
    
    # Try to find unused composition
    for comp in persona_comps:
        if comp["focal"] not in used_compositions:
            return comp
    
    # If all used, return random
    return random.choice(persona_comps)


def generate_variation_tokens() -> dict:
    """Generate random variation tokens for spell variety"""
    return {
        "time_of_day": random.choice(VARIATION_KNOBS["time_of_day"]),
        "gesture_type": random.choice(VARIATION_KNOBS["gesture_type"]),
        "repetition_pattern": random.choice(VARIATION_KNOBS["repetition_pattern"]),
        "material_placement": random.choice(VARIATION_KNOBS["material_placement"]),
        "closing_action": random.choice(VARIATION_KNOBS["closing_action"]),
        "energy_direction": random.choice(VARIATION_KNOBS["energy_direction"])
    }



# ============================================================================
# V2.0: SPELL-SPECIFIC VISUAL TOKEN EXTRACTION
# Extracts unique motifs from spell content for tarot image generation
# ============================================================================

# Symbol pools by category - draw from these based on spell content
SPELL_SYMBOL_POOLS = {
    "protection": ["ward circle", "shield motif", "sealed door", "mirror reflection", "thorns", "iron nail", "salt ring"],
    "healing": ["cauldron", "herb bundle", "pouring water", "wrapped wound", "sunrise", "mending hands", "root system"],
    "clarity": ["mirror", "lens", "clear water", "open eye", "parted clouds", "compass needle", "straight path"],
    "love": ["intertwined threads", "two cups", "shared hearth", "rose and thorn", "knotwork hearts", "clasped hands"],
    "prosperity": ["overflowing vessel", "grain sheaf", "growing vine", "coins in earth", "honeycomb", "open window"],
    "release": ["burning paper", "open cage", "flowing water", "scattered seeds", "smoke rising", "unraveling thread"],
    "binding": ["knotted cord", "sealed envelope", "locked box", "braided pattern", "wax seal", "intertwined roots"],
    "transformation": ["chrysalis", "snake shedding", "melting wax", "crossing threshold", "dawn breaking", "spinning wheel"],
    "divination": ["scrying bowl", "spread cards", "pendulum", "flame reading", "tea leaves", "casting bones"],
    "ancestors": ["old photograph", "heirloom key", "family tree", "candlelit altar", "written names", "passed-down object"],
}

GEOMETRY_PATTERNS = ["circular medallion", "octagonal seal", "mandala pattern", "square sigil plate", "hexagonal ward", "spiral design"]

def extract_spell_visual_tokens(spell_data: dict, persona_config: dict) -> dict:
    """
    Extract spell-specific visual tokens for unique tarot images.
    Rules:
    - Pull 2-4 tokens from spell content without adding new schema
    - Max 1 animal token unless guide is Shigg
    - Always include: 1 guide motif (thin) + 2-3 spell motifs (dominant)
    """
    import hashlib
    
    persona_id = persona_config.get("archetype_id") or persona_config.get("name", "shigg").lower()
    
    # Extract text to analyze
    title = spell_data.get("title", "") or spell_data.get("tarot_card", {}).get("title", "")
    essence = spell_data.get("tarot_card", {}).get("essence", "") or spell_data.get("essence", "")
    key_action = spell_data.get("tarot_card", {}).get("key_action", "")
    
    # Extract materials from blocks
    materials = []
    blocks = spell_data.get("blocks", [])
    for block in blocks:
        if block.get("block_type") == "materials":
            items = block.get("content", {}).get("items", [])
            for item in items[:4]:
                if isinstance(item, dict):
                    materials.append(item.get("name", ""))
                elif isinstance(item, str):
                    materials.append(item)
    
    # Combine text for analysis
    full_text = f"{title} {essence} {key_action} {' '.join(materials)}".lower()
    
    # Detect spell intent/category
    detected_intent = None
    intent_keywords = {
        "protection": ["protect", "ward", "shield", "safe", "defend", "guard", "boundary", "barrier"],
        "healing": ["heal", "soothe", "mend", "restore", "comfort", "ease", "recover", "renew"],
        "clarity": ["clear", "clarity", "see", "understand", "reveal", "truth", "insight", "vision"],
        "love": ["love", "heart", "attract", "connect", "relationship", "bond", "affection"],
        "prosperity": ["prosper", "abundance", "wealth", "success", "growth", "flourish", "attract money"],
        "release": ["release", "let go", "banish", "remove", "free", "shed", "cleanse", "purge"],
        "binding": ["bind", "hold", "secure", "keep", "contain", "lock", "seal"],
        "transformation": ["transform", "change", "shift", "become", "evolve", "transition", "metamorphosis"],
        "divination": ["divine", "scry", "reveal", "foresee", "oracle", "read", "predict"],
        "ancestors": ["ancestor", "family", "heritage", "lineage", "memory", "tradition", "honor the dead"],
    }
    
    for intent, keywords in intent_keywords.items():
        if any(kw in full_text for kw in keywords):
            detected_intent = intent
            break
    
    if not detected_intent:
        detected_intent = "protection"  # Default
    
    # Get spell-specific symbols (2-3)
    spell_symbols = SPELL_SYMBOL_POOLS.get(detected_intent, SPELL_SYMBOL_POOLS["protection"])
    
    # Use spell ID or title hash for deterministic selection
    spell_id = spell_data.get("spell_id") or spell_data.get("id") or title
    seed = int(hashlib.md5(str(spell_id).encode()).hexdigest()[:8], 16)
    random.seed(seed)
    
    selected_symbols = random.sample(spell_symbols, min(3, len(spell_symbols)))
    
    # Add materials-based symbols (convert materials to visual tokens)
    material_visual_map = {
        "candle": "candleflame", "mirror": "reflective surface", "thread": "woven cord",
        "salt": "crystalline circle", "water": "still pool", "herb": "botanical bundle",
        "stone": "standing stone", "feather": "single feather", "paper": "written page",
        "ink": "dark well", "ribbon": "flowing ribbon", "needle": "pointed needle",
        "coin": "metal disc", "key": "iron key", "bell": "hanging bell"
    }
    
    material_symbols = []
    for mat in materials[:2]:
        mat_lower = mat.lower()
        for key, visual in material_visual_map.items():
            if key in mat_lower:
                material_symbols.append(visual)
                break
    
    # Combine symbols (spell + materials)
    secondary_motifs = list(set(selected_symbols + material_symbols))[:3]
    
    # Select geometry based on spell hash
    geometry = GEOMETRY_PATTERNS[seed % len(GEOMETRY_PATTERNS)]
    
    # Get guide signature motif (thin presence)
    guide_signatures = {
        "shigg": "tiny bird silhouette in corner",
        "cathleen": "subtle crescent moon edge detail",
        "katherine": "thin compass needle accent",
        "theresa": "faint thread pattern border",
        "brenda": "small letter seal corner detail"
    }
    guide_motif = guide_signatures.get(persona_id, "subtle crow feather detail")
    
    # Forbidden list - avoid overshadowing spell motifs
    forbidden = []
    if persona_id != "shigg":
        forbidden.append("prominent bird imagery")
    forbidden.append("photorealistic elements")
    forbidden.append("modern objects")
    forbidden.append("text or letters")
    
    # Reset random seed
    random.seed()
    
    # Primary motif from detected intent
    intent_primary_map = {
        "protection": "protective ward emblem",
        "healing": "restorative vessel motif",
        "clarity": "revealing eye symbol",
        "love": "connected hearts design",
        "prosperity": "overflowing abundance symbol",
        "release": "rising smoke pattern",
        "binding": "knotted seal design",
        "transformation": "metamorphosis spiral",
        "divination": "oracle mirror frame",
        "ancestors": "ancestral memorial emblem"
    }
    
    return {
        "primary_motif": intent_primary_map.get(detected_intent, "mystical emblem"),
        "secondary_motifs": secondary_motifs,
        "geometry": geometry,
        "guide_signature": guide_motif,
        "forbidden": forbidden,
        "detected_intent": detected_intent,
        "spell_hash": str(seed)
    }


# ============================================================================
# STAGE 1: PLANNER PROMPT (V1.1 - with text_variation_tokens)
# ============================================================================

def build_planner_prompt(spell_spec: dict, persona_config: dict, scenario: dict) -> str:
    """
    Stage 1: Planner Prompt
    V1.1: Now generates text_variation_tokens for behind-the-scenes uniqueness
    """
    
    persona_id = spell_spec.get("persona_id", "shigg")
    
    belief_guidance = BELIEF_BOUNDARY_DESCRIPTIONS.get(
        spell_spec.get("belief_boundary", "spiritual_grounded"),
        BELIEF_BOUNDARY_DESCRIPTIONS["spiritual_grounded"]
    )
    
    # Build allowed sources text with IDs
    allowed_sources_text = "\n".join([
        f"- [{s['source_id']}] {s['author']}: \"{s['work']}\" ({s['year'] or 'Traditional'}) — {s['reference_class']}"
        for s in persona_config.get("allowed_sources", [])
    ])
    
    # Build source encyclopedia text for rich reference context
    from persona_config import SOURCE_ENCYCLOPEDIA
    source_encyclopedia_entries = []
    for source in persona_config.get("allowed_sources", []):
        source_id = source.get("source_id", "")
        encyclopedia_entry = SOURCE_ENCYCLOPEDIA.get(source_id, {})
        if encyclopedia_entry:
            entry_text = f"""
### {encyclopedia_entry.get('name', source_id)}
- **Who**: {encyclopedia_entry.get('bio', 'N/A')[:200]}...
- **Key Works**: {', '.join([w['title'] for w in encyclopedia_entry.get('key_works', [])[:3]])}
- **Core Teachings**: {', '.join(encyclopedia_entry.get('core_teachings', [])[:3])}
- **Relevance Contexts**:
"""
            for ctx_name, ctx_text in encyclopedia_entry.get('relevance_contexts', {}).items():
                entry_text += f"  - {ctx_name}: {ctx_text[:150]}...\n"
            
            if 'online_resources' in encyclopedia_entry:
                entry_text += "- **Learn More**: " + ", ".join([r['title'] for r in encyclopedia_entry['online_resources'][:2]])
            
            if 'quote' in encyclopedia_entry:
                entry_text += f"\n- **Quote**: \"{encyclopedia_entry['quote']}\""
            
            source_encyclopedia_entries.append(entry_text)
    
    source_encyclopedia_text = "\n".join(source_encyclopedia_entries[:4])  # Limit to top 4 to save tokens
    
    # Get practices linked to this scenario
    practices = get_practices_for_scenario(persona_id, scenario["scenario_id"])
    practices_text = "\n".join([
        f"- [{p['practice_id']}]: {p['name']} — {p['description']}"
        for p in practices
    ])
    
    # Get format for this scenario
    linked_format = get_format_for_scenario(persona_id, scenario["scenario_id"])
    format_section_order = linked_format["section_order"] if linked_format else scenario.get("required_sections", [])
    
    # Generate both variation token types
    variation_tokens = generate_variation_tokens()
    text_variation_tokens = generate_text_variation_tokens()
    
    # Select tarot composition constraints
    tarot_comp = select_tarot_composition(persona_id)
    
    # V1.1: Get voice config for persona-specific guidance
    voice_config = get_persona_voice(persona_id)
    micro_lore = get_persona_micro_lore(persona_id)
    
    prompt = f"""You are the Spell Planner for {persona_config['name']}, {persona_config['title']}.

## YOUR TASK
Create a detailed spell plan. You MUST:
1. Use the provided variation_tokens AND text_variation_tokens to ensure uniqueness
2. Select sources ONLY from allowed_sources (cite by source_id)
3. Follow the tarot_constraints to ensure distinct imagery
4. Create an asset_plan for generated images
5. Select 2-3 micro_lore items to weave into the spell

## SEEKER'S REQUEST (SpellSpec)
- Query: "{spell_spec.get('user_query', 'No specific query')}"
- Desired Feeling: {spell_spec.get('alchemize_categories_display', spell_spec.get('desired_feeling', 'calm'))}
- Time Available: {spell_spec.get('time', '10_min')}
- Tone: {spell_spec.get('tone', 'practical')}
- Belief Boundary: {spell_spec.get('belief_boundary', 'spiritual_grounded')}
- Anchor Objects: {spell_spec.get('anchor_objects_display', spell_spec.get('anchor_object', 'candle'))}
- Setting: {spell_spec.get('setting', 'bedroom')}
- Name/Nickname: {spell_spec.get('user_name', 'Seeker')}
- Things to Avoid: {spell_spec.get('avoid', 'None specified')}

## BELIEF BOUNDARY GUIDANCE
{belief_guidance}

## SELECTED SCENARIO
Scenario ID: {scenario['scenario_id']}
Name: {scenario['name']}
Description: {scenario['description']}
Best For: {', '.join(scenario['best_for'])}

## SECTION ORDER (from linked format)
{', '.join(format_section_order)}

## LINKED PRACTICES (incorporate 1-2 of these)
{practices_text if practices_text else "No specific practices linked - use general approach"}

## PROCEDURAL VARIATION TOKENS
- time_of_day: {variation_tokens['time_of_day']}
- gesture_type: {variation_tokens['gesture_type']}
- repetition_pattern: {variation_tokens['repetition_pattern']}
- material_placement: {variation_tokens['material_placement']}
- closing_action: {variation_tokens['closing_action']}
- energy_direction: {variation_tokens['energy_direction']}

## V1.1: TEXT VARIATION TOKENS (USE ALL of these for uniqueness)
- setting_detail: {text_variation_tokens['setting_detail']}
- sensory_detail: {text_variation_tokens['sensory_detail']}
- gesture_detail: {text_variation_tokens['gesture_detail']}
- metaphor_detail: {text_variation_tokens['metaphor_detail']}
- folk_reasoning_style: {text_variation_tokens['folk_reasoning_style']}
- comfort_level: {text_variation_tokens['comfort_level']}

## PERSONA MICRO_LORE (select 2-3 to include)
{json.dumps(micro_lore[:6], indent=2)}

## TAROT CONSTRAINTS (to prevent image repetition)
- FOCAL ELEMENT: {tarot_comp['focal']}
- FRAMING STYLE: {tarot_comp['framing']}
- SUPPORTING SYMBOLS: {', '.join(tarot_comp['symbols'])}
The tarot card image MUST use these constraints. Do NOT deviate.

## ALLOWED SOURCES (cite ONLY by source_id from this list)
{allowed_sources_text}

## SOURCE ENCYCLOPEDIA (Rich context for your references)
Use this information to write DETAILED, SPECIFIC connections between sources and your spell:
{source_encyclopedia_text}

## PERSONA VOICE STYLE
{persona_config['section_grammar']['voice_style']}

## VISUAL DNA
Primary Motif: {persona_config['visual_dna']['constants']['primary_motif']}
Art Style: {persona_config['visual_dna']['constants']['art_style']}
AVOID in visuals: {', '.join(persona_config['visual_dna']['avoid'])}

## OUTPUT FORMAT
Return ONLY this JSON (no markdown, no explanation):
{{
    "spell_title": "A unique, evocative title",
    "spell_subtitle": "A short poetic line",
    "format_id": "{linked_format['format_id'] if linked_format else 'general'}",
    "section_order": {json.dumps(format_section_order)},
    "variation_tokens": {json.dumps(variation_tokens)},
    "text_variation_tokens": {json.dumps(text_variation_tokens)},
    "selected_micro_lore": ["item 1", "item 2"],
    "selected_practices": ["practice_id_1", "practice_id_2"],
    "selected_sources": [
        {{"source_id": "...", "usage": "How this source informs this spell"}}
    ],
    "personalization_hooks": {{
        "name_usage": "How/where to use seeker's name",
        "anchor_integration": "How anchor object is central",
        "setting_details": "Specific setting adaptations using text_variation_tokens",
        "feeling_arc": "How spell moves toward desired feeling"
    }},
    "tarot_constraints": {{
        "focal_element": "{tarot_comp['focal']}",
        "framing_style": "{tarot_comp['framing']}",
        "supporting_symbols": {json.dumps(tarot_comp['symbols'])}
    }},
    "asset_plan": {{
        "header_image": {{
            "scene_description": "Detailed scene (NOT the tarot focal)",
            "mood": "...",
            "key_elements": ["..."]
        }},
        "tarot_card_image": {{
            "must_include_focal": "{tarot_comp['focal']}",
            "must_use_framing": "{tarot_comp['framing']}",
            "must_include_symbols": {json.dumps(tarot_comp['symbols'])}
        }},
        "sigil": {{
            "design_concept": "Simple black/white geometric design",
            "elements": ["..."]
        }},
        "dividers": [
            {{"placement": "after_introduction", "motif": "simple motif 1"}},
            {{"placement": "after_working", "motif": "different motif 2"}},
            {{"placement": "before_closing", "motif": "different motif 3"}}
        ]
    }}
}}

STRICT RULES:
1. selected_sources MUST only contain source_ids from ALLOWED SOURCES list
2. tarot_card_image MUST use the tarot_constraints provided
3. header_image MUST be different from tarot (scene vs emblem)
4. Use ALL variation_tokens and text_variation_tokens to make this spell unique
5. Select 2-3 micro_lore items that fit naturally
"""
    return prompt


# ============================================================================
# V1.2: SETTING GUIDANCE BUILDER
# ============================================================================

def _build_setting_guidance(setting_id: str) -> str:
    """Build setting-specific guidance for the spell writer"""
    context = SETTING_CONTEXT.get(setting_id, SETTING_CONTEXT.get("home_quiet"))
    
    return f"""The seeker will perform this spell: **{context['label']}**
{context['guidance']}

EXAMPLE SPACES: {', '.join(context['example_spaces'])}
CAN INCLUDE: {', '.join(context['can_include'])}

⚠️ IMPORTANT: Adapt the spell to fit this context. If the setting is "On the move" or "In public," 
the spell must use ONLY subtle, internalized actions that won't draw attention. 
If the setting is "In the quiet of my home," you can include fuller rituals with candles, 
spoken words, and physical setup."""


# ============================================================================
# STAGE 2: SPELL WRITER PROMPT (V1.1 - SPELL WRITER CONTRACT)
# ============================================================================

def build_spell_writer_prompt(spell_spec: dict, persona_config: dict, scenario: dict, plan: dict) -> str:
    """
    Stage 2: Spell Writer Prompt
    V1.1: Implements SPELL WRITER CONTRACT for heirloom quality spells
    """
    
    persona_id = spell_spec.get("persona_id", "shigg")
    
    belief_guidance = BELIEF_BOUNDARY_DESCRIPTIONS.get(
        spell_spec.get("belief_boundary", "spiritual_grounded"),
        BELIEF_BOUNDARY_DESCRIPTIONS["spiritual_grounded"]
    )
    
    time_guidance = {
        "2_min": "QUICK spell: 3-4 steps maximum. No setup. Immediate action.",
        "10_min": "FOCUSED spell: 5-6 steps. Brief setup, clear working.",
        "30_min": "FULL ritual: 7-9 steps. Proper setup, deep working, thorough closing."
    }.get(spell_spec.get("time", "10_min"), "5-6 steps, focused.")
    
    tone_guidance = {
        "gentle": "Soft, nurturing language. Invitation, not instruction.",
        "practical": "Clear, direct. Focus on what to do. Efficient.",
        "intense": "Powerful, evocative. Don't shy from darkness."
    }.get(spell_spec.get("tone", "practical"), "Clear and grounded.")
    
    # Build selected sources reference
    selected_sources = plan.get("selected_sources", [])
    sources_text = "\n".join([
        f"- [{s['source_id']}]: {s.get('usage', 'General reference')}"
        for s in selected_sources
    ])
    
    # Build source encyclopedia text for selected sources
    from persona_config import SOURCE_ENCYCLOPEDIA
    source_encyclopedia_entries = []
    for source in selected_sources:
        source_id = source.get("source_id", "")
        encyclopedia_entry = SOURCE_ENCYCLOPEDIA.get(source_id, {})
        if encyclopedia_entry:
            entry_text = f"""
### {encyclopedia_entry.get('name', source_id)}
- **Bio**: {encyclopedia_entry.get('bio', 'N/A')[:300]}
- **Core Teachings**: {', '.join(encyclopedia_entry.get('core_teachings', [])[:4])}
- **Relevance Contexts**:
"""
            for ctx_name, ctx_text in encyclopedia_entry.get('relevance_contexts', {}).items():
                entry_text += f"  - **{ctx_name}**: {ctx_text}\n"
            
            if 'online_resources' in encyclopedia_entry:
                entry_text += "- **Resources for learn_more section**:\n"
                for res in encyclopedia_entry.get('online_resources', [])[:3]:
                    entry_text += f"  - {res['title']}: {res['url']} ({res['type']})\n"
            
            if 'quote' in encyclopedia_entry:
                entry_text += f"- **Quotable**: \"{encyclopedia_entry['quote']}\""
            
            source_encyclopedia_entries.append(entry_text)
    
    source_encyclopedia_text = "\n".join(source_encyclopedia_entries) if source_encyclopedia_entries else "No encyclopedia entries for selected sources."
    
    # Get variation tokens from plan
    variation_tokens = plan.get("variation_tokens", {})
    text_variation_tokens = plan.get("text_variation_tokens", {})
    selected_micro_lore = plan.get("selected_micro_lore", [])
    
    # V1.1: Get voice config, micro_lore, and taboos
    voice_config = get_persona_voice(persona_id)
    taboos = get_persona_taboos(persona_id)
    
    # Build voice guidance
    voice_guidance = f"""
ROLE: {voice_config.get('role', 'wise guide')}
TONE: {', '.join(voice_config.get('tone', ['warm']))}
SENTENCE STYLE: {voice_config.get('sentence_style', 'clear and direct')}
SIGNATURE PHRASES (use 1-2): {json.dumps(voice_config.get('signature_phrases', [])[:4])}
PET NAMES: {json.dumps(voice_config.get('pet_names', []))}
ADDRESS STYLE: {voice_config.get('address_style', 'Address seeker by name')}
NEVER SAYS: {json.dumps(voice_config.get('never_says', []))}
"""
    
    prompt = f"""You ARE {persona_config['name']}, {persona_config['title']}.

## ⚠️ SPELL WRITER CONTRACT (V1.1) - HARD REQUIREMENTS ⚠️

### A) REQUIRED NEW SECTIONS (must include all)
1. **why_this_works**: 4-7 short paragraphs in YOUR voice explaining:
   - "We use X because..." for at least 3 materials (especially the anchor object)
   - At least 1 folklore/history note ("old house-tradition," "wartime habit," "tailor's trick")
   - Connect the tradition to the ritual step

2. **substitutions**: 3 items max, practical and kind:
   - "If you don't have X, use Y because it preserves the same function"

3. **tiny_mistakes_to_avoid**: 3 items max, examples:
   - Safety concerns
   - Overcomplication
   - Wording too long
   - Setting not ready
   - Leaving candle unattended

4. **closing_and_aftercare**: Must include:
   - Clear closing action
   - Grounding step
   - 1 line validating the seeker: "If this doesn't land today, that's not failure..."

### B) VOICE + WARMTH RULES (every spell)
{voice_guidance}

YOU MUST:
- Speak to seeker like a real person guiding them ("{spell_spec.get('user_name', 'love')}, come closer...")
- Include 2 "lived details" from micro_lore: {json.dumps(selected_micro_lore)}
- Include gentle options (quiet voice, shorter version, accessibility-friendly)

### C) SPECIFICITY RULE FOR INCANTATIONS
Every incantation MUST contain:
- 3 concrete nouns from the working (e.g., "needle / salt / kettle")
- 1 emotion word (steady, brave, clear, unbothered, softened)

BAN these filler phrases: {json.dumps(voice_config.get('never_says', ['so mote it be', 'blessed be']))}

### D) TABOOS (never include)
{json.dumps(taboos)}

### E) SETTING CONTEXT (V1.2) - CRITICAL FOR THIS SPELL
{_build_setting_guidance(spell_spec.get('setting', 'home_quiet'))}

## THE SPELL YOU ARE WRITING
Title: {plan.get('spell_title', 'Untitled')}
Subtitle: {plan.get('spell_subtitle', '')}
Format: {plan.get('format_id', 'general')}

## SEEKER DETAILS
- Name: {spell_spec.get('user_name', 'Seeker')}
- Their Need: "{spell_spec.get('user_query', '')}"
- Desired Feeling: {spell_spec.get('alchemize_categories_display', spell_spec.get('desired_feeling', 'calm'))}
- Anchor Objects: {spell_spec.get('anchor_objects_display', spell_spec.get('anchor_object', 'candle'))}
- Setting: {spell_spec.get('setting', 'home_quiet')}
- Things to Avoid: {spell_spec.get('avoid', 'None')}

## BELIEF BOUNDARY
{belief_guidance}

## TIME CONSTRAINT: {spell_spec.get('time', '10_min')}
{time_guidance}

## TONE: {spell_spec.get('tone', 'practical')}
{tone_guidance}

## TEXT VARIATION TOKENS (MUST use ALL in the spell)
- Setting Detail: "{text_variation_tokens.get('setting_detail', 'quiet corner')}" — weave into introduction/setting
- Sensory Detail: "{text_variation_tokens.get('sensory_detail', 'candle smoke')}" — include in working steps
- Gesture Detail: "{text_variation_tokens.get('gesture_detail', 'three turns')}" — use in ritual actions
- Metaphor Detail: "{text_variation_tokens.get('metaphor_detail', 'clearing path')}" — use in why_this_works or closing
- Folk Reasoning Style: {text_variation_tokens.get('folk_reasoning_style', 'practical')} — shapes how you explain WHY
- Comfort Level: {text_variation_tokens.get('comfort_level', 'tender')} — shapes emotional tone

## PROCEDURAL VARIATION TOKENS
- Time of Day: {variation_tokens.get('time_of_day', 'any')}
- Gesture Type: {variation_tokens.get('gesture_type', 'as feels right')}
- Repetition: {variation_tokens.get('repetition_pattern', 'three times')}
- Material Placement: {variation_tokens.get('material_placement', 'as guided')}
- Closing Action: {variation_tokens.get('closing_action', 'as feels complete')}
- Energy Direction: {variation_tokens.get('energy_direction', 'as needed')}

## SECTION ORDER (follow this exactly)
{json.dumps(plan.get('section_order', []))}

## PERSONALIZATION HOOKS (from planner)
{json.dumps(plan.get('personalization_hooks', {}))}

## ALLOWED SOURCES FOR THIS SPELL (cite ONLY these by source_id)
{sources_text if sources_text else "No specific sources - draw from persona's general knowledge"}

## SOURCE ENCYCLOPEDIA (Use this to write RICH, SPECIFIC inspired_by sections)
{source_encyclopedia_text}

## OUTPUT FORMAT
Return ONLY this JSON (no markdown, no explanation):
{{
    "title": "{plan.get('spell_title', 'Untitled')}",
    "subtitle": "{plan.get('spell_subtitle', '')}",
    "format_id": "{plan.get('format_id', 'general')}",
    "scenario_id": "{scenario['scenario_id']}",
    "introduction": "Personal introduction using seeker's name, setting detail from text_variation_tokens, and your signature opening style. 2-3 sentences in YOUR distinct voice.",
    "timing": {{
        "time_of_day": "{variation_tokens.get('time_of_day', 'whenever needed')}",
        "moon_phase": "optional or Any",
        "day": "optional or Any",
        "note": "Any timing notes"
    }},
    "why_this_works": [
        "Paragraph 1: Why we use [anchor object] because...",
        "Paragraph 2: Why we use [material 2] because...",
        "Paragraph 3: Why we use [material 3] because...",
        "Paragraph 4: The folklore/history note - 'Old house-tradition says...' or 'In wartime homes...'",
        "Paragraph 5: How this connects to [seeker's desired feeling]"
    ],
    "tarot_card": {{
        "title": "Short evocative title",
        "symbol": "Single emoji",
        "essence": "One sentence core meaning",
        "key_action": "Single most important action",
        "incantation": "Short memorable phrase (3 concrete nouns + emotion word)",
        "timing": "Best time to perform"
    }},
    "materials": [
        {{"name": "Material", "icon": "emoji", "note": "Why we use this (short)", "substitution": "Alternative if unavailable"}}
    ],
    "preparation": {{
        "description": "How to prepare (brief, includes sensory_detail)",
        "steps": ["Prep step 1 using gesture_detail", "Prep step 2"]
    }},
    "the_working": {{
        "description": "The main body using metaphor_detail",
        "steps": [
            {{"step": 1, "title": "Step title", "instruction": "Detailed instruction using variation_tokens and text_variation_tokens", "spoken_words": "Words to say (specific, concrete) or null", "duration": "optional"}}
        ]
    }},
    "spoken_words": {{
        "invocation": "Opening invocation (use seeker's name)",
        "main_incantation": "Primary words of power (MUST have 3 concrete nouns + 1 emotion word)",
        "closing": "Closing words",
        "repetitions": 3,
        "delivery_notes": "How to speak (whisper/speak/sing) + accessibility option"
    }},
    "substitutions": [
        {{"original": "Material X", "substitute": "Material Y", "reason": "Because it preserves the same function"}},
        {{"original": "Material A", "substitute": "Material B", "reason": "Because..."}},
        {{"original": "Action X", "substitute": "Action Y", "reason": "For those who cannot..."}}
    ],
    "tiny_mistakes_to_avoid": [
        "Don't [safety concern]",
        "Avoid [overcomplication]", 
        "Remember to [preparation note]"
    ],
    "closing": {{
        "description": "How to close using closing_action from variation_tokens",
        "steps": ["Closing step 1", "Grounding step"],
        "final_words": "Final phrase"
    }},
    "closing_and_aftercare": {{
        "closing_action": "The physical closing action",
        "grounding_step": "How to ground yourself after",
        "validation": "If this doesn't land today, that's not failure. [Persona-specific encouragement]",
        "immediate": "What to do right after",
        "ongoing": "Any ongoing practices"
    }},
    "inspired_by": [
        {{
            "source_id": "MUST be from selected_sources - REQUIRED",
            "source_type": "book/tradition/practice/author",
            "name": "Source name (book title or tradition name)",
            "author": "Author name if applicable, null for traditions",
            "year": "Year if known, null if traditional",
            "connection_to_spell": "2-4 sentences that MUST reference: (1) a specific MATERIAL from this spell (mirror, salt, candle, thread) AND (2) a specific STEP or ACTION (Step 3: trace the circle, in the closing gesture, when lighting the candle). NO GENERIC CONNECTIONS.",
            "key_concept_used": "ONE specific concept (e.g., 'psychic hygiene', 'protective circle', 'sympathetic link', 'threshold guardian') - not vague",
            "beginner_takeaway": "ONE sentence starting with 'If you remember one thing...' - practical and encouraging",
            "learn_more": [
                {{"title": "Resource title from encyclopedia", "url": "MUST be from SOURCE_ENCYCLOPEDIA", "access": "free/paid/overview"}}
            ]
        }}
    ],
    "historical_context": {{
        "tradition": "The broader tradition (e.g., 'British kitchen magic', 'Celtic protection work') - ONE phrase",
        "time_period": "When common (e.g., '18th-19th century', 'Medieval period') - ONE phrase",
        "cultural_note": "1-2 sentences MAX on how people historically used this type of working",
        "modern_adaptation": "1 sentence on how we've adapted it safely for today"
    }},
    "variations": [
        "Alternative approach 1 (quieter/shorter/accessibility option)",
        "Alternative approach 2"
    ]
}}

## STRICT CITATION RULE ⚠️
You may ONLY cite sources that appear in ALLOWED SOURCES above.
Every source_id in "inspired_by" MUST match a source_id from that list.
Do NOT invent sources. Do NOT cite sources not in the list.
If in doubt, cite fewer sources rather than hallucinate.
NEVER invent URLs - only use URLs exactly as provided in SOURCE_ENCYCLOPEDIA.

## INSPIRED_BY REQUIREMENTS (CRITICAL - warm grandmother/friend voice)
Each entry MUST include:

1. **connection_to_spell**: 2-4 sentences that MUST reference:
   - At least ONE specific MATERIAL from the spell (the mirror, the salt, the candle, the thread)
   - AND at least ONE specific STEP or ACTION ("in Step 3 when we trace the circle", "during the closing gesture")
   - BAD: "Dion Fortune wrote about protection" (too generic)
   - GOOD: "The salt circle we lay in Step 2 draws directly from Fortune's concept of 'psychic hygiene'—she taught that physical boundaries create energetic ones. When you trace that line of salt around your workspace, you're doing exactly what she described: making the invisible visible."

2. **key_concept_used**: ONE specific concept, not vague:
   - BAD: "protection techniques"
   - GOOD: "psychic hygiene", "sympathetic link", "threshold guardian", "record-and-repeat method"

3. **beginner_takeaway**: ONE sentence starting with "If you remember one thing..."
   - Must be practical and encouraging, like advice from a wise friend
   - Example: "If you remember one thing, it's that the salt isn't magic—your intention when placing it is what matters."

4. **learn_more**: 2-3 links ONLY from SOURCE_ENCYCLOPEDIA resources (never invent URLs)

## PERSONA VOICE IN REFERENCES (must match!)
- **Shigg**: Warm domestic folklore, "why this works" like a handed-down recipe, practical wisdom
- **Cathleen**: Protective devotional mystery, candlelight logic, home-circle strength
- **Katherine**: Precise and observational, "test and verify" tone, methodical reasoning

## CRITICAL RULES (Contract Enforcement)
1. Use seeker's name ({spell_spec.get('user_name', 'Seeker')}) at least TWICE
2. Anchor objects ({spell_spec.get('anchor_objects_display', spell_spec.get('anchor_object', 'candle'))}) must be CENTRAL with WHY explanation
3. Use ALL text_variation_tokens in the spell text
4. spoken_words.main_incantation MUST have 3 concrete nouns + 1 emotion word
5. Include 2 micro_lore details: {json.dumps(selected_micro_lore)}
6. Include why_this_works, substitutions, tiny_mistakes_to_avoid, closing_and_aftercare
7. Follow the section_order from plan
8. Match TIME constraint: {time_guidance}
9. DO NOT use any phrase from the "never_says" list
10. Spell must feel like an heirloom recipe, not generic instructions
"""
    return prompt


# ============================================================================
# IMAGE PROMPT BUILDERS (unchanged from previous version)
# ============================================================================

def build_image_prompt(asset_type: str, asset_plan: dict, persona_config: dict, spell_title: str, spell_data: dict = None) -> str:
    """
    Build image generation prompt for each asset type.
    CRITICAL: CROWLANDS_ART_BIBLE is the PREFIX - it dominates the prompt.
    Rules: "No text", print-friendly linework, hard art style rules.

    V2.0: For tarot_card_image, uses spell-specific visual tokens for uniqueness.
    V3.0: Adds artist style layer from image_style_matrix for visual variety.
    """

    persona_id = persona_config.get("archetype_id") or persona_config.get("name", "shigg").lower()
    base_style = persona_config['visual_dna']['constants']['art_style']
    dall_e_rules = persona_config['visual_dna'].get('dall_e_rules', 'pen-and-ink illustration, NO text')
    avoid_list = persona_config['visual_dna']['avoid']

    # Get the global art bible - this is PREFIX (dominates the prompt)
    art_bible_prefix = get_art_bible_prompt_suffix()

    # Get asset role lock constraints
    role_lock = ASSET_ROLE_LOCKS.get(asset_type.split("_")[0], ASSET_ROLE_LOCKS.get("header", {}))
    role_suffix = role_lock.get('prompt_suffix', '')

    # V3.0: Detect intent and build artist style layer
    detected_intent = "protection"  # default
    visual_tokens = None
    if spell_data:
        visual_tokens = extract_spell_visual_tokens(spell_data, persona_config)
        detected_intent = visual_tokens.get("detected_intent", "protection")
    style_layer = build_style_layer(persona_id, detected_intent)
    artist = get_artist_style(persona_id, detected_intent)

    # V3.1: Visual continuity seed — shared across header/tarot/sigil so the
    # three assets read as one suite rather than three unrelated images.
    continuity = ""
    if visual_tokens:
        continuity = (
            f"VISUAL CONTINUITY: this image belongs to a matched set sharing "
            f"the motif of {visual_tokens['primary_motif']} and the palette "
            f"{artist['palette_shift']} — keep linework weight and mood consistent across the set."
        )

    if asset_type == "header_image":
        asset_info = asset_plan.get("header_image", {})
        header_scene = persona_config['visual_dna'].get('header_scene', asset_info.get('scene_description', 'mystical scene'))

        motif_echo = ""
        if visual_tokens:
            motif_echo = f"Worked subtly into the scene: an echo of {visual_tokens['primary_motif']},"

        prompt = f"""{art_bible_prefix},
{style_layer},
A {asset_info.get('mood', 'contemplative')} atmospheric scene in the style of {artist['artist']}: {header_scene},
featuring {', '.join(asset_info.get('key_elements', ['candle']))},
{motif_echo}
PALETTE: {artist['palette_shift']},
{continuity}
QUALITY: Should look like a fine art illustration or lithograph — visible artistic technique, NOT flat AI-generated imagery.
{role_suffix},
{dall_e_rules},
AVOID: {', '.join(avoid_list)}, generic stock photo look, oversaturated muddy colors"""

    elif asset_type == "tarot_card_image":
        asset_info = asset_plan.get("tarot_card_image", {})

        # V2.0: Use spell-specific visual tokens for uniqueness
        if spell_data:
            # visual_tokens already extracted above for style_layer
            primary_motif = visual_tokens["primary_motif"]
            secondary_motifs = visual_tokens["secondary_motifs"]
            geometry = visual_tokens["geometry"]
            guide_signature = visual_tokens["guide_signature"]
            forbidden = visual_tokens["forbidden"]

            prompt = f"""{art_bible_prefix},
{style_layer},
STYLE: hand-rendered occult illustration, visible pen-and-ink cross-hatching like Aubrey Beardsley or Edward Sullivan, rich blacks and whites with selective color accents.
COMPOSITION: {geometry} emblem or vignette (NOT a flat medallion, NOT a generic mandala).
FOCAL ELEMENT: {primary_motif} — rendered with craft and detail as if for a limited-edition occult press.
SUPPORTING ELEMENTS: {', '.join(secondary_motifs)}.
GUIDE SIGNATURE (small, organic): {guide_signature}.
PALETTE: Use this guide's palette — {artist['palette_shift']} — NOT generic gold-on-teal. Deep contrast, printmaking quality.
{continuity}
QUALITY: Should look like it belongs in a beautiful 1920s occult book, NOT like generic AI art.
CONSTRAINTS: no text, no letters, no numbers, no banners, no photorealism, no 3D render, no oversaturated neon.
{dall_e_rules},
AVOID: {', '.join(avoid_list + forbidden)}"""
        else:
            # Fallback to old behavior if no spell_data provided
            tarot_emblem = persona_config['visual_dna'].get('tarot_emblem', '')
            focal = asset_info.get('must_include_focal', 'mystical emblem')
            framing = asset_info.get('must_use_framing', 'circular border')
            symbols = asset_info.get('must_include_symbols', ['star'])

            prompt = f"""{art_bible_prefix},
{style_layer},
{base_style}, SYMBOLIC EMBLEM (NOT a scene),
{tarot_emblem if tarot_emblem else f'FOCAL ELEMENT: {focal}'},
FRAMING: {framing},
SUPPORTING SYMBOLS: {', '.join(symbols)},
centered composition, suitable for tarot/oracle card,
medallion or seal style, symmetrical,
{role_suffix},
{dall_e_rules},
MUST be visually DISTINCT from header image,
AVOID: {', '.join(avoid_list)}"""

    elif asset_type == "sigil":
        asset_info = asset_plan.get("sigil", {})
        category = get_category_modifier(detected_intent)
        primary_motif_str = persona_config.get('visual_dna', {}).get('constants', {}).get('primary_motif', 'crow, moon')
        sigil_motif = primary_motif_str.split(',')[0].strip()

        # Weave the spell's own motif in alongside the guide's signature motif
        spell_motif_line = ""
        if visual_tokens:
            spell_motif_line = f"Woven through the seal: {visual_tokens['primary_motif']},"

        prompt = f"""Ornate occult engraved linework sigil in the tradition of Austin Osman Spare and art nouveau bookplates,
Deep warm-black ink linework with ONE single antique gold accent detail (a thin gilded line or small gilded element) — otherwise no color,
{asset_info.get('design_concept', f'{detected_intent} sigil incorporating {sigil_motif}')},
Central symbol: {sigil_motif} rendered as geometric seal,
{spell_motif_line}
Supporting geometry: {category['composition']},
elements: {', '.join(asset_info.get('elements', ['circle', 'line', sigil_motif]))},
geometric and organic lines combined,
{continuity}
PRINTABLE at small size, clear bold lines, reads perfectly in pure black and white,
magical seal or protective mark style,
ultra-detailed engraved linework, symmetrical medallion,
art nouveau border flourishes,
no shading, no grey washes, no gradients,
NO text, NO letters, NO words, NO signatures, NO watermarks,
AVOID: {', '.join(avoid_list)}"""

    elif asset_type.startswith("divider"):
        divider_idx = int(asset_type.split("_")[1]) - 1 if "_" in asset_type else 0
        dividers = asset_plan.get("dividers", [{}])
        divider_info = dividers[divider_idx] if divider_idx < len(dividers) else dividers[0] if dividers else {}

        # Each guide's dividers carry their own ornamental vocabulary
        guide_divider_motifs = {
            "shigg": "botanical sprigs, small bird silhouettes, tea leaves and feathers",
            "cathleen": "Celtic knotwork, interlaced cords, raven feather tips",
            "katherine": "precise geometric lattice, astral points, fine compass linework",
            "theresa": "stretched red thread, small keys, magnifying-glass curves",
            "brenda": "unfurled letter ribbons, crow feathers, wax seal medallions",
        }
        guide_motif = guide_divider_motifs.get(persona_id, "scrollwork")

        prompt = f"""{art_bible_prefix},
{base_style}, HORIZONTAL decorative divider,
ornamental border featuring {divider_info.get('motif', guide_motif)},
incorporating {guide_motif},
HORIZONTAL orientation (wide, not tall), symmetrical,
suitable for separating text sections in a book,
elegant, art nouveau filigree, engraved texture,
{dall_e_rules},
AVOID: {', '.join(avoid_list)}"""

    else:
        prompt = f"{art_bible_prefix}, {base_style}, mystical illustration"
    
    return prompt.replace("\n", " ").strip()


def generate_all_image_prompts(asset_plan: dict, persona_config: dict, spell_title: str, spell_data: dict = None) -> dict:
    """Generate prompts for all required assets
    V2.0: Now accepts spell_data for spell-specific tarot image generation
    """
    prompts = {
        "header_image": build_image_prompt("header_image", asset_plan, persona_config, spell_title, spell_data),
        "tarot_card_image": build_image_prompt("tarot_card_image", asset_plan, persona_config, spell_title, spell_data),
        "sigil": build_image_prompt("sigil", asset_plan, persona_config, spell_title, spell_data),
    }
    
    for i in range(3):
        prompts[f"divider_{i+1}"] = build_image_prompt(f"divider_{i+1}", asset_plan, persona_config, spell_title)
    
    return prompts


# ============================================================================
# V1.1: SPELL QUALITY VALIDATOR (optional quality guard)
# ============================================================================

def validate_spell_contract(spell_json: dict) -> dict:
    """
    Validate that a spell meets the V1.1 Contract requirements
    Returns: {"valid": bool, "issues": [...], "score": int}
    """
    issues = []
    score = 100
    
    # Check required sections
    required_sections = ["why_this_works", "substitutions", "tiny_mistakes_to_avoid", "closing_and_aftercare"]
    for section in required_sections:
        if section not in spell_json or not spell_json[section]:
            issues.append(f"Missing required section: {section}")
            score -= 20
    
    # Check why_this_works has enough content
    why_this_works = spell_json.get("why_this_works", [])
    if len(why_this_works) < 4:
        issues.append(f"why_this_works needs at least 4 paragraphs, has {len(why_this_works)}")
        score -= 10
    
    # Check materials have reasons
    materials = spell_json.get("materials", [])
    materials_with_notes = sum(1 for m in materials if m.get("note"))
    if materials_with_notes < 3:
        issues.append(f"At least 3 materials need 'why we use this' notes, has {materials_with_notes}")
        score -= 10
    
    # Check incantation specificity (3 concrete nouns + emotion word)
    main_incantation = spell_json.get("spoken_words", {}).get("main_incantation", "")
    if len(main_incantation) < 20:
        issues.append("main_incantation too short - needs 3 concrete nouns + 1 emotion word")
        score -= 15
    
    # Check substitutions count
    substitutions = spell_json.get("substitutions", [])
    if len(substitutions) < 2:
        issues.append(f"Need at least 2 substitutions, has {len(substitutions)}")
        score -= 5
    
    # Check tiny_mistakes_to_avoid count
    mistakes = spell_json.get("tiny_mistakes_to_avoid", [])
    if len(mistakes) < 2:
        issues.append(f"Need at least 2 tiny_mistakes_to_avoid, has {len(mistakes)}")
        score -= 5
    
    # Check closing_and_aftercare has validation line
    aftercare = spell_json.get("closing_and_aftercare", {})
    if not aftercare.get("validation"):
        issues.append("closing_and_aftercare missing validation line")
        score -= 10
    
    return {
        "valid": len(issues) == 0,
        "issues": issues,
        "score": max(0, score)
    }


# ============================================================================
# SESSION TRACKING FOR SCENARIO ROTATION
# ============================================================================

_used_scenarios_cache = {}

def get_used_scenarios(session_id: str) -> list:
    """Get list of recently used scenario IDs for this session"""
    return _used_scenarios_cache.get(session_id, [])

def record_used_scenario(session_id: str, scenario_id: str):
    """Record that a scenario was used in this session"""
    if session_id not in _used_scenarios_cache:
        _used_scenarios_cache[session_id] = []
    _used_scenarios_cache[session_id].append(scenario_id)
    _used_scenarios_cache[session_id] = _used_scenarios_cache[session_id][-5:]
