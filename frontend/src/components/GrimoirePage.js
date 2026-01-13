import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, ChevronUp, Clock, Moon, Sun, Calendar, 
  BookOpen, Feather, Copy, Download, CheckCircle2, Circle,
  Flame, Droplets, Wind, Sparkles, Star, Eye, Heart,
  AlertTriangle, Quote, History, Users, Save, Lock, Key,
  ExternalLink, ArrowRight, Search, Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { grimoireAPI, subscriptionAPI, researchAPI } from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { SpellBorderFrame, SectionBorderFrame, TarotCardFrame, PERSONA_BORDER_URLS } from './OrnateElements';
import { SpellBlockRenderer } from './SpellBlockRenderer';

// Ornate seal logo for spell pages
const SEAL_LOGO_URL = "https://customer-assets.emergentagent.com/job_870e50df-769b-4f54-87c7-dc69482a19cb/artifacts/jdsp7esr_WhereTheCrowLandsLogo.png";

// Icon mapping for materials
const MATERIAL_ICONS = {
  candle: Flame,
  herb: Feather,
  crystal: Star,
  feather: Feather,
  water: Droplets,
  fire: Flame,
  moon: Moon,
  sun: Sun,
  book: BookOpen,
  pen: Feather,
  mirror: Eye,
  salt: Sparkles,
  oil: Droplets,
  incense: Wind,
  bell: Sparkles,
  cord: Heart,
  photo: Eye,
  bowl: Circle,
};

// Archetype-specific styling (supporting both legacy and new IDs)
const ARCHETYPE_STYLES = {
  // New standardized IDs
  shigg: {
    borderColor: 'border-primary',
    accentColor: 'text-primary',
    bgAccent: 'bg-primary/5',
    headerGradient: 'from-primary/20 to-transparent',
    cardGradient: 'from-amber-900/90 via-amber-800/80 to-amber-900/90',
  },
  cathleen: {
    borderColor: 'border-secondary',
    accentColor: 'text-secondary',
    bgAccent: 'bg-secondary/5',
    headerGradient: 'from-secondary/20 to-transparent',
    cardGradient: 'from-slate-800/90 via-slate-700/80 to-slate-800/90',
  },
  katherine: {
    borderColor: 'border-accent',
    accentColor: 'text-accent',
    bgAccent: 'bg-accent/5',
    headerGradient: 'from-accent/20 to-transparent',
    cardGradient: 'from-stone-800/90 via-stone-700/80 to-stone-800/90',
  },
  // Legacy IDs (for backwards compatibility)
  shiggy: {
    borderColor: 'border-primary',
    accentColor: 'text-primary',
    bgAccent: 'bg-primary/5',
    headerGradient: 'from-primary/20 to-transparent',
    cardGradient: 'from-amber-900/90 via-amber-800/80 to-amber-900/90',
  },
  kathleen: {
    borderColor: 'border-secondary',
    accentColor: 'text-secondary',
    bgAccent: 'bg-secondary/5',
    headerGradient: 'from-secondary/20 to-transparent',
    cardGradient: 'from-slate-800/90 via-slate-700/80 to-slate-800/90',
  },
  catherine: {
    borderColor: 'border-accent',
    accentColor: 'text-accent',
    bgAccent: 'bg-accent/5',
    headerGradient: 'from-accent/20 to-transparent',
    cardGradient: 'from-stone-800/90 via-stone-700/80 to-stone-800/90',
  },
  theresa: {
    borderColor: 'border-primary',
    accentColor: 'text-primary',
    bgAccent: 'bg-primary/5',
    headerGradient: 'from-primary/10 via-secondary/10 to-transparent',
    cardGradient: 'from-violet-900/90 via-violet-800/80 to-violet-900/90',
  },
  neutral: {
    borderColor: 'border-border',
    accentColor: 'text-primary',
    bgAccent: 'bg-muted/30',
    headerGradient: 'from-muted/30 to-transparent',
    cardGradient: 'from-zinc-800/90 via-zinc-700/80 to-zinc-800/90',
  },
};

// Generated Divider Component - displays STATIC URL or base64 divider images
const GeneratedDivider = ({ imageBase64, isLoading = false, className = '' }) => {
  // Show skeleton while loading
  if (isLoading && !imageBase64) {
    return (
      <div className={`w-full my-6 ${className}`}>
        <div className="w-full h-12 bg-amber-800/10 rounded animate-pulse flex items-center justify-center">
          <span className="text-amber-800/30 text-xs font-montserrat">Loading ornament...</span>
        </div>
      </div>
    );
  }
  
  if (!imageBase64) return null;
  
  // Handle static URL dividers (prefixed with "STATIC:")
  const isStaticUrl = imageBase64.startsWith('STATIC:');
  const imageSrc = isStaticUrl 
    ? imageBase64.replace('STATIC:', '')
    : `data:image/png;base64,${imageBase64}`;
  
  return (
    <div className={`w-full my-6 ${className}`}>
      <img 
        src={imageSrc}
        alt="Section divider"
        className="w-full h-auto max-h-16 object-contain opacity-70"
        style={isStaticUrl ? { filter: 'sepia(0.3) saturate(0.8)' } : {}}
      />
    </div>
  );
};

// Printables Block - Shows tarot card (front & back) and sigil for printing
const PrintablesBlock = ({ tarotImageBase64, sigilImageBase64, spellTitle, tarotCard, isLoading = false }) => {
  // Show loading state if images are being generated
  if (isLoading && !tarotImageBase64 && !sigilImageBase64) {
    return (
      <section className="my-8 p-6 bg-amber-900/10 border-2 border-dashed border-amber-800/40 rounded-sm">
        <h3 className="font-cinzel text-lg text-amber-900 mb-4 text-center flex items-center justify-center gap-2">
          <Download className="w-5 h-5" />
          Printable Elements
        </h3>
        <p className="font-montserrat text-xs text-stone-600 text-center mb-4">
          Generating your personalized tarot card and sigil...
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="font-montserrat text-xs text-stone-600 mb-2 uppercase tracking-wider">Tarot Card</p>
            <div className="w-full max-w-[180px] mx-auto aspect-[2/3] bg-amber-800/10 rounded-sm animate-pulse" />
          </div>
          <div className="text-center">
            <p className="font-montserrat text-xs text-stone-600 mb-2 uppercase tracking-wider">Card Back</p>
            <div className="w-full max-w-[180px] mx-auto aspect-[2/3] bg-amber-800/10 rounded-sm animate-pulse" />
          </div>
          <div className="text-center">
            <p className="font-montserrat text-xs text-stone-600 mb-2 uppercase tracking-wider">Sigil</p>
            <div className="w-full max-w-[150px] mx-auto aspect-square bg-amber-800/10 rounded-sm animate-pulse" />
          </div>
        </div>
      </section>
    );
  }
  
  if (!tarotImageBase64 && !sigilImageBase64) return null;
  
  return (
    <section className="my-8 p-6 bg-amber-900/10 border-2 border-dashed border-amber-800/40 rounded-sm">
      <h3 className="font-cinzel text-lg text-amber-900 mb-4 text-center flex items-center justify-center gap-2">
        <Download className="w-5 h-5" />
        Printable Elements
      </h3>
      <p className="font-montserrat text-xs text-stone-700 text-center mb-4">
        Right-click to save these images for your physical grimoire
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Tarot Card - Front */}
        {tarotImageBase64 && (
          <div className="text-center">
            <p className="font-montserrat text-xs text-stone-600 mb-2 uppercase tracking-wider">
              Tarot Card (Front)
            </p>
            <img 
              src={`data:image/png;base64,${tarotImageBase64}`}
              alt={`${spellTitle} - Tarot Card Front`}
              className="w-full max-w-[180px] mx-auto rounded-sm border border-amber-800/30 shadow-md"
            />
          </div>
        )}
        
        {/* Tarot Card - Back (Text version with essence) */}
        {tarotCard && (
          <div className="text-center">
            <p className="font-montserrat text-xs text-stone-600 mb-2 uppercase tracking-wider">
              Tarot Card (Back)
            </p>
            <div className="w-full max-w-[180px] mx-auto aspect-[2/3] rounded-sm border border-amber-800/30 shadow-md bg-gradient-to-br from-navy-dark via-navy-mid to-navy-dark p-3 flex flex-col justify-between">
              <div className="text-center">
                <span className="text-2xl text-gold/80">{tarotCard.symbol || '✧'}</span>
              </div>
              <div className="text-center flex-1 flex flex-col justify-center">
                <p className="font-cinzel text-xs text-gold-light mb-2">{tarotCard.title || spellTitle}</p>
                {tarotCard.essence && (
                  <p className="font-montserrat text-[10px] text-silver-mist/80 italic leading-tight">
                    &ldquo;{tarotCard.essence}&rdquo;
                  </p>
                )}
              </div>
              <div className="text-center">
                {tarotCard.key_action && (
                  <p className="font-montserrat text-[9px] text-gold/60 uppercase tracking-wider">
                    {tarotCard.key_action}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Sigil */}
        {sigilImageBase64 && (
          <div className="text-center">
            <p className="font-montserrat text-xs text-stone-600 mb-2 uppercase tracking-wider">
              Sigil
            </p>
            <img 
              src={`data:image/png;base64,${sigilImageBase64}`}
              alt={`${spellTitle} - Sigil`}
              className="w-full max-w-[150px] mx-auto rounded-sm border border-amber-800/30 shadow-md bg-white"
            />
          </div>
        )}
      </div>
    </section>
  );
};

// Section Header with Micro-Icon
const SectionHeader = ({ icon: Icon, title, microIcon, accentColor }) => (
  <h2 className={`font-cinzel text-xl text-amber-900 mb-4 flex items-center gap-2`}>
    {microIcon && <span className="text-xl">{microIcon}</span>}
    {Icon && !microIcon && <Icon className="w-5 h-5" />}
    {title}
  </h2>
);

// Enhanced Tarot Card View with Image and Flip Functionality
const TarotCardView = ({ spell, archetype, style, imageBase64, onViewFull, onCopy, onSave, onNewSpell, isSaving }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const tarot = spell?.tarot_card;
  if (!tarot) return null;
  
  return (
    <SpellBorderFrame persona={archetype?.id || 'site'}>
    <motion.div
      initial={{ opacity: 0, scale: 0.95, rotateY: -10 }}
      animate={{ opacity: 1, scale: 1, rotateY: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="max-w-md mx-auto perspective-1000"
    >
      {/* Main Card with Flip */}
      <div 
        className="relative cursor-pointer"
        style={{ 
          aspectRatio: '2.5/4',
          transformStyle: 'preserve-3d',
        }}
        onClick={() => imageBase64 && setIsFlipped(!isFlipped)}
      >
        <motion.div
          className="relative w-full h-full"
          style={{ transformStyle: 'preserve-3d' }}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        >
          {/* Front - Tarot Card */}
          <div 
            className="absolute inset-0 rounded-xl overflow-hidden"
            style={{ 
              backfaceVisibility: 'hidden',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 40px rgba(139, 90, 43, 0.2)',
            }}
          >
            {/* Gold outer border effect */}
            <div 
              className="absolute inset-0 rounded-xl"
              style={{
                background: 'linear-gradient(135deg, #B8860B 0%, #DAA520 20%, #FFD700 50%, #DAA520 80%, #B8860B 100%)',
                padding: '4px',
              }}
            />
            
            {/* Card inner container */}
            <div className="absolute inset-1 rounded-lg overflow-hidden bg-[#1a1a1a]">
              {/* Background Image */}
              {imageBase64 ? (
                <div className="absolute inset-0">
                  <img 
                    src={`data:image/png;base64,${imageBase64}`}
                    alt={spell.title}
                    className="w-full h-full object-cover"
                  />
                  {/* Gradient overlays for readability */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/80" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>
              ) : (
                <div className={`absolute inset-0 bg-gradient-to-b ${style.cardGradient}`} />
              )}
              
              {/* Decorative inner borders */}
              <div className="absolute inset-3 border border-amber-500/30 rounded-md pointer-events-none" />
              <div className="absolute inset-5 border border-amber-400/20 rounded-sm pointer-events-none" />
              
              {/* Corner ornaments */}
              <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-amber-500/50" />
              <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-amber-500/50" />
              <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-amber-500/50" />
              <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-amber-500/50" />
              
              {/* Card Content */}
              <div className="relative h-full flex flex-col p-6 text-white">
                {/* Top Section - Symbol & Title */}
                <div className="text-center mb-2">
                  <span className="text-4xl drop-shadow-lg">{tarot.symbol || '✧'}</span>
                </div>
                
                <h2 
                  className="ritual-title text-2xl md:text-3xl text-amber-100 text-center mb-1"
                  style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.8)' }}
                >
                  {tarot.title || spell.title}
                </h2>
                
                {/* Archetype Attribution */}
                {archetype && (
                  <p className="font-montserrat text-xs text-amber-300/80 text-center mb-3 tracking-[0.2em] uppercase">
                    {archetype.name}
                  </p>
                )}
                
                {/* Decorative divider */}
                <div className="flex items-center justify-center gap-2 mb-3">
                  <div className="h-px bg-gradient-to-r from-transparent to-amber-500/50 flex-1" />
                  <Moon className="w-4 h-4 text-amber-400/60" />
                  <div className="h-px bg-gradient-to-l from-transparent to-amber-500/50 flex-1" />
                </div>
                
                {/* Middle Section - Essence & Key Action */}
                <div className="flex-1 flex flex-col justify-center space-y-3">
                  {/* Essence */}
                  <p 
                    className="font-crimson text-base text-amber-50/90 text-center leading-relaxed"
                    style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.7)' }}
                  >
                    {tarot.essence}
                  </p>
                  
                  {/* Key Action Box */}
                  <div className="bg-black/40 backdrop-blur-sm border border-amber-500/30 rounded-sm p-3">
                    <p className="font-montserrat text-xs text-amber-400/70 uppercase tracking-wider mb-1 text-center">
                      Key Action
                    </p>
                    <p className="font-crimson text-sm text-amber-50/80 text-center">
                      {tarot.key_action}
                    </p>
                  </div>
                  
                  {/* Incantation */}
                  <div className="py-3 border-y border-amber-500/30">
                    <p 
                      className="font-crimson text-lg text-amber-200 italic text-center"
                      style={{ textShadow: '1px 1px 6px rgba(0,0,0,0.8)' }}
                    >
                      &ldquo;{tarot.incantation}&rdquo;
                    </p>
                  </div>
                </div>
                
                {/* Bottom Section - Timing & Flip Hint */}
                <div className="mt-3 space-y-2">
                  {tarot.timing && (
                    <div className="flex items-center justify-center gap-2 text-xs text-amber-300/70">
                      <Clock className="w-3 h-3" />
                      <span className="font-montserrat tracking-wider">{tarot.timing}</span>
                    </div>
                  )}
                  
                  {tarot.warning && (
                    <p className="font-montserrat text-xs text-red-400/80 text-center italic">
                      ⚠ {tarot.warning}
                    </p>
                  )}
                  
                  {/* Cathleen's Ward Preview */}
                  {spell.suggested_ward && (
                    <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-500/40 rounded-sm p-2 mt-2">
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-lg">{spell.suggested_ward.symbol || '🪶'}</span>
                        <div className="text-center">
                          <p className="font-montserrat text-[10px] text-slate-400 uppercase tracking-wider">Your Ward</p>
                          <p className="font-crimson text-sm text-slate-200">{spell.suggested_ward.name}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Flip hint - only show if there's an image */}
                  {imageBase64 && (
                    <div className="text-center pt-1">
                      <p className="font-montserrat text-[10px] text-amber-400/60 animate-pulse">
                        ✨ Click card to see full artwork ✨
                      </p>
                    </div>
                  )}
                  
                  {/* Bottom symbol */}
                  <div className="text-center pt-1">
                    <span className="text-2xl text-amber-500/40">{tarot.symbol || '✧'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Back - Full Image */}
          <div 
            className="absolute inset-0 rounded-xl overflow-hidden"
            style={{ 
              backfaceVisibility: 'hidden', 
              transform: 'rotateY(180deg)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 40px rgba(139, 90, 43, 0.2)',
            }}
          >
            {/* Gold border */}
            <div 
              className="absolute inset-0 rounded-xl"
              style={{
                background: 'linear-gradient(135deg, #B8860B 0%, #DAA520 20%, #FFD700 50%, #DAA520 80%, #B8860B 100%)',
                padding: '4px',
              }}
            />
            
            <div className="absolute inset-1 rounded-lg overflow-hidden bg-[#1a1a1a]">
              {imageBase64 && (
                <img 
                  src={`data:image/png;base64,${imageBase64}`}
                  alt={spell.title}
                  className="w-full h-full object-contain bg-[#0a0a0a]"
                />
              )}
              
              {/* Flip back hint */}
              <div className="absolute bottom-4 left-0 right-0 text-center">
                <p className="font-montserrat text-xs text-amber-300/80 bg-black/60 inline-block px-3 py-1 rounded-full backdrop-blur-sm">
                  Click to flip back
                </p>
              </div>
              
              {/* Title overlay at top */}
              <div className="absolute top-4 left-0 right-0 text-center">
                <p className="font-italiana text-lg text-amber-200 bg-black/60 inline-block px-4 py-1 rounded-full backdrop-blur-sm">
                  {spell.title}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Action Buttons Below Card */}
      <div className="mt-6 space-y-4">
        {/* View Full Ritual Button */}
        <button
          onClick={onViewFull}
          className="w-full px-6 py-3 bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 text-amber-50 rounded-sm font-montserrat tracking-widest uppercase text-sm hover:from-amber-600 hover:via-amber-500 hover:to-amber-600 transition-all flex items-center justify-center gap-2 shadow-lg"
          style={{ boxShadow: '0 4px 15px rgba(139, 90, 43, 0.4)' }}
        >
          <BookOpen className="w-4 h-4" />
          View Full Ritual
        </button>
        
        {/* Quick Actions */}
        <div className="flex justify-center gap-3">
          <button
            onClick={onCopy}
            className="p-3 bg-card/80 text-primary border border-primary/30 rounded-sm hover:bg-primary/10 transition-all shadow-md"
            title="Copy to clipboard"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={onSave}
            disabled={isSaving}
            className="p-3 bg-accent text-accent-foreground rounded-sm hover:bg-accent/90 transition-all disabled:opacity-50 shadow-md"
            title="Save to Grimoire"
          >
            <Save className={`w-4 h-4 ${isSaving ? 'animate-pulse' : ''}`} />
          </button>
          <button
            onClick={onNewSpell}
            className="p-3 bg-card/80 text-primary border border-primary/30 rounded-sm hover:bg-primary/10 transition-all shadow-md"
            title="New Spell"
          >
            <Sparkles className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
    </SpellBorderFrame>
  );
};

export const GrimoirePage = ({ spell, archetype, imageBase64, assetPlan, onNewSpell, isLoadingImages = false }) => {
  const [showHistoricalContext, setShowHistoricalContext] = useState(false);
  const [checklistMode, setChecklistMode] = useState(false);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [subscriptionTier, setSubscriptionTier] = useState('free'); // Default to free
  const [viewMode, setViewMode] = useState('card'); // 'card' or 'full' - start with card view
  // Research & Origins state
  const [showResearch, setShowResearch] = useState(false);
  const [isLoadingResearch, setIsLoadingResearch] = useState(false);
  const [researchData, setResearchData] = useState(null);
  const grimoireRef = useRef(null);
  const navigate = useNavigate();
  
  // Normalize archetype ID for styling
  const normalizeId = (id) => {
    const map = { 'shiggy': 'shigg', 'kathleen': 'cathleen', 'catherine': 'katherine' };
    return map[id] || id;
  };
  const normalizedArchetypeId = normalizeId(archetype?.id);
  const style = ARCHETYPE_STYLES[normalizedArchetypeId] || ARCHETYPE_STYLES[archetype?.id] || ARCHETYPE_STYLES.neutral;
  
  // Get generated assets from asset plan
  const generatedAssets = assetPlan?.generated_assets || {};
  const microIcons = assetPlan?.micro_icons || [];
  
  // Helper to get micro-icon for a section
  const getMicroIconForSection = (sectionName) => {
    // Map section names to micro-icon types
    const sectionIconMap = {
      'materials': 0,
      'preparation': 1,
      'the_working': 2,
      'spoken_words': 3,
      'closing': 4,
      'aftercare': 5
    };
    const idx = sectionIconMap[sectionName];
    if (idx !== undefined && microIcons[idx]) {
      return microIcons[idx].emoji;
    }
    return null;
  };
  
  // Check subscription status
  React.useEffect(() => {
    const checkSubscription = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      // First try to get from stored user data
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          if (userData.subscription_tier) {
            setSubscriptionTier(userData.subscription_tier);
            console.log('Subscription tier from localStorage:', userData.subscription_tier);
          }
        } catch (e) {
          console.error('Failed to parse user data:', e);
        }
      }
      
      // Then fetch latest from API to ensure it's current
      if (token) {
        try {
          const status = await subscriptionAPI.getStatus();
          setSubscriptionTier(status.subscription_tier);
          console.log('Subscription tier from API:', status.subscription_tier);
        } catch (error) {
          console.error('Failed to check subscription:', error);
          // Keep the tier from localStorage if API fails
          if (!storedUser) {
            setSubscriptionTier('free');
          }
        }
      } else {
        setSubscriptionTier('free'); // Anonymous users are treated as free
      }
    };
    checkSubscription();
  }, []);
  
  const toggleStep = (stepNumber) => {
    const newCompleted = new Set(completedSteps);
    if (newCompleted.has(stepNumber)) {
      newCompleted.delete(stepNumber);
    } else {
      newCompleted.add(stepNumber);
    }
    setCompletedSteps(newCompleted);
  };

  const copySpellToClipboard = () => {
    const text = `${spell.title}\n\n${spell.introduction}\n\nMaterials:\n${spell.materials?.map(m => `- ${m.name}`).join('\n')}\n\nSteps:\n${spell.steps?.map(s => `${s.number}. ${s.title}: ${s.instruction}`).join('\n')}\n\nSpoken Words:\n${spell.spoken_words?.invocation}\n${spell.spoken_words?.main_incantation}\n${spell.spoken_words?.closing}`;
    navigator.clipboard.writeText(text);
    toast.success('Spell copied to clipboard!');
  };

  const downloadAsPdf = async () => {
    if (!grimoireRef.current) {
      console.error('GrimoireRef is null');
      toast.error('Unable to generate PDF - page reference missing');
      return;
    }
    
    setIsGeneratingPdf(true);
    
    try {
      console.log('Attempting PDF generation with jsPDF + html2canvas...');
      const element = grimoireRef.current;
      
      // Wait a brief moment for any images to load
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Create canvas from the element
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#D8CBB3',
        logging: false,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight
      });
      
      // Calculate PDF dimensions
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Create PDF
      const pdf = new jsPDF({
        orientation: imgHeight > imgWidth ? 'portrait' : 'landscape',
        unit: 'mm',
        format: 'a4'
      });
      
      let heightLeft = imgHeight;
      let position = 0;
      
      // Add first page
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      // Add remaining pages if content is longer than one page
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      const filename = `${spell.title?.replace(/[^a-z0-9]/gi, '_') || 'spell'}_grimoire.pdf`;
      pdf.save(filename);
      
      toast.success('PDF downloaded to your Downloads folder!');
    } catch (error) {
      console.error('PDF generation error:', error);
      
      // Fallback: Open print dialog
      toast.info('Opening print dialog - use "Save as PDF" option');
      window.print();
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const saveToGrimoire = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please log in to save spells to your grimoire');
      return;
    }

    setIsSaving(true);
    
    try {
      await grimoireAPI.saveSpell(
        spell,
        archetype?.id,
        archetype?.name,
        archetype?.title,
        imageBase64,
        assetPlan  // Include tarot, sigil, dividers, micro_icons
      );
      toast.success('Spell saved to your grimoire!');
    } catch (error) {
      console.error('Save spell error:', error);
      if (error.response?.status === 401) {
        toast.error('Please log in to save spells');
      } else if (error.response?.status === 403 && error.response?.data?.detail?.error === 'feature_locked') {
        toast.error(error.response.data.detail.message, { duration: 6000 });
        setTimeout(() => navigate('/upgrade'), 2000);
      } else {
        toast.error('Failed to save spell. Please try again.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Fetch research & origins from dual-model API
  const fetchResearchOrigins = async () => {
    if (researchData) {
      // Already loaded, just toggle visibility
      setShowResearch(!showResearch);
      return;
    }
    
    setIsLoadingResearch(true);
    setShowResearch(true);
    
    try {
      // Build context from spell data
      const spellContext = `Spell: "${spell.title}". Intention: ${spell.introduction || spell.scenario || 'self-improvement'}`;
      const personaId = archetype?.id || 'shigg';
      
      const result = await researchAPI.combined(
        spell.title || 'magical practice',
        personaId,
        'gentle',
        spellContext
      );
      
      setResearchData(result);
    } catch (error) {
      console.error('Research fetch error:', error);
      toast.error('Unable to fetch research data');
      setShowResearch(false);
    } finally {
      setIsLoadingResearch(false);
    }
  };


  if (spell.parse_error) {
    return (
      <div className="bg-card/50 border border-border rounded-sm p-6">
        <h3 className="font-cinzel text-xl text-secondary mb-4">Your Spell</h3>
        <div className="font-montserrat text-sm text-foreground whitespace-pre-wrap">
          {spell.raw_response}
        </div>
      </div>
    );
  }

  // If viewing tarot card mode and we have tarot data
  if (viewMode === 'card' && spell.tarot_card) {
    return (
      <TarotCardView 
        spell={spell}
        archetype={archetype}
        style={style}
        imageBase64={imageBase64}
        onViewFull={() => setViewMode('full')}
        onCopy={copySpellToClipboard}
        onSave={saveToGrimoire}
        onNewSpell={onNewSpell}
        isSaving={isSaving}
      />
    );
  }

  return (
    <SpellBorderFrame persona={archetype?.id || 'site'}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        ref={grimoireRef}
        className={`bg-card/80 border-2 ${style.borderColor} rounded-sm overflow-hidden shadow-xl`}
        style={{ backgroundColor: '#D8CBB3' }}
      >
      {/* View Toggle - Show only if tarot_card exists */}
      {spell.tarot_card && (
        <div className="flex justify-center gap-2 p-4 bg-amber-900/15 border-b border-amber-800/30">
          <button
            onClick={() => setViewMode('card')}
            className={`px-4 py-2 rounded-sm font-montserrat tracking-wider text-xs transition-all ${
              viewMode === 'card' 
                ? 'bg-amber-800 text-amber-50' 
                : 'bg-transparent text-stone-700 hover:text-amber-900'
            }`}
          >
            ✧ Card View
          </button>
          <button
            onClick={() => setViewMode('full')}
            className={`px-4 py-2 rounded-sm font-montserrat tracking-wider text-xs transition-all ${
              viewMode === 'full' 
                ? 'bg-amber-800 text-amber-50' 
                : 'bg-transparent text-stone-700 hover:text-amber-900'
            }`}
          >
            📖 Full Grimoire
          </button>
        </div>
      )}

      {/* Header Image - show skeleton while loading */}
      {imageBase64 ? (
        <div className="relative h-48 md:h-64 overflow-hidden">
          <img 
            src={`data:image/png;base64,${imageBase64}`}
            alt={spell.title}
            className="w-full h-full object-cover"
          />
          <div className={`absolute inset-0 bg-gradient-to-t ${style.headerGradient}`} />
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-card to-transparent">
            <h1 className="ritual-title text-3xl md:text-4xl text-primary drop-shadow-lg">
              {spell.title || 'Untitled Spell'}
            </h1>
            {spell.subtitle && spell.subtitle !== 'null' && (
              <p className="font-montserrat text-sm text-amber-100/90 mt-1">{spell.subtitle}</p>
            )}
          </div>
        </div>
      ) : isLoadingImages ? (
        <div className="relative h-48 md:h-64 overflow-hidden bg-gradient-to-br from-amber-900/20 to-amber-800/10 animate-pulse">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <Sparkles className="w-8 h-8 text-amber-800/40 mx-auto mb-2 animate-pulse" />
              <span className="text-amber-800/50 text-sm font-montserrat">Generating header image...</span>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#D8CBB3] to-transparent">
            <h1 className="ritual-title text-3xl md:text-4xl text-amber-900">
              {spell.title || 'Untitled Spell'}
            </h1>
            {spell.subtitle && spell.subtitle !== 'null' && (
              <p className="font-montserrat text-sm text-stone-700 mt-1">{spell.subtitle}</p>
            )}
          </div>
        </div>
      ) : (
        <div className={`p-6 ${style.bgAccent} border-b border-amber-800/30`}>
          <h1 className="ritual-title text-3xl md:text-4xl text-amber-900">{spell.title || 'Untitled Spell'}</h1>
          {spell.subtitle && spell.subtitle !== 'null' && (
            <p className="font-montserrat text-sm text-stone-700 mt-1">{spell.subtitle}</p>
          )}
        </div>
      )}

      <div className="p-6 md:p-8 space-y-8">
        {/* Archetype Attribution */}
        {archetype && (
          <div className="flex items-center gap-3 pb-4 border-b border-amber-800/30">
            <span className="text-2xl">{archetype.id === 'shiggy' ? '🪶' : archetype.id === 'kathleen' ? '🦉' : archetype.id === 'catherine' ? '🐦' : '🪽'}</span>
            <div>
              <p className="font-cinzel text-sm text-amber-900">Crafted by {archetype.name}</p>
              <p className="font-montserrat text-xs text-stone-600">{archetype.title}</p>
            </div>
          </div>
        )}

        {/* Introduction */}
        {spell.introduction && (
          <div className={`p-4 bg-amber-900/10 border-l-4 border-amber-800 rounded-r-sm`}>
            <p className="font-crimson text-base md:text-lg text-stone-800 italic leading-relaxed">
              {spell.introduction}
            </p>
          </div>
        )}

        {/* BLOCKS-BASED SPELL RENDERING (V3) */}
        {spell.blocks && spell.blocks.length > 0 ? (
          <div className="blocks-spell-container">
            <SpellBlockRenderer 
              spell={spell}
              archetypeStyle={{
                borderColor: style.borderColor,
                accentColor: style.accentColor,
                bgAccent: style.bgAccent
              }}
              onLogUpdate={(log) => console.log('Spell log updated:', log)}
              initialLog={{}}
            />
          </div>
        ) : (
          <>
            {/* LEGACY FLAT SPELL RENDERING (V2 and earlier) */}
            
            {/* Timing */}
            {spell.timing && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <TimingCard icon={Moon} label="Moon Phase" value={spell.timing?.moon_phase} />
                <TimingCard icon={Sun} label="Time" value={spell.timing?.time_of_day} />
                <TimingCard icon={Calendar} label="Day" value={spell.timing?.day} />
                <TimingCard icon={Clock} label="Note" value={spell.timing?.note} small />
              </div>
            )}

            {/* Cathleen's Suggested Ward - Special feature for her spells */}
        {spell.suggested_ward && (
          <section className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-slate-600/20 via-slate-500/10 to-slate-600/20 rounded-lg" />
            <div className="relative p-6 border-2 border-slate-600/40 rounded-lg bg-stone-100/80">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-slate-600/20 rounded-full">
                  <span className="text-3xl">{spell.suggested_ward.symbol || '🪶'}</span>
                </div>
                <div>
                  <p className="font-cinzel text-xs text-slate-700 uppercase tracking-wider">Cathleen&apos;s Gift</p>
                  <h3 className="font-cinzel text-xl text-slate-800">Your Ward: {spell.suggested_ward.name}</h3>
                </div>
              </div>
              
              <div className="space-y-4 font-montserrat text-sm">
                <div className="flex items-start gap-2">
                  <Heart className="w-4 h-4 text-slate-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-slate-600 uppercase tracking-wide mb-1">What It Means</p>
                    <p className="text-stone-800">{spell.suggested_ward.meaning}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <Eye className="w-4 h-4 text-slate-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-slate-600 uppercase tracking-wide mb-1">How to Find It</p>
                    <p className="text-stone-800">{spell.suggested_ward.how_to_find}</p>
                  </div>
                </div>
                
                {spell.suggested_ward.activation && (
                  <div className="flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-slate-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-slate-600 uppercase tracking-wide mb-1">Awakening Your Ward</p>
                      <p className="text-stone-800">{spell.suggested_ward.activation}</p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-4 pt-4 border-t border-slate-400/30">
                <p className="font-montserrat text-xs text-slate-600 italic text-center">
                  &ldquo;Carry your ward close—a physical anchor for invisible magic.&rdquo; — Cathleen
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Cathleen's Concealment Suggestion - WWII Spy Tradecraft inspired */}
        {spell.concealment_suggestion && (
          <section className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-slate-600/20 via-slate-500/10 to-slate-600/20 rounded-lg" />
            <div className="relative p-6 border-2 border-slate-600/40 rounded-lg bg-stone-100/80">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-slate-600/20 rounded-full">
                  <Lock className="w-6 h-6 text-slate-700" />
                </div>
                <div>
                  <p className="font-cinzel text-xs text-slate-600 uppercase tracking-wider">Cathleen&apos;s Secret</p>
                  <h3 className="font-cinzel text-xl text-slate-800">{spell.concealment_suggestion.title || 'Keep Your Secrets Close'}</h3>
                </div>
              </div>
              
              <div className="space-y-4 font-montserrat text-sm">
                {/* Historical Inspiration */}
                {spell.concealment_suggestion.historical_inspiration && (
                  <div className="flex items-start gap-2">
                    <History className="w-4 h-4 text-slate-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-slate-600 uppercase tracking-wide mb-1">From the Secret History</p>
                      <p className="text-stone-800 italic">{spell.concealment_suggestion.historical_inspiration}</p>
                    </div>
                  </div>
                )}
                
                {/* Your Adaptation */}
                {spell.concealment_suggestion.your_adaptation && (
                  <div className="flex items-start gap-2">
                    <Key className="w-4 h-4 text-slate-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-slate-600 uppercase tracking-wide mb-1">Your Hidden Place</p>
                      <p className="text-stone-800">{spell.concealment_suggestion.your_adaptation}</p>
                    </div>
                  </div>
                )}
                
                {/* Suggested Items */}
                {spell.concealment_suggestion.suggested_items && spell.concealment_suggestion.suggested_items.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {spell.concealment_suggestion.suggested_items.map((item, idx) => (
                      <span key={idx} className="px-3 py-1 bg-slate-600/20 text-stone-800 rounded-full text-xs">
                        {item}
                      </span>
                    ))}
                  </div>
                )}
                
                {/* Cathleen's Note */}
                {spell.concealment_suggestion.cathleen_note && (
                  <div className="mt-4 pt-4 border-t border-slate-400/30">
                    <p className="text-slate-700 italic text-center text-xs">
                      &ldquo;{spell.concealment_suggestion.cathleen_note}&rdquo;
                    </p>
                    <p className="text-slate-600 text-xs text-center mt-1">— Cathleen</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Materials */}
        {spell.materials && spell.materials.length > 0 && (
          <section>
            <SectionHeader 
              icon={Sparkles} 
              title="Materials Needed" 
              microIcon={getMicroIconForSection('materials')}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {spell.materials.map((material, idx) => {
                const IconComponent = MATERIAL_ICONS[material.icon] || Circle;
                return (
                  <div 
                    key={idx}
                    className="flex items-start gap-3 p-3 bg-amber-900/10 border border-amber-800/30 rounded-sm"
                  >
                    <div className={`p-2 bg-amber-800/20 rounded-sm`}>
                      {material.icon ? (
                        <span className="text-lg">{material.icon}</span>
                      ) : (
                        <IconComponent className={`w-5 h-5 text-amber-800`} />
                      )}
                    </div>
                    <div>
                      <p className="font-montserrat text-sm font-medium text-stone-800">{material.name}</p>
                      {material.note && (
                        <p className="font-montserrat text-xs text-stone-600 mt-0.5">{material.note}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Divider after materials */}
        <GeneratedDivider imageBase64={generatedAssets?.divider_1} isLoading={isLoadingImages} />

        {/* Ritual Steps / The Working */}
        {(spell.steps && spell.steps.length > 0) || spell.the_working ? (
          <section>
            <div className="flex items-center justify-between mb-4">
              <SectionHeader 
                icon={BookOpen} 
                title="The Working" 
                microIcon={getMicroIconForSection('the_working')}
              />
              <button
                onClick={() => setChecklistMode(!checklistMode)}
                className={`px-3 py-1 rounded-sm text-xs font-montserrat tracking-wider transition-all ${
                  checklistMode 
                    ? 'bg-amber-800 text-amber-50' 
                    : 'bg-amber-900/20 text-stone-700 hover:bg-amber-900/30'
                }`}
              >
                {checklistMode ? 'Checklist On' : 'Track Progress'}
              </button>
            </div>
            
            {/* Working description */}
            {spell.the_working?.description && (
              <p className="font-montserrat text-sm text-stone-800 mb-4">{spell.the_working.description}</p>
            )}
            
            <div className="space-y-4">
              {/* Support both old 'steps' format and new 'the_working.steps' format */}
              {(spell.the_working?.steps || spell.steps || []).map((step, idx) => {
                const stepNum = step.step || step.number || idx + 1;
                return (
                  <motion.div 
                    key={stepNum}
                    className={`relative pl-12 pb-4 ${stepNum < (spell.the_working?.steps || spell.steps).length ? 'border-l-2 border-amber-800/30 ml-4' : 'ml-4'}`}
                  >
                    {/* Step number circle */}
                    <div 
                      className={`absolute left-0 -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center text-sm font-cinzel cursor-pointer transition-all ${
                        completedSteps.has(stepNum)
                          ? 'bg-amber-700 text-amber-50'
                          : `bg-amber-800/20 text-amber-900 border-2 border-amber-800/40`
                      }`}
                      onClick={() => checklistMode && toggleStep(stepNum)}
                    >
                      {checklistMode && completedSteps.has(stepNum) ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        stepNum
                      )}
                    </div>
                    
                    <div className={`transition-opacity ${checklistMode && completedSteps.has(stepNum) ? 'opacity-50' : ''}`}>
                      <h3 className="font-cinzel text-base text-amber-900 mb-1">{step.title}</h3>
                      <p className="font-montserrat text-sm text-stone-800 leading-relaxed">{step.instruction}</p>
                      {step.spoken_words && (
                        <p className="font-crimson text-sm text-amber-800 italic mt-2">&ldquo;{step.spoken_words}&rdquo;</p>
                      )}
                      {step.duration && (
                        <p className="font-montserrat text-xs text-stone-600 mt-2 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {step.duration}
                        </p>
                      )}
                      {step.note && (
                        <p className="font-crimson text-xs text-amber-800 italic mt-1">✦ {step.note}</p>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>
        ) : null}

        {/* Divider after working */}
        <GeneratedDivider imageBase64={generatedAssets?.divider_2} isLoading={isLoadingImages} />

        {/* Spoken Words */}
        {spell.spoken_words && (
          <section className={`p-6 bg-amber-900/10 border border-amber-800/40 rounded-sm`}>
            <SectionHeader 
              icon={Quote} 
              title="Words of Power" 
              microIcon={getMicroIconForSection('spoken_words')}
            />
            
            <div className="space-y-4">
              {spell.spoken_words.invocation && (
                <div>
                  <p className="font-montserrat text-xs text-stone-600 uppercase tracking-wider mb-1">Opening Invocation</p>
                  <p className="font-crimson text-base text-stone-800 italic">&ldquo;{spell.spoken_words.invocation}&rdquo;</p>
                </div>
              )}
              
              {spell.spoken_words.main_incantation && (
                <div className="py-4 border-y border-amber-800/30">
                  <p className="font-montserrat text-xs text-stone-600 uppercase tracking-wider mb-2">Main Incantation</p>
                  <p className="font-crimson text-lg text-amber-900 text-center leading-relaxed">
                    &ldquo;{spell.spoken_words.main_incantation}&rdquo;
                  </p>
                </div>
              )}
              
              {spell.spoken_words.closing && (
                <div>
                  <p className="font-montserrat text-xs text-stone-600 uppercase tracking-wider mb-1">Closing Words</p>
                  <p className="font-crimson text-base text-stone-800 italic">&ldquo;{spell.spoken_words.closing}&rdquo;</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Historical Context (Collapsible) */}
        {spell.historical_context && (
          <section className="border border-amber-800/30 rounded-sm overflow-hidden">
            <button
              onClick={() => setShowHistoricalContext(!showHistoricalContext)}
              className="w-full p-4 flex items-center justify-between bg-amber-900/10 hover:bg-amber-900/20 transition-all"
            >
              <span className="font-cinzel text-base text-amber-900 flex items-center gap-2">
                <History className="w-5 h-5" />
                Historical Context & Sources
              </span>
              {showHistoricalContext ? <ChevronUp className="w-5 h-5 text-stone-700" /> : <ChevronDown className="w-5 h-5 text-stone-700" />}
            </button>
            
            <AnimatePresence>
              {showHistoricalContext && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 space-y-4 border-t border-amber-800/30">
                    {spell.historical_context.tradition && (
                      <div>
                        <p className="font-montserrat text-xs text-stone-600 uppercase tracking-wider">Tradition</p>
                        <p className="font-montserrat text-sm text-stone-800">{spell.historical_context.tradition}</p>
                      </div>
                    )}
                    
                    {spell.historical_context.time_period && (
                      <div>
                        <p className="font-montserrat text-xs text-stone-600 uppercase tracking-wider">Time Period</p>
                        <p className="font-montserrat text-sm text-stone-800">{spell.historical_context.time_period}</p>
                      </div>
                    )}
                    
                    {spell.historical_context.practitioners && spell.historical_context.practitioners.length > 0 && (
                      <div>
                        <p className="font-montserrat text-xs text-stone-600 uppercase tracking-wider flex items-center gap-1">
                          <Users className="w-3 h-3" /> Historical Practitioners
                        </p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {spell.historical_context.practitioners.map((name, idx) => (
                            <span key={idx} className="px-2 py-1 bg-amber-900/15 text-stone-800 rounded-sm text-xs font-montserrat">
                              {name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {spell.historical_context.sources && spell.historical_context.sources.length > 0 && (
                      <div>
                        <p className="font-montserrat text-xs text-stone-600 uppercase tracking-wider mb-2">Sources & References</p>
                        <div className="space-y-2">
                          {spell.historical_context.sources.map((source, idx) => (
                            <div key={idx} className="p-3 bg-amber-900/10 rounded-sm">
                              <p className="font-montserrat text-sm text-stone-800">
                                <strong>{source.author}</strong>, <em>{source.work}</em> ({source.year})
                              </p>
                              {source.relevance && (
                                <p className="font-montserrat text-xs text-stone-600 mt-1">{source.relevance}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {spell.historical_context.cultural_notes && (
                      <div className="p-3 bg-amber-800/10 border-l-2 border-amber-800 rounded-r-sm">
                        <p className="font-montserrat text-xs text-stone-600 uppercase tracking-wider mb-1">Cultural Notes</p>
                        <p className="font-crimson text-sm text-stone-800 italic">{spell.historical_context.cultural_notes}</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        )}

        {/* Variations */}
        {spell.variations && spell.variations.length > 0 && (
          <section>
            <h2 className="font-cinzel text-lg text-amber-900 mb-3">Variations & Adaptations</h2>
            <div className="space-y-2">
              {spell.variations.map((variation, idx) => (
                <div key={idx} className="p-3 bg-amber-900/10 rounded-sm">
                  {typeof variation === 'string' ? (
                    <p className="font-montserrat text-sm text-stone-800">{variation}</p>
                  ) : (
                    <>
                      <p className="font-montserrat text-sm font-medium text-stone-800">{variation.name}</p>
                      <p className="font-montserrat text-xs text-stone-600">{variation.description}</p>
                    </>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
        
        {/* References & Where This Comes From - Collectible Design */}
        {spell.inspired_by && spell.inspired_by.length > 0 ? (
          <section className="border border-amber-800/30 rounded-sm overflow-hidden">
            <button
              onClick={() => setShowHistoricalContext(!showHistoricalContext)}
              className="w-full p-4 flex items-center justify-between bg-amber-900/10 hover:bg-amber-900/20 transition-all"
            >
              <span className="font-cinzel text-base text-amber-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                References &amp; Where This Comes From
              </span>
              {showHistoricalContext ? <ChevronUp className="w-5 h-5 text-stone-700" /> : <ChevronDown className="w-5 h-5 text-stone-700" />}
            </button>
            
            <AnimatePresence>
              {showHistoricalContext && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 space-y-3 border-t border-amber-800/30">
                    {spell.inspired_by.map((source, idx) => (
                      <details key={idx} className="group bg-amber-900/5 rounded-sm border border-amber-800/20">
                        <summary className="p-3 cursor-pointer flex items-center gap-3 hover:bg-amber-900/10 transition-colors list-none">
                          <span className="text-lg">
                            {source.source_type === 'book' ? '📖' : 
                             source.source_type === 'tradition' ? '🏛️' : 
                             source.source_type === 'practice' ? '✨' : 
                             source.source_type === 'author' ? '✍️' : '📜'}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="font-cinzel text-sm font-medium text-amber-900 truncate">
                              {source.name}
                              {source.author && <span className="text-stone-600 font-montserrat text-xs ml-1">— {source.author}</span>}
                            </p>
                          </div>
                          <ChevronDown className="w-4 h-4 text-stone-500 group-open:rotate-180 transition-transform" />
                        </summary>
                        
                        <div className="px-3 pb-3 pt-1 space-y-3 border-t border-amber-800/10">
                          {/* Why This Matters Here */}
                          {(source.connection_to_spell || source.connection) && (
                            <div className="bg-white/60 p-3 rounded border-l-2 border-amber-700">
                              <p className="font-montserrat text-xs text-amber-800 uppercase tracking-wider mb-1">Why this matters here</p>
                              <p className="font-crimson text-sm text-stone-700 leading-relaxed">
                                {source.connection_to_spell || source.connection}
                              </p>
                            </div>
                          )}
                          
                          {/* Key Concept Used */}
                          {source.key_concept_used && (
                            <div className="flex items-start gap-2">
                              <span className="text-amber-700 text-sm">🔑</span>
                              <div>
                                <p className="font-montserrat text-xs text-amber-800 uppercase tracking-wider">Concept used</p>
                                <p className="font-montserrat text-sm text-stone-700">{source.key_concept_used}</p>
                              </div>
                            </div>
                          )}
                          
                          {/* Beginner Takeaway */}
                          {source.beginner_takeaway && (
                            <div className="bg-amber-100/50 p-2 rounded">
                              <p className="font-crimson text-sm text-amber-900 italic">
                                💡 {source.beginner_takeaway}
                              </p>
                            </div>
                          )}
                          
                          {/* Learn More Links */}
                          {source.learn_more && source.learn_more.length > 0 && (
                            <div>
                              <p className="font-montserrat text-xs text-amber-800 uppercase tracking-wider mb-2">Learn more</p>
                              <div className="flex flex-wrap gap-2">
                                {source.learn_more.map((resource, resIdx) => (
                                  <a 
                                    key={resIdx}
                                    href={resource.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 px-2 py-1 bg-white/70 hover:bg-white rounded text-xs font-montserrat text-amber-900 border border-amber-800/20 transition-colors"
                                  >
                                    {resource.access === 'free' ? '🆓' : resource.access === 'overview' ? '📋' : '📚'}
                                    <span className="truncate max-w-32">{resource.title}</span>
                                    <ExternalLink className="w-3 h-3 flex-shrink-0" />
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </details>
                    ))}
                    
                    {/* Historical Context - Compact */}
                    {spell.historical_context && (
                      <div className="p-3 bg-stone-100/80 rounded-sm border border-stone-300/50 mt-3">
                        <div className="flex items-center gap-2 mb-2">
                          <History className="w-4 h-4 text-stone-600" />
                          <span className="font-montserrat text-xs text-stone-600 uppercase tracking-wider">Historical Context</span>
                        </div>
                        <div className="space-y-1 text-sm">
                          {spell.historical_context.tradition && (
                            <p className="font-montserrat text-stone-700">
                              <span className="font-medium">Tradition:</span> {spell.historical_context.tradition}
                            </p>
                          )}
                          {spell.historical_context.cultural_note && (
                            <p className="font-crimson text-stone-600 italic text-sm">
                              {spell.historical_context.cultural_note}
                            </p>
                          )}
                          {spell.historical_context.modern_adaptation && (
                            <p className="font-montserrat text-xs text-stone-500 mt-1">
                              <span className="font-medium">Today:</span> {spell.historical_context.modern_adaptation}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        ) : (
          /* Back-compat: Older spells without references */
          <section className="p-4 bg-stone-100/50 rounded-sm border border-stone-300/30 text-center">
            <p className="font-montserrat text-sm text-stone-500 mb-2">
              This spell predates our reference system.
            </p>
            <button 
              onClick={() => {/* TODO: Call lightweight endpoint to add references */}}
              className="font-montserrat text-xs text-amber-700 hover:text-amber-900 underline"
              disabled
            >
              Add references to this spell (coming soon)
            </button>
          </section>
        )}

        {/* Warnings */}
        {spell.warnings && spell.warnings.length > 0 && (
          <div className="p-4 bg-red-900/10 border border-red-800/30 rounded-sm">
            <p className="font-montserrat text-xs text-red-800 uppercase tracking-wider mb-2 flex items-center gap-1">
              <AlertTriangle className="w-4 h-4" /> Important Considerations
            </p>
            <ul className="space-y-1">
              {spell.warnings.map((warning, idx) => (
                <li key={idx} className="font-montserrat text-sm text-stone-800">• {warning}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Closing Message */}
        {spell.closing_message && (
          <div className={`p-4 bg-amber-900/10 border-l-4 border-amber-800 rounded-r-sm`}>
            <p className="font-crimson text-base text-stone-800 italic">{spell.closing_message}</p>
          </div>
        )}
        
        {/* Closing section from new format */}
        {spell.closing && (
          <section>
            <SectionHeader 
              icon={CheckCircle2} 
              title="Closing" 
              microIcon={getMicroIconForSection('closing')}
            />
            {spell.closing.description && (
              <p className="font-montserrat text-sm text-stone-800 mb-3">{spell.closing.description}</p>
            )}
            {spell.closing.steps && spell.closing.steps.length > 0 && (
              <ul className="space-y-2 mb-3">
                {spell.closing.steps.map((step, idx) => (
                  <li key={idx} className="font-montserrat text-sm text-stone-800 flex items-start gap-2">
                    <span className="text-amber-800">✦</span>
                    {step}
                  </li>
                ))}
              </ul>
            )}
            {spell.closing.final_words && (
              <p className="font-crimson text-base text-amber-800 italic text-center">
                &ldquo;{spell.closing.final_words}&rdquo;
              </p>
            )}
          </section>
        )}
        
        {/* Aftercare section */}
        {spell.aftercare && (
          <section className="p-4 bg-amber-900/10 border border-amber-800/30 rounded-sm">
            <SectionHeader 
              icon={Heart} 
              title="Aftercare" 
              microIcon={getMicroIconForSection('aftercare')}
            />
            {spell.aftercare.immediate && (
              <div className="mb-3">
                <p className="font-montserrat text-xs text-stone-600 uppercase tracking-wider mb-1">Immediately After</p>
                <p className="font-montserrat text-sm text-stone-800">{spell.aftercare.immediate}</p>
              </div>
            )}
            {spell.aftercare.ongoing && (
              <div>
                <p className="font-montserrat text-xs text-stone-600 uppercase tracking-wider mb-1">Ongoing Practice</p>
                <p className="font-montserrat text-sm text-stone-800">{spell.aftercare.ongoing}</p>
              </div>
            )}
          </section>
        )}

        {/* Divider before printables */}
        <GeneratedDivider imageBase64={generatedAssets?.divider_3} isLoading={isLoadingImages} />
        
        {/* Printables Block - Tarot Card (front & back) and Sigil */}
        <PrintablesBlock 
          tarotImageBase64={generatedAssets?.tarot_card_image}
          sigilImageBase64={generatedAssets?.sigil}
          spellTitle={spell.title}
          tarotCard={spell.tarot_card}
          isLoading={isLoadingImages}
        />

        {/* Embossed Seal Stamp */}
        <div className="flex justify-center py-6">
          <div className="relative">
            <img 
              src={SEAL_LOGO_URL}
              alt="Where The Crowlands Seal"
              className="w-36 h-36 md:w-48 md:h-48 object-contain"
              style={{ 
                mixBlendMode: 'multiply',
                opacity: 0.6
              }}
            />
          </div>
        </div>

        {/* Research & Origins Button */}
        <section className="border border-indigo-800/30 rounded-sm overflow-hidden">
          <button
            onClick={fetchResearchOrigins}
            disabled={isLoadingResearch}
            className="w-full p-4 flex items-center justify-between bg-indigo-900/10 hover:bg-indigo-900/20 transition-all disabled:opacity-70"
            data-testid="show-research-origins-btn"
          >
            <span className="font-cinzel text-base text-indigo-900 flex items-center gap-2">
              {isLoadingResearch ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Search className="w-5 h-5" />
              )}
              {isLoadingResearch ? 'Researching...' : 'Show Research & Origins'}
            </span>
            {showResearch ? <ChevronUp className="w-5 h-5 text-stone-700" /> : <ChevronDown className="w-5 h-5 text-stone-700" />}
          </button>
          
          <AnimatePresence>
            {showResearch && researchData && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="p-4 space-y-4 border-t border-indigo-800/30 bg-indigo-50/30">
                  {/* Spellbook Response (OpenAI Persona Voice) */}
                  <div className="bg-amber-50/80 p-4 rounded-sm border border-amber-800/30">
                    <div className="flex items-center gap-2 mb-3">
                      <BookOpen className="w-4 h-4 text-amber-800" />
                      <span className="font-cinzel text-sm text-amber-900 uppercase tracking-wider">
                        {researchData.persona_used}&apos;s Wisdom
                      </span>
                    </div>
                    <p className="font-crimson text-base text-stone-700 leading-relaxed whitespace-pre-wrap">
                      {researchData.spellbook_response}
                    </p>
                  </div>
                  
                  {/* Research Origins (DeepSeek) */}
                  <div className="bg-white/60 p-4 rounded-sm border border-indigo-800/20">
                    <div className="flex items-center gap-2 mb-3">
                      <Search className="w-4 h-4 text-indigo-800" />
                      <span className="font-cinzel text-sm text-indigo-900 uppercase tracking-wider">
                        Research & Origins
                      </span>
                    </div>
                    
                    {/* Main Answer */}
                    <p className="font-montserrat text-sm text-stone-700 leading-relaxed mb-4">
                      {researchData.research_origins?.answer}
                    </p>
                    
                    {/* Key Points */}
                    {researchData.research_origins?.bullets?.length > 0 && (
                      <div className="mb-4">
                        <p className="font-montserrat text-xs text-indigo-800 uppercase tracking-wider mb-2">Key Points</p>
                        <ul className="space-y-1">
                          {researchData.research_origins.bullets.map((bullet, idx) => (
                            <li key={idx} className="font-montserrat text-sm text-stone-700 flex items-start gap-2">
                              <span className="text-indigo-600 mt-1">•</span>
                              {bullet}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {/* Sources */}
                    {researchData.research_origins?.sources?.length > 0 && (
                      <div>
                        <p className="font-montserrat text-xs text-indigo-800 uppercase tracking-wider mb-2">Suggested Further Reading</p>
                        <div className="flex flex-wrap gap-2">
                          {researchData.research_origins.sources.map((source, idx) => (
                            <span 
                              key={idx}
                              className="inline-block px-2 py-1 bg-indigo-100/50 text-xs font-montserrat text-indigo-800 rounded border border-indigo-200"
                            >
                              📚 {source}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 pt-4 border-t border-amber-800/30">
          <button
            onClick={saveToGrimoire}
            disabled={isSaving}
            className="px-4 py-2 bg-amber-700 text-amber-50 hover:bg-amber-800 rounded-sm font-montserrat tracking-widest uppercase text-xs transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Save className={`w-4 h-4 ${isSaving ? 'animate-pulse' : ''}`} />
            {isSaving ? 'Saving...' : 'Save to Grimoire'}
          </button>
          <button
            onClick={copySpellToClipboard}
            className="px-4 py-2 bg-transparent text-amber-900 border border-amber-800/40 rounded-sm font-montserrat tracking-widest uppercase text-xs hover:bg-amber-900/10 transition-all flex items-center gap-2"
          >
            <Copy className="w-4 h-4" />
            Copy Spell
          </button>
          <button
            onClick={downloadAsPdf}
            disabled={isGeneratingPdf}
            className="px-4 py-2 bg-transparent text-amber-900 border border-amber-800/40 hover:bg-amber-900/10 rounded-sm font-montserrat tracking-widest uppercase text-xs transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Download className={`w-4 h-4 ${isGeneratingPdf ? 'animate-bounce' : ''}`} />
            {isGeneratingPdf ? 'Generating...' : 'Save as PDF'}
          </button>
          <button
            onClick={onNewSpell}
            className="px-4 py-2 bg-amber-900 text-amber-50 rounded-sm font-montserrat tracking-widest uppercase text-xs hover:bg-amber-800 transition-all"
          >
            New Spell
          </button>
        </div>
      </div>
    </motion.div>
    </SpellBorderFrame>
  );
};

const TimingCard = ({ icon: Icon, label, value, small = false }) => (
  <div className="p-3 bg-amber-900/10 border border-amber-800/30 rounded-sm text-center">
    <Icon className="w-5 h-5 text-amber-800 mx-auto mb-1" />
    <p className="font-montserrat text-xs text-stone-600 uppercase tracking-wider">{label}</p>
    <p className={`font-cinzel ${small ? 'text-xs' : 'text-sm'} text-stone-800`}>{value || 'Any'}</p>
  </div>
);
