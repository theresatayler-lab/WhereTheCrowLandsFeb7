# Timeline Models - Enhanced Schema for Interactive Occult Revival Timeline
# Integrates with 13-category occult taxonomy from master chart

from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict, Any
from enum import Enum
import uuid

# ============================================================================
# TAXONOMY CATEGORIES (From Master Chart)
# ============================================================================

class TaxonomyCategory(str, Enum):
    PRE_MODERN = "pre_modern_esoteric"  # 1: Pre-Modern Esoteric Visual Systems
    ALCHEMY = "alchemy"  # 2: Alchemy as Visual & Symbolic Movement
    ROMANTIC_GOTHIC = "romantic_gothic"  # 3: Romantic & Gothic Occult
    SPIRITUALISM = "spiritualism"  # 4: Spiritualism, Mediumship & Trance Art
    SYMBOLISM = "symbolism"  # 5: Symbolism (Mystic Allegory)
    OCCULT_REVIVAL = "occult_revival"  # 6: Occult Revival & Ritual Orders
    SURREALISM = "surrealism"  # 7: Surrealism & Occult Surrealism
    FOLK_MAGIC = "folk_magic"  # 8: Folk Magic, Witchcraft & Cunning Traditions
    PERFORMANCE = "performance"  # 9: Occult Performance & Ritual as Art
    CINEMA = "cinema"  # 10: Occult Cinema & Moving-Image Aesthetics
    VISIONARY = "visionary"  # 11: Visionary/Psychedelic/Esoteric Fantastic Art
    CHAOS_MAGIC = "chaos_magic"  # 12: Chaos Magic, Sigil Culture & Modern Occult Design
    POP_CULTURE = "pop_culture"  # 13: Witch Archetype in Pop Culture

# Full taxonomy data from master chart
TAXONOMY_DATA = {
    "pre_modern_esoteric": {
        "id": 1,
        "name": "Pre-Modern Esoteric Visual Systems",
        "time_period": "Late Antiquity → Renaissance",
        "visual_tells": ["sacred geometry", "cosmology maps", "angelic hierarchies", "planetary seals", "talismanic grids", "diagram-as-knowledge"],
        "lane_tags": ["Hermetic", "ceremonial", "temple"],
        "glossary_terms": ["Occult (umbrella)", "Theurgy", "Correspondences", "Intent & Will", "Elemental Theory"],
        "color": "#3a506b",
        "icon": "compass"
    },
    "alchemy": {
        "id": 2,
        "name": "Alchemy as Visual & Symbolic Movement",
        "time_period": "1500s–1700s",
        "visual_tells": ["emblem books", "labs", "vessels", "sun/moon marriage", "animals as stages", "transformation sequences"],
        "lane_tags": ["Hermetic", "ceremonial", "temple"],
        "glossary_terms": ["Transformation (inner)", "Symbolic language", "Magical change", "Ritual sequence"],
        "color": "#5c6b73",
        "icon": "flask"
    },
    "romantic_gothic": {
        "id": 3,
        "name": "Romantic & Gothic Occult",
        "time_period": "late 1700s–mid 1800s",
        "visual_tells": ["moonlit rites", "sabbaths", "ruins", "demons/specters", "hysteria + fascination", "dramatic chiaroscuro"],
        "lane_tags": ["Witchcraft", "folk magic", "earth ritual"],
        "glossary_terms": ["Witchcraft (fear/fascination)", "Curse/Hex", "Folk magic (moral panic lens)", "Supernatural influence"],
        "color": "#8e6e53",
        "icon": "moon"
    },
    "spiritualism": {
        "id": 4,
        "name": "Spiritualism, Mediumship & Trance Art",
        "time_period": "1850s–early 1900s",
        "visual_tells": ["automatic marks", "spirit diagrams", "séance photo vibe", "channeled pattern worlds"],
        "lane_tags": ["Spiritualism", "channeling", "liminal contact"],
        "glossary_terms": ["Spiritualism", "Mediumship", "Trance states", "Automatic writing/drawing", "Channeling"],
        "color": "#9d8ca1",
        "icon": "eye"
    },
    "symbolism": {
        "id": 5,
        "name": "Symbolism (Mystic Allegory)",
        "time_period": "1880s–1910s",
        "visual_tells": ["veils/thresholds", "halos", "priestess/femme mystique", "erotic mysticism", "dream theology"],
        "lane_tags": ["Bridge: Hermetic + Spiritualism"],
        "glossary_terms": ["Spell (symbolic narrative)", "Ritual (meaning-making)", "Invocation (archetypal)", "Magic as metaphor"],
        "color": "#6b5b95",
        "icon": "sparkles"
    },
    "occult_revival": {
        "id": 6,
        "name": "Occult Revival & Ritual Orders",
        "time_period": "late 1800s–early 1900s",
        "visual_tells": ["temple diagrams", "ritual tools/robes", "pentagram/hexagram systems", "correspondence scales", "structured rites"],
        "lane_tags": ["Hermetic", "ceremonial", "temple"],
        "glossary_terms": ["Ceremonial/High magic", "Magick (k)", "Grimoire", "Magic circle", "Invocation/Evocation", "Tools & implements"],
        "color": "#d4a84b",
        "icon": "pentagram"
    },
    "surrealism": {
        "id": 7,
        "name": "Surrealism & Occult Surrealism",
        "time_period": "1920s–1950s",
        "visual_tells": ["initiations", "hybrids", "alchemical machinery", "inner-temple dreamscapes", "automatism"],
        "lane_tags": ["Occult surreal", "witch-alchemy narrative"],
        "glossary_terms": ["Spell as intention + image", "Ritual as inner journey", "Automatic techniques", "Archetypal magic"],
        "color": "#4a6fa5",
        "icon": "wand"
    },
    "folk_magic": {
        "id": 8,
        "name": "Folk Magic, Witchcraft & Cunning Traditions",
        "time_period": "continuous; modern crystallization 1900s–now",
        "visual_tells": ["herbs/charms/bones", "poppets", "household altars", "lunar cycles", "handmade grimoires", "craft textures"],
        "lane_tags": ["Witchcraft", "folk magic", "earth ritual"],
        "glossary_terms": ["Witchcraft (practice-based)", "Spell (folk usage)", "Charm", "Poppet", "Herbalism", "Protective magic"],
        "color": "#6b8e23",
        "icon": "leaf"
    },
    "performance": {
        "id": 9,
        "name": "Occult Performance & Ritual as Art",
        "time_period": "1960s–present",
        "visual_tells": ["body-as-altar", "durational acts", "presence/focus", "initiation logic", "documentation as relic"],
        "lane_tags": ["Earth ritual", "ceremonial embodiment"],
        "glossary_terms": ["Ritual (as performance)", "Body as tool", "Presence/focus", "Initiatory acts", "Sacrifice (symbolic)"],
        "color": "#8b2232",
        "icon": "flame"
    },
    "cinema": {
        "id": 10,
        "name": "Occult Cinema & Moving-Image Aesthetics",
        "time_period": "1940s–present (peaks 60s–70s)",
        "visual_tells": ["coded symbols", "glam ritual", "montage as invocation", "talismanic props", "spectacle"],
        "lane_tags": ["Hermetic", "Occult surreal"],
        "glossary_terms": ["Spell as scene/sequence", "Invocation as cinematic moment", "Ritual as spectacle", "Occult symbolism"],
        "color": "#2d3436",
        "icon": "film"
    },
    "visionary": {
        "id": 11,
        "name": "Visionary/Psychedelic/Esoteric Fantastic Art",
        "time_period": "1960s–present",
        "visual_tells": ["chakras/auras", "sacred geometry", "cosmic anatomy", "astral architecture", "ecstatic detail"],
        "lane_tags": ["Psychedelic", "visionary cosmos"],
        "glossary_terms": ["Energy work", "Aura/subtle body", "Elemental forces (cosmic)", "Magic as consciousness expansion"],
        "color": "#e056fd",
        "icon": "sun"
    },
    "chaos_magic": {
        "id": 12,
        "name": "Chaos Magic, Sigil Culture & Modern Occult Design",
        "time_period": "1970s–present",
        "visual_tells": ["sigils/glyph systems", "xerox/zine texture", "minimalist seals", "sticker/icon logic", "DIY grimoires"],
        "lane_tags": ["Modern sigil", "chaos", "zine occult"],
        "glossary_terms": ["Sigil", "Spell as symbol", "Intent as primary mechanism", "Minimalist ritual", "DIY grimoire"],
        "color": "#636e72",
        "icon": "zap"
    },
    "pop_culture": {
        "id": 13,
        "name": "Witch Archetype in Pop Culture",
        "time_period": "1990s–present",
        "visual_tells": ["covens/familiars/moons", "tarot-as-merch", "fashion-coded witchcraft", "game/UI glyph packs"],
        "lane_tags": ["Pop witch", "folk shorthand", "sigil aesthetics"],
        "glossary_terms": ["Coven", "Esbat", "Spell (popular usage)", "Magic circle (shorthand)", "Hex/curse (trope)"],
        "color": "#a29bfe",
        "icon": "star"
    }
}

# ============================================================================
# EVENT CATEGORIES
# ============================================================================

class EventCategory(str, Enum):
    PUBLICATION = "Publication"
    ORGANIZATION = "Organization"
    FIGURE = "Figure"
    LEGAL = "Legal"
    SITE = "Site"
    RITUAL = "Ritual"

# ============================================================================
# SOURCE QUALITY TIERS
# ============================================================================

class SourceQualityTier(str, Enum):
    ACADEMIC_PRIMARY = "academic_primary"
    ACADEMIC_SECONDARY = "academic_secondary"
    FOLK_ARCHIVE = "folk_archive"
    PRACTITIONER_PRIMARY = "practitioner_primary"
    MODERN_SCHOLAR = "modern_scholar_practitioner"
    COMMUNITY_TRADITION = "community_tradition"
    SPECULATIVE = "speculative_reconstruction"
    POPULAR = "popular_synthesis"

# ============================================================================
# GUIDE RELEVANCE
# ============================================================================

class RelevanceLevel(str, Enum):
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"

# ============================================================================
# ENHANCED TIMELINE EVENT MODEL
# ============================================================================

class TimelineSource(BaseModel):
    """Source citation for timeline events"""
    title: str
    author: Optional[str] = None
    year: Optional[int] = None
    type: str = "book"  # book, article, archive, personal
    quality_tier: str = "popular_synthesis"
    url: Optional[str] = None
    excerpt: Optional[str] = None

class EventConnections(BaseModel):
    """Relationship mapping between events"""
    influenced_by: List[str] = []  # Event IDs this was influenced by
    influenced: List[str] = []  # Event IDs this influenced
    related_events: List[str] = []  # Related contemporary events
    part_of_movement: List[str] = []  # e.g., ['golden_dawn', 'thelema']

class GuideRelevance(BaseModel):
    """How relevant this event is to each guide"""
    shigg: str = "low"
    cathleen: str = "low"
    katherine: str = "low"
    theresa: str = "low"

class GuideCommentaries(BaseModel):
    """Optional AI-generated commentary from each guide"""
    shigg: Optional[str] = None
    cathleen: Optional[str] = None
    katherine: Optional[str] = None
    theresa: Optional[str] = None

class ImageSuggestion(BaseModel):
    """AI image generation prompt data"""
    description: str
    palette: List[str] = ["#0e1629", "#8b2232", "#d4a84b", "#f5f0e6"]
    style: str = "ornate occult silk scarf illustration, art nouveau filigree"
    motifs: List[str] = []

class EventLocation(BaseModel):
    """Geographic location for events"""
    name: str
    region: str
    coordinates: Optional[Dict[str, float]] = None  # {lat, lng}

class TimelineEventEnhanced(BaseModel):
    """Enhanced timeline event with full taxonomy integration"""
    model_config = ConfigDict(extra="ignore")
    
    # Core Identification
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    year: int
    month: Optional[int] = None
    title: str
    
    # Categorization
    primary_category: str = "Publication"  # EventCategory
    secondary_category: Optional[str] = None
    
    # Taxonomy Integration (from 13-category chart)
    taxonomy_categories: List[int] = []  # References 1-13 from chart
    visual_tells: List[str] = []
    lane_tags: List[str] = []
    glossary_terms: List[str] = []
    
    # Content
    description: str
    significance: Optional[str] = None
    excerpt: Optional[str] = None
    
    # Relationships
    figures_involved: List[str] = []
    traditions: List[str] = []  # From 28 tradition tags
    connections: Optional[EventConnections] = None
    
    # Guide Integration
    guide_relevance: Optional[GuideRelevance] = None
    guide_commentaries: Optional[GuideCommentaries] = None
    
    # Sourcing
    sources: List[TimelineSource] = []
    
    # Visual Assets
    image: Optional[ImageSuggestion] = None
    image_url: Optional[str] = None
    
    # Location
    location: Optional[EventLocation] = None
    
    # Metadata
    confidence: str = "medium"  # high, medium, low
    needs_reconstruction: bool = False
    importance: int = 2  # 1=pivotal, 2=significant, 3=notable
    is_pivotal_moment: bool = False
    
    # Legacy compatibility
    category: Optional[str] = None  # Maps to primary_category for old data

# ============================================================================
# API REQUEST/RESPONSE MODELS
# ============================================================================

class TimelineFilterRequest(BaseModel):
    """Filtering options for timeline queries"""
    categories: Optional[List[int]] = None  # Taxonomy category IDs (1-13)
    primary_categories: Optional[List[str]] = None  # Event categories
    traditions: Optional[List[str]] = None
    guides: Optional[List[str]] = None  # Filter by guide relevance
    date_range: Optional[Dict[str, int]] = None  # {start: 1910, end: 1945}
    importance: Optional[List[int]] = None  # [1, 2, 3]
    figures: Optional[List[str]] = None
    search: Optional[str] = None

class TimelineStatsResponse(BaseModel):
    """Statistics about the timeline"""
    total_events: int
    events_by_category: Dict[str, int]
    events_by_decade: Dict[str, int]
    events_by_taxonomy: Dict[str, int]
    date_range: Dict[str, int]
    top_figures: List[Dict[str, Any]]

class ConnectionGraphResponse(BaseModel):
    """Network graph data for visualization"""
    nodes: List[Dict[str, Any]]  # Events, figures, organizations
    edges: List[Dict[str, Any]]  # Connections between nodes
