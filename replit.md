# Knockturn Private Limited Employee Timestrap

## Overview

The Knockturn Private Limited Employee Timestrap is a full-stack employee time tracking web application with a futuristic corporate aesthetic. The application allows employees to log in, track their daily tasks with start and end times, and visualize their productivity through interactive charts. It features a unique GSAP-powered lamp animation on the login page and a dark, professional interface with electric blue accents throughout.

The system automatically creates employee records on first login, manages daily timesheets, and provides real-time analytics on work patterns including task duration tracking, work vs break time analysis, and hourly productivity visualization.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18 with TypeScript, built using Vite for fast development and optimized production builds.

**UI Component System**: Radix UI primitives with shadcn/ui components styled using Tailwind CSS. The design system follows a "new-york" style configuration with custom theme variables for consistent dark mode aesthetics.

**Routing**: Wouter for lightweight client-side routing with two primary routes:
- `/` - Login page with GSAP lamp animation
- `/tracker` - Main timesheet tracking interface

**State Management**: 
- TanStack Query (React Query) for server state management with automatic caching and synchronization
- Local component state using React hooks
- localStorage for persisting employee session data between page refreshes

**Animations**: GSAP (GreenSock Animation Platform) for the interactive lamp pull animation on the login page, providing smooth transitions and professional motion design.

**Data Visualization**: Chart.js with react-chartjs-2 wrapper for rendering:
- Doughnut charts (work vs break time)
- Bar charts (task-wise hours breakdown)
- Line charts (hourly productivity trends)

**Styling Approach**: Tailwind CSS with custom design tokens defined in CSS variables. The color palette centers around pure black backgrounds (#000000) with electric blue accents (#0EA5E9, #3B82F6, #60A5FA) and glowing effects. Typography uses Inter/Poppins for body text and JetBrains Mono for monospaced data displays.

### Backend Architecture

**Runtime**: Node.js with Express.js framework handling HTTP requests and middleware.

**API Design**: RESTful API with the following core endpoints:
- `POST /api/login` - Employee authentication/creation
- `GET /api/employees/:employeeId/timesheet` - Retrieve daily timesheet with tasks
- `POST /api/employees/:employeeId/tasks` - Create new task entries
- `PATCH /api/tasks/:taskId` - Update task details (completion status, end time)
- `POST /api/timesheets/:timesheetId/submit` - Submit completed timesheet

**Data Layer**: Storage abstraction through `IStorage` interface pattern implemented by `DbStorage` class, allowing for potential database swapping while maintaining consistent business logic.

**Session Management**: Stateless authentication using localStorage on the client side to store employee credentials (employeeId, name, dbId).

**Development Server**: Vite integration in development mode with HMR (Hot Module Replacement) for rapid iteration. Production builds serve static assets from Express.

### Data Storage

**Database**: PostgreSQL accessed via Neon serverless driver with WebSocket connections for edge compatibility.

**ORM**: Drizzle ORM for type-safe database queries and schema management.

**Schema Design**:

**employees** table:
- `id` (UUID, primary key) - Internal database identifier
- `employeeId` (text, unique) - User-facing employee ID for login
- `name` (text) - Employee full name
- `createdAt` (timestamp) - Account creation timestamp

**timesheets** table:
- `id` (UUID, primary key)
- `employeeId` (foreign key → employees.id)
- `date` (text) - Date in YYYY-MM-DD format
- `totalWorkSeconds` (integer) - Cumulative work time
- `isSubmitted` (boolean) - Submission status flag
- `submittedAt` (timestamp, nullable) - When timesheet was finalized
- `createdAt` (timestamp)

**tasks** table:
- `id` (UUID, primary key)
- `timesheetId` (foreign key → timesheets.id)
- `title` (text) - Task description
- `startTime` (timestamp) - When task began
- `endTime` (timestamp, nullable) - When task completed
- `durationSeconds` (integer) - Calculated task duration
- `isComplete` (boolean) - Completion status
- `createdAt` (timestamp)

**Rationale**: This normalized schema separates employee identity from daily timesheets and individual tasks, allowing for historical tracking and aggregate analytics. The use of seconds for duration storage provides precision while remaining database-friendly.

**Schema Validation**: Zod schemas generated from Drizzle definitions using `drizzle-zod` for runtime type validation on API boundaries.

**Migrations**: Managed via Drizzle Kit with migration files stored in `/migrations` directory. The `db:push` script synchronizes schema changes to the database.

### External Dependencies

**Database Service**: Neon Serverless PostgreSQL
- Provides WebSocket-based PostgreSQL connections for serverless environments
- Connection string stored in `DATABASE_URL` environment variable
- Pool-based connection management for efficient resource utilization

**UI Component Libraries**: 
- Radix UI primitives (@radix-ui/*) - 25+ component packages for accessible, unstyled UI primitives
- shadcn/ui components built on top of Radix primitives with Tailwind styling

**Animation Libraries**:
- GSAP (GreenSock) - Professional-grade JavaScript animation library for the lamp interaction
- Chart.js - Canvas-based charting library for data visualization

**Utility Libraries**:
- date-fns - Date manipulation and formatting (used for timesheet date handling)
- nanoid - Unique ID generation for client-side operations
- clsx & tailwind-merge - Conditional class name utilities
- class-variance-authority - Type-safe component variant management

**Development Tools**:
- TypeScript - Type safety across frontend and backend
- ESBuild - Fast JavaScript bundler for production backend builds
- Vite - Frontend build tool and dev server
- Replit-specific plugins for development banner and error overlays

**Form Management**:
- React Hook Form - Form state management and validation
- @hookform/resolvers - Integration with Zod validation schemas

**Session Storage**:
- connect-pg-simple - PostgreSQL-backed session store (configured but authentication uses localStorage approach)