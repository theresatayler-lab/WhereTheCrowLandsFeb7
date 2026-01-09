import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from './components/ui/sonner';
import { Navigation } from './components/Navigation';
import { Home } from './pages/Home';
import { Auth } from './pages/Auth';
import { Deities } from './pages/Deities';
import { HistoricalFigures } from './pages/HistoricalFigures';
import { SacredSites } from './pages/SacredSites';
import { Rituals } from './pages/Rituals';
import { Timeline } from './pages/Timeline';
import { AIChat } from './pages/AIChat';
import { AIImage } from './pages/AIImage';
import { Profile } from './pages/Profile';
import { SpellRequest } from './pages/SpellRequest';
import { Guides } from './pages/Guides';
import { MyGrimoire } from './pages/MyGrimoire';
import { Upgrade } from './pages/Upgrade';
import { PaymentSuccess } from './pages/PaymentSuccess';
import { About } from './pages/About';
import { FAQ } from './pages/FAQ';
import { Privacy } from './pages/Privacy';
import WardFinder from './pages/WardFinder';
import CorrieTarot from './pages/CorrieTarot';
import EarlyAccessPage from './pages/EarlyAccess';
import Library from './pages/Library';
import { Footer } from './components/Footer';
import { OnboardingModal } from './components/OnboardingModal';
import './App.css';

// ScrollToTop component - scrolls to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
}

// Early Access Redirect - redirects all traffic to /early-access unless preview mode is active
function EarlyAccessRedirect() {
  const location = useLocation();
  
  useEffect(() => {
    // TEMPORARILY DISABLED for testing - allow full site access
    // To re-enable early-access gate, uncomment the code below
    
    // Check for preview mode in URL params or localStorage
    const params = new URLSearchParams(location.search);
    const previewParam = params.get('preview');
    
    // If preview=crowlands is in URL, save to localStorage and allow full site access
    if (previewParam === 'crowlands') {
      localStorage.setItem('crowlands_preview_mode', 'true');
    }
    
    // Always allow access for now (early-access gate disabled)
    return;
    
    /* EARLY ACCESS GATE - Uncomment to re-enable
    // If preview mode is saved in localStorage, allow full site access
    if (localStorage.getItem('crowlands_preview_mode') === 'true') {
      return;
    }
    
    // Otherwise, redirect to early-access page (except if already there)
    if (location.pathname !== '/early-access') {
      window.location.href = '/early-access';
    }
    */
  }, [location]);
  
  return null;
}

// Conditional Navigation - hide on /early-access
function ConditionalNavigation({ user, onLogout }) {
  const { pathname } = useLocation();
  if (pathname === '/early-access') return null;
  return <Navigation user={user} onLogout={handleLogout} />;
  
  function handleLogout() {
    onLogout();
  }
}

// Conditional Footer - hide on /early-access  
function ConditionalFooter() {
  const { pathname } = useLocation();
  if (pathname === '/early-access') return null;
  return <Footer />;
}

function App() {
  const [user, setUser] = useState(null);
  const [selectedArchetype, setSelectedArchetype] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    // Load saved archetype
    const savedArchetype = localStorage.getItem('crowlands_selected_archetype');
    if (savedArchetype) {
      setSelectedArchetype(savedArchetype);
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  const handleSelectArchetype = (archetypeId) => {
    setSelectedArchetype(archetypeId);
  };

  // Check if current path should hide nav/footer
  const hideNavFooter = window.location.pathname === '/early-access';

  return (
    <div className="App">
      <BrowserRouter>
        <ScrollToTop />
        <EarlyAccessRedirect />
        {/* OnboardingModal disabled - users go straight to site */}
        {/* <OnboardingModal onSelectArchetype={handleSelectArchetype} /> */}
        <ConditionalNavigation user={user} onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth onLogin={handleLogin} />} />
          <Route path="/spell-request" element={<SpellRequest selectedArchetype={selectedArchetype} />} />
          <Route path="/guides" element={<Guides />} />
          <Route path="/ward-finder" element={<WardFinder />} />
          <Route path="/corrie-tarot" element={<CorrieTarot />} />
          <Route path="/early-access" element={<EarlyAccessPage />} />
          <Route path="/library" element={<Library />} />
          <Route path="/upgrade" element={<Upgrade />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/about" element={<About />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/deities" element={<Deities />} />
          <Route path="/figures" element={<HistoricalFigures />} />
          <Route path="/sites" element={<SacredSites />} />
          <Route path="/rituals" element={<Rituals />} />
          <Route path="/timeline" element={<Timeline />} />
          <Route path="/ai-chat" element={<AIChat selectedArchetype={selectedArchetype} />} />
          <Route path="/ai-image" element={<AIImage />} />
          <Route
            path="/my-grimoire"
            element={user ? <MyGrimoire /> : <Navigate to="/auth" />}
          />
          <Route
            path="/profile"
            element={user ? <Profile user={user} /> : <Navigate to="/auth" />}
          />
        </Routes>
        <ConditionalFooter />
      </BrowserRouter>
      <Toaster position="top-right" />
    </div>
  );
}

export default App;