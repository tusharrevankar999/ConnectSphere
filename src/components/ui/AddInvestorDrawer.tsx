'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UserPlus, Sparkles, Building2, Briefcase, DollarSign, Layers, Award } from 'lucide-react';
import { Investor } from '@/types';

interface AddInvestorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (investorData: Partial<Investor>) => Promise<void>;
  editInvestor?: Investor | null;
}

const DEFAULT_PHOTOS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
];

export const AddInvestorDrawer: React.FC<AddInvestorDrawerProps> = ({
  isOpen,
  onClose,
  onSave,
  editInvestor,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    firm: '',
    role: '',
    ticketSize: '',
    focusIndustries: '',
    portfolioCount: '',
    totalDeals: '',
    recentInvestments: '',
    bio: '',
    photo: '',
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editInvestor) {
      setFormData({
        name: editInvestor.name || '',
        firm: editInvestor.firm || '',
        role: editInvestor.role || '',
        ticketSize: editInvestor.ticketSize || '',
        focusIndustries: editInvestor.focusIndustries ? editInvestor.focusIndustries.join(', ') : '',
        portfolioCount: editInvestor.portfolioCount ? String(editInvestor.portfolioCount) : '',
        totalDeals: editInvestor.totalDeals ? String(editInvestor.totalDeals) : '',
        recentInvestments: editInvestor.recentInvestments ? editInvestor.recentInvestments.join(', ') : '',
        bio: editInvestor.bio || '',
        photo: editInvestor.photo || '',
      });
    } else {
      setFormData({
        name: '',
        firm: '',
        role: '',
        ticketSize: '',
        focusIndustries: '',
        portfolioCount: '',
        totalDeals: '',
        recentInvestments: '',
        bio: '',
        photo: '',
      });
    }
  }, [editInvestor, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.firm) return;

    try {
      setLoading(true);
      await onSave({
        ...formData,
        role: formData.role || 'General Partner',
        ticketSize: formData.ticketSize || '$500K - $2M',
        focusIndustries: formData.focusIndustries
          ? formData.focusIndustries.split(',').map((s) => s.trim()).filter(Boolean)
          : ['Artificial Intelligence', 'Fintech & Payments'],
        portfolioCount: formData.portfolioCount ? Number(formData.portfolioCount) : 12,
        totalDeals: formData.totalDeals ? Number(formData.totalDeals) : 18,
        recentInvestments: formData.recentInvestments
          ? formData.recentInvestments.split(',').map((s) => s.trim()).filter(Boolean)
          : ['NeuralFlow AI', 'CyberShield'],
        bio: formData.bio || 'Investing in early-stage category-defining technology companies.',
        photo: formData.photo || DEFAULT_PHOTOS[Math.floor(Math.random() * DEFAULT_PHOTOS.length)],
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
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-purple-50/40">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center border border-purple-200/60">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {editInvestor ? 'Edit Investor Profile' : 'Add New Investor Node'}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {editInvestor ? 'Update VC or Angel node details' : 'Enter VC firm or Angel investor details below'}
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
          <form id="investor-form" onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Investor Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Sarah Jenkins"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" /> VC Firm / Organization *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Ventures"
                  value={formData.firm}
                  onChange={(e) => setFormData({ ...formData, firm: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5 text-slate-400" /> Role / Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. General Partner"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5 text-slate-400" /> Ticket / Check Size
                </label>
                <input
                  type="text"
                  placeholder="e.g. $500K - $2.5M"
                  value={formData.ticketSize}
                  onChange={(e) => setFormData({ ...formData, ticketSize: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-slate-400" /> Portfolio Count
                </label>
                <input
                  type="number"
                  min={0}
                  placeholder="e.g. 14"
                  value={formData.portfolioCount}
                  onChange={(e) => setFormData({ ...formData, portfolioCount: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Focus Industries (comma-separated)
              </label>
              <input
                type="text"
                placeholder="e.g. Artificial Intelligence, Fintech & Payments, DevTools & SaaS"
                value={formData.focusIndustries}
                onChange={(e) => setFormData({ ...formData, focusIndustries: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Recent Investments (comma-separated startup names)
              </label>
              <input
                type="text"
                placeholder="e.g. NeuralFlow AI, QuantumPay, BioHealth"
                value={formData.recentInvestments}
                onChange={(e) => setFormData({ ...formData, recentInvestments: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Investor Bio / Investment Thesis
              </label>
              <textarea
                rows={3}
                placeholder="Brief investor background, focus thesis, or firm mandate..."
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-slate-400" /> Total Deals Executed
                </label>
                <input
                  type="number"
                  min={0}
                  placeholder="e.g. 25"
                  value={formData.totalDeals}
                  onChange={(e) => setFormData({ ...formData, totalDeals: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Photo URL
                </label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.photo}
                  onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
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
              form="investor-form"
              disabled={loading}
              className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-purple-500/20 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  {editInvestor ? 'Update Investor' : 'Create Investor Node'}
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
