import { ResourceRepository } from '../repositories/resourceRepository';
import { Resource } from '@/types';
import { NotFoundError } from '../errors';

export class ResourceService {
  private repo = new ResourceRepository();

  async getResources(options?: { search?: string; limit?: number }): Promise<Resource[]> {

    return this.repo.getAll(options);
  }

  async getResourceById(id: string): Promise<Resource> {
    const resource = await this.repo.getById(id);
    if (!resource) {
      throw new NotFoundError(`Resource with ID '${id}' not found`);
    }
    return resource;
  }

  async createResource(data: Resource): Promise<Resource> {
    return this.repo.create(data);
  }

  async updateResource(id: string, data: Partial<Resource>): Promise<Resource> {
    const updated = await this.repo.update(id, data);
    if (!updated) {
      throw new NotFoundError(`Resource with ID '${id}' not found`);
    }
    return updated;
  }

  async deleteResource(id: string): Promise<boolean> {
    return this.repo.delete(id);
  }
}
