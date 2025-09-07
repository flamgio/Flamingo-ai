import { Sequelize, DataTypes, Model } from 'sequelize';
import bcrypt from 'bcryptjs';

// User interface
interface UserAttributes {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: 'user' | 'admin' | 'manager';
  isPremium: boolean;
}

// Conversation interface
interface ConversationAttributes {
  id?: number;
  userId: number;
  prompt: string;
  response: string;
}

// User model class
class UserModel extends Model<UserAttributes> implements UserAttributes {
  public id!: number;
  public firstName!: string;
  public lastName!: string;
  public email!: string;
  public password!: string;
  public role!: 'user' | 'admin' | 'manager';
  public isPremium!: boolean;
  
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  
  public async validatePassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }
}

// Conversation model class
class ConversationModel extends Model<ConversationAttributes> implements ConversationAttributes {
  public id!: number;
  public userId!: number;
  public prompt!: string;
  public response!: string;
  
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Get database URL from environment variable for security
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required");
}

// Create Sequelize instance with SSL support
const sequelize = new Sequelize(DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

// Initialize User model
UserModel.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('user', 'admin', 'manager'),
    defaultValue: 'user'
  },
  isPremium: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  sequelize,
  modelName: 'User',
  timestamps: true,
  hooks: {
    beforeCreate: async (user: UserModel) => {
      if (user.password) {
        user.password = await bcrypt.hash(user.password, 12);
      }
    },
    beforeUpdate: async (user: UserModel) => {
      if (user.changed('password')) {
        user.password = await bcrypt.hash(user.password, 12);
      }
    }
  }
});

// Initialize Conversation model
ConversationModel.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: UserModel,
      key: 'id'
    }
  },
  prompt: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  response: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'Conversation',
  timestamps: true
});

// Define associations
UserModel.hasMany(ConversationModel, { foreignKey: 'userId' });
ConversationModel.belongsTo(UserModel, { foreignKey: 'userId' });

// Export models with proper aliases
export { sequelize, UserModel as User, ConversationModel as Conversation };

console.log('✅ Database configured with Sequelize and external PostgreSQL');

// Initialize database and create tables
export async function initializeDatabase() {
  try {
    // Test connection
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully');
    
    // Sync database (create/update tables)
    await sequelize.sync({ alter: true });
    console.log('✅ Database tables synchronized');
    
    // Provision admin accounts
    await provisionAdminAccounts();
  } catch (error) {
    console.error('❌ Unable to connect to database:', error);
  }
}

// Admin account provisioning function (credentials hidden in environment)
export async function provisionAdminAccounts() {
  try {
    const adminAccounts = [
      {
        email: 'Flamingo@admin.flam',
        firstName: 'Flamingo',
        lastName: 'Admin',
        role: 'admin',
        password: process.env.ADMIN_PASSWORD || 'AdminFlamingo69'
      },
      {
        email: 'Flamingo@manager.flam',
        firstName: 'Flamingo',
        lastName: 'Manager',
        role: 'manager',
        password: process.env.MANAGER_PASSWORD || 'ManagerFlamingo69'
      }
    ];

    for (const account of adminAccounts) {
      // Check if account already exists
      const existingUser = await UserModel.findOne({ 
        where: { email: account.email } 
      });

      if (!existingUser) {
        // Create account (password will be hashed automatically)
        await UserModel.create({
          firstName: account.firstName,
          lastName: account.lastName,
          email: account.email,
          password: account.password,
          role: account.role as 'admin' | 'manager',
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