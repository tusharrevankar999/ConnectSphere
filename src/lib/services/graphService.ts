import { GraphRepository } from '../repositories/graphRepository';
import { GraphNode, GraphEdge } from '@/types';

export class GraphService {
  private repo = new GraphRepository();

  async getTopology(type?: string, limit?: number): Promise<{ nodes: GraphNode[]; edges: GraphEdge[] }> {
    return this.repo.getTopology(type || 'All', limit || 100);
  }
}
