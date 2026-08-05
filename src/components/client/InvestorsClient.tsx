'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Investor } from '@/types';
import { Search, ArrowUpRight, Plus, Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { ProfileDrawer } from '@/components/ui/ProfileDrawer';
import { AddInvestorDrawer } from '@/components/ui/AddInvestorDrawer';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { useToast } from '@/components/ui/Toast';
import { useRouter, useSearchParams } from 'next/navigation';
import { clsx } from 'clsx';

interface InvestorsClientProps {
  initialInvestors: Investor[];
}

const ITEMS_PER_PAGE = 12;

export const InvestorsClient: React.FC<InvestorsClientProps> = ({ initialInvestors }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [investorsList, setInvestorsList] = useState<Investor[]>(initialInvestors);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedInvestorId, setSelectedInvestorId] = useState<string | null>(null);
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [editingInvestor, setEditingInvestor] = useState<Investor | null>(null);
  const [deletingInvestor, setDeletingInvestor] = useState<Investor | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Reset page to 1 on search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Real-time search filter
  const filteredInvestors = investorsList.filter((inv) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      inv.name.toLowerCase().includes(q) ||
      inv.firm.toLowerCase().includes(q) ||
      inv.role.toLowerCase().includes(q) ||
      (inv.focusIndustries && inv.focusIndustries.some((ind) => ind.toLowerCase().includes(q))) ||
      (inv.recentInvestments && inv.recentInvestments.some((rec) => rec.toLowerCase().includes(q))) ||
      (inv.bio && inv.bio.toLowerCase().includes(q))
    );
  });

  const totalPages = Math.ceil(filteredInvestors.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedInvestors = filteredInvestors.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // CRUD Handler: Create or Update Investor
  const handleSaveInvestor = async (formData: Partial<Investor>) => {
    try {
      if (editingInvestor) {
        // Update existing investor
        const res = await fetch(`/api/investors/${editingInvestor.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const json = await res.json();
        if (json.success) {
          setInvestorsList((prev) =>
            prev.map((i) => (i.id === editingInvestor.id ? { ...i, ...formData } : i))
          );
          toast({
            title: 'Investor Updated Successfully!',
            description: `${formData.name}'s investor profile updated in CognoDB.`,
            variant: 'success',
          });
        } else {
          throw new Error(json.error?.message || 'Failed to update investor.');
        }
      } else {
        // Create new investor
        const newInvestor: Investor = {
          id: `inv-${Date.now()}`,
          name: formData.name || 'New Investor',
          photo: formData.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          firm: formData.firm || 'Apex Ventures',
          role: formData.role || 'General Partner',
          focusIndustries: formData.focusIndustries || ['Artificial Intelligence', 'Fintech & Payments'],
          portfolioCount: Number(formData.portfolioCount || 10),
          recentInvestments: formData.recentInvestments || ['NeuralFlow AI', 'CyberShield'],
          ticketSize: formData.ticketSize || '$500K - $2M',
          totalDeals: Number(formData.totalDeals || 15),
          bio: formData.bio || 'Investing in early-stage category-defining startup companies.',
        };

        const res = await fetch('/api/investors', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newInvestor),
        });

        const json = await res.json();
        if (json.success) {
          setInvestorsList((prev) => [newInvestor, ...prev]);
          toast({
            title: 'Investor Created Successfully!',
            description: `${newInvestor.name} added to ecosystem directory.`,
            variant: 'success',
          });
        } else {
          throw new Error(json.error?.message || 'Failed to create investor profile.');
        }
      }
    } catch (err: unknown) {
      toast({
        title: 'Operation Failed',
        description: err instanceof Error ? err.message : 'Error processing request.',
        variant: 'error',
      });
    }
  };

  // CRUD Handler: Confirm Delete Investor
  const handleConfirmDelete = async () => {
    if (!deletingInvestor) return;

    try {
      setIsDeleting(true);
      const res = await fetch(`/api/investors/${deletingInvestor.id}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (json.success) {
        setInvestorsList((prev) => prev.filter((i) => i.id !== deletingInvestor.id));
        toast({
          title: 'Investor Deleted Successfully!',
          description: `${deletingInvestor.name} removed from ecosystem directory.`,
          variant: 'success',
        });
      } else {
        throw new Error(json.error?.message || 'Failed to delete investor.');
      }
    } catch (err: unknown) {
      toast({
        title: 'Deletion Failed',
        description: err instanceof Error ? err.message : 'Unable to remove investor.',
        variant: 'error',
      });
    } finally {
      setIsDeleting(false);
      setDeletingInvestor(null);
    }
  };


  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Investors Directory</h1>
          <p className="text-sm text-slate-500 mt-1">
            Connecting {filteredInvestors.length} top venture capital firms & angel investors mapped to target startups.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 border border-purple-200/60 shadow-2xs">
            {filteredInvestors.length} VCs & Angels
          </span>

          <button
            onClick={() => {
              setEditingInvestor(null);
              setIsAddDrawerOpen(true);
            }}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-purple-500/20 transition-all flex items-center gap-1.5 active:scale-95"
          >
            <Plus className="w-4 h-4" /> Add Investor
          </button>
        </div>
      </div>

      {/* Real-time Search Input Toolbar */}
      <div className="relative max-w-md w-full">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          placeholder="Search investor, VC firm, role, or sector..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 shadow-2xs"
        />
      </div>

      {/* Investor Grid Cards (12 per page) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedInvestors.map((inv) => (
          <Card key={inv.id} className="flex flex-col justify-between space-y-4 relative group/card">
            <div>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  <img
                    src={inv.photo}
                    alt={inv.name}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-100 shadow-sm shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-slate-900 truncate">{inv.name}</h3>
                    <p className="text-xs font-semibold text-purple-600 truncate">{inv.firm}</p>
                    <p className="text-xs text-slate-500 font-medium truncate">{inv.role}</p>
                  </div>
                </div>

                {/* Edit / Delete Quick Actions */}
                <div className="flex items-center gap-1 opacity-0 group-hover/card:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingInvestor(inv);
                      setIsAddDrawerOpen(true);
                    }}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-purple-50 hover:text-purple-600 text-slate-500 transition-colors"
                    title="Edit Investor"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeletingInvestor(inv);
                    }}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-500 transition-colors"
                    title="Delete Investor"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
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
                    <Badge key={i} variant="cyan" size="sm">
                      {ind}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="mt-3 space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Recent Investments</span>
                <div className="flex flex-wrap gap-1">
                  {inv.recentInvestments.map((rec, i) => (
                    <Badge key={i} variant="emerald" size="sm">
                      {rec}
                    </Badge>
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

      {/* Pagination Controls Bar */}
      {filteredInvestors.length > 0 && (
        <div className="pt-4 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs font-medium text-slate-500">
            Showing <span className="font-bold text-slate-900">{startIndex + 1}</span> to{' '}
            <span className="font-bold text-slate-900">
              {Math.min(startIndex + ITEMS_PER_PAGE, filteredInvestors.length)}
            </span>{' '}
            of <span className="font-bold text-slate-900">{filteredInvestors.length}</span> investors
          </div>

          {totalPages > 1 && (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                title="Previous Page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                <button
                  key={pg}
                  onClick={() => setCurrentPage(pg)}
                  className={clsx(
                    'w-9 h-9 rounded-xl text-xs font-bold transition-all',
                    currentPage === pg
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                  )}
                >
                  {pg}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                title="Next Page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Slide-Over Drawer for Adding / Editing Investor */}
      <AddInvestorDrawer
        isOpen={isAddDrawerOpen}
        onClose={() => setIsAddDrawerOpen(false)}
        onSave={handleSaveInvestor}
        editInvestor={editingInvestor}
      />

      {/* Custom Modal for Confirming Deletion */}
      <ConfirmModal
        isOpen={!!deletingInvestor}
        title="Delete Investor"
        message={`Are you sure you want to delete ${deletingInvestor?.name} (${deletingInvestor?.firm}) from ecosystem directory?`}
        confirmText="Delete Investor"

        cancelText="Cancel"
        loading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingInvestor(null)}
      />

      {/* Profile Details Drawer */}
      <ProfileDrawer
        isOpen={!!selectedInvestorId}
        onClose={() => setSelectedInvestorId(null)}
        entityType="Investor"
        entityId={selectedInvestorId}
      />
    </div>
  );
};
