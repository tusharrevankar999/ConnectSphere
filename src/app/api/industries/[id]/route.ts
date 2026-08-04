import { NextRequest, NextResponse } from 'next/server';
import { IndustryService } from '@/lib/services/industryService';
import { handleApiError } from '@/lib/errors';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const indService = new IndustryService();
    const industry = await indService.getIndustryById(id);

    return NextResponse.json({
      success: true,
      data: industry,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
