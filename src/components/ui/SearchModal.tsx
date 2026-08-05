'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Users, Building2, Briefcase, Cpu, ArrowRight } from 'lucide-react';
import { mockFounders, mockStartups, mockInvestors, mockMentors, mockTechnologies } from '@/data/mockData';
import { Badge } from './Badge';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectEntity: (type: string, id: string, name: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onSelectEntity }) => {
  const [query, setQuery] = useState('');
  const [recentSearches] = useState(['NeuralFlow AI', 'Sequoia Capital', 'Guillermo Rauch', 'Next.js 15']);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredFounders = query
    ? mockFounders.filter((f) => f.name.toLowerCase().includes(query.toLowerCase()) || f.startupName.toLowerCase().includes(query.toLowerCase()))
    : [];
  const filteredStartups = query
    ? mockStartups.filter((s) => s.name.toLowerCase().includes(query.toLowerCase()) || s.industry.toLowerCase().includes(query.toLowerCase()))
    : [];
  const filteredInvestors = query
    ? mockInvestors.filter((i) => i.name.toLowerCase().includes(query.toLowerCase()) || i.firm.toLowerCase().includes(query.toLowerCase()))
    : [];
  const filteredMentors = query
    ? mockMentors.filter((m) => m.name.toLowerCase().includes(query.toLowerCase()) || m.company.toLowerCase().includes(query.toLowerCase()))
    : [];
  const filteredTech = query
    ? mockTechnologies.filter((t) => t.name.toLowerCase().includes(query.toLowerCase()) || t.category.toLowerCase().includes(query.toLowerCase()))
    : [];

  const totalResults = filteredFounders.length + filteredStartups.length + filteredInvestors.length + filteredMentors.length + filteredTech.length;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-900/40 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[80vh]"
        >
          {/* Header Input */}
          <div className="p-4 border-b border-slate-100 flex items-center gap-3">
            <Search className="w-5 h-5 text-slate-400 shrink-0" />
            <input
              type="text"
              autoFocus
              placeholder="Search founders, startups, investors, technologies... (⌘K)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full text-base font-medium text-slate-900 placeholder:text-slate-400 bg-transparent outline-none"
            />
            {query ? (
              <button onClick={() => setQuery('')} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            ) : (
              <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-xs font-semibold text-slate-400 bg-slate-100 border border-slate-200 rounded-md">
                ESC
              </kbd>
            )}
          </div>

          {/* Body Content */}
          <div className="overflow-y-auto p-4 space-y-6 flex-1">
            {!query && (
              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Recent Searches</h4>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((term, i) => (
                    <button
                      key={i}
                      onClick={() => setQuery(term)}
                      className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors flex items-center gap-1.5"
                    >
                      <Search className="w-3.5 h-3.5 text-slate-400" />
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {query && totalResults === 0 && (
              <div className="py-12 text-center">
                <Search className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-medium text-slate-600">No graph entities found for &quot;{query}&quot;</p>
                <p className="text-xs text-slate-400 mt-1">Try searching for &quot;Next.js&quot;, &quot;AI&quot;, &quot;Sequoia&quot;, or &quot;Alex&quot;</p>
              </div>
            )}

            {/* Results groups */}
            {filteredStartups.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  <Building2 className="w-3.5 h-3.5" /> Startups ({filteredStartups.length})
                </div>
                <div className="space-y-1">
                  {filteredStartups.map((s) => (
                    <div
                      key={s.id}
                      onClick={() => { onSelectEntity('Startup', s.id, s.name); onClose(); }}
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <img src={s.logo} alt={s.name} className="w-8 h-8 rounded-lg object-cover" />
                        <div>
                          <div className="text-sm font-semibold text-slate-900">{s.name}</div>
                          <div className="text-xs text-slate-500">{s.pitch}</div>
                        </div>
                      </div>
                      <Badge variant="emerald" size="sm">{s.fundingStage}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {filteredFounders.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  <Users className="w-3.5 h-3.5" /> Founders ({filteredFounders.length})
                </div>
                <div className="space-y-1">
                  {filteredFounders.map((f) => (
                    <div
                      key={f.id}
                      onClick={() => { onSelectEntity('Founder', f.id, f.name); onClose(); }}
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <img src={f.avatar} alt={f.name} className="w-8 h-8 rounded-full object-cover" />
                        <div>
                          <div className="text-sm font-semibold text-slate-900">{f.name}</div>
                          <div className="text-xs text-slate-500">{f.title} • {f.startupName}</div>
                        </div>
                      </div>
                      <Badge variant="blue" size="sm">{f.industry}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {filteredInvestors.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  <Briefcase className="w-3.5 h-3.5" /> Investors ({filteredInvestors.length})
                </div>
                <div className="space-y-1">
                  {filteredInvestors.map((inv) => (
                    <div
                      key={inv.id}
                      onClick={() => { onSelectEntity('Investor', inv.id, inv.name); onClose(); }}
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <img src={inv.photo} alt={inv.name} className="w-8 h-8 rounded-full object-cover" />
                        <div>
                          <div className="text-sm font-semibold text-slate-900">{inv.name}</div>
                          <div className="text-xs text-slate-500">{inv.firm} • {inv.role}</div>
                        </div>
                      </div>
                      <Badge variant="purple" size="sm">{inv.ticketSize}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {filteredTech.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  <Cpu className="w-3.5 h-3.5" /> Technologies ({filteredTech.length})
                </div>
                <div className="space-y-1">
                  {filteredTech.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => { onSelectEntity('Technology', t.id, t.name); onClose(); }}
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-pink-50 text-pink-600 flex items-center justify-center font-bold text-xs">
                          {t.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-slate-900">{t.name}</div>
                          <div className="text-xs text-slate-500">{t.category} • {t.startupCount} Startups</div>
                        </div>
                      </div>
                      <Badge variant="pink" size="sm">{t.adoptionTrend}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer Bar */}
          <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              CognoDB Graph Index: 78 Items Active

            </div>
            <div className="flex items-center gap-1 font-medium text-blue-600">
              Press Enter to view graph <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
