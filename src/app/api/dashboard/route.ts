import { NextResponse } from 'next/server';
import { FounderService } from '@/lib/services/founderService';
import { StartupService } from '@/lib/services/startupService';
import { InvestorService } from '@/lib/services/investorService';
import { MentorService } from '@/lib/services/mentorService';
import { TechnologyService } from '@/lib/services/technologyService';
import { IndustryService } from '@/lib/services/industryService';
import { mockActivities, mockRecommendations } from '@/data/mockData';
import { handleApiError } from '@/lib/errors';

export async function GET() {
  try {
    const founderService = new FounderService();
    const startupService = new StartupService();
    const investorService = new InvestorService();
    const mentorService = new MentorService();
    const techService = new TechnologyService();
    const indService = new IndustryService();

    const [founders, startups, investors, mentors, technologies, industries] = await Promise.all([
      founderService.getFounders(),
      startupService.getStartups(),
      investorService.getInvestors(),
      mentorService.getMentors(),
      techService.getTechnologies(),
      indService.getIndustries(),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          foundersCount: founders.length,
          startupsCount: startups.length,
          investorsCount: investors.length,
          mentorsCount: mentors.length,
          technologiesCount: technologies.length,
          industriesCount: industries.length,
        },
        recommendationsPreview: mockRecommendations,
        activitiesStream: mockActivities,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
