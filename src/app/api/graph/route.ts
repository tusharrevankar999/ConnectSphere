import { NextRequest, NextResponse } from 'next/server';
import { GraphService } from '@/lib/services/graphService';
import { handleApiError } from '@/lib/errors';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || undefined;
    const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : undefined;

    const graphService = new GraphService();
    const topology = await graphService.getTopology(type, limit);

    return NextResponse.json({
      success: true,
      data: topology,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
