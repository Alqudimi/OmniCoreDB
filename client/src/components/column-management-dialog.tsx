import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnMetadata } from "@/lib/types";

interface ColumnManagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  connectionId: string;
  tableName: string;
  mode: 'add' | 'modify';
  column?: ColumnMetadata;
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

export function ColumnManagementDialog({ 
  open, 
  onOpenChange, 
  connectionId, 
  tableName,
  mode,
  column 
}: ColumnManagementDialogProps) {
  const [columnName, setColumnName] = useState('');
  const [columnType, setColumnType] = useState('TEXT');
  const [nullable, setNullable] = useState(true);
  const [defaultValue, setDefaultValue] = useState('');
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (mode === 'modify' && column) {
      setColumnName(column.name);
      setColumnType(column.type);
      setNullable(column.nullable);
      setDefaultValue(column.defaultValue || '');
    } else {
      setColumnName('');
      setColumnType('TEXT');
      setNullable(true);
      setDefaultValue('');
    }
  }, [mode, column, open]);

  const addColumnMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest('POST', `/api/connections/${connectionId}/tables/${tableName}/columns`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/connections', connectionId, 'tables', tableName, 'columns'] });
      queryClient.invalidateQueries({ queryKey: ['/api/connections', connectionId, 'tables'] });
      toast({
        title: "Success",
        description: "Column added successfully",
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

  const modifyColumnMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest('PATCH', `/api/connections/${connectionId}/tables/${tableName}/columns/${column?.name}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/connections', connectionId, 'tables', tableName, 'columns'] });
      queryClient.invalidateQueries({ queryKey: ['/api/connections', connectionId, 'tables'] });
      toast({
        title: "Success",
        description: "Column modified successfully",
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

  const handleSubmit = () => {
    if (!columnName) {
      toast({
        title: "Validation Error",
        description: "Please enter a column name",
        variant: "destructive",
      });
      return;
    }

    const data: any = {
      name: columnName,
      type: columnType,
      nullable,
    };

    if (defaultValue) {
      data.defaultValue = defaultValue;
    }

    if (mode === 'add') {
      addColumnMutation.mutate(data);
    } else {
      const modifyData: any = {};
      if (columnName !== column?.name) modifyData.newName = columnName;
      if (columnType !== column?.type) modifyData.type = columnType;
      if (defaultValue !== (column?.defaultValue || '')) modifyData.defaultValue = defaultValue;
      
      modifyColumnMutation.mutate(modifyData);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" data-testid="dialog-column-management">
        <DialogHeader>
          <DialogTitle>
            {mode === 'add' ? 'Add Column' : 'Modify Column'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'add' 
              ? `Add a new column to ${tableName}`
              : `Modify the ${column?.name} column`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="columnName" className="text-sm font-medium mb-2 block">
              Column Name
            </Label>
            <Input
              id="columnName"
              type="text"
              placeholder="column_name"
              value={columnName}
              onChange={(e) => setColumnName(e.target.value)}
              data-testid="input-column-name"
            />
          </div>

          <div>
            <Label className="text-sm font-medium mb-2 block">
              Data Type
            </Label>
            <Select value={columnType} onValueChange={setColumnType}>
              <SelectTrigger data-testid="select-column-type">
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

          <div>
            <Label htmlFor="defaultValue" className="text-sm font-medium mb-2 block">
              Default Value (Optional)
            </Label>
            <Input
              id="defaultValue"
              type="text"
              placeholder="NULL"
              value={defaultValue}
              onChange={(e) => setDefaultValue(e.target.value)}
              data-testid="input-default-value"
            />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="nullable"
              checked={nullable}
              onCheckedChange={(checked) => setNullable(checked as boolean)}
              data-testid="checkbox-nullable"
            />
            <Label htmlFor="nullable" className="text-sm cursor-pointer">
              Allow NULL values
            </Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} data-testid="button-cancel">
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={addColumnMutation.isPending || modifyColumnMutation.isPending}
            data-testid="button-submit"
          >
            {(addColumnMutation.isPending || modifyColumnMutation.isPending) ? (
              <>Processing...</>
            ) : (
              <>{mode === 'add' ? 'Add Column' : 'Modify Column'}</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
