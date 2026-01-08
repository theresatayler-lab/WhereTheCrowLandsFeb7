# Crowlands Border Design System

## Border Assets

| Persona | Border Style | Use Case |
|---------|-------------|----------|
| **Site/Shigg** | Crow corners with Celtic knots | Default site borders, Shigg's spells |
| **Cathleen** | Ornate Victorian scrollwork | Cathleen's spells, protection magic |
| **Katherine** | Abstract modern strokes | Katherine's spells, clarity magic |
| **Theresa** | Distressed organic edge | Theresa's spells, nature magic |

## Border Application Rules

### 1. PAGE-LEVEL BORDERS (Site Border)
Apply to ALL major page containers:
- Home page hero sections
- Archive pages (Library, Deities, Figures, Sites, Rituals, Timeline)
- Profile, Settings, Auth pages
- My Grimoire list view

**Component**: `<PageBorderFrame>` wrapping main content
**CSS Class**: `border-frame-site`

### 2. SPELL/GRIMOIRE PAGES (Persona-Specific)
Apply persona border based on which archetype crafted the spell:
- Shigg spells -> Site/Shigg border
- Cathleen spells -> Cathleen border
- Katherine spells -> Katherine border
- Theresa spells -> Theresa border

**Component**: `<PersonaBorderFrame persona={archetype.id}>`

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
- Warnings
- Special sections (Wards, Concealment)

**Component**: `<SectionBorderFrame>` or `<BorderFrame variant="gold">`

### 5. CARDS IN GRIDS (Corner Ornaments)
Use corner diamond ornaments for:
- Spell cards in My Grimoire
- Archive item cards
- Feature cards

**Component**: `<OrnateCard>` (already exists)

## Z-Index Hierarchy
- Border overlays: z-20
- Content: z-10
- Background effects: z-0

## Implementation Checklist

### Pages to Update:
- [ ] Home.js - Site border on hero
- [ ] SpellRequest.js - Persona border on result
- [ ] GrimoirePage.js - Persona border + section borders
- [ ] MyGrimoire.js - Site border + persona borders on cards
- [ ] CorrieTarot.js - Site border + tarot card frames
- [ ] Library.js - Site border
- [ ] Deities.js - Site border
- [ ] HistoricalFigures.js - Site border
- [ ] SacredSites.js - Site border
- [ ] Rituals.js - Site border
- [ ] Timeline.js - Site border
- [ ] Profile.js - Site border
- [ ] Auth.js - Site border
- [ ] Upgrade.js - Site border
- [ ] AIChat.js - Site border
- [ ] About.js - Site border
- [ ] FAQ.js - Site border

## Code Patterns

### Page-Level Border
```jsx
import { PageBorderFrame } from '../components/OrnateElements';

<PageBorderFrame>
  <DarkSection>
    {/* Page content */}
  </DarkSection>
</PageBorderFrame>
```

### Persona Spell Border
```jsx
import { PersonaBorderFrame } from '../components/OrnateElements';

<PersonaBorderFrame persona={archetype?.id || 'site'}>
  <div className="spell-content">
    {/* Spell content */}
  </div>
</PersonaBorderFrame>
```

### Section Border
```jsx
import { SectionBorderFrame } from '../components/OrnateElements';

<SectionBorderFrame>
  <h3>Materials Needed</h3>
  {/* Section content */}
</SectionBorderFrame>
```
