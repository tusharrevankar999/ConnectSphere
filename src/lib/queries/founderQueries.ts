export const GET_ALL_FOUNDERS_QUERY = `
  MATCH (f:Founder)
  WHERE ($search IS NULL OR toLower(f.name) CONTAINS toLower($search) OR toLower(f.startupName) CONTAINS toLower($search))
    AND ($industry IS NULL OR f.industry = $industry)
  OPTIONAL MATCH (f)-[:MENTORS]-(m:Mentor)
  OPTIONAL MATCH (f)-[:INVESTED_IN]-(i:Investor)
  RETURN f, collect(DISTINCT m.name) AS mentors, collect(DISTINCT i.name) AS investors
  ORDER BY f.name ASC
  LIMIT toInteger($limit)
`;

export const GET_FOUNDER_BY_ID_QUERY = `
  MATCH (f:Founder {id: $id})
  OPTIONAL MATCH (f)-[:MENTORS]-(m:Mentor)
  OPTIONAL MATCH (f)-[:INVESTED_IN]-(i:Investor)
  RETURN f, collect(DISTINCT m.name) AS mentors, collect(DISTINCT i.name) AS investors
`;

export const CREATE_FOUNDER_QUERY = `
  CREATE (f:Founder {
    id: $id,
    name: $name,
    avatar: $avatar,
    title: $title,
    startupId: $startupId,
    startupName: $startupName,
    bio: $bio,
    experienceYears: toInteger($experienceYears),
    industry: $industry,
    location: $location,
    skills: $skills,
    connectionCount: toInteger($connectionCount),
    topTech: $topTech,
    recentActivity: $recentActivity
  })
  RETURN f
`;

export const UPDATE_FOUNDER_QUERY = `
  MATCH (f:Founder {id: $id})
  SET f.name = $name,
      f.avatar = $avatar,
      f.title = $title,
      f.startupName = $startupName,
      f.bio = $bio,
      f.experienceYears = toInteger($experienceYears),
      f.industry = $industry,
      f.location = $location,
      f.skills = $skills
  RETURN f
`;

export const DELETE_FOUNDER_QUERY = `
  MATCH (f:Founder {id: $id})
  DETACH DELETE f
`;
