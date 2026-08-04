'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UserPlus, Sparkles, Building2, MapPin, Briefcase, Award } from 'lucide-react';
import { Founder } from '@/types';

interface AddFounderDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (founderData: Partial<Founder>) => Promise<void>;
  editFounder?: Founder | null;
}

const DEFAULT_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
];

export const AddFounderDrawer: React.FC<AddFounderDrawerProps> = ({
  isOpen,
  onClose,
  onSave,
  editFounder,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    startupName: '',
    industry: 'Artificial Intelligence',
    location: '',
    bio: '',
    skills: '',
    experienceYears: '',
    avatar: '',
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editFounder) {
      setFormData({
        name: editFounder.name || '',
        title: editFounder.title || '',
        startupName: editFounder.startupName || '',
        industry: editFounder.industry || 'Artificial Intelligence',
        location: editFounder.location || '',
        bio: editFounder.bio || '',
        skills: editFounder.skills ? editFounder.skills.join(', ') : '',
        experienceYears: editFounder.experienceYears ? String(editFounder.experienceYears) : '',
        avatar: editFounder.avatar || '',
      });
    } else {
      setFormData({
        name: '',
        title: '',
        startupName: '',
        industry: 'Artificial Intelligence',
        location: '',
        bio: '',
        skills: '',
        experienceYears: '',
        avatar: '',
      });
    }
  }, [editFounder, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.startupName) return;

    try {
      setLoading(true);
      await onSave({
        ...formData,
        title: formData.title || 'Co-Founder & CEO',
        location: formData.location || 'San Francisco, CA',
        skills: formData.skills ? formData.skills.split(',').map((s) => s.trim()).filter(Boolean) : ['Product Strategy'],
        experienceYears: formData.experienceYears ? Number(formData.experienceYears) : 5,
        avatar: formData.avatar || DEFAULT_AVATARS[Math.floor(Math.random() * DEFAULT_AVATARS.length)],
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
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {editFounder ? 'Edit Founder Profile' : 'Create a new Founder'}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {editFounder ? 'Update founder details' : 'Enter founder information below'}
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
          <form id="founder-form" onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Elena Rostova"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5 text-slate-400" /> Title / Role
                </label>
                <input
                  type="text"
                  placeholder="e.g. Co-Founder & CEO"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" /> Startup Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. NeuralFlow AI"
                  value={formData.startupName}
                  onChange={(e) => setFormData({ ...formData, startupName: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Industry Vertical
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
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" /> Location
                </label>
                <input
                  type="text"
                  placeholder="e.g. San Francisco, CA"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Founder Bio
              </label>
              <textarea
                rows={3}
                placeholder="Brief founder background, research background, or previous ventures..."
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Key Skills (comma-separated)
              </label>
              <input
                type="text"
                placeholder="e.g. Product Strategy, LLM Architecture, Venture Fundraising"
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-slate-400" /> Experience (Years)
                </label>
                <input
                  type="number"
                  min={1}
                  max={40}
                  placeholder="e.g. 5"
                  value={formData.experienceYears}
                  onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Avatar Photo URL
                </label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.avatar}
                  onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
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
              form="founder-form"
              disabled={loading}
              className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  {editFounder ? 'Update Founder' : 'Create a new Founder'}
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
