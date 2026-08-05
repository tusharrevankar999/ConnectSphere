'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Resource } from '@/types';

import { Search, MapPin, Star, Plus, Pencil, Trash2, ChevronLeft, ChevronRight, Mail, Send, Filter, X } from 'lucide-react';
import { AddResourceDrawer } from '@/components/ui/AddResourceDrawer';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { useToast } from '@/components/ui/Toast';
import { useSearchParams } from 'next/navigation';
import { clsx } from 'clsx';

interface ResourcesClientProps {
  initialResources: Resource[];
}

const ITEMS_PER_PAGE = 12;

export const ResourcesClient: React.FC<ResourcesClientProps> = ({ initialResources }) => {
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [resourcesList, setResourcesList] = useState<Resource[]>(initialResources);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [deletingResource, setDeletingResource] = useState<Resource | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [contactingResource, setContactingResource] = useState<Resource | null>(null);

  // Reset page to 1 on search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Real-time search filter
  const filteredResources = resourcesList.filter((r) => {
    const matchesSearch =
      !searchQuery ||
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.providerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.description && r.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (r.skills && r.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())));

    return matchesSearch;
  });

  const totalPages = Math.ceil(filteredResources.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedResources = filteredResources.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // CRUD Handler: Create or Update Resource
  const handleSaveResource = async (formData: Partial<Resource>) => {
    try {
      if (editingResource) {
        // Update existing resource
        const res = await fetch(`/api/resources/${editingResource.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const json = await res.json();
        if (json.success) {
          setResourcesList((prev) =>
            prev.map((r) => (r.id === editingResource.id ? { ...r, ...formData } : r))
          );
          toast({
            title: 'Resource Updated Successfully!',
            description: `"${formData.title}" updated in ecosystem directory.`,
            variant: 'success',
          });
        } else {
          throw new Error(json.error?.message || 'Failed to update resource.');
        }
      } else {
        // Create new resource
        const newResource: Resource = {
          id: `res-${Date.now()}`,
          title: formData.title || 'New Talent Resource',
          category: formData.category || 'General Resource',
          description: formData.description || 'Experienced talent offering specialized skills to startups and investors.',
          providerName: formData.providerName || 'Ecosystem Talent',
          providerRole: formData.providerRole || 'Lead Consultant',
          contactEmail: formData.contactEmail || 'contact@ecosystem-resources.io',
          contactPhone: formData.contactPhone || '+1 (415) 555-0100',
          skills: formData.skills || ['Product Strategy', 'Architecture'],
          rating: 4.95,
          availability: formData.availability || 'Available Now',
          location: formData.location || 'San Francisco, CA',
          avatar: formData.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        };

        const res = await fetch('/api/resources', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newResource),
        });

        const json = await res.json();
        if (json.success) {
          setResourcesList((prev) => [newResource, ...prev]);
          toast({
            title: 'Resource Created Successfully!',
            description: `"${newResource.title}" added to resource network directory.`,
            variant: 'success',
          });
        } else {
          throw new Error(json.error?.message || 'Failed to create resource.');
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

  // CRUD Handler: Confirm Delete Resource
  const handleConfirmDelete = async () => {
    if (!deletingResource) return;

    try {
      setIsDeleting(true);
      const res = await fetch(`/api/resources/${deletingResource.id}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (json.success) {
        setResourcesList((prev) => prev.filter((r) => r.id !== deletingResource.id));
        toast({
          title: 'Resource Deleted Successfully!',
          description: `"${deletingResource.title}" removed from resource directory.`,
          variant: 'success',
        });
      } else {
        throw new Error(json.error?.message || 'Failed to delete resource.');
      }
    } catch (err: unknown) {
      toast({
        title: 'Deletion Failed',
        description: err instanceof Error ? err.message : 'Unable to remove resource.',
        variant: 'error',
      });
    } finally {
      setIsDeleting(false);
      setDeletingResource(null);
    }
  };


  // Contact Resource Handler
  const handleContactResource = (resource: Resource) => {
    toast({
      title: `Contact Inquiry Sent!`,
      description: `Inquiry sent to ${resource.providerName} (${resource.contactEmail}) for "${resource.title}".`,
      variant: 'success',
    });
    setContactingResource(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Resources Directory</h1>
          <p className="text-sm text-slate-500 mt-1">
            Browse, contact, and manage accounts manager, BD, management, design, HR, and custom skill talent across startups & investors.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/60 shadow-2xs">
            {filteredResources.length} Resources Available
          </span>

          <button
            onClick={() => {
              setEditingResource(null);
              setIsAddDrawerOpen(true);
            }}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1.5 active:scale-95"
          >
            <Plus className="w-4 h-4" /> Add Resource
          </button>
        </div>
      </div>

      {/* Real-time Search Toolbar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by title, category (e.g. Accounts Manager, Designer, BD Executive), skills, or provider..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 shadow-2xs"
          />

        </div>
      </div>

      {/* Resource Grid Cards (12 per page) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedResources.map((r) => (
          <Card key={r.id} className="flex flex-col justify-between space-y-4 relative group/card">
            <div>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <img
                    src={r.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'}
                    alt={r.providerName}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-100 shadow-sm shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-slate-900 line-clamp-1">{r.title}</h3>
                    <p className="text-xs font-medium text-slate-500 truncate">{r.providerName} • {r.providerRole}</p>
                    <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                      <MapPin className="w-3 h-3 shrink-0" /> {r.location}
                    </div>
                  </div>
                </div>

                {/* Edit / Delete Quick Actions */}
                <div className="flex items-center gap-1 opacity-0 group-hover/card:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingResource(r);
                      setIsAddDrawerOpen(true);
                    }}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-600 text-slate-500 transition-colors"
                    title="Edit Resource"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeletingResource(r);
                    }}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-500 transition-colors"
                    title="Delete Resource"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Category and Availability Badges */}
              <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t border-slate-100">
                <Badge variant="emerald" size="sm">
                  {r.category}
                </Badge>

                <Badge variant={r.availability === 'Available Now' ? 'emerald' : r.availability === 'In Progress' ? 'amber' : 'slate'} size="sm">
                  {r.availability}
                </Badge>
              </div>


              <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">{r.description}</p>

              {/* Skills Badges */}
              <div className="mt-3 space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Skills & Tech</span>
                <div className="flex flex-wrap gap-1">
                  {r.skills.slice(0, 4).map((skill, i) => (
                    <Badge key={i} variant="slate" size="sm">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Card Footer Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              {r.rating && (
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> {r.rating}
                </span>
              )}

              <button
                onClick={() => setContactingResource(r)}
                className="px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-700 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ml-auto"
              >
                <Mail className="w-3.5 h-3.5" /> Contact Resource
              </button>
            </div>
          </Card>
        ))}
      </div>

      {/* Pagination Controls Bar */}
      {filteredResources.length > 0 && (
        <div className="pt-4 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs font-medium text-slate-500">
            Showing <span className="font-bold text-slate-900">{startIndex + 1}</span> to{' '}
            <span className="font-bold text-slate-900">
              {Math.min(startIndex + ITEMS_PER_PAGE, filteredResources.length)}
            </span>{' '}
            of <span className="font-bold text-slate-900">{filteredResources.length}</span> resources
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
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
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

      {/* Slide-Over Drawer for Adding / Editing Resource */}
      <AddResourceDrawer
        isOpen={isAddDrawerOpen}
        onClose={() => setIsAddDrawerOpen(false)}
        onSave={handleSaveResource}
        editResource={editingResource}
      />

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={!!deletingResource}
        title="Delete Resource"
        message={`Are you sure you want to delete "${deletingResource?.title}" (${deletingResource?.providerName})?`}
        confirmText="Delete Resource"

        cancelText="Cancel"
        loading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingResource(null)}
      />

      {/* Contact Resource Modal */}
      {contactingResource && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Contact Resource Provider</h3>
                  <p className="text-xs text-slate-500 font-medium">{contactingResource.providerName}</p>
                </div>
              </div>

              <button
                onClick={() => setContactingResource(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <span className="font-bold text-slate-900">{contactingResource.title}</span>
                <p className="text-slate-500 line-clamp-2">{contactingResource.description}</p>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Direct Email</label>
                <input
                  type="text"
                  readOnly
                  value={contactingResource.contactEmail}
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-slate-800 font-mono text-xs"
                />
              </div>

              {contactingResource.contactPhone && (
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Direct Phone / Link</label>
                  <input
                    type="text"
                    readOnly
                    value={contactingResource.contactPhone}
                    className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-slate-800 font-mono text-xs"
                  />
                </div>
              )}

              <div>
                <label className="font-bold text-slate-700 block mb-1">Inquiry / Project Details</label>
                <textarea
                  rows={3}
                  placeholder="Describe your startup/investor project scope and timeline..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setContactingResource(null)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleContactResource(contactingResource)}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" /> Send Inquiry
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
