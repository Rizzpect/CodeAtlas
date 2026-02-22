"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  GitBranch,
  Network,
  Workflow,
  TreeDeciduous,
  Box,
  GitGraph,
  Lightbulb,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Copy,
  Check,
  RefreshCw,
} from "lucide-react";
import { DIAGRAM_TYPES } from "@/lib/constants";
import type { Diagrams } from "@/types";

interface DiagramViewerProps {
  diagrams?: Diagrams;
  className?: string;
}

const diagramIcons: Record<string, React.ElementType> = {
  architecture: Network,
  hierarchy: TreeDeciduous,
  dataFlow: Workflow,
  classDiagram: Box,
  dependencyGraph: GitGraph,
  mindmap: Lightbulb,
};

export function DiagramViewer({ diagrams, className }: DiagramViewerProps) {
  const { currentDiagram, setCurrentDiagram, addToDiagramHistory, diagramHistory } = useAppStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("preview");

  const diagramData = diagrams ? Object.entries(diagrams).filter(([, value]) => value) : [];
  const currentDiagramContent = currentDiagram || diagramData[0]?.[1] || "";

  useEffect(() => {
    if (diagramData.length > 0 && !currentDiagram) {
      setCurrentDiagram(diagramData[0][1] || null);
    }
  }, [diagrams, currentDiagram, setCurrentDiagram]);

  const handleZoomIn = () => setScale((s) => Math.min(s + 0.25, 3));
  const handleZoomOut = () => setScale((s) => Math.max(s - 0.25, 0.5));
  const handleResetZoom = () => setScale(1);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(currentDiagramContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRefresh = () => {
    setScale(1);
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
      containerRef.current.scrollLeft = 0;
    }
  };

  if (!diagrams || diagramData.length === 0) {
    return (
      <Card className={cn("glass-glass", className)}>
        <CardContent className="flex items-center justify-center h-[400px] text-muted-foreground">
          <div className="text-center">
            <GitBranch className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No diagrams available</p>
            <p className="text-sm mt-1">Run analysis to generate diagrams</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("glass-glass overflow-hidden", className)}>
      <CardHeader className="pb-3 border-b border-border">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <GitBranch className="h-5 w-5 text-primary" />
            Diagrams
          </CardTitle>
          <div className="flex items-center gap-1">
            <Badge variant="secondary" className="text-xs">
              {diagramData.length} diagram{diagramData.length !== 1 ? "s" : ""}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex items-center justify-between px-4 pt-3">
            <TabsList className="bg-white/5">
              <TabsTrigger value="preview" className="text-xs">
                Preview
              </TabsTrigger>
              <TabsTrigger value="code" className="text-xs">
                Mermaid Code
              </TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-1">
              <button
                onClick={handleZoomOut}
                className="p-1.5 rounded hover:bg-white/10 transition-colors"
                title="Zoom out"
              >
                <ZoomOut className="h-4 w-4" />
              </button>
              <span className="text-xs text-muted-foreground w-12 text-center">
                {Math.round(scale * 100)}%
              </span>
              <button
                onClick={handleZoomIn}
                className="p-1.5 rounded hover:bg-white/10 transition-colors"
                title="Zoom in"
              >
                <ZoomIn className="h-4 w-4" />
              </button>
              <Separator orientation="vertical" className="h-4 mx-1" />
              <button
                onClick={handleResetZoom}
                className="p-1.5 rounded hover:bg-white/10 transition-colors"
                title="Reset zoom"
              >
                <Maximize2 className="h-4 w-4" />
              </button>
              <button
                onClick={handleRefresh}
                className="p-1.5 rounded hover:bg-white/10 transition-colors"
                title="Reset view"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
          </div>

          <TabsContent value="preview" className="m-0">
            <ScrollArea className="h-[500px]" ref={containerRef}>
              <div
                className="p-6 flex justify-center"
                style={{ transform: `scale(${scale})`, transformOrigin: "top center" }}
              >
                <div className="w-full max-w-4xl">
                  <MermaidRenderer code={currentDiagramContent} />
                </div>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="code" className="m-0">
            <div className="relative">
              <button
                onClick={handleCopy}
                className="absolute top-3 right-3 p-2 rounded-md bg-white/10 hover:bg-white/20 transition-colors"
                title="Copy code"
              >
                {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
              </button>
              <ScrollArea className="h-[500px]">
                <pre className="p-4 text-sm text-muted-foreground font-mono overflow-x-auto">
                  <code>{currentDiagramContent}</code>
                </pre>
              </ScrollArea>
            </div>
          </TabsContent>
        </Tabs>

        <Separator />

        <div className="p-3 border-t border-border">
          <div className="flex flex-wrap gap-2">
            {diagramData.map(([key, value]) => {
              if (!value) return null;
              const Icon = diagramIcons[key] || GitBranch;
              const isActive = currentDiagramContent === value;
              return (
                <button
                  key={key}
                  onClick={() => {
                    setCurrentDiagram(value);
                    addToDiagramHistory(value);
                  }}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-all",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {DIAGRAM_TYPES.find((d) => d.id === key)?.label || key}
                </button>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function MermaidRenderer({ code }: { code: string }) {
  const [svg, setSvg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const renderDiagram = async () => {
      if (!code) return;
      
      try {
        const mermaid = await import("mermaid");
        mermaid.default.initialize({
          startOnLoad: false,
          theme: "dark",
          themeVariables: {
            primaryColor: "#a855f7",
            primaryTextColor: "#fff",
            primaryBorderColor: "#a855f7",
            lineColor: "#6b7280",
            secondaryColor: "#3b82f6",
            tertiaryColor: "#1e293b",
            background: "#0f172a",
            mainBkg: "#1e293b",
            nodeBorder: "#475569",
            clusterBkg: "#1e293b",
            clusterBorder: "#475569",
            titleColor: "#f1f5f9",
            edgeLabelBackground: "#1e293b",
          },
          flowchart: {
            curve: "basis",
            padding: 20,
          },
          sequence: {
            actorMargin: 50,
            boxMargin: 10,
            boxTextMargin: 5,
            noteMargin: 10,
            messageMargin: 35,
          },
        });

        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
        const { svg } = await mermaid.default.render(id, code);
        setSvg(svg);
        setError(null);
      } catch (err) {
        console.error("Mermaid render error:", err);
        setError(err instanceof Error ? err.message : "Failed to render diagram");
      }
    };

    renderDiagram();
  }, [code]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-[400px] text-muted-foreground">
        <div className="text-center">
          <p className="text-destructive">Failed to render diagram</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  if (!svg) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="animate-pulse text-muted-foreground">Loading diagram...</div>
      </div>
    );
  }

  return (
    <div
      className="mermaid-container"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
