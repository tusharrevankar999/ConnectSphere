import React from 'react';
import { RecommendationsClient } from '@/components/client/RecommendationsClient';
import { mockRecommendations } from '@/data/mockData';

export const revalidate = 0; // SSR

export default async function RecommendationsPage() {
  return <RecommendationsClient initialRecommendations={mockRecommendations} />;
}
