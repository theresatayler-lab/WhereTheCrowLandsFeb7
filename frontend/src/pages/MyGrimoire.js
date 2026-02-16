import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Trash2, Eye, Loader2, Calendar, Sparkles, Hand, Heart, MapPin } from 'lucide-react';
import { grimoireAPI } from '../utils/api';
import { GrimoirePage } from '../components/GrimoirePage';
import { GrimoireDownloader } from '../components/GrimoireDownloader';
import { toast } from 'sonner';
import { DarkSection, LightSection, GrandDivider, MysticalDivider, PageBorderFrame, PageHeader, LightOrnateCard, OrnateCard, PageDivider, BestiaryGlyph, ATMOSPHERIC_IMAGES } from '../components/OrnateElements';

const API_URL = process.env.REACT_APP_BACKEND_URL;

export const MyGrimoire = () => {
  const [spells, setSpells] = useState([]);
  const [wards, setWards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSpell, setSelectedSpell] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [activeTab, setActiveTab] = useState('spells');

  useEffect(() => {
    loadGrimoire();
  }, []);

  const loadGrimoire = async () => {
    try {
      const [spellsData, wardsData] = await Promise.all([
        grimoireAPI.getAllSpells(),
        loadWards()
      ]);
      setSpells(spellsData);
      setWards(wardsData || []);
    } catch (error) {
      console.error('Failed to load grimoire:', error);
      if (error.response?.status === 401) {
        toast.error('Please log in to view your grimoire');
      } else {
        toast.error('Failed to load your grimoire');
      }
    } finally {
      setLoading(false);
    }
  };

  const loadWards = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return [];
      
      const response = await fetch(`${API_URL}/api/grimoire/wards`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) return [];
      return await response.json();
    } catch (error) {
      console.error('Failed to load wards:', error);
      return [];
    }
  };

  const handleDeleteSpell = async (spellId) => {
    if (!window.confirm('Are you sure you want to remove this spell from your grimoire?')) {
      return;
    }

    setDeleting(spellId);
    try {
      await grimoireAPI.deleteSpell(spellId);
      setSpells(spells.filter(s => s.id !== spellId));
      toast.success('Spell removed from grimoire');
      if (selectedSpell?.id === spellId) {
        setSelectedSpell(null);
      }
    } catch (error) {
      console.error('Failed to delete spell:', error);
      toast.error('Failed to remove spell');
    } finally {
      setDeleting(null);
    }
  };

  const handleDeleteWard = async (wardId) => {
    if (!window.confirm('Are you sure you want to remove this ward from your grimoire?')) {
      return;
    }

    setDeleting(wardId);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/grimoire/wards/${wardId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) throw new Error('Failed to delete');
      
      setWards(wards.filter(w => w.id !== wardId));
      toast.success('Ward removed from grimoire');
      if (selectedWard?.id === wardId) {
        setSelectedWard(null);
      }
    } catch (error) {
      console.error('Failed to delete ward:', error);
      toast.error('Failed to remove ward');
    } finally {
      setDeleting(null);
    }
  };

  const handleViewSpell = (spell) => {
    setSelectedSpell(spell);
  };

  const handleBackToList = () => {
    setSelectedSpell(null);
    setSelectedWard(null);
  };

  // If viewing a specific spell, show the full grimoire page
  if (selectedSpell) {
    return (
      <div className="min-h-screen">
        <DarkSection className="py-12 px-4 sm:px-6" variant="warm">
          <div className="max-w-4xl mx-auto">
            <button
              onClick={handleBackToList}
              className="mb-6 px-4 py-2 bg-navy-mid/50 text-gold border border-gold/30 rounded-sm font-montserrat tracking-widest uppercase text-xs hover:bg-gold/10 transition-all"
            >
              ← Back to Grimoire
            </button>
            <GrimoirePage 
              spell={{...selectedSpell.spell_data, tarot_card: selectedSpell.tarot_card}}
              archetype={{
                id: selectedSpell.archetype_id,
                name: selectedSpell.archetype_name,
                title: selectedSpell.archetype_title
              }}
              imageBase64={selectedSpell.image_base64}
              assetPlan={selectedSpell.asset_plan}
              onNewSpell={handleBackToList}
            />
          </div>
        </DarkSection>
      </div>
    );
  }

  return (
    <PageBorderFrame>
      <div className="min-h-screen">
        {/* Dark Hero Section */}
        <DarkSection className="py-12 sm:py-16 md:py-20 px-4 sm:px-6" variant="warm">
          <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <PageHeader 
              iconSrc="/icons/ui/gold/icon-grimoire.png"
              title="My Grimoire"
              subtitle="Your personal collection of spells, rituals, and wards"
            />
          </motion.div>
          
          {/* Download Grimoire Buttons */}
          {spells.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex justify-center gap-3 mb-6 flex-wrap"
            >
              <GrimoireDownloader spells={spells} userName={null} />
              <button
                onClick={async () => {
                  try {
                    const token = localStorage.getItem('token');
                    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/grimoire/export/pdf`, {
                      headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (!response.ok) throw new Error('Export failed');
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'my-grimoire.pdf';
                    a.click();
                    window.URL.revokeObjectURL(url);
                  } catch (err) {
                    console.error('PDF export error:', err);
                    toast.error('Could not export grimoire as PDF.');
                  }
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gold/30 text-gold hover:bg-gold/10 transition-colors font-montserrat text-sm"
                data-testid="export-pdf-btn"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Export as PDF
              </button>
            </motion.div>
          )}
          
          <GrandDivider variant="moon" />

          {/* What is a Grimoire - Expandable Introduction */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="max-w-3xl mx-auto"
          >
            <details className="group">
              <summary className="cursor-pointer">
                <OrnateCard hover={false} className="cursor-pointer">
                  <div className="flex items-center justify-between">
                    <span className="font-cinzel text-sm text-gold-light flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-crimson-bright" />
                      What is a Grimoire?
                    </span>
                    <span className="text-cream/50 text-xs font-montserrat group-open:hidden">Click to discover</span>
                    <span className="text-cream/50 text-xs font-montserrat hidden group-open:inline">Click to close</span>
                  </div>
                  <div className="hidden group-open:block mt-4">
                    <p className="font-crimson text-base text-cream/80 leading-relaxed italic">
                      A grimoire is more than just a spellbook—it&apos;s a living archive of wonder, wisdom, and the wild unknown. 
                      Think of it as the storyteller&apos;s toolkit for the magical world: a collection of rituals, symbols, and 
                      secret recipes passed down through generations.
                    </p>
                    <p className="font-crimson text-base text-cream/70 leading-relaxed italic mt-4">
                      Some say these books hold power on their own, but their real magic lies in the hands and hearts of those 
                      who use them to explore the mysteries that connect us all.
                    </p>
                    <div className="mt-4 pt-4 border-t border-gold/20 flex flex-wrap gap-4 text-xs font-montserrat text-cream/60">
                      <span className="flex items-center gap-1"><Sparkles className="w-3 h-3 text-crimson-bright" /> Save spells from your guides</span>
                      <span className="flex items-center gap-1"><Hand className="w-3 h-3 text-gold" /> Collect wards from Cathleen</span>
                      <span className="flex items-center gap-1"><Heart className="w-3 h-3 text-crimson" /> Build your personal practice</span>
                    </div>
                  </div>
                </OrnateCard>
              </summary>
            </details>
          </motion.div>
        </div>
      </DarkSection>

      {/* Light Section - Tabs and Content */}
      <LightSection 
        className="py-12 sm:py-16 px-4 sm:px-6"
        atmosphericImage={ATMOSPHERIC_IMAGES.maiden}
        atmosphericOpacity={0.10}
        atmosphericPosition="right center"
        atmosphericTint="sepia"
      >
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-crimson animate-spin mb-4" />
              <p className="font-montserrat text-navy-dark/60">Loading your grimoire...</p>
            </div>
          ) : (
            <>
              {/* Tabs */}
              <div className="flex justify-center gap-4 mb-10">
                <button
                  onClick={() => setActiveTab('spells')}
                  className={`px-6 py-3 font-montserrat text-sm uppercase tracking-wider rounded-sm transition-all flex items-center gap-2 ${
                    activeTab === 'spells'
                      ? 'bg-gradient-to-r from-crimson-deep via-crimson to-crimson-deep text-cream border border-gold/30'
                      : 'bg-cream border-2 border-crimson/30 text-crimson hover:bg-crimson/5'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  Spells ({spells.length})
                </button>
                <button
                  onClick={() => setActiveTab('wards')}
                  className={`px-6 py-3 font-montserrat text-sm uppercase tracking-wider rounded-sm transition-all flex items-center gap-2 ${
                    activeTab === 'wards'
                      ? 'bg-gradient-to-r from-gold-dark via-gold to-gold-dark text-navy-dark border border-crimson/30'
                      : 'bg-cream border-2 border-gold/50 text-gold-dark hover:bg-gold/5'
                  }`}
                >
                  <Hand className="w-4 h-4" />
                  Wards ({wards.length})
                </button>
              </div>

              <MysticalDivider light />

              {/* Spells Tab */}
              {activeTab === 'spells' && (
                spells.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-16"
                  >
                    <LightOrnateCard hover={false} className="max-w-md mx-auto">
                      <div className="mb-4">
                        <BestiaryGlyph animal="feather" size="lg" color="#b82330" />
                      </div>
                      <h2 className="font-cinzel text-xl text-crimson mb-3">No spells saved yet</h2>
                      <p className="font-montserrat text-sm text-navy-dark/60 mb-6">
                        Start building your personal collection by generating spells and saving them to your grimoire.
                      </p>
                      <a
                        href="/spell-request"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-crimson-deep via-crimson to-crimson-deep text-cream rounded-sm font-montserrat tracking-widest uppercase text-xs hover:from-crimson hover:via-crimson-bright hover:to-crimson transition-all border border-gold/30"
                      >
                        <Sparkles className="w-4 h-4" />
                        Create Your First Spell
                      </a>
                    </LightOrnateCard>
                  </motion.div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {spells.map((spell, index) => (
                      <motion.div
                        key={spell.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-cream/80 border-2 border-crimson/20 rounded-sm overflow-hidden hover:border-crimson/40 transition-all group"
                      >
                        {/* Spell Image */}
                        {spell.image_base64 ? (
                          <div className="relative h-48 overflow-hidden">
                            <img
                              src={`data:image/png;base64,${spell.image_base64}`}
                              alt={spell.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-cream to-transparent" />
                          </div>
                        ) : (
                          <div className="h-48 bg-crimson/5 flex items-center justify-center">
                            <BookOpen className="w-16 h-16 text-crimson/20" />
                          </div>
                        )}

                        {/* Spell Info */}
                        <div className="p-4">
                          <h3 className="font-italiana text-xl text-crimson mb-2 line-clamp-2">
                            {spell.title}
                          </h3>
                          
                          {spell.archetype_name && (
                            <p className="font-montserrat text-xs text-navy-dark/50 mb-3">
                              by {spell.archetype_name}
                            </p>
                          )}

                          <div className="flex items-center gap-2 text-xs text-navy-dark/50 mb-4">
                            <Calendar className="w-3 h-3" />
                            <span className="font-montserrat">
                              {new Date(spell.created_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </span>
                          </div>

                          {/* Actions */}
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleViewSpell(spell)}
                              className="flex-1 px-3 py-2 bg-crimson/10 text-crimson rounded-sm font-montserrat text-xs uppercase tracking-wider hover:bg-crimson/20 transition-colors flex items-center justify-center gap-2"
                            >
                              <Eye className="w-3 h-3" />
                              View
                            </button>
                            <button
                              onClick={() => handleDeleteSpell(spell.id)}
                              disabled={deleting === spell.id}
                              className="px-3 py-2 bg-red-500/10 text-red-600 rounded-sm font-montserrat text-xs uppercase tracking-wider hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                              {deleting === spell.id ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <Trash2 className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )
              )}

              {/* Wards Tab */}
              {activeTab === 'wards' && (
                wards.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-16"
                  >
                    <LightOrnateCard hover={false} className="max-w-md mx-auto">
                      <div className="mb-4">
                        <BestiaryGlyph animal="triquetra" size="lg" color="#d4a84b" />
                      </div>
                      <h2 className="font-cinzel text-xl text-gold-dark mb-3">No wards saved yet</h2>
                      <p className="font-montserrat text-sm text-navy-dark/60 mb-6">
                        Ask Cathleen to help you find the perfect ward for your situation.
                      </p>
                      <a
                        href="/ward-finder"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gold-dark via-gold to-gold-dark text-navy-dark rounded-sm font-montserrat tracking-widest uppercase text-xs hover:from-gold hover:via-gold-light hover:to-gold transition-all border border-crimson/30"
                      >
                        <Hand className="w-4 h-4" />
                        Find Your Ward
                      </a>
                    </LightOrnateCard>
                  </motion.div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wards.map((ward, index) => (
                      <motion.div
                        key={ward.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-cream/80 border-2 border-gold/30 rounded-sm overflow-hidden hover:border-gold/50 transition-all"
                      >
                        {/* Ward Header */}
                        <div className="p-5 bg-gold/10 border-b border-gold/20">
                          <div className="flex items-center gap-4">
                            <div className="p-3 bg-gold/20 rounded-full">
                              <img src="/icons/anchors/gold/anchor-feather.png" alt="" className="w-8 h-8" />
                            </div>
                            <div>
                              <h3 className="font-cinzel text-xl text-crimson">
                                {ward.name || ward.ward_data?.name}
                              </h3>
                              <p className="font-montserrat text-xs text-gold-dark/70 uppercase tracking-wider">
                                {ward.ward_data?.category || 'Personal Ward'}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Ward Info */}
                        <div className="p-4 space-y-3">
                          <p className="font-montserrat text-xs text-navy-dark/50">
                            <span className="font-medium">Asked about:</span> {ward.situation?.substring(0, 80)}...
                          </p>
                          
                          {ward.ward_data?.meaning && (
                            <div className="flex items-start gap-2">
                              <Heart className="w-4 h-4 text-crimson mt-0.5 flex-shrink-0" />
                              <p className="font-montserrat text-sm text-navy-dark/70 line-clamp-2">
                                {ward.ward_data.meaning}
                              </p>
                            </div>
                          )}

                          {ward.ward_data?.where_to_find && (
                            <div className="flex items-start gap-2">
                              <MapPin className="w-4 h-4 text-gold-dark mt-0.5 flex-shrink-0" />
                              <p className="font-montserrat text-sm text-navy-dark/70 line-clamp-2">
                                {ward.ward_data.where_to_find}
                              </p>
                            </div>
                          )}

                          <div className="flex items-center gap-2 text-xs text-navy-dark/50 pt-2">
                            <Calendar className="w-3 h-3" />
                            <span className="font-montserrat">
                              {new Date(ward.created_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </span>
                            <span className="text-gold-dark">• from Cathleen</span>
                          </div>

                          {/* Delete Button */}
                          <button
                            onClick={() => handleDeleteWard(ward.id)}
                            disabled={deleting === ward.id}
                            className="w-full mt-2 px-3 py-2 bg-red-500/10 text-red-600 rounded-sm font-montserrat text-xs uppercase tracking-wider hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                          >
                            {deleting === ward.id ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <>
                                <Trash2 className="w-3 h-3" />
                                Remove
                              </>
                            )}
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )
              )}
            </>
          )}
        </div>
      </LightSection>

      {/* Dark Footer */}
      <DarkSection className="py-8 px-4" variant="warm">
        <div className="max-w-2xl mx-auto text-center relative z-10">
          <p className="font-crimson text-sm text-cream/60 italic mb-4">
            Each spell is a doorway. Each ward is a guardian.
          </p>
          <div className="flex items-center justify-center gap-4 text-gold/50">
            <span>☽</span>
            <span className="text-crimson/60">❦</span>
            <span>📖</span>
            <span className="text-crimson/60">❦</span>
            <span>☾</span>
          </div>
        </div>
      </DarkSection>
    </div>
    </PageBorderFrame>
  );
};
