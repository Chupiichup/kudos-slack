'use client';

import React, { useState } from 'react';
import { useKudos } from '../context/KudosContext';
import {
  X,
  PlayCircle,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  MessageSquare,
  Users,
  Eye,
  BarChart3,
  ExternalLink,
} from 'lucide-react';

interface DemoGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DemoGuideModal({ isOpen, onClose }: DemoGuideModalProps) {
  const {
    setActiveApp,
    setCurrentUserById,
    setSelectedSlackChannel,
    openComposer,
    slackMessages,
  } = useKudos();

  const [activeStep, setActiveStep] = useState<number>(1);

  if (!isOpen) return null;

  const steps = [
    {
      step: 1,
      title: '1. Give Kudos as Linh (Message Shortcut)',
      persona: 'Linh Nguyen (Employee)',
      desc: 'In #team-engineering, find Minh Tran’s message: "Hey team, staging auth token refresh is fixed now...". Click the "…" menu -> "Give Kudos". Or click the shortcut button below to pre-open the modal!',
      actionLabel: 'Launch Step 1 (Switch to Linh & open modal)',
      onAction: () => {
        setCurrentUserById('usr-linh');
        setActiveApp('slack');
        setSelectedSlackChannel('c-engineering');
        const targetMsg = slackMessages.find(m => m.id === 'msg-seed-1');
        openComposer({
          recipients: ['usr-minh'],
          sourceMessageId: 'msg-seed-1',
          sourceMessagePreview: targetMsg?.content || 'Hey team, staging auth token refresh is fixed now...',
          source: 'shortcut',
        });
        onClose();
      },
    },
    {
      step: 2,
      title: '2. Verify Bot DMs (Recipient & Manager)',
      persona: 'Minh Tran (Recipient) & Huy Dang (Manager)',
      desc: 'See how the recognition loop completes. Switch to Minh to see his recipient DM. Then switch to Huy (Minh\'s engineering lead) to see the automated manager DM prompting for 1:1 reinforcement!',
      actionLabel: 'Switch to Minh (Recipient DM)',
      secondaryActionLabel: 'Switch to Huy (Manager DM)',
      onAction: () => {
        setCurrentUserById('usr-minh');
        setActiveApp('slack');
        setSelectedSlackChannel('dm-usr-minh');
        onClose();
      },
      onSecondaryAction: () => {
        setCurrentUserById('usr-huy');
        setActiveApp('slack');
        setSelectedSlackChannel('dm-usr-huy');
        onClose();
      },
    },
    {
      step: 3,
      title: '3. Amplify with Emoji & Thread Replies',
      persona: 'Teammates in Slack',
      desc: 'Navigate to #kudos or #team-engineering. Click reactions (🔥, 👏, ❤️) or open the thread panel to reply and amplify the recognition.',
      actionLabel: 'Go to #kudos channel',
      onAction: () => {
        setActiveApp('slack');
        setSelectedSlackChannel('c-kudos');
        onClose();
      },
    },
    {
      step: 4,
      title: '4. Explore Web Kudos Wall & Spotlights',
      persona: 'All Staff (Public Wall)',
      desc: 'Switch to the Kudos Web App. Check the "Spotlight" banner (first-time recipients & cross-office collaborations). Filter by "Cross-team only", office, or company values.',
      actionLabel: 'Open Web Kudos Wall',
      onAction: () => {
        setActiveApp('web');
        onClose();
      },
    },
    {
      step: 5,
      title: '5. Talent Admin: Monthly Report & Read-Out',
      persona: 'Sarah Jenkins (Talent Admin)',
      desc: 'Review the 9 real-time metrics (Weekly Active Givers 4-week rolling, 30-day reach, recipient coverage, manager participation). Check the "Not recognised in 30 days" list and use the Read-Out Helper for all-hands!',
      actionLabel: 'Switch to Sarah & Open Talent Admin',
      onAction: () => {
        setCurrentUserById('usr-sarah');
        setActiveApp('web');
        onClose();
      },
    },
  ];

  const currentStepData = steps[activeStep - 1];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-brand-card rounded-2xl border border-brand-border shadow-2xl max-w-2xl w-full overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="px-6 py-4 bg-brand-bg border-b border-brand-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-secondary text-white flex items-center justify-center">
              <PlayCircle className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-brand-text">3-Minute Demo Walkthrough</h3>
              <p className="text-xs text-brand-muted">Follow this script to experience every V1 flow end-to-end</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-brand-muted hover:text-brand-text p-1.5 rounded-lg hover:bg-black/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Tabs */}
        <div className="flex border-b border-brand-border bg-white text-xs overflow-x-auto">
          {steps.map(s => (
            <button
              key={s.step}
              onClick={() => setActiveStep(s.step)}
              className={`flex-1 py-3 px-3 text-center font-medium whitespace-nowrap transition-colors border-b-2 ${
                activeStep === s.step
                  ? 'border-brand-accent text-brand-accent bg-brand-highlight/40 font-semibold'
                  : 'border-transparent text-brand-muted hover:text-brand-text'
              }`}
            >
              Step {s.step}
            </button>
          ))}
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-secondary bg-brand-secondary/10 px-2.5 py-1 rounded-full">
              {currentStepData.persona}
            </span>
            <span className="text-xs text-brand-muted">
              Step {activeStep} of 5
            </span>
          </div>

          <h4 className="font-heading font-bold text-xl text-brand-text">
            {currentStepData.title}
          </h4>

          <p className="text-sm text-brand-text/80 leading-relaxed bg-brand-bg p-4 rounded-xl border border-brand-border">
            {currentStepData.desc}
          </p>

          {/* Interactive Trigger Buttons */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={currentStepData.onAction}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-accent text-white font-medium text-sm hover:bg-opacity-95 shadow-md transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>{currentStepData.actionLabel}</span>
            </button>

            {currentStepData.secondaryActionLabel && currentStepData.onSecondaryAction && (
              <button
                onClick={currentStepData.onSecondaryAction}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-secondary text-white font-medium text-sm hover:bg-opacity-95 shadow-md transition-all"
              >
                <Users className="w-4 h-4" />
                <span>{currentStepData.secondaryActionLabel}</span>
              </button>
            )}
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="px-6 py-3.5 bg-brand-bg border-t border-brand-border flex items-center justify-between text-xs">
          <button
            onClick={() => setActiveStep(prev => Math.max(1, prev - 1))}
            disabled={activeStep === 1}
            className="px-3 py-1.5 rounded-lg border border-brand-border text-brand-text disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white"
          >
            Previous Step
          </button>
          <div className="flex items-center gap-1.5">
            {steps.map(s => (
              <span
                key={s.step}
                className={`w-2 h-2 rounded-full ${
                  activeStep === s.step ? 'bg-brand-accent' : 'bg-brand-border'
                }`}
              />
            ))}
          </div>
          <button
            onClick={() => {
              if (activeStep < 5) {
                setActiveStep(prev => prev + 1);
              } else {
                onClose();
              }
            }}
            className="px-3 py-1.5 rounded-lg bg-brand-text text-white hover:bg-opacity-90 font-medium"
          >
            {activeStep === 5 ? 'Finish Tour' : 'Next Step'}
          </button>
        </div>
      </div>
    </div>
  );
}
