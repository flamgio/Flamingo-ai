// Simple in-memory auth system for development
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role: 'user' | 'admin' | 'manager';
  isPremium?: boolean;
}

// In-memory user storage
const users: Map<string, User> = new Map();

// Pre-seed admin and manager accounts
const seedUsers = async () => {
  // Admin account: Flamingo@admin.flam / AdminFlamingo69
  const adminId = 'admin-001';
  const adminUser: User = {
    id: adminId,
    email: 'Flamingo@admin.flam',
    firstName: 'Flamingo',
    lastName: 'Admin',
    password: await bcrypt.hash('AdminFlamingo69', 10),
    role: 'admin',
    isPremium: true
  };
  users.set(adminId, adminUser);

  // Manager account: Flamingo@manager.flam / ManagerFlamingo69
  const managerId = 'manager-001';
  const managerUser: User = {
    id: managerId,
    email: 'Flamingo@manager.flam', 
    firstName: 'Flamingo',
    lastName: 'Manager',
    password: await bcrypt.hash('ManagerFlamingo69', 10),
    role: 'manager',
    isPremium: true
  };
  users.set(managerId, managerUser);

  console.log('✅ Seeded admin and manager accounts');
  console.log('Admin: Flamingo@admin.flam / AdminFlamingo69');
  console.log('Manager: Flamingo@manager.flam / ManagerFlamingo69');
};

// Initialize seeded users
seedUsers();

export const authFallback = {
  async findUserByEmail(email: string): Promise<User | null> {
    for (const user of users.values()) {
      if (user.email === email) {
        return user;
      }
    }
    return null;
  },

  async findUserById(id: string): Promise<User | null> {
    return users.get(id) || null;
  },

  async createUser(userData: {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    role?: 'user' | 'admin' | 'manager';
  }): Promise<User> {
    const userId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    const user: User = {
      id: userId,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      password: hashedPassword,
      role: userData.role || 'user',
      isPremium: false
    };

    users.set(userId, user);
    return user;
  },

  async validatePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  },

  generateToken(userId: string): string {
    return jwt.sign(
      { userId }, 
      process.env.JWT_SECRET || 'flamingo-ai-development-secret-key-2024-please-change-in-production',
      { expiresIn: '7d' }
    );
  },

  verifyToken(token: string): { userId: string } | null {
    try {
      return jwt.verify(token, process.env.JWT_SECRET || 'flamingo-ai-development-secret-key-2024-please-change-in-production') as { userId: string };
    } catch {
      return null;
    }
  },

  // Get all users (for admin)
  getAllUsers(): User[] {
    return Array.from(users.values()).map(({ password, ...user }) => user as any);
  }
};