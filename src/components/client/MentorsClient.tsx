'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Mentor } from '@/types';
import { Search, Star, UserPlus, Pencil, Trash2, GraduationCap } from 'lucide-react';
import { ProfileDrawer } from '@/components/ui/ProfileDrawer';
import { AddMentorDrawer } from '@/components/ui/AddMentorDrawer';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { useToast } from '@/components/ui/Toast';
import { useSearchParams } from 'next/navigation';

interface MentorsClientProps {
  initialMentors: Mentor[];
}

export const MentorsClient: React.FC<MentorsClientProps> = ({ initialMentors }) => {
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [mentorsList, setMentorsList] = useState<Mentor[]>(initialMentors);
  const [selectedMentorId, setSelectedMentorId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [editingMentor, setEditingMentor] = useState<Mentor | null>(null);
  const [deletingMentor, setDeletingMentor] = useState<Mentor | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Real-time search filter
  const filteredMentors = mentorsList.filter((m) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      m.name.toLowerCase().includes(q) ||
      m.company.toLowerCase().includes(q) ||
      m.title.toLowerCase().includes(q) ||
      (m.expertise && m.expertise.some((exp) => exp.toLowerCase().includes(q))) ||
      (m.technologies && m.technologies.some((tech) => tech.toLowerCase().includes(q))) ||
      (m.bio && m.bio.toLowerCase().includes(q))
    );
  });

  const handleSaveMentor = async (mentorData: Partial<Mentor>) => {
    try {
      if (editingMentor) {
        // Edit existing mentor
        const res = await fetch(`/api/mentors/${editingMentor.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(mentorData),
        });
        const data = await res.json();
        if (data.success && data.data) {
          setMentorsList((prev) => prev.map((m) => (m.id === editingMentor.id ? data.data : m)));
          toast({
            title: 'Mentor Updated',
            description: `${data.data.name}'s profile has been updated.`,
            variant: 'success',
          });
        }
      } else {
        // Create new mentor
        const res = await fetch('/api/mentors', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(mentorData),
        });
        const data = await res.json();
        if (data.success && data.data) {
          setMentorsList((prev) => [data.data, ...prev]);
          toast({
            title: 'Mentor Added',
            description: `${data.data.name} has been added to the Mentors directory.`,
            variant: 'success',
          });
        }
      }
      setIsAddDrawerOpen(false);
      setEditingMentor(null);
    } catch (err) {
      console.error('Failed to save mentor', err);
      toast({
        title: 'Error',
        description: 'Failed to save mentor details.',
        variant: 'error',
      });
    }
  };

  const handleDeleteMentor = async () => {
    if (!deletingMentor) return;
    try {
      setIsDeleting(true);
      const res = await fetch(`/api/mentors/${deletingMentor.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setMentorsList((prev) => prev.filter((m) => m.id !== deletingMentor.id));
        toast({
          title: 'Mentor Deleted',
          description: `${deletingMentor.name} has been removed from the graph.`,
          variant: 'success',
        });
      }
    } catch (err) {
      console.error('Failed to delete mentor', err);
      toast({
        title: 'Delete Error',
        description: 'Failed to delete mentor.',
        variant: 'error',
      });
    } finally {
      setIsDeleting(false);
      setDeletingMentor(null);
    }
  };

  const renderVal = (val: any, fallback = 0) => {
    if (val === null || val === undefined) return fallback;
    if (typeof val === 'number') return val;
    if (typeof val === 'string') return val;
    if (typeof val === 'object' && val !== null && typeof val.low === 'number') {
      return val.low;
    }
    const parsed = Number(val);
    return isNaN(parsed) ? fallback : parsed;
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Mentors Directory</h1>
          <p className="text-sm text-slate-500 mt-1">Industry leaders offering 1:1 advisory & technical guidance to ecosystem founders.</p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-amber-50 text-amber-700 border border-amber-200/60">
            {filteredMentors.length} Mentors Available
          </span>

          <button
            onClick={() => {
              setEditingMentor(null);
              setIsAddDrawerOpen(true);
            }}
            className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md shadow-amber-500/20 transition-all flex items-center gap-2"
          >
            <GraduationCap className="w-4 h-4" /> Add Mentor
          </button>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          placeholder="Search mentor name, company, or domain expertise..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 shadow-2xs"
        />
      </div>

      {/* Mentors Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMentors.map((m) => (
          <Card key={m.id} className="flex flex-col justify-between space-y-4 hover:border-amber-300 transition-all group">
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3.5">
                  <img src={m.photo} alt={m.name} className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-100 shadow-sm shrink-0" />
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{m.name}</h3>
                    <p className="text-xs font-semibold text-amber-600">{m.title}</p>
                    <p className="text-xs text-slate-500 font-medium">{m.company}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <Badge variant={m.availability === 'Available Now' ? 'emerald' : m.availability === 'Limited Slots' ? 'amber' : 'slate'} size="sm">
                    {m.availability}
                  </Badge>

                  {/* Edit Button */}
                  <button
                    onClick={() => {
                      setEditingMentor(m);
                      setIsAddDrawerOpen(true);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                    title="Edit Mentor"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={() => setDeletingMentor(m)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Delete Mentor"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-3 text-xs text-slate-500">
                <span className="flex items-center gap-1 font-bold text-slate-900">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> {renderVal(m.rating, 5.0)}
                </span>
                <span>•</span>
                <span>{renderVal(m.startupsMentoredCount, 0)} startups mentored</span>
                {m.experienceYears && (
                  <>
                    <span>•</span>
                    <span>{renderVal(m.experienceYears, 0)} yrs exp</span>
                  </>
                )}
              </div>

              <div className="mt-3.5 space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Domain Expertise</span>
                <div className="flex flex-wrap gap-1">
                  {m.expertise.map((exp, i) => (
                    <Badge key={i} variant="amber" size="sm">{exp}</Badge>
                  ))}
                </div>
              </div>

              <div className="mt-3 space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Stack & Runtimes</span>
                <div className="flex flex-wrap gap-1">
                  {m.technologies.map((t, i) => (
                    <Badge key={i} variant="pink" size="sm">{t}</Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
              <button
                onClick={() => setSelectedMentorId(m.id)}
                className="flex-1 py-2 bg-slate-50 hover:bg-slate-100 text-slate-800 rounded-xl text-xs font-semibold transition-colors"
              >
                View Profile
              </button>
              <button
                onClick={() => toast({ title: `Session requested with ${m.name}`, description: 'Office hours request logged.', variant: 'success' })}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center gap-1"
              >
                <UserPlus className="w-3.5 h-3.5" /> Book
              </button>
            </div>
          </Card>
        ))}
      </div>

      {/* Profile Drawer */}
      <ProfileDrawer
        isOpen={!!selectedMentorId}
        onClose={() => setSelectedMentorId(null)}
        entityType="Mentor"
        entityId={selectedMentorId}
      />

      {/* Add / Edit Mentor Drawer */}
      <AddMentorDrawer
        isOpen={isAddDrawerOpen}
        onClose={() => {
          setIsAddDrawerOpen(false);
          setEditingMentor(null);
        }}
        onSave={handleSaveMentor}
        editMentor={editingMentor}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deletingMentor}
        onCancel={() => setDeletingMentor(null)}
        onConfirm={handleDeleteMentor}
        title="Delete Mentor Profile"
        message={`Are you sure you want to delete ${deletingMentor?.name}? This action will remove their profile node from the platform.`}
        confirmText="Delete Mentor"
        loading={isDeleting}
      />
    </div>
  );
};
