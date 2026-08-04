'use client';

import React, { useState } from 'react';
import { Bell, Sparkles, Network, ShieldCheck } from 'lucide-react';
import { useToast } from '../ui/Toast';
import { mockActivities } from '@/data/mockData';

interface HeaderProps {
  onToggleSidebar: () => void;
  onOpenEntity: (type: string, id: string, name: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const { toast } = useToast();

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between transition-all">
        {/* Left Side: Logo & Workspace Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors md:hidden"
          >
            <Network className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-sky-400 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Network className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold text-slate-900 tracking-tight">ConnectSphere</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700 uppercase tracking-wider">v2.4</span>
              </div>
              <span className="text-xs text-slate-500 hidden sm:inline-block">Platform Graph Intelligence</span>
            </div>
          </div>
        </div>

        {/* Right Side: Notifications, User Profile Avatar */}
        <div className="flex items-center gap-2.5">
          {/* Notifications Popover */}
          <div className="relative">
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="relative p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white"></span>
            </button>

            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-4 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-blue-600" /> Graph Live Activity
                  </h4>
                  <span
                    onClick={() => toast({ title: 'Notifications Cleared', description: 'All activity alerts marked as read.' })}
                    className="text-xs text-blue-600 font-semibold cursor-pointer hover:underline"
                  >
                    Mark all read
                  </span>
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {mockActivities.map((act) => (
                    <div key={act.id} className="p-2.5 rounded-xl hover:bg-slate-50 transition-colors flex items-start gap-3">
                      <img src={act.avatar} alt="" className="w-7 h-7 rounded-lg object-cover mt-0.5" />
                      <div className="flex-1 text-xs">
                        <div className="font-semibold text-slate-900">{act.title}</div>
                        <div className="text-slate-500 line-clamp-2 mt-0.5">{act.description}</div>
                        <div className="text-[10px] text-slate-400 mt-1">{act.timestamp}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
                alt="Tushar Revankar"
                className="w-9 h-9 rounded-full object-cover ring-2 ring-blue-500/20"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white"></span>
            </div>
            <div className="hidden lg:block text-left">
              <div className="text-xs font-bold text-slate-900 flex items-center gap-1">
                Tushar Revankar <ShieldCheck className="w-3.5 h-3.5 text-blue-600 inline" />
              </div>
              <div className="text-[11px] text-slate-500">NeuralFlow AI (Founder)</div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};
