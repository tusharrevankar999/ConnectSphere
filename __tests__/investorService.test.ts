import { InvestorService } from '../src/lib/services/investorService';
import { Investor } from '../src/types';

describe('InvestorService Unit Tests', () => {
  let investorService: InvestorService;

  beforeEach(() => {
    investorService = new InvestorService();
  });

  test('getInvestors should return a list of investors', async () => {
    const investors = await investorService.getInvestors();
    expect(Array.isArray(investors)).toBe(true);
    expect(investors.length).toBeGreaterThan(0);
  });

  test('getInvestors with search filter should return matching investors', async () => {
    const investors = await investorService.getInvestors({ search: 'Sequoia' });
    expect(Array.isArray(investors)).toBe(true);
    const match = investors.some((i) =>
      i.name.toLowerCase().includes('sequoia') || i.firm.toLowerCase().includes('sequoia')
    );
    expect(match).toBe(true);
  });

  test('createInvestor should add a new investor node', async () => {
    const newInvestor: Investor = {
      id: `test-inv-${Date.now()}`,
      name: 'Test Investor',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
      firm: 'Test Capital',
      role: 'Managing Director',
      focusIndustries: ['Artificial Intelligence', 'Fintech & Payments'],
      portfolioCount: 15,
      recentInvestments: ['Test Startup A', 'Test Startup B'],
      ticketSize: '$1M - $3M',
      totalDeals: 22,
      bio: 'Testing investor creation via Jest',
    };

    const created = await investorService.createInvestor(newInvestor);
    expect(created.id).toBe(newInvestor.id);
    expect(created.name).toBe('Test Investor');
    expect(created.firm).toBe('Test Capital');
  });

  test('updateInvestor should modify investor properties', async () => {
    const updated = await investorService.updateInvestor('inv-1', {
      role: 'Senior Managing Partner',
      ticketSize: '$2M - $10M',
    });

    expect(updated).toBeDefined();
    expect(updated.role).toBe('Senior Managing Partner');
    expect(updated.ticketSize).toBe('$2M - $10M');
  });

  test('deleteInvestor should detach investor node', async () => {
    const result = await investorService.deleteInvestor('inv-2');
    expect(result).toBe(true);
  });

  test('getInvestorById should throw NotFoundError for invalid ID', async () => {
    await expect(investorService.getInvestorById('invalid-id-999')).rejects.toThrow();
  });
});
