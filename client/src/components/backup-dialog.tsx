import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Database, Download, Upload, RefreshCw } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { soundManager } from "@/lib/sounds";
import { Badge } from "@/components/ui/badge";

interface BackupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  connectionId: string;
}

export function BackupDialog({ open, onOpenChange, connectionId }: BackupDialogProps) {
  const [format, setFormat] = useState<'sql' | 'json'>('sql');
  const [includeSchema, setIncludeSchema] = useState(true);
  const [includeData, setIncludeData] = useState(true);
  const { toast } = useToast();

  const { data: tables } = useQuery<any[]>({
    queryKey: [`/api/connections/${connectionId}/tables`],
    enabled: open && !!connectionId,
  });

  const { data: backups, refetch } = useQuery<any[]>({
    queryKey: [`/api/connections/${connectionId}/backups`],
    enabled: open && !!connectionId,
  });

  const createBackupMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest('POST', `/api/connections/${connectionId}/backup`, data);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `backup_${Date.now()}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      return true;
    },
    onSuccess: () => {
      soundManager.success();
      toast({ title: "Success", description: "Backup created successfully" });
      refetch();
    },
    onError: (error: Error) => {
      soundManager.error();
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const handleCreateBackup = () => {
    createBackupMutation.mutate({
      format,
      includeSchema,
      includeData,
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[80vh]" data-testid="dialog-backup">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Backup & Restore
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="create" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="create" onClick={() => soundManager.click()}>
              <Download className="w-4 h-4 mr-2" />
              Create Backup
            </TabsTrigger>
            <TabsTrigger value="history" onClick={() => soundManager.click()}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Backup History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div>
                <Label>Backup Format</Label>
                <Select value={format} onValueChange={(v: any) => setFormat(v)}>
                  <SelectTrigger data-testid="select-backup-format">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sql">SQL Dump</SelectItem>
                    <SelectItem value="json">JSON</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="schema"
                  checked={includeSchema}
                  onCheckedChange={(checked) => setIncludeSchema(checked as boolean)}
                  data-testid="checkbox-include-schema"
                />
                <Label htmlFor="schema" className="cursor-pointer">Include Schema</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="data"
                  checked={includeData}
                  onCheckedChange={(checked) => setIncludeData(checked as boolean)}
                  data-testid="checkbox-include-data"
                />
                <Label htmlFor="data" className="cursor-pointer">Include Data</Label>
              </div>

              <Button
                onClick={handleCreateBackup}
                disabled={createBackupMutation.isPending}
                className="w-full"
                data-testid="button-create-backup"
              >
                <Download className="w-4 h-4 mr-2" />
                {createBackupMutation.isPending ? "Creating..." : "Create Backup"}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="history">
            <ScrollArea className="h-[400px] pr-4">
              {!backups?.length ? (
                <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                  <Database className="w-12 h-12 mb-2 opacity-50" />
                  <p>No backups yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {backups.map((backup, index) => (
                    <div
                      key={index}
                      className="p-4 border rounded-lg hover:bg-muted/50 transition-all card-hover"
                      data-testid={`backup-${index}`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold">{backup.filename}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge>{backup.format.toUpperCase()}</Badge>
                            <span className="text-sm text-muted-foreground">
                              {formatFileSize(backup.size)}
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {new Date(backup.createdAt).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
