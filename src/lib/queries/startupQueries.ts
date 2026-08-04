export const GET_ALL_STARTUPS_QUERY = `
  MATCH (s:Startup)
  WHERE ($search IS NULL OR toLower(s.name) CONTAINS toLower($search) OR toLower(s.pitch) CONTAINS toLower($search) OR toLower(s.industry) CONTAINS toLower($search))
    AND ($stage IS NULL OR s.fundingStage = $stage)
  RETURN s
  ORDER BY s.name ASC
  LIMIT toInteger($limit)
`;

export const GET_STARTUP_BY_ID_QUERY = `
  MATCH (s:Startup {id: $id})
  OPTIONAL MATCH (f:Founder)-[:FOUNDED]->(s)
  OPTIONAL MATCH (i:Investor)-[:INVESTED_IN]->(s)
  RETURN s, collect(DISTINCT f.name) AS founderNames, collect(DISTINCT i.name) AS investorNames
`;

export const CREATE_STARTUP_QUERY = `
  CREATE (s:Startup {
    id: $id,
    name: $name,
    logo: $logo,
    pitch: $pitch,
    industry: $industry,
    fundingStage: $fundingStage,
    teamSize: toInteger($teamSize),
    valuation: $valuation,
    totalFunding: $totalFunding,
    techStack: $techStack,
    founderIds: $founderIds,
    founderNames: $founderNames,
    investorNames: $investorNames,
    website: $website,
    foundedYear: toInteger($foundedYear)
  })
  RETURN s
`;

export const UPDATE_STARTUP_QUERY = `
  MATCH (s:Startup {id: $id})
  SET s.name = $name,
      s.logo = $logo,
      s.pitch = $pitch,
      s.industry = $industry,
      s.fundingStage = $fundingStage,
      s.teamSize = toInteger($teamSize),
      s.valuation = $valuation,
      s.totalFunding = $totalFunding,
      s.techStack = $techStack
  RETURN s
`;

export const DELETE_STARTUP_QUERY = `
  MATCH (s:Startup {id: $id})
  DETACH DELETE s
`;
