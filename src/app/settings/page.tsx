'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Database, User, CheckCircle, Save } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

export default function SettingsPage() {
  const [cognoHost, setCognoHost] = useState('https://graph.cognodb.internal:7474');
  const [dbName, setDbName] = useState('startup_nexus_prod');
  const { toast } = useToast();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: 'Settings Saved',
      description: 'CognoDB graph connection configurations updated successfully.',
      variant: 'success',
    });
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Platform Settings</h1>
        <p className="text-sm text-slate-500 mt-1">Manage CognoDB graph cluster endpoints, notifications, and user preferences.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <Card className="space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">CognoDB Graph Database Connection</h3>
              <p className="text-xs text-slate-500">Configure native graph database cluster endpoints & Cypher query parameters.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                Cluster Host URI
              </label>
              <input
                type="text"
                value={cognoHost}
                onChange={(e) => setCognoHost(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                Graph Database Name
              </label>
              <input
                type="text"
                value={dbName}
                onChange={(e) => setDbName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          <div className="p-3 bg-emerald-50 border border-emerald-200/60 rounded-xl flex items-center justify-between text-xs text-emerald-900">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Status: <strong>Connected to CognoDB v2.4 (Latency: 12ms)</strong></span>
            </div>
            <Badge variant="emerald" size="sm">78 Nodes Active</Badge>
          </div>
        </Card>

        <Card className="space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Account & Profile Settings</h3>
              <p className="text-xs text-slate-500">Manage your founder identity and ecosystem visibility.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                defaultValue="Alex Rivera"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                Primary Title & Startup
              </label>
              <input
                type="text"
                defaultValue="Co-Founder & CEO @ NeuralFlow AI"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none"
              />
            </div>
          </div>
        </Card>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> Save Preferences
          </button>
        </div>
      </form>
    </div>
  );
}
