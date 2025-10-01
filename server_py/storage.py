from typing import Dict, Optional, List
from models import ConnectionConfig, InsertConnectionConfig, DatabaseType, QueryHistory
import uuid
from datetime import datetime


class MemStorage:
    """In-memory storage for database connections and query history"""
    
    def __init__(self):
        self.connections: Dict[str, ConnectionConfig] = {}
        self.query_history: Dict[str, QueryHistory] = {}
        self.query_history_by_connection: Dict[str, List[str]] = {}
    
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
        # Also delete query history for this connection
        if connection_id in self.query_history_by_connection:
            query_ids = self.query_history_by_connection[connection_id]
            for query_id in query_ids:
                if query_id in self.query_history:
                    del self.query_history[query_id]
            del self.query_history_by_connection[connection_id]
    
    def add_query_history(self, connection_id: str, query: str, execution_time: float, 
                          success: bool, row_count: Optional[int] = None, error: Optional[str] = None) -> QueryHistory:
        """Add a query to history"""
        query_id = str(uuid.uuid4())
        history = QueryHistory(
            id=query_id,
            connectionId=connection_id,
            query=query,
            timestamp=datetime.utcnow().isoformat(),
            executionTime=execution_time,
            success=success,
            rowCount=row_count,
            error=error
        )
        self.query_history[query_id] = history
        
        if connection_id not in self.query_history_by_connection:
            self.query_history_by_connection[connection_id] = []
        self.query_history_by_connection[connection_id].append(query_id)
        
        return history
    
    def get_query_history(self, connection_id: str, limit: int = 50) -> List[QueryHistory]:
        """Get query history for a connection"""
        if connection_id not in self.query_history_by_connection:
            return []
        
        query_ids = self.query_history_by_connection[connection_id]
        # Return most recent queries first
        recent_ids = query_ids[-limit:][::-1]
        return [self.query_history[qid] for qid in recent_ids if qid in self.query_history]
    
    def clear_query_history(self, connection_id: str) -> None:
        """Clear query history for a connection"""
        if connection_id in self.query_history_by_connection:
            query_ids = self.query_history_by_connection[connection_id]
            for query_id in query_ids:
                if query_id in self.query_history:
                    del self.query_history[query_id]
            self.query_history_by_connection[connection_id] = []


# Global storage instance
storage = MemStorage()
