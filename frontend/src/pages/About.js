import React from 'react';
import { motion } from 'framer-motion';
import { BrandIcon } from '../components/BrandIcon';
import { DarkSection, LightSection, GrandDivider, MysticalDivider, ElaborateCorner, PageHeader, LightOrnateCard, OrnateCard, ATMOSPHERIC_IMAGES } from '../components/OrnateElements';

export const About = () => {
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
              brandIcon="book"
              title="About Where The Crowlands"
              subtitle="A digital grimoire and ritual builder that demystifies magic"
            />
            <p className="font-crimson text-base sm:text-lg text-gold/90 italic text-center max-w-2xl mx-auto px-2">
              &ldquo;The women who walked before you left their spells in stories, their magic in memories.&rdquo;
            </p>
          </motion.div>
          
          <GrandDivider variant="ouroboros" />
        </div>
      </DarkSection>

      {/* Light Section - The Vision */}
      <LightSection 
        className="py-12 sm:py-16 px-4 sm:px-6"
        atmosphericImage={ATMOSPHERIC_IMAGES.florals}
        atmosphericOpacity={0.10}
        atmosphericPosition="right top"
        atmosphericTint="sepia"
      >
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <LightOrnateCard hover={false}>
              <h2 className="font-cinzel text-xl sm:text-2xl text-crimson mb-4 flex items-center gap-3">
                <BrandIcon name="star" size={28} variant="pink" opacity={0.9} />
                The Vision
              </h2>
              <div className="space-y-4 font-montserrat text-sm sm:text-base text-navy-dark/80 leading-relaxed">
                <p className="drop-cap">
                  Where The Crowlands is a digital grimoire and ritual builder that demystifies magic. 
                  We believe your power doesn&apos;t need permission—and you don&apos;t need expensive services, 
                  gatekeepers, or intermediaries to access it.
                </p>
                <p>
                  Magic isn&apos;t mystical. It&apos;s intentional effort combined with patterns, formulas, and sacred geometry. 
                  Like alchemy before it became chemistry, these are frameworks for focusing will and creating change. 
                  You don&apos;t have to believe in magic for it to work. You just have to practice it.
                </p>
                <p>
                  This archive draws from documented historic and mythological information from the occult revival period (1910-1945). 
                  Gardner, Fortune, Crowley, and others weren&apos;t mystics—they were experimenters synthesizing patterns 
                  that produced results. Human-curated foundations with AI-informed expansions inspire this work. 
                  We encourage you to verify sources and use for inspiration.
                </p>
              </div>
            </LightOrnateCard>
          </motion.div>
          
          <MysticalDivider light />
          
          {/* Historical Disclaimer */}
          <div className="mt-4 text-center">
            <p className="font-montserrat text-xs text-navy-dark/50 italic">
              This project blends documented history, folklore, and myth. Please verify sources and use in good faith.
            </p>
          </div>
        </div>
      </LightSection>

      {/* Dark Section - The Four Guides */}
      <DarkSection className="py-12 sm:py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <OrnateCard hover={false}>
              <h2 className="font-cinzel text-xl sm:text-2xl text-gold-light mb-6 flex items-center gap-3">
                <BrandIcon name="skull" size={28} opacity={0.85} />
                The Four Guides
              </h2>
              <div className="space-y-6">
                <div className="border-l-2 border-gold/40 pl-4">
                  <h3 className="font-cinzel text-lg text-crimson-bright mb-2">🐦 Shigg</h3>
                  <p className="font-montserrat text-sm text-cream/80 leading-relaxed">
                    The Birds of Parliament Poet Laureate. Born in London&apos;s West End, Shigg survived the 
                    Blitz in Dagenham with her sisters and parents, finding strength in poetry and family. 
                    The Rubáiyát of Omar Khayyám became her guiding star. She teaches that strength is found 
                    in gentleness, and every ritual—no matter how humble—can be an act of courage.
                  </p>
                </div>

                <div className="border-l-2 border-gold/40 pl-4">
                  <h3 className="font-cinzel text-lg text-crimson-bright mb-2">🪶 Cathleen</h3>
                  <p className="font-montserrat text-sm text-cream/80 leading-relaxed">
                    The Singer of Strength. A trained tailor and couturier from London&apos;s West End, Cathleen&apos;s 
                    voice is her greatest talisman—a powerful soprano that became spellwork. Rooted in British 
                    Spiritualism, she practices table-tipping, home circles, and psychic intuition.
                  </p>
                </div>

                <div className="border-l-2 border-gold/40 pl-4">
                  <h3 className="font-cinzel text-lg text-crimson-bright mb-2">🐦 Katherine</h3>
                  <p className="font-montserrat text-sm text-cream/80 leading-relaxed">
                    The Weaver of Hidden Knowledge. Born in Victorian Spitalfields into a Huguenot community, 
                    Katherine was a master tailor, weaver, and court dressmaker. Her rituals blend craft, 
                    séance methodology, and shadow work. She teaches that darkness is not evil—it is fertile.
                  </p>
                </div>

                <div className="border-l-2 border-gold/40 pl-4">
                  <h3 className="font-cinzel text-lg text-crimson-bright mb-2">🪽 Theresa</h3>
                  <p className="font-montserrat text-sm text-cream/80 leading-relaxed">
                    The Seer & Storyteller. Journalist, historian, and truth-seeker, Theresa uncovered hidden 
                    paternity, mapped generational trauma, and broke the &ldquo;veil spell&rdquo; through research and ritual. 
                    She blends factual investigation with mystical insight.
                  </p>
                </div>
              </div>
            </OrnateCard>
          </motion.div>
          
          <GrandDivider variant="eye" />
        </div>
      </DarkSection>

      {/* Light Section - The Archive */}
      <LightSection className="py-12 sm:py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <LightOrnateCard hover={false}>
              <h2 className="font-cinzel text-xl sm:text-2xl text-crimson mb-4 flex items-center gap-3">
                <BrandIcon name="book" size={28} variant="pink" opacity={0.9} />
                The Archive
              </h2>
              <div className="space-y-4 font-montserrat text-sm sm:text-base text-navy-dark/80 leading-relaxed">
                <p>
                  Our database includes deities, historical practitioners, sacred sites, documented rituals, 
                  and a timeline of the Western occult revival. Every entry is researched and cited. We don&apos;t 
                  gatekeep knowledge—we share it.
                </p>
                <p>
                  The AI spell generator creates personalized rituals based on your intention, historical precedent, 
                  and the wisdom of your chosen guide. Each spell includes materials, step-by-step instructions, 
                  spoken words, historical sources, and optional custom imagery.
                </p>
                <p>
                  Your grimoire is private. Your spells are yours. You can save them, download them as PDFs, 
                  compile them into books, and adapt them as you see fit. Magic is open-source.
                </p>
              </div>
            </LightOrnateCard>
          </motion.div>
          
          <MysticalDivider variant="moon" light />
        </div>
      </LightSection>

      {/* Dark Footer Section - Philosophy */}
      <DarkSection className="py-12 sm:py-16 px-4 sm:px-6" variant="warm">
        <ElaborateCorner className="absolute bottom-3 left-3 w-16 h-16 sm:w-20 sm:h-20 -rotate-90" variant="gold" />
        <ElaborateCorner className="absolute bottom-3 right-3 w-16 h-16 sm:w-20 sm:h-20 rotate-180" variant="gold" />
        
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <OrnateCard hover={false}>
              <h2 className="font-cinzel text-xl sm:text-2xl text-gold-light mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-crimson-bright" />
                Our Philosophy
              </h2>
              <div className="space-y-4 font-crimson text-sm sm:text-base text-cream/80 leading-relaxed italic">
                <p>
                  &ldquo;You don&apos;t need to buy empowerment. You already have your intuition, your will, and 
                  your ability to create ritual. This archive just shows you the formulas others have used—adapt 
                  them, break them, build your own.&rdquo;
                </p>
                <p>
                  We don&apos;t believe in gatekeeping, expensive services, or mystical hierarchies. The women who 
                  walked before you practiced in secret because they had to. You don&apos;t. Your power doesn&apos;t need 
                  permission.
                </p>
              </div>
            </OrnateCard>
          </motion.div>
          
          <div className="text-center mt-8">
            <div className="flex items-center justify-center gap-4 text-gold/50">
              <span>☽</span>
              <span className="text-crimson/60">❦</span>
              <span>🐦</span>
              <span className="text-crimson/60">❦</span>
              <span>☾</span>
            </div>
          </div>
        </div>
      </DarkSection>
    </div>
  );
};
