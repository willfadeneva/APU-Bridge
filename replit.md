# APU Bridge - University Social Network Platform

## Overview

APU Bridge is a comprehensive university social networking platform that connects students, alumni, faculty, and staff within APU. The application provides a LinkedIn-like experience tailored for the APU community, featuring user profiles, social feeds, networking capabilities, job postings, and real-time messaging.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a modern full-stack architecture with clear separation of concerns:

### Frontend Architecture
- **Framework**: React with TypeScript
- **UI Components**: shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS with custom university theme colors
- **State Management**: TanStack Query (React Query) for server state
- **Routing**: Wouter for lightweight client-side routing
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js for REST API
- **Database ORM**: Drizzle ORM with PostgreSQL
- **Authentication**: Replit Auth with OpenID Connect
- **Session Management**: Express session with PostgreSQL store
- **Real-time Communication**: WebSocket support for messaging

### Development Environment
- **Monorepo Structure**: Shared types and schemas between client and server
- **Development Server**: Vite dev server with Express proxy
- **Hot Module Replacement**: Full HMR support in development
- **Error Handling**: Runtime error overlays in development

## Key Components

### Authentication System
- Replit Auth integration with OpenID Connect
- Session-based authentication with PostgreSQL storage
- Role-based access control (student, alumni, faculty, admin)
- Protected routes and API endpoints

### User Management
- Comprehensive user profiles with university-specific fields
- Profile customization with roles, graduation year, major, skills
- User search and discovery functionality
- Profile image support

### Social Features
- Post creation and sharing with rich content support
- Like and comment system
- Social feed with personalized content
- Connection requests and network building
- Real-time messaging between users

### Job Platform
- Job posting and application system
- Support for various job types (internship, full-time, part-time, contract)
- Application tracking with cover letters
- Company and location-based filtering

### Database Design
- User profiles with university-specific metadata
- Posts with author relationships and engagement metrics
- Connection system with pending/accepted states
- Job postings with applicant tracking
- Message threads for real-time communication
- Session storage for authentication persistence

## Data Flow

### Client-Server Communication
- RESTful API design with consistent error handling
- TanStack Query for optimistic updates and caching
- WebSocket connections for real-time messaging
- File upload support for profile images and content

### State Management
- Server state managed by TanStack Query
- Local component state for UI interactions
- Global auth state through custom hooks
- Optimistic updates for better user experience

### Real-time Features
- WebSocket server for live messaging
- Connection status tracking
- Real-time notifications for new messages
- Live updates for social interactions

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connection
- **drizzle-orm**: Type-safe database ORM
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Accessible UI component primitives
- **tailwindcss**: Utility-first CSS framework
- **wouter**: Lightweight routing library

### Authentication & Security
- **openid-client**: OpenID Connect authentication
- **passport**: Authentication middleware
- **express-session**: Session management
- **connect-pg-simple**: PostgreSQL session store

### Development Tools
- **vite**: Build tool and dev server
- **typescript**: Type safety
- **eslint**: Code linting
- **@replit/vite-plugin-***: Replit-specific development tools

## Deployment Strategy

### Production Build
- Vite builds optimized client bundle to `dist/public`
- esbuild compiles server TypeScript to `dist/index.js`
- Static assets served by Express in production
- Environment-specific configurations

### Database Management
- Drizzle Kit for schema migrations
- PostgreSQL with Neon serverless for scalability
- Automated schema synchronization
- Connection pooling for performance

### Environment Configuration
- Development: Vite dev server with HMR
- Production: Single Express server serving API and static files
- Environment variables for database and auth configuration
- Replit-specific optimizations for development experience

### Scalability Considerations
- Stateless server design for horizontal scaling
- Database connection pooling
- WebSocket server can be scaled separately
- CDN-ready static asset structure