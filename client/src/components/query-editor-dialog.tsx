import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Play, X, Download, CheckCircle, XCircle } from "lucide-react";
import { QueryResult } from "@/lib/types";

interface QueryEditorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  connectionId: string;
}

export function QueryEditorDialog({ open, onOpenChange, connectionId }: QueryEditorDialogProps) {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<QueryResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const executeMutation = useMutation({
    mutationFn: async (sql: string) => {
      const res = await apiRequest('POST', `/api/connections/${connectionId}/query`, { query: sql });
      return res.json();
    },
    onSuccess: (data) => {
      setResult(data);
      setError(null);
      toast({
        title: "Query Executed",
        description: `${data.rowCount} rows returned in ${data.executionTime}ms`,
      });
    },
    onError: (err: Error) => {
      setError(err.message);
      setResult(null);
      toast({
        title: "Query Failed",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  const handleExecute = () => {
    if (!query.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a SQL query",
        variant: "destructive",
      });
      return;
    }
    executeMutation.mutate(query);
  };

  const handleExport = () => {
    if (!result) return;
    
    const dataStr = JSON.stringify(result.rows, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'query-result.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-5xl max-h-[90vh] flex flex-col" data-testid="dialog-query-editor">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>SQL Query Editor</DialogTitle>
              <DialogDescription>Execute custom SQL queries</DialogDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={handleExecute}
                disabled={executeMutation.isPending}
                data-testid="button-execute-query"
              >
                {executeMutation.isPending ? (
                  'Executing...'
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Execute
                    <kbd className="ml-2 px-1.5 py-0.5 bg-primary-foreground/20 rounded text-xs font-mono">
                      Ctrl+Enter
                    </kbd>
                  </>
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onOpenChange(false)}
                data-testid="button-close"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 flex flex-col overflow-hidden gap-4">
          {/* Query Editor */}
          <div className="flex-shrink-0">
            <Textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="-- Enter your SQL query here&#10;SELECT * FROM products WHERE price > 100;"
              className="font-mono text-sm min-h-[150px] resize-none"
              onKeyDown={(e) => {
                if (e.ctrlKey && e.key === 'Enter') {
                  handleExecute();
                }
              }}
              data-testid="textarea-query"
            />
          </div>

          {/* Results Section */}
          <div className="flex-1 border-t border-border flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 bg-muted border-b border-border">
              <div className="flex items-center gap-3">
                <h3 className="text-sm font-semibold">Results</h3>
                {result && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CheckCircle className="h-3 w-3 text-success" />
                    <span>Query executed successfully</span>
                    <span>•</span>
                    <span>{result.rowCount} rows returned</span>
                    <span>•</span>
                    <span>{result.executionTime}ms</span>
                  </div>
                )}
                {error && (
                  <div className="flex items-center gap-2 text-xs text-destructive">
                    <XCircle className="h-3 w-3" />
                    <span>Query failed</span>
                  </div>
                )}
              </div>
              {result && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleExport}
                  data-testid="button-export-results"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              )}
            </div>

            <div className="flex-1 overflow-auto p-4">
              {error ? (
                <div className="text-sm text-destructive font-mono p-4 bg-destructive/10 rounded-lg">
                  {error}
                </div>
              ) : result ? (
                <table className="w-full border-collapse text-sm">
                  <thead className="sticky top-0 bg-muted">
                    <tr>
                      {result.columns.map((col) => (
                        <th
                          key={col}
                          className="text-left px-3 py-2 text-xs font-semibold border-b-2 border-border"
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {result.rows.map((row, idx) => (
                      <tr
                        key={idx}
                        className="border-b border-border hover:bg-accent/50"
                        data-testid={`result-row-${idx}`}
                      >
                        {result.columns.map((col) => (
                          <td key={col} className="px-3 py-2 font-mono">
                            {row[col] === null ? (
                              <span className="text-muted-foreground italic">NULL</span>
                            ) : (
                              String(row[col])
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                  Execute a query to see results
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
