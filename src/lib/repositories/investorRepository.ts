import { executeRead, executeWrite, testCognoConnection } from '../cognodb';
import { GET_ALL_INVESTORS_QUERY, GET_INVESTOR_BY_ID_QUERY, CREATE_INVESTOR_QUERY } from '../queries/investorQueries';
import { Investor } from '@/types';
import { mockInvestors } from '@/data/mockData';

export class InvestorRepository {
  async getAll(options: { search?: string; limit?: number } = {}): Promise<Investor[]> {
    const isConnected = await testCognoConnection();
    if (!isConnected) {
      return mockInvestors.filter((i) =>
        !options.search || i.name.toLowerCase().includes(options.search.toLowerCase()) || i.firm.toLowerCase().includes(options.search.toLowerCase())
      );
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
      mockInvestors.push(investor);
      return investor;
    }

    return executeWrite(
      CREATE_INVESTOR_QUERY,
      { ...investor },
      (records) => records[0].get('i').properties as Investor
    );
  }
}
