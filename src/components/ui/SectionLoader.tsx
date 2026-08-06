'use client';

import React from 'react';
import { Network } from 'lucide-react';
import { clsx } from 'clsx';

interface SectionLoaderProps {
  title?: string;
  subtitle?: string;
}

export const SectionLoader: React.FC<SectionLoaderProps> = ({
  title = 'Loading Platform',
  subtitle = 'Fetching real-time graph entity relationships...',
}) => {
  return (
    <div className="min-h-[60vh] w-full flex flex-col items-center justify-center p-8 transition-all">
      <div className="relative flex flex-col items-center space-y-6 max-w-sm text-center">
        {/* Outer Glow and Spinning Dashed Ring */}
        <div className="relative flex items-center justify-center">
          {/* Pulsing Blue Glow */}
          <div className="absolute w-28 h-28 rounded-3xl bg-blue-500/20 blur-2xl animate-pulse" />
          
          {/* Outer Dashed Spinning Ring */}
          <div className="w-22 h-22 rounded-3xl border-2 border-dashed border-blue-400/60 animate-[spin_6s_linear_infinite]" />
          
          {/* Center Common ConnectSphere Logo Badge */}
          <div className="absolute w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 ring-4 ring-blue-500/10 transition-all">
            <Network className="w-7 h-7 animate-spin" />
          </div>
        </div>

        {/* Title and Subtitle */}
        <div className="space-y-1.5">
          <h3 className="text-lg font-extrabold text-slate-900 tracking-tight flex items-center justify-center gap-2">
            {title}
          </h3>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
};
