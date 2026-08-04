import { executeRead, testCognoConnection } from '../cognodb';
import { GET_GRAPH_TOPOLOGY_QUERY } from '../queries/graphQueries';
import { GraphNode, GraphEdge } from '@/types';
import { mockGraphNodes, mockGraphEdges } from '@/data/mockData';

export class GraphRepository {
  async getTopology(type = 'All', limit = 100): Promise<{ nodes: GraphNode[]; edges: GraphEdge[] }> {
    const isConnected = await testCognoConnection();
    if (!isConnected) {
      const filteredNodes = type === 'All' ? mockGraphNodes : mockGraphNodes.filter((n) => n.type === type);
      const filteredNodeIds = new Set(filteredNodes.map((n) => n.id));
      const filteredEdges = mockGraphEdges.filter(
        (e) => filteredNodeIds.has(e.source) && filteredNodeIds.has(e.target)
      );
      return { nodes: filteredNodes, edges: filteredEdges };
    }

    return executeRead(
      GET_GRAPH_TOPOLOGY_QUERY,
      { type: type === 'All' ? null : type, limit },
      (records) => {
        const nodeMap = new Map<string, GraphNode>();
        const edges: GraphEdge[] = [];

        records.forEach((rec) => {
          const n = rec.get('n');
          const nodeType = rec.get('type');
          const r = rec.get('r');
          const m = rec.get('m');

          if (n && !nodeMap.has(n.properties.id)) {
            nodeMap.set(n.properties.id, {
              id: n.properties.id,
              label: n.properties.name || n.properties.label || n.properties.id,
              type: nodeType,
              subtitle: n.properties.title || n.properties.industry || n.properties.category || nodeType,
              val: Number(n.properties.val || 18),
              color: this.getNodeColor(nodeType),
              details: n.properties,
            });
          }

          if (m && !nodeMap.has(m.properties.id)) {
            const mType = m.labels ? m.labels[0] : 'Node';
            nodeMap.set(m.properties.id, {
              id: m.properties.id,
              label: m.properties.name || m.properties.label || m.properties.id,
              type: mType,
              subtitle: m.properties.title || m.properties.industry || mType,
              val: Number(m.properties.val || 16),
              color: this.getNodeColor(mType),
              details: m.properties,
            });
          }

          if (r && n && m) {
            edges.push({
              id: `edge-${r.identity}`,
              source: n.properties.id,
              target: m.properties.id,
              label: r.type,
            });
          }
        });

        return { nodes: Array.from(nodeMap.values()), edges };
      }
    );
  }

  private getNodeColor(type: string): string {
    switch (type) {
      case 'Founder': return '#2563EB';
      case 'Startup': return '#10B981';
      case 'Investor': return '#8B5CF6';
      case 'Mentor': return '#F59E0B';
      case 'Technology': return '#EC4899';
      case 'Industry': return '#06B6D4';
      default: return '#64748B';
    }
  }
}
