# WHERE THE CROWLANDS - Spell Tier & LLM Provider System
## Copy-Paste Reference Document

> **Source files:** `backend/spell_tiers.py`, `backend/llm_providers.py`

---

## TIER SYSTEM OVERVIEW

Three tiers route spells to different AI model chains based on context.

| Tier | Time | Cost | Research | Reasoning | Writer | Storyteller |
|------|------|------|----------|-----------|--------|-------------|
| **QUICK** | 15-25s | ~$0.02 | DeepSeek (800 tok, 0.5 temp) | — | Claude Sonnet (1500 tok, 0.7 temp) | — |
| **STANDARD** | 30-45s | ~$0.05 | DeepSeek (1200 tok, 0.6 temp) | — | Claude Sonnet (2500 tok, 0.8 temp) | Claude Sonnet (1000 tok) |
| **DEEP** | 60-90s | ~$0.15 | DeepSeek (2000 tok, 0.7 temp) | Claude Opus (1500 tok) | Claude Sonnet (3500 tok, 0.85 temp) | Claude Sonnet (1500 tok) |

---

## TIER SELECTION LOGIC

Priority order (first match wins):

### 1. Explicit User Choice
- User can select `quick`, `standard`, or `deep`
- Deep requires Pro/Paid subscription; free users get Standard instead

### 2. First Spell Bonus
- First spell ever → DEEP (make a great first impression)

### 3. Pro Users + Deep Intentions
- Pro/Paid users with deep trigger keywords → DEEP

### 4. Deep Trigger Keywords
Any of these in the intention triggers upgrade:
```
ancestor, ancestral, spirit, death, deceased, departed,
protection, ward, shield, boundary, banish,
binding, curse, hex, revenge,
séance, medium, channeling, communication,
initiation, dedication, oath,
complex, deep, thorough, research, full ritual
```
- Pro users → DEEP
- Free users → STANDARD (with "upgrade to Pro" message)

### 5. Katherine Default
- Katherine always gets at least STANDARD (requires research)
- Pro users with Katherine → DEEP

### 6. Quick Eligible Keywords
Simple intentions suitable for quick spells:
```
calm, peace, relax, focus, energy, morning,
simple, quick, fast, daily, routine,
tea, candle, breath, ground, center
```

### 7. Persona Defaults
| Guide | Default Tier | Reason |
|-------|-------------|--------|
| Shigg | STANDARD | Cozy, domestic — doesn't need deep research |
| Cathleen | STANDARD | Voice-focused, needs good prose |
| Katherine | DEEP | Academic spiritualist — needs sources! |
| Theresa | STANDARD | Family lore, can go deep for ancestral |

---

## LLM PROVIDER CONFIGURATION

### Provider Routing Table

| Purpose | Provider | Model | Temp | Max Tokens |
|---------|----------|-------|------|------------|
| **Persona Voice** | Anthropic | claude-sonnet-4-20250514 | 0.8 | 2000 |
| **Research** | DeepSeek | deepseek-chat | 0.3 | 3000 |
| **Spell Planner** | Anthropic | claude-haiku-4-5-20251001 | 0.7 | 2500 |
| **Spell Writer** | Anthropic | claude-sonnet-4-20250514 | 0.85 | 3500 |
| **Invisible Helpers Writer** | Anthropic | claude-sonnet-4-20250514 | 0.7 | 1800 |

### Provider Endpoints
| Provider | Endpoint |
|----------|----------|
| OpenAI | https://api.openai.com/v1 |
| DeepSeek | https://api.deepseek.com |
| Anthropic | https://api.anthropic.com |
| Gemini | https://generativelanguage.googleapis.com |

### Environment Variables Required
| Variable | Provider |
|----------|----------|
| `ANTHROPIC_API_KEY` | Anthropic (text: persona voice, spell writer, planner, invisible helpers) |
| `DEEPSEEK_API_KEY` | DeepSeek (text: research/archivist) |
| `OPENAI_API_KEY` | OpenAI (images: tarot cards, sigils) |
| `GOOGLE_API_KEY` | Google Gemini (images: headers, atmospheric scenes) |
| `FAL_API_KEY` | fal.ai Flux Pro (images: premium headers) |
| `IDEOGRAM_API_KEY` | Ideogram V2 (images: premium sigils) |

### Routing Priority
1. **Anthropic Direct** — All text generation (Claude Sonnet for writing, Claude Haiku for planning)
2. **DeepSeek Direct** — OpenAI-compatible API for research; supports `response_format` and other kwargs
3. **GPT-4o Fallback** — When Claude/DeepSeek unavailable

### Fallback Configuration
When Claude/DeepSeek are unavailable:
```python
FALLBACK_CONFIG = {
    "research_model": "gpt-4o",
    "writer_model": "gpt-4o",
    "note": "Fallback mode - Claude/DeepSeek unavailable"
}
```

---

## COST ESTIMATES (per spell)

Based on current API pricing (approximate, per 1M tokens):

| Model | Cost/1M Tokens |
|-------|---------------|
| deepseek-chat | $0.50 |
| claude-sonnet-4-20250514 | $15.00 |
| claude-opus-4-20250514 | $75.00 |
| gpt-4o | $25.00 |

### Per-Spell Cost Breakdown

**QUICK Tier:**
| Component | Tokens | Cost |
|-----------|--------|------|
| Research (DeepSeek) | 800 | $0.000400 |
| Writer (Claude Sonnet) | 1500 | $0.022500 |
| **Total** | | **~$0.023** |
| Spells per dollar | | ~43 |

**STANDARD Tier:**
| Component | Tokens | Cost |
|-----------|--------|------|
| Research (DeepSeek) | 1200 | $0.000600 |
| Writer (Claude Sonnet) | 2500 | $0.037500 |
| Storyteller (Claude Sonnet) | 1000 | $0.015000 |
| **Total** | | **~$0.053** |
| Spells per dollar | | ~19 |

**DEEP Tier:**
| Component | Tokens | Cost |
|-----------|--------|------|
| Research (DeepSeek) | 2000 | $0.001000 |
| Reasoning (Claude Opus) | 1500 | $0.112500 |
| Writer (Claude Sonnet) | 3500 | $0.052500 |
| Storyteller (Claude Sonnet) | 1500 | $0.022500 |
| **Total** | | **~$0.189** |
| Spells per dollar | | ~5 |

---

## CONVENIENCE FUNCTIONS

```python
# Generate persona-voiced response (OpenAI)
await persona_voice(system_message, user_message)

# Generate research response (DeepSeek)
await research_query(system_message, user_message)

# Generate spell plan (OpenAI)
await spell_planner(system_message, user_message)

# Generate spell content (Anthropic Claude)
await spell_writer(system_message, user_message)
```

### Unified Interface
```python
await chat_completion(
    purpose="spell_writer",      # Key from PROVIDER_CONFIG
    system_message="...",
    user_message="...",
    override_config={            # Optional overrides
        "temperature": 0.9,
        "max_tokens": 4000,
        "response_format": {"type": "json_object"}
    }
)
```

---

## LLM STATUS ENDPOINT

Returns current configuration status:
```json
{
    "anthropic_configured": true,
    "deepseek_configured": true,
    "google_configured": true,
    "openai_configured": true,
    "current_config": {
        "persona_voice": {"provider": "anthropic", "model": "claude-sonnet-4-20250514"},
        "research": {"provider": "deepseek", "model": "deepseek-chat"},
        "spell_planner": {"provider": "anthropic", "model": "claude-haiku-4-5-20251001"},
        "spell_writer": {"provider": "anthropic", "model": "claude-sonnet-4-20250514"},
        "invisible_helpers_writer": {"provider": "anthropic", "model": "claude-sonnet-4-20250514"}
    }
}
```

---

*Generated from backend/spell_tiers.py and backend/llm_providers.py*
