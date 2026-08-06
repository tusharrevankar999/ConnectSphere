import React from 'react';
import { SectionLoader } from '@/components/ui/SectionLoader';

export default function ResourcesLoading() {
  return (
    <SectionLoader
      title="Loading Resources"
      subtitle="Retrieving ecosystem toolkits & asset library..."
    />
  );
}
