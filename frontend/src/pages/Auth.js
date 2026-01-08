import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../utils/api';
import { toast } from 'sonner';
import { DarkSection, LightSection, PageBorderFrame, CornerFlourish, GrandDivider, MysticalDivider } from '../components/OrnateElements';
import { Sparkles, User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

export const Auth = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = isLogin
        ? await authAPI.login({ email: formData.email, password: formData.password })
        : await authAPI.register(formData);

      localStorage.setItem('token', result.token);
      onLogin(result.user);
      toast.success(isLogin ? 'Welcome back!' : 'Account created successfully!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageBorderFrame>
      <div className="min-h-screen">
        {/* Dark Hero Section */}
        <DarkSection className="py-12 sm:py-16 md:py-20 px-4 sm:px-6" variant="warm">
          <div className="max-w-md mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <Sparkles className="w-12 h-12 sm:w-14 sm:h-14 text-crimson-bright mx-auto mb-4"
              style={{ filter: 'drop-shadow(0 0 15px rgba(184, 35, 48, 0.5))' }} />
            
            <h1 className="font-italiana text-3xl sm:text-4xl md:text-5xl text-gold-light mb-2"
              style={{ textShadow: '0 2px 30px rgba(212, 168, 75, 0.5)' }}>
              {isLogin ? 'Enter the Coven' : 'Join the Coven'}
            </h1>
            <p className="font-montserrat text-sm text-silver-mist/80">
              {isLogin ? 'Welcome back, seeker of mysteries' : 'Begin your journey into the unknown'}
            </p>
          </motion.div>
          
          <GrandDivider variant="eye" />
        </div>
      </DarkSection>

      {/* Light Parchment Section - Form */}
      <LightSection className="py-10 sm:py-14 px-4 sm:px-6">
        <div className="max-w-md mx-auto">
          <MysticalDivider light />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Form Card */}
            <div className="relative" data-testid="auth-card">
              {/* Card borders */}
              <div className="absolute inset-0 border-2 border-crimson/40 rounded-lg" />
              <div className="absolute inset-1.5 border border-gold/30 rounded-md" />
              <div className="absolute inset-0 bg-cream/90 backdrop-blur-sm rounded-lg" />
              
              {/* Corner ornaments */}
              <span className="absolute -top-2 -left-2 text-crimson text-lg">◆</span>
              <span className="absolute -top-2 -right-2 text-crimson text-lg">◆</span>
              <span className="absolute -bottom-2 -left-2 text-crimson text-lg">◆</span>
              <span className="absolute -bottom-2 -right-2 text-crimson text-lg">◆</span>
              
              {/* Content */}
              <div className="relative z-10 p-6 sm:p-8">
                <form onSubmit={handleSubmit} className="space-y-5">
                  {!isLogin && (
                    <div>
                      <label className="block font-montserrat text-xs text-navy-dark/70 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <User className="w-3 h-3 text-crimson" />
                        Name
                      </label>
                      <input
                        type="text"
                        data-testid="auth-name-input"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-white/50 border-2 border-gold/40 focus:border-crimson/50 focus:ring-1 focus:ring-crimson/30 rounded-sm px-4 py-3 text-navy-dark font-montserrat text-sm placeholder-navy-dark/40"
                        placeholder="Your name"
                        required={!isLogin}
                      />
                    </div>
                  )}

                  <div>
                    <label className="block font-montserrat text-xs text-navy-dark/70 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <Mail className="w-3 h-3 text-crimson" />
                      Email
                    </label>
                    <input
                      type="email"
                      data-testid="auth-email-input"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-white/50 border-2 border-gold/40 focus:border-crimson/50 focus:ring-1 focus:ring-crimson/30 rounded-sm px-4 py-3 text-navy-dark font-montserrat text-sm placeholder-navy-dark/40"
                      placeholder="your@email.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-montserrat text-xs text-navy-dark/70 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <Lock className="w-3 h-3 text-crimson" />
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        data-testid="auth-password-input"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full bg-white/50 border-2 border-gold/40 focus:border-crimson/50 focus:ring-1 focus:ring-crimson/30 rounded-sm px-4 py-3 pr-12 text-navy-dark font-montserrat text-sm placeholder-navy-dark/40"
                        placeholder="••••••••"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-dark/50 hover:text-crimson transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Submit Button - Bold Art Deco Style */}
                  <button
                    type="submit"
                    data-testid="auth-submit-button"
                    disabled={loading}
                    className="btn-ritual w-full py-4 rounded-sm disabled:opacity-50"
                  >
                    {loading ? 'Processing...' : isLogin ? 'Enter the Mysteries' : 'Join the Coven'}
                  </button>
                </form>

                {/* Divider */}
                <div className="flex items-center gap-3 my-6">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-crimson/30 to-transparent" />
                  <span className="text-gold-dark text-sm">❧</span>
                  <div className="flex-1 h-px bg-gradient-to-l from-transparent via-crimson/30 to-transparent" />
                </div>

                {/* Toggle */}
                <div className="text-center">
                  <button
                    onClick={() => setIsLogin(!isLogin)}
                    data-testid="auth-toggle-button"
                    className="font-montserrat text-sm text-crimson hover:text-crimson-bright transition-all underline underline-offset-4 decoration-gold/30 hover:decoration-gold"
                  >
                    {isLogin ? "Don't have an account? Join us" : 'Already a member? Enter here'}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
          
          <MysticalDivider light variant="moon" />
          
          {/* Additional info */}
          <p className="text-center font-montserrat text-xs text-navy-dark/50 mt-6">
            By joining, you agree to receive mystical correspondence and occasional updates from the Crowlands.
          </p>
        </div>
      </LightSection>
    </div>
  );
};
