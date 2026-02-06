import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Users, Feather } from 'lucide-react';
import { WaitlistForm } from '../components/WaitlistForm';
import { BrandIcon } from '../components/BrandIcon';
import { PINK_FILTER } from '../assets/brandAssets';
import {
  NOUVEAU_COLORS,
  HaloCorner,
  HaloCornerElaborate,
  LunarDivider,
  LunarPhaseDivider,
  SimpleDivider,
  SunDisc,
  MoonDisc,
  CrescentMoon,
  CelestialEye,
  StarGlyph,
} from '../assets/ornaments/artNouveau';

// ============================================================================
// ART NOUVEAU HOME PAGE - FULL EXPRESSIVE STRENGTH
// Illuminated manuscript rendered as modern UI
// Ornaments are architectural, not decorative accents
// ============================================================================

// Large decorative halo arc for hero
const HeroHaloArc = ({ width = 400 }) => (
  <svg width={width} height={width * 0.4} viewBox="0 0 400 160" fill="none" className="pointer-events-none">
    {/* Outer arc */}
    <path 
      d="M20 150 Q200 -20 380 150" 
      stroke={NOUVEAU_COLORS.antiqueGold} 
      strokeWidth="2" 
      fill="none" 
      opacity="0.7"
    />
    {/* Middle arc */}
    <path 
      d="M50 140 Q200 10 350 140" 
      stroke={NOUVEAU_COLORS.antiqueGold} 
      strokeWidth="1.5" 
      fill="none" 
      opacity="0.5"
    />
    {/* Inner arc */}
    <path 
      d="M80 130 Q200 30 320 130" 
      stroke={NOUVEAU_COLORS.antiqueGold} 
      strokeWidth="1" 
      fill="none" 
      opacity="0.35"
    />
    {/* Decorative elements along the arc */}
    <circle cx="200" cy="30" r="8" stroke={NOUVEAU_COLORS.antiqueGold} strokeWidth="1.5" fill="none" opacity="0.6" />
    <circle cx="200" cy="30" r="4" stroke={NOUVEAU_COLORS.roseClay} strokeWidth="1" fill="none" opacity="0.5" />
    <circle cx="200" cy="30" r="1.5" fill={NOUVEAU_COLORS.antiqueGold} opacity="0.5" />
    {/* Side stars */}
    <circle cx="80" cy="100" r="3" stroke={NOUVEAU_COLORS.antiqueGold} strokeWidth="1" fill="none" opacity="0.4" />
    <circle cx="320" cy="100" r="3" stroke={NOUVEAU_COLORS.antiqueGold} strokeWidth="1" fill="none" opacity="0.4" />
    <circle cx="50" cy="120" r="2" fill={NOUVEAU_COLORS.antiqueGold} opacity="0.3" />
    <circle cx="350" cy="120" r="2" fill={NOUVEAU_COLORS.antiqueGold} opacity="0.3" />
    {/* Crescent accents */}
    <path d="M120 80 Q115 70 125 65 Q118 70 120 80" stroke={NOUVEAU_COLORS.antiqueGold} strokeWidth="1" fill="none" opacity="0.4" />
    <path d="M280 80 Q285 70 275 65 Q282 70 280 80" stroke={NOUVEAU_COLORS.antiqueGold} strokeWidth="1" fill="none" opacity="0.4" />
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

// Vellum content panel with cleaner framing
const VellumPanel = ({ children, className = '' }) => (
  <div 
    className={`relative ${className}`}
    style={{
      backgroundColor: NOUVEAU_COLORS.vellum,
      border: `1px solid ${NOUVEAU_COLORS.antiqueGold}50`,
      boxShadow: `
        0 2px 4px rgba(14, 42, 47, 0.08),
        0 8px 24px rgba(14, 42, 47, 0.06),
        inset 0 1px 0 rgba(255, 255, 255, 0.8)
      `,
    }}
  >
    {/* Inner border - very subtle */}
    <div 
      className="absolute inset-3 pointer-events-none"
      style={{ border: `1px solid ${NOUVEAU_COLORS.antiqueGold}15` }}
    />
    
    {/* Corner ornaments - minimal */}
    <div className="absolute top-2 left-2 pointer-events-none">
      <HaloCorner size={40} position="top-left" color={NOUVEAU_COLORS.mutedBrass} opacity={0.25} />
    </div>
    <div className="absolute top-2 right-2 pointer-events-none">
      <HaloCorner size={40} position="top-right" color={NOUVEAU_COLORS.mutedBrass} opacity={0.25} />
    </div>
    <div className="absolute bottom-2 left-2 pointer-events-none">
      <HaloCorner size={40} position="bottom-left" color={NOUVEAU_COLORS.mutedBrass} opacity={0.25} />
    </div>
    <div className="absolute bottom-2 right-2 pointer-events-none">
      <HaloCorner size={40} position="bottom-right" color={NOUVEAU_COLORS.mutedBrass} opacity={0.25} />
    </div>
    
    <div className="relative z-10 p-8 sm:p-10">{children}</div>
  </div>
);

// Feature card with Art Nouveau presence - supports brand icons
const FeatureCard = ({ icon: Icon, brandIcon, title, desc, tooltip }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    className="relative group"
  >
    {/* Card with layered borders */}
    <div 
      className="absolute inset-0"
      style={{ 
        backgroundColor: NOUVEAU_COLORS.celestialBlue,
        border: `2px solid ${NOUVEAU_COLORS.antiqueGold}50`,
      }}
    />
    <div 
      className="absolute inset-1.5 pointer-events-none"
      style={{ border: `1px solid ${NOUVEAU_COLORS.antiqueGold}25` }}
    />
    
    {/* Hover glow */}
    <div 
      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" 
      style={{ 
        background: `radial-gradient(ellipse at center, ${NOUVEAU_COLORS.emberPink}20 0%, transparent 70%)`,
        boxShadow: `inset 0 0 30px ${NOUVEAU_COLORS.antiqueGold}15`,
      }} 
    />
    
    {/* Corner ornaments - minimal on cards */}
    <div className="absolute top-2 left-2 pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity">
      <HaloCorner size={32} position="top-left" color={NOUVEAU_COLORS.antiqueGold} />
    </div>
    <div className="absolute top-2 right-2 pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity">
      <HaloCorner size={32} position="top-right" color={NOUVEAU_COLORS.antiqueGold} />
    </div>
    <div className="absolute bottom-2 left-2 pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity">
      <HaloCorner size={32} position="bottom-left" color={NOUVEAU_COLORS.antiqueGold} />
    </div>
    <div className="absolute bottom-2 right-2 pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity">
      <HaloCorner size={32} position="bottom-right" color={NOUVEAU_COLORS.antiqueGold} />
    </div>
    
    <div className="relative p-6 sm:p-8 text-center">
      {/* Icon with halo - supports both Lucide and brand icons */}
      <div className="relative w-16 h-16 mx-auto mb-4">
        <div 
          className="absolute inset-0 rounded-full opacity-30"
          style={{ 
            border: `1px solid ${NOUVEAU_COLORS.antiqueGold}`,
            boxShadow: `0 0 15px ${NOUVEAU_COLORS.emberPink}25`,
          }}
        />
        <div 
          className="absolute inset-1.5 rounded-full opacity-20"
          style={{ border: `1px solid ${NOUVEAU_COLORS.antiqueGold}` }}
        />
        {brandIcon ? (
          <div className="absolute inset-0 flex items-center justify-center group-hover:scale-110 transition-transform">
            <BrandIcon 
              name={brandIcon} 
              size={42} 
              variant="pink"
              opacity={0.95}
            />
          </div>
        ) : Icon ? (
          <Icon 
            className="absolute inset-0 w-full h-full p-3 group-hover:scale-110 transition-transform" 
            style={{ color: NOUVEAU_COLORS.emberPink, filter: `drop-shadow(0 0 10px ${NOUVEAU_COLORS.emberPink}40)` }} 
          />
        ) : null}
      </div>
      
      <h3 
        className="font-cinzel text-lg sm:text-xl tracking-wide mb-3"
        style={{ color: NOUVEAU_COLORS.antiqueGold, textShadow: `0 0 30px ${NOUVEAU_COLORS.emberPink}50, 0 0 60px ${NOUVEAU_COLORS.emberPink}30` }}
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
          
          {/* LOGO - PRESERVED EXACTLY */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 1.2 }} 
            className="relative mb-6 flex justify-center"
          >
            {/* Logo container with glow */}
            <div className="relative">
              {/* Subtle glow behind logo */}
              <div 
                className="absolute inset-0 rounded-full"
                style={{ 
                  background: 'radial-gradient(circle, rgba(185, 78, 106, 0.2) 0%, rgba(14, 42, 47, 0.35) 45%, transparent 65%)',
                  transform: 'scale(1.35)',
                  filter: 'blur(30px)',
                }}
              />
              <img 
                src="/images/brand/logo-alt.png" 
                alt="Where The Crowlands"
                className="relative w-56 h-auto sm:w-72 md:w-80 object-contain"
                style={{ filter: 'sepia(0.5) hue-rotate(-30deg) saturate(0.6) brightness(0.8) contrast(1.05)', opacity: 0.85 }}
              />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}>
            {/* Moon glyph */}
            <div className="flex justify-center mb-5">
              <BrandIcon name="moon" size={64} opacity={0.85} />
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
              A place where magic and science aren&apos;t such strange bedfellows
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
            
            <GrandCelestialDivider variant="moon" />
            
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
        
        {/* Bottom divider */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 pointer-events-none">
          <LunarPhaseDivider width={400} color={NOUVEAU_COLORS.antiqueGold} opacity={0.5} />
        </div>
      </SectionPlate>

      {/* ================================================================ */}
      {/* PHILOSOPHY SECTION - Vellum plate */}
      {/* ================================================================ */}
      <SectionPlate variant="light" className="py-16 sm:py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <GrandCelestialDivider variant="raven" />
          
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
          
          <GrandCelestialDivider variant="eye" />
        </div>
      </SectionPlate>

      {/* ================================================================ */}
      {/* FEATURES SECTION - Dark plate with cards */}
      {/* ================================================================ */}
      <SectionPlate variant="dark" className="py-14 sm:py-16 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Section header - balanced */}
          <div className="text-center mb-10">
            <div className="flex justify-center mb-3">
              <SunDisc size={48} color={NOUVEAU_COLORS.antiqueGold} opacity={0.7} />
            </div>
            <h2 
              className="font-cinzel text-xl sm:text-2xl md:text-3xl tracking-wide mb-3"
              style={{ 
                color: NOUVEAU_COLORS.antiqueGold, 
                textShadow: `0 0 30px ${NOUVEAU_COLORS.emberPink}50, 0 0 60px ${NOUVEAU_COLORS.emberPink}30`,
                letterSpacing: '0.08em',
              }}
            >
              Your Path Awaits
            </h2>
            <SimpleDivider width={180} color={NOUVEAU_COLORS.antiqueGold} opacity={0.5} />
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
          
          <div className="mt-12">
            <GrandCelestialDivider variant="moon" />
          </div>
        </div>
      </SectionPlate>

      {/* ================================================================ */}
      {/* LINEAGE SECTION - Vellum plate */}
      {/* ================================================================ */}
      <SectionPlate variant="light" className="py-14 sm:py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-4">
            <BrandIcon name="skull" size={56} opacity={0.75} />
          </div>
          
          <h2 
            className="font-cinzel text-xl sm:text-2xl md:text-3xl tracking-wide mb-6"
            style={{ 
              color: NOUVEAU_COLORS.midnightTeal, 
              textShadow: `0 0 25px ${NOUVEAU_COLORS.emberPink}35, 0 0 50px ${NOUVEAU_COLORS.emberPink}20`,
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
          
          <GrandCelestialDivider variant="eye" />
        </div>
      </SectionPlate>

      {/* ================================================================ */}
      {/* WAITLIST SECTION - Dark plate with vellum form */}
      {/* ================================================================ */}
      <SectionPlate variant="dark" className="py-16 sm:py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center gap-3 mb-4">
            <CrescentMoon size={24} facing="left" color={NOUVEAU_COLORS.antiqueGold} opacity={0.6} />
            <MoonDisc size={40} color={NOUVEAU_COLORS.antiqueGold} opacity={0.8} />
            <CrescentMoon size={24} facing="right" color={NOUVEAU_COLORS.antiqueGold} opacity={0.6} />
          </div>
          
          <h2 
            className="font-cinzel text-xl sm:text-2xl md:text-3xl tracking-wide mb-3"
            style={{ 
              color: NOUVEAU_COLORS.antiqueGold, 
              textShadow: `0 0 30px ${NOUVEAU_COLORS.emberPink}50, 0 0 60px ${NOUVEAU_COLORS.emberPink}30`,
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
          
          <div className="mt-10">
            <LunarPhaseDivider width={320} color={NOUVEAU_COLORS.antiqueGold} opacity={0.4} />
          </div>
        </div>
      </SectionPlate>
    </div>
  );
};

export default Home;
