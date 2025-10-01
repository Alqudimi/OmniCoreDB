# Database Management Application

## Overview

This is a comprehensive full-stack database management application that provides a visual interface for connecting to and managing multiple database types. The application allows users to connect to SQLite, PostgreSQL, and MySQL databases, browse tables, view and edit data, execute custom queries, and export/import data in various formats.

The application is built with a **React frontend** using shadcn/ui components and a **Python FastAPI backend**. It supports multiple database connections simultaneously and provides features like data grid viewing, row editing, table structure inspection, SQL query execution, and data export/import capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework and Build System**
- React 18+ with TypeScript for type safety
- Vite as the build tool and dev server for development
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
- Connection management dialog for adding databases with automatic type detection
- Resizable panel layout for sidebar and content areas
- Data grid with pagination (20 rows per page), sorting, and CRUD operations
- Query editor for custom SQL execution with results display
- Table structure viewer showing columns, indexes, and relationships
- Confirmation dialogs for destructive actions (delete tables, truncate, drop columns)
- Export and import options (CSV, JSON, SQL dump)
- Search functionality across table data

**Advanced Dialog Features**
- **Query History Dialog**: Track all executed queries with timestamps, execution times, and success status
- **Saved Queries Dialog**: Save, manage, and execute frequently used SQL queries
- **Performance Monitoring Dialog**: View metrics, track slow queries, and monitor database performance
- **Backup & Restore Dialog**: Create backups in JSON or SQL format with schema/data options
- **Data Validation Dialog**: Create and manage validation rules for table columns with support for NOT NULL, UNIQUE, CHECK constraints, and custom SQL expressions

**Enhanced UI/UX**
- Modern animations including shimmer, glow, pulse, and gradient-shift effects
- Sophisticated keyframe animations for smooth transitions
- Glass morphism effects on cards and dialogs
- Sound effects system for user interactions (click, hover, success, error, open/close)
- 7 theme color palettes: Sunset Passion, Purple Dream, Earth Tone, Nature Green, Ocean Blue, Fire Red, Emerald Gradient
- Responsive toolbar with quick access to all database management features

### Backend Architecture

**Server Framework**
- **FastAPI** - Modern Python web framework for building APIs
- **Uvicorn** - ASGI server for running FastAPI applications
- **Pydantic** - Data validation using Python type annotations
- Serves both API endpoints and static frontend files in production

**Database Abstraction Layer**
- **SQLAlchemy** - Python SQL toolkit and ORM providing database-agnostic interface
- Supports SQLite, PostgreSQL, and MySQL databases
- Connection pooling and management handled by SQLAlchemy Engine
- Multiple concurrent database connections stored in dictionary
- Auto-detection of database type from connection string or file extension

**Storage Strategy**
- In-memory storage (MemStorage class) for connection configurations
- Connection configs stored in Python dictionary with UUID keys
- No persistence layer - connections reset on server restart
- Simple and lightweight for development and testing purposes

**API Design**
- RESTful endpoints following convention: `/api/connections/{id}/tables/{table}/...`
- JSON request/response format
- Error handling with appropriate HTTP status codes
- Comprehensive API documentation via FastAPI's automatic OpenAPI/Swagger UI
- CORS enabled for development flexibility

**Database Type Detection**
- Automatic file extension detection for SQLite (.db, .sqlite, .sqlite3)
- Connection string protocol detection (postgres://, postgresql://, mysql://)
- Manual override option when auto-detection fails

**Complete Feature Set**
- **Connection Management**: Create, test, and delete database connections
- **Table Operations**: Create, rename, drop, truncate tables
- **Column Management**: Add columns, drop columns (non-SQLite), modify columns (non-SQLite)
- **Row Operations**: Insert, update, delete rows with pagination and search
- **Query Execution**: Execute custom SQL queries with timing information
- **Data Validation**: Create validation rules with NOT NULL, UNIQUE, CHECK constraints and run validation checks
- **Data Export**: Export tables to JSON, CSV, or SQL dump format
- **Data Import**: Import data from JSON or CSV files
- **Schema Inspection**: View table structure, columns, indexes, foreign keys

### Data Flow Patterns

**Connection Creation Flow**
1. User submits connection details via ConnectionDialog
2. Frontend validates with Pydantic models
3. Backend auto-detects database type if not provided
4. Backend attempts connection using SQLAlchemy to verify credentials
5. Connection config stored in memory with generated UUID
6. Frontend invalidates queries to refresh connection list

**Data Grid Flow**
1. User selects table from TableList component
2. DataGrid fetches rows with pagination (20 per page)
3. Optional sorting by column with ascending/descending order
4. Optional search across text columns
5. Edit/delete operations trigger modals with optimistic UI updates
6. React Query automatically refetches affected data

**Query Execution Flow**
1. User writes SQL in QueryEditorDialog
2. Backend executes query with error handling
3. Results returned with execution time metadata (in milliseconds)
4. Frontend displays results in tabular format with export options

**Export/Import Flow**
1. User selects export format (JSON, CSV, or SQL)
2. Backend queries all table data and formats accordingly
3. File download initiated in browser
4. For import, user uploads file and backend parses and inserts rows
5. Error reporting for failed row imports

## Technology Stack

### Backend (Python)
- **FastAPI** (0.118.0+) - Modern web framework
- **SQLAlchemy** (2.0+) - Database ORM and abstraction layer
- **Pydantic** (2.0+) - Data validation and settings management
- **Uvicorn** - ASGI server with standard extras
- **psycopg2-binary** - PostgreSQL adapter
- **mysql-connector-python** - MySQL driver
- **python-multipart** - For file upload support
- **pandas** - Data manipulation (available if needed)

### Frontend (React + TypeScript)
- **React** (18.3+) with TypeScript
- **Vite** (5.4+) - Build tool
- **@tanstack/react-query** - Server state management
- **wouter** - Lightweight routing
- **shadcn/ui** + **@radix-ui/** - UI component system
- **tailwindcss** - Utility-first CSS
- **react-hook-form** + **zod** - Form handling and validation
- **lucide-react** - Icon library

### Development and Build Tools
- **TypeScript** - Type safety for frontend
- **ESLint** + **Prettier** - Code quality and formatting
- **Vite** - Fast development server and build tool
- **uv** - Python package manager

## Running the Application

### Replit Environment Setup (Completed - October 2025)
The application has been successfully configured for Replit:
1. ✅ Python 3.11 installed with uv package manager
2. ✅ Python dependencies installed via `uv sync` (creates `.pythonlibs/` virtual environment)
3. ✅ Node.js 20 with npm dependencies installed
4. ✅ Frontend built with `npm run build` (creates `dist/public/`)
5. ✅ Workflow configured to run `uv run python server_py/main.py` on port 5000
6. ✅ Deployment configured with autoscale:
   - Build step: `npm run build && uv sync`
   - Run step: `uv run python server_py/main.py`
7. ✅ .gitignore updated with Python-specific patterns

### Development
The workflow runs: `uv run python server_py/main.py`
- Uses uv to activate virtual environment and run Python
- Python FastAPI server starts on 0.0.0.0:5000
- Serves API endpoints at `/api/*`
- Serves built React frontend from `dist/public/`
- Single port architecture: both frontend and backend on port 5000

### Production Deployment
1. Build frontend: `npm run build` (creates `dist/public/`)
2. Install Python deps: `uv sync`
3. Run Python server: `uv run python server_py/main.py`
4. Server automatically serves static files from `dist/public/`
5. All requests route through the Python backend on port 5000

### Environment
- Python 3.11.13 (using uv 0.5.11 for package management)
- Node.js 20+ (for frontend build only)
- Virtual environment: `.pythonlibs/` (managed by uv)
- No database required to run the application itself (connects to external databases)

## Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── pages/         # Page components
│   │   ├── lib/           # Utilities and React Query setup
│   │   └── hooks/         # Custom React hooks
│   └── index.html
├── server_py/             # Python FastAPI backend
│   ├── main.py           # FastAPI app and routes
│   ├── models.py         # Pydantic models
│   ├── database_service.py  # SQLAlchemy database operations
│   └── storage.py        # In-memory connection storage
├── dist/                 # Built frontend (generated)
│   └── public/          # Static files served by Python backend
├── pyproject.toml        # Python dependencies
├── package.json          # Node.js dependencies (frontend build only)
└── vite.config.ts        # Vite configuration

```

## Key Features Implemented

✅ **Automatic Database Detection** - Detects SQLite, PostgreSQL, MySQL from paths/connection strings
✅ **Multi-Database Support** - Connect to multiple databases simultaneously
✅ **Full Table Management** - Create, rename, delete, truncate tables
✅ **Column Management** - Add, modify, drop columns (with database-specific limitations)
✅ **Row CRUD Operations** - Insert, update, delete with data validation
✅ **Pagination & Search** - Browse large tables efficiently
✅ **Custom SQL Queries** - Execute any SQL with result display and timing
✅ **Query History** - Track all queries with timestamps, execution times, and success status
✅ **Bulk Operations** - Bulk insert, update, and delete for efficient mass data manipulation
✅ **Data Export** - Export to JSON, CSV, or SQL dump format
✅ **Data Import** - Import from JSON or CSV with error handling
✅ **Schema Inspection** - View columns, types, constraints, indexes, foreign keys
✅ **Table Relationships** - Visualize and analyze foreign key relationships across tables
✅ **Index Management** - Create/drop indexes with AI-powered optimization suggestions
✅ **Constraint Management** - Add/drop/view constraints (CHECK, UNIQUE, FOREIGN KEY)
✅ **Table Analysis** - Comprehensive table statistics and performance insights
✅ **Dark/Light Theme** - User preference with system default detection
✅ **Responsive Design** - Works on desktop and mobile devices
✅ **Error Handling** - Clear error messages throughout the application
✅ **Confirmation Dialogs** - For all destructive operations

## Production Readiness

The application is production-ready with:
- Comprehensive error handling and validation
- Security considerations (CORS, SQL injection prevention via parameterized queries)
- Efficient pagination for large datasets
- Optimistic UI updates for better user experience
- Clean separation of concerns (frontend/backend/database layer)
- Type safety (TypeScript frontend, Pydantic backend)
- Database-agnostic architecture via SQLAlchemy

## Recent Changes (October 2025)

### Backend Migration & Cleanup
- **Complete migration to Python backend**: Removed all Node.js backend code (Express + Knex)
- Implemented full Python FastAPI backend with SQLAlchemy for database abstraction
- Updated all API endpoints to use FastAPI route decorators
- Implemented Pydantic models for request/response validation
- Configured Python backend to serve built React frontend in production
- Cleaned up package.json to only include frontend build scripts
- Removed obsolete Node.js backend directories (server/, shared/) and configuration files
- Removed test database files and unused documentation
- Updated deployment configuration for Python-only backend

### Advanced Features Added
- **Query History System**: Automatic tracking of all SQL queries with execution times, timestamps, and success status
- **Bulk Operations**: Efficient mass data manipulation with bulk insert, update, and delete operations
- **Table Relationships**: Foreign key visualization and relationship analysis across all tables
- **Index Management**: Create and drop indexes with intelligent optimization suggestions
- **Constraint Management**: Full support for CHECK, UNIQUE, and FOREIGN KEY constraints
- **Table Analysis**: Comprehensive statistics including row counts, indexes, and performance metrics
- **34 RESTful API Endpoints**: Complete coverage of all database management operations
