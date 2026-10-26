'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import confetti from 'canvas-confetti';
import {
  User,
  Office,
  Team,
  CompanyValue,
  Kudos,
  ComposerEvent,
  SlackMessage,
  SystemRule,
  UserRole,
} from '../types';
import {
  INITIAL_OFFICES,
  INITIAL_TEAMS,
  INITIAL_VALUES,
  generateSeedUsers,
  generateSeedKudos,
  generateInitialSlackMessages,
} from '../lib/seedData';

const LOCAL_STORAGE_KEY = 'codelink_kudos_v1_store';

interface ToastState {
  id: string;
  type: 'success' | 'info' | 'error';
  message: string;
  durationMs?: number;
}

interface ComposerInitialData {
  recipients?: string[];
  sourceMessageId?: string;
  sourceMessagePreview?: string;
  source?: 'slash' | 'shortcut' | 'app_home';
}

interface KudosContextType {
  // Data
  users: User[];
  offices: Office[];
  teams: Team[];
  values: CompanyValue[];
  kudos: Kudos[];
  slackMessages: SlackMessage[];
  composerEvents: ComposerEvent[];
  rules: SystemRule;

  // Active state
  currentUser: User;
  currentRole: UserRole;
  activeApp: 'slack' | 'web';
  selectedSlackChannel: string;
  selectedSlackThreadId: string | null;
  toasts: ToastState[];

  // Composer state
  isComposerOpen: boolean;
  composerOpenedAt: number | null;
  composerInitialData: ComposerInitialData | null;

  // Actions
  setActiveApp: (app: 'slack' | 'web') => void;
  setCurrentUserById: (userId: string) => void;
  setCurrentRole: (role: UserRole) => void;
  setSelectedSlackChannel: (channelId: string) => void;
  setSelectedSlackThreadId: (msgId: string | null) => void;
  openComposer: (initialData?: ComposerInitialData) => void;
  closeComposer: () => void;
  sendKudos: (params: {
    recipient_ids: string[];
    message: string;
    value_id?: string;
    visibility: 'team' | 'company' | 'private';
    channel_id?: string;
  }) => Promise<{ durationMs: number; kudosId: string }>;
  editKudos: (kudosId: string, newMessage: string, newValueId?: string) => void;
  deleteKudos: (kudosId: string) => void;
  addReaction: (kudosId: string, emoji: string) => void;
  addReply: (kudosId: string, message: string) => void;
  addChannelMessage: (channelId: string, content: string) => void;
  addChannelMessageReply: (messageId: string, content: string) => void;
  resetDemoData: () => void;
  dismissToast: (id: string) => void;
  addToast: (toast: Omit<ToastState, 'id'>) => void;

  // Computed metrics
  metrics: {
    weeklyActiveGiversPct: number;
    reach30dPct: number;
    recipientCoverage30dPct: number;
    managerParticipationPct: number;
    crossTeamSharePct: number;
    valueTagSharePct: number;
    medianTimeToSendSeconds: number;
    completionRatePct: number;
    weeklyTrend: { week: string; pct: number }[];
    unrecognisedUsers30d: User[];
    officeBreakdown: { office: string; kudosGiven: number; kudosReceived: number; reachPct: number }[];
    teamBreakdown: { team: string; kudosGiven: number; kudosReceived: number }[];
    ritualSuggestions: {
      crossOffice: Kudos[];
      firstTime: Kudos[];
      valueChampions: Kudos[];
    };
  };
}

const KudosContext = createContext<KudosContextType | undefined>(undefined);

export function KudosProvider({ children }: { children: ReactNode }) {
  // Initialize state
  const [users, setUsers] = useState<User[]>([]);
  const [offices, setOffices] = useState<Office[]>(INITIAL_OFFICES);
  const [teams, setTeams] = useState<Team[]>(INITIAL_TEAMS);
  const [values, setValues] = useState<CompanyValue[]>(INITIAL_VALUES);
  const [kudos, setKudos] = useState<Kudos[]>([]);
  const [slackMessages, setSlackMessages] = useState<SlackMessage[]>([]);
  const [composerEvents, setComposerEvents] = useState<ComposerEvent[]>([]);
  const [rules, setRules] = useState<SystemRule>({
    min_length: 30,
    edit_window_minutes: 15,
    default_visibility: 'team',
  });

  const [currentUserId, setCurrentUserId] = useState<string>('usr-linh');
  const [currentRole, setCurrentRole] = useState<UserRole>('employee');
  const [activeApp, setActiveApp] = useState<'slack' | 'web'>('slack');
  const [selectedSlackChannel, setSelectedSlackChannel] = useState<string>('c-kudos');
  const [selectedSlackThreadId, setSelectedSlackThreadId] = useState<string | null>(null);

  // Composer
  const [isComposerOpen, setIsComposerOpen] = useState<boolean>(false);
  const [composerOpenedAt, setComposerOpenedAt] = useState<number | null>(null);
  const [composerInitialData, setComposerInitialData] = useState<ComposerInitialData | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<ToastState[]>([]);

  // Load from localStorage or initialize with seed data
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.users && parsed.kudos && parsed.kudos.length > 50) {
          setUsers(parsed.users);
          setOffices(parsed.offices || INITIAL_OFFICES);
          setTeams(parsed.teams || INITIAL_TEAMS);
          setValues(parsed.values || INITIAL_VALUES);
          setKudos(parsed.kudos);
          setSlackMessages(parsed.slackMessages || []);
          setComposerEvents(parsed.composerEvents || []);
          setRules(parsed.rules || { min_length: 30, edit_window_minutes: 15, default_visibility: 'team' });
          if (parsed.currentUserId) setCurrentUserId(parsed.currentUserId);
          return;
        }
      }
    } catch (e) {
      console.warn('Could not read from localStorage, regenerating seed data', e);
    }

    // Generate fresh seed data
    const seedUsers = generateSeedUsers();
    const { kudos: seedKudos, composerEvents: seedEvents } = generateSeedKudos(seedUsers);
    const seedMessages = generateInitialSlackMessages(seedUsers, seedKudos);

    setUsers(seedUsers);
    setOffices(INITIAL_OFFICES);
    setTeams(INITIAL_TEAMS);
    setValues(INITIAL_VALUES);
    setKudos(seedKudos);
    setComposerEvents(seedEvents);
    setSlackMessages(seedMessages);
  }, []);

  // Save to localStorage whenever data changes (debounced)
  useEffect(() => {
    if (users.length === 0 || kudos.length === 0) return;
    try {
      const stateToSave = {
        users,
        offices,
        teams,
        values,
        kudos,
        slackMessages,
        composerEvents,
        rules,
        currentUserId,
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (e) {
      console.error('Error saving state to localStorage', e);
    }
  }, [users, offices, teams, values, kudos, slackMessages, composerEvents, rules, currentUserId]);

  const addToast = (toast: Omit<ToastState, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast = { ...toast, id };
    setToasts(prev => [...prev, newToast]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, toast.durationMs || 4000);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const currentUser = useMemo(() => {
    const found = users.find(u => u.id === currentUserId);
    if (found) return found;
    return users[0] || {
      id: 'usr-linh',
      name: 'Linh Nguyen',
      email: 'linh.nguyen@codelink.io',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      office_id: 'off-a',
      team_id: 'team-fintech',
      manager_id: 'usr-huy',
      role: 'employee',
      active: true,
      job_title: 'Senior Frontend Developer',
    };
  }, [users, currentUserId]);

  const setCurrentUserById = (userId: string) => {
    const target = users.find(u => u.id === userId);
    if (target) {
      setCurrentUserId(userId);
      setCurrentRole(target.role);
    }
  };

  // Switch role helper
  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);
    // Find representative user for this role
    if (role === 'employee') {
      const emp = users.find(u => u.id === 'usr-linh') || users.find(u => u.role === 'employee');
      if (emp) setCurrentUserId(emp.id);
    } else if (role === 'manager') {
      const mgr = users.find(u => u.id === 'usr-huy') || users.find(u => u.role === 'manager');
      if (mgr) setCurrentUserId(mgr.id);
    } else if (role === 'admin') {
      const adm = users.find(u => u.id === 'usr-sarah') || users.find(u => u.role === 'admin');
      if (adm) setCurrentUserId(adm.id);
    }
  };

  const openComposer = (initialData?: ComposerInitialData) => {
    setComposerInitialData(initialData || null);
    setComposerOpenedAt(Date.now());
    setIsComposerOpen(true);
  };

  const closeComposer = () => {
    if (composerOpenedAt) {
      // Record abandoned composer event
      const newEvent: ComposerEvent = {
        id: `ev-${Date.now()}`,
        user_id: currentUser.id,
        opened_at: new Date(composerOpenedAt).toISOString(),
        sent: false,
      };
      setComposerEvents(prev => [newEvent, ...prev]);
    }
    setIsComposerOpen(false);
    setComposerOpenedAt(null);
    setComposerInitialData(null);
  };

  const sendKudos = async (params: {
    recipient_ids: string[];
    message: string;
    value_id?: string;
    visibility: 'team' | 'company' | 'private';
    channel_id?: string;
  }): Promise<{ durationMs: number; kudosId: string }> => {
    const now = new Date();
    const durationMs = composerOpenedAt ? Date.now() - composerOpenedAt : 14000;
    const durationSec = Math.max(1, Math.round(durationMs / 1000));
    const kudosId = `kudos-${Date.now()}`;

    // Target channel for team visibility
    const targetChannel = params.visibility === 'company'
      ? 'c-kudos'
      : params.visibility === 'team'
      ? (params.channel_id || 'c-engineering')
      : undefined;

    // Check cross team / cross office
    const giverOffice = currentUser.office_id;
    const giverTeam = currentUser.team_id;
    let isCrossTeam = false;
    let isCrossOffice = false;

    params.recipient_ids.forEach(rId => {
      const rec = users.find(u => u.id === rId);
      if (rec) {
        if (rec.team_id !== giverTeam) isCrossTeam = true;
        if (rec.office_id !== giverOffice) isCrossOffice = true;
      }
    });

    const newKudos: Kudos = {
      id: kudosId,
      giver_id: currentUser.id,
      recipient_ids: params.recipient_ids,
      message: params.message,
      value_id: params.value_id,
      visibility: params.visibility,
      channel_id: targetChannel,
      source: composerInitialData?.source || 'slash',
      source_message_id: composerInitialData?.sourceMessageId,
      source_message_preview: composerInitialData?.sourceMessagePreview,
      compose_ms: durationMs,
      created_at: now.toISOString(),
      reactions: {},
      replies: [],
    };

    // 1. Save Kudos
    setKudos(prev => [newKudos, ...prev]);

    // 2. Save Composer Event
    const compEvent: ComposerEvent = {
      id: `ev-${Date.now()}`,
      user_id: currentUser.id,
      opened_at: new Date(composerOpenedAt || Date.now() - durationMs).toISOString(),
      sent: true,
      kudos_id: kudosId,
    };
    setComposerEvents(prev => [compEvent, ...prev]);

    // 3. Create Slack Messages
    const recipientNames = params.recipient_ids
      .map(id => users.find(u => u.id === id)?.name || 'Someone')
      .join(', ');

    const newSlackMessages: SlackMessage[] = [];

    // Public post if not private
    if (params.visibility !== 'private' && targetChannel) {
      newSlackMessages.push({
        id: `msg-kudos-${kudosId}`,
        channel_id: targetChannel,
        author_id: 'bot-kudos',
        content: `🎉 ${currentUser.name} thanked ${recipientNames}!\n\n"${params.message}"`,
        created_at: now.toISOString(),
        kudos_id: kudosId,
        reactions: {},
        replies: [],
      });
    }

    // Bot DMs to recipients and their managers
    params.recipient_ids.forEach(recId => {
      const recipient = users.find(u => u.id === recId);
      if (!recipient) return;

      // Recipient DM
      newSlackMessages.push({
        id: `dm-rec-${kudosId}-${recId}`,
        channel_id: `dm-${recId}`,
        target_user_id: recId,
        author_id: 'bot-kudos',
        content: `🎉 You received kudos from ${currentUser.name}!\n\n"${params.message}"\n\nVisibility: ${params.visibility.toUpperCase()}`,
        created_at: now.toISOString(),
        kudos_id: kudosId,
        is_dm: true,
        reactions: {},
        replies: [],
      });

      // Manager DM (suppress if manager is giver)
      if (recipient.manager_id && recipient.manager_id !== currentUser.id) {
        newSlackMessages.push({
          id: `dm-mgr-${kudosId}-${recipient.manager_id}`,
          channel_id: `dm-${recipient.manager_id}`,
          target_user_id: recipient.manager_id,
          author_id: 'bot-kudos',
          content: `🌟 Your report ${recipient.name} received kudos from ${currentUser.name}!\n\n"${params.message}"\n\n💡 Tip: Consider acknowledging this accomplishment in your next 1:1 with ${recipient.name}.`,
          created_at: now.toISOString(),
          kudos_id: kudosId,
          is_dm: true,
          reactions: {},
          replies: [],
        });
      }
    });

    setSlackMessages(prev => [...newSlackMessages, ...prev]);

    // Reset composer state
    setIsComposerOpen(false);
    setComposerOpenedAt(null);
    setComposerInitialData(null);

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#C2462E', '#1F6F6B', '#F4EBE1', '#E7E2DA'],
      });
    } catch (e) {
      // Ignore if confetti not supported
    }

    // Show dev toast e.g. "Sent in 14s"
    addToast({
      type: 'success',
      message: `🎉 Kudos sent in ${durationSec}s! Delivered to channel & direct messages.`,
      durationMs: 5000,
    });

    return { durationMs, kudosId };
  };

  const editKudos = (kudosId: string, newMessage: string, newValueId?: string) => {
    const target = kudos.find(k => k.id === kudosId);
    if (!target) return;

    // Check 15 minute window
    const elapsedMinutes = (Date.now() - new Date(target.created_at).getTime()) / (1000 * 60);
    if (elapsedMinutes > rules.edit_window_minutes) {
      addToast({
        type: 'error',
        message: 'Editing is only allowed within 15 minutes of sending.',
      });
      return;
    }

    const nowIso = new Date().toISOString();
    setKudos(prev => prev.map(k => {
      if (k.id === kudosId) {
        return {
          ...k,
          message: newMessage,
          value_id: newValueId,
          edited_at: nowIso,
        };
      }
      return k;
    }));

    // Update slack message
    setSlackMessages(prev => prev.map(msg => {
      if (msg.kudos_id === kudosId) {
        return {
          ...msg,
          content: msg.content.replace(/"[\s\S]*"/, `"${newMessage}" (edited)`),
        };
      }
      return msg;
    }));

    addToast({
      type: 'info',
      message: 'Kudos updated successfully.',
    });
  };

  const deleteKudos = (kudosId: string) => {
    const target = kudos.find(k => k.id === kudosId);
    if (!target) return;

    // Check 15 minute window
    const elapsedMinutes = (Date.now() - new Date(target.created_at).getTime()) / (1000 * 60);
    if (elapsedMinutes > rules.edit_window_minutes && currentUser.role !== 'admin') {
      addToast({
        type: 'error',
        message: 'Deletion is only allowed within 15 minutes of sending.',
      });
      return;
    }

    const nowIso = new Date().toISOString();
    setKudos(prev => prev.map(k => {
      if (k.id === kudosId) {
        return {
          ...k,
          deleted_at: nowIso,
        };
      }
      return k;
    }));

    // Update slack message to soft-deleted text
    setSlackMessages(prev => prev.map(msg => {
      if (msg.kudos_id === kudosId) {
        return {
          ...msg,
          content: '~This kudos was deleted by the sender.~',
        };
      }
      return msg;
    }));

    addToast({
      type: 'info',
      message: 'Kudos has been deleted.',
    });
  };

  const addReaction = (kudosId: string, emoji: string) => {
    setKudos(prev => prev.map(k => {
      if (k.id !== kudosId) return k;
      const reactions = { ...k.reactions };
      const currentList = reactions[emoji] || [];
      if (currentList.includes(currentUser.id)) {
        // Toggle off
        reactions[emoji] = currentList.filter(id => id !== currentUser.id);
        if (reactions[emoji].length === 0) delete reactions[emoji];
      } else {
        // Add
        reactions[emoji] = [...currentList, currentUser.id];
      }
      return { ...k, reactions };
    }));

    // Also update Slack message
    setSlackMessages(prev => prev.map(msg => {
      if (msg.kudos_id !== kudosId) return msg;
      const reactions = { ...(msg.reactions || {}) };
      const currentList = reactions[emoji] || [];
      if (currentList.includes(currentUser.id)) {
        reactions[emoji] = currentList.filter(id => id !== currentUser.id);
        if (reactions[emoji].length === 0) delete reactions[emoji];
      } else {
        reactions[emoji] = [...currentList, currentUser.id];
      }
      return { ...msg, reactions };
    }));
  };

  const addReply = (kudosId: string, message: string) => {
    if (!message.trim()) return;
    const nowIso = new Date().toISOString();
    const newReply = {
      id: `rep-${Date.now()}`,
      user_id: currentUser.id,
      message: message.trim(),
      created_at: nowIso,
    };

    setKudos(prev => prev.map(k => {
      if (k.id === kudosId) {
        return {
          ...k,
          replies: [...(k.replies || []), newReply],
        };
      }
      return k;
    }));

    // Also update Slack message thread
    setSlackMessages(prev => prev.map(msg => {
      if (msg.kudos_id === kudosId) {
        return {
          ...msg,
          replies: [
            ...(msg.replies || []),
            {
              id: newReply.id,
              author_id: currentUser.id,
              content: message.trim(),
              created_at: nowIso,
            },
          ],
        };
      }
      return msg;
    }));
  };

  const addChannelMessage = (channelId: string, content: string) => {
    if (!content.trim()) return;
    const newMsg: SlackMessage = {
      id: `msg-${Date.now()}`,
      channel_id: channelId,
      author_id: currentUser.id,
      content: content.trim(),
      created_at: new Date().toISOString(),
      reactions: {},
      replies: [],
    };
    setSlackMessages(prev => [newMsg, ...prev]);
  };

  const addChannelMessageReply = (messageId: string, content: string) => {
    if (!content.trim()) return;
    const nowIso = new Date().toISOString();
    setSlackMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        return {
          ...msg,
          replies: [
            ...(msg.replies || []),
            {
              id: `rep-${Date.now()}`,
              author_id: currentUser.id,
              content: content.trim(),
              created_at: nowIso,
            },
          ],
        };
      }
      return msg;
    }));
  };

  const resetDemoData = () => {
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch (e) {}

    const seedUsers = generateSeedUsers();
    const { kudos: seedKudos, composerEvents: seedEvents } = generateSeedKudos(seedUsers);
    const seedMessages = generateInitialSlackMessages(seedUsers, seedKudos);

    setUsers(seedUsers);
    setOffices(INITIAL_OFFICES);
    setTeams(INITIAL_TEAMS);
    setValues(INITIAL_VALUES);
    setKudos(seedKudos);
    setComposerEvents(seedEvents);
    setSlackMessages(seedMessages);
    setCurrentUserId('usr-linh');
    setCurrentRole('employee');
    setSelectedSlackChannel('c-kudos');

    addToast({
      type: 'info',
      message: 'Demo dataset reset to ~120 staff and ~400 realistic kudos.',
    });
  };

  // =========================================================================
  // METRICS COMPUTATIONS (Calculated directly from active data, not hardcoded)
  // =========================================================================
  const metrics = useMemo(() => {
    const now = new Date();
    const activeStaff = users.filter(u => u.active);
    const totalStaffCount = activeStaff.length || 1;

    // Filter valid (non-deleted) kudos
    const validKudos = kudos.filter(k => !k.deleted_at);

    // Kudos in last 30 days
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const kudos30d = validKudos.filter(k => new Date(k.created_at) >= thirtyDaysAgo);

    // 1. 30-Day Reach (% who gave OR received in last 30 days)
    const givers30d = new Set<string>();
    const receivers30d = new Set<string>();
    kudos30d.forEach(k => {
      givers30d.add(k.giver_id);
      k.recipient_ids.forEach(r => receivers30d.add(r));
    });

    const reachedUsers = new Set([...Array.from(givers30d), ...Array.from(receivers30d)]);
    const reach30dPct = Math.round((reachedUsers.size / totalStaffCount) * 100);

    // 2. Recipient Coverage (% who received >= 1 in 30 days). Always <= reach.
    const recipientCoverage30dPct = Math.min(
      reach30dPct,
      Math.round((receivers30d.size / totalStaffCount) * 100)
    );

    // 3. Manager Participation (% of managers who gave >= 1 kudos this month)
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const kudosThisMonth = validKudos.filter(k => new Date(k.created_at) >= startOfMonth);
    const managers = users.filter(u => u.role === 'manager' && u.active);
    const totalManagers = managers.length || 1;
    const managersWhoGave = new Set(
      kudosThisMonth.filter(k => managers.some(m => m.id === k.giver_id)).map(k => k.giver_id)
    );
    const managerParticipationPct = Math.round((managersWhoGave.size / totalManagers) * 100);

    // 4. Cross-Team Share (% of kudos crossing team or office)
    let crossCount = 0;
    kudos30d.forEach(k => {
      const giver = users.find(u => u.id === k.giver_id);
      if (!giver) return;
      const isCross = k.recipient_ids.some(rId => {
        const rec = users.find(u => u.id === rId);
        return rec && (rec.team_id !== giver.team_id || rec.office_id !== giver.office_id);
      });
      if (isCross) crossCount++;
    });
    const crossTeamSharePct = kudos30d.length > 0
      ? Math.round((crossCount / kudos30d.length) * 100)
      : 25;

    // 5. Value-tag Share
    const taggedCount = kudos30d.filter(k => !!k.value_id).length;
    const valueTagSharePct = kudos30d.length > 0
      ? Math.round((taggedCount / kudos30d.length) * 100)
      : 80;

    // 6. Median Time to Send (Median of compose_ms)
    const durations = kudos30d.map(k => k.compose_ms || 18000).sort((a, b) => a - b);
    let medianDurationMs = 18000;
    if (durations.length > 0) {
      const mid = Math.floor(durations.length / 2);
      medianDurationMs = durations.length % 2 !== 0
        ? durations[mid]
        : (durations[mid - 1] + durations[mid]) / 2;
    }
    const medianTimeToSendSeconds = Math.round(medianDurationMs / 1000);

    // 7. Completion Rate (Kudos sent / Composer opened)
    const recentEvents = composerEvents.filter(e => new Date(e.opened_at) >= thirtyDaysAgo);
    const totalOpened = recentEvents.length || 1;
    const totalSent = recentEvents.filter(e => e.sent).length;
    const completionRatePct = Math.round((totalSent / totalOpened) * 100);

    // 8. Weekly Active Givers (4-Week Rolling Average)
    const weekTrends: { week: string; pct: number }[] = [];
    for (let w = 3; w >= 0; w--) {
      const wStart = new Date(now.getTime() - (w + 1) * 7 * 24 * 60 * 60 * 1000);
      const wEnd = new Date(now.getTime() - w * 7 * 24 * 60 * 60 * 1000);
      const weekKudos = validKudos.filter(k => {
        const d = new Date(k.created_at);
        return d >= wStart && d < wEnd;
      });
      const weekGivers = new Set(weekKudos.map(k => k.giver_id));
      const pct = Math.round((weekGivers.size / totalStaffCount) * 100);
      weekTrends.push({
        week: `W-${w === 0 ? 'Current' : w + ' ago'}`,
        pct,
      });
    }

    const weeklyActiveGiversPct = Math.round(
      weekTrends.reduce((acc, curr) => acc + curr.pct, 0) / weekTrends.length
    );

    // 9. "Not recognised in 30 days" list
    const unrecognisedUsers30d = activeStaff.filter(u => !receivers30d.has(u.id));

    // 10. Breakdown by Office and Team
    const officeBreakdown = offices.map(off => {
      const officeStaff = activeStaff.filter(u => u.office_id === off.id);
      const staffIds = new Set(officeStaff.map(u => u.id));
      const given = kudos30d.filter(k => staffIds.has(k.giver_id)).length;
      const received = kudos30d.filter(k => k.recipient_ids.some(r => staffIds.has(r))).length;
      const officeReached = new Set(
        [...kudos30d.filter(k => staffIds.has(k.giver_id)).map(k => k.giver_id),
         ...kudos30d.flatMap(k => k.recipient_ids).filter(r => staffIds.has(r))]
      );
      const reachPct = officeStaff.length > 0 ? Math.round((officeReached.size / officeStaff.length) * 100) : 0;
      return {
        office: off.name,
        kudosGiven: given,
        kudosReceived: received,
        reachPct,
      };
    });

    const teamBreakdown = teams.map(tm => {
      const teamStaff = activeStaff.filter(u => u.team_id === tm.id);
      const staffIds = new Set(teamStaff.map(u => u.id));
      const given = kudos30d.filter(k => staffIds.has(k.giver_id)).length;
      const received = kudos30d.filter(k => k.recipient_ids.some(r => staffIds.has(r))).length;
      return {
        team: tm.name,
        kudosGiven: given,
        kudosReceived: received,
      };
    });

    // 11. Read-Out Helper suggestions (Curated by breadth and values, NEVER ranked by count)
    const crossOfficeKudos = kudos30d.filter(k => {
      const giver = users.find(u => u.id === k.giver_id);
      return giver && k.recipient_ids.some(rId => {
        const rec = users.find(u => u.id === rId);
        return rec && rec.office_id !== giver.office_id;
      });
    }).slice(0, 5);

    // First time recipients
    const firstTimeKudos = kudos30d.filter(k => {
      return k.recipient_ids.some(rId => {
        const priorCount = validKudos.filter(vk => 
          new Date(vk.created_at) < new Date(k.created_at) && vk.recipient_ids.includes(rId)
        ).length;
        return priorCount === 0;
      });
    }).slice(0, 5);

    // Value champions (deep, high quality praise with values)
    const valueChampions = kudos30d.filter(k => !!k.value_id && k.message.length >= 80).slice(0, 5);

    return {
      weeklyActiveGiversPct,
      reach30dPct,
      recipientCoverage30dPct,
      managerParticipationPct,
      crossTeamSharePct,
      valueTagSharePct,
      medianTimeToSendSeconds,
      completionRatePct,
      weeklyTrend: weekTrends,
      unrecognisedUsers30d,
      officeBreakdown,
      teamBreakdown,
      ritualSuggestions: {
        crossOffice: crossOfficeKudos,
        firstTime: firstTimeKudos,
        valueChampions,
      },
    };
  }, [users, offices, teams, kudos, composerEvents]);

  return (
    <KudosContext.Provider
      value={{
        users,
        offices,
        teams,
        values,
        kudos,
        slackMessages,
        composerEvents,
        rules,
        currentUser,
        currentRole,
        activeApp,
        selectedSlackChannel,
        selectedSlackThreadId,
        toasts,
        isComposerOpen,
        composerOpenedAt,
        composerInitialData,
        setActiveApp,
        setCurrentUserById,
        setCurrentRole: handleRoleChange,
        setSelectedSlackChannel,
        setSelectedSlackThreadId,
        openComposer,
        closeComposer,
        sendKudos,
        editKudos,
        deleteKudos,
        addReaction,
        addReply,
        addChannelMessage,
        addChannelMessageReply,
        resetDemoData,
        dismissToast,
        addToast,
        metrics,
      }}
    >
      {children}
    </KudosContext.Provider>
  );
}

export function useKudos() {
  const context = useContext(KudosContext);
  if (!context) {
    throw new Error('useKudos must be used within a KudosProvider');
  }
  return context;
}
