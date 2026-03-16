# Connection Reference Fixes
# Maps broken event-to-event references to valid existing event IDs
# and defines valid movement labels for part_of_movement

# ============================================================================
# EVENT-TO-EVENT REMAPPINGS
# Maps: (event_id, field, broken_ref) -> replacement_ref or None (to remove)
# ============================================================================

EVENT_REF_FIXES = {
    # spr_founded
    ("spr_founded", "influenced", "fortune_inner_light"): "inner_light",

    # stella_matutina
    ("stella_matutina", "influenced_by", "hermetic_order_golden_dawn_foundation"): "gd_founding",
    ("stella_matutina", "influenced_by", "societas_rosicruciana_in_anglia"): "rosicrucian_revival",
    ("stella_matutina", "influenced", "dion_fortune_society_inner_light"): "inner_light",
    ("stella_matutina", "influenced", "israel_regardie_golden_dawn_publications"): "regardie_golden_dawn",
    ("stella_matutina", "related_events", "hermetic_order_golden_dawn_foundation"): "gd_founding",
    ("stella_matutina", "related_events", "alpha_et_omega_foundation"): "moina_mathers_leadership",

    # a_a_founding
    ("a_a_founding", "influenced_by", "golden_dawn_founding"): "gd_founding",
    ("a_a_founding", "influenced_by", "crowley_receives_book_of_the_law"): "crowley_book_of_law",
    ("a_a_founding", "influenced", "oto_crowley_leadership"): "crowley_oto_head",
    ("a_a_founding", "influenced", "california_thelema_spread"): "crowley_magick_theory_practice",

    # hermetic_texts
    ("hermetic_texts", "influenced_by", "byzantine_scholars"): None,  # No valid match, remove
    ("hermetic_texts", "influenced_by", "medieval_manuscripts"): None,  # No valid match, remove
    ("hermetic_texts", "influenced", "fama_fraternitatis"): "rosicrucian_revival",
    ("hermetic_texts", "influenced", "foundation_of_golden_dawn"): "gd_founding",
    ("hermetic_texts", "influenced", "hermetic_order_of_the_golden_dawn"): None,  # Duplicate of above

    # key_of_solomon
    ("key_of_solomon", "influenced_by", "medieval_grimoire_tradition"): "picatrix_translation",
    ("key_of_solomon", "influenced", "golden_dawn_rituals"): "gd_founding",
    ("key_of_solomon", "influenced", "aleister_crowley_works"): "crowley_magick_book",
    ("key_of_solomon", "influenced", "modern_ceremonial_magic"): "waite_ceremonial_magic",

    # hilma_af_klint_paintings
    ("hilma_af_klint_paintings", "influenced_by", "theosophical_society_founded"): "theosophy_social",
    ("hilma_af_klint_paintings", "influenced_by", "golden_dawn_founded"): "gd_founding",

    # suffrage_movement
    ("suffrage_movement", "influenced_by", "abolitionist_movement"): None,  # Pre-timeline scope
    ("suffrage_movement", "influenced_by", "second_great_awakening"): None,  # Pre-timeline scope
    ("suffrage_movement", "influenced", "wiccan_emergence"): "gardner_wicca",
    ("suffrage_movement", "influenced", "feminist_spirituality_movement"): "goddess_movement",
    ("suffrage_movement", "related_events", "spiritualist_movement"): "fox_sisters_hydesville",
    ("suffrage_movement", "related_events", "theosophical_society_founding"): "theosophy_social",

    # theosophy_social
    ("theosophy_social", "influenced_by", "spiritualism_movement"): "fox_sisters_hydesville",
    ("theosophy_social", "influenced_by", "eastern_philosophy_transmission"): None,  # Too abstract
    ("theosophy_social", "influenced", "hermetic_order_golden_dawn_founding"): "gd_founding",
    ("theosophy_social", "influenced", "aryan_theosophical_journal"): None,  # Not in scope
    ("theosophy_social", "influenced", "blavatsky_secret_doctrine"): None,  # Not in scope
    ("theosophy_social", "influenced", "judge_theosophical_schism"): None,  # Not in scope

    # indian_independence
    ("indian_independence", "influenced_by", "world_war_ii"): "blitz_begins",
    ("indian_independence", "influenced", "theosophical_society_founding"): "theosophy_social",
    ("indian_independence", "influenced", "beat_generation"): None,  # Not in scope
    ("indian_independence", "influenced", "new_age_movement"): "roberts_seth_material",

    # gardner_wicca
    ("gardner_wicca", "influenced_by", "new_forest_coven"): "gardner_new_forest_initiation",
    ("gardner_wicca", "influenced", "alexandrian_wicca"): "valiente_rewrites_bos",
    ("gardner_wicca", "influenced", "wiccan_publications"): "gardner_witchcraft_today",
    ("gardner_wicca", "influenced", "pagan_federation"): "witchcraft_act_repeal",

    # reclaiming
    ("reclaiming", "influenced_by", "feri_tradition"): "goddess_movement",
    ("reclaiming", "influenced_by", "the_spiral_dance"): "spiral_dance",
    ("reclaiming", "influenced_by", "womens_spirituality_movement"): "goddess_movement",
    ("reclaiming", "influenced", "reclaiming_tradition"): None,  # Self-referential concept
    ("reclaiming", "influenced", "witchcamps"): None,  # Not in scope
    ("reclaiming", "influenced", "pagan_activism_networks"): "wto_protests",

    # goddess_movement
    ("goddess_movement", "influenced_by", "publication_of_the_spiral_dance"): "spiral_dance",
    ("goddess_movement", "influenced_by", "publication_of_the_feminine_mystique"): "suffrage_movement",
    ("goddess_movement", "influenced_by", "second_wave_feminism"): "witch_1968",
    ("goddess_movement", "influenced", "reclaiming_tradition_founded"): "reclaiming",
    ("goddess_movement", "influenced", "dianic_wicca_established"): "dianic_wicca",
    ("goddess_movement", "influenced", "women's_spirituality_conferences"): None,  # Not in scope

    # wto_protests
    ("wto_protests", "influenced_by", "reclaiming_founded"): "reclaiming",
    ("wto_protests", "influenced_by", "anti_nuclear_protests"): "greenham_common_peace_camp",
    ("wto_protests", "influenced", "occupy_wall_street"): "occupy_rituals",
    ("wto_protests", "influenced", "global_justice_movement"): "climate_activism",

    # lgbtq_paganism
    ("lgbtq_paganism", "influenced_by", "stonewall_riots"): "gay_liberation",
    ("lgbtq_paganism", "influenced_by", "feminist_witchcraft"): "dianic_wicca",
    ("lgbtq_paganism", "influenced_by", "gardnerian_wicca"): "gardner_wicca",
    ("lgbtq_paganism", "influenced", "minoan_brotherhood_founded"): None,  # Not in scope
    ("lgbtq_paganism", "influenced", "reclaiming_tradition"): "reclaiming",
    ("lgbtq_paganism", "influenced", "queer_pagan_activism_1990s"): "radical_faeries",

    # gay_liberation
    ("gay_liberation", "influenced_by", "homophile_movement"): None,  # Pre-timeline scope
    ("gay_liberation", "influenced_by", "civil_rights_movement"): "suffrage_movement",
    ("gay_liberation", "influenced_by", "counterculture_1960s"): "church_of_satan",
    ("gay_liberation", "influenced", "reclaiming_tradition"): "reclaiming",
    ("gay_liberation", "influenced", "queer_witchcraft"): "lgbtq_paganism",
    ("gay_liberation", "related_events", "stonewall_riots"): "star_founded",
    ("gay_liberation", "related_events", "first_pride_march"): "radical_faeries",

    # climate_activism
    ("climate_activism", "influenced_by", "publication_of_earth_magic"): "spiral_dance",
    ("climate_activism", "influenced_by", "formation_of_circle_sanctuary"): "reclaiming",
    ("climate_activism", "influenced", "reclaiming_collective_activism"): "wto_protests",
    ("climate_activism", "influenced", "drumming_at_the_gaia_vortex"): "decolonial_paganism",

    # environmentalism
    ("environmentalism", "influenced_by", "romanticism"): None,  # Pre-timeline scope
    ("environmentalism", "influenced_by", "thoreau_walden"): None,  # Pre-timeline scope
    ("environmentalism", "influenced", "gaia_hypothesis"): None,  # Not in scope
    ("environmentalism", "influenced", "earth_first"): "climate_activism",
    ("environmentalism", "influenced", "reclaiming_tradition"): "reclaiming",
}

# ============================================================================
# VALID MOVEMENT LABELS
# These are categorical tags in part_of_movement, not event references.
# We normalise them to a consistent set of lowercase_snake_case labels.
# ============================================================================

MOVEMENT_LABEL_FIXES = {
    # Already valid labels (keep as-is)
    "golden_dawn": "golden_dawn",
    "thelema": "thelema",
    "wicca": "wicca",
    "chaos_magic": "chaos_magic",
    "folk_magic_documentation": "folk_magic_documentation",
    "spiritualism": "spiritualism",
    "symbolism": "symbolism",
    "rosicrucianism": "rosicrucianism",
    "theosophy": "theosophy",
    "industrial_music": "industrial_music",
    "dark_ambient": "dark_ambient",
    "neofolk": "neofolk",
    "esoteric_underground": "esoteric_underground",
    "pagan_revival": "pagan_revival",
    "black_metal": "black_metal",
    "satanism": "satanism",
    "rastafarianism": "rastafarianism",
    "reggae": "reggae",
    "feminist_spirituality": "feminist_spirituality",
    "modern_paganism": "modern_paganism",
    "anti_colonialism": "anti_colonialism",
    "abolition": "abolition",
    "suffrage": "suffrage",
    "mutual_aid": "mutual_aid",
    "second_wave_feminism": "second_wave_feminism",
    "1968_protests": "1968_protests",
    "environmental_activism": "environmental_activism",
    "anti_nuclear": "anti_nuclear",
    "eco_feminism": "eco_feminism",
    "peace_movement": "peace_movement",
    "religious_freedom": "religious_freedom",
    "pagan_civil_rights": "pagan_civil_rights",
    "trump_resistance": "trump_resistance",
    "digital_activism": "digital_activism",
    "metoo": "metoo",
    "feminist_activism": "feminist_activism",
    "occupy": "occupy",
    "anti_capitalism": "anti_capitalism",
    "blm": "blm",
    "environmental_justice": "environmental_justice",
    "indigenous_rights": "indigenous_rights",
    "lgbtq_rights": "lgbtq_rights",
    "queer_spirituality": "queer_spirituality",
    "occult_revival": "occult_revival",

    # Normalize Title Case / inconsistent labels
    "Occult Revival": "occult_revival",
    "Western Esotericism": "western_esotericism",
    "Thelema": "thelema",
    "Renaissance Hermetic Revival": "renaissance_hermeticism",
    "Modernist Art": "modernist_art",
    "Women's Suffrage Movement": "suffrage",
    "First-wave Feminism": "first_wave_feminism",
    "Theosophical Movement": "theosophy",
    "Decolonization": "decolonization",
    "Post-colonial Spiritual Exchange": "postcolonial_spiritual_exchange",
    "Modern Paganism": "modern_paganism",
    "Feminist Spirituality Movement": "feminist_spirituality",
    "Neopaganism": "neopaganism",
    "Neopagan Revival": "neopaganism",
    "Second-Wave Feminism": "second_wave_feminism",
    "Anti-Globalization Movement": "anti_globalization",
    "Political Activist Magic": "activist_magic",
    "Modern Pagan Revival": "modern_paganism",
    "Queer Spirituality Movement": "queer_spirituality",
    "Gay Liberation Movement": "gay_liberation_movement",
    "LGBTQ+ Rights Movement": "lgbtq_rights",
    "Modern Pagan Movement": "modern_paganism",
    "Environmental Movement": "environmental_activism",
    "Modern Environmental Movement": "environmental_activism",
    "Counterculture": "counterculture",
}
