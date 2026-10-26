'use client';

import React, { useState } from 'react';
import { useKudos } from '../../context/KudosContext';
import {
  BarChart3,
  ShieldCheck,
  Download,
  Users,
  Building,
  Heart,
  Sliders,
  AlertTriangle,
  Sparkles,
  TrendingUp,
  Clock,
  Compass,
  CheckCircle2,
  Lock,
  ChevronRight,
  UserCheck,
} from 'lucide-react';

export default function TalentAdmin() {
  const {
    currentUser,
    setCurrentUserById,
    metrics,
    users,
    offices,
    teams,
    values,
    kudos,
    rules,
  } = useKudos();

  const [activeAdminTab, setActiveAdminTab] = useState<
    'reports' | 'safety-net' | 'readout' | 'export' | 'settings' | 'roadmap'
  >('reports');

  // Check role authorization
  const isAdmin = currentUser.role === 'admin';

  // Export CSV handler
  const handleExportCSV = () => {
    const validKudos = kudos.filter(k => !k.deleted_at);
    const headers = [
      'Kudos ID',
      'Date',
      'Giver Name',
      'Giver Email',
      'Giver Office',
      'Recipient Names',
      'Value Tag',
      'Visibility',
      'Message Text',
      'Compose Duration (ms)',
      'Reaction Count',
      'Reply Count',
    ];

    const rows = validKudos.map(k => {
      const giver = users.find(u => u.id === k.giver_id);
      const giverOffice = offices.find(o => o.id === giver?.office_id)?.name || '';
      const recNames = k.recipient_ids
        .map(rId => users.find(u => u.id === rId)?.name || '')
        .join('; ');
      const valName = values.find(v => v.id === k.value_id)?.name || 'None';
      const cleanMessage =
        k.visibility === 'private'
          ? '[PRIVATE KUDOS CONTENT MASKED]'
          : `"${k.message.replace(/"/g, '""')}"`;
      const reactionCount = k.reactions
        ? Object.values(k.reactions).reduce((acc, uIds) => acc + uIds.length, 0)
        : 0;

      return [
        k.id,
        k.created_at,
        giver?.name || '',
        giver?.email || '',
        giverOffice,
        recNames,
        valName,
        k.visibility,
        cleanMessage,
        k.compose_ms || '',
        reactionCount,
        k.replies?.length || 0,
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `codelink_kudos_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isAdmin) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 bg-brand-bg">
        <div className="max-w-md w-full bg-brand-card p-8 rounded-2xl border border-brand-border shadow-lg text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="font-heading font-bold text-xl text-brand-text">
            Talent Admin Access Required
          </h2>
          <p className="text-xs text-brand-muted leading-relaxed">
            The Talent Administration portal contains sensitive organizational adoption telemetry, the 30-day fairness safety net, and ritual preparation tools.
          </p>
          <div className="pt-2">
            <button
              onClick={() => setCurrentUserById('usr-sarah')}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand-accent text-white font-bold text-xs shadow-md hover:bg-opacity-90 transition-all cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Switch to Sarah Jenkins (VP Talent Admin)</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const comingLaterRoadmap = [
    { name: 'Leaderboard of kudos received', tag: "Won't do", reason: 'Damages psychological safety & creates insincere gaming' },
    { name: 'AI-suggested prompts', tag: "Won't do", reason: 'Eats away genuine personal sincerity' },
    { name: 'Nudges and weekly reminders', tag: 'V2', reason: 'Gentle nudges after natural baseline forms' },
    { name: 'Allowance quotas', tag: 'V2 pilot', reason: 'Pilot periodically balanced giving quotas' },
    { name: 'Monthly personal recap DM', tag: 'V2', reason: 'Automated Bot DMs summarizing giving and receiving' },
    { name: 'Rotating Fair Awards', tag: 'V2', reason: 'Judged on collaborative breadth, not raw volume' },
    { name: 'Anniversaries & onboarding milestones', tag: 'V2', reason: 'Milestone hooks into Slack' },
    { name: 'Points, badges, and streaks', tag: 'V3', reason: 'Evaluated only after cultural habit stabilizes' },
    { name: 'Rewards catalog & perks', tag: 'V3', reason: 'Redeemable items and company perks' },
    { name: 'GIF and custom image uploads', tag: 'V3', reason: 'Rich media in composer' },
    { name: 'Team quests & collective challenges', tag: 'V3', reason: 'Squad-level milestones' },
    { name: 'Advanced analytics dashboards', tag: 'V4', reason: 'Self-serve multi-dimensional BI reports' },
    { name: 'Other chat platforms', tag: 'Contingent', reason: 'Only if CodeLink migrates off Slack' },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-brand-bg px-4 py-6 sm:px-8 space-y-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Admin Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-brand-card p-6 rounded-2xl border border-brand-border shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-brand-secondary" />
              <h1 className="font-heading font-extrabold text-2xl text-brand-text">
                Talent Administration
              </h1>
            </div>
            <p className="text-xs text-brand-muted mt-1">
              Real-time recognition analytics, fairness monitoring, ritual helpers, and governance.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-secondary text-white font-bold text-xs shadow-sm hover:bg-opacity-95 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap border-b border-brand-border bg-white rounded-t-2xl px-4 text-xs font-semibold">
          {[
            { id: 'reports', label: 'Monthly Report Cards', icon: BarChart3 },
            { id: 'safety-net', label: `Fairness Safety Net (${metrics.unrecognisedUsers30d.length})`, icon: AlertTriangle },
            { id: 'readout', label: 'Ritual Read-Out Helper', icon: Sparkles },
            { id: 'export', label: 'Data Export', icon: Download },
            { id: 'settings', label: 'Settings & Rules', icon: Sliders },
            { id: 'roadmap', label: 'Coming Later (Roadmap)', icon: Clock },
          ].map(t => {
            const Icon = t.icon;
            const isActive = activeAdminTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveAdminTab(t.id as any)}
                className={`flex items-center gap-2 py-3.5 px-4 border-b-2 transition-all ${
                  isActive
                    ? 'border-brand-accent text-brand-accent font-bold'
                    : 'border-transparent text-brand-muted hover:text-brand-text'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: MONTHLY REPORT CARDS */}
        {activeAdminTab === 'reports' && (
          <div className="space-y-6 animate-fade-in">
            {/* North Star + Core Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* North Star */}
              <div className="bg-brand-card p-5 rounded-2xl border-2 border-brand-accent/40 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-brand-accent uppercase tracking-wider text-[10px]">
                    North Star
                  </span>
                  <span className="text-[10px] text-brand-muted">Target: 25% M3</span>
                </div>
                <div className="text-3xl font-heading font-extrabold text-brand-text">
                  {metrics.weeklyActiveGiversPct}%
                </div>
                <p className="text-[11px] text-brand-muted leading-tight">
                  Weekly Active Givers (4-wk rolling avg, denominator = 120 staff)
                </p>
                {/* 4-week trend bar mini visualization */}
                <div className="flex items-end gap-1.5 pt-2 h-10">
                  {metrics.weeklyTrend.map(wt => (
                    <div key={wt.week} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        className="w-full bg-brand-accent/80 rounded-t"
                        style={{ height: `${Math.max(15, wt.pct * 1.2)}%` }}
                        title={`${wt.week}: ${wt.pct}%`}
                      />
                      <span className="text-[9px] text-brand-muted">{wt.week.replace('W-', '')}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 30-Day Reach */}
              <div className="bg-brand-card p-5 rounded-2xl border border-brand-border shadow-xs space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-brand-secondary uppercase tracking-wider text-[10px]">
                    Adoption
                  </span>
                  <span className="text-[10px] text-brand-muted">Target: 80-85%</span>
                </div>
                <div className="text-3xl font-heading font-extrabold text-brand-text">
                  {metrics.reach30dPct}%
                </div>
                <p className="text-[11px] text-brand-muted leading-tight">
                  30-Day Reach (% who gave or received in the last 30 days)
                </p>
                <div className="w-full bg-brand-bg rounded-full h-2 mt-4 overflow-hidden border border-brand-border">
                  <div className="bg-brand-secondary h-full rounded-full" style={{ width: `${metrics.reach30dPct}%` }} />
                </div>
              </div>

              {/* Recipient Coverage (Always <= Reach) */}
              <div className="bg-brand-card p-5 rounded-2xl border border-brand-border shadow-xs space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-brand-text uppercase tracking-wider text-[10px]">
                    Equity & Coverage
                  </span>
                  <span className="text-[10px] text-brand-muted">Target: ≥80%</span>
                </div>
                <div className="text-3xl font-heading font-extrabold text-brand-text">
                  {metrics.recipientCoverage30dPct}%
                </div>
                <p className="text-[11px] text-brand-muted leading-tight">
                  Recipient Coverage (% who received ≥1 in 30 days). Always ≤ reach.
                </p>
                <div className="w-full bg-brand-bg rounded-full h-2 mt-4 overflow-hidden border border-brand-border">
                  <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${metrics.recipientCoverage30dPct}%` }} />
                </div>
              </div>

              {/* Manager Participation */}
              <div className="bg-brand-card p-5 rounded-2xl border border-brand-border shadow-xs space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-amber-700 uppercase tracking-wider text-[10px]">
                    Manager Loop
                  </span>
                  <span className="text-[10px] text-brand-muted">Target: ≥80%</span>
                </div>
                <div className="text-3xl font-heading font-extrabold text-brand-text">
                  {metrics.managerParticipationPct}%
                </div>
                <p className="text-[11px] text-brand-muted leading-tight">
                  Manager Participation (% of active leads who gave ≥1 this month)
                </p>
                <div className="w-full bg-brand-bg rounded-full h-2 mt-4 overflow-hidden border border-brand-border">
                  <div className="bg-amber-600 h-full rounded-full" style={{ width: `${metrics.managerParticipationPct}%` }} />
                </div>
              </div>
            </div>

            {/* Secondary Operational Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Cross-Team Share */}
              <div className="bg-brand-card p-4 rounded-xl border border-brand-border space-y-1">
                <span className="text-[11px] text-brand-muted">Cross-Team / Office Share</span>
                <div className="text-xl font-bold font-heading text-brand-text">
                  {metrics.crossTeamSharePct}%
                </div>
                <span className="text-[10px] text-emerald-700 font-medium">Target: ≥30%</span>
              </div>

              {/* Median Time to Send */}
              <div className="bg-brand-card p-4 rounded-xl border border-brand-border space-y-1">
                <span className="text-[11px] text-brand-muted">Median Time to Send</span>
                <div className="text-xl font-bold font-heading text-brand-text">
                  {metrics.medianTimeToSendSeconds}s
                </div>
                <span className="text-[10px] text-emerald-700 font-medium">Target: &lt;30s (Median, not avg)</span>
              </div>

              {/* Completion Rate */}
              <div className="bg-brand-card p-4 rounded-xl border border-brand-border space-y-1">
                <span className="text-[11px] text-brand-muted">Composer Completion Rate</span>
                <div className="text-xl font-bold font-heading text-brand-text">
                  {metrics.completionRatePct}%
                </div>
                <span className="text-[10px] text-emerald-700 font-medium">Target: ≥70% sent/opened</span>
              </div>

              {/* Value-tag Share */}
              <div className="bg-brand-card p-4 rounded-xl border border-brand-border space-y-1">
                <span className="text-[11px] text-brand-muted">Value-Tag Share</span>
                <div className="text-xl font-bold font-heading text-brand-text">
                  {metrics.valueTagSharePct}%
                </div>
                <span className="text-[10px] text-brand-muted font-medium">High adherence to core values</span>
              </div>
            </div>

            {/* Breakdown by Office and Team */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Office Breakdown */}
              <div className="bg-brand-card p-5 rounded-2xl border border-brand-border space-y-3">
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-brand-secondary" />
                  <h3 className="font-heading font-bold text-sm text-brand-text">Office Adoption Breakdown</h3>
                </div>
                <div className="divide-y divide-brand-border/60 text-xs">
                  {metrics.officeBreakdown.map(ob => (
                    <div key={ob.office} className="py-2.5 flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-brand-text">{ob.office}</span>
                        <div className="text-[11px] text-brand-muted">
                          Given: {ob.kudosGiven} • Received: {ob.kudosReceived}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-brand-text">{ob.reachPct}% reach</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Team Breakdown */}
              <div className="bg-brand-card p-5 rounded-2xl border border-brand-border space-y-3">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-brand-accent" />
                  <h3 className="font-heading font-bold text-sm text-brand-text">Team Activity Breakdown</h3>
                </div>
                <div className="divide-y divide-brand-border/60 text-xs max-h-56 overflow-y-auto">
                  {metrics.teamBreakdown.map(tb => (
                    <div key={tb.team} className="py-2.5 flex items-center justify-between">
                      <span className="font-semibold text-brand-text">{tb.team}</span>
                      <div className="text-[11px] text-brand-muted space-x-3">
                        <span>Given: <strong className="text-brand-text">{tb.kudosGiven}</strong></span>
                        <span>Received: <strong className="text-brand-text">{tb.kudosReceived}</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: FAIRNESS SAFETY NET ("Not recognised in 30 days") */}
        {activeAdminTab === 'safety-net' && (
          <div className="bg-brand-card p-6 rounded-2xl border border-brand-border space-y-4 animate-fade-in">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  <h2 className="font-heading font-bold text-base text-brand-text">
                    Not Recognised in the Last 30 Days ({metrics.unrecognisedUsers30d.length} Staff)
                  </h2>
                </div>
                <p className="text-xs text-brand-muted mt-1 leading-relaxed">
                  Admin-only fairness safety net. These active employees have not received any kudos in the past 30 days. Use this list to prompt their direct managers during monthly check-ins without creating public pressure.
                </p>
              </div>
              <span className="text-xs bg-amber-50 text-amber-900 border border-amber-200 px-3 py-1 rounded-full font-mono">
                Admin Eyes Only
              </span>
            </div>

            <div className="border border-brand-border rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left divide-y divide-brand-border">
                <thead className="bg-brand-bg font-semibold text-brand-muted">
                  <tr>
                    <th className="p-3">Staff Member</th>
                    <th className="p-3">Office</th>
                    <th className="p-3">Team</th>
                    <th className="p-3">Direct Lead / Manager</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border bg-white">
                  {metrics.unrecognisedUsers30d.slice(0, 15).map(u => {
                    const office = offices.find(o => o.id === u.office_id);
                    const team = teams.find(t => t.id === u.team_id);
                    const manager = users.find(m => m.id === u.manager_id);
                    return (
                      <tr key={u.id} className="hover:bg-brand-bg/50">
                        <td className="p-3 flex items-center gap-2 font-medium text-brand-text">
                          <img src={u.avatar} alt={u.name} className="w-6 h-6 rounded-full object-cover" />
                          <span>{u.name}</span>
                        </td>
                        <td className="p-3 text-brand-muted">{office?.name}</td>
                        <td className="p-3 text-brand-muted">{team?.name}</td>
                        <td className="p-3 font-medium text-brand-text">
                          {manager ? manager.name : 'None'}
                        </td>
                        <td className="p-3 text-right">
                          <span className="text-[11px] text-brand-secondary font-semibold cursor-pointer hover:underline">
                            Remind Lead
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: READ-OUT HELPER */}
        {activeAdminTab === 'readout' && (
          <div className="bg-brand-card p-6 rounded-2xl border border-brand-border space-y-5 animate-fade-in">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <h2 className="font-heading font-bold text-base text-brand-text">
                  Monthly Ritual Read-Out Helper
                </h2>
              </div>
              <p className="text-xs text-brand-muted mt-1 leading-relaxed">
                Suggested kudos to read out at the monthly all-hands company ritual.
                <strong> Notice:</strong> Curated strictly by collaborative breadth and value alignment. <em>Never ranked by volume or count.</em>
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Category 1: Cross-Office */}
              <div className="bg-brand-bg p-4 rounded-xl border border-brand-border space-y-3">
                <span className="text-xs font-bold text-brand-secondary uppercase tracking-wider">
                  Cross-Office Bridge
                </span>
                <div className="space-y-2">
                  {metrics.ritualSuggestions.crossOffice.slice(0, 2).map(k => {
                    const giver = users.find(u => u.id === k.giver_id);
                    const rec = users.find(u => u.id === k.recipient_ids[0]);
                    return (
                      <div key={k.id} className="p-3 bg-white rounded-lg border border-brand-border text-xs space-y-1">
                        <div className="font-semibold text-brand-text">{giver?.name} → {rec?.name}</div>
                        <p className="text-[11px] text-brand-muted line-clamp-3 italic">&ldquo;{k.message}&rdquo;</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Category 2: Value Champions */}
              <div className="bg-brand-bg p-4 rounded-xl border border-brand-border space-y-3">
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                  Core Value Champions
                </span>
                <div className="space-y-2">
                  {metrics.ritualSuggestions.valueChampions.slice(0, 2).map(k => {
                    const giver = users.find(u => u.id === k.giver_id);
                    const rec = users.find(u => u.id === k.recipient_ids[0]);
                    const val = values.find(v => v.id === k.value_id);
                    return (
                      <div key={k.id} className="p-3 bg-white rounded-lg border border-brand-border text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-brand-text">{giver?.name} → {rec?.name}</span>
                          <span className="text-[10px] text-amber-800 font-medium">{val?.name}</span>
                        </div>
                        <p className="text-[11px] text-brand-muted line-clamp-3 italic">&ldquo;{k.message}&rdquo;</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Category 3: First-Time Recipients */}
              <div className="bg-brand-bg p-4 rounded-xl border border-brand-border space-y-3">
                <span className="text-xs font-bold text-brand-accent uppercase tracking-wider">
                  Unsung Heroes (First-Time)
                </span>
                <div className="space-y-2">
                  {metrics.ritualSuggestions.firstTime.slice(0, 2).map(k => {
                    const giver = users.find(u => u.id === k.giver_id);
                    const rec = users.find(u => u.id === k.recipient_ids[0]);
                    return (
                      <div key={k.id} className="p-3 bg-white rounded-lg border border-brand-border text-xs space-y-1">
                        <div className="font-semibold text-brand-text">{giver?.name} → {rec?.name}</div>
                        <p className="text-[11px] text-brand-muted line-clamp-3 italic">&ldquo;{k.message}&rdquo;</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: DATA EXPORT */}
        {activeAdminTab === 'export' && (
          <div className="bg-brand-card p-6 rounded-2xl border border-brand-border space-y-4 animate-fade-in">
            <h2 className="font-heading font-bold text-base text-brand-text">CSV Data Export</h2>
            <p className="text-xs text-brand-muted leading-relaxed">
              Export full historical recognition data for culture reporting and leadership reviews.
              Private kudos messages are masked to protect confidentiality.
            </p>
            <div className="pt-2">
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-accent text-white font-bold text-xs shadow-md hover:bg-opacity-95 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Download All Kudos CSV ({kudos.length} rows)</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 5: SETTINGS & RULES */}
        {activeAdminTab === 'settings' && (
          <div className="bg-brand-card p-6 rounded-2xl border border-brand-border space-y-6 animate-fade-in text-xs">
            {/* Rules (Fixed in V1) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-heading font-bold text-sm text-brand-text">System Guardrails</h3>
                <span className="px-2.5 py-0.5 rounded-full bg-brand-highlight text-brand-accent text-[11px] font-bold">
                  Fixed in V1 · Configurable from V2
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3 bg-brand-bg rounded-xl border border-brand-border space-y-1">
                  <span className="text-brand-muted text-[11px]">Minimum Message Length</span>
                  <div className="font-bold text-brand-text text-sm">{rules.min_length} characters</div>
                  <p className="text-[10px] text-brand-muted">Enforces specific, high-sincerity praise</p>
                </div>
                <div className="p-3 bg-brand-bg rounded-xl border border-brand-border space-y-1">
                  <span className="text-brand-muted text-[11px]">Edit / Delete Window</span>
                  <div className="font-bold text-brand-text text-sm">{rules.edit_window_minutes} minutes</div>
                  <p className="text-[10px] text-brand-muted">Typo correction before immutability locks in</p>
                </div>
                <div className="p-3 bg-brand-bg rounded-xl border border-brand-border space-y-1">
                  <span className="text-brand-muted text-[11px]">Default Visibility</span>
                  <div className="font-bold text-brand-text text-sm capitalize">{rules.default_visibility} Channel</div>
                  <p className="text-[10px] text-brand-muted">Celebrates within squad peer group</p>
                </div>
              </div>
            </div>

            {/* Company Values Settings */}
            <div className="space-y-3 pt-2">
              <h3 className="font-heading font-bold text-sm text-brand-text">Active Company Core Values</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {values.map(v => (
                  <div key={v.id} className="p-3 bg-brand-bg rounded-xl border border-brand-border flex items-start gap-2.5">
                    <span className="text-xl">{v.icon}</span>
                    <div>
                      <div className="font-bold text-brand-text">{v.name}</div>
                      <p className="text-[11px] text-brand-muted">{v.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: ROADMAP (Explicitly NOT in V1) */}
        {activeAdminTab === 'roadmap' && (
          <div className="bg-brand-card p-6 rounded-2xl border border-brand-border space-y-4 animate-fade-in text-xs">
            <div>
              <h2 className="font-heading font-bold text-base text-brand-text">Scope Boundaries & Future Releases</h2>
              <p className="text-xs text-brand-muted mt-1 leading-relaxed">
                To guarantee launch velocity and protect genuine peer sincerity, the following items are strictly out-of-scope for V1.
              </p>
            </div>

            <div className="divide-y divide-brand-border border border-brand-border rounded-xl bg-white overflow-hidden">
              {comingLaterRoadmap.map((item, idx) => (
                <div key={idx} className="p-3 flex items-center justify-between opacity-75 hover:opacity-100 transition-opacity">
                  <div className="space-y-0.5">
                    <span className="font-medium text-brand-text">{item.name}</span>
                    <p className="text-[11px] text-brand-muted">{item.reason}</p>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                      item.tag === "Won't do"
                        ? 'bg-red-100 text-red-800'
                        : item.tag.startsWith('V2')
                        ? 'bg-blue-100 text-blue-800'
                        : item.tag.startsWith('V3')
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {item.tag}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
