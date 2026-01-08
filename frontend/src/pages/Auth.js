import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../utils/api';
import { toast } from 'sonner';
import { DarkSection, ElaborateCorner, LightOrnateCard, GrandDivider } from '../components/OrnateElements';
import { Sparkles, User, Mail, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

export const Auth = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
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
    <DarkSection className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-12 sm:py-24" variant="warm">
      {/* Corner Ornaments */}
      <ElaborateCorner className="absolute top-3 left-3 w-16 h-16 sm:w-24 sm:h-24" variant="gold" />
      <ElaborateCorner className="absolute top-3 right-3 w-16 h-16 sm:w-24 sm:h-24 rotate-90" variant="gold" />
      <ElaborateCorner className="absolute bottom-3 left-3 w-16 h-16 sm:w-24 sm:h-24 -rotate-90" variant="gold" />
      <ElaborateCorner className="absolute bottom-3 right-3 w-16 h-16 sm:w-24 sm:h-24 rotate-180" variant="gold" />
      
      <motion.div 
        className="w-full max-w-md relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Ornate frame around the card */}
        <div className="relative">
          {/* Outer glow */}
          <div className="absolute -inset-4 opacity-20 blur-xl" style={{ background: 'radial-gradient(ellipse at center, rgba(212, 168, 75, 0.4) 0%, transparent 70%)' }} />
          
          {/* Card borders */}
          <div className="absolute inset-0 border-2 border-gold/50 rounded-lg" />
          <div className="absolute inset-1.5 border border-crimson/30 rounded-md" />
          <div className="absolute inset-0 bg-navy-mid/80 backdrop-blur-md rounded-lg" />
          
          {/* Content */}
          <div className="relative z-10 p-6 sm:p-8" data-testid="auth-card">
            {/* Icon */}
            <div className="flex justify-center mb-4">
              <Sparkles className="w-10 h-10 text-gold" style={{ filter: 'drop-shadow(0 0 10px rgba(212, 168, 75, 0.5))' }} />
            </div>
            
            {/* Title */}
            <h2 className="font-cinzel text-2xl sm:text-3xl text-gold text-center mb-2" style={{ textShadow: '0 2px 20px rgba(212, 168, 75, 0.4)' }}>
              {isLogin ? 'Enter the Coven' : 'Join the Coven'}
            </h2>
            <p className="font-montserrat text-xs text-silver-mist/60 text-center mb-6">
              {isLogin ? 'Welcome back, seeker' : 'Begin your journey'}
            </p>

            <GrandDivider />

            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <div>
                  <label className="block font-montserrat text-xs text-gold/70 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <User className="w-3 h-3" />
                    Name
                  </label>
                  <input
                    type="text"
                    data-testid="auth-name-input"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-navy-dark/50 border border-gold/30 focus:border-gold focus:ring-1 focus:ring-gold/30 rounded-sm px-4 py-3 text-cream font-montserrat text-sm placeholder-silver-mist/40"
                    placeholder="Your name"
                    required={!isLogin}
                  />
                </div>
              )}

              <div>
                <label className="block font-montserrat text-xs text-gold/70 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Mail className="w-3 h-3" />
                  Email
                </label>
                <input
                  type="email"
                  data-testid="auth-email-input"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-navy-dark/50 border border-gold/30 focus:border-gold focus:ring-1 focus:ring-gold/30 rounded-sm px-4 py-3 text-cream font-montserrat text-sm placeholder-silver-mist/40"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div>
                <label className="block font-montserrat text-xs text-gold/70 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Lock className="w-3 h-3" />
                  Password
                </label>
                <input
                  type="password"
                  data-testid="auth-password-input"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-navy-dark/50 border border-gold/30 focus:border-gold focus:ring-1 focus:ring-gold/30 rounded-sm px-4 py-3 text-cream font-montserrat text-sm placeholder-silver-mist/40"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                data-testid="auth-submit-button"
                disabled={loading}
                className="w-full bg-gradient-to-r from-gold-dark via-gold to-gold-dark text-navy-dark py-3 rounded-sm font-montserrat tracking-widest uppercase text-sm font-bold hover:from-gold hover:via-gold-light hover:to-gold transition-all duration-300 disabled:opacity-50 border border-crimson/30"
              >
                {loading ? 'Processing...' : isLogin ? 'Enter' : 'Join'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                data-testid="auth-toggle-button"
                className="font-montserrat text-sm text-gold-light hover:text-gold transition-all"
              >
                {isLogin ? "Don't have an account? Join us" : 'Already a member? Enter here'}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </DarkSection>
  );
};
