import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { RefreshCw, Key, Link2, Ban, CheckCircle, Cog, Plus, Edit, Trash } from "lucide-react";
import { ColumnMetadata, IndexMetadata } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { ColumnManagementDialog } from "./column-management-dialog";
import { ConfirmationDialog } from "./confirmation-dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface TableStructureProps {
  connectionId: string;
  tableName: string;
}

export function TableStructure({ connectionId, tableName }: TableStructureProps) {
  const [columnDialogOpen, setColumnDialogOpen] = useState(false);
  const [columnDialogMode, setColumnDialogMode] = useState<'add' | 'modify'>('add');
  const [selectedColumn, setSelectedColumn] = useState<ColumnMetadata | undefined>();
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [columnToDelete, setColumnToDelete] = useState<string | null>(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: columns, isLoading: columnsLoading, refetch: refetchColumns } = useQuery<ColumnMetadata[]>({
    queryKey: ['/api/connections', connectionId, 'tables', tableName, 'columns'],
    enabled: !!connectionId && !!tableName,
  });

  const { data: indexes, isLoading: indexesLoading } = useQuery<IndexMetadata[]>({
    queryKey: ['/api/connections', connectionId, 'tables', tableName, 'indexes'],
    enabled: !!connectionId && !!tableName,
  });

  const deleteColumnMutation = useMutation({
    mutationFn: async (columnName: string) => {
      const res = await apiRequest('DELETE', `/api/connections/${connectionId}/tables/${tableName}/columns/${columnName}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/connections', connectionId, 'tables', tableName, 'columns'] });
      queryClient.invalidateQueries({ queryKey: ['/api/connections', connectionId, 'tables'] });
      toast({
        title: "Success",
        description: "Column deleted successfully",
      });
      setDeleteConfirmOpen(false);
      setColumnToDelete(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleAddColumn = () => {
    setColumnDialogMode('add');
    setSelectedColumn(undefined);
    setColumnDialogOpen(true);
  };

  const handleModifyColumn = (column: ColumnMetadata) => {
    setColumnDialogMode('modify');
    setSelectedColumn(column);
    setColumnDialogOpen(true);
  };

  const handleDeleteColumn = (columnName: string) => {
    setColumnToDelete(columnName);
    setDeleteConfirmOpen(true);
  };

  const confirmDeleteColumn = () => {
    if (columnToDelete) {
      deleteColumnMutation.mutate(columnToDelete);
    }
  };

  if (columnsLoading) {
    return (
      <div className="p-4 space-y-3">
        {[1, 2, 3, 4].map(i => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold">Table Structure</h3>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2"
            onClick={handleAddColumn}
            data-testid="button-add-column"
          >
            <Plus className="h-3 w-3 mr-1" />
            <span className="text-xs">Add</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={() => refetchColumns()}
            data-testid="button-refresh-structure"
          >
            <RefreshCw className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Columns Section */}
      <div className="space-y-3">
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
          Columns
        </div>

        {columns?.map((column) => (
          <div
            key={column.name}
            className="p-3 bg-background rounded-lg border border-border group hover:border-primary/50 transition-colors"
            data-testid={`column-info-${column.name}`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                {column.primaryKey && <Key className="h-3 w-3 text-primary" />}
                <span className="font-mono text-sm font-medium">{column.name}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className={`text-xs px-1.5 py-0.5 rounded font-mono ${
                  column.primaryKey
                    ? 'bg-primary/10 text-primary'
                    : 'bg-accent text-accent-foreground'
                }`}>
                  {column.type}
                </span>
                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity ml-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 hover:bg-primary/10 text-primary"
                    onClick={() => handleModifyColumn(column)}
                    data-testid={`button-modify-column-${column.name}`}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 hover:bg-destructive/10 text-destructive"
                    onClick={() => handleDeleteColumn(column.name)}
                    disabled={column.primaryKey}
                    data-testid={`button-delete-column-${column.name}`}
                  >
                    <Trash className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-1 text-xs text-muted-foreground">
              {column.primaryKey && (
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-success" />
                  <span>Primary Key</span>
                </div>
              )}
              {column.autoIncrement && (
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-success" />
                  <span>Auto Increment</span>
                </div>
              )}
              {!column.nullable && (
                <div className="flex items-center gap-2">
                  <Ban className="h-3 w-3 text-muted-foreground/50" />
                  <span>Not Null</span>
                </div>
              )}
              {column.nullable && (
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-muted-foreground/50" />
                  <span>Nullable</span>
                </div>
              )}
              {column.indexed && (
                <div className="flex items-center gap-2">
                  <Cog className="h-3 w-3 text-muted-foreground" />
                  <span>Indexed</span>
                </div>
              )}
              {column.foreignKey && (
                <>
                  <div className="flex items-center gap-2">
                    <Link2 className="h-3 w-3 text-muted-foreground" />
                    <span>Foreign Key</span>
                  </div>
                  <div className="flex items-center gap-2 pl-4">
                    <span>→</span>
                    <span className="font-mono">
                      {column.foreignKey.table}.{column.foreignKey.column}
                    </span>
                  </div>
                </>
              )}
              {column.defaultValue !== undefined && column.defaultValue !== null && (
                <div className="flex items-center gap-2">
                  <Cog className="h-3 w-3 text-muted-foreground" />
                  <span>Default: {String(column.defaultValue)}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Indexes Section */}
      <div className="mt-6">
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          Indexes
        </div>

        {indexesLoading ? (
          <Skeleton className="h-20 w-full" />
        ) : indexes && indexes.length > 0 ? (
          <div className="space-y-2">
            {indexes.map((index) => (
              <div
                key={index.name}
                className="p-3 bg-background rounded-lg border border-border"
                data-testid={`index-info-${index.name}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-sm font-medium">{index.name}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded ${
                    index.type === 'PRIMARY'
                      ? 'bg-primary/10 text-primary'
                      : 'bg-accent text-accent-foreground'
                  }`}>
                    {index.type}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground font-mono">
                  {index.columns.join(', ')}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-xs text-muted-foreground">
            No indexes available
          </div>
        )}
      </div>

      {/* Dialogs */}
      <ColumnManagementDialog
        open={columnDialogOpen}
        onOpenChange={setColumnDialogOpen}
        connectionId={connectionId}
        tableName={tableName}
        mode={columnDialogMode}
        column={selectedColumn}
      />

      <ConfirmationDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Delete Column"
        description={`Are you sure you want to delete the column "${columnToDelete}"? This action cannot be undone and may result in data loss.`}
        onConfirm={confirmDeleteColumn}
        confirmText="Delete Column"
        variant="danger"
      />
    </div>
  );
}
