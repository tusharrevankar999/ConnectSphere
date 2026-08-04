import React from 'react';
import { StartupService } from '@/lib/services/startupService';
import { StartupsClient } from '@/components/client/StartupsClient';

export const revalidate = 0; // SSR

export default async function StartupsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; stage?: string }>;
}) {
  const { search, stage } = await searchParams;

  const startupService = new StartupService();
  const startups = await startupService.getStartups({ search, stage });

  return <StartupsClient initialStartups={startups} />;
}
