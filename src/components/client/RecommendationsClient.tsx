'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Recommendation } from '@/types';
import { Sparkles, UserPlus, Info } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

interface RecommendationsClientProps {
  initialRecommendations: Recommendation[];
}

export const RecommendationsClient: React.FC<RecommendationsClientProps> = ({ initialRecommendations }) => {
  const [activeTab, setActiveTab] = useState<'All' | 'Investor' | 'Mentor' | 'Startup' | 'Founder'>('All');
  const { toast } = useToast();

  const filteredRecs = activeTab === 'All'
    ? initialRecommendations
    : initialRecommendations.filter((r) => r.entityType === activeTab);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Sparkles className="w-7 h-7 text-amber-500" /> Graph Match Engine
          </h1>
          <p className="text-sm text-slate-500 mt-1">AI-driven recommendations based on CognoDB graph proximity, tech stack overlap, & mutual mentors.</p>
        </div>

        <Badge variant="amber" size="lg" icon={<Sparkles className="w-4 h-4" />}>
          CognoDB Vector Score Active
        </Badge>
      </div>

      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
        {(['All', 'Investor', 'Mentor', 'Startup', 'Founder'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === tab
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {tab === 'All' ? 'All Graph Matches' : `${tab} Matches`}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredRecs.map((rec) => (
          <Card key={rec.id} className="flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3.5">
                  <img src={rec.avatar} alt={rec.name} className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-100 shadow-sm" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900">{rec.name}</h3>
                      <Badge variant="blue" size="sm">{rec.entityType}</Badge>
                    </div>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">{rec.title}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60 block">
                    {rec.matchScore}% Match
                  </span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-amber-50/60 border border-amber-200/60 rounded-xl">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 mb-1">
                  <Info className="w-3.5 h-3.5 text-amber-600" /> Graph Match Reason
                </div>
                <p className="text-xs text-amber-800 font-medium">{rec.matchReason}</p>
              </div>

              <div className="mt-3.5 space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Graph Tags</span>
                <div className="flex flex-wrap gap-1">
                  {rec.tags.map((tag, i) => (
                    <Badge key={i} variant="slate" size="sm">{tag}</Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Verified by Graph Traversal</span>

              <button
                onClick={() => toast({ title: `Connection request sent to ${rec.name}`, description: 'CognoDB node edge requested.' })}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md transition-all flex items-center gap-1.5"
              >
                <UserPlus className="w-3.5 h-3.5" /> Request Link
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
