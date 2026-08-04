'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Investor } from '@/types';
import { Search, ArrowUpRight } from 'lucide-react';
import { ProfileDrawer } from '@/components/ui/ProfileDrawer';
import { useRouter, useSearchParams } from 'next/navigation';

interface InvestorsClientProps {
  initialInvestors: Investor[];
}

export const InvestorsClient: React.FC<InvestorsClientProps> = ({ initialInvestors }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedInvestorId, setSelectedInvestorId] = useState<string | null>(null);

  const search = searchParams.get('search') || '';

  const handleSearchChange = (val: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (val) params.set('search', val);
    else params.delete('search');
    router.replace(`/investors?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Investors Directory</h1>
          <p className="text-sm text-slate-500 mt-1">10 top venture capital firms & angel investors mapped to target startups.</p>
        </div>

        <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 border border-purple-200/60">
          {initialInvestors.length} VCs & Angels
        </span>
      </div>

      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          placeholder="Search investor, VC firm, or target sector..."
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {initialInvestors.map((inv) => (
          <Card key={inv.id} className="flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-start gap-3.5">
                <img src={inv.photo} alt={inv.name} className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-100 shadow-sm shrink-0" />
                <div>
                  <h3 className="text-base font-bold text-slate-900">{inv.name}</h3>
                  <p className="text-xs font-semibold text-purple-600">{inv.firm}</p>
                  <p className="text-xs text-slate-500">{inv.role}</p>
                </div>
              </div>

              <div className="mt-4 p-3 bg-purple-50/50 border border-purple-100 rounded-xl flex items-center justify-between">
                <span className="text-xs font-semibold text-purple-900">Check Size</span>
                <span className="text-xs font-bold text-purple-700">{inv.ticketSize}</span>
              </div>

              <div className="mt-3 space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Focus Industries</span>
                <div className="flex flex-wrap gap-1">
                  {inv.focusIndustries.map((ind, i) => (
                    <Badge key={i} variant="cyan" size="sm">{ind}</Badge>
                  ))}
                </div>
              </div>

              <div className="mt-3 space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Recent Investments</span>
                <div className="flex flex-wrap gap-1">
                  {inv.recentInvestments.map((rec, i) => (
                    <Badge key={i} variant="emerald" size="sm">{rec}</Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">
                {inv.portfolioCount} Portfolio Startups
              </span>

              <button
                onClick={() => setSelectedInvestorId(inv.id)}
                className="px-3.5 py-1.5 bg-purple-50 hover:bg-purple-600 hover:text-white text-purple-700 rounded-xl text-xs font-semibold transition-all flex items-center gap-1"
              >
                View Portfolio <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </Card>
        ))}
      </div>

      <ProfileDrawer
        isOpen={!!selectedInvestorId}
        onClose={() => setSelectedInvestorId(null)}
        entityType="Investor"
        entityId={selectedInvestorId}
      />
    </div>
  );
};
