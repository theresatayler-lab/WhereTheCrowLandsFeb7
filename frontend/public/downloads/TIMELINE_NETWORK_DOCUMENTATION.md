# TIMELINE & NETWORK SYSTEM DOCUMENTATION

## Overview

The nOcult Timeline is a data-driven visualization of 110 historical events in Western esotericism (1250 BCE - 2020s), connected through:
- **Direct influence** (documented historical connections)
- **Shared figures** (people who appear in multiple events)
- **Shared traditions** (magical/spiritual traditions that link events)

---

## DATA STRUCTURE

### Event Schema

Each timeline event has this structure:

```python
{
    "id": "unique_snake_case_id",
    "year": 1888,
    "month": null,  # Optional 1-12
    "title": "Human readable title",
    "primary_category": "Organization|Publication|Figure|Ritual|Site|Legal|Movement",
    "secondary_category": "More specific type",
    "taxonomy_categories": [6, 4],  # Category IDs 1-13
    "description": "Factual 2-3 sentence description",
    "description_narrative": "Optional AI-enhanced poetic narrative",
    "significance": "Why this matters historically",
    "figures_involved": ["Name 1", "Name 2"] or [{"name": "...", "role": "...", "dates": "..."}],
    "traditions": ["golden_dawn", "victorian_spiritualism"],
    "connections": {
        "influenced_by": ["event_id_1"],  # This event was influenced BY these
        "influenced": ["event_id_2"],      # This event influenced these
        "related_events": [],
        "part_of_movement": []
    },
    "guide_relevance": {
        "shigg": "low|medium|high",
        "cathleen": "low|medium|high", 
        "katherine": "low|medium|high",
        "theresa": "low|medium|high"
    },
    "sources": [{"title": "...", "author": "...", "year": 1990, "type": "book", "quality_tier": "academic_primary"}],
    "location": {"name": "London", "region": "England"},
    "confidence": "high|medium|low",
    "importance": 1-3,  # 1 = most important
    "is_pivotal_moment": true|false
}
```

### Taxonomy Categories (1-13)

| ID | Category | Color | Description |
|----|----------|-------|-------------|
| 1 | Divination | Purple | Tarot, astrology, oracles |
| 2 | Folk Magic | Olive | Kitchen witchery, folk remedies |
| 3 | Healing | Green | Energy healing, herbalism |
| 4 | Spirit Work | Indigo | Mediumship, necromancy |
| 5 | Protection | Red | Wards, banishing, shielding |
| 6 | Ceremonial | Gold | High magic, lodge work |
| 7 | Nature | Forest | Land spirits, seasonal rites |
| 8 | Ancestor | Amber | Genealogy magic, memorial |
| 9 | Shadow Work | Dark Purple | Integration, transformation |
| 10 | Chaos Magic | Electric | Sigils, paradigm shifting |
| 11 | Kitchen Witch | Warm Brown | Domestic, hearth magic |
| 12 | Political/Activist | Crimson | Social justice magic |
| 13 | Art/Creativity | Violet | Art magic, inspiration |

### Traditions (50 unique)

Major traditions include:
- `golden_dawn` - Hermetic Order of the Golden Dawn lineage
- `victorian_spiritualism` - 19th century séance culture
- `thelema` - Crowley's system
- `wicca` - Gardner/Valiente lineage
- `folk_magic` - Various folk traditions
- `grimoire_tradition` - Medieval/Renaissance grimoires
- `chaos_magic` - Post-modern magic
- `feminist_spirituality` - Goddess movement, Reclaiming

---

## NETWORK GRAPH LOGIC

### Node Types

The network visualization creates 3 types of nodes:

| Type | Source | Color | Size |
|------|--------|-------|------|
| **Event** | Timeline events | By taxonomy category | By importance |
| **Figure** | figures_involved field | Crimson | By connection count |
| **Tradition** | traditions field | Gold | By connection count |

### Edge Types

| Type | Connection Logic | Weight | Color |
|------|-----------------|--------|-------|
| **Direct Influence** | connections.influenced / influenced_by | 4 | Teal |
| **Shared Figure** | Two events share same figure | 2 | Crimson |
| **Shared Tradition** | Two events share same tradition | 1 | Gold |

### Graph Building Algorithm

```javascript
// 1. Create event nodes from all timeline events
events.forEach(event => {
    nodes.push({
        id: event.id,
        type: 'event',
        label: event.title,
        color: TAXONOMY_COLORS[event.taxonomy_categories[0]]
    });
});

// 2. Build figure nodes from figures_involved
const figureMap = new Map();  // figure_name -> [event_ids]
events.forEach(event => {
    event.figures_involved.forEach(figure => {
        figureMap.get(figure).push(event.id);
    });
});

// 3. Build tradition nodes from traditions
const traditionMap = new Map();  // tradition -> [event_ids]
events.forEach(event => {
    event.traditions.forEach(tradition => {
        traditionMap.get(tradition).push(event.id);
    });
});

// 4. Create edges for shared traditions
traditionMap.forEach((eventIds, tradition) => {
    // Connect all events that share this tradition
    for (let i = 0; i < eventIds.length; i++) {
        for (let j = i + 1; j < eventIds.length; j++) {
            links.push({
                source: eventIds[i],
                target: eventIds[j],
                type: 'shared_tradition',
                weight: 1
            });
        }
    }
});

// 5. Create edges for shared figures (same logic)

// 6. Create edges for direct influence
events.forEach(event => {
    event.connections.influenced.forEach(targetId => {
        if (nodeExists(targetId)) {
            links.push({
                source: event.id,
                target: targetId,
                type: 'direct_influence',
                weight: 4
            });
        }
    });
});
```

---

## DATA FILES

### Source Files (Backend)

| File | Contents | Count |
|------|----------|-------|
| `timeline_events_expanded.py` | Core events + DeepSeek generated | 57 events |
| `political_activism_events.py` | Political/activist magic events | 14 events |
| (HISTORICAL_EVENTS_EXTENDED) | Extended historical events | 39 events |
| **TOTAL** | ALL_TIMELINE_EVENTS | **110 events** |

### Generated CSVs

| File | Contents |
|------|----------|
| `timeline_events.csv` | All 110 events with metadata |
| `timeline_connections.csv` | All 243 connection references |
| `network_nodes.csv` | 306 nodes (110 events + 146 figures + 50 traditions) |
| `network_edges.csv` | 1237 edges (all connection types) |

---

## API ENDPOINTS

### Get Events (with filtering)
```
GET /api/timeline/v2/events
    ?search=golden dawn
    &categories=6,4
    &guides=katherine
    &traditions=golden_dawn
    &startYear=1880
    &endYear=1920
    &limit=50
```

### Get Statistics
```
GET /api/timeline/v2/stats
Response: {
    "total_events": 110,
    "events_by_category": {...},
    "events_by_era": {...},
    "top_figures": [...],
    "top_traditions": [...]
}
```

### Get Network Graph Data
```
GET /api/timeline/v2/graph
Response: {
    "nodes": [
        {"id": "gd_founding", "type": "event", "label": "...", "year": 1888, ...},
        {"id": "figure_crowley", "type": "figure", "label": "Aleister Crowley"},
        {"id": "tradition_golden_dawn", "type": "tradition", "label": "Golden Dawn"}
    ],
    "edges": [
        {"source": "gd_founding", "target": "stella_matutina", "type": "direct_influence"},
        {"source": "gd_founding", "target": "crowley_book_of_law", "type": "shared_figure"}
    ]
}
```

### Get Taxonomy
```
GET /api/timeline/v2/taxonomy
Response: {
    "categories": [
        {"id": 1, "name": "Divination", "color": "#8b5cf6", "icon": "eye"},
        ...
    ]
}
```

---

## UI COMPONENTS

### Timeline Views

1. **Timeline View** - Vertical chronological list grouped by era
2. **Grid View** - Card grid with filters
3. **Network View** - Force-directed graph (react-force-graph-2d)

### Event Card Features

- Expandable/collapsible
- Factual/Narrative description toggle (for enhanced events)
- Clickable figures (filters by figure)
- Clickable traditions (filters by tradition)
- Connection badges showing linked vs referenced
- Guide relevance indicators

### Connection Display

- **Teal badges** = Linked (target event exists, clickable)
- **Amber dashed badges** = Referenced (target event doesn't exist yet)
- Legend explains color coding

---

## ENHANCEMENT PIPELINE

### How Events Get Enhanced

```
1. Original event has basic "description"
2. DeepSeek researches additional context
3. Claude writes "description_narrative" in poetic style
4. Enhanced event stored with "_enhanced: true" flag
```

### Current Enhancement Status

- **46 of 110 events** have narrative descriptions
- Toggle UI shows both versions
- Remaining 64 events queued for enhancement

---

## STATISTICS SUMMARY

| Metric | Count |
|--------|-------|
| Total Events | 110 |
| Unique Figures | 146 |
| Unique Traditions | 50 |
| Direct Influence Connections | 74 |
| Shared Figure Connections | ~800 |
| Shared Tradition Connections | ~400 |
| Total Network Edges | 1,237 |
| Enhanced Events | 46 |
| Events with Broken Refs | 73 (referenced events not yet created) |

