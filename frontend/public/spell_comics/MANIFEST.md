# SpellComics Manifest — Generation Loading Screen Rotation

*Curated from `design_assets/inbox/ImagesCrowsland/SpellComics/` (58 source files → 47 kept).*
*Use: cycle beneath the RESEARCH / PLAN / WRITE / POLISH stepper while a working generates.*
*Stills: WebP, ≤1600px, 9 MB total. Videos: muted H.264 1280px, 52 MB total (avg ~3 MB, longest 6.3 MB).*

**Nothing here is wired into the UI yet — approve assignments first.**
Naming: `scNN` = source file `NNSpellComics.*`.

## Guide-assigned (show when that guide is generating)

### Cathleen
| File | Type | Content |
|---|---|---|
| sc37 | still | "ANCHORS — Narrated by Cathleen" instructional page |
| sc55 | video | Anchors page, animated |
| sc31, sc32, sc49, sc50 | stills | Moor crone, fire and crow, "the more truth you give, the stronger the working" |
| sc51, sc52, sc53 | videos | Moor crone / fire / crow sequence |
| sc43 | video | "Adding salt is half the working" moor page |

### Shigg
| File | Type | Content |
|---|---|---|
| sc34, sc35, sc36, sc40 | stills | Hearth kitchen, cauldron, protection bowl (sepia) |
| sc26 | still | Whimsical fairy-and-ship panels |

### Katherine
| File | Type | Content |
|---|---|---|
| sc33 | still | Eight working-categories wheel, teacher with pointer |
| sc41, sc56 | videos | Categories wheel pages, animated |
| sc17 | still | Dark fantasy hooded-figures panels |

### Theresa
| File | Type | Content |
|---|---|---|
| sc07, sc11 | stills | WW2 postcard / London Row mystery pages (best 2 of 6 variants) |
| sc14 | still | "The letter said to come at the solstice… but who sent it!" train platform |
| sc19 | still | Noir investigation panels |
| sc16 | still | Observatory scene |
| sc12 | video | Street scene, woman reading papers |

### Brenda
| File | Type | Content |
|---|---|---|
| sc02 | video | Family group with crows, ancestral energy (19s — longest clip) |
| sc21 | still | Woman at typewriter in thorn wreath |
| sc30 | video | 1940s typewriter clip (4s — nice for WRITE stage) |
| sc24 | still | Crow, crystal ball, girl panels |
| sc27, sc28 | stills | Praying women / rural family scenes |

## Shared rotation (any guide)
| File | Type | Content |
|---|---|---|
| sc29 | still | Apothecary shelf instructional page |
| sc47, sc48 | stills | 1940s protection-ward bowl pages |
| sc54, sc57, sc58 | videos | Ward-bowl pages, animated |
| sc45, sc46 | videos | "Stop now — pick your guide" pages |
| sc15, sc18, sc20, sc22, sc25 | stills | Atmospheric: bridge with starlings, church ruins, light-bearer on cliff, castle stairs, cosmic panels |
| sc23 | still | Color fantasy forest panels (only color piece — use sparingly) |
| sc04, sc38 | videos | Illustrated portrait vignettes with wreath framing |

## Rejected (11)
sc01 (war/parachute scene — off-tone, no spell content) · sc05, sc06, sc08, sc09, sc10 (near-duplicate variants of the sc07 page) · v03 (duplicate of sc02) · v13 (white-background modern portrait) · v39 (rooftop selfie, 55 MB, weakest concept) · v42 (duplicate of sc41) · v44 (duplicate of sc43)

## Implementation notes (for the wiring pass, after approval)
- Serve from `frontend/public/spell_comics/` (not bundled); lazy-load only on the generation screen.
- Rotation: crossfade ~8s per still; videos play once through, muted, then advance. Pull from active guide's pool first, then shared.
- Stage matching is optional polish: sc30 (typewriter) suits WRITE; sc45/46 suit the pre-generation moment.
- Text-heavy pages (sc33, sc37, sc29) need ≥700px display width to stay readable — keep the container generous or zoom-crop on mobile.
- `design_assets/processed/` is gitignored alongside `inbox/`; assets enter the repo only when wired into `frontend/public/`.
