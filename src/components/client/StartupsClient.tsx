'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Startup } from '@/types';
import { Search, Users, ArrowUpRight, Plus, Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { ProfileDrawer } from '@/components/ui/ProfileDrawer';
import { AddStartupDrawer } from '@/components/ui/AddStartupDrawer';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { useToast } from '@/components/ui/Toast';
import { clsx } from 'clsx';

interface StartupsClientProps {
  initialStartups: Startup[];
}

const ITEMS_PER_PAGE = 12;

export const StartupsClient: React.FC<StartupsClientProps> = ({ initialStartups }) => {
  const { toast } = useToast();
  const [startupsList, setStartupsList] = useState<Startup[]>(initialStartups);
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStartupId, setSelectedStartupId] = useState<string | null>(null);
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [editingStartup, setEditingStartup] = useState<Startup | null>(null);
  const [deletingStartup, setDeletingStartup] = useState<Startup | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const stages = ['All', 'Pre-Seed', 'Seed', 'Series A', 'Series B', 'Series C'];

  // Reset page to 1 on search or filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, stageFilter]);

  // Realtime in-searchbar filtering
  const filteredStartups = startupsList.filter((s) => {
    const matchesSearch =
      !searchQuery ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.pitch.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.techStack.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStage = !stageFilter || stageFilter === 'All' || s.fundingStage === stageFilter;

    return matchesSearch && matchesStage;
  });

  const totalPages = Math.ceil(filteredStartups.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedStartups = filteredStartups.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // CRUD Handler: Save / Update Startup
  const handleSaveStartup = async (formData: Partial<Startup>) => {
    try {
      if (editingStartup) {
        // Update existing startup
        const res = await fetch(`/api/startups/${editingStartup.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const json = await res.json();
        if (json.success) {
          setStartupsList((prev) =>
            prev.map((s) => (s.id === editingStartup.id ? { ...s, ...formData } : s))
          );
          toast({
            title: 'Startup Updated Successfully!',
            description: `${formData.name}'s node properties updated in CognoDB.`,
            variant: 'success',
          });
        } else {
          throw new Error(json.error?.message || 'Failed to update startup.');
        }
      } else {
        // Create new startup
        const newStartup: Startup = {
          id: `stp-${Date.now()}`,
          name: formData.name || 'New Startup',
          logo: formData.logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
          pitch: formData.pitch || 'Building next-generation graph AI software.',
          industry: formData.industry || 'Artificial Intelligence',
          fundingStage: formData.fundingStage || 'Seed',
          teamSize: Number(formData.teamSize || 12),
          valuation: formData.valuation || '$20M',
          totalFunding: formData.totalFunding || '$4.0M',
          techStack: formData.techStack || ['Next.js 15', 'TypeScript', 'CognoDB'],
          founderIds: ['fnd-1'],
          founderNames: ['Elena Rostova'],
          investorNames: ['Apex Ventures'],
          website: 'https://connectsphere.ai',
          foundedYear: 2024,
        };

        const res = await fetch('/api/startups', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newStartup),
        });

        const json = await res.json();
        if (json.success) {
          setStartupsList((prev) => [newStartup, ...prev]);
          toast({
            title: 'Startup Created Successfully!',
            description: `${newStartup.name} added to ecosystem graph topology.`,
            variant: 'success',
          });
        } else {
          throw new Error(json.error?.message || 'Failed to create startup node.');
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

  // CRUD Handler: Delete Startup Confirm
  const handleConfirmDelete = async () => {
    if (!deletingStartup) return;

    try {
      setIsDeleting(true);
      const res = await fetch(`/api/startups/${deletingStartup.id}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (json.success) {
        setStartupsList((prev) => prev.filter((s) => s.id !== deletingStartup.id));
        toast({
          title: 'Startup Deleted Successfully!',
          description: `${deletingStartup.name} detached from graph topology.`,
          variant: 'success',
        });
      } else {
        throw new Error(json.error?.message || 'Failed to delete startup node.');
      }
    } catch (err: unknown) {
      toast({
        title: 'Deletion Failed',
        description: err instanceof Error ? err.message : 'Unable to detach node.',
        variant: 'error',
      });
    } finally {
      setIsDeleting(false);
      setDeletingStartup(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Startups Directory</h1>
          <p className="text-sm text-slate-500 mt-1">
            Connecting {filteredStartups.length} venture-backed startups via tech stack & investment graph links.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-200/60 shadow-2xs">
            {filteredStartups.length} Startups Active
          </span>

          <button
            onClick={() => {
              setEditingStartup(null);
              setIsAddDrawerOpen(true);
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5 active:scale-95"
          >
            <Plus className="w-4 h-4" /> Add Startup
          </button>
        </div>
      </div>

      {/* Realtime Search & Stage Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search startup name, pitch, or tech stack..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none shadow-2xs"
          >
            {stages.map((stg) => (
              <option key={stg} value={stg}>
                {stg === 'All' ? 'All Stages' : `${stg} Stage`}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Startup Grid Cards (12 per page) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedStartups.map((s) => (
          <Card key={s.id} className="flex flex-col justify-between space-y-4 relative group/card">
            <div>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <img
                    src={s.logo}
                    alt={s.name}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-100 shadow-sm shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-slate-900 truncate">{s.name}</h3>
                    <p className="text-xs text-slate-500 truncate">{s.industry}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <Badge variant="emerald" size="sm">{s.fundingStage}</Badge>

                  {/* Edit / Delete Quick Action Buttons */}
                  <div className="flex items-center gap-1 opacity-0 group-hover/card:opacity-100 transition-opacity ml-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingStartup(s);
                        setIsAddDrawerOpen(true);
                      }}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-500 transition-colors"
                      title="Edit Startup"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeletingStartup(s);
                      }}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-500 transition-colors"
                      title="Delete Startup"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">{s.pitch}</p>

              <div className="grid grid-cols-2 gap-2 mt-4 p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">VALUATION</span>
                  <span className="font-bold text-slate-900">{s.valuation}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">TOTAL FUNDING</span>
                  <span className="font-bold text-emerald-600">{s.totalFunding}</span>
                </div>
              </div>

              <div className="mt-3.5 space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Tech Stack</span>
                <div className="flex flex-wrap gap-1">
                  {s.techStack.map((tech, i) => (
                    <Badge key={i} variant="blue" size="sm">{tech}</Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-slate-400" /> {s.teamSize} team members
              </span>

              <button
                onClick={() => setSelectedStartupId(s.id)}
                className="px-3.5 py-1.5 bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-700 rounded-xl text-xs font-semibold transition-all flex items-center gap-1"
              >
                View Details <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </Card>
        ))}
      </div>

      {/* Pagination Controls Bar */}
      {filteredStartups.length > 0 && (
        <div className="pt-4 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs font-medium text-slate-500">
            Showing <span className="font-bold text-slate-900">{startIndex + 1}</span> to{' '}
            <span className="font-bold text-slate-900">
              {Math.min(startIndex + ITEMS_PER_PAGE, filteredStartups.length)}
            </span>{' '}
            of <span className="font-bold text-slate-900">{filteredStartups.length}</span> startups
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
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
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

      {/* Add / Edit Startup Form Drawer */}
      <AddStartupDrawer
        isOpen={isAddDrawerOpen}
        onClose={() => setIsAddDrawerOpen(false)}
        onSave={handleSaveStartup}
        editStartup={editingStartup}
      />

      {/* Delete Confirmation Custom Modal */}
      <ConfirmModal
        isOpen={!!deletingStartup}
        title="Delete Startup Node"
        message={`Are you sure you want to delete ${deletingStartup?.name} from graph topology?`}
        confirmText="Delete Startup"
        cancelText="Cancel"
        loading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingStartup(null)}
      />

      {/* Startup Profile Details Drawer */}
      <ProfileDrawer
        isOpen={!!selectedStartupId}
        onClose={() => setSelectedStartupId(null)}
        entityType="Startup"
        entityId={selectedStartupId}
      />
    </div>
  );
};
