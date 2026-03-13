import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { favoritesAPI, authAPI, subscriptionAPI } from '../utils/api';
import { User, Heart, Mail, Crown, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { 
  DarkSection, LightSection, GrandDivider, MysticalDivider, 
  OrnateCard, LightOrnateCard, CornerFlourish, PageHeader, PageBorderFrame, ATMOSPHERIC_IMAGES 
} from '../components/OrnateElements';
import { useNavigate } from 'react-router-dom';

export const Profile = ({ user }) => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [isChangingEmail, setIsChangingEmail] = useState(false);
  const [emailFormData, setEmailFormData] = useState({ newEmail: '', password: '' });
  const [updatingEmail, setUpdatingEmail] = useState(false);

  useEffect(() => {
    if (user) {
      fetchFavorites();
      fetchSubscriptionStatus();
    }
  }, [user]);

  const fetchFavorites = async () => {
    try {
      const data = await favoritesAPI.getAll();
      setFavorites(data);
    } catch (error) {
      console.error('Failed to fetch favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubscriptionStatus = async () => {
    try {
      const status = await subscriptionAPI.getStatus();
      setSubscriptionStatus(status);
    } catch (error) {
      console.error('Failed to fetch subscription status:', error);
    }
  };

  const handleUpdateEmail = async (e) => {
    e.preventDefault();
    if (!emailFormData.newEmail || !emailFormData.password) {
      toast.error('Please fill in all fields');
      return;
    }
    setUpdatingEmail(true);
    try {
      const updatedUser = await authAPI.updateEmail(emailFormData.newEmail, emailFormData.password);
      const currentUser = JSON.parse(localStorage.getItem('user'));
      currentUser.email = updatedUser.email;
      localStorage.setItem('user', JSON.stringify(currentUser));
      toast.success('Email updated successfully! Please log in again with your new email.');
      setEmailFormData({ newEmail: '', password: '' });
      setIsChangingEmail(false);
      setTimeout(() => window.location.reload(), 2000);
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error('Incorrect password');
      } else if (error.response?.status === 400) {
        toast.error('Email already in use');
      } else {
        toast.error('Failed to update email. Please try again.');
      }
    } finally {
      setUpdatingEmail(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen">
        <DarkSection className="py-20 px-6">
          <div className="max-w-md mx-auto text-center">
            <OrnateCard hover={false}>
              <User className="w-12 h-12 text-gold/50 mx-auto mb-4" />
              <p className="font-montserrat text-muted-brass/80">Please log in to view your profile</p>
              <button
                onClick={() => navigate('/auth')}
                className="mt-6 px-6 py-3 bg-crimson text-cream rounded-sm font-montserrat text-sm hover:bg-crimson/90 transition-colors"
              >
                Log In
              </button>
            </OrnateCard>
          </div>
        </DarkSection>
      </div>
    );
  }

  const isPro = subscriptionStatus?.subscription_tier === 'paid' || subscriptionStatus?.subscription_tier === 'pro';

  return (
    <PageBorderFrame>
      <div className="min-h-screen">
        {/* Dark Hero Section */}
        <DarkSection className="py-12 sm:py-16 md:py-20 px-4 sm:px-6" variant="warm">
          <div className="max-w-4xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            {/* Avatar - Parliament Crow */}
            <div className="relative inline-block mb-6">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-gold/50 shadow-lg">
                <img 
                  src="/images/brand/crow-avatar.png"
                  alt="Parliament Crow Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              {isPro && (
                <div className="absolute -bottom-1 -right-1 bg-gold text-navy-dark p-1.5 rounded-full">
                  <Crown className="w-4 h-4" />
                </div>
              )}
            </div>
            
            <h1 className="font-italiana text-3xl sm:text-4xl md:text-5xl text-gold-light mb-2"
              style={{ textShadow: '0 2px 30px rgba(200, 164, 77, 0.5)' }}>
              {user.name}
            </h1>
            <p className="font-montserrat text-sm text-muted-brass">{user.email}</p>
            
            {/* Subscription Badge */}
            {subscriptionStatus && (
              <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-gold/10 border border-gold/30 rounded-sm">
                <Crown className={`w-4 h-4 ${isPro ? 'text-gold' : 'text-muted-brass/50'}`} />
                <span className="font-montserrat text-sm text-gold">
                  {isPro ? 'Pro Member' : 'Free Tier'}
                </span>
              </div>
            )}
          </motion.div>
          
          <GrandDivider variant="eye" />
        </div>
      </DarkSection>

      {/* Light Parchment Section */}
      <LightSection 
        className="py-10 sm:py-14 px-4 sm:px-6"
        atmosphericImage={ATMOSPHERIC_IMAGES.peonies}
        atmosphericOpacity={0.10}
        atmosphericPosition="left center"
        atmosphericTint="sepia"
      >
        <div className="max-w-4xl mx-auto">
          <MysticalDivider light />
          
          <div className="grid gap-6 md:grid-cols-2">
            {/* Subscription Status */}
            {subscriptionStatus && (
              <LightOrnateCard hover={false}>
                <div className="flex items-center gap-3 mb-4">
                  <Crown className="w-6 h-6 text-crimson" />
                  <h2 className="font-cinzel text-xl text-crimson">Subscription</h2>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-montserrat text-sm text-ink-black/70">Plan:</span>
                    <span className="font-montserrat text-sm text-ink-black font-medium">
                      {isPro ? 'Pro ($19/year)' : 'Free'}
                    </span>
                  </div>
                  
                  {!isPro ? (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="font-montserrat text-sm text-ink-black/70">Spells Used:</span>
                        <span className="font-montserrat text-sm text-ink-black">
                          {subscriptionStatus.spells_used} / {subscriptionStatus.spell_limit}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-montserrat text-sm text-ink-black/70">Remaining:</span>
                        <span className="font-montserrat text-sm text-crimson font-medium">
                          {subscriptionStatus.spells_remaining} free spells
                        </span>
                      </div>
                      <div className="pt-3 border-t border-gold/30">
                        <button
                          onClick={() => navigate('/upgrade')}
                          className="w-full px-4 py-2 bg-crimson text-cream rounded-sm font-montserrat text-xs uppercase tracking-wider hover:bg-crimson/90 transition-colors"
                        >
                          Upgrade to Pro
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="flex justify-between items-center">
                      <span className="font-montserrat text-sm text-ink-black/70">Total Spells:</span>
                      <span className="font-montserrat text-sm text-crimson font-medium">
                        {subscriptionStatus.total_spells_generated} (Unlimited)
                      </span>
                    </div>
                  )}
                </div>
              </LightOrnateCard>
            )}

            {/* Email Settings */}
            <LightOrnateCard hover={false}>
              <div className="flex items-center gap-3 mb-4">
                <Mail className="w-6 h-6 text-crimson" />
                <h2 className="font-cinzel text-xl text-crimson">Email Settings</h2>
              </div>

              {!isChangingEmail ? (
                <div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-montserrat text-xs text-navy-dark/60 uppercase tracking-wider">Current Email</p>
                      <p className="font-montserrat text-sm text-ink-black">{user.email}</p>
                    </div>
                    <button
                      onClick={() => setIsChangingEmail(true)}
                      className="px-3 py-1.5 border border-crimson/40 text-crimson rounded-sm font-montserrat text-xs uppercase tracking-wider hover:bg-crimson/10 transition-colors"
                    >
                      Change
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleUpdateEmail} className="space-y-4">
                  <div>
                    <label className="block font-montserrat text-xs text-navy-dark/60 uppercase tracking-wider mb-1">
                      New Email
                    </label>
                    <input
                      type="email"
                      value={emailFormData.newEmail}
                      onChange={(e) => setEmailFormData({ ...emailFormData, newEmail: e.target.value })}
                      className="w-full bg-cream/50 border-2 border-gold/40 focus:border-crimson/50 rounded-sm px-3 py-2 text-navy-dark font-montserrat text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-montserrat text-xs text-navy-dark/60 uppercase tracking-wider mb-1">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      value={emailFormData.password}
                      onChange={(e) => setEmailFormData({ ...emailFormData, password: e.target.value })}
                      className="w-full bg-cream/50 border-2 border-gold/40 focus:border-crimson/50 rounded-sm px-3 py-2 text-navy-dark font-montserrat text-sm"
                      required
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={updatingEmail}
                      className="flex-1 px-3 py-2 bg-crimson text-cream rounded-sm font-montserrat text-xs uppercase tracking-wider disabled:opacity-50"
                    >
                      {updatingEmail ? 'Updating...' : 'Update'}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setIsChangingEmail(false); setEmailFormData({ newEmail: '', password: '' }); }}
                      className="px-3 py-2 border border-gold/40 text-ink-black/70 rounded-sm font-montserrat text-xs uppercase tracking-wider hover:bg-gold/10"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </LightOrnateCard>
          </div>

          <MysticalDivider light variant="moon" />

          {/* Favorites Section */}
          <LightOrnateCard hover={false} className="mt-6">
            <div className="flex items-center gap-3 mb-6">
              <Heart className="w-6 h-6 text-crimson" />
              <h2 className="font-cinzel text-xl text-crimson">Your Favorites</h2>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 text-crimson animate-spin" />
              </div>
            ) : favorites.length === 0 ? (
              <p className="font-montserrat text-sm text-ink-black/70">
                You haven&apos;t saved any favorites yet. Explore deities, figures, sites, and rituals to save your favorites.
              </p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {favorites.map((fav, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-cream/50 border border-gold/30 rounded-sm"
                  >
                    <p className="font-montserrat text-sm text-ink-black">
                      <span className="text-crimson uppercase tracking-wider text-xs">{fav.type}: </span>
                      {fav.id}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </LightOrnateCard>
        </div>
      </LightSection>
    </div>
    </PageBorderFrame>
  );
};
