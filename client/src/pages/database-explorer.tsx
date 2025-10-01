import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { useState } from "react";
import {
  Database,
  Table as TableIcon,
  Plus,
  Search,
  RefreshCw,
  Download,
  Upload,
  Play,
  ChevronRight,
  Home,
  BarChart3,
  History,
  Save,
  Settings,
  Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DataGrid } from "@/components/data-grid";
import { TableStructure } from "@/components/table-structure";
import { QueryEditorDialog } from "@/components/query-editor-dialog";
import { soundManager } from "@/lib/sounds";
import { queryClient } from "@/lib/queryClient";

export default function DatabaseExplorer() {
  const { connectionId } = useParams<{ connectionId: string }>();
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showQueryEditor, setShowQueryEditor] = useState(false);

  const { data: connection } = useQuery<any>({
    queryKey: [`/api/connections`],
    select: (data) => data.find((c: any) => c.id === connectionId)
  });

  const { data: tables, isLoading: tablesLoading } = useQuery<any[]>({
    queryKey: [`/api/connections/${connectionId}/tables`],
    enabled: !!connectionId,
  });

  const { data: queryHistory } = useQuery<any[]>({
    queryKey: [`/api/connections/${connectionId}/query-history`],
    enabled: !!connectionId,
  });

  const filteredTables = tables?.filter(table =>
    table.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="icon" data-testid="button-home">
                  <Home className="w-5 h-5" />
                </Button>
              </Link>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, var(--theme-primary), var(--theme-accent))`
                  }}
                >
                  <Database className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">{connection?.name}</h1>
                  <p className="text-xs text-muted-foreground">{connection?.type}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="gap-2"
                onClick={() => {
                  queryClient.invalidateQueries({ queryKey: [`/api/connections/${connectionId}/tables`] });
                  soundManager.click();
                }}
                data-testid="button-refresh"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2"
                onClick={() => {
                  setShowQueryEditor(true);
                  soundManager.open();
                }}
                data-testid="button-query-editor"
              >
                <Play className="w-4 h-4" />
                SQL Query
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2"
                data-testid="button-export"
              >
                <Download className="w-4 h-4" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="col-span-3 space-y-6">
            {/* Quick Actions */}
            <Card className="p-4 glass">
              <h3 className="font-semibold mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2"
                  size="sm"
                  onClick={() => soundManager.click()}
                  data-testid="button-create-table"
                >
                  <Plus className="w-4 h-4" />
                  Create Table
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2"
                  size="sm"
                  onClick={() => soundManager.click()}
                  data-testid="button-import-data"
                >
                  <Upload className="w-4 h-4" />
                  Import Data
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2"
                  size="sm"
                  onClick={() => soundManager.click()}
                  data-testid="button-performance"
                >
                  <BarChart3 className="w-4 h-4" />
                  Performance
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2"
                  size="sm"
                  onClick={() => soundManager.click()}
                  data-testid="button-backups"
                >
                  <Save className="w-4 h-4" />
                  Backups
                </Button>
              </div>
            </Card>

            {/* Tables List */}
            <Card className="p-4 glass">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Tables</h3>
                <Badge variant="secondary">{tables?.length || 0}</Badge>
              </div>

              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search tables..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                  data-testid="input-search-tables"
                />
              </div>

              <div className="space-y-1 max-h-[500px] overflow-y-auto">
                {tablesLoading ? (
                  <div className="text-center py-8 text-muted-foreground">Loading...</div>
                ) : filteredTables && filteredTables.length > 0 ? (
                  filteredTables.map((table) => (
                    <button
                      key={table.name}
                      onClick={() => {
                        setSelectedTable(table.name);
                        soundManager.click();
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-all flex items-center gap-2 ${
                        selectedTable === table.name
                          ? 'bg-primary/10 text-primary'
                          : 'hover:bg-muted'
                      }`}
                      data-testid={`button-table-${table.name}`}
                    >
                      <TableIcon className="w-4 h-4" />
                      <span className="flex-1 truncate">{table.name}</span>
                      {table.rowCount !== undefined && (
                        <Badge variant="outline" className="text-xs">
                          {table.rowCount}
                        </Badge>
                      )}
                    </button>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No tables found
                  </div>
                )}
              </div>
            </Card>

            {/* Recent Queries */}
            {queryHistory && queryHistory.length > 0 && (
              <Card className="p-4 glass">
                <div className="flex items-center gap-2 mb-3">
                  <History className="w-4 h-4" />
                  <h3 className="font-semibold">Recent Queries</h3>
                </div>
                <div className="space-y-2">
                  {queryHistory.slice(0, 3).map((query: any, index: number) => (
                    <div
                      key={index}
                      className="p-2 rounded-lg bg-muted/50 text-xs"
                      data-testid={`query-history-${index}`}
                    >
                      <code className="text-muted-foreground truncate block">
                        {query.query.substring(0, 50)}...
                      </code>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={query.success ? "default" : "destructive"} className="text-xs">
                          {query.executionTime}ms
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Main Content */}
          <div className="col-span-9">
            {selectedTable ? (
              <Card className="p-6 glass">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold">{selectedTable}</h2>
                    <p className="text-sm text-muted-foreground">Manage table data and structure</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-2"
                      data-testid="button-table-settings"
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-2 text-destructive"
                      data-testid="button-drop-table"
                    >
                      <Trash2 className="w-4 h-4" />
                      Drop Table
                    </Button>
                  </div>
                </div>

                <Tabs defaultValue="data" className="w-full">
                  <TabsList className="mb-6">
                    <TabsTrigger value="data" data-testid="tab-data">Data</TabsTrigger>
                    <TabsTrigger value="structure" data-testid="tab-structure">Structure</TabsTrigger>
                    <TabsTrigger value="relationships" data-testid="tab-relationships">Relationships</TabsTrigger>
                    <TabsTrigger value="indexes" data-testid="tab-indexes">Indexes</TabsTrigger>
                  </TabsList>

                  <TabsContent value="data">
                    <DataGrid
                      connectionId={connectionId!}
                      tableName={selectedTable}
                    />
                  </TabsContent>

                  <TabsContent value="structure">
                    <TableStructure
                      connectionId={connectionId!}
                      tableName={selectedTable}
                    />
                  </TabsContent>

                  <TabsContent value="relationships">
                    <div className="text-center py-12 text-muted-foreground">
                      Relationship viewer coming soon
                    </div>
                  </TabsContent>

                  <TabsContent value="indexes">
                    <div className="text-center py-12 text-muted-foreground">
                      Index management coming soon
                    </div>
                  </TabsContent>
                </Tabs>
              </Card>
            ) : (
              <div className="text-center py-20">
                <div
                  className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, var(--theme-primary-light), var(--theme-accent))`
                  }}
                >
                  <TableIcon className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Select a Table</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Choose a table from the sidebar to view and manage its data, structure, and relationships.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Query Editor Dialog */}
      {showQueryEditor && (
        <QueryEditorDialog
          connectionId={connectionId!}
          open={showQueryEditor}
          onOpenChange={(open) => {
            setShowQueryEditor(open);
            if (!open) soundManager.close();
          }}
        />
      )}
    </div>
  );
}
