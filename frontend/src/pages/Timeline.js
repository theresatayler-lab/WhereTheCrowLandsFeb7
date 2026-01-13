import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { timelineAPI } from '../utils/api';
import { 
  Clock, Search, Filter, X, ChevronDown, ChevronUp, 
  Grid3X3, List, Network, Star, BookOpen, Users, MapPin,
  Calendar, ExternalLink, Compass, Moon, Eye, Sparkles,
  Flame, Leaf, Film, Sun, Zap, Wand2
} from 'lucide-react';
import { DarkSection, PageBorderFrame, PageHeader, OrnateCard, GrandDivider } from '../components/OrnateElements';

// ============================================================================
// TAXONOMY CONFIGURATION (13 Categories from Master Chart)
// ============================================================================

const TAXONOMY_CATEGORIES = {
  1: { name: "Pre-Modern Esoteric", icon: Compass, color: "#3a506b", shortName: "Pre-Modern" },
  2: { name: "Alchemy", icon: Wand2, color: "#5c6b73", shortName: "Alchemy" },
  3: { name: "Romantic Gothic", icon: Moon, color: "#8e6e53", shortName: "Gothic" },
  4: { name: "Spiritualism", icon: Eye, color: "#9d8ca1", shortName: "Spiritualism" },
  5: { name: "Symbolism", icon: Sparkles, color: "#6b5b95", shortName: "Symbolism" },
  6: { name: "Occult Revival", icon: Star, color: "#d4a84b", shortName: "Revival" },
  7: { name: "Surrealism", icon: Wand2, color: "#4a6fa5", shortName: "Surrealism" },
  8: { name: "Folk Magic", icon: Leaf, color: "#6b8e23", shortName: "Folk" },
  9: { name: "Performance", icon: Flame, color: "#8b2232", shortName: "Performance" },
  10: { name: "Cinema", icon: Film, color: "#2d3436", shortName: "Cinema" },
  11: { name: "Visionary", icon: Sun, color: "#e056fd", shortName: "Visionary" },
  12: { name: "Chaos Magic", icon: Zap, color: "#636e72", shortName: "Chaos" },
  13: { name: "Pop Culture", icon: Star, color: "#a29bfe", shortName: "Pop" },
};

const EVENT_CATEGORIES = ['Publication', 'Organization', 'Figure', 'Legal', 'Site', 'Ritual'];

const GUIDE_COLORS = {
  shigg: { color: "#4a6fa5", name: "Shigg" },
  cathleen: { color: "#8b2232", name: "Cathleen" },
  katherine: { color: "#d4a84b", name: "Katherine" },
  theresa: { color: "#6b8e23", name: "Theresa" },
};

// ============================================================================
// FILTER PANEL COMPONENT
// ============================================================================

const FilterPanel = ({ filters, setFilters, stats, isOpen, setIsOpen }) => {
  const [localSearch, setLocalSearch] = useState(filters.search || '');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setFilters(prev => ({ ...prev, search: localSearch }));
  };

  const toggleCategory = (catId) => {
    setFilters(prev => {
      const current = prev.categories || [];
      const newCats = current.includes(catId) 
        ? current.filter(c => c !== catId)
        : [...current, catId];
      return { ...prev, categories: newCats.length > 0 ? newCats : null };
    });
  };

  const toggleGuide = (guide) => {
    setFilters(prev => {
      const current = prev.guides || [];
      const newGuides = current.includes(guide)
        ? current.filter(g => g !== guide)
        : [...current, guide];
      return { ...prev, guides: newGuides.length > 0 ? newGuides : null };
    });
  };

  const clearFilters = () => {
    setFilters({});
    setLocalSearch('');
  };

  const hasActiveFilters = filters.categories?.length > 0 || filters.guides?.length > 0 || filters.search;

  return (
    <div className="mb-6">
      {/* Filter Toggle Button */}
      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-2 bg-navy-mid/50 border border-gold/30 rounded-lg text-cream/90 hover:border-gold/50 transition-colors"
        >
          <Filter size={18} />
          <span className="font-montserrat text-sm">Filters</span>
          {hasActiveFilters && (
            <span className="w-2 h-2 bg-crimson rounded-full" />
          )}
          {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-cream/50" />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Search events, figures..."
              className="w-full pl-10 pr-4 py-2 bg-navy-dark/50 border border-gold/20 rounded-lg text-cream placeholder-cream/40 font-montserrat text-sm focus:border-gold/50 focus:outline-none"
            />
          </div>
        </form>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 px-3 py-2 text-crimson-bright hover:text-crimson transition-colors"
          >
            <X size={16} />
            <span className="font-montserrat text-sm">Clear</span>
          </button>
        )}
      </div>

      {/* Expanded Filter Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 bg-navy-mid/30 border border-gold/20 rounded-lg space-y-4">
              {/* Taxonomy Categories */}
              <div>
                <h4 className="font-cinzel text-sm text-gold mb-2">Taxonomy Categories</h4>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(TAXONOMY_CATEGORIES).map(([id, cat]) => {
                    const Icon = cat.icon;
                    const isActive = filters.categories?.includes(parseInt(id));
                    return (
                      <button
                        key={id}
                        onClick={() => toggleCategory(parseInt(id))}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-montserrat transition-all ${
                          isActive
                            ? 'bg-gold/20 border-gold text-gold'
                            : 'bg-navy-dark/50 border-gold/20 text-cream/70 hover:border-gold/40'
                        } border`}
                        style={{ borderColor: isActive ? cat.color : undefined }}
                      >
                        <Icon size={12} style={{ color: cat.color }} />
                        {cat.shortName}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Guide Lens */}
              <div>
                <h4 className="font-cinzel text-sm text-gold mb-2">Guide Lens</h4>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(GUIDE_COLORS).map(([id, guide]) => {
                    const isActive = filters.guides?.includes(id);
                    return (
                      <button
                        key={id}
                        onClick={() => toggleGuide(id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-montserrat transition-all ${
                          isActive
                            ? 'bg-gold/20 text-gold'
                            : 'bg-navy-dark/50 text-cream/70 hover:border-gold/40'
                        } border border-gold/20`}
                        style={{ 
                          borderColor: isActive ? guide.color : undefined,
                          backgroundColor: isActive ? `${guide.color}20` : undefined
                        }}
                      >
                        <span 
                          className="w-2 h-2 rounded-full" 
                          style={{ backgroundColor: guide.color }}
                        />
                        {guide.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Stats Preview */}
              {stats && (
                <div className="pt-3 border-t border-gold/10">
                  <div className="flex gap-6 text-xs font-montserrat text-cream/60">
                    <span>{stats.total_events} total events</span>
                    <span>{stats.date_range?.start}–{stats.date_range?.end}</span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ============================================================================
// EVENT CARD COMPONENT
// ============================================================================

const EventCard = ({ event, isExpanded, onToggle, view }) => {
  const primaryTaxonomy = event.taxonomy_categories?.[0];
  const taxonomyData = TAXONOMY_CATEGORIES[primaryTaxonomy] || TAXONOMY_CATEGORIES[6];
  const TaxonomyIcon = taxonomyData.icon;

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'Publication': return BookOpen;
      case 'Organization': return Users;
      case 'Figure': return Users;
      case 'Site': return MapPin;
      case 'Ritual': return Flame;
      case 'Legal': return BookOpen;
      default: return Star;
    }
  };

  const CategoryIcon = getCategoryIcon(event.primary_category || event.category);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative ${view === 'grid' ? '' : 'pl-16 sm:pl-20'}`}
    >
      {/* Year Marker (Timeline view only) */}
      {view === 'timeline' && (
        <div 
          className="absolute left-0 top-0 w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-navy-mid border-2 flex items-center justify-center z-10"
          style={{ 
            borderColor: taxonomyData.color,
            boxShadow: `0 0 20px ${taxonomyData.color}40`
          }}
        >
          <span className="font-cinzel text-xs sm:text-sm font-bold" style={{ color: taxonomyData.color }}>
            {event.year}
          </span>
        </div>
      )}

      <OrnateCard 
        hover={true}
        className={`cursor-pointer ${event.is_pivotal_moment ? 'ring-2 ring-gold/30' : ''}`}
        onClick={onToggle}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-3">
          <div className="flex items-start gap-3">
            {/* Taxonomy Icon */}
            <div 
              className="p-2 rounded-lg"
              style={{ backgroundColor: `${taxonomyData.color}20` }}
            >
              <TaxonomyIcon size={18} style={{ color: taxonomyData.color }} />
            </div>
            
            <div>
              <h3 className="font-phantasmagoria text-lg sm:text-xl text-gold leading-tight" style={{ textShadow: '0 2px 10px rgba(212, 168, 75, 0.3)' }}>
                {event.title}
              </h3>
              {view === 'grid' && (
                <span className="font-cinzel text-sm text-cream/60">{event.year}</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Importance Star */}
            {event.importance === 1 && (
              <Star size={16} className="text-gold fill-gold" />
            )}
            
            {/* Category Badge */}
            <span className="px-3 py-1 bg-crimson/20 border border-crimson/40 rounded-sm font-montserrat text-xs text-crimson-bright flex items-center gap-1">
              <CategoryIcon size={12} />
              {event.primary_category || event.category}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="font-montserrat text-sm text-cream/85 leading-relaxed mb-3">
          {isExpanded ? event.description : event.description?.slice(0, 200) + (event.description?.length > 200 ? '...' : '')}
        </p>

        {/* Guide Relevance Dots */}
        {event.guide_relevance && (
          <div className="flex items-center gap-3 mb-3">
            <span className="font-montserrat text-xs text-cream/50">Guides:</span>
            {Object.entries(event.guide_relevance).map(([guide, level]) => (
              <div 
                key={guide}
                className="flex items-center gap-1"
                title={`${GUIDE_COLORS[guide]?.name}: ${level}`}
              >
                <span 
                  className={`w-2 h-2 rounded-full ${level === 'high' ? 'opacity-100' : level === 'medium' ? 'opacity-60' : 'opacity-20'}`}
                  style={{ backgroundColor: GUIDE_COLORS[guide]?.color }}
                />
              </div>
            ))}
          </div>
        )}

        {/* Expanded Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-3 border-t border-gold/20 space-y-3">
                {/* Significance */}
                {event.significance && (
                  <div>
                    <h4 className="font-cinzel text-xs text-gold/70 uppercase mb-1">Significance</h4>
                    <p className="font-montserrat text-sm text-cream/70">{event.significance}</p>
                  </div>
                )}

                {/* Figures */}
                {event.figures_involved?.length > 0 && (
                  <div>
                    <h4 className="font-cinzel text-xs text-gold/70 uppercase mb-1">Key Figures</h4>
                    <div className="flex flex-wrap gap-2">
                      {event.figures_involved.map((figure, i) => (
                        <span key={i} className="px-2 py-0.5 bg-navy-dark/50 rounded text-xs text-cream/80 font-montserrat">
                          {figure}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Traditions */}
                {event.traditions?.length > 0 && (
                  <div>
                    <h4 className="font-cinzel text-xs text-gold/70 uppercase mb-1">Traditions</h4>
                    <div className="flex flex-wrap gap-2">
                      {event.traditions.map((tradition, i) => (
                        <span key={i} className="px-2 py-0.5 bg-gold/10 border border-gold/20 rounded text-xs text-gold/80 font-montserrat">
                          {tradition.replace(/_/g, ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sources */}
                {event.sources?.length > 0 && (
                  <div>
                    <h4 className="font-cinzel text-xs text-gold/70 uppercase mb-1">Sources</h4>
                    <div className="space-y-1">
                      {event.sources.slice(0, 2).map((source, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-cream/60 font-montserrat">
                          <BookOpen size={12} className="mt-0.5 flex-shrink-0" />
                          <span>
                            {source.author && `${source.author}, `}
                            <em>{source.title}</em>
                            {source.year && ` (${source.year})`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Location */}
                {event.location && (
                  <div className="flex items-center gap-2 text-xs text-cream/50 font-montserrat">
                    <MapPin size={12} />
                    <span>{event.location.name}, {event.location.region}</span>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Expand/Collapse Indicator */}
        <div className="flex justify-center mt-2">
          <ChevronDown 
            size={16} 
            className={`text-gold/40 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          />
        </div>
      </OrnateCard>
    </motion.div>
  );
};

// ============================================================================
// VIEW TOGGLE COMPONENT
// ============================================================================

const ViewToggle = ({ view, setView }) => {
  const views = [
    { id: 'timeline', icon: List, label: 'Timeline' },
    { id: 'grid', icon: Grid3X3, label: 'Grid' },
    { id: 'network', icon: Network, label: 'Network' },
  ];

  return (
    <div className="flex items-center gap-1 p-1 bg-navy-mid/50 rounded-lg border border-gold/20">
      {views.map(({ id, icon: Icon, label }) => (
        <button
          key={id}
          onClick={() => setView(id)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-all ${
            view === id
              ? 'bg-gold/20 text-gold'
              : 'text-cream/60 hover:text-cream/80'
          }`}
        >
          <Icon size={16} />
          <span className="font-montserrat text-sm hidden sm:inline">{label}</span>
        </button>
      ))}
    </div>
  );
};

// ============================================================================
// ERA NAVIGATION (For extended historical timeline)
// ============================================================================

const ERA_DEFINITIONS = {
  ancient: { label: "Ancient", start: -2000, end: 500, color: "#3a506b" },
  medieval: { label: "Medieval", start: 500, end: 1500, color: "#5c6b73" },
  renaissance: { label: "Renaissance", start: 1500, end: 1700, color: "#8e6e53" },
  enlightenment: { label: "18th Century", start: 1700, end: 1800, color: "#9d8ca1" },
  victorian: { label: "19th Century", start: 1800, end: 1900, color: "#6b5b95" },
  revival: { label: "Occult Revival", start: 1880, end: 1951, color: "#d4a84b" },
  postwar: { label: "Post-War", start: 1951, end: 1990, color: "#8b2232" },
  contemporary: { label: "Contemporary", start: 1990, end: 2030, color: "#a29bfe" },
};

const EraNav = ({ events, activeEra, setActiveEra }) => {
  // Detect which eras have events
  const availableEras = useMemo(() => {
    const erasWithEvents = new Set();
    events.forEach(e => {
      Object.entries(ERA_DEFINITIONS).forEach(([key, era]) => {
        if (e.year >= era.start && e.year < era.end) {
          erasWithEvents.add(key);
        }
      });
    });
    return Object.entries(ERA_DEFINITIONS).filter(([key]) => erasWithEvents.has(key));
  }, [events]);

  if (availableEras.length <= 1) return null;

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-4">
      <span className="font-montserrat text-xs text-cream/50 mr-2">Era:</span>
      <button
        onClick={() => setActiveEra(null)}
        className={`px-3 py-1.5 rounded-full font-montserrat text-xs whitespace-nowrap transition-all ${
          activeEra === null
            ? 'bg-gold text-navy-dark'
            : 'bg-navy-mid/50 text-cream/70 hover:text-cream border border-gold/20'
        }`}
      >
        All Eras
      </button>
      {availableEras.map(([key, era]) => (
        <button
          key={key}
          onClick={() => setActiveEra(key)}
          className={`px-3 py-1.5 rounded-full font-montserrat text-xs whitespace-nowrap transition-all border ${
            activeEra === key
              ? 'text-navy-dark'
              : 'bg-navy-mid/50 text-cream/70 hover:text-cream border-gold/20'
          }`}
          style={{
            backgroundColor: activeEra === key ? era.color : undefined,
            borderColor: activeEra === key ? era.color : undefined
          }}
        >
          {era.label}
        </button>
      ))}
    </div>
  );
};

// ============================================================================
// DECADE NAVIGATION (For detailed filtering within eras)
// ============================================================================

const DecadeNav = ({ events, activeDecade, setActiveDecade, activeEra }) => {
  const decades = useMemo(() => {
    const decadeSet = new Set();
    events.forEach(e => {
      // Skip very ancient dates for decade view
      if (e.year < -500) return;
      
      // Handle negative years (BCE)
      let decade;
      if (e.year < 0) {
        decade = Math.ceil(e.year / 10) * 10;
      } else {
        decade = Math.floor(e.year / 10) * 10;
      }
      decadeSet.add(decade);
    });
    return Array.from(decadeSet).sort((a, b) => a - b);
  }, [events]);

  // Only show decades relevant to current era filter
  const filteredDecades = useMemo(() => {
    if (!activeEra) return decades.slice(-10); // Show last 10 decades if no era filter
    const era = ERA_DEFINITIONS[activeEra];
    if (!era) return decades;
    return decades.filter(d => d >= era.start && d < era.end);
  }, [decades, activeEra]);

  const formatDecade = (decade) => {
    if (decade < 0) {
      return `${Math.abs(decade)}s BCE`;
    }
    return `${decade}s`;
  };

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2">
      <button
        onClick={() => setActiveDecade(null)}
        className={`px-3 py-1.5 rounded-full font-montserrat text-sm whitespace-nowrap transition-all ${
          activeDecade === null
            ? 'bg-gold text-navy-dark'
            : 'bg-navy-mid/50 text-cream/70 hover:text-cream border border-gold/20'
        }`}
      >
        All
      </button>
      {filteredDecades.map(decade => (
        <button
          key={decade}
          onClick={() => setActiveDecade(decade)}
          className={`px-3 py-1.5 rounded-full font-montserrat text-sm whitespace-nowrap transition-all ${
            activeDecade === decade
              ? 'bg-gold text-navy-dark'
              : 'bg-navy-mid/50 text-cream/70 hover:text-cream border border-gold/20'
          }`}
        >
          {formatDecade(decade)}
        </button>
      ))}
    </div>
  );
};

// ============================================================================
// MAIN TIMELINE COMPONENT
// ============================================================================

export const Timeline = () => {
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState('timeline');
  const [filters, setFilters] = useState({});
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [expandedEvent, setExpandedEvent] = useState(null);
  const [activeDecade, setActiveDecade] = useState(null);
  const [activeEra, setActiveEra] = useState(null);

  // Fetch events
  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const filterParams = { ...filters };
      
      // Apply era filter
      if (activeEra && ERA_DEFINITIONS[activeEra]) {
        const era = ERA_DEFINITIONS[activeEra];
        filterParams.startYear = era.start;
        filterParams.endYear = era.end;
      }
      
      // Apply decade filter (overrides era if both set)
      if (activeDecade) {
        filterParams.startYear = activeDecade;
        filterParams.endYear = activeDecade + 9;
      }
      
      const data = await timelineAPI.getEventsV2(filterParams);
      setEvents(data);
    } catch (err) {
      console.error('Failed to fetch timeline:', err);
      setError('Failed to load timeline events');
      // Fallback to legacy API
      try {
        const legacyData = await timelineAPI.getAll();
        setEvents(legacyData);
      } catch (legacyErr) {
        console.error('Legacy API also failed:', legacyErr);
      }
    } finally {
      setLoading(false);
    }
  }, [filters, activeDecade, activeEra]);

  // Fetch stats
  const fetchStats = useCallback(async () => {
    try {
      const data = await timelineAPI.getStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Filter events by decade if active
  const displayEvents = useMemo(() => {
    if (!activeDecade) return events;
    return events.filter(e => {
      const decade = Math.floor(e.year / 10) * 10;
      return decade === activeDecade;
    });
  }, [events, activeDecade]);

  if (loading) {
    return (
      <DarkSection className="min-h-screen flex items-center justify-center" variant="warm">
        <div className="flex flex-col items-center gap-4">
          <Clock className="w-12 h-12 text-gold animate-pulse" />
          <span className="font-montserrat text-cream/60">Loading timeline...</span>
        </div>
      </DarkSection>
    );
  }

  return (
    <PageBorderFrame>
      <DarkSection className="min-h-screen py-12 sm:py-20 px-4 sm:px-6" variant="warm">
        <div className="max-w-5xl mx-auto relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <PageHeader 
              icon={Clock}
              title="The Occult Revival"
              subtitle="An interactive journey through the esoteric movements of 1888-1951"
            />
          </motion.div>

          <GrandDivider variant="moon" />

          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <ViewToggle view={view} setView={setView} />
            <DecadeNav 
              events={events} 
              activeDecade={activeDecade} 
              setActiveDecade={setActiveDecade} 
            />
          </div>

          {/* Filter Panel */}
          <FilterPanel 
            filters={filters}
            setFilters={setFilters}
            stats={stats}
            isOpen={filterPanelOpen}
            setIsOpen={setFilterPanelOpen}
          />

          {/* Events Count */}
          <div className="mb-4 font-montserrat text-sm text-cream/50">
            Showing {displayEvents.length} event{displayEvents.length !== 1 ? 's' : ''}
            {activeDecade && ` from the ${activeDecade}s`}
          </div>

          {/* Error State */}
          {error && (
            <div className="mb-6 p-4 bg-crimson/20 border border-crimson/40 rounded-lg text-cream">
              {error}
            </div>
          )}

          {/* Timeline View */}
          {view === 'timeline' && (
            <div className="relative">
              {/* Timeline Spine */}
              <div className="absolute left-6 sm:left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-gold/60 via-crimson/40 to-gold/60" />

              <div className="space-y-8 sm:space-y-12">
                {displayEvents.map((event, index) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    isExpanded={expandedEvent === event.id}
                    onToggle={() => setExpandedEvent(expandedEvent === event.id ? null : event.id)}
                    view="timeline"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Grid View */}
          {view === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  isExpanded={expandedEvent === event.id}
                  onToggle={() => setExpandedEvent(expandedEvent === event.id ? null : event.id)}
                  view="grid"
                />
              ))}
            </div>
          )}

          {/* Network View Placeholder */}
          {view === 'network' && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Network size={48} className="text-gold/40 mb-4" />
              <h3 className="font-cinzel text-xl text-gold mb-2">Network View Coming Soon</h3>
              <p className="font-montserrat text-sm text-cream/60 max-w-md">
                The interactive network graph will visualize connections between events, 
                figures, and movements. Use Timeline or Grid view for now.
              </p>
            </div>
          )}

          {/* Empty State */}
          {displayEvents.length === 0 && !loading && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Clock size={48} className="text-gold/40 mb-4" />
              <h3 className="font-cinzel text-xl text-gold mb-2">No Events Found</h3>
              <p className="font-montserrat text-sm text-cream/60">
                Try adjusting your filters or search terms.
              </p>
            </div>
          )}
        </div>
      </DarkSection>
    </PageBorderFrame>
  );
};

export default Timeline;
