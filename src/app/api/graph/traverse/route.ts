import { NextRequest, NextResponse } from 'next/server';
import { executeRead, testCognoConnection } from '@/lib/cognodb';
import { handleApiError } from '@/lib/errors';
import { mockGraphNodes, mockGraphEdges } from '@/data/mockData';
import { GraphNode, GraphEdge } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const nodeId = searchParams.get('nodeId') || 'nexus-center';
    const depth = Math.min(Math.max(Number(searchParams.get('depth') || 2), 1), 3);

    const isConnected = await testCognoConnection();
    if (!isConnected) {
      const filteredNodes = mockGraphNodes;
      return NextResponse.json({
        success: true,
        nodeId,
        depth,
        data: { nodes: filteredNodes, edges: mockGraphEdges },
      });
    }

    const cypher = `
      MATCH path = (start {id: $nodeId})-[*1..${depth}]-(connected)
      RETURN DISTINCT start, connected, relationships(path) AS rels
      LIMIT 100
    `;

    const data = await executeRead(cypher, { nodeId }, (records) => {
      const nodeMap = new Map<string, GraphNode>();
      const edgeMap = new Map<string, GraphEdge>();

      records.forEach((r) => {
        const start = r.get('start');
        const connected = r.get('connected');
        const rels = r.get('rels');

        if (start && !nodeMap.has(start.properties.id)) {
          nodeMap.set(start.properties.id, {
            id: start.properties.id,
            label: start.properties.name || start.properties.label || start.properties.id,
            type: start.labels ? start.labels[0] : 'Technology',
            subtitle: start.properties.title || start.properties.industry || 'Center Node',
            val: Number(start.properties.val || 24),
            color: '#2563EB',
            details: start.properties,
          });
        }

        if (connected && !nodeMap.has(connected.properties.id)) {
          const type = connected.labels ? connected.labels[0] : 'Startup';
          nodeMap.set(connected.properties.id, {
            id: connected.properties.id,
            label: connected.properties.name || connected.properties.label || connected.properties.id,
            type,
            subtitle: connected.properties.title || connected.properties.industry || type,
            val: Number(connected.properties.val || 18),
            color: '#10B981',
            details: connected.properties,
          });
        }

        if (rels && Array.isArray(rels)) {
          rels.forEach((rel) => {
            const edgeId = `edge-${rel.identity}`;
            if (!edgeMap.has(edgeId)) {
              edgeMap.set(edgeId, {
                id: edgeId,
                source: rel.startNodeElementId || start.properties.id,
                target: rel.endNodeElementId || connected.properties.id,
                label: rel.type,
              });
            }
          });
        }
      });

      return {
        nodes: Array.from(nodeMap.values()),
        edges: Array.from(edgeMap.values()),
      };
    });

    return NextResponse.json({
      success: true,
      nodeId,
      depth,
      data,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
