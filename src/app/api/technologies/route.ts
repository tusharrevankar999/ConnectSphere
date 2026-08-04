import { NextRequest, NextResponse } from 'next/server';
import { TechnologyService } from '@/lib/services/technologyService';
import { handleApiError } from '@/lib/errors';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || undefined;
    const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : undefined;

    const techService = new TechnologyService();
    const technologies = await techService.getTechnologies({ search, limit });

    return NextResponse.json({
      success: true,
      count: technologies.length,
      data: technologies,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
