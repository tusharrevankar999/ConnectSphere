import { ResourceService } from '../src/lib/services/resourceService';
import { Resource } from '../src/types';

describe('ResourceService Unit Tests', () => {
  let resourceService: ResourceService;

  beforeEach(() => {
    resourceService = new ResourceService();
  });

  test('getResources should return a list of resources', async () => {
    const resources = await resourceService.getResources();
    expect(Array.isArray(resources)).toBe(true);
    expect(resources.length).toBeGreaterThan(0);
  });

  test('getResources with search filter should return matching resources', async () => {
    const resources = await resourceService.getResources({ search: 'Accounts Manager' });
    expect(Array.isArray(resources)).toBe(true);
    const match = resources.some((r) =>
      r.title.toLowerCase().includes('accounts') || r.category.toLowerCase().includes('accounts')
    );
    expect(match).toBe(true);
  });

  test('createResource should add a new resource profile', async () => {
    const newResource: Resource = {
      id: `test-res-${Date.now()}`,
      title: 'Test Accounts Manager',
      category: 'Accounts Manager',
      description: 'Testing resource creation via Jest',
      providerName: 'Test Provider',
      providerRole: 'Lead Manager',
      contactEmail: 'test@provider.io',
      contactPhone: '+1 (555) 019-2831',
      skills: ['Account Management', 'CRM', 'B2B'],
      rating: 4.9,
      availability: 'Available Now',
      location: 'San Francisco, CA',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    };

    const created = await resourceService.createResource(newResource);
    expect(created.id).toBe(newResource.id);
    expect(created.title).toBe('Test Accounts Manager');
  });


  test('updateResource should modify resource properties', async () => {
    const updated = await resourceService.updateResource('res-1', {
      location: 'New York, NY',
      availability: 'Limited Slots',
    });

    expect(updated).toBeDefined();
    expect(updated.location).toBe('New York, NY');
    expect(updated.availability).toBe('Limited Slots');
  });

  test('deleteResource should remove resource item', async () => {
    const result = await resourceService.deleteResource('res-2');
    expect(result).toBe(true);
  });


  test('getResourceById should throw NotFoundError for invalid ID', async () => {
    await expect(resourceService.getResourceById('invalid-id-999')).rejects.toThrow();
  });
});
