import React from 'react';
import { SectionLoader } from '@/components/ui/SectionLoader';

export default function SettingsLoading() {
  return (
    <SectionLoader
      title="Loading Settings"
      subtitle="Loading platform configurations..."
    />
  );
}
