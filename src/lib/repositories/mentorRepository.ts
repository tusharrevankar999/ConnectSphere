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

export class MentorRepository {
  async getAll(options: { search?: string; limit?: number } = {}): Promise<Mentor[]> {
    const isConnected = await testCognoConnection();
    if (!isConnected) {
      return mockMentors.filter((m) =>
        !options.search || m.name.toLowerCase().includes(options.search.toLowerCase()) || m.company.toLowerCase().includes(options.search.toLowerCase())
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
            return {
              ...node,
              expertise: Array.isArray(node.expertise) ? node.expertise : [],
              technologies: Array.isArray(node.technologies) ? node.technologies : [],
              experienceYears: Number(node.experienceYears || 0),
              startupsMentoredCount: Number(node.startupsMentoredCount || 0),
              rating: Number(node.rating || 5.0),
            } as Mentor;
          });
        }
      );

      if (dbMentors.length === 0 && !options.search) {
        return mockMentors;
      }
      return dbMentors;
    } catch {
      return mockMentors;
    }
  }

  async getById(id: string): Promise<Mentor | null> {
    const isConnected = await testCognoConnection();
    if (!isConnected) {
      return mockMentors.find((m) => m.id === id) || null;
    }

    try {
      const mentor = await executeRead(
        GET_MENTOR_BY_ID_QUERY,
        { id },
        (records) => {
          if (records.length === 0) return null;
          const node = records[0].get('m').properties;
          return {
            ...node,
            expertise: Array.isArray(node.expertise) ? node.expertise : [],
            technologies: Array.isArray(node.technologies) ? node.technologies : [],
            experienceYears: Number(node.experienceYears || 0),
            startupsMentoredCount: Number(node.startupsMentoredCount || 0),
            rating: Number(node.rating || 5.0),
          } as Mentor;
        }
      );
      return mentor || mockMentors.find((m) => m.id === id) || null;
    } catch {
      return mockMentors.find((m) => m.id === id) || null;
    }
  }

  async create(mentor: Mentor): Promise<Mentor> {
    const isConnected = await testCognoConnection();
    if (!isConnected) {
      mockMentors.push(mentor);
      return mentor;
    }

    return executeWrite(
      CREATE_MENTOR_QUERY,
      { ...mentor },
      (records) => records[0].get('m').properties as Mentor
    );
  }

  async update(id: string, mentor: Partial<Mentor>): Promise<Mentor> {
    const existing = await this.getById(id);
    if (!existing) {
      throw new Error(`Mentor with id ${id} not found`);
    }

    const updated = { ...existing, ...mentor };

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
      (records) => records[0].get('m').properties as Mentor
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
