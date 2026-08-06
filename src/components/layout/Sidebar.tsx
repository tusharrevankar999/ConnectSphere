'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  Briefcase, 
  GraduationCap, 
  FolderGit2, 
  Sparkles, 
  Settings,
  Database
} from 'lucide-react';
import { clsx } from 'clsx';

interface SidebarProps {
  collapsed?: boolean;
}

export const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Founders', href: '/founders', icon: Users },
  { name: 'Startups', href: '/startups', icon: Building2 },
  { name: 'Investors', href: '/investors', icon: Briefcase },
  { name: 'Mentors', href: '/mentors', icon: GraduationCap },
  { name: 'Resources', href: '/resources', icon: FolderGit2 },
  // { name: 'Industries', href: '/industries', icon: Layers },
  { name: 'Recommendations', href: '/recommendations', icon: Sparkles, badge: 'AI Match' },
  // { name: 'Graph Explorer', href: '/graph-explorer', icon: GitMerge, badge: 'Live 2D' },
  // { name: 'Settings', href: '/settings', icon: Settings },
];


export const Sidebar: React.FC<SidebarProps> = ({ collapsed = false }) => {
  const pathname = usePathname();

  return (
    <aside
      className={clsx(
        'bg-white border-r border-slate-200/80 min-h-[calc(100vh-61px)] transition-all duration-300 flex flex-col justify-between p-4 shrink-0',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      <div className="space-y-6">
        {/* Navigation Group Header */}
        <div>
          {!collapsed && (
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
              Platform Modules
            </div>
          )}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={clsx(
                    'flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all group relative',
                    isActive
                      ? 'bg-blue-50 text-blue-600 font-bold border border-blue-200/60 shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={clsx('w-5 h-5 shrink-0 transition-colors', isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600')} />
                    {!collapsed && <span>{item.name}</span>}
                  </div>

                  {!collapsed && item.badge && (
                    <span
                      className={clsx(
                        'text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider',
                        item.badge === 'AI Match' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer Banner in Sidebar */}
      {!collapsed && (
        <div className="p-3.5 bg-gradient-to-br from-blue-50 to-sky-50 border border-blue-100 rounded-2xl">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-900 mb-1">
            <Database className="w-4 h-4 text-blue-600" /> Platform Connected
          </div>
          <p className="text-[11px] text-slate-600 leading-tight">
            Graph database engine actively syncing 78 items and 142 relationship edges.
          </p>

        </div>
      )}
    </aside>
  );
};
