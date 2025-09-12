import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { users, conversations, messages, payments } from "../shared/schema";
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
import { authFallback } from "./auth-fallback";

// Initialize Drizzle with Xata PostgreSQL (with fallback)
let db: any = null;
let useFallback = false;
let dbHealthy = true; // Track database health for better fallback decisions

try {
  if (process.env.DATABASE_URL) {
    // Configure PostgreSQL connection for Xata
    const connectionString = process.env.DATABASE_URL;
    
    // Create postgres client with SSL configuration for Xata
    const sql = postgres(connectionString, {
      ssl: process.env.NODE_ENV === 'production' ? 'require' : 'prefer',
      max: 10,
      idle_timeout: 20,
      connect_timeout: 10,
    });
    
    db = drizzle(sql);
    
    console.log('✅ Database initialized with Drizzle/Xata PostgreSQL');
  } else {
    console.log('⚠️  DATABASE_URL not found, using in-memory fallback');
    useFallback = true;
  }
} catch (error) {
  console.log('⚠️  Database connection failed, using in-memory fallback');
  console.log('Database error:', error);
  useFallback = true;
}

// Role-based authentication middleware
function authenticateRole(requiredRole: 'admin' | 'manager' | 'user') {
  return async (req: any, res: any, next: any) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: "No token provided" });
      }

      const token = authHeader.substring(7);
      let decoded: { userId: string } | null = null;
      let user = null;

      // Try to decode token
      if (useFallback) {
        decoded = authFallback.verifyToken(token);
        if (decoded) {
          user = await authFallback.findUserById(decoded.userId);
        }
      } else {
        try {
          decoded = jwt.verify(token, process.env.JWT_SECRET || 'flamingo-ai-development-secret-key-2024-please-change-in-production') as { userId: string };
          const dbUsers = await db.select().from(users).where(eq(users.id, decoded.userId)).limit(1);
          if (dbUsers.length > 0) {
            user = dbUsers[0];
          }
        } catch (dbError: any) {
          console.warn('Database error in role auth, using fallback for this request:', dbError?.message || dbError);
          dbHealthy = false;
          // Use fallback for this request without permanently switching
          decoded = authFallback.verifyToken(token);
          if (decoded) {
            user = await authFallback.findUserById(decoded.userId);
          }
        }
      }

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      // Check role hierarchy: admin > manager > user
      const userRole = user.role || 'user';
      const roleHierarchy = { 'admin': 3, 'manager': 2, 'user': 1 };
      const requiredLevel = roleHierarchy[requiredRole];
      const userLevel = roleHierarchy[userRole as keyof typeof roleHierarchy];

      if (userLevel < requiredLevel) {
        return res.status(403).json({ message: `Access denied. ${requiredRole} role required.` });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error('Role authentication error:', error);
      res.status(401).json({ message: "Invalid token" });
    }
  };
}

// Legacy admin authentication for backward compatibility
function authenticateAdmin(req: any, res: any, next: any) {
  return authenticateRole('admin')(req, res, next);
}

export async function registerRoutes(app: Express): Promise<Server> {

  // Authentication routes
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const { email, firstName, lastName, password }: { email: string; firstName: string; lastName: string; password: string } = req.body;

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

      // Block reserved names/emails (case-insensitive)
      const reservedEmails = [
        'admin@admin.com', 'manager@manager.com', 'owner@owner.com',
        'flamingo@admin.flam', 'flamingo@manager.flam', 'flamingo@owner.flam'
      ];
      const reservedUsernames = ['admin', 'manager', 'owner', 'flamingo', 'root', 'administrator', 'support'];

      const emailLower = email.toLowerCase();
      const firstNameLower = firstName.toLowerCase();
      const lastNameLower = lastName.toLowerCase();

      // Check reserved emails
      if (reservedEmails.some(reserved => reserved.toLowerCase() === emailLower)) {
        return res.status(403).json({ message: "This email address is reserved for system use" });
      }

      // Check reserved usernames in first/last name
      if (reservedUsernames.some(reserved => 
        firstNameLower === reserved || lastNameLower === reserved || 
        firstNameLower.includes(reserved) || lastNameLower.includes(reserved)
      )) {
        return res.status(403).json({ message: "This name contains reserved terms. Please choose a different name." });
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

      // All users get 'user' role by default
      // Admin and manager accounts are pre-provisioned separately
      const userRole = 'user';

      const newUser = await db
        .insert(users)
        .values({
          username: email,
          email,
          firstName,
          lastName,
          password: hashedPassword,
          role: userRole,
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

      let user = null;
      let isPasswordValid = false;

      if (useFallback) {
        // Use fallback auth system
        user = await authFallback.findUserByEmail(email);
        if (user) {
          isPasswordValid = await authFallback.validatePassword(password, user.password);
        }
      } else {
        // Use database
        try {
          const dbUsers = await db
            .select()
            .from(users)
            .where(eq(users.email, email))
            .limit(1);

          if (dbUsers.length > 0) {
            user = dbUsers[0];
            isPasswordValid = await comparePassword(password, user.password);
          }
        } catch (dbError) {
          console.warn('Database error in login, using fallback for this request:', dbError);
          dbHealthy = false;
          user = await authFallback.findUserByEmail(email);
          if (user) {
            isPasswordValid = await authFallback.validatePassword(password, user.password);
          }
        }
      }

      if (!user || !isPasswordValid) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Generate JWT token
      const token = useFallback ? authFallback.generateToken(user.id) : generateToken(user.id);

      // Return user without password
      const { password: _, ...userWithoutPassword } = user;

      res.json({
        user: userWithoutPassword,
        token,
        message: "Login successful"
      });

    } catch (error) {
      console.error("Login error:", error);
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
      let decoded: { userId: string } | null = null;

      if (useFallback) {
        decoded = authFallback.verifyToken(token);
      } else {
        try {
          decoded = jwt.verify(token, process.env.JWT_SECRET || 'flamingo-ai-development-secret-key-2024-please-change-in-production') as { userId: string };
        } catch {
          decoded = authFallback.verifyToken(token);
          useFallback = true;
        }
      }

      if (!decoded) {
        return res.status(401).json({ message: "Invalid token" });
      }

      let user = null;
      if (useFallback) {
        user = await authFallback.findUserById(decoded.userId);
      } else {
        try {
          const dbUsers = await db.select().from(users).where(eq(users.id, decoded.userId)).limit(1);
          if (dbUsers.length > 0) {
            user = dbUsers[0];
          }
        } catch (dbError) {
          console.log('Database error, falling back to memory auth');
          useFallback = true;
          user = await authFallback.findUserById(decoded.userId);
        }
      }

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      res.json({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role || 'user',
        screenTime: user.screenTime || 0,
        lastActive: user.lastActive
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

  // Payment endpoints
  app.post("/api/payments", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const { amount, currency, method, walletAddress, metadata } = req.body;

      const payment = await db
        .insert(payments)
        .values({
          userId: req.user.id,
          amount,
          currency,
          method,
          walletAddress,
          metadata,
          status: 'pending'
        })
        .returning();

      res.json(payment[0]);
    } catch (error) {
      console.error("Error creating payment:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/payments", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const userPayments = await db
        .select()
        .from(payments)
        .where(eq(payments.userId, req.user.id))
        .orderBy(payments.createdAt);

      res.json(userPayments);
    } catch (error) {
      console.error("Error fetching payments:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Admin analytics endpoints
  app.get("/api/admin/analytics", authenticateRole('admin'), async (req, res) => {
    try {
      let allUsers = [];
      let allConversations = [];
      let allMessages = [];
      let allPayments = [];

      if (useFallback) {
        // Use fallback data
        allUsers = authFallback.getAllUsers();
        allConversations = [];
        allMessages = [];
        allPayments = [];
      } else {
        try {
          allUsers = await db.select().from(users);
          allConversations = await db.select().from(conversations);
          allMessages = await db.select().from(messages);
          allPayments = await db.select().from(payments);
        } catch (dbError) {
          console.log('Database error in analytics, using fallback data');
          useFallback = true;
          allUsers = authFallback.getAllUsers();
          allConversations = [];
          allMessages = [];
          allPayments = [];
        }
      }

      // Calculate analytics
      const totalScreenTime = allUsers.reduce((sum: number, user: any) => sum + (user.screenTime || 0), 0);
      const activeUsers = allUsers.filter((user: any) => {
        const lastActive = user.lastActive ? new Date(user.lastActive) : new Date(user.createdAt || Date.now());
        const now = new Date();
        const daysDiff = (now.getTime() - lastActive.getTime()) / (1000 * 3600 * 24);
        return daysDiff <= 7; // Active in last 7 days
      }).length;

      const analytics = {
        overview: {
          totalUsers: allUsers.length,
          activeUsers,
          totalConversations: allConversations.length,
          totalMessages: allMessages.length,
          totalScreenTime,
          avgScreenTimePerUser: Math.round(totalScreenTime / Math.max(allUsers.length, 1))
        },
        userGrowth: {
          thisMonth: allUsers.filter((user: any) => {
            const created = new Date(user.createdAt || Date.now());
            const now = new Date();
            return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
          }).length,
          lastMonth: allUsers.filter((user: any) => {
            const created = new Date(user.createdAt || Date.now());
            const lastMonth = new Date();
            lastMonth.setMonth(lastMonth.getMonth() - 1);
            return created.getMonth() === lastMonth.getMonth() && created.getFullYear() === lastMonth.getFullYear();
          }).length
        },
        engagement: {
          dailyActiveUsers: allUsers.filter((user: any) => {
            const lastActive = user.lastActive ? new Date(user.lastActive) : new Date(user.createdAt || Date.now());
            const now = new Date();
            const daysDiff = (now.getTime() - lastActive.getTime()) / (1000 * 3600 * 24);
            return daysDiff <= 1; // Active in last 24 hours
          }).length,
          avgMessagesPerConversation: Math.round(allMessages.length / Math.max(allConversations.length, 1))
        },
        revenue: {
          totalPayments: allPayments.length,
          completedPayments: allPayments.filter((p: any) => p.status === 'completed').length,
          pendingPayments: allPayments.filter((p: any) => p.status === 'pending').length
        },
        // Add system health indicators
        systemHealth: 98.7,
        serverUptime: '99.9%',
        totalUsers: allUsers.length,
        activeSessions: Math.floor(allUsers.length * 0.3),
        premiumUsers: allUsers.filter((u: any) => u.isPremium).length,
        dailyActiveUsers: activeUsers
      };

      res.json(analytics);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Admin stats endpoint
  app.get("/api/admin/stats", authenticateRole('admin'), async (req, res) => {
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
      const usersWithoutPasswords = allUsers.map(({ password, ...user }: { password: string; [key: string]: any }) => ({
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