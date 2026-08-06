import React from 'react';
import { SectionLoader } from '@/components/ui/SectionLoader';

export default function MentorsLoading() {
  return (
    <SectionLoader
      title="Loading Mentors"
      subtitle="Loading expert mentors & advisory domains..."
    />
  );
}
