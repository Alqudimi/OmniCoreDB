import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Layers, Upload, Pencil, Trash } from "lucide-react";
import { soundManager } from "@/lib/sounds";

interface BulkOperationsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  connectionId: string;
  tableName: string;
}

export function BulkOperationsDialog({ open, onOpenChange, connectionId, tableName }: BulkOperationsDialogProps) {
  const [operation, setOperation] = useState<"insert" | "update" | "delete">("insert");
  const [insertData, setInsertData] = useState("");
  const [updateData, setUpdateData] = useState("");
  const [updateWhere, setUpdateWhere] = useState("");
  const [deleteIds, setDeleteIds] = useState("");
  const { toast } = useToast();

  const bulkInsertMutation = useMutation({
    mutationFn: async (rows: any[]) => {
      const res = await apiRequest('POST', `/api/connections/${connectionId}/tables/${tableName}/bulk-insert`, { rows });
      return res.json();
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['/api/connections', connectionId, 'tables', tableName, 'rows'] });
      soundManager.success();
      toast({ title: "Success", description: `Inserted ${result.inserted || result.length} rows` });
      onOpenChange(false);
      setInsertData("");
    },
    onError: (error: Error) => {
      soundManager.error();
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const bulkUpdateMutation = useMutation({
    mutationFn: async (data: { updates: any; where: string }) => {
      const res = await apiRequest('POST', `/api/connections/${connectionId}/tables/${tableName}/bulk-update`, data);
      return res.json();
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['/api/connections', connectionId, 'tables', tableName, 'rows'] });
      soundManager.success();
      toast({ title: "Success", description: `Updated ${result.updated} rows` });
      onOpenChange(false);
      setUpdateData("");
      setUpdateWhere("");
    },
    onError: (error: Error) => {
      soundManager.error();
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: async (ids: any[]) => {
      const res = await apiRequest('POST', `/api/connections/${connectionId}/tables/${tableName}/bulk-delete`, { ids });
      return res.json();
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['/api/connections', connectionId, 'tables', tableName, 'rows'] });
      soundManager.success();
      toast({ title: "Success", description: `Deleted ${result.deleted} rows` });
      onOpenChange(false);
      setDeleteIds("");
    },
    onError: (error: Error) => {
      soundManager.error();
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const handleExecute = () => {
    try {
      if (operation === "insert") {
        const parsed = JSON.parse(insertData);
        const rows = Array.isArray(parsed) ? parsed : [parsed];
        bulkInsertMutation.mutate(rows);
      } else if (operation === "update") {
        const updates = JSON.parse(updateData);
        if (!updateWhere) {
          toast({
            title: "Validation Error",
            description: "WHERE clause is required for bulk updates",
            variant: "destructive",
          });
          return;
        }
        bulkUpdateMutation.mutate({ updates, where: updateWhere });
      } else if (operation === "delete") {
        const parsed = JSON.parse(deleteIds);
        const ids = Array.isArray(parsed) ? parsed : [parsed];
        bulkDeleteMutation.mutate(ids);
      }
    } catch (e) {
      toast({
        title: "Invalid JSON",
        description: "Please provide valid JSON data",
        variant: "destructive",
      });
    }
  };

  const isPending = bulkInsertMutation.isPending || bulkUpdateMutation.isPending || bulkDeleteMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl" data-testid="dialog-bulk-operations">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Layers className="w-5 h-5" />
            Bulk Operations
          </DialogTitle>
        </DialogHeader>

        <Tabs value={operation} onValueChange={(v) => setOperation(v as any)} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="insert" data-testid="tab-bulk-insert">
              <Upload className="w-4 h-4 mr-2" />
              Bulk Insert
            </TabsTrigger>
            <TabsTrigger value="update" data-testid="tab-bulk-update">
              <Pencil className="w-4 h-4 mr-2" />
              Bulk Update
            </TabsTrigger>
            <TabsTrigger value="delete" data-testid="tab-bulk-delete">
              <Trash className="w-4 h-4 mr-2" />
              Bulk Delete
            </TabsTrigger>
          </TabsList>

          <TabsContent value="insert" className="space-y-4 mt-4">
            <div>
              <Label htmlFor="insert-data">JSON Data (Array of Objects)</Label>
              <Textarea
                id="insert-data"
                value={insertData}
                onChange={(e) => setInsertData(e.target.value)}
                placeholder={`[
  {"column1": "value1", "column2": "value2"},
  {"column1": "value3", "column2": "value4"}
]`}
                className="font-mono text-sm h-64 mt-2"
                data-testid="textarea-bulk-insert"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Provide an array of objects matching your table schema
              </p>
            </div>
          </TabsContent>

          <TabsContent value="update" className="space-y-4 mt-4">
            <div>
              <Label htmlFor="update-data">Update Values (JSON Object)</Label>
              <Textarea
                id="update-data"
                value={updateData}
                onChange={(e) => setUpdateData(e.target.value)}
                placeholder={`{
  "column1": "new_value1",
  "column2": "new_value2"
}`}
                className="font-mono text-sm h-40 mt-2"
                data-testid="textarea-bulk-update"
              />
            </div>
            <div>
              <Label htmlFor="update-where">WHERE Clause</Label>
              <Input
                id="update-where"
                value={updateWhere}
                onChange={(e) => setUpdateWhere(e.target.value)}
                placeholder="column_name = 'value'"
                className="font-mono text-sm mt-2"
                data-testid="input-update-where"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Example: status = 'pending', age &gt; 18
              </p>
            </div>
          </TabsContent>

          <TabsContent value="delete" className="space-y-4 mt-4">
            <div>
              <Label htmlFor="delete-ids">Row IDs (JSON Array)</Label>
              <Textarea
                id="delete-ids"
                value={deleteIds}
                onChange={(e) => setDeleteIds(e.target.value)}
                placeholder={`[1, 2, 3, 4, 5]`}
                className="font-mono text-sm h-64 mt-2"
                data-testid="textarea-bulk-delete"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Provide an array of row IDs to delete
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleExecute}
            disabled={isPending}
            data-testid="button-execute-bulk"
          >
            {isPending ? "Executing..." : "Execute"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
