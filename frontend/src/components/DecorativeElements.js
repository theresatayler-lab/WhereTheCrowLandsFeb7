import React from 'react';

// Ornate corner decorations - SVG paths for Victorian/Art Nouveau style
export const OrnateCorner = ({ position = 'top-left', size = 60, color = 'currentColor', className = '' }) => {
  const rotations = {
    'top-left': 'rotate(0)',
    'top-right': 'rotate(90)',
    'bottom-right': 'rotate(180)',
    'bottom-left': 'rotate(270)',
  };

  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      className={className}
      style={{ transform: rotations[position] }}
    >
      <path
        d="M0,0 L30,0 C20,0 15,5 15,15 L15,30 C15,20 10,15 0,15 L0,0 Z M0,0 Q50,0 50,50 Q50,0 100,0 L100,0 L0,0 Z"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
      />
      <path
        d="M5,5 C15,5 20,10 20,20 M10,2 C25,2 30,15 30,25 M2,10 C2,25 15,30 25,30"
        fill="none"
        stroke={color}
        strokeWidth="0.8"
        opacity="0.6"
      />
      <circle cx="8" cy="8" r="2" fill={color} opacity="0.8" />
      <path
        d="M15,0 Q15,15 0,15"
        fill="none"
        stroke={color}
        strokeWidth="1"
      />
    </svg>
  );
};

// Mystical divider with crow/moon motif
export const MysticalDivider = ({ className = '', variant = 'default' }) => {
  if (variant === 'crow') {
    return (
      <div className={`flex items-center justify-center gap-4 py-4 ${className}`}>
        <div className="h-px bg-gradient-to-r from-transparent via-primary/40 to-primary/60 flex-1" />
        <svg width="40" height="24" viewBox="0 0 40 24" className="text-primary/60">
          {/* Simplified crow silhouette */}
          <path 
            d="M20,4 Q25,2 30,6 Q35,10 38,8 Q36,12 32,14 Q28,16 24,14 L20,18 L16,14 Q12,16 8,14 Q4,12 2,8 Q5,10 10,6 Q15,2 20,4 Z"
            fill="currentColor"
          />
        </svg>
        <div className="h-px bg-gradient-to-l from-transparent via-primary/40 to-primary/60 flex-1" />
      </div>
    );
  }

  if (variant === 'moon') {
    return (
      <div className={`flex items-center justify-center gap-4 py-4 ${className}`}>
        <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-primary/50 flex-1" />
        <div className="flex items-center gap-2">
          <span className="text-primary/40">✦</span>
          <svg width="20" height="20" viewBox="0 0 20 20" className="text-primary/50">
            <path 
              d="M10,2 A8,8 0 1,1 10,18 A6,6 0 1,0 10,2"
              fill="currentColor"
            />
          </svg>
          <span className="text-primary/40">✦</span>
        </div>
        <div className="h-px bg-gradient-to-l from-transparent via-primary/30 to-primary/50 flex-1" />
      </div>
    );
  }

  // Default ornate divider
  return (
    <div className={`flex items-center justify-center gap-3 py-4 ${className}`}>
      <div className="h-px bg-gradient-to-r from-transparent to-primary/40 flex-1" />
      <div className="flex items-center gap-1">
        <span className="text-primary/30 text-xs">◆</span>
        <span className="text-primary/50 text-sm">❧</span>
        <span className="text-primary/30 text-xs">◆</span>
      </div>
      <div className="h-px bg-gradient-to-l from-transparent to-primary/40 flex-1" />
    </div>
  );
};

// Ornate frame wrapper for content
export const OrnateFrame = ({ children, className = '', variant = 'single' }) => {
  if (variant === 'double') {
    return (
      <div className={`relative ${className}`}>
        {/* Outer border */}
        <div className="absolute inset-0 border-2 border-primary/20 rounded-sm" />
        {/* Inner border */}
        <div className="absolute inset-2 border border-primary/30 rounded-sm" />
        {/* Corner ornaments */}
        <OrnateCorner position="top-left" size={40} color="var(--primary)" className="absolute -top-1 -left-1 opacity-40" />
        <OrnateCorner position="top-right" size={40} color="var(--primary)" className="absolute -top-1 -right-1 opacity-40" />
        <OrnateCorner position="bottom-left" size={40} color="var(--primary)" className="absolute -bottom-1 -left-1 opacity-40" />
        <OrnateCorner position="bottom-right" size={40} color="var(--primary)" className="absolute -bottom-1 -right-1 opacity-40" />
        {/* Content */}
        <div className="relative p-6">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className={`relative border border-primary/30 rounded-sm ${className}`}>
      <OrnateCorner position="top-left" size={30} color="var(--primary)" className="absolute -top-1 -left-1 opacity-50" />
      <OrnateCorner position="top-right" size={30} color="var(--primary)" className="absolute -top-1 -right-1 opacity-50" />
      <OrnateCorner position="bottom-left" size={30} color="var(--primary)" className="absolute -bottom-1 -left-1 opacity-50" />
      <OrnateCorner position="bottom-right" size={30} color="var(--primary)" className="absolute -bottom-1 -right-1 opacity-50" />
      <div className="p-4">
        {children}
      </div>
    </div>
  );
};

// Illuminated drop cap for spell introductions
export const IlluminatedDropCap = ({ letter, className = '' }) => {
  return (
    <span className={`float-left mr-3 mb-1 ${className}`}>
      <span 
        className="block font-italiana text-5xl md:text-6xl text-primary leading-none"
        style={{
          textShadow: '2px 2px 4px rgba(139, 90, 43, 0.3)',
          WebkitTextStroke: '0.5px rgba(139, 90, 43, 0.5)',
        }}
      >
        {letter}
      </span>
    </span>
  );
};

// Decorative section header
export const SectionHeader = ({ title, subtitle, icon, className = '' }) => {
  return (
    <div className={`text-center ${className}`}>
      <MysticalDivider variant="moon" />
      <div className="flex items-center justify-center gap-3 my-2">
        {icon && <span className="text-2xl text-primary/60">{icon}</span>}
        <h3 className="font-cinzel text-lg md:text-xl text-primary tracking-wider uppercase">
          {title}
        </h3>
        {icon && <span className="text-2xl text-primary/60">{icon}</span>}
      </div>
      {subtitle && (
        <p className="font-montserrat text-xs text-muted-foreground tracking-widest uppercase">
          {subtitle}
        </p>
      )}
      <MysticalDivider />
    </div>
  );
};

// Parchment texture background wrapper
export const ParchmentBackground = ({ children, className = '', intensity = 'medium' }) => {
  const opacities = {
    light: 'bg-opacity-30',
    medium: 'bg-opacity-50',
    heavy: 'bg-opacity-70',
  };

  return (
    <div 
      className={`relative ${className}`}
      style={{
        backgroundColor: '#F3EFE8',
        backgroundImage: `
          radial-gradient(ellipse at 20% 30%, rgba(139, 90, 43, 0.08) 0%, transparent 50%),
          radial-gradient(ellipse at 80% 70%, rgba(139, 90, 43, 0.06) 0%, transparent 50%),
          radial-gradient(ellipse at 50% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 70%)
        `,
      }}
    >
      {/* Subtle noise texture overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
      <div className="relative">
        {children}
      </div>
    </div>
  );
};

// Mystical symbol decorations
export const MysticalSymbol = ({ symbol = 'pentacle', size = 24, className = '' }) => {
  const symbols = {
    pentacle: '⛤',
    moon: '☽',
    sun: '☀',
    star: '✦',
    eye: '👁',
    ankh: '☥',
    triquetra: '⚛',
    infinity: '∞',
    spiral: '🌀',
    feather: '🪶',
    crow: '🐦‍⬛',
  };

  return (
    <span 
      className={`inline-block ${className}`}
      style={{ fontSize: size }}
    >
      {symbols[symbol] || symbol}
    </span>
  );
};

// Ornate card border (for Tarot cards)
export const TarotCardBorder = ({ children, className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      {/* Outer gold border */}
      <div 
        className="absolute inset-0 rounded-lg"
        style={{
          background: 'linear-gradient(135deg, #B8860B 0%, #DAA520 25%, #FFD700 50%, #DAA520 75%, #B8860B 100%)',
          padding: '3px',
        }}
      >
        <div className="w-full h-full rounded-lg bg-[#F3EFE8]" />
      </div>
      
      {/* Inner decorative border */}
      <div className="absolute inset-2 border border-primary/40 rounded-md" />
      <div className="absolute inset-4 border border-primary/20 rounded-sm" />
      
      {/* Corner flourishes */}
      <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-primary/50 rounded-tl-sm" />
      <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-primary/50 rounded-tr-sm" />
      <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-primary/50 rounded-bl-sm" />
      <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-primary/50 rounded-br-sm" />
      
      {/* Content */}
      <div className="relative p-6">
        {children}
      </div>
    </div>
  );
};

// Export all components
export default {
  OrnateCorner,
  MysticalDivider,
  OrnateFrame,
  IlluminatedDropCap,
  SectionHeader,
  ParchmentBackground,
  MysticalSymbol,
  TarotCardBorder,
};
