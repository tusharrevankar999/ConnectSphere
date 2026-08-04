import { FounderService } from '../src/lib/services/founderService';
import { Founder } from '../src/types';

describe('FounderService Unit Tests', () => {
  let founderService: FounderService;

  beforeEach(() => {
    founderService = new FounderService();
  });

  test('getFounders should return a list of founders', async () => {
    const founders = await founderService.getFounders();
    expect(Array.isArray(founders)).toBe(true);
    expect(founders.length).toBeGreaterThan(0);
  });

  test('getFounders with search filter should return matching founders', async () => {
    const founders = await founderService.getFounders({ search: 'Alex' });
    expect(Array.isArray(founders)).toBe(true);
    const match = founders.some((f) => f.name.toLowerCase().includes('alex'));
    expect(match).toBe(true);
  });

  test('getFounders with industry filter should filter by industry', async () => {
    const founders = await founderService.getFounders({ industry: 'Artificial Intelligence' });
    expect(Array.isArray(founders)).toBe(true);
    founders.forEach((f) => {
      expect(f.industry).toBe('Artificial Intelligence');
    });
  });

  test('createFounder should add a new founder node', async () => {
    const newFounder: Founder = {
      id: `test-fnd-${Date.now()}`,
      name: 'Test Founder',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
      title: 'Founder & CEO',
      startupId: 'stp-test',
      startupName: 'Test Startup',
      bio: 'Testing founder creation',
      experienceYears: 7,
      industry: 'Artificial Intelligence',
      location: 'San Francisco, CA',
      skills: ['Testing', 'Jest'],
      connectionCount: 50,
      topTech: ['TypeScript', 'Jest'],
      mentors: [],
      investors: [],
      recentActivity: 'Created test founder',
    };

    const created = await founderService.createFounder(newFounder);
    expect(created.id).toBe(newFounder.id);
    expect(created.name).toBe('Test Founder');
  });

  test('updateFounder should update founder properties', async () => {
    const updated = await founderService.updateFounder('fnd-1', {
      title: 'Chief Executive Officer',
      location: 'New York, NY',
    });

    expect(updated).toBeDefined();
    expect(updated.title).toBe('Chief Executive Officer');
    expect(updated.location).toBe('New York, NY');
  });

  test('deleteFounder should remove a founder', async () => {
    const result = await founderService.deleteFounder('fnd-2');
    expect(result).toBe(true);
  });

  test('getFounderById should throw NotFoundError for invalid ID', async () => {
    await expect(founderService.getFounderById('invalid-id-999')).rejects.toThrow();
  });
});
