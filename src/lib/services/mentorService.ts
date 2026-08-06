import { MentorRepository } from '../repositories/mentorRepository';
import { Mentor } from '@/types';
import { NotFoundError } from '../errors';

export class MentorService {
  private repo = new MentorRepository();

  async getMentors(options?: { search?: string; limit?: number }): Promise<Mentor[]> {
    return this.repo.getAll(options);
  }

  async getMentorById(id: string): Promise<Mentor> {
    const mentor = await this.repo.getById(id);
    if (!mentor) {
      throw new NotFoundError(`Mentor with ID '${id}' not found`);
    }
    return mentor;
  }

  async createMentor(mentor: Omit<Mentor, 'id'> & { id?: string }): Promise<Mentor> {
    const mentorToCreate: Mentor = {
      id: mentor.id || `mnt-${Date.now()}`,
      ...mentor,
    };
    return this.repo.create(mentorToCreate);
  }

  async updateMentor(id: string, mentor: Partial<Mentor>): Promise<Mentor> {
    await this.getMentorById(id); // Throws NotFoundError if missing
    return this.repo.update(id, mentor);
  }

  async deleteMentor(id: string): Promise<void> {
    await this.getMentorById(id); // Throws NotFoundError if missing
    await this.repo.delete(id);
  }
}
