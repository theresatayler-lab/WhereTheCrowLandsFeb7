# EMERGENT: UX Overhaul Implementation Guide
## Where The Crowlands - February 16, 2026

**PREREQUISITE: Complete ALL fixes in EMERGENT_INSTRUCTIONS.md FIRST (Bug Fixes 1-3, rebuild, restart). This document builds on top of that work.**

**IMPLEMENTATION ORDER: Phase 0 → 1 → 2 → 3 → 4 → 5 (do NOT skip or reorder)**

---

# PHASE 0: PRE-FLIGHT CHECKS (DO FIRST)

Confirm these are done before touching any UX code:

```bash
# Verify Bug Fix 1 was applied (GuidePortal block rendering)
grep -n "spell={spellResult}" frontend/src/pages/GuidePortal.js
# MUST return a match. If not, apply EMERGENT_INSTRUCTIONS.md Bug Fix 1 first.

# Verify Bug Fix 2 was applied (Theresa & Brenda routing)
grep -c "theresa" backend/server.py | head -5
# Should show theresa in keyword_routes

# Verify site is running
sudo supervisorctl status
# Should show backend RUNNING

# Verify frontend builds clean
cd /home/user/WhereTheCrowLandsFeb7/frontend && npm run build
# Must succeed with no errors
```

**IF ANY CHECK FAILS: Stop. Go back to EMERGENT_INSTRUCTIONS.md and complete those fixes first.**

---

# PHASE 1: HOMEPAGE — Remove "Meet Your Guides" Button (LOW RISK)

## What Changes
- Remove the "Meet Your Guides" button from the homepage hero section
- Add "Meet Your Guides" as a dropdown item under the "Explore" nav menu
- The `/guides` page itself stays UNTOUCHED — just removing the homepage button

## File: `frontend/src/pages/Home.js`

**Find the hero CTA buttons area.** It contains two buttons side by side: "We've Got a Spell for That" and "Meet Your Guides". They are wrapped in a flex container.

**Find this code block** (the "Meet Your Guides" button — it's the second button in the hero, links to `/guides`, has a `Users` icon and test ID `hero-meet-guides-btn`):

```jsx
              <Link
                to="/guides"
                data-testid="hero-meet-guides-btn"
```

**Delete the ENTIRE `<Link>` block** for the "Meet Your Guides" button (from the opening `<Link` to its closing `</Link>`). Keep the "We've Got a Spell for That" button intact.

**IMPORTANT:** The flex container wrapping both buttons may need adjustment. If the remaining button was in a `flex` row with the deleted one, either:
- Remove the flex wrapper and let the single button stand alone, OR
- Keep the flex wrapper but center the single button with `justify-center`

## File: `frontend/src/components/Navigation.js`

**Find the "Explore" dropdown items array.** It currently contains items like Library, Guides, Corrie Tarot, Invisible Helpers.

"Guides" should ALREADY be in this dropdown (linking to `/guides` with brandIcon `bird`). **Verify it's there.** If NOT there, add it:

```javascript
{ to: '/guides', label: 'Meet Your Guides', brandIcon: 'bird' },
```

Add it as the FIRST item in the Explore dropdown items array.

## Verification

```bash
# Button should be gone from Home.js
grep -n "hero-meet-guides-btn" frontend/src/pages/Home.js
# Should return NO matches

# Guides link should exist in Navigation
grep -n "guides" frontend/src/components/Navigation.js
# Should show /guides in Explore dropdown

# Rebuild
cd /home/user/WhereTheCrowLandsFeb7/frontend && npm run build
```

---

# PHASE 2: BACKEND — Richer Narrative Prompts (MEDIUM RISK)

## Why This Comes Before Frontend Changes
The AI-generated spell content needs to be richer BEFORE we redesign how it displays. Otherwise the new display will still show thin content.

## File: `backend/prompts/writer_blocks.py`

### Change 1: Enhance the `stepper` block directions

The stepper block generates "The Working" — the step-by-step spell instructions. Currently steps are functional but lack narrative richness.

**Find the stepper-related content directions** in CONTENT_DIRECTIONS. For EACH guide's stepper/tiny_practice/working block, update the `directions` string to include:

For **Shigg** — find `"tiny_practice"` block directions. **Replace the directions value** with:

```python
            "directions": "Give simple, domestic magic steps using items from the kitchen or home. 3-5 clear actions. For EACH step: describe the physical action, explain WHY this matters using folklore or tradition (e.g., 'The cunning folk of Somerset knew that common salt carries the weight of the earth's memory'), and connect to the seeker's specific intention. Write as flowing narrative paragraphs, not terse bullets. Weave historical anecdotes INTO the instructions naturally.",
```

For **Cathleen** — find the ward/protection step directions. **Add to the directions**:

```python
            "directions": "Teach how to create a protective ward using voice and intention. Make it feel solid but not fearful. Maternal fierce energy. For each step, explain the Irish or Celtic tradition behind it (e.g., 'In the old Irish practice, the threshold song was sung three times — once for the seen, once for the unseen, once for what lies between'). Write as decisive prose paragraphs with embedded history, not sparse instructions.",
```

For **Katherine** — find the diagnostic/precision step directions. **Add to the directions**:

```python
            "directions": "Guide through precise, measured ritual steps. Victorian diagnostic precision. For each action, reference the tradition (e.g., 'Victorian spiritualist circles used black thread to mark what needed cutting — a practice borrowed from Spitalfields silk workers who knew that every thread has a tension point'). Write as measured, evidence-based prose with historical footnotes woven in.",
```

For **Theresa** — find the investigation/pattern step directions. **Add to the directions**:

```python
            "directions": "Walk through evidence-gathering steps that bridge historical practice to modern application. Use Then/Now framing: explain the historical precedent, then the modern adaptation. Write as investigative narrative — 'The records show that practitioners in 1890s London kept notebooks of recurring symbols. Your notebook serves the same purpose: documenting what the patterns reveal.'",
```

For **Brenda** — find the letter/chronicle step directions. **Add to the directions**:

```python
            "directions": "Write instructions as intimate letter advice — 'What I'd suggest, dear friend, is this...' Each step should feel like counsel from a wise aunt. Weave in family tradition references (e.g., 'Your grandmother's generation knew this instinctively — the recipe card wasn't just about ingredients, it was about the hands that held it'). Maintain epistolary voice throughout.",
```

### Change 2: Enhance the `materials` block directions

For ALL guides, materials should explain WHY each item matters, not just list them.

**Find the materials-related directions** for each guide. Update to include language like:

```python
            "directions": "List materials with explanations. For each item, include a brief note on WHY it's used — its symbolic, historical, or practical significance. Example: 'A white candle — in British cunning craft, white carried all colors and all intentions. It's your universal key.' Keep it concise but meaningful — one sentence of context per item.",
```

### Change 3: Enhance the `cold_open` / greeting directions

For ALL guides, the opening should be more immersive. Update each guide's opening block directions to explicitly request:

```
"Set the scene with sensory detail. The seeker should feel they've walked into a specific place — Shigg's warm kitchen with the kettle on, Cathleen's threshold between worlds, Katherine's precise sitting room, Theresa's cluttered investigation desk, Brenda's writing table with letters spread out."
```

## Verification

```bash
# Restart backend to pick up prompt changes
sudo supervisorctl restart backend

# Verify backend is running
sudo supervisorctl status

# Test a spell generation (optional but recommended)
# Use the site UI or curl to generate a test spell and check the output quality
```

---

# PHASE 3: "ALCHEMIZE THIS" — Replace "How Do You Want to Feel" (MEDIUM RISK)

## What Changes
- Replace the `FEELINGS` array with `ALCHEMIZE_OPTIONS` in SpellRequest.js
- Rename the step from "How do you want to feel after?" to "Alchemize This Into..."
- Map each option to guide specialties so the backend can auto-select the right guide
- Keep the rest of Step 0 (persona selection, user query) the same
- **DO NOT change** Steps 1 or 2

## File: `frontend/src/pages/SpellRequest.js`

### Change 1: Replace FEELINGS array

**Find this code (around lines 51-59):**

```javascript
const FEELINGS = [
  { id: 'calm', label: 'Calm', icon: Cloud, color: 'text-blue-400', forPersonas: ['shigg', 'brenda', 'katherine'] },
  { id: 'brave', label: 'Brave', icon: Shield, color: 'text-amber-400', forPersonas: ['cathleen', 'theresa', 'katherine'] },
  { id: 'clear', label: 'Clear', icon: Eye, color: 'text-purple-400', forPersonas: ['katherine', 'theresa', 'shigg'] },
  { id: 'protected', label: 'Protected', icon: Shield, color: 'text-green-400', forPersonas: ['cathleen', 'katherine'] },
  { id: 'softened', label: 'Softened', icon: Heart, color: 'text-pink-400', forPersonas: ['shigg', 'brenda', 'cathleen'] },
  { id: 'energized', label: 'Energized', icon: Zap, color: 'text-yellow-400', forPersonas: ['cathleen', 'theresa'] },
  { id: 'connected', label: 'Connected', icon: Heart, color: 'text-rose-400', forPersonas: ['brenda', 'shigg'] }
];
```

**Replace with:**

```javascript
const ALCHEMIZE_OPTIONS = [
  { id: 'protection', label: 'Protection', icon: Shield, color: 'text-teal-400', description: 'Wards, shields, boundaries', forPersonas: ['cathleen', 'katherine', 'shigg'] },
  { id: 'baneful_justice', label: 'Baneful Justice', icon: Flame, color: 'text-red-400', description: 'Binding, truth-revealing, accountability', forPersonas: ['katherine', 'cathleen', 'theresa'] },
  { id: 'comfort_healing', label: 'Comfort & Healing', icon: Heart, color: 'text-amber-400', description: 'Grief, loss, emotional support', forPersonas: ['shigg', 'brenda', 'cathleen'] },
  { id: 'clarity_truth', label: 'Clarity & Truth', icon: Eye, color: 'text-violet-400', description: 'Discernment, seeing clearly, revelation', forPersonas: ['theresa', 'katherine', 'shigg'] },
  { id: 'releasing', label: 'Releasing & Letting Go', icon: Cloud, color: 'text-blue-400', description: 'Breaking patterns, cord-cutting, freedom', forPersonas: ['theresa', 'katherine', 'brenda'] },
  { id: 'ancestral_work', label: 'Ancestral Work', icon: User, color: 'text-rose-400', description: 'Family patterns, lineage healing, memory', forPersonas: ['theresa', 'brenda', 'shigg'] },
  { id: 'domestic_magic', label: 'Domestic Magic', icon: Home, color: 'text-yellow-400', description: 'Home blessing, kitchen magic, hearth craft', forPersonas: ['shigg', 'cathleen'] },
  { id: 'courage_strength', label: 'Courage & Strength', icon: Zap, color: 'text-green-400', description: 'Empowerment, voice, standing ground', forPersonas: ['cathleen', 'theresa'] }
];
```

### Change 2: Update the Step1 component rendering

**In the Step1 component (around line 168-231), find the "How do you want to feel after?" section.** It renders the FEELINGS array as a grid of selectable cards.

**Replace the heading text** from:
```
How do you want to feel after?
```
to:
```
Alchemize This Into...
```

**Replace references to `FEELINGS`** with `ALCHEMIZE_OPTIONS` throughout this section.

**Replace references to `desired_feeling`** in the spellSpec state with `alchemize_category`. Specifically:

In the initial state object (find `const [spellSpec, setSpellSpec] = useState({`):
```javascript
// Change this line:
  desired_feeling: 'calm',
// To:
  alchemize_category: 'protection',
```

**Update the grid rendering** to show description text under each label. Each card should show:
- Icon
- Label (bold)
- Description (smaller text underneath)

Example card JSX:

```jsx
{ALCHEMIZE_OPTIONS.map(option => (
  <button
    key={option.id}
    onClick={() => setSpellSpec(prev => ({ ...prev, alchemize_category: option.id }))}
    className={`p-4 rounded-lg border-2 text-left transition-all ${
      spellSpec.alchemize_category === option.id
        ? 'border-amber-500 bg-amber-900/20'
        : 'border-stone-700 bg-stone-800/50 hover:border-stone-500'
    }`}
  >
    <div className="flex items-center gap-2 mb-1">
      <option.icon className={`w-5 h-5 ${option.color}`} />
      <span className="font-montserrat text-sm font-medium text-stone-200">{option.label}</span>
    </div>
    <p className="text-xs text-stone-400 font-crimson-text">{option.description}</p>
  </button>
))}
```

### Change 3: Update the API submission

**Find the `handleGenerate` function (around line 574).** Where it builds the spell request payload, it currently sends `desired_feeling`.

**Change the payload** to send `alchemize_category` instead of (or in addition to) `desired_feeling`:

```javascript
// In the payload object, change:
desired_feeling: spellSpec.desired_feeling,
// To:
desired_feeling: spellSpec.alchemize_category,  // Backend reads this field
alchemize_category: spellSpec.alchemize_category,
```

**IMPORTANT: Keep sending `desired_feeling` with the alchemize value.** The backend's `feeling_routes` dict in server.py reads `desired_feeling` for guide routing. We're sending BOTH fields so the backend doesn't break.

### Change 4: Update backend feeling_routes to match new categories

**File: `backend/server.py`**

**Find the `feeling_routes` dict** (around line 4932-4941, should already have Theresa/Brenda from Bug Fix 2). **Replace the entire dict** with:

```python
                feeling_routes = {
                    # Legacy feelings (keep for backward compat with saved grimoire entries)
                    'calm': 'shigg',
                    'softened': 'shigg',
                    'protected': 'cathleen',
                    'brave': 'cathleen',
                    'energized': 'cathleen',
                    'clear': 'katherine',
                    'hidden': 'katherine',
                    'revealed': 'katherine',
                    'connected': 'brenda',
                    'remembered': 'brenda',
                    'understood': 'theresa',
                    'liberated': 'theresa',
                    # New alchemize categories
                    'protection': 'cathleen',
                    'baneful_justice': 'katherine',
                    'comfort_healing': 'shigg',
                    'clarity_truth': 'theresa',
                    'releasing': 'theresa',
                    'ancestral_work': 'brenda',
                    'domestic_magic': 'shigg',
                    'courage_strength': 'cathleen',
                }
```

## Verification

```bash
# Rebuild frontend
cd /home/user/WhereTheCrowLandsFeb7/frontend && npm run build

# Restart backend
sudo supervisorctl restart backend

# Test: Navigate to /spell-request
# Step 0 should show "Alchemize This Into..." with 8 category cards
# Selecting a category + writing an intention + clicking through should still generate a spell
# Existing guide portal (/guides) should be UNAFFECTED
```

---

# PHASE 4: GUIDE PROFILES AT BOTTOM OF SPELL REQUEST PAGE (LOW-MEDIUM RISK)

## What Changes
- Move guide selection (persona picker) from Step 0 to AUTOMATIC (AI picks based on alchemize_category)
- Add guide profile cards at the BOTTOM of the Spell Request page
- Clicking a profile card links to their individual guide page

## File: `frontend/src/pages/SpellRequest.js`

### Change 1: Default persona to "choose_for_me"

**In the initial state**, change the default persona:

```javascript
// Change:
  persona_id: 'choose_for_me',
// This should already be the default. If it's not, set it.
```

### Change 2: Remove persona picker from Step 0

**In the Step1 component**, find the "Who will guide your working?" persona selection section. **Remove it entirely** or wrap it in a comment. The user no longer picks a guide — the AI does it based on the alchemize category.

The Step 0 flow becomes:
1. "What do you need?" (text input) — KEEP
2. "Alchemize This Into..." (category selection) — KEEP (from Phase 3)
3. ~~"Who will guide your working?"~~ — REMOVE from this step

### Change 3: Add Guide Profile Cards at page bottom

**After the wizard steps and before the closing `</div>` of the main page component**, add a new section:

```jsx
{/* Guide Profiles Section - Always visible at bottom */}
<DarkSection className="mt-16">
  <div className="max-w-5xl mx-auto px-4 py-12">
    <h2 className="font-cinzel text-2xl text-center mb-2" style={{ color: '#C8A44D' }}>
      Meet Your Guides
    </h2>
    <p className="text-center text-stone-400 font-crimson-text mb-10">
      Each guide brings unique wisdom. Click to learn more or work with them directly.
    </p>

    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {PERSONAS.filter(p => p.id !== 'choose_for_me').map(persona => {
        const archetype = getArchetypeById(
          persona.id === 'shigg' ? 'shiggy' :
          persona.id === 'cathleen' ? 'kathleen' :
          persona.id === 'katherine' ? 'catherine' :
          persona.id
        );
        return (
          <Link
            key={persona.id}
            to={`/guides/${persona.id}`}
            className="group text-center p-4 rounded-lg border border-stone-700/50 hover:border-amber-600/50 transition-all bg-stone-900/30 hover:bg-stone-800/50"
          >
            {/* Guide avatar placeholder — use archetype image if available */}
            <div className="w-20 h-20 mx-auto mb-3 rounded-full overflow-hidden border-2 border-stone-600 group-hover:border-amber-500 transition-colors">
              {archetype?.image ? (
                <img src={archetype.image} alt={persona.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-stone-800 flex items-center justify-center">
                  <span className="text-2xl">{persona.emoji}</span>
                </div>
              )}
            </div>
            <h3 className="font-cinzel text-sm text-stone-200 group-hover:text-amber-400 transition-colors">
              {persona.name}
            </h3>
            <p className="text-xs text-stone-500 font-crimson-text mt-1">
              {persona.title}
            </p>
          </Link>
        );
      })}
    </div>
  </div>
</DarkSection>
```

**IMPORTANT:** The `Link` imports should already exist. The `getArchetypeById` function is already imported. The ID mapping (`shigg` → `shiggy`, etc.) handles the dual ID system.

## Verification

```bash
cd /home/user/WhereTheCrowLandsFeb7/frontend && npm run build

# Test: Navigate to /spell-request
# Step 0 should show: text input + alchemize categories (NO persona picker)
# Bottom of page should show 5 guide profile cards in a row
# Clicking a guide card should navigate to /guides/{id}
# Spells should still generate (backend auto-selects guide from alchemize_category)
```

---

# PHASE 5: LOADING EXPERIENCE — Show Selected Guide + Bio (MEDIUM RISK)

## What Changes
- During spell generation loading, show WHICH guide was selected
- Display a shortened bio and reason for selection
- Keep existing video background and progress indicators

## File: `frontend/src/pages/SpellRequest.js`

### Change 1: Extract selected guide from job status

**In the polling function** (find where it polls `/api/ai/spell-job/{jobId}`), the response should include `persona_id` or `persona_lock` once the spell starts generating.

**After receiving the job result**, check for the guide info:

```javascript
// Inside the polling loop or after job completion
const selectedGuideId = result.persona_lock?.id || result.persona_id || null;
```

**Add state for the selected guide:**

```javascript
const [selectedGuide, setSelectedGuide] = useState(null);
```

When polling returns persona info, set it:

```javascript
if (selectedGuideId && !selectedGuide) {
  const guide = PERSONAS.find(p => p.id === selectedGuideId);
  const archetype = getArchetypeById(
    selectedGuideId === 'shigg' ? 'shiggy' :
    selectedGuideId === 'cathleen' ? 'kathleen' :
    selectedGuideId === 'katherine' ? 'catherine' :
    selectedGuideId
  );
  setSelectedGuide({ ...guide, bio: archetype?.bio || '' });
}
```

### Change 2: Update loading overlay

**Find the loading overlay** (the full-screen overlay shown during generation, with the video background and "Weaving Your Spell" heading).

**Replace the centered loading content** (the section with Sparkles icon + "Weaving Your Spell" text) with:

```jsx
<div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
  {/* Guide reveal */}
  {selectedGuide ? (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="text-center max-w-lg"
    >
      {/* Guide name */}
      <h2 className="font-cinzel text-3xl text-amber-400 mb-2">
        {selectedGuide.name}
      </h2>
      <p className="font-italiana text-lg text-stone-300 mb-6">
        {selectedGuide.title}
      </p>

      {/* Why this guide */}
      <div className="bg-black/30 backdrop-blur-sm rounded-lg p-6 mb-6 border border-amber-500/20">
        <p className="font-crimson-text text-stone-300 text-base italic leading-relaxed">
          {selectedGuide.name === 'Shigg' && "Shigg was chosen because your intention speaks to the quiet magic of everyday moments. She knows the kitchen-table wisdom that mends what words cannot."}
          {selectedGuide.name === 'Cathleen' && "Cathleen steps forward because your need calls for fierce protection. She carries the old songs that build walls nothing unwanted can cross."}
          {selectedGuide.name === 'Katherine' && "Katherine has taken your case. Your intention requires precision and the willingness to look at what others avoid. She sees the threads others miss."}
          {selectedGuide.name === 'Theresa' && "Theresa recognizes the patterns in your intention. She's already pulling the files, connecting the evidence. The investigation begins now."}
          {selectedGuide.name === 'Brenda' && "Brenda has received your letter. Your intention carries the weight of family and memory. She's composing her reply with care."}
        </p>
      </div>

      {/* Shortened bio */}
      <p className="font-crimson-text text-stone-400 text-sm leading-relaxed max-h-32 overflow-hidden">
        {selectedGuide.bio?.substring(0, 300)}...
      </p>
    </motion.div>
  ) : (
    /* Fallback: original loading content if guide not yet known */
    <div className="text-center">
      <Sparkles className="w-12 h-12 text-amber-400 mx-auto mb-4 animate-pulse" />
      <h2 className="font-cinzel text-2xl text-bone mb-2">Finding Your Guide</h2>
      <p className="font-crimson-text text-stone-400">The right guide is emerging for your intention...</p>
    </div>
  )}

  {/* Progress indicator */}
  <div className="mt-8 flex gap-2">
    <span className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
    <span className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
    <span className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '400ms' }} />
  </div>
  <p className="text-stone-500 text-sm mt-4 font-montserrat">This may take a moment...</p>
</div>
```

### Change 3: Reset selectedGuide on new spell

In the reset/new spell function, add:

```javascript
setSelectedGuide(null);
```

## Verification

```bash
cd /home/user/WhereTheCrowLandsFeb7/frontend && npm run build

# Test: Generate a spell from /spell-request
# During loading: should initially show "Finding Your Guide"
# Once backend assigns a guide: should show guide name, title, why text, and bio excerpt
# Video should still play in background
# Spell result should still display correctly after generation completes
```

---

# PHASE 6: SPELL DISPLAY — Narrative Layout (HIGH RISK — BE CAREFUL)

## What Changes
- Reduce visual fragmentation in spell display
- Make the spell read more like a flowing narrative page
- Research section must actually work (fix if broken)
- Keep Save to Grimoire and all existing functionality

## IMPORTANT: DO NOT rewrite SpellBlockRenderer.jsx from scratch. Make targeted edits.

## File: `frontend/src/components/SpellBlockRenderer.jsx`

### Change 1: Improve stepper block narrative flow

**Find the stepper block renderer** (the section that handles `type === 'stepper'`). Currently it shows steps with checkboxes, numbered badges, and individual boxes.

**Make these specific changes:**

1. **Remove the checkbox completion UI** for the steps (the circular check/uncheck toggle). Steps should display as narrative paragraphs, not checkable tasks.

2. **Change step layout** from boxed items to flowing paragraphs. Replace the per-step box styling with:

```jsx
<div key={stepIndex} className="mb-6">
  <h4 className="font-cinzel text-base mb-2" style={{ color: '#C8A44D' }}>
    Step {stepIndex + 1}{step.title ? `: ${step.title}` : ''}
  </h4>
  <div className="font-crimson-text text-stone-800 text-base leading-relaxed">
    <p>{step.instruction || step.text}</p>
    {step.spoken_words && (
      <blockquote className="my-3 pl-4 border-l-2 border-amber-300 italic text-stone-700">
        "{step.spoken_words}"
      </blockquote>
    )}
    {step.why && (
      <p className="mt-2 text-stone-600 italic text-sm">{step.why}</p>
    )}
    {step.duration_hint && (
      <p className="mt-1 text-stone-500 text-xs font-montserrat">{step.duration_hint}</p>
    )}
  </div>
</div>
```

3. **Keep the section header** ("The Working") but remove the progress counter ("2 of 5 complete" etc.)

### Change 2: Improve materials block

**Find the materials block renderer.** Currently renders items in a grid of small boxes.

**Change to a simpler list format:**

```jsx
<div className="space-y-3">
  {block.items?.map((item, i) => (
    <div key={i} className="flex gap-3 items-start">
      <Feather className="w-4 h-4 text-amber-600 mt-1 flex-shrink-0" />
      <div>
        <span className="font-crimson-text text-stone-800 font-semibold">{item.name || item}</span>
        {item.purpose && (
          <span className="font-crimson-text text-stone-600"> — {item.purpose}</span>
        )}
      </div>
    </div>
  ))}
</div>
```

### Change 3: Improve cold_open block

**Find the cold_open block renderer.** Make sure the guide's opening voice is prominent and immersive:

```jsx
<div className="mb-8">
  <blockquote className="font-crimson-text text-lg text-stone-800 italic leading-relaxed border-l-3 border-amber-400 pl-5">
    {block.greeting || block.content}
  </blockquote>
  {block.scene_setting && (
    <p className="font-crimson-text text-stone-600 mt-3 leading-relaxed">
      {block.scene_setting}
    </p>
  )}
</div>
```

### Change 4: Improve lore_vignette block

This is the "From the Archives" historical context. Make it read as an embedded story, not a separate box:

```jsx
<div className="my-6 py-4 border-t border-b border-stone-300/50">
  {block.title && (
    <h4 className="font-cinzel text-sm text-stone-500 uppercase tracking-wider mb-2">
      {block.era ? `${block.era} — ` : ''}{block.tradition || 'From the Archives'}
    </h4>
  )}
  <p className="font-crimson-text text-stone-700 leading-relaxed italic">
    {block.narrative || block.content}
  </p>
  {block.relevance && (
    <p className="font-crimson-text text-stone-600 mt-2 text-sm">
      {block.relevance}
    </p>
  )}
</div>
```

### Change 5: Fix research/sources section

**File: `frontend/src/pages/GuidePortal.js`** (lines ~461-488)

The sources section displays but the "Learn More" links may not work. Check that:

1. `source.learn_more_url` is being rendered as an actual `<a>` tag with `href`
2. Links open in new tab (`target="_blank" rel="noopener noreferrer"`)
3. If `learn_more_url` is null/undefined, don't render a broken link

**Also check** `frontend/src/components/GrimoirePage.js` for its sources rendering and apply the same fix.

**File: `frontend/src/components/GrimoirePage.js`**

Find where sources are rendered. Ensure:

```jsx
{source.learn_more_url && (
  <a
    href={source.learn_more_url}
    target="_blank"
    rel="noopener noreferrer"
    className="text-amber-600 hover:text-amber-500 text-sm underline"
  >
    Learn more
  </a>
)}
```

## DO NOT CHANGE:
- The Save to Grimoire functionality
- The ethics_statement display
- The safety_note block (amber warning box)
- The ward, song_prompt, bird_oracle, evidence_card block types (these are guide-specific and working)
- The overall SpellBlockRenderer component signature (props: spell, archetypeStyle)

## Verification

```bash
cd /home/user/WhereTheCrowLandsFeb7/frontend && npm run build

# Test: Generate a spell and verify:
# 1. Opening reads as immersive narrative (not a labeled box)
# 2. Materials show as a clean list with WHY explanations
# 3. Steps read as flowing paragraphs with embedded history
# 4. Historical vignettes blend into the narrative
# 5. Sources at bottom have working "Learn more" links
# 6. Save to Grimoire button still works
# 7. All 5 guides' spells still render correctly
```

---

# PHASE 7: TAROT CARD PREVIEW (MEDIUM RISK — OPTIONAL, DO LAST)

## What Changes
- Before showing the full spell, show a tarot-card-style preview
- Card shows: bespoke image + spell title + guide name
- "Reveal Full Spell" button expands to the full display

**NOTE: Only implement this if all previous phases are working. This is a nice-to-have.**

## File: `frontend/src/pages/SpellRequest.js`

### Add state for card reveal

```javascript
const [spellRevealed, setSpellRevealed] = useState(false);
```

### Wrap the spell result display

**Find where `GrimoirePage` is rendered** (around the spell result display section). Wrap it:

```jsx
{spellResult && !loading && (
  <div>
    {!spellRevealed ? (
      /* Tarot Card Preview */
      <div className="flex flex-col items-center py-16">
        <motion.div
          initial={{ rotateY: -10, opacity: 0 }}
          animate={{ rotateY: 0, opacity: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="w-72 bg-[#F3EFE8] rounded-lg overflow-hidden shadow-2xl border-2 border-amber-600/30"
          style={{ perspective: '1000px' }}
        >
          {/* Card image - use generated tarot image if available */}
          {spellResult.images?.tarot_card_image ? (
            <img
              src={spellResult.images.tarot_card_image}
              alt={spellResult.title}
              className="w-full h-80 object-cover"
            />
          ) : (
            <div className="w-full h-80 bg-gradient-to-b from-stone-800 to-stone-900 flex items-center justify-center">
              <Sparkles className="w-16 h-16 text-amber-400/50" />
            </div>
          )}

          {/* Card text */}
          <div className="p-6 text-center">
            <div className="w-12 mx-auto mb-3 border-t border-amber-500/50" />
            <h3 className="font-cinzel text-lg text-stone-800 mb-1">
              {spellResult.title || 'Your Working'}
            </h3>
            {spellResult.subtitle && (
              <p className="font-crimson-text text-sm text-stone-600 italic mb-3">
                {spellResult.subtitle}
              </p>
            )}
            <p className="font-montserrat text-xs text-stone-500 uppercase tracking-wider">
              Crafted by {spellResult.persona_lock?.name || 'Your Guide'}
            </p>
          </div>
        </motion.div>

        <button
          onClick={() => setSpellRevealed(true)}
          className="mt-8 px-8 py-3 font-cinzel text-sm uppercase tracking-wider rounded border-2 transition-all"
          style={{
            color: '#C8A44D',
            borderColor: 'rgba(200, 164, 77, 0.5)',
            backgroundColor: 'transparent'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(200, 164, 77, 0.1)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
        >
          Reveal Full Spell
        </button>
      </div>
    ) : (
      /* Full spell display - existing GrimoirePage */
      <div>
        {/* Keep existing "Begin Another Working" button */}
        {/* Keep existing GrimoirePage rendering */}
        {/* This is the same code that currently exists */}
      </div>
    )}
  </div>
)}
```

### Reset on new spell

```javascript
// In the reset/new spell function, add:
setSpellRevealed(false);
```

## Verification

```bash
cd /home/user/WhereTheCrowLandsFeb7/frontend && npm run build

# Test: Generate a spell
# After loading: should see a tarot-card-style preview with title + guide name
# Clicking "Reveal Full Spell" should show the full spell
# All existing functionality (save, print, etc.) should still work
```

---

# FINAL VERIFICATION CHECKLIST

After ALL phases are complete, verify everything works end-to-end:

```bash
# Rebuild everything
cd /home/user/WhereTheCrowLandsFeb7/frontend && npm run build
sudo supervisorctl restart backend
sudo supervisorctl status
```

## Manual Testing Checklist

### Homepage
- [ ] "We've Got a Spell for That" button is present and links to /spell-request
- [ ] "Meet Your Guides" button is GONE from hero
- [ ] "Meet Your Guides" is in the Explore dropdown menu
- [ ] Navigation dropdown menus all work

### Spell Request Page (/spell-request)
- [ ] Step 0 shows: text input + "Alchemize This Into..." categories (8 options)
- [ ] NO persona picker in Step 0
- [ ] Step 1 (Style & Approach) is UNCHANGED
- [ ] Step 2 (Details & Personalization) is UNCHANGED
- [ ] Guide profile cards appear at bottom of page
- [ ] Clicking a guide card goes to /guides/{id}
- [ ] "So Mote It Be" button works

### Loading Experience
- [ ] Video plays in background
- [ ] Initially shows "Finding Your Guide"
- [ ] Once guide is assigned: shows guide name, title, why text, bio excerpt
- [ ] Three bouncing dots visible
- [ ] "This may take a moment..." text visible

### Spell Display
- [ ] Tarot card preview appears first (if Phase 7 was implemented)
- [ ] "Reveal Full Spell" button works
- [ ] Opening reads as immersive narrative
- [ ] Materials listed with WHY explanations
- [ ] Steps are flowing paragraphs with history woven in
- [ ] Sources have working "Learn more" links
- [ ] Save to Grimoire button works
- [ ] Ethics statement displays

### Guide Portal (/guides) — MUST NOT BE BROKEN
- [ ] All 5 guide pages load
- [ ] Conversation flow works
- [ ] Spell generation works from guide portal
- [ ] Spell blocks render correctly (Bug Fix 1 applied)
- [ ] Sources display correctly

### My Grimoire (/my-grimoire) — MUST NOT BE BROKEN
- [ ] Old spells display correctly
- [ ] New spells appear after saving
- [ ] Spell detail view works

---

# WHAT NOT TO TOUCH

These files/features must remain UNCHANGED unless explicitly needed for a fix above:

- `frontend/src/pages/Timeline.js` — Timeline page
- `frontend/src/pages/MyGrimoire.js` — Grimoire collection (read-only)
- `frontend/src/pages/Auth.js` — Authentication
- `frontend/src/pages/Guides.js` — Guide profiles landing page
- `frontend/src/pages/GuidePortal.js` — Guide portal (except sources fix in Phase 6)
- `frontend/src/components/GrimoirePage.js` — (except sources fix in Phase 6)
- `backend/prompts/pipeline_blocks.py` — Pipeline orchestration
- `backend/prompts/archivist.py` — Research stage
- `backend/prompts/qa_blocks.py` — QA validation
- `backend/spell_tiers.py` — Tier system
- `backend/persona_config.py` — Guide personas
- All auth, payment, timeline, and library endpoints

---

# ROLLBACK PLAN

If something breaks badly:

```bash
# Revert frontend to last working state
cd /home/user/WhereTheCrowLandsFeb7
git stash  # Stash current changes

# Or revert to last commit
git checkout frontend/src/pages/SpellRequest.js
git checkout frontend/src/pages/Home.js
git checkout frontend/src/components/SpellBlockRenderer.jsx
git checkout frontend/src/components/Navigation.js
git checkout backend/prompts/writer_blocks.py
git checkout backend/server.py

# Rebuild
cd frontend && npm run build
sudo supervisorctl restart backend
```

---

**END OF DOCUMENT**
