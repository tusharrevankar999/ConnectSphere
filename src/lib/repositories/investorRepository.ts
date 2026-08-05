import { executeRead, executeWrite, testCognoConnection } from '../cognodb';
import { 
  GET_ALL_INVESTORS_QUERY, 
  GET_INVESTOR_BY_ID_QUERY, 
  CREATE_INVESTOR_QUERY,
  UPDATE_INVESTOR_QUERY,
  DELETE_INVESTOR_QUERY
} from '../queries/investorQueries';
import { Investor } from '@/types';
import { mockInvestors } from '@/data/mockData';

export class InvestorRepository {
  async getAll(options: { search?: string; limit?: number } = {}): Promise<Investor[]> {
    const isConnected = await testCognoConnection();
    if (!isConnected) {
      return mockInvestors.filter((i) => {
        if (!options.search) return true;
        const q = options.search.toLowerCase();
        return (
          i.name.toLowerCase().includes(q) ||
          i.firm.toLowerCase().includes(q) ||
          i.role.toLowerCase().includes(q) ||
          i.focusIndustries.some((ind) => ind.toLowerCase().includes(q)) ||
          i.recentInvestments.some((rec) => rec.toLowerCase().includes(q))
        );
      });
    }

    try {
      const dbInvestors = await executeRead(
        GET_ALL_INVESTORS_QUERY,
        {
          search: options.search || null,
          limit: options.limit || 50,
        },
        (records) => {
          return records.map((record) => {
            const node = record.get('i').properties;
            return {
              ...node,
              focusIndustries: Array.isArray(node.focusIndustries) ? node.focusIndustries : [],
              recentInvestments: Array.isArray(node.recentInvestments) ? node.recentInvestments : [],
              portfolioCount: Number(node.portfolioCount || 0),
              totalDeals: Number(node.totalDeals || 0),
            } as Investor;
          });
        }
      );

      if (dbInvestors.length === 0 && !options.search) {
        return mockInvestors;
      }
      return dbInvestors;
    } catch {
      return mockInvestors;
    }
  }

  async getById(id: string): Promise<Investor | null> {
    const isConnected = await testCognoConnection();
    if (!isConnected) {
      return mockInvestors.find((i) => i.id === id) || null;
    }

    try {
      const inv = await executeRead(
        GET_INVESTOR_BY_ID_QUERY,
        { id },
        (records) => {
          if (records.length === 0) return null;
          const node = records[0].get('i').properties;
          return {
            ...node,
            focusIndustries: Array.isArray(node.focusIndustries) ? node.focusIndustries : [],
            recentInvestments: Array.isArray(node.recentInvestments) ? node.recentInvestments : [],
            portfolioCount: Number(node.portfolioCount || 0),
            totalDeals: Number(node.totalDeals || 0),
          } as Investor;
        }
      );
      return inv || mockInvestors.find((i) => i.id === id) || null;
    } catch {
      return mockInvestors.find((i) => i.id === id) || null;
    }
  }

  async create(investor: Investor): Promise<Investor> {
    const isConnected = await testCognoConnection();
    if (!isConnected) {
      mockInvestors.unshift(investor);
      return investor;
    }

    return executeWrite(
      CREATE_INVESTOR_QUERY,
      { ...investor },
      (records) => records[0].get('i').properties as Investor
    );
  }

  async update(id: string, investor: Partial<Investor>): Promise<Investor | null> {
    const isConnected = await testCognoConnection();
    if (!isConnected) {
      const idx = mockInvestors.findIndex((i) => i.id === id);
      if (idx !== -1) {
        mockInvestors[idx] = { ...mockInvestors[idx], ...investor };
        return mockInvestors[idx];
      }
      return null;
    }

    return executeWrite(
      UPDATE_INVESTOR_QUERY,
      { id, ...investor },
      (records) => (records[0] ? (records[0].get('i').properties as Investor) : null)
    );
  }

  async delete(id: string): Promise<boolean> {
    const isConnected = await testCognoConnection();
    const idx = mockInvestors.findIndex((i) => i.id === id);
    if (idx !== -1) {
      mockInvestors.splice(idx, 1);
    }

    if (isConnected) {
      await executeWrite(DELETE_INVESTOR_QUERY, { id });
    }
    return true;
  }
}

