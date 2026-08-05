import { NextRequest, NextResponse } from 'next/server';
import { ResourceService } from '@/lib/services/resourceService';
import { handleApiError } from '@/lib/errors';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const resourceService = new ResourceService();
    const resource = await resourceService.getResourceById(id);

    return NextResponse.json({
      success: true,
      data: resource,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const resourceService = new ResourceService();
    const updated = await resourceService.updateResource(id, body);

    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const resourceService = new ResourceService();
    await resourceService.deleteResource(id);

    return NextResponse.json({
      success: true,
      message: `Resource ${id} deleted successfully.`,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
