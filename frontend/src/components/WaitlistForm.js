import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Sparkles, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const WaitlistForm = ({ source = 'homepage' }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${BACKEND_URL}/api/waitlist/join`, {
        email,
        name: name || null,
        source
      });

      if (response.data.already_exists) {
        toast.info('You\'re already on the list!');
      } else {
        toast.success('Welcome to the waitlist! We\'ll notify you at launch.');
      }
      
      setSubmitted(true);
      setEmail('');
      setName('');
    } catch (error) {
      console.error('Waitlist error:', error);
      toast.error('Failed to join waitlist. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card/70 border-2 border-primary/30 rounded-sm p-6 sm:p-8 text-center max-w-md mx-auto"
      >
        <CheckCircle2 className="w-12 h-12 sm:w-16 sm:h-16 text-accent mx-auto mb-4" />
        <h3 className="font-cinzel text-lg sm:text-xl text-secondary mb-2">You&apos;re on the list!</h3>
        <p className="font-montserrat text-sm text-muted-foreground">
          We&apos;ll notify you when we launch. Get ready to reclaim your power.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card/70 border-2 border-primary/30 rounded-sm p-6 sm:p-8 max-w-md mx-auto"
    >
      <div className="text-center mb-6">
        <Mail className="w-10 h-10 sm:w-12 sm:h-12 text-primary mx-auto mb-3" />
        <h3 className="font-cinzel text-lg sm:text-xl text-secondary mb-2">Join the Waitlist</h3>
        <p className="font-montserrat text-sm text-muted-foreground">
          Be the first to know when we launch. Get early access and exclusive updates.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Your name (optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-input/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary/50 rounded-sm px-4 py-3 text-foreground font-montserrat text-sm sm:text-base"
          />
        </div>

        <div>
          <input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-input/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary/50 rounded-sm px-4 py-3 text-foreground font-montserrat text-sm sm:text-base"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-sm font-cinzel tracking-widest uppercase text-sm hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 min-h-[48px]"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
              <span>Joining...</span>
            </>
          ) : (
            <>
              <span className="text-gold">☽</span>
              <span>SO IT IS</span>
              <span className="text-gold">☾</span>
            </>
          )}
        </button>

        <p className="text-center font-montserrat text-xs text-muted-foreground">
          We respect your privacy. No spam, ever.
        </p>
      </form>
    </motion.div>
  );
};
