import { executeRead, executeWrite, testCognoConnection } from '../cognodb';
import { GET_ALL_INDUSTRIES_QUERY, GET_INDUSTRY_BY_ID_QUERY, CREATE_INDUSTRY_QUERY } from '../queries/industryQueries';
import { Industry } from '@/types';
import { mockIndustries } from '@/data/mockData';

export class IndustryRepository {
  async getAll(): Promise<Industry[]> {
    const isConnected = await testCognoConnection();
    if (!isConnected) {
      return mockIndustries;
    }

    return executeRead(
      GET_ALL_INDUSTRIES_QUERY,
      {},
      (records) => {
        return records.map((record) => {
          const node = record.get('i').properties;
          return {
            ...node,
            startupCount: Number(node.startupCount || 0),
          } as Industry;
        });
      }
    );
  }

  async getById(id: string): Promise<Industry | null> {
    const isConnected = await testCognoConnection();
    if (!isConnected) {
      return mockIndustries.find((i) => i.id === id) || null;
    }

    return executeRead(
      GET_INDUSTRY_BY_ID_QUERY,
      { id },
      (records) => {
        if (records.length === 0) return null;
        const node = records[0].get('i').properties;
        return {
          ...node,
          startupCount: Number(node.startupCount || 0),
        } as Industry;
      }
    );
  }

  async create(industry: Industry): Promise<Industry> {
    const isConnected = await testCognoConnection();
    if (!isConnected) {
      mockIndustries.push(industry);
      return industry;
    }

    return executeWrite(
      CREATE_INDUSTRY_QUERY,
      { ...industry },
      (records) => records[0].get('i').properties as Industry
    );
  }
}
