import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { ColumnMetadata } from "@/lib/types";
import { Plus } from "lucide-react";

interface InsertRowDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  connectionId: string;
  tableName: string;
  editRow?: any;
}

export function InsertRowDialog({ 
  open, 
  onOpenChange, 
  connectionId, 
  tableName,
  editRow 
}: InsertRowDialogProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: columns } = useQuery<ColumnMetadata[]>({
    queryKey: ['/api/connections', connectionId, 'tables', tableName, 'columns'],
    enabled: !!connectionId && !!tableName && open,
  });

  // Get foreign key options
  const getForeignKeyOptions = (foreignKey?: { table: string; column: string }) => {
    return useQuery({
      queryKey: ['/api/connections', connectionId, 'tables', foreignKey?.table, 'rows'],
      queryFn: async () => {
        if (!foreignKey) return [];
        const res = await fetch(`/api/connections/${connectionId}/tables/${foreignKey.table}/rows?limit=1000`);
        if (!res.ok) throw new Error('Failed to fetch foreign key options');
        const data = await res.json();
        return data.rows;
      },
      enabled: !!foreignKey && open,
    });
  };

  useEffect(() => {
    if (editRow) {
      setFormData(editRow);
    } else {
      setFormData({});
    }
  }, [editRow, open]);

  const insertMutation = useMutation({
    mutationFn: async (data: any) => {
      const url = editRow 
        ? `/api/connections/${connectionId}/tables/${tableName}/rows/${editRow[columns?.find(c => c.primaryKey)?.name || 'id']}`
        : `/api/connections/${connectionId}/tables/${tableName}/rows`;
      const method = editRow ? 'PATCH' : 'POST';
      const res = await apiRequest(method, url, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/connections', connectionId, 'tables', tableName, 'rows'] });
      queryClient.invalidateQueries({ queryKey: ['/api/connections', connectionId, 'tables'] });
      toast({
        title: "Success",
        description: editRow ? "Row updated successfully" : "Row inserted successfully",
      });
      onOpenChange(false);
      setFormData({});
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
    const dataToSubmit: Record<string, any> = {};
    
    columns?.forEach(column => {
      if (!column.autoIncrement) {
        const value = formData[column.name];
        if (value !== undefined && value !== '') {
          // Type conversion
          if (column.type.toLowerCase().includes('int')) {
            dataToSubmit[column.name] = parseInt(value);
          } else if (column.type.toLowerCase().includes('decimal') || 
                     column.type.toLowerCase().includes('numeric') ||
                     column.type.toLowerCase().includes('float')) {
            dataToSubmit[column.name] = parseFloat(value);
          } else if (column.type.toLowerCase().includes('bool')) {
            dataToSubmit[column.name] = Boolean(value);
          } else {
            dataToSubmit[column.name] = value;
          }
        } else if (!column.nullable && !column.defaultValue) {
          toast({
            title: "Validation Error",
            description: `Field "${column.name}" is required`,
            variant: "destructive",
          });
          return;
        }
      }
    });

    insertMutation.mutate(dataToSubmit);
  };

  const editableColumns = columns?.filter(col => !col.autoIncrement) || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-hidden flex flex-col" data-testid="dialog-insert-row">
        <DialogHeader>
          <DialogTitle>{editRow ? 'Edit Row' : 'Insert New Row'}</DialogTitle>
          <DialogDescription>
            {editRow ? 'Update' : 'Add'} a record in <span className="font-mono">{tableName}</span> table
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-2">
          <div className="space-y-4 py-4">
            {editableColumns.map((column) => {
              const ForeignKeySelect = column.foreignKey ? getForeignKeyOptions(column.foreignKey) : null;
              
              return (
                <div key={column.name}>
                  <Label htmlFor={column.name} className="text-sm font-medium mb-1.5 flex items-center gap-2">
                    <span>{column.name}</span>
                    {!column.nullable && !column.defaultValue && (
                      <span className="text-xs px-1.5 py-0.5 bg-destructive/10 text-destructive rounded">
                        Required
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground font-mono">
                      {column.type}
                    </span>
                  </Label>

                  {column.foreignKey && ForeignKeySelect ? (
                    <Select
                      value={formData[column.name]?.toString() || ''}
                      onValueChange={(value) => setFormData({ ...formData, [column.name]: value })}
                    >
                      <SelectTrigger data-testid={`select-${column.name}`}>
                        <SelectValue placeholder="Select a value..." />
                      </SelectTrigger>
                      <SelectContent>
                        {ForeignKeySelect.data?.map((row: any) => {
                          const pkColumn = column.foreignKey!.column;
                          const displayColumns = Object.keys(row).slice(0, 3);
                          return (
                            <SelectItem 
                              key={row[pkColumn]} 
                              value={row[pkColumn]?.toString()}
                            >
                              {displayColumns.map(col => row[col]).join(' - ')}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  ) : column.type.toLowerCase().includes('text') && !column.type.toLowerCase().includes('varchar') ? (
                    <Textarea
                      id={column.name}
                      placeholder={column.defaultValue ? `Default: ${column.defaultValue}` : `Enter ${column.name}`}
                      value={formData[column.name] || ''}
                      onChange={(e) => setFormData({ ...formData, [column.name]: e.target.value })}
                      rows={3}
                      className="resize-none"
                      data-testid={`textarea-${column.name}`}
                    />
                  ) : (
                    <Input
                      id={column.name}
                      type={
                        column.type.toLowerCase().includes('int') || 
                        column.type.toLowerCase().includes('decimal') ||
                        column.type.toLowerCase().includes('numeric')
                          ? 'number'
                          : column.type.toLowerCase().includes('date') || 
                            column.type.toLowerCase().includes('time')
                          ? 'datetime-local'
                          : 'text'
                      }
                      step={column.type.toLowerCase().includes('decimal') ? '0.01' : undefined}
                      placeholder={column.defaultValue ? `Default: ${column.defaultValue}` : `Enter ${column.name}`}
                      value={formData[column.name] || ''}
                      onChange={(e) => setFormData({ ...formData, [column.name]: e.target.value })}
                      className={column.type.toLowerCase().includes('int') || 
                                 column.type.toLowerCase().includes('decimal') 
                                 ? 'font-mono' 
                                 : ''}
                      data-testid={`input-${column.name}`}
                    />
                  )}
                </div>
              );
            })}
          </div>
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
            onClick={handleSubmit} 
            disabled={insertMutation.isPending}
            data-testid="button-submit"
          >
            {insertMutation.isPending ? (
              editRow ? 'Updating...' : 'Inserting...'
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                {editRow ? 'Update Row' : 'Insert Row'}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
