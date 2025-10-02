# Omni Core DB Manager

A comprehensive full-stack database management application providing a visual interface for connecting to and managing multiple database types, including SQLite, PostgreSQL, and MySQL.

## 📋 Overview

Omni Core DB Manager is a powerful database administration tool that allows users to browse tables, view and edit data, execute custom queries, and export/import data with ease. The application offers a robust and user-friendly experience for database administration with modern UI and comprehensive features.

## ✄1�7 Features

### Core Functionality
- **Multi-Database Support**: SQLite, PostgreSQL, and MySQL
- **Automatic Database Detection**: Smart detection of database types
- **Connection Management**: Manage multiple database connections simultaneously
- **Table Operations**: Create, rename, drop, and truncate tables
- **Column Management**: Add, modify, and delete columns
- **Row Operations**: Full CRUD (Create, Read, Update, Delete) support
- **Advanced Search & Pagination**: Efficient data browsing
- **Custom SQL Queries**: Execute queries with syntax highlighting
- **Query History**: Track and review past queries
- **Saved Queries**: Save frequently used queries

### Advanced Features
- **Bulk Operations**: Insert, update, and delete multiple rows
- **Data Export/Import**: Support for JSON, CSV, and SQL dump formats
- **Schema Inspection**: Detailed table structure visualization
- **Table Relationships**: View foreign key relationships
- **Index Management**: Create and manage database indexes
- **Constraint Management**: Handle primary keys, foreign keys, unique, and check constraints
- **Table Analysis**: Get detailed statistics and insights
- **Performance Monitoring**: Track slow queries and performance metrics
- **Data Validation**: Define and enforce validation rules
- **Backup & Restore**: Create and restore database backups

### User Interface
- **Dark/Light Theme**: Toggle between modes
- **7 Theme Color Palettes**: Customize your experience
- **Responsive Design**: Works on all devices
- **Modern Animations**: Smooth transitions and effects
- **Glass Morphism Effects**: Beautiful UI design
- **Sound Effects**: Interactive audio feedback

## 🏗︄1�7 Architecture

### Frontend
- **React 18+** with **TypeScript**
- **Vite** for building and development
- **shadcn/ui** components (New York style)
- **Tailwind CSS** for styling
- **TanStack Query** for server state management
- **wouter** for routing
- **react-hook-form** & **Zod** for form handling and validation

### Backend
- **FastAPI** with **Uvicorn**
- **SQLAlchemy** as database abstraction layer
- **Pydantic** for data validation
- Support for **SQLite**, **PostgreSQL**, and **MySQL**
- In-memory connection storage
- RESTful API with OpenAPI/Swagger documentation

## 🚀 Getting Started

### Prerequisites
- **Node.js** 20 or higher
- **Python** 3.11 or higher
- **uv** package manager (for Python)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Alqudimi/OmniCoreDB.git
cd OmniCoreDB
```

2. Install Node.js dependencies:
```bash
npm install
```

3. Install Python dependencies:
```bash
uv sync
```

### Development

Run the development server:
```bash
npm run dev
```

This will start:
- Backend API on `http://localhost:8000`
- Frontend on `http://localhost:5000`

### Production Build

1. Build the frontend:
```bash
npm run build
```

2. Start the production server:
```bash
npm run start
```

The application will be served on port 5000.

## 📚 Documentation

### Arabic Documentation (التوثيق العربي)
Comprehensive documentation is available in the `/docs` folder in Arabic, including:

- **[Main Index](docs/README_AR.md)** - فهرس التوثيق الرئيسي
- **[Installation Guide](docs/installation.md)** - دليل التثبيت
- **[Quick Start](docs/quick-start.md)** - دليل البدء السريع
- **[User Guide](docs/user-guide.md)** - دليل المستخدم
- **[Advanced Features](docs/advanced-features.md)** - الميزات المتقدمة
- **[API Reference](docs/api-reference.md)** - مرجع API
- **[Developer Guide](docs/developer-guide.md)** - دليل المطور
- **[Troubleshooting](docs/troubleshooting.md)** - استكشاف الأخطاء وإصلاحها
- **[FAQ](docs/faq.md)** - الأسئلة الشائعة

## 🛠︄1�7 Tech Stack

**Frontend:**
- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- TanStack Query
- Wouter
- Zod
- React Hook Form

**Backend:**
- FastAPI
- SQLAlchemy
- Pydantic
- Uvicorn
- psycopg2-binary (PostgreSQL)
- mysql-connector-python (MySQL)
- pandas

## 📝 License

All rights reserved to **Alqudimi Technology** © 2024

## 👨‍💄1�7 Author

**Abdulaziz Alqudimi**
- Email: eng7mi@gmail.com, alqudimitechnology@gmail.com
- GitHub: [@Alqudimi](https://github.com/Alqudimi)

## 🔗 Repository

[https://github.com/Alqudimi/OmniCoreDB](https://github.com/Alqudimi/OmniCoreDB)

## 🙏 Acknowledgments

This project leverages modern web technologies and best practices to provide a powerful database management solution.

---

For detailed documentation in Arabic, please refer to the `/docs` directory.
# Database Management Application - Features & Roadmap

## Current Features (Implemented)

### Connection Management
- **Create Database Connections** - Connect to SQLite, PostgreSQL, and MySQL databases
- **Auto-detect Database Type** - Automatically identifies database type from file path or connection string
- **Test Connections** - Verify database connectivity before saving
- **Delete Connections** - Remove database connections and associated data
- **List All Connections** - View all configured database connections

### Table Operations
- **List Tables** - Display all tables with row counts and column counts
- **Create Tables** - Define new tables with columns, types, and constraints
- **Rename Tables** - Change table names
- **Drop Tables** - Delete tables with confirmation
- **Truncate Tables** - Remove all data while keeping table structure
- **Analyze Tables** - Get comprehensive statistics (rows, columns, indexes, foreign keys)

### Column Management
- **View Columns** - Display column metadata including types, nullability, defaults
- **Add Columns** - Add new columns to existing tables
- **Modify Columns** - Change column properties (name, type, nullable, default)
- **Drop Columns** - Remove columns from tables (PostgreSQL/MySQL only)

### Row Operations
- **Browse Rows** - View table data with pagination (20 rows per page)
- **Insert Rows** - Add new records to tables
- **Update Rows** - Edit existing records
- **Delete Rows** - Remove individual records
- **Search Rows** - Filter data across text columns
- **Sort Rows** - Order data by any column (ascending/descending)

### Query Execution
- **Execute Custom SQL** - Run any SQL query
- **Query History** - Track all executed queries with timestamps and execution times
- **Clear Query History** - Remove historical query data
- **Query Timing** - Measure execution time for every query

### Bulk Operations
- **Bulk Insert** - Insert multiple rows in a single operation
- **Bulk Update** - Update multiple rows matching conditions
- **Bulk Delete** - Delete multiple rows by ID list

### Data Import/Export
- **Export to JSON** - Download table data as JSON
- **Export to CSV** - Download table data as CSV
- **Export SQL Dump** - Generate SQL statements for entire database or specific tables
- **Import from JSON** - Load data from JSON files
- **Import from CSV** - Load data from CSV files with error reporting

### Schema Inspection
- **View Indexes** - Display all indexes with columns and types
- **View Foreign Keys** - Show table relationships
- **View Constraints** - Display CHECK, UNIQUE, and FOREIGN KEY constraints
- **Table Relationships** - Visualize foreign key relationships across tables

### Index Management
- **Create Indexes** - Add indexes to improve query performance
- **Drop Indexes** - Remove existing indexes
- **Index Suggestions** - AI-powered recommendations for optimal indexing

### Constraint Management
- **Add Constraints** - Create CHECK, UNIQUE, and FOREIGN KEY constraints
- **Drop Constraints** - Remove existing constraints
- **View All Constraints** - List all table constraints

### Saved Queries �7�8 NEW
- **Save Queries** - Store frequently-used queries with names and descriptions
- **Query Parameters** - Define parameterized queries for reusability
- **Query Tags** - Organize queries with custom tags
- **Favorite Queries** - Mark important queries as favorites
- **Update Queries** - Modify saved query definitions
- **Delete Queries** - Remove saved queries
- **List Saved Queries** - View all saved queries for a connection

### Query Performance Profiling �7�8 NEW
- **EXPLAIN Queries** - View query execution plans
- **ANALYZE Queries** - Get detailed performance analysis with timing
- **PostgreSQL JSON Plans** - Formatted execution plan trees
- **MySQL Performance Warnings** - Detect full table scans
- **SQLite Query Plans** - EXPLAIN QUERY PLAN output
- **Performance Warnings** - Automatic detection of inefficient operations

### Backup & Restore �7�8 NEW
- **Create Backups** - Full database backup in SQL or JSON format
- **Selective Backup** - Backup specific tables only
- **Schema-Only Backup** - Export structure without data
- **Data-Only Backup** - Export data without schema
- **Restore from Backup** - Restore database from SQL or JSON backup
- **Backup Metadata** - Track backup history with sizes and timestamps
- **Download Backups** - Export backup files for offline storage

### Performance Monitoring �7�8 NEW
- **Real-Time Metrics** - Monitor query performance statistics
- **Average Execution Time** - Track mean query duration
- **P95 Latency** - 95th percentile execution time
- **Error Rate** - Track query failure percentage
- **Query Count** - Total queries executed
- **Slow Query Tracking** - Automatic detection of queries >1 second
- **Slow Query Log** - Historical list of performance bottlenecks
- **Performance History** - Time-series metrics data

### Data Validation & Integrity �7�8 NEW
- **Define Validation Rules** - Create data quality checks
- **Required Field Validation** - Check for NULL values
- **Unique Value Validation** - Detect duplicate values
- **Range Validation** - Verify numeric values within bounds
- **Pattern Validation** - Regex matching for text fields
- **Custom SQL Validation** - Define complex validation logic
- **Run Validation Checks** - Execute validations on table data
- **Violation Reports** - Sample failing records with counts
- **Enable/Disable Rules** - Toggle validation rules on/off

### UI Features
- **Dark/Light Theme** - User preference with localStorage persistence
- **Responsive Design** - Works on desktop and mobile devices
- **Resizable Panels** - Adjustable sidebar and content areas
- **Confirmation Dialogs** - Safety checks for destructive operations
- **Toast Notifications** - Real-time feedback for all operations
- **Loading States** - Skeleton screens and spinners
- **Error Messages** - Clear, actionable error reporting

---

## Proposed Future Features

### Phase 2: Advanced Operations

#### Schema Comparison & Synchronization
- **Schema Diff** - Compare schemas between two databases
- **Side-by-Side Diff View** - Visual comparison of table structures
- **Generate Migration Scripts** - Auto-create SQL for schema changes
- **Dry-Run Mode** - Preview changes before applying
- **Rollback Scripts** - Generate reverse migrations
- **Apply Synchronization** - Execute schema changes with safety checks

#### Collaboration & Security
- **User Management** - Create and manage user accounts
- **Role-Based Access Control** - Admin, Editor, Viewer roles
- **Connection Sharing** - Share database connections between users
- **Saved Query Sharing** - Collaborate on queries
- **Dashboard Sharing** - Share visualizations and reports
- **Encrypted Secret Storage** - Secure credential management
- **Audit Logging** - Track all sensitive operations
- **Activity Feed** - Real-time user activity monitoring
- **Read-Only Mode** - Safe exploration without modification risk

#### Enhanced Validation
- **Referential Integrity Scans** - Verify foreign key consistency
- **Data Type Validation** - Check for type mismatches
- **Cross-Table Validation** - Multi-table integrity rules
- **Scheduled Validation** - Automatic periodic checks
- **Validation Reports** - Exportable integrity reports
- **Auto-Fix Suggestions** - Recommendations for fixing violations

### Phase 3: Analytics & Automation

#### Data Visualization
- **Chart Builder** - Create visualizations from query results
- **Dashboard Designer** - Multi-chart dashboard creation
- **Chart Types** - Bar, line, pie, scatter, and area charts
- **Real-Time Charts** - Auto-refreshing visualizations
- **Query-Bound Charts** - Link charts to saved queries
- **Dashboard Caching** - Improved performance for large datasets
- **Export Visualizations** - Download charts as images
- **Shareable Links** - Public/private dashboard URLs

#### Automated Testing
- **Test Suite Builder** - Define database test assertions
- **Assertion Types** - Row counts, value checks, NOT EXISTS tests
- **Run on Demand** - Execute test suites manually
- **Webhook Triggers** - Run tests on external events
- **Test Scheduling** - Periodic automated test runs
- **Test Reports** - Pass/fail logs with details
- **CI/CD Integration** - Export test results for pipelines

#### Advanced Query Features
- **Query Templates** - Reusable query patterns
- **Query Variables** - Dynamic parameter substitution
- **Query Chaining** - Multi-step query workflows
- **Query Scheduling** - Run queries on schedule
- **Result Caching** - Cache expensive query results
- **Query Optimization Hints** - Suggestions for improving queries
- **Visual Query Builder** - No-SQL graphical query interface

#### Backup Scheduling & Management
- **Scheduled Backups** - Automatic daily/weekly backups
- **Backup Retention Policies** - Auto-delete old backups
- **Incremental Backups** - Only backup changes
- **Compressed Backups** - Reduce storage size
- **Remote Backup Storage** - S3/cloud storage integration
- **Backup Verification** - Test backup integrity
- **One-Click Restore** - Simplified restoration process
- **Point-in-Time Recovery** - Restore to specific timestamp

#### Performance Optimization
- **Query Plan Analysis** - Deep dive into execution plans
- **Index Advisor** - ML-powered index recommendations
- **Query Rewriting** - Suggest optimized query alternatives
- **Connection Pooling** - Optimize database connections
- **Query Result Caching** - Cache layer for repeated queries
- **Materialized View Management** - Create and refresh views
- **Partition Management** - Table partitioning tools

#### Data Migration Tools
- **Cross-Database Migration** - Migrate data between database types
- **Schema Mapping** - Map columns between different schemas
- **Data Transformation** - Apply transforms during migration
- **Migration Progress** - Track large data transfers
- **Rollback Support** - Undo migrations
- **Migration Templates** - Reusable migration patterns

---

## API Endpoints Summary

### Current API (53 Endpoints)

**Connections:** 3 endpoints (list, create, delete)
**Tables:** 10 endpoints (list, create, drop, rename, truncate, analyze, structure, relationships)
**Columns:** 3 endpoints (list, add, modify, drop)
**Rows:** 4 endpoints (list, insert, update, delete)
**Queries:** 4 endpoints (execute, history, clear history, explain)
**Bulk Operations:** 3 endpoints (bulk insert, update, delete)
**Import/Export:** 3 endpoints (export table, export SQL, import data)
**Indexes:** 3 endpoints (list, create, drop, suggestions)
**Constraints:** 3 endpoints (list, add, drop)
**Saved Queries:** 5 endpoints (list, create, get, update, delete)
**Backups:** 3 endpoints (create, restore, list)
**Performance:** 2 endpoints (metrics, slow queries)
**Validation:** 3 endpoints (list rules, create rule, delete rule, run validation)

---

## Technology Stack

### Backend
- FastAPI - Modern Python web framework
- SQLAlchemy - Database abstraction layer
- Pydantic - Data validation
- Uvicorn - ASGI server

### Frontend
- React 18 with TypeScript
- Vite - Build tool
- TanStack Query - Server state management
- shadcn/ui - Component library
- Tailwind CSS - Styling

### Supported Databases
- SQLite 3
- PostgreSQL 9.6+
- MySQL 5.7+ / MariaDB 10.2+

---

## Performance Characteristics

- **Query Execution:** <10ms for simple queries, sub-second for complex operations
- **Backup Speed:** ~1MB/s for SQL dumps, ~2MB/s for JSON exports
- **Data Grid:** Pagination handles tables with millions of rows
- **Concurrent Connections:** Supports multiple simultaneous database connections
- **Memory Usage:** Minimal with streaming for large exports
- **API Response Time:** <100ms for most operations

---

## Security Considerations

### Current Security Measures
- CORS enabled for development flexibility
- SQL injection prevention via parameterized queries
- In-memory credential storage (no persistence)
- Connection isolation per user session

### Planned Security Enhancements
- User authentication system
- Role-based access control
- Encrypted secret storage
- Audit trail for all operations
- Read-only mode for viewers
- Session management
- API rate limiting
- CSRF protection

---

Last Updated: October 1, 2025
Version: 2.2.3
