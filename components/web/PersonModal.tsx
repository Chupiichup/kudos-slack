'use client';

import React, { useState } from 'react';
import { useKudos } from '../../context/KudosContext';
import { User } from '../../types';
import {
  X,
  Building,
  Users,
  UserCheck,
  Inbox,
  Send,
  Lock,
  Sparkles,
} from 'lucide-react';

interface PersonModalProps {
  user: User | null;
  onClose: () => void;
}

export default function PersonModal({ user, onClose }: PersonModalProps) {
  const { kudos, users, offices, teams, values } = useKudos();
  const [tab, setTab] = useState<'received' | 'given'>('received');

  if (!user) return null;

  const office = offices.find(o => o.id === user.office_id);
  const team = teams.find(t => t.id === user.team_id);
  const manager = users.find(u => u.id === user.manager_id);

  // Filter public and non-deleted kudos for this user
  const receivedKudos = kudos.filter(
    k => !k.deleted_at && k.visibility !== 'private' && k.recipient_ids.includes(user.id)
  );
  const givenKudos = kudos.filter(
    k => !k.deleted_at && k.visibility !== 'private' && k.giver_id === user.id
  );

  const displayedList = tab === 'received' ? receivedKudos : givenKudos;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-brand-card rounded-2xl border border-brand-border shadow-2xl w-full max-w-2xl overflow-hidden animate-scale-up text-brand-text my-auto">
        {/* Header / Profile Hero */}
        <div className="p-6 bg-brand-bg border-b border-brand-border flex items-start justify-between relative">
          <div className="flex items-center gap-4">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-md"
            />
            <div className="space-y-1">
              <h3 className="font-heading font-bold text-xl text-brand-text leading-tight">
                {user.name}
              </h3>
              <p className="text-xs text-brand-muted font-medium">{user.job_title || 'Software Engineer'}</p>
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white border border-brand-border text-brand-text text-[11px]">
                  <Building className="w-3 h-3 text-brand-secondary" />
                  <span>{office?.name || 'Office'}</span>
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white border border-brand-border text-brand-text text-[11px]">
                  <Users className="w-3 h-3 text-brand-accent" />
                  <span>{team?.name || 'Team'}</span>
                </span>
                {manager && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white border border-brand-border text-brand-text text-[11px]">
                    <UserCheck className="w-3 h-3 text-emerald-600" />
                    <span>Lead: {manager.name}</span>
                  </span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-brand-muted hover:text-brand-text p-1.5 rounded-lg hover:bg-black/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-brand-border bg-white px-6">
          <button
            onClick={() => setTab('received')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition-all ${
              tab === 'received'
                ? 'border-brand-accent text-brand-accent font-bold'
                : 'border-transparent text-brand-muted hover:text-brand-text'
            }`}
          >
            <Inbox className="w-4 h-4" />
            <span>Kudos Received ({receivedKudos.length})</span>
          </button>
          <button
            onClick={() => setTab('given')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition-all ${
              tab === 'given'
                ? 'border-brand-accent text-brand-accent font-bold'
                : 'border-transparent text-brand-muted hover:text-brand-text'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>Kudos Given ({givenKudos.length})</span>
          </button>
        </div>

        {/* Feed of Kudos */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-3 bg-brand-bg/40">
          {displayedList.length === 0 ? (
            <div className="p-8 text-center text-xs text-brand-muted bg-white rounded-xl border border-brand-border">
              No public kudos in this list yet.
            </div>
          ) : (
            displayedList.map(item => {
              const giver = users.find(u => u.id === item.giver_id);
              const recipients = item.recipient_ids
                .map(rId => users.find(u => u.id === rId)?.name || 'Someone')
                .join(', ');
              const val = values.find(v => v.id === item.value_id);

              return (
                <div
                  key={item.id}
                  className="p-4 bg-brand-card rounded-xl border border-brand-border shadow-xs space-y-2.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-brand-text">{giver?.name}</span>
                      <span className="text-brand-muted">→</span>
                      <span className="font-bold text-brand-text">{recipients}</span>
                    </div>
                    <span className="text-[11px] text-brand-muted">
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-xs text-brand-text/90 leading-relaxed pl-3 border-l-2 border-brand-accent/50">
                    &ldquo;{item.message}&rdquo;
                  </p>

                  <div className="flex items-center justify-between pt-1">
                    {val && (
                      <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200 font-medium">
                        <span>{val.icon}</span>
                        <span>{val.name}</span>
                      </span>
                    )}

                    {item.reactions && Object.keys(item.reactions).length > 0 && (
                      <div className="flex items-center gap-1 text-xs">
                        {Object.entries(item.reactions).map(([emoji, uIds]) => (
                          <span key={emoji} className="bg-white px-1.5 py-0.5 rounded border border-brand-border text-[11px]">
                            {emoji} {uIds.length}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
