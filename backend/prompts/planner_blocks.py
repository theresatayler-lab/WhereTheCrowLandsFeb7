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
    ],
    "theresa": [
        {"id": "theresa_1", "focal": "magnifying glass over family tree with red threads", "frame": "documentary corkboard border with pinned corners"},
        {"id": "theresa_2", "focal": "crow perched on open notebook with compass", "frame": "manila folder edge border with stamps"},
        {"id": "theresa_3", "focal": "camera lens reflecting gravestone inscription", "frame": "newspaper column border"},
        {"id": "theresa_4", "focal": "red thread connecting photographs on dark surface", "frame": "geometric investigation board frame"},
        {"id": "theresa_5", "focal": "skeleton key crossing pen over sealed envelope", "frame": "archival document border with wax seal"},
        {"id": "theresa_6", "focal": "binoculars with crow feather and map fragments", "frame": "cartographic border with compass rose"}
    ],
    "brenda": [
        {"id": "brenda_1", "focal": "typewriter with crow perched on carriage return", "frame": "vintage photograph border with scalloped edges"},
        {"id": "brenda_2", "focal": "stack of letters tied with ribbon beside candle", "frame": "recipe card border with handwritten notes"},
        {"id": "brenda_3", "focal": "locket open showing tiny photographs", "frame": "family album border with pressed flowers"},
        {"id": "brenda_4", "focal": "crow on garden gate with breadcrumbs below", "frame": "picket fence and vine border"},
        {"id": "brenda_5", "focal": "index cards with recipes spread on kitchen table", "frame": "warm sepia domestic border with lace"},
        {"id": "brenda_6", "focal": "old clock beside family photographs and pen", "frame": "ornate mantelpiece frame with botanical accents"}
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

# =============================================================================
# WORKING TYPES - Each persona delivers DIFFERENT kinds of experiences
# Not every guide gives you a "spell". Shigg might give you a poem and send
# you to find a bird. Cathleen might teach you a protective hum. Katherine
# might give you a structured protocol with documentation.
# =============================================================================

WORKING_TYPES = {
    "shigg": {
        "comfort_ritual": {
            "description": "Tea ceremony or domestic ritual with intention setting",
            "trigger_keywords": ["calm", "peace", "comfort", "grief", "loss", "morning", "routine", "settle", "rest", "soothe", "gentle"],
            "trigger_feelings": ["calm", "softened"],
            "block_sequence": [
                {"type": "cold_open", "required": True},
                {"type": "materials", "required": True},
                {"type": "choice", "required": True},
                {"type": "lore_vignette", "required": True},
                {"type": "stepper", "required": True},
                {"type": "bird_oracle", "required": True},
                {"type": "journal_prompt", "required": True},
                {"type": "closing", "required": True}
            ],
            "specialty_blocks": ["bird_oracle", "journal_prompt"],
            "content_instruction": "A warm, domestic ritual centered on tea, kitchen, or hearth. Materials should be everyday household items. Steps are gentle and rhythmic."
        },
        "bird_oracle_reading": {
            "description": "Bird augury observation task - go outside, watch, listen, interpret",
            "trigger_keywords": ["guidance", "sign", "message", "direction", "lost", "confused", "answer", "bird", "nature", "outside"],
            "trigger_feelings": ["clear"],
            "block_sequence": [
                {"type": "cold_open", "required": True},
                {"type": "lore_vignette", "required": True},
                {"type": "bird_oracle", "required": True},
                {"type": "observation_task", "required": True},
                {"type": "choice", "required": True},
                {"type": "journal_prompt", "required": True},
                {"type": "closing", "required": True}
            ],
            "specialty_blocks": ["bird_oracle", "observation_task"],
            "content_instruction": "NO materials list, NO candles. Send the seeker OUTSIDE to watch birds. The bird_oracle block names a specific bird to watch for and what its appearance means. The observation_task gives them a specific outdoor task (sit by a specific type of tree, walk a particular path, watch from a window at dawn). Shigg is sending them on a gentle quest, not performing a ritual."
        },
        "poetry_working": {
            "description": "A poem to read with contemplation and one small symbolic action",
            "trigger_keywords": ["meaning", "beauty", "inspire", "wisdom", "words", "understand", "perspective", "poetry", "read"],
            "trigger_feelings": ["softened", "calm"],
            "block_sequence": [
                {"type": "cold_open", "required": True},
                {"type": "poetry_reading", "required": True},
                {"type": "lore_vignette", "required": True},
                {"type": "stepper", "required": True},
                {"type": "choice", "required": True},
                {"type": "journal_prompt", "required": True},
                {"type": "closing", "required": True}
            ],
            "specialty_blocks": ["poetry_reading"],
            "content_instruction": "The poetry_reading block contains a specific poem or passage (from the Rubaiyat, Yeats, or folk verse) with Shigg's commentary on why it matters now. The stepper has only 2-3 steps: read the poem aloud, do ONE small action (light a candle, open a window, hold a warm cup), then sit with it. This is NOT a spell - it's grandmother's wisdom delivered through literature."
        },
        "kitchen_spell": {
            "description": "Cooking or baking something specific with symbolic ingredients and intention",
            "trigger_keywords": ["nourish", "feed", "cook", "bake", "recipe", "home", "family", "gather", "warm", "hearth"],
            "trigger_feelings": ["energized", "calm"],
            "block_sequence": [
                {"type": "cold_open", "required": True},
                {"type": "materials", "required": True},
                {"type": "lore_vignette", "required": True},
                {"type": "stepper", "required": True},
                {"type": "choice", "required": True},
                {"type": "bird_oracle", "required": True},
                {"type": "closing", "required": True}
            ],
            "specialty_blocks": ["bird_oracle"],
            "content_instruction": "Materials are FOOD INGREDIENTS, not candles or crystals. The stepper is a RECIPE with symbolic meaning woven in (stir clockwise for gathering, add salt for protection, etc). Shigg is teaching you to cook something specific - a simple bread, a warming soup, a particular tea blend - where the act of making it IS the magic. Each ingredient has folk significance explained in the 'why'."
        },
        "book_recommendation": {
            "description": "Shigg recommends a specific book or passage and gives you a reading ritual",
            "trigger_keywords": ["learn", "study", "understand", "know", "curious", "deeper", "history", "tradition"],
            "trigger_feelings": ["clear"],
            "block_sequence": [
                {"type": "cold_open", "required": True},
                {"type": "further_reading", "required": True},
                {"type": "lore_vignette", "required": True},
                {"type": "choice", "required": True},
                {"type": "stepper", "required": True},
                {"type": "journal_prompt", "required": True},
                {"type": "closing", "required": True}
            ],
            "specialty_blocks": ["further_reading"],
            "content_instruction": "The further_reading block recommends 1-2 specific real books or passages with Shigg's personal commentary on why they matter. The stepper is a reading ritual: make tea, find a quiet spot, read the passage, then write one sentence about what stirred. This is Shigg as the well-read grandmother who always has the right book for what ails you."
        },
        "grief_tending": {
            "description": "Gentle grief processing through domestic ritual and bird augury",
            "trigger_keywords": ["grief", "loss", "death", "miss", "gone", "passed", "remember", "mourn", "let go", "goodbye"],
            "trigger_feelings": ["softened"],
            "block_sequence": [
                {"type": "cold_open", "required": True},
                {"type": "materials", "required": True},
                {"type": "lore_vignette", "required": True},
                {"type": "stepper", "required": True},
                {"type": "bird_oracle", "required": True},
                {"type": "choice", "required": True},
                {"type": "journal_prompt", "required": True},
                {"type": "closing", "required": True}
            ],
            "specialty_blocks": ["bird_oracle", "journal_prompt"],
            "content_instruction": "Materials are simple comfort items (a cup, a photo, bread for birds, salt). The stepper is slow and gentle - no dramatic gestures. Include leaving bread out for birds as the closing action (Shigg's signature: feeding the birds is how we tend to the dead). The bird_oracle block tells the seeker which bird carries messages from the departed. This is GENTLE. Shigg holds grief like holding a warm cup."
        }
    },

    "cathleen": {
        "voice_ward": {
            "description": "Song or hum-based protection - learn a specific sound to use as a ward",
            "trigger_keywords": ["protect", "shield", "ward", "safe", "guard", "boundary", "voice", "sing", "hum"],
            "trigger_feelings": ["protected", "brave"],
            "block_sequence": [
                {"type": "cold_open", "required": True},
                {"type": "song_prompt", "required": True},
                {"type": "lore_vignette", "required": True},
                {"type": "stepper", "required": True},
                {"type": "choice", "required": True},
                {"type": "ward", "required": True},
                {"type": "closing", "required": True}
            ],
            "specialty_blocks": ["song_prompt", "ward"],
            "content_instruction": "The song_prompt comes EARLY - voice activation before anything else. Cathleen teaches a specific hum, tone, or phrase to use as protection. The ward block defines the protection and how to activate it with voice. Materials are minimal or none - YOUR VOICE is the primary tool. Steps involve vocal exercises: humming at a specific pitch, speaking words of power, singing a short phrase. This is Cathleen as the woman whose voice could stop a room."
        },
        "threshold_ritual": {
            "description": "Doorway, boundary, or threshold protection ceremony",
            "trigger_keywords": ["home", "door", "threshold", "boundary", "enter", "leave", "cross", "gate", "window", "move"],
            "trigger_feelings": ["protected"],
            "block_sequence": [
                {"type": "cold_open", "required": True},
                {"type": "materials", "required": True},
                {"type": "lore_vignette", "required": True},
                {"type": "stepper", "required": True},
                {"type": "song_prompt", "required": True},
                {"type": "ward", "required": True},
                {"type": "choice", "required": True},
                {"type": "closing", "required": True}
            ],
            "specialty_blocks": ["song_prompt", "ward"],
            "content_instruction": "This is about PHYSICAL BOUNDARIES - doorways, windows, gates, thresholds. Materials include salt, water, a bell, or iron (not candles). Steps involve walking the boundaries of a space, marking thresholds, and sealing with voice. The ward is tied to a specific threshold. Cathleen's Irish warding traditions inform this - she marks the door like her mother's mother did."
        },
        "courage_spell": {
            "description": "Strength-building vocal and physical ritual for facing something difficult",
            "trigger_keywords": ["courage", "brave", "strong", "face", "confront", "stand", "fight", "power", "strength", "fearless"],
            "trigger_feelings": ["brave", "energized"],
            "block_sequence": [
                {"type": "cold_open", "required": True},
                {"type": "lore_vignette", "required": True},
                {"type": "song_prompt", "required": True},
                {"type": "stepper", "required": True},
                {"type": "choice", "required": True},
                {"type": "ward", "required": True},
                {"type": "closing", "required": True}
            ],
            "specialty_blocks": ["song_prompt", "ward"],
            "content_instruction": "NO gentle tea rituals. This is FIERCE. Cathleen invokes the Morrigan energy - sovereignty, battle courage, the refusal to break. The song_prompt teaches a battle cry or power phrase. Steps are physical: stand tall, plant feet, breathe deep, speak with force. The ward is portable - something the seeker carries into the situation they need courage for. Cathleen is the woman who faced down the world and won."
        },
        "morrigan_devotion": {
            "description": "Devotional practice connecting to sovereignty, transformation, and fierce feminine power",
            "trigger_keywords": ["goddess", "divine", "sacred", "devotion", "morrigan", "sovereignty", "transform", "power", "feminine"],
            "trigger_feelings": ["brave", "energized"],
            "block_sequence": [
                {"type": "cold_open", "required": True},
                {"type": "materials", "required": True},
                {"type": "lore_vignette", "required": True},
                {"type": "stepper", "required": True},
                {"type": "song_prompt", "required": True},
                {"type": "choice", "required": True},
                {"type": "reflection", "required": False},
                {"type": "closing", "required": True}
            ],
            "specialty_blocks": ["song_prompt"],
            "content_instruction": "This is devotional, not casual. Materials include a crow/raven feather (real or drawn), a dark cloth, a candle. The lore_vignette tells a Morrigan story - not generic Celtic myth, but the specific tradition Cathleen's family carried from Ireland. Steps build from stillness to power. The song_prompt is an invocation. Cathleen treats this with reverence - she KNEW these forces were real."
        },
        "psychic_protection": {
            "description": "Intuition and sensitivity exercise with protective boundaries",
            "trigger_keywords": ["intuition", "psychic", "sense", "feel", "sensitive", "empathy", "overwhelm", "absorb", "energy", "drain"],
            "trigger_feelings": ["protected", "calm"],
            "block_sequence": [
                {"type": "cold_open", "required": True},
                {"type": "safety_note", "required": True},
                {"type": "lore_vignette", "required": True},
                {"type": "stepper", "required": True},
                {"type": "song_prompt", "required": True},
                {"type": "ward", "required": True},
                {"type": "choice", "required": True},
                {"type": "closing", "required": True}
            ],
            "specialty_blocks": ["song_prompt", "ward", "safety_note"],
            "content_instruction": "Cathleen was a known psychic. This working helps sensitive people protect themselves. The safety_note addresses psychic overwhelm without dismissing it. Steps teach grounding, boundary-setting, and discernment between your feelings and others'. The ward is specifically for psychic protection - a 'cloak' activated by humming. Cathleen validates the experience while teaching practical protection. 'Sometimes one simply knows, doesn't one?'"
        },
        "secret_keeping": {
            "description": "A working for things that must be kept private - discretion as power",
            "trigger_keywords": ["secret", "private", "silence", "discretion", "hide", "conceal", "quiet", "unseen", "invisible"],
            "trigger_feelings": ["protected"],
            "block_sequence": [
                {"type": "cold_open", "required": True},
                {"type": "lore_vignette", "required": True},
                {"type": "materials", "required": True},
                {"type": "stepper", "required": True},
                {"type": "choice", "required": True},
                {"type": "ward", "required": True},
                {"type": "closing", "required": True}
            ],
            "specialty_blocks": ["ward"],
            "content_instruction": "Cathleen's wartime discretion - 'Loose lips sink ships.' This working is about the power of silence and secrecy. Materials might include a sealed envelope, a locked box, a knotted cord. Steps involve binding silence, sealing what must not be spoken. The lore_vignette draws on wartime secrecy, the Land Army, things women knew but never said. The ward seals the secret. Cathleen understood that some power comes from what you DON'T say."
        }
    },

    "katherine": {
        "precision_protocol": {
            "description": "Step-by-step ceremonial working with exact timings and documentation",
            "trigger_keywords": ["ritual", "ceremony", "formal", "structured", "proper", "traditional", "ceremonial", "thorough", "complete"],
            "trigger_feelings": ["clear"],
            "block_sequence": [
                {"type": "cold_open", "required": True},
                {"type": "safety_note", "required": True},
                {"type": "materials", "required": True},
                {"type": "choice", "required": True},
                {"type": "lore_vignette", "required": True},
                {"type": "stepper", "required": True},
                {"type": "reflection", "required": True},
                {"type": "closing", "required": True}
            ],
            "specialty_blocks": ["safety_note", "reflection"],
            "content_instruction": "This is Katherine's bread and butter - a proper, documented protocol. Safety_note comes BEFORE materials (methodology-first). Materials are specific with exact quantities and documented correspondences. Steps have precise timings. The reflection block is a documentation prompt: what happened, what you observed, what needs refinement. Katherine runs her workings like experiments - repeatable, testable, refinable."
        },
        "shadow_integration": {
            "description": "Structured shadow work exercise with journaling framework and mirror work",
            "trigger_keywords": ["shadow", "dark", "hidden", "fear", "unconscious", "truth", "reveal", "confront", "face", "accept", "integrate"],
            "trigger_feelings": ["clear", "brave"],
            "block_sequence": [
                {"type": "cold_open", "required": True},
                {"type": "safety_note", "required": True},
                {"type": "lore_vignette", "required": True},
                {"type": "stepper", "required": True},
                {"type": "choice", "required": True},
                {"type": "reflection", "required": True},
                {"type": "closing", "required": True}
            ],
            "specialty_blocks": ["safety_note", "reflection"],
            "content_instruction": "NO materials list needed - this is inner work. Safety_note addresses psychological boundaries and when to stop. The stepper is a structured self-inquiry: mirror gazing, journaling prompts, the Rule of Three Tests (Is it true? Is it consensual? Is it mine to act on?). Katherine treats shadow work as Victorian evidence-gathering applied to the psyche. The reflection block is extensive - this is where the real work happens. Truth-dark, not horror-dark."
        },
        "sigil_creation": {
            "description": "Methodical sigil design, activation, and documentation",
            "trigger_keywords": ["sigil", "symbol", "draw", "create", "design", "mark", "seal", "bind", "inscription"],
            "trigger_feelings": ["clear", "energized"],
            "block_sequence": [
                {"type": "cold_open", "required": True},
                {"type": "safety_note", "required": True},
                {"type": "materials", "required": True},
                {"type": "lore_vignette", "required": True},
                {"type": "stepper", "required": True},
                {"type": "choice", "required": True},
                {"type": "reflection", "required": True},
                {"type": "closing", "required": True}
            ],
            "specialty_blocks": ["safety_note", "reflection"],
            "content_instruction": "Materials are specific drawing tools: pen, paper, compass, ruler (Katherine's precision). The stepper teaches a sigil creation method step by step - letter reduction, geometric construction, or thread-path design. Lore_vignette connects to Golden Dawn sigil traditions or Spitalfields weaving patterns. The reflection block documents the sigil's creation, intended purpose, and activation conditions. Katherine treats sigil-making as a craft skill, not mystical hand-waving."
        },
        "correspondence_working": {
            "description": "Thread, needle, or fabric-based sympathetic magic with precise instructions",
            "trigger_keywords": ["thread", "needle", "stitch", "sew", "bind", "connect", "tie", "weave", "fabric", "pattern", "mend", "repair"],
            "trigger_feelings": ["calm", "clear"],
            "block_sequence": [
                {"type": "cold_open", "required": True},
                {"type": "materials", "required": True},
                {"type": "safety_note", "required": True},
                {"type": "lore_vignette", "required": True},
                {"type": "stepper", "required": True},
                {"type": "choice", "required": True},
                {"type": "reflection", "required": True},
                {"type": "closing", "required": True}
            ],
            "specialty_blocks": ["safety_note", "reflection"],
            "content_instruction": "Katherine was from Spitalfields weavers and dressmakers. Materials are textiles: specific thread colors, a needle, fabric scraps, scissors. The stepper teaches an actual sewing/knotting technique with magical correspondence - each stitch or knot has meaning. Lore_vignette connects to the Spitalfields weaving community and sympathetic magic traditions (as above, so below). This is CRAFT as magic - the seamstress's power in every stitch."
        },
        "truth_revealing": {
            "description": "Evidence-gathering revelation practice using scrying, divination protocols, or systematic inquiry",
            "trigger_keywords": ["truth", "reveal", "discover", "uncover", "know", "secret", "hidden", "answer", "question", "investigate"],
            "trigger_feelings": ["clear"],
            "block_sequence": [
                {"type": "cold_open", "required": True},
                {"type": "safety_note", "required": True},
                {"type": "materials", "required": True},
                {"type": "lore_vignette", "required": True},
                {"type": "stepper", "required": True},
                {"type": "choice", "required": True},
                {"type": "evidence_card", "required": True},
                {"type": "reflection", "required": True},
                {"type": "closing", "required": True}
            ],
            "specialty_blocks": ["safety_note", "evidence_card", "reflection"],
            "content_instruction": "Materials include a mirror, a candle, and paper for documentation. The stepper is a structured inquiry protocol: state the question precisely, apply the Rule of Three Tests, perform the divination (mirror scrying, thread pendulum, or card pull), and DOCUMENT the results. The evidence_card classifies findings as Known/Likely/Lore. Katherine treats truth-seeking as Victorian spiritualism at its best - rigorous, documented, honest about uncertainty."
        },
        "victorian_seance_protocol": {
            "description": "Structured spirit contact or ancestor communication using Victorian séance methodology",
            "trigger_keywords": ["ancestor", "spirit", "dead", "contact", "seance", "medium", "communicate", "message", "departed"],
            "trigger_feelings": ["clear", "softened"],
            "block_sequence": [
                {"type": "cold_open", "required": True},
                {"type": "safety_note", "required": True},
                {"type": "materials", "required": True},
                {"type": "lore_vignette", "required": True},
                {"type": "stepper", "required": True},
                {"type": "choice", "required": True},
                {"type": "reflection", "required": True},
                {"type": "closing", "required": True}
            ],
            "specialty_blocks": ["safety_note", "reflection"],
            "content_instruction": "Safety_note is CRITICAL here - addresses consent, boundaries, and when to stop. Materials are specific Victorian séance items: a candle, a mirror, a dark cloth, paper and pen. The stepper follows a formal protocol with opening, invocation, listening period, and formal closing. Lore_vignette draws on Victorian Spiritualist traditions and evidence-based mediumship. Katherine brings PROTOCOL to what others treat casually. 'Precision isn't coldness, it's care.'"
        }
    },

    "theresa": {
        "pattern_investigation": {
            "description": "Investigating family or personal patterns through evidence-gathering and connection-mapping",
            "trigger_keywords": ["pattern", "family", "repeat", "cycle", "generation", "ancestor", "inherited", "break", "change"],
            "trigger_feelings": ["clear"],
            "block_sequence": [
                {"type": "cold_open", "required": True},
                {"type": "evidence_card", "required": True},
                {"type": "lore_vignette", "required": True},
                {"type": "stepper", "required": True},
                {"type": "choice", "required": True},
                {"type": "journal_prompt", "required": True},
                {"type": "closing", "required": True}
            ],
            "specialty_blocks": ["evidence_card", "journal_prompt"],
            "content_instruction": "Theresa treats this as investigation, not mysticism. The evidence_card maps what's Known/Likely/Lore about the pattern. Steps involve research, documentation, and one decisive action to break or acknowledge the pattern. This is the granddaughter who broke the family's veil spell through asking questions nobody wanted answered."
        },
        "truth_seeking": {
            "description": "Following threads of evidence to uncover what's been hidden or obscured",
            "trigger_keywords": ["truth", "hidden", "secret", "uncover", "investigate", "discover", "reveal", "know"],
            "trigger_feelings": ["clear", "brave"],
            "block_sequence": [
                {"type": "cold_open", "required": True},
                {"type": "evidence_card", "required": True},
                {"type": "choice", "required": True},
                {"type": "lore_vignette", "required": True},
                {"type": "stepper", "required": True},
                {"type": "journal_prompt", "required": True},
                {"type": "closing", "required": True}
            ],
            "specialty_blocks": ["evidence_card", "journal_prompt"],
            "content_instruction": "Evidence card comes second - classify what you know before you begin. Theresa treats the seeker as a fellow investigator. Steps follow a structured inquiry: name the suspicion, sort evidence, follow the strongest thread, document findings. 'Here's what the evidence shows...'"
        },
        "veil_breaking": {
            "description": "Breaking family silence, denial, or secrets that have been hidden across generations",
            "trigger_keywords": ["secret", "silence", "veil", "denial", "lie", "cover", "unsaid", "taboo", "shame", "hide"],
            "trigger_feelings": ["brave", "clear"],
            "block_sequence": [
                {"type": "cold_open", "required": True},
                {"type": "evidence_card", "required": True},
                {"type": "lore_vignette", "required": True},
                {"type": "choice", "required": True},
                {"type": "stepper", "required": True},
                {"type": "journal_prompt", "required": True},
                {"type": "closing", "required": True}
            ],
            "specialty_blocks": ["evidence_card", "journal_prompt"],
            "content_instruction": "This is about the family veil spell - the silence that protects and imprisons. The evidence_card classifies what is Known (documented facts), Likely (patterns that suggest), and Lore (family stories that encode truth). Steps involve naming the silence, writing what was never said, and one act of breaking the veil (speaking aloud, writing a letter, recording a testimony). Theresa broke her own family's veil spell. She knows the cost and the freedom. 'The pattern breaks here.'"
        },
        "genealogical_mapping": {
            "description": "Mapping family connections, tracing lineage, and finding magical significance in ancestry",
            "trigger_keywords": ["genealogy", "family tree", "ancestry", "lineage", "heritage", "roots", "origin", "where from", "bloodline", "history"],
            "trigger_feelings": ["clear", "calm"],
            "block_sequence": [
                {"type": "cold_open", "required": True},
                {"type": "materials", "required": True},
                {"type": "lore_vignette", "required": True},
                {"type": "stepper", "required": True},
                {"type": "choice", "required": True},
                {"type": "journal_prompt", "required": True},
                {"type": "closing", "required": True}
            ],
            "specialty_blocks": ["journal_prompt"],
            "content_instruction": "Materials are investigative tools: notebook, pen, photographs, documents, a map. The stepper guides a structured genealogical research ritual: gather what you have, arrange it chronologically, identify gaps and silences (what's MISSING is as telling as what's present), draw connections with red thread (literal or metaphorical). The journal_prompt asks the seeker to record their findings in evidence format. Theresa approaches ancestry as investigation, not nostalgia."
        },
        "red_thread_working": {
            "description": "Mapping connections between events, people, or patterns using Theresa's signature red thread method",
            "trigger_keywords": ["connect", "connection", "relationship", "thread", "link", "between", "tie", "web", "map", "diagram"],
            "trigger_feelings": ["clear", "energized"],
            "block_sequence": [
                {"type": "cold_open", "required": True},
                {"type": "materials", "required": True},
                {"type": "evidence_card", "required": True},
                {"type": "lore_vignette", "required": True},
                {"type": "stepper", "required": True},
                {"type": "choice", "required": True},
                {"type": "closing", "required": True}
            ],
            "specialty_blocks": ["evidence_card"],
            "content_instruction": "Materials are physical: red thread or string, pins or tape, paper cards, a wall or board. The evidence_card maps Known/Likely/Lore connections. The stepper teaches Theresa's investigation board method: write each element on a card, pin them up, connect related items with red thread, step back and look for the pattern you couldn't see up close. The choice asks what to do with the pattern once seen. This is Theresa's signature method - the investigation board as magical tool."
        },
        "bird_field_log": {
            "description": "Systematic bird observation as evidence-gathering and omen-reading practice",
            "trigger_keywords": ["bird", "omen", "sign", "watch", "observe", "nature", "outside", "message", "guidance", "crow"],
            "trigger_feelings": ["clear", "calm"],
            "block_sequence": [
                {"type": "cold_open", "required": True},
                {"type": "lore_vignette", "required": True},
                {"type": "bird_oracle", "required": True},
                {"type": "stepper", "required": True},
                {"type": "choice", "required": True},
                {"type": "journal_prompt", "required": True},
                {"type": "closing", "required": True}
            ],
            "specialty_blocks": ["bird_oracle", "journal_prompt"],
            "content_instruction": "Theresa's bird log is SYSTEMATIC, not mystical. The bird_oracle names a specific bird and what its behavior patterns indicate. The stepper teaches field observation: go to a specific location, sit for a timed period, record species, direction, behavior, time. The journal_prompt is a structured field log entry. Theresa treats bird augury as data collection - 'What are they doing? When? How often? The patterns tell you everything.' This is ornithology as divination."
        }
    },

    "brenda": {
        "letter_ritual": {
            "description": "Letter-writing to ancestors, future self, or those who need to hear what wasn't said",
            "trigger_keywords": ["letter", "write", "ancestor", "message", "communicate", "say", "unsaid", "words"],
            "trigger_feelings": ["softened", "brave"],
            "block_sequence": [
                {"type": "cold_open", "required": True},
                {"type": "materials", "required": True},
                {"type": "lore_vignette", "required": True},
                {"type": "stepper", "required": True},
                {"type": "choice", "required": True},
                {"type": "journal_prompt", "required": True},
                {"type": "closing", "required": True}
            ],
            "specialty_blocks": ["journal_prompt"],
            "content_instruction": "Materials are pen and paper - real writing, not digital. Brenda believes in the power of the pen. The stepper guides the letter-writing: addressing, opening, the difficult middle, and closing. Lore_vignette connects to Dion Fortune's war letters or family chronicle traditions. 'Write it down before it's lost.'"
        },
        "memory_anchoring": {
            "description": "Using objects, photographs, or places to anchor and honor family memories",
            "trigger_keywords": ["memory", "remember", "forget", "photo", "object", "keepsake", "heirloom", "past", "family"],
            "trigger_feelings": ["softened", "calm"],
            "block_sequence": [
                {"type": "cold_open", "required": True},
                {"type": "materials", "required": True},
                {"type": "lore_vignette", "required": True},
                {"type": "stepper", "required": True},
                {"type": "choice", "required": True},
                {"type": "journal_prompt", "required": True},
                {"type": "closing", "required": True}
            ],
            "specialty_blocks": ["journal_prompt"],
            "content_instruction": "Materials are PERSONAL items: a photograph, a family object, something inherited. The stepper involves holding the object, describing it in writing, recording what it means. Brenda is the family chronicler - she records so nothing is lost. 'This is how we remember.'"
        }
    }
}


def select_working_type(guide_id: str, spell_spec: dict) -> tuple:
    """
    Select the most appropriate working type for a guide based on the seeker's
    query, desired feeling, and keywords. Returns (working_type_id, working_type_config).
    """
    guide_types = WORKING_TYPES.get(guide_id, {})
    if not guide_types:
        # Fallback to first available type for the guide
        return None, None

    query = spell_spec.get("user_query", "").lower()
    feeling = spell_spec.get("desired_feeling", "").lower()

    # Score each working type
    scores = {}
    for type_id, type_config in guide_types.items():
        score = 0
        # Keyword matching
        for keyword in type_config.get("trigger_keywords", []):
            if keyword in query:
                score += 2
        # Feeling matching
        if feeling in type_config.get("trigger_feelings", []):
            score += 3
        scores[type_id] = score

    # Select highest scoring, or first type as default
    if max(scores.values()) > 0:
        best_type = max(scores, key=scores.get)
    else:
        # Default to first working type for this guide
        best_type = list(guide_types.keys())[0]

    return best_type, guide_types[best_type]


# Block templates per guide - defines required block sequence
# These are the DEFAULT templates (used when working_type selection isn't available)
BLOCK_TEMPLATES = {
    "shigg": {
        "template_id": "shigg_comfort_blocks",
        "description": "Shigg's warmth: cold_open -> materials -> choice -> lore_vignette -> stepper -> bird_oracle -> reflection -> closing",
        "required_blocks": [
            {"type": "cold_open", "required": True},
            {"type": "materials", "required": True},
            {"type": "safety_note", "required": False},
            {"type": "choice", "required": True},
            {"type": "lore_vignette", "required": True},
            {"type": "stepper", "required": True},
            {"type": "bird_oracle", "required": True},
            {"type": "journal_prompt", "required": True},
            {"type": "closing", "required": True}
        ],
        "specialty_blocks": ["bird_oracle", "journal_prompt"]
    },

    "cathleen": {
        "template_id": "cathleen_voice_blocks",
        "description": "Cathleen's power: cold_open -> materials -> choice -> lore_vignette -> song_prompt -> stepper -> ward -> closing",
        "required_blocks": [
            {"type": "cold_open", "required": True},
            {"type": "materials", "required": True},
            {"type": "safety_note", "required": False},
            {"type": "choice", "required": True},
            {"type": "lore_vignette", "required": True},
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
        "description": "Katherine's method: cold_open -> materials -> safety_note -> choice -> lore_vignette -> stepper -> reflection -> closing",
        "required_blocks": [
            {"type": "cold_open", "required": True},
            {"type": "materials", "required": True},
            {"type": "safety_note", "required": True},
            {"type": "choice", "required": True},
            {"type": "lore_vignette", "required": True},
            {"type": "stepper", "required": True},
            {"type": "reflection", "required": True},
            {"type": "closing", "required": True}
        ],
        "specialty_blocks": ["safety_note", "reflection"]
    },

    "theresa": {
        "template_id": "theresa_investigation_blocks",
        "description": "Theresa's truth: cold_open -> evidence_card -> lore_vignette -> stepper -> choice -> journal_prompt -> closing",
        "required_blocks": [
            {"type": "cold_open", "required": True},
            {"type": "evidence_card", "required": True},
            {"type": "lore_vignette", "required": True},
            {"type": "stepper", "required": True},
            {"type": "choice", "required": True},
            {"type": "journal_prompt", "required": True},
            {"type": "closing", "required": True}
        ],
        "specialty_blocks": ["evidence_card", "journal_prompt"]
    },

    "brenda": {
        "template_id": "brenda_chronicle_blocks",
        "description": "Brenda's chronicle: cold_open -> materials -> lore_vignette -> stepper -> choice -> journal_prompt -> closing",
        "required_blocks": [
            {"type": "cold_open", "required": True},
            {"type": "materials", "required": True},
            {"type": "choice", "required": True},
            {"type": "lore_vignette", "required": True},
            {"type": "stepper", "required": True},
            {"type": "journal_prompt", "required": True},
            {"type": "closing", "required": True}
        ],
        "specialty_blocks": ["journal_prompt"]
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
    ],
    "brenda": [
        {"id": "dion_fortune_letters", "type": "figure", "title": "Dion Fortune's War Letters", "year": 1940, "era": "WWII", "relevance": "Magical resistance through letter-writing during wartime"},
        {"id": "family_chronicle", "type": "practice", "title": "Family Chronicle Keeping", "year": None, "era": "Timeless", "relevance": "Recording family stories as sacred preservation"},
        {"id": "corvid_messenger", "type": "tradition", "title": "Corvid as Family Messenger", "year": None, "era": "Folk", "relevance": "Crows carrying messages between the living and departed"},
        {"id": "domestic_memory_magic", "type": "practice", "title": "Domestic Memory Magic", "year": 1950, "era": "Post-War", "relevance": "Using household objects as anchors for family memory"},
        {"id": "recipe_as_spell", "type": "practice", "title": "Recipe as Spell", "year": None, "era": "Timeless", "relevance": "Cooking family recipes as acts of ancestral connection"}
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
    Now selects a WORKING TYPE to differentiate each guide's experience.
    """

    guide_id = spell_spec.get("persona_id", "shigg")
    session_id = spell_spec.get("session_id", "default")

    # === SELECT WORKING TYPE ===
    # Each guide has multiple working types (not just "spell")
    working_type_id, working_type_config = select_working_type(guide_id, spell_spec)

    # Use working type's block sequence if available, otherwise fall back to default template
    if working_type_config:
        template = {
            "template_id": f"{guide_id}_{working_type_id}",
            "description": working_type_config["description"],
            "required_blocks": working_type_config["block_sequence"],
            "specialty_blocks": working_type_config["specialty_blocks"]
        }
        content_instruction = working_type_config["content_instruction"]
    else:
        template = BLOCK_TEMPLATES.get(guide_id, BLOCK_TEMPLATES["shigg"])
        content_instruction = ""

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

    # Build working type context for the prompt
    working_type_section = ""
    if working_type_id and working_type_config:
        working_type_section = f"""
## WORKING TYPE SELECTED: {working_type_id.upper().replace('_', ' ')}
This is NOT a generic spell. This is a specific kind of working unique to {guide_config.get('name', 'Guide')}.
Description: {working_type_config['description']}

## CRITICAL CONTENT DIRECTION
{content_instruction}

This working type determines the ENTIRE structure and feel. Follow it precisely."""

    prompt = f"""## SPELL PLANNER - BLOCKS VERSION

You are planning a blocks-based working for {guide_config.get('name', 'Guide')}, {guide_config.get('title', '')}.
{working_type_section}

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
{json.dumps([b['type'] for b in template['required_blocks'] if b.get('required', True)], indent=2)}

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

## MICRO-LORE DETAILS (MUST include at least 2 in the working)
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
    "working_type": "{working_type_id or 'default'}",

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
        ...follow the block template for this working type exactly...
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

    "tarot_composition": {json.dumps(tarot_composition)},

    "tradition_tags": ["tag1", "tag2"],
    "safety_notes": ["any safety adaptations"],

    "sources_to_cite": [
        {{
            "source_id": "from research",
            "title": "Work title",
            "author": "Author name",
            "why_relevant": "How this source inspired or informs this working",
            "further_reading_note": "What the seeker would learn from reading this"
        }}
    ]
}}

## CRITICAL RULES
1. MUST include a 'choice' block (interactive decision point)
2. MUST include a 'lore_vignette' block (historical/folkloric story)
3. MUST select exactly ONE canon_anchor most relevant to the query
4. Block sequence MUST match the template for this working type
5. Include persona_lock with 2-3 props identifiable in cold_open
6. The lore_vignette MUST connect to the canon_anchor
7. sources_to_cite MUST include real sources that inspire further reading
8. If working_type specifies NO materials block, do NOT include one"""

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
