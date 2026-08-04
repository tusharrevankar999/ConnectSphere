import { NextRequest, NextResponse } from 'next/server';
import { InvestorService } from '@/lib/services/investorService';
import { handleApiError } from '@/lib/errors';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const investorService = new InvestorService();
    const investor = await investorService.getInvestorById(id);

    return NextResponse.json({
      success: true,
      data: investor,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
