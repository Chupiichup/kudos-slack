'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useKudos } from '../../context/KudosContext';
import {
  X,
  Search,
  Check,
  Clock,
  Sparkles,
  AlertCircle,
  HelpCircle,
  Lock,
  Users,
  Building,
  Hash,
  Link as LinkIcon,
} from 'lucide-react';

export default function KudosModal() {
  const {
    isComposerOpen,
    closeComposer,
    composerInitialData,
    composerOpenedAt,
    users,
    values,
    teams,
    currentUser,
    sendKudos,
  } = useKudos();

  const [selectedRecipientIds, setSelectedRecipientIds] = useState<string[]>([]);
  const [recipientSearch, setRecipientSearch] = useState<string>('');
  const [isRecipientPickerOpen, setIsRecipientPickerOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [selectedValueId, setSelectedValueId] = useState<string | undefined>(undefined);
  const [visibility, setVisibility] = useState<'team' | 'company' | 'private'>('team');
  const [selectedTeamChannel, setSelectedTeamChannel] = useState<string>('c-engineering');
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Initialize from composerInitialData
  useEffect(() => {
    if (isComposerOpen) {
      if (composerInitialData?.recipients) {
        setSelectedRecipientIds(composerInitialData.recipients);
      } else {
        setSelectedRecipientIds([]);
      }
      setMessage('');
      setSelectedValueId('val-own-it'); // default suggested chip
      setVisibility('team');
      setElapsedSeconds(0);
    }
  }, [isComposerOpen, composerInitialData]);

  // Live timer for measuring time to send
  useEffect(() => {
    if (!isComposerOpen) return;
    const interval = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isComposerOpen]);

  // Filter searchable teammates (exclude current user to enforce no self-kudos)
  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      if (!u.active) return false;
      if (u.id === currentUser.id) return false; // Guardrail: no self kudos in picker
      if (!recipientSearch.trim()) return true;
      const q = recipientSearch.toLowerCase();
      const teamName = teams.find(t => t.id === u.team_id)?.name.toLowerCase() || '';
      return u.name.toLowerCase().includes(q) || teamName.includes(q);
    });
  }, [users, recipientSearch, currentUser, teams]);

  if (!isComposerOpen) return null;

  // Validation
  const minLength = 30;
  const currentLength = message.trim().length;
  const isLengthValid = currentLength >= minLength;
  const hasRecipients = selectedRecipientIds.length > 0;
  const hasSelfKudos = selectedRecipientIds.includes(currentUser.id);

  const canSubmit = hasRecipients && isLengthValid && !hasSelfKudos && !isSubmitting;

  const handleToggleRecipient = (userId: string) => {
    if (userId === currentUser.id) return; // Disallow self
    setSelectedRecipientIds(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const handleRemoveRecipient = (userId: string) => {
    setSelectedRecipientIds(prev => prev.filter(id => id !== userId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setIsSubmitting(true);
    try {
      await sendKudos({
        recipient_ids: selectedRecipientIds,
        message: message.trim(),
        value_id: selectedValueId,
        visibility,
        channel_id: visibility === 'team' ? selectedTeamChannel : undefined,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Block Kit Modal Container */}
      <div className="bg-[#FFFFFF] rounded-xl shadow-2xl border border-gray-200 w-full max-w-xl overflow-hidden animate-scale-up text-gray-900 my-auto">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎉</span>
            <div>
              <h2 className="font-bold text-lg text-gray-900 leading-tight">Give Kudos</h2>
              <p className="text-xs text-gray-500">Recognize teammates inside Slack in under 30s</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Live Timer Indicator */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono font-medium">
              <Clock className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
              <span>{elapsedSeconds}s</span>
            </div>
            <button
              onClick={closeComposer}
              className="text-gray-400 hover:text-gray-700 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Linked message preview if opened via shortcut */}
          {composerInitialData?.sourceMessagePreview && (
            <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg flex items-start gap-2.5 text-xs text-amber-900">
              <LinkIcon className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold">Linked message:</span> &ldquo;{composerInitialData.sourceMessagePreview}&rdquo;
              </div>
            </div>
          )}

          {/* 1. TO Field: Multi-Select Teammates */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                To (Teammates) <span className="text-red-500">*</span>
              </label>
              <span className="text-xs text-gray-400">Thank 1 person or a whole squad</span>
            </div>

            {/* Selected Pills Container */}
            <div className="min-h-[44px] p-2 border border-gray-300 rounded-lg bg-white flex flex-wrap items-center gap-1.5 focus-within:border-[#1164A3] focus-within:ring-1 focus-within:ring-[#1164A3]">
              {selectedRecipientIds.map(rId => {
                const u = users.find(user => user.id === rId);
                if (!u) return null;
                return (
                  <span
                    key={rId}
                    className="inline-flex items-center gap-1.5 pl-1.5 pr-2 py-1 rounded-md bg-gray-100 border border-gray-200 text-xs font-medium text-gray-800"
                  >
                    <img src={u.avatar} alt={u.name} className="w-4 h-4 rounded-full object-cover" />
                    <span>{u.name}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveRecipient(rId)}
                      className="text-gray-400 hover:text-gray-700 ml-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                );
              })}

              {/* Recipient Picker Toggle */}
              <button
                type="button"
                onClick={() => setIsRecipientPickerOpen(!isRecipientPickerOpen)}
                className="text-xs text-[#1264A3] hover:underline font-medium px-2 py-1 flex items-center gap-1"
              >
                <span>+ Add teammate...</span>
              </button>
            </div>

            {/* Teammate Search Dropdown */}
            {isRecipientPickerOpen && (
              <div className="mt-1 p-2 bg-white border border-gray-200 rounded-lg shadow-lg z-20 space-y-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    value={recipientSearch}
                    onChange={e => setRecipientSearch(e.target.value)}
                    placeholder="Search by name, team, or office..."
                    className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-md focus:outline-hidden focus:border-[#1264A3]"
                    autoFocus
                  />
                </div>

                <div className="max-h-48 overflow-y-auto divide-y divide-gray-100">
                  {filteredUsers.length === 0 ? (
                    <div className="p-3 text-center text-xs text-gray-400">No teammates found</div>
                  ) : (
                    filteredUsers.slice(0, 15).map(u => {
                      const isSelected = selectedRecipientIds.includes(u.id);
                      const team = teams.find(t => t.id === u.team_id)?.name;
                      return (
                        <div
                          key={u.id}
                          onClick={() => handleToggleRecipient(u.id)}
                          className={`flex items-center justify-between p-2 rounded cursor-pointer hover:bg-gray-50 text-xs ${
                            isSelected ? 'bg-blue-50/60 font-semibold text-[#1264A3]' : 'text-gray-700'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <img src={u.avatar} alt={u.name} className="w-6 h-6 rounded-full object-cover" />
                            <div>
                              <div className="font-medium text-gray-900">{u.name}</div>
                              <div className="text-[10px] text-gray-500">
                                {team} • {u.office_id === 'off-a' ? 'HCMC' : u.office_id === 'off-b' ? 'Da Nang' : 'Hanoi'}
                              </div>
                            </div>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-[#1264A3]" />}
                        </div>
                      );
                    })
                  )}
                </div>

                <div className="pt-1 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setIsRecipientPickerOpen(false)}
                    className="text-xs text-gray-600 hover:text-gray-900 px-3 py-1 bg-gray-100 rounded"
                  >
                    Done selecting
                  </button>
                </div>
              </div>
            )}

            {/* Self-kudos guardrail warning */}
            {hasSelfKudos && (
              <p className="text-xs text-red-600 flex items-center gap-1 font-medium mt-1">
                <AlertCircle className="w-3.5 h-3.5" /> You cannot give kudos to yourself.
              </p>
            )}
          </div>

          {/* 2. Guided Message with 30-char live counter */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                What did they do? Why did it matter? <span className="text-red-500">*</span>
              </label>
              {/* Live Counter */}
              <span
                className={`text-xs font-mono font-medium ${
                  isLengthValid ? 'text-emerald-600' : 'text-amber-600'
                }`}
              >
                {currentLength} / {minLength} min chars
                {!isLengthValid && ` (${minLength - currentLength} more needed)`}
              </span>
            </div>

            <textarea
              rows={4}
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="E.g., Huge props for jumping on the late-night staging deployment blocker right before client demo day. You stayed until midnight to ensure our release passed all regression tests without a hiccup!"
              className="w-full p-3 text-xs border border-gray-300 rounded-lg focus:outline-hidden focus:border-[#1264A3] focus:ring-1 focus:ring-[#1264A3] leading-relaxed resize-none"
            />

            {/* Helpful Guidance Hint */}
            <p className="text-[11px] text-gray-500 flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <span>Specific kudos mean more: describe what they did and why it mattered to the team or client.</span>
            </p>
          </div>

          {/* 3. Value Tag Chips (Optional) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
              Value Tag <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {values.filter(v => v.active).map(val => {
                const isSelected = selectedValueId === val.id;
                return (
                  <button
                    key={val.id}
                    type="button"
                    onClick={() => setSelectedValueId(isSelected ? undefined : val.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border flex items-center gap-1.5 transition-all ${
                      isSelected
                        ? 'bg-amber-50 border-amber-300 text-amber-900 shadow-xs font-semibold'
                        : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <span>{val.icon}</span>
                    <span>{val.name}</span>
                    {isSelected && <Check className="w-3 h-3 text-amber-700" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Share to (Visibility selector) */}
          <div className="space-y-1.5 pt-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
              Share to <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {/* Option: Team Channel */}
              <label
                className={`p-3 border rounded-xl cursor-pointer flex flex-col gap-1 transition-all text-xs ${
                  visibility === 'team'
                    ? 'border-[#1264A3] bg-blue-50/40 text-blue-900 ring-1 ring-[#1264A3]'
                    : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold">
                    <Hash className="w-3.5 h-3.5 text-[#1264A3]" />
                    <span>Team channel</span>
                  </div>
                  <input
                    type="radio"
                    name="visibility"
                    value="team"
                    checked={visibility === 'team'}
                    onChange={() => setVisibility('team')}
                    className="accent-[#1264A3]"
                  />
                </div>
                <p className="text-[11px] text-gray-500">Default. Celebrates within team pod context.</p>
              </label>

              {/* Option: Company #kudos */}
              <label
                className={`p-3 border rounded-xl cursor-pointer flex flex-col gap-1 transition-all text-xs ${
                  visibility === 'company'
                    ? 'border-[#1264A3] bg-blue-50/40 text-blue-900 ring-1 ring-[#1264A3]'
                    : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold">
                    <Building className="w-3.5 h-3.5 text-amber-600" />
                    <span>Company #kudos</span>
                  </div>
                  <input
                    type="radio"
                    name="visibility"
                    value="company"
                    checked={visibility === 'company'}
                    onChange={() => setVisibility('company')}
                    className="accent-[#1264A3]"
                  />
                </div>
                <p className="text-[11px] text-gray-500">Public praise seen by all 3 offices.</p>
              </label>

              {/* Option: Private */}
              <label
                className={`p-3 border rounded-xl cursor-pointer flex flex-col gap-1 transition-all text-xs ${
                  visibility === 'private'
                    ? 'border-[#1264A3] bg-blue-50/40 text-blue-900 ring-1 ring-[#1264A3]'
                    : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold">
                    <Lock className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Private DM</span>
                  </div>
                  <input
                    type="radio"
                    name="visibility"
                    value="private"
                    checked={visibility === 'private'}
                    onChange={() => setVisibility('private')}
                    className="accent-[#1264A3]"
                  />
                </div>
                <p className="text-[11px] text-gray-500">Only recipient & their direct manager.</p>
              </label>
            </div>

            {/* Team Channel selector if visibility is team */}
            {visibility === 'team' && (
              <div className="pt-1 flex items-center gap-2">
                <span className="text-xs text-gray-500">Post into:</span>
                <select
                  value={selectedTeamChannel}
                  onChange={e => setSelectedTeamChannel(e.target.value)}
                  className="text-xs border border-gray-300 rounded-md px-2 py-1 bg-white text-gray-800 focus:outline-hidden focus:border-[#1264A3]"
                >
                  <option value="c-engineering">#team-engineering (Fintech Core)</option>
                  <option value="c-design">#team-design (Design System)</option>
                  <option value="c-general">#general (Company-wide)</option>
                </select>
              </div>
            )}
          </div>

          {/* Modal Actions Footer */}
          <div className="pt-4 border-t border-gray-200 flex items-center justify-between">
            <button
              type="button"
              onClick={closeComposer}
              className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!canSubmit}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs font-bold text-white shadow-md transition-all ${
                canSubmit
                  ? 'bg-[#007A5A] hover:bg-[#006C4F] cursor-pointer'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
              <span>{isSubmitting ? 'Sending...' : 'Send Kudos'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
