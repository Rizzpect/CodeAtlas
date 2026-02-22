import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
  const patterns = [
    /github\.com\/([^\/]+)\/([^\/]+)/,
    /github\.com\/([^\/]+)\/([^\/]+?)(?:\.git)?$/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return { owner: match[1], repo: match[2].replace(/\.git$/, '') };
    }
  }
  return null;
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

export function getLanguageColor(language: string | null): string {
  const colors: Record<string, string> = {
    JavaScript: '#f1e05a',
    TypeScript: '#3178c6',
    Python: '#3572A5',
    Java: '#b07219',
    Go: '#00ADD8',
    Rust: '#dea584',
    Ruby: '#701516',
    PHP: '#4F5D95',
    'C++': '#f34b7d',
    C: '#555555',
    'C#': '#178600',
    Swift: '#ffac45',
    Kotlin: '#A97BFF',
    Dart: '#00B4AB',
    HTML: '#e34c26',
    CSS: '#563d7c',
    Vue: '#41b883',
    Shell: '#89e051',
    Markdown: '#083fa1',
    JSON: '#292929',
  };
  return colors[language || ''] || '#6e7681';
}

export function getFileExtension(filename: string): string {
  const parts = filename.split('.');
  return parts.length > 1 ? parts.pop()!.toLowerCase() : '';
}

export function getLanguageFromExtension(ext: string): string {
  const map: Record<string, string> = {
    js: 'JavaScript',
    jsx: 'JavaScript',
    ts: 'TypeScript',
    tsx: 'TypeScript',
    py: 'Python',
    java: 'Java',
    go: 'Go',
    rs: 'Rust',
    rb: 'Ruby',
    php: 'PHP',
    cpp: 'C++',
    c: 'C',
    cs: 'C#',
    swift: 'Swift',
    kt: 'Kotlin',
    dart: 'Dart',
    html: 'HTML',
    css: 'CSS',
    vue: 'Vue',
    sh: 'Shell',
    bash: 'Shell',
    md: 'Markdown',
    json: 'JSON',
    yaml: 'YAML',
    yml: 'YAML',
    xml: 'XML',
    sql: 'SQL',
    graphql: 'GraphQL',
  };
  return map[ext] || 'Unknown';
}
