# Image Provider Abstraction
# Single interface for all image generation with tier-aware per-asset-type provider routing
# Providers: gemini, openai, fal (Flux Pro), ideogram, library (static)
# Config: Tier-aware routing by default, IMAGE_PROVIDER env overrides for all
#
# INDEPENDENCE: This module uses YOUR API keys directly — no Emergent dependencies.
#   - GOOGLE_API_KEY for Gemini (standard headers, atmospheric scenes)
#   - OPENAI_API_KEY for GPT Image 1 (tarot cards, structured compositions)
#   - FAL_API_KEY for fal.ai Flux Pro (premium headers, cinematic detail)
#   - IDEOGRAM_API_KEY for Ideogram V2 (premium sigils, geometric design)

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
    LIBRARY = "library"     # Static pre-made images
    GEMINI = "gemini"       # Google Gemini (direct, YOUR key)
    OPENAI = "openai"       # OpenAI GPT Image 1 / DALL-E 3 (YOUR key)
    FLUX = "flux"           # fal.ai Flux Pro (YOUR FAL_API_KEY)
    IDEOGRAM = "ideogram"   # Ideogram V2 (YOUR IDEOGRAM_API_KEY)


# Per-asset-type provider routing — best provider for each job (standard tier)
ASSET_PROVIDER_MAP = {
    "header":  "gemini",   # Atmospheric scenes — fast, moody
    "tarot":   "openai",   # Structured emblems — precise, symmetrical
    "sigil":   "openai",   # Clean linework — geometric precision
    "divider": "static",   # Pre-made PNGs — instant
}

# Tier-aware routing — premium tier uses upgraded providers
TIER_PROVIDER_MAP = {
    "quick":    {},  # No images generated
    "standard": {"header": "gemini",  "tarot": "openai", "sigil": "openai",   "divider": "static"},
    "premium":  {"header": "flux",    "tarot": "openai", "sigil": "ideogram", "divider": "static"},
}


def _resolve_provider_name(name: str) -> ImageProvider:
    """Map a provider name string to its enum value."""
    mapping = {
        "gemini": ImageProvider.GEMINI,
        "openai": ImageProvider.OPENAI,
        "dalle": ImageProvider.OPENAI,
        "flux": ImageProvider.FLUX,
        "fal": ImageProvider.FLUX,
        "ideogram": ImageProvider.IDEOGRAM,
        "library": ImageProvider.LIBRARY,
        "static": ImageProvider.LIBRARY,
    }
    return mapping.get(name, ImageProvider.GEMINI)


def get_image_provider(asset_type: str = None, tier: str = "standard") -> ImageProvider:
    """Get the image provider for a given asset type and spell tier.

    Uses tier-aware routing by default. IMAGE_PROVIDER env var overrides all.
    """
    override = os.environ.get("IMAGE_PROVIDER", "").lower()
    if override and override != "auto":
        return _resolve_provider_name(override)

    if asset_type:
        tier_map = TIER_PROVIDER_MAP.get(tier, TIER_PROVIDER_MAP["standard"])
        provider_name = tier_map.get(asset_type) or ASSET_PROVIDER_MAP.get(asset_type, "gemini")
        return _resolve_provider_name(provider_name)

    return ImageProvider.GEMINI


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
            model="gemini-2.5-flash-image",
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
# FAL.AI FLUX PRO - Direct HTTP API (YOUR FAL_API_KEY)
# Best for: Premium headers — cinematic, high-detail atmospheric scenes
# ============================================================================

async def _generate_fal(prompt: str, cache_key: str, size: str = "landscape_16_9") -> Optional[str]:
    """Generate image via fal.ai Flux Pro (direct HTTP API, your key)."""
    api_key = os.environ.get('FAL_API_KEY')
    if not api_key:
        logger.error("[FAL] FAL_API_KEY not set")
        return None

    try:
        import httpx

        headers = {"Authorization": f"Key {api_key}", "Content-Type": "application/json"}
        payload = {
            "prompt": prompt,
            "image_size": size,
            "num_images": 1,
            "enable_safety_checker": True,
        }

        async with httpx.AsyncClient(timeout=90.0) as client:
            # Submit generation request
            submit_resp = await client.post(
                "https://queue.fal.run/fal-ai/flux-pro/v1.1",
                headers=headers,
                json=payload,
            )
            submit_resp.raise_for_status()
            result_data = submit_resp.json()

            # fal.ai queue API: if response has 'images', it completed synchronously
            images = result_data.get("images")
            if not images:
                # Async queue — poll for result
                request_id = result_data.get("request_id")
                if not request_id:
                    logger.warning("[FAL] No request_id or images in response")
                    return None

                # Use the URLs FAL returns in the submit response — the queue API
                # strips the model version segment (/v1.1) from poll/result paths,
                # so hand-building them yields a non-JSON 404.
                status_url = result_data.get(
                    "status_url",
                    f"https://queue.fal.run/fal-ai/flux-pro/requests/{request_id}/status",
                )
                result_url = result_data.get(
                    "response_url",
                    f"https://queue.fal.run/fal-ai/flux-pro/requests/{request_id}",
                )
                for _ in range(30):  # Poll up to 60 seconds
                    import asyncio
                    await asyncio.sleep(2)
                    status_resp = await client.get(status_url, headers=headers)
                    status_data = status_resp.json()
                    if status_data.get("status") == "COMPLETED":
                        result_resp = await client.get(result_url, headers=headers)
                        images = result_resp.json().get("images")
                        break
                    elif status_data.get("status") in ("FAILED", "CANCELLED"):
                        logger.error(f"[FAL] Generation {status_data.get('status')}")
                        return None

            if images and len(images) > 0:
                image_url = images[0].get("url")
                if image_url:
                    img_resp = await client.get(image_url)
                    image_data = base64.b64encode(img_resp.content).decode("utf-8")
                    set_cached_image(cache_key, image_data)
                    logger.info(f"[FAL] Image generated via Flux Pro")
                    return image_data

        logger.warning("[FAL] No image in response")
        return None
    except Exception as e:
        logger.error(f"[FAL] Generation failed: {e}")
        return None


# ============================================================================
# IDEOGRAM V2 - Direct HTTP API (YOUR IDEOGRAM_API_KEY)
# Best for: Sigils — clean geometric linework, precise symbolic compositions
# ============================================================================

async def _generate_ideogram(prompt: str, cache_key: str) -> Optional[str]:
    """Generate image via Ideogram V2 (direct HTTP API, your key)."""
    api_key = os.environ.get('IDEOGRAM_API_KEY')
    if not api_key:
        logger.error("[IDEOGRAM] IDEOGRAM_API_KEY not set")
        return None

    try:
        import httpx

        headers = {"Api-Key": api_key, "Content-Type": "application/json"}
        payload = {
            "image_request": {
                "prompt": prompt,
                "model": "V_2",
                "style_type": "DESIGN",
                "aspect_ratio": "ASPECT_1_1",
            }
        }

        async with httpx.AsyncClient(timeout=60.0) as client:
            resp = await client.post(
                "https://api.ideogram.ai/generate",
                headers=headers,
                json=payload,
            )
            resp.raise_for_status()
            data = resp.json()

            images = data.get("data", [])
            if images and len(images) > 0:
                image_url = images[0].get("url")
                if image_url:
                    img_resp = await client.get(image_url)
                    image_data = base64.b64encode(img_resp.content).decode("utf-8")
                    set_cached_image(cache_key, image_data)
                    logger.info("[IDEOGRAM] Image generated via Ideogram V2")
                    return image_data

        logger.warning("[IDEOGRAM] No image in response")
        return None
    except Exception as e:
        logger.error(f"[IDEOGRAM] Generation failed: {e}")
        return None


# ============================================================================
# MAIN INTERFACE - generate_image() with per-asset routing
# ============================================================================

async def generate_image(
    prompt: str,
    persona_id: str,
    asset_type: str,   # "header", "tarot", "sigil", "divider"
    size: str = "1024x1024",
    tier: str = "standard",
    openai_client=None  # Legacy param, ignored — uses OPENAI_API_KEY directly
) -> Optional[str]:
    """
    Main image generation interface with tier-aware per-asset-type provider routing.

    Standard tier routing:
        header  → Google Gemini (fast, atmospheric)
        tarot   → OpenAI GPT Image 1 (precise, structured)
        sigil   → OpenAI GPT Image 1 (clean geometry)
        divider → Static PNGs (instant)

    Premium tier routing:
        header  → fal.ai Flux Pro (cinematic, high-detail)
        tarot   → OpenAI GPT Image 1 (precise, structured)
        sigil   → Ideogram V2 (clean geometric design)
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

    # Get provider for this asset type + tier
    provider = get_image_provider(asset_type, tier)

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

    # fal.ai Flux Pro (YOUR key) — premium headers
    if provider == ImageProvider.FLUX:
        fal_size = "landscape_16_9" if asset_type == "header" else "square"
        result = await _generate_fal(prompt, cache_key, fal_size)
        if result:
            return result
        logger.info(f"[FAL] Failed, falling back to Gemini for {asset_type}")
        result = await _generate_gemini(prompt, cache_key)
        if result:
            return result
        return None

    # Ideogram V2 (YOUR key) — premium sigils
    if provider == ImageProvider.IDEOGRAM:
        result = await _generate_ideogram(prompt, cache_key)
        if result:
            return result
        logger.info(f"[IDEOGRAM] Failed, falling back to OpenAI for {asset_type}")
        result = await _generate_openai(prompt, cache_key, size)
        if result:
            return result
        return None

    # Google Gemini (YOUR key)
    if provider == ImageProvider.GEMINI:
        result = await _generate_gemini(prompt, cache_key)
        if result:
            return result
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
        logger.info(f"[OPENAI] Failed, falling back to Gemini for {asset_type}")
        result = await _generate_gemini(prompt, cache_key)
        if result:
            return result
        return None

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
