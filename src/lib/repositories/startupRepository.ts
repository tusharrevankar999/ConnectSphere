import { executeRead, executeWrite, testCognoConnection } from '../cognodb';
import { 
  GET_ALL_STARTUPS_QUERY, 
  GET_STARTUP_BY_ID_QUERY, 
  CREATE_STARTUP_QUERY,
  UPDATE_STARTUP_QUERY,
  DELETE_STARTUP_QUERY 
} from '../queries/startupQueries';
import { Startup } from '@/types';
import { mockStartups } from '@/data/mockData';

export class StartupRepository {
  async getAll(options: { search?: string; stage?: string; limit?: number } = {}): Promise<Startup[]> {
    const isConnected = await testCognoConnection();
    if (!isConnected) {
      return mockStartups.filter((s) => {
        const matchesSearch = !options.search || s.name.toLowerCase().includes(options.search.toLowerCase()) || s.industry.toLowerCase().includes(options.search.toLowerCase());
        const matchesStage = !options.stage || options.stage === 'All' || s.fundingStage === options.stage;
        return matchesSearch && matchesStage;
      });
    }

    try {
      const dbStartups = await executeRead(
        GET_ALL_STARTUPS_QUERY,
        {
          search: options.search || null,
          stage: options.stage || null,
          limit: options.limit || 50,
        },
        (records) => {
          return records.map((record) => {
            const node = record.get('s').properties;
            const founderNames = record.get('founderNames');
            const investorNames = record.get('investorNames');
            return {
              ...node,
              techStack: Array.isArray(node.techStack) ? node.techStack : [],
              teamSize: Number(node.teamSize || 0),
              foundedYear: Number(node.foundedYear || 2024),
              founderNames: Array.isArray(founderNames) ? founderNames : [],
              investorNames: Array.isArray(investorNames) ? investorNames : [],
            } as Startup;
          });
        }
      );

      if (dbStartups.length === 0 && !options.search && (!options.stage || options.stage === 'All')) {
        return mockStartups;
      }
      return dbStartups;
    } catch {
      return mockStartups;
    }
  }

  async getById(id: string): Promise<Startup | null> {
    const isConnected = await testCognoConnection();
    if (!isConnected) {
      return mockStartups.find((s) => s.id === id) || null;
    }

    try {
      const startup = await executeRead(
        GET_STARTUP_BY_ID_QUERY,
        { id },
        (records) => {
          if (records.length === 0) return null;
          const record = records[0];
          const node = record.get('s').properties;
          const founderNames = record.get('founderNames');
          const investorNames = record.get('investorNames');
          return {
            ...node,
            techStack: Array.isArray(node.techStack) ? node.techStack : [],
            teamSize: Number(node.teamSize || 0),
            foundedYear: Number(node.foundedYear || 2024),
            founderNames: Array.isArray(founderNames) ? founderNames : [],
            investorNames: Array.isArray(investorNames) ? investorNames : [],
          } as Startup;
        }
      );
      return startup || mockStartups.find((s) => s.id === id) || null;
    } catch {
      return mockStartups.find((s) => s.id === id) || null;
    }
  }

  async create(startup: Startup): Promise<Startup> {
    const isConnected = await testCognoConnection();
    if (!isConnected) {
      mockStartups.unshift(startup);
      return startup;
    }

    return executeWrite(
      CREATE_STARTUP_QUERY,
      { ...startup },
      (records) => records[0].get('s').properties as Startup
    );
  }

  async update(id: string, startup: Partial<Startup>): Promise<Startup | null> {
    const isConnected = await testCognoConnection();
    if (!isConnected) {
      const idx = mockStartups.findIndex((s) => s.id === id);
      if (idx !== -1) {
        mockStartups[idx] = { ...mockStartups[idx], ...startup };
        return mockStartups[idx];
      }
      return null;
    }

    return executeWrite(
      UPDATE_STARTUP_QUERY,
      { id, ...startup },
      (records) => (records[0] ? (records[0].get('s').properties as Startup) : null)
    );
  }

  async delete(id: string): Promise<boolean> {
    const isConnected = await testCognoConnection();
    const idx = mockStartups.findIndex((s) => s.id === id);
    if (idx !== -1) {
      mockStartups.splice(idx, 1);
    }

    if (isConnected) {
      await executeWrite(DELETE_STARTUP_QUERY, { id });
    }
    return true;
  }
}
