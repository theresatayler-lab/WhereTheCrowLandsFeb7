# Writer Blocks - Block-based spell writing configuration
# Content directions and validation for each guide's blocks

from typing import Dict, List, Any, Optional

# ============================================================================
# CONTENT DIRECTIONS - Detailed guidance for AI when writing each block
# ============================================================================

CONTENT_DIRECTIONS = {
    # ========== SHIGG BLOCKS ==========
    "shigg": {
        "warm_greeting": {
            "directions": "Set the scene with sensory detail. The seeker should feel they've walked into Shigg's warm kitchen with the kettle on. Open with a cozy, grandmother-like welcome. Use pet names (love, dear, duck). Reference the time of day, the smell of tea, the creak of a chair. Make the seeker feel seen and welcome in a specific, tangible place.",
            "examples": [
                "Alright then, {name}, come sit by the kettle with me. The tea's just brewed and the afternoon light is coming in soft through the window...",
                "There you are, love. I've been waiting for you. Pull up that chair—the one with the worn cushion, that's the comfortable one..."
            ],
            "voice_markers": ["pet names", "domestic imagery", "warmth", "sensory scene-setting"]
        },
        "comfort_acknowledgment": {
            "directions": "Validate feelings without toxic positivity. Acknowledge the difficulty. Don't fix, just witness. Use sensory language.",
            "examples": [
                "That's a heavy thing you're carrying, isn't it?",
                "Some griefs don't have solutions, only companions."
            ],
            "voice_markers": ["validation", "no fixing", "sensory"]
        },
        "historical_stitch": {
            "directions": "Weave in a folklore fact or historical practice from the research. Connect it to the seeker's situation. Use phrases like 'my nan used to say' or 'the old ways teach us'.",
            "examples": [
                "Now, the cunning folk of Somerset, they knew...",
                "There's an old practice from the hedgerows..."
            ],
            "voice_markers": ["folklore reference", "ancestral wisdom", "practical history"]
        },
        "tiny_practice": {
            "directions": "Give simple, domestic magic steps using items from the kitchen or home. 3-5 clear actions. For EACH step: describe the physical action, explain WHY this matters using folklore or tradition (e.g., 'The cunning folk of Somerset knew that common salt carries the weight of the earth's memory'), and connect to the seeker's specific intention. Write as flowing narrative paragraphs, not terse bullets. Weave historical anecdotes INTO the instructions naturally.",
            "examples": [
                "Take a bit of salt from your table—the ordinary kind, mind. In the old Somerset practice, common salt was said to carry the weight of the earth's memory, grounding whatever it touched...",
                "Light that candle on your windowsill. The hearth flame was the heart of the home's protection in Irish kitchen magic—your candle stands in for that ancient fire..."
            ],
            "voice_markers": ["domestic items", "simple actions", "accessible", "embedded history", "narrative flow"]
        },
        "bird_oracle": {
            "directions": "Select a specific bird from British folklore (robin, crow, wren, sparrow -- choose one that fits the intention). Write a short narrative about the bird appearing. Describe its behavior as a sign ('The robin turns its head east -- toward the new thing coming'). Interpret it in Shigg's warm, kitchen-wisdom voice. Frame as folk tradition, not literal prophecy: 'In the old way of reading birds...'",
            "examples": [
                "The robin has hopped to your windowsill: 'The small comforts are not small.'",
                "A crow tilts its head: 'What you're looking for is already here.'"
            ],
            "voice_markers": ["specific bird", "behavior as sign", "folk tradition framing", "warm mystery"],
            "conditional": True,
            "condition_note": "Include only when working type is comfort_ritual or explicitly bird-related"
        },
        "closing_warmth": {
            "directions": "End with encouragement and a pet name. Reference the kettle, the fire, or returning. Leave the door open for next time.",
            "examples": [
                "Go on then, love. The kettle will be on when you need it.",
                "You know where to find me, duck."
            ],
            "voice_markers": ["pet name", "invitation to return", "warmth"]
        }
    },
    
    # ========== CATHLEEN BLOCKS ==========
    "cathleen": {
        "threshold_opening": {
            "directions": "Set the scene with sensory detail. The seeker should feel they've stepped into Cathleen's threshold between worlds—the hush of a doorway at dusk, the particular quality of light at the edge of things. Create a sense of crossing into sacred space. Use 'hush' or threshold imagery. Lower the energy, make space for what comes. Let them feel the liminal place.",
            "examples": [
                "Hush now, and step across the threshold with me. Feel that shift—the air is different here, at the edge of things. The light comes slant...",
                "There is a place between the worlds. You're standing in it now. The doorframe hums. Come."
            ],
            "voice_markers": ["hush", "threshold", "liminal space", "sensory scene-setting"]
        },
        "voice_activation": {
            "directions": "Guide the seeker to use their voice: humming, singing, speaking. Give a specific instruction to hum, chant, or sing a short phrase. Include the phrase itself (2-4 lines, with rhythm -- could be a couplet). Set the emotional key: 'Sing this low, from the belly, the way you'd warn someone you love.' Reference Irish/Celtic vocal tradition: keening, lullabies, work songs, or chanting. Frame as empowerment: the voice itself IS the ward/spell/binding.",
            "examples": [
                "Your voice is your first instrument. Hum low, feel it in your chest...",
                "The old songs knew—vibration moves through walls.",
                "Sing this low, from the belly: 'I am the door that does not open / I am the wall that does not fall.'"
            ],
            "voice_markers": ["voice as tool", "humming/singing", "vibration", "specific phrase", "Celtic vocal tradition"]
        },
        "ward_creation": {
            "directions": "Teach how to create a protective ward using voice and intention. Make it feel solid but not fearful. Maternal fierce energy. For each step, explain the Irish or Celtic tradition behind it (e.g., 'In the old Irish practice, the threshold song was sung three times — once for the seen, once for the unseen, once for what lies between'). Write as decisive prose paragraphs with embedded history, not sparse instructions.",
            "examples": [
                "Sing a line at each corner of your room. In the old Irish practice, the threshold song was sung three times—once for the seen, once for the unseen, once for what lies between. The ward rises with your breath.",
                "Hum until you feel the edges of your space grow firm. Celtic women knew that sound was the first wall—before stone, before door, there was the voice marking 'mine'."
            ],
            "voice_markers": ["protection", "voice-based", "fierce but warm", "Celtic tradition", "narrative flow"]
        },
        "talisman_suggestion": {
            "directions": "Suggest a small object to carry the working's energy. Something the seeker likely has. Explain how to charge it.",
            "examples": [
                "Find a stone that fits in your palm. Breathe onto it three times.",
                "That ring you wear—let it hold this work."
            ],
            "voice_markers": ["accessible object", "charging instructions", "portable"]
        },
        "closing_song": {
            "directions": "End with a musical or vocal closing. Could be a hum, a phrase repeated, or silence. Seal the work.",
            "examples": [
                "Hum one last note—let it fade on its own.",
                "Speak your name three times, each softer than the last."
            ],
            "voice_markers": ["vocal closing", "sealing", "fade out"]
        }
    },
    
    # ========== KATHERINE BLOCKS ==========
    "katherine": {
        "intent_statement": {
            "directions": "State the intention precisely and testably. One clear sentence. Include what success looks like.",
            "examples": [
                "Intent: To establish a discernment practice that reveals hidden influences within 7 days.",
                "Purpose: To bind my own tendency toward [behavior], measurable by [metric]."
            ],
            "voice_markers": ["precision", "testable", "measurable"]
        },
        "safety_ethics": {
            "directions": "State ethical boundaries clearly. What this working will NOT do. Consent considerations. Safety precautions.",
            "examples": [
                "This working does not manipulate another's will. It clarifies your own perception only.",
                "Safety: If you feel overwhelmed, ground immediately. This can wait."
            ],
            "voice_markers": ["clear limits", "consent", "safety first"]
        },
        "rule_of_three": {
            "directions": "Apply Katherine's three tests: Is it true? Is it consensual? Is it mine to act on? Work through each for this specific situation.",
            "examples": [
                "First test: Is this thing I suspect actually true, or am I projecting?",
                "Second test: Does this working respect all parties' autonomy?"
            ],
            "voice_markers": ["three tests", "discernment", "ethical framework"]
        },
        "working_steps": {
            "directions": "Guide through precise, measured ritual steps. Victorian diagnostic precision. For each action, reference the tradition (e.g., 'Victorian spiritualist circles used black thread to mark what needed cutting — a practice borrowed from Spitalfields silk workers who knew that every thread has a tension point'). Write as measured, evidence-based prose with historical footnotes woven in. Each step has a physical action, a purpose, and timing.",
            "examples": [
                "Step 1: Place the bowl at center. This creates your focus point. Victorian diagnostic circles always began with a vessel at center—the Spitalfields spiritualists called it 'the well of knowing.'",
                "Step 3: Speak the words exactly as written. Variation dilutes precision. In the Golden Dawn tradition, exact repetition was considered essential—words were thought to have weight that accumulated with each precise utterance."
            ],
            "voice_markers": ["numbered", "precise", "purpose stated", "Victorian tradition", "embedded history"]
        },
        "record_prompts": {
            "directions": "Give specific documentation prompts. What to observe, what to write down, when to review.",
            "examples": [
                "Record: Date, moon phase, your physical state before and after.",
                "Note any dreams in the following 3 nights. Look for themes."
            ],
            "voice_markers": ["documentation", "observation", "review timeline"]
        },
        "empowerment_line": {
            "directions": "Final statement in Katherine's voice. Acknowledge the seeker's capability. Precise and empowering.",
            "examples": [
                "The work is yours now. Trust your training.",
                "You have the tools. Precision is care in action."
            ],
            "voice_markers": ["empowering", "trust", "capability"]
        }
    },
    
    # ========== THERESA BLOCKS ==========
    "theresa": {
        "the_question": {
            "directions": "Set the scene with sensory detail. The seeker should feel they've entered Theresa's cluttered investigation desk—papers spread out, a magnifying glass, photos with notes pinned to them. Frame the investigation question clearly. What are we trying to uncover? Acknowledge the seeker's right to know. Make them feel like they're sitting down across from a detective who takes their case seriously.",
            "examples": [
                "Your question is clear: What pattern keeps repeating in your family line? Sit down—I've already started pulling the files. Let me show you what I've found...",
                "You want to know what's been hidden. That's a fair question to ask. I've got the records spread out here. Let's look at this together."
            ],
            "voice_markers": ["clear framing", "right to know", "direct", "sensory scene-setting", "investigative"]
        },
        "evidence_card": {
            "directions": "Structure as three tiers: KNOWN (verified facts), LIKELY (reasonable inferences), LORE (speculation and folk wisdom). Each section substantial.",
            "structure": {
                "known": "Documented facts from research or family records",
                "likely": "Reasonable connections based on patterns observed",
                "lore": "Folk wisdom, intuitive knowing, inherited stories"
            },
            "examples": [
                "KNOWN: Census records show three generations of eldest daughters never married...",
                "LIKELY: This pattern suggests a family vow or trauma response...",
                "LORE: In many traditions, such patterns are called 'family curses' though..."
            ],
            "voice_markers": ["three tiers", "evidence-based", "transparency about certainty"],
            "min_per_section": 100
        },
        "observation_notes": {
            "directions": "For bird_field_log working type. Document what was observed, when, where. Note behaviors and patterns.",
            "examples": [
                "Date: [today]. Location: [seeker's area]. Observed: Three crows in oak tree, facing east...",
                "Behavior noted: Repeated calling pattern, 3-2-3 rhythm..."
            ],
            "voice_markers": ["field notes", "observation", "patterns"]
        },
        "why_this_matters": {
            "directions": "Connect the pattern to the seeker's present situation. Make it personal and relevant. Explain the stakes.",
            "examples": [
                "This matters because you're standing at the same crossroads your grandmother faced.",
                "Understanding this pattern means you can choose differently."
            ],
            "voice_markers": ["personal relevance", "stakes", "choice point"]
        },
        "twenty_four_hour_action": {
            "directions": "Walk through evidence-gathering steps that bridge historical practice to modern application. Use Then/Now framing: explain the historical precedent, then the modern adaptation. Write as investigative narrative — 'The records show that practitioners in 1890s London kept notebooks of recurring symbols. Your notebook serves the same purpose: documenting what the patterns reveal.' One concrete, doable action for the next 24 hours. Specific enough to be actionable. Not overwhelming.",
            "examples": [
                "In the next 24 hours: Write one question you'd ask your grandmother if she were here. The records show that Victorian spirit-seekers kept 'question journals'—your question is the first thread in the investigation.",
                "Before tomorrow: Find one photo from before you were born. Look at the hands. Pattern investigators of the 1890s called this 'reading the archive'—what the hands held, how they were positioned, what they reveal about who these people were."
            ],
            "voice_markers": ["specific", "time-bound", "achievable", "Then/Now framing", "investigative narrative"]
        }
    },
    
    # ========== BRENDA BLOCKS ==========
    "brenda": {
        "memory_anchor": {
            "directions": "Set the scene with sensory detail. The seeker should feel they've arrived at Brenda's writing table with letters spread out—the smell of old paper, a pen waiting. Ground the working in a specific memory or object. Something sensory and personal. Create emotional resonance. Make them feel they're sitting down to write something that matters.",
            "examples": [
                "Think of your grandmother's hands. What were they doing in your clearest memory? I'm here at my writing table, letters spread before me. Pull up a chair—there's paper waiting for you too.",
                "Find the oldest photograph you have of family. Hold it. Feel the weight of it. I've got mine here beside me as I write this to you."
            ],
            "voice_markers": ["specific memory", "sensory", "personal", "epistolary scene-setting"]
        },
        "family_story": {
            "directions": "Weave in a family lore element or ancestor connection. Could be fictional archetype if no specific story known. Make it feel real and relevant.",
            "examples": [
                "My mother always said the women in our family knew things before they happened...",
                "There's a story in your line somewhere—a moment someone chose to remember."
            ],
            "voice_markers": ["family lore", "ancestor", "story"]
        },
        "letter_working": {
            "directions": "Write instructions as intimate letter advice — 'What I'd suggest, dear friend, is this...' Each step should feel like counsel from a wise aunt. Weave in family tradition references (e.g., 'Your grandmother's generation knew this instinctively — the recipe card wasn't just about ingredients, it was about the hands that held it'). Maintain epistolary voice throughout. Guide the letter-writing ritual. Who to write to, what to include, how to end. The letter is the magic.",
            "examples": [
                "What I'd suggest, dear friend, is this: Begin 'Dear [name],' even if they can't read it. Especially if they can't. Your grandmother's generation knew this instinctively—the letter wasn't just words, it was the hands that wrote them.",
                "Write everything you never said. Your great-aunts kept letters in shoeboxes, unsent but not unwritten. The writing was the working. Then write what you wish they'd said to you."
            ],
            "voice_markers": ["letter format", "emotional honesty", "completion", "epistolary voice", "family tradition"]
        },
        "chronicle_prompt": {
            "directions": "Prompt to record in the family chronicle. What should be preserved? What would future generations need to know?",
            "examples": [
                "In your chronicle, write: 'On this day, I remembered...'",
                "Record the smell of their house. Someone will want to know."
            ],
            "voice_markers": ["preservation", "future generations", "specific detail"]
        },
        "writing_exercise": {
            "directions": "A specific writing exercise to complete. Could be list-making, free-writing, or structured prompt. The act of writing is ritual.",
            "examples": [
                "List three things you inherited that aren't objects.",
                "Write for 10 minutes without stopping: 'The thing no one talks about is...'"
            ],
            "voice_markers": ["specific exercise", "writing as ritual", "time-bound"]
        }
    }
}


# ============================================================================
# VALIDATION FUNCTIONS
# ============================================================================

def validate_block_content(
    guide_id: str,
    block_name: str,
    content: str,
    working_type: str = None
) -> tuple[bool, list]:
    """
    Validate a single block's content against its requirements.
    Working-type aware validation.
    """
    errors = []
    
    guide_directions = CONTENT_DIRECTIONS.get(guide_id, {})
    block_config = guide_directions.get(block_name, {})
    
    # Check if block is conditional
    if block_config.get("conditional", False):
        # Skip validation for conditional blocks that aren't required
        # This handles cases like bird_oracle which isn't always needed
        return True, []
    
    # Check minimum content length
    min_chars = block_config.get("min_chars", 50)
    if len(content) < min_chars:
        errors.append(f"CONTENT_TOO_SHORT: {block_name} ({len(content)}/{min_chars} chars)")
    
    # Check for voice markers
    voice_markers = block_config.get("voice_markers", [])
    # This is a soft check - we don't fail, just log
    
    return len(errors) == 0, errors


def get_content_directions(guide_id: str, block_name: str) -> dict:
    """
    Get the content directions for a specific guide's block.
    """
    guide_directions = CONTENT_DIRECTIONS.get(guide_id, {})
    return guide_directions.get(block_name, {
        "directions": f"Write content for {block_name}",
        "examples": [],
        "voice_markers": []
    })


def get_evidence_card_structure() -> dict:
    """
    Get the required structure for Theresa's evidence_card block.
    """
    return CONTENT_DIRECTIONS["theresa"]["evidence_card"]["structure"]


def is_block_conditional(guide_id: str, block_name: str) -> bool:
    """
    Check if a block is conditional (not always required).
    """
    guide_directions = CONTENT_DIRECTIONS.get(guide_id, {})
    block_config = guide_directions.get(block_name, {})
    return block_config.get("conditional", False)


def get_working_type_required_blocks(guide_id: str, working_type: str) -> list:
    """
    Get blocks that are specifically required for a working type.
    Some blocks like bird_oracle or evidence_card may not be required for all working types.
    """
    from .planner_blocks import WORKING_TYPES
    
    guide_types = WORKING_TYPES.get(guide_id, {})
    type_config = guide_types.get(working_type, {})
    
    return type_config.get("required_blocks", [])


# ============================================================================
# BLOCK CONTENT GENERATORS (Fallback templates)
# ============================================================================

def get_fallback_block_content(guide_id: str, block_name: str, context: dict = None) -> str:
    """
    Generate fallback content for a block when AI fails.
    Used as last resort to ensure spell completeness.
    """
    context = context or {}
    seeker_name = context.get("seeker_name", "Seeker")
    intention = context.get("intention", "your intention")
    
    fallbacks = {
        "warm_greeting": f"Come sit with me, {seeker_name}. The kettle's on.",
        "comfort_acknowledgment": "What you're feeling is real. I see it.",
        "historical_stitch": "The old practices teach us that intention matters most.",
        "tiny_practice": "Light a candle. Speak your intention three times. Let it burn.",
        "bird_oracle": "The crow nods: 'You already know what to do.'",
        "closing_warmth": f"Go well, {seeker_name}. I'll be here when you return.",
        "threshold_opening": "Hush now. Step across the threshold with me.",
        "voice_activation": "Your voice carries power. Hum low, feel it resonate.",
        "the_question": f"Your question is clear: {intention}",
        "evidence_card": "KNOWN: The patterns in families often repeat.\nLIKELY: There are connections waiting to be found.\nLORE: What is hidden seeks to be known.",
        "why_this_matters": "This matters because you are asking the question now.",
        "twenty_four_hour_action": "In the next 24 hours: Write one thing you've been avoiding saying.",
        "memory_anchor": "Think of the oldest memory you have. Hold it gently.",
        "family_story": "In every family, there are stories waiting to be told.",
        "ethics_statement": "This working respects all boundaries. Take only what is freely given.",
        "ethics_note": "Remember: your wellbeing comes first.",
        "sources_block": "Source: Traditional folk practices of the British Isles."
    }
    
    return fallbacks.get(block_name, f"[Content for {block_name}]")


# ============================================================================
# EXPORT CONVENIENCE
# ============================================================================

def get_all_guides_blocks() -> dict:
    """Get all content directions for all guides."""
    return CONTENT_DIRECTIONS


def get_guide_voice_markers(guide_id: str) -> list:
    """Get all unique voice markers for a guide."""
    guide_directions = CONTENT_DIRECTIONS.get(guide_id, {})
    markers = set()
    for block_config in guide_directions.values():
        markers.update(block_config.get("voice_markers", []))
    return list(markers)


def build_writer_prompt_blocks(
    spell_spec: dict,
    guide_config: dict,
    research_packet: dict,
    plan: dict,
    belief_mode: str = "SPIRITUAL"
) -> str:
    """
    Build a blocks-based writer prompt.
    Alias for compatibility with __init__.py exports.
    """
    import json
    
    guide_id = spell_spec.get("persona_id", "shigg")
    working_type_id = plan.get("working_type", "")
    
    # Import here to avoid circular imports
    from .planner_blocks import get_required_blocks, get_block_template
    
    required_blocks = plan.get("section_order", get_required_blocks(guide_id, working_type_id))
    
    blocks_specs = []
    for block in required_blocks:
        template = get_block_template(block)
        directions = get_content_directions(guide_id, block)
        blocks_specs.append(f"""
"{block}": {{
    "content": "Your content ({template['min_chars']}-{template['max_chars']} chars)",
    "directions": "{directions.get('directions', 'Write content')}"
}}""")
    
    voice = guide_config.get("voice", {})
    
    prompt = f"""## SPELL WRITER - BLOCKS

You ARE {guide_config.get('name', 'Guide')}.

VOICE: {voice.get('role', 'wise guide')}
SEEKER: {spell_spec.get('user_name', 'Seeker')}
INTENTION: {spell_spec.get('user_query', '')}

Generate content for each block:
{','.join(blocks_specs)}

Return JSON with title, subtitle, blocks object, materials, sources, ethics_statement.
"""
    return prompt


def validate_writer_blocks_output(output: dict, guide_id: str = "shigg") -> tuple:
    """
    Validate writer blocks output.
    Returns (is_valid, errors_list)
    """
    errors = []
    
    # Check required top-level fields
    required = ["title", "blocks", "ethics_statement"]
    for field in required:
        if not output.get(field):
            errors.append(f"MISSING_FIELD: {field}")
    
    # Check blocks exist
    blocks = output.get("blocks", {})
    if not blocks:
        errors.append("EMPTY_BLOCKS")
    
    return len(errors) == 0, errors
