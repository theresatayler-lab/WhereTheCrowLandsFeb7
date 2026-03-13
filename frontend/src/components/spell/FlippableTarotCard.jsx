import React, { useState } from "react";
import { motion } from "framer-motion";

/**
 * FlippableTarotCard - A card that flips between illustration and quick spell
 * Front: Tarot card illustration
 * Back: Quick spell summary in tarot card style
 */
export default function FlippableTarotCard({
  tarotImageUrl,
  title,
  essence,
  keyAction,
  timing,
  guideName,
  symbolIcon,
  size = "medium", // "small", "medium", "large"
  onFlip,
}) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    if (onFlip) onFlip(!isFlipped);
  };

  const sizeClasses = {
    small: "w-40 sm:w-48",
    medium: "w-52 sm:w-64",
    large: "w-64 sm:w-80",
  };

  return (
    <div 
      className={`${sizeClasses[size]} cursor-pointer`}
      style={{ perspective: "1000px" }}
      onClick={handleFlip}
    >
      <motion.div
        className="relative w-full"
        style={{ 
          transformStyle: "preserve-3d",
          aspectRatio: "2.5/4",
        }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        {/* === FRONT: Tarot Illustration === */}
        <div
          className="absolute inset-0 rounded-lg overflow-hidden"
          style={{ 
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          <div 
            className="w-full h-full"
            style={{
              background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)",
              border: "3px solid #c8a44d",
              borderRadius: "8px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.4), inset 0 0 20px rgba(200,164,77,0.1)",
            }}
          >
            {tarotImageUrl ? (
              <img 
                src={tarotImageUrl}
                alt={title || "Tarot Card"}
                className="w-full h-full object-cover"
              />
            ) : (
              /* Fallback design */
              <div className="w-full h-full flex flex-col items-center justify-center p-4">
                <img 
                  src="/images/frames/crowlands-tarot-card.png"
                  alt=""
                  className="w-full h-full object-contain"
                />
              </div>
            )}
          </div>
          
          {/* Flip indicator */}
          <div className="absolute bottom-2 right-2 bg-black/50 text-amber-200 text-xs px-2 py-1 rounded">
            Tap to flip
          </div>
        </div>

        {/* === BACK: Quick Spell Summary === */}
        <div
          className="absolute inset-0 rounded-lg overflow-hidden"
          style={{ 
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <div 
            className="w-full h-full p-4 flex flex-col"
            style={{
              background: "linear-gradient(180deg, #F5F0E6 0%, #E8E0D0 100%)",
              border: "3px solid #1a1a2e",
              borderRadius: "8px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
            }}
          >
            {/* Decorative top */}
            <div className="flex justify-center mb-2">
              <img 
                src="/icons/anchors/gold/anchor-bird.png"
                alt=""
                className="w-8 h-8 opacity-70"
              />
            </div>

            {/* Title */}
            <h3 className="font-cinzel text-sm sm:text-base text-amber-900 text-center leading-tight mb-2">
              {title || "Your Spell"}
            </h3>

            {/* Divider */}
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="h-px w-8 bg-amber-800/40" />
              <div className="w-1 h-1 bg-amber-800/40 rotate-45" />
              <div className="h-px w-8 bg-amber-800/40" />
            </div>

            {/* Essence */}
            {essence && (
              <p className="font-crimson text-xs sm:text-sm text-navy-dark/80 italic text-center mb-3 leading-relaxed flex-shrink-0">
                "{essence}"
              </p>
            )}

            {/* Key Info */}
            <div className="flex-1 flex flex-col justify-center space-y-2">
              {keyAction && (
                <div className="text-center">
                  <span className="font-montserrat text-[10px] text-amber-800/60 uppercase tracking-wider block">
                    Key Action
                  </span>
                  <span className="font-crimson text-xs text-navy-dark">
                    {keyAction}
                  </span>
                </div>
              )}
              {timing && (
                <div className="text-center">
                  <span className="font-montserrat text-[10px] text-amber-800/60 uppercase tracking-wider block">
                    Timing
                  </span>
                  <span className="font-crimson text-xs text-navy-dark">
                    {timing}
                  </span>
                </div>
              )}
            </div>

            {/* Guide attribution */}
            {guideName && (
              <div className="mt-auto pt-2 text-center">
                <span className="font-montserrat text-[10px] text-amber-800/50 uppercase tracking-wider">
                  by {guideName}
                </span>
              </div>
            )}

            {/* Decorative bottom */}
            <div className="flex justify-center mt-2">
              <div className="flex items-center gap-1">
                <div className="w-1 h-1 bg-amber-800/30 rotate-45" />
                <div className="w-1.5 h-1.5 bg-amber-800/40 rotate-45" />
                <div className="w-1 h-1 bg-amber-800/30 rotate-45" />
              </div>
            </div>
          </div>
          
          {/* Flip indicator */}
          <div className="absolute bottom-2 right-2 bg-amber-900/50 text-amber-100 text-xs px-2 py-1 rounded">
            Tap for image
          </div>
        </div>
      </motion.div>
    </div>
  );
}
