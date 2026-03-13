import React from 'react';
import { motion } from 'framer-motion';
import { BrandIcon } from './BrandIcon';
import { Link } from 'react-router-dom';

export const UpgradePrompt = ({ feature, message, compact = false }) => {
  if (compact) {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/30 rounded-sm">
        <BrandIcon name="key" size={12} className="inline-block" />
        <span className="font-montserrat text-xs text-primary">Pro Feature</span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-primary/5 border-2 border-primary/30 rounded-sm p-6 text-center">
      <BrandIcon name="key" size={48} className="mx-auto mb-3" />
      <h3 className="font-cinzel text-xl text-secondary mb-2">
        {feature || 'Premium Feature'}
      </h3>
      <p className="font-montserrat text-sm text-foreground mb-4">
        {message || 'Upgrade to Pro to unlock this feature'}
      </p>
      <Link
        to="/upgrade"
        className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-sm font-montserrat tracking-widest uppercase text-sm hover:bg-primary/90 transition-all">
        <BrandIcon name="sparkles" size={16} className="inline-block" />
        Upgrade to Pro - $19/year
      </Link>
    </motion.div>
  );
};

export const SpellLimitBanner = ({ remaining, total }) => {
  const limit = total; // Support both prop names
  
  if (remaining === -1) return null; // Paid user
  if (remaining === undefined || limit === undefined) return null; // Data not loaded yet
  
  const percentage = (remaining / limit) * 100;
  const isLow = remaining <= 1;
  const isEmpty = remaining === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`mb-6 p-4 rounded-sm border-2 ${
        isEmpty
          ? 'bg-crimson/15 border-crimson/50'
          : isLow
            ? 'bg-destructive/10 border-destructive/30'
            : 'bg-primary/5 border-primary/30'
      }`}>
      
      {isEmpty ? (
        // No spells remaining - show prominent upgrade CTA
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <BrandIcon name="key" size={20} className="inline-block" />
            <span className="font-cinzel text-lg text-crimson font-semibold">
              No Free Spells Remaining
            </span>
          </div>
          <p className="font-montserrat text-sm text-navy-dark/70 mb-4">
            You&apos;ve used all {limit} free spells. Upgrade to Pro for unlimited spell crafting!
          </p>
          <Link
            to="/upgrade"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-crimson-deep via-crimson to-crimson-deep text-cream rounded-sm font-montserrat tracking-widest uppercase text-xs hover:from-crimson hover:via-crimson-bright hover:to-crimson transition-all border border-gold/30"
          >
            <BrandIcon name="sparkles" size={16} className="inline-block" />
            Upgrade to Pro - $19/year
          </Link>
        </div>
      ) : (
        // Has spells remaining - show progress bar
        <>
          <div className="flex items-center justify-between mb-2">
            <span className="font-montserrat text-sm font-medium">
              {remaining} of {limit} free spells remaining
            </span>
            <Link
              to="/upgrade"
              className="font-montserrat text-xs text-primary hover:underline">
              Upgrade →
            </Link>
          </div>
          <div className="w-full h-2 bg-muted/30 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ${
                isLow ? 'bg-destructive' : 'bg-primary'
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>
          {isLow && (
            <p className="font-montserrat text-xs text-destructive mt-2">
              You&apos;re almost out of free spells! Upgrade for unlimited access.
            </p>
          )}
        </>
      )}
    </motion.div>
  );
};