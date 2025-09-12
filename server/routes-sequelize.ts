import type { Express } from "express";
import { createServer, type Server } from "http";
import { User, Conversation } from './db';
import {
  generateToken,
  authenticateToken,
  optionalAuth,
  authenticateRole,
  type AuthRequest
} from "./auth";
import bcrypt from "bcryptjs";

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

      // Check for reserved emails
      const reservedEmails = ['Flamingo@admin.flam', 'Flamingo@manager.flam'];
      if (reservedEmails.includes(email)) {
        return res.status(400).json({ message: "This email is reserved" });
      }

      // Check if user already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Create user (password will be hashed automatically)
      const user = await User.create({
        email,
        firstName,
        lastName,
        password,
        role: 'user',
        isPremium: false
      });

      const token = generateToken(user.id);
      res.json({
        message: "User created successfully",
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          isPremium: user.isPremium
        }
      });
    } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }

      // Find user
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Verify password
      const isValid = await user.validatePassword(password);
      if (!isValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = generateToken(user.id);
      res.json({
        message: "Login successful",
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          isPremium: user.isPremium
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get current user
  app.get("/api/user", authenticateToken, async (req: AuthRequest, res) => {
    res.json({
      user: {
        id: req.user.id,
        email: req.user.email,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        role: req.user.role,
        isPremium: req.user.isPremium
      }
    });
  });

  // Chat routes
  app.post("/api/conversations", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const { title } = req.body;

      const conversation = await Conversation.create({
        userId: req.user.id,
        prompt: title || "New conversation",
        response: "Hello! How can I help you today?"
      });

      res.json({
        id: conversation.id,
        title: conversation.prompt,
        createdAt: conversation.createdAt
      });
    } catch (error) {
      console.error('Create conversation error:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Send message to AI agent
  app.post("/api/agent", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const { prompt, conversationId } = req.body;

      if (!prompt) {
        return res.status(400).json({ message: "Prompt is required" });
      }

      // For now, simulate AI response (you can integrate with actual AI service later)
      const aiResponse = `Thank you for your message: "${prompt}". This is a simulated AI response. The system is working correctly with the new Sequelize database!`;

      // Save the conversation
      const conversation = await Conversation.create({
        userId: req.user.id,
        prompt,
        response: aiResponse
      });

      res.json({
        message: "Message processed successfully",
        response: aiResponse,
        conversationId: conversation.id
      });
    } catch (error) {
      console.error('AI agent error:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get conversation messages (for compatibility)
  app.get("/api/conversations/:id/messages", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const conversationId = req.params.id;
      
      const conversations = await Conversation.findAll({
        where: { 
          userId: req.user.id,
          id: conversationId
        },
        order: [['createdAt', 'ASC']]
      });

      // Convert to message format expected by frontend
      const messages = conversations.flatMap(conv => [
        {
          id: `user-${conv.id}`,
          content: conv.prompt,
          role: 'user',
          conversationId: conv.id,
          createdAt: conv.createdAt,
          selectedModel: null
        },
        {
          id: `assistant-${conv.id}`,
          content: conv.response,
          role: 'assistant',
          conversationId: conv.id,
          createdAt: conv.createdAt,
          selectedModel: 'flamingo-ai'
        }
      ]);

      res.json(messages);
    } catch (error) {
      console.error('Get messages error:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get user conversations
  app.get("/api/conversations", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const conversations = await Conversation.findAll({
        where: { userId: req.user.id },
        order: [['createdAt', 'DESC']],
        limit: 50
      });

      // Convert to expected format
      const formattedConversations = conversations.map(conv => ({
        id: conv.id,
        title: conv.prompt.substring(0, 50) + (conv.prompt.length > 50 ? '...' : ''),
        createdAt: conv.createdAt,
        updatedAt: conv.updatedAt
      }));

      res.json(formattedConversations);
    } catch (error) {
      console.error('Get conversations error:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Admin routes
  app.get("/api/admin/users", authenticateToken, authenticateRole('admin'), async (req, res) => {
    try {
      const users = await User.findAll({
        attributes: ['id', 'firstName', 'lastName', 'email', 'role', 'isPremium', 'createdAt'],
        order: [['createdAt', 'DESC']]
      });

      res.json({ users });
    } catch (error) {
      console.error('Get users error:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/admin/conversations", authenticateToken, authenticateRole('admin'), async (req, res) => {
    try {
      const conversations = await Conversation.findAll({
        include: [{
          model: User,
          attributes: ['firstName', 'lastName', 'email']
        }],
        order: [['createdAt', 'DESC']],
        limit: 100
      });

      res.json({ conversations });
    } catch (error) {
      console.error('Get all conversations error:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Admin environment endpoint (secure - no exposed secrets)
  app.get("/api/admin/env", authenticateToken, authenticateRole('admin'), async (req, res) => {
    try {
      const envData = {
        environment: process.env.NODE_ENV || 'development',
        variables: [
          { name: 'NODE_ENV', value: process.env.NODE_ENV || 'development', type: 'public', description: 'Application environment' },
          { name: 'DATABASE_URL', value: '••••••••', type: 'secret', description: 'Database connection string (PostgreSQL)' },
          { name: 'ADMIN_PASSWORD', value: '••••••••', type: 'secret', description: 'Admin account password' },
          { name: 'MANAGER_PASSWORD', value: '••••••••', type: 'secret', description: 'Manager account password' }
        ],
        database: {
          status: 'connected',
          type: 'PostgreSQL (External)',
          ssl: 'enabled',
          poolSize: '10 connections'
        }
      };

      res.json(envData);
    } catch (error) {
      console.error('Get admin env error:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Manager routes  
  app.get("/api/manager/stats", authenticateToken, authenticateRole('manager'), async (req, res) => {
    try {
      const userCount = await User.count();
      const conversationCount = await Conversation.count();
      const premiumCount = await User.count({ where: { isPremium: true } });

      res.json({
        stats: {
          totalUsers: userCount,
          totalConversations: conversationCount,
          premiumUsers: premiumCount
        }
      });
    } catch (error) {
      console.error('Get stats error:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Manager route for viewing user conversations (without admin privileges)
  app.get("/api/manager/conversations", authenticateToken, authenticateRole('manager'), async (req, res) => {
    try {
      const conversations = await Conversation.findAll({
        include: [{
          model: User,
          attributes: ['firstName', 'lastName', 'email']
        }],
        order: [['createdAt', 'DESC']],
        limit: 50, // Managers get limited view compared to admin's 100
        attributes: ['id', 'title', 'createdAt', 'updatedAt'] // Less data than admin
      });

      res.json({ conversations });
    } catch (error) {
      console.error('Manager get conversations error:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const server = createServer(app);
  return server;
}