import { executeRead, testCognoConnection } from '../cognodb';
import {
  RECOMMEND_INVESTORS_FOR_FOUNDER_QUERY,
  RECOMMEND_MENTORS_FOR_FOUNDER_QUERY,
  RECOMMEND_SIMILAR_TECH_STARTUPS_QUERY,
  RECOMMEND_MUTUAL_FOUNDERS_QUERY,
  THREE_DEGREES_FOUNDERS_QUERY,
  SHORTEST_PATH_QUERY,
  RECOMMEND_INVESTORS_FOR_INDUSTRY_QUERY
} from '../queries/recommendationEngineQueries';
import { mockInvestors, mockMentors, mockStartups, mockFounders } from '@/data/mockData';

export class RecommendationEngineService {
  async getInvestorsForFounder(founderId: string, limit = 5) {
    const isConnected = await testCognoConnection();
    if (!isConnected) {
      return mockInvestors.slice(0, limit).map((inv) => ({
        investor: inv,
        matchScore: 95,
        reason: `Matched via target industry ${inv.focusIndustries[0] || 'AI'}`,
      }));
    }

    return executeRead(
      RECOMMEND_INVESTORS_FOR_FOUNDER_QUERY,
      { founderId, limit },
      (records) =>
        records.map((r) => ({
          investor: r.get('inv').properties,
          matchScore: 90 + Math.min(Number(r.get('score')) * 5, 10),
          reason: `Matched via target industries: ${r.get('matchedIndustries').join(', ')}`,
        }))
    );
  }

  async getMentorsForFounder(founderId: string, limit = 5) {
    const isConnected = await testCognoConnection();
    if (!isConnected) {
      return mockMentors.slice(0, limit).map((m) => ({
        mentor: m,
        matchScore: 92,
        reason: `Shared tech stack expertise in ${m.technologies.slice(0, 2).join(', ')}`,
      }));
    }

    return executeRead(
      RECOMMEND_MENTORS_FOR_FOUNDER_QUERY,
      { founderId, limit },
      (records) =>
        records.map((r) => ({
          mentor: r.get('m').properties,
          matchScore: 85 + Math.min(Number(r.get('score')) * 5, 14),
          reason: `Shared technology nodes: ${r.get('sharedTechnologies').join(', ')}`,
        }))
    );
  }

  async getSimilarTechStartups(startupId: string, limit = 5) {
    const isConnected = await testCognoConnection();
    if (!isConnected) {
      return mockStartups.filter((s) => s.id !== startupId).slice(0, limit).map((s) => ({
        startup: s,
        sharedTechCount: 3,
        sharedTech: s.techStack.slice(0, 3),
      }));
    }

    return executeRead(
      RECOMMEND_SIMILAR_TECH_STARTUPS_QUERY,
      { startupId, limit },
      (records) =>
        records.map((r) => ({
          startup: r.get('s2').properties,
          sharedTechCount: Number(r.get('sharedTechCount')),
          sharedTech: r.get('sharedTech'),
        }))
    );
  }

  async getMutualFounders(founderId: string, limit = 5) {
    const isConnected = await testCognoConnection();
    if (!isConnected) {
      return mockFounders.filter((f) => f.id !== founderId).slice(0, limit).map((f) => ({
        founder: f,
        mutualCount: 2,
        mutualNames: ['Elena Rostova', 'Marcus Chen'],
      }));
    }

    return executeRead(
      RECOMMEND_MUTUAL_FOUNDERS_QUERY,
      { founderId, limit },
      (records) =>
        records.map((r) => ({
          founder: r.get('f2').properties,
          mutualCount: Number(r.get('mutualCount')),
          mutualNames: r.get('mutualNames'),
        }))
    );
  }

  async getThreeDegreesFounders(founderId: string, limit = 10) {
    const isConnected = await testCognoConnection();
    if (!isConnected) {
      return mockFounders.filter((f) => f.id !== founderId).slice(0, limit).map((f, i) => ({
        founder: f,
        degreeOfSeparation: (i % 3) + 1,
      }));
    }

    return executeRead(
      THREE_DEGREES_FOUNDERS_QUERY,
      { founderId, limit },
      (records) =>
        records.map((r) => ({
          founder: r.get('f2').properties,
          degreeOfSeparation: Number(r.get('distance')),
        }))
    );
  }

  async getShortestPath(fromFounderId: string, toFounderId: string) {
    const isConnected = await testCognoConnection();
    if (!isConnected) {
      return {
        pathLength: 2,
        nodes: [
          { id: fromFounderId, label: 'Founder A', type: 'Founder' },
          { id: 'stp-1', label: 'NeuralFlow AI', type: 'Startup' },
          { id: toFounderId, label: 'Founder B', type: 'Founder' },
        ],
        relationships: [
          { type: 'FOUNDED', source: fromFounderId, target: 'stp-1' },
          { type: 'FOUNDED', source: toFounderId, target: 'stp-1' },
        ],
      };
    }

    return executeRead(
      SHORTEST_PATH_QUERY,
      { fromFounderId, toFounderId },
      (records) => {
        if (records.length === 0) {
          return { pathLength: 0, nodes: [], relationships: [] };
        }
        const r = records[0];
        return {
          pathLength: Number(r.get('pathLength')),
          nodes: r.get('nodes'),
          relationships: r.get('relationships'),
        };
      }
    );
  }

  async getInvestorsForIndustry(startupId: string, limit = 5) {
    const isConnected = await testCognoConnection();
    if (!isConnected) {
      return mockInvestors.slice(0, limit).map((inv) => ({
        investor: inv,
        industryName: 'Artificial Intelligence',
      }));
    }

    return executeRead(
      RECOMMEND_INVESTORS_FOR_INDUSTRY_QUERY,
      { startupId, limit },
      (records) =>
        records.map((r) => ({
          investor: r.get('inv').properties,
          industryName: r.get('industryName'),
        }))
    );
  }
}
