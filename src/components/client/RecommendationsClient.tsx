'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Recommendation } from '@/types';
import { Sparkles, UserPlus, Info, Search, ShieldCheck, RefreshCw, X, AlertTriangle } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { SectionLoader } from '@/components/ui/SectionLoader';

interface RecommendationsClientProps {
  initialRecommendations: Recommendation[];
}

const QUICK_PROMPTS = [
  'AI Infrastructure & Series A Investors',
  'Frontend Architecture & Next.js Mentors',
  'Fintech & Payments Startups',
  'Rust & Systems Founders',
];

export const RecommendationsClient: React.FC<RecommendationsClientProps> = ({ initialRecommendations }) => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>(initialRecommendations);
  const [activeTab, setActiveTab] = useState<'All' | 'Investor' | 'Mentor' | 'Startup' | 'Founder'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchEngine, setSearchEngine] = useState<string | null>(null);
  const { toast } = useToast();

  const handleAiSearch = async (queryToSearch?: string) => {
    const targetQuery = queryToSearch !== undefined ? queryToSearch : searchQuery;
    
    // Prevent empty search unless resetting
    if (!targetQuery.trim() && queryToSearch === undefined) {
      setRecommendations(initialRecommendations);
      setSearchEngine(null);
      return;
    }

    setIsSearching(true);

    try {
      const res = await fetch('/api/recommendations/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: targetQuery,
          entityType: activeTab,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 429) {
          toast({
            title: 'Security Notice: Rate Limit Exceeded',
            description: data.error || 'Please wait a moment before running another AI search.',
            variant: 'error',
          });
        } else {
          toast({
            title: 'AI Search Error',
            description: data.error || 'Failed to complete AI search query.',
            variant: 'error',
          });
        }
        return;
      }

      setRecommendations(data.results || []);
      const engineLabel = data.engine === 'groq-llama-3.3-70b' 
        ? 'Groq Llama 3.3 LLM Engine' 
        : data.engine === 'gemini-1.5-flash-llm' 
        ? 'Gemini 1.5 LLM Engine' 
        : 'Vector Semantic AI Engine';
      setSearchEngine(engineLabel);

      toast({
        title: 'AI Search Complete',
        description: `Found ${data.results?.length || 0} matching entities via ${engineLabel}.`,
        variant: 'success',
      });
    } catch (err) {
      console.error('AI search failed', err);
      toast({
        title: 'Connection Error',
        description: 'Unable to reach AI search service.',
        variant: 'error',
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setRecommendations(initialRecommendations);
    setSearchEngine(null);
  };

  const handleQuickPromptClick = (promptText: string) => {
    setSearchQuery(promptText);
    handleAiSearch(promptText);
  };

  const filteredRecs = activeTab === 'All'
    ? recommendations
    : recommendations.filter((r) => r.entityType === activeTab);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Sparkles className="w-7 h-7 text-amber-500" /> Graph Match Engine
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            AI-driven recommendations based on natural language LLM queries, CognoDB graph proximity, & tech stack overlap.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="amber" size="lg" icon={<Sparkles className="w-4 h-4" />}>
            {searchEngine ? searchEngine : 'CognoDB Vector Score Active'}
          </Badge>
          <Badge variant="emerald" size="lg" icon={<ShieldCheck className="w-4 h-4 text-emerald-600" />}>
            Secured API
          </Badge>
        </div>
      </div>

      {/* ChatGPT-Style Smart AI Search Textarea Prompt Box */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 card-shadow space-y-3">
        <div className="flex items-center justify-between">
          <label htmlFor="ai-search-input" className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" /> Smart AI Match Engine
          </label>

          <span className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600 inline" /> Input Sanitized & Rate-Limited
          </span>
        </div>

        {/* ChatGPT Style Textarea Container */}
        <div className="relative rounded-2xl bg-slate-50/90 border border-slate-200 p-4 focus-within:ring-2 focus-within:ring-blue-500/30 focus-within:border-blue-600 focus-within:bg-white transition-all shadow-2xs">
          <textarea
            id="ai-search-input"
            rows={3}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleAiSearch();
              }
            }}
            placeholder="Ask AI: Describe who or what you are looking for (e.g. 'I am building a Next.js SaaS startup and need a Series A investor who focuses on AI infrastructure, plus an experienced mentor...'). Press Enter to search."
            className="w-full bg-transparent text-sm sm:text-base text-slate-900 placeholder-slate-400 focus:outline-none resize-none font-medium leading-relaxed"
          />

          {/* Bottom Action Controls inside Textarea Container */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 mt-2">
            <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
              <span className="inline-flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-[11px] font-semibold text-slate-600 shadow-2xs">
                <Sparkles className="w-3 h-3 text-amber-500" /> {searchEngine ? searchEngine : 'Groq Llama 3.3 / Gemini Active'}
              </span>
              <span className="hidden sm:inline-block text-[11px]">Press Enter ↵ to search</span>
            </div>

            <div className="flex items-center gap-2">
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="px-3 py-1.5 rounded-xl text-xs text-slate-500 hover:text-slate-700 hover:bg-slate-200/60 transition-colors flex items-center gap-1 font-semibold"
                  title="Clear Prompt"
                >
                  <X className="w-3.5 h-3.5" /> Clear
                </button>
              )}

              <button
                type="button"
                onClick={() => handleAiSearch()}
                disabled={isSearching}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg shadow-blue-500/25 transition-all flex items-center gap-2 text-xs"
              >
                {isSearching ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Thinking...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Search AI
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Quick Suggestion Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs font-semibold text-slate-400 mr-1">Suggested Prompts:</span>
          {QUICK_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleQuickPromptClick(prompt)}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 text-xs font-medium text-slate-600 transition-all cursor-pointer"
            >
              ✨ {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3 overflow-x-auto gap-4">
        <div className="flex items-center gap-2">
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

        <span className="text-xs text-slate-500 font-semibold whitespace-nowrap">
          {filteredRecs.length} Matches Found
        </span>
      </div>

      {/* Results Grid / Loading State */}
      {isSearching ? (
        <SectionLoader
          title="Executing AI Graph Search"
          subtitle="Processing query intent through secure LLM matching topology..."
        />
      ) : filteredRecs.length === 0 ? (
        <Card className="text-center py-12 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900">No matching entities found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your natural language search terms or click clear to reset all graph matches.
            </p>
          </div>
          <button
            onClick={handleClearSearch}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition-colors inline-flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Reset AI Matches
          </button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredRecs.map((rec) => (
            <Card key={rec.id} className="flex flex-col justify-between space-y-4 hover:border-blue-300 transition-all">
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
                  onClick={() => toast({ title: `Connection request sent to ${rec.name}`, description: 'CognoDB connection edge requested.', variant: 'success' })}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md transition-all flex items-center gap-1.5"
                >
                  <UserPlus className="w-3.5 h-3.5" /> Request Link
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
