# Crowlands Border Design System

## Border Assets

| Persona | Border Style | Use Case |
|---------|-------------|----------|
| **Site/Shigg** | Crow corners with Celtic knots | Default site borders, Shigg's spells |
| **Cathleen** | Ornate Victorian scrollwork | Cathleen's spells, protection magic |
| **Katherine** | Abstract modern strokes | Katherine's spells, clarity magic |
| **Theresa** | Distressed organic edge | Theresa's spells, nature magic |

## Border Application Rules

### 1. PAGE-LEVEL BORDERS (Site Border) ✅ IMPLEMENTED
Apply to ALL major page containers:
- ✅ Archive pages (Deities, Figures, Sites, Rituals, Timeline)
- ✅ Profile page
- ✅ Auth page
- ✅ My Grimoire page

**Component**: `<PageBorderFrame>` wrapping main content
**Location**: `/app/frontend/src/components/OrnateElements.js`

### 2. SPELL/GRIMOIRE PAGES (Persona-Specific) ✅ IMPLEMENTED
Apply persona border based on which archetype crafted the spell:
- Shigg spells -> Site/Shigg border
- Cathleen spells -> Cathleen border
- Katherine spells -> Katherine border
- Theresa spells -> Theresa border

**Component**: `<SpellBorderFrame persona={archetype.id}>`
**Applied to**: GrimoirePage.js (both TarotCardView and full grimoire view)

### 3. TAROT CARDS (Persona-Specific)
Wrap tarot card images with matching persona border:
- In GrimoirePage tarot card view
- In My Grimoire spell cards
- In Corrie Tarot deck display

**Component**: `<TarotCardFrame persona={archetype.id}>`

### 4. CONTENT SECTIONS (Gold Keyline)
Use subtle gold keyline borders for:
- Materials section
- The Working steps
- Words of Power
- Historical Context
- Special sections (Wards, Concealment)

**Component**: `<SectionBorderFrame>` or `<BorderFrame variant="gold">`

### 5. CARDS IN GRIDS (Corner Ornaments)
Use corner diamond ornaments for:
- Spell cards in My Grimoire
- Archive item cards
- Feature cards

**Component**: `<OrnateCard>` (already exists)

## Z-Index Hierarchy
- Border overlays: z-30 (PageBorderFrame corners)
- Border content: z-20 (SpellBorderFrame overlay)
- Content: z-10
- Background effects: z-0

## Implementation Status

### Pages Updated:
- ✅ Deities.js - PageBorderFrame
- ✅ HistoricalFigures.js - PageBorderFrame  
- ✅ SacredSites.js - PageBorderFrame
- ✅ Rituals.js - PageBorderFrame
- ✅ Timeline.js - PageBorderFrame
- ✅ Profile.js - PageBorderFrame
- ✅ Auth.js - PageBorderFrame
- ✅ MyGrimoire.js - PageBorderFrame
- ✅ GrimoirePage.js - SpellBorderFrame (persona-specific)

### Remaining:
- Library.js - Has own ArtDecoCorner (may keep as-is for variety)
- Home.js - Has own ElaborateCorner system (may keep as-is)
- Upgrade.js - Needs update
- CorrieTarot.js - Needs update with TarotCardFrame

## Code Patterns

### Page-Level Border
```jsx
import { PageBorderFrame, DarkSection } from '../components/OrnateElements';

return (
  <PageBorderFrame>
    <DarkSection>
      {/* Page content */}
    </DarkSection>
  </PageBorderFrame>
);
```

### Persona Spell Border
```jsx
import { SpellBorderFrame } from '../components/OrnateElements';

<SpellBorderFrame persona={archetype?.id || 'site'}>
  <motion.div className="spell-content">
    {/* Spell content */}
  </motion.div>
</SpellBorderFrame>
```

### Section Border
```jsx
import { SectionBorderFrame } from '../components/OrnateElements';

<SectionBorderFrame variant="gold">
  <h3>Materials Needed</h3>
  {/* Section content */}
</SectionBorderFrame>
```
