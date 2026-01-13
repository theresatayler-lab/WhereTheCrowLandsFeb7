import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Eye, Heart, Sparkles, ChevronDown, ChevronUp,
  Download, Mail, ExternalLink, Check, Circle, Clock
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '../lib/utils';

// Ward image URL
const WARD_IMAGE_URL = "https://static.prod-images.emergentagent.com/jobs/2537f733-0ab6-4993-ac0a-8d03f27e2b17/images/9e706bffc320713991214bf94b1f146284ff9f87ebd1c847e0f6923612bd3c85.png";

// API base URL
const API_URL = process.env.REACT_APP_BACKEND_URL;

export const InvisibleHelpers = () => {
  const [activeMode, setActiveMode] = useState(null);
  const [email, setEmail] = useState('');
  const [emailSubmitting, setEmailSubmitting] = useState(false);
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [workingStep, setWorkingStep] = useState(0);
  const [workingComplete, setWorkingComplete] = useState(false);
  const [clarityStep, setClarityStep] = useState(0);
  const [clarityComplete, setClarityComplete] = useState(false);
  const [showDonation, setShowDonation] = useState(false);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    
    setEmailSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/api/invisible-helpers/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      const data = await response.json();
      if (data.success) {
        setEmailSubmitted(true);
        toast.success("You'll be notified when the full portal opens.");
      } else {
        toast.error(data.message || 'Something went wrong');
      }
    } catch (error) {
      toast.error('Failed to submit. Please try again.');
    } finally {
      setEmailSubmitting(false);
    }
  };

  const handleDonate = () => {
    // Open Stripe donation in new tab or modal
    window.open(`${API_URL}/api/stripe/create-checkout?mode=donation`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#0a0f1a]" data-testid="invisible-helpers-page">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        {/* Subtle sacred geometry background */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)`,
            backgroundSize: '100px 100px'
          }} />
        </div>
        
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Shield className="w-12 h-12 mx-auto mb-6 text-slate-400" />
            <h1 className="font-cinzel text-3xl md:text-4xl lg:text-5xl text-slate-200 mb-4">
              Calling Invisible Helpers<br />
              <span className="text-slate-400">from the Inner Planes</span>
            </h1>
            <p className="font-cinzel text-lg text-amber-600/80 italic">
              A coordinated working for protection, clarity, and lawful return
            </p>
          </motion.div>
        </div>
      </section>

      {/* Opening Context */}
      <section className="py-12 px-4">
        <motion.div 
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-8 md:p-10">
            <div className="prose prose-invert prose-slate max-w-none">
              <p className="text-slate-300 leading-relaxed mb-4">
                During the Second World War, when physical gathering was impossible and fear was widespread, 
                spiritual practitioners coordinated quiet, disciplined inner work to support those resisting 
                harm in the material world.
              </p>
              <p className="text-slate-300 leading-relaxed mb-4">
                This portal continues that tradition.
              </p>
              <p className="text-slate-400 leading-relaxed mb-4">
                The work offered here does not replace action.<br />
                It does not command, punish, or attack.<br />
                It exists to strengthen clarity, restraint, protection, and lawful consequence.
              </p>
              <p className="text-slate-300 leading-relaxed mb-4">
                These workings call on <span className="text-amber-500/90">Invisible Helpers from the Inner Planes</span> — 
                not as forces to be controlled, but as intelligences aligned with order, conscience, and protection.
              </p>
              <p className="text-slate-400 italic">
                You are invited to engage calmly, ethically, and in your own time.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Three Modes of Engagement */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-cinzel text-xl text-center text-slate-400 mb-8">
            Choose Your Mode of Engagement
          </h2>

          <div className="space-y-4">
            {/* Option I - Set an Intention */}
            <ModeCard
              number="I"
              title="Set an Intention"
              subtitle="Foundational"
              description="A simple, repeatable intention for daily steadiness"
              isActive={activeMode === 'intention'}
              onClick={() => setActiveMode(activeMode === 'intention' ? null : 'intention')}
              icon={Heart}
            >
              <IntentionMode />
            </ModeCard>

            {/* Option II - Primary Working */}
            <ModeCard
              number="II"
              title="The Lawful Return of Misused Power"
              subtitle="Primary Working"
              description="A guided 10-12 minute working for protection and lawful consequence"
              isActive={activeMode === 'working'}
              onClick={() => setActiveMode(activeMode === 'working' ? null : 'working')}
              icon={Shield}
              featured
            >
              <PrimaryWorking 
                step={workingStep}
                setStep={setWorkingStep}
                complete={workingComplete}
                setComplete={setWorkingComplete}
                onComplete={() => setShowDonation(true)}
              />
            </ModeCard>

            {/* Option III - Clarity Against Propaganda */}
            <ModeCard
              number="III"
              title="Clarity Against Propaganda"
              subtitle="Collective Defense"
              description="A working for discernment and truth in times of confusion"
              isActive={activeMode === 'clarity'}
              onClick={() => setActiveMode(activeMode === 'clarity' ? null : 'clarity')}
              icon={Eye}
            >
              <ClarityWorking
                step={clarityStep}
                setStep={setClarityStep}
                complete={clarityComplete}
                setComplete={setClarityComplete}
                onComplete={() => setShowDonation(true)}
              />
            </ModeCard>
          </div>
        </div>
      </section>

      {/* Ethical Statement */}
      <section className="py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-block px-6 py-4 border border-slate-700/50 rounded-lg bg-slate-900/30">
            <h3 className="font-cinzel text-sm text-amber-600/80 mb-3 tracking-wider">ETHICAL FRAME</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              This working does not punish.<br />
              It restores balance through impersonal law.<br />
              It seeks restraint, clarity, and protection — never harm.
            </p>
          </div>
        </div>
      </section>

      {/* Donation Card (Sidebar style, always visible) */}
      <section className="py-8 px-4">
        <div className="max-w-md mx-auto">
          <div className="bg-slate-900/50 border border-amber-900/30 rounded-lg p-6 text-center">
            <Sparkles className="w-6 h-6 mx-auto mb-3 text-amber-600/60" />
            <h3 className="font-cinzel text-slate-300 mb-2">Support This Work</h3>
            <p className="text-slate-500 text-sm mb-4">
              This portal is offered freely. Contributions sustain its continuation.
            </p>
            <button
              onClick={handleDonate}
              className="px-6 py-2 bg-amber-900/30 hover:bg-amber-900/50 border border-amber-700/50 rounded text-amber-200/90 text-sm transition-colors"
              data-testid="donate-btn"
            >
              Pay What You Choose
            </button>
          </div>
        </div>
      </section>

      {/* Email Lead Capture */}
      <section className="py-12 px-4">
        <div className="max-w-md mx-auto">
          <div className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-6">
            <Mail className="w-6 h-6 mx-auto mb-3 text-slate-500" />
            <h3 className="font-cinzel text-center text-slate-300 mb-2">
              Join Where the Crowlands
            </h3>
            <p className="text-slate-500 text-sm text-center mb-4">
              Be notified when the full portal opens.
            </p>
            
            {emailSubmitted ? (
              <div className="flex items-center justify-center gap-2 text-green-500">
                <Check className="w-5 h-5" />
                <span>You&apos;re on the list</span>
              </div>
            ) : (
              <form onSubmit={handleEmailSubmit} className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-slate-500"
                  required
                  data-testid="email-input"
                />
                <button
                  type="submit"
                  disabled={emailSubmitting}
                  className="w-full px-4 py-2 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 rounded text-slate-300 text-sm transition-colors disabled:opacity-50"
                  data-testid="email-submit-btn"
                >
                  {emailSubmitting ? 'Joining...' : 'Notify Me'}
                </button>
                <p className="text-slate-600 text-xs text-center">
                  We&apos;ll email you when the full portal opens. Unsubscribe anytime.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Closing Truth */}
      <section className="py-16 px-4">
        <div className="max-w-xl mx-auto text-center">
          <div className="border-t border-b border-slate-800 py-8">
            <p className="font-cinzel text-lg text-slate-400 italic">
              Magic does not replace resistance.<br />
              <span className="text-slate-300">It steadies those who resist.</span>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

// Mode Card Component
const ModeCard = ({ number, title, subtitle, description, isActive, onClick, icon: Icon, featured, children }) => {
  return (
    <div className={cn(
      "border rounded-lg overflow-hidden transition-all",
      featured ? "border-amber-900/50" : "border-slate-700/50",
      isActive && "ring-1 ring-slate-600"
    )}>
      <button
        onClick={onClick}
        className={cn(
          "w-full p-6 text-left transition-colors",
          featured ? "bg-slate-900/70 hover:bg-slate-900/90" : "bg-slate-900/40 hover:bg-slate-900/60"
        )}
        data-testid={`mode-${number.toLowerCase()}-btn`}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
              featured ? "bg-amber-900/30" : "bg-slate-800"
            )}>
              <Icon className={cn("w-5 h-5", featured ? "text-amber-500/80" : "text-slate-400")} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-cinzel text-xs text-slate-500">OPTION {number}</span>
                {featured && (
                  <span className="px-2 py-0.5 bg-amber-900/30 rounded text-amber-500/80 text-xs">Featured</span>
                )}
              </div>
              <h3 className={cn(
                "font-cinzel text-lg mb-1",
                featured ? "text-slate-200" : "text-slate-300"
              )}>{title}</h3>
              <p className="text-slate-500 text-sm">{description}</p>
            </div>
          </div>
          {isActive ? (
            <ChevronUp className="w-5 h-5 text-slate-500 flex-shrink-0" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-500 flex-shrink-0" />
          )}
        </div>
      </button>
      
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="border-t border-slate-800 p-6 bg-slate-950/50">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Option I - Intention Mode
const IntentionMode = () => {
  return (
    <div className="space-y-6">
      <p className="text-slate-400 text-sm">
        This intention may be spoken aloud or inwardly, repeated daily or whenever steadiness is needed.
      </p>
      
      {/* Ward Image */}
      <div className="text-center">
        <img 
          src={WARD_IMAGE_URL} 
          alt="Ward for steadiness and clarity"
          className="w-48 h-48 mx-auto mb-2 rounded-lg opacity-80"
        />
        <p className="text-slate-600 text-xs italic">A ward for steadiness and clarity</p>
      </div>
      
      {/* Intention Text */}
      <div className="bg-slate-900/50 border border-slate-700/30 rounded-lg p-6">
        <h4 className="font-cinzel text-amber-600/80 text-sm mb-4 text-center">INTENTION</h4>
        <div className="text-slate-300 text-center leading-relaxed space-y-2">
          <p className="italic">I align myself with clarity, restraint, and protection.</p>
          <p className="italic">May all actions rooted in dignity and care be strengthened.</p>
          <p className="italic">May harm lose momentum, and conscience regain its voice.</p>
        </div>
      </div>
      
      {/* Download Ward */}
      <div className="text-center">
        <a
          href={WARD_IMAGE_URL}
          download="ward-steadiness-clarity.png"
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded text-slate-400 text-sm transition-colors"
          data-testid="download-ward-btn"
        >
          <Download className="w-4 h-4" />
          Download Ward
        </a>
      </div>
    </div>
  );
};

// Option II - Primary Working
const PrimaryWorking = ({ step, setStep, complete, setComplete, onComplete }) => {
  const steps = [
    {
      title: "Ground + Seal",
      duration: "2 minutes",
      content: (
        <div className="space-y-4 text-slate-300">
          <p>Sit upright, feet on the floor.</p>
          <p>Visualize yourself within a clear, sealed field — neutral, calm, intact.</p>
          <div className="bg-slate-900/50 border-l-2 border-amber-700/50 pl-4 py-2 italic">
            <p>I stand within my own field.</p>
            <p>No force enters me.</p>
            <p>No force leaves me distorted.</p>
          </div>
        </div>
      )
    },
    {
      title: "Name the Principle, Not the Enemy",
      duration: "2 minutes",
      content: (
        <div className="space-y-4 text-slate-300">
          <p>Silently acknowledge patterns — not people:</p>
          <ul className="list-disc list-inside text-slate-400 space-y-1 ml-4">
            <li>misuse of authority</li>
            <li>dehumanization</li>
            <li>cruelty enacted through systems</li>
            <li>violence justified as order</li>
          </ul>
          <p className="text-amber-600/70 text-sm italic mt-4">
            Do not visualize faces, uniforms, agencies, or nations.
          </p>
        </div>
      )
    },
    {
      title: "Invoke Impersonal Law",
      duration: "2 minutes",
      content: (
        <div className="space-y-4 text-slate-300">
          <div className="bg-slate-900/50 border-l-2 border-amber-700/50 pl-4 py-2 italic">
            <p>By the law that precedes all thrones,</p>
            <p>by the balance no power escapes,</p>
            <p>all force issued in violation of life, dignity, and truth</p>
            <p>is returned — not to flesh, not to fate,</p>
            <p>but to the source of its authorization.</p>
          </div>
          <p className="text-slate-500 text-sm">(Return authority, not pain.)</p>
        </div>
      )
    },
    {
      title: "Transmutation Clause",
      duration: "2 minutes",
      content: (
        <div className="space-y-4 text-slate-300">
          <div className="bg-slate-900/50 border-l-2 border-amber-700/50 pl-4 py-2 italic">
            <p>Let no returned force become suffering.</p>
            <p>Let it become awareness.</p>
            <p>Let it become restraint.</p>
            <p>Let it become the unmaking of false authority.</p>
          </div>
        </div>
      )
    },
    {
      title: "Benevolent Outcome Directive",
      duration: "2 minutes",
      content: (
        <div className="space-y-4 text-slate-300">
          <p>Visualize:</p>
          <ul className="list-disc list-inside text-slate-400 space-y-1 ml-4">
            <li>harmful orders losing momentum</li>
            <li>systems stalling under scrutiny</li>
            <li>restraint re-entering decision-making</li>
            <li>people protected by delay, exposure, and oversight</li>
          </ul>
          <div className="bg-slate-900/50 border-l-2 border-amber-700/50 pl-4 py-2 italic mt-4">
            <p>Where power feeds on fear, let clarity arise.</p>
            <p>Where cruelty hides, let consequence reveal.</p>
            <p>Where commands destroy, let conscience intervene.</p>
          </div>
        </div>
      )
    },
    {
      title: "Close the Circuit",
      duration: "1 minute",
      content: (
        <div className="space-y-4 text-slate-300">
          <div className="bg-slate-900/50 border-l-2 border-amber-700/50 pl-4 py-2 italic text-center">
            <p>The circuit is complete.</p>
            <p>The law holds.</p>
            <p>I am clear.</p>
          </div>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      setComplete(true);
      onComplete?.();
    }
  };

  const handlePrev = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  if (complete) {
    return (
      <div className="text-center py-8">
        <Check className="w-12 h-12 mx-auto mb-4 text-green-500/70" />
        <h4 className="font-cinzel text-slate-200 text-lg mb-2">The Working is Complete</h4>
        <p className="text-slate-500 text-sm mb-4">The circuit is sealed. Return as needed.</p>
        <button
          onClick={() => { setStep(0); setComplete(false); }}
          className="text-amber-600/70 text-sm hover:text-amber-500 transition-colors"
        >
          Begin Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Framing */}
      <div className="bg-amber-900/10 border border-amber-900/30 rounded-lg p-4">
        <p className="text-slate-400 text-sm">
          This working is not a curse. It does not punish or retaliate. 
          It returns misused power to the impersonal law that governs consequence and restraint.
        </p>
      </div>

      {/* Progress */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-500">Step {step + 1} of {steps.length}</span>
        <span className="flex items-center gap-1 text-slate-600">
          <Clock className="w-4 h-4" />
          {steps[step].duration}
        </span>
      </div>

      {/* Step Content */}
      <div className="bg-slate-900/30 rounded-lg p-6">
        <h4 className="font-cinzel text-amber-500/80 text-lg mb-4">{steps[step].title}</h4>
        {steps[step].content}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={handlePrev}
          disabled={step === 0}
          className="px-4 py-2 text-slate-500 hover:text-slate-300 disabled:opacity-30 transition-colors"
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          className="px-6 py-2 bg-amber-900/30 hover:bg-amber-900/50 border border-amber-700/50 rounded text-amber-200/90 text-sm transition-colors"
          data-testid="working-next-btn"
        >
          {step === steps.length - 1 ? 'Complete Working' : 'Continue'}
        </button>
      </div>
    </div>
  );
};

// Option III - Clarity Against Propaganda
const ClarityWorking = ({ step, setStep, complete, setComplete, onComplete }) => {
  const steps = [
    {
      title: "Ground in Stillness",
      duration: "2 minutes",
      content: (
        <div className="space-y-4 text-slate-300">
          <p>Sit quietly. Close your eyes if comfortable.</p>
          <p>Feel the weight of your body. The solidity of where you sit.</p>
          <div className="bg-slate-900/50 border-l-2 border-slate-600/50 pl-4 py-2 italic">
            <p>I am here.</p>
            <p>I am present.</p>
            <p>I see clearly.</p>
          </div>
        </div>
      )
    },
    {
      title: "Name the Confusion, Not the Source",
      duration: "2 minutes",
      content: (
        <div className="space-y-4 text-slate-300">
          <p>Acknowledge, without naming specific actors:</p>
          <ul className="list-disc list-inside text-slate-400 space-y-1 ml-4">
            <li>deliberate distortion of fact</li>
            <li>repetition designed to exhaust</li>
            <li>emotion weaponized against reason</li>
            <li>false urgency meant to bypass thought</li>
          </ul>
          <p className="text-slate-500 text-sm mt-4 italic">
            Do not visualize faces, logos, or channels. Focus on the pattern, not the actor.
          </p>
        </div>
      )
    },
    {
      title: "Invoke the Light of Discernment",
      duration: "2 minutes",
      content: (
        <div className="space-y-4 text-slate-300">
          <p>Visualize a clear, steady light — not harsh, but revealing.</p>
          <div className="bg-slate-900/50 border-l-2 border-slate-600/50 pl-4 py-2 italic">
            <p>By the light that reveals without destroying,</p>
            <p>by the clarity that confusion cannot outlast,</p>
            <p>may all deception lose its grip.</p>
            <p>May the exhausted find rest.</p>
            <p>May the confused find ground.</p>
          </div>
        </div>
      )
    },
    {
      title: "Protection for the Vulnerable Mind",
      duration: "2 minutes",
      content: (
        <div className="space-y-4 text-slate-300">
          <p>Extend the light outward — not as force, but as shelter:</p>
          <ul className="list-disc list-inside text-slate-400 space-y-1 ml-4">
            <li>the elderly whose habits are exploited</li>
            <li>the young whose emotions are targeted</li>
            <li>the isolated whose loneliness is weaponized</li>
            <li>the fearful whose fear is fed deliberately</li>
          </ul>
          <div className="bg-slate-900/50 border-l-2 border-slate-600/50 pl-4 py-2 italic mt-4">
            <p>May they pause before believing.</p>
            <p>May they notice what feels wrong.</p>
            <p>May they trust their own stillness.</p>
          </div>
        </div>
      )
    },
    {
      title: "Seal and Return",
      duration: "1 minute",
      content: (
        <div className="space-y-4 text-slate-300">
          <p>Draw the light back to yourself. You are not responsible for all minds.</p>
          <div className="bg-slate-900/50 border-l-2 border-slate-600/50 pl-4 py-2 italic text-center">
            <p>I see clearly.</p>
            <p>I do not participate in confusion.</p>
            <p>I return to stillness.</p>
          </div>
        </div>
      )
    },
    {
      title: "Choose One Real-World Action",
      duration: "1 minute",
      content: (
        <div className="space-y-4 text-slate-300">
          <p>Before closing, commit to one concrete action:</p>
          <ul className="list-disc list-inside text-slate-400 space-y-2 ml-4">
            <li>Verify one claim before sharing it</li>
            <li>Speak calmly to one person caught in confusion</li>
            <li>Support one organization that counters disinformation</li>
            <li>Take a deliberate break from one source of noise</li>
          </ul>
          <p className="text-amber-600/70 text-sm italic mt-4">
            Inner work without outer action is incomplete.
          </p>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      setComplete(true);
      onComplete?.();
    }
  };

  const handlePrev = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  if (complete) {
    return (
      <div className="text-center py-8">
        <Eye className="w-12 h-12 mx-auto mb-4 text-slate-400" />
        <h4 className="font-cinzel text-slate-200 text-lg mb-2">Clarity Restored</h4>
        <p className="text-slate-500 text-sm mb-4">Return when the noise rises again.</p>
        <button
          onClick={() => { setStep(0); setComplete(false); }}
          className="text-slate-500 text-sm hover:text-slate-300 transition-colors"
        >
          Begin Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-500">Step {step + 1} of {steps.length}</span>
        <span className="flex items-center gap-1 text-slate-600">
          <Clock className="w-4 h-4" />
          {steps[step].duration}
        </span>
      </div>

      {/* Step Content */}
      <div className="bg-slate-900/30 rounded-lg p-6">
        <h4 className="font-cinzel text-slate-300 text-lg mb-4">{steps[step].title}</h4>
        {steps[step].content}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={handlePrev}
          disabled={step === 0}
          className="px-4 py-2 text-slate-500 hover:text-slate-300 disabled:opacity-30 transition-colors"
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          className="px-6 py-2 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 rounded text-slate-300 text-sm transition-colors"
          data-testid="clarity-next-btn"
        >
          {step === steps.length - 1 ? 'Complete Working' : 'Continue'}
        </button>
      </div>
    </div>
  );
};

export default InvisibleHelpers;
