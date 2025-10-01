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
