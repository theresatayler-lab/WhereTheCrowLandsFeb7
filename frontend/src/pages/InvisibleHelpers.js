import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Sparkles, ChevronRight, ChevronDown,
  Download, Copy, Check, Clock, Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '../lib/utils';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ElaborateCorner } from '../components/OrnateElements';

const API_URL = process.env.REACT_APP_BACKEND_URL;

// Generic spell video for loading state
const SPELL_VIDEO_URL = 'https://customer-assets.emergentagent.com/job_mystic-grimoire-1/artifacts/sl3euh2k_GenericSpellWaitingVid.MOV';

// ============================================================================
// INVISIBLE HELPERS MOTIF COMPONENTS
// Subtle, reverent, diagrammatic mysticism
// ============================================================================

// Protective Circle SVG - used in hero and result container
const ProtectiveCircle = ({ className = '', opacity = 0.08 }) => (
  <svg viewBox="0 0 400 400" className={className} fill="none" style={{ opacity }}>
    {/* Outer protective boundary */}
    <circle cx="200" cy="200" r="190" stroke="currentColor" strokeWidth="0.5" />
    <circle cx="200" cy="200" r="180" stroke="currentColor" strokeWidth="0.3" strokeDasharray="4 8" />
    {/* Inner sanctum */}
    <circle cx="200" cy="200" r="120" stroke="currentColor" strokeWidth="0.5" />
    <circle cx="200" cy="200" r="100" stroke="currentColor" strokeWidth="0.3" />
    {/* Cardinal points */}
    <line x1="200" y1="10" x2="200" y2="50" stroke="currentColor" strokeWidth="0.5" />
    <line x1="200" y1="350" x2="200" y2="390" stroke="currentColor" strokeWidth="0.5" />
    <line x1="10" y1="200" x2="50" y2="200" stroke="currentColor" strokeWidth="0.5" />
    <line x1="350" y1="200" x2="390" y2="200" stroke="currentColor" strokeWidth="0.5" />
    {/* Balance triangles */}
    <path d="M200,80 L220,110 L180,110 Z" stroke="currentColor" strokeWidth="0.3" fill="none" />
    <path d="M200,320 L220,290 L180,290 Z" stroke="currentColor" strokeWidth="0.3" fill="none" />
  </svg>
);

// Lattice/Grid overlay - subtle geometric law
const SacredLattice = ({ className = '', opacity = 0.05 }) => (
  <svg viewBox="0 0 100 100" className={className} preserveAspectRatio="none" style={{ opacity }}>
    <defs>
      <pattern id="lattice" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M0,10 L20,10 M10,0 L10,20" stroke="currentColor" strokeWidth="0.3" fill="none" />
        <circle cx="10" cy="10" r="1" fill="currentColor" opacity="0.5" />
      </pattern>
    </defs>
    <rect width="100" height="100" fill="url(#lattice)" />
  </svg>
);

// Horizon line with mist effect for footer
const HorizonMist = ({ className = '' }) => (
  <div className={cn("relative h-24 overflow-hidden", className)}>
    <svg viewBox="0 0 100 24" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="mistGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
          <stop offset="50%" stopColor="currentColor" stopOpacity="0.05" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Distant hills/tor silhouette */}
      <path d="M0,18 Q25,10 50,14 Q75,8 100,16 L100,24 L0,24 Z" fill="url(#mistGrad)" />
      {/* Horizon line */}
      <line x1="0" y1="16" x2="100" y2="16" stroke="currentColor" strokeWidth="0.2" opacity="0.1" />
    </svg>
  </div>
);

// Talisman frame for the result container
const TalismanFrame = ({ children, className = '' }) => (
  <div className={cn("relative", className)}>
    {/* Corner marks - talisman style */}
    <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-amber-700/30 rounded-tl" />
    <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-amber-700/30 rounded-tr" />
    <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-amber-700/30 rounded-bl" />
    <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-amber-700/30 rounded-br" />
    {/* Inner border */}
    <div className="absolute inset-3 border border-slate-700/30 rounded pointer-events-none" />
    {/* Subtle lattice background */}
    <SacredLattice className="absolute inset-0 w-full h-full text-amber-500" opacity={0.03} />
    {children}
  </div>
);

// Transmutation callout style
const TransmutationCallout = ({ children, className = '' }) => (
  <div className={cn("relative bg-amber-900/10 border border-amber-900/30 rounded-lg p-4 overflow-hidden", className)}>
    {/* Abstract alchemical geometry background */}
    <svg className="absolute inset-0 w-full h-full text-amber-500 opacity-5" viewBox="0 0 100 100" preserveAspectRatio="none">
      <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="0.5" fill="none" />
      <polygon points="50,15 80,70 20,70" stroke="currentColor" strokeWidth="0.3" fill="none" />
      <polygon points="50,85 20,30 80,30" stroke="currentColor" strokeWidth="0.3" fill="none" />
    </svg>
    <div className="relative z-10">{children}</div>
  </div>
);

// ============================================================================
// FORM OPTIONS
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
  
  const [step, setStep] = useState('form'); // Start with form
  const [email, setEmail] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generatedWorking, setGeneratedWorking] = useState(null);
  const [generationCount, setGenerationCount] = useState(0);
  const [copied, setCopied] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  
  const workingRef = useRef(null);

  // Scroll to top when step changes
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

  // Scroll to top on step changes
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
    setStep('checkout'); // Go to checkout/donation after email
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
        backgroundColor: '#0f172a',
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
      
      let heightLeft = imgHeight * ratio - (pdfHeight - 20);
      while (heightLeft > 0) {
        pdf.addPage();
        imgY = -heightLeft + 10;
        pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
        heightLeft -= (pdfHeight - 20);
      }
      
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
  // RENDER
  // ============================================================================

  return (
    <div className="min-h-screen bg-[#0a0f1a]" data-testid="invisible-helpers-page">
      {/* Hero with protective circle motif */}
      <section className="relative py-10 md:py-14 overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-amber-900/10 via-transparent to-transparent" />
        
        {/* Protective circle background - more visible */}
        <ProtectiveCircle 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] text-amber-500" 
          opacity={0.15}
        />
        
        {/* Subtle radial glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-3xl" />
        
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Shield className="w-10 h-10 mx-auto mb-4 text-amber-500/70" />
            <h1 className="font-cinzel text-2xl md:text-3xl text-slate-200 mb-2">
              Magical Battle Cry Intention
            </h1>
            <p className="text-amber-600/70 text-sm italic">
              A Structured Intention for Protection & Clarity
            </p>
          </motion.div>
        </div>
      </section>

      {/* Expanded Intro Section - Show on form step */}
      {step === 'form' && (
        <section className="px-4 pb-8">
          <div className="max-w-3xl mx-auto">
            <div className="bg-slate-900/30 border border-slate-700/50 rounded-lg overflow-hidden">
              {/* Always visible intro */}
              <div className="p-6 md:p-8">
                <div className="prose prose-invert prose-slate max-w-none text-sm">
                  <p className="text-slate-300 leading-relaxed mb-4">
                    In times of uncertainty, people have always gathered—not just to act, but to 
                    <span className="text-slate-200"> steady themselves before acting</span>. During 
                    World War II, groups practiced coordinated meditation for protection and clarity. 
                    In the 1960s, activists paired inner work with outer resistance. Today, from 
                    <span className="text-amber-500/80"> &ldquo;Etsy witches&rdquo;</span> making headlines 
                    to artists weaving meaning into protest, people are rediscovering an old truth.
                  </p>
                  
                  <p className="text-slate-400 leading-relaxed mb-4">
                    <span className="text-slate-300">When the world feels like it&apos;s burning, 
                    steadying the inner field matters.</span> Not as a replacement for action—never 
                    that—but as a companion to it. Focused intention, done with clean hands and a 
                    clear heart, can be part of how we show up.
                  </p>

                  <p className="text-slate-400 leading-relaxed">
                    This portal draws inspiration from <span className="text-amber-500/90">Dion Fortune&apos;s</span> wartime 
                    spiritual work and the long tradition of ethical, protective practice. What you&apos;ll 
                    create here is a <span className="text-slate-200">structured intention</span> that 
                    returns misused power to natural law, strengthens those who protect, and steadies 
                    your own resolve. No curses. No targets. Just clarity, protection, and lawful return.
                  </p>
                </div>
              </div>

            {/* Expandable section */}
              <AnimatePresence>
                {showFullIntro && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden border-t border-slate-700/50"
                  >
                    <div className="px-6 md:px-8 pb-6 md:pb-8 prose prose-invert prose-slate max-w-none text-sm">
                      <h3 className="font-cinzel text-amber-600/80 text-base mb-3 mt-0">About Where The Crowlands</h3>
                      <p className="text-slate-400 leading-relaxed mb-4">
                        We&apos;re building <span className="text-slate-200">Where The Crowlands</span> as 
                        a portal to a world where magic is practical, ethical, and a little bit fun. A place 
                        where AI-guided rituals meet family folklore, where you can explore the history of 
                        magical practice while crafting your own. Think of it as your digital grimoire—part 
                        library, part workshop, part community.
                      </p>

                      <h3 className="font-cinzel text-amber-600/80 text-base mb-3">Guiding Principles</h3>
                      <p className="text-slate-400 leading-relaxed mb-3">
                        Ethical magical work across traditions shares common principles:
                      </p>
                      <ul className="text-slate-400 space-y-2 mb-4">
                        <li><span className="text-slate-300">Language directs force</span> — vague or emotional wording causes rebound</li>
                        <li><span className="text-slate-300">Work that violates free will rebounds</span> — we redirect, never strike</li>
                        <li><span className="text-slate-300">Justice belongs to impersonal law</span> — not personal vengeance</li>
                        <li><span className="text-slate-300">Defense and protection over aggression</span> — always</li>
                      </ul>

                      <h3 className="font-cinzel text-amber-600/80 text-base mb-3">What This Intention Does</h3>
                      <p className="text-slate-400 leading-relaxed mb-4">
                        This is a <span className="text-slate-200">Neutralizing Return to Source via Higher Law</span>. 
                        It doesn&apos;t curse. It doesn&apos;t attack. It returns misused power—distortion, 
                        coercion, dehumanization—to the impersonal law that governs consequence. Think of it 
                        as redirecting energy back to where it came from, transmuted into accountability 
                        rather than harm.
                      </p>
                      
                      <p className="text-slate-400 leading-relaxed mb-4">
                        The goal is <span className="text-amber-500/80">disruption, not destruction</span>. 
                        A little sand in the gears of cruelty. But always with clean hands, always paired 
                        with real-world action, and always remembering that the goal is protection and 
                        clarity—not revenge.
                      </p>

                      <TransmutationCallout className="mt-4">
                        <p className="text-amber-200/80 text-xs italic m-0">
                          &ldquo;Inner work does not replace resistance. It steadies those who resist.&rdquo;
                        </p>
                      </TransmutationCallout>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <button
                onClick={() => setShowFullIntro(!showFullIntro)}
                className="w-full py-3 px-6 border-t border-slate-700/50 text-amber-600/70 hover:text-amber-500 text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <span>{showFullIntro ? 'Show less' : 'Read more about this intention...'}</span>
                <ChevronDown className={cn("w-4 h-4 transition-transform", showFullIntro && "rotate-180")} />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Main Content - All steps */}
      <section className="px-4 pb-16">
        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            {step === 'form' && (
              <FormStep
                formData={formData}
                onFormChange={handleFormChange}
                onToggleBeneficiary={toggleBeneficiary}
                isValid={isFormValid()}
                onContinue={handleContinueToEmail}
              />
            )}
            
            {step === 'email' && (
              <EmailStep
                email={email}
                setEmail={setEmail}
                onSubmit={handleEmailSubmit}
                onBack={() => setStep('form')}
              />
            )}
            
            {step === 'checkout' && (
              <CheckoutStep
                email={email}
                onCheckout={handleCheckout}
                onBack={() => setStep('email')}
                checkingOut={checkingOut}
              />
            )}
            
            {step === 'result' && (
              <ResultStep
                working={generatedWorking}
                generating={generating}
                workingRef={workingRef}
                onCopy={handleCopyToClipboard}
                onDownload={handleDownloadPDF}
                onVariation={handleCreateVariation}
                onReset={resetAll}
                copied={copied}
                generationCount={generationCount}
                maxGenerations={MAX_FREE_GENERATIONS}
              />
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Footer with horizon mist */}
      <section className="relative border-t border-slate-800">
        <HorizonMist className="absolute inset-x-0 -top-12 text-slate-400" />
        <div className="relative py-12 px-4">
          <div className="max-w-xl mx-auto text-center">
            <p className="font-cinzel text-base text-slate-400 italic">
              Inner work does not replace resistance.<br />
              <span className="text-slate-300">It steadies those who resist.</span>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

// ============================================================================
// FORM STEP
// ============================================================================

const FormStep = ({ formData, onFormChange, onToggleBeneficiary, isValid, onContinue }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-6 space-y-6"
  >
    {/* Personal Intention - FREE TEXT FIRST */}
    <FormSection 
      title="What is your intention?"
      context="Write a few lines about what you're seeking protection from, or clarity about. This is for you."
    >
      <textarea
        value={formData.personal_intention}
        onChange={(e) => onFormChange('personal_intention', e.target.value)}
        placeholder="In my own words, I seek..."
        rows={3}
        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-amber-700/50 text-sm resize-none"
        data-testid="personal-intention-input"
      />
    </FormSection>

    {/* Beneficiaries */}
    <FormSection 
      title="Who are you protecting?"
      context="The heart of this intention is shielding those in harm's way. Visualize protection around them, not attack on anyone."
    >
      <div className="flex flex-wrap gap-2">
        {BENEFICIARIES_OPTIONS.map(opt => (
          <ToggleChip
            key={opt.id}
            label={opt.label}
            selected={formData.beneficiaries.includes(opt.label)}
            onClick={() => onToggleBeneficiary(opt.label)}
          />
        ))}
      </div>
    </FormSection>

    {/* Primary Quality */}
    <FormSection 
      title="Quality to strengthen"
      context="What energy do you want to amplify? Focused visualization on positive qualities creates a 'seed idea' that spreads outward."
    >
      <div className="flex flex-wrap gap-2">
        {QUALITY_OPTIONS.map(opt => (
          <ToggleChip
            key={opt.id}
            label={opt.label}
            selected={formData.primary_quality === opt.label}
            onClick={() => onFormChange('primary_quality', opt.label)}
          />
        ))}
      </div>
    </FormSection>

    {/* Practice Style */}
    <FormSection 
      title="Practice language"
      context="How do you prefer your spiritual language? We'll match the tone accordingly."
    >
      <div className="flex flex-wrap gap-2">
        {PRACTICE_STYLE_OPTIONS.map(opt => (
          <ToggleChip
            key={opt.id}
            label={opt.label}
            selected={formData.practice_style === opt.label}
            onClick={() => onFormChange('practice_style', opt.label)}
          />
        ))}
      </div>
    </FormSection>

    {/* Time Horizon */}
    <FormSection 
      title="Time horizon"
      context="Synchronized, regular practice builds coherence. Picking a specific time helps anchor the intention in your life."
    >
      <div className="flex flex-wrap gap-2">
        {TIME_HORIZON_OPTIONS.map(opt => (
          <ToggleChip
            key={opt.id}
            label={opt.label}
            selected={formData.time_horizon === opt.label}
            onClick={() => onFormChange('time_horizon', opt.label)}
          />
        ))}
      </div>
    </FormSection>

    {/* Action Commitment - Simple statement */}
    <div className="bg-slate-800/30 border border-slate-700/30 rounded-lg p-4">
      <label className="block text-slate-200 text-sm mb-2">
        Your commitment to the material world
      </label>
      <p className="text-slate-400 text-sm">
        By creating this intention, I understand that spellwork and storytelling are conduits to support real action. 
        I commit to channeling this intention toward benevolent outcomes and peace.
      </p>
    </div>

    {/* Continue Button */}
    <button
      onClick={onContinue}
      disabled={!isValid}
      className={cn(
        "w-full py-3 rounded font-cinzel text-sm transition-all flex items-center justify-center gap-2",
        isValid
          ? "bg-amber-900/40 hover:bg-amber-900/60 border border-amber-700/50 text-amber-200"
          : "bg-slate-800 border border-slate-700 text-slate-500 cursor-not-allowed"
      )}
      data-testid="continue-to-checkout-btn"
    >
      Continue
      <ChevronRight className="w-4 h-4" />
    </button>
  </motion.div>
);

// Form Section with context
const FormSection = ({ title, context, children }) => (
  <div>
    <label className="block text-slate-200 text-sm mb-1">{title}</label>
    {context && (
      <p className="text-slate-500 text-xs mb-3 italic">{context}</p>
    )}
    {children}
  </div>
);

// Toggle Chip component
const ToggleChip = ({ label, selected, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "px-3 py-1.5 rounded-full text-xs transition-all border",
      selected
        ? "bg-amber-900/40 border-amber-700/50 text-amber-200"
        : "bg-slate-800/50 border-slate-700/50 text-slate-400 hover:border-slate-600"
    )}
  >
    {label}
  </button>
);

// ============================================================================
// EMAIL STEP
// ============================================================================

const EmailStep = ({ email, setEmail, onSubmit, onBack }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-6"
  >
    <button onClick={onBack} className="text-slate-500 hover:text-slate-300 text-sm mb-4">
      ← Back to form
    </button>
    
    <div className="text-center mb-6">
      <Sparkles className="w-8 h-8 mx-auto mb-3 text-amber-500/70" />
      <h2 className="font-cinzel text-lg text-slate-200 mb-2">Receive Your Intention & Join the Chaos</h2>
      <p className="text-slate-500 text-sm">
        Enter your email to receive your intention and a PDF for offline use.
      </p>
    </div>
    
    <form onSubmit={onSubmit} className="space-y-4">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-amber-700/50"
        required
        data-testid="email-input"
      />
      <button
        type="submit"
        className="w-full py-3 bg-amber-900/40 hover:bg-amber-900/60 border border-amber-700/50 rounded font-cinzel text-amber-200 text-sm transition-colors flex items-center justify-center gap-2"
        data-testid="email-submit-btn"
      >
        Continue
        <ChevronRight className="w-4 h-4" />
      </button>
      <p className="text-slate-600 text-xs text-center">
        You can generate up to 3 intentions as a guest. Join early access for unlimited.
      </p>
    </form>
  </motion.div>
);

// ============================================================================
// CHECKOUT STEP
// ============================================================================

const CheckoutStep = ({ email, onCheckout, onBack, checkingOut }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-6"
  >
    <button onClick={onBack} className="text-slate-500 hover:text-slate-300 text-sm mb-4" disabled={checkingOut}>
      ← Back
    </button>
    
    <div className="text-center mb-6">
      <Sparkles className="w-8 h-8 mx-auto mb-3 text-amber-500/70" />
      <h2 className="font-cinzel text-lg text-slate-200 mb-3">Support This Work</h2>
      <div className="text-slate-400 text-sm space-y-3 text-left">
        <p>
          This portal is offered freely. If you&apos;re able, consider a pay-what-you-choose contribution.
        </p>
        <p>
          Each spell costs the witchy woman behind the veil approximately <span className="text-amber-500">$0.02–0.05</span> in 
          AI generation costs, and she&apos;s building this whole thing as we speak.
        </p>
        <p className="text-slate-500">
          Please continue to your spell with or without a donation!
        </p>
      </div>
      <p className="text-amber-600/70 text-xs mt-4 italic font-cinzel">
        So it is, love only, war is TAMAM SHUD
      </p>
    </div>
    
    <div className="space-y-3">
      {/* Free button - stands out in rose/pink */}
      <button
        onClick={() => onCheckout(0)}
        disabled={checkingOut}
        className="w-full py-3 bg-rose-900/30 hover:bg-rose-900/50 border border-rose-600/50 rounded text-rose-200 text-sm font-medium transition-colors disabled:opacity-50"
        data-testid="checkout-free-btn"
      >
        {checkingOut ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : '✨ Continue Free — No Judgement ✨'}
      </button>
      
      <p className="text-slate-600 text-xs text-center">— or support the work —</p>
      
      <div className="grid grid-cols-3 gap-2">
        {[500, 1000, 2500].map(amount => (
          <button
            key={amount}
            onClick={() => onCheckout(amount)}
            disabled={checkingOut}
            className="py-3 bg-amber-900/20 hover:bg-amber-900/40 border border-amber-700/30 rounded text-amber-200/80 text-sm transition-colors disabled:opacity-50"
          >
            ${amount / 100}
          </button>
        ))}
      </div>
      
      <button
        onClick={() => {
          const custom = prompt('Enter amount in dollars (e.g., 20):');
          if (custom && !isNaN(parseFloat(custom))) {
            onCheckout(Math.round(parseFloat(custom) * 100));
          }
        }}
        disabled={checkingOut}
        className="w-full py-2 text-slate-500 hover:text-slate-400 text-xs transition-colors disabled:opacity-50"
      >
        Other amount...
      </button>
    </div>
  </motion.div>
);

// ============================================================================
// RESULT STEP - With video loading and talisman frame
// ============================================================================

const ResultStep = ({ 
  working, 
  generating, 
  workingRef, 
  onCopy, 
  onDownload, 
  onVariation, 
  onReset,
  copied,
  generationCount,
  maxGenerations
}) => {
  // Loading state with video background
  if (generating) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-[#0a0f1a] z-50 flex items-center justify-center overflow-hidden"
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
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1a] via-[#0a0f1a]/70 to-[#0a0f1a]/50" />
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-[#0a0f1a]" />
        
        {/* Corner ornaments */}
        <ElaborateCorner className="absolute top-4 left-4 w-16 h-16 sm:w-24 sm:h-24" variant="gold" />
        <ElaborateCorner className="absolute top-4 right-4 w-16 h-16 sm:w-24 sm:h-24 rotate-90" variant="gold" />
        <ElaborateCorner className="absolute bottom-4 left-4 w-16 h-16 sm:w-24 sm:h-24 -rotate-90" variant="gold" />
        <ElaborateCorner className="absolute bottom-4 right-4 w-16 h-16 sm:w-24 sm:h-24 rotate-180" variant="gold" />
        
        {/* Protective circle */}
        <ProtectiveCircle className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] text-amber-500" opacity={0.1} />
        
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
            <div className="absolute inset-0 rounded-full border-2 border-amber-500/40 animate-pulse" />
            <div className="absolute inset-2 rounded-full border border-rose-500/30" />
            <Shield className="w-full h-full text-amber-500 p-4" style={{ filter: 'drop-shadow(0 0 20px rgba(212, 168, 75, 0.5))' }} />
          </motion.div>
          
          <h2 className="font-cinzel text-2xl sm:text-3xl text-amber-500 mb-3" style={{ textShadow: '0 2px 20px rgba(212, 168, 75, 0.4)' }}>
            Generating Your Intention
          </h2>
          
          <p className="font-crimson text-lg text-slate-300/80 mb-2">
            Weaving protection and clarity...
          </p>
          
          <p className="text-slate-500 text-sm">
            This may take a moment
          </p>
        </div>
      </motion.div>
    );
  }

  if (!working) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12"
      >
        <Loader2 className="w-8 h-8 mx-auto mb-4 text-amber-500/50 animate-spin" />
        <p className="text-slate-500">Preparing your intention...</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Action buttons */}
      <div className="flex flex-wrap gap-2 justify-between items-center">
        <div className="flex gap-2">
          <button
            onClick={onVariation}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-slate-300 text-sm transition-colors"
          >
            Create Another
          </button>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onCopy}
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-slate-300 text-xs transition-colors"
            data-testid="copy-working-btn"
          >
            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
          <button
            onClick={onDownload}
            className="flex items-center gap-2 px-3 py-1.5 bg-amber-900/40 hover:bg-amber-900/60 border border-amber-700/50 rounded text-amber-200 text-xs transition-colors"
            data-testid="download-pdf-btn"
          >
            <Download className="w-3 h-3" />
            PDF
          </button>
        </div>
      </div>

      {/* Working Content in Talisman Frame */}
      <TalismanFrame>
        <div 
          ref={workingRef}
          className="bg-slate-900/70 border border-slate-700/50 rounded-lg p-6 md:p-8 space-y-6"
        >
          <div className="text-center border-b border-slate-700/50 pb-4">
            <h2 className="font-cinzel text-xl text-slate-200">Magical Battle Cry Intention</h2>
            <p className="text-amber-600/60 text-xs italic mt-1">A Structured Intention for Protection & Clarity</p>
          </div>

          <div>
            <h3 className="font-cinzel text-amber-600/80 text-xs mb-2 tracking-wider">INTENTION</h3>
            <p className="text-slate-300 italic">{working.intention}</p>
          </div>

          <div className="bg-slate-800/50 border-l-2 border-amber-700/50 p-4">
            <h3 className="font-cinzel text-amber-600/80 text-xs mb-2 tracking-wider">ANCHOR PHRASE</h3>
            <p className="text-slate-200 italic whitespace-pre-line">{working.anchor_phrase}</p>
          </div>

          <TransmutationCallout>
            <h3 className="font-cinzel text-amber-600/80 text-xs mb-2 tracking-wider">ETHICAL FRAME</h3>
            <p className="text-slate-400 text-sm whitespace-pre-line">{working.ethical_frame}</p>
          </TransmutationCallout>

          <div>
            <h3 className="font-cinzel text-amber-600/80 text-xs mb-4 tracking-wider">THE PRACTICE</h3>
            <div className="space-y-4">
              {working.guided_working?.map((step, idx) => (
                <div key={idx} className="relative pl-8 border-l border-slate-700/50">
                  {/* Node marker - pathway progression style */}
                  <div className="absolute left-0 top-0 -translate-x-1/2 w-3 h-3 rounded-full bg-amber-900/50 border border-amber-700/50" />
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-amber-600/70 text-xs font-mono">Step {step.step}</span>
                    <span className="text-slate-500 text-xs">·</span>
                    <span className="text-slate-400 text-xs flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {step.duration}
                    </span>
                  </div>
                  <h4 className="text-slate-200 text-sm font-medium mb-2">{step.title}</h4>
                  <p className="text-slate-400 text-sm">{step.instructions}</p>
                  {step.spoken_words && (
                    <p className="mt-2 text-amber-200/70 text-sm italic border-l-2 border-amber-700/30 pl-3">
                      &ldquo;{step.spoken_words}&rdquo;
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-700/50 pt-4">
            <h3 className="font-cinzel text-amber-600/80 text-xs mb-2 tracking-wider">ACTION PLEDGE</h3>
            <p className="text-slate-300 text-sm">{working.action_pledge}</p>
          </div>

          <div className="text-center pt-4 border-t border-slate-700/50">
            <p className="text-slate-500 italic text-sm">{working.closing_truth}</p>
          </div>
        </div>
      </TalismanFrame>

      {/* Generation count */}
      {generationCount > 0 && (
        <p className="text-center text-slate-600 text-xs">
          Intentions created: {generationCount}/{maxGenerations} · 
          <button onClick={onReset} className="text-amber-600/70 hover:text-amber-500 ml-1">
            Join early access for unlimited intentions
          </button>
        </p>
      )}
    </motion.div>
  );
};

export default InvisibleHelpers;
