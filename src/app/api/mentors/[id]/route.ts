import { NextRequest, NextResponse } from 'next/server';
import { MentorService } from '@/lib/services/mentorService';
import { handleApiError } from '@/lib/errors';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const mentorService = new MentorService();
    const mentor = await mentorService.getMentorById(id);

    return NextResponse.json({
      success: true,
      data: mentor,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
