import React from 'react';
import { GraphService } from '@/lib/services/graphService';
import { GraphExplorerClient } from '@/components/client/GraphExplorerClient';

export const revalidate = 0; // SSR

export default async function GraphExplorerPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;

  const graphService = new GraphService();
  const { nodes, edges } = await graphService.getTopology(type || 'All');

  return <GraphExplorerClient initialNodes={nodes} initialEdges={edges} />;
}
