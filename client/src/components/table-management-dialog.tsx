import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Plus, Trash } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface TableManagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  connectionId: string;
  mode: 'create' | 'rename';
  currentTableName?: string;
}

interface ColumnDefinition {
  name: string;
  type: string;
  nullable: boolean;
  primaryKey: boolean;
}

const columnTypes = [
  'INTEGER',
  'VARCHAR(255)',
  'TEXT',
  'BOOLEAN',
  'DECIMAL(10,2)',
  'DATE',
  'TIMESTAMP',
  'JSON',
];

export function TableManagementDialog({ 
  open, 
  onOpenChange, 
  connectionId, 
  mode,
  currentTableName 
}: TableManagementDialogProps) {
  const [tableName, setTableName] = useState(currentTableName || '');
  const [columns, setColumns] = useState<ColumnDefinition[]>([
    { name: 'id', type: 'INTEGER', nullable: false, primaryKey: true }
  ]);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createTableMutation = useMutation({
    mutationFn: async (data: { tableName: string; columns: ColumnDefinition[] }) => {
      const res = await apiRequest('POST', `/api/connections/${connectionId}/tables`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/connections', connectionId, 'tables'] });
      toast({
        title: "Success",
        description: "Table created successfully",
      });
      onOpenChange(false);
      resetForm();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const renameTableMutation = useMutation({
    mutationFn: async (data: { newName: string }) => {
      const res = await apiRequest('PATCH', `/api/connections/${connectionId}/tables/${currentTableName}/rename`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/connections', connectionId, 'tables'] });
      toast({
        title: "Success",
        description: "Table renamed successfully",
      });
      onOpenChange(false);
      resetForm();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setTableName('');
    setColumns([{ name: 'id', type: 'INTEGER', nullable: false, primaryKey: true }]);
  };

  const handleSubmit = () => {
    if (!tableName) {
      toast({
        title: "Validation Error",
        description: "Please enter a table name",
        variant: "destructive",
      });
      return;
    }

    if (mode === 'create') {
      if (columns.length === 0) {
        toast({
          title: "Validation Error",
          description: "Please add at least one column",
          variant: "destructive",
        });
        return;
      }

      createTableMutation.mutate({ tableName, columns });
    } else {
      renameTableMutation.mutate({ newName: tableName });
    }
  };

  const addColumn = () => {
    setColumns([...columns, { name: '', type: 'TEXT', nullable: true, primaryKey: false }]);
  };

  const removeColumn = (index: number) => {
    setColumns(columns.filter((_, i) => i !== index));
  };

  const updateColumn = (index: number, field: keyof ColumnDefinition, value: any) => {
    const newColumns = [...columns];
    newColumns[index] = { ...newColumns[index], [field]: value };
    setColumns(newColumns);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto" data-testid="dialog-table-management">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Create New Table' : 'Rename Table'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create' 
              ? 'Define the table structure with columns and data types'
              : 'Enter a new name for the table'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="tableName" className="text-sm font-medium mb-2 block">
              Table Name
            </Label>
            <Input
              id="tableName"
              type="text"
              placeholder="users"
              value={tableName}
              onChange={(e) => setTableName(e.target.value)}
              data-testid="input-table-name"
            />
          </div>

          {mode === 'create' && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <Label className="text-sm font-medium">Columns</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addColumn}
                  data-testid="button-add-column"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Column
                </Button>
              </div>

              <div className="space-y-3">
                {columns.map((column, index) => (
                  <div 
                    key={index} 
                    className="flex items-start gap-2 p-3 border border-border rounded-md bg-muted/30"
                    data-testid={`column-def-${index}`}
                  >
                    <div className="flex-1 grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs mb-1">Name</Label>
                        <Input
                          type="text"
                          placeholder="column_name"
                          value={column.name}
                          onChange={(e) => updateColumn(index, 'name', e.target.value)}
                          className="h-9"
                          data-testid={`input-column-name-${index}`}
                        />
                      </div>
                      <div>
                        <Label className="text-xs mb-1">Type</Label>
                        <Select 
                          value={column.type} 
                          onValueChange={(value) => updateColumn(index, 'type', value)}
                        >
                          <SelectTrigger className="h-9" data-testid={`select-column-type-${index}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {columnTypes.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id={`nullable-${index}`}
                            checked={column.nullable}
                            onCheckedChange={(checked) => updateColumn(index, 'nullable', checked)}
                            data-testid={`checkbox-nullable-${index}`}
                          />
                          <Label htmlFor={`nullable-${index}`} className="text-xs cursor-pointer">
                            Nullable
                          </Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id={`pk-${index}`}
                            checked={column.primaryKey}
                            onCheckedChange={(checked) => updateColumn(index, 'primaryKey', checked)}
                            data-testid={`checkbox-primary-${index}`}
                          />
                          <Label htmlFor={`pk-${index}`} className="text-xs cursor-pointer">
                            Primary Key
                          </Label>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-9 w-9 p-0 text-destructive hover:bg-destructive/10"
                      onClick={() => removeColumn(index)}
                      data-testid={`button-remove-column-${index}`}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} data-testid="button-cancel">
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={createTableMutation.isPending || renameTableMutation.isPending}
            data-testid="button-submit"
          >
            {(createTableMutation.isPending || renameTableMutation.isPending) ? (
              <>Processing...</>
            ) : (
              <>{mode === 'create' ? 'Create Table' : 'Rename Table'}</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
