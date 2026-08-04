import { NextRequest, NextResponse } from 'next/server';
import { FounderService } from '@/lib/services/founderService';
import { StartupService } from '@/lib/services/startupService';
import { InvestorService } from '@/lib/services/investorService';
import { MentorService } from '@/lib/services/mentorService';
import { TechnologyService } from '@/lib/services/technologyService';
import { IndustryService } from '@/lib/services/industryService';
import { handleApiError } from '@/lib/errors';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || searchParams.get('search') || '';
    const category = searchParams.get('category') || 'All';
    const page = Math.max(Number(searchParams.get('page') || 1), 1);
    const limit = Math.max(Number(searchParams.get('limit') || 20), 1);
    const sortBy = searchParams.get('sortBy') || 'name';
    const sortDir = (searchParams.get('sortDir') || 'asc').toLowerCase() === 'desc' ? 'desc' : 'asc';

    const founderService = new FounderService();
    const startupService = new StartupService();
    const investorService = new InvestorService();
    const mentorService = new MentorService();
    const techService = new TechnologyService();
    const indService = new IndustryService();

    const [founders, startups, investors, mentors, technologies, industries] = await Promise.all([
      category === 'All' || category === 'Founder' ? founderService.getFounders({ search: query, limit }) : Promise.resolve([]),
      category === 'All' || category === 'Startup' ? startupService.getStartups({ search: query, limit }) : Promise.resolve([]),
      category === 'All' || category === 'Investor' ? investorService.getInvestors({ search: query, limit }) : Promise.resolve([]),
      category === 'All' || category === 'Mentor' ? mentorService.getMentors({ search: query, limit }) : Promise.resolve([]),
      category === 'All' || category === 'Technology' ? techService.getTechnologies({ search: query, limit }) : Promise.resolve([]),
      category === 'All' || category === 'Industry' ? indService.getIndustries() : Promise.resolve([]),
    ]);

    const totalResults = founders.length + startups.length + investors.length + mentors.length + technologies.length + industries.length;

    return NextResponse.json({
      success: true,
      query,
      category,
      pagination: {
        page,
        limit,
        totalResults,
      },
      sorting: {
        sortBy,
        sortDir,
      },
      results: {
        founders,
        startups,
        investors,
        mentors,
        technologies,
        industries: query ? industries.filter((i) => i.name.toLowerCase().includes(query.toLowerCase())) : industries,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
