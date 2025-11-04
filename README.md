# Omni Core DB Manager

[![Version](https://img.shields.io/badge/Version-2.2.3-blue.svg)](https://github.com/Alqudimi/OmniCoreDB/releases/tag/v2.2.3)
[![Python](https://img.shields.io/badge/Python-3.11+-green.svg)](https://www.python.org/)
[![Node.js](https://img.shields.io/badge/node.js-20+-brightgreen.svg)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-All%20Rights%20Reserved-orange.svg)](LICENSE)
[![Build Status](https://img.shields.io/badge/Build_Status-Passing-success.svg)](https://github.com/Alqudimi/OmniCoreDB/actions)
[![Contributors](https://img.shields.io/github/contributors/Alqudimi/OmniCoreDB)](https://github.com/Alqudimi/OmniCoreDB/graphs/contributors)

A comprehensive and integrated database management application that provides a visual interface for connecting to and managing multiple types of databases with a modern user interface and advanced features.

---

## :sparkles: Overview

**Omni Core DB Manager** is a powerful database management tool that allows users to browse tables, view and edit data, execute custom queries, and easily import/export data. The application provides a robust and user-friendly experience for managing databases across **SQLite**, **PostgreSQL**, and **MySQL** databases.

## :rocket: Key Features

### :electric_plug: Connection Management

*   **Multi-Database Support**: Supports **SQLite**, **PostgreSQL**, and **MySQL**.
*   **Automatic Database Type Detection**: Smart detection from file path or connection string.
*   **Test Connections**: Verify connectivity to the database before saving.
*   **Manage Multiple Connections**: Handle several database connections simultaneously.

### :card_index_dividers: Table Operations

| Feature | Description |
| :--- | :--- |
| **View Tables** | Display all tables with row and column counts. |
| **Create Tables** | Define new tables with columns, types, and constraints. |
| **Rename Tables** | Change the names of existing tables. |
| **Delete Tables** | Drop tables with confirmation. |
| **Truncate Tables** | Remove all data while preserving the table structure. |
| **Analyze Tables** | Get comprehensive statistics (rows, columns, indexes, foreign keys). |

### :file_folder: Column Management

*   **View Columns** | Display column metadata including types, nullability, and default values.
*   **Add Columns** | Add new columns to existing tables.
*   **Modify Columns** | Change column properties (name, type, nullability, default value).
*   **Drop Columns** | Remove columns from tables (for PostgreSQL/MySQL only).

### :pencil: Row Operations

*   **Browse Rows** | View table data with pagination (20 rows per page).
*   **Insert Rows** | Add new records to tables.
*   **Update Rows** | Edit existing records.
*   **Delete Rows** | Remove individual records.
*   **Search Rows** | Filter data across text columns.
*   **Sort Rows** | Order data by any column (ascending/descending).

### :mag: Query Execution

*   **Execute Custom SQL Queries** | Run any SQL query with syntax highlighting.
*   **Query History** | Track all executed queries with timestamps and execution times.
*   **Clear Query History** | Remove historical query data.
*   **Query Timing** | Measure the execution time for each query.

### :zap: Bulk Operations

*   **Bulk Insert** | Insert multiple rows in a single operation.
*   **Bulk Update** | Update multiple rows matching criteria.
*   **Bulk Delete** | Delete multiple rows by a list of IDs.

### :inbox_tray:/:outbox_tray: Data Import/Export

*   **Export to JSON** | Download table data as a JSON file.
*   **Export to CSV** | Download table data as a CSV file.
*   **Export SQL Dump** | Generate SQL statements for the entire database or specific tables.
*   **Import from JSON** | Load data from JSON files.
*   **Import from CSV** | Load data from CSV files with error reporting.

### :wrench: Advanced Features

*   **Schema Inspection** | Visualize the detailed table structure.
*   **Table Relationships** | View foreign key relationships.
*   **Index Management** | Create and manage database indexes.
*   **Constraint Management** | Handle primary keys, foreign keys, unique, and `CHECK` constraints.
*   **Saved Queries** | Save frequently used queries with parameters and tags.
*   **Query Performance Analysis** | Explain and analyze queries with detailed performance breakdown.
*   **Backup and Restore** | Create and restore database backups in SQL or JSON format.
*   **Performance Monitoring** | Track slow queries and real-time performance metrics.
*   **Data Validation** | Define and enforce validation rules for data integrity.

### :art: User Interface

*   **Dark/Light Mode** | Toggle between modes with `localStorage` persistence.
*   **7 Theme Color Palettes** | Customize your experience.
*   **Responsive Design** | Works on all devices.
*   **Modern Animations** | Smooth transitions and effects.
*   **Glassmorphism Effects** | Beautiful interface design.
*   **Sound Effects** | Interactive audio feedback.
*   **Resizable Panels** | Adjustable side and content areas.
*   **Confirmation Dialogs** | Safety checks for destructive operations.
*   **Toast Notifications** | Real-time feedback for all operations.

---

## :building_construction: Architecture

### Frontend Technologies

| Technology | Description |
| :--- | :--- |
| **React 18+** with **TypeScript** | The core library for building the user interface. |
| **Vite** | Fast build tool for development and production. |
| **shadcn/ui** | UI components (New York style). |
| **Tailwind CSS** | Utility-first CSS framework for styling. |
| **TanStack Query** | For server state management and data fetching. |
| **Wouter** | A small and simple routing library. |
| **React Hook Form** & **Zod** | For form handling and data validation. |

### Backend Technologies

| Technology | Description |
| :--- | :--- |
| **FastAPI** with **Uvicorn** | High-performance Python framework for building the API. |
| **SQLAlchemy** | Database abstraction layer. |
| **Pydantic** | For data validation and settings management. |
| **Database Support** | SQLite, PostgreSQL, and MySQL. |
| **Connection Storage** | In-memory connection storage. |
| **API** | RESTful API with OpenAPI/Swagger documentation. |

---

## :gear: Installation and Running

### Prerequisites

Ensure you have the following installed:

*   **Node.js** 20 or later
*   **Python** 3.11 or later
*   **uv package manager** (for Python)

### Quick Start

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Alqudimi/OmniCoreDB.git
    cd OmniCoreDB
    ```

2.  **Install Node.js dependencies:**
    ```bash
    npm install
    ```

3.  **Install Python dependencies:**
    ```bash
    uv sync
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    This will start:
    *   The backend API at `http://localhost:8000`
    *   The frontend at `http://localhost:5000`

### Building the Final Version

1.  **Build the frontend:**
    ```bash
    npm run build
    ```

2.  **Start the production server:**
    ```bash
    npm run start
    ```
    The application will be served on port `5000`.

---

## :books: Documentation

Comprehensive documentation is available in both English and Arabic.

### English Documentation

*   [Main Guide](docs/en/main-guide.md) - Complete overview and getting started
*   [Installation Guide](docs/en/installation-guide.md) - Detailed installation instructions
*   [User Guide](docs/en/user-guide.md) - Comprehensive user manual
*   [API Reference](docs/en/api-reference.md) - Full API documentation
*   [Developer Guide](docs/en/developer-guide.md) - Guide for development and contribution

### Arabic Documentation

*   [الدليل الرئيسي](docs/ar/main-guide.md) - نظرة عامة ودليل البدء
*   [دليل التثبيت](docs/ar/installation-guide.md) - تعليمات التثبيت التفصيلية
*   [دليل المستخدم](docs/ar/user-guide.md) - دليل المستخدم الشامل
*   [مرجع API](docs/ar/api-reference.md) - وثائق API الكاملة
*   [دليل المطور](docs/ar/developer-guide.md) - دليل التطوير والمساهمة

---

## :map: Roadmap

### :white_check_mark: Implemented Features (Current Version 2.2.3)

*   Full CRUD operations for tables, columns, and rows.
*   Multi-database support with automatic detection.
*   Advanced query execution with analysis.
*   Bulk operations and data import/export.
*   Backup and restore functionalities.
*   Performance monitoring and data validation.
*   Modern, responsive UI with themes.

### :arrows_counterclockwise: Phase 2: Advanced Operations (In Development)

*   Schema comparison and synchronization.
*   User management and role-based access control (RBAC).
*   Validation enhancements and sanity checks.
*   Collaboration features and connection sharing.

### :chart_with_upwards_trend: Phase 3: Analytics and Automation (Planned)

*   Data visualization and dashboard builder.
*   Automated testing and CI/CD integration.
*   Advanced query features and optimization.
*   Backup scheduling and management.
*   Data migration tools between databases.

---

## :globe_with_meridians: API Overview

The application provides **53 RESTful API endpoints** covering:

| Module | Number of Endpoints | Key Operations |
| :--- | :--- | :--- |
| Connections | 3 | View, Create, Delete |
| Tables | 10 | CRUD, Analysis, Relationships |
| Columns | 3 | View, Add, Modify, Drop |
| Rows | 4 | View, Insert, Update, Delete |
| Queries | 4 | Execute, History, Explain |
| Bulk Operations | 3 | Bulk Insert, Update, Delete |
| Import/Export | 3 | Export Table, Export SQL, Import Data |
| Indexes & Constraints | 6 | Management Operations |
| Saved Queries | 5 | CRUD Operations |
| Backups & Performance | 8 | Monitoring and Management |
| Validation | 3 | Rule Management and Execution |

---

## :shield: Security

### Current Security Measures

*   CORS enabled for development flexibility.
*   SQL injection prevention via parameterized queries.
*   In-memory credential storage (no persistence).
*   Connection isolation per user session.

### Planned Security Enhancements

*   User authentication system.
*   Role-based access control (RBAC).
*   Encrypted secret storage.
*   Audit log for all operations.
*   Session management and API rate limiting.

---

## :bar_chart: Performance

| Metric | Details |
| :--- | :--- |
| **Query Execution** | <10ms for simple queries, <1s for complex operations. |
| **Backup Speed** | ~1MB/s for SQL dump, ~2MB/s for JSON export. |
| **Data Grid** | Pagination handles tables with millions of rows. |
| **Concurrent Connections** | Supports multiple simultaneous database connections. |
| **Memory Usage** | Minimal with streaming for large exports. |
| **API Response Time** | <100ms for most operations. |

---

## :handshake: Contributing

Contributions are welcome! Please see the [Developer Guide](docs/en/developer-guide.md) for details on:

*   Setting up the development environment.
*   Code style and conventions.
*   Submitting pull requests.
*   Reporting issues.

---

## :page_facing_up: License

All Rights Reserved to Alqudimi Technology &copy; 2024

---

## :man_technologist: Author

**Abdulaziz Alqudimi**

*   :email: Email: `eng7mi@gmail.com`, `alqudimitechnology@gmail.com`
*   :octocat: GitHub: [@Alqudimi](https://github.com/Alqudimi)

---

## :package: Repository

[https://github.com/Alqudimi/OmniCoreDB](https://github.com/Alqudimi/OmniCoreDB)

---

## :pray: Acknowledgements

This project leverages modern web technologies and best practices to provide a robust database management solution. Special thanks to the open-source community for the amazing tools and libraries that made this project possible.
