import { executeRead, executeWrite, testCognoConnection } from '../cognodb';
import { GET_ALL_TECHNOLOGIES_QUERY, GET_TECHNOLOGY_BY_ID_QUERY, CREATE_TECHNOLOGY_QUERY } from '../queries/technologyQueries';
import { Technology } from '@/types';
import { mockTechnologies } from '@/data/mockData';

export class TechnologyRepository {
  async getAll(options: { search?: string; limit?: number } = {}): Promise<Technology[]> {
    const isConnected = await testCognoConnection();
    if (!isConnected) {
      return mockTechnologies.filter((t) =>
        !options.search || t.name.toLowerCase().includes(options.search.toLowerCase()) || t.category.toLowerCase().includes(options.search.toLowerCase())
      );
    }

    try {
      const dbTechs = await executeRead(
        GET_ALL_TECHNOLOGIES_QUERY,
        {
          search: options.search || null,
          limit: options.limit || 50,
        },
        (records) => {
          return records.map((record) => {
            const node = record.get('t').properties;
            return {
              ...node,
              startupCount: Number(node.startupCount || 0),
              topStartups: Array.isArray(node.topStartups) ? node.topStartups : [],
            } as Technology;
          });
        }
      );

      if (dbTechs.length === 0 && !options.search) {
        return mockTechnologies;
      }
      return dbTechs;
    } catch {
      return mockTechnologies.filter((t) =>
        !options.search || t.name.toLowerCase().includes(options.search.toLowerCase()) || t.category.toLowerCase().includes(options.search.toLowerCase())
      );
    }
  }

  async getById(id: string): Promise<Technology | null> {
    const isConnected = await testCognoConnection();
    if (!isConnected) {
      return mockTechnologies.find((t) => t.id === id) || null;
    }

    try {
      const tech = await executeRead(
        GET_TECHNOLOGY_BY_ID_QUERY,
        { id },
        (records) => {
          if (records.length === 0) return null;
          const node = records[0].get('t').properties;
          return {
            ...node,
            startupCount: Number(node.startupCount || 0),
            topStartups: Array.isArray(node.topStartups) ? node.topStartups : [],
          } as Technology;
        }
      );
      return tech || mockTechnologies.find((t) => t.id === id) || null;
    } catch {
      return mockTechnologies.find((t) => t.id === id) || null;
    }
  }

  async create(tech: Technology): Promise<Technology> {
    const isConnected = await testCognoConnection();
    if (!isConnected) {
      mockTechnologies.push(tech);
      return tech;
    }

    return executeWrite(
      CREATE_TECHNOLOGY_QUERY,
      { ...tech },
      (records) => records[0].get('t').properties as Technology
    );
  }
}
