export const GET_ALL_INVESTORS_QUERY = `
  MATCH (i:Investor)
  WHERE ($search IS NULL OR toLower(i.name) CONTAINS toLower($search) OR toLower(i.firm) CONTAINS toLower($search))
  RETURN i
  ORDER BY i.name ASC
  LIMIT toInteger($limit)
`;

export const GET_INVESTOR_BY_ID_QUERY = `
  MATCH (i:Investor {id: $id})
  OPTIONAL MATCH (i)-[:INVESTED_IN]->(s:Startup)
  RETURN i, collect(DISTINCT s.name) AS portfolioStartups
`;

export const CREATE_INVESTOR_QUERY = `
  CREATE (i:Investor {
    id: $id,
    name: $name,
    photo: $photo,
    firm: $firm,
    role: $role,
    focusIndustries: $focusIndustries,
    portfolioCount: toInteger($portfolioCount),
    recentInvestments: $recentInvestments,
    ticketSize: $ticketSize,
    totalDeals: toInteger($totalDeals),
    bio: $bio
  })
  RETURN i
`;
