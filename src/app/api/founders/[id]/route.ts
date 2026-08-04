import { NextRequest, NextResponse } from 'next/server';
import { FounderService } from '@/lib/services/founderService';
import { handleApiError } from '@/lib/errors';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const founderService = new FounderService();
    const founder = await founderService.getFounderById(id);

    return NextResponse.json({
      success: true,
      data: founder,
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
    const founderService = new FounderService();
    const updated = await founderService.updateFounder(id, body);

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
    const founderService = new FounderService();
    await founderService.deleteFounder(id);

    return NextResponse.json({
      success: true,
      message: `Founder ${id} deleted successfully.`,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
