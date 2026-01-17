import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Moon, BookOpen, Users, Sparkles, Feather } from 'lucide-react';
import { WaitlistForm } from '../components/WaitlistForm';
import {
  NOUVEAU_COLORS,
  HaloCorner,
  HaloCornerElaborate,
  LunarDivider,
  LunarPhaseDivider,
  SimpleDivider,
  RavenGlyph,
  SunDisc,
  CrescentMoon,
} from '../assets/ornaments/artNouveau';

// ===== ART NOUVEAU COMPONENTS =====

// Grand section divider with celestial motifs
const GrandDivider = ({ variant = 'default' }) => (
  <div className="relative py-6 sm:py-8 flex justify-center">
    {variant === 'moon' ? (
      <LunarPhaseDivider width={320} color={NOUVEAU_COLORS.antiqueGold} opacity={0.6} />
    ) : variant === 'lunar' ? (
      <LunarDivider width={280} color={NOUVEAU_COLORS.antiqueGold} opacity={0.6} />
    ) : (
      <SimpleDivider width={200} color={NOUVEAU_COLORS.antiqueGold} opacity={0.5} />
    )}
  </div>
);

// Simple divider for lighter sections
const MysticalDivider = ({ light = false }) => (
  <div className="flex justify-center py-4 sm:py-5">
    <SimpleDivider 
      width={160} 
      color={light ? NOUVEAU_COLORS.mutedBrass : NOUVEAU_COLORS.antiqueGold} 
      opacity={light ? 0.5 : 0.4} 
    />
  </div>
);

// Ornate waitlist frame with vellum styling
const OrnateWaitlistFrame = ({ children }) => (
  <div className="relative max-w-lg mx-auto">
    {/* Subtle glow */}
    <div 
      className="absolute -inset-4 opacity-20 blur-xl pointer-events-none" 
      style={{ background: `radial-gradient(ellipse at center, ${NOUVEAU_COLORS.antiqueGold}60 0%, transparent 70%)` }} 
    />
    
    {/* Vellum panel with lifted paper shadow */}
    <div 
      className="relative p-6 sm:p-8"
      style={{ 
        backgroundColor: NOUVEAU_COLORS.vellum,
        border: `1px solid ${NOUVEAU_COLORS.antiqueGold}60`,
        boxShadow: '0 1px 3px rgba(14, 42, 47, 0.08), 0 4px 12px rgba(14, 42, 47, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
      }}
    >
      {/* Corner ornaments */}
      <div className="absolute top-2 left-2 pointer-events-none">
        <HaloCorner size={50} position="top-left" color={NOUVEAU_COLORS.mutedBrass} opacity={0.5} />
      </div>
      <div className="absolute top-2 right-2 pointer-events-none">
        <HaloCorner size={50} position="top-right" color={NOUVEAU_COLORS.mutedBrass} opacity={0.5} />
      </div>
      <div className="absolute bottom-2 left-2 pointer-events-none">
        <HaloCorner size={50} position="bottom-left" color={NOUVEAU_COLORS.mutedBrass} opacity={0.5} />
      </div>
      <div className="absolute bottom-2 right-2 pointer-events-none">
        <HaloCorner size={50} position="bottom-right" color={NOUVEAU_COLORS.mutedBrass} opacity={0.5} />
      </div>
      
      {/* Top decoration */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 pointer-events-none"
        style={{ backgroundColor: NOUVEAU_COLORS.midnightTeal }}>
        <div className="flex items-center gap-2">
          <CrescentMoon size={16} facing="left" color={NOUVEAU_COLORS.antiqueGold} opacity={0.7} />
          <SunDisc size={20} color={NOUVEAU_COLORS.antiqueGold} opacity={0.8} />
          <CrescentMoon size={16} facing="right" color={NOUVEAU_COLORS.antiqueGold} opacity={0.7} />
        </div>
      </div>
      
      <div className="relative z-10">{children}</div>
    </div>
  </div>
);

// Feature card with Art Nouveau styling
const OrnateFeatureCard = ({ icon: Icon, title, desc, tooltip }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    className="relative group"
  >
    {/* Card background */}
    <div 
      className="absolute inset-0 transition-all duration-500"
      style={{ 
        backgroundColor: NOUVEAU_COLORS.celestialBlue,
        border: `1px solid ${NOUVEAU_COLORS.antiqueGold}40`,
      }}
    />
    <div 
      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" 
      style={{ background: `radial-gradient(ellipse at center, ${NOUVEAU_COLORS.emberPink}15 0%, transparent 70%)` }} 
    />
    
    {/* Corner accents - structural, at edges */}
    <div className="absolute top-1 left-1 pointer-events-none opacity-40 group-hover:opacity-70 transition-opacity">
      <HaloCorner size={30} position="top-left" color={NOUVEAU_COLORS.antiqueGold} />
    </div>
    <div className="absolute top-1 right-1 pointer-events-none opacity-40 group-hover:opacity-70 transition-opacity">
      <HaloCorner size={30} position="top-right" color={NOUVEAU_COLORS.antiqueGold} />
    </div>
    <div className="absolute bottom-1 left-1 pointer-events-none opacity-40 group-hover:opacity-70 transition-opacity">
      <HaloCorner size={30} position="bottom-left" color={NOUVEAU_COLORS.antiqueGold} />
    </div>
    <div className="absolute bottom-1 right-1 pointer-events-none opacity-40 group-hover:opacity-70 transition-opacity">
      <HaloCorner size={30} position="bottom-right" color={NOUVEAU_COLORS.antiqueGold} />
    </div>
    
    <div className="relative p-6 sm:p-8 text-center">
      <Icon 
        className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-4 group-hover:scale-110 transition-transform" 
        style={{ color: NOUVEAU_COLORS.emberPink, filter: `drop-shadow(0 0 12px ${NOUVEAU_COLORS.emberPink}50)` }} 
      />
      <h3 className="font-cinzel text-lg sm:text-xl mb-3" style={{ color: NOUVEAU_COLORS.antiqueGold }}>
        {title}
      </h3>
      <p className="font-crimson text-sm sm:text-base" style={{ color: `${NOUVEAU_COLORS.vellum}cc` }}>
        {desc}
      </p>
      {tooltip && (
        <p className="font-montserrat text-xs mt-3 opacity-0 group-hover:opacity-100 transition-opacity italic"
          style={{ color: `${NOUVEAU_COLORS.antiqueGold}80` }}>
          {tooltip}
        </p>
      )}
    </div>
  </motion.div>
);

export const Home = () => {
  return (
    <div className="min-h-screen" style={{ backgroundColor: NOUVEAU_COLORS.midnightTeal }}>
      
      {/* ===== DARK HERO SECTION ===== */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 z-0" style={{
          backgroundImage: 'url(https://customer-assets.emergentagent.com/job_mystic-circle-2/artifacts/t5tfc6i3_COuld_we_creatre_more_of_these_--profile_bsfwy2d_--v_7_d08b86ee-a6ac-4cf3-a814-1344b45b3380_1.png)',
          backgroundSize: 'cover', backgroundPosition: 'center', opacity: '0.04', filter: 'hue-rotate(160deg) saturate(0.4)',
        }} />
        <div className="absolute inset-0 z-0" style={{
          background: `radial-gradient(ellipse at 50% 30%, ${NOUVEAU_COLORS.celestialBlue}80 0%, transparent 50%), radial-gradient(ellipse at 30% 70%, ${NOUVEAU_COLORS.antiqueGold}15 0%, transparent 40%)`,
        }} />
        <div className="absolute inset-0 z-0" style={{
          background: `linear-gradient(to bottom, ${NOUVEAU_COLORS.midnightTeal}60 0%, transparent 30%, transparent 70%, ${NOUVEAU_COLORS.midnightTeal} 100%)`,
        }} />
        
        {/* Elaborate corners - structural at edges */}
        <div className="absolute top-4 left-4 pointer-events-none">
          <HaloCornerElaborate size={90} position="top-left" color={NOUVEAU_COLORS.antiqueGold} opacity={0.6} />
        </div>
        <div className="absolute top-4 right-4 pointer-events-none">
          <HaloCornerElaborate size={90} position="top-right" color={NOUVEAU_COLORS.antiqueGold} opacity={0.6} />
        </div>
        <div className="absolute bottom-4 left-4 pointer-events-none">
          <HaloCornerElaborate size={90} position="bottom-left" color={NOUVEAU_COLORS.antiqueGold} opacity={0.6} />
        </div>
        <div className="absolute bottom-4 right-4 pointer-events-none">
          <HaloCornerElaborate size={90} position="bottom-right" color={NOUVEAU_COLORS.antiqueGold} opacity={0.6} />
        </div>
        
        {/* Top edge decoration */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 pointer-events-none">
          <SimpleDivider width={120} color={NOUVEAU_COLORS.antiqueGold} opacity={0.4} />
        </div>
        
        {/* Side decorations - hidden on mobile */}
        <div className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 flex-col items-center gap-4 opacity-30 pointer-events-none">
          <div className="w-px h-16" style={{ background: `linear-gradient(to bottom, transparent, ${NOUVEAU_COLORS.antiqueGold}, transparent)` }} />
          <CrescentMoon size={20} facing="right" color={NOUVEAU_COLORS.antiqueGold} />
          <div className="w-px h-16" style={{ background: `linear-gradient(to bottom, transparent, ${NOUVEAU_COLORS.antiqueGold}, transparent)` }} />
        </div>
        <div className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 flex-col items-center gap-4 opacity-30 pointer-events-none">
          <div className="w-px h-16" style={{ background: `linear-gradient(to bottom, transparent, ${NOUVEAU_COLORS.antiqueGold}, transparent)` }} />
          <CrescentMoon size={20} facing="left" color={NOUVEAU_COLORS.antiqueGold} />
          <div className="w-px h-16" style={{ background: `linear-gradient(to bottom, transparent, ${NOUVEAU_COLORS.antiqueGold}, transparent)` }} />
        </div>
        
        <div className="relative z-10 text-center max-w-5xl px-4 sm:px-6 py-12 sm:py-16">
          {/* LOGO - PRESERVED EXACTLY AS IS */}
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2 }} className="relative mb-4 sm:mb-6">
            <div className="absolute inset-0 blur-3xl opacity-50 pointer-events-none" 
              style={{ background: `radial-gradient(circle, ${NOUVEAU_COLORS.emberPink}40 0%, ${NOUVEAU_COLORS.antiqueGold}30 40%, transparent 70%)` }} 
            />
            <img 
              src="https://customer-assets.emergentagent.com/job_mystic-circle-2/artifacts/li34ks3x_Where%20the%20Crowlands%20Logos.png" 
              alt="Where The Crowlands"
              className="relative w-48 h-48 sm:w-64 sm:h-64 md:w-72 md:h-72 mx-auto object-contain"
              style={{ filter: `brightness(1.3) contrast(1.1) drop-shadow(0 0 40px ${NOUVEAU_COLORS.antiqueGold}60)` }} 
            />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}>
            {/* Raven glyph */}
            <div className="flex justify-center mb-4">
              <RavenGlyph size={48} color={NOUVEAU_COLORS.antiqueGold} opacity={0.7} />
            </div>
            
            <h1 className="phantasmagoria-hero text-3xl sm:text-5xl md:text-6xl lg:text-7xl mb-3 sm:mb-4 leading-none"
              style={{ color: NOUVEAU_COLORS.antiqueGold, textShadow: `0 4px 40px ${NOUVEAU_COLORS.antiqueGold}50, 0 0 80px ${NOUVEAU_COLORS.emberPink}30` }}>
              Where The Crowlands
            </h1>
            <p className="font-cinzel text-base sm:text-xl md:text-2xl mb-4 tracking-wide"
              style={{ color: `${NOUVEAU_COLORS.vellum}ee`, textShadow: '0 2px 15px rgba(0, 0, 0, 0.6)' }}>
              A place where magic and science aren't such strange bedfellows
            </p>
            
            {/* Handwritten subhead */}
            <p className="phantasmagoria-accent italic text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8"
              style={{ color: `${NOUVEAU_COLORS.antiqueGold}aa`, textShadow: '0 2px 10px rgba(0, 0, 0, 0.4)' }}>
              … the bird is on the wing
            </p>
            
            <GrandDivider variant="moon" />
            
            <div className="font-crimson text-sm sm:text-base md:text-lg leading-relaxed max-w-3xl mx-auto px-2 sm:px-4"
              style={{ color: `${NOUVEAU_COLORS.vellum}dd` }}>
              <p className="first-letter:text-4xl sm:first-letter:text-5xl first-letter:font-italiana first-letter:float-left first-letter:mr-2 sm:first-letter:mr-3 first-letter:leading-none"
                style={{ '--tw-text-opacity': 1 }}>
                <span style={{ color: NOUVEAU_COLORS.emberPink, filter: `drop-shadow(0 0 8px ${NOUVEAU_COLORS.emberPink}60)` }} className="first-letter:text-4xl sm:first-letter:text-5xl first-letter:font-italiana first-letter:float-left first-letter:mr-2 sm:first-letter:mr-3 first-letter:leading-none">W</span>here the Crowlands is a toolkit for alchemizing what you already hold. Rooted in history; from the 
                Huguenot mystics fleeing persecution, Jersey witches shaping weather and fate, Irish and Celtic keepers 
                of forbidden knowledge, to London's table-tappers and spiritualists revealing the hidden world. The stoicism 
                of WWII echoes of Churchill-influenced resolve, and the hard-won wisdom of London's East End, where "Loose 
                lips sink ships" wasn't just a slogan; it was a way of living.
              </p>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
              <Link 
                to="/spell-request" 
                data-testid="hero-begin-journey-btn"
                className="group relative px-6 sm:px-8 py-3 overflow-hidden transition-all duration-300 hover:brightness-110"
                style={{
                  backgroundColor: NOUVEAU_COLORS.emberPink,
                  border: `1px solid ${NOUVEAU_COLORS.antiqueGold}60`,
                }}
              >
                <span className="relative flex items-center gap-2 font-montserrat tracking-widest uppercase text-xs sm:text-sm"
                  style={{ color: NOUVEAU_COLORS.vellum }}>
                  <Sparkles className="w-4 h-4" /> Begin Your Journey
                </span>
              </Link>
              <Link 
                to="/guides" 
                data-testid="hero-meet-guides-btn"
                className="group relative px-6 sm:px-8 py-3 transition-all duration-300"
                style={{
                  backgroundColor: 'transparent',
                  border: `1px solid ${NOUVEAU_COLORS.antiqueGold}60`,
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `${NOUVEAU_COLORS.antiqueGold}15`}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <span className="flex items-center gap-2 font-montserrat tracking-widest uppercase text-xs sm:text-sm transition-colors"
                  style={{ color: NOUVEAU_COLORS.antiqueGold }}>
                  <Users className="w-4 h-4" /> Meet Your Guides
                </span>
              </Link>
            </div>
          </motion.div>
        </div>
        
        {/* Bottom divider */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-none">
          <LunarDivider width={250} color={NOUVEAU_COLORS.antiqueGold} opacity={0.4} />
        </div>
      </div>

      {/* ===== VELLUM SECTION - Philosophy ===== */}
      <div className="relative py-10 sm:py-14" style={{ backgroundColor: NOUVEAU_COLORS.vellum }}>
        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(to right, transparent, ${NOUVEAU_COLORS.roseClay}, transparent)` }} />
        <div className="absolute top-0.5 left-0 right-0 h-px" style={{ background: `linear-gradient(to right, transparent, ${NOUVEAU_COLORS.antiqueGold}80, transparent)` }} />
        
        {/* Corners - standard for this section */}
        <div className="absolute top-3 left-3 pointer-events-none">
          <HaloCorner size={45} position="top-left" color={NOUVEAU_COLORS.mutedBrass} opacity={0.5} />
        </div>
        <div className="absolute top-3 right-3 pointer-events-none">
          <HaloCorner size={45} position="top-right" color={NOUVEAU_COLORS.mutedBrass} opacity={0.5} />
        </div>
        <div className="absolute bottom-3 left-3 pointer-events-none">
          <HaloCorner size={45} position="bottom-left" color={NOUVEAU_COLORS.mutedBrass} opacity={0.5} />
        </div>
        <div className="absolute bottom-3 right-3 pointer-events-none">
          <HaloCorner size={45} position="bottom-right" color={NOUVEAU_COLORS.mutedBrass} opacity={0.5} />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
          <MysticalDivider light />
          
          <div className="font-crimson text-sm sm:text-base leading-relaxed max-w-3xl mx-auto px-2 sm:px-4 space-y-4 mb-6 sm:mb-8"
            style={{ color: `${NOUVEAU_COLORS.midnightTeal}dd` }}>
            <p>
              The magic we've abandoned isn't "woo woo"—it's intention, craft, commitment, and ritual. Whether our ancestors 
              named it or not, that power is still yours to work with. Inspired by real people—my family—and grounded in plenty 
              of creative lore and imagination, Where the Crowlands offers a fun, practical way to bring alchemy, magic, and 
              beauty into your life.
            </p>
            <p className="italic py-2 pl-4 rounded-r text-sm"
              style={{ 
                color: NOUVEAU_COLORS.midnightTeal,
                borderLeft: `3px solid ${NOUVEAU_COLORS.antiqueGold}`,
                backgroundColor: `${NOUVEAU_COLORS.antiqueGold}15`,
              }}>
              While rooted primarily in British history and mysticism, we plan to expand, honouring all cultures—every tradition 
              has drawn from what lies beneath the veil. It's time to bring a little magic back.
            </p>
          </div>
          
          <MysticalDivider light />
        </div>
        
        {/* Bottom accent line */}
        <div className="absolute bottom-0.5 left-0 right-0 h-px" style={{ background: `linear-gradient(to right, transparent, ${NOUVEAU_COLORS.antiqueGold}80, transparent)` }} />
        <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: `linear-gradient(to right, transparent, ${NOUVEAU_COLORS.roseClay}, transparent)` }} />
      </div>

      {/* ===== DARK FEATURES SECTION ===== */}
      <div className="relative py-10 sm:py-14 px-4" style={{ backgroundColor: NOUVEAU_COLORS.midnightTeal }}>
        <div className="absolute inset-0 pointer-events-none" 
          style={{ background: `radial-gradient(ellipse at 50% 50%, ${NOUVEAU_COLORS.celestialBlue}60 0%, transparent 60%)` }} 
        />
        
        <div className="relative z-10 max-w-6xl mx-auto">
          <MysticalDivider />
          
          <h2 className="font-italiana text-xl sm:text-2xl md:text-3xl text-center mb-8 sm:mb-10"
            style={{ color: NOUVEAU_COLORS.antiqueGold, textShadow: `0 2px 25px ${NOUVEAU_COLORS.antiqueGold}40` }}>
            Your Path Awaits
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <OrnateFeatureCard icon={Sparkles} title="Craft Your Spells" desc="Generate personalized rituals guided by four ancestral archetypes" />
            <OrnateFeatureCard icon={BookOpen} title="Build Your Grimoire" desc="A living archive of wonder—save spells, collect wards, and build your personal magical practice" tooltip="From the French for 'grammar'—every ritual has its own language for shaping reality" />
            <OrnateFeatureCard icon={Moon} title="Explore the Archives" desc="Discover historical practices, deities, and sacred sites" />
          </div>
          
          <MysticalDivider />
        </div>
      </div>

      {/* ===== VELLUM TESTIMONIAL/PHILOSOPHY SECTION ===== */}
      <div className="relative py-10 sm:py-14" style={{ backgroundColor: NOUVEAU_COLORS.vellum }}>
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(to right, transparent, ${NOUVEAU_COLORS.roseClay}, transparent)` }} />
        
        <div className="absolute top-3 left-3 pointer-events-none">
          <HaloCorner size={40} position="top-left" color={NOUVEAU_COLORS.mutedBrass} opacity={0.5} />
        </div>
        <div className="absolute top-3 right-3 pointer-events-none">
          <HaloCorner size={40} position="top-right" color={NOUVEAU_COLORS.mutedBrass} opacity={0.5} />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="flex justify-center mb-4">
            <RavenGlyph size={36} color={NOUVEAU_COLORS.mutedBrass} opacity={0.6} />
          </div>
          
          <h2 className="font-italiana text-xl sm:text-2xl md:text-3xl mb-4 sm:mb-6"
            style={{ color: NOUVEAU_COLORS.midnightTeal, textShadow: `0 2px 15px ${NOUVEAU_COLORS.emberPink}20` }}>
            The Lineage
          </h2>
          
          <div className="font-crimson text-sm sm:text-base leading-relaxed space-y-3 mb-6"
            style={{ color: `${NOUVEAU_COLORS.midnightTeal}dd` }}>
            <p>
              The druids, templers, occultists, astrologers, hermetic philosophers, "witches" midwives and alchemists before them…
              These four women span over a century of practice—from Victorian Spitalfields to contemporary London. Each carried the 
              magic forward in her own way: through craft, through secrets, through poetry, and through truth-telling.
            </p>
            <p className="italic text-sm" style={{ color: NOUVEAU_COLORS.mutedBrass }}>
              You don't need to choose just one. Their wisdom overlaps, contradicts, and complements. Like any family, they argue. 
              Like any lineage, they build on what came before.
            </p>
          </div>
          
          <Link 
            to="/about" 
            data-testid="lineage-learn-story-link"
            className="inline-flex items-center gap-2 font-montserrat text-xs sm:text-sm tracking-widest uppercase transition-colors pb-1"
            style={{ 
              color: NOUVEAU_COLORS.emberPink,
              borderBottom: `1px solid ${NOUVEAU_COLORS.emberPink}50`,
            }}
          >
            <Feather className="w-4 h-4" /> Learn Our Story
          </Link>
          
          <MysticalDivider light />
        </div>
        
        <div className="absolute bottom-3 left-3 pointer-events-none">
          <HaloCorner size={40} position="bottom-left" color={NOUVEAU_COLORS.mutedBrass} opacity={0.5} />
        </div>
        <div className="absolute bottom-3 right-3 pointer-events-none">
          <HaloCorner size={40} position="bottom-right" color={NOUVEAU_COLORS.mutedBrass} opacity={0.5} />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: `linear-gradient(to right, transparent, ${NOUVEAU_COLORS.roseClay}, transparent)` }} />
      </div>

      {/* ===== DARK WAITLIST SECTION ===== */}
      <div className="relative py-14 sm:py-20 px-4" style={{ backgroundColor: NOUVEAU_COLORS.midnightTeal }}>
        <div className="absolute inset-0 pointer-events-none" 
          style={{ background: `radial-gradient(ellipse at 50% 50%, ${NOUVEAU_COLORS.emberPink}10 0%, transparent 60%)` }} 
        />
        
        {/* Elaborate corners - threshold moment */}
        <div className="absolute top-4 left-4 pointer-events-none">
          <HaloCornerElaborate size={70} position="top-left" color={NOUVEAU_COLORS.antiqueGold} opacity={0.5} />
        </div>
        <div className="absolute top-4 right-4 pointer-events-none">
          <HaloCornerElaborate size={70} position="top-right" color={NOUVEAU_COLORS.antiqueGold} opacity={0.5} />
        </div>
        <div className="absolute bottom-4 left-4 pointer-events-none">
          <HaloCornerElaborate size={70} position="bottom-left" color={NOUVEAU_COLORS.antiqueGold} opacity={0.5} />
        </div>
        <div className="absolute bottom-4 right-4 pointer-events-none">
          <HaloCornerElaborate size={70} position="bottom-right" color={NOUVEAU_COLORS.antiqueGold} opacity={0.5} />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <GrandDivider variant="lunar" />
          
          <h2 className="font-italiana text-xl sm:text-2xl md:text-3xl mb-4"
            style={{ color: NOUVEAU_COLORS.antiqueGold, textShadow: `0 2px 25px ${NOUVEAU_COLORS.antiqueGold}40` }}>
            Join the Circle
          </h2>
          <p className="font-crimson text-sm sm:text-base mb-8 max-w-lg mx-auto"
            style={{ color: `${NOUVEAU_COLORS.vellum}aa` }}>
            Be the first to know when new features, spells, and ancestral wisdom are unveiled.
          </p>
          
          <OrnateWaitlistFrame>
            <WaitlistForm source="homepage" />
          </OrnateWaitlistFrame>
          
          <GrandDivider />
        </div>
      </div>
    </div>
  );
};

export default Home;
