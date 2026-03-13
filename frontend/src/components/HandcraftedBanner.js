import React from 'react';
import { Wand2 } from 'lucide-react';

const HandcraftedBanner = ({ onClick }) => {
  return (
    <div className="flex justify-end mb-4">
      <button
        onClick={onClick}
        className="group flex items-center gap-2 px-4 py-2.5 bg-navy-mid/90 hover:bg-navy-mid border border-gold/40 hover:border-gold/60 rounded-full shadow-md hover:shadow-lg transition-all duration-300"
        data-testid="handcrafted-banner"
      >
        <div className="w-7 h-7 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center group-hover:bg-gold/30 transition-colors">
          <Wand2 size={14} className="text-gold" />
        </div>
        <span className="text-cream/90 text-sm font-medium">
          Prefer handcrafted?
        </span>
        <span className="text-gold/70 text-xs group-hover:text-gold transition-colors">
          →
        </span>
      </button>
    </div>
  );
};

export default HandcraftedBanner;
