import { NextRequest, NextResponse } from 'next/server';
import { InvestorService } from '@/lib/services/investorService';
import { handleApiError, ValidationError } from '@/lib/errors';

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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.name || !body.firm) {
      throw new ValidationError('Name and firm are required fields.');
    }

    const investorService = new InvestorService();
    const created = await investorService.createInvestor({
      id: body.id || `inv-${Date.now()}`,
      ...body,
    });

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}

