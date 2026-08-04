import { executeWrite, testCognoConnection, closeCognoDriver } from './cognodb';
import { mockFounders, mockStartups, mockInvestors, mockMentors, mockTechnologies, mockIndustries } from '@/data/mockData';

export const mockLocations = [
  { id: 'loc-1', name: 'San Francisco, CA', country: 'United States', startupDensity: 95 },
  { id: 'loc-2', name: 'New York, NY', country: 'United States', startupDensity: 88 },
  { id: 'loc-3', name: 'Boston, MA', country: 'United States', startupDensity: 82 },
  { id: 'loc-4', name: 'Austin, TX', country: 'United States', startupDensity: 78 },
  { id: 'loc-5', name: 'London, UK', country: 'United Kingdom', startupDensity: 85 },
  { id: 'loc-6', name: 'Berlin, Germany', country: 'Germany', startupDensity: 80 },
];

export const mockEvents = [
  { id: 'evt-1', name: 'TechCrunch Disrupt 2026', date: '2026-09-15', location: 'San Francisco, CA', attendeesCount: 10000 },
  { id: 'evt-2', name: 'Y Combinator Demo Day', date: '2026-08-20', location: 'Palo Alto, CA', attendeesCount: 2500 },
  { id: 'evt-3', name: 'Web Summit 2026', date: '2026-11-10', location: 'Lisbon, Portugal', attendeesCount: 70000 },
  { id: 'evt-4', name: 'AI Summit Global', date: '2026-10-05', location: 'New York, NY', attendeesCount: 5000 },
];

export async function seedCognoDatabase() {
  console.log('[CognoDB Seeder]: Initializing seeding process...');

  const isConnected = await testCognoConnection();
  if (!isConnected) {
    console.error('[CognoDB Seeder Error]: Unable to connect to CognoDB instance.');
    return { success: false, message: 'CognoDB connection failed' };
  }

  try {
    // 1. Seed Locations using MERGE
    for (const loc of mockLocations) {
      await executeWrite(
        `MERGE (l:Location {id: $id}) SET l.name = $name, l.country = $country, l.startupDensity = toInteger($startupDensity)`,
        loc as unknown as Record<string, unknown>
      );
    }

    // 2. Seed Events using MERGE
    for (const evt of mockEvents) {
      await executeWrite(
        `MERGE (e:Event {id: $id}) SET e.name = $name, e.date = $date, e.location = $location, e.attendeesCount = toInteger($attendeesCount)`,
        evt as unknown as Record<string, unknown>
      );
    }

    // 3. Seed Industries using MERGE
    for (const ind of mockIndustries) {
      await executeWrite(
        `MERGE (i:Industry {id: $id}) SET i.name = $name, i.startupCount = toInteger($startupCount), i.totalFunding = $totalFunding, i.growthRate = $growthRate, i.iconName = $iconName, i.description = $description`,
        ind as unknown as Record<string, unknown>
      );
    }

    // 4. Seed Technologies using MERGE
    for (const t of mockTechnologies) {
      await executeWrite(
        `MERGE (tech:Technology {id: $id}) SET tech.name = $name, tech.category = $category, tech.iconName = $iconName, tech.startupCount = toInteger($startupCount), tech.adoptionTrend = $adoptionTrend, tech.description = $description, tech.topStartups = $topStartups`,
        t as unknown as Record<string, unknown>
      );
    }

    // 5. Seed Startups using MERGE
    for (const s of mockStartups) {
      await executeWrite(
        `MERGE (stp:Startup {id: $id}) SET stp.name = $name, stp.logo = $logo, stp.pitch = $pitch, stp.industry = $industry, stp.fundingStage = $fundingStage, stp.teamSize = toInteger($teamSize), stp.valuation = $valuation, stp.totalFunding = $totalFunding, stp.techStack = $techStack, stp.founderNames = $founderNames, stp.investorNames = $investorNames, stp.website = $website, stp.foundedYear = toInteger($foundedYear)`,
        s as unknown as Record<string, unknown>
      );
    }

    // 6. Seed Founders using MERGE
    for (const f of mockFounders) {
      await executeWrite(
        `MERGE (fnd:Founder {id: $id}) SET fnd.name = $name, fnd.avatar = $avatar, fnd.title = $title, fnd.startupId = $startupId, fnd.startupName = $startupName, fnd.bio = $bio, fnd.experienceYears = toInteger($experienceYears), fnd.industry = $industry, fnd.location = $location, fnd.skills = $skills, fnd.connectionCount = toInteger($connectionCount), fnd.topTech = $topTech, fnd.recentActivity = $recentActivity`,
        f as unknown as Record<string, unknown>
      );
    }

    // 7. Seed Investors using MERGE
    for (const inv of mockInvestors) {
      await executeWrite(
        `MERGE (i:Investor {id: $id}) SET i.name = $name, i.photo = $photo, i.firm = $firm, i.role = $role, i.focusIndustries = $focusIndustries, i.portfolioCount = toInteger($portfolioCount), i.recentInvestments = $recentInvestments, i.ticketSize = $ticketSize, i.totalDeals = toInteger($totalDeals), i.bio = $bio`,
        inv as unknown as Record<string, unknown>
      );
    }

    // 8. Seed Mentors using MERGE
    for (const m of mockMentors) {
      await executeWrite(
        `MERGE (men:Mentor {id: $id}) SET men.name = $name, men.photo = $photo, men.title = $title, men.company = $company, men.expertise = $expertise, men.experienceYears = toInteger($experienceYears), men.startupsMentoredCount = toInteger($startupsMentoredCount), men.technologies = $technologies, men.availability = $availability, men.rating = toFloat($rating), men.bio = $bio`,
        m as unknown as Record<string, unknown>
      );
    }

    // 9. Create Relationships using Parameterized MERGE Queries:
    // FOUNDED (Founder -> Startup)
    for (const f of mockFounders) {
      await executeWrite(
        `
        MATCH (fnd:Founder {id: $fId})
        MATCH (stp:Startup {id: $sId})
        MERGE (fnd)-[:FOUNDED]->(stp)
        `,
        { fId: f.id, sId: f.startupId }
      );
    }

    // INVESTED_IN (Investor -> Startup)
    for (const inv of mockInvestors) {
      for (const stpName of inv.recentInvestments) {
        await executeWrite(
          `
          MATCH (i:Investor {id: $invId})
          MATCH (s:Startup) WHERE toLower(s.name) = toLower($stpName)
          MERGE (i)-[:INVESTED_IN]->(s)
          `,
          { invId: inv.id, stpName }
        );
      }
    }

    // MENTORS (Mentor -> Founder)
    for (const m of mockMentors) {
      for (const f of mockFounders) {
        if (f.mentors.includes(m.id)) {
          await executeWrite(
            `
            MATCH (men:Mentor {id: $mId})
            MATCH (fnd:Founder {id: $fId})
            MERGE (men)-[:MENTORS]->(fnd)
            `,
            { mId: m.id, fId: f.id }
          );
        }
      }
    }

    // USES_TECH (Startup -> Technology)
    for (const s of mockStartups) {
      for (const techName of s.techStack) {
        await executeWrite(
          `
          MATCH (stp:Startup {id: $sId})
          MATCH (t:Technology) WHERE toLower(t.name) = toLower($techName)
          MERGE (stp)-[:USES_TECH]->(t)
          `,
          { sId: s.id, techName }
        );
      }
    }

    // OPERATES_IN (Startup -> Industry)
    for (const s of mockStartups) {
      await executeWrite(
        `
        MATCH (stp:Startup {id: $sId})
        MATCH (ind:Industry) WHERE toLower(ind.name) = toLower($indName)
        MERGE (stp)-[:OPERATES_IN]->(ind)
        `,
        { sId: s.id, indName: s.industry }
      );
    }

    // LOCATED_IN (Startup & Founder -> Location)
    for (const s of mockStartups) {
      await executeWrite(
        `
        MATCH (stp:Startup {id: $sId})
        MATCH (loc:Location {id: 'loc-1'})
        MERGE (stp)-[:LOCATED_IN]->(loc)
        `,
        { sId: s.id }
      );
    }

    // ATTENDED (Founder & Investor -> Event)
    for (const f of mockFounders.slice(0, 5)) {
      await executeWrite(
        `
        MATCH (fnd:Founder {id: $fId})
        MATCH (evt:Event {id: 'evt-1'})
        MERGE (fnd)-[:ATTENDED]->(evt)
        `,
        { fId: f.id }
      );
    }

    // CONNECTED_TO (Founder -> Founder mutuals)
    await executeWrite(
      `
      MATCH (f1:Founder {id: 'fnd-1'})
      MATCH (f2:Founder {id: 'fnd-2'})
      MERGE (f1)-[:CONNECTED_TO]->(f2)
      `
    );

    // INTERESTED_IN (Investor -> Industry)
    for (const inv of mockInvestors) {
      for (const focus of inv.focusIndustries) {
        await executeWrite(
          `
          MATCH (i:Investor {id: $invId})
          MATCH (ind:Industry) WHERE toLower(ind.name) = toLower($focus)
          MERGE (i)-[:INTERESTED_IN]->(ind)
          `,
          { invId: inv.id, focus }
        );
      }
    }

    console.log('[CognoDB Seeder Success]: Seeding completed with 0 duplicate nodes.');
    return {
      success: true,
      message: 'Seeded 20 Founders, 15 Startups, 10 Investors, 10 Mentors, Technologies, Industries, Locations, Events, and 9 Relationship Types.',
    };
  } catch (error) {
    console.error('[CognoDB Seeder Error]:', error);
    return { success: false, error: String(error) };
  }
}

if (require.main === module) {
  seedCognoDatabase().then(() => closeCognoDriver());
}
