from fastapi import FastAPI, HTTPException, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, PlainTextResponse
from typing import Optional, Dict, Any
from models import (
    InsertConnectionConfig, CreateTableRequest, RenameTableRequest,
    AddColumnRequest, ModifyColumnRequest, ExecuteQueryRequest,
    ImportDataRequest, ImportDataResponse, BulkInsertRequest,
    BulkUpdateRequest, BulkDeleteRequest, CreateIndexRequest,
    ConstraintRequest
)
from database_service import db_service
from storage import storage
import os


app = FastAPI(title="Universal DB Manager API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# API Routes
@app.get("/api/connections")
async def get_connections():
    """Get all database connections"""
    try:
        connections = storage.get_all_connections()
        return [conn.model_dump() for conn in connections]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/connections")
async def create_connection(config: InsertConnectionConfig):
    """Create a new database connection"""
    try:
        # Auto-detect database type if not provided
        from models import DatabaseType
        
        db_type = config.type
        if not db_type:
            detected_type = db_service.detect_database_type(config.model_dump(exclude_none=True))
            if not detected_type:
                raise HTTPException(status_code=400, detail="Could not detect database type. Please specify manually.")
            # Convert string to DatabaseType enum
            db_type = DatabaseType(detected_type)
        
        # Create connection in storage
        connection = storage.create_connection(config, db_type)
        
        # Test connection
        db_service.connect(connection)
        
        return connection.model_dump()
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.delete("/api/connections/{connection_id}")
async def delete_connection(connection_id: str):
    """Delete a database connection"""
    try:
        db_service.disconnect(connection_id)
        storage.delete_connection(connection_id)
        return {"success": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/connections/{connection_id}/tables")
async def get_tables(connection_id: str):
    """Get all tables for a connection"""
    try:
        tables = db_service.get_tables(connection_id)
        return [table.model_dump() for table in tables]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/connections/{connection_id}/tables/{table_name}/columns")
async def get_columns(connection_id: str, table_name: str):
    """Get columns for a table"""
    try:
        columns = db_service.get_columns(connection_id, table_name)
        return [col.model_dump() for col in columns]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/connections/{connection_id}/tables/{table_name}/indexes")
async def get_indexes(connection_id: str, table_name: str):
    """Get indexes for a table"""
    try:
        indexes = db_service.get_indexes(connection_id, table_name)
        return [idx.model_dump() for idx in indexes]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/connections/{connection_id}/tables/{table_name}/rows")
async def get_rows(
    connection_id: str,
    table_name: str,
    limit: Optional[int] = None,
    offset: Optional[int] = None,
    orderBy: Optional[str] = None,
    orderDirection: Optional[str] = 'asc',
    search: Optional[str] = None
):
    """Get rows from a table"""
    try:
        rows, total = db_service.get_rows(
            connection_id, table_name, limit, offset, orderBy, orderDirection or 'asc', search
        )
        return {"rows": rows, "total": total}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/connections/{connection_id}/tables/{table_name}/rows")
async def insert_row(connection_id: str, table_name: str, data: Dict[str, Any]):
    """Insert a new row"""
    try:
        result = db_service.insert_row(connection_id, table_name, data)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.patch("/api/connections/{connection_id}/tables/{table_name}/rows/{row_id}")
async def update_row(connection_id: str, table_name: str, row_id: str, data: Dict[str, Any]):
    """Update a row"""
    try:
        result = db_service.update_row(connection_id, table_name, row_id, data)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.delete("/api/connections/{connection_id}/tables/{table_name}/rows/{row_id}")
async def delete_row(connection_id: str, table_name: str, row_id: str):
    """Delete a row"""
    try:
        db_service.delete_row(connection_id, table_name, row_id)
        return {"success": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/connections/{connection_id}/query")
async def execute_query(connection_id: str, request: ExecuteQueryRequest):
    """Execute a custom SQL query"""
    try:
        result = db_service.execute_query(connection_id, request.query)
        # Save to query history
        storage.add_query_history(
            connection_id, 
            request.query, 
            result.executionTime, 
            True, 
            result.rowCount
        )
        return result.model_dump()
    except Exception as e:
        # Save failed query to history
        storage.add_query_history(
            connection_id, 
            request.query, 
            0.0, 
            False, 
            error=str(e)
        )
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/api/connections/{connection_id}/tables")
async def create_table(connection_id: str, request: CreateTableRequest):
    """Create a new table"""
    try:
        db_service.create_table(connection_id, request.tableName, request.columns)
        return {"success": True}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.delete("/api/connections/{connection_id}/tables/{table_name}")
async def drop_table(connection_id: str, table_name: str):
    """Drop a table"""
    try:
        db_service.drop_table(connection_id, table_name)
        return {"success": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.patch("/api/connections/{connection_id}/tables/{table_name}/rename")
async def rename_table(connection_id: str, table_name: str, request: RenameTableRequest):
    """Rename a table"""
    try:
        db_service.rename_table(connection_id, table_name, request.newName)
        return {"success": True}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/api/connections/{connection_id}/tables/{table_name}/truncate")
async def truncate_table(connection_id: str, table_name: str):
    """Truncate a table"""
    try:
        db_service.truncate_table(connection_id, table_name)
        return {"success": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/connections/{connection_id}/tables/{table_name}/columns")
async def add_column(connection_id: str, table_name: str, request: AddColumnRequest):
    """Add a column to a table"""
    try:
        db_service.add_column(connection_id, table_name, request.model_dump())
        return {"success": True}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.delete("/api/connections/{connection_id}/tables/{table_name}/columns/{column_name}")
async def drop_column(connection_id: str, table_name: str, column_name: str):
    """Drop a column from a table"""
    try:
        db_service.drop_column(connection_id, table_name, column_name)
        return {"success": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.patch("/api/connections/{connection_id}/tables/{table_name}/columns/{column_name}")
async def modify_column(connection_id: str, table_name: str, column_name: str, request: ModifyColumnRequest):
    """Modify a column"""
    try:
        db_service.modify_column(connection_id, table_name, column_name, request.model_dump(exclude_none=True))
        return {"success": True}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/api/connections/{connection_id}/tables/{table_name}/export")
async def export_data(connection_id: str, table_name: str, format: str = 'json'):
    """Export table data"""
    try:
        data = db_service.export_data(connection_id, table_name, format)
        
        content_type = 'application/json' if format == 'json' else 'text/csv'
        filename = f"{table_name}.{format}"
        
        return Response(
            content=data,
            media_type=content_type,
            headers={"Content-Disposition": f'attachment; filename="{filename}"'}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/connections/{connection_id}/export/sql")
async def export_sql_dump(connection_id: str, tableName: Optional[str] = None):
    """Export SQL dump"""
    try:
        data = db_service.export_sql_dump(connection_id, tableName)
        
        filename = f"{tableName}.sql" if tableName else "database_dump.sql"
        
        return Response(
            content=data,
            media_type='application/sql',
            headers={"Content-Disposition": f'attachment; filename="{filename}"'}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/connections/{connection_id}/tables/{table_name}/import")
async def import_data(connection_id: str, table_name: str, request: ImportDataRequest):
    """Import data into a table"""
    try:
        result = db_service.import_data(connection_id, table_name, request.format, request.data)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# Query History Routes
@app.get("/api/connections/{connection_id}/query-history")
async def get_query_history(connection_id: str, limit: int = 50):
    """Get query history for a connection"""
    try:
        history = storage.get_query_history(connection_id, limit)
        return [h.model_dump() for h in history]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.delete("/api/connections/{connection_id}/query-history")
async def clear_query_history(connection_id: str):
    """Clear query history for a connection"""
    try:
        storage.clear_query_history(connection_id)
        return {"success": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Bulk Operations Routes
@app.post("/api/connections/{connection_id}/tables/{table_name}/bulk-insert")
async def bulk_insert(connection_id: str, table_name: str, request: BulkInsertRequest):
    """Bulk insert rows"""
    try:
        result = db_service.bulk_insert(connection_id, table_name, request.rows)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/api/connections/{connection_id}/tables/{table_name}/bulk-update")
async def bulk_update(connection_id: str, table_name: str, request: BulkUpdateRequest):
    """Bulk update rows"""
    try:
        updated = db_service.bulk_update(connection_id, table_name, request.updates, request.where)
        return {"updated": updated}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/api/connections/{connection_id}/tables/{table_name}/bulk-delete")
async def bulk_delete(connection_id: str, table_name: str, request: BulkDeleteRequest):
    """Bulk delete rows"""
    try:
        deleted = db_service.bulk_delete(connection_id, table_name, request.ids)
        return {"deleted": deleted}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# Relationship Routes
@app.get("/api/connections/{connection_id}/relationships")
async def get_relationships(connection_id: str, tableName: Optional[str] = None):
    """Get table relationships"""
    try:
        relationships = db_service.get_table_relationships(connection_id, tableName)
        return relationships
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Index Management Routes
@app.post("/api/connections/{connection_id}/tables/{table_name}/indexes")
async def create_index(connection_id: str, table_name: str, request: CreateIndexRequest):
    """Create an index"""
    try:
        db_service.create_index(connection_id, table_name, request.indexName, request.columns, request.unique)
        return {"success": True}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.delete("/api/connections/{connection_id}/tables/{table_name}/indexes/{index_name}")
async def drop_index(connection_id: str, table_name: str, index_name: str):
    """Drop an index"""
    try:
        db_service.drop_index(connection_id, index_name, table_name)
        return {"success": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/connections/{connection_id}/tables/{table_name}/index-suggestions")
async def get_index_suggestions(connection_id: str, table_name: str):
    """Get index suggestions"""
    try:
        suggestions = db_service.get_index_suggestions(connection_id, table_name)
        return suggestions
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Constraint Management Routes
@app.post("/api/connections/{connection_id}/tables/{table_name}/constraints")
async def add_constraint(connection_id: str, table_name: str, request: ConstraintRequest):
    """Add a constraint"""
    try:
        db_service.add_constraint(
            connection_id, table_name, request.constraintType,
            request.constraintName, request.columns,
            expression=request.expression,
            referencedTable=request.referencedTable,
            referencedColumns=request.referencedColumns
        )
        return {"success": True}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.delete("/api/connections/{connection_id}/tables/{table_name}/constraints/{constraint_name}")
async def drop_constraint(connection_id: str, table_name: str, constraint_name: str):
    """Drop a constraint"""
    try:
        db_service.drop_constraint(connection_id, table_name, constraint_name)
        return {"success": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/connections/{connection_id}/tables/{table_name}/constraints")
async def get_constraints(connection_id: str, table_name: str):
    """Get table constraints"""
    try:
        constraints = db_service.get_table_constraints(connection_id, table_name)
        return constraints
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Table Analysis Route
@app.get("/api/connections/{connection_id}/tables/{table_name}/analyze")
async def analyze_table(connection_id: str, table_name: str):
    """Analyze table and get statistics"""
    try:
        analysis = db_service.analyze_table(connection_id, table_name)
        return analysis
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Serve frontend static files
dist_path = "../dist/public" if os.path.exists("../dist/public") else "dist/public"
if os.path.exists(dist_path):
    assets_path = os.path.join(dist_path, "assets")
    if os.path.exists(assets_path):
        app.mount("/assets", StaticFiles(directory=assets_path), name="assets")
    
    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        """Serve frontend application"""
        # If path is an API route, let it through
        if full_path.startswith("api/"):
            raise HTTPException(status_code=404)
        
        # Check if file exists in dist
        file_path = os.path.join(dist_path, full_path)
        if os.path.isfile(file_path):
            return FileResponse(file_path)
        
        # Otherwise serve index.html (SPA routing)
        index_path = os.path.join(dist_path, "index.html")
        if os.path.isfile(index_path):
            return FileResponse(index_path)
        
        raise HTTPException(status_code=404, detail="Frontend not built")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)
