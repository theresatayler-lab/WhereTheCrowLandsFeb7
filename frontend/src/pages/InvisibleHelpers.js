import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Eye, RotateCcw, Heart, Sparkles, ChevronDown, ChevronRight,
  Download, Mail, Copy, Check, Clock, Loader2, AlertCircle, X
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '../lib/utils';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const API_URL = process.env.REACT_APP_BACKEND_URL;

// Ward image for intention mode
const WARD_IMAGE_URL = "https://static.prod-images.emergentagent.com/jobs/2537f733-0ab6-4993-ac0a-8d03f27e2b17/images/9e706bffc320713991214bf94b1f146284ff9f87ebd1c847e0f6923612bd3c85.png";

// Form options
const BENEFICIARIES_OPTIONS = [
  { id: 'community', label: 'My community / neighbors' },
  { id: 'vulnerable', label: 'Vulnerable people' },
  { id: 'journalists', label: 'Journalists / truth-tellers' },
  { id: 'legal', label: 'Legal advocates' },
  { id: 'families', label: 'Families / children' },
  { id: 'election', label: 'Election integrity' },
  { id: 'mutual_aid', label: 'Mutual aid networks' },
];

const QUALITY_OPTIONS = [
  { id: 'clarity', label: 'Clarity' },
  { id: 'restraint', label: 'Restraint' },
  { id: 'courage', label: 'Courage' },
  { id: 'protection', label: 'Protection' },
  { id: 'conscience', label: 'Conscience' },
  { id: 'truth', label: 'Truth' },
  { id: 'solidarity', label: 'Solidarity' },
];

const TIME_HORIZON_OPTIONS = [
  { id: 'today', label: 'Today' },
  { id: 'this_week', label: 'This week' },
  { id: 'this_month', label: 'This month' },
  { id: 'ongoing', label: 'Ongoing (weekly cadence)' },
];

const PRACTICE_STYLE_OPTIONS = [
  { id: 'secular', label: 'Quiet / secular language' },
  { id: 'mystical', label: 'Mystical / angelic language' },
  { id: 'poetic', label: 'Poetic / mythic language' },
];

const ANCHOR_LENGTH_OPTIONS = [
  { id: 'short', label: 'Short (1 line)' },
  { id: 'medium', label: 'Medium (2-3 lines)' },
];

// Builder-specific options
const PATTERNS_OPTIONS = [
  { id: 'misuse_authority', label: 'Misuse of authority' },
  { id: 'dehumanization', label: 'Dehumanization' },
  { id: 'cruelty_system', label: 'Cruelty by system' },
  { id: 'violence_order', label: 'Violence justified as order' },
  { id: 'corruption', label: 'Corruption / impunity' },
];

const DISTORTION_CHANNELS_OPTIONS = [
  { id: 'news', label: 'News / media' },
  { id: 'social', label: 'Social feeds' },
  { id: 'workplace', label: 'Workplace' },
  { id: 'family', label: 'Family/community conversations' },
];

const RETURN_TYPES_OPTIONS = [
  { id: 'fear_control', label: 'Fear used as control' },
  { id: 'lies_power', label: 'Lies used as power' },
  { id: 'brutality', label: 'Brutality normalized' },
  { id: 'harmful_orders', label: 'Harmful orders' },
  { id: 'dehumanizing_rhetoric', label: 'Dehumanizing rhetoric' },
];

// Builder configurations
const BUILDERS = {
  lawful_return: {
    id: 'lawful_return',
    title: 'The Lawful Return of Misused Power',
    subtitle: 'Return authorization to impersonal law',
    description: 'A working that returns misused power to the higher law that governs consequence and restraint.',
    icon: Shield,
    color: 'amber',
    featured: true,
  },
  clarity: {
    id: 'clarity',
    title: 'Clarity Against Propaganda',
    subtitle: 'Discernment in times of confusion',
    description: 'A working for steadiness and truth when distortion surrounds you.',
    icon: Eye,
    color: 'slate',
  },
  return_to_sender: {
    id: 'return_to_sender',
    title: 'Return to Sender',
    subtitle: 'Benevolent return to source',
    description: 'Return distortion and coercive momentum to impersonal law for transmutation.',
    icon: RotateCcw,
    color: 'indigo',
  },
};

export const InvisibleHelpers = () => {
  const [activeBuilder, setActiveBuilder] = useState(null);
  const [formData, setFormData] = useState({
    beneficiaries: [],
    customBeneficiary: '',
    primary_quality: '',
    time_horizon: '',
    practice_style: '',
    anchor_length: 'short',
    action_intention: '', // Changed from action_pledge - now free text
    custom_name: '',
    patterns_to_neutralize: [],
    distortion_channels: [],
    return_types: [],
  });
  const [generating, setGenerating] = useState(false);
  const [generatedWorking, setGeneratedWorking] = useState(null);
  const [showEmailCapture, setShowEmailCapture] = useState(false);
  const [email, setEmail] = useState('');
  const [emailSubmitting, setEmailSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const workingRef = useRef(null);

  // Reset form when selecting a new builder
  const selectBuilder = (builderId) => {
    setFormData({
      beneficiaries: [],
      customBeneficiary: '',
      primary_quality: '',
      time_horizon: '',
      practice_style: '',
      anchor_length: 'short',
      action_intention: '',
      custom_name: '',
      patterns_to_neutralize: [],
      distortion_channels: [],
      return_types: [],
    });
    setGeneratedWorking(null);
    setActiveBuilder(builderId);
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleArrayField = (field, value) => {
    setFormData(prev => {
      const arr = prev[field];
      if (arr.includes(value)) {
        return { ...prev, [field]: arr.filter(v => v !== value) };
      } else {
        return { ...prev, [field]: [...arr, value] };
      }
    });
  };

  const isFormValid = () => {
    const base = formData.beneficiaries.length > 0 &&
                 formData.primary_quality &&
                 formData.time_horizon &&
                 formData.practice_style;
    
    if (activeBuilder === 'lawful_return') {
      return base && formData.patterns_to_neutralize.length > 0;
    } else if (activeBuilder === 'clarity') {
      return base && formData.distortion_channels.length > 0;
    } else if (activeBuilder === 'return_to_sender') {
      return base && formData.return_types.length > 0;
    }
    return base;
  };

  const handleGenerate = async () => {
    if (!isFormValid()) {
      toast.error('Please complete all required fields');
      return;
    }

    setGenerating(true);
    try {
      // Prepare beneficiaries including custom
      let beneficiaries = [...formData.beneficiaries];
      if (formData.customBeneficiary.trim()) {
        beneficiaries.push(formData.customBeneficiary.trim());
      }

      const payload = {
        builder_type: activeBuilder,
        beneficiaries,
        primary_quality: formData.primary_quality,
        time_horizon: formData.time_horizon,
        practice_style: formData.practice_style,
        anchor_length: formData.anchor_length,
        action_pledge: formData.action_intention || 'Take one concrete action to support this intention',
        custom_name: formData.custom_name || null,
        patterns_to_neutralize: activeBuilder === 'lawful_return' ? formData.patterns_to_neutralize : null,
        distortion_channels: activeBuilder === 'clarity' ? formData.distortion_channels : null,
        return_types: activeBuilder === 'return_to_sender' ? formData.return_types : null,
      };

      const response = await fetch(`${API_URL}/api/invisible-helpers/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      
      if (data.success && data.working) {
        setGeneratedWorking(data.working);
        toast.success('Working generated successfully');
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

  const handleCopyToClipboard = async () => {
    if (!generatedWorking) return;
    
    const text = formatWorkingAsText(generatedWorking);
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const formatWorkingAsText = (working) => {
    let text = `${working.title}\n\n`;
    text += `INTENTION\n${working.intention}\n\n`;
    text += `ANCHOR PHRASE\n${working.anchor_phrase}\n\n`;
    text += `ETHICAL FRAME\n${working.ethical_frame}\n\n`;
    text += `GUIDED WORKING\n`;
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
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth - 20;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Dark background
      pdf.setFillColor(10, 15, 26);
      pdf.rect(0, 0, pdfWidth, pdfHeight, 'F');

      let yPosition = 10;
      if (imgHeight <= pdfHeight - 20) {
        pdf.addImage(imgData, 'PNG', 10, yPosition, imgWidth, imgHeight);
      } else {
        // Multi-page handling
        const pageHeight = pdfHeight - 20;
        let heightLeft = imgHeight;
        
        pdf.addImage(imgData, 'PNG', 10, yPosition, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        
        while (heightLeft > 0) {
          pdf.addPage();
          pdf.setFillColor(10, 15, 26);
          pdf.rect(0, 0, pdfWidth, pdfHeight, 'F');
          yPosition = -(imgHeight - heightLeft) + 10;
          pdf.addImage(imgData, 'PNG', 10, yPosition, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
      }

      const filename = `${generatedWorking.title?.replace(/[^a-z0-9]/gi, '_') || 'working'}.pdf`;
      pdf.save(filename);
      toast.success('PDF downloaded');
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('Failed to generate PDF');
    }
  };

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
        toast.success("You'll be notified when the full portal opens.");
        setShowEmailCapture(false);
      }
    } catch (error) {
      toast.error('Failed to submit. Please try again.');
    } finally {
      setEmailSubmitting(false);
    }
  };

  const resetBuilder = () => {
    setGeneratedWorking(null);
    setFormData({
      beneficiaries: [],
      customBeneficiary: '',
      primary_quality: '',
      time_horizon: '',
      practice_style: '',
      anchor_length: 'short',
      action_intention: '',
      custom_name: '',
      patterns_to_neutralize: [],
      distortion_channels: [],
      return_types: [],
    });
  };

  return (
    <div className="min-h-screen bg-[#0a0f1a]" data-testid="invisible-helpers-page">
      {/* Hero Section */}
      <section className="relative py-12 md:py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)`,
            backgroundSize: '100px 100px'
          }} />
        </div>
        
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Shield className="w-10 h-10 mx-auto mb-4 text-slate-400" />
            <h1 className="font-cinzel text-2xl md:text-3xl lg:text-4xl text-slate-200 mb-3">
              Calling Invisible Helpers
              <span className="block text-slate-400 text-xl md:text-2xl mt-1">from the Inner Planes</span>
            </h1>
            <p className="font-cinzel text-sm text-amber-600/80 italic">
              A coordinated working for protection, clarity, and lawful return
            </p>
          </motion.div>
        </div>
      </section>

      {/* Opening Context - Collapsed */}
      <section className="px-4 pb-8">
        <div className="max-w-3xl mx-auto">
          <details className="bg-slate-900/30 border border-slate-700/50 rounded-lg">
            <summary className="px-6 py-4 cursor-pointer text-slate-400 text-sm hover:text-slate-300 transition-colors">
              About this portal...
            </summary>
            <div className="px-6 pb-6 text-slate-400 text-sm leading-relaxed space-y-3">
              <p>During the Second World War, when physical gathering was impossible, spiritual practitioners coordinated quiet inner work to support those resisting harm.</p>
              <p>This portal continues that tradition. The work here does not replace action. It does not command, punish, or attack. It strengthens clarity, restraint, protection, and lawful consequence.</p>
              <p className="text-amber-600/70 italic">You are invited to engage calmly, ethically, and in your own time.</p>
            </div>
          </details>
        </div>
      </section>

      {/* Builder Selection or Active Builder */}
      <section className="px-4 pb-12">
        <div className="max-w-4xl mx-auto">
          {!activeBuilder && !generatedWorking ? (
            <>
              <h2 className="font-cinzel text-lg text-center text-slate-400 mb-6">
                Choose Your Working
              </h2>
              <div className="grid md:grid-cols-3 gap-4">
                {Object.values(BUILDERS).map(builder => (
                  <BuilderCard
                    key={builder.id}
                    builder={builder}
                    onClick={() => selectBuilder(builder.id)}
                  />
                ))}
              </div>
            </>
          ) : generatedWorking ? (
            <GeneratedWorkingView
              working={generatedWorking}
              workingRef={workingRef}
              onCopy={handleCopyToClipboard}
              onDownload={handleDownloadPDF}
              onReset={resetBuilder}
              onBack={() => { setGeneratedWorking(null); setActiveBuilder(null); }}
              copied={copied}
              builderConfig={BUILDERS[activeBuilder]}
            />
          ) : (
            <BuilderForm
              builderType={activeBuilder}
              builderConfig={BUILDERS[activeBuilder]}
              formData={formData}
              onFormChange={handleFormChange}
              onToggleArray={toggleArrayField}
              onGenerate={handleGenerate}
              onBack={() => setActiveBuilder(null)}
              generating={generating}
              isValid={isFormValid()}
            />
          )}
        </div>
      </section>

      {/* Ethical Statement */}
      <section className="py-8 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-block px-6 py-4 border border-slate-700/50 rounded-lg bg-slate-900/30">
            <h3 className="font-cinzel text-xs text-amber-600/80 mb-2 tracking-wider">ETHICAL FRAME</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              These workings do not punish. They restore balance through impersonal law.<br />
              They seek restraint, clarity, and protection — never harm.
            </p>
          </div>
        </div>
      </section>

      {/* Donation + Email Section */}
      <section className="py-8 px-4">
        <div className="max-w-lg mx-auto flex flex-col md:flex-row gap-4">
          {/* Donation */}
          <div className="flex-1 bg-slate-900/50 border border-amber-900/30 rounded-lg p-5 text-center">
            <Sparkles className="w-5 h-5 mx-auto mb-2 text-amber-600/60" />
            <h3 className="font-cinzel text-slate-300 text-sm mb-1">Support This Work</h3>
            <p className="text-slate-600 text-xs mb-3">Contributions sustain this portal.</p>
            <button
              onClick={() => window.open(`${API_URL}/api/stripe/create-checkout?mode=donation`, '_blank')}
              className="px-4 py-1.5 bg-amber-900/30 hover:bg-amber-900/50 border border-amber-700/50 rounded text-amber-200/90 text-xs transition-colors"
              data-testid="donate-btn"
            >
              Pay What You Choose
            </button>
          </div>
          
          {/* Email */}
          <div className="flex-1 bg-slate-900/50 border border-slate-700/50 rounded-lg p-5 text-center">
            <Mail className="w-5 h-5 mx-auto mb-2 text-slate-500" />
            <h3 className="font-cinzel text-slate-300 text-sm mb-1">Stay Connected</h3>
            <p className="text-slate-600 text-xs mb-3">Join when the full portal opens.</p>
            <button
              onClick={() => setShowEmailCapture(true)}
              className="px-4 py-1.5 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 rounded text-slate-300 text-xs transition-colors"
            >
              Notify Me
            </button>
          </div>
        </div>
      </section>

      {/* Closing Truth */}
      <section className="py-12 px-4">
        <div className="max-w-xl mx-auto text-center">
          <div className="border-t border-b border-slate-800 py-6">
            <p className="font-cinzel text-base text-slate-400 italic">
              Magic does not replace resistance.<br />
              <span className="text-slate-300">It steadies those who resist.</span>
            </p>
          </div>
        </div>
      </section>

      {/* Email Modal */}
      <AnimatePresence>
        {showEmailCapture && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
            onClick={() => setShowEmailCapture(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-slate-900 border border-slate-700 rounded-lg p-6 max-w-sm w-full"
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setShowEmailCapture(false)}
                className="absolute top-4 right-4 text-slate-500 hover:text-slate-300"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="font-cinzel text-slate-200 mb-4">Join the Portal</h3>
              <form onSubmit={handleEmailSubmit} className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-slate-500 text-sm"
                  required
                />
                <button
                  type="submit"
                  disabled={emailSubmitting}
                  className="w-full px-4 py-2 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 rounded text-slate-300 text-sm transition-colors disabled:opacity-50"
                >
                  {emailSubmitting ? 'Joining...' : 'Notify Me'}
                </button>
                <p className="text-slate-600 text-xs text-center">
                  We&apos;ll email you when the full portal opens. Unsubscribe anytime.
                </p>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Builder Card Component
const BuilderCard = ({ builder, onClick }) => {
  const Icon = builder.icon;
  const colorClasses = {
    amber: 'border-amber-900/50 bg-amber-900/10 hover:bg-amber-900/20',
    slate: 'border-slate-700/50 bg-slate-900/30 hover:bg-slate-900/50',
    indigo: 'border-indigo-900/50 bg-indigo-900/10 hover:bg-indigo-900/20',
  };
  const iconColors = {
    amber: 'text-amber-500/80',
    slate: 'text-slate-400',
    indigo: 'text-indigo-400',
  };
  
  return (
    <button
      onClick={onClick}
      className={cn(
        "p-6 rounded-lg border text-left transition-all group",
        colorClasses[builder.color]
      )}
      data-testid={`builder-${builder.id}-btn`}
    >
      <Icon className={cn("w-8 h-8 mb-3", iconColors[builder.color])} />
      <h3 className="font-cinzel text-slate-200 mb-1">{builder.title}</h3>
      <p className="text-slate-500 text-xs mb-2">{builder.subtitle}</p>
      <p className="text-slate-600 text-xs">{builder.description}</p>
      <div className="mt-4 flex items-center text-xs text-slate-500 group-hover:text-slate-400 transition-colors">
        <span>Begin</span>
        <ChevronRight className="w-4 h-4 ml-1" />
      </div>
    </button>
  );
};

// Builder Form Component
const BuilderForm = ({ 
  builderType, 
  builderConfig, 
  formData, 
  onFormChange, 
  onToggleArray, 
  onGenerate, 
  onBack,
  generating,
  isValid 
}) => {
  const Icon = builderConfig.icon;
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={onBack}
          className="text-slate-500 hover:text-slate-300 transition-colors"
        >
          ← Back
        </button>
        <div className="flex items-center gap-3">
          <Icon className="w-6 h-6 text-amber-500/80" />
          <h2 className="font-cinzel text-xl text-slate-200">{builderConfig.title}</h2>
        </div>
      </div>

      {/* Form */}
      <div className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-6 space-y-6">
        {/* Beneficiaries */}
        <FormSection title="Who are you protecting/supporting?" required>
          <div className="flex flex-wrap gap-2">
            {BENEFICIARIES_OPTIONS.map(opt => (
              <ToggleChip
                key={opt.id}
                label={opt.label}
                selected={formData.beneficiaries.includes(opt.label)}
                onClick={() => onToggleArray('beneficiaries', opt.label)}
              />
            ))}
          </div>
          <input
            type="text"
            placeholder="Add custom (optional)"
            value={formData.customBeneficiary}
            onChange={(e) => onFormChange('customBeneficiary', e.target.value)}
            className="mt-2 w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded text-slate-300 text-sm placeholder:text-slate-600 focus:outline-none focus:border-slate-500"
          />
        </FormSection>

        {/* Primary Quality */}
        <FormSection title="Primary quality to strengthen" required>
          <div className="flex flex-wrap gap-2">
            {QUALITY_OPTIONS.map(opt => (
              <ToggleChip
                key={opt.id}
                label={opt.label}
                selected={formData.primary_quality === opt.label}
                onClick={() => onFormChange('primary_quality', opt.label)}
                radio
              />
            ))}
          </div>
        </FormSection>

        {/* Builder-specific fields */}
        {builderType === 'lawful_return' && (
          <FormSection title="Pattern(s) to neutralize" required>
            <div className="flex flex-wrap gap-2">
              {PATTERNS_OPTIONS.map(opt => (
                <ToggleChip
                  key={opt.id}
                  label={opt.label}
                  selected={formData.patterns_to_neutralize.includes(opt.label)}
                  onClick={() => onToggleArray('patterns_to_neutralize', opt.label)}
                />
              ))}
            </div>
          </FormSection>
        )}

        {builderType === 'clarity' && (
          <FormSection title="Where you encounter distortion most" required>
            <div className="flex flex-wrap gap-2">
              {DISTORTION_CHANNELS_OPTIONS.map(opt => (
                <ToggleChip
                  key={opt.id}
                  label={opt.label}
                  selected={formData.distortion_channels.includes(opt.label)}
                  onClick={() => onToggleArray('distortion_channels', opt.label)}
                />
              ))}
            </div>
          </FormSection>
        )}

        {builderType === 'return_to_sender' && (
          <FormSection title="What is being returned (impersonally)" required>
            <div className="flex flex-wrap gap-2">
              {RETURN_TYPES_OPTIONS.map(opt => (
                <ToggleChip
                  key={opt.id}
                  label={opt.label}
                  selected={formData.return_types.includes(opt.label)}
                  onClick={() => onToggleArray('return_types', opt.label)}
                />
              ))}
            </div>
            <p className="text-amber-600/60 text-xs mt-2 italic">
              Note: This returns distortion to impersonal law for transmutation — not pain or harm.
            </p>
          </FormSection>
        )}

        {/* Time Horizon */}
        <FormSection title="Time horizon" required>
          <div className="flex flex-wrap gap-2">
            {TIME_HORIZON_OPTIONS.map(opt => (
              <ToggleChip
                key={opt.id}
                label={opt.label}
                selected={formData.time_horizon === opt.label}
                onClick={() => onFormChange('time_horizon', opt.label)}
                radio
              />
            ))}
          </div>
        </FormSection>

        {/* Practice Style */}
        <FormSection title="Your practice style" required>
          <div className="flex flex-wrap gap-2">
            {PRACTICE_STYLE_OPTIONS.map(opt => (
              <ToggleChip
                key={opt.id}
                label={opt.label}
                selected={formData.practice_style === opt.label}
                onClick={() => onFormChange('practice_style', opt.label)}
                radio
              />
            ))}
          </div>
        </FormSection>

        {/* Anchor Length */}
        <FormSection title="Anchor phrase length">
          <div className="flex flex-wrap gap-2">
            {ANCHOR_LENGTH_OPTIONS.map(opt => (
              <ToggleChip
                key={opt.id}
                label={opt.label}
                selected={formData.anchor_length === opt.id}
                onClick={() => onFormChange('anchor_length', opt.id)}
                radio
              />
            ))}
          </div>
        </FormSection>

        {/* Action Pledge */}
        <FormSection title="Real-world action pledge" required>
          <div className="flex flex-wrap gap-2">
            {ACTION_PLEDGE_OPTIONS.map(opt => (
              <ToggleChip
                key={opt.id}
                label={opt.label}
                selected={formData.action_pledge === opt.label}
                onClick={() => onFormChange('action_pledge', opt.label)}
                radio
              />
            ))}
          </div>
        </FormSection>

        {/* Custom Name */}
        <FormSection title="Name for this working (optional)">
          <input
            type="text"
            placeholder="Leave blank to auto-generate"
            value={formData.custom_name}
            onChange={(e) => onFormChange('custom_name', e.target.value)}
            className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded text-slate-300 text-sm placeholder:text-slate-600 focus:outline-none focus:border-slate-500"
          />
        </FormSection>

        {/* Generate Button */}
        <div className="pt-4 border-t border-slate-700/50">
          <button
            onClick={onGenerate}
            disabled={!isValid || generating}
            className={cn(
              "w-full py-3 rounded font-cinzel text-sm transition-all",
              isValid && !generating
                ? "bg-amber-900/40 hover:bg-amber-900/60 border border-amber-700/50 text-amber-200"
                : "bg-slate-800 border border-slate-700 text-slate-500 cursor-not-allowed"
            )}
            data-testid="generate-working-btn"
          >
            {generating ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating Working...
              </span>
            ) : (
              'Generate My Working'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Form Section Component
const FormSection = ({ title, required, children }) => (
  <div>
    <label className="block text-slate-300 text-sm mb-2">
      {title}
      {required && <span className="text-amber-600/70 ml-1">*</span>}
    </label>
    {children}
  </div>
);

// Toggle Chip Component
const ToggleChip = ({ label, selected, onClick, radio }) => (
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

// Generated Working View Component
const GeneratedWorkingView = ({ 
  working, 
  workingRef, 
  onCopy, 
  onDownload, 
  onReset,
  onBack,
  copied,
  builderConfig 
}) => {
  return (
    <div className="space-y-6">
      {/* Actions Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="text-slate-500 hover:text-slate-300 transition-colors text-sm"
        >
          ← Choose Different Working
        </button>
        <div className="flex gap-2">
          <button
            onClick={onCopy}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-slate-300 text-sm transition-colors"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
          <button
            onClick={onDownload}
            className="flex items-center gap-2 px-4 py-2 bg-amber-900/40 hover:bg-amber-900/60 border border-amber-700/50 rounded text-amber-200 text-sm transition-colors"
            data-testid="download-pdf-btn"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </button>
        </div>
      </div>

      {/* Working Content */}
      <div 
        ref={workingRef}
        className="bg-slate-900/70 border border-slate-700/50 rounded-lg p-8 space-y-8"
      >
        {/* Title */}
        <div className="text-center border-b border-slate-700/50 pb-6">
          <h2 className="font-cinzel text-2xl text-slate-200 mb-2">{working.title}</h2>
          <p className="text-slate-500 text-sm italic">{builderConfig?.subtitle}</p>
        </div>

        {/* Intention */}
        <div>
          <h3 className="font-cinzel text-amber-600/80 text-sm mb-2 tracking-wider">INTENTION</h3>
          <p className="text-slate-300 italic">{working.intention}</p>
        </div>

        {/* Anchor Phrase */}
        <div className="bg-slate-800/50 border-l-2 border-amber-700/50 p-4">
          <h3 className="font-cinzel text-amber-600/80 text-xs mb-2 tracking-wider">ANCHOR PHRASE</h3>
          <p className="text-slate-200 italic whitespace-pre-line">{working.anchor_phrase}</p>
        </div>

        {/* Ethical Frame */}
        <div className="bg-amber-900/10 border border-amber-900/30 rounded-lg p-4">
          <h3 className="font-cinzel text-amber-600/80 text-xs mb-2 tracking-wider">ETHICAL FRAME</h3>
          <p className="text-slate-400 text-sm whitespace-pre-line">{working.ethical_frame}</p>
        </div>

        {/* Guided Working */}
        <div>
          <h3 className="font-cinzel text-amber-600/80 text-sm mb-4 tracking-wider">GUIDED WORKING</h3>
          <div className="space-y-6">
            {working.guided_working?.map((step, idx) => (
              <div key={idx} className="border-l-2 border-slate-700 pl-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-amber-500/70 font-mono text-xs">{step.step}.</span>
                  <h4 className="text-slate-200 font-medium">{step.title}</h4>
                  <span className="text-slate-600 text-xs flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {step.duration}
                  </span>
                </div>
                <p className="text-slate-400 text-sm mb-2">{step.instructions}</p>
                {step.spoken_words && (
                  <div className="bg-slate-800/30 border-l-2 border-amber-700/30 p-3 mt-2">
                    <p className="text-slate-300 italic text-sm">&ldquo;{step.spoken_words}&rdquo;</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Action Pledge */}
        <div className="bg-slate-800/50 rounded-lg p-4">
          <h3 className="font-cinzel text-amber-600/80 text-xs mb-2 tracking-wider">REAL-WORLD ACTION PLEDGE</h3>
          <p className="text-slate-300 text-sm">{working.action_pledge}</p>
        </div>

        {/* Closing Truth */}
        <div className="text-center pt-4 border-t border-slate-700/50">
          <p className="text-slate-500 italic text-sm">{working.closing_truth}</p>
        </div>
      </div>

      {/* Generate Another */}
      <div className="text-center">
        <button
          onClick={onReset}
          className="text-slate-500 hover:text-slate-300 text-sm transition-colors"
        >
          Generate another working with different options
        </button>
      </div>
    </div>
  );
};

export default InvisibleHelpers;
