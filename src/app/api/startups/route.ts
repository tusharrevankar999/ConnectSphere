import { NextRequest, NextResponse } from 'next/server';
import { StartupService } from '@/lib/services/startupService';
import { handleApiError, ValidationError } from '@/lib/errors';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || undefined;
    const stage = searchParams.get('stage') || undefined;
    const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : undefined;

    const startupService = new StartupService();
    const startups = await startupService.getStartups({ search, stage, limit });

    return NextResponse.json({
      success: true,
      count: startups.length,
      data: startups,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.name || !body.pitch) {
      throw new ValidationError('Name and pitch are required fields.');
    }

    const startupService = new StartupService();
    const created = await startupService.createStartup({
      id: body.id || `stp-${Date.now()}`,
      ...body,
    });

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
