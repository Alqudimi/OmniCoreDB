import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { History, Trash2, Play, Clock, CheckCircle, XCircle, RefreshCw } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { soundManager } from "@/lib/sounds";

interface QueryHistoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  connectionId: string;
  onExecuteQuery?: (query: string) => void;
}

export function QueryHistoryDialog({ open, onOpenChange, connectionId, onExecuteQuery }: QueryHistoryDialogProps) {
  const { toast } = useToast();

  const { data: history, isLoading, refetch } = useQuery<any[]>({
    queryKey: [`/api/connections/${connectionId}/query-history`],
    enabled: open && !!connectionId,
  });

  const clearHistoryMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest('DELETE', `/api/connections/${connectionId}/query-history`);
      return res.json();
    },
    onSuccess: () => {
      refetch();
      soundManager.success();
      toast({
        title: "Success",
        description: "Query history cleared successfully",
      });
    },
    onError: (error: Error) => {
      soundManager.error();
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const formatExecutionTime = (ms: number) => {
    if (ms < 1) return `${ms.toFixed(2)}ms`;
    if (ms < 1000) return `${ms.toFixed(0)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[80vh]" data-testid="dialog-query-history">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <History className="w-5 h-5" />
              Query History
            </DialogTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  refetch();
                  soundManager.click();
                }}
                data-testid="button-refresh-history"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  soundManager.click();
                  clearHistoryMutation.mutate();
                }}
                disabled={clearHistoryMutation.isPending || !history?.length}
                data-testid="button-clear-history"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="h-[500px] pr-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="text-muted-foreground">Loading history...</div>
            </div>
          ) : !history?.length ? (
            <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
              <History className="w-12 h-12 mb-2 opacity-50" />
              <p>No query history yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((item, index) => (
                <div
                  key={index}
                  className="p-4 border rounded-lg hover:bg-muted/50 transition-all card-hover"
                  data-testid={`query-history-item-${index}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {item.success ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500" />
                      )}
                      <Badge variant={item.success ? "default" : "destructive"}>
                        {item.success ? "Success" : "Failed"}
                      </Badge>
                      {item.success && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {formatExecutionTime(item.executionTime)}
                        </div>
                      )}
                      {item.rowCount !== undefined && item.rowCount !== null && (
                        <Badge variant="outline">{item.rowCount} rows</Badge>
                      )}
                    </div>
                    {onExecuteQuery && item.success && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          soundManager.click();
                          onExecuteQuery(item.query);
                          onOpenChange(false);
                        }}
                        data-testid={`button-rerun-${index}`}
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Run Again
                      </Button>
                    )}
                  </div>
                  <pre className="p-3 bg-muted rounded text-sm font-mono overflow-x-auto">
                    {item.query}
                  </pre>
                  {item.error && (
                    <div className="mt-2 p-2 bg-destructive/10 text-destructive text-sm rounded">
                      {item.error}
                    </div>
                  )}
                  <div className="mt-2 text-xs text-muted-foreground">
                    {new Date(item.timestamp).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
