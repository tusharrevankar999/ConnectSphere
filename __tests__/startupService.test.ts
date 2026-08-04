import { StartupService } from '../src/lib/services/startupService';
import { Startup } from '../src/types';

describe('StartupService Unit Tests', () => {
  let startupService: StartupService;

  beforeEach(() => {
    startupService = new StartupService();
  });

  test('getStartups should return list of startups', async () => {
    const startups = await startupService.getStartups();
    expect(Array.isArray(startups)).toBe(true);
    expect(startups.length).toBeGreaterThan(0);
  });

  test('getStartups with search query should filter matching startups', async () => {
    const startups = await startupService.getStartups({ search: 'Neural' });
    expect(Array.isArray(startups)).toBe(true);
    expect(startups.length).toBeGreaterThan(0);
  });

  test('createStartup should add new startup node', async () => {
    const newStartup: Startup = {
      id: `test-stp-${Date.now()}`,
      name: 'Test AI Startup',
      logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe',
      pitch: 'Testing startup creation via Jest',
      industry: 'Artificial Intelligence',
      fundingStage: 'Seed',
      teamSize: 15,
      valuation: '$20M',
      totalFunding: '$3.5M',
      techStack: ['Next.js 15', 'TypeScript', 'Jest'],
      founderIds: [],
      founderNames: [],
      investorNames: [],
      website: 'https://test-ai.io',
      foundedYear: 2024,
    };

    const created = await startupService.createStartup(newStartup);
    expect(created.id).toBe(newStartup.id);
    expect(created.name).toBe('Test AI Startup');
  });

  test('updateStartup should modify startup properties', async () => {
    const updated = await startupService.updateStartup('stp-1', {
      valuation: '$35M',
      totalFunding: '$6.0M',
    });

    expect(updated).toBeDefined();
    expect(updated.valuation).toBe('$35M');
  });

  test('deleteStartup should detach startup node', async () => {
    const result = await startupService.deleteStartup('stp-2');
    expect(result).toBe(true);
  });
});
