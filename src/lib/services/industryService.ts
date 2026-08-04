import { IndustryRepository } from '../repositories/industryRepository';
import { Industry } from '@/types';
import { NotFoundError } from '../errors';

export class IndustryService {
  private repo = new IndustryRepository();

  async getIndustries(): Promise<Industry[]> {
    return this.repo.getAll();
  }

  async getIndustryById(id: string): Promise<Industry> {
    const ind = await this.repo.getById(id);
    if (!ind) {
      throw new NotFoundError(`Industry with ID '${id}' not found`);
    }
    return ind;
  }
}
