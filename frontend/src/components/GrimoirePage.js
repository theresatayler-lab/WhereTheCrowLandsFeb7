import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, ChevronUp, Clock, Moon, Sun, Calendar, 
  BookOpen, Feather, Copy, Download, CheckCircle2, Circle,
  Flame, Droplets, Wind, Sparkles, Star, Eye, Heart,
  AlertTriangle, Quote, History, Users, Save, Lock, Key
} from 'lucide-react';
import { toast } from 'sonner';
import html2pdf from 'html2pdf.js';
import { grimoireAPI, subscriptionAPI } from '../utils/api';
import { useNavigate } from 'react-router-dom';

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

// Archetype-specific styling
const ARCHETYPE_STYLES = {
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

// Enhanced Tarot Card View with Image and Flip Functionality
const TarotCardView = ({ spell, archetype, style, imageBase64, onViewFull, onCopy, onSave, onNewSpell, isSaving }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const tarot = spell?.tarot_card;
  if (!tarot) return null;
  
  return (
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
                  className="font-italiana text-2xl md:text-3xl text-amber-100 text-center mb-1"
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
  );
};

export const GrimoirePage = ({ spell, archetype, imageBase64, onNewSpell }) => {
  const [showHistoricalContext, setShowHistoricalContext] = useState(false);
  const [checklistMode, setChecklistMode] = useState(false);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [subscriptionTier, setSubscriptionTier] = useState('free'); // Default to free
  const [viewMode, setViewMode] = useState('card'); // 'card' or 'full' - start with card view
  const grimoireRef = useRef(null);
  const navigate = useNavigate();
  
  const style = ARCHETYPE_STYLES[archetype?.id] || ARCHETYPE_STYLES.neutral;
  
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
      // Try using html2pdf
      console.log('Attempting PDF generation with html2pdf...');
      const element = grimoireRef.current;
      
      const opt = {
        margin: [10, 10, 10, 10],
        filename: `${spell.title?.replace(/[^a-z0-9]/gi, '_') || 'spell'}_grimoire.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#D8CBB3',
          logging: false
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'portrait' 
        },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
      };
      
      const worker = html2pdf();
      await worker.set(opt).from(element).save();
      
      toast.success('PDF downloaded to your Downloads folder!');
    } catch (error) {
      console.error('html2pdf error:', error);
      
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
        imageBase64
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      ref={grimoireRef}
      className={`bg-card/80 border-2 ${style.borderColor} rounded-sm overflow-hidden shadow-xl`}
      style={{ backgroundColor: '#D8CBB3' }}
    >
      {/* View Toggle - Show only if tarot_card exists */}
      {spell.tarot_card && (
        <div className="flex justify-center gap-2 p-4 bg-muted/30 border-b border-border">
          <button
            onClick={() => setViewMode('card')}
            className={`px-4 py-2 rounded-sm font-montserrat tracking-wider text-xs transition-all ${
              viewMode === 'card' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-transparent text-muted-foreground hover:text-primary'
            }`}
          >
            ✧ Card View
          </button>
          <button
            onClick={() => setViewMode('full')}
            className={`px-4 py-2 rounded-sm font-montserrat tracking-wider text-xs transition-all ${
              viewMode === 'full' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-transparent text-muted-foreground hover:text-primary'
            }`}
          >
            📖 Full Grimoire
          </button>
        </div>
      )}

      {/* Header Image */}
      {imageBase64 && (
        <div className="relative h-48 md:h-64 overflow-hidden">
          <img 
            src={`data:image/png;base64,${imageBase64}`}
            alt={spell.title}
            className="w-full h-full object-cover"
          />
          <div className={`absolute inset-0 bg-gradient-to-t ${style.headerGradient}`} />
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-card to-transparent">
            <h1 className="font-italiana text-3xl md:text-4xl text-primary drop-shadow-lg">
              {spell.title}
            </h1>
            {spell.subtitle && (
              <p className="font-montserrat text-sm text-foreground/80 mt-1">{spell.subtitle}</p>
            )}
          </div>
        </div>
      )}

      {/* No image header */}
      {!imageBase64 && (
        <div className={`p-6 ${style.bgAccent} border-b border-border`}>
          <h1 className="font-italiana text-3xl md:text-4xl text-primary">{spell.title}</h1>
          {spell.subtitle && (
            <p className="font-montserrat text-sm text-muted-foreground mt-1">{spell.subtitle}</p>
          )}
        </div>
      )}

      <div className="p-6 md:p-8 space-y-8">
        {/* Archetype Attribution */}
        {archetype && (
          <div className="flex items-center gap-3 pb-4 border-b border-border">
            <span className="text-2xl">{archetype.id === 'shiggy' ? '🪶' : archetype.id === 'kathleen' ? '🦉' : archetype.id === 'catherine' ? '🐦' : '🪽'}</span>
            <div>
              <p className="font-cinzel text-sm text-secondary">Crafted by {archetype.name}</p>
              <p className="font-montserrat text-xs text-muted-foreground">{archetype.title}</p>
            </div>
          </div>
        )}

        {/* Introduction */}
        {spell.introduction && (
          <div className={`p-4 ${style.bgAccent} border-l-4 ${style.borderColor} rounded-r-sm`}>
            <p className="font-crimson text-base md:text-lg text-foreground italic leading-relaxed">
              {spell.introduction}
            </p>
          </div>
        )}

        {/* Timing */}
        {spell.timing && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <TimingCard icon={Moon} label="Moon Phase" value={spell.timing.moon_phase} />
            <TimingCard icon={Sun} label="Time" value={spell.timing.time_of_day} />
            <TimingCard icon={Calendar} label="Day" value={spell.timing.day} />
            <TimingCard icon={Clock} label="Note" value={spell.timing.note} small />
          </div>
        )}

        {/* Cathleen's Suggested Ward - Special feature for her spells */}
        {spell.suggested_ward && (
          <section className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-slate-800/30 via-slate-700/20 to-slate-800/30 rounded-lg" />
            <div className="relative p-6 border-2 border-secondary/40 rounded-lg bg-background/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-secondary/20 rounded-full">
                  <span className="text-3xl">{spell.suggested_ward.symbol || '🪶'}</span>
                </div>
                <div>
                  <p className="font-cinzel text-xs text-secondary/70 uppercase tracking-wider">Cathleen&apos;s Gift</p>
                  <h3 className="font-cinzel text-xl text-secondary">Your Ward: {spell.suggested_ward.name}</h3>
                </div>
              </div>
              
              <div className="space-y-4 font-montserrat text-sm">
                <div className="flex items-start gap-2">
                  <Heart className="w-4 h-4 text-secondary mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">What It Means</p>
                    <p className="text-foreground/90">{spell.suggested_ward.meaning}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <Eye className="w-4 h-4 text-secondary mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">How to Find It</p>
                    <p className="text-foreground/90">{spell.suggested_ward.how_to_find}</p>
                  </div>
                </div>
                
                {spell.suggested_ward.activation && (
                  <div className="flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-secondary mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Awakening Your Ward</p>
                      <p className="text-foreground/90">{spell.suggested_ward.activation}</p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-4 pt-4 border-t border-secondary/20">
                <p className="font-montserrat text-xs text-muted-foreground italic text-center">
                  &ldquo;Carry your ward close—a physical anchor for invisible magic.&rdquo; — Cathleen
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Cathleen's Concealment Suggestion - WWII Spy Tradecraft inspired */}
        {spell.concealment_suggestion && (
          <section className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/40 via-slate-800/30 to-slate-900/40 rounded-lg" />
            <div className="relative p-6 border-2 border-slate-600/40 rounded-lg bg-background/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-slate-700/30 rounded-full">
                  <Lock className="w-6 h-6 text-slate-300" />
                </div>
                <div>
                  <p className="font-cinzel text-xs text-slate-400 uppercase tracking-wider">Cathleen&apos;s Secret</p>
                  <h3 className="font-cinzel text-xl text-slate-200">{spell.concealment_suggestion.title || 'Keep Your Secrets Close'}</h3>
                </div>
              </div>
              
              <div className="space-y-4 font-montserrat text-sm">
                {/* Historical Inspiration */}
                {spell.concealment_suggestion.historical_inspiration && (
                  <div className="flex items-start gap-2">
                    <History className="w-4 h-4 text-slate-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">From the Secret History</p>
                      <p className="text-slate-300 italic">{spell.concealment_suggestion.historical_inspiration}</p>
                    </div>
                  </div>
                )}
                
                {/* Your Adaptation */}
                {spell.concealment_suggestion.your_adaptation && (
                  <div className="flex items-start gap-2">
                    <Key className="w-4 h-4 text-slate-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Your Hidden Place</p>
                      <p className="text-slate-300">{spell.concealment_suggestion.your_adaptation}</p>
                    </div>
                  </div>
                )}
                
                {/* Suggested Items */}
                {spell.concealment_suggestion.suggested_items && spell.concealment_suggestion.suggested_items.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {spell.concealment_suggestion.suggested_items.map((item, idx) => (
                      <span key={idx} className="px-3 py-1 bg-slate-700/50 text-slate-300 rounded-full text-xs">
                        {item}
                      </span>
                    ))}
                  </div>
                )}
                
                {/* Cathleen's Note */}
                {spell.concealment_suggestion.cathleen_note && (
                  <div className="mt-4 pt-4 border-t border-slate-600/30">
                    <p className="text-slate-400 italic text-center text-xs">
                      &ldquo;{spell.concealment_suggestion.cathleen_note}&rdquo;
                    </p>
                    <p className="text-slate-500 text-xs text-center mt-1">— Cathleen</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Materials */}
        {spell.materials && spell.materials.length > 0 && (
          <section>
            <h2 className="font-cinzel text-xl text-secondary mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Materials Needed
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {spell.materials.map((material, idx) => {
                const IconComponent = MATERIAL_ICONS[material.icon] || Circle;
                return (
                  <div 
                    key={idx}
                    className="flex items-start gap-3 p-3 bg-muted/20 border border-border rounded-sm"
                  >
                    <div className={`p-2 ${style.bgAccent} rounded-sm`}>
                      <IconComponent className={`w-5 h-5 ${style.accentColor}`} />
                    </div>
                    <div>
                      <p className="font-montserrat text-sm font-medium text-foreground">{material.name}</p>
                      {material.note && (
                        <p className="font-montserrat text-xs text-muted-foreground mt-0.5">{material.note}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Ritual Steps */}
        {spell.steps && spell.steps.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-cinzel text-xl text-secondary flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                The Ritual
              </h2>
              <button
                onClick={() => setChecklistMode(!checklistMode)}
                className={`px-3 py-1 rounded-sm text-xs font-montserrat tracking-wider transition-all ${
                  checklistMode 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted/30 text-muted-foreground hover:bg-muted/50'
                }`}
              >
                {checklistMode ? 'Checklist On' : 'Track Progress'}
              </button>
            </div>
            
            <div className="space-y-4">
              {spell.steps.map((step) => (
                <motion.div 
                  key={step.number}
                  className={`relative pl-12 pb-4 ${step.number < spell.steps.length ? 'border-l-2 border-border ml-4' : 'ml-4'}`}
                >
                  {/* Step number circle */}
                  <div 
                    className={`absolute left-0 -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center text-sm font-cinzel cursor-pointer transition-all ${
                      completedSteps.has(step.number)
                        ? 'bg-accent text-accent-foreground'
                        : `${style.bgAccent} ${style.accentColor} border-2 ${style.borderColor}`
                    }`}
                    onClick={() => checklistMode && toggleStep(step.number)}
                  >
                    {checklistMode && completedSteps.has(step.number) ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      step.number
                    )}
                  </div>
                  
                  <div className={`transition-opacity ${checklistMode && completedSteps.has(step.number) ? 'opacity-50' : ''}`}>
                    <h3 className="font-cinzel text-base text-secondary mb-1">{step.title}</h3>
                    <p className="font-montserrat text-sm text-foreground leading-relaxed">{step.instruction}</p>
                    {step.duration && (
                      <p className="font-montserrat text-xs text-muted-foreground mt-2 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {step.duration}
                      </p>
                    )}
                    {step.note && (
                      <p className="font-crimson text-xs text-accent italic mt-1">✦ {step.note}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Spoken Words */}
        {spell.spoken_words && (
          <section className={`p-6 ${style.bgAccent} border ${style.borderColor} rounded-sm`}>
            <h2 className="font-cinzel text-xl text-secondary mb-4 flex items-center gap-2">
              <Quote className="w-5 h-5" />
              Words of Power
            </h2>
            
            <div className="space-y-4">
              {spell.spoken_words.invocation && (
                <div>
                  <p className="font-montserrat text-xs text-muted-foreground uppercase tracking-wider mb-1">Opening Invocation</p>
                  <p className="font-crimson text-base text-foreground italic">&ldquo;{spell.spoken_words.invocation}&rdquo;</p>
                </div>
              )}
              
              {spell.spoken_words.main_incantation && (
                <div className="py-4 border-y border-border/50">
                  <p className="font-montserrat text-xs text-muted-foreground uppercase tracking-wider mb-2">Main Incantation</p>
                  <p className="font-crimson text-lg text-primary text-center leading-relaxed">
                    &ldquo;{spell.spoken_words.main_incantation}&rdquo;
                  </p>
                </div>
              )}
              
              {spell.spoken_words.closing && (
                <div>
                  <p className="font-montserrat text-xs text-muted-foreground uppercase tracking-wider mb-1">Closing Words</p>
                  <p className="font-crimson text-base text-foreground italic">&ldquo;{spell.spoken_words.closing}&rdquo;</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Historical Context (Collapsible) */}
        {spell.historical_context && (
          <section className="border border-border rounded-sm overflow-hidden">
            <button
              onClick={() => setShowHistoricalContext(!showHistoricalContext)}
              className="w-full p-4 flex items-center justify-between bg-muted/20 hover:bg-muted/30 transition-all"
            >
              <span className="font-cinzel text-base text-secondary flex items-center gap-2">
                <History className="w-5 h-5" />
                Historical Context & Sources
              </span>
              {showHistoricalContext ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
            
            <AnimatePresence>
              {showHistoricalContext && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 space-y-4 border-t border-border">
                    {spell.historical_context.tradition && (
                      <div>
                        <p className="font-montserrat text-xs text-muted-foreground uppercase tracking-wider">Tradition</p>
                        <p className="font-montserrat text-sm text-foreground">{spell.historical_context.tradition}</p>
                      </div>
                    )}
                    
                    {spell.historical_context.time_period && (
                      <div>
                        <p className="font-montserrat text-xs text-muted-foreground uppercase tracking-wider">Time Period</p>
                        <p className="font-montserrat text-sm text-foreground">{spell.historical_context.time_period}</p>
                      </div>
                    )}
                    
                    {spell.historical_context.practitioners && spell.historical_context.practitioners.length > 0 && (
                      <div>
                        <p className="font-montserrat text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                          <Users className="w-3 h-3" /> Historical Practitioners
                        </p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {spell.historical_context.practitioners.map((name, idx) => (
                            <span key={idx} className="px-2 py-1 bg-muted/30 rounded-sm text-xs font-montserrat">
                              {name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {spell.historical_context.sources && spell.historical_context.sources.length > 0 && (
                      <div>
                        <p className="font-montserrat text-xs text-muted-foreground uppercase tracking-wider mb-2">Sources & References</p>
                        <div className="space-y-2">
                          {spell.historical_context.sources.map((source, idx) => (
                            <div key={idx} className="p-3 bg-muted/20 rounded-sm">
                              <p className="font-montserrat text-sm text-foreground">
                                <strong>{source.author}</strong>, <em>{source.work}</em> ({source.year})
                              </p>
                              {source.relevance && (
                                <p className="font-montserrat text-xs text-muted-foreground mt-1">{source.relevance}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {spell.historical_context.cultural_notes && (
                      <div className="p-3 bg-accent/10 border-l-2 border-accent rounded-r-sm">
                        <p className="font-montserrat text-xs text-muted-foreground uppercase tracking-wider mb-1">Cultural Notes</p>
                        <p className="font-crimson text-sm text-foreground italic">{spell.historical_context.cultural_notes}</p>
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
            <h2 className="font-cinzel text-lg text-secondary mb-3">Variations & Adaptations</h2>
            <div className="space-y-2">
              {spell.variations.map((variation, idx) => (
                <div key={idx} className="p-3 bg-muted/20 rounded-sm">
                  <p className="font-montserrat text-sm font-medium text-foreground">{variation.name}</p>
                  <p className="font-montserrat text-xs text-muted-foreground">{variation.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Warnings */}
        {spell.warnings && spell.warnings.length > 0 && (
          <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-sm">
            <p className="font-montserrat text-xs text-destructive uppercase tracking-wider mb-2 flex items-center gap-1">
              <AlertTriangle className="w-4 h-4" /> Important Considerations
            </p>
            <ul className="space-y-1">
              {spell.warnings.map((warning, idx) => (
                <li key={idx} className="font-montserrat text-sm text-foreground">• {warning}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Closing Message */}
        {spell.closing_message && (
          <div className={`p-4 ${style.bgAccent} border-l-4 ${style.borderColor} rounded-r-sm`}>
            <p className="font-crimson text-base text-foreground italic">{spell.closing_message}</p>
          </div>
        )}

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

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 pt-4 border-t border-border">
          <button
            onClick={saveToGrimoire}
            disabled={isSaving}
            className="px-4 py-2 bg-accent text-accent-foreground hover:bg-accent/90 rounded-sm font-montserrat tracking-widest uppercase text-xs transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Save className={`w-4 h-4 ${isSaving ? 'animate-pulse' : ''}`} />
            {isSaving ? 'Saving...' : 'Save to Grimoire'}
          </button>
          <button
            onClick={copySpellToClipboard}
            className="px-4 py-2 bg-transparent text-primary border border-primary/30 rounded-sm font-montserrat tracking-widest uppercase text-xs hover:bg-primary/10 transition-all flex items-center gap-2"
          >
            <Copy className="w-4 h-4" />
            Copy Spell
          </button>
          <button
            onClick={downloadAsPdf}
            disabled={isGeneratingPdf}
            className="px-4 py-2 bg-transparent text-primary border border-primary/30 hover:bg-primary/10 rounded-sm font-montserrat tracking-widest uppercase text-xs transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Download className={`w-4 h-4 ${isGeneratingPdf ? 'animate-bounce' : ''}`} />
            {isGeneratingPdf ? 'Generating...' : 'Save as PDF'}
          </button>
          <button
            onClick={onNewSpell}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-sm font-montserrat tracking-widest uppercase text-xs hover:bg-primary/90 transition-all"
          >
            New Spell
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const TimingCard = ({ icon: Icon, label, value, small = false }) => (
  <div className="p-3 bg-muted/20 border border-border rounded-sm text-center">
    <Icon className="w-5 h-5 text-primary mx-auto mb-1" />
    <p className="font-montserrat text-xs text-muted-foreground uppercase tracking-wider">{label}</p>
    <p className={`font-cinzel ${small ? 'text-xs' : 'text-sm'} text-foreground`}>{value || 'Any'}</p>
  </div>
);
