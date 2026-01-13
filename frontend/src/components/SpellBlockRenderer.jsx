// SpellBlockRenderer - Renders blocks-based spell experience
// Handles all block types with interactive stepper and logging

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, ChevronUp, Check, Circle, Play, Pause,
  BookOpen, Feather, Flame, Moon, Star, Bird, Music,
  Shield, Eye, FileText, Clock, AlertTriangle, Quote,
  Sparkles, Heart, ArrowRight, Edit3
} from 'lucide-react';
import { cn } from '../lib/utils';

// Block type icons
const BLOCK_ICONS = {
  cold_open: Sparkles,
  materials: Feather,
  choice: ArrowRight,
  stepper: Play,
  lore_vignette: BookOpen,
  reflection: Edit3,
  closing: Moon,
  bird_oracle: Bird,
  ward: Shield,
  song_prompt: Music,
  evidence_card: Eye,
  journal_prompt: FileText,
  safety_note: AlertTriangle
};

// Block type labels
const BLOCK_LABELS = {
  cold_open: 'Opening',
  materials: 'What You\'ll Need',
  choice: 'Your Choice',
  stepper: 'The Working',
  lore_vignette: 'From the Archives',
  reflection: 'Reflection',
  closing: 'Closing',
  bird_oracle: 'Bird Oracle',
  ward: 'Protection Ward',
  song_prompt: 'Voice Work',
  evidence_card: 'Inspiration',
  journal_prompt: 'Journal',
  safety_note: 'Safety Note'
};

// Main Block Renderer Component
export const SpellBlockRenderer = ({ 
  spell, 
  archetypeStyle = {},
  onLogUpdate = () => {},
  initialLog = {}
}) => {
  const [expandedBlocks, setExpandedBlocks] = useState(new Set(['cold_open_1']));
  const [stepperProgress, setStepperProgress] = useState({});
  const [selectedChoices, setSelectedChoices] = useState({});
  const [journalEntries, setJournalEntries] = useState(initialLog);

  const blocks = spell?.blocks || [];
  const personaLock = spell?.persona_lock || {};
  const canonAnchor = spell?.canon_anchor || {};

  const toggleBlock = useCallback((blockId) => {
    setExpandedBlocks(prev => {
      const next = new Set(prev);
      if (next.has(blockId)) {
        next.delete(blockId);
      } else {
        next.add(blockId);
      }
      return next;
    });
  }, []);

  const handleStepComplete = useCallback((blockId, stepIndex) => {
    setStepperProgress(prev => {
      const blockProgress = prev[blockId] || new Set();
      const next = new Set(blockProgress);
      if (next.has(stepIndex)) {
        next.delete(stepIndex);
      } else {
        next.add(stepIndex);
      }
      const updated = { ...prev, [blockId]: next };
      onLogUpdate({ stepperProgress: updated });
      return updated;
    });
  }, [onLogUpdate]);

  const handleChoiceSelect = useCallback((blockId, optionId) => {
    setSelectedChoices(prev => {
      const updated = { ...prev, [blockId]: optionId };
      onLogUpdate({ choices: updated });
      return updated;
    });
  }, [onLogUpdate]);

  const handleJournalEntry = useCallback((fieldId, value) => {
    setJournalEntries(prev => {
      const updated = { ...prev, [fieldId]: value };
      onLogUpdate({ journal: updated });
      return updated;
    });
  }, [onLogUpdate]);

  return (
    <div className="space-y-4" data-testid="spell-block-renderer">
      {/* Persona Lock Header */}
      {personaLock.props && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
          <Sparkles className="w-3 h-3" />
          <span>{personaLock.props.join(' • ')} • {personaLock.sensory_cue}</span>
        </div>
      )}

      {/* Canon Anchor Badge */}
      {canonAnchor.title && (
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full text-xs mb-4">
          <BookOpen className="w-3 h-3" />
          <span>{canonAnchor.title}</span>
          {canonAnchor.year && <span className="text-muted-foreground">({canonAnchor.year})</span>}
        </div>
      )}

      {/* Render Blocks */}
      {blocks.map((block, index) => (
        <BlockWrapper
          key={block.block_id || index}
          block={block}
          isExpanded={expandedBlocks.has(block.block_id)}
          onToggle={() => toggleBlock(block.block_id)}
          archetypeStyle={archetypeStyle}
          stepperProgress={stepperProgress[block.block_id]}
          selectedChoice={selectedChoices[block.block_id]}
          journalEntries={journalEntries}
          onStepComplete={(stepIndex) => handleStepComplete(block.block_id, stepIndex)}
          onChoiceSelect={(optionId) => handleChoiceSelect(block.block_id, optionId)}
          onJournalEntry={handleJournalEntry}
        />
      ))}
    </div>
  );
};

// Block Wrapper - handles expand/collapse and common styling
const BlockWrapper = ({
  block,
  isExpanded,
  onToggle,
  archetypeStyle,
  stepperProgress,
  selectedChoice,
  journalEntries,
  onStepComplete,
  onChoiceSelect,
  onJournalEntry
}) => {
  const Icon = BLOCK_ICONS[block.block_type] || Sparkles;
  const label = BLOCK_LABELS[block.block_type] || block.block_type;
  
  // Cold open is always expanded and has no header
  if (block.block_type === 'cold_open') {
    return (
      <ColdOpenBlock 
        content={block.content} 
        archetypeStyle={archetypeStyle}
      />
    );
  }

  return (
    <div 
      className={cn(
        "border rounded-lg overflow-hidden transition-all",
        archetypeStyle.borderColor || "border-border"
      )}
      data-testid={`block-${block.block_type}`}
    >
      {/* Block Header */}
      <button
        onClick={onToggle}
        className={cn(
          "w-full flex items-center justify-between p-4 text-left transition-colors",
          "hover:bg-muted/50",
          archetypeStyle.bgAccent || "bg-muted/20"
        )}
      >
        <div className="flex items-center gap-3">
          <Icon className={cn("w-5 h-5", archetypeStyle.accentColor || "text-primary")} />
          <span className="font-medium font-cinzel">{label}</span>
          
          {/* Progress indicator for stepper */}
          {block.block_type === 'stepper' && stepperProgress && (
            <span className="text-xs text-muted-foreground">
              ({stepperProgress.size || 0}/{block.content?.steps?.length || 0})
            </span>
          )}
          
          {/* Choice indicator */}
          {block.block_type === 'choice' && selectedChoice && (
            <Check className="w-4 h-4 text-green-500" />
          )}
        </div>
        
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        )}
      </button>

      {/* Block Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-4 pt-0">
              <BlockContent
                block={block}
                archetypeStyle={archetypeStyle}
                stepperProgress={stepperProgress}
                selectedChoice={selectedChoice}
                journalEntries={journalEntries}
                onStepComplete={onStepComplete}
                onChoiceSelect={onChoiceSelect}
                onJournalEntry={onJournalEntry}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Block Content Router
const BlockContent = ({
  block,
  archetypeStyle,
  stepperProgress,
  selectedChoice,
  journalEntries,
  onStepComplete,
  onChoiceSelect,
  onJournalEntry
}) => {
  switch (block.block_type) {
    case 'materials':
      return <MaterialsBlock content={block.content} archetypeStyle={archetypeStyle} />;
    case 'choice':
      return <ChoiceBlock content={block.content} selectedChoice={selectedChoice} onSelect={onChoiceSelect} archetypeStyle={archetypeStyle} />;
    case 'stepper':
      return <StepperBlock content={block.content} progress={stepperProgress} onComplete={onStepComplete} archetypeStyle={archetypeStyle} />;
    case 'lore_vignette':
      return <LoreVignetteBlock content={block.content} archetypeStyle={archetypeStyle} />;
    case 'reflection':
      return <ReflectionBlock content={block.content} entries={journalEntries} onEntry={onJournalEntry} archetypeStyle={archetypeStyle} />;
    case 'closing':
      return <ClosingBlock content={block.content} archetypeStyle={archetypeStyle} />;
    case 'bird_oracle':
      return <BirdOracleBlock content={block.content} entries={journalEntries} onEntry={onJournalEntry} archetypeStyle={archetypeStyle} />;
    case 'ward':
      return <WardBlock content={block.content} archetypeStyle={archetypeStyle} />;
    case 'song_prompt':
      return <SongPromptBlock content={block.content} archetypeStyle={archetypeStyle} />;
    case 'evidence_card':
      return <EvidenceCardBlock content={block.content} archetypeStyle={archetypeStyle} />;
    case 'journal_prompt':
      return <JournalPromptBlock content={block.content} entries={journalEntries} onEntry={onJournalEntry} archetypeStyle={archetypeStyle} />;
    case 'safety_note':
      return <SafetyNoteBlock content={block.content} archetypeStyle={archetypeStyle} />;
    default:
      return <div className="text-muted-foreground">Unknown block type: {block.block_type}</div>;
  }
};

// === INDIVIDUAL BLOCK COMPONENTS ===

// Cold Open - Guide's opening narrative
const ColdOpenBlock = ({ content, archetypeStyle }) => (
  <div className={cn("p-6 rounded-lg", archetypeStyle.bgAccent || "bg-muted/20")} data-testid="cold-open-block">
    {content.greeting && (
      <p className="text-lg font-cinzel mb-4 italic">&ldquo;{content.greeting}&rdquo;</p>
    )}
    {content.scene_setting && (
      <p className="text-muted-foreground mb-3">{content.scene_setting}</p>
    )}
    {content.hook && (
      <p className="text-foreground">{content.hook}</p>
    )}
  </div>
);

// Materials Block
const MaterialsBlock = ({ content, archetypeStyle }) => (
  <div className="space-y-3" data-testid="materials-block">
    {content.items?.map((item, i) => (
      <div key={i} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
        <Feather className={cn("w-4 h-4 mt-1 flex-shrink-0", archetypeStyle.accentColor || "text-primary")} />
        <div className="flex-1">
          <div className="font-medium">{item.name}</div>
          <div className="text-sm text-muted-foreground">{item.purpose}</div>
          {item.substitution && (
            <div className="text-xs text-muted-foreground mt-1">
              <span className="font-medium">Alternative:</span> {item.substitution}
            </div>
          )}
        </div>
        {item.optional && (
          <span className="text-xs px-2 py-0.5 bg-muted rounded">optional</span>
        )}
      </div>
    ))}
    {content.gathering_note && (
      <p className="text-sm italic text-muted-foreground mt-4">&ldquo;{content.gathering_note}&rdquo;</p>
    )}
  </div>
);

// Choice Block - Interactive decision point
const ChoiceBlock = ({ content, selectedChoice, onSelect, archetypeStyle }) => (
  <div className="space-y-4" data-testid="choice-block">
    <p className="text-lg font-medium">{content.prompt}</p>
    
    <div className="grid gap-3">
      {content.options?.map((option) => (
        <button
          key={option.id}
          onClick={() => onSelect(option.id)}
          className={cn(
            "p-4 rounded-lg border-2 text-left transition-all",
            selectedChoice === option.id
              ? cn("border-primary bg-primary/10", archetypeStyle.borderColor)
              : "border-border hover:border-muted-foreground"
          )}
        >
          <div className="flex items-center gap-3">
            {selectedChoice === option.id ? (
              <Check className="w-5 h-5 text-primary" />
            ) : (
              <Circle className="w-5 h-5 text-muted-foreground" />
            )}
            <div>
              <div className="font-medium">{option.label}</div>
              <div className="text-sm text-muted-foreground">{option.description}</div>
              {option.affects && (
                <div className="text-xs text-muted-foreground mt-1 italic">{option.affects}</div>
              )}
            </div>
          </div>
        </button>
      ))}
    </div>
    
    {content.consequence_hint && (
      <p className="text-sm italic text-muted-foreground">&ldquo;{content.consequence_hint}&rdquo;</p>
    )}
  </div>
);

// Stepper Block - Interactive step-by-step with checkboxes
const StepperBlock = ({ content, progress = new Set(), onComplete, archetypeStyle }) => (
  <div className="space-y-4" data-testid="stepper-block">
    {content.steps?.map((step, index) => {
      const isComplete = progress.has(index);
      
      return (
        <div 
          key={index}
          className={cn(
            "p-4 rounded-lg border transition-all",
            isComplete ? "bg-primary/5 border-primary/30" : "border-border"
          )}
        >
          <div className="flex items-start gap-3">
            <button
              onClick={() => onComplete(index)}
              className={cn(
                "mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0",
                isComplete 
                  ? "bg-primary border-primary text-primary-foreground" 
                  : "border-muted-foreground hover:border-primary"
              )}
              data-testid={`step-checkbox-${index}`}
            >
              {isComplete && <Check className="w-4 h-4" />}
            </button>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className={cn(
                  "text-xs font-medium px-2 py-0.5 rounded",
                  archetypeStyle.bgAccent || "bg-muted"
                )}>
                  Step {step.step_number}
                </span>
                {step.duration_hint && (
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {step.duration_hint}
                  </span>
                )}
              </div>
              
              <p className={cn("mb-2", isComplete && "line-through opacity-60")}>
                {step.action}
              </p>
              
              {step.spoken_words && (
                <div className="bg-muted/50 p-3 rounded-lg mb-2 italic text-sm">
                  <Quote className="w-4 h-4 inline mr-2 opacity-50" />
                  &ldquo;{step.spoken_words}&rdquo;
                </div>
              )}
              
              {step.why && (
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium">Why:</span> {step.why}
                </div>
              )}
            </div>
          </div>
        </div>
      );
    })}
    
    {content.completion_message && progress.size === content.steps?.length && (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 bg-primary/10 rounded-lg text-center"
      >
        <Check className="w-6 h-6 mx-auto mb-2 text-primary" />
        <p className="font-cinzel">{content.completion_message}</p>
      </motion.div>
    )}
  </div>
);

// Lore Vignette Block - Historical/folkloric story
const LoreVignetteBlock = ({ content, archetypeStyle }) => (
  <div className="space-y-4" data-testid="lore-vignette-block">
    {content.title && (
      <h4 className="font-cinzel text-lg">{content.title}</h4>
    )}
    
    <div className="flex items-center gap-4 text-xs text-muted-foreground">
      {content.era && <span>{content.era}</span>}
      {content.tradition && <span>• {content.tradition}</span>}
    </div>
    
    <div className="prose prose-sm prose-invert max-w-none">
      <p className="text-foreground/90 leading-relaxed">{content.narrative}</p>
    </div>
    
    {content.relevance_to_working && (
      <div className={cn("p-3 rounded-lg text-sm", archetypeStyle.bgAccent || "bg-muted/30")}>
        <span className="font-medium">Connection:</span> {content.relevance_to_working}
      </div>
    )}
    
    {content.source_connection && (
      <div className="text-xs text-muted-foreground italic">
        Source: {content.source_connection}
      </div>
    )}
  </div>
);

// Reflection Block
const ReflectionBlock = ({ content, entries, onEntry, archetypeStyle }) => (
  <div className="space-y-4" data-testid="reflection-block">
    {content.guide_note && (
      <p className="italic text-muted-foreground">&ldquo;{content.guide_note}&rdquo;</p>
    )}
    
    {content.prompts?.map((prompt, i) => (
      <div key={i} className="p-3 bg-muted/30 rounded-lg">
        <p className="text-sm mb-2">{prompt}</p>
      </div>
    ))}
    
    {content.log_fields?.map((field) => (
      <div key={field.field_id} className="space-y-2">
        <label className="text-sm font-medium">{field.label}</label>
        {field.type === 'scale' ? (
          <input
            type="range"
            min="1"
            max="10"
            value={entries[field.field_id] || 5}
            onChange={(e) => onEntry(field.field_id, e.target.value)}
            className="w-full"
          />
        ) : field.type === 'textarea' ? (
          <textarea
            value={entries[field.field_id] || ''}
            onChange={(e) => onEntry(field.field_id, e.target.value)}
            className="w-full p-2 bg-background border rounded-lg text-sm"
            rows={3}
            placeholder={field.placeholder}
          />
        ) : (
          <input
            type="text"
            value={entries[field.field_id] || ''}
            onChange={(e) => onEntry(field.field_id, e.target.value)}
            className="w-full p-2 bg-background border rounded-lg text-sm"
            placeholder={field.placeholder}
          />
        )}
      </div>
    ))}
  </div>
);

// Closing Block
const ClosingBlock = ({ content, archetypeStyle }) => (
  <div className="space-y-4" data-testid="closing-block">
    {content.license_to_depart && (
      <div className="p-4 bg-muted/30 rounded-lg">
        <p className="italic">&ldquo;{content.license_to_depart}&rdquo;</p>
      </div>
    )}
    
    {content.grounding_action && (
      <div className="flex items-start gap-3">
        <Moon className={cn("w-5 h-5 mt-0.5", archetypeStyle.accentColor || "text-primary")} />
        <p>{content.grounding_action}</p>
      </div>
    )}
    
    {content.empowerment_line && (
      <div className={cn("p-4 rounded-lg text-center font-cinzel", archetypeStyle.bgAccent || "bg-primary/10")}>
        <p className="text-lg">&ldquo;{content.empowerment_line}&rdquo;</p>
      </div>
    )}
    
    {content.next_steps_hint && (
      <p className="text-sm text-muted-foreground">
        <span className="font-medium">In the next 24 hours:</span> {content.next_steps_hint}
      </p>
    )}
  </div>
);

// Bird Oracle Block
const BirdOracleBlock = ({ content, entries, onEntry, archetypeStyle }) => (
  <div className="space-y-4" data-testid="bird-oracle-block">
    <div className="flex items-center gap-3">
      <Bird className={cn("w-8 h-8", archetypeStyle.accentColor || "text-primary")} />
      <div>
        <div className="font-cinzel text-lg">{content.bird || content.bird_name}</div>
        <div className="text-sm text-muted-foreground">Oracle Message</div>
      </div>
    </div>
    
    <div className="p-4 bg-muted/30 rounded-lg italic">
      &ldquo;{content.message || content.oracle_message}&rdquo;
    </div>
    
    {content.observation_prompt && (
      <div className="space-y-2">
        <p className="text-sm">{content.observation_prompt}</p>
        {content.log_field && (
          <textarea
            value={entries['bird_observation'] || ''}
            onChange={(e) => onEntry('bird_observation', e.target.value)}
            className="w-full p-2 bg-background border rounded-lg text-sm"
            rows={2}
            placeholder="Record what you observe..."
          />
        )}
      </div>
    )}
  </div>
);

// Ward Block
const WardBlock = ({ content, archetypeStyle }) => (
  <div className="space-y-4" data-testid="ward-block">
    <div className="flex items-center gap-3">
      <Shield className={cn("w-6 h-6", archetypeStyle.accentColor || "text-primary")} />
      <div>
        <div className="font-cinzel text-lg">{content.ward_name}</div>
        <div className="text-sm text-muted-foreground">{content.purpose}</div>
      </div>
    </div>
    
    {content.creation_steps && (
      <ol className="space-y-2 list-decimal list-inside">
        {content.creation_steps.map((step, i) => (
          <li key={i} className="text-sm">{step}</li>
        ))}
      </ol>
    )}
    
    {content.activation_phrase && (
      <div className="p-4 bg-muted/50 rounded-lg text-center">
        <p className="text-sm text-muted-foreground mb-1">Activation Phrase:</p>
        <p className="font-cinzel italic">&ldquo;{content.activation_phrase}&rdquo;</p>
      </div>
    )}
    
    {content.talisman_option && (
      <p className="text-sm text-muted-foreground">
        <span className="font-medium">Optional talisman:</span> {content.talisman_option}
      </p>
    )}
  </div>
);

// Song Prompt Block
const SongPromptBlock = ({ content, archetypeStyle }) => (
  <div className="space-y-4" data-testid="song-prompt-block">
    <div className="flex items-start gap-3">
      <Music className={cn("w-6 h-6", archetypeStyle.accentColor || "text-primary")} />
      <div>
        <p className="font-medium">{content.instruction}</p>
        {content.suggested_melody && (
          <p className="text-sm text-muted-foreground mt-1">
            Suggested melody: {content.suggested_melody}
          </p>
        )}
      </div>
    </div>
    
    {content.words_optional && (
      <div className="p-3 bg-muted/30 rounded-lg italic text-sm">
        Optional words: &ldquo;{content.words_optional}&rdquo;
      </div>
    )}
    
    {content.purpose && (
      <p className="text-sm text-muted-foreground">{content.purpose}</p>
    )}
  </div>
);

// Inspiration Block (Theresa specialty) - formerly Evidence Card
const EvidenceCardBlock = ({ content, archetypeStyle }) => (
  <div className="space-y-4" data-testid="inspiration-block">
    <div className="grid gap-4">
      {content.known?.length > 0 && (
        <div className="p-3 bg-indigo-500/10 border border-indigo-500/30 rounded-lg">
          <div className="text-xs font-cinzel tracking-wider text-indigo-400 mb-2">What the Records Show</div>
          <ul className="space-y-1 text-sm">
            {content.known.map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <Check className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {content.likely?.length > 0 && (
        <div className="p-3 bg-slate-500/10 border border-slate-500/30 rounded-lg">
          <div className="text-xs font-cinzel tracking-wider text-slate-400 mb-2">What the Patterns Suggest</div>
          <ul className="space-y-1 text-sm">
            {content.likely.map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <Star className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {content.lore?.length > 0 && (
        <div className="p-3 bg-violet-500/10 border border-violet-500/30 rounded-lg">
          <div className="text-xs font-cinzel tracking-wider text-violet-400 mb-2">What the Stories Tell</div>
          <ul className="space-y-1 text-sm">
            {content.lore.map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <BookOpen className="w-4 h-4 text-violet-400 mt-0.5 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
    
    {content.pattern_note && (
      <p className="text-sm italic text-muted-foreground">&ldquo;{content.pattern_note}&rdquo;</p>
    )}
  </div>
);

// Journal Prompt Block
const JournalPromptBlock = ({ content, entries, onEntry, archetypeStyle }) => (
  <div className="space-y-4" data-testid="journal-prompt-block">
    {content.prompts?.map((prompt, i) => (
      <div key={i} className="p-3 bg-muted/30 rounded-lg">
        <p className="text-sm">{prompt}</p>
      </div>
    ))}
    
    {content.fields?.map((field) => (
      <div key={field.id} className="space-y-2">
        <label className="text-sm font-medium">{field.label}</label>
        <textarea
          value={entries[field.id] || ''}
          onChange={(e) => onEntry(field.id, e.target.value)}
          className="w-full p-2 bg-background border rounded-lg text-sm"
          rows={3}
          placeholder={field.placeholder}
        />
      </div>
    ))}
  </div>
);

// Safety Note Block
const SafetyNoteBlock = ({ content, archetypeStyle }) => (
  <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg" data-testid="safety-note-block">
    <div className="flex items-start gap-3">
      <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0" />
      <div>
        <p className="text-sm">{content.note}</p>
        {content.alternatives?.length > 0 && (
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
            {content.alternatives.map((alt, i) => (
              <li key={i}>• {alt}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  </div>
);

export default SpellBlockRenderer;
