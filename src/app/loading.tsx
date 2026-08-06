import React from 'react';
import { SectionLoader } from '@/components/ui/SectionLoader';

export default function DashboardLoading() {
  return (
    <SectionLoader
      title="Loading Dashboard"
      subtitle="Syncing platform statistics & ecosystem recommendations..."
    />
  );
}
