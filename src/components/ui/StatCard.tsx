'use client';

import React, { useEffect, useState } from 'react';
import { LucideIcon, TrendingUp, Users, Building2, Briefcase, GraduationCap, Cpu, Layers } from 'lucide-react';
import { Card } from './Card';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

export type IconName = 'users' | 'building' | 'briefcase' | 'graduation' | 'cpu' | 'layers';

const iconMap: Record<IconName, LucideIcon> = {
  users: Users,
  building: Building2,
  briefcase: Briefcase,
  graduation: GraduationCap,
  cpu: Cpu,
  layers: Layers,
};

interface StatCardProps {
  title: string;
  value: number;
  suffix?: string;
  prefix?: string;
  trend?: string;
  iconName?: IconName;
  icon?: LucideIcon;
  iconBgColor?: string;
  iconColor?: string;
  onClick?: () => void;
  delay?: number;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  suffix = '',
  prefix = '',
  trend = '+12% this mo',
  iconName = 'users',
  icon: CustomIcon,
  iconBgColor = 'bg-blue-50',
  iconColor = 'text-blue-600',
  onClick,
  delay = 0,
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const IconComponent = CustomIcon || iconMap[iconName] || Users;

  useEffect(() => {
    let start = 0;
    const duration = 1200; // ms
    const increment = value / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="h-full"
    >
      <Card
        onClick={onClick}
        className={clsx(
          'cursor-pointer group relative overflow-hidden flex flex-col justify-between min-h-[160px] p-6 border-slate-200/90 bg-white shadow-sm transition-all duration-300',
          'hover:bg-gradient-to-br hover:from-blue-600 hover:via-blue-600 hover:to-indigo-700 hover:border-blue-600 hover:shadow-xl hover:shadow-blue-500/25'
        )}
      >
        {/* Subtle hover background radial shine */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/0 rounded-full blur-2xl group-hover:bg-white/10 transition-all pointer-events-none" />

        {/* Top row: Title and Icon */}
        <div className="flex items-center justify-between relative z-10">
          <div>
            <span className="text-base font-bold text-slate-800 tracking-tight group-hover:text-white transition-colors duration-200">
              {title}
            </span>
          </div>

          <div
            className={clsx(
              'w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:bg-white/20 group-hover:scale-110 shadow-2xs',
              iconBgColor
            )}
          >
            <IconComponent className={clsx('w-6 h-6 transition-colors duration-200 group-hover:text-white', iconColor)} />
          </div>
        </div>

        {/* Bottom row: Counter Value & Growth Badge */}
        <div className="mt-4 pt-3 border-t border-slate-100/80 group-hover:border-white/20 flex items-end justify-between relative z-10 transition-colors duration-200">
          <div className="space-y-0.5">
            <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight group-hover:text-white transition-colors duration-200">
              {prefix}{displayValue.toLocaleString()}{suffix}
            </div>
            <span className="text-[11px] font-semibold text-slate-400 group-hover:text-blue-100 transition-colors duration-200">
              Live Graph Count
            </span>
          </div>

          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60 shadow-2xs group-hover:bg-white/20 group-hover:text-white group-hover:border-white/30 transition-all duration-200">
            <TrendingUp className="w-3.5 h-3.5 group-hover:text-white transition-colors duration-200" />
            {trend}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
