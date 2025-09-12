# Flamingo AI Chat Platform

A privacy-first, full-stack AI chat platform built with modern web technologies. Features intelligent conversation routing, user authentication, and a responsive chat interface.

## Features

🤖 **Smart AI Integration** - Intelligent model selection for optimal responses
🔒 **Privacy First** - User data protection and secure authentication
💾 **Persistent Storage** - Conversation history and user preferences
⚡ **Real-time Chat** - Fast, responsive messaging interface
🎨 **Modern UI** - Clean, accessible design with dark/light themes
📱 **Responsive Design** - Works on desktop, tablet, and mobile

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and builds
- **Tailwind CSS** with Shadcn/UI components
- **TanStack Query** for data fetching and caching
- **Framer Motion** for animations
- **Wouter** for lightweight routing

### Backend
- **Express.js** with TypeScript
- **PostgreSQL** with Drizzle ORM
- **JWT Authentication**
- **WebSocket Support**
- **RESTful API Design**

### Infrastructure
- **Docker** ready
- **Environment-based configuration**
- **Hot reload in development**
- **Production optimized builds**

## Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Environment variables (see below)

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd flamingo-ai-chat
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Set up the database
```bash
npm run db:push
```

5. Start development server
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Environment Configuration

Create a `.env` file with the following variables:

```bash
# Database
DATABASE_URL=your_postgresql_connection_string

# Authentication
JWT_SECRET=your_jwt_secret_key

# AI Provider Configuration
# (Configure your preferred AI service endpoints)

# Server Configuration
NODE_ENV=development
PORT=5000
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:push` - Sync database schema
- `npm run check` - Type checking

## Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/        # Route pages
│   │   ├── hooks/        # Custom React hooks
│   │   ├── lib/          # Utilities and helpers
│   │   └── styles/       # CSS and styling
├── server/                # Backend Express application
│   ├── adapters/         # External service integrations
│   ├── routes/           # API route handlers
│   └── auth/             # Authentication logic
├── shared/                # Shared types and schemas
└── docs/                  # Documentation
```

## Contributing

Please read [CONTRIBUTE.md](CONTRIBUTE.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions, please check the documentation or open an issue in the repository.

## Acknowledgments

- Built with modern web development best practices
- Inspired by leading AI chat platforms
- Community-driven development approach