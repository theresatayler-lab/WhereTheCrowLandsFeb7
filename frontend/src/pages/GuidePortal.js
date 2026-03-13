import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { aiAPI } from '../utils/api';
import { SpellBlockRenderer } from '../components/SpellBlockRenderer';
import { DarkSection, LightSection, PageHeader } from '../components/OrnateElements';
import { Send, Loader2, ChevronLeft } from 'lucide-react';
import { toast } from 'sonner';
import SpellPageFrame from "../components/spell/SpellPageFrame";
import SpellHeader from "../components/spell/SpellHeader";
import TarotSummaryCard from "../components/spell/TarotSummaryCard";
import SpellBookView from "../components/spell/SpellBookView";

// ===== GUIDE CONFIGURATIONS =====
const GUIDE_CONFIGS = {
  shigg: {
    name: 'Shigg',
    title: "Shigg's Kitchen Table",
    subtitle: 'Domestic magic, bird oracles, literary rituals & tea divination',
    buttonText: 'Put the kettle on',
    iconSrc: '/icons/guides/guide-shigg.png',
    colors: { accent: 'amber-500', bg: 'amber-900/15', border: 'amber-600', text: 'amber-400' },
    greeting: "Come sit, love. The kettle's on. What's troubling you?",
    placeholder: "Tell Shigg what's on your mind... I need courage to speak up at work... I'm grieving and need comfort... I can't see my way through this...",
    interactionModel: 'conversation',
    followUps: [
      "When did this start, love?",
      "What have you got in the cupboard? Tea, candles, herbs?",
      "Is this fear or grief? They wear the same face sometimes."
    ]
  },
  cathleen: {
    name: 'Cathleen',
    title: "Cathleen's Vigil",
    subtitle: 'Protection magic, spiritualist practices & kitchen improvisation',
    buttonText: 'Answer the call',
    iconSrc: '/icons/guides/guide-cathleen.png',
    colors: { accent: 'teal-500', bg: 'teal-900/15', border: 'teal-600', text: 'teal-400' },
    greeting: "You're needed. Sit down and I'll tell you why.",
    placeholder: "Tell Cathleen what needs protecting... Someone crossed a line... I need to feel safe... I need protection for someone I love...",
    interactionModel: 'assessment',
    followUps: [
      "Who needs protecting? You or someone else?",
      "What do you have on hand right now? Salt, candle, jar, anything?",
      "How long has this been going on?"
    ]
  },
  katherine: {
    name: 'Katherine',
    title: "Katherine's Sitting Room",
    subtitle: 'Thread magic, mirror work, justice spells & Victorian diagnostics',
    buttonText: 'Enter the sitting room',
    iconSrc: '/icons/guides/guide-katherine.png',
    colors: { accent: 'violet-500', bg: 'violet-900/15', border: 'violet-600', text: 'violet-400' },
    greeting: "Sit. Let me look at you. Yes, I can see what this is about.",
    placeholder: "Katherine already knows, but tell her anyway... Someone betrayed me... I need justice... I'm tangled up in something I can't see clearly...",
    interactionModel: 'diagnostic',
    followUps: [
      "Tell me the exact date this started. Don't approximate.",
      "Do you want justice or revenge? They're not the same.",
      "Do you have thread, scissors, or a mirror to hand?"
    ]
  },
  theresa: {
    name: 'Theresa',
    title: "Theresa's Threshold",
    subtitle: 'Historical synthesis, modern divination & sign-reading',
    buttonText: 'Cross the threshold',
    iconSrc: '/icons/guides/guide-theresa.png',
    colors: { accent: 'rose-500', bg: 'rose-900/15', border: 'rose-600', text: 'rose-400' },
    greeting: "Here's what they did then, here's what you do now. Let me show you the bridge.",
    placeholder: "Tell Theresa what you're seeking... I need clarity about a decision... I keep seeing the same signs everywhere... I want to understand this practice's history...",
    interactionModel: 'threshold_bridge',
    followUps: [
      "What are you trying to understand? Not fix—understand.",
      "Where do signs appear for you? Music, art, nature, daily life?",
      "How much time can you give to watching? A day, three days, a week?"
    ]
  },
  brenda: {
    name: 'Brenda',
    title: "Brenda's Letter Box",
    subtitle: 'Epistolary meditation, Hermetic pathworking & sustained workings',
    buttonText: 'Write to Brenda',
    iconSrc: '/icons/guides/guide-brenda.png',
    colors: { accent: 'indigo-500', bg: 'indigo-900/15', border: 'indigo-600', text: 'indigo-400' },
    greeting: "Dear friend, I received your letter. Let me tell you what I see.",
    placeholder: "Write to Brenda about what you're facing... Dear Brenda, I feel lost and need guidance... I'm going through a major life change... I want to commit to a sustained practice...",
    interactionModel: 'letter_correspondence',
    followUps: [
      "How much time can you commit to daily practice? Five minutes, ten, fifteen?",
      "Is this a single question or a longer journey you're beginning?",
      "Which element calls to you? Earth, air, fire, or water?"
    ]
  }
};

// ===== MAIN COMPONENT =====
export const GuidePortal = () => {
  const { guideId } = useParams();
  const navigate = useNavigate();
  const guide = GUIDE_CONFIGS[guideId];
  const chatEndRef = useRef(null);

  const [phase, setPhase] = useState('greeting'); // greeting, conversation, generating, result
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [followUpIndex, setFollowUpIndex] = useState(0);
  const [spellResult, setSpellResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [jobId, setJobId] = useState(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, phase]);

  if (!guide) {
    return (
      <DarkSection>
        <div className="text-center py-20">
          <p className="text-cream text-xl">Guide not found.</p>
          <button onClick={() => navigate('/guides')} className="mt-4 text-gold underline">
            Return to guides
          </button>
        </div>
      </DarkSection>
    );
  }

  const guideIconSrc = guide.iconSrc;

  const addMessage = (role, text) => {
    setMessages(prev => [...prev, { role, text, timestamp: Date.now() }]);
  };

  const handleStart = () => {
    setPhase('conversation');
    addMessage('guide', guide.greeting);
  };

  const handleSend = async () => {
    if (!userInput.trim()) return;
    const input = userInput.trim();
    setUserInput('');
    addMessage('user', input);

    // After user's first message, ask a follow-up
    if (followUpIndex < guide.followUps.length) {
      setTimeout(() => {
        addMessage('guide', guide.followUps[followUpIndex]);
        setFollowUpIndex(prev => prev + 1);
      }, 800);
    }

    // After enough conversation, offer to generate
    if (followUpIndex >= 1) {
      setTimeout(() => {
        addMessage('guide', getReadyMessage(guide.interactionModel));
      }, 1600);
    }
  };

  const getReadyMessage = (model) => {
    switch (model) {
      case 'conversation': return "Right then, love. I know what you need. Shall I brew something up for you?";
      case 'assessment': return "I see it clearly now. Ready for me to set the work?";
      case 'diagnostic': return "The pattern's clear. Let me thread this together for you.";
      case 'threshold_bridge': return "I've found the lineage. Let me show you the bridge between then and now.";
      case 'letter_correspondence': return "I understand your situation, dear friend. Shall I begin your first letter?";
      default: return "I'm ready to create your working. Shall I begin?";
    }
  };

  const handleGenerate = async () => {
    setPhase('generating');
    setLoading(true);
    setProgress(0);

    // Build the full conversation context for the spell
    const conversationText = messages
      .filter(m => m.role === 'user')
      .map(m => m.text)
      .join(' ');

    try {
      const token = localStorage.getItem('token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const backendUrl = process.env.REACT_APP_BACKEND_URL || '';
      const response = await fetch(`${backendUrl}/api/ai/generate-spell-job`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          spell_spec: {
            persona_id: guideId,
            user_query: conversationText,
            desired_feeling: 'calm',
            time: '10_min',
            tone: 'practical',
            belief_boundary: 'spiritual_grounded',
            anchor_object: getDefaultAnchor(guideId),
            setting: 'home_quiet',
            interaction_model: guide.interactionModel
          },
          belief_mode: 'SPIRITUAL',
          generate_images: false
        })
      });

      const data = await response.json();

      if (data.job_id) {
        setJobId(data.job_id);
        pollForResult(data.job_id);
      } else {
        throw new Error(data.detail || 'Failed to start spell generation');
      }
    } catch (err) {
      console.error('Spell generation error:', err);
      toast.error('Something went wrong. Please try again.');
      setPhase('conversation');
      setLoading(false);
    }
  };

  const getDefaultAnchor = (id) => {
    const defaults = { shigg: 'tea', cathleen: 'candle', katherine: 'thread', theresa: 'notebook', brenda: 'letter' };
    return defaults[id] || 'candle';
  };

  const pollForResult = async (jid) => {
    const backendUrl = process.env.REACT_APP_BACKEND_URL || '';
    const maxAttempts = 60;
    let attempts = 0;

    const poll = async () => {
      attempts++;
      if (attempts > maxAttempts) {
        toast.error('Generation timed out. Please try again.');
        setPhase('conversation');
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${backendUrl}/api/ai/spell-job/${jid}`);
        const data = await res.json();

        if (data.progress) setProgress(data.progress);

        if (data.status === 'complete' && data.result) {
          // Backend wraps spell in result.spell — extract it, with fallback
          const spell = data.result.spell || data.result;
          // Attach metadata/archetype if available for display
          if (data.result.archetype) spell._archetype = data.result.archetype;
          if (data.result.metadata) spell._metadata = data.result.metadata;
          setSpellResult(spell);
          setPhase('result');
          setLoading(false);
        } else if (data.status === 'failed') {
          toast.error(data.error || 'Spell generation failed.');
          setPhase('conversation');
          setLoading(false);
        } else {
          setTimeout(poll, 3000);
        }
      } catch (err) {
        setTimeout(poll, 5000);
      }
    };

    poll();
  };

  return (
    <DarkSection className="min-h-screen">
      {/* Back navigation */}
      <div className="max-w-3xl mx-auto px-4 pt-6">
        <button
          onClick={() => navigate('/guides')}
          className="flex items-center gap-2 text-gold/70 hover:text-gold transition-colors font-montserrat text-sm"
        >
          <ChevronLeft className="w-4 h-4" /> All Guides
        </button>
      </div>

      {/* Header */}
      <div className="max-w-3xl mx-auto px-4 pt-4 pb-2 text-center">
        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-${guide.colors.bg} border border-${guide.colors.border}/30 mb-4`}>
          <img src={guideIconSrc} alt={guide.name} className="w-10 h-10 rounded-full object-cover" />
        </div>
        <h1 className="font-cinzel text-3xl text-cream font-bold">{guide.title}</h1>
        <p className={`font-montserrat text-sm text-${guide.colors.text} mt-2`}>{guide.subtitle}</p>
      </div>

      {/* Greeting Phase */}
      <AnimatePresence mode="wait">
        {phase === 'greeting' && (
          <motion.div
            key="greeting"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-3xl mx-auto px-4 py-6 text-center"
          >
            <div className={`bg-${guide.colors.bg} border border-${guide.colors.border}/20 rounded-lg p-8 mb-8`}>
              <p className="font-crimson-text text-xl text-cream italic leading-relaxed">
                "{guide.greeting}"
              </p>
              <p className={`font-montserrat text-sm text-${guide.colors.text} mt-4`}>
                — {guide.name}
              </p>
            </div>
            <button
              onClick={handleStart}
              className={`font-cinzel text-lg px-8 py-3 bg-crimson hover:bg-crimson/80 text-cream rounded-sm transition-colors border border-gold/20`}
            >
              {guide.buttonText}
            </button>
          </motion.div>
        )}

        {/* Conversation Phase */}
        {phase === 'conversation' && (
          <motion.div
            key="conversation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-3xl mx-auto px-4 pb-32"
          >
            <div className="space-y-4 mb-6">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] rounded-lg px-4 py-3 ${
                    msg.role === 'user'
                      ? 'bg-crimson/20 border border-crimson/30 text-cream'
                      : `bg-${guide.colors.bg} border border-${guide.colors.border}/20 text-cream`
                  }`}>
                    {msg.role === 'guide' && (
                      <p className={`font-montserrat text-xs text-${guide.colors.text} mb-1 font-semibold`}>
                        {guide.name}
                      </p>
                    )}
                    <p className="font-crimson-text text-base leading-relaxed">{msg.text}</p>
                  </div>
                </motion.div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Generate button appears after enough conversation */}
            {followUpIndex >= 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center mb-6"
              >
                <button
                  onClick={handleGenerate}
                  className="font-cinzel px-6 py-3 bg-crimson hover:bg-crimson/80 text-cream rounded-sm transition-colors border border-gold/20"
                >
                  Create my working
                </button>
              </motion.div>
            )}

            {/* Input area - fixed at bottom */}
            <div className="fixed bottom-0 left-0 right-0 bg-navy-dark border-t border-gold/10 p-4">
              <div className="max-w-3xl mx-auto flex gap-3">
                <textarea
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }}}
                  placeholder={guide.placeholder}
                  rows={2}
                  className="flex-1 bg-cream/10 border border-gold/20 rounded-sm px-4 py-2 text-cream font-crimson-text text-sm placeholder:text-cream/50 resize-none focus:border-gold/40 focus:outline-none"
                />
                <button
                  onClick={handleSend}
                  disabled={!userInput.trim()}
                  className={`px-4 rounded-sm bg-${guide.colors.accent} hover:bg-${guide.colors.accent}/80 text-white disabled:opacity-30 transition-colors`}
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Generating Phase */}
        {phase === 'generating' && (
          <motion.div
            key="generating"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-3xl mx-auto px-4 py-20 text-center"
          >
            <Loader2 className={`w-12 h-12 text-${guide.colors.text} mx-auto animate-spin mb-6`} />
            <p className="font-cinzel text-xl text-cream mb-2">
              {guide.name} is crafting your working...
            </p>
            <p className="font-montserrat text-sm text-cream/60 mb-6">
              This takes about 60-90 seconds
            </p>
            <div className="w-64 mx-auto bg-cream/10 rounded-full h-2">
              <div
                className={`h-2 rounded-full bg-${guide.colors.accent} transition-all duration-1000`}
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="font-montserrat text-xs text-cream/50 mt-2">{Math.round(progress)}%</p>
          </motion.div>
        )}

        {/* Result Phase */}
        {phase === 'result' && spellResult && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto px-4 pb-20"
          >
            <SpellPageFrame>
              {/* SpellBookView - Flippable card + Full ritual design */}
              <SpellBookView
                tarotImageUrl={spellResult?.asset_plan?.generated_assets?.tarot_card_image || spellResult?.tarot_card_image || null}
                title={spellResult?.tarot_card?.title || spellResult?.title || "Your Spell"}
                guideName={spellResult?.archetype_name || guide.name}
                spellNumber={spellResult?.spell_number || "I"}
                spell={spellResult}
              >
                {/* Spell Content */}
                {spellResult.blocks ? (
                  <SpellBlockRenderer
                    spell={spellResult}
                    archetypeStyle={{
                      borderColor: `border-${guide.colors.border}`,
                      accentColor: `text-${guide.colors.accent}`,
                      bgAccent: 'bg-[#F3EFE8]',
                      textMuted: 'text-navy-dark/70'
                    }}
                  />
                ) : (
                  <div className="font-crimson text-navy-dark whitespace-pre-wrap leading-relaxed">
                    {spellResult.content || spellResult.spell_text || JSON.stringify(spellResult, null, 2)}
                  </div>
                )}

                {/* Ethics Statement */}
                {spellResult.ethics_statement && (
                  <div className="mt-8 pt-6 border-t border-gold/30">
                    <p className="font-crimson text-navy-dark/70 text-sm italic leading-relaxed">
                      {spellResult.ethics_statement}
                    </p>
                  </div>
                )}
              </SpellBookView>

              {/* Research Sources - Outside the book view */}
              {spellResult.sources && spellResult.sources.length > 0 && (
                <div className="mt-8 p-6 bg-gold/5 border border-gold/20 rounded-lg">
                  <h3 className="font-cinzel text-lg text-crimson font-semibold mb-4">Sources & Further Reading</h3>
                  <div className="space-y-3">
                    {spellResult.sources.map((source, i) => (
                      <div key={i} className="bg-white/50 rounded p-3">
                        <p className="font-crimson text-navy-dark font-semibold text-sm">
                          {source.author && `${source.author} — `}
                          <span className="italic">{source.work || source.title}</span>
                          {source.year && ` (${source.year})`}
                        </p>
                        {source.relevance && (
                          <p className="font-crimson text-navy-dark/70 text-sm mt-1">{source.relevance}</p>
                        )}
                        {source.further_reading_note && (
                          <p className="font-crimson text-navy-dark/60 text-xs mt-1 italic">{source.further_reading_note}</p>
                        )}
                        {source.learn_more_url && (
                          <a href={source.learn_more_url} target="_blank" rel="noopener noreferrer"
                            className="font-montserrat text-xs text-amber-700 hover:text-amber-900 mt-1 inline-block">
                            Learn more
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </SpellPageFrame>

            <div className="text-center mt-8 space-x-4">
              <button
                onClick={() => {
                  setPhase('greeting');
                  setMessages([]);
                  setFollowUpIndex(0);
                  setSpellResult(null);
                }}
                className="font-cinzel px-6 py-2 border border-gold/30 text-cream hover:bg-gold/10 rounded-sm transition-colors"
              >
                Start over
              </button>
              <button
                onClick={() => navigate('/my-grimoire')}
                className="font-cinzel px-6 py-2 bg-crimson text-cream hover:bg-crimson/80 rounded-sm transition-colors"
              >
                View Grimoire
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </DarkSection>
  );
};

export default GuidePortal;
