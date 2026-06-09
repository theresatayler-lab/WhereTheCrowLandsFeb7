// SpellBlockRenderer — Renders blocks as ONE continuous flowing grimoire page
// No cards, no boxes, no giant gaps. Text flows like a real book.
// Typography: Crimson Text body, Italiana labels, TC Phantasmagoria titles.

import React, { useState } from 'react';
import { cn } from '../lib/utils';

// Ornamental flourish between major sections
const Flourish = () => (
  <div className="flex items-center justify-center py-4 opacity-60">
    <img
      src="/images/ornaments/divider-ornate-horizontal.png"
      alt=""
      className="h-4 w-auto"
      aria-hidden="true"
    />
  </div>
);

// Main Block Renderer Component
export const SpellBlockRenderer = ({
  spell,
  guideId = null,
  archetypeStyle = {},
  onLogUpdate = () => {},
  initialLog = {}
}) => {
  const blocks = spell?.blocks || [];
  // Essence line already shown in SpellHeader — don't repeat in cold_open
  const essenceLine = spell?.tarot_card?.essence || '';

  return (
    <div
      className="grimoire-flow"
      data-testid="spell-block-renderer"
      data-guide={guideId || spell?.guide_id || undefined}
    >
      {blocks.map((block, index) => (
        <React.Fragment key={block.block_id || index}>
          {/* Only show a flourish before the stepper (main working) and closing */}
          {index > 0 && ['stepper', 'closing'].includes(block.block_type) && <Flourish />}
          <BlockContent block={block} essenceLine={essenceLine} />
        </React.Fragment>
      ))}
    </div>
  );
};

// Route block to its renderer — no wrapping divs, no frames
const BlockContent = ({ block, essenceLine = '' }) => {
  const bt = block.block_type;
  const c = block.content || {};

  if (bt === 'cold_open') return <ColdOpen c={c} essenceLine={essenceLine} />;
  if (bt === 'materials') return <Materials c={c} />;
  if (bt === 'stepper') return <Stepper c={c} />;
  if (bt === 'lore_vignette') return <LoreVignette c={c} />;
  if (bt === 'choice') return <Choice c={c} />;
  if (bt === 'closing') return <Closing c={c} />;
  if (bt === 'reflection' || bt === 'journal_prompt') return <Reflection c={c} />;
  if (bt === 'bird_oracle') return <BirdOracle c={c} />;
  if (bt === 'ward') return <Ward c={c} />;
  if (bt === 'song_prompt') return <SongPrompt c={c} />;
  if (bt === 'evidence_card') return <EvidenceCard c={c} />;
  if (bt === 'safety_note') return <SafetyNote c={c} />;
  if (bt === 'poetry_reading') return <PoetryReading c={c} />;
  if (bt === 'observation_task') return <ObservationTask c={c} />;
  if (bt === 'further_reading') return <FurtherReading c={c} />;
  return null;
};

// === BLOCK COMPONENTS — all use grimoire-body, flow naturally ===

// Cold Open — the guide speaks. Just italic text, no box.
// Skips greeting if it matches the essence line already shown in SpellHeader.
const ColdOpen = ({ c, essenceLine = '' }) => {
  const greetingMatchesEssence = c.greeting && essenceLine &&
    c.greeting.trim().toLowerCase() === essenceLine.trim().toLowerCase();
  return (
  <div className="mb-4" data-testid="cold-open-block">
    {c.greeting && !greetingMatchesEssence && (
      <p className="grimoire-body italic grimoire-drop-cap">{c.greeting}</p>
    )}
    {c.scene_setting && (
      <p className="grimoire-body mt-1 opacity-85">{c.scene_setting}</p>
    )}
    {c.hook && (
      <p className="grimoire-body mt-1">{c.hook}</p>
    )}
  </div>
  );
};

// Materials — inline list, not a framed card
const Materials = ({ c }) => (
  <div className="my-4" data-testid="materials-block">
    <p className="grimoire-section-label">Gather</p>
    <ul className="grimoire-inline-list">
      {c.items?.map((item, i) => (
        <li key={i}>
          <strong>{item.name}</strong>
          {item.purpose && <span className="opacity-70"> — {item.purpose}</span>}
          {item.substitution && (
            <span className="italic opacity-60"> (or: {item.substitution})</span>
          )}
        </li>
      ))}
    </ul>
    {c.gathering_note && (
      <p className="grimoire-body text-sm italic opacity-70 mt-1">{c.gathering_note}</p>
    )}
  </div>
);

// Stepper — numbered steps, flowing naturally
const Stepper = ({ c }) => (
  <div className="my-4" data-testid="stepper-block">
    <p className="grimoire-section-label">The Working</p>
    <ol className="grimoire-steps">
      {c.steps?.map((step, index) => (
        <li key={index}>
          {step.title && (
            <span className="grimoire-step-title">{step.title}. </span>
          )}
          <span className="grimoire-body">
            {step.action || step.instruction || step.text}
          </span>
          {step.spoken_words && (
            <blockquote className="grimoire-spoken">{step.spoken_words}</blockquote>
          )}
          {step.why && (
            <p className="grimoire-body text-sm italic opacity-70 mt-0.5">{step.why}</p>
          )}
        </li>
      ))}
    </ol>
    {c.completion_message && (
      <p className="grimoire-body italic text-center mt-2">{c.completion_message}</p>
    )}
  </div>
);

// Lore Vignette — just prose with a small tradition label
const LoreVignette = ({ c }) => (
  <div className="my-4" data-testid="lore-vignette-block">
    {(c.era || c.tradition || c.title) && (
      <p className="grimoire-section-label text-center">
        {c.era && `${c.era} · `}{c.tradition || c.title}
      </p>
    )}
    <p className="grimoire-body">{c.narrative}</p>
    {c.relevance_to_working && (
      <p className="grimoire-body text-sm opacity-80 mt-1">{c.relevance_to_working}</p>
    )}
    {c.source_connection && (
      <p className="text-xs opacity-50 mt-1 italic" style={{ color: '#2A2218' }}>— {c.source_connection}</p>
    )}
  </div>
);

// Choice — subtle italic options, not big buttons
const Choice = ({ c }) => {
  const [selected, setSelected] = useState(null);
  return (
    <div className="my-4" data-testid="choice-block">
      <p className="grimoire-body">{c.prompt}</p>
      <div className="mt-1 pl-4 border-l border-gold/20 space-y-0.5">
        {c.options?.map((opt) => (
          <p
            key={opt.id}
            onClick={() => setSelected(opt.id)}
            className={cn(
              "grimoire-body text-sm cursor-pointer transition-opacity",
              selected === opt.id ? "opacity-100" : "opacity-70 hover:opacity-100"
            )}
          >
            <em>{opt.label}</em>
            {opt.description && <span> — {opt.description}</span>}
            {selected === opt.id && <span className="text-gold ml-1">*</span>}
          </p>
        ))}
      </div>
      {c.consequence_hint && (
        <p className="grimoire-body text-sm italic opacity-60 mt-0.5">&ldquo;{c.consequence_hint}&rdquo;</p>
      )}
    </div>
  );
};

// Closing — flowing farewell text
const Closing = ({ c }) => (
  <div className="my-4" data-testid="closing-block">
    {c.license_to_depart && (
      <p className="grimoire-body">{c.license_to_depart}</p>
    )}
    {c.grounding_action && (
      <p className="grimoire-body mt-1">{c.grounding_action}</p>
    )}
    {c.empowerment_line && (
      <p className="grimoire-body italic text-center mt-2">{c.empowerment_line}</p>
    )}
    {c.next_steps_hint && (
      <p className="grimoire-body text-sm mt-1 opacity-80">
        <em>In the next 24 hours:</em> {c.next_steps_hint}
      </p>
    )}
  </div>
);

// Reflection — prompts as a simple list
const Reflection = ({ c }) => (
  <div className="my-4" data-testid="reflection-block">
    {c.guide_note && (
      <p className="grimoire-body italic opacity-80">&ldquo;{c.guide_note}&rdquo;</p>
    )}
    {c.prompts?.length > 0 && (
      <ul className="grimoire-inline-list mt-1">
        {c.prompts.map((prompt, i) => (
          <li key={i}>{prompt}</li>
        ))}
      </ul>
    )}
  </div>
);

// Bird Oracle — small icon, italic message
const BirdOracle = ({ c }) => (
  <div className="my-4 text-center" data-testid="bird-oracle-block">
    <img
      src="/icons/anchors/gold/anchor-bird.png"
      alt=""
      className="w-6 h-6 mx-auto mb-1 opacity-50"
    />
    <p className="grimoire-section-label">
      {c.bird || c.bird_name || 'The Bird Oracle'}
    </p>
    <p className="grimoire-body italic">
      &ldquo;{c.message || c.oracle_message}&rdquo;
    </p>
    {c.observation_prompt && (
      <p className="grimoire-body text-sm opacity-70 mt-1">{c.observation_prompt}</p>
    )}
  </div>
);

// Ward — inline prose
const Ward = ({ c }) => (
  <div className="my-4" data-testid="ward-block">
    {c.ward_name && (
      <p className="grimoire-section-label">{c.ward_name}</p>
    )}
    {c.protects_against && (
      <p className="grimoire-body text-sm italic opacity-80 mb-1">{c.protects_against}</p>
    )}
    {c.creation_steps?.map((step, i) => (
      <p key={i} className="grimoire-body mb-0.5">{step}</p>
    ))}
    {c.activation_phrase && (
      <blockquote className="grimoire-spoken">&ldquo;{c.activation_phrase}&rdquo;</blockquote>
    )}
    {c.talisman_option && (
      <p className="grimoire-body text-sm opacity-70 mt-0.5">{c.talisman_option}</p>
    )}
  </div>
);

// Song Prompt
const SongPrompt = ({ c }) => (
  <div className="my-4" data-testid="song-prompt-block">
    <p className="grimoire-body">{c.instruction}</p>
    {(c.phrase || c.words_optional) && (
      <blockquote className="grimoire-spoken">
        &ldquo;{c.phrase || c.words_optional}&rdquo;
      </blockquote>
    )}
    {(c.why_this_sound || c.purpose) && (
      <p className="grimoire-body text-sm italic opacity-70">{c.why_this_sound || c.purpose}</p>
    )}
  </div>
);

// Evidence Card
const EvidenceCard = ({ c }) => (
  <div className="my-4" data-testid="evidence-card-block">
    {c.known?.length > 0 && (
      <div className="mb-1">
        <p className="grimoire-section-label">What the records show</p>
        {c.known.map((item, i) => (
          <p key={i} className="grimoire-body">{item}</p>
        ))}
      </div>
    )}
    {c.likely?.length > 0 && (
      <div className="mb-1">
        <p className="grimoire-section-label">What the patterns suggest</p>
        {c.likely.map((item, i) => (
          <p key={i} className="grimoire-body opacity-85">{item}</p>
        ))}
      </div>
    )}
    {c.lore?.length > 0 && (
      <div>
        <p className="grimoire-section-label">What the stories tell</p>
        {c.lore.map((item, i) => (
          <p key={i} className="grimoire-body italic opacity-85">{item}</p>
        ))}
      </div>
    )}
    {c.pattern_note && (
      <p className="grimoire-body text-sm italic opacity-70 mt-1">&ldquo;{c.pattern_note}&rdquo;</p>
    )}
  </div>
);

// Safety Note — small italic note, left border accent
const SafetyNote = ({ c }) => (
  <p className="grimoire-body text-sm italic opacity-70 pl-3 border-l-2 border-gold/30 my-4" data-testid="safety-note-block">
    {c.warning || c.note}
    {c.when_to_stop && <span> Pause if: {c.when_to_stop}</span>}
  </p>
);

// Poetry Reading
const PoetryReading = ({ c }) => (
  <div className="my-4" data-testid="poetry-reading-block">
    {c.poem_title && (
      <p className="grimoire-section-label">{c.poem_title}{c.poem_author && ` — ${c.poem_author}`}</p>
    )}
    {c.poem_text && (
      <blockquote className="grimoire-body italic whitespace-pre-line pl-4 border-l border-gold/20 my-1">
        {c.poem_text}
      </blockquote>
    )}
    {c.guide_commentary && (
      <p className="grimoire-body text-sm opacity-80 mt-1">{c.guide_commentary}</p>
    )}
  </div>
);

// Observation Task
const ObservationTask = ({ c }) => (
  <div className="my-4" data-testid="observation-task-block">
    <p className="grimoire-body">{c.task_description}</p>
    {c.what_to_notice && (
      <p className="grimoire-body text-sm italic opacity-80 mt-0.5">Notice: {c.what_to_notice}</p>
    )}
  </div>
);

// Further Reading
const FurtherReading = ({ c }) => (
  <div className="my-4" data-testid="further-reading-block">
    <p className="grimoire-section-label">Further Reading</p>
    {c.recommendations?.map((rec, i) => (
      <p key={i} className="grimoire-body text-sm">
        <em>{rec.title}</em>
        {rec.author && <span> by {rec.author}</span>}
        {rec.guide_note && <span className="opacity-70"> — {rec.guide_note}</span>}
      </p>
    ))}
  </div>
);

export default SpellBlockRenderer;
