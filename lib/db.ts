import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import * as schema from "./schema";

// Configure for Vercel serverless environment
neonConfig.fetchConnectionCache = true;
neonConfig.useSecureWebSocket = true;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Create connection pool with serverless-optimized settings
export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  max: 1, // Limit connections for serverless
  idleTimeoutMillis: 0, // Don't timeout idle connections in serverless
  connectionTimeoutMillis: 10000, // Increase timeout
  ssl: true // Ensure SSL connection
});

export const db = drizzle(pool, { schema });
