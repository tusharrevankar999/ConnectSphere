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
}
