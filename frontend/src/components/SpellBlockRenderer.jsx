// SpellBlockRenderer - Renders blocks as flowing narrative grimoire page
// No section headers, no accordions, no input boxes - reads like a spell walkthrough

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Clock, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';

// Subtle section break between narrative sections
const NarrativeBreak = ({ archetypeStyle }) => (
  <div className="flex items-center justify-center py-3 opacity-30">
    <div className={cn("h-px w-12", archetypeStyle.accentColor?.replace('text-', 'bg-') || "bg-amber-600")} />
    <span className="mx-3 text-xs">&#9670;</span>
    <div className={cn("h-px w-12", archetypeStyle.accentColor?.replace('text-', 'bg-') || "bg-amber-600")} />
  </div>
);

// Main Block Renderer Component
export const SpellBlockRenderer = ({
  spell,
  archetypeStyle = {},
  onLogUpdate = () => {},
  initialLog = {}
}) => {
  const blocks = spell?.blocks || [];
  const personaLock = spell?.persona_lock || {};
  const canonAnchor = spell?.canon_anchor || {};

  return (
    <div className="space-y-2" data-testid="spell-block-renderer">
      {/* Persona Lock Header - subtle */}
      {personaLock.props && (
        <div className="text-center text-xs text-stone-500 italic mb-4">
          <span>{personaLock.props.join(' · ')}{personaLock.sensory_cue ? ` · ${personaLock.sensory_cue}` : ''}</span>
        </div>
      )}

      {/* Render all blocks as flowing narrative */}
      {blocks.map((block, index) => (
        <React.Fragment key={block.block_id || index}>
          {index > 0 && block.block_type !== 'safety_note' && (
            <NarrativeBreak archetypeStyle={archetypeStyle} />
          )}
          <NarrativeBlock block={block} archetypeStyle={archetypeStyle} />
        </React.Fragment>
      ))}
    </div>
  );
};

// Single narrative block - no headers, just prose
const NarrativeBlock = ({ block, archetypeStyle }) => {
  const bt = block.block_type;
  const c = block.content || {};

  if (bt === 'cold_open') return <ColdOpen c={c} style={archetypeStyle} />;
  if (bt === 'materials') return <Materials c={c} style={archetypeStyle} />;
  if (bt === 'stepper') return <Stepper c={c} style={archetypeStyle} />;
  if (bt === 'lore_vignette') return <LoreVignette c={c} style={archetypeStyle} />;
  if (bt === 'choice') return <Choice c={c} style={archetypeStyle} />;
  if (bt === 'closing') return <Closing c={c} style={archetypeStyle} />;
  if (bt === 'reflection') return <Reflection c={c} />;
  if (bt === 'journal_prompt') return <Reflection c={c} />;
  if (bt === 'bird_oracle') return <BirdOracle c={c} style={archetypeStyle} />;
  if (bt === 'ward') return <Ward c={c} style={archetypeStyle} />;
  if (bt === 'song_prompt') return <SongPrompt c={c} style={archetypeStyle} />;
  if (bt === 'evidence_card') return <EvidenceCard c={c} />;
  if (bt === 'safety_note') return <SafetyNote c={c} />;
  if (bt === 'poetry_reading') return <PoetryReading c={c} style={archetypeStyle} />;
  if (bt === 'observation_task') return <ObservationTask c={c} />;
  if (bt === 'further_reading') return <FurtherReading c={c} style={archetypeStyle} />;

  return null;
};

// === NARRATIVE BLOCK COMPONENTS ===

// Cold Open - the guide's opening, presented as immersive quote
const ColdOpen = ({ c, style }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="mb-4"
    data-testid="cold-open-block"
  >
    {c.greeting && (
      <blockquote
        className="font-crimson-text text-lg text-stone-800 italic leading-relaxed pl-5 mb-3"
        style={{ borderLeft: `3px solid ${style.accentColor ? undefined : '#B5651D'}` }}
      >
        {c.greeting}
      </blockquote>
    )}
    {c.scene_setting && (
      <p className="font-crimson-text text-stone-600 leading-relaxed mb-2">{c.scene_setting}</p>
    )}
    {c.hook && (
      <p className="font-crimson-text text-stone-800 leading-relaxed">{c.hook}</p>
    )}
  </motion.div>
);

// Materials - simple inline list, no box
const Materials = ({ c, style }) => (
  <div data-testid="materials-block">
    <p className="font-crimson-text text-stone-700 text-sm italic mb-2">You will need:</p>
    {c.items?.map((item, i) => (
      <p key={i} className="font-crimson-text text-stone-800 leading-relaxed mb-1.5">
        <span className="font-semibold">{item.name}</span>
        {item.purpose && <span className="text-stone-600"> — {item.purpose}</span>}
        {item.substitution && (
          <span className="text-stone-500 text-sm"> (or: {item.substitution})</span>
        )}
      </p>
    ))}
    {c.gathering_note && (
      <p className="font-crimson-text text-stone-500 text-sm italic mt-2">{c.gathering_note}</p>
    )}
  </div>
);

// Stepper - flowing narrative steps, no checkboxes
const Stepper = ({ c, style }) => (
  <div className="space-y-5" data-testid="stepper-block">
    {c.steps?.map((step, index) => (
      <div key={index}>
        {/* Subtle step indicator */}
        {step.title && (
          <p className="font-cinzel text-sm text-stone-500 tracking-wide mb-1">
            {step.title}
          </p>
        )}

        {/* The instruction as flowing prose */}
        <p className="font-crimson-text text-stone-800 text-base leading-relaxed">
          {step.action || step.instruction || step.text}
        </p>

        {/* Spoken words as elegant blockquote */}
        {step.spoken_words && (
          <blockquote className="my-2 pl-4 border-l-2 border-amber-400/60 font-crimson-text italic text-stone-700">
            "{step.spoken_words}"
          </blockquote>
        )}

        {/* Why - woven into the narrative */}
        {step.why && (
          <p className="font-crimson-text text-stone-600 text-sm italic mt-1">{step.why}</p>
        )}

        {step.duration_hint && (
          <p className="text-stone-400 text-xs mt-1 flex items-center gap-1">
            <Clock className="w-3 h-3" /> {step.duration_hint}
          </p>
        )}
      </div>
    ))}

    {c.completion_message && (
      <p className="font-crimson-text text-stone-600 text-center italic mt-4">{c.completion_message}</p>
    )}
  </div>
);

// Lore Vignette - embedded historical narrative, no box
const LoreVignette = ({ c, style }) => (
  <div className="py-2" data-testid="lore-vignette-block">
    {(c.era || c.tradition || c.title) && (
      <p className="font-cinzel text-xs text-stone-400 uppercase tracking-widest mb-1">
        {c.era && `${c.era} — `}{c.tradition || c.title}
      </p>
    )}
    <p className="font-crimson-text text-stone-700 leading-relaxed italic">
      {c.narrative}
    </p>
    {c.relevance_to_working && (
      <p className="font-crimson-text text-stone-600 mt-2 text-sm">{c.relevance_to_working}</p>
    )}
    {c.source_connection && (
      <p className="text-xs text-stone-400 mt-1 italic">— {c.source_connection}</p>
    )}
  </div>
);

// Choice - subtle inline options
const Choice = ({ c, style }) => {
  const [selected, setSelected] = useState(null);
  return (
    <div data-testid="choice-block">
      <p className="font-crimson-text text-stone-800 text-base leading-relaxed mb-3">{c.prompt}</p>
      <div className="space-y-2">
        {c.options?.map((opt) => (
          <button
            key={opt.id}
            onClick={() => setSelected(opt.id)}
            className={cn(
              "w-full text-left p-3 rounded transition-all font-crimson-text text-sm",
              selected === opt.id
                ? "bg-amber-100/60 border border-amber-600/40 text-stone-800"
                : "bg-stone-100/40 border border-stone-200 text-stone-700 hover:bg-stone-100/60"
            )}
          >
            <span className="font-semibold">{opt.label}</span>
            {opt.description && <span className="text-stone-500"> — {opt.description}</span>}
          </button>
        ))}
      </div>
      {c.consequence_hint && (
        <p className="font-crimson-text text-sm italic text-stone-500 mt-2">"{c.consequence_hint}"</p>
      )}
    </div>
  );
};

// Closing - the guide's farewell, elegant
const Closing = ({ c, style }) => (
  <div data-testid="closing-block">
    {c.license_to_depart && (
      <p className="font-crimson-text text-stone-700 italic leading-relaxed">"{c.license_to_depart}"</p>
    )}
    {c.grounding_action && (
      <p className="font-crimson-text text-stone-800 mt-3">{c.grounding_action}</p>
    )}
    {c.empowerment_line && (
      <p className="font-cinzel text-base text-center text-amber-800 mt-4 py-3">
        "{c.empowerment_line}"
      </p>
    )}
    {c.next_steps_hint && (
      <p className="font-crimson-text text-sm text-stone-500 mt-2">
        In the next 24 hours: {c.next_steps_hint}
      </p>
    )}
  </div>
);

// Reflection / Journal - just the prompt text, no input fields
const Reflection = ({ c }) => (
  <div data-testid="reflection-block">
    {c.guide_note && (
      <p className="font-crimson-text text-stone-700 italic leading-relaxed">"{c.guide_note}"</p>
    )}
    {c.prompts?.map((prompt, i) => (
      <p key={i} className="font-crimson-text text-stone-600 mt-2 leading-relaxed">{prompt}</p>
    ))}
  </div>
);

// Bird Oracle - mystical inline message
const BirdOracle = ({ c, style }) => (
  <div data-testid="bird-oracle-block">
    <p className="font-cinzel text-sm text-stone-500 tracking-wide mb-1">
      {c.bird || c.bird_name || 'The Bird Oracle'}
    </p>
    <blockquote className="font-crimson-text text-stone-700 italic pl-4 border-l-2 border-amber-500/40">
      "{c.message || c.oracle_message}"
    </blockquote>
    {c.observation_prompt && (
      <p className="font-crimson-text text-stone-500 text-sm mt-2">{c.observation_prompt}</p>
    )}
  </div>
);

// Ward - protection instruction as narrative
const Ward = ({ c, style }) => (
  <div data-testid="ward-block">
    {c.ward_name && (
      <p className="font-cinzel text-sm text-stone-500 tracking-wide mb-2">{c.ward_name}</p>
    )}
    {c.protects_against && (
      <p className="font-crimson-text text-stone-600 text-sm italic mb-2">{c.protects_against}</p>
    )}
    {c.creation_steps && Array.isArray(c.creation_steps) && c.creation_steps.map((step, i) => (
      <p key={i} className="font-crimson-text text-stone-800 leading-relaxed mb-2">{step}</p>
    ))}
    {c.activation_phrase && (
      <blockquote className="font-crimson-text text-amber-800 italic text-center my-3 py-2 border-y border-amber-400/30">
        "{c.activation_phrase}"
      </blockquote>
    )}
    {c.talisman_option && (
      <p className="font-crimson-text text-stone-500 text-sm mt-2">{c.talisman_option}</p>
    )}
  </div>
);

// Song Prompt - voice instruction as flowing text
const SongPrompt = ({ c, style }) => (
  <div data-testid="song-prompt-block">
    <p className="font-crimson-text text-stone-800 leading-relaxed">{c.instruction}</p>
    {(c.phrase || c.words_optional) && (
      <blockquote className="font-crimson-text italic text-stone-700 my-2 pl-4 border-l-2 border-amber-400/40">
        "{c.phrase || c.words_optional}"
      </blockquote>
    )}
    {c.duration && (
      <p className="text-stone-400 text-xs flex items-center gap-1"><Clock className="w-3 h-3" /> {c.duration}</p>
    )}
    {(c.why_this_sound || c.purpose) && (
      <p className="font-crimson-text text-stone-600 text-sm italic mt-1">{c.why_this_sound || c.purpose}</p>
    )}
  </div>
);

// Evidence Card - Theresa's research findings as prose
const EvidenceCard = ({ c }) => (
  <div data-testid="evidence-card-block">
    {c.known?.length > 0 && (
      <div className="mb-3">
        <p className="font-cinzel text-xs text-stone-400 uppercase tracking-widest mb-1">What the records show</p>
        {c.known.map((item, i) => (
          <p key={i} className="font-crimson-text text-stone-700 leading-relaxed">{item}</p>
        ))}
      </div>
    )}
    {c.likely?.length > 0 && (
      <div className="mb-3">
        <p className="font-cinzel text-xs text-stone-400 uppercase tracking-widest mb-1">What the patterns suggest</p>
        {c.likely.map((item, i) => (
          <p key={i} className="font-crimson-text text-stone-600 leading-relaxed">{item}</p>
        ))}
      </div>
    )}
    {c.lore?.length > 0 && (
      <div>
        <p className="font-cinzel text-xs text-stone-400 uppercase tracking-widest mb-1">What the stories tell</p>
        {c.lore.map((item, i) => (
          <p key={i} className="font-crimson-text text-stone-600 italic leading-relaxed">{item}</p>
        ))}
      </div>
    )}
    {c.pattern_note && (
      <p className="font-crimson-text text-sm italic text-stone-500 mt-2">"{c.pattern_note}"</p>
    )}
  </div>
);

// Safety Note - minimal but clear
const SafetyNote = ({ c }) => (
  <div className="py-2 px-4 border-l-2 border-amber-500/60 bg-amber-50/30 rounded-r" data-testid="safety-note-block">
    <p className="font-crimson-text text-sm text-stone-700">{c.warning || c.note}</p>
    {c.when_to_stop && (
      <p className="font-crimson-text text-xs text-stone-600 mt-1">When to pause: {c.when_to_stop}</p>
    )}
    {c.consent_check && (
      <p className="font-crimson-text text-xs text-stone-500 italic mt-1">{c.consent_check}</p>
    )}
  </div>
);

// Poetry Reading - poem as flowing text
const PoetryReading = ({ c, style }) => (
  <div data-testid="poetry-reading-block">
    {c.poem_title && (
      <p className="font-cinzel text-sm text-stone-500 tracking-wide mb-1">{c.poem_title}</p>
    )}
    {c.poem_author && (
      <p className="text-xs text-stone-400 italic mb-2">by {c.poem_author}</p>
    )}
    {c.poem_text && (
      <blockquote className="font-crimson-text text-stone-800 italic leading-relaxed whitespace-pre-line pl-4 border-l-2 border-amber-500/30">
        {c.poem_text}
      </blockquote>
    )}
    {c.guide_commentary && (
      <p className="font-crimson-text text-stone-600 text-sm mt-3">{c.guide_commentary}</p>
    )}
    {c.reading_instruction && (
      <p className="font-crimson-text text-stone-500 text-sm mt-1 italic">{c.reading_instruction}</p>
    )}
  </div>
);

// Observation Task - simple instruction
const ObservationTask = ({ c }) => (
  <div data-testid="observation-task-block">
    <p className="font-crimson-text text-stone-800 leading-relaxed">{c.task_description}</p>
    {c.location_suggestion && (
      <p className="font-crimson-text text-stone-600 text-sm mt-1">Where: {c.location_suggestion}</p>
    )}
    {c.what_to_notice && (
      <p className="font-crimson-text text-stone-600 text-sm mt-1">Notice: {c.what_to_notice}</p>
    )}
    {c.recording_prompt && (
      <p className="font-crimson-text text-stone-500 text-sm italic mt-1">{c.recording_prompt}</p>
    )}
  </div>
);

// Further Reading - simple list of recommendations
const FurtherReading = ({ c, style }) => (
  <div data-testid="further-reading-block">
    <p className="font-cinzel text-xs text-stone-400 uppercase tracking-widest mb-2">For further reading</p>
    {c.recommendations?.map((rec, i) => (
      <div key={i} className="mb-2">
        <p className="font-crimson-text text-stone-800">
          <span className="font-semibold">{rec.title}</span>
          {rec.author && <span className="text-stone-600"> by {rec.author}</span>}
        </p>
        {rec.guide_note && (
          <p className="font-crimson-text text-stone-600 text-sm italic">{rec.guide_note}</p>
        )}
        {rec.learn_more_url && (
          <a href={rec.learn_more_url} target="_blank" rel="noopener noreferrer"
            className="text-amber-700 hover:text-amber-600 text-sm underline">
            Learn more
          </a>
        )}
      </div>
    ))}
    {c.reading_ritual && (
      <p className="font-crimson-text text-stone-500 text-sm italic mt-2">{c.reading_ritual}</p>
    )}
  </div>
);

export default SpellBlockRenderer;
