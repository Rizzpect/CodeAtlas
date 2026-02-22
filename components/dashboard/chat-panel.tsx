"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Send, 
  Trash2, 
  Copy, 
  Check, 
  Bot, 
  User, 
  Loader2, 
  FileText, 
  X,
  Sparkles,
  MessageSquare
} from "lucide-react";
import type { ChatMessage } from "@/types";

interface ChatPanelProps {
  className?: string;
}

export function ChatPanel({ className }: ChatPanelProps) {
  const { 
    chat, 
    addMessage, 
    setStreaming, 
    clearChat, 
    chatPanelOpen, 
    setChatPanelOpen,
    analysis 
  } = useAppStore();
  
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat.messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [input]);

  const handleCopy = async (content: string, id: string) => {
    await navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    const trimmedInput = input.trim();
    if (!trimmedInput || isLoading) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      role: "user",
      content: trimmedInput,
      timestamp: new Date().toISOString(),
    };

    addMessage(userMessage);
    setInput("");
    setIsLoading(true);
    setStreaming(true);

    const assistantMessage: ChatMessage = {
      id: `msg-${Date.now()}-assistant`,
      role: "assistant",
      content: "",
      timestamp: new Date().toISOString(),
    };
    addMessage(assistantMessage);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmedInput,
          history: chat.messages,
          repoContext: analysis.currentAnalysis ? {
            summary: analysis.currentAnalysis.summary,
            techStack: analysis.currentAnalysis.techStack,
            architecture: analysis.currentAnalysis.architecture,
          } : null,
        }),
      });

      if (!response.ok) throw new Error("Failed to get response");

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response body");

      const decoder = new TextDecoder();
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        
        const lines = chunk.split("\n").filter((line) => line.trim());
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") continue;
            
            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                const currentMessages = useAppStore.getState().chat.messages;
                const lastMessage = currentMessages[currentMessages.length - 1];
                if (lastMessage?.role === "assistant") {
                  useAppStore.setState({
                    chat: {
                      ...useAppStore.getState().chat,
                      messages: [
                        ...currentMessages.slice(0, -1),
                        { ...lastMessage, content: lastMessage.content + parsed.content },
                      ],
                    },
                  });
                }
              }
            } catch {
              // Skip invalid JSON
            }
          }
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: ChatMessage = {
        id: `msg-${Date.now()}-error`,
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date().toISOString(),
      };
      addMessage(errorMessage);
    } finally {
      setIsLoading(false);
      setStreaming(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  if (!chatPanelOpen) {
    return (
      <Button
        onClick={() => setChatPanelOpen(true)}
        className={cn("fixed bottom-4 right-4 h-12 w-12 rounded-full shadow-lg", className)}
        size="icon"
      >
        <MessageSquare className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <Card className={cn("fixed bottom-4 right-4 w-[400px] h-[600px] glass-glass flex flex-col", className)}>
      <CardContent className="p-0 flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="font-semibold">AI Assistant</span>
            {analysis.currentAnalysis && (
              <Badge variant="secondary" className="text-xs">
                {analysis.currentAnalysis.techStack.slice(0, 2).join(", ")}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={clearChat}
              className="h-8 w-8"
              title="Clear chat"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setChatPanelOpen(false)}
              className="h-8 w-8"
              title="Close"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1 p-4">
          {chat.messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
              <Bot className="h-12 w-12 mb-4 opacity-50" />
              <p className="font-medium">How can I help you?</p>
              <p className="text-sm mt-1">
                Ask about the codebase, architecture, or any specific files
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {chat.messages.map((message) => (
                <ChatMessageItem
                  key={message.id}
                  message={message}
                  onCopy={handleCopy}
                  copiedId={copiedId}
                />
              ))}
              {chat.isStreaming && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Thinking...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </ScrollArea>

        <Separator />

        <form onSubmit={handleSubmit} className="p-4">
          <div className="relative">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about the codebase..."
              className="pr-12 min-h-[60px] max-h-[150px] bg-white/5 border-white/10 resize-none"
              disabled={isLoading}
            />
            <Button
              type="submit"
              size="icon"
              className="absolute right-2 bottom-2 h-8 w-8"
              disabled={!input.trim() || isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Press Enter to send, Shift+Enter for new line
          </p>
        </form>
      </CardContent>
    </Card>
  );
}

interface ChatMessageItemProps {
  message: ChatMessage;
  onCopy: (content: string, id: string) => void;
  copiedId: string | null;
}

function ChatMessageItem({ message, onCopy, copiedId }: ChatMessageItemProps) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex gap-3", isUser ? "flex-row-reverse" : "flex-row")}>
      <div
        className={cn(
          "shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
          isUser ? "bg-primary/20" : "bg-secondary"
        )}
      >
        {isUser ? (
          <User className="h-4 w-4 text-primary" />
        ) : (
          <Bot className="h-4 w-4 text-secondary-foreground" />
        )}
      </div>
      <div
        className={cn(
          "flex-1 max-w-[80%]",
          isUser ? "items-end" : "items-start"
        )}
      >
        <div
          className={cn(
            "rounded-lg px-4 py-2",
            isUser
              ? "bg-primary text-primary-foreground"
              : "bg-white/5"
          )}
        >
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        </div>
        <div className={cn("flex items-center gap-2 mt-1", isUser ? "justify-end" : "justify-start")}>
          <button
            onClick={() => onCopy(message.content, message.id)}
            className="p-1 rounded hover:bg-white/10 transition-colors"
            title="Copy"
          >
            {copiedId === message.id ? (
              <Check className="h-3 w-3 text-green-400" />
            ) : (
              <Copy className="h-3 w-3 text-muted-foreground" />
            )}
          </button>
          <span className="text-xs text-muted-foreground">
            {new Date(message.timestamp).toLocaleTimeString()}
          </span>
        </div>
        {message.sources && message.sources.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {message.sources.map((source, i) => (
              <Badge
                key={i}
                variant="outline"
                className="text-xs cursor-pointer hover:bg-white/10"
              >
                <FileText className="h-3 w-3 mr-1" />
                {source.file}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
