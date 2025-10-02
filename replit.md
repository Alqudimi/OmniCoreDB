# Database Management Application

## Overview
This is a comprehensive full-stack database management application providing a visual interface for connecting to and managing multiple database types, including SQLite, PostgreSQL, and MySQL. It allows users to browse tables, view and edit data, execute custom queries, and export/import data. The application aims to offer a robust and user-friendly experience for database administration.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The frontend is built with **React 18+ and TypeScript**, utilizing **Vite** for building and development. It uses **shadcn/ui** components (New York style) with **Tailwind CSS** for styling, supporting dark/light themes and responsive design. **TanStack Query** manages server state, while local React state handles UI specifics. Key UI features include a resizable panel layout, a data grid with pagination and CRUD, a query editor, table structure viewer, and confirmation dialogs. Advanced features include a Query History Dialog, Saved Queries Dialog, Performance Monitoring Dialog, Backup & Restore Dialog, and Data Validation Dialog. The UI/UX is enhanced with modern animations, glass morphism effects, sound effects, and 7 theme color palettes.

### Backend Architecture
The backend is powered by **FastAPI** with **Uvicorn** and **Pydantic** for data validation. It uses **SQLAlchemy** as a database abstraction layer, supporting SQLite, PostgreSQL, and MySQL, and managing multiple concurrent connections. Connection configurations are stored in-memory, resetting on server restart. The API is RESTful, uses JSON, and includes comprehensive OpenAPI/Swagger UI documentation. Key features include connection management, full table operations (create, rename, drop, truncate), column management, row operations (insert, update, delete), custom query execution, data validation, export/import (JSON, CSV, SQL dump), and schema inspection.

### Data Flow Patterns
The application follows clear data flow patterns for connection creation, data grid interactions, query execution, and export/import operations, ensuring efficient and predictable data handling.

### Complete Feature Set
The application offers robust features including automatic database detection, multi-database support, full table and column management, row CRUD operations, pagination & search, custom SQL queries with history, bulk operations, data export/import, schema inspection, table relationships, index management, constraint management, table analysis, dark/light theme, responsive design, error handling, and confirmation dialogs.

## External Dependencies

### Backend (Python)
- **FastAPI**: Modern web framework
- **SQLAlchemy**: Database ORM and abstraction layer
- **Pydantic**: Data validation and settings management
- **Uvicorn**: ASGI server
- **psycopg2-binary**: PostgreSQL adapter
- **mysql-connector-python**: MySQL driver
- **python-multipart**: For file upload support
- **uv**: Python package manager

### Frontend (React + TypeScript)
- **React**: JavaScript library for building user interfaces
- **Vite**: Build tool
- **@tanstack/react-query**: Server state management
- **wouter**: Lightweight routing
- **shadcn/ui**: UI component system
- **@radix-ui/**: UI primitives
- **tailwindcss**: Utility-first CSS
- **react-hook-form**: Form handling
- **zod**: Validation library
- **lucide-react**: Icon library