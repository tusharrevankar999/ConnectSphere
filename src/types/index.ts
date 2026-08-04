export type FundingStage = 'Pre-Seed' | 'Seed' | 'Series A' | 'Series B' | 'Series C' | 'Growth';

export type NodeType = 'Founder' | 'Startup' | 'Investor' | 'Mentor' | 'Technology' | 'Industry' | 'Location' | 'Event';

export type RelationshipType = 
  | 'FOUNDED' 
  | 'INVESTED_IN' 
  | 'MENTORS' 
  | 'CONNECTED_TO' 
  | 'USES_TECH' 
  | 'OPERATES_IN' 
  | 'LOCATED_IN' 
  | 'ATTENDED' 
  | 'INTERESTED_IN'
  | 'IN_INDUSTRY'
  | 'ADVISES';

export interface Founder {
  id: string;
  name: string;
  avatar: string;
  title: string;
  startupId: string;
  startupName: string;
  bio: string;
  experienceYears: number;
  industry: string;
  location: string;
  skills: string[];
  connectionCount: number;
  topTech: string[];
  mentors: string[];
  investors: string[];
  recentActivity: string;
}

export interface Startup {
  id: string;
  name: string;
  logo: string;
  pitch: string;
  industry: string;
  fundingStage: FundingStage;
  teamSize: number;
  valuation: string;
  totalFunding: string;
  techStack: string[];
  founderIds: string[];
  founderNames: string[];
  investorNames: string[];
  website: string;
  foundedYear: number;
}

export interface Investor {
  id: string;
  name: string;
  photo: string;
  firm: string;
  role: string;
  focusIndustries: string[];
  portfolioCount: number;
  recentInvestments: string[];
  ticketSize: string;
  totalDeals: number;
  bio: string;
}

export interface Mentor {
  id: string;
  name: string;
  photo: string;
  title: string;
  company: string;
  expertise: string[];
  experienceYears: number;
  startupsMentoredCount: number;
  technologies: string[];
  availability: 'Available Now' | 'Limited Slots' | 'Booked';
  rating: number;
  bio: string;
}

export interface Technology {
  id: string;
  name: string;
  category: string;
  iconName: string;
  startupCount: number;
  adoptionTrend: string;
  description: string;
  topStartups: string[];
}

export interface Industry {
  id: string;
  name: string;
  startupCount: number;
  totalFunding: string;
  growthRate: string;
  iconName: string;
  description: string;
}

export interface LocationNode {
  id: string;
  name: string;
  country: string;
  startupDensity: number;
}

export interface EventNode {
  id: string;
  name: string;
  date: string;
  location: string;
  attendeesCount: number;
}

export interface Activity {
  id: string;
  type: 'investment' | 'startup_launch' | 'mentor_match' | 'founder_update';
  title: string;
  description: string;
  timestamp: string;
  entityName: string;
  avatar: string;
}

export interface Recommendation {
  id: string;
  entityType: 'Investor' | 'Mentor' | 'Startup' | 'Founder';
  entityId: string;
  name: string;
  avatar: string;
  title: string;
  industry: string;
  matchReason: string;
  matchScore: number;
  tags: string[];
}

export interface GraphNode {
  id: string;
  label: string;
  type: NodeType;
  subtitle: string;
  val: number;
  color: string;
  x?: number;
  y?: number;
  details?: Record<string, unknown>;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label: RelationshipType;
}
