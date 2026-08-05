'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FolderPlus, Sparkles, Building2, Mail, MapPin, Phone } from 'lucide-react';
import { Resource } from '@/types';

interface AddResourceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (resourceData: Partial<Resource>) => Promise<void>;
  editResource?: Resource | null;
}

const DEFAULT_AVATARS = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
];

export const AddResourceDrawer: React.FC<AddResourceDrawerProps> = ({
  isOpen,
  onClose,
  onSave,
  editResource,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    providerName: '',
    providerRole: '',
    contactEmail: '',
    contactPhone: '',
    location: '',
    skills: '',
    availability: 'Available Now' as 'Available Now' | 'In Progress' | 'Limited Slots' | 'Booked',
    description: '',
    avatar: '',
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editResource) {
      setFormData({
        title: editResource.title || '',
        category: editResource.category || '',
        providerName: editResource.providerName || '',
        providerRole: editResource.providerRole || '',
        contactEmail: editResource.contactEmail || '',
        contactPhone: editResource.contactPhone || '',
        location: editResource.location || '',
        skills: editResource.skills ? editResource.skills.join(', ') : '',
        availability: editResource.availability || 'Available Now',
        description: editResource.description || '',
        avatar: editResource.avatar || '',
      });
    } else {
      setFormData({
        title: '',
        category: '',
        providerName: '',
        providerRole: '',
        contactEmail: '',
        contactPhone: '',
        location: '',
        skills: '',
        availability: 'Available Now',
        description: '',
        avatar: '',
      });
    }
  }, [editResource, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.providerName) return;

    try {
      setLoading(true);
      await onSave({
        ...formData,
        category: formData.category || 'General Resource',
        providerRole: formData.providerRole || 'Resource Lead',
        contactEmail: formData.contactEmail || 'contact@ecosystem-resources.io',
        location: formData.location || 'San Francisco, CA',
        skills: formData.skills ? formData.skills.split(',').map((s) => s.trim()).filter(Boolean) : ['Architecture', 'Product Strategy'],
        avatar: formData.avatar || DEFAULT_AVATARS[Math.floor(Math.random() * DEFAULT_AVATARS.length)],
        rating: editResource?.rating || 4.95,
      });
      onClose();
    } catch {
      // Handled by parent component
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
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-emerald-50/40">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center border border-emerald-200/60">
                <FolderPlus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {editResource ? 'Edit Resource Details' : 'Add New Resource'}
                </h3>

                <p className="text-xs text-slate-500 font-medium">
                  {editResource ? 'Update resource talent, skill, or service details' : 'Add any resource talent, role, or skill profile'}
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
          <form id="resource-form" onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Resource Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Senior B2B Outbound Specialist"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Category / Specialty *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Accounts Manager, Business Development Executive, Manager, HR executive, Designer, Video Editor"

                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>


            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" /> Provider Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. David Vance"
                  value={formData.providerName}
                  onChange={(e) => setFormData({ ...formData, providerName: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Provider Role / Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Lead AI Architect"
                  value={formData.providerRole}
                  onChange={(e) => setFormData({ ...formData, providerRole: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" /> Contact Email *
                </label>
                <input
                  type="email"
                  required
                  placeholder="david@ai-resources.io"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" /> Phone / Profile Link
                </label>
                <input
                  type="text"
                  placeholder="+1 (415) 890-1234"
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" /> Location
                </label>
                <input
                  type="text"
                  placeholder="e.g. San Francisco, CA"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Availability State
                </label>
                <select
                  value={formData.availability}
                  onChange={(e) => setFormData({ ...formData, availability: e.target.value as 'Available Now' | 'In Progress' | 'Limited Slots' | 'Booked' })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none"
                >
                  <option value="Available Now">Available Now</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Limited Slots">Limited Slots</option>
                  <option value="Booked">Booked</option>
                </select>

              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Skills & Technologies (comma-separated)
              </label>
              <input
                type="text"
                placeholder="e.g. Next.js 15, TypeScript, PyTorch, Vector DB"
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Description / Scope of Work
              </label>
              <textarea
                rows={3}
                placeholder="Detailed resource capabilities, project deliverables, or consulting scope..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Photo / Avatar URL
              </label>
              <input
                type="text"
                placeholder="https://images.unsplash.com/..."
                value={formData.avatar}
                onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
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
              form="resource-form"
              disabled={loading}
              className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  {editResource ? 'Update Resource' : 'Create Resource'}
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
