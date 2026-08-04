export const GET_GRAPH_TOPOLOGY_QUERY = `
  MATCH (n)
  WHERE ($type IS NULL OR $type = 'All' OR labels(n)[0] = $type)
  OPTIONAL MATCH (n)-[r]->(m)
  RETURN n, labels(n)[0] AS type, r, m
  LIMIT toInteger($limit)
`;
