import React from 'react';
import { SectionLoader } from '@/components/ui/SectionLoader';

export default function StartupsLoading() {
  return (
    <SectionLoader
      title="Loading Startups"
      subtitle="Loading startup ecosystem & funding stages..."
    />
  );
}
