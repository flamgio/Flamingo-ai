import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import ws from "ws";
import { users, conversations, messages } from "@shared/schema";

neonConfig.webSocketConstructor = ws;

// Configure for development
if (process.env.NODE_ENV === 'development') {
  // Set development specific config if needed
}

if (!process.env.DATABASE_URL) {
  console.warn("DATABASE_URL not set, using placeholder for development");
  process.env.DATABASE_URL = "postgresql://placeholder:placeholder@localhost:5432/placeholder";
}

export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 30000,
  max: 10
});

// Database connection
const sql = neon(process.env.DATABASE_URL || 'postgresql://placeholder');

export const db = drizzle(sql, {
  logger: process.env.NODE_ENV === 'development'
});

// Export tables from shared schema
export { users, conversations, messages };

// Test database connection
pool.on('error', (err) => {
  console.error('Database connection error:', err);
});

pool.on('connect', () => {
  console.log('✅ Database connected successfully');
});