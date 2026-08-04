import { executeRead, executeWrite, testCognoConnection } from '../cognodb';
import { 
  GET_ALL_FOUNDERS_QUERY, 
  GET_FOUNDER_BY_ID_QUERY, 
  CREATE_FOUNDER_QUERY,
  UPDATE_FOUNDER_QUERY,
  DELETE_FOUNDER_QUERY 
} from '../queries/founderQueries';
import { Founder } from '@/types';
import { mockFounders } from '@/data/mockData';

export class FounderRepository {
  async getAll(options: { search?: string; industry?: string; limit?: number } = {}): Promise<Founder[]> {
    const isConnected = await testCognoConnection();
    if (!isConnected) {
      return mockFounders.filter((f) => {
        const matchesSearch = !options.search || f.name.toLowerCase().includes(options.search.toLowerCase()) || f.startupName.toLowerCase().includes(options.search.toLowerCase());
        const matchesInd = !options.industry || options.industry === 'All' || f.industry === options.industry;
        return matchesSearch && matchesInd;
      });
    }

    try {
      const dbFounders = await executeRead(
        GET_ALL_FOUNDERS_QUERY,
        {
          search: options.search || null,
          industry: options.industry || null,
          limit: options.limit || 50,
        },
        (records) => {
          return records.map((record) => {
            const node = record.get('f').properties;
            const mentors = record.get('mentors');
            const investors = record.get('investors');
            return {
              ...node,
              skills: Array.isArray(node.skills) ? node.skills : [],
              topTech: Array.isArray(node.topTech) ? node.topTech : [],
              experienceYears: Number(node.experienceYears || 0),
              connectionCount: Number(node.connectionCount || 0),
              mentors: Array.isArray(mentors) ? mentors : [],
              investors: Array.isArray(investors) ? investors : [],
            } as Founder;
          });
        }
      );

      if (dbFounders.length === 0 && !options.search && (!options.industry || options.industry === 'All')) {
        return mockFounders;
      }
      return dbFounders;
    } catch {
      return mockFounders;
    }
  }

  async getById(id: string): Promise<Founder | null> {
    const isConnected = await testCognoConnection();
    if (!isConnected) {
      return mockFounders.find((f) => f.id === id) || null;
    }

    try {
      const founder = await executeRead(
        GET_FOUNDER_BY_ID_QUERY,
        { id },
        (records) => {
          if (records.length === 0) return null;
          const record = records[0];
          const node = record.get('f').properties;
          const mentors = record.get('mentors');
          const investors = record.get('investors');
          return {
            ...node,
            skills: Array.isArray(node.skills) ? node.skills : [],
            topTech: Array.isArray(node.topTech) ? node.topTech : [],
            experienceYears: Number(node.experienceYears || 0),
            connectionCount: Number(node.connectionCount || 0),
            mentors: Array.isArray(mentors) ? mentors : [],
            investors: Array.isArray(investors) ? investors : [],
          } as Founder;
        }
      );

      return founder || mockFounders.find((f) => f.id === id) || null;
    } catch {
      return mockFounders.find((f) => f.id === id) || null;
    }
  }

  async create(founder: Founder): Promise<Founder> {
    const isConnected = await testCognoConnection();
    if (!isConnected) {
      mockFounders.unshift(founder);
      return founder;
    }

    return executeWrite(
      CREATE_FOUNDER_QUERY,
      { ...founder },
      (records) => records[0].get('f').properties as Founder
    );
  }

  async update(id: string, founder: Partial<Founder>): Promise<Founder | null> {
    const isConnected = await testCognoConnection();
    if (!isConnected) {
      const idx = mockFounders.findIndex((f) => f.id === id);
      if (idx !== -1) {
        mockFounders[idx] = { ...mockFounders[idx], ...founder };
        return mockFounders[idx];
      }
      return null;
    }

    return executeWrite(
      UPDATE_FOUNDER_QUERY,
      { id, ...founder },
      (records) => (records[0] ? (records[0].get('f').properties as Founder) : null)
    );
  }

  async delete(id: string): Promise<boolean> {
    const isConnected = await testCognoConnection();
    const idx = mockFounders.findIndex((f) => f.id === id);
    if (idx !== -1) {
      mockFounders.splice(idx, 1);
    }

    if (isConnected) {
      await executeWrite(DELETE_FOUNDER_QUERY, { id });
    }
    return true;
  }
}
