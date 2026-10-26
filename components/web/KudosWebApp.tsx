'use client';

import React, { useState } from 'react';
import { useKudos } from '../../context/KudosContext';
import KudosWall from './KudosWall';
import TalentAdmin from './TalentAdmin';
import { Globe, ShieldCheck, Layers, LogIn, Check } from 'lucide-react';

export default function KudosWebApp() {
  const { currentRole, currentUser } = useKudos();
  const [subTab, setSubTab] = useState<'wall' | 'admin'>('wall');

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-brand-bg">
      {/* Web App Navigation Bar */}
      <div className="bg-brand-card border-b border-brand-border px-6 py-2 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setSubTab('wall')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-semibold transition-all ${
              subTab === 'wall'
                ? 'bg-brand-accent text-white shadow-xs'
                : 'text-brand-muted hover:text-brand-text hover:bg-brand-bg'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Kudos Wall</span>
          </button>

          <button
            onClick={() => setSubTab('admin')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-semibold transition-all ${
              subTab === 'admin'
                ? 'bg-brand-secondary text-white shadow-xs'
                : 'text-brand-muted hover:text-brand-text hover:bg-brand-bg'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Talent Admin</span>
            {currentRole === 'admin' && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            )}
          </button>
        </div>

        {/* Fake "Sign in with Slack" Status */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-brand-muted hidden sm:inline">Authenticated via Slack:</span>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-brand-border text-brand-text font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="font-semibold">{currentUser.name}</span>
            <span className="text-[10px] text-brand-muted">({currentUser.role})</span>
          </div>
        </div>
      </div>

      {/* Main View */}
      {subTab === 'wall' ? <KudosWall /> : <TalentAdmin />}
    </div>
  );
}
