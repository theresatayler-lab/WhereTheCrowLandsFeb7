import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { deitiesAPI } from '../utils/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Moon, ExternalLink } from 'lucide-react';
import { DarkSection, PageBorderFrame, PageHeader, OrnateCard, GrandDivider } from '../components/OrnateElements';

export const Deities = () => {
  const [deities, setDeities] = useState([]);
  const [selectedDeity, setSelectedDeity] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeities();
  }, []);

  const fetchDeities = async () => {
    try {
      const data = await deitiesAPI.getAll();
      setDeities(data);
    } catch (error) {
      console.error('Failed to fetch deities:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DarkSection className="min-h-screen flex items-center justify-center" variant="warm">
        <Moon className="w-12 h-12 text-gold animate-pulse" />
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
            icon={Moon}
            title="Divine Pantheon"
            subtitle="The goddesses who guided the occult revival of 1910-1945"
          />
        </motion.div>

        <GrandDivider variant="moon" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {deities.map((deity, index) => (
            <motion.div
              key={deity.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <OrnateCard 
                className="cursor-pointer"
                onClick={() => setSelectedDeity(deity)}
              >
                <div
                  className="h-48 -m-4 sm:-m-6 mb-4 sm:mb-6 bg-cover bg-center relative rounded-t-lg"
                  style={{ backgroundImage: `url(${deity.image_url})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-mid via-navy-mid/60 to-transparent rounded-t-lg" />
                </div>
                {/* Title with better contrast - gold on dark */}
                <h3 className="font-cinzel text-xl sm:text-2xl text-gold mb-2" style={{ textShadow: '0 2px 10px rgba(212, 168, 75, 0.3)' }}>
                  {deity.name}
                </h3>
                {/* Subtitle in crimson-bright for visibility */}
                <p className="font-montserrat text-xs uppercase tracking-widest text-crimson-bright mb-3">
                  {deity.origin}
                </p>
                {/* Description in silver-mist for readability */}
                <p className="font-montserrat text-sm text-silver-mist/85 leading-relaxed line-clamp-3">
                  {deity.description}
                </p>
              </OrnateCard>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      <Dialog open={!!selectedDeity} onOpenChange={() => setSelectedDeity(null)}>
        <DialogContent className="max-w-3xl bg-navy-mid border-gold/30" data-testid="deity-detail-modal">
          {selectedDeity && (
            <>
              <DialogHeader>
                <DialogTitle className="font-cinzel text-2xl sm:text-3xl text-gold">
                  {selectedDeity.name}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div
                  className="h-48 sm:h-64 bg-cover bg-center rounded-sm"
                  style={{ backgroundImage: `url(${selectedDeity.image_url})` }}
                />
                <div>
                  <h4 className="font-montserrat text-xs uppercase tracking-widest text-crimson-bright mb-2">
                    Origin
                  </h4>
                  <p className="font-montserrat text-sm text-silver-mist">
                    {selectedDeity.origin}
                  </p>
                </div>
                <div>
                  <h4 className="font-montserrat text-xs uppercase tracking-widest text-crimson-bright mb-2">
                    Description
                  </h4>
                  <p className="font-crimson text-base text-cream/90 leading-relaxed">
                    {selectedDeity.description}
                  </p>
                </div>
                {selectedDeity.associations && selectedDeity.associations.length > 0 && (
                  <div>
                    <h4 className="font-montserrat text-xs uppercase tracking-widest text-crimson-bright mb-2">
                      Associations
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedDeity.associations.map((assoc, idx) => (
                        <span key={idx} className="px-3 py-1 bg-gold/10 border border-gold/30 rounded-sm text-sm text-gold-light">
                          {assoc}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </DarkSection>
    </PageBorderFrame>
  );
};
