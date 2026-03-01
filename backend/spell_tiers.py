# Spell Tiers - Token budgets and configuration for spell generation tiers
# Defines the resource allocation for QUICK, STANDARD, and PREMIUM spells

from typing import Dict, Any

# ============================================================================
# TIER DEFINITIONS
# ============================================================================

SPELL_TIERS = {
    "quick": {
        "name": "Quick Spell",
        "description": "Fast, focused spell for simple intentions",
        "max_generation_time_seconds": 30,
        "stages": {
            "archivist": {
                "enabled": True,
                "model": "deepseek-chat",
                "max_tokens": 1500,
                "timeout_seconds": 10
            },
            "planner": {
                "enabled": False,  # Uses deterministic plan
                "model": None,
                "max_tokens": 0,
                "timeout_seconds": 0
            },
            "writer": {
                "enabled": True,
                "model": "claude-sonnet-4-20250514",
                "max_tokens": 2500,
                "timeout_seconds": 30
            },
            "qa": {
                "enabled": True,
                "programmatic_only": True
            }
        },
        "block_limits": {
            "max_blocks": 5,
            "max_materials": 3,
            "max_steps": 4
        },
        "user_tiers_allowed": ["free", "standard", "premium", "founding"]
    },
    
    "standard": {
        "name": "Standard Spell",
        "description": "Full spell with all pipeline stages",
        "max_generation_time_seconds": 90,
        "stages": {
            "archivist": {
                "enabled": True,
                "model": "deepseek-chat",
                "max_tokens": 2500,
                "timeout_seconds": 15
            },
            "planner": {
                "enabled": True,
                "model": "gpt-4o-mini",  # Faster than gpt-4o for standard
                "max_tokens": 1500,
                "timeout_seconds": 15
            },
            "writer": {
                "enabled": True,
                "model": "claude-sonnet-4-20250514",
                "fallback_model": "gpt-4o",
                "max_tokens": 3200,  # Increased from 2500 for Theresa's evidence_cards
                "timeout_seconds": 45
            },
            "qa": {
                "enabled": True,
                "programmatic_only": False,
                "llm_rewrite_on_fail": True
            }
        },
        "block_limits": {
            "max_blocks": 8,
            "max_materials": 5,
            "max_steps": 6
        },
        "user_tiers_allowed": ["free", "standard", "premium", "founding"]
    },
    
    "premium": {
        "name": "Premium Spell",
        "description": "Extended spell with maximum detail and research",
        "max_generation_time_seconds": 180,
        "stages": {
            "archivist": {
                "enabled": True,
                "model": "deepseek-chat",
                "max_tokens": 3500,
                "timeout_seconds": 20
            },
            "planner": {
                "enabled": True,
                "model": "gpt-4o",  # Full model for premium
                "max_tokens": 2500,
                "timeout_seconds": 20
            },
            "writer": {
                "enabled": True,
                "model": "claude-sonnet-4-20250514",
                "fallback_model": "gpt-4o",
                "max_tokens": 4000,
                "timeout_seconds": 60
            },
            "qa": {
                "enabled": True,
                "programmatic_only": False,
                "llm_rewrite_on_fail": True,
                "max_rewrites": 2
            }
        },
        "block_limits": {
            "max_blocks": 12,
            "max_materials": 7,
            "max_steps": 8
        },
        "user_tiers_allowed": ["premium", "founding"]
    }
}


# ============================================================================
# TIER DETECTION
# ============================================================================

def get_tier_for_intention(intention: str, user_tier: str = "free") -> str:
    """
    Determine the appropriate spell tier based on intention and user subscription.
    
    Returns: "quick", "standard", or "premium"
    """
    intention_lower = intention.lower()
    word_count = len(intention.split())
    
    # Quick tier indicators
    quick_words = ["quick", "simple", "calm", "peace", "relax", "breath", "moment", "easy"]
    is_quick = any(word in intention_lower for word in quick_words) and word_count < 15
    
    # Premium tier indicators
    premium_words = ["ceremony", "ritual", "ancestral", "binding", "complex", "deep", "formal"]
    is_premium = any(word in intention_lower for word in premium_words)
    
    # Check user tier permissions
    if is_quick:
        return "quick"
    
    if is_premium and user_tier in ["premium", "founding"]:
        return "premium"
    
    return "standard"


def select_spell_tier(
    persona_id: str = None,
    intention: str = "",
    user_tier: str = "free",
    is_first_spell: bool = False,
    explicit_choice: str = None
) -> tuple:
    """
    Select the appropriate spell tier based on multiple factors.
    
    Returns: (SpellTier enum, reason string)
    """
    # If user explicitly chose a tier
    if explicit_choice:
        if explicit_choice == "quick":
            return SpellTier.QUICK, "User requested quick tier"
        elif explicit_choice == "premium" and user_tier in ["premium", "founding"]:
            return SpellTier.PREMIUM, "User requested premium tier"
        elif explicit_choice == "standard":
            return SpellTier.STANDARD, "User requested standard tier"
    
    # First spell gets standard treatment for good first impression
    if is_first_spell:
        return SpellTier.STANDARD, "First spell - full experience"
    
    # Detect tier from intention
    tier_str = get_tier_for_intention(intention, user_tier)
    
    if tier_str == "quick":
        return SpellTier.QUICK, "Simple intention suitable for quick spell"
    elif tier_str == "premium":
        return SpellTier.PREMIUM, "Complex intention with premium features"
    else:
        return SpellTier.STANDARD, "Standard spell generation"


def get_tier_config(tier: str) -> Dict[str, Any]:
    """Get the full configuration for a spell tier."""
    return SPELL_TIERS.get(tier, SPELL_TIERS["standard"])


def get_writer_tokens(tier: str) -> int:
    """Get the writer token budget for a tier."""
    config = get_tier_config(tier)
    return config.get("stages", {}).get("writer", {}).get("max_tokens", 3200)


def get_planner_model(tier: str) -> str:
    """Get the planner model for a tier."""
    config = get_tier_config(tier)
    return config.get("stages", {}).get("planner", {}).get("model", "gpt-4o-mini")


def is_planner_enabled(tier: str) -> bool:
    """Check if the planner stage is enabled for a tier."""
    config = get_tier_config(tier)
    return config.get("stages", {}).get("planner", {}).get("enabled", True)


def get_block_limits(tier: str) -> Dict[str, int]:
    """Get the block limits for a tier."""
    config = get_tier_config(tier)
    return config.get("block_limits", {
        "max_blocks": 7,
        "max_materials": 5,
        "max_steps": 6
    })


def user_can_access_tier(user_tier: str, spell_tier: str) -> bool:
    """Check if a user tier can access a spell tier."""
    config = get_tier_config(spell_tier)
    allowed = config.get("user_tiers_allowed", ["free", "standard", "premium", "founding"])
    return user_tier in allowed


# ============================================================================
# TIMING HELPERS
# ============================================================================

def get_stage_timeout(tier: str, stage: str) -> int:
    """Get the timeout in seconds for a specific stage."""
    config = get_tier_config(tier)
    stage_config = config.get("stages", {}).get(stage, {})
    return stage_config.get("timeout_seconds", 30)


def get_max_generation_time(tier: str) -> int:
    """Get the maximum total generation time for a tier."""
    config = get_tier_config(tier)
    return config.get("max_generation_time_seconds", 90)


# ============================================================================
# EXPORTS
# ============================================================================

from enum import Enum

# Enum class for tier constants
class SpellTier(Enum):
    QUICK = "quick"
    STANDARD = "standard"
    PREMIUM = "premium"


__all__ = [
    "SPELL_TIERS",
    "SpellTier",
    "get_tier_for_intention",
    "select_spell_tier",
    "get_tier_config",
    "get_writer_tokens",
    "get_planner_model",
    "is_planner_enabled",
    "get_block_limits",
    "user_can_access_tier",
    "get_stage_timeout",
    "get_max_generation_time"
]
