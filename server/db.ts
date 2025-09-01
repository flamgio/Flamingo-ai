import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { pgTable, text, serial, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import ws from "ws";

neonConfig.webSocketConstructor = ws;

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

// Define the users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  isActive: boolean("is_active").default(true),
});

// Define the conversations table
export const conversations = pgTable("conversations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  title: text("title").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Define the messages table
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").references(() => conversations.id),
  userId: integer("user_id").references(() => users.id),
  role: text("role").notNull(), // 'user' or 'assistant'
  content: text("content").notNull(),
  provider: text("provider"), // which AI provider was used
  createdAt: timestamp("created_at").defaultNow(),
});

export { users, conversations, messages };

// Test database connection
pool.on('error', (err) => {
  console.error('Database connection error:', err);
});

pool.on('connect', () => {
  console.log('✅ Database connected successfully');
});