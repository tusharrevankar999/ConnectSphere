export const GET_ALL_INDUSTRIES_QUERY = `
  MATCH (i:Industry)
  RETURN i
  ORDER BY i.name ASC
`;

export const GET_INDUSTRY_BY_ID_QUERY = `
  MATCH (i:Industry {id: $id})
  RETURN i
`;

export const CREATE_INDUSTRY_QUERY = `
  CREATE (i:Industry {
    id: $id,
    name: $name,
    startupCount: toInteger($startupCount),
    totalFunding: $totalFunding,
    growthRate: $growthRate,
    iconName: $iconName,
    description: $description
  })
  RETURN i
`;
