import React from 'react';
import BrandIcon from './BrandIcon';

/**
 * ShuffleOracle — Theresa's modern bibliomancy component.
 * Renders in two contexts:
 *   1. Inline in GuidePortal conversation when Theresa generates a bibliomancy_shuffle working
 *   2. In GrimoirePage when viewing a saved bibliomancy_shuffle spell
 * 
 * Same component, same props, two render locations.
 * Each visit is a fresh shuffle — the component does not track previous results.
 */
const ShuffleOracle = ({ block = {} }) => {
  const {
    tradition_bridge,
    library_as_text,
    the_ritual,
    what_to_look_for,
    investigation_prompt,
    attribution_and_anchors,
    title
  } = block;

  return (
    <div 
      data-testid="shuffle-oracle-component"
      className="w-full border border-gold/40 rounded-sm overflow-hidden"
      style={{ backgroundColor: '#0C1D2E' }}
    >
      {/* Header */}
      <div className="p-6 pb-4 border-b border-gold/20">
        <div className="flex items-center gap-3 mb-2">
          <BrandIcon name="crystalBall" size={28} />
          <div>
            <h3 className="font-cinzel text-xl text-gold tracking-wide">
              {title || 'The Shuffle Oracle'}
            </h3>
            <p className="font-montserrat text-xs text-cream/50 tracking-widest uppercase">
              Music as Modern Bibliomancy
            </p>
          </div>
        </div>
      </div>

      {/* THEN / NOW two-column layout */}
      {(tradition_bridge || library_as_text) && (
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* THEN column */}
          <div className="p-4 border border-gold/20 rounded-sm" style={{ backgroundColor: '#0F2438' }}>
            <p className="font-cinzel text-xs text-gold/60 tracking-widest uppercase mb-3">Then</p>
            <p className="font-montserrat text-sm text-cream/85 leading-relaxed">
              {tradition_bridge || 'In ancient Rome, practitioners opened Virgil at random and read whatever line their finger found as counsel. John Cage formalised the same underlying logic in 1951 — using chance operations to bypass the rational mind\'s preference for what it already knows.'}
            </p>
          </div>

          {/* NOW column */}
          <div className="p-4 border border-gold/20 rounded-sm" style={{ backgroundColor: '#0F2438' }}>
            <p className="font-cinzel text-xs text-gold/60 tracking-widest uppercase mb-3">Now</p>
            <p className="font-montserrat text-sm text-cream/85 leading-relaxed">
              {library_as_text || 'Your music library is your sacred text. The songs you\'ve added over years are a record of who you were when you listened. Shuffle is the random witness.'}
            </p>
          </div>
        </div>
      )}

      {/* The Practice — numbered steps */}
      {the_ritual && (
        <div className="px-6 pb-4">
          <p className="font-cinzel text-sm text-gold/80 tracking-wide uppercase mb-3">The Practice</p>
          <div className="p-4 border border-gold/20 rounded-sm" style={{ backgroundColor: '#0F2438' }}>
            <div className="font-montserrat text-sm text-cream/85 leading-relaxed whitespace-pre-line">
              {the_ritual}
            </div>
          </div>
        </div>
      )}

      {/* What to look for */}
      {what_to_look_for && (
        <div className="px-6 pb-4">
          <p className="font-cinzel text-sm text-gold/80 tracking-wide uppercase mb-3">What to Look For</p>
          <div className="p-4 border border-gold/20 rounded-sm" style={{ backgroundColor: '#0F2438' }}>
            <p className="font-montserrat text-sm text-cream/85 leading-relaxed">
              {what_to_look_for}
            </p>
          </div>
        </div>
      )}

      {/* Investigation prompt */}
      {investigation_prompt && (
        <div className="px-6 pb-4">
          <div className="p-4 border-l-2 border-gold/60" style={{ backgroundColor: '#0F2438' }}>
            <div className="flex items-start gap-2">
              <BrandIcon name="magnifyingGlass" size={16} className="mt-1 flex-shrink-0" />
              <p className="font-montserrat text-sm text-cream italic leading-relaxed">
                {investigation_prompt}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Attribution and context anchors */}
      {attribution_and_anchors && (
        <div className="px-6 pb-6">
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-gold/10 border border-gold/20 rounded-sm text-xs font-montserrat text-cream/60">
              <BrandIcon name="skull" size={10} />
              John Cage and aleatoric music, 1951
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-gold/10 border border-gold/20 rounded-sm text-xs font-montserrat text-cream/60">
              <BrandIcon name="skull" size={10} />
              Surrealist automatism, 1924
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-gold/10 border border-gold/20 rounded-sm text-xs font-montserrat text-cream/60">
              <BrandIcon name="skull" size={10} />
              The sortes tradition: Rome to the Renaissance
            </span>
          </div>
          <p className="font-montserrat text-xs text-cream/40 mt-3 italic">
            {attribution_and_anchors}
          </p>
        </div>
      )}
    </div>
  );
};

export default ShuffleOracle;
