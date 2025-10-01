import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, RefreshCw, Table as TableIcon, Eye } from "lucide-react";
import { TableMetadata } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

interface TableListProps {
  connectionId: string;
  selectedTable: string | null;
  onSelectTable: (tableName: string) => void;
}

export function TableList({ connectionId, selectedTable, onSelectTable }: TableListProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: tables, isLoading, refetch } = useQuery<TableMetadata[]>({
    queryKey: ['/api/connections', connectionId, 'tables'],
    enabled: !!connectionId,
  });

  const filteredTables = tables?.filter(table => 
    table.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Tables
          </h3>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={() => refetch()}
            data-testid="button-refresh-tables"
          >
            <RefreshCw className="h-3 w-3" />
          </Button>
        </div>

        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-3 w-3" />
          <Input
            type="text"
            placeholder="Search tables..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-8 text-sm"
            data-testid="input-search-tables"
          />
        </div>

        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map(i => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : filteredTables.length === 0 ? (
          <div className="text-center py-8 text-sm text-muted-foreground">
            {searchQuery ? 'No tables found' : 'No tables available'}
          </div>
        ) : (
          <div className="space-y-1">
            {filteredTables.map((table) => (
              <div
                key={table.name}
                className={`group px-3 py-2 rounded-md cursor-pointer transition-all ${
                  selectedTable === table.name
                    ? 'bg-accent'
                    : 'hover:bg-accent'
                }`}
                onClick={() => onSelectTable(table.name)}
                data-testid={`table-item-${table.name}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <TableIcon className={`h-3 w-3 ${
                      selectedTable === table.name ? 'text-primary' : 'text-muted-foreground'
                    }`} />
                    <span className={`text-sm font-medium truncate ${
                      selectedTable === table.name ? 'text-primary' : ''
                    }`}>
                      {table.name}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                    {table.rowCount.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Views Section - Currently Empty */}
      <div className="mt-6">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
          Views
        </h3>
        <div className="text-center py-4 text-xs text-muted-foreground">
          No views available
        </div>
      </div>
    </div>
  );
}
