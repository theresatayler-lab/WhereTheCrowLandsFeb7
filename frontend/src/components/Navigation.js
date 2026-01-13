import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Moon, BookOpen, Users, MapPin, Scroll, Clock, Bot, Sparkles, User, LogOut, 
  Menu, X, HelpCircle, Shield, Feather, ChevronDown, Wand2, Eye, Library,
  Crown, Image, Compass
} from 'lucide-react';

// Dropdown component
const NavDropdown = ({ label, icon: Icon, items, isActive, onItemClick }) => {
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
        className={`px-3 py-2 rounded-sm font-montserrat text-xs tracking-wider transition-all duration-300 flex items-center gap-1.5 ${
          isActive 
            ? 'text-gold bg-gold/10' 
            : 'text-silver-mist/80 hover:text-gold hover:bg-gold/5'
        }`}
      >
        <Icon className="w-4 h-4" />
        <span>{label}</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div 
          className="absolute top-full left-0 mt-1 min-w-[180px] py-2 rounded-sm border border-gold/30 shadow-xl z-50"
          style={{ background: 'rgba(14, 22, 41, 0.98)', backdropFilter: 'blur(8px)' }}
        >
          {items.map((item) => {
            const ItemIcon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => {
                  setIsOpen(false);
                  onItemClick?.();
                }}
                className="flex items-center gap-2 px-4 py-2.5 font-montserrat text-xs tracking-wider text-silver-mist/80 hover:text-gold hover:bg-gold/5 transition-all"
              >
                <ItemIcon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export const Navigation = ({ user, onLogout }) => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedMobileSection, setExpandedMobileSection] = useState(null);
  
  // Grouped navigation structure
  const navGroups = {
    create: {
      label: 'Create',
      icon: Sparkles,
      items: [
        { to: '/spell-request', label: 'Request Spell', icon: Wand2 },
        { to: '/ward-finder', label: 'Ward Finder', icon: Shield },
        { to: '/ai-image', label: 'AI Image', icon: Image },
      ]
    },
    explore: {
      label: 'Explore',
      icon: BookOpen,
      items: [
        { to: '/library', label: 'Library', icon: Library },
        { to: '/guides', label: 'Guides', icon: Users },
        { to: '/corrie-tarot', label: 'Corrie Tarot', icon: Eye },
        { to: '/invisible-helpers', label: 'Invisible Helpers', icon: Compass },
      ]
    },
    archives: {
      label: 'Archives',
      icon: Scroll,
      items: [
        { to: '/deities', label: 'Deities', icon: Moon },
        { to: '/figures', label: 'Figures', icon: Users },
        { to: '/sites', label: 'Sites', icon: MapPin },
        { to: '/rituals', label: 'Rituals', icon: Scroll },
        { to: '/timeline', label: 'Timeline', icon: Clock },
      ]
    }
  };
  
  const standaloneLinks = [
    { to: '/ai-chat', label: 'Research', icon: Bot },
    { to: '/my-grimoire', label: 'My Grimoire', icon: BookOpen, requiresAuth: true },
  ];
  
  const secondaryLinks = [
    { to: '/about', label: 'About', icon: Feather },
    { to: '/faq', label: 'FAQ', icon: HelpCircle },
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
        background: 'linear-gradient(to bottom, rgba(14, 22, 41, 0.98) 0%, rgba(14, 22, 41, 0.95) 100%)',
        backdropFilter: 'blur(8px)',
        borderBottom: '2px solid rgba(212, 168, 75, 0.3)',
      }}
    >
      {/* Decorative top border */}
      <div className="h-0.5 bg-gradient-to-r from-transparent via-crimson/60 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group" data-testid="nav-logo" onClick={handleLinkClick}>
            <div className="relative">
              <div className="absolute inset-0 blur-md opacity-0 group-hover:opacity-50 transition-opacity bg-gold/30" />
              <img 
                src="https://customer-assets.emergentagent.com/job_mystic-circle-2/artifacts/li34ks3x_Where%20the%20Crowlands%20Logos.png" 
                alt="Where The Crowlands Logo"
                className="relative h-10 sm:h-12 md:h-16 w-auto"
                style={{ filter: 'brightness(1.3) contrast(1.1)' }}
              />
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {/* Home */}
            <Link
              to="/"
              data-testid="nav-home"
              className={`px-3 py-2 rounded-sm font-montserrat text-xs tracking-wider transition-all duration-300 flex items-center gap-1.5 ${
                location.pathname === '/' 
                  ? 'text-gold bg-gold/10 border-b-2 border-gold' 
                  : 'text-silver-mist/80 hover:text-gold hover:bg-gold/5'
              }`}
            >
              <Moon className="w-4 h-4" />
              <span>Home</span>
            </Link>
            
            {/* Dropdown Groups */}
            <NavDropdown 
              label={navGroups.create.label}
              icon={navGroups.create.icon}
              items={navGroups.create.items}
              isActive={isGroupActive(navGroups.create.items)}
              onItemClick={handleLinkClick}
            />
            
            <NavDropdown 
              label={navGroups.explore.label}
              icon={navGroups.explore.icon}
              items={navGroups.explore.items}
              isActive={isGroupActive(navGroups.explore.items)}
              onItemClick={handleLinkClick}
            />
            
            <NavDropdown 
              label={navGroups.archives.label}
              icon={navGroups.archives.icon}
              items={navGroups.archives.items}
              isActive={isGroupActive(navGroups.archives.items)}
              onItemClick={handleLinkClick}
            />
            
            {/* Standalone Links */}
            {standaloneLinks.map((link) => {
              if (link.requiresAuth && !user) return null;
              const Icon = link.icon;
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  data-testid={`nav-${link.label.toLowerCase().replace(' ', '-')}`}
                  className={`px-3 py-2 rounded-sm font-montserrat text-xs tracking-wider transition-all duration-300 flex items-center gap-1.5 ${
                    isActive 
                      ? 'text-gold bg-gold/10 border-b-2 border-gold' 
                      : 'text-silver-mist/80 hover:text-gold hover:bg-gold/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
            
            {/* User Section */}
            {user ? (
              <div className="flex items-center space-x-2 ml-4 pl-4 border-l border-gold/20">
                <Link
                  to="/profile"
                  data-testid="nav-profile"
                  className="px-3 py-2 rounded-sm font-montserrat text-xs tracking-wider transition-all duration-300 flex items-center gap-1.5 text-silver-mist/80 hover:text-gold hover:bg-gold/5"
                >
                  <User className="w-4 h-4" />
                  <span>{user.name}</span>
                </Link>
                <Link
                  to="/upgrade"
                  data-testid="nav-upgrade"
                  className="px-3 py-2 rounded-sm font-montserrat text-xs tracking-wider transition-all duration-300 flex items-center gap-1.5 text-crimson-bright hover:text-gold hover:bg-gold/5"
                >
                  <Crown className="w-4 h-4" />
                  <span>Upgrade</span>
                </Link>
                <button
                  onClick={onLogout}
                  data-testid="nav-logout"
                  className="px-2 py-2 rounded-sm transition-all duration-300 text-silver-mist/60 hover:text-crimson hover:bg-crimson/10"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                data-testid="nav-login"
                className="ml-4 px-5 py-2.5 relative overflow-hidden rounded-sm font-montserrat text-xs tracking-widest uppercase transition-all duration-300 group"
              >
                <span className="absolute inset-0 border border-gold/50 rounded-sm" />
                <span className="absolute inset-0.5 bg-gradient-to-r from-crimson-deep via-crimson to-crimson-deep rounded-sm" />
                <span className="relative text-cream">Login</span>
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
              borderTop: '1px solid rgba(212, 168, 75, 0.3)',
              background: 'rgba(14, 22, 41, 0.98)',
            }}
          >
            <div className="space-y-1">
              {/* Home */}
              <Link
                to="/"
                onClick={handleLinkClick}
                className={`flex items-center gap-3 px-4 py-3 rounded-sm font-montserrat text-sm transition-all ${
                  location.pathname === '/'
                    ? 'bg-gold/10 text-gold border-l-4 border-gold'
                    : 'text-silver-mist/80 hover:bg-gold/5 hover:text-gold'
                }`}
              >
                <Moon className="w-5 h-5" />
                <span>Home</span>
              </Link>
              
              {/* Mobile Sections with Expand/Collapse */}
              {Object.entries(navGroups).map(([key, group]) => (
                <div key={key}>
                  <button
                    onClick={() => setExpandedMobileSection(expandedMobileSection === key ? null : key)}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-sm font-montserrat text-sm text-gold/80 hover:bg-gold/5 transition-all"
                  >
                    <span className="flex items-center gap-3">
                      <group.icon className="w-5 h-5" />
                      <span>{group.label}</span>
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${expandedMobileSection === key ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {expandedMobileSection === key && (
                    <div className="pl-8 space-y-1 pb-2">
                      {group.items.map((item) => {
                        const ItemIcon = item.icon;
                        const isActive = location.pathname === item.to;
                        return (
                          <Link
                            key={item.to}
                            to={item.to}
                            onClick={handleLinkClick}
                            className={`flex items-center gap-3 px-4 py-2.5 rounded-sm font-montserrat text-sm transition-all ${
                              isActive
                                ? 'bg-gold/10 text-gold'
                                : 'text-silver-mist/70 hover:bg-gold/5 hover:text-gold'
                            }`}
                          >
                            <ItemIcon className="w-4 h-4" />
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
                const Icon = link.icon;
                const isActive = location.pathname === link.to;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={handleLinkClick}
                    className={`flex items-center gap-3 px-4 py-3 rounded-sm font-montserrat text-sm transition-all ${
                      isActive
                        ? 'bg-gold/10 text-gold border-l-4 border-gold'
                        : 'text-silver-mist/80 hover:bg-gold/5 hover:text-gold'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
              
              {/* Divider */}
              <div className="h-px bg-gold/20 my-3 mx-4" />
              
              {/* Secondary Links */}
              {secondaryLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={handleLinkClick}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-sm font-montserrat text-xs text-silver-mist/60 hover:bg-gold/5 hover:text-gold transition-all"
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
              
              {/* User Actions */}
              {user ? (
                <>
                  <div className="h-px bg-gold/20 my-3 mx-4" />
                  <Link
                    to="/upgrade"
                    onClick={handleLinkClick}
                    className="flex items-center gap-3 px-4 py-3 rounded-sm font-montserrat text-sm text-crimson-bright hover:bg-crimson/10 transition-all"
                  >
                    <Crown className="w-5 h-5" />
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
