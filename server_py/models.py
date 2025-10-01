from pydantic import BaseModel
from typing import Optional, List, Dict, Any, Literal
from enum import Enum


class DatabaseType(str, Enum):
    SQLITE = "sqlite"
    POSTGRESQL = "postgresql"
    MYSQL = "mysql"
    MONGODB = "mongodb"


class ConnectionConfig(BaseModel):
    id: str
    name: Optional[str] = None
    type: DatabaseType
    connectionString: Optional[str] = None
    filePath: Optional[str] = None
    host: Optional[str] = None
    port: Optional[int] = None
    database: Optional[str] = None
    username: Optional[str] = None
    password: Optional[str] = None


class InsertConnectionConfig(BaseModel):
    name: Optional[str] = None
    type: Optional[DatabaseType] = None
    connectionString: Optional[str] = None
    filePath: Optional[str] = None
    host: Optional[str] = None
    port: Optional[int] = None
    database: Optional[str] = None
    username: Optional[str] = None
    password: Optional[str] = None


class TableMetadata(BaseModel):
    name: str
    rowCount: int
    columnCount: int


class ColumnMetadata(BaseModel):
    name: str
    type: str
    nullable: bool
    primaryKey: bool
    autoIncrement: bool
    foreignKey: Optional[Dict[str, str]] = None
    defaultValue: Optional[Any] = None
    indexed: Optional[bool] = False


class IndexMetadata(BaseModel):
    name: str
    columns: List[str]
    type: Literal["PRIMARY", "UNIQUE", "INDEX", "FOREIGN"]


class QueryResult(BaseModel):
    columns: List[str]
    rows: List[Dict[str, Any]]
    rowCount: int
    executionTime: float


class CreateTableRequest(BaseModel):
    tableName: str
    columns: List[Dict[str, Any]]


class RenameTableRequest(BaseModel):
    newName: str


class AddColumnRequest(BaseModel):
    name: str
    type: str
    nullable: Optional[bool] = True
    defaultValue: Optional[Any] = None


class ModifyColumnRequest(BaseModel):
    newName: Optional[str] = None
    type: Optional[str] = None
    nullable: Optional[bool] = None
    defaultValue: Optional[Any] = None


class ExecuteQueryRequest(BaseModel):
    query: str


class ImportDataRequest(BaseModel):
    format: Literal["csv", "json"]
    data: str


class ImportDataResponse(BaseModel):
    imported: int
    errors: List[str]


class QueryHistory(BaseModel):
    id: str
    connectionId: str
    query: str
    timestamp: str
    executionTime: float
    success: bool
    rowCount: Optional[int] = None
    error: Optional[str] = None


class BulkInsertRequest(BaseModel):
    rows: List[Dict[str, Any]]


class BulkUpdateRequest(BaseModel):
    updates: Dict[str, Any]
    where: Dict[str, Any]


class BulkDeleteRequest(BaseModel):
    ids: List[Any]


class BackupRequest(BaseModel):
    format: Literal["sql", "json"] = "sql"
    tables: Optional[List[str]] = None
    includeSchema: bool = True
    includeData: bool = True


class BackupResponse(BaseModel):
    filename: str
    size: int
    timestamp: str


class RestoreRequest(BaseModel):
    backup: str
    format: Literal["sql", "json"] = "sql"


class TableRelationship(BaseModel):
    fromTable: str
    fromColumn: str
    toTable: str
    toColumn: str
    onDelete: Optional[str] = None
    onUpdate: Optional[str] = None


class IndexSuggestion(BaseModel):
    table: str
    columns: List[str]
    reason: str
    impact: Literal["high", "medium", "low"]


class ValidationRule(BaseModel):
    column: str
    rule: str
    message: str
    enabled: bool = True


class CreateIndexRequest(BaseModel):
    indexName: str
    columns: List[str]
    unique: bool = False


class ConstraintRequest(BaseModel):
    constraintType: Literal["check", "unique", "foreign_key"]
    constraintName: str
    columns: List[str]
    expression: Optional[str] = None
    referencedTable: Optional[str] = None
    referencedColumns: Optional[List[str]] = None


class SavedQuery(BaseModel):
    id: str
    connectionId: str
    name: str
    query: str
    description: Optional[str] = None
    parameters: Optional[Dict[str, str]] = None
    tags: List[str] = []
    createdAt: str
    updatedAt: str
    favorite: bool = False


class InsertSavedQuery(BaseModel):
    name: str
    query: str
    description: Optional[str] = None
    parameters: Optional[Dict[str, str]] = None
    tags: List[str] = []
    favorite: bool = False


class QueryExplainRequest(BaseModel):
    query: str
    analyze: bool = False


class QueryExplainResult(BaseModel):
    query: str
    plan: str
    planText: str
    executionTime: Optional[float] = None
    rowsAffected: Optional[int] = None
    warnings: List[str] = []


class PerformanceMetrics(BaseModel):
    connectionId: str
    timestamp: str
    totalQueries: int
    slowQueries: int
    avgExecutionTime: float
    p95ExecutionTime: float
    errorRate: float
    activeConnections: int


class SlowQuery(BaseModel):
    id: str
    connectionId: str
    query: str
    executionTime: float
    timestamp: str
    rowCount: Optional[int] = None


class DataValidation(BaseModel):
    id: str
    connectionId: str
    tableName: str
    columnName: str
    ruleType: Literal["required", "unique", "range", "pattern", "custom"]
    ruleValue: Optional[str] = None
    customExpression: Optional[str] = None
    enabled: bool = True


class ValidationResult(BaseModel):
    tableName: str
    columnName: str
    rule: str
    violationCount: int
    sampleViolations: List[Dict[str, Any]] = []


class BackupMetadata(BaseModel):
    id: str
    connectionId: str
    filename: str
    format: Literal["sql", "json"]
    size: int
    timestamp: str
    tables: List[str]
    status: Literal["pending", "completed", "failed"]
