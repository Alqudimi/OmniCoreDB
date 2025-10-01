import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Database, HardDrive, Key, Link2, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { soundManager } from "@/lib/sounds";

interface TableAnalysisDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  connectionId: string;
  tableName: string;
}

export function TableAnalysisDialog({ open, onOpenChange, connectionId, tableName }: TableAnalysisDialogProps) {
  const { data: analysis, isLoading, refetch } = useQuery<any>({
    queryKey: [`/api/connections/${connectionId}/tables/${tableName}/analyze`],
    enabled: open && !!connectionId && !!tableName,
  });

  const formatBytes = (bytes: number) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[80vh]" data-testid="dialog-table-analysis">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Table Analysis: {tableName}
            </DialogTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                refetch();
                soundManager.click();
              }}
              disabled={isLoading}
              data-testid="button-refresh-analysis"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </DialogHeader>

        <ScrollArea className="h-[600px] pr-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <BarChart3 className="w-8 h-8 text-primary" />
                </div>
                <p className="text-muted-foreground">Analyzing table...</p>
              </div>
            </div>
          ) : analysis ? (
            <div className="space-y-6">
              {/* Overview Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="card-hover glass">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Database className="w-4 h-4 text-blue-500" />
                      Row Count
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {analysis.rowCount?.toLocaleString() || 0}
                    </div>
                  </CardContent>
                </Card>

                <Card className="card-hover glass">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <HardDrive className="w-4 h-4 text-green-500" />
                      Table Size
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {formatBytes(analysis.totalSize || 0)}
                    </div>
                  </CardContent>
                </Card>

                <Card className="card-hover glass">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Key className="w-4 h-4 text-purple-500" />
                      Indexes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {analysis.indexCount || 0}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Column Statistics */}
              {analysis.columnStats && analysis.columnStats.length > 0 && (
                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="text-base">Column Statistics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {analysis.columnStats.map((col: any, index: number) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                          data-testid={`column-stat-${index}`}
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium">{col.columnName}</span>
                              <Badge variant="outline" className="text-xs">
                                {col.dataType}
                              </Badge>
                            </div>
                            <div className="flex gap-4 text-sm text-muted-foreground">
                              {col.nullCount !== undefined && (
                                <span>Nulls: {col.nullCount}</span>
                              )}
                              {col.distinctCount !== undefined && (
                                <span>Distinct: {col.distinctCount}</span>
                              )}
                              {col.avgLength !== undefined && (
                                <span>Avg Length: {col.avgLength.toFixed(1)}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Index Information */}
              {analysis.indexes && analysis.indexes.length > 0 && (
                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="text-base">Index Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {analysis.indexes.map((idx: any, index: number) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                          data-testid={`index-detail-${index}`}
                        >
                          <div className="flex items-center gap-3">
                            <Key className="w-4 h-4 text-primary" />
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-sm">{idx.name}</span>
                                {idx.unique && (
                                  <Badge variant="secondary" className="text-xs">UNIQUE</Badge>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                Columns: {Array.isArray(idx.columns) ? idx.columns.join(', ') : idx.columns}
                              </p>
                            </div>
                          </div>
                          {idx.size && (
                            <span className="text-sm text-muted-foreground">
                              {formatBytes(idx.size)}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Constraints */}
              {analysis.constraints && analysis.constraints.length > 0 && (
                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="text-base">Constraints</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {analysis.constraints.map((constraint: any, index: number) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                          data-testid={`constraint-${index}`}
                        >
                          <div className="flex items-center gap-3">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-sm">{constraint.name}</span>
                                <Badge variant="secondary" className="text-xs">
                                  {constraint.type}
                                </Badge>
                              </div>
                              {constraint.definition && (
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  {constraint.definition}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Foreign Keys */}
              {analysis.foreignKeys && analysis.foreignKeys.length > 0 && (
                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="text-base">Foreign Key Relationships</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {analysis.foreignKeys.map((fk: any, index: number) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg"
                          data-testid={`fk-${index}`}
                        >
                          <Link2 className="w-4 h-4 text-primary" />
                          <div className="text-sm">
                            <span className="font-medium">{fk.columnName}</span>
                            <span className="text-muted-foreground"> → </span>
                            <span className="font-medium">
                              {fk.referencedTable}.{fk.referencedColumn}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              No analysis data available
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
