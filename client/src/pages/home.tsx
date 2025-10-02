import { useQuery } from "@tanstack/react-query";
import { Plus, Database, Table, Zap, History, Settings, Sun, Moon, Palette, Volume2, VolumeX, TrendingUp, Shield, Rocket, Activity } from "lucide-react";
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
      color: "from-blue-500 via-blue-600 to-cyan-600",
      bgColor: "bg-blue-500/10 dark:bg-blue-500/20",
      textColor: "text-blue-600 dark:text-blue-400",
    },
    {
      title: "Total Tables",
      value: "—",
      icon: Table,
      color: "from-purple-500 via-purple-600 to-pink-600",
      bgColor: "bg-purple-500/10 dark:bg-purple-500/20",
      textColor: "text-purple-600 dark:text-purple-400",
    },
    {
      title: "Recent Queries",
      value: "—",
      icon: History,
      color: "from-orange-500 via-orange-600 to-red-600",
      bgColor: "bg-orange-500/10 dark:bg-orange-500/20",
      textColor: "text-orange-600 dark:text-orange-400",
    },
    {
      title: "Performance",
      value: "Good",
      icon: Zap,
      color: "from-green-500 via-green-600 to-emerald-600",
      bgColor: "bg-green-500/10 dark:bg-green-500/20",
      textColor: "text-green-600 dark:text-green-400",
    },
  ];

  const features = [
    {
      title: "Multi-Database Support",
      description: "Connect to SQLite, PostgreSQL, and MySQL databases seamlessly",
      icon: Database,
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Real-time Performance",
      description: "Monitor query performance and optimize your database operations",
      icon: Activity,
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "Advanced Query Editor",
      description: "Execute custom SQL queries with syntax highlighting and autocomplete",
      icon: Rocket,
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "Secure & Reliable",
      description: "Enterprise-grade security with encrypted connections and backup support",
      icon: Shield,
      color: "from-orange-500 to-red-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-3xl animate-pulse opacity-20" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-accent/20 to-primary/20 rounded-full blur-3xl animate-pulse opacity-20" style={{ animationDelay: "2s" }} />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 glass-card border-b backdrop-blur-xl">
        <div className="container mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 slide-in-left">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center gradient-animated shimmer" style={{
              background: `linear-gradient(135deg, var(--theme-primary), var(--theme-accent))`
            }}>
              <Database className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold gradient-text">Omni Core DB Manager</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">{themes[themeKey].name} Theme</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 slide-in-right">
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="hover:scale-110 transition-transform"
                onClick={() => {
                  setShowThemeSelector(!showThemeSelector);
                  soundManager.click();
                }}
                data-testid="button-theme-selector"
              >
                <Palette className="w-5 h-5" />
              </Button>
              
              {showThemeSelector && (
                <div className="absolute right-0 mt-2 p-4 glass-card rounded-2xl shadow-2xl min-w-[280px] sm:min-w-[320px] animate-in z-50">
                  <p className="text-sm font-semibold mb-3">Choose Theme</p>
                  <div className="grid grid-cols-2 gap-2">
                    {(Object.keys(themes) as ThemeKey[]).map((key) => (
                      <button
                        key={key}
                        onClick={() => handleThemeChange(key)}
                        className={`p-3 rounded-xl border-2 transition-all hover:scale-105 ${
                          themeKey === key ? 'border-primary shadow-lg' : 'border-transparent hover:border-primary/50'
                        }`}
                        data-testid={`button-theme-${key}`}
                      >
                        <div className="flex gap-1 mb-2">
                          <div className="w-4 h-4 rounded-full shadow-md" style={{ background: themes[key].colors.primary }} />
                          <div className="w-4 h-4 rounded-full shadow-md" style={{ background: themes[key].colors.secondary }} />
                          <div className="w-4 h-4 rounded-full shadow-md" style={{ background: themes[key].colors.accent }} />
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
              className="hover:scale-110 transition-transform"
              onClick={handleSoundToggle}
              data-testid="button-toggle-sound"
              title={soundEnabled ? "Disable sounds" : "Enable sounds"}
            >
              {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="hover:scale-110 transition-transform"
              onClick={handleModeToggle}
              data-testid="button-toggle-mode"
            >
              {mode === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="hover:scale-110 transition-transform hidden sm:flex"
              data-testid="button-settings"
            >
              <Settings className="w-5 h-5" />
            </Button>

            <Button
              onClick={() => {
                setShowConnectionDialog(true);
                soundManager.open();
              }}
              className="gap-2 shadow-lg hover:shadow-xl transition-all hover:scale-105"
              style={{
                background: `linear-gradient(135deg, var(--theme-primary), var(--theme-accent))`
              }}
              data-testid="button-new-connection"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Connection</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 relative z-10">
        {/* Hero Section */}
        <div className="mb-12 sm:mb-16 text-center stagger-children">
          <div className="inline-block mb-4">
            <span className="px-4 py-2 rounded-full text-sm font-medium glass-card border">
              ✨ Professional Database Management
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6">
            Welcome Back! <span className="inline-block animate-bounce">👋</span>
          </h2>
          <p className="text-muted-foreground text-lg sm:text-xl max-w-2xl mx-auto">
            Manage your databases with <span className="gradient-text font-semibold">ease</span> and <span className="gradient-text font-semibold">efficiency</span>
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-16 stagger-children">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="p-6 hover:shadow-xl transition-all cursor-pointer group relative overflow-hidden glass-card border-2 hover:border-primary/50 card-3d"
              style={{ animationDelay: `${index * 0.1}s` }}
              data-testid={`card-stat-${index}`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg`}>
                    <stat.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                  </div>
                  <div className={`px-3 py-1 rounded-full ${stat.bgColor} ${stat.textColor} text-xs font-medium`}>
                    <TrendingUp className="w-3 h-3 inline mr-1" />
                    Live
                  </div>
                </div>
                <h3 className="text-3xl sm:text-4xl font-bold mb-2 group-hover:scale-105 transition-transform">{stat.value}</h3>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* Features Grid */}
        <div className="mb-12 sm:mb-16">
          <h3 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center reveal-text">
            Powerful Features at Your Fingertips
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 stagger-children">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="p-6 sm:p-8 hover:shadow-2xl transition-all cursor-pointer group glass-card border-2 hover:border-primary/50 card-hover"
                data-testid={`card-feature-${index}`}
              >
                <div className="flex gap-4 sm:gap-6">
                  <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg`}>
                    <feature.icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg sm:text-xl mb-2 group-hover:text-primary transition-colors">{feature.title}</h4>
                    <p className="text-sm sm:text-base text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Connections Section */}
        {connections && connections.length > 0 ? (
          <div className="slide-in-up">
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <h3 className="text-2xl sm:text-3xl font-bold">Your Connections</h3>
              <Button
                variant="outline"
                className="gap-2 hover:scale-105 transition-transform"
                onClick={() => {
                  setShowConnectionDialog(true);
                  soundManager.open();
                }}
              >
                <Plus className="w-4 h-4" />
                Add New
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {connections.map((conn: any, index: number) => (
                <Link key={conn.id} href={`/database/${conn.id}`}>
                  <Card
                    className="p-6 hover:shadow-2xl transition-all cursor-pointer group glass-card border-2 hover:border-primary/50 card-hover"
                    style={{ animationDelay: `${index * 0.05}s` }}
                    data-testid={`card-connection-${conn.id}`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg"
                        style={{
                          background: `linear-gradient(135deg, var(--theme-primary), var(--theme-accent))`
                        }}
                      >
                        <Database className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-lg mb-1 truncate group-hover:text-primary transition-colors">{conn.name}</h4>
                        <p className="text-sm text-muted-foreground mb-3 capitalize">{conn.type}</p>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-lg shadow-green-500/50" />
                          <span className="text-xs text-muted-foreground font-medium">Connected</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 sm:py-20 slide-in-up">
            <div
              className="w-20 h-20 sm:w-28 sm:h-28 rounded-full mx-auto mb-6 sm:mb-8 flex items-center justify-center shadow-2xl float"
              style={{
                background: `linear-gradient(135deg, var(--theme-primary-light), var(--theme-accent))`
              }}
            >
              <Database className="w-10 h-10 sm:w-14 sm:h-14 text-white" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">No Connections Yet</h3>
            <p className="text-muted-foreground text-base sm:text-lg mb-6 sm:mb-8 max-w-md mx-auto px-4">
              Get started by creating your first database connection. Connect to SQLite, PostgreSQL, or MySQL databases.
            </p>
            <Button
              onClick={() => {
                setShowConnectionDialog(true);
                soundManager.open();
              }}
              size="lg"
              className="gap-2 shadow-2xl hover:shadow-3xl transition-all hover:scale-105 text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6"
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
