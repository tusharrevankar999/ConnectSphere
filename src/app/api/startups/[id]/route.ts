import { NextRequest, NextResponse } from 'next/server';
import { StartupService } from '@/lib/services/startupService';
import { handleApiError } from '@/lib/errors';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const startupService = new StartupService();
    const startup = await startupService.getStartupById(id);

    return NextResponse.json({
      success: true,
      data: startup,
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
    const startupService = new StartupService();
    const updated = await startupService.updateStartup(id, body);

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
    const startupService = new StartupService();
    await startupService.deleteStartup(id);

    return NextResponse.json({
      success: true,
      message: `Startup ${id} deleted successfully.`,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
