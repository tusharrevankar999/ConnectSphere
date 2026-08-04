# Startup Nexus — API Documentation & Cypher Graph Patterns

Comprehensive API reference for the **Startup Nexus** investor-grade SaaS application powered by **Next.js 15 App Router** and **CognoDB (Neo4j)**.

---

## 1. Authentication & Environment

All API routes read credentials securely from environment variables:
- `COGNODB_URI` (Default: `bolt://localhost:7687`)
- `COGNODB_USERNAME` (Default: `neo4j`)
- `COGNODB_PASSWORD` (Default: `password`)

---

## 2. Dashboard Endpoints

### `GET /api/dashboard`
Returns live entity statistics, graph recommendation previews, and real-time activity feeds.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "stats": {
      "foundersCount": 20,
      "startupsCount": 15,
      "investorsCount": 10,
      "mentorsCount": 10,
      "technologiesCount": 15,
      "industriesCount": 8
    },
    "recommendationsPreview": [...],
    "activitiesStream": [...]
  }
}
```

---

## 3. Entity Directories & CRUD Endpoints

### `GET /api/founders`
Query Parameters: `search`, `industry`, `limit`

### `GET /api/founders/:id`
Returns single Founder node details and graph edge links.

### `POST /api/founders`
Creates a new Founder node using parameterized Cypher `CREATE` statement.

### `GET /api/startups`
Query Parameters: `search`, `stage`, `limit`

### `GET /api/startups/:id`
Returns single Startup node details, valuation, tech stack, and founders.

### `POST /api/startups`
Creates a new Startup node.

### `GET /api/investors` & `GET /api/investors/:id`
Returns VCs and Angel investor portfolio counts and check sizes.

### `GET /api/mentors` & `GET /api/mentors/[id]`
Returns mentors, ratings, expertise, and availability.

### `GET /api/technologies` & `GET /api/technologies/[id]`
Returns tech stack adoption metrics and adopting startups.

### `GET /api/industries` & `GET /api/industries/[id]`
Returns market verticals and funding totals.

---

## 4. Multi-Hop Graph Recommendation Engine

### `GET /api/recommendations/investors-for-founder?founderId=fnd-1`
Multi-hop Cypher traversal discovering investors interested in a founder's target industry:
```cypher
MATCH (f:Founder {id: $founderId})-[:FOUNDED]->(s:Startup)-[:OPERATES_IN]->(ind:Industry)
MATCH (inv:Investor)-[:INTERESTED_IN|INVESTED_IN]->(ind)
WHERE NOT (inv)-[:INVESTED_IN]->(s)
RETURN inv, count(ind) AS score, collect(DISTINCT ind.name) as matchedIndustries
ORDER BY score DESC;
```

### `GET /api/recommendations/mentors-for-founder?founderId=fnd-1`
2-hop tech stack overlap traversal matching mentors with relevant technology nodes.

### `GET /api/recommendations/similar-tech-startups?startupId=stp-1`
Jaccard tech similarity matching startups with overlapping tech stack nodes.

### `GET /api/recommendations/mutual-founders?founderId=fnd-1`
2-hop friend-of-friend Cypher traversal discovering unlinked founders with mutual connections.

### `GET /api/recommendations/three-degrees-founders?founderId=fnd-1`
1-to-3 hop path traversal discovering ecosystem connections within 3 degrees of separation.

### `GET /api/recommendations/shortest-path?fromId=fnd-1&toId=fnd-3`
Cypher `shortestPath` algorithm calculating the exact node path between two founders.

---

## 5. 2D Graph Explorer & Subgraph Traversal

### `GET /api/graph`
Query Parameters: `type` (`All` | `Founder` | `Startup` | `Investor` | `Mentor` | `Technology` | `Industry`)

### `GET /api/graph/traverse?nodeId=nexus-center&depth=2`
Configurable multi-hop graph depth traversal returning subgraph nodes & edges in JSON format.

---

## 6. Database Seeding

### `POST /api/seed`
Executes `seedCognoDatabase()` script with parameterized Cypher `MERGE` statements, seeding 20 Founders, 15 Startups, 10 Investors, 10 Mentors, Technologies, Industries, Locations, and Events with zero duplicate nodes.
