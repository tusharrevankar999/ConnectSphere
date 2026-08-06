import React from 'react';
import { SectionLoader } from '@/components/ui/SectionLoader';

export default function InvestorsLoading() {
  return (
    <SectionLoader
      title="Loading Investors"
      subtitle="Fetching investor profiles & check sizes..."
    />
  );
}
