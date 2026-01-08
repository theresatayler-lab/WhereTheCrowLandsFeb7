import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { timelineAPI } from '../utils/api';
import { Clock } from 'lucide-react';
import { DarkSection, ElaborateCorner, PageHeader, OrnateCard, GrandDivider, MysticalDivider } from '../components/OrnateElements';

export const Timeline = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTimeline();
  }, []);

  const fetchTimeline = async () => {
    try {
      const data = await timelineAPI.getAll();
      setEvents(data);
    } catch (error) {
      console.error('Failed to fetch timeline:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DarkSection className="min-h-screen flex items-center justify-center" variant="warm">
        <Clock className="w-12 h-12 text-gold animate-pulse" />
      </DarkSection>
    );
  }

  return (
    <DarkSection className="min-h-screen py-12 sm:py-20 px-4 sm:px-6" variant="warm">
      {/* Corner Ornaments */}
      <ElaborateCorner className="absolute top-3 left-3 w-16 h-16 sm:w-24 sm:h-24" variant="gold" />
      <ElaborateCorner className="absolute top-3 right-3 w-16 h-16 sm:w-24 sm:h-24 rotate-90" variant="gold" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <PageHeader 
            icon={Clock}
            title="Timeline: 1910-1945"
            subtitle="Key moments in the occult revival between the World Wars"
          />
        </motion.div>

        <GrandDivider variant="default" />

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 sm:left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-gold/60 via-crimson/40 to-gold/60" />

          <div className="space-y-8 sm:space-y-12">
            {events.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative pl-16 sm:pl-20"
              >
                {/* Year marker */}
                <div className="absolute left-0 top-0 w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-navy-mid border-2 border-gold flex items-center justify-center" style={{ boxShadow: '0 0 20px rgba(212, 168, 75, 0.3)' }}>
                  <span className="font-cinzel text-xs sm:text-sm text-gold font-bold">{event.year}</span>
                </div>

                <OrnateCard hover={false}>
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-3">
                    <h3 className="font-cinzel text-lg sm:text-xl text-gold flex-1" style={{ textShadow: '0 2px 10px rgba(212, 168, 75, 0.3)' }}>
                      {event.title}
                    </h3>
                    <span className="px-3 py-1 bg-crimson/20 border border-crimson/40 rounded-sm font-montserrat text-xs text-crimson-bright self-start">
                      {event.category}
                    </span>
                  </div>
                  <p className="font-montserrat text-sm text-cream/85 leading-relaxed">
                    {event.description}
                  </p>
                </OrnateCard>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Corners */}
      <ElaborateCorner className="absolute bottom-3 left-3 w-16 h-16 sm:w-24 sm:h-24 -rotate-90" variant="gold" />
      <ElaborateCorner className="absolute bottom-3 right-3 w-16 h-16 sm:w-24 sm:h-24 rotate-180" variant="gold" />
    </DarkSection>
  );
};
