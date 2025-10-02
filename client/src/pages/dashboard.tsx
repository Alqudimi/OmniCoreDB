import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ConnectionDialog } from "@/components/connection-dialog";
import { TableList } from "@/components/table-list";
import { DataGrid } from "@/components/data-grid";
import { TableStructure } from "@/components/table-structure";
import { InsertRowDialog } from "@/components/insert-row-dialog";
import { DeleteDialog } from "@/components/delete-dialog";
import { QueryEditorDialog } from "@/components/query-editor-dialog";
import { TableManagementDialog } from "@/components/table-management-dialog";
import { ImportDialog } from "@/components/import-dialog";
import { ConfirmationDialog } from "@/components/confirmation-dialog";
import { useTheme } from "@/components/theme-provider";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { 
  Database, 
  Plus, 
  Terminal, 
  Download, 
  Moon, 
  Sun, 
  Settings,
  Table as TableIcon,
  Upload,
  MoreVertical,
  Edit,
  Trash,
  FileJson,
  FileText,
  FileCode
} from "lucide-react";
import { Connection, ColumnMetadata, TableMetadata } from "@/lib/types";

export default function Dashboard() {
  const [connectionDialogOpen, setConnectionDialogOpen] = useState(false);
  const [insertRowDialogOpen, setInsertRowDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [queryEditorOpen, setQueryEditorOpen] = useState(false);
  const [tableManagementDialogOpen, setTableManagementDialogOpen] = useState(false);
  const [tableManagementMode, setTableManagementMode] = useState<'create' | 'rename'>('create');
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [deleteTableConfirmOpen, setDeleteTableConfirmOpen] = useState(false);
  const [tableToDelete, setTableToDelete] = useState<string | null>(null);
  const [truncateTableConfirmOpen, setTruncateTableConfirmOpen] = useState(false);
  const [selectedConnection, setSelectedConnection] = useState<string | null>(null);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [rowToDelete, setRowToDelete] = useState<any>(null);
  const [rowToEdit, setRowToEdit] = useState<any>(null);
  
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: connections } = useQuery<Connection[]>({
    queryKey: ['/api/connections'],
  });

  const { data: tables } = useQuery<TableMetadata[]>({
    queryKey: ['/api/connections', selectedConnection, 'tables'],
    enabled: !!selectedConnection,
  });

  const { data: columns } = useQuery<ColumnMetadata[]>({
    queryKey: ['/api/connections', selectedConnection, 'tables', selectedTable, 'columns'],
    enabled: !!selectedConnection && !!selectedTable,
  });

  // Auto-select first connection if available
  if (connections && connections.length > 0 && !selectedConnection) {
    setSelectedConnection(connections[0].id);
  }

  const currentConnection = connections?.find(c => c.id === selectedConnection);
  const currentTable = tables?.find((t: any) => t.name === selectedTable);
  const primaryKeyColumn = columns?.find(c => c.primaryKey)?.name || 'id';

  const deleteTableMutation = useMutation({
    mutationFn: async (tableName: string) => {
      const res = await apiRequest('DELETE', `/api/connections/${selectedConnection}/tables/${tableName}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/connections', selectedConnection, 'tables'] });
      toast({
        title: "Success",
        description: "Table deleted successfully",
      });
      if (selectedTable === tableToDelete) {
        setSelectedTable(null);
      }
      setDeleteTableConfirmOpen(false);
      setTableToDelete(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const truncateTableMutation = useMutation({
    mutationFn: async (tableName: string) => {
      const res = await apiRequest('POST', `/api/connections/${selectedConnection}/tables/${tableName}/truncate`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/connections', selectedConnection, 'tables'] });
      queryClient.invalidateQueries({ queryKey: ['/api/connections', selectedConnection, 'tables', selectedTable, 'rows'] });
      toast({
        title: "Success",
        description: "Table truncated successfully",
      });
      setTruncateTableConfirmOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleEditRow = (row: any) => {
    setRowToEdit(row);
    setInsertRowDialogOpen(true);
  };

  const handleDeleteRow = (row: any) => {
    setRowToDelete(row);
    setDeleteDialogOpen(true);
  };

  const handleCreateTable = () => {
    setTableManagementMode('create');
    setTableManagementDialogOpen(true);
  };

  const handleRenameTable = () => {
    setTableManagementMode('rename');
    setTableManagementDialogOpen(true);
  };

  const handleDeleteTable = () => {
    setTableToDelete(selectedTable);
    setDeleteTableConfirmOpen(true);
  };

  const confirmDeleteTable = () => {
    if (tableToDelete) {
      deleteTableMutation.mutate(tableToDelete);
    }
  };

  const handleTruncateTable = () => {
    setTruncateTableConfirmOpen(true);
  };

  const confirmTruncateTable = () => {
    if (selectedTable) {
      truncateTableMutation.mutate(selectedTable);
    }
  };

  const handleExport = async (format: 'csv' | 'json' | 'sql') => {
    if (!selectedConnection || !selectedTable) return;
    
    try {
      let url: string;
      let filename: string;

      if (format === 'sql') {
        url = `/api/connections/${selectedConnection}/export/sql?tableName=${selectedTable}`;
        filename = `${selectedTable}.sql`;
      } else {
        url = `/api/connections/${selectedConnection}/tables/${selectedTable}/export?format=${format}`;
        filename = `${selectedTable}.${format}`;
      }

      const res = await fetch(url);
      
      if (!res.ok) throw new Error('Export failed');
      
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(blobUrl);

      toast({
        title: "Success",
        description: `Exported ${selectedTable} as ${format.toUpperCase()}`,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export data",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background text-foreground">
      {/* Top Bar */}
      <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4 flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <Database className="text-primary text-xl" />
            <h1 className="text-lg font-semibold">Omni Core DB Manager</h1>
          </div>

          {currentConnection && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-md text-sm">
              <div className="h-2 w-2 rounded-full bg-success"></div>
              <span className="font-mono text-xs">{currentConnection.database || currentConnection.name || 'Database'}</span>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground text-xs">{currentConnection.type}</span>
              {currentConnection.host && (
                <>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-muted-foreground text-xs">{currentConnection.host}:{currentConnection.port}</span>
                </>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => setQueryEditorOpen(true)}
            disabled={!selectedConnection}
            data-testid="button-sql-query"
          >
            <Terminal className="mr-2 h-4 w-4" />
            SQL Query
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondary"
                disabled={!selectedTable}
                data-testid="button-export-menu"
              >
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleExport('json')} data-testid="menu-export-json">
                <FileJson className="mr-2 h-4 w-4" />
                Export as JSON
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('csv')} data-testid="menu-export-csv">
                <FileText className="mr-2 h-4 w-4" />
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('sql')} data-testid="menu-export-sql">
                <FileCode className="mr-2 h-4 w-4" />
                Export as SQL Dump
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="secondary"
            onClick={() => setImportDialogOpen(true)}
            disabled={!selectedTable}
            data-testid="button-import"
          >
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            data-testid="button-theme-toggle"
          >
            {theme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Button>

          <Button variant="ghost" size="icon" data-testid="button-settings">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 border-r border-border bg-card flex flex-col">
          <div className="p-4 border-b border-border space-y-2">
            <Button
              className="w-full"
              onClick={() => setConnectionDialogOpen(true)}
              data-testid="button-new-connection"
            >
              <Plus className="mr-2 h-4 w-4" />
              New Connection
            </Button>
            <Button
              className="w-full"
              variant="outline"
              onClick={handleCreateTable}
              disabled={!selectedConnection}
              data-testid="button-create-table"
            >
              <TableIcon className="mr-2 h-4 w-4" />
              Create Table
            </Button>
          </div>

          {selectedConnection ? (
            <TableList
              connectionId={selectedConnection}
              selectedTable={selectedTable}
              onSelectTable={setSelectedTable}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center p-4 text-center text-muted-foreground text-sm">
              Create a connection to get started
            </div>
          )}
        </aside>

        {/* Content Area */}
        <main className="flex-1 flex flex-col overflow-hidden bg-background">
          {selectedTable ? (
            <>
              {/* Table Toolbar */}
              <div className="h-14 border-b border-border flex items-center justify-between px-4 bg-card">
                <div className="flex items-center gap-3">
                  <h2 className="text-base font-semibold flex items-center gap-2">
                    <TableIcon className="text-primary" />
                    <span>{selectedTable}</span>
                  </h2>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{currentTable?.rowCount?.toLocaleString()} rows</span>
                    <span>•</span>
                    <span>{currentTable?.columnCount} columns</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => {
                      setRowToEdit(null);
                      setInsertRowDialogOpen(true);
                    }}
                    data-testid="button-insert-row"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Insert Row
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" data-testid="button-table-options">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={handleRenameTable} data-testid="menu-rename-table">
                        <Edit className="mr-2 h-4 w-4" />
                        Rename Table
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleTruncateTable} data-testid="menu-truncate-table">
                        <Trash className="mr-2 h-4 w-4" />
                        Truncate Table
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={handleDeleteTable} 
                        className="text-destructive focus:text-destructive"
                        data-testid="menu-delete-table"
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete Table
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Data Grid */}
              <DataGrid
                connectionId={selectedConnection!}
                tableName={selectedTable}
                onEditRow={handleEditRow}
                onDeleteRow={handleDeleteRow}
              />
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              {selectedConnection ? 'Select a table to view data' : 'Create a connection to get started'}
            </div>
          )}
        </main>

        {/* Details Panel */}
        {selectedTable && (
          <aside className="w-80 border-l border-border bg-card overflow-y-auto">
            <TableStructure
              connectionId={selectedConnection!}
              tableName={selectedTable}
            />
          </aside>
        )}
      </div>

      {/* Dialogs */}
      <ConnectionDialog
        open={connectionDialogOpen}
        onOpenChange={setConnectionDialogOpen}
      />

      {selectedConnection && selectedTable && (
        <>
          <InsertRowDialog
            open={insertRowDialogOpen}
            onOpenChange={(open) => {
              setInsertRowDialogOpen(open);
              if (!open) setRowToEdit(null);
            }}
            connectionId={selectedConnection}
            tableName={selectedTable}
            editRow={rowToEdit}
          />

          <DeleteDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            connectionId={selectedConnection}
            tableName={selectedTable}
            row={rowToDelete}
            primaryKeyColumn={primaryKeyColumn}
          />
        </>
      )}

      {selectedConnection && (
        <QueryEditorDialog
          open={queryEditorOpen}
          onOpenChange={setQueryEditorOpen}
          connectionId={selectedConnection}
        />
      )}

      {selectedConnection && (
        <TableManagementDialog
          open={tableManagementDialogOpen}
          onOpenChange={setTableManagementDialogOpen}
          connectionId={selectedConnection}
          mode={tableManagementMode}
          currentTableName={selectedTable || undefined}
        />
      )}

      {selectedConnection && selectedTable && (
        <ImportDialog
          open={importDialogOpen}
          onOpenChange={setImportDialogOpen}
          connectionId={selectedConnection}
          tableName={selectedTable}
        />
      )}

      <ConfirmationDialog
        open={deleteTableConfirmOpen}
        onOpenChange={setDeleteTableConfirmOpen}
        title="Delete Table"
        description={`Are you sure you want to delete the table "${tableToDelete}"? This action cannot be undone and all data will be permanently lost.`}
        onConfirm={confirmDeleteTable}
        confirmText="Delete Table"
        variant="danger"
      />

      <ConfirmationDialog
        open={truncateTableConfirmOpen}
        onOpenChange={setTruncateTableConfirmOpen}
        title="Truncate Table"
        description={`Are you sure you want to truncate the table "${selectedTable}"? All rows will be deleted but the table structure will remain. This action cannot be undone.`}
        onConfirm={confirmTruncateTable}
        confirmText="Truncate Table"
        variant="warning"
      />
    </div>
  );
}
