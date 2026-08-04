import { RecommendationEngineService } from '../src/lib/services/recommendationEngineService';

describe('RecommendationEngineService Unit Tests', () => {
  let engine: RecommendationEngineService;

  beforeEach(() => {
    engine = new RecommendationEngineService();
  });

  test('getInvestorsForFounder should return 2-hop industry matched investors', async () => {
    const recs = await engine.getInvestorsForFounder('fnd-1', 5);
    expect(Array.isArray(recs)).toBe(true);
    expect(recs.length).toBeGreaterThan(0);
    expect(recs[0]).toHaveProperty('investor');
    expect(recs[0]).toHaveProperty('matchScore');
    expect(recs[0]).toHaveProperty('reason');
  });

  test('getMentorsForFounder should return 2-hop tech stack matched mentors', async () => {
    const recs = await engine.getMentorsForFounder('fnd-1', 5);
    expect(Array.isArray(recs)).toBe(true);
    expect(recs.length).toBeGreaterThan(0);
    expect(recs[0]).toHaveProperty('mentor');
    expect(recs[0]).toHaveProperty('matchScore');
    expect(recs[0]).toHaveProperty('reason');
  });

  test('getSimilarTechStartups should return startups with shared technology stack', async () => {
    const recs = await engine.getSimilarTechStartups('stp-1', 5);
    expect(Array.isArray(recs)).toBe(true);
    expect(recs.length).toBeGreaterThan(0);
    expect(recs[0]).toHaveProperty('startup');
    expect(recs[0]).toHaveProperty('sharedTechCount');
  });

  test('getMutualFounders should return friend-of-friend mutual founder connections', async () => {
    const recs = await engine.getMutualFounders('fnd-1', 5);
    expect(Array.isArray(recs)).toBe(true);
    expect(recs.length).toBeGreaterThan(0);
    expect(recs[0]).toHaveProperty('founder');
    expect(recs[0]).toHaveProperty('mutualCount');
  });

  test('getThreeDegreesFounders should return founders within 3 degrees of separation', async () => {
    const recs = await engine.getThreeDegreesFounders('fnd-1', 10);
    expect(Array.isArray(recs)).toBe(true);
    expect(recs.length).toBeGreaterThan(0);
    expect(recs[0]).toHaveProperty('degreeOfSeparation');
  });

  test('getShortestPath should return shortest relationship path between two founders', async () => {
    const pathResult = await engine.getShortestPath('fnd-1', 'fnd-3');
    expect(pathResult).toHaveProperty('pathLength');
    expect(pathResult).toHaveProperty('nodes');
    expect(pathResult).toHaveProperty('relationships');
    expect(Array.isArray(pathResult.nodes)).toBe(true);
    expect(Array.isArray(pathResult.relationships)).toBe(true);
  });
});
