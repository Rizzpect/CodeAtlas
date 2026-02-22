export const APP_NAME = 'CodeAtlas';
export const APP_DESCRIPTION = 'AI-powered code analysis and visualization tool';

export const DEFAULT_MODELS = [
  { value: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash', description: 'Fast & efficient' },
  { value: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro', description: 'Best quality' },
  { value: 'gemini-2.0-flash', label: 'Gemini 2.0 Flash', description: 'Latest model' },
] as const;

export const ANALYSIS_STAGES = {
  cloning: { message: 'Cloning repository...', progress: 10 },
  analyzing: { message: 'Analyzing code structure...', progress: 30 },
  generating: { message: 'Generating insights...', progress: 60 },
  diagrams: { message: 'Creating diagrams...', progress: 85 },
  complete: { message: 'Analysis complete!', progress: 100 },
} as const;

export const FILE_TYPE_ICONS: Record<string, string> = {
  ts: 'typescript',
  tsx: 'typescript',
  js: 'javascript',
  jsx: 'javascript',
  py: 'python',
  java: 'java',
  go: 'go',
  rs: 'rust',
  rb: 'ruby',
  php: 'php',
  c: 'c',
  cpp: 'cpp',
  cs: 'csharp',
  swift: 'swift',
  kt: 'kotlin',
  scala: 'scala',
  html: 'html',
  css: 'css',
  scss: 'scss',
  json: 'json',
  yaml: 'yaml',
  yml: 'yaml',
  md: 'markdown',
  sql: 'sql',
  sh: 'shell',
  bash: 'shell',
  dockerfile: 'docker',
};

export const FILE_TYPE_COLORS: Record<string, string> = {
  typescript: 'text-blue-400',
  javascript: 'text-yellow-400',
  python: 'text-green-400',
  java: 'text-orange-400',
  go: 'text-cyan-400',
  rust: 'text-orange-500',
  ruby: 'text-red-400',
  php: 'text-purple-400',
  c: 'text-blue-500',
  cpp: 'text-blue-600',
  csharp: 'text-green-500',
  swift: 'text-orange-300',
  kotlin: 'text-purple-500',
  scala: 'text-red-500',
  html: 'text-orange-500',
  css: 'text-blue-400',
  scss: 'text-pink-400',
  json: 'text-yellow-300',
  yaml: 'text-pink-400',
  markdown: 'text-gray-400',
  sql: 'text-green-400',
  shell: 'text-green-500',
  docker: 'text-blue-400',
};

export const TECH_STACK_COLORS: Record<string, string> = {
  react: 'violet',
  nextjs: 'fuchsia',
  vue: 'emerald',
  angular: 'red',
  nodejs: 'green',
  python: 'blue',
  django: 'green',
  flask: 'gray',
  typescript: 'blue',
  javascript: 'yellow',
  rust: 'orange',
  go: 'cyan',
  java: 'orange',
  spring: 'green',
  docker: 'blue',
  kubernetes: 'blue',
  aws: 'yellow',
  gcp: 'blue',
  azure: 'blue',
  postgres: 'cyan',
  mongodb: 'green',
  redis: 'red',
  graphql: 'pink',
  rest: 'violet',
};

export const DIAGRAM_TYPES = [
  { id: 'architecture', label: 'Architecture', description: 'System architecture diagram' },
  { id: 'hierarchy', label: 'Hierarchy', description: 'Project structure hierarchy' },
  { id: 'dataFlow', label: 'Data Flow', description: 'Data flow diagram' },
  { id: 'classDiagram', label: 'Class Diagram', description: 'Class relationships' },
  { id: 'dependencyGraph', label: 'Dependencies', description: 'Dependency graph' },
  { id: 'mindmap', label: 'Mind Map', description: 'Concept mind map' },
] as const;

export const MAX_FILE_SIZE = 1024 * 1024;
export const MAX_FILES_TO_ANALYZE = 100;
export const CHAT_MAX_TOKENS = 8192;
export const DEBOUNCE_DELAY = 300;
export const STORAGE_KEY = 'code-atlas-storage';

export const DEFAULT_ANALYSIS_OPTIONS = {
  includeDiagrams: true,
  includeHealth: true,
  includeModules: true,
  maxDepth: 5,
} as const;

export const KEYBOARD_SHORTCUTS = {
  openChat: { key: 'k', meta: true },
  toggleSidebar: { key: 'b', meta: true },
  newAnalysis: { key: 'n', meta: true },
  search: { key: 'f', meta: true },
} as const;
