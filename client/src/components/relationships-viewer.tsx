import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link2, ArrowRight, Table as TableIcon, Key } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface RelationshipsViewerProps {
  connectionId: string;
  tableName?: string;
}

export function RelationshipsViewer({ connectionId, tableName }: RelationshipsViewerProps) {
  const { data: relationships, isLoading } = useQuery<any[]>({
    queryKey: [`/api/connections/${connectionId}/relationships`, { tableName }],
    enabled: !!connectionId,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Link2 className="w-8 h-8 text-primary" />
          </div>
          <p className="text-muted-foreground">Loading relationships...</p>
        </div>
      </div>
    );
  }

  if (!relationships || relationships.length === 0) {
    return (
      <div className="text-center py-12">
        <div
          className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center"
          style={{
            background: `linear-gradient(135deg, var(--theme-primary-light), var(--theme-accent))`
          }}
        >
          <Link2 className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No Relationships Found</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          {tableName
            ? `Table "${tableName}" has no foreign key relationships defined.`
            : "No foreign key relationships are defined in this database."}
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[500px]">
      <div className="space-y-4 pr-4">
        <div className="text-sm text-muted-foreground mb-4">
          Found {relationships.length} relationship{relationships.length !== 1 ? 's' : ''}
        </div>

        {relationships.map((rel: any, index: number) => (
          <Card
            key={index}
            className="p-5 hover:shadow-lg transition-all card-hover glass"
            data-testid={`relationship-${index}`}
          >
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: `linear-gradient(135deg, var(--theme-primary), var(--theme-accent))`
                }}
              >
                <Link2 className="w-6 h-6 text-white" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center gap-2 bg-muted px-3 py-1.5 rounded-lg">
                    <TableIcon className="w-4 h-4 text-primary" />
                    <span className="font-semibold text-sm">{rel.sourceTable}</span>
                  </div>

                  <ArrowRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />

                  <div className="flex items-center gap-2 bg-muted px-3 py-1.5 rounded-lg">
                    <TableIcon className="w-4 h-4 text-primary" />
                    <span className="font-semibold text-sm">{rel.targetTable}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Key className="w-3.5 h-3.5 text-muted-foreground" />
                    <code className="px-2 py-0.5 bg-muted rounded text-xs font-mono">
                      {rel.sourceColumn}
                    </code>
                    <span className="text-muted-foreground">→</span>
                    <code className="px-2 py-0.5 bg-muted rounded text-xs font-mono">
                      {rel.targetColumn}
                    </code>
                  </div>

                  {rel.constraintName && (
                    <Badge variant="outline" className="text-xs">
                      {rel.constraintName}
                    </Badge>
                  )}
                </div>

                {rel.onUpdate || rel.onDelete ? (
                  <div className="flex gap-3 mt-3 text-xs">
                    {rel.onUpdate && (
                      <Badge variant="secondary" className="text-xs">
                        ON UPDATE: {rel.onUpdate}
                      </Badge>
                    )}
                    {rel.onDelete && (
                      <Badge variant="secondary" className="text-xs">
                        ON DELETE: {rel.onDelete}
                      </Badge>
                    )}
                  </div>
                ) : null}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}
