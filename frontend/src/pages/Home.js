import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Moon, BookOpen, Users, Sparkles, Star, Feather, Heart } from 'lucide-react';
import { WaitlistForm } from '../components/WaitlistForm';

// ===== ELABORATE ORNATE COMPONENTS =====

// Multi-layered corner ornament
const ElaborateCorner = ({ className, variant = 'gold' }) => {
  const colors = variant === 'gold' 
    ? { primary: '#d4a84b', secondary: '#b82330', tertiary: '#e6c068' }
    : { primary: '#b82330', secondary: '#d4a84b', tertiary: '#d42a3a' };
  
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none">
      <path d="M0,60 Q0,0 60,0" stroke={colors.primary} strokeWidth="2.5" opacity="0.9" />
      <path d="M0,48 Q0,0 48,0" stroke={colors.primary} strokeWidth="1.5" opacity="0.6" />
      <path d="M0,36 Q0,0 36,0" stroke={colors.tertiary} strokeWidth="1" opacity="0.4" />
      <path d="M12,72 Q12,12 72,12" stroke={colors.secondary} strokeWidth="1" opacity="0.4" />
      <polygon points="18,18 24,10 30,18 24,26" fill={colors.secondary} opacity="0.95" />
      <polygon points="10,10 14,5 18,10 14,15" fill={colors.primary} opacity="0.7" />
      <circle cx="36" cy="36" r="2.5" fill={colors.primary} opacity="0.6" />
      <circle cx="10" cy="30" r="1.5" fill={colors.secondary} opacity="0.5" />
      <circle cx="30" cy="10" r="1.5" fill={colors.secondary} opacity="0.5" />
      <circle cx="48" cy="6" r="1" fill={colors.primary} opacity="0.4" />
      <circle cx="6" cy="48" r="1" fill={colors.primary} opacity="0.4" />
    </svg>
  );
};

// Grand section divider
const GrandDivider = ({ variant = 'default', light = false }) => {
  const lineColor = light ? 'from-navy-dark/30 via-crimson/50 to-navy-dark/30' : 'from-transparent via-gold/80 to-transparent';
  const accentColor = light ? 'text-crimson' : 'text-crimson-bright';
  const symbolColor = light ? 'text-navy-dark' : 'text-gold';
  
  return (
    <div className="relative py-8 sm:py-10">
      <div className="flex items-center justify-center gap-3 sm:gap-6">
        <span className={`${accentColor} text-sm sm:text-base opacity-60`}>✧</span>
        <div className={`h-0.5 w-16 sm:w-32 bg-gradient-to-r ${lineColor}`} />
        <span className={`${accentColor} text-lg sm:text-2xl glow-crimson`}>◆</span>
        
        <div className={`${symbolColor} flex items-center gap-2`}>
          {variant === 'moon' ? (
            <>
              <span className="text-xl sm:text-2xl opacity-50">☾</span>
              <span className={`text-2xl sm:text-4xl ${light ? '' : 'glow-gold'}`}>☽</span>
              <span className="text-xl sm:text-2xl opacity-50">☽</span>
            </>
          ) : variant === 'eye' ? (
            <>
              <span className="text-lg sm:text-xl opacity-50">✦</span>
              <span className={`text-2xl sm:text-4xl ${light ? '' : 'glow-gold'}`}>👁</span>
              <span className="text-lg sm:text-xl opacity-50">✦</span>
            </>
          ) : variant === 'crow' ? (
            <span className="text-2xl sm:text-4xl">🐦‍⬛</span>
          ) : (
            <>
              <span className="text-lg sm:text-xl opacity-60">❦</span>
              <span className={`text-xl sm:text-3xl ${light ? '' : 'glow-gold'}`}>❧</span>
              <span className="text-lg sm:text-xl opacity-60">❦</span>
            </>
          )}
        </div>
        
        <span className={`${accentColor} text-lg sm:text-2xl glow-crimson`}>◆</span>
        <div className={`h-0.5 w-16 sm:w-32 bg-gradient-to-l ${lineColor}`} />
        <span className={`${accentColor} text-sm sm:text-base opacity-60`}>✧</span>
      </div>
    </div>
  );
};

// Simple divider
const MysticalDivider = ({ variant = 'default', light = false }) => {
  const lineColor = light ? 'via-crimson/40' : 'via-gold/60';
  const accentColor = light ? 'text-crimson' : 'text-crimson-bright';
  const symbolColor = light ? 'text-navy-dark' : 'text-gold';
  
  return (
    <div className="flex items-center justify-center gap-4 py-4 sm:py-6">
      <div className={`h-0.5 bg-gradient-to-r from-transparent ${lineColor} to-transparent flex-1 max-w-24 sm:max-w-32`} />
      <div className={`flex items-center gap-2 ${symbolColor}`}>
        {variant === 'crow' ? (
          <span className="text-xl sm:text-2xl">🐦‍⬛</span>
        ) : variant === 'moon' ? (
          <>
            <span className={`text-sm sm:text-base ${accentColor}`}>◆</span>
            <span className={`text-lg sm:text-xl ${light ? '' : 'glow-gold'}`}>☽</span>
            <span className={`text-sm sm:text-base ${accentColor}`}>◆</span>
          </>
        ) : (
          <>
            <span className={`text-xs sm:text-sm ${accentColor}`}>◆</span>
            <span className={`text-base sm:text-lg ${light ? '' : 'glow-gold'}`}>❧</span>
            <span className={`text-xs sm:text-sm ${accentColor}`}>◆</span>
          </>
        )}
      </div>
      <div className={`h-0.5 bg-gradient-to-l from-transparent ${lineColor} to-transparent flex-1 max-w-24 sm:max-w-32`} />
    </div>
  );
};

// Ornate waitlist frame
const OrnateWaitlistFrame = ({ children }) => (
  <div className="relative max-w-lg mx-auto">
    <div className="absolute -inset-4 opacity-30 blur-xl" style={{ background: 'radial-gradient(ellipse at center, rgba(212, 168, 75, 0.4) 0%, transparent 70%)' }} />
    <div className="absolute inset-0 border-2 border-gold rounded-sm" />
    <div className="absolute inset-1.5 border border-crimson/50 rounded-sm" />
    <div className="absolute inset-3 border border-gold/30 rounded-sm" />
    <div className="absolute inset-0 bg-navy-mid/70 backdrop-blur-md rounded-sm" />
    
    <ElaborateCorner className="absolute -top-5 -left-5 w-20 h-20 sm:w-24 sm:h-24" variant="gold" />
    <ElaborateCorner className="absolute -top-5 -right-5 w-20 h-20 sm:w-24 sm:h-24 rotate-90" variant="gold" />
    <ElaborateCorner className="absolute -bottom-5 -left-5 w-20 h-20 sm:w-24 sm:h-24 -rotate-90" variant="gold" />
    <ElaborateCorner className="absolute -bottom-5 -right-5 w-20 h-20 sm:w-24 sm:h-24 rotate-180" variant="gold" />
    
    <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-navy-dark px-3 py-0.5">
      <span className="text-gold text-xs">✧</span>
      <span className="text-crimson text-sm glow-crimson">◆</span>
      <span className="text-gold text-lg glow-gold">☽</span>
      <span className="text-crimson text-sm glow-crimson">◆</span>
      <span className="text-gold text-xs">✧</span>
    </div>
    
    <div className="relative z-10 p-5 sm:p-8">{children}</div>
  </div>
);

// Feature card with ornate styling
const OrnateFeatureCard = ({ icon: Icon, title, desc, tooltip }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    className="relative group"
  >
    <div className="absolute inset-0 border-2 border-gold/40 rounded-lg group-hover:border-gold/70 transition-all duration-500" />
    <div className="absolute inset-1.5 border border-crimson/25 rounded-md group-hover:border-crimson/50 transition-all duration-500" />
    <div className="absolute inset-0 bg-navy-mid/60 rounded-lg backdrop-blur-sm" />
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg" style={{ background: 'radial-gradient(ellipse at center, rgba(184, 35, 48, 0.1) 0%, transparent 70%)' }} />
    
    <span className="absolute -top-2 -left-2 text-crimson text-lg opacity-60 group-hover:opacity-100 group-hover:scale-125 transition-all duration-300 glow-crimson">◆</span>
    <span className="absolute -top-2 -right-2 text-crimson text-lg opacity-60 group-hover:opacity-100 group-hover:scale-125 transition-all duration-300 glow-crimson">◆</span>
    <span className="absolute -bottom-2 -left-2 text-crimson text-lg opacity-60 group-hover:opacity-100 group-hover:scale-125 transition-all duration-300 glow-crimson">◆</span>
    <span className="absolute -bottom-2 -right-2 text-crimson text-lg opacity-60 group-hover:opacity-100 group-hover:scale-125 transition-all duration-300 glow-crimson">◆</span>
    <span className="absolute top-1/2 -left-1 -translate-y-1/2 text-gold text-xs opacity-40 group-hover:opacity-70">✦</span>
    <span className="absolute top-1/2 -right-1 -translate-y-1/2 text-gold text-xs opacity-40 group-hover:opacity-70">✦</span>
    
    <div className="relative p-6 sm:p-8 text-center">
      <Icon className="w-10 h-10 sm:w-12 sm:h-12 text-crimson-bright mx-auto mb-4 group-hover:scale-110 transition-transform" style={{ filter: 'drop-shadow(0 0 12px rgba(184, 35, 48, 0.5))' }} />
      <h3 className="font-cinzel text-lg sm:text-xl text-gold mb-3">{title}</h3>
      <p className="font-crimson text-sm sm:text-base text-silver-mist/85">{desc}</p>
      {tooltip && <p className="font-montserrat text-xs text-gold/50 mt-3 opacity-0 group-hover:opacity-100 transition-opacity italic">{tooltip}</p>}
    </div>
  </motion.div>
);

export const Home = () => {
  return (
    <div className="min-h-screen">
      {/* ===== DARK HERO SECTION ===== */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-navy-dark">
        {/* Background layers */}
        <div className="absolute inset-0 z-0" style={{
          backgroundImage: 'url(https://customer-assets.emergentagent.com/job_mystic-circle-2/artifacts/t5tfc6i3_COuld_we_creatre_more_of_these_--profile_bsfwy2d_--v_7_d08b86ee-a6ac-4cf3-a814-1344b45b3380_1.png)',
          backgroundSize: 'cover', backgroundPosition: 'center', opacity: '0.06', filter: 'hue-rotate(200deg) saturate(0.5)',
        }} />
        <div className="absolute inset-0 z-0" style={{
          background: 'radial-gradient(ellipse at 50% 30%, rgba(184, 35, 48, 0.12) 0%, transparent 50%), radial-gradient(ellipse at 30% 70%, rgba(212, 168, 75, 0.08) 0%, transparent 40%)',
        }} />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-dark/40 via-transparent to-navy-dark z-0" />
        
        {/* Elaborate corners */}
        <ElaborateCorner className="absolute top-3 left-3 w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32" variant="gold" />
        <ElaborateCorner className="absolute top-3 right-3 w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 rotate-90" variant="gold" />
        <ElaborateCorner className="absolute bottom-3 left-3 w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 -rotate-90" variant="gold" />
        <ElaborateCorner className="absolute bottom-3 right-3 w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 rotate-180" variant="gold" />
        
        {/* Edge decorations */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 flex items-center gap-2 mt-3 sm:mt-4">
          <span className="text-gold/40 text-xs sm:text-sm">✧</span>
          <span className="text-crimson/60 text-sm sm:text-base">◆</span>
          <span className="text-gold/40 text-xs sm:text-sm">✧</span>
        </div>
        <div className="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 flex-col items-center gap-3 opacity-40">
          <span className="text-gold text-xs">✦</span>
          <div className="w-px h-12 bg-gradient-to-b from-transparent via-gold to-transparent" />
          <span className="text-crimson text-sm">◆</span>
          <div className="w-px h-12 bg-gradient-to-b from-transparent via-gold to-transparent" />
          <span className="text-gold text-xs">✦</span>
        </div>
        <div className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 flex-col items-center gap-3 opacity-40">
          <span className="text-gold text-xs">✦</span>
          <div className="w-px h-12 bg-gradient-to-b from-transparent via-gold to-transparent" />
          <span className="text-crimson text-sm">◆</span>
          <div className="w-px h-12 bg-gradient-to-b from-transparent via-gold to-transparent" />
          <span className="text-gold text-xs">✦</span>
        </div>
        
        <div className="relative z-10 text-center max-w-5xl px-4 sm:px-6 py-12 sm:py-16">
          {/* Logo */}
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2 }} className="relative mb-4 sm:mb-6">
            <div className="absolute inset-0 blur-3xl opacity-60" style={{ background: 'radial-gradient(circle, rgba(184, 35, 48, 0.5) 0%, rgba(212, 168, 75, 0.3) 40%, transparent 70%)' }} />
            <img src="https://customer-assets.emergentagent.com/job_mystic-circle-2/artifacts/li34ks3x_Where%20the%20Crowlands%20Logos.png" alt="Where The Crowlands"
              className="relative w-48 h-48 sm:w-64 sm:h-64 md:w-72 md:h-72 mx-auto object-contain"
              style={{ filter: 'brightness(1.4) contrast(1.1) drop-shadow(0 0 50px rgba(212, 168, 75, 0.5))' }} />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}>
            <h1 className="font-italiana text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-gold-light mb-3 sm:mb-4 tracking-tight leading-none"
              style={{ textShadow: '0 4px 40px rgba(212, 168, 75, 0.6), 0 0 80px rgba(184, 35, 48, 0.4)' }}>
              Where The Crowlands
            </h1>
            <p className="font-cinzel text-base sm:text-xl md:text-2xl text-cream/90 mb-6 sm:mb-8 tracking-wide"
              style={{ textShadow: '0 2px 15px rgba(0, 0, 0, 0.6)' }}>
              A place where magic and science aren't such strange bedfellows
            </p>
            
            <GrandDivider variant="moon" />
            
            <div className="font-crimson text-sm sm:text-base md:text-lg text-cream/85 leading-relaxed max-w-3xl mx-auto px-2 sm:px-4">
              <p className="first-letter:text-4xl sm:first-letter:text-5xl first-letter:font-italiana first-letter:text-crimson-bright first-letter:float-left first-letter:mr-2 sm:first-letter:mr-3 first-letter:leading-none first-letter:glow-crimson">
                Where the Crowlands is a toolkit for alchemizing what you already hold. Rooted in history; from the 
                Huguenot mystics fleeing persecution, Jersey witches shaping weather and fate, Irish and Celtic keepers 
                of forbidden knowledge, to London's table-tappers and spiritualists revealing the hidden world. The stoicism 
                of WWII echoes of Churchill-influenced resolve, and the hard-won wisdom of London's East End, where "Loose 
                lips sink ships" wasn't just a slogan; it was a way of living.
              </p>
            </div>
            
            {/* CTA Buttons - moved up from waitlist section */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
              <Link to="/spell-request" className="group relative px-6 sm:px-8 py-2.5 sm:py-3 overflow-hidden">
                <div className="absolute inset-0 border-2 border-gold rounded-sm" />
                <div className="absolute inset-1 bg-gradient-to-r from-crimson-deep via-crimson to-crimson-deep rounded-sm" />
                <div className="absolute inset-1 bg-gradient-to-t from-black/30 to-transparent rounded-sm" />
                <span className="relative flex items-center gap-2 font-montserrat text-cream tracking-widest uppercase text-xs sm:text-sm">
                  <Sparkles className="w-4 h-4" /> Begin Your Journey
                </span>
              </Link>
              <Link to="/guides" className="group relative px-6 sm:px-8 py-2.5 sm:py-3 border-2 border-gold/40 hover:border-gold/70 rounded-sm transition-all hover:bg-gold/10">
                <span className="flex items-center gap-2 font-montserrat text-cream/90 tracking-widest uppercase text-xs sm:text-sm group-hover:text-gold transition-colors">
                  <Users className="w-4 h-4" /> Meet Your Guides
                </span>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ===== LIGHT PARCHMENT SECTION - Philosophy ===== */}
      <div className="relative py-10 sm:py-14" style={{ background: 'linear-gradient(135deg, #f5f0e6 0%, #e8e0d0 50%, #f5f0e6 100%)' }}>
        {/* Subtle pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 30L45 15M30 30L15 45M30 30L45 45M30 30L15 15' stroke='%230e1629' stroke-width='0.5' fill='none'/%3E%3C/svg%3E")`,
        }} />
        
        {/* Ornate borders */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-crimson to-transparent" />
        <div className="absolute top-1 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
        <div className="absolute bottom-0.5 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-crimson to-transparent" />
        
        {/* Corners - smaller */}
        <ElaborateCorner className="absolute top-2 left-2 w-12 h-12 sm:w-16 sm:h-16" variant="crimson" />
        <ElaborateCorner className="absolute top-2 right-2 w-12 h-12 sm:w-16 sm:h-16 rotate-90" variant="crimson" />
        <ElaborateCorner className="absolute bottom-2 left-2 w-12 h-12 sm:w-16 sm:h-16 -rotate-90" variant="crimson" />
        <ElaborateCorner className="absolute bottom-2 right-2 w-12 h-12 sm:w-16 sm:h-16 rotate-180" variant="crimson" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
          <MysticalDivider variant="crow" light />
          
          <div className="font-crimson text-sm sm:text-base text-navy-dark/85 leading-relaxed max-w-3xl mx-auto px-2 sm:px-4 space-y-4 mb-6 sm:mb-8">
            <p>
              The magic we've abandoned isn't "woo woo"—it's intention, craft, commitment, and ritual. Whether our ancestors 
              named it or not, that power is still yours to work with. Inspired by real people—my family—and grounded in plenty 
              of creative lore and imagination, Where the Crowlands offers a fun, practical way to bring alchemy, magic, and 
              beauty into your life.
            </p>
            <p className="text-crimson/90 italic border-l-4 border-gold/60 pl-4 py-2 bg-gold/10 rounded-r text-sm">
              While rooted primarily in British history and mysticism, we plan to expand, honouring all cultures—every tradition 
              has drawn from what lies beneath the veil. It's time to bring a little magic back.
            </p>
          </div>
          
          <MysticalDivider variant="moon" light />
        </div>
      </div>

      {/* ===== DARK FEATURES SECTION ===== */}
      <div className="relative py-10 sm:py-14 px-4 bg-navy-dark">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(26, 45, 77, 0.4) 0%, transparent 60%)' }} />
        
        <div className="relative z-10 max-w-6xl mx-auto">
          <MysticalDivider variant="default" />
          
          <h2 className="font-italiana text-xl sm:text-2xl md:text-3xl text-gold-light text-center mb-8 sm:mb-10"
            style={{ textShadow: '0 2px 25px rgba(212, 168, 75, 0.5)' }}>
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

      {/* ===== LIGHT TESTIMONIAL/PHILOSOPHY SECTION ===== */}
      <div className="relative py-10 sm:py-14" style={{ background: 'linear-gradient(180deg, #f5f0e6 0%, #e8e0d0 100%)' }}>
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-crimson to-transparent" />
        <ElaborateCorner className="absolute top-2 left-2 w-12 h-12 sm:w-14 sm:h-14" variant="crimson" />
        <ElaborateCorner className="absolute top-2 right-2 w-12 h-12 sm:w-14 sm:h-14 rotate-90" variant="crimson" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <MysticalDivider variant="crow" light />
          
          <h2 className="font-italiana text-xl sm:text-2xl md:text-3xl text-crimson mb-4 sm:mb-6"
            style={{ textShadow: '0 2px 15px rgba(184, 35, 48, 0.3)' }}>
            The Lineage
          </h2>
          
          <div className="font-crimson text-sm sm:text-base text-navy-dark/85 leading-relaxed space-y-3 mb-6">
            <p>
              The druids, templers, occultists, astrologers, hermetic philosophers, "witches" midwives and alchemists before them…
              These four women span over a century of practice—from Victorian Spitalfields to contemporary London. Each carried the 
              magic forward in her own way: through craft, through secrets, through poetry, and through truth-telling.
            </p>
            <p className="text-gold-dark italic text-sm">
              You don't need to choose just one. Their wisdom overlaps, contradicts, and complements. Like any family, they argue. 
              Like any lineage, they build on what came before.
            </p>
          </div>
          
          <Link to="/about" className="inline-flex items-center gap-2 font-montserrat text-xs sm:text-sm tracking-widest uppercase text-crimson hover:text-crimson-bright transition-colors border-b border-crimson/30 hover:border-crimson pb-1">
            <Feather className="w-4 h-4" /> Learn Our Story
          </Link>
          
          <MysticalDivider light />
        </div>
        
        <ElaborateCorner className="absolute bottom-2 left-2 w-12 h-12 sm:w-14 sm:h-14 -rotate-90" variant="crimson" />
        <ElaborateCorner className="absolute bottom-2 right-2 w-12 h-12 sm:w-14 sm:h-14 rotate-180" variant="crimson" />
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-crimson to-transparent" />
      </div>

      {/* ===== DARK WAITLIST SECTION - Moved to bottom ===== */}
      <div className="relative py-14 sm:py-20 px-4 bg-navy-dark">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(184, 35, 48, 0.08) 0%, transparent 60%)' }} />
        
        {/* Elaborate corners */}
        <ElaborateCorner className="absolute top-3 left-3 w-16 h-16 sm:w-24 sm:h-24" variant="gold" />
        <ElaborateCorner className="absolute top-3 right-3 w-16 h-16 sm:w-24 sm:h-24 rotate-90" variant="gold" />
        <ElaborateCorner className="absolute bottom-3 left-3 w-16 h-16 sm:w-24 sm:h-24 -rotate-90" variant="gold" />
        <ElaborateCorner className="absolute bottom-3 right-3 w-16 h-16 sm:w-24 sm:h-24 rotate-180" variant="gold" />
        
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <MysticalDivider variant="moon" />
          
          <h2 className="font-italiana text-xl sm:text-2xl md:text-3xl text-gold-light mb-4"
            style={{ textShadow: '0 2px 25px rgba(212, 168, 75, 0.5)' }}>
            Join the Circle
          </h2>
          <p className="font-crimson text-sm sm:text-base text-cream/70 mb-8 max-w-lg mx-auto">
            Be the first to know when new features, spells, and ancestral wisdom are unveiled.
          </p>
          
          <OrnateWaitlistFrame>
            <WaitlistForm source="homepage" />
          </OrnateWaitlistFrame>
          
          <MysticalDivider />
        </div>
      </div>
    </div>
  );
};

export default Home;
