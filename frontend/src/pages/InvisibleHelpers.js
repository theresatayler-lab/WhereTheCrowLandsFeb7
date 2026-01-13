import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Sparkles, ChevronRight, ChevronDown,
  Download, Mail, Copy, Check, Clock, Loader2, X, Lock, Feather
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '../lib/utils';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const API_URL = process.env.REACT_APP_BACKEND_URL;

// Form options
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
  { id: 'secular', label: 'Quiet / secular' },
  { id: 'mystical', label: 'Mystical / angelic' },
  { id: 'poetic', label: 'Poetic / mythic' },
];

const TIME_HORIZON_OPTIONS = [
  { id: 'today', label: 'Today' },
  { id: 'this_week', label: 'This week' },
  { id: 'ongoing', label: 'Weekly cadence' },
];

const ACTION_OPTIONS = [
  { id: 'mutual_aid', label: 'Mutual aid & legal defense' },
  { id: 'neighbors', label: 'Community & neighbors' },
  { id: 'truth', label: 'Vetted information sharing' },
  { id: 'journalism', label: 'Independent journalism' },
  { id: 'civic', label: 'Civic engagement' },
];

const MAX_FREE_GENERATIONS = 3;

export const InvisibleHelpers = () => {
  const [showFullIntro, setShowFullIntro] = useState(false);
  const [formData, setFormData] = useState({
    personal_intention: '',
    beneficiaries: [],
    primary_quality: '',
    practice_style: '',
    time_horizon: '',
    action_commitments: [], // Changed to array for multi-select
  });
  
  const [step, setStep] = useState('email'); // Start with email step
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

  const toggleActionCommitment = (label) => {
    setFormData(prev => {
      const arr = prev.action_commitments;
      if (arr.includes(label)) {
        return { ...prev, action_commitments: arr.filter(v => v !== label) };
      } else {
        return { ...prev, action_commitments: [...arr, label] };
      }
    });
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
           formData.time_horizon &&
           formData.action_commitments.length > 0;
  };

  const handleContinueToCheckout = () => {
    if (!isFormValid()) {
      toast.error('Please complete all required fields');
      return;
    }
    localStorage.setItem('ih_pending_form', JSON.stringify(formData));
    setStep('checkout');
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
    setStep('form'); // Go to form after email
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
          action_pledge: form.action_commitments?.join(', ') || '',
        }),
      });
      
      const data = await response.json();
      
      if (data.success && data.working) {
        setGeneratedWorking(data.working);
        setGenerationCount(data.generation_count || generationCount + 1);
        localStorage.setItem('ih_generation_count', String(data.generation_count || generationCount + 1));
        toast.success('Your working has been generated!');
        localStorage.removeItem('ih_pending_email');
        localStorage.removeItem('ih_pending_form');
      } else if (data.limit_reached) {
        toast.info('You\'ve reached the guest limit.');
        window.location.href = '/early-access';
      } else {
        toast.error(data.error || 'Failed to generate working');
      }
    } catch (error) {
      console.error('Generation error:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const handleCreateVariation = () => {
    if (generationCount >= MAX_FREE_GENERATIONS) {
      toast.info('You\'ve reached the guest limit. Join early access to continue.');
      window.location.href = '/early-access';
      return;
    }
    setGeneratedWorking(null);
    setStep('checkout');
    handleCheckout(0);
  };

  const handleCopyToClipboard = async () => {
    if (!generatedWorking) return;
    const text = formatWorkingAsText(generatedWorking);
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const formatWorkingAsText = (working) => {
    let text = `MAGICAL BATTLE CRY INTENTION\nA Working for Protection & Clarity\n\n`;
    text += `INTENTION\n${working.intention}\n\n`;
    text += `ANCHOR PHRASE\n${working.anchor_phrase}\n\n`;
    text += `ETHICAL FRAME\n${working.ethical_frame}\n\n`;
    text += `THE WORKING\n`;
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
      toast.info('Generating PDF...');
      const canvas = await html2canvas(workingRef.current, {
        scale: 2,
        backgroundColor: '#0a0f1a',
        useCORS: true,
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth - 20;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.setFillColor(10, 15, 26);
      pdf.rect(0, 0, pdfWidth, pdfHeight, 'F');
      
      if (imgHeight <= pdfHeight - 20) {
        pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
      } else {
        let heightLeft = imgHeight;
        let yPosition = 10;
        pdf.addImage(imgData, 'PNG', 10, yPosition, imgWidth, imgHeight);
        heightLeft -= (pdfHeight - 20);
        while (heightLeft > 0) {
          pdf.addPage();
          pdf.setFillColor(10, 15, 26);
          pdf.rect(0, 0, pdfWidth, pdfHeight, 'F');
          yPosition = -(imgHeight - heightLeft) + 10;
          pdf.addImage(imgData, 'PNG', 10, yPosition, imgWidth, imgHeight);
          heightLeft -= (pdfHeight - 20);
        }
      }
      pdf.save('magical-battle-cry-intention.pdf');
      toast.success('PDF downloaded');
    } catch (error) {
      console.error('PDF error:', error);
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
      action_commitments: [],
    });
    setEmail('');
    setGeneratedWorking(null);
    setStep('email');
  };

  return (
    <div className="min-h-screen bg-[#0a0f1a]" data-testid="invisible-helpers-page">
      {/* Hero */}
      <section className="relative py-10 md:py-14 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)`,
            backgroundSize: '100px 100px'
          }} />
        </div>
        
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
              A Working for Protection & Clarity
            </p>
          </motion.div>
        </div>
      </section>

      {/* Email Step - Right after hero when on email step */}
      {step === 'email' && (
        <section className="px-4 pb-8">
          <div className="max-w-2xl mx-auto">
            <EmailStep
              email={email}
              setEmail={setEmail}
              onSubmit={handleEmailSubmit}
            />
          </div>
        </section>
      )}

      {/* Expanded Intro Section - Show when not on email step */}
      {step !== 'email' && (
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
                    create here is a <span className="text-slate-200">working</span>—a structured intention 
                    that returns misused power to natural law, strengthens those who protect, and steadies 
                    your own resolve. No curses. No targets. Just clarity, protection, and lawful return.
                  </p>
                </div>
              </div>

            {/* Expandable section */}
            <div className="border-t border-slate-700/50">
              <button
                onClick={() => setShowFullIntro(!showFullIntro)}
                className="w-full px-6 py-3 flex items-center justify-between text-slate-500 hover:text-slate-400 transition-colors text-sm"
              >
                <span>{showFullIntro ? 'Show less' : 'Read more about this working...'}</span>
                <ChevronDown className={cn(
                  "w-4 h-4 transition-transform",
                  showFullIntro && "rotate-180"
                )} />
              </button>
              
              <AnimatePresence>
                {showFullIntro && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
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

                      <h3 className="font-cinzel text-amber-600/80 text-base mb-3">What This Working Does</h3>
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

                      <div className="bg-amber-900/10 border border-amber-900/30 rounded-lg p-4 mt-4">
                        <p className="text-amber-200/80 text-xs italic m-0">
                          &ldquo;Inner work does not replace resistance. It steadies those who resist.&rdquo;
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* Ethical Badge - Show when not on email step */}
      {step !== 'email' && (
        <div className="text-center pb-6">
          <span className="inline-block px-4 py-2 bg-slate-900/50 border border-slate-700/50 rounded-full text-slate-500 text-xs">
            No harm · No targets · No coercion · Only protection, clarity, and lawful return
          </span>
        </div>
      )}

      {/* Main Content - Form, Checkout, and Result steps */}
      {step !== 'email' && (
        <section className="px-4 pb-16">
          <div className="max-w-2xl mx-auto">
            <AnimatePresence mode="wait">
              {step === 'form' && (
                <FormStep
                  formData={formData}
                  onFormChange={handleFormChange}
                  onToggleBeneficiary={toggleBeneficiary}
                  onToggleAction={toggleActionCommitment}
                  isValid={isFormValid()}
                  onContinue={handleContinueToCheckout}
                />
              )}
              
              {step === 'checkout' && (
                <CheckoutStep
                  email={email}
                  onCheckout={handleCheckout}
                  onBack={() => setStep('form')}
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
      )}

      {/* Closing */}
      <section className="py-12 px-4 border-t border-slate-800">
        <div className="max-w-xl mx-auto text-center">
          <p className="font-cinzel text-base text-slate-400 italic">
            Inner work does not replace resistance.<br />
            <span className="text-slate-300">It steadies those who resist.</span>
          </p>
        </div>
      </section>
    </div>
  );
};

// Form Step with personal intention and contextual explanations
const FormStep = ({ formData, onFormChange, onToggleBeneficiary, isValid, onContinue }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-6 space-y-6"
  >
    <div className="text-center mb-2">
      <Feather className="w-6 h-6 mx-auto mb-2 text-amber-500/60" />
      <h2 className="font-cinzel text-lg text-slate-200">Craft Your Working</h2>
    </div>

    {/* Personal Intention - FREE TEXT FIRST */}
    <div className="bg-slate-800/30 border border-slate-700/30 rounded-lg p-4">
      <label className="block text-slate-200 text-sm mb-2">
        What is your intention with this working?
      </label>
      <p className="text-slate-500 text-xs mb-3">
        In a few words, what do you hope to see change for the better? What needs protecting, 
        clarifying, or returning to balance? This is your chance to co-create.
      </p>
      <textarea
        value={formData.personal_intention}
        onChange={(e) => onFormChange('personal_intention', e.target.value)}
        placeholder="e.g., I want to see my community protected from fear and division. I want clarity to cut through the noise..."
        rows={3}
        className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded text-slate-300 text-sm placeholder:text-slate-600 focus:outline-none focus:border-amber-700/50 resize-none"
      />
    </div>

    {/* Beneficiaries */}
    <FormSection 
      title="Who are you protecting?"
      context="The heart of this working is shielding those in harm's way. Visualize protection around them, not attack on anyone."
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
      title="Language style"
      context="How do you connect? Some prefer quiet, grounded words. Others resonate with mystical imagery. There's no wrong answer."
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
      context="Synchronized, regular practice builds coherence. Picking a specific time helps anchor the working in your life."
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

    {/* Action Pledge */}
    <FormSection 
      title="Real-world action"
      context="Inner work supports outer action—never replaces it. What concrete thing will you do to ground this working in material reality?"
    >
      <div className="flex flex-wrap gap-2">
        {ACTION_OPTIONS.map(opt => (
          <ToggleChip
            key={opt.id}
            label={opt.label}
            selected={formData.action_pledge === opt.label}
            onClick={() => onFormChange('action_pledge', opt.label)}
          />
        ))}
      </div>
    </FormSection>

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
      data-testid="continue-to-email-btn"
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

// Toggle Chip
const ToggleChip = ({ label, selected, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "px-3 py-1.5 rounded-full text-xs transition-all",
      selected
        ? "bg-amber-900/40 border border-amber-700/50 text-amber-200"
        : "bg-slate-800/50 border border-slate-700 text-slate-400 hover:border-slate-600"
    )}
  >
    {label}
  </button>
);

// Email Step
const EmailStep = ({ email, setEmail, onSubmit, onBack }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-6"
  >
    <button onClick={onBack} className="text-slate-500 hover:text-slate-300 text-sm mb-4">
      ← Back
    </button>
    
    <div className="text-center mb-6">
      <Mail className="w-8 h-8 mx-auto mb-3 text-amber-500/70" />
      <h2 className="font-cinzel text-lg text-slate-200 mb-2">Receive Your Working</h2>
      <p className="text-slate-500 text-sm">
        Enter your email to receive your personalized working and a PDF you can use offline.
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
        className="w-full py-3 bg-amber-900/40 hover:bg-amber-900/60 border border-amber-700/50 rounded font-cinzel text-amber-200 text-sm transition-colors"
        data-testid="email-submit-btn"
      >
        Continue
      </button>
      <p className="text-slate-600 text-xs text-center">
        You can generate up to 3 workings as a guest. Join early access for unlimited.
      </p>
    </form>
  </motion.div>
);

// Checkout Step
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
      <h2 className="font-cinzel text-lg text-slate-200 mb-2">Support This Work</h2>
      <p className="text-slate-500 text-sm">
        This portal is offered freely. If you&apos;re able, consider a pay-what-you-choose contribution.
      </p>
      <p className="text-slate-600 text-xs mt-2">
        Sending to: {email}
      </p>
    </div>
    
    <div className="space-y-3">
      <button
        onClick={() => onCheckout(0)}
        disabled={checkingOut}
        className="w-full py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-slate-300 text-sm transition-colors disabled:opacity-50"
        data-testid="checkout-free-btn"
      >
        {checkingOut ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Continue Free'}
      </button>
      
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

// Result Step
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
  if (generating) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-12 text-center"
      >
        <Loader2 className="w-10 h-10 animate-spin mx-auto mb-4 text-amber-500/70" />
        <h2 className="font-cinzel text-lg text-slate-200 mb-2">Generating Your Working</h2>
        <p className="text-slate-500 text-sm">Crafting your working...</p>
      </motion.div>
    );
  }

  if (!working) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-12 text-center"
      >
        <p className="text-slate-400">Something went wrong. Please try again.</p>
        <button onClick={onReset} className="mt-4 text-amber-500 text-sm hover:text-amber-400">
          Start Over
        </button>
      </motion.div>
    );
  }

  const remainingGenerations = maxGenerations - generationCount;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Actions */}
      <div className="flex items-center justify-between">
        <span className="text-slate-500 text-xs">
          {remainingGenerations > 0 
            ? `${remainingGenerations} variation${remainingGenerations !== 1 ? 's' : ''} remaining`
            : 'Guest limit reached'
          }
        </span>
        <div className="flex gap-2">
          <button
            onClick={onCopy}
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-slate-300 text-xs transition-colors"
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

      {/* Working Content */}
      <div 
        ref={workingRef}
        className="bg-slate-900/70 border border-slate-700/50 rounded-lg p-6 md:p-8 space-y-6"
      >
        <div className="text-center border-b border-slate-700/50 pb-4">
          <h2 className="font-cinzel text-xl text-slate-200">Magical Battle Cry Intention</h2>
          <p className="text-amber-600/60 text-xs italic mt-1">A Working for Protection & Clarity</p>
        </div>

        <div>
          <h3 className="font-cinzel text-amber-600/80 text-xs mb-2 tracking-wider">INTENTION</h3>
          <p className="text-slate-300 italic">{working.intention}</p>
        </div>

        <div className="bg-slate-800/50 border-l-2 border-amber-700/50 p-4">
          <h3 className="font-cinzel text-amber-600/80 text-xs mb-2 tracking-wider">ANCHOR PHRASE</h3>
          <p className="text-slate-200 italic whitespace-pre-line">{working.anchor_phrase}</p>
        </div>

        <div className="bg-amber-900/10 border border-amber-900/30 rounded p-4">
          <h3 className="font-cinzel text-amber-600/80 text-xs mb-2 tracking-wider">ETHICAL FRAME</h3>
          <p className="text-slate-400 text-sm whitespace-pre-line">{working.ethical_frame}</p>
        </div>

        <div>
          <h3 className="font-cinzel text-amber-600/80 text-xs mb-4 tracking-wider">THE WORKING</h3>
          <div className="space-y-5">
            {working.guided_working?.map((step, idx) => (
              <div key={idx} className="border-l-2 border-slate-700 pl-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-amber-500/70 font-mono text-xs">{step.step}.</span>
                  <h4 className="text-slate-200 text-sm font-medium">{step.title}</h4>
                  <span className="text-slate-600 text-xs flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {step.duration}
                  </span>
                </div>
                <p className="text-slate-400 text-sm mb-2">{step.instructions}</p>
                {step.spoken_words && (
                  <div className="bg-slate-800/30 border-l-2 border-amber-700/30 p-2 mt-2">
                    <p className="text-slate-300 italic text-sm">&ldquo;{step.spoken_words}&rdquo;</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-800/50 rounded p-4">
          <h3 className="font-cinzel text-amber-600/80 text-xs mb-2 tracking-wider">ACTION PLEDGE</h3>
          <p className="text-slate-300 text-sm">{working.action_pledge}</p>
        </div>

        <div className="text-center pt-4 border-t border-slate-700/50">
          <p className="text-slate-500 italic text-sm">{working.closing_truth}</p>
        </div>
      </div>

      {/* Variation Button */}
      <div className="text-center space-y-2">
        {remainingGenerations > 0 ? (
          <button
            onClick={onVariation}
            className="text-amber-500/70 hover:text-amber-500 text-sm transition-colors"
          >
            Create another variation
          </button>
        ) : (
          <a
            href="/early-access"
            className="inline-flex items-center gap-2 text-amber-500 hover:text-amber-400 text-sm transition-colors"
          >
            <Lock className="w-4 h-4" />
            Join early access for unlimited workings
          </a>
        )}
        <div>
          <button onClick={onReset} className="text-slate-600 hover:text-slate-500 text-xs">
            Start over
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default InvisibleHelpers;
