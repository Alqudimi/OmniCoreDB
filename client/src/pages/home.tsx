import { useQuery } from "@tanstack/react-query";
import { Plus, Database, Table, Zap, History, Settings, Sun, Moon, Palette, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useEnhancedTheme } from "@/components/enhanced-theme-provider";
import { soundManager } from "@/lib/sounds";
import { themes, ThemeKey } from "@/lib/themes";
import { useState, useEffect } from "react";
import { ConnectionDialog } from "@/components/connection-dialog";
import { Link } from "wouter";

export default function Home() {
  const { themeKey, mode, setThemeKey, setMode } = useEnhancedTheme();
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [showConnectionDialog, setShowConnectionDialog] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("sound-enabled");
    const enabled = saved === null ? true : saved === "true";
    setSoundEnabled(enabled);
    soundManager.toggle(enabled);
  }, []);

  const { data: connections } = useQuery<any[]>({
    queryKey: ["/api/connections"],
  });

  const handleThemeChange = (key: ThemeKey) => {
    setThemeKey(key);
    soundManager.click();
    setShowThemeSelector(false);
  };

  const handleModeToggle = () => {
    setMode(mode === "dark" ? "light" : "dark");
    soundManager.click();
  };

  const handleSoundToggle = () => {
    const newValue = !soundEnabled;
    setSoundEnabled(newValue);
    soundManager.toggle(newValue);
    localStorage.setItem("sound-enabled", String(newValue));
    if (newValue) soundManager.success();
  };

  const stats = [
    {
      title: "Active Connections",
      value: connections?.length || 0,
      icon: Database,
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Total Tables",
      value: "—",
      icon: Table,
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "Recent Queries",
      value: "—",
      icon: History,
      color: "from-orange-500 to-red-500",
    },
    {
      title: "Performance",
      value: "Good",
      icon: Zap,
      color: "from-green-500 to-emerald-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 slide-in-left">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{
              background: `linear-gradient(135deg, var(--theme-primary), var(--theme-accent))`
            }}>
              <Database className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Universal DB Manager</h1>
              <p className="text-xs text-muted-foreground">{themes[themeKey].name} Theme</p>
            </div>
          </div>

          <div className="flex items-center gap-3 slide-in-right">
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setShowThemeSelector(!showThemeSelector);
                  soundManager.click();
                }}
                data-testid="button-theme-selector"
              >
                <Palette className="w-5 h-5" />
              </Button>
              
              {showThemeSelector && (
                <div className="absolute right-0 mt-2 p-3 glass rounded-xl shadow-2xl min-w-[300px] animate-in">
                  <p className="text-sm font-semibold mb-3">Choose Theme</p>
                  <div className="grid grid-cols-2 gap-2">
                    {(Object.keys(themes) as ThemeKey[]).map((key) => (
                      <button
                        key={key}
                        onClick={() => handleThemeChange(key)}
                        className={`p-3 rounded-lg border-2 transition-all hover:scale-105 ${
                          themeKey === key ? 'border-primary' : 'border-transparent'
                        }`}
                        data-testid={`button-theme-${key}`}
                      >
                        <div className="flex gap-1 mb-2">
                          <div className="w-4 h-4 rounded-full" style={{ background: themes[key].colors.primary }} />
                          <div className="w-4 h-4 rounded-full" style={{ background: themes[key].colors.secondary }} />
                          <div className="w-4 h-4 rounded-full" style={{ background: themes[key].colors.accent }} />
                        </div>
                        <p className="text-xs font-medium">{themes[key].name}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleSoundToggle}
              data-testid="button-toggle-sound"
              title={soundEnabled ? "Disable sounds" : "Enable sounds"}
            >
              {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleModeToggle}
              data-testid="button-toggle-mode"
            >
              {mode === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              data-testid="button-settings"
            >
              <Settings className="w-5 h-5" />
            </Button>

            <Button
              onClick={() => {
                setShowConnectionDialog(true);
                soundManager.open();
              }}
              className="gap-2"
              style={{
                background: `linear-gradient(135deg, var(--theme-primary), var(--theme-accent))`
              }}
              data-testid="button-new-connection"
            >
              <Plus className="w-4 h-4" />
              New Connection
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-12 slide-in-up">
          <h2 className="text-4xl font-bold mb-3">Welcome Back! 👋</h2>
          <p className="text-muted-foreground text-lg">
            Manage your databases with ease and efficiency
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="p-6 hover:shadow-xl transition-all cursor-pointer bounce-in glass"
              style={{ animationDelay: `${index * 0.1}s` }}
              data-testid={`card-stat-${index}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="text-3xl font-bold mb-1">{stat.value}</h3>
              <p className="text-sm text-muted-foreground">{stat.title}</p>
            </Card>
          ))}
        </div>

        {/* Connections Section */}
        {connections && connections.length > 0 ? (
          <div className="slide-in-up">
            <h3 className="text-2xl font-bold mb-6">Your Connections</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {connections.map((conn: any) => (
                <Link key={conn.id} href={`/database/${conn.id}`}>
                  <Card
                    className="p-6 hover:shadow-xl transition-all cursor-pointer group glass"
                    data-testid={`card-connection-${conn.id}`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className="w-14 h-14 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"
                        style={{
                          background: `linear-gradient(135deg, var(--theme-primary), var(--theme-accent))`
                        }}
                      >
                        <Database className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg mb-1">{conn.name}</h4>
                        <p className="text-sm text-muted-foreground mb-2">{conn.type}</p>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                          <span className="text-xs text-muted-foreground">Connected</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-20 slide-in-up">
            <div
              className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, var(--theme-primary-light), var(--theme-accent))`
              }}
            >
              <Database className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-3">No Connections Yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Get started by creating your first database connection. Connect to SQLite, PostgreSQL, or MySQL databases.
            </p>
            <Button
              onClick={() => {
                setShowConnectionDialog(true);
                soundManager.open();
              }}
              size="lg"
              className="gap-2"
              style={{
                background: `linear-gradient(135deg, var(--theme-primary), var(--theme-accent))`
              }}
              data-testid="button-create-first-connection"
            >
              <Plus className="w-5 h-5" />
              Create Your First Connection
            </Button>
          </div>
        )}
      </main>

      {/* Connection Dialog */}
      {showConnectionDialog && (
        <ConnectionDialog
          open={showConnectionDialog}
          onOpenChange={(open) => {
            setShowConnectionDialog(open);
            if (!open) soundManager.close();
          }}
        />
      )}
    </div>
  );
}
