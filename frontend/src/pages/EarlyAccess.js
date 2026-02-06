import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { toast } from 'sonner';

const API_URL = process.env.REACT_APP_BACKEND_URL;

// Simple corner ornament
const Corner = ({ className }) => (
  <svg viewBox="0 0 60 60" className={className} fill="none">
    <path d="M0,30 Q0,0 30,0" stroke="#d4a84b" strokeWidth="1.5" opacity="0.7" />
    <path d="M0,20 Q0,0 20,0" stroke="#d4a84b" strokeWidth="1" opacity="0.4" />
    <polygon points="8,8 11,4 14,8 11,12" fill="#b82330" opacity="0.8" />
  </svg>
);

// Minimal divider
const Divider = () => (
  <div className="flex items-center justify-center gap-2 py-2">
    <div className="h-px w-8 bg-gradient-to-r from-transparent to-gold/40" />
    <span className="text-crimson text-xs">◆</span>
    <span className="text-gold text-sm">☽</span>
    <span className="text-crimson text-xs">◆</span>
    <div className="h-px w-8 bg-gradient-to-l from-transparent to-gold/40" />
  </div>
);

const EarlyAccessPage = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Please enter your email address');
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/api/waitlist/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), name: name.trim() || null, source: 'early_access_landing' })
      });
      if (response.ok) {
        setIsSubmitted(true);
        toast.success('Welcome to the Murder!');
      } else {
        const data = await response.json();
        if (data.detail?.includes('already')) {
          toast.info('You\'re already part of the Murder!');
          setIsSubmitted(true);
        } else {
          throw new Error(data.detail || 'Failed to join');
        }
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0e1629 0%, #121d33 50%, #0e1629 100%)' }}>
      
      {/* Subtle background */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: 'url(/images/brand/profile-frame.png)',
        backgroundSize: 'cover', backgroundPosition: 'center',
      }} />
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at 50% 30%, rgba(184, 35, 48, 0.08) 0%, transparent 50%)',
      }} />
      
      {/* Corner ornaments */}
      <Corner className="absolute top-3 left-3 w-12 h-12 sm:w-16 sm:h-16" />
      <Corner className="absolute top-3 right-3 w-12 h-12 sm:w-16 sm:h-16 rotate-90" />
      <Corner className="absolute bottom-3 left-3 w-12 h-12 sm:w-16 sm:h-16 -rotate-90" />
      <Corner className="absolute bottom-3 right-3 w-12 h-12 sm:w-16 sm:h-16 rotate-180" />
      
      {/* Main content */}
      <motion.div 
        className="relative z-10 w-full max-w-xl text-center"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Logo */}
        <img 
          src="/images/brand/logo-alt.png"
          alt="Where The Crowlands"
          className="w-24 h-24 sm:w-28 sm:h-28 mx-auto mb-3 object-contain"
          style={{ filter: 'brightness(1.3) drop-shadow(0 0 20px rgba(212, 168, 75, 0.4))' }}
        />
        
        {/* Title */}
        <h1 className="font-italiana text-2xl sm:text-3xl md:text-4xl text-gold-light mb-2"
          style={{ textShadow: '0 2px 15px rgba(212, 168, 75, 0.5)' }}>
          Where The Crowlands
        </h1>
        
        {/* Subhead */}
        <p className="font-cinzel text-sm sm:text-base text-cream/80 mb-3 italic">
          A place where magic and science aren't such strange bedfellows
        </p>
        
        <Divider />
        
        {/* Main intro text */}
        <p className="font-crimson text-sm sm:text-base text-cream/90 leading-relaxed mb-4 px-2">
          Where the Crowlands is a toolkit for alchemizing what you already hold. Rooted in history; from the Huguenot mystics fleeing persecution, Jersey witches shaping weather and fate, Irish and Celtic keepers of forbidden knowledge, to London's table-tappers and spiritualists revealing the hidden world. The stoicism of WWII echoes of Churchill-influenced resolve, and the hard-won wisdom of London's East End, where "Loose lips sink ships" wasn't just a slogan; it was a way of living.
        </p>
        
        {/* Sign-up form */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative mb-5"
        >
          <div className="absolute inset-0 border border-gold/40 rounded-sm" />
          <div className="absolute inset-0 bg-navy-mid/60 backdrop-blur-sm rounded-sm" />
          
          <div className="relative z-10 p-4 sm:p-5">
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full bg-navy-dark/50 border border-gold/30 focus:border-gold/60 rounded-sm px-3 py-2.5 text-cream text-sm font-montserrat placeholder:text-silver-mist/40"
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email *"
                    required
                    className="w-full bg-navy-dark/50 border border-gold/30 focus:border-gold/60 rounded-sm px-3 py-2.5 text-cream text-sm font-montserrat placeholder:text-silver-mist/40"
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 relative overflow-hidden rounded-sm font-cinzel tracking-wider uppercase text-sm disabled:opacity-50"
                >
                  <span className="absolute inset-0 border border-gold/60 rounded-sm" />
                  <span className="absolute inset-0.5 bg-gradient-to-r from-crimson-deep via-crimson to-crimson-deep rounded-sm" />
                  <span className="relative text-cream flex items-center justify-center gap-2">
                    {isSubmitting ? (
                      <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}>✧</motion.span>
                    ) : (
                      <>
                        <span className="text-gold text-xs">☽</span>
                        SO IT IS
                        <span className="text-gold text-xs">☾</span>
                      </>
                    )}
                  </span>
                </button>
                
                <p className="font-montserrat text-xs text-silver-mist/50">
                  No spam. Only magic.
                </p>
              </form>
            ) : (
              <motion.div className="py-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Check className="w-10 h-10 text-gold mx-auto mb-2" />
                <p className="font-cinzel text-base text-gold">Welcome to the Murder 🐦‍⬛</p>
                <p className="font-montserrat text-sm text-silver-mist/70 mt-1">You're part of the flock now.</p>
              </motion.div>
            )}
          </div>
        </motion.div>
        
        {/* Secondary text */}
        <div className="space-y-4 px-2">
          <p className="font-crimson text-sm sm:text-base text-cream/80 leading-relaxed">
            The magic we've abandoned isn't "woo woo"—it's intention, craft, commitment, and ritual. Whether our ancestors named it or not, that power is still yours to work with. Inspired by real people—my family—and grounded in plenty of creative lore and imagination, Where the Crowlands offers a fun, practical way to bring alchemy, magic, and beauty into your life.
          </p>
          <p className="font-crimson text-sm sm:text-base text-gold/70 italic leading-relaxed">
            While rooted primarily in British history and mysticism, we plan to expand, honouring all cultures—every tradition has drawn from what lies beneath the veil. It's time to bring a little magic back.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default EarlyAccessPage;
