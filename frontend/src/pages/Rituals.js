import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ritualsAPI } from '../utils/api';
import { Scroll, Sparkles } from 'lucide-react';
import { DarkSection, PageBorderFrame, PageHeader, OrnateCard, GrandDivider, MysticalDivider } from '../components/OrnateElements';

export const Rituals = () => {
  const [rituals, setRituals] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  const categories = ['Invocation', 'Protection', 'Offering', 'Fertility', 'Transformation'];

  useEffect(() => {
    fetchRituals();
  }, [selectedCategory]);

  const fetchRituals = async () => {
    try {
      const data = await ritualsAPI.getAll(selectedCategory);
      setRituals(data);
    } catch (error) {
      console.error('Failed to fetch rituals:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DarkSection className="min-h-screen flex items-center justify-center" variant="warm">
        <Scroll className="w-12 h-12 text-gold animate-pulse" />
      </DarkSection>
    );
  }

  return (
    <PageBorderFrame>
      <DarkSection className="min-h-screen py-12 sm:py-20 px-4 sm:px-6" variant="warm">
        <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <PageHeader 
            icon={Scroll}
            title="Documented Rituals"
            subtitle="Ceremonial practices preserved from the occult revival era"
          />
        </motion.div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 sm:gap-3 justify-center mb-8 sm:mb-12">
          <button
            data-testid="category-all"
            onClick={() => setSelectedCategory(null)}
            className={`px-4 sm:px-6 py-2 rounded-sm font-montserrat text-xs sm:text-sm tracking-wider transition-all duration-300 ${
              selectedCategory === null
                ? 'bg-gradient-to-r from-gold-dark via-gold to-gold-dark text-navy-dark border border-crimson/30'
                : 'bg-transparent text-gold border border-gold/30 hover:bg-gold/10'
            }`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              data-testid={`category-${category.toLowerCase()}`}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 sm:px-6 py-2 rounded-sm font-montserrat text-xs sm:text-sm tracking-wider transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-gold-dark via-gold to-gold-dark text-navy-dark border border-crimson/30'
                  : 'bg-transparent text-gold border border-gold/30 hover:bg-gold/10'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <GrandDivider variant="default" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {rituals.map((ritual, index) => (
            <motion.div
              key={ritual.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <OrnateCard hover={false} testId={`ritual-card-${ritual.id}`}>
                <div className="flex items-start justify-between mb-4">
                  {/* Title in gold for visibility */}
                  <h3 className="font-cinzel text-lg sm:text-xl text-gold flex-1" style={{ textShadow: '0 2px 10px rgba(200, 164, 77, 0.3)' }}>
                    {ritual.name}
                  </h3>
                  {/* Category badge */}
                  <span className="px-3 py-1 bg-crimson/20 border border-crimson/40 rounded-sm font-montserrat text-xs text-crimson-bright">
                    {ritual.category}
                  </span>
                </div>
                {/* Description in cream for readability */}
                <p className="font-montserrat text-sm text-cream/85 leading-relaxed mb-4">
                  {ritual.description}
                </p>
                {ritual.deity_association && (
                  <div className="mb-3">
                    <span className="font-montserrat text-xs uppercase tracking-widest text-crimson-bright">Associated: </span>
                    <span className="font-montserrat text-sm text-gold-light">{ritual.deity_association}</span>
                  </div>
                )}
                <MysticalDivider />
                <div className="flex flex-wrap gap-4 text-xs font-montserrat text-muted-brass/70">
                  <div>
                    <span className="uppercase tracking-wider text-gold/60">Period: </span>
                    <span className="text-cream/80">{ritual.time_period}</span>
                  </div>
                  <div>
                    <span className="uppercase tracking-wider text-gold/60">Source: </span>
                    <span className="text-cream/80">{ritual.source}</span>
                  </div>
                </div>
              </OrnateCard>
            </motion.div>
          ))}
        </div>

        {rituals.length === 0 && (
          <div className="text-center py-12">
            <Sparkles className="w-12 h-12 text-gold/50 mx-auto mb-4" />
            <p className="font-montserrat text-muted-brass/60">No rituals found for this category</p>
          </div>
        )}
      </div>
    </DarkSection>
    </PageBorderFrame>
  );
};
