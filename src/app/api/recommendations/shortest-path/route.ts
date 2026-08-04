import { NextRequest, NextResponse } from 'next/server';
import { RecommendationEngineService } from '@/lib/services/recommendationEngineService';
import { handleApiError, ValidationError } from '@/lib/errors';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fromId = searchParams.get('fromId') || 'fnd-1';
    const toId = searchParams.get('toId') || 'fnd-3';

    if (!fromId || !toId) {
      throw new ValidationError('Both fromId and toId parameters are required.');
    }

    const engine = new RecommendationEngineService();
    const result = await engine.getShortestPath(fromId, toId);

    return NextResponse.json({
      success: true,
      graphAlgorithm: 'Cypher shortestPath((from)-[*..6]-(to))',
      data: result,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
