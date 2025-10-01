import { z } from "zod";

// Database connection schema
export const connectionConfigSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  type: z.enum(['sqlite', 'postgresql', 'mysql', 'mongodb']),
  connectionString: z.string().optional(),
  filePath: z.string().optional(),
  host: z.string().optional(),
  port: z.number().optional(),
  database: z.string().optional(),
  username: z.string().optional(),
  password: z.string().optional(),
});

// Insert schema with optional type for auto-detection
export const insertConnectionConfigSchemaBase = z.object({
  name: z.string().optional(),
  type: z.enum(['sqlite', 'postgresql', 'mysql', 'mongodb']).optional(),
  connectionString: z.string().optional(),
  filePath: z.string().optional(),
  host: z.string().optional(),
  port: z.number().optional(),
  database: z.string().optional(),
  username: z.string().optional(),
  password: z.string().optional(),
});

export const insertConnectionConfigSchema = insertConnectionConfigSchemaBase;

export type ConnectionConfig = z.infer<typeof connectionConfigSchema>;
export type InsertConnectionConfig = z.infer<typeof insertConnectionConfigSchema>;

// Table metadata schema
export const tableMetadataSchema = z.object({
  name: z.string(),
  rowCount: z.number(),
  columnCount: z.number(),
});

export type TableMetadata = z.infer<typeof tableMetadataSchema>;

// Column metadata schema
export const columnMetadataSchema = z.object({
  name: z.string(),
  type: z.string(),
  nullable: z.boolean(),
  primaryKey: z.boolean(),
  autoIncrement: z.boolean(),
  foreignKey: z.object({
    table: z.string(),
    column: z.string(),
  }).optional(),
  defaultValue: z.any().optional(),
  indexed: z.boolean().optional(),
});

export type ColumnMetadata = z.infer<typeof columnMetadataSchema>;

// Index metadata schema
export const indexMetadataSchema = z.object({
  name: z.string(),
  columns: z.array(z.string()),
  type: z.enum(['PRIMARY', 'UNIQUE', 'INDEX', 'FOREIGN']),
});

export type IndexMetadata = z.infer<typeof indexMetadataSchema>;

// Query execution result schema
export const queryResultSchema = z.object({
  columns: z.array(z.string()),
  rows: z.array(z.record(z.any())),
  rowCount: z.number(),
  executionTime: z.number(),
});

export type QueryResult = z.infer<typeof queryResultSchema>;

// Export format schema
export const exportFormatSchema = z.enum(['csv', 'json']);
export type ExportFormat = z.infer<typeof exportFormatSchema>;
