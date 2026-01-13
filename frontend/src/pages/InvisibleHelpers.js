import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Sparkles, ChevronRight, ChevronDown, Download, Copy, Check, Clock, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { 
  DarkSection, 
  LightSection, 
  GrandDivider, 
  MysticalDivider,
  ElaborateCorner,
  CornerFlourish,
  LightOrnateCard,
  BorderFrame
} from '../components/OrnateElements';

const API_URL = process.env.REACT_APP_BACKEND_URL;

// Generic spell video for loading state
const SPELL_VIDEO_URL = 'https://customer-assets.emergentagent.com/job_mystic-grimoire-1/artifacts/sl3euh2k_GenericSpellWaitingVid.MOV';

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
    style={{ boxShadow: selected ? 'inset 0 1px 3px rgba(184, 35, 48, 0.1)' : 'none' }}
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
  const [formData, setFormData] = useState({
    personal_intention: '',
    beneficiaries: [],
    primary_quality: '',
    practice_style: '',
    time_horizon: '',
  });
  
  const [step, setStep] = useState('form');
  const [email, setEmail] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generatedWorking, setGeneratedWorking] = useState(null);
  const [generationCount, setGenerationCount] = useState(0);
  const [copied, setCopied] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  
  const workingRef = useRef(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');
    const success = urlParams.get('success');
    const storedEmail = localStorage.getItem('ih_pending_email');
    const storedForm = localStorage.getItem('ih_pending_form');
    
    if (success === 'true' && sessionId && storedEmail && storedForm) {
      setEmail(storedEmail);
      setFormData(JSON.parse(storedForm));
      setStep('result');
      window.history.replaceState({}, '', window.location.pathname);
      handleGenerateAfterCheckout(storedEmail, JSON.parse(storedForm));
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
    localStorage.setItem('ih_pending_form', JSON.stringify(formData));
    setStep('email');
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email');
      return;
    }

    try {
      const countRes = await fetch(`${API_URL}/api/invisible-helpers/check-limit?email=${encodeURIComponent(email)}`);
      const countData = await countRes.json();
      
      if (countData.limit_reached) {
        toast.info('You\'ve reached the guest limit. Join early access to continue.');
        window.location.href = '/early-access';
        return;
      }
      
      setGenerationCount(countData.count || 0);
    } catch (error) {
      console.error('Count check error:', error);
    }

    localStorage.setItem('ih_pending_email', email);
    setStep('checkout');
  };

  const handleCheckout = async (amount = 0) => {
    setCheckingOut(true);
    try {
      const response = await fetch(`${API_URL}/api/invisible-helpers/create-checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          amount,
          success_url: `${window.location.origin}/invisible-helpers?success=true&session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${window.location.origin}/invisible-helpers`,
        }),
      });
      
      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else if (data.skip_checkout) {
        handleGenerateAfterCheckout(email, formData);
      } else {
        toast.error('Failed to create checkout session');
        setCheckingOut(false);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Checkout failed. Please try again.');
      setCheckingOut(false);
    }
  };

  const handleGenerateAfterCheckout = async (userEmail, form) => {
    setGenerating(true);
    setStep('result');
    
    try {
      const response = await fetch(`${API_URL}/api/invisible-helpers/battle-cry/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail,
          personal_intention: form.personal_intention || '',
          beneficiaries: form.beneficiaries,
          primary_quality: form.primary_quality,
          practice_style: form.practice_style,
          time_horizon: form.time_horizon,
          action_pledge: 'Benevolent outcomes and peace',
        }),
      });
      
      const data = await response.json();
      
      if (data.success && data.working) {
        setGeneratedWorking(data.working);
        setGenerationCount(data.generation_count || generationCount + 1);
        localStorage.setItem('ih_generation_count', String(data.generation_count || generationCount + 1));
        toast.success('Your intention has been generated!');
        localStorage.removeItem('ih_pending_email');
        localStorage.removeItem('ih_pending_form');
      } else if (data.limit_reached) {
        toast.info('You\'ve reached the guest limit.');
        window.location.href = '/early-access';
      } else {
        toast.error(data.error || 'Failed to generate intention');
      }
    } catch (error) {
      console.error('Generation error:', error);
      toast.error('An error occurred. Please try again.');
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
    text += `---\n${working.closing_truth}`;
    return text;
  };

  const handleDownloadPDF = async () => {
    if (!workingRef.current || !generatedWorking) return;
    
    try {
      const canvas = await html2canvas(workingRef.current, {
        scale: 2,
        backgroundColor: '#f5f0e6',
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
          <source src={SPELL_VIDEO_URL} type="video/quicktime" />
        </video>
        
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-dark via-navy-dark/70 to-navy-dark/50" />
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(14, 22, 41, 0.8) 70%)'
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
            <Shield className="w-full h-full text-gold p-4" style={{ filter: 'drop-shadow(0 0 20px rgba(212, 168, 75, 0.5))' }} />
          </motion.div>
          
          <h2 className="phantasmagoria-hero text-2xl sm:text-3xl text-gold mb-3" style={{ textShadow: '0 2px 20px rgba(212, 168, 75, 0.4)' }}>
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
      <DarkSection className="py-12 sm:py-16 md:py-20 px-4 sm:px-6" variant="warm">
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
            <Shield className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-4 text-crimson-bright"
              style={{ filter: 'drop-shadow(0 0 15px rgba(184, 35, 48, 0.5))' }} />
            
            {/* Main title - phantasmagoria font */}
            <h1 className="phantasmagoria-hero text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-gold-light mb-3"
              style={{ textShadow: '0 2px 30px rgba(212, 168, 75, 0.5)' }}>
              Magical Battle Cry Intention
            </h1>
            
            {/* Subtitle */}
            <p className="font-crimson text-sm sm:text-base text-silver-mist/80 italic">
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
        <LightSection className="py-4 sm:py-5 px-4 sm:px-6">
          <div className="max-w-3xl mx-auto">
            <LightOrnateCard hover={false}>
              {/* Always visible intro - ORIGINAL COPY */}
              <div className="prose prose-slate max-w-none text-sm">
                <p className="text-navy-dark/90 leading-relaxed mb-4 font-crimson">
                  In times of uncertainty, people have always gathered—not just to act, but to 
                  <span className="text-navy-dark font-medium"> steady themselves before acting</span>. During 
                  World War II, groups practiced coordinated meditation for protection and clarity. 
                  In the 1960s, activists paired inner work with outer resistance. Today, from 
                  <span className="text-crimson"> "Etsy witches"</span> making headlines 
                  to artists weaving meaning into protest, people are rediscovering an old truth.
                </p>
                
                <p className="text-navy-dark/70 leading-relaxed mb-4 font-crimson">
                  <span className="text-navy-dark">When the world feels like it's burning, 
                  steadying the inner field matters.</span> Not as a replacement for action—never 
                  that—but as a companion to it. Focused intention, done with clean hands and a 
                  clear heart, can be part of how we show up.
                </p>

                <p className="text-navy-dark/70 leading-relaxed font-crimson">
                  This portal draws inspiration from <span className="text-crimson">Dion Fortune's</span> wartime 
                  spiritual work and the long tradition of ethical, protective practice. What you'll 
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
                        We're building <span className="text-navy-dark font-medium">Where The Crowlands</span> as 
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
                        It doesn't curse. It doesn't attack. It returns misused power—distortion, 
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
                          "Inner work does not replace resistance. It steadies those who resist."
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
      <LightSection className="py-8 sm:py-12 px-4 sm:px-6">
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

                    <MysticalDivider light />

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

                    <MysticalDivider light variant="moon" />

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

                    <MysticalDivider light />

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

            {/* EMAIL STEP */}
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
                    <Sparkles className="w-10 h-10 mx-auto mb-4 text-crimson" />
                    <h2 className="phantasmagoria-hero text-2xl text-crimson mb-2">Receive Your Intention & Join the Chaos</h2>
                    <p className="text-navy-dark/70 text-sm font-crimson">
                      Enter your email to receive your intention and a PDF for offline use.
                    </p>
                  </div>
                  
                  <form onSubmit={handleEmailSubmit} className="space-y-4 max-w-md mx-auto">
                    <CrowlandsInput
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                    />
                    <button
                      type="submit"
                      className="w-full py-3 bg-crimson hover:bg-crimson-bright text-cream font-cinzel text-sm tracking-wider uppercase transition-colors flex items-center justify-center gap-2"
                      data-testid="email-submit-btn"
                    >
                      Continue
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <p className="text-navy-dark/50 text-xs text-center font-montserrat">
                      You can generate up to 3 intentions as a guest. Join early access for unlimited.
                    </p>
                  </form>
                </LightOrnateCard>
              </motion.div>
            )}

            {/* CHECKOUT STEP */}
            {step === 'checkout' && (
              <motion.div
                key="checkout"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <LightOrnateCard hover={false}>
                  <button onClick={() => setStep('email')} className="text-crimson hover:text-crimson-bright text-sm mb-6 font-montserrat" disabled={checkingOut}>
                    ← Back
                  </button>
                  
                  <div className="text-center mb-6">
                    <Sparkles className="w-10 h-10 mx-auto mb-4 text-crimson" />
                    <h2 className="phantasmagoria-hero text-2xl text-crimson mb-4">Support This Work</h2>
                    
                    {/* ORIGINAL COPY */}
                    <div className="text-navy-dark/80 text-sm font-crimson space-y-3 text-left max-w-md mx-auto">
                      <p>
                        This portal is offered freely. If you're able, consider a pay-what-you-choose contribution.
                      </p>
                      <p>
                        Each spell costs the witchy woman behind the veil approximately <span className="text-crimson font-semibold">$0.02–0.05</span> in 
                        AI generation costs, and she's building this whole thing as we speak.
                      </p>
                      <p className="text-navy-dark/60">
                        Please continue to your spell with or without a donation!
                      </p>
                    </div>
                    
                    <p className="text-crimson text-xs mt-4 italic font-crimson">
                      So it is, love only, war is TAMAM SHUD
                    </p>
                  </div>
                  
                  <div className="space-y-3 max-w-md mx-auto">
                    {/* Free button */}
                    <button
                      onClick={() => handleCheckout(0)}
                      disabled={checkingOut}
                      className="w-full py-3 bg-crimson/10 hover:bg-crimson/20 border-2 border-crimson text-crimson font-cinzel text-sm tracking-wider transition-colors disabled:opacity-50"
                      data-testid="checkout-free-btn"
                    >
                      {checkingOut ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : '✦ Continue Free — No Judgement ✦'}
                    </button>
                    
                    <p className="text-navy-dark/40 text-xs text-center font-montserrat">— or support the work —</p>
                    
                    <div className="grid grid-cols-3 gap-2">
                      {[500, 1000, 2500].map(amount => (
                        <button
                          key={amount}
                          onClick={() => handleCheckout(amount)}
                          disabled={checkingOut}
                          className="py-3 bg-gold/10 hover:bg-gold/20 border border-gold/50 text-navy-dark font-montserrat text-sm transition-colors disabled:opacity-50"
                        >
                          ${amount / 100}
                        </button>
                      ))}
                    </div>
                    
                    <button
                      onClick={() => {
                        const custom = prompt('Enter amount in dollars (e.g., 20):');
                        if (custom && !isNaN(parseFloat(custom))) {
                          handleCheckout(Math.round(parseFloat(custom) * 100));
                        }
                      }}
                      disabled={checkingOut}
                      className="w-full py-2 text-navy-dark/50 hover:text-navy-dark/70 text-xs transition-colors disabled:opacity-50 font-montserrat"
                    >
                      Other amount...
                    </button>
                  </div>
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
                    className="relative z-10 bg-cream/95 p-6 sm:p-8 space-y-6"
                  >
                    {/* Header */}
                    <div className="text-center border-b-2 border-gold/30 pb-4">
                      <h2 className="phantasmagoria-hero text-xl sm:text-2xl text-crimson">Magical Battle Cry Intention</h2>
                      <p className="text-navy-dark/60 text-xs italic font-crimson mt-1">A Structured Intention for Protection & Clarity</p>
                    </div>

                    {/* Intention */}
                    <div>
                      <h3 className="font-cinzel text-xs text-gold tracking-wider uppercase mb-2">Intention</h3>
                      <p className="text-navy-dark font-crimson italic">{generatedWorking.intention}</p>
                    </div>

                    <MysticalDivider light variant="moon" />

                    {/* Anchor Phrase */}
                    <div className="bg-gold/5 border-l-4 border-gold p-4">
                      <h3 className="font-cinzel text-xs text-gold tracking-wider uppercase mb-2">Anchor Phrase</h3>
                      <p className="text-navy-dark font-crimson italic whitespace-pre-line">{generatedWorking.anchor_phrase}</p>
                    </div>

                    {/* Ethical Frame */}
                    <BorderFrame variant="crimson" className="bg-crimson/5">
                      <h3 className="font-cinzel text-xs text-crimson tracking-wider uppercase mb-2">Ethical Frame</h3>
                      <p className="text-navy-dark/80 font-crimson text-sm whitespace-pre-line">{generatedWorking.ethical_frame}</p>
                    </BorderFrame>

                    <MysticalDivider light />

                    {/* The Practice */}
                    <div>
                      <h3 className="font-cinzel text-xs text-gold tracking-wider uppercase mb-4">The Practice</h3>
                      <div className="space-y-4">
                        {generatedWorking.guided_working?.map((stepItem, idx) => (
                          <div key={idx} className="relative pl-8 border-l-2 border-crimson/30">
                            <div className="absolute left-0 top-0 -translate-x-1/2 w-4 h-4 rounded-full bg-crimson/20 border-2 border-crimson flex items-center justify-center">
                              <span className="text-crimson text-[10px] font-bold">{stepItem.step}</span>
                            </div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-navy-dark font-cinzel text-sm font-semibold">{stepItem.title}</span>
                              <span className="text-navy-dark/40 text-xs flex items-center gap-1 font-montserrat">
                                <Clock className="w-3 h-3" />
                                {stepItem.duration}
                              </span>
                            </div>
                            <p className="text-navy-dark/70 font-crimson text-sm">{stepItem.instructions}</p>
                            {stepItem.spoken_words && (
                              <p className="mt-2 text-crimson italic text-sm font-crimson border-l-2 border-gold/30 pl-3">
                                "{stepItem.spoken_words}"
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <MysticalDivider light variant="moon" />

                    {/* Action Pledge */}
                    <div className="border-t-2 border-gold/30 pt-4">
                      <h3 className="font-cinzel text-xs text-gold tracking-wider uppercase mb-2">Action Pledge</h3>
                      <p className="text-navy-dark font-crimson text-sm">{generatedWorking.action_pledge}</p>
                    </div>

                    {/* Closing */}
                    <div className="text-center pt-4">
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
      {/* FOOTER */}
      {/* ================================================================ */}
      <DarkSection className="py-12 px-4">
        <div className="max-w-xl mx-auto text-center">
          <MysticalDivider variant="moon" />
          <p className="font-crimson text-base text-silver-mist/80 italic mt-6">
            Inner work does not replace resistance.
          </p>
          <p className="font-crimson text-lg text-gold mt-1">
            It steadies those who resist.
          </p>
        </div>
      </DarkSection>
    </div>
  );
};

export default InvisibleHelpers;
