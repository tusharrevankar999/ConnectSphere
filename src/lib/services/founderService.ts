import { FounderRepository } from '../repositories/founderRepository';
import { Founder } from '@/types';
import { NotFoundError } from '../errors';

export class FounderService {
  private repo = new FounderRepository();

  async getFounders(options?: { search?: string; industry?: string; limit?: number }): Promise<Founder[]> {
    return this.repo.getAll(options);
  }

  async getFounderById(id: string): Promise<Founder> {
    const founder = await this.repo.getById(id);
    if (!founder) {
      throw new NotFoundError(`Founder with ID '${id}' not found`);
    }
    return founder;
  }

  async createFounder(data: Founder): Promise<Founder> {
    return this.repo.create(data);
  }

  async updateFounder(id: string, data: Partial<Founder>): Promise<Founder> {
    const updated = await this.repo.update(id, data);
    if (!updated) {
      throw new NotFoundError(`Founder with ID '${id}' not found`);
    }
    return updated;
  }

  async deleteFounder(id: string): Promise<boolean> {
    return this.repo.delete(id);
  }
}
