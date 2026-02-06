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

// Grand section plate frame - illuminated manuscript style
const SectionPlate = ({ children, variant = 'dark', className = '' }) => {
  const isDark = variant === 'dark';
  
  return (
    <div className={`relative ${className}`}>
      {/* Background with gradient depth */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundColor: isDark ? NOUVEAU_COLORS.midnightTeal : NOUVEAU_COLORS.vellum,
          backgroundImage: isDark 
            ? `radial-gradient(ellipse at 50% 0%, ${NOUVEAU_COLORS.celestialBlue}80 0%, transparent 50%),
               radial-gradient(ellipse at 20% 80%, ${NOUVEAU_COLORS.celestialBlue}40 0%, transparent 40%),
               radial-gradient(ellipse at 80% 60%, ${NOUVEAU_COLORS.celestialBlue}30 0%, transparent 35%)`
            : 'none',
        }}
      />
      
      {/* Vignette overlay for dark sections */}
      {isDark && (
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 30%, rgba(14, 42, 47, 0.4) 100%)',
          }}
        />
      )}
      
      {/* Top border ornament */}
      <div 
        className="absolute top-0 left-0 right-0 h-1 pointer-events-none"
        style={{ 
          background: isDark 
            ? `linear-gradient(to right, transparent 5%, ${NOUVEAU_COLORS.antiqueGold}60 20%, ${NOUVEAU_COLORS.antiqueGold} 50%, ${NOUVEAU_COLORS.antiqueGold}60 80%, transparent 95%)`
            : `linear-gradient(to right, transparent 5%, ${NOUVEAU_COLORS.roseClay}80 20%, ${NOUVEAU_COLORS.roseClay} 50%, ${NOUVEAU_COLORS.roseClay}80 80%, transparent 95%)`,
        }}
      />
      <div 
        className="absolute top-1 left-0 right-0 h-px pointer-events-none"
        style={{ 
          background: `linear-gradient(to right, transparent 10%, ${NOUVEAU_COLORS.antiqueGold}50 30%, ${NOUVEAU_COLORS.antiqueGold}50 70%, transparent 90%)`,
        }}
      />
      
      {/* Bottom border ornament */}
      <div 
        className="absolute bottom-1 left-0 right-0 h-px pointer-events-none"
        style={{ 
          background: `linear-gradient(to right, transparent 10%, ${NOUVEAU_COLORS.antiqueGold}50 30%, ${NOUVEAU_COLORS.antiqueGold}50 70%, transparent 90%)`,
        }}
      />
      <div 
        className="absolute bottom-0 left-0 right-0 h-1 pointer-events-none"
        style={{ 
          background: isDark 
            ? `linear-gradient(to right, transparent 5%, ${NOUVEAU_COLORS.antiqueGold}60 20%, ${NOUVEAU_COLORS.antiqueGold} 50%, ${NOUVEAU_COLORS.antiqueGold}60 80%, transparent 95%)`
            : `linear-gradient(to right, transparent 5%, ${NOUVEAU_COLORS.roseClay}80 20%, ${NOUVEAU_COLORS.roseClay} 50%, ${NOUVEAU_COLORS.roseClay}80 80%, transparent 95%)`,
        }}
      />
      
      {/* Large corner ornaments - architectural scale */}
      <div className="absolute top-4 left-4 pointer-events-none">
        <HaloCornerElaborate 
          size={140} 
          position="top-left" 
          color={isDark ? NOUVEAU_COLORS.antiqueGold : NOUVEAU_COLORS.mutedBrass} 
          accentColor={NOUVEAU_COLORS.roseClay}
          opacity={isDark ? 0.7 : 0.5} 
        />
      </div>
      <div className="absolute top-4 right-4 pointer-events-none">
        <HaloCornerElaborate 
          size={140} 
          position="top-right" 
          color={isDark ? NOUVEAU_COLORS.antiqueGold : NOUVEAU_COLORS.mutedBrass}
          accentColor={NOUVEAU_COLORS.roseClay}
          opacity={isDark ? 0.7 : 0.5} 
        />
      </div>
      <div className="absolute bottom-4 left-4 pointer-events-none">
        <HaloCornerElaborate 
          size={140} 
          position="bottom-left" 
          color={isDark ? NOUVEAU_COLORS.antiqueGold : NOUVEAU_COLORS.mutedBrass}
          accentColor={NOUVEAU_COLORS.roseClay}
          opacity={isDark ? 0.7 : 0.5} 
        />
      </div>
      <div className="absolute bottom-4 right-4 pointer-events-none">
        <HaloCornerElaborate 
          size={140} 
          position="bottom-right" 
          color={isDark ? NOUVEAU_COLORS.antiqueGold : NOUVEAU_COLORS.mutedBrass}
          accentColor={NOUVEAU_COLORS.roseClay}
          opacity={isDark ? 0.7 : 0.5} 
        />
      </div>
      
      {/* Side rail ornaments */}
      <div className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 flex-col items-center gap-4 opacity-50 pointer-events-none">
        <div className="w-px h-20" style={{ background: `linear-gradient(to bottom, transparent, ${NOUVEAU_COLORS.antiqueGold}, transparent)` }} />
        <CrescentMoon size={20} facing="right" color={NOUVEAU_COLORS.antiqueGold} opacity={0.7} />
        <div className="w-px h-20" style={{ background: `linear-gradient(to bottom, transparent, ${NOUVEAU_COLORS.antiqueGold}, transparent)` }} />
        <StarGlyph size={16} color={NOUVEAU_COLORS.antiqueGold} opacity={0.6} />
        <div className="w-px h-20" style={{ background: `linear-gradient(to bottom, transparent, ${NOUVEAU_COLORS.antiqueGold}, transparent)` }} />
      </div>
      <div className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 flex-col items-center gap-4 opacity-50 pointer-events-none">
        <div className="w-px h-20" style={{ background: `linear-gradient(to bottom, transparent, ${NOUVEAU_COLORS.antiqueGold}, transparent)` }} />
        <CrescentMoon size={20} facing="left" color={NOUVEAU_COLORS.antiqueGold} opacity={0.7} />
        <div className="w-px h-20" style={{ background: `linear-gradient(to bottom, transparent, ${NOUVEAU_COLORS.antiqueGold}, transparent)` }} />
        <StarGlyph size={16} color={NOUVEAU_COLORS.antiqueGold} opacity={0.6} />
        <div className="w-px h-20" style={{ background: `linear-gradient(to bottom, transparent, ${NOUVEAU_COLORS.antiqueGold}, transparent)` }} />
      </div>
      
      <div className="relative z-10">{children}</div>
    </div>
  );
};

// Grand divider with celestial presence
const GrandCelestialDivider = ({ variant = 'moon' }) => (
  <div className="relative py-8 sm:py-10 flex flex-col items-center gap-2">
    {variant === 'moon' ? (
      <>
        <div className="flex items-center gap-4">
          <div className="w-16 sm:w-24 h-px" style={{ background: `linear-gradient(to right, transparent, ${NOUVEAU_COLORS.antiqueGold})` }} />
          <CrescentMoon size={24} facing="left" color={NOUVEAU_COLORS.antiqueGold} opacity={0.7} />
          <SunDisc size={40} color={NOUVEAU_COLORS.antiqueGold} opacity={0.8} />
          <CrescentMoon size={24} facing="right" color={NOUVEAU_COLORS.antiqueGold} opacity={0.7} />
          <div className="w-16 sm:w-24 h-px" style={{ background: `linear-gradient(to left, transparent, ${NOUVEAU_COLORS.antiqueGold})` }} />
        </div>
        <LunarPhaseDivider width={320} color={NOUVEAU_COLORS.antiqueGold} opacity={0.5} />
      </>
    ) : variant === 'raven' ? (
      <>
        <div className="flex items-center gap-6">
          <div className="w-20 sm:w-32 h-px" style={{ background: `linear-gradient(to right, transparent, ${NOUVEAU_COLORS.antiqueGold})` }} />
          <RavenGlyph size={56} color={NOUVEAU_COLORS.antiqueGold} opacity={0.8} />
          <div className="w-20 sm:w-32 h-px" style={{ background: `linear-gradient(to left, transparent, ${NOUVEAU_COLORS.antiqueGold})` }} />
        </div>
        <SimpleDivider width={180} color={NOUVEAU_COLORS.antiqueGold} opacity={0.4} />
      </>
    ) : (
      <>
        <div className="flex items-center gap-3">
          <StarGlyph size={16} color={NOUVEAU_COLORS.antiqueGold} opacity={0.5} />
          <CelestialEye size={48} color={NOUVEAU_COLORS.antiqueGold} accentColor={NOUVEAU_COLORS.roseClay} opacity={0.8} />
          <StarGlyph size={16} color={NOUVEAU_COLORS.antiqueGold} opacity={0.5} />
        </div>
        <LunarDivider width={260} color={NOUVEAU_COLORS.antiqueGold} opacity={0.5} />
      </>
    )}
  </div>
);

// Vellum content panel with strong framing
const VellumPanel = ({ children, className = '' }) => (
  <div 
    className={`relative ${className}`}
    style={{
      backgroundColor: NOUVEAU_COLORS.vellum,
      border: `2px solid ${NOUVEAU_COLORS.antiqueGold}70`,
      boxShadow: `
        0 2px 4px rgba(14, 42, 47, 0.1),
        0 8px 24px rgba(14, 42, 47, 0.08),
        inset 0 1px 0 rgba(255, 255, 255, 0.8),
        inset 0 -1px 0 rgba(200, 164, 77, 0.1)
      `,
    }}
  >
    {/* Inner border */}
    <div 
      className="absolute inset-2 pointer-events-none"
      style={{ border: `1px solid ${NOUVEAU_COLORS.antiqueGold}30` }}
    />
    
    {/* Corner ornaments */}
    <div className="absolute top-3 left-3 pointer-events-none">
      <HaloCorner size={60} position="top-left" color={NOUVEAU_COLORS.mutedBrass} opacity={0.6} />
    </div>
    <div className="absolute top-3 right-3 pointer-events-none">
      <HaloCorner size={60} position="top-right" color={NOUVEAU_COLORS.mutedBrass} opacity={0.6} />
    </div>
    <div className="absolute bottom-3 left-3 pointer-events-none">
      <HaloCorner size={60} position="bottom-left" color={NOUVEAU_COLORS.mutedBrass} opacity={0.6} />
    </div>
    <div className="absolute bottom-3 right-3 pointer-events-none">
      <HaloCorner size={60} position="bottom-right" color={NOUVEAU_COLORS.mutedBrass} opacity={0.6} />
    </div>
    
    <div className="relative z-10 p-6 sm:p-8">{children}</div>
  </div>
);

// Feature card with Art Nouveau presence
const FeatureCard = ({ icon: Icon, title, desc, tooltip }) => (
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
    
    {/* Corner ornaments */}
    <div className="absolute top-2 left-2 pointer-events-none opacity-50 group-hover:opacity-80 transition-opacity">
      <HaloCorner size={40} position="top-left" color={NOUVEAU_COLORS.antiqueGold} />
    </div>
    <div className="absolute top-2 right-2 pointer-events-none opacity-50 group-hover:opacity-80 transition-opacity">
      <HaloCorner size={40} position="top-right" color={NOUVEAU_COLORS.antiqueGold} />
    </div>
    <div className="absolute bottom-2 left-2 pointer-events-none opacity-50 group-hover:opacity-80 transition-opacity">
      <HaloCorner size={40} position="bottom-left" color={NOUVEAU_COLORS.antiqueGold} />
    </div>
    <div className="absolute bottom-2 right-2 pointer-events-none opacity-50 group-hover:opacity-80 transition-opacity">
      <HaloCorner size={40} position="bottom-right" color={NOUVEAU_COLORS.antiqueGold} />
    </div>
    
    <div className="relative p-6 sm:p-8 text-center">
      {/* Icon with halo */}
      <div className="relative w-14 h-14 mx-auto mb-4">
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
        <Icon 
          className="absolute inset-0 w-full h-full p-3 group-hover:scale-110 transition-transform" 
          style={{ color: NOUVEAU_COLORS.emberPink, filter: `drop-shadow(0 0 10px ${NOUVEAU_COLORS.emberPink}40)` }} 
        />
      </div>
      
      <h3 
        className="font-cinzel text-lg sm:text-xl tracking-wide mb-3"
        style={{ color: NOUVEAU_COLORS.antiqueGold, textShadow: `0 2px 8px ${NOUVEAU_COLORS.antiqueGold}25` }}
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
            {/* Circular container for logo with fade */}
            <div className="relative w-56 h-56 sm:w-72 sm:h-72 md:w-80 md:h-80">
              {/* Subtle radial fade behind logo - cream to teal */}
              <div 
                className="absolute inset-0 pointer-events-none rounded-full"
                style={{ 
                  background: 'radial-gradient(circle, rgba(243, 239, 232, 0.95) 0%, rgba(243, 239, 232, 0.8) 35%, rgba(200, 164, 77, 0.2) 55%, rgba(14, 42, 47, 0.4) 75%, transparent 100%)',
                  transform: 'scale(1.08)',
                }} 
              />
              <img 
                src="/images/brand/logo-alt.png" 
                alt="Where The Crowlands"
                className="relative w-full h-full object-contain rounded-full"
              />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}>
            {/* Raven glyph */}
            <div className="flex justify-center mb-5">
              <RavenGlyph size={56} color={NOUVEAU_COLORS.antiqueGold} opacity={0.8} />
            </div>
            
            {/* Title - balanced, not oversized */}
            <h1 
              className="phantasmagoria-hero text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-wide mb-3 leading-tight"
              style={{ 
                color: NOUVEAU_COLORS.antiqueGold, 
                textShadow: `0 2px 30px ${NOUVEAU_COLORS.antiqueGold}50, 0 0 60px ${NOUVEAU_COLORS.emberPink}20`,
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
                textShadow: '0 2px 15px rgba(0, 0, 0, 0.4)',
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
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
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
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                to="/spell-request" 
                data-testid="hero-begin-journey-btn"
                className="group relative px-10 py-4 overflow-hidden transition-all duration-300"
                style={{
                  backgroundColor: NOUVEAU_COLORS.emberPink,
                  border: `2px solid ${NOUVEAU_COLORS.antiqueGold}`,
                  boxShadow: `0 0 30px ${NOUVEAU_COLORS.emberPink}40`,
                }}
              >
                <span 
                  className="relative flex items-center gap-3 font-cinzel tracking-[0.2em] uppercase text-sm sm:text-base"
                  style={{ color: NOUVEAU_COLORS.vellum }}
                >
                  <Sparkles className="w-5 h-5" /> Begin Your Journey
                </span>
              </Link>
              <Link 
                to="/guides" 
                data-testid="hero-meet-guides-btn"
                className="group relative px-10 py-4 transition-all duration-300 hover:bg-opacity-10"
                style={{
                  backgroundColor: 'transparent',
                  border: `2px solid ${NOUVEAU_COLORS.antiqueGold}`,
                }}
              >
                <span 
                  className="flex items-center gap-3 font-cinzel tracking-[0.2em] uppercase text-sm sm:text-base"
                  style={{ color: NOUVEAU_COLORS.antiqueGold }}
                >
                  <Users className="w-5 h-5" /> Meet Your Guides
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
                textShadow: `0 2px 20px ${NOUVEAU_COLORS.antiqueGold}40`,
                letterSpacing: '0.08em',
              }}
            >
              Your Path Awaits
            </h2>
            <SimpleDivider width={180} color={NOUVEAU_COLORS.antiqueGold} opacity={0.5} />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <FeatureCard 
              icon={Sparkles} 
              title="Craft Your Spells" 
              desc="Generate personalized rituals guided by four ancestral archetypes, each with their own voice and wisdom." 
            />
            <FeatureCard 
              icon={BookOpen} 
              title="Build Your Grimoire" 
              desc="A living archive of wonder—save spells, collect wards, and build your personal magical practice over time." 
              tooltip="From the French for 'grammar'—every ritual has its own language for shaping reality" 
            />
            <FeatureCard 
              icon={Moon} 
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
            <RavenGlyph size={48} color={NOUVEAU_COLORS.mutedBrass} opacity={0.7} />
          </div>
          
          <h2 
            className="font-cinzel text-xl sm:text-2xl md:text-3xl tracking-wide mb-6"
            style={{ 
              color: NOUVEAU_COLORS.midnightTeal, 
              textShadow: `0 2px 10px ${NOUVEAU_COLORS.emberPink}15`,
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
              textShadow: `0 2px 20px ${NOUVEAU_COLORS.antiqueGold}40`,
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
