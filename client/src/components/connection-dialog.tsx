import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Database, FileText, Link2 } from "lucide-react";

interface ConnectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type DBType = 'sqlite' | 'postgresql' | 'mysql' | 'mongodb' | 'auto' | null;
type ConnectionMethod = 'file' | 'string';

export function ConnectionDialog({ open, onOpenChange }: ConnectionDialogProps) {
  const [selectedType, setSelectedType] = useState<DBType>('auto');
  const [connectionMethod, setConnectionMethod] = useState<ConnectionMethod>('file');
  const [filePath, setFilePath] = useState('');
  const [connectionString, setConnectionString] = useState('');
  const [connectionName, setConnectionName] = useState('');
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createConnectionMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest('POST', '/api/connections', data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/connections'] });
      toast({
        title: "Success",
        description: "Database connection created successfully",
      });
      onOpenChange(false);
      resetForm();
    },
    onError: (error: Error) => {
      toast({
        title: "Connection Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setSelectedType('auto');
    setConnectionMethod('file');
    setFilePath('');
    setConnectionString('');
    setConnectionName('');
  };

  const handleConnect = () => {
    const data: any = {
      type: selectedType === 'auto' ? undefined : selectedType,
      name: connectionName || undefined,
    };

    if (connectionMethod === 'file') {
      if (!filePath) {
        toast({
          title: "Validation Error",
          description: "Please enter a file path",
          variant: "destructive",
        });
        return;
      }
      data.filePath = filePath;
    } else {
      if (!connectionString) {
        toast({
          title: "Validation Error",
          description: "Please enter a connection string",
          variant: "destructive",
        });
        return;
      }
      data.connectionString = connectionString;
    }

    createConnectionMutation.mutate(data);
  };

  const dbTypes = [
    { id: 'auto', name: 'Auto Detect', icon: Database },
    { id: 'sqlite', name: 'SQLite', icon: Database },
    { id: 'postgresql', name: 'PostgreSQL', icon: Database },
    { id: 'mysql', name: 'MySQL', icon: Database },
    { id: 'mongodb', name: 'MongoDB', icon: Database },
  ] as const;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl" data-testid="dialog-connection">
        <DialogHeader>
          <DialogTitle>New Database Connection</DialogTitle>
          <DialogDescription>
            Connect to SQLite, PostgreSQL, MySQL, or MongoDB
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Database Type Selection */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Database Type</Label>
            <div className="grid grid-cols-5 gap-2">
              {dbTypes.map((type) => (
                <Button
                  key={type.id}
                  variant={selectedType === type.id ? "default" : "outline"}
                  className="p-3 h-auto flex flex-col items-center gap-2"
                  onClick={() => setSelectedType(type.id as DBType)}
                  data-testid={`button-dbtype-${type.id}`}
                >
                  <type.icon className="h-5 w-5" />
                  <span className="text-sm font-medium">{type.name}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Connection Method */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Connection Method</Label>
            <div className="flex gap-2">
              <Button
                variant={connectionMethod === 'file' ? "default" : "outline"}
                className="flex-1"
                onClick={() => setConnectionMethod('file')}
                data-testid="button-method-file"
              >
                <FileText className="mr-2 h-4 w-4" />
                File Path
              </Button>
              <Button
                variant={connectionMethod === 'string' ? "default" : "outline"}
                className="flex-1"
                onClick={() => setConnectionMethod('string')}
                data-testid="button-method-string"
              >
                <Link2 className="mr-2 h-4 w-4" />
                Connection String
              </Button>
            </div>
          </div>

          {/* File Path or Connection String Input */}
          {connectionMethod === 'file' ? (
            <div>
              <Label htmlFor="filePath" className="text-sm font-medium mb-2 block">
                Database File Path
              </Label>
              <Input
                id="filePath"
                type="text"
                placeholder="/path/to/database.db"
                value={filePath}
                onChange={(e) => setFilePath(e.target.value)}
                className="font-mono"
                data-testid="input-filepath"
              />
              <p className="text-xs text-muted-foreground mt-1.5">
                The system will automatically detect the database type from the file
              </p>
            </div>
          ) : (
            <div>
              <Label htmlFor="connectionString" className="text-sm font-medium mb-2 block">
                Connection String
              </Label>
              <Input
                id="connectionString"
                type="text"
                placeholder="postgresql://user:password@localhost:5432/database"
                value={connectionString}
                onChange={(e) => setConnectionString(e.target.value)}
                className="font-mono"
                data-testid="input-connectionstring"
              />
            </div>
          )}

          {/* Connection Name */}
          <div>
            <Label htmlFor="connectionName" className="text-sm font-medium mb-2 block">
              Connection Name (Optional)
            </Label>
            <Input
              id="connectionName"
              type="text"
              placeholder="My App Database"
              value={connectionName}
              onChange={(e) => setConnectionName(e.target.value)}
              data-testid="input-connectionname"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} data-testid="button-cancel">
            Cancel
          </Button>
          <Button 
            onClick={handleConnect} 
            disabled={createConnectionMutation.isPending}
            data-testid="button-connect"
          >
            {createConnectionMutation.isPending ? (
              <>Connecting...</>
            ) : (
              <>
                <Database className="mr-2 h-4 w-4" />
                Connect
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
