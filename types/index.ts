export interface Repository {
  owner: string;
  name: string;
  fullName: string;
  description: string | null;
  stars: number;
  forks: number;
  language: string | null;
  topics: string[];
  url: string;
  defaultBranch: string;
}

export interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  size?: number;
  children?: FileNode[];
  content?: string;
}

export interface AnalysisProgress {
  stage: 'cloning' | 'analyzing' | 'generating' | 'diagrams' | 'complete' | 'error';
  message: string;
  progress: number;
}

export interface RepoAnalysis {
  id: string;
  repo: Repository;
  summary: string;
  architecture: string;
  techStack: string[];
  diagrams: Diagrams;
  fileInsights: FileInsight[];
  modules: ModuleInsight[];
  codeHealth?: CodeHealth;
  createdAt: string;
}

export interface Diagrams {
  architecture?: string;
  hierarchy?: string;
  dataFlow?: string;
  classDiagram?: string;
  dependencyGraph?: string;
  mindmap?: string;
}

export interface FileInsight {
  path: string;
  summary: string;
  explanation: string;
  language: string;
  lines: number;
}

export interface ModuleInsight {
  path: string;
  summary: string;
  files: string[];
  purpose: string;
}

export interface CodeHealth {
  overall: 'excellent' | 'good' | 'needs-work' | 'poor';
  score: number;
  issues: HealthIssue[];
  suggestions: string[];
}

export interface HealthIssue {
  severity: 'info' | 'warning' | 'error';
  category: string;
  message: string;
  file?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: ChatSource[];
  timestamp: string;
}

export interface ChatSource {
  file: string;
  relevance: number;
  excerpt?: string;
}

export interface AnalysisState {
  isAnalyzing: boolean;
  progress: AnalysisProgress | null;
  currentAnalysis: RepoAnalysis | null;
  error: string | null;
}

export interface ChatState {
  messages: ChatMessage[];
  isStreaming: boolean;
}

export interface SettingsState {
  apiKey: string;
  model: 'gemini-1.5-pro' | 'gemini-1.5-flash' | 'gemini-2.0-flash';
  githubToken: string;
}

export type TabType = 'overview' | 'atlas' | 'modules' | 'chat' | 'export';
