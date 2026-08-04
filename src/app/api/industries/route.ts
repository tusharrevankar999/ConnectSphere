import { NextResponse } from 'next/server';
import { IndustryService } from '@/lib/services/industryService';
import { handleApiError } from '@/lib/errors';

export async function GET() {
  try {
    const indService = new IndustryService();
    const industries = await indService.getIndustries();

    return NextResponse.json({
      success: true,
      count: industries.length,
      data: industries,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
