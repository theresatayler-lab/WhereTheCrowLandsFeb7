# Spell Generation Pipeline V2
# Full 4-stage pipeline: Archivist → Planner → Writer → QA
# MIGRATED: Now uses Anthropic Claude instead of OpenAI GPT-4o

import json
import logging
import time
from typing import Dict, Any, Optional, Tuple

from .archivist import build_archivist_prompt, validate_archivist_output, ARCHIVIST_SYSTEM_PROMPT
from .planner import build_planner_prompt_v2, validate_planner_output
from .writer import build_writer_prompt_v2, validate_writer_output, WRITER_CONTRACTS
from .qa import run_qa_validation, build_qa_prompt
from .canon import get_canon_context, get_tradition_tags
from .hard_limits import validate_hard_limits
from .belief_modes import BELIEF_MODES

logger = logging.getLogger(__name__)

# Anthropic model constants (migrated from GPT-4o)
ANTHROPIC_PLANNER_MODEL = "claude-haiku-4-5-20251001"
ANTHROPIC_WRITER_MODEL = "claude-sonnet-4-20250514"


class SpellGenerationPipeline:
    """
    Production-ready spell generation pipeline.
    
    Stages:
    1. ARCHIVIST (DeepSeek) - Research facts, sources, tradition context
    2. PLANNER (Claude Haiku) - Structure, materials, step outline
    3. WRITER (Claude Sonnet) - Full spell content in guide's voice
    4. QA (Programmatic + optional LLM) - Validation and rewrite if needed
    """
    
    def __init__(self, deepseek_client, anthropic_client, max_retries: int = 1):
        self.deepseek_client = deepseek_client
        self.anthropic_client = anthropic_client
        self.max_retries = max_retries
        self.timing_log = {}
    
    async def generate_spell(
        self,
        spell_spec: dict,
        guide_config: dict,
        belief_mode: str = "SPIRITUAL"
    ) -> Tuple[dict, dict]:
        """
        Generate a complete spell through the 4-stage pipeline.
        
        Returns: (spell_output, metadata)
        """
        total_start = time.time()
        guide_id = spell_spec.get("persona_id", "shigg")
        
        # Normalize belief mode
        belief_mode = belief_mode.upper()
        if belief_mode not in BELIEF_MODES:
            belief_mode = "SPIRITUAL"
        
        metadata = {
            "guide_id": guide_id,
            "belief_mode": belief_mode,
            "timing": {},
            "stages_completed": [],
            "retries": 0,
            "qa_report": None
        }
        
        try:
            # === STAGE 1: ARCHIVIST ===
            research_packet = await self._run_archivist(spell_spec, guide_id)
            metadata["stages_completed"].append("archivist")
            metadata["timing"]["archivist_ms"] = self.timing_log.get("archivist_ms", 0)
            
            # === STAGE 2: PLANNER ===
            plan = await self._run_planner(spell_spec, guide_config, research_packet, belief_mode)
            metadata["stages_completed"].append("planner")
            metadata["timing"]["planner_ms"] = self.timing_log.get("planner_ms", 0)
            
            # === STAGE 3: WRITER ===
            spell_output = await self._run_writer(spell_spec, guide_config, research_packet, plan, belief_mode)
            metadata["stages_completed"].append("writer")
            metadata["timing"]["writer_ms"] = self.timing_log.get("writer_ms", 0)
            
            # === STAGE 4: QA ===
            qa_passed, qa_report = run_qa_validation(spell_output, guide_id, belief_mode)
            metadata["qa_report"] = qa_report
            
            if not qa_passed and metadata["retries"] < self.max_retries:
                # Attempt rewrite
                logger.info(f"[PIPELINE] QA failed, attempting rewrite. Violations: {qa_report['violations']}")
                metadata["retries"] += 1
                
                spell_output = await self._run_writer_with_fixes(
                    spell_spec, guide_config, research_packet, plan, 
                    belief_mode, qa_report["rewrite_instructions"]
                )
                
                # Re-validate
                qa_passed, qa_report = run_qa_validation(spell_output, guide_id, belief_mode)
                metadata["qa_report"] = qa_report
            
            metadata["stages_completed"].append("qa")
            metadata["qa_passed"] = qa_passed
            metadata["timing"]["total_ms"] = int((time.time() - total_start) * 1000)
            
            return spell_output, metadata
            
        except Exception as e:
            logger.error(f"[PIPELINE] Error in spell generation: {str(e)}")
            metadata["error"] = str(e)
            metadata["timing"]["total_ms"] = int((time.time() - total_start) * 1000)
            raise
    
    async def _run_archivist(self, spell_spec: dict, guide_id: str) -> dict:
        """Stage 1: Run Archivist research"""
        start = time.time()
        
        # Get canon context for this query
        canon_context = get_canon_context(
            spell_spec.get("user_query", ""),
            guide_id
        )
        
        # Build prompt
        prompt = build_archivist_prompt(
            query=spell_spec.get("user_query", ""),
            guide_id=guide_id,
            materials=spell_spec.get("materials", []),
            anchor_object=spell_spec.get("anchor_object"),
            intent=spell_spec.get("desired_feeling"),
            canon_context=canon_context
        )
        
        # Call DeepSeek
        if self.deepseek_client:
            try:
                response = await self.deepseek_client.chat.completions.create(
                    model="deepseek-chat",
                    messages=[
                        {"role": "system", "content": ARCHIVIST_SYSTEM_PROMPT},
                        {"role": "user", "content": prompt}
                    ],
                    temperature=0.6,
                    max_tokens=2500,
                    response_format={"type": "json_object"}
                )
                
                result_text = response.choices[0].message.content
                research_packet = json.loads(result_text)
                
                # Validate
                is_valid, errors = validate_archivist_output(research_packet)
                if not is_valid:
                    logger.warning(f"[ARCHIVIST] Validation errors: {errors}")
                
            except Exception as e:
                logger.error(f"[ARCHIVIST] Error: {str(e)}")
                research_packet = self._get_fallback_research(spell_spec, guide_id)
        else:
            # Fallback if no DeepSeek client
            research_packet = self._get_fallback_research(spell_spec, guide_id)
        
        self.timing_log["archivist_ms"] = int((time.time() - start) * 1000)
        logger.info(f"[ARCHIVIST] Completed in {self.timing_log['archivist_ms']}ms")
        
        return research_packet
    
    async def _run_planner(
        self, 
        spell_spec: dict, 
        guide_config: dict, 
        research_packet: dict,
        belief_mode: str
    ) -> dict:
        """Stage 2: Run Planner using Anthropic Claude Haiku"""
        start = time.time()
        
        prompt = build_planner_prompt_v2(spell_spec, guide_config, research_packet, belief_mode)
        
        try:
            response = await self.anthropic_client.messages.create(
                model=ANTHROPIC_PLANNER_MODEL,
                max_tokens=2500,
                system="You are a spell planner. Return ONLY valid JSON.",
                messages=[{"role": "user", "content": prompt}]
            )
            
            result_text = response.content[0].text
            result_text = self._clean_json(result_text)
            plan = json.loads(result_text)
            
            # Validate
            is_valid, errors = validate_planner_output(plan)
            if not is_valid:
                logger.warning(f"[PLANNER] Validation errors: {errors}")
                
        except Exception as e:
            logger.error(f"[PLANNER] Error: {str(e)}")
            plan = self._get_fallback_plan(spell_spec, guide_config)
        
        self.timing_log["planner_ms"] = int((time.time() - start) * 1000)
        logger.info(f"[PLANNER] Completed in {self.timing_log['planner_ms']}ms")
        
        return plan
    
    async def _run_writer(
        self,
        spell_spec: dict,
        guide_config: dict,
        research_packet: dict,
        plan: dict,
        belief_mode: str
    ) -> dict:
        """Stage 3: Run Writer using Anthropic Claude Sonnet"""
        start = time.time()
        guide_id = spell_spec.get("persona_id", "shigg")
        
        prompt = build_writer_prompt_v2(spell_spec, guide_config, research_packet, plan, belief_mode)
        contract = WRITER_CONTRACTS.get(guide_id, WRITER_CONTRACTS["shigg"])
        
        try:
            response = await self.anthropic_client.messages.create(
                model=ANTHROPIC_WRITER_MODEL,
                max_tokens=3500,
                system=f"You are {contract['name']}, {contract['title']}. Write spells in your unique voice. Return ONLY valid JSON.",
                messages=[{"role": "user", "content": prompt}]
            )
            
            result_text = response.content[0].text
            result_text = self._clean_json(result_text)
            spell_output = json.loads(result_text)
            
            # Validate
            is_valid, errors = validate_writer_output(spell_output, guide_id)
            if not is_valid:
                logger.warning(f"[WRITER] Validation errors: {errors}")
                
        except Exception as e:
            logger.error(f"[WRITER] Error: {str(e)}")
            raise
        
        self.timing_log["writer_ms"] = int((time.time() - start) * 1000)
        logger.info(f"[WRITER] Completed in {self.timing_log['writer_ms']}ms")
        
        return spell_output
    
    async def _run_writer_with_fixes(
        self,
        spell_spec: dict,
        guide_config: dict,
        research_packet: dict,
        plan: dict,
        belief_mode: str,
        fix_instructions: str
    ) -> dict:
        """Run Writer with specific fix instructions from QA using Anthropic Claude"""
        guide_id = spell_spec.get("persona_id", "shigg")
        
        # Add fix instructions to the standard prompt
        base_prompt = build_writer_prompt_v2(spell_spec, guide_config, research_packet, plan, belief_mode)
        
        fix_prompt = f"""{base_prompt}

## QA FIX INSTRUCTIONS
The previous output failed QA. Please fix these issues:
{fix_instructions}

Ensure all fixes are applied while maintaining your authentic voice."""
        
        contract = WRITER_CONTRACTS.get(guide_id, WRITER_CONTRACTS["shigg"])
        
        response = await self.anthropic_client.messages.create(
            model=ANTHROPIC_WRITER_MODEL,
            max_tokens=3500,
            system=f"You are {contract['name']}, {contract['title']}. Fix the QA issues while maintaining your voice. Return ONLY valid JSON.",
            messages=[{"role": "user", "content": fix_prompt}]
        )
        
        result_text = response.content[0].text
        result_text = self._clean_json(result_text)
        return json.loads(result_text)
    
    def _clean_json(self, text: str) -> str:
        """Clean JSON from markdown wrapping"""
        if '```json' in text:
            text = text.split('```json')[1].split('```')[0]
        elif '```' in text:
            text = text.split('```')[1].split('```')[0]
        return text.strip()
    
    def _get_fallback_research(self, spell_spec: dict, guide_id: str) -> dict:
        """Fallback research packet when Archivist fails"""
        traditions = get_tradition_tags(guide_id)
        
        return {
            "query_understood": spell_spec.get("user_query", "A personal working"),
            "research_mode": "spell_origins",
            "facts": [
                {
                    "claim": "This type of practice has roots in folk traditions of the British Isles",
                    "claim_type": "folklore",
                    "confidence": "medium",
                    "source_refs": ["british_folk_traditions"],
                    "why_it_works": "Folk magic traditions emphasize intention and symbolic action",
                    "hedging_required": False
                },
                {
                    "claim": "Ritual actions create psychological containers for change",
                    "claim_type": "academic",
                    "confidence": "high",
                    "source_refs": ["cg_jung"],
                    "why_it_works": "Anthropologists note rituals serve meaning-making functions",
                    "hedging_required": False
                },
                {
                    "claim": "The materials selected carry traditional symbolic associations",
                    "claim_type": "folklore",
                    "confidence": "medium",
                    "source_refs": ["owen_davies"],
                    "why_it_works": "Symbolic correspondence between components and intent appears across traditions",
                    "hedging_required": False
                }
            ],
            "sources": [
                {
                    "source_id": "british_folk_traditions",
                    "author": "British Folk Traditions",
                    "work": "Accumulated practices of British folk magic",
                    "year": None,
                    "quality_tier": "community_tradition",
                    "relevance": "Provides framework for practical, domestic magic"
                },
                {
                    "source_id": "owen_davies",
                    "author": "Owen Davies",
                    "work": "Popular Magic: Cunning-folk in English History",
                    "year": 2003,
                    "quality_tier": "academic_primary",
                    "relevance": "Academic authority on British magical practices"
                }
            ],
            "tradition_context": {
                "primary_tradition": traditions[0]["id"] if traditions else "british_folk_magic",
                "related_traditions": [t["id"] for t in traditions[1:3]] if len(traditions) > 1 else [],
                "geographic_origin": "British Isles",
                "time_period": "Traditional",
                "visual_lane": "folk magic"
            },
            "timeline_anchors": [],
            "material_notes": [],
            "safety_flags": [],
            "unverified_claims": []
        }
    
    def _get_fallback_plan(self, spell_spec: dict, guide_config: dict) -> dict:
        """Fallback plan when Planner fails"""
        guide_id = spell_spec.get("persona_id", "shigg")
        
        return {
            "spell_title": "A Personal Working",
            "spell_subtitle": "Crafted for your intention",
            "guide_id": guide_id,
            "belief_mode": "SPIRITUAL",
            "structure_template": f"{guide_id}_default",
            "section_order": ["opening", "working", "closing"],
            "variation_tokens": {},
            "text_tokens": {},
            "selected_facts": [],
            "selected_sources": [],
            "materials_plan": [
                {"name": "candle", "purpose": "focus", "substitution": "LED candle"},
                {"name": "paper", "purpose": "intention setting", "substitution": "none needed"}
            ],
            "step_outline": [
                {"step_num": 1, "action_type": "opening", "brief": "Create sacred space"},
                {"step_num": 2, "action_type": "working", "brief": "Perform main ritual"},
                {"step_num": 3, "action_type": "closing", "brief": "Close and ground"}
            ],
            "persona_lock": {
                "props": ["candle", "paper"],
                "sensory_cue": "warmth of flame",
                "signature_move": "gentle breath"
            },
            "timeline_links": [],
            "tradition_tags": [t["id"] for t in get_tradition_tags(guide_id)[:2]],
            "safety_notes": []
        }


# Convenience function for direct use
async def generate_spell_v2(
    spell_spec: dict,
    guide_config: dict,
    deepseek_client,
    anthropic_client,
    belief_mode: str = "SPIRITUAL"
) -> Tuple[dict, dict]:
    """
    Convenience function to generate a spell using the V2 pipeline.
    
    Args:
        spell_spec: User's spell request
        guide_config: Guide/persona configuration
        deepseek_client: AsyncOpenAI client for DeepSeek
        anthropic_client: AsyncAnthropic client for Anthropic Claude
        belief_mode: SECULAR, SPIRITUAL, or PRACTITIONER
    
    Returns:
        (spell_output, metadata)
    """
    pipeline = SpellGenerationPipeline(deepseek_client, anthropic_client)
    return await pipeline.generate_spell(spell_spec, guide_config, belief_mode)
