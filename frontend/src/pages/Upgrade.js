import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Loader2 } from 'lucide-react';
import { BrandIcon } from '../components/BrandIcon';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import axios from 'axios';
import { 
  DarkSection, LightSection, GrandDivider, MysticalDivider, 
  LightOrnateCard, PageBorderFrame, SectionDivider, ATMOSPHERIC_IMAGES 
} from '../components/OrnateElements';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const Upgrade = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please log in to upgrade');
      navigate('/auth');
      return;
    }

    setLoading(true);
    try {
      const originUrl = window.location.origin;
      const response = await axios.post(
        `${BACKEND_URL}/api/stripe/create-checkout`,
        { origin_url: originUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      window.location.href = response.data.checkout_url;
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to start checkout. Please try again.');
      setLoading(false);
    }
  };

  return (
    <PageBorderFrame>
      <div className="min-h-screen">
        {/* Dark Hero Section */}
        <DarkSection className="py-12 sm:py-16 md:py-20 px-4 sm:px-6" variant="warm">
          <div className="max-w-4xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <div className="relative inline-block mb-6">
              <BrandIcon name="sparkles" size={56} variant="pink" className="mx-auto"
                style={{ filter: 'drop-shadow(0 0 15px rgba(185, 78, 106, 0.5))' }} />
            </div>
            
            <h1 className="font-italiana text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-gold-light mb-3"
              style={{ textShadow: '0 2px 30px rgba(200, 164, 77, 0.5)' }}>
              Unlock the Full Grimoire
            </h1>
            <p className="font-montserrat text-sm sm:text-base text-muted-brass/80 max-w-2xl mx-auto">
              Get unlimited access to spell generation, save your rituals forever, and unlock premium features
            </p>
          </motion.div>
          
          <GrandDivider variant="sparkle" />
        </div>
      </DarkSection>

      {/* Light Parchment Section */}
      <LightSection 
        className="py-10 sm:py-14 px-4 sm:px-6"
        atmosphericImage={ATMOSPHERIC_IMAGES.florals}
        atmosphericOpacity={0.10}
        atmosphericPosition="right top"
        atmosphericTint="sepia"
      >
        <div className="max-w-5xl mx-auto">
          <MysticalDivider light />

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            {/* Free Tier */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <LightOrnateCard hover={false} className="h-full">
                <div className="mb-6">
                  <h3 className="font-cinzel text-2xl text-navy-dark mb-2">Free</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="font-italiana text-4xl text-crimson">$0</span>
                    <span className="font-montserrat text-sm text-navy-dark/60">forever</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-crimson flex-shrink-0 mt-0.5" />
                    <span className="font-montserrat text-sm text-navy-dark">Generate up to 3 spells per month</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-crimson flex-shrink-0 mt-0.5" />
                    <span className="font-montserrat text-sm text-navy-dark">All guides available</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-crimson flex-shrink-0 mt-0.5" />
                    <span className="font-montserrat text-sm text-navy-dark">View spells with full details</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <X className="w-5 h-5 text-navy-dark/40 flex-shrink-0 mt-0.5" />
                    <span className="font-montserrat text-sm text-navy-dark/60">Cannot save to grimoire</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <X className="w-5 h-5 text-navy-dark/40 flex-shrink-0 mt-0.5" />
                    <span className="font-montserrat text-sm text-navy-dark/60">Cannot download PDFs</span>
                  </li>
                </ul>

                <Link
                  to="/spell-request"
                  className="block w-full text-center px-6 py-3 bg-navy-dark/10 text-navy-dark border border-gold/40 rounded-sm font-montserrat tracking-widest uppercase text-xs hover:bg-navy-dark/20 transition-all"
                >
                  Current Plan
                </Link>
              </LightOrnateCard>
            </motion.div>

            {/* Pro Tier */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="relative"
            >
              {/* Best Value Badge */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 px-4 py-1 bg-crimson text-cream rounded-sm border border-gold/50">
                <span className="font-montserrat text-xs tracking-widest uppercase flex items-center gap-1">
                  <BrandIcon name="eightstar" size={12} className="inline-block" /> Best Value
                </span>
              </div>
              
              <div className="relative h-full">
                <div className="absolute inset-0 border-2 border-crimson/60 rounded-lg" />
                <div className="absolute inset-1.5 border border-gold/40 rounded-md" />
                <div className="absolute inset-0 bg-gradient-to-br from-cream via-white to-cream/90 rounded-lg" />
                
                <div className="relative z-10 p-6">
                  <div className="mb-6">
                    <h3 className="font-cinzel text-2xl text-crimson mb-2">Pro</h3>
                    <div className="flex items-baseline gap-2">
                      <span className="font-italiana text-4xl text-crimson">$19</span>
                      <span className="font-montserrat text-sm text-navy-dark/60">per year</span>
                    </div>
                    <p className="font-montserrat text-xs text-gold-dark mt-1">Less than $2/month!</p>
                  </div>

                  <ul className="space-y-3 mb-8">
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-crimson flex-shrink-0 mt-0.5" />
                      <span className="font-montserrat text-sm text-navy-dark font-medium">Unlimited spell generation</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-crimson flex-shrink-0 mt-0.5" />
                      <span className="font-montserrat text-sm text-navy-dark font-medium">Save unlimited spells to grimoire</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-crimson flex-shrink-0 mt-0.5" />
                      <span className="font-montserrat text-sm text-navy-dark font-medium">Download PDFs of your spells</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-crimson flex-shrink-0 mt-0.5" />
                      <span className="font-montserrat text-sm text-navy-dark font-medium">Access to all guides</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-crimson flex-shrink-0 mt-0.5" />
                      <span className="font-montserrat text-sm text-navy-dark font-medium">Priority support</span>
                    </li>
                  </ul>

                  <button
                    onClick={handleUpgrade}
                    disabled={loading}
                    className="w-full px-6 py-3 relative overflow-hidden rounded-sm font-montserrat tracking-widest uppercase text-sm disabled:opacity-50"
                  >
                    <span className="absolute inset-0 border border-gold/50 rounded-sm" />
                    <span className="absolute inset-0.5 bg-gradient-to-r from-crimson-deep via-crimson to-crimson-deep rounded-sm" />
                    <span className="relative text-cream flex items-center justify-center gap-2">
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Redirecting...
                        </>
                      ) : (
                        <>
                          <BrandIcon name="sparkles" size={20} className="inline-block" />
                          Upgrade to Pro - $19/Year
                        </>
                      )}
                    </span>
                  </button>
                  <p className="text-center font-montserrat text-xs text-navy-dark/50 mt-3">
                    Secure checkout powered by Stripe
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          <SectionDivider variant="stars" />

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid md:grid-cols-3 gap-6 mt-8"
          >
            <LightOrnateCard hover={false} className="text-center">
              <BrandIcon name="sparkles" size={40} className="mx-auto mb-4" />
              <h4 className="font-cinzel text-lg text-crimson mb-2">Unlimited Spells</h4>
              <p className="font-montserrat text-sm text-navy-dark/70">
                Generate as many rituals as you need, whenever inspiration strikes
              </p>
            </LightOrnateCard>

            <LightOrnateCard hover={false} className="text-center">
              <BrandIcon name="grimoire" size={40} className="mx-auto mb-4" />
              <h4 className="font-cinzel text-lg text-crimson mb-2">Your Grimoire</h4>
              <p className="font-montserrat text-sm text-navy-dark/70">
                Save and organize your spells in your personal grimoire forever
              </p>
            </LightOrnateCard>

            <LightOrnateCard hover={false} className="text-center">
              <BrandIcon name="saveBook" size={40} className="mx-auto mb-4" />
              <h4 className="font-cinzel text-lg text-crimson mb-2">PDF Export</h4>
              <p className="font-montserrat text-sm text-navy-dark/70">
                Download beautiful PDFs of your spells for offline use
              </p>
            </LightOrnateCard>
          </motion.div>
        </div>
      </LightSection>
    </div>
    </PageBorderFrame>
  );
};
