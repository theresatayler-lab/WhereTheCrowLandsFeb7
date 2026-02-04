import React from 'react';
import { Wand2 } from 'lucide-react';

const HandcraftedBanner = ({ onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="mb-6 p-4 bg-gradient-to-r from-amber-900/20 via-amber-800/10 to-amber-900/20 border border-amber-700/30 rounded-lg cursor-pointer hover:border-amber-600/50 hover:bg-amber-900/25 transition-all group"
      data-testid="handcrafted-banner"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-900/30 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-800/40 transition-colors">
            <Wand2 size={18} className="text-amber-500" />
          </div>
          <div>
            <p className="text-amber-200/90 font-medium text-sm">
              Prefer handcrafted magic?
            </p>
            <p className="text-amber-200/50 text-xs mt-0.5">
              Skip the AI — get a hand-delivered grimoire or bespoke spell
            </p>
          </div>
        </div>
        <span className="text-amber-500/70 text-xs font-medium group-hover:text-amber-400 transition-colors whitespace-nowrap">
          Learn more →
        </span>
      </div>
    </div>
  );
};

export default HandcraftedBanner;
