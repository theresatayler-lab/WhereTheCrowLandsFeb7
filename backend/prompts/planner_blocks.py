# Planner Blocks - Block-based spell structure configuration
# Defines guide-specific spell structures and working types

from typing import Dict, List, Any

# ============================================================================
# WORKING TYPES - Maps intentions to spell structures
# ============================================================================

WORKING_TYPES = {
    "shigg": {
        "comfort_ritual": {
            "name": "Comfort Ritual",
            "description": "Cozy domestic magic for emotional support",
            "trigger_words": ["comfort", "sad", "lonely", "grief", "loss", "hurting", "tired"],
            "required_blocks": ["warm_greeting", "comfort_acknowledgment", "historical_stitch", 
                               "tiny_practice", "spoken_words", "journaling_prompt", "bird_oracle", "closing_warmth"],
            "block_count": 8
        },
        "protection_spell": {
            "name": "Protection Spell",
            "description": "Household wards and safety magic",
            "trigger_words": ["protect", "safe", "ward", "shield", "boundary", "intruder"],
            "required_blocks": ["warm_greeting", "situation_acknowledgment", "historical_stitch",
                               "protection_working", "spoken_words", "journaling_prompt", "bird_oracle", "closing_warmth"],
            "block_count": 8
        },
        "blessing_ritual": {
            "name": "Blessing Ritual", 
            "description": "Bestowing good fortune and positive energy",
            "trigger_words": ["bless", "luck", "fortune", "prosperity", "new beginning", "fresh start"],
            "required_blocks": ["warm_greeting", "blessing_context", "historical_stitch",
                               "blessing_working", "spoken_words", "journaling_prompt", "bird_oracle", "closing_warmth"],
            "block_count": 8
        }
    },
    
    "cathleen": {
        "voice_ritual": {
            "name": "Voice Ritual",
            "description": "Magic through song, hum, and spoken word",
            "trigger_words": ["voice", "sing", "speak", "express", "heard", "silence"],
            "required_blocks": ["threshold_opening", "voice_activation", "the_working",
                               "ward_creation", "closing_song", "talisman_suggestion", "ethics_note"],
            "block_count": 7
        },
        "protection_ward": {
            "name": "Protection Ward",
            "description": "Strong boundary magic with maternal fierce energy",
            "trigger_words": ["protect", "ward", "boundary", "safe", "shield", "threat"],
            "required_blocks": ["threshold_opening", "threat_acknowledgment", "voice_activation",
                               "ward_creation", "closing_song", "talisman_suggestion", "ethics_note"],
            "block_count": 7
        },
        "psychic_cleansing": {
            "name": "Psychic Cleansing",
            "description": "Clearing unwanted energies and influences",
            "trigger_words": ["cleanse", "clear", "remove", "negativity", "stuck", "heavy"],
            "required_blocks": ["threshold_opening", "cleansing_assessment", "voice_activation",
                               "cleansing_working", "closing_song", "talisman_suggestion", "ethics_note"],
            "block_count": 7
        }
    },
    
    "katherine": {
        "ceremonial_working": {
            "name": "Ceremonial Working",
            "description": "Precise, documented ritual with clear structure",
            "trigger_words": ["ritual", "ceremony", "formal", "structured", "precise"],
            "required_blocks": ["title_block", "intent_statement", "setting_requirements", "materials_list",
                               "safety_ethics", "opening_boundary", "invocation", "working_steps",
                               "closing_ceremony", "record_prompts", "empowerment_line"],
            "block_count": 11
        },
        "discernment_spell": {
            "name": "Discernment Spell",
            "description": "Truth-seeking and clarity magic",
            "trigger_words": ["truth", "clarity", "discern", "see", "understand", "deceive", "lie", "betray"],
            "required_blocks": ["title_block", "intent_statement", "setting_requirements", "materials_list",
                               "safety_ethics", "opening_boundary", "rule_of_three", "working_steps",
                               "closing_ceremony", "record_prompts", "empowerment_line"],
            "block_count": 11
        },
        "binding_working": {
            "name": "Binding Working",
            "description": "Constraining harmful influences (with ethical framework)",
            "trigger_words": ["bind", "stop", "constrain", "limit", "prevent", "harmful"],
            "required_blocks": ["title_block", "intent_statement", "ethical_framework", "materials_list",
                               "safety_ethics", "opening_boundary", "rule_of_three", "binding_steps",
                               "closing_ceremony", "record_prompts", "empowerment_line"],
            "block_count": 11
        }
    },
    
    "theresa": {
        # Default investigation type
        "pattern_investigation": {
            "name": "Pattern Investigation",
            "description": "Uncovering family patterns and ancestral influences",
            "trigger_words": ["pattern", "family", "ancestral", "inherited", "repeat", "cycle", "break"],
            "required_blocks": ["the_question", "evidence_card", "why_this_matters",
                               "the_working", "twenty_four_hour_action", "sources_block", "ethics_statement"],
            "block_count": 7
        },
        # New working types for Theresa
        "veil_breaking": {
            "name": "Veil Breaking",
            "description": "Uncovering family secrets and hidden truths",
            "trigger_words": ["secret", "hidden", "veil", "cover", "silence", "unspoken", "taboo"],
            "required_blocks": ["the_question", "evidence_card", "why_this_matters",
                               "the_working", "twenty_four_hour_action", "sources_block", "ethics_statement"],
            "block_count": 7
        },
        "genealogical_mapping": {
            "name": "Genealogical Mapping",
            "description": "Tracing ancestry and bloodline connections",
            "trigger_words": ["ancestry", "trace", "genealog", "bloodline", "lineage", "roots", "origin"],
            "required_blocks": ["the_question", "evidence_card", "why_this_matters",
                               "the_working", "twenty_four_hour_action", "sources_block", "ethics_statement"],
            "block_count": 7
        },
        "red_thread_working": {
            "name": "Red Thread Working",
            "description": "Following connections between events and people",
            "trigger_words": ["connect", "thread", "link", "relationship", "web", "network"],
            "required_blocks": ["the_question", "evidence_card", "why_this_matters",
                               "the_working", "twenty_four_hour_action", "sources_block", "ethics_statement"],
            "block_count": 7
        },
        "bird_field_log": {
            "name": "Bird Field Log",
            "description": "Observational magic through bird signs and omens",
            "trigger_words": ["bird", "sign", "omen", "message", "watch", "observe", "crow"],
            "required_blocks": ["the_question", "observation_notes", "why_this_matters",
                               "the_working", "twenty_four_hour_action", "sources_block", "ethics_statement"],
            "block_count": 7
        }
    },
    
    "brenda": {
        "letter_ritual": {
            "name": "Letter Ritual",
            "description": "Writing as magic - letters to ancestors, past selves, future",
            "trigger_words": ["letter", "write", "message", "communicate", "tell", "say"],
            "required_blocks": ["memory_anchor", "family_story", "letter_working", 
                               "chronicle_prompt", "writing_exercise", "closing_warmth", "ethics_note"],
            "block_count": 7
        },
        "memory_anchoring": {
            "name": "Memory Anchoring",
            "description": "Preserving and honoring family memories",
            "trigger_words": ["remember", "memory", "forget", "lost", "preserve", "honor", "ancestor"],
            "required_blocks": ["memory_anchor", "family_story", "memory_working",
                               "chronicle_prompt", "writing_exercise", "closing_warmth", "ethics_note"],
            "block_count": 7
        },
        "grief_tending": {
            "name": "Grief Tending",
            "description": "Processing loss through family connection",
            "trigger_words": ["grief", "loss", "death", "passed", "gone", "miss", "mourn"],
            "required_blocks": ["memory_anchor", "grief_acknowledgment", "family_story",
                               "grief_working", "chronicle_prompt", "closing_warmth", "ethics_note"],
            "block_count": 7
        }
    }
}


# ============================================================================
# BLOCK TEMPLATES - Defines structure for each spell block type
# ============================================================================

BLOCK_TEMPLATES = {
    # Shigg blocks
    "warm_greeting": {
        "type": "opening",
        "min_chars": 50,
        "max_chars": 300,
        "description": "Cozy, pet-name opening that welcomes the seeker"
    },
    "comfort_acknowledgment": {
        "type": "context",
        "min_chars": 100,
        "max_chars": 500,
        "description": "Validates the seeker's feelings without toxic positivity"
    },
    "historical_stitch": {
        "type": "research",
        "min_chars": 150,
        "max_chars": 600,
        "description": "Weaves in a folklore or historical fact from the research packet"
    },
    "tiny_practice": {
        "type": "working",
        "min_chars": 200,
        "max_chars": 800,
        "description": "Simple, actionable domestic magic steps"
    },
    "spoken_words": {
        "type": "invocation",
        "min_chars": 50,
        "max_chars": 300,
        "description": "Words to speak aloud, often in nursery-rhyme cadence"
    },
    "journaling_prompt": {
        "type": "integration",
        "min_chars": 50,
        "max_chars": 250,
        "description": "2-3 reflective questions for the journal"
    },
    "bird_oracle": {
        "type": "divination",
        "min_chars": 100,
        "max_chars": 400,
        "description": "A message from a specific bird from the Parliament"
    },
    "closing_warmth": {
        "type": "closing",
        "min_chars": 50,
        "max_chars": 200,
        "description": "Warm sign-off with pet name and encouragement"
    },
    
    # Cathleen blocks
    "threshold_opening": {
        "type": "opening",
        "min_chars": 100,
        "max_chars": 400,
        "description": "Creates liminal space with hush or threshold imagery"
    },
    "voice_activation": {
        "type": "preparation",
        "min_chars": 100,
        "max_chars": 400,
        "description": "Instructions for using voice: humming, singing, speaking"
    },
    "the_working": {
        "type": "working",
        "min_chars": 200,
        "max_chars": 800,
        "description": "Main ritual actions with voice as primary tool"
    },
    "ward_creation": {
        "type": "protection",
        "min_chars": 150,
        "max_chars": 500,
        "description": "Establishing protective boundaries through sound"
    },
    "closing_song": {
        "type": "closing",
        "min_chars": 100,
        "max_chars": 400,
        "description": "Musical or vocal closing that seals the work"
    },
    "talisman_suggestion": {
        "type": "tool",
        "min_chars": 50,
        "max_chars": 300,
        "description": "An object to carry the working's energy"
    },
    
    # Katherine blocks
    "title_block": {
        "type": "header",
        "min_chars": 10,
        "max_chars": 100,
        "description": "Formal title of the working"
    },
    "intent_statement": {
        "type": "context",
        "min_chars": 50,
        "max_chars": 300,
        "description": "Precise, testable statement of intent"
    },
    "setting_requirements": {
        "type": "preparation",
        "min_chars": 100,
        "max_chars": 400,
        "description": "Exact requirements for space, time, condition"
    },
    "materials_list": {
        "type": "tool",
        "min_chars": 100,
        "max_chars": 500,
        "description": "Detailed materials with purposes and substitutions"
    },
    "safety_ethics": {
        "type": "ethics",
        "min_chars": 100,
        "max_chars": 400,
        "description": "Clear safety considerations and ethical framework"
    },
    "opening_boundary": {
        "type": "opening",
        "min_chars": 100,
        "max_chars": 400,
        "description": "Formal establishment of sacred space"
    },
    "rule_of_three": {
        "type": "discernment",
        "min_chars": 100,
        "max_chars": 400,
        "description": "Three tests: Is it true? Is it consensual? Is it mine to act on?"
    },
    "invocation": {
        "type": "invocation",
        "min_chars": 100,
        "max_chars": 500,
        "description": "Formal calling of energies or acknowledgment of lineage"
    },
    "working_steps": {
        "type": "working",
        "min_chars": 300,
        "max_chars": 1200,
        "description": "Detailed, numbered steps of the ritual"
    },
    "closing_ceremony": {
        "type": "closing",
        "min_chars": 150,
        "max_chars": 500,
        "description": "Formal closing with license to depart"
    },
    "record_prompts": {
        "type": "integration",
        "min_chars": 100,
        "max_chars": 400,
        "description": "What to document: observations, feelings, results"
    },
    "empowerment_line": {
        "type": "closing",
        "min_chars": 20,
        "max_chars": 150,
        "description": "Final empowering statement in Katherine's voice"
    },
    
    # Theresa blocks
    "the_question": {
        "type": "opening",
        "min_chars": 100,
        "max_chars": 400,
        "description": "Frames the investigation question clearly"
    },
    "evidence_card": {
        "type": "research",
        "min_chars": 300,
        "max_chars": 1000,
        "description": "Known facts / Likely connections / Lore & speculation - structured evidence presentation"
    },
    "observation_notes": {
        "type": "research",
        "min_chars": 200,
        "max_chars": 600,
        "description": "Field observation notes for bird watching type workings"
    },
    "why_this_matters": {
        "type": "context",
        "min_chars": 150,
        "max_chars": 500,
        "description": "Connects the pattern to the seeker's current situation"
    },
    "twenty_four_hour_action": {
        "type": "action",
        "min_chars": 100,
        "max_chars": 400,
        "description": "One concrete action to take in the next 24 hours"
    },
    "sources_block": {
        "type": "research",
        "min_chars": 100,
        "max_chars": 500,
        "description": "Sources and references for further investigation"
    },
    
    # Brenda blocks
    "memory_anchor": {
        "type": "opening",
        "min_chars": 100,
        "max_chars": 400,
        "description": "Grounds the working in a specific memory or object"
    },
    "family_story": {
        "type": "context",
        "min_chars": 150,
        "max_chars": 600,
        "description": "Weaves in family lore or a relevant ancestor story"
    },
    "letter_working": {
        "type": "working",
        "min_chars": 200,
        "max_chars": 800,
        "description": "Instructions for writing the letter"
    },
    "chronicle_prompt": {
        "type": "integration",
        "min_chars": 100,
        "max_chars": 400,
        "description": "Prompt to record in the family chronicle"
    },
    "writing_exercise": {
        "type": "practice",
        "min_chars": 100,
        "max_chars": 400,
        "description": "Specific writing exercise to complete"
    },
    
    # Shared blocks
    "ethics_note": {
        "type": "ethics",
        "min_chars": 50,
        "max_chars": 300,
        "description": "Brief ethical consideration or boundary"
    },
    "ethics_statement": {
        "type": "ethics",
        "min_chars": 100,
        "max_chars": 400,
        "description": "Full ethical statement for the working"
    }
}


# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

def get_working_type(guide_id: str, intention: str) -> Dict[str, Any]:
    """
    Determine the appropriate working type based on guide and intention.
    Returns the matching working type config or the default for that guide.
    """
    guide_types = WORKING_TYPES.get(guide_id, WORKING_TYPES.get("shigg", {}))
    intention_lower = intention.lower()
    
    # Check each working type's trigger words
    for type_id, type_config in guide_types.items():
        for trigger in type_config.get("trigger_words", []):
            if trigger in intention_lower:
                return {"type_id": type_id, **type_config}
    
    # Return the first (default) type for this guide
    default_type_id = list(guide_types.keys())[0]
    return {"type_id": default_type_id, **guide_types[default_type_id]}


def get_required_blocks(guide_id: str, working_type_id: str = None) -> List[str]:
    """
    Get the required blocks for a guide's working type.
    """
    guide_types = WORKING_TYPES.get(guide_id, WORKING_TYPES.get("shigg", {}))
    
    if working_type_id and working_type_id in guide_types:
        return guide_types[working_type_id].get("required_blocks", [])
    
    # Return default blocks for first type
    default_type = list(guide_types.values())[0]
    return default_type.get("required_blocks", [])


def get_block_template(block_name: str) -> Dict[str, Any]:
    """
    Get the template for a specific block type.
    """
    return BLOCK_TEMPLATES.get(block_name, {
        "type": "content",
        "min_chars": 50,
        "max_chars": 500,
        "description": f"Content block: {block_name}"
    })


def get_default_block_count(guide_id: str) -> int:
    """
    Get the default block count for a guide.
    """
    guide_types = WORKING_TYPES.get(guide_id, WORKING_TYPES.get("shigg", {}))
    if guide_types:
        default_type = list(guide_types.values())[0]
        return default_type.get("block_count", 7)
    return 7


def build_deterministic_plan(guide_id: str, intention: str, research_packet: dict) -> dict:
    """
    Build a deterministic plan without calling LLM.
    Used for QUICK tier to save time.
    """
    working_type = get_working_type(guide_id, intention)
    required_blocks = working_type.get("required_blocks", [])
    
    # Build basic plan from config
    plan = {
        "spell_title": f"A {working_type['name']}",
        "spell_subtitle": "Crafted for your intention",
        "guide_id": guide_id,
        "working_type": working_type["type_id"],
        "structure_template": f"{guide_id}_{working_type['type_id']}",
        "section_order": required_blocks,
        "block_count": len(required_blocks),
        "variation_tokens": {},
        "text_tokens": {},
        "selected_facts": research_packet.get("facts", [])[:3],
        "selected_sources": research_packet.get("sources", [])[:3],
        "materials_plan": [
            {"name": "candle", "purpose": "focus", "substitution": "LED candle"},
            {"name": "paper", "purpose": "intention", "substitution": "journal"}
        ],
        "step_outline": [
            {"step_num": i+1, "action_type": block.replace("_", " "), "brief": f"Complete {block}"}
            for i, block in enumerate(required_blocks[:5])
        ],
        "persona_lock": {
            "props": ["candle", "paper"],
            "sensory_cue": "warmth",
            "signature_move": "gentle breath"
        },
        "planner_mode": "deterministic"
    }
    
    return plan
