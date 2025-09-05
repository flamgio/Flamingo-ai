import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { db } from './db';
import { users, conversations, messages } from '@shared/schema';
import { eq } from 'drizzle-orm';
import {
  generateToken,
  hashPassword,
  comparePassword,
  authenticateToken,
  optionalAuth,
  type AuthRequest
} from "./auth";
import { chatRouter } from "./routes-chat";
import enhancementRoutes from "./routes-enhancement";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Admin authentication middleware
function authenticateAdmin(req: any, res: any, next: any) {
  const adminSession = req.headers.authorization;
  const xAdminSession = req.headers['x-admin-session'];
  const correctAdminKey = process.env.ADMIN_KEY || "FLAMINGO2024";

  // Check for session-based auth first
  if (xAdminSession === 'authenticated') {
    return next();
  }

  // Check for direct admin key in headers or query
  if (adminSession === correctAdminKey || req.query.adminKey === correctAdminKey) {
    return next();
  }

  // Check body for admin key
  if (req.body && req.body.adminKey === correctAdminKey) {
    return next();
  }

  return res.status(401).json({ message: "Unauthorized - Admin access required" });
}

export async function registerRoutes(app: Express): Promise<Server> {

  // Authentication routes
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const { email, firstName, lastName, password } = req.body;

      // Validation
      if (!email || !firstName || !lastName || !password) {
        return res.status(400).json({ message: "All fields are required" });
      }

      if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters" });
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Please enter a valid email address" });
      }

      // Check if user already exists
      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      if (existingUser.length > 0) {
        return res.status(409).json({ message: "User already exists with this email" });
      }

      // Hash password and create user
      const hashedPassword = await hashPassword(password);

      const newUser = await db
        .insert(users)
        .values({
          username: email,
          email,
          firstName,
          lastName,
          password: hashedPassword,
        })
        .returning();

      // Generate JWT token
      const token = generateToken(newUser[0].id);

      // Return user without password
      const { password: _, ...userWithoutPassword } = newUser[0];

      res.status(201).json({
        user: userWithoutPassword,
        token,
        message: "Account created successfully"
      });

    } catch (error) {
      console.error("Signup error:", error);
      if (error instanceof Error) {
        if (error.message.includes('duplicate key') || error.message.includes('unique constraint')) {
          return res.status(409).json({ message: "User already exists with this email" });
        }
        if (error.message.includes('connection') || error.message.includes('ECONNRESET')) {
          return res.status(503).json({ message: "Database connection error. Please try again." });
        }
      }
      res.status(500).json({ message: "Internal server error. Please try again later." });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }

      // Find user by email
      const user = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      if (user.length === 0) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Check password
      const isPasswordValid = await comparePassword(password, user[0].password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Generate JWT token
      const token = generateToken(user[0].id);

      // Return user without password
      const { password: _, ...userWithoutPassword } = user[0];

      res.json({
        user: userWithoutPassword,
        token,
        message: "Login successful"
      });

    } catch (error) {
      console.error("Login error:", error);
      if (error instanceof Error) {
        if (error.message.includes('connection') || error.message.includes('ECONNRESET')) {
          return res.status(503).json({ message: "Database connection error. Please try again." });
        }
      }
      res.status(500).json({ message: "Internal server error. Please try again later." });
    }
  });

  app.get("/api/auth/user", authenticateToken, async (req: AuthRequest, res) => {
    try {
      // User is already attached by middleware
      const { password: _, ...userWithoutPassword } = req.user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    // With JWT, logout is handled client-side by removing the token
    res.json({ message: "Logout successful" });
  });

  // Get current user profile
  app.get("/api/user", async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: "No token provided" });
      }

      const token = authHeader.substring(7);
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production') as { userId: string };

      const user = await db.select().from(users).where(eq(users.id, decoded.userId)).limit(1);
      if (user.length === 0) {
        return res.status(401).json({ message: "User not found" });
      }

      res.json({
        id: user[0].id,
        email: user[0].email,
        firstName: user[0].firstName,
        lastName: user[0].lastName
      });
    } catch (error) {
      console.error('Auth verification error:', error);
      res.status(401).json({ message: "Invalid token" });
    }
  });

  // Conversations endpoints
  app.get("/api/conversations", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const userConversations = await db
        .select()
        .from(conversations)
        .where(eq(conversations.userId, req.user.id))
        .orderBy(conversations.updatedAt);

      res.json(userConversations);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/conversations", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const { title } = req.body;

      const conversation = await db
        .insert(conversations)
        .values({
          userId: req.user.id,
          title: title || "New Conversation",
        })
        .returning();

      res.json(conversation[0]);
    } catch (error) {
      console.error("Error creating conversation:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/conversations/:id/messages", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const { id } = req.params;

      // Verify conversation belongs to user
      const conversation = await db
        .select()
        .from(conversations)
        .where(eq(conversations.id, id) && eq(conversations.userId, req.user.id))
        .limit(1);

      if (conversation.length === 0) {
        return res.status(404).json({ message: "Conversation not found" });
      }

      const conversationMessages = await db
        .select()
        .from(messages)
        .where(eq(messages.conversationId, id))
        .orderBy(messages.createdAt);

      res.json(conversationMessages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Prompt enhancement endpoint
  app.post("/api/enhance-prompt", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const { prompt } = req.body;
      
      if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
      }

      // Simple enhancement logic
      const enhancedPrompt = `Please provide a detailed and comprehensive response to the following: ${prompt}. Include relevant examples, explanations, and context where appropriate.`;
      
      res.json({ 
        enhancedPrompt,
        enhanced: enhancedPrompt,
        result: enhancedPrompt
      });
    } catch (error) {
      console.error("Enhancement error:", error);
      res.status(500).json({ error: "Enhancement failed" });
    }
  });

  // Agent endpoint for AI responses  
  app.post('/api/agent', authenticateToken, async (req: AuthRequest, res) => {
    try {
      const user = req.user;
      const { prompt, conversationId, selectedModel, useEnhancement } = req.body;

      if (!prompt) {
        return res.status(400).json({ error: 'Message is required' });
      }

      // Add basic rate limiting
      const userId = user.id;
      if (!userId) {
        return res.status(403).json({ message: 'Invalid or expired token' });
      }

      // Verify conversation belongs to user if provided
      if (conversationId) {
        const conversation = await db
          .select()
          .from(conversations)
          .where(eq(conversations.id, conversationId) && eq(conversations.userId, user.id))
          .limit(1);

        if (conversation.length === 0) {
          return res.status(404).json({ message: "Conversation not found" });
        }
      }

      // Create conversation if none provided
      let finalConversationId = conversationId;
      if (!finalConversationId) {
        const newConversation = await db
          .insert(conversations)
          .values({
            id: crypto.randomUUID(),
            userId: user.id,
            title: prompt.slice(0, 50) + (prompt.length > 50 ? '...' : ''),
          })
          .returning();
        finalConversationId = newConversation[0].id;
      }

      // Save user message
      const userMessage = await db
        .insert(messages)
        .values({
          id: crypto.randomUUID(),
          conversationId: finalConversationId,
          role: "user",
          content: prompt,
        })
        .returning();

      let aiResponse;
      let chosenModel = selectedModel || 'gpt-3.5-turbo';

      try {
        // Use orchestrator for AI responses
        const { routePrompt } = await import('./orchestrator');
        aiResponse = await routePrompt(prompt, { userId: user.id, enhanced: useEnhancement ? 'true' : null });
        chosenModel = aiResponse.model || chosenModel;
      } catch (orchestratorError) {
        console.error("Orchestrator error:", orchestratorError);

        // Fallback response
        aiResponse = {
          text: `I understand you're asking: "${prompt}". I'm currently experiencing some technical difficulties with my AI models. This is a development environment response. Please check that your API keys are properly configured in the environment variables.`,
          model: chosenModel,
          provider: 'fallback',
          wordCount: 50,
          task: 'general',
          signature: 'Flamingo AI',
          requestId: crypto.randomUUID()
        };
      }

      // Save AI response
      const savedResponse = await db
        .insert(messages)
        .values({
          id: crypto.randomUUID(),
          conversationId: finalConversationId,
          role: "assistant",
          content: aiResponse.text,
          selectedModel: aiResponse.model,
          metadata: {
            provider: aiResponse.provider,
            task: aiResponse.task,
            wordCount: aiResponse.wordCount,
            signature: aiResponse.signature,
            requestId: aiResponse.requestId
          },
        })
        .returning();

      res.json(savedResponse[0]);
    } catch (error) {
      console.error("Error processing AI request:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Admin authentication endpoint
  app.post("/api/admin/auth", (req, res) => {
    const { adminKey } = req.body;
    const correctAdminKey = process.env.ADMIN_KEY || "FLAMINGO2024";

    if (adminKey === correctAdminKey) {
      res.json({ success: true, message: "Admin access granted" });
    } else {
      res.status(401).json({ success: false, message: "Invalid admin key" });
    }
  });

  // Admin stats endpoint
  app.get("/api/admin/stats", authenticateAdmin, async (req, res) => {
    try {
      const totalUsers = await db.select().from(users);
      const totalConversations = await db.select().from(conversations);

      const stats = {
        totalUsers: totalUsers.length,
        totalConversations: totalConversations.length,
        activeModels: 7,
        uptime: '99.9%',
        recentActivity: [
          {
            type: 'user_registration',
            message: 'New user registered',
            timestamp: new Date().toISOString(),
            icon: 'fas fa-user-plus',
            color: 'text-green-600'
          }
        ]
      };

      res.json(stats);
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Admin users endpoint
  app.get("/api/admin/users", authenticateAdmin, async (req, res) => {
    try {
      const allUsers = await db.select().from(users);
      const usersWithoutPasswords = allUsers.map(({ password, ...user }) => ({
        ...user,
        conversationCount: 0,
        lastActive: 'Recently',
        status: 'active' as const
      }));

      res.json(usersWithoutPasswords);
    } catch (error) {
      console.error("Error fetching admin users:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Admin environment endpoint
  app.get("/api/admin/env", authenticateAdmin, async (req, res) => {
    try {
      const envData = {
        environment: process.env.NODE_ENV || 'development',
        variables: [
          { name: 'NODE_ENV', value: process.env.NODE_ENV || 'development', type: 'public', description: 'Application environment' },
          { name: 'ADMIN_KEY', value: '••••••••', type: 'secret', description: 'Admin access key' },
          { name: 'DATABASE_URL', value: '••••••••', type: 'secret', description: 'Database connection string' }
        ],
        models: [
          { name: 'GPT-4', status: 'active', type: 'cloud', description: 'OpenAI GPT-4 via OpenRouter' },
          { name: 'Claude-3', status: 'active', type: 'cloud', description: 'Anthropic Claude-3 via OpenRouter' },
          { name: 'Llama-2-7b', status: 'active', type: 'local', description: 'Meta Llama-2 7B (Local HF)' },
          { name: 'CodeLlama', status: 'inactive', type: 'local', description: 'Code generation model' }
        ]
      };

      res.json(envData);
    } catch (error) {
      console.error("Error fetching admin env:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Add chat router
  app.use("/api", chatRouter);
  app.use("/api", enhancementRoutes);

  // Puter integration route - Human crafted
  app.post("/api/puter-chat", async (req, res) => {
    try {
      const { prompt } = req.body;

      if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
      }

      // Use the Puter adapter to generate response
      const { callProvider } = await import("./adapters/puter-adapter");
      const result = await callProvider({
        prompt,
        task: "chat",
        options: { temperature: 0.7, maxTokens: 1500 }
      });

      res.json({
        response: result.text,
        model: result.model,
        provider: result.provider
      });
    } catch (error: any) {
      console.error("Puter chat error:", error);
      res.status(500).json({ error: "Puter integration failed" });
    }
  });

  app.get("/api/puter-status", async (req, res) => {
    try {
      // Check if Puter is configured and available
      const apiKey = process.env.PUTER_API_KEY;
      res.json({ available: !!apiKey, status: "ready" });
    } catch (error) {
      res.json({ available: false, status: "error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}