# Personal Portfolio Website

## Overview

This is a modern, responsive personal portfolio website for Atif Hasan, a web developer and designer from Bangladesh. The application is built as a full-stack web application with a React frontend and Express backend, designed to showcase projects, skills, and professional information in an elegant, dark-themed interface.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development practices
- **Routing**: Wouter for lightweight client-side routing
- **Styling**: Tailwind CSS with custom CSS variables for consistent theming, featuring a dark color scheme
- **UI Components**: shadcn/ui component library built on Radix UI primitives for accessible, customizable components
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript for type safety across the entire stack
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Session Storage**: PostgreSQL-based session storage using connect-pg-simple
- **Development**: Hot module replacement and error overlay for improved developer experience

### Component Structure
The frontend follows a modular component architecture with clearly separated concerns:
- **Page Components**: Main portfolio page with routing setup
- **Section Components**: Modular sections (Hero, About, Services, Works, Contact, Footer) for easy maintenance
- **UI Components**: Reusable shadcn/ui components for consistent design patterns
- **Layout Components**: Navigation and structural elements

### Database Design
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema**: User authentication schema with username/password fields
- **Migrations**: Structured migration system in dedicated migrations directory

### Development Environment
- **Package Manager**: npm with lockfile for dependency consistency
- **TypeScript Configuration**: Strict mode enabled with modern ES modules and DOM types
- **Path Aliases**: Configured for clean imports (@/, @shared/, @assets/)
- **Code Quality**: ESM modules throughout the project for modern JavaScript standards

## External Dependencies

### Database
- **Neon Database**: Serverless PostgreSQL database using @neondatabase/serverless driver
- **Connection**: Environment variable-based connection string (DATABASE_URL)

### UI Framework
- **Radix UI**: Comprehensive set of unstyled, accessible UI primitives
- **Tailwind CSS**: Utility-first CSS framework for rapid styling
- **Lucide React**: Icon library for consistent iconography

### Development Tools
- **Replit Integration**: Development environment optimized for Replit with specific plugins and configurations
- **Vite Plugins**: Custom error modal and cartographer for enhanced development experience
- **PostCSS**: CSS processing with Tailwind CSS and Autoprefixer

### Fonts and Assets
- **Google Fonts**: Poppins and Montserrat font families for modern typography
- **Placeholder Images**: Temporary placeholder.co images for project showcases and testimonials

### Form Handling
- **React Hook Form**: Form state management and validation
- **Hookform Resolvers**: Integration layer for validation libraries
- **Zod**: Schema validation for form inputs and API data

The architecture prioritizes developer experience, performance, and maintainability while providing a solid foundation for a professional portfolio website.