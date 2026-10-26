'use client';

import React, { useState } from 'react';
import { useKudos } from '../context/KudosContext';
import { UserRole } from '../types';
import {
  MessageSquare,
  Globe,
  RotateCcw,
  Sparkles,
  UserCheck,
  ChevronDown,
  PlayCircle,
  ShieldCheck,
  Briefcase,
  User as UserIcon,
} from 'lucide-react';

interface HeaderProps {
  onOpenDemoScript: () => void;
}

export default function Header({ onOpenDemoScript }: HeaderProps) {
  const {
    activeApp,
    setActiveApp,
    currentRole,
    setCurrentRole,
    currentUser,
    setCurrentUserById,
    users,
    resetDemoData,
  } = useKudos();

  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  // Group key demo users
  const demoUsers = [
    { id: 'usr-linh', name: 'Linh Nguyen', role: 'Employee', title: 'Senior Frontend Dev (Office A)' },
    { id: 'usr-minh', name: 'Minh Tran', role: 'Employee', title: 'Backend Engineer (Report of Huy)' },
    { id: 'usr-huy', name: 'Huy Dang', role: 'Manager', title: 'Engineering Manager (Office A)' },
    { id: 'usr-an', name: 'An Vo', role: 'Employee', title: 'Product Designer (Office B - Da Nang)' },
    { id: 'usr-trang', name: 'Trang Pham', role: 'Manager', title: 'Head of Design (Office B)' },
    { id: 'usr-sarah', name: 'Sarah Jenkins', role: 'Talent Admin', title: 'VP People & Culture (Office A)' },
    { id: 'usr-tina', name: 'Tina Le', role: 'Talent Admin', title: 'Talent Ops Specialist (Office C - Hanoi)' },
  ];

  return (
    <header className="bg-brand-card border-b border-brand-border sticky top-0 z-40 px-4 py-2.5 shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-accent text-white font-heading font-extrabold flex items-center justify-center text-lg shadow-sm">
              K
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-bold text-base text-brand-text tracking-tight">CodeLink Kudos</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-brand-highlight text-brand-accent border border-brand-border">
                  V1 Prototype
                </span>
              </div>
              <p className="text-[11px] text-brand-muted hidden sm:block">
                Under 30s peer recognition • Celebrating the giver & manager loop
              </p>
            </div>
          </div>
        </div>

        {/* Center: App Switcher */}
        <div className="flex items-center bg-brand-bg p-1 rounded-xl border border-brand-border shadow-inner">
          <button
            onClick={() => setActiveApp('slack')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeApp === 'slack'
                ? 'bg-[#3F0E40] text-white shadow-sm'
                : 'text-brand-text hover:text-brand-accent'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Slack Simulator</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          </button>
          <button
            onClick={() => setActiveApp('web')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeApp === 'web'
                ? 'bg-brand-accent text-white shadow-sm'
                : 'text-brand-text hover:text-brand-accent'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Kudos Web App</span>
            <span className="text-[10px] px-1 py-0.2 rounded bg-black/20 text-white/90">Wall & Admin</span>
          </button>
        </div>

        {/* Right side: Role Switcher & Persona controls */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Viewing as Role Switcher */}
          <div className="flex items-center gap-1.5 bg-brand-bg px-2 py-1 rounded-lg border border-brand-border text-xs">
            <span className="text-brand-muted font-medium text-[11px] hidden md:inline">Viewing as:</span>
            <div className="flex items-center gap-1">
              {(['employee', 'manager', 'admin'] as UserRole[]).map((role) => (
                <button
                  key={role}
                  onClick={() => setCurrentRole(role)}
                  className={`px-2 py-1 rounded capitalize font-medium text-xs transition-colors ${
                    currentRole === role
                      ? 'bg-brand-text text-white shadow-xs font-semibold'
                      : 'text-brand-muted hover:text-brand-text'
                  }`}
                >
                  {role === 'admin' ? 'Talent Admin' : role}
                </button>
              ))}
            </div>
          </div>

          {/* Quick User Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
              className="flex items-center gap-2 px-2.5 py-1 rounded-lg border border-brand-border bg-white hover:border-brand-accent/50 text-xs transition-all shadow-xs"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-5 h-5 rounded-full object-cover"
              />
              <span className="font-semibold text-brand-text max-w-[100px] truncate">{currentUser.name}</span>
              <ChevronDown className="w-3 h-3 text-brand-muted" />
            </button>

            {isUserDropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-64 bg-white rounded-xl shadow-xl border border-brand-border py-1.5 z-50 animate-fade-in text-xs">
                <div className="px-3 py-1.5 border-b border-brand-border/60">
                  <p className="font-semibold text-brand-text text-xs">Switch Active Persona</p>
                  <p className="text-[10px] text-brand-muted">Experience Kudos from different viewpoints</p>
                </div>
                <div className="max-h-64 overflow-y-auto py-1">
                  {demoUsers.map(u => (
                    <button
                      key={u.id}
                      onClick={() => {
                        setCurrentUserById(u.id);
                        setIsUserDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-brand-bg transition-colors ${
                        currentUser.id === u.id ? 'bg-brand-highlight/60 font-semibold' : ''
                      }`}
                    >
                      <div>
                        <div className="text-brand-text font-medium">{u.name}</div>
                        <div className="text-[10px] text-brand-muted">{u.title}</div>
                      </div>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-700 uppercase font-mono">
                        {u.role}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Demo Script Guide Button */}
          <button
            onClick={onOpenDemoScript}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-secondary text-white text-xs font-semibold hover:bg-opacity-95 shadow-sm transition-all"
            title="Open 3-Minute Demo Script"
          >
            <PlayCircle className="w-3.5 h-3.5 text-amber-200" />
            <span className="hidden sm:inline">3-Min Demo Script</span>
          </button>

          {/* Reset Demo Data Button */}
          <button
            onClick={resetDemoData}
            className="p-1.5 rounded-lg border border-brand-border text-brand-muted hover:text-brand-text hover:bg-brand-bg transition-all"
            title="Reset dataset (~120 staff, ~400 kudos)"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
