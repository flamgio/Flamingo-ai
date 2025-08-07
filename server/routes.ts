import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
// import { setupAuth, isAuthenticated } from "./replitAuth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication (temporarily disabled due to config issues)
  // if (process.env.REPLIT_DOMAINS) {
  //   await setupAuth(app);
  // }

  // Auth routes
  // Create a middleware that conditionally uses authentication (temporarily disabled)
  const conditionalAuth = (req: any, res: any, next: any) => next();

  app.get("/api/auth/user", conditionalAuth, async (req, res) => {
    try {
      // Return a demo user for development
      const demoUser = {
        id: "demo-user-1",
        username: "demo@example.com",
        password: "",
        email: "demo@example.com",
        firstName: "Demo",
        lastName: "User",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      res.json(demoUser);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Conversations endpoints
  app.get("/api/conversations", conditionalAuth, async (req, res) => {
    try {
      // For now return empty array - this would fetch from database
      res.json([]);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/conversations", conditionalAuth, async (req, res) => {
    try {
      const { title } = req.body;
      
      // Create a mock conversation for demo
      const conversation = {
        id: `conv_${Date.now()}`,
        userId: "demo-user-1",
        title: title || "New Conversation",
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      res.json(conversation);
    } catch (error) {
      console.error("Error creating conversation:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/conversations/:id/messages", conditionalAuth, async (req, res) => {
    try {
      // For now return empty array - this would fetch messages from database
      res.json([]);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // AI agent endpoint
  app.post("/api/agent", conditionalAuth, async (req, res) => {
    try {
      const { prompt, conversationId } = req.body;
      
      // Mock AI response with realistic content
      const response = {
        id: `msg_${Date.now()}`,
        conversationId,
        role: "assistant",
        content: `Hello! I'm Flamgio AI. You asked: "${prompt}"\n\nThis is a demonstration of the intelligent agent routing system. In production, this message would be processed by either:\n\n• **Local Hugging Face models** for simple queries\n• **Cloud models (OpenRouter)** for complex analysis\n\nThe system automatically selects the best model based on your prompt complexity and maintains conversation memory across all interactions.`,
        selectedModel: "flamgio-coordinator",
        metadata: {
          routingDecision: "demo-mode",
          processingTime: "125ms"
        },
        createdAt: new Date()
      };
      
      res.json(response);
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

  const httpServer = createServer(app);
  return httpServer;
}
