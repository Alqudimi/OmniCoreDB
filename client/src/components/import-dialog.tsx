import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { FileJson, FileText, Upload } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  connectionId: string;
  tableName: string;
}

export function ImportDialog({ 
  open, 
  onOpenChange, 
  connectionId, 
  tableName 
}: ImportDialogProps) {
  const [format, setFormat] = useState<'csv' | 'json'>('json');
  const [data, setData] = useState('');
  const [importResult, setImportResult] = useState<{ imported: number; errors: string[] } | null>(null);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const importMutation = useMutation({
    mutationFn: async (payload: { format: string; data: string }) => {
      const res = await apiRequest('POST', `/api/connections/${connectionId}/tables/${tableName}/import`, payload);
      return res.json();
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['/api/connections', connectionId, 'tables', tableName, 'rows'] });
      queryClient.invalidateQueries({ queryKey: ['/api/connections', connectionId, 'tables'] });
      
      setImportResult(result);
      
      if (result.errors.length === 0) {
        toast({
          title: "Success",
          description: `Successfully imported ${result.imported} rows`,
        });
      } else {
        toast({
          title: "Partial Success",
          description: `Imported ${result.imported} rows with ${result.errors.length} errors`,
          variant: "destructive",
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Import Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleImport = () => {
    if (!data.trim()) {
      toast({
        title: "Validation Error",
        description: "Please provide data to import",
        variant: "destructive",
      });
      return;
    }

    importMutation.mutate({ format, data });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setData(content);
      
      if (file.name.endsWith('.csv')) {
        setFormat('csv');
      } else if (file.name.endsWith('.json')) {
        setFormat('json');
      }
    };
    reader.readAsText(file);
  };

  const resetDialog = () => {
    setData('');
    setImportResult(null);
  };

  return (
    <Dialog open={open} onOpenChange={(open) => {
      onOpenChange(open);
      if (!open) resetDialog();
    }}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto" data-testid="dialog-import">
        <DialogHeader>
          <DialogTitle>Import Data</DialogTitle>
          <DialogDescription>
            Import data into {tableName} from CSV or JSON format
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <Label className="text-sm font-medium mb-2 block">Format</Label>
            <div className="flex gap-2">
              <Button
                variant={format === 'json' ? "default" : "outline"}
                className="flex-1"
                onClick={() => setFormat('json')}
                data-testid="button-format-json"
              >
                <FileJson className="mr-2 h-4 w-4" />
                JSON
              </Button>
              <Button
                variant={format === 'csv' ? "default" : "outline"}
                className="flex-1"
                onClick={() => setFormat('csv')}
                data-testid="button-format-csv"
              >
                <FileText className="mr-2 h-4 w-4" />
                CSV
              </Button>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium mb-2 block">
              Upload File or Paste Data
            </Label>
            <input
              type="file"
              accept=".json,.csv"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
              data-testid="input-file-upload"
            />
            <label htmlFor="file-upload">
              <Button
                variant="outline"
                className="w-full"
                asChild
                data-testid="button-upload-file"
              >
                <span>
                  <Upload className="mr-2 h-4 w-4" />
                  Choose File
                </span>
              </Button>
            </label>
          </div>

          <div>
            <Label htmlFor="data" className="text-sm font-medium mb-2 block">
              Data
            </Label>
            <Textarea
              id="data"
              placeholder={format === 'json' 
                ? '[{"column1": "value1", "column2": "value2"}]'
                : 'column1,column2\nvalue1,value2'}
              value={data}
              onChange={(e) => setData(e.target.value)}
              className="font-mono text-sm min-h-[300px]"
              data-testid="textarea-import-data"
            />
            <p className="text-xs text-muted-foreground mt-1.5">
              {format === 'json' 
                ? 'Paste JSON array of objects or upload a .json file'
                : 'Paste CSV data with headers or upload a .csv file'}
            </p>
          </div>

          {importResult && (
            <Alert>
              <AlertDescription>
                <div className="space-y-1">
                  <p className="font-medium">
                    Successfully imported {importResult.imported} rows
                  </p>
                  {importResult.errors.length > 0 && (
                    <div className="mt-2">
                      <p className="font-medium text-destructive">
                        {importResult.errors.length} errors:
                      </p>
                      <ul className="text-xs mt-1 space-y-0.5 max-h-32 overflow-y-auto">
                        {importResult.errors.slice(0, 10).map((error, i) => (
                          <li key={i} className="text-muted-foreground">• {error}</li>
                        ))}
                        {importResult.errors.length > 10 && (
                          <li className="text-muted-foreground">
                            ... and {importResult.errors.length - 10} more errors
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} data-testid="button-cancel">
            Cancel
          </Button>
          <Button 
            onClick={handleImport}
            disabled={importMutation.isPending || !data.trim()}
            data-testid="button-import"
          >
            {importMutation.isPending ? (
              <>Importing...</>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Import Data
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
