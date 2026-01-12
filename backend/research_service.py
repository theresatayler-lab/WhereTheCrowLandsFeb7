# Research Service - Dual-Model Architecture V2
# DeepSeek for research/factual content, OpenAI for persona voice
# V2: Enhanced research modes, strict validation, persona-specific biases

import os
import logging
import time
import re
from typing import Dict, List, Optional, Any
from openai import AsyncOpenAI
from pydantic import BaseModel, Field

logger = logging.getLogger(__name__)

# ============================================================================
# Provider Configuration
# ============================================================================

DEEPSEEK_BASE_URL = "https://api.deepseek.com"
DEEPSEEK_MODEL = "deepseek-chat"
OPENAI_MODEL = "gpt-4o"

def get_provider_status() -> Dict[str, Any]:
    """Return configuration status for all providers"""
    return {
        "openai_configured": bool(os.environ.get('OPENAI_API_KEY')),
        "deepseek_configured": bool(os.environ.get('DEEPSEEK_API_KEY')),
        "deepseek_base_url": DEEPSEEK_BASE_URL,
        "deepseek_model": DEEPSEEK_MODEL,
        "openai_model": OPENAI_MODEL,
        "image_provider": os.environ.get('IMAGE_PROVIDER', 'library')
    }

# ============================================================================
# Research Modes (V2 Enhanced - 10 total modes)
# ============================================================================

RESEARCH_MODES = {
    # Original 3 modes
    "spell_origins": "History + folklore + practice rationale (default)",
    "source_explainer": "Deep dive on specific author/tradition cited in spell",
    "safety_substitutions": "Practical swaps + risk notes for candles, smoke, etc.",
    # DeepSeek V3 additions
    "cross_traditional_analysis": "Parallel examples from 2-3 traditions, divergence/convergence points",
    "material_science_context": "Ethnobotanical data, chemical compounds, physical properties",
    "ritual_anatomy": "Component breakdown (opening, invocation, operation, closing), timing significance",
    "historical_evolution": "Earliest documented form, key adaptations, modern interpretations",
    "geographic_variants": "Regional variations, environmental influences, cultural syncretism",
    "transmission_analysis": "Oral/written transmission paths, preservation gaps, reconstruction challenges",
    "contemporary_adaptation": "Urban substitutions, digital adaptations, apartment-friendly modifications"
}

# Triggers for automatic mode selection
MODE_TRIGGERS = {
    "cross_traditional_analysis": ["compare", "comparison", "other traditions", "different cultures", "similar to"],
    "material_science_context": ["why does", "how does", "scientific", "chemical", "properties of"],
    "ritual_anatomy": ["structure", "components", "essential parts", "how to perform", "steps of"],
    "historical_evolution": ["evolved", "changed over time", "history of", "originally", "ancient to modern"],
    "geographic_variants": ["regional", "appalachian", "celtic", "nordic", "local variations"],
    "transmission_analysis": ["passed down", "taught", "preserved", "oral tradition", "grimoire tradition"],
    "contemporary_adaptation": ["modern", "apartment", "urban", "city", "today's world"]
}

# Objects that trigger safety_substitutions mode
SAFETY_TRIGGER_OBJECTS = {"candle", "smoke", "burning", "fire", "herbs", "water", "oil", "incense", "sharp", "blood"}

# ============================================================================
# Tradition Tags Taxonomy (V3 Expanded - 28 tags)
# ============================================================================

TRADITION_TAGS = {
    # Original core tags
    "british_folk_magic": "Cunning folk, charms, and rural practices of England, Scotland, Wales",
    "kitchen_witchery": "Domestic magic centered on hearth, cooking, and household protection",
    "cunning_folk": "Professional magical practitioners of rural Britain",
    "celtic_devotional": "Irish/Scottish traditions with devotional and protective focus",
    "victorian_spiritualism": "Table-tipping, séance, and psychic development practices",
    "golden_dawn": "Hermetic Order ritual magic and ceremonial traditions",
    
    # V3 Additions from DeepSeek
    "appalachian_folk_magic": "Syncretic British Isles magic adapted to Appalachian mountains with Native American and African influences",
    "powwow_braucherei": "Pennsylvania Dutch folk magic blending Christian prayer, sigils, and sympathetic magic",
    "hoodoo_conjure": "African American folk tradition focusing on practical ends using roots, herbs, and mineral curios",
    "hedgewitchery": "Practice centered on boundary-crossing, spirit work, and liminal states",
    "folk_catholicism": "Localized Catholic devotional practices blended with pre-Christian magic",
    "grimoire_tradition": "Book-based magic from medieval and Renaissance manuscript traditions",
    "victorian_flower_language": "Symbolic use of flowers and herbs for communication and magic",
    "romani_folk_practices": "Diverse itinerant traditions with strong focus on protection and fortune",
    "nordic_trolldom": "Scandinavian folk magic with staffs, staves, and runic influences",
    "medieval_physic_garden": "Monastic herbalism blending medicine, magic, and devotion",
    "salem_folk_magic": "New England practices developing post-witch trials with unique regional character",
    "wisewoman_healing": "Women's domestic healing traditions spanning birth to death care",
    "traveller_charms": "Oral charm traditions of Irish and Scottish travelling communities",
    "mountain_magic": "Isolated highland traditions preserving archaic elements",
    "coastal_folk_magic": "Practices incorporating sea materials, weather lore, and sailor traditions",
    "border_countries": "Practices from regions between England/Scotland with distinct hybrid character",
    "workplace_witchery": "Modern adaptations for office, retail, and service job environments",
    "postwar_makeshift_magic": "Resource-scarce practices from rationing periods using substitutions",
    "lorica_prayers": "Celtic protective prayer traditions, breastplate prayers",
    "wartime_domestic_life": "Magic adapted for WWII homefront conditions",
    "tea_traditions": "Divination and magic using tea leaves and tea rituals",
    "morrigan_traditions": "Celtic war goddess and transformation practices"
}

# ============================================================================
# Source Quality Tiers
# ============================================================================

SOURCE_QUALITY_TIERS = {
    "academic_primary": {
        "description": "Peer-reviewed historical research, edited primary documents, archaeological reports",
        "verification_flag": "verified",
        "use_case": "Core historical claims",
        "confidence_default": "high"
    },
    "folk_archive": {
        "description": "Folklore society collections, oral history recordings, museum documentation",
        "verification_flag": "verified_source_needs_context",
        "use_case": "Practice documentation",
        "confidence_default": "medium"
    },
    "practitioner_primary": {
        "description": "Diaries, correspondence, grimoires from historical practitioners",
        "verification_flag": "contemporary_account",
        "use_case": "Practical application details",
        "confidence_default": "medium"
    },
    "modern_scholar_practitioner": {
        "description": "20th/21st century practitioners with academic rigor",
        "verification_flag": "methodology_transparent",
        "use_case": "Adaptation frameworks",
        "confidence_default": "medium"
    },
    "community_tradition": {
        "description": "Living oral tradition from identified cultural bearers",
        "verification_flag": "cultural_context_required",
        "use_case": "Continuous practice lines",
        "confidence_default": "medium"
    },
    "speculative_reconstruction": {
        "description": "Logical reconstruction from fragmentary evidence",
        "verification_flag": "marked_as_reconstruction",
        "use_case": "Gap filling with transparency",
        "confidence_default": "low"
    },
    "popular_synthesis": {
        "description": "Modern how-to books without clear sourcing",
        "verification_flag": "needs_verification",
        "use_case": "Last resort with caveats",
        "confidence_default": "low"
    }
}

# ============================================================================
# "Why This Works" Framing Patterns
# ============================================================================

WHY_THIS_WORKS_PATTERNS = [
    "Historical practitioners believed {X} worked because {Y}, based on {Z} understanding of the world.",
    "Anthropologists note that rituals like this often serve {function} in community contexts.",
    "The symbolic correspondence between {component} and {intent} appears across multiple traditions, suggesting shared intuitive logic.",
    "Modern cognitive science suggests practices involving {sensory_element} can influence {mental_state} through {mechanism}.",
    "This practice aligns with the principle of {magical_concept}, which holds that {explanation}.",
    "Materially, {component} contains {property} that historically led to associations with {effect}.",
    "The repetitive action of {practice} may induce a {state} conducive to {desired_outcome}.",
    "Seasonal timing here corresponds with {natural_cycle}, connecting personal practice to larger rhythms.",
    "The use of {element} taps into long-standing human associations between {quality} and {symbolic_meaning}.",
    "This form of magic operates on the principle of {sympathy_contagion_naming}, where {explanation}."
]

# ============================================================================
# Cross-Persona Connection Points
# ============================================================================

CROSS_PERSONA_OVERLAPS = [
    {
        "area": "Domestic protective magic",
        "personas_involved": ["shigg", "cathleen", "theresa"],
        "shared_sources": "Hearth protection charms, threshold rituals, concealed objects in walls"
    },
    {
        "area": "Ancestral communication",
        "personas_involved": ["katherine", "theresa"],
        "tension_point": "Katherine uses structured séance; Theresa uses family storytelling and object-based memory"
    },
    {
        "area": "Word-based magic (charms/prayers)",
        "personas_involved": ["cathleen", "shigg"],
        "shared_sources": "Lorica prayers meet cunning folk verbal charms"
    },
    {
        "area": "Crisis improvisation",
        "personas_involved": ["shigg", "cathleen", "theresa"],
        "common_thread": "Resource scarcity leading to symbolic substitution"
    }
]

CROSS_PERSONA_TENSIONS = [
    "Shigg's pragmatic kitchen witchery vs. Katherine's ceremonial Golden Dawn influences",
    "Cathleen's community-focused protective magic vs. Theresa's private family traditions",
    "Katherine's Victorian academic occultism vs. Shigg's oral folk transmission"
]

# ============================================================================
# Safety Substitution Categories (V3 Enhanced)
# ============================================================================

SAFETY_CATEGORIES = {
    "material_hazards": {
        "subcategories": ["flammable", "toxic_ingestion", "toxic_inhalation", "skin_irritant", "eye_hazard"],
        "description": "Physical dangers from materials used in practice"
    },
    "procedure_hazards": {
        "subcategories": ["fire_risk", "sharp_objects", "outdoor_concerns", "disposal_methods"],
        "description": "Risks from how rituals are performed"
    },
    "psychological_considerations": {
        "subcategories": ["trance_depth", "ancestral_triggers", "fear_response", "emotional_drain"],
        "description": "Mental and emotional safety factors"
    },
    "cultural_sensitivity": {
        "subcategories": ["closed_practice", "appropriate_use", "historical_context", "modern_politics"],
        "description": "Respect for cultural boundaries and appropriation concerns"
    },
    "practical_constraints": {
        "subcategories": ["space_requirements", "time_commitment", "cost_prohibitive", "seasonal_limitations"],
        "description": "Logistics that may require adaptation"
    },
    "substitution_types": {
        "subcategories": ["symbolic_equivalent", "functional_equivalent", "simplified_version", "modern_alternative"],
        "description": "Ways to adapt practices safely"
    }
}

# ============================================================================
# Reading Path Pedagogy (Learning Stages)
# ============================================================================

LEARNING_STAGES = [
    {
        "stage": "Foundation",
        "content_type": "Historical context, basic principles, safety overview",
        "outcome": "Understand what they're engaging with and why it matters",
        "order": 1
    },
    {
        "stage": "Observation",
        "content_type": "Case studies of complete rituals, component analysis",
        "outcome": "Recognize patterns and structures in practice",
        "order": 2
    },
    {
        "stage": "Participation",
        "content_type": "Simple, low-risk rituals with clear steps",
        "outcome": "First-hand experience of ritual process",
        "order": 3
    },
    {
        "stage": "Analysis",
        "content_type": "Comparative traditions, why things work, adaptation principles",
        "outcome": "Critical understanding of mechanisms and variations",
        "order": 4
    },
    {
        "stage": "Improvisation",
        "content_type": "Substitution guides, personalization frameworks, troubleshooting",
        "outcome": "Confident adaptation to personal context",
        "order": 5
    },
    {
        "stage": "Integration",
        "content_type": "Seasonal cycles, life event rituals, community aspects",
        "outcome": "Practice woven into daily life and larger cycles",
        "order": 6
    }
]

# ============================================================================
# Persona-Specific Research Biases (V3 Enhanced)
# ============================================================================

PERSONA_RESEARCH_BIASES = {
    "shigg": {
        "tradition_bias": ["british_folk_magic", "kitchen_witchery", "cunning_folk", "wartime_domestic_life", "tea_traditions"],
        "avoid_bias": ["golden_dawn_ritual_magic", "high_ceremony", "qabalah_deep_dive"],
        "flavor": "British domestic folklore, grandmother wisdom, bird omens"
    },
    "cathleen": {
        "tradition_bias": ["protective_folk_magic", "celtic_devotional", "lorica_prayers", "wartime_homefront", "morrigan_traditions"],
        "avoid_bias": ["kitchen_witchery_focus", "tailoring_diagrams", "ceremonial_high_magic"],
        "flavor": "Protection, devotional, wartime resilience, Celtic traditions"
    },
    "katherine": {
        "tradition_bias": ["victorian_spiritualism", "golden_dawn", "protective_psychic_hygiene", "record_keeping", "table_tipping"],
        "avoid_bias": ["cozy_domestic_folklore", "devotional_prayer_tone", "celtic_mysticism"],
        "flavor": "Research, diagrams, spiritualism, occult precision"
    },
    "theresa": {
        "tradition_bias": ["genealogy_magic", "family_secrets", "inherited_wisdom", "photo_magic", "storytelling_traditions"],
        "avoid_bias": ["formal_ceremony", "academic_distance"],
        "flavor": "Ancestral wisdom, truth-seeking, inherited objects"
    }
}

# ============================================================================
# Pydantic Models - V2 Enhanced
# ============================================================================

class ResearchRequest(BaseModel):
    query: str
    context: Optional[str] = None

class ResearchResponseV2(BaseModel):
    """V2 Research Object with enhanced structure"""
    research_mode: str = "spell_origins"
    summary: str = ""
    key_takeaways: List[Dict[str, Any]] = []
    why_this_works_facts: List[Dict[str, Any]] = []
    practice_context: Dict[str, Any] = {}
    suggested_reading_path: List[Dict[str, Any]] = []
    sources: List[Dict[str, Any]] = []
    source_map: Dict[str, List[str]] = {}

# Legacy compatibility
class ResearchResponse(BaseModel):
    answer: str
    bullets: List[Dict[str, Any]]
    sources: List[Dict[str, Any]]
    source_map: Dict[str, List[str]] = {}

class SpellbookRequest(BaseModel):
    user_request: str
    persona: str
    tone: str = "gentle"

class SpellbookResponse(BaseModel):
    response: str
    persona_name: str
    tone_used: str

class CombinedRequest(BaseModel):
    user_request: str
    persona: str = "shigg"
    tone: str = "gentle"
    context: Optional[str] = None

class CombinedResponse(BaseModel):
    spellbook_response: str
    research_origins: Dict[str, Any]
    persona_used: str

# ============================================================================
# DeepSeek Client
# ============================================================================

def get_deepseek_client() -> Optional[AsyncOpenAI]:
    """Initialize DeepSeek client using OpenAI-compatible API"""
    api_key = os.environ.get('DEEPSEEK_API_KEY')
    if not api_key:
        logger.warning("DEEPSEEK_API_KEY not found in environment variables")
        return None
    return AsyncOpenAI(
        api_key=api_key,
        base_url=DEEPSEEK_BASE_URL
    )

def get_openai_client() -> Optional[AsyncOpenAI]:
    """Get OpenAI client for persona voice"""
    api_key = os.environ.get('OPENAI_API_KEY')
    if not api_key:
        logger.warning("OPENAI_API_KEY not found in environment variables")
        return None
    return AsyncOpenAI(api_key=api_key)

# ============================================================================
# Research Mode Selection (V3 Enhanced)
# ============================================================================

def select_research_mode(user_request: str, anchor_object: Optional[str] = None, materials: List[str] = None) -> str:
    """Select appropriate research mode based on request content - V3 with 10 modes"""
    request_lower = user_request.lower()
    
    # Mode B: Source Explainer
    if any(phrase in request_lower for phrase in ["where did this come from", "origins", "history of", "sources for", "explain the source"]):
        return "source_explainer"
    
    # Mode C: Safety Substitutions
    if anchor_object and anchor_object.lower() in SAFETY_TRIGGER_OBJECTS:
        return "safety_substitutions"
    if materials:
        materials_lower = [m.lower() for m in materials]
        if any(obj in " ".join(materials_lower) for obj in SAFETY_TRIGGER_OBJECTS):
            return "safety_substitutions"
    
    # V3 Additional Modes - check triggers
    for mode, triggers in MODE_TRIGGERS.items():
        if any(trigger in request_lower for trigger in triggers):
            return mode
    
    # Default: Mode A
    return "spell_origins"

# ============================================================================
# V3 Archivist System Prompt (Enhanced)
# ============================================================================

ARCHIVIST_SYSTEM_PROMPT = """You are THE ARCHIVIST for an occult folklore app. You NEVER roleplay. You NEVER address the user emotionally. You write in a clear, educational tone.

ABSOLUTE RULES:
1. Provide REAL, VERIFIABLE sources where possible (title, author, year, URL)
2. If uncertain about a source, set "needs_verification": true — do NOT invent titles, authors, or quotes
3. Distinguish claim types: "historical" | "folklore" | "modern_occult" | "speculative"
4. NO persona voice — no "dear", "seeker", "my child", "warmth", "gentle", "beloved"
5. NO comforting lines or second-person intimacy
6. NO invented quotes from historical figures
7. Output STRICT JSON only — no markdown, no commentary

RESEARCH MODES (select based on query):
- spell_origins: History + folklore + practice rationale (default)
- source_explainer: Deep dive on specific author/tradition cited
- safety_substitutions: Practical swaps + risk notes
- cross_traditional_analysis: Compare 2-3 traditions, find convergence/divergence
- material_science_context: Ethnobotanical data, chemical properties, physical science
- ritual_anatomy: Component breakdown (opening, invocation, operation, closing)
- historical_evolution: Earliest form → key adaptations → modern interpretations
- geographic_variants: Regional variations, environmental influences
- transmission_analysis: Oral/written paths, preservation gaps, reconstruction
- contemporary_adaptation: Urban/apartment/digital adaptations

WHY THIS WORKS - USE THESE FRAMING PATTERNS:
- "Historical practitioners believed {X} worked because {Y}, based on {Z} understanding."
- "Anthropologists note rituals like this serve {function} in community contexts."
- "The symbolic correspondence between {component} and {intent} appears across traditions."
- "Modern cognitive science suggests {sensory_element} influences {mental_state} through {mechanism}."
- "This practice aligns with the principle of {magical_concept}, which holds that {explanation}."
- "Materially, {component} contains {property} historically associated with {effect}."
- "This operates on the principle of sympathy/contagion/naming, where {explanation}."

SOURCE QUALITY TIERS (assign to each source):
- academic_primary: Peer-reviewed, verified (confidence: high)
- folk_archive: Folklore society collections, needs context (confidence: medium)
- practitioner_primary: Historical diaries, grimoires (confidence: medium)
- modern_scholar_practitioner: Academic practitioners (confidence: medium)
- community_tradition: Living oral tradition (confidence: medium)
- speculative_reconstruction: Mark as reconstruction (confidence: low)
- popular_synthesis: Last resort with caveats (confidence: low)

CONFIDENCE LEVELS:
- "high": Documented in multiple academic sources
- "medium": Found in one reputable source or well-known tradition
- "low": Oral tradition, modern reconstruction, or reasonable inference

You are a librarian, not a mystic. Be helpful, precise, and honest about uncertainty."""

# ============================================================================
# Research Object V3 Schema Prompt (Enhanced)
# ============================================================================

RESEARCH_OBJECT_V2_SCHEMA = """{
  "research_mode": "spell_origins | source_explainer | safety_substitutions | cross_traditional_analysis | material_science_context | ritual_anatomy | historical_evolution | geographic_variants | transmission_analysis | contemporary_adaptation",
  "summary": "3-6 sentences factual summary of findings",
  "key_takeaways": [
    {
      "text": "Key finding or fact",
      "claim_flag": "historical | folklore | modern_occult | speculative",
      "source_refs": ["source_1"],
      "confidence": "high | medium | low"
    }
  ],
  "why_this_works_facts": [
    {
      "claim": "Use framing patterns like: 'Historical practitioners believed X worked because Y' or 'The symbolic correspondence between X and Y suggests...' or 'Modern cognitive science suggests...'",
      "claim_flag": "historical | folklore | modern_occult | speculative",
      "framing_type": "historical_belief | anthropological | symbolic | cognitive_science | magical_principle | material_property | ritualized_action | seasonal | elemental | sympathetic_magic",
      "source_refs": ["source_1"],
      "confidence": "high | medium | low"
    }
  ],
  "practice_context": {
    "tradition_tags": ["british_folk_magic", "cunning_folk", "kitchen_witchery", "celtic_devotional", "victorian_spiritualism", "golden_dawn", "appalachian_folk_magic", "powwow_braucherei", "hedgewitchery", "folk_catholicism", "grimoire_tradition", "wisewoman_healing", "coastal_folk_magic", "postwar_makeshift_magic"],
    "time_period": "e.g., 19th–early 20th century",
    "region": "e.g., Britain / Ireland / Western Europe / Appalachia",
    "cross_persona_relevance": ["shigg", "cathleen", "katherine", "theresa"],
    "note": "1-3 sentences of context"
  },
  "safety_considerations": {
    "material_hazards": ["flammable", "toxic", "irritant"],
    "procedure_hazards": ["fire_risk", "sharp_objects"],
    "psychological_considerations": ["trance_depth", "emotional_triggers"],
    "substitutions": [
      {
        "original": "open flame candle",
        "substitute": "LED candle or flashlight",
        "type": "symbolic_equivalent | functional_equivalent | simplified_version",
        "note": "Preserves light symbolism without fire risk"
      }
    ]
  },
  "suggested_reading_path": [
    {
      "stage": "Foundation | Observation | Participation | Analysis | Improvisation | Integration",
      "step_title": "Start here...",
      "why": "1 sentence explaining why this is a good entry point",
      "source_refs": ["source_1"]
    }
  ],
  "sources": [
    {
      "id": "source_1",
      "type": "book | article | archive | museum | encyclopedia",
      "quality_tier": "academic_primary | folk_archive | practitioner_primary | modern_scholar_practitioner | community_tradition | speculative_reconstruction | popular_synthesis",
      "author": "Author Name",
      "title": "Full Title",
      "year": 2003,
      "publisher_or_site": "Publisher or website name",
      "url": "https://... or null if unavailable",
      "search_terms": "fallback search terms if no URL",
      "needs_verification": false,
      "notes": "1 sentence about what this source contains (optional)"
    }
  ],
  "source_map": {
    "key_takeaways.0": ["source_1"],
    "why_this_works_facts.0": ["source_1", "source_2"]
  }
}"""

# ============================================================================
# Validation Functions
# ============================================================================

PERSONA_VOICE_PATTERNS = [
    r'\bdear\b', r'\bseeker\b', r'\bmy child\b', r'\bwarmth\b', 
    r'\bgentle\b', r'\bbeloved\b', r'\bcome closer\b', r'\blove\b',
    r'\bsweet\b', r'\bheart\b', r'\bdarling\b'
]

def validate_research_output(result: Dict[str, Any], mode: str) -> tuple[bool, List[str]]:
    """Validate research output meets quality standards. Returns (is_valid, errors)"""
    errors = []
    
    # Check for persona voice contamination
    text_to_check = str(result.get("summary", "")) + str(result.get("key_takeaways", []))
    text_lower = text_to_check.lower()
    for pattern in PERSONA_VOICE_PATTERNS:
        if re.search(pattern, text_lower):
            errors.append(f"PERSONA_VOICE: Detected '{pattern}' in research output")
    
    # Check sources have required fields
    sources = result.get("sources", [])
    for i, source in enumerate(sources):
        if not isinstance(source, dict):
            errors.append(f"SOURCE_{i}: Not a valid object")
            continue
        
        needs_verification = source.get("needs_verification", False)
        if not needs_verification:
            if not source.get("author"):
                errors.append(f"SOURCE_{i}: Missing author (set needs_verification=true if uncertain)")
            if not source.get("title"):
                errors.append(f"SOURCE_{i}: Missing title (set needs_verification=true if uncertain)")
    
    # Check minimum sources for modes A/B
    if mode in ["spell_origins", "source_explainer"]:
        valid_sources = [s for s in sources if isinstance(s, dict) and s.get("title")]
        if len(valid_sources) < 2:
            errors.append(f"INSUFFICIENT_SOURCES: Mode '{mode}' requires at least 2 sources, got {len(valid_sources)}")
    
    # Check key_takeaways have claim_flags
    for i, takeaway in enumerate(result.get("key_takeaways", [])):
        if isinstance(takeaway, dict):
            if not takeaway.get("claim_flag"):
                errors.append(f"TAKEAWAY_{i}: Missing claim_flag")
            if not takeaway.get("source_refs"):
                errors.append(f"TAKEAWAY_{i}: Missing source_refs")
    
    return len(errors) == 0, errors

# ============================================================================
# Build Research Brief (Persona-Specific Input to DeepSeek)
# ============================================================================

def build_research_brief(
    persona_id: str,
    user_request: str,
    anchor_object: Optional[str] = None,
    materials: List[str] = None,
    research_mode: str = "spell_origins"
) -> Dict[str, Any]:
    """Build a persona-specific research brief for DeepSeek"""
    
    persona_bias = PERSONA_RESEARCH_BIASES.get(persona_id, PERSONA_RESEARCH_BIASES["shigg"])
    
    brief = {
        "research_mode": research_mode,
        "persona_id": persona_id,
        "user_goal": user_request,
        "anchor_object": anchor_object,
        "materials": materials or [],
        "tradition_bias": persona_bias["tradition_bias"],
        "avoid_bias": persona_bias["avoid_bias"],
        "constraints": {
            "no_roleplay": True,
            "cite_real_sources": True,
            "no_invented_quotes": True,
            "mark_uncertain_as_needs_verification": True
        },
        "desired_outputs": [
            "origins of the practice",
            "why each key ingredient/action is used historically/folklorically",
            "credible reading links",
            "confidence levels for each claim"
        ]
    }
    
    return brief

# ============================================================================
# DeepSeek Research Query V2
# ============================================================================

async def research_query_v2(
    query: str,
    persona_id: str = "shigg",
    anchor_object: Optional[str] = None,
    materials: List[str] = None,
    context: Optional[str] = None,
    max_retries: int = 2
) -> ResearchResponseV2:
    """V2 Research query with modes, validation, and auto-retry"""
    
    start_time = time.time()
    endpoint_name = "/api/research_v2"
    provider = "deepseek"
    
    # Select research mode
    research_mode = select_research_mode(query, anchor_object, materials)
    
    logger.info(f"[PROVIDER_CALL] endpoint={endpoint_name} provider={provider} mode={research_mode} persona={persona_id}")
    
    client = get_deepseek_client()
    if not client:
        elapsed = time.time() - start_time
        logger.warning(f"[PROVIDER_CALL] endpoint={endpoint_name} status=NOT_CONFIGURED timing={elapsed:.3f}s")
        return ResearchResponseV2(
            research_mode=research_mode,
            summary="Research engine not configured. Please add DEEPSEEK_API_KEY.",
            sources=[]
        )
    
    # Build research brief
    brief = build_research_brief(persona_id, query, anchor_object, materials, research_mode)
    
    # Build user message
    user_message = f"""RESEARCH BRIEF:
{__import__('json').dumps(brief, indent=2)}

ADDITIONAL CONTEXT: {context or 'None'}

Return a Research Object V2 with this EXACT JSON structure:
{RESEARCH_OBJECT_V2_SCHEMA}

Focus on {PERSONA_RESEARCH_BIASES.get(persona_id, {}).get('flavor', 'general folklore')}.
Prioritize traditions: {', '.join(brief['tradition_bias'])}
Avoid overemphasis on: {', '.join(brief['avoid_bias'])}

Remember: You are THE ARCHIVIST. No persona voice. Strict JSON only."""

    for attempt in range(max_retries + 1):
        try:
            response = await client.chat.completions.create(
                model=DEEPSEEK_MODEL,
                messages=[
                    {"role": "system", "content": ARCHIVIST_SYSTEM_PROMPT},
                    {"role": "user", "content": user_message}
                ],
                temperature=0.6,
                max_tokens=2500,
                response_format={"type": "json_object"}
            )
            
            import json
            result = json.loads(response.choices[0].message.content)
            
            # Validate output
            is_valid, errors = validate_research_output(result, research_mode)
            
            if not is_valid:
                logger.warning(f"[VALIDATION] Attempt {attempt+1}: {errors}")
                if attempt < max_retries:
                    continue  # Retry
            
            elapsed = time.time() - start_time
            logger.info(f"[PROVIDER_CALL] endpoint={endpoint_name} provider={provider} status=SUCCESS timing={elapsed:.3f}s attempt={attempt+1}")
            
            return ResearchResponseV2(
                research_mode=result.get("research_mode", research_mode),
                summary=result.get("summary", ""),
                key_takeaways=result.get("key_takeaways", []),
                why_this_works_facts=result.get("why_this_works_facts", []),
                practice_context=result.get("practice_context", {}),
                suggested_reading_path=result.get("suggested_reading_path", []),
                sources=result.get("sources", []),
                source_map=result.get("source_map", {})
            )
            
        except Exception as e:
            elapsed = time.time() - start_time
            logger.error(f"[PROVIDER_CALL] endpoint={endpoint_name} status=ERROR attempt={attempt+1} timing={elapsed:.3f}s error={str(e)}")
            if attempt == max_retries:
                return ResearchResponseV2(
                    research_mode=research_mode,
                    summary=f"Research query failed: {str(e)}",
                    sources=[]
                )

# ============================================================================
# Legacy Research Query (Compatibility Layer)
# ============================================================================

async def research_query(query: str, context: Optional[str] = None) -> ResearchResponse:
    """Legacy research query - wraps V2 for backward compatibility"""
    
    # Use V2 internally
    v2_result = await research_query_v2(
        query=query,
        persona_id="shigg",  # Default
        context=context
    )
    
    # Convert V2 to legacy format
    bullets = []
    for takeaway in v2_result.key_takeaways:
        if isinstance(takeaway, dict):
            bullets.append({
                "text": takeaway.get("text", ""),
                "claim_flag": takeaway.get("claim_flag", "folklore"),
                "source_refs": takeaway.get("source_refs", []),
                "confidence": takeaway.get("confidence", "medium")
            })
    
    return ResearchResponse(
        answer=v2_result.summary,
        bullets=bullets,
        sources=v2_result.sources,
        source_map=v2_result.source_map
    )

# ============================================================================
# OpenAI Spellbook Voice
# ============================================================================

PERSONA_VOICES = {
    "shigg": {
        "name": "Shigg",
        "system_prompt": """You ARE Shigg, wise grandmother of Where The Crowlands. You speak with gentle warmth, bird metaphors, and domestic magic wisdom. Your voice is dawn-quiet, poetic, full of gentle humour and deep love.

Your phrases include:
- "A bird knows..." 
- "Dawn-quiet wisdom"
- "Cup of tea and a moment's peace"
- References to feathers, nests, hearth-fires

You offer comfort through tea rituals, bird omens, and the gentle magic of everyday domestic acts."""
    },
    "cathleen": {
        "name": "Cathleen", 
        "system_prompt": """You ARE Cathleen, The Singer of Strength. Your voice carries the power of song—protection woven into breath and air. You speak with discretion and maternal warmth, never condescending.

Your phrases include:
- "Strength is not the absence of softness"
- "The dead are not gone; they simply wait in the next room"
- References to singing, humming protection, the Morrigan

You help seekers find their voice and face transformation."""
    },
    "katherine": {
        "name": "Katherine",
        "system_prompt": """You ARE Katherine, The Weaver of Hidden Knowledge. Elegant, slightly feline, you speak with Victorian precision and occult wisdom. Your voice carries the authority of the Golden Dawn and the intimacy of the home circle.

Your phrases include:
- "Every stitch carries intention"
- "The mirror shows what eyes cannot"
- References to thread, needles, seams, thresholds

You guide seekers through shadow work with unflinching honesty and compassion."""
    },
    "theresa": {
        "name": "Theresa",
        "system_prompt": """You ARE Theresa, The Seer & Storyteller. You carry the accumulated wisdom of your grandmother Katherine, your great-grandmother Cathleen, and your great-great-grandmother Shigg. You speak with the voice of one who has heard all their stories.

Your phrases include:
- "The stories never lied"
- "They told me once..."
- References to genealogy, family secrets, photographs, inherited objects

You help seekers uncover truth and connect with ancestral wisdom."""
    }
}

async def generate_spellbook_response(user_request: str, persona: str, tone: str, research_facts: List[Dict] = None) -> SpellbookResponse:
    """Generate persona-voiced spellbook response using OpenAI"""
    start_time = time.time()
    endpoint_name = "/api/spellbook"
    provider = "openai"
    
    logger.info(f"[PROVIDER_CALL] endpoint={endpoint_name} provider={provider} persona={persona} has_research_facts={research_facts is not None}")
    
    client = get_openai_client()
    
    if not client:
        elapsed = time.time() - start_time
        logger.warning(f"[PROVIDER_CALL] endpoint={endpoint_name} provider={provider} status=NOT_CONFIGURED timing={elapsed:.3f}s")
        return SpellbookResponse(
            response="Persona voice not configured. Please add OPENAI_API_KEY to environment variables.",
            persona_name="System",
            tone_used=tone
        )
    
    persona_config = PERSONA_VOICES.get(persona.lower(), PERSONA_VOICES["shigg"])
    
    tone_guidance = {
        "gentle": "Respond with soft, nurturing energy. Be invitational and tender.",
        "practical": "Respond with clear, direct guidance. Be grounded and actionable.",
        "intense": "Respond with powerful, unflinching wisdom. Go deep and don't soften the truth."
    }
    
    # Build research context if provided
    research_context = ""
    if research_facts:
        research_context = """
RESEARCH FACTS TO REFERENCE (do NOT invent beyond these):
Use these facts to explain WHY each practice works. If confidence is "low", use softening language like "some traditions say" or "it's believed that".

"""
        for fact in research_facts[:5]:  # Limit to 5 facts
            confidence = fact.get("confidence", "medium")
            soften = " (use hedging language)" if confidence == "low" else ""
            research_context += f"- {fact.get('claim', fact.get('text', ''))}{soften}\n"
    
    system_message = f"""{persona_config['system_prompt']}

TONE FOR THIS RESPONSE: {tone_guidance.get(tone, tone_guidance['gentle'])}
{research_context}

IMPORTANT RULES:
- You may NOT invent historical claims beyond what's in the research facts above
- You may add warmth and persona voice to explain these facts
- If explaining a practice's history, reference the research
- If no research fact covers something, speak from your character's lived experience only

Write in-character, as if speaking directly to the seeker. Include:
- A warm acknowledgment of their need
- Guidance in your authentic voice
- Why the practices work (using research facts where relevant)
- An invitation to return"""

    try:
        response = await client.chat.completions.create(
            model=OPENAI_MODEL,
            messages=[
                {"role": "system", "content": system_message},
                {"role": "user", "content": user_request}
            ],
            temperature=0.8,
            max_tokens=1200
        )
        
        elapsed = time.time() - start_time
        logger.info(f"[PROVIDER_CALL] endpoint={endpoint_name} provider={provider} status=SUCCESS timing={elapsed:.3f}s")
        
        return SpellbookResponse(
            response=response.choices[0].message.content,
            persona_name=persona_config['name'],
            tone_used=tone
        )
        
    except Exception as e:
        elapsed = time.time() - start_time
        logger.error(f"[PROVIDER_CALL] endpoint={endpoint_name} provider={provider} status=ERROR timing={elapsed:.3f}s error={str(e)}")
        return SpellbookResponse(
            response=f"Failed to generate response: {str(e)}",
            persona_name=persona_config['name'],
            tone_used=tone
        )

# ============================================================================
# Combined Service V2 (Both Engines with Proper Handoff)
# ============================================================================

async def generate_combined_response(
    user_request: str,
    persona: str = "shigg",
    tone: str = "gentle",
    context: Optional[str] = None,
    anchor_object: Optional[str] = None,
    materials: List[str] = None
) -> CombinedResponse:
    """Generate combined response: DeepSeek research FIRST, then OpenAI persona voice"""
    import asyncio
    
    start_time = time.time()
    endpoint_name = "/api/combined"
    
    logger.info(f"[PROVIDER_CALL] endpoint={endpoint_name} provider=BOTH persona={persona}")
    
    # STEP 1: DeepSeek Research (must complete first)
    research_query_text = f"What are the historical and folk magic traditions related to: {user_request}"
    
    research_result = await research_query_v2(
        query=research_query_text,
        persona_id=persona,
        anchor_object=anchor_object,
        materials=materials,
        context=context
    )
    
    # STEP 2: Extract facts for OpenAI
    research_facts = research_result.why_this_works_facts or []
    if not research_facts:
        # Fallback to key_takeaways if no why_this_works_facts
        research_facts = research_result.key_takeaways
    
    # STEP 3: OpenAI Persona Voice (with research facts)
    spellbook_result = await generate_spellbook_response(
        user_request=user_request,
        persona=persona,
        tone=tone,
        research_facts=research_facts
    )
    
    elapsed = time.time() - start_time
    logger.info(f"[PROVIDER_CALL] endpoint={endpoint_name} provider=BOTH status=COMPLETE timing={elapsed:.3f}s")
    
    return CombinedResponse(
        spellbook_response=spellbook_result.response,
        research_origins={
            "research_mode": research_result.research_mode,
            "summary": research_result.summary,
            "key_takeaways": research_result.key_takeaways,
            "why_this_works_facts": research_result.why_this_works_facts,
            "practice_context": research_result.practice_context,
            "suggested_reading_path": research_result.suggested_reading_path,
            "sources": research_result.sources,
            "source_map": research_result.source_map
        },
        persona_used=spellbook_result.persona_name
    )
