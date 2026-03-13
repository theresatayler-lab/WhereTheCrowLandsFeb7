import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { figuresAPI } from '../utils/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { BrandIcon } from '../components/BrandIcon';
import { DarkSection, PageBorderFrame, PageHeader, OrnateCard, GrandDivider } from '../components/OrnateElements';

export const HistoricalFigures = () => {
  const [figures, setFigures] = useState([]);
  const [selectedFigure, setSelectedFigure] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFigures();
  }, []);

  const fetchFigures = async () => {
    try {
      const data = await figuresAPI.getAll();
      setFigures(data);
    } catch (error) {
      console.error('Failed to fetch figures:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DarkSection className="min-h-screen flex items-center justify-center" variant="warm">
        <BrandIcon name="familyPhoto" size={48} className="mx-auto mb-4 animate-pulse" />
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
            icon={Users}
            title="Pioneers of the Craft"
            subtitle="The visionaries who shaped modern occultism between the wars"
          />
        </motion.div>

        <GrandDivider variant="eye" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {figures.map((figure, index) => (
            <motion.div
              key={figure.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <OrnateCard
                className="cursor-pointer"
                onClick={() => setSelectedFigure(figure)}
              >
                <div
                  className="h-48 -m-4 sm:-m-6 mb-4 sm:mb-6 bg-cover bg-center relative rounded-t-lg"
                  style={{ backgroundImage: `url(${figure.image_url})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-mid via-navy-mid/60 to-transparent rounded-t-lg" />
                </div>
                <h3 className="font-cinzel text-xl sm:text-2xl text-gold mb-2" style={{ textShadow: '0 2px 10px rgba(200, 164, 77, 0.3)' }}>
                  {figure.name}
                </h3>
                <p className="font-montserrat text-xs uppercase tracking-widest text-crimson-bright mb-3">
                  {figure.birth_death}
                </p>
                <p className="font-montserrat text-sm text-muted-brass/85 leading-relaxed line-clamp-3">
                  {figure.bio}
                </p>
              </OrnateCard>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      <Dialog open={!!selectedFigure} onOpenChange={() => setSelectedFigure(null)}>
        <DialogContent className="max-w-3xl bg-navy-mid border-gold/30" data-testid="figure-detail-modal">
          {selectedFigure && (
            <>
              <DialogHeader>
                <DialogTitle className="font-cinzel text-2xl sm:text-3xl text-gold">
                  {selectedFigure.name}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div
                  className="h-48 sm:h-64 bg-cover bg-center rounded-sm"
                  style={{ backgroundImage: `url(${selectedFigure.image_url})` }}
                />
                <div>
                  <h4 className="font-montserrat text-xs uppercase tracking-widest text-crimson-bright mb-2">Life</h4>
                  <p className="font-montserrat text-base text-cream/90">{selectedFigure.birth_death}</p>
                </div>
                <div>
                  <h4 className="font-montserrat text-xs uppercase tracking-widest text-crimson-bright mb-2">Biography</h4>
                  <p className="font-crimson text-base text-cream/90 leading-relaxed">{selectedFigure.bio}</p>
                </div>
                <div>
                  <h4 className="font-montserrat text-xs uppercase tracking-widest text-crimson-bright mb-2">Contributions</h4>
                  <p className="font-crimson text-base text-cream/90 leading-relaxed">{selectedFigure.contributions}</p>
                </div>
                {selectedFigure.associated_works && selectedFigure.associated_works.length > 0 && (
                  <div>
                    <h4 className="font-montserrat text-xs uppercase tracking-widest text-crimson-bright mb-2">Notable Works</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {selectedFigure.associated_works.map((work, idx) => (
                        <li key={idx} className="font-montserrat text-sm text-gold-light">{work}</li>
                      ))}
                    </ul>
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
