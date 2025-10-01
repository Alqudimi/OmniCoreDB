import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { Activity, Zap, Clock, Database } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PerformanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  connectionId: string;
}

export function PerformanceDialog({ open, onOpenChange, connectionId }: PerformanceDialogProps) {
  const { data: metrics, isLoading: metricsLoading } = useQuery<any>({
    queryKey: [`/api/connections/${connectionId}/performance/metrics`],
    enabled: open && !!connectionId,
  });

  const { data: slowQueries, isLoading: slowLoading } = useQuery<any[]>({
    queryKey: [`/api/connections/${connectionId}/performance/slow-queries`],
    enabled: open && !!connectionId,
  });

  const formatTime = (ms: number) => {
    if (ms < 1000) return `${ms.toFixed(0)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-5xl max-h-[80vh]" data-testid="dialog-performance">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Performance Monitoring
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[600px] pr-4">
          <div className="space-y-6">
            {/* Performance Metrics */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
              {metricsLoading ? (
                <div className="text-muted-foreground">Loading metrics...</div>
              ) : metrics ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="card-hover">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Zap className="w-4 h-4 text-yellow-500" />
                        Avg Query Time
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{formatTime(metrics.avgQueryTime || 0)}</div>
                    </CardContent>
                  </Card>
                  <Card className="card-hover">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Database className="w-4 h-4 text-blue-500" />
                        Total Queries
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{metrics.totalQueries || 0}</div>
                    </CardContent>
                  </Card>
                  <Card className="card-hover">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Clock className="w-4 h-4 text-green-500" />
                        Cache Hit Rate
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{((metrics.cacheHitRate || 0) * 100).toFixed(1)}%</div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="text-muted-foreground">No metrics available</div>
              )}
            </div>

            {/* Slow Queries */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Slow Queries</h3>
              {slowLoading ? (
                <div className="text-muted-foreground">Loading slow queries...</div>
              ) : !slowQueries?.length ? (
                <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                  <Zap className="w-12 h-12 mb-2 opacity-50" />
                  <p>No slow queries detected</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {slowQueries.map((query, index) => (
                    <div
                      key={index}
                      className="p-4 border rounded-lg hover:bg-muted/50 transition-all card-hover"
                      data-testid={`slow-query-${index}`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="destructive">Slow</Badge>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {formatTime(query.executionTime)}
                          </div>
                          {query.rowCount !== undefined && (
                            <Badge variant="outline">{query.rowCount} rows</Badge>
                          )}
                        </div>
                      </div>
                      <pre className="p-3 bg-muted rounded text-sm font-mono overflow-x-auto">
                        {query.query}
                      </pre>
                      <div className="mt-2 text-xs text-muted-foreground">
                        {new Date(query.timestamp).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
