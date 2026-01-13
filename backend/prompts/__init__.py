# Crowlands Production Prompt Pack
# Version 2.0 - Archivist → Planner → Writer → QA Pipeline

from .archivist import ARCHIVIST_SYSTEM_PROMPT, build_archivist_prompt, validate_archivist_output
from .planner import build_planner_prompt_v2, validate_planner_output
from .writer import build_writer_prompt_v2, WRITER_CONTRACTS, validate_writer_output
from .qa import build_qa_prompt, QA_RULES, run_qa_validation
from .canon import CANON_TAXONOMY, get_canon_context, get_tradition_tags
from .hard_limits import HARD_LIMITS, validate_hard_limits
from .belief_modes import BELIEF_MODES, get_belief_framing
from .pipeline import SpellGenerationPipeline, generate_spell_v2

__all__ = [
    # Archivist (Stage 1)
    'ARCHIVIST_SYSTEM_PROMPT',
    'build_archivist_prompt',
    'validate_archivist_output',
    
    # Planner (Stage 2)
    'build_planner_prompt_v2',
    'validate_planner_output',
    
    # Writer (Stage 3)
    'build_writer_prompt_v2',
    'WRITER_CONTRACTS',
    'validate_writer_output',
    
    # QA (Stage 4)
    'build_qa_prompt',
    'QA_RULES',
    'run_qa_validation',
    
    # Canon & Taxonomy
    'CANON_TAXONOMY',
    'get_canon_context',
    'get_tradition_tags',
    
    # Hard Limits
    'HARD_LIMITS',
    'validate_hard_limits',
    
    # Belief Modes
    'BELIEF_MODES',
    'get_belief_framing',
    
    # Pipeline
    'SpellGenerationPipeline',
    'generate_spell_v2'
]
