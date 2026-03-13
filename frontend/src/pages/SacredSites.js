import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { sitesAPI } from '../utils/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { BrandIcon } from '../components/BrandIcon';
import { DarkSection, PageBorderFrame, PageHeader, OrnateCard, GrandDivider } from '../components/OrnateElements';

export const SacredSites = () => {
  const [sites, setSites] = useState([]);
  const [selectedSite, setSelectedSite] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSites();
  }, []);

  const fetchSites = async () => {
    try {
      const data = await sitesAPI.getAll();
      setSites(data);
    } catch (error) {
      console.error('Failed to fetch sites:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DarkSection className="min-h-screen flex items-center justify-center" variant="warm">
        <BrandIcon name="map" size={48} className="mx-auto mb-4 animate-pulse" />
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
            icon={MapPin}
            title="Sacred Sites"
            subtitle="Power places across the UK and Europe that anchored occult practice"
          />
        </motion.div>

        <GrandDivider variant="moon" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {sites.map((site, index) => (
            <motion.div
              key={site.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <OrnateCard
                className="cursor-pointer"
                onClick={() => setSelectedSite(site)}
              >
                <div
                  className="h-48 -m-4 sm:-m-6 mb-4 sm:mb-6 bg-cover bg-center relative rounded-t-lg"
                  style={{ backgroundImage: `url(${site.image_url})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-mid via-navy-mid/60 to-transparent rounded-t-lg" />
                </div>
                <h3 className="font-cinzel text-xl sm:text-2xl text-gold mb-2" style={{ textShadow: '0 2px 10px rgba(200, 164, 77, 0.3)' }}>
                  {site.name}
                </h3>
                <p className="font-montserrat text-xs uppercase tracking-widest text-crimson-bright mb-3 flex items-center gap-1">
                  <BrandIcon name="map" size={12} />
                  {site.location}, {site.country}
                </p>
                <p className="font-montserrat text-sm text-muted-brass/85 leading-relaxed line-clamp-3">
                  {site.historical_significance}
                </p>
              </OrnateCard>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      <Dialog open={!!selectedSite} onOpenChange={() => setSelectedSite(null)}>
        <DialogContent className="max-w-3xl bg-navy-mid border-gold/30" data-testid="site-detail-modal">
          {selectedSite && (
            <>
              <DialogHeader>
                <DialogTitle className="font-cinzel text-2xl sm:text-3xl text-gold">
                  {selectedSite.name}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div
                  className="h-48 sm:h-64 bg-cover bg-center rounded-sm"
                  style={{ backgroundImage: `url(${selectedSite.image_url})` }}
                />
                <div>
                  <h4 className="font-montserrat text-xs uppercase tracking-widest text-crimson-bright mb-2">Location</h4>
                  <p className="font-montserrat text-base text-cream/90">{selectedSite.location}, {selectedSite.country}</p>
                  <p className="font-montserrat text-sm text-muted-brass/60 mt-1 flex items-center gap-1">
                    <BrandIcon name="compass" size={12} />
                    {selectedSite.coordinates?.lat}, {selectedSite.coordinates?.lng}
                  </p>
                </div>
                <div>
                  <h4 className="font-montserrat text-xs uppercase tracking-widest text-crimson-bright mb-2">Historical Significance (1910-1945)</h4>
                  <p className="font-crimson text-base text-cream/90 leading-relaxed">{selectedSite.historical_significance}</p>
                </div>
                <div>
                  <h4 className="font-montserrat text-xs uppercase tracking-widest text-crimson-bright mb-2">Period of Activity</h4>
                  <p className="font-montserrat text-base text-gold-light">{selectedSite.time_period}</p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </DarkSection>
    </PageBorderFrame>
  );
};
