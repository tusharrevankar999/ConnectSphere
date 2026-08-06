import { executeRead, executeWrite, testCognoConnection } from '../cognodb';
import { 
  GET_ALL_MENTORS_QUERY, 
  GET_MENTOR_BY_ID_QUERY, 
  CREATE_MENTOR_QUERY, 
  UPDATE_MENTOR_QUERY, 
  DELETE_MENTOR_QUERY 
} from '../queries/mentorQueries';
import { Mentor } from '@/types';
import { mockMentors } from '@/data/mockData';

/**
 * Safely converts Neo4j Integer objects ({ low, high }), numeric strings, or primitives into JS numbers
 */
function toNum(val: any, fallback = 0): number {
  if (val === null || val === undefined) return fallback;
  if (typeof val === 'number') return val;
  if (typeof val === 'object' && val !== null) {
    if (typeof val.low === 'number') return val.low;
    if (typeof val.toNumber === 'function') return val.toNumber();
  }
  const parsed = Number(val);
  return isNaN(parsed) ? fallback : parsed;
}

/**
 * Ensures all Neo4j node properties are sanitized and numeric fields are plain JS primitives
 */
function formatMentorNode(node: any): Mentor {
  if (!node) return node;
  return {
    ...node,
    expertise: Array.isArray(node.expertise) ? node.expertise : [],
    technologies: Array.isArray(node.technologies) ? node.technologies : [],
    experienceYears: toNum(node.experienceYears, 0),
    startupsMentoredCount: toNum(node.startupsMentoredCount, 0),
    rating: toNum(node.rating, 5.0),
  };
}

export class MentorRepository {
  async getAll(options: { search?: string; limit?: number } = {}): Promise<Mentor[]> {
    const isConnected = await testCognoConnection();
    if (!isConnected) {
      return mockMentors.map(formatMentorNode).filter((m) =>
        !options.search ||
        m.name.toLowerCase().includes(options.search.toLowerCase()) ||
        m.company.toLowerCase().includes(options.search.toLowerCase())
      );
    }

    try {
      const dbMentors = await executeRead(
        GET_ALL_MENTORS_QUERY,
        {
          search: options.search || null,
          limit: options.limit || 50,
        },
        (records) => {
          return records.map((record) => {
            const node = record.get('m').properties;
            return formatMentorNode(node);
          });
        }
      );

      // Combine DB mentors with mockMentors to ensure full directory is visible
      const existingIds = new Set(dbMentors.map((m) => m.id));
      const existingNames = new Set(dbMentors.map((m) => m.name.toLowerCase()));

      const missingMockMentors = mockMentors
        .map(formatMentorNode)
        .filter((m) => !existingIds.has(m.id) && !existingNames.has(m.name.toLowerCase()));

      // Automatically seed missing system mentors to live Neo4j DB in background
      if (missingMockMentors.length > 0) {
        Promise.all(
          missingMockMentors.map((m) =>
            executeWrite(CREATE_MENTOR_QUERY, { ...m }).catch(() => {})
          )
        ).catch(() => {});
      }

      let combined = [...dbMentors, ...missingMockMentors];

      if (options.search) {
        const q = options.search.toLowerCase();
        combined = combined.filter((m) =>
          m.name.toLowerCase().includes(q) ||
          m.company.toLowerCase().includes(q) ||
          m.title.toLowerCase().includes(q)
        );
      }

      if (options.limit) {
        combined = combined.slice(0, options.limit);
      }

      return combined;
    } catch {
      return mockMentors.map(formatMentorNode);
    }
  }

  async getById(id: string): Promise<Mentor | null> {
    const isConnected = await testCognoConnection();
    if (!isConnected) {
      const found = mockMentors.find((m) => m.id === id);
      return found ? formatMentorNode(found) : null;
    }

    try {
      const mentor = await executeRead(
        GET_MENTOR_BY_ID_QUERY,
        { id },
        (records) => {
          if (records.length === 0) return null;
          const node = records[0].get('m').properties;
          return formatMentorNode(node);
        }
      );
      const fallback = mockMentors.find((m) => m.id === id);
      return mentor || (fallback ? formatMentorNode(fallback) : null);
    } catch {
      const fallback = mockMentors.find((m) => m.id === id);
      return fallback ? formatMentorNode(fallback) : null;
    }
  }

  async create(mentor: Mentor): Promise<Mentor> {
    const sanitizedMentor = formatMentorNode(mentor);
    const isConnected = await testCognoConnection();
    if (!isConnected) {
      mockMentors.unshift(sanitizedMentor);
      return sanitizedMentor;
    }

    return executeWrite(
      CREATE_MENTOR_QUERY,
      { ...sanitizedMentor },
      (records) => formatMentorNode(records[0].get('m').properties)
    );
  }

  async update(id: string, mentor: Partial<Mentor>): Promise<Mentor> {
    const existing = await this.getById(id);
    if (!existing) {
      throw new Error(`Mentor with id ${id} not found`);
    }

    const updated = formatMentorNode({ ...existing, ...mentor });

    const isConnected = await testCognoConnection();
    if (!isConnected) {
      const idx = mockMentors.findIndex((m) => m.id === id);
      if (idx !== -1) {
        mockMentors[idx] = updated;
      }
      return updated;
    }

    return executeWrite(
      UPDATE_MENTOR_QUERY,
      { ...updated, id },
      (records) => formatMentorNode(records[0].get('m').properties)
    );
  }

  async delete(id: string): Promise<boolean> {
    const isConnected = await testCognoConnection();
    if (!isConnected) {
      const idx = mockMentors.findIndex((m) => m.id === id);
      if (idx !== -1) {
        mockMentors.splice(idx, 1);
      }
      return true;
    }

    await executeWrite(
      DELETE_MENTOR_QUERY,
      { id },
      () => true
    );
    return true;
  }
}
