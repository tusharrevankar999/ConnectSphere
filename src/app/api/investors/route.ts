import { NextRequest, NextResponse } from 'next/server';
import { InvestorService } from '@/lib/services/investorService';
import { handleApiError } from '@/lib/errors';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || undefined;
    const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : undefined;

    const investorService = new InvestorService();
    const investors = await investorService.getInvestors({ search, limit });

    return NextResponse.json({
      success: true,
      count: investors.length,
      data: investors,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
