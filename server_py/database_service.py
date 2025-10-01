from sqlalchemy import create_engine, text, inspect, MetaData, Table, Column, Integer, String, Text, Boolean, Numeric, DateTime, JSON
from sqlalchemy.engine import Engine
from typing import Dict, List, Optional, Any, Tuple
from models import TableMetadata, ColumnMetadata, IndexMetadata, QueryResult, ConnectionConfig
import time
import os
import json
import csv
import io


class DatabaseService:
    """Service for managing multiple database connections and operations"""
    
    def __init__(self):
        self.connections: Dict[str, Engine] = {}
    
    def detect_database_type(self, config: Dict[str, Any]) -> Optional[str]:
        """Auto-detect database type from file path or connection string"""
        if config.get("filePath"):
            file_path = config["filePath"]
            ext = os.path.splitext(file_path)[1].lower()
            if ext in ['.db', '.sqlite', '.sqlite3']:
                return 'sqlite'
        
        if config.get("connectionString"):
            conn_str = config["connectionString"].lower()
            if conn_str.startswith('postgres://') or conn_str.startswith('postgresql://'):
                return 'postgresql'
            if conn_str.startswith('mysql://'):
                return 'mysql'
            if 'sqlite' in conn_str or '.db' in conn_str:
                return 'sqlite'
        
        return None
    
    def connect(self, config: ConnectionConfig) -> None:
        """Create a database connection"""
        if config.type == 'sqlite':
            db_path = config.filePath or config.connectionString.replace('sqlite://', '') if config.connectionString else ':memory:'
            connection_url = f"sqlite:///{db_path}"
        elif config.type == 'postgresql':
            if config.connectionString:
                connection_url = config.connectionString
            else:
                connection_url = f"postgresql://{config.username}:{config.password}@{config.host or 'localhost'}:{config.port or 5432}/{config.database}"
        elif config.type == 'mysql':
            if config.connectionString:
                connection_url = config.connectionString
            else:
                connection_url = f"mysql+mysqlconnector://{config.username}:{config.password}@{config.host or 'localhost'}:{config.port or 3306}/{config.database}"
        else:
            raise ValueError(f"Unsupported database type: {config.type}")
        
        engine = create_engine(connection_url)
        # Test connection
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        
        self.connections[config.id] = engine
    
    def get_connection(self, connection_id: str) -> Engine:
        """Get a database connection"""
        if connection_id not in self.connections:
            raise ValueError("Connection not found")
        return self.connections[connection_id]
    
    def disconnect(self, connection_id: str) -> None:
        """Close a database connection"""
        if connection_id in self.connections:
            self.connections[connection_id].dispose()
            del self.connections[connection_id]
    
    def get_tables(self, connection_id: str) -> List[TableMetadata]:
        """Get all tables in the database"""
        engine = self.get_connection(connection_id)
        inspector = inspect(engine)
        tables = []
        
        for table_name in inspector.get_table_names():
            with engine.connect() as conn:
                result = conn.execute(text(f"SELECT COUNT(*) FROM {table_name}"))
                count = result.scalar()
            
            columns = inspector.get_columns(table_name)
            
            tables.append(TableMetadata(
                name=table_name,
                rowCount=count,
                columnCount=len(columns)
            ))
        
        return tables
    
    def get_columns(self, connection_id: str, table_name: str) -> List[ColumnMetadata]:
        """Get columns for a table"""
        engine = self.get_connection(connection_id)
        inspector = inspect(engine)
        columns_data = inspector.get_columns(table_name)
        pk_constraint = inspector.get_pk_constraint(table_name)
        fk_constraints = inspector.get_foreign_keys(table_name)
        indexes = inspector.get_indexes(table_name)
        
        # Create foreign key map
        fk_map = {}
        for fk in fk_constraints:
            for col, ref_col in zip(fk['constrained_columns'], fk['referred_columns']):
                fk_map[col] = {
                    "table": fk['referred_table'],
                    "column": ref_col
                }
        
        # Create index map
        indexed_columns = set()
        for idx in indexes:
            indexed_columns.update(idx['column_names'])
        
        primary_keys = set(pk_constraint.get('constrained_columns', []))
        
        columns = []
        for col in columns_data:
            is_pk = col['name'] in primary_keys
            
            columns.append(ColumnMetadata(
                name=col['name'],
                type=str(col['type']),
                nullable=col['nullable'],
                primaryKey=is_pk,
                autoIncrement=col.get('autoincrement', False) if is_pk else False,
                foreignKey=fk_map.get(col['name']),
                defaultValue=col.get('default'),
                indexed=col['name'] in indexed_columns
            ))
        
        return columns
    
    def get_indexes(self, connection_id: str, table_name: str) -> List[IndexMetadata]:
        """Get indexes for a table"""
        engine = self.get_connection(connection_id)
        inspector = inspect(engine)
        indexes_data = inspector.get_indexes(table_name)
        pk_constraint = inspector.get_pk_constraint(table_name)
        
        indexes = []
        
        # Add primary key as an index
        if pk_constraint and pk_constraint.get('constrained_columns'):
            indexes.append(IndexMetadata(
                name=pk_constraint.get('name', 'PRIMARY'),
                columns=pk_constraint['constrained_columns'],
                type="PRIMARY"
            ))
        
        # Add other indexes
        for idx in indexes_data:
            index_type = "UNIQUE" if idx.get('unique') else "INDEX"
            indexes.append(IndexMetadata(
                name=idx['name'],
                columns=idx['column_names'],
                type=index_type
            ))
        
        return indexes
    
    def get_rows(
        self,
        connection_id: str,
        table_name: str,
        limit: Optional[int] = None,
        offset: Optional[int] = None,
        order_by: Optional[str] = None,
        order_direction: str = 'asc',
        search: Optional[str] = None
    ) -> Tuple[List[Dict[str, Any]], int]:
        """Get rows from a table with pagination and filtering"""
        engine = self.get_connection(connection_id)
        
        # Build query
        base_query = f"SELECT * FROM {table_name}"
        count_query = f"SELECT COUNT(*) FROM {table_name}"
        
        where_clause = ""
        if search:
            columns = self.get_columns(connection_id, table_name)
            text_columns = [col.name for col in columns if 'text' in col.type.lower() or 'varchar' in col.type.lower() or 'char' in col.type.lower()]
            if text_columns:
                conditions = [f"{col} LIKE :search" for col in text_columns]
                where_clause = f" WHERE {' OR '.join(conditions)}"
        
        base_query += where_clause
        count_query += where_clause
        
        if order_by:
            base_query += f" ORDER BY {order_by} {order_direction.upper()}"
        
        if limit:
            base_query += f" LIMIT {limit}"
        
        if offset:
            base_query += f" OFFSET {offset}"
        
        with engine.connect() as conn:
            # Get total count
            if search:
                count_result = conn.execute(text(count_query), {"search": f"%{search}%"})
            else:
                count_result = conn.execute(text(count_query))
            total = count_result.scalar()
            
            # Get rows
            if search:
                result = conn.execute(text(base_query), {"search": f"%{search}%"})
            else:
                result = conn.execute(text(base_query))
            
            rows = [dict(row._mapping) for row in result]
        
        return rows, total
    
    def insert_row(self, connection_id: str, table_name: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """Insert a new row"""
        engine = self.get_connection(connection_id)
        
        columns = ", ".join(data.keys())
        placeholders = ", ".join([f":{key}" for key in data.keys()])
        query = f"INSERT INTO {table_name} ({columns}) VALUES ({placeholders})"
        
        with engine.connect() as conn:
            result = conn.execute(text(query), data)
            conn.commit()
            
            # Get the inserted row
            if engine.dialect.name == 'sqlite':
                row_id = result.lastrowid
            else:
                row_id = result.inserted_primary_key[0] if hasattr(result, 'inserted_primary_key') else None
            
            if row_id:
                pk_col = self._get_primary_key_column(connection_id, table_name)
                select_query = f"SELECT * FROM {table_name} WHERE {pk_col} = :id"
                result = conn.execute(text(select_query), {"id": row_id})
                return dict(result.first()._mapping)
        
        return data
    
    def update_row(self, connection_id: str, table_name: str, row_id: Any, data: Dict[str, Any]) -> Dict[str, Any]:
        """Update a row"""
        engine = self.get_connection(connection_id)
        pk_col = self._get_primary_key_column(connection_id, table_name)
        
        set_clause = ", ".join([f"{key} = :{key}" for key in data.keys()])
        query = f"UPDATE {table_name} SET {set_clause} WHERE {pk_col} = :row_id"
        
        with engine.connect() as conn:
            conn.execute(text(query), {**data, "row_id": row_id})
            conn.commit()
            
            # Get the updated row
            select_query = f"SELECT * FROM {table_name} WHERE {pk_col} = :row_id"
            result = conn.execute(text(select_query), {"row_id": row_id})
            return dict(result.first()._mapping)
    
    def delete_row(self, connection_id: str, table_name: str, row_id: Any) -> None:
        """Delete a row"""
        engine = self.get_connection(connection_id)
        pk_col = self._get_primary_key_column(connection_id, table_name)
        
        query = f"DELETE FROM {table_name} WHERE {pk_col} = :row_id"
        
        with engine.connect() as conn:
            conn.execute(text(query), {"row_id": row_id})
            conn.commit()
    
    def execute_query(self, connection_id: str, query: str) -> QueryResult:
        """Execute a custom SQL query"""
        engine = self.get_connection(connection_id)
        start_time = time.time()
        
        with engine.connect() as conn:
            result = conn.execute(text(query))
            
            # Handle different query types
            if result.returns_rows:
                rows = [dict(row._mapping) for row in result]
                columns = list(rows[0].keys()) if rows else []
            else:
                conn.commit()
                rows = []
                columns = []
            
            execution_time = (time.time() - start_time) * 1000  # Convert to ms
        
        return QueryResult(
            columns=columns,
            rows=rows,
            rowCount=len(rows),
            executionTime=execution_time
        )
    
    def create_table(self, connection_id: str, table_name: str, columns: List[Dict[str, Any]]) -> None:
        """Create a new table"""
        engine = self.get_connection(connection_id)
        
        col_defs = []
        for col in columns:
            col_type = col['type'].upper()
            col_def = f"{col['name']} {col_type}"
            
            if col.get('primaryKey'):
                col_def += " PRIMARY KEY"
                if engine.dialect.name == 'sqlite' and 'INT' in col_type:
                    col_def += " AUTOINCREMENT"
            
            if not col.get('nullable', True):
                col_def += " NOT NULL"
            
            col_defs.append(col_def)
        
        query = f"CREATE TABLE {table_name} ({', '.join(col_defs)})"
        
        with engine.connect() as conn:
            conn.execute(text(query))
            conn.commit()
    
    def drop_table(self, connection_id: str, table_name: str) -> None:
        """Drop a table"""
        engine = self.get_connection(connection_id)
        
        with engine.connect() as conn:
            conn.execute(text(f"DROP TABLE {table_name}"))
            conn.commit()
    
    def rename_table(self, connection_id: str, old_name: str, new_name: str) -> None:
        """Rename a table"""
        engine = self.get_connection(connection_id)
        
        if engine.dialect.name == 'sqlite':
            query = f"ALTER TABLE {old_name} RENAME TO {new_name}"
        else:
            query = f"ALTER TABLE {old_name} RENAME TO {new_name}"
        
        with engine.connect() as conn:
            conn.execute(text(query))
            conn.commit()
    
    def truncate_table(self, connection_id: str, table_name: str) -> None:
        """Truncate a table"""
        engine = self.get_connection(connection_id)
        
        with engine.connect() as conn:
            if engine.dialect.name == 'sqlite':
                conn.execute(text(f"DELETE FROM {table_name}"))
            else:
                conn.execute(text(f"TRUNCATE TABLE {table_name}"))
            conn.commit()
    
    def add_column(self, connection_id: str, table_name: str, column: Dict[str, Any]) -> None:
        """Add a column to a table"""
        engine = self.get_connection(connection_id)
        
        col_def = f"{column['name']} {column['type']}"
        
        if not column.get('nullable', True):
            col_def += " NOT NULL"
        
        if column.get('defaultValue') is not None:
            col_def += f" DEFAULT {column['defaultValue']}"
        
        query = f"ALTER TABLE {table_name} ADD COLUMN {col_def}"
        
        with engine.connect() as conn:
            conn.execute(text(query))
            conn.commit()
    
    def drop_column(self, connection_id: str, table_name: str, column_name: str) -> None:
        """Drop a column from a table"""
        engine = self.get_connection(connection_id)
        
        if engine.dialect.name == 'sqlite':
            raise ValueError("SQLite does not support dropping columns directly")
        
        query = f"ALTER TABLE {table_name} DROP COLUMN {column_name}"
        
        with engine.connect() as conn:
            conn.execute(text(query))
            conn.commit()
    
    def modify_column(self, connection_id: str, table_name: str, column_name: str, changes: Dict[str, Any]) -> None:
        """Modify a column"""
        engine = self.get_connection(connection_id)
        
        if engine.dialect.name == 'sqlite':
            raise ValueError("SQLite does not support column modification directly")
        
        with engine.connect() as conn:
            if changes.get('newName'):
                query = f"ALTER TABLE {table_name} RENAME COLUMN {column_name} TO {changes['newName']}"
                conn.execute(text(query))
            
            if changes.get('type'):
                if engine.dialect.name == 'postgresql':
                    query = f"ALTER TABLE {table_name} ALTER COLUMN {column_name} TYPE {changes['type']}"
                else:  # MySQL
                    query = f"ALTER TABLE {table_name} MODIFY COLUMN {column_name} {changes['type']}"
                conn.execute(text(query))
            
            conn.commit()
    
    def export_data(self, connection_id: str, table_name: str, format: str) -> str:
        """Export table data"""
        rows, _ = self.get_rows(connection_id, table_name)
        
        if format == 'json':
            return json.dumps(rows, indent=2, default=str)
        elif format == 'csv':
            if not rows:
                return ''
            
            output = io.StringIO()
            writer = csv.DictWriter(output, fieldnames=rows[0].keys())
            writer.writeheader()
            writer.writerows(rows)
            return output.getvalue()
        
        raise ValueError(f"Unsupported format: {format}")
    
    def export_sql_dump(self, connection_id: str, table_name: Optional[str] = None) -> str:
        """Export SQL dump"""
        engine = self.get_connection(connection_id)
        tables = [table_name] if table_name else [t.name for t in self.get_tables(connection_id)]
        
        sql_dump = ""
        
        for table in tables:
            columns = self.get_columns(connection_id, table)
            rows, _ = self.get_rows(connection_id, table)
            
            sql_dump += f"-- Table: {table}\n"
            sql_dump += f"DROP TABLE IF EXISTS {table};\n"
            
            # Create table statement
            col_defs = []
            for col in columns:
                col_def = f"{col.name} {col.type}"
                if not col.nullable:
                    col_def += " NOT NULL"
                if col.primaryKey:
                    col_def += " PRIMARY KEY"
                    if col.autoIncrement and engine.dialect.name == 'sqlite':
                        col_def += " AUTOINCREMENT"
                if col.defaultValue:
                    col_def += f" DEFAULT {col.defaultValue}"
                col_defs.append(col_def)
            
            sql_dump += f"CREATE TABLE {table} (\n  {', '.join(col_defs)}\n);\n\n"
            
            # Insert statements
            for row in rows:
                cols = ", ".join(row.keys())
                vals = []
                for v in row.values():
                    if v is None:
                        vals.append("NULL")
                    elif isinstance(v, str):
                        escaped_val = str(v).replace("'", "''")
                        vals.append(f"'{escaped_val}'")
                    else:
                        vals.append(str(v))
                sql_dump += f"INSERT INTO {table} ({cols}) VALUES ({', '.join(vals)});\n"
            
            sql_dump += "\n"
        
        return sql_dump
    
    def import_data(self, connection_id: str, table_name: str, format: str, data: str) -> Dict[str, Any]:
        """Import data into a table"""
        errors = []
        imported = 0
        
        try:
            if format == 'json':
                rows = json.loads(data)
                if not isinstance(rows, list):
                    rows = [rows]
            elif format == 'csv':
                reader = csv.DictReader(io.StringIO(data))
                rows = list(reader)
            else:
                raise ValueError(f"Unsupported format: {format}")
            
            for i, row in enumerate(rows):
                try:
                    # Convert empty strings to None
                    cleaned_row = {k: (None if v == '' or v == 'NULL' else v) for k, v in row.items()}
                    self.insert_row(connection_id, table_name, cleaned_row)
                    imported += 1
                except Exception as e:
                    errors.append(f"Row {i + 1}: {str(e)}")
            
            return {"imported": imported, "errors": errors}
        
        except Exception as e:
            raise ValueError(f"Import failed: {str(e)}")
    
    def _get_primary_key_column(self, connection_id: str, table_name: str) -> str:
        """Get the primary key column name"""
        columns = self.get_columns(connection_id, table_name)
        for col in columns:
            if col.primaryKey:
                return col.name
        return 'id'
    
    def bulk_insert(self, connection_id: str, table_name: str, rows: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Bulk insert rows"""
        engine = self.get_connection(connection_id)
        inserted = 0
        errors = []
        
        with engine.connect() as conn:
            for i, row in enumerate(rows):
                try:
                    cols = ", ".join(row.keys())
                    placeholders = ", ".join([f":{k}" for k in row.keys()])
                    query = f"INSERT INTO {table_name} ({cols}) VALUES ({placeholders})"
                    conn.execute(text(query), row)
                    inserted += 1
                except Exception as e:
                    errors.append(f"Row {i + 1}: {str(e)}")
            
            conn.commit()
        
        return {"inserted": inserted, "errors": errors}
    
    def bulk_update(self, connection_id: str, table_name: str, updates: Dict[str, Any], where: Dict[str, Any]) -> int:
        """Bulk update rows matching criteria"""
        engine = self.get_connection(connection_id)
        
        set_clause = ", ".join([f"{k} = :{k}" for k in updates.keys()])
        where_clause = " AND ".join([f"{k} = :where_{k}" for k in where.keys()])
        
        params = updates.copy()
        for k, v in where.items():
            params[f"where_{k}"] = v
        
        query = f"UPDATE {table_name} SET {set_clause} WHERE {where_clause}"
        
        with engine.connect() as conn:
            result = conn.execute(text(query), params)
            conn.commit()
            return result.rowcount
    
    def bulk_delete(self, connection_id: str, table_name: str, ids: List[Any]) -> int:
        """Bulk delete rows by ID"""
        engine = self.get_connection(connection_id)
        pk_column = self._get_primary_key_column(connection_id, table_name)
        
        with engine.connect() as conn:
            deleted = 0
            for row_id in ids:
                query = f"DELETE FROM {table_name} WHERE {pk_column} = :id"
                result = conn.execute(text(query), {"id": row_id})
                deleted += result.rowcount
            
            conn.commit()
            return deleted
    
    def get_table_relationships(self, connection_id: str, table_name: Optional[str] = None) -> List[Dict[str, Any]]:
        """Get foreign key relationships"""
        engine = self.get_connection(connection_id)
        inspector = inspect(engine)
        relationships = []
        
        tables = [table_name] if table_name else inspector.get_table_names()
        
        for tbl in tables:
            fks = inspector.get_foreign_keys(tbl)
            for fk in fks:
                relationships.append({
                    "fromTable": tbl,
                    "fromColumn": ", ".join(fk["constrained_columns"]),
                    "toTable": fk["referred_table"],
                    "toColumn": ", ".join(fk["referred_columns"]),
                    "onDelete": fk.get("ondelete"),
                    "onUpdate": fk.get("onupdate")
                })
        
        return relationships
    
    def create_index(self, connection_id: str, table_name: str, index_name: str, columns: List[str], unique: bool = False) -> None:
        """Create an index"""
        engine = self.get_connection(connection_id)
        
        unique_clause = "UNIQUE " if unique else ""
        cols = ", ".join(columns)
        query = f"CREATE {unique_clause}INDEX {index_name} ON {table_name} ({cols})"
        
        with engine.connect() as conn:
            conn.execute(text(query))
            conn.commit()
    
    def drop_index(self, connection_id: str, index_name: str, table_name: Optional[str] = None) -> None:
        """Drop an index"""
        engine = self.get_connection(connection_id)
        
        if engine.dialect.name == 'sqlite':
            query = f"DROP INDEX {index_name}"
        elif engine.dialect.name == 'mysql':
            if not table_name:
                raise ValueError("Table name required for MySQL")
            query = f"DROP INDEX {index_name} ON {table_name}"
        else:  # PostgreSQL
            query = f"DROP INDEX {index_name}"
        
        with engine.connect() as conn:
            conn.execute(text(query))
            conn.commit()
    
    def get_index_suggestions(self, connection_id: str, table_name: str) -> List[Dict[str, Any]]:
        """Analyze table and suggest indexes"""
        engine = self.get_connection(connection_id)
        inspector = inspect(engine)
        suggestions = []
        
        # Get foreign key columns
        fks = inspector.get_foreign_keys(table_name)
        existing_indexes = inspector.get_indexes(table_name)
        indexed_cols = set()
        for idx in existing_indexes:
            indexed_cols.update(idx["column_names"])
        
        # Suggest indexes for foreign key columns
        for fk in fks:
            for col in fk["constrained_columns"]:
                if col not in indexed_cols:
                    suggestions.append({
                        "table": table_name,
                        "columns": [col],
                        "reason": f"Foreign key column '{col}' is not indexed",
                        "impact": "high"
                    })
        
        # Check for frequently queried columns (basic heuristic)
        columns = inspector.get_columns(table_name)
        for col in columns:
            col_name = col["name"]
            if col_name not in indexed_cols and col["type"].__class__.__name__ in ["VARCHAR", "INTEGER"]:
                suggestions.append({
                    "table": table_name,
                    "columns": [col_name],
                    "reason": f"Column '{col_name}' may benefit from an index",
                    "impact": "medium"
                })
        
        return suggestions[:5]  # Return top 5 suggestions
    
    def add_constraint(self, connection_id: str, table_name: str, constraint_type: str, 
                      constraint_name: str, columns: List[str], **kwargs) -> None:
        """Add a constraint to a table"""
        engine = self.get_connection(connection_id)
        
        if constraint_type == "check":
            expression = kwargs.get("expression")
            if not expression:
                raise ValueError("Check constraint requires expression")
            query = f"ALTER TABLE {table_name} ADD CONSTRAINT {constraint_name} CHECK ({expression})"
        
        elif constraint_type == "unique":
            cols = ", ".join(columns)
            query = f"ALTER TABLE {table_name} ADD CONSTRAINT {constraint_name} UNIQUE ({cols})"
        
        elif constraint_type == "foreign_key":
            ref_table = kwargs.get("referencedTable")
            ref_cols = kwargs.get("referencedColumns", [])
            if not ref_table or not ref_cols:
                raise ValueError("Foreign key constraint requires referenced table and columns")
            
            cols = ", ".join(columns)
            ref_cols_str = ", ".join(ref_cols)
            query = f"ALTER TABLE {table_name} ADD CONSTRAINT {constraint_name} FOREIGN KEY ({cols}) REFERENCES {ref_table} ({ref_cols_str})"
        
        else:
            raise ValueError(f"Unsupported constraint type: {constraint_type}")
        
        with engine.connect() as conn:
            conn.execute(text(query))
            conn.commit()
    
    def drop_constraint(self, connection_id: str, table_name: str, constraint_name: str) -> None:
        """Drop a constraint"""
        engine = self.get_connection(connection_id)
        
        query = f"ALTER TABLE {table_name} DROP CONSTRAINT {constraint_name}"
        
        with engine.connect() as conn:
            conn.execute(text(query))
            conn.commit()
    
    def get_table_constraints(self, connection_id: str, table_name: str) -> List[Dict[str, Any]]:
        """Get all constraints for a table"""
        engine = self.get_connection(connection_id)
        inspector = inspect(engine)
        constraints = []
        
        # Get unique constraints
        unique_constraints = inspector.get_unique_constraints(table_name)
        for uc in unique_constraints:
            constraints.append({
                "name": uc.get("name"),
                "type": "UNIQUE",
                "columns": uc.get("column_names", [])
            })
        
        # Get check constraints (if supported)
        try:
            check_constraints = inspector.get_check_constraints(table_name)
            for cc in check_constraints:
                constraints.append({
                    "name": cc.get("name"),
                    "type": "CHECK",
                    "expression": cc.get("sqltext")
                })
        except:
            pass  # Not all databases support check constraints
        
        # Get foreign key constraints
        fk_constraints = inspector.get_foreign_keys(table_name)
        for fk in fk_constraints:
            constraints.append({
                "name": fk.get("name"),
                "type": "FOREIGN KEY",
                "columns": fk.get("constrained_columns", []),
                "referencedTable": fk.get("referred_table"),
                "referencedColumns": fk.get("referred_columns", [])
            })
        
        return constraints
    
    def analyze_table(self, connection_id: str, table_name: str) -> Dict[str, Any]:
        """Analyze table and provide statistics"""
        engine = self.get_connection(connection_id)
        inspector = inspect(engine)
        
        # Get row count
        with engine.connect() as conn:
            result = conn.execute(text(f"SELECT COUNT(*) FROM {table_name}"))
            row_count = result.scalar()
        
        # Get columns
        columns = inspector.get_columns(table_name)
        
        # Get indexes
        indexes = inspector.get_indexes(table_name)
        
        # Get foreign keys
        foreign_keys = inspector.get_foreign_keys(table_name)
        
        return {
            "tableName": table_name,
            "rowCount": row_count,
            "columnCount": len(columns),
            "indexCount": len(indexes),
            "foreignKeyCount": len(foreign_keys),
            "columns": [{"name": col["name"], "type": str(col["type"])} for col in columns],
            "indexes": [{"name": idx["name"], "columns": idx["column_names"], "unique": idx["unique"]} for idx in indexes]
        }


# Global database service instance
db_service = DatabaseService()
