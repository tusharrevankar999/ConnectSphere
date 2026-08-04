import { TechnologyRepository } from '../repositories/technologyRepository';
import { Technology } from '@/types';
import { NotFoundError } from '../errors';

export class TechnologyService {
  private repo = new TechnologyRepository();

  async getTechnologies(options?: { search?: string; limit?: number }): Promise<Technology[]> {
    return this.repo.getAll(options);
  }

  async getTechnologyById(id: string): Promise<Technology> {
    const tech = await this.repo.getById(id);
    if (!tech) {
      throw new NotFoundError(`Technology with ID '${id}' not found`);
    }
    return tech;
  }
}
