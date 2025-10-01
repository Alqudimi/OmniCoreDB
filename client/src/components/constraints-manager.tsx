import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, Trash2, Plus, Key } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { soundManager } from "@/lib/sounds";
import { ConfirmationDialog } from "@/components/confirmation-dialog";

interface ConstraintsManagerProps {
  connectionId: string;
  tableName: string;
}

export function ConstraintsManager({ connectionId, tableName }: ConstraintsManagerProps) {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedConstraint, setSelectedConstraint] = useState<string | null>(null);
  const [constraintType, setConstraintType] = useState<string>("CHECK");
  const [constraintName, setConstraintName] = useState("");
  const [columns, setColumns] = useState<string[]>([]);
  const [expression, setExpression] = useState("");
  const { toast } = useToast();

  const { data: constraints, isLoading } = useQuery<any[]>({
    queryKey: [`/api/connections/${connectionId}/tables/${tableName}/constraints`],
    enabled: !!connectionId && !!tableName,
  });

  const { data: tableColumns } = useQuery<any[]>({
    queryKey: [`/api/connections/${connectionId}/tables/${tableName}/columns`],
    enabled: !!connectionId && !!tableName,
  });

  const createConstraintMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest('POST', `/api/connections/${connectionId}/tables/${tableName}/constraints`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/connections/${connectionId}/tables/${tableName}/constraints`] });
      soundManager.success();
      toast({ title: "Success", description: "Constraint created successfully" });
      setShowCreateDialog(false);
      resetForm();
    },
    onError: (error: Error) => {
      soundManager.error();
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteConstraintMutation = useMutation({
    mutationFn: async (constraintName: string) => {
      const res = await apiRequest('DELETE', `/api/connections/${connectionId}/tables/${tableName}/constraints/${constraintName}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/connections/${connectionId}/tables/${tableName}/constraints`] });
      soundManager.success();
      toast({ title: "Success", description: "Constraint deleted successfully" });
      setShowDeleteDialog(false);
    },
    onError: (error: Error) => {
      soundManager.error();
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const resetForm = () => {
    setConstraintName("");
    setConstraintType("CHECK");
    setColumns([]);
    setExpression("");
  };

  const handleCreate = () => {
    if (!constraintName) {
      toast({
        title: "Validation Error",
        description: "Please provide constraint name",
        variant: "destructive",
      });
      return;
    }

    const data: any = {
      constraintType,
      constraintName,
      columns: columns.length > 0 ? columns : undefined,
      expression: expression || undefined,
    };

    createConstraintMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">Loading constraints...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Constraints</h3>
          <p className="text-sm text-muted-foreground">
            Manage table constraints to ensure data integrity
          </p>
        </div>
        <Button
          onClick={() => {
            setShowCreateDialog(true);
            soundManager.open();
          }}
          className="gap-2"
          data-testid="button-create-constraint"
        >
          <Plus className="w-4 h-4" />
          Add Constraint
        </Button>
      </div>

      <ScrollArea className="h-[400px]">
        <div className="space-y-3 pr-4">
          {constraints && constraints.length > 0 ? (
            constraints.map((constraint: any, idx: number) => (
              <Card
                key={idx}
                className="p-4 hover:shadow-md transition-all card-hover glass"
                data-testid={`constraint-${idx}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{
                        background: `linear-gradient(135deg, var(--theme-primary), var(--theme-accent))`
                      }}
                    >
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold truncate">{constraint.name}</h4>
                        <Badge variant="secondary" className="text-xs flex-shrink-0">
                          {constraint.type}
                        </Badge>
                      </div>
                      {constraint.definition && (
                        <code className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded block mt-2 break-all">
                          {constraint.definition}
                        </code>
                      )}
                      {constraint.columns && Array.isArray(constraint.columns) && (
                        <div className="flex items-center gap-1 mt-2 flex-wrap">
                          <span className="text-xs text-muted-foreground">Columns:</span>
                          {constraint.columns.map((col: string, i: number) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {col}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive flex-shrink-0"
                    onClick={() => {
                      setSelectedConstraint(constraint.name);
                      setShowDeleteDialog(true);
                      soundManager.click();
                    }}
                    data-testid={`button-delete-constraint-${idx}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              No constraints found for this table
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Create Constraint Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent data-testid="dialog-create-constraint">
          <DialogHeader>
            <DialogTitle>Add Constraint</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="constraint-name">Constraint Name</Label>
              <Input
                id="constraint-name"
                value={constraintName}
                onChange={(e) => setConstraintName(e.target.value)}
                placeholder="chk_constraint_name"
                data-testid="input-constraint-name"
              />
            </div>

            <div>
              <Label htmlFor="constraint-type">Constraint Type</Label>
              <Select value={constraintType} onValueChange={setConstraintType}>
                <SelectTrigger id="constraint-type" data-testid="select-constraint-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CHECK">CHECK</SelectItem>
                  <SelectItem value="UNIQUE">UNIQUE</SelectItem>
                  <SelectItem value="FOREIGN KEY">FOREIGN KEY</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {constraintType === "CHECK" && (
              <div>
                <Label htmlFor="expression">Check Expression</Label>
                <Input
                  id="expression"
                  value={expression}
                  onChange={(e) => setExpression(e.target.value)}
                  placeholder="column_name > 0"
                  data-testid="input-expression"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Example: age &gt; 18, price &gt;= 0
                </p>
              </div>
            )}

            {constraintType === "UNIQUE" && (
              <div>
                <Label>Columns</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {tableColumns?.map((col: any) => (
                    <div key={col.name} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`constraint-col-${col.name}`}
                        checked={columns.includes(col.name)}
                        onChange={() => {
                          setColumns(prev =>
                            prev.includes(col.name)
                              ? prev.filter(c => c !== col.name)
                              : [...prev, col.name]
                          );
                        }}
                        data-testid={`checkbox-constraint-column-${col.name}`}
                      />
                      <label
                        htmlFor={`constraint-col-${col.name}`}
                        className="text-sm cursor-pointer"
                      >
                        {col.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={createConstraintMutation.isPending}
              data-testid="button-confirm-create-constraint"
            >
              {createConstraintMutation.isPending ? "Creating..." : "Add Constraint"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Delete Constraint"
        description={`Are you sure you want to delete constraint "${selectedConstraint}"? This action cannot be undone.`}
        onConfirm={() => selectedConstraint && deleteConstraintMutation.mutate(selectedConstraint)}
        confirmText="Delete Constraint"
        variant="danger"
      />
    </div>
  );
}
