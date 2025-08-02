# Overview

This is a full-stack portfolio website application built with React, Express, TypeScript, and PostgreSQL. The application features a personal portfolio showcasing skills, projects, and an about section, along with a contact form that allows visitors to send messages. The backend provides API endpoints for handling contact form submissions and retrieving stored contact data.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety
- **Routing**: Wouter for lightweight client-side routing
- **UI Components**: Shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: TanStack Query for server state management
- **Form Handling**: React Hook Form with Zod validation
- **Build Tool**: Vite for fast development and optimized builds

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Development**: tsx for TypeScript execution in development
- **Production Build**: esbuild for fast bundling

## Data Storage Solutions
- **Database**: PostgreSQL with Neon serverless driver
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema Management**: Drizzle migrations for database versioning
- **Development Storage**: In-memory storage implementation for testing

## Database Schema
- **Contacts Table**: Stores contact form submissions with name, email, subject, message, and timestamp
- **Users Table**: Basic user structure with username and password (currently unused)
- **Type Safety**: Generated TypeScript types from Drizzle schema definitions

## API Structure
- **RESTful Design**: Express routes following REST conventions
- **Contact Management**: 
  - POST `/api/contacts` - Submit contact form
  - GET `/api/contacts` - Retrieve all contacts (admin functionality)
- **Validation**: Zod schema validation for request payloads
- **Error Handling**: Centralized error handling with proper HTTP status codes

## Authentication & Authorization
- **Current State**: Basic user schema exists but authentication is not implemented
- **Session Storage**: connect-pg-simple configured for PostgreSQL session storage
- **Future Implementation**: Ready for session-based authentication

# External Dependencies

## Database Services
- **Neon Database**: Serverless PostgreSQL hosting
- **Connection**: @neondatabase/serverless driver for optimal performance

## UI Libraries
- **Radix UI**: Comprehensive set of accessible UI primitives
- **Lucide React**: Icon library for consistent iconography
- **React Icons**: Additional icon sets including social media icons
- **Embla Carousel**: Carousel functionality for project showcases

## Development Tools
- **Replit Integration**: Configured for Replit development environment
- **Vite Plugins**: Runtime error overlay and cartographer for enhanced development experience
- **PostCSS**: CSS processing with Tailwind CSS and Autoprefixer

## Form & Validation
- **React Hook Form**: Performant form handling with minimal re-renders
- **Zod**: Runtime type validation and schema definition
- **Hookform Resolvers**: Integration between React Hook Form and Zod

## Utility Libraries
- **clsx & tailwind-merge**: Conditional CSS class handling
- **date-fns**: Date manipulation and formatting
- **class-variance-authority**: Type-safe variant styling