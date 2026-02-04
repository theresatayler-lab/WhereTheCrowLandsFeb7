import React from 'react';
import { Wand2 } from 'lucide-react';

const HandcraftedBanner = ({ onClick }) => {
  return (
    <div className="flex justify-end mb-4">
      <button
        onClick={onClick}
        className="group flex items-center gap-2 px-4 py-2.5 bg-stone-800/90 hover:bg-stone-700 border border-amber-600/40 hover:border-amber-500 rounded-full shadow-md hover:shadow-lg transition-all duration-300"
        data-testid="handcrafted-banner"
      >
        <div className="w-7 h-7 rounded-full bg-amber-600/20 border border-amber-500/40 flex items-center justify-center group-hover:bg-amber-600/30 transition-colors">
          <Wand2 size={14} className="text-amber-400" />
        </div>
        <span className="text-amber-100/90 text-sm font-medium">
          Prefer handcrafted?
        </span>
        <span className="text-amber-500/70 text-xs group-hover:text-amber-400 transition-colors">
          →
        </span>
      </button>
    </div>
  );
};

export default HandcraftedBanner;
