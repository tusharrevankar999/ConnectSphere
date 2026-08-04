import { NextResponse } from 'next/server';
import { seedCognoDatabase } from '@/lib/seed';
import { handleApiError } from '@/lib/errors';

export async function POST() {
  try {
    const result = await seedCognoDatabase();
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error || result.message }, { status: 500 });
    }
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}
