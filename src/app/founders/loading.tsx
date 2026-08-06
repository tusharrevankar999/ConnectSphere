import React from 'react';
import { SectionLoader } from '@/components/ui/SectionLoader';

export default function FoundersLoading() {
  return (
    <SectionLoader
      title="Loading Founders"
      subtitle="Retrieving founder directory & skill topologies..."
    />
  );
}
