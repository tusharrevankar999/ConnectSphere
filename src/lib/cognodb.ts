import neo4j, { Driver, Session, ManagedTransaction, Record as Neo4jRecord } from 'neo4j-driver';

let driverInstance: Driver | null = null;

export function getCognoDriver(): Driver {
  if (!driverInstance) {
    const uri = process.env.COGNODB_URI || 'bolt://localhost:7687';
    const username = process.env.COGNODB_USERNAME || 'neo4j';
    const password = process.env.COGNODB_PASSWORD || 'password';

    driverInstance = neo4j.driver(uri, neo4j.auth.basic(username, password), {
      maxConnectionPoolSize: 50,
      connectionTimeout: 10000,
      logging: neo4j.logging.console('info'),
    });
  }
  return driverInstance;
}

export async function closeCognoDriver(): Promise<void> {
  if (driverInstance) {
    await driverInstance.close();
    driverInstance = null;
  }
}

/**
 * Safely executes a read Cypher transaction and ensures the session is closed in a finally block.
 */
export async function executeRead<T>(
  query: string,
  parameters: Record<string, unknown> = {},
  transform?: (records: Neo4jRecord[]) => T
): Promise<T> {
  const driver = getCognoDriver();
  const session: Session = driver.session({ defaultAccessMode: neo4j.session.READ });
  try {
    const result = await session.executeRead(async (tx: ManagedTransaction) => {
      const res = await tx.run(query, parameters);
      return res.records;
    });
    return transform ? transform(result) : (result as unknown as T);
  } finally {
    await session.close();
  }
}

/**
 * Safely executes a write Cypher transaction and ensures the session is closed in a finally block.
 */
export async function executeWrite<T>(
  query: string,
  parameters: Record<string, unknown> = {},
  transform?: (records: Neo4jRecord[]) => T
): Promise<T> {
  const driver = getCognoDriver();
  const session: Session = driver.session({ defaultAccessMode: neo4j.session.WRITE });
  try {
    const result = await session.executeWrite(async (tx: ManagedTransaction) => {
      const res = await tx.run(query, parameters);
      return res.records;
    });
    return transform ? transform(result) : (result as unknown as T);
  } finally {
    await session.close();
  }
}

/**
 * Helper to check connectivity status
 */
export async function testCognoConnection(): Promise<boolean> {
  try {
    const driver = getCognoDriver();
    await driver.verifyConnectivity();
    return true;
  } catch (err) {
    console.warn('[CognoDB Connectivity Warning]: Failed to connect to CognoDB instance.', err);
    return false;
  }
}
