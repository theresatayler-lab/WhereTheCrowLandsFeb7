import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Heart, Eye, MapPin, Hand, Package,
  Loader2, ArrowLeft, RefreshCw, Save, Check
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { DarkSection, LightSection, GrandDivider, MysticalDivider, ElaborateCorner, PageHeader, LightOrnateCard, OrnateCard, ATMOSPHERIC_IMAGES } from '../components/OrnateElements';

const API_URL = process.env.REACT_APP_BACKEND_URL;

// Cathleen's image
const CATHLEEN_IMAGE = "/images/guides/cathleen/cathleen-main.png";

const WardCard = ({ ward, index, situation, onSave, isSaving, isSaved, isLight }) => {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.2 }}
      className={`rounded-lg overflow-hidden ${isLight 
        ? 'bg-cream/60 border-2 border-crimson/20' 
        : 'bg-navy-mid border-2 border-gold/30'}`}
    >
      {/* Header */}
      <div 
        className={`p-5 cursor-pointer transition-colors ${isLight ? 'hover:bg-crimson/5' : 'hover:bg-gold/5'}`}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-full flex-shrink-0 ${isLight ? 'bg-crimson/10' : 'bg-gold/10'}`}>
            <span className="text-3xl">{ward.symbol}</span>
          </div>
          <div className="flex-1">
            <p className={`font-montserrat text-xs uppercase tracking-wider mb-1 ${isLight ? 'text-crimson/70' : 'text-gold/70'}`}>
              {ward.category}
            </p>
            <h3 className={`font-cinzel text-xl mb-2 ${isLight ? 'text-crimson' : 'text-gold-light'}`}>{ward.name}</h3>
            <p className={`font-montserrat text-sm leading-relaxed ${isLight ? 'text-navy-dark/70' : 'text-cream/70'}`}>
              {ward.why_for_you}
            </p>
          </div>
        </div>
        
        <div className="mt-3 text-center">
          <span className={`font-montserrat text-xs ${isLight ? 'text-crimson/60' : 'text-gold/60'}`}>
            {expanded ? 'Click to collapse' : 'Click to learn more'}
          </span>
        </div>
      </div>
      
      {/* Expanded Content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`border-t overflow-hidden ${isLight ? 'border-crimson/20' : 'border-gold/20'}`}
          >
            <div className={`p-5 space-y-4 ${isLight ? 'bg-crimson/5' : 'bg-gold/5'}`}>
              {/* Meaning */}
              <div className="flex items-start gap-3">
                <Heart className={`w-5 h-5 mt-0.5 flex-shrink-0 ${isLight ? 'text-crimson' : 'text-crimson-bright'}`} />
                <div>
                  <p className={`font-montserrat text-xs uppercase tracking-wide mb-1 ${isLight ? 'text-navy-dark/50' : 'text-cream/50'}`}>
                    Deeper Meaning
                  </p>
                  <p className={`font-montserrat text-sm ${isLight ? 'text-navy-dark/80' : 'text-cream/80'}`}>
                    {ward.meaning}
                  </p>
                </div>
              </div>
              
              {/* Where to Find */}
              <div className="flex items-start gap-3">
                <MapPin className={`w-5 h-5 mt-0.5 flex-shrink-0 ${isLight ? 'text-crimson' : 'text-crimson-bright'}`} />
                <div>
                  <p className={`font-montserrat text-xs uppercase tracking-wide mb-1 ${isLight ? 'text-navy-dark/50' : 'text-cream/50'}`}>
                    Where to Find It
                  </p>
                  <p className={`font-montserrat text-sm ${isLight ? 'text-navy-dark/80' : 'text-cream/80'}`}>
                    {ward.where_to_find}
                  </p>
                </div>
              </div>
              
              {/* How to Choose */}
              {ward.how_to_choose && (
                <div className="flex items-start gap-3">
                  <Eye className={`w-5 h-5 mt-0.5 flex-shrink-0 ${isLight ? 'text-crimson' : 'text-crimson-bright'}`} />
                  <div>
                    <p className={`font-montserrat text-xs uppercase tracking-wide mb-1 ${isLight ? 'text-navy-dark/50' : 'text-cream/50'}`}>
                      How to Know It&apos;s The One
                    </p>
                    <p className={`font-montserrat text-sm ${isLight ? 'text-navy-dark/80' : 'text-cream/80'}`}>
                      {ward.how_to_choose}
                    </p>
                  </div>
                </div>
              )}
              
              {/* Activation */}
              <div className="flex items-start gap-3">
                <Sparkles className={`w-5 h-5 mt-0.5 flex-shrink-0 ${isLight ? 'text-crimson' : 'text-crimson-bright'}`} />
                <div>
                  <p className={`font-montserrat text-xs uppercase tracking-wide mb-1 ${isLight ? 'text-navy-dark/50' : 'text-cream/50'}`}>
                    How to Activate & Bond
                  </p>
                  <p className={`font-montserrat text-sm ${isLight ? 'text-navy-dark/80' : 'text-cream/80'}`}>
                    {ward.activation}
                  </p>
                </div>
              </div>
              
              {/* How to Carry */}
              {ward.how_to_carry && (
                <div className="flex items-start gap-3">
                  <Package className={`w-5 h-5 mt-0.5 flex-shrink-0 ${isLight ? 'text-crimson' : 'text-crimson-bright'}`} />
                  <div>
                    <p className={`font-montserrat text-xs uppercase tracking-wide mb-1 ${isLight ? 'text-navy-dark/50' : 'text-cream/50'}`}>
                      How to Carry It
                    </p>
                    <p className={`font-montserrat text-sm ${isLight ? 'text-navy-dark/80' : 'text-cream/80'}`}>
                      {ward.how_to_carry}
                    </p>
                  </div>
                </div>
              )}
              
              {/* Save Button */}
              <div className={`pt-4 border-t ${isLight ? 'border-crimson/20' : 'border-gold/20'}`}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSave(ward);
                  }}
                  disabled={isSaving || isSaved}
                  className={`w-full px-4 py-2 rounded-sm font-montserrat text-sm transition-all flex items-center justify-center gap-2 ${
                    isSaved 
                      ? 'bg-gold/20 text-gold border border-gold/30 cursor-default'
                      : isLight
                        ? 'bg-crimson/10 text-crimson border border-crimson/40 hover:bg-crimson/20'
                        : 'bg-gold/10 text-gold border border-gold/40 hover:bg-gold/20'
                  } ${isSaving ? 'opacity-50 cursor-wait' : ''}`}
                >
                  {isSaved ? (
                    <>
                      <Check className="w-4 h-4" />
                      Saved to Grimoire
                    </>
                  ) : isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save to My Grimoire
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const WardFinder = () => {
  const navigate = useNavigate();
  const [situation, setSituation] = useState('');
  const [personality, setPersonality] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [savingWards, setSavingWards] = useState({});
  const [savedWards, setSavedWards] = useState({});
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!situation.trim()) {
      toast.error('Please describe your situation or what you need help with');
      return;
    }
    
    setIsLoading(true);
    setResult(null);
    setSavedWards({});
    
    try {
      const response = await fetch(`${API_URL}/api/ai/suggest-ward`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          situation: situation.trim(),
          personality: personality.trim() || null
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to get ward suggestions');
      }
      
      const data = await response.json();
      setResult(data.result);
      toast.success('Cathleen has chosen your wards');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Ward finder error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSaveWard = async (ward) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      toast.error('Please log in to save wards to your grimoire');
      navigate('/auth');
      return;
    }
    
    const wardKey = ward.name;
    setSavingWards(prev => ({ ...prev, [wardKey]: true }));
    
    try {
      const response = await fetch(`${API_URL}/api/grimoire/save-ward`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ward_data: ward,
          situation: situation.trim(),
          archetype_id: 'kathleen',
          archetype_name: 'Cathleen'
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 403 || errorData.detail?.error === 'feature_locked') {
          toast.error('Upgrade to Pro to save wards to your grimoire!', {
            action: {
              label: 'Upgrade',
              onClick: () => navigate('/upgrade')
            }
          });
          return;
        }
        throw new Error('Failed to save ward');
      }
      
      setSavedWards(prev => ({ ...prev, [wardKey]: true }));
      toast.success(`${ward.name} saved to your grimoire!`);
    } catch (error) {
      console.error('Save ward error:', error);
      toast.error('Failed to save ward. Please try again.');
    } finally {
      setSavingWards(prev => ({ ...prev, [wardKey]: false }));
    }
  };
  
  const handleReset = () => {
    setResult(null);
    setSituation('');
    setPersonality('');
  };
  
  return (
    <div className="min-h-screen">
      {/* Dark Hero Section */}
      <DarkSection className="py-12 sm:py-16 md:py-20 px-4 sm:px-6" variant="warm">
        <ElaborateCorner className="absolute top-3 left-3 w-16 h-16 sm:w-20 sm:h-20" variant="gold" />
        <ElaborateCorner className="absolute top-3 right-3 w-16 h-16 sm:w-20 sm:h-20 rotate-90" variant="gold" />
        
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <button
              onClick={() => navigate('/guides')}
              className="inline-flex items-center gap-2 text-cream/60 hover:text-cream mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="font-montserrat text-sm">Back to Guides</span>
            </button>
            
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gold/50 shadow-lg">
                  <img 
                    src={CATHLEEN_IMAGE} 
                    alt="Cathleen" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-crimson text-cream p-1.5 rounded-full border border-gold/50">
                  <Hand className="w-4 h-4" />
                </div>
              </div>
            </div>
            
            <PageHeader 
              icon={null}
              title="Find Your Ward"
              subtitle="with Cathleen, The Singer of Strength"
            />
            <p className="font-crimson text-base text-gold/80 italic max-w-xl mx-auto mt-2">
              &ldquo;Tell me what weighs on your heart, and I&apos;ll help you find the perfect talisman to carry. 
              Every ward chooses its keeper as much as the keeper chooses it.&rdquo;
            </p>
          </motion.div>
          
          <GrandDivider variant="moon" />
        </div>
      </DarkSection>

      {/* Form or Results Section */}
      <AnimatePresence mode="wait">
        {!result ? (
          /* Light Section - Form */
          <LightSection 
            className="py-12 sm:py-16 px-4 sm:px-6"
            atmosphericImage={ATMOSPHERIC_IMAGES.maiden}
            atmosphericOpacity={0.10}
            atmosphericPosition="right bottom"
            atmosphericTint="sepia"
          >
            <div className="max-w-2xl mx-auto">
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                <LightOrnateCard hover={false}>
                  {/* Situation Input */}
                  <div className="mb-6">
                    <label className="block font-cinzel text-sm text-crimson mb-2">
                      What do you need help with? <span className="text-gold-dark">*</span>
                    </label>
                    <textarea
                      value={situation}
                      onChange={(e) => setSituation(e.target.value)}
                      placeholder="I'm facing a difficult decision... / I need protection during... / I want to feel more confident when... / I'm grieving and need comfort..."
                      className="w-full h-32 px-4 py-3 bg-parchment border border-crimson/30 rounded-sm font-montserrat text-sm text-navy-dark placeholder:text-navy-dark/40 focus:outline-none focus:ring-2 focus:ring-crimson/50 focus:border-crimson resize-none"
                      disabled={isLoading}
                    />
                  </div>
                  
                  {/* Personality Input (Optional) */}
                  <div className="mb-6">
                    <label className="block font-cinzel text-sm text-crimson mb-2">
                      Tell me a bit about yourself <span className="text-navy-dark/50 font-montserrat text-xs">(optional)</span>
                    </label>
                    <textarea
                      value={personality}
                      onChange={(e) => setPersonality(e.target.value)}
                      placeholder="I'm introverted and love nature... / I work with my hands... / I'm drawn to the sea... / I'm a mother of two..."
                      className="w-full h-24 px-4 py-3 bg-parchment border border-crimson/30 rounded-sm font-montserrat text-sm text-navy-dark placeholder:text-navy-dark/40 focus:outline-none focus:ring-2 focus:ring-crimson/50 focus:border-crimson resize-none"
                      disabled={isLoading}
                    />
                    <p className="font-montserrat text-xs text-navy-dark/50 mt-1">
                      This helps Cathleen choose something that truly resonates with your spirit.
                    </p>
                  </div>
                  
                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading || !situation.trim()}
                    className="w-full px-6 py-4 bg-gradient-to-r from-crimson-deep via-crimson to-crimson-deep text-cream rounded-sm font-montserrat tracking-wider uppercase text-sm hover:from-crimson hover:via-crimson-bright hover:to-crimson transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 border border-gold/30"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Cathleen is choosing your wards...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        Find My Wards
                      </>
                    )}
                  </button>
                </LightOrnateCard>
              </motion.form>
              
              <MysticalDivider light />
              
              {/* Info Section */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <LightOrnateCard hover={false}>
                  <h3 className="font-cinzel text-lg text-crimson mb-3">About Wards & Talismans</h3>
                  <p className="font-montserrat text-sm text-navy-dark/70 leading-relaxed">
                    A ward is a physical object that carries your intention and offers protection or support. 
                    Unlike spells which are performed, a ward is <em className="text-crimson">carried</em>—in your pocket, on a chain, 
                    sewn into your coat lining. It becomes a silent companion, a touchstone for your magic.
                  </p>
                </LightOrnateCard>
              </motion.div>
            </div>
          </LightSection>
        ) : (
          /* Results - Alternating Sections */
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Light Section - Greeting */}
            <LightSection className="py-10 sm:py-14 px-4 sm:px-6">
              <div className="max-w-3xl mx-auto">
                <LightOrnateCard hover={false}>
                  <p className="font-crimson text-lg text-navy-dark/90 italic leading-relaxed text-center">
                    &ldquo;{result.greeting}&rdquo;
                  </p>
                </LightOrnateCard>
                <MysticalDivider light />
              </div>
            </LightSection>
            
            {/* Dark Section - Ward Cards */}
            <DarkSection className="py-10 sm:py-14 px-4 sm:px-6">
              <div className="max-w-3xl mx-auto">
                <h2 className="font-cinzel text-xl text-center text-gold-light mb-8">
                  Your Suggested Wards
                </h2>
                <div className="space-y-4">
                  {result.wards?.map((ward, index) => (
                    <WardCard 
                      key={index} 
                      ward={ward} 
                      index={index}
                      situation={situation}
                      onSave={handleSaveWard}
                      isSaving={savingWards[ward.name]}
                      isSaved={savedWards[ward.name]}
                      isLight={false}
                    />
                  ))}
                </div>
                <GrandDivider />
              </div>
            </DarkSection>
            
            {/* Light Section - Closing & Actions */}
            <LightSection className="py-10 sm:py-14 px-4 sm:px-6">
              <div className="max-w-3xl mx-auto">
                <LightOrnateCard hover={false}>
                  <p className="font-crimson text-lg text-navy-dark/90 italic leading-relaxed text-center">
                    &ldquo;{result.closing}&rdquo;
                  </p>
                  <p className="font-montserrat text-xs text-crimson/60 mt-3 text-center">— Cathleen</p>
                </LightOrnateCard>
                
                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                  <button
                    onClick={handleReset}
                    className="px-6 py-3 bg-cream border-2 border-crimson/30 rounded-sm font-montserrat text-sm text-crimson hover:bg-crimson/5 transition-colors flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Ask About Something Else
                  </button>
                  <button
                    onClick={() => navigate('/spell-request')}
                    className="px-6 py-3 bg-gradient-to-r from-crimson-deep via-crimson to-crimson-deep text-cream rounded-sm font-montserrat text-sm hover:from-crimson hover:via-crimson-bright hover:to-crimson transition-colors flex items-center justify-center gap-2 border border-gold/30"
                  >
                    <Sparkles className="w-4 h-4" />
                    Create a Spell with Cathleen
                  </button>
                </div>
              </div>
            </LightSection>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dark Footer */}
      <DarkSection className="py-8 px-4" variant="warm">
        <ElaborateCorner className="absolute bottom-3 left-3 w-16 h-16 sm:w-20 sm:h-20 -rotate-90" variant="gold" />
        <ElaborateCorner className="absolute bottom-3 right-3 w-16 h-16 sm:w-20 sm:h-20 rotate-180" variant="gold" />
        
        <div className="max-w-2xl mx-auto text-center relative z-10">
          <div className="flex items-center justify-center gap-4 text-gold/50">
            <span>☽</span>
            <span className="text-crimson/60">❦</span>
            <span>🪬</span>
            <span className="text-crimson/60">❦</span>
            <span>☾</span>
          </div>
        </div>
      </DarkSection>
    </div>
  );
};

export default WardFinder;
