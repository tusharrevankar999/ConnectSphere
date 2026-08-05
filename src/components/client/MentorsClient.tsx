'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Mentor } from '@/types';
import { Search, Star, UserPlus } from 'lucide-react';
import { ProfileDrawer } from '@/components/ui/ProfileDrawer';
import { useToast } from '@/components/ui/Toast';
import { useSearchParams } from 'next/navigation';

interface MentorsClientProps {
  initialMentors: Mentor[];
}

export const MentorsClient: React.FC<MentorsClientProps> = ({ initialMentors }) => {
  const searchParams = useSearchParams();
  const [selectedMentorId, setSelectedMentorId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const { toast } = useToast();

  const filteredMentors = initialMentors.filter((m) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      m.name.toLowerCase().includes(q) ||
      m.company.toLowerCase().includes(q) ||
      m.title.toLowerCase().includes(q) ||
      (m.expertise && m.expertise.some((exp) => exp.toLowerCase().includes(q))) ||
      (m.technologies && m.technologies.some((tech) => tech.toLowerCase().includes(q))) ||
      (m.bio && m.bio.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Mentors Directory</h1>
          <p className="text-sm text-slate-500 mt-1">10 industry leaders offering 1:1 advisory to ecosystem founders.</p>
        </div>

        <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-amber-50 text-amber-700 border border-amber-200/60">
          {filteredMentors.length} Mentors Available
        </span>
      </div>

      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          placeholder="Search mentor name, company, or domain expertise..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 shadow-2xs"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMentors.map((m) => (
          <Card key={m.id} className="flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3.5">
                  <img src={m.photo} alt={m.name} className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-100 shadow-sm shrink-0" />
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{m.name}</h3>
                    <p className="text-xs font-semibold text-amber-600">{m.title}</p>
                    <p className="text-xs text-slate-500 font-medium">{m.company}</p>
                  </div>
                </div>
                <Badge variant={m.availability === 'Available Now' ? 'emerald' : m.availability === 'Limited Slots' ? 'amber' : 'slate'} size="sm">
                  {m.availability}
                </Badge>
              </div>

              <div className="mt-3 flex items-center gap-3 text-xs text-slate-500">
                <span className="flex items-center gap-1 font-bold text-slate-900">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> {m.rating}
                </span>
                <span>•</span>
                <span>{m.startupsMentoredCount} startups mentored</span>
              </div>

              <div className="mt-3.5 space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Domain Expertise</span>
                <div className="flex flex-wrap gap-1">
                  {m.expertise.map((exp, i) => (
                    <Badge key={i} variant="amber" size="sm">{exp}</Badge>
                  ))}
                </div>
              </div>

              <div className="mt-3 space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Stack & Runtimes</span>
                <div className="flex flex-wrap gap-1">
                  {m.technologies.map((t, i) => (
                    <Badge key={i} variant="pink" size="sm">{t}</Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
              <button
                onClick={() => setSelectedMentorId(m.id)}
                className="flex-1 py-2 bg-slate-50 hover:bg-slate-100 text-slate-800 rounded-xl text-xs font-semibold transition-colors"
              >
                View Profile
              </button>
              <button
                onClick={() => toast({ title: `Session requested with ${m.name}`, description: 'Office hours request logged.' })}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center gap-1"
              >
                <UserPlus className="w-3.5 h-3.5" /> Book
              </button>
            </div>
          </Card>
        ))}
      </div>

      <ProfileDrawer
        isOpen={!!selectedMentorId}
        onClose={() => setSelectedMentorId(null)}
        entityType="Mentor"
        entityId={selectedMentorId}
      />
    </div>
  );
};

