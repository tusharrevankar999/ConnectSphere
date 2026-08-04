import { NextRequest, NextResponse } from 'next/server';
import { TechnologyService } from '@/lib/services/technologyService';
import { handleApiError } from '@/lib/errors';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const techService = new TechnologyService();
    const tech = await techService.getTechnologyById(id);

    return NextResponse.json({
      success: true,
      data: tech,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
