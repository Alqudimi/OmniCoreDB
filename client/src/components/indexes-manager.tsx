import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Zap, Trash2, Plus, Lightbulb, Database } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { soundManager } from "@/lib/sounds";
import { ConfirmationDialog } from "@/components/confirmation-dialog";

interface IndexesManagerProps {
  connectionId: string;
  tableName: string;
}

export function IndexesManager({ connectionId, tableName }: IndexesManagerProps) {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<string | null>(null);
  const [indexName, setIndexName] = useState("");
  const [columns, setColumns] = useState<string[]>([]);
  const [unique, setUnique] = useState(false);
  const { toast } = useToast();

  const { data: indexes, isLoading } = useQuery<any[]>({
    queryKey: [`/api/connections/${connectionId}/tables/${tableName}/indexes`],
    enabled: !!connectionId && !!tableName,
  });

  const { data: tableColumns } = useQuery<any[]>({
    queryKey: [`/api/connections/${connectionId}/tables/${tableName}/columns`],
    enabled: !!connectionId && !!tableName,
  });

  const { data: suggestions } = useQuery<any[]>({
    queryKey: [`/api/connections/${connectionId}/tables/${tableName}/index-suggestions`],
    enabled: !!connectionId && !!tableName,
  });

  const createIndexMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest('POST', `/api/connections/${connectionId}/tables/${tableName}/indexes`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/connections/${connectionId}/tables/${tableName}/indexes`] });
      queryClient.invalidateQueries({ queryKey: [`/api/connections/${connectionId}/tables/${tableName}/index-suggestions`] });
      soundManager.success();
      toast({ title: "Success", description: "Index created successfully" });
      setShowCreateDialog(false);
      resetForm();
    },
    onError: (error: Error) => {
      soundManager.error();
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteIndexMutation = useMutation({
    mutationFn: async (indexName: string) => {
      const res = await apiRequest('DELETE', `/api/connections/${connectionId}/tables/${tableName}/indexes/${indexName}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/connections/${connectionId}/tables/${tableName}/indexes`] });
      queryClient.invalidateQueries({ queryKey: [`/api/connections/${connectionId}/tables/${tableName}/index-suggestions`] });
      soundManager.success();
      toast({ title: "Success", description: "Index deleted successfully" });
      setShowDeleteDialog(false);
    },
    onError: (error: Error) => {
      soundManager.error();
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const resetForm = () => {
    setIndexName("");
    setColumns([]);
    setUnique(false);
  };

  const handleColumnToggle = (column: string) => {
    setColumns(prev =>
      prev.includes(column) ? prev.filter(c => c !== column) : [...prev, column]
    );
  };

  const handleCreate = () => {
    if (!indexName || columns.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please provide index name and select at least one column",
        variant: "destructive",
      });
      return;
    }
    createIndexMutation.mutate({ indexName, columns, unique });
  };

  const applySuggestion = (suggestion: any) => {
    setIndexName(suggestion.suggestedName || `idx_${tableName}_${suggestion.columns.join('_')}`);
    setColumns(suggestion.columns);
    setUnique(false);
    setShowCreateDialog(true);
    soundManager.click();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">Loading indexes...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Indexes</h3>
          <p className="text-sm text-muted-foreground">
            Manage table indexes to improve query performance
          </p>
        </div>
        <Button
          onClick={() => {
            setShowCreateDialog(true);
            soundManager.open();
          }}
          className="gap-2"
          data-testid="button-create-index"
        >
          <Plus className="w-4 h-4" />
          Create Index
        </Button>
      </div>

      {/* Index Suggestions */}
      {suggestions && suggestions.length > 0 && (
        <Card className="p-4 glass border-yellow-500/30">
          <div className="flex items-start gap-3 mb-3">
            <Lightbulb className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-sm mb-1">Performance Recommendations</h4>
              <p className="text-xs text-muted-foreground">
                AI-powered suggestions to optimize query performance
              </p>
            </div>
          </div>
          <div className="space-y-2 mt-4">
            {suggestions.map((suggestion: any, index: number) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-yellow-500/5 rounded-lg"
                data-testid={`suggestion-${index}`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Zap className="w-3.5 h-3.5 text-yellow-500" />
                    <span className="text-sm font-medium">
                      Index on: {suggestion.columns.join(', ')}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{suggestion.reason}</p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => applySuggestion(suggestion)}
                  data-testid={`button-apply-suggestion-${index}`}
                >
                  Apply
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Existing Indexes */}
      <ScrollArea className="h-[400px]">
        <div className="space-y-3 pr-4">
          {indexes && indexes.length > 0 ? (
            indexes.map((index: any, idx: number) => (
              <Card
                key={idx}
                className="p-4 hover:shadow-md transition-all card-hover glass"
                data-testid={`index-${idx}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{
                        background: `linear-gradient(135deg, var(--theme-primary), var(--theme-accent))`
                      }}
                    >
                      <Database className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{index.name}</h4>
                        {index.unique && (
                          <Badge variant="secondary" className="text-xs">UNIQUE</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <span>Columns:</span>
                        {Array.isArray(index.columns) ? (
                          index.columns.map((col: string, i: number) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {col}
                            </Badge>
                          ))
                        ) : (
                          <Badge variant="outline" className="text-xs">
                            {index.columns}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive"
                    onClick={() => {
                      setSelectedIndex(index.name);
                      setShowDeleteDialog(true);
                      soundManager.click();
                    }}
                    data-testid={`button-delete-index-${idx}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              No indexes found for this table
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Create Index Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent data-testid="dialog-create-index">
          <DialogHeader>
            <DialogTitle>Create Index</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="index-name">Index Name</Label>
              <Input
                id="index-name"
                value={indexName}
                onChange={(e) => setIndexName(e.target.value)}
                placeholder="idx_table_column"
                data-testid="input-index-name"
              />
            </div>

            <div>
              <Label>Columns</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {tableColumns?.map((col: any) => (
                  <div key={col.name} className="flex items-center space-x-2">
                    <Checkbox
                      id={`col-${col.name}`}
                      checked={columns.includes(col.name)}
                      onCheckedChange={() => handleColumnToggle(col.name)}
                      data-testid={`checkbox-column-${col.name}`}
                    />
                    <label
                      htmlFor={`col-${col.name}`}
                      className="text-sm cursor-pointer"
                    >
                      {col.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="unique"
                checked={unique}
                onCheckedChange={(checked) => setUnique(checked as boolean)}
                data-testid="checkbox-unique"
              />
              <label htmlFor="unique" className="text-sm cursor-pointer">
                Unique index (prevents duplicate values)
              </label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={createIndexMutation.isPending}
              data-testid="button-confirm-create-index"
            >
              {createIndexMutation.isPending ? "Creating..." : "Create Index"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Delete Index"
        description={`Are you sure you want to delete index "${selectedIndex}"? This action cannot be undone.`}
        onConfirm={() => selectedIndex && deleteIndexMutation.mutate(selectedIndex)}
        confirmText="Delete Index"
        variant="danger"
      />
    </div>
  );
}
