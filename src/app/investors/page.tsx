import React from 'react';
import { InvestorService } from '@/lib/services/investorService';
import { InvestorsClient } from '@/components/client/InvestorsClient';

export const revalidate = 0; // SSR

export default async function InvestorsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const { search } = await searchParams;

  const investorService = new InvestorService();
  const investors = await investorService.getInvestors({ search });

  return <InvestorsClient initialInvestors={investors} />;
}
