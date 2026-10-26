'use client';

import React, { useState, useMemo } from 'react';
import { useKudos } from '../../context/KudosContext';
import { User, Kudos } from '../../types';
import PersonModal from './PersonModal';
import {
  Search,
  Filter,
  Sparkles,
  Building,
  Users,
  Calendar,
  Layers,
  Heart,
  MessageSquare,
  ArrowRight,
  Globe,
  Award,
  Compass,
} from 'lucide-react';

export default function KudosWall() {
  const {
    kudos,
    users,
    offices,
    teams,
    values,
    addReaction,
    openComposer,
    metrics,
  } = useKudos();

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOffice, setSelectedOffice] = useState('all');
  const [selectedTeam, setSelectedTeam] = useState('all');
  const [selectedValue, setSelectedValue] = useState('all');
  const [selectedTimeframe, setSelectedTimeframe] = useState<'all' | '30d' | '7d'>('all');
  const [crossTeamOnly, setCrossTeamOnly] = useState(false);

  // Selected Person modal
  const [selectedUserForModal, setSelectedUserForModal] = useState<User | null>(null);

  const now = new Date();

  // Filter public and non-deleted kudos
  const filteredKudos = useMemo(() => {
    return kudos.filter(item => {
      if (item.deleted_at) return false;
      if (item.visibility === 'private') return false; // Public wall only

      const giver = users.find(u => u.id === item.giver_id);
      const recipientUsers = item.recipient_ids.map(id => users.find(u => u.id === id)).filter(Boolean) as User[];

      // Search Query (Giver name, recipient names, message)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const giverMatches = giver?.name.toLowerCase().includes(q);
        const recipientMatches = recipientUsers.some(r => r.name.toLowerCase().includes(q));
        const messageMatches = item.message.toLowerCase().includes(q);
        if (!giverMatches && !recipientMatches && !messageMatches) return false;
      }

      // Office filter
      if (selectedOffice !== 'all') {
        const matchesOffice =
          giver?.office_id === selectedOffice ||
          recipientUsers.some(r => r.office_id === selectedOffice);
        if (!matchesOffice) return false;
      }

      // Team filter
      if (selectedTeam !== 'all') {
        const matchesTeam =
          giver?.team_id === selectedTeam ||
          recipientUsers.some(r => r.team_id === selectedTeam);
        if (!matchesTeam) return false;
      }

      // Value tag filter
      if (selectedValue !== 'all') {
        if (item.value_id !== selectedValue) return false;
      }

      // Timeframe filter
      if (selectedTimeframe === '30d') {
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        if (new Date(item.created_at) < thirtyDaysAgo) return false;
      } else if (selectedTimeframe === '7d') {
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        if (new Date(item.created_at) < sevenDaysAgo) return false;
      }

      // Cross-team only filter
      if (crossTeamOnly) {
        if (!giver) return false;
        const isCross = recipientUsers.some(
          r => r.team_id !== giver.team_id || r.office_id !== giver.office_id
        );
        if (!isCross) return false;
      }

      return true;
    });
  }, [kudos, users, searchQuery, selectedOffice, selectedTeam, selectedValue, selectedTimeframe, crossTeamOnly]);

  return (
    <div className="flex-1 overflow-y-auto bg-brand-bg px-4 py-6 sm:px-8 space-y-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Wall Hero Banner */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-brand-card p-6 rounded-2xl border border-brand-border shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🌍</span>
              <h1 className="font-heading font-extrabold text-2xl text-brand-text tracking-tight">
                CodeLink Kudos Wall
              </h1>
            </div>
            <p className="text-xs text-brand-muted mt-1 max-w-xl leading-relaxed">
              Real-time feed of specific appreciation across HCMC, Da Nang, and Hanoi offices.
              Celebrating everyday craftsmanship, extreme ownership, and generous teamwork.
            </p>
          </div>

          <button
            onClick={() => openComposer({ source: 'slash' })}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-accent hover:bg-opacity-95 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-200" />
            <span>Give Kudos</span>
          </button>
        </div>

        {/* "Spotlight" Strip (First-time recipients this month & Cross-office kudos) */}
        <div className="bg-brand-highlight/50 rounded-2xl p-5 border border-brand-border space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-brand-accent" />
              <h2 className="font-heading font-bold text-sm text-brand-text uppercase tracking-wider">
                This Month&apos;s Spotlights
              </h2>
            </div>
            <span className="text-[11px] text-brand-muted">First-time recipients & cross-office collaborations</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Spotlight 1: Cross-Office Collaboration */}
            <div className="bg-white p-4 rounded-xl border border-brand-border shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-brand-secondary flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5" /> Cross-Office Collaboration
                </span>
                <span className="text-[10px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded font-mono">
                  HCMC ⇄ Da Nang
                </span>
              </div>
              <p className="text-xs text-brand-text/90 italic line-clamp-2">
                &ldquo;Fantastic cross-office collaboration between HCMC and Da Nang squads to deliver the unified design token system ahead of deadline.&rdquo;
              </p>
              <div className="text-[11px] text-brand-muted flex items-center justify-between pt-1">
                <span>By <strong>Linh Nguyen</strong> (HCMC)</span>
                <span>To <strong>An Vo</strong> (Da Nang)</span>
              </div>
            </div>

            {/* Spotlight 2: First-Time Recipient */}
            <div className="bg-white p-4 rounded-xl border border-brand-border shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-brand-accent flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> First-Time Recipient
                </span>
                <span className="text-[10px] bg-amber-50 text-amber-800 px-2 py-0.5 rounded font-mono">
                  New Milestone
                </span>
              </div>
              <p className="text-xs text-brand-text/90 italic line-clamp-2">
                &ldquo;Exceptional patience mentoring our new junior developers on the async event consumer architecture. The entire squad leveled up!&rdquo;
              </p>
              <div className="text-[11px] text-brand-muted flex items-center justify-between pt-1">
                <span>By <strong>Huy Dang</strong></span>
                <span>To <strong>Minh Tran</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Search & Filters Toolbar */}
        <div className="bg-brand-card p-4 rounded-2xl border border-brand-border shadow-xs space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="flex-1 min-w-[220px] relative">
              <Search className="w-4 h-4 text-brand-muted absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search by name, team, or message..."
                className="w-full pl-9 pr-4 py-2 bg-brand-bg text-xs border border-brand-border rounded-xl focus:outline-hidden focus:border-brand-accent"
              />
            </div>

            {/* Cross-Team Only Toggle Button */}
            <button
              onClick={() => setCrossTeamOnly(!crossTeamOnly)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                crossTeamOnly
                  ? 'bg-brand-secondary text-white border-brand-secondary shadow-xs'
                  : 'bg-brand-bg text-brand-text border-brand-border hover:border-brand-secondary'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Cross-Team Only</span>
            </button>
          </div>

          {/* Filter Pills row */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            {/* Office Filter */}
            <select
              value={selectedOffice}
              onChange={e => setSelectedOffice(e.target.value)}
              className="px-2.5 py-1.5 bg-brand-bg border border-brand-border rounded-lg text-brand-text text-xs focus:outline-hidden"
            >
              <option value="all">All Offices (3)</option>
              {offices.map(o => (
                <option key={o.id} value={o.id}>
                  {o.name}
                </option>
              ))}
            </select>

            {/* Team Filter */}
            <select
              value={selectedTeam}
              onChange={e => setSelectedTeam(e.target.value)}
              className="px-2.5 py-1.5 bg-brand-bg border border-brand-border rounded-lg text-brand-text text-xs focus:outline-hidden"
            >
              <option value="all">All Teams (8)</option>
              {teams.map(t => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>

            {/* Value Tag Filter */}
            <select
              value={selectedValue}
              onChange={e => setSelectedValue(e.target.value)}
              className="px-2.5 py-1.5 bg-brand-bg border border-brand-border rounded-lg text-brand-text text-xs focus:outline-hidden"
            >
              <option value="all">All Values</option>
              {values.map(v => (
                <option key={v.id} value={v.id}>
                  {v.icon} {v.name}
                </option>
              ))}
            </select>

            {/* Timeframe Filter */}
            <select
              value={selectedTimeframe}
              onChange={e => setSelectedTimeframe(e.target.value as any)}
              className="px-2.5 py-1.5 bg-brand-bg border border-brand-border rounded-lg text-brand-text text-xs focus:outline-hidden"
            >
              <option value="all">All Time (~90 days)</option>
              <option value="30d">Last 30 Days</option>
              <option value="7d">Last 7 Days</option>
            </select>

            {/* Clear filters button */}
            {(searchQuery || selectedOffice !== 'all' || selectedTeam !== 'all' || selectedValue !== 'all' || crossTeamOnly || selectedTimeframe !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedOffice('all');
                  setSelectedTeam('all');
                  setSelectedValue('all');
                  setSelectedTimeframe('all');
                  setCrossTeamOnly(false);
                }}
                className="text-[11px] text-brand-accent hover:underline ml-auto font-medium"
              >
                Reset filters
              </button>
            )}
          </div>
        </div>

        {/* Public Feed of Kudos Cards */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-brand-muted px-1">
            <span>Showing {filteredKudos.length} public kudos</span>
            <span className="italic">No leaderboards. Every contribution matters.</span>
          </div>

          {filteredKudos.length === 0 ? (
            <div className="bg-brand-card p-12 text-center rounded-2xl border border-brand-border text-brand-muted text-sm space-y-2">
              <p className="font-semibold text-brand-text">No kudos match your filters</p>
              <p className="text-xs">Try loosening your search terms or resetting filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredKudos.map(item => {
                const giver = users.find(u => u.id === item.giver_id);
                const recipientUsers = item.recipient_ids
                  .map(id => users.find(u => u.id === id))
                  .filter(Boolean) as User[];
                const val = values.find(v => v.id === item.value_id);
                const isCross = giver && recipientUsers.some(
                  r => r.team_id !== giver.team_id || r.office_id !== giver.office_id
                );

                return (
                  <div
                    key={item.id}
                    className="bg-brand-card p-5 rounded-2xl border border-brand-border shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-3"
                  >
                    {/* Header: Giver -> Recipients */}
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-1.5 text-xs">
                          {/* Giver clickable */}
                          <button
                            onClick={() => giver && setSelectedUserForModal(giver)}
                            className="flex items-center gap-1.5 font-bold text-brand-text hover:text-brand-accent transition-colors"
                          >
                            <img
                              src={giver?.avatar}
                              alt={giver?.name}
                              className="w-5 h-5 rounded-full object-cover"
                            />
                            <span>{giver?.name}</span>
                          </button>

                          <span className="text-brand-muted font-mono">→</span>

                          {/* Recipients clickable */}
                          {recipientUsers.map(r => (
                            <button
                              key={r.id}
                              onClick={() => setSelectedUserForModal(r)}
                              className="flex items-center gap-1 font-bold text-brand-text hover:text-brand-accent transition-colors bg-brand-bg px-2 py-0.5 rounded-md"
                            >
                              <img
                                src={r.avatar}
                                alt={r.name}
                                className="w-4 h-4 rounded-full object-cover"
                              />
                              <span>{r.name}</span>
                            </button>
                          ))}
                        </div>

                        {/* Cross Team / Cross Office indicator badge */}
                        {isCross && (
                          <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                            Cross-Team
                          </span>
                        )}
                      </div>

                      {/* Message Quote */}
                      <p className="text-xs text-brand-text leading-relaxed pl-3 border-l-2 border-brand-accent/60 bg-brand-bg/50 py-1.5 rounded-r">
                        &ldquo;{item.message}&rdquo;
                      </p>
                    </div>

                    {/* Footer: Value Tag, Reactions, Date */}
                    <div className="pt-2 border-t border-brand-border/60 flex flex-wrap items-center justify-between gap-2 text-xs">
                      {val ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-900 border border-amber-200">
                          <span>{val.icon}</span>
                          <span>{val.name}</span>
                        </span>
                      ) : (
                        <span />
                      )}

                      <div className="flex items-center gap-2">
                        {/* Interactive Reactions */}
                        {item.reactions && (
                          <div className="flex items-center gap-1">
                            {Object.entries(item.reactions).map(([emoji, uIds]) => (
                              <button
                                key={emoji}
                                onClick={() => addReaction(item.id, emoji)}
                                className="px-2 py-0.5 rounded-full bg-white border border-brand-border text-[11px] text-brand-text hover:border-brand-accent transition-colors"
                              >
                                {emoji} {uIds.length}
                              </button>
                            ))}
                          </div>
                        )}

                        <span className="text-[11px] text-brand-muted">
                          {new Date(item.created_at).toLocaleDateString([], {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Person Detail Page Modal */}
      {selectedUserForModal && (
        <PersonModal
          user={selectedUserForModal}
          onClose={() => setSelectedUserForModal(null)}
        />
      )}
    </div>
  );
}
