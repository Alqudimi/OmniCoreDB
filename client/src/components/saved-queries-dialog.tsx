import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Save, Trash2, Play, Edit, Plus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { soundManager } from "@/lib/sounds";

interface SavedQueriesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  connectionId: string;
  onExecuteQuery?: (query: string) => void;
}

export function SavedQueriesDialog({ open, onOpenChange, connectionId, onExecuteQuery }: SavedQueriesDialogProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [queryName, setQueryName] = useState("");
  const [queryText, setQueryText] = useState("");
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();

  const { data: savedQueries, isLoading } = useQuery<any[]>({
    queryKey: [`/api/connections/${connectionId}/saved-queries`],
    enabled: open && !!connectionId,
  });

  const createMutation = useMutation({
    mutationFn: async (data: { name: string; query: string }) => {
      const res = await apiRequest('POST', `/api/connections/${connectionId}/saved-queries`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/connections/${connectionId}/saved-queries`] });
      soundManager.success();
      toast({ title: "Success", description: "Query saved successfully" });
      resetForm();
    },
    onError: (error: Error) => {
      soundManager.error();
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const res = await apiRequest('PUT', `/api/saved-queries/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/connections/${connectionId}/saved-queries`] });
      soundManager.success();
      toast({ title: "Success", description: "Query updated successfully" });
      resetForm();
    },
    onError: (error: Error) => {
      soundManager.error();
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest('DELETE', `/api/saved-queries/${id}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/connections/${connectionId}/saved-queries`] });
      soundManager.success();
      toast({ title: "Success", description: "Query deleted successfully" });
    },
    onError: (error: Error) => {
      soundManager.error();
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const resetForm = () => {
    setEditingId(null);
    setQueryName("");
    setQueryText("");
    setShowForm(false);
  };

  const handleEdit = (query: any) => {
    setEditingId(query.id);
    setQueryName(query.name);
    setQueryText(query.query);
    setShowForm(true);
    soundManager.click();
  };

  const handleSave = () => {
    if (!queryName || !queryText) {
      toast({ title: "Validation Error", description: "Please fill all fields", variant: "destructive" });
      return;
    }

    const data = { name: queryName, query: queryText };
    if (editingId) {
      updateMutation.mutate({ id: editingId, data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[80vh]" data-testid="dialog-saved-queries">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Save className="w-5 h-5" />
              Saved Queries
            </DialogTitle>
            <Button
              onClick={() => {
                setShowForm(!showForm);
                if (showForm) resetForm();
                soundManager.click();
              }}
              variant={showForm ? "outline" : "default"}
              size="sm"
              data-testid="button-new-query"
            >
              <Plus className="w-4 h-4 mr-2" />
              {showForm ? "Cancel" : "New Query"}
            </Button>
          </div>
        </DialogHeader>

        {showForm ? (
          <div className="space-y-4 animate-in fade-in">
            <div>
              <Label>Query Name</Label>
              <Input
                value={queryName}
                onChange={(e) => setQueryName(e.target.value)}
                placeholder="e.g., Get All Users"
                data-testid="input-query-name"
              />
            </div>
            <div>
              <Label>SQL Query</Label>
              <Textarea
                value={queryText}
                onChange={(e) => setQueryText(e.target.value)}
                placeholder="SELECT * FROM ..."
                className="font-mono"
                rows={8}
                data-testid="textarea-query"
              />
            </div>
            <Button
              onClick={handleSave}
              disabled={createMutation.isPending || updateMutation.isPending}
              className="w-full"
              data-testid="button-save-query"
            >
              <Save className="w-4 h-4 mr-2" />
              {editingId ? "Update Query" : "Save Query"}
            </Button>
          </div>
        ) : (
          <ScrollArea className="h-[500px] pr-4">
            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="text-muted-foreground">Loading...</div>
              </div>
            ) : !savedQueries?.length ? (
              <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                <Save className="w-12 h-12 mb-2 opacity-50" />
                <p>No saved queries yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {savedQueries.map((query) => (
                  <div
                    key={query.id}
                    className="p-4 border rounded-lg hover:bg-muted/50 transition-all card-hover"
                    data-testid={`saved-query-${query.id}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold">{query.name}</h4>
                      <div className="flex gap-1">
                        {onExecuteQuery && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              soundManager.click();
                              onExecuteQuery(query.query);
                              onOpenChange(false);
                            }}
                            data-testid={`button-execute-${query.id}`}
                          >
                            <Play className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(query)}
                          data-testid={`button-edit-${query.id}`}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            soundManager.click();
                            deleteMutation.mutate(query.id);
                          }}
                          data-testid={`button-delete-${query.id}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <pre className="p-3 bg-muted rounded text-sm font-mono overflow-x-auto">
                      {query.query}
                    </pre>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
}
