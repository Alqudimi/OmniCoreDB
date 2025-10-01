import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { soundManager } from "@/lib/sounds";
import {
  Shield,
  Plus,
  Trash2,
  Play,
  AlertCircle,
  CheckCircle2,
  XCircle,
} from "lucide-react";

interface DataValidationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  connectionId: string;
  tableName?: string;
}

type ValidationType = "REQUIRED" | "UNIQUE" | "RANGE" | "PATTERN" | "CUSTOM_SQL";

export function DataValidationDialog({
  open,
  onOpenChange,
  connectionId,
  tableName,
}: DataValidationDialogProps) {
  const [validationName, setValidationName] = useState("");
  const [validationType, setValidationType] = useState<ValidationType>("REQUIRED");
  const [columnName, setColumnName] = useState("");
  const [minValue, setMinValue] = useState("");
  const [maxValue, setMaxValue] = useState("");
  const [pattern, setPattern] = useState("");
  const [customSql, setCustomSql] = useState("");
  const [enabled, setEnabled] = useState(true);
  const [selectedTable, setSelectedTable] = useState(tableName || "");
  const [validationResults, setValidationResults] = useState<any>(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: validations = [] } = useQuery<any[]>({
    queryKey: [`/api/connections/${connectionId}/validations`],
    enabled: !!connectionId && open,
  });

  const { data: tables = [] } = useQuery<any[]>({
    queryKey: [`/api/connections/${connectionId}/tables`],
    enabled: !!connectionId && open,
  });

  const { data: columns = [] } = useQuery<any[]>({
    queryKey: [`/api/connections/${connectionId}/tables/${selectedTable}/columns`],
    enabled: !!connectionId && !!selectedTable && open,
  });

  useEffect(() => {
    if (tableName) {
      setSelectedTable(tableName);
    }
  }, [tableName]);

  const createValidationMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest(
        "POST",
        `/api/connections/${connectionId}/validations`,
        data
      );
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`/api/connections/${connectionId}/validations`],
      });
      soundManager.success();
      toast({
        title: "Success",
        description: "Validation rule created successfully",
      });
      resetForm();
    },
    onError: (error: Error) => {
      soundManager.error();
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteValidationMutation = useMutation({
    mutationFn: async (validationId: string) => {
      const res = await apiRequest("DELETE", `/api/validations/${validationId}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`/api/connections/${connectionId}/validations`],
      });
      soundManager.success();
      toast({
        title: "Success",
        description: "Validation rule deleted successfully",
      });
    },
    onError: (error: Error) => {
      soundManager.error();
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const runValidationMutation = useMutation({
    mutationFn: async (table: string) => {
      const res = await apiRequest(
        "POST",
        `/api/connections/${connectionId}/tables/${table}/validate`
      );
      return res.json();
    },
    onSuccess: (data) => {
      setValidationResults(data);
      soundManager.success();
      toast({
        title: "Validation Complete",
        description: `Found ${data.results?.length || 0} validation issues`,
      });
    },
    onError: (error: Error) => {
      soundManager.error();
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setValidationName("");
    setValidationType("REQUIRED");
    setColumnName("");
    setMinValue("");
    setMaxValue("");
    setPattern("");
    setCustomSql("");
    setEnabled(true);
  };

  const handleSubmit = () => {
    if (!validationName || !selectedTable || !columnName) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const data: any = {
      ruleName: validationName,
      tableName: selectedTable,
      columnName,
      validationType,
      enabled,
    };

    if (validationType === "RANGE") {
      data.minValue = minValue ? parseFloat(minValue) : undefined;
      data.maxValue = maxValue ? parseFloat(maxValue) : undefined;
    } else if (validationType === "PATTERN") {
      data.pattern = pattern;
    } else if (validationType === "CUSTOM_SQL") {
      data.sqlExpression = customSql;
    }

    createValidationMutation.mutate(data);
  };

  const tableValidations = validations.filter(
    (v) => v.tableName === selectedTable
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Data Validation & Integrity
          </DialogTitle>
          <DialogDescription>
            Define validation rules to ensure data quality and integrity
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="rules" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="rules" data-testid="tab-validation-rules">
              Validation Rules
            </TabsTrigger>
            <TabsTrigger value="create" data-testid="tab-create-rule">
              Create Rule
            </TabsTrigger>
            <TabsTrigger value="test" data-testid="tab-test-rules">
              Test & Results
            </TabsTrigger>
          </TabsList>

          <TabsContent value="rules" className="space-y-4 mt-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">Active Validation Rules</h3>
                <p className="text-sm text-muted-foreground">
                  {validations.length} rule(s) defined
                </p>
              </div>
              <Select value={selectedTable} onValueChange={setSelectedTable}>
                <SelectTrigger className="w-[200px]" data-testid="select-table">
                  <SelectValue placeholder="Select table" />
                </SelectTrigger>
                <SelectContent>
                  {tables.map((table: any) => (
                    <SelectItem key={table.name} value={table.name}>
                      {table.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {tableValidations.length === 0 ? (
              <Card className="p-8 text-center">
                <Shield className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h4 className="text-lg font-semibold mb-2">No Validation Rules</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedTable
                    ? `No validation rules defined for ${selectedTable}`
                    : "Select a table to view its validation rules"}
                </p>
              </Card>
            ) : (
              <div className="grid gap-3">
                {tableValidations.map((validation: any) => (
                  <Card
                    key={validation.id}
                    className="p-4 hover:shadow-md transition-shadow"
                    data-testid={`validation-rule-${validation.id}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">{validation.ruleName}</h4>
                          <Badge variant={validation.enabled ? "default" : "secondary"}>
                            {validation.enabled ? "Enabled" : "Disabled"}
                          </Badge>
                          <Badge variant="outline">{validation.validationType}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Column: <span className="font-medium">{validation.columnName}</span>
                        </p>
                        {validation.validationType === "RANGE" && (
                          <p className="text-sm text-muted-foreground">
                            Range: {validation.minValue ?? "∞"} to {validation.maxValue ?? "∞"}
                          </p>
                        )}
                        {validation.validationType === "PATTERN" && (
                          <p className="text-sm text-muted-foreground">
                            Pattern: {validation.pattern}
                          </p>
                        )}
                        {validation.validationType === "CUSTOM_SQL" && (
                          <p className="text-sm text-muted-foreground font-mono text-xs">
                            {validation.sqlExpression}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          deleteValidationMutation.mutate(validation.id);
                          soundManager.click();
                        }}
                        data-testid={`button-delete-validation-${validation.id}`}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="create" className="space-y-4 mt-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="table">Table *</Label>
                <Select value={selectedTable} onValueChange={setSelectedTable}>
                  <SelectTrigger id="table" data-testid="input-validation-table">
                    <SelectValue placeholder="Select table" />
                  </SelectTrigger>
                  <SelectContent>
                    {tables.map((table: any) => (
                      <SelectItem key={table.name} value={table.name}>
                        {table.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="ruleName">Rule Name *</Label>
                <Input
                  id="ruleName"
                  value={validationName}
                  onChange={(e) => setValidationName(e.target.value)}
                  placeholder="e.g., Check Email Format"
                  data-testid="input-rule-name"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="validationType">Validation Type *</Label>
                <Select
                  value={validationType}
                  onValueChange={(value: ValidationType) => setValidationType(value)}
                >
                  <SelectTrigger id="validationType" data-testid="select-validation-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="REQUIRED">Required (Not NULL)</SelectItem>
                    <SelectItem value="UNIQUE">Unique Values</SelectItem>
                    <SelectItem value="RANGE">Numeric Range</SelectItem>
                    <SelectItem value="PATTERN">Pattern Match (Regex)</SelectItem>
                    <SelectItem value="CUSTOM_SQL">Custom SQL Expression</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="column">Column *</Label>
                <Select
                  value={columnName}
                  onValueChange={setColumnName}
                  disabled={!selectedTable}
                >
                  <SelectTrigger id="column" data-testid="select-column">
                    <SelectValue placeholder="Select column" />
                  </SelectTrigger>
                  <SelectContent>
                    {columns.map((col: any) => (
                      <SelectItem key={col.name} value={col.name}>
                        {col.name} ({col.type})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {validationType === "RANGE" && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="minValue">Min Value</Label>
                    <Input
                      id="minValue"
                      type="number"
                      value={minValue}
                      onChange={(e) => setMinValue(e.target.value)}
                      placeholder="Minimum"
                      data-testid="input-min-value"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="maxValue">Max Value</Label>
                    <Input
                      id="maxValue"
                      type="number"
                      value={maxValue}
                      onChange={(e) => setMaxValue(e.target.value)}
                      placeholder="Maximum"
                      data-testid="input-max-value"
                    />
                  </div>
                </div>
              )}

              {validationType === "PATTERN" && (
                <div className="grid gap-2">
                  <Label htmlFor="pattern">Regex Pattern</Label>
                  <Input
                    id="pattern"
                    value={pattern}
                    onChange={(e) => setPattern(e.target.value)}
                    placeholder="e.g., ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                    data-testid="input-pattern"
                  />
                </div>
              )}

              {validationType === "CUSTOM_SQL" && (
                <div className="grid gap-2">
                  <Label htmlFor="customSql">SQL Expression</Label>
                  <Input
                    id="customSql"
                    value={customSql}
                    onChange={(e) => setCustomSql(e.target.value)}
                    placeholder="e.g., LENGTH(email) > 5"
                    data-testid="input-custom-sql"
                  />
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Switch
                  id="enabled"
                  checked={enabled}
                  onCheckedChange={setEnabled}
                  data-testid="switch-enabled"
                />
                <Label htmlFor="enabled">Enable this rule</Label>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={resetForm}
                data-testid="button-reset-form"
              >
                Reset
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={createValidationMutation.isPending}
                className="gap-2"
                data-testid="button-create-validation"
              >
                <Plus className="w-4 h-4" />
                Create Validation Rule
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="test" className="space-y-4 mt-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">Test Validation Rules</h3>
                <p className="text-sm text-muted-foreground">
                  Run validation checks on table data
                </p>
              </div>
              <div className="flex gap-2">
                <Select value={selectedTable} onValueChange={setSelectedTable}>
                  <SelectTrigger className="w-[200px]" data-testid="select-test-table">
                    <SelectValue placeholder="Select table" />
                  </SelectTrigger>
                  <SelectContent>
                    {tables.map((table: any) => (
                      <SelectItem key={table.name} value={table.name}>
                        {table.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  onClick={() => {
                    if (selectedTable) {
                      runValidationMutation.mutate(selectedTable);
                      soundManager.click();
                    }
                  }}
                  disabled={!selectedTable || runValidationMutation.isPending}
                  className="gap-2"
                  data-testid="button-run-validation"
                >
                  <Play className="w-4 h-4" />
                  Run Validation
                </Button>
              </div>
            </div>

            {validationResults ? (
              <div className="space-y-4">
                <Card className="p-4">
                  <div className="flex items-center gap-3 mb-4">
                    {validationResults.results?.length === 0 ? (
                      <>
                        <CheckCircle2 className="w-6 h-6 text-green-500" />
                        <div>
                          <h4 className="font-semibold text-green-700 dark:text-green-400">
                            All Validations Passed
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            No validation issues found
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-6 h-6 text-red-500" />
                        <div>
                          <h4 className="font-semibold text-red-700 dark:text-red-400">
                            Validation Issues Found
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {validationResults.results?.length} validation(s) failed
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </Card>

                {validationResults.results && validationResults.results.length > 0 && (
                  <div className="grid gap-3">
                    {validationResults.results.map((result: any, index: number) => (
                      <Card key={index} className="p-4" data-testid={`validation-result-${index}`}>
                        <div className="flex items-start gap-3">
                          <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5" />
                          <div className="flex-1">
                            <h4 className="font-semibold mb-1">{result.ruleName}</h4>
                            <p className="text-sm text-muted-foreground mb-2">
                              {result.violationCount} violation(s) found
                            </p>
                            {result.sampleViolations && result.sampleViolations.length > 0 && (
                              <div className="mt-2 p-3 bg-muted rounded-lg">
                                <p className="text-xs font-semibold mb-2">Sample Violations:</p>
                                <div className="space-y-1">
                                  {result.sampleViolations.slice(0, 3).map((sample: any, idx: number) => (
                                    <p key={idx} className="text-xs font-mono">
                                      {JSON.stringify(sample)}
                                    </p>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <Play className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h4 className="text-lg font-semibold mb-2">No Results Yet</h4>
                <p className="text-sm text-muted-foreground">
                  Select a table and click "Run Validation" to test your rules
                </p>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false);
              soundManager.close();
            }}
            data-testid="button-close-validation"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
