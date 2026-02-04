import React from 'react';
import { Wand2, Sparkles } from 'lucide-react';

const HandcraftedBanner = ({ onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="mb-6 relative overflow-hidden cursor-pointer group"
      data-testid="handcrafted-banner"
    >
      {/* Main banner container with dark rich background */}
      <div className="relative bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 border-2 border-amber-600/60 rounded-lg p-5 shadow-lg hover:shadow-xl hover:border-amber-500 transition-all duration-300">
        
        {/* Decorative corner accents */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-amber-500/80 rounded-tl-lg" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-amber-500/80 rounded-tr-lg" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-amber-500/80 rounded-bl-lg" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-amber-500/80 rounded-br-lg" />
        
        {/* Subtle sparkle decoration */}
        <Sparkles className="absolute top-3 right-12 w-4 h-4 text-amber-500/40" />
        <Sparkles className="absolute bottom-3 left-12 w-3 h-3 text-amber-500/30" />
        
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Icon with glow effect */}
            <div className="w-12 h-12 rounded-full bg-amber-600/20 border border-amber-500/50 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-600/30 group-hover:scale-110 transition-all duration-300 shadow-[0_0_15px_rgba(217,119,6,0.3)]">
              <Wand2 size={22} className="text-amber-400" />
            </div>
            
            <div>
              <p className="text-amber-100 font-semibold text-base tracking-wide">
                Prefer handcrafted magic?
              </p>
              <p className="text-stone-400 text-sm mt-1">
                Skip the AI — get a hand-delivered grimoire or bespoke spell
              </p>
            </div>
          </div>
          
          {/* CTA button-like element */}
          <div className="flex-shrink-0 px-4 py-2 bg-amber-600/20 border border-amber-500/50 rounded-md group-hover:bg-amber-600/40 group-hover:border-amber-400 transition-all duration-300">
            <span className="text-amber-300 text-sm font-medium whitespace-nowrap group-hover:text-amber-200">
              Learn more →
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HandcraftedBanner;
