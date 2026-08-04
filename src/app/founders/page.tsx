import React from 'react';
import { FounderService } from '@/lib/services/founderService';
import { FoundersClient } from '@/components/client/FoundersClient';

export const revalidate = 0; // SSR

export default async function FoundersPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; industry?: string }>;
}) {
  const { search, industry } = await searchParams;

  const founderService = new FounderService();
  const founders = await founderService.getFounders({ search, industry });

  return <FoundersClient initialFounders={founders} />;
}
