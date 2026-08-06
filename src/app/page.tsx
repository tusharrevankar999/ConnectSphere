import React from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  Sparkles, 
  GitMerge, 
  Zap
} from 'lucide-react';
import { StatCard } from '@/components/ui/StatCard';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { FounderService } from '@/lib/services/founderService';
import { StartupService } from '@/lib/services/startupService';
import { InvestorService } from '@/lib/services/investorService';
import { MentorService } from '@/lib/services/mentorService';
import { mockActivities, mockRecommendations } from '@/data/mockData';

export const revalidate = 0; // Server-Side Rendering (SSR) on every request

export default async function DashboardPage() {
  const founderService = new FounderService();
  const startupService = new StartupService();
  const investorService = new InvestorService();
  const mentorService = new MentorService();

  const [founders, startups, investors, mentors] = await Promise.all([
    founderService.getFounders(),
    startupService.getStartups(),
    investorService.getInvestors(),
    mentorService.getMentors(),
  ]);

  const stats = {
    foundersCount: founders.length,
    startupsCount: startups.length,
    investorsCount: investors.length,
    mentorsCount: mentors.length,
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="relative rounded-3xl bg-white border border-slate-200/90 p-8 sm:p-12 overflow-hidden card-shadow bg-hero-radial transition-all">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl -z-0 pointer-events-none animate-pulse" />
        <div className="absolute inset-0 bg-dot-grid opacity-30 -z-0 pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <Badge variant="blue" size="md" icon={<Sparkles className="w-3.5 h-3.5" />}>
            Graph Intelligence Engine Activated
          </Badge>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
            Discover Meaningful <br />
            <span className="bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-600 bg-clip-text text-transparent">
              Startup Connections
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
            ConnectSphere is a relationship-driven platform where founders, investors, mentors, startups, and skilled professionals connect to solve real business challenges, discover opportunities, share expertise, secure funding, find the right talent and resources, and collaborate to build the next generation of successful businesses.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/graph-explorer"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl shadow-md hover:shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2 group"
            >
              <GitMerge className="w-4 h-4 transition-transform group-hover:rotate-45" /> View Interactive Graph
            </Link>
            <Link
              href="/recommendations"
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-6 py-3 rounded-xl transition-colors flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-500" /> Explore Recommendations
            </Link>
          </div>
        </div>
      </section>

      {/* Statistics Cards Grid with Increased Height & Staggered Animations */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-ping" /> Statistics
          </h2>
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500" /> Live Platform Sync
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            title="Founders"
            value={stats.foundersCount}
            trend="+18% YoY"
            iconName="users"
            iconBgColor="bg-blue-50"
            iconColor="text-blue-600"
            delay={0.05}
          />
          <StatCard
            title="Startups"
            value={stats.startupsCount}
            trend="+24% YoY"
            iconName="building"
            iconBgColor="bg-emerald-50"
            iconColor="text-emerald-600"
            delay={0.1}
          />
          <StatCard
            title="Investors"
            value={stats.investorsCount}
            trend="VC & Angel"
            iconName="briefcase"
            iconBgColor="bg-purple-50"
            iconColor="text-purple-600"
            delay={0.15}
          />
          <StatCard
            title="Mentors"
            value={stats.mentorsCount}
            trend="Top 1% Experts"
            iconName="graduation"
            iconBgColor="bg-amber-50"
            iconColor="text-amber-600"
            delay={0.2}
          />
        </div>
      </section>

      {/* Recommendations & Activity Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500 animate-spin-slow" /> Graph Recommendation Engine
            </h2>
            <Link href="/recommendations" className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1">
              View All Matches <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {mockRecommendations.map((rec) => (
              <Card key={rec.id} className="flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow">
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <img src={rec.avatar} alt={rec.name} className="w-11 h-11 rounded-xl object-cover ring-2 ring-slate-100" />
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">{rec.name}</h3>
                        <p className="text-xs text-slate-500 line-clamp-1">{rec.title}</p>
                      </div>
                    </div>
                    <Badge variant="emerald" size="sm">{rec.matchScore}% Match</Badge>
                  </div>

                  <div className="mt-3 p-2.5 bg-blue-50/60 border border-blue-100 rounded-xl">
                    <span className="text-[11px] font-semibold text-blue-900 block">
                      Why Recommended:
                    </span>
                    <span className="text-xs text-blue-700">{rec.matchReason}</span>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-3">
                    {rec.tags.map((tag, i) => (
                      <Badge key={i} variant="slate" size="sm">{tag}</Badge>
                    ))}
                  </div>
                </div>

                <button className="w-full py-2 bg-slate-50 hover:bg-blue-600 hover:text-white text-slate-700 border border-slate-200 hover:border-blue-600 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5">
                  Connect Entity
                </button>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-600" /> Ecosystem Activity Stream
            </h2>
            <span className="text-xs text-slate-400">Live Feed</span>
          </div>

          <Card className="space-y-4">
            <div className="space-y-4">
              {mockActivities.map((act) => (
                <div key={act.id} className="flex items-start gap-3 pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                  <img src={act.avatar} alt="" className="w-8 h-8 rounded-lg object-cover shrink-0 mt-0.5" />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{act.entityName}</span>
                      <span className="text-[10px] text-slate-400">{act.timestamp}</span>
                    </div>
                    <p className="text-xs font-medium text-slate-800">{act.title}</p>
                    <p className="text-xs text-slate-500 leading-normal">{act.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
