import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, jsonb, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email"),
  firstName: text("first_name"),
  lastName: text("last_name"),
  role: text("role").notNull().default("user"), // 'user', 'admin', 'manager'
  screenTime: integer("screen_time").default(0), // For analytics
  lastActive: timestamp("last_active").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const conversations = pgTable("conversations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  conversationId: varchar("conversation_id").notNull().references(() => conversations.id),
  role: text("role").notNull(), // 'user' or 'assistant'
  content: text("content").notNull(),
  selectedModel: text("selected_model"),
  metadata: jsonb("metadata"), // For storing model info, tokens, etc.
  createdAt: timestamp("created_at").defaultNow(),
});

export const sessions = pgTable("sessions", {
  id: varchar("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  sessionData: jsonb("session_data"),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Model usage tracking
export const modelUsage = pgTable("model_usage", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  modelName: text("model_name").notNull(),
  tokensUsed: integer("tokens_used").default(0),
  requestCount: integer("request_count").default(1),
  createdAt: timestamp("created_at").defaultNow(),
});

// Payment transactions
export const payments = pgTable("payments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  amount: text("amount").notNull(), // Store as string to avoid precision issues
  currency: text("currency").notNull(), // 'LTC', 'ETH', 'BTC', 'USD'
  method: text("method").notNull(), // 'crypto', 'nowpayments', 'buymeacoffee'
  status: text("status").notNull().default("pending"), // 'pending', 'completed', 'failed'
  transactionId: text("transaction_id"),
  walletAddress: text("wallet_address"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  firstName: true,
  lastName: true,
});

export const insertConversationSchema = createInsertSchema(conversations).pick({
  userId: true,
  title: true,
});

export const insertMessageSchema = createInsertSchema(messages).pick({
  conversationId: true,
  role: true,
  content: true,
  selectedModel: true,
  metadata: true,
});

export const insertModelUsageSchema = createInsertSchema(modelUsage).pick({
  userId: true,
  modelName: true,
  tokensUsed: true,
  requestCount: true,
});

export const insertPaymentSchema = createInsertSchema(payments).pick({
  userId: true,
  amount: true,
  currency: true,
  method: true,
  status: true,
  transactionId: true,
  walletAddress: true,
  metadata: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertConversation = z.infer<typeof insertConversationSchema>;
export type Conversation = typeof conversations.$inferSelect;

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;

export type InsertModelUsage = z.infer<typeof insertModelUsageSchema>;
export type ModelUsage = typeof modelUsage.$inferSelect;

export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type Payment = typeof payments.$inferSelect;
