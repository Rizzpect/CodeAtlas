"use client";

import React, { useState, useCallback, useMemo } from "react";
import { Folder, FolderOpen, File, ChevronRight, ChevronDown, FileCode, FileText, FileJson, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAppStore } from "@/store";
import type { FileNode } from "@/types";
import { FILE_TYPE_ICONS, FILE_TYPE_COLORS } from "@/lib/constants";

interface FileTreeProps {
  onFileSelect?: (file: FileNode) => void;
  className?: string;
}

export function FileTree({ onFileSelect, className }: FileTreeProps) {
  const { fileTree, selectedFile, setSelectedFile, expandedFolders, toggleFolder, expandAll, collapseAll } = useAppStore();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTree = useMemo(() => {
    if (!searchQuery.trim()) return fileTree;

    const filterNodes = (nodes: FileNode[]): FileNode[] => {
      return nodes.reduce<FileNode[]>((acc, node) => {
        if (node.type === "directory") {
          const filteredChildren = filterNodes(node.children || []);
          if (filteredChildren.length > 0 || node.name.toLowerCase().includes(searchQuery.toLowerCase())) {
            acc.push({ ...node, children: filteredChildren });
          }
        } else if (node.name.toLowerCase().includes(searchQuery.toLowerCase())) {
          acc.push(node);
        }
        return acc;
      }, []);
    };

    return filterNodes(fileTree);
  }, [fileTree, searchQuery]);

  const handleFileClick = useCallback(
    (node: FileNode) => {
      if (node.type === "directory") {
        toggleFolder(node.path);
      } else {
        setSelectedFile(node.path);
        onFileSelect?.(node);
      }
    },
    [toggleFolder, setSelectedFile, onFileSelect]
  );

  const getFileIcon = (filename: string) => {
    const ext = filename.split(".").pop()?.toLowerCase() || "";
    const type = FILE_TYPE_ICONS[ext];

    switch (type) {
      case "typescript":
      case "javascript":
        return <FileCode className="h-4 w-4" />;
      case "json":
        return <FileJson className="h-4 w-4" />;
      case "markdown":
      case "text":
        return <FileText className="h-4 w-4" />;
      default:
        return <File className="h-4 w-4" />;
    }
  };

  const getFileColor = (filename: string) => {
    const ext = filename.split(".").pop()?.toLowerCase() || "";
    const type = FILE_TYPE_ICONS[ext];
    return FILE_TYPE_COLORS[type || "text"] || "text-muted-foreground";
  };

  const renderNode = (node: FileNode, depth: number = 0) => {
    const isExpanded = expandedFolders.has(node.path);
    const isSelected = selectedFile === node.path;

    return (
      <div key={node.path}>
        <button
          onClick={() => handleFileClick(node)}
          className={cn(
            "flex w-full items-center gap-1 px-2 py-1.5 text-sm rounded-md transition-colors",
            "hover:bg-white/5",
            isSelected && "bg-primary/20 text-primary",
            !isSelected && "text-muted-foreground hover:text-foreground"
          )}
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
        >
          {node.type === "directory" ? (
            <>
              <span className="shrink-0">
                {isExpanded ? (
                  <ChevronDown className="h-3.5 w-3.5" />
                ) : (
                  <ChevronRight className="h-3.5 w-3.5" />
                )}
              </span>
              {isExpanded ? (
                <FolderOpen className="h-4 w-4 text-yellow-400" />
              ) : (
                <Folder className="h-4 w-4 text-yellow-400" />
              )}
            </>
          ) : (
            <>
              <span className="w-3.5" />
              <span className={cn("shrink-0", getFileColor(node.name))}>{getFileIcon(node.name)}</span>
            </>
          )}
          <span className="truncate">{node.name}</span>
        </button>
        {node.type === "directory" && isExpanded && node.children && (
          <div>
            {node.children.map((child) => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={cn("flex flex-col h-full", className)}>
      <div className="p-3 border-b border-border">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-white/5 border-white/10 h-9"
          />
        </div>
        <div className="flex gap-2 mt-2">
          <button
            onClick={expandAll}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Expand all
          </button>
          <span className="text-muted-foreground">·</span>
          <button
            onClick={collapseAll}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Collapse all
          </button>
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2">
          {filteredTree.length > 0 ? (
            filteredTree.map((node) => renderNode(node))
          ) : (
            <div className="text-sm text-muted-foreground p-4 text-center">
              {searchQuery ? "No files match your search" : "No files in repository"}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
