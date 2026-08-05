import { NextRequest, NextResponse } from 'next/server';
import { ResourceService } from '@/lib/services/resourceService';
import { handleApiError, ValidationError } from '@/lib/errors';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || undefined;
    const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : undefined;

    const resourceService = new ResourceService();
    const resources = await resourceService.getResources({ search, limit });


    return NextResponse.json({
      success: true,
      count: resources.length,
      data: resources,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.title || !body.providerName) {
      throw new ValidationError('Title and providerName are required fields.');
    }

    const resourceService = new ResourceService();
    const created = await resourceService.createResource({
      id: body.id || `res-${Date.now()}`,
      ...body,
    });

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
