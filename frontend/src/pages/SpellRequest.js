import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { GrimoirePage } from '../components/GrimoirePage';
import { aiAPI, subscriptionAPI } from '../utils/api';
import { ARCHETYPES, getArchetypeById } from '../data/archetypes';
import { getCurrentArchetype, setCurrentArchetype } from '../components/OnboardingModal';
import { SpellLimitBanner } from '../components/UpgradePrompt';
import { DarkSection, LightSection, GrandDivider, MysticalDivider, ElaborateCorner, PageHeader, OrnateCard, LightOrnateCard, StepperOrnament, BestiaryGlyph, ATMOSPHERIC_IMAGES } from '../components/OrnateElements';
import { 
  Sparkles, ChevronRight, ChevronLeft, Check, Loader2, 
  User, Clock, Heart, Flame, Shield, Eye, Zap, Cloud,
  Coffee, Scissors, Sun, Moon, Bird, Home, Bath, Briefcase, TreeDeciduous
} from 'lucide-react';
import { toast } from 'sonner';

// ===== DERIVE VIDEOS FROM ARCHETYPES.JS (single source of truth) =====
const getArchetypeVideo = (personaId) => {
  // Map persona IDs (from PERSONAS) to archetype IDs (from ARCHETYPES)
  const idMap = { 
    'shigg': 'shiggy', 
    'cathleen': 'kathleen', 
    'katherine': 'catherine',
    'theresa': 'theresa'
  };
  const archetypeId = idMap[personaId] || personaId;
  const archetype = ARCHETYPES.find(a => a.id === archetypeId);
  return archetype?.video || null;
};

// Generic fallback video for non-persona spells
const GENERIC_SPELL_VIDEO = 'https://customer-assets.emergentagent.com/job_mystic-grimoire-1/artifacts/sl3euh2k_GenericSpellWaitingVid.MOV';

// Get all available videos for random selection (for choose_for_me fallback)
const ALL_ARCHETYPE_VIDEOS = ARCHETYPES.filter(a => a.video).map(a => a.video);

// ===== WIZARD CONFIGURATION =====

const PERSONAS = [
  { id: 'shigg', name: 'Shigg', emoji: '🐦', title: 'Birds of Parliament', description: 'Gentle domestic magic, bird omens, tea rituals, poetry' },
  { id: 'cathleen', name: 'Cathleen', emoji: '🪶', title: 'Singer of Strength', description: 'Voice magic, protection, Celtic mysticism, the Morrigan' },
  { id: 'katherine', name: 'Katherine', emoji: '🪡', title: 'Weaver of Hidden Knowledge', description: 'Shadow work, mirrors, Victorian spiritualism, protocols' },
  { id: 'theresa', name: 'Theresa', emoji: '🔮', title: 'Seer & Storyteller', description: 'Truth-seeking, ancestral wisdom, genealogy, family secrets' },
  { id: 'choose_for_me', name: 'Choose for me', emoji: '✨', title: 'Let the guides decide', description: 'Based on your needs, the right guide will emerge' }
];

const FEELINGS = [
  { id: 'calm', label: 'Calm', icon: Cloud, color: 'text-blue-400' },
  { id: 'brave', label: 'Brave', icon: Shield, color: 'text-amber-400' },
  { id: 'clear', label: 'Clear', icon: Eye, color: 'text-purple-400' },
  { id: 'protected', label: 'Protected', icon: Shield, color: 'text-green-400' },
  { id: 'softened', label: 'Softened', icon: Heart, color: 'text-pink-400' },
  { id: 'energized', label: 'Energized', icon: Zap, color: 'text-yellow-400' }
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
  { id: 'tea', label: 'Tea', emoji: '☕', forPersonas: ['shigg'] },
  { id: 'thread', label: 'Thread', emoji: '🧵', forPersonas: ['katherine', 'cathleen'] },
  { id: 'candle', label: 'Candle', emoji: '🕯️', forPersonas: ['shigg', 'cathleen', 'katherine'] },
  { id: 'salt', label: 'Salt', emoji: '🧂', forPersonas: ['shigg', 'cathleen', 'katherine'] },
  { id: 'bird', label: 'Bird', emoji: '🐦', forPersonas: ['shigg'] },
  { id: 'mirror', label: 'Mirror', emoji: '🪞', forPersonas: ['katherine', 'cathleen'] },
  { id: 'song', label: 'Song/Voice', emoji: '🎵', forPersonas: ['cathleen'] }
];

const SETTINGS = [
  { id: 'home_quiet', label: 'In the quiet of my home', icon: Home, description: 'Private space, uninterrupted' },
  { id: 'nature', label: 'Outside in nature', icon: TreeDeciduous, description: 'Garden, park, woods, water' },
  { id: 'work_daily', label: 'During my daily routine', icon: Coffee, description: 'Work, errands, regular tasks' },
  { id: 'transit', label: 'On the move', icon: Briefcase, description: 'Commute, travel, waiting' },
  { id: 'public', label: 'In public or semi-public', icon: Sun, description: 'Café, library, shared space' }
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
          ? 'bg-crimson/15 border-2 border-crimson shadow-md' 
          : 'bg-white border-2 border-navy-dark/20 hover:border-crimson/40 hover:shadow-sm'
        : selected 
          ? 'bg-gradient-to-br from-crimson/20 to-crimson/10 border-2 border-crimson shadow-lg' 
          : 'bg-navy-mid/30 border border-gold/20 hover:border-gold/40'
    } ${className}`}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    {selected && (
      <div className="absolute top-2 right-2">
        <Check className={`w-5 h-5 ${light ? 'text-crimson' : 'text-crimson'}`} />
      </div>
    )}
    {children}
  </motion.button>
);

// Step 1: Persona & Query - NOW WITH PROPER CONTRAST
const Step1 = ({ spellSpec, updateSpec }) => (
  <div className="space-y-6">
    <div>
      <h3 className="font-cinzel text-xl text-crimson mb-4 font-semibold">Who will guide your working?</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {PERSONAS.map((p) => (
          <OptionCard
            key={p.id}
            selected={spellSpec.persona_id === p.id}
            onClick={() => updateSpec({ persona_id: p.id })}
            light={true}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{p.emoji}</span>
              <div>
                <p className="font-cinzel text-navy-dark font-bold">{p.name}</p>
                <p className="font-montserrat text-xs text-crimson font-medium">{p.title}</p>
              </div>
            </div>
            <p className="font-montserrat text-sm text-navy-dark/80 mt-2">{p.description}</p>
          </OptionCard>
        ))}
      </div>
    </div>

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
      <h3 className="font-cinzel text-xl text-crimson mb-3 font-semibold">How do you want to feel after?</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {FEELINGS.map((f) => {
          const Icon = f.icon;
          return (
            <OptionCard
              key={f.id}
              selected={spellSpec.desired_feeling === f.id}
              onClick={() => updateSpec({ desired_feeling: f.id })}
              className="py-3"
              light={true}
            >
              <div className="flex items-center justify-center gap-2">
                <Icon className={`w-5 h-5 ${spellSpec.desired_feeling === f.id ? 'text-crimson' : 'text-navy-dark'}`} />
                <span className="font-montserrat text-sm text-navy-dark font-medium">{f.label}</span>
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
              <Clock className={`w-6 h-6 mx-auto mb-2 ${spellSpec.time === t.id ? 'text-crimson' : 'text-navy-dark'}`} />
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
                <span className="text-xl">{a.emoji}</span>
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
            const Icon = s.icon;
            return (
              <OptionCard
                key={s.id}
                selected={spellSpec.setting === s.id}
                onClick={() => updateSpec({ setting: s.id })}
                className="py-3"
                light={true}
              >
                <div className="flex items-start gap-3">
                  <Icon className={`w-6 h-6 flex-shrink-0 mt-0.5 ${spellSpec.setting === s.id ? 'text-crimson' : 'text-navy-dark'}`} />
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
  const [spellSpec, setSpellSpec] = useState({
    persona_id: getCurrentArchetype() || 'choose_for_me',
    user_query: '',
    desired_feeling: 'calm',
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
  
  // Track last selected persona for video fallback (for choose_for_me)
  const lastSelectedPersonaRef = useRef('shigg');

  useEffect(() => {
    // Normalize legacy archetype IDs
    const currentArchetype = getCurrentArchetype();
    const idMap = { 'shiggy': 'shigg', 'kathleen': 'cathleen', 'catherine': 'katherine' };
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

  const updateSpec = (updates) => {
    setSpellSpec(prev => ({ ...prev, ...updates }));
  };

  const canProceed = () => {
    if (step === 0) {
      return spellSpec.persona_id && spellSpec.user_query?.trim().length > 10 && spellSpec.desired_feeling;
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
    
    try {
      // Map belief boundary to V3 belief mode
      const beliefModeMap = {
        'secular_reflective': 'SECULAR',
        'spiritual_grounded': 'SPIRITUAL',
        'practitioner': 'PRACTITIONER'
      };
      const beliefMode = beliefModeMap[spellSpec.belief_boundary] || 'SPIRITUAL';
      
      // Use V3 Blocks API for richer spell experience
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/ai/generate-spell-v3`, {
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
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 403 && errorData.detail?.error === 'spell_limit_reached') {
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
        throw new Error('Failed to craft your working');
      }
      
      const data = await response.json();
      setSpellResult(data);
      setLoading(false);
      
      // Update guide if it was chosen for them
      if (spellSpec.persona_id === 'choose_for_me' && data.archetype?.id) {
        setCurrentArchetype(data.archetype.id);
      }
      
      toast.success('Your working has been crafted!');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // PHASE 2: Lazy load images in background
      if (data.spell?.image_prompt) {
        const assetPlan = {
          header: data.spell.image_prompt.header,
          tarot: data.spell.image_prompt.tarot,
          sigil: data.spell.image_prompt.sigil
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
                <p className="font-montserrat text-xs text-silver-mist/80 ml-8">
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
              icon={Sparkles}
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
                className="btn-ritual-ghost px-4 py-2 rounded-sm disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
              
              {step < STEPS.length - 1 ? (
                <button
                  onClick={() => setStep(s => s + 1)}
                  disabled={!canProceed()}
                  className="btn-ritual-secondary px-6 py-3 rounded-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
                      <Sparkles className="w-5 h-5" />
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
              <source src={getLoadingVideoUrl()} type="video/quicktime" />
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
                <Sparkles className="w-full h-full text-gold p-4" style={{ filter: 'drop-shadow(0 0 20px rgba(212, 168, 75, 0.5))' }} />
              </motion.div>
              
              <h2 className="font-cinzel text-2xl sm:text-3xl text-gold mb-3" style={{ textShadow: '0 2px 20px rgba(212, 168, 75, 0.4)' }}>
                Weaving Your Spell
              </h2>
              
              <p className="font-crimson text-lg text-cream/80 mb-2">
                {spellSpec.persona_id !== 'choose_for_me' 
                  ? `${PERSONAS.find(p => p.id === spellSpec.persona_id)?.name} is crafting something special for you`
                  : 'Finding the perfect guide for your intention'
                }
              </p>
              
              <p className="font-montserrat text-xs text-gold/50 tracking-widest uppercase mt-6">
                This may take a moment...
              </p>
              
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
          <p className="font-crimson text-sm text-cream/60 italic">
            Each spell is unique, crafted for this moment, for you.
          </p>
          <div className="flex items-center justify-center gap-4 text-gold/50 mt-3">
            <span>☽</span>
            <span className="text-crimson/60">❦</span>
            <span>✨</span>
            <span className="text-crimson/60">❦</span>
            <span>☾</span>
          </div>
        </div>
      </DarkSection>
    </div>
  );
};
