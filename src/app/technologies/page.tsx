import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { TechnologyService } from '@/lib/services/technologyService';
import { Search, TrendingUp } from 'lucide-react';

export const revalidate = 0; // SSR

export default async function TechnologiesPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const { search } = await searchParams;

  const techService = new TechnologyService();
  const technologies = await techService.getTechnologies({ search });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Technologies Graph</h1>
          <p className="text-sm text-slate-500 mt-1">15 core technology nodes powering ecosystem startups & products.</p>
        </div>

        <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-pink-50 text-pink-700 border border-pink-200/60">
          {technologies.length} Tech Stack Nodes
        </span>
      </div>

      <form method="GET" className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          name="search"
          defaultValue={search || ''}
          placeholder="Search technology, runtime, framework, or vector DB..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
        />
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {technologies.map((t) => (
          <Card key={t.id} className="flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-pink-50 border border-pink-100 text-pink-600 flex items-center justify-center font-black text-sm shadow-2xs">
                    {t.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{t.name}</h3>
                    <p className="text-xs text-slate-500 font-medium">{t.category}</p>
                  </div>
                </div>
                <Badge variant="pink" size="sm" icon={<TrendingUp className="w-3 h-3" />}>
                  {t.adoptionTrend}
                </Badge>
              </div>

              <p className="text-xs text-slate-600 mt-3 leading-relaxed">{t.description}</p>

              <div className="mt-4 space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Top Startups Adopting</span>
                <div className="flex flex-wrap gap-1">
                  {t.topStartups.map((stp, i) => (
                    <Badge key={i} variant="emerald" size="sm">{stp}</Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold text-slate-700">{t.startupCount} Startups using this stack</span>
              <span className="text-pink-600 font-bold">Graph Edge Verified</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
