import React from 'react';
import { SectionLoader } from '@/components/ui/SectionLoader';

export default function GraphExplorerLoading() {
  return (
    <SectionLoader
      title="Loading Graph Explorer"
      subtitle="Rendering interactive relationship topology..."
    />
  );
}
