import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { users, conversations, messages } from "@shared/schema";
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';

// Replit database configuration
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required. Please ensure the database is provisioned in Replit.");
}

// Create postgres connection with proper SSL configuration for Replit
const connectionString = process.env.DATABASE_URL;
const client = postgres(connectionString, {
  ssl: connectionString.includes('sslmode=disable') ? false : 'require',
  prepare: false,
  max: 10,
  idle_timeout: 20,
  transform: {
    undefined: null
  }
});

export const db = drizzle(client, {
  schema: { users, conversations, messages },
  logger: process.env.NODE_ENV === 'development'
});

// Export tables from shared schema  
export { users, conversations, messages };

console.log('✅ Database configured for Replit PostgreSQL with postgres-js');

// Admin account provisioning function
export async function provisionAdminAccounts() {
  try {
    
    const adminAccounts = [
      {
        email: 'Flamingo@admin.flam',
        username: 'Flamingo@admin.flam',
        firstName: 'Admin',
        lastName: 'Flamingo',
        role: 'admin',
        password: 'FlamingoAdmin2024!'
      },
      {
        email: 'Flamingo@manager.flam',
        username: 'Flamingo@manager.flam',
        firstName: 'Manager',
        lastName: 'Flamingo',
        role: 'manager',
        password: 'FlamingoManager2024!'
      }
    ];

    for (const account of adminAccounts) {
      // Check if account already exists
      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.email, account.email))
        .limit(1);

      if (existingUser.length === 0) {
        // Hash password
        const hashedPassword = await bcrypt.hash(account.password, 12);
        
        // Create account
        await db.insert(users).values({
          username: account.username,
          email: account.email,
          firstName: account.firstName,
          lastName: account.lastName,
          password: hashedPassword,
          role: account.role,
        });

        console.log(`✅ Created ${account.role} account: ${account.email}`);
      } else {
        console.log(`⚡ ${account.role} account already exists: ${account.email}`);
      }
    }
  } catch (error) {
    console.error('Error provisioning admin accounts:', error);
  }
}