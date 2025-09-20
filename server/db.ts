import dotenv from "dotenv";
dotenv.config();

import { createClient } from '@supabase/supabase-js';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

if (!process.env.SUPABASE_URL) {
  throw new Error(
    "SUPABASE_URL must be set. Did you forget to set up Supabase?",
  );
}

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error(
    "SUPABASE_SERVICE_ROLE_KEY must be set. Did you forget to set up Supabase?",
  );
}

// Create Supabase client
export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Create postgres connection for Drizzle
const connectionString = process.env.DATABASE_URL;
const sql = postgres(connectionString, { 
  max: 1, // Limit connections for serverless
  idle_timeout: 0, // Don't timeout idle connections in serverless
  connect_timeout: 10, // Connection timeout
  ssl: 'require' // Ensure SSL connection
});

export const db = drizzle(sql, { schema });