export const GET_ALL_RESOURCES_QUERY = `
  MATCH (r:Resource)
  WHERE ($search IS NULL OR toLower(r.title) CONTAINS toLower($search) OR toLower(r.providerName) CONTAINS toLower($search) OR toLower(r.category) CONTAINS toLower($search))
  RETURN r
  ORDER BY r.title ASC
  LIMIT toInteger($limit)
`;

export const GET_RESOURCE_BY_ID_QUERY = `
  MATCH (r:Resource {id: $id})
  RETURN r
`;

export const CREATE_RESOURCE_QUERY = `
  CREATE (r:Resource {
    id: $id,
    title: $title,
    category: $category,
    description: $description,
    providerName: $providerName,
    providerRole: $providerRole,
    contactEmail: $contactEmail,
    contactPhone: $contactPhone,
    skills: $skills,
    rating: toFloat($rating),
    availability: $availability,
    location: $location,
    avatar: $avatar
  })
  RETURN r
`;

export const UPDATE_RESOURCE_QUERY = `
  MATCH (r:Resource {id: $id})
  SET r.title = $title,
      r.category = $category,
      r.description = $description,
      r.providerName = $providerName,
      r.providerRole = $providerRole,
      r.contactEmail = $contactEmail,
      r.contactPhone = $contactPhone,
      r.skills = $skills,
      r.availability = $availability,
      r.location = $location,
      r.avatar = $avatar
  RETURN r
`;

export const DELETE_RESOURCE_QUERY = `
  MATCH (r:Resource {id: $id})
  DETACH DELETE r
`;

