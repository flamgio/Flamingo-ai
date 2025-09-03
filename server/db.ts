import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { users, conversations, messages } from "@shared/schema";

// Replit database configuration
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required. Please ensure the database is provisioned in Replit.");
}

// Create postgres connection with proper SSL configuration for Replit
const connectionString = process.env.DATABASE_URL;
const client = postgres(connectionString, {
  ssl: 'require', // Replit PostgreSQL requires SSL
  prepare: false,
  max: 10,
  idle_timeout: 20
});

export const db = drizzle(client, {
  schema: { users, conversations, messages },
  logger: process.env.NODE_ENV === 'development'
});

// Export tables from shared schema  
export { users, conversations, messages };

console.log('✅ Database configured for Replit PostgreSQL with postgres-js');