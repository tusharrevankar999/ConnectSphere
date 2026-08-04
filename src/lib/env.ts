export function validateEnv() {
  const required = ['COGNODB_URI', 'COGNODB_USERNAME', 'COGNODB_PASSWORD'];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.warn(`[Environment Warning]: Missing env variables: ${missing.join(', ')}. Using default fallback credentials.`);
  }

  return {
    COGNODB_URI: process.env.COGNODB_URI || 'bolt://localhost:7687',
    COGNODB_USERNAME: process.env.COGNODB_USERNAME || 'neo4j',
    COGNODB_PASSWORD: process.env.COGNODB_PASSWORD || 'password',
    NODE_ENV: process.env.NODE_ENV || 'development',
  };
}
