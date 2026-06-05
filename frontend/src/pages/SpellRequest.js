import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { GrimoirePage } from '../components/GrimoirePage';
import { aiAPI, subscriptionAPI } from '../utils/api';
import { ARCHETYPES, getArchetypeById } from '../data/archetypes';
import { getCurrentArchetype, setCurrentArchetype } from '../components/OnboardingModal';
import { SpellLimitBanner } from '../components/UpgradePrompt';
import HandcraftedMagicModal from '../components/HandcraftedMagicModal';
import HandcraftedBanner from '../components/HandcraftedBanner';
import { DarkSection, LightSection, GrandDivider, MysticalDivider, ElaborateCorner, PageHeader, OrnateCard, LightOrnateCard, StepperOrnament, BestiaryGlyph, ATMOSPHERIC_IMAGES } from '../components/OrnateElements';
import { 
  ChevronRight, ChevronLeft, Check, Loader2
} from 'lucide-react';
import BrandIcon from '../components/BrandIcon';
import { toast } from 'sonner';

// ===== DERIVE VIDEOS FROM ARCHETYPES.JS (single source of truth) =====
const getArchetypeVideo = (personaId) => {
  // Map persona IDs (from PERSONAS) to archetype IDs (from ARCHETYPES)
  const idMap = {
    'shigg': 'shiggy',
    'cathleen': 'kathleen',
    'katherine': 'katherine',
    'theresa': 'theresa',
    'brenda': 'brenda'
  };
  const archetypeId = idMap[personaId] || personaId;
  const archetype = ARCHETYPES.find(a => a.id === archetypeId);
  return archetype?.video || null;
};

// Generic fallback video for non-persona spells - Silent Army video for magical workings
const GENERIC_SPELL_VIDEO = '/videos/silent-army-spells.mp4';

// Get all available videos for random selection (for choose_for_me fallback)
const ALL_ARCHETYPE_VIDEOS = ARCHETYPES.filter(a => a.video).map(a => a.video);

// ===== WIZARD CONFIGURATION =====

const PERSONAS = [
  { id: 'shigg', name: 'Shigg', icon: '/icons/guides/guide-shigg.png', title: 'Birds of Parliament', description: 'Gentle domestic magic, bird omens, tea rituals, poetry' },
  { id: 'cathleen', name: 'Cathleen', icon: '/icons/guides/guide-cathleen.png', title: 'Singer of Strength', description: 'Voice magic, protection, Celtic mysticism, the Morrigan' },
  { id: 'katherine', name: 'Katherine', icon: '/icons/guides/guide-katherine.png', title: 'Weaver of Hidden Knowledge', description: 'Shadow work, mirrors, Victorian spiritualism, protocols' },
  { id: 'theresa', name: 'Theresa', icon: '/icons/guides/guide-theresa.png', title: 'The Seer-Archivist', description: 'Pattern breaking, family secrets, evidence-based investigation' },
  { id: 'brenda', name: 'Brenda', icon: '/icons/guides/guide-brenda.png', title: 'The Family Chronicler', description: 'Memory keeping, letter spells, crow communion, family stories' },
  { id: 'choose_for_me', name: 'Choose for me', icon: null, title: 'Let the guides decide', description: 'Based on your needs, the right guide will emerge' }
];

const ALCHEMIZE_OPTIONS = [
  { id: 'protection', label: 'Protection', iconSrc: '/icons/alchemize/alchemize-protection.png', color: 'text-crimson-bright', description: 'Wards, shields, boundaries', forPersonas: ['cathleen', 'katherine', 'shigg'] },
  { id: 'baneful_justice', label: 'Baneful Justice', iconSrc: '/icons/alchemize/alchemize-baneful-justice.png', color: 'text-crimson', description: 'Binding, truth-revealing, accountability', forPersonas: ['katherine', 'cathleen', 'theresa'] },
  { id: 'comfort_healing', label: 'Comfort & Healing', iconSrc: '/icons/alchemize/alchemize-comfort-healing.png', color: 'text-gold-light', description: 'Grief, loss, emotional support', forPersonas: ['shigg', 'brenda', 'cathleen'] },
  { id: 'clarity_truth', label: 'Clarity & Truth', iconSrc: '/icons/alchemize/alchemize-clarity-truth.png', color: 'text-gold', description: 'Discernment, seeing clearly, revelation', forPersonas: ['theresa', 'katherine', 'shigg'] },
  { id: 'releasing', label: 'Releasing & Letting Go', iconSrc: '/icons/alchemize/alchemize-releasing.png', color: 'text-blue-400', description: 'Breaking patterns, cord-cutting, freedom', forPersonas: ['theresa', 'katherine', 'brenda'] },
  { id: 'ancestral_work', label: 'Ancestral Work', iconSrc: '/icons/alchemize/alchemize-ancestral-work.png', color: 'text-crimson', description: 'Family patterns, lineage healing, memory', forPersonas: ['theresa', 'brenda', 'shigg'] },
  { id: 'domestic_magic', label: 'Domestic Magic', iconSrc: '/icons/alchemize/alchemize-domestic-magic.png', color: 'text-gold', description: 'Home blessing, kitchen magic, hearth craft', forPersonas: ['shigg', 'cathleen'] },
  { id: 'courage_strength', label: 'Courage & Strength', iconSrc: '/icons/alchemize/alchemize-courage-strength.png', color: 'text-gold', description: 'Empowerment, voice, standing ground', forPersonas: ['cathleen', 'theresa'] }
];

// Keep FEELINGS for backward compatibility with existing grimoire entries
const FEELINGS = [
  { id: 'calm', label: 'Calm', brandIcon: 'halfmoon', color: 'text-blue-400', forPersonas: ['shigg', 'brenda', 'katherine'] },
  { id: 'brave', label: 'Brave', brandIcon: 'pentagram', color: 'text-gold-light', forPersonas: ['cathleen', 'theresa', 'katherine'] },
  { id: 'clear', label: 'Clear', brandIcon: 'eye', color: 'text-gold', forPersonas: ['katherine', 'theresa', 'shigg'] },
  { id: 'protected', label: 'Protected', brandIcon: 'pentagram', color: 'text-gold', forPersonas: ['cathleen', 'katherine'] },
  { id: 'softened', label: 'Softened', brandIcon: 'sacredheart', color: 'text-crimson-bright', forPersonas: ['shigg', 'brenda', 'cathleen'] },
  { id: 'energized', label: 'Energized', brandIcon: 'eightstar', color: 'text-gold', forPersonas: ['cathleen', 'theresa'] },
  { id: 'connected', label: 'Connected', brandIcon: 'sacredheart', color: 'text-crimson', forPersonas: ['brenda', 'shigg'] }
];

const TIMES = [
  { id: '2_min', label: '2 minutes', description: 'Quick & immediate' },
  { id: '10_min', label: '10 minutes', description: 'Focused ritual' },
  { id: '30_min', label: '30 minutes', description: 'Full ceremony' }
];

const TONES = [
  { id: 'gentle', label: 'Gentle', description: 'Soft, nurturing, invitational' },
  { id: 'practical', label: 'Practical', description: 'Clear, direct, grounded' },
  { id: 'intense', label: 'Intense', description: 'Powerful, unflinching, deep' }
];

const BELIEF_BOUNDARIES = [
  { id: 'secular_reflective', label: 'Secular & Reflective', description: 'Psychology-focused, no supernatural framing' },
  { id: 'spiritual_grounded', label: 'Spiritual & Grounded', description: 'Energy work, symbolic, open to mystery' },
  { id: 'practitioner', label: 'Practitioner', description: 'Direct magical framing, experienced seeker' }
];

const ANCHORS = [
  // Shigg - domestic, birds, tea, kitchen
  { id: 'tea', label: 'Tea', icon: '/icons/anchors/anchor-tea.png', forPersonas: ['shigg'] },
  { id: 'bird', label: 'Bird', icon: '/icons/anchors/anchor-bird.png', forPersonas: ['shigg'] },
  { id: 'bread', label: 'Bread', icon: '/icons/anchors/anchor-bread.png', forPersonas: ['shigg'] },
  { id: 'herb', label: 'Herb/Sprig', icon: '/icons/anchors/anchor-herb.png', forPersonas: ['shigg'] },
  { id: 'poetry', label: 'A Poem', icon: '/icons/anchors/anchor-poetry.png', forPersonas: ['shigg'] },
  // Cathleen - voice, protection, Irish mysticism
  { id: 'song', label: 'Song/Voice', icon: '/icons/anchors/anchor-song.png', forPersonas: ['cathleen'] },
  { id: 'bell', label: 'Bell', icon: '/icons/anchors/anchor-bell.png', forPersonas: ['cathleen'] },
  { id: 'feather', label: 'Feather', icon: '/icons/anchors/anchor-feather.png', forPersonas: ['cathleen'] },
  { id: 'salt', label: 'Salt', icon: '/icons/anchors/anchor-salt.png', forPersonas: ['cathleen'] },
  { id: 'candle', label: 'Candle', icon: '/icons/anchors/anchor-candle.png', forPersonas: ['cathleen'] },
  // Katherine - thread, mirrors, precision, Victorian
  { id: 'thread', label: 'Thread & Needle', icon: '/icons/anchors/anchor-thread.png', forPersonas: ['katherine'] },
  { id: 'mirror', label: 'Mirror', icon: '/icons/anchors/anchor-mirror.png', forPersonas: ['katherine'] },
  { id: 'compass', label: 'Compass', icon: '/icons/anchors/anchor-compass.png', forPersonas: ['katherine'] },
  { id: 'scissors', label: 'Scissors', icon: '/icons/anchors/anchor-scissors.png', forPersonas: ['katherine'] },
  { id: 'sealed_letter', label: 'Sealed Letter', icon: '/icons/anchors/anchor-sealed-letter.png', forPersonas: ['katherine'] },
  // Theresa - investigation, evidence, patterns
  { id: 'notebook', label: 'Notebook & Pen', icon: '/icons/anchors/anchor-notebook.png', forPersonas: ['theresa'] },
  { id: 'photograph', label: 'Photograph', icon: '/icons/anchors/anchor-photograph.png', forPersonas: ['theresa'] },
  { id: 'map', label: 'Map / Family Tree', icon: '/icons/anchors/anchor-map.png', forPersonas: ['theresa'] },
  { id: 'red_thread', label: 'Red Thread', icon: '/icons/anchors/anchor-red-thread.png', forPersonas: ['theresa'] },
  { id: 'magnifying_glass', label: 'Magnifying Glass', icon: '/icons/anchors/anchor-magnifying-glass.png', forPersonas: ['theresa'] },
  // Brenda - memory, family, chronicles
  { id: 'letter', label: 'Letter / Envelope', icon: '/icons/anchors/anchor-letter.png', forPersonas: ['brenda'] },
  { id: 'family_photo', label: 'Family Photo', icon: '/icons/anchors/anchor-family-photo.png', forPersonas: ['brenda'] },
  { id: 'heirloom', label: 'Heirloom / Keepsake', icon: '/icons/anchors/anchor-heirloom.png', forPersonas: ['brenda'] },
  { id: 'recipe_card', label: 'Recipe Card', icon: '/icons/anchors/anchor-recipe-card.png', forPersonas: ['brenda'] },
  { id: 'crow_feather', label: 'Crow Feather', icon: '/icons/anchors/anchor-crow-feather.png', forPersonas: ['brenda'] }
];

const SETTINGS = [
  { id: 'home_quiet', label: 'In the quiet of my home', icon: '/icons/settings/setting-home-quiet.png', description: 'Private space, uninterrupted' },
  { id: 'nature', label: 'Outside in nature', icon: '/icons/settings/setting-nature.png', description: 'Garden, park, woods, water' },
  { id: 'work_daily', label: 'During my daily routine', icon: '/icons/settings/setting-work-daily.png', description: 'Work, errands, regular tasks' },
  { id: 'transit', label: 'On the move', icon: '/icons/settings/setting-transit.png', description: 'Commute, travel, waiting' },
  { id: 'public', label: 'In public or semi-public', icon: '/icons/settings/setting-public.png', description: 'Cafe, library, shared space' }
];

// ===== WIZARD STEP COMPONENTS =====

const StepIndicator = ({ currentStep, totalSteps }) => (
  <div className="flex items-center justify-center gap-2 mb-6">
    {Array.from({ length: totalSteps }).map((_, i) => (
      <div key={i} className="flex items-center">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-cinzel text-sm transition-all ${
          i < currentStep 
            ? 'bg-crimson text-cream' 
            : i === currentStep 
              ? 'bg-crimson text-cream border-2 border-gold' 
              : 'bg-gold/20 text-navy-dark/50 border border-gold/40'
        }`}>
          {i < currentStep ? <Check className="w-4 h-4" /> : i + 1}
        </div>
        {i < totalSteps - 1 && (
          <StepperOrnament active={i < currentStep} />
        )}
      </div>
    ))}
  </div>
);

const OptionCard = ({ selected, onClick, children, className = '', light = false }) => (
  <motion.button
    onClick={onClick}
    className={`relative p-4 rounded-sm text-left transition-all ${
      light 
        ? selected 
          ? 'bg-crimson/10 border-2 border-gold shadow-md shadow-gold/10' 
          : 'bg-white border-2 border-gold/30 hover:border-gold/60 hover:shadow-sm'
        : selected 
          ? 'bg-gradient-to-br from-crimson/20 to-crimson/10 border-2 border-gold shadow-lg shadow-gold/10' 
          : 'bg-navy-mid border border-gold/30 hover:border-gold/50'
    } ${className}`}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    {selected && (
      <div className="absolute top-2 right-2">
        <Check className={`w-5 h-5 ${light ? 'text-gold-dark' : 'text-gold'}`} />
      </div>
    )}
    {children}
  </motion.button>
);

// Step 1: Query & Alchemize - NOW WITH PROPER CONTRAST
const Step1 = ({ spellSpec, updateSpec }) => (
  <div className="space-y-6">
    {/* Guide selection removed - AI will auto-select based on alchemize_category */}
    
    <div>
      <h3 className="font-cinzel text-xl text-crimson mb-2 font-semibold">What do you need?</h3>
      <p className="font-montserrat text-sm text-navy-dark/80 mb-3">Tell me in your own words what you&apos;re facing or seeking.</p>
      <textarea
        value={spellSpec.user_query || ''}
        onChange={(e) => updateSpec({ user_query: e.target.value })}
        placeholder="I need courage to speak up at work... / I'm grieving and need comfort... / I want to protect my home... / I need clarity about a decision..."
        className="w-full h-28 bg-white border-2 border-navy-dark/20 focus:border-crimson focus:ring-2 focus:ring-crimson/20 rounded-sm px-4 py-3 text-navy-dark font-montserrat text-sm placeholder:text-navy-dark/50 resize-none"
      />
    </div>

    <div>
      <h3 className="font-cinzel text-xl text-crimson mb-3 font-semibold">Alchemize This Into...</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {ALCHEMIZE_OPTIONS.map((f) => {
          return (
            <OptionCard
              key={f.id}
              selected={spellSpec.alchemize_category === f.id}
              onClick={() => updateSpec({ alchemize_category: f.id, desired_feeling: f.id })}
              className="py-4"
              light={true}
            >
              <div className="flex flex-col items-center gap-2 text-center">
                <img src={f.iconSrc} alt={f.label} className="w-8 h-8" />
                <span className="font-montserrat text-sm text-navy-dark font-medium">{f.label}</span>
                <span className="font-crimson-text text-xs text-navy-dark/70">{f.description}</span>
              </div>
            </OptionCard>
          );
        })}
      </div>
    </div>
  </div>
);

// Step 2: Time, Tone, Belief - NOW WITH PROPER CONTRAST
const Step2 = ({ spellSpec, updateSpec }) => (
  <div className="space-y-6">
    <div>
      <h3 className="font-cinzel text-xl text-crimson mb-3 font-semibold">How much time do you have?</h3>
      <div className="grid grid-cols-3 gap-3">
        {TIMES.map((t) => (
          <OptionCard
            key={t.id}
            selected={spellSpec.time === t.id}
            onClick={() => updateSpec({ time: t.id })}
            light={true}
          >
            <div className="text-center">
              <BrandIcon name="halfmoon" size={24} className={`mx-auto mb-2 ${spellSpec.time === t.id ? '' : 'opacity-50'}`} />
              <p className="font-montserrat text-sm text-navy-dark font-bold">{t.label}</p>
              <p className="font-montserrat text-xs text-navy-dark/70 mt-1">{t.description}</p>
            </div>
          </OptionCard>
        ))}
      </div>
    </div>

    <div>
      <h3 className="font-cinzel text-xl text-crimson mb-3 font-semibold">What tone feels right?</h3>
      <div className="grid grid-cols-3 gap-3">
        {TONES.map((t) => (
          <OptionCard
            key={t.id}
            selected={spellSpec.tone === t.id}
            onClick={() => updateSpec({ tone: t.id })}
            light={true}
          >
            <div className="text-center">
              <p className="font-montserrat text-sm text-navy-dark font-bold mb-1">{t.label}</p>
              <p className="font-montserrat text-xs text-navy-dark/70">{t.description}</p>
            </div>
          </OptionCard>
        ))}
      </div>
    </div>

    <div>
      <h3 className="font-cinzel text-xl text-crimson mb-3 font-semibold">Your belief comfort zone</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {BELIEF_BOUNDARIES.map((b) => (
          <OptionCard
            key={b.id}
            selected={spellSpec.belief_boundary === b.id}
            onClick={() => updateSpec({ belief_boundary: b.id })}
            light={true}
          >
            <p className="font-montserrat text-sm text-navy-dark font-bold">{b.label}</p>
            <p className="font-montserrat text-xs text-navy-dark/70 mt-1">{b.description}</p>
          </OptionCard>
        ))}
      </div>
    </div>
  </div>
);

// Step 3: Anchor, Setting, Name, Avoid - NOW WITH PROPER CONTRAST
const Step3 = ({ spellSpec, updateSpec }) => {
  const relevantAnchors = ANCHORS.filter(a => 
    !a.forPersonas || 
    a.forPersonas.includes(spellSpec.persona_id) || 
    spellSpec.persona_id === 'choose_for_me'
  );

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-cinzel text-xl text-crimson mb-3 font-semibold">Choose an anchor object</h3>
        <p className="font-montserrat text-sm text-navy-dark/80 mb-3">This will be central to your ritual.</p>
        <div className="flex flex-wrap gap-2">
          {relevantAnchors.map((a) => (
            <OptionCard
              key={a.id}
              selected={spellSpec.anchor_object === a.id}
              onClick={() => updateSpec({ anchor_object: a.id })}
              className="px-4 py-2"
              light={true}
            >
              <div className="flex items-center gap-2">
                <img src={a.icon} alt={a.label} className="w-6 h-6 flex-shrink-0" />
                <span className="font-montserrat text-sm text-navy-dark font-medium">{a.label}</span>
              </div>
            </OptionCard>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-cinzel text-xl text-crimson mb-3 font-semibold">Where will you perform this?</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {SETTINGS.map((s) => {
            return (
              <OptionCard
                key={s.id}
                selected={spellSpec.setting === s.id}
                onClick={() => updateSpec({ setting: s.id })}
                className="py-3"
                light={true}
              >
                <div className="flex items-start gap-3">
                  <img src={s.icon} alt={s.label} className="w-8 h-8 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-montserrat text-sm text-navy-dark font-semibold leading-tight">{s.label}</p>
                    <p className="font-montserrat text-xs text-navy-dark/70 mt-1">{s.description}</p>
                  </div>
                </div>
              </OptionCard>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <h3 className="font-cinzel text-xl text-crimson mb-2 font-semibold">Your name (optional)</h3>
          <p className="font-montserrat text-sm text-navy-dark/80 mb-2">For a more personal spell.</p>
          <input
            type="text"
            value={spellSpec.user_name || ''}
            onChange={(e) => updateSpec({ user_name: e.target.value })}
            placeholder="Name or nickname..."
            className="w-full bg-white border-2 border-navy-dark/20 focus:border-crimson focus:ring-2 focus:ring-crimson/20 rounded-sm px-4 py-2 text-navy-dark font-montserrat text-sm placeholder:text-navy-dark/50"
          />
        </div>

        <div>
          <h3 className="font-cinzel text-xl text-crimson mb-2 font-semibold">Anything to avoid? (optional)</h3>
          <p className="font-montserrat text-sm text-navy-dark/80 mb-2">Topics or elements to exclude.</p>
          <input
            type="text"
            value={spellSpec.avoid || ''}
            onChange={(e) => updateSpec({ avoid: e.target.value })}
            placeholder="e.g., fire, spirit contact, blood..."
            className="w-full bg-white border-2 border-navy-dark/20 focus:border-crimson focus:ring-2 focus:ring-crimson/20 rounded-sm px-4 py-2 text-navy-dark font-montserrat text-sm placeholder:text-navy-dark/50"
          />
        </div>
      </div>
    </div>
  );
};

// ===== MAIN COMPONENT =====

export const SpellRequest = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [showHandcraftedModal, setShowHandcraftedModal] = useState(false);
  const [spellSpec, setSpellSpec] = useState({
    persona_id: getCurrentArchetype() || 'choose_for_me',
    user_query: '',
    desired_feeling: 'protection', // Keep field name for backend compat, but use alchemize values
    alchemize_category: 'protection', // New field
    time: '10_min',
    tone: 'practical',
    belief_boundary: 'spiritual_grounded',
    anchor_object: 'candle',
    setting: 'home_quiet',
    user_name: '',
    avoid: ''
  });
  const [loading, setLoading] = useState(false);
  const [loadingImages, setLoadingImages] = useState(false);
  const [spellResult, setSpellResult] = useState(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [selectedGuide, setSelectedGuide] = useState(null); // Guide selected during generation
  const [currentStage, setCurrentStage] = useState(null);
  const [stageMessage, setStageMessage] = useState('');
  
  // Track last selected persona for video fallback (for choose_for_me)
  const lastSelectedPersonaRef = useRef('shigg');

  useEffect(() => {
    // Normalize legacy archetype IDs
    const currentArchetype = getCurrentArchetype();
    const idMap = { 'shiggy': 'shigg', 'kathleen': 'cathleen' };
    const normalizedArchetype = idMap[currentArchetype] || currentArchetype || 'choose_for_me';
    
    // Track last selected persona
    if (normalizedArchetype && normalizedArchetype !== 'choose_for_me') {
      lastSelectedPersonaRef.current = normalizedArchetype;
    }
    
    setSpellSpec(prev => ({
      ...prev,
      persona_id: normalizedArchetype
    }));
    const loadSubscriptionStatus = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const status = await subscriptionAPI.getStatus();
          setSubscriptionStatus(status);
        } catch (error) {
          console.error('Failed to load subscription status:', error);
        }
      }
    };
    loadSubscriptionStatus();
  }, []);

  // Update lastSelectedPersonaRef when persona changes
  useEffect(() => {
    if (spellSpec.persona_id && spellSpec.persona_id !== 'choose_for_me') {
      lastSelectedPersonaRef.current = spellSpec.persona_id;
    }
  }, [spellSpec.persona_id]);

  // Default anchor per guide (first anchor listed for each)
  const DEFAULT_ANCHORS = {
    'shigg': 'tea', 'cathleen': 'song', 'katherine': 'thread',
    'theresa': 'notebook', 'brenda': 'letter', 'choose_for_me': 'candle'
  };

  const updateSpec = (updates) => {
    setSpellSpec(prev => {
      // When persona changes, reset anchor to that guide's default
      if (updates.persona_id && updates.persona_id !== prev.persona_id) {
        updates.anchor_object = DEFAULT_ANCHORS[updates.persona_id] || 'candle';
      }
      return { ...prev, ...updates };
    });
  };

  const canProceed = () => {
    if (step === 0) {
      return spellSpec.persona_id && spellSpec.user_query?.trim().length > 10 && spellSpec.alchemize_category;
    }
    if (step === 1) {
      return spellSpec.time && spellSpec.tone && spellSpec.belief_boundary;
    }
    if (step === 2) {
      return spellSpec.anchor_object && spellSpec.setting;
    }
    return true;
  };

  // Helper to get video URL for loading overlay (always returns a video)
  const getLoadingVideoUrl = () => {
    const personaId = spellSpec.persona_id;
    
    // If specific persona selected (NOT choose_for_me), use their video
    if (personaId && personaId !== 'choose_for_me') {
      const video = getArchetypeVideo(personaId);
      if (video) return video;
    }
    
    // For "choose_for_me" or no selection, ALWAYS use the generic spell video
    return GENERIC_SPELL_VIDEO;
  };

  // Lazy load images after spell text is displayed
  const lazyLoadImages = async (assetPlan, archetypeId) => {
    if (!assetPlan) return;
    
    setLoadingImages(true);
    const generatedAssets = {};
    
    try {
      // Generate only 1 divider (reused 3x in UI) + header + tarot + sigil = 4 images total
      const imagePrompts = [];
      
      // Header image
      if (assetPlan.header_image) {
        imagePrompts.push({
          key: 'header_image',
          prompt: `${assetPlan.header_image.scene_description || 'mystical ritual scene'}, ${assetPlan.header_image.mood || 'atmospheric'}, pen-and-ink illustration, NO text, NO letters`
        });
      }
      
      // Tarot card
      if (assetPlan.tarot_card_image) {
        imagePrompts.push({
          key: 'tarot_card_image',
          prompt: `symbolic emblem, ${assetPlan.tarot_card_image.must_include_focal || 'mystical symbol'}, ${assetPlan.tarot_card_image.must_use_framing || 'circular border'}, medallion style, NO text, NO letters`
        });
      }
      
      // Sigil
      if (assetPlan.sigil) {
        imagePrompts.push({
          key: 'sigil',
          prompt: `black and white sigil, ${assetPlan.sigil.design_concept || 'mystical protective symbol'}, high contrast, geometric, printable, NO text`
        });
      }
      
      // Single divider (will be reused)
      if (assetPlan.dividers && assetPlan.dividers.length > 0) {
        imagePrompts.push({
          key: 'divider',
          prompt: `horizontal decorative divider, ornamental border, ${assetPlan.dividers[0].motif || 'scrollwork'}, pen-and-ink, NO text`
        });
      }
      
      // Generate images in parallel
      const results = await Promise.allSettled(
        imagePrompts.map(async ({ key, prompt }) => {
          const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/ai/generate-image`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt, archetype: archetypeId })
          });
          if (response.ok) {
            const data = await response.json();
            return { key, image: data.image_base64 };
          }
          return null;
        })
      );
      
      // Collect successful results
      results.forEach(result => {
        if (result.status === 'fulfilled' && result.value) {
          generatedAssets[result.value.key] = result.value.image;
          // Reuse single divider for all 3 positions
          if (result.value.key === 'divider') {
            generatedAssets['divider_1'] = result.value.image;
            generatedAssets['divider_2'] = result.value.image;
            generatedAssets['divider_3'] = result.value.image;
          }
        }
      });
      
      // Update spell result with generated assets
      setSpellResult(prev => ({
        ...prev,
        asset_plan: {
          ...prev.asset_plan,
          generated_assets: generatedAssets
        },
        image_base64: generatedAssets.header_image || prev.image_base64
      }));
      
    } catch (error) {
      console.error('Error lazy loading images:', error);
    } finally {
      setLoadingImages(false);
    }
  };

  const handleGenerate = async () => {
    if (!canProceed()) {
      toast.error('Please complete all required fields');
      return;
    }

    setLoading(true);
    setSelectedGuide(null);
    setCurrentStage(null);
    setStageMessage('');
    
    try {
      // Map belief boundary to V3 belief mode
      const beliefModeMap = {
        'secular_reflective': 'SECULAR',
        'spiritual_grounded': 'SPIRITUAL',
        'practitioner': 'PRACTITIONER'
      };
      const beliefMode = beliefModeMap[spellSpec.belief_boundary] || 'SPIRITUAL';
      
      // Use async job pattern to avoid proxy timeouts (spell generation takes 2+ minutes)
      const createJobResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/ai/generate-spell-job`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(localStorage.getItem('token') ? { 'Authorization': `Bearer ${localStorage.getItem('token')}` } : {})
        },
        body: JSON.stringify({
          spell_spec: spellSpec,
          belief_mode: beliefMode,
          generate_images: false  // Text first for perceived speed
        })
      });
      
      if (!createJobResponse.ok) {
        const errorData = await createJobResponse.json().catch(() => ({}));
        if (createJobResponse.status === 403 && errorData.detail?.error === 'spell_limit_reached') {
          toast.error(
            <div className="flex flex-col gap-2">
              <span className="font-semibold">You&apos;ve used all your free workings!</span>
              <span className="text-sm">Upgrade to Pro for unlimited spell crafting.</span>
            </div>,
            {
              duration: 5000,
              action: {
                label: 'Upgrade Now',
                onClick: () => navigate('/upgrade')
              }
            }
          );
          setTimeout(() => navigate('/upgrade'), 2000);
          setLoading(false);
          return;
        }
        throw new Error('Failed to start spell crafting');
      }
      
      const jobData = await createJobResponse.json();
      const jobId = jobData.job_id;
      
      // Poll for job completion
      let attempts = 0;
      const maxAttempts = 60; // 5 minutes max (5s * 60)
      let pollDelay = 5000; // Start with 5 seconds
      
      const pollJob = async () => {
        while (attempts < maxAttempts) {
          attempts++;
          
          try {
            const statusResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/ai/spell-job/${jobId}`);
            const statusData = await statusResponse.json();
            
            // Extract selected guide from processing status or completed result
            if (!selectedGuide) {
              // During processing, persona_id comes at top level
              const guideId = statusData.persona_id || statusData.result?.persona_lock?.id || statusData.result?.persona_id || statusData.result?.spell?.persona_id;
              if (guideId) {
                const guide = PERSONAS.find(p => p.id === guideId);
                if (guide) {
                  setSelectedGuide(guide);
                }
              }
            }
            
            if (statusData.status === 'complete') {
              // Success! Return the result
              return statusData.result;
            } else if (statusData.status === 'failed') {
              throw new Error(statusData.error || 'Spell generation failed');
            }
            
            // Update stage progress for loading indicator
            if (statusData.current_stage) {
              setCurrentStage(statusData.current_stage);
              setStageMessage(statusData.stage_message || 'Working...');
            }
            
          } catch (pollError) {
            console.error('Poll error:', pollError);
            // Continue polling on transient errors
          }
          
          // Wait before next poll
          await new Promise(resolve => setTimeout(resolve, pollDelay));
        }
        
        throw new Error('Spell generation timed out. Please try again.');
      };
      
      const data = await pollJob();
      
      // Extract final selected guide if not already set
      if (!selectedGuide && data) {
        const guideId = data.persona_lock?.id || data.persona_id || data.spell?.persona_id;
        if (guideId) {
          const guide = PERSONAS.find(p => p.id === guideId);
          if (guide) {
            setSelectedGuide(guide);
          }
        }
      }
      
      setSpellResult(data);
      setLoading(false);
      
      // Update guide if it was chosen for them
      if (spellSpec.persona_id === 'choose_for_me' && data.archetype?.id) {
        setCurrentArchetype(data.archetype.id);
      }
      
      toast.success('Your working has been crafted!');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // PHASE 2: Use server-generated images or lazy load as fallback
      const serverImages = data.generated_images || data.spell?.generated_images;
      if (serverImages && Object.keys(serverImages).length > 0) {
        // V3 returned images directly — use them, no extra API calls
        setSpellResult(prev => ({
          ...prev,
          image_base64: serverImages.header_image || prev.image_base64,
          asset_plan: {
            ...prev.asset_plan,
            generated_assets: {
              header_image: serverImages.header_image,
              tarot_card_image: serverImages.tarot_card_image,
              sigil: serverImages.sigil,
              ...prev.asset_plan?.generated_assets,
            }
          }
        }));
      } else if (data.spell?.image_prompt) {
        // Fallback: lazy load images via separate API calls
        const assetPlan = {
          header_image: data.spell.image_prompt.header,
          tarot_card_image: data.spell.image_prompt.tarot,
          sigil: data.spell.image_prompt.sigil,
        };
        lazyLoadImages(assetPlan, data.archetype?.id || spellSpec.persona_id);
      }
      
      // Update subscription status if limits changed
      if (data.limit_info) {
        const token = localStorage.getItem('token');
        if (token) {
          const status = await subscriptionAPI.getStatus();
          setSubscriptionStatus(status);
        }
      }
    } catch (error) {
      console.error('Spell generation error:', error);
      toast.error('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  const handleNewSpell = () => {
    setSpellResult(null);
    setLoadingImages(false);
    setSelectedGuide(null); // Reset selected guide for new spell
    setStep(0);
    setSpellSpec(prev => ({
      ...prev,
      user_query: '',
      user_name: '',
      avoid: ''
    }));
  };

  // If spell result exists, show the result page
  if (spellResult) {
    return (
      <div className="min-h-screen">
        <DarkSection className="py-8 px-4" variant="warm">
          <div className="max-w-4xl mx-auto">
            <button
              onClick={handleNewSpell}
              className="btn-ritual-ghost mb-6 px-5 py-2.5 rounded-sm flex items-center gap-2"
            >
              ← Begin Another Working
            </button>
            
            {/* Images loading indicator */}
            {loadingImages && (
              <div className="mb-4 p-4 bg-gold/10 border border-gold/30 rounded-sm">
                <div className="flex items-center gap-3 mb-2">
                  <Loader2 className="w-5 h-5 text-gold animate-spin" />
                  <span className="font-cinzel text-base text-gold">Crafting Your Imagery</span>
                </div>
                <p className="font-montserrat text-xs text-muted-brass/80 ml-8">
                  Generating tarot card, sigil, and decorative elements... Your working is ready to explore while we paint the details.
                </p>
              </div>
            )}
            
            <GrimoirePage 
              spell={spellResult.spell}
              archetype={spellResult.archetype}
              imageBase64={spellResult.image_base64}
              assetPlan={spellResult.asset_plan}
              inspirations={spellResult.spell?.inspired_by}
              onNewSpell={handleNewSpell}
              isLoadingImages={loadingImages}
            />
          </div>
        </DarkSection>
      </div>
    );
  }

  const STEPS = [
    { title: 'Your Intention', component: Step1 },
    { title: 'Style & Approach', component: Step2 },
    { title: 'Details & Personalization', component: Step3 }
  ];

  const CurrentStepComponent = STEPS[step].component;

  return (
    <div className="min-h-screen">
      {/* Dark Hero Section */}
      <DarkSection className="py-10 sm:py-14 px-4 sm:px-6" variant="warm">
        <ElaborateCorner className="absolute top-3 left-3 w-16 h-16 sm:w-20 sm:h-20" variant="gold" />
        <ElaborateCorner className="absolute top-3 right-3 w-16 h-16 sm:w-20 sm:h-20 rotate-90" variant="gold" />
        
        <div className="max-w-3xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <PageHeader 
              iconSrc="/icons/ui/gold/icon-sparkles.png"
              title="Craft Your Working"
              subtitle="Answer a few questions and receive a personalized ritual crafted just for you"
            />
          </motion.div>
          
          {/* Subscription Banner */}
          {subscriptionStatus && subscriptionStatus.subscription_tier === 'free' && (
            <SpellLimitBanner 
              remaining={subscriptionStatus.spells_remaining} 
              total={subscriptionStatus.spell_limit}
            />
          )}
          
          <GrandDivider variant="sparkle" />
        </div>
      </DarkSection>

      {/* Wizard Section */}
      <LightSection 
        className="py-10 sm:py-14 px-4 sm:px-6"
        atmosphericImage={ATMOSPHERIC_IMAGES.florals}
        atmosphericOpacity={0.10}
        atmosphericPosition="left bottom"
        atmosphericTint="sepia"
      >
        <div className="max-w-2xl mx-auto">
          <StepIndicator currentStep={step} totalSteps={STEPS.length} />
          
          {/* Handcrafted Magic Banner */}
          {step === 0 && (
            <HandcraftedBanner onClick={() => setShowHandcraftedModal(true)} />
          )}
          
          <LightOrnateCard hover={false}>
            <div className="mb-4">
              <h2 className="font-cinzel text-xl text-crimson">
                Step {step + 1}: {STEPS[step].title}
              </h2>
            </div>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <CurrentStepComponent spellSpec={spellSpec} updateSpec={updateSpec} />
              </motion.div>
            </AnimatePresence>
            
            {/* Navigation */}
            <div className="flex justify-between mt-8 pt-6 border-t border-crimson/20">
              <button
                onClick={() => setStep(s => s - 1)}
                disabled={step === 0}
                className="font-cinzel font-normal tracking-widest uppercase px-4 py-2 rounded-sm disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2 transition-colors duration-300"
                style={{ 
                  color: '#8B2232', 
                  border: '1px solid #8B223240',
                  background: 'transparent',
                }}
                data-testid="spell-back-btn"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
              
              {step < STEPS.length - 1 ? (
                <button
                  onClick={() => setStep(s => s + 1)}
                  disabled={!canProceed()}
                  className="btn-ritual px-6 py-3 rounded-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  data-testid="spell-continue-btn"
                >
                  Continue
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleGenerate}
                  disabled={loading || !canProceed()}
                  className="btn-ritual px-8 py-4 rounded-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Crafting...</span>
                    </>
                  ) : (
                    <>
                      <BrandIcon name="sparkles" size={20} />
                      <span>So Mote It Be</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </LightOrnateCard>
          
          <MysticalDivider light />
        </div>
      </LightSection>

      {/* Loading Overlay with Archetype Video */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-navy-dark z-50 flex items-center justify-center overflow-hidden"
          >
            {/* Background video - ALWAYS shows (uses fallback for choose_for_me) */}
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover opacity-40"
              style={{ filter: 'saturate(0.8) contrast(1.1)' }}
            >
              <source src={getLoadingVideoUrl()} type="video/mp4" />
            </video>
            
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-navy-dark via-navy-dark/70 to-navy-dark/50" />
            <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-navy-dark" />
            
            {/* Corner ornaments */}
            <ElaborateCorner className="absolute top-4 left-4 w-16 h-16 sm:w-24 sm:h-24" variant="gold" />
            <ElaborateCorner className="absolute top-4 right-4 w-16 h-16 sm:w-24 sm:h-24 rotate-90" variant="gold" />
            <ElaborateCorner className="absolute bottom-4 left-4 w-16 h-16 sm:w-24 sm:h-24 -rotate-90" variant="gold" />
            <ElaborateCorner className="absolute bottom-4 right-4 w-16 h-16 sm:w-24 sm:h-24 rotate-180" variant="gold" />
            
            {/* Content */}
            <div className="relative z-10 text-center px-6 max-w-lg">
              {selectedGuide ? (
                /* Guide has been selected - show their info */
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  {/* Guide avatar */}
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full overflow-hidden border-2 border-gold/50 flex items-center justify-center bg-navy-dark">
                    {selectedGuide.icon ? (
                      <img src={selectedGuide.icon} alt={selectedGuide.name} className="w-14 h-14" />
                    ) : (
                      <BrandIcon name="sparkles" size={40} />
                    )}
                  </div>
                  
                  <h2 className="font-cinzel text-2xl sm:text-3xl text-gold mb-2">
                    {selectedGuide.name}
                  </h2>
                  <p className="font-italiana text-lg text-cream/80 mb-6">
                    {selectedGuide.title}
                  </p>
                  
                  {/* Why this guide */}
                  <div className="bg-black/30 backdrop-blur-sm rounded-lg p-5 mb-6 border border-gold/20">
                    <p className="font-crimson-text text-cream/80 text-base italic leading-relaxed">
                      {selectedGuide.name === 'Shigg' && "Shigg was chosen because your intention speaks to the quiet magic of everyday moments. She knows the kitchen-table wisdom that mends what words cannot."}
                      {selectedGuide.name === 'Cathleen' && "Cathleen steps forward because your need calls for fierce protection. She carries the old songs that build walls nothing unwanted can cross."}
                      {selectedGuide.name === 'Katherine' && "Katherine has taken your case. Your intention requires precision and the willingness to look at what others avoid."}
                      {selectedGuide.name === 'Theresa' && "Theresa recognizes the patterns in your intention. She's already pulling the files, connecting the evidence."}
                      {selectedGuide.name === 'Brenda' && "Brenda has received your letter. Your intention carries the weight of family and memory. She's composing her reply with care."}
                    </p>
                  </div>
                </motion.div>
              ) : (
                /* Guide not yet selected - show finding guide state */
                <>
                  <motion.div
                    animate={{ 
                      scale: [1, 1.05, 1],
                      opacity: [0.8, 1, 0.8]
                    }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 2, 
                      ease: 'easeInOut' 
                    }}
                    className="w-24 h-24 mx-auto mb-8 relative"
                  >
                    <div className="absolute inset-0 rounded-full border-2 border-gold/40 animate-pulse" />
                    <div className="absolute inset-2 rounded-full border border-crimson/30" />
                    <BrandIcon name="sparkles" size={64} className="mx-auto" style={{ filter: 'drop-shadow(0 0 20px rgba(200, 164, 77, 0.5))' }} />
                  </motion.div>
                  
                  <h2 className="font-cinzel text-2xl sm:text-3xl text-gold mb-3" style={{ textShadow: '0 0 30px rgba(185, 78, 106, 0.5), 0 0 60px rgba(185, 78, 106, 0.3)' }}>
                    Finding Your Guide
                  </h2>
                  
                  <p className="font-crimson text-lg text-cream/80 mb-2">
                    The right guide is emerging for your intention...
                  </p>
                </>
              )}
              
              {/* Stage progress indicator */}
              {currentStage ? (
                <div className="mt-6">
                  <p className="font-crimson-text text-base text-cream/90 mb-3">
                    {stageMessage}
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    {['archivist', 'planner', 'writer', 'qa'].map((stage, idx) => {
                      const stages = ['archivist', 'planner', 'writer', 'qa'];
                      const currentIdx = stages.indexOf(currentStage);
                      const isComplete = idx < currentIdx;
                      const isActive = idx === currentIdx;
                      return (
                        <div key={stage} className="flex items-center gap-2">
                          <div className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${
                            isComplete ? 'bg-gold' :
                            isActive ? 'bg-gold animate-pulse shadow-[0_0_8px_rgba(200,164,77,0.6)]' :
                            'bg-cream/20'
                          }`} />
                          {idx < 3 && (
                            <div className={`w-6 h-px transition-all duration-500 ${
                              isComplete ? 'bg-gold/60' : 'bg-cream/10'
                            }`} />
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex justify-between text-[10px] text-cream/50 font-montserrat uppercase tracking-wider mt-1.5 max-w-[220px] mx-auto">
                    <span>Research</span>
                    <span>Plan</span>
                    <span>Write</span>
                    <span>Polish</span>
                  </div>
                </div>
              ) : (
                <p className="font-montserrat text-xs text-gold/50 tracking-widest uppercase mt-6">
                  This may take a moment...
                </p>
              )}
              
              {/* Animated loading dots */}
              <div className="flex items-center justify-center gap-2 mt-4">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                    transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2 }}
                    className="w-2 h-2 rounded-full bg-gold"
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <DarkSection className="py-8 px-4" variant="warm">
        <ElaborateCorner className="absolute bottom-3 left-3 w-16 h-16 -rotate-90" variant="gold" />
        <ElaborateCorner className="absolute bottom-3 right-3 w-16 h-16 rotate-180" variant="gold" />
        
        <div className="max-w-2xl mx-auto text-center relative z-10">
          <p className="font-crimson text-sm text-cream/80 italic">
            Each spell is unique, crafted for this moment, for you.
          </p>
          <div className="flex items-center justify-center gap-4 text-gold/50 mt-3">
            <span>☽</span>
            <span className="text-crimson/60">❦</span>
            <img src="/icons/ui/gold/icon-sparkles.png" alt="" className="w-4 h-4" />
            <span className="text-crimson/60">❦</span>
            <span>☾</span>
          </div>
        </div>
      </DarkSection>

      {/* Meet Your Guides Section - Bottom of Page */}
      <DarkSection className="py-12 px-4 sm:px-6" variant="warm">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-cinzel text-2xl text-center mb-2" style={{ color: '#C8A44D' }}>
            Meet Your Guides
          </h2>
          <p className="text-center text-cream/75 font-crimson-text mb-10">
            Each guide brings unique wisdom. Click to learn more or work with them directly.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {PERSONAS.filter(p => p.id !== 'choose_for_me').map(persona => (
              <Link
                key={persona.id}
                to={`/guides/${persona.id}`}
                className="group text-center p-4 rounded-lg border border-gold/20 hover:border-gold/50 transition-all bg-navy-mid hover:bg-navy-mid"
              >
                {/* Guide avatar */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 rounded-full overflow-hidden border-2 border-gold/30 group-hover:border-gold transition-colors flex items-center justify-center bg-navy-dark">
                  {persona.icon ? (
                    <img src={persona.icon} alt={persona.name} className="w-10 h-10 sm:w-12 sm:h-12" />
                  ) : (
                    <BrandIcon name="sparkles" size={32} />
                  )}
                </div>
                <h3 className="font-cinzel text-sm text-cream group-hover:text-gold transition-colors">
                  {persona.name}
                </h3>
                <p className="text-xs text-muted-brass font-crimson-text mt-1">
                  {persona.title}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </DarkSection>

      {/* Handcrafted Magic Modal */}
      <HandcraftedMagicModal 
        isOpen={showHandcraftedModal} 
        onClose={() => setShowHandcraftedModal(false)} 
      />
    </div>
  );
};
