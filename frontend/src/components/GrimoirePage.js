import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Clock, Calendar,
  Copy, Download, CheckCircle2,
  AlertTriangle, ArrowRight, Search, Loader2, Save,
  ExternalLink
} from 'lucide-react';
import { BrandIcon } from './BrandIcon';
import { toast } from 'sonner';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { grimoireAPI, subscriptionAPI, researchAPI } from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { SpellBorderFrame, SectionBorderFrame, TarotCardFrame, PERSONA_BORDER_URLS } from './OrnateElements';
import { SpellBlockRenderer } from './SpellBlockRenderer';
import { BRAND_ASSETS, getSpellWatermarkStyle } from '../assets/brandAssets';
import SpellPageFrame from "./spell/SpellPageFrame";
import ShuffleOracle from "./ShuffleOracle";
import SpellHeader from "./spell/SpellHeader";
import TarotSummaryCard from "./spell/TarotSummaryCard";

// Ornate seal logo for spell pages
const SEAL_LOGO_URL = "/images/brand/logo.png";

// Parliament Crow watermark
const CROW_WATERMARK = BRAND_ASSETS.crowAvatar;

// Icon mapping for materials (maps to BrandIcon names)
const MATERIAL_ICONS = {
  candle: 'candle',
  herb: 'herb',
  crystal: 'crystalBall',
  feather: 'feather',
  water: 'halfmoon',
  fire: 'candle',
  moon: 'moon',
  sun: 'sunMoon',
  book: 'book',
  pen: 'feather',
  mirror: 'mirror',
  salt: 'salt',
  oil: 'herb',
  incense: 'candle',
  bell: 'bell',
  cord: 'thread',
  photo: 'photograph',
  bowl: 'heirloom',
};

// Archetype-specific styling (supporting both legacy and new IDs)
// CONTRAST-LOCKED: All bgAccent now uses solid vellum background for readability
// BRAND-LOCKED: All archetypes use gold/crimson brand palette only
const ARCHETYPE_STYLES = {
  // Shigg - Gold tones (kitchen witch, comfort, tea)
  shigg: {
    borderColor: 'border-gold',
    accentColor: 'text-crimson',
    accentColorLight: 'text-gold',
    bgAccent: 'bg-[#F3EFE8]', // Solid vellum - CONTRAST LOCKED
    decorativeBorder: 'border-gold/30',
    headerGradient: 'from-gold/10 via-gold/5 to-transparent',
    cardGradient: 'from-navy-dark/95 via-navy-mid/90 to-navy-dark/95',
    textMuted: 'text-navy-dark/70',
    textOnVellum: 'text-navy-dark',
  },
  // Cathleen - Crimson tones (Irish, protective, voice magic)
  cathleen: {
    borderColor: 'border-crimson',
    accentColor: 'text-crimson',
    accentColorLight: 'text-crimson-bright',
    bgAccent: 'bg-[#F3EFE8]', // Solid vellum - CONTRAST LOCKED
    decorativeBorder: 'border-crimson/30',
    headerGradient: 'from-crimson/10 via-crimson/5 to-transparent',
    cardGradient: 'from-navy-dark/95 via-navy-mid/90 to-navy-dark/95',
    textMuted: 'text-navy-dark/70',
    textOnVellum: 'text-navy-dark',
  },
  // Katherine - Gold-light tones (ceremonial, Golden Dawn, precise)
  katherine: {
    borderColor: 'border-gold',
    accentColor: 'text-crimson',
    accentColorLight: 'text-gold-light',
    bgAccent: 'bg-[#F3EFE8]', // Solid vellum - CONTRAST LOCKED
    decorativeBorder: 'border-gold/30',
    headerGradient: 'from-gold/10 via-gold/5 to-transparent',
    cardGradient: 'from-navy-dark/95 via-navy-mid/90 to-navy-dark/95',
    textMuted: 'text-navy-dark/70',
    textOnVellum: 'text-navy-dark',
  },
  // Theresa - Crimson-bright tones (investigative, pattern-breaking, seer)
  theresa: {
    borderColor: 'border-crimson-bright',
    accentColor: 'text-crimson',
    accentColorLight: 'text-crimson-bright',
    bgAccent: 'bg-[#F3EFE8]', // Solid vellum - CONTRAST LOCKED
    decorativeBorder: 'border-crimson-bright/30',
    headerGradient: 'from-crimson/10 via-crimson/5 to-transparent',
    cardGradient: 'from-navy-dark/95 via-navy-mid/90 to-navy-dark/95',
    textMuted: 'text-navy-dark/70',
    textOnVellum: 'text-navy-dark',
  },
  // Brenda - Muted gold tones (chronicler, memory keeper, crow communer)
  brenda: {
    borderColor: 'border-gold-dark',
    accentColor: 'text-crimson',
    accentColorLight: 'text-gold',
    bgAccent: 'bg-[#F3EFE8]', // Solid vellum - CONTRAST LOCKED
    decorativeBorder: 'border-gold-dark/30',
    headerGradient: 'from-gold/10 via-gold/5 to-transparent',
    cardGradient: 'from-navy-dark/95 via-navy-mid/90 to-navy-dark/95',
    textMuted: 'text-navy-dark/70',
    textOnVellum: 'text-navy-dark',
  },
  // Legacy IDs (for backwards compatibility)
  shiggy: {
    borderColor: 'border-gold',
    accentColor: 'text-crimson',
    accentColorLight: 'text-gold',
    bgAccent: 'bg-[#F3EFE8]',
    decorativeBorder: 'border-gold/30',
    headerGradient: 'from-gold/10 via-gold/5 to-transparent',
    cardGradient: 'from-navy-dark/95 via-navy-mid/90 to-navy-dark/95',
    textMuted: 'text-navy-dark/70',
    textOnVellum: 'text-navy-dark',
  },
  kathleen: {
    borderColor: 'border-crimson',
    accentColor: 'text-crimson',
    accentColorLight: 'text-crimson-bright',
    bgAccent: 'bg-[#F3EFE8]',
    decorativeBorder: 'border-crimson/30',
    headerGradient: 'from-crimson/10 via-crimson/5 to-transparent',
    cardGradient: 'from-navy-dark/95 via-navy-mid/90 to-navy-dark/95',
    textMuted: 'text-navy-dark/70',
    textOnVellum: 'text-navy-dark',
  },
  catherine: {
    borderColor: 'border-gold',
    accentColor: 'text-crimson',
    accentColorLight: 'text-gold-light',
    bgAccent: 'bg-[#F3EFE8]',
    decorativeBorder: 'border-gold/30',
    headerGradient: 'from-gold/10 via-gold/5 to-transparent',
    cardGradient: 'from-navy-dark/95 via-navy-mid/90 to-navy-dark/95',
    textMuted: 'text-navy-dark/70',
    textOnVellum: 'text-navy-dark',
  },
  neutral: {
    borderColor: 'border-gold/50',
    accentColor: 'text-navy-dark/80',
    accentColorLight: 'text-navy-dark/50',
    bgAccent: 'bg-[#F3EFE8]',
    decorativeBorder: 'border-gold/30',
    headerGradient: 'from-navy-mid/30 to-transparent',
    cardGradient: 'from-navy-dark/90 via-navy-mid/80 to-navy-dark/90',
    textMuted: 'text-navy-dark/70',
    textOnVellum: 'text-navy-dark',
  },
};

// Generated Divider Component - displays STATIC URL or base64 divider images
const GeneratedDivider = ({ imageBase64, isLoading = false, className = '' }) => {
  // Show skeleton while loading
  if (isLoading && !imageBase64) {
    return (
      <div className={`w-full my-6 ${className}`}>
        <div className="w-full h-12 bg-gold/10 rounded animate-pulse flex items-center justify-center">
          <span className="text-navy-dark/80/30 text-xs font-montserrat">Loading ornament...</span>
        </div>
      </div>
    );
  }
  
  if (!imageBase64) return null;
  
  // Handle static URL dividers (prefixed with "STATIC:")
  const isStaticUrl = imageBase64.startsWith('STATIC:');
  const imageSrc = isStaticUrl 
    ? imageBase64.replace('STATIC:', '')
    : `data:image/png;base64,${imageBase64}`;
  
  return (
    <div className={`w-full my-6 ${className}`}>
      <img 
        src={imageSrc}
        alt="Section divider"
        className="w-full h-auto max-h-16 object-contain opacity-70"
        style={isStaticUrl ? { filter: 'sepia(0.3) saturate(0.8)' } : {}}
      />
    </div>
  );
};

// Printables Block - Shows tarot card (front & back) and sigil for printing
const PrintablesBlock = ({ tarotImageBase64, sigilImageBase64, spellTitle, tarotCard, isLoading = false }) => {
  // Show loading state if images are being generated
  if (isLoading && !tarotImageBase64 && !sigilImageBase64) {
    return (
      <section className="my-8 p-6 bg-gold/10 border-2 border-dashed border-gold/40 rounded-sm">
        <h3 className="font-cinzel text-lg text-crimson mb-4 text-center flex items-center justify-center gap-2">
          <Download className="w-5 h-5" />
          Printable Elements
        </h3>
        <p className="font-montserrat text-xs text-navy-dark/70 text-center mb-4">
          Generating your personalized tarot card and sigil...
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="font-montserrat text-xs text-navy-dark/70 mb-2 uppercase tracking-wider">Tarot Card</p>
            <div className="w-full max-w-[180px] mx-auto aspect-[2/3] bg-gold/10 rounded-sm animate-pulse" />
          </div>
          <div className="text-center">
            <p className="font-montserrat text-xs text-navy-dark/70 mb-2 uppercase tracking-wider">Card Back</p>
            <div className="w-full max-w-[180px] mx-auto aspect-[2/3] bg-gold/10 rounded-sm animate-pulse" />
          </div>
          <div className="text-center">
            <p className="font-montserrat text-xs text-navy-dark/70 mb-2 uppercase tracking-wider">Sigil</p>
            <div className="w-full max-w-[150px] mx-auto aspect-square bg-gold/10 rounded-sm animate-pulse" />
          </div>
        </div>
      </section>
    );
  }
  
  if (!tarotImageBase64 && !sigilImageBase64) return null;
  
  return (
    <section className="my-8 p-6 bg-gold/10 border-2 border-dashed border-gold/40 rounded-sm">
      <h3 className="font-cinzel text-lg text-crimson mb-4 text-center flex items-center justify-center gap-2">
        <Download className="w-5 h-5" />
        Printable Elements
      </h3>
      <p className="font-montserrat text-xs text-navy-dark/80 text-center mb-4">
        Right-click to save these images for your physical grimoire
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Tarot Card - Front */}
        {tarotImageBase64 && (
          <div className="text-center">
            <p className="font-montserrat text-xs text-navy-dark/70 mb-2 uppercase tracking-wider">
              Tarot Card (Front)
            </p>
            <img 
              src={`data:image/png;base64,${tarotImageBase64}`}
              alt={`${spellTitle} - Tarot Card Front`}
              className="w-full max-w-[180px] mx-auto rounded-sm border border-gold/30 shadow-md"
            />
          </div>
        )}
        
        {/* Tarot Card - Back (Text version with essence) */}
        {tarotCard && (
          <div className="text-center">
            <p className="font-montserrat text-xs text-navy-dark/70 mb-2 uppercase tracking-wider">
              Tarot Card (Back)
            </p>
            <div className="w-full max-w-[180px] mx-auto aspect-[2/3] rounded-sm border border-gold/30 shadow-md bg-gradient-to-br from-navy-dark via-navy-mid to-navy-dark p-3 flex flex-col justify-between">
              <div className="text-center">
                <img src="/icons/ui/gold/icon-sparkles.png" alt="" className="w-6 h-6 mx-auto opacity-80" />
              </div>
              <div className="text-center flex-1 flex flex-col justify-center">
                <p className="font-cinzel text-xs text-gold-light mb-2">{tarotCard.title || spellTitle}</p>
                {tarotCard.essence && (
                  <p className="font-montserrat text-[10px] text-muted-brass/80 italic leading-tight">
                    &ldquo;{tarotCard.essence}&rdquo;
                  </p>
                )}
              </div>
              <div className="text-center">
                {tarotCard.key_action && (
                  <p className="font-montserrat text-[9px] text-gold/60 uppercase tracking-wider">
                    {tarotCard.key_action}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Sigil */}
        {sigilImageBase64 && (
          <div className="text-center">
            <p className="font-montserrat text-xs text-navy-dark/70 mb-2 uppercase tracking-wider">
              Sigil
            </p>
            <img 
              src={`data:image/png;base64,${sigilImageBase64}`}
              alt={`${spellTitle} - Sigil`}
              className="w-full max-w-[150px] mx-auto rounded-sm border border-gold/30 shadow-md bg-white"
            />
          </div>
        )}
      </div>
    </section>
  );
};

// Section Header with Woodcut Icon
const SectionHeader = ({ icon: Icon, brandIconName, title, iconPath, accentColor }) => (
  <h2 className={`font-cinzel text-xl text-crimson mb-4 flex items-center gap-2`}>
    {iconPath && <img src={iconPath} alt="" className="w-5 h-5 opacity-80" />}
    {brandIconName && !iconPath && <BrandIcon name={brandIconName} size={20} />}
    {Icon && !iconPath && !brandIconName && <Icon className="w-5 h-5" />}
    {title}
  </h2>
);

// Enhanced Tarot Card View with Image and Flip Functionality
const TarotCardView = ({ spell, archetype, style, imageBase64, onViewFull, onCopy, onSave, onNewSpell, isSaving }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const tarot = spell?.tarot_card;
  if (!tarot) return null;
  
  return (
    <SpellBorderFrame persona={archetype?.id || 'site'}>
    <motion.div
      initial={{ opacity: 0, scale: 0.95, rotateY: -10 }}
      animate={{ opacity: 1, scale: 1, rotateY: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="max-w-md mx-auto perspective-1000"
    >
      {/* Main Card with Flip */}
      <div 
        className="relative cursor-pointer"
        style={{ 
          aspectRatio: '2.5/4',
          transformStyle: 'preserve-3d',
        }}
        onClick={() => imageBase64 && setIsFlipped(!isFlipped)}
      >
        <motion.div
          className="relative w-full h-full"
          style={{ transformStyle: 'preserve-3d' }}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        >
          {/* Front - Tarot Card */}
          <div 
            className="absolute inset-0 rounded-xl overflow-hidden"
            style={{ 
              backfaceVisibility: 'hidden',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 40px rgba(139, 90, 43, 0.2)',
            }}
          >
            {/* Gold outer border effect */}
            <div 
              className="absolute inset-0 rounded-xl"
              style={{
                background: 'linear-gradient(135deg, #B8860B 0%, #DAA520 20%, #FFD700 50%, #DAA520 80%, #B8860B 100%)',
                padding: '4px',
              }}
            />
            
            {/* Card inner container */}
            <div className="absolute inset-1 rounded-lg overflow-hidden bg-[#1a1a1a]">
              {/* Background Image */}
              {imageBase64 ? (
                <div className="absolute inset-0">
                  <img 
                    src={`data:image/png;base64,${imageBase64}`}
                    alt={spell.title}
                    className="w-full h-full object-cover"
                  />
                  {/* Gradient overlays for readability */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/80" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>
              ) : (
                /* Art Nouveau Tarot Plate fallback - no image variant */
                <div className="absolute inset-0">
                  {/* Base: Midnight Teal with radial vignette to Celestial Blue */}
                  <div className="absolute inset-0" style={{
                    background: `radial-gradient(ellipse at 50% 30%, #102534 0%, #0C1D2E 70%, #0C1D2E 100%)`
                  }} />
                  
                  {/* Vellum inset panel */}
                  <div className="absolute inset-6 rounded-sm" style={{
                    backgroundColor: '#F3EFE8',
                    boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.15)'
                  }}>
                    {/* Double border - outer */}
                    <div className="absolute inset-0 rounded-sm" style={{
                      border: '2px solid #C8A44D'
                    }} />
                    {/* Double border - inner */}
                    <div className="absolute inset-2 rounded-sm" style={{
                      border: '1px solid rgba(200,164,77,0.5)'
                    }} />
                    
                    {/* Placeholder Sigil Medallion - Moon & Star */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-30">
                        {/* Outer circle */}
                        <circle cx="60" cy="60" r="50" stroke="#C8A44D" strokeWidth="1.5" fill="none" />
                        {/* Inner circle */}
                        <circle cx="60" cy="60" r="40" stroke="#C8A44D" strokeWidth="0.75" fill="none" />
                        {/* Crescent moon */}
                        <path d="M70 35 A25 25 0 1 1 70 85 A20 20 0 1 0 70 35" stroke="#C8A44D" strokeWidth="1.5" fill="none" />
                        {/* Star points */}
                        <path d="M45 60 L50 55 L55 60 L50 65 Z" stroke="#C8A44D" strokeWidth="1" fill="none" />
                        <path d="M50 50 L52 55 L48 55 Z" stroke="#C8A44D" strokeWidth="0.75" fill="none" />
                        <path d="M42 55 L47 57 L47 53 Z" stroke="#C8A44D" strokeWidth="0.75" fill="none" />
                        {/* Corner flourishes */}
                        <path d="M20 20 Q30 25 25 35" stroke="#C8A44D" strokeWidth="0.75" fill="none" />
                        <path d="M100 20 Q90 25 95 35" stroke="#C8A44D" strokeWidth="0.75" fill="none" />
                        <path d="M20 100 Q30 95 25 85" stroke="#C8A44D" strokeWidth="0.75" fill="none" />
                        <path d="M100 100 Q90 95 95 85" stroke="#C8A44D" strokeWidth="0.75" fill="none" />
                      </svg>
                    </div>
                  </div>
                  
                  {/* Top gradient for title readability */}
                  <div className="absolute inset-x-0 top-0 h-24" style={{
                    background: 'linear-gradient(to bottom, rgba(14,42,47,0.95) 0%, transparent 100%)'
                  }} />
                  {/* Bottom gradient for text readability */}
                  <div className="absolute inset-x-0 bottom-0 h-32" style={{
                    background: 'linear-gradient(to top, rgba(14,42,47,0.95) 0%, transparent 100%)'
                  }} />
                </div>
              )}
              
              {/* Decorative inner borders */}
              <div className="absolute inset-3 border border-gold/30 rounded-md pointer-events-none" />
              <div className="absolute inset-5 border border-gold/20 rounded-sm pointer-events-none" />
              
              {/* Corner ornaments */}
              <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-gold/50" />
              <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-gold/50" />
              <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-gold/50" />
              <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-gold/50" />
              
              {/* Card Content */}
              <div className="relative h-full flex flex-col p-6 text-white">
                {/* Top Section - Symbol & Title */}
                <div className="text-center mb-2">
                  <img src="/icons/ui/cream/icon-sparkles.png" alt="" className="w-10 h-10 mx-auto drop-shadow-lg" />
                </div>
                
                <h2 
                  className="ritual-title text-2xl md:text-3xl text-cream text-center mb-1"
                  style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.8)' }}
                >
                  {tarot.title || spell.title}
                </h2>
                
                {/* Archetype Attribution */}
                {archetype && (
                  <p className="font-montserrat text-xs text-gold/80 text-center mb-3 tracking-[0.2em] uppercase">
                    {archetype.name}
                  </p>
                )}
                
                {/* Decorative divider */}
                <div className="flex items-center justify-center gap-2 mb-3">
                  <div className="h-px bg-gradient-to-r from-transparent to-gold/50 flex-1" />
                  <BrandIcon name="moon" size={16} opacity={0.6} />
                  <div className="h-px bg-gradient-to-l from-transparent to-gold/50 flex-1" />
                </div>
                
                {/* Middle Section - Essence & Key Action */}
                <div className="flex-1 flex flex-col justify-center space-y-3">
                  {/* Essence */}
                  <p 
                    className="font-crimson text-base text-cream/90 text-center leading-relaxed"
                    style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.7)' }}
                  >
                    {tarot.essence}
                  </p>
                  
                  {/* Key Action Box */}
                  <div className="bg-black/40 backdrop-blur-sm border border-gold/30 rounded-sm p-3">
                    <p className="font-montserrat text-xs text-gold/70 uppercase tracking-wider mb-1 text-center">
                      Key Action
                    </p>
                    <p className="font-crimson text-sm text-cream/80 text-center">
                      {tarot.key_action}
                    </p>
                  </div>
                  
                  {/* Incantation */}
                  <div className="py-3 border-y border-gold/30">
                    <p 
                      className="font-crimson text-lg text-gold italic text-center"
                      style={{ textShadow: '1px 1px 6px rgba(0,0,0,0.8)' }}
                    >
                      &ldquo;{tarot.incantation}&rdquo;
                    </p>
                  </div>
                </div>
                
                {/* Bottom Section - Timing & Flip Hint */}
                <div className="mt-3 space-y-2">
                  {tarot.timing && (
                    <div className="flex items-center justify-center gap-2 text-xs text-gold/70">
                      <Clock className="w-3 h-3" />
                      <span className="font-montserrat tracking-wider">{tarot.timing}</span>
                    </div>
                  )}
                  
                  {tarot.warning && (
                    <p className="font-montserrat text-xs text-red-400/80 text-center italic">
                      ⚠ {tarot.warning}
                    </p>
                  )}
                  
                  {/* Cathleen's Ward Preview */}
                  {spell.suggested_ward && (
                    <div className="bg-navy-mid/60 backdrop-blur-sm border border-gold/40 rounded-sm p-2 mt-2">
                      <div className="flex items-center justify-center gap-2">
                        <img src="/icons/anchors/gold/anchor-feather.png" alt="" className="w-5 h-5" />
                        <div className="text-center">
                          <p className="font-montserrat text-[10px] text-cream/50 uppercase tracking-wider">Your Ward</p>
                          <p className="font-crimson text-sm text-cream/80">{spell.suggested_ward.name}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Flip hint - only show if there's an image */}
                  {imageBase64 && (
                    <div className="text-center pt-1">
                      <p className="font-montserrat text-[10px] text-gold/60 animate-pulse">
                        Click card to see full artwork
                      </p>
                    </div>
                  )}
                  
                  {/* Bottom symbol */}
                  <div className="text-center pt-1">
                    <img src="/icons/ui/gold/icon-sparkles.png" alt="" className="w-6 h-6 mx-auto opacity-40" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Back - Full Image */}
          <div 
            className="absolute inset-0 rounded-xl overflow-hidden"
            style={{ 
              backfaceVisibility: 'hidden', 
              transform: 'rotateY(180deg)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 40px rgba(139, 90, 43, 0.2)',
            }}
          >
            {/* Gold border */}
            <div 
              className="absolute inset-0 rounded-xl"
              style={{
                background: 'linear-gradient(135deg, #B8860B 0%, #DAA520 20%, #FFD700 50%, #DAA520 80%, #B8860B 100%)',
                padding: '4px',
              }}
            />
            
            <div className="absolute inset-1 rounded-lg overflow-hidden bg-[#1a1a1a]">
              {imageBase64 && (
                <img 
                  src={`data:image/png;base64,${imageBase64}`}
                  alt={spell.title}
                  className="w-full h-full object-contain bg-[#0a0a0a]"
                />
              )}
              
              {/* Flip back hint */}
              <div className="absolute bottom-4 left-0 right-0 text-center">
                <p className="font-montserrat text-xs text-gold/80 bg-black/60 inline-block px-3 py-1 rounded-full backdrop-blur-sm">
                  Click to flip back
                </p>
              </div>
              
              {/* Title overlay at top */}
              <div className="absolute top-4 left-0 right-0 text-center">
                <p className="font-italiana text-lg text-gold bg-black/60 inline-block px-4 py-1 rounded-full backdrop-blur-sm">
                  {spell.title}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Action Buttons Below Card */}
      <div className="mt-6 space-y-4">
        {/* View Full Ritual Button */}
        <button
          onClick={onViewFull}
          className="w-full px-6 py-3 bg-crimson text-cream rounded-sm font-montserrat tracking-widest uppercase text-sm hover:bg-crimson-bright transition-all flex items-center justify-center gap-2 shadow-lg"
          style={{ boxShadow: '0 4px 15px rgba(139, 90, 43, 0.4)' }}
        >
          <img src="/icons/ui/cream/icon-grimoire.png" alt="" className="w-5 h-5" />
          View Full Ritual
        </button>
        
        {/* Quick Actions */}
        <div className="flex justify-center gap-3">
          <button
            onClick={onCopy}
            className="p-3 bg-card/80 border border-primary/30 rounded-sm hover:bg-primary/10 transition-all shadow-md"
            title="Copy to clipboard"
          >
            <img src="/icons/ui/gold/icon-copy.png" alt="Copy" className="w-5 h-5" />
          </button>
          <button
            onClick={onSave}
            disabled={isSaving}
            className="p-3 bg-accent rounded-sm hover:bg-accent/90 transition-all disabled:opacity-50 shadow-md"
            title="Save to Grimoire"
          >
            <img src="/icons/ui/gold/icon-save-book.png" alt="Save" className={`w-5 h-5 ${isSaving ? 'animate-pulse' : ''}`} />
          </button>
          <button
            onClick={onNewSpell}
            className="p-3 bg-card/80 border border-primary/30 rounded-sm hover:bg-primary/10 transition-all shadow-md"
            title="New Spell"
          >
            <img src="/icons/ui/gold/icon-sparkles.png" alt="New Spell" className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
    </SpellBorderFrame>
  );
};

// Save Ward Button Component
const SaveWardButton = ({ ward, spellTitle }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const navigate = useNavigate();
  
  const handleSaveWard = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please log in to save wards to your grimoire');
      navigate('/auth');
      return;
    }
    
    setIsSaving(true);
    try {
      const API_URL = process.env.REACT_APP_BACKEND_URL;
      const response = await fetch(`${API_URL}/api/grimoire/save-ward`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: ward.name,
          symbol: ward.symbol || 'feather',
          meaning: ward.meaning,
          how_to_find: ward.how_to_find,
          activation: ward.activation,
          source_spell: spellTitle,
          guide: 'cathleen'
        })
      });
      
      if (response.ok) {
        setIsSaved(true);
        toast.success(`${ward.name} saved to your grimoire!`);
      } else {
        const data = await response.json();
        if (data.feature === 'save_ward') {
          toast.error('Upgrade to Pro to save wards to your grimoire!', {
            action: {
              label: 'Upgrade',
              onClick: () => navigate('/profile')
            }
          });
        } else {
          throw new Error('Failed to save ward');
        }
      }
    } catch (error) {
      console.error('Error saving ward:', error);
      toast.error('Failed to save ward. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isSaved) {
    return (
      <div className="flex items-center gap-1 text-crimson">
        <CheckCircle2 className="w-4 h-4" />
        <span className="font-montserrat text-xs">Saved</span>
      </div>
    );
  }
  
  return (
    <button
      onClick={handleSaveWard}
      disabled={isSaving}
      className="flex items-center gap-1 px-3 py-1.5 bg-gold/10 hover:bg-gold/20 border border-gold/30 rounded-sm transition-all disabled:opacity-50"
      title="Save ward to your grimoire"
      data-testid="save-ward-btn"
    >
      {isSaving ? (
        <Loader2 className="w-4 h-4 animate-spin text-crimson" />
      ) : (
        <Save className="w-4 h-4 text-crimson" />
      )}
      <span className="font-montserrat text-xs text-crimson">Save Ward</span>
    </button>
  );
};

export const GrimoirePage = ({ spell, archetype, imageBase64, assetPlan, onNewSpell, isLoadingImages = false }) => {
  // showHistoricalContext state removed - sections now always visible
  const [checklistMode, setChecklistMode] = useState(false);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [subscriptionTier, setSubscriptionTier] = useState('free'); // Default to free
  const [viewMode, setViewMode] = useState('card'); // 'card' or 'full' - start with card view
  // Research & Origins state
  const [isLoadingResearch, setIsLoadingResearch] = useState(false);
  const [researchData, setResearchData] = useState(null);
  const grimoireRef = useRef(null);
  const navigate = useNavigate();
  
  // Normalize archetype ID for styling
  const normalizeId = (id) => {
    const map = { 'shiggy': 'shigg', 'kathleen': 'cathleen', 'catherine': 'katherine' };
    return map[id] || id;
  };
  // For blocks-based spells (V3), prefer the guide_id from the spell itself
  const effectiveGuideId = spell?.guide_id || archetype?.id;
  const normalizedArchetypeId = normalizeId(effectiveGuideId);
  const style = ARCHETYPE_STYLES[normalizedArchetypeId] || ARCHETYPE_STYLES[archetype?.id] || ARCHETYPE_STYLES.neutral;
  
  // Get generated assets from asset plan
  const generatedAssets = assetPlan?.generated_assets || {};
  const microIcons = assetPlan?.micro_icons || [];
  
  // Helper to get woodcut icon path for a section (replaces emoji micro-icons)
  const getSectionIconPath = (sectionName) => {
    const sectionIconMap = {
      'materials': '/icons/anchors/gold/anchor-herb.png',
      'preparation': '/icons/anchors/gold/anchor-candle.png',
      'the_working': '/icons/ui/gold/icon-grimoire.png',
      'spoken_words': '/icons/anchors/gold/anchor-poetry.png',
      'closing': '/icons/anchors/gold/anchor-feather.png',
      'aftercare': '/icons/anchors/gold/anchor-tea.png'
    };
    return sectionIconMap[sectionName] || null;
  };
  
  // Check subscription status
  React.useEffect(() => {
    const checkSubscription = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      // First try to get from stored user data
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          if (userData.subscription_tier) {
            setSubscriptionTier(userData.subscription_tier);
            console.log('Subscription tier from localStorage:', userData.subscription_tier);
          }
        } catch (e) {
          console.error('Failed to parse user data:', e);
        }
      }
      
      // Then fetch latest from API to ensure it's current
      if (token) {
        try {
          const status = await subscriptionAPI.getStatus();
          setSubscriptionTier(status.subscription_tier);
          console.log('Subscription tier from API:', status.subscription_tier);
        } catch (error) {
          console.error('Failed to check subscription:', error);
          // Keep the tier from localStorage if API fails
          if (!storedUser) {
            setSubscriptionTier('free');
          }
        }
      } else {
        setSubscriptionTier('free'); // Anonymous users are treated as free
      }
    };
    checkSubscription();
  }, []);
  
  const toggleStep = (stepNumber) => {
    const newCompleted = new Set(completedSteps);
    if (newCompleted.has(stepNumber)) {
      newCompleted.delete(stepNumber);
    } else {
      newCompleted.add(stepNumber);
    }
    setCompletedSteps(newCompleted);
  };

  const copySpellToClipboard = () => {
    const text = `${spell.title}\n\n${spell.introduction}\n\nMaterials:\n${spell.materials?.map(m => `- ${m.name}`).join('\n')}\n\nSteps:\n${spell.steps?.map(s => `${s.number}. ${s.title}: ${s.instruction}`).join('\n')}\n\nSpoken Words:\n${spell.spoken_words?.invocation}\n${spell.spoken_words?.main_incantation}\n${spell.spoken_words?.closing}`;
    navigator.clipboard.writeText(text);
    toast.success('Spell copied to clipboard!');
  };

  const downloadAsPdf = async () => {
    if (!grimoireRef.current) {
      console.error('GrimoireRef is null');
      toast.error('Unable to generate PDF - page reference missing');
      return;
    }
    
    setIsGeneratingPdf(true);
    
    try {
      console.log('Attempting PDF generation with jsPDF + html2canvas...');
      const element = grimoireRef.current;
      
      // Wait a brief moment for any images to load
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Create canvas from the element
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#D8CBB3',
        logging: false,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight
      });
      
      // Calculate PDF dimensions
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Create PDF
      const pdf = new jsPDF({
        orientation: imgHeight > imgWidth ? 'portrait' : 'landscape',
        unit: 'mm',
        format: 'a4'
      });
      
      let heightLeft = imgHeight;
      let position = 0;
      
      // Add first page
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      // Add remaining pages if content is longer than one page
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      const filename = `${spell.title?.replace(/[^a-z0-9]/gi, '_') || 'spell'}_grimoire.pdf`;
      pdf.save(filename);
      
      toast.success('PDF downloaded to your Downloads folder!');
    } catch (error) {
      console.error('PDF generation error:', error);
      
      // Fallback: Open print dialog
      toast.info('Opening print dialog - use "Save as PDF" option');
      window.print();
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const saveToGrimoire = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please log in to save spells to your grimoire');
      return;
    }

    setIsSaving(true);
    
    try {
      await grimoireAPI.saveSpell(
        spell,
        archetype?.id,
        archetype?.name,
        archetype?.title,
        imageBase64,
        assetPlan  // Include tarot, sigil, dividers, micro_icons
      );
      toast.success('Spell saved to your grimoire!');
    } catch (error) {
      console.error('Save spell error:', error);
      if (error.response?.status === 401) {
        toast.error('Please log in to save spells');
      } else if (error.response?.status === 403 && error.response?.data?.detail?.error === 'feature_locked') {
        toast.error(error.response.data.detail.message, { duration: 6000 });
        setTimeout(() => navigate('/upgrade'), 2000);
      } else {
        toast.error('Failed to save spell. Please try again.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Fetch research & origins from dual-model API
  const fetchResearchOrigins = async () => {
    if (researchData) return; // Already loaded

    setIsLoadingResearch(true);

    try {
      const spellContext = `Spell: "${spell.title}". Intention: ${spell.introduction || spell.scenario || 'self-improvement'}`;
      // Normalize archetype ID for research API (backend uses shigg, not shiggy)
      const rawId = archetype?.id || spell?.guide_id || 'shigg';
      const idMap = { 'shiggy': 'shigg', 'kathleen': 'cathleen', 'catherine': 'katherine' };
      const personaId = idMap[rawId] || rawId;

      const result = await researchAPI.combined(
        spell.title || 'magical practice',
        personaId,
        'gentle',
        spellContext
      );

      setResearchData(result);
    } catch (error) {
      console.error('Research fetch error:', error);
      toast.error('Unable to fetch research data');
    } finally {
      setIsLoadingResearch(false);
    }
  };


  if (spell.parse_error) {
    return (
      <div className="bg-card/50 border border-border rounded-sm p-6">
        <h3 className="font-cinzel text-xl text-secondary mb-4">Your Spell</h3>
        <div className="font-montserrat text-sm text-foreground whitespace-pre-wrap">
          {spell.raw_response}
        </div>
      </div>
    );
  }

  // If viewing tarot card mode and we have tarot data
  if (viewMode === 'card' && spell.tarot_card) {
    return (
      <TarotCardView 
        spell={spell}
        archetype={archetype}
        style={style}
        imageBase64={imageBase64}
        onViewFull={() => setViewMode('full')}
        onCopy={copySpellToClipboard}
        onSave={saveToGrimoire}
        onNewSpell={onNewSpell}
        isSaving={isSaving}
      />
    );
  }

  return (
    <SpellPageFrame>
      <SpellBorderFrame persona={archetype?.id || 'site'}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          ref={grimoireRef}
          className="bg-card/80 rounded-sm overflow-hidden shadow-xl"
          style={{ 
            backgroundColor: '#D8CBB3',
            backgroundImage: "url('/images/textures/parchment-texture.png')",
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        >
        <SpellHeader
          title={spell?.tarot_card?.title || spell?.title || "Saved Spell"}
          guideLine={`${spell?.archetype_name || ""}${spell?.archetype_title ? " • " + spell.archetype_title : ""}`}
          summaryLine={spell?.tarot_card?.essence || ""}
        />

        <TarotSummaryCard
          tarotImageUrl={spell?.asset_plan?.generated_assets?.tarot_card_image || spell?.tarot_card_image || null}
          title={spell?.tarot_card?.title || ""}
          essence={spell?.tarot_card?.essence || ""}
          keyAction={spell?.tarot_card?.key_action || ""}
          timing={spell?.tarot_card?.timing || ""}
          guideBadge={spell?.archetype_name || ""}
        />

        {/* View Toggle - Show only if tarot_card exists */}
        {spell.tarot_card && (
        <div className="flex justify-center gap-2 p-4 bg-gold/15 border-b border-gold/30">
          <button
            onClick={() => setViewMode('card')}
            className={`px-4 py-2 rounded-sm font-montserrat tracking-wider text-xs transition-all ${
              viewMode === 'card' 
                ? 'bg-crimson text-cream' 
                : 'bg-transparent text-navy-dark/80 hover:text-crimson'
            }`}
          >
            <img src="/icons/ui/gold/icon-sparkles.png" alt="" className="w-3 h-3 inline-block mr-1 opacity-70" /> Card View
          </button>
          <button
            onClick={() => setViewMode('full')}
            className={`px-4 py-2 rounded-sm font-montserrat tracking-wider text-xs transition-all ${
              viewMode === 'full' 
                ? 'bg-crimson text-cream' 
                : 'bg-transparent text-navy-dark/80 hover:text-crimson'
            }`}
          >
            Full Grimoire
          </button>
        </div>
      )}

      {/* Header Image - show skeleton while loading */}
      {imageBase64 ? (
        <div className="relative h-48 md:h-64 overflow-hidden">
          <img 
            src={`data:image/png;base64,${imageBase64}`}
            alt={spell.title}
            className="w-full h-full object-cover"
          />
          <div className={`absolute inset-0 bg-gradient-to-t ${style.headerGradient}`} />
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-card to-transparent">
            <h1 className="ritual-title text-3xl md:text-4xl text-primary drop-shadow-lg">
              {spell.title || 'Untitled Spell'}
            </h1>
            {spell.subtitle && spell.subtitle !== 'null' && (
              <p className="font-montserrat text-sm text-cream/90 mt-1">{spell.subtitle}</p>
            )}
          </div>
        </div>
      ) : isLoadingImages ? (
        <div className="relative h-48 md:h-64 overflow-hidden bg-gradient-to-br from-gold/20 to-gold/10 animate-pulse">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <BrandIcon name="sparkles" size={32} opacity={0.4} className="mx-auto mb-2" />
              <span className="text-navy-dark/80/50 text-sm font-montserrat">Generating header image...</span>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#D8CBB3] to-transparent">
            <h1 className="ritual-title text-3xl md:text-4xl text-crimson">
              {spell.title || 'Untitled Spell'}
            </h1>
            {spell.subtitle && spell.subtitle !== 'null' && (
              <p className="font-montserrat text-sm text-navy-dark/80 mt-1">{spell.subtitle}</p>
            )}
          </div>
        </div>
      ) : (
        <div className={`p-6 ${style.bgAccent} border-b border-gold/30`}>
          <h1 className="ritual-title text-3xl md:text-4xl text-crimson">{spell.title || 'Untitled Spell'}</h1>
          {spell.subtitle && spell.subtitle !== 'null' && (
            <p className="font-montserrat text-sm text-navy-dark/80 mt-1">{spell.subtitle}</p>
          )}
        </div>
      )}

      <div className="p-6 md:p-8 space-y-8">
        {/* Archetype Attribution */}
        {archetype && (
          <div className="flex items-center gap-3 pb-4 border-b border-gold/30">
            <img 
              src={`/icons/anchors/anchor-${archetype.id === 'shiggy' ? 'bird' : archetype.id === 'kathleen' ? 'feather' : archetype.id === 'catherine' ? 'thread' : archetype.id === 'theresa' ? 'magnifying-glass' : 'crow-feather'}.png`}
              alt={archetype.name}
              className="w-8 h-8"
            />
            <div>
              <p className="font-cinzel text-sm text-crimson">Crafted by {archetype.name}</p>
              <p className="font-montserrat text-xs text-navy-dark/70">{archetype.title}</p>
            </div>
          </div>
        )}

        {/* Introduction - CONTRAST LOCKED: Solid vellum plate */}
        {spell.introduction && (
          <div className="p-4 bg-[#F3EFE8] border-l-4 border-gold rounded-r-sm shadow-sm">
            <p className="font-crimson text-base md:text-lg text-navy-dark italic leading-relaxed">
              {spell.introduction}
            </p>
          </div>
        )}

        {/* BLOCKS-BASED SPELL RENDERING (V3) */}
        {spell.blocks && spell.blocks.length > 0 ? (
          <div className="blocks-spell-container">
            {/* Bibliomancy shuffle blocks get the ShuffleOracle component */}
            {spell.blocks.some(b => b.block_type === 'bibliomancy_shuffle') ? (
              <div className="space-y-6">
                {spell.blocks.map((block, idx) => (
                  block.block_type === 'bibliomancy_shuffle' ? (
                    <ShuffleOracle key={idx} block={block} />
                  ) : (
                    <SpellBlockRenderer
                      key={idx}
                      spell={{...spell, blocks: [block]}}
                      archetypeStyle={{
                        borderColor: style.borderColor,
                        accentColor: style.accentColor,
                        bgAccent: style.bgAccent,
                        textMuted: style.textMuted
                      }}
                      onLogUpdate={(log) => console.log('Spell log updated:', log)}
                      initialLog={{}}
                    />
                  )
                ))}
              </div>
            ) : (
            <SpellBlockRenderer
              spell={spell}
              archetypeStyle={{
                borderColor: style.borderColor,
                accentColor: style.accentColor,
                bgAccent: style.bgAccent,
                textMuted: style.textMuted
              }}
              onLogUpdate={(log) => console.log('Spell log updated:', log)}
              initialLog={{}}
            />
            )}

            {/* V3 Sources - Always visible for blocks-based spells */}
            {spell.sources && spell.sources.length > 0 && (
              <div className="mt-8 border border-gold/30 rounded-sm overflow-hidden">
                <div className="p-4 bg-gold/10">
                  <h3 className="font-cinzel text-base text-crimson flex items-center gap-2 mb-4">
                    <BrandIcon name="grimoire" size={20} />
                    Research Sources
                  </h3>
                  <div className="space-y-3">
                    {spell.sources.map((source, idx) => (
                      <div key={idx} className="p-3 bg-[#F3EFE8] border border-gold/30 rounded-sm">
                        <p className="font-montserrat text-sm text-navy-dark">
                          <strong>{source.author}</strong>
                          {source.work && <>, <em>{source.work}</em></>}
                        </p>
                        {source.relevance && (
                          <p className="font-montserrat text-xs text-navy-dark/70 mt-1">{source.relevance}</p>
                        )}
                        {source.learn_more_url && (
                          <a
                            href={source.learn_more_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 mt-1 text-xs font-montserrat text-navy-dark/80 hover:text-crimson"
                          >
                            Learn more <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Ethics Statement */}
            {spell.ethics_statement && (
              <div className="mt-4 p-3 bg-gold/5 border border-gold/20 rounded-sm">
                <p className="font-montserrat text-xs text-navy-dark/70 italic text-center">{spell.ethics_statement}</p>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* LEGACY FLAT SPELL RENDERING (V2 and earlier) */}
            
            {/* Timing */}
            {spell.timing && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <TimingCard brandIconName="moon" label="Moon Phase" value={spell.timing?.moon_phase} />
                <TimingCard brandIconName="sunMoon" label="Time" value={spell.timing?.time_of_day} />
                <TimingCard icon={Calendar} label="Day" value={spell.timing?.day} />
                <TimingCard icon={Clock} label="Note" value={spell.timing?.note} small />
              </div>
            )}

            {/* Cathleen's Suggested Ward - CONTRAST LOCKED: Solid vellum plate */}
        {spell.suggested_ward && (
          <section className="relative">
            <div className="relative p-6 border-2 border-crimson/40 rounded-lg bg-[#F3EFE8] shadow-sm">
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gold/10 border border-gold/30 rounded-full">
                    <img src="/icons/anchors/gold/anchor-feather.png" alt="" className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="font-cinzel text-xs text-crimson uppercase tracking-wider">Cathleen&apos;s Gift</p>
                    <h3 className="font-cinzel text-xl text-navy-dark">Your Ward: {spell.suggested_ward.name}</h3>
                  </div>
                </div>
                
                {/* Save Ward Button */}
                <SaveWardButton 
                  ward={spell.suggested_ward}
                  spellTitle={spell.title}
                />
              </div>
              
              <div className="space-y-4 font-montserrat text-sm">
                <div className="flex items-start gap-2">
                  <BrandIcon name="sacredheart" size={16} className="mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-crimson uppercase tracking-wide mb-1">What It Means</p>
                    <p className="text-navy-dark">{spell.suggested_ward.meaning}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <BrandIcon name="eye" size={16} className="mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-navy-dark/70 uppercase tracking-wide mb-1">How to Find It</p>
                    <p className="text-navy-dark">{spell.suggested_ward.how_to_find}</p>
                  </div>
                </div>
                
                {spell.suggested_ward.activation && (
                  <div className="flex items-start gap-2">
                    <BrandIcon name="sparkles" size={16} className="mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-navy-dark/70 uppercase tracking-wide mb-1">Awakening Your Ward</p>
                      <p className="text-navy-dark">{spell.suggested_ward.activation}</p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-4 pt-4 border-t border-gold/30">
                <p className="font-montserrat text-xs text-navy-dark/70 italic text-center">
                  &ldquo;Carry your ward close—a physical anchor for invisible magic.&rdquo; — Cathleen
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Cathleen's Concealment Suggestion - CONTRAST LOCKED: Solid vellum plate */}
        {spell.concealment_suggestion && (
          <section className="relative">
            <div className="relative p-6 border-2 border-crimson/40 rounded-lg bg-[#F3EFE8] shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-gold/10 border border-gold/30 rounded-full">
                  <BrandIcon name="key" size={24} />
                </div>
                <div>
                  <p className="font-cinzel text-xs text-crimson uppercase tracking-wider">Cathleen&apos;s Secret</p>
                  <h3 className="font-cinzel text-xl text-navy-dark">{spell.concealment_suggestion.title || 'Keep Your Secrets Close'}</h3>
                </div>
              </div>
              
              <div className="space-y-4 font-montserrat text-sm">
                {/* Historical Inspiration */}
                {spell.concealment_suggestion.historical_inspiration && (
                  <div className="flex items-start gap-2">
                    <BrandIcon name="skull" size={16} className="mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-crimson uppercase tracking-wide mb-1">From the Secret History</p>
                      <p className="text-navy-dark italic">{spell.concealment_suggestion.historical_inspiration}</p>
                    </div>
                  </div>
                )}
                
                {/* Your Adaptation */}
                {spell.concealment_suggestion.your_adaptation && (
                  <div className="flex items-start gap-2">
                    <BrandIcon name="key" size={16} className="mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-crimson uppercase tracking-wide mb-1">Your Hidden Place</p>
                      <p className="text-navy-dark">{spell.concealment_suggestion.your_adaptation}</p>
                    </div>
                  </div>
                )}
                
                {/* Suggested Items */}
                {spell.concealment_suggestion.suggested_items && spell.concealment_suggestion.suggested_items.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {spell.concealment_suggestion.suggested_items.map((item, idx) => (
                      <span key={idx} className="px-3 py-1 bg-gold/10 border border-gold/30 text-navy-dark rounded-full text-xs">
                        {item}
                      </span>
                    ))}
                  </div>
                )}
                
                {/* Cathleen's Note */}
                {spell.concealment_suggestion.cathleen_note && (
                  <div className="mt-4 pt-4 border-t border-gold/30">
                    <p className="text-navy-dark/80 italic text-center text-xs">
                      &ldquo;{spell.concealment_suggestion.cathleen_note}&rdquo;
                    </p>
                    <p className="text-crimson text-xs text-center mt-1">— Cathleen</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Materials */}
        {spell.materials && spell.materials.length > 0 && (
          <section>
            <SectionHeader 
              brandIconName="sparkles" 
              title="Materials Needed" 
              iconPath={getSectionIconPath('materials')}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {spell.materials.map((material, idx) => {
                const materialBrandIcon = MATERIAL_ICONS[material.icon] || 'sparkles';
                return (
                  <div 
                    key={idx}
                    className="flex items-start gap-3 p-3 bg-[#F3EFE8] border border-gold/30 rounded-sm shadow-sm"
                  >
                    <div className="p-2 bg-gold/10 border border-gold/30 rounded-sm">
                      {material.icon ? (
                        <span className="text-lg">{material.icon}</span>
                      ) : (
                        <BrandIcon name={materialBrandIcon} size={20} />
                      )}
                    </div>
                    <div>
                      <p className="font-montserrat text-sm font-medium text-navy-dark">{material.name}</p>
                      {material.note && (
                        <p className="font-montserrat text-xs text-navy-dark/70 mt-0.5">{material.note}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Divider after materials */}
        <GeneratedDivider imageBase64={generatedAssets?.divider_1} isLoading={isLoadingImages} />

        {/* Ritual Steps / The Working */}
        {(spell.steps && spell.steps.length > 0) || spell.the_working ? (
          <section>
            <div className="flex items-center justify-between mb-4">
              <SectionHeader 
                brandIconName="grimoire" 
                title="The Working" 
                iconPath={getSectionIconPath('the_working')}
              />
              <button
                onClick={() => setChecklistMode(!checklistMode)}
                className={`px-3 py-1 rounded-sm text-xs font-montserrat tracking-wider transition-all ${
                  checklistMode 
                    ? 'bg-crimson text-cream' 
                    : 'bg-gold/20 text-navy-dark/80 hover:bg-gold/30'
                }`}
              >
                {checklistMode ? 'Checklist On' : 'Track Progress'}
              </button>
            </div>
            
            {/* Working description */}
            {spell.the_working?.description && (
              <p className="font-montserrat text-sm text-navy-dark mb-4">{spell.the_working.description}</p>
            )}
            
            <div className="space-y-4">
              {/* Support both old 'steps' format and new 'the_working.steps' format */}
              {(spell.the_working?.steps || spell.steps || []).map((step, idx) => {
                const stepNum = step.step || step.number || idx + 1;
                const stepsArray = spell.the_working?.steps || spell.steps || [];
                return (
                  <motion.div 
                    key={stepNum}
                    className={`relative pl-12 pb-4 ${stepNum < stepsArray.length ? 'border-l-2 border-gold/30 ml-4' : 'ml-4'}`}
                  >
                    {/* Step number circle */}
                    <div 
                      className={`absolute left-0 -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center text-sm font-cinzel cursor-pointer transition-all ${
                        completedSteps.has(stepNum)
                          ? 'bg-crimson text-cream'
                          : `bg-gold/20 text-crimson border-2 border-gold/40`
                      }`}
                      onClick={() => checklistMode && toggleStep(stepNum)}
                    >
                      {checklistMode && completedSteps.has(stepNum) ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        stepNum
                      )}
                    </div>
                    
                    <div className={`transition-opacity ${checklistMode && completedSteps.has(stepNum) ? 'opacity-50' : ''}`}>
                      <h3 className="font-cinzel text-base text-crimson mb-1">{step.title}</h3>
                      <p className="font-montserrat text-sm text-navy-dark leading-relaxed">{step.instruction}</p>
                      {step.spoken_words && (
                        <p className="font-crimson text-sm text-navy-dark/80 italic mt-2">&ldquo;{step.spoken_words}&rdquo;</p>
                      )}
                      {step.duration && (
                        <p className="font-montserrat text-xs text-navy-dark/70 mt-2 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {step.duration}
                        </p>
                      )}
                      {step.note && (
                        <p className="font-crimson text-xs text-navy-dark/80 italic mt-1">
                          <img src="/icons/anchors/gold/anchor-feather.png" alt="" className="w-3 h-3 inline-block mr-1 opacity-70" />
                          {step.note}
                        </p>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>
        ) : null}

        {/* Divider after working */}
        <GeneratedDivider imageBase64={generatedAssets?.divider_2} isLoading={isLoadingImages} />

        {/* Spoken Words - CONTRAST LOCKED */}
        {spell.spoken_words && (
          <section className="p-6 bg-[#F3EFE8] border border-gold/40 rounded-sm shadow-sm">
            <SectionHeader 
              brandIconName="feather" 
              title="Words of Power" 
              iconPath={getSectionIconPath('spoken_words')}
            />
            
            <div className="space-y-4">
              {spell.spoken_words.invocation && (
                <div>
                  <p className="font-montserrat text-xs text-navy-dark/70 uppercase tracking-wider mb-1">Opening Invocation</p>
                  <p className="font-crimson text-base text-navy-dark italic">&ldquo;{spell.spoken_words.invocation}&rdquo;</p>
                </div>
              )}
              
              {spell.spoken_words.main_incantation && (
                <div className="py-4 border-y border-gold/30">
                  <p className="font-montserrat text-xs text-navy-dark/70 uppercase tracking-wider mb-2">Main Incantation</p>
                  <p className="font-crimson text-lg text-crimson text-center leading-relaxed">
                    &ldquo;{spell.spoken_words.main_incantation}&rdquo;
                  </p>
                </div>
              )}
              
              {spell.spoken_words.closing && (
                <div>
                  <p className="font-montserrat text-xs text-navy-dark/70 uppercase tracking-wider mb-1">Closing Words</p>
                  <p className="font-crimson text-base text-navy-dark italic">&ldquo;{spell.spoken_words.closing}&rdquo;</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Historical Context - Always visible, no dropdown */}
        {spell.historical_context && (
          <section className="border border-gold/30 rounded-sm overflow-hidden">
            <div className="p-4 bg-gold/10">
              <h3 className="font-cinzel text-base text-crimson flex items-center gap-2 mb-4">
                <BrandIcon name="skull" size={20} />
                Historical Context & Sources
              </h3>

              <div className="space-y-4">
                {spell.historical_context.tradition && (
                  <div>
                    <p className="font-montserrat text-xs text-navy-dark/70 uppercase tracking-wider">Tradition</p>
                    <p className="font-montserrat text-sm text-navy-dark">{spell.historical_context.tradition}</p>
                  </div>
                )}

                {spell.historical_context.time_period && (
                  <div>
                    <p className="font-montserrat text-xs text-navy-dark/70 uppercase tracking-wider">Time Period</p>
                    <p className="font-montserrat text-sm text-navy-dark">{spell.historical_context.time_period}</p>
                  </div>
                )}

                {spell.historical_context.practitioners && spell.historical_context.practitioners.length > 0 && (
                  <div>
                    <p className="font-montserrat text-xs text-navy-dark/70 uppercase tracking-wider flex items-center gap-1">
                      <BrandIcon name="eye" size={12} className="inline-block" /> Historical Practitioners
                    </p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {spell.historical_context.practitioners.map((name, idx) => (
                        <span key={idx} className="px-2 py-1 bg-gold/15 text-navy-dark rounded-sm text-xs font-montserrat">
                          {name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {spell.historical_context.sources && spell.historical_context.sources.length > 0 && (
                  <div>
                    <p className="font-montserrat text-xs text-navy-dark/70 uppercase tracking-wider mb-2">Sources & References</p>
                    <div className="space-y-2">
                      {spell.historical_context.sources.map((source, idx) => (
                        <div key={idx} className="p-3 bg-gold/10 rounded-sm">
                          <p className="font-montserrat text-sm text-navy-dark">
                            <strong>{source.author}</strong>, <em>{source.work}</em> ({source.year})
                          </p>
                          {source.relevance && (
                            <p className="font-montserrat text-xs text-navy-dark/70 mt-1">{source.relevance}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {spell.historical_context.cultural_notes && (
                  <div className="p-3 bg-gold/10 border-l-2 border-gold rounded-r-sm">
                    <p className="font-montserrat text-xs text-navy-dark/70 uppercase tracking-wider mb-1">Cultural Notes</p>
                    <p className="font-crimson text-sm text-navy-dark italic">{spell.historical_context.cultural_notes}</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Variations */}
        {spell.variations && spell.variations.length > 0 && (
          <section>
            <h2 className="font-cinzel text-lg text-crimson mb-3">Variations & Adaptations</h2>
            <div className="space-y-2">
              {spell.variations.map((variation, idx) => (
                <div key={idx} className="p-3 bg-gold/10 rounded-sm">
                  {typeof variation === 'string' ? (
                    <p className="font-montserrat text-sm text-navy-dark">{variation}</p>
                  ) : (
                    <>
                      <p className="font-montserrat text-sm font-medium text-navy-dark">{variation.name}</p>
                      <p className="font-montserrat text-xs text-navy-dark/70">{variation.description}</p>
                    </>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
        
        {/* References & Where This Comes From - Always visible, flowing layout */}
        {spell.inspired_by && spell.inspired_by.length > 0 && (
          <section className="border border-gold/30 rounded-sm overflow-hidden">
            <div className="p-4 bg-gold/10">
              <h3 className="font-cinzel text-base text-crimson flex items-center gap-2 mb-4">
                <BrandIcon name="grimoire" size={20} />
                References &amp; Where This Comes From
              </h3>

              <div className="space-y-4">
                {spell.inspired_by.map((source, idx) => (
                  <div key={idx} className="bg-gold/5 rounded-sm border border-gold/20 p-4 space-y-3">
                    <div className="flex items-start gap-3">
                      <img src="/icons/ui/icon-library-books.png" alt="" className="w-5 h-5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-cinzel text-sm font-medium text-crimson">
                          {source.name}
                          {source.author && <span className="text-navy-dark/70 font-montserrat text-xs ml-1">&mdash; {source.author}</span>}
                        </p>
                      </div>
                    </div>

                    {(source.connection_to_spell || source.connection) && (
                      <div className="bg-white/60 p-3 rounded border-l-2 border-gold">
                        <p className="font-montserrat text-xs text-navy-dark/80 uppercase tracking-wider mb-1">Why this matters here</p>
                        <p className="font-crimson text-sm text-navy-dark/80 leading-relaxed">
                          {source.connection_to_spell || source.connection}
                        </p>
                      </div>
                    )}

                    {source.key_concept_used && (
                      <div className="flex items-start gap-2">
                        <BrandIcon name="key" size={16} className="mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-montserrat text-xs text-navy-dark/80 uppercase tracking-wider">Concept used</p>
                          <p className="font-montserrat text-sm text-navy-dark/80">{source.key_concept_used}</p>
                        </div>
                      </div>
                    )}

                    {source.beginner_takeaway && (
                      <div className="bg-gold/10 p-2 rounded">
                        <p className="font-crimson text-sm text-crimson italic">
                          {source.beginner_takeaway}
                        </p>
                      </div>
                    )}

                    {source.learn_more && source.learn_more.length > 0 && (
                      <div>
                        <p className="font-montserrat text-xs text-navy-dark/80 uppercase tracking-wider mb-2">Learn more</p>
                        <div className="flex flex-wrap gap-2">
                          {source.learn_more.map((resource, resIdx) => (
                            <a
                              key={resIdx}
                              href={resource.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2 py-1 bg-white/70 hover:bg-white rounded text-xs font-montserrat text-crimson border border-gold/20 transition-colors"
                            >
                              <span className="truncate max-w-32">{resource.title}</span>
                              <ExternalLink className="w-3 h-3 flex-shrink-0" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {/* Historical Context - Compact */}
                {spell.historical_context && (
                  <div className="p-3 bg-gold/5 rounded-sm border border-gold/20 mt-3">
                    <div className="flex items-center gap-2 mb-2">
                      <BrandIcon name="skull" size={16} />
                      <span className="font-montserrat text-xs text-navy-dark/70 uppercase tracking-wider">Historical Context</span>
                    </div>
                    <div className="space-y-1 text-sm">
                      {spell.historical_context.tradition && (
                        <p className="font-montserrat text-navy-dark/80">
                          <span className="font-medium">Tradition:</span> {spell.historical_context.tradition}
                        </p>
                      )}
                      {spell.historical_context.cultural_note && (
                        <p className="font-crimson text-navy-dark/70 italic text-sm">
                          {spell.historical_context.cultural_note}
                        </p>
                      )}
                      {spell.historical_context.modern_adaptation && (
                        <p className="font-montserrat text-xs text-navy-dark/60 mt-1">
                          <span className="font-medium">Today:</span> {spell.historical_context.modern_adaptation}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Warnings */}
        {spell.warnings && spell.warnings.length > 0 && (
          <div className="p-4 bg-red-900/10 border border-red-800/30 rounded-sm">
            <p className="font-montserrat text-xs text-red-800 uppercase tracking-wider mb-2 flex items-center gap-1">
              <AlertTriangle className="w-4 h-4" /> Important Considerations
            </p>
            <ul className="space-y-1">
              {spell.warnings.map((warning, idx) => (
                <li key={idx} className="font-montserrat text-sm text-navy-dark">• {warning}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Closing Message */}
        {spell.closing_message && (
          <div className={`p-4 bg-gold/10 border-l-4 border-gold rounded-r-sm`}>
            <p className="font-crimson text-base text-navy-dark italic">{spell.closing_message}</p>
          </div>
        )}
        
        {/* Closing section from new format */}
        {spell.closing && (
          <section>
            <SectionHeader 
              icon={CheckCircle2} 
              title="Closing" 
              iconPath={getSectionIconPath('closing')}
            />
            {spell.closing.description && (
              <p className="font-montserrat text-sm text-navy-dark mb-3">{spell.closing.description}</p>
            )}
            {spell.closing.steps && spell.closing.steps.length > 0 && (
              <ul className="space-y-2 mb-3">
                {spell.closing.steps.map((step, idx) => (
                  <li key={idx} className="font-montserrat text-sm text-navy-dark flex items-start gap-2">
                    <img src="/icons/anchors/gold/anchor-feather.png" alt="" className="w-4 h-4 opacity-70 mt-0.5" />
                    {step}
                  </li>
                ))}
              </ul>
            )}
            {spell.closing.final_words && (
              <p className="font-crimson text-base text-navy-dark/80 italic text-center">
                &ldquo;{spell.closing.final_words}&rdquo;
              </p>
            )}
          </section>
        )}
        
        {/* Aftercare section */}
        {spell.aftercare && (
          <section className="p-4 bg-gold/10 border border-gold/30 rounded-sm">
            <SectionHeader 
              brandIconName="sacredheart" 
              title="Aftercare" 
              iconPath={getSectionIconPath('aftercare')}
            />
            {spell.aftercare.immediate && (
              <div className="mb-3">
                <p className="font-montserrat text-xs text-navy-dark/70 uppercase tracking-wider mb-1">Immediately After</p>
                <p className="font-montserrat text-sm text-navy-dark">{spell.aftercare.immediate}</p>
              </div>
            )}
            {spell.aftercare.ongoing && (
              <div>
                <p className="font-montserrat text-xs text-navy-dark/70 uppercase tracking-wider mb-1">Ongoing Practice</p>
                <p className="font-montserrat text-sm text-navy-dark">{spell.aftercare.ongoing}</p>
              </div>
            )}
          </section>
        )}

        {/* END OF LEGACY FLAT SPELL RENDERING */}
        </>
        )}

        {/* Divider before printables */}
        <GeneratedDivider imageBase64={generatedAssets?.divider_3} isLoading={isLoadingImages} />
        
        {/* Printables Block - Tarot Card (front & back) and Sigil */}
        <PrintablesBlock 
          tarotImageBase64={generatedAssets?.tarot_card_image}
          sigilImageBase64={generatedAssets?.sigil}
          spellTitle={spell.title}
          tarotCard={spell.tarot_card}
          isLoading={isLoadingImages}
        />

        {/* Embossed Seal Stamp */}
        <div className="flex justify-center py-6">
          <div className="relative">
            <img 
              src={SEAL_LOGO_URL}
              alt="Where The Crowlands Seal"
              className="w-36 h-36 md:w-48 md:h-48 object-contain"
              style={{ 
                mixBlendMode: 'multiply',
                opacity: 0.6
              }}
            />
          </div>
        </div>

        {/* Parliament Crow Watermark */}
        <div className="flex justify-center pb-4">
          <img 
            src={CROW_WATERMARK}
            alt="Parliament Crow"
            className="w-16 h-16 md:w-20 md:h-20 object-contain rounded-full"
            style={{ 
              opacity: 0.15,
              filter: 'grayscale(30%)'
            }}
          />
        </div>

        {/* Research & Origins - Load button that expands inline (no collapse) */}
        <section className="border border-crimson/30 rounded-sm overflow-hidden">
          {!researchData && (
            <button
              onClick={fetchResearchOrigins}
              disabled={isLoadingResearch}
              className="w-full p-4 flex items-center justify-center gap-2 bg-crimson/10 hover:bg-crimson/20 transition-all disabled:opacity-70"
              data-testid="show-research-origins-btn"
            >
              {isLoadingResearch ? (
                <Loader2 className="w-5 h-5 animate-spin text-crimson" />
              ) : (
                <Search className="w-5 h-5 text-crimson" />
              )}
              <span className="font-cinzel text-base text-crimson">
                {isLoadingResearch ? 'Researching...' : 'Show Research & Origins'}
              </span>
            </button>
          )}

          {researchData && (
            <div className="p-4 space-y-4 bg-gold/5">
              <div className="flex items-center gap-2 mb-2">
                <Search className="w-5 h-5 text-crimson" />
                <h3 className="font-cinzel text-base text-crimson">Research & Origins</h3>
              </div>

              {/* Spellbook Response (Persona Voice) */}
              <div className="bg-gold/10/80 p-4 rounded-sm border border-gold/30">
                <div className="flex items-center gap-2 mb-3">
                  <BrandIcon name="grimoire" size={16} />
                  <span className="font-cinzel text-sm text-crimson uppercase tracking-wider">
                    {researchData.persona_used}&apos;s Wisdom
                  </span>
                </div>
                <p className="font-crimson text-base text-navy-dark/80 leading-relaxed whitespace-pre-wrap">
                  {researchData.spellbook_response}
                </p>
              </div>

              {/* Research Origins (DeepSeek V2) */}
              <div className="bg-white/60 p-4 rounded-sm border border-crimson/20">
                <div className="flex items-center gap-2 mb-3">
                  <Search className="w-4 h-4 text-crimson" />
                  <span className="font-cinzel text-sm text-crimson uppercase tracking-wider">
                    Research & Origins
                  </span>
                </div>

                {/* Summary */}
                {researchData.research_origins?.summary && (
                  <p className="font-montserrat text-sm text-navy-dark/80 leading-relaxed mb-4">
                    {researchData.research_origins.summary}
                  </p>
                )}

                {/* Key Takeaways */}
                {researchData.research_origins?.key_takeaways?.length > 0 && (
                  <div className="mb-4">
                    <p className="font-montserrat text-xs text-crimson uppercase tracking-wider mb-2">Key Points</p>
                    <ul className="space-y-2">
                      {researchData.research_origins.key_takeaways.map((takeaway, idx) => (
                        <li key={idx} className="font-montserrat text-sm text-navy-dark/80 flex items-start gap-2">
                          <span className="text-crimson mt-1 flex-shrink-0">&bull;</span>
                          <span>{typeof takeaway === 'string' ? takeaway : takeaway.text || JSON.stringify(takeaway)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Why This Works */}
                {researchData.research_origins?.why_this_works_facts?.length > 0 && (
                  <div className="mb-4">
                    <p className="font-montserrat text-xs text-crimson uppercase tracking-wider mb-2">Why This Works</p>
                    <ul className="space-y-2">
                      {researchData.research_origins.why_this_works_facts.map((fact, idx) => (
                        <li key={idx} className="font-montserrat text-sm text-navy-dark/70 italic flex items-start gap-2">
                          <span className="text-gold mt-1 flex-shrink-0">&#9670;</span>
                          <span>{typeof fact === 'string' ? fact : fact.claim || JSON.stringify(fact)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Sources */}
                {researchData.research_origins?.sources?.length > 0 && (
                  <div>
                    <p className="font-montserrat text-xs text-crimson uppercase tracking-wider mb-2">Suggested Further Reading</p>
                    <div className="space-y-2">
                      {researchData.research_origins.sources.map((source, idx) => (
                        <div key={idx} className="p-2 bg-gold/5 rounded border border-gold/20">
                          {typeof source === 'string' ? (
                            <span className="font-montserrat text-xs text-crimson">{source}</span>
                          ) : (
                            <div>
                              <span className="font-montserrat text-xs font-medium text-crimson">
                                {source.author && `${source.author} — `}{source.title || 'Unknown'}
                              </span>
                              {source.year && <span className="font-montserrat text-xs text-crimson"> ({source.year})</span>}
                              {source.url && (
                                <a href={source.url} target="_blank" rel="noopener noreferrer" className="block text-xs text-gold hover:text-gold mt-1 underline">
                                  View source
                                </a>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </section>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 pt-4 border-t border-gold/30">
          <button
            onClick={saveToGrimoire}
            disabled={isSaving}
            className="px-4 py-2 bg-crimson text-cream hover:bg-crimson-bright rounded-sm font-montserrat tracking-widest uppercase text-xs transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Save className={`w-4 h-4 ${isSaving ? 'animate-pulse' : ''}`} />
            {isSaving ? 'Saving...' : 'Save to Grimoire'}
          </button>
          <button
            onClick={copySpellToClipboard}
            className="px-4 py-2 bg-transparent text-crimson border border-gold/40 rounded-sm font-montserrat tracking-widest uppercase text-xs hover:bg-gold/10 transition-all flex items-center gap-2"
          >
            <Copy className="w-4 h-4" />
            Copy Spell
          </button>
          <button
            onClick={downloadAsPdf}
            disabled={isGeneratingPdf}
            className="px-4 py-2 bg-transparent text-crimson border border-gold/40 hover:bg-gold/10 rounded-sm font-montserrat tracking-widest uppercase text-xs transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Download className={`w-4 h-4 ${isGeneratingPdf ? 'animate-bounce' : ''}`} />
            {isGeneratingPdf ? 'Generating...' : 'Save as PDF'}
          </button>
          <button
            onClick={onNewSpell}
            className="px-4 py-2 bg-crimson text-cream rounded-sm font-montserrat tracking-widest uppercase text-xs hover:bg-crimson-bright transition-all"
          >
            New Spell
          </button>
        </div>
      </div>
    </motion.div>
    </SpellBorderFrame>
    </SpellPageFrame>
  );
};

const TimingCard = ({ icon: Icon, brandIconName, label, value, small = false }) => (
  <div className="p-3 bg-gold/10 border border-gold/30 rounded-sm text-center">
    {brandIconName ? <BrandIcon name={brandIconName} size={20} className="mx-auto mb-1" /> : <Icon className="w-5 h-5 text-navy-dark/80 mx-auto mb-1" />}
    <p className="font-montserrat text-xs text-navy-dark/70 uppercase tracking-wider">{label}</p>
    <p className={`font-cinzel ${small ? 'text-xs' : 'text-sm'} text-navy-dark`}>{value || 'Any'}</p>
  </div>
);
