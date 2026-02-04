import React, { useState } from 'react';
import { X, Scroll, Sparkles, Mail, BookOpen } from 'lucide-react';
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
      <div className="relative w-full max-w-lg bg-stone-900 border border-amber-900/30 rounded-lg shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="p-6 border-b border-amber-900/20">
          <h2 className="text-xl font-serif text-amber-100 flex items-center gap-2">
            <Sparkles size={20} className="text-amber-500" />
            Prefer Handcrafted Magic?
          </h2>
          <p className="text-sm text-stone-400 mt-2">
            Skip the AI and receive hand-delivered spells and resources.
          </p>
        </div>

        {/* Options */}
        {!selectedOption && (
          <div className="p-6 space-y-4">
            {/* Grimoire Option */}
            <button
              onClick={() => setSelectedOption('grimoire')}
              className="w-full p-4 text-left border border-amber-900/30 rounded-lg hover:border-amber-600/50 hover:bg-amber-900/10 transition-all group"
            >
              <div className="flex items-start gap-3">
                <BookOpen size={24} className="text-amber-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-serif text-amber-100 group-hover:text-amber-50">
                    The Crowlands Grimoire
                  </h3>
                  <p className="text-sm text-stone-400 mt-1">
                    A curated collection of spells, rituals, and practices from the Crowlands tradition.
                  </p>
                  <p className="text-amber-500 font-medium mt-2">$9.99 • Instant PDF Download</p>
                </div>
              </div>
            </button>

            {/* Bespoke Option */}
            <button
              onClick={() => setSelectedOption('bespoke')}
              className="w-full p-4 text-left border border-amber-900/30 rounded-lg hover:border-amber-600/50 hover:bg-amber-900/10 transition-all group"
            >
              <div className="flex items-start gap-3">
                <Scroll size={24} className="text-amber-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-serif text-amber-100 group-hover:text-amber-50">
                    Bespoke Spell & Resource Guide
                  </h3>
                  <p className="text-sm text-stone-400 mt-1">
                    A handcrafted spell tailored to your intention, plus a one-pager of suggested resources and practices to source your own magic.
                  </p>
                  <p className="text-amber-500 font-medium mt-2">$29.99 • Delivered via Email</p>
                </div>
              </div>
            </button>

            {/* Continue with AI */}
            <div className="pt-4 border-t border-amber-900/20">
              <button
                onClick={onClose}
                className="w-full py-2 text-sm text-stone-400 hover:text-stone-300 transition-colors"
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
              className="text-sm text-stone-400 hover:text-stone-300 flex items-center gap-1"
            >
              ← Back to options
            </button>
            
            <div className="p-4 bg-amber-900/10 border border-amber-900/20 rounded-lg">
              <h3 className="font-serif text-amber-100 flex items-center gap-2">
                <BookOpen size={18} className="text-amber-500" />
                The Crowlands Grimoire
              </h3>
              <p className="text-sm text-stone-400 mt-2">
                A complete guide featuring handcrafted spells, protective workings, and the philosophy behind the Crowlands approach to practical magic.
              </p>
              <p className="text-amber-500 font-medium mt-2">$9.99</p>
            </div>

            <div>
              <label className="block text-sm text-stone-300 mb-1">
                Email for delivery <span className="text-amber-500">*</span>
              </label>
              <input
                type="email"
                value={bespokeForm.email}
                onChange={(e) => setBespokeForm({ ...bespokeForm, email: e.target.value })}
                placeholder="your@email.com"
                className="w-full px-3 py-2 bg-stone-800 border border-stone-700 rounded text-stone-100 placeholder-stone-500 focus:border-amber-600 focus:outline-none"
              />
            </div>

            <button
              onClick={handleGrimoirePurchase}
              disabled={loading}
              className="w-full py-3 bg-amber-700 hover:bg-amber-600 text-white font-medium rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                'Processing...'
              ) : (
                <>
                  <Mail size={16} />
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
              className="text-sm text-stone-400 hover:text-stone-300 flex items-center gap-1"
            >
              ← Back to options
            </button>
            
            <div className="p-4 bg-amber-900/10 border border-amber-900/20 rounded-lg">
              <h3 className="font-serif text-amber-100 flex items-center gap-2">
                <Scroll size={18} className="text-amber-500" />
                Bespoke Spell & Resource Guide
              </h3>
              <p className="text-sm text-stone-400 mt-2">
                I'll personally craft a spell for your intention, plus curate resources to help you develop your own practice.
              </p>
              <p className="text-amber-500 font-medium mt-2">$29.99 • Delivered within 3-5 days</p>
            </div>

            <div>
              <label className="block text-sm text-stone-300 mb-1">
                Your name <span className="text-amber-500">*</span>
              </label>
              <input
                type="text"
                value={bespokeForm.name}
                onChange={(e) => setBespokeForm({ ...bespokeForm, name: e.target.value })}
                placeholder="What should I call you?"
                className="w-full px-3 py-2 bg-stone-800 border border-stone-700 rounded text-stone-100 placeholder-stone-500 focus:border-amber-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm text-stone-300 mb-1">
                Email for delivery <span className="text-amber-500">*</span>
              </label>
              <input
                type="email"
                value={bespokeForm.email}
                onChange={(e) => setBespokeForm({ ...bespokeForm, email: e.target.value })}
                placeholder="your@email.com"
                className="w-full px-3 py-2 bg-stone-800 border border-stone-700 rounded text-stone-100 placeholder-stone-500 focus:border-amber-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm text-stone-300 mb-1">
                Your intention <span className="text-amber-500">*</span>
              </label>
              <textarea
                value={bespokeForm.intention}
                onChange={(e) => setBespokeForm({ ...bespokeForm, intention: e.target.value })}
                placeholder="What do you need? Describe your situation, what you're seeking protection from, or what you want to manifest..."
                rows={4}
                className="w-full px-3 py-2 bg-stone-800 border border-stone-700 rounded text-stone-100 placeholder-stone-500 focus:border-amber-600 focus:outline-none resize-none"
              />
            </div>

            <div>
              <label className="block text-sm text-stone-300 mb-1">
                Tradition preferences <span className="text-stone-500">(optional)</span>
              </label>
              <input
                type="text"
                value={bespokeForm.tradition_preferences}
                onChange={(e) => setBespokeForm({ ...bespokeForm, tradition_preferences: e.target.value })}
                placeholder="e.g., folk magic, ceremonial, nature-based, secular..."
                className="w-full px-3 py-2 bg-stone-800 border border-stone-700 rounded text-stone-100 placeholder-stone-500 focus:border-amber-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm text-stone-300 mb-1">
                Anything else I should know? <span className="text-stone-500">(optional)</span>
              </label>
              <textarea
                value={bespokeForm.additional_notes}
                onChange={(e) => setBespokeForm({ ...bespokeForm, additional_notes: e.target.value })}
                placeholder="Any specific sources you'd like me to explore, constraints, or other context..."
                rows={2}
                className="w-full px-3 py-2 bg-stone-800 border border-stone-700 rounded text-stone-100 placeholder-stone-500 focus:border-amber-600 focus:outline-none resize-none"
              />
            </div>

            <button
              onClick={handleBespokePurchase}
              disabled={loading}
              className="w-full py-3 bg-amber-700 hover:bg-amber-600 text-white font-medium rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                'Processing...'
              ) : (
                <>
                  <Scroll size={16} />
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
