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
