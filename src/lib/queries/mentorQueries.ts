export const GET_ALL_MENTORS_QUERY = `
  MATCH (m:Mentor)
  WHERE ($search IS NULL OR toLower(m.name) CONTAINS toLower($search) OR toLower(m.company) CONTAINS toLower($search))
  RETURN m
  ORDER BY m.name ASC
  LIMIT toInteger($limit)
`;

export const GET_MENTOR_BY_ID_QUERY = `
  MATCH (m:Mentor {id: $id})
  RETURN m
`;

export const CREATE_MENTOR_QUERY = `
  CREATE (m:Mentor {
    id: $id,
    name: $name,
    photo: $photo,
    title: $title,
    company: $company,
    expertise: $expertise,
    experienceYears: toInteger($experienceYears),
    startupsMentoredCount: toInteger($startupsMentoredCount),
    technologies: $technologies,
    availability: $availability,
    rating: toFloat($rating),
    bio: $bio
  })
  RETURN m
`;
