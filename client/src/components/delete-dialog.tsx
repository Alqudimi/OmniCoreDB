import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface DeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  connectionId: string;
  tableName: string;
  row: any;
  primaryKeyColumn: string;
}

export function DeleteDialog({ 
  open, 
  onOpenChange, 
  connectionId, 
  tableName, 
  row,
  primaryKeyColumn 
}: DeleteDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const rowId = row[primaryKeyColumn];
      const res = await apiRequest(
        'DELETE', 
        `/api/connections/${connectionId}/tables/${tableName}/rows/${rowId}`
      );
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/connections', connectionId, 'tables', tableName, 'rows'] });
      queryClient.invalidateQueries({ queryKey: ['/api/connections', connectionId, 'tables'] });
      toast({
        title: "Success",
        description: "Row deleted successfully",
      });
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const displayValue = row ? Object.entries(row)
    .slice(0, 2)
    .map(([key, value]) => `${key}: ${value}`)
    .join(' • ') : '';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" data-testid="dialog-delete">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="text-destructive" />
            </div>
            <div>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>This action cannot be undone</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-4">
          <p className="text-sm text-foreground mb-4">
            Are you sure you want to delete this row? This will permanently remove the record from the database.
          </p>
          
          {row && (
            <div className="p-3 bg-muted rounded-lg">
              <div className="text-xs font-medium text-muted-foreground mb-1">Row to be deleted:</div>
              <div className="font-mono text-sm" data-testid="text-row-info">
                {displayValue}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            data-testid="button-cancel"
          >
            Cancel
          </Button>
          <Button 
            variant="destructive"
            onClick={() => deleteMutation.mutate()}
            disabled={deleteMutation.isPending}
            data-testid="button-confirm-delete"
          >
            {deleteMutation.isPending ? 'Deleting...' : 'Delete Row'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
