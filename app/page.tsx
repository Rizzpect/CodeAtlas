"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Github, Sparkles, Globe, Zap, FileText, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppStore } from "@/store";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [url, setUrl] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { setApiKey: saveApiKey, setAnalyzing, setProgress } = useAppStore();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAnalyze = async () => {
    if (!url.trim()) {
      toast.error("Please enter a GitHub repository URL");
      return;
    }
    if (!apiKey.trim()) {
      toast.error("Please enter your Gemini API key");
      return;
    }

    setIsLoading(true);
    saveApiKey(apiKey);
    setAnalyzing(true);
    setProgress({ stage: "analyzing", message: "Starting analysis...", progress: 0 });

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, apiKey }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Analysis failed");
      }

      useAppStore.getState().setAnalysis(data);
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Analysis failed");
      setAnalyzing(false);
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    { icon: Globe, title: "Interactive Atlas", description: "Explore repositories through stunning visualizations" },
    { icon: Zap, title: "AI-Powered", description: "Gemini AI generates crystal-clear explanations" },
    { icon: FileText, title: "Smart Summaries", description: "Get executive summaries and architecture overviews" },
    { icon: MessageSquare, title: "AI Chat", description: "Ask questions about any part of the codebase" },
  ];

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background">
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-atlas-purple/20 via-background to-background" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
          <div className="relative container mx-auto px-4 py-24 md:py-32">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">AI-Powered Repository Analysis</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                Turn any GitHub repo into an{" "}
                <span className="text-gradient">interactive atlas</span>{" "}
                in seconds
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                Paste any GitHub URL, enter your Gemini API key, and get stunning 
                visualizations, crystal-clear explanations, and an AI assistant that knows your code.
              </p>
              <div className="max-w-xl mx-auto mb-8">
                <Card className="glass border-white/10">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="relative">
                        <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          placeholder="https://github.com/owner/repo"
                          value={url}
                          onChange={(e) => setUrl(e.target.value)}
                          className="pl-10 h-12 bg-white/5 border-white/10"
                        />
                      </div>
                      <div className="relative">
                        <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          type="password"
                          placeholder="Enter your Gemini API key"
                          value={apiKey}
                          onChange={(e) => setApiKey(e.target.value)}
                          className="pl-10 h-12 bg-white/5 border-white/10"
                        />
                      </div>
                      <Button 
                        onClick={handleAnalyze} 
                        disabled={isLoading}
                        className="w-full h-12 text-lg glow"
                      >
                        {isLoading ? "Analyzing..." : "Analyze Repository"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <p className="text-sm text-muted-foreground">
                Only Gemini API key required. Everything else is free.
              </p>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="glass-hover border-white/5 h-full">
                <CardHeader>
                  <feature.icon className="w-10 h-10 mb-2 text-primary" />
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">See CodeAtlas in Action</h2>
            <p className="text-muted-foreground">Watch as your repository transforms into an interactive knowledge map</p>
          </div>
          <div className="relative rounded-xl overflow-hidden border border-white/10 aspect-video max-w-4xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-br from-atlas-purple/10 to-atlas-cyan/10" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                  <Github className="w-10 h-10 text-primary" />
                </div>
                <p className="text-muted-foreground">Interactive demo placeholder</p>
              </div>
            </div>
          </div>
        </div>
        <footer className="border-t border-white/5 py-8">
          <div className="container mx-auto px-4 text-center text-muted-foreground">
            <p>© 2024 CodeAtlas. Built with Next.js and Gemini AI.</p>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-atlas-purple/20 via-background to-background" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative container mx-auto px-4 py-24 md:py-32"
        >
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">AI-Powered Repository Analysis</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="text-4xl md:text-6xl font-bold tracking-tight mb-6"
            >
              Turn any GitHub repo into an{" "}
              <span className="text-gradient">interactive atlas</span>{" "}
              in seconds
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto"
            >
              Paste any GitHub URL, enter your Gemini API key, and get stunning 
              visualizations, crystal-clear explanations, and an AI assistant that knows your code.
            </motion.p>

            {/* Input Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="max-w-xl mx-auto mb-8"
            >
              <Card className="glass border-white/10">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="relative">
                      <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        placeholder="https://github.com/owner/repo"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="pl-10 h-12 bg-white/5 border-white/10"
                      />
                    </div>
                    <div className="relative">
                      <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        type="password"
                        placeholder="Enter your Gemini API key"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        className="pl-10 h-12 bg-white/5 border-white/10"
                      />
                    </div>
                    <Button 
                      onClick={handleAnalyze} 
                      disabled={isLoading}
                      className="w-full h-12 text-lg glow"
                    >
                      {isLoading ? "Analyzing..." : "Analyze Repository"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-sm text-muted-foreground"
            >
              Only Gemini API key required. Everything else is free.
            </motion.p>
          </div>
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Card className="glass-hover border-white/5 h-full">
                <CardHeader>
                  <feature.icon className="w-10 h-10 mb-2 text-primary" />
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Demo Section */}
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">See CodeAtlas in Action</h2>
          <p className="text-muted-foreground">Watch as your repository transforms into an interactive knowledge map</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-xl overflow-hidden border border-white/10 aspect-video max-w-4xl mx-auto"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-atlas-purple/10 to-atlas-cyan/10" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center animate-pulse">
                <Github className="w-10 h-10 text-primary" />
              </div>
              <p className="text-muted-foreground">Interactive demo placeholder</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2024 CodeAtlas. Built with Next.js and Gemini AI.</p>
        </div>
      </footer>
    </div>
  );
}
