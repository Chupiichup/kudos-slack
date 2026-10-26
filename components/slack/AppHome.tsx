'use client';

import React, { useState } from 'react';
import { useKudos } from '../../context/KudosContext';
import {
  Sparkles,
  Inbox,
  Send,
  Clock,
  Edit2,
  Trash2,
  Lock,
  Building,
  Hash,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';

export default function AppHome() {
  const {
    currentUser,
    kudos,
    values,
    users,
    rules,
    openComposer,
    editKudos,
    deleteKudos,
    setSelectedSlackChannel,
  } = useKudos();

  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');
  const [editingKudosId, setEditingKudosId] = useState<string | null>(null);
  const [editMessage, setEditMessage] = useState<string>('');
  const [editValueId, setEditValueId] = useState<string | undefined>(undefined);

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  // Filter valid (non-deleted) kudos for current user
  const userReceivedKudos = kudos.filter(
    k => !k.deleted_at && k.recipient_ids.includes(currentUser.id)
  );
  const userSentKudos = kudos.filter(
    k => !k.deleted_at && k.giver_id === currentUser.id
  );

  // Calculate monthly personal summary line
  const gaveThisMonth = userSentKudos.filter(
    k => new Date(k.created_at) >= startOfMonth
  ).length;
  const receivedThisMonth = userReceivedKudos.filter(
    k => new Date(k.created_at) >= startOfMonth
  ).length;

  const displayedList = activeTab === 'received' ? userReceivedKudos : userSentKudos;

  const handleStartEdit = (kudosItem: (typeof kudos)[0]) => {
    setEditingKudosId(kudosItem.id);
    setEditMessage(kudosItem.message);
    setEditValueId(kudosItem.value_id);
  };

  const handleSaveEdit = (kudosId: string) => {
    if (editMessage.trim().length < rules.min_length) return;
    editKudos(kudosId, editMessage.trim(), editValueId);
    setEditingKudosId(null);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50/70 p-4 sm:p-6 text-gray-900">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Top App Home Banner */}
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-linear-to-br from-brand-accent to-brand-secondary text-white flex items-center justify-center font-heading font-black text-2xl shadow-sm">
              K
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Kudos App Home</h1>
              {/* Mandatory Personal Summary Line: Strictly NO rank, NO comparison */}
              <p className="text-sm font-medium text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 rounded-md mt-1 inline-block">
                This month you gave <strong className="font-bold">{gaveThisMonth}</strong> and received{' '}
                <strong className="font-bold">{receivedThisMonth}</strong> kudos.
              </p>
            </div>
          </div>

          {/* Primary Action Button */}
          <button
            onClick={() => openComposer({ source: 'app_home' })}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#007A5A] hover:bg-[#006C4F] text-white font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-200" />
            <span>Give Kudos</span>
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-gray-200 bg-white rounded-t-xl px-2">
          <button
            onClick={() => setActiveTab('received')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'received'
                ? 'border-[#1264A3] text-[#1264A3]'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <Inbox className="w-4 h-4" />
            <span>Kudos Received ({userReceivedKudos.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('sent')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'sent'
                ? 'border-[#1264A3] text-[#1264A3]'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>Kudos Sent ({userSentKudos.length})</span>
          </button>
        </div>

        {/* Kudos List */}
        <div className="space-y-3">
          {displayedList.length === 0 ? (
            <div className="bg-white p-8 text-center rounded-xl border border-gray-200 text-gray-500 text-sm">
              <p>No kudos in this view yet.</p>
              <button
                onClick={() => openComposer({ source: 'app_home' })}
                className="mt-3 text-xs text-[#1264A3] font-semibold hover:underline"
              >
                Be the first to appreciate a teammate today →
              </button>
            </div>
          ) : (
            displayedList.map(item => {
              const giver = users.find(u => u.id === item.giver_id);
              const recipients = item.recipient_ids
                .map(rId => users.find(u => u.id === rId)?.name || 'Someone')
                .join(', ');
              const val = values.find(v => v.id === item.value_id);
              const isGiver = item.giver_id === currentUser.id;

              // Check 15-minute window for edit/delete guardrail
              const createdDate = new Date(item.created_at);
              const elapsedMinutes = (Date.now() - createdDate.getTime()) / (1000 * 60);
              const canEditOrDelete = isGiver && elapsedMinutes <= rules.edit_window_minutes;
              const remainingMinutes = Math.max(0, Math.ceil(rules.edit_window_minutes - elapsedMinutes));

              const isEditing = editingKudosId === item.id;

              return (
                <div
                  key={item.id}
                  className="bg-white p-4 sm:p-5 rounded-xl border border-gray-200 shadow-xs space-y-3 transition-all hover:border-gray-300"
                >
                  {/* Card Header */}
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <img
                        src={giver?.avatar}
                        alt={giver?.name}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <span className="font-semibold text-gray-900">
                        {giver?.name}
                      </span>
                      <span className="text-gray-400">→</span>
                      <span className="font-semibold text-gray-900">
                        {recipients}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-400">
                      {item.visibility === 'private' ? (
                        <span className="flex items-center gap-1 text-[11px] text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                          <Lock className="w-3 h-3 text-emerald-600" /> Private
                        </span>
                      ) : item.visibility === 'company' ? (
                        <button
                          onClick={() => setSelectedSlackChannel('c-kudos')}
                          className="flex items-center gap-1 text-[11px] text-[#1264A3] hover:underline"
                        >
                          <Building className="w-3 h-3 text-amber-600" /> #kudos
                        </button>
                      ) : (
                        <button
                          onClick={() => setSelectedSlackChannel(item.channel_id || 'c-engineering')}
                          className="flex items-center gap-1 text-[11px] text-[#1264A3] hover:underline"
                        >
                          <Hash className="w-3 h-3 text-[#1264A3]" /> team
                        </button>
                      )}
                      <span>•</span>
                      <span>{new Date(item.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Message Body or Edit Field */}
                  {isEditing ? (
                    <div className="space-y-2 pt-1">
                      <textarea
                        value={editMessage}
                        onChange={e => setEditMessage(e.target.value)}
                        rows={3}
                        className="w-full p-2 text-xs border border-gray-300 rounded-lg focus:outline-hidden focus:border-[#1264A3]"
                      />
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500 font-mono">
                          {editMessage.length} / {rules.min_length} min chars
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setEditingKudosId(null)}
                            className="px-2.5 py-1 text-gray-600 hover:text-gray-900 bg-gray-100 rounded"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSaveEdit(item.id)}
                            disabled={editMessage.length < rules.min_length}
                            className="px-3 py-1 bg-[#007A5A] text-white rounded font-medium disabled:opacity-40"
                          >
                            Save Edit
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <blockquote className="text-xs text-gray-800 leading-relaxed pl-3 border-l-2 border-brand-accent/50 bg-brand-bg/40 py-1 rounded-r">
                      &ldquo;{item.message}&rdquo;
                      {item.edited_at && (
                        <span className="text-[10px] text-gray-400 italic ml-1.5">(edited)</span>
                      )}
                    </blockquote>
                  )}

                  {/* Card Footer: Value Tag & Guardrail Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-gray-100">
                    <div>
                      {val && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-amber-50 text-amber-900 border border-amber-200">
                          <span>{val.icon}</span>
                          <span>{val.name}</span>
                        </span>
                      )}
                    </div>

                    {/* 15-Minute Edit/Delete Guardrail Controls */}
                    {canEditOrDelete && !isEditing && (
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded flex items-center gap-1 font-mono">
                          <Clock className="w-3 h-3" /> {remainingMinutes}m left to edit
                        </span>
                        <button
                          onClick={() => handleStartEdit(item)}
                          className="p-1 text-gray-500 hover:text-[#1264A3] transition-colors"
                          title="Edit message"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteKudos(item.id)}
                          className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                          title="Delete kudos"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
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
