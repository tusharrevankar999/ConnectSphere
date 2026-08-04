import { NextRequest, NextResponse } from 'next/server';
import { RecommendationEngineService } from '@/lib/services/recommendationEngineService';
import { handleApiError } from '@/lib/errors';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startupId = searchParams.get('startupId') || 'stp-1';
    const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : 5;

    const engine = new RecommendationEngineService();
    const recommendations = await engine.getSimilarTechStartups(startupId, limit);

    return NextResponse.json({
      success: true,
      graphTraversal: 'Jaccard Tech Similarity: (StartupA)-[:USES_TECH]->(Tech)<-[:USES_TECH]-(StartupB)',
      count: recommendations.length,
      data: recommendations,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
