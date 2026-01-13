# Timeline Service - API Endpoints for Interactive Occult Revival Timeline
# Handles filtering, connections, taxonomy, and guide integration

import logging
from typing import List, Dict, Any, Optional
from motor.motor_asyncio import AsyncIOMotorDatabase
from timeline_models import (
    TimelineEventEnhanced, TimelineFilterRequest, TimelineStatsResponse,
    ConnectionGraphResponse, TAXONOMY_DATA, TimelineSource, EventConnections,
    GuideRelevance
)
import re

logger = logging.getLogger(__name__)

# ============================================================================
# SAMPLE TIMELINE DATA (Initial seed - will be expanded by DeepSeek)
# ============================================================================

INITIAL_TIMELINE_EVENTS = [
    {
        "id": "gd_founding",
        "year": 1888,
        "month": 3,
        "title": "Hermetic Order of the Golden Dawn Founded",
        "primary_category": "Organization",
        "secondary_category": "Lodge Founding",
        "taxonomy_categories": [6],  # Occult Revival
        "visual_tells": ["temple diagrams", "ritual tools/robes", "structured rites"],
        "lane_tags": ["Hermetic", "ceremonial", "temple"],
        "glossary_terms": ["Ceremonial/High magic", "Magic circle", "Invocation/Evocation"],
        "description": "William Wynn Westcott, Samuel Liddell MacGregor Mathers, and William Robert Woodman establish the Hermetic Order of the Golden Dawn in London, synthesizing Kabbalah, alchemy, tarot, and ceremonial magic into a structured initiatory system.",
        "significance": "Created the foundational framework for modern Western ceremonial magic that influenced virtually every subsequent occult order.",
        "figures_involved": ["MacGregor Mathers", "William Wynn Westcott", "William Robert Woodman"],
        "traditions": ["golden_dawn", "victorian_spiritualism"],
        "connections": {
            "influenced_by": [],
            "influenced": ["stella_matutina", "a_a_founding", "inner_light"],
            "related_events": [],
            "part_of_movement": ["golden_dawn"]
        },
        "guide_relevance": {"shigg": "low", "cathleen": "medium", "katherine": "high", "theresa": "medium"},
        "sources": [
            {
                "title": "The Golden Dawn: The Original Account of the Teachings, Rites, and Ceremonies",
                "author": "Israel Regardie",
                "year": 1937,
                "type": "book",
                "quality_tier": "practitioner_primary"
            }
        ],
        "location": {"name": "London", "region": "England"},
        "confidence": "high",
        "importance": 1,
        "is_pivotal_moment": True
    },
    {
        "id": "waite_smith_tarot",
        "year": 1909,
        "month": 12,
        "title": "Rider-Waite-Smith Tarot Published",
        "primary_category": "Publication",
        "secondary_category": "Divination Deck",
        "taxonomy_categories": [6, 5],  # Occult Revival, Symbolism
        "visual_tells": ["veils/thresholds", "pentagram/hexagram systems", "correspondence scales"],
        "lane_tags": ["Hermetic", "Bridge: Hermetic + Spiritualism"],
        "glossary_terms": ["Spell (symbolic narrative)", "Ritual (meaning-making)", "Tools & implements"],
        "description": "Arthur Edward Waite commissions Pamela Colman Smith to illustrate the first fully pictorial tarot deck. Published by Rider & Company, it becomes the most influential tarot in the Western world.",
        "significance": "Democratized tarot by making every card visually narrative, enabling intuitive reading without extensive esoteric training.",
        "figures_involved": ["Arthur Edward Waite", "Pamela Colman Smith"],
        "traditions": ["golden_dawn", "victorian_spiritualism"],
        "connections": {
            "influenced_by": ["gd_founding"],
            "influenced": [],
            "related_events": [],
            "part_of_movement": ["golden_dawn"]
        },
        "guide_relevance": {"shigg": "medium", "cathleen": "medium", "katherine": "high", "theresa": "high"},
        "sources": [
            {
                "title": "The Pictorial Key to the Tarot",
                "author": "Arthur Edward Waite",
                "year": 1910,
                "type": "book",
                "quality_tier": "practitioner_primary"
            }
        ],
        "location": {"name": "London", "region": "England"},
        "confidence": "high",
        "importance": 1,
        "is_pivotal_moment": True
    },
    {
        "id": "crowley_book_of_law",
        "year": 1904,
        "month": 4,
        "title": "Aleister Crowley Receives The Book of the Law",
        "primary_category": "Ritual",
        "secondary_category": "Channeled Text",
        "taxonomy_categories": [6, 4],  # Occult Revival, Spiritualism
        "visual_tells": ["automatic marks", "structured rites", "channeled pattern worlds"],
        "lane_tags": ["Hermetic", "ceremonial", "Spiritualism"],
        "glossary_terms": ["Channeling", "Magick (k)", "Automatic writing/drawing"],
        "description": "During a honeymoon in Cairo, Aleister Crowley claims to receive The Book of the Law from a discarnate intelligence named Aiwass over three days (April 8-10). This becomes the foundational text of Thelema.",
        "significance": "Established Thelema as a new religious-magical philosophy with 'Do what thou wilt' as its core tenet, profoundly influencing 20th century occultism.",
        "figures_involved": ["Aleister Crowley", "Rose Edith Kelly"],
        "traditions": ["golden_dawn", "victorian_spiritualism"],
        "connections": {
            "influenced_by": ["gd_founding"],
            "influenced": ["abbey_thelema", "a_a_founding"],
            "related_events": [],
            "part_of_movement": ["thelema", "golden_dawn"]
        },
        "guide_relevance": {"shigg": "low", "cathleen": "low", "katherine": "high", "theresa": "medium"},
        "sources": [
            {
                "title": "The Confessions of Aleister Crowley",
                "author": "Aleister Crowley",
                "year": 1969,
                "type": "book",
                "quality_tier": "practitioner_primary"
            }
        ],
        "location": {"name": "Cairo", "region": "Egypt"},
        "confidence": "medium",
        "importance": 1,
        "is_pivotal_moment": True
    },
    {
        "id": "dion_fortune_psychic_defense",
        "year": 1930,
        "title": "Dion Fortune Publishes Psychic Self-Defense",
        "primary_category": "Publication",
        "secondary_category": "Manual",
        "taxonomy_categories": [6, 4],
        "visual_tells": ["structured rites", "spirit diagrams"],
        "lane_tags": ["Hermetic", "Spiritualism", "channeling"],
        "glossary_terms": ["Protective magic", "Spiritualism", "Trance states"],
        "description": "Dion Fortune publishes her influential guide to psychic protection, drawing on her experiences with the Golden Dawn and her own Society of the Inner Light. The book remains in print nearly a century later.",
        "significance": "Made psychic self-defense accessible to general readers and established Fortune as a leading voice in practical British occultism.",
        "figures_involved": ["Dion Fortune"],
        "traditions": ["golden_dawn", "victorian_spiritualism", "british_folk_magic"],
        "connections": {
            "influenced_by": ["gd_founding", "inner_light"],
            "influenced": [],
            "related_events": [],
            "part_of_movement": ["golden_dawn"]
        },
        "guide_relevance": {"shigg": "high", "cathleen": "high", "katherine": "high", "theresa": "medium"},
        "sources": [
            {
                "title": "Psychic Self-Defense",
                "author": "Dion Fortune",
                "year": 1930,
                "type": "book",
                "quality_tier": "practitioner_primary"
            }
        ],
        "location": {"name": "London", "region": "England"},
        "confidence": "high",
        "importance": 1,
        "is_pivotal_moment": True
    },
    {
        "id": "abbey_thelema",
        "year": 1920,
        "title": "Crowley Founds Abbey of Thelema",
        "primary_category": "Site",
        "secondary_category": "Temple Founding",
        "taxonomy_categories": [6, 7],
        "visual_tells": ["temple diagrams", "initiations", "ritual tools/robes"],
        "lane_tags": ["Hermetic", "ceremonial", "Occult surreal"],
        "glossary_terms": ["Magick (k)", "Ritual structure", "Initiatory acts"],
        "description": "Aleister Crowley establishes the Abbey of Thelema in Cefalù, Sicily, as a magical commune and temple. The Abbey becomes notorious for drug use, sexual rituals, and the death of Raoul Loveday.",
        "significance": "Represented the most ambitious attempt to create a Thelemic community; its scandals contributed to Crowley's 'wickedest man' reputation.",
        "figures_involved": ["Aleister Crowley", "Leah Hirsig", "Raoul Loveday"],
        "traditions": ["golden_dawn"],
        "connections": {
            "influenced_by": ["crowley_book_of_law"],
            "influenced": [],
            "related_events": [],
            "part_of_movement": ["thelema"]
        },
        "guide_relevance": {"shigg": "low", "cathleen": "low", "katherine": "medium", "theresa": "low"},
        "sources": [
            {
                "title": "Do What Thou Wilt: A Life of Aleister Crowley",
                "author": "Lawrence Sutin",
                "year": 2000,
                "type": "book",
                "quality_tier": "academic_secondary"
            }
        ],
        "location": {"name": "Cefalù", "region": "Sicily, Italy"},
        "confidence": "high",
        "importance": 2,
        "is_pivotal_moment": False
    },
    {
        "id": "witchcraft_act_repeal",
        "year": 1951,
        "title": "Witchcraft Act of 1735 Repealed",
        "primary_category": "Legal",
        "secondary_category": "Law Change",
        "taxonomy_categories": [8, 6],
        "visual_tells": ["herbs/charms/bones", "handmade grimoires"],
        "lane_tags": ["Witchcraft", "folk magic"],
        "glossary_terms": ["Witchcraft (practice-based)", "Protective magic"],
        "description": "The British Parliament repeals the Witchcraft Act of 1735, which had made it illegal to claim magical powers. Replaced by the Fraudulent Mediums Act, this change enables the public emergence of Wicca.",
        "significance": "Legal prerequisite for Gerald Gardner's public Wicca revelations; marked the end of legal persecution of magical practitioners in Britain.",
        "figures_involved": ["Gerald Gardner"],
        "traditions": ["british_folk_magic", "cunning_folk"],
        "connections": {
            "influenced_by": [],
            "influenced": ["gardner_wicca_public"],
            "related_events": [],
            "part_of_movement": ["wicca"]
        },
        "guide_relevance": {"shigg": "medium", "cathleen": "high", "katherine": "medium", "theresa": "high"},
        "sources": [
            {
                "title": "Triumph of the Moon: A History of Modern Pagan Witchcraft",
                "author": "Ronald Hutton",
                "year": 1999,
                "type": "book",
                "quality_tier": "academic_primary"
            }
        ],
        "location": {"name": "London", "region": "England"},
        "confidence": "high",
        "importance": 1,
        "is_pivotal_moment": True
    },
    {
        "id": "inner_light",
        "year": 1924,
        "title": "Dion Fortune Founds Society of the Inner Light",
        "primary_category": "Organization",
        "secondary_category": "Lodge Founding",
        "taxonomy_categories": [6, 4],
        "visual_tells": ["temple diagrams", "spirit diagrams", "structured rites"],
        "lane_tags": ["Hermetic", "ceremonial", "Spiritualism"],
        "glossary_terms": ["Ceremonial/High magic", "Mediumship", "Invocation/Evocation"],
        "description": "After leaving the Alpha et Omega (a Golden Dawn successor), Dion Fortune establishes her own order initially as the Community of the Inner Light, later renamed the Society of the Inner Light.",
        "significance": "Created an influential training ground that emphasized meditation, psychic development, and accessible occultism over complex ceremonial.",
        "figures_involved": ["Dion Fortune"],
        "traditions": ["golden_dawn", "victorian_spiritualism"],
        "connections": {
            "influenced_by": ["gd_founding"],
            "influenced": ["dion_fortune_psychic_defense"],
            "related_events": [],
            "part_of_movement": ["golden_dawn"]
        },
        "guide_relevance": {"shigg": "medium", "cathleen": "high", "katherine": "high", "theresa": "medium"},
        "sources": [
            {
                "title": "Dion Fortune and the Inner Light",
                "author": "Gareth Knight",
                "year": 2000,
                "type": "book",
                "quality_tier": "modern_scholar_practitioner"
            }
        ],
        "location": {"name": "London", "region": "England"},
        "confidence": "high",
        "importance": 2,
        "is_pivotal_moment": False
    },
    {
        "id": "regardie_golden_dawn",
        "year": 1937,
        "title": "Israel Regardie Publishes Golden Dawn Materials",
        "primary_category": "Publication",
        "secondary_category": "Ritual Compilation",
        "taxonomy_categories": [6],
        "visual_tells": ["temple diagrams", "pentagram/hexagram systems", "correspondence scales"],
        "lane_tags": ["Hermetic", "ceremonial", "temple"],
        "glossary_terms": ["Grimoire", "Ceremonial/High magic", "Tools & implements", "Ritual structure"],
        "description": "Israel Regardie, former secretary to Aleister Crowley, publishes The Golden Dawn, a comprehensive four-volume set exposing the order's secret rituals, teachings, and correspondence systems.",
        "significance": "Preserved Golden Dawn teachings for posterity and made ceremonial magic accessible to a wider audience, fundamentally shaping modern occultism.",
        "figures_involved": ["Israel Regardie"],
        "traditions": ["golden_dawn"],
        "connections": {
            "influenced_by": ["gd_founding"],
            "influenced": [],
            "related_events": [],
            "part_of_movement": ["golden_dawn"]
        },
        "guide_relevance": {"shigg": "low", "cathleen": "medium", "katherine": "high", "theresa": "medium"},
        "sources": [
            {
                "title": "The Golden Dawn",
                "author": "Israel Regardie",
                "year": 1937,
                "type": "book",
                "quality_tier": "practitioner_primary"
            }
        ],
        "location": {"name": "London", "region": "England"},
        "confidence": "high",
        "importance": 1,
        "is_pivotal_moment": True
    },
    {
        "id": "murray_witch_cult",
        "year": 1921,
        "title": "Margaret Murray Publishes The Witch-Cult in Western Europe",
        "primary_category": "Publication",
        "secondary_category": "Academic Study",
        "taxonomy_categories": [8, 3],
        "visual_tells": ["moonlit rites", "sabbaths", "herbs/charms/bones"],
        "lane_tags": ["Witchcraft", "folk magic"],
        "glossary_terms": ["Witchcraft (fear/fascination)", "Coven", "Esbat"],
        "description": "Egyptologist Margaret Murray publishes her thesis that medieval witchcraft was a survival of pre-Christian fertility religion. Though later discredited academically, her work profoundly influenced modern Wicca.",
        "significance": "Provided the mythological framework that Gardner and others used to construct modern witchcraft as an 'ancient religion'.",
        "figures_involved": ["Margaret Murray"],
        "traditions": ["british_folk_magic", "cunning_folk"],
        "connections": {
            "influenced_by": [],
            "influenced": ["gardner_wicca_public"],
            "related_events": [],
            "part_of_movement": ["wicca"]
        },
        "guide_relevance": {"shigg": "medium", "cathleen": "medium", "katherine": "high", "theresa": "high"},
        "sources": [
            {
                "title": "The Witch-Cult in Western Europe",
                "author": "Margaret Murray",
                "year": 1921,
                "type": "book",
                "quality_tier": "academic_secondary"
            }
        ],
        "location": {"name": "Oxford", "region": "England"},
        "confidence": "high",
        "importance": 2,
        "is_pivotal_moment": False
    },
    {
        "id": "spare_book_of_pleasure",
        "year": 1913,
        "title": "Austin Osman Spare Publishes The Book of Pleasure",
        "primary_category": "Publication",
        "secondary_category": "Magical Treatise",
        "taxonomy_categories": [12, 6],
        "visual_tells": ["sigils/glyph systems", "automatic marks", "DIY grimoires"],
        "lane_tags": ["Modern sigil", "chaos", "Hermetic"],
        "glossary_terms": ["Sigil", "Spell as symbol", "Intent as primary mechanism", "Automatic writing/drawing"],
        "description": "Artist and occultist Austin Osman Spare publishes The Book of Pleasure (Self-Love): The Psychology of Ecstasy, introducing his system of sigil magic and the concept of the 'Neither-Neither' principle.",
        "significance": "Laid the groundwork for chaos magic decades before the term existed; influenced Genesis P-Orridge and the chaos magic movement.",
        "figures_involved": ["Austin Osman Spare"],
        "traditions": ["golden_dawn"],
        "connections": {
            "influenced_by": [],
            "influenced": [],
            "related_events": [],
            "part_of_movement": ["chaos_magic"]
        },
        "guide_relevance": {"shigg": "low", "cathleen": "low", "katherine": "high", "theresa": "medium"},
        "sources": [
            {
                "title": "The Book of Pleasure (Self-Love): The Psychology of Ecstasy",
                "author": "Austin Osman Spare",
                "year": 1913,
                "type": "book",
                "quality_tier": "practitioner_primary"
            }
        ],
        "location": {"name": "London", "region": "England"},
        "confidence": "high",
        "importance": 2,
        "is_pivotal_moment": False
    },
    {
        "id": "yeats_vision",
        "year": 1925,
        "title": "W.B. Yeats Publishes A Vision",
        "primary_category": "Publication",
        "secondary_category": "Magical Philosophy",
        "taxonomy_categories": [5, 6, 4],
        "visual_tells": ["cosmology maps", "spirit diagrams", "veils/thresholds"],
        "lane_tags": ["Bridge: Hermetic + Spiritualism", "ceremonial"],
        "glossary_terms": ["Channeling", "Magic as metaphor", "Spell (symbolic narrative)"],
        "description": "Nobel laureate W.B. Yeats publishes A Vision, a complex symbolic system derived from automatic writing sessions with his wife George. The work synthesizes Golden Dawn symbolism with personal mythology.",
        "significance": "Demonstrated how occult practice could inform major literary work; bridged high culture and magical thought.",
        "figures_involved": ["W.B. Yeats", "George Yeats"],
        "traditions": ["golden_dawn", "celtic_devotional", "victorian_spiritualism"],
        "connections": {
            "influenced_by": ["gd_founding"],
            "influenced": [],
            "related_events": [],
            "part_of_movement": ["golden_dawn"]
        },
        "guide_relevance": {"shigg": "medium", "cathleen": "medium", "katherine": "high", "theresa": "high"},
        "sources": [
            {
                "title": "A Vision",
                "author": "W.B. Yeats",
                "year": 1925,
                "type": "book",
                "quality_tier": "practitioner_primary"
            }
        ],
        "location": {"name": "Dublin", "region": "Ireland"},
        "confidence": "high",
        "importance": 2,
        "is_pivotal_moment": False
    },
    {
        "id": "blitz_begins",
        "year": 1940,
        "month": 9,
        "title": "The London Blitz Begins",
        "primary_category": "Legal",
        "secondary_category": "Historical Event",
        "taxonomy_categories": [8],
        "visual_tells": ["household altars", "craft textures", "protective magic"],
        "lane_tags": ["Witchcraft", "folk magic", "earth ritual"],
        "glossary_terms": ["Protective magic", "Household rituals", "Charm"],
        "description": "Germany begins sustained bombing of London. The Blitz transforms daily life, with civilians turning to protective charms, prayer, and small rituals for psychological comfort amid constant danger.",
        "significance": "Created conditions where folk magic and protective practices flourished as psychological coping mechanisms; shaped Shigg's formative years.",
        "figures_involved": [],
        "traditions": ["british_folk_magic", "wartime_domestic_life", "postwar_makeshift_magic"],
        "connections": {
            "influenced_by": [],
            "influenced": [],
            "related_events": ["dion_fortune_magical_battle"],
            "part_of_movement": []
        },
        "guide_relevance": {"shigg": "high", "cathleen": "high", "katherine": "medium", "theresa": "high"},
        "sources": [
            {
                "title": "The Blitz: The British Under Attack",
                "author": "Juliet Gardiner",
                "year": 2010,
                "type": "book",
                "quality_tier": "academic_primary"
            }
        ],
        "location": {"name": "London", "region": "England"},
        "confidence": "high",
        "importance": 1,
        "is_pivotal_moment": True
    },
    {
        "id": "dion_fortune_magical_battle",
        "year": 1940,
        "title": "Dion Fortune's 'Magical Battle of Britain' Letters Begin",
        "primary_category": "Ritual",
        "secondary_category": "Group Working",
        "taxonomy_categories": [6, 8],
        "visual_tells": ["structured rites", "protective magic", "household altars"],
        "lane_tags": ["Hermetic", "ceremonial", "Witchcraft"],
        "glossary_terms": ["Protective magic", "Invocation/Evocation", "Ritual structure"],
        "description": "Dion Fortune begins circulating weekly letters to Society of the Inner Light members, directing them in coordinated meditations and visualizations to protect Britain from Nazi invasion through magical means.",
        "significance": "Most documented example of organized wartime magical practice; demonstrated how occultism could be positioned as patriotic service.",
        "figures_involved": ["Dion Fortune"],
        "traditions": ["golden_dawn", "victorian_spiritualism", "wartime_domestic_life"],
        "connections": {
            "influenced_by": ["inner_light", "dion_fortune_psychic_defense"],
            "influenced": [],
            "related_events": ["blitz_begins"],
            "part_of_movement": ["golden_dawn"]
        },
        "guide_relevance": {"shigg": "high", "cathleen": "high", "katherine": "high", "theresa": "high"},
        "sources": [
            {
                "title": "The Magical Battle of Britain",
                "author": "Dion Fortune",
                "year": 1993,
                "type": "book",
                "quality_tier": "practitioner_primary"
            }
        ],
        "location": {"name": "London", "region": "England"},
        "confidence": "high",
        "importance": 1,
        "is_pivotal_moment": True
    }
]

# ============================================================================
# SERVICE FUNCTIONS
# ============================================================================

async def seed_timeline_data(db: AsyncIOMotorDatabase):
    """Seed initial timeline events if collection is empty"""
    count = await db.timeline_events_v2.count_documents({})
    if count == 0:
        logger.info("Seeding enhanced timeline data...")
        await db.timeline_events_v2.insert_many(INITIAL_TIMELINE_EVENTS)
        logger.info(f"Seeded {len(INITIAL_TIMELINE_EVENTS)} timeline events")
    return count

async def get_timeline_events(
    db: AsyncIOMotorDatabase,
    filters: Optional[TimelineFilterRequest] = None,
    limit: int = 200,
    skip: int = 0
) -> List[Dict[str, Any]]:
    """Get timeline events with optional filtering"""
    query = {}
    
    if filters:
        # Taxonomy category filter
        if filters.categories:
            query["taxonomy_categories"] = {"$in": filters.categories}
        
        # Primary category filter
        if filters.primary_categories:
            query["primary_category"] = {"$in": filters.primary_categories}
        
        # Tradition filter
        if filters.traditions:
            query["traditions"] = {"$in": filters.traditions}
        
        # Guide relevance filter
        if filters.guides:
            guide_conditions = []
            for guide in filters.guides:
                guide_conditions.append({f"guide_relevance.{guide}": {"$in": ["high", "medium"]}})
            if guide_conditions:
                query["$or"] = guide_conditions
        
        # Date range filter
        if filters.date_range:
            if "start" in filters.date_range:
                query["year"] = query.get("year", {})
                query["year"]["$gte"] = filters.date_range["start"]
            if "end" in filters.date_range:
                query["year"] = query.get("year", {})
                query["year"]["$lte"] = filters.date_range["end"]
        
        # Importance filter
        if filters.importance:
            query["importance"] = {"$in": filters.importance}
        
        # Figures filter
        if filters.figures:
            query["figures_involved"] = {"$in": filters.figures}
        
        # Search filter
        if filters.search:
            search_regex = {"$regex": filters.search, "$options": "i"}
            query["$or"] = [
                {"title": search_regex},
                {"description": search_regex},
                {"figures_involved": search_regex}
            ]
    
    events = await db.timeline_events_v2.find(query, {"_id": 0}).sort("year", 1).skip(skip).limit(limit).to_list(limit)
    return events

async def get_timeline_stats(db: AsyncIOMotorDatabase) -> TimelineStatsResponse:
    """Get statistics about the timeline"""
    # Total count
    total = await db.timeline_events_v2.count_documents({})
    
    # Events by primary category
    category_pipeline = [
        {"$group": {"_id": "$primary_category", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}}
    ]
    category_results = await db.timeline_events_v2.aggregate(category_pipeline).to_list(20)
    events_by_category = {r["_id"]: r["count"] for r in category_results if r["_id"]}
    
    # Events by decade
    decade_pipeline = [
        {"$project": {"decade": {"$subtract": ["$year", {"$mod": ["$year", 10]}]}}},
        {"$group": {"_id": "$decade", "count": {"$sum": 1}}},
        {"$sort": {"_id": 1}}
    ]
    decade_results = await db.timeline_events_v2.aggregate(decade_pipeline).to_list(20)
    events_by_decade = {f"{r['_id']}s": r["count"] for r in decade_results if r["_id"]}
    
    # Events by taxonomy
    taxonomy_pipeline = [
        {"$unwind": "$taxonomy_categories"},
        {"$group": {"_id": "$taxonomy_categories", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}}
    ]
    taxonomy_results = await db.timeline_events_v2.aggregate(taxonomy_pipeline).to_list(20)
    events_by_taxonomy = {str(r["_id"]): r["count"] for r in taxonomy_results if r["_id"]}
    
    # Date range
    min_year = await db.timeline_events_v2.find_one({}, {"year": 1}, sort=[("year", 1)])
    max_year = await db.timeline_events_v2.find_one({}, {"year": 1}, sort=[("year", -1)])
    
    # Top figures
    figures_pipeline = [
        {"$unwind": "$figures_involved"},
        {"$group": {"_id": "$figures_involved", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
        {"$limit": 10}
    ]
    figures_results = await db.timeline_events_v2.aggregate(figures_pipeline).to_list(10)
    top_figures = [{"name": r["_id"], "count": r["count"]} for r in figures_results if r["_id"]]
    
    return TimelineStatsResponse(
        total_events=total,
        events_by_category=events_by_category,
        events_by_decade=events_by_decade,
        events_by_taxonomy=events_by_taxonomy,
        date_range={
            "start": min_year.get("year", 1888) if min_year else 1888,
            "end": max_year.get("year", 1951) if max_year else 1951
        },
        top_figures=top_figures
    )

async def get_connection_graph(
    db: AsyncIOMotorDatabase,
    filters: Optional[TimelineFilterRequest] = None
) -> ConnectionGraphResponse:
    """Get network graph data for visualization"""
    events = await get_timeline_events(db, filters, limit=500)
    
    nodes = []
    edges = []
    figure_nodes = set()
    
    for event in events:
        # Add event node
        nodes.append({
            "id": event["id"],
            "type": "event",
            "label": event["title"],
            "year": event["year"],
            "category": event.get("primary_category", "Unknown"),
            "taxonomy": event.get("taxonomy_categories", []),
            "importance": event.get("importance", 2),
            "is_pivotal": event.get("is_pivotal_moment", False)
        })
        
        # Add figure nodes
        for figure in event.get("figures_involved", []):
            if figure not in figure_nodes:
                figure_nodes.add(figure)
                nodes.append({
                    "id": f"figure_{figure.lower().replace(' ', '_')}",
                    "type": "figure",
                    "label": figure
                })
            
            # Add edge from figure to event
            edges.append({
                "source": f"figure_{figure.lower().replace(' ', '_')}",
                "target": event["id"],
                "type": "involvement"
            })
        
        # Add connection edges
        connections = event.get("connections", {})
        if connections:
            for influenced_id in connections.get("influenced", []):
                edges.append({
                    "source": event["id"],
                    "target": influenced_id,
                    "type": "direct_influence"
                })
            for related_id in connections.get("related_events", []):
                edges.append({
                    "source": event["id"],
                    "target": related_id,
                    "type": "related"
                })
    
    return ConnectionGraphResponse(nodes=nodes, edges=edges)

async def get_event_by_id(db: AsyncIOMotorDatabase, event_id: str) -> Optional[Dict[str, Any]]:
    """Get a single event by ID"""
    event = await db.timeline_events_v2.find_one({"id": event_id}, {"_id": 0})
    return event

async def get_taxonomy_data() -> Dict[str, Any]:
    """Return full taxonomy data for frontend"""
    return TAXONOMY_DATA

async def add_timeline_event(db: AsyncIOMotorDatabase, event: Dict[str, Any]) -> Dict[str, Any]:
    """Add a new timeline event"""
    if "id" not in event:
        event["id"] = str(__import__("uuid").uuid4())
    await db.timeline_events_v2.insert_one(event)
    return event

async def update_timeline_event(db: AsyncIOMotorDatabase, event_id: str, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """Update an existing timeline event"""
    result = await db.timeline_events_v2.find_one_and_update(
        {"id": event_id},
        {"$set": updates},
        return_document=True
    )
    if result:
        result.pop("_id", None)
    return result

async def delete_timeline_event(db: AsyncIOMotorDatabase, event_id: str) -> bool:
    """Delete a timeline event"""
    result = await db.timeline_events_v2.delete_one({"id": event_id})
    return result.deleted_count > 0
