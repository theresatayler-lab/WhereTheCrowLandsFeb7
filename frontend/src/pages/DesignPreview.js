import React from 'react';
import {
  NOUVEAU_COLORS,
  HaloCorner,
  HaloCornerElaborate,
  LunarDivider,
  LunarPhaseDivider,
  SimpleDivider,
  RavenGlyph,
  RavenGlyphSmall,
  SunDisc,
  MoonDisc,
  CrescentMoon,
  CelestialEye,
  StarGlyph,
} from '../assets/ornaments/artNouveau';

// ============================================================================
// DESIGN PREVIEW PAGE
// Visual-only preview of new Art Nouveau design system
// For approval before site-wide implementation
// ============================================================================

const DesignPreview = () => {
  return (
    <div 
      className="min-h-screen"
      style={{ backgroundColor: NOUVEAU_COLORS.midnightTeal }}
    >
      {/* ================================================================ */}
      {/* SECTION 1: ORNAMENT LIBRARY PREVIEW */}
      {/* ================================================================ */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h1 
            className="text-center text-3xl font-phantasmagoria tracking-wider mb-2"
            style={{ color: NOUVEAU_COLORS.antiqueGold }}
          >
            Art Nouveau Ornament Library
          </h1>
          <p 
            className="text-center text-sm mb-12 opacity-70"
            style={{ color: NOUVEAU_COLORS.vellum }}
          >
            Stroke-based, structural ornaments for approval
          </p>

          {/* Halo Corners */}
          <div 
            className="mb-12 p-8 rounded-sm"
            style={{ 
              backgroundColor: NOUVEAU_COLORS.celestialBlue,
              border: `1px solid ${NOUVEAU_COLORS.antiqueGold}40`
            }}
          >
            <h2 
              className="text-lg font-cinzel tracking-wider mb-6"
              style={{ color: NOUVEAU_COLORS.antiqueGold }}
            >
              Halo Arc Corners
            </h2>
            <div className="flex flex-wrap gap-8 items-center justify-center">
              <div className="text-center">
                <div 
                  className="w-24 h-24 relative mb-2"
                  style={{ backgroundColor: NOUVEAU_COLORS.midnightTeal }}
                >
                  <div className="absolute top-1 left-1">
                    <HaloCorner size={60} position="top-left" />
                  </div>
                </div>
                <span className="text-xs" style={{ color: NOUVEAU_COLORS.vellum }}>Standard</span>
              </div>
              <div className="text-center">
                <div 
                  className="w-28 h-28 relative mb-2"
                  style={{ backgroundColor: NOUVEAU_COLORS.midnightTeal }}
                >
                  <div className="absolute top-1 left-1">
                    <HaloCornerElaborate size={80} position="top-left" />
                  </div>
                </div>
                <span className="text-xs" style={{ color: NOUVEAU_COLORS.vellum }}>Elaborate</span>
              </div>
              <div className="text-center">
                <div 
                  className="w-32 h-32 relative mb-2"
                  style={{ backgroundColor: NOUVEAU_COLORS.midnightTeal }}
                >
                  <HaloCorner size={50} position="top-left" className="absolute top-1 left-1" />
                  <HaloCorner size={50} position="top-right" className="absolute top-1 right-1" />
                  <HaloCorner size={50} position="bottom-left" className="absolute bottom-1 left-1" />
                  <HaloCorner size={50} position="bottom-right" className="absolute bottom-1 right-1" />
                </div>
                <span className="text-xs" style={{ color: NOUVEAU_COLORS.vellum }}>All Four</span>
              </div>
            </div>
          </div>

          {/* Lunar Dividers */}
          <div 
            className="mb-12 p-8 rounded-sm"
            style={{ 
              backgroundColor: NOUVEAU_COLORS.celestialBlue,
              border: `1px solid ${NOUVEAU_COLORS.antiqueGold}40`
            }}
          >
            <h2 
              className="text-lg font-cinzel tracking-wider mb-6"
              style={{ color: NOUVEAU_COLORS.antiqueGold }}
            >
              Lunar Dividers
            </h2>
            <div className="space-y-8">
              <div className="text-center">
                <LunarDivider width={300} />
                <span className="text-xs block mt-2" style={{ color: NOUVEAU_COLORS.vellum }}>Simple Lunar</span>
              </div>
              <div className="text-center">
                <LunarPhaseDivider width={400} />
                <span className="text-xs block mt-2" style={{ color: NOUVEAU_COLORS.vellum }}>Moon Phases</span>
              </div>
              <div className="text-center">
                <SimpleDivider width={200} />
                <span className="text-xs block mt-2" style={{ color: NOUVEAU_COLORS.vellum }}>Minimal</span>
              </div>
            </div>
          </div>

          {/* Glyphs */}
          <div 
            className="mb-12 p-8 rounded-sm"
            style={{ 
              backgroundColor: NOUVEAU_COLORS.celestialBlue,
              border: `1px solid ${NOUVEAU_COLORS.antiqueGold}40`
            }}
          >
            <h2 
              className="text-lg font-cinzel tracking-wider mb-6"
              style={{ color: NOUVEAU_COLORS.antiqueGold }}
            >
              Celestial & Corvid Glyphs
            </h2>
            <div className="flex flex-wrap gap-10 items-end justify-center">
              <div className="text-center">
                <RavenGlyph size={64} />
                <span className="text-xs block mt-2" style={{ color: NOUVEAU_COLORS.vellum }}>Raven</span>
              </div>
              <div className="text-center">
                <RavenGlyphSmall size={32} />
                <span className="text-xs block mt-2" style={{ color: NOUVEAU_COLORS.vellum }}>Raven (sm)</span>
              </div>
              <div className="text-center">
                <SunDisc size={64} />
                <span className="text-xs block mt-2" style={{ color: NOUVEAU_COLORS.vellum }}>Sun Disc</span>
              </div>
              <div className="text-center">
                <MoonDisc size={64} />
                <span className="text-xs block mt-2" style={{ color: NOUVEAU_COLORS.vellum }}>Moon Disc</span>
              </div>
              <div className="text-center">
                <div className="flex gap-2">
                  <CrescentMoon size={32} facing="left" />
                  <CrescentMoon size={32} facing="right" />
                </div>
                <span className="text-xs block mt-2" style={{ color: NOUVEAU_COLORS.vellum }}>Crescents</span>
              </div>
              <div className="text-center">
                <CelestialEye size={64} />
                <span className="text-xs block mt-2" style={{ color: NOUVEAU_COLORS.vellum }}>Eye</span>
              </div>
              <div className="text-center">
                <div className="flex gap-2">
                  <StarGlyph size={28} points={4} />
                  <StarGlyph size={28} points={6} />
                </div>
                <span className="text-xs block mt-2" style={{ color: NOUVEAU_COLORS.vellum }}>Stars</span>
              </div>
            </div>
          </div>

          {/* Color Palette */}
          <div 
            className="mb-12 p-8 rounded-sm"
            style={{ 
              backgroundColor: NOUVEAU_COLORS.celestialBlue,
              border: `1px solid ${NOUVEAU_COLORS.antiqueGold}40`
            }}
          >
            <h2 
              className="text-lg font-cinzel tracking-wider mb-6"
              style={{ color: NOUVEAU_COLORS.antiqueGold }}
            >
              Color Palette
            </h2>
            <div className="flex flex-wrap gap-4 justify-center">
              {Object.entries(NOUVEAU_COLORS).map(([name, hex]) => (
                <div key={name} className="text-center">
                  <div 
                    className="w-16 h-16 rounded-sm mb-2"
                    style={{ 
                      backgroundColor: hex,
                      border: `1px solid ${NOUVEAU_COLORS.antiqueGold}40`
                    }}
                  />
                  <span className="text-xs block" style={{ color: NOUVEAU_COLORS.vellum }}>{name}</span>
                  <span className="text-xs block opacity-60" style={{ color: NOUVEAU_COLORS.vellum }}>{hex}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* SECTION 2: HERO SECTION IMPLEMENTATION */}
      {/* ================================================================ */}
      <section 
        className="relative py-20 px-6 overflow-hidden"
        style={{ 
          backgroundColor: NOUVEAU_COLORS.midnightTeal,
          backgroundImage: `
            radial-gradient(ellipse at 30% 20%, ${NOUVEAU_COLORS.celestialBlue}60 0%, transparent 50%),
            radial-gradient(ellipse at 70% 80%, ${NOUVEAU_COLORS.celestialBlue}40 0%, transparent 40%)
          `
        }}
      >
        {/* Corner ornaments - structural, at edges */}
        <div className="absolute top-4 left-4 opacity-70">
          <HaloCornerElaborate size={100} position="top-left" />
        </div>
        <div className="absolute top-4 right-4 opacity-70">
          <HaloCornerElaborate size={100} position="top-right" />
        </div>
        <div className="absolute bottom-4 left-4 opacity-70">
          <HaloCornerElaborate size={100} position="bottom-left" />
        </div>
        <div className="absolute bottom-4 right-4 opacity-70">
          <HaloCornerElaborate size={100} position="bottom-right" />
        </div>

        {/* Content - always on clear surface */}
        <div className="max-w-3xl mx-auto text-center relative z-10">
          {/* Decorative halo arc above title */}
          <div className="flex justify-center mb-6">
            <svg width="200" height="60" viewBox="0 0 200 60" fill="none">
              <path 
                d="M20 55 Q100 5 180 55" 
                stroke={NOUVEAU_COLORS.antiqueGold} 
                strokeWidth="1.5" 
                fill="none" 
                opacity="0.6"
              />
              <path 
                d="M40 50 Q100 15 160 50" 
                stroke={NOUVEAU_COLORS.antiqueGold} 
                strokeWidth="1" 
                fill="none" 
                opacity="0.4"
              />
              {/* Center star */}
              <circle cx="100" cy="20" r="4" stroke={NOUVEAU_COLORS.antiqueGold} strokeWidth="1" fill="none" opacity="0.7" />
              <circle cx="100" cy="20" r="1.5" fill={NOUVEAU_COLORS.antiqueGold} opacity="0.5" />
            </svg>
          </div>

          {/* Raven icon */}
          <div className="flex justify-center mb-6">
            <RavenGlyph size={72} color={NOUVEAU_COLORS.antiqueGold} opacity={0.9} />
          </div>

          {/* Title - clear, no background interference */}
          <h1 
            className="phantasmagoria-hero text-4xl sm:text-5xl md:text-6xl tracking-wide mb-4"
            style={{ 
              color: NOUVEAU_COLORS.antiqueGold,
              textShadow: `0 2px 20px ${NOUVEAU_COLORS.antiqueGold}30`
            }}
          >
            Where The Crowlands
          </h1>

          {/* Subtitle */}
          <p 
            className="font-crimson text-lg sm:text-xl italic mb-8"
            style={{ color: `${NOUVEAU_COLORS.vellum}cc` }}
          >
            Historical Witchcraft Archive
          </p>

          {/* Divider */}
          <div className="flex justify-center mb-8">
            <LunarDivider width={280} color={NOUVEAU_COLORS.antiqueGold} opacity={0.6} />
          </div>

          {/* CTA Button - Ember Pink */}
          <button
            className="px-8 py-3 font-cinzel text-sm tracking-widest uppercase transition-colors duration-300 hover:brightness-110"
            style={{
              backgroundColor: NOUVEAU_COLORS.emberPink,
              color: NOUVEAU_COLORS.vellum,
              border: `1px solid ${NOUVEAU_COLORS.antiqueGold}60`,
            }}
          >
            Begin Your Journey
          </button>

          {/* Secondary link */}
          <p 
            className="mt-6 text-sm font-montserrat"
            style={{ color: `${NOUVEAU_COLORS.antiqueGold}99` }}
          >
            Explore the Archives →
          </p>
        </div>

        {/* Bottom divider */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <LunarPhaseDivider width={350} color={NOUVEAU_COLORS.antiqueGold} opacity={0.4} />
        </div>
      </section>

      {/* ================================================================ */}
      {/* SECTION 3: CONTENT-HEAVY SECTION (Readability Validation) */}
      {/* ================================================================ */}
      <section 
        className="py-16 px-6"
        style={{ backgroundColor: NOUVEAU_COLORS.midnightTeal }}
      >
        <div className="max-w-2xl mx-auto">
          {/* VELLUM CONTENT CARD */}
          <div 
            className="relative p-8 sm:p-10"
            style={{ 
              backgroundColor: NOUVEAU_COLORS.vellum,
              border: `1px solid ${NOUVEAU_COLORS.antiqueGold}80`,
            }}
          >
            {/* Corner ornaments - structural, at edges only */}
            <div className="absolute top-3 left-3">
              <HaloCorner size={50} position="top-left" color={NOUVEAU_COLORS.mutedBrass} opacity={0.6} />
            </div>
            <div className="absolute top-3 right-3">
              <HaloCorner size={50} position="top-right" color={NOUVEAU_COLORS.mutedBrass} opacity={0.6} />
            </div>
            <div className="absolute bottom-3 left-3">
              <HaloCorner size={50} position="bottom-left" color={NOUVEAU_COLORS.mutedBrass} opacity={0.6} />
            </div>
            <div className="absolute bottom-3 right-3">
              <HaloCorner size={50} position="bottom-right" color={NOUVEAU_COLORS.mutedBrass} opacity={0.6} />
            </div>

            {/* Content - always on vellum, clear of ornaments */}
            <div className="relative z-10 px-4">
              {/* Section label */}
              <p 
                className="text-xs font-cinzel tracking-[0.2em] uppercase mb-2"
                style={{ color: NOUVEAU_COLORS.mutedBrass }}
              >
                Craft Your Intention
              </p>

              {/* Section title */}
              <h2 
                className="text-2xl font-cinzel tracking-wide mb-6"
                style={{ color: NOUVEAU_COLORS.midnightTeal }}
              >
                What is your intention?
              </h2>

              {/* Body text - high contrast, generous spacing */}
              <p 
                className="font-crimson text-base leading-7 mb-6"
                style={{ color: `${NOUVEAU_COLORS.midnightTeal}dd` }}
              >
                Write a few lines about what you're seeking protection from, or clarity about. 
                This is for you. In times of uncertainty, people have always gathered—not just 
                to act, but to steady themselves before acting.
              </p>

              {/* Divider */}
              <div className="flex justify-center my-6">
                <SimpleDivider width={160} color={NOUVEAU_COLORS.roseClay} opacity={0.5} />
              </div>

              {/* Accent box - gold wash background */}
              <div 
                className="p-4 mb-6"
                style={{ 
                  backgroundColor: `${NOUVEAU_COLORS.antiqueGold}15`,
                  borderLeft: `3px solid ${NOUVEAU_COLORS.antiqueGold}`,
                }}
              >
                <p 
                  className="font-crimson text-sm italic"
                  style={{ color: NOUVEAU_COLORS.midnightTeal }}
                >
                  "Inner work does not replace resistance. It steadies those who resist."
                </p>
              </div>

              {/* Form field label */}
              <label 
                className="block text-xs font-cinzel tracking-wider uppercase mb-2"
                style={{ color: NOUVEAU_COLORS.mutedBrass }}
              >
                Your Intention
              </label>

              {/* Textarea */}
              <textarea
                className="w-full p-4 font-crimson text-base leading-relaxed mb-6 focus:outline-none transition-colors"
                rows={3}
                placeholder="In my own words, I seek..."
                style={{
                  backgroundColor: `${NOUVEAU_COLORS.midnightTeal}08`,
                  border: `1px solid ${NOUVEAU_COLORS.mutedBrass}50`,
                  color: NOUVEAU_COLORS.midnightTeal,
                }}
              />

              {/* Chip selection */}
              <label 
                className="block text-xs font-cinzel tracking-wider uppercase mb-3"
                style={{ color: NOUVEAU_COLORS.mutedBrass }}
              >
                Who are you protecting?
              </label>
              <div className="flex flex-wrap gap-2 mb-6">
                {['Myself', 'Family', 'Community', 'The vulnerable'].map((option, i) => (
                  <button
                    key={option}
                    className="px-4 py-2 text-sm font-montserrat transition-colors"
                    style={{
                      backgroundColor: i === 0 ? `${NOUVEAU_COLORS.antiqueGold}20` : 'transparent',
                      border: `1px solid ${i === 0 ? NOUVEAU_COLORS.antiqueGold : NOUVEAU_COLORS.mutedBrass}60`,
                      color: NOUVEAU_COLORS.midnightTeal,
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>

              {/* Primary CTA */}
              <button
                className="w-full py-4 font-cinzel text-sm tracking-widest uppercase transition-colors duration-300 hover:brightness-110"
                style={{
                  backgroundColor: NOUVEAU_COLORS.emberPink,
                  color: NOUVEAU_COLORS.vellum,
                  border: `1px solid ${NOUVEAU_COLORS.antiqueGold}40`,
                }}
              >
                Continue →
              </button>

              {/* Helper text */}
              <p 
                className="text-center text-xs mt-4 font-montserrat"
                style={{ color: `${NOUVEAU_COLORS.midnightTeal}80` }}
              >
                You can generate up to 3 intentions as a guest
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* SECTION 4: DARK CONTENT VARIANT */}
      {/* ================================================================ */}
      <section 
        className="py-16 px-6"
        style={{ 
          backgroundColor: NOUVEAU_COLORS.midnightTeal,
          backgroundImage: `radial-gradient(ellipse at 50% 50%, ${NOUVEAU_COLORS.celestialBlue}40 0%, transparent 60%)`
        }}
      >
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex justify-center mb-4">
            <CrescentMoon size={28} facing="left" />
            <SunDisc size={36} />
            <CrescentMoon size={28} facing="right" />
          </div>
          
          <h2 
            className="text-xl font-cinzel tracking-wide mb-4"
            style={{ color: NOUVEAU_COLORS.antiqueGold }}
          >
            Dark Content Variant
          </h2>
          
          <p 
            className="font-crimson text-base leading-7 mb-6"
            style={{ color: `${NOUVEAU_COLORS.vellum}cc` }}
          >
            Text on dark backgrounds uses the vellum color with appropriate opacity.
            This variant is used for footers, hero sections, and atmospheric content
            that doesn't require form interaction.
          </p>

          <div className="flex justify-center">
            <LunarDivider width={250} opacity={0.5} />
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* APPROVAL FOOTER */}
      {/* ================================================================ */}
      <section 
        className="py-8 px-6 text-center"
        style={{ 
          backgroundColor: NOUVEAU_COLORS.celestialBlue,
          borderTop: `1px solid ${NOUVEAU_COLORS.antiqueGold}30`
        }}
      >
        <p 
          className="text-sm font-montserrat"
          style={{ color: `${NOUVEAU_COLORS.vellum}80` }}
        >
          Design Preview Page — For Approval Before Site-Wide Implementation
        </p>
        <p 
          className="text-xs mt-2 font-montserrat"
          style={{ color: `${NOUVEAU_COLORS.vellum}50` }}
        >
          Route: /design-preview • No functionality affected
        </p>
      </section>
    </div>
  );
};

export default DesignPreview;
