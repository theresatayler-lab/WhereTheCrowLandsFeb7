# Archivist Prompt - Stage 1 of Pipeline
# DeepSeek-powered research engine - NO persona voice, FACTS ONLY

ARCHIVIST_SYSTEM_PROMPT = """You are THE ARCHIVIST for the Crowlands occult folklore app.

## YOUR ROLE
You are a librarian and research assistant. You provide FACTUAL, SOURCED information.
You NEVER roleplay. You NEVER address the user emotionally. You write in a clear, educational tone.

## ABSOLUTE RULES
1. Provide REAL, VERIFIABLE sources where possible (title, author, year)
2. If uncertain about a source, mark it as needs_verification: true
3. Distinguish claim types: "historical" | "folklore" | "modern_occult" | "speculative" | "academic"
4. NO persona voice — no "dear", "seeker", "my child", "warmth", "gentle", "beloved"
5. NO comforting lines or second-person intimacy
6. NO invented quotes from historical figures
7. Output STRICT JSON only — no markdown, no commentary

## SOURCE QUALITY TIERS (assign to each source)
- academic_primary: Peer-reviewed, verified (confidence: high)
- folk_archive: Folklore society collections (confidence: medium)
- practitioner_primary: Historical diaries, grimoires (confidence: medium)
- modern_scholar_practitioner: Academic practitioners (confidence: medium)
- community_tradition: Living oral tradition (confidence: medium)
- speculative_reconstruction: Mark as reconstruction (confidence: low)
- popular_synthesis: Last resort with caveats (confidence: low)

## WHY THIS WORKS - FRAMING PATTERNS
Use these patterns to explain mechanisms:
- "Historical practitioners believed {X} worked because {Y}, based on {Z} understanding."
- "Anthropologists note rituals like this serve {function} in community contexts."
- "The symbolic correspondence between {component} and {intent} appears across traditions."
- "Modern cognitive science suggests {sensory_element} influences {mental_state}."
- "This practice aligns with the principle of {magical_concept}, which holds that {explanation}."
- "Materially, {component} contains {property} historically associated with {effect}."

## CANON COMPLIANCE
- If information is NOT in the provided canon lookup, tag it as UNVERIFIED
- Unverified claims must use hedging: "lore suggests", "some traditions hold", "it is believed"
- NEVER present unverified claims as fact

You are a librarian, not a mystic. Be helpful, precise, and honest about uncertainty."""


RESEARCH_MODES = {
    "spell_origins": "History + folklore + practice rationale",
    "source_explainer": "Deep dive on specific author/tradition",
    "safety_substitutions": "Practical swaps + risk notes",
    "cross_traditional_analysis": "Compare 2-3 traditions, find convergence/divergence",
    "material_science_context": "Ethnobotanical data, chemical properties",
    "ritual_anatomy": "Component breakdown (opening, invocation, operation, closing)",
    "historical_evolution": "Earliest form → key adaptations → modern",
    "geographic_variants": "Regional variations, environmental influences",
    "transmission_analysis": "Oral/written paths, preservation gaps",
    "contemporary_adaptation": "Urban/apartment/digital adaptations"
}


def build_archivist_prompt(
    query: str,
    guide_id: str,
    materials: list = None,
    anchor_object: str = None,
    intent: str = None,
    canon_context: dict = None
) -> str:
    """
    Build the Archivist research prompt.
    This is Stage 1 of the pipeline - pure research, no persona.
    """
    
    # Select research mode based on query content
    research_mode = _select_research_mode(query, materials, anchor_object)
    
    # Build materials context
    materials_text = ""
    if materials:
        materials_text = f"\nMATERIALS MENTIONED: {', '.join(materials)}"
        materials_text += "\nResearch the historical/folkloric significance of each material."
    
    # Build anchor context
    anchor_text = ""
    if anchor_object:
        anchor_text = f"\nANCHOR OBJECT: {anchor_object}"
        anchor_text += "\nResearch its traditional associations and symbolic meaning."
    
    # Build canon context
    canon_text = ""
    if canon_context:
        if canon_context.get("categories"):
            cat_names = [c.get("title", "") for c in canon_context["categories"]]
            canon_text += f"\nRELEVANT CANON CATEGORIES: {', '.join(cat_names)}"
        if canon_context.get("traditions"):
            trad_names = [t.get("id", "") for t in canon_context["traditions"]]
            canon_text += f"\nTRADITION FOCUS: {', '.join(trad_names)}"
        if canon_context.get("lane_tags"):
            canon_text += f"\nVISUAL LANE TAGS: {', '.join(canon_context['lane_tags'])}"
    
    # Guide-specific research bias
    guide_bias = _get_guide_research_bias(guide_id)
    
    prompt = f"""## RESEARCH REQUEST

QUERY: {query}
INTENT: {intent or "Not specified"}
GUIDE CONTEXT: {guide_id} - {guide_bias['flavor']}
RESEARCH MODE: {research_mode}
{materials_text}
{anchor_text}
{canon_text}

## RESEARCH BIAS FOR THIS GUIDE
Primary traditions: {', '.join(guide_bias['traditions'])}
Avoid overemphasis on: {', '.join(guide_bias['avoid'])}
Flavor: {guide_bias['flavor']}

## DETAILED RESEARCH EMPHASIS
{guide_bias.get('research_emphasis', '')}

## PRIORITY SOURCES (seek these out specifically)
{chr(10).join('- ' + s for s in guide_bias.get('source_priorities', []))}

## OUTPUT FORMAT
Return ONLY this JSON structure (no markdown, no explanation):

{{
    "query_understood": "Your restatement of what the seeker needs",
    "research_mode": "{research_mode}",
    "facts": [
        {{
            "claim": "The factual claim (minimum 20 chars)",
            "claim_type": "historical|folklore|modern_occult|speculative|academic",
            "confidence": "high|medium|low",
            "source_refs": ["source_id_1", "source_id_2"],
            "why_it_works": "Framing pattern explanation",
            "hedging_required": false
        }}
    ],
    "sources": [
        {{
            "source_id": "unique_id",
            "author": "Author Name",
            "work": "Work Title",
            "year": 1900,
            "quality_tier": "academic_primary|folk_archive|practitioner_primary|modern_scholar_practitioner|community_tradition|speculative_reconstruction|popular_synthesis",
            "relevance": "Why this source matters for this query",
            "learn_more_url": "https://verified-url.com"
        }}
    ],
    "tradition_context": {{
        "primary_tradition": "main tradition this draws from",
        "related_traditions": ["related_1", "related_2"],
        "geographic_origin": "location",
        "time_period": "era description",
        "visual_lane": "lane tag from taxonomy"
    }},
    "timeline_anchors": [
        {{
            "event_id": "timeline_event_id",
            "year": 1888,
            "title": "Event title",
            "relevance": "Why this event matters"
        }}
    ],
    "material_notes": [
        {{
            "material": "material name",
            "historical_use": "how it was traditionally used",
            "symbolic_meaning": "what it represents",
            "safe_substitution": "safer alternative if needed"
        }}
    ],
    "safety_flags": ["any safety concerns"],
    "unverified_claims": [
        {{
            "claim": "claim that couldn't be verified",
            "why_unverified": "reason",
            "suggested_framing": "how Writer should phrase this"
        }}
    ]
}}

## RULES
1. Minimum 3 facts, maximum 10
2. Minimum 2 sources, maximum 6
3. Every fact needs at least 1 source_ref
4. If a claim cannot be verified, put it in unverified_claims with hedging
5. Match research to guide's tradition bias
6. Include timeline_anchors linking to relevant historical events
7. Flag any safety concerns in safety_flags"""

    return prompt


def _select_research_mode(query: str, materials: list, anchor: str) -> str:
    """Select the most appropriate research mode based on query content"""
    query_lower = query.lower()
    
    if "substitute" in query_lower or "alternative" in query_lower or "safe" in query_lower:
        return "safety_substitutions"
    elif "history" in query_lower or "origin" in query_lower or "where did" in query_lower:
        return "historical_evolution"
    elif "compare" in query_lower or "difference" in query_lower:
        return "cross_traditional_analysis"
    elif any(word in query_lower for word in ["herb", "plant", "crystal", "material"]):
        return "material_science_context"
    elif "structure" in query_lower or "how to" in query_lower:
        return "ritual_anatomy"
    elif materials and len(materials) > 2:
        return "spell_origins"
    else:
        return "spell_origins"


def _get_guide_research_bias(guide_id: str) -> dict:
    """Get research bias configuration for a guide - deeply rooted in each woman's actual life and traditions"""
    biases = {
        "shigg": {
            "traditions": ["british_folk_magic", "kitchen_witchery", "bird_oracle_tradition", "postwar_makeshift_magic", "east_end_cunning_folk"],
            "avoid": ["high_ceremonial", "dramatic_ritual", "complex_qabalah", "crystal_shop_aesthetics", "new_age_manifestation"],
            "flavor": "Domestic wisdom, bird lore, tea rituals, wartime resilience, East End practicality",
            "research_emphasis": (
                "Focus on: The Rubaiyat of Omar Khayyam (FitzGerald translation), domestic folk magic of the East End, "
                "bird augury and omen-reading in British folk tradition, wartime kitchen resourcefulness, "
                "Yeats and poetry as wisdom tradition, 'spoil the child spare the rod' philosophy of nurturing. "
                "Shigg was a grandmother who read poetry, watched birds, and kept a warm kitchen. "
                "Her magic was in the everyday: tea, bread for birds, a poem read aloud, a warm word. "
                "Research should find PRACTICAL, DOMESTIC, AVAILABLE sources - nothing requiring special shops."
            ),
            "source_priorities": [
                "Owen Davies - Popular Magic (British folk traditions)",
                "The Rubaiyat of Omar Khayyam - FitzGerald translation",
                "W.B. Yeats - poetry and Irish folk traditions",
                "Folklore archives of British domestic practice",
                "Bird augury in British and European tradition"
            ]
        },
        "cathleen": {
            "traditions": ["celtic_devotional", "victorian_spiritualism", "spiritualist_home_circle", "morrigan_devotion", "irish_hedge_witchcraft", "voice_magic"],
            "avoid": ["cold_intellectualism", "testing_protocols", "skeptical_framing", "domestic_cosiness", "kitchen_witch_aesthetics"],
            "flavor": "Voice magic, Irish hedge witchcraft, British Spiritualism, protection, fierce maternal sovereignty",
            "research_emphasis": (
                "Focus on: Irish hedge witchcraft traditions, British Spiritualist movement (home circles, séances), "
                "the Morrigan as sovereign protector, voice and song as magical tools, Victorian kitchen-as-altar traditions, "
                "wartime Women's Land Army culture, protective ward traditions from Ireland, psychic development in Spiritualist context. "
                "Cathleen was a known psychic from an Irish family. She sang, she protected, she knew things before they happened. "
                "Her husband Fred had intelligence connections during the war (research military intelligence culture for context, "
                "but never state this directly). She may have been involved in secret wartime networks. "
                "Research should find PROTECTIVE, VOCAL, FIERCE sources - traditions of women who wielded power through voice and presence."
            ),
            "source_priorities": [
                "Irish folk magic and hedge witchcraft traditions",
                "Victorian Spiritualist movement primary sources",
                "Morrigan traditions in Irish mythology",
                "Voice and song in magical practice across cultures",
                "British wartime women's history and secret networks"
            ]
        },
        "katherine": {
            "traditions": ["golden_dawn", "grimoire_tradition", "hermetic_qabalah", "victorian_spiritualism", "sympathetic_magic", "spitalfields_craft"],
            "avoid": ["cozy_domestic", "intuition_only", "unstructured_practice", "bird_oracle", "kitchen_imagery"],
            "flavor": "Precision, Victorian evidence-based occultism, shadow work, needle-and-thread correspondences, dark London eccentricity",
            "research_emphasis": (
                "Focus on: Golden Dawn methodology and protocols, Victorian Spiritualism's evidence-based approach, "
                "sympathetic magic theory (as above so below), Spitalfields weavers and textile craft traditions, "
                "Victorian seamstress/tailor magical correspondences, navy and sailors' superstitions (WW1/post-WW1), "
                "Jungian shadow work methodology, sigil craft and geometric magic, dark London occult traditions. "
                "Katherine was from Spitalfields weaver-dressmaker stock. She was precise, methodical, and treated magic "
                "like a Victorian scientist treats an experiment. She is the 'dark side of duality' - truth-dark, not horror-dark. "
                "Her London was a place of traditional eccentricity, hidden knowledge, and careful craft. "
                "Research should find PRECISE, DOCUMENTED, METHODICAL sources - academic-quality work on occult practice."
            ),
            "source_priorities": [
                "Golden Dawn historical documents and methodology",
                "Dion Fortune - Psychic Self-Defence and other works (for methodology, cited as inspiration)",
                "A.E. Waite and Victorian occult scholarship",
                "Jung - shadow work and psychological alchemy",
                "Spitalfields and East London craft traditions",
                "Victorian Spiritualist Society documentation"
            ]
        },
        "theresa": {
            "traditions": ["investigative_journalism", "pattern_recognition", "genealogical_magic", "archival_practice"],
            "avoid": ["certainty_claims", "simple_answers", "ignoring_evidence"],
            "flavor": "Pattern-breaking, truth-seeking, connecting threads across generations",
            "research_emphasis": (
                "Focus on: Genealogical research as magical practice, breaking generational patterns, "
                "photography as divination, DNA as true-name magic, archives that answer back, "
                "investigative approaches to family history and occult tradition. "
                "Theresa is the granddaughter who broke the family's veil spell by asking questions."
            ),
            "source_priorities": [
                "Genealogical research methodology",
                "Generational trauma and pattern-breaking literature",
                "Archival practice as spiritual work"
            ]
        },
        "brenda": {
            "traditions": ["dion_fortune_inspired", "war_era_resilience", "family_chronicle", "power_of_the_pen", "wartime_spiritualism"],
            "avoid": ["ceremonial_excess", "crystal_aesthetics", "dark_gothic", "cultural_appropriation"],
            "flavor": "Dion Fortune-inspired, war/post-war/cold war resilience, family chronicle, writing as magical power",
            "research_emphasis": (
                "Focus on: Dion Fortune's works (cite as inspiration, not as claimed lineage), "
                "wartime and post-war magical practice in Britain, the power of writing and letters as magical acts, "
                "family chronicle traditions, the keeping of records as protection against forgetting. "
                "Brenda was a sister of Shigg who kept the family stories alive through writing. "
                "Research should find sources on WRITING AS POWER, WARTIME RESILIENCE, FAMILY MEMORY."
            ),
            "source_priorities": [
                "Dion Fortune - works and methodology (cited as inspiration)",
                "British wartime home front and resilience traditions",
                "Letter-writing as ritual and magical practice",
                "Family chronicle and oral history traditions"
            ]
        }
    }

    return biases.get(guide_id, biases["shigg"])


def validate_archivist_output(output: dict) -> tuple[bool, list[str]]:
    """Validate Archivist output against schema requirements"""
    errors = []
    
    # Check required fields
    required = ["query_understood", "research_mode", "facts", "sources", "tradition_context"]
    for field in required:
        if field not in output:
            errors.append(f"MISSING_FIELD: {field}")
    
    # Check facts
    facts = output.get("facts", [])
    if len(facts) < 3:
        errors.append(f"TOO_FEW_FACTS: {len(facts)} < 3")
    if len(facts) > 10:
        errors.append(f"TOO_MANY_FACTS: {len(facts)} > 10")
    
    for i, fact in enumerate(facts):
        if not fact.get("claim"):
            errors.append(f"FACT_{i}_MISSING_CLAIM")
        if not fact.get("source_refs"):
            errors.append(f"FACT_{i}_MISSING_SOURCE_REFS")
        if fact.get("claim_type") not in ["historical", "folklore", "modern_occult", "speculative", "academic"]:
            errors.append(f"FACT_{i}_INVALID_CLAIM_TYPE: {fact.get('claim_type')}")
    
    # Check sources
    sources = output.get("sources", [])
    if len(sources) < 2:
        errors.append(f"TOO_FEW_SOURCES: {len(sources)} < 2")
    
    return len(errors) == 0, errors
