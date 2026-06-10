# Visual System Brief — Spell Pages & Asset Integration

*Decisions by Theresa, 2026-06-10. Companion docs: `design_assets/CATALOG.md` (pack assessments), `frontend/public/spell_comics/MANIFEST.md` (loading-screen rotation).*

## 1. Header image: framed plate
The generated header is NOT a hero banner or a background. Render it mid-size between the spell title and the first block, inside an ornate gold frame — like an engraving plate in an antique book. Frame should be stroke-gold (`#C8A44D`), sourced or adapted from the Ornaments Vol 05 / celestial pack frames (see CATALOG). Respect the one-atmospheric-image-per-page rule: the plate is that image.

## 2. Sigil: closing seal
The sigil appears once, at the end of the working — positioned like a wax seal after the closing block. Small-to-mid size, centered. It is the ritual's signature, not a mid-flow reveal. Premium tier: Ideogram sigil; standard: OpenAI.

## 3. Dividers: static per-guide
No generated dividers. Curate 3–5 ornaments per guide from the new packs (Ornaments Vol 05 + Mystic Symbols vectors), recolored to each guide's accent per the palette rules (Shigg amber, Cathleen teal, Katherine violet, Theresa/Brenda per persona_config). This fixes Brenda's missing border set. Black linework must be recolored — it is invisible on navy.

## 4. SpellComics loading rotation (already curated & shipped)
Assets live in `frontend/public/spell_comics/` with per-guide assignments in its MANIFEST.md. Build the crossfade rotation under the RESEARCH/PLAN/WRITE/POLISH stepper: active guide's pool first, then shared; stills ~8s crossfade, videos play once muted then advance; lazy-load only on the generation screen.

## Out of scope for now
Lurid Echo figurative pieces (off-brand), generated dividers, new motif art for Shigg/Cathleen gaps (revisit after this pass ships).
