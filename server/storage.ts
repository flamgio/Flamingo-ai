import { type User, type InsertUser } from "@shared/schema";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  upsertUser(userInfo: { id: string; email?: string; firstName?: string; lastName?: string; profileImageUrl?: string }): Promise<User>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;

  constructor() {
    this.users = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const now = new Date();
    const user: User = { 
      id,
      username: insertUser.username,
      password: insertUser.password,
      email: insertUser.email ?? null,
      firstName: insertUser.firstName ?? null,
      lastName: insertUser.lastName ?? null,
      createdAt: now,
      updatedAt: now
    };
    this.users.set(id, user);
    return user;
  }

  async upsertUser(userInfo: { id: string; email?: string; firstName?: string; lastName?: string; profileImageUrl?: string }): Promise<User> {
    const existingUser = this.users.get(userInfo.id);
    const now = new Date();
    
    if (existingUser) {
      const updatedUser: User = {
        ...existingUser,
        email: userInfo.email ?? existingUser.email,
        firstName: userInfo.firstName ?? existingUser.firstName,
        lastName: userInfo.lastName ?? existingUser.lastName,
        updatedAt: now,
      };
      this.users.set(userInfo.id, updatedUser);
      return updatedUser;
    } else {
      const newUser: User = {
        id: userInfo.id,
        username: userInfo.email || `user_${userInfo.id}`,
        password: "", // Not used for OIDC
        email: userInfo.email ?? null,
        firstName: userInfo.firstName ?? null,
        lastName: userInfo.lastName ?? null,
        createdAt: now,
        updatedAt: now,
      };
      this.users.set(userInfo.id, newUser);
      return newUser;
    }
  }
}

export const storage = new MemStorage();
