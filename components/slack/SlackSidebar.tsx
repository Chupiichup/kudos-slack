'use client';

import React from 'react';
import { useKudos } from '../../context/KudosContext';
import {
  Hash,
  Lock,
  MessageSquare,
  Sparkles,
  ChevronDown,
  Circle,
  Plus,
  Bot,
} from 'lucide-react';

export default function SlackSidebar() {
  const {
    selectedSlackChannel,
    setSelectedSlackChannel,
    currentUser,
    users,
    openComposer,
  } = useKudos();

  const channels = [
    { id: 'c-kudos', name: 'kudos', isPublic: true, badge: 'all' },
    { id: 'c-general', name: 'general', isPublic: true },
    { id: 'c-design', name: 'team-design', isPublic: false },
    { id: 'c-engineering', name: 'team-engineering', isPublic: false },
  ];

  // Key direct message contacts
  const directMessages = [
    { id: `dm-${currentUser.id}`, name: 'Kudos Bot', isBot: true, sub: 'App' },
    { id: 'dm-usr-minh', name: 'Minh Tran', isOnline: true },
    { id: 'dm-usr-huy', name: 'Huy Dang (Mgr)', isOnline: true },
    { id: 'dm-usr-an', name: 'An Vo', isOnline: false },
  ];

  return (
    <aside className="w-64 bg-[#3F0E40] text-[#BCABB8] flex flex-col shrink-0 select-none border-r border-[#522653] font-sans">
      {/* Workspace Header */}
      <div className="h-13 px-4 flex items-center justify-between border-b border-[#522653] hover:bg-[#350d36] transition-colors cursor-pointer">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-brand-accent text-white flex items-center justify-center font-bold text-xs">
            C
          </div>
          <span className="font-bold text-white text-sm tracking-tight">CodeLink</span>
          <ChevronDown className="w-3.5 h-3.5 text-[#BCABB8]" />
        </div>
        <button
          onClick={() => openComposer({ source: 'slash' })}
          className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          title="Compose Kudos"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
        </button>
      </div>

      {/* Navigation Tree */}
      <div className="flex-1 overflow-y-auto py-3 space-y-4 text-xs">
        {/* Apps Section (Top priority) */}
        <div className="px-2">
          <div className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-[#BCABB8]/70 flex items-center justify-between">
            <span>Apps</span>
          </div>
          <button
            onClick={() => setSelectedSlackChannel('apps-kudos')}
            className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md font-medium transition-colors ${
              selectedSlackChannel === 'apps-kudos'
                ? 'bg-[#1164A3] text-white font-semibold'
                : 'text-[#BCABB8] hover:bg-[#350d36] hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Kudos App Home</span>
          </button>
        </div>

        {/* Channels Section */}
        <div className="px-2">
          <div className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-[#BCABB8]/70 flex items-center justify-between">
            <span>Channels</span>
            <Plus className="w-3.5 h-3.5 cursor-pointer hover:text-white" />
          </div>
          <div className="space-y-0.5 mt-0.5">
            {channels.map(ch => {
              const isSelected = selectedSlackChannel === ch.id;
              return (
                <button
                  key={ch.id}
                  onClick={() => setSelectedSlackChannel(ch.id)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md font-medium transition-colors ${
                    isSelected
                      ? 'bg-[#1164A3] text-white font-semibold'
                      : 'text-[#BCABB8] hover:bg-[#350d36] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    {ch.isPublic ? (
                      <Hash className="w-3.5 h-3.5 shrink-0 opacity-70" />
                    ) : (
                      <Lock className="w-3.5 h-3.5 shrink-0 opacity-70" />
                    )}
                    <span className="truncate">{ch.name}</span>
                  </div>
                  {ch.badge && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-brand-accent text-white font-bold">
                      {ch.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Direct Messages Section */}
        <div className="px-2">
          <div className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-[#BCABB8]/70 flex items-center justify-between">
            <span>Direct Messages</span>
            <Plus className="w-3.5 h-3.5 cursor-pointer hover:text-white" />
          </div>
          <div className="space-y-0.5 mt-0.5">
            {directMessages.map(dm => {
              const isSelected = selectedSlackChannel === dm.id;
              return (
                <button
                  key={dm.id}
                  onClick={() => setSelectedSlackChannel(dm.id)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md font-medium transition-colors ${
                    isSelected
                      ? 'bg-[#1164A3] text-white font-semibold'
                      : 'text-[#BCABB8] hover:bg-[#350d36] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    {dm.isBot ? (
                      <div className="w-4 h-4 rounded bg-amber-500 text-white flex items-center justify-center shrink-0">
                        <Bot className="w-2.5 h-2.5" />
                      </div>
                    ) : (
                      <div className="relative">
                        <Circle
                          className={`w-2 h-2 ${
                            dm.isOnline
                              ? 'text-emerald-400 fill-emerald-400'
                              : 'text-gray-400 fill-none'
                          }`}
                        />
                      </div>
                    )}
                    <span className="truncate">{dm.name}</span>
                  </div>
                  {dm.sub && (
                    <span className="text-[9px] px-1 rounded bg-white/20 text-white/90">
                      {dm.sub}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* User profile footer */}
      <div className="p-3 border-t border-[#522653] flex items-center gap-2.5 hover:bg-[#350d36] transition-colors cursor-pointer">
        <div className="relative">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-8 h-8 rounded-md object-cover"
          />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#3F0E40] absolute -bottom-0.5 -right-0.5" />
        </div>
        <div className="truncate text-left">
          <div className="text-white text-xs font-bold truncate">{currentUser.name}</div>
          <div className="text-[11px] text-[#BCABB8] truncate">Online</div>
        </div>
      </div>
    </aside>
  );
}
