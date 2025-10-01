from typing import Dict, Optional, List
from models import (ConnectionConfig, InsertConnectionConfig, DatabaseType, QueryHistory,
                   SavedQuery, InsertSavedQuery, SlowQuery, PerformanceMetrics, 
                   DataValidation, BackupMetadata)
import uuid
from datetime import datetime


class MemStorage:
    """In-memory storage for database connections and query history"""
    
    def __init__(self):
        self.connections: Dict[str, ConnectionConfig] = {}
        self.query_history: Dict[str, QueryHistory] = {}
        self.query_history_by_connection: Dict[str, List[str]] = {}
        self.saved_queries: Dict[str, SavedQuery] = {}
        self.saved_queries_by_connection: Dict[str, List[str]] = {}
        self.slow_queries: Dict[str, SlowQuery] = {}
        self.slow_queries_by_connection: Dict[str, List[str]] = {}
        self.performance_metrics: Dict[str, List[PerformanceMetrics]] = {}
        self.data_validations: Dict[str, DataValidation] = {}
        self.validations_by_connection: Dict[str, List[str]] = {}
        self.backups: Dict[str, BackupMetadata] = {}
        self.backups_by_connection: Dict[str, List[str]] = {}
    
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
    
    # Saved Queries methods
    def create_saved_query(self, connection_id: str, query_data: InsertSavedQuery) -> SavedQuery:
        """Create a saved query"""
        query_id = str(uuid.uuid4())
        now = datetime.utcnow().isoformat()
        saved_query = SavedQuery(
            id=query_id,
            connectionId=connection_id,
            createdAt=now,
            updatedAt=now,
            **query_data.model_dump()
        )
        self.saved_queries[query_id] = saved_query
        
        if connection_id not in self.saved_queries_by_connection:
            self.saved_queries_by_connection[connection_id] = []
        self.saved_queries_by_connection[connection_id].append(query_id)
        
        return saved_query
    
    def get_saved_queries(self, connection_id: str) -> List[SavedQuery]:
        """Get all saved queries for a connection"""
        if connection_id not in self.saved_queries_by_connection:
            return []
        query_ids = self.saved_queries_by_connection[connection_id]
        return [self.saved_queries[qid] for qid in query_ids if qid in self.saved_queries]
    
    def get_saved_query(self, query_id: str) -> Optional[SavedQuery]:
        """Get a saved query by ID"""
        return self.saved_queries.get(query_id)
    
    def update_saved_query(self, query_id: str, query_data: InsertSavedQuery) -> SavedQuery:
        """Update a saved query"""
        if query_id not in self.saved_queries:
            raise ValueError("Saved query not found")
        saved_query = self.saved_queries[query_id]
        updated_query = SavedQuery(
            id=saved_query.id,
            connectionId=saved_query.connectionId,
            createdAt=saved_query.createdAt,
            updatedAt=datetime.utcnow().isoformat(),
            **query_data.model_dump()
        )
        self.saved_queries[query_id] = updated_query
        return updated_query
    
    def delete_saved_query(self, query_id: str) -> None:
        """Delete a saved query"""
        if query_id in self.saved_queries:
            saved_query = self.saved_queries[query_id]
            connection_id = saved_query.connectionId
            del self.saved_queries[query_id]
            if connection_id in self.saved_queries_by_connection:
                self.saved_queries_by_connection[connection_id].remove(query_id)
    
    # Slow Queries methods
    def add_slow_query(self, connection_id: str, query: str, execution_time: float, row_count: Optional[int] = None) -> SlowQuery:
        """Add a slow query"""
        query_id = str(uuid.uuid4())
        slow_query = SlowQuery(
            id=query_id,
            connectionId=connection_id,
            query=query,
            executionTime=execution_time,
            timestamp=datetime.utcnow().isoformat(),
            rowCount=row_count
        )
        self.slow_queries[query_id] = slow_query
        
        if connection_id not in self.slow_queries_by_connection:
            self.slow_queries_by_connection[connection_id] = []
        self.slow_queries_by_connection[connection_id].append(query_id)
        
        # Keep only last 100 slow queries per connection
        if len(self.slow_queries_by_connection[connection_id]) > 100:
            old_id = self.slow_queries_by_connection[connection_id].pop(0)
            if old_id in self.slow_queries:
                del self.slow_queries[old_id]
        
        return slow_query
    
    def get_slow_queries(self, connection_id: str, limit: int = 50) -> List[SlowQuery]:
        """Get slow queries for a connection"""
        if connection_id not in self.slow_queries_by_connection:
            return []
        query_ids = self.slow_queries_by_connection[connection_id]
        recent_ids = query_ids[-limit:][::-1]
        return [self.slow_queries[qid] for qid in recent_ids if qid in self.slow_queries]
    
    # Performance Metrics methods
    def add_performance_metrics(self, metrics: PerformanceMetrics) -> None:
        """Add performance metrics"""
        connection_id = metrics.connectionId
        if connection_id not in self.performance_metrics:
            self.performance_metrics[connection_id] = []
        self.performance_metrics[connection_id].append(metrics)
        
        # Keep only last 100 metric entries per connection
        if len(self.performance_metrics[connection_id]) > 100:
            self.performance_metrics[connection_id].pop(0)
    
    def get_performance_metrics(self, connection_id: str, limit: int = 50) -> List[PerformanceMetrics]:
        """Get performance metrics for a connection"""
        if connection_id not in self.performance_metrics:
            return []
        return self.performance_metrics[connection_id][-limit:]
    
    # Data Validation methods
    def create_validation(self, connection_id: str, validation: DataValidation) -> DataValidation:
        """Create a data validation rule"""
        validation_id = str(uuid.uuid4())
        validation_obj = DataValidation(
            id=validation_id,
            connectionId=connection_id,
            **validation.model_dump(exclude={'id'})
        )
        self.data_validations[validation_id] = validation_obj
        
        if connection_id not in self.validations_by_connection:
            self.validations_by_connection[connection_id] = []
        self.validations_by_connection[connection_id].append(validation_id)
        
        return validation_obj
    
    def get_validations(self, connection_id: str) -> List[DataValidation]:
        """Get all validations for a connection"""
        if connection_id not in self.validations_by_connection:
            return []
        validation_ids = self.validations_by_connection[connection_id]
        return [self.data_validations[vid] for vid in validation_ids if vid in self.data_validations]
    
    def delete_validation(self, validation_id: str) -> None:
        """Delete a validation rule"""
        if validation_id in self.data_validations:
            validation = self.data_validations[validation_id]
            connection_id = validation.connectionId
            del self.data_validations[validation_id]
            if connection_id in self.validations_by_connection:
                self.validations_by_connection[connection_id].remove(validation_id)
    
    # Backup methods
    def create_backup_metadata(self, connection_id: str, filename: str, format: str, 
                               size: int, tables: List[str]) -> BackupMetadata:
        """Create backup metadata"""
        backup_id = str(uuid.uuid4())
        backup = BackupMetadata(
            id=backup_id,
            connectionId=connection_id,
            filename=filename,
            format=format,
            size=size,
            timestamp=datetime.utcnow().isoformat(),
            tables=tables,
            status="completed"
        )
        self.backups[backup_id] = backup
        
        if connection_id not in self.backups_by_connection:
            self.backups_by_connection[connection_id] = []
        self.backups_by_connection[connection_id].append(backup_id)
        
        return backup
    
    def get_backups(self, connection_id: str) -> List[BackupMetadata]:
        """Get all backups for a connection"""
        if connection_id not in self.backups_by_connection:
            return []
        backup_ids = self.backups_by_connection[connection_id]
        return [self.backups[bid] for bid in backup_ids if bid in self.backups][::-1]


# Global storage instance
storage = MemStorage()
