# Spell Tier System - Adaptive Quality Routing
# Routes spells to appropriate AI model chains based on context

from typing import Dict, Any, Optional, Tuple
from enum import Enum

class SpellTier(Enum):
    QUICK = "quick"      # 15-25 seconds - DeepSeek → Sonnet
    STANDARD = "standard" # 30-45 seconds - DeepSeek → Sonnet (enhanced)
    DEEP = "deep"        # 60-90 seconds - DeepSeek + Opus → Sonnet

# =============================================================================
# MODEL CONFIGURATIONS PER TIER
# =============================================================================

TIER_CONFIGS = {
    SpellTier.QUICK: {
        "research_model": "deepseek-chat",
        "research_tokens": 800,
        "research_temperature": 0.5,
        "writer_model": "claude-sonnet-4-20250514",
        "writer_tokens": 1500,
        "writer_temperature": 0.7,
        "storyteller_model": None,  # Skip storytelling stage
        "expected_time_seconds": 20,
        "description": "Fast spells for daily practice"
    },
    SpellTier.STANDARD: {
        "research_model": "deepseek-chat",
        "research_tokens": 1200,
        "research_temperature": 0.6,
        "writer_model": "claude-sonnet-4-20250514",
        "writer_tokens": 3200,
        "writer_temperature": 0.8,
        "storyteller_model": "claude-sonnet-4-20250514",
        "storyteller_tokens": 1000,
        "expected_time_seconds": 40,
        "description": "Rich spells with good depth"
    },
    SpellTier.DEEP: {
        "research_model": "deepseek-chat",
        "research_tokens": 2000,
        "research_temperature": 0.7,
        "reasoning_model": "claude-opus-4-20250514",  # Extra reasoning stage
        "reasoning_tokens": 1500,
        "writer_model": "claude-sonnet-4-20250514",
        "writer_tokens": 3500,
        "writer_temperature": 0.85,
        "storyteller_model": "claude-sonnet-4-20250514",
        "storyteller_tokens": 1500,
        "expected_time_seconds": 75,
        "description": "Maximum depth, research, and beauty"
    }
}

# =============================================================================
# PERSONA-BASED DEFAULT TIERS
# =============================================================================

PERSONA_DEFAULT_TIERS = {
    "shigg": SpellTier.STANDARD,      # Cozy, domestic - doesn't need deep research
    "cathleen": SpellTier.STANDARD,   # Voice-focused, needs good prose
    "katherine": SpellTier.DEEP,      # Academic spiritualist - needs sources!
    "theresa": SpellTier.STANDARD,    # Family lore, can go deep for ancestral
    "brenda": SpellTier.STANDARD,     # Family chronicler, warm and nostalgic
}

# =============================================================================
# INTENTION-BASED TIER UPGRADES
# =============================================================================

# Keywords that trigger DEEP tier regardless of other factors
DEEP_TRIGGER_KEYWORDS = [
    "ancestor", "ancestral", "spirit", "death", "deceased", "departed",
    "protection", "ward", "shield", "boundary", "banish",
    "binding", "curse", "hex", "revenge",  # Needs ethical depth
    "séance", "medium", "channeling", "communication",
    "initiation", "dedication", "oath",
    "complex", "deep", "thorough", "research", "full ritual"
]

# Keywords that allow QUICK tier
QUICK_ELIGIBLE_KEYWORDS = [
    "calm", "peace", "relax", "focus", "energy", "morning",
    "simple", "quick", "fast", "daily", "routine",
    "tea", "candle", "breath", "ground", "center"
]

# =============================================================================
# TIER SELECTION LOGIC
# =============================================================================

def select_spell_tier(
    persona_id: str,
    intention: str,
    user_tier: str = "free",  # "free", "pro", "paid"
    is_first_spell: bool = False,
    explicit_choice: Optional[str] = None  # User can override
) -> Tuple[SpellTier, str]:
    """
    Select the appropriate spell tier based on context.
    
    Returns: (SpellTier, reason_string)
    """
    intention_lower = intention.lower() if intention else ""
    
    # 1. Explicit user choice takes priority
    if explicit_choice:
        if explicit_choice == "quick":
            return SpellTier.QUICK, "User requested quick spell"
        elif explicit_choice == "deep":
            if user_tier in ("pro", "paid"):
                return SpellTier.DEEP, "User requested deep spell (Pro feature)"
            else:
                return SpellTier.STANDARD, "Deep requested but user is free tier"
        elif explicit_choice == "standard":
            return SpellTier.STANDARD, "User requested standard spell"
    
    # 2. First spell ever gets the full treatment (make a great impression)
    if is_first_spell:
        return SpellTier.DEEP, "First spell - making a great first impression"
    
    # 3. Pro users get DEEP by default for complex intentions
    if user_tier in ("pro", "paid"):
        if any(kw in intention_lower for kw in DEEP_TRIGGER_KEYWORDS):
            return SpellTier.DEEP, f"Pro user + deep intention detected"
    
    # 4. Check for DEEP trigger keywords (ancestral, protection, etc.)
    for keyword in DEEP_TRIGGER_KEYWORDS:
        if keyword in intention_lower:
            # Free users get STANDARD for deep topics, Pro gets DEEP
            if user_tier in ("pro", "paid"):
                return SpellTier.DEEP, f"Deep keyword '{keyword}' + Pro user"
            else:
                return SpellTier.STANDARD, f"Deep keyword '{keyword}' (upgrade to Pro for full depth)"
    
    # 5. Katherine always gets at least STANDARD, often DEEP
    if persona_id == "katherine":
        if user_tier in ("pro", "paid"):
            return SpellTier.DEEP, "Katherine requires thorough research (Pro)"
        return SpellTier.STANDARD, "Katherine requires good research"
    
    # 6. Check for QUICK eligible keywords
    if any(kw in intention_lower for kw in QUICK_ELIGIBLE_KEYWORDS):
        return SpellTier.QUICK, f"Simple intention suitable for quick spell"
    
    # 7. Default to persona's default tier
    default = PERSONA_DEFAULT_TIERS.get(persona_id, SpellTier.STANDARD)
    return default, f"Default tier for {persona_id}"


def get_tier_config(tier: SpellTier) -> Dict[str, Any]:
    """Get the full configuration for a tier"""
    return TIER_CONFIGS[tier]


def estimate_cost(tier: SpellTier) -> Dict[str, float]:
    """
    Estimate cost per spell for a tier (approximate, in USD)
    Based on current API pricing as of 2025
    """
    # Approximate costs per 1M tokens (input/output averaged)
    COSTS_PER_1M = {
        "deepseek-chat": 0.50,      # Very cheap
        "claude-sonnet-4-20250514": 15.00,  # Mid-range
        "claude-opus-4-20250514": 75.00,    # Premium
        "gpt-4o": 25.00,            # Backup only
    }
    
    config = TIER_CONFIGS[tier]
    
    # Calculate based on token usage
    research_cost = (config["research_tokens"] / 1_000_000) * COSTS_PER_1M["deepseek-chat"]
    writer_cost = (config["writer_tokens"] / 1_000_000) * COSTS_PER_1M[config["writer_model"]]
    
    storyteller_cost = 0
    if config.get("storyteller_model"):
        storyteller_cost = (config["storyteller_tokens"] / 1_000_000) * COSTS_PER_1M[config["storyteller_model"]]
    
    reasoning_cost = 0
    if config.get("reasoning_model"):
        reasoning_cost = (config.get("reasoning_tokens", 0) / 1_000_000) * COSTS_PER_1M[config["reasoning_model"]]
    
    total = research_cost + writer_cost + storyteller_cost + reasoning_cost
    
    return {
        "research": round(research_cost, 6),
        "reasoning": round(reasoning_cost, 6),
        "storyteller": round(storyteller_cost, 6),
        "writer": round(writer_cost, 6),
        "total_per_spell": round(total, 5),
        "spells_per_dollar": round(1 / total, 1) if total > 0 else 0
    }


# =============================================================================
# FALLBACK CONFIGURATION (GPT-4o as backup)
# =============================================================================

FALLBACK_CONFIG = {
    "research_model": "gpt-4o",
    "research_tokens": 2000,
    "research_temperature": 0.5,
    "writer_model": "gpt-4o",
    "writer_tokens": 3000,
    "writer_temperature": 0.8,
    "planner_model": "gpt-4o",
    "planner_tokens": 1500,
    "planner_temperature": 0.6,
    "note": "Fallback mode - Claude/DeepSeek unavailable"
}

def get_fallback_config() -> Dict[str, Any]:
    """Return GPT-4o fallback configuration"""
    return FALLBACK_CONFIG
