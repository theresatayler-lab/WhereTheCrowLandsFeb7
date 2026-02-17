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
    POLITICAL_ACTIVISM = "political_activism"  # 14: Protest, Political Action & Social Change

# Full taxonomy data from master chart - expanded with all details
TAXONOMY_DATA = {
    "pre_modern_esoteric": {
        "id": 1,
        "name": "Pre-Modern Esoteric Visual Systems",
        "time_period": "Late Antiquity → Renaissance (c. 200-1600 CE)",
        "visual_tells": ["sacred geometry", "cosmology maps", "angelic hierarchies", "planetary seals", "talismanic grids", "diagram-as-knowledge", "mandalas", "yantras", "labyrinth designs"],
        "lane_tags": ["Hermetic", "ceremonial", "temple"],
        "glossary_terms": ["Occult (umbrella)", "Theurgy", "Correspondences", "Intent & Will", "Elemental Theory", "Sympathetic Magic", "Divination Systems"],
        "why_here": "Foundational philosophical + diagrammatic systems that later grimoires, orders, and occult design languages build on. Visual knowledge storage before print.",
        "core_figures": ["Robert Fludd", "John Dee", "Athanasius Kircher", "Marsilio Ficino", "Hildegard von Bingen"],
        "expanded_examples": "Ancient Egyptian temple diagrams • Greek Orphic gold tablets • Chinese I Ching hexagrams • Jewish Merkabah mysticism • Islamic Sufi geometric patterns • Byzantine hesychast prayer diagrams • Medieval Christian mystics' visions • Renaissance hermeticists • Alchemical illustrations in Splendor Solis • Robert Fludd's Utriusque Cosmi Historia",
        "color": "#3a506b",
        "icon": "compass"
    },
    "alchemy": {
        "id": 2,
        "name": "Alchemy as Visual & Symbolic Movement",
        "time_period": "1500s–1700s (peak), roots in Hellenistic Egypt & Chinese Daoism",
        "visual_tells": ["emblem books", "labs", "vessels", "sun/moon marriage", "animals as stages", "transformation sequences", "rebis imagery", "ouroboros", "chemical weddings"],
        "lane_tags": ["Hermetic", "ceremonial", "temple"],
        "glossary_terms": ["Transformation (inner)", "Symbolic language", "Magical change", "Ritual sequence", "Purification", "Solve et Coagula"],
        "why_here": "Alchemy frames 'magic' as staged symbolic process; the visual culture is literally process diagrams in allegory form. Laboratory as ritual space.",
        "core_figures": ["Michael Maier", "Paracelsus", "Isaac Newton", "Zosimos of Panopolis", "Basil Valentine"],
        "expanded_examples": "Hellenistic Egyptian alchemical papyri • Chinese Daoist alchemical texts • Islamic alchemy in Jabirian corpus • European medieval alchemical manuscripts • Renaissance emblem books • Rosicrucian manifestos • Royal Society's early chemical experiments",
        "color": "#5c6b73",
        "icon": "flask"
    },
    "romantic_gothic": {
        "id": 3,
        "name": "Romantic & Gothic Occult",
        "time_period": "late 1700s–mid 1800s, echoes in Victorian Gothic and 20th century horror",
        "visual_tells": ["moonlit rites", "sabbaths", "ruins", "demons/specters", "hysteria + fascination", "dramatic chiaroscuro", "stormy landscapes", "haunted architecture", "decaying beauty"],
        "lane_tags": ["Witchcraft", "folk magic", "earth ritual"],
        "glossary_terms": ["Witchcraft (fear/fascination)", "Curse/Hex", "Folk magic (moral panic lens)", "Supernatural influence", "The Sublime"],
        "why_here": "Where 'witch' becomes a charged social archetype; fear + fascination drives aestheticization more than system. Gothic as haunting aesthetic.",
        "core_figures": ["Francisco Goya", "Henry Fuseli", "William Blake", "Ann Radcliffe", "Matthew Lewis", "Mary Shelley", "Bram Stoker"],
        "expanded_examples": "Gothic novel illustrations • Romantic painting of supernatural • Ballad collections of folk horror • Phantasmagoria magic lantern shows • Victorian ghost story illustrations • Early horror film aesthetics",
        "color": "#8e6e53",
        "icon": "moon"
    },
    "spiritualism": {
        "id": 4,
        "name": "Spiritualism, Mediumship & Trance Art",
        "time_period": "1850s–early 1900s (peak), roots in Shaker gifts & Mesmerism",
        "visual_tells": ["automatic marks", "spirit diagrams", "séance photo vibe", "channeled pattern worlds", "ectoplasm", "spirit photography", "ouija boards"],
        "lane_tags": ["Spiritualism", "channeling", "liminal contact"],
        "glossary_terms": ["Spiritualism", "Mediumship", "Trance states", "Automatic writing/drawing", "Channeling", "Spell as transmission"],
        "why_here": "Focus is contact + transmission; visual output often claims to be 'received' rather than invented. Technology (photography) as spiritual tool.",
        "core_figures": ["Georgiana Houghton", "Hilma af Klint", "Emma Kunz", "Madge Gill", "Augustin Lesage", "Fox sisters", "D.D. Home"],
        "expanded_examples": "Shaker gift drawings • Fox sisters' rappings • Spiritualist camp meetings • Theosophical automatic writing • Surrealist automatism • New Age channeling • Contemporary mediumistic art",
        "color": "#9d8ca1",
        "icon": "eye"
    },
    "symbolism": {
        "id": 5,
        "name": "Symbolism (Mystic Allegory)",
        "time_period": "1880s–1910s (peak), roots in Pre-Raphaelites",
        "visual_tells": ["veils/thresholds", "halos", "priestess/femme mystique", "erotic mysticism", "dream theology", "decadent sacred", "androgynous figures", "occult interiors"],
        "lane_tags": ["Bridge: Hermetic + Spiritualism"],
        "glossary_terms": ["Spell (symbolic narrative)", "Ritual (meaning-making)", "Invocation (archetypal)", "Magic as metaphor", "Sacred erotic", "Mystical union"],
        "why_here": "Converts occult ideas into interior allegory—psychological, poetic, devotional; 'magic' as meaning. Art as ritual object.",
        "core_figures": ["Odilon Redon", "Gustave Moreau", "Fernand Khnopff", "Edvard Munch", "Gustav Klimt", "Aubrey Beardsley", "Jean Delville"],
        "expanded_examples": "Pre-Raphaelite Brotherhood • French Symbolist painting • Belgian Symbolist circles • Vienna Secession mystical works • Russian Symbolist poetry and art • Decadent movement illustrations",
        "color": "#6b5b95",
        "icon": "sparkles"
    },
    "occult_revival": {
        "id": 6,
        "name": "Occult Revival & Ritual Orders",
        "time_period": "late 1800s–early 1900s (peak), roots in Masonic-Rosicrucian revival",
        "visual_tells": ["temple diagrams", "ritual tools/robes", "pentagram/hexagram systems", "correspondence scales", "structured rites", "initiation certificates", "order regalia"],
        "lane_tags": ["Hermetic", "ceremonial", "temple"],
        "glossary_terms": ["Ceremonial/High magic", "Magick (k)", "Grimoire", "Magic circle", "Invocation/Evocation", "Tools & implements", "Ritual structure", "Grade system"],
        "why_here": "Formalization + hierarchy + system design; the 'temple logic' of modern ceremonial aesthetics. Orders as living systems.",
        "core_figures": ["MacGregor Mathers", "A.E. Waite", "Pamela Colman Smith", "Aleister Crowley", "Dion Fortune", "Israel Regardie"],
        "expanded_examples": "German Rosicrucian circles • French Martinist orders • British magical societies • American occult orders • Post-war ceremonial magic revival • Contemporary temple magic",
        "color": "#C8A44D",
        "icon": "pentagram"
    },
    "surrealism": {
        "id": 7,
        "name": "Surrealism & Occult Surrealism",
        "time_period": "1920s–1950s (peak), roots in Symbolism",
        "visual_tells": ["initiations", "hybrids", "alchemical machinery", "inner-temple dreamscapes", "automatism", "esoteric narrative", "biomorphic forms", "chance operations", "dream maps"],
        "lane_tags": ["Occult surreal", "witch-alchemy narrative"],
        "glossary_terms": ["Spell as intention + image", "Ritual as inner journey", "Automatic techniques", "Archetypal magic", "Synchronicity", "The Marvelous"],
        "why_here": "'Magic' becomes psyche-navigation: image = mechanism, ritual = internal transformation theater. Unconscious as occult realm.",
        "core_figures": ["Leonora Carrington", "Remedios Varo", "Ithell Colquhoun", "Max Ernst", "André Breton", "Salvador Dalí", "Dorothea Tanning"],
        "expanded_examples": "Paris Surrealist Group • British Surrealist occultists • Mexican surrealist émigré circles • Chicago Imagists' occult works • Contemporary occult surrealism",
        "color": "#4a6fa5",
        "icon": "wand"
    },
    "folk_magic": {
        "id": 8,
        "name": "Folk Magic, Witchcraft & Cunning Traditions",
        "time_period": "continuous; modern crystallization 1900s–now",
        "visual_tells": ["herbs/charms/bones", "poppets", "household altars", "lunar cycles", "handmade grimoires", "craft textures", "natural materials", "worn objects", "seasonal markers"],
        "lane_tags": ["Witchcraft", "folk magic", "earth ritual"],
        "glossary_terms": ["Witchcraft (practice-based)", "Spell (folk usage)", "Charm", "Poppet", "Herbalism", "Protective magic", "Household rituals", "Land wisdom"],
        "why_here": "Practical, domestic, earth-based operations + objects; 'craft' as visual language and practice. Material culture of the everyday sacred.",
        "core_figures": ["Kiki Smith", "Ana Mendieta", "Cecilia Vicuña", "Gerald Gardner", "traditional cunning folk", "wise women"],
        "expanded_examples": "Ancient protective amulets • Medieval charm books • Early modern cunning folk records • Folk magic collections • Modern witchcraft revival • Contemporary folk practice",
        "color": "#6b8e23",
        "icon": "leaf"
    },
    "performance": {
        "id": 9,
        "name": "Occult Performance & Ritual as Art",
        "time_period": "1960s–present (peak 1970s), roots in Dada & Futurist rituals",
        "visual_tells": ["body-as-altar", "durational acts", "presence/focus", "initiation logic", "documentation as relic", "ritual costumes", "sacred spaces", "audience participation"],
        "lane_tags": ["Earth ritual", "ceremonial embodiment"],
        "glossary_terms": ["Ritual (as performance)", "Body as tool", "Presence/focus", "Initiatory acts", "Sacrifice (symbolic)", "Liminal space", "Witnessing"],
        "why_here": "Ritual becomes embodied and witnessed; performance inherits rite-structure without requiring belief claims. Art as transformative act.",
        "core_figures": ["Marina Abramović", "Alejandro Jodorowsky", "Carolee Schneemann", "Joseph Beuys", "Ana Mendieta", "Hermann Nitsch"],
        "expanded_examples": "Vienna Actionism • Fluxus ritual events • Feminist body ritual • Shamanic performance • Contemporary ritual art",
        "color": "#8b2232",
        "icon": "flame"
    },
    "cinema": {
        "id": 10,
        "name": "Occult Cinema & Moving-Image Aesthetics",
        "time_period": "1940s–present (peaks 60s–70s), roots in early film",
        "visual_tells": ["coded symbols", "glam ritual", "montage as invocation", "talismanic props", "spectacle", "special effects", "lighting as magic", "editing as spell"],
        "lane_tags": ["Hermetic", "Occult surreal"],
        "glossary_terms": ["Spell as scene/sequence", "Invocation as cinematic moment", "Ritual as spectacle", "Occult symbolism", "Cinematic trance", "Visual incantation"],
        "why_here": "Film translates rites into narrative beats + iconography; ritual becomes staged, repeatable visual grammar. Screen as magical surface.",
        "core_figures": ["Kenneth Anger", "Maya Deren", "Alejandro Jodorowsky", "Dario Argento", "Stanley Kubrick", "David Lynch"],
        "expanded_examples": "Silent film occult • Expressionist horror • Hollywood glamour magic • European art house occult • Cult cinema • Digital occult media",
        "color": "#2d3436",
        "icon": "film"
    },
    "visionary": {
        "id": 11,
        "name": "Visionary/Psychedelic/Esoteric Fantastic Art",
        "time_period": "1960s–present (peaks 1960s, 1990s), roots in William Blake & Hilma af Klint",
        "visual_tells": ["chakras/auras", "sacred geometry", "cosmic anatomy", "astral architecture", "ecstatic detail", "apocalyptic dream-worlds", "fractal patterns", "light bodies"],
        "lane_tags": ["Psychedelic", "visionary cosmos"],
        "glossary_terms": ["Energy work", "Aura/subtle body", "Elemental forces (cosmic)", "Magic as consciousness expansion", "Entheogenic vision", "Cosmic consciousness"],
        "why_here": "Expanded-consciousness cosmologies; visualizes energetic frameworks and 'beyond-human' perception. Art as direct spiritual experience.",
        "core_figures": ["Alex Grey", "Ernst Fuchs", "Zdzisław Beksiński", "H.R. Giger", "Mati Klarwein", "Robert Venosa"],
        "expanded_examples": "Beat generation mysticism • Psychedelic art movement • Fantastic realism school • New Age visionary • Digital visionary art • Chapel of Sacred Mirrors",
        "color": "#e056fd",
        "icon": "sun"
    },
    "chaos_magic": {
        "id": 12,
        "name": "Chaos Magic, Sigil Culture & Modern Occult Design",
        "time_period": "1970s–present (emerges 1970s, popularizes 1990s), roots in Austin Osman Spare & Discordianism",
        "visual_tells": ["sigils/glyph systems", "xerox/zine texture", "minimalist seals", "sticker/icon logic", "DIY grimoires", "pixel sigils", "glitch aesthetics", "digital talismans"],
        "lane_tags": ["Modern sigil", "chaos", "zine occult"],
        "glossary_terms": ["Sigil", "Spell as symbol", "Intent as primary mechanism", "Minimalist ritual", "DIY grimoire/zine culture", "Belief as tool", "Paradigm shifting"],
        "why_here": "Semiotics-first: personal symbol engineering; abstraction and design language become the 'working.' Pop culture as source material.",
        "core_figures": ["Austin Osman Spare", "Genesis P-Orridge", "Peter Carroll", "Phil Hine", "Grant Morrison"],
        "expanded_examples": "Discordian Society • Illuminates of Thanateros • Zine culture occult • Internet occult forums • Social media sigil sharing • Corporate occult aesthetics",
        "color": "#636e72",
        "icon": "zap"
    },
    "pop_culture": {
        "id": 13,
        "name": "Witch Archetype in Pop Culture",
        "time_period": "1990s–present, roots in 1960s sitcom witches & 1970s feminist spirituality",
        "visual_tells": ["covens/familiars/moons", "tarot-as-merch", "fashion-coded witchcraft", "game/UI glyph packs", "aestheticized tools", "simplified symbols", "brand magic"],
        "lane_tags": ["Pop witch", "folk shorthand", "sigil aesthetics"],
        "glossary_terms": ["Coven", "Esbat", "Spell (popular usage)", "Magic circle (shorthand)", "Hex/curse (trope)", "Witch aesthetic", "Spiritual consumerism"],
        "why_here": "Simplified, culturally legible forms optimized for storytelling/branding/fandom; shorthand symbols dominate. Magic as identity marker.",
        "core_figures": ["Tarot deck creators", "indie game designers", "Instagram witches", "TikTok practitioners", "fashion designers"],
        "expanded_examples": "TV witches (Bewitched) • Teen witch movies • Buffy the Vampire Slayer • Witchy fashion trends • Social media witchcraft • Corporate wellness magic • Video game witch archetypes",
        "color": "#a29bfe",
        "icon": "star"
    },
    "political_activism": {
        "id": 14,
        "name": "Protest, Political Action & Social Change",
        "time_period": "1848–present, with roots in witch-hunt resistance symbolism",
        "visual_tells": ["protest banners", "hexing imagery", "binding rituals", "feminist symbols", "environmental sacred space", "street theater magic", "collective ritual"],
        "lane_tags": ["Activism", "feminism", "social justice", "resistance"],
        "glossary_terms": ["Binding spell", "Hex", "Magical resistance", "Sacred activism", "Ritual protest", "Decolonization", "Reclamation"],
        "why_here": "Where occult practice meets social/political change—witches as activists, magic as resistance, spirituality as liberation theology.",
        "core_figures": ["Victoria Woodhull", "Annie Besant", "Starhawk", "Z. Budapest", "W.I.T.C.H. collective", "Radical Faeries"],
        "expanded_examples": "Spiritualist abolitionists • Theosophical anti-colonialism • W.I.T.C.H. feminist protests • Reclaiming Tradition activism • Magic Resistance binding spells • Occupy rituals • Climate activism • LGBTQ+ pagan communities • TikTok witchcraft activism",
        "color": "#e84393",
        "icon": "flame"
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
    PROTEST = "Protest"  # New category for political action events

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
    palette: List[str] = ["#0E2A2F", "#8b2232", "#C8A44D", "#f5f0e6"]
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
