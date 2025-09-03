import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import * as schema from "./schema";

try {
  console.log('🔍 Starting database connection setup...');
  
  // Configure for Vercel serverless environment
  neonConfig.fetchConnectionCache = true;
  neonConfig.useSecureWebSocket = true;
  console.log('✅ Neon config set');

  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL must be set. Did you forget to provision a database?",
    );
  }
  console.log('✅ DATABASE_URL exists:', process.env.DATABASE_URL.substring(0, 20) + '...');

  // Create connection pool with serverless-optimized settings
  export const pool = new Pool({ 
    connectionString: process.env.DATABASE_URL,
    max: 1, // Limit connections for serverless
    idleTimeoutMillis: 0, // Don't timeout idle connections in serverless
    connectionTimeoutMillis: 10000, // Increase timeout
    ssl: true // Ensure SSL connection
  });
  console.log('✅ Connection pool created');

  export const db = drizzle(pool, { schema });
  console.log('✅ Drizzle database instance created');
  
} catch (error) {
  console.error('❌ Database Connection Error:', error);
  console.error('Error details:', {
    message: error.message,
    stack: error.stack,
    name: error.name
  });
  throw error;
}
