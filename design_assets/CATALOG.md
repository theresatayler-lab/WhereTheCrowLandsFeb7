# Design Assets Catalog — Pack-Level Assessment

*Generated 2026-06-10 from `design_assets/inbox/ImagesCrowsland/` (11 packs, ~4,000 files, 15 GB).*
*Assessed against STYLE_BIBLE: navy `#0a1628` / vellum `#F3EFE8` surfaces, antique gold `#C8A44D` stroke-only, crimson `#8b2232`, engraved/archival tone.*

**The inbox folder is gitignored (15 GB — do not commit it).** Only processed, selected assets will move into `frontend/src/assets/` after the brief-driven curation pass.

---

## Tier 1 — Strong fit, use heavily

### Mystic symbols v2.0 (432 images + 289 vectors: SVG/EPS/AI)
Engraved occult symbols: all-seeing eyes, sunbursts, crescents/moon faces, pentacles, columns, ankh, ouroboros, winged orbs. Many already rendered **gold-on-dark** — drop-in ready for navy. Organized by motif subfolder.
- **Guide fit:** Katherine (geometric/astral, sigil work) primary; sunbursts/crescents are guide-neutral accents.
- **Uses:** working-category icons, sigil-adjacent decoration, timeline event icons, premium spell ornament.
- **Processing:** minimal — the gold variants are usable as-is; SVGs recolorable to exact `#C8A44D`.

### Vintage-celestial-in-engraving-style (250 images + 26 vectors)
Zodiac figures, sun/moon faces with engraved shading, gold starburst linework on transparency, scroll banners, constellation cards. Sepia/gold palette sits beautifully on navy.
- **Guide fit:** Katherine primary; sun/moon faces also suit lore vignettes for all guides.
- **Uses:** headers/heroes, tarot-card adjacent art, scroll banners for titles, premium decoration.
- **Caution:** a few painterly AI-look figure pieces (e.g., nude Sagittarius) — taste call, flag at file level.

### Witches (800 images + 66 vectors — heavy duplication across 4 subfolders)
Historical witch-trial woodcuts in broadside style (familiar spirits, trials, devils, village scenes) plus cipher-text pages. This is *documented-history* imagery — exactly the brand's "historically grounded" register.
- **Guide fit:** guide-neutral; strongest match is the **Timeline** (94 historical events) and lore_vignette blocks.
- **Uses:** timeline event illustrations, lore vignettes, Invisible Helpers portal.
- **Processing:** dedupe first (folders "Witches-Wizards 2" and "-DUPLICATE"); black-on-white → alpha-key + recolor for navy, or use on vellum cards as-is.

### Ornaments — Vol05 (69 images + AI/EPS vectors)
Classic engraved ornament linework: borders, oval frames, corner pieces, Art Nouveau botanical curls, plus a grunge-paper texture.
- **Guide fit:** guide-neutral structural kit — recolor per guide accent.
- **Uses:** **section dividers, corner ornaments, frames** — the exact gaps in OrnateElements.js (Brenda has no border assets).
- **Processing:** black linework is invisible on navy — must recolor to gold/guide accents. Vector sources make this clean.

### StanStoreCrowlands (9 images)
Existing brand kit: Crowlands crest logo (3 colorways), gold ouroboros, gold key, swallow, open book, feather, notebook & pen.
- **Guide fit:** direct anchor matches — notebook/pen + key → **Theresa**; feather + book → **Brenda**; swallow → Shigg.
- **Uses:** guide anchor icons, brand marks.
- **Processing:** white-background pieces need alpha-keying; gold pieces drop in as-is.

### CrowsLogo (7 images)
Crow seal/stamp marks (crow + pentacle medallions, engraved circular seals) and "Where The Crowlands" illustrated crest in sepia/pink/white variants.
- **Uses:** site identity, grimoire seal/stamp motifs, watermarks, loading states.
- **Processing:** alpha-key the white-background seals.

### SpellComics (35 stills + 22 videos, 765 MB) — *has an assigned use*
Vintage comic-book panels: guide-narrated instructional pages ("Anchors — Narrated by Cathleen", protection wards, the eight working categories), mid-century illustrated characters, color fantasy panels, atmospheric tor/landscape footage. B&W/sepia comic style sits well with the archival brand.
- **Assigned use (per Theresa):** cycle as entertainment in the spell-generation loading screen, under the RESEARCH / PLAN / WRITE / POLISH stepper.
- **Implementation notes:**
  - Videos run up to 50 MB each — must be compressed (720p H.264/WebM, target 2–4 MB, muted autoplay loop) before shipping; 765 MB cannot be bundled into the frontend. Serve from `public/` or a CDN, lazy-loaded only on the generation screen.
  - Guide-specific panels (Cathleen-narrated, etc.) should be matched to the active guide; guide-neutral panels go in the shared rotation.
  - Text-heavy panels need a minimum display width to stay readable — curate per panel.
  - Suggest stills-first rollout (simple crossfade cycle), videos as a phase 2.

---

## Tier 2 — Partial fit, use selectively

### Vintage-Occult-Illustration-Pack (119 images + 119 vectors)
Renaissance emblem-book engravings: crowned swords, skeletons, sun-in-ouroboros, heraldic beasts, monograms. Authentic and atmospheric.
- **Guide fit:** Katherine (evidence cards, shadow work); lore vignettes generally.
- **Caution:** dense black linework vanishes on navy (visible in the contact sheet) — these only work recolored or on vellum surfaces. Skeleton/memento-mori pieces should be used sparingly to stay "reverent, not horror."

### Vintage-Dark-Academia-Bundle (130 images + 107 vectors)
Tattoo-flash style icons: weeping eyes, stars, skulls, deer-and-sword, keys, swallows, repeat patterns, with **red accents** close to the crimson token.
- **Guide fit:** Theresa (eyes, keys, investigation motifs); patterns as endpaper/texture.
- **Caution:** flash-art style is bolder/flatter than the engraved house style — accent use only, not structural. Skull-heavy pieces off-tone for Shigg/Brenda. Check red against `#8b2232` at file level.

### midjourney_session (670 images + 559 vectors — mixed quality)
AI-generated pieces echoing the other packs: woodcut landscapes with crows, star/skull icons, book stacks, monograms, patterns. Some standouts (crow-over-landscape engraving), much filler.
- **Uses:** gap-filler after the purchased packs; needs file-level curation more than any other folder.

---

## Tier 3 — Mostly off-brand

### Lurid Echo. Eerie Collage Pack (311 images)
Photographic horror-collage: statue faces with cut eyes, ominous mirrors, spectral figures. Strong work, wrong register — photographic and unsettling where the brand is engraved and reverent.
- **Keep:** paper/texture subfolder (aged paper overlays), bare-branch silhouettes, bird-flock background — usable as atmospheric textures.
- **Reject:** figurative collage pieces (faces, bodies, mirrors) — clash with every guide's voice. If Katherine's shadow work ever needs photographic darkness, revisit deliberately.

### tmp_fb_cover.png (loose at inbox root)
Marketing artifact — not a UI asset. Ignore or move to a marketing folder.

---

## Cross-cutting notes

- **Vectors are the prize:** 765 SVG / 283 EPS / 111 AI files. SVGs can be batch-recolored to exact brand tokens and satisfy "gold is stroke-only" cleanly. Prefer the vector over the PNG wherever both exist.
- **The navy problem:** most black-linework packs disappear on `#0a1628`. Every structural asset needs either gold/accent recoloring or assignment to vellum surfaces. This is the main processing workload.
- **Guide coverage gaps:** Katherine is over-supplied; **Shigg** (domestic — kettles, tea, hearth) and **Cathleen** (Celtic knotwork, song/voice) have almost nothing pack-native. Recolored ornaments can cover structure, but motif-specific art for those two may need generating or buying.
- **Licenses:** only two license docs found (Lurid Echo ReadMe PDF, Ornaments "HTC Information.pdf"). Other packs shipped without docs — add a `LICENSES.txt` to `inbox/` noting where each pack was purchased so usage rights are traceable.

## Next step
File-level curation (select 3–5 per use per guide, background removal, recolor, `MANIFEST.md`) happens once the brief lands — the brief decides per-guide divider strategy, how the timeline uses the witch woodcuts, and whether flash-style accents are in or out.
