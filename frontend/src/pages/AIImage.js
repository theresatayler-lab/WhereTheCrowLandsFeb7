import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Download, RotateCcw } from 'lucide-react';
import { BrandIcon } from '../components/BrandIcon';
import { toast } from 'sonner';
import { DarkSection, LightSection, GrandDivider, MysticalDivider, ElaborateCorner, PageHeader, LightOrnateCard, OrnateCard, ATMOSPHERIC_IMAGES } from '../components/OrnateElements';

const API_URL = process.env.REACT_APP_BACKEND_URL;

// Archetype style presets with visual info
const ARCHETYPE_STYLES = {
  shiggy: {
    id: 'shiggy',
    name: 'Shigg',
    title: 'Birds of Parliament',
    description: 'Edmund J. Sullivan pen-and-ink style, Rubáiyát illustrations, black & white engravings with birds, roses, and celestial symbols',
    emoji: '🐦',
    iconPath: '/icons/guides/guide-shigg.png',
    color: 'from-navy-dark to-navy-mid',
    borderColor: 'border-gold/50',
    keywords: ['black and white', 'cross-hatching', 'Art Nouveau', 'birds', 'roses']
  },
  kathleen: {
    id: 'kathleen',
    name: 'Cathleen',
    title: 'Singer of Strength',
    description: 'Celtic goddess aesthetic with the Morrigan, candlelit séances, Pre-Raphaelite oil painting quality',
    emoji: '🪶',
    iconPath: '/icons/guides/guide-cathleen.png',
    color: 'from-navy-dark to-navy-mid',
    borderColor: 'border-blue-400/50',
    keywords: ['Morrigan', 'crows', 'séance', 'Celtic', 'moonlight']
  },
  catherine: {
    id: 'catherine',
    name: 'Katherine',
    title: 'Weaver of Hidden Knowledge',
    description: 'Victorian spiritualist photography, spirit photography with ethereal double exposures, shadow work',
    emoji: '🧵',
    iconPath: '/icons/guides/guide-katherine.png',
    color: 'from-navy-dark to-navy-mid',
    borderColor: 'border-gold/50',
    keywords: ['Victorian', 'séance', 'spirit photography', 'textiles', 'shadow']
  },
  theresa: {
    id: 'theresa',
    name: 'Theresa',
    title: 'Seer & Storyteller',
    description: 'Modern collage with vintage elements, genealogy imagery, documentary style meets magical realism',
    emoji: '🪞',
    iconPath: '/icons/guides/guide-theresa.png',
    color: 'from-navy-dark to-navy-mid',
    borderColor: 'border-crimson-bright/50',
    keywords: ['collage', 'photographs', 'ancestry', 'documentary', 'truth-seeking']
  },
  neutral: {
    id: 'neutral',
    name: 'Classic Grimoire',
    title: 'Traditional Occult',
    description: 'Vintage grimoire illustrations, woodcut engravings, aged parchment with alchemical symbols',
    emoji: '📖',
    color: 'from-navy-dark to-navy-mid',
    borderColor: 'border-gold/50',
    keywords: ['grimoire', 'woodcut', 'alchemical', 'vintage', 'mystical']
  }
};

// Style selector card component
const StyleCard = ({ style, isSelected, onSelect }) => (
  <motion.button
    onClick={() => onSelect(style.id)}
    className={`relative p-4 rounded-sm text-left transition-all ${
      isSelected 
        ? 'bg-gradient-to-br ' + style.color + ' border-2 ' + style.borderColor + ' shadow-lg'
        : 'bg-navy-mid border border-gold/20 hover:border-gold/40'
    }`}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    {isSelected && (
      <div className="absolute top-2 right-2">
        <BrandIcon name="sparkles" size={16} />
      </div>
    )}
    <div className="flex items-center gap-3 mb-2">
      <span className="text-2xl">{style.emoji}</span>
      <div>
        <h4 className={`font-cinzel text-sm ${isSelected ? 'text-gold-light' : 'text-cream'}`}>
          {style.name}
        </h4>
        <p className={`font-montserrat text-xs ${isSelected ? 'text-cream/70' : 'text-cream/50'}`}>
          {style.title}
        </p>
      </div>
    </div>
    <p className={`font-montserrat text-xs leading-relaxed ${isSelected ? 'text-cream/80' : 'text-cream/60'}`}>
      {style.description}
    </p>
  </motion.button>
);

// Flippable image card component
const FlippableImageCard = ({ imageBase64, prompt, onDownload }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  
  return (
    <div 
      className="relative w-full cursor-pointer perspective-1000"
      style={{ aspectRatio: '1/1' }}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      >
        {/* Front - Tarot Card Style */}
        <div 
          className="absolute inset-0 rounded-lg overflow-hidden"
          style={{ backfaceVisibility: 'hidden' }}
        >
          {/* Gold border */}
          <div className="absolute inset-0 rounded-lg" style={{
            background: 'linear-gradient(135deg, #B8860B 0%, #DAA520 20%, #FFD700 50%, #DAA520 80%, #B8860B 100%)',
            padding: '4px'
          }}>
            <div className="w-full h-full bg-navy-dark rounded-lg overflow-hidden relative">
              {/* Tarot-style decorative frame */}
              <div className="absolute inset-3 border border-gold/40 rounded-md pointer-events-none z-10" />
              <div className="absolute inset-5 border border-gold/20 pointer-events-none z-10" />
              
              {/* Corner ornaments */}
              <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-gold/60 z-10" />
              <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-gold/60 z-10" />
              <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-gold/60 z-10" />
              <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-gold/60 z-10" />
              
              {/* Image with gradient overlay */}
              <img
                src={`data:image/png;base64,${imageBase64}`}
                alt="Generated artwork"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/80 via-transparent to-navy-dark/40" />
              
              {/* Click to flip hint */}
              <div className="absolute bottom-6 left-0 right-0 text-center z-20">
                <p className="font-montserrat text-xs text-gold/80 bg-navy-dark inline-block px-3 py-1 rounded-full backdrop-blur-sm">
                  Click to see full image
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Back - Full Image */}
        <div 
          className="absolute inset-0 rounded-lg overflow-hidden"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <div className="absolute inset-0 rounded-lg border-2 border-gold/50 overflow-hidden">
            <img
              src={`data:image/png;base64,${imageBase64}`}
              alt="Generated artwork - full view"
              className="w-full h-full object-contain bg-navy-dark"
            />
            
            {/* Click to flip back hint */}
            <div className="absolute bottom-4 left-0 right-0 text-center">
              <p className="font-montserrat text-xs text-cream/80 bg-navy-dark inline-block px-3 py-1 rounded-full backdrop-blur-sm">
                Click to flip back
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export const AIImage = () => {
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('neutral');
  const [generatedImage, setGeneratedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/ai/generate-image`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt,
          archetype: selectedStyle
        })
      });
      
      if (!response.ok) throw new Error('Failed to generate image');
      
      const data = await response.json();
      setGeneratedImage(data.image_base64);
      toast.success('Image generated successfully!');
    } catch (error) {
      toast.error('Failed to generate image');
      console.error('Image generation error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = `data:image/png;base64,${generatedImage}`;
    link.download = `crowlands-${selectedStyle}-${Date.now()}.png`;
    link.click();
    toast.success('Image downloaded!');
  };

  const handleReset = () => {
    setGeneratedImage(null);
    setPrompt('');
  };

  // Example prompts by archetype
  const getExamplePrompts = () => {
    const prompts = {
      shiggy: [
        'A robin perched on a window sill during the Blitz, hope amidst destruction',
        'The Parliament of Birds gathered at twilight in a Victorian garden',
        'A cup of wine and a rose at sunset, memento mori',
        'Omar Khayyám\'s moving finger writing in the sky'
      ],
      kathleen: [
        'The Morrigan in her triple aspect surrounded by crows',
        'A candlelit séance table with hands forming a circle',
        'A silver talisman brooch glowing with protective energy',
        'A powerful soprano voice made visible as waves of light'
      ],
      catherine: [
        'A Victorian spirit photograph with ethereal double exposure',
        'Huguenot silk weaving patterns forming mystical sigils',
        'A séance room with a single candle and scrying mirror',
        'Thread and needle weaving a spell of protection'
      ],
      theresa: [
        'A collage of family photographs revealing hidden truths',
        'Birds carrying ancestral secrets across generations',
        'A genealogical tree that transforms into a mystical symbol',
        'Past and present meeting in a liminal doorway'
      ],
      neutral: [
        'An ancient grimoire with mystical symbols',
        'Hecate at a moonlit crossroads',
        'Stonehenge under a full moon ritual',
        'Alchemical symbols on aged parchment'
      ]
    };
    return prompts[selectedStyle] || prompts.neutral;
  };

  return (
    <div className="min-h-screen">
      {/* Dark Hero Section */}
      <DarkSection className="py-12 sm:py-16 md:py-20 px-4 sm:px-6" variant="warm">
        <ElaborateCorner className="absolute top-3 left-3 w-16 h-16 sm:w-20 sm:h-20" variant="gold" />
        <ElaborateCorner className="absolute top-3 right-3 w-16 h-16 sm:w-20 sm:h-20 rotate-90" variant="gold" />
        
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <PageHeader 
              icon={ImageIcon}
              title="Mystical Image Generator"
              subtitle="Create period-appropriate imagery inspired by the occult revival, styled by your chosen guide"
            />
          </motion.div>
          
          <GrandDivider variant="eye" />
        </div>
      </DarkSection>

      {/* Light Section - Style Selection */}
      <LightSection 
        className="py-10 sm:py-14 px-4 sm:px-6"
        atmosphericImage={ATMOSPHERIC_IMAGES.peonies}
        atmosphericOpacity={0.10}
        atmosphericPosition="left center"
        atmosphericTint="sepia"
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <BrandIcon name="eye" size={20} />
              <h2 className="font-cinzel text-xl text-crimson">Choose Your Style</h2>
            </div>
            <p className="font-montserrat text-sm text-navy-dark/60">
              Each guide brings their own aesthetic to the imagery
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {Object.values(ARCHETYPE_STYLES).map((style) => (
              <StyleCard
                key={style.id}
                style={style}
                isSelected={selectedStyle === style.id}
                onSelect={setSelectedStyle}
              />
            ))}
          </div>
          
          <MysticalDivider light />
        </div>
      </LightSection>

      {/* Dark Section - Generator */}
      <DarkSection className="py-10 sm:py-14 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Panel */}
            <OrnateCard hover={false}>
              <h3 className="font-cinzel text-xl text-gold-light mb-4 flex items-center gap-2">
                <BrandIcon name="star" size={20} />
                Create Your Vision
              </h3>
              
              <div className="mb-6">
                <label className="block font-montserrat text-xs text-cream/60 uppercase tracking-wider mb-2">
                  Image Prompt
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe the mystical image you want to create..."
                  rows={4}
                  className="w-full bg-navy-dark border border-gold/30 focus:border-gold/60 focus:ring-1 focus:ring-gold/30 rounded-sm px-4 py-3 text-cream font-montserrat text-sm placeholder:text-cream/40"
                />
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading || !prompt.trim()}
                className="w-full px-6 py-4 bg-gradient-to-r from-crimson-deep via-crimson to-crimson-deep text-cream rounded-sm font-montserrat tracking-wider uppercase text-sm hover:from-crimson hover:via-crimson-bright hover:to-crimson transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 border border-gold/30"
              >
                {loading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                    >
                      <BrandIcon name="sparkles" size={20} className="inline-block" />
                    </motion.div>
                    Conjuring your vision...
                  </>
                ) : (
                  <>
                    <BrandIcon name="star" size={20} className="inline-block" />
                    Generate Image
                  </>
                )}
              </button>

              {/* Example Prompts */}
              <div className="mt-6">
                <p className="font-montserrat text-xs text-cream/50 uppercase tracking-wider mb-3">
                  Example Prompts for {ARCHETYPE_STYLES[selectedStyle].name}
                </p>
                <div className="space-y-2">
                  {getExamplePrompts().map((example, idx) => (
                    <button
                      key={idx}
                      onClick={() => setPrompt(example)}
                      className="w-full text-left px-3 py-2 bg-navy-dark border border-gold/20 rounded-sm font-montserrat text-xs text-cream/70 hover:border-gold/40 hover:text-cream transition-all"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>
            </OrnateCard>

            {/* Output Panel */}
            <OrnateCard hover={false}>
              <h3 className="font-cinzel text-xl text-gold-light mb-4 flex items-center gap-2">
                <BrandIcon name="crystalBall" size={20} />
                Generated Image
              </h3>
              
              <AnimatePresence mode="wait">
                {generatedImage ? (
                  <motion.div
                    key="image"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="space-y-4"
                  >
                    <FlippableImageCard 
                      imageBase64={generatedImage}
                      prompt={prompt}
                      onDownload={handleDownload}
                    />
                    
                    <div className="flex gap-3">
                      <button
                        onClick={handleDownload}
                        className="flex-1 px-4 py-2 bg-gold/10 text-gold border border-gold/40 rounded-sm font-montserrat text-xs uppercase tracking-wider hover:bg-gold/20 transition-all flex items-center justify-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                      <button
                        onClick={handleReset}
                        className="px-4 py-2 bg-crimson/10 text-crimson-bright border border-crimson/40 rounded-sm font-montserrat text-xs uppercase tracking-wider hover:bg-crimson/20 transition-all flex items-center justify-center gap-2"
                      >
                        <RotateCcw className="w-4 h-4" />
                        New
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-16 text-center"
                  >
                    <div className="w-24 h-24 rounded-full bg-gold/10 flex items-center justify-center mb-4">
                      <BrandIcon name="crystalBall" size={48} opacity={0.3} className="mx-auto" />
                    </div>
                    <p className="font-crimson text-base text-cream/50 italic mb-2">
                      Your mystical vision will appear here
                    </p>
                    <p className="font-montserrat text-xs text-cream/50">
                      Click to flip between tarot card and full view
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </OrnateCard>
          </div>
          
          <GrandDivider variant="sparkle" />
        </div>
      </DarkSection>

      {/* Light Footer Section */}
      <LightSection className="py-10 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <LightOrnateCard hover={false}>
            <h3 className="font-cinzel text-lg text-crimson mb-3">About the Image Styles</h3>
            <p className="font-montserrat text-sm text-navy-dark/70 leading-relaxed mb-4">
              Each guide&apos;s style draws from real historical art movements. Shigg&apos;s black-and-white engravings 
              echo Edmund J. Sullivan&apos;s famous Rubáiyát illustrations. Cathleen&apos;s Pre-Raphaelite oils capture 
              Celtic mysticism. Katherine&apos;s spirit photography aesthetic recalls Victorian séance documentation. 
              And Theresa&apos;s collage style bridges past and present.
            </p>
            <p className="font-crimson text-sm text-crimson/70 italic">
              These images can accompany your spells, giving each ritual a visual anchor for meditation and focus.
            </p>
          </LightOrnateCard>
          
          <div className="mt-6 flex items-center justify-center gap-4 text-crimson/40">
            <span>☽</span>
            <span className="text-gold-dark/60">❦</span>
            <span>🎨</span>
            <span className="text-gold-dark/60">❦</span>
            <span>☾</span>
          </div>
        </div>
      </LightSection>
    </div>
  );
};
