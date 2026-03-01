# Migrate Where The Crowlands from OpenAI to Anthropic + DeepSeek

**Goal:** Remove all OpenAI/GPT-4o dependency. Use Anthropic Claude models for all text generation. Keep DeepSeek for research. Keep `openai` Python package only as the DeepSeek SDK (it uses the OpenAI-compatible API).

**Image generation:** DALL-E calls switch to static library mode (already built). No Anthropic image API exists, so images come from your existing static assets or a future Midjourney/Flux integration.

---

## MODEL MAPPING

| Current (OpenAI)       | Replacement (Anthropic)        | Why                                          |
|------------------------|--------------------------------|----------------------------------------------|
| `gpt-4o` (writer)     | `claude-sonnet-4-20250514`     | Already your primary writer; now sole writer  |
| `gpt-4o` (planner)    | `claude-haiku-4-5-20251001`    | Fast, cheap, great at structured JSON output  |
| `gpt-4o-mini` (planner) | `claude-haiku-4-5-20251001`  | Direct replacement for fast planning          |
| `gpt-4o` (chat/oracle) | `claude-sonnet-4-20250514`    | Best for creative persona voice               |
| `gpt-4o` (persona voice) | `claude-sonnet-4-20250514`  | Rich character voice, no fallback needed      |
| `dall-e-3` (images)   | Static library / skip          | No Anthropic image API; use existing assets   |
| `deepseek-chat`        | `deepseek-chat` (KEEP)        | Still the best for cheap research             |

### Spell Pipeline After Migration

```
Stage 1: ARCHIVIST  -> DeepSeek (deepseek-chat)     [UNCHANGED]
Stage 2: PLANNER    -> Claude Haiku 4.5              [WAS: gpt-4o / gpt-4o-mini]
Stage 3: WRITER     -> Claude Sonnet 4               [WAS: Claude primary + GPT-4o fallback]
Stage 4: QA         -> Programmatic                  [UNCHANGED]
```

### Feature Endpoints After Migration

```
/ai/chat              -> Claude Sonnet 4    [WAS: gpt-4o]
/ai/bird-oracle       -> Claude Sonnet 4    [WAS: gpt-4o]
/ai/corrie-tarot      -> Claude Sonnet 4    [WAS: gpt-4o]
/ai/cobbles-oracle    -> Claude Sonnet 4    [WAS: gpt-4o]
/ai/suggest-ward      -> Claude Sonnet 4    [WAS: gpt-4o]
/spellbook            -> Claude Sonnet 4    [WAS: gpt-4o]
/ai/generate-spell    -> Claude Sonnet 4    [WAS: gpt-4o]
/ai/generate-spell-v3 -> Claude Sonnet 4    [WAS: gpt-4o + Claude]
```

---

## ENVIRONMENT VARIABLES

Make sure Emergent has these keys set in your backend `.env`:

```bash
# REQUIRED - Your Anthropic key (used for ALL text generation)
ANTHROPIC_API_KEY=sk-ant-your-key-here

# REQUIRED - Your DeepSeek key (used for research/archivist stage)
DEEPSEEK_API_KEY=sk-your-deepseek-key-here

# OPTIONAL - Keep if you want DALL-E image generation in the future
# OPENAI_API_KEY=sk-your-openai-key-here

# Set image provider to static library (no OpenAI images needed)
IMAGE_PROVIDER=library
```

**Tell Emergent:** "Set `ANTHROPIC_API_KEY` and `DEEPSEEK_API_KEY` in the backend `.env` file. Remove or comment out `OPENAI_API_KEY`. Set `IMAGE_PROVIDER=library`."

---

## FILE-BY-FILE CHANGES

### FILE 1: `backend/llm_providers.py` (FULL REPLACEMENT)

Copy and paste this entire file content to replace the existing `backend/llm_providers.py`:

```python
# ============================================================================
# LLM Provider Abstraction Layer
# ============================================================================
# Model-agnostic architecture for easy provider swapping
# Current config: All text = Anthropic Claude, Research = DeepSeek
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
        "provider": "anthropic",
        "model": "claude-sonnet-4-20250514",
        "use_emergent_key": False,
        "temperature": 0.8,
        "max_tokens": 2000
    },
    "research": {
        "provider": "deepseek",
        "model": "deepseek-chat",
        "use_emergent_key": False,
        "temperature": 0.3,
        "max_tokens": 3000
    },
    "spell_planner": {
        "provider": "anthropic",
        "model": "claude-haiku-4-5-20251001",
        "use_emergent_key": False,
        "temperature": 0.7,
        "max_tokens": 2500
    },
    "spell_writer": {
        "provider": "anthropic",
        "model": "claude-sonnet-4-20250514",
        "use_emergent_key": False,
        "temperature": 0.85,
        "max_tokens": 3500
    },
    "invisible_helpers_writer": {
        "provider": "anthropic",
        "model": "claude-sonnet-4-20250514",
        "use_emergent_key": True,
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
    "emergent": "EMERGENT_LLM_KEY"
}

# ============================================================================
# Emergent Integration (Universal Key)
# ============================================================================

async def emergent_chat(
    system_message: str,
    user_message: str,
    provider: str = "anthropic",
    model: str = "claude-sonnet-4-20250514",
    temperature: float = 0.8,
    max_tokens: int = 2000
) -> str:
    """
    Chat completion using Emergent Universal Key
    Supports: anthropic, deepseek
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
    use_emergent = config.get("use_emergent_key", False)

    logger.info(f"[LLM_CALL] purpose={purpose} provider={provider} model={model} emergent={use_emergent}")

    try:
        # Route 1: Emergent Universal Key
        if use_emergent:
            return await emergent_chat(
                system_message=system_message,
                user_message=user_message,
                provider=provider,
                model=model,
                temperature=temperature,
                max_tokens=max_tokens
            )

        # Route 2: DeepSeek (direct client, OpenAI-compatible API)
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
        "emergent_key_configured": bool(os.environ.get('EMERGENT_LLM_KEY')),
        "anthropic_configured": bool(os.environ.get('ANTHROPIC_API_KEY')),
        "deepseek_configured": bool(os.environ.get('DEEPSEEK_API_KEY')),
        "current_config": {
            purpose: {
                "provider": cfg["provider"],
                "model": cfg["model"],
                "uses_emergent": cfg.get("use_emergent_key", False)
            }
            for purpose, cfg in PROVIDER_CONFIG.items()
        }
    }
```

---

### FILE 2: `backend/spell_tiers.py` — Replace ALL GPT model references

Find and replace these exact strings in `backend/spell_tiers.py`:

**Change 1** (line 30, quick tier writer model):
```
OLD:  "model": "gpt-4o",
NEW:  "model": "claude-sonnet-4-20250514",
```

**Change 2** (line 60, standard tier planner model):
```
OLD:  "model": "gpt-4o-mini",  # Faster than gpt-4o for standard
NEW:  "model": "claude-haiku-4-5-20251001",  # Fast, cheap Anthropic planner
```

**Change 3** (line 67, standard tier writer fallback):
```
OLD:  "fallback_model": "gpt-4o",
NEW:  "fallback_model": "claude-sonnet-4-20250514",
```

**Change 4** (line 98, premium tier planner model):
```
OLD:  "model": "gpt-4o",  # Full model for premium
NEW:  "model": "claude-haiku-4-5-20251001",  # Anthropic planner
```

**Change 5** (line 105, premium tier writer fallback):
```
OLD:  "fallback_model": "gpt-4o",
NEW:  "fallback_model": "claude-sonnet-4-20250514",
```

**Change 6** (line 207, default planner model):
```
OLD:  return config.get("stages", {}).get("planner", {}).get("model", "gpt-4o-mini")
NEW:  return config.get("stages", {}).get("planner", {}).get("model", "claude-haiku-4-5-20251001")
```

---

### FILE 3: `backend/prompts/pipeline_blocks.py` — Replace planner models + remove GPT fallback

**Change 1** (line 40, standard tier planner model):
```
OLD:  "planner_model": "gpt-4o-mini",  # Was gpt-4o - faster for standard tier
NEW:  "planner_model": "claude-haiku-4-5-20251001",  # Anthropic planner
```

**Change 2** (line 46, premium tier planner model):
```
OLD:  "planner_model": "gpt-4o",
NEW:  "planner_model": "claude-haiku-4-5-20251001",
```

**Change 3** (lines 195-290, `run_block_planner` function):
The planner currently uses `openai_client.chat.completions.create()`. Replace the entire function with this version that uses Anthropic:

```python
async def run_block_planner(
    spell_spec: dict,
    guide_config: dict,
    research_packet: dict,
    anthropic_client,
    tier: str = "standard"
) -> Tuple[dict, dict]:
    """
    Run the planner stage with block awareness.
    For QUICK tier, skips LLM and uses deterministic plan.
    Uses Anthropic Claude Haiku for planning.

    Returns: (plan, metadata)
    """
    start = time.time()
    guide_id = spell_spec.get("persona_id", "shigg")
    intention = spell_spec.get("user_query", "")

    tier_config = TIER_CONFIG.get(tier, TIER_CONFIG["standard"])
    metadata = {
        "tier": tier,
        "planner_mode": "deterministic" if tier_config["skip_planner_llm"] else "llm"
    }

    # QUICK tier: Use deterministic plan (no LLM call)
    if tier_config["skip_planner_llm"]:
        logger.info(f"[PLANNER_BLOCKS] Using deterministic plan for tier: {tier}")
        plan = build_deterministic_plan(guide_id, intention, research_packet)
        metadata["planner_ms"] = int((time.time() - start) * 1000)
        return plan, metadata

    # STANDARD/PREMIUM: Use LLM planner (Anthropic Claude Haiku)
    model = tier_config["planner_model"]
    logger.info(f"[PLANNER_BLOCKS] Using model: {model} (tier: {tier})")

    # Get working type and required blocks
    working_type = get_working_type(guide_id, intention)
    required_blocks = working_type.get("required_blocks", [])

    # Build block-aware prompt
    blocks_description = "\n".join([
        f"- {block}: {get_block_template(block).get('description', 'Content block')}"
        for block in required_blocks
    ])

    prompt = f"""Plan a spell for guide {guide_id}.

WORKING TYPE: {working_type['name']}
Description: {working_type['description']}

REQUIRED BLOCKS (in order):
{blocks_description}

SEEKER'S INTENTION: {intention}

RESEARCH CONTEXT:
{json.dumps(research_packet.get('facts', [])[:3], indent=2)}

Return JSON with:
- spell_title: Evocative title
- spell_subtitle: Poetic tagline
- working_type: "{working_type['type_id']}"
- section_order: {json.dumps(required_blocks)}
- materials_plan: [{{"name": "...", "purpose": "...", "substitution": "..."}}]
- step_outline: Brief outline for each block
- persona_lock: {{"props": [...], "sensory_cue": "...", "signature_move": "..."}}
"""

    try:
        if not anthropic_client:
            raise ValueError("Anthropic client not available")

        response = await anthropic_client.messages.create(
            model=model,
            max_tokens=1500,
            system="You are a spell planner. Return ONLY valid JSON.",
            messages=[{"role": "user", "content": prompt}]
        )

        result_text = response.content[0].text
        result_text = clean_json_response(result_text)
        result_text = repair_truncated_json(result_text)
        plan = json.loads(result_text)

        # Ensure working_type is set
        plan["working_type"] = working_type["type_id"]
        plan["guide_id"] = guide_id
        plan["planner_mode"] = "llm"

    except Exception as e:
        logger.error(f"[PLANNER_BLOCKS] Error: {e}")
        # Fallback to deterministic plan
        plan = build_deterministic_plan(guide_id, intention, research_packet)
        plan["planner_mode"] = "deterministic_fallback"

    metadata["planner_ms"] = int((time.time() - start) * 1000)
    return plan, metadata
```

**Change 4** (lines 402-463, `run_block_writer` function):
Replace the entire function. This removes the GPT-4o fallback and uses only Anthropic:

```python
async def run_block_writer(
    spell_spec: dict,
    guide_config: dict,
    research_packet: dict,
    plan: dict,
    belief_mode: str,
    anthropic_client,
    tier: str = "standard"
) -> Tuple[dict, dict]:
    """
    Run the writer stage with block awareness.
    Uses Anthropic Claude Sonnet as the sole writer.

    Returns: (spell_output, metadata)
    """
    start = time.time()
    guide_id = spell_spec.get("persona_id", "shigg")
    tier_config = TIER_CONFIG.get(tier, TIER_CONFIG["standard"])
    writer_tokens = tier_config.get("writer_tokens", DEFAULT_WRITER_TOKENS)

    metadata = {
        "tier": tier,
        "writer_tokens": writer_tokens
    }

    prompt = build_block_writer_prompt(
        spell_spec, guide_config, research_packet, plan, belief_mode, tier
    )

    if not anthropic_client:
        raise ValueError("Anthropic client not configured - check ANTHROPIC_API_KEY")

    try:
        logger.info(f"[WRITER_BLOCKS] Using Claude Sonnet for writing (tokens: {writer_tokens})")
        response = await anthropic_client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=writer_tokens,
            messages=[{"role": "user", "content": prompt}]
        )
        result_text = response.content[0].text
        metadata["writer_model"] = "claude-sonnet-4"
    except Exception as e:
        logger.error(f"[WRITER_BLOCKS] Claude Sonnet failed: {e}")
        raise

    # Parse and repair JSON
    result_text = clean_json_response(result_text)
    result_text = repair_truncated_json(result_text)

    try:
        spell_output = json.loads(result_text)
    except json.JSONDecodeError as e:
        logger.error(f"[WRITER_BLOCKS] JSON parse error: {e}")
        raise ValueError(f"Failed to parse spell output: {e}")

    # Transform blocks dict to array format for frontend compatibility
    spell_output = transform_blocks_to_array(spell_output, guide_id)

    metadata["writer_ms"] = int((time.time() - start) * 1000)
    return spell_output, metadata
```

**Change 5** (lines 956-971, `BlocksSpellPipeline.__init__`):
Replace the constructor. Remove `openai_client` parameter:

```python
    def __init__(
        self,
        deepseek_client=None,
        anthropic_client=None,
        claude_client=None,
        max_retries: int = 1,
        tier_config: dict = None
    ):
        self.deepseek_client = deepseek_client
        # Support both anthropic_client and claude_client names
        self.anthropic_client = anthropic_client or claude_client
        self.max_retries = max_retries
        self.tier_config = tier_config or {}
        self.timing_log = {}
```

**Change 6** (lines 1015-1028, inside `generate_spell` method):
Update the planner and writer calls to pass `anthropic_client` instead of `openai_client`:

```python
            # Stage 2: Planner
            if on_stage_change:
                await on_stage_change("planner")
            plan, planner_meta = await run_block_planner(
                spell_spec, guide_config, research_packet,
                self.anthropic_client, tier
            )
            metadata["timing"]["planner_ms"] = planner_meta.get("planner_ms", 0)
            metadata["planner_mode"] = planner_meta.get("planner_mode", "unknown")
            metadata["stages_completed"].append("planner")

            # Stage 3: Writer
            if on_stage_change:
                await on_stage_change("writer")
            spell_output, writer_meta = await run_block_writer(
                spell_spec, guide_config, research_packet, plan,
                belief_mode, self.anthropic_client, tier
            )
```

**Change 7** (lines 1158-1173, `generate_spell_blocks` convenience function):
```python
async def generate_spell_blocks(
    spell_spec: dict,
    guide_config: dict,
    anthropic_client=None,
    deepseek_client=None,
    belief_mode: str = "SPIRITUAL",
    tier: str = "standard"
):
    """
    Convenience function to generate a spell using the blocks pipeline.

    Returns: (spell_output, metadata)
    """
    pipeline = BlocksSpellPipeline(
        deepseek_client=deepseek_client,
        anthropic_client=anthropic_client
    )
    return await pipeline.generate_spell(spell_spec, guide_config, belief_mode, tier)
```

---

### FILE 4: `backend/research_service.py` — Switch persona voice from OpenAI to Anthropic

**Change 1** (line 2, file header comment):
```
OLD:  # DeepSeek for research/factual content, OpenAI for persona voice
NEW:  # DeepSeek for research/factual content, Anthropic Claude for persona voice
```

**Change 2** (line 11, import):
```
OLD:  from openai import AsyncOpenAI
NEW:  # openai import kept only for DeepSeek compatibility (OpenAI-compatible API)
      from openai import AsyncOpenAI
```

**Change 3** (line 25, model constant):
```
OLD:  OPENAI_MODEL = "gpt-4o"
NEW:  ANTHROPIC_MODEL = "claude-sonnet-4-20250514"
```

**Change 4** (lines 27-38, `get_provider_status` function):
```python
def get_provider_status() -> Dict[str, Any]:
    """Return configuration status for all providers"""
    status = get_llm_status()
    return {
        "anthropic_configured": status.get("anthropic_configured", False),
        "emergent_configured": status.get("emergent_key_configured", False),
        "deepseek_configured": status.get("deepseek_configured", False),
        "deepseek_base_url": DEEPSEEK_BASE_URL,
        "deepseek_model": DEEPSEEK_MODEL,
        "anthropic_model": ANTHROPIC_MODEL,
        "image_provider": os.environ.get('IMAGE_PROVIDER', 'library'),
        "llm_config": status.get("current_config", {})
    }
```

**Change 5** (line 377, import):
```
OLD:  from llm_providers import get_deepseek_client, get_openai_client
NEW:  from llm_providers import get_deepseek_client, get_anthropic_client
```

**Change 6** (lines 769-770, section header):
```
OLD:  # OpenAI Spellbook Voice
NEW:  # Anthropic Claude Spellbook Voice
```

**Change 7** (lines 820-911, `generate_spellbook_response` function):
Replace the entire function:

```python
async def generate_spellbook_response(user_request: str, persona: str, tone: str, research_facts: List[Dict] = None) -> SpellbookResponse:
    """Generate persona-voiced spellbook response using Anthropic Claude"""
    start_time = time.time()
    endpoint_name = "/api/spellbook"
    provider = "anthropic"

    logger.info(f"[PROVIDER_CALL] endpoint={endpoint_name} provider={provider} persona={persona} has_research_facts={research_facts is not None}")

    client = get_anthropic_client()

    if not client:
        elapsed = time.time() - start_time
        logger.warning(f"[PROVIDER_CALL] endpoint={endpoint_name} provider={provider} status=NOT_CONFIGURED timing={elapsed:.3f}s")
        return SpellbookResponse(
            response="Persona voice not configured. Please add ANTHROPIC_API_KEY to environment variables.",
            persona_name="System",
            tone_used=tone
        )

    persona_config = PERSONA_VOICES.get(persona.lower(), PERSONA_VOICES["shigg"])

    tone_guidance = {
        "gentle": "Respond with soft, nurturing energy. Be invitational and tender.",
        "practical": "Respond with clear, direct guidance. Be grounded and actionable.",
        "intense": "Respond with powerful, unflinching wisdom. Go deep and don't soften the truth."
    }

    # Build research context if provided
    research_context = ""
    if research_facts:
        research_context = """
RESEARCH FACTS TO REFERENCE (do NOT invent beyond these):
Use these facts to explain WHY each practice works. If confidence is "low", use softening language like "some traditions say" or "it's believed that".

"""
        for fact in research_facts[:5]:
            confidence = fact.get("confidence", "medium")
            soften = " (use hedging language)" if confidence == "low" else ""
            research_context += f"- {fact.get('claim', fact.get('text', ''))}{soften}\n"

    system_message = f"""{persona_config['system_prompt']}

TONE FOR THIS RESPONSE: {tone_guidance.get(tone, tone_guidance['gentle'])}
{research_context}

IMPORTANT RULES:
- You may NOT invent historical claims beyond what's in the research facts above
- You may add warmth and persona voice to explain these facts
- If explaining a practice's history, reference the research
- If no research fact covers something, speak from your character's lived experience only

Write in-character, as if speaking directly to the seeker. Include:
- A warm acknowledgment of their need
- Guidance in your authentic voice
- Why the practices work (using research facts where relevant)
- An invitation to return"""

    try:
        response = await client.messages.create(
            model=ANTHROPIC_MODEL,
            max_tokens=1200,
            system=system_message,
            messages=[{"role": "user", "content": user_request}]
        )
        response_text = response.content[0].text

        elapsed = time.time() - start_time
        logger.info(f"[PROVIDER_CALL] endpoint={endpoint_name} provider=anthropic_direct status=SUCCESS timing={elapsed:.3f}s")

        return SpellbookResponse(
            response=response_text,
            persona_name=persona_config['name'],
            tone_used=tone
        )

    except Exception as e:
        elapsed = time.time() - start_time
        logger.error(f"[PROVIDER_CALL] endpoint={endpoint_name} provider=anthropic_direct status=ERROR timing={elapsed:.3f}s error={str(e)}")
        return SpellbookResponse(
            response=f"Failed to generate response: {str(e)}",
            persona_name=persona_config['name'],
            tone_used=tone
        )
```

---

### FILE 5: `backend/server.py` — The big one. Multiple changes.

**Change 1** (line 17, import):
```
OLD:  from openai import AsyncOpenAI
NEW:  import anthropic
```

**Change 2** (lines 72-76, client initialization):
Replace:
```python
OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY', '')

# Initialize OpenAI client (for image generation - kept separate)
openai_client = AsyncOpenAI(api_key=OPENAI_API_KEY)
```
With:
```python
ANTHROPIC_API_KEY = os.environ.get('ANTHROPIC_API_KEY', '')

# Initialize Anthropic client (for all text generation)
anthropic_client = anthropic.AsyncAnthropic(api_key=ANTHROPIC_API_KEY)
```

**Change 3** (lines 84-106, `emergent_chat_completion` function):
Replace the entire function. This is the central wrapper used by ALL chat/oracle/spell endpoints:

```python
# Central wrapper for all text generation (now uses Anthropic Claude)
async def emergent_chat_completion(messages: list, model: str = "claude-sonnet-4-20250514", temperature: float = 0.7, max_tokens: int = 4000) -> str:
    """Central text generation wrapper - routes through Anthropic Claude"""
    system_msg = "You are a helpful assistant."
    user_content = ""

    for msg in messages:
        if msg.get("role") == "system":
            system_msg = msg.get("content", system_msg)
        elif msg.get("role") == "user":
            user_content = msg.get("content", "")

    response = await anthropic_client.messages.create(
        model=model,
        max_tokens=max_tokens,
        system=system_msg,
        messages=[{"role": "user", "content": user_content}]
    )
    return response.content[0].text
```

**Change 4** (every `model="gpt-4o"` in emergent_chat_completion calls):
These are all the places in server.py that call `emergent_chat_completion` with `model="gpt-4o"`. Change each one:

| Line | Endpoint | Change |
|------|----------|--------|
| 2911 | `/ai/chat` | `model="gpt-4o"` -> `model="claude-sonnet-4-20250514"` |
| 3195 | `/ai/bird-oracle` | `model="gpt-4o"` -> `model="claude-sonnet-4-20250514"` |
| 3322 | `/ai/corrie-tarot` | `model="gpt-4o"` -> `model="claude-sonnet-4-20250514"` |
| 3522 | `/ai/cobbles-oracle` | `model="gpt-4o"` -> `model="claude-sonnet-4-20250514"` |
| 3730 | `/ai/suggest-ward` | `model="gpt-4o"` -> `model="claude-sonnet-4-20250514"` |
| 4497 | `/ai/generate-spell` | `model="gpt-4o"` -> `model="claude-sonnet-4-20250514"` |
| 4720 | V3 planner stage | `model="gpt-4o"` -> `model="claude-haiku-4-5-20251001"` |
| 4761 | V3 writer stage | `model="gpt-4o"` -> `model="claude-sonnet-4-20250514"` |

**Change 5** (lines 4529-4537, spell image generation):
Replace DALL-E call with static image:

```python
                # Use static image library (no OpenAI image generation)
                from image_provider import generate_image as gen_img
                image_result = await gen_img(
                    prompt=image_prompt,
                    persona_id=archetype_id or 'shigg',
                    asset_type="header"
                )
                if image_result:
                    from image_provider import is_static_url, get_url_from_static
                    if is_static_url(image_result):
                        # Store URL reference for frontend
                        image_base64 = None  # No base64, use URL
                    else:
                        image_base64 = image_result
```

**Change 6** (lines 4589-4597, standalone image generation endpoint):
Replace DALL-E call:

```python
        # Use static image library
        from image_provider import generate_image as gen_img
        image_result = await gen_img(
            prompt=full_prompt,
            persona_id=getattr(request, 'archetype', 'shigg') or 'shigg',
            asset_type="header"
        )
        if image_result:
            from image_provider import is_static_url, get_url_from_static
            if is_static_url(image_result):
                return {'image_url': get_url_from_static(image_result)}
            return {'image_base64': image_result}
        else:
            raise HTTPException(status_code=500, detail='No image available')
```

**Change 7** (lines 4838-4884, V3 asset generation - header, tarot, sigil):
Replace ALL three DALL-E `openai_client.images.generate()` blocks with static library calls:

```python
                # 1. Header image (static library)
                from image_provider import generate_image as gen_img, is_static_url, get_url_from_static
                header_result = await gen_img(
                    prompt=header_prompt,
                    persona_id=persona_id,
                    asset_type="header"
                )
                if header_result:
                    if is_static_url(header_result):
                        generated_assets['header_image_url'] = get_url_from_static(header_result)
                    else:
                        image_base64 = header_result
                        generated_assets['header_image'] = header_result
                    asset_plan['header_image_generated'] = True

                # 2. Tarot card image (static library)
                tarot_result = await gen_img(
                    prompt=tarot_prompt,
                    persona_id=persona_id,
                    asset_type="tarot"
                )
                if tarot_result:
                    if is_static_url(tarot_result):
                        generated_assets['tarot_card_image_url'] = get_url_from_static(tarot_result)
                    else:
                        generated_assets['tarot_card_image'] = tarot_result
                    asset_plan['tarot_card_image_generated'] = True

                # 3. Sigil (static library)
                sigil_result = await gen_img(
                    prompt=sigil_prompt,
                    persona_id=persona_id,
                    asset_type="sigil"
                )
                if sigil_result:
                    if is_static_url(sigil_result):
                        generated_assets['sigil_url'] = get_url_from_static(sigil_result)
                    else:
                        generated_assets['sigil'] = sigil_result
                    asset_plan['sigil_generated'] = True
```

**Change 8** (lines 5028-5032, V2 pipeline initialization):
```python
OLD:
        pipeline = SpellGenerationPipeline(
            deepseek_client=deepseek_client,
            openai_client=openai_client,
            max_retries=1
        )
NEW:
        pipeline = SpellGenerationPipeline(
            deepseek_client=deepseek_client,
            anthropic_client=anthropic_client,
            max_retries=1
        )
```

**Change 9** (lines 5283-5289, V3 blocks pipeline initialization):
```python
OLD:
        pipeline = BlocksSpellPipeline(
            deepseek_client=deepseek_client,
            openai_client=openai_client,
            claude_client=claude_client,
            max_retries=1,
            tier_config=tier_config
        )
NEW:
        pipeline = BlocksSpellPipeline(
            deepseek_client=deepseek_client,
            anthropic_client=claude_client or anthropic_client,
            max_retries=1,
            tier_config=tier_config
        )
```

**Change 10** (lines 5518-5524, async spell job pipeline):
```python
OLD:
        pipeline = BlocksSpellPipeline(
            deepseek_client=deepseek_client,
            openai_client=openai_client,
            claude_client=claude_client,
            max_retries=1,
            tier_config=tier_config
        )
NEW:
        pipeline = BlocksSpellPipeline(
            deepseek_client=deepseek_client,
            anthropic_client=claude_client or anthropic_client,
            max_retries=1,
            tier_config=tier_config
        )
```

---

### FILE 6: `backend/image_provider.py` — No code changes needed

This file already supports `IMAGE_PROVIDER=library` mode. Just make sure the `.env` has `IMAGE_PROVIDER=library`.

---

## EMERGENT INSTRUCTIONS (COPY-PASTE TO EMERGENT)

```
=== MIGRATION: Remove OpenAI, Use Anthropic + DeepSeek ===

ENVIRONMENT VARIABLES - Set these in backend/.env:
1. ANTHROPIC_API_KEY=sk-ant-[your-anthropic-key]
2. DEEPSEEK_API_KEY=sk-[your-deepseek-key]
3. IMAGE_PROVIDER=library
4. Remove or comment out OPENAI_API_KEY (no longer needed for text)

FILES TO UPDATE (6 files):
1. backend/llm_providers.py - Full replacement (see MIGRATE_TO_ANTHROPIC.md)
2. backend/spell_tiers.py - Replace all gpt-4o/gpt-4o-mini model strings
3. backend/prompts/pipeline_blocks.py - Replace planner + writer functions
4. backend/research_service.py - Switch persona voice from OpenAI to Anthropic
5. backend/server.py - Replace emergent_chat_completion + all model references
6. backend/.env - Update environment variables

MODEL MAPPING:
- gpt-4o (chat/writing) -> claude-sonnet-4-20250514
- gpt-4o-mini (planning) -> claude-haiku-4-5-20251001
- gpt-4o (planning) -> claude-haiku-4-5-20251001
- dall-e-3 (images) -> static image library (IMAGE_PROVIDER=library)
- deepseek-chat (research) -> deepseek-chat (UNCHANGED)

IMPORTANT: The openai Python package is still needed in requirements.txt
because DeepSeek uses the OpenAI-compatible API format. Do NOT remove it.

After making changes: sudo supervisorctl restart backend
```

---

## VERIFICATION STEPS

After Emergent applies all changes:

1. **Check backend starts:**
   ```bash
   sudo supervisorctl restart backend
   tail -50 /var/log/supervisor/backend.err.log
   ```

2. **Check provider status:**
   ```bash
   API_URL=$(grep REACT_APP_BACKEND_URL /app/frontend/.env | cut -d '=' -f2)
   curl -s "$API_URL/api/ai/spell-config-v3" | python3 -m json.tool
   ```

3. **Test a spell generation:**
   ```bash
   curl -s -X POST "$API_URL/api/ai/generate-spell-v3" \
     -H "Content-Type: application/json" \
     -d '{"intention":"a simple calming ritual","persona_id":"shigg","belief_mode":"SPIRITUAL"}' \
     | python3 -m json.tool | head -30
   ```

4. **Grep for remaining OpenAI references** (should only find DeepSeek SDK usage and comments):
   ```bash
   grep -rn "gpt-4o\|OPENAI_API_KEY\|openai_client" backend/*.py backend/prompts/*.py
   ```
