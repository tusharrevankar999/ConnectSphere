'use client';

import React, { useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { ToastProvider, useToast } from '../ui/Toast';
import { ProfileDrawer } from '../ui/ProfileDrawer';
import { NodeType } from '@/types';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShellContent: React.FC<AppShellProps> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeDrawer, setActiveDrawer] = useState<{
    isOpen: boolean;
    type: NodeType | null;
    id: string | null;
    name: string | null;
  }>({
    isOpen: false,
    type: null,
    id: null,
    name: null,
  });

  const { toast } = useToast();

  const handleOpenEntity = (type: string, id: string, name: string) => {
    setActiveDrawer({
      isOpen: true,
      type: type as NodeType,
      id,
      name,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans">
      <Header
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        onOpenEntity={handleOpenEntity}
      />

      <div className="flex-1 flex w-full">
        <Sidebar collapsed={sidebarCollapsed} />

        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-8 py-8 w-full">
          {children}
        </main>
      </div>

      {/* Global Slide-Over Entity Drawer */}
      <ProfileDrawer
        isOpen={activeDrawer.isOpen}
        onClose={() => setActiveDrawer({ isOpen: false, type: null, id: null, name: null })}
        entityType={activeDrawer.type}
        entityId={activeDrawer.id}
        onConnect={() => {
          toast({
            title: 'Connection Request Sent!',
            description: `Graph edge requested for ${activeDrawer.name}. Pending CognoDB verification.`,
            variant: 'success',
          });
        }}
      />
    </div>
  );
};

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  return (
    <ToastProvider>
      <AppShellContent>{children}</AppShellContent>
    </ToastProvider>
  );
};
