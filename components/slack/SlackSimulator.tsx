'use client';

import React, { useState } from 'react';
import { useKudos } from '../../context/KudosContext';
import SlackSidebar from './SlackSidebar';
import AppHome from './AppHome';
import KudosModal from './KudosModal';
import SlackThreadView from './SlackThreadView';
import {
  Hash,
  Lock,
  Sparkles,
  Smile,
  Send,
  MoreHorizontal,
  MessageSquare,
  Flame,
  ThumbsUp,
  Heart,
  Bot,
  Clock,
  Edit2,
  Trash2,
  Building,
  Users,
} from 'lucide-react';

export default function SlackSimulator() {
  const {
    selectedSlackChannel,
    slackMessages,
    users,
    kudos,
    values,
    currentUser,
    rules,
    openComposer,
    addReaction,
    addChannelMessage,
    deleteKudos,
    selectedSlackThreadId,
    setSelectedSlackThreadId,
  } = useKudos();

  const [composerInput, setComposerInput] = useState('');
  const [activeMenuMsgId, setActiveMenuMsgId] = useState<string | null>(null);

  // Check if viewing App Home
  const isAppHome = selectedSlackChannel === 'apps-kudos';

  // Filter messages for current channel or DM
  const currentMessages = slackMessages.filter(m => {
    if (selectedSlackChannel.startsWith('dm-')) {
      return m.channel_id === selectedSlackChannel || m.target_user_id === currentUser.id;
    }
    return m.channel_id === selectedSlackChannel;
  });

  const getChannelTitle = () => {
    if (selectedSlackChannel === 'c-kudos') return '#kudos';
    if (selectedSlackChannel === 'c-general') return '#general';
    if (selectedSlackChannel === 'c-design') return '#team-design';
    if (selectedSlackChannel === 'c-engineering') return '#team-engineering';
    if (selectedSlackChannel.startsWith('dm-')) {
      const uId = selectedSlackChannel.replace('dm-', '');
      const u = users.find(user => user.id === uId);
      return u ? `@${u.name}` : 'Direct Message';
    }
    return 'Channel';
  };

  const getChannelSubtitle = () => {
    if (selectedSlackChannel === 'c-kudos') return 'Company-wide celebration stream • Type /kudos or click the shortcut on any message!';
    if (selectedSlackChannel === 'c-engineering') return 'Fintech & Engineering Core squad discussion';
    if (selectedSlackChannel === 'c-design') return 'Design systems & product UX collaboration';
    if (selectedSlackChannel === 'c-general') return 'General agency announcements & discussions';
    return 'Direct conversation';
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = composerInput.trim();
    if (!trimmed) return;

    // Trigger: typing /kudos in composer
    if (trimmed.toLowerCase() === '/kudos' || trimmed.toLowerCase().startsWith('/kudos ')) {
      openComposer({ source: 'slash' });
      setComposerInput('');
      return;
    }

    addChannelMessage(selectedSlackChannel, trimmed);
    setComposerInput('');
  };

  const handleMessageShortcut = (msg: (typeof slackMessages)[0]) => {
    const author = users.find(u => u.id === msg.author_id);
    openComposer({
      recipients: author && author.id !== currentUser.id ? [author.id] : [],
      sourceMessageId: msg.id,
      sourceMessagePreview: msg.content.substring(0, 100),
      source: 'shortcut',
    });
    setActiveMenuMsgId(null);
  };

  return (
    <div className="flex-1 flex overflow-hidden bg-white relative">
      {/* Slack Sidebar */}
      <SlackSidebar />

      {/* Main Slack Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-white">
        {/* Channel Header */}
        <div className="h-13 px-4 border-b border-gray-200 flex items-center justify-between shrink-0 bg-white">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-gray-900">{getChannelTitle()}</span>
              {selectedSlackChannel === 'c-kudos' && (
                <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
                  All Offices
                </span>
              )}
            </div>
            <p className="text-[11px] text-gray-500 truncate max-w-lg">{getChannelSubtitle()}</p>
          </div>

          <button
            onClick={() => openComposer({ source: 'slash' })}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#007A5A] hover:bg-[#006C4F] text-white font-semibold text-xs shadow-xs transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            <span>/kudos</span>
          </button>
        </div>

        {/* View Content: Either App Home or Channel Message Feed */}
        {isAppHome ? (
          <AppHome />
        ) : (
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {currentMessages.length === 0 ? (
              <div className="text-center py-12 text-gray-400 text-xs">
                No messages in this conversation yet. Send a message or give kudos to start!
              </div>
            ) : (
              currentMessages.map(msg => {
                const isKudosPost = !!msg.kudos_id;
                const targetKudos = isKudosPost ? kudos.find(k => k.id === msg.kudos_id) : null;
                const author = users.find(u => u.id === msg.author_id) || {
                  name: msg.author_id === 'bot-kudos' ? 'Kudos Bot' : 'Teammate',
                  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
                  office_id: 'off-a',
                  team_id: 'team-fintech',
                };

                const isAuthorGiver = targetKudos && targetKudos.giver_id === currentUser.id;
                const elapsedMinutes = targetKudos
                  ? (Date.now() - new Date(targetKudos.created_at).getTime()) / (1000 * 60)
                  : 999;
                const canEditDelete = isAuthorGiver && elapsedMinutes <= rules.edit_window_minutes;

                return (
                  <div
                    key={msg.id}
                    className={`group relative flex items-start gap-3 p-2.5 rounded-lg transition-colors hover:bg-gray-50/80 ${
                      isKudosPost ? 'border-l-4 border-brand-accent bg-brand-highlight/20' : ''
                    }`}
                  >
                    {/* Author Avatar */}
                    {msg.author_id === 'bot-kudos' ? (
                      <div className="w-9 h-9 rounded-lg bg-linear-to-br from-brand-accent to-brand-secondary text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                        🎉
                      </div>
                    ) : (
                      <img
                        src={author.avatar}
                        alt={author.name}
                        className="w-9 h-9 rounded-lg object-cover shrink-0"
                      />
                    )}

                    {/* Message Body */}
                    <div className="flex-1 space-y-1 overflow-hidden">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-gray-900">{author.name}</span>
                        {msg.author_id === 'bot-kudos' && (
                          <span className="text-[10px] bg-gray-200 text-gray-700 px-1.5 py-0.2 rounded font-semibold">
                            APP
                          </span>
                        )}
                        <span className="text-[10px] text-gray-400">
                          {new Date(msg.created_at).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="text-xs text-gray-800 leading-relaxed whitespace-pre-wrap">
                        {msg.content}
                      </div>

                      {/* Kudos Rich Metadata (Value tags, office/team badges, "Give kudos too" button) */}
                      {targetKudos && (
                        <div className="pt-2 space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            {targetKudos.value_id && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-900 border border-amber-200">
                                <span>
                                  {values.find(v => v.id === targetKudos.value_id)?.icon}
                                </span>
                                <span>
                                  {values.find(v => v.id === targetKudos.value_id)?.name}
                                </span>
                              </span>
                            )}

                            <span className="text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
                              {targetKudos.visibility.toUpperCase()}
                            </span>

                            <button
                              onClick={() =>
                                openComposer({
                                  recipients: targetKudos.recipient_ids,
                                  source: 'shortcut',
                                })
                              }
                              className="text-[11px] font-semibold text-[#1264A3] hover:underline flex items-center gap-1"
                            >
                              <span>Give kudos too →</span>
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Interactive Emoji Reactions Bar */}
                      <div className="pt-1.5 flex flex-wrap items-center gap-1.5">
                        {Object.entries(msg.reactions || {}).map(([emoji, userIds]) => (
                          <button
                            key={emoji}
                            onClick={() => targetKudos && addReaction(targetKudos.id, emoji)}
                            className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border transition-colors ${
                              userIds.includes(currentUser.id)
                                ? 'bg-blue-50 border-blue-300 text-blue-900 font-bold'
                                : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            <span>{emoji}</span>
                            <span className="text-[10px]">{userIds.length}</span>
                          </button>
                        ))}

                        {/* Quick reaction adder */}
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {['👏', '🔥', '❤️', '🙌'].map(emoji => (
                            <button
                              key={emoji}
                              onClick={() => targetKudos && addReaction(targetKudos.id, emoji)}
                              className="p-1 hover:bg-gray-200 rounded text-xs"
                              title={`React with ${emoji}`}
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>

                        {/* Thread Replies Button */}
                        {msg.replies && msg.replies.length > 0 && (
                          <button
                            onClick={() => setSelectedSlackThreadId(msg.id)}
                            className="text-xs text-[#1264A3] font-semibold hover:underline flex items-center gap-1 ml-1"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>{msg.replies.length} replies</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Floating Hover Action Menu */}
                    <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white border border-gray-200 rounded-lg shadow-sm flex items-center divide-x divide-gray-100 z-10">
                      <button
                        onClick={() => setSelectedSlackThreadId(msg.id)}
                        className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                        title="Reply in thread"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleMessageShortcut(msg)}
                        className="px-2 py-1.5 text-xs font-semibold text-brand-accent hover:bg-amber-50 flex items-center gap-1"
                        title="Give kudos for this message"
                      >
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        <span className="text-[11px]">Give kudos</span>
                      </button>

                      {/* Three dot dropdown */}
                      <div className="relative">
                        <button
                          onClick={() =>
                            setActiveMenuMsgId(activeMenuMsgId === msg.id ? null : msg.id)
                          }
                          className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                        >
                          <MoreHorizontal className="w-3.5 h-3.5" />
                        </button>

                        {activeMenuMsgId === msg.id && (
                          <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-30 text-xs">
                            <button
                              onClick={() => handleMessageShortcut(msg)}
                              className="w-full text-left px-3 py-1.5 hover:bg-gray-50 flex items-center gap-2 text-gray-700"
                            >
                              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                              <span>Give kudos</span>
                            </button>

                            {canEditDelete && targetKudos && (
                              <>
                                <div className="border-t border-gray-100 my-1" />
                                <div className="px-3 py-1 text-[10px] text-amber-700 bg-amber-50 font-mono">
                                  {Math.max(0, Math.ceil(rules.edit_window_minutes - elapsedMinutes))}m left to edit
                                </div>
                                <button
                                  onClick={() => {
                                    deleteKudos(targetKudos.id);
                                    setActiveMenuMsgId(null);
                                  }}
                                  className="w-full text-left px-3 py-1.5 hover:bg-red-50 text-red-600 flex items-center gap-2"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>Delete kudos</span>
                                </button>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Bottom Slack Composer */}
        {!isAppHome && (
          <div className="p-4 border-t border-gray-200 bg-white">
            <form
              onSubmit={handleSendMessage}
              className="border border-gray-300 rounded-xl focus-within:border-[#1264A3] focus-within:ring-1 focus-within:ring-[#1264A3] bg-white transition-all shadow-xs"
            >
              <input
                type="text"
                value={composerInput}
                onChange={e => setComposerInput(e.target.value)}
                placeholder={`Message ${getChannelTitle()} or type /kudos...`}
                className="w-full px-4 py-3 text-xs outline-hidden text-gray-900 bg-transparent placeholder-gray-400"
              />
              <div className="px-3 py-2 border-t border-gray-100 flex items-center justify-between bg-gray-50/50 rounded-b-xl">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openComposer({ source: 'slash' })}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-amber-50 text-amber-900 border border-amber-200 text-xs font-semibold hover:bg-amber-100 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>/kudos</span>
                  </button>
                  <span className="text-[11px] text-gray-400 hidden sm:inline">
                    Tip: Type <code className="bg-gray-100 px-1 py-0.5 rounded font-mono">/kudos</code> and press Enter
                  </span>
                </div>
                <button
                  type="submit"
                  disabled={!composerInput.trim()}
                  className="p-1.5 rounded-lg bg-[#007A5A] text-white disabled:opacity-30 hover:bg-[#006C4F] transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Right Drawer: Thread View */}
      {selectedSlackThreadId && (
        <SlackThreadView
          messageId={selectedSlackThreadId}
          onClose={() => setSelectedSlackThreadId(null)}
        />
      )}

      {/* Block Kit Kudos Modal */}
      <KudosModal />
    </div>
  );
}
