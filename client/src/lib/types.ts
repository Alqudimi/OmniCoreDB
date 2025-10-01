export interface Connection {
  id: string;
  name?: string;
  type: 'sqlite' | 'postgresql' | 'mysql' | 'mongodb';
  database?: string;
  host?: string;
  port?: number;
  connectionString?: string;
  filePath?: string;
}

export interface TableMetadata {
  name: string;
  rowCount: number;
  columnCount: number;
}

export interface ColumnMetadata {
  name: string;
  type: string;
  nullable: boolean;
  primaryKey: boolean;
  autoIncrement: boolean;
  foreignKey?: {
    table: string;
    column: string;
  };
  defaultValue?: any;
  indexed?: boolean;
}

export interface IndexMetadata {
  name: string;
  columns: string[];
  type: 'PRIMARY' | 'UNIQUE' | 'INDEX' | 'FOREIGN';
}

export interface QueryResult {
  columns: string[];
  rows: Record<string, any>[];
  rowCount: number;
  executionTime: number;
}
