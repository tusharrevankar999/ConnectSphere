import { executeRead, executeWrite, testCognoConnection } from '../cognodb';
import {
  GET_ALL_RESOURCES_QUERY,
  GET_RESOURCE_BY_ID_QUERY,
  CREATE_RESOURCE_QUERY,
  UPDATE_RESOURCE_QUERY,
  DELETE_RESOURCE_QUERY,
} from '../queries/resourceQueries';
import { Resource } from '@/types';
import { mockResources } from '@/data/mockData';

export class ResourceRepository {
  async getAll(options: { search?: string; limit?: number } = {}): Promise<Resource[]> {
    const isConnected = await testCognoConnection();
    if (!isConnected) {
      return mockResources.filter((r) => {
        const matchesSearch =
          !options.search ||
          r.title.toLowerCase().includes(options.search.toLowerCase()) ||
          r.providerName.toLowerCase().includes(options.search.toLowerCase()) ||
          r.category.toLowerCase().includes(options.search.toLowerCase()) ||
          (r.skills && r.skills.some((s) => s.toLowerCase().includes(options.search!.toLowerCase())));

        return matchesSearch;
      });
    }

    try {
      const dbResources = await executeRead(
        GET_ALL_RESOURCES_QUERY,
        {
          search: options.search || null,
          limit: options.limit || 50,
        },
        (records) => {
          return records.map((record) => {
            const node = record.get('r').properties;
            return {
              ...node,
              skills: Array.isArray(node.skills) ? node.skills : [],
              rating: Number(node.rating || 4.9),
            } as Resource;
          });
        }
      );

      if (dbResources.length === 0 && !options.search) {
        return mockResources;
      }
      return dbResources;
    } catch {
      return mockResources;
    }
  }


  async getById(id: string): Promise<Resource | null> {
    const isConnected = await testCognoConnection();
    if (!isConnected) {
      return mockResources.find((r) => r.id === id) || null;
    }

    try {
      const resNode = await executeRead(
        GET_RESOURCE_BY_ID_QUERY,
        { id },
        (records) => {
          if (records.length === 0) return null;
          const node = records[0].get('r').properties;
          return {
            ...node,
            skills: Array.isArray(node.skills) ? node.skills : [],
            rating: Number(node.rating || 4.9),
          } as Resource;
        }
      );
      return resNode || mockResources.find((r) => r.id === id) || null;
    } catch {
      return mockResources.find((r) => r.id === id) || null;
    }
  }

  async create(resource: Resource): Promise<Resource> {
    const isConnected = await testCognoConnection();
    if (!isConnected) {
      mockResources.unshift(resource);
      return resource;
    }

    return executeWrite(
      CREATE_RESOURCE_QUERY,
      { ...resource },
      (records) => records[0].get('r').properties as Resource
    );
  }

  async update(id: string, resource: Partial<Resource>): Promise<Resource | null> {
    const isConnected = await testCognoConnection();
    if (!isConnected) {
      const idx = mockResources.findIndex((r) => r.id === id);
      if (idx !== -1) {
        mockResources[idx] = { ...mockResources[idx], ...resource };
        return mockResources[idx];
      }
      return null;
    }

    return executeWrite(
      UPDATE_RESOURCE_QUERY,
      { id, ...resource },
      (records) => (records[0] ? (records[0].get('r').properties as Resource) : null)
    );
  }

  async delete(id: string): Promise<boolean> {
    const isConnected = await testCognoConnection();
    const idx = mockResources.findIndex((r) => r.id === id);
    if (idx !== -1) {
      mockResources.splice(idx, 1);
    }

    if (isConnected) {
      await executeWrite(DELETE_RESOURCE_QUERY, { id });
    }
    return true;
  }
}
