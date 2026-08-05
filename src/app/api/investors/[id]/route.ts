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

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const investorService = new InvestorService();
    const updated = await investorService.updateInvestor(id, body);

    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const investorService = new InvestorService();
    await investorService.deleteInvestor(id);

    return NextResponse.json({
      success: true,
      message: `Investor ${id} deleted successfully.`,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

