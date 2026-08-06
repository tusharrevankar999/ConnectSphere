import React from 'react';
import { SectionLoader } from '@/components/ui/SectionLoader';

export default function RecommendationsLoading() {
  return (
    <SectionLoader
      title="Loading AI Recommendations"
      subtitle="Computing multi-degree graph matches..."
    />
  );
}
