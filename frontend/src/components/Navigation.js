import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Menu, X, ChevronDown, LogOut, User
} from 'lucide-react';
import { BrandIcon } from './BrandIcon';

// Custom icon wrapper for brand icons in navigation
const NavBrandIcon = ({ name, className = "w-5 h-5" }) => (
  <BrandIcon 
    name={name} 
    size={20} 
    variant="gold" 
    opacity={0.95}
    className={className}
  />
);

// Dropdown component - supports both Lucide icons and brand icon names
const NavDropdown = ({ label, brandIcon, items, isActive, onItemClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-2 font-montserrat text-xs tracking-wider transition-all duration-300 flex items-center gap-1.5"
        style={{
          color: isActive ? '#C8A44D' : 'rgba(243, 239, 232, 0.8)',
          backgroundColor: isActive ? 'rgba(200, 164, 77, 0.15)' : 'transparent',
        }}
        onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.color = '#C8A44D'; e.currentTarget.style.backgroundColor = 'rgba(200, 164, 77, 0.08)'; }}}
        onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.color = 'rgba(243, 239, 232, 0.8)'; e.currentTarget.style.backgroundColor = 'transparent'; }}}
      >
        <NavBrandIcon name={brandIcon} />
        <span>{label}</span>
        <ChevronDown className="w-3 h-3 transition-transform" style={{ transform: isOpen ? 'rotate(180deg)' : 'none' }} />
      </button>
      
      {isOpen && (
        <div 
          className="absolute top-full left-0 mt-2 min-w-[200px] py-3 shadow-2xl z-50"
          style={{ 
            background: 'linear-gradient(to bottom, rgba(14, 42, 47, 0.99) 0%, rgba(18, 58, 63, 0.98) 100%)', 
            backdropFilter: 'blur(12px)',
            border: '2px solid rgba(200, 164, 77, 0.5)',
            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.4), 0 0 20px rgba(200, 164, 77, 0.1)',
          }}
        >
          {/* Decorative top accent */}
          <div className="absolute -top-px left-2 right-2 h-0.5" style={{ background: 'linear-gradient(to right, transparent, #B94E6A, #C8A44D, #B94E6A, transparent)' }} />
          
          {/* Corner accents */}
          <div className="absolute top-1 left-1 w-3 h-3" style={{ borderTop: '2px solid rgba(200, 164, 77, 0.6)', borderLeft: '2px solid rgba(200, 164, 77, 0.6)' }} />
          <div className="absolute top-1 right-1 w-3 h-3" style={{ borderTop: '2px solid rgba(200, 164, 77, 0.6)', borderRight: '2px solid rgba(200, 164, 77, 0.6)' }} />
          <div className="absolute bottom-1 left-1 w-3 h-3" style={{ borderBottom: '2px solid rgba(200, 164, 77, 0.6)', borderLeft: '2px solid rgba(200, 164, 77, 0.6)' }} />
          <div className="absolute bottom-1 right-1 w-3 h-3" style={{ borderBottom: '2px solid rgba(200, 164, 77, 0.6)', borderRight: '2px solid rgba(200, 164, 77, 0.6)' }} />
          
          {items.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => {
                setIsOpen(false);
                onItemClick?.();
              }}
              className="flex items-center gap-3 px-5 py-2.5 font-montserrat text-xs tracking-wider transition-all relative"
              style={{ color: 'rgba(243, 239, 232, 0.8)' }}
              onMouseEnter={(e) => { 
                e.currentTarget.style.color = '#C8A44D'; 
                e.currentTarget.style.backgroundColor = 'rgba(200, 164, 77, 0.15)';
                e.currentTarget.style.borderLeft = '3px solid #B94E6A';
                e.currentTarget.style.paddingLeft = '17px';
              }}
              onMouseLeave={(e) => { 
                e.currentTarget.style.color = 'rgba(243, 239, 232, 0.8)'; 
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.borderLeft = '3px solid transparent';
                e.currentTarget.style.paddingLeft = '20px';
              }}
            >
              <BrandIcon name={item.brandIcon} size={20} variant="pink" opacity={0.95} />
              <span>{item.label}</span>
            </Link>
          ))}
          
          {/* Decorative bottom accent */}
          <div className="absolute -bottom-px left-2 right-2 h-0.5" style={{ background: 'linear-gradient(to right, transparent, rgba(200, 164, 77, 0.4), transparent)' }} />
        </div>
      )}
    </div>
  );
};

export const Navigation = ({ user, onLogout }) => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedMobileSection, setExpandedMobileSection] = useState(null);
  
  // Grouped navigation structure - using brand icons
  const navGroups = {
    create: {
      label: 'Create',
      brandIcon: 'star',
      items: [
        { to: '/spell-request', label: 'Request Spell', brandIcon: 'pentagram' },
        { to: '/ward-finder', label: 'Ward Finder', brandIcon: 'eightstar' },
        { to: '/ai-image', label: 'AI Image', brandIcon: 'eye' },
      ]
    },
    explore: {
      label: 'Explore',
      brandIcon: 'book',
      items: [
        { to: '/library', label: 'Library', brandIcon: 'book' },
        { to: '/guides', label: 'Guides', brandIcon: 'bird' },
        { to: '/corrie-tarot', label: 'Corrie Tarot', brandIcon: 'moon' },
        { to: '/invisible-helpers', label: 'Invisible Helpers', brandIcon: 'sunMoon' },
      ]
    },
    archives: {
      label: 'Archives',
      brandIcon: 'skull',
      items: [
        { to: '/deities', label: 'Deities', brandIcon: 'halfmoon' },
        { to: '/figures', label: 'Figures', brandIcon: 'column' },
        { to: '/sites', label: 'Sites', brandIcon: 'hexagram' },
        { to: '/rituals', label: 'Rituals', brandIcon: 'ouroboros' },
        { to: '/timeline', label: 'Timeline', brandIcon: 'snake' },
      ]
    }
  };
  
  const standaloneLinks = [
    { to: '/ai-chat', label: 'Research', brandIcon: 'eye' },
    { to: '/my-grimoire', label: 'My Grimoire', brandIcon: 'book', requiresAuth: true },
  ];
  
  const secondaryLinks = [
    { to: '/about', label: 'About', brandIcon: 'bird' },
    { to: '/faq', label: 'FAQ', brandIcon: 'key' },
  ];
  
  const handleLinkClick = () => {
    setMobileMenuOpen(false);
    setExpandedMobileSection(null);
  };
  
  // Check if any item in a group is active
  const isGroupActive = (items) => items.some(item => location.pathname === item.to);
  
  // Flatten all links for mobile menu
  const allMobileLinks = [
    ...navGroups.create.items,
    ...navGroups.explore.items,
    ...navGroups.archives.items,
    ...standaloneLinks.filter(l => !l.requiresAuth || user),
    ...secondaryLinks,
  ];
  
  return (
    <nav 
      className="sticky top-0 z-50"
      style={{
        background: 'linear-gradient(to bottom, rgba(14, 42, 47, 0.98) 0%, rgba(14, 42, 47, 0.95) 100%)',
        backdropFilter: 'blur(8px)',
        borderBottom: '2px solid rgba(200, 164, 77, 0.4)',
      }}
    >
      {/* Decorative top border - Art Nouveau */}
      <div className="h-1" style={{ background: 'linear-gradient(to right, transparent 10%, #B94E6A 30%, #C8A44D 50%, #B94E6A 70%, transparent 90%)' }} />
      <div className="h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(200, 164, 77, 0.5), transparent)' }} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo - new clean design */}
          <Link to="/" className="flex items-center space-x-2 group" data-testid="nav-logo" onClick={handleLinkClick}>
            <img 
              src="/images/brand/new-logo.png" 
              alt="Where The Crowlands Logo"
              className="h-10 sm:h-12 md:h-16 w-auto"
            />
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {/* Home */}
            <Link
              to="/"
              data-testid="nav-home"
              className="px-3 py-2 font-montserrat text-xs tracking-wider transition-all duration-300 flex items-center gap-1.5"
              style={{
                color: location.pathname === '/' ? '#C8A44D' : 'rgba(243, 239, 232, 0.8)',
                backgroundColor: location.pathname === '/' ? 'rgba(200, 164, 77, 0.15)' : 'transparent',
                borderBottom: location.pathname === '/' ? '2px solid #C8A44D' : '2px solid transparent',
              }}
              onMouseEnter={(e) => { if (location.pathname !== '/') { e.currentTarget.style.color = '#C8A44D'; e.currentTarget.style.backgroundColor = 'rgba(200, 164, 77, 0.08)'; }}}
              onMouseLeave={(e) => { if (location.pathname !== '/') { e.currentTarget.style.color = 'rgba(243, 239, 232, 0.8)'; e.currentTarget.style.backgroundColor = 'transparent'; }}}
            >
              <NavBrandIcon name="moon" />
              <span>Home</span>
            </Link>
            
            {/* Dropdown Groups */}
            <NavDropdown 
              label={navGroups.create.label}
              brandIcon={navGroups.create.brandIcon}
              items={navGroups.create.items}
              isActive={isGroupActive(navGroups.create.items)}
              onItemClick={handleLinkClick}
            />
            
            <NavDropdown 
              label={navGroups.explore.label}
              brandIcon={navGroups.explore.brandIcon}
              items={navGroups.explore.items}
              isActive={isGroupActive(navGroups.explore.items)}
              onItemClick={handleLinkClick}
            />
            
            <NavDropdown 
              label={navGroups.archives.label}
              brandIcon={navGroups.archives.brandIcon}
              items={navGroups.archives.items}
              isActive={isGroupActive(navGroups.archives.items)}
              onItemClick={handleLinkClick}
            />
            
            {/* Standalone Links */}
            {standaloneLinks.map((link) => {
              if (link.requiresAuth && !user) return null;
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  data-testid={`nav-${link.label.toLowerCase().replace(' ', '-')}`}
                  className="px-3 py-2 font-montserrat text-xs tracking-wider transition-all duration-300 flex items-center gap-1.5"
                  style={{
                    color: isActive ? '#C8A44D' : 'rgba(243, 239, 232, 0.8)',
                    backgroundColor: isActive ? 'rgba(200, 164, 77, 0.15)' : 'transparent',
                    borderBottom: isActive ? '2px solid #C8A44D' : '2px solid transparent',
                  }}
                  onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.color = '#C8A44D'; e.currentTarget.style.backgroundColor = 'rgba(200, 164, 77, 0.08)'; }}}
                  onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.color = 'rgba(243, 239, 232, 0.8)'; e.currentTarget.style.backgroundColor = 'transparent'; }}}
                >
                  <NavBrandIcon name={link.brandIcon} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
            
            {/* User Section */}
            {user ? (
              <div className="flex items-center space-x-2 ml-4 pl-4" style={{ borderLeft: '1px solid rgba(200, 164, 77, 0.3)' }}>
                <Link
                  to="/profile"
                  data-testid="nav-profile"
                  className="px-3 py-2 rounded-sm font-montserrat text-xs tracking-wider transition-all duration-300 flex items-center gap-1.5"
                  style={{ color: 'rgba(243, 239, 232, 0.8)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#C8A44D'; e.currentTarget.style.backgroundColor = 'rgba(200, 164, 77, 0.1)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(243, 239, 232, 0.8)'; e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  <User className="w-4 h-4" />
                  <span>{user.name}</span>
                </Link>
                <Link
                  to="/upgrade"
                  data-testid="nav-upgrade"
                  className="px-3 py-2 rounded-sm font-montserrat text-xs tracking-wider transition-all duration-300 flex items-center gap-1.5"
                  style={{ color: '#B94E6A' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#C8A44D'; e.currentTarget.style.backgroundColor = 'rgba(200, 164, 77, 0.1)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#B94E6A'; e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  <Crown className="w-4 h-4" />
                  <span>Upgrade</span>
                </Link>
                <button
                  onClick={onLogout}
                  data-testid="nav-logout"
                  className="px-2 py-2 rounded-sm transition-all duration-300"
                  style={{ color: 'rgba(243, 239, 232, 0.5)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#B94E6A'; e.currentTarget.style.backgroundColor = 'rgba(185, 78, 106, 0.1)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(243, 239, 232, 0.5)'; e.currentTarget.style.backgroundColor = 'transparent'; }}
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                data-testid="nav-login"
                className="ml-4 px-6 py-2.5 relative overflow-hidden font-cinzel text-xs tracking-[0.2em] uppercase transition-all duration-300 group"
                style={{
                  backgroundColor: '#B94E6A',
                  border: '2px solid #C8A44D',
                  color: '#F3EFE8',
                  boxShadow: '0 0 15px rgba(185, 78, 106, 0.3)',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 0 25px rgba(185, 78, 106, 0.5)'; e.currentTarget.style.filter = 'brightness(1.1)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 0 15px rgba(185, 78, 106, 0.3)'; e.currentTarget.style.filter = 'brightness(1)'; }}
              >
                <span className="relative">Login</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-3 lg:hidden">
            {user && (
              <Link
                to="/profile"
                onClick={handleLinkClick}
                className="p-2 rounded-sm text-silver-mist/80 hover:text-gold transition-all"
              >
                <User className="w-5 h-5" />
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-sm text-silver-mist/80 hover:text-gold transition-all"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div 
            className="lg:hidden py-4 max-h-[70vh] overflow-y-auto"
            style={{
              borderTop: '2px solid rgba(200, 164, 77, 0.5)',
              background: 'linear-gradient(to bottom, rgba(14, 42, 47, 0.99) 0%, rgba(14, 42, 47, 0.98) 100%)',
            }}
          >
            {/* Decorative top accent */}
            <div className="h-px mb-3" style={{ background: 'linear-gradient(to right, transparent, rgba(185, 78, 106, 0.5), transparent)' }} />
            
            <div className="space-y-1">
              {/* Home */}
              <Link
                to="/"
                onClick={handleLinkClick}
                className="flex items-center gap-3 px-4 py-3 font-montserrat text-sm transition-all"
                style={{
                  backgroundColor: location.pathname === '/' ? 'rgba(200, 164, 77, 0.15)' : 'transparent',
                  color: location.pathname === '/' ? '#C8A44D' : 'rgba(243, 239, 232, 0.8)',
                  borderLeft: location.pathname === '/' ? '3px solid #C8A44D' : '3px solid transparent',
                }}
              >
                <BrandIcon name="moon" size={24} variant="gold" opacity={0.95} />
                <span>Home</span>
              </Link>
              
              {/* Mobile Sections with Expand/Collapse */}
              {Object.entries(navGroups).map(([key, group]) => (
                <div key={key}>
                  <button
                    onClick={() => setExpandedMobileSection(expandedMobileSection === key ? null : key)}
                    className="w-full flex items-center justify-between px-4 py-3 font-montserrat text-sm transition-all"
                    style={{ color: '#C8A44D' }}
                  >
                    <span className="flex items-center gap-3">
                      <BrandIcon name={group.brandIcon} size={24} variant="gold" opacity={0.95} />
                      <span>{group.label}</span>
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${expandedMobileSection === key ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {expandedMobileSection === key && (
                    <div 
                      className="pl-8 space-y-1 pb-2"
                      style={{ 
                        backgroundColor: 'rgba(18, 58, 63, 0.5)',
                        borderLeft: '2px solid rgba(200, 164, 77, 0.3)',
                        marginLeft: '1rem',
                      }}
                    >
                      {group.items.map((item) => {
                        const isActive = location.pathname === item.to;
                        return (
                          <Link
                            key={item.to}
                            to={item.to}
                            onClick={handleLinkClick}
                            className="flex items-center gap-3 px-4 py-2.5 font-montserrat text-sm transition-all"
                            style={{
                              backgroundColor: isActive ? 'rgba(200, 164, 77, 0.15)' : 'transparent',
                              color: isActive ? '#C8A44D' : 'rgba(243, 239, 232, 0.7)',
                            }}
                          >
                            <BrandIcon name={item.brandIcon} size={16} variant="pink" opacity={0.9} />
                            <span>{item.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
              
              {/* Standalone Links */}
              {standaloneLinks.map((link) => {
                if (link.requiresAuth && !user) return null;
                const isActive = location.pathname === link.to;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={handleLinkClick}
                    className="flex items-center gap-3 px-4 py-3 font-montserrat text-sm transition-all"
                    style={{
                      backgroundColor: isActive ? 'rgba(200, 164, 77, 0.15)' : 'transparent',
                      color: isActive ? '#C8A44D' : 'rgba(243, 239, 232, 0.8)',
                      borderLeft: isActive ? '3px solid #C8A44D' : '3px solid transparent',
                    }}
                  >
                    <BrandIcon name={link.brandIcon} size={20} variant="gold" opacity={0.9} />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
              
              {/* Divider */}
              <div className="h-px my-3 mx-4" style={{ background: 'linear-gradient(to right, transparent, rgba(200, 164, 77, 0.4), transparent)' }} />
              
              {/* Secondary Links */}
              {secondaryLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={handleLinkClick}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-sm font-montserrat text-xs text-silver-mist/60 hover:bg-gold/5 hover:text-gold transition-all"
                >
                  <BrandIcon name={link.brandIcon} size={16} variant="gold" opacity={0.7} />
                  <span>{link.label}</span>
                </Link>
              ))}
              
              {/* User Actions */}
              {user ? (
                <>
                  <div className="h-px bg-gold/20 my-3 mx-4" />
                  <Link
                    to="/upgrade"
                    onClick={handleLinkClick}
                    className="flex items-center gap-3 px-4 py-3 rounded-sm font-montserrat text-sm text-crimson-bright hover:bg-crimson/10 transition-all"
                  >
                    <BrandIcon name="star" size={20} variant="pink" opacity={0.9} />
                    <span>Upgrade to Pro</span>
                  </Link>
                  <button
                    onClick={() => {
                      onLogout();
                      handleLinkClick();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-sm font-montserrat text-sm text-silver-mist/60 hover:text-crimson hover:bg-crimson/10 transition-all"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <div className="px-4 pt-2">
                  <Link
                    to="/auth"
                    onClick={handleLinkClick}
                    className="flex items-center justify-center px-4 py-3 relative overflow-hidden rounded-sm font-montserrat text-sm tracking-widest uppercase transition-all"
                  >
                    <span className="absolute inset-0 border border-gold/50 rounded-sm" />
                    <span className="absolute inset-0.5 bg-gradient-to-r from-crimson-deep via-crimson to-crimson-deep rounded-sm" />
                    <span className="relative text-cream">Login</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
