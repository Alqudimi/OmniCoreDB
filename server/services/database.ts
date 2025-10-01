import knex, { Knex } from 'knex';
import { ConnectionConfig, TableMetadata, ColumnMetadata, IndexMetadata, QueryResult } from '@shared/schema';
import sqlite3 from 'sqlite3';
import fs from 'fs';
import path from 'path';

export class DatabaseService {
  private connections: Map<string, Knex> = new Map();

  async detectDatabaseType(config: { connectionString?: string; filePath?: string }): Promise<'sqlite' | 'postgresql' | 'mysql' | null> {
    if (config.filePath) {
      const ext = path.extname(config.filePath).toLowerCase();
      if (['.db', '.sqlite', '.sqlite3'].includes(ext)) {
        return 'sqlite';
      }
    }

    if (config.connectionString) {
      const connStr = config.connectionString.toLowerCase();
      if (connStr.startsWith('postgres://') || connStr.startsWith('postgresql://')) {
        return 'postgresql';
      }
      if (connStr.startsWith('mysql://')) {
        return 'mysql';
      }
      if (connStr.startsWith('sqlite://') || connStr.includes('.db') || connStr.includes('.sqlite')) {
        return 'sqlite';
      }
    }

    return null;
  }

  async connect(config: ConnectionConfig): Promise<void> {
    let knexConfig: Knex.Config;

    if (config.type === 'sqlite') {
      const dbPath = config.filePath || config.connectionString?.replace('sqlite://', '') || ':memory:';
      knexConfig = {
        client: 'sqlite3',
        connection: {
          filename: dbPath,
        },
        useNullAsDefault: true,
      };
    } else if (config.type === 'postgresql') {
      knexConfig = {
        client: 'pg',
        connection: config.connectionString || {
          host: config.host || 'localhost',
          port: config.port || 5432,
          database: config.database,
          user: config.username,
          password: config.password,
        },
      };
    } else if (config.type === 'mysql') {
      knexConfig = {
        client: 'mysql2',
        connection: config.connectionString || {
          host: config.host || 'localhost',
          port: config.port || 3306,
          database: config.database,
          user: config.username,
          password: config.password,
        },
      };
    } else {
      throw new Error('Unsupported database type');
    }

    const connection = knex(knexConfig);
    
    // Test connection
    await connection.raw('SELECT 1');
    
    this.connections.set(config.id, connection);
  }

  getConnection(connectionId: string): Knex {
    const connection = this.connections.get(connectionId);
    if (!connection) {
      throw new Error('Connection not found');
    }
    return connection;
  }

  async disconnect(connectionId: string): Promise<void> {
    const connection = this.connections.get(connectionId);
    if (connection) {
      await connection.destroy();
      this.connections.delete(connectionId);
    }
  }

  async getTables(connectionId: string): Promise<TableMetadata[]> {
    const db = this.getConnection(connectionId);
    const client = db.client.config.client;

    let tables: string[] = [];

    if (client === 'sqlite3') {
      const result = await db.raw("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'");
      tables = result.map((row: any) => row.name);
    } else if (client === 'pg') {
      const result = await db.raw("SELECT tablename FROM pg_tables WHERE schemaname = 'public'");
      tables = result.rows.map((row: any) => row.tablename);
    } else if (client === 'mysql2') {
      const result = await db.raw('SHOW TABLES');
      tables = result[0].map((row: any) => Object.values(row)[0] as string);
    }

    const tableMetadata: TableMetadata[] = [];

    for (const tableName of tables) {
      const countResult = await db(tableName).count('* as count').first();
      const count = Number(countResult?.count || 0);

      const columns = await this.getColumns(connectionId, tableName);

      tableMetadata.push({
        name: tableName,
        rowCount: count,
        columnCount: columns.length,
      });
    }

    return tableMetadata;
  }

  async getColumns(connectionId: string, tableName: string): Promise<ColumnMetadata[]> {
    const db = this.getConnection(connectionId);
    const client = db.client.config.client;

    let columns: ColumnMetadata[] = [];

    if (client === 'sqlite3') {
      const result = await db.raw(`PRAGMA table_info(${tableName})`);
      
      const foreignKeys = await db.raw(`PRAGMA foreign_key_list(${tableName})`);
      const fkMap = new Map<string, { table: string; column: string }>();
      foreignKeys.forEach((fk: any) => {
        fkMap.set(fk.from, { table: fk.table, column: fk.to });
      });

      columns = result.map((col: any) => ({
        name: col.name,
        type: col.type,
        nullable: col.notnull === 0,
        primaryKey: col.pk === 1,
        autoIncrement: col.pk === 1 && col.type.toUpperCase() === 'INTEGER',
        foreignKey: fkMap.get(col.name),
        defaultValue: col.dflt_value,
        indexed: false,
      }));
    } else if (client === 'pg') {
      const result = await db.raw(`
        SELECT 
          a.attname as name,
          pg_catalog.format_type(a.atttypid, a.atttypmod) as type,
          NOT a.attnotnull as nullable,
          COALESCE((SELECT true FROM pg_index i WHERE i.indrelid = a.attrelid AND a.attnum = ANY(i.indkey) AND i.indisprimary), false) as primary_key,
          pg_get_expr(d.adbin, d.adrelid) as default_value
        FROM pg_attribute a
        LEFT JOIN pg_attrdef d ON a.attrelid = d.adrelid AND a.attnum = d.adnum
        WHERE a.attrelid = '${tableName}'::regclass
        AND a.attnum > 0
        AND NOT a.attisdropped
        ORDER BY a.attnum
      `);

      // Get foreign keys
      const fkResult = await db.raw(`
        SELECT
          kcu.column_name,
          ccu.table_name AS foreign_table_name,
          ccu.column_name AS foreign_column_name
        FROM information_schema.table_constraints AS tc
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
          AND tc.table_schema = kcu.table_schema
        JOIN information_schema.constraint_column_usage AS ccu
          ON ccu.constraint_name = tc.constraint_name
          AND ccu.table_schema = tc.table_schema
        WHERE tc.constraint_type = 'FOREIGN KEY'
          AND tc.table_name = '${tableName}'
      `);

      const fkMap = new Map<string, { table: string; column: string }>();
      fkResult.rows.forEach((fk: any) => {
        fkMap.set(fk.column_name, { table: fk.foreign_table_name, column: fk.foreign_column_name });
      });

      columns = result.rows.map((col: any) => ({
        name: col.name,
        type: col.type,
        nullable: col.nullable,
        primaryKey: col.primary_key,
        autoIncrement: col.default_value?.includes('nextval'),
        foreignKey: fkMap.get(col.name),
        defaultValue: col.default_value,
        indexed: false,
      }));
    } else if (client === 'mysql2') {
      const result = await db.raw(`SHOW COLUMNS FROM ${tableName}`);
      
      const fkResult = await db.raw(`
        SELECT
          COLUMN_NAME,
          REFERENCED_TABLE_NAME,
          REFERENCED_COLUMN_NAME
        FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
        WHERE TABLE_SCHEMA = DATABASE()
          AND TABLE_NAME = '${tableName}'
          AND REFERENCED_TABLE_NAME IS NOT NULL
      `);

      const fkMap = new Map<string, { table: string; column: string }>();
      fkResult[0].forEach((fk: any) => {
        fkMap.set(fk.COLUMN_NAME, { table: fk.REFERENCED_TABLE_NAME, column: fk.REFERENCED_COLUMN_NAME });
      });

      columns = result[0].map((col: any) => ({
        name: col.Field,
        type: col.Type,
        nullable: col.Null === 'YES',
        primaryKey: col.Key === 'PRI',
        autoIncrement: col.Extra.includes('auto_increment'),
        foreignKey: fkMap.get(col.Field),
        defaultValue: col.Default,
        indexed: col.Key === 'MUL' || col.Key === 'UNI',
      }));
    }

    return columns;
  }

  async getIndexes(connectionId: string, tableName: string): Promise<IndexMetadata[]> {
    const db = this.getConnection(connectionId);
    const client = db.client.config.client;

    let indexes: IndexMetadata[] = [];

    if (client === 'sqlite3') {
      const result = await db.raw(`PRAGMA index_list(${tableName})`);
      
      for (const idx of result) {
        const cols = await db.raw(`PRAGMA index_info(${idx.name})`);
        const columns = cols.map((c: any) => c.name);
        
        let type: 'PRIMARY' | 'UNIQUE' | 'INDEX' | 'FOREIGN' = 'INDEX';
        if (idx.name.toLowerCase().includes('primary')) type = 'PRIMARY';
        else if (idx.unique === 1) type = 'UNIQUE';
        else if (idx.name.toLowerCase().includes('fk_')) type = 'FOREIGN';
        
        indexes.push({
          name: idx.name,
          columns,
          type,
        });
      }
    } else if (client === 'pg') {
      const result = await db.raw(`
        SELECT
          i.relname as index_name,
          a.attname as column_name,
          ix.indisprimary as is_primary,
          ix.indisunique as is_unique
        FROM pg_class t
        JOIN pg_index ix ON t.oid = ix.indrelid
        JOIN pg_class i ON i.oid = ix.indexrelid
        JOIN pg_attribute a ON a.attrelid = t.oid AND a.attnum = ANY(ix.indkey)
        WHERE t.relname = '${tableName}'
        ORDER BY i.relname, a.attnum
      `);

      const indexMap = new Map<string, { columns: string[]; isPrimary: boolean; isUnique: boolean }>();
      
      result.rows.forEach((row: any) => {
        if (!indexMap.has(row.index_name)) {
          indexMap.set(row.index_name, {
            columns: [],
            isPrimary: row.is_primary,
            isUnique: row.is_unique,
          });
        }
        indexMap.get(row.index_name)!.columns.push(row.column_name);
      });

      indexMap.forEach((value, key) => {
        let type: 'PRIMARY' | 'UNIQUE' | 'INDEX' | 'FOREIGN' = 'INDEX';
        if (value.isPrimary) type = 'PRIMARY';
        else if (value.isUnique) type = 'UNIQUE';
        
        indexes.push({
          name: key,
          columns: value.columns,
          type,
        });
      });
    } else if (client === 'mysql2') {
      const result = await db.raw(`SHOW INDEX FROM ${tableName}`);
      
      const indexMap = new Map<string, { columns: string[]; keyName: string; nonUnique: boolean }>();
      
      result[0].forEach((row: any) => {
        if (!indexMap.has(row.Key_name)) {
          indexMap.set(row.Key_name, {
            columns: [],
            keyName: row.Key_name,
            nonUnique: row.Non_unique === 1,
          });
        }
        indexMap.get(row.Key_name)!.columns.push(row.Column_name);
      });

      indexMap.forEach((value, key) => {
        let type: 'PRIMARY' | 'UNIQUE' | 'INDEX' | 'FOREIGN' = 'INDEX';
        if (key === 'PRIMARY') type = 'PRIMARY';
        else if (!value.nonUnique) type = 'UNIQUE';
        
        indexes.push({
          name: key,
          columns: value.columns,
          type,
        });
      });
    }

    return indexes;
  }

  async getRows(connectionId: string, tableName: string, options?: {
    limit?: number;
    offset?: number;
    orderBy?: string;
    orderDirection?: 'asc' | 'desc';
    search?: string;
    where?: Record<string, any>;
  }): Promise<{ rows: any[]; total: number }> {
    const db = this.getConnection(connectionId);
    
    let query = db(tableName);

    // Apply search filter across all text columns
    if (options?.search) {
      const columns = await this.getColumns(connectionId, tableName);
      const searchableColumns = columns.filter(col => 
        ['text', 'varchar', 'char', 'string'].some(type => 
          col.type.toLowerCase().includes(type)
        )
      );

      if (searchableColumns.length > 0) {
        query = query.where((builder) => {
          searchableColumns.forEach((col, index) => {
            if (index === 0) {
              builder.where(col.name, 'like', `%${options.search}%`);
            } else {
              builder.orWhere(col.name, 'like', `%${options.search}%`);
            }
          });
        });
      }
    }

    if (options?.where) {
      query = query.where(options.where);
    }

    const total = await query.clone().count('* as count').first();
    const totalCount = Number(total?.count || 0);

    if (options?.orderBy) {
      query = query.orderBy(options.orderBy, options.orderDirection || 'asc');
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    if (options?.offset) {
      query = query.offset(options.offset);
    }

    const rows = await query;

    return { rows, total: totalCount };
  }

  async insertRow(connectionId: string, tableName: string, data: Record<string, any>): Promise<any> {
    const db = this.getConnection(connectionId);
    const result = await db(tableName).insert(data).returning('*');
    return result[0] || data;
  }

  async updateRow(connectionId: string, tableName: string, id: any, data: Record<string, any>): Promise<any> {
    const db = this.getConnection(connectionId);
    const columns = await this.getColumns(connectionId, tableName);
    const primaryKey = columns.find(col => col.primaryKey);
    
    if (!primaryKey) {
      throw new Error('Table has no primary key');
    }

    await db(tableName).where(primaryKey.name, id).update(data);
    const result = await db(tableName).where(primaryKey.name, id).first();
    return result;
  }

  async deleteRow(connectionId: string, tableName: string, id: any): Promise<void> {
    const db = this.getConnection(connectionId);
    const columns = await this.getColumns(connectionId, tableName);
    const primaryKey = columns.find(col => col.primaryKey);
    
    if (!primaryKey) {
      throw new Error('Table has no primary key');
    }

    await db(tableName).where(primaryKey.name, id).delete();
  }

  async executeQuery(connectionId: string, query: string): Promise<QueryResult> {
    const db = this.getConnection(connectionId);
    const startTime = Date.now();
    
    const result = await db.raw(query);
    const executionTime = Date.now() - startTime;

    let rows: any[] = [];
    let columns: string[] = [];

    if (Array.isArray(result)) {
      rows = result;
    } else if (result.rows) {
      rows = result.rows;
    } else if (result[0]) {
      rows = result[0];
    }

    if (rows.length > 0) {
      columns = Object.keys(rows[0]);
    }

    return {
      columns,
      rows,
      rowCount: rows.length,
      executionTime,
    };
  }

  async createTable(connectionId: string, tableName: string, columns: Array<{ name: string; type: string; nullable?: boolean; primaryKey?: boolean }>): Promise<void> {
    const db = this.getConnection(connectionId);
    
    await db.schema.createTable(tableName, (table) => {
      columns.forEach(col => {
        let column;
        
        const type = col.type.toLowerCase();
        if (type.includes('int')) {
          column = table.integer(col.name);
        } else if (type.includes('varchar') || type.includes('text')) {
          column = table.string(col.name);
        } else if (type.includes('decimal') || type.includes('numeric')) {
          column = table.decimal(col.name);
        } else if (type.includes('bool')) {
          column = table.boolean(col.name);
        } else if (type.includes('date') || type.includes('time')) {
          column = table.timestamp(col.name);
        } else {
          column = table.string(col.name);
        }

        if (col.primaryKey) {
          column.primary();
        }
        
        if (col.nullable === false) {
          column.notNullable();
        }
      });
    });
  }

  async dropTable(connectionId: string, tableName: string): Promise<void> {
    const db = this.getConnection(connectionId);
    await db.schema.dropTable(tableName);
  }

  async renameTable(connectionId: string, oldTableName: string, newTableName: string): Promise<void> {
    const db = this.getConnection(connectionId);
    await db.schema.renameTable(oldTableName, newTableName);
  }

  async truncateTable(connectionId: string, tableName: string): Promise<void> {
    const db = this.getConnection(connectionId);
    await db(tableName).truncate();
  }

  async addColumn(connectionId: string, tableName: string, column: { 
    name: string; 
    type: string; 
    nullable?: boolean; 
    defaultValue?: any;
  }): Promise<void> {
    const db = this.getConnection(connectionId);
    
    await db.schema.table(tableName, (table) => {
      let col;
      
      const type = column.type.toLowerCase();
      if (type.includes('int')) {
        col = table.integer(column.name);
      } else if (type.includes('varchar') || type.includes('text') || type.includes('string')) {
        col = table.string(column.name);
      } else if (type.includes('decimal') || type.includes('numeric') || type.includes('float') || type.includes('double')) {
        col = table.decimal(column.name);
      } else if (type.includes('bool')) {
        col = table.boolean(column.name);
      } else if (type.includes('date')) {
        col = table.date(column.name);
      } else if (type.includes('time')) {
        col = table.timestamp(column.name);
      } else if (type.includes('json')) {
        col = table.json(column.name);
      } else {
        col = table.string(column.name);
      }

      if (column.nullable === false) {
        col.notNullable();
      } else {
        col.nullable();
      }
      
      if (column.defaultValue !== undefined) {
        col.defaultTo(column.defaultValue);
      }
    });
  }

  async dropColumn(connectionId: string, tableName: string, columnName: string): Promise<void> {
    const db = this.getConnection(connectionId);
    await db.schema.table(tableName, (table) => {
      table.dropColumn(columnName);
    });
  }

  async modifyColumn(connectionId: string, tableName: string, columnName: string, changes: {
    newName?: string;
    type?: string;
    nullable?: boolean;
    defaultValue?: any;
  }): Promise<void> {
    const db = this.getConnection(connectionId);
    const client = db.client.config.client;

    if (client === 'sqlite3') {
      throw new Error('SQLite does not support column modification directly. You need to recreate the table.');
    }

    await db.schema.table(tableName, (table) => {
      if (changes.newName) {
        table.renameColumn(columnName, changes.newName);
      }
      
      if (changes.type) {
        const type = changes.type.toLowerCase();
        if (type.includes('int')) {
          table.integer(columnName).alter();
        } else if (type.includes('varchar') || type.includes('text') || type.includes('string')) {
          table.string(columnName).alter();
        } else if (type.includes('decimal') || type.includes('numeric')) {
          table.decimal(columnName).alter();
        } else if (type.includes('bool')) {
          table.boolean(columnName).alter();
        } else if (type.includes('date') || type.includes('time')) {
          table.timestamp(columnName).alter();
        }
      }
    });
  }

  async exportData(connectionId: string, tableName: string, format: 'csv' | 'json'): Promise<string> {
    const { rows } = await this.getRows(connectionId, tableName);

    if (format === 'json') {
      return JSON.stringify(rows, null, 2);
    } else {
      // CSV export
      if (rows.length === 0) return '';
      
      const columns = Object.keys(rows[0]);
      const header = columns.join(',');
      const csvRows = rows.map(row => 
        columns.map(col => {
          const value = row[col];
          if (value === null || value === undefined) return '';
          const stringValue = String(value);
          // Escape quotes and wrap in quotes if contains comma or quote
          if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
            return `"${stringValue.replace(/"/g, '""')}"`;
          }
          return stringValue;
        }).join(',')
      );
      
      return [header, ...csvRows].join('\n');
    }
  }

  async exportSQLDump(connectionId: string, tableName?: string): Promise<string> {
    const db = this.getConnection(connectionId);
    const client = db.client.config.client;
    let sqlDump = '';

    const tablesToExport = tableName ? [tableName] : (await this.getTables(connectionId)).map(t => t.name);

    for (const table of tablesToExport) {
      const columns = await this.getColumns(connectionId, table);
      const { rows } = await this.getRows(connectionId, table);

      sqlDump += `-- Table: ${table}\n`;
      sqlDump += `DROP TABLE IF EXISTS "${table}";\n`;
      
      sqlDump += `CREATE TABLE "${table}" (\n`;
      const columnDefs = columns.map(col => {
        let def = `  "${col.name}" ${col.type}`;
        if (!col.nullable) def += ' NOT NULL';
        if (col.primaryKey) def += ' PRIMARY KEY';
        if (col.autoIncrement && client === 'sqlite3') def += ' AUTOINCREMENT';
        if (col.defaultValue !== null && col.defaultValue !== undefined) {
          def += ` DEFAULT ${col.defaultValue}`;
        }
        return def;
      });
      sqlDump += columnDefs.join(',\n');
      sqlDump += `\n);\n\n`;

      if (rows.length > 0) {
        for (const row of rows) {
          const cols = Object.keys(row).map(k => `"${k}"`).join(', ');
          const vals = Object.values(row).map(v => {
            if (v === null || v === undefined) return 'NULL';
            if (typeof v === 'string') return `'${v.replace(/'/g, "''")}'`;
            return v;
          }).join(', ');
          sqlDump += `INSERT INTO "${table}" (${cols}) VALUES (${vals});\n`;
        }
        sqlDump += '\n';
      }
    }

    return sqlDump;
  }

  async importData(connectionId: string, tableName: string, format: 'csv' | 'json', data: string): Promise<{ imported: number; errors: string[] }> {
    const db = this.getConnection(connectionId);
    const errors: string[] = [];
    let imported = 0;

    try {
      let rows: any[] = [];

      if (format === 'json') {
        try {
          const parsed = JSON.parse(data);
          rows = Array.isArray(parsed) ? parsed : [parsed];
        } catch (e) {
          throw new Error('Invalid JSON format');
        }
      } else if (format === 'csv') {
        const lines = data.split('\n').filter(line => line.trim());
        if (lines.length < 2) {
          throw new Error('CSV must have at least header and one data row');
        }

        const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
        
        for (let i = 1; i < lines.length; i++) {
          const values: string[] = [];
          let currentValue = '';
          let insideQuotes = false;

          for (const char of lines[i]) {
            if (char === '"') {
              insideQuotes = !insideQuotes;
            } else if (char === ',' && !insideQuotes) {
              values.push(currentValue.trim().replace(/^"|"$/g, '').replace(/""/g, '"'));
              currentValue = '';
            } else {
              currentValue += char;
            }
          }
          values.push(currentValue.trim().replace(/^"|"$/g, '').replace(/""/g, '"'));

          const row: any = {};
          headers.forEach((header, index) => {
            const val = values[index];
            row[header] = val === '' || val === 'NULL' ? null : val;
          });
          rows.push(row);
        }
      }

      for (const row of rows) {
        try {
          await db(tableName).insert(row);
          imported++;
        } catch (e: any) {
          errors.push(`Row ${imported + 1}: ${e.message}`);
        }
      }

      return { imported, errors };
    } catch (error: any) {
      throw new Error(`Import failed: ${error.message}`);
    }
  }
}

export const databaseService = new DatabaseService();
