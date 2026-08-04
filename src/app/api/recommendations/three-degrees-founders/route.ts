import { NextRequest, NextResponse } from 'next/server';
import { RecommendationEngineService } from '@/lib/services/recommendationEngineService';
import { handleApiError } from '@/lib/errors';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const founderId = searchParams.get('founderId') || 'fnd-1';
    const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : 10;

    const engine = new RecommendationEngineService();
    const recommendations = await engine.getThreeDegreesFounders(founderId, limit);

    return NextResponse.json({
      success: true,
      graphTraversal: '1-to-3 Hop Graph Pattern: (FounderA)-[*1..3]-(FounderB)',
      count: recommendations.length,
      data: recommendations,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
