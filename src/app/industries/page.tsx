import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { IndustryService } from '@/lib/services/industryService';
import { Layers, TrendingUp } from 'lucide-react';

export const revalidate = 0; // SSR

export default async function IndustriesPage() {
  const indService = new IndustryService();
  const industries = await indService.getIndustries();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Industries & Sectors</h1>
          <p className="text-sm text-slate-500 mt-1">8 key technology industry verticals mapped into CognoDB clusters.</p>
        </div>

        <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-cyan-50 text-cyan-700 border border-cyan-200/60">
          {industries.length} Verticals Mapped
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {industries.map((ind) => (
          <Card key={ind.id} className="flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-cyan-50 border border-cyan-100 text-cyan-600 flex items-center justify-center">
                  <Layers className="w-5 h-5" />
                </div>
                <Badge variant="cyan" size="sm" icon={<TrendingUp className="w-3 h-3" />}>
                  {ind.growthRate}
                </Badge>
              </div>

              <h3 className="text-base font-bold text-slate-900 mt-3">{ind.name}</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">{ind.description}</p>

              <div className="grid grid-cols-2 gap-2 mt-4 p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">STARTUPS</span>
                  <span className="font-bold text-slate-900">{ind.startupCount}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">FUNDING</span>
                  <span className="font-bold text-emerald-600">{ind.totalFunding}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-semibold">
              <span>Cluster Density: High</span>
              <span className="text-blue-600 cursor-pointer hover:underline">Explore Cluster →</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
