import { FounderRepository } from '../src/lib/repositories/founderRepository';
import { Founder } from '../src/types';

describe('FounderRepository Unit Tests', () => {
  let repo: FounderRepository;

  beforeEach(() => {
    repo = new FounderRepository();
  });

  test('getAll should return array of founders', async () => {
    const founders = await repo.getAll();
    expect(Array.isArray(founders)).toBe(true);
    expect(founders.length).toBeGreaterThan(0);
  });

  test('getAll with search query should filter founders by name', async () => {
    const founders = await repo.getAll({ search: 'Elena' });
    expect(founders.length).toBeGreaterThan(0);
    expect(founders[0].name).toContain('Elena');
  });

  test('create should add founder node', async () => {
    const testFounder: Founder = {
      id: `repo-test-${Date.now()}`,
      name: 'Repo Test Founder',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
      title: 'CTO',
      startupId: 'stp-repo',
      startupName: 'Repo Startup',
      bio: 'Testing repo create',
      experienceYears: 10,
      industry: 'DevTools & SaaS',
      location: 'New York, NY',
      skills: ['Go', 'Kubernetes'],
      connectionCount: 120,
      topTech: ['Go', 'Docker'],
      mentors: [],
      investors: [],
      recentActivity: 'Created repo test founder',
    };

    const created = await repo.create(testFounder);
    expect(created.id).toBe(testFounder.id);
    expect(created.name).toBe('Repo Test Founder');
  });

  test('update should modify existing founder', async () => {
    const updated = await repo.update('fnd-1', {
      bio: 'Updated bio via repository test',
    });

    expect(updated).not.toBeNull();
    if (updated) {
      expect(updated.bio).toBe('Updated bio via repository test');
    }
  });

  test('delete should remove founder', async () => {
    const success = await repo.delete('fnd-3');
    expect(success).toBe(true);
  });
});
