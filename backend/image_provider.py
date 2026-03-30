# Image Provider Abstraction
# Single interface for all image generation with per-asset-type provider routing
# Providers: gemini (Google direct), openai (GPT Image 1), library (static), flux (future)
# Config: Uses per-asset routing by default, IMAGE_PROVIDER env overrides for all
#
# INDEPENDENCE: This module uses YOUR API keys directly — no Emergent dependencies.
#   - GOOGLE_API_KEY for Gemini (headers, atmospheric scenes)
#   - OPENAI_API_KEY for GPT Image 1 (tarot cards, sigils, structured compositions)

import os
import hashlib
import base64
import json
import logging
import uuid
from typing import Optional, Dict, Any
from enum import Enum

logger = logging.getLogger(__name__)


class ImageProvider(Enum):
    LIBRARY = "library"   # Static pre-made images
    GEMINI = "gemini"     # Google Gemini (direct, YOUR key)
    OPENAI = "openai"     # OpenAI GPT Image 1 / DALL-E 3 (YOUR key)
    FLUX = "flux"         # Future: fal.ai/Flux


# Per-asset-type provider routing — best provider for each job
ASSET_PROVIDER_MAP = {
    "header":  "gemini",   # Atmospheric scenes — fast, moody
    "tarot":   "openai",   # Structured emblems — precise, symmetrical
    "sigil":   "openai",   # Clean linework — geometric precision
    "divider": "static",   # Pre-made PNGs — instant
}


def get_image_provider(asset_type: str = None) -> ImageProvider:
    """Get the image provider for a given asset type.

    Uses per-asset routing by default. IMAGE_PROVIDER env var overrides all.
    """
    # Global override from env (if set explicitly)
    override = os.environ.get("IMAGE_PROVIDER", "").lower()
    if override and override != "auto":
        if override == "gemini":
            return ImageProvider.GEMINI
        elif override in ("openai", "dalle"):
            return ImageProvider.OPENAI
        elif override == "flux":
            return ImageProvider.FLUX
        elif override == "library":
            return ImageProvider.LIBRARY

    # Per-asset routing (default behavior)
    if asset_type:
        provider_name = ASSET_PROVIDER_MAP.get(asset_type, "gemini")
        if provider_name == "gemini":
            return ImageProvider.GEMINI
        elif provider_name == "openai":
            return ImageProvider.OPENAI
        elif provider_name == "static":
            return ImageProvider.LIBRARY

    return ImageProvider.GEMINI  # Default fallback


# ============================================================================
# STATIC IMAGE LIBRARY - Pre-made ornaments, dividers, fallback images
# ============================================================================

STATIC_DIVIDERS = {
    "shigg": ["/images/borders/site-corners.png"],
    "cathleen": ["/images/borders/cathleen-border-alt.png"],
    "katherine": ["/images/borders/kate-border-alt.png"],
    "theresa": ["/images/borders/theresa-border-alt.png"],
    "brenda": ["/images/borders/site-corners.png"],
    "default": ["/images/borders/site-corners.png"],
}

STATIC_CORNER_ORNAMENTS = {
    "crow_celtic": "/images/borders/site-corners.png",
    "cathleen_scroll": "/images/borders/cathleen-border-alt.png",
    "katherine_geo": "/images/borders/kate-border-alt.png",
    "theresa_organic": "/images/borders/theresa-border-alt.png",
}

# Placeholder static images for library mode
STATIC_HEADERS = {
    "shigg": [], "cathleen": [], "katherine": [],
    "theresa": [], "brenda": [],
}

STATIC_TAROT = {
    "shigg": [], "cathleen": [], "katherine": [],
    "theresa": [], "brenda": [],
}

STATIC_SIGILS = {
    "shigg": [], "cathleen": [], "katherine": [],
    "theresa": [], "brenda": [],
}


# ============================================================================
# IMAGE CACHE
# ============================================================================

_image_cache: Dict[str, str] = {}


def get_cache_key(prompt: str, persona: str, asset_type: str, size: str = "1024x1024") -> str:
    content = f"{prompt}|{persona}|{asset_type}|{size}"
    return hashlib.md5(content.encode()).hexdigest()


def get_cached_image(cache_key: str) -> Optional[str]:
    return _image_cache.get(cache_key)


def set_cached_image(cache_key: str, image_data: str):
    _image_cache[cache_key] = image_data
    if len(_image_cache) > 100:
        keys = list(_image_cache.keys())
        for k in keys[:20]:
            del _image_cache[k]


# ============================================================================
# STATIC LIBRARY FUNCTIONS
# ============================================================================

def get_static_divider(persona_id: str) -> Optional[str]:
    dividers = STATIC_DIVIDERS.get(persona_id, STATIC_DIVIDERS["default"])
    if dividers:
        import random
        return random.choice(dividers)
    return None


def get_static_header(persona_id: str) -> Optional[str]:
    headers = STATIC_HEADERS.get(persona_id, [])
    if headers:
        import random
        return random.choice(headers)
    return None


def get_static_tarot(persona_id: str) -> Optional[str]:
    tarots = STATIC_TAROT.get(persona_id, [])
    if tarots:
        import random
        return random.choice(tarots)
    return None


def get_static_sigil(persona_id: str) -> Optional[str]:
    sigils = STATIC_SIGILS.get(persona_id, [])
    if sigils:
        import random
        return random.choice(sigils)
    return None


def get_corner_ornament(style: str = "crow_celtic") -> str:
    return STATIC_CORNER_ORNAMENTS.get(style, STATIC_CORNER_ORNAMENTS["crow_celtic"])


# ============================================================================
# GOOGLE GEMINI - Direct SDK (YOUR GOOGLE_API_KEY)
# Best for: Headers, atmospheric scenes, moody environments
# ============================================================================

async def _generate_gemini(prompt: str, cache_key: str) -> Optional[str]:
    """Generate image via Google Gemini (direct API, your key)."""
    api_key = os.environ.get('GOOGLE_API_KEY')
    if not api_key:
        logger.error("[GEMINI] GOOGLE_API_KEY not set")
        return None

    try:
        from google import genai
        from google.genai import types

        client = genai.Client(api_key=api_key)

        response = client.models.generate_content(
            model="gemini-2.0-flash-preview-image-generation",
            contents=f"Generate this image: {prompt}",
            config=types.GenerateContentConfig(
                response_modalities=["IMAGE"],
            ),
        )

        # Extract image from response parts
        if response.candidates and response.candidates[0].content.parts:
            for part in response.candidates[0].content.parts:
                if part.inline_data and part.inline_data.mime_type.startswith("image/"):
                    image_data = base64.b64encode(part.inline_data.data).decode("utf-8")
                    set_cached_image(cache_key, image_data)
                    logger.info(f"[GEMINI] Image generated, size={len(image_data[:20])}...")
                    return image_data

        logger.warning("[GEMINI] No image in response")
        return None
    except Exception as e:
        logger.error(f"[GEMINI] Generation failed: {e}")
        return None


# ============================================================================
# OPENAI GPT IMAGE 1 - Direct SDK (YOUR OPENAI_API_KEY)
# Best for: Tarot cards, sigils, structured symmetrical compositions
# ============================================================================

async def _generate_openai(prompt: str, cache_key: str, size: str = "1024x1024") -> Optional[str]:
    """Generate image via OpenAI GPT Image 1 (direct API, your key)."""
    api_key = os.environ.get('OPENAI_API_KEY')
    if not api_key:
        logger.error("[OPENAI] OPENAI_API_KEY not set")
        return None

    try:
        from openai import AsyncOpenAI

        client = AsyncOpenAI(api_key=api_key)

        response = await client.images.generate(
            model="gpt-image-1",
            prompt=prompt,
            size=size,
            quality="high",
            n=1,
        )

        if response.data and len(response.data) > 0:
            # GPT Image 1 returns base64 by default
            image_data = response.data[0].b64_json
            if image_data:
                set_cached_image(cache_key, image_data)
                logger.info(f"[OPENAI] Image generated, size={len(image_data[:20])}...")
                return image_data

            # If URL returned instead of base64
            if response.data[0].url:
                import httpx
                async with httpx.AsyncClient() as http:
                    img_response = await http.get(response.data[0].url)
                    image_data = base64.b64encode(img_response.content).decode("utf-8")
                    set_cached_image(cache_key, image_data)
                    return image_data

        logger.warning("[OPENAI] No image in response")
        return None
    except Exception as e:
        logger.error(f"[OPENAI] Generation failed: {e}")
        return None


# ============================================================================
# MAIN INTERFACE - generate_image() with per-asset routing
# ============================================================================

async def generate_image(
    prompt: str,
    persona_id: str,
    asset_type: str,   # "header", "tarot", "sigil", "divider"
    size: str = "1024x1024",
    openai_client=None  # Legacy param, ignored — uses OPENAI_API_KEY directly
) -> Optional[str]:
    """
    Main image generation interface with per-asset-type provider routing.

    Default routing:
        header  → Google Gemini (fast, atmospheric)
        tarot   → OpenAI GPT Image 1 (precise, structured)
        sigil   → OpenAI GPT Image 1 (clean geometry)
        divider → Static PNGs (instant)

    Override: Set IMAGE_PROVIDER env to force all assets to one provider.

    Returns:
        - base64 image data (for generated images)
        - "STATIC_URL:<url>" string (for static library images)
        - None if generation fails
    """
    # Always use static dividers
    if asset_type == "divider":
        static_url = get_static_divider(persona_id)
        if static_url:
            return f"STATIC_URL:{static_url}"
        logger.warning(f"No static divider for persona {persona_id}")
        return None

    # Check cache
    cache_key = get_cache_key(prompt, persona_id, asset_type, size)
    cached = get_cached_image(cache_key)
    if cached:
        logger.info(f"[CACHE HIT] {asset_type} for {persona_id}")
        return cached

    # Get provider for this asset type
    provider = get_image_provider(asset_type)

    # Library mode — try static first, fall back to Gemini
    if provider == ImageProvider.LIBRARY:
        static_url = None
        if asset_type == "header":
            static_url = get_static_header(persona_id)
        elif asset_type == "tarot":
            static_url = get_static_tarot(persona_id)
        elif asset_type == "sigil":
            static_url = get_static_sigil(persona_id)

        if static_url:
            return f"STATIC_URL:{static_url}"

        logger.info(f"[LIBRARY] No static {asset_type} for {persona_id}, falling back to Gemini")
        provider = ImageProvider.GEMINI

    # Google Gemini (YOUR key)
    if provider == ImageProvider.GEMINI:
        result = await _generate_gemini(prompt, cache_key)
        if result:
            return result
        # Fall back to OpenAI if Gemini fails
        logger.info(f"[GEMINI] Failed, falling back to OpenAI for {asset_type}")
        result = await _generate_openai(prompt, cache_key, size)
        if result:
            return result
        return None

    # OpenAI GPT Image 1 (YOUR key)
    if provider == ImageProvider.OPENAI:
        result = await _generate_openai(prompt, cache_key, size)
        if result:
            return result
        # Fall back to Gemini if OpenAI fails
        logger.info(f"[OPENAI] Failed, falling back to Gemini for {asset_type}")
        result = await _generate_gemini(prompt, cache_key)
        if result:
            return result
        return None

    # FLUX (future — fal.ai)
    if provider == ImageProvider.FLUX:
        logger.warning("Flux provider not yet implemented")
        return await _generate_gemini(prompt, cache_key)

    return None


# ============================================================================
# HELPERS
# ============================================================================

def is_static_url(image_data: str) -> bool:
    """Check if image data is a static URL (vs base64)"""
    return image_data and image_data.startswith("STATIC_URL:")


def get_url_from_static(image_data: str) -> str:
    """Extract URL from STATIC_URL: prefix"""
    if is_static_url(image_data):
        return image_data.replace("STATIC_URL:", "")
    return image_data
