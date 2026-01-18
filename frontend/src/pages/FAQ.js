import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { DarkSection, LightSection, GrandDivider, MysticalDivider, ElaborateCorner, PageHeader, ATMOSPHERIC_IMAGES } from '../components/OrnateElements';

const faqs = [
  {
    category: 'About the App',
    questions: [
      {
        q: 'What is Where The Crowlands?',
        a: 'Where The Crowlands is a DIY ritual builder and historical witchcraft archive. We provide tested formulas from the occult revival period (1910-1945), guided by four historical women who each practiced their own form of magic. You can generate personalized spells, save them to your grimoire, and build your own practice without gatekeepers or expensive services.'
      },
      {
        q: 'Who are the four guides?',
        a: 'Shigg - The Birds of Parliament Poet Laureate, drawing on Rubáiyát wisdom and bird oracle traditions; Cathleen - The Singer of Strength, bridging British Spiritualism and voice magic; Katherine - The Weaver of Hidden Knowledge, master of craft-based sympathetic magic; and Theresa - The Seer & Storyteller. Each guide has a unique voice, ritual style, and area of expertise spanning over a century of practice.'
      },
      {
        q: 'Do I have to choose a guide?',
        a: "No. You can generate spells with neutral Crowlands guidance, or you can work with any of the four guides. Each guide brings their own personality, historical context, and ritual style to the spells they craft. You can change guides anytime or work with all of them."
      }
    ]
  },
  {
    category: 'How It Works',
    questions: [
      {
        q: 'How does spell generation work?',
        a: "You describe your intention or need (e.g., \"I need courage for a new beginning\"). Our AI, informed by historical sources and your chosen guide's persona, creates a complete ritual including materials, timing, step-by-step instructions, spoken words, and historical context. Each spell is personalized to your specific situation."
      },
      {
        q: 'Are these real historical spells?',
        a: "The spells are based on documented patterns and practices from the occult revival period (1910-1945), synthesized by figures like Gerald Gardner, Dion Fortune, and Aleister Crowley. They're adapted and personalized for modern practitioners. All historical sources are cited within each spell."
      },
      {
        q: 'Can I save my spells?',
        a: 'Yes! Pro members can save unlimited spells to their personal grimoire, download them as PDFs, and access them anytime. Free users can generate and view spells but cannot save or download them.'
      },
      {
        q: "What's included in each spell?",
        a: 'Every spell includes: a title and introduction, required materials with icons, optimal timing (moon phase, time of day), step-by-step instructions, spoken words and incantations, historical context with sources, variations and adaptations, ethical considerations, and optional custom imagery.'
      }
    ]
  },
  {
    category: 'Subscriptions & Pricing',
    questions: [
      {
        q: 'Is there a free version?',
        a: 'Yes! Free users can generate up to 3 spells per month and explore all the historical archive content (deities, practitioners, sacred sites, rituals, timeline). You cannot save spells to your grimoire or download PDFs without upgrading.'
      },
      {
        q: 'How much does Pro cost?',
        a: 'Pro membership is $19 per year (less than $2/month). This unlocks unlimited spell generation, unlimited grimoire saves, PDF downloads, and access to all premium features as we add them.'
      },
      {
        q: 'Can I cancel my subscription?',
        a: "Yes, you can cancel anytime through your account profile. You'll retain Pro access until the end of your billing period. No refunds for partial years, but you keep everything you've saved."
      }
    ]
  },
  {
    category: 'Privacy & Ethics',
    questions: [
      {
        q: 'Is my data private?',
        a: "Yes. Your grimoire entries, saved spells, and personal notes are private to your account. We don't sell data, don't share spell content, and don't analyze your rituals. Payment is handled by Stripe—we never see your card details."
      },
      {
        q: 'What about AI and privacy?',
        a: "Spell generation uses AI to create personalized content. Your intentions are processed but not stored beyond your session. We don't train models on your personal rituals or share your queries with third parties."
      },
      {
        q: 'Is this a real religion or cult?',
        a: "No. Where The Crowlands is a creative and educational tool, not a religious organization. We present historical practices from documented sources. You decide what to believe, what to practice, and what to ignore. We're a library, not a church."
      }
    ]
  }
];

const FAQItem = ({ question, answer, isOpen, onToggle, isLight }) => (
  <div className={`border-b ${isLight ? 'border-crimson/20' : 'border-gold/20'} last:border-b-0`}>
    <button
      className="w-full py-4 flex items-start justify-between text-left"
      onClick={onToggle}
    >
      <span className={`font-cinzel text-sm sm:text-base ${isLight ? 'text-crimson' : 'text-gold-light'} pr-4`}>
        {question}
      </span>
      <ChevronDown 
        className={`w-5 h-5 flex-shrink-0 transition-transform ${isLight ? 'text-crimson/60' : 'text-gold/60'} ${isOpen ? 'rotate-180' : ''}`} 
      />
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <p className={`pb-4 font-montserrat text-sm leading-relaxed ${isLight ? 'text-navy-dark/70' : 'text-cream/70'}`}>
            {answer}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const FAQCategory = ({ category, questions, isLight }) => {
  const [openIndex, setOpenIndex] = useState(null);
  
  return (
    <div className={`rounded-lg overflow-hidden ${isLight ? 'bg-cream/60 border-2 border-crimson/20' : 'bg-navy-mid/40 border-2 border-gold/30'}`}>
      <div className={`px-5 py-3 ${isLight ? 'bg-crimson/10 border-b border-crimson/20' : 'bg-gold/10 border-b border-gold/20'}`}>
        <h3 className={`font-cinzel text-lg ${isLight ? 'text-crimson' : 'text-gold-light'}`}>
          {category}
        </h3>
      </div>
      <div className="px-5">
        {questions.map((item, index) => (
          <FAQItem
            key={index}
            question={item.q}
            answer={item.a}
            isOpen={openIndex === index}
            onToggle={() => setOpenIndex(openIndex === index ? null : index)}
            isLight={isLight}
          />
        ))}
      </div>
    </div>
  );
};

export const FAQ = () => {
  return (
    <div className="min-h-screen">
      {/* Dark Hero Section */}
      <DarkSection className="py-12 sm:py-16 md:py-20 px-4 sm:px-6" variant="warm">
        <ElaborateCorner className="absolute top-3 left-3 w-16 h-16 sm:w-20 sm:h-20" variant="gold" />
        <ElaborateCorner className="absolute top-3 right-3 w-16 h-16 sm:w-20 sm:h-20 rotate-90" variant="gold" />
        
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <PageHeader 
              icon={HelpCircle}
              title="Frequently Asked Questions"
              subtitle="Everything you need to know about Where The Crowlands"
            />
          </motion.div>
          
          <GrandDivider variant="eye" />
        </div>
      </DarkSection>

      {/* Alternating FAQ Sections */}
      {faqs.map((section, index) => (
        index % 2 === 0 ? (
          <LightSection 
            key={section.category} 
            className="py-10 sm:py-14 px-4 sm:px-6"
            atmosphericImage={index === 0 ? ATMOSPHERIC_IMAGES.peonies : null}
            atmosphericOpacity={0.10}
            atmosphericPosition="right center"
            atmosphericTint="sepia"
          >
            <div className="max-w-3xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <FAQCategory 
                  category={section.category} 
                  questions={section.questions} 
                  isLight={true}
                />
              </motion.div>
              {index < faqs.length - 1 && <MysticalDivider light />}
            </div>
          </LightSection>
        ) : (
          <DarkSection key={section.category} className="py-10 sm:py-14 px-4 sm:px-6">
            <div className="max-w-3xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <FAQCategory 
                  category={section.category} 
                  questions={section.questions} 
                  isLight={false}
                />
              </motion.div>
              {index < faqs.length - 1 && <GrandDivider />}
            </div>
          </DarkSection>
        )
      ))}

      {/* Footer */}
      <DarkSection className="py-10 px-4 sm:px-6" variant="warm">
        <ElaborateCorner className="absolute bottom-3 left-3 w-16 h-16 sm:w-20 sm:h-20 -rotate-90" variant="gold" />
        <ElaborateCorner className="absolute bottom-3 right-3 w-16 h-16 sm:w-20 sm:h-20 rotate-180" variant="gold" />
        
        <div className="max-w-2xl mx-auto text-center relative z-10">
          <p className="font-crimson text-sm text-cream/60 italic mb-4">
            Still have questions? Your guides are always here to help.
          </p>
          <div className="flex items-center justify-center gap-4 text-gold/50">
            <span>☽</span>
            <span className="text-crimson/60">❦</span>
            <span>❓</span>
            <span className="text-crimson/60">❦</span>
            <span>☾</span>
          </div>
        </div>
      </DarkSection>
    </div>
  );
};
