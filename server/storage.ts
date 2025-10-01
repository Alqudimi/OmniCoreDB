import { ConnectionConfig, InsertConnectionConfig } from "@shared/schema";
import { randomUUID } from "crypto";

// Type for creating connection - requires type field
type CreateConnectionInput = Required<Pick<InsertConnectionConfig, 'type'>> & Omit<InsertConnectionConfig, 'type'>;

export interface IStorage {
  getConnection(id: string): Promise<ConnectionConfig | undefined>;
  getAllConnections(): Promise<ConnectionConfig[]>;
  createConnection(config: CreateConnectionInput): Promise<ConnectionConfig>;
  deleteConnection(id: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private connections: Map<string, ConnectionConfig>;

  constructor() {
    this.connections = new Map();
  }

  async getConnection(id: string): Promise<ConnectionConfig | undefined> {
    return this.connections.get(id);
  }

  async getAllConnections(): Promise<ConnectionConfig[]> {
    return Array.from(this.connections.values());
  }

  async createConnection(insertConfig: CreateConnectionInput): Promise<ConnectionConfig> {
    const id = randomUUID();
    const config: ConnectionConfig = { ...insertConfig, id };
    this.connections.set(id, config);
    return config;
  }

  async deleteConnection(id: string): Promise<void> {
    this.connections.delete(id);
  }
}

export const storage = new MemStorage();
