"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Github, Star, GitFork, FileCode, MessageSquare, 
  Download, Settings, ChevronLeft, ChevronRight, 
  RefreshCw, FolderTree, Layout, MessageCircle, FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { useAppStore } from "@/store";
import { cn, getLanguageColor } from "@/lib/utils";
import type { TabType } from "@/types";

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <DashboardContent />
    </Suspense>
  );
}

function DashboardLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-muted-foreground">Loading...</div>
    </div>
  );
}

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { analysis, activeTab, setActiveTab, sidebarCollapsed, setSidebarCollapsed } = useAppStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (!analysis.currentAnalysis) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">No analysis found</p>
          <Button onClick={() => router.push("/")}>Go to Home</Button>
        </div>
      </div>
    );
  }

  const { repo, summary, architecture, techStack, diagrams, codeHealth } = analysis.currentAnalysis;

  const tabs: { id: TabType; label: string; icon: any }[] = [
    { id: "overview", label: "Overview", icon: Layout },
    { id: "atlas", label: "Visual Atlas", icon: FolderTree },
    { id: "modules", label: "Modules", icon: FileCode },
    { id: "chat", label: "AI Chat", icon: MessageCircle },
    { id: "export", label: "Export", icon: Download },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarCollapsed ? 60 : 280 }}
        className="border-r border-white/5 bg-card/50 backdrop-blur-sm flex flex-col"
      >
        <div className="p-4 border-b border-white/5">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/")}
            className="w-full justify-start gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            {!sidebarCollapsed && <span>Back</span>}
          </Button>
        </div>

        {!sidebarCollapsed && (
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Github className="w-4 h-4" />
                  {repo.name}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {repo.description || "No description"}
                </p>
              </div>

              <div className="flex gap-3 text-sm">
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  {repo.stars.toLocaleString()}
                </span>
                <span className="flex items-center gap-1">
                  <GitFork className="w-4 h-4" />
                  {repo.forks.toLocaleString()}
                </span>
              </div>

              {repo.language && (
                <div className="flex items-center gap-2">
                  <span 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: getLanguageColor(repo.language) }}
                  />
                  <span className="text-sm">{repo.language}</span>
                </div>
              )}

              <div className="flex flex-wrap gap-1">
                {techStack.map((tech) => (
                  <span 
                    key={tech}
                    className="px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </ScrollArea>
        )}

        <div className="p-2 border-t border-white/5">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-full"
          >
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="border-b border-white/5 p-4 flex items-center justify-between bg-card/30 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold">{repo.fullName}</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </header>

        {/* Tabs */}
        <div className="border-b border-white/5 bg-card/20">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabType)}>
            <TabsList className="bg-transparent border-b-0 h-auto p-0">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className={cn(
                    "flex items-center gap-2 px-4 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent",
                    activeTab === tab.id ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Content */}
        <ScrollArea className="flex-1">
          <div className="p-6">
            <AnimatePresence mode="wait">
              {activeTab === "overview" && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed">{summary}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Architecture</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed">{architecture}</p>
                    </CardContent>
                  </Card>

                  {codeHealth && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Code Health</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-4 mb-4">
                          <div className={cn(
                            "text-2xl font-bold",
                            codeHealth.overall === "excellent" && "text-green-500",
                            codeHealth.overall === "good" && "text-blue-500",
                            codeHealth.overall === "needs-work" && "text-yellow-500",
                            codeHealth.overall === "poor" && "text-red-500"
                          )}>
                            {codeHealth.score}
                          </div>
                          <div className="text-muted-foreground capitalize">{codeHealth.overall}</div>
                        </div>
                        <Progress value={codeHealth.score} className="mb-4" />
                        {codeHealth.suggestions.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="font-medium">Suggestions</h4>
                            <ul className="list-disc list-inside text-sm text-muted-foreground">
                              {codeHealth.suggestions.map((suggestion, i) => (
                                <li key={i}>{suggestion}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </motion.div>
              )}

              {activeTab === "atlas" && (
                <motion.div
                  key="atlas"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold">Visual Atlas</h2>
                  <p className="text-muted-foreground">
                    Interactive diagrams and visualizations of your codebase
                  </p>
                  
                  <div className="grid gap-6">
                    {diagrams && Object.entries(diagrams).map(([key, value]) => (
                      value && (
                        <Card key={key}>
                          <CardHeader>
                            <CardTitle className="capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <pre className="p-4 rounded-lg bg-muted/50 overflow-x-auto text-sm">
                              {value}
                            </pre>
                          </CardContent>
                        </Card>
                      )
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === "modules" && (
                <motion.div
                  key="modules"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold">Module Insights</h2>
                  <p className="text-muted-foreground">
                    Folder-by-folder deep explanations
                  </p>
                  <Card>
                    <CardContent className="py-8 text-center text-muted-foreground">
                      Select a folder from the sidebar to view insights
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {activeTab === "chat" && (
                <motion.div
                  key="chat"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold">AI Chat</h2>
                  <p className="text-muted-foreground">
                    Ask questions about your codebase
                  </p>
                  <Card>
                    <CardContent className="py-8 text-center text-muted-foreground">
                      Chat feature coming soon...
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {activeTab === "export" && (
                <motion.div
                  key="export"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold">Export</h2>
                  <p className="text-muted-foreground">
                    Download your analysis in various formats
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="cursor-pointer hover:bg-accent/10 transition-colors">
                      <CardContent className="p-6 flex flex-col items-center gap-2">
                        <FileText className="w-8 h-8" />
                        <span>Markdown Report</span>
                      </CardContent>
                    </Card>
                    <Card className="cursor-pointer hover:bg-accent/10 transition-colors">
                      <CardContent className="p-6 flex flex-col items-center gap-2">
                        <Download className="w-8 h-8" />
                        <span>SVG Diagrams</span>
                      </CardContent>
                    </Card>
                    <Card className="cursor-pointer hover:bg-accent/10 transition-colors">
                      <CardContent className="p-6 flex flex-col items-center gap-2">
                        <Download className="w-8 h-8" />
                        <span>PDF Summary</span>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </ScrollArea>
      </main>
    </div>
  );
}
