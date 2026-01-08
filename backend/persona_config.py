# Persona Configuration for Spell Generation
# Contains formats, scenarios, visual DNA for each archetype

PERSONA_CONFIG = {
    "shiggy": {
        "name": "Shigg",
        "title": "The Birds of Parliament Poet Laureate",
        "era": "Blitz-era London (1940s)",
        
        "section_grammar": {
            "required_sections": ["opening_verse", "the_working", "spoken_words", "closing_gesture", "aftercare"],
            "optional_sections": ["bird_omen", "tea_ritual", "windowsill_element"],
            "section_order": ["opening_verse", "bird_omen", "the_working", "spoken_words", "closing_gesture", "aftercare"],
            "voice_style": "gentle, poetic, domestic wisdom, East End warmth"
        },
        
        "formats": [
            {
                "format_id": "kitchen_charm",
                "description": "Simple domestic magic performed in the kitchen",
                "required_sections": ["opening_verse", "the_working", "spoken_words", "closing_gesture"],
                "tone_range": ["gentle", "practical"]
            },
            {
                "format_id": "bird_oracle",
                "description": "Divination and guidance through bird signs",
                "required_sections": ["opening_verse", "bird_omen", "the_working", "spoken_words", "aftercare"],
                "tone_range": ["gentle", "practical", "intense"]
            },
            {
                "format_id": "windowsill_ward",
                "description": "Protective magic using the threshold of the window",
                "required_sections": ["opening_verse", "windowsill_element", "the_working", "spoken_words", "closing_gesture"],
                "tone_range": ["gentle", "practical"]
            },
            {
                "format_id": "tea_meditation",
                "description": "Contemplative ritual centered on tea preparation",
                "required_sections": ["opening_verse", "tea_ritual", "the_working", "spoken_words", "aftercare"],
                "tone_range": ["gentle"]
            },
            {
                "format_id": "verse_working",
                "description": "Poetry-driven spell with Rubáiyát influences",
                "required_sections": ["opening_verse", "the_working", "spoken_words", "closing_gesture", "aftercare"],
                "tone_range": ["gentle", "intense"]
            }
        ],
        
        "scenarios": [
            {
                "scenario_id": "kettle_charm",
                "name": "The Kettle Charm",
                "best_for": ["calm", "protected", "softened"],
                "description": "Transform the daily ritual of boiling water into intention-setting",
                "required_sections": ["opening_verse", "tea_ritual", "the_working", "spoken_words"],
                "anchor_objects": ["tea", "salt"],
                "settings": ["kitchen"],
                "sample_steps": ["Fill kettle with fresh water, speaking your need", "As steam rises, release what binds you", "Pour with intention, let warmth be your answer"]
            },
            {
                "scenario_id": "windowsill_ward",
                "name": "The Windowsill Ward",
                "best_for": ["protected", "calm", "clear"],
                "description": "Create a protective boundary at the threshold between inside and out",
                "required_sections": ["opening_verse", "windowsill_element", "the_working", "spoken_words", "closing_gesture"],
                "anchor_objects": ["salt", "bird", "candle"],
                "settings": ["kitchen", "bedroom"],
                "sample_steps": ["Clean the sill with salt water, wiping away what came before", "Place your anchor object facing outward", "Speak the ward three times as morning light touches it"]
            },
            {
                "scenario_id": "bird_omen_reading",
                "name": "The Bird Omen Reading",
                "best_for": ["clear", "brave", "calm"],
                "description": "Seek guidance by observing and interpreting bird behavior",
                "required_sections": ["opening_verse", "bird_omen", "the_working", "spoken_words", "aftercare"],
                "anchor_objects": ["bird", "tea"],
                "settings": ["outdoors", "kitchen"],
                "sample_steps": ["Sit where birds gather, with tea in hand", "Ask your question silently three times", "Note the first bird: its direction, its call, its company"]
            },
            {
                "scenario_id": "tea_ring_unknotting",
                "name": "The Tea-Ring Unknotting",
                "best_for": ["calm", "softened", "clear"],
                "description": "Use the circular stain of a teacup to release tangled thoughts",
                "required_sections": ["opening_verse", "tea_ritual", "the_working", "spoken_words", "closing_gesture"],
                "anchor_objects": ["tea"],
                "settings": ["kitchen", "desk"],
                "sample_steps": ["Let your cup leave its ring on paper", "Trace the circle with your finger, naming each knot", "Fold the paper small, then smaller, then burn or bury"]
            },
            {
                "scenario_id": "herb_packet",
                "name": "The Herb Packet",
                "best_for": ["protected", "energized", "brave"],
                "description": "Create a small bundle of herbs and intentions to carry",
                "required_sections": ["opening_verse", "the_working", "spoken_words", "closing_gesture", "aftercare"],
                "anchor_objects": ["tea", "salt"],
                "settings": ["kitchen"],
                "sample_steps": ["Gather your herbs on a small cloth square", "Speak your need into each herb as you add it", "Tie with three knots: one for past, one for present, one for what comes"]
            }
        ],
        
        "visual_dna": {
            "constants": {
                "primary_motif": "birds (especially crows, robins, sparrows)",
                "secondary_motif": "teacups, kettles, domestic items",
                "era_aesthetic": "1940s Blitz-era London, wartime resilience",
                "art_style": "Edmund J. Sullivan pen-and-ink, Rubáiyát illustrations"
            },
            "motif_library": ["crow", "robin", "sparrow", "teacup", "kettle", "windowsill", "rose", "morning light", "steam", "nest", "feather", "breadcrumb"],
            "palette_variants": {
                "gentle": ["warm sepia", "cream", "soft brown", "rose"],
                "practical": ["black ink", "cream paper", "touches of red"],
                "intense": ["high contrast black/white", "deep shadows", "stark light"]
            },
            "avoid": ["Celtic knots", "Morrigan imagery", "séance elements", "Victorian mourning"]
        },
        
        "allowed_sources": [
            {"author": "Edward FitzGerald", "work": "Rubáiyát of Omar Khayyám", "year": 1859},
            {"author": "Ted Hughes", "work": "Crow: From the Life and Songs of the Crow", "year": 1970},
            {"author": "Traditional", "work": "British Kitchen Folklore", "year": None},
            {"author": "Traditional", "work": "East End Domestic Traditions", "year": None},
            {"author": "Jessica Roux", "work": "Ornithography: An Illustrated Guide to Bird Lore", "year": 2021}
        ]
    },
    
    "kathleen": {
        "name": "Cathleen",
        "title": "The Singer of Strength",
        "era": "Blitz-era London & Irish Heritage (1940s)",
        
        "section_grammar": {
            "required_sections": ["invocation", "the_working", "voice_element", "closing_seal", "aftercare"],
            "optional_sections": ["morrigan_call", "circle_casting", "talisman_charging"],
            "section_order": ["invocation", "morrigan_call", "circle_casting", "the_working", "voice_element", "closing_seal", "aftercare"],
            "voice_style": "warm, protective, motherly strength, Irish-inflected"
        },
        
        "formats": [
            {
                "format_id": "home_blessing",
                "description": "Protective blessing for household and family",
                "required_sections": ["invocation", "the_working", "voice_element", "closing_seal"],
                "tone_range": ["gentle", "practical"]
            },
            {
                "format_id": "voice_ward",
                "description": "Using song or spoken word as primary magical tool",
                "required_sections": ["invocation", "voice_element", "the_working", "closing_seal", "aftercare"],
                "tone_range": ["gentle", "practical", "intense"]
            },
            {
                "format_id": "morrigan_working",
                "description": "Calling on the Morrigan for transformation or protection",
                "required_sections": ["invocation", "morrigan_call", "the_working", "voice_element", "closing_seal"],
                "tone_range": ["intense"]
            },
            {
                "format_id": "circle_ritual",
                "description": "Formal circle casting for focused intention",
                "required_sections": ["invocation", "circle_casting", "the_working", "voice_element", "closing_seal", "aftercare"],
                "tone_range": ["practical", "intense"]
            },
            {
                "format_id": "talisman_work",
                "description": "Charging and empowering protective objects",
                "required_sections": ["invocation", "talisman_charging", "the_working", "closing_seal"],
                "tone_range": ["gentle", "practical"]
            }
        ],
        
        "scenarios": [
            {
                "scenario_id": "home_circle_blessing",
                "name": "The Home Circle Blessing",
                "best_for": ["protected", "calm", "softened"],
                "description": "Create a protective circle around your living space",
                "required_sections": ["invocation", "circle_casting", "the_working", "voice_element", "closing_seal"],
                "anchor_objects": ["candle", "salt", "song"],
                "settings": ["kitchen", "bedroom"],
                "sample_steps": ["Walk the boundary of your space with salt", "At each corner, pause and hum a note that feels right", "Return to center and seal with your full voice"]
            },
            {
                "scenario_id": "voice_ward",
                "name": "The Voice Ward",
                "best_for": ["protected", "brave", "energized"],
                "description": "Use your voice as a shield and sword",
                "required_sections": ["invocation", "voice_element", "the_working", "closing_seal", "aftercare"],
                "anchor_objects": ["song", "candle"],
                "settings": ["bedroom", "bath", "outdoors"],
                "sample_steps": ["Find a note that resonates in your chest", "Let it grow from hum to tone to word", "Shape the word into your intention, let it fill the room"]
            },
            {
                "scenario_id": "keening_container",
                "name": "The Keening Container",
                "best_for": ["softened", "calm", "clear"],
                "description": "Give grief or pain a voice so it can move through you",
                "required_sections": ["invocation", "voice_element", "the_working", "closing_seal", "aftercare"],
                "anchor_objects": ["song", "candle", "mirror"],
                "settings": ["bath", "bedroom"],
                "sample_steps": ["Light your candle and sit with what weighs on you", "Let sound come—no words needed, just the sound of feeling", "When empty, blow out the candle and release the smoke"]
            },
            {
                "scenario_id": "token_talisman",
                "name": "The Token Talisman",
                "best_for": ["protected", "brave", "energized"],
                "description": "Charge a small object to carry your intention",
                "required_sections": ["invocation", "talisman_charging", "the_working", "closing_seal"],
                "anchor_objects": ["thread", "candle", "salt"],
                "settings": ["kitchen", "bedroom", "desk"],
                "sample_steps": ["Hold your object and feel its weight, its temperature", "Breathe your intention into it three times", "Seal by passing it through candle smoke or touching to salt"]
            },
            {
                "scenario_id": "candle_letter",
                "name": "The Candle Letter",
                "best_for": ["clear", "softened", "brave"],
                "description": "Write a message and release it through flame",
                "required_sections": ["invocation", "the_working", "voice_element", "closing_seal", "aftercare"],
                "anchor_objects": ["candle"],
                "settings": ["kitchen", "bedroom", "desk"],
                "sample_steps": ["Write what you need to say—to yourself, to another, to the universe", "Read it aloud once, letting your voice carry the weight", "Touch corner to flame and let it transform"]
            }
        ],
        
        "visual_dna": {
            "constants": {
                "primary_motif": "crows, ravens, the Morrigan",
                "secondary_motif": "candles, circles, protective symbols",
                "era_aesthetic": "Celtic mysticism meets Blitz-era London",
                "art_style": "Pre-Raphaelite oil painting, dramatic chiaroscuro"
            },
            "motif_library": ["crow", "raven", "triple goddess", "candle flame", "salt circle", "silver talisman", "brooch", "voice waves", "moonlight", "doorway", "threshold"],
            "palette_variants": {
                "gentle": ["soft silver", "midnight blue", "candlelight gold"],
                "practical": ["warm amber", "deep brown", "cream"],
                "intense": ["black", "blood red", "silver", "storm grey"]
            },
            "avoid": ["Rubáiyát imagery", "bird oracle specifics", "Victorian séance", "textile/weaving"]
        },
        
        "allowed_sources": [
            {"author": "Morgan Daimler", "work": "The Morrigan: Meeting the Great Queens", "year": 2014},
            {"author": "W.B. Yeats", "work": "The Celtic Twilight", "year": 1893},
            {"author": "Traditional", "work": "Irish Folk Magic Traditions", "year": None},
            {"author": "Traditional", "work": "British Home Circle Spiritualism", "year": None},
            {"author": "Dion Fortune", "work": "Psychic Self-Defense", "year": 1930}
        ]
    },
    
    "catherine": {
        "name": "Katherine",
        "title": "The Weaver of Hidden Knowledge",
        "era": "Late Victorian through WWII (1880s-1945)",
        
        "section_grammar": {
            "required_sections": ["preparation", "the_protocol", "the_working", "verification", "closing", "aftercare"],
            "optional_sections": ["mirror_element", "shadow_inquiry", "record_keeping", "thread_element"],
            "section_order": ["preparation", "shadow_inquiry", "the_protocol", "the_working", "mirror_element", "verification", "closing", "aftercare"],
            "voice_style": "precise, methodical, unafraid of darkness, Huguenot dignity"
        },
        
        "formats": [
            {
                "format_id": "protection_protocol",
                "description": "Systematic approach to establishing protection",
                "required_sections": ["preparation", "the_protocol", "the_working", "verification", "closing"],
                "tone_range": ["practical", "intense"]
            },
            {
                "format_id": "discernment_protocol",
                "description": "Methods for seeking clarity and truth",
                "required_sections": ["preparation", "the_protocol", "the_working", "verification", "closing", "aftercare"],
                "tone_range": ["practical"]
            },
            {
                "format_id": "shadow_work",
                "description": "Confronting and integrating shadow aspects",
                "required_sections": ["preparation", "shadow_inquiry", "the_working", "verification", "closing", "aftercare"],
                "tone_range": ["intense"]
            },
            {
                "format_id": "mirror_inquiry",
                "description": "Using mirrors for reflection and revelation",
                "required_sections": ["preparation", "mirror_element", "the_working", "verification", "closing"],
                "tone_range": ["practical", "intense"]
            },
            {
                "format_id": "unbinding_ritual",
                "description": "Releasing ties, patterns, or attachments",
                "required_sections": ["preparation", "the_protocol", "the_working", "verification", "closing", "aftercare"],
                "tone_range": ["practical", "intense"]
            },
            {
                "format_id": "record_ritual",
                "description": "Documenting and grounding experiences",
                "required_sections": ["preparation", "record_keeping", "the_working", "verification", "closing"],
                "tone_range": ["gentle", "practical"]
            }
        ],
        
        "scenarios": [
            {
                "scenario_id": "protection_protocol",
                "name": "The Protection Protocol",
                "best_for": ["protected", "brave", "clear"],
                "description": "Establish systematic protection using Katherine's methodical approach",
                "required_sections": ["preparation", "the_protocol", "the_working", "verification", "closing"],
                "anchor_objects": ["candle", "salt", "mirror"],
                "settings": ["bedroom", "desk"],
                "sample_steps": ["Define the boundaries of what you're protecting", "Name each vulnerability without flinching", "Apply your chosen ward to each point systematically"]
            },
            {
                "scenario_id": "discernment_protocol",
                "name": "The Discernment Protocol",
                "best_for": ["clear", "brave", "calm"],
                "description": "Seek truth and clarity through systematic inquiry",
                "required_sections": ["preparation", "the_protocol", "the_working", "verification", "closing", "aftercare"],
                "anchor_objects": ["candle", "mirror"],
                "settings": ["desk", "bedroom"],
                "sample_steps": ["Write your question precisely—vague questions yield vague answers", "Light your candle and state the question three times", "Record everything that comes, without judgment or editing"]
            },
            {
                "scenario_id": "unbinding_ritual",
                "name": "The Unbinding",
                "best_for": ["clear", "energized", "brave"],
                "description": "Release what no longer serves through deliberate untangling",
                "required_sections": ["preparation", "the_protocol", "the_working", "verification", "closing", "aftercare"],
                "anchor_objects": ["thread", "candle", "salt"],
                "settings": ["bedroom", "desk"],
                "sample_steps": ["Name what binds you—be specific and unflinching", "Create a physical representation of each binding", "Undo each one deliberately, with full attention"]
            },
            {
                "scenario_id": "mirror_inquiry_safe",
                "name": "The Mirror Inquiry (Safe)",
                "best_for": ["clear", "calm", "brave"],
                "description": "Use mirrors for self-reflection without opening to external contact",
                "required_sections": ["preparation", "mirror_element", "the_working", "verification", "closing"],
                "anchor_objects": ["mirror", "candle"],
                "settings": ["bedroom", "bath"],
                "sample_steps": ["Cleanse your mirror with salt water", "Sit before it in candlelight, meeting your own gaze", "Ask your question to yourself—not to anything beyond"]
            },
            {
                "scenario_id": "threadworking",
                "name": "The Threadworking",
                "best_for": ["protected", "calm", "softened"],
                "description": "Craft-based intention setting using thread and fabric",
                "required_sections": ["preparation", "thread_element", "the_working", "verification", "closing"],
                "anchor_objects": ["thread"],
                "settings": ["desk", "bedroom", "kitchen"],
                "sample_steps": ["Choose your thread color with intention", "As you work—knotting, stitching, or binding—speak your purpose", "Seal the working by cutting the thread with clear intent"]
            },
            {
                "scenario_id": "record_and_repeat",
                "name": "The Record & Repeat",
                "best_for": ["clear", "calm", "protected"],
                "description": "Document patterns to understand and transform them",
                "required_sections": ["preparation", "record_keeping", "the_working", "verification", "closing"],
                "anchor_objects": ["candle"],
                "settings": ["desk"],
                "sample_steps": ["Create your record book or page with date and intention", "Document what you observe without interpretation", "At closing, read back what you wrote and note what stands out"]
            }
        ],
        
        "visual_dna": {
            "constants": {
                "primary_motif": "mirrors, shadows, candles",
                "secondary_motif": "Victorian spiritualism, documented records",
                "era_aesthetic": "Late Victorian through WWII spiritualism",
                "art_style": "Spirit photography, double exposures, sepia documentation"
            },
            "motif_library": ["mirror", "candle", "shadow", "document", "seal", "threshold", "clock", "key", "ink", "wax", "letter", "photograph"],
            "palette_variants": {
                "gentle": ["sepia", "cream", "soft grey", "amber"],
                "practical": ["black", "white", "grey", "touches of red"],
                "intense": ["deep black", "stark white", "blood red", "silver"]
            },
            "avoid": ["Celtic imagery", "Morrigan", "bird oracle", "domestic kitchen scenes", "OVERUSE of thread/weaving - use sparingly and only for threadworking scenario"]
        },
        
        "allowed_sources": [
            {"author": "C.G. Jung", "work": "The Red Book (Liber Novus)", "year": 1915},
            {"author": "Dion Fortune", "work": "Psychic Self-Defense", "year": 1930},
            {"author": "Traditional", "work": "Society for Psychical Research Methods", "year": None},
            {"author": "Traditional", "work": "Victorian Séance Documentation", "year": None},
            {"author": "Owen Davies", "work": "Popular Magic: Cunning-folk in English History", "year": 2003}
        ]
    }
}

# Feeling to scenario matching
FEELING_SCENARIO_MAP = {
    "calm": ["kettle_charm", "tea_ring_unknotting", "home_circle_blessing", "keening_container", "mirror_inquiry_safe", "record_and_repeat"],
    "brave": ["bird_omen_reading", "herb_packet", "voice_ward", "token_talisman", "protection_protocol", "discernment_protocol"],
    "clear": ["bird_omen_reading", "tea_ring_unknotting", "candle_letter", "discernment_protocol", "mirror_inquiry_safe", "record_and_repeat"],
    "protected": ["windowsill_ward", "herb_packet", "home_circle_blessing", "voice_ward", "token_talisman", "protection_protocol", "threadworking"],
    "softened": ["kettle_charm", "tea_ring_unknotting", "keening_container", "candle_letter", "threadworking"],
    "energized": ["herb_packet", "voice_ward", "token_talisman", "unbinding_ritual"]
}

# Anchor object to scenario matching
ANCHOR_SCENARIO_MAP = {
    "tea": ["kettle_charm", "tea_ring_unknotting", "bird_omen_reading"],
    "thread": ["token_talisman", "threadworking", "unbinding_ritual"],
    "candle": ["windowsill_ward", "home_circle_blessing", "voice_ward", "keening_container", "token_talisman", "candle_letter", "protection_protocol", "discernment_protocol", "mirror_inquiry_safe", "record_and_repeat"],
    "salt": ["windowsill_ward", "home_circle_blessing", "token_talisman", "protection_protocol", "unbinding_ritual"],
    "bird": ["windowsill_ward", "bird_omen_reading"],
    "mirror": ["keening_container", "protection_protocol", "mirror_inquiry_safe"],
    "song": ["home_circle_blessing", "voice_ward", "keening_container"]
}

# Setting to scenario matching  
SETTING_SCENARIO_MAP = {
    "kitchen": ["kettle_charm", "windowsill_ward", "bird_omen_reading", "herb_packet", "home_circle_blessing", "token_talisman", "candle_letter", "threadworking"],
    "bedroom": ["windowsill_ward", "home_circle_blessing", "voice_ward", "keening_container", "token_talisman", "candle_letter", "protection_protocol", "discernment_protocol", "unbinding_ritual", "mirror_inquiry_safe", "threadworking"],
    "outdoors": ["bird_omen_reading", "voice_ward"],
    "bath": ["voice_ward", "keening_container", "mirror_inquiry_safe"],
    "desk": ["tea_ring_unknotting", "token_talisman", "candle_letter", "protection_protocol", "discernment_protocol", "unbinding_ritual", "threadworking", "record_and_repeat"]
}

# Belief boundary descriptions for prompts
BELIEF_BOUNDARY_DESCRIPTIONS = {
    "secular_reflective": "Frame this as psychological self-care and intention-setting. Use language like 'reflection,' 'intention,' 'focus.' Avoid deity names, spirit contact, or supernatural framing.",
    "spiritual_grounded": "Frame this as working with personal energy and the natural world. Mention 'energy,' 'the universe,' 'nature.' Avoid specific deity names but spiritual language is welcome.",
    "deity_friendly": "Feel free to invoke appropriate deities or divine figures relevant to the persona's tradition. Name them directly and include their mythology.",
    "ancestor_friendly": "Include ancestral connection and lineage. Reference 'those who came before,' family patterns, inherited wisdom. May include gentle spirit contact if appropriate."
}

# Visual asset types
ASSET_TYPES = {
    "header_image": {
        "description": "Main scene/portrait/still life that sets the mood",
        "style_notes": "Full composition, atmospheric, sets the scene for the entire spell",
        "size": "1024x1024"
    },
    "tarot_card_image": {
        "description": "Symbolic emblem/sigil plate/diagram - MUST DIFFER from header",
        "style_notes": "Emblematic, centered composition, suitable for card format, symbolic rather than narrative",
        "size": "1024x1024"
    },
    "sigil": {
        "description": "High-contrast printable symbol",
        "style_notes": "Black and white only, geometric or organic lines, printable at small size",
        "size": "512x512"
    },
    "divider": {
        "description": "Horizontal decorative element between sections",
        "style_notes": "Horizontal orientation, ornamental, matches persona aesthetic",
        "size": "1024x256"
    },
    "micro_icon": {
        "description": "Small icon for section headers or materials",
        "style_notes": "Simple, iconic, works at 32x32px, single motif",
        "size": "256x256"
    }
}

def get_persona_config(persona_id: str) -> dict:
    """Get configuration for a specific persona"""
    return PERSONA_CONFIG.get(persona_id, PERSONA_CONFIG.get("shiggy"))

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
