import React from 'react';
import { Link } from 'react-router-dom';

// Seal logo URL
const SEAL_LOGO = "/images/brand/logo.png";

export const Footer = () => {
  return (
    <footer 
      className="mt-24 relative"
      style={{
        background: 'linear-gradient(to bottom, rgba(14, 42, 47, 0.95) 0%, rgba(10, 30, 35, 1) 100%)',
      }}
    >
      {/* Top decorative border - Art Nouveau */}
      <div className="h-1" style={{ background: 'linear-gradient(to right, transparent 10%, #B94E6A 30%, #C8A44D 50%, #B94E6A 70%, transparent 90%)' }} />
      <div className="h-px mt-0.5" style={{ background: 'linear-gradient(to right, transparent, rgba(200, 164, 77, 0.5), transparent)' }} />
      
      {/* Decorative divider with ornate elements */}
      <div className="flex items-center justify-center gap-6 py-8">
        <div className="h-0.5 flex-1 max-w-48" style={{ background: 'linear-gradient(to right, transparent, #C8A44D)' }} />
        <span style={{ color: '#B94E6A', filter: 'drop-shadow(0 0 6px rgba(185, 78, 106, 0.6))' }}>◆</span>
        <span style={{ color: '#C8A44D', fontSize: '1.5rem' }}>☽</span>
        <span style={{ color: '#C8A44D', fontSize: '1.25rem' }}>✦</span>
        <span style={{ color: '#C8A44D', fontSize: '1.5rem' }}>☾</span>
        <span style={{ color: '#B94E6A', filter: 'drop-shadow(0 0 6px rgba(185, 78, 106, 0.6))' }}>◆</span>
        <div className="h-0.5 flex-1 max-w-48" style={{ background: 'linear-gradient(to left, transparent, #C8A44D)' }} />
      </div>
      
      <div className="max-w-7xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Seal Logo and Description */}
          <div className="flex flex-col items-center md:items-start">
            <div className="relative mb-6">
              {/* Subtle glow behind logo */}
              <div 
                className="absolute inset-0 rounded-full"
                style={{ 
                  background: 'radial-gradient(circle, rgba(185, 78, 106, 0.3) 0%, rgba(14, 42, 47, 0.5) 50%, transparent 70%)',
                  transform: 'scale(1.4)',
                  filter: 'blur(15px)',
                }}
              />
              <img 
                src={SEAL_LOGO}
                alt="Where The Crowlands Seal"
                className="relative h-32 w-auto object-contain"
                style={{ filter: 'sepia(0.4) hue-rotate(-35deg) saturate(0.95) brightness(1.05) contrast(1.15)' }}
              />
            </div>
            <p className="font-crimson text-sm text-center md:text-left leading-relaxed" style={{ color: 'rgba(243, 239, 232, 0.7)' }}>
              Build your own practice. No gatekeepers, no expensive services—just formulas, patterns, and your power.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-cinzel text-lg mb-4 tracking-wide flex items-center gap-2" style={{ color: '#C8A44D' }}>
              <span style={{ color: '#B94E6A' }}>◆</span>
              Explore
            </h4>
            <ul className="space-y-2">
              {[
                { to: '/spell-request', label: 'Request a Spell' },
                { to: '/guides', label: 'Meet Your Guides' },
                { to: '/deities', label: 'Deities' },
                { to: '/figures', label: 'Historical Figures' },
                { to: '/rituals', label: 'Rituals & Practices' },
                { to: '/timeline', label: 'Timeline' },
              ].map((link) => (
                <li key={link.to}>
                  <Link 
                    to={link.to} 
                    className="font-crimson text-sm transition-colors"
                    style={{ color: 'rgba(243, 239, 232, 0.6)' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#C8A44D'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(243, 239, 232, 0.6)'}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-cinzel text-lg mb-4 tracking-wide flex items-center gap-2" style={{ color: '#C8A44D' }}>
              <span style={{ color: '#B94E6A' }}>◆</span>
              Resources
            </h4>
            <ul className="space-y-2">
              {[
                { to: '/about', label: 'About Us' },
                { to: '/faq', label: 'FAQ' },
                { to: '/privacy', label: 'Privacy Policy' },
                { to: '/ai-chat', label: 'AI Research' },
              ].map((link) => (
                <li key={link.to}>
                  <Link 
                    to={link.to} 
                    className="font-crimson text-sm transition-colors"
                    style={{ color: 'rgba(243, 239, 232, 0.6)' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#C8A44D'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(243, 239, 232, 0.6)'}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            
            <div className="mt-6 p-4 rounded-sm relative" style={{ border: '1px solid rgba(200, 164, 77, 0.3)', backgroundColor: 'rgba(18, 58, 63, 0.4)' }}>
              <span className="absolute -top-2 left-3 px-2" style={{ backgroundColor: '#0E2A2F', color: '#B94E6A', fontSize: '0.75rem' }}>◆</span>
              <p className="font-crimson text-xs italic" style={{ color: 'rgba(243, 239, 232, 0.5)' }}>
                This project blends documented history, folklore, and myth. Human-curated foundations with AI-informed expansions for inspiration. Please verify sources and use in good faith.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 relative">
          <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(200, 164, 77, 0.3), transparent)' }} />
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="font-crimson text-sm" style={{ color: 'rgba(243, 239, 232, 0.5)' }}>
              © {new Date().getFullYear()} Where The Crowlands. All rights reserved.
            </p>
            <p className="font-crimson text-xs mt-2 md:mt-0" style={{ color: 'rgba(243, 239, 232, 0.35)' }}>
              Built with historical research & modern technology
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
