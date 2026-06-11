import React, { useState } from 'react';
import { X } from 'lucide-react';
import { BrandIcon } from './BrandIcon';
import { toast } from 'sonner';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const HandcraftedMagicModal = ({ isOpen, onClose }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [bespokeForm, setBespokeForm] = useState({
    email: '',
    name: '',
    intention: '',
    tradition_preferences: '',
    additional_notes: ''
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleGrimoirePurchase = async () => {
    if (!bespokeForm.email) {
      toast.error('Please enter your email');
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/handcrafted/grimoire-checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: bespokeForm.email,
          success_url: `${window.location.origin}/handcrafted/success?product=grimoire`,
          cancel_url: `${window.location.origin}/invisible-helpers`
        })
      });
      
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else if (data.error) {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBespokePurchase = async () => {
    if (!bespokeForm.email || !bespokeForm.name || !bespokeForm.intention) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/handcrafted/bespoke-checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...bespokeForm,
          success_url: `${window.location.origin}/handcrafted/success?product=bespoke`,
          cancel_url: `${window.location.origin}/invisible-helpers`
        })
      });
      
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else if (data.error) {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-navy-dark border border-gold/30 rounded-lg shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-cream/60 hover:text-cream transition-colors"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="p-6 border-b border-gold/20">
          <h2 className="text-xl font-cinzel text-gold-light flex items-center gap-2">
            <BrandIcon name="sparkles" size={20} />
            Prefer Handcrafted Magic?
          </h2>
          <p className="text-sm text-cream/60 font-montserrat mt-2">
            Skip the AI and receive hand-delivered spells and resources.
          </p>
        </div>

        {/* Options */}
        {!selectedOption && (
          <div className="p-6 space-y-4">
            {/* Grimoire Option */}
            <button
              onClick={() => setSelectedOption('grimoire')}
              className="w-full p-4 text-left border border-gold/30 rounded-lg hover:border-gold/60 hover:bg-gold/5 transition-colors group"
            >
              <div className="flex items-start gap-3">
                <BrandIcon name="grimoire" size={24} className="mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-cinzel text-cream group-hover:text-gold-light">
                    The Crowlands Grimoire
                  </h3>
                  <p className="text-sm text-cream/60 font-montserrat mt-1">
                    A curated collection of spells, rituals, and practices from the Crowlands tradition.
                  </p>
                  <p className="text-gold font-medium font-montserrat mt-2">$9.99 • Instant PDF Download</p>
                </div>
              </div>
            </button>

            {/* Bespoke Option */}
            <button
              onClick={() => setSelectedOption('bespoke')}
              className="w-full p-4 text-left border border-gold/30 rounded-lg hover:border-gold/60 hover:bg-gold/5 transition-colors group"
            >
              <div className="flex items-start gap-3">
                <BrandIcon name="book" size={24} className="mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-cinzel text-cream group-hover:text-gold-light">
                    Bespoke Spell & Resource Guide
                  </h3>
                  <p className="text-sm text-cream/60 font-montserrat mt-1">
                    A handcrafted spell tailored to your intention, plus a one-pager of suggested resources and practices to source your own magic.
                  </p>
                  <p className="text-gold font-medium font-montserrat mt-2">$29.99 • Delivered via Email</p>
                </div>
              </div>
            </button>

            {/* Continue with AI */}
            <div className="pt-4 border-t border-gold/20">
              <button
                onClick={onClose}
                className="w-full py-2 text-sm text-cream/50 hover:text-cream/80 transition-colors font-montserrat"
              >
                ← Continue with AI-generated spells
              </button>
            </div>
          </div>
        )}

        {/* Grimoire Form */}
        {selectedOption === 'grimoire' && (
          <div className="p-6 space-y-4">
            <button
              onClick={() => setSelectedOption(null)}
              className="text-sm text-cream/50 hover:text-cream/80 flex items-center gap-1 font-montserrat"
            >
              ← Back to options
            </button>
            
            <div className="p-4 bg-gold/10 border border-gold/20 rounded-lg">
              <h3 className="font-cinzel text-gold-light flex items-center gap-2">
                <BrandIcon name="grimoire" size={18} />
                The Crowlands Grimoire
              </h3>
              <p className="text-sm text-cream/60 font-montserrat mt-2">
                A complete guide featuring handcrafted spells, protective workings, and the philosophy behind the Crowlands approach to practical magic.
              </p>
              <p className="text-gold font-medium font-montserrat mt-2">$9.99</p>
            </div>

            <div>
              <label className="block text-sm text-cream/70 font-montserrat mb-1">
                Email for delivery <span className="text-gold">*</span>
              </label>
              <input
                type="email"
                value={bespokeForm.email}
                onChange={(e) => setBespokeForm({ ...bespokeForm, email: e.target.value })}
                placeholder="your@email.com"
                className="w-full px-3 py-2 bg-navy-mid border border-gold/30 rounded text-cream placeholder-cream/30 focus:border-gold focus:outline-none"
              />
            </div>

            <button
              onClick={handleGrimoirePurchase}
              disabled={loading}
              className="w-full py-3 bg-crimson hover:bg-crimson-bright text-cream font-medium rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                'Processing...'
              ) : (
                <>
                  <BrandIcon name="letter" size={16} />
                  Purchase & Download — $9.99
                </>
              )}
            </button>
          </div>
        )}

        {/* Bespoke Form */}
        {selectedOption === 'bespoke' && (
          <div className="p-6 space-y-4">
            <button
              onClick={() => setSelectedOption(null)}
              className="text-sm text-cream/50 hover:text-cream/80 flex items-center gap-1 font-montserrat"
            >
              ← Back to options
            </button>
            
            <div className="p-4 bg-gold/10 border border-gold/20 rounded-lg">
              <h3 className="font-cinzel text-gold-light flex items-center gap-2">
                <BrandIcon name="book" size={18} />
                Bespoke Spell & Resource Guide
              </h3>
              <p className="text-sm text-cream/60 font-montserrat mt-2">
                I&apos;ll personally craft a spell for your intention, plus curate resources to help you develop your own practice.
              </p>
              <p className="text-gold font-medium font-montserrat mt-2">$29.99 • Delivered within 3-5 days</p>
            </div>

            <div>
              <label className="block text-sm text-cream/70 font-montserrat mb-1">
                Your name <span className="text-gold">*</span>
              </label>
              <input
                type="text"
                value={bespokeForm.name}
                onChange={(e) => setBespokeForm({ ...bespokeForm, name: e.target.value })}
                placeholder="What should I call you?"
                className="w-full px-3 py-2 bg-navy-mid border border-gold/30 rounded text-cream placeholder-cream/30 focus:border-gold focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm text-cream/70 font-montserrat mb-1">
                Email for delivery <span className="text-gold">*</span>
              </label>
              <input
                type="email"
                value={bespokeForm.email}
                onChange={(e) => setBespokeForm({ ...bespokeForm, email: e.target.value })}
                placeholder="your@email.com"
                className="w-full px-3 py-2 bg-navy-mid border border-gold/30 rounded text-cream placeholder-cream/30 focus:border-gold focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm text-cream/70 font-montserrat mb-1">
                Your intention <span className="text-gold">*</span>
              </label>
              <textarea
                value={bespokeForm.intention}
                onChange={(e) => setBespokeForm({ ...bespokeForm, intention: e.target.value })}
                placeholder="What do you need? Describe your situation, what you're seeking protection from, or what you want to manifest..."
                rows={4}
                className="w-full px-3 py-2 bg-navy-mid border border-gold/30 rounded text-cream placeholder-cream/30 focus:border-gold focus:outline-none resize-none"
              />
            </div>

            <div>
              <label className="block text-sm text-cream/70 font-montserrat mb-1">
                Tradition preferences <span className="text-cream/50">(optional)</span>
              </label>
              <input
                type="text"
                value={bespokeForm.tradition_preferences}
                onChange={(e) => setBespokeForm({ ...bespokeForm, tradition_preferences: e.target.value })}
                placeholder="e.g., folk magic, ceremonial, nature-based, secular..."
                className="w-full px-3 py-2 bg-navy-mid border border-gold/30 rounded text-cream placeholder-cream/30 focus:border-gold focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm text-cream/70 font-montserrat mb-1">
                Anything else I should know? <span className="text-cream/50">(optional)</span>
              </label>
              <textarea
                value={bespokeForm.additional_notes}
                onChange={(e) => setBespokeForm({ ...bespokeForm, additional_notes: e.target.value })}
                placeholder="Any specific sources you'd like me to explore, constraints, or other context..."
                rows={2}
                className="w-full px-3 py-2 bg-navy-mid border border-gold/30 rounded text-cream placeholder-cream/30 focus:border-gold focus:outline-none resize-none"
              />
            </div>

            <button
              onClick={handleBespokePurchase}
              disabled={loading}
              className="w-full py-3 bg-crimson hover:bg-crimson-bright text-cream font-medium rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                'Processing...'
              ) : (
                <>
                  <BrandIcon name="book" size={16} />
                  Request Bespoke Spell — $29.99
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HandcraftedMagicModal;
