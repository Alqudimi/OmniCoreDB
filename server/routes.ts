import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { databaseService } from "./services/database";
import { insertConnectionConfigSchema, exportFormatSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get all connections
  app.get("/api/connections", async (_req, res) => {
    try {
      const connections = await storage.getAllConnections();
      res.json(connections);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Create new connection
  app.post("/api/connections", async (req, res) => {
    try {
      const data = insertConnectionConfigSchema.parse(req.body);
      
      // Auto-detect database type if not provided
      let dbType = data.type;
      if (!dbType) {
        const detectedType = await databaseService.detectDatabaseType({
          connectionString: data.connectionString,
          filePath: data.filePath,
        });
        
        if (!detectedType) {
          return res.status(400).json({ message: "Could not detect database type. Please specify manually." });
        }
        
        dbType = detectedType;
      }
      
      // Create connection with guaranteed type
      const connectionData = { ...data, type: dbType };
      const config = await storage.createConnection(connectionData);
      
      // Try to connect
      await databaseService.connect(config);
      
      res.json(config);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Delete connection
  app.delete("/api/connections/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await databaseService.disconnect(id);
      await storage.deleteConnection(id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get tables for a connection
  app.get("/api/connections/:id/tables", async (req, res) => {
    try {
      const { id } = req.params;
      const tables = await databaseService.getTables(id);
      res.json(tables);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get columns for a table
  app.get("/api/connections/:id/tables/:tableName/columns", async (req, res) => {
    try {
      const { id, tableName } = req.params;
      const columns = await databaseService.getColumns(id, tableName);
      res.json(columns);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get indexes for a table
  app.get("/api/connections/:id/tables/:tableName/indexes", async (req, res) => {
    try {
      const { id, tableName } = req.params;
      const indexes = await databaseService.getIndexes(id, tableName);
      res.json(indexes);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get rows for a table
  app.get("/api/connections/:id/tables/:tableName/rows", async (req, res) => {
    try {
      const { id, tableName } = req.params;
      const { limit, offset, orderBy, orderDirection, search, ...where } = req.query;
      
      const options = {
        limit: limit ? parseInt(limit as string) : undefined,
        offset: offset ? parseInt(offset as string) : undefined,
        orderBy: orderBy as string | undefined,
        orderDirection: (orderDirection as 'asc' | 'desc') || undefined,
        search: search as string | undefined,
        where: Object.keys(where).length > 0 ? where : undefined,
      };
      
      const result = await databaseService.getRows(id, tableName, options);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Insert row
  app.post("/api/connections/:id/tables/:tableName/rows", async (req, res) => {
    try {
      const { id, tableName } = req.params;
      const data = req.body;
      const result = await databaseService.insertRow(id, tableName, data);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Update row
  app.patch("/api/connections/:id/tables/:tableName/rows/:rowId", async (req, res) => {
    try {
      const { id, tableName, rowId } = req.params;
      const data = req.body;
      const result = await databaseService.updateRow(id, tableName, rowId, data);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Delete row
  app.delete("/api/connections/:id/tables/:tableName/rows/:rowId", async (req, res) => {
    try {
      const { id, tableName, rowId } = req.params;
      await databaseService.deleteRow(id, tableName, rowId);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Execute custom query
  app.post("/api/connections/:id/query", async (req, res) => {
    try {
      const { id } = req.params;
      const { query } = req.body;
      
      if (!query || typeof query !== 'string') {
        return res.status(400).json({ message: "Query is required" });
      }
      
      const result = await databaseService.executeQuery(id, query);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Create table
  app.post("/api/connections/:id/tables", async (req, res) => {
    try {
      const { id } = req.params;
      const { tableName, columns } = req.body;
      
      if (!tableName || !columns || !Array.isArray(columns)) {
        return res.status(400).json({ message: "Table name and columns are required" });
      }
      
      await databaseService.createTable(id, tableName, columns);
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Drop table
  app.delete("/api/connections/:id/tables/:tableName", async (req, res) => {
    try {
      const { id, tableName } = req.params;
      await databaseService.dropTable(id, tableName);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Rename table
  app.patch("/api/connections/:id/tables/:tableName/rename", async (req, res) => {
    try {
      const { id, tableName } = req.params;
      const { newName } = req.body;
      
      if (!newName || typeof newName !== 'string') {
        return res.status(400).json({ message: "New table name is required" });
      }
      
      await databaseService.renameTable(id, tableName, newName);
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Truncate table
  app.post("/api/connections/:id/tables/:tableName/truncate", async (req, res) => {
    try {
      const { id, tableName } = req.params;
      await databaseService.truncateTable(id, tableName);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Add column
  app.post("/api/connections/:id/tables/:tableName/columns", async (req, res) => {
    try {
      const { id, tableName } = req.params;
      const { name, type, nullable, defaultValue } = req.body;
      
      if (!name || !type) {
        return res.status(400).json({ message: "Column name and type are required" });
      }
      
      await databaseService.addColumn(id, tableName, { name, type, nullable, defaultValue });
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Drop column
  app.delete("/api/connections/:id/tables/:tableName/columns/:columnName", async (req, res) => {
    try {
      const { id, tableName, columnName } = req.params;
      await databaseService.dropColumn(id, tableName, columnName);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Modify column
  app.patch("/api/connections/:id/tables/:tableName/columns/:columnName", async (req, res) => {
    try {
      const { id, tableName, columnName } = req.params;
      const { newName, type, nullable, defaultValue } = req.body;
      
      await databaseService.modifyColumn(id, tableName, columnName, {
        newName,
        type,
        nullable,
        defaultValue,
      });
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Export data
  app.get("/api/connections/:id/tables/:tableName/export", async (req, res) => {
    try {
      const { id, tableName } = req.params;
      const format = exportFormatSchema.parse(req.query.format || 'json');
      
      const data = await databaseService.exportData(id, tableName, format);
      
      const contentType = format === 'json' ? 'application/json' : 'text/csv';
      const filename = `${tableName}.${format}`;
      
      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.send(data);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Export SQL dump
  app.get("/api/connections/:id/export/sql", async (req, res) => {
    try {
      const { id } = req.params;
      const { tableName } = req.query;
      
      const data = await databaseService.exportSQLDump(id, tableName as string | undefined);
      
      const filename = tableName ? `${tableName}.sql` : 'database_dump.sql';
      
      res.setHeader('Content-Type', 'application/sql');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.send(data);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Import data
  app.post("/api/connections/:id/tables/:tableName/import", async (req, res) => {
    try {
      const { id, tableName } = req.params;
      const { format, data } = req.body;
      
      if (!format || !data) {
        return res.status(400).json({ message: "Format and data are required" });
      }
      
      if (!['csv', 'json'].includes(format)) {
        return res.status(400).json({ message: "Format must be 'csv' or 'json'" });
      }
      
      const result = await databaseService.importData(id, tableName, format, data);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
