# ============================================================================
# LLM Provider Abstraction Layer
# ============================================================================
# Model-agnostic architecture for easy provider swapping
# Current config: Persona Voice = OpenAI, Research = DeepSeek
# 
# To swap providers later, just change the PROVIDER_CONFIG below
# ============================================================================

import os
import uuid
import logging
from typing import Dict, Any, Optional
from openai import AsyncOpenAI

logger = logging.getLogger(__name__)

# ============================================================================
# Provider Configuration (Change these to swap providers)
# ============================================================================

PROVIDER_CONFIG = {
    "persona_voice": {
        "provider": "openai",           # Options: "openai", "anthropic", "gemini"
        "model": "gpt-4o",              # Model to use for this provider
        "use_emergent_key": False,      # Use your own OpenAI key
        "temperature": 0.8,
        "max_tokens": 2000
    },
    "research": {
        "provider": "deepseek",         # Options: "deepseek", "openai", "anthropic"
        "model": "deepseek-chat",
        "use_emergent_key": False,      # DeepSeek uses its own key
        "temperature": 0.3,
        "max_tokens": 3000
    },
    "spell_planner": {
        "provider": "openai",
        "model": "gpt-4o",
        "use_emergent_key": False,      # Use your own OpenAI key
        "temperature": 0.8,
        "max_tokens": 2500
    },
    "spell_writer": {
        "provider": "openai",
        "model": "gpt-4o",
        "use_emergent_key": False,      # Use your own OpenAI key
        "temperature": 0.85,
        "max_tokens": 3500
    }
}

# Provider endpoints
PROVIDER_ENDPOINTS = {
    "openai": "https://api.openai.com/v1",
    "deepseek": "https://api.deepseek.com",
    "anthropic": "https://api.anthropic.com",
    "gemini": "https://generativelanguage.googleapis.com"
}

# Environment keys
ENV_KEYS = {
    "openai": "OPENAI_API_KEY",
    "deepseek": "DEEPSEEK_API_KEY",
    "anthropic": "ANTHROPIC_API_KEY",
    "gemini": "GEMINI_API_KEY",
    "emergent": "EMERGENT_LLM_KEY"
}

# ============================================================================
# Emergent Integration (Universal Key)
# ============================================================================

async def emergent_chat(
    system_message: str,
    user_message: str,
    provider: str = "openai",
    model: str = "gpt-4o",
    temperature: float = 0.8,
    max_tokens: int = 2000
) -> str:
    """
    Chat completion using Emergent Universal Key
    Supports: openai, anthropic, gemini
    """
    from emergentintegrations.llm.chat import LlmChat, UserMessage
    
    api_key = os.environ.get('EMERGENT_LLM_KEY', '')
    if not api_key:
        raise ValueError("EMERGENT_LLM_KEY not configured")
    
    chat = LlmChat(
        api_key=api_key,
        session_id=str(uuid.uuid4()),
        system_message=system_message
    ).with_model(provider, model)
    
    user_msg = UserMessage(text=user_message)
    response = await chat.send_message(user_msg)
    return response

# ============================================================================
# Direct Provider Clients (for non-Emergent usage)
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

def get_openai_client() -> Optional[AsyncOpenAI]:
    """Get direct OpenAI client (fallback if Emergent unavailable)"""
    api_key = os.environ.get('OPENAI_API_KEY')
    if not api_key:
        return None
    return AsyncOpenAI(api_key=api_key)

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
        override_config: Optional overrides for temperature, max_tokens, response_format, etc.
    
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
    use_emergent = config.get("use_emergent_key", True)
    
    logger.info(f"[LLM_CALL] purpose={purpose} provider={provider} model={model} emergent={use_emergent}")
    
    # Extract extra kwargs (e.g., response_format) excluding reserved keys
    reserved_keys = {"provider", "model", "temperature", "max_tokens", "use_emergent_key"}
    extra_kwargs = {k: v for k, v in config.items() if k not in reserved_keys}
    
    try:
        # Route 1: Emergent Universal Key (no extra_kwargs - avoid unexpected behavior)
        if use_emergent and provider in ["openai", "anthropic", "gemini"]:
            return await emergent_chat(
                system_message=system_message,
                user_message=user_message,
                provider=provider,
                model=model,
                temperature=temperature,
                max_tokens=max_tokens
            )
        
        # Route 2: DeepSeek (direct client with extra kwargs like response_format)
        elif provider == "deepseek":
            client = get_deepseek_client()
            if not client:
                raise ValueError("DeepSeek not configured")
            
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
        
        # Route 3: Direct OpenAI (fallback with extra kwargs)
        else:
            client = get_openai_client()
            if not client:
                raise ValueError(f"Provider {provider} not configured")
            
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
            
    except Exception as e:
        logger.error(f"[LLM_CALL] purpose={purpose} provider={provider} error={str(e)}")
        raise

# ============================================================================
# Convenience Functions for Common Use Cases
# ============================================================================

async def persona_voice(system_message: str, user_message: str) -> str:
    """Generate persona-voiced response (currently OpenAI)"""
    return await chat_completion("persona_voice", system_message, user_message)

async def research_query(system_message: str, user_message: str) -> str:
    """Generate research response (currently DeepSeek)"""
    return await chat_completion("research", system_message, user_message)

async def spell_planner(system_message: str, user_message: str) -> str:
    """Generate spell plan (currently OpenAI)"""
    return await chat_completion("spell_planner", system_message, user_message)

async def spell_writer(system_message: str, user_message: str) -> str:
    """Generate spell content (currently OpenAI)"""
    return await chat_completion("spell_writer", system_message, user_message)

# ============================================================================
# Provider Status
# ============================================================================

def get_llm_status() -> Dict[str, Any]:
    """Return status of all configured LLM providers"""
    return {
        "emergent_key_configured": bool(os.environ.get('EMERGENT_LLM_KEY')),
        "openai_configured": bool(os.environ.get('OPENAI_API_KEY')),
        "deepseek_configured": bool(os.environ.get('DEEPSEEK_API_KEY')),
        "anthropic_configured": bool(os.environ.get('ANTHROPIC_API_KEY')),
        "gemini_configured": bool(os.environ.get('GEMINI_API_KEY')),
        "current_config": {
            purpose: {
                "provider": cfg["provider"],
                "model": cfg["model"],
                "uses_emergent": cfg.get("use_emergent_key", False)
            }
            for purpose, cfg in PROVIDER_CONFIG.items()
        }
    }
