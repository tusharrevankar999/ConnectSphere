import React from 'react';
import { ResourceService } from '@/lib/services/resourceService';
import { ResourcesClient } from '@/components/client/ResourcesClient';

export const revalidate = 0; // SSR

export default async function ResourcesPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const { search } = await searchParams;

  const resourceService = new ResourceService();
  const resources = await resourceService.getResources({ search });

  return <ResourcesClient initialResources={resources} />;
}

