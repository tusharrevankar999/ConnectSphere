import { NextRequest, NextResponse } from 'next/server';
import { RecommendationEngineService } from '@/lib/services/recommendationEngineService';
import { handleApiError } from '@/lib/errors';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const founderId = searchParams.get('founderId') || 'fnd-1';
    const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : 5;

    const engine = new RecommendationEngineService();
    const recommendations = await engine.getMentorsForFounder(founderId, limit);

    return NextResponse.json({
      success: true,
      graphTraversal: '2-Hop Traversal: (Founder)-[:FOUNDED]->(Startup)-[:USES_TECH]->(Technology)<-[:USES_TECH]-(Mentor)',
      count: recommendations.length,
      data: recommendations,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
