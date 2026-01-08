import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { aiAPI } from '../utils/api';
import { Bot, Send, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { 
  DarkSection, LightSection, GrandDivider, MysticalDivider, 
  OrnateCard, CornerFlourish 
} from '../components/OrnateElements';

export const AIChat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await aiAPI.chat(input, sessionId);
      setSessionId(response.session_id);
      const aiMessage = { role: 'assistant', content: response.response };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      toast.error('Failed to get AI response');
      console.error('AI chat error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Dark Hero Section */}
      <DarkSection className="py-12 sm:py-16 px-4 sm:px-6" variant="warm">
        <CornerFlourish position="top-left" className="absolute top-3 left-3 w-14 h-14 sm:w-18 sm:h-18" />
        <CornerFlourish position="top-right" className="absolute top-3 right-3 w-14 h-14 sm:w-18 sm:h-18" />
        
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <Bot className="w-12 h-12 sm:w-14 sm:h-14 text-crimson-bright mx-auto mb-4"
              style={{ filter: 'drop-shadow(0 0 15px rgba(184, 35, 48, 0.5))' }} />
            
            <h1 className="font-italiana text-3xl sm:text-4xl md:text-5xl text-gold-light mb-3"
              style={{ textShadow: '0 2px 30px rgba(212, 168, 75, 0.5)' }}>
              AI Research Assistant
            </h1>
            <p className="font-montserrat text-sm sm:text-base text-silver-mist/80 max-w-2xl mx-auto">
              Ask questions about deities, historical figures, rituals, and sacred sites from 1910-1945
            </p>
          </motion.div>
          
          <GrandDivider variant="eye" />
        </div>
      </DarkSection>

      {/* Light Parchment Section - Chat Area */}
      <LightSection className="py-8 sm:py-10 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <MysticalDivider light />
          
          {/* Chat Container */}
          <div className="relative">
            <div className="absolute inset-0 border-2 border-crimson/30 rounded-sm" />
            <div className="absolute inset-1.5 border border-gold/30 rounded-sm" />
            <div className="absolute inset-0 bg-white/90 rounded-sm" />
            
            <div className="relative z-10 p-4 sm:p-6">
              {/* Messages Area */}
              <div className="min-h-[400px] max-h-[500px] overflow-y-auto space-y-4 mb-6" data-testid="chat-messages">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center py-16">
                    <div className="w-16 h-16 rounded-full bg-crimson/10 flex items-center justify-center mb-4">
                      <Bot className="w-8 h-8 text-crimson" />
                    </div>
                    <p className="font-montserrat text-sm text-navy-dark/70 max-w-md">
                      Start a conversation by asking about occult history, deities, practices, or any esoteric knowledge
                    </p>
                    <div className="flex flex-wrap gap-2 mt-4 justify-center">
                      {['Who is Hecate?', 'Tell me about Gerald Gardner', 'What are protective rituals?'].map((suggestion) => (
                        <button
                          key={suggestion}
                          onClick={() => setInput(suggestion)}
                          className="px-3 py-1.5 text-xs font-montserrat text-crimson border border-crimson/30 rounded-sm hover:bg-crimson/10 transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  messages.map((msg, idx) => (
                    <div
                      key={idx}
                      data-testid={`chat-message-${idx}`}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] p-4 rounded-sm ${
                          msg.role === 'user'
                            ? 'bg-crimson/10 border border-crimson/30'
                            : 'bg-gold/10 border border-gold/40'
                        }`}
                      >
                        {msg.role === 'assistant' && (
                          <div className="flex items-center gap-2 mb-2">
                            <Bot className="w-4 h-4 text-gold-dark" />
                            <span className="font-cinzel text-xs text-gold-dark">Research Assistant</span>
                          </div>
                        )}
                        <p className="font-montserrat text-sm text-navy-dark leading-relaxed whitespace-pre-wrap">
                          {msg.content}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-gold/10 border border-gold/40 p-4 rounded-sm">
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 text-gold-dark animate-spin" />
                        <span className="font-montserrat text-sm text-navy-dark/70">Consulting the archives...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="flex gap-3">
                <input
                  type="text"
                  data-testid="chat-input"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about Hecate, Gerald Gardner, rituals..."
                  className="flex-1 bg-cream/50 border-2 border-gold/40 focus:border-crimson/50 focus:ring-1 focus:ring-crimson/30 rounded-sm px-4 py-3 text-navy-dark font-montserrat placeholder:text-navy-dark/40"
                />
                <button
                  onClick={handleSend}
                  data-testid="chat-send-button"
                  disabled={loading || !input.trim()}
                  className="px-5 py-3 relative overflow-hidden rounded-sm disabled:opacity-50"
                >
                  <span className="absolute inset-0 border border-gold/50 rounded-sm" />
                  <span className="absolute inset-0.5 bg-gradient-to-r from-crimson-deep via-crimson to-crimson-deep rounded-sm" />
                  <span className="relative text-cream">
                    <Send className="w-5 h-5" />
                  </span>
                </button>
              </div>
            </div>
          </div>
          
          <MysticalDivider light variant="moon" />
        </div>
      </LightSection>
    </div>
  );
};
