import type { Metadata } from 'next';
import './globals.css';
import { AppShell } from '@/components/layout/AppShell';

export const metadata: Metadata = {
  title: 'ConnectSphere — Graph Intelligence Platform',
  description: 'Graph Intelligence Platform connecting Founders, Startups, Investors, Mentors, and Industries.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
