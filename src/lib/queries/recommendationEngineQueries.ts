/**
 * Multi-Hop Cypher Queries demonstrating Graph Database superiority over SQL.
 */

// 1. Recommend Investors for a Founder based on Industry & Portfolio overlap (2-hop traversal)
export const RECOMMEND_INVESTORS_FOR_FOUNDER_QUERY = `
  MATCH (f:Founder {id: $founderId})-[:FOUNDED]->(s:Startup)-[:OPERATES_IN|IN_INDUSTRY]->(ind:Industry)
  MATCH (inv:Investor)-[:INTERESTED_IN|INVESTED_IN]->(ind)
  WHERE NOT (inv)-[:INVESTED_IN]->(s)
  RETURN inv, count(ind) AS score, collect(DISTINCT ind.name) as matchedIndustries
  ORDER BY score DESC
  LIMIT toInteger($limit)
`;

// 2. Recommend Mentors for a Founder based on Shared Tech Stack (2-hop traversal)
export const RECOMMEND_MENTORS_FOR_FOUNDER_QUERY = `
  MATCH (f:Founder {id: $founderId})-[:FOUNDED]->(s:Startup)-[:USES_TECH]->(t:Technology)
  MATCH (m:Mentor) WHERE (m)-[:USES_TECH]->(t) OR t.name IN m.technologies
  RETURN m, count(t) AS score, collect(DISTINCT t.name) as sharedTechnologies
  ORDER BY score DESC
  LIMIT toInteger($limit)
`;

// 3. Recommend Startups with Similar Technology Stacks (Jaccard similarity via shared Tech nodes)
export const RECOMMEND_SIMILAR_TECH_STARTUPS_QUERY = `
  MATCH (s1:Startup {id: $startupId})-[:USES_TECH]->(t:Technology)<-[:USES_TECH]-(s2:Startup)
  WHERE s1 <> s2
  RETURN s2, count(t) AS sharedTechCount, collect(DISTINCT t.name) as sharedTech
  ORDER BY sharedTechCount DESC
  LIMIT toInteger($limit)
`;

// 4. Recommend Founders with Mutual Connections (2-hop friend-of-friend traversal)
export const RECOMMEND_MUTUAL_FOUNDERS_QUERY = `
  MATCH (f1:Founder {id: $founderId})-[:CONNECTED_TO]-(mutual:Founder)-[:CONNECTED_TO]-(f2:Founder)
  WHERE f1 <> f2 AND NOT (f1)-[:CONNECTED_TO]-(f2)
  RETURN f2, count(mutual) AS mutualCount, collect(DISTINCT mutual.name) AS mutualNames
  ORDER BY mutualCount DESC
  LIMIT toInteger($limit)
`;

// 5. Find Founders within Three Degrees of Separation (1 to 3 hop graph traversal)
export const THREE_DEGREES_FOUNDERS_QUERY = `
  MATCH path = (f1:Founder {id: $founderId})-[r:CONNECTED_TO|FOUNDED|INVESTED_IN|MENTORS*1..3]-(f2:Founder)
  WHERE f1 <> f2
  RETURN DISTINCT f2, min(length(path)) AS distance
  ORDER BY distance ASC, f2.name ASC
  LIMIT toInteger($limit)
`;

// 6. Shortest Path Between Two Founders (Cypher shortestPath algorithm)
export const SHORTEST_PATH_QUERY = `
  MATCH (f1:Founder {id: $fromFounderId}), (f2:Founder {id: $toFounderId})
  MATCH p = shortestPath((f1)-[:CONNECTED_TO|FOUNDED|INVESTED_IN|MENTORS|USES_TECH*..6]-(f2))
  RETURN [node IN nodes(p) | { id: node.id, label: coalesce(node.name, node.label, node.id), type: labels(node)[0] }] AS nodes,
         [rel IN relationships(p) | { type: type(rel), source: startNode(rel).id, target: endNode(rel).id }] AS relationships,
         length(p) AS pathLength
`;

// 7. Recommend Investors interested in a Startup's Industry
export const RECOMMEND_INVESTORS_FOR_INDUSTRY_QUERY = `
  MATCH (s:Startup {id: $startupId})-[:OPERATES_IN|IN_INDUSTRY]->(ind:Industry)
  MATCH (inv:Investor)-[:INTERESTED_IN|INVESTED_IN]->(ind)
  RETURN inv, ind.name AS industryName
  LIMIT toInteger($limit)
`;
