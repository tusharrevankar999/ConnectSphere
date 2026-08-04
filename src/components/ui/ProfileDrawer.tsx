'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, MapPin, Building, Award, Calendar, CheckCircle2, UserPlus, MessageSquare, Briefcase, Zap, Shield, HeartHandshake } from 'lucide-react';
import { mockFounders, mockStartups, mockInvestors, mockMentors } from '@/data/mockData';
import { Badge } from './Badge';

import { NodeType } from '@/types';

interface ProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  entityType: NodeType | null;
  entityId: string | null;
  onConnect?: () => void;
}

export const ProfileDrawer: React.FC<ProfileDrawerProps> = ({
  isOpen,
  onClose,
  entityType,
  entityId,
  onConnect
}) => {
  if (!isOpen || !entityType || !entityId) return null;

  const founder = entityType === 'Founder' ? mockFounders.find((f) => f.id === entityId) : null;
  const startup = entityType === 'Startup' ? mockStartups.find((s) => s.id === entityId) : null;
  const investor = entityType === 'Investor' ? mockInvestors.find((i) => i.id === entityId) : null;
  const mentor = entityType === 'Mentor' ? mockMentors.find((m) => m.id === entityId) : null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/30 backdrop-blur-xs flex justify-end">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="w-full max-w-lg bg-white h-full shadow-2xl border-l border-slate-200 overflow-y-auto flex flex-col justify-between"
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-100 relative">
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Founder View */}
            {founder && (
              <div className="flex items-start gap-4">
                <img src={founder.avatar} alt={founder.name} className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-md" />
                <div className="flex-1 pr-6">
                  <Badge variant="blue" size="sm" className="mb-1">{founder.industry}</Badge>
                  <h3 className="text-xl font-bold text-slate-900">{founder.name}</h3>
                  <p className="text-sm font-medium text-slate-500">{founder.title} @ {founder.startupName}</p>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5" /> {founder.location}
                  </p>
                </div>
              </div>
            )}

            {/* Startup View */}
            {startup && (
              <div className="flex items-start gap-4">
                <img src={startup.logo} alt={startup.name} className="w-16 h-16 rounded-2xl object-cover border border-slate-100 shadow-md" />
                <div className="flex-1 pr-6">
                  <Badge variant="emerald" size="sm" className="mb-1">{startup.fundingStage}</Badge>
                  <h3 className="text-xl font-bold text-slate-900">{startup.name}</h3>
                  <p className="text-sm text-slate-500">{startup.pitch}</p>
                </div>
              </div>
            )}

            {/* Investor View */}
            {investor && (
              <div className="flex items-start gap-4">
                <img src={investor.photo} alt={investor.name} className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-md" />
                <div className="flex-1 pr-6">
                  <Badge variant="purple" size="sm" className="mb-1">{investor.firm}</Badge>
                  <h3 className="text-xl font-bold text-slate-900">{investor.name}</h3>
                  <p className="text-sm font-medium text-slate-500">{investor.role} at {investor.firm}</p>
                </div>
              </div>
            )}

            {/* Mentor View */}
            {mentor && (
              <div className="flex items-start gap-4">
                <img src={mentor.photo} alt={mentor.name} className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-md" />
                <div className="flex-1 pr-6">
                  <Badge variant="amber" size="sm" className="mb-1">{mentor.availability}</Badge>
                  <h3 className="text-xl font-bold text-slate-900">{mentor.name}</h3>
                  <p className="text-sm font-medium text-slate-500">{mentor.title} @ {mentor.company}</p>
                </div>
              </div>
            )}
          </div>

          {/* Drawer Body */}
          <div className="p-6 space-y-6 flex-1 overflow-y-auto">
            {founder && (
              <>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Biography</h4>
                  <p className="text-sm text-slate-700 leading-relaxed">{founder.bio}</p>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Core Skills & Expertise</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {founder.skills.map((skill, i) => (
                      <Badge key={i} variant="slate" size="sm">{skill}</Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Primary Technology Stack</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {founder.topTech.map((tech, i) => (
                      <Badge key={i} variant="pink" size="sm">{tech}</Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Recent Ecosystem Activity</h4>
                  <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-xl text-xs text-blue-900 flex items-start gap-2">
                    <Zap className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>{founder.recentActivity}</span>
                  </div>
                </div>
              </>
            )}

            {startup && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="text-xs text-slate-400 block">Valuation</span>
                    <span className="text-lg font-bold text-slate-900">{startup.valuation}</span>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="text-xs text-slate-400 block">Total Raised</span>
                    <span className="text-lg font-bold text-emerald-600">{startup.totalFunding}</span>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Founders</h4>
                  <div className="flex flex-wrap gap-2">
                    {startup.founderNames.map((name, i) => (
                      <span key={i} className="text-sm font-semibold text-slate-800 bg-slate-100 px-3 py-1 rounded-lg">
                        {name}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Tech Stack Nodes</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {startup.techStack.map((tech, i) => (
                      <Badge key={i} variant="blue" size="sm">{tech}</Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Backed By</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {startup.investorNames.map((inv, i) => (
                      <Badge key={i} variant="purple" size="sm">{inv}</Badge>
                    ))}
                  </div>
                </div>
              </>
            )}

            {investor && (
              <>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">About Investor</h4>
                  <p className="text-sm text-slate-700 leading-relaxed">{investor.bio}</p>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Focus Industries</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {investor.focusIndustries.map((ind, i) => (
                      <Badge key={i} variant="cyan" size="sm">{ind}</Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Recent Investments</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {investor.recentInvestments.map((inv, i) => (
                      <Badge key={i} variant="emerald" size="sm">{inv}</Badge>
                    ))}
                  </div>
                </div>
              </>
            )}

            {mentor && (
              <>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Expertise</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {mentor.expertise.map((exp, i) => (
                      <Badge key={i} variant="amber" size="sm">{exp}</Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Mentorship Track Record</h4>
                  <p className="text-sm text-slate-700">
                    Mentored over <strong>{mentor.startupsMentoredCount} startups</strong> with an average rating of <strong>{mentor.rating} / 5.0</strong>.
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Drawer Footer Actions */}
          <div className="p-6 border-t border-slate-100 bg-slate-50 flex items-center gap-3">
            <button
              onClick={() => {
                if (onConnect) onConnect();
                onClose();
              }}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm py-2.5 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4" /> Request Graph Connection
            </button>
            <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors">
              <MessageSquare className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
