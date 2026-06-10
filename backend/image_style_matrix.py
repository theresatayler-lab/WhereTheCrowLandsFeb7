# Image Style Matrix - Artist references and category modifiers
# for visually unique spell images across all 5 guides
#
# Architecture:
#   Guide visual_dna (persona_config.py)
#     + Artist style reference (this file, selected by emotional register)
#     + Working category modifier (this file, detected from spell intent)
#     + Spell visual tokens (spell_prompts.py, extracted from spell content)
#     = Unique image prompt per spell
#
# The matrix: 5 guides x 3 registers x 10 categories = 150 style combinations
# Plus spell-specific tokens make each individual image unique within a combination.

from typing import Optional


# =============================================================================
# ARTIST STYLE REFERENCES - Per guide, per emotional register
# =============================================================================
# Each guide has 3 artist "modes" that shift the visual tone:
#   gentle  = soft, warm, contemplative (comfort/healing/grief workings)
#   practical = grounded, clear, structured (protection/daily/clarity workings)
#   intense = dark, powerful, transformative (shadow/truth/breaking workings)

GUIDE_ARTIST_STYLES = {
    "shigg": {
        "gentle": {
            "artist": "Arthur Rackham",
            "style_tokens": "enchanted domestic watercolor, soft pen-and-ink detail, fairy-tale warmth, dappled light through windows, cozy interior glow",
            "palette_shift": "warm amber wash, soft cream, tea-stain brown, gentle dove grey",
        },
        "practical": {
            "artist": "Cicely Mary Barker",
            "style_tokens": "precise botanical illustration, naturalist field guide detail, pressed-flower delicacy, hedge-witch herbal accuracy",
            "palette_shift": "sage green, parchment cream, ink black linework, muted burgundy accents",
        },
        "intense": {
            "artist": "Remedios Varo",
            "style_tokens": "surreal domestic mysticism, alchemical kitchen interior, impossible architecture, dream-logic still life, transformative domestic space",
            "palette_shift": "deep crow black, burnished gold, oxblood red, midnight navy undertones",
        },
    },
    "cathleen": {
        "gentle": {
            "artist": "Harry Clarke",
            "style_tokens": "Irish stained glass luminosity, jewel-toned devotional light, intricate Celtic line detail, candlelit warmth, sacred domestic space",
            "palette_shift": "warm amber candlelight, soft crimson, dove grey, muted rose gold",
        },
        "practical": {
            "artist": "John Duncan",
            "style_tokens": "Celtic Revival mythic realism, Pre-Raphaelite boldness, warrior-saint iconography, standing stone ceremony, fierce protective energy",
            "palette_shift": "deep crimson, antique gold, midnight blue, warm bronze",
        },
        "intense": {
            "artist": "Alphonse Mucha",
            "style_tokens": "Art Nouveau dark ceremonial, circular halo compositions, flowing dramatic drapery, Morrigan triple-aspect power, sovereign female authority",
            "palette_shift": "oxblood burgundy, burnished gold, raven black, ember orange accents",
        },
    },
    "katherine": {
        "gentle": {
            "artist": "Aubrey Beardsley",
            "style_tokens": "high-contrast black and white precision, Victorian pen-and-ink elegance, ornate border detail, measured restraint, quiet analytical beauty",
            "palette_shift": "cool silver, soft steel grey, aged parchment, faded ink wash",
        },
        "practical": {
            "artist": "Austin Osman Spare",
            "style_tokens": "ceremonial magic illustration, precise sigil construction, occult diagram accuracy, Thelemic craftsmanship, ritual tool still life",
            "palette_shift": "steel grey, oxblood burgundy, midnight navy, crisp white highlights",
        },
        "intense": {
            "artist": "Hilma af Klint",
            "style_tokens": "abstract spiritual geometry, Golden Dawn diagrammatic vision, theosophical color theory, large-scale geometric revelation, hidden knowledge made visible",
            "palette_shift": "polished silver, blood red wax seal, deep navy, stark black contrast",
        },
    },
    "theresa": {
        "gentle": {
            "artist": "Joseph Cornell",
            "style_tokens": "shadow box assemblage, found object arrangement, layered memory collage, quiet archaeological discovery, museum vitrine intimacy",
            "palette_shift": "warm sepia, aged manila, faded photograph tones, soft rust",
        },
        "practical": {
            "artist": "Hannah Hoch",
            "style_tokens": "photomontage investigation, documentary cut-and-paste, evidence wall arrangement, analytical layering, revealed connections",
            "palette_shift": "slate grey, cream, copper accent, dark teal",
        },
        "intense": {
            "artist": "Max Ernst",
            "style_tokens": "surreal investigative collage, fever-dream evidence board, impossible photograph layering, truth erupting through surface, pattern-breaking revelation",
            "palette_shift": "deep crimson, midnight blue, antique gold, charcoal black",
        },
    },
    "brenda": {
        "gentle": {
            "artist": "Norman Rockwell",
            "style_tokens": "warm family narrative illustration, domestic storytelling warmth, golden afternoon light, kitchen table intimacy, multi-generational gathering, darker richer palette than typical",
            "palette_shift": "warm sepia, cream, soft rose, aged ivory paper",
        },
        "practical": {
            "artist": "Dorothea Lange",
            "style_tokens": "illustrated documentary family portrait, memory weight and dignity, hands holding inherited objects, weathered domestic surfaces, unflinching tenderness",
            "palette_shift": "ink black, manila envelope, copper accent, sage green",
        },
        "intense": {
            "artist": "Leonora Carrington",
            "style_tokens": "surreal ancestral mythology, family as mythic creatures, crow-women at feast tables, inherited magic made visible, generational power erupting through domesticity",
            "palette_shift": "deep burgundy, midnight blue, antique gold, shadow grey",
        },
    },
}


# =============================================================================
# WORKING CATEGORY MODIFIERS - Visual tone shifts by spell intent
# =============================================================================
# These layer on top of the guide+artist combination to further differentiate.
# Detected from spell content via extract_spell_visual_tokens().

WORKING_CATEGORY_MODIFIERS = {
    "protection": {
        "composition": "enclosing, concentric, warding geometry",
        "motif_emphasis": "shields, sealed doors, thorned borders, iron nails, salt circles",
        "mood": "vigilant strength, quiet authority, impenetrable stillness",
        "light": "steady flame against darkness, lantern clarity",
    },
    "healing": {
        "composition": "opening, unfolding, vessel-like receptivity",
        "motif_emphasis": "pouring water, mending hands, root systems, herb bundles, sunrise",
        "mood": "tender restoration, patient gathering, slow warmth returning",
        "light": "soft dawn light, filtered through curtains, golden hour",
    },
    "clarity": {
        "composition": "sharp focus, central revelation, parting veils",
        "motif_emphasis": "mirrors, lenses, clear water, open eyes, compass needles",
        "mood": "sudden knowing, fog lifting, pattern recognition",
        "light": "bright direct beam, magnifying glass focus, crystal clarity",
    },
    "love": {
        "composition": "paired symmetry, mirrored elements, intertwined forms",
        "motif_emphasis": "connected hearts, braided cord, twin flames, woven threads",
        "mood": "magnetic pull, quiet devotion, recognition across distance",
        "light": "warm candlelight, hearthglow, intimate ember",
    },
    "prosperity": {
        "composition": "overflowing abundance, upward growth, expansion",
        "motif_emphasis": "full vessels, harvest imagery, sprouting seeds, golden coins",
        "mood": "generous overflow, fertile potential, momentum building",
        "light": "rich golden light, autumn afternoon, treasure glow",
    },
    "release": {
        "composition": "upward movement, dissolving edges, smoke rising",
        "motif_emphasis": "rising smoke, open hands, broken chains, scattered ashes",
        "mood": "deliberate surrender, weight lifting, exhale after holding",
        "light": "fading twilight, smoke-diffused, edges dissolving into darkness",
    },
    "binding": {
        "composition": "knotted center, tight geometry, locked symmetry",
        "motif_emphasis": "knotwork, sealed envelopes, iron locks, wax seals, bound cord",
        "mood": "deliberate containment, purposeful restriction, careful sealing",
        "light": "focused spotlight on knot, dark surround, wax-seal warmth",
    },
    "transformation": {
        "composition": "spiral motion, before/after duality, chrysalis form",
        "motif_emphasis": "metamorphosis imagery, moth/butterfly, snake shedding, phoenix ash",
        "mood": "tension of becoming, threshold energy, controlled breaking",
        "light": "transitional light, eclipse edge, dusk-to-dawn gradient",
    },
    "divination": {
        "composition": "circular scrying frame, reflective surfaces, downward gaze",
        "motif_emphasis": "crystal spheres, still pools, card layouts, tea leaves, bone casting",
        "mood": "receptive stillness, listening for pattern, something approaching",
        "light": "low candlelight reflected in water, moonlight on surface",
    },
    "ancestors": {
        "composition": "layered depth, time-stacked imagery, genealogical branching",
        "motif_emphasis": "family trees, layered photographs, inherited objects, gravestone rubbings",
        "mood": "reverent remembering, lineage weight, connection across time",
        "light": "sepia-toned, amber lamplight on old surfaces, photograph flash",
    },
}


# =============================================================================
# REGISTER DETECTION - Map spell intent to emotional register
# =============================================================================
# Links the detected intent (from extract_spell_visual_tokens) to the
# artist style register (gentle/practical/intense).

INTENT_TO_REGISTER = {
    # Gentle (comfort, softness, healing)
    "healing": "gentle",
    "love": "gentle",
    "ancestors": "gentle",

    # Practical (structured, clear, daily)
    "protection": "practical",
    "clarity": "practical",
    "prosperity": "practical",
    "divination": "practical",

    # Intense (shadow, transformation, power)
    "release": "intense",
    "binding": "intense",
    "transformation": "intense",
}


def get_artist_style(guide_id: str, detected_intent: str) -> dict:
    """
    Get the artist style reference for a guide + spell intent combination.
    Returns dict with artist, style_tokens, palette_shift.
    """
    # Normalize guide ID
    guide_map = {"shiggy": "shigg", "kathleen": "cathleen", "catherine": "katherine"}
    guide_id = guide_map.get(guide_id, guide_id)

    register = INTENT_TO_REGISTER.get(detected_intent, "practical")
    guide_styles = GUIDE_ARTIST_STYLES.get(guide_id, GUIDE_ARTIST_STYLES["shigg"])
    return guide_styles.get(register, guide_styles["practical"])


def get_category_modifier(detected_intent: str) -> dict:
    """
    Get the working category visual modifier for a detected intent.
    Returns dict with composition, motif_emphasis, mood, light.
    """
    return WORKING_CATEGORY_MODIFIERS.get(
        detected_intent,
        WORKING_CATEGORY_MODIFIERS["protection"]
    )


def build_style_layer(guide_id: str, detected_intent: str) -> str:
    """
    Build the artist style + category modifier prompt layer.
    This gets inserted into build_image_prompt() between the art bible
    and the asset-specific prompt.

    Returns a prompt fragment like:
      "in the style of Arthur Rackham, enchanted domestic watercolor, soft pen-and-ink detail,
       warm amber wash, composition: enclosing warding geometry, mood: vigilant strength"
    """
    artist = get_artist_style(guide_id, detected_intent)
    category = get_category_modifier(detected_intent)

    return (
        f"in the style of {artist['artist']}, {artist['style_tokens']}, "
        f"{artist['palette_shift']}, "
        f"composition: {category['composition']}, "
        f"motif emphasis: {category['motif_emphasis']}, "
        f"mood: {category['mood']}, "
        f"lighting: {category['light']}"
    )


# =============================================================================
# QUICK SPELL VISUAL SYSTEM - Pre-made aesthetic for fast spells
# =============================================================================
# Quick spells skip AI image generation but still need to look beautiful.
# Each guide gets a set of pre-defined visual treatments using CSS/static assets.

QUICK_SPELL_VISUALS = {
    "shigg": {
        "page_gradient": "linear-gradient(135deg, #2a1f0e 0%, #1a1408 50%, #0C1D2E 100%)",
        "accent_border": "1px solid rgba(200, 164, 77, 0.3)",
        "card_bg": "#F3EFE8",
        "header_pattern": "radial-gradient(circle at 30% 40%, rgba(200, 164, 77, 0.08) 0%, transparent 60%)",
        "tarot_placeholder_icon": "bird",
        "tarot_placeholder_bg": "linear-gradient(180deg, #1a1408 0%, #2a1f0e 100%)",
        "divider_style": "ornate_botanical",
    },
    "cathleen": {
        "page_gradient": "linear-gradient(135deg, #2d0a14 0%, #1a0810 50%, #0C1D2E 100%)",
        "accent_border": "1px solid rgba(139, 34, 50, 0.3)",
        "card_bg": "#F3EFE8",
        "header_pattern": "radial-gradient(circle at 70% 30%, rgba(139, 34, 50, 0.08) 0%, transparent 60%)",
        "tarot_placeholder_icon": "moon",
        "tarot_placeholder_bg": "linear-gradient(180deg, #1a0810 0%, #2d0a14 100%)",
        "divider_style": "ornate_celtic",
    },
    "katherine": {
        "page_gradient": "linear-gradient(135deg, #0e1a2a 0%, #0a1220 50%, #0C1D2E 100%)",
        "accent_border": "1px solid rgba(168, 152, 114, 0.3)",
        "card_bg": "#F3EFE8",
        "header_pattern": "radial-gradient(circle at 50% 50%, rgba(168, 152, 114, 0.06) 0%, transparent 50%)",
        "tarot_placeholder_icon": "compass",
        "tarot_placeholder_bg": "linear-gradient(180deg, #0a1220 0%, #0e1a2a 100%)",
        "divider_style": "ornate_geometric",
    },
    "theresa": {
        "page_gradient": "linear-gradient(135deg, #1a1008 0%, #140e06 50%, #0C1D2E 100%)",
        "accent_border": "1px solid rgba(180, 100, 60, 0.3)",
        "card_bg": "#F3EFE8",
        "header_pattern": "radial-gradient(circle at 40% 60%, rgba(180, 100, 60, 0.06) 0%, transparent 60%)",
        "tarot_placeholder_icon": "magnifyingGlass",
        "tarot_placeholder_bg": "linear-gradient(180deg, #140e06 0%, #1a1008 100%)",
        "divider_style": "ornate_investigative",
    },
    "brenda": {
        "page_gradient": "linear-gradient(135deg, #1a1218 0%, #140e14 50%, #0C1D2E 100%)",
        "accent_border": "1px solid rgba(200, 164, 77, 0.25)",
        "card_bg": "#F3EFE8",
        "header_pattern": "radial-gradient(circle at 60% 40%, rgba(200, 164, 77, 0.06) 0%, transparent 60%)",
        "tarot_placeholder_icon": "letter",
        "tarot_placeholder_bg": "linear-gradient(180deg, #140e14 0%, #1a1218 100%)",
        "divider_style": "ornate_botanical",
    },
}


def get_quick_spell_visuals(guide_id: str) -> dict:
    """Get the pre-made visual config for Quick tier spells."""
    guide_map = {"shiggy": "shigg", "kathleen": "cathleen", "catherine": "katherine"}
    guide_id = guide_map.get(guide_id, guide_id)
    return QUICK_SPELL_VISUALS.get(guide_id, QUICK_SPELL_VISUALS["shigg"])
