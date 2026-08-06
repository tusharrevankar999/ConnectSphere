import { NextRequest, NextResponse } from 'next/server';
import { MentorService } from '@/lib/services/mentorService';
import { handleApiError } from '@/lib/errors';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || undefined;
    const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : undefined;

    const mentorService = new MentorService();
    const mentors = await mentorService.getMentors({ search, limit });

    return NextResponse.json({
      success: true,
      count: mentors.length,
      data: mentors,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.name || !body.company) {
      throw new Error('Name and company are required fields for creating a mentor.');
    }

    const mentorService = new MentorService();
    const created = await mentorService.createMentor({
      id: body.id || `mnt-${Date.now()}`,
      ...body,
    });

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
