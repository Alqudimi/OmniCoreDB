API - Omni Core DB Manager
==========================

Overview
--------

Omni Core DB Manager provides a full-fledged RESTful API database management interface.

**Base URL**== sync, corrected by elderman == @elder\_man`http://localhost:8000`  
**Interactive documentation**== sync, corrected by elderman == @elder\_man`http://localhost:8000/docs`

Endpoints
---------

### Communications management

#### Access to all communications

```
GET /api/connections
```

**Response**== sync, corrected by elderman == @elder\_man

```
[
  {
    "id": "conn_123",
    "name": "My Database",
    "type": "postgresql",
    "host": "localhost",
    "port": 5432,
    "database": "mydb"
  }
]
```

#### Create new connection

```
POST /api/connections
```

**Request**== sync, corrected by elderman == @elder\_man

```
{
  "name": "PostgreSQL Local",
  "type": "postgresql",
  "host": "localhost",
  "port": 5432,
  "username": "postgres",
  "password": "password",
  "database": "mydb"
}
```

#### Delete connection

```
DELETE /api/connections/{connection_id}
```

### Table management

#### Access to all tables

```
GET /api/connections/{connection_id}/tables
```

**Response**== sync, corrected by elderman == @elder\_man

```
[
  {
    "name": "users",
    "schema": "public",
    "rowCount": 1500
  }
]
```

#### Establishment of a table

```
POST /api/connections/{connection_id}/tables
```

**Request**== sync, corrected by elderman == @elder\_man

```
{
  "tableName": "products",
  "columns": [
    {
      "name": "id",
      "type": "INTEGER",
      "primaryKey": true,
      "autoIncrement": true
    },
    {
      "name": "name",
      "type": "TEXT",
      "notNull": true
    },
    {
      "name": "price",
      "type": "DECIMAL",
      "precision": 10,
      "scale": 2
    }
  ]
}
```

#### Delete Table

```
DELETE /api/connections/{connection_id}/tables/{table_name}
```

#### Rename Table

```
PATCH /api/connections/{connection_id}/tables/{table_name}/rename
```

**Request**== sync, corrected by elderman == @elder\_man

```
{
  "newName": "products_v2"
}
```

### Column management

#### Getting the columns on the table

```
GET /api/connections/{connection_id}/tables/{table_name}/columns
```

**Response**== sync, corrected by elderman == @elder\_man

```
[
  {
    "name": "id",
    "type": "integer",
    "nullable": false,
    "default": null,
    "primaryKey": true
  }
]
```

#### Add Column

```
POST /api/connections/{connection_id}/tables/{table_name}/columns
```

**Request**== sync, corrected by elderman == @elder\_man

```
{
  "name": "description",
  "type": "TEXT",
  "nullable": true,
  "default": null
}
```

#### Modify Column

```
PATCH /api/connections/{connection_id}/tables/{table_name}/columns/{column_name}
```

**Request**== sync, corrected by elderman == @elder\_man

```
{
  "type": "VARCHAR(500)",
  "nullable": false,
  "default": "No description"
}
```

#### Delete Column

```
DELETE /api/connections/{connection_id}/tables/{table_name}/columns/{column_name}
```

### Class management

#### Access to classes

```
GET /api/connections/{connection_id}/tables/{table_name}/rows
  ?limit=50
  &offset=0
  &orderBy=created_at
  &orderDirection=desc
  &search=keyword
```

**Transactions**:`limit`Number of classes (supplementary: 50) -`offset`- Page displacement.`orderBy`Column for order--`orderDirection`== sync, corrected by elderman == @elder\_man`asc`or`desc`- What?`search`Searchword:

**Response**== sync, corrected by elderman == @elder\_man

```
{
  "rows": [
    {
      "id": 1,
      "name": "أحمد",
      "email": "ahmed@example.com"
    }
  ],
  "total": 150
}
```

#### Add row

```
POST /api/connections/{connection_id}/tables/{table_name}/rows
```

**Request**== sync, corrected by elderman == @elder\_man

```
{
  "name": "سارة",
  "email": "sarah@example.com",
  "age": 25
}
```

#### Update row

```
PATCH /api/connections/{connection_id}/tables/{table_name}/rows/{row_id}
```

**Request**== sync, corrected by elderman == @elder\_man

```
{
  "name": "سارة محمد",
  "age": 26
}
```

#### Delete row

```
DELETE /api/connections/{connection_id}/tables/{table_name}/rows/{row_id}
```

### Information

#### Implementation of SQL query

```
POST /api/connections/{connection_id}/query
```

**Request**== sync, corrected by elderman == @elder\_man

```
{
  "query": "SELECT * FROM users WHERE age > 25 LIMIT 10"
}
```

**Response**== sync, corrected by elderman == @elder\_man

```
{
  "columns": ["id", "name", "email", "age"],
  "rows": [
    [1, "أحمد", "ahmed@example.com", 30],
    [2, "سارة", "sarah@example.com", 28]
  ],
  "rowCount": 2,
  "executionTime": 0.025
}
```

#### Explanation of the plan to implement the inquiry

```
POST /api/connections/{connection_id}/query/explain
```

**Request**== sync, corrected by elderman == @elder\_man

```
{
  "query": "SELECT * FROM orders WHERE customer_id = 123",
  "analyze": true
}
```

### Information log

#### Access to the Register

```
GET /api/connections/{connection_id}/query-history?limit=50
```

**Response**== sync, corrected by elderman == @elder\_man

```
[
  {
    "id": "q_123",
    "query": "SELECT * FROM users",
    "executionTime": 0.15,
    "success": true,
    "timestamp": "2024-10-02T10:30:00Z",
    "rowCount": 150
  }
]
```

#### Scanning the register

```
DELETE /api/connections/{connection_id}/query-history
```

### Recorded information

#### Access to archived information

```
GET /api/connections/{connection_id}/saved-queries
```

#### Save Query

```
POST /api/connections/{connection_id}/saved-queries
```

**Request**== sync, corrected by elderman == @elder\_man

```
{
  "name": "Active Users",
  "description": "Get all active users",
  "query": "SELECT * FROM users WHERE status = 'active'"
}
```

#### Deletion of Recorded Query

```
DELETE /api/saved-queries/{query_id}
```

### Group operations

#### Group entry

```
POST /api/connections/{connection_id}/tables/{table_name}/bulk-insert
```

**Request**== sync, corrected by elderman == @elder\_man

```
{
  "rows": [
    {"name": "علي", "age": 30},
    {"name": "فاطمة", "age": 25}
  ]
}
```

#### Group update

```
POST /api/connections/{connection_id}/tables/{table_name}/bulk-update
```

**Request**== sync, corrected by elderman == @elder\_man

```
{
  "where": {"status": "pending"},
  "updates": {"status": "completed"}
}
```

#### Collective deletion

```
POST /api/connections/{connection_id}/tables/{table_name}/bulk-delete
```

**Request**== sync, corrected by elderman == @elder\_man

```
{
  "ids": [1, 2, 3, 4, 5]
}
```

### Export and import

#### Export Table

```
GET /api/connections/{connection_id}/tables/{table_name}/export?format=json
```

**Supported formulas**== sync, corrected by elderman == @elder\_man`json`!`csv`!`sql`

#### Import Data

```
POST /api/connections/{connection_id}/tables/{table_name}/import
```

**Request**== sync, corrected by elderman == @elder\_man

```
{
  "format": "json",
  "data": "[{\"name\":\"أحمد\",\"age\":30}]"
}
```

### The management of the catalogues.

#### Get the catalogs.

```
GET /api/connections/{connection_id}/tables/{table_name}/indexes
```

#### Establishment of an index

```
POST /api/connections/{connection_id}/tables/{table_name}/indexes
```

**Request**== sync, corrected by elderman == @elder\_man

```
{
  "indexName": "idx_user_email",
  "columns": ["email"],
  "unique": true
}
```

#### Delete Index

```
DELETE /api/connections/{connection_id}/tables/{table_name}/indexes/{index_name}
```

#### Index proposals

```
GET /api/connections/{connection_id}/tables/{table_name}/index-suggestions
```

### Restriction management

#### Access to restraints

```
GET /api/connections/{connection_id}/tables/{table_name}/constraints
```

#### Addendum

```
POST /api/connections/{connection_id}/tables/{table_name}/constraints
```

**Request - external key**== sync, corrected by elderman == @elder\_man

```
{
  "constraintType": "FOREIGN_KEY",
  "constraintName": "fk_order_customer",
  "columns": ["customer_id"],
  "referencedTable": "customers",
  "referencedColumns": ["id"]
}
```

**Request - pending examination**== sync, corrected by elderman == @elder\_man

```
{
  "constraintType": "CHECK",
  "constraintName": "check_age",
  "expression": "age >= 18"
}
```

#### Delete entry

```
DELETE /api/connections/{connection_id}/tables/{table_name}/constraints/{constraint_name}
```

### Back-up and recovery

#### Create backup

```
POST /api/connections/{connection_id}/backup
```

**Request**== sync, corrected by elderman == @elder\_man

```
{
  "tables": ["users", "orders"],
  "format": "sql",
  "includeSchema": true,
  "includeData": true
}
```

#### Access to backup list

```
GET /api/connections/{connection_id}/backups
```

#### Restore Backup

```
POST /api/connections/{connection_id}/restore
```

**Request**== sync, corrected by elderman == @elder\_man

```
{
  "backup": "-- SQL backup content here",
  "format": "sql"
}
```

### Performance control

#### Access to performance measures

```
GET /api/connections/{connection_id}/performance/metrics
```

**Response**== sync, corrected by elderman == @elder\_man

```
{
  "totalQueries": 1500,
  "avgResponseTime": 0.125,
  "slowQueries": 15,
  "cacheHitRate": 0.85
}
```

#### Access to slow information

```
GET /api/connections/{connection_id}/performance/slow-queries?limit=50
```

### Analysis of tables

#### Table analysis

```
GET /api/connections/{connection_id}/tables/{table_name}/analyze
```

**Response**== sync, corrected by elderman == @elder\_man

```
{
  "rowCount": 1500,
  "sizeInMB": 15.5,
  "columnStats": {
    "age": {
      "min": 18,
      "max": 65,
      "avg": 35.5,
      "nullCount": 10
    }
  },
  "indexUsage": {
    "idx_email": 0.85,
    "idx_name": 0.45
  }
}
```

### Data validation

#### Access to verification rules

```
GET /api/connections/{connection_id}/validations
```

#### Establishment of a verification base

```
POST /api/connections/{connection_id}/validations
```

**Request**== sync, corrected by elderman == @elder\_man

```
{
  "tableName": "users",
  "columnName": "age",
  "validationType": "range",
  "config": {
    "min": 18,
    "max": 120
  },
  "errorMessage": "العمر يجب أن يكون بين 18 و 120",
  "enabled": true
}
```

#### Operation of verification

```
POST /api/connections/{connection_id}/tables/{table_name}/validate
```

Status codes
------------

| Code | Meaning. | Description |
| --- | --- | --- |
| 200. | Success. | The operation worked. |
| 201 | Created | The resource has been successfully established. |
| 400. | Wrong request. | Error in data sent |
| 404 | It doesn't exist. | The supplier doesn't exist. |
| 500. | Error in the server | An internal error in the server. |

Error messages
--------------

```
{
  "detail": "Table 'users' not found"
}
```

Documentation
-------------

API uses basic validation (if activated):

```
Authorization: Bearer <token>
```

Examples using CURL
-------------------

### Create connection

```
curl -X POST http://localhost:8000/api/connections \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Database",
    "type": "sqlite",
    "database": "test.db"
  }'
```

### Reconnaissance implemented

```
curl -X POST http://localhost:8000/api/connections/conn_123/query \
  -H "Content-Type: application/json" \
  -d '{
    "query": "SELECT * FROM users LIMIT 10"
  }'
```

### Data export

```
curl -X GET "http://localhost:8000/api/connections/conn_123/tables/users/export?format=json" \
  -o users_export.json
```

SDK and libraries
-----------------

### JavaScrip/TypeScrip

```
const api = {
  baseURL: 'http://localhost:8000',

  async getConnections() {
    const res = await fetch(`${this.baseURL}/api/connections`);
    return res.json();
  },

  async executeQuery(connectionId, query) {
    const res = await fetch(
      `${this.baseURL}/api/connections/${connectionId}/query`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      }
    );
    return res.json();
  }
};
```

### Python

```
import requests

class OmniCoreAPI:
    def __init__(self, base_url='http://localhost:8000'):
        self.base_url = base_url

    def get_connections(self):
        return requests.get(f'{self.base_url}/api/connections').json()

    def execute_query(self, connection_id, query):
        return requests.post(
            f'{self.base_url}/api/connections/{connection_id}/query',
            json={'query': query}
        ).json()
```

---

**Developer**:: Abdul Aziz Al-Ogidi  
**E-mail**: ing7mi@gmail.com, alqudemitechnology@gmail.com  
**© 2024 - Old Tech**