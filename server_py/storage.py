from typing import Dict, Optional, List
from models import ConnectionConfig, InsertConnectionConfig, DatabaseType
import uuid


class MemStorage:
    """In-memory storage for database connections"""
    
    def __init__(self):
        self.connections: Dict[str, ConnectionConfig] = {}
    
    def get_connection(self, connection_id: str) -> Optional[ConnectionConfig]:
        """Get a connection by ID"""
        return self.connections.get(connection_id)
    
    def get_all_connections(self) -> List[ConnectionConfig]:
        """Get all connections"""
        return list(self.connections.values())
    
    def create_connection(self, config: InsertConnectionConfig, db_type: DatabaseType) -> ConnectionConfig:
        """Create a new connection"""
        connection_id = str(uuid.uuid4())
        connection = ConnectionConfig(
            id=connection_id,
            type=db_type,
            **config.model_dump(exclude_none=True, exclude={"type"})
        )
        self.connections[connection_id] = connection
        return connection
    
    def delete_connection(self, connection_id: str) -> None:
        """Delete a connection"""
        if connection_id in self.connections:
            del self.connections[connection_id]


# Global storage instance
storage = MemStorage()
