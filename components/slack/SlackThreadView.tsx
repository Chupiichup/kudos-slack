'use client';

import React, { useState } from 'react';
import { useKudos } from '../../context/KudosContext';
import { X, Send, Smile, Sparkles } from 'lucide-react';

interface SlackThreadViewProps {
  messageId: string;
  onClose: () => void;
}

export default function SlackThreadView({ messageId, onClose }: SlackThreadViewProps) {
  const {
    slackMessages,
    users,
    currentUser,
    addChannelMessageReply,
    addReply,
    addReaction,
  } = useKudos();

  const [replyText, setReplyText] = useState('');

  const targetMessage = slackMessages.find(m => m.id === messageId);
  if (!targetMessage) return null;

  const author = users.find(u => u.id === targetMessage.author_id) || {
    name: targetMessage.author_id === 'bot-kudos' ? 'Kudos Bot' : 'Teammate',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    addChannelMessageReply(messageId, replyText.trim());
    if (targetMessage.kudos_id) {
      addReply(targetMessage.kudos_id, replyText.trim());
    }
    setReplyText('');
  };

  return (
    <div className="w-80 sm:w-96 border-l border-gray-200 bg-white flex flex-col shrink-0 h-full shadow-lg z-20">
      {/* Thread Header */}
      <div className="h-13 px-4 border-b border-gray-200 flex items-center justify-between bg-gray-50/50">
        <div className="font-bold text-sm text-gray-900">Thread</div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-700 p-1.5 rounded-lg hover:bg-gray-100"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Main Original Message */}
      <div className="p-4 border-b border-gray-100 space-y-2 bg-gray-50/30">
        <div className="flex items-center gap-2.5">
          <img
            src={author.avatar}
            alt={author.name}
            className="w-8 h-8 rounded-md object-cover"
          />
          <div>
            <div className="font-bold text-xs text-gray-900">{author.name}</div>
            <div className="text-[10px] text-gray-400">
              {new Date(targetMessage.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>
        <div className="text-xs text-gray-800 whitespace-pre-wrap leading-relaxed">
          {targetMessage.content}
        </div>
      </div>

      {/* Replies Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 divide-y divide-gray-50">
        {targetMessage.replies && targetMessage.replies.length > 0 ? (
          targetMessage.replies.map(rep => {
            const replyAuthor = users.find(u => u.id === rep.author_id);
            return (
              <div key={rep.id} className="pt-2 flex items-start gap-2.5">
                <img
                  src={replyAuthor?.avatar}
                  alt={replyAuthor?.name}
                  className="w-6 h-6 rounded-md object-cover mt-0.5"
                />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-gray-900">{replyAuthor?.name}</span>
                    <span className="text-[10px] text-gray-400">
                      {new Date(rep.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs text-gray-800 leading-relaxed">{rep.content}</p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8 text-xs text-gray-400">
            No thread replies yet. Start the conversation!
          </div>
        )}
      </div>

      {/* Reply Input Form */}
      <form onSubmit={handleSendReply} className="p-3 border-t border-gray-200 bg-white">
        <div className="border border-gray-300 rounded-lg p-2 focus-within:border-[#1264A3]">
          <textarea
            rows={2}
            value={replyText}
            onChange={e => setReplyText(e.target.value)}
            placeholder="Reply in thread..."
            className="w-full text-xs outline-hidden resize-none"
          />
          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              className="text-gray-400 hover:text-gray-600"
              title="Add emoji"
            >
              <Smile className="w-4 h-4" />
            </button>
            <button
              type="submit"
              disabled={!replyText.trim()}
              className="px-3 py-1 bg-[#007A5A] text-white text-xs font-semibold rounded disabled:opacity-40"
            >
              Reply
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
