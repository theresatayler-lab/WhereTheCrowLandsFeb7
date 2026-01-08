# Persona Configuration for Spell Generation
# Contains formats, scenarios, visual DNA, practices, and sources for each archetype
# This is the SINGLE SOURCE OF TRUTH for spell personalization

from typing import List, Dict, Any, Optional

# ============================================================================
# CROWLANDS ART BIBLE - GLOBAL VISUAL TOKENS
# This is the SINGLE SOURCE OF TRUTH for the "collectible scarf/tapestry" aesthetic
# Inject these tokens into ALL image prompts (header, tarot, sigil, divider)
# ============================================================================

CROWLANDS_ART_BIBLE = {
    "style_tokens": [
        "ornate occult silk scarf illustration",
        "luxurious tapestry aesthetic",
        "ultra-detailed engraved linework",
        "etched texture with art nouveau filigree border",
        "symmetrical medallion layout",
        "collector plate finish",
        "velvet silk sheen with faint parchment undertone",
        "antique print finish"
    ],
    "palette": {
        "primary": "midnight navy (#0e1629)",
        "secondary": "oxblood burgundy (#8b2232)",
        "accent": "antique gold (#d4a84b)",
        "neutral": "bone ivory (#f5f0e6)",
        "highlight": "burnished copper"
    },
    "motif_families": {
        "british_folklore": ["crow", "magpie", "robin", "hare", "stag", "owl", "fox", "moth", "toad", "serpent"],
        "planetary": ["sun disc", "crescent moon", "seven-pointed star", "saturn sigil", "venus mirror"],
        "alchemical": ["ouroboros", "caduceus", "elemental triangles", "mercury glyph", "philosopher's stone"],
        "occult_tools": ["compass", "chalice", "candle", "key", "bell", "athame", "pentacle", "wand"],
        "gothic_botanicals": ["rosehip", "ivy", "hawthorn", "blackthorn", "holly", "mistletoe"]
    },
    "composition_rules": [
        "central medallion focus",
        "symmetrical border frames",
        "corner flourishes",
        "interstitial decorative bands"
    ],
    "hard_negatives": [
        "NO text", "NO letters", "NO words", "NO watermarks",
        "NO photorealism", "NO neon colors", "NO modern logos",
        "NO messy collage", "NO 3D render look", "NO clipart", "NO cartoon style"
    ],
    "dall_e_global_suffix": "ornate occult silk scarf tapestry illustration, ultra-detailed engraved linework, etched texture, art nouveau filigree border, symmetrical medallion layout, collector plate finish, velvet silk sheen, midnight navy and oxblood and antique gold and bone ivory palette, British folklore motifs, NO text, NO letters, NO words, NO watermark, NO photorealism, NO neon, NO modern logos, NO 3D render"
}

# ============================================================================
# ASSET ROLE LOCKS - Prevents repetition and "same-y" images
# ============================================================================

ASSET_ROLE_LOCKS = {
    "header": {
        "type": "SCENE / STILL-LIFE",
        "aspect": "wide (16:9 or 3:1)",
        "rule": "Never an emblem. Never a tarot-like medallion. Must show environment/setting.",
        "prompt_suffix": "wide scene composition, environmental still-life, NOT a medallion or emblem"
    },
    "tarot": {
        "type": "EMBLEM / SIGIL PLATE",
        "aspect": "square (1:1)",
        "rule": "No environment/room. Symmetrical. Must NOT reuse header's central object.",
        "prompt_suffix": "square emblem sigil plate, symmetrical medallion, isolated on dark background, NOT a scene"
    },
    "sigil": {
        "type": "MINIMAL LINEWORK",
        "aspect": "square (1:1)",
        "rule": "1-2 colors max, printable at small size, on parchment background.",
        "prompt_suffix": "minimal linework sigil on aged parchment, black ink only, simple geometric, printable"
    },
    "divider": {
        "type": "HORIZONTAL STRIP",
        "aspect": "wide strip (8:1)",
        "rule": "Decorative band, can be static library or generated.",
        "prompt_suffix": "horizontal decorative divider strip, ornate filigree band, symmetrical"
    }
}

def get_art_bible_prompt_suffix() -> str:
    """Get the global art bible suffix to append to ALL DALL-E prompts"""
    return CROWLANDS_ART_BIBLE["dall_e_global_suffix"]

def build_image_prompt(persona_prompt: str, asset_type: str = "header") -> str:
    """Build a complete image prompt with persona-specific + global art bible + asset role lock"""
    role_lock = ASSET_ROLE_LOCKS.get(asset_type, ASSET_ROLE_LOCKS["header"])
    return f"{persona_prompt}, {role_lock['prompt_suffix']}, {get_art_bible_prompt_suffix()}"

def get_asset_role_lock(asset_type: str) -> dict:
    """Get the role lock constraints for a specific asset type"""
    return ASSET_ROLE_LOCKS.get(asset_type, ASSET_ROLE_LOCKS["header"])


# ============================================================================
# STATIC MICRO-ICONS LIBRARY (per persona, ~12 each, simple silhouettes)
# These are NOT generated - they're static SVG icon IDs or emoji placeholders
# ============================================================================

MICRO_ICONS = {
    "shigg": {
        "teacup": "☕",
        "kettle": "🫖",
        "spoon": "🥄",
        "windowsill": "🪟",
        "herb": "🌿",
        "feather": "🪶",
        "sparrow": "🐦",
        "crow": "🐦‍⬛",
        "bread": "🍞",
        "key": "🔑",
        "star": "⭐",
        "teabag": "🫖"
    },
    "cathleen": {
        "candle": "🕯️",
        "raven": "🐦‍⬛",
        "feather": "🪶",
        "bell": "🔔",
        "moon": "🌙",
        "flame": "🔥",
        "heart": "❤️",
        "cross": "✚",
        "circle": "⭕",
        "beads": "📿",
        "star": "⭐",
        "shield": "🛡️"
    },
    "katherine": {
        "needle": "🪡",
        "thread": "🧵",
        "mirror": "🪞",
        "compass": "🧭",
        "seal": "🔏",
        "scissors": "✂️",
        "scroll": "📜",
        "hexagram": "✡️",
        "triangle": "🔺",
        "circle": "⭕",
        "key": "🔑",
        "grimoire": "📖"
    }
}

def get_micro_icons_for_persona(persona_id: str) -> dict:
    """Get static micro-icon library for a persona"""
    return MICRO_ICONS.get(persona_id, MICRO_ICONS.get("shigg"))

def get_random_micro_icons(persona_id: str, count: int = 6) -> List[dict]:
    """Get a random selection of micro-icons for variety"""
    import random
    icons = MICRO_ICONS.get(persona_id, MICRO_ICONS.get("shigg"))
    icon_list = list(icons.items())
    selected = random.sample(icon_list, min(count, len(icon_list)))
    return [{"id": icon_id, "emoji": emoji} for icon_id, emoji in selected]


# ============================================================================
# PERSONA CONFIGURATION - THE SINGLE SOURCE OF TRUTH
# ============================================================================

PERSONA_CONFIG = {
    "shigg": {
        "name": "Shigg",
        "title": "The Birds of Parliament Poet Laureate",
        "era": "Esoteric Silent Generation born in the '20s into the Blitz",
        
        "section_grammar": {
            "required_sections": ["opening_verse", "the_working", "spoken_words", "closing_gesture", "aftercare"],
            "optional_sections": ["bird_omen", "tea_ritual", "windowsill_element"],
            "section_order": ["opening_verse", "bird_omen", "the_working", "spoken_words", "closing_gesture", "aftercare"],
            "voice_style": "gentle, poetic, domestic wisdom, East End warmth"
        },
        
        # PRACTICES LIBRARY - provides procedural variety
        "practices": [
            {
                "practice_id": "tea_reading",
                "name": "Tea Leaf Reading",
                "description": "Interpreting patterns in tea leaves after drinking",
                "steps_template": ["brew loose leaf tea", "drink while focusing on question", "swirl dregs three times", "interpret patterns"],
                "materials": ["loose leaf tea", "white cup"],
                "source_id": "grieve_herbal"
            },
            {
                "practice_id": "bird_watching",
                "name": "Bird Oracle Watching",
                "description": "Reading omens from bird behavior and flight patterns",
                "steps_template": ["find quiet spot where birds gather", "still your mind", "note first bird seen", "observe direction and behavior"],
                "materials": ["patience", "outdoor space"],
                "source_id": "roux_ornithography"
            },
            {
                "practice_id": "steam_release",
                "name": "Steam Release",
                "description": "Using rising steam to carry away worries",
                "steps_template": ["boil water in kettle", "as steam rises speak what binds you", "let steam carry it away", "pour water with intention"],
                "materials": ["kettle", "water"],
                "source_id": "domestic_traditions"
            },
            {
                "practice_id": "windowsill_ward",
                "name": "Windowsill Protection",
                "description": "Creating a protective boundary at window thresholds",
                "steps_template": ["clean windowsill with salt water", "place protective object", "speak ward three times", "refresh weekly"],
                "materials": ["salt", "water", "small protective object"],
                "source_id": "domestic_traditions"
            },
            {
                "practice_id": "herb_bundle",
                "name": "Herb Bundling",
                "description": "Creating small sachets of herbs with spoken intentions",
                "steps_template": ["gather herbs on cloth", "speak intention into each", "bundle with three knots", "carry or place"],
                "materials": ["dried herbs", "small cloth", "string"],
                "source_id": "grieve_herbal"
            },
            {
                "practice_id": "verse_meditation",
                "name": "Rubáiyát Verse Meditation",
                "description": "Using poetry verses as meditative anchors",
                "steps_template": ["select verse that speaks", "read aloud three times", "sit with its meaning", "journal response"],
                "materials": ["book of verses", "journal"],
                "source_id": "rubaiyat"
            }
        ],
        
        "formats": [
            {
                "format_id": "kitchen_charm",
                "description": "Simple domestic magic performed in the kitchen",
                "section_order": ["introduction", "materials", "preparation", "the_working", "spoken_words", "closing_gesture"],
                "tone_range": ["gentle", "practical"],
                "linked_scenarios": ["kettle_charm", "herb_packet", "tea_ring_unknotting"]
            },
            {
                "format_id": "bird_oracle",
                "description": "Divination and guidance through bird signs",
                "section_order": ["introduction", "materials", "opening_verse", "bird_omen", "the_working", "spoken_words", "aftercare"],
                "tone_range": ["gentle", "practical", "intense"],
                "linked_scenarios": ["bird_omen_reading"]
            },
            {
                "format_id": "windowsill_ward",
                "description": "Protective magic using the threshold of the window",
                "section_order": ["introduction", "materials", "preparation", "windowsill_element", "the_working", "spoken_words", "closing_gesture"],
                "tone_range": ["gentle", "practical"],
                "linked_scenarios": ["windowsill_ward"]
            },
            {
                "format_id": "tea_meditation",
                "description": "Contemplative ritual centered on tea preparation",
                "section_order": ["introduction", "materials", "tea_ritual", "the_working", "spoken_words", "aftercare"],
                "tone_range": ["gentle"],
                "linked_scenarios": ["kettle_charm", "tea_ring_unknotting"]
            },
            {
                "format_id": "verse_working",
                "description": "Poetry-driven spell with Rubáiyát influences",
                "section_order": ["introduction", "opening_verse", "materials", "the_working", "spoken_words", "closing_gesture", "aftercare"],
                "tone_range": ["gentle", "intense"],
                "linked_scenarios": ["bird_omen_reading", "tea_ring_unknotting"]
            }
        ],
        
        "scenarios": [
            {
                "scenario_id": "kettle_charm",
                "name": "The Kettle Charm",
                "best_for": ["calm", "protected", "softened"],
                "description": "Transform the daily ritual of boiling water into intention-setting",
                "required_sections": ["introduction", "materials", "tea_ritual", "the_working", "spoken_words"],
                "anchor_objects": ["tea", "salt"],
                "settings": ["kitchen"],
                "sample_steps": ["Fill kettle with fresh water, speaking your need", "As steam rises, release what binds you", "Pour with intention, let warmth be your answer"],
                "linked_format": "kitchen_charm",
                "linked_practices": ["tea_reading", "steam_release"]
            },
            {
                "scenario_id": "windowsill_ward",
                "name": "The Windowsill Ward",
                "best_for": ["protected", "calm", "clear"],
                "description": "Create a protective boundary at the threshold between inside and out",
                "required_sections": ["introduction", "materials", "windowsill_element", "the_working", "spoken_words", "closing_gesture"],
                "anchor_objects": ["salt", "bird", "candle"],
                "settings": ["kitchen", "bedroom"],
                "sample_steps": ["Clean the sill with salt water, wiping away what came before", "Place your anchor object facing outward", "Speak the ward three times as morning light touches it"],
                "linked_format": "windowsill_ward",
                "linked_practices": ["windowsill_ward"]
            },
            {
                "scenario_id": "bird_omen_reading",
                "name": "The Bird Omen Reading",
                "best_for": ["clear", "brave", "calm"],
                "description": "Seek guidance by observing and interpreting bird behavior",
                "required_sections": ["introduction", "materials", "bird_omen", "the_working", "spoken_words", "aftercare"],
                "anchor_objects": ["bird", "tea"],
                "settings": ["outdoors", "kitchen"],
                "sample_steps": ["Sit where birds gather, with tea in hand", "Ask your question silently three times", "Note the first bird: its direction, its call, its company"],
                "linked_format": "bird_oracle",
                "linked_practices": ["bird_watching", "tea_reading"]
            },
            {
                "scenario_id": "tea_ring_unknotting",
                "name": "The Tea-Ring Unknotting",
                "best_for": ["calm", "softened", "clear"],
                "description": "Use the circular stain of a teacup to release tangled thoughts",
                "required_sections": ["introduction", "materials", "tea_ritual", "the_working", "spoken_words", "closing_gesture"],
                "anchor_objects": ["tea"],
                "settings": ["kitchen", "desk"],
                "sample_steps": ["Let your cup leave its ring on paper", "Trace the circle with your finger, naming each knot", "Fold the paper small, then smaller, then burn or bury"],
                "linked_format": "tea_meditation",
                "linked_practices": ["tea_reading", "verse_meditation"]
            },
            {
                "scenario_id": "herb_packet",
                "name": "The Herb Packet",
                "best_for": ["protected", "energized", "brave"],
                "description": "Create a small bundle of herbs and intentions to carry",
                "required_sections": ["introduction", "materials", "the_working", "spoken_words", "closing_gesture", "aftercare"],
                "anchor_objects": ["tea", "salt"],
                "settings": ["kitchen"],
                "sample_steps": ["Gather your herbs on a small cloth square", "Speak your need into each herb as you add it", "Tie with three knots: one for past, one for present, one for what comes"],
                "linked_format": "kitchen_charm",
                "linked_practices": ["herb_bundle"]
            }
        ],
        
        "visual_dna": {
            "constants": {
                "primary_motif": "birds (especially crows, robins, sparrows), feathers, nests",
                "secondary_motif": "teacups, kettles, windowsills, morning light, domestic hearth wisdom",
                "era_aesthetic": "1940s Blitz-era London, East End warmth, wartime resilience, poetic domestic magic",
                "art_style": "Edmund J. Sullivan pen-and-ink with sepia wash, Victorian book illustration, ink and aged paper tones with subtle warmth"
            },
            "motif_library": [
                "crow", "robin", "sparrow", "raven silhouette", "feather", "nest", 
                "teacup", "kettle", "windowsill", "morning light", "steam curls",
                "breadcrumb", "rose", "key", "threshold", "dawn sky"
            ],
            "palette_variants": {
                "gentle": ["warm sepia", "aged cream", "soft dove grey", "tea-stain brown"],
                "practical": ["ink black", "parchment cream", "antique gold accent", "midnight navy"],
                "intense": ["deep crow black", "burnished gold", "oxblood accent", "storm grey"]
            },
            "avoid": [
                "Celtic knots", "Morrigan imagery", "séance elements", "Victorian mourning",
                "photorealistic", "neon colors", "modern imagery", "bright saturated colors"
            ],
            "dall_e_rules": "pen-and-ink line illustration with sepia and antique gold accents, Victorian book plate style, cross-hatching, bird silhouettes and feathers, domestic hearth motifs, warm ink tones on aged parchment, subtle gold and navy highlights permitted",
            "header_scene": "crow perched on windowsill with teacup and morning light, Victorian ink illustration style",
            "tarot_emblem": "crow silhouette with teacup and feather arrangement, circular border"
        },
        
        # ALLOWED SOURCES with IDs, links, and reference_class
        "allowed_sources": [
            {
                "source_id": "rubaiyat",
                "author": "Edward FitzGerald",
                "work": "Rubáiyát of Omar Khayyám",
                "year": 1859,
                "reference_class": "primary",
                "archive_link": "/library"
            },
            {
                "source_id": "hughes_crow",
                "author": "Ted Hughes",
                "work": "Crow: From the Life and Songs of the Crow",
                "year": 1970,
                "reference_class": "secondary",
                "archive_link": "/library"
            },
            {
                "source_id": "domestic_traditions",
                "author": "Traditional",
                "work": "British Kitchen Folklore",
                "year": None,
                "reference_class": "traditional",
                "archive_link": "/rituals"
            },
            {
                "source_id": "east_end",
                "author": "Traditional",
                "work": "East End Domestic Traditions",
                "year": None,
                "reference_class": "traditional",
                "archive_link": "/rituals"
            },
            {
                "source_id": "roux_ornithography",
                "author": "Jessica Roux",
                "work": "Ornithography: An Illustrated Guide to Bird Lore",
                "year": 2021,
                "reference_class": "secondary",
                "archive_link": "/library"
            },
            {
                "source_id": "grieve_herbal",
                "author": "Maud Grieve",
                "work": "A Modern Herbal",
                "year": 1931,
                "reference_class": "primary",
                "archive_link": "/library"
            }
        ]
    },
    
    "cathleen": {
        "name": "Cathleen",
        "title": "The Singer of Strength",
        "era": "WWII Homefront - Land Army, WRENS & Celtic-Irish Resistance (1940s)",
        
        "section_grammar": {
            "required_sections": ["invocation", "the_working", "voice_element", "closing_seal", "aftercare"],
            "optional_sections": ["morrigan_call", "circle_casting", "talisman_charging"],
            "section_order": ["invocation", "morrigan_call", "circle_casting", "the_working", "voice_element", "closing_seal", "aftercare"],
            "voice_style": "warm, protective, wartime sisterhood, Irish-inflected, quiet strength, 'careless talk costs lives' restraint"
        },
        
        # PRACTICES LIBRARY
        "practices": [
            {
                "practice_id": "voice_warding",
                "name": "Voice Warding",
                "description": "Using sung or hummed notes to create protective barriers",
                "steps_template": ["find your grounding note", "let it resonate in chest", "expand note outward", "shape into protective sphere"],
                "materials": ["your voice", "quiet space"],
                "source_id": "irish_folk"
            },
            {
                "practice_id": "candle_speech",
                "name": "Candle Speech",
                "description": "Speaking intentions into flame to send them forth",
                "steps_template": ["light candle", "speak intention clearly", "watch flame respond", "seal with breath"],
                "materials": ["candle", "matches"],
                "source_id": "home_spiritualism"
            },
            {
                "practice_id": "talisman_charging",
                "name": "Talisman Charging",
                "description": "Infusing small objects with protective intention",
                "steps_template": ["hold object", "breathe intention three times", "pass through candle smoke", "carry close"],
                "materials": ["small meaningful object", "candle"],
                "source_id": "dion_fortune"
            },
            {
                "practice_id": "circle_walking",
                "name": "Circle Walking",
                "description": "Creating sacred space through intentional movement",
                "steps_template": ["mark center", "walk boundary clockwise", "pause at each quarter", "seal with voice"],
                "materials": ["salt or cord for marking", "voice"],
                "source_id": "home_spiritualism"
            },
            {
                "practice_id": "keening",
                "name": "Keening Release",
                "description": "Using wordless vocal expression to move grief",
                "steps_template": ["create safe space", "let sound emerge without words", "allow voice to carry feeling", "rest in silence after"],
                "materials": ["private space", "time"],
                "source_id": "irish_folk"
            },
            {
                "practice_id": "morrigan_invocation",
                "name": "Morrigan Calling",
                "description": "Invoking the Morrigan for transformation and courage",
                "steps_template": ["face west at dusk", "speak her names", "state what must change", "accept what comes"],
                "materials": ["crow feather optional", "courage"],
                "source_id": "morrigan_book"
            }
        ],
        
        "formats": [
            {
                "format_id": "home_blessing",
                "description": "Protective blessing for household and family",
                "section_order": ["introduction", "materials", "invocation", "the_working", "voice_element", "closing_seal"],
                "tone_range": ["gentle", "practical"],
                "linked_scenarios": ["home_circle_blessing", "token_talisman"]
            },
            {
                "format_id": "voice_ward",
                "description": "Using song or spoken word as primary magical tool",
                "section_order": ["introduction", "materials", "invocation", "voice_element", "the_working", "closing_seal", "aftercare"],
                "tone_range": ["gentle", "practical", "intense"],
                "linked_scenarios": ["voice_ward", "keening_container"]
            },
            {
                "format_id": "morrigan_working",
                "description": "Calling on the Morrigan for transformation or protection",
                "section_order": ["introduction", "materials", "invocation", "morrigan_call", "the_working", "voice_element", "closing_seal"],
                "tone_range": ["intense"],
                "linked_scenarios": ["home_circle_blessing"]
            },
            {
                "format_id": "circle_ritual",
                "description": "Formal circle casting for focused intention",
                "section_order": ["introduction", "materials", "invocation", "circle_casting", "the_working", "voice_element", "closing_seal", "aftercare"],
                "tone_range": ["practical", "intense"],
                "linked_scenarios": ["home_circle_blessing"]
            },
            {
                "format_id": "talisman_work",
                "description": "Charging and empowering protective objects",
                "section_order": ["introduction", "materials", "invocation", "talisman_charging", "the_working", "closing_seal"],
                "tone_range": ["gentle", "practical"],
                "linked_scenarios": ["token_talisman"]
            }
        ],
        
        "scenarios": [
            {
                "scenario_id": "home_circle_blessing",
                "name": "The Home Circle Blessing",
                "best_for": ["protected", "calm", "softened"],
                "description": "Create a protective circle around your living space",
                "required_sections": ["introduction", "materials", "invocation", "circle_casting", "the_working", "voice_element", "closing_seal"],
                "anchor_objects": ["candle", "salt", "song"],
                "settings": ["kitchen", "bedroom"],
                "sample_steps": ["Walk the boundary of your space with salt", "At each corner, pause and hum a note that feels right", "Return to center and seal with your full voice"],
                "linked_format": "circle_ritual",
                "linked_practices": ["circle_walking", "voice_warding"]
            },
            {
                "scenario_id": "voice_ward",
                "name": "The Voice Ward",
                "best_for": ["protected", "brave", "energized"],
                "description": "Use your voice as a shield and sword",
                "required_sections": ["introduction", "materials", "invocation", "voice_element", "the_working", "closing_seal", "aftercare"],
                "anchor_objects": ["song", "candle"],
                "settings": ["bedroom", "bath", "outdoors"],
                "sample_steps": ["Find a note that resonates in your chest", "Let it grow from hum to tone to word", "Shape the word into your intention, let it fill the room"],
                "linked_format": "voice_ward",
                "linked_practices": ["voice_warding", "candle_speech"]
            },
            {
                "scenario_id": "keening_container",
                "name": "The Keening Container",
                "best_for": ["softened", "calm", "clear"],
                "description": "Give grief or pain a voice so it can move through you",
                "required_sections": ["introduction", "materials", "invocation", "voice_element", "the_working", "closing_seal", "aftercare"],
                "anchor_objects": ["song", "candle", "mirror"],
                "settings": ["bath", "bedroom"],
                "sample_steps": ["Light your candle and sit with what weighs on you", "Let sound come—no words needed, just the sound of feeling", "When empty, blow out the candle and release the smoke"],
                "linked_format": "voice_ward",
                "linked_practices": ["keening", "candle_speech"]
            },
            {
                "scenario_id": "token_talisman",
                "name": "The Token Talisman",
                "best_for": ["protected", "brave", "energized"],
                "description": "Charge a small object to carry your intention",
                "required_sections": ["introduction", "materials", "invocation", "talisman_charging", "the_working", "closing_seal"],
                "anchor_objects": ["thread", "candle", "salt"],
                "settings": ["kitchen", "bedroom", "desk"],
                "sample_steps": ["Hold your object and feel its weight, its temperature", "Breathe your intention into it three times", "Seal by passing it through candle smoke or touching to salt"],
                "linked_format": "talisman_work",
                "linked_practices": ["talisman_charging"]
            },
            {
                "scenario_id": "candle_letter",
                "name": "The Candle Letter",
                "best_for": ["clear", "softened", "brave"],
                "description": "Write a message and release it through flame",
                "required_sections": ["introduction", "materials", "invocation", "the_working", "voice_element", "closing_seal", "aftercare"],
                "anchor_objects": ["candle"],
                "settings": ["kitchen", "bedroom", "desk"],
                "sample_steps": ["Write what you need to say—to yourself, to another, to the universe", "Read it aloud once, letting your voice carry the weight", "Touch corner to flame and let it transform"],
                "linked_format": "home_blessing",
                "linked_practices": ["candle_speech"]
            }
        ],
        
        "visual_dna": {
            "constants": {
                "primary_motif": "raven/crow feathers, devotional candles, protective circles, bells",
                "secondary_motif": "subtle Brigid-cross motifs, prayer beads (neutral/non-denominational), altar vignettes, home-circle gatherings",
                "era_aesthetic": "candlelit devotional mystery - protection magic meets Celtic-Irish hearth spirituality",
                "art_style": "rich tapestry aesthetic with deep crimson and gold, candlelight warmth, feathered textures, devotional intimacy"
            },
            "motif_library": [
                "raven feather", "crow silhouette", "devotional candle", "protective circle",
                "brass bell", "Brigid cross", "prayer beads", "altar cloth", "crescent moon",
                "candlelit threshold", "feather bundle", "wax seal", "home hearth", "sacred flame"
            ],
            "palette_variants": {
                "gentle": ["warm candlelight amber", "soft cream", "dove grey", "muted rose"],
                "practical": ["deep crimson", "antique gold", "midnight navy", "warm bronze"],
                "intense": ["oxblood red", "burnished gold", "raven black", "altar flame orange"]
            },
            "avoid": [
                "kitchen objects", "tailoring tools", "strict geometric diagrams",
                "WWII propaganda", "Land Army women", "military uniforms", "teacups",
                "bright saturated colors", "modern imagery", "photorealistic"
            ],
            "dall_e_rules": "devotional candlelit altar scene, raven feathers and protective circles, deep crimson and antique gold and midnight navy palette, Brigid cross motifs, brass bells, prayer beads, home-circle vignette NOT portrait, warm candleglow highlights, feathered textures",
            "header_scene": "candlelit home-circle altar vignette with raven feathers, candles, and protective symbols - NOT a portrait",
            "tarot_emblem": "raven feather crossed with crescent moon inside protective ring emblem"
        },
        
        "allowed_sources": [
            {
                "source_id": "morrigan_book",
                "author": "Morgan Daimler",
                "work": "The Morrigan: Meeting the Great Queens",
                "year": 2014,
                "reference_class": "primary",
                "archive_link": "/deities"
            },
            {
                "source_id": "celtic_twilight",
                "author": "W.B. Yeats",
                "work": "The Celtic Twilight",
                "year": 1893,
                "reference_class": "primary",
                "archive_link": "/library"
            },
            {
                "source_id": "irish_folk",
                "author": "Traditional",
                "work": "Irish Folk Magic Traditions",
                "year": None,
                "reference_class": "traditional",
                "archive_link": "/rituals"
            },
            {
                "source_id": "home_spiritualism",
                "author": "Traditional",
                "work": "British Home Circle Spiritualism",
                "year": None,
                "reference_class": "traditional",
                "archive_link": "/rituals"
            },
            {
                "source_id": "dion_fortune",
                "author": "Dion Fortune",
                "work": "Psychic Self-Defense",
                "year": 1930,
                "reference_class": "primary",
                "archive_link": "/library"
            },
            {
                "source_id": "essex_witches",
                "author": "Carrie Kirkpatrick",
                "work": "Essex Witches",
                "year": 2018,
                "reference_class": "secondary",
                "archive_link": "/library"
            }
        ]
    },
    
    "katherine": {
        "name": "Katherine",
        "title": "The Weaver of Hidden Knowledge",
        "era": "Late Victorian through WWII (1880s-1945)",
        
        "section_grammar": {
            "required_sections": ["preparation", "the_protocol", "the_working", "verification", "closing", "aftercare"],
            "optional_sections": ["mirror_element", "shadow_inquiry", "record_keeping", "thread_element"],
            "section_order": ["preparation", "shadow_inquiry", "the_protocol", "the_working", "mirror_element", "verification", "closing", "aftercare"],
            "voice_style": "precise, methodical, unafraid of darkness, Huguenot dignity"
        },
        
        # PRACTICES LIBRARY
        "practices": [
            {
                "practice_id": "thread_binding",
                "name": "Thread Binding",
                "description": "Using thread work to bind or release intentions",
                "steps_template": ["select thread color with intention", "as you work speak purpose", "tie or cut with clear intent", "store or dispose appropriately"],
                "materials": ["thread in appropriate color", "scissors"],
                "source_id": "spitalfields_craft"
            },
            {
                "practice_id": "mirror_scrying",
                "name": "Mirror Scrying",
                "description": "Using mirrors for self-reflection and revelation",
                "steps_template": ["cleanse mirror", "sit in candlelight", "meet your own gaze", "note what emerges"],
                "materials": ["mirror", "candle", "salt water for cleansing"],
                "source_id": "spr_methods"
            },
            {
                "practice_id": "shadow_naming",
                "name": "Shadow Naming",
                "description": "Identifying and naming hidden aspects for integration",
                "steps_template": ["create safe space", "ask what hides", "name without judgment", "write it down"],
                "materials": ["journal", "pen", "candlelight"],
                "source_id": "jung_red_book"
            },
            {
                "practice_id": "salt_sealing",
                "name": "Salt Line Sealing",
                "description": "Creating protective boundaries with salt",
                "steps_template": ["define space to protect", "pour salt line at threshold", "speak sealing words", "do not break line"],
                "materials": ["salt", "steady hand"],
                "source_id": "dion_fortune"
            },
            {
                "practice_id": "wax_sealing",
                "name": "Wax Seal Working",
                "description": "Using wax seals to fix intentions",
                "steps_template": ["write intention on paper", "fold paper precisely", "drip wax to seal", "press sigil or thumbprint"],
                "materials": ["paper", "sealing wax", "candle", "seal or ring"],
                "source_id": "victorian_seance"
            },
            {
                "practice_id": "record_keeping",
                "name": "Systematic Recording",
                "description": "Documenting magical work for pattern recognition",
                "steps_template": ["note date and time", "record intention and method", "observe results", "analyze over time"],
                "materials": ["dedicated notebook", "pen"],
                "source_id": "spr_methods"
            }
        ],
        
        "formats": [
            {
                "format_id": "protection_protocol",
                "description": "Systematic approach to establishing protection",
                "section_order": ["introduction", "materials", "preparation", "the_protocol", "the_working", "verification", "closing"],
                "tone_range": ["practical", "intense"],
                "linked_scenarios": ["protection_protocol", "threadworking"]
            },
            {
                "format_id": "discernment_protocol",
                "description": "Methods for seeking clarity and truth",
                "section_order": ["introduction", "materials", "preparation", "the_protocol", "the_working", "verification", "closing", "aftercare"],
                "tone_range": ["practical"],
                "linked_scenarios": ["discernment_protocol", "mirror_inquiry_safe", "record_and_repeat"]
            },
            {
                "format_id": "shadow_work",
                "description": "Confronting and integrating shadow aspects",
                "section_order": ["introduction", "materials", "preparation", "shadow_inquiry", "the_working", "verification", "closing", "aftercare"],
                "tone_range": ["intense"],
                "linked_scenarios": ["unbinding_ritual"]
            },
            {
                "format_id": "mirror_inquiry",
                "description": "Using mirrors for reflection and revelation",
                "section_order": ["introduction", "materials", "preparation", "mirror_element", "the_working", "verification", "closing"],
                "tone_range": ["practical", "intense"],
                "linked_scenarios": ["mirror_inquiry_safe"]
            },
            {
                "format_id": "unbinding_ritual",
                "description": "Releasing ties, patterns, or attachments",
                "section_order": ["introduction", "materials", "preparation", "the_protocol", "the_working", "verification", "closing", "aftercare"],
                "tone_range": ["practical", "intense"],
                "linked_scenarios": ["unbinding_ritual"]
            },
            {
                "format_id": "record_ritual",
                "description": "Documenting and grounding experiences",
                "section_order": ["introduction", "materials", "preparation", "record_keeping", "the_working", "verification", "closing"],
                "tone_range": ["gentle", "practical"],
                "linked_scenarios": ["record_and_repeat"]
            }
        ],
        
        "scenarios": [
            {
                "scenario_id": "protection_protocol",
                "name": "The Protection Protocol",
                "best_for": ["protected", "brave", "clear"],
                "description": "Establish systematic protection using Katherine's methodical approach",
                "required_sections": ["introduction", "materials", "preparation", "the_protocol", "the_working", "verification", "closing"],
                "anchor_objects": ["candle", "salt", "mirror"],
                "settings": ["bedroom", "desk"],
                "sample_steps": ["Define the boundaries of what you're protecting", "Name each vulnerability without flinching", "Apply your chosen ward to each point systematically"],
                "linked_format": "protection_protocol",
                "linked_practices": ["salt_sealing", "wax_sealing"]
            },
            {
                "scenario_id": "discernment_protocol",
                "name": "The Discernment Protocol",
                "best_for": ["clear", "brave", "calm"],
                "description": "Seek truth and clarity through systematic inquiry",
                "required_sections": ["introduction", "materials", "preparation", "the_protocol", "the_working", "verification", "closing", "aftercare"],
                "anchor_objects": ["candle", "mirror"],
                "settings": ["desk", "bedroom"],
                "sample_steps": ["Write your question precisely—vague questions yield vague answers", "Light your candle and state the question three times", "Record everything that comes, without judgment or editing"],
                "linked_format": "discernment_protocol",
                "linked_practices": ["record_keeping", "mirror_scrying"]
            },
            {
                "scenario_id": "unbinding_ritual",
                "name": "The Unbinding",
                "best_for": ["clear", "energized", "brave"],
                "description": "Release what no longer serves through deliberate untangling",
                "required_sections": ["introduction", "materials", "preparation", "the_protocol", "the_working", "verification", "closing", "aftercare"],
                "anchor_objects": ["thread", "candle", "salt"],
                "settings": ["bedroom", "desk"],
                "sample_steps": ["Name what binds you—be specific and unflinching", "Create a physical representation of each binding", "Undo each one deliberately, with full attention"],
                "linked_format": "unbinding_ritual",
                "linked_practices": ["thread_binding", "shadow_naming"]
            },
            {
                "scenario_id": "mirror_inquiry_safe",
                "name": "The Mirror Inquiry (Safe)",
                "best_for": ["clear", "calm", "brave"],
                "description": "Use mirrors for self-reflection without opening to external contact",
                "required_sections": ["introduction", "materials", "preparation", "mirror_element", "the_working", "verification", "closing"],
                "anchor_objects": ["mirror", "candle"],
                "settings": ["bedroom", "bath"],
                "sample_steps": ["Cleanse your mirror with salt water", "Sit before it in candlelight, meeting your own gaze", "Ask your question to yourself—not to anything beyond"],
                "linked_format": "mirror_inquiry",
                "linked_practices": ["mirror_scrying", "shadow_naming"]
            },
            {
                "scenario_id": "threadworking",
                "name": "The Threadworking",
                "best_for": ["protected", "calm", "softened"],
                "description": "Craft-based intention setting using thread and fabric",
                "required_sections": ["introduction", "materials", "preparation", "thread_element", "the_working", "verification", "closing"],
                "anchor_objects": ["thread"],
                "settings": ["desk", "bedroom", "kitchen"],
                "sample_steps": ["Choose your thread color with intention", "As you work—knotting, stitching, or binding—speak your purpose", "Seal the working by cutting the thread with clear intent"],
                "linked_format": "protection_protocol",
                "linked_practices": ["thread_binding"]
            },
            {
                "scenario_id": "record_and_repeat",
                "name": "The Record & Repeat",
                "best_for": ["clear", "calm", "protected"],
                "description": "Document patterns to understand and transform them",
                "required_sections": ["introduction", "materials", "preparation", "record_keeping", "the_working", "verification", "closing"],
                "anchor_objects": ["candle"],
                "settings": ["desk"],
                "sample_steps": ["Create your record book or page with date and intention", "Document what you observe without interpretation", "At closing, read back what you wrote and note what stands out"],
                "linked_format": "record_ritual",
                "linked_practices": ["record_keeping"]
            }
        ],
        
        "visual_dna": {
            "constants": {
                "primary_motif": "needle and thread, mirror, compass, sealed letter, astrolabe, measuring tape",
                "secondary_motif": "abstract Golden Dawn geometry, Qabalistic tree diagrams, atelier desk scene, wax seals, annotated margins",
                "era_aesthetic": "Victorian occult research atelier - tailoring precision meets diagrammatic magic",
                "art_style": "high-contrast engraved plate aesthetic, steel and silver tones, architectural precision, copper-plate etching quality"
            },
            "motif_library": [
                "needle", "thread spool", "scrying mirror", "brass compass", "sealed letter",
                "astrolabe", "measuring tape", "geometric sigil", "tree of life diagram",
                "compass rose", "wax seal", "bound grimoire", "hexagram", "sephirotic path",
                "atelier desk", "annotated margin", "scissors", "thimble"
            ],
            "palette_variants": {
                "gentle": ["cool silver", "soft steel grey", "aged parchment", "faded ink"],
                "practical": ["steel grey", "oxblood crimson", "midnight navy", "crisp white"],
                "intense": ["polished silver", "blood red wax", "deep navy", "stark black"]
            },
            "avoid": [
                "teacups", "domestic kitchen", "devotional hymn styling", "candle-heavy scenes",
                "Celtic imagery", "Morrigan", "bird oracle", "bright colors", "photorealistic",
                "spirit photography", "ghostly figures", "soft focus", "warm amber tones"
            ],
            "dall_e_rules": "high-contrast engraved plate aesthetic, atelier desk scene with mirror and thread and sealed notes, cool steel silver and oxblood and navy palette, abstracted Golden Dawn Qabalistic geometry, compass rose and geometric sigils, tailoring precision motifs needle thread measuring tape, architectural engraving style",
            "header_scene": "atelier desk scene with scrying mirror, thread spools, sealed letters, compass, and geometric diagrams",
            "tarot_emblem": "geometric sigil plate with compass rose emblem, needle and thread crossed"
        },
        
        "allowed_sources": [
            {
                "source_id": "jung_red_book",
                "author": "C.G. Jung",
                "work": "The Red Book (Liber Novus)",
                "year": 1915,
                "reference_class": "primary",
                "archive_link": "/library"
            },
            {
                "source_id": "dion_fortune",
                "author": "Dion Fortune",
                "work": "Psychic Self-Defense",
                "year": 1930,
                "reference_class": "primary",
                "archive_link": "/library"
            },
            {
                "source_id": "spr_methods",
                "author": "Traditional",
                "work": "Society for Psychical Research Methods",
                "year": None,
                "reference_class": "traditional",
                "archive_link": "/rituals"
            },
            {
                "source_id": "victorian_seance",
                "author": "Traditional",
                "work": "Victorian Séance Documentation",
                "year": None,
                "reference_class": "traditional",
                "archive_link": "/rituals"
            },
            {
                "source_id": "davies_cunning",
                "author": "Owen Davies",
                "work": "Popular Magic: Cunning-folk in English History",
                "year": 2003,
                "reference_class": "secondary",
                "archive_link": "/library"
            },
            {
                "source_id": "spitalfields_craft",
                "author": "Traditional",
                "work": "Spitalfields Weaving Traditions",
                "year": None,
                "reference_class": "traditional",
                "archive_link": "/timeline"
            }
        ]
    }
}

# ============================================================================
# FEELING TO SCENARIO MAPPING
# ============================================================================

FEELING_SCENARIO_MAP = {
    "calm": ["kettle_charm", "tea_ring_unknotting", "home_circle_blessing", "keening_container", "mirror_inquiry_safe", "record_and_repeat"],
    "brave": ["bird_omen_reading", "herb_packet", "voice_ward", "token_talisman", "protection_protocol", "discernment_protocol"],
    "clear": ["bird_omen_reading", "tea_ring_unknotting", "candle_letter", "discernment_protocol", "mirror_inquiry_safe", "record_and_repeat"],
    "protected": ["windowsill_ward", "herb_packet", "home_circle_blessing", "voice_ward", "token_talisman", "protection_protocol", "threadworking"],
    "softened": ["kettle_charm", "tea_ring_unknotting", "keening_container", "candle_letter", "threadworking"],
    "energized": ["herb_packet", "voice_ward", "token_talisman", "unbinding_ritual"]
}

# ============================================================================
# ANCHOR TO SCENARIO MAPPING
# ============================================================================

ANCHOR_SCENARIO_MAP = {
    "tea": ["kettle_charm", "tea_ring_unknotting", "bird_omen_reading"],
    "thread": ["token_talisman", "threadworking", "unbinding_ritual"],
    "candle": ["windowsill_ward", "home_circle_blessing", "voice_ward", "keening_container", "token_talisman", "candle_letter", "protection_protocol", "discernment_protocol", "mirror_inquiry_safe", "record_and_repeat"],
    "salt": ["windowsill_ward", "home_circle_blessing", "token_talisman", "protection_protocol", "unbinding_ritual"],
    "bird": ["windowsill_ward", "bird_omen_reading"],
    "mirror": ["keening_container", "protection_protocol", "mirror_inquiry_safe"],
    "song": ["home_circle_blessing", "voice_ward", "keening_container"]
}

# ============================================================================
# SETTING TO SCENARIO MAPPING
# ============================================================================

SETTING_SCENARIO_MAP = {
    "kitchen": ["kettle_charm", "windowsill_ward", "bird_omen_reading", "herb_packet", "home_circle_blessing", "token_talisman", "candle_letter", "threadworking"],
    "bedroom": ["windowsill_ward", "home_circle_blessing", "voice_ward", "keening_container", "token_talisman", "candle_letter", "protection_protocol", "discernment_protocol", "unbinding_ritual", "mirror_inquiry_safe", "threadworking"],
    "outdoors": ["bird_omen_reading", "voice_ward"],
    "bath": ["voice_ward", "keening_container", "mirror_inquiry_safe"],
    "desk": ["tea_ring_unknotting", "token_talisman", "candle_letter", "protection_protocol", "discernment_protocol", "unbinding_ritual", "threadworking", "record_and_repeat"]
}

# ============================================================================
# BELIEF BOUNDARY DESCRIPTIONS
# ============================================================================

BELIEF_BOUNDARY_DESCRIPTIONS = {
    "secular_reflective": "Frame this as psychological self-care and intention-setting. Use language like 'reflection,' 'intention,' 'focus.' Avoid deity names, spirit contact, or supernatural framing.",
    "spiritual_grounded": "Frame this as working with personal energy and the natural world. Mention 'energy,' 'the universe,' 'nature.' Avoid specific deity names but spiritual language is welcome.",
    "deity_friendly": "Feel free to invoke appropriate deities or divine figures relevant to the persona's tradition. Name them directly and include their mythology.",
    "ancestor_friendly": "Include ancestral connection and lineage. Reference 'those who came before,' family patterns, inherited wisdom. May include gentle spirit contact if appropriate."
}

# ============================================================================
# VISUAL ASSET TYPES
# ============================================================================

ASSET_TYPES = {
    "header_image": {
        "description": "Main scene/portrait/still life that sets the mood",
        "style_notes": "Full composition, atmospheric, sets the scene for the entire spell",
        "size": "1024x1024",
        "required": True
    },
    "tarot_card_image": {
        "description": "Symbolic emblem/sigil plate/diagram - MUST DIFFER from header",
        "style_notes": "Emblematic, centered composition, suitable for card format, symbolic rather than narrative",
        "size": "1024x1024",
        "required": True
    },
    "sigil": {
        "description": "High-contrast printable symbol",
        "style_notes": "Black and white only, geometric or organic lines, printable at small size",
        "size": "512x512",
        "required": True
    },
    "divider_1": {
        "description": "Horizontal decorative element after introduction",
        "style_notes": "Horizontal orientation, ornamental, matches persona aesthetic",
        "size": "1024x256",
        "required": True
    },
    "divider_2": {
        "description": "Horizontal decorative element after working section",
        "style_notes": "Horizontal orientation, different from divider_1",
        "size": "1024x256",
        "required": True
    },
    "divider_3": {
        "description": "Horizontal decorative element before closing",
        "style_notes": "Horizontal orientation, different from dividers 1 and 2",
        "size": "1024x256",
        "required": True
    }
}

# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

def get_persona_config(persona_id: str) -> dict:
    """Get configuration for a specific persona"""
    # Handle legacy IDs
    id_map = {
        "shiggy": "shigg",
        "kathleen": "cathleen",
        "catherine": "katherine"
    }
    normalized_id = id_map.get(persona_id, persona_id)
    return PERSONA_CONFIG.get(normalized_id, PERSONA_CONFIG.get("shigg"))


def get_matching_scenarios(persona_id: str, feeling: str, anchor: str, setting: str) -> list:
    """Get scenarios that match the user's preferences"""
    persona = get_persona_config(persona_id)
    all_scenarios = {s["scenario_id"]: s for s in persona["scenarios"]}
    
    # Get candidates from each filter
    feeling_matches = set(FEELING_SCENARIO_MAP.get(feeling, []))
    anchor_matches = set(ANCHOR_SCENARIO_MAP.get(anchor, []))
    setting_matches = set(SETTING_SCENARIO_MAP.get(setting, []))
    
    # Find scenarios that belong to this persona
    persona_scenario_ids = set(all_scenarios.keys())
    
    # Intersect with persona's scenarios
    feeling_matches &= persona_scenario_ids
    anchor_matches &= persona_scenario_ids
    setting_matches &= persona_scenario_ids
    
    # Score scenarios by how many criteria they match
    scored = []
    for sid in persona_scenario_ids:
        score = 0
        if sid in feeling_matches:
            score += 3  # Feeling is most important
        if sid in anchor_matches:
            score += 2
        if sid in setting_matches:
            score += 1
        scored.append((sid, score, all_scenarios[sid]))
    
    # Sort by score descending
    scored.sort(key=lambda x: x[1], reverse=True)
    
    return [item[2] for item in scored]


def select_scenario_for_spell(persona_id: str, spell_spec: dict, used_scenarios: list = None) -> dict:
    """Select the best scenario, avoiding recently used ones"""
    if used_scenarios is None:
        used_scenarios = []
    
    matching = get_matching_scenarios(
        persona_id,
        spell_spec.get("desired_feeling", "calm"),
        spell_spec.get("anchor_object", "candle"),
        spell_spec.get("setting", "bedroom")
    )
    
    # Try to avoid recently used scenarios
    for scenario in matching:
        if scenario["scenario_id"] not in used_scenarios:
            return scenario
    
    # If all have been used, return the best match anyway
    return matching[0] if matching else None


def get_format_for_scenario(persona_id: str, scenario_id: str) -> Optional[dict]:
    """Get the format linked to a specific scenario"""
    persona = get_persona_config(persona_id)
    scenario = next((s for s in persona["scenarios"] if s["scenario_id"] == scenario_id), None)
    if not scenario:
        return None
    
    linked_format_id = scenario.get("linked_format")
    if not linked_format_id:
        return None
    
    return next((f for f in persona["formats"] if f["format_id"] == linked_format_id), None)


def get_practices_for_scenario(persona_id: str, scenario_id: str) -> List[dict]:
    """Get practices linked to a specific scenario"""
    persona = get_persona_config(persona_id)
    scenario = next((s for s in persona["scenarios"] if s["scenario_id"] == scenario_id), None)
    if not scenario:
        return []
    
    linked_practice_ids = scenario.get("linked_practices", [])
    return [p for p in persona["practices"] if p["practice_id"] in linked_practice_ids]


def get_source_by_id(persona_id: str, source_id: str) -> Optional[dict]:
    """Get a source by its ID"""
    persona = get_persona_config(persona_id)
    return next((s for s in persona["allowed_sources"] if s["source_id"] == source_id), None)
