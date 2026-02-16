# NEXT STEPS: Stage Progress Indicator + Future Features
## Where The Crowlands - February 16, 2026

**BEFORE DOING ANYTHING ELSE: Confirm that the live site is running your latest code.**
- Run: `cd frontend && npm run build`
- Run: `sudo supervisorctl restart backend`
- Run: `sudo supervisorctl status` (confirm backend is RUNNING)
- Open the live site and verify you see: Alchemize categories (not feelings), flowing narrative spell output, guide reveal on loading screen
- **If ANY of those are missing, merge your branch into main first:**
  ```bash
  cd /app
  git checkout main
  git merge Emergent-New-Changes
  cd frontend && npm run build
  sudo supervisorctl restart backend
  ```
- **DO NOT proceed until the live site shows the latest code.**

---

# BUG FIX 1: Stage Progress Indicator During Spell Generation

**WHY THIS MATTERS:** Spell generation takes 40-90 seconds. Right now users see "This may take a moment..." with animated dots and nothing else. They don't know if the app froze. A stage indicator ("Researching traditions..." → "Planning your working..." → "Writing in Shigg's voice...") gives them confidence the system is working AND builds anticipation.

## Step 1: Backend — Update job with current_stage between pipeline stages

### File: `backend/server.py`

**Find** the `_generate_spell_background` function (around line 5132). Inside it, find the section where the pipeline is called (around lines 5258-5264). It currently looks like:

```python
        # Generate spell
        spell_output, metadata = await pipeline.generate_spell(
            spell_spec=spell_spec,
            guide_config=guide_config,
            belief_mode=belief_mode,
            tier_config=tier_config
        )
```

**Replace** that `# Generate spell` block (the 6 lines above) with:

```python
        # Generate spell — with stage progress updates to MongoDB
        async def update_stage(stage_name: str):
            """Update the job document so polling can show stage progress."""
            stage_messages = {
                'archivist': 'Researching traditions and folklore...',
                'planner': 'Planning your working...',
                'writer': f'Writing in {guide_config.get("name", "your guide")}\'s voice...',
                'qa': 'Final review...'
            }
            await db.spell_jobs.update_one(
                {'job_id': job_id},
                {'$set': {
                    'current_stage': stage_name,
                    'stage_message': stage_messages.get(stage_name, 'Working...'),
                    'updated_at': datetime.now(timezone.utc)
                }}
            )

        spell_output, metadata = await pipeline.generate_spell(
            spell_spec=spell_spec,
            guide_config=guide_config,
            belief_mode=belief_mode,
            tier_config=tier_config,
            on_stage_change=update_stage
        )
```

### File: `backend/prompts/pipeline_blocks.py`

**Find** the `generate_spell` method of the `BlocksSpellPipeline` class (around line 973). The method signature currently looks like:

```python
    async def generate_spell(
        self,
        spell_spec: dict,
        guide_config: dict,
        belief_mode: str = "SPIRITUAL",
        tier: str = None,
        tier_config: dict = None
    ):
```

**Replace** that method signature (the 7 lines above) with:

```python
    async def generate_spell(
        self,
        spell_spec: dict,
        guide_config: dict,
        belief_mode: str = "SPIRITUAL",
        tier: str = None,
        tier_config: dict = None,
        on_stage_change: callable = None
    ):
```

Now inside the same `generate_spell` method, find the `try:` block that runs the 4 stages (around line 1003). It currently looks like:

```python
        try:
            # Stage 1: Archivist (research) - create minimal packet for now
            research_packet = await self._run_archivist(spell_spec, guide_id)
            metadata["stages_completed"].append("archivist")
            metadata["timing"]["archivist_ms"] = self.timing_log.get("archivist_ms", 0)

            # Stage 2: Planner
            plan, planner_meta = await run_block_planner(
```

**Replace** the `try:` line and the archivist call (5 lines) with:

```python
        try:
            # Stage 1: Archivist (research)
            if on_stage_change:
                await on_stage_change("archivist")
            research_packet = await self._run_archivist(spell_spec, guide_id)
            metadata["stages_completed"].append("archivist")
            metadata["timing"]["archivist_ms"] = self.timing_log.get("archivist_ms", 0)

            # Stage 2: Planner
            if on_stage_change:
                await on_stage_change("planner")
            plan, planner_meta = await run_block_planner(
```

Then find the writer stage (around line 1018). It currently looks like:

```python
            # Stage 3: Writer
            spell_output, writer_meta = await run_block_writer(
```

**Replace** those 2 lines with:

```python
            # Stage 3: Writer
            if on_stage_change:
                await on_stage_change("writer")
            spell_output, writer_meta = await run_block_writer(
```

Then find the QA stage (around line 1027). It currently looks like:

```python
            # Stage 4: QA validation
            working_type = plan.get("working_type", "")
```

**Replace** those 2 lines with:

```python
            # Stage 4: QA validation
            if on_stage_change:
                await on_stage_change("qa")
            working_type = plan.get("working_type", "")
```

## Step 2: Backend — Return current_stage in job status polling

### File: `backend/server.py`

**Find** the `get_spell_job_status` endpoint (around line 5406). Inside it, find the `elif job.get('status') == 'processing':` block (around line 5434). It currently looks like:

```python
    elif job.get('status') == 'processing':
        # Estimate progress based on elapsed time
        created = job.get('created_at')
        if created:
            # Handle timezone-naive datetimes from MongoDB
            if created.tzinfo is None:
                created = created.replace(tzinfo=timezone.utc)
            elapsed = (datetime.now(timezone.utc) - created).total_seconds()
            estimated_total = 120  # 2 minutes expected
            progress = min(int((elapsed / estimated_total) * 100), 95)
            response['progress'] = progress
        # Include persona info so frontend can show guide during loading
        if job.get('persona_id'):
            response['persona_id'] = job['persona_id']
            response['persona_name'] = job.get('persona_name', '')
            response['persona_title'] = job.get('persona_title', '')
            response['routing_reason'] = job.get('routing_reason', '')
```

**Replace** that entire `elif` block (all 16 lines above) with:

```python
    elif job.get('status') == 'processing':
        # Estimate progress based on elapsed time
        created = job.get('created_at')
        if created:
            # Handle timezone-naive datetimes from MongoDB
            if created.tzinfo is None:
                created = created.replace(tzinfo=timezone.utc)
            elapsed = (datetime.now(timezone.utc) - created).total_seconds()
            estimated_total = 120  # 2 minutes expected
            progress = min(int((elapsed / estimated_total) * 100), 95)
            response['progress'] = progress
        # Include persona info so frontend can show guide during loading
        if job.get('persona_id'):
            response['persona_id'] = job['persona_id']
            response['persona_name'] = job.get('persona_name', '')
            response['persona_title'] = job.get('persona_title', '')
            response['routing_reason'] = job.get('routing_reason', '')
        # Include current pipeline stage for progress indicator
        if job.get('current_stage'):
            response['current_stage'] = job['current_stage']
            response['stage_message'] = job.get('stage_message', 'Working...')
```

## Step 3: Frontend — Read current_stage from polling and display it

### File: `frontend/src/pages/SpellRequest.js`

**Find** the polling section inside `pollJob` (around line 656). It currently looks like:

```javascript
            // Show progress if available
            if (statusData.progress && statusData.progress > 0) {
              // Could update a progress bar here
              console.log(`Spell generation progress: ${statusData.progress}%`);
            }
```

**Replace** those 4 lines with:

```javascript
            // Update stage progress for loading indicator
            if (statusData.current_stage) {
              setCurrentStage(statusData.current_stage);
              setStagMessage(statusData.stage_message || 'Working...');
            }
```

**Find** the state declarations near the top of the `SpellRequest` component (around line 395 where `selectedGuide` is declared). After the line:

```javascript
  const [selectedGuide, setSelectedGuide] = useState(null);
```

**Add** these two new state variables:

```javascript
  const [currentStage, setCurrentStage] = useState(null);
  const [stageMessage, setStagMessage] = useState('');
```

## Step 4: Frontend — Show stage indicator in the loading overlay

### File: `frontend/src/pages/SpellRequest.js`

**Find** the line in the loading overlay (around line 991) that says:

```javascript
              <p className="font-montserrat text-xs text-gold/50 tracking-widest uppercase mt-6">
                This may take a moment...
              </p>
```

**Replace** those 3 lines with:

```javascript
              {/* Stage progress indicator */}
              {currentStage ? (
                <div className="mt-6">
                  <p className="font-crimson-text text-base text-cream/90 mb-3">
                    {stageMessage}
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    {['archivist', 'planner', 'writer', 'qa'].map((stage, idx) => {
                      const stages = ['archivist', 'planner', 'writer', 'qa'];
                      const currentIdx = stages.indexOf(currentStage);
                      const isComplete = idx < currentIdx;
                      const isActive = idx === currentIdx;
                      return (
                        <div key={stage} className="flex items-center gap-2">
                          <div className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${
                            isComplete ? 'bg-gold' :
                            isActive ? 'bg-gold animate-pulse shadow-[0_0_8px_rgba(200,164,77,0.6)]' :
                            'bg-cream/20'
                          }`} />
                          {idx < 3 && (
                            <div className={`w-6 h-px transition-all duration-500 ${
                              isComplete ? 'bg-gold/60' : 'bg-cream/10'
                            }`} />
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex justify-between text-[10px] text-cream/40 font-montserrat uppercase tracking-wider mt-1.5 max-w-[220px] mx-auto">
                    <span>Research</span>
                    <span>Plan</span>
                    <span>Write</span>
                    <span>Polish</span>
                  </div>
                </div>
              ) : (
                <p className="font-montserrat text-xs text-gold/50 tracking-widest uppercase mt-6">
                  This may take a moment...
                </p>
              )}
```

---

# BUG FIX 2: Reset Loading State Between Spell Generations

**WHY THIS MATTERS:** If a user generates a spell, goes back, and generates another one, the `selectedGuide` and `currentStage` state from the previous generation might persist. The loading screen could briefly flash the wrong guide or old stage.

### File: `frontend/src/pages/SpellRequest.js`

**Find** the beginning of `handleGenerate` (around line 568). There's a line:

```javascript
      setLoading(true);
```

**Right after** that line, add:

```javascript
      setSelectedGuide(null);
      setCurrentStage(null);
      setStagMessage('');
```

---

# FEATURE 1: Unique Guide Interaction Models

**WHY THIS MATTERS:** Right now every guide gets the same 3-step form (intention → materials → generate). But each guide has a distinct archetype that suggests different interaction patterns. Shigg should feel like sitting down to tea. Cathleen should feel like being called to battle. These unique interaction touches make each guide feel alive and distinct.

**SCOPE:** These are additions to the **spell result display** — NOT changes to the input form. The form stays the same 3 steps. What changes is what appears in the spell output for each guide.

## Shigg: Bird Oracle Block

Shigg's spells can include a `bird_oracle` block. The block renderer (`SpellBlockRenderer.jsx`) already handles this type. What we need is to make sure the writer prompt actually generates it.

### File: `backend/prompts/writer_blocks.py`

**Find** the section where Shigg's block directions are defined. Look for Shigg's stepper or block-specific instructions. In the writer prompt template, wherever the guide-specific block instructions are assembled, **add** this to Shigg's section:

```
If the plan includes a bird_oracle block, write it as:
- A short narrative about a bird appearing (robin, crow, wren, sparrow — choose one that fits the intention)
- The bird's behavior as a sign ("The robin turns its head east — toward the new thing coming")
- An interpretation in Shigg's warm, kitchen-wisdom voice
- Frame it as folk tradition, not literal prophecy: "In the old way of reading birds..."
```

**Verification:** Generate a spell as Shigg. If the planner includes a `bird_oracle` block, the output should have a bird omen narrative. If no `bird_oracle` appears, this is fine — not every Shigg spell needs one. The planner decides.

## Cathleen: Song Prompt Block

Cathleen's spells can include a `song_prompt` block (already supported in SpellBlockRenderer).

### File: `backend/prompts/writer_blocks.py`

**Add** to Cathleen's block directions:

```
If the plan includes a song_prompt block, write it as:
- A specific instruction to hum, chant, or sing a short phrase
- The phrase itself (2-4 lines, with rhythm — could be a couplet)
- The emotional key: "Sing this low, from the belly, the way you'd warn someone you love"
- Reference Irish/Celtic vocal tradition: keening, lullabies, work songs, or chanting
- Frame as empowerment: the voice itself IS the ward/spell/binding
```

## Katherine: Evidence Card Block

Katherine's spells can include an `evidence_card` block (already supported).

### File: `backend/prompts/writer_blocks.py`

**Add** to Katherine's block directions:

```
If the plan includes an evidence_card block, write it as:
- A formal observation note, as if filed in a case record
- Header: "Evidence Card" or "Case Note"
- A precise, clinical observation about the user's pattern or situation
- A conclusion drawn from the evidence, with Katherine's dry precision
- Reference Victorian investigation or spiritualist methodology
- Tone: detached but not cold — a professional who genuinely wants to help you see the truth
```

## Theresa: Observation Task Block

Theresa's spells can include an `observation_task` block (already supported).

### File: `backend/prompts/writer_blocks.py`

**Add** to Theresa's block directions:

```
If the plan includes an observation_task block, write it as:
- A specific investigative assignment for the user
- "Between now and [time period], notice when [specific thing] happens"
- Frame as evidence-gathering: "You're building a case file on your own patterns"
- Include what to record: "Write down the time, the trigger, and what you did next"
- Theresa's direct voice: not mystical, but analytical with compassion
```

## Brenda: Letter/Envelope Framing

Brenda's entire spell output should feel like receiving a letter from a family member. This is about framing, not a new block type.

### File: `backend/prompts/writer_blocks.py`

**Add** to Brenda's cold_open directions (or general framing instructions):

```
Brenda's spell should feel like opening a handwritten letter from a beloved aunt or grandmother.
- cold_open: Begin as if starting a letter: "My dear one," or "I've been thinking about what you told me..."
- closing: End as a letter would: "With all my love," or "I'll be thinking of you. Write back and tell me how it went."
- Throughout: Use "you" directly, mention family, use memory and nostalgia as emotional anchors
- Reference: recipe cards, kitchen tables, family photo albums, handwritten notes in margins of cookbooks
```

---

# FEATURE 2: Grimoire PDF Export

**WHY THIS MATTERS:** Users save spells to their Grimoire. Currently they can only view them online. A PDF export lets them print their grimoire as a physical book — which is PERFECT for the witchcraft/ritual audience.

**SCOPE:** This is a V1 — simple, clean PDF of saved spells. Not a fancy designed book (that's V2).

## Step 1: Backend — PDF generation endpoint

### File: `backend/server.py`

**Add** this new endpoint. Find the grimoire endpoints section (search for `/api/grimoire/`) and add this endpoint after the existing grimoire routes:

```python
@api_router.get('/grimoire/export/pdf')
async def export_grimoire_pdf(user = Depends(get_current_user)):
    """Export user's saved grimoire spells as a PDF."""
    from io import BytesIO

    try:
        from reportlab.lib.pagesizes import letter
        from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
        from reportlab.lib.colors import HexColor
        from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak
        from reportlab.lib.units import inch
    except ImportError:
        raise HTTPException(status_code=500, detail='PDF generation not available. Install reportlab: pip install reportlab')

    # Fetch user's saved spells
    user_data = await db.users.find_one({'id': user['id']}, {'saved_spells': 1})
    if not user_data or not user_data.get('saved_spells'):
        raise HTTPException(status_code=404, detail='No saved spells found')

    saved_spells = user_data['saved_spells']

    # Create PDF
    buffer = BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        topMargin=1*inch,
        bottomMargin=1*inch,
        leftMargin=1.2*inch,
        rightMargin=1.2*inch
    )

    # Styles
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        'GrimoireTitle',
        parent=styles['Title'],
        fontName='Times-Bold',
        fontSize=28,
        spaceAfter=30,
        textColor=HexColor('#0a1628'),
        alignment=1  # Center
    )
    spell_title_style = ParagraphStyle(
        'SpellTitle',
        parent=styles['Heading1'],
        fontName='Times-Bold',
        fontSize=18,
        spaceBefore=20,
        spaceAfter=12,
        textColor=HexColor('#8b2232')
    )
    guide_style = ParagraphStyle(
        'GuideName',
        parent=styles['Normal'],
        fontName='Times-Italic',
        fontSize=11,
        spaceAfter=16,
        textColor=HexColor('#C8A44D')
    )
    body_style = ParagraphStyle(
        'SpellBody',
        parent=styles['Normal'],
        fontName='Times-Roman',
        fontSize=11,
        leading=16,
        spaceAfter=8,
        textColor=HexColor('#1a1a1a')
    )
    divider_style = ParagraphStyle(
        'Divider',
        parent=styles['Normal'],
        fontName='Times-Roman',
        fontSize=11,
        alignment=1,
        spaceBefore=20,
        spaceAfter=20,
        textColor=HexColor('#C8A44D')
    )

    story = []

    # Title page
    story.append(Spacer(1, 2*inch))
    story.append(Paragraph("My Grimoire", title_style))
    story.append(Spacer(1, 0.5*inch))
    story.append(Paragraph("Where The Crowlands", ParagraphStyle(
        'Subtitle', parent=styles['Normal'], fontName='Times-Italic',
        fontSize=14, alignment=1, textColor=HexColor('#C8A44D')
    )))
    story.append(PageBreak())

    # Each spell
    for i, spell_data in enumerate(saved_spells):
        spell = spell_data if isinstance(spell_data, dict) else {}
        spell_content = spell.get('spell', spell)

        # Title
        title = spell_content.get('title', spell.get('title', f'Working {i+1}'))
        story.append(Paragraph(title, spell_title_style))

        # Guide info
        guide_name = spell.get('persona_name', spell.get('archetype', {}).get('name', ''))
        if guide_name:
            story.append(Paragraph(f"Guided by {guide_name}", guide_style))

        # Blocks
        blocks = spell_content.get('blocks', [])
        if isinstance(blocks, list):
            for block in blocks:
                if isinstance(block, dict):
                    content = block.get('content', '')
                    if isinstance(content, dict):
                        # Extract text from structured content
                        text_parts = []
                        for key, val in content.items():
                            if isinstance(val, str) and val.strip():
                                text_parts.append(val)
                            elif isinstance(val, list):
                                for item in val:
                                    if isinstance(item, str):
                                        text_parts.append(f"  - {item}")
                                    elif isinstance(item, dict):
                                        step_text = item.get('text', item.get('instruction', str(item)))
                                        text_parts.append(f"  - {step_text}")
                        content = '\n'.join(text_parts)

                    if content and isinstance(content, str):
                        # Clean HTML-unsafe characters
                        clean = content.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
                        for paragraph in clean.split('\n'):
                            if paragraph.strip():
                                story.append(Paragraph(paragraph.strip(), body_style))

        # Divider between spells
        if i < len(saved_spells) - 1:
            story.append(Paragraph("~ ~ ~", divider_style))
            story.append(PageBreak())

    doc.build(story)
    buffer.seek(0)

    from fastapi.responses import StreamingResponse
    return StreamingResponse(
        buffer,
        media_type='application/pdf',
        headers={'Content-Disposition': 'attachment; filename="my-grimoire.pdf"'}
    )
```

### Install dependency:

```bash
pip install reportlab
```

## Step 2: Frontend — Add export button to Grimoire page

### File: `frontend/src/components/GrimoirePage.js`

**Find** the grimoire header area (where the "My Grimoire" title is displayed). Add an export button near it. Look for the main heading and add after it:

```javascript
{/* PDF Export Button */}
<button
  onClick={async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/grimoire/export/pdf`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Export failed');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'my-grimoire.pdf';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('PDF export error:', err);
      toast.error('Could not export grimoire. Please try again.');
    }
  }}
  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gold/30 text-gold hover:bg-gold/10 transition-colors font-montserrat text-sm"
>
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
  Export as PDF
</button>
```

---

# FEATURE 3: Admin Stats Dashboard (Simple)

**WHY THIS MATTERS:** We need basic visibility into how the app is being used — how many spells are generated, which guides are popular, what categories users choose, and whether the AI pipeline is healthy.

**SCOPE:** A simple `/admin` page behind auth. NOT a full CMS.

## Step 1: Backend — Stats endpoint

### File: `backend/server.py`

**Add** this endpoint near the other admin/stats routes:

```python
@api_router.get('/admin/stats')
async def get_admin_stats(user = Depends(get_current_user)):
    """Basic admin stats dashboard data."""
    # Simple admin check - you can make this more robust later
    admin_emails = ['sub_test@test.com']  # Add your actual admin email
    user_data = await db.users.find_one({'id': user['id']}, {'email': 1})
    if not user_data or user_data.get('email') not in admin_emails:
        raise HTTPException(status_code=403, detail='Admin access required')

    from datetime import timedelta
    now = datetime.now(timezone.utc)
    last_24h = now - timedelta(hours=24)
    last_7d = now - timedelta(days=7)

    # Total users
    total_users = await db.users.count_documents({})

    # Spell generation stats
    total_spells = await db.spell_jobs.count_documents({'status': 'complete'})
    spells_24h = await db.spell_jobs.count_documents({
        'status': 'complete',
        'completed_at': {'$gte': last_24h}
    })
    spells_7d = await db.spell_jobs.count_documents({
        'status': 'complete',
        'completed_at': {'$gte': last_7d}
    })
    failed_24h = await db.spell_jobs.count_documents({
        'status': 'failed',
        'updated_at': {'$gte': last_24h}
    })

    # Guide popularity (last 7 days)
    guide_pipeline = [
        {'$match': {'status': 'complete', 'completed_at': {'$gte': last_7d}}},
        {'$group': {'_id': '$persona_id', 'count': {'$sum': 1}}},
        {'$sort': {'count': -1}}
    ]
    guide_stats = await db.spell_jobs.aggregate(guide_pipeline).to_list(length=10)

    # Average generation time (last 24h)
    time_pipeline = [
        {'$match': {'status': 'complete', 'completed_at': {'$gte': last_24h}, 'generation_time_ms': {'$exists': True}}},
        {'$group': {'_id': None, 'avg_ms': {'$avg': '$generation_time_ms'}, 'max_ms': {'$max': '$generation_time_ms'}, 'min_ms': {'$min': '$generation_time_ms'}}}
    ]
    time_stats = await db.spell_jobs.aggregate(time_pipeline).to_list(length=1)
    avg_time = time_stats[0] if time_stats else {'avg_ms': 0, 'max_ms': 0, 'min_ms': 0}

    return {
        'users': {
            'total': total_users
        },
        'spells': {
            'total': total_spells,
            'last_24h': spells_24h,
            'last_7d': spells_7d,
            'failed_24h': failed_24h
        },
        'guides': {g['_id']: g['count'] for g in guide_stats if g['_id']},
        'performance': {
            'avg_generation_ms': int(avg_time.get('avg_ms', 0)),
            'max_generation_ms': int(avg_time.get('max_ms', 0)),
            'min_generation_ms': int(avg_time.get('min_ms', 0))
        }
    }
```

## Step 2: Frontend — Simple admin page

### Create new file: `frontend/src/pages/Admin.js`

```javascript
import React, { useState, useEffect } from 'react';
import { DarkSection, LightOrnateCard, OrnateHeader } from '../components/OrnateElements';

const GUIDE_NAMES = {
  shigg: 'Shigg',
  cathleen: 'Cathleen',
  katherine: 'Katherine',
  theresa: 'Theresa',
  brenda: 'Brenda'
};

export default function Admin() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/admin/stats`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) {
          if (response.status === 403) throw new Error('Admin access required');
          throw new Error('Failed to load stats');
        }
        setStats(await response.json());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return (
    <DarkSection className="min-h-screen flex items-center justify-center">
      <p className="text-cream/60 font-montserrat">Loading stats...</p>
    </DarkSection>
  );

  if (error) return (
    <DarkSection className="min-h-screen flex items-center justify-center">
      <p className="text-crimson font-montserrat">{error}</p>
    </DarkSection>
  );

  return (
    <DarkSection className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <OrnateHeader level={1} className="text-center mb-10">Admin Dashboard</OrnateHeader>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Users" value={stats.users.total} />
          <StatCard label="Total Spells" value={stats.spells.total} />
          <StatCard label="Spells (24h)" value={stats.spells.last_24h} />
          <StatCard label="Failed (24h)" value={stats.spells.failed_24h} color="crimson" />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <LightOrnateCard className="p-6">
            <h3 className="font-cinzel text-lg text-navy-dark mb-4">Guide Popularity (7 days)</h3>
            {Object.entries(stats.guides).map(([id, count]) => (
              <div key={id} className="flex justify-between items-center py-2 border-b border-navy-dark/10 last:border-0">
                <span className="font-crimson-text text-navy-dark">{GUIDE_NAMES[id] || id}</span>
                <span className="font-montserrat text-sm text-navy-dark/70">{count} spells</span>
              </div>
            ))}
            {Object.keys(stats.guides).length === 0 && (
              <p className="text-navy-dark/50 font-crimson-text italic">No spells in the last 7 days</p>
            )}
          </LightOrnateCard>

          <LightOrnateCard className="p-6">
            <h3 className="font-cinzel text-lg text-navy-dark mb-4">Pipeline Performance (24h)</h3>
            <div className="space-y-3">
              <PerfRow label="Average" ms={stats.performance.avg_generation_ms} />
              <PerfRow label="Fastest" ms={stats.performance.min_generation_ms} />
              <PerfRow label="Slowest" ms={stats.performance.max_generation_ms} />
            </div>
          </LightOrnateCard>
        </div>
      </div>
    </DarkSection>
  );
}

function StatCard({ label, value, color = 'gold' }) {
  return (
    <div className="bg-navy-dark/50 rounded-lg p-4 border border-gold/20 text-center">
      <p className={`font-cinzel text-2xl ${color === 'crimson' ? 'text-crimson' : 'text-gold'}`}>{value}</p>
      <p className="font-montserrat text-xs text-cream/50 uppercase tracking-wider mt-1">{label}</p>
    </div>
  );
}

function PerfRow({ label, ms }) {
  const seconds = (ms / 1000).toFixed(1);
  return (
    <div className="flex justify-between items-center">
      <span className="font-crimson-text text-navy-dark">{label}</span>
      <span className="font-montserrat text-sm text-navy-dark/70">{seconds}s</span>
    </div>
  );
}
```

### Add the route — File: `frontend/src/App.js` (or wherever routes are defined)

Find the route definitions and add:

```javascript
import Admin from './pages/Admin';
// ... in the router:
<Route path="/admin" element={<Admin />} />
```

---

# VERIFICATION CHECKLIST

After implementing everything above:

## 1. Rebuild and restart
```bash
cd /app/frontend && npm run build
sudo supervisorctl restart backend
sudo supervisorctl status
# Should show: backend RUNNING
```

## 2. Test Stage Progress Indicator
1. Open the site and start generating a spell
2. During the loading screen, you should see:
   - Guide avatar and name (already working)
   - Stage dots: `[*] --- [ ] --- [ ] --- [ ]` with labels Research / Plan / Write / Polish
   - The active dot should pulse gold
   - Stage message should update: "Researching traditions..." → "Planning your working..." → "Writing in Shigg's voice..." → "Final review..."
3. The dots should progress as the backend moves through stages
4. When complete, the spell should appear as before

## 3. Test PDF Export
1. Save at least one spell to your Grimoire
2. Go to My Grimoire
3. Click "Export as PDF"
4. A PDF should download with your spells formatted cleanly

## 4. Test Admin Dashboard
1. Log in as `sub_test@test.com`
2. Navigate to `/admin`
3. Should see: total users, total spells, 24h stats, guide popularity, performance metrics

## 5. Test Guide-Specific Blocks
1. Generate a spell as Shigg — look for bird oracle or kitchen imagery
2. Generate a spell as Cathleen — look for song prompts or chanting instructions
3. Generate a spell as Katherine — look for evidence cards or case notes
4. These are writer-dependent — the planner decides which blocks to include. If they don't appear on first try, generate again with an intention that matches (e.g., "I need protection" for Cathleen's song prompt)

---

# DEPLOYMENT REMINDER

**After implementing ALL fixes and features above:**

1. Merge your working branch into `main`:
   ```bash
   cd /app
   git add -A && git commit -m "Stage progress indicator, PDF export, admin dashboard, guide-specific blocks"
   git checkout main
   git merge Emergent-New-Changes
   ```

2. Rebuild frontend:
   ```bash
   cd /app/frontend && npm run build
   ```

3. Restart backend:
   ```bash
   sudo supervisorctl restart backend
   ```

4. **Verify the live site is running the new code:**
   ```bash
   sudo supervisorctl status
   tail -20 /var/log/supervisor/backend.err.log
   ```
   - Visit the live site
   - Generate a spell — confirm stage progress dots appear during loading
   - Check the Grimoire — confirm PDF export button appears

**THIS IS CRITICAL. Every round we've had the issue where code exists in the branch but the live site is running old code. Please confirm the merge + rebuild happens before reporting the work as done.**

---

**END OF DOCUMENT**
