import { NextRequest, NextResponse } from 'next/server';
import { mockRecommendations } from '@/data/mockData';
import { handleApiError } from '@/lib/errors';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const entityType = searchParams.get('entityType');

    const filtered = entityType && entityType !== 'All'
      ? mockRecommendations.filter((r) => r.entityType === entityType)
      : mockRecommendations;

    return NextResponse.json({
      success: true,
      count: filtered.length,
      data: filtered,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
