import type { Metadata } from 'next';
import './globals.css';
import { KudosProvider } from '../context/KudosContext';

export const metadata: Metadata = {
  title: 'Kudos V1 — Peer Recognition for CodeLink',
  description: 'Under 30 seconds, inside Slack. Celebrate the giver, notify the manager, foster cross-office and cross-team recognition without toxic leaderboards.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-brand-bg text-brand-text flex flex-col font-body selection:bg-brand-accent selection:text-white">
        <KudosProvider>
          {children}
        </KudosProvider>
      </body>
    </html>
  );
}
