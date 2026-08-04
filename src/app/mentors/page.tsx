import React from 'react';
import { MentorService } from '@/lib/services/mentorService';
import { MentorsClient } from '@/components/client/MentorsClient';

export const revalidate = 0; // SSR

export default async function MentorsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const { search } = await searchParams;

  const mentorService = new MentorService();
  const mentors = await mentorService.getMentors({ search });

  return <MentorsClient initialMentors={mentors} />;
}
