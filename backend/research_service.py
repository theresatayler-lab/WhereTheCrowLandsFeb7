# Research Service - Dual-Model Architecture
# DeepSeek for research/factual content, OpenAI for persona voice

import os
import logging
import time
from typing import Dict, List, Optional, Any
from openai import AsyncOpenAI
from pydantic import BaseModel, Field

logger = logging.getLogger(__name__)

# ============================================================================
# Provider Configuration
# ============================================================================

DEEPSEEK_BASE_URL = "https://api.deepseek.com"
DEEPSEEK_MODEL = "deepseek-chat"
OPENAI_MODEL = "gpt-4o"

def get_provider_status() -> Dict[str, Any]:
    """Return configuration status for all providers"""
    return {
        "openai_configured": bool(os.environ.get('OPENAI_API_KEY')),
        "deepseek_configured": bool(os.environ.get('DEEPSEEK_API_KEY')),
        "deepseek_base_url": DEEPSEEK_BASE_URL,
        "deepseek_model": DEEPSEEK_MODEL,
        "openai_model": OPENAI_MODEL,
        "image_provider": os.environ.get('IMAGE_PROVIDER', 'library')
    }

# ============================================================================
# Pydantic Models
# ============================================================================

class ResearchRequest(BaseModel):
    query: str
    context: Optional[str] = None

class ResearchResponse(BaseModel):
    answer: str
    bullets: List[str]
    sources: List[str]

class SpellbookRequest(BaseModel):
    user_request: str
    persona: str
    tone: str = "gentle"

class SpellbookResponse(BaseModel):
    response: str
    persona_name: str
    tone_used: str

class CombinedRequest(BaseModel):
    user_request: str
    persona: str = "shigg"
    tone: str = "gentle"
    context: Optional[str] = None

class CombinedResponse(BaseModel):
    spellbook_response: str
    research_origins: Dict[str, Any]
    persona_used: str

# ============================================================================
# DeepSeek Client (Research Engine)
# ============================================================================

def get_deepseek_client() -> Optional[AsyncOpenAI]:
    """Initialize DeepSeek client using OpenAI-compatible API"""
    api_key = os.environ.get('DEEPSEEK_API_KEY')
    if not api_key:
        logger.warning("DEEPSEEK_API_KEY not found in environment variables")
        return None
    return AsyncOpenAI(
        api_key=api_key,
        base_url="https://api.deepseek.com"
    )

def get_openai_client() -> Optional[AsyncOpenAI]:
    """Get OpenAI client for persona voice"""
    api_key = os.environ.get('OPENAI_API_KEY')
    if not api_key:
        logger.warning("OPENAI_API_KEY not found in environment variables")
        return None
    return AsyncOpenAI(api_key=api_key)

# ============================================================================
# Research Engine (DeepSeek)
# ============================================================================

RESEARCH_SYSTEM_PROMPT = """You are a scholarly research assistant specializing in folk magic, domestic ritual traditions, British mysticism, and historical occult practices.

Your role is to provide:
1. Factual, well-researched information about magical traditions, their origins, and historical context
2. Academic-quality explanations of ritual practices and their cultural significance
3. Connections between historical practices and modern adaptations

When responding:
- Be thorough but accessible
- Cite traditions, time periods, and cultural contexts
- Suggest relevant books, authors, and academic resources for further reading
- If you cannot verify specific facts, indicate uncertainty with phrases like "traditionally believed to be" or "according to folk tradition"
- Structure your response with clear bullet points and sources

IMPORTANT: For sources, provide author names, book titles, or academic references that would help someone research further. These are "suggested citations" - directions for further reading, not live links."""

async def research_query(query: str, context: Optional[str] = None) -> ResearchResponse:
    """Query DeepSeek for research/factual information"""
    start_time = time.time()
    endpoint_name = "/api/research"
    provider = "deepseek"
    
    logger.info(f"[PROVIDER_CALL] endpoint={endpoint_name} provider={provider} base_url={DEEPSEEK_BASE_URL} model={DEEPSEEK_MODEL}")
    
    client = get_deepseek_client()
    
    if not client:
        elapsed = time.time() - start_time
        logger.warning(f"[PROVIDER_CALL] endpoint={endpoint_name} provider={provider} status=NOT_CONFIGURED timing={elapsed:.3f}s")
        return ResearchResponse(
            answer="Research engine not configured. Please add DEEPSEEK_API_KEY to environment variables.",
            bullets=["DeepSeek API key required for research features"],
            sources=["Configuration required"]
        )
    
    # Build the user message
    user_message = f"Research Query: {query}"
    if context:
        user_message = f"Context: {context}\n\n{user_message}"
    
    user_message += """

Please provide:
1. A clear, informative answer (2-3 paragraphs)
2. Key bullet points summarizing the main facts
3. Suggested sources for further reading (books, authors, academic papers, traditions)

Format your response as JSON with this structure:
{
    "answer": "Your detailed answer here...",
    "bullets": ["Key point 1", "Key point 2", "Key point 3"],
    "sources": ["Author Name - 'Book Title'", "Academic source", "Traditional reference"]
}"""

    try:
        response = await client.chat.completions.create(
            model=DEEPSEEK_MODEL,
            messages=[
                {"role": "system", "content": RESEARCH_SYSTEM_PROMPT},
                {"role": "user", "content": user_message}
            ],
            temperature=0.7,
            max_tokens=1500,
            response_format={"type": "json_object"}
        )
        
        elapsed = time.time() - start_time
        logger.info(f"[PROVIDER_CALL] endpoint={endpoint_name} provider={provider} status=SUCCESS timing={elapsed:.3f}s")
        
        import json
        result = json.loads(response.choices[0].message.content)
        
        return ResearchResponse(
            answer=result.get("answer", "No answer provided"),
            bullets=result.get("bullets", []),
            sources=result.get("sources", [])
        )
        
    except Exception as e:
        logger.error(f"DeepSeek research error: {str(e)}")
        return ResearchResponse(
            answer=f"Research query failed: {str(e)}",
            bullets=[],
            sources=[]
        )

# ============================================================================
# Spellbook Voice (OpenAI)
# ============================================================================

PERSONA_VOICES = {
    "shigg": {
        "name": "Shigg",
        "system_prompt": """You ARE Shigg, wise grandmother of Where The Crowlands. You speak with gentle warmth, bird metaphors, and domestic magic wisdom. Your voice is dawn-quiet, poetic, full of gentle humour and deep love.

Your phrases include:
- "A bird knows..." 
- "Dawn-quiet wisdom"
- "Cup of tea and a moment's peace"
- References to feathers, nests, hearth-fires

You offer comfort through tea rituals, bird omens, and the gentle magic of everyday domestic acts."""
    },
    "cathleen": {
        "name": "Cathleen", 
        "system_prompt": """You ARE Cathleen, The Singer of Strength. Your voice carries the power of song—protection woven into breath and air. You speak with discretion and maternal warmth, never condescending.

Your phrases include:
- "Strength is not the absence of softness"
- "The dead are not gone; they simply wait in the next room"
- References to singing, humming protection, the Morrigan

You help seekers find their voice and face transformation."""
    },
    "katherine": {
        "name": "Katherine",
        "system_prompt": """You ARE Katherine, The Weaver of Hidden Knowledge. Elegant, slightly feline, you speak with Victorian precision and occult wisdom. Your voice carries the authority of the Golden Dawn and the intimacy of the home circle.

Your phrases include:
- "Every stitch carries intention"
- "The mirror shows what eyes cannot"
- References to thread, needles, seams, thresholds

You guide seekers through shadow work with unflinching honesty and compassion."""
    },
    "theresa": {
        "name": "Theresa",
        "system_prompt": """You ARE Theresa, The Seer & Storyteller. You carry the accumulated wisdom of your grandmother Katherine, your great-grandmother Cathleen, and your great-great-grandmother Shigg. You speak with the voice of one who has heard all their stories.

Your phrases include:
- "The stories never lied"
- "They told me once..."
- References to genealogy, family secrets, photographs, inherited objects

You help seekers uncover truth and connect with ancestral wisdom."""
    }
}

async def generate_spellbook_response(user_request: str, persona: str, tone: str) -> SpellbookResponse:
    """Generate persona-voiced spellbook response using OpenAI"""
    client = get_openai_client()
    
    if not client:
        return SpellbookResponse(
            response="Persona voice not configured. Please add OPENAI_API_KEY to environment variables.",
            persona_name="System",
            tone_used=tone
        )
    
    # Get persona configuration
    persona_config = PERSONA_VOICES.get(persona.lower(), PERSONA_VOICES["shigg"])
    
    # Build tone guidance
    tone_guidance = {
        "gentle": "Respond with soft, nurturing energy. Be invitational and tender.",
        "practical": "Respond with clear, direct guidance. Be grounded and actionable.",
        "intense": "Respond with powerful, unflinching wisdom. Go deep and don't soften the truth."
    }
    
    system_message = f"""{persona_config['system_prompt']}

TONE FOR THIS RESPONSE: {tone_guidance.get(tone, tone_guidance['gentle'])}

Write in-character, as if speaking directly to the seeker. Include:
- A warm acknowledgment of their need
- Guidance in your authentic voice
- An invitation to return"""

    try:
        response = await client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": system_message},
                {"role": "user", "content": user_request}
            ],
            temperature=0.8,
            max_tokens=1000
        )
        
        return SpellbookResponse(
            response=response.choices[0].message.content,
            persona_name=persona_config['name'],
            tone_used=tone
        )
        
    except Exception as e:
        logger.error(f"OpenAI spellbook error: {str(e)}")
        return SpellbookResponse(
            response=f"Failed to generate response: {str(e)}",
            persona_name=persona_config['name'],
            tone_used=tone
        )

# ============================================================================
# Combined Service (Both Engines)
# ============================================================================

async def generate_combined_response(
    user_request: str,
    persona: str = "shigg",
    tone: str = "gentle",
    context: Optional[str] = None
) -> CombinedResponse:
    """Generate combined response using both DeepSeek (research) and OpenAI (persona)"""
    import asyncio
    
    # Prepare research query based on user request
    research_query_text = f"What are the historical and folk magic traditions related to: {user_request}"
    if context:
        research_query_text = f"{research_query_text}. Additional context: {context}"
    
    # Run both queries concurrently
    research_task = research_query(research_query_text, context)
    spellbook_task = generate_spellbook_response(user_request, persona, tone)
    
    research_result, spellbook_result = await asyncio.gather(research_task, spellbook_task)
    
    return CombinedResponse(
        spellbook_response=spellbook_result.response,
        research_origins={
            "answer": research_result.answer,
            "bullets": research_result.bullets,
            "sources": research_result.sources
        },
        persona_used=spellbook_result.persona_name
    )
