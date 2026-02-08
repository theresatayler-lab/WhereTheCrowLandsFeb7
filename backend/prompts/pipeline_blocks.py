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
    3. WRITER (GPT-4o or Claude) - Full blocks[] content in guide's voice
    4. QA (Programmatic) - Validate required blocks, choice, lore_vignette, persona_lock
    
    Supports tiered operation:
    - QUICK: DeepSeek research only, GPT-4o writer
    - STANDARD: DeepSeek research, GPT-4o planner, Claude writer
    - DEEP: DeepSeek research, Claude reasoning, Claude writer (higher tokens)
    """
    
    def __init__(
        self, 
        deepseek_client, 
        openai_client, 
        claude_client=None,
        max_retries: int = 1,
        tier_config: dict = None
    ):
        self.deepseek_client = deepseek_client
        self.openai_client = openai_client
        self.claude_client = claude_client
        self.max_retries = max_retries
        self.timing_log = {}
        
        # Default tier config (STANDARD)
        self.tier_config = tier_config or {
            "research_model": "deepseek-chat",
            "research_tokens": 1200,
            "research_temperature": 0.6,
            "writer_model": "gpt-4o",
            "writer_tokens": 2500,
            "writer_temperature": 0.8,
            "tier_name": "standard"
        }
    
    async def generate_spell(
        self,
        spell_spec: dict,
        guide_config: dict,
        belief_mode: str = "SPIRITUAL",
        tier_config: dict = None
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
            
            # Return fallback spell instead of raising
            fallback_spell = self._get_fallback_spell(spell_spec, guide_id)
            return fallback_spell, metadata
    
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
            
            # Use repair-capable JSON parser
            try:
                spell_output = await self._try_parse_json_with_repair(
                    result_text, 
                    schema_hint="spell object with blocks[], tarot_card, persona_lock"
                )
            except json.JSONDecodeError:
                logger.error(f"[WRITER_BLOCKS] JSON repair failed, using fallback spell")
                spell_output = self._get_fallback_spell(spell_spec, guide_id)
                self.timing_log["writer_ms"] = int((time.time() - start) * 1000)
                return spell_output
            
            is_valid, errors = validate_writer_blocks_output(spell_output, guide_id)
            if not is_valid:
                logger.warning(f"[WRITER_BLOCKS] Validation errors: {errors}")
                
        except Exception as e:
            logger.error(f"[WRITER_BLOCKS] Error: {str(e)}")
            # Return fallback instead of raising
            spell_output = self._get_fallback_spell(spell_spec, guide_id)
        
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
        
        try:
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
            
            # Use repair-capable JSON parser
            try:
                return await self._try_parse_json_with_repair(
                    result_text,
                    schema_hint="spell object with blocks[], tarot_card, persona_lock"
                )
            except json.JSONDecodeError:
                logger.error(f"[WRITER_BLOCKS_FIX] JSON repair failed, using fallback spell")
                return self._get_fallback_spell(spell_spec, guide_id)
                
        except Exception as e:
            logger.error(f"[WRITER_BLOCKS_FIX] Error: {str(e)}")
            return self._get_fallback_spell(spell_spec, guide_id)
    
    def _clean_json(self, text: str) -> str:
        """Clean JSON from markdown wrapping"""
        if '```json' in text:
            text = text.split('```json')[1].split('```')[0]
        elif '```' in text:
            text = text.split('```')[1].split('```')[0]
        return text.strip()
    
    async def _try_parse_json_with_repair(self, text: str, schema_hint: str = "") -> dict:
        """
        Try to parse JSON with one repair pass if needed.
        Returns parsed dict or raises exception.
        """
        import json
        
        # First, try direct parse
        cleaned = self._clean_json(text)
        try:
            return json.loads(cleaned)
        except json.JSONDecodeError as e:
            logger.warning(f"[JSON_REPAIR] Initial parse failed: {str(e)[:100]}")
        
        # Repair pass: ask model to fix the JSON
        repair_prompt = f"""The following text should be valid JSON but has errors.
Fix it and return ONLY the corrected JSON, nothing else.

BROKEN JSON:
{cleaned[:3000]}

{f"Expected schema hint: {schema_hint}" if schema_hint else ""}

Return ONLY valid JSON:"""
        
        try:
            repair_response = await self.openai_client.chat.completions.create(
                model="gpt-4o-mini",  # Use fast model for repair
                messages=[
                    {"role": "system", "content": "You are a JSON repair tool. Output ONLY valid JSON."},
                    {"role": "user", "content": repair_prompt}
                ],
                temperature=0.1,
                max_tokens=4000
            )
            
            repaired = repair_response.choices[0].message.content
            repaired = self._clean_json(repaired)
            result = json.loads(repaired)
            logger.info("[JSON_REPAIR] Successfully repaired JSON")
            return result
            
        except Exception as repair_error:
            logger.error(f"[JSON_REPAIR] Repair also failed: {str(repair_error)[:100]}")
            raise json.JSONDecodeError(f"JSON repair failed: {str(e)}", cleaned, 0)
    
    def _get_fallback_spell(self, spell_spec: dict, guide_id: str) -> dict:
        """Return a minimal valid spell when all else fails"""
        from .planner_blocks import BLOCK_TEMPLATES
        template = BLOCK_TEMPLATES.get(guide_id, BLOCK_TEMPLATES["shigg"])
        
        return {
            "title": "A Moment of Intention",
            "subtitle": "A simple working while we gather ourselves",
            "intent": spell_spec.get("intention", "A personal working"),
            "guide_id": guide_id,
            "belief_mode": "SPIRITUAL",
            "template_id": template["template_id"],
            "persona_lock": {"props": ["candle"], "sensory_cue": "warmth", "signature_move": "breath"},
            "canon_anchor": {"id": "folk_traditions", "type": "practice", "title": "Folk Traditions", "relevance": "Simple practices ground us"},
            "tarot_card": {
                "title": "The Pause",
                "symbol": "🕯️",
                "essence": "Sometimes we simply need to begin.",
                "key_action": "Light a candle and breathe.",
                "incantation": "I am here. I begin.",
                "timing": "Now"
            },
            "blocks": [
                {"block_type": "cold_open", "block_id": "fallback_1", "content": {
                    "greeting": f"Hello, {spell_spec.get('seeker_name', 'Seeker')}.",
                    "scene_setting": "We're having a moment of technical difficulty, but the magic doesn't stop.",
                    "hook": "Let's do something simple while things settle.",
                    "persona_markers": ["candle", "breath"]
                }},
                {"block_type": "materials", "block_id": "fallback_2", "content": {
                    "items": [{"name": "candle", "purpose": "focus", "optional": False}],
                    "gathering_note": "Just one simple thing."
                }},
                {"block_type": "choice", "block_id": "fallback_3", "content": {
                    "prompt": "What feels right?",
                    "options": [
                        {"id": "opt_a", "label": "Light a candle", "description": "Simple and grounding"},
                        {"id": "opt_b", "label": "Take three breaths", "description": "Even simpler"}
                    ],
                    "consequence_hint": "Either choice is perfect."
                }},
                {"block_type": "lore_vignette", "block_id": "fallback_4", "content": {
                    "title": "The Pause Before",
                    "narrative": "In every tradition, there is a moment before the working begins—a pause, a gathering of intention. This is that moment. Folk practitioners have always known that the simplest acts carry the most weight when done with presence. A candle lit with attention outweighs elaborate ceremonies done by rote. So we pause here, together, and that is enough.",
                    "era": "Timeless",
                    "tradition": "Folk wisdom",
                    "canon_anchor_id": "folk_traditions"
                }},
                {"block_type": "stepper", "block_id": "fallback_5", "content": {
                    "steps": [
                        {"step_number": 1, "action": "Find a quiet spot", "why": "Presence requires a container", "checkpoint": True},
                        {"step_number": 2, "action": "Light your candle (or close your eyes)", "why": "A focal point anchors intention", "checkpoint": True},
                        {"step_number": 3, "action": "State your intention silently or aloud", "why": "Words make it real", "checkpoint": True}
                    ],
                    "completion_message": "You have begun. That is the hardest part."
                }},
                {"block_type": "closing", "block_id": "fallback_6", "content": {
                    "grounding_action": "Blow out the candle when ready",
                    "empowerment_line": "You showed up. That matters.",
                    "next_steps_hint": "Try again when the technical gremlins have passed."
                }}
            ],
            "micro_lore_used": [],
            "text_tokens_used": {},
            "_fallback": True,
            "_fallback_reason": "Generation encountered an error; this is a simplified working."
        }
    
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
