# Flamgio - AI Chat Platform

## Overview

Flamgio is a privacy-first, full-stack AI chat platform that intelligently routes user prompts between local Hugging Face models and cloud-based OpenRouter models. The platform features a modern React frontend with a Node.js/Express backend, designed to provide seamless AI conversations with intelligent model selection based on prompt complexity. The system includes conversation memory, user authentication, and a responsive chat interface inspired by modern AI platforms like Perplexity and ChatGPT.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client-side is built with React and TypeScript using a modern component-based architecture:

- **Build System**: Vite for fast development and optimized production builds with runtime error overlay for development
- **UI Framework**: React with TypeScript for type safety and component structure
- **Component Library**: Shadcn/ui components built on Radix UI primitives for accessible, customizable UI components
- **Styling**: Tailwind CSS with custom design system featuring brand colors (orange, pink, coral gradients) and CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state management, caching, and API synchronization
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation for type-safe form management
- **Theme System**: Custom theme provider supporting light/dark modes with system preference detection

### Backend Architecture
The server-side follows a REST API architecture with Express.js and intelligent AI routing:

- **Framework**: Express.js with TypeScript for the API server
- **Database Layer**: Drizzle ORM for type-safe database operations with PostgreSQL
- **AI Coordination**: Custom AI coordinator that analyzes prompt complexity and routes to appropriate models
- **Model Integration**: 
  - Local models via Hugging Face Spaces API
  - Cloud models via OpenRouter API (7 free models with fallback logic)
- **Session Management**: Express sessions with PostgreSQL storage
- **Memory System**: Conversation persistence with user-specific context management

### Data Storage Solutions
The application uses PostgreSQL as the primary database with Neon serverless hosting:

- **Database**: PostgreSQL with connection pooling via Neon serverless
- **Schema Design**: 
  - Users table for authentication and profile management
  - Conversations table for chat sessions with titles and timestamps
  - Messages table for storing conversation history with role, content, and model metadata
  - Sessions table for authentication session persistence
- **Database Migrations**: Drizzle Kit for schema management and migrations
- **Memory Management**: In-memory caching combined with persistent PostgreSQL storage

### Authentication and Authorization
Security is implemented through Replit's OIDC authentication system:

- **Authentication Provider**: Replit OIDC for seamless integration with the Replit ecosystem
- **Session Strategy**: Server-side sessions stored in PostgreSQL with configurable TTL
- **Authorization**: Route-level authentication middleware protecting API endpoints
- **User Management**: Automatic user creation and profile management through OIDC claims

## External Dependencies

### AI Model Providers
- **Hugging Face Spaces**: Local model hosting for simple prompts with configurable endpoint URL
- **OpenRouter**: Cloud model API providing access to 7 free models including:
  - Kimi-K2, Kimi-Dev-72B, Mixtral-8x7B, MythoMax-L2, Nous-Capybara, Kimi-VL-A3B, Llama-3.3-70B
- **Model Fallback System**: Automatic switching between models on rate limits or errors

### Database and Infrastructure
- **Neon PostgreSQL**: Serverless PostgreSQL hosting with connection pooling
- **Replit Authentication**: OIDC-based authentication and user management
- **Replit Hosting**: Development and deployment platform integration

### Development Tools
- **Replit Cartographer**: Development-time code mapping and analysis
- **Replit Runtime Error Modal**: Enhanced error reporting in development
- **PostCSS & Autoprefixer**: CSS processing and vendor prefix management

### Frontend Libraries
- **React Query**: Server state management and caching
- **Radix UI**: Accessible component primitives for UI elements
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library for consistent iconography
- **React Markdown**: Markdown rendering for AI responses
- **Date-fns**: Date formatting and manipulation utilities