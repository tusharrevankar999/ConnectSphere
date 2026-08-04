export const GET_ALL_TECHNOLOGIES_QUERY = `
  MATCH (t:Technology)
  WHERE ($search IS NULL OR toLower(t.name) CONTAINS toLower($search) OR toLower(t.category) CONTAINS toLower($search))
  RETURN t
  ORDER BY t.name ASC
  LIMIT toInteger($limit)
`;

export const GET_TECHNOLOGY_BY_ID_QUERY = `
  MATCH (t:Technology {id: $id})
  RETURN t
`;

export const CREATE_TECHNOLOGY_QUERY = `
  CREATE (t:Technology {
    id: $id,
    name: $name,
    category: $category,
    iconName: $iconName,
    startupCount: toInteger($startupCount),
    adoptionTrend: $adoptionTrend,
    description: $description,
    topStartups: $topStartups
  })
  RETURN t
`;
