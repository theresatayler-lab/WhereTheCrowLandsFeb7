# Blocks Pipeline - Full 4-Stage Pipeline for Blocks-Based Spells
# Archivist → Planner (Blocks) → Writer (Blocks) → QA (Blocks)

import json
import logging
import time
from typing import Dict, Any, Tuple

from .archivist import build_archivist_prompt, validate_archivist_output, ARCHIVIST_SYSTEM_PROMPT
from .planner_blocks import build_planner_prompt_blocks, validate_planner_blocks_output, get_block_template
from .writer_blocks import build_writer_prompt_blocks, validate_writer_blocks_output
from .qa_blocks import run_qa_blocks_validation
from .canon import get_canon_context, get_tradition_tags
from .belief_modes import BELIEF_MODES
from .writer import WRITER_CONTRACTS

logger = logging.getLogger(__name__)


class BlocksSpellPipeline:
    """
    Blocks-based spell generation pipeline.
    
    Stages:
    1. ARCHIVIST (DeepSeek) - Research facts, sources, tradition context
    2. PLANNER (GPT-4o) - Block template, canon anchor, block sequence
    3. WRITER (GPT-4o) - Full blocks[] content in guide's voice
    4. QA (Programmatic) - Validate required blocks, choice, lore_vignette, persona_lock
    """
    
    def __init__(self, deepseek_client, openai_client, max_retries: int = 1):
        self.deepseek_client = deepseek_client
        self.openai_client = openai_client
        self.max_retries = max_retries
        self.timing_log = {}
    
    async def generate_spell(
        self,
        spell_spec: dict,
        guide_config: dict,
        belief_mode: str = "SPIRITUAL"
    ) -> Tuple[dict, dict]:
        """
        Generate a blocks-based spell through the 4-stage pipeline.
        
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
            "qa_report": None,
            "pipeline_version": "blocks_v1"
        }
        
        try:
            # === STAGE 1: ARCHIVIST ===
            research_packet = await self._run_archivist(spell_spec, guide_id)
            metadata["stages_completed"].append("archivist")
            metadata["timing"]["archivist_ms"] = self.timing_log.get("archivist_ms", 0)
            
            # === STAGE 2: PLANNER (BLOCKS) ===
            plan = await self._run_planner_blocks(spell_spec, guide_config, research_packet, belief_mode)
            metadata["stages_completed"].append("planner")
            metadata["timing"]["planner_ms"] = self.timing_log.get("planner_ms", 0)
            
            # === STAGE 3: WRITER (BLOCKS) ===
            spell_output = await self._run_writer_blocks(spell_spec, guide_config, research_packet, plan, belief_mode)
            metadata["stages_completed"].append("writer")
            metadata["timing"]["writer_ms"] = self.timing_log.get("writer_ms", 0)
            
            # === STAGE 4: QA (BLOCKS) ===
            qa_passed, qa_report = run_qa_blocks_validation(spell_output, guide_id, belief_mode)
            metadata["qa_report"] = qa_report
            
            if not qa_passed and metadata["retries"] < self.max_retries:
                # Attempt rewrite
                logger.info(f"[BLOCKS] QA failed, attempting rewrite. Violations: {qa_report['violations']}")
                metadata["retries"] += 1
                
                spell_output = await self._run_writer_blocks_with_fixes(
                    spell_spec, guide_config, research_packet, plan,
                    belief_mode, qa_report["rewrite_instructions"]
                )
                
                # Re-validate
                qa_passed, qa_report = run_qa_blocks_validation(spell_output, guide_id, belief_mode)
                metadata["qa_report"] = qa_report
            
            metadata["stages_completed"].append("qa")
            metadata["qa_passed"] = qa_passed
            metadata["timing"]["total_ms"] = int((time.time() - total_start) * 1000)
            
            return spell_output, metadata
            
        except Exception as e:
            logger.error(f"[BLOCKS] Error in spell generation: {str(e)}")
            metadata["error"] = str(e)
            metadata["timing"]["total_ms"] = int((time.time() - total_start) * 1000)
            raise
    
    async def _run_archivist(self, spell_spec: dict, guide_id: str) -> dict:
        """Stage 1: Run Archivist research (same as V2)"""
        start = time.time()
        
        canon_context = get_canon_context(spell_spec.get("user_query", ""), guide_id)
        
        prompt = build_archivist_prompt(
            query=spell_spec.get("user_query", ""),
            guide_id=guide_id,
            materials=spell_spec.get("materials", []),
            anchor_object=spell_spec.get("anchor_object"),
            intent=spell_spec.get("desired_feeling"),
            canon_context=canon_context
        )
        
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
                
                is_valid, errors = validate_archivist_output(research_packet)
                if not is_valid:
                    logger.warning(f"[ARCHIVIST] Validation errors: {errors}")
                
            except Exception as e:
                logger.error(f"[ARCHIVIST] Error: {str(e)}")
                research_packet = self._get_fallback_research(spell_spec, guide_id)
        else:
            research_packet = self._get_fallback_research(spell_spec, guide_id)
        
        self.timing_log["archivist_ms"] = int((time.time() - start) * 1000)
        return research_packet
    
    async def _run_planner_blocks(
        self,
        spell_spec: dict,
        guide_config: dict,
        research_packet: dict,
        belief_mode: str
    ) -> dict:
        """Stage 2: Run Planner (Blocks version)"""
        start = time.time()
        
        prompt = build_planner_prompt_blocks(spell_spec, guide_config, research_packet, belief_mode)
        
        try:
            response = await self.openai_client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": "You are a spell planner. Plan blocks-based spells. Return ONLY valid JSON."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.8,
                max_tokens=3000
            )
            
            result_text = response.choices[0].message.content
            result_text = self._clean_json(result_text)
            plan = json.loads(result_text)
            
            is_valid, errors = validate_planner_blocks_output(plan)
            if not is_valid:
                logger.warning(f"[PLANNER_BLOCKS] Validation errors: {errors}")
                
        except Exception as e:
            logger.error(f"[PLANNER_BLOCKS] Error: {str(e)}")
            plan = self._get_fallback_plan_blocks(spell_spec, guide_config)
        
        self.timing_log["planner_ms"] = int((time.time() - start) * 1000)
        return plan
    
    async def _run_writer_blocks(
        self,
        spell_spec: dict,
        guide_config: dict,
        research_packet: dict,
        plan: dict,
        belief_mode: str
    ) -> dict:
        """Stage 3: Run Writer (Blocks version)"""
        start = time.time()
        guide_id = spell_spec.get("persona_id", "shigg")
        
        prompt = build_writer_prompt_blocks(spell_spec, guide_config, research_packet, plan, belief_mode)
        contract = WRITER_CONTRACTS.get(guide_id, WRITER_CONTRACTS["shigg"])
        
        try:
            response = await self.openai_client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": f"You are {contract['name']}, {contract['title']}. Write blocks-based spells in your unique voice. Return ONLY valid JSON."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.85,
                max_tokens=4500  # Blocks need more tokens
            )
            
            result_text = response.choices[0].message.content
            result_text = self._clean_json(result_text)
            spell_output = json.loads(result_text)
            
            is_valid, errors = validate_writer_blocks_output(spell_output, guide_id)
            if not is_valid:
                logger.warning(f"[WRITER_BLOCKS] Validation errors: {errors}")
                
        except Exception as e:
            logger.error(f"[WRITER_BLOCKS] Error: {str(e)}")
            raise
        
        self.timing_log["writer_ms"] = int((time.time() - start) * 1000)
        return spell_output
    
    async def _run_writer_blocks_with_fixes(
        self,
        spell_spec: dict,
        guide_config: dict,
        research_packet: dict,
        plan: dict,
        belief_mode: str,
        fix_instructions: str
    ) -> dict:
        """Run Writer with QA fix instructions"""
        guide_id = spell_spec.get("persona_id", "shigg")
        
        base_prompt = build_writer_prompt_blocks(spell_spec, guide_config, research_packet, plan, belief_mode)
        
        fix_prompt = f"""{base_prompt}

## QA FIX INSTRUCTIONS
The previous output failed QA. Please fix these issues:
{fix_instructions}

Ensure all fixes are applied while maintaining your authentic voice."""
        
        contract = WRITER_CONTRACTS.get(guide_id, WRITER_CONTRACTS["shigg"])
        
        response = await self.openai_client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": f"You are {contract['name']}. Fix the QA issues. Return ONLY valid JSON."},
                {"role": "user", "content": fix_prompt}
            ],
            temperature=0.75,
            max_tokens=4500
        )
        
        result_text = response.choices[0].message.content
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
        """Fallback research when Archivist fails"""
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
                    "why_it_works": "Symbolic correspondence across traditions",
                    "hedging_required": False
                }
            ],
            "sources": [
                {
                    "source_id": "british_folk_traditions",
                    "author": "British Folk Traditions",
                    "work": "Accumulated practices",
                    "year": None,
                    "quality_tier": "community_tradition",
                    "relevance": "Framework for practical, domestic magic"
                },
                {
                    "source_id": "owen_davies",
                    "author": "Owen Davies",
                    "work": "Popular Magic",
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
    
    def _get_fallback_plan_blocks(self, spell_spec: dict, guide_config: dict) -> dict:
        """Fallback plan when Planner fails"""
        guide_id = spell_spec.get("persona_id", "shigg")
        template = get_block_template(guide_id)
        
        return {
            "spell_title": "A Personal Working",
            "spell_subtitle": "Crafted for your intention",
            "guide_id": guide_id,
            "belief_mode": "SPIRITUAL",
            "template_id": template["template_id"],
            "canon_anchor": {
                "id": "british_folk_magic",
                "type": "tradition",
                "title": "British Folk Magic",
                "year": None,
                "relevance": "Foundation for domestic magical practice"
            },
            "block_sequence": [
                {"block_type": "cold_open", "block_id": "cold_open_1", "brief": "Opening greeting"},
                {"block_type": "materials", "block_id": "materials_1", "items_planned": ["candle", "paper"]},
                {"block_type": "choice", "block_id": "choice_1", "choice_theme": "Focus area", "options_planned": ["inner", "outer"]},
                {"block_type": "lore_vignette", "block_id": "lore_1", "vignette_topic": "Folk tradition connection"},
                {"block_type": "stepper", "block_id": "stepper_1", "step_count": 4, "step_themes": ["prepare", "invoke", "work", "seal"]},
                {"block_type": "closing", "block_id": "closing_1", "brief": "Grounding close"}
            ],
            "persona_lock": {
                "props": ["candle", "paper"],
                "sensory_cue": "warmth of flame",
                "signature_move": "gentle breath"
            },
            "selected_facts": [],
            "selected_sources": [],
            "variation_tokens": {},
            "text_tokens": {},
            "tradition_tags": [t["id"] for t in get_tradition_tags(guide_id)[:2]],
            "safety_notes": []
        }


async def generate_spell_blocks(
    spell_spec: dict,
    guide_config: dict,
    deepseek_client,
    openai_client,
    belief_mode: str = "SPIRITUAL"
) -> Tuple[dict, dict]:
    """
    Convenience function to generate a blocks-based spell.
    """
    pipeline = BlocksSpellPipeline(deepseek_client, openai_client)
    return await pipeline.generate_spell(spell_spec, guide_config, belief_mode)
