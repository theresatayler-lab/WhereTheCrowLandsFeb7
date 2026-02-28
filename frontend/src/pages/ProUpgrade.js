import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const API_URL = process.env.REACT_APP_BACKEND_URL;

// Package display configuration
const PACKAGE_DISPLAY = {
  pro_monthly: {
    icon: '/icons/anchors/gold/anchor-crown.png',
    highlight: false,
    badge: null
  },
  pro_yearly: {
    icon: '/icons/anchors/gold/anchor-crown.png',
    highlight: true,
    badge: 'BEST VALUE'
  },
  single_spell: {
    icon: '/icons/anchors/gold/anchor-crystal.png',
    highlight: false,
    badge: null
  },
  spell_pack_5: {
    icon: '/icons/anchors/gold/anchor-crystal.png',
    highlight: true,
    badge: 'SAVE $5'
  },
  printed_grimoire: {
    icon: '/icons/ui/gold/icon-library-books.png',
    highlight: false,
    badge: 'PHYSICAL'
  },
  tarot_deck: {
    icon: '/icons/anchors/gold/anchor-cards.png',
    highlight: false,
    badge: 'PHYSICAL'
  }
};

export default function ProUpgrade() {
  const [packages, setPackages] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processingPackage, setProcessingPackage] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get user from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // Fetch packages
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await fetch(`${API_URL}/api/pro/packages`);
      const data = await response.json();
      setPackages(data);
    } catch (error) {
      console.error('Error fetching packages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async (packageId) => {
    if (!user) {
      // Redirect to login with return URL
      navigate('/auth?returnTo=/pro');
      return;
    }

    setProcessingPackage(packageId);

    try {
      const originUrl = window.location.origin;
      
      const response = await fetch(`${API_URL}/api/pro/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          package_id: packageId,
          email: user.email,
          user_id: user.id,
          success_url: `${originUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${originUrl}/pro`
        })
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.detail || 'Failed to create checkout');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Payment error. Please try again.');
    } finally {
      setProcessingPackage(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-dark flex items-center justify-center">
        <div className="text-gold font-cinzel">Loading...</div>
      </div>
    );
  }

  const subscriptions = packages?.categories?.subscriptions || [];
  const spellCredits = packages?.categories?.spell_credits || [];
  const physical = packages?.categories?.physical || [];

  return (
    <div className="min-h-screen bg-navy-dark py-12 px-4" data-testid="pro-upgrade-page">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="font-cinzel text-4xl md:text-5xl text-gold mb-4">
            Unlock the Full Grimoire
          </h1>
          <p className="font-crimson text-xl text-cream/80 max-w-2xl mx-auto">
            Choose your path to deeper magic. PRO members enjoy unlimited spell creation, 
            exclusive guides, and the ability to build their personal grimoire.
          </p>
        </motion.div>

        {/* PRO Subscriptions */}
        <section className="mb-16">
          <h2 className="font-cinzel text-2xl text-gold mb-6 text-center">PRO Membership</h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {subscriptions.map((pkgId) => {
              const pkg = packages.packages[pkgId];
              const display = PACKAGE_DISPLAY[pkgId];
              return (
                <PackageCard
                  key={pkgId}
                  packageId={pkgId}
                  pkg={pkg}
                  display={display}
                  processing={processingPackage === pkgId}
                  onCheckout={() => handleCheckout(pkgId)}
                />
              );
            })}
          </div>
        </section>

        {/* Spell Credits */}
        <section className="mb-16">
          <h2 className="font-cinzel text-2xl text-gold mb-6 text-center">Spell Credits</h2>
          <p className="font-crimson text-cream/70 text-center mb-6">
            Not ready for a subscription? Purchase individual spell generations.
          </p>
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {spellCredits.map((pkgId) => {
              const pkg = packages.packages[pkgId];
              const display = PACKAGE_DISPLAY[pkgId];
              return (
                <PackageCard
                  key={pkgId}
                  packageId={pkgId}
                  pkg={pkg}
                  display={display}
                  processing={processingPackage === pkgId}
                  onCheckout={() => handleCheckout(pkgId)}
                />
              );
            })}
          </div>
        </section>

        {/* Physical Products */}
        <section>
          <h2 className="font-cinzel text-2xl text-gold mb-6 text-center">Physical Treasures</h2>
          <p className="font-crimson text-cream/70 text-center mb-6">
            Bring your digital grimoire into the physical world.
          </p>
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {physical.map((pkgId) => {
              const pkg = packages.packages[pkgId];
              const display = PACKAGE_DISPLAY[pkgId];
              return (
                <PackageCard
                  key={pkgId}
                  packageId={pkgId}
                  pkg={pkg}
                  display={display}
                  processing={processingPackage === pkgId}
                  onCheckout={() => handleCheckout(pkgId)}
                />
              );
            })}
          </div>
        </section>

        {/* Already PRO? */}
        {user?.subscription_tier === 'pro' && (
          <div className="mt-12 text-center p-6 bg-gold/10 rounded-xl border border-gold/30">
            <p className="font-cinzel text-gold text-lg">
              ✨ You're already a PRO member! ✨
            </p>
            <p className="font-crimson text-cream/70 mt-2">
              Thank you for your support. Your magic knows no bounds.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function PackageCard({ packageId, pkg, display, processing, onCheckout }) {
  const price = (pkg.amount / 100).toFixed(2);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative p-6 rounded-2xl transition-all duration-300 ${
        display?.highlight 
          ? 'bg-gradient-to-br from-gold/20 to-ember/20 border-2 border-gold/50' 
          : 'bg-navy-light/50 border border-gold/20 hover:border-gold/40'
      }`}
      data-testid={`package-card-${packageId}`}
    >
      {/* Badge */}
      {display?.badge && (
        <div className="absolute -top-3 right-4 bg-ember text-cream text-xs font-montserrat font-bold px-3 py-1 rounded-full">
          {display.badge}
        </div>
      )}

      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="flex-shrink-0">
          <img 
            src={display?.icon || '/icons/anchors/gold/anchor-crown.png'} 
            alt="" 
            className="w-12 h-12 opacity-80"
          />
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3 className="font-cinzel text-xl text-cream mb-1">{pkg.name}</h3>
          <p className="font-crimson text-cream/70 text-sm mb-4">{pkg.description}</p>
          
          <div className="flex items-end justify-between">
            <div>
              <span className="font-cinzel text-3xl text-gold">${price}</span>
              {packageId.includes('monthly') && (
                <span className="font-crimson text-cream/50 ml-1">/month</span>
              )}
              {packageId.includes('yearly') && (
                <span className="font-crimson text-cream/50 ml-1">/year</span>
              )}
            </div>
            
            <button
              onClick={onCheckout}
              disabled={processing}
              className={`font-cinzel text-sm px-6 py-2 rounded-lg transition-all ${
                processing
                  ? 'bg-gold/30 text-cream/50 cursor-wait'
                  : 'bg-gold text-navy-dark hover:bg-gold/90'
              }`}
              data-testid={`checkout-btn-${packageId}`}
            >
              {processing ? 'Processing...' : 'Choose'}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
