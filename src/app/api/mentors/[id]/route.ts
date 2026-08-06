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

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const mentorService = new MentorService();
    const updated = await mentorService.updateMentor(id, body);

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
    const mentorService = new MentorService();
    await mentorService.deleteMentor(id);

    return NextResponse.json({
      success: true,
      message: `Mentor ${id} deleted successfully.`,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
