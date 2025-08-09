
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { db } from "./db";
import { users, conversations, messages } from "@shared/schema";
import { eq } from "drizzle-orm";
import { 
  generateToken, 
  hashPassword, 
  comparePassword, 
  authenticateToken, 
  optionalAuth,
  type AuthRequest 
} from "./auth";

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
      res.status(500).json({ message: "Internal server error" });
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
      res.status(500).json({ message: "Internal server error" });
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

  // AI agent endpoint
  app.post("/api/agent", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const { prompt, conversationId, selectedModel } = req.body;

      if (!prompt) {
        return res.status(400).json({ message: "Prompt is required" });
      }

      // Verify conversation belongs to user if provided
      if (conversationId) {
        const conversation = await db
          .select()
          .from(conversations)
          .where(eq(conversations.id, conversationId) && eq(conversations.userId, req.user.id))
          .limit(1);

        if (conversation.length === 0) {
          return res.status(404).json({ message: "Conversation not found" });
        }
      }

      // Import and use AI coordinator
      const { aiCoordinator } = await import('./ai-coordinator');
      
      // Select the best model for the prompt
      const chosenModel = aiCoordinator.selectBestModel(prompt, selectedModel);
      
      // Save user message
      const userMessage = await db
        .insert(messages)
        .values({
          conversationId,
          role: "user",
          content: prompt,
        })
        .returning();

      // Generate AI response using the coordinator
      const aiResponse = await aiCoordinator.generateResponse(prompt, chosenModel);

      // Save AI response
      const savedResponse = await db
        .insert(messages)
        .values({
          conversationId,
          role: "assistant",
          content: aiResponse.content,
          selectedModel: aiResponse.model,
          metadata: {
            processingTime: `${aiResponse.processingTime}ms`,
            tokensUsed: aiResponse.tokensUsed,
            routingDecision: aiResponse.model.includes('facebook/') || aiResponse.model.includes('microsoft/') ? 'local-hf' : 'cloud-openrouter'
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
    const correctAdminKey = process.env.ADMIN_KEY || "flamgio_admin_2024";

    if (adminKey === correctAdminKey) {
      res.json({ success: true });
    } else {
      res.status(401).json({ success: false, message: "Invalid admin key" });
    }
  });

  // Admin endpoints (protected)
  app.get("/api/admin/users", async (req, res) => {
    try {
      const { adminKey } = req.query;
      if (adminKey !== (process.env.ADMIN_KEY || "flamgio_admin_2024")) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const allUsers = await db.select().from(users);
      const usersWithoutPasswords = allUsers.map(({ password, ...user }) => user);
      
      res.json(usersWithoutPasswords);
    } catch (error) {
      console.error("Error fetching admin users:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
