# Image Provider Abstraction
# Single interface for all image generation with provider switching
# Providers: library (static), dalle, flux (future)
# Config: IMAGE_PROVIDER env var

import os
import hashlib
import json
import logging
from typing import Optional, Dict, Any
from enum import Enum

class ImageProvider(Enum):
    LIBRARY = "library"  # Static pre-made images
    DALLE = "dalle"      # OpenAI DALL-E 3
    FLUX = "flux"        # Future: fal.ai/Flux (not implemented)

# Get provider from env, default to library for speed
def get_image_provider() -> ImageProvider:
    provider = os.environ.get("IMAGE_PROVIDER", "library").lower()
    if provider == "dalle":
        return ImageProvider.DALLE
    elif provider == "flux":
        return ImageProvider.FLUX
    return ImageProvider.LIBRARY

# ============================================================================
# STATIC IMAGE LIBRARY - Pre-made ornaments, dividers, fallback images
# These are used when IMAGE_PROVIDER=library OR as fallbacks
# ============================================================================

STATIC_DIVIDERS = {
    "shigg": [
        "https://customer-assets.emergentagent.com/job_mystic-grimoire-1/artifacts/jcxzlb20_SiteOverallCorners%20and%20any%20borders.png",
    ],
    "cathleen": [
        "https://customer-assets.emergentagent.com/job_mystic-grimoire-1/artifacts/12ds6wfx_CathleenBorder.png",
    ],
    "katherine": [
        "https://customer-assets.emergentagent.com/job_mystic-grimoire-1/artifacts/85szfipf_KateBorder.png",
    ],
    "theresa": [
        "https://customer-assets.emergentagent.com/job_mystic-grimoire-1/artifacts/8jgu6o97_TheresaBorder.png",
    ],
    "default": [
        "https://customer-assets.emergentagent.com/job_mystic-grimoire-1/artifacts/jcxzlb20_SiteOverallCorners%20and%20any%20borders.png",
    ]
}

STATIC_CORNER_ORNAMENTS = {
    "crow_celtic": "https://customer-assets.emergentagent.com/job_mystic-grimoire-1/artifacts/jcxzlb20_SiteOverallCorners%20and%20any%20borders.png",
    "cathleen_scroll": "https://customer-assets.emergentagent.com/job_mystic-grimoire-1/artifacts/12ds6wfx_CathleenBorder.png",
    "katherine_geo": "https://customer-assets.emergentagent.com/job_mystic-grimoire-1/artifacts/85szfipf_KateBorder.png",
    "theresa_organic": "https://customer-assets.emergentagent.com/job_mystic-grimoire-1/artifacts/8jgu6o97_TheresaBorder.png",
}

# Placeholder static images for library mode (to be replaced with real Midjourney assets)
STATIC_HEADERS = {
    "shigg": [],  # Add Midjourney URLs here in phase 2
    "cathleen": [],
    "katherine": [],
    "theresa": [],
}

STATIC_TAROT = {
    "shigg": [],  # Add Midjourney URLs here in phase 2
    "cathleen": [],
    "katherine": [],
    "theresa": [],
}

STATIC_SIGILS = {
    "shigg": [],  # Add Midjourney URLs here in phase 2
    "cathleen": [],
    "katherine": [],
    "theresa": [],
}

# ============================================================================
# IMAGE CACHE - Hash-based caching to avoid regenerating same images
# ============================================================================

_image_cache: Dict[str, str] = {}

def get_cache_key(prompt: str, persona: str, asset_type: str, size: str = "1024x1024") -> str:
    """Generate cache key from prompt + persona + asset_type"""
    content = f"{prompt}|{persona}|{asset_type}|{size}"
    return hashlib.md5(content.encode()).hexdigest()

def get_cached_image(cache_key: str) -> Optional[str]:
    """Get image from cache if exists"""
    return _image_cache.get(cache_key)

def set_cached_image(cache_key: str, image_data: str):
    """Store image in cache"""
    _image_cache[cache_key] = image_data
    # Limit cache size to prevent memory issues
    if len(_image_cache) > 100:
        # Remove oldest entries (simple FIFO)
        keys = list(_image_cache.keys())
        for k in keys[:20]:
            del _image_cache[k]

# ============================================================================
# STATIC LIBRARY FUNCTIONS
# ============================================================================

def get_static_divider(persona_id: str) -> Optional[str]:
    """Get a static divider URL for the persona"""
    dividers = STATIC_DIVIDERS.get(persona_id, STATIC_DIVIDERS["default"])
    if dividers:
        import random
        return random.choice(dividers)
    return None

def get_static_header(persona_id: str) -> Optional[str]:
    """Get a static header URL for the persona (if available)"""
    headers = STATIC_HEADERS.get(persona_id, [])
    if headers:
        import random
        return random.choice(headers)
    return None

def get_static_tarot(persona_id: str) -> Optional[str]:
    """Get a static tarot URL for the persona (if available)"""
    tarots = STATIC_TAROT.get(persona_id, [])
    if tarots:
        import random
        return random.choice(tarots)
    return None

def get_static_sigil(persona_id: str) -> Optional[str]:
    """Get a static sigil URL for the persona (if available)"""
    sigils = STATIC_SIGILS.get(persona_id, [])
    if sigils:
        import random
        return random.choice(sigils)
    return None

def get_corner_ornament(style: str = "crow_celtic") -> str:
    """Get corner ornament URL"""
    return STATIC_CORNER_ORNAMENTS.get(style, STATIC_CORNER_ORNAMENTS["crow_celtic"])

# ============================================================================
# MAIN INTERFACE - generate() function
# ============================================================================

async def generate_image(
    prompt: str,
    persona_id: str,
    asset_type: str,  # "header", "tarot", "sigil", "divider"
    size: str = "1024x1024",
    openai_client = None
) -> Optional[str]:
    """
    Main image generation interface.
    
    Returns:
        - base64 image data (for DALL-E)
        - URL string (for static library)
        - None if generation fails
    
    Provider logic:
        1. LIBRARY: Return static image if available, else fall back to DALL-E
        2. DALLE: Generate with OpenAI, use cache if available
        3. FLUX: (Future) Use fal.ai
    """
    provider = get_image_provider()
    
    # Always use static dividers - never generate
    if asset_type == "divider":
        static_url = get_static_divider(persona_id)
        if static_url:
            return f"STATIC_URL:{static_url}"
        # No static divider available - this shouldn't happen
        logging.warning(f"No static divider for persona {persona_id}")
        return None
    
    # Check cache first
    cache_key = get_cache_key(prompt, persona_id, asset_type, size)
    cached = get_cached_image(cache_key)
    if cached:
        logging.info(f"[CACHE HIT] {asset_type} for {persona_id}")
        return cached
    
    # Library mode - try static first
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
        
        # Fall back to DALL-E if no static image available
        logging.info(f"[LIBRARY] No static {asset_type} for {persona_id}, falling back to DALL-E")
        provider = ImageProvider.DALLE
    
    # DALL-E generation
    if provider == ImageProvider.DALLE:
        if not openai_client:
            logging.error("OpenAI client not provided for DALL-E generation")
            return None
        
        try:
            response = await openai_client.images.generate(
                model="dall-e-3",
                prompt=prompt,
                size=size,
                quality="standard",
                n=1,
                response_format="b64_json"
            )
            
            if response.data and len(response.data) > 0:
                image_data = response.data[0].b64_json
                set_cached_image(cache_key, image_data)
                return image_data
        except Exception as e:
            logging.error(f"DALL-E generation failed: {e}")
            return None
    
    # FLUX (future)
    if provider == ImageProvider.FLUX:
        logging.warning("Flux provider not yet implemented, falling back to DALL-E")
        # Fall back to DALL-E
        if openai_client:
            return await generate_image(prompt, persona_id, asset_type, size, openai_client)
        return None
    
    return None

# ============================================================================
# HELPER - Check if image is static URL or base64
# ============================================================================

def is_static_url(image_data: str) -> bool:
    """Check if image data is a static URL (vs base64)"""
    return image_data and image_data.startswith("STATIC_URL:")

def get_url_from_static(image_data: str) -> str:
    """Extract URL from STATIC_URL: prefix"""
    if is_static_url(image_data):
        return image_data.replace("STATIC_URL:", "")
    return image_data
