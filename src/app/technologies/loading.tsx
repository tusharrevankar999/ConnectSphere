import React from 'react';
import { SectionLoader } from '@/components/ui/SectionLoader';

export default function TechnologiesLoading() {
  return (
    <SectionLoader
      title="Loading Technologies"
      subtitle="Fetching technology stack taxonomy..."
    />
  );
}
