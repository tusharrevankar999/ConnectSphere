import { InvestorRepository } from '../repositories/investorRepository';
import { Investor } from '@/types';
import { NotFoundError } from '../errors';

export class InvestorService {
  private repo = new InvestorRepository();

  async getInvestors(options?: { search?: string; limit?: number }): Promise<Investor[]> {
    return this.repo.getAll(options);
  }

  async getInvestorById(id: string): Promise<Investor> {
    const investor = await this.repo.getById(id);
    if (!investor) {
      throw new NotFoundError(`Investor with ID '${id}' not found`);
    }
    return investor;
  }
}
