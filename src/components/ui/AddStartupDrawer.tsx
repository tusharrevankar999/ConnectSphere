'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Building2, Sparkles, Layers, DollarSign, Users, Cpu } from 'lucide-react';
import { Startup, FundingStage } from '@/types';

interface AddStartupDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (startupData: Partial<Startup>) => Promise<void>;
  editStartup?: Startup | null;
}

const DEFAULT_LOGOS = [
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=150&auto=format&fit=crop&q=80',
];

export const AddStartupDrawer: React.FC<AddStartupDrawerProps> = ({
  isOpen,
  onClose,
  onSave,
  editStartup,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    industry: 'Artificial Intelligence',
    fundingStage: 'Seed',
    pitch: '',
    valuation: '',
    totalFunding: '',
    teamSize: '',
    techStack: '',
    logo: '',
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editStartup) {
      setFormData({
        name: editStartup.name || '',
        industry: editStartup.industry || 'Artificial Intelligence',
        fundingStage: editStartup.fundingStage || 'Seed',
        pitch: editStartup.pitch || '',
        valuation: editStartup.valuation || '',
        totalFunding: editStartup.totalFunding || '',
        teamSize: editStartup.teamSize ? String(editStartup.teamSize) : '',
        techStack: editStartup.techStack ? editStartup.techStack.join(', ') : '',
        logo: editStartup.logo || '',
      });
    } else {
      setFormData({
        name: '',
        industry: 'Artificial Intelligence',
        fundingStage: 'Seed',
        pitch: '',
        valuation: '',
        totalFunding: '',
        teamSize: '',
        techStack: '',
        logo: '',
      });
    }
  }, [editStartup, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    try {
      setLoading(true);
      await onSave({
        ...formData,
        fundingStage: formData.fundingStage as FundingStage,
        valuation: formData.valuation || '$15M',
        totalFunding: formData.totalFunding || '$3.5M',
        teamSize: formData.teamSize ? Number(formData.teamSize) : 10,
        techStack: formData.techStack
          ? formData.techStack.split(',').map((s) => s.trim()).filter(Boolean)
          : ['Next.js 15', 'TypeScript'],
        logo: formData.logo || DEFAULT_LOGOS[Math.floor(Math.random() * DEFAULT_LOGOS.length)],
      });
      onClose();
    } catch {
      // Handled by parent
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between"
        >
          {/* Drawer Header */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {editStartup ? 'Edit Startup Profile' : 'Create a new Startup'}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {editStartup ? 'Update startup details' : 'Enter startup information below'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body Form */}
          <form id="startup-form" onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Startup Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. NeuralFlow AI"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-slate-400" /> Industry Vertical
                </label>
                <select
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none"
                >
                  <option value="Artificial Intelligence">Artificial Intelligence</option>
                  <option value="Fintech & Payments">Fintech & Payments</option>
                  <option value="HealthTech & Bio">HealthTech & Bio</option>
                  <option value="DevTools & SaaS">DevTools & SaaS</option>
                  <option value="CleanTech & Energy">CleanTech & Energy</option>
                  <option value="Cybersecurity">Cybersecurity</option>
                  <option value="EdTech & Learning">EdTech & Learning</option>
                  <option value="Supply Chain & Logistics">Supply Chain & Logistics</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Funding Stage
                </label>
                <select
                  value={formData.fundingStage}
                  onChange={(e) => setFormData({ ...formData, fundingStage: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none"
                >
                  <option value="Pre-Seed">Pre-Seed</option>
                  <option value="Seed">Seed</option>
                  <option value="Series A">Series A</option>
                  <option value="Series B">Series B</option>
                  <option value="Series C">Series C</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Startup Pitch / Summary
              </label>
              <textarea
                rows={3}
                placeholder="Autonomous AI multi-agent platform for enterprise software automation..."
                value={formData.pitch}
                onChange={(e) => setFormData({ ...formData, pitch: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5 text-slate-400" /> Valuation
                </label>
                <input
                  type="text"
                  placeholder="e.g. $25M"
                  value={formData.valuation}
                  onChange={(e) => setFormData({ ...formData, valuation: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5 text-slate-400" /> Total Funding
                </label>
                <input
                  type="text"
                  placeholder="e.g. $4.2M"
                  value={formData.totalFunding}
                  onChange={(e) => setFormData({ ...formData, totalFunding: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-slate-400" /> Team Size
                </label>
                <input
                  type="number"
                  min={1}
                  max={500}
                  placeholder="e.g. 14"
                  value={formData.teamSize}
                  onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Logo Photo URL
                </label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.logo}
                  onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-700 focus:outline-none"
                />
              </div>
            </div>
          </form>


          {/* Drawer Footer Actions */}
          <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-xl text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="startup-form"
              disabled={loading}
              className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
            >

              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  {editStartup ? 'Update Startup' : 'Create a new Startup'}
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
