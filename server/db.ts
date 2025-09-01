import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { users, conversations, messages } from "@shared/schema";

// Replit database configuration
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required. Please ensure the database is provisioned in Replit.");
}

// Use the existing DATABASE_URL which already has sslmode=disable
const sql = neon(process.env.DATABASE_URL);

export const db = drizzle(sql, {
  logger: process.env.NODE_ENV === 'development'
});

// Export tables from shared schema
export { users, conversations, messages };

console.log('✅ Database configured for Replit PostgreSQL');