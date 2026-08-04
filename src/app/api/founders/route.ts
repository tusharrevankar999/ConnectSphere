import { NextRequest, NextResponse } from 'next/server';
import { FounderService } from '@/lib/services/founderService';
import { handleApiError, ValidationError } from '@/lib/errors';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || undefined;
    const industry = searchParams.get('industry') || undefined;
    const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : undefined;

    const founderService = new FounderService();
    const founders = await founderService.getFounders({ search, industry, limit });

    return NextResponse.json({
      success: true,
      count: founders.length,
      data: founders,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.name || !body.startupName) {
      throw new ValidationError('Name and startupName are required fields.');
    }

    const founderService = new FounderService();
    const created = await founderService.createFounder({
      id: body.id || `fnd-${Date.now()}`,
      ...body,
    });

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
