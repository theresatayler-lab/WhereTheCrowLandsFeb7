import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, BookOpen, Copy, Check } from 'lucide-react';

// ===== ART DECO / VICTORIAN ORNATE DESIGN COMPONENTS =====

// Art Deco corner ornament
const ArtDecoCorner = ({ className, variant = 'gold' }) => {
  const colors = variant === 'gold' 
    ? { primary: '#d4a84b', secondary: '#b82330', tertiary: '#8B7355' }
    : { primary: '#b82330', secondary: '#d4a84b', tertiary: '#722F37' };
  
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none">
      {/* Art Deco fan pattern */}
      <path d="M0,100 L0,60 Q20,60 35,45 Q50,30 50,0 L60,0 Q60,40 40,60 Q20,80 0,100" 
            fill={colors.primary} opacity="0.15" />
      <path d="M0,100 L0,70 Q15,70 25,60 Q35,50 35,30 L40,30 Q40,55 28,70 Q15,85 0,100" 
            fill={colors.secondary} opacity="0.1" />
      
      {/* Geometric lines */}
      <line x1="0" y1="50" x2="50" y2="0" stroke={colors.primary} strokeWidth="1.5" opacity="0.6" />
      <line x1="0" y1="35" x2="35" y2="0" stroke={colors.primary} strokeWidth="1" opacity="0.4" />
      <line x1="0" y1="65" x2="65" y2="0" stroke={colors.tertiary} strokeWidth="0.5" opacity="0.3" />
      
      {/* Sunburst elements */}
      <circle cx="12" cy="12" r="8" fill="none" stroke={colors.primary} strokeWidth="1" opacity="0.5" />
      <circle cx="12" cy="12" r="4" fill={colors.secondary} opacity="0.6" />
      <circle cx="12" cy="12" r="2" fill={colors.primary} opacity="0.8" />
      
      {/* Decorative dots */}
      <circle cx="28" cy="28" r="1.5" fill={colors.primary} opacity="0.5" />
      <circle cx="20" cy="36" r="1" fill={colors.secondary} opacity="0.4" />
      <circle cx="36" cy="20" r="1" fill={colors.secondary} opacity="0.4" />
    </svg>
  );
};

// Victorian border element
const VictorianBorder = ({ light = false }) => (
  <div className={`w-full h-4 relative ${light ? 'opacity-60' : 'opacity-80'}`}>
    <svg viewBox="0 0 400 16" className="w-full h-full" preserveAspectRatio="none">
      <defs>
        <pattern id="victorianPattern" x="0" y="0" width="40" height="16" patternUnits="userSpaceOnUse">
          {/* Repeating Victorian scroll pattern */}
          <path d="M0,8 Q5,2 10,8 T20,8 T30,8 T40,8" 
                fill="none" 
                stroke={light ? '#722F37' : '#d4a84b'} 
                strokeWidth="1" 
                opacity="0.6" />
          <circle cx="20" cy="8" r="2" fill={light ? '#b82330' : '#d4a84b'} opacity="0.4" />
        </pattern>
      </defs>
      <rect width="400" height="16" fill="url(#victorianPattern)" />
    </svg>
  </div>
);

// Mystical divider with Art Deco styling
const ArtDecoDivider = ({ variant = 'default', light = false }) => {
  const lineColor = light ? 'via-crimson/40' : 'via-gold/60';
  const symbolColor = light ? 'text-crimson' : 'text-gold';
  
  return (
    <div className="flex items-center justify-center gap-3 py-6">
      <div className={`h-px bg-gradient-to-r from-transparent ${lineColor} to-transparent flex-1 max-w-20`} />
      <div className="flex items-center gap-1">
        <span className={`text-xs ${symbolColor} opacity-60`}>◇</span>
        <span className={`text-lg ${symbolColor}`}>
          {variant === 'book' ? '' : variant === 'moon' ? '☽' : '❧'}
        </span>
        <span className={`text-xs ${symbolColor} opacity-60`}>◇</span>
      </div>
      <div className={`h-px bg-gradient-to-l from-transparent ${lineColor} to-transparent flex-1 max-w-20`} />
    </div>
  );
};

// Book data organized by category
const LIBRARY_BOOKS = {
  "Magic & Witchcraft": [
    {
      title: "The Book of English Magic",
      author: "Philip Carr-Gomm & Richard Heygate",
      color: "#8B4513",
      spine: "#654321",
      accent: "#d4a84b",
      description: "A comprehensive guide to the magical traditions of England, from ancient Druids to modern practitioners.",
      relevantTo: ["All"],
      link: "https://www.amazon.com/Book-English-Magic-Philip-Carr-Gomm/dp/1590204514"
    },
    {
      title: "Protection Spells",
      author: "Arin Murphy-Hiscock",
      color: "#4A0E4E",
      spine: "#2D0A2E",
      accent: "#9966CC",
      description: "Clear, practical guide to magical protection for home, family, and self.",
      relevantTo: ["Cathleen"],
      link: "https://www.amazon.com/Protection-Spells-Clear-Guard-Safety/dp/1507210035"
    },
    {
      title: "Essex Witches",
      author: "Peter C. Brown",
      color: "#2F4F4F",
      spine: "#1C3030",
      accent: "#5F9EA0",
      description: "The dark history of witch trials and cunning folk in Essex.",
      relevantTo: ["Katherine", "Cathleen"],
      link: "https://www.amazon.com/Essex-Witches-Peter-Brown/dp/0752453173"
    },
    {
      title: "The History of Witchcraft",
      author: "National Geographic",
      color: "#DAA520",
      spine: "#B8860B",
      accent: "#FFD700",
      description: "From the greatest myths to the Salem witch trials - a visual history.",
      relevantTo: ["All"],
      link: "https://www.amazon.com/History-Witchcraft-National-Geographic/dp/1426221878"
    },
    {
      title: "Symbols of the Occult",
      author: "Eric Chaline",
      color: "#1a1a2e",
      spine: "#0f0f1a",
      accent: "#4169E1",
      description: "A directory of over 500 signs, symbols, and icons from esoteric traditions.",
      relevantTo: ["Katherine"],
      link: "https://www.amazon.com/Symbols-Occult-Eric-Chaline/dp/0500518882"
    },
    {
      title: "The Witch's Cookbook",
      author: "Various",
      color: "#556B2F",
      spine: "#3B4A23",
      accent: "#9ACD32",
      description: "Kitchen magic, recipes, and rituals for the hearth witch.",
      relevantTo: ["Shigg"],
      link: "https://www.amazon.com/Witchs-Cookbook-Enchanting-Recipes-Inspired/dp/1681884755"
    },
    {
      title: "The Discoverie of Witchcraft",
      author: "Reginald Scot (1584)",
      color: "#8B7355",
      spine: "#6B5344",
      accent: "#C4A47C",
      description: "A 1584 skeptical exposé of witchcraft claims - one of the earliest critical texts.",
      relevantTo: ["Katherine"],
      link: "https://www.amazon.com/Discoverie-Witchcraft-Reginald-Scot/dp/0486260305"
    },
    {
      title: "Malleus Maleficarum",
      author: "Kramer & Sprenger",
      color: "#3d0c02",
      spine: "#2a0801",
      accent: "#8B0000",
      description: "The infamous 'Hammer of Witches' - historical context for what women like Katherine faced.",
      relevantTo: ["Katherine"],
      link: "https://www.amazon.com/Malleus-Maleficarum-Heinrich-Kramer/dp/1684220297"
    }
  ],
  "Spiritualism & Occult": [
    {
      title: "The Aleister Crowley Manual",
      author: "Marco Visconti",
      color: "#800020",
      spine: "#5c0017",
      accent: "#DC143C",
      description: "Thelemic magick for modern times - practical ceremonial magic.",
      relevantTo: ["Katherine"],
      link: "https://www.amazon.com/Aleister-Crowley-Manual-Thelemic-Modern/dp/1786785153"
    },
    {
      title: "The Red Book: Liber Novus",
      author: "C.G. Jung",
      color: "#8B0000",
      spine: "#5c0000",
      accent: "#FF4500",
      description: "Jung's illustrated visionary journal - the foundation of shadow work.",
      relevantTo: ["Katherine"],
      link: "https://www.amazon.com/Red-Book-Philemon-C-Jung/dp/0393065677"
    },
    {
      title: "The Wild Unknown Tarot",
      author: "Kim Krans",
      color: "#F5F5DC",
      spine: "#E8E8D0",
      textColor: "#333",
      accent: "#8B8B7A",
      description: "Modern tarot guidebook with nature-based imagery and intuitive interpretations.",
      relevantTo: ["All"],
      link: "https://www.amazon.com/Wild-Unknown-Tarot-Guidebook/dp/0062466593"
    },
    {
      title: "Kabbalistic Teachings",
      author: "J. Zohara Meyerhoff Hieronimus",
      color: "#4169E1",
      spine: "#2850A8",
      accent: "#87CEEB",
      description: "The seven holy women of ancient Israel through a kabbalistic lens.",
      relevantTo: ["Katherine"],
      link: "https://www.amazon.com/Kabbalistic-Teachings-Female-Prophets-Biblical/dp/1594773556"
    },
    {
      title: "The Morrigan",
      author: "Morgan Daimler",
      color: "#1C1C1C",
      spine: "#0a0a0a",
      accent: "#4B0082",
      description: "Ireland's goddess of war, death, and transformation - Cathleen's dark ally.",
      relevantTo: ["Cathleen"],
      link: "https://www.amazon.com/Morrigan-Meeting-Great-Queen/dp/1782798331"
    }
  ],
  "Poetry & Literature": [
    {
      title: "Rubáiyát of Omar Khayyám",
      author: "Edward FitzGerald (trans.)",
      color: "#C19A6B",
      spine: "#A67B5B",
      accent: "#DEB887",
      description: "Shigg's guiding star - Persian verses on impermanence, acceptance, and savoring the moment.",
      relevantTo: ["Shigg"],
      link: "https://www.amazon.com/Rubaiyat-Omar-Khayyam-Edward-Fitzgerald/dp/0140443843"
    },
    {
      title: "Crow",
      author: "Ted Hughes",
      color: "#0D0D0D",
      spine: "#000000",
      accent: "#363636",
      description: "Stark, mythic poetry built around the figure of Crow - creation, violence, and fable.",
      relevantTo: ["Shigg", "Cathleen"],
      link: "https://www.amazon.com/Crow-Life-Songs-Ted-Hughes/dp/0571099157"
    },
    {
      title: "The Celtic Twilight",
      author: "W.B. Yeats",
      color: "#4A5568",
      spine: "#2D3748",
      accent: "#718096",
      description: "Irish mysticism and folklore from the Nobel laureate poet.",
      relevantTo: ["Cathleen"],
      link: "https://www.amazon.com/Celtic-Twilight-Faerie-Folklore/dp/0486436578"
    }
  ],
  "Birds & Nature": [
    {
      title: "Ornithography",
      author: "Jessica Roux",
      color: "#228B22",
      spine: "#165B16",
      accent: "#32CD32",
      description: "An illustrated guide to bird lore and symbolism - the Parliament of Birds.",
      relevantTo: ["Shigg"],
      link: "https://www.amazon.com/Ornithography-Illustrated-Guide-Bird-Lore/dp/1524858420"
    },
    {
      title: "Crows and Ravens",
      author: "Rick De Yampert",
      color: "#36454F",
      spine: "#252F35",
      accent: "#5F6A6A",
      description: "The intelligence, mythology, and magic of corvids.",
      relevantTo: ["Shigg", "Cathleen"],
      link: "https://www.amazon.com/Crows-Ravens-Rick-De-Yampert/dp/0762474114"
    },
    {
      title: "The Field Guide to Dumb Birds",
      author: "Matt Kracht",
      color: "#87CEEB",
      spine: "#5BA3C6",
      accent: "#ADD8E6",
      description: "A comedic, irreverent guide - because even witches need to laugh.",
      relevantTo: ["Shigg"],
      link: "https://www.amazon.com/Field-Guide-Dumb-Birds-America/dp/1452174032"
    }
  ],
  "London & Essex History": [
    {
      title: "Dark London",
      author: "Drew Gray",
      color: "#2C2C2C",
      spine: "#1a1a1a",
      accent: "#404040",
      description: "The hidden and darker history of London's streets.",
      relevantTo: ["Katherine"],
      link: "https://www.amazon.com/Dark-London-Crime-Corruption-Gaslight/dp/0750989238"
    },
    {
      title: "The Secret Lore of London",
      author: "John Matthews & Caroline Wise",
      color: "#722F37",
      spine: "#4a1f24",
      accent: "#A52A2A",
      description: "Magical traditions, sacred sites, and hidden history of the city.",
      relevantTo: ["Katherine", "Cathleen"],
      link: "https://www.amazon.com/Secret-Lore-London-Legendary-England/dp/0892541474"
    },
    {
      title: "The London Blitz",
      author: "David Johnson",
      color: "#4A4A4A",
      spine: "#333333",
      accent: "#696969",
      description: "The city ablaze, December 29, 1940 - the world Shigg survived.",
      relevantTo: ["Shigg", "Cathleen"],
      link: "https://www.amazon.com/London-Blitz-City-Ablaze-December/dp/0812885627"
    },
    {
      title: "A Grim Almanac of Essex",
      author: "Neil R. Storey",
      color: "#4B3621",
      spine: "#2F2215",
      accent: "#8B7355",
      description: "Dark tales from the county where Crowlands Avenue stands.",
      relevantTo: ["All"],
      link: "https://www.amazon.com/Grim-Almanac-Essex-Neil-Storey/dp/0752456350"
    },
    {
      title: "Essex Land Girls",
      author: "Dee Gordon",
      color: "#6B8E23",
      spine: "#4A6316",
      accent: "#9ACD32",
      description: "Women's wartime service in Essex - the world Cathleen knew.",
      relevantTo: ["Cathleen"],
      link: "https://www.amazon.com/Essex-Land-Girls-Dee-Gordon/dp/0752458124"
    },
    {
      title: "Jersey Legends",
      author: "Erren Michaels",
      color: "#1E3A5F",
      spine: "#142740",
      accent: "#4682B4",
      description: "Folklore from the Channel Islands - part of the family's heritage.",
      relevantTo: ["All"],
      link: "https://www.amazon.com/Jersey-Legends-Erren-Michaels/dp/0750966203"
    }
  ],
  "Healing & Psychology": [
    {
      title: "Healing Collective Trauma",
      author: "Thomas Hübl",
      color: "#5F9EA0",
      spine: "#4A7A7C",
      accent: "#7FCDCD",
      description: "A guide to integrating ancestral and cultural wounds.",
      relevantTo: ["All"],
      link: "https://www.amazon.com/Healing-Collective-Trauma-Integrating-Ancestral/dp/1683647378"
    },
    {
      title: "Signs & Symbols",
      author: "DK Publishing",
      color: "#D4AF37",
      spine: "#B8962F",
      accent: "#FFD700",
      description: "An illustrated guide to symbols across religions, cultures, and traditions.",
      relevantTo: ["All"],
      link: "https://www.amazon.com/Signs-Symbols-Illustrated-Origins-Meanings/dp/1465468226"
    }
  ]
};

// Victorian-styled Book component
const VictorianBook = ({ book, onSelect }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      className="relative cursor-pointer flex-shrink-0 group"
      style={{ 
        width: '52px',
        height: '200px',
        transformStyle: 'preserve-3d',
        perspective: '1000px'
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => onSelect(book)}
      initial={{ rotateY: 0, z: 0 }}
      animate={{ 
        rotateY: isHovered ? -20 : 0,
        z: isHovered ? 40 : 0,
        y: isHovered ? -15 : 0
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Book spine with Art Deco styling */}
      <div 
        className="absolute inset-0 rounded-r-sm flex items-center justify-center overflow-hidden"
        style={{ 
          background: `linear-gradient(90deg, ${book.spine} 0%, ${book.color} 20%, ${book.color} 80%, ${book.spine} 100%)`,
          transformOrigin: 'left center',
          boxShadow: isHovered 
            ? `4px 4px 20px rgba(0,0,0,0.6), 0 0 30px ${book.accent}40, inset 0 0 20px rgba(0,0,0,0.3)` 
            : '2px 2px 10px rgba(0,0,0,0.4), inset 0 0 10px rgba(0,0,0,0.2)'
        }}
      >
        {/* Art Deco decorative bands */}
        <div className="absolute top-0 left-0 right-0 h-8">
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-0.5 rounded-full" style={{ backgroundColor: book.accent, opacity: 0.7 }} />
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full" style={{ backgroundColor: book.accent, opacity: 0.5 }} />
          <div className="absolute top-3 left-2 w-1 h-1 rounded-full" style={{ backgroundColor: book.accent, opacity: 0.6 }} />
          <div className="absolute top-3 right-2 w-1 h-1 rounded-full" style={{ backgroundColor: book.accent, opacity: 0.6 }} />
        </div>
        
        {/* Center decorative element - Art Deco diamond */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rotate-45 border opacity-40" style={{ borderColor: book.accent }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rotate-45 opacity-60" style={{ backgroundColor: book.accent }} />
        
        {/* Spine text */}
        <div 
          className="absolute inset-0 flex items-center justify-center py-10"
          style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
        >
          <span 
            className="text-xs font-cinzel tracking-wide truncate px-1 text-center"
            style={{ 
              color: book.textColor || '#f5f0e6',
              textShadow: '0 1px 3px rgba(0,0,0,0.8)',
              maxHeight: '140px',
              overflow: 'hidden',
              letterSpacing: '0.05em'
            }}
          >
            {book.title}
          </span>
        </div>
        
        {/* Bottom Art Deco bands */}
        <div className="absolute bottom-0 left-0 right-0 h-8">
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full" style={{ backgroundColor: book.accent, opacity: 0.5 }} />
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-10 h-0.5 rounded-full" style={{ backgroundColor: book.accent, opacity: 0.7 }} />
          <div className="absolute bottom-3 left-2 w-1 h-1 rounded-full" style={{ backgroundColor: book.accent, opacity: 0.6 }} />
          <div className="absolute bottom-3 right-2 w-1 h-1 rounded-full" style={{ backgroundColor: book.accent, opacity: 0.6 }} />
        </div>
        
        {/* Gilded edge effect on hover */}
        {isHovered && (
          <div className="absolute inset-0 pointer-events-none" style={{
            background: `linear-gradient(90deg, transparent 0%, ${book.accent}15 50%, transparent 100%)`
          }} />
        )}
      </div>
      
      {/* Book pages edge */}
      <div 
        className="absolute right-0 top-2 bottom-2 w-2 rounded-r-sm"
        style={{ 
          background: 'linear-gradient(90deg, #b8a88a 0%, #f5f0e6 30%, #e8e0d0 70%, #c4b89a 100%)',
          boxShadow: 'inset -2px 0 4px rgba(0,0,0,0.15)'
        }}
      >
        {/* Page lines */}
        <div className="absolute inset-x-0 top-4 h-px bg-navy-dark/10" />
        <div className="absolute inset-x-0 bottom-4 h-px bg-navy-dark/10" />
      </div>
    </motion.div>
  );
};

// Victorian Bookshelf section - LIGHT parchment version
const VictorianShelfLight = ({ category, books, onSelectBook }) => (
  <div className="relative py-12 sm:py-16" style={{ background: 'linear-gradient(180deg, #f5f0e6 0%, #e8dfd0 50%, #f5f0e6 100%)' }}>
    {/* Wallpaper pattern overlay */}
    <div className="absolute inset-0 opacity-[0.04]" style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 0 L50 20 L40 40 L30 20 Z' fill='%23722F37'/%3E%3Ccircle cx='40' cy='60' r='8' fill='none' stroke='%23722F37' stroke-width='1'/%3E%3C/svg%3E")`,
    }} />
    
    {/* Top decorative border */}
    <div className="absolute top-0 left-0 right-0">
      <div className="h-1 bg-gradient-to-r from-transparent via-crimson to-transparent" />
      <VictorianBorder light />
    </div>
    
    {/* Corner ornaments */}
    <ArtDecoCorner className="absolute top-4 left-4 w-16 h-16 sm:w-20 sm:h-20" variant="crimson" />
    <ArtDecoCorner className="absolute top-4 right-4 w-16 h-16 sm:w-20 sm:h-20 rotate-90" variant="crimson" />
    
    <div className="relative z-10 max-w-5xl mx-auto px-4">
      {/* Category title with Victorian styling */}
      <div className="text-center mb-8">
        <div className="inline-block relative">
          <span className="absolute -left-6 top-1/2 -translate-y-1/2 text-gold-dark opacity-60">❦</span>
          <h2 className="font-italiana text-2xl sm:text-3xl text-crimson-deep px-8" 
              style={{ textShadow: '0 2px 8px rgba(114, 47, 55, 0.2)' }}>
            {category}
          </h2>
          <span className="absolute -right-6 top-1/2 -translate-y-1/2 text-gold-dark opacity-60">❦</span>
        </div>
        <div className="flex items-center justify-center gap-4 mt-2">
          <div className="h-px w-20 bg-gradient-to-r from-transparent to-crimson/40" />
          <span className="text-crimson/60 text-sm">✦</span>
          <div className="h-px w-20 bg-gradient-to-l from-transparent to-crimson/40" />
        </div>
      </div>
      
      {/* Victorian wooden bookshelf */}
      <div className="relative">
        {/* Shelf back - rich mahogany */}
        <div 
          className="absolute inset-0 rounded-lg"
          style={{ 
            background: 'linear-gradient(180deg, #4a2c1a 0%, #3d2517 30%, #2a1810 70%, #1a0f0a 100%)',
            boxShadow: 'inset 0 -20px 40px rgba(0,0,0,0.7), inset 0 10px 20px rgba(255,255,255,0.03)'
          }}
        />
        
        {/* Decorative shelf trim */}
        <div className="absolute top-0 left-0 right-0 h-3 rounded-t-lg" style={{
          background: 'linear-gradient(180deg, #5a3c2a 0%, #4a2c1a 100%)',
          boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
        }}>
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
        </div>
        
        {/* Books container */}
        <div className="relative flex items-end gap-2 p-6 pt-8 pb-4 overflow-x-auto scrollbar-hide" style={{ minHeight: '260px' }}>
          {books.map((book) => (
            <VictorianBook key={book.title} book={book} onSelect={onSelectBook} />
          ))}
        </div>
        
        {/* Shelf front edge - carved wood look */}
        <div className="relative h-6 rounded-b-lg overflow-hidden"
          style={{ 
            background: 'linear-gradient(180deg, #5a3c2a 0%, #4a2c1a 30%, #3d2517 70%, #2a1810 100%)',
            boxShadow: '0 8px 16px rgba(0,0,0,0.5)'
          }}
        >
          {/* Carved pattern */}
          <div className="absolute inset-0 flex items-center justify-center gap-8 opacity-30">
            <span className="text-gold text-xs">❧</span>
            <span className="text-gold text-xs">◆</span>
            <span className="text-gold text-xs">❧</span>
            <span className="text-gold text-xs">◆</span>
            <span className="text-gold text-xs">❧</span>
          </div>
          {/* Wood grain lines */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'repeating-linear-gradient(90deg, transparent 0px, transparent 30px, rgba(212,168,75,0.2) 30px, rgba(212,168,75,0.2) 31px)'
          }} />
        </div>
      </div>
    </div>
    
    {/* Bottom corners */}
    <ArtDecoCorner className="absolute bottom-4 left-4 w-16 h-16 sm:w-20 sm:h-20 -rotate-90" variant="crimson" />
    <ArtDecoCorner className="absolute bottom-4 right-4 w-16 h-16 sm:w-20 sm:h-20 rotate-180" variant="crimson" />
    
    {/* Bottom border */}
    <div className="absolute bottom-0 left-0 right-0">
      <VictorianBorder light />
      <div className="h-1 bg-gradient-to-r from-transparent via-crimson to-transparent" />
    </div>
  </div>
);

// Victorian Bookshelf section - DARK navy version
const VictorianShelfDark = ({ category, books, onSelectBook }) => (
  <div className="relative py-12 sm:py-16 bg-navy-dark">
    {/* Background effects */}
    <div className="absolute inset-0" style={{ 
      background: 'radial-gradient(ellipse at 50% 50%, rgba(26, 45, 77, 0.5) 0%, transparent 70%)' 
    }} />
    
    {/* Subtle Art Deco pattern */}
    <div className="absolute inset-0 opacity-[0.03]" style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0 L35 15 L30 30 L25 15 Z' fill='%23d4a84b'/%3E%3Ccircle cx='30' cy='45' r='5' fill='none' stroke='%23d4a84b' stroke-width='0.5'/%3E%3C/svg%3E")`,
    }} />
    
    {/* Corner ornaments */}
    <ArtDecoCorner className="absolute top-4 left-4 w-16 h-16 sm:w-20 sm:h-20" variant="gold" />
    <ArtDecoCorner className="absolute top-4 right-4 w-16 h-16 sm:w-20 sm:h-20 rotate-90" variant="gold" />
    
    <div className="relative z-10 max-w-5xl mx-auto px-4">
      {/* Category title */}
      <div className="text-center mb-8">
        <div className="inline-block relative">
          <span className="absolute -left-6 top-1/2 -translate-y-1/2 text-gold opacity-60">❦</span>
          <h2 className="font-italiana text-2xl sm:text-3xl text-gold-light px-8" 
              style={{ textShadow: '0 2px 20px rgba(212, 168, 75, 0.5)' }}>
            {category}
          </h2>
          <span className="absolute -right-6 top-1/2 -translate-y-1/2 text-gold opacity-60">❦</span>
        </div>
        <div className="flex items-center justify-center gap-4 mt-2">
          <div className="h-px w-20 bg-gradient-to-r from-transparent to-gold/40" />
          <span className="text-crimson-bright text-sm">◆</span>
          <div className="h-px w-20 bg-gradient-to-l from-transparent to-gold/40" />
        </div>
      </div>
      
      {/* Dark wood bookshelf */}
      <div className="relative">
        {/* Shelf back - ebony/dark oak */}
        <div 
          className="absolute inset-0 rounded-lg"
          style={{ 
            background: 'linear-gradient(180deg, #1a0f0a 0%, #0f0805 50%, #050302 100%)',
            boxShadow: 'inset 0 -20px 40px rgba(0,0,0,0.8), inset 0 10px 20px rgba(212, 168, 75, 0.03)'
          }}
        />
        
        {/* Gold trim */}
        <div className="absolute top-0 left-0 right-0 h-3 rounded-t-lg" style={{
          background: 'linear-gradient(180deg, #2a1810 0%, #1a0f0a 100%)',
        }}>
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
        </div>
        
        {/* Books container */}
        <div className="relative flex items-end gap-2 p-6 pt-8 pb-4 overflow-x-auto scrollbar-hide" style={{ minHeight: '260px' }}>
          {books.map((book) => (
            <VictorianBook key={book.title} book={book} onSelect={onSelectBook} />
          ))}
        </div>
        
        {/* Shelf front edge */}
        <div className="relative h-6 rounded-b-lg overflow-hidden"
          style={{ 
            background: 'linear-gradient(180deg, #2a1810 0%, #1a0f0a 50%, #0f0805 100%)',
            boxShadow: '0 8px 16px rgba(0,0,0,0.7), 0 0 30px rgba(212, 168, 75, 0.05)'
          }}
        >
          {/* Gold inlay pattern */}
          <div className="absolute inset-0 flex items-center justify-center gap-8 opacity-40">
            <span className="text-gold text-xs">❧</span>
            <span className="text-crimson text-xs">◆</span>
            <span className="text-gold text-xs">❧</span>
            <span className="text-crimson text-xs">◆</span>
            <span className="text-gold text-xs">❧</span>
          </div>
        </div>
      </div>
    </div>
    
    {/* Bottom corners */}
    <ArtDecoCorner className="absolute bottom-4 left-4 w-16 h-16 sm:w-20 sm:h-20 -rotate-90" variant="gold" />
    <ArtDecoCorner className="absolute bottom-4 right-4 w-16 h-16 sm:w-20 sm:h-20 rotate-180" variant="gold" />
  </div>
);

// Book detail modal with Victorian styling
const VictorianBookModal = ({ book, onClose }) => {
  const [copied, setCopied] = useState(false);
  
  if (!book) return null;
  
  const getArchetypeColor = (name) => {
    const colors = {
      'Shigg': '#228B22',
      'Cathleen': '#4169E1', 
      'Katherine': '#800020',
      'All': '#d4a84b'
    };
    return colors[name] || '#d4a84b';
  };
  
  const copyLink = () => {
    navigator.clipboard.writeText(book.link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-navy-dark/95 backdrop-blur-md" />
        
        {/* Modal */}
        <motion.div
          className="relative max-w-md w-full overflow-hidden"
          initial={{ scale: 0.8, rotateY: -30, opacity: 0 }}
          animate={{ scale: 1, rotateY: 0, opacity: 1 }}
          exit={{ scale: 0.8, rotateY: 30, opacity: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 200 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Ornate Victorian frame */}
          <div className="absolute -inset-3 border-2 border-gold/50 rounded-lg" />
          <div className="absolute -inset-2 border border-gold/30 rounded-lg" />
          <div className="absolute -inset-1 border border-crimson/20 rounded-lg" />
          
          {/* Corner ornaments */}
          <ArtDecoCorner className="absolute -top-6 -left-6 w-14 h-14" variant="gold" />
          <ArtDecoCorner className="absolute -top-6 -right-6 w-14 h-14 rotate-90" variant="gold" />
          <ArtDecoCorner className="absolute -bottom-6 -left-6 w-14 h-14 -rotate-90" variant="gold" />
          <ArtDecoCorner className="absolute -bottom-6 -right-6 w-14 h-14 rotate-180" variant="gold" />
          
          {/* Book cover header */}
          <div 
            className="p-6 relative overflow-hidden rounded-t-lg"
            style={{ background: `linear-gradient(135deg, ${book.color} 0%, ${book.spine} 100%)` }}
          >
            {/* Decorative pattern */}
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: `radial-gradient(circle at 30% 30%, ${book.accent}40 0%, transparent 50%),
                               radial-gradient(circle at 70% 70%, ${book.accent}30 0%, transparent 50%)`
            }} />
            
            {/* Art Deco top border */}
            <div className="absolute top-0 left-0 right-0 h-2" style={{ backgroundColor: book.accent, opacity: 0.6 }} />
            <div className="absolute top-2 left-4 right-4 h-0.5" style={{ backgroundColor: book.accent, opacity: 0.4 }} />
            
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/40 border border-gold/40 flex items-center justify-center hover:bg-black/60 hover:border-gold/60 transition-all"
            >
              <X className="w-4 h-4 text-gold" />
            </button>
            
            {/* Book icon with Art Deco frame */}
            <motion.div 
              className="w-24 h-24 rounded-lg bg-black/30 border-2 flex items-center justify-center mb-4 mx-auto relative"
              style={{ borderColor: book.accent }}
              initial={{ rotateY: 180 }}
              animate={{ rotateY: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="absolute inset-1 border opacity-50" style={{ borderColor: book.accent }} />
              <BookOpen className="w-12 h-12" style={{ color: book.textColor || '#f5f0e6' }} />
            </motion.div>
            
            {/* Title */}
            <h2 
              className="font-italiana text-xl sm:text-2xl text-center mb-2"
              style={{ color: book.textColor || '#f5f0e6', textShadow: '0 2px 10px rgba(0,0,0,0.7)' }}
            >
              {book.title}
            </h2>
            
            {/* Author */}
            <p 
              className="font-crimson text-center italic"
              style={{ color: book.textColor || '#f5f0e6', opacity: 0.9 }}
            >
              by {book.author}
            </p>
            
            {/* Bottom decorative border */}
            <div className="absolute bottom-0 left-4 right-4 h-0.5" style={{ backgroundColor: book.accent, opacity: 0.4 }} />
          </div>
          
          {/* Content area - parchment style */}
          <div className="bg-gradient-to-b from-parchment to-parchment-dark p-6 rounded-b-lg relative">
            {/* Subtle Victorian pattern */}
            <div className="absolute inset-0 opacity-[0.02]" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 0 L25 10 L20 20 L15 10 Z' fill='%23722F37'/%3E%3C/svg%3E")`
            }} />
            
            {/* Description */}
            <p className="font-crimson text-navy-dark leading-relaxed mb-5 relative z-10">
              {book.description}
            </p>
            
            {/* Relevant archetypes */}
            <div className="mb-5 relative z-10">
              <span className="font-montserrat text-xs uppercase tracking-wider text-navy-dark/50">Speaks to: </span>
              <div className="flex flex-wrap gap-2 mt-2">
                {book.relevantTo.map((name) => (
                  <span 
                    key={name}
                    className="px-3 py-1 rounded-full text-xs font-cinzel text-white shadow-sm"
                    style={{ backgroundColor: getArchetypeColor(name) }}
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Divider */}
            <ArtDecoDivider light />
            
            {/* Action buttons */}
            <div className="space-y-3 relative z-10">
              {/* Primary: Open link */}
              <a
                href={book.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-gradient-to-r from-crimson-deep via-crimson to-crimson-deep border border-gold/40 text-cream rounded-sm font-cinzel text-sm tracking-wider uppercase hover:from-crimson hover:via-crimson-bright hover:to-crimson transition-all shadow-lg"
              >
                <ExternalLink className="w-4 h-4" />
                Find This Book
              </a>
              
              {/* Secondary: Copy link */}
              <button
                onClick={copyLink}
                className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-parchment border border-gold/40 text-navy-dark rounded-sm font-montserrat text-xs tracking-wider uppercase hover:bg-gold/10 transition-all"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="text-green-600">Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy Link to Share
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const Library = () => {
  const [selectedBook, setSelectedBook] = useState(null);
  const categories = Object.entries(LIBRARY_BOOKS);
  
  return (
    <div className="min-h-screen">
      {/* ===== DARK HEADER SECTION ===== */}
      <div className="relative py-14 sm:py-20 bg-navy-dark overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'url(/images/brand/profile-frame.png)',
          backgroundSize: 'cover', backgroundPosition: 'center',
        }} />
        
        {/* Art Deco radial glow */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at 50% 30%, rgba(184, 35, 48, 0.15) 0%, transparent 50%)'
        }} />
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at 50% 70%, rgba(212, 168, 75, 0.1) 0%, transparent 40%)'
        }} />
        
        {/* Corner ornaments */}
        <ArtDecoCorner className="absolute top-4 left-4 w-20 h-20 sm:w-24 sm:h-24" variant="gold" />
        <ArtDecoCorner className="absolute top-4 right-4 w-20 h-20 sm:w-24 sm:h-24 rotate-90" variant="gold" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          {/* Decorative top element */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="flex items-center justify-center gap-4">
              <span className="text-gold/60 text-2xl">❦</span>
              <img src="/icons/ui/gold/icon-library-books.png" alt="Library" className="w-16 h-16 sm:w-20 sm:h-20 mx-auto" />
              <span className="text-gold/60 text-2xl">❦</span>
            </div>
          </motion.div>
          
          {/* Title with Art Deco styling */}
          <motion.h1 
            className="font-italiana text-4xl sm:text-5xl md:text-6xl text-gold-light mb-4"
            style={{ textShadow: '0 4px 30px rgba(212, 168, 75, 0.5)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            The Library
          </motion.h1>
          
          {/* Decorative line */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold/60" />
            <span className="text-crimson-bright">◆</span>
            <span className="text-gold">✦</span>
            <span className="text-crimson-bright">◆</span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold/60" />
          </div>
          
          {/* Subtitle */}
          <motion.p 
            className="font-crimson text-lg sm:text-xl text-cream/85 max-w-2xl mx-auto mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            The books that shaped our practice
          </motion.p>
          
          <motion.p 
            className="font-montserrat text-sm text-silver-mist/60 max-w-xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Hover over any spine to peek, click to explore and find your copy
          </motion.p>
          
          <ArtDecoDivider variant="book" />
          
          {/* Quote */}
          <motion.p 
            className="font-crimson text-sm text-gold/70 max-w-lg mx-auto italic"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            &ldquo;The moving finger writes, and having writ, moves on...&rdquo; 
            <span className="block mt-1 text-xs text-cream/50">&mdash; these books have written on us all</span>
          </motion.p>
        </div>
        
        {/* Bottom decorative border */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-crimson to-transparent" />
      </div>
      
      {/* ===== ALTERNATING BOOKSHELF SECTIONS ===== */}
      {categories.map(([category, books], index) => (
        index % 2 === 0 ? (
          <VictorianShelfLight 
            key={category} 
            category={category} 
            books={books} 
            onSelectBook={setSelectedBook}
          />
        ) : (
          <VictorianShelfDark 
            key={category} 
            category={category} 
            books={books} 
            onSelectBook={setSelectedBook}
          />
        )
      ))}
      
      {/* ===== FOOTER SECTION ===== */}
      <div className="relative py-12 bg-navy-dark">
        <div className="absolute inset-0" style={{ 
          background: 'radial-gradient(ellipse at 50% 0%, rgba(26, 45, 77, 0.5) 0%, transparent 60%)' 
        }} />
        
        <div className="relative z-10 max-w-2xl mx-auto text-center px-4">
          <ArtDecoDivider variant="moon" />
          
          <p className="font-crimson text-base text-cream/70 italic mb-4">
            Each book is a doorway. Each page, a spell waiting to be cast.
          </p>
          
          <div className="flex items-center justify-center gap-4 text-gold/50">
            <span>☽</span>
            <span className="text-crimson/60">❦</span>
            <span></span>
            <span className="text-crimson/60">❦</span>
            <span>☾</span>
          </div>
        </div>
        
        {/* Bottom corners */}
        <ArtDecoCorner className="absolute bottom-4 left-4 w-16 h-16 -rotate-90" variant="gold" />
        <ArtDecoCorner className="absolute bottom-4 right-4 w-16 h-16 rotate-180" variant="gold" />
      </div>
      
      {/* Book detail modal */}
      {selectedBook && (
        <VictorianBookModal book={selectedBook} onClose={() => setSelectedBook(null)} />
      )}
    </div>
  );
};

export default Library;
