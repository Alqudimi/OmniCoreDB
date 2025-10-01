import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Edit, Trash2, ChevronLeft, ChevronRight, ArrowUpDown, Search, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface DataGridProps {
  connectionId: string;
  tableName: string;
  onEditRow: (row: any) => void;
  onDeleteRow: (row: any) => void;
}

export function DataGrid({ connectionId, tableName, onEditRow, onDeleteRow }: DataGridProps) {
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState<string | null>(null);
  const [orderDirection, setOrderDirection] = useState<'asc' | 'desc'>('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('');
  const pageSize = 20;

  const { data: rowsData, isLoading } = useQuery<{ rows: any[]; total: number }>({
    queryKey: ['/api/connections', connectionId, 'tables', tableName, 'rows', page, orderBy, orderDirection, activeFilter],
    queryFn: async () => {
      const params = new URLSearchParams({
        limit: pageSize.toString(),
        offset: (page * pageSize).toString(),
      });
      
      if (orderBy) {
        params.append('orderBy', orderBy);
        params.append('orderDirection', orderDirection);
      }
      
      if (activeFilter) {
        params.append('search', activeFilter);
      }
      
      const res = await fetch(`/api/connections/${connectionId}/tables/${tableName}/rows?${params}`);
      if (!res.ok) throw new Error('Failed to fetch rows');
      return res.json();
    },
    enabled: !!connectionId && !!tableName,
  });

  const { data: columns } = useQuery<any[]>({
    queryKey: ['/api/connections', connectionId, 'tables', tableName, 'columns'],
    enabled: !!connectionId && !!tableName,
  });

  const handleSort = (columnName: string) => {
    if (orderBy === columnName) {
      setOrderDirection(orderDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setOrderBy(columnName);
      setOrderDirection('asc');
    }
  };

  const handleSearch = () => {
    setActiveFilter(searchTerm);
    setPage(0); // Reset to first page when filtering
  };

  const handleClearFilter = () => {
    setSearchTerm('');
    setActiveFilter('');
    setPage(0);
  };

  const rows = rowsData?.rows || [];
  const total = rowsData?.total || 0;
  const totalPages = Math.ceil(total / pageSize);

  if (isLoading) {
    return (
      <div className="flex-1 p-4">
        <Skeleton className="h-full w-full" />
      </div>
    );
  }

  if (!columns || columns.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        No data available
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Filter Bar */}
      <div className="p-3 border-b border-border bg-card">
        <div className="flex items-center gap-2">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Search across all columns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
              className="pl-9 pr-9"
              data-testid="input-filter-search"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                onClick={handleClearFilter}
                data-testid="button-clear-filter"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
          <Button
            onClick={handleSearch}
            disabled={!searchTerm || searchTerm === activeFilter}
            data-testid="button-apply-filter"
          >
            <Search className="mr-2 h-4 w-4" />
            Filter
          </Button>
          {activeFilter && (
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <span>Filtering: "{activeFilter}"</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="min-w-full inline-block">
          <table className="w-full border-collapse">
            <thead className="sticky top-0 z-10 bg-muted">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold border-b-2 border-border whitespace-nowrap">
                  <Checkbox data-testid="checkbox-select-all" />
                </th>
                {columns.map((column) => (
                  <th
                    key={column.name}
                    className="text-left px-4 py-3 text-xs font-semibold border-b-2 border-border whitespace-nowrap"
                  >
                    <div
                      className="flex items-center gap-2 cursor-pointer hover:text-primary group"
                      onClick={() => handleSort(column.name)}
                      data-testid={`column-header-${column.name}`}
                    >
                      {column.primaryKey && (
                        <span className="text-primary">🔑</span>
                      )}
                      <span>{column.name}</span>
                      <ArrowUpDown className="h-3 w-3 text-muted-foreground group-hover:text-primary" />
                    </div>
                  </th>
                ))}
                <th className="text-left px-4 py-3 text-xs font-semibold border-b-2 border-border whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr
                  key={idx}
                  className="border-b border-border hover:bg-accent/50 transition-all group"
                  data-testid={`row-${idx}`}
                >
                  <td className="px-4 py-2 text-sm">
                    <Checkbox />
                  </td>
                  {columns.map((column) => (
                    <td
                      key={column.name}
                      className={`px-4 py-2 text-sm ${
                        column.type.toLowerCase().includes('int') || 
                        column.type.toLowerCase().includes('decimal')
                          ? 'font-mono'
                          : ''
                      } max-w-xs truncate`}
                      title={String(row[column.name])}
                      data-testid={`cell-${column.name}-${idx}`}
                    >
                      {row[column.name] === null ? (
                        <span className="text-muted-foreground italic">NULL</span>
                      ) : (
                        String(row[column.name])
                      )}
                    </td>
                  ))}
                  <td className="px-4 py-2 text-sm">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 hover:bg-primary/10 text-primary"
                        onClick={() => onEditRow(row)}
                        data-testid={`button-edit-${idx}`}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 hover:bg-destructive/10 text-destructive"
                        onClick={() => onDeleteRow(row)}
                        data-testid={`button-delete-${idx}`}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="h-12 border-t border-border flex items-center justify-between px-4 bg-card">
        <div className="text-sm text-muted-foreground">
          <span>Showing </span>
          <span className="font-medium text-foreground">{page * pageSize + 1}</span>
          <span> to </span>
          <span className="font-medium text-foreground">
            {Math.min((page + 1) * pageSize, total)}
          </span>
          <span> of </span>
          <span className="font-medium text-foreground">{total.toLocaleString()}</span>
          <span> rows</span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
            data-testid="button-previous-page"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Previous
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i;
              } else if (page < 3) {
                pageNum = i;
              } else if (page > totalPages - 4) {
                pageNum = totalPages - 5 + i;
              } else {
                pageNum = page - 2 + i;
              }

              return (
                <Button
                  key={pageNum}
                  variant={page === pageNum ? "default" : "outline"}
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setPage(pageNum)}
                  data-testid={`button-page-${pageNum}`}
                >
                  {pageNum + 1}
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            data-testid="button-next-page"
          >
            Next
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
