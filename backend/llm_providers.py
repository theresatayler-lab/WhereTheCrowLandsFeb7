# ============================================================================
# LLM Provider Abstraction Layer
# ============================================================================
# Model-agnostic architecture for easy provider swapping
# Current config: All text = Anthropic Claude, Research = DeepSeek
#
# To swap providers later, just change the PROVIDER_CONFIG below
# ============================================================================

import os
import logging
from typing import Dict, Any, Optional
from openai import AsyncOpenAI

logger = logging.getLogger(__name__)

# ============================================================================
# Provider Configuration (Change these to swap providers)
# ============================================================================

PROVIDER_CONFIG = {
    "persona_voice": {
        "provider": "anthropic",
        "model": "claude-sonnet-4-20250514",
        "temperature": 0.8,
        "max_tokens": 2000
    },
    "research": {
        "provider": "deepseek",
        "model": "deepseek-chat",
        "temperature": 0.3,
        "max_tokens": 3000
    },
    "spell_planner": {
        "provider": "anthropic",
        "model": "claude-haiku-4-5-20251001",
        "temperature": 0.7,
        "max_tokens": 2500
    },
    "spell_writer": {
        "provider": "anthropic",
        "model": "claude-sonnet-4-20250514",
        "temperature": 0.85,
        "max_tokens": 3500
    },
    "invisible_helpers_writer": {
        "provider": "anthropic",
        "model": "claude-sonnet-4-20250514",
        "temperature": 0.7,
        "max_tokens": 1800
    }
}

# Provider endpoints
PROVIDER_ENDPOINTS = {
    "deepseek": "https://api.deepseek.com",
    "anthropic": "https://api.anthropic.com",
}

# Environment keys
ENV_KEYS = {
    "deepseek": "DEEPSEEK_API_KEY",
    "anthropic": "ANTHROPIC_API_KEY",
}

# ============================================================================
# Direct Provider Clients
# ============================================================================

def get_deepseek_client() -> Optional[AsyncOpenAI]:
    """Get DeepSeek client (OpenAI-compatible API)"""
    api_key = os.environ.get('DEEPSEEK_API_KEY')
    if not api_key:
        return None
    return AsyncOpenAI(
        api_key=api_key,
        base_url=PROVIDER_ENDPOINTS["deepseek"]
    )

def get_anthropic_client():
    """Get direct Anthropic client"""
    try:
        import anthropic
        api_key = os.environ.get('ANTHROPIC_API_KEY')
        if not api_key:
            return None
        return anthropic.AsyncAnthropic(api_key=api_key)
    except ImportError:
        logger.error("anthropic package not installed")
        return None

# ============================================================================
# Unified Chat Interface
# ============================================================================

async def chat_completion(
    purpose: str,
    system_message: str,
    user_message: str,
    override_config: Dict[str, Any] = None
) -> str:
    """
    Unified chat completion interface

    Args:
        purpose: Key from PROVIDER_CONFIG (e.g., "persona_voice", "research")
        system_message: System prompt
        user_message: User's message
        override_config: Optional overrides for temperature, max_tokens, etc.

    Returns:
        Response text from the LLM
    """
    config = PROVIDER_CONFIG.get(purpose, PROVIDER_CONFIG["persona_voice"])
    if override_config:
        config = {**config, **override_config}

    provider = config["provider"]
    model = config["model"]
    temperature = config.get("temperature", 0.8)
    max_tokens = config.get("max_tokens", 2000)

    logger.info(f"[LLM_CALL] purpose={purpose} provider={provider} model={model}")

    try:
        # Route 1: DeepSeek (direct client, OpenAI-compatible API)
        if provider == "deepseek":
            client = get_deepseek_client()
            if not client:
                raise ValueError("DeepSeek not configured")

            # Extract extra kwargs excluding reserved keys
            reserved_keys = {"provider", "model", "temperature", "max_tokens", "use_emergent_key"}
            extra_kwargs = {k: v for k, v in config.items() if k not in reserved_keys}

            response = await client.chat.completions.create(
                model=model,
                messages=[
                    {"role": "system", "content": system_message},
                    {"role": "user", "content": user_message}
                ],
                temperature=temperature,
                max_tokens=max_tokens,
                **extra_kwargs
            )
            return response.choices[0].message.content

        # Route 3: Anthropic (direct client)
        if provider == "anthropic":
            client = get_anthropic_client()
            if not client:
                raise ValueError("Anthropic not configured - check ANTHROPIC_API_KEY")

            response = await client.messages.create(
                model=model,
                max_tokens=max_tokens,
                system=system_message,
                messages=[{"role": "user", "content": user_message}]
            )
            return response.content[0].text

        raise ValueError(f"Unknown provider: {provider}")

    except Exception as e:
        logger.error(f"[LLM_CALL] purpose={purpose} provider={provider} error={str(e)}")
        raise

# ============================================================================
# Convenience Functions for Common Use Cases
# ============================================================================

async def persona_voice(system_message: str, user_message: str) -> str:
    """Generate persona-voiced response (Anthropic Claude)"""
    return await chat_completion("persona_voice", system_message, user_message)

async def research_query(system_message: str, user_message: str) -> str:
    """Generate research response (DeepSeek)"""
    return await chat_completion("research", system_message, user_message)

async def spell_planner(system_message: str, user_message: str) -> str:
    """Generate spell plan (Anthropic Claude Haiku)"""
    return await chat_completion("spell_planner", system_message, user_message)

async def spell_writer(system_message: str, user_message: str) -> str:
    """Generate spell content (Anthropic Claude Sonnet)"""
    return await chat_completion("spell_writer", system_message, user_message)

# ============================================================================
# Provider Status
# ============================================================================

def get_llm_status() -> Dict[str, Any]:
    """Return status of all configured LLM providers"""
    return {
        "anthropic_configured": bool(os.environ.get('ANTHROPIC_API_KEY')),
        "deepseek_configured": bool(os.environ.get('DEEPSEEK_API_KEY')),
        "google_configured": bool(os.environ.get('GOOGLE_API_KEY')),
        "openai_configured": bool(os.environ.get('OPENAI_API_KEY')),
        "current_config": {
            purpose: {
                "provider": cfg["provider"],
                "model": cfg["model"],
            }
            for purpose, cfg in PROVIDER_CONFIG.items()
        }
    }
