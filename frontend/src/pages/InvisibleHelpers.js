import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronDown, Download, Copy, Check, Clock, Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import HandcraftedMagicModal from '../components/HandcraftedMagicModal';
import HandcraftedBanner from '../components/HandcraftedBanner';
import { BrandIcon } from '../components/BrandIcon';
import { 
  DarkSection, 
  LightSection, 
  GrandDivider, 
  ElaborateCorner,
  CornerFlourish,
  LightOrnateCard,
  BorderFrame,
  ATMOSPHERIC_IMAGES
} from '../components/OrnateElements';

const API_URL = process.env.REACT_APP_BACKEND_URL;

// Generic spell video for loading state - Silent Army video for magical workings
const SPELL_VIDEO_URL = '/videos/silent-army-spells.mp4';

// Brenda images for atmosphere
const BRENDA_IMAGE = '/images/personas/brenda.png';
const BRENDA_FAMILY_IMAGE = '/images/personas/brenda-family.png';

// ============================================================================
// FORM OPTIONS - ORIGINAL LABELS PRESERVED
// ============================================================================

const BENEFICIARIES_OPTIONS = [
  { id: 'community', label: 'My community / neighbors' },
  { id: 'vulnerable', label: 'Vulnerable people' },
  { id: 'journalists', label: 'Journalists / truth-tellers' },
  { id: 'legal', label: 'Legal advocates' },
  { id: 'families', label: 'Families / children' },
  { id: 'mutual_aid', label: 'Mutual aid networks' },
];

const QUALITY_OPTIONS = [
  { id: 'clarity', label: 'Clarity' },
  { id: 'restraint', label: 'Restraint' },
  { id: 'courage', label: 'Courage' },
  { id: 'protection', label: 'Protection' },
  { id: 'conscience', label: 'Conscience' },
  { id: 'truth', label: 'Truth' },
];

const PRACTICE_STYLE_OPTIONS = [
  { id: 'meditative', label: 'Quiet / secular' },
  { id: 'prayerful', label: 'Prayerful / devotional' },
  { id: 'folk', label: 'Folk / hearth magic' },
  { id: 'ceremonial', label: 'Ceremonial / formal' },
];

const TIME_HORIZON_OPTIONS = [
  { id: 'today', label: 'Today' },
  { id: 'week', label: 'This week' },
  { id: 'moon', label: 'This moon cycle' },
  { id: 'ongoing', label: 'Ongoing practice' },
];

const MAX_FREE_GENERATIONS = 3;

// ============================================================================
// CROWLANDS STYLED INPUT COMPONENTS
// ============================================================================

const CrowlandsInput = ({ value, onChange, placeholder, type = 'text', rows }) => {
  const baseClasses = "w-full bg-white border-2 border-gold/40 focus:border-crimson focus:ring-2 focus:ring-crimson/20 rounded-sm px-4 py-3 text-navy-dark font-crimson text-sm placeholder:text-navy-dark/40 transition-all";
  
  if (rows) {
    return (
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className={`${baseClasses} resize-none`}
        style={{ boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)' }}
      />
    );
  }
  
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={baseClasses}
      style={{ boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)' }}
    />
  );
};

const CrowlandsChip = ({ label, selected, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`relative px-4 py-2 rounded-sm font-montserrat text-sm transition-all border-2 ${
      selected
        ? 'bg-crimson/10 border-crimson text-crimson shadow-sm'
        : 'bg-white border-gold/30 text-navy-dark hover:border-gold/60 hover:bg-gold/5'
    }`}
    style={{ boxShadow: selected ? 'inset 0 1px 3px rgba(185, 78, 106, 0.1)' : 'none' }}
  >
    {label}
    {selected && <span className="absolute -top-1 -right-1 text-crimson text-xs">◆</span>}
  </button>
);

// Section Label with Crowlands styling
const SectionLabel = ({ title, context }) => (
  <div className="mb-2">
    <h3 className="font-cinzel text-sm text-crimson tracking-wide">{title}</h3>
    {context && (
      <p className="text-navy-dark/60 text-xs font-crimson italic mt-0.5">{context}</p>
    )}
  </div>
);

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const InvisibleHelpers = () => {
  const [showFullIntro, setShowFullIntro] = useState(false);
  const [showHandcraftedModal, setShowHandcraftedModal] = useState(false);
  const [formData, setFormData] = useState({
    personal_intention: '',
    beneficiaries: [],
    primary_quality: '',
    practice_style: '',
    time_horizon: '',
  });
  
  const [step, setStep] = useState('form');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generatedWorking, setGeneratedWorking] = useState(null);
  const [generationCount, setGenerationCount] = useState(0);
  const [copied, setCopied] = useState(false);
  const [remainingSpells, setRemainingSpells] = useState(3);
  
  const workingRef = useRef(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    // Clear any old checkout-related URL params
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('session_id') || urlParams.has('success')) {
      window.history.replaceState({}, '', window.location.pathname);
    }
    scrollToTop();
  }, []);

  useEffect(() => {
    scrollToTop();
  }, [step]);

  useEffect(() => {
    const count = parseInt(localStorage.getItem('ih_generation_count') || '0', 10);
    setGenerationCount(count);
  }, []);

  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleBeneficiary = (label) => {
    setFormData(prev => {
      const arr = prev.beneficiaries;
      if (arr.includes(label)) {
        return { ...prev, beneficiaries: arr.filter(v => v !== label) };
      } else {
        return { ...prev, beneficiaries: [...arr, label] };
      }
    });
  };

  const isFormValid = () => {
    return formData.beneficiaries.length > 0 &&
           formData.primary_quality &&
           formData.practice_style &&
           formData.time_horizon;
  };

  const handleContinueToEmail = () => {
    if (!isFormValid()) {
      toast.error('Please complete all required fields');
      return;
    }
    setStep('email');
  };

  // SIMPLIFIED: Single submit that captures lead AND generates spell
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email');
      return;
    }
    if (!name.trim()) {
      toast.error('Please enter your name');
      return;
    }

    // Go directly to generation - no checkout step
    setGenerating(true);
    setStep('result');
    
    try {
      // Use new simplified endpoint that captures lead AND generates
      const response = await fetch(`${API_URL}/api/invisible-helpers/capture-and-generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          name: name.trim(),
          personal_intention: formData.personal_intention || '',
          beneficiaries: formData.beneficiaries,
          primary_quality: formData.primary_quality,
          practice_style: formData.practice_style,
          time_horizon: formData.time_horizon,
          source: 'invisible_helpers'
        }),
      });
      
      const data = await response.json();
      
      if (data.success && data.working) {
        // Normalize guided_working if malformed
        const working = { ...data.working };
        if (working.guided_working && Array.isArray(working.guided_working)) {
          working.guided_working = working.guided_working.map((step, idx) => {
            if (typeof step === 'string') {
              return { step: idx + 1, title: `Step ${idx + 1}`, duration: '1-2 min', instructions: step, spoken_words: null };
            }
            return step;
          });
        }
        setGeneratedWorking(working);
        setGenerationCount(data.generation_count || 1);
        setRemainingSpells(data.remaining || 0);
        toast.success(`Your intention has materialized, ${name.split(' ')[0]}!`);
      } else if (data.limit_reached) {
        toast.info('You\'ve reached the free limit (3 spells). Join early access for unlimited!');
        setStep('form');
        // Could redirect to early-access here
      } else {
        toast.error(data.error || 'Failed to generate intention');
        setStep('form');
      }
    } catch (error) {
      console.error('Generation error:', error);
      toast.error('An error occurred. Please try again.');
      setStep('form');
    } finally {
      setGenerating(false);
    }
  };

  const handleCreateVariation = () => {
    setGeneratedWorking(null);
    setStep('form');
  };

  const handleCopyToClipboard = () => {
    if (!generatedWorking) return;
    const text = formatWorkingAsText(generatedWorking);
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const formatWorkingAsText = (working) => {
    let text = `MAGICAL BATTLE CRY INTENTION\nA Structured Intention for Protection & Clarity\n\n`;
    if (working.before_you_begin) {
      text += `BEFORE YOU BEGIN\n${working.before_you_begin}\n\n`;
    }
    text += `INTENTION\n${working.intention}\n\n`;
    text += `ANCHOR PHRASE\n${working.anchor_phrase}\n\n`;
    text += `ETHICAL FRAME\n${working.ethical_frame}\n\n`;
    text += `THE PRACTICE\n`;
    working.guided_working?.forEach(step => {
      text += `\n${step.step}. ${step.title} (${step.duration})\n`;
      text += `${step.instructions}\n`;
      if (step.spoken_words) {
        text += `\nSpoken: "${step.spoken_words}"\n`;
      }
    });
    text += `\nACTION PLEDGE\n${working.action_pledge}\n\n`;
    if (working.after_the_spell) {
      text += `AFTER THE SPELL\n${working.after_the_spell}\n\n`;
    }
    text += `---\n${working.closing_truth}`;
    return text;
  };

  const handleDownloadPDF = async () => {
    if (!workingRef.current || !generatedWorking) return;
    
    try {
      const canvas = await html2canvas(workingRef.current, {
        scale: 2,
        backgroundColor: '#F3EFE8',
        logging: false,
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      let imgY = 10;
      
      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save('magical-battle-cry-intention.pdf');
      toast.success('PDF downloaded');
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('Failed to generate PDF');
    }
  };

  const resetAll = () => {
    setFormData({
      personal_intention: '',
      beneficiaries: [],
      primary_quality: '',
      practice_style: '',
      time_horizon: '',
    });
    setEmail('');
    setName('');
    setGeneratedWorking(null);
    setStep('form');
  };

  // ============================================================================
  // LOADING OVERLAY - With video background
  // ============================================================================
  
  if (generating) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-navy-dark z-50 flex items-center justify-center overflow-hidden"
      >
        {/* Background video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-40"
          style={{ filter: 'saturate(0.7) contrast(1.1)' }}
        >
          <source src={SPELL_VIDEO_URL} type="video/mp4" />
        </video>
        
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-dark via-navy-dark/70 to-navy-dark/50" />
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(12, 29, 46, 0.8) 70%)'
        }} />
        
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
            <BrandIcon name="pentagram" size={80} opacity={0.9} style={{ filter: 'drop-shadow(0 0 20px rgba(200, 164, 77, 0.5))' }} />
          </motion.div>
          
          <h2 className="phantasmagoria-hero text-2xl sm:text-3xl text-gold mb-3" style={{ textShadow: '0 0 30px rgba(185, 78, 106, 0.5), 0 0 60px rgba(185, 78, 106, 0.3)' }}>
            Generating Your Intention
          </h2>
          
          <p className="font-crimson text-lg text-cream/80 mb-2">
            Crafting your intention...
          </p>
          
          <p className="text-silver-mist/60 text-sm font-montserrat">
            This may take a moment
          </p>
        </div>
      </motion.div>
    );
  }

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  return (
    <div className="min-h-screen bg-navy-dark" data-testid="invisible-helpers-page">
      
      {/* ================================================================ */}
      {/* CINEMATIC HERO HEADER */}
      {/* ================================================================ */}
      <DarkSection 
        className="py-10 sm:py-12 md:py-14 px-4 sm:px-6 relative overflow-hidden" 
        variant="warm"
      >
        {/* Brenda - The Chronicler - positioned left, faded into background */}
        <div 
          className="absolute left-0 bottom-0 w-[400px] h-[500px] opacity-[0.12] pointer-events-none hidden lg:block"
          style={{
            backgroundImage: `url(${BRENDA_IMAGE})`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'left bottom',
            mixBlendMode: 'luminosity',
            filter: 'sepia(30%) contrast(1.1)',
            maskImage: 'linear-gradient(to right, transparent 0%, black 30%, black 70%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 30%, black 70%, transparent 100%)'
          }}
        />
        
        {/* Family image - positioned right, faded into background */}
        <div 
          className="absolute right-0 top-0 w-[350px] h-[350px] opacity-[0.10] pointer-events-none hidden lg:block"
          style={{
            backgroundImage: `url(${BRENDA_FAMILY_IMAGE})`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right top',
            mixBlendMode: 'luminosity',
            filter: 'sepia(40%) contrast(1.05)',
            maskImage: 'linear-gradient(to left, transparent 0%, black 40%, black 60%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to left, transparent 0%, black 40%, black 60%, transparent 100%)'
          }}
        />
        
        {/* Corner flourishes */}
        <CornerFlourish position="top-left" className="absolute top-4 left-4 w-14 h-14 sm:w-18 sm:h-18" />
        <CornerFlourish position="top-right" className="absolute top-4 right-4 w-14 h-14 sm:w-18 sm:h-18" />
        
        {/* Protective circle background - subtle sigil */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] opacity-[0.06]">
          <svg viewBox="0 0 400 400" className="w-full h-full text-gold" fill="none" stroke="currentColor">
            <circle cx="200" cy="200" r="180" strokeWidth="1" />
            <circle cx="200" cy="200" r="150" strokeWidth="0.5" strokeDasharray="8 4" />
            <circle cx="200" cy="200" r="100" strokeWidth="0.5" />
            <line x1="200" y1="20" x2="200" y2="60" strokeWidth="1" />
            <line x1="200" y1="340" x2="200" y2="380" strokeWidth="1" />
            <line x1="20" y1="200" x2="60" y2="200" strokeWidth="1" />
            <line x1="340" y1="200" x2="380" y2="200" strokeWidth="1" />
          </svg>
        </div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <BrandIcon name="pentagram" size={56} variant="pink" opacity={0.95} />
            </div>
            
            {/* Main title - phantasmagoria font */}
            <h1 className="phantasmagoria-hero text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-gold-light mb-3"
              style={{ textShadow: '0 0 40px rgba(185, 78, 106, 0.5), 0 0 80px rgba(185, 78, 106, 0.3)' }}>
              Magical Battle Cry Intention
            </h1>
            
            {/* Subtitle */}
            <p className="font-crimson text-sm sm:text-base text-silver-mist/80 italic"
              style={{ textShadow: '0 0 20px rgba(185, 78, 106, 0.35)' }}>
              A Structured Intention for Protection & Clarity
            </p>
          </div>
        </div>
        
        {/* Grand divider - threshold */}
        <GrandDivider variant="eye" />
      </DarkSection>

      {/* ================================================================ */}
      {/* INTRO SECTION - Only on form step */}
      {/* ================================================================ */}
      {step === 'form' && (
        <LightSection 
          className="py-4 sm:py-5 px-4 sm:px-6"
        >
          <div className="max-w-3xl mx-auto">
            <LightOrnateCard hover={false}>
              {/* Always visible intro - ORIGINAL COPY */}
              <div className="prose prose-slate max-w-none text-sm">
                <p className="text-navy-dark/90 leading-relaxed mb-3 font-crimson">
                  In times of uncertainty, people have always gathered—not just to act, but to 
                  <span className="text-navy-dark font-medium"> steady themselves before acting</span>. During 
                  World War II, groups practiced coordinated meditation for protection and clarity. 
                  In the 1960s, activists paired inner work with outer resistance. Today, from 
                  <span className="text-crimson"> &quot;Etsy witches&quot;</span> making headlines 
                  to artists weaving meaning into protest, people are rediscovering an old truth.
                </p>
                
                <p className="text-navy-dark/70 leading-relaxed mb-3 font-crimson">
                  <span className="text-navy-dark">When the world feels like it&apos;s burning, 
                  steadying the inner field matters.</span> Not as a replacement for action—never 
                  that—but as a companion to it. Focused intention, done with clean hands and a 
                  clear heart, can be part of how we show up.
                </p>

                <p className="text-navy-dark/70 leading-relaxed font-crimson">
                  This portal draws inspiration from <span className="text-crimson">Dion Fortune&apos;s</span> wartime 
                  spiritual work and the long tradition of ethical, protective practice. What you&apos;ll 
                  create here is a <span className="text-navy-dark font-medium">structured intention</span> that 
                  returns misused power to natural law, strengthens those who protect, and steadies 
                  your own resolve. No curses. No targets. Just clarity, protection, and lawful return.
                </p>
              </div>

              {/* Expandable section */}
              <AnimatePresence>
                {showFullIntro && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden border-t border-gold/30 mt-6 pt-6"
                  >
                    <div className="prose prose-slate max-w-none text-sm">
                      <h3 className="font-cinzel text-crimson text-base mb-3">About Where The Crowlands</h3>
                      <p className="text-navy-dark/70 leading-relaxed mb-4 font-crimson">
                        We&apos;re building <span className="text-navy-dark font-medium">Where The Crowlands</span> as 
                        a portal to a world where magic is practical, ethical, and a little bit fun. A place 
                        where AI-guided rituals meet family folklore, where you can explore the history of 
                        magical practice while crafting your own. Think of it as your digital grimoire—part 
                        library, part workshop, part community.
                      </p>

                      <h3 className="font-cinzel text-crimson text-base mb-3">Guiding Principles</h3>
                      <p className="text-navy-dark/70 leading-relaxed mb-3 font-crimson">
                        Ethical magical work across traditions shares common principles:
                      </p>
                      <ul className="text-navy-dark/70 space-y-2 mb-4 font-crimson">
                        <li><span className="text-navy-dark">Language directs force</span> — vague or emotional wording causes rebound</li>
                        <li><span className="text-navy-dark">Work that violates free will rebounds</span> — we redirect, never strike</li>
                        <li><span className="text-navy-dark">Justice belongs to impersonal law</span> — not personal vengeance</li>
                        <li><span className="text-navy-dark">Defense and protection over aggression</span> — always</li>
                      </ul>

                      <h3 className="font-cinzel text-crimson text-base mb-3">What This Intention Does</h3>
                      <p className="text-navy-dark/70 leading-relaxed mb-4 font-crimson">
                        This is a <span className="text-navy-dark font-medium">Neutralizing Return to Source via Higher Law</span>. 
                        It doesn&apos;t curse. It doesn&apos;t attack. It returns misused power—distortion, 
                        coercion, dehumanization—to the impersonal law that governs consequence. Think of it 
                        as redirecting energy back to where it came from, transmuted into accountability 
                        rather than harm.
                      </p>
                      
                      <p className="text-navy-dark/70 leading-relaxed mb-4 font-crimson">
                        The goal is <span className="text-crimson">disruption, not destruction</span>. 
                        A little sand in the gears of cruelty. But always with clean hands, always paired 
                        with real-world action, and always remembering that the goal is protection and 
                        clarity—not revenge.
                      </p>

                      <BorderFrame variant="crimson" className="bg-crimson/5">
                        <p className="text-crimson/80 text-sm italic m-0 font-crimson">
                          &quot;Inner work does not replace resistance. It steadies those who resist.&quot;
                        </p>
                      </BorderFrame>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <button
                onClick={() => setShowFullIntro(!showFullIntro)}
                className="w-full py-3 mt-4 border-t border-gold/30 text-crimson hover:text-crimson-bright text-xs flex items-center justify-center gap-2 transition-colors font-montserrat"
              >
                <span>{showFullIntro ? 'Show less' : 'Read more about this intention...'}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showFullIntro ? 'rotate-180' : ''}`} />
              </button>
            </LightOrnateCard>
          </div>
        </LightSection>
      )}

      {/* ================================================================ */}
      {/* MAIN CONTENT ON PARCHMENT */}
      {/* ================================================================ */}
      <LightSection 
        className="py-4 sm:py-6 px-4 sm:px-6"
        atmosphericImage={ATMOSPHERIC_IMAGES.maiden}
        atmosphericOpacity={0.10}
        atmosphericPosition="right center"
        atmosphericTint="sepia"
      >
        <div className="max-w-2xl mx-auto">
          
          <AnimatePresence mode="wait">
            {/* FORM STEP */}
            {step === 'form' && (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <LightOrnateCard hover={false}>
                  {/* Handcrafted Magic Banner - Top of Form */}
                  <HandcraftedBanner onClick={() => setShowHandcraftedModal(true)} />
                  
                  <div className="space-y-4">
                    
                    {/* Personal Intention - ORIGINAL COPY */}
                    <div>
                      <SectionLabel 
                        title="What is your intention?"
                        context="Write a few lines about what you're seeking protection from, or clarity about. This is for you."
                      />
                      <CrowlandsInput
                        value={formData.personal_intention}
                        onChange={(e) => handleFormChange('personal_intention', e.target.value)}
                        placeholder="In my own words, I seek..."
                        rows={3}
                      />
                    </div>

                    {/* Beneficiaries - ORIGINAL COPY */}
                    <div>
                      <SectionLabel 
                        title="Who are you protecting?"
                        context="The heart of this intention is shielding those in harm's way. Visualize protection around them, not attack on anyone."
                      />
                      <div className="flex flex-wrap gap-2">
                        {BENEFICIARIES_OPTIONS.map(opt => (
                          <CrowlandsChip
                            key={opt.id}
                            label={opt.label}
                            selected={formData.beneficiaries.includes(opt.label)}
                            onClick={() => toggleBeneficiary(opt.label)}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Primary Quality - ORIGINAL COPY */}
                    <div>
                      <SectionLabel 
                        title="Quality to strengthen"
                        context="What energy do you want to amplify? Focused visualization on positive qualities creates a 'seed idea' that spreads outward."
                      />
                      <div className="flex flex-wrap gap-2">
                        {QUALITY_OPTIONS.map(opt => (
                          <CrowlandsChip
                            key={opt.id}
                            label={opt.label}
                            selected={formData.primary_quality === opt.label}
                            onClick={() => handleFormChange('primary_quality', opt.label)}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Practice Style - ORIGINAL COPY */}
                    <div>
                      <SectionLabel 
                        title="Practice language"
                        context="How do you prefer your spiritual language? We'll match the tone accordingly."
                      />
                      <div className="flex flex-wrap gap-2">
                        {PRACTICE_STYLE_OPTIONS.map(opt => (
                          <CrowlandsChip
                            key={opt.id}
                            label={opt.label}
                            selected={formData.practice_style === opt.label}
                            onClick={() => handleFormChange('practice_style', opt.label)}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Time Horizon - ORIGINAL COPY */}
                    <div>
                      <SectionLabel 
                        title="Time horizon"
                        context="Synchronized, regular practice builds coherence. Picking a specific time helps anchor the intention in your life."
                      />
                      <div className="flex flex-wrap gap-2">
                        {TIME_HORIZON_OPTIONS.map(opt => (
                          <CrowlandsChip
                            key={opt.id}
                            label={opt.label}
                            selected={formData.time_horizon === opt.label}
                            onClick={() => handleFormChange('time_horizon', opt.label)}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Commitment - ORIGINAL COPY */}
                    <BorderFrame variant="gold" className="bg-gold/5">
                      <h3 className="font-cinzel text-sm text-crimson mb-2">Your commitment to the material world</h3>
                      <p className="text-navy-dark/80 text-sm font-crimson">
                        By creating this intention, I understand that spellwork and storytelling are conduits to support real action. 
                        I commit to channeling this intention toward benevolent outcomes and peace.
                      </p>
                    </BorderFrame>

                    {/* Continue Button */}
                    <button
                      onClick={handleContinueToEmail}
                      disabled={!isFormValid()}
                      className={`w-full py-4 font-cinzel text-sm tracking-wider uppercase transition-all flex items-center justify-center gap-2 ${
                        isFormValid()
                          ? 'bg-crimson hover:bg-crimson-bright text-cream'
                          : 'bg-navy-mid/20 text-navy-dark/40 cursor-not-allowed'
                      }`}
                      data-testid="continue-to-checkout-btn"
                    >
                      Continue
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    
                  </div>
                </LightOrnateCard>
              </motion.div>
            )}

            {/* EMAIL STEP - Simplified: Just name + email, then generate */}
            {step === 'email' && (
              <motion.div
                key="email"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <LightOrnateCard hover={false}>
                  <button onClick={() => setStep('form')} className="text-crimson hover:text-crimson-bright text-sm mb-6 font-montserrat">
                    ← Back to form
                  </button>
                  
                  <div className="text-center mb-8">
                    <BrandIcon name="star" size={44} variant="pink" opacity={0.9} className="mx-auto mb-4" />
                    <h2 className="phantasmagoria-hero text-2xl text-crimson mb-2">Almost There...</h2>
                    <p className="text-navy-dark/70 text-sm font-crimson">
                      Enter your name and email to receive your personalized intention.
                    </p>
                  </div>
                  
                  <form onSubmit={handleEmailSubmit} className="space-y-4 max-w-md mx-auto">
                    <CrowlandsInput
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name (or magical alias)"
                      data-testid="name-input"
                    />
                    <CrowlandsInput
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      data-testid="email-input"
                    />
                    <button
                      type="submit"
                      disabled={!email || !name.trim()}
                      className={`w-full py-4 font-cinzel text-sm tracking-wider uppercase transition-all flex items-center justify-center gap-2 ${
                        email && name.trim()
                          ? 'bg-crimson hover:bg-crimson-bright text-cream'
                          : 'bg-navy-mid/20 text-navy-dark/40 cursor-not-allowed'
                      }`}
                      data-testid="email-submit-btn"
                    >
                      <Sparkles className="w-4 h-4" />
                      Unleash My Intention
                    </button>
                    <p className="text-navy-dark/50 text-xs text-center font-montserrat">
                      You can generate up to 3 free intentions. Your spell will appear on screen and you can download as PDF.
                    </p>
                  </form>
                </LightOrnateCard>
              </motion.div>
            )}

            {/* RESULT STEP */}
            {step === 'result' && generatedWorking && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Welcome message with name */}
                {name && (
                  <div className="text-center mb-4">
                    <p className="text-crimson font-crimson text-lg">
                      {name.split(' ')[0]}, your intention has materialized...
                    </p>
                    <p className="text-navy-dark/60 text-sm font-montserrat">
                      {remainingSpells > 0 ? `You have ${remainingSpells} free ${remainingSpells === 1 ? 'spell' : 'spells'} remaining` : 'This was your last free spell'}
                    </p>
                  </div>
                )}
                
                {/* Action buttons */}
                <div className="flex flex-wrap gap-2 justify-between items-center">
                  <button
                    onClick={handleCreateVariation}
                    className="px-4 py-2 border border-crimson/50 text-crimson hover:bg-crimson/10 font-montserrat text-sm transition-colors"
                  >
                    Create Another
                  </button>
                  <div className="flex gap-2">
                    <button
                      onClick={handleCopyToClipboard}
                      className="flex items-center gap-2 px-3 py-2 border border-navy-dark/30 text-navy-dark hover:bg-navy-dark/5 text-xs transition-colors font-montserrat"
                      data-testid="copy-working-btn"
                    >
                      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      {copied ? 'Copied' : 'Copy'}
                    </button>
                    <button
                      onClick={handleDownloadPDF}
                      className="flex items-center gap-2 px-3 py-2 bg-crimson hover:bg-crimson-bright text-cream text-xs transition-colors font-montserrat"
                      data-testid="download-pdf-btn"
                    >
                      <Download className="w-3 h-3" />
                      PDF
                    </button>
                  </div>
                </div>

                {/* TALISMAN FRAMED OUTPUT */}
                <div className="relative">
                  {/* Outer border */}
                  <div className="absolute inset-0 border-2 border-gold/60 rounded-sm" />
                  {/* Inner border */}
                  <div className="absolute inset-3 border border-crimson/30 rounded-sm" />
                  
                  {/* Corner marks */}
                  <span className="absolute -top-2 -left-2 text-gold text-xl">✦</span>
                  <span className="absolute -top-2 -right-2 text-gold text-xl">✦</span>
                  <span className="absolute -bottom-2 -left-2 text-gold text-xl">✦</span>
                  <span className="absolute -bottom-2 -right-2 text-gold text-xl">✦</span>
                  
                  {/* Lattice watermark */}
                  <div className="absolute inset-6 opacity-[0.03]" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0,20 L40,20 M20,0 L20,40' stroke='%23d4a84b' stroke-width='0.5' fill='none'/%3E%3Ccircle cx='20' cy='20' r='2' fill='%23d4a84b'/%3E%3C/svg%3E")`,
                  }} />
                  
                  <div 
                    ref={workingRef}
                    className="relative z-10 bg-cream/95 p-4 sm:p-6 space-y-3"
                  >
                    {/* Header */}
                    <div className="text-center border-b border-gold/30 pb-3">
                      <h2 className="phantasmagoria-hero text-xl sm:text-2xl text-crimson">Magical Battle Cry Intention</h2>
                      <p className="text-navy-dark/60 text-xs italic font-crimson mt-1">A Structured Intention for Protection & Clarity</p>
                    </div>

                    {/* Before You Begin - Optional wrapper section */}
                    {generatedWorking.before_you_begin && (
                      <div className="bg-navy-dark/5 border-l-2 border-navy-dark/30 p-3">
                        <h3 className="font-cinzel text-xs text-navy-dark/70 tracking-wider uppercase mb-1">Before You Begin</h3>
                        <p className="text-navy-dark/70 font-crimson text-sm italic">{generatedWorking.before_you_begin}</p>
                      </div>
                    )}

                    {/* Intention */}
                    <div>
                      <h3 className="font-cinzel text-xs text-gold tracking-wider uppercase mb-1">Intention</h3>
                      <p className="text-navy-dark font-crimson italic">{generatedWorking.intention}</p>
                    </div>

                    {/* Anchor Phrase */}
                    <div className="bg-gold/5 border-l-4 border-gold p-3">
                      <h3 className="font-cinzel text-xs text-gold tracking-wider uppercase mb-1">Anchor Phrase</h3>
                      <p className="text-navy-dark font-crimson italic whitespace-pre-line">{generatedWorking.anchor_phrase}</p>
                    </div>

                    {/* Ethical Frame */}
                    <BorderFrame variant="crimson" className="bg-crimson/5">
                      <h3 className="font-cinzel text-xs text-crimson tracking-wider uppercase mb-1">Ethical Frame</h3>
                      <p className="text-navy-dark/80 font-crimson text-sm whitespace-pre-line">{generatedWorking.ethical_frame}</p>
                    </BorderFrame>

                    {/* The Practice */}
                    <div>
                      <h3 className="font-cinzel text-xs text-gold tracking-wider uppercase mb-2">The Practice</h3>
                      <div className="space-y-3">
                        {generatedWorking.guided_working?.map((stepItem, idx) => (
                          <div key={idx} className="relative pl-6 border-l-2 border-crimson/30">
                            <div className="absolute left-0 top-0 -translate-x-1/2 w-3 h-3 rounded-full bg-crimson/20 border border-crimson flex items-center justify-center">
                              <span className="text-crimson text-[8px] font-bold">{stepItem.step}</span>
                            </div>
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="text-navy-dark font-cinzel text-xs font-semibold">{stepItem.title}</span>
                              <span className="text-navy-dark/40 text-xs flex items-center gap-1 font-montserrat">
                                <Clock className="w-3 h-3" />
                                {stepItem.duration}
                              </span>
                            </div>
                            <p className="text-navy-dark/70 font-crimson text-sm">{stepItem.instructions}</p>
                            {stepItem.spoken_words && (
                              <p className="mt-1 text-crimson italic text-sm font-crimson border-l-2 border-gold/30 pl-2">
                                &quot;{stepItem.spoken_words}&quot;
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Pledge */}
                    <div className="border-t border-gold/30 pt-3">
                      <h3 className="font-cinzel text-xs text-gold tracking-wider uppercase mb-1">Action Pledge</h3>
                      <p className="text-navy-dark font-crimson text-sm">{generatedWorking.action_pledge}</p>
                    </div>

                    {/* After the Spell - Optional wrapper section */}
                    {generatedWorking.after_the_spell && (
                      <div className="bg-navy-dark/5 border-l-2 border-navy-dark/30 p-3">
                        <h3 className="font-cinzel text-xs text-navy-dark/70 tracking-wider uppercase mb-1">After the Spell</h3>
                        <p className="text-navy-dark/70 font-crimson text-sm italic">{generatedWorking.after_the_spell}</p>
                      </div>
                    )}

                    {/* Closing */}
                    <div className="text-center pt-2">
                      <p className="text-navy-dark/60 italic font-crimson text-sm">{generatedWorking.closing_truth}</p>
                    </div>
                  </div>
                </div>

                {/* Generation count */}
                {generationCount > 0 && (
                  <p className="text-center text-navy-dark/50 text-xs font-montserrat">
                    Intentions created: {generationCount}/{MAX_FREE_GENERATIONS} · 
                    <button onClick={resetAll} className="text-crimson hover:text-crimson-bright ml-1 underline">
                      Join early access for unlimited intentions
                    </button>
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
          
        </div>
      </LightSection>

      {/* ================================================================ */}
      {/* FOOTER WITH ATMOSPHERIC IMAGERY */}
      {/* ================================================================ */}
      <DarkSection className="py-8 px-4 relative overflow-hidden">
        {/* Subtle Brenda presence in footer - very faded */}
        <div 
          className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[600px] h-[200px] opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage: `url(${BRENDA_FAMILY_IMAGE})`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center bottom',
            mixBlendMode: 'luminosity',
            filter: 'sepia(50%)',
            maskImage: 'radial-gradient(ellipse at center bottom, black 0%, transparent 70%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center bottom, black 0%, transparent 70%)'
          }}
        />
        
        <div className="max-w-xl mx-auto text-center relative z-10">
          <p className="font-crimson text-base text-silver-mist/80 italic">
            Inner work does not replace resistance.
          </p>
          <p className="font-crimson text-lg text-gold mt-1">
            It steadies those who resist.
          </p>
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

export default InvisibleHelpers;
