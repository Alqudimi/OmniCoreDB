# Database Management Application

## Overview

This is a full-stack database management application that provides a visual interface for connecting to and managing multiple database types. The application allows users to connect to SQLite, PostgreSQL, MySQL, and MongoDB databases, browse tables, view and edit data, execute custom queries, and export data in various formats.

The application is built with a React frontend using shadcn/ui components and an Express backend with TypeScript. It supports multiple database connections simultaneously and provides features like data grid viewing, row editing, table structure inspection, and SQL query execution.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework and Build System**
- React 18+ with TypeScript for type safety
- Vite as the build tool and dev server
- Wouter for lightweight client-side routing
- TanStack Query (React Query) for server state management with infinite stale time to prevent unnecessary refetches

**UI Component System**
- shadcn/ui component library (New York style variant)
- Radix UI primitives for accessible, unstyled components
- Tailwind CSS for styling with CSS variables for theming
- Dark/light theme support via ThemeProvider with localStorage persistence
- Responsive design with mobile breakpoint detection

**State Management Strategy**
- React Query for all server state (connections, tables, data)
- Local React state (useState) for UI-specific state (dialogs, selected items)
- Context API for theme management
- No global state management library needed due to React Query handling server state

**Key UI Features**
- Connection management dialog for adding databases
- Resizable panel layout for sidebar and content areas
- Data grid with pagination, sorting, and CRUD operations
- Query editor for custom SQL execution
- Table structure viewer showing columns, indexes, and relationships

### Backend Architecture

**Server Framework**
- Express.js with TypeScript for type-safe API endpoints
- ESM (ES Modules) throughout the codebase
- Custom Vite middleware integration for development

**Database Abstraction Layer**
- Knex.js as the SQL query builder providing database-agnostic interface
- Support for multiple concurrent database connections stored in Map
- Auto-detection of database type from connection string or file extension
- Database service handles connection pooling and query execution

**Storage Strategy**
- In-memory storage (MemStorage class) for connection configurations
- Connection configs stored in Map with UUID keys
- No persistence layer - connections reset on server restart
- Designed to be replaceable with persistent storage (could use Drizzle ORM with PostgreSQL)

**API Design**
- RESTful endpoints following convention: `/api/connections/{id}/tables/{table}/...`
- JSON request/response format
- Error handling with appropriate HTTP status codes
- Request logging middleware for API calls only (excludes static assets)

**Database Type Detection**
- File extension detection for SQLite (.db, .sqlite, .sqlite3)
- Connection string protocol detection (postgres://, mysql://, sqlite://)
- Manual override option when auto-detection fails

### Data Flow Patterns

**Connection Creation Flow**
1. User submits connection details via ConnectionDialog
2. Frontend validates with Zod schema (insertConnectionConfigSchema)
3. Backend auto-detects database type if not provided
4. Backend attempts connection to verify credentials
5. Connection config stored in memory with generated UUID
6. Frontend invalidates queries to refresh connection list

**Data Grid Flow**
1. User selects table from TableList component
2. DataGrid fetches rows with pagination (20 per page)
3. Optional sorting by column with ascending/descending order
4. Edit/delete operations trigger modals with optimistic UI updates
5. React Query automatically refetches affected data

**Query Execution Flow**
1. User writes SQL in QueryEditorDialog
2. Backend executes query with error handling
3. Results returned with execution time metadata
4. Frontend displays results in tabular format with export options

## External Dependencies

### Database Drivers and ORMs
- **@neondatabase/serverless**: Neon PostgreSQL serverless driver
- **knex**: SQL query builder for database abstraction
- **sqlite3**: SQLite database driver
- **drizzle-orm & drizzle-kit**: ORM and migration tools (configured but not actively used in current implementation)

### UI Component Libraries
- **@radix-ui/***: 20+ primitive component packages for accessible UI
- **shadcn/ui**: Pre-built component system using Radix UI
- **cmdk**: Command menu component
- **embla-carousel-react**: Carousel/slider functionality
- **lucide-react**: Icon library

### Form and Validation
- **react-hook-form**: Form state management
- **@hookform/resolvers**: Validation resolver for react-hook-form
- **zod**: TypeScript-first schema validation
- **drizzle-zod**: Generate Zod schemas from Drizzle schemas

### Styling and Theming
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: CSS variant management
- **clsx & tailwind-merge**: Utility class merging

### Development Tools
- **vite**: Build tool and dev server
- **@vitejs/plugin-react**: React plugin for Vite
- **@replit/vite-plugin-***: Replit-specific dev tooling (error overlay, cartographer, dev banner)
- **tsx**: TypeScript execution for Node.js
- **esbuild**: Fast JavaScript bundler for production builds

### Routing and State
- **wouter**: Lightweight routing library (2KB alternative to React Router)
- **@tanstack/react-query**: Server state management and caching

### Session Management
- **express-session**: Session middleware (configured in dependencies)
- **connect-pg-simple**: PostgreSQL session store

### Utility Libraries
- **date-fns**: Date manipulation and formatting
- **nanoid**: Unique ID generation

### Build Configuration
- TypeScript with strict mode enabled
- Module resolution set to "bundler" for modern import patterns
- Path aliases configured: `@/*` for client, `@shared/*` for shared code
- Separate build processes for client (Vite) and server (esbuild)