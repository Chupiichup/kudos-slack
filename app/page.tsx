'use client';

import React, { useState } from 'react';
import { useKudos } from '../context/KudosContext';
import Header from '../components/Header';
import SlackSimulator from '../components/slack/SlackSimulator';
import KudosWebApp from '../components/web/KudosWebApp';
import ToastContainer from '../components/ToastContainer';
import DemoGuideModal from '../components/DemoGuideModal';

export default function Home() {
  const { activeApp } = useKudos();
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-brand-bg select-none">
      {/* Top Universal Navigation Bar */}
      <Header onOpenDemoScript={() => setIsDemoModalOpen(true)} />

      {/* Main Switchable Application Canvas */}
      <main className="flex-1 flex overflow-hidden relative">
        {activeApp === 'slack' ? <SlackSimulator /> : <KudosWebApp />}
      </main>

      {/* Toast Notifications System */}
      <ToastContainer />

      {/* 3-Minute Demo Guide Walkthrough Modal */}
      <DemoGuideModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
      />
    </div>
  );
}
