import React, { useState, useEffect } from 'react';
import { DarkSection, LightOrnateCard, PageHeader } from '../components/OrnateElements';
import { Sparkles } from 'lucide-react';

const GUIDE_NAMES = {
  shigg: 'Shigg', cathleen: 'Cathleen', katherine: 'Katherine',
  theresa: 'Theresa', brenda: 'Brenda'
};

export default function Admin() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/admin/stats`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) {
          if (response.status === 403) throw new Error('Admin access required');
          throw new Error('Failed to load stats');
        }
        setStats(await response.json());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return (
    <DarkSection className="min-h-screen flex items-center justify-center">
      <p className="text-cream/60 font-montserrat">Loading stats...</p>
    </DarkSection>
  );

  if (error) return (
    <DarkSection className="min-h-screen flex items-center justify-center">
      <p className="text-crimson font-montserrat">{error}</p>
    </DarkSection>
  );

  return (
    <DarkSection className="min-h-screen py-12 px-4" data-testid="admin-dashboard">
      <div className="max-w-4xl mx-auto">
        <PageHeader icon={Sparkles} title="Admin Dashboard" subtitle="Platform metrics and performance" />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 mt-8">
          <StatCard label="Total Users" value={stats.users.total} />
          <StatCard label="Total Spells" value={stats.spells.total} />
          <StatCard label="Spells (24h)" value={stats.spells.last_24h} />
          <StatCard label="Failed (24h)" value={stats.spells.failed_24h} color="crimson" />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <LightOrnateCard className="p-6">
            <h3 className="font-cinzel text-lg text-navy-dark mb-4">Guide Popularity (7 days)</h3>
            {Object.entries(stats.guides).map(([id, count]) => (
              <div key={id} className="flex justify-between items-center py-2 border-b border-navy-dark/10 last:border-0">
                <span className="font-crimson-text text-navy-dark">{GUIDE_NAMES[id] || id}</span>
                <span className="font-montserrat text-sm text-navy-dark/70">{count} spells</span>
              </div>
            ))}
            {Object.keys(stats.guides).length === 0 && (
              <p className="text-navy-dark/50 font-crimson-text italic">No spells in the last 7 days</p>
            )}
          </LightOrnateCard>

          <LightOrnateCard className="p-6">
            <h3 className="font-cinzel text-lg text-navy-dark mb-4">Pipeline Performance (24h)</h3>
            <div className="space-y-3">
              <PerfRow label="Average" ms={stats.performance.avg_generation_ms} />
              <PerfRow label="Fastest" ms={stats.performance.min_generation_ms} />
              <PerfRow label="Slowest" ms={stats.performance.max_generation_ms} />
            </div>
          </LightOrnateCard>
        </div>
      </div>
    </DarkSection>
  );
}

function StatCard({ label, value, color = 'gold' }) {
  return (
    <div className="bg-navy-dark/50 rounded-lg p-4 border border-gold/20 text-center" data-testid={`stat-${label.toLowerCase().replace(/\s/g,'-')}`}>
      <p className={`font-cinzel text-2xl ${color === 'crimson' ? 'text-crimson' : 'text-gold'}`}>{value}</p>
      <p className="font-montserrat text-xs text-cream/50 uppercase tracking-wider mt-1">{label}</p>
    </div>
  );
}

function PerfRow({ label, ms }) {
  const seconds = (ms / 1000).toFixed(1);
  return (
    <div className="flex justify-between items-center">
      <span className="font-crimson-text text-navy-dark">{label}</span>
      <span className="font-montserrat text-sm text-navy-dark/70">{seconds}s</span>
    </div>
  );
}
