'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Founder } from '@/types';
import { Search, MapPin, Users, ArrowUpRight, Filter, UserPlus, Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { ProfileDrawer } from '@/components/ui/ProfileDrawer';
import { AddFounderDrawer } from '@/components/ui/AddFounderDrawer';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { useToast } from '@/components/ui/Toast';
import { useRouter, useSearchParams } from 'next/navigation';
import { clsx } from 'clsx';

interface FoundersClientProps {
  initialFounders: Founder[];
}

const ITEMS_PER_PAGE = 12;

export const FoundersClient: React.FC<FoundersClientProps> = ({ initialFounders }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [foundersList, setFoundersList] = useState<Founder[]>(initialFounders);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFounderId, setSelectedFounderId] = useState<string | null>(null);
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [editingFounder, setEditingFounder] = useState<Founder | null>(null);
  const [deletingFounder, setDeletingFounder] = useState<Founder | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const selectedIndustry = searchParams.get('industry') || 'All';

  const industries = [
    'All',
    'Artificial Intelligence',
    'Fintech & Payments',
    'HealthTech & Bio',
    'DevTools & SaaS',
    'CleanTech & Energy',
    'Cybersecurity',
    'EdTech & Learning',
    'Supply Chain & Logistics',
  ];

  // Reset page to 1 on filter or search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedIndustry]);

  // Realtime instant search filtering inside searchbar state
  const filteredFounders = foundersList.filter((f) => {
    const matchesSearch =
      !searchQuery ||
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.startupName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (f.skills && f.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())));

    const matchesIndustry =
      !selectedIndustry || selectedIndustry === 'All' || f.industry === selectedIndustry;

    return matchesSearch && matchesIndustry;
  });

  const totalPages = Math.ceil(filteredFounders.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedFounders = filteredFounders.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleIndustryChange = (val: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (val && val !== 'All') params.set('industry', val);
    else params.delete('industry');
    router.replace(`/founders?${params.toString()}`);
  };

  // CRUD Handler: Create or Update Founder
  const handleSaveFounder = async (formData: Partial<Founder>) => {
    try {
      if (editingFounder) {
        // Update existing founder
        const res = await fetch(`/api/founders/${editingFounder.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const json = await res.json();
        if (json.success) {
          setFoundersList((prev) =>
            prev.map((f) => (f.id === editingFounder.id ? { ...f, ...formData } : f))
          );
          toast({
            title: 'Founder Updated Successfully!',
            description: `${formData.name}'s founder node updated in CognoDB.`,
            variant: 'success',
          });
        } else {
          throw new Error(json.error?.message || 'Failed to update founder.');
        }
      } else {
        // Create new founder
        const newFounder: Founder = {
          id: `fnd-${Date.now()}`,
          name: formData.name || 'New Founder',
          avatar: formData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          title: formData.title || 'Co-Founder & CEO',
          startupId: `stp-${Date.now()}`,
          startupName: formData.startupName || 'Stealth AI',
          bio: formData.bio || 'Building next-gen AI orchestrators.',
          experienceYears: Number(formData.experienceYears || 5),
          industry: formData.industry || 'Artificial Intelligence',
          location: formData.location || 'San Francisco, CA',
          skills: formData.skills || ['AI Architecture', 'Product Strategy'],
          connectionCount: 150,
          topTech: ['Next.js 15', 'TypeScript', 'PyTorch'],
          mentors: ['m-1'],
          investors: ['inv-1'],
          recentActivity: 'Created new graph node in ecosystem.',
        };

        const res = await fetch('/api/founders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newFounder),
        });

        const json = await res.json();
        if (json.success) {
          setFoundersList((prev) => [newFounder, ...prev]);
          toast({
            title: 'Founder Created Successfully!',
            description: `${newFounder.name} added to graph topology.`,
            variant: 'success',
          });
        } else {
          throw new Error(json.error?.message || 'Failed to create founder node.');
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

  // CRUD Handler: Confirm Delete Founder
  const handleConfirmDelete = async () => {
    if (!deletingFounder) return;

    try {
      setIsDeleting(true);
      const res = await fetch(`/api/founders/${deletingFounder.id}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (json.success) {
        setFoundersList((prev) => prev.filter((f) => f.id !== deletingFounder.id));
        toast({
          title: 'Founder Deleted Successfully!',
          description: `${deletingFounder.name} node detached from graph topology.`,
          variant: 'success',
        });
      } else {
        throw new Error(json.error?.message || 'Failed to delete node.');
      }
    } catch (err: unknown) {
      toast({
        title: 'Deletion Failed',
        description: err instanceof Error ? err.message : 'Unable to detach node.',
        variant: 'error',
      });
    } finally {
      setIsDeleting(false);
      setDeletingFounder(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Founders Directory</h1>
          <p className="text-sm text-slate-500 mt-1">
            Connecting {filteredFounders.length} visionary founders mapped across industry graph nodes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-200/60 shadow-2xs">
            {filteredFounders.length} Founders Listed
          </span>

          <button
            onClick={() => {
              setEditingFounder(null);
              setIsAddDrawerOpen(true);
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5 active:scale-95"
          >
            <UserPlus className="w-4 h-4" /> Add Founder
          </button>
        </div>
      </div>

      {/* Realtime In-Searchbar Toolbar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search founder name, startup, or skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <Filter className="w-4 h-4 text-slate-400 shrink-0 hidden sm:inline-block" />
          <select
            value={selectedIndustry}
            onChange={(e) => handleIndustryChange(e.target.value)}
            className="px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none shadow-2xs"
          >
            {industries.map((ind) => (
              <option key={ind} value={ind}>
                {ind}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Founder Grid Cards (12 per page) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedFounders.map((f) => (
          <Card key={f.id} className="flex flex-col justify-between space-y-4 relative group/card">
            <div>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  <img
                    src={f.avatar}
                    alt={f.name}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-100 shadow-sm shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-slate-900 truncate">{f.name}</h3>
                    <p className="text-xs font-semibold text-blue-600 truncate">{f.title}</p>
                    <p className="text-xs text-slate-500 font-medium truncate">{f.startupName}</p>
                    <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1">
                      <MapPin className="w-3 h-3 shrink-0" /> {f.location}
                    </div>
                  </div>
                </div>

                {/* Edit / Delete Card Quick Actions */}
                <div className="flex items-center gap-1 opacity-0 group-hover/card:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingFounder(f);
                      setIsAddDrawerOpen(true);
                    }}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-500 transition-colors"
                    title="Edit Founder"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeletingFounder(f);
                    }}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-500 transition-colors"
                    title="Delete Founder"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="mt-3.5 pt-3.5 border-t border-slate-100 space-y-2">
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{f.bio}</p>

                <div className="flex flex-wrap gap-1 pt-1">
                  {f.skills.slice(0, 3).map((skill, i) => (
                    <Badge key={i} variant="slate" size="sm">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-slate-400" /> {f.connectionCount} connections
              </span>

              <button
                onClick={() => setSelectedFounderId(f.id)}
                className="px-3.5 py-1.5 bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-700 rounded-xl text-xs font-semibold transition-all flex items-center gap-1"
              >
                View Profile <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </Card>
        ))}
      </div>

      {/* Pagination Controls Bar */}
      {filteredFounders.length > 0 && (
        <div className="pt-4 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs font-medium text-slate-500">
            Showing <span className="font-bold text-slate-900">{startIndex + 1}</span> to{' '}
            <span className="font-bold text-slate-900">
              {Math.min(startIndex + ITEMS_PER_PAGE, filteredFounders.length)}
            </span>{' '}
            of <span className="font-bold text-slate-900">{filteredFounders.length}</span> founders
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

      {/* Slide-Over Drawer for Adding / Editing Founder */}
      <AddFounderDrawer
        isOpen={isAddDrawerOpen}
        onClose={() => setIsAddDrawerOpen(false)}
        onSave={handleSaveFounder}
        editFounder={editingFounder}
      />

      {/* Custom Popup Alert Box Modal for Confirming Delete */}
      <ConfirmModal
        isOpen={!!deletingFounder}
        title="Delete Founder Node"
        message={`Are you sure you want to delete ${deletingFounder?.name} (${deletingFounder?.startupName}) from graph topology?`}
        confirmText="Delete Founder"
        cancelText="Cancel"
        loading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingFounder(null)}
      />

      {/* Slide-Over Drawer for Profile Details */}
      <ProfileDrawer
        isOpen={!!selectedFounderId}
        onClose={() => setSelectedFounderId(null)}
        entityType="Founder"
        entityId={selectedFounderId}
        onConnect={() => toast({ title: 'Connection requested!', description: 'Graph edge request submitted.' })}
      />
    </div>
  );
};
