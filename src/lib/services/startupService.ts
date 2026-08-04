import { StartupRepository } from '../repositories/startupRepository';
import { Startup } from '@/types';
import { NotFoundError } from '../errors';

export class StartupService {
  private repo = new StartupRepository();

  async getStartups(options?: { search?: string; stage?: string; limit?: number }): Promise<Startup[]> {
    return this.repo.getAll(options);
  }

  async getStartupById(id: string): Promise<Startup> {
    const startup = await this.repo.getById(id);
    if (!startup) {
      throw new NotFoundError(`Startup with ID '${id}' not found`);
    }
    return startup;
  }

  async createStartup(data: Startup): Promise<Startup> {
    return this.repo.create(data);
  }

  async updateStartup(id: string, data: Partial<Startup>): Promise<Startup> {
    const updated = await this.repo.update(id, data);
    if (!updated) {
      throw new NotFoundError(`Startup with ID '${id}' not found`);
    }
    return updated;
  }

  async deleteStartup(id: string): Promise<boolean> {
    return this.repo.delete(id);
  }
}
