# Canon Taxonomy - 13-Category Master Chart
# Single source of truth from spreadsheet data

CANON_TAXONOMY = {
    "categories": [
        {
            "id": "cat_01",
            "title": "Pre-Modern Esoteric Visual Systems",
            "time_period": {"start": -500, "end": 1600, "label": "Late Antiquity → Renaissance"},
            "visual_tells": ["sacred geometry", "cosmology maps", "angelic hierarchies", "planetary seals", "talismanic grids", "diagram-as-knowledge"],
            "lane_tags": ["Hermetic", "ceremonial", "temple"],
            "glossary_terms": ["Occult (umbrella)", "Theurgy", "Correspondences", "Intent & Will", "Elemental Theory"],
            "core_anchors": ["Robert Fludd", "Hermetic traditions", "Kabbalistic diagrams", "Gnostic systems"],
            "guide_affinity": ["katherine", "theresa"]
        },
        {
            "id": "cat_02",
            "title": "Alchemy as Visual & Symbolic Movement",
            "time_period": {"start": 1500, "end": 1700, "label": "1500s–1700s"},
            "visual_tells": ["emblem books", "labs", "vessels", "sun/moon marriage", "animals as stages", "transformation sequences"],
            "lane_tags": ["Hermetic", "ceremonial", "temple"],
            "glossary_terms": ["Transformation (inner)", "Symbolic language", "Magical change", "Ritual sequence"],
            "core_anchors": ["Michael Maier", "Robert Fludd", "alchemical emblems"],
            "guide_affinity": ["katherine"]
        },
        {
            "id": "cat_03",
            "title": "Romantic & Gothic Occult",
            "time_period": {"start": 1750, "end": 1850, "label": "late 1700s–mid 1800s"},
            "visual_tells": ["moonlit rites", "sabbaths", "ruins", "demons/specters", "dramatic chiaroscuro"],
            "lane_tags": ["Witchcraft", "folk magic", "earth ritual"],
            "glossary_terms": ["Witchcraft (fear/fascination)", "Curse/Hex", "Folk magic", "Supernatural influence"],
            "core_anchors": ["Francisco Goya", "Henry Fuseli", "William Blake"],
            "guide_affinity": ["cathleen", "katherine"]
        },
        {
            "id": "cat_04",
            "title": "Spiritualism, Mediumship & Trance Art",
            "time_period": {"start": 1850, "end": 1920, "label": "1850s–early 1900s"},
            "visual_tells": ["automatic marks", "spirit diagrams", "séance photo vibe", "channeled patterns"],
            "lane_tags": ["Spiritualism", "channeling", "liminal contact"],
            "glossary_terms": ["Spiritualism", "Mediumship", "Trance states", "Automatic writing", "Channeling"],
            "core_anchors": ["Georgiana Houghton", "Hilma af Klint", "Emma Kunz", "Madge Gill"],
            "guide_affinity": ["cathleen", "theresa"]
        },
        {
            "id": "cat_05",
            "title": "Symbolism (Mystic Allegory)",
            "time_period": {"start": 1880, "end": 1910, "label": "1880s–1910s"},
            "visual_tells": ["veils/thresholds", "halos", "priestess/femme mystique", "erotic mysticism", "dream theology"],
            "lane_tags": ["Hermetic", "Spiritualism", "bridge"],
            "glossary_terms": ["Spell (symbolic narrative)", "Ritual (meaning-making)", "Invocation", "Magic as metaphor"],
            "core_anchors": ["Odilon Redon", "Gustave Moreau", "Fernand Khnopff"],
            "guide_affinity": ["cathleen", "katherine"]
        },
        {
            "id": "cat_06",
            "title": "Occult Revival & Ritual Orders",
            "time_period": {"start": 1888, "end": 1930, "label": "late 1800s–early 1900s"},
            "visual_tells": ["temple diagrams", "ritual tools/robes", "pentagram/hexagram", "color scales", "structured rites"],
            "lane_tags": ["Hermetic", "ceremonial", "temple"],
            "glossary_terms": ["Ceremonial magic", "Magick (k)", "Grimoire", "Magic circle", "Invocation/Evocation"],
            "core_anchors": ["Golden Dawn", "A.E. Waite", "Pamela Colman Smith", "Aleister Crowley", "Dion Fortune"],
            "guide_affinity": ["katherine", "theresa"]
        },
        {
            "id": "cat_07",
            "title": "Surrealism & Occult Surrealism",
            "time_period": {"start": 1920, "end": 1960, "label": "1920s–1950s"},
            "visual_tells": ["initiations", "hybrids", "alchemical machinery", "inner-temple dreamscapes", "automatism"],
            "lane_tags": ["Occult surreal", "witch-alchemy narrative"],
            "glossary_terms": ["Spell as intention + image", "Ritual as inner journey", "Automatic techniques", "Archetypal magic"],
            "core_anchors": ["Leonora Carrington", "Remedios Varo", "Ithell Colquhoun", "Max Ernst"],
            "guide_affinity": ["katherine", "shigg"]
        },
        {
            "id": "cat_08",
            "title": "Folk Magic, Witchcraft & Cunning Traditions",
            "time_period": {"start": 1900, "end": 2025, "label": "continuous; modern crystallization 1900s–now"},
            "visual_tells": ["herbs/charms/bones", "poppets", "household altars", "lunar cycles", "handmade grimoires"],
            "lane_tags": ["Witchcraft", "folk magic", "earth ritual"],
            "glossary_terms": ["Witchcraft (practice)", "Spell (folk)", "Charm", "Poppet", "Herbalism", "Protective magic"],
            "core_anchors": ["Kiki Smith", "Ana Mendieta", "Cecilia Vicuña", "Owen Davies"],
            "guide_affinity": ["shigg", "cathleen"]
        },
        {
            "id": "cat_09",
            "title": "Occult Performance & Ritual as Art",
            "time_period": {"start": 1960, "end": 2025, "label": "1960s–present"},
            "visual_tells": ["body-as-altar", "durational acts", "presence/focus", "initiation logic"],
            "lane_tags": ["Earth ritual", "ceremonial embodiment"],
            "glossary_terms": ["Ritual (as performance)", "Body as tool", "Presence/focus", "Initiatory acts"],
            "core_anchors": ["Marina Abramović", "Alejandro Jodorowsky", "Carolee Schneemann"],
            "guide_affinity": ["cathleen", "theresa"]
        },
        {
            "id": "cat_10",
            "title": "Occult Cinema & Moving-Image",
            "time_period": {"start": 1940, "end": 2025, "label": "1940s–present (peaks 60s–70s)"},
            "visual_tells": ["coded symbols", "glam ritual", "montage as invocation", "talismanic props"],
            "lane_tags": ["Hermetic", "Occult surreal"],
            "glossary_terms": ["Spell as scene", "Invocation as cinematic moment", "Ritual as spectacle"],
            "core_anchors": ["Kenneth Anger", "Maya Deren", "Jodorowsky"],
            "guide_affinity": ["theresa", "katherine"]
        },
        {
            "id": "cat_11",
            "title": "Visionary / Psychedelic / Esoteric Fantastic",
            "time_period": {"start": 1960, "end": 2025, "label": "1960s–present"},
            "visual_tells": ["chakras/auras", "sacred geometry", "cosmic anatomy", "astral architecture"],
            "lane_tags": ["Psychedelic", "visionary cosmos"],
            "glossary_terms": ["Energy work", "Aura/subtle body", "Elemental forces", "Magic as consciousness expansion"],
            "core_anchors": ["Alex Grey", "Ernst Fuchs", "Zdzisław Beksiński", "H.R. Giger"],
            "guide_affinity": ["theresa"]
        },
        {
            "id": "cat_12",
            "title": "Chaos Magic, Sigil Culture & Modern Occult Design",
            "time_period": {"start": 1970, "end": 2025, "label": "1970s–present"},
            "visual_tells": ["sigils/glyph systems", "xerox/zine texture", "minimalist seals", "DIY grimoires"],
            "lane_tags": ["Modern sigil", "chaos", "zine occult"],
            "glossary_terms": ["Sigil", "Spell as symbol", "Intent as mechanism", "Minimalist ritual"],
            "core_anchors": ["Austin Osman Spare", "Genesis P-Orridge", "Psychic TV"],
            "guide_affinity": ["theresa", "katherine"]
        },
        {
            "id": "cat_13",
            "title": "Witch Archetype in Pop Culture",
            "time_period": {"start": 1990, "end": 2025, "label": "1990s–present"},
            "visual_tells": ["covens/familiars/moons", "tarot-as-merch", "fashion-coded witchcraft", "game/UI glyphs"],
            "lane_tags": ["Pop witch", "folk shorthand", "sigil aesthetics"],
            "glossary_terms": ["Coven", "Esbat", "Spell (popular)", "Magic circle (iconic)", "Hex/curse (trope)"],
            "core_anchors": ["Tarot deck creators", "indie games", "WitchTok"],
            "guide_affinity": ["shigg", "theresa"]
        }
    ],
    
    "tradition_tags": {
        "british_folk_magic": "Cunning folk, charms, rural practices of England, Scotland, Wales",
        "kitchen_witchery": "Domestic magic centered on hearth, cooking, household protection",
        "cunning_folk": "Professional magical practitioners of rural Britain",
        "celtic_devotional": "Irish/Scottish traditions with devotional and protective focus",
        "victorian_spiritualism": "Table-tipping, séance, psychic development practices",
        "golden_dawn": "Hermetic Order ritual magic and ceremonial traditions",
        "appalachian_folk_magic": "Mountain traditions, granny magic, root work",
        "hedgewitchery": "Liminal practice, spirit flight, hedge-riding",
        "folk_catholicism": "Saints, candles, holy water in folk practice",
        "grimoire_tradition": "Ceremonial magic from historical grimoires",
        "wisewoman_healing": "Herbal knowledge, midwifery, village healing",
        "coastal_folk_magic": "Fishing communities, sea traditions, weather magic",
        "postwar_makeshift_magic": "Rationing-era adaptations, bomb shelter rites",
        "spiritualist_home_circle": "Home-based spiritualist gatherings, table-tipping",
        "hermetic_qabalah": "Tree of Life, sephirotic correspondences",
        "bird_oracle_tradition": "Augury, bird omens, feather magic"
    },
    
    "guide_tradition_map": {
        "shigg": ["british_folk_magic", "kitchen_witchery", "postwar_makeshift_magic", "bird_oracle_tradition"],
        "cathleen": ["celtic_devotional", "victorian_spiritualism", "spiritualist_home_circle", "wisewoman_healing"],
        "katherine": ["golden_dawn", "grimoire_tradition", "hermetic_qabalah", "victorian_spiritualism"],
        "theresa": ["british_folk_magic", "celtic_devotional", "golden_dawn", "bird_oracle_tradition"]
    }
}


def get_canon_context(query: str, guide_id: str = None) -> dict:
    """
    Get relevant canon context for a query.
    Returns categories, traditions, and anchors relevant to the query.
    """
    relevant_categories = []
    relevant_traditions = []
    
    query_lower = query.lower()
    
    # Search categories by keywords
    for cat in CANON_TAXONOMY["categories"]:
        # Check if query matches any visual tells or glossary terms
        matches = False
        for tell in cat.get("visual_tells", []):
            if tell.lower() in query_lower:
                matches = True
                break
        for term in cat.get("glossary_terms", []):
            if term.lower() in query_lower:
                matches = True
                break
        
        # Check guide affinity
        if guide_id and guide_id in cat.get("guide_affinity", []):
            matches = True
        
        if matches:
            relevant_categories.append(cat)
    
    # Get traditions for guide
    if guide_id:
        guide_traditions = CANON_TAXONOMY["guide_tradition_map"].get(guide_id, [])
        for trad_id in guide_traditions:
            if trad_id in CANON_TAXONOMY["tradition_tags"]:
                relevant_traditions.append({
                    "id": trad_id,
                    "description": CANON_TAXONOMY["tradition_tags"][trad_id]
                })
    
    return {
        "categories": relevant_categories[:3],  # Top 3 most relevant
        "traditions": relevant_traditions,
        "lane_tags": _extract_lane_tags(relevant_categories)
    }


def get_tradition_tags(guide_id: str) -> list:
    """Get tradition tags associated with a guide"""
    tradition_ids = CANON_TAXONOMY["guide_tradition_map"].get(guide_id, [])
    return [
        {"id": tid, "description": CANON_TAXONOMY["tradition_tags"].get(tid, "")}
        for tid in tradition_ids
    ]


def _extract_lane_tags(categories: list) -> list:
    """Extract unique lane tags from categories"""
    tags = set()
    for cat in categories:
        for tag in cat.get("lane_tags", []):
            tags.add(tag)
    return list(tags)


def get_category_by_era(year: int) -> list:
    """Get categories relevant to a specific year"""
    relevant = []
    for cat in CANON_TAXONOMY["categories"]:
        period = cat.get("time_period", {})
        if period.get("start", -9999) <= year <= period.get("end", 9999):
            relevant.append(cat)
    return relevant


def validate_tradition_tag(tag: str) -> bool:
    """Check if a tradition tag exists in canon"""
    return tag in CANON_TAXONOMY["tradition_tags"]
