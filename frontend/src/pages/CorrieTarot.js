import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Tv, Heart, ArrowLeft, RefreshCw, 
  Loader2, Crown, Lock, ChevronDown, ChevronUp, Eye
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { setCurrentArchetype } from '../components/OnboardingModal';
import { DarkSection, LightSection, GrandDivider, MysticalDivider, PageBorderFrame, PageHeader, ATMOSPHERIC_IMAGES } from '../components/OrnateElements';

const API_URL = process.env.REACT_APP_BACKEND_URL;

// Shigg's image
const SHIGG_IMAGE = "https://customer-assets.emergentagent.com/job_diywizardry/artifacts/127im9d9_Shig50.png";

// Occult card symbols for decoration
const CardSymbols = () => (
  <div className="flex items-center justify-center gap-2 text-gold/40 text-sm">
    <span>☽</span>
    <span>✧</span>
    <span>⛤</span>
    <span>✧</span>
    <span>☾</span>
  </div>
);

// Oracle Card component with enhanced styling
const OracleCard = ({ cardData, position, index, isExpanded, onToggle, light = false }) => {
  const positionStyles = {
    'Past': { accent: 'amber', symbol: '☾' },
    'Present': { accent: 'emerald', symbol: '☀' },
    'Future': { accent: 'violet', symbol: '☽' },
    'The Message': { accent: 'crimson', symbol: '👁' }
  };
  
  const style = positionStyles[position] || positionStyles['The Message'];
  const bgClass = light ? 'bg-white/90' : 'bg-navy-mid/80';
  const textClass = light ? 'text-navy-dark' : 'text-cream';
  const mutedClass = light ? 'text-navy-dark/70' : 'text-silver-mist/80';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.2 }}
      className="relative"
    >
      {/* Card frame */}
      <div className={`relative ${bgClass} border-2 border-gold/40 rounded-sm overflow-hidden`}>
        {/* Corner accents */}
        <span className="absolute -top-1 -left-1 text-crimson text-sm z-10">◆</span>
        <span className="absolute -top-1 -right-1 text-crimson text-sm z-10">◆</span>
        
        {/* Position header */}
        <div className={`px-4 py-3 border-b border-gold/30 ${light ? 'bg-gold/10' : 'bg-gold/5'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">{style.symbol}</span>
              <span className={`font-cinzel text-sm ${light ? 'text-crimson' : 'text-gold'}`}>{position}</span>
            </div>
            <button
              onClick={onToggle}
              className={`p-1 rounded-sm transition-colors ${light ? 'hover:bg-gold/20' : 'hover:bg-gold/10'}`}
            >
              {isExpanded ? <ChevronUp className="w-4 h-4 text-gold" /> : <ChevronDown className="w-4 h-4 text-gold" />}
            </button>
          </div>
        </div>
        
        {/* Card content */}
        <div className="p-4">
          {/* Card name and character */}
          <div className="text-center mb-4">
            <h3 className={`font-italiana text-2xl ${light ? 'text-crimson' : 'text-gold-light'} mb-1`}>
              {cardData.card_name}
            </h3>
            {cardData.character_name && (
              <p className={`font-cinzel text-sm ${mutedClass}`}>
                {cardData.character_name}
              </p>
            )}
            <CardSymbols />
          </div>
          
          {/* Reading */}
          <div className={`p-4 rounded-sm mb-4 ${light ? 'bg-crimson/5 border border-crimson/20' : 'bg-crimson/10 border border-crimson/20'}`}>
            <p className={`font-crimson text-base ${textClass} leading-relaxed italic`}>
              "{cardData.reading}"
            </p>
          </div>
          
          {/* Expanded content */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4"
              >
                {/* Keywords */}
                <div>
                  <p className={`font-montserrat text-xs uppercase tracking-wider ${light ? 'text-gold-dark' : 'text-gold/70'} mb-2`}>
                    ✦ Keywords
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {cardData.keywords?.map((keyword, i) => (
                      <span key={i} className={`px-2 py-1 text-xs font-montserrat rounded-sm ${light ? 'bg-gold/20 border border-gold/30 text-navy-dark/70' : 'bg-gold/10 border border-gold/30 text-gold/80'}`}>
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* Deeper meaning */}
                {cardData.deeper_meaning && (
                  <div>
                    <p className={`font-montserrat text-xs uppercase tracking-wider ${light ? 'text-gold-dark' : 'text-gold/70'} mb-2`}>
                      ✦ Deeper Meaning
                    </p>
                    <p className={`font-montserrat text-sm ${mutedClass}`}>
                      {cardData.deeper_meaning}
                    </p>
                  </div>
                )}
                
                {/* Advice */}
                {cardData.advice && (
                  <div className={`p-3 rounded-sm ${light ? 'bg-gold/10 border-l-2 border-gold' : 'bg-gold/5 border-l-2 border-gold'}`}>
                    <p className={`font-montserrat text-xs uppercase tracking-wider ${light ? 'text-gold-dark' : 'text-gold/70'} mb-1`}>
                      ✦ Shigg's Advice
                    </p>
                    <p className={`font-crimson text-sm ${textClass} italic`}>
                      "{cardData.advice}"
                    </p>
                  </div>
                )}
                
                {/* Rover's Return Line */}
                {cardData.rovers_return_line && (
                  <div className="text-center pt-4 border-t border-gold/20">
                    <p className={`font-montserrat text-xs ${light ? 'text-navy-dark/50' : 'text-silver-mist/50'} mb-1`}>As heard at the Rover's Return...</p>
                    <p className={`font-cinzel text-base ${light ? 'text-crimson' : 'text-gold'} italic`}>
                      "{cardData.rovers_return_line}"
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Bottom corner accents */}
        <span className="absolute -bottom-1 -left-1 text-crimson text-sm">◆</span>
        <span className="absolute -bottom-1 -right-1 text-crimson text-sm">◆</span>
      </div>
    </motion.div>
  );
};

const CorrieTarot = () => {
  const navigate = useNavigate();
  const [situation, setSituation] = useState('');
  const [question, setQuestion] = useState('');
  const [spreadType, setSpreadType] = useState('one_card');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [expandedCards, setExpandedCards] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [isPro, setIsPro] = useState(false);
  
  React.useEffect(() => {
    const checkUserStatus = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await fetch(`${API_URL}/api/users/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (response.ok) {
            const userData = await response.json();
            setIsPro(userData.subscription_tier === 'paid');
            setIsLoggedIn(true);
          }
        } catch (error) {
          console.error('Failed to check user status:', error);
        }
      }
    };
    checkUserStatus();
  }, []);
  
  const toggleCardExpand = (index) => {
    setExpandedCards(prev => ({ ...prev, [index]: !prev[index] }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!situation.trim()) {
      toast.error('Please tell Shigg what you\'re facing');
      return;
    }
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please log in to get a reading');
      navigate('/auth');
      return;
    }
    setIsLoading(true);
    setResult(null);
    setExpandedCards({ 0: true });
    
    try {
      const endpoint = spreadType === 'one_card' 
        ? `${API_URL}/api/oracle/cobbles/one-card`
        : spreadType === 'three_card'
        ? `${API_URL}/api/oracle/cobbles/three-card`
        : `${API_URL}/api/oracle/cobbles/spread`;
      
      const body = spreadType === 'street_spread' 
        ? { situation, question, spread_type: 'street_spread' }
        : { situation, question };
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 403) {
          toast.error(errorData.detail || 'This spread requires a Pro subscription', {
            action: { label: 'Upgrade', onClick: () => navigate('/upgrade') }
          });
          return;
        }
        throw new Error(errorData.detail || 'Failed to get reading');
      }
      
      const data = await response.json();
      setResult(data.result);
      toast.success('The cards have been drawn');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Oracle error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleReset = () => {
    setResult(null);
    setSituation('');
    setQuestion('');
    setExpandedCards({});
  };
  
  const spreadOptions = [
    { id: 'one_card', name: 'Quick Draw', description: 'One card, one message', pro: false, symbol: '🎴' },
    { id: 'three_card', name: 'Past, Present, Future', description: 'Three cards through time', pro: false, symbol: '☽☀☾' },
    { id: 'street_spread', name: 'The Street Spread', description: 'Five-card deep dive', pro: true, symbol: '⛤' }
  ];
  
  return (
    <PageBorderFrame>
      <div className="min-h-screen">
        {/* Dark Hero Section */}
        <DarkSection className="py-12 sm:py-16 md:py-20 px-4 sm:px-6" variant="warm">
          <div className="max-w-4xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            {/* Back button */}
            <button
              onClick={() => navigate('/guides')}
              className="inline-flex items-center gap-2 text-silver-mist/70 hover:text-gold mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="font-montserrat text-sm">Back to Guides</span>
            </button>
            
            {/* Shigg avatar with TV badge */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 blur-xl opacity-40" style={{ background: 'radial-gradient(circle, rgba(212, 168, 75, 0.4) 0%, transparent 70%)' }} />
                <div className="relative w-24 h-24 rounded-full overflow-hidden border-3 border-gold/60 shadow-lg">
                  <img src={SHIGG_IMAGE} alt="Shigg" className="w-full h-full object-cover" />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-crimson text-cream p-2 rounded-full border-2 border-gold/50">
                  <Tv className="w-4 h-4" />
                </div>
              </div>
            </div>
            
            {/* Title */}
            <div className="text-center">
              <h1 className="font-italiana text-3xl sm:text-4xl md:text-5xl text-gold-light mb-2"
                style={{ textShadow: '0 2px 30px rgba(212, 168, 75, 0.5)' }}>
                The Cobbles Oracle
              </h1>
              <p className="font-cinzel text-base sm:text-lg text-crimson-bright mb-2">
                What Would Corrie Do?
              </p>
              <p className="font-montserrat text-sm text-silver-mist/80 max-w-lg mx-auto">
                78 cards drawn from Coronation Street's wisdom. Characters and places that 
                know how ordinary people handle extraordinary troubles.
              </p>
            </div>
            
            <GrandDivider variant="eye" />
          </motion.div>
          
          {/* Not logged in */}
          {!isLoggedIn && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
              <div className="relative max-w-md mx-auto">
                <div className="absolute inset-0 border-2 border-gold/40 rounded-sm" />
                <div className="absolute inset-1.5 border border-crimson/30 rounded-sm" />
                <div className="absolute inset-0 bg-navy-mid/80 rounded-sm" />
                <div className="relative z-10 p-8">
                  <Lock className="w-12 h-12 text-gold/50 mx-auto mb-4" />
                  <h3 className="font-cinzel text-xl text-gold mb-2">Please Log In</h3>
                  <p className="font-montserrat text-sm text-silver-mist/70 mb-6">
                    Log in to receive your Cobbles Oracle reading.
                  </p>
                  <button
                    onClick={() => navigate('/auth')}
                    className="px-6 py-3 relative overflow-hidden rounded-sm font-montserrat tracking-widest uppercase text-sm"
                  >
                    <span className="absolute inset-0 border border-gold/50 rounded-sm" />
                    <span className="absolute inset-0.5 bg-gradient-to-r from-crimson-deep via-crimson to-crimson-deep rounded-sm" />
                    <span className="relative text-cream">Log In or Sign Up</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Results display */}
          {result && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              {/* Overall message */}
              <div className="relative">
                <div className="absolute inset-0 border-2 border-gold/40 rounded-sm" />
                <div className="absolute inset-1.5 border border-crimson/30 rounded-sm" />
                <div className="absolute inset-0 bg-navy-mid/80 rounded-sm backdrop-blur-sm" />
                <div className="relative z-10 p-6 text-center">
                  <span className="text-2xl mb-2 block">🔮</span>
                  <h3 className="font-cinzel text-lg text-gold mb-3">Shigg's Reading</h3>
                  <p className="font-crimson text-base text-cream/90 italic leading-relaxed">
                    "{result.overall_message}"
                  </p>
                  <p className="font-montserrat text-xs text-gold/60 mt-3">— Shigg</p>
                </div>
              </div>
              
              {/* Cards */}
              <div className={`grid gap-6 ${result.cards?.length === 1 ? 'grid-cols-1 max-w-lg mx-auto' : result.cards?.length === 3 ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
                {result.cards?.map((card, index) => (
                  <OracleCard
                    key={index}
                    cardData={card}
                    position={card.position || 'The Message'}
                    index={index}
                    isExpanded={expandedCards[index]}
                    onToggle={() => toggleCardExpand(index)}
                  />
                ))}
              </div>
              
              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <button
                  onClick={handleReset}
                  className="px-6 py-3 bg-navy-light border border-gold/40 rounded-sm font-montserrat text-sm text-gold/80 hover:border-gold/60 transition-colors flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Ask About Something Else
                </button>
                <button
                  onClick={() => {
                    setCurrentArchetype('shiggy');
                    navigate('/spell-request');
                  }}
                  className="px-6 py-3 relative overflow-hidden rounded-sm font-montserrat text-sm flex items-center justify-center gap-2"
                >
                  <span className="absolute inset-0 border border-gold/50 rounded-sm" />
                  <span className="absolute inset-0.5 bg-gradient-to-r from-crimson-deep via-crimson to-crimson-deep rounded-sm" />
                  <span className="relative text-cream flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Create a Spell with Shigg
                  </span>
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </DarkSection>
      
      {/* Light Section - Input Form */}
      {isLoggedIn && !result && (
        <LightSection 
          className="py-12 sm:py-16 px-4 sm:px-6"
          atmosphericImage={ATMOSPHERIC_IMAGES.maiden}
          atmosphericOpacity={0.10}
          atmosphericPosition="left top"
          atmosphericTint="sepia"
        >
          <div className="max-w-4xl mx-auto">
            <GrandDivider variant="moon" light />
            
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Spread Type Selection */}
              <div>
                <h3 className="font-cinzel text-lg text-crimson mb-4 text-center">Choose Your Spread</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {spreadOptions.map((spread) => (
                    <button
                      key={spread.id}
                      type="button"
                      disabled={spread.pro && !isPro}
                      onClick={() => setSpreadType(spread.id)}
                      className={`relative p-4 rounded-sm border-2 transition-all ${
                        spreadType === spread.id
                          ? 'border-crimson bg-crimson/10'
                          : 'border-gold/30 bg-white/80 hover:border-gold/50'
                      } ${spread.pro && !isPro ? 'opacity-60' : ''}`}
                    >
                      {spread.pro && (
                        <span className="absolute top-2 right-2">
                          <Crown className={`w-4 h-4 ${isPro ? 'text-gold' : 'text-navy-dark/40'}`} />
                        </span>
                      )}
                      <span className="text-2xl block mb-2">{spread.symbol}</span>
                      <h4 className="font-cinzel text-sm text-crimson mb-1">{spread.name}</h4>
                      <p className="font-montserrat text-xs text-navy-dark/60">{spread.description}</p>
                      {spread.pro && !isPro && (
                        <p className="font-montserrat text-xs text-gold-dark mt-2">Pro Only</p>
                      )}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Situation Input */}
              <div className="relative">
                <div className="absolute inset-0 border-2 border-crimson/30 rounded-sm" />
                <div className="absolute inset-1.5 border border-gold/30 rounded-sm" />
                <div className="absolute inset-0 bg-white/90 rounded-sm" />
                <div className="relative z-10 p-6">
                  <label className="block font-cinzel text-crimson mb-3">
                    What's troubling you, love?
                  </label>
                  <textarea
                    value={situation}
                    onChange={(e) => setSituation(e.target.value)}
                    placeholder="Tell Shigg what you're facing..."
                    rows={4}
                    className="w-full bg-cream/50 border-2 border-gold/40 focus:border-crimson/50 focus:ring-1 focus:ring-crimson/30 rounded-sm px-4 py-3 text-navy-dark font-montserrat placeholder:text-navy-dark/40"
                  />
                  
                  <label className="block font-cinzel text-crimson mt-4 mb-3">
                    Any specific question? (Optional)
                  </label>
                  <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="e.g., Should I confront them?"
                    className="w-full bg-cream/50 border-2 border-gold/40 focus:border-crimson/50 focus:ring-1 focus:ring-crimson/30 rounded-sm px-4 py-3 text-navy-dark font-montserrat placeholder:text-navy-dark/40"
                  />
                </div>
              </div>
              
              {/* Submit Button */}
              <div className="text-center">
                <button
                  type="submit"
                  disabled={isLoading || !situation.trim()}
                  className="px-8 py-4 relative overflow-hidden rounded-sm font-montserrat tracking-widest uppercase text-sm disabled:opacity-50"
                >
                  <span className="absolute inset-0 border-2 border-gold rounded-sm" />
                  <span className="absolute inset-1 bg-gradient-to-r from-crimson-deep via-crimson to-crimson-deep rounded-sm" />
                  <span className="relative text-cream flex items-center gap-2">
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Shigg is drawing the cards...
                      </>
                    ) : (
                      <>
                        <Eye className="w-5 h-5" />
                        Draw the Cards
                      </>
                    )}
                  </span>
                </button>
              </div>
            </form>
            
            <MysticalDivider light />
            
            {/* Info about the oracle */}
            <div className="relative mt-8">
              <div className="absolute inset-0 border-2 border-gold/40 rounded-sm" />
              <div className="absolute inset-1.5 border border-crimson/20 rounded-sm" />
              <div className="absolute inset-0 bg-white/80 rounded-sm" />
              <div className="relative z-10 p-6">
                <div className="flex items-start gap-4">
                  <Tv className="w-8 h-8 text-crimson flex-shrink-0" />
                  <div>
                    <h4 className="font-cinzel text-lg text-crimson mb-2">About The Cobbles Oracle</h4>
                    <p className="font-montserrat text-sm text-navy-dark/80 leading-relaxed mb-3">
                      This oracle draws wisdom from Coronation Street—78 cards representing characters, 
                      places, and situations from Britain's longest-running soap. Each card holds practical 
                      wisdom about love, loss, community, and surviving the everyday dramas of life.
                    </p>
                    <p className="font-crimson text-sm text-gold-dark italic">
                      "Ordinary people. Extraordinary problems. Common-sense solutions."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </LightSection>
      )}
      
      {/* Loading state */}
      {isLoading && (
        <LightSection className="py-12 sm:py-16 px-4 sm:px-6">
          <div className="max-w-md mx-auto text-center">
            <div className="relative">
              <div className="absolute inset-0 border-2 border-gold/40 rounded-sm" />
              <div className="absolute inset-0 bg-white/90 rounded-sm" />
              <div className="relative z-10 p-8">
                <div className="animate-pulse mb-4">
                  <span className="text-4xl">🔮</span>
                </div>
                <Loader2 className="w-8 h-8 text-crimson animate-spin mx-auto mb-4" />
                <p className="font-cinzel text-lg text-crimson mb-2">Shigg is consulting the cards...</p>
                <p className="font-montserrat text-sm text-navy-dark/60">
                  Listening to whispers from the Rover's Return...
                </p>
                <CardSymbols />
              </div>
            </div>
          </div>
        </LightSection>
      )}
    </div>
    </PageBorderFrame>
  );
};

export default CorrieTarot;
