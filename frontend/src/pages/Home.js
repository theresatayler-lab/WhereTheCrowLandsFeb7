import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Users, Feather } from 'lucide-react';
import { WaitlistForm } from '../components/WaitlistForm';
import { BrandIcon } from '../components/BrandIcon';
import {
  NOUVEAU_COLORS,
} from '../assets/ornaments/artNouveau';

// ============================================================================
// ART NOUVEAU HOME PAGE - CLEAN & MINIMAL
// Content-first design with subtle ornamental accents
// ============================================================================

// Simple decorative arc for hero
const HeroHaloArc = ({ width = 300 }) => (
  <svg width={width} height={width * 0.25} viewBox="0 0 300 75" fill="none" className="pointer-events-none">
    <path 
      d="M30 70 Q150 0 270 70" 
      stroke={NOUVEAU_COLORS.antiqueGold} 
      strokeWidth="1" 
      fill="none" 
      opacity="0.3"
    />
  </svg>
);

// Grand section plate frame - clean, minimal
const SectionPlate = ({ children, variant = 'dark', className = '' }) => {
  const isDark = variant === 'dark';
  
  return (
    <div className={`relative ${className}`}>
      {/* Background with subtle gradient depth */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundColor: isDark ? NOUVEAU_COLORS.midnightTeal : NOUVEAU_COLORS.vellum,
          backgroundImage: isDark 
            ? `radial-gradient(ellipse at 50% 0%, ${NOUVEAU_COLORS.celestialBlue}60 0%, transparent 50%)`
            : 'none',
        }}
      />
      
      {/* Vignette overlay for dark sections */}
      {isDark && (
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 40%, rgba(14, 42, 47, 0.3) 100%)',
          }}
        />
      )}
      
      {/* Single top border line */}
      <div 
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{ 
          background: `linear-gradient(to right, transparent 15%, ${NOUVEAU_COLORS.antiqueGold}40 50%, transparent 85%)`,
        }}
      />
      
      {/* Single bottom border line */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
        style={{ 
          background: `linear-gradient(to right, transparent 15%, ${NOUVEAU_COLORS.antiqueGold}40 50%, transparent 85%)`,
        }}
      />
      
      <div className="relative z-10">{children}</div>
    </div>
  );
};

// Simple divider - clean single line
const SimpleSectionDivider = ({ light = false }) => (
  <div className="py-6 flex justify-center">
    <div 
      className="w-48 h-px"
      style={{ 
        background: light 
          ? `linear-gradient(to right, transparent, ${NOUVEAU_COLORS.mutedBrass}60, transparent)`
          : `linear-gradient(to right, transparent, ${NOUVEAU_COLORS.antiqueGold}50, transparent)`
      }} 
    />
  </div>
);

// Three stars horizontal divider
const ThreeStarsDivider = ({ height = 24, variant = 'gold', opacity = 0.7 }) => (
  <div className="py-3 flex justify-center">
    <img 
      src="/images/brand/threestars-horizontal-gold.png"
      alt="Three stars divider"
      style={{ 
        height: height,
        width: 'auto',
        opacity: opacity,
        filter: variant === 'pink' ? 'hue-rotate(-30deg) saturate(1.5) brightness(1.1)' : 'none',
      }}
    />
  </div>
);

// Vellum content panel - clean and simple
const VellumPanel = ({ children, className = '' }) => (
  <div 
    className={`relative ${className}`}
    style={{
      backgroundColor: NOUVEAU_COLORS.vellum,
      border: `1px solid ${NOUVEAU_COLORS.antiqueGold}30`,
      boxShadow: '0 2px 8px rgba(14, 42, 47, 0.06)',
    }}
  >
    <div className="relative z-10 p-8 sm:p-10">{children}</div>
  </div>
);

// Feature card - clean, minimal
const FeatureCard = ({ icon: Icon, brandIcon, title, desc, tooltip }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    className="relative group"
  >
    {/* Card background */}
    <div 
      className="absolute inset-0"
      style={{ 
        backgroundColor: NOUVEAU_COLORS.celestialBlue,
        border: `1px solid ${NOUVEAU_COLORS.antiqueGold}30`,
      }}
    />
    
    {/* Hover glow */}
    <div 
      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" 
      style={{ 
        background: `radial-gradient(ellipse at center, ${NOUVEAU_COLORS.emberPink}15 0%, transparent 70%)`,
      }} 
    />
    
    <div className="relative p-6 sm:p-8 text-center">
      {/* Icon - larger for visibility */}
      <div className="relative w-20 h-20 mx-auto mb-5 flex items-center justify-center">
        {brandIcon ? (
          <BrandIcon 
            name={brandIcon} 
            size={64} 
            variant="pink"
            opacity={0.95}
          />
        ) : Icon ? (
          <Icon 
            className="w-14 h-14" 
            style={{ color: NOUVEAU_COLORS.emberPink }} 
          />
        ) : null}
      </div>
      
      <h3 
        className="font-cinzel text-lg sm:text-xl tracking-wide mb-3"
        style={{ color: NOUVEAU_COLORS.antiqueGold }}
      >
        {title}
      </h3>
      <p className="font-crimson text-sm sm:text-base leading-relaxed" style={{ color: `${NOUVEAU_COLORS.vellum}cc` }}>
        {desc}
      </p>
      {tooltip && (
        <p 
          className="font-montserrat text-xs mt-4 opacity-0 group-hover:opacity-100 transition-opacity italic"
          style={{ color: `${NOUVEAU_COLORS.antiqueGold}80` }}
        >
          {tooltip}
        </p>
      )}
    </div>
  </motion.div>
);

// ============================================================================
// MAIN HOME COMPONENT
// ============================================================================

export const Home = () => {
  return (
    <div className="min-h-screen" style={{ backgroundColor: NOUVEAU_COLORS.midnightTeal }}>
      
      {/* ================================================================ */}
      {/* HERO SECTION - Full illuminated manuscript treatment */}
      {/* ================================================================ */}
      <SectionPlate variant="dark" className="min-h-screen flex items-center justify-center overflow-hidden py-16">
        {/* Subtle texture overlay */}
        <div className="absolute inset-0 z-0 pointer-events-none" style={{
          backgroundImage: 'url(/images/brand/profile-frame.png)',
          backgroundSize: 'cover', backgroundPosition: 'center', opacity: '0.03', filter: 'hue-rotate(160deg) saturate(0.3)',
        }} />
        
        <div className="relative z-10 text-center max-w-5xl px-6 sm:px-8">
          {/* Halo arc above logo */}
          <div className="flex justify-center mb-2">
            <HeroHaloArc width={360} />
          </div>
          
          {/* LOGO - new clean design */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 1.2 }} 
            className="relative mb-6 flex justify-center"
          >
            <img 
              src="/images/brand/new-logo.png" 
              alt="Where The Crowlands"
              className="relative w-56 h-auto sm:w-72 md:w-80 object-contain"
            />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}>
            {/* Moon glyph - pink variant to match logo */}
            <div className="flex justify-center mb-5">
              <BrandIcon name="moon" size={64} variant="pink" opacity={0.85} />
            </div>
            
            {/* Title - balanced, not oversized */}
            <h1 
              className="phantasmagoria-hero text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-wide mb-3 leading-tight"
              style={{ 
                color: NOUVEAU_COLORS.antiqueGold, 
                textShadow: `0 0 40px ${NOUVEAU_COLORS.emberPink}60, 0 0 80px ${NOUVEAU_COLORS.emberPink}40, 0 2px 30px ${NOUVEAU_COLORS.antiqueGold}50`,
                letterSpacing: '0.05em',
              }}
            >
              Where The Crowlands
            </h1>
            
            {/* Subtitle - proportional */}
            <p 
              className="font-cinzel text-sm sm:text-base md:text-lg tracking-widest uppercase mb-3"
              style={{ 
                color: NOUVEAU_COLORS.vellum, 
                textShadow: `0 0 30px ${NOUVEAU_COLORS.emberPink}50, 0 0 60px ${NOUVEAU_COLORS.emberPink}30`,
                letterSpacing: '0.12em',
              }}
            >
              A place where magic is normalized, formula, alchemized from head, heart, space and time
            </p>
            
            {/* Handwritten accent */}
            <p 
              className="phantasmagoria-accent italic text-lg sm:text-xl mb-6"
              style={{ 
                color: `${NOUVEAU_COLORS.antiqueGold}bb`, 
                textShadow: `0 0 25px ${NOUVEAU_COLORS.emberPink}50, 0 0 50px ${NOUVEAU_COLORS.emberPink}30`,
              }}
            >
              … the bird is on the wing
            </p>
            
            <SimpleSectionDivider />
            
            {/* Intro text with drop cap */}
            <div 
              className="font-crimson text-base sm:text-lg md:text-xl leading-relaxed max-w-3xl mx-auto px-4 mb-10"
              style={{ color: `${NOUVEAU_COLORS.vellum}ee` }}
            >
              <p>
                <span 
                  className="float-left text-5xl sm:text-6xl md:text-7xl font-italiana mr-3 leading-none"
                  style={{ 
                    color: NOUVEAU_COLORS.emberPink, 
                    filter: `drop-shadow(0 0 12px ${NOUVEAU_COLORS.emberPink}60)`,
                    marginTop: '0.1em',
                  }}
                >W</span>
                Where the Crowlands is a toolkit for alchemizing what you already hold. Rooted in history; from the 
                Huguenot mystics fleeing persecution, Jersey witches shaping weather and fate, Irish and Celtic keepers 
                of forbidden knowledge, to London&apos;s table-tappers and spiritualists revealing the hidden world.
              </p>
            </div>
            
            {/* Three stars divider before buttons */}
            <ThreeStarsDivider height={32} variant="gold" opacity={0.8} />
            
            {/* CTA Buttons - strong presence */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mt-2">
              <Link 
                to="/spell-request" 
                data-testid="hero-begin-journey-btn"
                className="group relative px-8 py-3.5 overflow-hidden transition-all duration-300"
                style={{
                  backgroundColor: NOUVEAU_COLORS.emberPink,
                  border: `2px solid ${NOUVEAU_COLORS.emberPink}`,
                  boxShadow: `0 4px 20px ${NOUVEAU_COLORS.emberPink}30`,
                }}
              >
                <span 
                  className="relative flex items-center gap-3 font-cinzel tracking-[0.15em] uppercase text-sm"
                  style={{ color: '#FFF' }}
                >
                  <BrandIcon name="star" size={18} variant="pink" opacity={0.9} /> Begin Your Journey
                </span>
              </Link>
              <Link 
                to="/guides" 
                data-testid="hero-meet-guides-btn"
                className="group relative px-8 py-3.5 transition-all duration-300 hover:bg-white/5"
                style={{
                  backgroundColor: 'transparent',
                  border: `2px solid ${NOUVEAU_COLORS.antiqueGold}80`,
                }}
              >
                <span 
                  className="flex items-center gap-3 font-cinzel tracking-[0.15em] uppercase text-sm"
                  style={{ color: NOUVEAU_COLORS.antiqueGold }}
                >
                  <Users className="w-4 h-4" /> Meet Your Guides
                </span>
              </Link>
            </div>
          </motion.div>
        </div>
        
        {/* Remove bottom divider - cleaner transition */}
      </SectionPlate>

      {/* ================================================================ */}
      {/* PHILOSOPHY SECTION - Vellum plate */}
      {/* ================================================================ */}
      <SectionPlate variant="light" className="py-16 sm:py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <VellumPanel className="max-w-3xl mx-auto">
            <div 
              className="font-crimson text-base sm:text-lg leading-loose space-y-6"
              style={{ color: NOUVEAU_COLORS.midnightTeal }}
            >
              <p>
                The magic we&apos;ve abandoned isn&apos;t &quot;woo woo&quot;—it&apos;s intention, craft, commitment, and ritual. 
                Whether our ancestors named it or not, that power is still yours to work with. Inspired by 
                real people—my family—and grounded in plenty of creative lore and imagination, Where the 
                Crowlands offers a fun, practical way to bring alchemy, magic, and beauty into your life.
              </p>
              
              <div 
                className="py-4 px-6 italic"
                style={{ 
                  backgroundColor: `${NOUVEAU_COLORS.antiqueGold}12`,
                  borderLeft: `4px solid ${NOUVEAU_COLORS.antiqueGold}`,
                  borderRight: `1px solid ${NOUVEAU_COLORS.antiqueGold}30`,
                }}
              >
                <p style={{ color: NOUVEAU_COLORS.midnightTeal }}>
                  While rooted primarily in British history and mysticism, we plan to expand, honouring all 
                  cultures—every tradition has drawn from what lies beneath the veil. It&apos;s time to bring a 
                  little magic back.
                </p>
              </div>
            </div>
          </VellumPanel>
        </div>
      </SectionPlate>

      {/* ================================================================ */}
      {/* FEATURES SECTION - Dark plate with cards */}
      {/* ================================================================ */}
      <SectionPlate variant="dark" className="py-14 sm:py-16 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Section header - clean */}
          <div className="text-center mb-10">
            <h2 
              className="font-cinzel text-xl sm:text-2xl md:text-3xl tracking-wide mb-3"
              style={{ 
                color: NOUVEAU_COLORS.antiqueGold, 
                letterSpacing: '0.08em',
              }}
            >
              Your Path Awaits
            </h2>
            <SimpleSectionDivider />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <FeatureCard 
              brandIcon="star"
              title="Craft Your Spells" 
              desc="Generate personalized rituals guided by four ancestral archetypes, each with their own voice and wisdom." 
            />
            <FeatureCard 
              brandIcon="book"
              title="Build Your Grimoire" 
              desc="A living archive of wonder—save spells, collect wards, and build your personal magical practice over time." 
              tooltip="From the French for 'grammar'—every ritual has its own language for shaping reality" 
            />
            <FeatureCard 
              brandIcon="moon"
              title="Explore the Archives" 
              desc="Discover historical practices, deities, sacred sites, and the hidden knowledge of those who came before." 
            />
          </div>
        </div>
      </SectionPlate>

      {/* ================================================================ */}
      {/* LINEAGE SECTION - Vellum plate */}
      {/* ================================================================ */}
      <SectionPlate variant="light" className="py-14 sm:py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 
            className="font-cinzel text-xl sm:text-2xl md:text-3xl tracking-wide mb-6"
            style={{ 
              color: NOUVEAU_COLORS.midnightTeal, 
              letterSpacing: '0.06em',
            }}
          >
            The Lineage
          </h2>
          
          <VellumPanel className="max-w-2xl mx-auto">
            <div 
              className="font-crimson text-base sm:text-lg leading-loose space-y-4"
              style={{ color: NOUVEAU_COLORS.midnightTeal }}
            >
              <p>
                The druids, templars, occultists, astrologers, hermetic philosophers, &quot;witches,&quot; midwives 
                and alchemists before them… These four women span over a century of practice—from Victorian 
                Spitalfields to contemporary London.
              </p>
              <p className="italic" style={{ color: NOUVEAU_COLORS.mutedBrass }}>
                You don&apos;t need to choose just one. Their wisdom overlaps, contradicts, and complements. 
                Like any family, they argue. Like any lineage, they build on what came before.
              </p>
            </div>
          </VellumPanel>
          
          <div className="mt-8">
            <Link 
              to="/about" 
              data-testid="lineage-learn-story-link"
              className="inline-flex items-center gap-3 font-cinzel text-sm tracking-widest uppercase transition-all py-2 px-6"
              style={{ 
                color: NOUVEAU_COLORS.emberPink,
                border: `1px solid ${NOUVEAU_COLORS.emberPink}50`,
              }}
            >
              <Feather className="w-5 h-5" /> Learn Our Story
            </Link>
          </div>
        </div>
      </SectionPlate>

      {/* ================================================================ */}
      {/* WAITLIST SECTION - Dark plate with vellum form */}
      {/* ================================================================ */}
      <SectionPlate variant="dark" className="py-16 sm:py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 
            className="font-cinzel text-xl sm:text-2xl md:text-3xl tracking-wide mb-3"
            style={{ 
              color: NOUVEAU_COLORS.antiqueGold, 
              letterSpacing: '0.08em',
            }}
          >
            Join the Circle
          </h2>
          <p 
            className="font-crimson text-base sm:text-lg mb-8 max-w-lg mx-auto"
            style={{ color: `${NOUVEAU_COLORS.vellum}aa` }}
          >
            Be the first to know when new features, spells, and ancestral wisdom are unveiled.
          </p>
          
          <VellumPanel className="max-w-md mx-auto">
            <WaitlistForm source="homepage" />
          </VellumPanel>
        </div>
      </SectionPlate>
    </div>
  );
};

export default Home;
