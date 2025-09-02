import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { users, conversations, messages } from "@shared/schema";

// Replit database configuration
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required. Please ensure the database is provisioned in Replit.");
}

// Create postgres connection with SSL enabled for Replit
const connectionString = process.env.DATABASE_URL;
const client = postgres(connectionString, {
  ssl: 'require',
  prepare: false
});

export const db = drizzle(client, {
  schema: { users, conversations, messages },
  logger: process.env.NODE_ENV === 'development'
});

// Export tables from shared schema  
export { users, conversations, messages };

console.log('✅ Database configured for Replit PostgreSQL with postgres-js');